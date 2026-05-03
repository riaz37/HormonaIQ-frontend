// useDRSPEntry — encapsulates the DRSP rating state extracted from log.tsx.
//
// In log.tsx the ratings live in:
//   const [drsp, setDrsp] = useState<DrspScores>({ ... })
//   const setSym = (key, n) => setDrsp(prev => ({ ...prev, [key]: n }))
//   save() → persists to useLogStore via addEntry / updateEntry
//
// This hook owns that state and exposes a clean interface.

import { useCallback, useMemo, useState } from 'react';
import { useLogStore } from '../stores/useLogStore';
import type { NewLogEntry } from '../stores/useLogStore';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface DRSPEntryResult {
  ratings: Record<string, number>;
  setRating: (symptomId: string, value: number) => void;
  resetRatings: () => void;
  totalScore: number;
  canSubmit: boolean;
  submit: () => void;
}

// ─────────────────────────────────────────────
// Constants (from log.tsx)
// ─────────────────────────────────────────────

// Minimum number of rated items before the entry is considered submittable.
// Mirrors log.tsx: the save button is always shown, but we gate canSubmit on
// at least one item being rated (i.e. the vibe check).
const MIN_ITEMS_TO_SUBMIT = 1;

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

export function useDRSPEntry(): DRSPEntryResult {
  const addEntry      = useLogStore((s) => s.addEntry);
  const getEntryForDate = useLogStore((s) => s.getEntryForDate);
  const updateEntry   = useLogStore((s) => s.updateEntry);

  const todayKey = new Date().toISOString().slice(0, 10);

  // Seed from any existing persisted entry for today (mirrors log.tsx hydration).
  const [ratings, setRatings] = useState<Record<string, number>>(() => {
    const persisted = getEntryForDate(todayKey);
    return persisted?.drspScores ? { ...persisted.drspScores } : {};
  });

  // Immutable update: set one rating.
  const setRating = useCallback((symptomId: string, value: number): void => {
    setRatings((prev) => ({ ...prev, [symptomId]: value }));
  }, []);

  // Reset all ratings to empty.
  const resetRatings = useCallback((): void => {
    setRatings({});
  }, []);

  // Sum of all rated values (mirrors log.tsx SI check: siVal >= 3 / >= 5).
  const totalScore = useMemo(
    () => Object.values(ratings).reduce((acc, v) => acc + v, 0),
    [ratings],
  );

  const canSubmit = Object.keys(ratings).length >= MIN_ITEMS_TO_SUBMIT;

  // Persist to the log store (mirrors log.tsx save()).
  const submit = useCallback((): void => {
    if (!canSubmit) return;

    const existing = getEntryForDate(todayKey);

    const payload: NewLogEntry = {
      date: todayKey,
      drspScores: { ...ratings },
      mood: null,
      energy: null,
      pain: null,
      physicalSymptoms: [],
      notes: '',
    };

    if (existing) {
      updateEntry(existing.id, payload);
    } else {
      addEntry(payload);
    }
  }, [canSubmit, ratings, todayKey, getEntryForDate, addEntry, updateEntry]);

  return {
    ratings,
    setRating,
    resetRatings,
    totalScore,
    canSubmit,
    submit,
  };
}
