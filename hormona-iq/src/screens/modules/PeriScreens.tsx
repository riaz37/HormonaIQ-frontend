// Perimenopause module screens — informed by design-handoff/08-implementation-code/src/modules-6-peri.jsx.
// Phase 2: rich, faithful UI using only Phase-1 primitives. Local state only.

import React, { type ReactElement, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Line, Polygon } from 'react-native-svg';

import {
  Checklist,
  EvidenceBar,
  MSection,
  NRS,
  Severity,
  Spark,
  Stat,
  ToggleRow,
  TrackerLog,
  type TrackerLogEntry,
} from '../../components/module';
import { cards, typography } from '../../constants/styles';
import { colors, fonts, radius, spacing } from '../../constants/tokens';

import { ModuleScaffold } from './ModuleScaffold';

// ─────────────────────────────────────────────
// Symptom Radar — six-axis weekly view
// ─────────────────────────────────────────────

interface RadarAxis {
  key: string;
  label: string;
  short: string;
}

const RADAR_AXES: readonly RadarAxis[] = [
  { key: 'vasomotor', label: 'Vasomotor (hot flushes, sweats)', short: 'Vasomotor' },
  { key: 'sleep', label: 'Sleep', short: 'Sleep' },
  { key: 'mood', label: 'Mood', short: 'Mood' },
  { key: 'cognition', label: 'Cognition', short: 'Cognition' },
  { key: 'joint', label: 'Joint / muscle', short: 'Joint' },
  { key: 'genitourinary', label: 'Genitourinary', short: 'GU' },
];

export function PeriSymptomRadarScreen({ onBack }: { onBack: () => void }): ReactElement {
  const [scores, setScores] = useState<Record<string, number | null>>({});

  const setScore = (key: string, value: number): void => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  const total = useMemo(() => {
    const vals = Object.values(scores).filter(
      (n): n is number => typeof n === 'number',
    );
    if (vals.length === 0) return 0;
    return Number((vals.reduce((s, n) => s + n, 0) / vals.length).toFixed(1));
  }, [scores]);

  return (
    <ModuleScaffold
      eyebrow="SYMPTOM RADAR"
      title="Six axes. One weekly view."
      subtitle="Catch where the load actually sits before it shifts."
      onBack={onBack}
    >
      <View style={[cards.cardWarm, styles.radarCard]}>
        <RadarChart axes={RADAR_AXES} values={scores} />
        <View style={styles.radarLegend}>
          <Text style={styles.radarTotalLabel}>Weekly load</Text>
          <Text style={styles.radarTotalValue}>{total > 0 ? total.toFixed(1) : '—'}/10</Text>
        </View>
      </View>

      <MSection title="THIS WEEK · 0–10 EACH AXIS">
        <View style={styles.axesList}>
          {RADAR_AXES.map((a) => (
            <View key={a.key} style={[cards.cardPaper, styles.axisCard]}>
              <Text style={styles.axisLabel}>{a.label}</Text>
              <NRS value={scores[a.key] ?? null} onChange={(n) => setScore(a.key, n)} />
            </View>
          ))}
        </View>
      </MSection>

      <MSection title="WEEKLY HISTORY">
        <View style={[cards.cardWarm, styles.sparkCard]}>
          <Spark
            data={[6.2, 5.8, 5.4, 5.0, 4.8, 4.6]}
            color={colors.eucalyptus}
          />
          <Text style={styles.helperText}>Six-week downward trend since starting HRT.</Text>
        </View>
      </MSection>
    </ModuleScaffold>
  );
}

// Hexagonal radar chart (six-axis). Pure SVG, no external chart lib.
interface RadarChartProps {
  axes: readonly RadarAxis[];
  values: Record<string, number | null>;
}

