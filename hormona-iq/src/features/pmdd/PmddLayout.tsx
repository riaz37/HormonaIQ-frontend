// ─────────────────────────────────────────────────────────────────────────────
// PmddLayout — tab shell for the PMDD module screen
//
// Owns:
//   - PMDDState (single source of truth for all child tabs)
//   - Tab bar rendering
//   - Pattern summary banner (shown above any tab when pattern is confirmed)
//   - Routing each ModuleId to its sub-module component
// ─────────────────────────────────────────────────────────────────────────────

import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useReducedMotion } from 'react-native-reanimated';

import {
  buttons,
  cards,
  typography,
} from '../../constants/styles';
import { colors, fonts, radius } from '../../constants/tokens';
import { useModuleTabs } from '../../hooks/useModuleTabs';

import {
  Chip,
  EvidenceBar,
  InlineProgressBar,
  MHeader,
  MSection,
  Stat,
  SeverityScale,
} from './primitives';
import {
  computeLutealVsFollicular,
  computePatternState,
  INITIAL_STATE,
  itemLabel,
  meanDRSP,
  SEVERITY_COLORS,
  TABS,
} from './types';
import type {
  ModuleId,
  PMDDState,
  SupplementItem,
} from './types';

// Tab components
import CrisisTab from './CrisisTab';
import DrspLogTab from './DrspLogTab';
import EpisodesTab from './EpisodesTab';
import SafetyTab from './SafetyTab';

// ─────────────────────────────────────────────
// Remaining sub-module components (inline, not
// large enough to warrant their own files yet)
// ─────────────────────────────────────────────

