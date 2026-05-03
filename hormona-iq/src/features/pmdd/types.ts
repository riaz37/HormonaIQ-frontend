// ─────────────────────────────────────────────────────────────────────────────
// PMDD feature — shared types, helpers, and inline primitives
// ─────────────────────────────────────────────────────────────────────────────

export type PhaseCode = 'F' | 'O' | 'L' | 'M' | '?';
export type EvidenceLevel = 'Strong' | 'Moderate' | 'Limited' | 'Unsupported';
export type PatternState = 'empty' | 'early' | 'confirmed';
export type SeverityKey = 'severe' | 'mod' | 'mild';
export type ModuleId =
  | 'pmddPDF'
  | 'crisis'
  | 'lutealPred'
  | 'safetyPlan'
  | 'ssri'
  | 'supps'
  | 'rage'
  | 'relImpact'
  | 'workImpact'
  | 'triggers'
  | 'community';

export interface DRSPScores {
  irritability?: number;
  anxiety?: number;
  overwhelmed?: number;
  concentration?: number;
  fatigue?: number;
  mood_swings?: number;
  depressed?: number;
  rejection_sensitive?: number;
  out_of_control?: number;
  hopeless?: number;
  breast_tenderness?: number;
  headache?: number;
  appetite?: number;
  insomnia?: number;
  hypersomnia?: number;
  suicidal_ideation?: number;
  [key: string]: number | undefined;
}

export interface DayEntry {
  drsp?: DRSPScores;
}

export interface TriggerEntry {
  sleep?: number | string;
  caffeine?: number | string;
  alcohol?: number | string;
  exercise?: string;
  stress?: number;
  isolation?: number;
  [key: string]: number | string | undefined;
}

export interface RageEpisode {
  at: number;
  type: string;
  intensity: number;
  duration: string | null;
  note: string | null;
}

export interface SSRIConfig {
  name: string;
  dose: number;
  pattern: string;
}

export interface SSRILogEntry {
  taken?: boolean;
  note?: string;
  at?: number;
}

export interface SafetyPlanItem {
  k: string;
  l: string;
  v: string;
}

export interface SupplementItem {
  n: string;
  dose: number;
  unit: string;
  d: string;
  e: EvidenceLevel;
}

export interface PMDDState {
  cycleDay: number;
  cycleLen: number;
  lastPeriod: string | null;
  entries: Record<string, DayEntry>;
  triggerLog: Record<string, TriggerEntry>;
  rageEpisodes: RageEpisode[];
  ssriConfig: SSRIConfig | null;
  ssriLog: Record<string, SSRILogEntry>;
  safetyPlanEditOverride: boolean;
  conditions: string[];
  adhd: string;
  hbcActive: boolean;
  hbcType: string;
  yearOfBirth: number | null;
  exportSI: boolean;
  featureFlags: Record<string, boolean>;
}

export interface TabDef {
  id: ModuleId;
  label: string;
}

export const TABS: TabDef[] = [
  { id: 'pmddPDF', label: 'DRSP Log' },
  { id: 'crisis', label: 'Crisis' },
  { id: 'lutealPred', label: 'Luteal' },
  { id: 'safetyPlan', label: 'Safety' },
  { id: 'ssri', label: 'SSRI' },
  { id: 'supps', label: 'Supps' },
  { id: 'rage', label: 'Episodes' },
  { id: 'relImpact', label: 'Relations' },
  { id: 'workImpact', label: 'Work' },
  { id: 'triggers', label: 'Triggers' },
  { id: 'community', label: 'Community' },
];

export const INITIAL_STATE: PMDDState = {
  cycleDay: 22,
  cycleLen: 28,
  lastPeriod: null,
  entries: {},
  triggerLog: {},
  rageEpisodes: [],
  ssriConfig: null,
  ssriLog: {},
  safetyPlanEditOverride: false,
  conditions: ['PMDD'],
  adhd: 'No',
  hbcActive: false,
  hbcType: '',
  yearOfBirth: null,
  exportSI: false,
  featureFlags: {},
};

// ─────────────────────────────────────────────────────────────────────────────
// Pure helpers
// ─────────────────────────────────────────────────────────────────────────────

