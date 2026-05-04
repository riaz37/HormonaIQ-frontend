// PhysicalSymptoms — Physical symptom multi-select section.
// Uses ChipTag from shared UI. Receives state and callbacks via props; no store access.

import type { ReactElement } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { typography } from '../../constants/styles';
import { spacing } from '../../constants/tokens';
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

const NONE_KEY = 'none';

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

export interface PhysicalSymptomsProps {
  selected: string[];
  onToggle: (symptom: string) => void;
  onSelectNone: () => void;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function PhysicalSymptoms({
  selected,
  onToggle,
  onSelectNone,
}: PhysicalSymptomsProps): ReactElement {
  const noneSelected = selected.length === 0 || selected.includes(NONE_KEY);

  const handleSymptomPress = (symptom: string): void => {
    // Toggling a real symptom always deselects "None"
    onToggle(symptom);
  };

  return (
    <>
      <Text style={[typography.h2, { marginTop: spacing.lg, marginBottom: spacing.sm }]}>
        Physical (tap any)
      </Text>
      <View style={s.chipRow}>
        {PHYSICAL_LIST.map((p) => (
          <ChipTag
            key={p}
            label={p}
            selected={selected.includes(p)}
            onPress={() => handleSymptomPress(p)}
          />
        ))}
        <ChipTag
          key={NONE_KEY}
          label="None of these"
          selected={noneSelected}
          onPress={onSelectNone}
        />
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
