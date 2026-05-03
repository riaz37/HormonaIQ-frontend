// StepCycleBasics — Step 4: cycle length, last period, irregular flag,
// optional HBC, optional perimenopausal status, and the "that makes sense" hero.
// Props-only — no direct store access.

import { useMemo, useEffect } from 'react';
import type { ReactElement } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import { buttons, typography } from '../../constants/styles';
import { colors, fonts, radius } from '../../constants/tokens';
import type { HbcType, PerimenopausalStatus, TrackingHistory } from './types';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const HBC_OPTIONS: readonly { readonly value: HbcType; readonly label: string }[] = [
  { value: 'combined_pill', label: 'Combined pill' },
  { value: 'progestin_only_pill', label: 'Progestin-only pill' },
  { value: 'hormonal_iud', label: 'Hormonal IUD (Mirena, Kyleena)' },
  { value: 'implant', label: 'Implant (Nexplanon)' },
  { value: 'injection', label: 'Injection (Depo-Provera)' },
  { value: 'patch', label: 'Patch' },
  { value: 'ring', label: 'Ring (NuvaRing)' },
];

const PERI_OPTIONS: readonly { readonly value: PerimenopausalStatus; readonly label: string }[] = [
  { value: 'unknown', label: 'Not sure yet' },
  { value: 'not_yet', label: 'Not yet — cycles still regular' },
  { value: 'perimenopause', label: 'Perimenopause — symptoms started, periods still happening' },
  { value: 'postmenopause', label: 'Postmenopause — 12+ months since last period' },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

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

// ─────────────────────────────────────────────
// SelectPicker (local — for HBC and peri)
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
// CycleRing
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
        <Circle
          cx={cx}
          cy={cy}
          r={r}
          stroke={colors.mintMist}
          strokeWidth={8}
          fill="transparent"
        />
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
// Props
// ─────────────────────────────────────────────

export interface StepCycleBasicsProps {
  lastPeriod: string;
  cycleLen: number;
  irregular: boolean;
  hbcActive: boolean;
  hbcType: HbcType | null;
  perimenopausalStatus: PerimenopausalStatus;
  trackingHistory: TrackingHistory | null;
  showHbc: boolean;
  showPeri: boolean;
  reduceMotion: boolean;
  onLastPeriodChange: (v: string) => void;
  onCycleLenChange: (v: number) => void;
  onIrregularToggle: () => void;
  onHbcActiveToggle: () => void;
  onHbcTypeChange: (v: HbcType) => void;
  onPerimenopausalStatusChange: (v: PerimenopausalStatus) => void;
  onContinue: () => void;
}

// ─────────────────────────────────────────────
// StepCycleBasics — exported component
// ─────────────────────────────────────────────

export function StepCycleBasics({
  lastPeriod,
  cycleLen,
  irregular,
  hbcActive,
  hbcType,
  perimenopausalStatus,
  trackingHistory,
  showHbc,
  showPeri,
  reduceMotion,
  onLastPeriodChange,
  onCycleLenChange,
  onIrregularToggle,
  onHbcActiveToggle,
  onHbcTypeChange,
  onPerimenopausalStatusChange,
  onContinue,
}: StepCycleBasicsProps): ReactElement {
  const cycleDay = useMemo(
    () => computeCycleDay(lastPeriod, cycleLen),
    [lastPeriod, cycleLen],
  );

  const currentPhaseLabel = useMemo(
    () => phaseLabel(cycleDay, cycleLen),
    [cycleDay, cycleLen],
  );

  return (
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
        onChangeText={onLastPeriodChange}
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
        onChange={onCycleLenChange}
        unit="days"
      />

      {/* Irregular toggle */}
      <View style={[s.checkCard, { marginTop: 22 }]}>
        <CheckboxRow
          checked={irregular}
          onToggle={onIrregularToggle}
          label="My cycles are irregular"
          accessibilityLabel="My cycles are irregular"
        />
      </View>

      {/* HBC flag */}
      {showHbc && (
        <View style={[s.checkCard, { marginTop: 14 }]}>
          <CheckboxRow
            checked={hbcActive}
            onToggle={onHbcActiveToggle}
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
                onChange={onHbcTypeChange}
                placeholder="Type of HBC…"
                accessibilityLabel="Select type of hormonal birth control"
              />
            </View>
          )}
        </View>
      )}

      {/* Perimenopausal status */}
      {showPeri && (
        <View style={[s.checkCard, { marginTop: 14 }]}>
          <Text style={[typography.eyebrow, { marginBottom: 8 }]}>
            WHERE ARE YOU IN YOUR TRANSITION?
          </Text>
          <SelectPicker<PerimenopausalStatus>
            options={PERI_OPTIONS}
            value={perimenopausalStatus}
            onChange={onPerimenopausalStatusChange}
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

      {/* "that makes sense" hero */}
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
        onPress={onContinue}
        accessibilityRole="button"
        accessibilityLabel="Continue to notifications"
        activeOpacity={0.85}
      >
        <Text style={buttons.primaryLabel}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const s = StyleSheet.create({
  maxColumn: {
    maxWidth: 520,
    alignSelf: 'center',
    width: '100%',
  },
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
  checkCard: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: radius.md,
    padding: 14,
  },
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
});
