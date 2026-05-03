// CycleScreen — phase ring + calendar views.
// Port of design-handoff/08-implementation-code/src/calendar.jsx (300 lines).
// T-82: ring view default + month-back offset. T-85: cycle-paused guard.

import { useState, useMemo } from 'react';
import type { ReactElement } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';
import { useReducedMotion } from 'react-native-reanimated';

import {
  buttons,
  cards,
  components as cmp,
  layout,
  typography,
} from '../../src/constants/styles';
import { colors, fonts, radius, spacing } from '../../src/constants/tokens';
import { phaseForDay } from '../../src/lib/phase';
import type { Phase } from '../../src/lib/phase';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type PhaseCode = 'F' | 'O' | 'L' | 'Lm' | 'Ls' | 'M' | '?';
type CalendarView = 'ring' | 'month' | 'week';
type SeverityLevel = 'mild' | 'moderate' | 'severe' | null;

interface DRSPEntry {
  [symptom: string]: number | unknown;
}

interface DayEntry {
  drsp?: DRSPEntry;
  drspScores?: number[];
  siScore?: number;
  savedAt?: number;
}

interface PeriodLogEntry {
  flow?: string | null;
  started?: boolean;
  at?: number;
}

interface CycleState {
  cycleLen: number;
  lastPeriod: string; // YYYY-MM-DD
  irregular: boolean;
  cyclePaused: boolean;
  conditions: string[];
  entries: Record<string, DayEntry>;
  periodLog: Record<string, PeriodLogEntry>;
  cycleRingDefault: boolean;
  demoPersona: boolean;
}

interface DayInfo {
  cycleDay: number;
  phase: PhaseCode;
  sev: SeverityLevel;
  isToday: boolean;
  anovulatory: boolean;
  dateKey: string;
  periodStarted: boolean;
  periodFlow: string | null | undefined;
}

interface CalendarCell {
  d: number;
  info: DayInfo | null;
  date: Date;
}

interface WeekDay {
  date: Date;
  info: DayInfo | null;
}

// ─────────────────────────────────────────────
// Initial state (replaces window.HQ.useApp())
// ─────────────────────────────────────────────
const INITIAL_STATE: CycleState = {
  cycleLen: 28,
  lastPeriod: '2024-12-15',
  irregular: false,
  cyclePaused: false,
  conditions: ['PMDD'],
  entries: {},
  periodLog: {},
  cycleRingDefault: true,
  demoPersona: false,
};

// ─────────────────────────────────────────────
// Phase helpers — mirror shared.jsx PHASE_COLORS, PHASE_NAMES, PHASE_VIBES
// ─────────────────────────────────────────────
const PHASE_FILL: Record<PhaseCode, string> = {
  F: colors.sageLight,
  O: colors.butter,
  L: colors.coralSoft,
  Lm: colors.coralSoft,
  Ls: colors.coral,
  M: colors.rose,
  '?': colors.mintMist,
};

const PHASE_NAMES_DISPLAY: Record<PhaseCode, string> = {
  F: 'Follicular',
  O: 'Ovulatory',
  L: 'Luteal',
  Lm: 'Early luteal',
  Ls: 'Late luteal',
  M: 'Menstrual',
  '?': 'Variable',
};

function phaseToCode(p: Phase): PhaseCode {
  switch (p) {
    case 'follicular':  return 'F';
    case 'ovulatory':   return 'O';
    case 'luteal':      return 'Lm';
    case 'luteal-late': return 'Ls';
    case 'menstrual':   return 'M';
    default:            return '?';
  }
}

function phaseCodeForDay(
  day: number,
  cycleLen: number,
  irregular: boolean,
): PhaseCode {
  if (irregular) return '?';
  return phaseToCode(phaseForDay(day, cycleLen));
}

function sevColor(s: SeverityLevel): string {
  if (s === 'severe')   return colors.severitySevere;
  if (s === 'moderate') return colors.severityMod;
  return colors.severityMild;
}

