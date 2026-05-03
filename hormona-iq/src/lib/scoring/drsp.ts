// drsp.ts — DRSP-24 (Daily Record of Severity of Problems) scoring
// Items scored 0–6. 24 items total.
// Pure function, no side effects, no mutation.

export interface DRSPResult {
  total: number;
  severity: 'minimal' | 'mild' | 'moderate' | 'severe';
  /** True when total score meets PMDD-positive threshold (≥ 5 average per item = total ≥ 120) */
  isPmddPositive: boolean;
}

// ─────────────────────────────────────────────
// Severity thresholds (total score across 24 items, each 0–6, max = 144)
//
// Based on DRSP-24 clinical cut-offs (adapted for 0-6 Likert scale):
//   minimal      :  0 – 47  (avg < 2/item)
//   mild         : 48 – 71  (avg 2–2.9/item)
//   moderate     : 72 – 119 (avg 3–4.9/item)
//   severe       : 120+     (avg ≥ 5/item)
// ─────────────────────────────────────────────
const THRESHOLDS = {
  MILD:     48,
  MODERATE: 72,
  SEVERE:   120,
} as const;

/** Score at which PMDD-positive flag is set (avg ≥ 5 per item = total ≥ 120) */
const PMDD_THRESHOLD = 120;

/**
 * scoreDRSP — sum all response values and classify severity.
 * Input: array of integer scores 0–6 per DRSP item.
 * Does not mutate the input array.
 */
export function scoreDRSP(responses: readonly number[]): DRSPResult {
  const total = responses.reduce((sum, v) => sum + v, 0);

  const severity = ((): DRSPResult['severity'] => {
    if (total >= THRESHOLDS.SEVERE)   return 'severe';
    if (total >= THRESHOLDS.MODERATE) return 'moderate';
    if (total >= THRESHOLDS.MILD)     return 'mild';
    return 'minimal';
  })();

  return {
    total,
    severity,
    isPmddPositive: total >= PMDD_THRESHOLD,
  };
}
