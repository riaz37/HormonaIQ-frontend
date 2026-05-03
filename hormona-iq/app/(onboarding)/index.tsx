// Onboarding — full Wave 3 port (T-30, T-31, T-32, T-33, T-34, T-35, T-36, T-83, T-93).
// Steps: 1 → You found us + DOB  |  'block'/'guardian' sub-screens  |
//         2 → Ora intro  |  3 → Conditions  |  3.5/3.7/3.8 sub-screens  |
//         4 → Cycle basics  |  5 → Notifications → router.replace home

import { useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import { buttons, cards, typography } from '../../src/constants/styles';
import { colors, fonts, radius, shadows, spacing } from '../../src/constants/tokens';
import { useAppStore } from '../../src/stores';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

type StepKey =
  | 1
  | 'block'
  | 'guardian'
  | 2
  | 3
  | '3.5'
  | '3.7'
  | '3.8'
  | 4
  | 5;

type ConditionName =
  | 'PMDD'
  | 'PCOS'
  | 'Perimenopause'
  | 'ADHD overlap'
  | 'Endometriosis'
  | "I'm still figuring it out";

type EdAnswer = 'yes' | 'currently' | 'past' | 'prefer-not' | 'no';
type TrackingHistory = 'new' | 'under-year' | 'years';
type NotifChoice = 'allow' | 'deny';
type PerimenopausalStatus = 'unknown' | 'not_yet' | 'perimenopause' | 'postmenopause';
type HbcType =
  | 'combined_pill'
  | 'progestin_only_pill'
  | 'hormonal_iud'
  | 'implant'
  | 'injection'
  | 'patch'
  | 'ring';

interface Condition {
  readonly name: ConditionName;
  readonly desc: string;
  readonly emoji: string;
}

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const CONDITION_LIST: readonly Condition[] = [
  { name: 'PMDD', desc: 'Severe premenstrual mood symptoms', emoji: '🌗' },
  { name: 'PCOS', desc: 'Irregular cycles, androgens, insulin', emoji: '🌀' },
  { name: 'Perimenopause', desc: 'Including premature onset before 40', emoji: '🌾' },
  { name: 'ADHD overlap', desc: 'Track meds across cycle phases', emoji: '🌟' },
  { name: 'Endometriosis', desc: 'Pelvic pain, tissue outside uterus', emoji: '🌺' },
  { name: "I'm still figuring it out", desc: "No diagnosis yet — that's why you're here", emoji: '🍃' },
];

const ED_OPTIONS: readonly { readonly v: EdAnswer; readonly l: string }[] = [
  { v: 'yes', l: 'Yes' },
  { v: 'currently', l: 'Currently' },
  { v: 'past', l: 'In the past' },
  { v: 'prefer-not', l: 'Prefer not to say' },
  { v: 'no', l: 'No' },
];

const TRACKING_OPTIONS: readonly { readonly v: TrackingHistory; readonly l: string }[] = [
  { v: 'new', l: "I'm new to this" },
  { v: 'under-year', l: 'Under a year' },
  { v: 'years', l: 'Years' },
];

const HBC_OPTIONS: readonly { readonly value: HbcType; readonly label: string }[] = [
  { value: 'combined_pill', label: 'Combined pill' },
  { value: 'progestin_only_pill', label: 'Progestin-only pill' },
  { value: 'hormonal_iud', label: 'Hormonal IUD (Mirena, Kyleena)' },
  { value: 'implant', label: 'Implant (Nexplanon)' },
  { value: 'injection', label: 'Injection (Depo-Provera)' },
  { value: 'patch', label: 'Patch' },
  { value: 'ring', label: 'Ring (NuvaRing)' },
];

const NOTIFICATION_EXAMPLES: readonly { readonly icon: string; readonly line: string }[] = [
  { icon: '🔔', line: 'Day 22: heads up — your usual harder window starts in 2 days.' },
  { icon: '✦', line: "Sunday: I'm seeing two patterns this week — open Ora when you have a minute." },
  { icon: '♡', line: "Day 5: the hard part is lifting. Rest counts." },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function defaultLastPeriod(): string {
  const d = new Date();
  d.setDate(d.getDate() - 19);
  return d.toISOString().slice(0, 10);
}

function computeCycleDay(lastPeriod: string, cycleLen: number): number {
  const start = new Date(lastPeriod);
  const today = new Date();
  const diff = Math.floor((today.getTime() - start.getTime()) / 86400000) + 1;
  return Math.max(1, ((diff - 1) % cycleLen) + 1);
}

function phaseLabel(cycleDay: number, cycleLen: number): string {
  if (cycleDay <= 5) return 'menstrual phase';
  if (cycleDay <= Math.round(cycleLen * 0.45)) return 'follicular phase';
  if (cycleDay <= Math.round(cycleLen * 0.55)) return 'ovulatory window';
  return 'luteal phase';
}

function toggleItem<T>(arr: readonly T[], value: T): readonly T[] {
  return arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
}

// ─────────────────────────────────────────────
// Sprig SVG logo mark (RN SVG version)
// ─────────────────────────────────────────────

function Sprig({ size = 28 }: { size?: number }): ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M 16 28 Q 16 18 16 6"
        stroke={colors.eucalyptus}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <Path
        d="M 16 22 Q 9 21 7 14 Q 14 14 16 22"
        fill={colors.eucalyptus}
        opacity="0.85"
      />
      <Path
        d="M 16 17 Q 23 16 25 9 Q 18 9 16 17"
        fill={colors.eucalyptus}
        opacity="0.7"
      />
      <Path
        d="M 16 12 Q 11 11 10 6 Q 15 6 16 12"
        fill={colors.eucalyptus}
        opacity="0.55"
      />
      <Circle cx="16" cy="6" r="2.4" fill={colors.eucalyptus} />
    </Svg>
  );
}

