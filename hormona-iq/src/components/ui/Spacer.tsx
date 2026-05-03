import React from 'react';
import { View } from 'react-native';
import { spacing } from '../../constants/tokens';

interface SpacerProps {
  size?: keyof typeof spacing;
}

export function Spacer({ size = 'md' }: SpacerProps) {
  return <View style={{ height: spacing[size] }} />;
}
