// phase.ts — Port of phaseForDay() from shared.jsx (T-49)
// Pure TypeScript, no React dependencies, no side effects.

export type Phase =
  | 'follicular'
  | 'ovulatory'
  | 'luteal'
  | 'luteal-late'
  | 'menstrual'
  | 'unknown';

export interface PhaseOptions {
  /** PCOS / irregular mode: return 'unknown' for any day */
  pcosIrregular?: boolean;
  /** Optional cycle variance — reserved for future use */
  cycleVariance?: number;
}

// ─────────────────────────────────────────────
// Phase colour map — matches shared.jsx PHASE_COLORS
// Keys: F, O, L, Lm, Ls, M
// ─────────────────────────────────────────────
export const PHASE_COLORS: Readonly<Record<string, string>> = {
  F:  'var(--phase-follicular)',
  O:  'var(--phase-ovulatory)',
  L:  'var(--phase-luteal)',           // legacy alias = early luteal
  Lm: 'var(--phase-luteal)',
  Ls: 'var(--phase-luteal-deep)',
  M:  'var(--phase-menstrual)',
} as const;

// ─────────────────────────────────────────────
// Phase display names — matches shared.jsx PHASE_NAMES
// ─────────────────────────────────────────────
export const PHASE_NAMES: Readonly<Record<string, string>> = {
  F:   'Follicular',
  O:   'Ovulatory',
  L:   'Luteal',
  Lm:  'Early luteal',
  Ls:  'Late luteal',
  M:   'Menstrual',
  '?': 'Variable',
} as const;

// ─────────────────────────────────────────────
// Phase vibes — matches shared.jsx PHASE_VIBES
// ─────────────────────────────────────────────
export interface PhaseVibe {
  word: string;
  icon: string;
}

export const PHASE_VIBES: Readonly<Record<string, PhaseVibe>> = {
  F:   { word: 'Follicular',   icon: '🌱' },
  O:   { word: 'Peak',         icon: '☀️' },
  L:   { word: 'Luteal',       icon: '🍂' },
  Lm:  { word: 'Luteal',       icon: '🌗' },
  Ls:  { word: 'Late luteal',  icon: '🌑' },
  M:   { word: 'Menstrual',    icon: '🌙' },
  '?': { word: 'Variable',     icon: '🍃' },
} as const;

// ─────────────────────────────────────────────
// phaseForDay — exact port from shared.jsx lines 80–95 (T-49)
//
// Returns 5 phases. pcosIrregular collapses all phases to 'unknown'.
// Menstrual occupies the first 5 days AND the last 5 days of the cycle.
// Phase boundaries:
//   M  : day ≤ 5  OR  day > c - 5
//   F  : day ≤ Math.round(c * 0.45)
//   O  : day ≤ Math.round(c * 0.55)
//   Lm : day ≤ Math.round(c * 0.78)
//   Ls : remainder
// ─────────────────────────────────────────────
export function phaseForDay(
  day: number,
  cycleLen: number,
  opts?: PhaseOptions,
): Phase {
  const c = cycleLen || 28;

  // T-15 — irregular/PCOS mode: uncertain for any day
  if (opts?.pcosIrregular === true) return 'unknown';

  // Menstrual: first 5 days and last 5 days of the cycle
  if (day <= 5) return 'menstrual';
  if (day > c - 5) return 'menstrual';

  const fEnd  = Math.round(c * 0.45);
  const oEnd  = Math.round(c * 0.55);
  const lmEnd = Math.round(c * 0.78);

  if (day <= fEnd)  return 'follicular';
  if (day <= oEnd)  return 'ovulatory';
  if (day <= lmEnd) return 'luteal';

  return 'luteal-late';
}