// ─────────────────────────────────────────────
// CycleRing — concentric SVG ring for "that makes sense" hero
// ─────────────────────────────────────────────

interface CycleRingProps {
  cycleDay: number;
  cycleLen: number;
  size?: number;
  animate: boolean;
}

function CycleRing({ cycleDay, cycleLen, size = 220, animate }: CycleRingProps): ReactElement {
  const r = (size - 12) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const progress = Math.max(0, Math.min(1, cycleDay / cycleLen));
  const dash = circumference * progress;

  // Phase colour for the arc (simple 4-phase)
  const day = cycleDay;
  const fEnd = Math.round(cycleLen * 0.45);
  const oEnd = Math.round(cycleLen * 0.55);
  const arcColor =
    day <= 5
      ? colors.rose
      : day <= fEnd
        ? colors.sageLight
        : day <= oEnd
          ? colors.butter
          : colors.coral;

  const scale = useSharedValue(1);
  useEffect(() => {
    if (!animate) {
      scale.value = 1;
      return;
    }
    scale.value = withRepeat(
      withTiming(1.06, { duration: 3000, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [animate, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[{ width: size, height: size }, animStyle]}>
      <Svg width={size} height={size}>
        {/* Track */}
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={colors.mintMist}
          strokeWidth={8}
          fill="transparent"
        />
        {/* Progress arc */}
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={arcColor}
          strokeWidth={8}
          strokeLinecap="round"
          fill="transparent"
          strokeDasharray={`${dash} ${circumference}`}
          transform={`rotate(-90 ${cx} ${cy})`}
        />
        {/* Centre plate */}
        <Circle cx={cx} cy={cy} r={r - 22} fill={colors.paper} opacity={0.8} />
      </Svg>
      <View style={ringStyles.center} pointerEvents="none">
        <Text style={ringStyles.dayLabel}>Day {cycleDay}</Text>
        <Text style={ringStyles.phaseLabel}>{phaseLabel(cycleDay, cycleLen).toUpperCase()}</Text>
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
  dayLabel: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.ink,
    letterSpacing: -0.5,
  },
  phaseLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    letterSpacing: 1.6,
    color: colors.ink2,
    textTransform: 'uppercase',
    marginTop: 4,
    textAlign: 'center',
  },
});

// ─────────────────────────────────────────────
// ProgressDots
// ─────────────────────────────────────────────

function ProgressDots({ total, current }: { total: number; current: number }): ReactElement {
  return (
    <View style={dotStyles.row}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            dotStyles.dot,
            i + 1 === current && dotStyles.dotActive,
            i + 1 < current && dotStyles.dotDone,
          ]}
        />
      ))}
    </View>
  );
}

const dotStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.inkDisabled,
  },
  dotActive: {
    width: 18,
    borderRadius: 4,
    backgroundColor: colors.eucalyptus,
  },
  dotDone: {
    backgroundColor: colors.sage,
  },
});

// ─────────────────────────────────────────────
// Switch toggle (T-35 Ora)
// ─────────────────────────────────────────────

function Switch({ on, onToggle, label }: { on: boolean; onToggle: () => void; label: string }): ReactElement {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.8}
      style={switchStyles.track}
      accessibilityRole="switch"
      accessibilityState={{ checked: on }}
      accessibilityLabel={label}
    >
      <View style={[switchStyles.thumb, on && switchStyles.thumbOn]} />
    </TouchableOpacity>
  );
}

const switchStyles = StyleSheet.create({
  track: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.inkDisabled,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.paper,
    alignSelf: 'flex-start',
  },
  thumbOn: {
    alignSelf: 'flex-end',
    backgroundColor: colors.paper,
  },
});

// ─────────────────────────────────────────────
// SelectPicker — native-style picker using TouchableOpacity list (RN has no <select>)
// ─────────────────────────────────────────────

interface SelectOption<T extends string> {
  readonly value: T;
  readonly label: string;
}

