// DrspChart — DRSP symptom visualization section.
// Contains the SVG bar chart (DRSPChartSvg), phase legend, sub-tabs
// (Severity / Mood / Brain fog), and the stat tile row.
// T-17 sub-tabs, T-57 chart.

import { useState } from 'react';
import type { ReactElement } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, {
  Circle,
  G,
  Line,
  Rect,
  Text as SvgText,
} from 'react-native-svg';

import { cards, typography } from '../../constants/styles';
import { colors, fonts, phase, radius, spacing } from '../../constants/tokens';
import { SectionCard } from '../../components/ui/SectionCard';
import type { ChartDataPoint } from './types';

// ─────────────────────────────────────────────
// Phase colour tokens
// ─────────────────────────────────────────────

const PHASE_COLORS_FILL: Record<string, string> = {
  menstrual: colors.rose,
  follicular: colors.sageLight,
  ovulatory: colors.butter,
  luteal: colors.coral,
  lutealDeep: '#C97962',
};

const PHASE_LEGEND_ITEMS: Array<{ k: string; n: string; color: string }> = [
  { k: 'F', n: 'Follicular', color: colors.sageLight },
  { k: 'O', n: 'Ovulatory', color: colors.butter },
  { k: 'Lm', n: 'Early luteal', color: colors.coral },
  { k: 'Ls', n: 'Late luteal', color: phase.lutealDeep },
  { k: 'M', n: 'Menstrual', color: colors.rose },
];

// ─────────────────────────────────────────────
// DRSPChartSvg — react-native-svg bar chart
// ─────────────────────────────────────────────

interface DRSPChartSvgProps {
  data: ChartDataPoint[];
  cycleLen: number;
  mono?: boolean;
  height?: number;
}

