// useModuleTabs — encapsulates active-tab state for module screens.
//
// Extracted from:
//   perimenopause.tsx:  const [activeTab, setActiveTab] = useState<ModuleKey>('hotFlash')
//   pmdd.tsx:           const [activeTab, setActiveTab] = useState<ModuleId>('pmddPDF')
//
// Both screens follow the same pattern: a list of tab keys, a controlled
// active key, and a setter.  The hook is generic so both screens can use it
// with their own tab lists.

import { useCallback, useState } from 'react';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface ModuleTabsResult {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  tabs: string[];
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

/**
 * @param initialTab - The key of the tab that should be active on mount.
 *   Should be one of the values in `tabs`.
 * @param tabs - Ordered list of tab keys.  These are the string values used
 *   as `key` / `id` in the tab strip (e.g. 'hotFlash', 'hrt', … from
 *   perimenopause.tsx or 'pmddPDF', 'crisis', … from pmdd.tsx).
 */
export function useModuleTabs(initialTab: string, tabs: string[]): ModuleTabsResult {
  const [activeTab, setActiveTabRaw] = useState<string>(
    tabs.includes(initialTab) ? initialTab : (tabs[0] ?? initialTab),
  );

  // Guard: only accept tab keys that exist in the provided list.
  const setActiveTab = useCallback(
    (tab: string): void => {
      if (tabs.includes(tab)) {
        setActiveTabRaw(tab);
      }
    },
    [tabs],
  );

  return {
    activeTab,
    setActiveTab,
    tabs,
  };
}
