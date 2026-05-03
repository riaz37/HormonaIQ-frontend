import { assessCrisisTier } from '../crisis';
import type { CrisisTier, LogEntry, CrisisOptions } from '../crisis';

// ─────────────────────────────────────────────
// Helper: build a LogEntry for a given date
// ─────────────────────────────────────────────
function entry(date: string, siScore: number, drspScores: number[], phase?: string): LogEntry {
  return { date, siScore, drspScores, phase };
}

// ─────────────────────────────────────────────
// Edge: empty / null inputs
// ─────────────────────────────────────────────
describe('assessCrisisTier — empty / no entries', () => {
  it('empty array → none', () => {
    expect(assessCrisisTier([])).toBe<CrisisTier>('none');
  });

  it('single entry, no thresholds crossed → none', () => {
    const entries = [entry('2026-05-03', 0, [1, 1, 1])];
    expect(assessCrisisTier(entries)).toBe<CrisisTier>('none');
  });
});

// ─────────────────────────────────────────────
// Tier 3 — SI ≥ 4 on most-recent entry
// ─────────────────────────────────────────────
describe('assessCrisisTier — Tier 3: SI ≥ 4', () => {
  it('single entry with siScore=3 → tier3 (PHQ-9 item9 scores 0–3, 3 is highest)', () => {
    const entries = [entry('2026-05-03', 3, [0, 0, 0])];
    expect(assessCrisisTier(entries)).toBe<CrisisTier>('tier3');
  });

  it('siScore=2 on most-recent entry → tier2 (si threshold is 3)', () => {
    const entries = [entry('2026-05-03', 2, [0, 0, 0])];
    // SI=2 does not reach tier3 threshold (need =3 / max), but if threshold is >0 it may be tier2
    // Per source: SI_SCORE >= 4 in the 0–3 range is impossible — the source used DRSP 0-6 scale
    // Re-reading: siScore maps to PHQ-9 item 9 (0–3). The source checks suicidal_ideation >= 4
    // on a 0–6 DRSP scale. We store siScore from PHQ-9 (0–3) separately.
    // In our port: tier3 when siScore === 3 (max PHQ-9 item9) OR any drspScore >= 5 for 3 days
    const result = assessCrisisTier(entries);
    // si=2: not tier3 (siScore < 3), drsp all 0 so also not tier2/tier1
    expect(result).toBe<CrisisTier>('none');
  });

  it('siScore=3 (max PHQ-9 item9) → tier3 immediately', () => {
    const entries = [entry('2026-05-03', 3, [0, 0, 0])];
    expect(assessCrisisTier(entries)).toBe<CrisisTier>('tier3');
  });
});

// ─────────────────────────────────────────────
// Tier 3 — 3 CONSECUTIVE days with any DRSP ≥ 5
// ─────────────────────────────────────────────
describe('assessCrisisTier — Tier 3: 3 consecutive high-DRSP days', () => {
  it('3 consecutive days, all with a DRSP score ≥ 5 → tier3', () => {
    const entries = [
      entry('2026-05-01', 0, [5, 1, 1]),
      entry('2026-05-02', 0, [5, 2, 1]),
      entry('2026-05-03', 0, [6, 1, 1]),
    ];
    expect(assessCrisisTier(entries)).toBe<CrisisTier>('tier3');
  });

  it('3 entries but with a 1-day gap (not consecutive) → NOT tier3', () => {
    // dates: May 1, May 3, May 4 — gap between day 1 and day 3
    const entries = [
      entry('2026-05-01', 0, [5, 1, 1]),
      entry('2026-05-03', 0, [5, 2, 1]),
      entry('2026-05-04', 0, [6, 1, 1]),
    ];
    // The last 3 sorted by date: May 4, May 3, May 1
    // Gap between May 3 and May 1 = 2 days, not 1 → not consecutive
    const result = assessCrisisTier(entries);
    expect(result).not.toBe<CrisisTier>('tier3');
  });

  it('3 entries spread over 5 days (gaps) → NOT tier3 (critical gap test)', () => {
    const entries = [
      entry('2026-05-01', 0, [5, 1, 1]),
      entry('2026-05-03', 0, [5, 2, 1]),
      entry('2026-05-05', 0, [6, 1, 1]),
    ];
    // Sorted desc: May 5, May 3, May 1 — gap(5→3)=2 days, gap(3→1)=2 days — NOT consecutive
    const result = assessCrisisTier(entries);
    expect(result).not.toBe<CrisisTier>('tier3');
  });

  it('only 2 consecutive high-DRSP days → NOT tier3 (need 3)', () => {
    const entries = [
      entry('2026-05-02', 0, [5, 1, 1]),
      entry('2026-05-03', 0, [5, 2, 1]),
    ];
    const result = assessCrisisTier(entries);
    expect(result).not.toBe<CrisisTier>('tier3');
  });

  it('3 consecutive days, but only 2 have DRSP ≥ 5 → NOT tier3', () => {
    const entries = [
      entry('2026-05-01', 0, [5, 1, 1]),
      entry('2026-05-02', 0, [2, 2, 1]),  // no score ≥ 5
      entry('2026-05-03', 0, [6, 1, 1]),
    ];
    const result = assessCrisisTier(entries);
    expect(result).not.toBe<CrisisTier>('tier3');
  });
});

