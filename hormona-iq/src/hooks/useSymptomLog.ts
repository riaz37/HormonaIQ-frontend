// useSymptomLog — Zustand-backed implementation for mock-data mode.
// Delegates directly to useLogStore; no WatermelonDB dependency.

import { useCallback } from 'react';
import { useLogStore, type NewLogEntry, type LogEntry } from '../stores/useLogStore';

export interface UseSymptomLog {
  saveLog: (entry: NewLogEntry) => Promise<void>;
  getLogForDate: (date: string) => Promise<LogEntry | null>;
}

export function useSymptomLog(): UseSymptomLog {
  const addEntry = useLogStore((s) => s.addEntry);
  const updateEntry = useLogStore((s) => s.updateEntry);
  const getEntryForDate = useLogStore((s) => s.getEntryForDate);

  const saveLog = useCallback(async (entry: NewLogEntry): Promise<void> => {
    const existing = getEntryForDate(entry.date);
    if (existing) {
      updateEntry(existing.id, entry);
    } else {
      addEntry(entry);
    }
  }, [addEntry, updateEntry, getEntryForDate]);

  const getLogForDate = useCallback(async (date: string): Promise<LogEntry | null> => {
    return getEntryForDate(date) ?? null;
  }, [getEntryForDate]);

  return { saveLog, getLogForDate };
}
