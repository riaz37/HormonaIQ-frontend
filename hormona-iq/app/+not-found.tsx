import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, spacing, radius } from '../src/constants/tokens';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Page Not Found' }} />
      <View style={styles.container}>
        <Text style={styles.heading}>Page not found</Text>
        <Text style={styles.body}>
          The screen you&apos;re looking for doesn&apos;t exist.
        </Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go back home</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  heading: {
    fontFamily: fonts.display,
    fontSize: 32,
    color: colors.eucalyptus,
    textAlign: 'center',
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.ink,
    textAlign: 'center',
    lineHeight: 24,
  },
  link: {
    marginTop: spacing.sm,
  },
  linkText: {
    fontFamily: fonts.sansSemibold,
    fontSize: 15,
    color: colors.cream,
    backgroundColor: colors.eucalyptus,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + spacing.xs,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
});
