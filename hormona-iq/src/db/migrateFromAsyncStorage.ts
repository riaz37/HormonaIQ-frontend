// One-time migration: copy persisted Zustand log entries from AsyncStorage
// into WatermelonDB. Idempotent — guarded by `wdb_migration_v1_done` flag.
// Requires: npx expo install @nozbe/watermelondb expo-build-properties

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Q } from '@nozbe/watermelondb';

import { database } from './index';
import type { SymptomLog as SymptomLogModel } from './index';

const ZUSTAND_KEY = 'hormona-log-store';
const DONE_KEY = 'wdb_migration_v1_done';

interface PersistedLogEntry {
  id: string;
  date: string;
  drspScores: Record<string, number>;
  mood: number | null;
  energy: number | null;
  pain: number | null;
  physicalSymptoms: readonly string[];
  notes: string;
  createdAt: string;
}

interface PersistedShape {
  state?: { entries?: PersistedLogEntry[] };
}

function parsePersisted(raw: string | null): PersistedLogEntry[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as PersistedShape;
    return Array.isArray(parsed.state?.entries) ? parsed.state!.entries! : [];
  } catch {
    return [];
  }
}

export async function migrateFromAsyncStorage(): Promise<void> {
  try {
    const done = await AsyncStorage.getItem(DONE_KEY);
    if (done === '1') return;

    const raw = await AsyncStorage.getItem(ZUSTAND_KEY);
    const entries = parsePersisted(raw);

    if (entries.length === 0) {
      await AsyncStorage.setItem(DONE_KEY, '1');
      return;
    }

    const collection = database.get<SymptomLogModel>('symptom_logs');

    await database.write(async () => {
      for (const entry of entries) {
        const existing = await collection
          .query(Q.where('log_date', entry.date))
          .fetch();
        if (existing.length > 0) continue;

        const createdMs = Date.parse(entry.createdAt);
        const ts = Number.isFinite(createdMs) ? createdMs : Date.now();

        await collection.create((rec) => {
          rec.logDate = entry.date;
          rec.cycleDay = null;
          rec.cyclePhase = null;
          rec.drspScoresRaw = JSON.stringify(entry.drspScores ?? {});
          rec.physicalSymptomsRaw = JSON.stringify(entry.physicalSymptoms ?? []);
          rec.sleepQuality = null;
          rec.energyLevel = entry.energy;
          rec.functionalImpairment = null;
          rec.spotting = false;
          rec.fastLog = false;
          rec.crisisFlag = false;
          rec.badDayOnly = false;
          rec.freeTextNote = entry.notes ?? null;
          rec.updatedAt = new Date(ts);
          rec.serverId = null;
        });
      }
    });

    await AsyncStorage.setItem(DONE_KEY, '1');
  } catch (error) {
    // Non-fatal — leave the flag unset so we can retry on next launch.
    // eslint-disable-next-line no-console
    console.warn('[migrateFromAsyncStorage] failed', error);
  }
}
