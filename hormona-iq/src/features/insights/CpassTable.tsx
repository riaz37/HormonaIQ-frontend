// CpassTable — C-PASS 4-criterion table + per-symptom luteal vs follicular table.
// T-03 C-PASS criteria, per-cycle stats, DRSP-21 item breakdown.

import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { cards, typography } from '../../constants/styles';
import { colors, fonts } from '../../constants/tokens';
import { SectionCard } from '../../components/ui/SectionCard';
import type { CPASSResult, CycleAnalysisResult, DRSPItem } from './types';

// ─────────────────────────────────────────────
// DRSP-21 item definitions (source of truth)
// ─────────────────────────────────────────────

export const DRSP_ITEM_LABELS: DRSPItem[] = [
  { k: 'depressed', label: 'Felt depressed, sad, "down," or "blue"', core: false },
  { k: 'hopeless', label: 'Felt hopeless', core: false },
  { k: 'worthless_guilty', label: 'Felt worthless or guilty', core: false },
  { k: 'anxiety', label: 'Felt anxious, tense, "keyed up," or "on edge"', core: true },
  { k: 'mood_swings', label: 'Mood swings (suddenly tearful, sensitive)', core: true },
  { k: 'rejection_sensitive', label: 'More sensitive to rejection', core: false },
  { k: 'irritability', label: 'Felt angry, irritable', core: true },
  { k: 'conflicts', label: 'Had conflicts or problems with people', core: false },
  { k: 'decreased_interest', label: 'Less interest in usual activities', core: false },
  { k: 'concentration', label: 'Difficulty concentrating', core: false },
  { k: 'fatigue', label: 'Felt lethargic, tired, fatigued, or low energy', core: false },
  { k: 'appetite', label: 'Increased appetite or food cravings', core: false },
  { k: 'hypersomnia', label: 'Slept more / hard to get up', core: false },
  { k: 'insomnia', label: 'Trouble falling or staying asleep', core: false },
  { k: 'overwhelmed', label: 'Felt overwhelmed or unable to cope', core: true },
  { k: 'out_of_control', label: 'Felt out of control', core: false },
  { k: 'breast_tenderness', label: 'Breast tenderness', core: false },
  { k: 'breast_swelling_bloating', label: 'Bloating / weight gain', core: false },
  { k: 'headache', label: 'Headache', core: false },
  { k: 'joint_muscle_pain', label: 'Joint or muscle pain', core: false },
];

// ─────────────────────────────────────────────
// C-PASS criterion rows definition
// ─────────────────────────────────────────────

const CPASS_CRITERIA: Array<{ k: keyof CPASSResult; l: string }> = [
  { k: 'absoluteSeverity', l: '≥5 items reach ≥4 in luteal' },
  { k: 'coreMood', l: 'At least 1 core mood item ≥4' },
  { k: 'absoluteClearance', l: 'No symptom > 3 in follicular' },
  { k: 'cyclicity', l: 'Luteal–follicular gap > 30%' },
];

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

