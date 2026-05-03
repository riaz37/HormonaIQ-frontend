import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';
import { colors, fonts, spacing } from '../../constants/tokens';

interface FAQItemProps {
  question: string;
  answer: string;
}

/**
 * Expandable FAQ row — port of the `<details><summary>` pattern in landing.jsx.
 * Animates open/close with Reanimated; respects useReducedMotion.
 */
export function FAQItem({ question, answer }: FAQItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const reduceMotion = useReducedMotion();

  const progress = useSharedValue(0);

  const toggle = () => {
    const next = !expanded;
    setExpanded(next);
    progress.value = withTiming(next ? 1 : 0, {
      duration: reduceMotion ? 0 : 280,
      easing: Easing.out(Easing.cubic),
    });
  };

  const answerStyle = useAnimatedStyle(() => ({
    height: progress.value * contentHeight,
    opacity: progress.value,
    overflow: 'hidden',
  }));

  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 180}deg` }],
  }));

  return (
    <View style={styles.row}>
      <Pressable
        onPress={toggle}
        accessibilityRole="button"
        accessibilityState={{ expanded }}
        accessibilityLabel={question}
        style={({ pressed }) => [
          styles.summary,
          pressed && { opacity: 0.7 },
        ]}
      >
        <Text style={styles.question}>{question}</Text>
        <Animated.Text style={[styles.chevron, chevronStyle]}>
          {'▾'}
        </Animated.Text>
      </Pressable>

      <Animated.View style={answerStyle}>
        <View
          style={styles.answerInner}
          onLayout={(e) => {
            const h = e.nativeEvent.layout.height;
            if (h > 0 && Math.abs(h - contentHeight) > 0.5) {
              setContentHeight(h);
            }
          }}
        >
          <Text style={styles.answer}>{answer}</Text>
        </View>
      </Animated.View>

      {/* Off-screen measurer so we know the natural content height for the
          height animation. Rendered with absolute positioning + opacity 0. */}
      {contentHeight === 0 ? (
        <View
          style={styles.measurer}
          onLayout={(e) => setContentHeight(e.nativeEvent.layout.height)}
          pointerEvents="none"
          aria-hidden
        >
          <Text style={styles.answer}>{answer}</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  summary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 20,
    minHeight: 44,
  },
  question: {
    flex: 1,
    fontFamily: fonts.sansSemibold,
    fontSize: 20,
    lineHeight: 26,
    color: colors.ink,
    letterSpacing: -0.1,
  },
  chevron: {
    fontFamily: fonts.sans,
    fontSize: 18,
    color: colors.eucalyptus,
  },
  answerInner: {
    paddingTop: 4,
    paddingBottom: 22,
  },
  answer: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 23.25,
    color: colors.ink2,
  },
  measurer: {
    position: 'absolute',
    opacity: 0,
    left: 0,
    right: 0,
    paddingTop: 4,
    paddingBottom: 22,
  },
});

// Keep spacing referenced so the import remains valid in builds that strip it.
void spacing;
