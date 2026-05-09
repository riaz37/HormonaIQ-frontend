// notifications.ts — stubs for mock-data mode.
// expo-notifications is not available in Expo Go SDK 53.
// Restore real implementation when building a dev client.

export const NOTIF_ID = {
  DAILY_LOG: 'hormona-daily-log',
  PHASE_ALERT: 'hormona-phase-alert',
  MILESTONE_DAY7: 'hormona-milestone-day7',
} as const;

export async function requestNotificationPermission(): Promise<boolean> {
  return false;
}

export async function scheduleDailyLogReminder(
  _hour: number,
  _minute: number,
  _phase?: string,
): Promise<void> {}

export async function schedulePhaseAlert(_cycleDay: number): Promise<void> {}

export async function scheduleMilestoneDay7(): Promise<void> {}

export async function cancelAllNotifications(): Promise<void> {}
