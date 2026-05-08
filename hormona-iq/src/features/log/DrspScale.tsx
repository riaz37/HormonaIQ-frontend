// DrspScale — DRSP symptom rating scale section (0–6 per symptom).
// Renders the anchor legend, symptom scale rows, SI item, and functional impairment.
// Receives all state and callbacks via props; no direct store access.

import { useMemo, useState } from 'react';
import type { ReactElement } from 'react';
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useReducedMotion } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import {
  typography,
} from '../../constants/styles';
import { colors, fonts, radius, spacing } from '../../constants/tokens';
import { SectionCard } from '../../components/ui/SectionCard';

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────

export interface DrspItem {
  key: string;
  label: string;
}

export const DRSP_ITEMS: DrspItem[] = [
  { key: 'depressed', label: 'Felt depressed, sad, "down," or "blue"' },
  { key: 'hopeless', label: 'Felt hopeless' },
  { key: 'worthless_guilty', label: 'Felt worthless or guilty' },
  { key: 'anxiety', label: 'Felt anxious, tense, "keyed up," or "on edge"' },
  { key: 'mood_swings', label: 'Had mood swings (suddenly tearful, sensitive)' },
  { key: 'rejection_sensitive', label: 'Felt rejected easily, more sensitive to rejection' },
  { key: 'irritability', label: 'Felt angry, irritable' },
  { key: 'conflicts', label: 'Had conflicts or problems with people' },
  { key: 'decreased_interest', label: 'Less interest in usual activities (work, school, friends, hobbies)' },
  { key: 'concentration', label: 'Difficulty concentrating' },
  { key: 'fatigue', label: 'Felt lethargic, tired, fatigued, or low energy' },
  { key: 'appetite', label: 'Increased appetite or had food cravings' },
  { key: 'hypersomnia', label: 'Slept more, took naps, or had hard time getting up' },
  { key: 'insomnia', label: 'Had trouble falling or staying asleep' },
  { key: 'overwhelmed', label: 'Felt overwhelmed or unable to cope' },
  { key: 'out_of_control', label: 'Felt out of control' },
  { key: 'breast_tenderness', label: 'Breast tenderness' },
  { key: 'breast_swelling_bloating', label: 'Breast swelling, bloated feeling, or weight gain' },
  { key: 'headache', label: 'Headache' },
  { key: 'joint_muscle_pain', label: 'Joint or muscle pain' },
];

export const DRSP_SI: DrspItem = {
  key: 'suicidal_ideation',
  label: "Thoughts that life isn't worth living",
};

export const FUNCTIONAL_ITEMS: DrspItem[] = [
  { key: 'fn_work', label: 'Interfered with work or school' },
  { key: 'fn_social', label: 'Interfered with social activities' },
  { key: 'fn_relationships', label: 'Interfered with relationships' },
];

export const FAST_LOG_KEYS = ['irritability', 'concentration', 'overwhelmed'];

// Section groupings for the full DRSP scale (not used in fast log mode)
interface DrspSection {
  title: string;
  keys: string[];
}

export const DRSP_SECTIONS: DrspSection[] = [
  {
    title: 'Mood & Emotions',
    keys: [
      'depressed',
      'hopeless',
      'worthless_guilty',
      'anxiety',
      'mood_swings',
      'rejection_sensitive',
      'irritability',
      'conflicts',
      'decreased_interest',
      'suicidal_ideation',
    ],
  },
  {
    title: 'Mental',
    keys: ['concentration', 'fatigue', 'overwhelmed', 'out_of_control'],
  },
  {
    title: 'Physical',
    keys: [
      'breast_tenderness',
      'breast_swelling_bloating',
      'headache',
      'joint_muscle_pain',
      'appetite',
      'hypersomnia',
      'insomnia',
    ],
  },
];

