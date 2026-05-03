/**
 * PMDD Module Screen — route entry point
 *
 * All logic lives in src/features/pmdd/.
 * This file exists only to satisfy Expo Router's file-based routing
 * and to host the ErrorBoundary export.
 */

import React from 'react';
import { type ErrorBoundaryProps } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { colors, fonts, radius } from '../../../src/constants/tokens';
import PmddLayout from '../../../src/features/pmdd/PmddLayout';

export default PmddLayout;

export function ErrorBoundary({ error, retry }: ErrorBoundaryProps) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
        backgroundColor: colors.cream,
      }}
    >
      <Text
        style={{
          fontFamily: fonts.sansSemibold,
          fontSize: 17,
          color: colors.ink,
          marginBottom: 8,
        }}
      >
        Something went wrong
      </Text>
      <Text
        style={{
          fontFamily: fonts.sans,
          fontSize: 14,
          color: colors.ink2,
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        {error.message}
      </Text>
      <Pressable
        onPress={retry}
        style={{
          backgroundColor: colors.eucalyptus,
          paddingHorizontal: 24,
          paddingVertical: 12,
          borderRadius: radius.pill,
        }}
      >
        <Text
          style={{
            fontFamily: fonts.sansSemibold,
            color: colors.paper,
            fontSize: 15,
          }}
        >
          Try again
        </Text>
      </Pressable>
    </View>
  );
}
