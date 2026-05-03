// Modules stack layout — wraps the dynamic [id] route.
// Headerless: each module screen manages its own navigation bar.

import type { ReactElement } from 'react';
import { Stack } from 'expo-router';

export default function ModulesLayout(): ReactElement {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
