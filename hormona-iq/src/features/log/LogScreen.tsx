// LogScreen — Composes all daily-log sections.
// Owns all state and passes callbacks down to section components.
// Wave 1: T-01 full DRSP, T-04 persistence, T-05 SI as item 12, T-06 crisis post-save
// Wave 2: T-11 fast-log mode + voice note, T-22 ADHD check-in 4th step, T-26 functional quick-links

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import type { ReactElement } from 'react';
import {
  Animated,
  Linking,
  Modal,
  Pressable,
  SectionList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useReducedMotion } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Svg, { Path as SvgPath, Rect as SvgRect } from 'react-native-svg';
import { OraMarkSvg } from '../../components/illustrations/OraMarkSvg';

import {
  buttons,
  cards,
  layout,
  typography,
} from '../../constants/styles';
import { colors, fonts, radius, spacing } from '../../constants/tokens';
import { useAppStore, useLogStore } from '../../stores';
import type { LogEntry, NewLogEntry } from '../../stores';
import { PillButton } from '../../components/ui/PillButton';
import { SectionCard } from '../../components/ui/SectionCard';

import { VibeCheck } from './VibeCheck';
import {
  ScaleRow,
  DRSP_SI,
  FAST_LOG_KEYS,
  DRSP_ITEMS,
  DRSP_SECTIONS,
  FUNCTIONAL_ITEMS,
  ADHD_EF,
} from './DrspScale';
import { PhysicalSymptoms, PHYSICAL_LIST } from './PhysicalSymptoms';
import { SleepScale } from './SleepScale';

// ─────────────────────────────────────────────
// Types
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

// ─────────────────────────────────────────────
// SectionList item types
// ─────────────────────────────────────────────

type LogListItem =
  | { kind: 'drsp'; key: string; label: string }
  | { kind: 'si' }
  | { kind: 'fn_grid'; key: string; label: string }
  | { kind: 'fn_single' }
  | { kind: 'adhd_ef'; efKey: string; label: string }
  | { kind: 'adhd_meds' };

interface LogSection {
  key: string;
  title: string;
  note?: string;
  isAdhdHeader?: boolean;
  data: LogListItem[];
}

// ─────────────────────────────────────────────
// Phase helpers
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
// Initial state
// ─────────────────────────────────────────────

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
// Phase-aware confirmation helper
// ─────────────────────────────────────────────

function getConfirmationNote(phase: PhaseCode, drsp: DrspScores): string {
  const moodVal = Math.max(drsp['mood_swings'] ?? 0, drsp['irritability'] ?? 0);
  if (phase === 'Ls' || phase === 'M') {
    return moodVal >= 4
      ? 'Hard day logged. This data helps your provider see the pattern.'
      : 'Logged. Rest counts in this phase.';
  }
  if (phase === 'F') return 'Follicular phase — a good window for your patterns to build.';
  if (phase === 'O') return 'Ovulatory window logged.';
  return 'Logged and saved.';
}

// ─────────────────────────────────────────────
// SaveCelebration — animated botanical mark for save confirmation.
// Scale 0.6→1 + opacity 0→1 over 420ms. Skips animation if reduceMotion.
// ─────────────────────────────────────────────

