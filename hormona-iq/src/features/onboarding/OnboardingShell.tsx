// OnboardingShell — step orchestrator for the onboarding flow.
// Owns all state, store interaction, and step navigation.
// Delegates rendering to individual step components.

import { useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useReducedMotion } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { buttons, cards, typography } from '../../constants/styles';
import { colors, fonts, radius, shadows, spacing } from '../../constants/tokens';
import { useAppStore } from '../../stores';

import { StepYob } from './StepYob';
import { StepConditions } from './StepConditions';
import { StepCycleBasics } from './StepCycleBasics';
import { StepNotifications } from './StepNotifications';
import type {
  ConditionName,
  EdAnswer,
  HbcType,
  NotifChoice,
  PerimenopausalStatus,
  StepKey,
  TrackingHistory,
} from './types';

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function defaultLastPeriod(): string {
  const d = new Date();
  d.setDate(d.getDate() - 19);
  return d.toISOString().slice(0, 10);
}

function toggleItem<T>(arr: readonly T[], value: T): readonly T[] {
  return arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
}

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
// Switch toggle
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
// Visible step index helper
// ─────────────────────────────────────────────

function visibleStepIndex(step: StepKey): number {
  if (step === 1 || step === 'block' || step === 'guardian') return 1;
  if (step === 2) return 2;
  if (step === 3 || step === '3.5' || step === '3.7' || step === '3.8') return 3;
  if (step === 4) return 4;
  if (step === 5) return 5;
  return 1;
}

// ─────────────────────────────────────────────
// OnboardingShell
// ─────────────────────────────────────────────

export default function OnboardingShell(): ReactElement {
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

  const visibleIndex = visibleStepIndex(step);
  const isHero = step === 1 || step === 4;

  const showHbc =
    conditions.includes('Perimenopause') ||
    conditions.includes('ADHD overlap') ||
    age >= 35;

  const showPeri = conditions.includes('Perimenopause') || age >= 40;

  // ── Year of birth options ─────────────────────────────────────────────────

  const yobOptions = useMemo(() => {
    const opts: { value: string; label: string }[] = [];
    for (let y = currentYear; y >= 1940; y -= 1) {
      opts.push({ value: String(y), label: String(y) });
    }
    return opts;
  }, [currentYear]);

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

        <ProgressDots total={5} current={visibleIndex} />

        <View style={s.headerSpacer} />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ─── STEP 1: Year of birth / age gate ────────────────────────── */}
        {(step === 1 || step === 'block' || step === 'guardian') && (
          <StepYob
            subStep={step as 1 | 'block' | 'guardian'}
            yob={yob}
            yobOptions={yobOptions}
            guardianEmail={guardianEmail}
            onYobChange={setYob}
            onGuardianEmailChange={setGuardianEmail}
            onSubmitDob={submitDob}
            onGuardianContinue={() => next(2)}
            onGoHome={() => router.push('/(app)/home')}
          />
        )}

        {/* ─── STEP 2: Ora introduction ─────────────────────────────────── */}
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

        {/* ─── STEP 3: Conditions + sub-steps 3.5 / 3.7 / 3.8 ─────────── */}
        {(step === 3 || step === '3.5' || step === '3.7' || step === '3.8') && (
          <StepConditions
            subStep={step as 3 | '3.5' | '3.7' | '3.8'}
            conditions={conditions}
            primaryCondition={primaryCondition}
            edAnswer={edAnswer}
            trackingHistory={trackingHistory}
            onConditionsChange={setConditions}
            onPrimaryConditionChange={setPrimaryCondition}
            onEdAnswerChange={setEdAnswer}
            onTrackingHistoryChange={setTrackingHistory}
            onContinue={next}
          />
        )}

        {/* ─── STEP 4: Cycle basics ─────────────────────────────────────── */}
        {step === 4 && (
          <StepCycleBasics
            lastPeriod={lastPeriod}
            cycleLen={cycleLen}
            irregular={irregular}
            hbcActive={hbcActive}
            hbcType={hbcType}
            perimenopausalStatus={perimenopausalStatus}
            trackingHistory={trackingHistory}
            showHbc={showHbc}
            showPeri={showPeri}
            reduceMotion={reduceMotion ?? false}
            onLastPeriodChange={setLastPeriod}
            onCycleLenChange={setCycleLen}
            onIrregularToggle={() => setIrregular((v) => !v)}
            onHbcActiveToggle={() => setHbcActive((v) => !v)}
            onHbcTypeChange={setHbcType}
            onPerimenopausalStatusChange={setPerimenopausalStatus}
            onContinue={() => next(5)}
          />
        )}

        {/* ─── STEP 5: Notifications ────────────────────────────────────── */}
        {step === 5 && (
          <StepNotifications
            notifChoice={notifChoice}
            onNotifChoiceChange={setNotifChoice}
            onFinish={finish}
          />
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
  maxColumn: {
    maxWidth: 520,
    alignSelf: 'center',
    width: '100%',
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
});