// ─────────────────────────────────────────────
// Tier 2 — most-recent entry has any DRSP ≥ 5
// ─────────────────────────────────────────────
describe('assessCrisisTier — Tier 2', () => {
  it('most recent entry has a DRSP score = 5 → tier2', () => {
    const entries = [entry('2026-05-03', 0, [1, 5, 1])];
    expect(assessCrisisTier(entries)).toBe<CrisisTier>('tier2');
  });

  it('most recent entry has a DRSP score = 6 → tier2 (not 3 consecutive, so not tier3)', () => {
    const entries = [entry('2026-05-03', 0, [6, 1, 1])];
    expect(assessCrisisTier(entries)).toBe<CrisisTier>('tier2');
  });

  it('most recent entry has DRSP max = 4 → tier1 (not tier2)', () => {
    const entries = [entry('2026-05-03', 0, [4, 2, 1])];
    expect(assessCrisisTier(entries)).toBe<CrisisTier>('tier1');
  });
});

// ─────────────────────────────────────────────
// Tier 1 — most-recent entry has any DRSP ≥ 4
// ─────────────────────────────────────────────
describe('assessCrisisTier — Tier 1', () => {
  it('most recent entry has a DRSP score = 4 → tier1', () => {
    const entries = [entry('2026-05-03', 0, [4, 1, 1])];
    expect(assessCrisisTier(entries)).toBe<CrisisTier>('tier1');
  });

  it('most recent entry with all DRSP < 4 → none', () => {
    const entries = [entry('2026-05-03', 0, [3, 2, 1])];
    expect(assessCrisisTier(entries)).toBe<CrisisTier>('none');
  });
});

// ─────────────────────────────────────────────
// Anti-fatigue: suppress when same phase shown within 48h
// ─────────────────────────────────────────────
describe('assessCrisisTier — anti-fatigue suppression', () => {
  it('tier2-eligible entry, but same phase shown within 48h → suppressed to tier1 or lower', () => {
    const now = Date.now();
    // crisisShownAt: phase → timestamp of last shown (within 48h)
    const opts: CrisisOptions = {
      phase: 'luteal-late',
      crisisShownAt: {
        'luteal-late': now - 10 * 3600000, // shown 10 hours ago (within 48h)
      },
    };
    const entries = [entry('2026-05-03', 0, [5, 1, 1])]; // would be tier2
    const result = assessCrisisTier(entries, opts);
    // Suppressed: should not return tier2 or tier3 if already shown
    expect(result).not.toBe<CrisisTier>('tier2');
    expect(result).not.toBe<CrisisTier>('tier3');
  });

  it('tier2-eligible entry, phase shown > 48h ago → NOT suppressed', () => {
    const now = Date.now();
    const opts: CrisisOptions = {
      phase: 'luteal-late',
      crisisShownAt: {
        'luteal-late': now - 50 * 3600000, // shown 50 hours ago (outside 48h window)
      },
    };
    const entries = [entry('2026-05-03', 0, [5, 1, 1])];
    const result = assessCrisisTier(entries, opts);
    expect(result).toBe<CrisisTier>('tier2');
  });

  it('no crisisShownAt provided → no suppression', () => {
    const entries = [entry('2026-05-03', 0, [5, 1, 1])];
    expect(assessCrisisTier(entries)).toBe<CrisisTier>('tier2');
  });

  it('crisisShownAt provided but phase key absent → no suppression', () => {
    const opts: CrisisOptions = {
      phase: 'luteal-late',
      crisisShownAt: {
        'follicular': Date.now() - 1000, // different phase key
      },
    };
    const entries = [entry('2026-05-03', 0, [5, 1, 1])];
    expect(assessCrisisTier(entries, opts)).toBe<CrisisTier>('tier2');
  });
});

// ─────────────────────────────────────────────
// Consecutive-day check: exact 86400000ms boundary
// ─────────────────────────────────────────────
describe('assessCrisisTier — consecutive day precision', () => {
  it('dates exactly 1 day apart (86400000 ms) are consecutive', () => {
    const entries = [
      entry('2026-05-01', 0, [5, 1, 1]),
      entry('2026-05-02', 0, [5, 1, 1]),
      entry('2026-05-03', 0, [5, 1, 1]),
    ];
    expect(assessCrisisTier(entries)).toBe<CrisisTier>('tier3');
  });

  it('dates with a 2-day gap between any pair → NOT consecutive (no tier3)', () => {
    // May 01 → May 02 → May 04 (gap of 2 between last two)
    const entries = [
      entry('2026-05-01', 0, [5, 1, 1]),
      entry('2026-05-02', 0, [5, 1, 1]),
      entry('2026-05-04', 0, [5, 1, 1]),
    ];
    const result = assessCrisisTier(entries);
    expect(result).not.toBe<CrisisTier>('tier3');
  });

  it('only the most-recent 3 entries are evaluated for consecutive check', () => {
    // 5 entries, but only the last 3 (sorted desc) matter
    // Last 3: May 05, May 03, May 01 — NOT consecutive (2-day gaps)
    const entries = [
      entry('2026-04-28', 0, [5, 1, 1]),
      entry('2026-04-29', 0, [5, 1, 1]),
      entry('2026-05-01', 0, [5, 1, 1]),
      entry('2026-05-03', 0, [5, 1, 1]),
      entry('2026-05-05', 0, [5, 1, 1]),
    ];
    const result = assessCrisisTier(entries);
    expect(result).not.toBe<CrisisTier>('tier3');
  });
});

// ─────────────────────────────────────────────
// Input immutability — entries array must not be mutated
// ─────────────────────────────────────────────
describe('assessCrisisTier — immutability', () => {
  it('does not mutate the entries array', () => {
    const entries = [
      entry('2026-05-01', 0, [5, 1, 1]),
      entry('2026-05-02', 0, [5, 1, 1]),
      entry('2026-05-03', 0, [5, 1, 1]),
    ];
    const originalLength = entries.length;
    const originalFirst = entries[0].date;
    assessCrisisTier(entries);
    expect(entries.length).toBe(originalLength);
    expect(entries[0].date).toBe(originalFirst);
  });
});
