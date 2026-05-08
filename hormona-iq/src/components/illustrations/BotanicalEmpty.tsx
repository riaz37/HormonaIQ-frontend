// BotanicalEmpty — botanical geometric illustrations for empty states and Ora cards.
// Variants: SeedSprout, FloatingOrbs, HorizonWave, OraCardAccent.
// All use the Morning Garden palette. Not AI-generated — hand-crafted SVG paths.

import type { ReactElement } from 'react';
import Svg, { Circle, Ellipse, Path } from 'react-native-svg';
import { colors } from '../../constants/tokens';

// ─── SeedSprout ─────────────────────────────────────────────────────────────
// A seed cracking open with two emerging leaf lobes — waiting to grow.
// Used for: Insights gate card (2-cycle data requirement not met).

export function SeedSproutSvg({ size = 72 }: { size?: number }): ReactElement {
  const scale = size / 72;
  return (
    <Svg width={size} height={size} viewBox="0 0 72 72">
      {/* Seed body — rounded oval at base */}
      <Ellipse
        cx={36}
        cy={56}
        rx={14}
        ry={9}
        fill={colors.eucalyptus}
        opacity={0.22}
      />
      <Ellipse
        cx={36}
        cy={55}
        rx={10}
        ry={6.5}
        fill={colors.eucalyptus}
        opacity={0.38}
      />

      {/* Stem — vertical rise from seed */}
      <Path
        d="M 36 50 Q 36 38 36 22"
        stroke={colors.eucalyptus}
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
        opacity={0.7}
      />

      {/* Left leaf lobe — tilts toward 10 o'clock */}
      <Path
        d={[
          'M 36 38',
          'Q 28 35 24 28',
          'Q 22 22 26 20',
          'Q 32 18 36 28',
          'Z',
        ].join(' ')}
        fill={colors.sage}
        opacity={0.65}
      />

      {/* Right leaf lobe — tilts toward 2 o'clock */}
      <Path
        d={[
          'M 36 32',
          'Q 42 30 46 24',
          'Q 49 18 46 16',
          'Q 40 14 36 24',
          'Z',
        ].join(' ')}
        fill={colors.eucalyptus}
        opacity={0.45}
      />

      {/* Tiny apex bud — where the two lobes meet */}
      <Circle
        cx={36}
        cy={22}
        r={2.5}
        fill={colors.eucalyptusDeep}
        opacity={0.35}
      />
    </Svg>
  );
}

// ─── FloatingOrbs ───────────────────────────────────────────────────────────
// Asymmetric cluster of botanical circles — patterns waiting to emerge.
// Used for: Insights no entries, Tools screen.

export function FloatingOrbsSvg({ size = 80 }: { size?: number }): ReactElement {
  return (
    <Svg width={size} height={Math.round(size * 0.7)} viewBox="0 0 80 56">
      {/* Large background orb */}
      <Circle cx={28} cy={30} r={20} fill={colors.mintMist} opacity={0.7} />

      {/* Medium orb — eucalyptus, overlapping */}
      <Circle cx={46} cy={22} r={13} fill={colors.sage} opacity={0.5} />

      {/* Small orb — butter accent, upper right */}
      <Circle cx={62} cy={36} r={8} fill={colors.butter} opacity={0.55} />

      {/* Tiny orb — eucalyptusDeep, lower left */}
      <Circle cx={14} cy={44} r={5} fill={colors.eucalyptus} opacity={0.28} />

      {/* Seed accent at center overlap */}
      <Ellipse
        cx={36}
        cy={28}
        rx={4}
        ry={6}
        fill={colors.eucalyptusDeep}
        opacity={0.18}
      />
    </Svg>
  );
}

// ─── HorizonWave ─────────────────────────────────────────────────────────────
// A gentle sine wave with data-point dots — log data to fill the chart.
// Used for: DRSP chart empty state, Home day 0.

export function HorizonWaveSvg({ size = 100 }: { size?: number }): ReactElement {
  const h = Math.round(size * 0.42);
  return (
    <Svg width={size} height={h} viewBox="0 0 100 42">
      {/* Wave baseline fill */}
      <Path
        d="M 0 28 Q 12 14 25 28 Q 38 42 50 28 Q 62 14 75 28 Q 88 42 100 28 L 100 42 L 0 42 Z"
        fill={colors.mintMist}
        opacity={0.5}
      />

      {/* Wave stroke line */}
      <Path
        d="M 0 28 Q 12 14 25 28 Q 38 42 50 28 Q 62 14 75 28 Q 88 42 100 28"
        stroke={colors.eucalyptus}
        strokeWidth={1.5}
        strokeLinecap="round"
        fill="none"
        opacity={0.55}
      />

      {/* Data point dots at wave peaks */}
      <Circle cx={12} cy={20} r={2.5} fill={colors.eucalyptus} opacity={0.4} />
      <Circle cx={50} cy={20} r={2.5} fill={colors.eucalyptus} opacity={0.4} />
      <Circle cx={88} cy={20} r={2.5} fill={colors.eucalyptus} opacity={0.4} />

      {/* Trough dots — lighter */}
      <Circle cx={25} cy={28} r={1.5} fill={colors.sage} opacity={0.35} />
      <Circle cx={75} cy={28} r={1.5} fill={colors.sage} opacity={0.35} />
    </Svg>
  );
}

// ─── OraCardAccent ───────────────────────────────────────────────────────────
// Decorative botanical corner texture for Ora message cards.
// Position absolutely in the top-right corner.
// Creates a signature boundary that separates Ora's voice from regular content.

export function OraCardAccentSvg({ size = 56 }: { size?: number }): ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 56 56">
      {/* Large background orb — anchors top-right corner */}
      <Circle cx={42} cy={14} r={22} fill={colors.eucalyptus} opacity={0.1} />

      {/* Medium orb — overlapping, creates depth */}
      <Circle cx={50} cy={26} r={14} fill={colors.sage} opacity={0.14} />

      {/* Seed mark — vertical oval at the focal point */}
      <Ellipse
        cx={38}
        cy={18}
        rx={3}
        ry={5}
        fill={colors.eucalyptusDeep}
        opacity={0.2}
      />

      {/* Tiny dot — echo of OraMarkSvg interior accent */}
      <Circle cx={44} cy={10} r={2} fill={colors.eucalyptus} opacity={0.25} />
    </Svg>
  );
}
