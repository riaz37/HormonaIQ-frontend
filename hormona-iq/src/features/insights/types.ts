// Shared types for the insights feature.

export interface DRSPValues {
  depressed?: number;
  hopeless?: number;
  worthless_guilty?: number;
  anxiety?: number;
  mood_swings?: number;
  rejection_sensitive?: number;
  irritability?: number;
  conflicts?: number;
  decreased_interest?: number;
  concentration?: number;
  fatigue?: number;
  appetite?: number;
  hypersomnia?: number;
  insomnia?: number;
  overwhelmed?: number;
  out_of_control?: number;
  breast_tenderness?: number;
  breast_swelling_bloating?: number;
  headache?: number;
  joint_muscle_pain?: number;
  [key: string]: number | undefined;
}

export interface DayEntry {
  drsp?: DRSPValues;
}

export interface InsightsState {
  cycleLen: number;
  cycleDay: number;
  lastPeriod: string;
  entries: Record<string, DayEntry>;
  drspAcknowledged: boolean;
  exportSI: boolean;
  passiveMode: boolean;
  passiveModeUntil: number | null;
  passiveAutoOverride: boolean;
}

export interface ChartDataPoint {
  day: number;
  score: number;
  estimated: boolean;
}

export interface CPASSResult {
  absoluteSeverity: boolean;
  coreMood: boolean;
  absoluteClearance: boolean;
  cyclicity: boolean;
}

export interface CycleAnalysisResult {
  cycleNum: number;
  coverage: number;
  totalDaysLogged: number;
  lutealConsecutive: number;
  folConsecutive: number;
  meanItemsPerDay: number;
  cycleQualifies: boolean;
  lutealMeans: Record<string, number | null>;
  folMeans: Record<string, number | null>;
  cpass: CPASSResult;
}

export interface CycleAnalysis {
  cycles: CycleAnalysisResult[];
  completedCycles: number;
  currentCoverage: number;
  currentLutealConsec: number;
  currentFolConsec: number;
}

export interface DRSPItem {
  k: string;
  label: string;
  core: boolean;
}
