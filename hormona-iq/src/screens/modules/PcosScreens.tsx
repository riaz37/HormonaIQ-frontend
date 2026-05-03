// PCOS module screens — faithful ports of design-handoff/08-implementation-code/src/modules-2.jsx.
// All state is local (useState). Phase 3 will replace with Zustand selectors.

import React, { type ReactElement, useMemo, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  Checklist,
  EvidenceBar,
  MSection,
  Severity,
  Spark,
  Stat,
  ToggleRow,
  TrackerLog,
  type TrackerLogEntry,
} from '../../components/module';
import { buttons, cards, typography } from '../../constants/styles';
import { colors, fonts, radius, spacing } from '../../constants/tokens';

import { ModuleScaffold } from './ModuleScaffold';

// ─────────────────────────────────────────────
// Lab Value Vault — F12
// ─────────────────────────────────────────────

interface LabRow {
  id: string;
  name: string;
  value: string;
  date: string;
  range: string;
  fasting?: boolean;
  note?: string;
}

const SEED_LABS: LabRow[] = [
  { id: 'l1', name: 'Total testosterone', value: '52 ng/dL', date: 'Mar 12', range: '6–86 ng/dL', note: '↑ from last result' },
  { id: 'l2', name: 'Free testosterone', value: '2.4 pg/mL', date: 'Mar 12', range: '0.7–3.6 pg/mL' },
  { id: 'l3', name: 'SHBG', value: '28 nmol/L', date: 'Mar 12', range: '40–120 nmol/L' },
  { id: 'l4', name: 'AMH', value: '8.4 ng/mL', date: 'Mar 12', range: '1.0–3.5 ng/mL', note: 'PCOS literature uses >3.8–5.0 ng/mL as a supporting signal — discuss with your clinician.' },
  { id: 'l5', name: 'Fasting insulin', value: '14 µIU/mL', date: 'Feb 4', range: '< 15 µIU/mL', fasting: true },
  { id: 'l6', name: 'HOMA-IR', value: '3.2', date: 'Feb 4', range: '< 2.0 typical' },
  { id: 'l7', name: 'HbA1c', value: '5.6%', date: 'Feb 4', range: '< 5.7%' },
  { id: 'l8', name: 'DHEA-S', value: '210 µg/dL', date: 'Feb 4', range: '35–430 µg/dL' },
  { id: 'l9', name: 'Vitamin D', value: '24 ng/mL', date: 'Feb 4', range: '30–80 ng/mL' },
  { id: 'l10', name: 'TSH', value: '2.1 mIU/L', date: 'Mar 12', range: '0.5–4 mIU/L', note: 'Optimal <2.5 mIU/L for reproductive age.' },
];

interface LabFormState {
  name: string;
  value: string;
  date: string;
  range: string;
}

