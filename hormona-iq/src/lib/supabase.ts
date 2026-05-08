import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

// AsyncStorage used (not SecureStore) because expo-secure-store has a 2KB limit
// per key. JWTs can exceed this. AsyncStorage is acceptable here because:
// 1. iOS/Android encrypt the app sandbox
// 2. JWTs expire after 1 hour (Supabase setting)
// 3. Refresh tokens are rotated on use
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