const ANCHORS: Record<number, string> = {
  1: 'Not at all',
  2: 'Minimal',
  3: 'Mild',
  4: 'Moderate',
  5: 'Severe',
  6: 'Extreme',
};

// Short display labels that fit inside narrow buttons
const ANCHOR_SHORT: Record<number, string> = {
  1: 'None',
  2: 'Min',
  3: 'Mild',
  4: 'Mod',
  5: 'Severe',
  6: 'Extreme',
};

// Graduated color palette: cool mint → warm coral along the severity scale
const BTN_ACTIVE_BG: Record<number, string> = {
  1: colors.mintPale,
  2: colors.mintMist,
  3: colors.sageLight,
  4: colors.butter,
  5: colors.coralSoft,
  6: colors.coral,
};

// Text color: dark for light backgrounds, paper for heavy coral
const BTN_ACTIVE_TEXT: Record<number, string> = {
  1: colors.ink,
  2: colors.ink,
  3: colors.ink,
  4: colors.ink,
  5: colors.ink,
  6: colors.paper,
};

// Subtle inactive tints — communicates the spectrum before selection
const BTN_INACTIVE_TINT: Record<number, string> = {
  1: 'rgba(107, 185, 148, 0.10)',
  2: 'rgba(107, 185, 148, 0.16)',
  3: 'rgba(180, 210, 160, 0.16)',
  4: 'rgba(245, 228, 184, 0.40)',
  5: 'rgba(245, 200, 181, 0.40)',
  6: 'rgba(232, 159, 134, 0.30)',
};

// SI uses a calm neutral ramp — never alarm/coral
const SI_ACTIVE_BG: Record<number, string> = {
  1: '#F0F0F0',
  2: '#E0E0E0',
  3: '#CACACA',
  4: '#ABABAB',
  5: '#8A8A8A',
  6: '#555555',
};

const SI_ACTIVE_TEXT: Record<number, string> = {
  1: '#555',
  2: '#444',
  3: '#333',
  4: '#222',
  5: '#FFF',
  6: '#FFF',
};

const SI_INACTIVE_TINT: Record<number, string> = {
  1: 'rgba(200,200,200,0.12)',
  2: 'rgba(200,200,200,0.18)',
  3: 'rgba(180,180,180,0.18)',
  4: 'rgba(160,160,160,0.20)',
  5: 'rgba(130,130,130,0.20)',
  6: 'rgba(80,80,80,0.15)',
};

// ─────────────────────────────────────────────
// ScaleRow
// ─────────────────────────────────────────────

interface ScaleRowProps {
  label: string;
  value: number | null | undefined;
  onSet: (n: number) => void;
  max?: number;
  yesterdayValue?: number;
  isSI?: boolean; // SI item never auto-collapses
}

