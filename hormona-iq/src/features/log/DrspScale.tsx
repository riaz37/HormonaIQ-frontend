// DrspScale — DRSP symptom rating scale section (0–6 per symptom).
// Renders the anchor legend, symptom scale rows, SI item, and functional impairment.
// Receives all state and callbacks via props; no direct store access.

import type { ReactElement } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  components as cmp,
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

// ─────────────────────────────────────────────
// ScaleRow (local sub-component)
// ─────────────────────────────────────────────

interface ScaleRowProps {
  label: string;
  value: number | null | undefined;
  onSet: (n: number) => void;
  max?: number;
}

function ScaleRow({ label, value, onSet, max = 6 }: ScaleRowProps): ReactElement {
  return (
    <View style={s.scaleRowWrap}>
      <Text style={[typography.body, s.scaleRowLabel]}>{label}</Text>
      <View style={s.scaleRow}>
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => {
          const isActive = value === n;
          return (
            <TouchableOpacity
              key={n}
              style={[cmp.scaleBtn, isActive && cmp.scaleBtnActive, s.scaleBtnFlex]}
              onPress={() => onSet(n)}
              accessibilityLabel={`${label} — ${ANCHORS[n] ?? String(n)}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <Text style={[cmp.scaleBtnLabel, isActive && cmp.scaleBtnLabelActive]}>
                {n}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
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

      {fastLog ? (
        // Fast log: flat list of the 3 key items, no section headers
        drspToRender.map((it) => (
          <ScaleRow
            key={it.key}
            label={it.label}
            value={drsp[it.key]}
            onSet={(n) => onSetDrsp(it.key, n)}
          />
        ))
      ) : (
        // Full mode: items grouped by section with headers and repeated legend hint
        DRSP_SECTIONS.map((section) => {
          const sectionItems = DRSP_ITEMS.filter((it) =>
            section.keys.includes(it.key),
          );
          // SI item sits inside Mood & Emotions section (last slot)
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
                />
              ))}
              {siInSection && (
                <View style={s.siBox}>
                  <Text style={s.siNote}>
                    Item 12 — important to track. There's no judgement here.
                  </Text>
                  <ScaleRow label={DRSP_SI.label} value={si} onSet={onSetSi} />
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
          <ScaleRow label={DRSP_SI.label} value={si} onSet={onSetSi} />
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
                  style={[cmp.scaleBtn, isActive && cmp.scaleBtnActive, s.scaleBtnFlex]}
                  onPress={() => onSetAdhdRating(n)}
                  accessibilityLabel={`ADHD meds effectiveness: ${n} of 5`}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                >
                  <Text style={[cmp.scaleBtnLabel, isActive && cmp.scaleBtnLabelActive]}>
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
  scaleRowWrap: {
    marginBottom: 16,
  },
  scaleRowLabel: {
    marginBottom: 6,
    fontSize: 14,
    fontFamily: fonts.sansMedium,
  },
  scaleRow: {
    flexDirection: 'row',
    gap: 6,
  },
  scaleBtnFlex: {
    flex: 1,
  },
  anchorLegend: {
    padding: 10,
    marginBottom: 18,
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
  adhdNote: {
    fontSize: 12,
  },
  adhdSection: {
    marginTop: 18,
    marginBottom: 28,
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
});
