// StepCycleBasics — Step 4: cycle length, last period, irregular flag,
// optional HBC, optional perimenopausal status, and the "that makes sense" hero.
// Props-only — no direct store access.

import { useMemo, useEffect, useState, useRef, useCallback } from 'react';
import type { ReactElement } from 'react';
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
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
import { SelectPicker } from './SelectPicker';

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
// Stepper
// Supports tap (±1) and long-press (±5) for fast traversal
// across the wide min=14–max=120 range.
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
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const repeatTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback((): void => {
    if (longPressTimer.current !== null) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (repeatTimer.current !== null) {
      clearInterval(repeatTimer.current);
      repeatTimer.current = null;
    }
  }, []);

  const valueRef = useRef(value);
  useEffect(() => { valueRef.current = value; }, [value]);

  const startLongPress = useCallback(
    (delta: number): void => {
      longPressTimer.current = setTimeout(() => {
        // Immediately apply a ±5 step on long-press trigger
        onChange(Math.min(max, Math.max(min, valueRef.current + delta * 5)));
        // Then keep repeating every 200ms while held
        repeatTimer.current = setInterval(() => {
          valueRef.current = Math.min(max, Math.max(min, valueRef.current + delta * 5));
          onChange(valueRef.current);
        }, 200);
      }, 400);
    },
    [min, max, onChange],
  );

  return (
    <View style={stepperStyles.row}>
      <TouchableOpacity
        onPress={() => onChange(Math.max(min, value - 1))}
        onLongPress={() => startLongPress(-1)}
        onPressOut={clearTimers}
        delayLongPress={400}
        style={stepperStyles.btn}
        accessibilityRole="button"
        accessibilityLabel={`Decrease ${unit}. Long press to decrease by 5.`}
        accessibilityHint="Single tap −1, long press −5"
        disabled={value <= min}
      >
        <Text style={stepperStyles.btnLabel}>−</Text>
      </TouchableOpacity>
      <Text style={stepperStyles.val}>
        {value} {unit}
      </Text>
      <TouchableOpacity
        onPress={() => onChange(Math.min(max, value + 1))}
        onLongPress={() => startLongPress(1)}
        onPressOut={clearTimers}
        delayLongPress={400}
        style={stepperStyles.btn}
        accessibilityRole="button"
        accessibilityLabel={`Increase ${unit}. Long press to increase by 5.`}
        accessibilityHint="Single tap +1, long press +5"
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
    borderRadius: 18,
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
// DateWheelPicker — modal picker for last-period date.
// @react-native-community/datetimepicker is not installed,
// so we use three coordinated ScrollView wheels (year/month/day).
// ─────────────────────────────────────────────

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

function daysInMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

function parseDateString(dateStr: string): { year: number; month: number; day: number } {
  const parts = dateStr.split('-');
  const year = parseInt(parts[0] ?? '1995', 10);
  const month = parseInt(parts[1] ?? '1', 10);
  const day = parseInt(parts[2] ?? '1', 10);
  return { year, month, day };
}

function formatDateString(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  return `${year}-${mm}-${dd}`;
}

interface DateWheelPickerProps {
  value: string;
  onChange: (v: string) => void;
  accessibilityLabel?: string;
}

function DateWheelPicker({ value, onChange, accessibilityLabel }: DateWheelPickerProps): ReactElement {
  const [open, setOpen] = useState(false);
  const parsed = parseDateString(value);
  const [draftYear, setDraftYear] = useState(parsed.year);
  const [draftMonth, setDraftMonth] = useState(parsed.month);
  const [draftDay, setDraftDay] = useState(parsed.day);

  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = currentYear; y >= 1940; y--) {
    years.push(y);
  }

  const maxDay = daysInMonth(draftYear, draftMonth);
  const clampedDay = Math.min(draftDay, maxDay);

  const handleOpen = (): void => {
    const p = parseDateString(value);
    setDraftYear(p.year);
    setDraftMonth(p.month);
    setDraftDay(p.day);
    setOpen(true);
  };

  const handleConfirm = (): void => {
    const safeDay = Math.min(draftDay, daysInMonth(draftYear, draftMonth));
    onChange(formatDateString(draftYear, draftMonth, safeDay));
    setOpen(false);
  };

  const displayLabel = value
    ? `${MONTHS[(parsed.month - 1)] ?? ''} ${parsed.day}, ${parsed.year}`
    : 'Select date';

  return (
    <>
      <TouchableOpacity
        onPress={handleOpen}
        activeOpacity={0.8}
        style={dateStyles.trigger}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel ?? 'Open date picker'}
        accessibilityHint="Double tap to select date"
      >
        <Text style={[dateStyles.triggerText, !value && dateStyles.triggerPlaceholder]}>
          {displayLabel}
        </Text>
        <Text style={dateStyles.triggerChevron}>▾</Text>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <View style={dateStyles.backdrop}>
          <View style={dateStyles.sheet}>
            <View style={dateStyles.sheetHandle} />
            <Text style={dateStyles.sheetTitle}>Last period start date</Text>

            <View style={dateStyles.wheelsRow}>
              {/* Month wheel */}
              <View style={dateStyles.wheelWrap}>
                <Text style={dateStyles.wheelLabel}>Month</Text>
                <ScrollView style={dateStyles.wheel} showsVerticalScrollIndicator={false}>
                  {MONTHS.map((m, i) => {
                    const mNum = i + 1;
                    const sel = draftMonth === mNum;
                    return (
                      <TouchableOpacity
                        key={m}
                        onPress={() => setDraftMonth(mNum)}
                        style={[dateStyles.wheelItem, sel && dateStyles.wheelItemSelected]}
                      >
                        <Text style={[dateStyles.wheelItemText, sel && dateStyles.wheelItemTextSelected]}>
                          {m}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Day wheel */}
              <View style={dateStyles.wheelWrap}>
                <Text style={dateStyles.wheelLabel}>Day</Text>
                <ScrollView style={dateStyles.wheel} showsVerticalScrollIndicator={false}>
                  {Array.from({ length: maxDay }, (_, i) => i + 1).map((d) => {
                    const sel = clampedDay === d;
                    return (
                      <TouchableOpacity
                        key={d}
                        onPress={() => setDraftDay(d)}
                        style={[dateStyles.wheelItem, sel && dateStyles.wheelItemSelected]}
                      >
                        <Text style={[dateStyles.wheelItemText, sel && dateStyles.wheelItemTextSelected]}>
                          {d}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Year wheel */}
              <View style={dateStyles.wheelWrap}>
                <Text style={dateStyles.wheelLabel}>Year</Text>
                <ScrollView style={dateStyles.wheel} showsVerticalScrollIndicator={false}>
                  {years.map((y) => {
                    const sel = draftYear === y;
                    return (
                      <TouchableOpacity
                        key={y}
                        onPress={() => setDraftYear(y)}
                        style={[dateStyles.wheelItem, sel && dateStyles.wheelItemSelected]}
                      >
                        <Text style={[dateStyles.wheelItemText, sel && dateStyles.wheelItemTextSelected]}>
                          {y}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>

            <View style={dateStyles.actions}>
              <TouchableOpacity
                onPress={() => setOpen(false)}
                style={dateStyles.cancelBtn}
                accessibilityRole="button"
                accessibilityLabel="Cancel"
              >
                <Text style={dateStyles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirm}
                style={dateStyles.confirmBtn}
                accessibilityRole="button"
                accessibilityLabel="Confirm date"
              >
                <Text style={dateStyles.confirmText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const dateStyles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 16,
    backgroundColor: colors.paper,
  },
  triggerText: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.ink,
  },
  triggerPlaceholder: {
    color: colors.ink3,
    fontFamily: fonts.sans,
  },
  triggerChevron: {
    fontSize: 14,
    color: colors.ink3,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(27,46,37,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.paper,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 32 : 24,
    paddingHorizontal: 16,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.inkDisabled,
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetTitle: {
    fontFamily: fonts.sansSemibold,
    fontSize: 15,
    color: colors.ink,
    textAlign: 'center',
    marginBottom: 16,
  },
  wheelsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  wheelWrap: {
    flex: 1,
  },
  wheelLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 1,
    color: colors.ink3,
    textAlign: 'center',
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  wheel: {
    maxHeight: 220,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.cream,
  },
  wheelItem: {
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  wheelItemSelected: {
    backgroundColor: colors.mintPale,
  },
  wheelItemText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink2,
  },
  wheelItemTextSelected: {
    fontFamily: fonts.sansMedium,
    color: colors.eucalyptusDeep,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    height: 44,
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.ink2,
  },
  confirmBtn: {
    flex: 1,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.eucalyptus,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmText: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.paper,
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
    fontSize: 11,
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
      <Text style={[typography.display, { marginBottom: 24 }]}>
        Cycle basics
      </Text>

      {/* Last period date input */}
      <Text style={[typography.eyebrow, { marginBottom: 8 }]}>
        When did your last period start?
      </Text>
      <DateWheelPicker
        value={lastPeriod}
        onChange={onLastPeriodChange}
        accessibilityLabel="Last period start date"
      />

      {/* Cycle length stepper */}
      <Text style={[typography.eyebrow, { marginTop: 24, marginBottom: 12 }]}>
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
      <View style={[s.checkCard, { marginTop: 24 }]}>
        <CheckboxRow
          checked={irregular}
          onToggle={onIrregularToggle}
          label="My cycles are irregular"
          accessibilityLabel="My cycles are irregular"
        />
      </View>

      {/* HBC flag */}
      {showHbc && (
        <View style={[s.checkCard, { marginTop: 16 }]}>
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
        <View style={[s.checkCard, { marginTop: 16 }]}>
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
        <Text style={[typography.bodyL, { marginBottom: 16, textAlign: 'center' }]}>
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
            <Text style={[typography.caption, { marginTop: 16, fontSize: 13, textAlign: 'center' }]}>
              It takes two full cycles to establish your pattern. This
              is not a limitation of the app — it is a clinical
              requirement.
            </Text>
          </>
        )}
      </View>

      <TouchableOpacity
        style={[buttons.primary, { marginTop: 24 }]}
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
  checkCard: {
    backgroundColor: 'rgba(255,255,255,0.6)',
    borderRadius: radius.md,
    padding: 16,
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
    marginTop: 24,
  },
});
