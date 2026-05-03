// crisis.ts — Port of assessCrisisTier() from crisis-service.jsx
// Three-tier crisis surface system (T-06, T-07, T-08)
// Pure TypeScript, no localStorage, no side effects.

export type CrisisTier = 'none' | 'tier1' | 'tier2' | 'tier3';

export interface LogEntry {
  /** ISO date string 'YYYY-MM-DD' */
  date: string;
  /** PHQ-9 item 9 score (0–3). Maps to suicidal ideation intensity. */
  siScore: number;
  /** DRSP item scores (each 0–6) */
  drspScores: number[];
  /** Optional cycle phase for anti-fatigue tracking */
  phase?: string;
}

export interface CrisisOptions {
  /** Current cycle phase (for anti-fatigue suppression) */
  phase?: string;
  /**
   * Anti-fatigue map: phase key → Unix timestamp (ms) of last time
   * a crisis surface was shown for that phase.
   * If the last shown time is within 48h, suppress to the next tier down.
   */
  crisisShownAt?: Record<string, number>;
}

// ─────────────────────────────────────────────
// Internal helpers
// ─────────────────────────────────────────────

/** Returns true when any score in the array is ≥ threshold. */
function anyAtOrAbove(scores: readonly number[], threshold: number): boolean {
  return scores.some((v) => v >= threshold);
}

/** ms in one day — used for consecutive-day validation */
const ONE_DAY_MS = 86400000;

/**
 * Returns the 3 most-recent entries sorted descending by date.
 * Does NOT mutate the input array.
 */
function lastThreeSortedDesc(entries: readonly LogEntry[]): LogEntry[] {
  return [...entries]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3);
}

/**
 * Returns true when the three entries (sorted descending) span exactly 2 days,
 * i.e. entries[0].date − entries[1].date = 1 day AND
 *      entries[1].date − entries[2].date = 1 day.
 *
 * Uses getTime() difference compared to exactly ONE_DAY_MS, matching the
 * spec: "3 entries are consecutive only if dates are exactly 1 day apart".
 */
function areThreeConsecutive(sorted: readonly LogEntry[]): boolean {
  if (sorted.length !== 3) return false;
  const d0 = new Date(sorted[0].date).getTime();
  const d1 = new Date(sorted[1].date).getTime();
  const d2 = new Date(sorted[2].date).getTime();
  return (d0 - d1 === ONE_DAY_MS) && (d1 - d2 === ONE_DAY_MS);
}

/**
 * Anti-fatigue check: returns true when the crisis surface for the given phase
 * was already shown within the past 48 hours.
 */
function isWithin48h(
  phase: string | undefined,
  crisisShownAt: Record<string, number> | undefined,
): boolean {
  if (!phase || !crisisShownAt) return false;
  const lastShown = crisisShownAt[phase];
  if (lastShown === undefined) return false;
  const hoursElapsed = (Date.now() - lastShown) / 3600000;
  return hoursElapsed < 48;
}

// ─────────────────────────────────────────────
// assessCrisisTier
//
// Tier determination (highest wins, in priority order):
//
//   Tier 3 — either:
//     a) Most-recent entry siScore === 3  (PHQ-9 item 9 at maximum)
//     b) Last 3 entries are consecutive days AND each has any drspScore ≥ 5
//
//   Tier 2 — most-recent entry has any drspScore ≥ 5
//   Tier 1 — most-recent entry has any drspScore ≥ 4
//   None   — no thresholds crossed
//
// Anti-fatigue: if opts.phase was shown within 48h (opts.crisisShownAt),
// the computed tier is clamped down by one level (tier3→tier2, tier2→tier1, tier1→none).
// ─────────────────────────────────────────────
export function assessCrisisTier(
  entries: readonly LogEntry[],
  opts?: CrisisOptions,
): CrisisTier {
  if (!entries || entries.length === 0) return 'none';

  // Sort descending to find most-recent entry without mutating input
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  const mostRecent = sorted[0];

  // ── Tier 3a: SI at maximum on most-recent entry ──────────────────────────
  // PHQ-9 item 9 max is 3; maps to original crisis-service SI ≥ 4 on 0–6 scale
  if (mostRecent.siScore >= 3) {
    return applyAntiFatigue('tier3', opts);
  }

  // ── Tier 3b: 3 consecutive days with any DRSP ≥ 5 ───────────────────────
  const last3 = lastThreeSortedDesc(entries);
  if (
    last3.length === 3 &&
    areThreeConsecutive(last3) &&
    last3.every((e) => anyAtOrAbove(e.drspScores, 5))
  ) {
    return applyAntiFatigue('tier3', opts);
  }

  // ── Tier 2: most-recent entry has any DRSP ≥ 5 ──────────────────────────
  if (anyAtOrAbove(mostRecent.drspScores, 5)) {
    return applyAntiFatigue('tier2', opts);
  }

  // ── Tier 1: most-recent entry has any DRSP ≥ 4 ──────────────────────────
  if (anyAtOrAbove(mostRecent.drspScores, 4)) {
    return applyAntiFatigue('tier1', opts);
  }

  return 'none';
}

// ─────────────────────────────────────────────
// applyAntiFatigue — clamp tier down by 1 level if shown within 48h
// ─────────────────────────────────────────────
function applyAntiFatigue(
  tier: CrisisTier,
  opts: CrisisOptions | undefined,
): CrisisTier {
  if (!isWithin48h(opts?.phase, opts?.crisisShownAt)) return tier;

  // Clamp down: tier3 → tier2, tier2 → tier1, tier1 → none
  const downgrade: Record<CrisisTier, CrisisTier> = {
    tier3: 'tier2',
    tier2: 'tier1',
    tier1: 'none',
    none:  'none',
  };
  return downgrade[tier];
}
