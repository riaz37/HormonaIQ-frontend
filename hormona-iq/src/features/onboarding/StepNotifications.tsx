// StepNotifications — Step 5: notification preferences.
// Props-only — no direct store access.

import type { ReactElement } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { buttons, typography } from '../../constants/styles';
import { colors, fonts, radius } from '../../constants/tokens';
import type { NotifChoice } from './types';

// ─────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────

const NOTIFICATION_EXAMPLES: readonly { readonly icon: string; readonly line: string }[] = [
  { icon: '🔔', line: 'Day 22: heads up — your usual harder window starts in 2 days.' },
  { icon: '✦', line: "Sunday: I'm seeing two patterns this week — open Ora when you have a minute." },
  { icon: '♡', line: "Day 5: the hard part is lifting. Rest counts." },
];

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

export interface StepNotificationsProps {
  notifChoice: NotifChoice | null;
  onNotifChoiceChange: (choice: NotifChoice) => void;
  onFinish: () => void;
}

// ─────────────────────────────────────────────
// StepNotifications — exported component
// ─────────────────────────────────────────────

export function StepNotifications({
  notifChoice,
  onNotifChoiceChange,
  onFinish,
}: StepNotificationsProps): ReactElement {
  return (
    <View style={s.maxColumn}>
      <Text style={[typography.eyebrow, { marginBottom: 8 }]}>
        NOTIFICATIONS
      </Text>
      <Text style={[typography.display, { marginBottom: 14 }]}>
        Stay ahead of your cycle
      </Text>
      <Text style={[typography.body, { color: colors.ink2, marginBottom: 22 }]}>
        I'll send a quiet heads-up before your harder days. You can turn
        this off anytime.
      </Text>

      {/* Notification example previews */}
      <View style={{ gap: 10, marginBottom: 24 }}>
        {NOTIFICATION_EXAMPLES.map((ex, i) => (
          <View key={i} style={s.notifExample}>
            <View style={s.notifIconWrap}>
              <Text style={{ fontSize: 14 }}>{ex.icon}</Text>
            </View>
            <Text style={[typography.caption, { fontSize: 13, color: colors.ink2, flex: 1 }]}>
              {ex.line}
            </Text>
          </View>
        ))}
      </View>

      {/* Equalized outline buttons */}
      <View style={{ gap: 10 }}>
        <TouchableOpacity
          style={[
            s.notifBtn,
            notifChoice === 'allow' && s.notifBtnSelected,
          ]}
          onPress={() => onNotifChoiceChange('allow')}
          accessibilityRole="radio"
          accessibilityState={{ selected: notifChoice === 'allow' }}
          accessibilityLabel="Allow notifications"
          activeOpacity={0.8}
        >
          <Text style={[s.notifBtnLabel, notifChoice === 'allow' && s.notifBtnLabelSelected]}>
            Allow notifications
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            s.notifBtn,
            notifChoice === 'deny' && s.notifBtnSelected,
          ]}
          onPress={() => onNotifChoiceChange('deny')}
          accessibilityRole="radio"
          accessibilityState={{ selected: notifChoice === 'deny' }}
          accessibilityLabel="Not now, skip notifications"
          activeOpacity={0.8}
        >
          <Text style={[s.notifBtnLabel, notifChoice === 'deny' && s.notifBtnLabelSelected]}>
            Not now
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={[
          buttons.primary,
          { marginTop: 24 },
          !notifChoice && buttons.primaryDisabled,
        ]}
        onPress={onFinish}
        disabled={!notifChoice}
        accessibilityRole="button"
        accessibilityLabel="Begin using HormonaIQ"
        activeOpacity={0.85}
      >
        <Text style={buttons.primaryLabel}>Begin →</Text>
      </TouchableOpacity>
    </View>
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
  notifExample: {
    padding: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    backgroundColor: colors.paper,
  },
  notifIconWrap: {
    flexShrink: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.mintPale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notifBtn: {
    height: 52,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.eucalyptus,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  notifBtnSelected: {
    backgroundColor: colors.mintPale,
    borderWidth: 2,
  },
  notifBtnLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.eucalyptusDeep,
  },
  notifBtnLabelSelected: {
    color: colors.eucalyptusDeep,
  },
});
