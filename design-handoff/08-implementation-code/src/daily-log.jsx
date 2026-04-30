// DRSP-12 daily log: 11 DSM-5 Criterion A items + suicidal ideation + 3 functional impairment items
// Wave 1: T-01 full DRSP, T-04 persistence, T-05 SI as item 12, T-06 crisis post-save
// Wave 2: T-11 fast-log mode + voice note, T-22 ADHD check-in 4th step, T-26 functional quick-links

// DRSP-21 mood/behavioral/physical items (spec §2.2) + item 12 SI + 3 functional = 24 total
const DRSP_ITEMS = [
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

const DRSP_SI = { key: 'suicidal_ideation', label: 'Thoughts that life isn\'t worth living' };

const FUNCTIONAL_ITEMS = [
  { key: 'fn_work', label: 'Interfered with work or school' },
  { key: 'fn_social', label: 'Interfered with social activities' },
  { key: 'fn_relationships', label: 'Interfered with relationships' },
];

// T-22 — ADHD executive function dimensions
const ADHD_EF = [
  { key: 'focus', label: 'Focus' },
  { key: 'workingMemory', label: 'Working memory' },
  { key: 'taskInitiation', label: 'Task initiation' },
  { key: 'emotionalRegulation', label: 'Emotional regulation' },
  { key: 'timePerception', label: 'Time perception' },
];

// T-11 — fast log uses these top-3 most frequently flagged DRSP items
const FAST_LOG_KEYS = ['irritability', 'concentration', 'overwhelmed'];

const ANCHORS = {
  1: 'Not at all',
  2: 'Minimal',
  3: 'Mild',
  4: 'Moderate',
  5: 'Severe',
  6: 'Extreme',
};

function ScaleRow({ label, value, onSet, max = 6 }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div className="body" style={{ marginBottom: 6, fontSize: 14, fontWeight: 500 }}>{label}</div>
      <div className="scale" style={{ gridTemplateColumns: `repeat(${max}, 1fr)` }}>
        {Array.from({ length: max }, (_, i) => i + 1).map(n => (
          <button key={n} className={`scale-btn ${value === n ? 'active' : ''}`}
            title={ANCHORS[n] || ''} onClick={() => onSet(n)}>{n}</button>
        ))}
      </div>
    </div>
  );
}

