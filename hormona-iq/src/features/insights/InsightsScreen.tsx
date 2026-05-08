// InsightsScreen — DRSP Log Summary & C-PASS Chart screen.
// Composes GateCard, DrspChart, CpassTable.
// Uses useInsightsGate to check data sufficiency.
// Port of design-handoff/08-implementation-code/src/chart.jsx
//
// Porting rules:
//   - Full TypeScript, no `any` types
//   - CSS classes → StyleSheet.create() using token values
//   - 44px minimum tap targets on all interactive elements
//   - accessibilityLabel on ALL interactive elements
//   - useReduceMotion() from react-native-reanimated
//   - Chart rendered via react-native-svg primitives
//   - SafeAreaView from react-native-safe-area-context

import { useEffect, useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useReducedMotion } from 'react-native-reanimated';

import {
  buttons,
  cards,
  layout,
  typography,
} from '../../constants/styles';
import { colors, fonts, radius, spacing } from '../../constants/tokens';
import { useInsightsGate } from '../../hooks/useInsightsGate';

import { GateCard } from './GateCard';
import { DrspChart } from './DrspChart';
import { CpassTable, DRSP_ITEM_LABELS } from './CpassTable';
import { FloatingOrbsSvg } from '../../components/illustrations/BotanicalEmpty';
import type {
  ChartDataPoint,
  CPASSResult,
  CycleAnalysis,
  CycleAnalysisResult,
  DayEntry,
  InsightsState,
} from './types';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function maxConsecutive(dateList: string[]): number {
  if (!dateList.length) return 0;
  const sorted = [...dateList].sort();
  let max = 1;
  let run = 1;
  for (let i = 1; i < sorted.length; i++) {
    const diff = Math.round(
      (new Date(sorted[i]).getTime() - new Date(sorted[i - 1]).getTime()) /
        86400000,
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

    // Suppress unused variable warnings
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

  return {
    cycles,
    completedCycles,
    currentCoverage,
    currentLutealConsec,
    currentFolConsec,
  };
}

// ─────────────────────────────────────────────
// Initial state (demo/fallback data)
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
// InsightsScreen
// ─────────────────────────────────────────────

export default function InsightsScreen(): ReactElement {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const reportMonth = new Date()
    .toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    .toUpperCase();

  const [state, setState] = useState<InsightsState>(INITIAL_STATE);
  const [docEmail, setDocEmail] = useState('');
  const [showReport, setShowReport] = useState(false);
  const [acknowledged, setAcknowledged] = useState(state.drspAcknowledged);
  const [showInterstitial, setShowInterstitial] = useState(false);

  // ── useInsightsGate — real gate from stores ────────────────────────────
  const gate = useInsightsGate();

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

  // ── T-03 2-cycle gate: use gate hook result ───────────────────────────
  const gateMet = gate.hasEnoughData || cycleAnalysis.completedCycles >= 2;

  const acknowledge = (): void => {
    setAcknowledged(true);
    setShowInterstitial(false);
    setState((prev) => ({ ...prev, drspAcknowledged: true }));
    AsyncStorage.setItem('drsp_disclaimer_acked', 'true').catch(() => {});
  };

  // Hydrate disclaimer acknowledgement from persistent storage so it isn't
  // re-shown on every mount once the user has acknowledged it (P3-13).
  useEffect(() => {
    AsyncStorage.getItem('drsp_disclaimer_acked')
      .then((val) => {
        if (val === 'true') {
          setAcknowledged(true);
          setState((prev) => ({ ...prev, drspAcknowledged: true }));
        }
      })
      .catch(() => {});
  }, []);

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
    setState((prev) => ({ ...prev, exportSI: !prev.exportSI }));

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
    setState((prev) => ({
      ...prev,
      passiveAutoOverride: true,
      passiveMode: false,
      passiveModeUntil: null,
    }));

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
        <Text style={[typography.display, { marginBottom: 16 }]}>
          A pattern{' '}
          <Text style={[typography.italicDisplay, { color: colors.eucalyptus }]}>
            worth showing.
          </Text>
        </Text>

        {/* T-03 — 2-cycle gate empty state */}
        {!gateMet && (
          <GateCard
            hasEnoughData={gate.hasEnoughData}
            cyclesLogged={gate.cyclesLogged}
            minimumRequired={gate.minimumRequired}
            daysUntilUnlocked={gate.daysUntilUnlocked}
            moreLutealNeeded={moreLutealNeeded}
            moreFolNeeded={moreFolNeeded}
          />
        )}

        {/* T-03 — disclaimer interstitial gate */}
        {gateMet && !acknowledged && (
          <View style={[cards.cardWarm, { marginBottom: 16 }]}>
            <Text style={[typography.eyebrow, { marginBottom: 8 }]}>
              BEFORE YOU SEE YOUR REPORT
            </Text>
            <Text
              style={[typography.body, { fontSize: 14, marginBottom: 12 }]}
            >
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
          <View
            style={[
              cards.cardWarm,
              { padding: 24, marginBottom: 16, alignItems: 'center' },
            ]}
          >
            <FloatingOrbsSvg size={80} />
            <Text
              style={[
                typography.h2,
                { marginBottom: 8, textAlign: 'center', marginTop: 16 },
              ]}
            >
              Your first chart will show up here.
            </Text>
            <Text
              style={[
                typography.caption,
                { textAlign: 'center', lineHeight: 20 },
              ]}
            >
              Once you've logged for two cycles, I can chart your pattern and
              show you the differential.
            </Text>
            <Pressable
              style={[buttons.primary, { marginTop: 16, alignSelf: 'stretch' }]}
              onPress={() => router.push('/(app)/log')}
              accessibilityRole="button"
              accessibilityLabel="Start logging"
            >
              <Text style={buttons.primaryLabel}>Start logging</Text>
            </Pressable>
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
              <Text
                style={{
                  color: colors.ink,
                  fontFamily: fonts.sansSemibold,
                }}
              >
                {conclusion}
              </Text>
              . This is what your prospective DRSP record shows — not a
              diagnosis.
            </Text>

            {/* DrspChart — tabs + chart + stat tiles */}
            <DrspChart
              data={chartData}
              cycleLen={state.cycleLen}
              lAvg={lAvg}
              fAvg={fAvg}
              completedCycles={cycleAnalysis.completedCycles}
              reduceMotion={reduceMotion ?? false}
            />

            {/* CpassTable — C-PASS criteria + per-symptom breakdown */}
            <CpassTable
              cycles={cycleAnalysis.cycles}
              cycleLen={state.cycleLen}
              totalDaysLoggedCurrentCycle={
                cycleAnalysis.cycles[0]?.totalDaysLogged ?? 0
              }
            />

            {/* T-03 — Explicit SI export opt-in */}
            <View style={[cards.cardWarm, { padding: 16, marginBottom: 16 }]}>
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
                  <Text
                    style={[
                      typography.caption,
                      { fontSize: 11, marginTop: 4 },
                    ]}
                  >
                    Only do this for a clinician you trust. Default: excluded
                    from physician export. Your DRSP item 12 stays on your
                    device unless you turn this on.
                  </Text>
                </View>
              </Pressable>
            </View>

            {/* T-91 — passive mode hides Send / Email / Download CTAs */}
            {!passive && (
              <View
                style={[cards.cardMint, { padding: 24, marginBottom: 24 }]}
              >
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
                    style={[buttons.primary, { flex: 1, opacity: 0.5 }]}
                    onPress={() =>
                      Alert.alert(
                        'Coming soon',
                        'Doctor report sending will be available in a future update.',
                      )
                    }
                    accessibilityRole="button"
                    accessibilityLabel="Send report to doctor (coming soon)"
                  >
                    <Text style={buttons.primaryLabel}>Send (coming soon)</Text>
                  </Pressable>
                  <Pressable
                    style={[buttons.outline, { flex: 1, opacity: 0.5 }]}
                    onPress={() =>
                      Alert.alert(
                        'Coming soon',
                        'PDF download will be available in a future update.',
                      )
                    }
                    accessibilityRole="button"
                    accessibilityLabel="Download PDF report (coming soon)"
                  >
                    <Text style={buttons.outlineLabel}>
                      Download PDF (coming soon)
                    </Text>
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
              <View style={[cards.cardClinical, { padding: 16 }]}>
                {/* Preview header */}
                <View style={s.previewHeader}>
                  <Text style={s.previewHeaderLabel}>
                    YOUR DRSP LOG SUMMARY — {reportMonth}
                  </Text>
                  <Text style={s.previewLogoText}>HormonaIQ</Text>
                </View>
                <Text style={s.previewSubtitle}>
                  Daily Record of Severity of Problems · Endicott et al.,
                  Columbia University
                </Text>
                <DrspChart
                  data={chartData}
                  cycleLen={state.cycleLen}
                  lAvg={lAvg}
                  fAvg={fAvg}
                  completedCycles={cycleAnalysis.completedCycles}
                  reduceMotion={reduceMotion ?? false}
                  mono
                  height={160}
                />
                <Text
                  style={[
                    typography.body,
                    { fontSize: 12, marginTop: 16, lineHeight: 20 },
                  ]}
                >
                  Across 2 cycles your prospective record is{' '}
                  <Text style={{ fontFamily: fonts.sansSemibold }}>
                    {conclusion}
                  </Text>
                  .
                  {!exportSI && (
                    <Text> Item 12 (SI) excluded from this export.</Text>
                  )}
                </Text>
                <Text style={s.previewDisclaimer}>
                  Generated from prospective daily ratings. For clinical
                  review — not a diagnosis.
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
              <Text style={[typography.displaySm, { marginBottom: 16 }]}>
                Before you see your DRSP Log Summary
              </Text>
              <Text
                style={[
                  typography.body,
                  { fontSize: 15, marginBottom: 16, lineHeight: 22 },
                ]}
              >
                The DRSP (Daily Record of Severity of Problems) is a validated
                symptom tracking tool used in clinical settings to support —
                not replace — professional assessment of PMDD.
              </Text>
              <Text
                style={[
                  typography.body,
                  { fontSize: 15, marginBottom: 16, lineHeight: 22 },
                ]}
              >
                Your completed DRSP reflects what you've logged. It does not
                diagnose PMDD. A diagnosis requires evaluation by a licensed
                healthcare provider, typically over at least two cycles.
              </Text>
              <Text
                style={[
                  typography.body,
                  { fontSize: 15, marginBottom: 24, lineHeight: 22 },
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
              <Text style={s.checkGlyph}>✓</Text>
            </View>
            <Text style={[typography.displaySm, { marginBottom: 10 }]}>
              Your report is ready.
            </Text>
            <Text style={[typography.body, { marginBottom: 24 }]}>
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
    paddingHorizontal: 16,
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
    paddingHorizontal: 16,
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
    fontFamily: fonts.sansSemibold,
    fontSize: 13,
    color: colors.ink,
  },
  previewSubtitle: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.ink2,
    marginBottom: 16,
    lineHeight: 18,
  },
  previewDisclaimer: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink2,
    marginTop: 16,
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
    padding: 24,
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