function DRSPChartSvg({
  data,
  cycleLen = 28,
  mono = false,
  height = 200,
}: DRSPChartSvgProps): ReactElement {
  const W = 340;
  const H = height;
  const pad = { l: 28, r: 12, t: 18, b: 26 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const barW = Math.max((innerW / cycleLen) - 2, 4);

  const yFor = (s: number): number => pad.t + innerH - (s / 6) * innerH;
  const xFor = (d: number): number => pad.l + ((d - 1) / cycleLen) * innerW;

  const sevDotColor = (s: number): string => {
    if (mono) return '#3A4A3F';
    if (s <= 2) return colors.severityMild;
    if (s <= 4) return colors.severityMod;
    return colors.severitySevere;
  };

  const barFill = mono ? '#222' : colors.ink;

  const fEnd = Math.round(cycleLen * 0.45);
  const oEnd = Math.round(cycleLen * 0.55);
  const lmEnd = Math.round(cycleLen * 0.78);

  const gridLines = [1, 2, 3, 4, 5, 6];
  const dayLabels = [1, 7, 14, 21, 28].filter((n) => n <= cycleLen);

  const vertGridDays: number[] = [];
  for (let n = 7; n <= cycleLen; n += 7) {
    vertGridDays.push(n);
  }

  return (
    <Svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'flex' }}>
      {/* Phase band backgrounds */}
      {!mono && (
        <G opacity={0.18}>
          <Rect
            x={xFor(1)}
            y={pad.t}
            width={xFor(6) - xFor(1)}
            height={innerH}
            fill={PHASE_COLORS_FILL.menstrual}
            rx={4}
          />
          <Rect
            x={xFor(6)}
            y={pad.t}
            width={xFor(fEnd + 1) - xFor(6)}
            height={innerH}
            fill={PHASE_COLORS_FILL.follicular}
            rx={4}
          />
          <Rect
            x={xFor(fEnd + 1)}
            y={pad.t}
            width={xFor(oEnd + 1) - xFor(fEnd + 1)}
            height={innerH}
            fill={PHASE_COLORS_FILL.ovulatory}
            rx={4}
          />
          <Rect
            x={xFor(oEnd + 1)}
            y={pad.t}
            width={xFor(lmEnd + 1) - xFor(oEnd + 1)}
            height={innerH}
            fill={PHASE_COLORS_FILL.luteal}
            rx={4}
          />
          <Rect
            x={xFor(lmEnd + 1)}
            y={pad.t}
            width={
              xFor(Math.max(cycleLen - 4, lmEnd + 2)) - xFor(lmEnd + 1)
            }
            height={innerH}
            fill={PHASE_COLORS_FILL.lutealDeep}
            rx={4}
          />
          {cycleLen > 5 && (
            <Rect
              x={xFor(Math.max(cycleLen - 4, lmEnd + 2))}
              y={pad.t}
              width={
                xFor(cycleLen + 1) -
                xFor(Math.max(cycleLen - 4, lmEnd + 2))
              }
              height={innerH}
              fill={PHASE_COLORS_FILL.menstrual}
              rx={4}
            />
          )}
        </G>
      )}

      {/* Horizontal severity gridlines + Y-axis labels */}
      {gridLines.map((s) => (
        <G key={`grid-h-${s}`}>
          <Line
            x1={pad.l}
            x2={W - pad.r}
            y1={yFor(s)}
            y2={yFor(s)}
            stroke={mono ? '#ddd' : 'rgba(60,95,75,0.10)'}
            strokeWidth={0.5}
            strokeDasharray={s % 2 ? undefined : '2 3'}
          />
          <SvgText
            x={pad.l - 6}
            y={yFor(s) + 3}
            textAnchor="end"
            fontFamily={fonts.mono}
            fontSize={10}
            fill={mono ? '#444' : colors.ink2}
          >
            {s}
          </SvgText>
        </G>
      ))}

      {/* Vertical grid every 7 days */}
      {!mono &&
        vertGridDays.map((n) => (
          <Line
            key={`grid-v-${n}`}
            x1={xFor(n)}
            x2={xFor(n)}
            y1={pad.t}
            y2={pad.t + innerH}
            stroke="rgba(60,95,75,0.08)"
            strokeWidth={0.6}
          />
        ))}

      {/* Bars + severity dots */}
      {data.map((d) => {
        const barHeight = pad.t + innerH - yFor(d.score);
        const bx = xFor(d.day) + 1;
        const by = yFor(d.score);
        const dotY = Math.max(by - 4, pad.t - 4);
        return (
          <G key={`bar-${d.day}`}>
            <Rect
              x={bx}
              y={by}
              width={barW}
              height={barHeight}
              fill={barFill}
              opacity={d.estimated ? 0.35 : 0.85}
              rx={3}
            />
            {!mono && d.score >= 1 && (
              <Circle
                cx={bx + barW / 2}
                cy={dotY}
                r={2.4}
                fill={sevDotColor(d.score)}
                opacity={0.9}
              />
            )}
          </G>
        );
      })}

      {/* X-axis day labels */}
      {dayLabels.map((n) => (
        <SvgText
          key={`day-label-${n}`}
          x={xFor(n) + 2}
          y={H - 6}
          fontFamily={fonts.mono}
          fontSize={10}
          fill={mono ? '#444' : colors.ink2}
        >
          {n}
        </SvgText>
      ))}
    </Svg>
  );
}

// ─────────────────────────────────────────────
// PhaseLegend
// ─────────────────────────────────────────────

