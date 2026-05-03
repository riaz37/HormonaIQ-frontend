import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, spacing, radius, shadows } from '../../constants/tokens';

interface SectionCardProps {
  children: React.ReactNode;
  tint?: 'mint' | 'butter' | 'default';
  style?: StyleProp<ViewStyle>;
}

export function SectionCard({ children, tint = 'default', style }: SectionCardProps) {
  const tintStyle: ViewStyle =
    tint === 'mint'
      ? { backgroundColor: colors.mintMist }
      : tint === 'butter'
      ? { backgroundColor: colors.butter }
      : {
          backgroundColor: colors.paper,
          borderColor: colors.border,
          borderWidth: 1,
        };

  return (
    <View style={[styles.base, tintStyle, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    padding: spacing.md,
    borderRadius: radius.md,
    ...shadows.sm,
  },
});
