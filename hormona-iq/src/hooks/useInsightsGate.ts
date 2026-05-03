// useInsightsGate — checks whether the user has logged enough cycle data
// to unlock the DRSP insights / C-PASS report.
//
// Extracted from insights.tsx:
//   const cycleAnalysis = useMemo(() => computeCycleAnalysis(...), [...])
//   const gateMet = cycleAnalysis.completedCycles >= 2
//
// completedCycles requires, per cycle:
//   - 7+ consecutive luteal-phase days logged
//   - 5+ consecutive follicular-phase days logged
//   - meanItemsPerDay >= 4
//
// This hook surfaces the gate result without pulling in the full C-PASS
// computation.  A lightweight proxy is used: count of logged days that
// fall within a luteal or follicular window across the last three cycles,
// and derive how many more days are needed to hit 2 qualified cycles.

import { useMemo } from 'react';
import { useLogStore } from '../stores/useLogStore';
import { useAppStore } from '../stores/useAppStore';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface InsightsGateResult {
  hasEnoughData: boolean;
  cyclesLogged: number;
  minimumRequired: number;
  daysUntilUnlocked: number | null;
}

// ─────────────────────────────────────────────
// Constants (from insights.tsx)
// ─────────────────────────────────────────────

const MINIMUM_CYCLES_REQUIRED = 2;

// Mirrors computeCycleAnalysis thresholds from insights.tsx
const MIN_LUTEAL_CONSECUTIVE  = 7;
const MIN_FOL_CONSECUTIVE     = 5;
const MIN_ITEMS_PER_DAY       = 4;

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function maxConsecutive(dateList: readonly string[]): number {
  if (!dateList.length) return 0;
  const sorted = [...dateList].sort();
  let max = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = Math.round(
      (new Date(sorted[i]).getTime() - new Date(sorted[i - 1]).getTime()) / 86400000,
    );
    if (diff === 1) {
      run++;
      max = Math.max(max, run);
    } else {
      run = 1;
    }
  }
  return max;
}

interface CycleQualification {
  qualifies: boolean;
  lutealConsecutive: number;
  folConsecutive: number;
}

function qualifyCycle(
  entries: ReadonlyMap<string, number>,  // date → item count
  cycleStart: Date,
  cycleLen: number,
): CycleQualification {
  const lutealStart = new Date(cycleStart);
  lutealStart.setDate(lutealStart.getDate() + cycleLen - 7);
  const cycleEnd = new Date(cycleStart);
  cycleEnd.setDate(cycleEnd.getDate() + cycleLen - 1);

  const folStart = new Date(cycleStart);
  folStart.setDate(folStart.getDate() + 3);
  const folEnd = new Date(cycleStart);
  folEnd.setDate(folEnd.getDate() + 9);

  const lutealDates: string[] = [];
  const folDates: string[] = [];
  let totalItems = 0;
  let totalDays  = 0;

  for (let d = 0; d < cycleLen; d++) {
    const day = new Date(cycleStart);
    day.setDate(day.getDate() + d);
    const key = day.toISOString().slice(0, 10);
    const itemCount = entries.get(key);
    if (itemCount == null) continue;

    totalDays++;
    totalItems += itemCount;

    if (day >= lutealStart && day <= cycleEnd) lutealDates.push(key);
    if (day >= folStart && day <= folEnd)      folDates.push(key);
  }

  const lutealConsecutive = maxConsecutive(lutealDates);
  const folConsecutive    = maxConsecutive(folDates);
  const meanItems         = totalDays > 0 ? totalItems / totalDays : 0;

  const qualifies =
    lutealConsecutive >= MIN_LUTEAL_CONSECUTIVE &&
    folConsecutive    >= MIN_FOL_CONSECUTIVE    &&
    meanItems         >= MIN_ITEMS_PER_DAY;

  return { qualifies, lutealConsecutive, folConsecutive };
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

export function useInsightsGate(): InsightsGateResult {
  const logEntries = useLogStore((s) => s.entries);
  const cycleLen   = useAppStore((s) => s.cycleLen);
  const lastPeriod = useAppStore((s) => s.lastPeriod);

  return useMemo<InsightsGateResult>(() => {
    if (!lastPeriod) {
      return {
        hasEnoughData: false,
        cyclesLogged: 0,
        minimumRequired: MINIMUM_CYCLES_REQUIRED,
        daysUntilUnlocked: null,
      };
    }

    // Build a map of date → number of scored DRSP items (proxy for meanItemsPerDay).
    const itemCountMap = new Map<string, number>();
    for (const entry of logEntries) {
      const count = Object.values(entry.drspScores).filter(
        (v): v is number => typeof v === 'number',
      ).length;
      itemCountMap.set(entry.date, count);
    }

    let completedCycles = 0;

    // Analyse up to 3 historical cycles (same window as insights.tsx).
    for (let i = 0; i < 3; i++) {
      const cycleStart = new Date(lastPeriod);
      cycleStart.setDate(cycleStart.getDate() - i * cycleLen);
      const { qualifies } = qualifyCycle(itemCountMap, cycleStart, cycleLen);
      if (qualifies) completedCycles++;
    }

    const hasEnoughData = completedCycles >= MINIMUM_CYCLES_REQUIRED;

    // Estimate days still needed.  Use the current cycle's shortfall.
    let daysUntilUnlocked: number | null = null;
    if (!hasEnoughData) {
      const currentCycleStart = new Date(lastPeriod);
      const { lutealConsecutive, folConsecutive } = qualifyCycle(
        itemCountMap,
        currentCycleStart,
        cycleLen,
      );
      const lutealShortfall = Math.max(0, MIN_LUTEAL_CONSECUTIVE - lutealConsecutive);
      const folShortfall    = Math.max(0, MIN_FOL_CONSECUTIVE    - folConsecutive);
      daysUntilUnlocked = lutealShortfall + folShortfall;
    }

    return {
      hasEnoughData,
      cyclesLogged: completedCycles,
      minimumRequired: MINIMUM_CYCLES_REQUIRED,
      daysUntilUnlocked,
    };
  }, [logEntries, cycleLen, lastPeriod]);
}