export interface CpassTableProps {
  cycles: CycleAnalysisResult[];
  cycleLen: number;
  totalDaysLoggedCurrentCycle: number;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function CpassTable({
  cycles,
  cycleLen,
  totalDaysLoggedCurrentCycle,
}: CpassTableProps): ReactElement {
  return (
    <>
      {/* T-03 — C-PASS 4-criterion table */}
      <SectionCard style={{ marginBottom: 16 }}>
        <Text style={[typography.eyebrow, { marginBottom: 10 }]}>
          C-PASS · 4 CRITERIA · 2 CYCLES
        </Text>
        {/* Table header */}
        <View style={[s.tableRow, s.tableHeaderRow]}>
          <Text style={[s.tableCell, s.tableCellFlex, s.tableHeaderText]}>
            Criterion
          </Text>
          <Text
            style={[
              s.tableCell,
              s.tableCellFixed,
              s.tableHeaderText,
              { textAlign: 'center' },
            ]}
          >
            Cycle 1
          </Text>
          <Text
            style={[
              s.tableCell,
              s.tableCellFixed,
              s.tableHeaderText,
              { textAlign: 'center' },
            ]}
          >
            Cycle 2
          </Text>
        </View>
        {/* Table body */}
        {CPASS_CRITERIA.map((row) => (
          <View key={row.k} style={[s.tableRow, s.tableBodyRow]}>
            <Text style={[s.tableCell, s.tableCellFlex, s.tableBodyText]}>
              {row.l}
            </Text>
            <Text
              style={[
                s.tableCell,
                s.tableCellFixed,
                s.tableBodyText,
                { textAlign: 'center' },
              ]}
            >
              {cycles[0]?.cpass[row.k] ? '✓' : '○'}
            </Text>
            <Text
              style={[
                s.tableCell,
                s.tableCellFixed,
                s.tableBodyText,
                { textAlign: 'center' },
              ]}
            >
              {cycles[1]?.cpass[row.k] ? '✓' : '○'}
            </Text>
          </View>
        ))}
        <Text
          style={[typography.caption, { fontSize: 10, marginTop: 8, lineHeight: 16 }]}
        >
          C-PASS · Carolina Premenstrual Assessment Scoring System (Rubinow
          et al. 2017, PMC5205545)
        </Text>
      </SectionCard>

      {/* T-03 — Per-symptom table */}
      <SectionCard style={{ marginBottom: 16 }}>
        <Text style={[typography.eyebrow, { marginBottom: 10 }]}>
          PER-SYMPTOM · 11 ITEMS · LUTEAL VS FOLLICULAR
        </Text>
        {/* Table header */}
        <View style={[s.tableRow, s.tableHeaderRow]}>
          <Text style={[s.tableCell, s.tableCellFlex, s.tableHeaderText]}>
            Symptom
          </Text>
          <Text
            style={[
              s.tableCell,
              s.tableCellFixed,
              s.tableHeaderText,
              { textAlign: 'center' },
            ]}
          >
            Luteal
          </Text>
          <Text
            style={[
              s.tableCell,
              s.tableCellFixed,
              s.tableHeaderText,
              { textAlign: 'center' },
            ]}
          >
            Follicular
          </Text>
        </View>
        {/* Symptom rows */}
        {DRSP_ITEM_LABELS.map((it) => {
          const c1 = cycles[0];
          const lAvgItem = c1?.lutealMeans?.[it.k] ?? null;
          const fAvgItem = c1?.folMeans?.[it.k] ?? null;
          return (
            <View key={it.k} style={[s.tableRow, s.tableBodyRow]}>
              <Text style={[s.tableCell, s.tableCellFlex, s.tableBodyText]}>
                {it.label}
                {it.core ? ' *' : ''}
              </Text>
              <Text
                style={[
                  s.tableCell,
                  s.tableCellFixed,
                  s.tableMonoText,
                  { textAlign: 'center' },
                ]}
              >
                {lAvgItem != null ? lAvgItem.toFixed(1) : '—'}
              </Text>
              <Text
                style={[
                  s.tableCell,
                  s.tableCellFixed,
                  s.tableMonoText,
                  { textAlign: 'center' },
                ]}
              >
                {fAvgItem != null ? fAvgItem.toFixed(1) : '—'}
              </Text>
            </View>
          );
        })}
        <Text style={[typography.caption, { fontSize: 10, marginTop: 8 }]}>
          * core mood items (anxiety, mood swings, irritability, overwhelmed)
        </Text>
      </SectionCard>

      {/* Days logged caption */}
      <Text style={[typography.caption, { marginBottom: 28 }]}>
        {totalDaysLoggedCurrentCycle} of {cycleLen} days logged in current
        cycle.
      </Text>
    </>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const s = StyleSheet.create({
  tableRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tableHeaderRow: {
    borderBottomWidth: 1,
    borderBottomColor: colors.ink,
    paddingBottom: 4,
    marginBottom: 2,
  },
  tableBodyRow: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    paddingVertical: 4,
  },
  tableCell: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  tableCellFlex: {
    flex: 1,
  },
  tableCellFixed: {
    width: 64,
    flexShrink: 0,
  },
  tableHeaderText: {
    fontFamily: fonts.sansSemibold,
    fontSize: 11,
    color: colors.ink,
  },
  tableBodyText: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink,
    lineHeight: 16,
  },
  tableMonoText: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.ink,
  },
});

// Keep cards import used for future tint variants (suppresses unused warning).
void cards;
