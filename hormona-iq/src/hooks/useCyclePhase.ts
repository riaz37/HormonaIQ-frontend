// useCyclePhase — derives current cycle phase, day, and next-phase ETA
// from the persisted app store + src/lib/phase.ts.
//
// Logic ported from:
//   - home.tsx: phaseToCode(), PHASE_FILL, PHASE_NAMES, cycleDay/cycleLen/irregular usage
//   - cycle.tsx: phaseCodeForDay(), todayCycleDay calculation, segment boundaries

import { useMemo } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { phaseForDay } from '../lib/phase';
import type { Phase } from '../lib/phase';
import { colors } from '../constants/tokens';

// ─────────────────────────────────────────────
// Canonical phase code → narrowed interface Phase
// ─────────────────────────────────────────────

export type CyclePhase =
  | 'follicular'
  | 'ovulatory'
  | 'luteal'
  | 'menstrual'
  | null;

export interface CyclePhaseResult {
  phase: CyclePhase;
  dayOfCycle: number | null;
  cycleLength: number;
  daysUntilNextPhase: number | null;
  phaseLabel: string;
  phaseColor: string;
}

// ─────────────────────────────────────────────
// Phase boundary helpers (mirrored from home.tsx / cycle.tsx)
// ─────────────────────────────────────────────

function computeCycleDay(lastPeriod: Date, cycleLen: number): number {
  const today = Date.now();
  const diff = Math.floor((today - lastPeriod.getTime()) / 86400000);
  // Keep within current cycle via modulo
  return ((diff % cycleLen) + cycleLen) % cycleLen + 1;
}

/**
 * Collapse the 5-phase Phase type onto the 4-phase CyclePhase interface.
 * 'luteal' and 'luteal-late' both map to 'luteal'. 'unknown' → null.
 */
function toCyclePhase(p: Phase): CyclePhase {
  switch (p) {
    case 'follicular': return 'follicular';
    case 'ovulatory':  return 'ovulatory';
    case 'luteal':
    case 'luteal-late': return 'luteal';
    case 'menstrual':  return 'menstrual';
    default:           return null;
  }
}

const PHASE_LABELS: Record<NonNullable<CyclePhase>, string> = {
  follicular: 'Follicular',
  ovulatory:  'Ovulatory',
  luteal:     'Luteal',
  menstrual:  'Menstrual',
};

const PHASE_COLORS_MAP: Record<NonNullable<CyclePhase>, string> = {
  follicular: colors.sageLight,
  ovulatory:  colors.butter,
  luteal:     colors.coralSoft,
  menstrual:  colors.rose,
};

/**
 * Estimate how many days until the next phase boundary.
 * Uses the same proportional thresholds as phaseForDay (phase.ts).
 */
function daysUntilNext(cycleDay: number, cycleLen: number): number | null {
  const c = cycleLen;
  const fEnd  = Math.round(c * 0.45);
  const oEnd  = Math.round(c * 0.55);
  const lmEnd = Math.round(c * 0.78);
  const mEnd  = c; // last menstrual day wraps around

  if (cycleDay <= 5)       return Math.max(0, 6 - cycleDay);          // → follicular
  if (cycleDay <= fEnd)    return Math.max(0, fEnd - cycleDay + 1);   // → ovulatory
  if (cycleDay <= oEnd)    return Math.max(0, oEnd - cycleDay + 1);   // → luteal
  if (cycleDay <= lmEnd)   return Math.max(0, lmEnd - cycleDay + 1);  // → late luteal
  if (cycleDay <= mEnd)    return Math.max(0, mEnd - cycleDay + 1);   // → next menstrual
  return null;
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

export function useCyclePhase(): CyclePhaseResult {
  const cycleLen   = useAppStore((s) => s.cycleLen);
  const lastPeriod = useAppStore((s) => s.lastPeriod);
  const conditions = useAppStore((s) => s.conditions);

  const irregular = conditions.includes('PCOS');

  return useMemo<CyclePhaseResult>(() => {
    if (!lastPeriod) {
      return {
        phase: null,
        dayOfCycle: null,
        cycleLength: cycleLen,
        daysUntilNextPhase: null,
        phaseLabel: 'Variable',
        phaseColor: colors.mintMist,
      };
    }

    const dayOfCycle = computeCycleDay(lastPeriod, cycleLen);

    if (irregular) {
      return {
        phase: null,
        dayOfCycle,
        cycleLength: cycleLen,
        daysUntilNextPhase: null,
        phaseLabel: 'Variable',
        phaseColor: colors.mintMist,
      };
    }

    const rawPhase  = phaseForDay(dayOfCycle, cycleLen);
    const phase     = toCyclePhase(rawPhase);
    const phaseLabel  = phase ? PHASE_LABELS[phase] : 'Unknown';
    const phaseColor  = phase ? PHASE_COLORS_MAP[phase] : colors.mintMist;
    const daysUntilNextPhase = daysUntilNext(dayOfCycle, cycleLen);

    return {
      phase,
      dayOfCycle,
      cycleLength: cycleLen,
      daysUntilNextPhase,
      phaseLabel,
      phaseColor,
    };
  }, [lastPeriod, cycleLen, irregular]);
}
