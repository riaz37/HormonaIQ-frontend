// Root layout — loads Morning Garden type system, mounts gesture/safe-area
// providers, and hands off to the expo-router slot.

import { useCallback, useEffect, type ReactElement } from 'react';
import { StyleSheet, View } from 'react-native';
import { Slot, SplashScreen } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  InstrumentSerif_400Regular,
  InstrumentSerif_400Regular_Italic,
} from '@expo-google-fonts/instrument-serif';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_500Medium,
} from '@expo-google-fonts/jetbrains-mono';

import { colors } from '../src/constants/tokens';

// Keep the splash visible until fonts resolve — a flash of fallback type would
// betray the brand voice on first launch.
SplashScreen.preventAutoHideAsync().catch(() => {
  // On web/dev fast refresh this can reject after auto-hide; ignore.
});

export default function RootLayout(): ReactElement | null {
  const [fontsLoaded, fontError] = useFonts({
    InstrumentSerif_400Regular,
    InstrumentSerif_400Regular_Italic,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
  });

  const ready = fontsLoaded || fontError !== null;

  const onLayout = useCallback(async () => {
    if (ready) {
      await SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [ready]);

  useEffect(() => {
    if (ready) {
      SplashScreen.hideAsync().catch(() => undefined);
    }
  }, [ready]);

  if (!ready) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.root} onLayout={onLayout}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <View style={styles.root}>
          <Slot />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.cream,
  },
});
