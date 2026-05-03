// DailyLog — DRSP-12 daily check-in screen.
// Port of design-handoff/08-implementation-code/src/daily-log.jsx
// Wave 1: T-01 full DRSP, T-04 persistence, T-05 SI as item 12, T-06 crisis post-save
// Wave 2: T-11 fast-log mode + voice note, T-22 ADHD check-in 4th step, T-26 functional quick-links

import { useState } from 'react';
import type { ReactElement } from 'react';
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
import Svg, { Path as SvgPath, Rect as SvgRect } from 'react-native-svg';

import {
  buttons,
  cards,
  components as cmp,
  layout,
  typography,
} from '../../src/constants/styles';
import { colors, fonts, radius, spacing } from '../../src/constants/tokens';
import { useAppStore, useLogStore } from '../../src/stores';
import type { LogEntry, NewLogEntry } from '../../src/stores';

// ─────────────────────────────────────────────
// Data definitions
// ─────────────────────────────────────────────

interface DrspItem {
  key: string;
  label: string;
}

// DRSP-21 mood/behavioral/physical items (spec §2.2) + item 12 SI + 3 functional = 24 total
const DRSP_ITEMS: DrspItem[] = [
  { key: 'depressed', label: 'Felt depressed, sad, "down," or "blue"' },
  { key: 'hopeless', label: 'Felt hopeless' },
  { key: 'worthless_guilty', label: 'Felt worthless or guilty' },
  { key: 'anxiety', label: 'Felt anxious, tense, "keyed up," or "on edge"' },
  { key: 'mood_swings', label: 'Had mood swings (suddenly tearful, sensitive)' },
  { key: 'rejection_sensitive', label: 'Felt rejected easily, more sensitive to rejection' },
  { key: 'irritability', label: 'Felt angry, irritable' },
  { key: 'conflicts', label: 'Had conflicts or problems with people' },
  { key: 'decreased_interest', label: 'Less interest in usual activities (work, school, friends, hobbies)' },
  { key: 'concentration', label: 'Difficulty concentrating' },
  { key: 'fatigue', label: 'Felt lethargic, tired, fatigued, or low energy' },
  { key: 'appetite', label: 'Increased appetite or had food cravings' },
  { key: 'hypersomnia', label: 'Slept more, took naps, or had hard time getting up' },
  { key: 'insomnia', label: 'Had trouble falling or staying asleep' },
  { key: 'overwhelmed', label: 'Felt overwhelmed or unable to cope' },
  { key: 'out_of_control', label: 'Felt out of control' },
  { key: 'breast_tenderness', label: 'Breast tenderness' },
  { key: 'breast_swelling_bloating', label: 'Breast swelling, bloated feeling, or weight gain' },
  { key: 'headache', label: 'Headache' },
  { key: 'joint_muscle_pain', label: 'Joint or muscle pain' },
];

const DRSP_SI: DrspItem = { key: 'suicidal_ideation', label: "Thoughts that life isn't worth living" };

const FUNCTIONAL_ITEMS: DrspItem[] = [
  { key: 'fn_work', label: 'Interfered with work or school' },
  { key: 'fn_social', label: 'Interfered with social activities' },
  { key: 'fn_relationships', label: 'Interfered with relationships' },
];

// T-22 — ADHD executive function dimensions
interface AdhdefItem {
  key: string;
  label: string;
}

const ADHD_EF: AdhdefItem[] = [
  { key: 'focus', label: 'Focus' },
  { key: 'workingMemory', label: 'Working memory' },
  { key: 'taskInitiation', label: 'Task initiation' },
  { key: 'emotionalRegulation', label: 'Emotional regulation' },
  { key: 'timePerception', label: 'Time perception' },
];

// T-11 — fast log uses these top-3 most frequently flagged DRSP items
const FAST_LOG_KEYS = ['irritability', 'concentration', 'overwhelmed'];

const ANCHORS: Record<number, string> = {
  1: 'Not at all',
  2: 'Minimal',
  3: 'Mild',
  4: 'Moderate',
  5: 'Severe',
  6: 'Extreme',
};

// ─────────────────────────────────────────────
// Local state types
// ─────────────────────────────────────────────

type DrspScores = Record<string, number>;
type AdhdEFScores = Record<string, number>;

interface SpottingEntry {
  flow: string | null;
  daysSincePeriod: number;
  postmenopausalGap: number | null;
  dischargedWithDoctor: boolean;
  at: number;
}

interface SavedEntry {
  drsp: DrspScores;
  feeling: string | null;
  physical: string[];
  adhdRating: number | null;
  sleep: number | null;
  voiceNote: string | null;
  adhdEF: AdhdEFScores | undefined;
  fnImpair: number | null;
  suicidal_ideation: number;
  savedAt: number;
  _openModule?: string | null;
}

