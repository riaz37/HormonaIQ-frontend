// ─────────────────────────────────────────────────────────────────────────────
// SafetyTab — F35 · SAFETY PLAN
// Tab id: 'safetyPlan'
// ─────────────────────────────────────────────────────────────────────────────

import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { buttons, cards, typography } from '../../constants/styles';
import { colors, fonts } from '../../constants/tokens';
import { MHeader } from './primitives';
import { phaseForDay } from './types';
import type { PMDDState, SafetyPlanItem } from './types';

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────

const DEFAULT_SAFETY_ITEMS: SafetyPlanItem[] = [
  {
    k: 'warning',
    l: 'Warning signs',
    v: 'Snapping at partner · waking at 4am · canceling plans',
  },
  {
    k: 'cope',
    l: 'Things that help me cope',
    v: 'Walk outside · cold shower · noise-cancelling headphones',
  },
  {
    k: 'people',
    l: 'People I can text',
    v: 'Maya · Mom · Dr. Reyes',
  },
  {
    k: 'pro',
    l: 'Professionals',
    v: 'Therapist Jen — Tue/Thu · 988 crisis support',
  },
  {
    k: 'safe',
    l: 'Make environment safe',
    v: 'Alcohol out of house · meds in lockbox',
  },
];

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

interface SafetyTabProps {
  state: PMDDState;
  setState: React.Dispatch<React.SetStateAction<PMDDState>>;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function SafetyTab({ state, setState }: SafetyTabProps) {
  const [items] = useState<SafetyPlanItem[]>(DEFAULT_SAFETY_ITEMS);
  const phase = phaseForDay(state.cycleDay, state.cycleLen);
  const lutealLocked = phase === 'L' && !state.safetyPlanEditOverride;

  const requestOverride = useCallback(() => {
    setState((prev) => ({ ...prev, safetyPlanEditOverride: true }));
  }, [setState]);

  return (
    <View>
      <MHeader
        eyebrow="Your safety plan"
        title="Built when you were "
        titleAccent="well."
        sub="Surfaces automatically before high-risk luteal days."
      />
      {items.map((it) => (
        <View key={it.k} style={[cards.cardWarm, s.safetyItemCard]}>
          <Text style={[typography.caption, { marginBottom: 4 }]}>{it.l}</Text>
          <Text style={[typography.body, { fontSize: 13, lineHeight: 22 }]}>
            {it.v}
          </Text>
        </View>
      ))}
      {lutealLocked ? (
        <>
          <View
            style={[
              buttons.soft,
              s.fullWidth,
              s.disabledBtn,
            ]}
            accessibilityState={{ disabled: true }}
            pointerEvents="none"
          >
            <Text style={[buttons.softLabel, { textAlign: 'center' }]}>
              Update plan (read-only in luteal)
            </Text>
          </View>
          <TouchableOpacity
            style={[s.ghostBtn, s.fullWidth, { marginTop: 6 }]}
            onPress={requestOverride}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Unlock safety plan to update it now"
          >
            <Text style={s.ghostBtnLabel}>I need to update this now</Text>
          </TouchableOpacity>
          <Text style={s.safetyLockCaption}>
            Your safety plan was created when you were feeling well. We show it
            in read-only mode here so you always see the version you most
            trusted.
          </Text>
        </>
      ) : (
        <TouchableOpacity
          style={[buttons.soft, s.fullWidth, { marginTop: 8 }]}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Update safety plan"
        >
          <Text style={buttons.softLabel}>Update plan</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const s = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  ghostBtn: {
    minHeight: 44,
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
  safetyItemCard: {
    padding: 16,
    marginBottom: 8,
  },
  disabledBtn: {
    marginTop: 8,
    opacity: 0.45,
  },
  safetyLockCaption: {
    fontFamily: fonts.sans,
    fontSize: 11,
    marginTop: 8,
    textAlign: 'center',
    color: colors.ink3,
  },
});
