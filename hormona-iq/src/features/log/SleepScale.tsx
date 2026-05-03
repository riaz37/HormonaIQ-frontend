// SleepScale — Sleep quality/disruption rating section.
// Receives state and callbacks via props; no store access.

import type { ReactElement } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { components as cmp, typography } from '../../constants/styles';

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────

// T-38 — sleep labels reframed for severity, not subjective quality
export const SLEEP_LIST = ['None', 'Mild disruption', 'Moderate', 'Severe', 'Extreme'];

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

export interface SleepScaleProps {
  sleep: number | null;
  onSleepChange: (value: number) => void;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function SleepScale({ sleep, onSleepChange }: SleepScaleProps): ReactElement {
  return (
    <>
      <Text style={[typography.h2, { marginBottom: 12 }]}>Last night's sleep</Text>
      <View style={[s.scaleRow, { marginBottom: 8 }]}>
        {SLEEP_LIST.map((label, i) => {
          const isActive = sleep === i + 1;
          return (
            <TouchableOpacity
              key={label}
              style={[cmp.scaleBtn, isActive && cmp.scaleBtnActive, s.scaleBtnFlex]}
              onPress={() => onSleepChange(i + 1)}
              accessibilityLabel={`Sleep: ${label}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <Text
                style={[
                  cmp.scaleBtnLabel,
                  isActive && cmp.scaleBtnLabelActive,
                  { fontSize: 11 },
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const s = StyleSheet.create({
  scaleRow: {
    flexDirection: 'row',
    gap: 6,
  },
  scaleBtnFlex: {
    flex: 1,
  },
});
