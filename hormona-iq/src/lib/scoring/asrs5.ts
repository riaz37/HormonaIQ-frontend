// asrs5.ts — ASRS-5 (Adult ADHD Self-Report Scale, 5-item screener) scoring
// 5 items, each scored 0–4 (Never/Rarely/Sometimes/Often/Very Often).
// Maximum total = 20.
// Positive screen threshold: total ≥ 14 (based on published ASRS-5 validation).
// Pure function, no side effects, no mutation.

export interface ASRS5Result {
  score: number;
  /** True when score meets the clinical positive-screen threshold (≥ 14) */
  positiveScreen: boolean;
}

// ─────────────────────────────────────────────
// ASRS-5 positive screen threshold
// Reference: Kessler et al. (2005); ASRS-5 validation studies use total ≥ 14
// ─────────────────────────────────────────────
const POSITIVE_SCREEN_THRESHOLD = 14;

/**
 * scoreASRS5 — sum all 5 response values and determine positive screen.
 * Does not mutate the input array.
 */
export function scoreASRS5(responses: readonly number[]): ASRS5Result {
  const score = responses.reduce((sum, v) => sum + v, 0);

  return {
    score,
    positiveScreen: score >= POSITIVE_SCREEN_THRESHOLD,
  };
}
