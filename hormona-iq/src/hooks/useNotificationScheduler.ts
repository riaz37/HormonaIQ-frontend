// useNotificationScheduler — wires notification scheduling to app state.
// Mount once in the root layout. Re-schedules when cycle day or phase changes.

import { useEffect, useRef } from 'react';
import { useAppStore } from '../stores/useAppStore';
import { useLogStore } from '../stores/useLogStore';
import { useSettingsStore } from '../stores/useSettingsStore';
import {
  cancelAllNotifications,
  scheduleDailyLogReminder,
  scheduleMilestoneDay7,
  schedulePhaseAlert,
} from '../lib/notifications';

type PhaseCode = 'F' | 'O' | 'Lm' | 'Ls' | 'M' | '?';

function cycleDayFromLastPeriod(lastPeriod: Date | null): number {
  if (!lastPeriod) return 1;
  return Math.max(1, Math.floor((Date.now() - lastPeriod.getTime()) / 86400000) + 1);
}

function inferPhaseCode(cycleDay: number, cycleLen: number): PhaseCode {
  const c = cycleLen || 28;
  if (cycleDay <= 5 || cycleDay > c - 5) return 'M';
  const fEnd = Math.round(c * 0.45);
  const oEnd = Math.round(c * 0.55);
  const lmEnd = Math.round(c * 0.78);
  if (cycleDay <= fEnd) return 'F';
  if (cycleDay <= oEnd) return 'O';
  if (cycleDay <= lmEnd) return 'Lm';
  return 'Ls';
}

export function useNotificationScheduler(): void {
  const notificationsEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const notifHour = useSettingsStore((s) => s.notifHour);
  const notifMinute = useSettingsStore((s) => s.notifMinute);
  const lastPeriod = useAppStore((s) => s.lastPeriod);
  const cycleLen = useAppStore((s) => s.cycleLen);
  const entryCount = useLogStore((s) => s.entries.length);

  const milestoneScheduled = useRef(false);
  const prevPhase = useRef<PhaseCode | null>(null);

  useEffect(() => {
    if (!notificationsEnabled) {
      void cancelAllNotifications();
      return;
    }

    const cycleDay = cycleDayFromLastPeriod(lastPeriod);
    const phase = inferPhaseCode(cycleDay, cycleLen);

    void scheduleDailyLogReminder(notifHour, notifMinute, phase);

    if (phase === 'Ls' && prevPhase.current !== 'Ls') {
      void schedulePhaseAlert(cycleDay);
    }
    prevPhase.current = phase;

    if (entryCount >= 1 && !milestoneScheduled.current) {
      milestoneScheduled.current = true;
      void scheduleMilestoneDay7();
    }
  }, [notificationsEnabled, notifHour, notifMinute, lastPeriod, cycleLen, entryCount]);
}
