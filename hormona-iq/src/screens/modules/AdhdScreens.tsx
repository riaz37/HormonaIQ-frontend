// ADHD module screens — composite screens informed by design-handoff/08-implementation-code/src/modules-5-adhd.jsx.
// Phase 2: rich, faithful UI using only Phase-1 primitives. Local state only.

import React, { type ReactElement, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  Checklist,
  MSection,
  NRS,
  Severity,
  Spark,
  Stat,
  TrackerLog,
  type TrackerLogEntry,
} from '../../components/module';
import { cards } from '../../constants/styles';
import { colors, fonts, radius, spacing } from '../../constants/tokens';

import { ModuleScaffold } from './ModuleScaffold';

// ─────────────────────────────────────────────
// Focus Tracker — quick check-in
// ─────────────────────────────────────────────

const FOCUS_BLOCKERS = [
  { id: 'notifications', label: 'Notifications / phone' },
  { id: 'open_plan', label: 'Open-plan noise' },
  { id: 'restless', label: 'Internal restlessness' },
  { id: 'boring', label: 'Task feels boring' },
  { id: 'overwhelming', label: 'Task feels overwhelming' },
  { id: 'hungry', label: 'Hungry / dehydrated' },
  { id: 'pre_med', label: 'Pre-medication window' },
];

export function AdhdFocusTrackerScreen({ onBack }: { onBack: () => void }): ReactElement {
  const [focus, setFocus] = useState<number | null>(null);
  const [blockers, setBlockers] = useState<string[]>([]);
  const [entries, setEntries] = useState<TrackerLogEntry[]>([]);

  const todayAvg = useMemo(() => {
    if (entries.length === 0) return null;
    const todayKey = new Date().toDateString();
    const todays = entries.filter((e) => e.timestamp.toDateString() === todayKey);
    if (todays.length === 0) return null;
    const sum = todays.reduce((acc, e) => {
      const match = /Focus (\d+)/.exec(e.label);
      return acc + (match !== null ? Number.parseInt(match[1], 10) : 0);
    }, 0);
    return Number((sum / todays.length).toFixed(1));
  }, [entries]);

  const onLog = (): void => {
    if (focus === null) return;
    const labels = FOCUS_BLOCKERS.filter((b) => blockers.includes(b.id))
      .map((b) => b.label)
      .join(' · ');
    setEntries((prev) => [
      {
        id: `focus-${Date.now()}`,
        timestamp: new Date(),
        label: `Focus ${focus}/10`,
        detail: labels === '' ? 'No blockers logged' : labels,
      },
      ...prev,
    ]);
    setFocus(null);
    setBlockers([]);
  };

  return (
    <ModuleScaffold
      eyebrow="FOCUS TRACKER"
      title="One number. One minute."
      subtitle="Quick focus check-ins build the only chart that catches your real pattern."
      onBack={onBack}
    >
      <View style={styles.statRow}>
        <Stat
          label="Today avg"
          value={todayAvg !== null ? todayAvg.toFixed(1) : '—'}
          sub={`${entries.length} check-in${entries.length === 1 ? '' : 's'}`}
        />
        <Stat label="7-day avg" value="6.4" trend="up" sub="last 7 days" />
      </View>

      <MSection title="FOCUS RIGHT NOW · NRS 0–10">
        <NRS value={focus} onChange={setFocus} />
      </MSection>

      <MSection title="WHAT'S IN THE WAY?">
        <Checklist items={FOCUS_BLOCKERS} checked={blockers} onChange={setBlockers} />
      </MSection>

      <MSection title="LOG HISTORY">
        <TrackerLog
          entries={entries}
          onAdd={onLog}
          addLabel={focus === null ? 'Pick a focus value first' : 'Log focus check-in'}
          emptyLabel="No check-ins yet today."
        />
      </MSection>
    </ModuleScaffold>
  );
}

// ─────────────────────────────────────────────
// Mood + Energy — twice-daily
// ─────────────────────────────────────────────

