// ─────────────────────────────────────────────────────────────────────────────
// PMDD feature — shared inline UI primitives
// (module-ui.jsx equivalents, React Native only)
// ─────────────────────────────────────────────────────────────────────────────

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import {
  cards,
  components as cmp,
  typography,
} from '../../constants/styles';
import { colors, fonts, radius } from '../../constants/tokens';
import type { EvidenceLevel } from './types';

// ─────────────────────────────────────────────
// MHeader
// ─────────────────────────────────────────────

interface MHeaderProps {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  sub?: string;
}

export function MHeader({ eyebrow, title, titleAccent, sub }: MHeaderProps) {
  return (
    <View style={mu.headerWrap}>
      <Text style={typography.eyebrow}>{eyebrow}</Text>
      <Text style={[typography.displaySm, mu.headerTitle]}>
        {title}
        {!!titleAccent && (
          <Text style={{ color: colors.eucalyptus }}>{titleAccent}</Text>
        )}
      </Text>
      {!!sub && <Text style={[typography.body, mu.headerSub]}>{sub}</Text>}
    </View>
  );
}

// ─────────────────────────────────────────────
// MSection
// ─────────────────────────────────────────────

interface MSectionProps {
  title: string;
  children: React.ReactNode;
}

export function MSection({ title, children }: MSectionProps) {
  return (
    <View style={mu.sectionWrap}>
      <Text style={[typography.eyebrow, mu.sectionTitle]}>{title}</Text>
      {children}
    </View>
  );
}

// ─────────────────────────────────────────────
// Stat
// ─────────────────────────────────────────────

interface StatProps {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}

export function Stat({ label, value, sub, color }: StatProps) {
  return (
    <View style={[cards.card, mu.statCard]}>
      <Text style={[typography.caption, { marginBottom: 4 }]}>{label}</Text>
      <Text style={[mu.statValue, color ? { color } : undefined]}>{value}</Text>
      {!!sub && (
        <Text style={[typography.caption, mu.statSub]}>{sub}</Text>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────
// SeverityScale
// ─────────────────────────────────────────────

interface SeverityScaleProps {
  value: number;
  onChange: (v: number) => void;
  max?: number;
  accessibilityHint?: string;
}

export function SeverityScale({
  value,
  onChange,
  max = 6,
  accessibilityHint,
}: SeverityScaleProps) {
  return (
    <View style={mu.scaleRow}>
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => {
        const active = value === n;
        return (
          <TouchableOpacity
            key={n}
            style={[cmp.scaleBtn, active && cmp.scaleBtnActive]}
            onPress={() => onChange(n)}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel={`Severity ${n} of ${max}`}
            accessibilityHint={accessibilityHint}
            accessibilityState={{ selected: active }}
          >
            <Text
              style={[
                cmp.scaleBtnLabel,
                active && cmp.scaleBtnLabelActive,
              ]}
            >
              {n}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─────────────────────────────────────────────
// EvidenceBar
// ─────────────────────────────────────────────

interface EvidenceBarProps {
  level: EvidenceLevel;
}

export function EvidenceBar({ level }: EvidenceBarProps) {
  const levelMap: Record<EvidenceLevel, number> = {
    Strong: 4,
    Moderate: 3,
    Limited: 2,
    Unsupported: 1,
  };
  const colorMap: Record<EvidenceLevel, string> = {
    Strong: colors.eucalyptus,
    Moderate: colors.severityMod,
    Limited: colors.coral,
    Unsupported: colors.inkDisabled,
  };
  const filled = levelMap[level];
  const clr = colorMap[level];
  return (
    <View style={mu.evidenceRow}>
      <View style={mu.evidenceDots}>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={[
              mu.evidenceDot,
              { backgroundColor: i <= filled ? clr : colors.mintMist },
            ]}
          />
        ))}
      </View>
      <Text style={[mu.evidenceLabel, { color: clr }]}>{level}</Text>
    </View>
  );
}

// ─────────────────────────────────────────────
// Chip
// ─────────────────────────────────────────────

interface ChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  accessibilityLabel: string;
}

export function Chip({ label, active, onPress, accessibilityLabel }: ChipProps) {
  return (
    <TouchableOpacity
      style={[cmp.chip, active && cmp.chipActive]}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ selected: active }}
    >
      <Text style={[cmp.chipLabel, active && cmp.chipLabelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

// ─────────────────────────────────────────────
// InlineProgressBar
// ─────────────────────────────────────────────

interface ProgressBarProps {
  pct: number;
  color?: string;
  height?: number;
}

export function InlineProgressBar({ pct, color, height = 4 }: ProgressBarProps) {
  return (
    <View style={[mu.progressTrack, { height }]}>
      <View
        style={[
          mu.progressFill,
          {
            width: `${Math.min(100, Math.max(0, pct))}%` as `${number}%`,
            backgroundColor: color ?? colors.eucalyptus,
            height,
          },
        ]}
      />
    </View>
  );
}

// ─────────────────────────────────────────────
// DRSPBarChart
// ─────────────────────────────────────────────

interface DRSPBarChartProps {
  data: Array<{ day: number; score: number }>;
}

export function DRSPBarChart({ data }: DRSPBarChartProps) {
  const maxScore = 6;
  return (
    <View style={mu.drspChart}>
      {data.map((d) => (
        <View key={d.day} style={mu.drspBarWrap}>
          <View
            style={[
              mu.drspBar,
              {
                height: `${Math.round((d.score / maxScore) * 100)}%` as `${number}%`,
              },
            ]}
          />
        </View>
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────
// Shared styles (mu)
// ─────────────────────────────────────────────

export const mu = StyleSheet.create({
  headerWrap: {
    marginBottom: 16,
  },
  headerTitle: {
    marginTop: 6,
    marginBottom: 4,
  },
  headerSub: {
    color: colors.ink2,
    fontSize: 14,
  },
  sectionWrap: {
    marginBottom: 18,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  statCard: {
    padding: 14,
    flex: 1,
  },
  statValue: {
    fontFamily: fonts.mono,
    fontSize: 22,
    color: colors.ink,
  },
  statSub: {
    fontSize: 11,
    marginTop: 2,
  },
  scaleRow: {
    flexDirection: 'row',
    gap: 6,
  },
  evidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  evidenceDots: {
    flexDirection: 'row',
    gap: 2,
  },
  evidenceDot: {
    width: 10,
    height: 4,
    borderRadius: 2,
  },
  evidenceLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
  },
  progressTrack: {
    backgroundColor: colors.mintMist,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: radius.pill,
  },
  drspChart: {
    flexDirection: 'row',
    height: 80,
    alignItems: 'flex-end',
    gap: 1,
    backgroundColor: colors.mintMist,
    borderRadius: radius.sm,
    padding: 4,
    marginTop: 8,
  },
  drspBarWrap: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  drspBar: {
    backgroundColor: colors.ink,
    borderRadius: 2,
    opacity: 0.75,
    width: '100%',
    minHeight: 2,
  },
});
