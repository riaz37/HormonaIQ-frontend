# Backend Integration — What Was Added

## New files (safe to merge — nothing existing was modified)

- `src/lib/supabase.ts` — Supabase client with AsyncStorage session persistence
- `src/lib/ora-context.ts` — PHI scrubbing for Ora API calls (relative cycle days only)
- `src/db/schema.ts` — WatermelonDB schema (mirrors Supabase tables)
- `src/db/models/SymptomLog.ts` — WatermelonDB model with JSON getters
- `src/db/index.ts` — Database instance (JSI adapter)
- `src/db/sync.ts` — WatermelonDB ↔ Supabase sync protocol
- `src/hooks/useSyncDB.ts` — Foreground + network reconnect sync trigger
- `app/(auth)/_layout.tsx` — Auth stack navigator
- `app/(auth)/login.tsx` — Login screen
- `app/(auth)/signup.tsx` — Signup screen
- `.env.local.example` — Environment variable template

## What still needs manual wiring

### 1. Install packages
```bash
npx expo install @supabase/supabase-js
npx expo install @nozbe/watermelondb
npx expo install expo-build-properties
npx expo install expo-dev-client
```

### 2. Update app/(app)/_layout.tsx — add auth gate
```typescript
import { useEffect, useState } from 'react';
import { router } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { useSyncDB } from '../../src/hooks/useSyncDB';

// In your layout component, add:
const [session, setSession] = useState(null);

useEffect(() => {
  supabase.auth.getSession().then(({ data: { session } }) => {
    setSession(session);
    if (!session) router.replace('/(auth)/login');
  });

  const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session);
    if (!session) router.replace('/(auth)/login');
  });

  return () => subscription.unsubscribe();
}, []);

useSyncDB(); // triggers sync on foreground + network reconnect
```

### 3. Update OnboardingShell.tsx finish()
After the user completes onboarding, call:
```typescript
const { error } = await supabase.auth.signUp({ email, password });
if (!error) {
  await fetch(`${process.env.EXPO_PUBLIC_API_BASE_URL}/api/v1/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
    body: JSON.stringify({ email, password, conditions, cycle_len, ... }),
  });
}
```

### 4. WatermelonDB requires EAS dev build
Expo Go will crash after installing WatermelonDB (JSI native module).
```bash
eas build --profile development --platform all
```

### 5. Create .env
Copy `.env.local.example` → `.env` and fill in real Supabase/Railway values.