interface AppState {
  cycleDay: number;
  cycleLen: number;
  cyclePaused: boolean;
  irregular: boolean;
  adhd: string | null;
  perimenopausalStatus: string | null;
  lastPeriod: string | null;
  fastLogMode: boolean;
  entries: Record<string, SavedEntry>;
  spottingLog: Record<string, SpottingEntry>;
}

const INITIAL_STATE: AppState = {
  cycleDay: 19,
  cycleLen: 28,
  cyclePaused: false,
  irregular: false,
  adhd: null,
  perimenopausalStatus: null,
  lastPeriod: null,
  fastLogMode: false,
  entries: {},
  spottingLog: {},
};

// ─────────────────────────────────────────────
// Phase helpers (mirrors shared.jsx)
// ─────────────────────────────────────────────

type PhaseCode = 'F' | 'O' | 'L' | 'Lm' | 'Ls' | 'M' | '?';

function phaseForDay(day: number, cycleLen: number): PhaseCode {
  const c = cycleLen || 28;
  if (day <= 5) return 'M';
  if (day > c - 5) return 'M';
  const fEnd = Math.round(c * 0.45);
  const oEnd = Math.round(c * 0.55);
  const lmEnd = Math.round(c * 0.78);
  if (day <= fEnd) return 'F';
  if (day <= oEnd) return 'O';
  if (day <= lmEnd) return 'Lm';
  return 'Ls';
}

const PHASE_NAMES: Record<PhaseCode, string> = {
  F: 'Follicular',
  O: 'Ovulatory',
  L: 'Luteal',
  Lm: 'Early luteal',
  Ls: 'Late luteal',
  M: 'Menstrual',
  '?': 'Variable',
};

// ─────────────────────────────────────────────
// Feeling options with phase-color tone values
// ─────────────────────────────────────────────

interface FeelingOption {
  label: string;
  tone: string;
  sub: string;
}

const FEELINGS: FeelingOption[] = [
  { label: 'Steady', tone: colors.sageLight, sub: 'Like myself' },
  { label: 'Slight', tone: colors.butter, sub: 'A little off' },
  { label: 'Off', tone: colors.coral, sub: 'Noticeable' },
  { label: 'Heavy', tone: colors.coral, sub: 'Hard to manage' },
  { label: 'Hard', tone: colors.rose, sub: 'Functionally impaired' },
];

// ─────────────────────────────────────────────
// ScaleRow component
// ─────────────────────────────────────────────

interface ScaleRowProps {
  label: string;
  value: number | null | undefined;
  onSet: (n: number) => void;
  max?: number;
}

