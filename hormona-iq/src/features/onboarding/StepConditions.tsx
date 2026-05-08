// StepConditions — Step 3 (and sub-steps 3.5, 3.7, 3.8): condition selection,
// multi-condition primary pick, ED opt-out, and tracking history.
// Props-only — no direct store access.

import type { ReactElement } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { buttons, cards, typography } from '../../constants/styles';
import { colors, fonts, radius } from '../../constants/tokens';
import { FloatingOrbsSvg } from '../../components/illustrations/BotanicalEmpty';
import type {
  ConditionName,
  EdAnswer,
  StepKey,
  TrackingHistory,
  Condition,
} from './types';

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

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function toggleItem<T>(arr: readonly T[], value: T): readonly T[] {
  return arr.includes(value) ? arr.filter((x) => x !== value) : [...arr, value];
}

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

export interface StepConditionsProps {
  /** Current sub-step within the conditions flow */
  subStep: 3 | '3.5' | '3.7' | '3.8';
  conditions: readonly ConditionName[];
  primaryCondition: ConditionName | null;
  edAnswer: EdAnswer | null;
  trackingHistory: TrackingHistory | null;
  onConditionsChange: (conditions: readonly ConditionName[]) => void;
  onPrimaryConditionChange: (condition: ConditionName) => void;
  onEdAnswerChange: (answer: EdAnswer) => void;
  onTrackingHistoryChange: (history: TrackingHistory) => void;
  /** Shell handles which sub-step to navigate to next */
  onContinue: (nextStep: StepKey) => void;
}

// ─────────────────────────────────────────────
// Sub-screens
// ─────────────────────────────────────────────

function ConditionPicker({
  conditions,
  onConditionsChange,
  onContinue,
}: Pick<StepConditionsProps, 'conditions' | 'onConditionsChange' | 'onContinue'>): ReactElement {
  const handleContinue = (): void => {
    onContinue(conditions.length >= 2 ? '3.5' : '3.7');
  };

  return (
    <View>
      <View style={{ marginBottom: 16 }}>
        <FloatingOrbsSvg size={72} />
      </View>
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
              onPress={() => onConditionsChange(toggleItem(conditions, c.name))}
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
        onPress={handleContinue}
        disabled={!conditions.length}
        accessibilityRole="button"
        accessibilityLabel="Continue"
        activeOpacity={0.85}
      >
        <Text style={buttons.primaryLabel}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

function PrimaryConditionPicker({
  conditions,
  primaryCondition,
  onPrimaryConditionChange,
  onContinue,
}: Pick<StepConditionsProps, 'conditions' | 'primaryCondition' | 'onPrimaryConditionChange' | 'onContinue'>): ReactElement {
  return (
    <View style={s.maxColumn}>
      <Text style={[typography.eyebrow, { marginBottom: 8 }]}>
        WE'LL TAKE THESE ONE AT A TIME
      </Text>
      <Text style={[typography.display, { marginBottom: 12 }]}>
        We'll set one up first. The rest can wait.
      </Text>
      <Text style={[typography.body, { color: colors.ink2, marginBottom: 24 }]}>
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
              onPress={() => onPrimaryConditionChange(c)}
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
        onPress={() => onContinue('3.7')}
        disabled={!primaryCondition}
        accessibilityRole="button"
        accessibilityLabel="Continue"
        activeOpacity={0.85}
      >
        <Text style={buttons.primaryLabel}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

function EdScreen({
  edAnswer,
  onEdAnswerChange,
  onContinue,
}: Pick<StepConditionsProps, 'edAnswer' | 'onEdAnswerChange' | 'onContinue'>): ReactElement {
  return (
    <View style={s.maxColumn}>
      <Text style={[typography.eyebrow, { marginBottom: 8 }]}>
        A QUICK ASK BEFORE WE GO FURTHER
      </Text>
      <Text style={[typography.display, { marginBottom: 16 }]}>
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
              onPress={() => onEdAnswerChange(o.v)}
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
          { marginTop: 24 },
          !edAnswer && buttons.primaryDisabled,
        ]}
        onPress={() => onContinue('3.8')}
        disabled={!edAnswer}
        accessibilityRole="button"
        accessibilityLabel="Continue"
        activeOpacity={0.85}
      >
        <Text style={buttons.primaryLabel}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

function TrackingHistoryScreen({
  trackingHistory,
  onTrackingHistoryChange,
  onContinue,
}: Pick<StepConditionsProps, 'trackingHistory' | 'onTrackingHistoryChange' | 'onContinue'>): ReactElement {
  return (
    <View style={s.maxColumn}>
      <Text style={[typography.eyebrow, { marginBottom: 8 }]}>
        ONE MORE
      </Text>
      <Text style={[typography.display, { marginBottom: 16 }]}>
        How long have you been tracking?
      </Text>

      <View style={{ gap: 10 }}>
        {TRACKING_OPTIONS.map((o) => {
          const on = trackingHistory === o.v;
          return (
            <TouchableOpacity
              key={o.v}
              onPress={() => onTrackingHistoryChange(o.v)}
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
          { marginTop: 24 },
          !trackingHistory && buttons.primaryDisabled,
        ]}
        onPress={() => onContinue(4)}
        disabled={!trackingHistory}
        accessibilityRole="button"
        accessibilityLabel="Continue"
        activeOpacity={0.85}
      >
        <Text style={buttons.primaryLabel}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────────────────────────────
// StepConditions — exported component
// ─────────────────────────────────────────────

export function StepConditions({
  subStep,
  conditions,
  primaryCondition,
  edAnswer,
  trackingHistory,
  onConditionsChange,
  onPrimaryConditionChange,
  onEdAnswerChange,
  onTrackingHistoryChange,
  onContinue,
}: StepConditionsProps): ReactElement {
  if (subStep === '3.5') {
    return (
      <PrimaryConditionPicker
        conditions={conditions}
        primaryCondition={primaryCondition}
        onPrimaryConditionChange={onPrimaryConditionChange}
        onContinue={onContinue}
      />
    );
  }

  if (subStep === '3.7') {
    return (
      <EdScreen
        edAnswer={edAnswer}
        onEdAnswerChange={onEdAnswerChange}
        onContinue={onContinue}
      />
    );
  }

  if (subStep === '3.8') {
    return (
      <TrackingHistoryScreen
        trackingHistory={trackingHistory}
        onTrackingHistoryChange={onTrackingHistoryChange}
        onContinue={onContinue}
      />
    );
  }

  // subStep === 3
  return (
    <ConditionPicker
      conditions={conditions}
      onConditionsChange={onConditionsChange}
      onContinue={onContinue}
    />
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
  },
  conditionCardActive: {
    borderColor: colors.eucalyptus,
    backgroundColor: colors.mintPale,
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
});
