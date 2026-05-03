// Daily log entry point — delegates to the feature module.
// ErrorBoundary stays here per Expo Router conventions.

import { type ErrorBoundaryProps } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { colors, fonts, radius } from '../../src/constants/tokens';
import LogScreen from '../../src/features/log/LogScreen';

export default LogScreen;

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: colors.cream }}>
      <Text style={{ fontFamily: fonts.sansSemibold, fontSize: 17, color: colors.ink, marginBottom: 8 }}>
        Something went wrong
      </Text>
      <Text style={{ fontFamily: fonts.sans, fontSize: 14, color: colors.ink2, marginBottom: 24, textAlign: 'center' }}>
        {error.message}
      </Text>
      <Pressable onPress={retry} style={{ backgroundColor: colors.eucalyptus, paddingHorizontal: 24, paddingVertical: 12, borderRadius: radius.pill }}>
        <Text style={{ fontFamily: fonts.sansSemibold, color: colors.paper, fontSize: 15 }}>Try again</Text>
      </Pressable>
    </View>
  );
}