function LutealPredModule() {
  return (
    <View>
      <MHeader
        eyebrow="Coming up"
        title="Heads up: "
        titleAccent="your luteal"
        sub="Predicted from your cycle history. Never overdue language."
      />
      <View style={[cards.cardWarm, sl.centeredCard]}>
        <Text style={sl.lutealCountdown}>4 days</Text>
        <Text style={[typography.caption, { marginTop: 2 }]}>
          ± 1 day · 87% confidence
        </Text>
      </View>
      <View style={[cards.cardMint, { padding: 16 }]}>
        <Text style={[typography.eyebrow, { marginBottom: 6 }]}>
          WHILE YOU'RE WELL
        </Text>
        <Text style={[typography.body, { fontSize: 13 }]}>
          Use this window to refresh your safety plan, schedule lighter days,
          and let close people know what to watch for.
        </Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────

const SSRI_OPTIONS = [
  'Fluoxetine',
  'Sertraline',
  'Citalopram',
  'Escitalopram',
  'Paroxetine',
  'Other',
];

const SSRI_PATTERNS = [
  { v: 'continuous', l: 'Continuous (daily)' },
  { v: 'luteal-phase', l: 'Luteal-phase only (day 14 → menses)' },
  { v: 'symptom-onset', l: 'Symptom-onset' },
];

interface SSRIModuleProps {
  state: PMDDState;
  setState: React.Dispatch<React.SetStateAction<PMDDState>>;
}

function SSRIModule({ state, setState }: SSRIModuleProps) {
  const cfg = state.ssriConfig;
  const log = state.ssriLog;
  const [showEditor, setShowEditor] = useState(!cfg);
  const [editName, setEditName] = useState(cfg?.name ?? 'Sertraline');
  const [editDose, setEditDose] = useState(String(cfg?.dose ?? 50));
  const [editPattern, setEditPattern] = useState(cfg?.pattern ?? 'luteal-phase');
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayLog = log[todayKey] ?? {};
  const [note, setNote] = useState(todayLog.note ?? '');

  const saveConfig = () => {
    setState((prev) => ({
      ...prev,
      ssriConfig: {
        name: editName,
        dose: Number(editDose) || 0,
        pattern: editPattern,
      },
    }));
    setShowEditor(false);
  };

  const setTaken = (taken: boolean) => {
    setState((prev) => ({
      ...prev,
      ssriLog: {
        ...prev.ssriLog,
        [todayKey]: {
          ...(prev.ssriLog[todayKey] ?? {}),
          taken,
          at: Date.now(),
        },
      },
    }));
  };

  const persistNote = (val: string) => {
    setNote(val);
    setState((prev) => ({
      ...prev,
      ssriLog: {
        ...prev.ssriLog,
        [todayKey]: { ...(prev.ssriLog[todayKey] ?? {}), note: val },
      },
    }));
  };

  const last7 = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const k = d.toISOString().slice(0, 10);
        const drsp = state.entries[k]?.drsp ?? {};
        const vals = Object.entries(drsp)
          .filter(([key]) => key !== 'suicidal_ideation')
          .map(([, v]) => Number(v))
          .filter((v) => v > 0);
        const drspMean = vals.length
          ? vals.reduce((a, b) => a + b, 0) / vals.length
          : null;
        return { k, taken: log[k]?.taken, drspMean };
      }),
    [state.entries, log],
  );

  const patternLabel =
    SSRI_PATTERNS.find((p) => p.v === cfg?.pattern)?.l ?? cfg?.pattern ?? '';

  return (
    <View>
      <MHeader
        eyebrow="Medication timing"
        title="Your meds, "
        titleAccent="tracked against DRSP."
      />
      {cfg && !showEditor ? (
        <View style={[cards.cardWarm, sl.ssriCfgCard]}>
          <View style={sl.ssriCfgHeader}>
            <Text style={typography.eyebrow}>CURRENT</Text>
            <TouchableOpacity
              style={sl.editBtn}
              onPress={() => setShowEditor(true)}
              accessibilityRole="button"
              accessibilityLabel="Edit SSRI configuration"
            >
              <Text style={sl.editBtnLabel}>Edit</Text>
            </TouchableOpacity>
          </View>
          <Text style={sl.ssriCfgName}>
            {cfg.name} {cfg.dose} mg
          </Text>
          <Text style={[typography.caption, { marginTop: 2 }]}>
            {patternLabel}
          </Text>
        </View>
      ) : (
        <View style={[cards.cardWarm, sl.ssriEditorCard]}>
          <Text style={[typography.eyebrow, { marginBottom: 8 }]}>
            {cfg ? 'EDIT CONFIG' : 'SET UP YOUR SSRI'}
          </Text>
          <Text style={[typography.caption, sl.fieldLabel]}>SSRI</Text>
          <View style={sl.pickerWrap}>
            {SSRI_OPTIONS.map((o) => (
              <TouchableOpacity
                key={o}
                style={[sl.pickerOption, editName === o && sl.pickerOptionActive]}
                onPress={() => setEditName(o)}
                accessibilityRole="button"
                accessibilityLabel={`Select ${o}`}
                accessibilityState={{ selected: editName === o }}
              >
                <Text
                  style={[
                    sl.pickerOptionLabel,
                    editName === o && sl.pickerOptionLabelActive,
                  ]}
                >
                  {o}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[typography.caption, sl.fieldLabel]}>Dose (mg)</Text>
          <TextInput
            style={sl.textInput}
            value={editDose}
            onChangeText={setEditDose}
            keyboardType="numeric"
            placeholder="e.g. 50"
            placeholderTextColor={colors.inkDisabled}
            accessibilityLabel="SSRI dose in milligrams"
          />
          <Text style={[typography.caption, sl.fieldLabel]}>Pattern</Text>
          {SSRI_PATTERNS.map((p) => (
            <TouchableOpacity
              key={p.v}
              style={[
                sl.pickerOption,
                sl.pickerOptionWide,
                editPattern === p.v && sl.pickerOptionActive,
              ]}
              onPress={() => setEditPattern(p.v)}
              accessibilityRole="button"
              accessibilityLabel={`Select pattern: ${p.l}`}
              accessibilityState={{ selected: editPattern === p.v }}
            >
              <Text
                style={[
                  sl.pickerOptionLabel,
                  editPattern === p.v && sl.pickerOptionLabelActive,
                ]}
              >
                {p.l}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={sl.editorActions}>
            <TouchableOpacity
              style={[buttons.primary, { flex: 1 }]}
              onPress={saveConfig}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Save SSRI configuration"
            >
              <Text style={buttons.primaryLabel}>Save</Text>
            </TouchableOpacity>
            {cfg && (
              <TouchableOpacity
                style={[sl.ghostBtn, { flex: 1 }]}
                onPress={() => setShowEditor(false)}
                accessibilityRole="button"
                accessibilityLabel="Cancel editing SSRI configuration"
              >
                <Text style={sl.ghostBtnLabel}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {cfg && (
        <MSection title="TODAY'S DOSE">
          <View style={[sl.doseRow, { marginBottom: 10 }]}>
            <TouchableOpacity
              style={[
                buttons.soft,
                { flex: 1 },
                todayLog.taken === true && sl.takenActive,
              ]}
              onPress={() => setTaken(true)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Mark today's dose as taken"
              accessibilityState={{ selected: todayLog.taken === true }}
            >
              <Text
                style={[
                  buttons.softLabel,
                  todayLog.taken === true && { color: colors.paper },
                ]}
              >
                Yes — taken
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                buttons.soft,
                { flex: 1 },
                todayLog.taken === false && sl.missedActive,
              ]}
              onPress={() => setTaken(false)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Mark today's dose as missed"
              accessibilityState={{ selected: todayLog.taken === false }}
            >
              <Text
                style={[
                  buttons.softLabel,
                  todayLog.taken === false && { color: colors.paper },
                ]}
              >
                No — missed
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={sl.textInput}
            placeholder="Note (optional)"
            value={note}
            onChangeText={persistNote}
            placeholderTextColor={colors.inkDisabled}
            accessibilityLabel="Optional note about today's dose"
          />
        </MSection>
      )}

      <MSection title="LAST 7 DAYS · ADHERENCE × DRSP">
        <View style={sl.adherenceGrid}>
          {last7.map((d, i) => {
            const t = d.taken;
            const bg =
              t === true
                ? colors.eucalyptus
                : t === false
                ? colors.coral
                : colors.mintMist;
            const fg = t == null ? colors.ink3 : colors.paper;
            return (
              <View key={i} style={{ alignItems: 'center', flex: 1 }}>
                <View style={[sl.adherenceCell, { backgroundColor: bg }]}>
                  <Text style={[sl.adherenceMark, { color: fg }]}>
                    {t === true ? '✓' : t === false ? '✕' : '·'}
                  </Text>
                </View>
                <Text style={[typography.data, sl.adherenceDrsp]}>
                  {d.drspMean != null ? d.drspMean.toFixed(1) : '—'}
                </Text>
              </View>
            );
          })}
        </View>
        <Text style={[typography.caption, { marginTop: 10, fontSize: 12 }]}>
          Top row: adherence. Bottom row: that day's DRSP mean (excluding SI).
        </Text>
      </MSection>
    </View>
  );
}

// ─────────────────────────────────────────────

const INITIAL_SUPPS: SupplementItem[] = [
  { n: 'Calcium', dose: 1200, unit: 'mg', d: 'Daily', e: 'Strong' },
  { n: 'Chasteberry (Vitex)', dose: 20, unit: 'mg', d: 'Daily', e: 'Moderate' },
  { n: 'Vit B6 (Pyridoxine)', dose: 100, unit: 'mg', d: 'Luteal only', e: 'Limited' },
  { n: 'Magnesium glycinate', dose: 300, unit: 'mg', d: 'Evenings', e: 'Moderate' },
  { n: 'Evening primrose oil', dose: 1000, unit: 'mg', d: 'Daily', e: 'Unsupported' },
];

function isB6(name: string): boolean {
  return /B6|Pyridoxine/i.test(name);
}

interface SuppsModuleProps {
  reduceMotion: boolean;
}

function SuppsModule({ reduceMotion: _reduceMotion }: SuppsModuleProps) {
  const [supps, setSupps] = useState<SupplementItem[]>(INITIAL_SUPPS);
  const [b6WarnIdx, setB6WarnIdx] = useState<number | null>(null);

  const updateDose = (i: number, value: string) => {
    const newDose = Number(value) || 0;
    const wasUnder = (supps[i].dose ?? 0) <= 100;
    setSupps((prev) =>
      prev.map((item, idx) => (idx === i ? { ...item, dose: newDose } : item)),
    );
    if (isB6(supps[i].n) && wasUnder && newDose > 100) {
      setB6WarnIdx(i);
    }
  };

  return (
    <View>
      <MHeader
        eyebrow="Supplements"
        title="Evidence ratings, "
        titleAccent="not vibes."
        sub="Peer-reviewed strength of evidence for each."
      />
      {supps.map((supp, i) => {
        const showWarning = isB6(supp.n) && supp.dose >= 100;
        return (
          <View key={supp.n} style={[cards.cardWarm, sl.suppCard]}>
            <View style={sl.suppRow}>
              <View style={{ flex: 1 }}>
                <Text style={sl.suppName}>{supp.n}</Text>
                <Text style={[typography.caption, { fontSize: 12 }]}>
                  {supp.d}
                </Text>
                <View style={sl.suppDoseRow}>
                  <TextInput
                    style={sl.suppDoseInput}
                    value={String(supp.dose)}
                    onChangeText={(v) => updateDose(i, v)}
                    keyboardType="numeric"
                    accessibilityLabel={`Dose for ${supp.n} in ${supp.unit}`}
                  />
                  <Text style={[typography.caption, { fontSize: 11 }]}>
                    {supp.unit}
                  </Text>
                </View>
              </View>
              <EvidenceBar level={supp.e} />
            </View>
            {showWarning && (
              <View style={sl.b6Warning}>
                <Text style={[typography.body, { fontSize: 12, lineHeight: 20 }]}>
                  <Text style={{ color: colors.severitySevere, fontFamily: fonts.sansSemibold }}>
                    Heads up:{' '}
                  </Text>
                  Doses above 100 mg/day are associated with peripheral
                  neuropathy. Discuss your dose with your prescriber.
                </Text>
              </View>
            )}
          </View>
        );
      })}
      <TouchableOpacity
        style={[buttons.soft, sl.fullWidth, { marginTop: 8 }]}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Add supplement"
      >
        <Text style={buttons.softLabel}>+ Add supplement</Text>
      </TouchableOpacity>

      <Modal
        visible={b6WarnIdx !== null}
        animationType="fade"
        transparent
        onRequestClose={() => setB6WarnIdx(null)}
      >
        <Pressable
          style={sl.modalBackdrop}
          onPress={() => setB6WarnIdx(null)}
          accessibilityRole="button"
          accessibilityLabel="Close B6 warning"
        >
          <Pressable style={sl.modalSheet} onPress={() => {}}>
            <Text
              style={[
                typography.eyebrow,
                { marginBottom: 6, color: colors.severitySevere },
              ]}
            >
              B6 DOSE NOTE
            </Text>
            <Text style={[typography.displaySm, { marginBottom: 12 }]}>
              You set {b6WarnIdx !== null ? supps[b6WarnIdx]?.dose ?? 0 : 0} mg.
            </Text>
            <Text style={[typography.body, { fontSize: 14, marginBottom: 16 }]}>
              Doses above 100 mg/day of B6 (pyridoxine) are associated with
              peripheral neuropathy. Please discuss your dose with your
              prescriber.
            </Text>
            <TouchableOpacity
              style={[buttons.soft, sl.fullWidth]}
              onPress={() => setB6WarnIdx(null)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Acknowledge B6 warning"
            >
              <Text style={buttons.softLabel}>Got it</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

// ─────────────────────────────────────────────

function RelImpactModule() {
  const conflicts = [
    { who: 'Partner', when: 'Yesterday', sev: 4, ctrl: 2, n: 'Out-of-proportion reaction · day 22' },
    { who: 'Mom', when: '5 days ago', sev: 3, ctrl: 2, n: 'Phone call escalated' },
    { who: 'Coworker', when: '8 days ago', sev: 2, ctrl: 4, n: 'Tone in slack · self-corrected' },
  ];

  return (
    <View>
      <MHeader
        eyebrow="Relationships"
        title="Conflicts, "
        titleAccent="logged briefly."
        sub="Builds the documentation for Criterion B and couples therapy."
      />
      {conflicts.map((r, i) => (
        <View key={i} style={[cards.cardWarm, sl.conflictCard]}>
          <View style={sl.conflictHeader}>
            <Text style={sl.conflictWho}>{r.who}</Text>
            <Text style={[typography.caption, { fontSize: 11 }]}>{r.when}</Text>
          </View>
          <Text style={sl.conflictNote}>{r.n}</Text>
          <View style={sl.conflictMetrics}>
            <Text style={[typography.caption, { fontSize: 11 }]}>
              Severity{' '}
              <Text style={{ fontFamily: fonts.sansSemibold, color: colors.severitySevere }}>
                {r.sev}/5
              </Text>
            </Text>
            <Text style={[typography.caption, { fontSize: 11 }]}>
              Control{' '}
              <Text style={{ fontFamily: fonts.sansSemibold, color: colors.severityMild }}>
                {r.ctrl}/5
              </Text>
            </Text>
          </View>
        </View>
      ))}
      <TouchableOpacity
        style={[buttons.soft, sl.fullWidth, { marginTop: 8 }]}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Log a new conflict"
      >
        <Text style={buttons.softLabel}>+ Log conflict</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────────────────────────────

function WorkImpactModule() {
  const workDays = [
    { d: 'Day 22', h: 4, t: "WFH · couldn't start", q: 2 },
    { d: 'Day 21', h: 3, t: 'Skipped 1:1', q: 3 },
    { d: 'Day 20', h: 2, t: 'Late · brain fog', q: 3 },
    { d: 'Day 19', h: 5, t: 'Took sick day', q: 1 },
  ];

  return (
    <View>
      <MHeader
        eyebrow="Work impact"
        title="Hours lost, "
        titleAccent="tracked honestly."
        sub="For accommodations, FMLA, or disability documentation."
      />
      <View style={sl.statsRow}>
        <Stat label="This luteal" value="14 hrs" sub="Hours lost" color={colors.severitySevere} />
        <Stat label="Last luteal" value="11 hrs" sub="Same window" />
        <Stat label="Follicular" value="0 hrs" sub="Baseline" color={colors.severityMild} />
      </View>
      <MSection title="THIS CYCLE">
        {workDays.map((d, i) => (
          <View key={i} style={[cards.card, sl.workCard]}>
            <View style={sl.workCardHeader}>
              <Text style={sl.workCardTitle}>
                {d.d} · {d.h} hr
              </Text>
              <Text style={[typography.data, { fontSize: 11 }]}>
                self-quality {d.q}/5
              </Text>
            </View>
            <Text style={[typography.caption, { fontSize: 12, marginTop: 2 }]}>
              {d.t}
            </Text>
          </View>
        ))}
      </MSection>
    </View>
  );
}

// ─────────────────────────────────────────────

const EXERCISE_OPTS = ['None', 'Light', 'Moderate', 'Intense'];

const TRIGGER_LABEL_MAP: Record<string, string> = {
  sleep: 'Sleep hours',
  caffeine: 'Caffeine cups',
  alcohol: 'Alcohol drinks',
  stress: 'Stress level',
  isolation: 'Social isolation',
};

interface TriggersModuleProps {
  state: PMDDState;
  setState: React.Dispatch<React.SetStateAction<PMDDState>>;
}

function TriggersModule({ state, setState }: TriggersModuleProps) {
  const todayKey = new Date().toISOString().slice(0, 10);
  const log = state.triggerLog;
  const today = log[todayKey] ?? {};

  const setField = (k: string, v: number | string) => {
    setState((prev) => ({
      ...prev,
      triggerLog: {
        ...prev.triggerLog,
        [todayKey]: { ...(prev.triggerLog[todayKey] ?? {}), [k]: v },
      },
    }));
  };

  const triggerEntries = useMemo(() => Object.entries(log), [log]);
  const enough = triggerEntries.length >= 30;

  interface CorrelationResult {
    feature: string;
    r: number;
    n: number;
  }
  interface ExerciseGroup {
    k: string;
    m: number;
    n: number;
  }
  interface CorrelationData {
    features: CorrelationResult[];
    exercise: ExerciseGroup[] | null;
  }

  const corr = useMemo((): CorrelationData | null => {
    if (!enough) return null;
    const features_list = ['sleep', 'caffeine', 'alcohol', 'stress', 'isolation'];
    const results: CorrelationResult[] = [];
    features_list.forEach((f) => {
      const pairs: [number, number][] = [];
      triggerEntries.forEach(([dateKey, t]) => {
        const fVal = t[f];
        if (fVal == null || fVal === '') return;
        const next = new Date(dateKey);
        next.setDate(next.getDate() + 1);
        const nextKey = next.toISOString().slice(0, 10);
        const nextDrsp = meanDRSP(state.entries[nextKey]);
        if (nextDrsp == null) return;
        pairs.push([Number(fVal), nextDrsp]);
      });
      if (pairs.length < 5) return;
      const n = pairs.length;
      const meanX = pairs.reduce((s, p) => s + p[0], 0) / n;
      const meanY = pairs.reduce((s, p) => s + p[1], 0) / n;
      const num = pairs.reduce((s, p) => s + (p[0] - meanX) * (p[1] - meanY), 0);
      const denomX = Math.sqrt(pairs.reduce((s, p) => s + Math.pow(p[0] - meanX, 2), 0));
      const denomY = Math.sqrt(pairs.reduce((s, p) => s + Math.pow(p[1] - meanY, 2), 0));
      const r = denomX && denomY ? num / (denomX * denomY) : 0;
      results.push({ feature: f, r, n });
    });

    const exerciseImpact = ((): ExerciseGroup[] | null => {
      const groups: Record<string, number[]> = {};
      triggerEntries.forEach(([dateKey, t]) => {
        const ex = t.exercise;
        if (!ex) return;
        const next = new Date(dateKey);
        next.setDate(next.getDate() + 1);
        const nextDrsp = meanDRSP(state.entries[next.toISOString().slice(0, 10)]);
        if (nextDrsp == null) return;
        if (!groups[String(ex)]) groups[String(ex)] = [];
        groups[String(ex)].push(nextDrsp);
      });
      const means: ExerciseGroup[] = Object.entries(groups).map(([k, arr]) => ({
        k,
        m: arr.reduce((a, b) => a + b, 0) / arr.length,
        n: arr.length,
      }));
      if (means.length < 2) return null;
      means.sort((a, b) => a.m - b.m);
      return means;
    })();

    results.sort((a, b) => Math.abs(b.r) - Math.abs(a.r));
    return { features: results.slice(0, 3), exercise: exerciseImpact };
  }, [enough, triggerEntries, state.entries]);

  return (
    <View>
      <MHeader
        eyebrow="Triggers"
        title="Your "
        titleAccent="specific"
        sub="Daily inputs correlated against your next-day DRSP."
      />
      <MSection title="LOG TODAY'S TRIGGERS">
        <View style={[cards.cardWarm, { padding: 16 }]}>
          <Text style={[typography.caption, sl.fieldLabel]}>Sleep hours</Text>
          <TextInput
            style={[sl.textInput, { marginBottom: 10 }]}
            value={today.sleep != null ? String(today.sleep) : ''}
            onChangeText={(v) => setField('sleep', v === '' ? '' : Number(v))}
            keyboardType="decimal-pad"
            placeholder="e.g. 7"
            placeholderTextColor={colors.inkDisabled}
            accessibilityLabel="Hours of sleep last night"
          />
          <View style={sl.doseRow}>
            <View style={{ flex: 1 }}>
              <Text style={[typography.caption, sl.fieldLabel]}>Caffeine cups</Text>
              <TextInput
                style={sl.textInput}
                value={today.caffeine != null ? String(today.caffeine) : ''}
                onChangeText={(v) => setField('caffeine', v === '' ? '' : Number(v))}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={colors.inkDisabled}
                accessibilityLabel="Number of caffeinated drinks today"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[typography.caption, sl.fieldLabel]}>Alcohol drinks</Text>
              <TextInput
                style={sl.textInput}
                value={today.alcohol != null ? String(today.alcohol) : ''}
                onChangeText={(v) => setField('alcohol', v === '' ? '' : Number(v))}
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={colors.inkDisabled}
                accessibilityLabel="Number of alcoholic drinks today"
              />
            </View>
          </View>
          <Text style={[typography.caption, sl.fieldLabel, { marginTop: 10 }]}>
            Exercise
          </Text>
          <View style={sl.chipRow}>
            {EXERCISE_OPTS.map((o) => (
              <Chip
                key={o}
                label={o}
                active={today.exercise === o}
                onPress={() => setField('exercise', o)}
                accessibilityLabel={`Exercise level: ${o}`}
              />
            ))}
          </View>
          <Text style={[typography.caption, sl.fieldLabel, { marginTop: 10 }]}>
            Stress (1–5)
          </Text>
          <SeverityScale
            value={(today.stress as number) || 0}
            onChange={(v) => setField('stress', v)}
            max={5}
            accessibilityHint="Rate your stress level today"
          />
          <Text style={[typography.caption, sl.fieldLabel, { marginTop: 10 }]}>
            Social isolation (1–5)
          </Text>
          <SeverityScale
            value={(today.isolation as number) || 0}
            onChange={(v) => setField('isolation', v)}
            max={5}
            accessibilityHint="Rate your social isolation today"
          />
        </View>
      </MSection>
      <MSection
        title={
          enough
            ? 'CORRELATIONS · NEXT-DAY DRSP'
            : `LOGGED ${triggerEntries.length}/30 DAYS`
        }
      >
        {!enough ? (
          <View style={[cards.cardWarm, { padding: 16 }]}>
            <Text style={[typography.body, { fontSize: 13, marginBottom: 4 }]}>
              Tracking 30+ days unlocks correlations.
            </Text>
            <Text style={[typography.caption, { fontSize: 12 }]}>
              You're at {triggerEntries.length}/30.
            </Text>
          </View>
        ) : (
          <>
            {corr?.features.length === 0 && (
              <Text style={[typography.caption, { fontSize: 12, padding: 10 }]}>
                Not enough next-day DRSP overlap yet — keep logging.
              </Text>
            )}
            {corr?.features.map((t) => {
              const pct = Math.min(100, Math.abs(t.r) * 100);
              const dir = t.r > 0 ? '+' : '−';
              const barColor = t.r > 0 ? colors.coral : colors.eucalyptus;
              return (
                <View key={t.feature} style={[cards.card, sl.corrCard]}>
                  <View style={sl.corrHeader}>
                    <Text style={sl.corrLabel}>
                      {TRIGGER_LABEL_MAP[t.feature] ?? t.feature}
                    </Text>
                    <Text
                      style={[
                        typography.data,
                        { fontSize: 12, color: t.r > 0 ? colors.severitySevere : colors.severityMild },
                      ]}
                    >
                      {dir} r={Math.abs(t.r).toFixed(2)} · n={t.n}
                    </Text>
                  </View>
                  <InlineProgressBar pct={pct} color={barColor} height={4} />
                  <Text style={[typography.caption, { fontSize: 11, marginTop: 6 }]}>
                    {t.r > 0
                      ? 'Higher values associate with higher next-day DRSP.'
                      : 'Higher values associate with lower next-day DRSP.'}
                  </Text>
                </View>
              );
            })}
            {corr?.exercise && (
              <View style={[cards.card, sl.corrCard]}>
                <Text style={sl.corrLabel}>Exercise level vs next-day DRSP</Text>
                {corr.exercise.map((g) => (
                  <View key={g.k} style={sl.exerciseRow}>
                    <Text style={[typography.body, { fontSize: 12 }]}>
                      {g.k} (n={g.n})
                    </Text>
                    <Text style={typography.data}>{g.m.toFixed(2)}</Text>
                  </View>
                ))}
              </View>
            )}
          </>
        )}
      </MSection>
    </View>
  );
}

// ─────────────────────────────────────────────

const COMMUNITY_STATS = [
  { l: 'Logged irritability ≥ 4 today', v: '64%' },
  { l: 'Reported sleep disturbance', v: '71%' },
  { l: 'Logged a mood episode this week', v: '58%' },
  { l: 'Currently on an SSRI', v: '34%' },
];

const SAMPLE_MESSAGES = [
  'Day 23 here. Brain fog is unreal. Just wanted to say I exist.',
  "Tried logging at 2am because I couldn't sleep. Glad someone is awake.",
  "It's not just me, right?",
];

interface CommunityModuleProps {
  state: PMDDState;
  setState: React.Dispatch<React.SetStateAction<PMDDState>>;
}

function CommunityModule({ state, setState }: CommunityModuleProps) {
  const wallOn = !!(state.featureFlags?.lutealWall);

  const toggleWall = () => {
    setState((prev) => ({
      ...prev,
      featureFlags: {
        ...prev.featureFlags,
        lutealWall: !prev.featureFlags?.lutealWall,
      },
    }));
  };

  return (
    <View>
      <MHeader
        eyebrow="Community"
        title="You're "
        titleAccent="not alone"
        sub="Anonymous. No profiles. No feed. Just numbers."
      />
      <View style={[cards.cardMint, sl.communityCount]}>
        <Text style={sl.communityNumber}>2,847</Text>
        <Text style={[typography.caption, { marginTop: 4 }]}>
          others on day 19–22 of their cycle right now
        </Text>
      </View>
      {COMMUNITY_STATS.map((r) => (
        <View key={r.l} style={[cards.card, sl.communityStatRow]}>
          <Text style={[typography.body, { fontSize: 13 }]}>{r.l}</Text>
          <Text style={sl.communityStatValue}>{r.v}</Text>
        </View>
      ))}
      <Text style={[typography.caption, { marginTop: 16, fontSize: 11 }]}>
        Aggregated {'>'} 100 users · no individual data shared.
      </Text>

      <View style={[cards.cardWarm, sl.lutealWallCard]}>
        <View style={{ width: 4, backgroundColor: colors.coral, borderRadius: 2, alignSelf: 'stretch' }} />
        <View style={{ flex: 1 }}>
          <Text style={[typography.eyebrow, { marginBottom: 6 }]}>
            LUTEAL WALL · OPT-IN
          </Text>
          {!wallOn ? (
            <>
              <Text style={[typography.body, { fontSize: 13, marginBottom: 10 }]}>
                This is opt-in; default off.
              </Text>
              <TouchableOpacity
                style={[buttons.soft, { alignSelf: 'flex-start', minHeight: 44 }]}
                onPress={toggleWall}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityLabel="Turn on Luteal Wall"
              >
                <Text style={buttons.softLabel}>Turn on Luteal Wall</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={[typography.caption, { fontSize: 11, marginBottom: 10 }]}>
                Anonymous · max 100 chars · 24h auto-purge
              </Text>
              {SAMPLE_MESSAGES.map((m, i) => (
                <View key={i} style={[cards.card, sl.wallMessage]}>
                  <Text style={sl.wallMessageText}>"{m}"</Text>
                </View>
              ))}
            </>
          )}
        </View>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PmddLayout — main export
// ─────────────────────────────────────────────────────────────────────────────

const TAB_IDS = TABS.map((t) => t.id);

export default function PmddLayout() {
  const router = useRouter();
  const reduceMotion = useReducedMotion() ?? false;
  const [state, setState] = useState<PMDDState>(INITIAL_STATE);

  const { activeTab, setActiveTab } = useModuleTabs('pmddPDF', TAB_IDS);

  const patternState = computePatternState(state.entries);
  const { lutealMean, follMean, swing, topItems } =
    computeLutealVsFollicular(state.entries, state.lastPeriod, state.cycleLen);

  const triggerEntries = Object.entries(state.triggerLog);
  const triggerCorrs = useMemo(() => {
    const triggerDefs = [
      { id: 'sleep', label: 'Days you slept poorly', invert: false },
      { id: 'caffeine', label: 'Days with caffeine', invert: false },
      { id: 'alcohol', label: 'Days with alcohol', invert: false },
      { id: 'exercise', label: 'Days you exercised', invert: true },
      { id: 'stress', label: 'High-stress days', invert: false },
    ];
    return triggerDefs
      .map((td) => {
        const withT: number[] = [];
        const withoutT: number[] = [];
        Object.keys(state.entries).forEach((d) => {
          const drsp = meanDRSP(state.entries[d]);
          if (drsp == null) return;
          const t = state.triggerLog[d];
          if (!t) return;
          if (t[td.id]) withT.push(drsp);
          else withoutT.push(drsp);
        });
        if (!withT.length || !withoutT.length) return null;
        const a = withT.reduce((x, y) => x + y, 0) / withT.length;
        const b = withoutT.reduce((x, y) => x + y, 0) / withoutT.length;
        return {
          ...td,
          withT: a,
          without: b,
          delta: a - b,
          n: withT.length + withoutT.length,
        };
      })
      .filter(
        (t): t is NonNullable<typeof t> =>
          t !== null && Math.abs(t.delta) >= 0.5,
      );
  }, [state.entries, state.triggerLog]);

  type SeverityKey = 'severe' | 'mod' | 'mild';
  const dynamicPatterns = useMemo(() => {
    const patterns: Array<{ t: string; d: string; c: number; s: SeverityKey }> = [];
    if (lutealMean != null && follMean != null && swing != null && swing >= 1.5) {
      patterns.push({
        t: `Cycle-recurrent severity confirmed (${swing.toFixed(1)}× swing)`,
        d: `Across ${Object.keys(state.entries).length} logged days, your luteal mean is ${swing.toFixed(1)}× higher than follicular. This is the prospective pattern DSM-5 PMDD evaluation looks for.`,
        c: Math.min(99, Math.round((swing - 1) * 50 + 50)),
        s: swing >= 2.5 ? 'severe' : swing >= 2 ? 'mod' : 'mild',
      });
    }
    triggerCorrs.forEach((t) => {
      const sign = t.delta > 0 ? '+' : '';
      const direction = (t.invert ? -1 : 1) * t.delta;
      patterns.push({
        t: `${t.label} → DRSP ${sign}${t.delta.toFixed(1)}`,
        d: `On ${t.label.toLowerCase()}, your DRSP averages ${t.withT.toFixed(1)}/6 vs ${t.without.toFixed(1)}/6 on other days. ${
          t.invert && direction > 0
            ? 'Notable protective effect.'
            : direction > 0.5
            ? 'Worth tracking the link.'
            : 'Subtle correlation — keep watching.'
        }`,
        c: Math.min(99, Math.round(Math.abs(t.delta) * 30 + 40)),
        s: Math.abs(t.delta) >= 1 ? 'mod' : 'mild',
      });
    });
    return patterns;
  }, [lutealMean, follMean, swing, state.entries, triggerCorrs]);

  function renderModule() {
    const tab = activeTab as ModuleId;
    switch (tab) {
      case 'pmddPDF':
        return <DrspLogTab state={state} />;
      case 'crisis':
        return <CrisisTab />;
      case 'lutealPred':
        return <LutealPredModule />;
      case 'safetyPlan':
        return <SafetyTab state={state} setState={setState} />;
      case 'ssri':
        return <SSRIModule state={state} setState={setState} />;
      case 'supps':
        return <SuppsModule reduceMotion={reduceMotion} />;
      case 'rage':
        return <EpisodesTab state={state} setState={setState} />;
      case 'relImpact':
        return <RelImpactModule />;
      case 'workImpact':
        return <WorkImpactModule />;
      case 'triggers':
        return <TriggersModule state={state} setState={setState} />;
      case 'community':
        return <CommunityModule state={state} setState={setState} />;
      default:
        return null;
    }
  }

  return (
    <SafeAreaView style={sl.safeArea}>
      {/* Top bar */}
      <View style={sl.topbar}>
        <TouchableOpacity
          style={sl.backBtn}
          onPress={() => router.push('/(app)/home')}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Back to home"
        >
          <Text style={sl.backBtnLabel}>← Back</Text>
        </TouchableOpacity>
        <Text style={[typography.h3, { flex: 1, textAlign: 'center' }]}>
          PMDD
        </Text>
        <View style={sl.backBtn} />
      </View>

      {/* Tab strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={sl.tabStrip}
        contentContainerStyle={sl.tabStripContent}
        accessibilityRole="tablist"
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[sl.tab, active && sl.tabActive]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.75}
              accessibilityRole="tab"
              accessibilityLabel={`${tab.label} module tab`}
              accessibilityState={{ selected: active }}
            >
              <Text style={[sl.tabLabel, active && sl.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Module content */}
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.cream }}
        contentContainerStyle={sl.moduleContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Pattern summary banner */}
        {patternState === 'confirmed' && lutealMean != null && follMean != null && (
          <View style={[cards.cardWarm, sl.patternBanner]}>
            <View style={{ width: 4, backgroundColor: colors.severitySevere, borderRadius: 2, alignSelf: 'stretch' }} />
            <View style={{ flex: 1 }}>
              <Text style={sl.patternBannerTitle}>
                Your luteal vs follicular swing
              </Text>
              <Text style={[typography.caption, { fontSize: 12, marginBottom: 6 }]}>
                Luteal mean DRSP:{' '}
                <Text style={typography.data}>{lutealMean.toFixed(1)}/6</Text>{' '}
                · follicular mean:{' '}
                <Text style={typography.data}>{follMean.toFixed(1)}/6</Text>
                {swing != null && (
                  <>
                    {' '}
                    · a{' '}
                    <Text style={typography.data}>{swing.toFixed(1)}×</Text>{' '}
                    swing
                  </>
                )}
                .
              </Text>
              {topItems.length > 0 && (
                <Text style={[typography.caption, { fontSize: 12 }]}>
                  Most consistent luteal symptoms:{' '}
                  {topItems.map((i) => itemLabel(i.k)).join(', ')}.
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Pattern cards */}
        {patternState === 'confirmed' &&
          dynamicPatterns.map((p) => (
            <View
              key={p.t}
              style={[cards.cardWarm, sl.patternCard]}
            >
              <View style={{ width: 4, backgroundColor: SEVERITY_COLORS[p.s], borderRadius: 2, alignSelf: 'stretch' }} />
              <View style={{ flex: 1 }}>
                <View style={sl.patternCardHeader}>
                  <Text style={[sl.patternCardTitle, { flex: 1, paddingRight: 8 }]}>
                    {p.t}
                  </Text>
                  <Text
                    style={[
                      typography.data,
                      { fontSize: 12, color: SEVERITY_COLORS[p.s] },
                    ]}
                  >
                    {p.c}%
                  </Text>
                </View>
                <Text style={[typography.caption, { fontSize: 12 }]}>{p.d}</Text>
              </View>
            </View>
          ))}

        {renderModule()}

        <Text style={sl.disclaimer}>
          HormonaIQ is not a substitute for medical advice. Not a diagnosis —
          discuss with your provider.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

// Intentionally large — the luteal countdown is a hero display figure
const COUNTDOWN_FONT_SIZE = 44;

const sl = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.cream,
  },
  backBtn: {
    minWidth: 60,
    height: 44,
    justifyContent: 'center',
  },
  backBtnLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.eucalyptus,
  },
  tabStrip: {
    backgroundColor: colors.cream,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    maxHeight: 52,
  },
  tabStripContent: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: radius.pill,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.paper,
  },
  tabActive: {
    backgroundColor: colors.eucalyptus,
    borderColor: colors.eucalyptus,
  },
  tabLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.ink2,
  },
  tabLabelActive: {
    color: colors.paper,
  },
  moduleContent: {
    padding: 20,
    paddingBottom: 48,
  },
  fullWidth: {
    width: '100%',
  },
  ghostBtn: {
    minHeight: 44,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  ghostBtnLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.eucalyptusDeep,
  },
  textInput: {
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 12,
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink,
    backgroundColor: colors.paper,
    width: '100%',
  },
  fieldLabel: {
    marginBottom: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  doseRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: 24,
    paddingBottom: 32,
  },
  disclaimer: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink3,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  patternBanner: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    marginBottom: 10,
  },
  patternBannerTitle: {
    fontFamily: fonts.sansSemibold,
    fontSize: 13,
    marginBottom: 6,
    color: colors.ink,
  },
  patternCard: {
    flexDirection: 'row',
    gap: 10,
    padding: 16,
    marginBottom: 10,
  },
  patternCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  patternCardTitle: {
    fontFamily: fonts.sansSemibold,
    fontSize: 14,
    lineHeight: 20,
    color: colors.ink,
  },

  // Luteal predictor
  centeredCard: {
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  lutealCountdown: {
    fontFamily: fonts.monoMedium,
    fontSize: COUNTDOWN_FONT_SIZE,
    color: colors.eucalyptus,
  },

  // SSRI
  ssriCfgCard: {
    padding: 16,
    marginBottom: 12,
  },
  ssriCfgHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  ssriCfgName: {
    fontFamily: fonts.sansSemibold,
    fontSize: 15,
    color: colors.ink,
  },
  ssriEditorCard: {
    padding: 16,
    marginBottom: 12,
  },
  editBtn: {
    height: 44,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  editBtnLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.eucalyptus,
  },
  pickerWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 10,
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.paper,
    minHeight: 44,
    justifyContent: 'center',
  },
  pickerOptionWide: {
    marginBottom: 6,
    alignSelf: 'stretch',
  },
  pickerOptionActive: {
    backgroundColor: colors.eucalyptus,
    borderColor: colors.eucalyptus,
  },
  pickerOptionLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.ink,
  },
  pickerOptionLabelActive: {
    color: colors.paper,
  },
  editorActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  takenActive: {
    backgroundColor: colors.eucalyptus,
  },
  missedActive: {
    backgroundColor: colors.coral,
  },
  adherenceGrid: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
  },
  adherenceCell: {
    height: 30,
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  adherenceMark: {
    fontFamily: fonts.mono,
    fontSize: 11,
  },
  adherenceDrsp: {
    fontSize: 11,
    marginTop: 4,
  },

  // Supplements
  suppCard: {
    padding: 16,
    marginBottom: 8,
  },
  suppRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  suppName: {
    fontFamily: fonts.sansSemibold,
    fontSize: 14,
    color: colors.ink,
  },
  suppDoseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  suppDoseInput: {
    width: 72,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 8,
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.ink,
    backgroundColor: colors.paper,
  },
  b6Warning: {
    marginTop: 10,
    padding: 10,
    backgroundColor: colors.coralSoft,
    borderRadius: radius.sm,
  },

  // Relationship
  conflictCard: {
    padding: 16,
    marginBottom: 8,
  },
  conflictHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  conflictWho: {
    fontFamily: fonts.sansSemibold,
    fontSize: 14,
    color: colors.ink,
  },
  conflictNote: {
    fontFamily: fonts.sans,
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.ink2,
    marginBottom: 8,
  },
  conflictMetrics: {
    flexDirection: 'row',
    gap: 12,
  },

  // Work
  workCard: {
    padding: 12,
    marginBottom: 6,
  },
  workCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  workCardTitle: {
    fontFamily: fonts.sansSemibold,
    fontSize: 13,
    color: colors.ink,
  },

  // Correlations
  corrCard: {
    padding: 12,
    marginBottom: 6,
  },
  corrHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: 6,
  },
  corrLabel: {
    fontFamily: fonts.sansSemibold,
    fontSize: 13,
    color: colors.ink,
  },
  exerciseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },

  // Community
  communityCount: {
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  communityNumber: {
    fontFamily: fonts.monoMedium,
    fontSize: 36,
    color: colors.eucalyptusDeep,
  },
  communityStatRow: {
    padding: 12,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  communityStatValue: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.eucalyptus,
  },
  lutealWallCard: {
    marginTop: 16,
    padding: 16,
    flexDirection: 'row',
    gap: 10,
  },
  wallMessage: {
    padding: 10,
    marginBottom: 6,
  },
  wallMessageText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.ink2,
  },
});
