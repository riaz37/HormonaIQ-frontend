function CalendarScreen() {
  const { useApp, phaseForDay, PHASE_COLORS, PHASE_NAMES, PHASE_VIBES, Icon, Leaf, Blob, PhaseLegend, EmptyState, CycleRing } = window.HQ;
  const { state, setState, goto } = useApp();
  // T-82 — Ring view default + month-back offset (months prior to today; 0 = current)
  const [view, setView] = React.useState(state.cycleRingDefault === false ? 'month' : 'ring');
  const [monthOffset, setMonthOffset] = React.useState(0);
  const [selected, setSelected] = React.useState(null);

  // T-85 — when cycle paused, calendar is disabled
  if (state.cyclePaused) {
    return (
      <div className="screen">
        <h1 className="display" style={{ marginBottom: 18 }}>Calendar</h1>
        <div className="card-warm" style={{ padding: 22 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>PAUSED</div>
          <p className="body">Cycle tracking is paused. Tap Profile to resume.</p>
          <button className="btn-soft" style={{ marginTop: 14 }} onClick={() => goto('profile')}>Open Profile</button>
        </div>
      </div>
    );
  }

  const today = new Date();
  // Resolve target month: today shifted back by monthOffset months
  const target = new Date(today.getFullYear(), today.getMonth() - monthOffset, 1);
  const month = target.getMonth();
  const year = target.getFullYear();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const lastPeriod = new Date(state.lastPeriod);
  const cycleLen = state.cycleLen;
  const irregular = !!(state.irregular || (state.conditions || []).includes('PCOS'));

  function dayInfo(date) {
    const diff = Math.floor((date - lastPeriod) / 86400000);
    if (diff < 0) return null;
    const cycleDay = (diff % cycleLen) + 1;
    const phase = phaseForDay(cycleDay, cycleLen, { irregular });
    const dateKey = date.toISOString().slice(0, 10);
    const entry = (state.entries || {})[dateKey];
    let sev = null;
    if (entry && entry.drsp) {
      const max = Math.max(0, ...Object.values(entry.drsp).filter(v => typeof v === 'number'));
      if (max >= 5) sev = 'severe';
      else if (max >= 3) sev = 'moderate';
      else if (max >= 1) sev = 'mild';
    }
    const cycleNumber = Math.floor(diff / cycleLen);
    const anovulatory = irregular && (cycleNumber % 3 === 2);
    const periodLog = (state.periodLog || {})[dateKey];
    const periodStarted = !!(periodLog && periodLog.started);
    const periodFlow = periodLog && periodLog.flow;
    return { cycleDay, phase, sev, isToday: date.toDateString() === today.toDateString(), anovulatory, dateKey, periodStarted, periodFlow };
  }

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    cells.push({ d, info: dayInfo(date), date });
  }

  const sevColor = (s) => s === 'severe' ? 'var(--severity-severe)' : s === 'moderate' ? 'var(--severity-mod)' : 'var(--severity-mild)';

  const monthName = target.toLocaleString('default', { month: 'long' });

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const dt = new Date(today); dt.setDate(today.getDate() + i);
    weekDays.push({ date: dt, info: dayInfo(dt) });
  }

  const hasAnyEntries = state.entries && Object.keys(state.entries).length > 0;

  // T-82 — recently logged days (descending, last 8)
  const loggedDays = Object.entries(state.entries || {})
    .filter(([_k, e]) => e && Object.keys(e).length > 0)
    .sort((a, b) => a[0] < b[0] ? 1 : -1)
    .slice(0, 8);

  // Today's cycleDay — for ring view focus
  const todayDiff = Math.floor((today - lastPeriod) / 86400000);
  const todayCycleDay = ((todayDiff % cycleLen) + cycleLen) % cycleLen + 1;

  // T-82 — phase segment tap → switch to month view and scroll to that segment's month
  const onTapPhaseSegment = (phaseName) => {
    setView('month');
    setMonthOffset(0); // current month
  };

  return (
    <div className="screen" style={{ position: 'relative' }}>
      <Leaf size={120} color="var(--sage-light)" style={{ bottom: 80, left: -36, opacity: 0.22 }} rotate={-15} />
      <Blob size={220} color="var(--mint-mist)" style={{ top: 40, right: -110, opacity: 0.22 }} animate />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18, position: 'relative', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* T-82 — back-chevron for month view (up to 6 months) */}
          {view === 'month' && (
            <button onClick={() => setMonthOffset(m => Math.min(6, m + 1))}
              className="icon-btn"
              aria-label="Previous month"
              disabled={monthOffset >= 6}
              style={{ opacity: monthOffset >= 6 ? 0.4 : 1 }}>
              <Icon.ChevLeft width="16" height="16" />
            </button>
          )}
          <div>
            <div className="eyebrow">{year}</div>
            <h1 className="display">{view === 'ring' ? 'Your cycle' : monthName}</h1>
            {state.demoPersona && (
              <span style={{ display: 'inline-block', marginTop: 6, padding: '2px 8px', fontSize: 10, fontWeight: 600, letterSpacing: '0.06em', background: 'var(--butter)', color: 'var(--ink)', borderRadius: 4 }}>
                DEMO DATA
              </span>
            )}
          </div>
          {view === 'month' && monthOffset > 0 && (
            <button onClick={() => setMonthOffset(m => Math.max(0, m - 1))}
              className="icon-btn"
              aria-label="Next month"
              style={{ marginLeft: 4 }}>
              <Icon.ChevRight width="16" height="16" />
            </button>
          )}
        </div>
        <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--mint-pale)', borderRadius: 999 }}>
          {['ring','month','week'].map(v => (
            <button key={v} onClick={() => setView(v)}
              style={{ padding: '6px 14px', fontSize: 12, fontWeight: 500, borderRadius: 999, background: view === v ? 'var(--eucalyptus)' : 'transparent', color: view === v ? '#fff' : 'var(--ink-2)', textTransform: 'capitalize' }}>
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* T-82 — RING VIEW */}
      {view === 'ring' && (
        <>
          <div className="fade-up" style={{ display: 'flex', justifyContent: 'center', marginTop: 8, marginBottom: 18 }}>
            <div onClick={onTapPhaseSegment} style={{ cursor: 'pointer' }}>
              <CycleRing cycleDay={todayCycleDay} cycleLen={cycleLen} size={300} />
            </div>
          </div>
          <div className="caption" style={{ textAlign: 'center', marginBottom: 22 }}>
            Tap a phase segment to view that month
          </div>
          <div style={{ marginBottom: 16 }}>
            {PhaseLegend && <PhaseLegend />}
          </div>

          <div className="eyebrow" style={{ marginBottom: 10 }}>RECENTLY LOGGED</div>
          {loggedDays.length === 0 ? (
            <div className="caption">Your logged days will appear here.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {loggedDays.map(([dateKey, entry]) => {
                const dt = new Date(dateKey);
                const info = dayInfo(dt);
                if (!info) return null;
                return (
                  <div key={dateKey} className="card" style={{ padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <div className="data" style={{ fontSize: 13 }}>{dt.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</div>
                      <div className="caption" style={{ fontSize: 11, marginTop: 2 }}>Day {info.cycleDay} · {PHASE_NAMES[info.phase]}</div>
                    </div>
                    {info.sev && (
                      <span className="phase-pill" style={{ background: PHASE_COLORS[info.phase] }}>
                        <span className="dot" style={{ background: sevColor(info.sev) }} />
                        {info.sev}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {view === 'month' && (
        <>
          <div className="cal-grid" style={{ marginBottom: 6 }}>
            {['S','M','T','W','T','F','S'].map((d,i) => <div key={i} className="caption" style={{ textAlign: 'center', padding: 4, fontWeight: 500 }}>{d}</div>)}
          </div>
          <div className="cal-grid">
            {cells.map((c, i) => {
              if (!c) return <div key={i} />;
              const { info, d } = c;
              const bg = info ? PHASE_COLORS[info.phase] : 'var(--mint-pale)';
              return (
                <div key={i} className="cal-day" onClick={() => setSelected(c)}
                  style={{
                    background: bg,
                    color: 'rgba(0,0,0,0.78)',
                    border: info?.isToday
                      ? '2px solid var(--eucalyptus)'
                      : info?.anovulatory ? '2px dashed rgba(60,95,75,0.45)' : '1px solid transparent',
                    boxShadow: info?.isToday ? '0 4px 14px rgba(63,111,90,0.3)' : 'none',
                    opacity: info?.anovulatory ? 0.85 : 1,
                  }}>
                  <div style={{ fontWeight: info?.isToday ? 600 : 400 }}>{d}</div>
                  <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                    {info?.sev && <div style={{ width: 6, height: 6, borderRadius: '50%', background: sevColor(info.sev) }} />}
                    {info?.periodStarted && <div title="Period start" style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--rose)', boxShadow: '0 0 0 1px white' }} />}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {view === 'week' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
          {weekDays.map((w, i) => (
            <div key={i} style={{ background: w.info ? PHASE_COLORS[w.info.phase] : 'var(--mint-pale)', minHeight: 220, padding: 10, color: 'rgba(0,0,0,0.78)', display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-sm)' }}>
              <div className="caption" style={{ color: 'inherit', opacity: 0.7, fontSize: 10, fontWeight: 500 }}>{['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][w.date.getDay()]}</div>
              <div className="data" style={{ fontSize: 18, marginTop: 2 }}>D{w.info?.cycleDay}</div>
              <div style={{ flex: 1 }} />
              {w.info?.sev && <div style={{ height: 4, background: sevColor(w.info.sev), borderRadius: 2 }} />}
            </div>
          ))}
        </div>
      )}

      {view !== 'ring' && (
        <div style={{ marginTop: 24, paddingTop: 18, borderTop: '1px solid var(--border)' }}>
          {PhaseLegend && <PhaseLegend />}
        </div>
      )}

      {!hasAnyEntries && EmptyState && view !== 'ring' && (
        <div style={{ marginTop: 18 }}>
          <EmptyState
            icon={Icon.Calendar}
            title="No entries logged yet."
            body="Your calendar fills in as you log. Severity dots will appear on the days you record."
          />
        </div>
      )}

      {selected?.info && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="caption">{selected.date.toDateString()}</div>
            <h2 className="display-sm" style={{ marginTop: 4, marginBottom: 14 }}>
              Day {selected.info.cycleDay} · <span style={{ color: 'var(--eucalyptus)' }}>{PHASE_NAMES[selected.info.phase]}</span>
            </h2>
            {selected.info.sev && (
              <div style={{ marginBottom: 12 }}>
                <span className="phase-pill" style={{ background: PHASE_COLORS[selected.info.phase] }}>
                  <span className="dot" style={{ background: sevColor(selected.info.sev) }} />
                  {selected.info.sev} symptoms logged
                </span>
              </div>
            )}
            <p className="body" style={{ color: 'var(--ink-2)' }}>
              {selected.info.phase === 'Lm' ? 'Early luteal phase. Progesterone rises after ovulation; energy may settle.' :
               selected.info.phase === 'Ls' ? 'Late luteal phase. Hormones drop sharply — often the peak of premenstrual symptoms.' :
               selected.info.phase === 'L' ? 'Luteal phase. Hormones falling — many find symptoms peak in the days before bleeding.' :
               selected.info.phase === 'F' ? 'Follicular phase. Estrogen rising. Many feel most baseline here.' :
               selected.info.phase === 'O' ? 'Ovulatory window. Estrogen peaks — energy and confidence often follow.' :
               'Menstrual phase. Hormones reset. Many find symptoms lift within 1–2 days.'}
            </p>
            {/* Mark this day as period start (when tapped on a past day) */}
            {(() => {
              const dateKey = selected.date.toISOString().slice(0, 10);
              const periodLog = state.periodLog || {};
              const alreadyLogged = !!(periodLog[dateKey] && periodLog[dateKey].started);
              const isFuture = selected.date > new Date();
              if (isFuture) return null;
              if (alreadyLogged) {
                return (
                  <div className="caption" style={{ marginTop: 14, padding: 10, background: 'var(--mint-pale)', borderRadius: 10, fontSize: 12 }}>
                    Period start logged for this day{periodLog[dateKey].flow ? ` · ${periodLog[dateKey].flow} flow` : ''}.
                  </div>
                );
              }
              return (
                <button className="btn-soft" style={{ marginTop: 14, width: '100%', fontSize: 13 }}
                  onClick={() => {
                    setState(s => ({
                      ...s,
                      lastPeriod: dateKey,
                      periodLog: { ...(s.periodLog || {}), [dateKey]: { flow: null, started: true, at: Date.now() } },
                    }));
                    setSelected(null);
                  }}>
                  Mark period start on this day
                </button>
              );
            })()}
            <button className="btn-outline" style={{ marginTop: 10, width: '100%' }} onClick={() => setSelected(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

window.CalendarScreen = CalendarScreen;
