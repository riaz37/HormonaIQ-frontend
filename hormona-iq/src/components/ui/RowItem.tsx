import React from 'react';
import { Pressable, View, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, fonts, spacing } from '../../constants/tokens';

interface RowItemProps {
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
  leftIcon?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export function RowItem({
  label,
  value,
  onPress,
  showChevron = false,
  leftIcon,
  style,
}: RowItemProps) {
  const content = (
    <>
      {leftIcon !== undefined && (
        <View style={styles.iconWrapper}>{leftIcon}</View>
      )}
      <Text style={styles.label}>{label}</Text>
      {value !== undefined && (
        <Text style={styles.value}>{value}</Text>
      )}
      {showChevron && (
        <Text style={styles.chevron}>{'›'}</Text>
      )}
    </>
  );

  if (onPress !== undefined) {
    return (
      <Pressable style={[styles.row, style]} onPress={onPress}>
        {content}
      </Pressable>
    );
  }

  return (
    <View style={[styles.row, style]}>
      {content}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  iconWrapper: {
    marginRight: spacing.sm,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink,
    flex: 1,
  },
  value: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink2,
  },
  chevron: {
    color: colors.inkDisabled,
    fontSize: 18,
    marginLeft: spacing.xs,
  },
});
