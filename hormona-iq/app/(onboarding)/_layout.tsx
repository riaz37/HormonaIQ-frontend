// Onboarding stack — header chrome lives inside each step so the hero artwork
// can extend full-bleed.

import type { ReactElement } from 'react';
import { Stack } from 'expo-router';

export default function OnboardingLayout(): ReactElement {
  return <Stack screenOptions={{ headerShown: false }} />;
}