const MOOD_MARKERS = [
  { id: 'sleep_7', label: 'Slept ≥ 7 hours' },
  { id: 'med_on_time', label: 'Took medication on schedule' },
  { id: 'moved', label: 'Moved body' },
  { id: 'protein_breakfast', label: 'Protein at breakfast' },
  { id: 'crashed_pm', label: 'Crashed in afternoon' },
  { id: 'rsd_episode', label: 'RSD episode' },
];

export function AdhdMoodEnergyScreen({ onBack }: { onBack: () => void }): ReactElement {
  const [mood, setMood] = useState<number>(0);
  const [energy, setEnergy] = useState<number>(0);
  const [markers, setMarkers] = useState<string[]>([]);

  const moodTrend = useMemo(() => [3, 2, 3, 4, 3, 4, 3, 4, 4, 3, 4, 5, 4, 4], []);
  const energyTrend = useMemo(() => [2, 3, 2, 3, 3, 4, 3, 3, 4, 3, 3, 4, 4, 5], []);

  return (
    <ModuleScaffold
      eyebrow="MOOD + ENERGY"
      title="Twice a day. That's enough."
      subtitle="Lightweight logging that catches the real ADHD pattern."
      onBack={onBack}
    >
      <View style={styles.statRow}>
        <Stat label="Mood today" value={mood > 0 ? mood.toString() : '—'} sub="1–5" />
        <Stat label="Energy today" value={energy > 0 ? energy.toString() : '—'} sub="1–5" />
      </View>

      <MSection title="MOOD · 1–5">
        <Severity value={mood} onChange={setMood} max={5} />
        <Text style={styles.helperText}>1 = low / flat, 5 = bright and steady</Text>
      </MSection>

      <MSection title="ENERGY · 1–5">
        <Severity value={energy} onChange={setEnergy} max={5} />
        <Text style={styles.helperText}>1 = depleted, 5 = activated</Text>
      </MSection>

      <MSection title="TODAY MARKERS">
        <Checklist items={MOOD_MARKERS} checked={markers} onChange={setMarkers} />
      </MSection>

      <MSection title="14-DAY MOOD">
        <View style={[cards.cardWarm, styles.sparkCard]}>
          <Spark data={moodTrend} color={colors.eucalyptus} />
          <Text style={styles.helperText}>Steady upward trend over the past two weeks.</Text>
        </View>
      </MSection>

      <MSection title="14-DAY ENERGY">
        <View style={[cards.cardWarm, styles.sparkCard]}>
          <Spark data={energyTrend} color={colors.butterDeep} />
          <Text style={styles.helperText}>Energy lifts on days protein breakfast was logged.</Text>
        </View>
      </MSection>
    </ModuleScaffold>
  );
}

// ─────────────────────────────────────────────
// Cycle × Brain — F134-style
// ─────────────────────────────────────────────

const PHASE_OPTIONS: ReadonlyArray<{ id: string; label: string; color: string }> = [
  { id: 'menstrual', label: 'Menstrual', color: '#B97A8A' },
  { id: 'follicular', label: 'Follicular', color: '#C7D9C5' },
  { id: 'ovulatory', label: 'Ovulatory', color: '#F5E4B8' },
  { id: 'early_luteal', label: 'Early luteal', color: '#E89F86' },
  { id: 'late_luteal', label: 'Late luteal', color: '#C97962' },
];

const BRAIN_DOMAINS: readonly string[] = [
  'Attention',
  'Working memory',
  'Emotional regulation',
  'Medication effect',
];

