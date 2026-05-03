import React from 'react';
import { Pressable, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, fonts, spacing, radius } from '../../constants/tokens';

interface ChipTagProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

export function ChipTag({ label, selected, onPress, style }: ChipTagProps) {
  const containerStyle: ViewStyle = selected
    ? { backgroundColor: colors.eucalyptus }
    : {
        backgroundColor: colors.mintPale,
        borderColor: colors.border,
        borderWidth: 1,
      };

  const textColor = selected ? colors.paper : colors.ink2;

  return (
    <Pressable style={[styles.base, containerStyle, style]} onPress={onPress}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 34,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
  },
});
