import { Redirect } from 'expo-router';

// Mock-data mode: skip auth and onboarding, land directly in the app.
export default function Index() {
  return <Redirect href="/(app)/home" />;
}
