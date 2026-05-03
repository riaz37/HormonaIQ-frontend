// PhysicalSymptoms — Physical symptom multi-select section.
// Uses ChipTag from shared UI. Receives state and callbacks via props; no store access.

import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { typography } from '../../constants/styles';
import { ChipTag } from '../../components/ui/ChipTag';

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────

export const PHYSICAL_LIST = [
  'Bloating',
  'Cramps',
  'Headache',
  'Breast tenderness',
  'Fatigue',
  'Joint pain',
  'Skin changes',
];

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

export interface PhysicalSymptomsProps {
  selected: string[];
  onToggle: (symptom: string) => void;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function PhysicalSymptoms({ selected, onToggle }: PhysicalSymptomsProps): ReactElement {
  return (
    <>
      <Text style={[typography.h2, { marginTop: 18, marginBottom: 12 }]}>
        Physical (tap any)
      </Text>
      <View style={s.chipRow}>
        {PHYSICAL_LIST.map((p) => (
          <ChipTag
            key={p}
            label={p}
            selected={selected.includes(p)}
            onPress={() => onToggle(p)}
          />
        ))}
      </View>
    </>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const s = StyleSheet.create({
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 32,
  },
});
