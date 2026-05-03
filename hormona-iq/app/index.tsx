import { useEffect } from 'react';
import { Platform } from 'react-native';
import { router } from 'expo-router';
import { LandingScreen } from '../src/components/landing/LandingScreen';

export default function Index() {
  useEffect(() => {
    if (Platform.OS !== 'web') {
      router.replace('/(onboarding)/start');
    }
  }, []);

  if (Platform.OS !== 'web') return null;
  return <LandingScreen />;
}