// ─────────────────────────────────────────────
// CycleRing — 5-segment arc SVG (port of shared.jsx CycleRing)
// ─────────────────────────────────────────────
interface CycleRingProps {
  cycleDay: number;
  cycleLen: number;
  size?: number;
  onPress?: () => void;
}

function CycleRing({
  cycleDay,
  cycleLen,
  size = 300,
  onPress,
}: CycleRingProps): ReactElement {
  const r = size / 2 - 18;
  const cx = size / 2;
  const cy = size / 2;

  const fEnd  = Math.round(cycleLen * 0.45);
  const oEnd  = Math.round(cycleLen * 0.55);
  const lmEnd = Math.round(cycleLen * 0.78);

  const segments: Array<{ from: number; to: number; color: string }> = [
    { from: 1,         to: 5,                               color: colors.rose },
    { from: 6,         to: fEnd,                            color: colors.sageLight },
    { from: fEnd + 1,  to: oEnd,                            color: colors.butter },
    { from: oEnd + 1,  to: lmEnd,                           color: colors.coralSoft },
    { from: lmEnd + 1, to: Math.max(cycleLen - 5, lmEnd + 2), color: colors.coral },
    { from: Math.max(cycleLen - 4, lmEnd + 3), to: cycleLen, color: colors.rose },
  ].filter((s) => s.from <= s.to);

  function arcPath(from: number, to: number): string {
    const a1 = ((from - 1) / cycleLen) * 360 - 90;
    const a2 = (to / cycleLen) * 360 - 90;
    const r1 = (a1 * Math.PI) / 180;
    const r2 = (a2 * Math.PI) / 180;
    const x1 = cx + r * Math.cos(r1);
    const y1 = cy + r * Math.sin(r1);
    const x2 = cx + r * Math.cos(r2);
    const y2 = cy + r * Math.sin(r2);
    const large = a2 - a1 > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
  }

  const dotAngle = ((cycleDay / cycleLen) * 360 - 90) * (Math.PI / 180);
  const dotX = cx + r * Math.cos(dotAngle);
  const dotY = cy + r * Math.sin(dotAngle);

  const phaseCode = phaseCodeForDay(cycleDay, cycleLen, false);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel="Cycle ring — tap to switch to month view"
      style={{ width: size, height: size }}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <Circle cx={cx} cy={cy} r={r} fill="none" stroke={colors.border} strokeWidth={1} />
        {/* Phase segments */}
        {segments.map((seg, i) => (
          <Path
            key={i}
            d={arcPath(seg.from, seg.to)}
            stroke={seg.color}
            strokeWidth={14}
            fill="none"
            strokeLinecap="round"
          />
        ))}
        {/* Center plate */}
        <Circle cx={cx} cy={cy} r={r - 22} fill={colors.paper} opacity={0.92} />
        <Circle cx={cx} cy={cy} r={r - 22} fill="none" stroke={colors.border} strokeWidth={0.5} />
        {/* Current day dot */}
        <Circle cx={dotX} cy={dotY} r={14} fill={colors.paper} stroke={colors.eucalyptus} strokeWidth={2.5} />
        <Circle cx={dotX} cy={dotY} r={5} fill={colors.eucalyptus} />
      </Svg>
      {/* Center text overlay */}
      <View style={ringS.center} pointerEvents="none">
        <Text style={ringS.dayNum}>Day {cycleDay}</Text>
        <Text style={ringS.phaseName}>{PHASE_NAMES_DISPLAY[phaseCode].toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const ringS = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayNum: {
    fontFamily: fonts.display,
    fontSize: 38,
    color: colors.ink,
    letterSpacing: -1,
  },
  phaseName: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 2,
    color: colors.ink2,
    textTransform: 'uppercase',
    marginTop: 4,
  },
});

