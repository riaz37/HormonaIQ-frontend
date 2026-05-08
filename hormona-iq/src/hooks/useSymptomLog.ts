// useSymptomLog — wraps WatermelonDB writes/reads for the daily symptom log.
// Maps the Zustand `LogEntry` shape onto the `symptom_logs` table.
// Requires: npx expo install @nozbe/watermelondb expo-build-properties

import { useCallback } from 'react';
import { Q } from '@nozbe/watermelondb';

import { database } from '../db';
import type { SymptomLog as SymptomLogModel } from '../db';
import type { NewLogEntry } from '../stores/useLogStore';

export interface UseSymptomLog {
  saveLog: (entry: NewLogEntry) => Promise<void>;
  getLogForDate: (date: string) => Promise<SymptomLogModel | null>;
}

function getCollection() {
  return database.get<SymptomLogModel>('symptom_logs');
}

async function findByDate(date: string): Promise<SymptomLogModel | null> {
  try {
    const results = await getCollection()
      .query(Q.where('log_date', date))
      .fetch();
    return results[0] ?? null;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('[useSymptomLog] findByDate failed', error);
    return null;
  }
}

export function useSymptomLog(): UseSymptomLog {
  const saveLog = useCallback(async (entry: NewLogEntry): Promise<void> => {
    try {
      const drspRaw = JSON.stringify(entry.drspScores ?? {});
      const physicalRaw = JSON.stringify(entry.physicalSymptoms ?? []);
      const note = entry.notes ?? null;
      const energy = entry.energy;
      const now = Date.now();

      await database.write(async () => {
        const existing = await findByDate(entry.date);
        if (existing) {
          await existing.update((rec) => {
            rec.drspScoresRaw = drspRaw;
            rec.physicalSymptomsRaw = physicalRaw;
            rec.energyLevel = energy;
            rec.freeTextNote = note;
            rec.updatedAt = new Date(now);
          });
          return;
        }

        await getCollection().create((rec) => {
          rec.logDate = entry.date;
          rec.cycleDay = null;
          rec.cyclePhase = null;
          rec.drspScoresRaw = drspRaw;
          rec.physicalSymptomsRaw = physicalRaw;
          rec.sleepQuality = null;
          rec.energyLevel = energy;
          rec.functionalImpairment = null;
          rec.spotting = false;
          rec.fastLog = false;
          rec.crisisFlag = false;
          rec.badDayOnly = false;
          rec.freeTextNote = note;
          rec.updatedAt = new Date(now);
          rec.serverId = null;
        });
      });
    } catch (error) {
      // Swallow + log — Zustand remains the source of truth for UI reads.
      // eslint-disable-next-line no-console
      console.warn('[useSymptomLog] saveLog failed', error);
    }
  }, []);

  const getLogForDate = useCallback(async (date: string): Promise<SymptomLogModel | null> => {
    return findByDate(date);
  }, []);

  return { saveLog, getLogForDate };
}
