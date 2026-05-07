// DrspScale — DRSP symptom rating scale section (0–6 per symptom).
// Renders the anchor legend, symptom scale rows, SI item, and functional impairment.
// Receives all state and callbacks via props; no direct store access.

import { useState } from 'react';
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

  return (
    <View style={s.scaleRowWrap}>
      <Text style={[typography.body, s.scaleRowLabel]}>{label}</Text>

      {/* Yesterday ghost indicators — sits above the button row */}
      {yesterdayValue != null && (
        <View style={s.yesterdayStrip}>
          {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
            <View key={n} style={s.yesterdayCell}>
              {yesterdayValue === n && (
                <>
                  <View style={s.yesterdayDot} />
                  <Text style={s.yesterdayText}>was {n}</Text>
                </>
              )}
            </View>
          ))}
        </View>
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
                  : s.scaleBtnInactive,
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
              {isActive && (
                <Text
                  style={[s.scaleBtnAnchor, { color: activeTextMap[n] }]}
                  numberOfLines={1}
                >
                  {ANCHORS[n]}
                </Text>
              )}
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
  const drspToRender = fastLog
    ? DRSP_ITEMS.filter((it) => FAST_LOG_KEYS.includes(it.key))
    : DRSP_ITEMS;

  const showFunctionalGrid = !fastLog;
  const showFnImpairRow = fastLog;

  const hasYesterday =
    yesterdayDrsp != null && Object.keys(yesterdayDrsp).length > 0;

  return (
    <>
      <Text style={[typography.h2, { marginBottom: 4, marginTop: 24 }]}>
        {fastLog ? 'Top symptoms' : "Today's symptoms"}
      </Text>
      <Text style={[typography.caption, { marginBottom: 12 }]}>
        Daily Record of Severity of Problems · 1 = not at all, 6 = extreme
      </Text>

      {/* Anchor legend */}
      <SectionCard style={s.anchorLegend}>
        <View style={s.anchorRow}>
          <Text style={s.anchorItem}><Text style={s.anchorNum}>1</Text> Not at all</Text>
          <Text style={s.anchorItem}><Text style={s.anchorNum}>2</Text> Minimal</Text>
          <Text style={s.anchorItem}><Text style={s.anchorNum}>3</Text> Mild</Text>
        </View>
        <View style={s.anchorRow}>
          <Text style={s.anchorItem}><Text style={s.anchorNum}>4</Text> Moderate</Text>
          <Text style={s.anchorItem}><Text style={s.anchorNum}>5</Text> Severe</Text>
          <Text style={s.anchorItem}><Text style={s.anchorNum}>6</Text> Extreme</Text>
        </View>
      </SectionCard>

      {/* Same as yesterday carry-forward */}
      {hasYesterday && onCarryForward != null && (
        <TouchableOpacity
          style={s.carryForwardBtn}
          onPress={onCarryForward}
          accessibilityRole="button"
          accessibilityLabel="Copy yesterday's ratings as a starting point"
        >
          <Text style={s.carryForwardLabel}>Same as yesterday</Text>
          <Text style={s.carryForwardSub}>Adjust anything that changed</Text>
        </TouchableOpacity>
      )}

      {fastLog ? (
        drspToRender.map((it) => (
          <ScaleRow
            key={it.key}
            label={it.label}
            value={drsp[it.key]}
            onSet={(n) => onSetDrsp(it.key, n)}
            yesterdayValue={yesterdayDrsp?.[it.key]}
          />
        ))
      ) : (
        DRSP_SECTIONS.map((section) => {
          const sectionItems = DRSP_ITEMS.filter((it) =>
            section.keys.includes(it.key),
          );
          const siInSection = section.keys.includes(DRSP_SI.key);

          return (
            <View key={section.title}>
              <Text style={s.anchorHint}>1 = Not at all  ·  6 = Extreme</Text>
              <Text style={s.sectionHeader}>{section.title}</Text>
              {sectionItems.map((it) => (
                <ScaleRow
                  key={it.key}
                  label={it.label}
                  value={drsp[it.key]}
                  onSet={(n) => onSetDrsp(it.key, n)}
                  yesterdayValue={yesterdayDrsp?.[it.key]}
                />
              ))}
              {siInSection && (
                <View style={s.siBox}>
                  <Text style={s.siNote}>
                    Item 12 — important to track. There's no judgement here.
                  </Text>
                  <ScaleRow
                    label={DRSP_SI.label}
                    value={si}
                    onSet={onSetSi}
                    yesterdayValue={yesterdayDrsp?.[DRSP_SI.key]}
                    isSI
                  />
                </View>
              )}
            </View>
          );
        })
      )}

      {/* SI box for fast log — always visible for safety */}
      {fastLog && (
        <View style={s.siBox}>
          <Text style={s.siNote}>
            Item 12 — important to track. There's no judgement here.
          </Text>
          <ScaleRow
            label={DRSP_SI.label}
            value={si}
            onSet={onSetSi}
            yesterdayValue={yesterdayDrsp?.[DRSP_SI.key]}
            isSI
          />
        </View>
      )}

      {/* Functional impairment — full grid (non-fast log) */}
      {showFunctionalGrid && (
        <>
          <Text style={[typography.h2, { marginTop: 8, marginBottom: 6 }]}>
            Did symptoms interfere?
          </Text>
          <Text style={[typography.caption, { marginBottom: 12 }]}>
            The DRSP needs this for diagnosis.
          </Text>
          {FUNCTIONAL_ITEMS.map((it) => (
            <ScaleRow
              key={it.key}
              label={it.label}
              value={drsp[it.key]}
              onSet={(n) => onSetDrsp(it.key, n)}
              yesterdayValue={yesterdayDrsp?.[it.key]}
            />
          ))}
        </>
      )}

      {/* Functional impairment — single row (fast log) */}
      {showFnImpairRow && (
        <>
          <Text style={[typography.h2, { marginTop: 8, marginBottom: 6 }]}>
            Did symptoms interfere today?
          </Text>
          <ScaleRow
            label="Overall functional impairment"
            value={fnImpair}
            onSet={onSetFnImpair}
            max={6}
          />
        </>
      )}

      {/* T-22 — ADHD check-in 4th step (BEFORE save) */}
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
                {showAdhdSection ? 'Skip this section' : 'Show'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text style={[typography.caption, s.adhdNote, { marginBottom: 12 }]}>
            5 EF dimensions · 1–5 · skip without warning
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

      {/* ADHD med rating */}
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

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const s = StyleSheet.create({
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
    gap: 5,
  },
  scaleBtnFlex: {
    flex: 1,
  },
  scaleBtn: {
    height: 52,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 1,
  },
  scaleBtnInactive: {
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.border,
  },
  scaleBtnNum: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    lineHeight: 18,
  },
  scaleBtnNumInactive: {
    color: colors.ink2,
    fontFamily: fonts.sansMedium,
  },
  scaleBtnAnchor: {
    fontFamily: fonts.sans,
    fontSize: 7,
    lineHeight: 9,
    textAlign: 'center',
  },

  // ── Collapsed row ─────────────────────────────────────────────────────
  collapsedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.paper,
    borderRadius: radius.sm,
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

  // ── Yesterday ghost ───────────────────────────────────────────────────
  yesterdayStrip: {
    flexDirection: 'row',
    gap: 5,
    marginBottom: 3,
  },
  yesterdayCell: {
    flex: 1,
    alignItems: 'center',
    minHeight: 14,
  },
  yesterdayDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.ink3,
    marginBottom: 1,
  },
  yesterdayText: {
    fontFamily: fonts.mono,
    fontSize: 7,
    color: colors.ink3,
    letterSpacing: 0,
  },

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
});