export function ScaleRow({
  label,
  value,
  onSet,
  max = 6,
  yesterdayValue,
  isSI = false,
}: ScaleRowProps): ReactElement {
  const [collapsed, setCollapsed] = useState(false);
  const reduceMotion = useReducedMotion();

  const activeBgMap = isSI ? SI_ACTIVE_BG : BTN_ACTIVE_BG;
  const activeTextMap = isSI ? SI_ACTIVE_TEXT : BTN_ACTIVE_TEXT;

  const handlePress = (n: number): void => {
    onSet(n);
    if (!reduceMotion) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    if (!isSI) {
      // Short delay so the user sees their selection before collapsing
      const delay = reduceMotion ? 0 : 280;
      setTimeout(() => setCollapsed(true), delay);
    }
  };

  // Collapsed summary row — tap to re-expand
  if (collapsed && value != null) {
    return (
      <Pressable
        style={s.collapsedRow}
        onPress={() => setCollapsed(false)}
        accessibilityRole="button"
        accessibilityLabel={`${label} — rated ${value}, ${ANCHORS[value]}. Tap to change.`}
      >
        <Text style={s.collapsedLabel} numberOfLines={1}>{label}</Text>
        <View style={[s.collapsedBadge, { backgroundColor: activeBgMap[value] }]}>
          <Text style={[s.collapsedBadgeNum, { color: activeTextMap[value] }]}>{value}</Text>
          <Text style={[s.collapsedBadgeAnchor, { color: activeTextMap[value] }]}>
            {ANCHORS[value]}
          </Text>
        </View>
      </Pressable>
    );
  }

  const inactiveTintMap = isSI ? SI_INACTIVE_TINT : BTN_INACTIVE_TINT;

  return (
    <View style={s.scaleCard}>
      <Text style={s.scaleCardLabel}>{label}</Text>

      {yesterdayValue != null && (
        <Text style={s.yesterdayHint}>Yesterday: {ANCHORS[yesterdayValue]} ({yesterdayValue})</Text>
      )}

      <View style={s.scaleRow}>
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => {
          const isActive = value === n;
          return (
            <TouchableOpacity
              key={n}
              activeOpacity={0.72}
              style={[
                s.scaleBtn,
                s.scaleBtnFlex,
                isActive
                  ? { backgroundColor: activeBgMap[n], borderColor: 'transparent' }
                  : [s.scaleBtnInactive, { backgroundColor: inactiveTintMap[n] }],
              ]}
              onPress={() => handlePress(n)}
              accessibilityLabel={`${label} — ${ANCHORS[n] ?? String(n)}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <Text
                style={[
                  s.scaleBtnNum,
                  isActive
                    ? { color: activeTextMap[n], fontFamily: fonts.sansBold }
                    : s.scaleBtnNumInactive,
                ]}
              >
                {n}
              </Text>
              <Text
                style={[
                  s.scaleBtnAnchor,
                  isActive ? { color: activeTextMap[n], fontFamily: fonts.sansMedium } : s.scaleBtnAnchorInactive,
                ]}
                numberOfLines={1}
              >
                {ANCHOR_SHORT[n]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {isSI && value != null && value >= 5 && (
        <View style={s.siInlinePrompt}>
          <Text style={s.siInlinePromptText}>
            If you're struggling right now, support is one tap away.
          </Text>
          <Pressable
            onPress={() => {
              void Linking.openURL('tel:988');
            }}
            accessibilityRole="button"
            accessibilityLabel="Open support — call or text 988"
            style={s.siInlinePromptBtn}
          >
            <Text style={s.siInlinePromptBtnLabel}>Open support →</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

export interface DrspScaleProps {
  drsp: Record<string, number>;
  si: number | null;
  fnImpair: number | null;
  fastLog: boolean;
  adhdEF: Record<string, number>;
  adhdRating: number | null;
  isAdhdUser: boolean;
  showAdhdSection: boolean;
  yesterdayDrsp?: Record<string, number>;
  onCarryForward?: () => void;
  onSetDrsp: (key: string, value: number) => void;
  onSetSi: (value: number) => void;
  onSetFnImpair: (value: number) => void;
  onSetAdhdEF: (key: string, value: number) => void;
  onSetAdhdRating: (value: number) => void;
  onToggleAdhdSection: () => void;
}

// ─────────────────────────────────────────────
// ADHD EF dimensions
// ─────────────────────────────────────────────

interface AdhdefItem {
  key: string;
  label: string;
}

export const ADHD_EF: AdhdefItem[] = [
  { key: 'focus', label: 'Focus' },
  { key: 'workingMemory', label: 'Working memory' },
  { key: 'taskInitiation', label: 'Task initiation' },
  { key: 'emotionalRegulation', label: 'Emotional regulation' },
  { key: 'timePerception', label: 'Time perception' },
];

// ─────────────────────────────────────────────
// Wizard step types and builder
// ─────────────────────────────────────────────

type WizardStep =
  | { kind: 'drsp'; key: string; label: string; section: string; isSI?: false }
  | { kind: 'si'; label: string; section: string; isSI: true }
  | { kind: 'fn_impair'; label: string; section: string; isSI?: false }
  | { kind: 'fn_drsp'; key: string; label: string; section: string; isSI?: false };

function buildWizardSteps(fastLog: boolean): WizardStep[] {
  if (fastLog) {
    return [
      ...DRSP_ITEMS
        .filter((it) => FAST_LOG_KEYS.includes(it.key))
        .map((it): WizardStep => ({ kind: 'drsp', key: it.key, label: it.label, section: 'Top symptoms' })),
      { kind: 'si', label: DRSP_SI.label, section: 'Wellbeing check', isSI: true },
      { kind: 'fn_impair', label: 'Did symptoms get in the way today?', section: 'Impact' },
    ];
  }

  const steps: WizardStep[] = [];
  for (const section of DRSP_SECTIONS) {
    for (const it of DRSP_ITEMS.filter((i) => section.keys.includes(i.key))) {
      steps.push({ kind: 'drsp', key: it.key, label: it.label, section: section.title });
    }
    if (section.keys.includes('suicidal_ideation')) {
      steps.push({ kind: 'si', label: DRSP_SI.label, section: section.title, isSI: true });
    }
  }
  for (const fn of FUNCTIONAL_ITEMS) {
    steps.push({ kind: 'fn_drsp', key: fn.key, label: fn.label, section: 'Did symptoms interfere?' });
  }
  return steps;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function DrspScale({
  drsp,
  si,
  fnImpair,
  fastLog,
  adhdEF,
  adhdRating,
  isAdhdUser,
  showAdhdSection,
  yesterdayDrsp,
  onCarryForward,
  onSetDrsp,
  onSetSi,
  onSetFnImpair,
  onSetAdhdEF,
  onSetAdhdRating,
  onToggleAdhdSection,
}: DrspScaleProps): ReactElement {
  const steps = useMemo(() => buildWizardSteps(fastLog), [fastLog]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [drspDone, setDrspDone] = useState(false);
  const reduceMotion = false; // useReducedMotion not needed at DrspScale level

  const hasYesterday = yesterdayDrsp != null && Object.keys(yesterdayDrsp).length > 0;

  const getStepValue = (step: WizardStep): number | null | undefined => {
    if (step.kind === 'si') return si;
    if (step.kind === 'fn_impair') return fnImpair;
    return drsp[step.key];
  };

  const handleRate = (step: WizardStep, n: number): void => {
    if (step.kind === 'drsp' || step.kind === 'fn_drsp') onSetDrsp(step.key, n);
    else if (step.kind === 'si') onSetSi(n);
    else if (step.kind === 'fn_impair') onSetFnImpair(n);

    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    setTimeout(() => {
      if (currentIdx < steps.length - 1) {
        setCurrentIdx((i) => i + 1);
      } else {
        setDrspDone(true);
      }
    }, 240);
  };

  // ── After all DRSP steps done — ADHD section (optional) ───────────────
  if (drspDone) {
    return (
      <>
        {isAdhdUser && !fastLog && (
          <View style={s.adhdSection}>
            <View style={s.adhdHeader}>
              <Text style={typography.h2}>ADHD check-in (optional)</Text>
              <TouchableOpacity
                style={s.ghostBtn}
                onPress={onToggleAdhdSection}
                accessibilityLabel={showAdhdSection ? 'Skip ADHD section' : 'Show ADHD section'}
                accessibilityRole="button"
              >
                <Text style={[s.ghostBtnLabel, s.adhdNote]}>
                  {showAdhdSection ? 'Skip' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={[typography.caption, s.adhdNote, { marginBottom: 12 }]}>
              5 EF dimensions · 1–5
            </Text>
            {showAdhdSection &&
              ADHD_EF.map((d) => (
                <ScaleRow
                  key={d.key}
                  label={d.label}
                  value={adhdEF[d.key]}
                  onSet={(n) => onSetAdhdEF(d.key, n)}
                  max={5}
                />
              ))}
          </View>
        )}
        {isAdhdUser && !fastLog && (
          <View style={{ marginBottom: 32 }}>
            <Text style={[typography.h2, { marginBottom: 8 }]}>
              How well did your ADHD meds work today?
            </Text>
            <Text style={[typography.caption, { marginBottom: 12 }]}>
              Estrogen affects dopamine — your meds may feel weaker before your period.
            </Text>
            <View style={s.scaleRow}>
              {[1, 2, 3, 4, 5].map((n) => {
                const isActive = adhdRating === n;
                return (
                  <TouchableOpacity
                    key={n}
                    activeOpacity={0.72}
                    style={[
                      s.scaleBtn,
                      s.scaleBtnFlex,
                      isActive
                        ? { backgroundColor: BTN_ACTIVE_BG[n] ?? colors.sageLight, borderColor: 'transparent' }
                        : s.scaleBtnInactive,
                    ]}
                    onPress={() => onSetAdhdRating(n)}
                    accessibilityLabel={`ADHD meds effectiveness: ${n} of 5`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                  >
                    <Text
                      style={[
                        s.scaleBtnNum,
                        isActive
                          ? { color: BTN_ACTIVE_TEXT[n] ?? colors.ink, fontFamily: fonts.sansBold }
                          : s.scaleBtnNumInactive,
                      ]}
                    >
                      {n}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}
      </>
    );
  }

  // ── Wizard render — one question at a time ─────────────────────────────
  const step = steps[currentIdx];
  const value = getStepValue(step);
  const isSIStep = step.kind === 'si';
  const activeBgMap = isSIStep ? SI_ACTIVE_BG : BTN_ACTIVE_BG;
  const activeTextMap = isSIStep ? SI_ACTIVE_TEXT : BTN_ACTIVE_TEXT;
  const inactiveTintMap = isSIStep ? SI_INACTIVE_TINT : BTN_INACTIVE_TINT;
  const progress = (currentIdx + 1) / steps.length;
  const yesterdayValue = step.kind !== 'si' && step.kind !== 'fn_impair'
    ? yesterdayDrsp?.[step.key]
    : yesterdayDrsp?.['suicidal_ideation'];

  // Section changed — compute label
  const prevSection = currentIdx > 0 ? steps[currentIdx - 1].section : null;
  const sectionChanged = step.section !== prevSection;

  return (
    <View style={s.wizard}>
      {/* Progress */}
      <View style={s.wizardProgressRow}>
        <View style={s.wizardTrack}>
          <View style={[s.wizardFill, { width: `${progress * 100}%` as any }]} />
        </View>
        <Text style={s.wizardCounter}>{currentIdx + 1} / {steps.length}</Text>
      </View>

      {/* Section label */}
      {sectionChanged && (
        <Text style={s.wizardSection}>{step.section.toUpperCase()}</Text>
      )}

      {/* Question */}
      <Text style={s.wizardQuestion}>{step.label}</Text>

      {/* SI safety note */}
      {isSIStep && (
        <Text style={s.wizardSINote}>
          Important to track. There's no judgement here.
        </Text>
      )}

      {/* Yesterday reference */}
      {yesterdayValue != null && (
        <Text style={s.wizardYesterday}>
          Yesterday: {ANCHORS[yesterdayValue]} ({yesterdayValue})
        </Text>
      )}

      {/* Same-as-yesterday shortcut — shown only on step 0 */}
      {currentIdx === 0 && hasYesterday && onCarryForward != null && (
        <TouchableOpacity
          style={s.carryForwardBtn}
          onPress={onCarryForward}
          accessibilityRole="button"
          accessibilityLabel="Copy yesterday's ratings as a starting point"
        >
          <Text style={s.carryForwardLabel}>Same as yesterday</Text>
          <Text style={s.carryForwardSub}>Adjust anything that changed →</Text>
        </TouchableOpacity>
      )}

      {/* Option list */}
      <View style={s.optionList}>
        {[1, 2, 3, 4, 5, 6].map((n) => {
          const isActive = value === n;
          return (
            <TouchableOpacity
              key={n}
              activeOpacity={0.75}
              style={[
                s.optionRow,
                { backgroundColor: isActive ? activeBgMap[n] : inactiveTintMap[n] },
                isActive && s.optionRowActive,
              ]}
              onPress={() => handleRate(step, n)}
              accessibilityLabel={`${ANCHORS[n]}`}
              accessibilityRole="radio"
              accessibilityState={{ selected: isActive }}
            >
              <View style={[s.optionRadio, isActive && { backgroundColor: activeTextMap[n] }]}>
                {isActive && <View style={s.optionRadioDot} />}
              </View>
              <Text
                style={[
                  s.optionLabel,
                  isActive
                    ? { color: activeTextMap[n], fontFamily: fonts.sansSemibold }
                    : s.optionLabelInactive,
                ]}
              >
                {ANCHORS[n]}
              </Text>
              <Text style={[s.optionNum, isActive && { color: activeTextMap[n] }]}>
                {n}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Back button */}
      {currentIdx > 0 && (
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => setCurrentIdx((i) => i - 1)}
          accessibilityRole="button"
          accessibilityLabel="Go back to previous question"
        >
          <Text style={s.backBtnLabel}>← Back</Text>
        </TouchableOpacity>
      )}

      {/* SI crisis prompt */}
      {isSIStep && value != null && value >= 5 && (
        <View style={s.siInlinePrompt}>
          <Text style={s.siInlinePromptText}>
            If you're struggling right now, support is one tap away.
          </Text>
          <Pressable
            onPress={() => { void Linking.openURL('tel:988'); }}
            accessibilityRole="button"
            accessibilityLabel="Open support — call or text 988"
            style={s.siInlinePromptBtn}
          >
            <Text style={s.siInlinePromptBtnLabel}>Open support →</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const s = StyleSheet.create({
  // ── Scale card (per-item wrapper) ─────────────────────────────────────
  scaleCard: {
    marginBottom: 10,
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
  },
  scaleCardLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.ink,
    lineHeight: 20,
    marginBottom: 10,
  },
  yesterdayHint: {
    fontFamily: fonts.mono,
    fontSize: 10,
    color: colors.ink3,
    marginBottom: 8,
  },

  // ── Scale row ─────────────────────────────────────────────────────────
  scaleRowWrap: {
    marginBottom: 14,
  },
  scaleRowLabel: {
    marginBottom: 4,
    fontSize: 14,
    fontFamily: fonts.sansMedium,
  },
  scaleRow: {
    flexDirection: 'row',
    gap: 4,
  },
  scaleBtnFlex: {
    flex: 1,
  },
  scaleBtn: {
    height: 58,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 3,
  },
  scaleBtnInactive: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  scaleBtnNum: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    lineHeight: 19,
  },
  scaleBtnNumInactive: {
    color: colors.ink2,
    fontFamily: fonts.sansMedium,
  },
  scaleBtnAnchor: {
    fontSize: 9,
    lineHeight: 11,
    textAlign: 'center',
  },
  scaleBtnAnchorInactive: {
    fontFamily: fonts.sans,
    color: colors.ink3,
  },

  // ── Collapsed row ─────────────────────────────────────────────────────
  collapsedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 10,
  },
  collapsedLabel: {
    flex: 1,
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.ink2,
  },
  collapsedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
  },
  collapsedBadgeNum: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
  },
  collapsedBadgeAnchor: {
    fontFamily: fonts.sans,
    fontSize: 11,
  },

  // ── Yesterday ghost (kept for any legacy references) ──────────────────
  yesterdayStrip: { flexDirection: 'row', gap: 5, marginBottom: 3 },
  yesterdayCell: { flex: 1, alignItems: 'center', minHeight: 14 },
  yesterdayDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.ink3, marginBottom: 1 },
  yesterdayText: { fontFamily: fonts.mono, fontSize: 7, color: colors.ink3 },

  // ── Carry-forward ─────────────────────────────────────────────────────
  carryForwardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 11,
    paddingHorizontal: 14,
    backgroundColor: colors.mintPale,
    borderWidth: 1,
    borderColor: colors.borderMint,
    borderRadius: radius.md,
    marginBottom: 18,
    gap: 8,
  },
  carryForwardLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.eucalyptusDeep,
  },
  carryForwardSub: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink3,
  },

  // ── Legend / headers ──────────────────────────────────────────────────
  anchorLegend: {
    padding: 10,
    marginBottom: 16,
  },
  anchorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
    marginBottom: 2,
  },
  anchorItem: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.ink2,
    flex: 1,
  },
  anchorNum: {
    fontFamily: fonts.monoMedium,
    fontWeight: '700',
  },
  sectionHeader: {
    fontSize: 11,
    fontFamily: fonts.sansMedium,
    color: colors.eucalyptus,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  anchorHint: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.ink3,
    marginTop: spacing.sm,
  },

  // ── SI box ────────────────────────────────────────────────────────────
  siBox: {
    marginTop: spacing.xs,
    padding: spacing.md,
    backgroundColor: colors.creamWarm,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  siNote: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink2,
    marginBottom: spacing.sm,
  },

  // ── SI inline crisis prompt ───────────────────────────────────────────
  siInlinePrompt: {
    marginTop: 10,
    padding: 12,
    backgroundColor: colors.paper,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  siInlinePromptText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 18,
    color: colors.ink,
  },
  siInlinePromptBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
  },
  siInlinePromptBtnLabel: {
    fontFamily: fonts.sansSemibold,
    fontSize: 13,
    color: colors.eucalyptusDeep,
    textDecorationLine: 'underline',
  },

  // ── ADHD section ──────────────────────────────────────────────────────
  adhdNote: {
    fontSize: 12,
  },
  adhdSection: {
    marginTop: 16,
    marginBottom: 24,
    padding: 16,
    backgroundColor: colors.mintPale,
    borderRadius: radius.md,
  },
  adhdHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  ghostBtn: {
    height: 44,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  ghostBtnLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.eucalyptusDeep,
  },

  // ── Wizard ────────────────────────────────────────────────────────────
  wizard: {
    paddingTop: 8,
    paddingBottom: 16,
  },
  wizardProgressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  wizardTrack: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  wizardFill: {
    height: 4,
    backgroundColor: colors.eucalyptus,
    borderRadius: 2,
  },
  wizardCounter: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.ink3,
    minWidth: 36,
    textAlign: 'right',
  },
  wizardSection: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.eucalyptus,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  wizardQuestion: {
    fontFamily: fonts.sansMedium,
    fontSize: 18,
    lineHeight: 26,
    color: colors.ink,
    marginBottom: 12,
  },
  wizardSINote: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.ink3,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  wizardYesterday: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.ink3,
    marginBottom: 12,
  },

  // ── Option list ───────────────────────────────────────────────────────
  optionList: {
    gap: 6,
    marginBottom: 20,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 52,
  },
  optionRowActive: {
    borderColor: 'transparent',
  },
  optionRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionRadioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.paper,
  },
  optionLabel: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
  },
  optionLabelInactive: {
    fontFamily: fonts.sans,
    color: colors.ink,
  },
  optionNum: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.ink3,
  },

  // ── Back button ───────────────────────────────────────────────────────
  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
    paddingHorizontal: 4,
    minHeight: 44,
    justifyContent: 'center',
  },
  backBtnLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.eucalyptusDeep,
  },
});
