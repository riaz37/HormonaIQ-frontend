import { scoreDRSP } from '../scoring/drsp';
import { scorePHQ9 } from '../scoring/phq9';
import { scoreASRS5 } from '../scoring/asrs5';
import type { DRSPResult } from '../scoring/drsp';
import type { PHQ9Result } from '../scoring/phq9';
import type { ASRS5Result } from '../scoring/asrs5';

// ─────────────────────────────────────────────
// DRSP-24 scoring
// ─────────────────────────────────────────────
describe('scoreDRSP', () => {
  it('all zeros (24 items) → total=0, severity=minimal, isPmddPositive=false', () => {
    const responses = new Array(24).fill(0) as number[];
    const result: DRSPResult = scoreDRSP(responses);
    expect(result.total).toBe(0);
    expect(result.severity).toBe('minimal');
    expect(result.isPmddPositive).toBe(false);
  });

  it('all ones → total=24, severity=minimal', () => {
    const responses = new Array(24).fill(1) as number[];
    const result = scoreDRSP(responses);
    expect(result.total).toBe(24);
    expect(result.severity).toBe('minimal');
  });

  it('all twos → total=48, severity=mild (lower boundary)', () => {
    const responses = new Array(24).fill(2) as number[];
    const result = scoreDRSP(responses);
    expect(result.total).toBe(48);
    expect(result.severity).toBe('mild');
    expect(result.isPmddPositive).toBe(false);
  });

  it('total=71 → mild (upper boundary before moderate)', () => {
    // 23 items × 3 = 69, + 2 = 71
    const responses = [...new Array(23).fill(3), 2] as number[];
    const result = scoreDRSP(responses);
    expect(result.total).toBe(71);
    expect(result.severity).toBe('mild');
  });

  it('all threes → total=72, severity=moderate', () => {
    const responses = new Array(24).fill(3) as number[];
    const result = scoreDRSP(responses);
    expect(result.total).toBe(72);
    expect(result.severity).toBe('moderate');
  });

  it('all fours → total=96, severity=moderate', () => {
    const responses = new Array(24).fill(4) as number[];
    const result = scoreDRSP(responses);
    expect(result.total).toBe(96);
    expect(result.severity).toBe('moderate');
  });

  it('all fives → total=120, severity=severe, isPmddPositive=true', () => {
    const responses = new Array(24).fill(5) as number[];
    const result = scoreDRSP(responses);
    expect(result.total).toBe(120);
    expect(result.severity).toBe('severe');
    expect(result.isPmddPositive).toBe(true);
  });

  it('all sixes → total=144, severity=severe, isPmddPositive=true', () => {
    const responses = new Array(24).fill(6) as number[];
    const result = scoreDRSP(responses);
    expect(result.total).toBe(144);
    expect(result.severity).toBe('severe');
    expect(result.isPmddPositive).toBe(true);
  });

  it('mixed scores — partial high → correct total', () => {
    // 12 items at 0, 12 items at 6 → total = 72
    const responses = [
      ...new Array(12).fill(0),
      ...new Array(12).fill(6),
    ] as number[];
    const result = scoreDRSP(responses);
    expect(result.total).toBe(72);
  });

  it('exactly 24 items required — partial array still sums correctly', () => {
    const responses = [5, 5, 5] as number[];
    const result = scoreDRSP(responses);
    expect(result.total).toBe(15);
  });

  it('does not mutate input array', () => {
    const responses = [1, 2, 3, 4, 5, 6];
    const copy = [...responses];
    scoreDRSP(responses);
    expect(responses).toEqual(copy);
  });

  it('empty array → total=0, minimal', () => {
    const result = scoreDRSP([]);
    expect(result.total).toBe(0);
    expect(result.severity).toBe('minimal');
  });
});

