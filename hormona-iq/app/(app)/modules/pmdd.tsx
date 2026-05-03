/**
 * PMDD Module Screen
 *
 * Port of design-handoff/08-implementation-code/src/modules-1.jsx (PMDD sections only).
 * Shared module-ui / module-sheet components are implemented inline because
 * src/components/module does not yet exist.
 *
 * Porting rules applied:
 *  - CSS classes → StyleSheet.create() using token values
 *  - Full TypeScript, no `any`
 *  - 44 px minimum tap targets on all interactive elements
 *  - accessibilityLabel on ALL interactive elements
 *  - useReduceMotion() from react-native-reanimated
 *  - No window.HQ.useApp() — local useState only
 *  - goto('screen') → router.push('/(app)/screen')
 *  - No console.log
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
  Alert,
  Linking,
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
  components as cmp,
  layout,
  typography,
} from '../../../src/constants/styles';
import { colors, fonts, radius } from '../../../src/constants/tokens';

// ─────────────────────────────────────────────────────────────────────────────
// Local types
// ─────────────────────────────────────────────────────────────────────────────

type PhaseCode = 'F' | 'O' | 'L' | 'M' | '?';

interface DRSPScores {
  irritability?: number;
  anxiety?: number;
  overwhelmed?: number;
  concentration?: number;
  fatigue?: number;
  mood_swings?: number;
  depressed?: number;
  rejection_sensitive?: number;
  out_of_control?: number;
  hopeless?: number;
  breast_tenderness?: number;
  headache?: number;
  appetite?: number;
  insomnia?: number;
  hypersomnia?: number;
  suicidal_ideation?: number;
  [key: string]: number | undefined;
}

interface DayEntry {
  drsp?: DRSPScores;
}

interface TriggerEntry {
  sleep?: number | string;
  caffeine?: number | string;
  alcohol?: number | string;
  exercise?: string;
  stress?: number;
  isolation?: number;
  [key: string]: number | string | undefined;
}

interface RageEpisode {
  at: number;
  type: string;
  intensity: number;
  duration: string | null;
  note: string | null;
}

interface SSRIConfig {
  name: string;
  dose: number;
  pattern: string;
}

interface SSRILogEntry {
  taken?: boolean;
  note?: string;
  at?: number;
}

interface SafetyPlanItem {
  k: string;
  l: string;
  v: string;
}

interface SupplementItem {
  n: string;
  dose: number;
  unit: string;
  d: string;
  e: EvidenceLevel;
}

interface PMDDState {
  cycleDay: number;
  cycleLen: number;
  lastPeriod: string | null;
  entries: Record<string, DayEntry>;
  triggerLog: Record<string, TriggerEntry>;
  rageEpisodes: RageEpisode[];
  ssriConfig: SSRIConfig | null;
  ssriLog: Record<string, SSRILogEntry>;
  safetyPlanEditOverride: boolean;
  conditions: string[];
  adhd: string;
  hbcActive: boolean;
  hbcType: string;
  yearOfBirth: number | null;
  exportSI: boolean;
  featureFlags: Record<string, boolean>;
}

type EvidenceLevel = 'Strong' | 'Moderate' | 'Limited' | 'Unsupported';
type PatternState = 'empty' | 'early' | 'confirmed';
type SeverityKey = 'severe' | 'mod' | 'mild';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers — ported from shared.jsx / modules-1.jsx
// ─────────────────────────────────────────────────────────────────────────────

/** T-49 coarse phase mapping (only F / O / L / M used here) */
function phaseForDay(day: number, cycleLen: number, coarse = true): PhaseCode {
  const c = cycleLen || 28;
  if (day <= 5) return 'M';
  if (day > c - 5) return 'M';
  const fEnd = Math.round(c * 0.45);
  const oEnd = Math.round(c * 0.55);
  if (day <= fEnd) return 'F';
  if (day <= oEnd) return 'O';
  if (!coarse) {
    const lmEnd = Math.round(c * 0.78);
    return day <= lmEnd ? 'L' : 'L';
  }
  return 'L';
}

function meanDRSP(entry: DayEntry | undefined): number | null {
  if (!entry?.drsp) return null;
  const vals = Object.entries(entry.drsp)
    .filter(([k]) => k !== 'suicidal_ideation')
    .map(([, v]) => Number(v))
    .filter((v) => v > 0);
  return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
}

function phaseDayFor(
  dateKey: string,
  lastPeriod: string | null,
  cycleLen: number,
): number | null {
  if (!lastPeriod) return null;
  const dt = new Date(dateKey).getTime();
  const start = new Date(lastPeriod).getTime();
  const diff = Math.floor((dt - start) / 86400000);
  return Math.max(1, (diff % cycleLen) + 1);
}

const DRSP_ITEM_LABELS: Record<string, string> = {
  irritability: 'irritability',
  anxiety: 'anxiety',
  overwhelmed: 'overwhelmed',
  concentration: 'concentration',
  fatigue: 'fatigue',
  mood_swings: 'mood swings',
  depressed: 'depression',
  rejection_sensitive: 'rejection sensitivity',
  out_of_control: 'feeling out of control',
  hopeless: 'hopelessness',
  breast_tenderness: 'breast tenderness',
  headache: 'headache',
  appetite: 'appetite/cravings',
  insomnia: 'insomnia',
  hypersomnia: 'hypersomnia',
};

function itemLabel(k: string): string {
  return DRSP_ITEM_LABELS[k] ?? k.replace(/_/g, ' ');
}

const SEVERITY_COLORS: Record<SeverityKey, string> = {
  severe: colors.severitySevere,
  mod: colors.severityMod,
  mild: colors.severityMild,
};

