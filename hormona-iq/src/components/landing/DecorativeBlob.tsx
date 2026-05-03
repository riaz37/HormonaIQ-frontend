import React, { useEffect } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  useReducedMotion,
} from 'react-native-reanimated';

interface DecorativeBlobProps {
  size: number;
  color: string;
  opacity?: number;
  blurRadius?: number;
  style?: ViewStyle;
}

/**
 * Decorative ambient blur circle. Ports the CSS `.drift` animation:
 *   translate(8px, -6px) rotate(2deg), 7s ease-in-out infinite.
 *
 * On web the blur is achieved with `filter: blur(...)` (passed through by
 * react-native-web). On native we fall back to a soft, low-opacity disc —
 * decorative only, never load-bearing.
 */
export function DecorativeBlob({
  size,
  color,
  opacity = 0.6,
  blurRadius = 60,
  style,
}: DecorativeBlobProps) {
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      progress.value = 0;
      return;
    }
    progress.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 3500, easing: Easing.inOut(Easing.ease) }),
      ),
      -1,
      false,
    );
  }, [reduceMotion, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      transform: [
        { translateX: p * 8 },
        { translateY: p * -6 },
        { rotate: `${p * 2}deg` },
      ],
    };
  });

  const baseStyle: ViewStyle = {
    position: 'absolute',
    width: size,
    height: size,
    borderRadius: size / 2,
    backgroundColor: color,
    opacity,
    // react-native-web passes `filter` through to the DOM; native ignores it.
    ...(({ filter: `blur(${blurRadius}px)` } as unknown) as ViewStyle),
  };

  return (
    <Animated.View
      pointerEvents="none"
      style={[baseStyle, style, animatedStyle]}
    >
      <View style={StyleSheet.absoluteFill} />
    </Animated.View>
  );
}
