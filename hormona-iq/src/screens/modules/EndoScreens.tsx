// Endometriosis module screens — faithful ports of design-handoff/08-implementation-code/src/modules-4-endo.jsx.
// Phase-2 wiring: all state is local. Phase 3 will lift to Zustand.

import React, { type ReactElement, useCallback, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import {
  BodyMap,
  Checklist,
  MSection,
  NRS,
  Severity,
  Spark,
  ToggleRow,
  TrackerLog,
  type Severity0to3,
  type TrackerLogEntry,
} from '../../components/module';
import { buttons, cards, components as cmp, typography } from '../../constants/styles';
import { colors, fonts, radius, spacing } from '../../constants/tokens';

import { ModuleScaffold } from './ModuleScaffold';

// ─────────────────────────────────────────────
// 5-D Pain Log — F93
// ─────────────────────────────────────────────

interface PainField {
  key: string;
  label: string;
  sensitive?: boolean;
}

const PAIN_FIELDS: readonly PainField[] = [
  { key: 'dysmenorrhea_nrs', label: 'Period cramps / menstrual pain' },
  { key: 'cpp_nrs', label: 'Pelvic pain not during period (CPP)' },
  { key: 'dyschezia_nrs', label: 'Bowel pain / pain going to the toilet' },
  { key: 'dysuria_nrs', label: 'Bladder pain / pain during urination' },
  { key: 'dyspareunia_nrs', label: 'Pain during or after sex', sensitive: true },
];

const PAIN_QUALITIES: readonly string[] = [
  'sharp',
  'burning',
  'dull pressure',
  'stabbing',
  'electric / nerve-like',
  'cramping',
  'fullness / heaviness',
];

const INTERFERENCE_FIELDS: readonly { key: string; label: string }[] = [
  { key: 'interference_work', label: 'Work / study' },
  { key: 'interference_relationships', label: 'Relationships' },
  { key: 'interference_sleep', label: 'Sleep' },
  { key: 'interference_mood', label: 'Mood' },
];

export function Endo5DPainScreen({ onBack }: { onBack: () => void }): ReactElement {
  const [pain, setPain] = useState<Record<string, number | null>>({});
  const [qualities, setQualities] = useState<string[]>([]);
  const [interference, setInterference] = useState<Record<string, number>>({});
  const [nsaidTaken, setNsaidTaken] = useState(false);
  const [note, setNote] = useState('');

  const setNrs = (key: string, value: number): void => {
    setPain((prev) => ({ ...prev, [key]: value }));
  };

  const noPainToday = (): void => {
    const next: Record<string, number | null> = { ...pain };
    PAIN_FIELDS.forEach((f) => {
      if (f.key !== 'dyspareunia_nrs') next[f.key] = 0;
    });
    setPain(next);
  };

  const toggleQuality = (q: string): void => {
    setQualities((prev) =>
      prev.includes(q) ? prev.filter((x) => x !== q) : [...prev, q],
    );
  };

  return (
    <ModuleScaffold
      eyebrow="F93 · DAILY 5-D PAIN"
      title="Five domains, one minute."
      subtitle="0–10 NRS · ≥30% reduction = clinical responder (ASRM 2022)."
      onBack={onBack}
      headerSlot={
        <View style={[cards.cardMint, styles.phaseStrip]}>
          <Text style={styles.phaseLine}>
            Phase: <Text style={styles.phaseValue}>follicular</Text>
          </Text>
          <Text style={styles.phaseLine}>
            Cycle day: <Text style={styles.phaseValue}>9</Text>
          </Text>
        </View>
      }
    >
      <Pressable
        onPress={noPainToday}
        accessibilityRole="button"
        accessibilityLabel="Mark no pain today and quick-complete"
        style={({ pressed }) => [buttons.soft, styles.fullWidthBtn, pressed && styles.btnPressed]}
      >
        <Text style={buttons.softLabel}>No pain today — quick complete</Text>
      </Pressable>

      <View style={styles.painList}>
        {PAIN_FIELDS.map((f) => (
          <View key={f.key} style={[cards.cardPaper, styles.painCard]}>
            <Text style={styles.painLabel}>{f.label}</Text>
            {f.sensitive === true && (
              <Text style={styles.sensitiveCaption}>
                Optional. Never shared without your permission.
              </Text>
            )}
            <NRS
              value={pain[f.key] ?? null}
              onChange={(n) => setNrs(f.key, n)}
            />
          </View>
        ))}
      </View>

      <MSection title="PAIN QUALITY (TAP ALL THAT APPLY)">
        <View style={styles.chipWrap}>
          {PAIN_QUALITIES.map((q) => {
            const on = qualities.includes(q);
            return (
              <Pressable
                key={q}
                onPress={() => toggleQuality(q)}
                accessibilityRole="button"
                accessibilityLabel={`Toggle pain quality ${q}`}
                accessibilityState={{ selected: on }}
                style={[styles.qualityChip, on && styles.qualityChipActive]}
              >
                <Text
                  style={[styles.qualityChipLabel, on && styles.qualityChipLabelActive]}
                >
                  {q}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </MSection>

      <MSection title="INTERFERENCE WITH DAILY LIFE">
        {INTERFERENCE_FIELDS.map((it) => (
          <View key={it.key} style={[cards.cardPaper, styles.interferenceCard]}>
            <Text style={styles.painLabel}>{it.label}</Text>
            <Severity
              value={interference[it.key] ?? 0}
              onChange={(v) => setInterference((p) => ({ ...p, [it.key]: v }))}
              max={5}
            />
          </View>
        ))}
      </MSection>

      <ToggleRow
        label="Took NSAID / pain relief today"
        checked={nsaidTaken}
        onChange={setNsaidTaken}
        sub="Used by NSAID overuse detection (F118)"
      />

      <View style={[cards.cardWarm, styles.noteCard]}>
        <Text style={[typography.caption, styles.noteCaption]}>Note (optional)</Text>
        <TextInput
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={3}
          placeholder="What did this pain change today?"
          placeholderTextColor={colors.ink3}
          accessibilityLabel="Pain log note"
          style={styles.noteInput}
        />
      </View>
    </ModuleScaffold>
  );
}

// ─────────────────────────────────────────────
// Pain Body Map — F94
// ─────────────────────────────────────────────

const ZONE_QUALITIES: readonly string[] = [
  'sharp',
  'burning',
  'dull',
  'stabbing',
  'cramping',
];

interface ZoneData {
  severity: Severity0to3;
  qualities: string[];
  timing: 'period' | 'non_period';
}

const DEFAULT_ZONE: ZoneData = {
  severity: 0,
  qualities: [],
  timing: 'period',
};

export function EndoBodyMapScreen({ onBack }: { onBack: () => void }): ReactElement {
  const [zoneData, setZoneData] = useState<Record<string, ZoneData>>({});
  const [activeZone, setActiveZone] = useState<string | null>(null);

  const severityMap = useMemo<Record<string, Severity0to3>>(() => {
    const out: Record<string, Severity0to3> = {};
    Object.entries(zoneData).forEach(([id, d]) => {
      out[id] = d.severity;
    });
    return out;
  }, [zoneData]);

  const onZonePress = useCallback((zoneId: string) => {
    setActiveZone(zoneId);
    setZoneData((prev) => {
      if (prev[zoneId] !== undefined) return prev;
      return { ...prev, [zoneId]: { ...DEFAULT_ZONE } };
    });
  }, []);

  const setActiveSeverity = (sev: Severity0to3): void => {
    if (activeZone === null) return;
    setZoneData((prev) => ({
      ...prev,
      [activeZone]: { ...(prev[activeZone] ?? DEFAULT_ZONE), severity: sev },
    }));
  };

  const toggleActiveQuality = (q: string): void => {
    if (activeZone === null) return;
    setZoneData((prev) => {
      const cur = prev[activeZone] ?? DEFAULT_ZONE;
      const has = cur.qualities.includes(q);
      const next: ZoneData = {
        ...cur,
        qualities: has ? cur.qualities.filter((x) => x !== q) : [...cur.qualities, q],
      };
      return { ...prev, [activeZone]: next };
    });
  };

  const setActiveTiming = (t: 'period' | 'non_period'): void => {
    if (activeZone === null) return;
    setZoneData((prev) => ({
      ...prev,
      [activeZone]: { ...(prev[activeZone] ?? DEFAULT_ZONE), timing: t },
    }));
  };

  const active = activeZone !== null ? zoneData[activeZone] ?? DEFAULT_ZONE : null;

  return (
    <ModuleScaffold
      eyebrow="F94 · BODY MAP"
      title="Where does it hurt today?"
      subtitle="Tap a zone to set intensity, character, and timing."
      onBack={onBack}
    >
      <BodyMap
        zones={severityMap}
        onZonePress={onZonePress}
        activeZoneId={activeZone}
      />

      {activeZone !== null && active !== null ? (
        <View style={[cards.cardWarm, styles.zoneEditor]}>
          <Text style={[typography.eyebrow, styles.zoneEyebrow]}>
            ACTIVE ZONE · {activeZone.replace(/_/g, ' ')}
          </Text>

          <Text style={styles.zoneSectionLabel}>Severity</Text>
          <View style={styles.severityRow}>
            {[0, 1, 2, 3].map((n) => {
              const isActive = active.severity === n;
              return (
                <Pressable
                  key={n}
                  onPress={() => setActiveSeverity(n as Severity0to3)}
                  accessibilityRole="button"
                  accessibilityLabel={`Set severity ${n}`}
                  accessibilityState={{ selected: isActive }}
                  style={[styles.severityPill, isActive && styles.severityPillActive]}
                >
                  <Text
                    style={[
                      styles.severityPillLabel,
                      isActive && styles.severityPillLabelActive,
                    ]}
                  >
                    {['None', 'Mild', 'Mod', 'Severe'][n]}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.zoneSectionLabel}>Quality</Text>
          <View style={styles.chipWrap}>
            {ZONE_QUALITIES.map((q) => {
              const on = active.qualities.includes(q);
              return (
                <Pressable
                  key={q}
                  onPress={() => toggleActiveQuality(q)}
                  accessibilityRole="button"
                  accessibilityLabel={`Toggle quality ${q}`}
                  accessibilityState={{ selected: on }}
                  style={[styles.qualityChip, on && styles.qualityChipActiveCoral]}
                >
                  <Text
                    style={[
                      styles.qualityChipLabel,
                      on && styles.qualityChipLabelActive,
                    ]}
                  >
                    {q}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.zoneSectionLabel}>Timing</Text>
          <View style={styles.timingRow}>
            {(
              [
                { v: 'period' as const, l: 'During period' },
                { v: 'non_period' as const, l: 'Between periods' },
              ]
            ).map((t) => {
              const on = active.timing === t.v;
              return (
                <Pressable
                  key={t.v}
                  onPress={() => setActiveTiming(t.v)}
                  accessibilityRole="button"
                  accessibilityLabel={t.l}
                  accessibilityState={{ selected: on }}
                  style={[styles.timingBtn, on && styles.timingBtnActive]}
                >
                  <Text
                    style={[styles.timingBtnLabel, on && styles.timingBtnLabelActive]}
                  >
                    {t.l}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            onPress={() => setActiveZone(null)}
            accessibilityRole="button"
            accessibilityLabel="Done editing zone"
            style={({ pressed }) => [
              buttons.outline,
              styles.fullWidthBtn,
              pressed && styles.btnPressed,
            ]}
          >
            <Text style={buttons.outlineLabel}>Done</Text>
          </Pressable>
        </View>
      ) : (
        <Text style={styles.bodyMapHint}>
          Tap a circle on the body to set intensity, quality, and timing.
        </Text>
      )}
    </ModuleScaffold>
  );
}

// ─────────────────────────────────────────────
// Flare Tracker (composite)
// ─────────────────────────────────────────────

const FLARE_TRIGGERS = [
  { id: 'period_luteal', label: 'Period / luteal phase' },
  { id: 'high_fodmap', label: 'High-FODMAP food' },
  { id: 'gluten', label: 'Gluten' },
  { id: 'alcohol', label: 'Alcohol' },
  { id: 'stress', label: 'Stress event' },
  { id: 'intense_exercise', label: 'Intense exercise' },
  { id: 'cold_damp', label: 'Cold / damp weather' },
  { id: 'poor_sleep', label: 'Poor sleep' },
  { id: 'unknown', label: 'Unknown' },
];

export function EndoFlareTrackerScreen({ onBack }: { onBack: () => void }): ReactElement {
  const [intensity, setIntensity] = useState<number | null>(null);
  const [triggers, setTriggers] = useState<string[]>([]);
  const [entries, setEntries] = useState<TrackerLogEntry[]>([]);

  const onLog = (): void => {
    const id = `flare-${Date.now()}`;
    const triggerLabels = FLARE_TRIGGERS.filter((t) => triggers.includes(t.id))
      .map((t) => t.label)
      .join(' · ');
    setEntries((prev) => [
      {
        id,
        timestamp: new Date(),
        label: intensity !== null ? `Flare intensity ${intensity}/10` : 'Flare logged',
        detail: triggerLabels === '' ? 'No triggers identified' : triggerLabels,
      },
      ...prev,
    ]);
    setIntensity(null);
    setTriggers([]);
  };

  return (
    <ModuleScaffold
      eyebrow="FLARE TRACKER"
      title="Catch the flare. Catch the trigger."
      subtitle="Capture flare onset, suspected triggers, and recovery time."
      onBack={onBack}
    >
      <MSection title="CURRENT FLARE INTENSITY · NRS 0–10">
        <NRS value={intensity} onChange={setIntensity} />
      </MSection>

      <MSection title="SUSPECTED TRIGGERS">
        <Checklist items={FLARE_TRIGGERS} checked={triggers} onChange={setTriggers} />
      </MSection>

      <MSection title="14-DAY FLARE TREND">
        <View style={[cards.cardWarm, styles.sparkCard]}>
          <Spark data={[5, 4, 6, 7, 5, 4, 3, 4, 5, 3, 2, 4, 3, 2]} color={colors.coral} />
          <Text style={styles.helperText}>
            Flare peaks aligning with luteal phase and sleep dips.
          </Text>
        </View>
      </MSection>

      <MSection title="LOG HISTORY">
        <TrackerLog
          entries={entries}
          onAdd={onLog}
          addLabel="Log flare now"
          emptyLabel="No flares logged yet — tap when one starts."
        />
      </MSection>
    </ModuleScaffold>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

void cmp;

const styles = StyleSheet.create({
  fullWidthBtn: {
    alignSelf: 'stretch',
    marginBottom: spacing.md,
  },
  btnPressed: {
    opacity: 0.85,
  },
  helperText: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink3,
    marginTop: 8,
    lineHeight: 16,
  },
  sparkCard: {
    padding: 16,
  },

  // Phase strip
  phaseStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginBottom: spacing.sm,
  },
  phaseLine: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.ink2,
  },
  phaseValue: {
    fontFamily: fonts.sansSemibold,
    color: colors.ink,
  },

  // 5-D Pain
  painList: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  painCard: {
    padding: 16,
  },
  painLabel: {
    fontFamily: fonts.sansSemibold,
    fontSize: 13,
    color: colors.ink,
    marginBottom: spacing.sm,
  },
  sensitiveCaption: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink3,
    marginBottom: spacing.sm,
    marginTop: -4,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  qualityChip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.paper,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qualityChipActive: {
    backgroundColor: colors.eucalyptus,
    borderColor: colors.eucalyptus,
  },
  qualityChipActiveCoral: {
    backgroundColor: colors.coral,
    borderColor: colors.coral,
  },
  qualityChipLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.ink2,
  },
  qualityChipLabelActive: {
    color: colors.paper,
  },
  interferenceCard: {
    padding: 16,
    marginBottom: 6,
  },
  noteCard: {
    padding: 16,
    marginTop: spacing.sm,
  },
  noteCaption: {
    marginBottom: 6,
  },
  noteInput: {
    minHeight: 72,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    fontFamily: fonts.sans,
    color: colors.ink,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.paper,
    textAlignVertical: 'top',
  },

  // Body Map editor
  zoneEditor: {
    padding: 16,
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  zoneEyebrow: {
    marginBottom: 4,
  },
  zoneSectionLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.ink2,
    marginTop: 6,
  },
  severityRow: {
    flexDirection: 'row',
    gap: 6,
  },
  severityPill: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  severityPillActive: {
    backgroundColor: colors.eucalyptus,
    borderColor: colors.eucalyptus,
  },
  severityPillLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.ink,
  },
  severityPillLabelActive: {
    color: colors.paper,
  },
  timingRow: {
    flexDirection: 'row',
    gap: 6,
  },
  timingBtn: {
    flex: 1,
    minHeight: 44,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  timingBtnActive: {
    backgroundColor: colors.eucalyptus,
    borderColor: colors.eucalyptus,
  },
  timingBtnLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.ink,
  },
  timingBtnLabelActive: {
    color: colors.paper,
  },
  bodyMapHint: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.ink3,
    textAlign: 'center',
    marginTop: spacing.md,
    paddingHorizontal: spacing.md,
  },
});