function ScaleRow({ label, value, onSet, max = 6 }: ScaleRowProps): ReactElement {
  return (
    <View style={s.scaleRowWrap}>
      <Text style={[typography.body, s.scaleRowLabel]}>{label}</Text>
      <View style={s.scaleRow}>
        {Array.from({ length: max }, (_, i) => i + 1).map((n) => {
          const isActive = value === n;
          return (
            <TouchableOpacity
              key={n}
              style={[cmp.scaleBtn, isActive && cmp.scaleBtnActive, s.scaleBtnFlex]}
              onPress={() => onSet(n)}
              accessibilityLabel={`${label} — ${ANCHORS[n] ?? String(n)}`}
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
            >
              <Text style={[cmp.scaleBtnLabel, isActive && cmp.scaleBtnLabelActive]}>
                {n}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────
// LogScreen
// ─────────────────────────────────────────────

export default function LogScreen(): ReactElement {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  // ── Cycle context from the persisted app store ───────────────────────
  const storeCycleLen = useAppStore((s) => s.cycleLen);
  const storeLastPeriod = useAppStore((s) => s.lastPeriod);

  // ── Daily-log persistence ────────────────────────────────────────────
  const getEntryForDate = useLogStore((s) => s.getEntryForDate);
  const addEntryToStore = useLogStore((s) => s.addEntry);
  const updateEntryInStore = useLogStore((s) => s.updateEntry);

  const [state, setState] = useState<AppState>(() => ({
    ...INITIAL_STATE,
    cycleLen: storeCycleLen,
    lastPeriod: storeLastPeriod ? storeLastPeriod.toISOString().slice(0, 10) : null,
  }));

  const todayKey = new Date().toISOString().slice(0, 10);

  // Hydrate today's draft from the persistent log store on mount.
  const persistedToday: LogEntry | undefined = getEntryForDate(todayKey);
  const existing = state.entries[todayKey] ?? ({} as Partial<SavedEntry>);

  const [storedEntryId, setStoredEntryId] = useState<string | null>(
    persistedToday ? persistedToday.id : null,
  );
  const [feeling, setFeeling] = useState<string | null>(existing.feeling ?? null);
  const [drsp, setDrsp] = useState<DrspScores>(
    existing.drsp ?? persistedToday?.drspScores ?? {},
  );
  const [si, setSi] = useState<number | null>(
    existing.suicidal_ideation ?? null,
  );
  const [physical, setPhysical] = useState<string[]>(
    existing.physical ?? (persistedToday ? [...persistedToday.physicalSymptoms] : []),
  );
  const [adhdRating, setAdhdRating] = useState<number | null>(existing.adhdRating ?? null);
  const [sleep, setSleep] = useState<number | null>(existing.sleep ?? null);
  const [voiceNote, setVoiceNote] = useState<string | null>(existing.voiceNote ?? null);
  const [recording, setRecording] = useState(false);
  const [adhdEF, setAdhdEF] = useState<AdhdEFScores>(existing.adhdEF ?? {});
  const [fnImpair, setFnImpair] = useState<number | null>(existing.fnImpair ?? null);
  const [showAdhdSection, setShowAdhdSection] = useState(true);
  const [saved, setSaved] = useState(false);
  const [crisisTier, setCrisisTier] = useState<'tier2' | 'tier3' | null>(null);
  const [savedEntry, setSavedEntry] = useState<SavedEntry | null>(null);
  const [fastLog, setFastLog] = useState(state.fastLogMode ?? false);
  const [spottingFlow, setSpottingFlow] = useState<string | null | undefined>(
    state.spottingLog[todayKey]?.flow,
  );

  const { cycleDay, cycleLen } = state;
  const phase = phaseForDay(cycleDay, cycleLen);

  const physicalList = [
    'Bloating', 'Cramps', 'Headache', 'Breast tenderness',
    'Fatigue', 'Joint pain', 'Skin changes',
  ];

  // T-38 — sleep labels reframed for severity, not subjective quality
  const sleepList = ['None', 'Mild disruption', 'Moderate', 'Severe', 'Extreme'];

  const isAdhdUser = state.adhd === 'Yes' || state.adhd === 'I think so';

  const setSym = (key: string, n: number): void =>
    setDrsp((prev) => ({ ...prev, [key]: n }));

  const setEF = (key: string, n: number): void =>
    setAdhdEF((prev) => ({ ...prev, [key]: n }));

  const togglePhysical = (p: string): void => {
    setPhysical((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  };

  // T-11 — voice note (mock 3-sec record, no console.log)
  const recordVoiceNote = (): void => {
    if (recording) return;
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      setVoiceNote('voice-note-' + Date.now());
    }, 3000);
  };

  // Spotting log handler (R7 — F88)
  const logSpotting = (flow: string | null): void => {
    const lastPeriod = state.lastPeriod ? new Date(state.lastPeriod) : null;
    const daysSince = lastPeriod
      ? Math.floor((Date.now() - lastPeriod.getTime()) / 86400000)
      : 0;
    const isPostmeno = state.perimenopausalStatus === 'postmenopause';
    const postmeno_gap =
      isPostmeno
        ? Math.max(daysSince, 365)
        : daysSince >= 365
          ? daysSince
          : null;

    setSpottingFlow(flow);
    setState((s) => ({
      ...s,
      spottingLog: {
        ...s.spottingLog,
        [todayKey]: {
          flow,
          daysSincePeriod: daysSince,
          postmenopausalGap: postmeno_gap,
          dischargedWithDoctor: false,
          at: Date.now(),
        },
      },
    }));
  };

  const save = (): void => {
    const entry: SavedEntry = {
      drsp: { ...drsp, [DRSP_SI.key]: si ?? 1 },
      feeling,
      physical,
      adhdRating,
      sleep,
      voiceNote,
      adhdEF: isAdhdUser ? adhdEF : undefined,
      fnImpair,
      suicidal_ideation: si ?? 1,
      savedAt: Date.now(),
    };

    setSavedEntry(entry);

    // Persist to the global log store (creates or updates today's entry).
    const persistPayload: NewLogEntry = {
      date: todayKey,
      drspScores: { ...drsp, [DRSP_SI.key]: si ?? 1 },
      mood: null,
      energy: null,
      pain: null,
      physicalSymptoms: physical,
      notes: voiceNote ?? '',
    };

    if (storedEntryId) {
      updateEntryInStore(storedEntryId, persistPayload);
    } else {
      const created = addEntryToStore(persistPayload);
      setStoredEntryId(created.id);
    }

    setState((s) => {
      const nextEntries = { ...s.entries, [todayKey]: entry };
      const nextState: AppState = { ...s, entries: nextEntries, fastLogMode: fastLog };

      // Simplified crisis tier logic (HQ_CRISIS not available in RN yet)
      const siVal = si ?? 1;
      if (siVal >= 5) {
        if (!reduceMotion) {
          setTimeout(() => setCrisisTier('tier3'), 50);
        } else {
          setCrisisTier('tier3');
        }
      } else if (siVal >= 3) {
        if (!reduceMotion) {
          setTimeout(() => setCrisisTier('tier2'), 50);
        } else {
          setCrisisTier('tier2');
        }
      }

      return nextState;
    });

    setSaved(true);
  };

  const closeCrisis = (): void => {
    setCrisisTier(null);
  };

  const openModule = (id: string): void => {
    setSavedEntry((prev) => (prev ? { ...prev, _openModule: id } : prev));
  };

  // ── Saved / confirm screen ───────────────────────────────────────────────
  if (saved) {
    const e = savedEntry ?? ({} as Partial<SavedEntry>);
    const drspE = e.drsp ?? {};
    const showRel = (drspE['fn_relationships'] ?? 0) >= 3;
    const showWork = (drspE['fn_work'] ?? 0) >= 3;
    const moodSev = Math.max(drspE['mood_swings'] ?? 0, drspE['irritability'] ?? 0);
    const showEpisode = moodSev >= 5;

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream }}>
        <View style={s.savedContainer}>
          <View style={s.checkCircle}>
            {/* Check mark — inline SVG not available in RN; use text glyph */}
            <Text style={s.checkGlyph}>✓</Text>
          </View>
          <Text style={[typography.bodyL, { textAlign: 'center', color: colors.ink }]}>
            Day {cycleDay} recorded.
          </Text>

          {/* T-26 functional impairment quick links */}
          <View style={s.savedActions}>
            {showRel && (
              <TouchableOpacity
                style={buttons.soft}
                onPress={() => openModule('relImpact')}
                accessibilityLabel="Log relationship moment"
                accessibilityRole="button"
              >
                <Text style={buttons.softLabel}>Log relationship moment →</Text>
              </TouchableOpacity>
            )}
            {showWork && (
              <TouchableOpacity
                style={buttons.soft}
                onPress={() => openModule('workImpact')}
                accessibilityLabel="Log work impact"
                accessibilityRole="button"
              >
                <Text style={buttons.softLabel}>Log work impact →</Text>
              </TouchableOpacity>
            )}
            {showEpisode && (
              <TouchableOpacity
                style={buttons.soft}
                onPress={() => openModule('rage')}
                accessibilityLabel="Log episode"
                accessibilityRole="button"
              >
                <Text style={buttons.softLabel}>Log episode →</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[s.ghostBtn, { marginTop: 8 }]}
              onPress={() => router.push('/(app)/home')}
              accessibilityLabel="Done — go to home"
              accessibilityRole="button"
            >
              <Text style={s.ghostBtnLabel}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* T-06 crisis modal */}
        <Modal
          visible={crisisTier !== null}
          animationType={reduceMotion ? 'none' : 'slide'}
          transparent
          onRequestClose={closeCrisis}
        >
          <View style={s.modalBackdrop}>
            <View style={s.modalSheet}>
              <Text style={[typography.eyebrow, { marginBottom: 8 }]}>Support</Text>
              <Text style={[typography.h2, { marginBottom: 8 }]}>
                {crisisTier === 'tier3'
                  ? "This is a hard one. You don't have to ride it out alone."
                  : "Some days in this phase can feel really dark."}
              </Text>
              <Text style={[typography.body, { marginBottom: 18 }]}>
                If you're in crisis, call or text 988 (US) for the Suicide &
                Crisis Lifeline. Outside the US, contact your local emergency services.
              </Text>
              <TouchableOpacity
                style={buttons.primary}
                onPress={closeCrisis}
                accessibilityLabel="Close support sheet"
                accessibilityRole="button"
              >
                <Text style={buttons.primaryLabel}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // ── Decide which DRSP items render ─────────────────────────────────────
  const drspToRender = fastLog
    ? DRSP_ITEMS.filter((it) => FAST_LOG_KEYS.includes(it.key))
    : DRSP_ITEMS;
  const showFunctionalGrid = !fastLog;
  const showFnImpairRow = fastLog;

  // ── Spotting visibility (R7 — F88) ─────────────────────────────────────
  const lastPeriod = state.lastPeriod ? new Date(state.lastPeriod) : null;
  const daysSincePeriod = lastPeriod
    ? Math.floor((Date.now() - lastPeriod.getTime()) / 86400000)
    : 0;
  const isPostmeno = state.perimenopausalStatus === 'postmenopause';
  const longAmenorrhea = daysSincePeriod >= 35;
  const showSpotting = isPostmeno || longAmenorrhea || state.irregular;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={layout.screen}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <Text style={[typography.display, { marginBottom: 4 }]}>Daily check-in</Text>
        {!state.cyclePaused && (
          <Text style={[typography.caption, { marginBottom: 16 }]}>
            Day {cycleDay} · {PHASE_NAMES[phase]} phase
          </Text>
        )}

        {/* R7 — F88 Spotting / unexpected bleeding capture */}
        {showSpotting && (
          <View style={[cards.cardWarm, s.spottingCard]}>
            <Text style={[typography.eyebrow, { marginBottom: 6 }]}>
              F88 · UNEXPECTED BLEEDING TODAY?
            </Text>
            <Text style={[typography.caption, { fontSize: 12, marginBottom: 10 }]}>
              {isPostmeno
                ? "You're postmenopausal. Any bleeding now is worth logging — we'll surface it in your safety summary."
                : `${daysSincePeriod} days since your last period. Spotting outside your usual cycle is worth noting.`}
            </Text>
            <View style={s.chipRow}>
              {(
                [
                  { v: null, l: 'Nothing today' },
                  { v: 'spotting', l: 'Spotting' },
                  { v: 'light', l: 'Light' },
                  { v: 'medium', l: 'Medium' },
                  { v: 'heavy', l: 'Heavy' },
                ] as Array<{ v: string | null; l: string }>
              ).map((o) => {
                const isActive = spottingFlow === o.v;
                return (
                  <TouchableOpacity
                    key={String(o.v)}
                    style={[cmp.chip, isActive && cmp.chipActive]}
                    onPress={() => logSpotting(o.v)}
                    accessibilityLabel={`Spotting: ${o.l}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                  >
                    <Text style={[cmp.chipLabel, isActive && cmp.chipLabelActive]}>
                      {o.l}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* T-11 — fast log toggle */}
        <View style={[cards.cardWarm, s.fastLogRow]}>
          <View style={{ flex: 1 }}>
            <Text style={s.fastLogTitle}>Fast log mode</Text>
            <Text style={[typography.caption, { fontSize: 12 }]}>
              {fastLog ? '~30s · vibe + 3 items + impairment' : '~90s · full DRSP grid'}
            </Text>
          </View>
          <TouchableOpacity
            style={[s.switchTrack, fastLog && s.switchTrackOn]}
            onPress={() => setFastLog((v) => !v)}
            accessibilityLabel={`Fast log mode — currently ${fastLog ? 'on' : 'off'}`}
            accessibilityRole="switch"
            accessibilityState={{ checked: fastLog }}
          >
            <View style={[s.switchThumb, fastLog && s.switchThumbOn]} />
          </TouchableOpacity>
        </View>

        {/* Vibe check — T-45 mood icons + auto-advance */}
        <Text style={[typography.h2, { marginBottom: 6 }]}>How are you, really?</Text>
        <Text style={[typography.caption, { marginBottom: 14 }]}>
          A vibe check. Just for you — not part of your clinical record.
        </Text>
        <View style={{ marginBottom: 28, gap: 8 }}>
          {FEELINGS.map((f) => {
            const isActive = feeling === f.label;
            return (
              <TouchableOpacity
                key={f.label}
                style={[s.feelBtn, isActive && s.feelBtnActive]}
                onPress={() => setFeeling(f.label)}
                accessibilityLabel={`Feeling: ${f.label} — ${f.sub}`}
                accessibilityRole="button"
                accessibilityState={{ selected: isActive }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 }}>
                  <View
                    style={[
                      s.feelTone,
                      { backgroundColor: f.tone },
                    ]}
                  />
                  <View style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                    <Text style={s.feelLabel}>{f.label}</Text>
                    {f.sub ? (
                      <Text style={[typography.caption, { fontSize: 12 }]}>{f.sub}</Text>
                    ) : null}
                  </View>
                </View>
                {isActive && (
                  <Text style={s.checkMark}>✓</Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Cycle day confirm strip */}
        <View style={[cards.cardMint, s.cycleDayRow]}>
          <TouchableOpacity
            style={s.iconBtn}
            onPress={() =>
              setState((s) => ({
                ...s,
                cycleDay: Math.max(1, s.cycleDay - 1),
              }))
            }
            accessibilityLabel="Previous cycle day"
            accessibilityRole="button"
          >
            <Text style={s.iconBtnText}>‹</Text>
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <Text style={[typography.data, { fontSize: 16, color: colors.eucalyptusDeep }]}>
              Day {cycleDay} · {PHASE_NAMES[phase]}
            </Text>
            <Text style={[typography.caption, { marginTop: 4 }]}>Tap to correct</Text>
          </View>
          <TouchableOpacity
            style={s.iconBtn}
            onPress={() =>
              setState((s) => ({
                ...s,
                cycleDay: Math.min(s.cycleLen, s.cycleDay + 1),
              }))
            }
            accessibilityLabel="Next cycle day"
            accessibilityRole="button"
          >
            <Text style={s.iconBtnText}>›</Text>
          </TouchableOpacity>
        </View>

        {/* DRSP grid */}
        <Text style={[typography.h2, { marginBottom: 4, marginTop: 24 }]}>
          {fastLog ? 'Top symptoms' : "Today's symptoms"}
        </Text>
        <Text style={[typography.caption, { marginBottom: 12 }]}>
          Daily Record of Severity of Problems · 1 = not at all, 6 = extreme
        </Text>

        {/* Anchor legend */}
        <View style={[cards.cardPaper, s.anchorLegend]}>
          <View style={s.anchorRow}>
            <Text style={s.anchorItem}><Text style={s.anchorNum}>1</Text> Not at all</Text>
            <Text style={s.anchorItem}><Text style={s.anchorNum}>2</Text> Minimal</Text>
            <Text style={s.anchorItem}><Text style={s.anchorNum}>3</Text> Mild</Text>
          </View>
          <View style={s.anchorRow}>
            <Text style={s.anchorItem}><Text style={s.anchorNum}>4</Text> Moderate</Text>
            <Text style={s.anchorItem}><Text style={s.anchorNum}>5</Text> Severe</Text>
            <Text style={s.anchorItem}><Text style={s.anchorNum}>6</Text> Extreme</Text>
          </View>
        </View>

        {drspToRender.map((it) => (
          <ScaleRow
            key={it.key}
            label={it.label}
            value={drsp[it.key]}
            onSet={(n) => setSym(it.key, n)}
          />
        ))}

        {/* DRSP item 12 — SI (always visible for safety) */}
        <View style={s.siBox}>
          <Text style={[typography.caption, { marginBottom: 8, fontSize: 11, color: colors.ink2 }]}>
            Item 12 — important to track. There's no judgement here.
          </Text>
          <ScaleRow label={DRSP_SI.label} value={si} onSet={setSi} />
        </View>

        {/* Functional impairment — full grid (non-fast log) */}
        {showFunctionalGrid && (
          <>
            <Text style={[typography.h2, { marginTop: 8, marginBottom: 6 }]}>
              Did symptoms interfere?
            </Text>
            <Text style={[typography.caption, { marginBottom: 12 }]}>
              The DRSP needs this for diagnosis.
            </Text>
            {FUNCTIONAL_ITEMS.map((it) => (
              <ScaleRow
                key={it.key}
                label={it.label}
                value={drsp[it.key]}
                onSet={(n) => setSym(it.key, n)}
              />
            ))}
          </>
        )}

        {/* Functional impairment — single row (fast log) */}
        {showFnImpairRow && (
          <>
            <Text style={[typography.h2, { marginTop: 8, marginBottom: 6 }]}>
              Did symptoms interfere today?
            </Text>
            <ScaleRow
              label="Overall functional impairment"
              value={fnImpair}
              onSet={setFnImpair}
              max={5}
            />
          </>
        )}

        {/* T-22 — ADHD check-in 4th step (BEFORE save) */}
        {isAdhdUser && !fastLog && (
          <View style={s.adhdSection}>
            <View style={s.adhdHeader}>
              <Text style={typography.h2}>ADHD check-in (optional)</Text>
              <TouchableOpacity
                style={s.ghostBtn}
                onPress={() => setShowAdhdSection((v) => !v)}
                accessibilityLabel={showAdhdSection ? 'Skip ADHD section' : 'Show ADHD section'}
                accessibilityRole="button"
              >
                <Text style={[s.ghostBtnLabel, { fontSize: 12 }]}>
                  {showAdhdSection ? 'Skip this section' : 'Show'}
                </Text>
              </TouchableOpacity>
            </View>
            <Text style={[typography.caption, { marginBottom: 12, fontSize: 12 }]}>
              5 EF dimensions · 1–5 · skip without warning
            </Text>
            {showAdhdSection &&
              ADHD_EF.map((d) => (
                <ScaleRow
                  key={d.key}
                  label={d.label}
                  value={adhdEF[d.key]}
                  onSet={(n) => setEF(d.key, n)}
                  max={5}
                />
              ))}
          </View>
        )}

        {/* Physical chips */}
        {!fastLog && (
          <>
            <Text style={[typography.h2, { marginTop: 18, marginBottom: 12 }]}>
              Physical (tap any)
            </Text>
            <View style={[s.chipRow, { marginBottom: 32 }]}>
              {physicalList.map((p) => {
                const isActive = physical.includes(p);
                return (
                  <TouchableOpacity
                    key={p}
                    style={[cmp.chip, isActive && cmp.chipActive]}
                    onPress={() => togglePhysical(p)}
                    accessibilityLabel={`Physical symptom: ${p}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                  >
                    <Text style={[cmp.chipLabel, isActive && cmp.chipLabelActive]}>{p}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* ADHD med rating */}
        {isAdhdUser && !fastLog && (
          <View style={{ marginBottom: 32 }}>
            <Text style={[typography.h2, { marginBottom: 8 }]}>
              How well did your ADHD meds work today?
            </Text>
            <Text style={[typography.caption, { marginBottom: 12 }]}>
              Estrogen affects dopamine — your meds may feel weaker before your period.
            </Text>
            <View style={s.scaleRow}>
              {[1, 2, 3, 4, 5].map((n) => {
                const isActive = adhdRating === n;
                return (
                  <TouchableOpacity
                    key={n}
                    style={[cmp.scaleBtn, isActive && cmp.scaleBtnActive, s.scaleBtnFlex]}
                    onPress={() => setAdhdRating(n)}
                    accessibilityLabel={`ADHD meds effectiveness: ${n} of 5`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                  >
                    <Text style={[cmp.scaleBtnLabel, isActive && cmp.scaleBtnLabelActive]}>
                      {n}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* Sleep */}
        {!fastLog && (
          <>
            <Text style={[typography.h2, { marginBottom: 12 }]}>Last night's sleep</Text>
            <View style={[s.scaleRow, { marginBottom: 8 }]}>
              {sleepList.map((label, i) => {
                const isActive = sleep === i + 1;
                return (
                  <TouchableOpacity
                    key={label}
                    style={[cmp.scaleBtn, isActive && cmp.scaleBtnActive, s.scaleBtnFlex]}
                    onPress={() => setSleep(i + 1)}
                    accessibilityLabel={`Sleep: ${label}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                  >
                    <Text
                      style={[
                        cmp.scaleBtnLabel,
                        isActive && cmp.scaleBtnLabelActive,
                        { fontSize: 11 },
                      ]}
                    >
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* T-11 — voice note step (optional) */}
        <View style={[cards.cardWarm, s.voiceRow]}>
          <View style={{ flex: 1 }}>
            <Text style={s.voiceTitle}>Quick voice note (optional)</Text>
            <Text style={[typography.caption, { fontSize: 12 }]}>
              {voiceNote
                ? 'Note saved · ' + voiceNote.slice(-6)
                : recording
                  ? 'Listening… 3 sec'
                  : 'Tap mic to add'}
            </Text>
          </View>
          <TouchableOpacity
            style={[s.micBtn, recording && s.micBtnRecording]}
            onPress={recordVoiceNote}
            accessibilityLabel={recording ? 'Recording in progress' : 'Record voice note'}
            accessibilityRole="button"
            disabled={recording}
          >
            <Text style={s.micBtnText}>{recording ? '●' : '🎙'}</Text>
          </TouchableOpacity>
        </View>

        {/* Save CTA */}
        <TouchableOpacity
          style={[buttons.primary, { marginTop: 24, height: 56 }]}
          onPress={save}
          accessibilityLabel="Save today's entry"
          accessibilityRole="button"
        >
          <Text style={buttons.primaryLabel}>✦ Save today's entry</Text>
        </TouchableOpacity>

        {/* T-79 — privacy footer */}
        <View style={s.privacyFooter}>
          <View style={s.privacyRow}>
            <Svg width={14} height={14} viewBox="0 0 24 24" fill="none">
              <SvgRect
                x={4}
                y={10}
                width={16}
                height={11}
                rx={2}
                stroke={colors.ink3}
                strokeWidth={1.6}
              />
              <SvgPath
                d="M8 10V7a4 4 0 0 1 8 0v3"
                stroke={colors.ink3}
                strokeWidth={1.6}
                strokeLinecap="round"
              />
            </Svg>
            <Text style={s.privacyText}>On this device. Encrypted.</Text>
          </View>
          {si !== null && si >= 4 && (
            <Text style={s.privacyText}>this entry is not stored beyond 72 hours</Text>
          )}
        </View>
      </ScrollView>

      {/* T-06 crisis modal (shown during log flow) */}
      <Modal
        visible={crisisTier !== null}
        animationType={reduceMotion ? 'none' : 'slide'}
        transparent
        onRequestClose={closeCrisis}
      >
        <View style={s.modalBackdrop}>
          <View style={s.modalSheet}>
            <Text style={[typography.eyebrow, { marginBottom: 8 }]}>Support</Text>
            <Text style={[typography.h2, { marginBottom: 8 }]}>
              {crisisTier === 'tier3'
                ? "This is a hard one. You don't have to ride it out alone."
                : 'Some days in this phase can feel really dark.'}
            </Text>
            <Text style={[typography.body, { marginBottom: 18 }]}>
              If you're in crisis, call or text 988 (US) for the Suicide &
              Crisis Lifeline. Outside the US, contact your local emergency services.
            </Text>
            <TouchableOpacity
              style={buttons.primary}
              onPress={closeCrisis}
              accessibilityLabel="Close support sheet"
              accessibilityRole="button"
            >
              <Text style={buttons.primaryLabel}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const s = StyleSheet.create({
  // ScaleRow
  scaleRowWrap: {
    marginBottom: 16,
  },
  scaleRowLabel: {
    marginBottom: 6,
    fontSize: 14,
    fontFamily: fonts.sansMedium,
  },
  scaleRow: {
    flexDirection: 'row',
    gap: 6,
  },
  scaleBtnFlex: {
    flex: 1,
  },

  // Feeling buttons
  feelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.paper,
    minHeight: 56,
  },
  feelBtnActive: {
    borderColor: colors.eucalyptus,
    backgroundColor: colors.mintPale,
  },
  feelTone: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.6)',
    flexShrink: 0,
  },
  feelLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.ink,
  },
  checkMark: {
    fontFamily: fonts.sansMedium,
    fontSize: 18,
    color: colors.eucalyptus,
  },

  // Cycle day confirm
  cycleDayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnText: {
    fontFamily: fonts.sans,
    fontSize: 22,
    color: colors.ink,
    lineHeight: 26,
  },

  // Anchor legend
  anchorLegend: {
    padding: 10,
    marginBottom: 18,
  },
  anchorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 4,
    marginBottom: 2,
  },
  anchorItem: {
    fontFamily: fonts.mono,
    fontSize: 11,
    color: colors.ink2,
    flex: 1,
  },
  anchorNum: {
    fontFamily: fonts.monoMedium,
    fontWeight: '700',
  },

  // SI box
  siBox: {
    marginTop: 6,
    padding: 14,
    backgroundColor: colors.creamWarm,
    borderRadius: radius.md,
    marginBottom: 18,
  },

  // Spotting card
  spottingCard: {
    padding: 14,
    marginBottom: 16,
    borderLeftWidth: 3,
    borderLeftColor: colors.coralSoft,
  },

  // Chip row
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },

  // Fast log toggle
  fastLogRow: {
    padding: 12,
    marginBottom: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  fastLogTitle: {
    fontFamily: fonts.sansSemibold,
    fontSize: 14,
    color: colors.ink,
    marginBottom: 2,
  },

  // Switch
  switchTrack: {
    width: 44,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.inkDisabled,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  switchTrackOn: {
    backgroundColor: colors.eucalyptus,
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.paper,
    alignSelf: 'flex-start',
  },
  switchThumbOn: {
    alignSelf: 'flex-end',
  },

  // ADHD section
  adhdSection: {
    marginTop: 18,
    marginBottom: 28,
    padding: 16,
    backgroundColor: colors.mintPale,
    borderRadius: radius.md,
  },
  adhdHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },

  // Ghost button
  ghostBtn: {
    height: 44,
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

  // Voice note
  voiceRow: {
    padding: 14,
    marginTop: 18,
    marginBottom: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  voiceTitle: {
    fontFamily: fonts.sansSemibold,
    fontSize: 14,
    color: colors.ink,
    marginBottom: 2,
  },
  micBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.eucalyptus,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  micBtnRecording: {
    backgroundColor: colors.coral,
  },
  micBtnText: {
    fontSize: 18,
    lineHeight: 22,
  },

  // Privacy footer
  privacyFooter: {
    marginTop: 18,
    paddingVertical: 10,
    alignItems: 'center',
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  privacyText: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink3,
    lineHeight: 18,
    textAlign: 'center',
  },

  // Saved confirm screen
  savedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xl,
  },
  checkCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.mintMist,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  checkGlyph: {
    fontFamily: fonts.sansSemibold,
    fontSize: 22,
    color: colors.eucalyptusDeep,
  },
  savedActions: {
    marginTop: 18,
    gap: 8,
    width: '100%',
    maxWidth: 360,
    alignItems: 'stretch',
  },

  // Modal
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
});
