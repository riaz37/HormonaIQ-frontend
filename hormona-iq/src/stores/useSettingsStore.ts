// useSettingsStore — app-level preferences (theme, motion, Ora, ED-safe mode).
// Persisted to AsyncStorage under key 'hormona-settings-store'.

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemePreference = 'light' | 'dark' | 'system';

export interface SettingsState {
  theme: ThemePreference;
  reduceMotion: boolean;
  oraEnabled: boolean;
  edSafeMode: boolean;
  notificationsEnabled: boolean;
  notifHour: number;
  notifMinute: number;
}

export interface SettingsActions {
  setTheme: (t: ThemePreference) => void;
  setReduceMotion: (v: boolean) => void;
  setOraEnabled: (v: boolean) => void;
  setEdSafeMode: (v: boolean) => void;
  setNotificationsEnabled: (v: boolean) => void;
  setNotifTime: (hour: number, minute: number) => void;
  reset: () => void;
}

export type SettingsStore = SettingsState & SettingsActions;

const INITIAL_STATE: SettingsState = {
  theme: 'system',
  reduceMotion: false,
  oraEnabled: true,
  edSafeMode: false,
  notificationsEnabled: false,
  notifHour: 20,
  notifMinute: 0,
};

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      setTheme: (t) => set(() => ({ theme: t })),
      setReduceMotion: (v) => set(() => ({ reduceMotion: v })),
      setOraEnabled: (v) => set(() => ({ oraEnabled: v })),
      setEdSafeMode: (v) => set(() => ({ edSafeMode: v })),
      setNotificationsEnabled: (v) => set(() => ({ notificationsEnabled: v })),
      setNotifTime: (hour, minute) => set(() => ({ notifHour: hour, notifMinute: minute })),
      reset: () => set(() => ({ ...INITIAL_STATE })),
    }),
    {
      name: 'hormona-settings-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        theme: state.theme,
        reduceMotion: state.reduceMotion,
        oraEnabled: state.oraEnabled,
        edSafeMode: state.edSafeMode,
        notificationsEnabled: state.notificationsEnabled,
        notifHour: state.notifHour,
        notifMinute: state.notifMinute,
      }),
      version: 1,
    },
  ),
);
