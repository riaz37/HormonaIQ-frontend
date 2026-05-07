// Ora — Clinical intelligence screen.
// Port of design-handoff/08-implementation-code/src/ora.jsx
// Features: T-91 passive mode, T-78 first-session transparency, T-12 food logging,
// T-14 pattern engine, T-41 observation disclaimer, appointment prep modal.

import { useMemo, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { useEffect } from 'react';

import {
  buttons,
  cards,
  layout,
  typography,
} from '../../src/constants/styles';
import { colors, fonts, radius, spacing } from '../../src/constants/tokens';

// ─────────────────────────────────────────────
// Local types
// ─────────────────────────────────────────────

interface FoodEntry {
  text: string;
  ts: number;
}

interface OraFeedbackEntry {
  [insightId: string]: 'helpful' | 'not_relevant' | 'wrong';
}

interface OraState {
  cycleDay: number;
  cycleLen: number;
  passiveMode: boolean;
  passiveModeUntil: number | null;
  passiveAutoOverride: boolean;
  entries: Record<string, unknown>;
  ed_safe_mode: 'yes' | 'no' | null;
  voiceFoodEntries: FoodEntry[];
  oraFeedback: OraFeedbackEntry;
}

const INITIAL_STATE: OraState = {
  cycleDay: 19,
  cycleLen: 28,
  passiveMode: false,
  passiveModeUntil: null,
  passiveAutoOverride: false,
  entries: {},
  ed_safe_mode: null,
  voiceFoodEntries: [],
  oraFeedback: {},
};

type PatternState = 'empty' | 'early' | 'confirmed';

// ─────────────────────────────────────────────
// DRSP mock data — mirrors ora.jsx useMemo
// ─────────────────────────────────────────────

interface DRSPDataPoint {
  day: number;
  score: number;
}

function buildMockDRSPData(): DRSPDataPoint[] {
  const arr: DRSPDataPoint[] = [];
  for (let d = 1; d <= 28; d++) {
    let s: number;
    if (d <= 5) s = 4 + (d % 2);
    else if (d <= 12) s = 1 + (d % 2);
    else if (d <= 18) s = 2 + (d % 2);
    else s = Math.min(6, 3 + Math.floor((d - 18) / 2));
    arr.push({ day: d, score: s });
  }
  return arr;
}

// ─────────────────────────────────────────────
// DRSPChartSimple — inline RN substitute for the web DRSPChart component.
// Renders a segmented bar chart without SVG dependencies.
// ─────────────────────────────────────────────

interface DRSPChartProps {
  data: DRSPDataPoint[];
  height?: number;
}

function DRSPChartSimple({ data, height = 180 }: DRSPChartProps): ReactElement {
  const barMaxH = height - 32;
  return (
    <View style={[chartStyles.wrap, { height }]}>
      <View style={chartStyles.barsRow}>
        {data.map((d) => {
          const barH = Math.max(4, (d.score / 6) * barMaxH);
          const severityColor =
            d.score <= 2
              ? colors.severityMild
              : d.score <= 4
              ? colors.severityMod
              : colors.severitySevere;
          return (
            <View key={d.day} style={chartStyles.barWrap}>
              <View
                style={[
                  chartStyles.bar,
                  { height: barH, backgroundColor: colors.ink, opacity: 0.82 },
                ]}
              />
              <View
                style={[
                  chartStyles.severityDot,
                  { backgroundColor: severityColor },
                ]}
              />
            </View>
          );
        })}
      </View>
      <View style={chartStyles.axisRow}>
        {[1, 7, 14, 21, 28].map((n) => (
          <Text key={n} style={chartStyles.axisLabel}>
            {n}
          </Text>
        ))}
      </View>
    </View>
  );
}

const chartStyles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    padding: 10,
    overflow: 'hidden',
  },
  barsRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1,
  },
  barWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '100%',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  severityDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 2,
  },
  axisRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  axisLabel: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.ink2,
  },
});

// ─────────────────────────────────────────────
// OraFeedbackRow — mirrors shared.jsx OraFeedback component
// ─────────────────────────────────────────────

