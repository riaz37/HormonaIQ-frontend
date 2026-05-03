import { phaseForDay, PHASE_COLORS, PHASE_NAMES, PHASE_VIBES } from '../phase';
import type { Phase } from '../phase';

// ─────────────────────────────────────────────
// phaseForDay — boundary tests for 28-day cycle
// ─────────────────────────────────────────────
describe('phaseForDay — 28-day cycle', () => {
  it('day 1 → menstrual', () => {
    expect(phaseForDay(1, 28)).toBe<Phase>('menstrual');
  });

  it('day 5 → menstrual (last menstrual day)', () => {
    expect(phaseForDay(5, 28)).toBe<Phase>('menstrual');
  });

  it('day 6 → follicular (first post-menstrual day)', () => {
    expect(phaseForDay(6, 28)).toBe<Phase>('follicular');
  });

  it('day 12 (28×0.45=12.6 → fEnd=13) → follicular', () => {
    // fEnd = Math.round(28 * 0.45) = Math.round(12.6) = 13
    expect(phaseForDay(12, 28)).toBe<Phase>('follicular');
  });

  it('day 13 → follicular (= fEnd boundary)', () => {
    // fEnd = Math.round(28 * 0.45) = 13
    expect(phaseForDay(13, 28)).toBe<Phase>('follicular');
  });

  it('ovulatory boundary: day 28-13=15 → ovulatory (exact boundary)', () => {
    // oEnd = Math.round(28 * 0.55) = Math.round(15.4) = 15
    // day 15 is <= oEnd (15), so ovulatory
    expect(phaseForDay(15, 28)).toBe<Phase>('ovulatory');
  });

  it('day 14 → ovulatory (between fEnd+1 and oEnd)', () => {
    expect(phaseForDay(14, 28)).toBe<Phase>('ovulatory');
  });

  it('day 16 → luteal (early, Lm)', () => {
    // lmEnd = Math.round(28 * 0.78) = Math.round(21.84) = 22
    // day 16: > oEnd(15), <= lmEnd(22) → luteal
    expect(phaseForDay(16, 28)).toBe<Phase>('luteal');
  });

  it('day 22 → luteal (= lmEnd boundary)', () => {
    // lmEnd = Math.round(28 * 0.78) = 22
    expect(phaseForDay(22, 28)).toBe<Phase>('luteal');
  });

  it('day 23 → luteal-late (Ls, past lmEnd)', () => {
    // day 23 > lmEnd(22) AND day 23 <= c-5(23) edge — c-5 = 23, so day 23 is the boundary
    // day > c-5 returns menstrual; c-5 = 23, 23 > 23 is false → luteal-late
    expect(phaseForDay(23, 28)).toBe<Phase>('luteal-late');
  });

  it('day 28 → menstrual (last day, > c-5=23)', () => {
    expect(phaseForDay(28, 28)).toBe<Phase>('menstrual');
  });

  it('day 24 → menstrual (> c-5=23)', () => {
    expect(phaseForDay(24, 28)).toBe<Phase>('menstrual');
  });
});

// ─────────────────────────────────────────────
// phaseForDay — longer cycles (e.g., 35-day)
// ─────────────────────────────────────────────
describe('phaseForDay — 35-day cycle', () => {
  it('day 1 → menstrual', () => {
    expect(phaseForDay(1, 35)).toBe<Phase>('menstrual');
  });

  it('day 5 → menstrual', () => {
    expect(phaseForDay(5, 35)).toBe<Phase>('menstrual');
  });

  it('day 6 → follicular', () => {
    expect(phaseForDay(6, 35)).toBe<Phase>('follicular');
  });

  it('day 31 → menstrual (> c-5=30)', () => {
    // c-5 = 30; day 31 > 30 → menstrual
    expect(phaseForDay(31, 35)).toBe<Phase>('menstrual');
  });

  it('day 35 → menstrual', () => {
    expect(phaseForDay(35, 35)).toBe<Phase>('menstrual');
  });
});

// ─────────────────────────────────────────────
// phaseForDay — PCOS / irregular opts
// ─────────────────────────────────────────────
describe('phaseForDay — PCOS/irregular opts', () => {
  it('pcosIrregular: true → unknown for day 1', () => {
    expect(phaseForDay(1, 35, { pcosIrregular: true })).toBe<Phase>('unknown');
  });

  it('pcosIrregular: true → unknown for mid-cycle day', () => {
    expect(phaseForDay(15, 35, { pcosIrregular: true })).toBe<Phase>('unknown');
  });

  it('pcosIrregular: false → normal phase returned', () => {
    expect(phaseForDay(1, 28, { pcosIrregular: false })).toBe<Phase>('menstrual');
  });

  it('cycleVariance option present but pcosIrregular false → normal phase', () => {
    expect(phaseForDay(6, 28, { cycleVariance: 5 })).toBe<Phase>('follicular');
  });
});

// ─────────────────────────────────────────────
// phaseForDay — edge: day 0 and day > cycleLen
// ─────────────────────────────────────────────
describe('phaseForDay — edge cases (day 0, day > cycleLen)', () => {
  it('day 0 → menstrual (≤5)', () => {
    // day 0 is ≤ 5, so menstrual
    expect(phaseForDay(0, 28)).toBe<Phase>('menstrual');
  });

  it('day > cycleLen (e.g., day 30 on 28-day cycle) → menstrual (> c-5=23)', () => {
    expect(phaseForDay(30, 28)).toBe<Phase>('menstrual');
  });

  it('cycleLen 0 or falsy falls back to 28-day logic', () => {
    // opts.irregular not set; cycleLen 0 falls back to 28
    // day 6 on default 28-day → follicular
    expect(phaseForDay(6, 0)).toBe<Phase>('follicular');
  });
});

// ─────────────────────────────────────────────
// PHASE_COLORS, PHASE_NAMES, PHASE_VIBES exports
// ─────────────────────────────────────────────
describe('PHASE_COLORS', () => {
  it('has entries for all 6 phase keys', () => {
    expect(PHASE_COLORS).toHaveProperty('F');
    expect(PHASE_COLORS).toHaveProperty('O');
    expect(PHASE_COLORS).toHaveProperty('L');
    expect(PHASE_COLORS).toHaveProperty('Lm');
    expect(PHASE_COLORS).toHaveProperty('Ls');
    expect(PHASE_COLORS).toHaveProperty('M');
  });

  it('values are CSS variable strings', () => {
    expect(PHASE_COLORS.F).toMatch(/^var\(/);
    expect(PHASE_COLORS.M).toMatch(/^var\(/);
  });
});

describe('PHASE_NAMES', () => {
  it('has human-readable names', () => {
    expect(PHASE_NAMES.F).toBe('Follicular');
    expect(PHASE_NAMES.O).toBe('Ovulatory');
    expect(PHASE_NAMES.L).toBe('Luteal');
    expect(PHASE_NAMES.Lm).toBe('Early luteal');
    expect(PHASE_NAMES.Ls).toBe('Late luteal');
    expect(PHASE_NAMES.M).toBe('Menstrual');
  });
});

describe('PHASE_VIBES', () => {
  it('has word and icon for each phase', () => {
    expect(PHASE_VIBES.F.word).toBe('Follicular');
    expect(PHASE_VIBES.O.word).toBe('Peak');
    expect(PHASE_VIBES.Ls.word).toBe('Late luteal');
    expect(typeof PHASE_VIBES.F.icon).toBe('string');
  });
});