function RadarChart({ axes, values }: RadarChartProps): ReactElement {
  const W = 240;
  const cx = W / 2;
  const cy = W / 2;
  const r = W / 2 - 28;
  const max = 10;

  const points = axes.map((axis, i) => {
    const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
    const v = values[axis.key];
    const ratio = typeof v === 'number' ? v / max : 0;
    const x = cx + Math.cos(angle) * r * ratio;
    const y = cy + Math.sin(angle) * r * ratio;
    const labelX = cx + Math.cos(angle) * (r + 14);
    const labelY = cy + Math.sin(angle) * (r + 14);
    return { x, y, labelX, labelY, axis };
  });

  const polygonPoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  // Concentric guide rings (3 rings)
  const rings = [r * 0.33, r * 0.66, r];

  return (
    <View style={styles.radarSvgWrap}>
      <Svg width={W} height={W}>
        {rings.map((ringR, idx) => (
          <Circle
            key={idx}
            cx={cx}
            cy={cy}
            r={ringR}
            fill="none"
            stroke={colors.border}
            strokeWidth={1}
          />
        ))}
        {axes.map((axis, i) => {
          const angle = (Math.PI * 2 * i) / axes.length - Math.PI / 2;
          const x2 = cx + Math.cos(angle) * r;
          const y2 = cy + Math.sin(angle) * r;
          return (
            <Line
              key={axis.key}
              x1={cx}
              y1={cy}
              x2={x2}
              y2={y2}
              stroke={colors.border}
              strokeWidth={1}
            />
          );
        })}
        <Polygon
          points={polygonPoints}
          fill={colors.eucalyptus}
          fillOpacity={0.18}
          stroke={colors.eucalyptus}
          strokeWidth={1.75}
        />
      </Svg>
      <View style={styles.radarLabels} pointerEvents="none">
        {points.map((p) => (
          <Text
            key={p.axis.key}
            style={[
              styles.radarLabel,
              {
                left: p.labelX - 36,
                top: p.labelY - 8,
              },
            ]}
            numberOfLines={1}
          >
            {p.axis.short}
          </Text>
        ))}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────
// HRT Tracker
// ─────────────────────────────────────────────

const HRT_ADHERENCE = [
  { id: 'patch_gel', label: 'Estrogen patch / gel applied' },
  { id: 'oral_progestogen', label: 'Oral progestogen taken' },
  { id: 'vaginal_estrogen', label: 'Vaginal estrogen used' },
  { id: 'dose_missed', label: 'Dose missed' },
];

const HRT_SIDE_EFFECTS = [
  { id: 'breast_tender', label: 'Breast tenderness' },
  { id: 'headache', label: 'Headache' },
  { id: 'nausea', label: 'Nausea' },
  { id: 'spotting', label: 'Spotting / breakthrough bleeding' },
  { id: 'mood_change', label: 'Mood change' },
  { id: 'fluid_retention', label: 'Fluid retention' },
  { id: 'none', label: 'No side effects' },
];

export function PeriHrtScreen({ onBack }: { onBack: () => void }): ReactElement {
  const [adherence, setAdherence] = useState<string[]>([]);
  const [relief, setRelief] = useState<number | null>(null);
  const [sideEffects, setSideEffects] = useState<string[]>([]);
  const [entries, setEntries] = useState<TrackerLogEntry[]>([]);

  const onLog = (): void => {
    if (relief === null) return;
    const labels = HRT_SIDE_EFFECTS.filter((s) => sideEffects.includes(s.id))
      .map((s) => s.label)
      .join(' · ');
    setEntries((prev) => [
      {
        id: `hrt-${Date.now()}`,
        timestamp: new Date(),
        label: `Relief ${relief}/10`,
        detail: labels === '' ? 'No side effects logged' : labels,
      },
      ...prev,
    ]);
    setRelief(null);
    setSideEffects([]);
  };

  return (
    <ModuleScaffold
      eyebrow="HRT TRACKER"
      title="Adherence. Response. Side effects."
      subtitle="The data your prescriber needs to fine-tune your dose."
      onBack={onBack}
    >
      <View style={styles.statRow}>
        <Stat label="Weekly relief" value={relief !== null ? relief.toString() : '—'} sub="0–10 NRS" />
        <Stat label="12-wk avg" value="6.8" trend="up" sub="trend up" />
      </View>

      <MSection title="TODAY · ADHERENCE">
        <Checklist items={HRT_ADHERENCE} checked={adherence} onChange={setAdherence} />
      </MSection>

      <MSection title="SYMPTOM RELIEF · NRS 0–10">
        <NRS value={relief} onChange={setRelief} />
        <Text style={styles.helperText}>0 = no change, 10 = full relief.</Text>
      </MSection>

      <MSection title="SIDE EFFECTS THIS WEEK">
        <Checklist items={HRT_SIDE_EFFECTS} checked={sideEffects} onChange={setSideEffects} />
      </MSection>

      <View style={[cards.cardMint, styles.evidenceCard]}>
        <Text style={[typography.eyebrow, styles.evidenceEyebrow]}>EVIDENCE</Text>
        <Text style={styles.evidenceBody}>
          Modern transdermal estrogen + micronised progesterone has strong evidence for vasomotor symptom relief and a more favourable safety profile than older oral combinations.
        </Text>
        <EvidenceBar level="strong" />
      </View>

      <MSection title="RESPONSE LOG">
        <TrackerLog
          entries={entries}
          onAdd={onLog}
          addLabel={relief === null ? 'Set a relief score first' : 'Log this week'}
          emptyLabel="No weekly responses logged yet."
        />
      </MSection>
    </ModuleScaffold>
  );
}

// ─────────────────────────────────────────────
// Perimenopause Sleep
// ─────────────────────────────────────────────

const SLEEP_DISRUPTIONS = [
  { id: 'hot_flush', label: 'Hot flush / night sweats' },
  { id: 'bladder', label: 'Bladder waking' },
  { id: 'anxiety', label: 'Anxiety / racing thoughts' },
  { id: 'joint_pain', label: 'Joint pain' },
  { id: 'partner_snoring', label: 'Partner snoring' },
  { id: 'none', label: 'No disruptions' },
];

export function PeriSleepScreen({ onBack }: { onBack: () => void }): ReactElement {
  const [quality, setQuality] = useState<number | null>(null);
  const [disruptions, setDisruptions] = useState<string[]>([]);
  const [wakeCount, setWakeCount] = useState<number>(0);
  const [napTaken, setNapTaken] = useState(false);

  const trend = useMemo(() => [4, 5, 4, 6, 5, 6, 7, 6, 5, 7, 6, 7, 8, 7], []);

  return (
    <ModuleScaffold
      eyebrow="PERIMENOPAUSE SLEEP"
      title="The night before, decoded."
      subtitle="Vasomotor-aware sleep logging."
      onBack={onBack}
    >
      <View style={styles.statRow}>
        <Stat
          label="Last night"
          value={quality !== null ? quality.toString() : '—'}
          sub="0–10 NRS"
        />
        <Stat
          label="Wakes"
          value={wakeCount.toString()}
          sub="last night"
          trend={wakeCount > 2 ? 'down' : 'neutral'}
        />
      </View>

      <MSection title="SLEEP QUALITY LAST NIGHT · NRS 0–10">
        <NRS value={quality} onChange={setQuality} />
      </MSection>

      <MSection title="WAKE COUNT">
        <Severity value={wakeCount} onChange={setWakeCount} max={6} />
        <Text style={styles.helperText}>
          How many times did you wake during the night?
        </Text>
      </MSection>

      <MSection title="DISRUPTIONS">
        <Checklist
          items={SLEEP_DISRUPTIONS}
          checked={disruptions}
          onChange={setDisruptions}
        />
      </MSection>

      <ToggleRow
        label="Took a nap yesterday"
        checked={napTaken}
        onChange={setNapTaken}
        sub="Daytime naps over 30 minutes can fragment night sleep."
      />

      <MSection title="14-DAY SLEEP TREND">
        <View style={[cards.cardWarm, styles.sparkCard]}>
          <Spark data={trend} color={colors.eucalyptus} />
          <Text style={styles.helperText}>
            Steady improvement since adding evening progesterone.
          </Text>
        </View>
      </MSection>
    </ModuleScaffold>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
  statRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  helperText: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink3,
    marginTop: 8,
    lineHeight: 16,
  },
  sparkCard: {
    padding: 14,
  },

  // Radar
  radarCard: {
    padding: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  radarSvgWrap: {
    width: 240,
    height: 240,
    position: 'relative',
  },
  radarLabels: {
    position: 'absolute',
    inset: 0,
  },
  radarLabel: {
    position: 'absolute',
    width: 72,
    textAlign: 'center',
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.ink2,
  },
  radarLegend: {
    marginTop: spacing.sm,
    alignItems: 'center',
  },
  radarTotalLabel: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink3,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  radarTotalValue: {
    fontFamily: fonts.mono,
    fontSize: 24,
    color: colors.ink,
    marginTop: 2,
  },
  axesList: {
    gap: spacing.sm,
  },
  axisCard: {
    padding: 14,
  },
  axisLabel: {
    fontFamily: fonts.sansSemibold,
    fontSize: 13,
    color: colors.ink,
    marginBottom: spacing.sm,
  },

  // HRT
  evidenceCard: {
    padding: 16,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  evidenceEyebrow: {
    marginBottom: 4,
  },
  evidenceBody: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 19,
    color: colors.ink2,
  },
});

void radius;
