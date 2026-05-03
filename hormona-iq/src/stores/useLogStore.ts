// useLogStore — daily DRSP log entries (one entry per ISO date).
// Persisted to AsyncStorage under key 'hormona-log-store'.

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LogEntry {
  id: string;
  date: string; // YYYY-MM-DD
  drspScores: Record<string, number>; // symptom key → 0-6
  mood: number | null; // 0-10
  energy: number | null; // 0-10
  pain: number | null; // NRS 0-10
  physicalSymptoms: readonly string[];
  notes: string;
  createdAt: string; // ISO datetime
}

export type NewLogEntry = Omit<LogEntry, 'id' | 'createdAt'>;

export interface LogState {
  entries: readonly LogEntry[];
}

export interface LogActions {
  addEntry: (entry: NewLogEntry) => LogEntry;
  updateEntry: (id: string, patch: Partial<LogEntry>) => void;
  removeEntry: (id: string) => void;
  getEntryForDate: (date: string) => LogEntry | undefined;
  clear: () => void;
}

export type LogStore = LogState & LogActions;

const INITIAL_STATE: LogState = {
  entries: [],
};

// Lightweight ID generator (nanoid not installed); collision-resistant enough
// for client-side log entries on a single device.
function makeId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export const useLogStore = create<LogStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      addEntry: (entry) => {
        const newEntry: LogEntry = {
          ...entry,
          id: makeId(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ entries: [...state.entries, newEntry] }));
        return newEntry;
      },

      updateEntry: (id, patch) => {
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, ...patch } : e,
          ),
        }));
      },

      removeEntry: (id) => {
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        }));
      },

      getEntryForDate: (date) => {
        return get().entries.find((e) => e.date === date);
      },

      clear: () => set(() => ({ ...INITIAL_STATE })),
    }),
    {
      name: 'hormona-log-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ entries: state.entries }),
      version: 1,
    },
  ),
);
