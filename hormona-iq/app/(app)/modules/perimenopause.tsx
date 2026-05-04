// Perimenopause module — port of design-handoff/08-implementation-code/src/modules-3.jsx
// Covers: F16 Hot Flash Logger, F17 HRT Effectiveness, F22 STRAW+10, F25 Greene Climacteric,
//         F26 GSM Tracker, F27 Brain Fog, F13 Executive Check-in, F14 ADHD Med Effectiveness,
//         F15 Cycle Dosing Report, F21 ADHD-PMDD Overlap, F23 Multi-Condition Overlay,
//         F24 Irregular Cycle Mode, F30 Comprehensive PDF, F32 Diet × Symptoms,
//         F33 Food Photo, F6 Privacy Dashboard, F10 Notifications

import { useState, useCallback } from 'react';
import type { ReactElement } from 'react';
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Line, Polyline } from 'react-native-svg';
import { useReducedMotion } from 'react-native-reanimated';

import {
  buttons,
  cards,
  layout,
  typography,
} from '../../../src/constants/styles';
import { colors, fonts, radius, spacing } from '../../../src/constants/tokens';

// ─────────────────────────────────────────────
// Local types
// ─────────────────────────────────────────────

interface HotFlashEvent {
  at: number;
  intensity: 1 | 2 | 3;
}

interface HrtDayEntry {
  hotFlashCount?: number;
  sleepQuality?: number;
  mood?: number;
}

interface GsmDayEntry {
  dryness?: number;
  painSex?: number;
  urgency?: number;
  uti?: number;
  libido?: number;
}

interface BrainFogDayEntry {
  wordRetrieval?: number;
  misplacing?: number;
  names?: number;
  focus?: number;
}

interface IrregularSettings {
  irregularMode: boolean;
  anovulatory: boolean;
  pcosPhaseEst: boolean;
}

interface NotifSettings {
  dailyCheckin?: boolean;
  lutealHeadsUp?: boolean;
  safetyPlan?: boolean;
  patternFound?: boolean;
  weeklyDigest?: boolean;
  supplementReminder?: boolean;
  ssriReminder?: boolean;
  hotFlashCheckin?: boolean;
}

interface GreeneScores {
  [key: string]: number;
}

interface PerimenopauseState {
  yearOfBirth: number | null;
  conditions: string[];
  hotFlashLog: HotFlashEvent[];
  hrtTracking: Record<string, HrtDayEntry>;
  gsmScores: Record<string, GsmDayEntry>;
  brainFogLog: Record<string, BrainFogDayEntry>;
  greeneScores: GreeneScores;
  irregularSettings: IrregularSettings;
  notifSettings: NotifSettings;
  hbcActive: boolean;
  hbcType?: string;
  irregular?: boolean;
  lastPeriod?: string;
  entries?: Record<string, unknown>;
  cycleLen?: number;
  perimenopausalStatus?: string;
}

const INITIAL_STATE: PerimenopauseState = {
  yearOfBirth: null,
  conditions: ['Perimenopause'],
  hotFlashLog: [],
  hrtTracking: {},
  gsmScores: {},
  brainFogLog: {},
  greeneScores: {},
  irregularSettings: { irregularMode: false, anovulatory: false, pcosPhaseEst: false },
  notifSettings: {},
  hbcActive: false,
  irregular: false,
  cycleLen: 28,
  entries: {},
};

// ─────────────────────────────────────────────
// Inline shared components (src/components/module does not yet export these)
// ─────────────────────────────────────────────

interface MHeaderProps {
  eyebrow: string;
  title: string;
  titleAccent?: string;
  titleSuffix?: string;
  sub?: string;
}

function MHeader({ eyebrow, title, titleAccent, titleSuffix, sub }: MHeaderProps): ReactElement {
  return (
    <View style={sh.mheaderWrap}>
      <Text style={typography.eyebrow}>{eyebrow}</Text>
      <Text style={[typography.displaySm, sh.mheaderTitle]}>
        {title}
        {titleAccent ? (
          <Text style={{ color: colors.eucalyptus }}>{titleAccent}</Text>
        ) : null}
        {titleSuffix ?? ''}
      </Text>
      {sub ? (
        <Text style={[typography.body, { color: colors.ink2, fontSize: 14 }]}>{sub}</Text>
      ) : null}
    </View>
  );
}

interface StatProps {
  label: string;
  value: string;
  sub?: string;
  color?: string;
}

function Stat({ label, value, sub, color }: StatProps): ReactElement {
  return (
    <View style={[cards.card, sh.statCard]}>
      <Text style={[typography.caption, { marginBottom: 4 }]}>{label}</Text>
      <Text style={[typography.data, { fontSize: 22, color: color ?? colors.ink }]}>{value}</Text>
      {sub ? <Text style={[typography.caption, { fontSize: 11, marginTop: 2 }]}>{sub}</Text> : null}
    </View>
  );
}

interface SeverityProps {
  value: number;
  onChange: (n: number) => void;
  max?: number;
}