function SaveCelebration({ reduceMotion }: { reduceMotion: boolean }): ReactElement {
  const scale = useRef(new Animated.Value(reduceMotion ? 1 : 0.6)).current;
  const opacity = useRef(new Animated.Value(reduceMotion ? 1 : 0)).current;

  useEffect(() => {
    if (reduceMotion) return;
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, reduceMotion, scale]);

  return (
    <Animated.View
      style={[
        s.checkCircle,
        { transform: [{ scale }], opacity },
      ]}
    >
      <OraMarkSvg size={28} state="insight" color="#3F6F5A" />
    </Animated.View>
  );
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function LogScreen(): ReactElement {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  // Cycle context from the persisted app store
  const storeCycleLen = useAppStore((s) => s.cycleLen);
  const storeLastPeriod = useAppStore((s) => s.lastPeriod);

  // Daily-log persistence
  const getEntryForDate = useLogStore((s) => s.getEntryForDate);
  const addEntryToStore = useLogStore((s) => s.addEntry);
  const updateEntryInStore = useLogStore((s) => s.updateEntry);

  const [state, setState] = useState<AppState>(() => ({
    ...INITIAL_STATE,
    cycleLen: storeCycleLen,
    lastPeriod: storeLastPeriod ? storeLastPeriod.toISOString().slice(0, 10) : null,
  }));

  const todayKey = new Date().toISOString().slice(0, 10);
  const yesterdayKey = (() => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
  })();

  // Hydrate today's draft from the persistent log store on mount.
  const persistedToday: LogEntry | undefined = getEntryForDate(todayKey);
  const existing = state.entries[todayKey] ?? ({} as Partial<SavedEntry>);
  const yesterdayEntry = state.entries[yesterdayKey];
  const yesterdayDrsp: Record<string, number> | undefined =
    yesterdayEntry?.drsp ?? undefined;

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

  // Auto-enable fast log when in late luteal or menstrual phase
  const initialPhase = phaseForDay(state.cycleDay, state.cycleLen);
  const shouldAutoFastLog = initialPhase === 'Ls' || initialPhase === 'M';
  const [fastLog, setFastLog] = useState(
    state.fastLogMode ?? shouldAutoFastLog,
  );
  const [spottingFlow, setSpottingFlow] = useState<string | null | undefined>(
    state.spottingLog[todayKey]?.flow,
  );

  const { cycleDay, cycleLen } = state;
  const phase = phaseForDay(cycleDay, cycleLen);

  const isAdhdUser = state.adhd === 'Yes' || state.adhd === 'I think so';

  // ── Callbacks ───────────────────────────────────────────────────────────

  const setSym = useCallback(
    (key: string, n: number): void => setDrsp((prev) => ({ ...prev, [key]: n })),
    [],
  );

  const carryForward = (): void => {
    if (yesterdayDrsp != null) {
      setDrsp((prev) => ({ ...yesterdayDrsp, ...prev }));
    }
  };

  const setEF = useCallback(
    (key: string, n: number): void => setAdhdEF((prev) => ({ ...prev, [key]: n })),
    [],
  );

  const togglePhysical = (p: string): void => {
    setPhysical((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  };

  // T-11 — voice note (mock 3-sec record)
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
      drsp: si != null ? { ...drsp, [DRSP_SI.key]: si } : { ...drsp },
      feeling,
      physical,
      adhdRating,
      sleep,
      voiceNote,
      adhdEF: isAdhdUser ? adhdEF : undefined,
      fnImpair,
      suicidal_ideation: si ?? 0,
      savedAt: Date.now(),
    };

    setSavedEntry(entry);

    // Persist to the global log store (creates or updates today's entry).
    const persistPayload: NewLogEntry = {
      date: todayKey,
      drspScores: si != null ? { ...drsp, [DRSP_SI.key]: si } : { ...drsp },
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

      // Crisis tier logic — null SI means not answered, treat as 0
      const siVal = si ?? 0;
      if (siVal >= 5) {
        if (!reduceMotion) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          setTimeout(() => setCrisisTier('tier3'), 50);
        } else {
          setCrisisTier('tier3');
        }
      } else if (siVal >= 3) {
        if (!reduceMotion) {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          setTimeout(() => setCrisisTier('tier2'), 50);
        } else {
          setCrisisTier('tier2');
        }
      }

      return nextState;
    });

    setSaved(true);
    if (!reduceMotion) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const closeCrisis = (): void => {
    setCrisisTier(null);
  };

  const openModule = (id: string): void => {
    setSavedEntry((prev) => (prev ? { ...prev, _openModule: id } : prev));
  };

  // ── SectionList data / render ────────────────────────────────────────────

  const hasYesterday = yesterdayDrsp != null && Object.keys(yesterdayDrsp).length > 0;

  const sections = useMemo((): LogSection[] => {
    if (fastLog) {
      const fastItems = FAST_LOG_KEYS.map((k) => {
        const item = DRSP_ITEMS.find((i) => i.key === k);
        return item ? { kind: 'drsp' as const, key: item.key, label: item.label } : null;
      }).filter((x): x is { kind: 'drsp'; key: string; label: string } => x !== null);
      return [{
        key: 'fast',
        title: '',
        data: [...fastItems, { kind: 'si' as const }, { kind: 'fn_single' as const }],
      }];
    }

    const result: LogSection[] = DRSP_SECTIONS.map((section) => ({
      key: section.title,
      title: section.title,
      data: [
        ...section.keys
          .filter((k) => k !== DRSP_SI.key)
          .map((k) => {
            const item = DRSP_ITEMS.find((i) => i.key === k);
            return item ? { kind: 'drsp' as const, key: item.key, label: item.label } : null;
          })
          .filter(
            (x): x is { kind: 'drsp'; key: string; label: string } => x !== null,
          ),
        ...(section.keys.includes(DRSP_SI.key) ? [{ kind: 'si' as const }] : []),
      ],
    }));

    result.push({
      key: 'functional',
      title: 'Did symptoms interfere?',
      note: 'The DRSP needs this for diagnosis.',
      data: FUNCTIONAL_ITEMS.map((it) => ({
        kind: 'fn_grid' as const,
        key: it.key,
        label: it.label,
      })),
    });

    if (isAdhdUser) {
      result.push({
        key: 'adhd_ef',
        title: 'ADHD check-in (optional)',
        note: '5 EF dimensions · 1–5 · skip without warning',
        isAdhdHeader: true,
        data: showAdhdSection
          ? ADHD_EF.map((d) => ({ kind: 'adhd_ef' as const, efKey: d.key, label: d.label }))
          : [],
      });
      result.push({
        key: 'adhd_meds',
        title: 'How well did your ADHD meds work today?',
        note: 'Estrogen affects dopamine — your meds may feel weaker before your period.',
        data: [{ kind: 'adhd_meds' as const }],
      });
    }

    return result;
  }, [fastLog, isAdhdUser, showAdhdSection]);

  const renderSectionHeader = useCallback(
    ({ section }: { section: LogSection }): ReactElement | null => {
      if (!section.title) return null;
      return (
        <View style={s.drspSectionHeader}>
          <View style={s.drspSectionHeaderInner}>
            <Text style={s.drspSectionTitle}>{section.title}</Text>
            {section.isAdhdHeader === true && (
              <TouchableOpacity
                style={s.ghostBtn}
                onPress={() => setShowAdhdSection((v) => !v)}
                accessibilityLabel={showAdhdSection ? 'Skip ADHD section' : 'Show ADHD section'}
                accessibilityRole="button"
              >
                <Text style={s.ghostBtnLabel}>
                  {showAdhdSection ? 'Skip this section' : 'Show'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {section.note != null && (
            <Text style={s.drspSectionNote}>{section.note}</Text>
          )}
        </View>
      );
    },
    [showAdhdSection],
  );

  const renderItem = useCallback(
    ({ item }: { item: LogListItem }): ReactElement | null => {
      switch (item.kind) {
        case 'drsp':
          return (
            <View style={s.drspItem}>
              <ScaleRow
                label={item.label}
                value={drsp[item.key]}
                onSet={(n) => setSym(item.key, n)}
                yesterdayValue={yesterdayDrsp?.[item.key]}
              />
            </View>
          );
        case 'si':
          return (
            <View style={[s.drspItem, s.siBox]}>
              <Text style={s.siNote}>
                Item 12 — important to track. There's no judgement here.
              </Text>
              <ScaleRow
                label={DRSP_SI.label}
                value={si}
                onSet={setSi}
                yesterdayValue={yesterdayDrsp?.[DRSP_SI.key]}
                isSI
              />
            </View>
          );
        case 'fn_grid':
          return (
            <View style={s.drspItem}>
              <ScaleRow
                label={item.label}
                value={drsp[item.key]}
                onSet={(n) => setSym(item.key, n)}
                yesterdayValue={yesterdayDrsp?.[item.key]}
              />
            </View>
          );
        case 'fn_single':
          return (
            <View style={s.drspItem}>
              <Text style={[typography.h2, { marginTop: 8, marginBottom: 6 }]}>
                Did symptoms interfere today?
              </Text>
              <ScaleRow
                label="Overall functional impairment"
                value={fnImpair}
                onSet={setFnImpair}
                max={6}
              />
            </View>
          );
        case 'adhd_ef':
          return (
            <View style={s.drspItem}>
              <ScaleRow
                label={item.label}
                value={adhdEF[item.efKey]}
                onSet={(n) => setEF(item.efKey, n)}
                max={5}
              />
            </View>
          );
        case 'adhd_meds':
          return (
            <View style={s.drspItem}>
              <ScaleRow
                label="Effectiveness today (1–5)"
                value={adhdRating}
                onSet={setAdhdRating}
                max={5}
              />
            </View>
          );
        default:
          return null;
      }
    },
    // setSym, setEF, setSi, setFnImpair, setAdhdRating are stable (useCallback / React dispatch)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [drsp, si, fnImpair, adhdEF, adhdRating, yesterdayDrsp, setSym, setEF],
  );

  const keyExtractor = useCallback(
    (item: LogListItem, index: number): string => {
      if ('key' in item) return `${item.kind}-${item.key}`;
      if ('efKey' in item) return `adhd_ef-${item.efKey}`;
      return `${item.kind}-${index}`;
    },
    [],
  );

  const extraData = useMemo(
    () => ({ drsp, si, fnImpair, adhdEF, adhdRating }),
    [drsp, si, fnImpair, adhdEF, adhdRating],
  );

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
          <SaveCelebration reduceMotion={reduceMotion ?? false} />
          <Text style={[typography.bodyL, { textAlign: 'center', color: colors.ink }]}>
            Day {cycleDay} recorded.
          </Text>
          <Text style={[typography.caption, { textAlign: 'center', marginTop: 8, color: colors.ink2 }]}>
            {getConfirmationNote(phase, drspE)}
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
              <Text style={[typography.caption, { marginBottom: 8, color: colors.ink3, letterSpacing: 0.4 }]}>Support</Text>
              <Text style={[typography.h2, { marginBottom: 8 }]}>
                {crisisTier === 'tier3'
                  ? 'This is serious and you deserve support right now.'
                  : 'Some days in this phase can feel really dark.'}
              </Text>
              <Text style={[typography.body, { marginBottom: 16 }]}>
                {crisisTier === 'tier3'
                  ? 'If you need support right now, call or text 988 (US). Free, confidential, 24/7.'
                  : "You don't have to navigate this alone. Your safety plan is here when you need it."}
              </Text>
              {crisisTier === 'tier3' ? (
                <>
                  <TouchableOpacity
                    style={buttons.primary}
                    onPress={() => {
                      void Linking.openURL('tel:988');
                    }}
                    accessibilityLabel="Call or text 988"
                    accessibilityRole="button"
                  >
                    <Text style={buttons.primaryLabel}>Call or text 988</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.ghostBtn, { marginTop: 8 }]}
                    onPress={closeCrisis}
                    accessibilityLabel="Close"
                    accessibilityRole="button"
                  >
                    <Text style={s.ghostBtnLabel}>Close</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={buttons.soft}
                    onPress={closeCrisis}
                    accessibilityLabel="Open safety plan"
                    accessibilityRole="button"
                  >
                    <Text style={buttons.softLabel}>Open safety plan</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.ghostBtn, { marginTop: 8 }]}
                    onPress={closeCrisis}
                    accessibilityLabel="Close"
                    accessibilityRole="button"
                  >
                    <Text style={s.ghostBtnLabel}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  // ── Spotting visibility (R7 — F88) ─────────────────────────────────────
  const lastPeriod = state.lastPeriod ? new Date(state.lastPeriod) : null;
  const daysSincePeriod = lastPeriod
    ? Math.floor((Date.now() - lastPeriod.getTime()) / 86400000)
    : 0;
  const isPostmeno = state.perimenopausalStatus === 'postmenopause';
  const longAmenorrhea = daysSincePeriod >= 35;
  const showSpotting = isPostmeno || longAmenorrhea || state.irregular;

  const listHeader = (
    <View>
      <Text style={[typography.display, { marginBottom: 4 }]}>Daily check-in</Text>
      {!state.cyclePaused && (
        <Text style={[typography.caption, { marginBottom: 16 }]}>
          Day {cycleDay} · {PHASE_NAMES[phase]} phase
        </Text>
      )}

      {showSpotting && (
        <View style={[cards.cardWarm, s.spottingCard]}>
          <View style={s.spottingAccent} />
          <View style={s.spottingContent}>
            <Text style={[typography.eyebrow, { marginBottom: 6 }]}>
              UNEXPECTED BLEEDING TODAY?
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
                    style={[s.chip, isActive && s.chipActive]}
                    onPress={() => logSpotting(o.v)}
                    accessibilityLabel={`Spotting: ${o.l}`}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isActive }}
                  >
                    <Text style={[s.chipLabel, isActive && s.chipLabelActive]}>
                      {o.l}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      )}

      {shouldAutoFastLog && fastLog && (
        <View style={s.autoFastBanner}>
          <Text style={s.autoFastBannerText}>Simplified log today</Text>
          <Pressable
            onPress={() => setFastLog(false)}
            accessibilityRole="button"
            accessibilityLabel="Switch to full log"
          >
            <Text style={s.autoFastBannerLink}>Switch to full</Text>
          </Pressable>
        </View>
      )}

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

      <VibeCheck feeling={feeling} onFeelingChange={setFeeling} />

      <View style={[cards.cardMint, s.cycleDayRow]}>
        <TouchableOpacity
          style={s.iconBtn}
          onPress={() => setState((prev) => ({ ...prev, cycleDay: Math.max(1, prev.cycleDay - 1) }))}
          accessibilityLabel="Previous cycle day"
          accessibilityRole="button"
        >
          <Text style={s.iconBtnText}>←</Text>
        </TouchableOpacity>
        <View style={{ alignItems: 'center' }}>
          <Text style={[typography.data, { fontSize: 15, color: colors.eucalyptusDeep }]}>
            Day {cycleDay} · {PHASE_NAMES[phase]}
          </Text>
          <Text style={[typography.caption, { marginTop: 4 }]}>Tap to correct</Text>
        </View>
        <TouchableOpacity
          style={s.iconBtn}
          onPress={() => setState((prev) => ({ ...prev, cycleDay: Math.min(prev.cycleLen, prev.cycleDay + 1) }))}
          accessibilityLabel="Next cycle day"
          accessibilityRole="button"
        >
          <Text style={s.iconBtnText}>→</Text>
        </TouchableOpacity>
      </View>

      <Text style={[typography.h2, { marginBottom: 4, marginTop: 24 }]}>
        {fastLog ? 'Top symptoms' : "Today's symptoms"}
      </Text>
      <Text style={[typography.caption, { marginBottom: 12 }]}>
        Daily Record of Severity of Problems · 1 = not at all, 6 = extreme
      </Text>

      <SectionCard style={s.anchorLegend}>
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
      </SectionCard>

      {hasYesterday && (
        <TouchableOpacity
          style={s.carryForwardBtn}
          onPress={carryForward}
          accessibilityRole="button"
          accessibilityLabel="Copy yesterday's ratings as a starting point"
        >
          <Text style={s.carryForwardLabel}>Same as yesterday</Text>
          <Text style={s.carryForwardSub}>Adjust anything that changed</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const listFooter = (
    <View>
      {!fastLog && (
        <PhysicalSymptoms
          selected={physical}
          onToggle={togglePhysical}
          onSelectNone={() => setPhysical([])}
        />
      )}
      {!fastLog && (
        <SleepScale sleep={sleep} onSleepChange={setSleep} />
      )}

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
          <Text style={s.micBtnText}>{recording ? '●' : 'Rec'}</Text>
        </TouchableOpacity>
      </View>

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
              strokeWidth={1.5}
            />
            <SvgPath
              d="M8 10V7a4 4 0 0 1 8 0v3"
              stroke={colors.ink3}
              strokeWidth={1.5}
              strokeLinecap="round"
            />
          </Svg>
          <Text style={s.privacyText}>On this device. Encrypted.</Text>
        </View>
        {si !== null && si >= 4 && (
          <Text style={s.privacyText}>this entry is not stored beyond 72 hours</Text>
        )}
        <Pressable
          style={{ marginTop: 6 }}
          accessibilityRole="link"
          accessibilityLabel="Your data privacy options"
          onPress={() => {
            // Placeholder — data & deletion options screen
          }}
        >
          <Text style={[s.privacyText, { textDecorationLine: 'underline' }]}>
            Your data & deletion options
          </Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream }}>
        <SectionList
          sections={sections}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled
          extraData={extraData}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[layout.screen, { paddingBottom: 100 }]}
          ListHeaderComponent={listHeader}
          ListFooterComponent={listFooter}
        />

        <View style={s.stickyFooter}>
          <PillButton
            label="Save today's entry"
            onPress={save}
            variant="primary"
            size="lg"
          />
        </View>

        <Modal
          visible={crisisTier !== null}
          animationType={reduceMotion ? 'none' : 'slide'}
          transparent
          onRequestClose={closeCrisis}
        >
          <View style={s.modalBackdrop}>
            <View style={s.modalSheet}>
              <Text style={[typography.caption, { marginBottom: 8, color: colors.ink3, letterSpacing: 0.4 }]}>Support</Text>
              <Text style={[typography.h2, { marginBottom: 8 }]}>
                {crisisTier === 'tier3'
                  ? 'This is serious and you deserve support right now.'
                  : 'Some days in this phase can feel really dark.'}
              </Text>
              <Text style={[typography.body, { marginBottom: 16 }]}>
                {crisisTier === 'tier3'
                  ? 'If you need support right now, call or text 988 (US). Free, confidential, 24/7.'
                  : "You don't have to navigate this alone. Your safety plan is here when you need it."}
              </Text>
              {crisisTier === 'tier3' ? (
                <>
                  <TouchableOpacity
                    style={buttons.primary}
                    onPress={() => { void Linking.openURL('tel:988'); }}
                    accessibilityLabel="Call or text 988"
                    accessibilityRole="button"
                  >
                    <Text style={buttons.primaryLabel}>Call or text 988</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.ghostBtn, { marginTop: 8 }]}
                    onPress={closeCrisis}
                    accessibilityLabel="Close"
                    accessibilityRole="button"
                  >
                    <Text style={s.ghostBtnLabel}>Close</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={buttons.soft}
                    onPress={closeCrisis}
                    accessibilityLabel="Open safety plan"
                    accessibilityRole="button"
                  >
                    <Text style={buttons.softLabel}>Open safety plan</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[s.ghostBtn, { marginTop: 8 }]}
                    onPress={closeCrisis}
                    accessibilityLabel="Close"
                    accessibilityRole="button"
                  >
                    <Text style={s.ghostBtnLabel}>Close</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const s = StyleSheet.create({
  // Feeling buttons (used in saved screen area via VibeCheck)
  ghostBtn: {
    height: 44,
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

  // Sticky footer
  stickyFooter: {
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: colors.cream,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },

  // Auto fast-log banner
  autoFastBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.mintMist,
    borderRadius: radius.md,
    marginBottom: 12,
  },
  autoFastBannerText: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.eucalyptusDeep,
  },
  autoFastBannerLink: {
    fontFamily: fonts.sansSemibold,
    fontSize: 13,
    color: colors.eucalyptus,
    textDecorationLine: 'underline',
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
    borderRadius: 18,
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

  // Spotting card
  spottingCard: {
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'stretch',
    gap: 10,
  },
  spottingAccent: {
    width: 4,
    backgroundColor: colors.coralSoft,
    borderRadius: 2,
    alignSelf: 'stretch',
  },
  spottingContent: {
    flex: 1,
  },

  // Chip row (spotting)
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.paper,
    borderRadius: radius.pill,
    minHeight: 44,
    alignSelf: 'flex-start',
  },
  chipActive: {
    backgroundColor: colors.eucalyptus,
    borderColor: colors.eucalyptus,
  },
  chipLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.ink,
  },
  chipLabelActive: {
    color: colors.paper,
  },

  // Fast log toggle
  fastLogRow: {
    padding: 12,
    marginBottom: 24,
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
    borderRadius: 12,
    backgroundColor: colors.inkDisabled,
    justifyContent: 'center',
    paddingHorizontal: 4,
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

  // Voice note
  voiceRow: {
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
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
    borderRadius: 18,
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
    marginTop: 16,
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
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.mintMist,
    borderWidth: 1,
    borderColor: colors.borderMint,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  savedActions: {
    marginTop: 16,
    gap: 8,
    width: '100%',
    maxWidth: 360,
    alignItems: 'stretch',
  },

  // ── SectionList DRSP ─────────────────────────────────────────────────────
  drspItem: {
    paddingHorizontal: spacing.md,
  },
  drspSectionHeader: {
    backgroundColor: colors.cream,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xs,
  },
  drspSectionHeaderInner: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  drspSectionTitle: {
    fontSize: 11,
    fontFamily: fonts.sansMedium,
    color: colors.eucalyptus,
    letterSpacing: 0.8,
    textTransform: 'uppercase' as const,
  },
  drspSectionNote: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink2,
    marginTop: 2,
    marginBottom: spacing.xs,
  },

  // ── Anchor legend ─────────────────────────────────────────────────────────
  anchorLegend: {
    padding: 10,
    marginBottom: 16,
  },
  anchorRow: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
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
    fontWeight: '700' as const,
  },

  // ── Carry-forward ─────────────────────────────────────────────────────────
  carryForwardBtn: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    paddingVertical: 11,
    paddingHorizontal: 14,
    backgroundColor: colors.mintPale,
    borderWidth: 1,
    borderColor: colors.borderMint,
    borderRadius: radius.md,
    marginBottom: 18,
    gap: 8,
  },
  carryForwardLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.eucalyptusDeep,
  },
  carryForwardSub: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink3,
  },

  // ── SI box ────────────────────────────────────────────────────────────────
  siBox: {
    marginTop: spacing.xs,
    padding: spacing.md,
    backgroundColor: colors.creamWarm,
    borderRadius: radius.md,
    marginBottom: spacing.lg,
  },
  siNote: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink2,
    marginBottom: spacing.sm,
  },

  // Modal
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(27, 46, 37, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.creamWarm,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: 28,
    paddingBottom: 40,
  },
});