function DailyLog() {
  const { useApp, PHASE_NAMES, phaseForDay, Icon } = window.HQ;
  const HQ_CRISIS = window.HQ_CRISIS;
  const { state, setState, goto } = useApp();

  const todayKey = new Date().toISOString().slice(0, 10);
  const existing = (state.entries && state.entries[todayKey]) || {};

  const [feeling, setFeeling] = React.useState(existing.feeling || null);
  const [drsp, setDrsp] = React.useState(existing.drsp || {});
  const [si, setSi] = React.useState(existing.suicidal_ideation || null);
  const [physical, setPhysical] = React.useState(existing.physical || []);
  const [adhdRating, setAdhdRating] = React.useState(existing.adhdRating || null);
  const [sleep, setSleep] = React.useState(existing.sleep || null);
  const [voiceNote, setVoiceNote] = React.useState(existing.voiceNote || null);
  const [recording, setRecording] = React.useState(false);
  const [adhdEF, setAdhdEF] = React.useState(existing.adhdEF || {});
  const [fnImpair, setFnImpair] = React.useState(existing.fnImpair || null); // overall functional impairment 1-5
  const [showAdhdSection, setShowAdhdSection] = React.useState(true);
  const [saved, setSaved] = React.useState(false);
  const [crisisTier, setCrisisTier] = React.useState(null);
  const [savedEntry, setSavedEntry] = React.useState(null); // T-26
  const [fastLog, setFastLog] = React.useState(state.fastLogMode || false); // T-11

  const cycleDay = state.cycleDay;
  const cycleLen = state.cycleLen;
  const phase = phaseForDay(cycleDay, cycleLen);

  const physicalList = ['Bloating', 'Cramps', 'Headache', 'Breast tenderness', 'Fatigue', 'Joint pain', 'Skin changes'];
  // T-38 — sleep labels reframed for severity, not subjective quality
  const sleepList = ['None', 'Mild disruption', 'Moderate', 'Severe', 'Extreme'];
  // T-45 — drop weather emojis; use tonal phase-color circles. Labels: Steady / Slight / Off / Heavy / Hard
  const feelings = [
    { label: 'Steady', tone: 'var(--phase-follicular)', sub: 'Like myself' },
    { label: 'Slight', tone: 'var(--phase-ovulatory)', sub: 'A little off' },
    { label: 'Off', tone: 'var(--phase-luteal)', sub: 'Noticeable' },
    { label: 'Heavy', tone: 'var(--phase-luteal-deep)', sub: 'Hard to manage' },
    { label: 'Hard', tone: 'var(--phase-menstrual)', sub: 'Functionally impaired' },
  ];

  const setSym = (key, n) => setDrsp({ ...drsp, [key]: n });
  const setEF = (key, n) => setAdhdEF({ ...adhdEF, [key]: n });

  // T-11 — voice note (mock 3 sec record)
  const recordVoiceNote = () => {
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      setVoiceNote('voice-note-' + Date.now()); // MOCK placeholder
    }, 3000);
  };

  const isAdhdUser = state.adhd === 'Yes' || state.adhd === 'I think so';

  const save = () => {
    const entry = {
      drsp: { ...drsp, [DRSP_SI.key]: si || 1 },
      feeling,
      physical,
      adhdRating,
      sleep,
      voiceNote, // T-11
      adhdEF: isAdhdUser ? adhdEF : undefined, // T-22
      fnImpair, // T-11 fast log
      suicidal_ideation: si || 1,
      savedAt: Date.now(),
    };

    setSavedEntry(entry); // T-26

    setState(s => {
      const nextEntries = { ...(s.entries || {}), [todayKey]: entry };
      const nextState = { ...s, entries: nextEntries, fastLogMode: fastLog };

      const tier = HQ_CRISIS.assessCrisisTier(nextEntries);
      if (tier === 'tier3') {
        if (HQ_CRISIS.shouldShowTier3(phase)) {
          HQ_CRISIS.markTier3Shown(phase);
          setTimeout(() => setCrisisTier('tier3'), 50);
        } else {
          if (HQ_CRISIS.shouldShowTier2 && HQ_CRISIS.shouldShowTier2(phase)) {
            HQ_CRISIS.markTier2Shown && HQ_CRISIS.markTier2Shown(phase);
            setTimeout(() => setCrisisTier('tier2'), 50);
          }
        }
      } else if (tier === 'tier2') {
        if (!HQ_CRISIS.shouldShowTier2 || HQ_CRISIS.shouldShowTier2(phase)) {
          HQ_CRISIS.markTier2Shown && HQ_CRISIS.markTier2Shown(phase);
          setTimeout(() => setCrisisTier('tier2'), 50);
        }
      }
      return nextState;
    });

    setSaved(true);
    // Don't auto-redirect on save — leave user on confirm screen so quick-links (T-26) are visible
  };

  const closeCrisis = () => {
    setCrisisTier(null);
  };

  // T-26 quick-link handlers
  const openModule = (id) => {
    setSavedEntry({ ...savedEntry, _openModule: id });
  };

  if (saved) {
    const e = savedEntry || {};
    const drspE = e.drsp || {};
    // T-26 quick-link conditions
    const showRel = (drspE.fn_relationships || 0) >= 3;
    const showWork = (drspE.fn_work || 0) >= 3;
    const moodSev = Math.max(drspE.mood_swings || 0, drspE.irritability || 0);
    const showEpisode = moodSev >= 5;

    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: 32 }}>
        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--mint-mist)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Icon.Check width="18" height="18" stroke="var(--eucalyptus-deep)" />
        </div>
        <div className="body-l" style={{ textAlign: 'center', color: 'var(--ink)' }}>Day {cycleDay} recorded.</div>

        {/* T-26 functional impairment quick links */}
        <div style={{ marginTop: 18, display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 360 }}>
          {showRel && <button className="btn-soft" onClick={() => openModule('relImpact')}>Log relationship moment →</button>}
          {showWork && <button className="btn-soft" onClick={() => openModule('workImpact')}>Log work impact →</button>}
          {showEpisode && <button className="btn-soft" onClick={() => openModule('rage')}>Log episode →</button>}
          <button className="btn-ghost" style={{ marginTop: 8 }} onClick={() => goto('home')}>Done</button>
        </div>

        {savedEntry && savedEntry._openModule && (
          <window.ModuleSheet id={savedEntry._openModule} onClose={() => setSavedEntry({ ...savedEntry, _openModule: null })} />
        )}
        {crisisTier && HQ_CRISIS && <HQ_CRISIS.CrisisCard tier={crisisTier} onClose={closeCrisis} />}
      </div>
    );
  }

  // Decide which DRSP items render in the grid
  const drspToRender = fastLog ? DRSP_ITEMS.filter(it => FAST_LOG_KEYS.includes(it.key)) : DRSP_ITEMS;
  // In fast log we still want the SI item available (item 12) — keep it visible for safety
  const showFunctionalGrid = !fastLog;
  // In fast log we render a single overall functional impairment row instead of 3
  const showFnImpairRow = fastLog;

  return (
    <div className="screen" style={{ position: 'relative' }}>
      {/* T-58 — soft leaf decoration on a primary screen */}
      {window.HQ.Leaf && <window.HQ.Leaf size={110} color="var(--mint-mist)" style={{ top: -10, right: -28, opacity: 0.28 }} rotate={-14} />}
      <h1 className="display" style={{ marginBottom: 4 }}>Daily check-in</h1>
      {/* T-85 — when paused, skip cycle-context line */}
      {!state.cyclePaused && (
        <div className="caption" style={{ marginBottom: 16 }}>Day {cycleDay} · {PHASE_NAMES[phase]} phase</div>
      )}

      {/* R7 — F88 Spotting / unexpected bleeding capture (visible when peri/postmenopause/long amenorrhea) */}
      {(() => {
        const lastPeriod = state.lastPeriod ? new Date(state.lastPeriod) : null;
        const daysSince = lastPeriod ? Math.floor((Date.now() - lastPeriod.getTime()) / 86400000) : 0;
        const isPostmeno = state.perimenopausalStatus === 'postmenopause';
        const longAmenorrhea = daysSince >= 35;
        if (!isPostmeno && !longAmenorrhea && !state.irregular) return null;
        const today = new Date().toISOString().slice(0, 10);
        const existingSpot = (state.spottingLog || {})[today];
        const log = (flow) => {
          const postmeno_gap = isPostmeno ? Math.max(daysSince, 365) : (daysSince >= 365 ? daysSince : null);
          setState(s => ({
            ...s,
            spottingLog: { ...(s.spottingLog || {}), [today]: { flow, daysSincePeriod: daysSince, postmenopausalGap: postmeno_gap, dischargedWithDoctor: false, at: Date.now() } },
          }));
        };
        return (
          <div className="card-warm" style={{ padding: 14, marginBottom: 16, borderLeft: '3px solid var(--coral-soft)' }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>F88 · UNEXPECTED BLEEDING TODAY?</div>
            <div className="caption" style={{ fontSize: 12, marginBottom: 10 }}>
              {isPostmeno ? "You're postmenopausal. Any bleeding now is worth logging — we'll surface it in your safety summary." : `${daysSince} days since your last period. Spotting outside your usual cycle is worth noting.`}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {[
                { v: null, l: 'Nothing today' },
                { v: 'spotting', l: 'Spotting' },
                { v: 'light', l: 'Light' },
                { v: 'medium', l: 'Medium' },
                { v: 'heavy', l: 'Heavy' },
              ].map(o => (
                <button key={String(o.v)}
                  className={`chip ${(existingSpot && existingSpot.flow === o.v) ? 'active' : ''}`}
                  onClick={() => log(o.v)}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* T-11 — fast log toggle */}
      <div className="card-warm" style={{ padding: 12, marginBottom: 22, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Fast log mode</div>
          <div className="caption" style={{ fontSize: 12 }}>{fastLog ? '~30s · vibe + 3 items + impairment' : '~90s · full DRSP grid'}</div>
        </div>
        <div className={`switch ${fastLog ? 'on' : ''}`} onClick={() => setFastLog(!fastLog)} />
      </div>

      {/* Vibe check — T-45 mood icons + auto-advance */}
      <div className="h2" style={{ marginBottom: 6 }}>How are you, really?</div>
      <div className="caption" style={{ marginBottom: 14 }}>A vibe check. Just for you — not part of your clinical record.</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
        {feelings.map(f => (
          <button
            key={f.label}
            className={`feel-btn ${feeling === f.label ? 'active' : ''}`}
            style={{
              transition: 'transform 0.12s cubic-bezier(0.34, 1.56, 0.64, 1), border-color 0.2s, background 0.2s',
              transform: feeling === f.label ? 'scale(1.04)' : 'scale(1)',
            }}
            onClick={() => {
              setFeeling(f.label);
              setTimeout(() => {
                const el = document.getElementById('drsp-severity-grid');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }, 200);
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <span style={{
                width: 26, height: 26, borderRadius: '50%',
                background: f.tone, border: '2px solid rgba(255,255,255,0.6)',
                boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                flexShrink: 0,
              }} />
              <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontWeight: 500 }}>{f.label}</span>
                {f.sub && <span style={{ fontSize: 12, color: 'var(--ink-3)', fontWeight: 400 }}>{f.sub}</span>}
              </span>
            </span>
            {feeling === f.label && <Icon.Check width="20" height="20" stroke="var(--eucalyptus)" />}
          </button>
        ))}
      </div>

      {/* Cycle confirm */}
      <div className="card-mint" style={{ marginBottom: 28, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button className="icon-btn" style={{ background: 'rgba(255,255,255,0.6)' }}><Icon.ChevLeft width="16" height="16" /></button>
        <div style={{ textAlign: 'center' }}>
          <div className="data" style={{ fontSize: 16, color: 'var(--eucalyptus-deep)' }}>Day {cycleDay} · {PHASE_NAMES[phase]}</div>
          <div className="caption" style={{ marginTop: 4 }}>Tap to correct</div>
        </div>
        <button className="icon-btn" style={{ background: 'rgba(255,255,255,0.6)' }}><Icon.ChevRight width="16" height="16" /></button>
      </div>

      {/* DRSP grid */}
      <div id="drsp-severity-grid" className="h2" style={{ marginBottom: 4 }}>{fastLog ? 'Top symptoms' : "Today's symptoms"}</div>
      <div className="caption" style={{ marginBottom: 12 }}>
        Daily Record of Severity of Problems · 1 = not at all, 6 = extreme
      </div>
      <div className="card-paper" style={{ padding: 10, marginBottom: 18, fontSize: 11, color: 'var(--ink-2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 4, fontFamily: 'var(--mono)' }}>
          <span><strong>1</strong> Not at all</span>
          <span><strong>2</strong> Minimal</span>
          <span><strong>3</strong> Mild</span>
          <span><strong>4</strong> Moderate</span>
          <span><strong>5</strong> Severe</span>
          <span><strong>6</strong> Extreme</span>
        </div>
      </div>

      {drspToRender.map(it => (
        <ScaleRow key={it.key} label={it.label} value={drsp[it.key]} onSet={n => setSym(it.key, n)} />
      ))}

      {/* DRSP item 12 — SI (always visible) */}
      <div style={{ marginTop: 6, padding: 14, background: 'var(--cream-warm)', borderRadius: 'var(--radius-md)', marginBottom: 18 }}>
        <div className="caption" style={{ marginBottom: 8, fontSize: 11, color: 'var(--ink-2)' }}>
          Item 12 — important to track. There's no judgement here.
        </div>
        <ScaleRow label={DRSP_SI.label} value={si} onSet={setSi} />
      </div>

      {/* Functional impairment */}
      {showFunctionalGrid && (
        <>
          <div className="h2" style={{ marginTop: 8, marginBottom: 6 }}>Did symptoms interfere?</div>
          <div className="caption" style={{ marginBottom: 12 }}>The DRSP needs this for diagnosis.</div>
          {FUNCTIONAL_ITEMS.map(it => (
            <ScaleRow key={it.key} label={it.label} value={drsp[it.key]} onSet={n => setSym(it.key, n)} />
          ))}
        </>
      )}
      {showFnImpairRow && (
        <>
          <div className="h2" style={{ marginTop: 8, marginBottom: 6 }}>Did symptoms interfere today?</div>
          <ScaleRow label="Overall functional impairment" value={fnImpair} onSet={setFnImpair} max={5} />
        </>
      )}

      {/* T-22 — ADHD check-in 4th step (BEFORE save) */}
      {isAdhdUser && !fastLog && (
        <div style={{ marginTop: 18, marginBottom: 28, padding: 16, background: 'var(--mint-pale)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <div className="h2">ADHD check-in (optional)</div>
            <button className="btn-ghost" style={{ fontSize: 12 }} onClick={() => setShowAdhdSection(!showAdhdSection)}>
              {showAdhdSection ? 'Skip this section' : 'Show'}
            </button>
          </div>
          <div className="caption" style={{ marginBottom: 12, fontSize: 12 }}>5 EF dimensions · 1–5 · skip without warning</div>
          {showAdhdSection && ADHD_EF.map(d => (
            <ScaleRow key={d.key} label={d.label} value={adhdEF[d.key]} onSet={n => setEF(d.key, n)} max={5} />
          ))}
        </div>
      )}

      {/* Physical */}
      {!fastLog && (
        <>
          <div className="h2" style={{ marginTop: 18, marginBottom: 12 }}>Physical (tap any)</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 32 }}>
            {physicalList.map(p => (
              <button key={p} className={`chip ${physical.includes(p) ? 'active' : ''}`} onClick={() => setPhysical(physical.includes(p) ? physical.filter(x => x !== p) : [...physical, p])}>{p}</button>
            ))}
          </div>
        </>
      )}

      {/* Med rating + sleep */}
      {isAdhdUser && !fastLog && (
        <div style={{ marginBottom: 32 }}>
          <div className="h2" style={{ marginBottom: 8 }}>How well did your ADHD meds work today?</div>
          <div className="caption" style={{ marginBottom: 12 }}>Estrogen affects dopamine — your meds may feel weaker before your period.</div>
          <div className="scale s5">
            {[1,2,3,4,5].map(n => (
              <button key={n} className={`scale-btn ${adhdRating === n ? 'active' : ''}`} onClick={() => setAdhdRating(n)}>{n}</button>
            ))}
          </div>
        </div>
      )}

      {!fastLog && (
        <>
          <div className="h2" style={{ marginBottom: 12 }}>Last night's sleep</div>
          <div className="scale s5" style={{ marginBottom: 8 }}>
            {sleepList.map((label, i) => (
              <button key={label} className={`scale-btn ${sleep === i + 1 ? 'active' : ''}`} onClick={() => setSleep(i + 1)} style={{ fontSize: 11 }}>{label}</button>
            ))}
          </div>
        </>
      )}

      {/* T-11 — voice note step (optional) */}
      <div className="card-warm" style={{ padding: 14, marginTop: 18, marginBottom: 14, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Quick voice note (optional)</div>
          <div className="caption" style={{ fontSize: 12 }}>{voiceNote ? 'Note saved · ' + voiceNote.slice(-6) : recording ? 'Listening… 3 sec' : 'Tap mic to add'}</div>
        </div>
        <button
          aria-label="Record voice note"
          onClick={recording ? null : recordVoiceNote}
          className={recording ? 'breathe' : ''}
          style={{ width: 44, height: 44, borderRadius: '50%', background: recording ? 'var(--coral)' : 'var(--eucalyptus)', color: '#fff', border: 'none', cursor: 'pointer', flexShrink: 0 }}
        >
          {recording ? '●' : '🎙'}
        </button>
      </div>

      <button className="btn-primary" style={{ marginTop: 24, height: 56 }} onClick={save}>
        <Icon.Sparkle width="18" height="18" /> Save today's entry
      </button>

      {/* T-79 — privacy footer on daily log */}
      <div style={{ marginTop: 18, padding: '10px 0', textAlign: 'center', fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.5 }}>
        🔒 On this device. Encrypted.
        {(si && si >= 4) && (
          <div style={{ marginTop: 4 }}>this entry is not stored beyond 72 hours</div>
        )}
      </div>
    </div>
  );
}

window.DailyLog = DailyLog;
