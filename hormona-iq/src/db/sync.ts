import { synchronize } from '@nozbe/watermelondb/sync';

import { database } from './index';
import { supabase } from '../lib/supabase';

export async function syncDB(userId: string): Promise<void> {
  await synchronize({
    database,
    pullChanges: async ({ lastPulledAt }) => {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) throw new Error('No auth token for sync');

      const { data, error } = await supabase.functions.invoke('sync-pull', {
        body: { last_pulled_at: lastPulledAt, user_id: userId },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (error) throw error;
      return data as { changes: object; timestamp: number };
    },
    pushChanges: async ({ changes, lastPulledAt }) => {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      if (!token) throw new Error('No auth token for sync');

      const { error } = await supabase.functions.invoke('sync-push', {
        body: { changes, last_pulled_at: lastPulledAt, user_id: userId },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (error) throw error;
    },
    migrationsEnabledAtVersion: 1,
  });
}
