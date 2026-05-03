// Shared scaffold for dedicated module screens — SafeArea + topbar + scroll surface.
// All Phase-2 module screens render their content as children of this scaffold so
// the header, back affordance, and disclaimer stay consistent.

import React, { type ReactElement, type ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { MHeader } from '../../components/module';
import { colors, fonts, spacing } from '../../constants/tokens';

export interface ModuleScaffoldProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  onBack: () => void;
  children: ReactNode;
  /** Optional element rendered just below the header (e.g., a phase chip). */
  headerSlot?: ReactNode;
}

export function ModuleScaffold({
  title,
  subtitle,
  eyebrow,
  onBack,
  children,
  headerSlot,
}: ModuleScaffoldProps): ReactElement {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <MHeader
          title={title}
          subtitle={subtitle}
          eyebrow={eyebrow}
          onBack={onBack}
        />
        {headerSlot}
        <View style={styles.body}>{children}</View>
        <Text style={styles.disclaimer}>
          HormonaIQ is not a substitute for medical advice. Always consult your provider.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing['2xl'],
  },
  body: {
    marginTop: spacing.xs,
  },
  disclaimer: {
    fontFamily: fonts.sans,
    fontSize: 11,
    lineHeight: 16,
    color: colors.ink3,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
});
