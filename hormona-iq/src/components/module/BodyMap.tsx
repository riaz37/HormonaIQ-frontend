// BodyMap — tappable female torso outline with severity-coloured pain zones.
// Port of the body-map SVG in design-handoff/08-implementation-code/src/modules-4-endo.jsx
// (M.endoBodyMap), simplified to a single front-view zone set with 0–3 severity.

import React, { type ReactElement, useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

import { typography, cards } from '../../constants/styles';
import { colors, fonts, spacing } from '../../constants/tokens';
import { severityColorForLevel, type Severity0to3 } from './ModuleUI';

// ─────────────────────────────────────────────
// Zone definitions — coordinates in a 0–200 × 0–400 viewBox (matches source).
// ─────────────────────────────────────────────

export interface BodyMapZone {
  id: string;
  label: string;
  x: number;
  y: number;
  r: number;
}

export const DEFAULT_BODY_MAP_ZONES: BodyMapZone[] = [
  { id: 'lower_central_ant', label: 'Lower central abdomen', x: 100, y: 200, r: 22 },
  { id: 'lower_left_ant', label: 'Lower left abdomen', x: 75, y: 210, r: 18 },
  { id: 'lower_right_ant', label: 'Lower right abdomen', x: 125, y: 210, r: 18 },
  { id: 'bladder_suprapubic', label: 'Bladder / suprapubic', x: 100, y: 240, r: 16 },
  { id: 'inguinal_left', label: 'Inguinal / groin (L)', x: 78, y: 250, r: 14 },
  { id: 'inguinal_right', label: 'Inguinal / groin (R)', x: 122, y: 250, r: 14 },
  { id: 'right_shoulder', label: 'Right shoulder / diaphragm', x: 132, y: 110, r: 18 },
  { id: 'left_leg_upper', label: 'Left leg (upper)', x: 82, y: 295, r: 14 },
  { id: 'right_leg_upper', label: 'Right leg (upper)', x: 118, y: 295, r: 14 },
];

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export interface BodyMapProps {
  /** Map of zoneId → severity (0..3). Missing keys are treated as 0. */
  zones: Record<string, Severity0to3>;
  /** Called when a zone is tapped. */
  onZonePress: (zoneId: string) => void;
  /** Override the zone set. Defaults to the front-view torso zones. */
  zoneList?: BodyMapZone[];
  /** Currently active/selected zone id (drawn with a thicker outline). */
  activeZoneId?: string | null;
}

export function BodyMap({
  zones,
  onZonePress,
  zoneList,
  activeZoneId,
}: BodyMapProps): ReactElement {
  const list = zoneList ?? DEFAULT_BODY_MAP_ZONES;

  const renderedZones = useMemo(() => list.map((z) => {
    const sev: Severity0to3 = zones[z.id] ?? 0;
    const fill = severityColorForLevel(sev);
    const isActive = activeZoneId === z.id;
    const a11yLabel = sev > 0
      ? `${z.label}, severity ${sev} of 3`
      : `${z.label}, not yet logged`;

    return (
      <G
        key={z.id}
        onPress={() => onZonePress(z.id)}
        accessibilityRole="button"
        accessibilityLabel={a11yLabel}
        accessibilityState={{ selected: isActive }}
      >
        {/* Hit-test halo — invisible, +16pt larger than visible zone for better tap accuracy */}
        <Circle
          cx={z.x}
          cy={z.y}
          r={z.r + 16}
          fill="rgba(0,0,0,0)"
        />
        <Circle
          cx={z.x}
          cy={z.y}
          r={z.r}
          fill={fill}
          fillOpacity={sev === 0 ? 0.6 : 0.85}
          stroke={isActive ? colors.eucalyptusDeep : colors.borderStrong}
          strokeWidth={isActive ? 2.5 : 1}
        />
      </G>
    );
  }), [list, zones, activeZoneId, onZonePress]);

  return (
    <View style={[cards.cardWarm, styles.wrap]}>
      <Svg viewBox="0 0 200 400" width="100%" height={320}>
        {/* Head */}
        <Ellipse
          cx={100}
          cy={60}
          rx={22}
          ry={26}
          fill={colors.mintMist}
          stroke={colors.borderStrong}
          strokeWidth={1}
        />
        {/* Neck */}
        <Rect
          x={92}
          y={82}
          width={16}
          height={10}
          fill={colors.paper}
          stroke={colors.borderStrong}
          strokeWidth={1}
        />
        {/* Torso silhouette */}
        <Path
          d="M 78 90 Q 100 84 122 90 L 138 130 L 145 200 L 138 270 L 130 320 L 122 380 L 110 380 L 105 320 L 100 280 L 95 320 L 90 380 L 78 380 L 70 320 L 62 270 L 55 200 L 62 130 Z"
          fill={colors.paper}
          stroke={colors.borderStrong}
          strokeWidth={1}
        />
        {renderedZones}
      </Svg>
      <View style={styles.legend} accessibilityLabel="Severity legend">
        <LegendDot level={1} label="Mild" />
        <LegendDot level={2} label="Moderate" />
        <LegendDot level={3} label="Severe" />
      </View>
    </View>
  );
}

function LegendDot({ level, label }: { level: Severity0to3; label: string }): ReactElement {
  return (
    <View
      style={styles.legendItem}
      accessibilityRole="image"
      accessibilityLabel={`${label} severity indicator`}
    >
      <View
        style={[
          styles.legendSwatch,
          { backgroundColor: severityColorForLevel(level) },
        ]}
      />
      <Text style={styles.legendLabel}>{label}</Text>
    </View>
  );
}

// Ensure typography import is referenced (helps tree-shaking diagnostics).
void typography;

const styles = StyleSheet.create({
  wrap: {
    padding: 14,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendSwatch: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendLabel: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink2,
  },
});
