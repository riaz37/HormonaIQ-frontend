// phq9.ts — PHQ-9 (Patient Health Questionnaire-9) scoring
// 9 items, each scored 0–3. Maximum total = 27.
// Item 9 = suicidal ideation item (index 8).
// Pure function, no side effects, no mutation.

export interface PHQ9Result {
  total: number;
  severity: 'minimal' | 'mild' | 'moderate' | 'moderately-severe' | 'severe';
  /** Raw score of PHQ-9 item 9 (0–3) */
  item9: number;
  /** True when item 9 ≥ 1 (any endorsement of SI) */
  siFlag: boolean;
}

// ─────────────────────────────────────────────
// Standard PHQ-9 severity bands (total score):
//   0–4   minimal
//   5–9   mild
//   10–14 moderate
//   15–19 moderately-severe
//   20–27 severe
// ─────────────────────────────────────────────
const THRESHOLDS = {
  MILD:               5,
  MODERATE:           10,
  MODERATELY_SEVERE:  15,
  SEVERE:             20,
} as const;

/** Index of the suicidal ideation item in the responses array */
const SI_ITEM_INDEX = 8;

/**
 * scorePHQ9 — sum all 9 responses and classify severity.
 * siFlag is set when item 9 (index 8) is ≥ 1.
 * Does not mutate the input array.
 */
export function scorePHQ9(responses: readonly number[]): PHQ9Result {
  const total = responses.reduce((sum, v) => sum + v, 0);
  const item9 = responses[SI_ITEM_INDEX] ?? 0;

  const severity = ((): PHQ9Result['severity'] => {
    if (total >= THRESHOLDS.SEVERE)              return 'severe';
    if (total >= THRESHOLDS.MODERATELY_SEVERE)   return 'moderately-severe';
    if (total >= THRESHOLDS.MODERATE)            return 'moderate';
    if (total >= THRESHOLDS.MILD)                return 'mild';
    return 'minimal';
  })();

  return {
    total,
    severity,
    item9,
    siFlag: item9 >= 1,
  };
}