// ─────────────────────────────────────────────
// PhaseLegend — 5-phase pill row
// ─────────────────────────────────────────────
function PhaseLegend(): ReactElement {
  const items: Array<{ k: PhaseCode; n: string }> = [
    { k: 'F',  n: 'Follicular' },
    { k: 'O',  n: 'Ovulatory' },
    { k: 'Lm', n: 'Early luteal' },
    { k: 'Ls', n: 'Late luteal' },
    { k: 'M',  n: 'Menstrual' },
  ];
  return (
    <View style={legS.row}>
      {items.map((it) => (
        <View key={it.k} style={legS.item}>
          <View style={[legS.dot, { backgroundColor: PHASE_FILL[it.k] }]} />
          <Text style={legS.label}>{it.n}</Text>
        </View>
      ))}
    </View>
  );
}

const legS = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink2,
  },
});

// ─────────────────────────────────────────────
// EmptyState
// ─────────────────────────────────────────────
interface EmptyStateProps {
  title: string;
  body: string;
}
function EmptyState({ title, body }: EmptyStateProps): ReactElement {
  return (
    <View style={emS.wrap}>
      <Text style={emS.title}>{title}</Text>
      <Text style={emS.body}>{body}</Text>
    </View>
  );
}
const emS = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  title: {
    fontFamily: fonts.sansSemibold,
    fontSize: 15,
    color: colors.ink,
    marginBottom: 6,
    textAlign: 'center',
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink3,
    textAlign: 'center',
    maxWidth: 300,
    lineHeight: 19,
  },
});

// ─────────────────────────────────────────────
// Phase description for day-detail modal
// ─────────────────────────────────────────────
function phaseDescription(code: PhaseCode): string {
  switch (code) {
    case 'Lm': return 'Early luteal phase. Progesterone rises after ovulation; energy may settle.';
    case 'Ls': return 'Late luteal phase. Hormones drop sharply — often the peak of premenstrual symptoms.';
    case 'L':  return 'Luteal phase. Hormones falling — many find symptoms peak in the days before bleeding.';
    case 'F':  return 'Follicular phase. Estrogen rising. Many feel most baseline here.';
    case 'O':  return 'Ovulatory window. Estrogen peaks — energy and confidence often follow.';
    default:   return 'Menstrual phase. Hormones reset. Many find symptoms lift within 1–2 days.';
  }
}

