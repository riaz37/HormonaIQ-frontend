// Home — phase-aware Morning Garden landing surface.
// Port of design-handoff/08-implementation-code/src/home.jsx (Wave 1+2 features:
// T-02 anti-anchoring, T-07 luteal Support link, T-09 endometrial 75/90,
// T-14/15 pattern + variable phase, T-16 brain fog suggest, T-21 episode tile,
// T-24 community pulse, T-fix-3 medication suppression).

import { useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
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
import Svg, { Circle } from 'react-native-svg';

import {
  buttons,
  cards,
  components as cmp,
  layout,
  typography,
} from '../../src/constants/styles';
import { colors, fonts, radius, spacing } from '../../src/constants/tokens';
import { phaseForDay } from '../../src/lib/phase';
import type { Phase } from '../../src/lib/phase';
import { assessCrisisTier } from '../../src/lib/crisis';
import type { CrisisTier, LogEntry } from '../../src/lib/crisis';

// ─────────────────────────────────────────────
// Local types — minimal shape mirroring window.HQ.useApp() in the prototype
// ─────────────────────────────────────────────
interface Medication {
  name?: string;
  class?: string;
}

interface PeriodLogEntry {
  flow?: string | null;
  started?: boolean;
  dismissed?: boolean;
  at?: number;
}

interface DRSPEntry {
  fatigue?: number;
}

interface DayEntry {
  drsp?: DRSPEntry;
  drspScores?: number[];
  siScore?: number;
  savedAt?: number;
}

interface HomeState {
  cycleDay: number;
  cycleLen: number;
  irregular: boolean;
  cyclePaused: boolean;
  conditions: string[];
  medications: Medication[];
  symptoms: string[];
  lastPeriod: string | null; // YYYY-MM-DD
  periodLog: Record<string, PeriodLogEntry>;
  entries: Record<string, DayEntry>;
  brainFogMode: boolean;
  brainFogSuggested: boolean;
  oraEnabled: boolean;
  veteranMode: boolean;
  endoAcknowledged: Record<string, number>;
}

const INITIAL_STATE: HomeState = {
  cycleDay: 19,
  cycleLen: 28,
  irregular: false,
  cyclePaused: false,
  conditions: ['PMDD'],
  medications: [],
  symptoms: ['mood shifts'],
  lastPeriod: null,
  periodLog: {},
  entries: {},
  brainFogMode: false,
  brainFogSuggested: false,
  oraEnabled: true,
  veteranMode: false,
  endoAcknowledged: {},
};

// ─────────────────────────────────────────────
// Phase short codes used by the prototype (F/O/L/Lm/Ls/M/?)
// Map from our Phase enum → short code for color/name lookups.
// ─────────────────────────────────────────────
type PhaseCode = 'F' | 'O' | 'L' | 'Lm' | 'Ls' | 'M' | '?';

function phaseToCode(p: Phase): PhaseCode {
  switch (p) {
    case 'follicular':
      return 'F';
    case 'ovulatory':
      return 'O';
    case 'luteal':
      return 'L';
    case 'luteal-late':
      return 'Ls';
    case 'menstrual':
      return 'M';
    default:
      return '?';
  }
}

const PHASE_NAMES: Record<PhaseCode, string> = {
  F: 'Follicular',
  O: 'Ovulatory',
  L: 'Luteal',
  Lm: 'Early luteal',
  Ls: 'Late luteal',
  M: 'Menstrual',
  '?': 'Variable',
};

const PHASE_VIBE_WORDS: Record<PhaseCode, string> = {
  F: 'Follicular',
  O: 'Peak',
  L: 'Luteal',
  Lm: 'Luteal',
  Ls: 'Late luteal',
  M: 'Menstrual',
  '?': 'Variable',
};

const PHASE_FILL: Record<PhaseCode, string> = {
  F: colors.sageLight,
  O: colors.butter,
  L: colors.coralSoft,
  Lm: colors.coralSoft,
  Ls: colors.coral,
  M: colors.rose,
  '?': colors.mintMist,
};

const PHASE_INK: Record<PhaseCode, string> = {
  F: colors.eucalyptusDeep,
  O: colors.ink,
  L: colors.eucalyptusDeep,
  Lm: colors.eucalyptusDeep,
  Ls: colors.paper,
  M: colors.paper,
  '?': colors.ink2,
};

// ─────────────────────────────────────────────
// nextDays — port of shared.jsx helper
// Returns the next `n` days with cycleDay + phase + color.
// ─────────────────────────────────────────────
interface ForecastDay {
  cycleDay: number;
  phase: PhaseCode;
  color: string;
}

function nextDays(
  startDay: number,
  cycleLen: number,
  n: number,
  irregular: boolean,
): ForecastDay[] {
  const out: ForecastDay[] = [];
  for (let i = 0; i < n; i += 1) {
    const day = ((startDay - 1 + i) % cycleLen) + 1;
    const phase = irregular
      ? '?'
      : phaseToCode(phaseForDay(day, cycleLen));
    out.push({ cycleDay: day, phase, color: PHASE_FILL[phase] });
  }
  return out;
}

// ─────────────────────────────────────────────
// daysSinceLastPeriod — port of home.jsx line 6
// ─────────────────────────────────────────────
function daysSinceLastPeriod(lastPeriod: string | null): number {
  if (!lastPeriod) return 0;
  const start = new Date(lastPeriod).getTime();
  const today = Date.now();
  return Math.floor((today - start) / 86400000);
}

// ─────────────────────────────────────────────
// suppressEndoForMeds — port of home.jsx line 14
// ─────────────────────────────────────────────
function suppressEndoForMeds(meds: readonly Medication[]): boolean {
  if (!meds.length) return false;
  const re =
    /(progestogen|progesterone|ocp|coc|combined oral|iud|mirena|provera|levonorgestrel|drospirenone|norethindrone|medroxyprogesterone)/i;
  return meds.some(
    (m) => !!m && (re.test(m.name ?? '') || re.test(m.class ?? '')),
  );
}

// ─────────────────────────────────────────────
// CycleRing — concentric SVG ring with day number + phase name
// ─────────────────────────────────────────────
interface CycleRingProps {
  cycleDay: number;
  cycleLen: number;
  phaseCode: PhaseCode;
  size?: number;
  pulse: boolean;
}

function CycleRing({
  cycleDay,
  cycleLen,
  phaseCode,
  size = 140,
  pulse,
}: CycleRingProps): ReactElement {
  const r = (size - 12) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const progress = Math.max(0, Math.min(1, cycleDay / cycleLen));
  const dash = circumference * progress;

  const scale = useSharedValue(1);
  useEffect(() => {
    if (!pulse) {
      scale.value = 1;
      return;
    }
    scale.value = withRepeat(
      withTiming(1.06, { duration: 3000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [pulse, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[{ width: size, height: size }, animatedStyle]}>
      <Svg width={size} height={size}>
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={colors.mintMist}
          strokeWidth={6}
          fill="transparent"
        />
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={PHASE_FILL[phaseCode]}
          strokeWidth={6}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={`${dash} ${circumference}`}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        <Circle
          cx={cx}
          cy={cy}
          r={r - 18}
          fill={colors.paper}
          opacity={0.7}
        />
      </Svg>
      <View style={ringStyles.center} pointerEvents="none">
        <Text style={ringStyles.dayNum}>{cycleDay}</Text>
        <Text style={ringStyles.phaseName}>{PHASE_NAMES[phaseCode]}</Text>
      </View>
    </Animated.View>
  );
}

const ringStyles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNum: {
    fontFamily: fonts.display,
    fontSize: 36,
    color: colors.ink,
    letterSpacing: -1,
  },
  phaseName: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 0.8,
    color: colors.ink2,
    textTransform: 'uppercase',
    marginTop: 2,
  },
});

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function greetingForHour(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

function buildLogEntries(entries: Record<string, DayEntry>): LogEntry[] {
  return Object.entries(entries).map(([date, e]) => ({
    date,
    siScore: e.siScore ?? 0,
    drspScores: e.drspScores ?? [],
  }));
}

// ─────────────────────────────────────────────
// HomeScreen
// ─────────────────────────────────────────────
export default function HomeScreen(): ReactElement {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [state, setState] = useState<HomeState>(INITIAL_STATE);
  const [showTier2, setShowTier2] = useState(false);
  const [showEpisode, setShowEpisode] = useState(false);

  // ── Paused cycle (T-85) ────────────────────────────────────────────────
  if (state.cyclePaused) {
    return (
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.cream }}
        contentContainerStyle={layout.screen}
      >
        <Text style={[typography.display, { marginBottom: 18 }]}>
          Welcome back.
        </Text>
        <View style={[cards.cardWarm, { marginBottom: 18 }]}>
          <Text style={[typography.eyebrow, { marginBottom: 8 }]}>
            Cycle tracking paused
          </Text>
          <Text style={[typography.body, { marginBottom: 12 }]}>
            Cycle tracking is paused. Tap Profile to resume.
          </Text>
          <Pressable
            style={buttons.soft}
            onPress={() => router.push('/(app)/profile')}
            accessibilityRole="button"
            accessibilityLabel="Open profile"
          >
            <Text style={buttons.softLabel}>Open Profile</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  const { cycleDay, cycleLen } = state;
  const irregular =
    state.irregular || state.conditions.includes('PCOS');
  const forecast = useMemo(
    () => nextDays(cycleDay, cycleLen, 7, irregular),
    [cycleDay, cycleLen, irregular],
  );
  const phaseCode: PhaseCode = irregular ? '?' : forecast[0].phase;
  const symptom = (state.symptoms[0] ?? 'mood shifts').toLowerCase();

  const todayKey = new Date().toISOString().slice(0, 10);
  const loggedToday = !!state.entries[todayKey];

  // ── T-09 endometrial gating ────────────────────────────────────────────
  const hasPCOS = state.conditions.includes('PCOS');
  const daysSince = daysSinceLastPeriod(state.lastPeriod);
  const periodKey = state.lastPeriod ?? 'unknown';
  const acknowledged = !!state.endoAcknowledged[periodKey];
  const medSuppress = suppressEndoForMeds(state.medications);
  const showEndo75 =
    hasPCOS &&
    !medSuppress &&
    daysSince >= 75 &&
    daysSince < 90 &&
    !acknowledged;
  const showEndo90 =
    hasPCOS && !medSuppress && daysSince >= 90 && !acknowledged;
  const acknowledgeEndo = (): void => {
    setState((s) => ({
      ...s,
      endoAcknowledged: { ...s.endoAcknowledged, [periodKey]: Date.now() },
    }));
  };

  // ── Period start prompt ────────────────────────────────────────────────
  const periodLoggedToday = !!state.periodLog[todayKey];
  const showPeriodStartPrompt =
    !periodLoggedToday &&
    (phaseCode === 'Ls' ||
      (phaseCode === 'L' && cycleDay >= cycleLen - 3) ||
      (phaseCode === 'M' && cycleDay <= 2) ||
      (irregular && daysSince >= 28 && daysSince < 75));
  const markPeriodStarted = (flow: string | null = null): void => {
    setState((s) => ({
      ...s,
      lastPeriod: todayKey,
      periodLog: {
        ...s.periodLog,
        [todayKey]: { flow, started: true, at: Date.now() },
      },
    }));
  };
  const dismissPeriodPrompt = (): void => {
    setState((s) => ({
      ...s,
      periodLog: {
        ...s.periodLog,
        [todayKey]: { flow: null, dismissed: true },
      },
    }));
  };

  // ── T-16 brain fog auto-suggest ────────────────────────────────────────
  const lutealPeakStart = Math.round(cycleLen * 0.78);
  const daysToPeak = lutealPeakStart - cycleDay;
  const showBfSuggest =
    phaseCode === 'L' &&
    Math.abs(daysToPeak) <= 2 &&
    !state.brainFogMode &&
    !state.brainFogSuggested;

  // ── Phase greeting (T-43) ──────────────────────────────────────────────
  const lutealStart = Math.round(cycleLen * 0.55) + 1;
  const lutealMid = Math.round((lutealStart + cycleLen) / 2);
  const isLateLuteal = phaseCode === 'L' && cycleDay >= lutealMid;
  const isEarlyLuteal = phaseCode === 'L' && cycleDay < lutealMid;
  const phaseGreeting = ((): string | null => {
    if (phaseCode === 'M' && cycleDay === 1)
      return 'There it is. End of the hard stretch.';
    if (phaseCode === 'M') return 'Your body just did a lot. Rest counts.';
    if (phaseCode === 'F')
      return 'Higher-capacity window for a lot of people. What do you want to use it for?';
    if (phaseCode === 'O')
      return 'Ovulatory window. Match what your body is doing if you can.';
    if (isEarlyLuteal)
      return "Heading into the harder stretch. I'll keep things light here today.";
    if (isLateLuteal)
      return "Hardest stretch of your cycle. I'll keep things light here today.";
    return null;
  })();

  // ── Phase guidance line (T-34 veteran mode) ────────────────────────────
  const phaseTone: Record<PhaseCode, string> = state.veteranMode
    ? {
        F: 'Energy rising.',
        O: 'Ovulatory window.',
        L: 'Late luteal.',
        Lm: 'Early luteal.',
        Ls: 'Late luteal.',
        M: 'Menstrual.',
        '?': 'Variable cycle.',
      }
    : {
        F: 'Energy is usually rising here. Plan with it, not against it.',
        O: "Energy is often higher here. Or it isn't. Either is fine.",
        L: 'Late luteal stretch. Less is enough.',
        Lm: 'Heading into the harder stretch. Less is enough.',
        Ls: 'Late luteal stretch. Less is enough.',
        M: 'The hard part is lifting. Rest counts.',
        '?': 'Your cycle runs on its own clock. We meet it where it is.',
      };

  // ── T-06 crisis tier ───────────────────────────────────────────────────
  const tier: CrisisTier = useMemo(
    () => assessCrisisTier(buildLogEntries(state.entries)),
    [state.entries],
  );

  // ── T-14 pattern engine state ──────────────────────────────────────────
  const loggedDays = Object.keys(state.entries).length;
  const patternState: 'empty' | 'early' | 'confirmed' =
    loggedDays < 7 ? 'empty' : loggedDays < 35 ? 'early' : 'confirmed';

  // ── T-24 community pulse ───────────────────────────────────────────────
  const communityCount =
    ({ F: 4213, O: 1847, L: 2896, Lm: 2896, Ls: 2896, M: 1432, '?': 2200 } as Record<
      PhaseCode,
      number
    >)[phaseCode];

  const phaseChipText = irregular
    ? 'Phase: variable'
    : `${PHASE_NAMES[phaseCode]} phase`;

  const greeting = greetingForHour();
  const pulseEnabled = !reduceMotion;

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.cream }}
      contentContainerStyle={layout.screen}
      showsVerticalScrollIndicator={false}
    >
      {/* Greeting */}
      <View style={{ marginBottom: 20 }}>
        <Text style={[typography.caption, { marginBottom: 4 }]}>
          {greeting}, you
        </Text>
        <Text style={typography.display}>
          <Text
            style={[typography.italicDisplay, { color: colors.eucalyptus }]}
          >
            {PHASE_VIBE_WORDS[phaseCode]}
          </Text>
          {irregular ? '' : ` · Day ${cycleDay}`}
        </Text>
      </View>

      {/* T-43 — Ora phase-aware greeting */}
      {phaseGreeting && state.oraEnabled && (
        <View style={[cards.cardMint, { marginBottom: 16 }]}>
          <View style={s.oraLabel}>
            <Text style={[typography.italicDisplay, s.oraGlyph]}>O</Text>
            <Text style={s.oraLabelText}>ORA</Text>
          </View>
          <Text style={[typography.body, { marginTop: 6 }]}>
            {phaseGreeting}
          </Text>
        </View>
      )}

      {/* Cycle ring hero */}
      <View style={[cards.cardWarm, s.heroRow]}>
        <CycleRing
          cycleDay={cycleDay}
          cycleLen={cycleLen}
          phaseCode={phaseCode}
          size={140}
          pulse={pulseEnabled}
        />
        <View style={{ flex: 1, minWidth: 0 }}>
          <View
            style={[
              cmp.phasePill,
              { backgroundColor: PHASE_FILL[phaseCode], marginBottom: 8 },
            ]}
          >
            <Text
              style={[cmp.phasePillLabel, { color: PHASE_INK[phaseCode] }]}
            >
              {phaseChipText}
            </Text>
          </View>
          <Text style={[typography.body, { fontSize: 14 }]}>
            {phaseTone[phaseCode]}
          </Text>
        </View>
      </View>

      {/* Period-start prompt */}
      {showPeriodStartPrompt && (
        <View style={[cards.cardWarm, s.stripRose, { marginTop: 18 }]}>
          <Text
            style={[typography.eyebrow, { color: colors.rose, marginBottom: 6 }]}
          >
            A quick check
          </Text>
          <Text
            style={[typography.body, { fontSize: 14, marginBottom: 12 }]}
          >
            Did your period start today?
          </Text>
          <View style={s.row}>
            <Pressable
              style={[buttons.soft, { flex: 1 }]}
              onPress={() => markPeriodStarted()}
              accessibilityRole="button"
              accessibilityLabel="Yes, log period started"
            >
              <Text style={buttons.softLabel}>Yes — log it</Text>
            </Pressable>
            <Pressable
              style={s.ghostBtn}
              onPress={dismissPeriodPrompt}
              accessibilityRole="button"
              accessibilityLabel="Not yet"
            >
              <Text style={s.ghostBtnLabel}>Not yet</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* T-24 community pulse */}
      <Text
        style={[
          typography.caption,
          { textAlign: 'center', marginTop: 18, marginBottom: 18, fontSize: 12 },
        ]}
      >
        {communityCount.toLocaleString()} others are in their{' '}
        {PHASE_NAMES[phaseCode].toLowerCase()} phase today
      </Text>

      {/* 7-day forecast strip */}
      <Text style={[typography.eyebrow, { marginBottom: 10 }]}>
        The week ahead
      </Text>
      <View style={s.weekStrip}>
        {forecast.map((d, i) => (
          <View
            key={`${d.cycleDay}-${i}`}
            style={[s.dayPill, i === 0 && s.dayPillToday]}
          >
            <Text style={s.dayPillNum}>{d.cycleDay}</Text>
            <Text style={s.dayPillPhase}>{d.phase}</Text>
            <View style={[s.dayPillDot, { backgroundColor: d.color }]} />
          </View>
        ))}
      </View>

      {/* T-09 — endometrial 75 */}
      {showEndo75 && (
        <View style={[cards.cardWarm, s.stripButter, { marginTop: 18 }]}>
          <Text
            style={[
              typography.eyebrow,
              { color: colors.butterDeep, marginBottom: 6 },
            ]}
          >
            A note on cycle length
          </Text>
          <Text
            style={[typography.body, { fontSize: 14, marginBottom: 12 }]}
          >
            It's been 75 days since your last logged period. In PCOS, longer
            cycles are common — but cycles over 90 days without a withdrawal
            bleed are worth discussing with your doctor.
          </Text>
          <Pressable
            style={s.ghostBtn}
            onPress={acknowledgeEndo}
            accessibilityRole="button"
            accessibilityLabel="I spoke to my doctor about this"
          >
            <Text style={s.ghostBtnLabel}>I spoke to my doctor about this</Text>
          </Pressable>
        </View>
      )}

      {/* T-09 — endometrial 90+ */}
      {showEndo90 && (
        <View style={[cards.cardWarm, s.stripSage, { marginTop: 18 }]}>
          <Text
            style={[
              typography.eyebrow,
              { color: colors.eucalyptusDeep, marginBottom: 6 },
            ]}
          >
            Worth a conversation
          </Text>
          <Text
            style={[typography.body, { fontSize: 14, marginBottom: 14 }]}
          >
            You've been in an extended cycle for 90+ days. In PCOS, prolonged
            amenorrhea without progestogen protection can cause endometrial
            changes. We recommend discussing this with your doctor at your
            next appointment.
          </Text>
          <Pressable
            style={[buttons.soft, { marginBottom: 8 }]}
            onPress={acknowledgeEndo}
            accessibilityRole="button"
            accessibilityLabel="Pre-fill appointment note"
          >
            <Text style={buttons.softLabel}>Pre-fill appointment note</Text>
          </Pressable>
          <Pressable
            style={s.ghostBtn}
            onPress={acknowledgeEndo}
            accessibilityRole="button"
            accessibilityLabel="I spoke to my doctor about this"
          >
            <Text style={s.ghostBtnLabel}>I spoke to my doctor about this</Text>
          </Pressable>
        </View>
      )}

      {/* T-16 brain fog suggest */}
      {showBfSuggest && (
        <View style={[cards.cardWarm, s.stripEucalyptus, { marginTop: 18 }]}>
          <Text style={[typography.eyebrow, { marginBottom: 6 }]}>
            Want to simplify?
          </Text>
          <Text
            style={[typography.body, { fontSize: 14, marginBottom: 10 }]}
          >
            Want to simplify the app for today? Brain Fog Mode hides extras.
          </Text>
          <View style={s.row}>
            <Pressable
              style={[buttons.soft, { flex: 1 }]}
              onPress={() =>
                setState((sv) => ({
                  ...sv,
                  brainFogMode: true,
                  brainFogSuggested: true,
                }))
              }
              accessibilityRole="button"
              accessibilityLabel="Yes, simplify the interface"
            >
              <Text style={buttons.softLabel}>Yes, simplify</Text>
            </Pressable>
            <Pressable
              style={[s.ghostBtn, { flex: 1 }]}
              onPress={() =>
                setState((sv) => ({ ...sv, brainFogSuggested: true }))
              }
              accessibilityRole="button"
              accessibilityLabel="No thanks"
            >
              <Text style={s.ghostBtnLabel}>No thanks</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* T-02 — heads-up card (only if logged today) */}
      {loggedToday && (phaseCode === 'L' || phaseCode === 'M') && (
        <View style={[cards.cardWarm, { marginTop: 18 }]}>
          <Text style={[typography.eyebrow, { marginBottom: 6 }]}>
            A heads-up, not a diagnosis
          </Text>
          <Text style={[typography.body, { marginBottom: 12 }]}>
            Looking at your last 3 cycles,{' '}
            <Text style={typography.italicDisplay}>{symptom}</Text> tends to
            peak around Day 22 for you. That's the window where a lot of people
            with PMDD see the same shift.
          </Text>
        </View>
      )}

      {/* T-06 — Tier-1 inline link */}
      {loggedToday && tier === 'tier1' && (
        <View style={s.tier1Wrap}>
          <Pressable
            onPress={() => setShowTier2(true)}
            accessibilityRole="button"
            accessibilityLabel="Open support"
          >
            <Text style={s.tier1Link}>
              Today felt heavier than usual.{' '}
              <Text style={s.tier1Underline}>Open support.</Text>
            </Text>
          </Pressable>
        </View>
      )}

      {/* T-07 — luteal Tier-1 persistent Support link */}
      {phaseCode === 'L' && (
        <View style={s.tier1Wrap}>
          <Pressable
            onPress={() => setShowTier2(true)}
            accessibilityRole="button"
            accessibilityLabel="Open support"
          >
            <Text style={s.tier1Link}>
              Some days in this phase can feel really dark. If that's where you
              are, <Text style={s.tier1Underline}>tap here.</Text>
            </Text>
          </Pressable>
        </View>
      )}

      {/* Log CTA */}
      <Pressable
        style={[buttons.primary, { height: 60, marginTop: 24, marginBottom: 8 }]}
        onPress={() => router.push('/(app)/log')}
        accessibilityRole="button"
        accessibilityLabel="Log today"
      >
        <Text style={[buttons.primaryLabel, { fontSize: 16 }]}>+ Log today</Text>
      </Pressable>
      <Text
        style={[
          typography.caption,
          { textAlign: 'center', marginBottom: 24 },
        ]}
      >
        Fast: ~30s · Full: ~90s
        {irregular ? '' : ` · Day ${cycleDay}, ${PHASE_NAMES[phaseCode]}`}
      </Text>

      {/* Quick tools row — T-21 episode tile */}
      <Text style={[typography.eyebrow, { marginBottom: 10 }]}>
        Today's quick tools
      </Text>
      <View style={s.toolsGrid}>
        <Pressable
          style={[cards.card, s.toolCard]}
          onPress={() => setShowEpisode(true)}
          accessibilityRole="button"
          accessibilityLabel="Log an episode"
        >
          <View style={[s.toolGlyph, { backgroundColor: colors.coralSoft }]}>
            <Text style={[s.toolGlyphText, { color: colors.coral }]}>⚡</Text>
          </View>
          <Text style={s.toolTitle}>Log an episode</Text>
          <Text style={s.toolBody}>Rage, panic, dissociation</Text>
        </Pressable>
        <Pressable
          style={[cards.card, s.toolCard]}
          onPress={() => router.push('/(app)/insights')}
          accessibilityRole="button"
          accessibilityLabel="Open safety plan"
        >
          <View style={[s.toolGlyph, { backgroundColor: colors.mintMist }]}>
            <Text
              style={[s.toolGlyphText, { color: colors.eucalyptusDeep }]}
            >
              ♡
            </Text>
          </View>
          <Text style={s.toolTitle}>Safety plan</Text>
          <Text style={s.toolBody}>Built when well, ready now</Text>
        </Pressable>
      </View>

      {/* T-14 Ora pattern card */}
      {state.oraEnabled && patternState === 'empty' && (
        <View style={[cards.cardMint, { marginBottom: 22 }]}>
          <View style={s.oraLabel}>
            <Text style={[typography.italicDisplay, s.oraGlyph]}>O</Text>
            <Text style={s.oraLabelText}>ORA</Text>
          </View>
          <Text style={[typography.body, { marginTop: 6 }]}>
            I haven't seen enough of your cycle yet to say anything useful —
            about 2 weeks in, I'll start noticing things, and by your second
            luteal I'll have a real pattern to show you. Until then I'm here if
            you want to talk.
          </Text>
        </View>
      )}
      {state.oraEnabled && patternState === 'early' && (
        <View style={[cards.cardMint, { marginBottom: 22 }]}>
          <View style={s.oraLabel}>
            <Text style={[typography.italicDisplay, s.oraGlyph]}>O</Text>
            <Text style={s.oraLabelText}>ORA · EARLY READ</Text>
          </View>
          <Text style={[typography.body, { marginTop: 6 }]}>
            One cycle in. I'm seeing what looks like a luteal-phase shift around
            day 22, but I want one more cycle before I trust it. Hold tight.
          </Text>
        </View>
      )}
      {state.oraEnabled && patternState === 'confirmed' && loggedToday && (
        <View style={[cards.cardMint, { marginBottom: 22 }]}>
          <View style={s.oraLabel}>
            <Text style={[typography.italicDisplay, s.oraGlyph]}>O</Text>
            <Text style={s.oraLabelText}>ORA · PATTERN FOUND</Text>
          </View>
          <Text style={[typography.body, { marginTop: 6 }]}>
            Across 3 cycles, your focus and irritability scores get measurably
            worse from Day 22 onward — the late luteal window. This is the
            biological signal your prescriber needs to discuss luteal-phase
            dosing.
          </Text>
        </View>
      )}

      {/* DRSP progress */}
      <View style={[cards.cardWarm, { padding: 16 }]}>
        <View style={s.progressHeader}>
          <Text style={typography.eyebrow}>Your DRSP chart</Text>
          <Text style={typography.data}>
            {loggedDays} {loggedDays === 1 ? 'day' : 'days'} logged
          </Text>
        </View>
        <Text style={[typography.caption, { marginTop: 4 }]}>
          {loggedDays === 0
            ? 'Your first log will show up here.'
            : 'Your DRSP picture is building.'}
        </Text>
      </View>

      {/* Medical disclaimer */}
      <Text style={s.disclaimer}>
        HormonaIQ is not a substitute for medical advice.
      </Text>

      {/* Tier-2 modal sheet */}
      <Modal
        visible={showTier2}
        animationType="slide"
        transparent
        onRequestClose={() => setShowTier2(false)}
      >
        <View style={s.modalBackdrop}>
          <View style={s.modalSheet}>
            <Text style={[typography.eyebrow, { marginBottom: 8 }]}>
              Support
            </Text>
            <Text style={[typography.h2, { marginBottom: 8 }]}>
              You don't have to ride this out alone.
            </Text>
            <Text style={[typography.body, { marginBottom: 18 }]}>
              If you're in crisis, call or text 988 (US) for the Suicide &
              Crisis Lifeline. Outside the US, contact your local emergency
              services.
            </Text>
            <Pressable
              style={buttons.primary}
              onPress={() => setShowTier2(false)}
              accessibilityRole="button"
              accessibilityLabel="Close support sheet"
            >
              <Text style={buttons.primaryLabel}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* T-21 episode module sheet */}
      <Modal
        visible={showEpisode}
        animationType="slide"
        transparent
        onRequestClose={() => setShowEpisode(false)}
      >
        <View style={s.modalBackdrop}>
          <View style={s.modalSheet}>
            <Text style={[typography.eyebrow, { marginBottom: 8 }]}>
              Log an episode
            </Text>
            <Text style={[typography.h2, { marginBottom: 8 }]}>
              What's happening right now?
            </Text>
            <Text style={[typography.body, { marginBottom: 18 }]}>
              Rage, panic, and dissociation logs help your prescriber see what
              the cycle is doing. Full module coming soon.
            </Text>
            <Pressable
              style={buttons.primary}
              onPress={() => setShowEpisode(false)}
              accessibilityRole="button"
              accessibilityLabel="Close episode sheet"
            >
              <Text style={buttons.primaryLabel}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    marginBottom: 0,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  ghostBtn: {
    height: 44,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  ghostBtnLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.eucalyptusDeep,
  },
  weekStrip: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },
  dayPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.paper,
    alignItems: 'center',
    gap: 4,
    minHeight: 60,
  },
  dayPillToday: {
    borderColor: colors.eucalyptus,
    backgroundColor: colors.mintPale,
  },
  dayPillNum: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.ink,
  },
  dayPillPhase: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    color: colors.ink2,
    letterSpacing: 0.4,
  },
  dayPillDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  oraLabel: {
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
  stripRose: {
    borderLeftWidth: 3,
    borderLeftColor: colors.rose,
  },
  stripButter: {
    borderLeftWidth: 3,
    borderLeftColor: colors.butterDeep,
  },
  stripSage: {
    borderLeftWidth: 3,
    borderLeftColor: colors.eucalyptus,
  },
  stripEucalyptus: {
    borderLeftWidth: 3,
    borderLeftColor: colors.eucalyptusSoft,
  },
  tier1Wrap: {
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
  },
  tier1Link: {
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 18,
    color: colors.ink2,
    textAlign: 'center',
  },
  tier1Underline: {
    textDecorationLine: 'underline',
    color: colors.eucalyptusDeep,
  },
  toolsGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 22,
  },
  toolCard: {
    flex: 1,
    padding: 14,
    minHeight: 110,
  },
  toolGlyph: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  toolGlyphText: {
    fontFamily: fonts.display,
    fontSize: 18,
  },
  toolTitle: {
    fontFamily: fonts.sansSemibold,
    fontSize: 14,
    color: colors.ink,
    marginBottom: 2,
  },
  toolBody: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.ink3,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 8,
  },
  disclaimer: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink3,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
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
    paddingBottom: 36,
  },
});