interface OraFeedbackRowProps {
  insightId: string;
  feedbackMap: OraFeedbackEntry;
  onFeedback: (insightId: string, kind: 'helpful' | 'not_relevant' | 'wrong') => void;
}

function OraFeedbackRow({
  insightId,
  feedbackMap,
  onFeedback,
}: OraFeedbackRowProps): ReactElement {
  const stored = feedbackMap[insightId];
  const [ack, setAck] = useState<'helpful' | 'not_relevant' | 'wrong' | null>(
    stored ?? null,
  );
  const [showHelpfulAck, setShowHelpfulAck] = useState(false);
  const [showCorrection, setShowCorrection] = useState(false);

  const choose = (kind: 'helpful' | 'not_relevant' | 'wrong'): void => {
    setAck(kind);
    onFeedback(insightId, kind);
    if (kind === 'helpful') {
      setShowHelpfulAck(true);
      setTimeout(() => setShowHelpfulAck(false), 1400);
    }
    if (kind === 'wrong') setShowCorrection(true);
  };

  return (
    <View style={fbStyles.wrap}>
      {ack === 'not_relevant' ? (
        <Text style={fbStyles.ackText}>Got it. I'll dial that back.</Text>
      ) : showHelpfulAck ? (
        <Text style={[fbStyles.ackText, { color: colors.eucalyptus }]}>
          Noted
        </Text>
      ) : (
        <View style={fbStyles.row}>
          <Pressable
            onPress={() => choose('helpful')}
            accessibilityRole="button"
            accessibilityLabel="Mark insight as helpful"
            style={fbStyles.linkBtn}
          >
            <Text style={fbStyles.linkText}>Helpful</Text>
          </Pressable>
          <View style={fbStyles.sep} />
          <Pressable
            onPress={() => choose('not_relevant')}
            accessibilityRole="button"
            accessibilityLabel="Mark insight as not relevant"
            style={fbStyles.linkBtn}
          >
            <Text style={fbStyles.linkText}>Not for me</Text>
          </Pressable>
          <View style={fbStyles.sep} />
          <Pressable
            onPress={() => choose('wrong')}
            accessibilityRole="button"
            accessibilityLabel="Report insight as wrong"
            style={fbStyles.linkBtn}
          >
            <Text style={fbStyles.linkText}>Wrong about today</Text>
          </Pressable>
        </View>
      )}
      {showCorrection && (
        <View style={fbStyles.correctionWrap}>
          <Text style={[typography.caption, { marginBottom: 8 }]}>
            What's off?
          </Text>
          <Pressable
            style={[buttons.soft, { marginBottom: 6, height: 44 }]}
            onPress={() => setShowCorrection(false)}
            accessibilityRole="button"
            accessibilityLabel="Cycle day looks wrong"
          >
            <Text style={buttons.softLabel}>Cycle day looks wrong</Text>
          </Pressable>
          <Pressable
            style={[buttons.soft, { marginBottom: 6, height: 44 }]}
            onPress={() => setShowCorrection(false)}
            accessibilityRole="button"
            accessibilityLabel="Predicted phase looks wrong"
          >
            <Text style={buttons.softLabel}>Predicted phase looks wrong</Text>
          </Pressable>
          <Pressable
            onPress={() => setShowCorrection(false)}
            accessibilityRole="button"
            accessibilityLabel="Cancel correction"
            style={fbStyles.linkBtn}
          >
            <Text style={fbStyles.linkText}>Cancel</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const fbStyles = StyleSheet.create({
  wrap: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  linkBtn: {
    minHeight: 44,
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  linkText: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.eucalyptus,
  },
  sep: {
    width: 1,
    height: 12,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginHorizontal: spacing.xs,
  },
  ackText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.ink2,
  },
  correctionWrap: {
    marginTop: 10,
    padding: 12,
    backgroundColor: colors.paper,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
});

// ─────────────────────────────────────────────
// LoadingShimmer — animated progress bar
// ─────────────────────────────────────────────

interface LoadingShimmerProps {
  reduceMotion: boolean;
}

function LoadingShimmer({ reduceMotion }: LoadingShimmerProps): ReactElement {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      progress.value = 0.6;
      return;
    }
    progress.value = withRepeat(
      withTiming(1, { duration: 1400, easing: Easing.linear }),
      -1,
      false,
    );
  }, [reduceMotion, progress]);

  const animStyle = useAnimatedStyle(() => ({
    width: `${60 + progress.value * 20}%` as unknown as number,
    opacity: reduceMotion ? 0.6 : 0.9,
  }));

  return (
    <View style={shimmerStyles.track}>
      <Animated.View style={[shimmerStyles.fill, animStyle]} />
    </View>
  );
}

const shimmerStyles = StyleSheet.create({
  track: {
    marginTop: 8,
    height: 3,
    borderRadius: radius.pill,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: colors.eucalyptus,
    borderRadius: radius.pill,
  },
});

// ─────────────────────────────────────────────
// Appointment prep cards data
// ─────────────────────────────────────────────

interface PrepCard {
  title: string;
  body: string;
}

const PREP_CARDS: PrepCard[] = [
  {
    title: 'CLINICAL SUMMARY',
    body: 'Patient presents with prospectively tracked DRSP scores over 3 cycles. Luteal mean 4.8/6, follicular 1.5/6. Differential ratio 3.2x. Pattern stable.',
  },
  {
    title: 'LANGUAGE TO USE',
    body: '"I\'ve been tracking my symptoms prospectively using a DRSP-based tool. Here is what the data shows."',
  },
  {
    title: 'IF "THIS IS JUST PMS"',
    body: 'PMS does not produce these severity scores over consecutive cycles. The DRSP differential ratio I\'m showing is consistent with the prospective pattern DSM-5 evaluation calls for.',
  },
  {
    title: 'ASK ABOUT',
    body: 'Given this pattern, would you consider an SSRI trial during the luteal phase, or referral to reproductive psychiatry?',
  },
];

// ─────────────────────────────────────────────
// Phase helpers — phase-aware ORA content (P3-04, P3-12)
// ─────────────────────────────────────────────

function getPhaseCode(cycleDay: number, cycleLen: number): string {
  const c = cycleLen || 28;
  if (cycleDay <= 5 || cycleDay > c - 5) return 'M';
  const fEnd = Math.round(c * 0.45);
  const oEnd = Math.round(c * 0.55);
  const lmEnd = Math.round(c * 0.78);
  if (cycleDay <= fEnd) return 'F';
  if (cycleDay <= oEnd) return 'O';
  if (cycleDay <= lmEnd) return 'Lm';
  return 'Ls';
}

const ORA_CONFIRMED_BY_PHASE: Record<string, string> = {
  F: "Across your last cycles, your clearest thinking tends to land in your follicular phase — roughly where you are now. This is the window worth protecting for things that need focus.",
  O: "Ovulatory phase. Your data shows this is typically one of your higher-function windows. Some people feel the shift clearly; others don't. Both are normal.",
  Lm: "Early luteal. Your pattern shows this is where the first subtle shifts start for you — mood and energy often begin pulling in different directions here.",
  Ls: "This is the window your data keeps flagging. Late luteal is where your symptom scores consistently rise. You're not imagining it — it's in three cycles of your own data.",
  M: "Menstrual phase. Your DRSP scores tend to ease around now. The hard stretch is lifting. Rest is still productive.",
  '?': "Your cycle doesn't follow a standard clock, and your data reflects that. I'm tracking your personal pattern rather than a textbook one.",
};

function getPromptChips(phaseCode: string): string[] {
  switch (phaseCode) {
    case 'Ls':
    case 'Lm':
      return [
        'What can I do right now to get through today?',
        'Why do I feel this way in luteal?',
        "How do I explain this to someone who doesn't get it?",
        'Is this worse than last cycle?',
      ];
    case 'M':
      return [
        'Is it supposed to feel this heavy?',
        'When will I start feeling better?',
        'What actually helps during my period?',
        'How does rest affect my next cycle?',
      ];
    case 'F':
      return [
        'What should I use this energy window for?',
        'How long does follicular phase typically last?',
        'What does my pattern show for next luteal?',
        'How do I make the most of this phase?',
      ];
    case 'O':
      return [
        "What's actually happening hormonally right now?",
        'How does ovulation affect my mood?',
        'What does my data say about this phase?',
        'When does luteal start for me?',
      ];
    default:
      return [
        'What does this pattern mean?',
        'What should I focus on today?',
        'How do I talk to my doctor about this?',
        'What helps most in my hard phases?',
      ];
  }
}

// ─────────────────────────────────────────────
// Food logging helpers
// ─────────────────────────────────────────────

function buildFoodResponse(text: string): string {
  const t = text.toLowerCase();
  const first = text.split(/[,.]/ )[0].trim();
  if (/(rice|bread|pasta|noodle|pizza|cereal)/.test(t)) {
    return (
      `I noticed *${first}* — solid carbs. Pairing with protein and fiber typically ` +
      `softens the glycemic curve in your luteal phase. Notable items: none flagged.`
    );
  }
  if (/(chocolate|candy|cake|cookie|donut|sugar|ice cream)/.test(t)) {
    return (
      `I noticed *${first}* — sweet treats are part of life. Heads up that sugar pairings can ` +
      `amplify late-luteal mood drops; balancing with protein helps. Notable items: none flagged.`
    );
  }
  if (/(salad|veg|broccoli|spinach|kale|chicken|salmon|fish|tofu|egg)/.test(t)) {
    return (
      `I noticed *salmon* and *roasted veg* — that's solid protein and fiber. ` +
      `Likely a steady-glycemic meal for your luteal phase. Notable items: none flagged.`
    );
  }
  return (
    `I noticed *${first}* — logged. Steady protein + fiber tends to help in your current phase. ` +
    `Notable items: none flagged.`
  );
}

// ─────────────────────────────────────────────
// OraScreen
// ─────────────────────────────────────────────

export default function OraScreen(): ReactElement {
  const router = useRouter();
  const reduceMotion = useReducedMotion() ?? false;

  const [state, setState] = useState<OraState>(INITIAL_STATE);
  const [oraOn, setOraOn] = useState(true);
  const [showTransparency, setShowTransparency] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPrep, setShowPrep] = useState(false);

  // T-91 — passive mode
  const { cycleDay, cycleLen } = state;
  const currentPhaseCode = getPhaseCode(cycleDay, cycleLen);
  const promptChips = getPromptChips(currentPhaseCode);
  const lutealPeakStart = Math.round(cycleLen * 0.78);
  const inLutealPeak =
    cycleDay >= lutealPeakStart - 2 && cycleDay <= cycleLen - 5;
  const passiveActiveByTime =
    !!state.passiveModeUntil && Date.now() < state.passiveModeUntil;
  const passiveAuto = inLutealPeak && state.passiveAutoOverride !== true;
  const passive =
    !!state.passiveMode || passiveActiveByTime || passiveAuto;

  // T-78 — first-session transparency (no localStorage on RN; use state only)
  const [firstSessionTransparency, setFirstSessionTransparency] =
    useState(true);
  const dismissFirstSession = (): void => {
    setFirstSessionTransparency(false);
    setState((s) => ({ ...s, oraTransparencyShown: true } as OraState));
  };

  // T-12 — food logging
  const foodInputRef = useRef<TextInput>(null);
  const [foodText, setFoodText] = useState('');
  const [foodResponse, setFoodResponse] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);

  const submitFood = (text: string): void => {
    if (!text || !text.trim()) return;
    const resp = buildFoodResponse(text);
    setFoodResponse(resp);
    setState((s) => ({
      ...s,
      voiceFoodEntries: [
        ...(s.voiceFoodEntries ?? []),
        { text, ts: Date.now() },
      ],
    }));
  };

  const startRecord = (): void => {
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      const mockText = foodText || 'salmon and roasted veg';
      setFoodText(mockText);
      submitFood(mockText);
    }, 3000);
  };

  // DRSP chart data
  const drspData = useMemo<DRSPDataPoint[]>(() => buildMockDRSPData(), []);

  // T-14 — pattern engine
  const loggedDays = Object.keys(state.entries).length;
  const patternState: PatternState =
    loggedDays < 7 ? 'empty' : loggedDays < 35 ? 'early' : 'confirmed';

  const edSafe = state.ed_safe_mode === 'yes';

  // Ora feedback handler
  const handleOraFeedback = (
    insightId: string,
    kind: 'helpful' | 'not_relevant' | 'wrong',
  ): void => {
    setState((s) => ({
      ...s,
      oraFeedback: { ...s.oraFeedback, [insightId]: kind },
    }));
  };

  // Appointment prep copy (mock)
  const handleCopyPrep = (): void => {
    // Clipboard access handled by expo-clipboard if needed in a future pass.
    // Intentionally left as a no-op stub — feature requires native module wiring.
  };

  const handleSendPrepEmail = (): void => {
    // Email share would use expo-sharing / Linking.openURL('mailto:…')
    // Intentionally left as a no-op stub — requires native module wiring.
  };

  // ── Ora content section ─────────────────────────────────────────────────
  const renderOraContent = (): ReactElement => {
    if (patternState === 'empty') {
      return (
        <View style={[s.oraCard, { marginBottom: 16 }]}>
          <View style={s.oraLabelRow}>
            <Text style={[typography.italicDisplay, s.oraGlyph]}>O</Text>
            <Text style={s.oraLabelText}>ORA</Text>
          </View>
          <Text style={[typography.body, { marginTop: 6 }]}>
            I haven't seen enough of your cycle yet to say anything useful —
            about 2 weeks in, I'll start noticing things, and by your second
            luteal I'll have a real pattern to show you. Until then I'm here if
            you want to talk.
          </Text>
          <OraFeedbackRow
            insightId="ora-pattern-empty"
            feedbackMap={state.oraFeedback}
            onFeedback={handleOraFeedback}
          />
        </View>
      );
    }

    if (patternState === 'early') {
      return (
        <View style={[s.oraCard, { marginBottom: 16 }]}>
          <View style={s.oraLabelRow}>
            <Text style={[typography.italicDisplay, s.oraGlyph]}>O</Text>
            <Text style={s.oraLabelText}>ORA  EARLY READ</Text>
          </View>
          <Text style={[typography.body, { marginTop: 6 }]}>
            One cycle in. I'm seeing what looks like a luteal-phase shift around
            day 22, but I want one more cycle before I trust it. Hold tight.
          </Text>
          <OraFeedbackRow
            insightId="ora-pattern-early"
            feedbackMap={state.oraFeedback}
            onFeedback={handleOraFeedback}
          />
        </View>
      );
    }

    if (loading) {
      return (
        <View style={s.oraCard}>
          <Text style={typography.caption}>Ora is reading your data…</Text>
          <LoadingShimmer reduceMotion={reduceMotion} />
        </View>
      );
    }

    // confirmed
    return (
      <View style={[s.oraCard, { marginBottom: 16 }]}>
        <View style={s.confirmedHeader}>
          <View style={s.oraLabelRow}>
            <Text style={[typography.italicDisplay, s.oraGlyph]}>O</Text>
            <Text style={s.oraLabelText}>ORA</Text>
          </View>
          <Pressable
            onPress={() => setShowTransparency((v) => !v)}
            accessibilityRole="button"
            accessibilityLabel="More information"
            style={s.infoBtn}
          >
            <Text style={s.infoBtnText}>?</Text>
          </Pressable>
        </View>
        <Text style={[typography.body, { marginTop: 6 }]}>
          {ORA_CONFIRMED_BY_PHASE[currentPhaseCode] ?? ORA_CONFIRMED_BY_PHASE['?']}
        </Text>
        {/* T-41 — observation, not diagnosis */}
        <Text style={s.disclaimerCaption}>
          These patterns are observations from your logs. They are not a
          diagnosis. Bring them to your clinician.
        </Text>
        {showTransparency && (
          <View style={s.transparencyBlock}>
            <Text style={s.transparencyText}>
              <Text style={s.transparencyBold}>Used: </Text>
              your DRSP scores from Jan 28 – Apr 24, your cycle phase data.
            </Text>
            <Text style={[s.transparencyText, { marginTop: 4 }]}>
              <Text style={s.transparencyBold}>Not used: </Text>
              your name, email, or location.
            </Text>
          </View>
        )}
        <OraFeedbackRow
          insightId="ora-pattern-confirmed"
          feedbackMap={state.oraFeedback}
          onFeedback={handleOraFeedback}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream }} edges={['top']}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={layout.screen}
        showsVerticalScrollIndicator={false}
      >
        {/* Header row — Ora title + on/off toggle */}
        <View style={s.header}>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={[typography.eyebrow, { marginBottom: 6 }]}>
              Clinical intelligence
            </Text>
            <Text style={typography.displaySm}>
              <Text
                style={[typography.italicDisplay, { color: colors.eucalyptus }]}
              >
                Ora
              </Text>
              {'  '}
              {oraOn ? 'On' : 'Off'}
            </Text>
          </View>
          <Pressable
            onPress={() => setOraOn((v) => !v)}
            accessibilityRole="switch"
            accessibilityLabel={oraOn ? 'Turn Ora off' : 'Turn Ora on'}
            accessibilityState={{ checked: oraOn }}
            style={[s.toggle, oraOn && s.toggleOn]}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <View style={[s.toggleThumb, oraOn && s.toggleThumbOn]} />
          </Pressable>
        </View>

        {!oraOn ? (
          <View style={[cards.cardWarm, { marginBottom: 16 }]}>
            <Text style={typography.body}>
              Ora is paused. Your logs continue. Resume any time.
            </Text>
          </View>
        ) : (
          <>
            {/* T-78 — first-session transparency */}
            {firstSessionTransparency && (
              <View style={[s.oraCard, { marginBottom: 18 }]}>
                <View style={s.oraLabelRow}>
                  <Text style={[typography.italicDisplay, s.oraGlyph]}>O</Text>
                  <Text style={s.oraLabelText}>ORA  WHAT I SEE</Text>
                </View>
                <View style={{ marginTop: 8, gap: 6 }}>
                  <Text style={[typography.body, { fontSize: 12 }]}>
                    <Text style={{ fontFamily: fonts.sansSemibold }}>
                      What I use:{' '}
                    </Text>
                    your DRSP scores and cycle dates from the last 90 days.
                  </Text>
                  <Text style={[typography.body, { fontSize: 12 }]}>
                    <Text style={{ fontFamily: fonts.sansSemibold }}>
                      What I don't see:{' '}
                    </Text>
                    your name, email, location.
                  </Text>
                </View>
                <Pressable
                  style={[buttons.soft, { marginTop: 12, height: 44 }]}
                  onPress={dismissFirstSession}
                  accessibilityRole="button"
                  accessibilityLabel="Dismiss transparency notice"
                >
                  <Text style={buttons.softLabel}>Got it</Text>
                </Pressable>
              </View>
            )}

            {/* T-12 — food logging */}
            {edSafe ? (
              <View
                style={[cards.cardWarm, { marginBottom: 20, padding: 14 }]}
              >
                <Text
                  style={[typography.eyebrow, { marginBottom: 6 }]}
                >
                  FOOD LOGGING
                </Text>
                <Text
                  style={[
                    typography.body,
                    { fontSize: 12, color: colors.ink2 },
                  ]}
                >
                  Voice diet logging is hidden because you opted out at
                  onboarding. Turn on in Profile → My data.
                </Text>
              </View>
            ) : (
              <View
                style={[cards.cardWarm, { marginBottom: 20, padding: 14 }]}
              >
                <Text
                  style={[typography.eyebrow, { marginBottom: 8 }]}
                >
                  TELL ORA WHAT YOU ATE
                </Text>
                <View style={s.foodRow}>
                  <TextInput
                    ref={foodInputRef}
                    style={s.foodInput}
                    placeholder="Salmon, roasted veg, half avocado…"
                    placeholderTextColor={colors.inkDisabled}
                    value={foodText}
                    onChangeText={setFoodText}
                    onSubmitEditing={() => submitFood(foodText)}
                    returnKeyType="send"
                    accessibilityLabel="Food input"
                  />
                  <Pressable
                    onPress={recording ? undefined : startRecord}
                    accessibilityRole="button"
                    accessibilityLabel={
                      recording ? 'Listening for voice input' : 'Record voice'
                    }
                    style={[
                      s.micBtn,
                      { backgroundColor: recording ? colors.coral : colors.eucalyptus },
                    ]}
                  >
                    <Text style={s.micBtnText}>{recording ? '●' : 'Rec'}</Text>
                  </Pressable>
                  <Pressable
                    style={[buttons.soft, s.sendBtn]}
                    onPress={() => submitFood(foodText)}
                    accessibilityRole="button"
                    accessibilityLabel="Submit food entry"
                  >
                    <Text style={buttons.softLabel}>Send</Text>
                  </Pressable>
                </View>
                {recording && (
                  <Text style={[typography.caption, { marginTop: 8 }]}>
                    Listening… (3 sec mock)
                  </Text>
                )}
                {foodResponse !== null && (
                  <View style={[s.oraCard, { marginTop: 12 }]}>
                    <Text style={s.oraLabelText}>ORA  FOOD CONTEXT</Text>
                    <Text style={[typography.body, { marginTop: 4, fontSize: 12 }]}>
                      {foodResponse}
                    </Text>
                  </View>
                )}
                <Text
                  style={[
                    typography.caption,
                    { marginTop: 8, fontSize: 11 },
                  ]}
                >
                  No calories, no macros, no scores. Just context.
                </Text>
              </View>
            )}

            {/* Appointment prep CTA */}
            <Pressable
              style={[buttons.soft, { marginBottom: 22 }]}
              onPress={() => setShowPrep(true)}
              accessibilityRole="button"
              accessibilityLabel="Prepare for my appointment"
            >
              <Text style={buttons.softLabel}>Prepare for my appointment</Text>
            </Pressable>

            {/* DRSP chart */}
            <View style={{ marginBottom: 16 }}>
              <DRSPChartSimple data={drspData} height={180} />
            </View>

            {/* T-14 — pattern engine cards */}
            {renderOraContent()}

            {/* T-91 — passive mode chips or quiet notice */}
            {passive ? (
              <View style={s.passiveRow}>
                <Text style={s.passiveText}>
                  Quiet view today — just the chart, no nudges.
                  {passiveAuto && ' '}
                </Text>
                {passiveAuto && (
                  <Pressable
                    onPress={() =>
                      setState((sv) => ({
                        ...sv,
                        passiveAutoOverride: true,
                        passiveMode: false,
                        passiveModeUntil: null,
                      }))
                    }
                    accessibilityRole="button"
                    accessibilityLabel="Show prompts"
                    style={s.showPromptsBtn}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <Text style={s.showPromptsText}>Show prompts</Text>
                  </Pressable>
                )}
              </View>
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 8 }}
                contentContainerStyle={s.chipsContainer}
              >
                {promptChips.map((p) => (
                  <Pressable
                    key={p}
                    onPress={() => {
                      setLoading(true);
                      setTimeout(
                        () => setLoading(false),
                        reduceMotion ? 0 : 1400,
                      );
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={p}
                    style={s.chip}
                  >
                    <Text style={s.chipText}>{p}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            )}
          </>
        )}

        {/* Appointment prep modal */}
        <Modal
          visible={showPrep}
          animationType={reduceMotion ? 'none' : 'slide'}
          transparent
          onRequestClose={() => setShowPrep(false)}
        >
          <Pressable
            style={s.modalBackdrop}
            onPress={() => setShowPrep(false)}
            accessibilityRole="button"
            accessibilityLabel="Close appointment prep"
          >
            <Pressable
              style={s.modalSheet}
              onPress={(e) => e.stopPropagation()}
              accessibilityRole="none"
            >
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={[typography.eyebrow, { marginBottom: 6 }]}>
                  APPOINTMENT PREP
                </Text>
                <Text style={[typography.displaySm, { marginBottom: 18 }]}>
                  Before{' '}
                  <Text
                    style={[
                      typography.italicDisplay,
                      { color: colors.eucalyptus },
                    ]}
                  >
                    your next appointment
                  </Text>
                </Text>

                {PREP_CARDS.map((c) => (
                  <View key={c.title} style={[s.oraCard, { marginBottom: 12 }]}>
                    <Text style={s.oraLabelText}>{c.title}</Text>
                    <Text style={[typography.body, { marginTop: 6, fontSize: 14 }]}>
                      {c.body}
                    </Text>
                  </View>
                ))}

                <View style={s.prepActionRow}>
                  <Pressable
                    style={[buttons.soft, { flex: 1 }]}
                    onPress={handleCopyPrep}
                    accessibilityRole="button"
                    accessibilityLabel="Copy appointment prep"
                  >
                    <Text style={buttons.softLabel}>Copy</Text>
                  </Pressable>
                  <Pressable
                    style={[buttons.soft, { flex: 1 }]}
                    onPress={handleSendPrepEmail}
                    accessibilityRole="button"
                    accessibilityLabel="Send appointment prep to email"
                  >
                    <Text style={buttons.softLabel}>Send to email</Text>
                  </Pressable>
                </View>
                <Pressable
                  style={[buttons.outline, { marginTop: 12 }]}
                  onPress={() => setShowPrep(false)}
                  accessibilityRole="button"
                  accessibilityLabel="Close appointment prep modal"
                >
                  <Text style={buttons.outlineLabel}>Close</Text>
                </Pressable>
              </ScrollView>
            </Pressable>
          </Pressable>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// Local styles
// ─────────────────────────────────────────────

const s = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    marginBottom: 22,
    paddingBottom: 18,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  // Toggle switch
  toggle: {
    width: 48,
    height: 28,
    borderRadius: radius.pill,
    backgroundColor: colors.inkDisabled,
    justifyContent: 'center',
    paddingHorizontal: 3,
    flexShrink: 0,
  },
  toggleOn: {
    backgroundColor: colors.eucalyptus,
  },
  toggleThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.paper,
    alignSelf: 'flex-start',
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
  // Ora card
  oraCard: {
    backgroundColor: colors.mintMist,
    borderRadius: radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  oraLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  oraGlyph: {
    fontSize: 14,
    color: colors.eucalyptus,
  },
  oraLabelText: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 1.6,
    color: colors.eucalyptus,
    textTransform: 'uppercase',
  },
  // Confirmed pattern extras
  confirmedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  infoBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBtnText: {
    fontSize: 16,
    color: colors.eucalyptus,
    opacity: 0.6,
  },
  disclaimerCaption: {
    fontFamily: fonts.sans,
    fontSize: 11,
    marginTop: 8,
    color: colors.ink3,
    lineHeight: 16,
  },
  transparencyBlock: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.borderStrong,
  },
  transparencyText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 19,
    color: colors.ink2,
  },
  transparencyBold: {
    fontFamily: fonts.sansSemibold,
    color: colors.ink,
  },
  // Food logging
  foodRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  foodInput: {
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: 12,
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink,
    backgroundColor: colors.paper,
  },
  micBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  micBtnText: {
    fontSize: 16,
  },
  sendBtn: {
    height: 44,
    paddingHorizontal: 14,
  },
  // Passive mode
  passiveRow: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
  },
  passiveText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.ink3,
    textAlign: 'center',
  },
  showPromptsBtn: {
    minHeight: 44,
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  showPromptsText: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.eucalyptus,
    textDecorationLine: 'underline',
  },
  // Prompt chips
  chipsContainer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  chip: {
    flexShrink: 0,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.paper,
    borderRadius: radius.pill,
    minHeight: 44,
    justifyContent: 'center',
  },
  chipText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.ink,
    flexShrink: 0,
  },
  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: colors.overlayModal,
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: 24,
    paddingBottom: 36,
    maxHeight: '85%',
  },
  prepActionRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
});