// ─────────────────────────────────────────────
// PHQ-9 scoring
// ─────────────────────────────────────────────
describe('scorePHQ9', () => {
  it('all zeros → total=0, severity=minimal, siFlag=false', () => {
    const responses = new Array(9).fill(0) as number[];
    const result: PHQ9Result = scorePHQ9(responses);
    expect(result.total).toBe(0);
    expect(result.severity).toBe('minimal');
    expect(result.item9).toBe(0);
    expect(result.siFlag).toBe(false);
  });

  it('total=4 → minimal', () => {
    const responses = [1, 1, 1, 1, 0, 0, 0, 0, 0] as number[];
    const result = scorePHQ9(responses);
    expect(result.total).toBe(4);
    expect(result.severity).toBe('minimal');
  });

  it('total=5 → mild', () => {
    const responses = [1, 1, 1, 1, 1, 0, 0, 0, 0] as number[];
    const result = scorePHQ9(responses);
    expect(result.total).toBe(5);
    expect(result.severity).toBe('mild');
  });

  it('total=9 → mild (boundary)', () => {
    const responses = [1, 1, 1, 1, 1, 1, 1, 1, 1] as number[];
    const result = scorePHQ9(responses);
    expect(result.total).toBe(9);
    expect(result.severity).toBe('mild');
  });

  it('total=10 → moderate', () => {
    const responses = [2, 2, 2, 2, 2, 0, 0, 0, 0] as number[];
    const result = scorePHQ9(responses);
    expect(result.total).toBe(10);
    expect(result.severity).toBe('moderate');
  });

  it('total=14 → moderate (boundary)', () => {
    const responses = [2, 2, 2, 2, 2, 2, 2, 0, 0] as number[];
    const result = scorePHQ9(responses);
    expect(result.total).toBe(14);
    expect(result.severity).toBe('moderate');
  });

  it('total=15 → moderately-severe', () => {
    const responses = [3, 3, 3, 3, 3, 0, 0, 0, 0] as number[];
    const result = scorePHQ9(responses);
    expect(result.total).toBe(15);
    expect(result.severity).toBe('moderately-severe');
  });

  it('total=19 → moderately-severe (boundary)', () => {
    const responses = [3, 3, 3, 3, 3, 2, 2, 0, 0] as number[];
    const result = scorePHQ9(responses);
    expect(result.total).toBe(19);
    expect(result.severity).toBe('moderately-severe');
  });

  it('total=20 → severe', () => {
    const responses = [3, 3, 3, 3, 3, 3, 2, 0, 0] as number[];
    const result = scorePHQ9(responses);
    expect(result.total).toBe(20);
    expect(result.severity).toBe('severe');
  });

  it('total=27 (max) → severe', () => {
    const responses = new Array(9).fill(3) as number[];
    const result = scorePHQ9(responses);
    expect(result.total).toBe(27);
    expect(result.severity).toBe('severe');
  });

  it('item9=1 → siFlag=true', () => {
    // item9 is the 9th response (index 8), any value ≥ 1 sets siFlag
    const responses = [0, 0, 0, 0, 0, 0, 0, 0, 1] as number[];
    const result = scorePHQ9(responses);
    expect(result.item9).toBe(1);
    expect(result.siFlag).toBe(true);
  });

  it('item9=2 → siFlag=true', () => {
    const responses = [0, 0, 0, 0, 0, 0, 0, 0, 2] as number[];
    const result = scorePHQ9(responses);
    expect(result.item9).toBe(2);
    expect(result.siFlag).toBe(true);
  });

  it('item9=3 → siFlag=true', () => {
    const responses = [0, 0, 0, 0, 0, 0, 0, 0, 3] as number[];
    const result = scorePHQ9(responses);
    expect(result.item9).toBe(3);
    expect(result.siFlag).toBe(true);
  });

  it('item9=0 → siFlag=false', () => {
    const responses = [3, 3, 3, 3, 3, 3, 3, 3, 0] as number[];
    const result = scorePHQ9(responses);
    expect(result.item9).toBe(0);
    expect(result.siFlag).toBe(false);
  });

  it('does not mutate input', () => {
    const responses = [1, 2, 1, 2, 1, 2, 1, 2, 1];
    const copy = [...responses];
    scorePHQ9(responses);
    expect(responses).toEqual(copy);
  });

  it('empty array → total=0, item9=0, siFlag=false', () => {
    const result = scorePHQ9([]);
    expect(result.total).toBe(0);
    expect(result.item9).toBe(0);
    expect(result.siFlag).toBe(false);
  });
});

// ─────────────────────────────────────────────
// ASRS-5 scoring
// ─────────────────────────────────────────────
describe('scoreASRS5', () => {
  it('all zeros → score=0, positiveScreen=false', () => {
    const responses = new Array(5).fill(0) as number[];
    const result: ASRS5Result = scoreASRS5(responses);
    expect(result.score).toBe(0);
    expect(result.positiveScreen).toBe(false);
  });

  it('all fours → score=20, positiveScreen=true', () => {
    const responses = new Array(5).fill(4) as number[];
    const result = scoreASRS5(responses);
    expect(result.score).toBe(20);
    expect(result.positiveScreen).toBe(true);
  });

  it('score=14 → positiveScreen=true (threshold ≥ 14)', () => {
    // 4+4+4+2+0 = 14
    const responses = [4, 4, 4, 2, 0] as number[];
    const result = scoreASRS5(responses);
    expect(result.score).toBe(14);
    expect(result.positiveScreen).toBe(true);
  });

  it('score=13 → positiveScreen=false (just below threshold)', () => {
    // 4+4+4+1+0 = 13
    const responses = [4, 4, 4, 1, 0] as number[];
    const result = scoreASRS5(responses);
    expect(result.score).toBe(13);
    expect(result.positiveScreen).toBe(false);
  });

  it('does not mutate input', () => {
    const responses = [2, 3, 1, 4, 2];
    const copy = [...responses];
    scoreASRS5(responses);
    expect(responses).toEqual(copy);
  });

  it('empty array → score=0, positiveScreen=false', () => {
    const result = scoreASRS5([]);
    expect(result.score).toBe(0);
    expect(result.positiveScreen).toBe(false);
  });
});
