// Insights — DRSP Log Summary & C-PASS Chart screen.
// Port of design-handoff/08-implementation-code/src/chart.jsx
// Porting rules applied:
//   - Full TypeScript, no `any` types
//   - CSS classes → StyleSheet.create() using token values
//   - 44px minimum tap targets on all interactive elements
//   - accessibilityLabel on ALL interactive elements
//   - useReduceMotion() from react-native-reanimated
//   - window.HQ.useApp() replaced with local useState
//   - goto('screen') replaced with router.push('/(app)/screen')
//   - No console.log statements
//   - Chart rendered via react-native-svg primitives
//   - SafeAreaView from react-native-safe-area-context

import { useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useReducedMotion } from 'react-native-reanimated';
import Svg, {
  Circle,
  G,
  Line,
  Rect,
  Text as SvgText,
} from 'react-native-svg';

import {
  buttons,
  cards,
  layout,
  typography,
} from '../../src/constants/styles';
import { colors, fonts, radius, spacing } from '../../src/constants/tokens';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

interface DRSPValues {
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

interface DayEntry {
  drsp?: DRSPValues;
}

interface InsightsState {
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

interface ChartDataPoint {
  day: number;
  score: number;
  estimated: boolean;
}

interface CPASSResult {
  absoluteSeverity: boolean;
  coreMood: boolean;
  absoluteClearance: boolean;
  cyclicity: boolean;
}

interface CycleAnalysisResult {
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

interface CycleAnalysis {
  cycles: CycleAnalysisResult[];
  completedCycles: number;
  currentCoverage: number;
  currentLutealConsec: number;
  currentFolConsec: number;
}

// ─────────────────────────────────────────────
// DRSP-21 item definitions
// ─────────────────────────────────────────────

interface DRSPItem {
  k: string;
  label: string;
  core: boolean;
}

const DRSP_ITEM_LABELS: DRSPItem[] = [
  { k: 'depressed', label: 'Felt depressed, sad, "down," or "blue"', core: false },
  { k: 'hopeless', label: 'Felt hopeless', core: false },
  { k: 'worthless_guilty', label: 'Felt worthless or guilty', core: false },
  { k: 'anxiety', label: 'Felt anxious, tense, "keyed up," or "on edge"', core: true },
  { k: 'mood_swings', label: 'Mood swings (suddenly tearful, sensitive)', core: true },
  { k: 'rejection_sensitive', label: 'More sensitive to rejection', core: false },
  { k: 'irritability', label: 'Felt angry, irritable', core: true },
  { k: 'conflicts', label: 'Had conflicts or problems with people', core: false },
  { k: 'decreased_interest', label: 'Less interest in usual activities', core: false },
  { k: 'concentration', label: 'Difficulty concentrating', core: false },
  { k: 'fatigue', label: 'Felt lethargic, tired, fatigued, or low energy', core: false },
  { k: 'appetite', label: 'Increased appetite or food cravings', core: false },
  { k: 'hypersomnia', label: 'Slept more / hard to get up', core: false },
  { k: 'insomnia', label: 'Trouble falling or staying asleep', core: false },
  { k: 'overwhelmed', label: 'Felt overwhelmed or unable to cope', core: true },
  { k: 'out_of_control', label: 'Felt out of control', core: false },
  { k: 'breast_tenderness', label: 'Breast tenderness', core: false },
  { k: 'breast_swelling_bloating', label: 'Bloating / weight gain', core: false },
  { k: 'headache', label: 'Headache', core: false },
  { k: 'joint_muscle_pain', label: 'Joint or muscle pain', core: false },
];

// ─────────────────────────────────────────────
// Initial state
// ─────────────────────────────────────────────

const INITIAL_STATE: InsightsState = {
  cycleLen: 28,
  cycleDay: 19,
  lastPeriod: new Date(Date.now() - 19 * 86400000).toISOString().slice(0, 10),
  entries: {},
  drspAcknowledged: false,
  exportSI: false,
  passiveMode: false,
  passiveModeUntil: null,
  passiveAutoOverride: false,
};

// ─────────────────────────────────────────────
// Helper: longest run of consecutive ISO date strings
// ─────────────────────────────────────────────

function maxConsecutive(dateList: string[]): number {
  if (!dateList.length) return 0;
  const sorted = [...dateList].sort();
  let max = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = Math.round(
      (new Date(sorted[i]).getTime() - new Date(sorted[i - 1]).getTime()) / 86400000,
    );
    if (diff === 1) {
      run++;
      max = Math.max(max, run);
    } else {
      run = 1;
    }
  }
  return max;
}

// ─────────────────────────────────────────────
// computeCycleAnalysis — pure helper extracted for useMemo
// ─────────────────────────────────────────────

function computeCycleAnalysis(
  entries: Record<string, DayEntry>,
  cycleLen: number,
  lastPeriodStr: string,
): CycleAnalysis {
  const lastPeriod = new Date(lastPeriodStr);
  const cycles: CycleAnalysisResult[] = [];

  for (let cycleNum = 0; cycleNum < 3; cycleNum++) {
    const cycleStart = new Date(lastPeriod);
    cycleStart.setDate(cycleStart.getDate() - cycleNum * cycleLen);
    const cycleEnd = new Date(cycleStart);
    cycleEnd.setDate(cycleEnd.getDate() + cycleLen - 1);

    const lutealStart = new Date(cycleStart);
    lutealStart.setDate(lutealStart.getDate() + cycleLen - 7);
    const folStart = new Date(cycleStart);
    folStart.setDate(folStart.getDate() + 3);
    const folEnd = new Date(cycleStart);
    folEnd.setDate(folEnd.getDate() + 9);

    let lutealDays = 0;
    let folDays = 0;
    let totalDaysLogged = 0;
    const lutealDateList: string[] = [];
    const folDateList: string[] = [];
    let totalItemsLogged = 0;

    const lutealSums: Record<string, number> = {};
    const folSums: Record<string, number> = {};
    const lutealCounts: Record<string, number> = {};
    const folCounts: Record<string, number> = {};
    const lutealMeans: Record<string, number | null> = {};
    const folMeans: Record<string, number | null> = {};

    DRSP_ITEM_LABELS.forEach((it) => {
      lutealSums[it.k] = 0;
      folSums[it.k] = 0;
      lutealCounts[it.k] = 0;
      folCounts[it.k] = 0;
    });

    for (let d = 0; d < cycleLen; d++) {
      const day = new Date(cycleStart);
      day.setDate(day.getDate() + d);
      const key = day.toISOString().slice(0, 10);
      const e = entries[key];
      if (!e) continue;
      totalDaysLogged++;
      const inLuteal = day >= lutealStart && day <= cycleEnd;
      const inFol = day >= folStart && day <= folEnd;
      if (inLuteal) {
        lutealDays++;
        lutealDateList.push(key);
      }
      if (inFol) {
        folDays++;
        folDateList.push(key);
      }
      let itemsThisDay = 0;
      DRSP_ITEM_LABELS.forEach((it) => {
        const v = e?.drsp?.[it.k];
        if (typeof v === 'number') {
          itemsThisDay++;
          if (inLuteal) {
            lutealSums[it.k] += v;
            lutealCounts[it.k]++;
          }
          if (inFol) {
            folSums[it.k] += v;
            folCounts[it.k]++;
          }
        }
      });
      totalItemsLogged += itemsThisDay;
    }

    DRSP_ITEM_LABELS.forEach((it) => {
      lutealMeans[it.k] = lutealCounts[it.k]
        ? lutealSums[it.k] / lutealCounts[it.k]
        : null;
      folMeans[it.k] = folCounts[it.k]
        ? folSums[it.k] / folCounts[it.k]
        : null;
    });

    const coverage = cycleLen ? totalDaysLogged / cycleLen : 0;
    const lutealConsecutive = maxConsecutive(lutealDateList);
    const folConsecutive = maxConsecutive(folDateList);
    const meanItemsPerDay = totalDaysLogged
      ? totalItemsLogged / totalDaysLogged
      : 0;
    const cycleQualifies =
      lutealConsecutive >= 7 && folConsecutive >= 5 && meanItemsPerDay >= 4;

    const cpass: CPASSResult = {
      absoluteSeverity:
        DRSP_ITEM_LABELS.filter((it) => (lutealMeans[it.k] ?? 0) >= 4).length >= 5,
      coreMood: DRSP_ITEM_LABELS.filter((it) => it.core).some(
        (it) => (lutealMeans[it.k] ?? 0) >= 4,
      ),
      absoluteClearance: DRSP_ITEM_LABELS.every(
        (it) => folMeans[it.k] == null || folMeans[it.k]! <= 3,
      ),
      cyclicity: (() => {
        const allLuteal = DRSP_ITEM_LABELS.map((it) => lutealMeans[it.k]).filter(
          (v): v is number => v != null,
        );
        const allFol = DRSP_ITEM_LABELS.map((it) => folMeans[it.k]).filter(
          (v): v is number => v != null,
        );
        if (!allLuteal.length || !allFol.length) return false;
        const lAvg = allLuteal.reduce((a, b) => a + b, 0) / allLuteal.length;
        const fAvg = allFol.reduce((a, b) => a + b, 0) / allFol.length;
        return ((lAvg - fAvg) / 5) * 100 > 30;
      })(),
    };

    // Suppress unused variable warnings for calculated-but-unused counters
    void lutealDays;
    void folDays;

    cycles.push({
      cycleNum: cycleNum + 1,
      coverage,
      totalDaysLogged,
      lutealConsecutive,
      folConsecutive,
      meanItemsPerDay,
      cycleQualifies,
      lutealMeans,
      folMeans,
      cpass,
    });
  }

  const completedCycles = cycles.filter((c) => c.cycleQualifies).length;
  const currentCoverage = cycles[0]?.coverage ?? 0;
  const currentLutealConsec = cycles[0]?.lutealConsecutive ?? 0;
  const currentFolConsec = cycles[0]?.folConsecutive ?? 0;

  return { cycles, completedCycles, currentCoverage, currentLutealConsec, currentFolConsec };
}

// ─────────────────────────────────────────────
// DRSPChart — SVG bar chart, react-native-svg primitives
// Mirrors DRSPChart() in shared.jsx (T-57)
// ─────────────────────────────────────────────

interface DRSPChartProps {
  data: ChartDataPoint[];
  cycleLen: number;
  mono?: boolean;
  height?: number;
  reduceMotion?: boolean;
}

const PHASE_COLORS_FILL: Record<string, string> = {
  menstrual: colors.rose,
  follicular: colors.sageLight,
  ovulatory: colors.butter,
  luteal: colors.coral,
  lutealDeep: '#C97962',
};

function DRSPChart({
  data,
  cycleLen = 28,
  mono = false,
  height = 200,
}: DRSPChartProps): ReactElement {
  const W = 340;
  const H = height;
  const pad = { l: 28, r: 12, t: 18, b: 26 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const barW = Math.max((innerW / cycleLen) - 2, 4);

  const yFor = (s: number): number => pad.t + innerH - (s / 6) * innerH;
  const xFor = (d: number): number => pad.l + ((d - 1) / cycleLen) * innerW;

  const sevDotColor = (s: number): string => {
    if (mono) return '#3A4A3F';
    if (s <= 2) return colors.severityMild;
    if (s <= 4) return colors.severityMod;
    return colors.severitySevere;
  };

  const barFill = mono ? '#222' : colors.ink;

  const fEnd = Math.round(cycleLen * 0.45);
  const oEnd = Math.round(cycleLen * 0.55);
  const lmEnd = Math.round(cycleLen * 0.78);

  const gridLines = [1, 2, 3, 4, 5, 6];
  const dayLabels = [1, 7, 14, 21, 28].filter((n) => n <= cycleLen);

  // Vertical grid every 7 days
  const vertGridDays: number[] = [];
  for (let n = 7; n <= cycleLen; n += 7) {
    vertGridDays.push(n);
  }

  return (
    <Svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'flex' }}>
      {/* Phase band backgrounds */}
      {!mono && (
        <G opacity={0.18}>
          <Rect
            x={xFor(1)}
            y={pad.t}
            width={xFor(6) - xFor(1)}
            height={innerH}
            fill={PHASE_COLORS_FILL.menstrual}
            rx={4}
          />
          <Rect
            x={xFor(6)}
            y={pad.t}
            width={xFor(fEnd + 1) - xFor(6)}
            height={innerH}
            fill={PHASE_COLORS_FILL.follicular}
            rx={4}
          />
          <Rect
            x={xFor(fEnd + 1)}
            y={pad.t}
            width={xFor(oEnd + 1) - xFor(fEnd + 1)}
            height={innerH}
            fill={PHASE_COLORS_FILL.ovulatory}
            rx={4}
          />
          <Rect
            x={xFor(oEnd + 1)}
            y={pad.t}
            width={xFor(lmEnd + 1) - xFor(oEnd + 1)}
            height={innerH}
            fill={PHASE_COLORS_FILL.luteal}
            rx={4}
          />
          <Rect
            x={xFor(lmEnd + 1)}
            y={pad.t}
            width={
              xFor(Math.max(cycleLen - 4, lmEnd + 2)) - xFor(lmEnd + 1)
            }
            height={innerH}
            fill={PHASE_COLORS_FILL.lutealDeep}
            rx={4}
          />
          {cycleLen > 5 && (
            <Rect
              x={xFor(Math.max(cycleLen - 4, lmEnd + 2))}
              y={pad.t}
              width={
                xFor(cycleLen + 1) -
                xFor(Math.max(cycleLen - 4, lmEnd + 2))
              }
              height={innerH}
              fill={PHASE_COLORS_FILL.menstrual}
              rx={4}
            />
          )}
        </G>
      )}

      {/* Horizontal severity gridlines + Y-axis labels */}
      {gridLines.map((s) => (
        <G key={`grid-h-${s}`}>
          <Line
            x1={pad.l}
            x2={W - pad.r}
            y1={yFor(s)}
            y2={yFor(s)}
            stroke={mono ? '#ddd' : 'rgba(60,95,75,0.10)'}
            strokeWidth={0.5}
            strokeDasharray={s % 2 ? undefined : '2 3'}
          />
          <SvgText
            x={pad.l - 6}
            y={yFor(s) + 3}
            textAnchor="end"
            fontFamily={fonts.mono}
            fontSize={10}
            fill={mono ? '#444' : colors.ink2}
          >
            {s}
          </SvgText>
        </G>
      ))}

      {/* Vertical grid every 7 days */}
      {!mono &&
        vertGridDays.map((n) => (
          <Line
            key={`grid-v-${n}`}
            x1={xFor(n)}
            x2={xFor(n)}
            y1={pad.t}
            y2={pad.t + innerH}
            stroke="rgba(60,95,75,0.08)"
            strokeWidth={0.6}
          />
        ))}

      {/* Bars + severity dots */}
      {data.map((d) => {
        const barHeight = pad.t + innerH - yFor(d.score);
        const bx = xFor(d.day) + 1;
        const by = yFor(d.score);
        const dotY = Math.max(by - 4, pad.t - 4);
        return (
          <G key={`bar-${d.day}`}>
            <Rect
              x={bx}
              y={by}
              width={barW}
              height={barHeight}
              fill={barFill}
              opacity={d.estimated ? 0.35 : 0.85}
              rx={3}
            />
            {!mono && d.score >= 1 && (
              <Circle
                cx={bx + barW / 2}
                cy={dotY}
                r={2.4}
                fill={sevDotColor(d.score)}
                opacity={0.9}
              />
            )}
          </G>
        );
      })}

      {/* X-axis day labels */}
      {dayLabels.map((n) => (
        <SvgText
          key={`day-label-${n}`}
          x={xFor(n) + 2}
          y={H - 6}
          fontFamily={fonts.mono}
          fontSize={10}
          fill={mono ? '#444' : colors.ink2}
        >
          {n}
        </SvgText>
      ))}
    </Svg>
  );
}

// ─────────────────────────────────────────────
// PhaseLegend — compact 5-phase legend strip
// ─────────────────────────────────────────────

const PHASE_LEGEND_ITEMS: Array<{ k: string; n: string; color: string }> = [
  { k: 'F', n: 'Follicular', color: colors.sageLight },
  { k: 'O', n: 'Ovulatory', color: colors.butter },
  { k: 'Lm', n: 'Early luteal', color: colors.coral },
  { k: 'Ls', n: 'Late luteal', color: '#C97962' },
  { k: 'M', n: 'Menstrual', color: colors.rose },
];

function PhaseLegend(): ReactElement {
  return (
    <View style={s.legendRow}>
      {PHASE_LEGEND_ITEMS.map((it) => (
        <View key={it.k} style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: it.color }]} />
          <Text style={s.legendLabel}>{it.n}</Text>
        </View>
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────
// InsightsScreen
// ─────────────────────────────────────────────

export default function InsightsScreen(): ReactElement {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [state, setState] = useState<InsightsState>(INITIAL_STATE);
  const [docEmail, setDocEmail] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [tab, setTab] = useState<'severity' | 'mood' | 'fog'>('severity');
  const [acknowledged, setAcknowledged] = useState(state.drspAcknowledged);
  const [showInterstitial, setShowInterstitial] = useState(false);

  // ── Cycle analysis (C-PASS, per-cycle stats) ───────────────────────────
  const cycleAnalysis = useMemo<CycleAnalysis>(
    () =>
      computeCycleAnalysis(state.entries, state.cycleLen, state.lastPeriod),
    [state.entries, state.cycleLen, state.lastPeriod],
  );

  // ── Mock chart data for visualization ─────────────────────────────────
  const chartData = useMemo<ChartDataPoint[]>(() => {
    const arr: ChartDataPoint[] = [];
    for (let d = 1; d <= state.cycleLen; d++) {
      let score: number;
      if (d <= 5) score = 4 + (d % 2);
      else if (d <= 12) score = 1 + (d % 2 === 0 ? 1 : 0);
      else if (d <= 18) score = 2 + (d % 2);
      else score = Math.min(6, 3 + Math.floor((d - 18) / 2));
      arr.push({ day: d, score, estimated: d === 9 || d === 16 });
    }
    return arr;
  }, [state.cycleLen]);

  // ── Phase window averages for stat tiles ──────────────────────────────
  const lutealWindow = chartData.filter(
    (d) => d.day > Math.round(state.cycleLen * 0.55),
  );
  const follicularWindow = chartData.filter(
    (d) => d.day > 5 && d.day <= Math.round(state.cycleLen * 0.45),
  );
  const lAvg =
    lutealWindow.length > 0
      ? (
          lutealWindow.reduce((a, b) => a + b.score, 0) / lutealWindow.length
        ).toFixed(1)
      : '—';
  const fAvg =
    follicularWindow.length > 0
      ? (
          follicularWindow.reduce((a, b) => a + b.score, 0) /
          follicularWindow.length
        ).toFixed(1)
      : '—';

  const loggedDays = Object.keys(state.entries).length;

  // ── T-03 2-cycle gate ──────────────────────────────────────────────────
  const gateMet = cycleAnalysis.completedCycles >= 2;

  const acknowledge = (): void => {
    setAcknowledged(true);
    setShowInterstitial(false);
    setState((s) => ({ ...s, drspAcknowledged: true }));
  };

  // ── Pattern conclusion language ────────────────────────────────────────
  const overallCpass = cycleAnalysis.cycles.slice(0, 2);
  const allMet =
    overallCpass.length >= 2 &&
    overallCpass.every(
      (c) =>
        c.cpass.absoluteSeverity &&
        c.cpass.coreMood &&
        c.cpass.absoluteClearance &&
        c.cpass.cyclicity,
    );
  const someMet = overallCpass.some(
    (c) =>
      c.cpass.absoluteSeverity ||
      c.cpass.coreMood ||
      c.cpass.absoluteClearance ||
      c.cpass.cyclicity,
  );
  const conclusion = !gateMet
    ? 'not sufficient to assess'
    : allMet
      ? 'consistent with PMDD'
      : someMet
        ? 'not sufficient to assess'
        : 'inconsistent with PMDD';

  const exportSI = state.exportSI;
  const toggleExportSI = (): void =>
    setState((s) => ({ ...s, exportSI: !s.exportSI }));

  // ── T-91 passive mode ──────────────────────────────────────────────────
  const cycleLen2 = state.cycleLen || 28;
  const lutealPeakStart2 = Math.round(cycleLen2 * 0.78);
  const inLutealPeak2 =
    state.cycleDay >= lutealPeakStart2 - 2 &&
    state.cycleDay <= cycleLen2 - 5;
  const passiveActiveByTime2 =
    !!state.passiveModeUntil && Date.now() < state.passiveModeUntil;
  const passiveAuto2 = inLutealPeak2 && state.passiveAutoOverride !== true;
  const passive =
    state.passiveMode || passiveActiveByTime2 || passiveAuto2;

  const showShareOptions = (): void =>
    setState((s) => ({
      ...s,
      passiveAutoOverride: true,
      passiveMode: false,
      passiveModeUntil: null,
    }));

  // ── C-PASS criterion rows ──────────────────────────────────────────────
  const cpassCriteria: Array<{ k: keyof CPASSResult; l: string }> = [
    { k: 'absoluteSeverity', l: '≥5 items reach ≥4 in luteal' },
    { k: 'coreMood', l: 'At least 1 core mood item ≥4' },
    { k: 'absoluteClearance', l: 'No symptom > 3 in follicular' },
    { k: 'cyclicity', l: 'Luteal–follicular gap > 30%' },
  ];

  // ── Gate missing days display ──────────────────────────────────────────
  const moreLutealNeeded = Math.max(0, 7 - cycleAnalysis.currentLutealConsec);
  const moreFolNeeded = Math.max(0, 5 - cycleAnalysis.currentFolConsec);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.cream }}
        contentContainerStyle={[layout.screen, { paddingBottom: 48 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Eyebrow + heading */}
        <View style={s.eyebrowRow}>
          <Text style={[typography.eyebrow, { color: colors.butterDeep }]}>
            YOUR DRSP LOG SUMMARY
          </Text>
        </View>
        <Text style={[typography.display, { marginBottom: 14 }]}>
          A pattern{' '}
          <Text style={[typography.italicDisplay, { color: colors.eucalyptus }]}>
            worth showing.
          </Text>
        </Text>

        {/* T-03 — 2-cycle gate empty state */}
        {!gateMet && (
          <View
            style={[
              cards.cardWarm,
              s.gateCard,
              { marginBottom: 18 },
            ]}
          >
            <Text style={[typography.eyebrow, { marginBottom: 8 }]}>
              YOUR DRSP REPORT
            </Text>
            <Text style={[typography.body, { marginBottom: 8 }]}>
              Your DRSP report needs 2 cycles with at least 7 consecutive
              luteal-phase days and 5 consecutive follicular-phase days each
              (per C-PASS / spec §6.3).
            </Text>
            <Text style={[typography.caption, { fontSize: 13 }]}>
              Cycle{' '}
              <Text style={{ fontFamily: fonts.sansSemibold }}>
                {cycleAnalysis.completedCycles + 1}
              </Text>{' '}
              · need{' '}
              <Text style={{ fontFamily: fonts.sansSemibold }}>
                {moreLutealNeeded}
              </Text>{' '}
              more luteal day{moreLutealNeeded === 1 ? '' : 's'} ·{' '}
              <Text style={{ fontFamily: fonts.sansSemibold }}>
                {moreFolNeeded}
              </Text>{' '}
              more follicular day{moreFolNeeded === 1 ? '' : 's'}.
            </Text>
          </View>
        )}

        {/* T-03 — disclaimer interstitial gate */}
        {gateMet && !acknowledged && (
          <View style={[cards.cardWarm, { marginBottom: 18 }]}>
            <Text style={[typography.eyebrow, { marginBottom: 8 }]}>
              BEFORE YOU SEE YOUR REPORT
            </Text>
            <Text style={[typography.body, { fontSize: 14, marginBottom: 12 }]}>
              Tap below to read the disclaimer and reveal your report.
            </Text>
            <Pressable
              style={buttons.primary}
              onPress={() => setShowInterstitial(true)}
              accessibilityRole="button"
              accessibilityLabel="Read disclaimer before viewing report"
            >
              <Text style={buttons.primaryLabel}>Read disclaimer</Text>
            </Pressable>
          </View>
        )}

        {/* Empty state for no logs at all */}
        {loggedDays === 0 && (
          <View style={[cards.cardWarm, { padding: 22, marginBottom: 18, alignItems: 'center' }]}>
            <Text style={[typography.h2, { marginBottom: 8, textAlign: 'center' }]}>
              Your first chart will show up here.
            </Text>
            <Text style={[typography.caption, { textAlign: 'center', lineHeight: 20 }]}>
              Once you've logged for two cycles, I can chart your pattern and
              show you the differential.
            </Text>
          </View>
        )}

        {/* Main content — only shown when gate met + acknowledged */}
        {gateMet && acknowledged && (
          <>
            <Text
              style={[
                typography.body,
                { color: colors.ink2, marginBottom: 20 },
              ]}
            >
              Across two completed cycles, your data is{' '}
              <Text style={{ color: colors.ink, fontFamily: fonts.sansSemibold }}>
                {conclusion}
              </Text>
              . This is what your prospective DRSP record shows — not a
              diagnosis.
            </Text>

            {/* T-17 sub-tabs */}
            <View style={s.tabPill}>
              {(
                [
                  { k: 'severity' as const, l: 'Severity' },
                  { k: 'mood' as const, l: 'Mood' },
                  { k: 'fog' as const, l: 'Brain fog' },
                ] as const
              ).map((t) => (
                <Pressable
                  key={t.k}
                  style={[s.tabPillBtn, tab === t.k && s.tabPillBtnActive]}
                  onPress={() => setTab(t.k)}
                  accessibilityRole="tab"
                  accessibilityLabel={`Switch to ${t.l} tab`}
                  accessibilityState={{ selected: tab === t.k }}
                >
                  <Text
                    style={[
                      s.tabPillLabel,
                      tab === t.k && s.tabPillLabelActive,
                    ]}
                  >
                    {t.l}
                  </Text>
                </Pressable>
              ))}
            </View>

            {/* Severity tab */}
            {tab === 'severity' && (
              <>
                <View style={{ marginBottom: 8 }}>
                  <DRSPChart
                    data={chartData}
                    cycleLen={state.cycleLen}
                    height={210}
                    reduceMotion={reduceMotion ?? false}
                  />
                </View>
                <View style={{ marginBottom: 14, alignItems: 'center' }}>
                  <PhaseLegend />
                </View>
              </>
            )}

            {/* Mood tab */}
            {tab === 'mood' && (
              <View style={[cards.cardWarm, { padding: 14, marginBottom: 12 }]}>
                <Text style={[typography.caption, { marginBottom: 10 }]}>
                  Mood distribution by cycle phase
                </Text>
                <Text style={[typography.caption, { fontSize: 11 }]}>
                  Aggregated across your logged cycles.
                </Text>
              </View>
            )}

            {/* Brain fog tab */}
            {tab === 'fog' && (
              <View style={{ marginBottom: 12 }}>
                <DRSPChart
                  data={chartData}
                  cycleLen={state.cycleLen}
                  height={210}
                  reduceMotion={reduceMotion ?? false}
                />
                <Text style={[typography.caption, { marginTop: 6 }]}>
                  Concentration (DRSP item) trend across your logged days.
                </Text>
              </View>
            )}

            {/* Stat tiles: Luteal avg / Follicular avg / Cycles */}
            <View style={s.statRow}>
              <View style={[cards.cardWarm, s.statTile]}>
                <Text style={typography.caption}>Luteal avg</Text>
                <Text
                  style={[
                    typography.data,
                    { fontSize: 24, color: colors.severitySevere, fontFamily: fonts.sansMedium },
                  ]}
                >
                  {lAvg}
                </Text>
              </View>
              <View style={[cards.cardWarm, s.statTile]}>
                <Text style={typography.caption}>Follicular avg</Text>
                <Text
                  style={[
                    typography.data,
                    { fontSize: 24, color: colors.severityMild, fontFamily: fonts.sansMedium },
                  ]}
                >
                  {fAvg}
                </Text>
              </View>
              <View style={[cards.cardWarm, s.statTile]}>
                <Text style={typography.caption}>Cycles</Text>
                <Text
                  style={[
                    typography.data,
                    { fontSize: 24, color: colors.ink, fontFamily: fonts.sansMedium },
                  ]}
                >
                  {cycleAnalysis.completedCycles}
                </Text>
              </View>
            </View>

            {/* T-03 — C-PASS 4-criterion table */}
            <View
              style={[
                cards.cardWarm,
                { padding: 14, marginBottom: 16 },
              ]}
            >
              <Text style={[typography.eyebrow, { marginBottom: 10 }]}>
                C-PASS · 4 CRITERIA · 2 CYCLES
              </Text>
              {/* Table header */}
              <View style={[s.tableRow, s.tableHeaderRow]}>
                <Text style={[s.tableCell, s.tableCellFlex, s.tableHeaderText]}>
                  Criterion
                </Text>
                <Text style={[s.tableCell, s.tableCellFixed, s.tableHeaderText, { textAlign: 'center' }]}>
                  Cycle 1
                </Text>
                <Text style={[s.tableCell, s.tableCellFixed, s.tableHeaderText, { textAlign: 'center' }]}>
                  Cycle 2
                </Text>
              </View>
              {/* Table body */}
              {cpassCriteria.map((row) => (
                <View key={row.k} style={[s.tableRow, s.tableBodyRow]}>
                  <Text style={[s.tableCell, s.tableCellFlex, s.tableBodyText]}>
                    {row.l}
                  </Text>
                  <Text
                    style={[
                      s.tableCell,
                      s.tableCellFixed,
                      s.tableBodyText,
                      { textAlign: 'center' },
                    ]}
                  >
                    {cycleAnalysis.cycles[0]?.cpass[row.k] ? '✓' : '○'}
                  </Text>
                  <Text
                    style={[
                      s.tableCell,
                      s.tableCellFixed,
                      s.tableBodyText,
                      { textAlign: 'center' },
                    ]}
                  >
                    {cycleAnalysis.cycles[1]?.cpass[row.k] ? '✓' : '○'}
                  </Text>
                </View>
              ))}
              <Text style={[typography.caption, { fontSize: 10, marginTop: 8, lineHeight: 16 }]}>
                C-PASS · Carolina Premenstrual Assessment Scoring System (Rubinow
                et al. 2017, PMC5205545)
              </Text>
            </View>

            {/* T-03 — Per-symptom table */}
            <View
              style={[
                cards.cardWarm,
                { padding: 14, marginBottom: 16 },
              ]}
            >
              <Text style={[typography.eyebrow, { marginBottom: 10 }]}>
                PER-SYMPTOM · 11 ITEMS · LUTEAL VS FOLLICULAR
              </Text>
              {/* Table header */}
              <View style={[s.tableRow, s.tableHeaderRow]}>
                <Text style={[s.tableCell, s.tableCellFlex, s.tableHeaderText]}>
                  Symptom
                </Text>
                <Text
                  style={[
                    s.tableCell,
                    s.tableCellFixed,
                    s.tableHeaderText,
                    { textAlign: 'center' },
                  ]}
                >
                  Luteal
                </Text>
                <Text
                  style={[
                    s.tableCell,
                    s.tableCellFixed,
                    s.tableHeaderText,
                    { textAlign: 'center' },
                  ]}
                >
                  Follicular
                </Text>
              </View>
              {/* Symptom rows */}
              {DRSP_ITEM_LABELS.map((it) => {
                const c1 = cycleAnalysis.cycles[0];
                const lAvgItem = c1?.lutealMeans?.[it.k] ?? null;
                const fAvgItem = c1?.folMeans?.[it.k] ?? null;
                return (
                  <View key={it.k} style={[s.tableRow, s.tableBodyRow]}>
                    <Text style={[s.tableCell, s.tableCellFlex, s.tableBodyText]}>
                      {it.label}
                      {it.core ? ' *' : ''}
                    </Text>
                    <Text
                      style={[
                        s.tableCell,
                        s.tableCellFixed,
                        s.tableMonoText,
                        { textAlign: 'center' },
                      ]}
                    >
                      {lAvgItem != null ? lAvgItem.toFixed(1) : '—'}
                    </Text>
                    <Text
                      style={[
                        s.tableCell,
                        s.tableCellFixed,
                        s.tableMonoText,
                        { textAlign: 'center' },
                      ]}
                    >
                      {fAvgItem != null ? fAvgItem.toFixed(1) : '—'}
                    </Text>
                  </View>
                );
              })}
              <Text style={[typography.caption, { fontSize: 10, marginTop: 8 }]}>
                * core mood items (anxiety, mood swings, irritability, overwhelmed)
              </Text>
            </View>

            {/* Days logged caption */}
            <Text style={[typography.caption, { marginBottom: 28 }]}>
              {cycleAnalysis.cycles[0]?.totalDaysLogged ?? 0} of {state.cycleLen}{' '}
              days logged in current cycle.
            </Text>

            {/* T-03 — Explicit SI export opt-in */}
            <View style={[cards.cardWarm, { padding: 14, marginBottom: 16 }]}>
              <Pressable
                style={s.siRow}
                onPress={toggleExportSI}
                accessibilityRole="checkbox"
                accessibilityLabel="Include suicidal ideation tracking in this export"
                accessibilityState={{ checked: exportSI }}
              >
                <Switch
                  value={exportSI}
                  onValueChange={toggleExportSI}
                  trackColor={{
                    false: colors.border,
                    true: colors.eucalyptus,
                  }}
                  thumbColor={colors.paper}
                  accessibilityLabel="Toggle SI export"
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      typography.body,
                      { fontSize: 13, fontFamily: fonts.sansSemibold },
                    ]}
                  >
                    Include suicidal ideation tracking in this export
                  </Text>
                  <Text style={[typography.caption, { fontSize: 11, marginTop: 4 }]}>
                    Only do this for a clinician you trust. Default: excluded from
                    physician export. Your DRSP item 12 stays on your device unless
                    you turn this on.
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* T-91 — passive mode hides Send / Email / Download CTAs */}
            {!passive && (
              <View style={[cards.cardMint, { padding: 22, marginBottom: 24 }]}>
                <Text style={[typography.h2, { marginBottom: 8 }]}>
                  Bring this to your appointment
                </Text>
                <Text
                  style={[
                    typography.body,
                    { marginBottom: 16, color: colors.ink2, fontSize: 14 },
                  ]}
                >
                  Ready to talk to your doctor? Here's how to share this
                  report.
                </Text>
                <TextInput
                  style={s.emailInput}
                  placeholder="Your doctor's email"
                  placeholderTextColor={colors.ink3}
                  value={docEmail}
                  onChangeText={setDocEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  accessibilityLabel="Doctor's email address"
                />
                <View style={[s.ctaRow, { marginTop: 12 }]}>
                  <Pressable
                    style={[buttons.primary, { flex: 1 }]}
                    onPress={() => setShowReport(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Send report to doctor"
                  >
                    <Text style={buttons.primaryLabel}>Send</Text>
                  </Pressable>
                  <Pressable
                    style={[buttons.outline, { flex: 1 }]}
                    onPress={() => setShowReport(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Download PDF report"
                  >
                    <Text style={buttons.outlineLabel}>Download PDF</Text>
                  </Pressable>
                </View>
              </View>
            )}

            {passive && (
              <View style={s.quietView}>
                <Text style={s.quietViewText}>
                  Quiet view — sharing actions are hidden today.{' '}
                  {passiveAuto2 && (
                    <Text
                      style={s.quietViewLink}
                      onPress={showShareOptions}
                      accessibilityRole="button"
                      accessibilityLabel="Show share options"
                    >
                      Show share options
                    </Text>
                  )}
                </Text>
              </View>
            )}

            {/* Report preview — warm-paper aesthetic */}
            <View>
              <Text style={[typography.eyebrow, { marginBottom: 10 }]}>
                Report preview
              </Text>
              <View style={[cards.cardClinical, { padding: 18 }]}>
                {/* Preview header */}
                <View style={s.previewHeader}>
                  <Text style={s.previewHeaderLabel}>
                    YOUR DRSP LOG SUMMARY — APR 2026
                  </Text>
                  {/* Logo text stand-in */}
                  <Text style={[s.previewLogoText]}>HormonaIQ</Text>
                </View>
                <Text style={s.previewSubtitle}>
                  Daily Record of Severity of Problems · Endicott et al.,
                  Columbia University
                </Text>
                <DRSPChart
                  data={chartData}
                  cycleLen={state.cycleLen}
                  mono
                  height={160}
                  reduceMotion={reduceMotion ?? false}
                />
                <Text style={[typography.body, { fontSize: 12, marginTop: 14, lineHeight: 20 }]}>
                  Across 2 cycles your prospective record is{' '}
                  <Text style={{ fontFamily: fonts.sansSemibold }}>{conclusion}</Text>.
                  {!exportSI && (
                    <Text> Item 12 (SI) excluded from this export.</Text>
                  )}
                </Text>
                <Text style={s.previewDisclaimer}>
                  Generated from prospective daily ratings. For clinical review
                  — not a diagnosis.
                </Text>
              </View>
            </View>
          </>
        )}

        {/* Navigation link back to log */}
        <Pressable
          style={s.navLink}
          onPress={() => router.push('/(app)/log')}
          accessibilityRole="button"
          accessibilityLabel="Go to log screen"
        >
          <Text style={s.navLinkText}>Log today →</Text>
        </Pressable>
      </ScrollView>

      {/* T-03 — full-screen disclaimer interstitial */}
      <Modal
        visible={showInterstitial}
        animationType={reduceMotion ? 'none' : 'slide'}
        transparent
        onRequestClose={() => setShowInterstitial(false)}
      >
        <View style={s.modalBackdrop}>
          <View style={s.modalSheet}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                style={[
                  typography.eyebrow,
                  { marginBottom: 10, color: colors.butterDeep },
                ]}
              >
                IMPORTANT
              </Text>
              <Text style={[typography.displaySm, { marginBottom: 14 }]}>
                Before you see your DRSP Log Summary
              </Text>
              <Text
                style={[
                  typography.body,
                  { fontSize: 14, marginBottom: 14, lineHeight: 22 },
                ]}
              >
                The DRSP (Daily Record of Severity of Problems) is a validated
                symptom tracking tool used in clinical settings to support — not
                replace — professional assessment of PMDD.
              </Text>
              <Text
                style={[
                  typography.body,
                  { fontSize: 14, marginBottom: 14, lineHeight: 22 },
                ]}
              >
                Your completed DRSP reflects what you've logged. It does not
                diagnose PMDD. A diagnosis requires evaluation by a licensed
                healthcare provider, typically over at least two cycles.
              </Text>
              <Text
                style={[
                  typography.body,
                  { fontSize: 14, marginBottom: 22, lineHeight: 22 },
                ]}
              >
                You are encouraged to share this report with your provider.
              </Text>
              <Pressable
                style={[buttons.primary, { height: 56 }]}
                onPress={acknowledge}
                accessibilityRole="button"
                accessibilityLabel="I understand, show my report"
              >
                <Text style={buttons.primaryLabel}>I understand</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Report-ready confirmation modal */}
      <Modal
        visible={showReport}
        animationType={reduceMotion ? 'none' : 'fade'}
        transparent
        onRequestClose={() => setShowReport(false)}
      >
        <Pressable
          style={s.modalBackdrop}
          onPress={() => setShowReport(false)}
          accessibilityRole="button"
          accessibilityLabel="Close report modal"
        >
          <Pressable style={s.modalCard} onPress={(e) => e.stopPropagation()}>
            <View style={s.checkCircle}>
              {/* Check mark */}
              <Text style={s.checkGlyph}>✓</Text>
            </View>
            <Text style={[typography.displaySm, { marginBottom: 10 }]}>
              Your report is ready.
            </Text>
            <Text style={[typography.body, { marginBottom: 22 }]}>
              {docEmail ? `Sent to ${docEmail}.` : 'PDF prepared.'} Saved in
              My Reports.
            </Text>
            <Pressable
              style={buttons.primary}
              onPress={() => setShowReport(false)}
              accessibilityRole="button"
              accessibilityLabel="Done, close report modal"
            >
              <Text style={buttons.primaryLabel}>Done</Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const s = StyleSheet.create({
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: 12,
  },
  gateCard: {
    borderLeftWidth: 3,
    borderLeftColor: colors.butterDeep,
    padding: 22,
  },
  tabPill: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    backgroundColor: colors.mintPale,
    borderRadius: radius.pill,
    marginBottom: 14,
    alignSelf: 'flex-start',
  },
  tabPillBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    minHeight: 44,
    borderRadius: radius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabPillBtnActive: {
    backgroundColor: colors.eucalyptus,
  },
  tabPillLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.ink2,
  },
  tabPillLabelActive: {
    color: colors.paper,
  },
  statRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: 16,
  },
  statTile: {
    flex: 1,
    padding: 14,
    alignItems: 'flex-start',
  },
  // Table styles
  tableRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tableHeaderRow: {
    borderBottomWidth: 1,
    borderBottomColor: colors.ink,
    paddingBottom: 4,
    marginBottom: 2,
  },
  tableBodyRow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    paddingVertical: 4,
  },
  tableCell: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  tableCellFlex: {
    flex: 1,
  },
  tableCellFixed: {
    width: 64,
    flexShrink: 0,
  },
  tableHeaderText: {
    fontFamily: fonts.sansSemibold,
    fontSize: 11,
    color: colors.ink,
  },
  tableBodyText: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink,
    lineHeight: 16,
  },
  tableMonoText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.ink,
  },
  siRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    minHeight: 44,
  },
  emailInput: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink,
    backgroundColor: colors.paper,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  quietView: {
    marginBottom: 24,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  quietViewText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.ink3,
    textAlign: 'center',
    lineHeight: 18,
  },
  quietViewLink: {
    color: colors.eucalyptus,
    textDecorationLine: 'underline',
  },
  previewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.ink,
    paddingBottom: 10,
    marginBottom: 12,
  },
  previewHeaderLabel: {
    fontFamily: fonts.sansSemibold,
    fontSize: 11,
    letterSpacing: 0.66,
    color: colors.ink,
    flex: 1,
    marginRight: 8,
  },
  previewLogoText: {
    fontFamily: fonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 13,
    color: colors.ink,
  },
  previewSubtitle: {
    fontFamily: fonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 12,
    color: colors.ink2,
    marginBottom: 14,
    lineHeight: 18,
  },
  previewDisclaimer: {
    fontFamily: fonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 11,
    color: colors.ink2,
    marginTop: 14,
    lineHeight: 16,
  },
  navLink: {
    alignSelf: 'center',
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44,
    justifyContent: 'center',
  },
  navLinkText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.eucalyptus,
  },
  // Legend
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink2,
  },
  // Modals
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(27, 46, 37, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: 24,
    paddingBottom: 40,
    maxHeight: '92%',
  },
  modalCard: {
    backgroundColor: colors.paper,
    borderRadius: radius.lg,
    padding: 28,
    marginHorizontal: 20,
    marginBottom: 80,
    alignItems: 'center',
  },
  checkCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.mintMist,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  checkGlyph: {
    fontFamily: fonts.sansSemibold,
    fontSize: 24,
    color: colors.eucalyptus,
  },
});
