// VibeCheck — Mood/vibe check section ("How are you, really?")
// Receives state and callbacks via props; no direct store access.

import type { ReactElement } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import {
  typography,
} from '../../constants/styles';
import { colors, fonts, radius } from '../../constants/tokens';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface FeelingOption {
  label: string;
  tone: string;
  sub: string;
}

export const FEELINGS: FeelingOption[] = [
  { label: 'Steady', tone: colors.eucalyptus, sub: 'Like myself' },
  { label: 'Slight', tone: colors.butter, sub: 'A little off' },
  { label: 'Off', tone: colors.coralSoft, sub: 'Noticeable' },
  { label: 'Heavy', tone: colors.coral, sub: 'Hard to manage' },
  { label: 'Hard', tone: colors.rose, sub: 'Functionally impaired' },
];

export interface VibeCheckProps {
  feeling: string | null;
  onFeelingChange: (label: string) => void;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export function VibeCheck({ feeling, onFeelingChange }: VibeCheckProps): ReactElement {
  return (
    <>
      <Text style={[typography.h2, { marginBottom: 6 }]}>How are you, really?</Text>
      <Text style={[typography.caption, { marginBottom: 14 }]}>
        A vibe check. Just for you — not part of your clinical record.
      </Text>
      <View style={{ marginBottom: 28, gap: 8 }}>
        {FEELINGS.map((f) => {
          const isActive = feeling === f.label;
          return (
            <TouchableOpacity
              key={f.label}
              style={[s.feelBtn, isActive && s.feelBtnActive]}
              onPress={() => onFeelingChange(f.label)}
              accessibilityLabel={`Feeling: ${f.label} — ${f.sub}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 }}>
                <View style={[s.feelTone, { backgroundColor: f.tone }]} />
                <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Text style={s.feelLabel}>{f.label}</Text>
                  {f.sub ? (
                    <Text style={[typography.caption, { fontSize: 12 }]}>{f.sub}</Text>
                  ) : null}
                </View>
              </View>
              {isActive && <Text style={s.checkMark}>✓</Text>}
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
  feelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.paper,
    minHeight: 56,
  },
  feelBtnActive: {
    borderColor: colors.eucalyptus,
    backgroundColor: colors.mintPale,
  },
  feelTone: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    flexShrink: 0,
  },
  feelLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.ink,
  },
  checkMark: {
    fontFamily: fonts.sansMedium,
    fontSize: 18,
    color: colors.eucalyptus,
  },
});
