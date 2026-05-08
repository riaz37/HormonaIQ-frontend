import { useEffect } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { supabase } from '../lib/supabase';
import { syncDB } from '../db/sync';

export function useSyncDB() {
  useEffect(() => {
    let isMounted = true;

    const doSync = async () => {
      try {
        const session = await supabase.auth.getSession();
        const userId = session.data.session?.user?.id;
        if (!userId) return;
        await syncDB(userId);
      } catch (err) {
        console.warn('[sync] sync failed:', err);
      }
    };

    const appStateSub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (state === 'active' && isMounted) doSync();
    });

    doSync();

    return () => {
      isMounted = false;
      appStateSub.remove();
    };
  }, []);
}
