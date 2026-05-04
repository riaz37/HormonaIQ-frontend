import React from 'react';
import { Pressable, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { colors, fonts, radius } from '../../constants/tokens';

interface PillButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

const sizeConfig = {
  // sm is used in dense contexts; prefer md (44px) for primary actions
  sm: { height: 40, fontSize: 14, paddingHorizontal: 16 },
  md: { height: 44, fontSize: 15, paddingHorizontal: 20 },
  lg: { height: 52, fontSize: 16, paddingHorizontal: 24 },
} as const;

export function PillButton({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  style,
}: PillButtonProps) {
  const { height, fontSize, paddingHorizontal } = sizeConfig[size];

  const containerStyle: ViewStyle =
    variant === 'primary'
      ? { backgroundColor: colors.eucalyptus }
      : variant === 'secondary'
      ? { backgroundColor: colors.mintMist }
      : {
          backgroundColor: 'transparent',
          borderColor: colors.eucalyptus,
          borderWidth: 1.5,
        };

  const textColor =
    variant === 'primary'
      ? colors.paper
      : colors.eucalyptus;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.base,
        containerStyle,
        { height, paddingHorizontal },
        disabled && styles.disabled,
        style,
      ]}
    >
      <Text style={[styles.label, { fontSize, color: textColor }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: fonts.sansMedium,
  },
  disabled: {
    opacity: 0.45,
  },
});