export function LabVaultScreen({ onBack }: { onBack: () => void }): ReactElement {
  const [labs, setLabs] = useState<LabRow[]>(SEED_LABS);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<LabFormState>({
    name: '',
    value: '',
    date: '',
    range: '',
  });

  const handleSave = (): void => {
    if (form.name.trim() === '' || form.value.trim() === '') return;
    const newLab: LabRow = {
      id: `local-${Date.now()}`,
      name: form.name.trim(),
      value: form.value.trim(),
      date: form.date.trim() || 'Today',
      range: form.range.trim(),
    };
    setLabs((prev) => [newLab, ...prev]);
    setForm({ name: '', value: '', date: '', range: '' });
    setShowForm(false);
  };

  return (
    <ModuleScaffold
      eyebrow="F12 · LAB VAULT"
      title="Your PCOS labs."
      subtitle="Reference ranges shown for context — your provider's interpretation matters."
      onBack={onBack}
    >
      <View style={styles.labList}>
        {labs.map((lab) => (
          <View key={lab.id} style={[cards.cardPaper, styles.labRow]}>
            <View style={styles.labRowMain}>
              <Text style={styles.labName}>{lab.name}</Text>
              <Text style={styles.labMeta}>
                {lab.range !== '' ? `Range ${lab.range}` : ''}
                {lab.date !== '' ? ` · ${lab.date}` : ''}
                {lab.fasting === true ? ' · fasting' : ''}
              </Text>
              {lab.note !== undefined && (
                <Text style={styles.labNote}>{lab.note}</Text>
              )}
            </View>
            <Text style={styles.labValue}>{lab.value}</Text>
          </View>
        ))}
      </View>

      {showForm ? (
        <View style={[cards.cardWarm, styles.formCard]}>
          <Text style={typography.eyebrow}>ADD NEW RESULT</Text>
          <FormField
            label="Marker"
            value={form.name}
            onChange={(v) => setForm((p) => ({ ...p, name: v }))}
            placeholder="e.g. Total testosterone"
          />
          <FormField
            label="Value"
            value={form.value}
            onChange={(v) => setForm((p) => ({ ...p, value: v }))}
            placeholder="e.g. 52 ng/dL"
          />
          <FormField
            label="Date"
            value={form.date}
            onChange={(v) => setForm((p) => ({ ...p, date: v }))}
            placeholder="YYYY-MM-DD"
          />
          <FormField
            label="Reference range"
            value={form.range}
            onChange={(v) => setForm((p) => ({ ...p, range: v }))}
            placeholder="e.g. 6–86 ng/dL"
          />
          <View style={styles.formActions}>
            <Pressable
              onPress={() => setShowForm(false)}
              accessibilityRole="button"
              accessibilityLabel="Cancel adding lab result"
              style={({ pressed }) => [buttons.outline, pressed && styles.btnPressed]}
            >
              <Text style={buttons.outlineLabel}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              accessibilityRole="button"
              accessibilityLabel="Save lab result"
              style={({ pressed }) => [buttons.primary, styles.formSaveBtn, pressed && styles.btnPressed]}
            >
              <Text style={buttons.primaryLabel}>Save</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <Pressable
          onPress={() => setShowForm(true)}
          accessibilityRole="button"
          accessibilityLabel="Add new lab result"
          style={({ pressed }) => [buttons.soft, styles.fullWidthBtn, pressed && styles.btnPressed]}
        >
          <Text style={buttons.softLabel}>+ Add new result</Text>
        </Pressable>
      )}

      <View style={[cards.cardWarm, styles.disclaimerCard]}>
        <Text style={styles.disclaimerText}>
          Lab values vary by laboratory and clinical context. Reference ranges shown are general — your lab&apos;s reference range may vary, and your provider&apos;s interpretation matters.
        </Text>
      </View>
    </ModuleScaffold>
  );
}

// ─────────────────────────────────────────────
// Metabolic Snapshot — F28
// ─────────────────────────────────────────────