function Severity({ value, onChange, max = 6 }: SeverityProps): ReactElement {
  return (
    <View style={sh.severityRow}>
      {Array.from({ length: max }, (_, i) => i + 1).map((n) => (
        <TouchableOpacity
          key={n}
          style={[sh.severityBtn, value === n && sh.severityBtnActive]}
          onPress={() => onChange(n)}
          accessibilityRole="button"
          accessibilityLabel={`Severity ${n} of ${max}`}
          accessibilityState={{ selected: value === n }}
        >
          <Text style={[sh.severityBtnLabel, value === n && sh.severityBtnLabelActive]}>
            {n}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

interface ToggleRowProps {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  sub?: string;
}

function ToggleRow({ label, checked, onChange, sub }: ToggleRowProps): ReactElement {
  return (
    <View style={sh.toggleRow}>
      <View style={{ flex: 1, paddingRight: spacing.md }}>
        <Text style={{ fontFamily: fonts.sansMedium, fontSize: 14, color: colors.ink }}>{label}</Text>
        {sub ? <Text style={[typography.caption, { fontSize: 12, marginTop: 2 }]}>{sub}</Text> : null}
      </View>
      <Switch
        value={checked}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.eucalyptus }}
        thumbColor={colors.paper}
        accessibilityLabel={label}
        accessibilityRole="switch"
        accessibilityState={{ checked }}
        style={{ minHeight: 44 }}
      />
    </View>
  );
}

interface MSectionProps {
  title: string;
  children: ReactElement | ReactElement[] | null;
}

function MSection({ title, children }: MSectionProps): ReactElement {
  return (
    <View style={sh.msectionWrap}>
      <Text style={[typography.eyebrow, { marginBottom: spacing.sm }]}>{title}</Text>
      {children}
    </View>
  );
}

// ─────────────────────────────────────────────
// F16 — Hot Flash Logger
// ─────────────────────────────────────────────

interface HotFlashModuleProps {
  state: PerimenopauseState;
  setState: React.Dispatch<React.SetStateAction<PerimenopauseState>>;
}

function HotFlashModule({ state, setState }: HotFlashModuleProps): ReactElement {
  const currentYear = new Date().getFullYear();
  const age = currentYear - (state.yearOfBirth ?? 1985);
  const earlyOnset = age < 40 && state.conditions.includes('Perimenopause');
  const log = state.hotFlashLog ?? [];

  const logEvent = useCallback((intensity: 1 | 2 | 3): void => {
    const evt: HotFlashEvent = { at: Date.now(), intensity };
    setState((s) => ({
      ...s,
      hotFlashLog: [evt, ...(s.hotFlashLog ?? [])].slice(0, 200),
    }));
  }, [setState]);

  const now = Date.now();
  const last24h = log.filter((e) => now - e.at < 24 * 3600 * 1000);
  const isNight = (ts: number): boolean => {
    const h = new Date(ts).getHours();
    return h >= 22 || h < 6;
  };
  const dayCount = last24h.filter((e) => !isNight(e.at)).length;
  const nightCount = last24h.filter((e) => isNight(e.at)).length;
  const weekCount = log.filter((e) => now - e.at < 7 * 24 * 3600 * 1000).length;
  const ratio = last24h.length ? Math.round((nightCount / last24h.length) * 100) : 0;
  const fmtTime = (ts: number): string =>
    new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  const recent = log.slice(0, 6);

  const intensityOptions: Array<{ v: 1 | 2 | 3; l: string }> = [
    { v: 1, l: 'Mild' },
    { v: 2, l: 'Moderate' },
    { v: 3, l: 'Severe' },
  ];

  return (
    <View>
      <MHeader
        eyebrow="F16 · HOT FLASH LOGGER"
        title="Quick capture, "
        titleAccent="night-aware."
        sub="With cardiovascular risk pattern flagging."
      />
      <View style={[cards.cardWarm, { padding: 14, marginBottom: 14 }]}>
        <Text style={[typography.eyebrow, { marginBottom: 10 }]}>LOG A HOT FLASH</Text>
        <View style={sh.threeColRow}>
          {intensityOptions.map((opt) => (
            <TouchableOpacity
              key={opt.v}
              style={[sh.intensityBtn]}
              onPress={() => logEvent(opt.v)}
              accessibilityRole="button"
              accessibilityLabel={`Log ${opt.l} hot flash`}
            >
              <Text style={sh.intensityBtnLabel}>{opt.l}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={sh.statRow}>
        <Stat label="Last 24h" value={String(last24h.length)} sub={`${dayCount} day · ${nightCount} night`} />
        <Stat label="This week" value={String(weekCount)} sub="last 7d" />
        <Stat label="Night / day" value={`${ratio}%`} sub="ratio" />
      </View>
      <MSection title={recent.length ? 'RECENT' : 'NO ENTRIES YET'}>
        {recent.length === 0 ? (
          <Text style={[typography.caption, { fontSize: 12 }]}>
            Tap a button above to log your first hot flash.
          </Text>
        ) : (
          <>
            {recent.map((h, i) => (
              <View key={i} style={[cards.card, sh.recentRow]}>
                <View>
                  <Text style={[typography.data, { fontSize: 14 }]}>{fmtTime(h.at)}</Text>
                  <Text style={[typography.caption, { fontSize: 11 }]}>
                    Intensity {h.intensity}/3 · {new Date(h.at).toLocaleDateString()}
                  </Text>
                </View>
                <View style={[sh.phasePill, { backgroundColor: colors.coralSoft }]}>
                  <Text style={[sh.phasePillLabel, { color: colors.overlayDark }]}>
                    {isNight(h.at) ? 'Night sweat' : 'Day flash'}
                  </Text>
                </View>
              </View>
            ))}
          </>
        )}
      </MSection>
      <View style={[cards.cardWarm, { padding: 12, marginTop: 6 }]}>
        <Text style={[typography.eyebrow, { marginBottom: 4 }]}>EDUCATIONAL CONTEXT</Text>
        <Text style={[typography.body, { fontSize: 13 }]}>
          {earlyOnset
            ? 'Research has examined associations between frequent night-time hot flashes and cardiovascular health in early-onset perimenopause. This is general background — your clinician can interpret what it means for you.'
            : "Some research describes associations between frequent moderate-severe night sweats and cardiovascular health in midlife. This is general background — it doesn't describe your individual risk."}
        </Text>
        <Text style={[typography.caption, { fontSize: 10, marginTop: 6 }]}>
          Sources: SWAN Study; NAMS Position Statement
        </Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────
// F17 — HRT Effectiveness
// ─────────────────────────────────────────────

interface HrtModuleProps {
  state: PerimenopauseState;
  setState: React.Dispatch<React.SetStateAction<PerimenopauseState>>;
}

function HrtModule({ state, setState }: HrtModuleProps): ReactElement {
  const todayKey = new Date().toISOString().slice(0, 10);
  const today: HrtDayEntry = (state.hrtTracking && state.hrtTracking[todayKey]) ?? {};

  const setField = useCallback((key: keyof HrtDayEntry, val: number): void => {
    setState((s) => ({
      ...s,
      hrtTracking: {
        ...(s.hrtTracking ?? {}),
        [todayKey]: { ...((s.hrtTracking ?? {})[todayKey] ?? {}), [key]: val },
      },
    }));
  }, [setState, todayKey]);

  const fields: Array<{ k: keyof HrtDayEntry; l: string; max: number }> = [
    { k: 'hotFlashCount', l: 'Hot flashes today', max: 5 },
    { k: 'sleepQuality', l: 'Sleep quality (1=poor, 5=great)', max: 5 },
    { k: 'mood', l: 'Mood stability (1=low, 5=steady)', max: 5 },
  ];

  const compareRows: Array<{ l: string; n: number; t: number }> = [
    { l: 'Hot flashes / day', n: 8.2, t: today.hotFlashCount ?? 2.1 },
    { l: 'Sleep quality', n: 2.1, t: today.sleepQuality ?? 4.0 },
    { l: 'Mood stability', n: 2.4, t: today.mood ?? 3.8 },
    { l: 'Night sweats / week', n: 14, t: 3 },
    { l: 'Brain fog', n: 4.1, t: 2.3 },
    { l: 'Vaginal dryness', n: 4.0, t: 1.8 },
  ];

  return (
    <View>
      <MHeader
        eyebrow="F17 · HRT EFFECTIVENESS"
        title="Before HRT "
        titleAccent="vs now."
        sub="Quantified change since initiation."
      />
      <View style={[cards.cardMint, { padding: 14, marginBottom: 14 }]}>
        <Text style={[typography.eyebrow, { marginBottom: 4 }]}>STARTED</Text>
        <Text style={{ fontFamily: fonts.sansSemibold, fontSize: 14, color: colors.ink }}>
          Estradiol 0.05 mg patch + micronized progesterone 100 mg
        </Text>
        <Text style={[typography.caption, { fontSize: 12 }]}>Jan 18, 2026 · 96 days</Text>
      </View>
      <MSection title="LOG TODAY">
        <>
          {fields.map((f) => (
            <View key={f.k} style={[cards.card, { padding: 12, marginBottom: 6 }]}>
              <Text style={[sh.fieldLabel, { marginBottom: 8 }]}>{f.l}</Text>
              <Severity value={today[f.k] ?? 0} onChange={(v) => setField(f.k, v)} max={f.max} />
            </View>
          ))}
        </>
      </MSection>
      <MSection title="BEFORE HRT VS NOW (sample)">
        <>
          {compareRows.map((r) => (
            <View key={r.l} style={[cards.card, { padding: 12, marginBottom: 6 }]}>
              <Text style={[sh.fieldLabel, { marginBottom: 6 }]}>{r.l}</Text>
              <View style={sh.compareRow}>
                <Text style={[typography.data, { fontSize: 14, color: colors.ink3, flex: 1 }]}>{r.n}</Text>
                <Text style={{ fontSize: 14, color: colors.eucalyptus }}>→</Text>
                <Text style={[typography.data, { fontSize: 14, color: colors.eucalyptus, fontFamily: fonts.sansBold, flex: 1, textAlign: 'right' }]}>
                  {r.t}
                </Text>
              </View>
            </View>
          ))}
        </>
      </MSection>
    </View>
  );
}

// ─────────────────────────────────────────────
// F22 — STRAW+10 Staging
// ─────────────────────────────────────────────

interface StrawModuleProps {
  state: PerimenopauseState;
}

function StrawModule({ state }: StrawModuleProps): ReactElement {
  const currentYear = new Date().getFullYear();
  const age = currentYear - (state.yearOfBirth ?? 1985);
  const earlyOnset = age < 40 && state.conditions.includes('Perimenopause');
  const lastPeriod = state.lastPeriod ? new Date(state.lastPeriod) : null;
  const daysSinceLastPeriod = lastPeriod
    ? Math.floor((Date.now() - lastPeriod.getTime()) / 86400000)
    : 0;
  const cycleLen = state.cycleLen ?? 28;
  const sufficientData =
    lastPeriod && (state.entries ? Object.keys(state.entries).length >= 60 : false);

  let stagedKey: string | null = null;
  let stageReason = '';
  if (sufficientData) {
    if (daysSinceLastPeriod >= 365) {
      stagedKey = '+1a';
      stageReason = '12+ months since last logged period';
    } else if (daysSinceLastPeriod >= 60) {
      stagedKey = '−1';
      stageReason = `${daysSinceLastPeriod}+ days since last period (≥60d in last 12 months)`;
    } else if (state.irregular || cycleLen >= 35) {
      stagedKey = '−2';
      stageReason = 'Cycle length variability >7 days';
    }
  }

  const stages: Array<{ s: string; l: string; d: string; y: boolean }> = [
    { s: '−2', l: 'Early menopausal transition', d: 'Persistent 7+ day variation in cycle length', y: stagedKey === '−2' },
    { s: '−1', l: 'Late menopausal transition', d: 'Interval of amenorrhea ≥ 60 days', y: stagedKey === '−1' },
    { s: '+1a', l: 'Early postmenopause', d: 'First 12 months after FMP', y: stagedKey === '+1a' },
    { s: '+1b', l: 'Early postmenopause continued', d: 'Period of rapid hormonal change continues', y: stagedKey === '+1b' },
    { s: '+1c', l: 'Early postmenopause stable', d: 'Stabilization of FSH/estradiol — 3–6 years post-FMP', y: stagedKey === '+1c' },
    { s: '+2', l: 'Late postmenopause', d: 'Genitourinary atrophy more prominent · 6+ years post-FMP', y: stagedKey === '+2' },
  ];

  const entriesCount = Object.keys(state.entries ?? {}).length;

  if (!sufficientData) {
    return (
      <View>
        <MHeader
          eyebrow="F22 · STRAW+10 STAGE"
          title="Auto-staging needs "
          titleAccent="more cycle data."
          sub="Stages are derived from cycle interval data over the last 12 months."
        />
        <View style={[cards.cardWarm, { padding: 22, marginBottom: 14, flexDirection: 'row', gap: 10 }]}>
          <View style={{ width: 4, backgroundColor: colors.butterDeep, borderRadius: 2, alignSelf: 'stretch' }} />
          <View style={{ flex: 1 }}>
            <Text style={[typography.body, { marginBottom: 8 }]}>
              Not enough cycle data yet — log 6+ months of cycles to auto-stage.
            </Text>
            <Text style={[typography.caption, { fontSize: 12 }]}>
              Currently {entriesCount}/60 days logged.
            </Text>
          </View>
        </View>
        {stages.map((p) => (
          <View key={p.s} style={[cards.card, { padding: 12, marginBottom: 6, opacity: 0.6 }]}>
            <Text style={[typography.data, { fontSize: 14, marginRight: 10 }]}>{p.s}</Text>
            <Text style={{ fontSize: 13, color: colors.ink }}>{p.l}</Text>
            <Text style={[typography.caption, { fontSize: 11, marginTop: 4 }]}>{p.d}</Text>
          </View>
        ))}
      </View>
    );
  }

  const current = stages.find((s) => s.y) ?? stages[0];

  return (
    <View>
      <MHeader
        eyebrow="F22 · STRAW+10 STAGE"
        title="You are in "
        titleAccent={`${current.l.toLowerCase()}.`}
        sub={`Auto-staged: ${stageReason || 'from cycle interval data'} — confirm with your clinician.${state.hbcActive ? ' Tentative while on hormonal contraception.' : ''}`}
      />
      {state.hbcActive && (
        <View style={[cards.cardWarm, { padding: 16, marginBottom: 14, flexDirection: 'row', gap: 10 }]}>
          <View style={{ width: 4, backgroundColor: colors.coral, borderRadius: 2, alignSelf: 'stretch' }} />
          <View style={{ flex: 1 }}>
            <Text style={[typography.eyebrow, { marginBottom: 6, color: colors.coral }]}>
              STAGING TENTATIVE — HBC ACTIVE
            </Text>
            <Text style={[typography.body, { fontSize: 13, marginBottom: 8 }]}>
              <Text style={{ fontFamily: fonts.sansBold }}>
                You're on {state.hbcType ? state.hbcType.replace(/_/g, ' ') : 'hormonal birth control'}.
              </Text>
              {' '}HBC suppresses FSH and creates regular bleeding patterns regardless of where you are in the menopausal transition.
            </Text>
            <Text style={[typography.caption, { fontSize: 12 }]}>
              Cycle-interval staging is unreliable while on HBC. To get accurate STRAW+10 staging, your provider may suggest pausing HBC briefly, or using FSH/AMH labs interpreted with HBC context. Discuss with your provider.
            </Text>
          </View>
        </View>
      )}
      {earlyOnset && (
        <View style={[cards.cardWarm, { padding: 14, marginBottom: 14, flexDirection: 'row', gap: 10 }]}>
          <View style={{ width: 4, backgroundColor: colors.coral, borderRadius: 2, alignSelf: 'stretch' }} />
          <View style={{ flex: 1 }}>
            <Text style={[typography.eyebrow, { marginBottom: 6, color: colors.coral }]}>
              EARLY-ONSET FRAMING
            </Text>
            <Text style={[typography.body, { fontSize: 13, marginBottom: 8 }]}>
              <Text style={{ fontFamily: fonts.sansBold }}>Premature ovarian insufficiency / early perimenopause.</Text>
              {` You're ${age} — younger than the typical onset window.`}
            </Text>
            <Text style={[typography.caption, { fontSize: 12 }]}>
              Bone density and cardiovascular monitoring are an extra clinical priority for early-onset.
            </Text>
          </View>
        </View>
      )}
      <View style={[cards.cardWarm, { padding: 18, marginBottom: 14, alignItems: 'center' }]}>
        <Text style={[typography.data, { fontSize: 32, color: colors.eucalyptusDeep }]}>{current.s}</Text>
        <Text style={[typography.caption, { marginTop: 4 }]}>{current.l}</Text>
      </View>
      {stages.map((p) => (
        <View
          key={p.s}
          style={[
            cards.card,
            {
              padding: 12,
              marginBottom: 6,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              opacity: p.y ? 1 : 0.55,
              borderLeftWidth: p.y ? 3 : 1,
              borderLeftColor: p.y ? colors.eucalyptus : colors.border,
            },
          ]}
        >
          <Text style={[typography.data, { fontSize: 14, width: 36 }]}>{p.s}</Text>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, fontFamily: p.y ? fonts.sansSemibold : fonts.sans, color: colors.ink }}>{p.l}</Text>
            <Text style={[typography.caption, { fontSize: 11 }]}>{p.d}</Text>
          </View>
        </View>
      ))}
      <Text style={[typography.caption, { fontSize: 11, marginTop: 14, lineHeight: 16 }]}>
        Auto-staged from your cycle interval data — confirm with your clinician.
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────
// F25 — Greene Climacteric Scale
// ─────────────────────────────────────────────

interface GreeneItem {
  k: string;
  sub: string;
  label: string;
}

const GREENE_ITEMS: GreeneItem[] = [
  { k: 'a1', sub: 'Anxiety', label: 'Heart beating quickly or strongly' },
  { k: 'a2', sub: 'Anxiety', label: 'Feeling tense or nervous' },
  { k: 'a3', sub: 'Anxiety', label: 'Difficulty in sleeping' },
  { k: 'a4', sub: 'Anxiety', label: 'Excitable' },
  { k: 'a5', sub: 'Anxiety', label: 'Attacks of panic' },
  { k: 'a6', sub: 'Anxiety', label: 'Difficulty in concentrating' },
  { k: 'd1', sub: 'Depression', label: 'Feeling tired or lacking energy' },
  { k: 'd2', sub: 'Depression', label: 'Loss of interest in most things' },
  { k: 'd3', sub: 'Depression', label: 'Feeling unhappy or depressed' },
  { k: 'd4', sub: 'Depression', label: 'Crying spells' },
  { k: 'd5', sub: 'Depression', label: 'Irritability' },
  { k: 's1', sub: 'Somatic', label: 'Feeling dizzy or faint' },
  { k: 's2', sub: 'Somatic', label: 'Pressure or tightness in head/body' },
  { k: 's3', sub: 'Somatic', label: 'Parts of body feel numb or tingling' },
  { k: 's4', sub: 'Somatic', label: 'Headaches' },
  { k: 's5', sub: 'Somatic', label: 'Muscle and joint pains' },
  { k: 's6', sub: 'Somatic', label: 'Loss of feeling in hands or feet' },
  { k: 's7', sub: 'Somatic', label: 'Breathing difficulties' },
  { k: 'v1', sub: 'Vasomotor', label: 'Hot flushes' },
  { k: 'v2', sub: 'Vasomotor', label: 'Sweating at night' },
  { k: 'x1', sub: 'Sexual', label: 'Loss of interest in sex' },
];

const GREENE_ANCHORS = ['Not at all', 'A little', 'Quite a bit', 'Extremely'];

const SUB_MAX: Record<string, number> = {
  Anxiety: 18,
  Depression: 15,
  Somatic: 21,
  Vasomotor: 6,
  Sexual: 3,
};

const SUB_COLORS: Record<string, string> = {
  Anxiety: colors.severityMod,
  Depression: colors.severityMild,
  Somatic: colors.severityMod,
  Vasomotor: colors.severitySevere,
  Sexual: colors.severityMod,
};

interface GreeneModuleProps {
  state: PerimenopauseState;
  setState: React.Dispatch<React.SetStateAction<PerimenopauseState>>;
}

function GreeneModule({ state, setState }: GreeneModuleProps): ReactElement {
  const initial = state.greeneScores ?? {};
  const [scores, setScores] = useState<Record<string, number>>(
    GREENE_ITEMS.reduce<Record<string, number>>((acc, it) => ({
      ...acc,
      [it.k]: initial[it.k] != null ? initial[it.k] : 0,
    }), {}),
  );

  const setItem = useCallback((k: string, n: number): void => {
    const next = { ...scores, [k]: n };
    setScores(next);
    setState((s) => ({ ...s, greeneScores: next }));
  }, [scores, setState]);

  const groups = ['Anxiety', 'Depression', 'Somatic', 'Vasomotor', 'Sexual'];

  const subTotals = groups.reduce<Record<string, number>>((acc, key) => {
    acc[key] = GREENE_ITEMS.filter((it) => it.sub === key)
      .reduce((sum, it) => sum + (scores[it.k] ?? 0), 0);
    return acc;
  }, {});

  return (
    <View>
      <MHeader
        eyebrow="F25 · GREENE CLIMACTERIC"
        title="Weekly "
        titleAccent="21-item"
        titleSuffix=" assessment."
        sub="0 = Not at all · 1 = A little · 2 = Quite a bit · 3 = Extremely"
      />
      {groups.map((g) => (
        <View key={g} style={[cards.card, { padding: 12, marginBottom: 6 }]}>
          <View style={sh.subscaleHeader}>
            <Text style={sh.fieldLabel}>{g}</Text>
            <Text style={[typography.data, { fontSize: 12, color: SUB_COLORS[g] }]}>
              {subTotals[g]}/{SUB_MAX[g]}
            </Text>
          </View>
          <View style={sh.progressTrack}>
            <View
              style={[
                sh.progressFill,
                {
                  width: `${((subTotals[g] / SUB_MAX[g]) * 100).toFixed(1)}%` as `${number}%`,
                  backgroundColor: SUB_COLORS[g],
                },
              ]}
            />
          </View>
        </View>
      ))}
      <View style={{ marginTop: 18 }}>
        {groups.map((g) => (
          <MSection key={g} title={`${g.toUpperCase()} · ${SUB_MAX[g]} max`}>
            <>
              {GREENE_ITEMS.filter((it) => it.sub === g).map((it) => (
                <View key={it.k} style={sh.greeneItemWrap}>
                  <Text style={[typography.body, { fontSize: 13, marginBottom: 6 }]}>{it.label}</Text>
                  <View style={sh.greeneScaleRow}>
                    {[0, 1, 2, 3].map((n) => (
                      <TouchableOpacity
                        key={n}
                        onPress={() => setItem(it.k, n)}
                        style={[sh.greeneScaleBtn, scores[it.k] === n && sh.greeneScaleBtnActive]}
                        accessibilityRole="button"
                        accessibilityLabel={`${it.label}: ${GREENE_ANCHORS[n]}`}
                        accessibilityState={{ selected: scores[it.k] === n }}
                      >
                        <Text style={[sh.greeneScaleNum, scores[it.k] === n && sh.greeneScaleNumActive]}>
                          {n}
                        </Text>
                        <Text style={[sh.greeneScaleAnchor, scores[it.k] === n && sh.greeneScaleAnchorActive]}>
                          {GREENE_ANCHORS[n]}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              ))}
            </>
          </MSection>
        ))}
      </View>
      <Text style={[typography.caption, { fontSize: 11, marginTop: 14, lineHeight: 16 }]}>
        Greene CS · 21 items · Greene 1998. This is a self-rating tool, not a diagnosis.
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────
// F26 — GSM Tracker
// ─────────────────────────────────────────────

interface GsmModuleProps {
  state: PerimenopauseState;
  setState: React.Dispatch<React.SetStateAction<PerimenopauseState>>;
}

function GsmModule({ state, setState }: GsmModuleProps): ReactElement {
  const todayKey = new Date().toISOString().slice(0, 10);
  const today: GsmDayEntry = (state.gsmScores && state.gsmScores[todayKey]) ?? {};

  const setField = useCallback((key: keyof GsmDayEntry, val: number): void => {
    setState((s) => ({
      ...s,
      gsmScores: {
        ...(s.gsmScores ?? {}),
        [todayKey]: { ...((s.gsmScores ?? {})[todayKey] ?? {}), [key]: val },
      },
    }));
  }, [setState, todayKey]);

  const items: Array<{ k: keyof GsmDayEntry; l: string }> = [
    { k: 'dryness', l: 'Vaginal dryness' },
    { k: 'painSex', l: 'Painful sex' },
    { k: 'urgency', l: 'Urinary urgency' },
    { k: 'uti', l: 'Recurrent UTI symptoms' },
    { k: 'libido', l: 'Libido changes' },
  ];

  return (
    <View>
      <MHeader
        eyebrow="F26 · GSM TRACKER"
        title="Discreet, "
        titleAccent="private."
        sub="Genitourinary symptoms — 0 = none, 3 = severe."
      />
      {items.map((it) => (
        <View key={it.k} style={[cards.card, { padding: 12, marginBottom: 6 }]}>
          <Text style={[sh.fieldLabel, { marginBottom: 8 }]}>{it.l}</Text>
          <Severity value={today[it.k] ?? 0} onChange={(v) => setField(it.k, v)} max={4} />
        </View>
      ))}
      <Text style={[typography.caption, { fontSize: 11, marginTop: 10, lineHeight: 16 }]}>
        Stored on-device. Included in physician export only when you explicitly select it.
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────
// F27 — Brain Fog
// ─────────────────────────────────────────────

interface BrainFogModuleProps {
  state: PerimenopauseState;
  setState: React.Dispatch<React.SetStateAction<PerimenopauseState>>;
}

function BrainFogModule({ state, setState }: BrainFogModuleProps): ReactElement {
  const todayKey = new Date().toISOString().slice(0, 10);
  const today: BrainFogDayEntry = (state.brainFogLog && state.brainFogLog[todayKey]) ?? {};

  const setField = useCallback((key: keyof BrainFogDayEntry, val: number): void => {
    setState((s) => ({
      ...s,
      brainFogLog: {
        ...(s.brainFogLog ?? {}),
        [todayKey]: { ...((s.brainFogLog ?? {})[todayKey] ?? {}), [key]: val },
      },
    }));
  }, [setState, todayKey]);

  const items: Array<{ k: keyof BrainFogDayEntry; l: string }> = [
    { k: 'wordRetrieval', l: 'Word retrieval' },
    { k: 'misplacing', l: 'Misplacing things' },
    { k: 'names', l: 'Forgetting names' },
    { k: 'focus', l: 'Lost focus mid-task' },
  ];

  return (
    <View>
      <MHeader
        eyebrow="F27 · BRAIN FOG"
        title="Cognitive symptoms, "
        titleAccent="tracked."
        sub="EMQ-R retrieval subscale, correlated with sleep and hot flashes."
      />
      {items.map((it) => (
        <View key={it.k} style={[cards.card, { padding: 12, marginBottom: 6 }]}>
          <Text style={[sh.fieldLabel, { marginBottom: 8 }]}>{it.l}</Text>
          <Severity value={today[it.k] ?? 0} onChange={(v) => setField(it.k, v)} max={5} />
        </View>
      ))}
      <View style={[cards.cardMint, { padding: 12, marginTop: 6 }]}>
        <Text style={[typography.eyebrow, { marginBottom: 4 }]}>CORRELATION</Text>
        <Text style={[typography.body, { fontSize: 12 }]}>
          Brain fog is 1.8× worse on nights with 2+ hot flashes. Sleep is the dominant lever.
        </Text>
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────
// F24 — Irregular Cycle Mode
// ─────────────────────────────────────────────

interface IrregularModuleProps {
  state: PerimenopauseState;
  setState: React.Dispatch<React.SetStateAction<PerimenopauseState>>;
}

function IrregularModule({ state, setState }: IrregularModuleProps): ReactElement {
  const settings = state.irregularSettings ?? {
    irregularMode: state.irregular ?? false,
    anovulatory: false,
    pcosPhaseEst: false,
  };

  const [im, setIm] = useState(!!settings.irregularMode);
  const [ano, setAno] = useState(!!settings.anovulatory);
  const [pcosEst, setPcosEst] = useState(!!settings.pcosPhaseEst);

  const persist = useCallback((next: IrregularSettings): void => {
    setState((s) => ({
      ...s,
      irregularSettings: next,
      irregular: !!next.irregularMode,
    }));
  }, [setState]);

  return (
    <View>
      <MHeader
        eyebrow="F24 · IRREGULAR CYCLE MODE"
        title="For cycles that "
        titleAccent="don't fit a clock."
        sub="Anovulatory aware, variable length predictions, PCOS-tuned."
      />
      <ToggleRow
        label="Irregular cycle mode"
        checked={im}
        onChange={(v) => {
          setIm(v);
          persist({ irregularMode: v, anovulatory: ano, pcosPhaseEst: pcosEst });
        }}
        sub="Switches predictions to a window, not a date"
      />
      <ToggleRow
        label="Show anovulatory cycles"
        checked={ano}
        onChange={(v) => {
          setAno(v);
          persist({ irregularMode: im, anovulatory: v, pcosPhaseEst: pcosEst });
        }}
        sub="Marks cycles with no PdG confirmation"
      />
      <ToggleRow
        label="PCOS phase estimation"
        checked={pcosEst}
        onChange={(v) => {
          setPcosEst(v);
          persist({ irregularMode: im, anovulatory: ano, pcosPhaseEst: v });
        }}
        sub="Uses your cycle history median, not 28-day default"
      />
      <View style={[cards.cardWarm, { padding: 14, marginTop: 14 }]}>
        <Text style={[typography.eyebrow, { marginBottom: 6 }]}>YOUR CYCLE PROFILE</Text>
        <Text style={[typography.data, { fontSize: 16 }]}>
          median 42d · range 28–62d · 4/12 anovulatory
        </Text>
      </View>
      <Text style={[typography.caption, { marginTop: 12, fontSize: 11 }]}>
        Reload after toggling to see the home phase chip update to "variable".
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────
// F23 — Multi-Condition Overlay
// ─────────────────────────────────────────────

interface OverlaySeries {
  l: string;
  c: string;
  dash: 'solid' | 'dashed' | 'dotted';
  d: number[];
}

function OverlayModule(): ReactElement {
  const series: OverlaySeries[] = [
    { l: 'PMDD (DRSP)', c: colors.severitySevere, dash: 'solid', d: [1.2, 1.4, 1.6, 1.8, 2.2, 3.4, 4.5, 4.8] },
    { l: 'PCOS metabolic', c: colors.butterDeep, dash: 'dashed', d: [2.8, 2.7, 2.9, 2.8, 2.6, 2.7, 2.9, 3.0] },
    { l: 'ADHD focus', c: colors.eucalyptus, dash: 'dotted', d: [4.2, 4.1, 4.0, 3.8, 3.5, 3.0, 2.4, 2.2] },
  ];

  const renderSparkline = (data: number[], color: string, dash: 'solid' | 'dashed' | 'dotted'): ReactElement => {
    const W = 280;
    const H = 30;
    const maxV = Math.max(...data, 5);
    const dashArray = dash === 'dashed' ? '6,4' : dash === 'dotted' ? '2,3' : undefined;
    const points = data
      .map((v, i) => `${((i * W) / (data.length - 1)).toFixed(1)},${(H - (v / maxV) * H).toFixed(1)}`)
      .join(' ');
    return (
      <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
        <Polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeDasharray={dashArray}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    );
  };

  const dashLabel: Record<'solid' | 'dashed' | 'dotted', string> = {
    solid: 'solid',
    dashed: 'dashed',
    dotted: 'dotted',
  };

  return (
    <View>
      <MHeader
        eyebrow="F23 · MULTI-CONDITION OVERLAY"
        title="One "
        titleAccent="timeline."
        sub="PMDD + PCOS + ADHD on the same days."
      />
      <View style={[cards.cardWarm, { padding: 10, marginBottom: 10 }]}>
        <Text style={[typography.caption, { fontSize: 11 }]}>
          These patterns are observations from your logs. They are not a diagnosis. Bring them to your clinician.
        </Text>
      </View>
      <View style={[cards.cardPaper, { padding: 10, marginBottom: 10, flexDirection: 'row', flexWrap: 'wrap', gap: 14 }]}>
        {series.map((s) => (
          <View key={s.l} style={sh.legendItem}>
            <Svg width={32} height={6} viewBox="0 0 32 6">
              <Line
                x1={0}
                y1={3}
                x2={32}
                y2={3}
                stroke={s.c}
                strokeWidth={2}
                strokeDasharray={s.dash === 'dashed' ? '6,4' : s.dash === 'dotted' ? '2,3' : undefined}
                strokeLinecap="round"
              />
            </Svg>
            <Text style={sh.legendLabel}>
              {s.l}{' '}
              <Text style={{ color: colors.ink3, fontStyle: 'italic' }}>({dashLabel[s.dash]})</Text>
            </Text>
          </View>
        ))}
      </View>
      <View style={[cards.cardWarm, { padding: 14 }]}>
        {series.map((s) => (
          <View key={s.l} style={{ marginBottom: 14 }}>
            <View style={sh.overlaySeriesHeader}>
              <Text style={[sh.fieldLabel, { fontSize: 12, color: s.c }]}>{s.l}</Text>
              <Text style={[typography.data, { fontSize: 11 }]}>day 1–28</Text>
            </View>
            {renderSparkline(s.d, s.c, s.dash)}
          </View>
        ))}
      </View>
      <Text style={[typography.caption, { marginTop: 10, fontSize: 12 }]}>
        Watch how all three trend together in luteal. The metabolic and cognitive systems are connected.
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────
// F6 — Privacy Dashboard
// ─────────────────────────────────────────────

function PrivacyModule(): ReactElement {
  const privacyRows: Array<{ l: string; v: string; c: string }> = [
    { l: 'On this device', v: '146 logs · encrypted', c: colors.severityMild },
    { l: 'Synced (you opt-in)', v: 'Off', c: colors.ink3 },
    { l: 'Account', v: 'Email-keyed · end-to-end encrypted in transit and at rest', c: colors.severityMild },
    { l: 'Analytics SDKs', v: 'Zero', c: colors.severityMild },
    { l: 'Ad networks', v: 'Zero', c: colors.severityMild },
    { l: 'Third-party shares', v: 'Zero', c: colors.severityMild },
  ];

  return (
    <View>
      <MHeader
        eyebrow="F6 · PRIVACY DASHBOARD"
        title="Where your data "
        titleAccent="actually lives."
        sub="Designed for the post-Roe, post-Flo-verdict threat model."
      />
      {privacyRows.map((r) => (
        <View key={r.l} style={[cards.card, { padding: 12, marginBottom: 6, flexDirection: 'row', justifyContent: 'space-between' }]}>
          <Text style={[typography.body, { fontSize: 13 }]}>{r.l}</Text>
          <Text style={[typography.data, { fontSize: 12, color: r.c, textAlign: 'right', flex: 1, marginLeft: 8 }]}>{r.v}</Text>
        </View>
      ))}
      <TouchableOpacity
        style={[buttons.soft, { marginTop: 8, width: '100%' }]}
        accessibilityRole="button"
        accessibilityLabel="Export everything as JSON"
      >
        <Text style={buttons.softLabel}>Export everything · JSON</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[buttons.outline, { marginTop: 8, width: '100%', borderColor: colors.danger }]}
        accessibilityRole="button"
        accessibilityLabel="Delete all data"
      >
        <Text style={[buttons.outlineLabel, { color: colors.danger }]}>Delete all data</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────────────────────────────
// F10 — Notifications
// ─────────────────────────────────────────────

interface NotifModuleProps {
  state: PerimenopauseState;
  setState: React.Dispatch<React.SetStateAction<PerimenopauseState>>;
}

function NotifModule({ state, setState }: NotifModuleProps): ReactElement {
  const settings = state.notifSettings ?? {};

  const setSetting = useCallback((key: keyof NotifSettings, val: boolean): void => {
    setState((s) => ({
      ...s,
      notifSettings: { ...(s.notifSettings ?? {}), [key]: val },
    }));
  }, [setState]);

  const notifToggles: Array<{ k: keyof NotifSettings; l: string; sub: string }> = [
    { k: 'dailyCheckin', l: 'Daily log reminder', sub: 'One gentle nudge at your usual log time' },
    { k: 'lutealHeadsUp', l: 'Heads-up before luteal', sub: 'Early warning 4 days before predicted luteal' },
    { k: 'safetyPlan', l: 'Safety plan surface', sub: 'Before historical high-risk window' },
    { k: 'patternFound', l: 'Pattern found', sub: 'When Ora confirms a new pattern' },
    { k: 'weeklyDigest', l: 'Weekly Ora digest', sub: 'Sunday morning, 1–2 patterns' },
    { k: 'supplementReminder', l: 'Supplement reminder', sub: 'Off by default' },
    { k: 'ssriReminder', l: 'SSRI reminder', sub: 'If on luteal-only dosing' },
    { k: 'hotFlashCheckin', l: 'Hot flash check-in', sub: 'Lock-screen tap-to-log' },
  ];

  return (
    <View>
      <MHeader
        eyebrow="F10 · NOTIFICATIONS"
        title="Phase-aware. "
        titleAccent="Quiet by default."
        sub="Never alarmist."
      />
      <View style={[cards.cardWarm, { padding: 14, marginBottom: 14 }]}>
        <Text style={[typography.eyebrow, { marginBottom: 6 }]}>SYSTEM PERMISSION</Text>
        <View style={sh.permRow}>
          <Text style={[typography.caption, { fontSize: 12 }]}>
            Status: <Text style={{ fontFamily: fonts.sansBold }}>not yet asked</Text>
          </Text>
        </View>
      </View>
      {notifToggles.map((t) => (
        <ToggleRow
          key={t.k}
          label={t.l}
          checked={!!settings[t.k]}
          onChange={(v) => setSetting(t.k, v)}
          sub={t.sub}
        />
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────
// Tab config
// ─────────────────────────────────────────────

type ModuleKey =
  | 'hotFlash'
  | 'hrt'
  | 'straw'
  | 'greene'
  | 'gsm'
  | 'brainFog'
  | 'irregular'
  | 'overlay'
  | 'privacy'
  | 'notif';

interface TabItem {
  key: ModuleKey;
  label: string;
  eyebrow: string;
}

const TABS: TabItem[] = [
  { key: 'hotFlash', label: 'Hot Flash', eyebrow: 'F16' },
  { key: 'hrt', label: 'HRT', eyebrow: 'F17' },
  { key: 'straw', label: 'STRAW+10', eyebrow: 'F22' },
  { key: 'greene', label: 'Greene', eyebrow: 'F25' },
  { key: 'gsm', label: 'GSM', eyebrow: 'F26' },
  { key: 'brainFog', label: 'Brain Fog', eyebrow: 'F27' },
  { key: 'irregular', label: 'Cycle Mode', eyebrow: 'F24' },
  { key: 'overlay', label: 'Overlay', eyebrow: 'F23' },
  { key: 'privacy', label: 'Privacy', eyebrow: 'F6' },
  { key: 'notif', label: 'Alerts', eyebrow: 'F10' },
];

// ─────────────────────────────────────────────
// Screen root
// ─────────────────────────────────────────────

export default function PerimenopauseScreen(): ReactElement {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const [state, setState] = useState<PerimenopauseState>(INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<ModuleKey>('hotFlash');

  // reduceMotion is available for child components that animate
  void reduceMotion;

  const renderModule = (): ReactElement => {
    switch (activeTab) {
      case 'hotFlash':
        return <HotFlashModule state={state} setState={setState} />;
      case 'hrt':
        return <HrtModule state={state} setState={setState} />;
      case 'straw':
        return <StrawModule state={state} />;
      case 'greene':
        return <GreeneModule state={state} setState={setState} />;
      case 'gsm':
        return <GsmModule state={state} setState={setState} />;
      case 'brainFog':
        return <BrainFogModule state={state} setState={setState} />;
      case 'irregular':
        return <IrregularModule state={state} setState={setState} />;
      case 'overlay':
        return <OverlayModule />;
      case 'privacy':
        return <PrivacyModule />;
      case 'notif':
        return <NotifModule state={state} setState={setState} />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream }}>
      {/* Top bar */}
      <View style={s.topbar}>
        <TouchableOpacity
          onPress={() => router.push('/(app)/home')}
          style={s.backBtn}
          accessibilityRole="button"
          accessibilityLabel="Go back to home"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={s.backBtnLabel}>←</Text>
        </TouchableOpacity>
        <Text style={[typography.eyebrow, { color: colors.eucalyptus }]}>PERIMENOPAUSE</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Module tab strip */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.tabStrip}
        style={s.tabStripContainer}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[s.tabChip, isActive && s.tabChipActive]}
              accessibilityRole="button"
              accessibilityLabel={`${tab.label} module`}
              accessibilityState={{ selected: isActive }}
            >
              <Text style={[s.tabEyebrow, isActive && s.tabEyebrowActive]}>{tab.eyebrow}</Text>
              <Text style={[s.tabLabel, isActive && s.tabLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Module content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[layout.screen, { paddingTop: 16 }]}
        showsVerticalScrollIndicator={false}
      >
        {renderModule()}
        <Text style={s.disclaimer}>
          HormonaIQ is not a substitute for medical advice. All data is stored on-device.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// Shared inline styles
// ─────────────────────────────────────────────

const sh = StyleSheet.create({
  mheaderWrap: {
    marginBottom: 16,
    gap: 6,
  },
  mheaderTitle: {
    marginBottom: 2,
  },
  statRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: 14,
  },
  statCard: {
    flex: 1,
    padding: 14,
  },
  threeColRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  intensityBtn: {
    flex: 1,
    minHeight: 56,
    backgroundColor: colors.mintMist,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  intensityBtnLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.eucalyptusDeep,
  },
  recentRow: {
    padding: 12,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phasePill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 32,
  },
  phasePillLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
  },
  severityRow: {
    flexDirection: 'row',
    gap: 4,
  },
  severityBtn: {
    flex: 1,
    minHeight: 44,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  severityBtnActive: {
    backgroundColor: colors.eucalyptus,
    borderColor: colors.eucalyptus,
  },
  severityBtnLabel: {
    fontFamily: fonts.mono,
    fontSize: 15,
    color: colors.ink,
  },
  severityBtnLabelActive: {
    color: colors.paper,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 56,
  },
  msectionWrap: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontFamily: fonts.sansSemibold,
    fontSize: 13,
    color: colors.ink,
  },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  subscaleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressTrack: {
    height: 6,
    backgroundColor: colors.mintMist,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 999,
  },
  greeneItemWrap: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greeneScaleRow: {
    flexDirection: 'row',
    gap: 4,
  },
  greeneScaleBtn: {
    flex: 1,
    minHeight: 52,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderRadius: 6,
    backgroundColor: colors.cream,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeneScaleBtnActive: {
    backgroundColor: colors.eucalyptus,
    borderColor: colors.eucalyptus,
  },
  greeneScaleNum: {
    fontFamily: fonts.monoMedium,
    fontSize: 14,
    color: colors.ink,
  },
  greeneScaleNumActive: {
    color: colors.paper,
  },
  greeneScaleAnchor: {
    fontSize: 9,
    marginTop: 2,
    fontFamily: fonts.sans,
    color: colors.ink3,
    textAlign: 'center',
  },
  greeneScaleAnchorActive: {
    color: colors.overlayLight,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendLabel: {
    fontSize: 11,
    fontFamily: fonts.sansMedium,
    color: colors.ink,
  },
  overlaySeriesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  permRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    minHeight: 44,
  },
});

// ─────────────────────────────────────────────
// Screen-level styles
// ─────────────────────────────────────────────

const s = StyleSheet.create({
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: 'rgba(250, 251, 246, 0.95)',
  },
  backBtn: {
    width: 40,
    height: 44,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  backBtnLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 22,
    color: colors.eucalyptus,
  },
  tabStripContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.paper,
    maxHeight: 68,
  },
  tabStrip: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabChip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.paper,
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  tabChipActive: {
    backgroundColor: colors.eucalyptus,
    borderColor: colors.eucalyptus,
  },
  tabEyebrow: {
    fontFamily: fonts.mono,
    fontSize: 9,
    color: colors.ink3,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  tabEyebrowActive: {
    color: 'rgba(255,255,255,0.7)',
  },
  tabLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.ink,
  },
  tabLabelActive: {
    color: colors.paper,
  },
  disclaimer: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink3,
    textAlign: 'center',
    marginTop: 24,
    marginBottom: 8,
    lineHeight: 16,
  },
});