// ─────────────────────────────────────────────
// CycleScreen
// ─────────────────────────────────────────────
export default function CycleScreen(): ReactElement {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [state, setState] = useState<CycleState>(INITIAL_STATE);
  const [view, setView] = useState<CalendarView>(
    state.cycleRingDefault === false ? 'month' : 'ring',
  );
  const [monthOffset, setMonthOffset] = useState(0);
  const [selected, setSelected] = useState<CalendarCell | null>(null);

  // T-85 — when cycle paused, calendar is disabled
  if (state.cyclePaused) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream }}>
        <ScrollView contentContainerStyle={layout.screen}>
          <Text style={[typography.display, { marginBottom: 18 }]}>Calendar</Text>
          <View style={[cards.cardWarm, { padding: 22 }]}>
            <Text style={[typography.eyebrow, { marginBottom: 8 }]}>PAUSED</Text>
            <Text style={[typography.body, { marginBottom: 14 }]}>
              Cycle tracking is paused. Tap Profile to resume.
            </Text>
            <TouchableOpacity
              style={buttons.soft}
              onPress={() => router.push('/(app)/profile')}
              accessibilityRole="button"
              accessibilityLabel="Open Profile"
            >
              <Text style={buttons.softLabel}>Open Profile</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const today = new Date();
  const target = new Date(today.getFullYear(), today.getMonth() - monthOffset, 1);
  const month = target.getMonth();
  const year = target.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const lastPeriod = new Date(state.lastPeriod);
  const cycleLen = state.cycleLen;
  const irregular = !!(state.irregular || (state.conditions ?? []).includes('PCOS'));

  function dayInfo(date: Date): DayInfo | null {
    const diff = Math.floor((date.getTime() - lastPeriod.getTime()) / 86400000);
    if (diff < 0) return null;
    const cycleDay = (diff % cycleLen) + 1;
    const phase = phaseCodeForDay(cycleDay, cycleLen, irregular);
    const dateKey = date.toISOString().slice(0, 10);
    const entry = (state.entries ?? {})[dateKey];
    let sev: SeverityLevel = null;
    if (entry?.drsp) {
      const nums = Object.values(entry.drsp).filter((v): v is number => typeof v === 'number');
      const max = nums.length > 0 ? Math.max(0, ...nums) : 0;
      if (max >= 5) sev = 'severe';
      else if (max >= 3) sev = 'moderate';
      else if (max >= 1) sev = 'mild';
    }
    const cycleNumber = Math.floor(diff / cycleLen);
    const anovulatory = irregular && cycleNumber % 3 === 2;
    const periodLog = (state.periodLog ?? {})[dateKey];
    const periodStarted = !!(periodLog?.started);
    const periodFlow = periodLog?.flow;
    return {
      cycleDay,
      phase,
      sev,
      isToday: date.toDateString() === today.toDateString(),
      anovulatory,
      dateKey,
      periodStarted,
      periodFlow,
    };
  }

  // Build month grid cells
  const cells = useMemo<Array<CalendarCell | null>>(() => {
    const out: Array<CalendarCell | null> = [];
    for (let i = 0; i < firstDay; i++) out.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      out.push({ d, info: dayInfo(date), date });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [year, month, firstDay, daysInMonth, state.entries, state.periodLog, state.lastPeriod, cycleLen, irregular]);

  // Build 7-day week strip (next 7 days from today)
  const weekDays = useMemo<WeekDay[]>(() => {
    const out: WeekDay[] = [];
    for (let i = 0; i < 7; i++) {
      const dt = new Date(today);
      dt.setDate(today.getDate() + i);
      out.push({ date: dt, info: dayInfo(dt) });
    }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.entries, state.periodLog, state.lastPeriod, cycleLen, irregular]);

  const monthName = target.toLocaleString('default', { month: 'long' });

  const hasAnyEntries =
    state.entries != null && Object.keys(state.entries).length > 0;

  // T-82 — recently logged days (descending, last 8)
  const loggedDays = useMemo(
    () =>
      Object.entries(state.entries ?? {})
        .filter(([_k, e]) => e != null && Object.keys(e).length > 0)
        .sort(([a], [b]) => (a < b ? 1 : -1))
        .slice(0, 8),
    [state.entries],
  );

  // Today's cycleDay — for ring view focus
  const todayDiff = Math.floor(
    (today.getTime() - lastPeriod.getTime()) / 86400000,
  );
  const todayCycleDay = ((todayDiff % cycleLen) + cycleLen) % cycleLen + 1;

  // T-82 — phase segment tap → switch to month view
  const onTapPhaseSegment = (): void => {
    setView('month');
    setMonthOffset(0);
  };

  const DAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'] as const;
  const WEEK_DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
  const VIEW_TABS: CalendarView[] = ['ring', 'month', 'week'];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[layout.screen, { paddingTop: 18 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <View style={s.headerRow}>
          <View style={s.titleGroup}>
            {/* T-82 — back chevron for month view (up to 6 months) */}
            {view === 'month' && (
              <TouchableOpacity
                onPress={() => setMonthOffset((m) => Math.min(6, m + 1))}
                disabled={monthOffset >= 6}
                style={[s.iconBtn, { opacity: monthOffset >= 6 ? 0.4 : 1 }]}
                accessibilityRole="button"
                accessibilityLabel="Previous month"
                accessibilityState={{ disabled: monthOffset >= 6 }}
              >
                <Text style={s.iconBtnText}>‹</Text>
              </TouchableOpacity>
            )}
            <View>
              <Text style={typography.eyebrow}>{year}</Text>
              <Text style={typography.display}>
                {view === 'ring' ? 'Your cycle' : monthName}
              </Text>
              {state.demoPersona && (
                <View style={s.demoBadge}>
                  <Text style={s.demoBadgeText}>DEMO DATA</Text>
                </View>
              )}
            </View>
            {view === 'month' && monthOffset > 0 && (
              <TouchableOpacity
                onPress={() => setMonthOffset((m) => Math.max(0, m - 1))}
                style={[s.iconBtn, { marginLeft: 4 }]}
                accessibilityRole="button"
                accessibilityLabel="Next month"
              >
                <Text style={s.iconBtnText}>›</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* View toggle pills */}
          <View style={s.viewToggle}>
            {VIEW_TABS.map((v) => (
              <TouchableOpacity
                key={v}
                onPress={() => setView(v)}
                style={[s.viewTab, view === v && s.viewTabActive]}
                accessibilityRole="button"
                accessibilityLabel={`${v} view`}
                accessibilityState={{ selected: view === v }}
              >
                <Text
                  style={[
                    s.viewTabLabel,
                    view === v && s.viewTabLabelActive,
                  ]}
                >
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── RING VIEW ─────────────────────────────────────── */}
        {view === 'ring' && (
          <>
            <View style={s.ringWrap}>
              <CycleRing
                cycleDay={todayCycleDay}
                cycleLen={cycleLen}
                size={300}
                onPress={onTapPhaseSegment}
              />
            </View>
            <Text style={[typography.caption, { textAlign: 'center', marginBottom: 22 }]}>
              Tap a phase segment to view that month
            </Text>

            <View style={{ marginBottom: 20 }}>
              <PhaseLegend />
            </View>

            <Text style={[typography.eyebrow, { marginBottom: 10 }]}>
              RECENTLY LOGGED
            </Text>
            {loggedDays.length === 0 ? (
              <Text style={typography.caption}>
                Your logged days will appear here.
              </Text>
            ) : (
              <View style={{ gap: 8 }}>
                {loggedDays.map(([dateKey, entry]) => {
                  const dt = new Date(dateKey);
                  const info = dayInfo(dt);
                  if (!info) return null;
                  return (
                    <View
                      key={dateKey}
                      style={[cards.cardPaper, s.loggedRow]}
                    >
                      <View>
                        <Text style={[typography.data, { fontSize: 13 }]}>
                          {dt.toLocaleDateString(undefined, {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </Text>
                        <Text
                          style={[typography.caption, { fontSize: 11, marginTop: 2 }]}
                        >
                          Day {info.cycleDay} · {PHASE_NAMES_DISPLAY[info.phase]}
                        </Text>
                      </View>
                      {info.sev != null && (
                        <View
                          style={[
                            cmp.phasePill,
                            { backgroundColor: PHASE_FILL[info.phase] },
                          ]}
                        >
                          <View
                            style={[
                              cmp.phaseDot,
                              { backgroundColor: sevColor(info.sev) },
                            ]}
                          />
                          <Text style={cmp.phasePillLabel}>{info.sev}</Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </>
        )}

        {/* ── MONTH VIEW ───────────────────────────────────── */}
        {view === 'month' && (
          <>
            {/* Day-of-week header */}
            <View style={s.calGrid}>
              {DAY_LABELS.map((d, i) => (
                <View key={i} style={s.calHeaderCell}>
                  <Text style={[typography.caption, { textAlign: 'center', fontFamily: fonts.sansMedium }]}>
                    {d}
                  </Text>
                </View>
              ))}
            </View>
            {/* Calendar day cells */}
            <View style={s.calGrid}>
              {cells.map((c, i) => {
                if (c == null) {
                  return <View key={i} style={s.calDayEmpty} />;
                }
                const { info, d } = c;
                const bg = info != null ? PHASE_FILL[info.phase] : colors.mintPale;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      s.calDay,
                      { backgroundColor: bg },
                      info?.isToday && s.calDayToday,
                      info?.anovulatory && s.calDayAnovulatory,
                      info != null && !info.isToday && !info.anovulatory && s.calDayBorder,
                      { opacity: info?.anovulatory ? 0.85 : 1 },
                    ]}
                    onPress={() => setSelected(c)}
                    accessibilityRole="button"
                    accessibilityLabel={`Day ${d}${info != null ? `, cycle day ${info.cycleDay}, ${PHASE_NAMES_DISPLAY[info.phase]} phase` : ''}`}
                  >
                    <Text
                      style={[
                        s.calDayNum,
                        { fontFamily: info?.isToday ? fonts.sansBold : fonts.sans },
                      ]}
                    >
                      {d}
                    </Text>
                    <View style={s.calDotRow}>
                      {info?.sev != null && (
                        <View
                          style={[s.calDot, { backgroundColor: sevColor(info.sev) }]}
                        />
                      )}
                      {info?.periodStarted === true && (
                        <View style={[s.calDot, s.calDotPeriod]} />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {/* ── WEEK VIEW ─────────────────────────────────────── */}
        {view === 'week' && (
          <View style={s.weekGrid}>
            {weekDays.map((w, i) => (
              <View
                key={i}
                style={[
                  s.weekCol,
                  {
                    backgroundColor:
                      w.info != null ? PHASE_FILL[w.info.phase] : colors.mintPale,
                  },
                ]}
              >
                <Text style={s.weekColDayLabel}>
                  {WEEK_DAY_LABELS[w.date.getDay()]}
                </Text>
                <Text style={s.weekColCycleDay}>
                  D{w.info?.cycleDay ?? '—'}
                </Text>
                <View style={{ flex: 1 }} />
                {w.info?.sev != null && (
                  <View
                    style={[
                      s.weekColSevBar,
                      { backgroundColor: sevColor(w.info.sev) },
                    ]}
                  />
                )}
              </View>
            ))}
          </View>
        )}

        {/* ── Phase legend (month + week views) ──────────────── */}
        {view !== 'ring' && (
          <View style={s.legendSection}>
            <PhaseLegend />
          </View>
        )}

        {/* ── Empty state (month + week views) ───────────────── */}
        {!hasAnyEntries && view !== 'ring' && (
          <View style={{ marginTop: 18 }}>
            <EmptyState
              title="No entries logged yet."
              body="Your calendar fills in as you log. Severity dots will appear on the days you record."
            />
          </View>
        )}
      </ScrollView>

      {/* ── Day Detail Modal ────────────────────────────────── */}
      <Modal
        visible={selected != null && selected.info != null}
        animationType={reduceMotion ? 'none' : 'slide'}
        transparent
        onRequestClose={() => setSelected(null)}
      >
        <Pressable
          style={s.modalBackdrop}
          onPress={() => setSelected(null)}
          accessibilityRole="button"
          accessibilityLabel="Close day detail"
        >
          {selected?.info != null && (
            <Pressable
              style={s.modalSheet}
              onPress={(e) => e.stopPropagation()}
              accessibilityRole="none"
            >
              <Text style={typography.caption}>
                {selected.date.toDateString()}
              </Text>
              <Text style={[typography.displaySm, { marginTop: 4, marginBottom: 14 }]}>
                Day {selected.info.cycleDay}{' '}
                <Text style={{ color: colors.eucalyptus }}>
                  · {PHASE_NAMES_DISPLAY[selected.info.phase]}
                </Text>
              </Text>

              {selected.info.sev != null && (
                <View style={{ marginBottom: 12 }}>
                  <View
                    style={[
                      cmp.phasePill,
                      { backgroundColor: PHASE_FILL[selected.info.phase] },
                    ]}
                  >
                    <View
                      style={[
                        cmp.phaseDot,
                        { backgroundColor: sevColor(selected.info.sev) },
                      ]}
                    />
                    <Text style={cmp.phasePillLabel}>
                      {selected.info.sev} symptoms logged
                    </Text>
                  </View>
                </View>
              )}

              <Text style={[typography.body, { color: colors.ink2, marginBottom: 16 }]}>
                {phaseDescription(selected.info.phase)}
              </Text>

              {/* Mark period start */}
              {(() => {
                if (selected.date > today) return null;
                const dateKey = selected.date.toISOString().slice(0, 10);
                const periodLog = state.periodLog ?? {};
                const alreadyLogged = !!(periodLog[dateKey]?.started);
                if (alreadyLogged) {
                  return (
                    <View style={s.periodLoggedNote}>
                      <Text style={[typography.caption, { fontSize: 12 }]}>
                        Period start logged for this day
                        {periodLog[dateKey]?.flow != null
                          ? ` · ${periodLog[dateKey].flow} flow`
                          : ''}
                        .
                      </Text>
                    </View>
                  );
                }
                return (
                  <TouchableOpacity
                    style={[buttons.soft, { marginBottom: 10 }]}
                    onPress={() => {
                      const key = selected.date.toISOString().slice(0, 10);
                      setState((prev) => ({
                        ...prev,
                        lastPeriod: key,
                        periodLog: {
                          ...prev.periodLog,
                          [key]: { flow: null, started: true, at: Date.now() },
                        },
                      }));
                      setSelected(null);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="Mark period start on this day"
                  >
                    <Text style={buttons.softLabel}>
                      Mark period start on this day
                    </Text>
                  </TouchableOpacity>
                );
              })()}

              <TouchableOpacity
                style={buttons.outline}
                onPress={() => setSelected(null)}
                accessibilityRole="button"
                accessibilityLabel="Close day detail"
              >
                <Text style={buttons.outlineLabel}>Close</Text>
              </TouchableOpacity>
            </Pressable>
          )}
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const CAL_COL = 7;

const s = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
    gap: 12,
    flexWrap: 'wrap',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.mintPale,
  },
  iconBtnText: {
    fontFamily: fonts.sansMedium,
    fontSize: 20,
    color: colors.eucalyptus,
    lineHeight: 22,
  },
  demoBadge: {
    marginTop: 6,
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 8,
    backgroundColor: colors.butter,
    borderRadius: radius.sm,
  },
  demoBadgeText: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    letterSpacing: 0.7,
    color: colors.ink,
  },
  viewToggle: {
    flexDirection: 'row',
    gap: 2,
    padding: 4,
    backgroundColor: colors.mintPale,
    borderRadius: radius.pill,
  },
  viewTab: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewTabActive: {
    backgroundColor: colors.eucalyptus,
  },
  viewTabLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    color: colors.ink2,
    textTransform: 'capitalize',
  },
  viewTabLabelActive: {
    color: colors.paper,
  },
  ringWrap: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 18,
  },
  loggedRow: {
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  // Calendar grid — 7 equal columns
  calGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calHeaderCell: {
    width: `${100 / CAL_COL}%` as unknown as number,
    padding: 4,
    alignItems: 'center',
  },
  calDayEmpty: {
    width: `${100 / CAL_COL}%` as unknown as number,
    aspectRatio: 1,
  },
  calDay: {
    width: `${100 / CAL_COL}%` as unknown as number,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    padding: 2,
    minHeight: 44,
  },
  calDayBorder: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  calDayToday: {
    borderWidth: 2,
    borderColor: colors.eucalyptus,
    shadowColor: '#3F6F5A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 4,
  },
  calDayAnovulatory: {
    borderWidth: 2,
    borderColor: 'rgba(60,95,75,0.45)',
    borderStyle: 'dashed',
  },
  calDayNum: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: 'rgba(0,0,0,0.78)',
  },
  calDotRow: {
    flexDirection: 'row',
    gap: 3,
    alignItems: 'center',
    marginTop: 2,
  },
  calDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  calDotPeriod: {
    backgroundColor: colors.rose,
    borderWidth: 1,
    borderColor: colors.paper,
  },
  weekGrid: {
    flexDirection: 'row',
    gap: 4,
  },
  weekCol: {
    flex: 1,
    minHeight: 220,
    padding: 10,
    borderRadius: radius.sm,
    flexDirection: 'column',
  },
  weekColDayLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(0,0,0,0.78)',
    opacity: 0.7,
    textTransform: 'capitalize',
  },
  weekColCycleDay: {
    fontFamily: fonts.mono,
    fontSize: 18,
    color: 'rgba(0,0,0,0.78)',
    marginTop: 2,
  },
  weekColSevBar: {
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
  legendSection: {
    marginTop: 24,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  // Day detail modal
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
    paddingBottom: 40,
  },
  periodLoggedNote: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: colors.mintPale,
    borderRadius: radius.sm,
  },
});