export function MetabolicSnapScreen({ onBack }: { onBack: () => void }): ReactElement {
  const [energy, setEnergy] = useState<number>(0);
  const [cravings, setCravings] = useState<number>(0);
  const [brainFog, setBrainFog] = useState<boolean>(false);
  const [savedAt, setSavedAt] = useState<Date | null>(null);

  const trend = useMemo(() => [3.2, 3.8, 3.5, 4.1, 3.6, 3.9, 4.0], []);

  const save = (): void => setSavedAt(new Date());

  return (
    <ModuleScaffold
      eyebrow="F28 · METABOLIC SNAPSHOT"
      title="Daily proxy markers."
      subtitle="Post-meal energy, cravings, brain fog — no calorie tracking."
      onBack={onBack}
    >
      <MSection title="POST-MEAL ENERGY · 2HR · 1–5">
        <Severity value={energy} onChange={setEnergy} max={5} />
        <Text style={styles.helperText}>1 = crashed, 5 = steady</Text>
      </MSection>

      <MSection title="SUGAR CRAVINGS · 1–5">
        <Severity value={cravings} onChange={setCravings} max={5} />
        <Text style={styles.helperText}>1 = none, 5 = overwhelming</Text>
      </MSection>

      <MSection title="POST-MEAL BRAIN FOG">
        <ToggleRow
          label="Felt foggy after eating today"
          checked={brainFog}
          onChange={setBrainFog}
        />
      </MSection>

      <Pressable
        onPress={save}
        accessibilityRole="button"
        accessibilityLabel="Save today's metabolic snapshot"
        style={({ pressed }) => [buttons.primary, styles.fullWidthBtn, pressed && styles.btnPressed]}
      >
        <Text style={buttons.primaryLabel}>Save today&apos;s snapshot</Text>
      </Pressable>
      {savedAt !== null && (
        <Text style={styles.savedConfirm}>
          Saved at {savedAt.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
        </Text>
      )}

      <MSection title="7-DAY COMPOSITE">
        <View style={[cards.cardWarm, styles.sparkCard]}>
          <Spark data={trend} color={colors.eucalyptus} />
          <Text style={styles.helperText}>
            Composite of energy, cravings, and brain fog. Higher = better metabolic day.
          </Text>
        </View>
      </MSection>
    </ModuleScaffold>
  );
}

// ─────────────────────────────────────────────
// Androgen Tracker — F18
// ─────────────────────────────────────────────

const FG_SITES: readonly string[] = [
  'Upper lip',
  'Chin',
  'Chest',
  'Upper back',
  'Lower back',
  'Upper abdomen',
  'Lower abdomen',
  'Upper arm',
  'Thigh',
];

export function AndrogenScreen({ onBack }: { onBack: () => void }): ReactElement {
  const [acne, setAcne] = useState<number>(2);
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(FG_SITES.map((s) => [s, 0])),
  );

  const total = useMemo(
    () => Object.values(scores).reduce((sum, n) => sum + n, 0),
    [scores],
  );

  return (
    <ModuleScaffold
      eyebrow="F18 · ANDROGEN TRACKER"
      title="Acne, hair, graded."
      subtitle="Modified Ferriman-Gallwey + IGA acne scales."
      onBack={onBack}
    >
      <MSection title="ACNE TODAY · IGA SCALE">
        <View style={styles.acneRow}>
          {[0, 1, 2, 3, 4].map((n) => {
            const active = acne === n;
            return (
              <Pressable
                key={n}
                onPress={() => setAcne(n)}
                accessibilityRole="button"
                accessibilityLabel={`IGA acne grade ${n}`}
                accessibilityState={{ selected: active }}
                style={[styles.acneBtn, active && styles.acneBtnActive]}
              >
                <Text style={[styles.acneBtnLabel, active && styles.acneBtnLabelActive]}>
                  {n}
                </Text>
              </Pressable>
            );
          })}
        </View>
        <Text style={styles.helperText}>0 = clear · 4 = severe nodulocystic</Text>
      </MSection>

      <MSection title="HIRSUTISM · 9 SITES · 0–4 EACH">
        {FG_SITES.map((site) => (
          <View key={site} style={styles.siteRow}>
            <Text style={styles.siteLabel}>{site}</Text>
            <View style={styles.siteScores}>
              {[0, 1, 2, 3, 4].map((n) => {
                const active = scores[site] === n;
                return (
                  <Pressable
                    key={n}
                    onPress={() =>
                      setScores((prev) => ({ ...prev, [site]: n }))
                    }
                    accessibilityRole="button"
                    accessibilityLabel={`${site} hirsutism score ${n}`}
                    accessibilityState={{ selected: active }}
                    style={[styles.siteScoreBtn, active && styles.siteScoreBtnActive]}
                  >
                    <Text
                      style={[
                        styles.siteScoreBtnLabel,
                        active && styles.siteScoreBtnLabelActive,
                      ]}
                    >
                      {n}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
        <View style={styles.fgTotalRow}>
          <Text style={styles.fgTotalLabel}>Total</Text>
          <Text style={styles.fgTotalValue}>{total}/36</Text>
        </View>
        <Text style={styles.helperText}>
          ≥8 indicates clinically significant hirsutism (Caucasian populations); ≥6 is used for some non-Caucasian populations — discuss with your clinician.
        </Text>
      </MSection>

      <View style={[cards.cardMint, styles.trendCard]}>
        <Text style={[typography.eyebrow, styles.trendEyebrow]}>3-MONTH TREND</Text>
        <Spark data={[10, 11, 9, 8, 8, 7]} />
        <Text style={styles.helperText}>Decreasing since spironolactone titration</Text>
      </View>
    </ModuleScaffold>
  );
}

// ─────────────────────────────────────────────
// HOMA-IR Calculator — F43
// ─────────────────────────────────────────────

const HOMA_BANDS: ReadonlyArray<{ range: string; label: string }> = [
  { range: '< 2.0', label: 'typical' },
  { range: '2.0 – 2.4', label: 'borderline' },
  { range: '≥ 2.5', label: 'suggests insulin resistance' },
  { range: '≥ 3.0', label: 'elevated' },
  { range: '≥ 4.0', label: 'severe' },
];

export function HomaIRScreen({ onBack }: { onBack: () => void }): ReactElement {
  const [insulin, setInsulin] = useState<string>('14');
  const [glucose, setGlucose] = useState<string>('92');

  const homa = useMemo(() => {
    const i = Number.parseFloat(insulin);
    const g = Number.parseFloat(glucose);
    if (!Number.isFinite(i) || !Number.isFinite(g)) return 0;
    return Number(((i * g) / 405).toFixed(2));
  }, [insulin, glucose]);

  return (
    <ModuleScaffold
      eyebrow="F43 · HOMA-IR CALCULATOR"
      title="An important PCOS number."
      subtitle="From your fasting insulin and glucose. Formula: (insulin × glucose) ÷ 405."
      onBack={onBack}
    >
      <MSection title="FASTING INSULIN · µIU/mL">
        <NumberField
          value={insulin}
          onChange={setInsulin}
          accessibilityLabel="Fasting insulin"
        />
      </MSection>

      <MSection title="FASTING GLUCOSE · mg/dL">
        <NumberField
          value={glucose}
          onChange={setGlucose}
          accessibilityLabel="Fasting glucose"
        />
      </MSection>

      <View style={[cards.cardWarm, styles.homaResultCard]}>
        <Text style={[typography.caption, styles.homaCaption]}>YOUR HOMA-IR</Text>
        <Text style={styles.homaValue}>{homa.toFixed(2)}</Text>
        <Text style={styles.helperText}>(insulin × glucose) ÷ 405</Text>
      </View>

      <MSection title="REFERENCE BANDS · EDUCATIONAL">
        <View style={cards.cardPaper}>
          {HOMA_BANDS.map((b, idx) => (
            <View
              key={b.range}
              style={[styles.bandRow, idx === HOMA_BANDS.length - 1 && styles.bandRowLast]}
            >
              <Text style={styles.bandRange}>{b.range}</Text>
              <Text style={styles.bandLabel}>{b.label}</Text>
            </View>
          ))}
        </View>
      </MSection>

      <View style={[cards.cardMint, styles.contextCard]}>
        <Text style={[typography.eyebrow, styles.contextEyebrow]}>WHAT IT MEANS</Text>
        <Text style={styles.contextBody}>
          HOMA-IR is an estimate of insulin resistance from a fasting blood draw. The bands above are general educational ranges — they aren&apos;t a personal verdict. Your provider considers HOMA-IR alongside your full clinical picture.
        </Text>
        <View style={styles.evidenceRow}>
          <Text style={[typography.caption, styles.evidenceCaption]}>Evidence</Text>
          <EvidenceBar level="strong" />
        </View>
      </View>
    </ModuleScaffold>
  );
}

// ─────────────────────────────────────────────
// PCOS Symptom Tracker (composite)
// ─────────────────────────────────────────────

const PCOS_DOMAINS: readonly string[] = [
  'Acne',
  'Hair shedding',
  'Cravings',
  'Energy crash',
  'Mood reactivity',
  'Bloating',
];

const PCOS_EVENTS = [
  { id: 'period_started', label: 'Period started' },
  { id: 'spotting', label: 'Spotting' },
  { id: 'skipped_meal', label: 'Skipped meal' },
  { id: 'inositol_taken', label: 'Inositol taken' },
  { id: 'metformin_taken', label: 'Metformin taken' },
  { id: 'walked_20min', label: 'Walked / moved 20+ min' },
];

export function PcosSymptomTrackerScreen({ onBack }: { onBack: () => void }): ReactElement {
  const [scores, setScores] = useState<Record<string, number>>(
    Object.fromEntries(PCOS_DOMAINS.map((d) => [d, 0])),
  );
  const [entries, setEntries] = useState<TrackerLogEntry[]>([]);

  const composite = useMemo(() => {
    const vals = Object.values(scores);
    const filled = vals.filter((n) => n > 0);
    if (filled.length === 0) return 0;
    return Number(
      (filled.reduce((s, n) => s + n, 0) / filled.length).toFixed(1),
    );
  }, [scores]);

  const trend = useMemo(() => [2.4, 2.1, 2.6, 2.0, 1.8, 2.2, 1.6], []);

  const onLog = (): void => {
    const id = `pcos-${Date.now()}`;
    setEntries((prev) => [
      {
        id,
        timestamp: new Date(),
        label: `Composite ${composite}/5`,
        detail: Object.entries(scores)
          .filter(([, v]) => v > 0)
          .map(([k, v]) => `${k} ${v}`)
          .join(' · ') || 'No domains rated',
      },
      ...prev,
    ]);
  };

  return (
    <ModuleScaffold
      eyebrow="PCOS SYMPTOM TRACKER"
      title="One snapshot. All the signals."
      subtitle="Daily roll-up across cycle, androgen, metabolic and mood domains."
      onBack={onBack}
    >
      <View style={styles.compositeRow}>
        <Stat
          label="Today composite"
          value={composite > 0 ? composite.toFixed(1) : '—'}
          sub="lower is better"
        />
        <Stat label="7-day avg" value="2.1" trend="down" sub="last 7 days" />
      </View>

      <MSection title="TODAY · 1–5 SEVERITY">
        {PCOS_DOMAINS.map((domain) => (
          <View key={domain} style={styles.domainRow}>
            <Text style={styles.domainLabel}>{domain}</Text>
            <Severity
              value={scores[domain] ?? 0}
              onChange={(n) => setScores((prev) => ({ ...prev, [domain]: n }))}
              max={5}
            />
          </View>
        ))}
      </MSection>

      <MSection title="EVENTS TODAY">
        <Checklist items={PCOS_EVENTS} />
      </MSection>

      <MSection title="14-DAY COMPOSITE">
        <View style={[cards.cardWarm, styles.sparkCard]}>
          <Spark data={trend} color={colors.eucalyptus} />
          <Text style={styles.helperText}>Lower is better — your trend is improving.</Text>
        </View>
      </MSection>

      <MSection title="LOG HISTORY">
        <TrackerLog
          entries={entries}
          onAdd={onLog}
          addLabel="Log today's snapshot"
          emptyLabel="No snapshots logged yet today."
        />
      </MSection>
    </ModuleScaffold>
  );
}

// ─────────────────────────────────────────────
// Shared form helpers
// ─────────────────────────────────────────────

interface FormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

function FormField({ label, value, onChange, placeholder }: FormFieldProps): ReactElement {
  return (
    <View style={styles.formField}>
      <Text style={styles.formLabel}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.ink3}
        accessibilityLabel={label}
        style={styles.formInput}
        returnKeyType="done"
      />
    </View>
  );
}

interface NumberFieldProps {
  value: string;
  onChange: (value: string) => void;
  accessibilityLabel: string;
}

function NumberField({ value, onChange, accessibilityLabel }: NumberFieldProps): ReactElement {
  return (
    <TextInput
      value={value}
      onChangeText={onChange}
      keyboardType="decimal-pad"
      accessibilityLabel={accessibilityLabel}
      style={styles.numberInput}
      returnKeyType="done"
    />
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const styles = StyleSheet.create({
  // Lab Vault
  labList: {
    gap: 6,
    marginBottom: spacing.sm,
  },
  labRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  labRowMain: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  labName: {
    fontFamily: fonts.sansSemibold,
    fontSize: 13,
    color: colors.ink,
  },
  labMeta: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink3,
    marginTop: 2,
  },
  labNote: {
    fontFamily: fonts.sans,
    fontSize: 11,
    fontStyle: 'italic',
    color: colors.ink3,
    marginTop: 4,
    lineHeight: 15,
  },
  labValue: {
    fontFamily: fonts.monoMedium,
    fontSize: 14,
    color: colors.ink,
    textAlign: 'right',
  },
  formCard: {
    padding: 16,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  formField: {
    gap: 4,
  },
  formLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.ink2,
  },
  formInput: {
    height: 44,
    paddingHorizontal: 12,
    fontSize: 14,
    fontFamily: fonts.sans,
    color: colors.ink,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.paper,
  },
  numberInput: {
    height: 48,
    paddingHorizontal: 14,
    fontSize: 16,
    fontFamily: fonts.mono,
    color: colors.ink,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.paper,
  },
  formActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  formSaveBtn: {
    flex: 1,
  },
  fullWidthBtn: {
    alignSelf: 'stretch',
    marginTop: spacing.sm,
  },
  btnPressed: {
    opacity: 0.85,
  },
  disclaimerCard: {
    padding: 14,
    marginTop: spacing.md,
  },
  disclaimerText: {
    fontFamily: fonts.sans,
    fontSize: 11,
    lineHeight: 16,
    color: colors.ink2,
  },
  helperText: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink3,
    marginTop: 8,
    lineHeight: 16,
  },
  savedConfirm: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: colors.eucalyptusDeep,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  sparkCard: {
    padding: 14,
  },

  // Androgen
  acneRow: {
    flexDirection: 'row',
    gap: 6,
  },
  acneBtn: {
    flex: 1,
    height: 48,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acneBtnActive: {
    backgroundColor: colors.eucalyptus,
    borderColor: colors.eucalyptus,
  },
  acneBtnLabel: {
    fontFamily: fonts.mono,
    fontSize: 16,
    color: colors.ink,
  },
  acneBtnLabelActive: {
    color: colors.paper,
  },
  siteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
    minHeight: 44,
  },
  siteLabel: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink,
    flex: 1,
  },
  siteScores: {
    flexDirection: 'row',
    gap: 4,
  },
  siteScoreBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.mintMist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  siteScoreBtnActive: {
    backgroundColor: colors.eucalyptus,
    borderColor: colors.eucalyptus,
  },
  siteScoreBtnLabel: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.ink,
  },
  siteScoreBtnLabelActive: {
    color: colors.paper,
  },
  fgTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  fgTotalLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.ink2,
  },
  fgTotalValue: {
    fontFamily: fonts.monoMedium,
    fontSize: 16,
    color: colors.ink,
  },
  trendCard: {
    padding: 14,
    marginTop: spacing.sm,
  },
  trendEyebrow: {
    marginBottom: 6,
  },

  // HOMA-IR
  homaResultCard: {
    alignItems: 'center',
    paddingVertical: 28,
    marginVertical: spacing.sm,
    backgroundColor: colors.mintPale,
  },
  homaCaption: {
    marginBottom: 6,
  },
  homaValue: {
    fontFamily: fonts.mono,
    fontSize: 56,
    color: colors.ink,
    lineHeight: 60,
  },
  bandRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  bandRowLast: {
    borderBottomWidth: 0,
  },
  bandRange: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.ink,
  },
  bandLabel: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink2,
  },
  contextCard: {
    padding: 16,
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  contextEyebrow: {
    marginBottom: 4,
  },
  contextBody: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 19,
    color: colors.ink2,
  },
  evidenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  evidenceCaption: {
    color: colors.ink3,
  },

  // PCOS Symptom Tracker
  compositeRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  domainRow: {
    paddingVertical: 10,
    gap: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  domainLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.ink,
  },
});
