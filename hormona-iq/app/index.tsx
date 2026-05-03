import { Platform } from 'react-native';
import { Redirect } from 'expo-router';
import { LandingScreen } from '../src/components/landing/LandingScreen';

export default function Index() {
  if (Platform.OS !== 'web') {
    return <Redirect href="/(onboarding)/start" />;
  }
  return <LandingScreen />;
}
