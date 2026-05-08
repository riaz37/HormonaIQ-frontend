// useProStatus — checks the 'pro' RevenueCat entitlement once on mount and
// syncs the result into the settings store so GateCard / PDF export can read it.

import { useEffect } from 'react';

import { checkProEntitlement } from '../lib/revenuecat';
import { useSettingsStore } from '../stores/useSettingsStore';

export function useProStatus(): void {
  const setIsPro = useSettingsStore((s) => s.setIsPro);
  useEffect(() => {
    checkProEntitlement().then(setIsPro);
  }, [setIsPro]);
}