export function AdhdCycleBrainScreen({ onBack }: { onBack: () => void }): ReactElement {
  const [phase, setPhase] = useState<string>('follicular');
  const [domains, setDomains] = useState<Record<string, number | null>>({});

  const setDomain = (key: string, value: number): void => {
    setDomains((prev) => ({ ...prev, [key]: value }));
  };

  const daysLogged = 38;
  const required = 60;
  const unlocked = daysLogged >= required;
  const pct = Math.min(100, Math.round((daysLogged / required) * 100));

  return (
    <ModuleScaffold
      eyebrow="CYCLE × BRAIN"
      title="Your cycle. Your ADHD."
      subtitle="The chart no other ADHD app has — once you've logged two full cycles."
      onBack={onBack}
    >
      <MSection title="PHASE TODAY">
        <View style={styles.phaseGrid}>
          {PHASE_OPTIONS.map((p) => {
            const on = phase === p.id;
            return (
              <Pressable
                key={p.id}
                onPress={() => setPhase(p.id)}
                accessibilityRole="button"
                accessibilityLabel={`Set phase to ${p.label}`}
                accessibilityState={{ selected: on }}
                style={[styles.phaseTile, on && styles.phaseTileActive]}
              >
                <View style={[styles.phaseTileDot, { backgroundColor: p.color }]} />
                <Text style={[styles.phaseTileLabel, on && styles.phaseTileLabelActive]}>
                  {p.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </MSection>

      <MSection title="BRAIN TODAY · NRS 0–10">
        <View style={styles.brainList}>
          {BRAIN_DOMAINS.map((d) => (
            <View key={d} style={[cards.cardPaper, styles.brainCard]}>
              <Text style={styles.brainLabel}>{d}</Text>
              <NRS value={domains[d] ?? null} onChange={(n) => setDomain(d, n)} />
            </View>
          ))}
        </View>
      </MSection>

      <MSection title="60-DAY CYCLE × BRAIN">
        <View style={[cards.cardWarm, styles.unlockCard]}>
          {unlocked ? (
            <View>
              <Text style={styles.unlockTitle}>Pattern detected</Text>
              <Text style={styles.unlockBody}>
                Your attention is consistently lower in your luteal phase than your follicular phase. Worth raising with your prescriber.
              </Text>
              <Spark
                data={[7.4, 7.1, 6.8, 6.4, 5.9, 5.4, 5.0, 5.6, 6.2, 7.0]}
                color={colors.eucalyptus}
              />
            </View>
          ) : (
            <View>
              <Text style={styles.unlockEyebrow}>Unlocks at day 60</Text>
              <Text style={styles.unlockProgress}>
                {daysLogged}/{required} days
              </Text>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${pct}%` }]} />
              </View>
              <Text style={styles.helperText}>
                When this unlocks, you&apos;ll see how your attention, medication
                effectiveness, and emotional regulation shift across your cycle.
              </Text>
            </View>
          )}
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

  // Phase grid
  phaseGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  phaseTile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.paper,
    minHeight: 44,
  },
  phaseTileActive: {
    backgroundColor: colors.eucalyptus,
    borderColor: colors.eucalyptus,
  },
  phaseTileDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  phaseTileLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.ink,
  },
  phaseTileLabelActive: {
    color: colors.paper,
  },

  // Brain domains
  brainList: {
    gap: spacing.sm,
  },
  brainCard: {
    padding: 14,
  },
  brainLabel: {
    fontFamily: fonts.sansSemibold,
    fontSize: 13,
    color: colors.ink,
    marginBottom: spacing.sm,
  },

  // Unlock card
  unlockCard: {
    padding: 18,
  },
  unlockEyebrow: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 11 * 0.16,
    textTransform: 'uppercase',
    color: colors.eucalyptus,
    marginBottom: spacing.sm,
  },
  unlockProgress: {
    fontFamily: fonts.mono,
    fontSize: 28,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  unlockTitle: {
    fontFamily: fonts.sansSemibold,
    fontSize: 14,
    color: colors.eucalyptusDeep,
    marginBottom: 6,
  },
  unlockBody: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 19,
    color: colors.ink2,
    marginBottom: spacing.md,
  },
  progressTrack: {
    height: 8,
    backgroundColor: colors.mintMist,
    borderRadius: radius.pill,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.eucalyptus,
    borderRadius: radius.pill,
  },
});
