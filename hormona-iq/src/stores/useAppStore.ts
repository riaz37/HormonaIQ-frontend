// useAppStore — top-level user/cycle state (conditions, primary condition,
// ADHD flag, cycle length, last period, passive mode).
// Persisted to AsyncStorage under key 'hormona-app-store'. lastPeriod is
// serialized to ISO string and rehydrated back into a Date.

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppState {
  conditions: readonly string[];
  primaryCondition: string | null;
  adhdFlag: boolean;
  cycleLen: number;
  lastPeriod: Date | null;
  passiveMode: boolean;
}

export interface AppActions {
  setConditions: (c: readonly string[]) => void;
  setPrimaryCondition: (c: string) => void;
  setAdhdFlag: (v: boolean) => void;
  setCycleLen: (n: number) => void;
  setLastPeriod: (d: Date | null) => void;
  setPassiveMode: (v: boolean) => void;
  reset: () => void;
}

export type AppStore = AppState & AppActions;

const INITIAL_STATE: AppState = {
  conditions: [],
  primaryCondition: null,
  adhdFlag: false,
  cycleLen: 28,
  lastPeriod: null,
  passiveMode: false,
};

// ── Date <-> ISO string serialization for `lastPeriod` ─────────────────────
interface PersistedAppState {
  conditions: readonly string[];
  primaryCondition: string | null;
  adhdFlag: boolean;
  cycleLen: number;
  lastPeriod: string | null;
  passiveMode: boolean;
}

function serialize(state: AppState): PersistedAppState {
  return {
    conditions: state.conditions,
    primaryCondition: state.primaryCondition,
    adhdFlag: state.adhdFlag,
    cycleLen: state.cycleLen,
    lastPeriod: state.lastPeriod ? state.lastPeriod.toISOString() : null,
    passiveMode: state.passiveMode,
  };
}

function deserialize(persisted: Partial<PersistedAppState>): Partial<AppState> {
  const out: Partial<AppState> = {
    conditions: persisted.conditions ?? INITIAL_STATE.conditions,
    primaryCondition: persisted.primaryCondition ?? null,
    adhdFlag: persisted.adhdFlag ?? false,
    cycleLen: persisted.cycleLen ?? 28,
    passiveMode: persisted.passiveMode ?? false,
    lastPeriod: persisted.lastPeriod ? new Date(persisted.lastPeriod) : null,
  };
  return out;
}

export const useAppStore = create<AppStore>()(
  persist(
    (set) => ({
      ...INITIAL_STATE,
      setConditions: (c) => set(() => ({ conditions: [...c] })),
      setPrimaryCondition: (c) => set(() => ({ primaryCondition: c })),
      setAdhdFlag: (v) => set(() => ({ adhdFlag: v })),
      setCycleLen: (n) => set(() => ({ cycleLen: n })),
      setLastPeriod: (d) => set(() => ({ lastPeriod: d })),
      setPassiveMode: (v) => set(() => ({ passiveMode: v })),
      reset: () => set(() => ({ ...INITIAL_STATE })),
    }),
    {
      name: 'hormona-app-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => serialize(state),
      merge: (persisted, current) => ({
        ...current,
        ...deserialize((persisted ?? {}) as Partial<PersistedAppState>),
      }),
      version: 1,
    },
  ),
);
