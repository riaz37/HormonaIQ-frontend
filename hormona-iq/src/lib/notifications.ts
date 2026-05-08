// notifications.ts — Push notification scheduling for HormonaIQ.
// Three notification types:
//   1. Daily log reminder   — repeating at user-set time, phase-aware copy
//   2. Cycle phase alert    — one-time when entering late luteal (Ls)
//   3. Milestone            — one-time on Day 7 (ORA unlock)
//
// expo-notifications was removed from Expo Go in SDK 53.
// All functions are no-ops when running in Expo Go.

import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// ─────────────────────────────────────────────
// Expo Go detection
// ─────────────────────────────────────────────

const IS_EXPO_GO = Constants.appOwnership === 'expo';

// ─────────────────────────────────────────────
// Notification IDs — used to cancel specific notifications
// ─────────────────────────────────────────────

export const NOTIF_ID = {
  DAILY_LOG: 'hormona-daily-log',
  PHASE_ALERT: 'hormona-phase-alert',
  MILESTONE_DAY7: 'hormona-milestone-day7',
} as const;

// ─────────────────────────────────────────────
// Default handler — show alerts in foreground
// ─────────────────────────────────────────────

if (!IS_EXPO_GO) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

// ─────────────────────────────────────────────
// Permission
// ─────────────────────────────────────────────

export async function requestNotificationPermission(): Promise<boolean> {
  if (IS_EXPO_GO || !Device.isDevice) return false;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'HormonaIQ',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#6B9E8C',
    });
  }

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

// ─────────────────────────────────────────────
// Phase-aware daily reminder copy
// ─────────────────────────────────────────────

type PhaseCode = 'F' | 'O' | 'Lm' | 'Ls' | 'M' | '?';

function dailyReminderBody(phase: PhaseCode): string {
  switch (phase) {
    case 'Ls':
    case 'M':
      return 'Harder day. Log how you\'re feeling — it builds your pattern.';
    case 'F':
      return 'Energy is building. Log while it\'s fresh.';
    case 'O':
      return 'Peak window. A quick check-in shows what\'s working.';
    case 'Lm':
      return 'Mid-luteal. Log today — your provider will want this data.';
    default:
      return 'Time to log today. 2 minutes, then you\'re done.';
  }
}

// ─────────────────────────────────────────────
// Schedule daily log reminder
// ─────────────────────────────────────────────

export async function scheduleDailyLogReminder(
  hour: number,
  minute: number,
  phase: PhaseCode = '?',
): Promise<void> {
  if (IS_EXPO_GO) return;

  await Notifications.cancelScheduledNotificationAsync(NOTIF_ID.DAILY_LOG).catch(() => null);

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIF_ID.DAILY_LOG,
    content: {
      title: 'Daily check-in',
      body: dailyReminderBody(phase),
      data: { type: 'daily_log' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

// ─────────────────────────────────────────────
// Schedule late-luteal phase alert (one-time, fires tomorrow at 9am)
// ─────────────────────────────────────────────

export async function schedulePhaseAlert(cycleDay: number): Promise<void> {
  if (IS_EXPO_GO) return;

  await Notifications.cancelScheduledNotificationAsync(NOTIF_ID.PHASE_ALERT).catch(() => null);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(9, 0, 0, 0);

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIF_ID.PHASE_ALERT,
    content: {
      title: 'Your harder window is starting',
      body: `Day ${cycleDay + 1} tomorrow — log daily for the next 7 days so we can track the pattern.`,
      data: { type: 'phase_alert', cycleDay },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: tomorrow,
    },
  });
}

// ─────────────────────────────────────────────
// Schedule Day 7 milestone (fires in 7 days at 10am)
// ─────────────────────────────────────────────

export async function scheduleMilestoneDay7(): Promise<void> {
  if (IS_EXPO_GO) return;

  await Notifications.cancelScheduledNotificationAsync(NOTIF_ID.MILESTONE_DAY7).catch(() => null);

  const fireAt = new Date();
  fireAt.setDate(fireAt.getDate() + 7);
  fireAt.setHours(10, 0, 0, 0);

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIF_ID.MILESTONE_DAY7,
    content: {
      title: '7 days logged',
      body: 'ORA can now show you patterns. Open HormonaIQ to see your first insight.',
      data: { type: 'milestone_day7' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: fireAt,
    },
  });
}

// ─────────────────────────────────────────────
// Cancel all HormonaIQ notifications
// ─────────────────────────────────────────────

export async function cancelAllNotifications(): Promise<void> {
  if (IS_EXPO_GO) return;

  await Promise.all(
    Object.values(NOTIF_ID).map((id) =>
      Notifications.cancelScheduledNotificationAsync(id).catch(() => null),
    ),
  );
}