export function phaseForDay(day: number, cycleLen: number, coarse = true): PhaseCode {
  const c = cycleLen || 28;
  if (day <= 5) return 'M';
  if (day > c - 5) return 'M';
  const fEnd = Math.round(c * 0.45);
  const oEnd = Math.round(c * 0.55);
  if (day <= fEnd) return 'F';
  if (day <= oEnd) return 'O';
  if (!coarse) {
    const _lmEnd = Math.round(c * 0.78);
    return 'L';
  }
  return 'L';
}

export function meanDRSP(entry: DayEntry | undefined): number | null {
  if (!entry?.drsp) return null;
  const vals = Object.entries(entry.drsp)
    .filter(([k]) => k !== 'suicidal_ideation')
    .map(([, v]) => Number(v))
    .filter((v) => v > 0);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
}

export function phaseDayFor(
  dateKey: string,
  lastPeriod: string | null,
  cycleLen: number,
): number | null {
  if (!lastPeriod) return null;
  const dt = new Date(dateKey).getTime();
  const start = new Date(lastPeriod).getTime();
  const diff = Math.floor((dt - start) / 86400000);
  return Math.max(1, (diff % cycleLen) + 1);
}

export function formatEpisodeTime(ts: number): string {
  const dt = new Date(ts);
  const now = new Date();
  const diff = Math.floor((now.getTime() - dt.getTime()) / 86400000);
  const time = dt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (diff === 0) return `Today ${time}`;
  if (diff === 1) return `Yesterday ${time}`;
  return `${diff} days ago ${time}`;
}

export const DRSP_ITEM_LABELS: Record<string, string> = {
  irritability: 'irritability',
  anxiety: 'anxiety',
  overwhelmed: 'overwhelmed',
  concentration: 'concentration',
  fatigue: 'fatigue',
  mood_swings: 'mood swings',
  depressed: 'depression',
  rejection_sensitive: 'rejection sensitivity',
  out_of_control: 'feeling out of control',
  hopeless: 'hopelessness',
  breast_tenderness: 'breast tenderness',
  headache: 'headache',
  appetite: 'appetite/cravings',
  insomnia: 'insomnia',
  hypersomnia: 'hypersomnia',
};

export function itemLabel(k: string): string {
  return DRSP_ITEM_LABELS[k] ?? k.replace(/_/g, ' ');
}

export const SEVERITY_COLORS: Record<SeverityKey, string> = {
  severe: '#c0392b',
  mod: '#e67e22',
  mild: '#27ae60',
};

export function computePatternState(entries: Record<string, DayEntry>): PatternState {
  const loggedDays = Object.keys(entries).length;
  if (loggedDays < 7) return 'empty';
  if (loggedDays < 35) return 'early';
  return 'confirmed';
}

export function computeLutealVsFollicular(
  entries: Record<string, DayEntry>,
  lastPeriod: string | null,
  cycleLen: number,
): {
  lutealMean: number | null;
  follMean: number | null;
  swing: number | null;
  topItems: Array<{ k: string; avg: number }>;
} {
  const lutealVals: number[] = [];
  const follVals: number[] = [];
  const itemSums: Record<string, number> = {};
  const itemCounts: Record<string, number> = {};

  Object.entries(entries).forEach(([k, e]) => {
    const cd = phaseDayFor(k, lastPeriod, cycleLen);
    if (!cd) return;
    const ph = phaseForDay(cd, cycleLen);
    const m = meanDRSP(e);
    if (m == null) return;
    if (ph === 'L') {
      lutealVals.push(m);
      Object.entries(e.drsp ?? {}).forEach(([key, v]) => {
        if (key === 'suicidal_ideation') return;
        itemSums[key] = (itemSums[key] ?? 0) + (Number(v) || 0);
        itemCounts[key] = (itemCounts[key] ?? 0) + 1;
      });
    } else if (ph === 'F') {
      follVals.push(m);
    }
  });

  const mean = (arr: number[]) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

  const lutealMean = mean(lutealVals);
  const follMean = mean(follVals);
  const swing =
    lutealMean != null && follMean != null && follMean > 0
      ? lutealMean / follMean
      : null;

  const topItems = Object.entries(itemSums)
    .map(([k, sum]) => ({ k, avg: sum / (itemCounts[k] ?? 1) }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 3);

  return { lutealMean, follMean, swing, topItems };
}
