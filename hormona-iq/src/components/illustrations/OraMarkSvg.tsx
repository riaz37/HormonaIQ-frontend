// OraMarkSvg — Ora's botanical identity mark.
// Form: a split seed-pod viewed from above — two rounded lobes emerging from a
// shared stem base, creating visual tension and clear botanical intent.
// Designed as precise SVG paths (not AI-generated) for crispness at 16–40dp.

import { useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import { Animated } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { colors, oraTokens, duration } from '../../constants/tokens';

export type OraState = 'listening' | 'thinking' | 'insight' | 'unavailable';

interface OraMarkSvgProps {
  size?: number;
  state?: OraState;
  color?: string;
}

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

export function OraMarkSvg({
  size = 32,
  state = 'listening',
  color = colors.eucalyptus,
}: OraMarkSvgProps): ReactElement {
  const opacity = useRef(new Animated.Value(oraTokens.breatheMin)).current;

  useEffect(() => {
    if (state === 'unavailable') {
      Animated.timing(opacity, {
        toValue: 0.22,
        duration: duration.standard,
        useNativeDriver: true,
      }).start();
      return;
    }

    const breatheDuration =
      state === 'thinking'
        ? oraTokens.breatheDuration * 0.55
        : oraTokens.breatheDuration;

    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: oraTokens.breatheMax,
          duration: breatheDuration / 2,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: oraTokens.breatheMin,
          duration: breatheDuration / 2,
          useNativeDriver: true,
        }),
      ]),
    );
    anim.start();
    return () => anim.stop();
  }, [opacity, state]);

  // ─── The Mark ───────────────────────────────────────────────────────────────
  // Two rounded lobes meeting at a shared narrow stem at the base.
  // Left lobe is slightly taller (12 o'clock), right lobe tilts at 2 o'clock.
  // Together they read as a split seed pod — distinctly botanical, not a letter.
  // Viewbox 0 0 32 32. Designed to read at 16dp–40dp.

  const mainColor = state === 'unavailable' ? `${color}33` : color;

  // Inner light accent — a smaller oval centered within the mark, low opacity.
  // Creates a sense of depth (the seed interior) without being a second shape.
  const accentOpacity = state === 'insight' ? 0.45 : 0.18;

  return (
    <AnimatedSvg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      style={{ opacity }}
    >
      {/* Left lobe — taller, points toward 11 o'clock */}
      <Path
        d={[
          'M 13 28',           // stem base left
          'C 8 28 4 24 4 19',  // left wall down
          'C 4 13 7 8 11 6',   // left wall up
          'C 13 5 15 5 16 6',  // apex
          'C 17 7 17 9 16 11', // shoulder into stem
          'C 15 13 14 15 14 18', // right wall of left lobe
          'C 14 23 14 27 13 28 Z', // back to base
        ].join(' ')}
        fill={mainColor}
      />

      {/* Right lobe — slightly shorter, tilts toward 1 o'clock */}
      <Path
        d={[
          'M 19 28',            // stem base right
          'C 18 27 18 23 18 18', // left wall of right lobe
          'C 18 15 17 13 16 11', // shoulder from stem
          'C 15 9 15 7 16 6',    // apex (shared with left)
          'C 17 5 19 5 21 6',    // right apex
          'C 25 8 28 13 28 19',  // right wall up
          'C 28 24 24 28 19 28 Z', // back to base
        ].join(' ')}
        fill={mainColor}
        opacity={0.82}          // slight translucency gives depth between lobes
      />

      {/* Stem — small rounded rectangle where both lobes meet at the base */}
      <Path
        d="M 13 27 C 13 29 14 30.5 16 30.5 C 18 30.5 19 29 19 27 C 19 26 18 25.5 16 25.5 C 14 25.5 13 26 13 27 Z"
        fill={mainColor}
      />

      {/* Inner accent — seed interior, only shows in insight state clearly */}
      <Circle
        cx={16}
        cy={16}
        r={3.5}
        fill={colors.cream}
        opacity={accentOpacity}
      />
    </AnimatedSvg>
  );
}