function PhaseLegend(): ReactElement {
  return (
    <View style={s.legendRow}>
      {PHASE_LEGEND_ITEMS.map((it) => (
        <View key={it.k} style={s.legendItem}>
          <View style={[s.legendDot, { backgroundColor: it.color }]} />
          <Text style={s.legendLabel}>{it.n}</Text>
        </View>
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────
// DrspChart — public component
// ─────────────────────────────────────────────

export interface DrspChartProps {
  data: ChartDataPoint[];
  cycleLen: number;
  lAvg: string;
  fAvg: string;
  completedCycles: number;
  reduceMotion: boolean;
  /** When true, renders the mono/print variant used in the report preview. */
  mono?: boolean;
  /** Override height (default 210). */
  height?: number;
}

export function DrspChart({
  data,
  cycleLen,
  lAvg,
  fAvg,
  completedCycles,
  mono = false,
  height = 210,
}: DrspChartProps): ReactElement {
  const [tab, setTab] = useState<'severity' | 'mood' | 'fog'>('severity');

  const tabs = [
    { k: 'severity' as const, l: 'Severity' },
    { k: 'mood' as const, l: 'Mood' },
    { k: 'fog' as const, l: 'Brain fog' },
  ] as const;

  if (mono) {
    return (
      <DRSPChartSvg
        data={data}
        cycleLen={cycleLen}
        mono
        height={height}
      />
    );
  }

  return (
    <SectionCard style={{ marginBottom: 16 }}>
      {/* T-17 sub-tabs */}
      <View style={s.tabPill}>
        {tabs.map((t) => (
          <Pressable
            key={t.k}
            style={[s.tabPillBtn, tab === t.k && s.tabPillBtnActive]}
            onPress={() => setTab(t.k)}
            accessibilityRole="tab"
            accessibilityLabel={`Switch to ${t.l} tab`}
            accessibilityState={{ selected: tab === t.k }}
          >
            <Text
              style={[
                s.tabPillLabel,
                tab === t.k && s.tabPillLabelActive,
              ]}
            >
              {t.l}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Severity tab */}
      {tab === 'severity' && (
        <>
          <View style={{ marginBottom: 8 }}>
            <DRSPChartSvg data={data} cycleLen={cycleLen} height={height} />
          </View>
          <View style={{ marginBottom: spacing.md, alignItems: 'center' }}>
            <PhaseLegend />
          </View>
        </>
      )}

      {/* Mood tab */}
      {tab === 'mood' && (
        <View style={[cards.cardWarm, { padding: spacing.md, marginBottom: 12 }]}>
          <Text style={[typography.caption, { marginBottom: 10 }]}>
            Mood distribution by cycle phase
          </Text>
          <Text style={[typography.caption, { fontSize: 11 }]}>
            Aggregated across your logged cycles.
          </Text>
        </View>
      )}

      {/* Brain fog tab */}
      {tab === 'fog' && (
        <View style={{ marginBottom: 12 }}>
          <DRSPChartSvg data={data} cycleLen={cycleLen} height={height} />
          <Text style={[typography.caption, { marginTop: 6 }]}>
            Concentration (DRSP item) trend across your logged days.
          </Text>
        </View>
      )}

      {/* Stat tiles: Luteal avg / Follicular avg / Cycles */}
      <View style={s.statRow}>
        <View style={[cards.cardWarm, s.statTile]}>
          <Text style={typography.caption}>Luteal avg</Text>
          <Text
            style={[
              typography.data,
              { fontSize: 24, color: colors.severitySevere, fontFamily: fonts.sansMedium },
            ]}
          >
            {lAvg}
          </Text>
        </View>
        <View style={[cards.cardWarm, s.statTile]}>
          <Text style={typography.caption}>Follicular avg</Text>
          <Text
            style={[
              typography.data,
              { fontSize: 24, color: colors.severityMild, fontFamily: fonts.sansMedium },
            ]}
          >
            {fAvg}
          </Text>
        </View>
        <View style={[cards.cardWarm, s.statTile]}>
          <Text style={typography.caption}>Cycles</Text>
          <Text
            style={[
              typography.data,
              { fontSize: 24, color: colors.ink, fontFamily: fonts.sansMedium },
            ]}
          >
            {completedCycles}
          </Text>
        </View>
      </View>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const s = StyleSheet.create({
  tabPill: {
    flexDirection: 'row',
    gap: 4,
    padding: 4,
    backgroundColor: colors.mintPale,
    borderRadius: radius.pill,
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  tabPillBtn: {
    paddingVertical: 8,
    paddingHorizontal: spacing.md,
    minHeight: 44,
    borderRadius: radius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabPillBtnActive: {
    backgroundColor: colors.eucalyptus,
  },
  tabPillLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.ink2,
  },
  tabPillLabelActive: {
    color: colors.paper,
  },
  statRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: 4,
  },
  statTile: {
    flex: 1,
    padding: spacing.md,
    alignItems: 'flex-start',
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink2,
  },
});