function formatEpisodeTime(ts: number): string {
  const dt = new Date(ts);
  const now = new Date();
  const diff = Math.floor((now.getTime() - dt.getTime()) / 86400000);
  const time = dt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  if (diff === 0) return `Today ${time}`;
  if (diff === 1) return `Yesterday ${time}`;
  return `${diff} days ago ${time}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Inline shared module components (module-ui.jsx equivalents)
// ─────────────────────────────────────────────────────────────────────────────

interface MHeaderProps {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  sub?: string;
}

function MHeader({ eyebrow, title, titleAccent, sub }: MHeaderProps) {
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

interface MSectionProps {
  title: string;
  children: React.ReactNode;
}

function MSection({ title, children }: MSectionProps) {
  return (
    <View style={mu.sectionWrap}>
      <Text style={[typography.eyebrow, mu.sectionTitle]}>{title}</Text>
      {children}
    </View>
  );
}

interface StatProps {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}

function Stat({ label, value, sub, color }: StatProps) {
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

interface SeverityScaleProps {
  value: number;
  onChange: (v: number) => void;
  max?: number;
  accessibilityHint?: string;
}

function SeverityScale({
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

interface EvidenceBarProps {
  level: EvidenceLevel;
}

function EvidenceBar({ level }: EvidenceBarProps) {
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

interface ChipProps {
  label: string;
  active: boolean;
  onPress: () => void;
  accessibilityLabel: string;
}

function Chip({ label, active, onPress, accessibilityLabel }: ChipProps) {
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

// Simple inline progress bar (no animation; respects reduceMotion at call-site)
interface ProgressBarProps {
  pct: number;
  color?: string;
  height?: number;
}

function InlineProgressBar({ pct, color, height = 4 }: ProgressBarProps) {
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

// ─────────────────────────────────────────────────────────────────────────────
// DRSP sample chart (simplified bar chart — SVG not available inline here,
// using RN View-based bars for the preview in pmddPDF section)
// ─────────────────────────────────────────────────────────────────────────────

interface DRSPBarChartProps {
  data: Array<{ day: number; score: number }>;
}

function DRSPBarChart({ data }: DRSPBarChartProps) {
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

// ─────────────────────────────────────────────────────────────────────────────
// INITIAL STATE
// ─────────────────────────────────────────────────────────────────────────────

const INITIAL_STATE: PMDDState = {
  cycleDay: 22,
  cycleLen: 28,
  lastPeriod: null,
  entries: {},
  triggerLog: {},
  rageEpisodes: [],
  ssriConfig: null,
  ssriLog: {},
  safetyPlanEditOverride: false,
  conditions: ['PMDD'],
  adhd: 'No',
  hbcActive: false,
  hbcType: '',
  yearOfBirth: null,
  exportSI: false,
  featureFlags: {},
};

// ─────────────────────────────────────────────────────────────────────────────
// MODULE TABS
// ─────────────────────────────────────────────────────────────────────────────

type ModuleId =
  | 'pmddPDF'
  | 'crisis'
  | 'lutealPred'
  | 'safetyPlan'
  | 'ssri'
  | 'supps'
  | 'rage'
  | 'relImpact'
  | 'workImpact'
  | 'triggers'
  | 'community';

interface TabDef {
  id: ModuleId;
  label: string;
}

const TABS: TabDef[] = [
  { id: 'pmddPDF', label: 'DRSP Log' },
  { id: 'crisis', label: 'Crisis' },
  { id: 'lutealPred', label: 'Luteal' },
  { id: 'safetyPlan', label: 'Safety' },
  { id: 'ssri', label: 'SSRI' },
  { id: 'supps', label: 'Supps' },
  { id: 'rage', label: 'Episodes' },
  { id: 'relImpact', label: 'Relations' },
  { id: 'workImpact', label: 'Work' },
  { id: 'triggers', label: 'Triggers' },
  { id: 'community', label: 'Community' },
];

// ─────────────────────────────────────────────────────────────────────────────
// SUB-MODULE COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

// F9 · DRSP LOG SUMMARY
interface PMDDPDFProps {
  state: PMDDState;
}

function PMDDPDFModule({ state }: PMDDPDFProps) {
  const sampleData = Array.from({ length: 28 }, (_, i) => ({
    day: i + 1,
    score:
      i < 5
        ? 4 + (i % 2)
        : i < 14
        ? 1 + (i % 2)
        : i < 18
        ? 2 + (i % 2)
        : Math.min(6, 3 + Math.floor((i - 17) / 2)),
  }));

  const handleDownload = useCallback(() => {
    // PDF generation requires jsPDF which is not available in RN.
    // We surface a share sheet / mailto instead.
    const subject = encodeURIComponent('HormonaIQ DRSP Log Summary');
    const body = encodeURIComponent(
      'Please attach your generated PDF from the HormonaIQ web app.\n\n— from HormonaIQ',
    );
    Linking.openURL(`mailto:?subject=${subject}&body=${body}`).catch(() => {
      Alert.alert(
        'Email not available',
        'Please set up an email account to share your report.',
      );
    });
  }, []);

  const handleEmail = useCallback(() => {
    const subject = encodeURIComponent('HormonaIQ DRSP report');
    const body = encodeURIComponent(
      'Generate PDF first, then attach.\n\n— from HormonaIQ',
    );
    Linking.openURL(`mailto:?subject=${subject}&body=${body}`).catch(() => {
      Alert.alert(
        'Email not available',
        'Please set up an email account to share your report.',
      );
    });
  }, []);

  const loggedCount = Object.keys(state.entries).length;

  return (
    <View>
      <MHeader
        eyebrow="F9 · YOUR DRSP LOG SUMMARY"
        title="Physician-ready, "
        titleAccent="2 cycles deep."
        sub="Generated from your prospective DRSP record. Not a diagnosis."
      />
      <View style={[s.clinicalCard, { marginBottom: 14 }]}>
        <Text style={s.clinicalHeading}>
          DRSP LOG PREVIEW · {loggedCount} DAYS LOGGED
        </Text>
        <Text style={s.clinicalItalic}>
          Daily Record of Severity of Problems
        </Text>
        <DRSPBarChart data={sampleData} />
        <Text style={[typography.body, { fontSize: 11, marginTop: 12, lineHeight: 18 }]}>
          <Text style={{ fontFamily: fonts.sansSemibold }}>Pattern summary:</Text>{' '}
          Tap "Download PDF" to generate your physician-ready report from your
          prospective DRSP record. Not a diagnosis — bring to a licensed
          clinician.
        </Text>
        {!state.exportSI && (
          <Text style={s.exportNote}>
            Item 12 (suicidal ideation) excluded from this export.
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={[buttons.primary, s.fullWidth]}
        onPress={handleDownload}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Download DRSP PDF report"
      >
        <Text style={buttons.primaryLabel}>⤓ Download PDF</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[buttons.outline, s.fullWidth, { marginTop: 8 }]}
        onPress={handleEmail}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Email DRSP report to my doctor"
      >
        <Text style={buttons.outlineLabel}>Email to my doctor</Text>
      </TouchableOpacity>
    </View>
  );
}

// F19 · CRISIS SAFETY
function CrisisModule() {
  const crisisTiers = [
    {
      tier: 1,
      t: 'Grounding',
      sub: '60-second breath, 5-4-3-2-1 senses, cold water',
      icon: '◯',
      color: colors.mintMist,
    },
    {
      tier: 2,
      t: 'Reach out',
      sub: 'Text a chosen person from your safety plan',
      icon: '☎',
      color: colors.butter,
    },
    {
      tier: 3,
      t: 'Crisis line',
      sub: '988 Suicide & Crisis Lifeline · text or call',
      icon: '♡',
      color: colors.coralSoft,
    },
  ];

  const handleTierPress = useCallback((tier: number) => {
    if (tier === 3) {
      Linking.openURL('tel:988').catch(() => {
        Alert.alert('Crisis Support', '988 Suicide & Crisis Lifeline\nCall or text: 988');
      });
    }
  }, []);

  return (
    <View>
      <MHeader
        eyebrow="F19 · CRISIS SAFETY"
        title="You are "
        titleAccent="not alone"
        sub="Three tiers, no alarms. You decide what helps."
      />
      {crisisTiers.map((t) => (
        <TouchableOpacity
          key={t.tier}
          style={[
            cards.cardWarm,
            s.crisisTile,
            { backgroundColor: t.color },
          ]}
          onPress={() => handleTierPress(t.tier)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`Crisis tier ${t.tier}: ${t.t}. ${t.sub}`}
        >
          <View style={s.crisisIcon}>
            <Text style={s.crisisIconText}>{t.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.crisisTierLabel}>TIER {t.tier}</Text>
            <Text style={s.crisisTierTitle}>{t.t}</Text>
            <Text style={s.crisisTierSub}>{t.sub}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <Text style={[typography.caption, { marginTop: 14, lineHeight: 20 }]}>
        This appears automatically during your historical high-severity luteal
        window. You are also in control: tap "I'm not okay" anytime from Home.
      </Text>
    </View>
  );
}

// F34 · LUTEAL PREDICTOR
function LutealPredModule() {
  return (
    <View>
      <MHeader
        eyebrow="F34 · LUTEAL PREDICTOR"
        title="Heads up: "
        titleAccent="your luteal"
        sub="Predicted from your cycle history. Never overdue language."
      />
      <View style={[cards.cardWarm, s.centeredCard]}>
        <Text style={s.lutealCountdown}>4 days</Text>
        <Text style={[typography.caption, { marginTop: 2 }]}>
          ± 1 day · 87% confidence
        </Text>
      </View>
      <View style={[cards.cardMint, { padding: 14 }]}>
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

// F35 · SAFETY PLAN
interface SafetyPlanProps {
  state: PMDDState;
  setState: React.Dispatch<React.SetStateAction<PMDDState>>;
}

const DEFAULT_SAFETY_ITEMS: SafetyPlanItem[] = [
  {
    k: 'warning',
    l: 'Warning signs',
    v: 'Snapping at partner · waking at 4am · canceling plans',
  },
  {
    k: 'cope',
    l: 'Things that help me cope',
    v: 'Walk outside · cold shower · noise-cancelling headphones',
  },
  {
    k: 'people',
    l: 'People I can text',
    v: 'Maya · Mom · Dr. Reyes',
  },
  {
    k: 'pro',
    l: 'Professionals',
    v: 'Therapist Jen — Tue/Thu · 988 Lifeline',
  },
  {
    k: 'safe',
    l: 'Make environment safe',
    v: 'Alcohol out of house · meds in lockbox',
  },
];

function SafetyPlanModule({ state, setState }: SafetyPlanProps) {
  const [items] = useState<SafetyPlanItem[]>(DEFAULT_SAFETY_ITEMS);
  const phase = phaseForDay(state.cycleDay, state.cycleLen);
  const lutealLocked = phase === 'L' && !state.safetyPlanEditOverride;

  const requestOverride = useCallback(() => {
    Alert.alert(
      'Edit safety plan?',
      'Your safety plan was built when you were well. Are you sure you want to edit it now?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Edit anyway',
          onPress: () =>
            setState((prev) => ({ ...prev, safetyPlanEditOverride: true })),
        },
      ],
    );
  }, [setState]);

  return (
    <View>
      <MHeader
        eyebrow="F35 · SAFETY PLAN"
        title="Built when you were "
        titleAccent="well."
        sub="Surfaces automatically before high-risk luteal days."
      />
      {items.map((it) => (
        <View key={it.k} style={[cards.cardWarm, s.safetyItem]}>
          <Text style={[typography.caption, { marginBottom: 4 }]}>{it.l}</Text>
          <Text style={[typography.body, { fontSize: 13, lineHeight: 22 }]}>
            {it.v}
          </Text>
        </View>
      ))}
      {lutealLocked ? (
        <>
          <View
            style={[
              buttons.soft,
              s.fullWidth,
              { marginTop: 8, opacity: 0.45 },
            ]}
          >
            <Text style={[buttons.softLabel, { textAlign: 'center' }]}>
              Update plan (read-only in luteal)
            </Text>
          </View>
          <TouchableOpacity
            style={[s.ghostBtn, s.fullWidth, { marginTop: 6 }]}
            onPress={requestOverride}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Request to edit safety plan anyway"
          >
            <Text style={s.ghostBtnLabel}>I want to edit anyway</Text>
          </TouchableOpacity>
          <Text style={s.safetyLockCaption}>
            Editing is read-only during your luteal phase to protect a plan you
            built when well.
          </Text>
        </>
      ) : (
        <TouchableOpacity
          style={[buttons.soft, s.fullWidth, { marginTop: 8 }]}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Update safety plan"
        >
          <Text style={buttons.softLabel}>Update plan</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// F36 · SSRI LUTEAL DOSING
interface SSRIProps {
  state: PMDDState;
  setState: React.Dispatch<React.SetStateAction<PMDDState>>;
}

const SSRI_OPTIONS = [
  'Fluoxetine',
  'Sertraline',
  'Citalopram',
  'Escitalopram',
  'Paroxetine',
  'Other',
];

interface PatternOption {
  v: string;
  l: string;
}

const SSRI_PATTERNS: PatternOption[] = [
  { v: 'continuous', l: 'Continuous (daily)' },
  { v: 'luteal-phase', l: 'Luteal-phase only (day 14 → menses)' },
  { v: 'symptom-onset', l: 'Symptom-onset' },
];

function SSRIModule({ state, setState }: SSRIProps) {
  const cfg = state.ssriConfig;
  const log = state.ssriLog;
  const [showEditor, setShowEditor] = useState(!cfg);
  const [editName, setEditName] = useState(cfg?.name ?? 'Sertraline');
  const [editDose, setEditDose] = useState(String(cfg?.dose ?? 50));
  const [editPattern, setEditPattern] = useState(
    cfg?.pattern ?? 'luteal-phase',
  );
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayLog = log[todayKey] ?? {};
  const [note, setNote] = useState(todayLog.note ?? '');

  const saveConfig = useCallback(() => {
    setState((prev) => ({
      ...prev,
      ssriConfig: {
        name: editName,
        dose: Number(editDose) || 0,
        pattern: editPattern,
      },
    }));
    setShowEditor(false);
  }, [editName, editDose, editPattern, setState]);

  const setTaken = useCallback(
    (taken: boolean) => {
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
    },
    [todayKey, setState],
  );

  const persistNote = useCallback(
    (val: string) => {
      setNote(val);
      setState((prev) => ({
        ...prev,
        ssriLog: {
          ...prev.ssriLog,
          [todayKey]: { ...(prev.ssriLog[todayKey] ?? {}), note: val },
        },
      }));
    },
    [todayKey, setState],
  );

  // Last 7 days adherence × DRSP
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
        eyebrow="F36 · SSRI LUTEAL DOSING"
        title="Your meds, "
        titleAccent="tracked against DRSP."
      />

      {cfg && !showEditor ? (
        <View style={[cards.cardWarm, s.ssriCfgCard]}>
          <View style={s.ssriCfgHeader}>
            <Text style={typography.eyebrow}>CURRENT</Text>
            <TouchableOpacity
              style={s.editBtn}
              onPress={() => setShowEditor(true)}
              accessibilityRole="button"
              accessibilityLabel="Edit SSRI configuration"
            >
              <Text style={s.editBtnLabel}>Edit</Text>
            </TouchableOpacity>
          </View>
          <Text style={s.ssriCfgName}>
            {cfg.name} {cfg.dose} mg
          </Text>
          <Text style={[typography.caption, { marginTop: 2 }]}>
            {patternLabel}
          </Text>
        </View>
      ) : (
        <View style={[cards.cardWarm, s.ssriEditorCard]}>
          <Text style={[typography.eyebrow, { marginBottom: 8 }]}>
            {cfg ? 'EDIT CONFIG' : 'SET UP YOUR SSRI'}
          </Text>
          <Text style={[typography.caption, s.fieldLabel]}>SSRI</Text>
          <View style={s.pickerWrap}>
            {SSRI_OPTIONS.map((o) => (
              <TouchableOpacity
                key={o}
                style={[s.pickerOption, editName === o && s.pickerOptionActive]}
                onPress={() => setEditName(o)}
                accessibilityRole="button"
                accessibilityLabel={`Select ${o}`}
                accessibilityState={{ selected: editName === o }}
              >
                <Text
                  style={[
                    s.pickerOptionLabel,
                    editName === o && s.pickerOptionLabelActive,
                  ]}
                >
                  {o}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[typography.caption, s.fieldLabel]}>Dose (mg)</Text>
          <TextInput
            style={s.textInput}
            value={editDose}
            onChangeText={setEditDose}
            keyboardType="numeric"
            placeholder="e.g. 50"
            placeholderTextColor={colors.inkDisabled}
            accessibilityLabel="SSRI dose in milligrams"
          />
          <Text style={[typography.caption, s.fieldLabel]}>Pattern</Text>
          {SSRI_PATTERNS.map((p) => (
            <TouchableOpacity
              key={p.v}
              style={[
                s.pickerOption,
                s.pickerOptionWide,
                editPattern === p.v && s.pickerOptionActive,
              ]}
              onPress={() => setEditPattern(p.v)}
              accessibilityRole="button"
              accessibilityLabel={`Select pattern: ${p.l}`}
              accessibilityState={{ selected: editPattern === p.v }}
            >
              <Text
                style={[
                  s.pickerOptionLabel,
                  editPattern === p.v && s.pickerOptionLabelActive,
                ]}
              >
                {p.l}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={s.editorActions}>
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
                style={[s.ghostBtn, { flex: 1 }]}
                onPress={() => setShowEditor(false)}
                accessibilityRole="button"
                accessibilityLabel="Cancel editing SSRI configuration"
              >
                <Text style={s.ghostBtnLabel}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}

      {cfg && (
        <MSection title="TODAY'S DOSE">
          <View style={[s.doseRow, { marginBottom: 10 }]}>
            <TouchableOpacity
              style={[
                buttons.soft,
                { flex: 1 },
                todayLog.taken === true && s.takenActive,
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
                todayLog.taken === false && s.missedActive,
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
            style={s.textInput}
            placeholder="Note (optional)"
            value={note}
            onChangeText={persistNote}
            placeholderTextColor={colors.inkDisabled}
            accessibilityLabel="Optional note about today's dose"
          />
        </MSection>
      )}

      <MSection title="LAST 7 DAYS · ADHERENCE × DRSP">
        <View style={s.adherenceGrid}>
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
                <View style={[s.adherenceCell, { backgroundColor: bg }]}>
                  <Text style={[s.adherenceMark, { color: fg }]}>
                    {t === true ? '✓' : t === false ? '✕' : '·'}
                  </Text>
                </View>
                <Text style={[typography.data, s.adherenceDrsp]}>
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

// F37 · SUPPLEMENTS
interface SuppsProps {
  reduceMotion: boolean;
}

const INITIAL_SUPPS: SupplementItem[] = [
  { n: 'Calcium', dose: 1200, unit: 'mg', d: 'Daily', e: 'Strong' },
  {
    n: 'Chasteberry (Vitex)',
    dose: 20,
    unit: 'mg',
    d: 'Daily',
    e: 'Moderate',
  },
  { n: 'Vit B6 (Pyridoxine)', dose: 100, unit: 'mg', d: 'Luteal only', e: 'Limited' },
  {
    n: 'Magnesium glycinate',
    dose: 300,
    unit: 'mg',
    d: 'Evenings',
    e: 'Moderate',
  },
  {
    n: 'Evening primrose oil',
    dose: 1000,
    unit: 'mg',
    d: 'Daily',
    e: 'Unsupported',
  },
];

function isB6(name: string): boolean {
  return /B6|Pyridoxine/i.test(name);
}

function SuppsModule({ reduceMotion: _reduceMotion }: SuppsProps) {
  const [supps, setSupps] = useState<SupplementItem[]>(INITIAL_SUPPS);
  const [b6WarnIdx, setB6WarnIdx] = useState<number | null>(null);

  const updateDose = useCallback(
    (i: number, value: string) => {
      const newDose = Number(value) || 0;
      const wasUnder = (supps[i].dose ?? 0) <= 100;
      setSupps((prev) =>
        prev.map((item, idx) => (idx === i ? { ...item, dose: newDose } : item)),
      );
      if (isB6(supps[i].n) && wasUnder && newDose > 100) {
        setB6WarnIdx(i);
      }
    },
    [supps],
  );

  return (
    <View>
      <MHeader
        eyebrow="F37 · SUPPLEMENTS"
        title="Evidence ratings, "
        titleAccent="not vibes."
        sub="Peer-reviewed strength of evidence for each."
      />
      {supps.map((supp, i) => {
        const showWarning = isB6(supp.n) && supp.dose >= 100;
        return (
          <View key={supp.n} style={[cards.cardWarm, s.suppCard]}>
            <View style={s.suppRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.suppName}>{supp.n}</Text>
                <Text style={[typography.caption, { fontSize: 12 }]}>
                  {supp.d}
                </Text>
                <View style={s.suppDoseRow}>
                  <TextInput
                    style={s.suppDoseInput}
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
              <View style={s.b6Warning}>
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
        style={[buttons.soft, s.fullWidth, { marginTop: 8 }]}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Add supplement"
      >
        <Text style={buttons.softLabel}>+ Add supplement</Text>
      </TouchableOpacity>

      {/* B6 dose warning modal */}
      <Modal
        visible={b6WarnIdx !== null}
        animationType="fade"
        transparent
        onRequestClose={() => setB6WarnIdx(null)}
      >
        <Pressable
          style={s.modalBackdrop}
          onPress={() => setB6WarnIdx(null)}
          accessibilityRole="button"
          accessibilityLabel="Close B6 warning"
        >
          <Pressable style={s.modalSheet} onPress={() => {}}>
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
              style={[buttons.soft, s.fullWidth]}
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

// F38 · MOOD EPISODES
interface RageProps {
  state: PMDDState;
  setState: React.Dispatch<React.SetStateAction<PMDDState>>;
}

const EPISODE_TYPES = ['Rage', 'Crying', 'Dissociation', 'Panic', 'Numbness'];

function RageModule({ state, setState }: RageProps) {
  const [intensity, setIntensity] = useState(0);
  const [type, setType] = useState<string | null>(null);
  const [duration, setDuration] = useState('');
  const [note, setNote] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);

  const episodes = state.rageEpisodes;
  const recent = episodes.slice(0, 5);

  const save = useCallback(() => {
    if (!type || !intensity) return;
    const evt: RageEpisode = {
      at: Date.now(),
      type,
      intensity,
      duration: duration || null,
      note: note || null,
    };
    setState((prev) => ({
      ...prev,
      rageEpisodes: [evt, ...prev.rageEpisodes].slice(0, 200),
    }));
    setIntensity(0);
    setType(null);
    setDuration('');
    setNote('');
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  }, [type, intensity, duration, note, setState]);

  const canSave = !!type && intensity > 0;

  return (
    <View>
      <MHeader
        eyebrow="F38 · MOOD EPISODES"
        title="One-tap "
        titleAccent="capture."
        sub="No judgement. Just data for your DRSP."
      />
      <MSection title="WHAT'S HAPPENING">
        <View style={s.chipRow}>
          {EPISODE_TYPES.map((t) => (
            <Chip
              key={t}
              label={t}
              active={type === t}
              onPress={() => setType(t)}
              accessibilityLabel={`Select episode type: ${t}`}
            />
          ))}
        </View>
      </MSection>
      <MSection title="INTENSITY 1–5">
        <SeverityScale
          value={intensity}
          onChange={setIntensity}
          max={5}
          accessibilityHint="Rate the intensity of this episode"
        />
      </MSection>
      <MSection title="DURATION (OPTIONAL)">
        <TextInput
          style={s.textInput}
          placeholder="e.g. 22 min"
          value={duration}
          onChangeText={setDuration}
          placeholderTextColor={colors.inkDisabled}
          accessibilityLabel="Episode duration, optional"
        />
      </MSection>
      <MSection title="WHAT TRIGGERED IT (OPTIONAL)">
        <TextInput
          style={s.textInput}
          placeholder="e.g. Snapped over dishes"
          value={note}
          onChangeText={setNote}
          placeholderTextColor={colors.inkDisabled}
          accessibilityLabel="What triggered this episode, optional"
        />
      </MSection>
      <TouchableOpacity
        style={[
          buttons.primary,
          s.fullWidth,
          { marginBottom: 18 },
          !canSave && { opacity: 0.5 },
        ]}
        onPress={save}
        disabled={!canSave}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={
          savedFlash ? 'Episode saved' : 'Save episode — takes about 3 seconds'
        }
        accessibilityState={{ disabled: !canSave }}
      >
        <Text style={buttons.primaryLabel}>
          {savedFlash ? '✓ Saved' : 'Save · 3 sec'}
        </Text>
      </TouchableOpacity>
      <MSection title={recent.length ? 'RECENT EPISODES' : 'NO EPISODES YET'}>
        {recent.length === 0 && (
          <Text style={[typography.caption, { fontSize: 12 }]}>
            Saved episodes appear here for cycle-by-cycle DRSP context.
          </Text>
        )}
        {recent.map((r, i) => (
          <View key={i} style={[cards.card, s.episodeCard]}>
            <View style={s.episodeHeader}>
              <Text style={s.episodeType}>
                {r.type} · {r.intensity}/5
              </Text>
              {r.duration && (
                <Text style={[typography.caption, { fontSize: 11 }]}>
                  {r.duration}
                </Text>
              )}
            </View>
            <Text style={[typography.caption, { fontSize: 12, marginBottom: 2 }]}>
              {formatEpisodeTime(r.at)}
            </Text>
            {r.note && (
              <Text style={s.episodeNote}>"{r.note}"</Text>
            )}
          </View>
        ))}
      </MSection>
    </View>
  );
}

// F39 · RELATIONSHIP IMPACT
function RelImpactModule() {
  const conflicts = [
    {
      who: 'Partner',
      when: 'Yesterday',
      sev: 4,
      ctrl: 2,
      n: 'Out-of-proportion reaction · day 22',
    },
    {
      who: 'Mom',
      when: '5 days ago',
      sev: 3,
      ctrl: 2,
      n: 'Phone call escalated',
    },
    {
      who: 'Coworker',
      when: '8 days ago',
      sev: 2,
      ctrl: 4,
      n: 'Tone in slack · self-corrected',
    },
  ];

  return (
    <View>
      <MHeader
        eyebrow="F39 · RELATIONSHIP IMPACT"
        title="Conflicts, "
        titleAccent="logged briefly."
        sub="Builds the documentation for Criterion B and couples therapy."
      />
      {conflicts.map((r, i) => (
        <View key={i} style={[cards.cardWarm, s.conflictCard]}>
          <View style={s.conflictHeader}>
            <Text style={s.conflictWho}>{r.who}</Text>
            <Text style={[typography.caption, { fontSize: 11 }]}>{r.when}</Text>
          </View>
          <Text style={s.conflictNote}>{r.n}</Text>
          <View style={s.conflictMetrics}>
            <Text style={[typography.caption, { fontSize: 11 }]}>
              Severity{' '}
              <Text
                style={{
                  fontFamily: fonts.sansSemibold,
                  color: colors.severitySevere,
                }}
              >
                {r.sev}/5
              </Text>
            </Text>
            <Text style={[typography.caption, { fontSize: 11 }]}>
              Control{' '}
              <Text
                style={{
                  fontFamily: fonts.sansSemibold,
                  color: colors.severityMild,
                }}
              >
                {r.ctrl}/5
              </Text>
            </Text>
          </View>
        </View>
      ))}
      <TouchableOpacity
        style={[buttons.soft, s.fullWidth, { marginTop: 8 }]}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Log a new conflict"
      >
        <Text style={buttons.softLabel}>+ Log conflict</Text>
      </TouchableOpacity>
    </View>
  );
}

// F40 · WORK / ACADEMIC IMPACT
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
        eyebrow="F40 · WORK / ACADEMIC"
        title="Hours lost, "
        titleAccent="tracked honestly."
        sub="For accommodations, FMLA, or disability documentation."
      />
      <View style={s.statsRow}>
        <Stat
          label="This luteal"
          value="14 hrs"
          sub="Hours lost"
          color={colors.severitySevere}
        />
        <Stat label="Last luteal" value="11 hrs" sub="Same window" />
        <Stat
          label="Follicular"
          value="0 hrs"
          sub="Baseline"
          color={colors.severityMild}
        />
      </View>
      <MSection title="THIS CYCLE">
        {workDays.map((d, i) => (
          <View key={i} style={[cards.card, s.workCard]}>
            <View style={s.workCardHeader}>
              <Text style={s.workCardTitle}>
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

// F41 · TRIGGER CORRELATION
interface TriggersProps {
  state: PMDDState;
  setState: React.Dispatch<React.SetStateAction<PMDDState>>;
}

const EXERCISE_OPTS = ['None', 'Light', 'Moderate', 'Intense'];

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

const TRIGGER_LABEL_MAP: Record<string, string> = {
  sleep: 'Sleep hours',
  caffeine: 'Caffeine cups',
  alcohol: 'Alcohol drinks',
  stress: 'Stress level',
  isolation: 'Social isolation',
};

function TriggersModule({ state, setState }: TriggersProps) {
  const todayKey = new Date().toISOString().slice(0, 10);
  const log = state.triggerLog;
  const today = log[todayKey] ?? {};

  const setField = useCallback(
    (k: string, v: number | string) => {
      setState((prev) => ({
        ...prev,
        triggerLog: {
          ...prev.triggerLog,
          [todayKey]: { ...(prev.triggerLog[todayKey] ?? {}), [k]: v },
        },
      }));
    },
    [todayKey, setState],
  );

  const triggerEntries = useMemo(() => Object.entries(log), [log]);
  const enough = triggerEntries.length >= 30;

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
      const denomX = Math.sqrt(
        pairs.reduce((s, p) => s + Math.pow(p[0] - meanX, 2), 0),
      );
      const denomY = Math.sqrt(
        pairs.reduce((s, p) => s + Math.pow(p[1] - meanY, 2), 0),
      );
      const r = denomX && denomY ? num / (denomX * denomY) : 0;
      results.push({ feature: f, r, n });
    });

    // Exercise as categorical
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
        eyebrow="F41 · TRIGGER CORRELATION"
        title="Your "
        titleAccent="specific"
        sub="Daily inputs correlated against your next-day DRSP."
      />
      <MSection title="LOG TODAY'S TRIGGERS">
        <View style={[cards.cardWarm, { padding: 14 }]}>
          <Text style={[typography.caption, s.fieldLabel]}>Sleep hours</Text>
          <TextInput
            style={[s.textInput, { marginBottom: 10 }]}
            value={today.sleep != null ? String(today.sleep) : ''}
            onChangeText={(v) =>
              setField('sleep', v === '' ? '' : Number(v))
            }
            keyboardType="decimal-pad"
            placeholder="e.g. 7"
            placeholderTextColor={colors.inkDisabled}
            accessibilityLabel="Hours of sleep last night"
          />
          <View style={s.doseRow}>
            <View style={{ flex: 1 }}>
              <Text style={[typography.caption, s.fieldLabel]}>
                Caffeine cups
              </Text>
              <TextInput
                style={s.textInput}
                value={today.caffeine != null ? String(today.caffeine) : ''}
                onChangeText={(v) =>
                  setField('caffeine', v === '' ? '' : Number(v))
                }
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={colors.inkDisabled}
                accessibilityLabel="Number of caffeinated drinks today"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[typography.caption, s.fieldLabel]}>
                Alcohol drinks
              </Text>
              <TextInput
                style={s.textInput}
                value={today.alcohol != null ? String(today.alcohol) : ''}
                onChangeText={(v) =>
                  setField('alcohol', v === '' ? '' : Number(v))
                }
                keyboardType="number-pad"
                placeholder="0"
                placeholderTextColor={colors.inkDisabled}
                accessibilityLabel="Number of alcoholic drinks today"
              />
            </View>
          </View>
          <Text style={[typography.caption, s.fieldLabel, { marginTop: 10 }]}>
            Exercise
          </Text>
          <View style={s.chipRow}>
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
          <Text style={[typography.caption, s.fieldLabel, { marginTop: 10 }]}>
            Stress (1–5)
          </Text>
          <SeverityScale
            value={(today.stress as number) || 0}
            onChange={(v) => setField('stress', v)}
            max={5}
            accessibilityHint="Rate your stress level today"
          />
          <Text style={[typography.caption, s.fieldLabel, { marginTop: 10 }]}>
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
          <View style={[cards.cardWarm, { padding: 14 }]}>
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
                <View key={t.feature} style={[cards.card, s.corrCard]}>
                  <View style={s.corrHeader}>
                    <Text style={s.corrLabel}>
                      {TRIGGER_LABEL_MAP[t.feature] ?? t.feature}
                    </Text>
                    <Text
                      style={[
                        typography.data,
                        {
                          fontSize: 12,
                          color: t.r > 0 ? colors.severitySevere : colors.severityMild,
                        },
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
              <View style={[cards.card, s.corrCard]}>
                <Text style={s.corrLabel}>Exercise level vs next-day DRSP</Text>
                {corr.exercise.map((g) => (
                  <View key={g.k} style={s.exerciseRow}>
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

// F42 · PHASE-MATCHED COMMUNITY
interface CommunityProps {
  state: PMDDState;
  setState: React.Dispatch<React.SetStateAction<PMDDState>>;
}

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

function CommunityModule({ state, setState }: CommunityProps) {
  const wallOn = !!(state.featureFlags?.lutealWall);

  const toggleWall = useCallback(() => {
    setState((prev) => ({
      ...prev,
      featureFlags: {
        ...prev.featureFlags,
        lutealWall: !prev.featureFlags?.lutealWall,
      },
    }));
  }, [setState]);

  return (
    <View>
      <MHeader
        eyebrow="F42 · PHASE-MATCHED COMMUNITY"
        title="You're "
        titleAccent="not alone"
        sub="Anonymous. No profiles. No feed. Just numbers."
      />
      <View style={[cards.cardMint, s.communityCount]}>
        <Text style={s.communityNumber}>2,847</Text>
        <Text style={[typography.caption, { marginTop: 4 }]}>
          others on day 19–22 of their cycle right now
        </Text>
      </View>
      {COMMUNITY_STATS.map((r) => (
        <View key={r.l} style={[cards.card, s.communityStatRow]}>
          <Text style={[typography.body, { fontSize: 13 }]}>{r.l}</Text>
          <Text style={s.communityStatValue}>{r.v}</Text>
        </View>
      ))}
      <Text style={[typography.caption, { marginTop: 14, fontSize: 11 }]}>
        Aggregated {'>'} 100 users · no individual data shared.
      </Text>

      {/* T-25 — Luteal Wall opt-in panel */}
      <View style={[cards.cardWarm, s.lutealWallCard]}>
        <Text style={[typography.eyebrow, { marginBottom: 6 }]}>
          LUTEAL WALL · OPT-IN
        </Text>
        {!wallOn ? (
          <>
            <Text
              style={[typography.body, { fontSize: 13, marginBottom: 10 }]}
            >
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
              <View key={i} style={[cards.card, s.wallMessage]}>
                <Text style={s.wallMessageText}>"{m}"</Text>
              </View>
            ))}
            <View
              style={[
                buttons.soft,
                s.fullWidth,
                { marginTop: 8, opacity: 0.55 },
              ]}
            >
              <Text
                style={[
                  buttons.softLabel,
                  { textAlign: 'center' },
                ]}
              >
                Post a message
              </Text>
            </View>
            <Text style={s.wallComingSoon}>
              Anonymous posting opens at v1 launch
            </Text>
          </>
        )}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Pattern Engine helper (used by PMDDScreen tab switcher for reference,
// but each sub-module is self-contained)
// ─────────────────────────────────────────────────────────────────────────────

function computePatternState(entries: Record<string, DayEntry>): PatternState {
  const loggedDays = Object.keys(entries).length;
  if (loggedDays < 7) return 'empty';
  if (loggedDays < 35) return 'early';
  return 'confirmed';
}

function computeLutealVsFollicular(
  entries: Record<string, DayEntry>,
  lastPeriod: string | null,
  cycleLen: number,
): {
  lutealMean: number | null;
  follMean: number | null;
  swing: number | null;
  topItems: Array<{ k: string; avg: number }>;
} {
  const lutealVals: number[] = [];
  const follVals: number[] = [];
  const itemSums: Record<string, number> = {};
  const itemCounts: Record<string, number> = {};

  Object.entries(entries).forEach(([k, e]) => {
    const cd = phaseDayFor(k, lastPeriod, cycleLen);
    if (!cd) return;
    const ph = phaseForDay(cd, cycleLen);
    const m = meanDRSP(e);
    if (m == null) return;
    if (ph === 'L') {
      lutealVals.push(m);
      Object.entries(e.drsp ?? {}).forEach(([key, v]) => {
        if (key === 'suicidal_ideation') return;
        itemSums[key] = (itemSums[key] ?? 0) + (Number(v) || 0);
        itemCounts[key] = (itemCounts[key] ?? 0) + 1;
      });
    } else if (ph === 'F') {
      follVals.push(m);
    }
  });

  const mean = (arr: number[]) =>
    arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null;

  const lutealMean = mean(lutealVals);
  const follMean = mean(follVals);
  const swing =
    lutealMean != null && follMean != null && follMean > 0
      ? lutealMean / follMean
      : null;

  const topItems = Object.entries(itemSums)
    .map(([k, sum]) => ({ k, avg: sum / (itemCounts[k] ?? 1) }))
    .sort((a, b) => b.avg - a.avg)
    .slice(0, 3);

  return { lutealMean, follMean, swing, topItems };
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────

export default function PMDDScreen() {
  const router = useRouter();
  const reduceMotion = useReducedMotion() ?? false;
  const [state, setState] = useState<PMDDState>(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<ModuleId>('pmddPDF');

  const patternState = computePatternState(state.entries);
  const { lutealMean, follMean, swing, topItems } =
    computeLutealVsFollicular(state.entries, state.lastPeriod, state.cycleLen);

  // Trigger correlations for the pattern module display
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
        return { ...td, withT: a, without: b, delta: a - b, n: withT.length + withoutT.length };
      })
      .filter(
        (t): t is NonNullable<typeof t> =>
          t !== null && Math.abs(t.delta) >= 0.5,
      );
  }, [state.entries, state.triggerLog]);

  const dynamicPatterns = useMemo(() => {
    const patterns: Array<{
      t: string;
      d: string;
      c: number;
      s: SeverityKey;
    }> = [];
    if (
      lutealMean != null &&
      follMean != null &&
      swing != null &&
      swing >= 1.5
    ) {
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
    switch (activeTab) {
      case 'pmddPDF':
        return <PMDDPDFModule state={state} />;
      case 'crisis':
        return <CrisisModule />;
      case 'lutealPred':
        return <LutealPredModule />;
      case 'safetyPlan':
        return <SafetyPlanModule state={state} setState={setState} />;
      case 'ssri':
        return <SSRIModule state={state} setState={setState} />;
      case 'supps':
        return <SuppsModule reduceMotion={reduceMotion} />;
      case 'rage':
        return <RageModule state={state} setState={setState} />;
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
    <SafeAreaView style={s.safeArea}>
      {/* Top bar */}
      <View style={s.topbar}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => router.push('/(app)/home')}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Back to home"
        >
          <Text style={s.backBtnLabel}>‹ Back</Text>
        </TouchableOpacity>
        <Text style={[typography.h3, { flex: 1, textAlign: 'center' }]}>
          PMDD
        </Text>
        <View style={s.backBtn} />
      </View>

      {/* Tab strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={s.tabStrip}
        contentContainerStyle={s.tabStripContent}
        accessibilityRole="tablist"
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[s.tab, active && s.tabActive]}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.75}
              accessibilityRole="tab"
              accessibilityLabel={`${tab.label} module tab`}
              accessibilityState={{ selected: active }}
            >
              <Text style={[s.tabLabel, active && s.tabLabelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Module content */}
      <ScrollView
        style={{ flex: 1, backgroundColor: colors.cream }}
        contentContainerStyle={s.moduleContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Pattern summary banner (shown above any module when confirmed) */}
        {patternState === 'confirmed' &&
          lutealMean != null &&
          follMean != null && (
            <View
              style={[
                cards.cardWarm,
                s.patternBanner,
                { borderLeftColor: colors.severitySevere },
              ]}
            >
              <Text style={s.patternBannerTitle}>
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
          )}

        {/* Pattern cards */}
        {patternState === 'confirmed' &&
          dynamicPatterns.map((p) => (
            <View
              key={p.t}
              style={[
                cards.cardWarm,
                s.patternCard,
                { borderLeftColor: SEVERITY_COLORS[p.s] },
              ]}
            >
              <View style={s.patternCardHeader}>
                <Text style={[s.patternCardTitle, { flex: 1, paddingRight: 8 }]}>
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
          ))}

        {renderModule()}

        <Text style={s.disclaimer}>
          HormonaIQ is not a substitute for medical advice. Not a diagnosis —
          discuss with your provider.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MODULE-UI STYLES (mu)
// ─────────────────────────────────────────────────────────────────────────────

const mu = StyleSheet.create({
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

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN STYLES (s)
// ─────────────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
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
    paddingHorizontal: 14,
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

  // Shared
  fullWidth: {
    width: '100%',
  },
  ghostBtn: {
    minHeight: 44,
    paddingHorizontal: 14,
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
    marginBottom: 14,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(27, 46, 37, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: 24,
    paddingBottom: 36,
  },
  disclaimer: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink3,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
  },

  // Pattern banner
  patternBanner: {
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
  },
  patternBannerTitle: {
    fontFamily: fonts.sansSemibold,
    fontSize: 13,
    marginBottom: 6,
    color: colors.ink,
  },
  patternCard: {
    padding: 14,
    marginBottom: 10,
    borderLeftWidth: 3,
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

  // Clinical card (DRSP PDF)
  clinicalCard: {
    backgroundColor: colors.creamWarm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
  clinicalHeading: {
    fontFamily: fonts.sansSemibold,
    fontSize: 11,
    letterSpacing: 0.7,
    borderBottomWidth: 1,
    borderBottomColor: colors.ink,
    paddingBottom: 8,
    marginBottom: 10,
    color: colors.ink,
  },
  clinicalItalic: {
    fontFamily: fonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 12,
    marginBottom: 10,
    color: colors.ink2,
  },
  exportNote: {
    fontFamily: fonts.sans,
    fontStyle: 'italic',
    fontSize: 10,
    marginTop: 8,
    color: colors.ink3,
  },

  // Crisis
  crisisTile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    marginBottom: 8,
    minHeight: 76,
  },
  crisisIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crisisIconText: {
    fontSize: 18,
  },
  crisisTierLabel: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: 'rgba(0,0,0,0.55)',
    marginBottom: 2,
  },
  crisisTierTitle: {
    fontFamily: fonts.sansSemibold,
    fontSize: 15,
    color: 'rgba(0,0,0,0.78)',
  },
  crisisTierSub: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
  },

  // Luteal predictor
  centeredCard: {
    padding: 18,
    marginBottom: 14,
    alignItems: 'center',
  },
  lutealCountdown: {
    fontFamily: fonts.mono,
    fontSize: 44,
    color: colors.eucalyptus,
    fontWeight: '500',
  },

  // Safety plan
  safetyItem: {
    padding: 14,
    marginBottom: 8,
  },
  safetyLockCaption: {
    fontFamily: fonts.sans,
    fontSize: 11,
    marginTop: 8,
    textAlign: 'center',
    color: colors.ink3,
  },

  // SSRI
  ssriCfgCard: {
    padding: 14,
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
    padding: 14,
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
    minHeight: 30,
  },
  adherenceMark: {
    fontFamily: fonts.mono,
    fontSize: 11,
  },
  adherenceDrsp: {
    fontSize: 10,
    marginTop: 4,
  },

  // Supplements
  suppCard: {
    padding: 14,
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
    height: 36,
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

  // Episodes
  episodeCard: {
    padding: 12,
    marginBottom: 6,
  },
  episodeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  episodeType: {
    fontFamily: fonts.sansSemibold,
    fontSize: 13,
    color: colors.ink,
  },
  episodeNote: {
    fontFamily: fonts.sans,
    fontSize: 12,
    fontStyle: 'italic',
    color: colors.ink2,
  },

  // Relationship impact
  conflictCard: {
    padding: 14,
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

  // Work impact
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
    padding: 18,
    marginBottom: 14,
    alignItems: 'center',
  },
  communityNumber: {
    fontFamily: fonts.mono,
    fontSize: 36,
    color: colors.eucalyptusDeep,
    fontWeight: '500',
  },
  communityStatRow: {
    padding: 12,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  communityStatValue: {
    fontFamily: fonts.mono,
    fontSize: 13,
    fontWeight: '500',
    color: colors.eucalyptus,
  },
  lutealWallCard: {
    marginTop: 18,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: colors.coral,
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
  wallComingSoon: {
    fontFamily: fonts.sans,
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
    color: colors.ink3,
  },
});
