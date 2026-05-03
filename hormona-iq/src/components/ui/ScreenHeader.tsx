import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, fonts, spacing } from '../../constants/tokens';

interface ScreenHeaderProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  style?: StyleProp<ViewStyle>;
}

export function ScreenHeader({ eyebrow, title, subtitle, style }: ScreenHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      {eyebrow !== undefined && (
        <Text style={styles.eyebrow}>{eyebrow.toUpperCase()}</Text>
      )}
      <Text style={[styles.title, eyebrow !== undefined && styles.titleSpacing]}>
        {title}
      </Text>
      {subtitle !== undefined && (
        <Text style={[styles.subtitle, styles.subtitleSpacing]}>{subtitle}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  eyebrow: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.eucalyptus,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: colors.ink,
  },
  titleSpacing: {
    marginTop: spacing.xs,
  },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink2,
  },
  subtitleSpacing: {
    marginTop: spacing.xs,
  },
});