function SelectPicker<T extends string>({
  options,
  value,
  onChange,
  placeholder,
  accessibilityLabel,
}: {
  options: readonly SelectOption<T>[];
  value: T | null;
  onChange: (v: T) => void;
  placeholder?: string;
  accessibilityLabel?: string;
}): ReactElement {
  return (
    <View style={selectStyles.container} accessibilityLabel={accessibilityLabel}>
      {placeholder && !value && (
        <Text style={selectStyles.placeholder}>{placeholder}</Text>
      )}
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.7}
            style={[selectStyles.option, selected && selectStyles.optionSelected]}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={opt.label}
          >
            <Text style={[selectStyles.optionLabel, selected && selectStyles.optionLabelSelected]}>
              {opt.label}
            </Text>
            {selected && <Text style={selectStyles.checkmark}>✓</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const selectStyles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: colors.paper,
  },
  placeholder: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink3,
    padding: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 44,
    backgroundColor: colors.paper,
  },
  optionSelected: {
    backgroundColor: colors.mintPale,
  },
  optionLabel: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink,
  },
  optionLabelSelected: {
    fontFamily: fonts.sansMedium,
    color: colors.eucalyptusDeep,
  },
  checkmark: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.eucalyptus,
  },
});

// ─────────────────────────────────────────────
// Stepper
// ─────────────────────────────────────────────

function Stepper({
  value,
  min,
  max,
  onChange,
  unit,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
  unit: string;
}): ReactElement {
  return (
    <View style={stepperStyles.row}>
      <TouchableOpacity
        onPress={() => onChange(Math.max(min, value - 1))}
        style={stepperStyles.btn}
        accessibilityRole="button"
        accessibilityLabel={`Decrease ${unit}`}
        disabled={value <= min}
      >
        <Text style={stepperStyles.btnLabel}>−</Text>
      </TouchableOpacity>
      <Text style={stepperStyles.val}>
        {value} {unit}
      </Text>
      <TouchableOpacity
        onPress={() => onChange(Math.min(max, value + 1))}
        style={stepperStyles.btn}
        accessibilityRole="button"
        accessibilityLabel={`Increase ${unit}`}
        disabled={value >= max}
      >
        <Text style={stepperStyles.btnLabel}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const stepperStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  btn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: colors.eucalyptus,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.paper,
  },
  btnLabel: {
    fontFamily: fonts.sansSemibold,
    fontSize: 18,
    color: colors.eucalyptus,
    lineHeight: 22,
  },
  val: {
    fontFamily: fonts.sansMedium,
    fontSize: 17,
    color: colors.ink,
    minWidth: 90,
    textAlign: 'center',
  },
});

// ─────────────────────────────────────────────
// CheckboxRow
// ─────────────────────────────────────────────

function CheckboxRow({
  checked,
  onToggle,
  label,
  accessibilityLabel,
}: {
  checked: boolean;
  onToggle: () => void;
  label: string;
  accessibilityLabel?: string;
}): ReactElement {
  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.8}
      style={cbStyles.row}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={accessibilityLabel ?? label}
    >
      <View style={[cbStyles.box, checked && cbStyles.boxChecked]}>
        {checked && <Text style={cbStyles.tick}>✓</Text>}
      </View>
      <Text style={cbStyles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const cbStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 44,
  },
  box: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: colors.inkDisabled,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: colors.eucalyptus,
    borderColor: colors.eucalyptus,
  },
  tick: {
    color: colors.paper,
    fontSize: 13,
    fontFamily: fonts.sansBold,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink,
    flex: 1,
  },
});

// ─────────────────────────────────────────────
// OnboardingScreen — main component
// ─────────────────────────────────────────────

export default function OnboardingScreen(): ReactElement {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const currentYear = new Date().getFullYear();

  // ── State ────────────────────────────────────────────────────────────────

  const [step, setStep] = useState<StepKey>(1);
  const [yob, setYob] = useState<number>(1995);
  const [conditions, setConditions] = useState<readonly ConditionName[]>(['PMDD']);
  const [primaryCondition, setPrimaryCondition] = useState<ConditionName | null>(null);
  const [edAnswer, setEdAnswer] = useState<EdAnswer | null>(null);
  const [trackingHistory, setTrackingHistory] = useState<TrackingHistory | null>(null);
  const [oraDisabled, setOraDisabled] = useState<boolean>(false);
  const [lastPeriod, setLastPeriod] = useState<string>(defaultLastPeriod);
  const [cycleLen, setCycleLen] = useState<number>(28);
  const [irregular, setIrregular] = useState<boolean>(false);
  const [guardianEmail, setGuardianEmail] = useState<string>('');
  const [hbcActive, setHbcActive] = useState<boolean>(false);
  const [hbcType, setHbcType] = useState<HbcType | null>(null);
  const [perimenopausalStatus, setPerimenopausalStatus] = useState<PerimenopausalStatus>('unknown');
  const [notifChoice, setNotifChoice] = useState<NotifChoice | null>(null);

  // ── Derived ──────────────────────────────────────────────────────────────

  const age = currentYear - yob;

  const cycleDay = useMemo(
    () => computeCycleDay(lastPeriod, cycleLen),
    [lastPeriod, cycleLen],
  );

  const currentPhaseLabel = useMemo(
    () => phaseLabel(cycleDay, cycleLen),
    [cycleDay, cycleLen],
  );

  // ── Step navigation ───────────────────────────────────────────────────────

  const next = (target: StepKey): void => setStep(target);

  const back = (): void => {
    if (step === 'block' || step === 'guardian') { setStep(1); return; }
    if (step === 2) { setStep(1); return; }
    if (step === 3) { setStep(2); return; }
    if (step === '3.5') { setStep(3); return; }
    if (step === '3.7') { setStep(3); return; }
    if (step === '3.8') { setStep('3.7'); return; }
    if (step === 4) { setStep('3.8'); return; }
    if (step === 5) { setStep(4); return; }
    if (step === 1) { router.push('/(app)/home'); return; }
  };

  const visibleStepIndex = ((): number => {
    if (step === 1 || step === 'block' || step === 'guardian') return 1;
    if (step === 2) return 2;
    if (step === 3 || step === '3.5' || step === '3.7' || step === '3.8') return 3;
    if (step === 4) return 4;
    if (step === 5) return 5;
    return 1;
  })();

  const isHero = step === 1 || step === 4;

  // ── DOB submit ────────────────────────────────────────────────────────────

  const submitDob = (): void => {
    if (age < 13) {
      next('block');
    } else if (age < 16) {
      next('guardian');
    } else {
      next(2);
    }
  };

  // ── Finish ────────────────────────────────────────────────────────────────

  const finish = (): void => {
    // Persist onboarding selections to the app store before navigating home.
    const app = useAppStore.getState();
    app.setConditions(conditions);
    if (primaryCondition) {
      app.setPrimaryCondition(primaryCondition);
    } else if (conditions.length === 1) {
      app.setPrimaryCondition(conditions[0]);
    }
    app.setAdhdFlag(conditions.includes('ADHD overlap'));
    app.setCycleLen(cycleLen);
    app.setLastPeriod(lastPeriod ? new Date(lastPeriod) : null);

    router.replace('/(app)/home');
  };

  // ── Year of birth options ─────────────────────────────────────────────────

  const yobOptions: readonly SelectOption<string>[] = useMemo(() => {
    const opts: SelectOption<string>[] = [];
    for (let y = currentYear; y >= 1940; y -= 1) {
      opts.push({ value: String(y), label: String(y) });
    }
    return opts;
  }, [currentYear]);

  // ── HBC + peri visibility flags ──────────────────────────────────────────

  const showHbc =
    conditions.includes('Perimenopause') ||
    conditions.includes('ADHD overlap') ||
    age >= 35;

  const showPeri = conditions.includes('Perimenopause') || age >= 40;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <SafeAreaView
      style={[s.safe, isHero && s.safeHero]}
      edges={['top', 'bottom']}
    >
      {/* Header row — back button + progress dots */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={step === 1 ? () => router.push('/(app)/home') : back}
          style={[s.iconBtn, isHero && s.iconBtnHero]}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={s.chevron}>‹</Text>
        </TouchableOpacity>

        <ProgressDots total={5} current={visibleStepIndex} />

        {/* Spacer to balance the back button */}
        <View style={s.headerSpacer} />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ─── STEP 1 — You found us + DOB (T-30, T-31) ─────────────────── */}
        {step === 1 && (
          <View style={s.centerColumn}>
            <View style={s.sprigWrap}>
              <Sprig size={68} />
            </View>
            <Text style={[typography.display, s.displayCenter]}>
              You found us.
            </Text>
            <Text style={[typography.bodyL, s.bodyCenter, { marginBottom: 8 }]}>
              This isn't a period tracker. It isn't a fertility app.
            </Text>
            <Text style={[typography.bodyL, s.bodyCenter, { marginBottom: spacing.xl }]}>
              It's for the other weeks of the month — the ones no one else tracks.
            </Text>

            {/* Year of birth card */}
            <View style={s.dobCard}>
              <Text style={[typography.eyebrow, { marginBottom: 10 }]}>
                Year of birth
              </Text>
              <SelectPicker<string>
                options={yobOptions}
                value={String(yob)}
                onChange={(v) => setYob(parseInt(v, 10))}
                accessibilityLabel="Select year of birth"
              />
              <Text style={[typography.caption, { marginTop: 8 }]}>
                We use age to tailor your safety resources. We don't share it.
              </Text>
            </View>

            <TouchableOpacity
              style={[buttons.primary, s.ctaFull, { marginTop: spacing.md }]}
              onPress={submitDob}
              accessibilityRole="button"
              accessibilityLabel="Continue"
              activeOpacity={0.85}
            >
              <Text style={buttons.primaryLabel}>Continue →</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={s.ghostBtn}
              onPress={() => router.push('/(app)/home')}
              accessibilityRole="button"
              accessibilityLabel="I have an account, go to home"
              activeOpacity={0.7}
            >
              <Text style={s.ghostBtnLabel}>I have an account</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ─── BLOCK screen (T-31 hard block <13) ───────────────────────── */}
        {step === 'block' && (
          <View style={s.centerColumn}>
            <Text style={[typography.eyebrow, { marginBottom: 12 }]}>
              AGE REQUIREMENT
            </Text>
            <Text style={[typography.display, s.displayCenter, { marginBottom: 18 }]}>
              You'll need to be a bit older.
            </Text>
            <Text style={[typography.bodyL, s.bodyCenter, { marginBottom: 18 }]}>
              HormonaIQ requires users to be 13 or older. We're sorry — please
              come back when you're older.
            </Text>
            <Text style={[typography.caption, s.bodyCenter]}>
              If you're concerned about symptoms, please talk to a parent,
              guardian, or a school nurse.
            </Text>
          </View>
        )}

        {/* ─── GUARDIAN consent screen (T-31, 13–15) ───────────────────── */}
        {step === 'guardian' && (
          <View style={s.maxColumn}>
            <Text style={[typography.eyebrow, { marginBottom: 8 }]}>
              PARENT / GUARDIAN CONSENT
            </Text>
            <Text style={[typography.display, { marginBottom: 14 }]}>
              One quick step before we go further.
            </Text>
            <Text style={[typography.body, { color: colors.ink2, marginBottom: 22 }]}>
              Because you're under 16, we need a parent or guardian's consent
              to keep your data. Send them a quick email and they'll be able to
              confirm.
            </Text>
            <Text style={[typography.eyebrow, { marginBottom: 8 }]}>
              Guardian email
            </Text>
            <TextInput
              style={s.textInput}
              value={guardianEmail}
              onChangeText={setGuardianEmail}
              placeholder="adult@email.com"
              placeholderTextColor={colors.ink3}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              accessibilityLabel="Guardian email address"
            />
            <TouchableOpacity
              style={[
                buttons.primary,
                { marginTop: 22 },
                !guardianEmail && buttons.primaryDisabled,
              ]}
              onPress={() => next(2)}
              disabled={!guardianEmail}
              accessibilityRole="button"
              accessibilityLabel="Send consent email and continue"
              activeOpacity={0.85}
            >
              <Text style={buttons.primaryLabel}>Send consent email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.ghostBtn, { marginTop: 10, alignSelf: 'center' }]}
              onPress={() => next(2)}
              accessibilityRole="button"
              accessibilityLabel="Handle consent later and continue"
              activeOpacity={0.7}
            >
              <Text style={s.ghostBtnLabel}>I'll handle this later</Text>
            </TouchableOpacity>
            <Text style={[typography.caption, { fontSize: 11, marginTop: 18 }]}>
              Until consent is confirmed, your data lives only on this device.
            </Text>
          </View>
        )}

        {/* ─── STEP 2 — Ora introduction (T-35) ────────────────────────── */}
        {step === 2 && (
          <View style={s.maxColumn}>
            <Text style={[typography.italicDisplay, s.oraName]}>Ora</Text>
            <Text style={[typography.display, { marginBottom: 18 }]}>
              Hi. I'm Ora.
            </Text>
            <View style={[cards.cardMint, { marginBottom: 14, borderLeftWidth: 3, borderLeftColor: colors.sage }]}>
              <Text style={[typography.body, { marginBottom: 12 }]}>
                I'm not your doctor and I'm not a therapist — I'm an AI you can
                talk to who knows hormonal health and is going to know your
                cycle better than anyone.
              </Text>
              <Text style={typography.body}>
                I'll be here at 3am if you need me. I'll be quiet when you
                don't.
              </Text>
            </View>

            {/* Disable Ora toggle */}
            <View style={s.toggleRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.toggleTitle}>Disable Ora</Text>
                <Text style={[typography.caption, { fontSize: 12 }]}>
                  You can turn me on later from Profile.
                </Text>
              </View>
              <Switch
                on={oraDisabled}
                onToggle={() => setOraDisabled((v) => !v)}
                label={oraDisabled ? 'Ora disabled' : 'Ora enabled — tap to disable'}
              />
            </View>

            <TouchableOpacity
              style={[buttons.primary, { marginTop: 18 }]}
              onPress={() => next(3)}
              accessibilityRole="button"
              accessibilityLabel="Continue to conditions"
              activeOpacity={0.85}
            >
              <Text style={buttons.primaryLabel}>Continue →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ─── STEP 3 — Conditions (T-30) ──────────────────────────────── */}
        {step === 3 && (
          <View>
            <Text style={[typography.display, { marginBottom: 10 }]}>
              What brings you here?
            </Text>
            <Text style={[typography.body, { color: colors.ink2, marginBottom: 24 }]}>
              Pick any that apply. These often travel together.
            </Text>

            <View style={s.conditionGrid}>
              {CONDITION_LIST.map((c) => {
                const on = conditions.includes(c.name);
                return (
                  <TouchableOpacity
                    key={c.name}
                    onPress={() => setConditions((prev) => toggleItem(prev, c.name))}
                    style={[s.conditionCard, on && s.conditionCardActive]}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: on }}
                    accessibilityLabel={`${c.name}. ${c.desc}`}
                    activeOpacity={0.8}
                  >
                    <Text style={s.conditionEmoji}>{c.emoji}</Text>
                    <Text style={s.conditionName}>{c.name}</Text>
                    <Text style={[typography.caption, { marginTop: 4 }]}>{c.desc}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[
                buttons.primary,
                { marginTop: 20 },
                !conditions.length && buttons.primaryDisabled,
              ]}
              onPress={() => next(conditions.length >= 2 ? '3.5' : '3.7')}
              disabled={!conditions.length}
              accessibilityRole="button"
              accessibilityLabel="Continue"
              activeOpacity={0.85}
            >
              <Text style={buttons.primaryLabel}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ─── STEP 3.5 — Multi-condition disclosure (T-33) ────────────── */}
        {step === '3.5' && (
          <View style={s.maxColumn}>
            <Text style={[typography.eyebrow, { marginBottom: 8 }]}>
              WE'LL TAKE THESE ONE AT A TIME
            </Text>
            <Text style={[typography.display, { marginBottom: 12 }]}>
              We'll set one up first. The rest can wait.
            </Text>
            <Text style={[typography.body, { color: colors.ink2, marginBottom: 22 }]}>
              Setting up everything at once is too much. Pick the one that
              matters most right now — the others will get their own setup
              later, when you're ready.
            </Text>

            <View style={{ gap: 10 }}>
              {conditions.map((c) => {
                const on = primaryCondition === c;
                return (
                  <TouchableOpacity
                    key={c}
                    onPress={() => setPrimaryCondition(c)}
                    style={[s.listOption, on && s.listOptionActive]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: on }}
                    accessibilityLabel={c}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.listOptionLabel, on && s.listOptionLabelActive]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[
                buttons.primary,
                { marginTop: 20 },
                !primaryCondition && buttons.primaryDisabled,
              ]}
              onPress={() => next('3.7')}
              disabled={!primaryCondition}
              accessibilityRole="button"
              accessibilityLabel="Continue"
              activeOpacity={0.85}
            >
              <Text style={buttons.primaryLabel}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ─── STEP 3.7 — ED opt-out (T-32) ───────────────────────────── */}
        {step === '3.7' && (
          <View style={s.maxColumn}>
            <Text style={[typography.eyebrow, { marginBottom: 8 }]}>
              A QUICK ASK BEFORE WE GO FURTHER
            </Text>
            <Text style={[typography.display, { marginBottom: 14 }]}>
              Have you had a difficult relationship with food or body image?
            </Text>
            <Text style={[typography.caption, { marginBottom: 20, fontSize: 13, color: colors.ink2 }]}>
              We ask because some features can be unhelpful for people with ED
              history. Your answer just shapes what's visible.
            </Text>

            <View style={{ gap: 10 }}>
              {ED_OPTIONS.map((o) => {
                const on = edAnswer === o.v;
                return (
                  <TouchableOpacity
                    key={o.v}
                    onPress={() => setEdAnswer(o.v)}
                    style={[s.listOption, on && s.listOptionActive]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: on }}
                    accessibilityLabel={o.l}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.listOptionLabel, on && s.listOptionLabelActive]}>
                      {o.l}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[
                buttons.primary,
                { marginTop: 22 },
                !edAnswer && buttons.primaryDisabled,
              ]}
              onPress={() => next('3.8')}
              disabled={!edAnswer}
              accessibilityRole="button"
              accessibilityLabel="Continue"
              activeOpacity={0.85}
            >
              <Text style={buttons.primaryLabel}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ─── STEP 3.8 — Veteran-tracker fork (T-34) ─────────────────── */}
        {step === '3.8' && (
          <View style={s.maxColumn}>
            <Text style={[typography.eyebrow, { marginBottom: 8 }]}>
              ONE MORE
            </Text>
            <Text style={[typography.display, { marginBottom: 18 }]}>
              How long have you been tracking?
            </Text>

            <View style={{ gap: 10 }}>
              {TRACKING_OPTIONS.map((o) => {
                const on = trackingHistory === o.v;
                return (
                  <TouchableOpacity
                    key={o.v}
                    onPress={() => setTrackingHistory(o.v)}
                    style={[s.listOption, on && s.listOptionActive]}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: on }}
                    accessibilityLabel={o.l}
                    activeOpacity={0.8}
                  >
                    <Text style={[s.listOptionLabel, on && s.listOptionLabelActive]}>
                      {o.l}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity
              style={[
                buttons.primary,
                { marginTop: 22 },
                !trackingHistory && buttons.primaryDisabled,
              ]}
              onPress={() => next(4)}
              disabled={!trackingHistory}
              accessibilityRole="button"
              accessibilityLabel="Continue"
              activeOpacity={0.85}
            >
              <Text style={buttons.primaryLabel}>Continue</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ─── STEP 4 — Cycle basics + "that makes sense" hero (T-36) ──── */}
        {step === 4 && (
          <View style={s.maxColumn}>
            <Text style={[typography.display, { marginBottom: 22 }]}>
              Cycle basics
            </Text>

            {/* Last period date input */}
            <Text style={[typography.eyebrow, { marginBottom: 8 }]}>
              When did your last period start?
            </Text>
            <TextInput
              style={s.textInput}
              value={lastPeriod}
              onChangeText={setLastPeriod}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.ink3}
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
              accessibilityLabel="Last period start date, format YYYY-MM-DD"
            />

            {/* Cycle length stepper */}
            <Text style={[typography.eyebrow, { marginTop: 22, marginBottom: 12 }]}>
              Typical cycle length
            </Text>
            <Stepper
              value={cycleLen}
              min={14}
              max={120}
              onChange={setCycleLen}
              unit="days"
            />

            {/* Irregular toggle */}
            <View style={[s.checkCard, { marginTop: 22 }]}>
              <CheckboxRow
                checked={irregular}
                onToggle={() => setIrregular((v) => !v)}
                label="My cycles are irregular"
                accessibilityLabel="My cycles are irregular"
              />
            </View>

            {/* R7 — F89 HBC flag */}
            {showHbc && (
              <View style={[s.checkCard, { marginTop: 14 }]}>
                <CheckboxRow
                  checked={hbcActive}
                  onToggle={() => setHbcActive((v) => !v)}
                  label="I'm on hormonal birth control"
                  accessibilityLabel="I'm on hormonal birth control"
                />
                <Text style={[typography.caption, { marginTop: 6, fontSize: 12 }]}>
                  HBC suppresses FSH and can mask cycle changes — knowing this
                  helps us interpret your data accurately.
                </Text>
                {hbcActive && (
                  <View style={{ marginTop: 12 }}>
                    <SelectPicker<HbcType>
                      options={HBC_OPTIONS}
                      value={hbcType}
                      onChange={setHbcType}
                      placeholder="Type of HBC…"
                      accessibilityLabel="Select type of hormonal birth control"
                    />
                  </View>
                )}
              </View>
            )}

            {/* R7 — Perimenopausal status */}
            {showPeri && (
              <View style={[s.checkCard, { marginTop: 14 }]}>
                <Text style={[typography.eyebrow, { marginBottom: 8 }]}>
                  WHERE ARE YOU IN YOUR TRANSITION?
                </Text>
                <SelectPicker<PerimenopausalStatus>
                  options={[
                    { value: 'unknown', label: 'Not sure yet' },
                    { value: 'not_yet', label: 'Not yet — cycles still regular' },
                    { value: 'perimenopause', label: 'Perimenopause — symptoms started, periods still happening' },
                    { value: 'postmenopause', label: 'Postmenopause — 12+ months since last period' },
                  ]}
                  value={perimenopausalStatus}
                  onChange={setPerimenopausalStatus}
                  accessibilityLabel="Select perimenopausal status"
                />
                {perimenopausalStatus === 'postmenopause' && (
                  <Text style={[typography.caption, { marginTop: 8, fontSize: 12, color: colors.rose }]}>
                    Important: bleeding after menopause needs evaluation. We'll
                    flag this in your daily log.
                  </Text>
                )}
              </View>
            )}

            {/* "that makes sense" hero — T-36 */}
            <View style={s.thatMakesWrap}>
              <Text style={[typography.bodyL, { marginBottom: 18, textAlign: 'center' }]}>
                You're on Day{' '}
                <Text style={s.monoDay}>{cycleDay}</Text>
                {' '}— likely your {currentPhaseLabel}.
              </Text>
              <View style={{ alignItems: 'center' }}>
                <CycleRing
                  cycleDay={cycleDay}
                  cycleLen={cycleLen}
                  size={220}
                  animate={!reduceMotion}
                />
              </View>
              <Text style={s.thatMakesSentence}>
                that makes sense.
              </Text>
              {trackingHistory !== 'years' && (
                <>
                  <Text style={[typography.bodyL, { marginTop: 12, textAlign: 'center' }]}>
                    Many people start tracking in their luteal phase. We'll
                    learn your specific pattern over the next 30 days.
                  </Text>
                  <Text style={[typography.caption, { marginTop: 14, fontSize: 13, textAlign: 'center' }]}>
                    It takes two full cycles to establish your pattern. This
                    is not a limitation of the app — it is a clinical
                    requirement.
                  </Text>
                </>
              )}
            </View>

            <TouchableOpacity
              style={[buttons.primary, { marginTop: 28 }]}
              onPress={() => next(5)}
              accessibilityRole="button"
              accessibilityLabel="Continue to notifications"
              activeOpacity={0.85}
            >
              <Text style={buttons.primaryLabel}>Continue →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ─── STEP 5 — Notifications (T-83) ───────────────────────────── */}
        {step === 5 && (
          <View style={s.maxColumn}>
            <Text style={[typography.eyebrow, { marginBottom: 8 }]}>
              NOTIFICATIONS
            </Text>
            <Text style={[typography.display, { marginBottom: 14 }]}>
              Stay ahead of your cycle
            </Text>
            <Text style={[typography.body, { color: colors.ink2, marginBottom: 22 }]}>
              I'll send a quiet heads-up before your harder days. You can turn
              this off anytime.
            </Text>

            {/* T-93 — notification example previews */}
            <View style={{ gap: 10, marginBottom: 24 }}>
              {NOTIFICATION_EXAMPLES.map((ex, i) => (
                <View key={i} style={s.notifExample}>
                  <View style={s.notifIconWrap}>
                    <Text style={{ fontSize: 14 }}>{ex.icon}</Text>
                  </View>
                  <Text style={[typography.caption, { fontSize: 13, color: colors.ink2, flex: 1 }]}>
                    {ex.line}
                  </Text>
                </View>
              ))}
            </View>

            {/* T-83 — equalized outline buttons */}
            <View style={{ gap: 10 }}>
              <TouchableOpacity
                style={[
                  s.notifBtn,
                  notifChoice === 'allow' && s.notifBtnSelected,
                ]}
                onPress={() => setNotifChoice('allow')}
                accessibilityRole="radio"
                accessibilityState={{ selected: notifChoice === 'allow' }}
                accessibilityLabel="Allow notifications"
                activeOpacity={0.8}
              >
                <Text style={[s.notifBtnLabel, notifChoice === 'allow' && s.notifBtnLabelSelected]}>
                  Allow notifications
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  s.notifBtn,
                  notifChoice === 'deny' && s.notifBtnSelected,
                ]}
                onPress={() => setNotifChoice('deny')}
                accessibilityRole="radio"
                accessibilityState={{ selected: notifChoice === 'deny' }}
                accessibilityLabel="Not now, skip notifications"
                activeOpacity={0.8}
              >
                <Text style={[s.notifBtnLabel, notifChoice === 'deny' && s.notifBtnLabelSelected]}>
                  Not now
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                buttons.primary,
                { marginTop: 24 },
                !notifChoice && buttons.primaryDisabled,
              ]}
              onPress={finish}
              disabled={!notifChoice}
              accessibilityRole="button"
              accessibilityLabel="Begin using HormonaIQ"
              activeOpacity={0.85}
            >
              <Text style={buttons.primaryLabel}>Begin →</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  safeHero: {
    backgroundColor: colors.mintPale,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    paddingVertical: 14,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  iconBtnHero: {
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  chevron: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.ink,
    lineHeight: 24,
    marginTop: -1,
  },
  headerSpacer: {
    width: 38,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 26,
    paddingBottom: 48,
    paddingTop: 8,
  },

  // Step layout helpers
  centerColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 520,
    alignSelf: 'center',
    width: '100%',
  },
  maxColumn: {
    maxWidth: 520,
    alignSelf: 'center',
    width: '100%',
  },
  displayCenter: {
    textAlign: 'center',
    marginBottom: 20,
  },
  bodyCenter: {
    textAlign: 'center',
    color: colors.ink2,
  },

  // DOB card
  dobCard: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: radius.md,
    padding: 20,
    marginBottom: 16,
    width: '100%',
  },

  // Sprig animation wrapper
  sprigWrap: {
    alignSelf: 'center',
    marginBottom: 32,
  },

  // Ghost button
  ghostBtn: {
    height: 44,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  ghostBtnLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.eucalyptusDeep,
  },

  // CTA full-width
  ctaFull: {
    width: '100%',
    maxWidth: 360,
  },

  // Text input
  textInput: {
    height: 48,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.paper,
  },

  // Ora step
  oraName: {
    fontSize: 32,
    color: colors.eucalyptus,
    marginBottom: 4,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    padding: 14,
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 4,
    minHeight: 60,
  },
  toggleTitle: {
    fontFamily: fonts.sansSemibold,
    fontSize: 14,
    color: colors.ink,
    marginBottom: 2,
  },

  // Conditions grid
  conditionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 4,
  },
  conditionCard: {
    width: '47%',
    minHeight: 110,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    ...shadows.sm,
  },
  conditionCardActive: {
    borderColor: colors.eucalyptus,
    backgroundColor: colors.mintPale,
    ...shadows.md,
  },
  conditionEmoji: {
    fontSize: 22,
    marginBottom: 6,
  },
  conditionName: {
    fontFamily: fonts.sansSemibold,
    fontSize: 15,
    color: colors.ink,
  },

  // List option (radio-style)
  listOption: {
    minHeight: 60,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    justifyContent: 'center',
  },
  listOptionActive: {
    borderColor: colors.eucalyptus,
    backgroundColor: colors.mintPale,
  },
  listOptionLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.ink,
  },
  listOptionLabelActive: {
    color: colors.eucalyptusDeep,
  },

  // Checkbox card wrapper
  checkCard: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: radius.md,
    padding: 14,
  },

  // "That makes sense" hero
  thatMakesWrap: {
    marginTop: 32,
    alignItems: 'center',
  },
  monoDay: {
    fontFamily: fonts.mono,
    fontWeight: '500',
    color: colors.eucalyptusDeep,
  },
  thatMakesSentence: {
    fontFamily: fonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 44,
    lineHeight: 44 * 1.05,
    letterSpacing: -0.44,
    color: colors.eucalyptusDeep,
    textAlign: 'center',
    marginTop: 28,
  },

  // Notification examples
  notifExample: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.paper,
    ...shadows.sm,
  },
  notifIconWrap: {
    flexShrink: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.mintPale,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Notification buttons (equalized outline, T-83)
  notifBtn: {
    height: 52,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.eucalyptus,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  notifBtnSelected: {
    backgroundColor: colors.mintPale,
    borderWidth: 2,
  },
  notifBtnLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.eucalyptusDeep,
  },
  notifBtnLabelSelected: {
    color: colors.eucalyptusDeep,
  },
});
