// Modules — set 4: Endometriosis (F92–F121)
(function () {
  const useM = window.useM || React.useState;
  const { MHeader, Stat, Severity, Spark, EvidenceBar, ToggleRow, MSection } = window.HQ_UI;
  const M = {};

  // ============================================================
  // Shared helpers / constants for endo modules
  // ============================================================

  const todayKey = () => new Date().toISOString().slice(0, 10);
  const dateLabel = (k) => {
    if (!k) return '—';
    try { return new Date(k).toLocaleDateString(); } catch { return k; }
  };
  const range = (n) => Array.from({ length: n }, (_, i) => i);

  // 0–10 NRS picker (large tappable pills) — used across pain modules
  function NRS({ value, onChange, disabled }) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(11, 1fr)', gap: 4 }}>
        {range(11).map(n => (
          <button
            key={n}
            disabled={disabled}
            onClick={() => onChange(n)}
            style={{
              padding: '8px 0',
              borderRadius: 8,
              fontFamily: 'var(--mono)',
              fontSize: 13,
              fontWeight: 600,
              cursor: disabled ? 'default' : 'pointer',
              border: '1px solid var(--border)',
              background: value === n
                ? (n === 0 ? 'var(--mint-pale)' : n <= 3 ? 'var(--severity-mild)' : n <= 6 ? 'var(--severity-mod)' : 'var(--severity-severe)')
                : 'var(--surface)',
              color: value === n ? '#fff' : 'inherit',
            }}
          >{n}</button>
        ))}
      </div>
    );
  }

  // Color-by-severity for body map zones
  const sevColor = (n) => {
    if (n == null || n === 0) return 'var(--mint-mist)';
    if (n <= 3) return 'var(--severity-mild)';
    if (n <= 6) return 'var(--severity-mod)';
    return 'var(--severity-severe)';
  };

  // Cycle-day phase context
  const phaseContext = (state) => {
    if (!state.lastPeriod) return { phase: 'unknown', day: null };
    const start = new Date(state.lastPeriod);
    const today = new Date(todayKey());
    const diff = Math.max(0, Math.floor((today - start) / 86400000));
    const cycleLen = state.cycleLen || 28;
    const day = (diff % cycleLen) + 1;
    const phase = window.HQ?.phaseForDay
      ? window.HQ.phaseForDay(day, cycleLen, { coarse: true })
      : 'unknown';
    return { phase, day };
  };

  // ============================================================
  // F92 — Endometriosis Onboarding
  // ============================================================
  M.endoOnboarding = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const existing = state.endoOnboarding || null;
    const [step, setStep] = useM(existing ? 99 : 0);
    const [draft, setDraft] = useM(existing || {
      activatedAt: new Date().toISOString(),
      diagnosisStatus: null,
      diagnosisDate: null,
      diagnosisType: [],
      surgicalHistory: { hadSurgery: false, type: null, date: null, rASRMStage: null },
      currentTreatment: 'none',
      treatmentType: '',
      comorbidities: [],
      fertilityFocused: false,
      adolescentMode: false,
      cycleSuppressed: false,
      primaryConcerns: [],
      currentTreatments: [],
      painSeverityBaseline: null,
    });
    const update = (patch) => setDraft(d => ({ ...d, ...patch }));
    const updateDeep = (key, patch) => setDraft(d => ({ ...d, [key]: { ...(d[key] || {}), ...patch } }));
    const toggleArr = (key, val) => setDraft(d => {
      const cur = new Set(d[key] || []);
      if (cur.has(val)) cur.delete(val); else cur.add(val);
      return { ...d, [key]: Array.from(cur) };
    });
    const persist = () => {
      const final = { ...draft, activatedAt: draft.activatedAt || new Date().toISOString() };
      if (final.currentTreatment === 'post_excision_suppression') final.cycleSuppressed = true;
      setState(s => ({ ...s, endoOnboarding: final }));
      setStep(99);
    };

    if (step === 99) {
      // Summary review
      return (
        <div>
          <MHeader eyebrow="F92 · ENDOMETRIOSIS" title={<>Module <span style={{ color: 'var(--eucalyptus)' }}>activated.</span></>} sub="Your context — used to tailor the daily log and physician report." />
          <div className="card-mint" style={{ padding: 14, marginBottom: 14 }}>
            <p className="body" style={{ fontSize: 13, marginBottom: 8 }}>
              <strong>Endometriosis causes real, severe pain.</strong> On average, it takes 8 years to diagnose. You are not imagining this. We'll help you document your experience clearly.
            </p>
            <div className="caption" style={{ fontSize: 11 }}>Your data is private by default. Your doctor sees only what you choose to share.</div>
          </div>
          <MSection title="YOUR CONTEXT">
            <div className="card" style={{ padding: 12, marginBottom: 6 }}>
              <div className="caption">Diagnosis status</div>
              <div className="data" style={{ fontSize: 14 }}>{(existing || draft).diagnosisStatus || '—'}</div>
            </div>
            <div className="card" style={{ padding: 12, marginBottom: 6 }}>
              <div className="caption">Current treatment</div>
              <div className="data" style={{ fontSize: 14 }}>{(existing || draft).currentTreatment || '—'}</div>
            </div>
            <div className="card" style={{ padding: 12, marginBottom: 6 }}>
              <div className="caption">Comorbidities</div>
              <div style={{ fontSize: 13 }}>
                {((existing || draft).comorbidities || []).join(', ') || 'None recorded'}
              </div>
            </div>
            <div className="card" style={{ padding: 12, marginBottom: 6 }}>
              <div className="caption">Fertility focus</div>
              <div style={{ fontSize: 13 }}>{(existing || draft).fertilityFocused ? 'Yes' : 'No'}</div>
            </div>
          </MSection>
          <button className="btn-soft" style={{ width: '100%' }} onClick={() => setStep(0)}>Edit my context</button>
        </div>
      );
    }

    if (step === 0) {
      return (
        <div>
          <MHeader eyebrow="F92 · ENDOMETRIOSIS · 1 / 6" title={<>Where are you <span style={{ color: 'var(--eucalyptus)' }}>right now?</span></>} sub="Three branches — pick the one that fits." />
          {[
            { v: 'undiagnosed', t: 'Suspected — no diagnosis yet', d: '"Something is wrong and no one will listen." Symptom documentation as a path to diagnosis.' },
            { v: 'diagnosed', t: 'Diagnosed and tracking', d: 'I have a diagnosis and I want to monitor my condition over time.' },
            { v: 'post_surgical', t: 'Post-surgical / on suppression', d: 'I\'ve had surgery and/or I\'m on suppression therapy.' },
          ].map(opt => (
            <div
              key={opt.v}
              className={draft.diagnosisStatus === opt.v ? 'card-warm' : 'card'}
              style={{ padding: 14, marginBottom: 8, cursor: 'pointer', borderLeft: draft.diagnosisStatus === opt.v ? '3px solid var(--eucalyptus)' : '1px solid var(--border)' }}
              onClick={() => update({ diagnosisStatus: opt.v })}
            >
              <div style={{ fontSize: 14, fontWeight: 600 }}>{opt.t}</div>
              <div className="caption" style={{ fontSize: 12, marginTop: 4 }}>{opt.d}</div>
            </div>
          ))}
          <button className="btn-primary" style={{ width: '100%', marginTop: 8 }} disabled={!draft.diagnosisStatus} onClick={() => setStep(1)}>Continue →</button>
        </div>
      );
    }

    if (step === 1) {
      // Surgical history (optional)
      const sh = draft.surgicalHistory || {};
      return (
        <div>
          <MHeader eyebrow="F92 · ENDOMETRIOSIS · 2 / 6" title={<>Surgical history — <span style={{ color: 'var(--eucalyptus)' }}>optional.</span></>} sub="You can skip this if you've never had surgery, or fill it in later." />
          <ToggleRow label="I've had endometriosis surgery" checked={!!sh.hadSurgery} onChange={v => updateDeep('surgicalHistory', { hadSurgery: v })} sub="Laparoscopy, excision, ablation, etc." />
          {sh.hadSurgery && (
            <div className="card-warm" style={{ padding: 14, marginBottom: 14, marginTop: 8 }}>
              <div className="caption" style={{ marginBottom: 6 }}>Surgery type</div>
              <select value={sh.type || ''} onChange={e => updateDeep('surgicalHistory', { type: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)', marginBottom: 10 }}>
                <option value="">— select —</option>
                <option value="excision">Excision</option>
                <option value="ablation">Ablation</option>
                <option value="both">Both</option>
                <option value="diagnostic">Diagnostic laparoscopy</option>
              </select>
              <div className="caption" style={{ marginBottom: 6 }}>Surgery date</div>
              <input type="date" value={sh.date || ''} onChange={e => updateDeep('surgicalHistory', { date: e.target.value })} style={{ width: '100%', marginBottom: 10 }} />
              <div className="caption" style={{ marginBottom: 6 }}>rASRM stage (if known) — does not predict your pain</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
                {[null, 1, 2, 3, 4].map(n => (
                  <button key={String(n)} onClick={() => updateDeep('surgicalHistory', { rASRMStage: n })}
                    style={{ padding: 8, borderRadius: 8, border: '1px solid var(--border)', background: sh.rASRMStage === n ? 'var(--eucalyptus)' : 'var(--surface)', color: sh.rASRMStage === n ? '#fff' : 'inherit', fontSize: 12, cursor: 'pointer' }}>
                    {n == null ? 'N/A' : `Stage ${n}`}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setStep(0)}>← Back</button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => setStep(2)}>Continue →</button>
          </div>
        </div>
      );
    }

    if (step === 2) {
      const opts = [
        { v: 'none', t: 'No treatment yet' },
        { v: 'hormonal_suppression', t: 'Hormonal suppression (GnRH, progestin, dienogest)' },
        { v: 'post_excision_suppression', t: 'Post-surgical suppression' },
        { v: 'symptom_management', t: 'Symptom management only (NSAIDs, heat, etc.)' },
      ];
      return (
        <div>
          <MHeader eyebrow="F92 · ENDOMETRIOSIS · 3 / 6" title={<>Current <span style={{ color: 'var(--eucalyptus)' }}>treatment.</span></>} sub="We'll track response 6 weeks in and 3 months in." />
          {opts.map(opt => (
            <div key={opt.v}
              className={draft.currentTreatment === opt.v ? 'card-warm' : 'card'}
              style={{ padding: 12, marginBottom: 6, cursor: 'pointer', borderLeft: draft.currentTreatment === opt.v ? '3px solid var(--eucalyptus)' : '1px solid var(--border)' }}
              onClick={() => update({ currentTreatment: opt.v })}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{opt.t}</div>
            </div>
          ))}
          {(draft.currentTreatment === 'hormonal_suppression' || draft.currentTreatment === 'post_excision_suppression') && (
            <div className="card-warm" style={{ padding: 12, marginTop: 8 }}>
              <div className="caption" style={{ marginBottom: 4 }}>Treatment name (free text)</div>
              <input type="text" value={draft.treatmentType || ''} onChange={e => update({ treatmentType: e.target.value })} placeholder="e.g. Visanne 2mg, Lupron 11.25mg" style={{ width: '100%' }} />
            </div>
          )}
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setStep(1)}>← Back</button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => setStep(3)}>Continue →</button>
          </div>
        </div>
      );
    }

    if (step === 3) {
      const COMORBIDS = ['IBS', 'IBD', 'Fibromyalgia', 'Hypothyroidism', 'Hashimoto\'s', 'Adenomyosis', 'Interstitial Cystitis', 'Migraines', 'Anxiety', 'Depression', 'ME/CFS', 'PCOS'];
      return (
        <div>
          <MHeader eyebrow="F92 · ENDOMETRIOSIS · 4 / 6" title={<>Other <span style={{ color: 'var(--eucalyptus)' }}>conditions.</span></>} sub="Multiple conditions often overlap. Pick what applies." />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {COMORBIDS.map(c => {
              const on = (draft.comorbidities || []).includes(c);
              return (
                <button key={c} onClick={() => toggleArr('comorbidities', c)}
                  style={{ padding: '8px 14px', borderRadius: 999, border: '1px solid var(--border)', background: on ? 'var(--eucalyptus)' : 'var(--surface)', color: on ? '#fff' : 'inherit', fontSize: 12, cursor: 'pointer' }}>
                  {c}
                </button>
              );
            })}
          </div>
          <ToggleRow label="Fertility is a current focus" checked={!!draft.fertilityFocused} onChange={v => update({ fertilityFocused: v })} sub="Surfaces AMH lab tracking + fertility-relevant report sections" />
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setStep(2)}>← Back</button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => setStep(4)}>Continue →</button>
          </div>
        </div>
      );
    }

    if (step === 4) {
      const CONCERNS = ['Pain management', 'Diagnosis pathway', 'Fertility', 'Mental health', 'Bowel/bladder symptoms', 'Sex life', 'Work / school impact', 'Sleep'];
      return (
        <div>
          <MHeader eyebrow="F92 · ENDOMETRIOSIS · 5 / 6" title={<>What matters <span style={{ color: 'var(--eucalyptus)' }}>most</span> right now?</>} sub="Your top concerns — we'll prioritise these in your daily log and report." />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
            {CONCERNS.map(c => {
              const on = (draft.primaryConcerns || []).includes(c);
              return (
                <button key={c} onClick={() => toggleArr('primaryConcerns', c)}
                  style={{ padding: '8px 14px', borderRadius: 999, border: '1px solid var(--border)', background: on ? 'var(--coral)' : 'var(--surface)', color: on ? '#fff' : 'inherit', fontSize: 12, cursor: 'pointer' }}>
                  {c}
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setStep(3)}>← Back</button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={() => setStep(5)}>Continue →</button>
          </div>
        </div>
      );
    }

    if (step === 5) {
      return (
        <div>
          <MHeader eyebrow="F92 · ENDOMETRIOSIS · 6 / 6" title={<>Today's <span style={{ color: 'var(--eucalyptus)' }}>baseline.</span></>} sub="Your overall pain right now (0–10). We'll measure response from this point." />
          <div className="card-warm" style={{ padding: 14, marginBottom: 14 }}>
            <NRS value={draft.painSeverityBaseline} onChange={n => update({ painSeverityBaseline: n })} />
            <div className="caption" style={{ marginTop: 8, fontSize: 11 }}>0 = no pain · 10 = worst imaginable. ≥30% reduction = clinical responder threshold.</div>
          </div>
          <div className="card-mint" style={{ padding: 12, marginBottom: 12 }}>
            <div className="eyebrow" style={{ marginBottom: 4 }}>WHAT YOU'LL TRACK</div>
            <p className="body" style={{ fontSize: 12 }}>5-D pain · body map · GI · bleeding · fatigue · sleep · PHQ-9 · GAD-7 · EHP-30 · meds · triggers — all in one log.</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setStep(4)}>← Back</button>
            <button className="btn-primary" style={{ flex: 1 }} onClick={persist}>Activate module</button>
          </div>
        </div>
      );
    }

    return null;
  };

  // ============================================================
  // F93 — Daily 5-D Pain NRS Logger
  // ============================================================
  M.endo5DPain = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const tk = todayKey();
    const today = (state.endoDailyLog && state.endoDailyLog[tk]) || {};
    const ctx = phaseContext(state);
    const setField = (key, val) => {
      setState(s => ({
        ...s,
        endoDailyLog: {
          ...(s.endoDailyLog || {}),
          [tk]: {
            ...((s.endoDailyLog || {})[tk] || {}),
            [key]: val,
            cyclePhase: ctx.phase,
            cycleDayNumber: ctx.day,
          },
        },
      }));
    };
    const PAIN_FIELDS = [
      { k: 'dysmenorrhea_nrs', l: 'Period cramps / menstrual pain' },
      { k: 'cpp_nrs', l: 'Pelvic pain not during period (CPP)' },
      { k: 'dyschezia_nrs', l: 'Bowel pain / pain going to the toilet' },
      { k: 'dysuria_nrs', l: 'Bladder pain / pain during urination' },
      { k: 'dyspareunia_nrs', l: 'Pain during or after sex', sensitive: true },
    ];
    const QUALITIES = ['sharp', 'burning', 'dull pressure', 'stabbing', 'electric / nerve-like', 'cramping', 'fullness / heaviness'];
    const INTERFERENCE = [
      { k: 'interference_work', l: 'Work / study' },
      { k: 'interference_relationships', l: 'Relationships' },
      { k: 'interference_sleep', l: 'Sleep' },
      { k: 'interference_mood', l: 'Mood' },
    ];
    const noPainToday = () => {
      PAIN_FIELDS.forEach(f => { if (f.k !== 'dyspareunia_nrs') setField(f.k, 0); });
    };
    const qualities = today.pain_quality || [];
    const toggleQuality = (q) => {
      const next = qualities.includes(q) ? qualities.filter(x => x !== q) : [...qualities, q];
      setField('pain_quality', next);
    };
    return (
      <div>
        <MHeader eyebrow="F93 · DAILY 5-D PAIN" title={<>Five domains, <span style={{ color: 'var(--eucalyptus)' }}>one minute.</span></>} sub="0–10 NRS · ≥30% reduction = clinical responder (ASRM 2022)." />
        <div className="card-mint" style={{ padding: 10, marginBottom: 10, display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
          <span>Phase: <strong>{ctx.phase}</strong></span>
          <span>Cycle day: <strong>{ctx.day || '—'}</strong></span>
        </div>
        <button className="btn-soft" style={{ width: '100%', marginBottom: 14 }} onClick={noPainToday}>No pain today — quick complete</button>
        {PAIN_FIELDS.map(f => (
          <div key={f.k} className="card" style={{ padding: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: f.sensitive ? 2 : 8 }}>{f.l}</div>
            {f.sensitive && <div className="caption" style={{ fontSize: 11, marginBottom: 8, color: 'var(--ink-3)' }}>Optional. Never shared without your permission.</div>}
            <NRS value={today[f.k]} onChange={v => setField(f.k, v)} />
          </div>
        ))}
        <MSection title="PAIN QUALITY (TAP ALL THAT APPLY)">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {QUALITIES.map(q => {
              const on = qualities.includes(q);
              return (
                <button key={q} onClick={() => toggleQuality(q)}
                  style={{ padding: '6px 12px', borderRadius: 999, border: '1px solid var(--border)', background: on ? 'var(--coral)' : 'var(--surface)', color: on ? '#fff' : 'inherit', fontSize: 12, cursor: 'pointer' }}>{q}</button>
              );
            })}
          </div>
        </MSection>
        <MSection title="INTERFERENCE WITH DAILY LIFE">
          {INTERFERENCE.map(it => (
            <div key={it.k} className="card" style={{ padding: 12, marginBottom: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{it.l}</div>
              <Severity value={today[it.k] || 0} onChange={v => setField(it.k, v)} max={5} />
            </div>
          ))}
        </MSection>
        <ToggleRow label="Took NSAID / pain relief today" checked={!!today.nsaid_taken} onChange={v => setField('nsaid_taken', v)} sub="Used by NSAID overuse detection (F118)" />
        <div className="card-warm" style={{ padding: 12, marginTop: 12 }}>
          <div className="caption" style={{ marginBottom: 4 }}>Note (optional)</div>
          <textarea value={today.note || ''} onChange={e => setField('note', e.target.value)} rows={3} style={{ width: '100%', borderRadius: 8, border: '1px solid var(--border)', padding: 8, fontSize: 13, fontFamily: 'inherit' }} placeholder="What did this pain change today?" />
        </div>
      </div>
    );
  };

  // ============================================================
  // F94 — Pain Location Body Map
  // ============================================================
  M.endoBodyMap = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const tk = todayKey();
    const stored = (state.endoPainLocation && state.endoPainLocation[tk]) || { zones: {}, view: 'front' };
    const [view, setView] = useM(stored.view || 'front');
    const [activeZone, setActiveZone] = useM(null);
    const zones = stored.zones || {};

    // 12 zones — front + back coverage. x/y are 0-200 / 0-400 viewBox coords.
    const ZONES_FRONT = [
      { id: 'lower_central_ant', label: 'Lower central abdomen', x: 100, y: 200, r: 22 },
      { id: 'lower_left_ant', label: 'Lower left abdomen', x: 75, y: 210, r: 18 },
      { id: 'lower_right_ant', label: 'Lower right abdomen', x: 125, y: 210, r: 18 },
      { id: 'bladder_suprapubic', label: 'Bladder / suprapubic', x: 100, y: 240, r: 16 },
      { id: 'inguinal_left', label: 'Inguinal / groin (L)', x: 78, y: 250, r: 14 },
      { id: 'inguinal_right', label: 'Inguinal / groin (R)', x: 122, y: 250, r: 14 },
      { id: 'right_shoulder', label: 'Right shoulder / diaphragm', x: 132, y: 110, r: 18 },
      { id: 'left_leg_upper', label: 'Left leg (upper)', x: 82, y: 295, r: 14 },
      { id: 'right_leg_upper', label: 'Right leg (upper)', x: 118, y: 295, r: 14 },
    ];
    const ZONES_BACK = [
      { id: 'lower_back_lumbar', label: 'Lower back / lumbar', x: 100, y: 215, r: 22 },
      { id: 'sacrum_coccyx', label: 'Sacrum / coccyx', x: 100, y: 250, r: 16 },
      { id: 'gluteal_left', label: 'Left buttock', x: 80, y: 270, r: 16 },
      { id: 'gluteal_right', label: 'Right buttock', x: 120, y: 270, r: 16 },
      { id: 'flank_left', label: 'Left flank (kidney area)', x: 70, y: 180, r: 16 },
      { id: 'flank_right', label: 'Right flank (kidney area)', x: 130, y: 180, r: 16 },
    ];
    const zoneList = view === 'front' ? ZONES_FRONT : ZONES_BACK;

    const setZone = (id, patch) => {
      setState(s => {
        const current = (s.endoPainLocation && s.endoPainLocation[tk]) || { zones: {}, view };
        const cur = current.zones || {};
        const nextZone = { ...(cur[id] || { nrs: 0, qualities: [], timing: phaseContext(s).phase === 'menstrual' ? 'period' : 'non_period' }), ...patch };
        return {
          ...s,
          endoPainLocation: {
            ...(s.endoPainLocation || {}),
            [tk]: { ...current, view, zones: { ...cur, [id]: nextZone } },
          },
        };
      });
    };

    const active = activeZone ? (zones[activeZone] || { nrs: 0, qualities: [], timing: 'period' }) : null;
    const QUALITIES = ['sharp', 'burning', 'dull', 'stabbing', 'cramping'];

    return (
      <div>
        <MHeader eyebrow="F94 · BODY MAP" title={<>Where does it <span style={{ color: 'var(--eucalyptus)' }}>hurt</span> today?</>} sub="Tap a zone to set intensity and quality." />
        <div className="card" style={{ padding: 6, marginBottom: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
          {['front', 'back'].map(v => (
            <button key={v} onClick={() => setView(v)} style={{ padding: 8, borderRadius: 8, border: '1px solid var(--border)', background: view === v ? 'var(--eucalyptus)' : 'var(--surface)', color: view === v ? '#fff' : 'inherit', cursor: 'pointer', fontSize: 13, textTransform: 'capitalize' }}>{v}</button>
          ))}
        </div>
        <div className="card-warm" style={{ padding: 14, marginBottom: 12 }}>
          <svg viewBox="0 0 200 400" style={{ width: '100%', height: 320 }}>
            {/* Body silhouette outline */}
            <ellipse cx="100" cy="60" rx="22" ry="26" fill="var(--mint-mist)" stroke="var(--border-strong)" strokeWidth="1" />
            <path d="M 78 90 Q 100 84 122 90 L 138 130 L 145 200 L 138 270 L 130 320 L 122 380 L 110 380 L 105 320 L 100 280 L 95 320 L 90 380 L 78 380 L 70 320 L 62 270 L 55 200 L 62 130 Z" fill="var(--paper)" stroke="var(--border-strong)" strokeWidth="1" />
            {/* Zones — R7 polish: invisible +12pt hit-test halo (P0-8), aria-labels for screen readers */}
            {zoneList.map(z => {
              const data = zones[z.id];
              const sev = data?.nrs || 0;
              const label = `${z.label}${sev > 0 ? `, intensity ${sev} of 10` : ', not yet logged'}`;
              return (
                <g key={z.id} onClick={() => setActiveZone(z.id)} style={{ cursor: 'pointer' }}
                  role="button"
                  tabIndex={0}
                  aria-label={label}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveZone(z.id); } }}>
                  {/* Invisible hit-test halo — 12pt larger than visible zone for finger-friendly tapping */}
                  <circle className="bodymap-zone-hitbox" cx={z.x} cy={z.y} r={z.r + 12} />
                  <circle cx={z.x} cy={z.y} r={z.r} fill={sevColor(sev)} fillOpacity="0.85" stroke={activeZone === z.id ? 'var(--eucalyptus-deep)' : 'var(--border-strong)'} strokeWidth={activeZone === z.id ? 2.5 : 1} style={{ pointerEvents: 'none' }} />
                  {sev > 0 && <text x={z.x} y={z.y + 4} textAnchor="middle" fontSize="11" fill="#fff" style={{ pointerEvents: 'none', fontFamily: 'var(--mono)', fontWeight: 600 }}>{sev}</text>}
                </g>
              );
            })}
          </svg>
        </div>
        {activeZone ? (
          <div className="card-warm" style={{ padding: 14 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>{zoneList.find(z => z.id === activeZone)?.label}</div>
            <div className="caption" style={{ marginBottom: 6 }}>Intensity (0–10)</div>
            <NRS value={active.nrs} onChange={n => setZone(activeZone, { nrs: n })} />
            <div className="caption" style={{ marginTop: 12, marginBottom: 6 }}>Quality</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {QUALITIES.map(q => {
                const on = (active.qualities || []).includes(q);
                return (
                  <button key={q} onClick={() => {
                    const cur = active.qualities || [];
                    const next = on ? cur.filter(x => x !== q) : [...cur, q];
                    setZone(activeZone, { qualities: next });
                  }}
                    style={{ padding: '6px 12px', borderRadius: 999, border: '1px solid var(--border)', background: on ? 'var(--coral)' : 'var(--surface)', color: on ? '#fff' : 'inherit', fontSize: 12, cursor: 'pointer' }}>{q}</button>
                );
              })}
            </div>
            <div className="caption" style={{ marginBottom: 6 }}>Timing</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
              {[{ v: 'period', l: 'During period' }, { v: 'non_period', l: 'Between periods' }].map(t => (
                <button key={t.v} onClick={() => setZone(activeZone, { timing: t.v })}
                  style={{ padding: 8, borderRadius: 8, border: '1px solid var(--border)', background: active.timing === t.v ? 'var(--eucalyptus)' : 'var(--surface)', color: active.timing === t.v ? '#fff' : 'inherit', fontSize: 12, cursor: 'pointer' }}>{t.l}</button>
              ))}
            </div>
            <button className="btn-ghost" style={{ width: '100%', marginTop: 10 }} onClick={() => setActiveZone(null)}>Done</button>
          </div>
        ) : (
          <div className="caption" style={{ fontSize: 12, padding: 12, textAlign: 'center' }}>Tap a circle on the body to set intensity, quality, and timing.</div>
        )}
      </div>
    );
  };

  // ============================================================
  // F95 — GI / Bowel Symptom Daily Log
  // ============================================================
  M.endoBowel = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const tk = todayKey();
    const today = (state.endoBowelLog && state.endoBowelLog[tk]) || {};
    const setField = (k, v) => setState(s => ({
      ...s,
      endoBowelLog: { ...(s.endoBowelLog || {}), [tk]: { ...((s.endoBowelLog || {})[tk] || {}), [k]: v } },
    }));
    const BSS = [
      { v: 1, l: 'Hard lumps' },
      { v: 2, l: 'Lumpy sausage' },
      { v: 3, l: 'Cracked sausage' },
      { v: 4, l: 'Smooth sausage' },
      { v: 5, l: 'Soft blobs' },
      { v: 6, l: 'Mushy' },
      { v: 7, l: 'Liquid' },
    ];
    const ctx = phaseContext(state);
    return (
      <div>
        <MHeader eyebrow="F95 · GI / BOWEL" title={<>What your <span style={{ color: 'var(--eucalyptus)' }}>gut</span> is doing today.</>} sub="Granular enough to distinguish endo bowel involvement from coincidental IBS." />
        <MSection title="BRISTOL STOOL SCALE">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {BSS.map(b => (
              <button key={b.v} onClick={() => setField('bristol_stool_scale', b.v)}
                style={{ padding: '8px 4px', borderRadius: 6, border: '1px solid var(--border)', background: today.bristol_stool_scale === b.v ? 'var(--eucalyptus)' : 'var(--surface)', color: today.bristol_stool_scale === b.v ? '#fff' : 'inherit', fontSize: 11, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <span className="data" style={{ fontSize: 13, fontWeight: 600 }}>{b.v}</span>
                <span style={{ fontSize: 9, lineHeight: 1.1 }}>{b.l}</span>
              </button>
            ))}
          </div>
        </MSection>
        <MSection title="BOWEL FREQUENCY TODAY">
          <div className="card" style={{ padding: 12 }}>
            <div className="caption" style={{ marginBottom: 6 }}>Number of bowel movements</div>
            <div style={{ display: 'flex', gap: 6 }}>
              {[0, 1, 2, 3, 4, '5+'].map(n => (
                <button key={n} onClick={() => setField('frequency_today', n)}
                  style={{ flex: 1, padding: 8, borderRadius: 6, border: '1px solid var(--border)', background: today.frequency_today === n ? 'var(--eucalyptus)' : 'var(--surface)', color: today.frequency_today === n ? '#fff' : 'inherit', fontSize: 12, cursor: 'pointer' }}>{n}</button>
              ))}
            </div>
          </div>
        </MSection>
        <MSection title="SYMPTOMS">
          <ToggleRow label="Rectal bleeding" checked={!!today.rectal_bleeding} onChange={v => { setField('rectal_bleeding', v); if (v && ctx.phase === 'menstrual') setField('rectal_bleeding_cyclical', true); }} sub="Cyclical rectal bleeding is a bowel-DIE red flag" />
          {today.rectal_bleeding && (
            <ToggleRow label="Happens during my period (cyclical)" checked={!!today.rectal_bleeding_cyclical} onChange={v => setField('rectal_bleeding_cyclical', v)} sub="2+ cycles → URGENT escalation" />
          )}
          <ToggleRow label="Tenesmus (feeling of incomplete evacuation)" checked={!!today.tenesmus} onChange={v => setField('tenesmus', v)} />
          <ToggleRow label="Painful defecation (dyschezia)" checked={!!today.painful_defecation} onChange={v => setField('painful_defecation', v)} />
        </MSection>
        <MSection title="BLOATING / GI PAIN (0–10)">
          <div className="card" style={{ padding: 12, marginBottom: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Bloating severity</div>
            <NRS value={today.bloating_severity || 0} onChange={v => setField('bloating_severity', v)} />
          </div>
          <div className="card" style={{ padding: 12, marginBottom: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>GI pain severity</div>
            <NRS value={today.gi_pain_severity || 0} onChange={v => setField('gi_pain_severity', v)} />
          </div>
        </MSection>
      </div>
    );
  };

  // ============================================================
  // F96 — PBAC (Pictorial Blood Assessment Chart)
  // ============================================================
  M.endoPbac = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const tk = todayKey();
    const today = (state.endoPbacLog && state.endoPbacLog[tk]) || {
      pads_used: { light: 0, regular: 0, super: 0, super_plus: 0 },
      tampons_used: { light: 0, regular: 0, super: 0, super_plus: 0 },
      clots_passed: { small: 0, large: 0 },
      flooding_episode: false,
    };
    // PBAC weights: light=1, regular=5, super=10, super_plus=20; clot small=1, large=5; flooding=+5
    const WEIGHTS = { light: 1, regular: 5, super: 10, super_plus: 20, small: 1, large: 5 };
    const pads = today.pads_used || {};
    const tampons = today.tampons_used || {};
    const clots = today.clots_passed || {};
    const dailyScore =
      (pads.light || 0) * WEIGHTS.light +
      (pads.regular || 0) * WEIGHTS.regular +
      (pads.super || 0) * WEIGHTS.super +
      (pads.super_plus || 0) * WEIGHTS.super_plus +
      (tampons.light || 0) * WEIGHTS.light +
      (tampons.regular || 0) * WEIGHTS.regular +
      (tampons.super || 0) * WEIGHTS.super +
      (tampons.super_plus || 0) * WEIGHTS.super_plus +
      (clots.small || 0) * WEIGHTS.small +
      (clots.large || 0) * WEIGHTS.large +
      (today.flooding_episode ? 5 : 0);

    // Cycle total = sum across the most recent 8 days
    const allLogs = state.endoPbacLog || {};
    const recentKeys = Object.keys(allLogs).sort().slice(-8);
    const cycleTotal = recentKeys.reduce((sum, k) => sum + (allLogs[k]?.daily_score || 0), 0) + dailyScore - (allLogs[tk]?.daily_score || 0);

    const setProductCount = (group, key, delta) => {
      setState(s => {
        const cur = (s.endoPbacLog && s.endoPbacLog[tk]) || today;
        const slot = { ...(cur[group] || {}) };
        slot[key] = Math.max(0, (slot[key] || 0) + delta);
        const next = { ...cur, [group]: slot };
        // Recompute daily_score
        const p = next.pads_used || {}, t = next.tampons_used || {}, c = next.clots_passed || {};
        next.daily_score =
          (p.light || 0) + (p.regular || 0) * 5 + (p.super || 0) * 10 + (p.super_plus || 0) * 20 +
          (t.light || 0) + (t.regular || 0) * 5 + (t.super || 0) * 10 + (t.super_plus || 0) * 20 +
          (c.small || 0) + (c.large || 0) * 5 +
          (next.flooding_episode ? 5 : 0);
        return { ...s, endoPbacLog: { ...(s.endoPbacLog || {}), [tk]: next } };
      });
    };
    const setFlooding = (v) => {
      setState(s => {
        const cur = (s.endoPbacLog && s.endoPbacLog[tk]) || today;
        const next = { ...cur, flooding_episode: v };
        const p = next.pads_used || {}, t = next.tampons_used || {}, c = next.clots_passed || {};
        next.daily_score =
          (p.light || 0) + (p.regular || 0) * 5 + (p.super || 0) * 10 + (p.super_plus || 0) * 20 +
          (t.light || 0) + (t.regular || 0) * 5 + (t.super || 0) * 10 + (t.super_plus || 0) * 20 +
          (c.small || 0) + (c.large || 0) * 5 +
          (v ? 5 : 0);
        return { ...s, endoPbacLog: { ...(s.endoPbacLog || {}), [tk]: next } };
      });
    };

    const hmbFlag = cycleTotal > 100;

    const Counter = ({ group, k, label }) => {
      const v = (today[group] && today[group][k]) || 0;
      return (
        <div className="card" style={{ padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{label}</div>
            <div className="caption" style={{ fontSize: 10 }}>weight {WEIGHTS[k]} pts</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button className="btn-ghost" style={{ width: 32, height: 32, padding: 0, fontSize: 18 }} onClick={() => setProductCount(group, k, -1)}>−</button>
            <span className="data" style={{ fontSize: 16, minWidth: 24, textAlign: 'center' }}>{v}</span>
            <button className="btn-soft" style={{ width: 32, height: 32, padding: 0, fontSize: 18 }} onClick={() => setProductCount(group, k, 1)}>+</button>
          </div>
        </div>
      );
    };

    return (
      <div>
        <MHeader eyebrow="F96 · PBAC · BLEEDING / HMB" title={<>How <span style={{ color: 'var(--eucalyptus)' }}>heavy</span> today?</>} sub="Pictorial Blood Assessment Chart (Higham 1990). Score >100 = HMB threshold." />
        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <Stat label="Daily score" value={String(dailyScore)} sub="weighted pts" />
          <Stat label="Cycle total" value={String(cycleTotal)} sub="last 8 days" color={hmbFlag ? 'var(--severity-severe)' : 'var(--ink)'} />
        </div>
        {hmbFlag && (
          <div className="card-warm" style={{ padding: 12, marginBottom: 12, borderLeft: '3px solid var(--severity-severe)' }}>
            <div className="eyebrow" style={{ color: 'var(--severity-severe)', marginBottom: 4 }}>HMB FLAG</div>
            <p className="body" style={{ fontSize: 12 }}>Cycle PBAC > 100 — this matches the clinical threshold for heavy menstrual bleeding. HMB is treatable and worth bringing to your provider.</p>
          </div>
        )}
        <MSection title="PADS USED">
          <Counter group="pads_used" k="light" label="Light" />
          <Counter group="pads_used" k="regular" label="Regular" />
          <Counter group="pads_used" k="super" label="Super" />
          <Counter group="pads_used" k="super_plus" label="Super plus / overnight" />
        </MSection>
        <MSection title="TAMPONS USED">
          <Counter group="tampons_used" k="light" label="Light" />
          <Counter group="tampons_used" k="regular" label="Regular" />
          <Counter group="tampons_used" k="super" label="Super" />
          <Counter group="tampons_used" k="super_plus" label="Super plus" />
        </MSection>
        <MSection title="CLOTS">
          <Counter group="clots_passed" k="small" label="Small (< 50p coin)" />
          <Counter group="clots_passed" k="large" label="Large (≥ 50p coin)" />
        </MSection>
        <ToggleRow label="Flooding episode (bleed through clothes/bed)" checked={!!today.flooding_episode} onChange={setFlooding} sub="+5 pts" />
      </div>
    );
  };

  // ============================================================
  // F97 — Fatigue + Brain Fog
  // ============================================================
  M.endoFatigue = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const tk = todayKey();
    const today = (state.endoDailyLog && state.endoDailyLog[tk]) || {};
    const setField = (k, v) => setState(s => ({
      ...s,
      endoDailyLog: { ...(s.endoDailyLog || {}), [tk]: { ...((s.endoDailyLog || {})[tk] || {}), [k]: v } },
    }));
    const fatigueStreak = (() => {
      const all = state.endoDailyLog || {};
      const keys = Object.keys(all).sort().reverse();
      let streak = 0;
      for (const k of keys) {
        if ((all[k]?.fatigue_nrs || 0) >= 7) streak += 1;
        else break;
      }
      return streak;
    })();
    return (
      <div>
        <MHeader eyebrow="F97 · FATIGUE + BRAIN FOG" title={<>Systemic <span style={{ color: 'var(--eucalyptus)' }}>burden.</span></>} sub="80% of endo patients report cognitive impairment. Fatigue is near-universal." />
        <div className="card" style={{ padding: 12, marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Physical fatigue (0 = none, 10 = exhausted)</div>
          <NRS value={today.fatigue_nrs} onChange={v => setField('fatigue_nrs', v)} />
        </div>
        <div className="card" style={{ padding: 12, marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Brain fog (0 = clear, 10 = can't think straight)</div>
          <NRS value={today.brain_fog_nrs} onChange={v => setField('brain_fog_nrs', v)} />
        </div>
        <div className="card" style={{ padding: 12, marginBottom: 8 }}>
          <div className="caption" style={{ marginBottom: 6 }}>Productivity impact today</div>
          <select value={today.productivity_impact || ''} onChange={e => setField('productivity_impact', e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}>
            <option value="">— select —</option>
            <option value="none">No impact</option>
            <option value="mild">Mild — slowed me down</option>
            <option value="moderate">Moderate — some tasks dropped</option>
            <option value="severe">Severe — couldn't function</option>
          </select>
        </div>
        <ToggleRow label="Prevented something I wanted to do" checked={!!today.activity_impacted} onChange={v => setField('activity_impacted', v)} sub="Optional context for physician report" />
        {fatigueStreak >= 5 && (
          <div className="card-warm" style={{ padding: 12, marginTop: 12, borderLeft: '3px solid var(--coral)' }}>
            <div className="eyebrow" style={{ marginBottom: 4 }}>{fatigueStreak} DAYS OF SEVERE FATIGUE</div>
            <p className="body" style={{ fontSize: 12 }}>Prolonged fatigue can be part of endometriosis and may warrant discussion with your provider about fatigue management.</p>
          </div>
        )}
      </div>
    );
  };

  // ============================================================
  // F98 — Sleep
  // ============================================================
  M.endoSleep = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const tk = todayKey();
    const today = (state.endoDailyLog && state.endoDailyLog[tk]) || {};
    const setField = (k, v) => setState(s => ({
      ...s,
      endoDailyLog: { ...(s.endoDailyLog || {}), [tk]: { ...((s.endoDailyLog || {})[tk] || {}), [k]: v } },
    }));
    return (
      <div>
        <MHeader eyebrow="F98 · SLEEP" title={<>Last <span style={{ color: 'var(--eucalyptus)' }}>night.</span></>} sub="70.8% of endo patients report sleep disturbance — bidirectional with pain." />
        <div className="card" style={{ padding: 12, marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Sleep quality (0 = didn't sleep, 10 = perfect)</div>
          <NRS value={today.sleep_quality_nrs} onChange={v => setField('sleep_quality_nrs', v)} />
        </div>
        <div className="card" style={{ padding: 12, marginBottom: 8 }}>
          <div className="caption" style={{ marginBottom: 6 }}>Hours slept (optional)</div>
          <input type="number" step="0.5" min="0" max="24" value={today.hours_slept || ''} onChange={e => setField('hours_slept', e.target.value ? +e.target.value : null)} style={{ width: '100%' }} placeholder="e.g. 7.5" />
        </div>
        <ToggleRow label="Pain woke me up" checked={!!today.pain_woke_me} onChange={v => setField('pain_woke_me', v)} sub="Flags night-pain in physician report" />
        {today.pain_woke_me && (
          <div className="card" style={{ padding: 12, marginBottom: 8, marginTop: 6 }}>
            <div className="caption" style={{ marginBottom: 6 }}>Which pain type?</div>
            <select value={today.night_pain_type || ''} onChange={e => setField('night_pain_type', e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}>
              <option value="">— select —</option>
              <option value="dysmenorrhea">Period cramps</option>
              <option value="cpp">Pelvic pain</option>
              <option value="dyschezia">Bowel pain</option>
              <option value="dysuria">Bladder pain</option>
              <option value="back">Back pain</option>
              <option value="other">Other</option>
            </select>
          </div>
        )}
        <ToggleRow label="Night sweats" checked={!!today.night_sweats_endo} onChange={v => setField('night_sweats_endo', v)} sub="Common with hormonal suppression therapy" />
      </div>
    );
  };

  // ============================================================
  // F99 — PHQ-9 (cross-condition: writes to endo + adhd logs)
  // ============================================================
  M.phq9 = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const PHQ9_ITEMS = [
      'Little interest or pleasure in doing things',
      'Feeling down, depressed, or hopeless',
      'Trouble falling or staying asleep, or sleeping too much',
      'Feeling tired or having little energy',
      'Poor appetite or overeating',
      'Feeling bad about yourself — or that you are a failure',
      'Trouble concentrating on things',
      'Moving or speaking so slowly that others noticed — or the opposite, fidgety',
      'Thoughts that you would be better off dead, or of hurting yourself in some way',
    ];
    const ANCHORS = ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'];
    const [items, setItems] = useM(Array(9).fill(null));
    const [showCrisis, setShowCrisis] = useM(false);
    const total = items.reduce((a, b) => a + (b ?? 0), 0);
    const completed = items.every(v => v !== null);
    const item9 = items[8] ?? 0;
    const severity = total <= 4 ? 'minimal' : total <= 9 ? 'mild' : total <= 14 ? 'moderate' : total <= 19 ? 'moderately_severe' : 'severe';
    const crisisGated = item9 >= 1;

    const submit = () => {
      if (!completed) return;
      const tk = todayKey();
      const entry = {
        items, total, severity,
        item9_si: item9,
        crisis_gate_triggered: crisisGated,
        completedAt: new Date().toISOString(),
      };
      setState(s => ({
        ...s,
        endoPhq9Log: { ...(s.endoPhq9Log || {}), [tk]: entry },
        adhdPhq9Log: { ...(s.adhdPhq9Log || {}), [tk]: entry },
      }));
      if (crisisGated) setShowCrisis(true);
    };

    if (showCrisis && window.HQ_CRISIS && window.HQ_CRISIS.CrisisCard) {
      return (
        <div>
          <MHeader eyebrow="F99 · PHQ-9 · CRISIS GATE" title={<>You are <span style={{ color: 'var(--coral)' }}>not alone.</span></>} sub="Item 9 cannot be dismissed without seeing support resources." />
          <window.HQ_CRISIS.CrisisCard tier="tier3" onClose={() => setShowCrisis(false)} verifiedMinor={state.verifiedMinor} />
          <button className="btn-soft" style={{ width: '100%', marginTop: 12 }} onClick={() => setShowCrisis(false)}>I have seen the resources</button>
        </div>
      );
    }

    return (
      <div>
        <MHeader eyebrow="F99 · PHQ-9 · MONTHLY" title={<>Over the last <span style={{ color: 'var(--eucalyptus)' }}>2 weeks…</span></>} sub="Endometriosis carries OR 3.61 for depression. Validated screen, not a diagnosis." />
        {PHQ9_ITEMS.map((q, i) => (
          <div key={i} className="card" style={{ padding: 12, marginBottom: 8, borderLeft: i === 8 ? '3px solid var(--coral)' : 'none' }}>
            <div style={{ fontSize: 13, marginBottom: 8 }}><span className="data" style={{ marginRight: 6 }}>{i + 1}.</span>{q}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
              {ANCHORS.map((a, n) => (
                <button key={n} onClick={() => { const next = [...items]; next[i] = n; setItems(next); }}
                  style={{ padding: '8px 4px', borderRadius: 6, border: '1px solid var(--border)', background: items[i] === n ? 'var(--eucalyptus)' : 'var(--surface)', color: items[i] === n ? '#fff' : 'inherit', fontSize: 10, cursor: 'pointer', lineHeight: 1.2 }}>
                  <div className="data" style={{ fontSize: 13, fontWeight: 600 }}>{n}</div>
                  <div style={{ fontSize: 9, marginTop: 2 }}>{a}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
        {completed && (
          <div className="card-warm" style={{ padding: 14, marginTop: 12 }}>
            <div className="eyebrow" style={{ marginBottom: 4 }}>SCORE</div>
            <div className="data" style={{ fontSize: 22, fontWeight: 600, color: severity === 'severe' || severity === 'moderately_severe' ? 'var(--severity-severe)' : 'var(--ink)' }}>{total} / 27</div>
            <div className="caption" style={{ fontSize: 12, marginTop: 4, textTransform: 'capitalize' }}>{severity.replace('_', ' ')}</div>
          </div>
        )}
        <button className="btn-primary" style={{ width: '100%', marginTop: 12 }} disabled={!completed} onClick={submit}>Save PHQ-9</button>
      </div>
    );
  };

  // ============================================================
  // F100 — GAD-7 (cross-condition)
  // ============================================================
  M.gad7 = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const GAD7_ITEMS = [
      'Feeling nervous, anxious, or on edge',
      'Not being able to stop or control worrying',
      'Worrying too much about different things',
      'Trouble relaxing',
      'Being so restless that it is hard to sit still',
      'Becoming easily annoyed or irritable',
      'Feeling afraid as if something awful might happen',
    ];
    const ANCHORS = ['Not at all', 'Several days', 'More than half the days', 'Nearly every day'];
    const [items, setItems] = useM(Array(7).fill(null));
    const total = items.reduce((a, b) => a + (b ?? 0), 0);
    const completed = items.every(v => v !== null);
    const severity = total <= 4 ? 'minimal' : total <= 9 ? 'mild' : total <= 14 ? 'moderate' : 'severe';
    const clinicalThreshold = total >= 10;

    const submit = () => {
      if (!completed) return;
      const tk = todayKey();
      const entry = { items, total, severity, clinical_threshold_met: clinicalThreshold, completedAt: new Date().toISOString() };
      setState(s => ({
        ...s,
        endoGad7Log: { ...(s.endoGad7Log || {}), [tk]: entry },
        adhdGad7Log: { ...(s.adhdGad7Log || {}), [tk]: entry },
      }));
    };
    return (
      <div>
        <MHeader eyebrow="F100 · GAD-7 · BI-WEEKLY" title={<>Over the last <span style={{ color: 'var(--eucalyptus)' }}>2 weeks…</span></>} sub="Endometriosis carries OR 2.61 for anxiety disorders. Spitzer 2006." />
        {GAD7_ITEMS.map((q, i) => (
          <div key={i} className="card" style={{ padding: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 13, marginBottom: 8 }}><span className="data" style={{ marginRight: 6 }}>{i + 1}.</span>{q}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
              {ANCHORS.map((a, n) => (
                <button key={n} onClick={() => { const next = [...items]; next[i] = n; setItems(next); }}
                  style={{ padding: '8px 4px', borderRadius: 6, border: '1px solid var(--border)', background: items[i] === n ? 'var(--eucalyptus)' : 'var(--surface)', color: items[i] === n ? '#fff' : 'inherit', fontSize: 10, cursor: 'pointer', lineHeight: 1.2 }}>
                  <div className="data" style={{ fontSize: 13, fontWeight: 600 }}>{n}</div>
                  <div style={{ fontSize: 9, marginTop: 2 }}>{a}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
        {completed && (
          <div className="card-warm" style={{ padding: 14, marginTop: 12 }}>
            <div className="eyebrow" style={{ marginBottom: 4 }}>SCORE</div>
            <div className="data" style={{ fontSize: 22, fontWeight: 600, color: severity === 'severe' ? 'var(--severity-severe)' : 'var(--ink)' }}>{total} / 21</div>
            <div className="caption" style={{ fontSize: 12, marginTop: 4, textTransform: 'capitalize' }}>{severity}</div>
          </div>
        )}
        <button className="btn-primary" style={{ width: '100%', marginTop: 12 }} disabled={!completed} onClick={submit}>Save GAD-7</button>
      </div>
    );
  };

  // ============================================================
  // F101 — EHP-30 Monthly QoL
  // ============================================================
  M.ehp30 = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const SUBSCALES = [
      { key: 'pain', label: 'Pain (11 items)', count: 11, items: [
        'How often pain prevented daily activities',
        'How often pain made sleeping difficult',
        'How often pain made work difficult',
        'How often pain made you feel out of control',
        'How often pain made you feel unable to do anything',
        'How often pain made you feel depressed',
        'How often pain made you feel unable to cope',
        'How often pain made you feel anxious',
        'How often pain made you feel frustrated',
        'How often pain interfered with relationships',
        'How often pain was so severe you could not bear it',
      ] },
      { key: 'control_powerlessness', label: 'Control & Powerlessness (6)', count: 6, items: [
        'How often you felt unable to control what was happening',
        'How often you felt your body had let you down',
        'How often you felt out of control',
        'How often you felt you had no say in your treatment',
        'How often you felt dependent on others',
        'How often you felt a burden to others',
      ] },
      { key: 'emotional_wellbeing', label: 'Emotional Well-being (6)', count: 6, items: [
        'How often you felt angry about the condition',
        'How often you felt bitter about the condition',
        'How often you felt frustrated by the condition',
        'How often you felt that others did not understand you',
        'How often you felt alone',
        'How often you felt that life was not worth living',
      ] },
      { key: 'social_support', label: 'Social Support (4 — reverse scored)', count: 4, reverse: true, items: [
        'How often people close to you were supportive',
        'How often your partner was supportive',
        'How often your family was supportive',
        'How often your friends were supportive',
      ] },
      { key: 'self_image', label: 'Self-image (3)', count: 3, items: [
        'How often you felt less of a woman because of the condition',
        'How often you felt unattractive because of the condition',
        'How often you felt your body was not your own',
      ] },
    ];
    const ANCHORS = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];
    const totalItems = SUBSCALES.reduce((a, s) => a + s.count, 0);
    // R7 polish — P0-6 EHP-30 abandonment recovery via useAbandonResume
    const resume = window.HQ && window.HQ.useAbandonResume ? window.HQ.useAbandonResume('ehp30', null) : null;
    const [items, setItems] = useM(() => (resume && resume.saved && resume.saved.items) ? resume.saved.items : Array(totalItems).fill(null));
    const [activeSub, setActiveSub] = useM(() => (resume && resume.saved && typeof resume.saved.activeSub === 'number') ? resume.saved.activeSub : 0);
    const [optionalModules, setOptionalModules] = useM(() => (resume && resume.saved && resume.saved.optionalModules) ? resume.saved.optionalModules : { work: false, sexual: false, children: false, medical: false, treatment: false, infertility: false });
    const [showResumeBanner, setShowResumeBanner] = useM(!!(resume && resume.saved && resume.saved.items && resume.saved.items.some(v => v != null)));
    // Persist mid-form state to sessionStorage so user can leave and come back
    React.useEffect(() => {
      if (resume) resume.persist({ items, activeSub, optionalModules });
    }, [items, activeSub]);

    let cursor = 0;
    const subStart = SUBSCALES.map(s => { const x = cursor; cursor += s.count; return x; });

    const subscaleScore = (idx) => {
      const sub = SUBSCALES[idx];
      const start = subStart[idx];
      const slice = items.slice(start, start + sub.count);
      if (slice.some(v => v == null)) return null;
      const raw = sub.reverse ? slice.reduce((a, b) => a + (4 - b), 0) : slice.reduce((a, b) => a + b, 0);
      return Math.round((raw / (sub.count * 4)) * 100);
    };

    const submit = () => {
      const scores = {};
      SUBSCALES.forEach((s, i) => { scores[s.key] = subscaleScore(i); });
      const tk = todayKey();
      setState(s => ({
        ...s,
        endoEhp30Log: { ...(s.endoEhp30Log || {}), [tk]: { items, subscale_scores: scores, optionalModules, completedAt: new Date().toISOString() } },
      }));
      if (resume) resume.clear();
      setShowResumeBanner(false);
    };

    const sub = SUBSCALES[activeSub];
    const subItems = sub.items;
    const allDone = items.every(v => v !== null);

    const TimeBadge = window.HQ && window.HQ.TimeBadge;
    return (
      <div>
        <MHeader eyebrow="F101 · EHP-30 · MONTHLY" title={<>Quality of life — <span style={{ color: 'var(--eucalyptus)' }}>30 items.</span></>} sub="Jones et al. 2001 (Oxford). Lower score = better QoL. ~6–8 minutes." />
        {TimeBadge && (
          <div style={{ marginBottom: 14 }}>
            <TimeBadge section={activeSub + 1} total={SUBSCALES.length} minutes={2} />
          </div>
        )}
        {/* R7 polish — P0-6 abandonment recovery banner */}
        {showResumeBanner && (
          <div className="card-warm" style={{ padding: 12, marginBottom: 12, borderLeft: '3px solid var(--eucalyptus)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Welcome back.</div>
            <div className="caption" style={{ fontSize: 12, marginBottom: 8 }}>You started this earlier. We saved where you were. Continue or start fresh — both fine.</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button className="btn-soft" style={{ flex: 1, fontSize: 12 }} onClick={() => setShowResumeBanner(false)}>Continue from where I left off</button>
              <button className="btn-ghost" style={{ flex: 1, fontSize: 12 }} onClick={() => { setItems(Array(totalItems).fill(null)); setActiveSub(0); if (resume) resume.clear(); setShowResumeBanner(false); }}>Start fresh</button>
            </div>
          </div>
        )}
        {/* R7 polish — Brain-fog mode auto-defer for the long EHP-30 form */}
        {state.brainFogMode && !showResumeBanner && (
          <div className="card-warm" style={{ padding: 12, marginBottom: 12, background: 'rgba(255,243,210,0.4)' }}>
            <div className="caption" style={{ fontSize: 12 }}>Brain-fog mode is on. EHP-30 is 30 items — about 6–8 minutes. If today is heavy, defer to tomorrow with no penalty. <button className="text-link" style={{ background: 'none', border: 'none', padding: 0, color: 'var(--eucalyptus)', fontSize: 12, cursor: 'pointer' }} onClick={() => { if (resume) resume.persist({ items, activeSub, optionalModules }); window.history.back(); }}>Save and defer</button></div>
          </div>
        )}
        <div className="card" style={{ padding: 8, marginBottom: 12, display: 'grid', gridTemplateColumns: `repeat(${SUBSCALES.length}, 1fr)`, gap: 4 }}>
          {SUBSCALES.map((s, i) => {
            const score = subscaleScore(i);
            return (
              <button key={s.key} onClick={() => setActiveSub(i)}
                style={{ padding: 6, borderRadius: 6, border: '1px solid var(--border)', background: activeSub === i ? 'var(--eucalyptus)' : 'var(--surface)', color: activeSub === i ? '#fff' : 'inherit', cursor: 'pointer', fontSize: 10, lineHeight: 1.2 }}>
                <div style={{ fontWeight: 600 }}>{s.key.split('_')[0]}</div>
                <div className="data" style={{ fontSize: 11 }}>{score == null ? '—' : `${score}/100`}</div>
              </button>
            );
          })}
        </div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>{sub.label.toUpperCase()}</div>
        {subItems.map((q, i) => {
          const idx = subStart[activeSub] + i;
          return (
            <div key={i} className="card" style={{ padding: 12, marginBottom: 6 }}>
              <div style={{ fontSize: 12, marginBottom: 8 }}>{q}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
                {ANCHORS.map((a, n) => (
                  <button key={n} onClick={() => { const next = [...items]; next[idx] = n; setItems(next); }}
                    style={{ padding: '6px 2px', borderRadius: 6, border: '1px solid var(--border)', background: items[idx] === n ? 'var(--eucalyptus)' : 'var(--surface)', color: items[idx] === n ? '#fff' : 'inherit', fontSize: 9, cursor: 'pointer', lineHeight: 1.2 }}>
                    <div className="data" style={{ fontSize: 11, fontWeight: 600 }}>{n}</div>
                    <div style={{ fontSize: 8 }}>{a}</div>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
          <button className="btn-ghost" style={{ flex: 1 }} disabled={activeSub === 0} onClick={() => setActiveSub(activeSub - 1)}>← Prev section</button>
          <button className="btn-soft" style={{ flex: 1 }} disabled={activeSub === SUBSCALES.length - 1} onClick={() => setActiveSub(activeSub + 1)}>Next section →</button>
        </div>
        <MSection title="OPTIONAL MODULES">
          {[
            { k: 'work', l: 'Work module' },
            { k: 'sexual', l: 'Sexual relationships (private — never auto-shared)' },
            { k: 'children', l: 'Relationship with children' },
            { k: 'medical', l: 'Feelings about medical profession' },
            { k: 'treatment', l: 'Feelings about treatment' },
            { k: 'infertility', l: 'Infertility' },
          ].map(m => (
            <ToggleRow key={m.k} label={m.l} checked={optionalModules[m.k]} onChange={v => setOptionalModules(o => ({ ...o, [m.k]: v }))} />
          ))}
        </MSection>
        <button className="btn-primary" style={{ width: '100%', marginTop: 12 }} disabled={!allDone} onClick={submit}>Save EHP-30</button>
      </div>
    );
  };

  // ============================================================
  // F102 — EHP-5 Weekly
  // ============================================================
  M.ehp5 = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const ITEMS = [
      'How often has your pain been so severe that you could not bear it?',
      'How often have you felt out of control?',
      'How often have you felt angry about your condition?',
      'How often have people close to you been supportive? (reverse)',
      'How often have you felt less of a woman because of your condition?',
    ];
    const REVERSE = [false, false, false, true, false];
    const ANCHORS = ['Never', 'Rarely', 'Sometimes', 'Often', 'Always'];
    const [items, setItems] = useM(Array(5).fill(null));
    const completed = items.every(v => v !== null);
    const raw = items.reduce((sum, v, i) => sum + (v == null ? 0 : (REVERSE[i] ? 4 - v : v)), 0);
    const total = completed ? Math.round((raw / 20) * 100) : null;
    const submit = () => {
      const tk = todayKey();
      setState(s => ({
        ...s,
        endoEhp5Log: { ...(s.endoEhp5Log || {}), [tk]: { items, total, completedAt: new Date().toISOString() } },
      }));
    };
    return (
      <div>
        <MHeader eyebrow="F102 · EHP-5 · WEEKLY" title={<>QoL pulse, <span style={{ color: 'var(--eucalyptus)' }}>30 seconds.</span></>} sub="One item per EHP-30 subscale. Lower = better." />
        {ITEMS.map((q, i) => (
          <div key={i} className="card" style={{ padding: 12, marginBottom: 6 }}>
            <div style={{ fontSize: 12, marginBottom: 8 }}>{q}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
              {ANCHORS.map((a, n) => (
                <button key={n} onClick={() => { const next = [...items]; next[i] = n; setItems(next); }}
                  style={{ padding: '6px 2px', borderRadius: 6, border: '1px solid var(--border)', background: items[i] === n ? 'var(--eucalyptus)' : 'var(--surface)', color: items[i] === n ? '#fff' : 'inherit', fontSize: 9, cursor: 'pointer' }}>
                  <div className="data" style={{ fontSize: 11, fontWeight: 600 }}>{n}</div>
                  <div style={{ fontSize: 8 }}>{a}</div>
                </button>
              ))}
            </div>
          </div>
        ))}
        {completed && (
          <div className="card-warm" style={{ padding: 14, marginTop: 12 }}>
            <div className="eyebrow" style={{ marginBottom: 4 }}>EHP-5 SCORE</div>
            <div className="data" style={{ fontSize: 22, fontWeight: 600 }}>{total} / 100</div>
          </div>
        )}
        <button className="btn-primary" style={{ width: '100%', marginTop: 12 }} disabled={!completed} onClick={submit}>Save EHP-5</button>
      </div>
    );
  };

  // ============================================================
  // F103 — B&B Scale
  // ============================================================
  M.bnb = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const PATIENT_ITEMS = [
      { k: 'dysmenorrhea', l: 'Dysmenorrhea (period pain)', anchors: ['No pain', 'Mild — does not interfere', 'Moderate — inhibits activity, analgesia needed', 'Severe — incapacitating'] },
      { k: 'dyspareunia', l: 'Deep dyspareunia (pain with sex)', anchors: ['No pain / not applicable', 'Mild — not interfering', 'Moderate — inhibits activity', 'Severe — avoidance'] },
      { k: 'cpp', l: 'Non-menstrual pelvic pain (CPP)', anchors: ['No pain', 'Mild — noticed but not bothersome', 'Moderate — interferes with some activities', 'Severe — interferes with most'] },
    ];
    const CLINICIAN_ITEMS = [
      { k: 'pelvic_tenderness', l: 'Pelvic tenderness on examination' },
      { k: 'induration', l: 'Induration / nodularity' },
    ];
    const [patient, setPatient] = useM([null, null, null]);
    const [notSexuallyActive, setNSA] = useM(false);
    const [clinician, setClinician] = useM([null, null]);
    const [enterClinician, setEnterClinician] = useM(false);

    const setPatientItem = (i, v) => { const n = [...patient]; n[i] = v; setPatient(n); };
    const setClinicianItem = (i, v) => { const n = [...clinician]; n[i] = v; setClinician(n); };

    const patientTotal = patient.reduce((sum, v, i) => {
      if (i === 1 && notSexuallyActive) return sum;
      return sum + (v ?? 0);
    }, 0);
    const totalItemsValid = patient.every((v, i) => v !== null || (i === 1 && notSexuallyActive));
    const sevLabel = patientTotal === 0 ? 'none' : patientTotal <= 3 ? 'mild' : patientTotal <= 6 ? 'moderate' : 'severe';

    const submit = () => {
      const tk = todayKey();
      setState(s => ({
        ...s,
        endoBnbLog: { ...(s.endoBnbLog || {}), [tk]: { patient_items: patient, clinician_items: enterClinician ? clinician : null, total: patientTotal, severity: sevLabel, notSexuallyActive, completedAt: new Date().toISOString() } },
      }));
    };
    return (
      <div>
        <MHeader eyebrow="F103 · B&B SCALE · MONTHLY" title={<>Biberoglu & <span style={{ color: 'var(--eucalyptus)' }}>Behrman.</span></>} sub="Clinical-trial-grade severity. Best logged during menstruation week." />
        {PATIENT_ITEMS.map((it, i) => (
          <div key={it.k} className="card" style={{ padding: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{it.l}</div>
            {it.k === 'dyspareunia' && (
              <ToggleRow label="Not sexually active right now" checked={notSexuallyActive} onChange={setNSA} sub="Excluded from total — see footnote." />
            )}
            {!(it.k === 'dyspareunia' && notSexuallyActive) && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
                {it.anchors.map((a, n) => (
                  <button key={n} onClick={() => setPatientItem(i, n)}
                    style={{ padding: '6px 2px', borderRadius: 6, border: '1px solid var(--border)', background: patient[i] === n ? 'var(--eucalyptus)' : 'var(--surface)', color: patient[i] === n ? '#fff' : 'inherit', fontSize: 9, cursor: 'pointer', lineHeight: 1.2 }}>
                    <div className="data" style={{ fontSize: 11, fontWeight: 600 }}>{n}</div>
                    <div style={{ fontSize: 8 }}>{a}</div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        <div className="caption" style={{ fontSize: 11, padding: 8, fontStyle: 'italic' }}>
          † If you are not currently sexually active, dyspareunia is excluded from the total (per B&B convention).
        </div>
        <ToggleRow label="My clinician shared exam findings I want to log" checked={enterClinician} onChange={setEnterClinician} sub="Optional — pelvic tenderness + induration, 0-3 each" />
        {enterClinician && CLINICIAN_ITEMS.map((it, i) => (
          <div key={it.k} className="card" style={{ padding: 12, marginBottom: 6, marginTop: 4 }}>
            <div style={{ fontSize: 12, marginBottom: 6 }}>{it.l} (clinician-recorded)</div>
            <Severity value={clinician[i] || 0} onChange={v => setClinicianItem(i, v)} max={4} />
          </div>
        ))}
        {totalItemsValid && (
          <div className="card-warm" style={{ padding: 14, marginTop: 12 }}>
            <div className="eyebrow" style={{ marginBottom: 4 }}>SYMPTOM TOTAL</div>
            <div className="data" style={{ fontSize: 22, fontWeight: 600 }}>{patientTotal} / 9</div>
            <div className="caption" style={{ fontSize: 12, textTransform: 'capitalize' }}>{sevLabel}</div>
          </div>
        )}
        <button className="btn-primary" style={{ width: '100%', marginTop: 12 }} disabled={!totalItemsValid} onClick={submit}>Save B&B</button>
      </div>
    );
  };

  // ============================================================
  // F104 — Treatment Log + Response Tracker
  // ============================================================
  M.endoTreatment = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const treatments = state.endoTreatmentLog || [];
    const [showForm, setShowForm] = useM(false);
    const [draft, setDraft] = useM({ name: '', type: 'gnrh_antagonist', startDate: todayKey(), endDate: '', dose: '', frequency: '', sideEffects: [], effectivenessNRS: null });
    const TYPES = [
      { v: 'gnrh_agonist', l: 'GnRH agonist (Lupron, etc.)' },
      { v: 'gnrh_antagonist', l: 'GnRH antagonist (elagolix, relugolix)' },
      { v: 'progestin', l: 'Progestin (NETA, dienogest, IUD)' },
      { v: 'chc', l: 'Combined hormonal contraception' },
      { v: 'nsaid', l: 'NSAID' },
      { v: 'pfpt', l: 'Pelvic floor PT' },
      { v: 'other', l: 'Other' },
    ];
    const SIDE_EFFECTS = ['Fatigue', 'Mood changes', 'Hot flashes', 'Bone pain', 'Weight changes', 'Headache', 'Nausea', 'Other'];

    const save = () => {
      if (!draft.name) return;
      setState(s => ({ ...s, endoTreatmentLog: [...(s.endoTreatmentLog || []), { ...draft, addedAt: Date.now() }] }));
      setDraft({ name: '', type: 'gnrh_antagonist', startDate: todayKey(), endDate: '', dose: '', frequency: '', sideEffects: [], effectivenessNRS: null });
      setShowForm(false);
    };
    const updateNRS = (idx, n) => {
      setState(s => ({
        ...s,
        endoTreatmentLog: (s.endoTreatmentLog || []).map((t, i) => i === idx ? { ...t, effectivenessNRS: n } : t),
      }));
    };

    return (
      <div>
        <MHeader eyebrow="F104 · TREATMENT LOG" title={<>What you're <span style={{ color: 'var(--eucalyptus)' }}>on.</span></>} sub="Response tracked vs baseline. ESHRE: post-surgical suppression cuts recurrence 59% (RR 0.41)." />
        <button className="btn-soft" style={{ width: '100%', marginBottom: 12 }} onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Add treatment'}</button>
        {showForm && (
          <div className="card-warm" style={{ padding: 14, marginBottom: 14 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>NEW TREATMENT</div>
            <input type="text" placeholder="Name (e.g. Visanne 2mg)" value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} style={{ width: '100%', marginBottom: 8 }} />
            <select value={draft.type} onChange={e => setDraft({ ...draft, type: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)', marginBottom: 8 }}>
              {TYPES.map(t => <option key={t.v} value={t.v}>{t.l}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input type="text" placeholder="Dose" value={draft.dose} onChange={e => setDraft({ ...draft, dose: e.target.value })} style={{ flex: 1 }} />
              <input type="text" placeholder="Frequency" value={draft.frequency} onChange={e => setDraft({ ...draft, frequency: e.target.value })} style={{ flex: 1 }} />
            </div>
            <div className="caption" style={{ marginBottom: 4 }}>Started</div>
            <input type="date" value={draft.startDate} onChange={e => setDraft({ ...draft, startDate: e.target.value })} style={{ marginBottom: 8 }} />
            <button className="btn-primary" style={{ width: '100%' }} onClick={save}>Save treatment</button>
          </div>
        )}
        {treatments.length === 0 && (
          <div className="card" style={{ padding: 18, textAlign: 'center' }}>
            <div className="caption" style={{ fontSize: 12 }}>No treatments yet. Tap "+ Add" to start tracking response.</div>
          </div>
        )}
        {treatments.map((t, i) => {
          const startMs = t.startDate ? new Date(t.startDate).getTime() : Date.now();
          const weeksSince = Math.floor((Date.now() - startMs) / (7 * 86400000));
          const sixWeekDue = weeksSince >= 6 && t.effectivenessNRS == null;
          return (
            <div key={i} className="card-warm" style={{ padding: 14, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                <div className="caption" style={{ fontSize: 11 }}>{TYPES.find(x => x.v === t.type)?.l || t.type}</div>
              </div>
              <div className="caption" style={{ fontSize: 11, marginTop: 2 }}>
                Started {dateLabel(t.startDate)} · {weeksSince}w · {t.dose || '—'} {t.frequency || ''}
              </div>
              {sixWeekDue && (
                <div className="card-mint" style={{ padding: 10, marginTop: 8 }}>
                  <div className="caption" style={{ marginBottom: 6 }}>It's been {weeksSince} weeks. How well is it managing your symptoms?</div>
                  <NRS value={t.effectivenessNRS} onChange={n => updateNRS(i, n)} />
                </div>
              )}
              {t.effectivenessNRS != null && (
                <div className="card-paper" style={{ padding: 10, marginTop: 8 }}>
                  <div className="caption" style={{ fontSize: 11 }}>Effectiveness</div>
                  <div className="data" style={{ fontSize: 18, fontWeight: 600, color: t.effectivenessNRS >= 7 ? 'var(--eucalyptus)' : t.effectivenessNRS >= 4 ? 'var(--severity-mod)' : 'var(--severity-severe)' }}>{t.effectivenessNRS}/10</div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ============================================================
  // F105 — Surgical History Vault
  // ============================================================
  M.endoSurgical = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const history = state.endoSurgicalHistory || [];
    const [showForm, setShowForm] = useM(false);
    const [draft, setDraft] = useM({ date: todayKey(), surgeon: '', hospital: '', type: 'excision', rasrm_stage: null, enzian: { P: '', O: '', B: '', C: '', D: '', A: '' }, efi: null, notes: '', histology: false });
    const TYPES = ['diagnostic', 'excision', 'ablation', 'excision_ablation', 'hysterectomy', 'oophorectomy', 'other'];
    const ENZIAN_LABELS = { P: 'P · Peritoneal', O: 'O · Ovarian', B: 'B · Vaginal/cervical', C: 'C · Recto-vaginal', D: 'D · Intestinal', A: 'A · Adenomyosis' };

    const save = () => {
      setState(s => ({ ...s, endoSurgicalHistory: [...(s.endoSurgicalHistory || []), { ...draft, addedAt: Date.now() }] }));
      setShowForm(false);
      setDraft({ date: todayKey(), surgeon: '', hospital: '', type: 'excision', rasrm_stage: null, enzian: { P: '', O: '', B: '', C: '', D: '', A: '' }, efi: null, notes: '', histology: false });
    };

    return (
      <div>
        <MHeader eyebrow="F105 · SURGICAL HISTORY" title={<>Your <span style={{ color: 'var(--eucalyptus)' }}>operative</span> record.</>} sub="rASRM + #ENZIAN. Operative report context for every appointment." />
        <div className="card-warm" style={{ padding: 12, marginBottom: 12, borderLeft: '3px solid var(--coral)' }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>IMPORTANT CONTEXT</div>
          <p className="body" style={{ fontSize: 12 }}>Your rASRM stage does not predict how much pain or disability you experience. Stage I patients often report more severe pain than Stage IV patients. Your symptom log is the most accurate measure of how endometriosis affects your daily life.</p>
        </div>
        <button className="btn-soft" style={{ width: '100%', marginBottom: 12 }} onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Add surgery'}</button>
        {showForm && (
          <div className="card-warm" style={{ padding: 14, marginBottom: 14 }}>
            <div className="caption" style={{ marginBottom: 4 }}>Date</div>
            <input type="date" value={draft.date} onChange={e => setDraft({ ...draft, date: e.target.value })} style={{ marginBottom: 8 }} />
            <div className="caption" style={{ marginBottom: 4 }}>Procedure type</div>
            <select value={draft.type} onChange={e => setDraft({ ...draft, type: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)', marginBottom: 8 }}>
              {TYPES.map(t => <option key={t} value={t}>{t.replace('_', ' + ')}</option>)}
            </select>
            <input type="text" placeholder="Surgeon (optional)" value={draft.surgeon} onChange={e => setDraft({ ...draft, surgeon: e.target.value })} style={{ width: '100%', marginBottom: 8 }} />
            <input type="text" placeholder="Hospital (optional)" value={draft.hospital} onChange={e => setDraft({ ...draft, hospital: e.target.value })} style={{ width: '100%', marginBottom: 8 }} />
            <div className="caption" style={{ marginBottom: 4 }}>rASRM stage</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4, marginBottom: 8 }}>
              {[null, 1, 2, 3, 4].map(n => (
                <button key={String(n)} onClick={() => setDraft({ ...draft, rasrm_stage: n })}
                  style={{ padding: 8, borderRadius: 6, border: '1px solid var(--border)', background: draft.rasrm_stage === n ? 'var(--eucalyptus)' : 'var(--surface)', color: draft.rasrm_stage === n ? '#fff' : 'inherit', fontSize: 11, cursor: 'pointer' }}>
                  {n == null ? 'N/A' : `Stage ${n}`}
                </button>
              ))}
            </div>
            <div className="caption" style={{ marginBottom: 4 }}>#ENZIAN compartments (optional, free text per compartment)</div>
            {Object.keys(ENZIAN_LABELS).map(k => (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <div style={{ width: 130, fontSize: 11 }}>{ENZIAN_LABELS[k]}</div>
                <input type="text" value={draft.enzian[k]} onChange={e => setDraft({ ...draft, enzian: { ...draft.enzian, [k]: e.target.value } })} placeholder="—" style={{ flex: 1, fontSize: 12 }} />
              </div>
            ))}
            <div className="caption" style={{ marginTop: 8, marginBottom: 4 }}>EFI (Endometriosis Fertility Index, 0–10, if surgeon provided)</div>
            <input type="number" min="0" max="10" value={draft.efi || ''} onChange={e => setDraft({ ...draft, efi: e.target.value ? +e.target.value : null })} style={{ marginBottom: 8 }} />
            <textarea placeholder="Operative findings / notes" value={draft.notes} onChange={e => setDraft({ ...draft, notes: e.target.value })} rows={3} style={{ width: '100%', borderRadius: 8, border: '1px solid var(--border)', padding: 8, fontSize: 12, marginBottom: 8, fontFamily: 'inherit' }} />
            <ToggleRow label="Histology confirmed" checked={!!draft.histology} onChange={v => setDraft({ ...draft, histology: v })} />
            <button className="btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={save}>Save surgery</button>
          </div>
        )}
        {history.length === 0 && (
          <div className="card" style={{ padding: 18, textAlign: 'center' }}>
            <div className="caption" style={{ fontSize: 12 }}>No surgical history recorded.</div>
          </div>
        )}
        {history.map((h, i) => (
          <div key={i} className="card-warm" style={{ padding: 14, marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{(h.type || '').replace('_', ' + ')}</div>
              <div className="caption" style={{ fontSize: 11 }}>{dateLabel(h.date)}</div>
            </div>
            {h.surgeon && <div className="caption" style={{ fontSize: 11, marginTop: 2 }}>{h.surgeon}{h.hospital ? ` · ${h.hospital}` : ''}</div>}
            {h.rasrm_stage && <div className="data" style={{ fontSize: 13, marginTop: 6 }}>rASRM Stage {h.rasrm_stage}</div>}
            {h.efi != null && <div className="caption" style={{ fontSize: 11, marginTop: 2 }}>EFI {h.efi}/10</div>}
            {h.notes && <div className="caption" style={{ fontSize: 12, marginTop: 6, whiteSpace: 'pre-wrap' }}>{h.notes}</div>}
          </div>
        ))}
      </div>
    );
  };

  // ============================================================
  // F106 — Lab Vault
  // ============================================================
  M.endoLab = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const labs = state.endoLabVault || [];
    const [showForm, setShowForm] = useM(false);
    const [draft, setDraft] = useM({ date: todayKey(), analyte: 'CA-125', value: '', units: 'U/mL' });
    const ANALYTES = [
      { n: 'CA-125', u: 'U/mL' },
      { n: 'AMH', u: 'ng/mL' },
      { n: 'TSH', u: 'mIU/L' },
      { n: 'FSH', u: 'mIU/mL' },
      { n: 'E2', u: 'pg/mL' },
      { n: 'CRP', u: 'mg/L' },
    ];
    const onAnalyteChange = (n) => {
      setDraft({ ...draft, analyte: n, units: ANALYTES.find(a => a.n === n)?.u || '' });
    };
    const save = () => {
      if (!draft.value) return;
      setState(s => ({ ...s, endoLabVault: [...(s.endoLabVault || []), { ...draft, value: +draft.value, addedAt: Date.now() }] }));
      setDraft({ date: todayKey(), analyte: 'CA-125', value: '', units: 'U/mL' });
      setShowForm(false);
    };

    const labsByAnalyte = {};
    labs.forEach(l => { (labsByAnalyte[l.analyte] ||= []).push(l); });
    Object.values(labsByAnalyte).forEach(arr => arr.sort((a, b) => new Date(a.date) - new Date(b.date)));

    const interpretation = (analyte, latest) => {
      if (!latest) return null;
      const v = latest.value;
      if (analyte === 'CA-125') {
        return { msg: `CA-125 is not a diagnostic test for endometriosis — many women with endo have normal values. Tracking trend can be informative. Reference: <35 U/mL.`, flag: v > 35 };
      }
      if (analyte === 'TSH') {
        return { msg: `Hypothyroidism is 7× more common in people with endometriosis. Reference: 0.5–4.5 mIU/L.`, flag: v > 4.5 };
      }
      if (analyte === 'AMH') {
        return { msg: `Endometriomas can reduce ovarian reserve. AMH gives you and your doctor a current ovarian-reserve picture.`, flag: false };
      }
      if (analyte === 'CRP') return { msg: 'CRP is a general inflammation marker — not endo-specific. Reference: <5 mg/L.', flag: v > 5 };
      return null;
    };

    return (
      <div>
        <MHeader eyebrow="F106 · LAB VAULT" title={<>CA-125, AMH, TSH, FSH, <span style={{ color: 'var(--eucalyptus)' }}>E2.</span></>} sub="Trend tracking + clinical context. Never diagnostic alone." />
        <button className="btn-soft" style={{ width: '100%', marginBottom: 12 }} onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Add result'}</button>
        {showForm && (
          <div className="card-warm" style={{ padding: 14, marginBottom: 14 }}>
            <select value={draft.analyte} onChange={e => onAnalyteChange(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)', marginBottom: 8 }}>
              {ANALYTES.map(a => <option key={a.n} value={a.n}>{a.n}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input type="number" step="any" placeholder="Value" value={draft.value} onChange={e => setDraft({ ...draft, value: e.target.value })} style={{ flex: 1 }} />
              <input type="text" value={draft.units} onChange={e => setDraft({ ...draft, units: e.target.value })} style={{ width: 100 }} />
            </div>
            <input type="date" value={draft.date} onChange={e => setDraft({ ...draft, date: e.target.value })} style={{ marginBottom: 8 }} />
            <button className="btn-primary" style={{ width: '100%' }} onClick={save}>Save</button>
          </div>
        )}
        {Object.keys(labsByAnalyte).length === 0 && (
          <div className="card" style={{ padding: 18, textAlign: 'center' }}>
            <div className="caption" style={{ fontSize: 12 }}>No lab results yet.</div>
          </div>
        )}
        {Object.entries(labsByAnalyte).map(([analyte, arr]) => {
          const latest = arr[arr.length - 1];
          const intr = interpretation(analyte, latest);
          const trend = arr.map(x => x.value);
          return (
            <div key={analyte} className="card-warm" style={{ padding: 14, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>{analyte}</div>
                <div className="data" style={{ fontSize: 14, color: intr?.flag ? 'var(--severity-severe)' : 'var(--ink)' }}>{latest.value} {latest.units}</div>
              </div>
              <div className="caption" style={{ fontSize: 11 }}>Latest: {dateLabel(latest.date)} · {arr.length} result{arr.length === 1 ? '' : 's'}</div>
              {arr.length >= 2 && (
                <div style={{ marginTop: 8 }}>
                  <Spark data={trend} color="var(--eucalyptus)" height={36} />
                </div>
              )}
              {intr && (
                <div className="card-mint" style={{ padding: 10, marginTop: 8 }}>
                  <p className="body" style={{ fontSize: 11 }}>{intr.msg}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  // ============================================================
  // F107 — Imaging Vault
  // ============================================================
  M.endoImaging = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const imaging = state.endoImagingVault || [];
    const [showForm, setShowForm] = useM(false);
    const [draft, setDraft] = useM({ date: todayKey(), type: 'tvus', findings: '', endometriomaSizes: { right: '', left: '' }, dieSites: { posterior: false, anterior: false, bowel: false, bladder: false, ureter: false }, jzThickness: '', adenomyosis: false });

    const save = () => {
      const e = { ...draft, endometriomaSizes: { right: draft.endometriomaSizes.right ? +draft.endometriomaSizes.right : null, left: draft.endometriomaSizes.left ? +draft.endometriomaSizes.left : null }, jzThickness: draft.jzThickness ? +draft.jzThickness : null, addedAt: Date.now() };
      setState(s => ({ ...s, endoImagingVault: [...(s.endoImagingVault || []), e] }));
      setShowForm(false);
      setDraft({ date: todayKey(), type: 'tvus', findings: '', endometriomaSizes: { right: '', left: '' }, dieSites: { posterior: false, anterior: false, bowel: false, bladder: false, ureter: false }, jzThickness: '', adenomyosis: false });
    };
    const toggleDie = (k) => setDraft({ ...draft, dieSites: { ...draft.dieSites, [k]: !draft.dieSites[k] } });

    return (
      <div>
        <MHeader eyebrow="F107 · IMAGING" title={<>Ultrasound + <span style={{ color: 'var(--eucalyptus)' }}>MRI</span> findings.</>} sub="Endometrioma growth tracking. DIE site flags." />
        <button className="btn-soft" style={{ width: '100%', marginBottom: 12 }} onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Add imaging'}</button>
        {showForm && (
          <div className="card-warm" style={{ padding: 14, marginBottom: 14 }}>
            <input type="date" value={draft.date} onChange={e => setDraft({ ...draft, date: e.target.value })} style={{ marginBottom: 8 }} />
            <select value={draft.type} onChange={e => setDraft({ ...draft, type: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)', marginBottom: 8 }}>
              <option value="tvus">Transvaginal ultrasound</option>
              <option value="abdominal_us">Abdominal ultrasound</option>
              <option value="mri">MRI pelvis</option>
              <option value="ct">CT</option>
            </select>
            <div className="caption" style={{ marginBottom: 4 }}>Endometrioma size (mm)</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
              <input type="number" placeholder="Right" value={draft.endometriomaSizes.right} onChange={e => setDraft({ ...draft, endometriomaSizes: { ...draft.endometriomaSizes, right: e.target.value } })} style={{ flex: 1 }} />
              <input type="number" placeholder="Left" value={draft.endometriomaSizes.left} onChange={e => setDraft({ ...draft, endometriomaSizes: { ...draft.endometriomaSizes, left: e.target.value } })} style={{ flex: 1 }} />
            </div>
            <ToggleRow label="Adenomyosis features" checked={!!draft.adenomyosis} onChange={v => setDraft({ ...draft, adenomyosis: v })} />
            <div className="caption" style={{ marginBottom: 4 }}>JZ thickness (mm, if reported)</div>
            <input type="number" value={draft.jzThickness} onChange={e => setDraft({ ...draft, jzThickness: e.target.value })} style={{ marginBottom: 8 }} />
            <div className="caption" style={{ marginBottom: 4 }}>DIE sites identified</div>
            {Object.keys(draft.dieSites).map(k => (
              <ToggleRow key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} checked={draft.dieSites[k]} onChange={() => toggleDie(k)} />
            ))}
            <textarea placeholder="Findings / notes" value={draft.findings} onChange={e => setDraft({ ...draft, findings: e.target.value })} rows={3} style={{ width: '100%', borderRadius: 8, border: '1px solid var(--border)', padding: 8, fontSize: 12, marginTop: 8, fontFamily: 'inherit' }} />
            <button className="btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={save}>Save imaging</button>
          </div>
        )}
        {imaging.length === 0 && (
          <div className="card" style={{ padding: 18, textAlign: 'center' }}>
            <div className="caption" style={{ fontSize: 12 }}>No imaging yet.</div>
          </div>
        )}
        {imaging.slice().sort((a, b) => new Date(b.date) - new Date(a.date)).map((img, i) => (
          <div key={i} className="card-warm" style={{ padding: 14, marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase' }}>{img.type}</div>
              <div className="caption" style={{ fontSize: 11 }}>{dateLabel(img.date)}</div>
            </div>
            {(img.endometriomaSizes?.right || img.endometriomaSizes?.left) && (
              <div className="data" style={{ fontSize: 13, marginTop: 4 }}>
                Endometrioma — R: {img.endometriomaSizes.right || '—'}mm · L: {img.endometriomaSizes.left || '—'}mm
              </div>
            )}
            {Object.entries(img.dieSites || {}).filter(([, v]) => v).length > 0 && (
              <div className="caption" style={{ fontSize: 11, marginTop: 4 }}>
                DIE: {Object.entries(img.dieSites || {}).filter(([, v]) => v).map(([k]) => k).join(', ')}
              </div>
            )}
            {img.findings && <div className="caption" style={{ fontSize: 12, marginTop: 6, whiteSpace: 'pre-wrap' }}>{img.findings}</div>}
          </div>
        ))}
      </div>
    );
  };

  // ============================================================
  // F108 — DIE Red Flag + Safety Escalation
  // ============================================================
  M.endoSafety = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const fired = state.endoDIETriggered || [];
    const acknowledged = state.endoAcknowledgedRules || {};

    const RULES = {
      cyclicalRectalBleeding: { label: 'Cyclical rectal bleeding', urgency: 'URGENT', message: 'You have logged rectal bleeding during your period across multiple cycles. This pattern warrants evaluation by an endometriosis specialist familiar with bowel involvement.' },
      cyclicalHematuria: { label: 'Cyclical hematuria', urgency: 'URGENT', message: 'Cyclical blood in urine can indicate bladder DIE. Specialist evaluation is recommended.' },
      cyclicalShoulderPain: { label: 'Cyclical right shoulder/diaphragm pain', urgency: 'MODERATE', message: 'Cyclical right shoulder/diaphragm pain may indicate thoracic/diaphragmatic endometriosis. Worth discussing with your specialist.' },
      cyclicalFlankPain: { label: 'Cyclical flank/back pain', urgency: 'URGENT', message: 'Cyclical flank pain near the kidney area can indicate ureteral DIE — this carries silent kidney damage risk and warrants urgent evaluation.' },
      phq9Item9: { label: 'PHQ-9 Item 9 (suicidal ideation)', urgency: 'CRISIS', message: 'You are not alone and support is available right now. Please use the crisis resources surfaced in your safety screen.' },
      phq9ModeratelySevere: { label: 'PHQ-9 ≥ 15 (moderately severe depression)', urgency: 'HIGH', message: 'Your depression score is significant. Please reach out to your GP or a mental health provider this week.' },
      severePainStreak: { label: 'Severe pain ≥ 7 consecutive days', urgency: 'HIGH', message: 'Severe persistent pain warrants clinical attention. Please contact your provider.' },
      heavyBleeding: { label: 'Very heavy bleeding (PBAC > 150)', urgency: 'MODERATE', message: 'Very heavy periods may need evaluation — heavy menstrual bleeding is treatable.' },
      nsaidOveruse: { label: 'NSAID overuse (>50% of days)', urgency: 'MODERATE', message: 'Long-term frequent NSAID use can affect kidneys, stomach, and cardiovascular health. Discuss alternatives with your provider.' },
    };

    // Compute current rule states from logs
    const computeFiredRules = () => {
      const out = [];
      const dailyLog = state.endoDailyLog || {};
      const bowelLog = state.endoBowelLog || {};
      const phq9 = state.endoPhq9Log || {};
      const pbac = state.endoPbacLog || {};

      // PHQ-9 item 9
      const recentPhq = Object.values(phq9).sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];
      if (recentPhq?.item9_si >= 1) out.push({ ruleId: 'phq9Item9', firedAt: recentPhq.completedAt });
      if (recentPhq?.total >= 15) out.push({ ruleId: 'phq9ModeratelySevere', firedAt: recentPhq.completedAt });

      // Severe pain streak
      const dailyKeys = Object.keys(dailyLog).sort().reverse();
      let streak = 0;
      for (const k of dailyKeys) {
        const d = dailyLog[k];
        const max = Math.max(d.dysmenorrhea_nrs || 0, d.cpp_nrs || 0, d.dyschezia_nrs || 0, d.dysuria_nrs || 0);
        if (max >= 8) streak += 1; else break;
      }
      if (streak >= 7) out.push({ ruleId: 'severePainStreak', firedAt: new Date().toISOString() });

      // Cyclical rectal bleeding (2+ logs across menstrual phase)
      const cyclicalRectalCount = Object.values(bowelLog).filter(b => b.rectal_bleeding && b.rectal_bleeding_cyclical).length;
      if (cyclicalRectalCount >= 2) out.push({ ruleId: 'cyclicalRectalBleeding', firedAt: new Date().toISOString() });

      // Heavy bleeding (any cycle PBAC total > 150)
      const recentPbac = Object.values(pbac).slice(-8).reduce((sum, p) => sum + (p.daily_score || 0), 0);
      if (recentPbac > 150) out.push({ ruleId: 'heavyBleeding', firedAt: new Date().toISOString() });

      // NSAID overuse
      const last30 = dailyKeys.slice(0, 30);
      const nsaidDays = last30.filter(k => dailyLog[k].nsaid_taken).length;
      if (last30.length >= 30 && nsaidDays > 15) out.push({ ruleId: 'nsaidOveruse', firedAt: new Date().toISOString() });

      return out;
    };

    const liveFired = [...fired, ...computeFiredRules().filter(r => !fired.find(f => f.ruleId === r.ruleId))];

    const acknowledge = (ruleId) => {
      setState(s => ({
        ...s,
        endoAcknowledgedRules: { ...(s.endoAcknowledgedRules || {}), [ruleId]: new Date().toISOString() },
        endoDIETriggered: (s.endoDIETriggered || []).map(r => r.ruleId === ruleId ? { ...r, acknowledged: true, acknowledgedAt: new Date().toISOString() } : r),
      }));
    };

    const URGENCY_COLORS = { CRISIS: 'var(--severity-severe)', URGENT: 'var(--severity-severe)', HIGH: 'var(--coral)', MODERATE: 'var(--severity-mod)' };

    if (liveFired.length === 0) {
      return (
        <div>
          <MHeader eyebrow="F108 · SAFETY DASHBOARD" title={<>No flags <span style={{ color: 'var(--eucalyptus)' }}>active.</span></>} sub="DIE pattern monitor + crisis gates run continuously on your logs." />
          <div className="card-mint" style={{ padding: 14 }}>
            <p className="body" style={{ fontSize: 13 }}>This screen automatically surfaces patterns like cyclical rectal bleeding, hematuria, shoulder/flank pain, severe pain streaks, heavy bleeding, NSAID overuse, and PHQ-9 crisis flags.</p>
          </div>
          <div className="caption" style={{ fontSize: 11, marginTop: 12, lineHeight: 1.5 }}>
            Patterns are observations from your logs. They are not a diagnosis. Bring them to your clinician.
          </div>
        </div>
      );
    }

    return (
      <div>
        <MHeader eyebrow="F108 · SAFETY DASHBOARD" title={<>{liveFired.length} <span style={{ color: 'var(--coral)' }}>flag{liveFired.length === 1 ? '' : 's'}</span> from your logs.</>} sub="Patterns worth discussing — never a diagnosis." />
        <div className="card-warm" style={{ padding: 10, marginBottom: 12, fontSize: 11, color: 'var(--ink-2)' }}>
          These observations come from your data. They are not a diagnosis. Bring them to your clinician.
        </div>
        {liveFired.map((r, i) => {
          const rule = RULES[r.ruleId];
          if (!rule) return null;
          const ack = !!acknowledged[r.ruleId];
          return (
            <div key={i} className="card" style={{ padding: 14, marginBottom: 8, borderLeft: `3px solid ${URGENCY_COLORS[rule.urgency]}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{rule.label}</div>
                <div className="phase-pill" style={{ background: URGENCY_COLORS[rule.urgency], color: '#fff' }}>{rule.urgency}</div>
              </div>
              <p className="body" style={{ fontSize: 12, marginTop: 6 }}>{rule.message}</p>
              <div className="caption" style={{ fontSize: 10, marginTop: 6 }}>Fired {dateLabel(r.firedAt)}</div>
              {!ack && rule.urgency !== 'CRISIS' && (
                <button className="btn-soft" style={{ width: '100%', marginTop: 8, fontSize: 12 }} onClick={() => acknowledge(r.ruleId)}>Acknowledge — I've seen this</button>
              )}
              {ack && <div className="caption" style={{ fontSize: 10, marginTop: 6, color: 'var(--eucalyptus)' }}>✓ Acknowledged {dateLabel(acknowledged[r.ruleId])}</div>}
            </div>
          );
        })}
      </div>
    );
  };

  // ============================================================
  // F109 — Structured Physician Report PDF
  // ============================================================
  M.endoPhysicianReport = ({ state }) => {
    const onb = state.endoOnboarding || {};
    const dailyLogKeys = Object.keys(state.endoDailyLog || {}).sort();
    const reportRange = `${dailyLogKeys[0] || '—'} → ${dailyLogKeys[dailyLogKeys.length - 1] || '—'}`;

    const generate = () => {
      if (!window.HQ?.generatePDF) {
        alert('PDF generator not loaded.');
        return;
      }

      // Compute summaries
      const dailyLog = state.endoDailyLog || {};
      const last30 = Object.keys(dailyLog).sort().reverse().slice(0, 30);
      const avg = (k) => {
        const vals = last30.map(d => dailyLog[d][k]).filter(v => typeof v === 'number');
        return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : '—';
      };

      const phq9All = Object.values(state.endoPhq9Log || {});
      const lastPhq = phq9All.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];
      const gad7All = Object.values(state.endoGad7Log || {});
      const lastGad = gad7All.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];
      const ehp30All = Object.values(state.endoEhp30Log || {});
      const lastEhp30 = ehp30All.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];
      const ehp5All = Object.values(state.endoEhp5Log || {});
      const lastEhp5 = ehp5All.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];
      const bnbAll = Object.values(state.endoBnbLog || {});
      const lastBnb = bnbAll.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];

      const fired = state.endoDIETriggered || [];
      const treatments = state.endoTreatmentLog || [];
      const surgeries = state.endoSurgicalHistory || [];
      const labs = state.endoLabVault || [];
      const imaging = state.endoImagingVault || [];

      const sections = [
        // 1 Patient summary
        { heading: '1 · Patient Summary', lines: [
          { kind: 'kv', key: 'Report period', value: reportRange },
          { kind: 'kv', key: 'Diagnosis status', value: onb.diagnosisStatus || '—' },
          { kind: 'kv', key: 'Current treatment', value: onb.currentTreatment || '—' },
          { kind: 'kv', key: 'Comorbidities', value: (onb.comorbidities || []).join(', ') || 'None recorded' },
          { kind: 'kv', key: 'Fertility focused', value: onb.fertilityFocused ? 'Yes' : 'No' },
        ] },
        // 2 Clinical alerts
        { heading: '2 · Clinical Alerts (Safety Flags)', lines: fired.length === 0 ? ['No safety flags fired during this report period.'] : fired.map(f => `• ${f.ruleId} — fired ${dateLabel(f.firedAt)}`) },
        // 3 Instrument scores
        { heading: '3 · Instrument Score Summary', table: {
          headers: ['Instrument', 'Last score', 'Date', 'Severity'],
          rows: [
            ['PHQ-9', lastPhq?.total ?? '—', lastPhq ? dateLabel(lastPhq.completedAt) : '—', lastPhq?.severity || '—'],
            ['GAD-7', lastGad?.total ?? '—', lastGad ? dateLabel(lastGad.completedAt) : '—', lastGad?.severity || '—'],
            ['EHP-30 (Pain)', lastEhp30?.subscale_scores?.pain ?? '—', lastEhp30 ? dateLabel(lastEhp30.completedAt) : '—', '/100'],
            ['EHP-5', lastEhp5?.total ?? '—', lastEhp5 ? dateLabel(lastEhp5.completedAt) : '—', '/100'],
            ['B&B', lastBnb?.total ?? '—', lastBnb ? dateLabel(lastBnb.completedAt) : '—', lastBnb?.severity || '—'],
          ],
        } },
        // 4 Pain trends
        { heading: '4 · Pain Trends (last 30 days, NRS averages)', table: {
          headers: ['Pain type', 'Avg NRS', 'Domain'],
          rows: [
            ['Dysmenorrhea', avg('dysmenorrhea_nrs'), 'Period'],
            ['CPP (chronic pelvic)', avg('cpp_nrs'), 'Non-period'],
            ['Dyschezia', avg('dyschezia_nrs'), 'Bowel'],
            ['Dysuria', avg('dysuria_nrs'), 'Bladder'],
            ['Dyspareunia', avg('dyspareunia_nrs'), 'Sexual'],
          ],
        } },
        // 5 Body map composite
        { heading: '5 · Pain Body Map Composite', lines: ['See in-app body-map composite. Top zones with pain ≥4 NRS surfaced for clinician review.'] },
        // 6 GI pattern
        { heading: '6 · GI Symptom Pattern', lines: [
          `Bloating avg: ${avg('bloating_severity')} · GI pain avg: ${avg('gi_pain_severity')}`,
          `Cyclical rectal bleeding episodes: ${(Object.values(state.endoBowelLog || {}).filter(b => b.rectal_bleeding && b.rectal_bleeding_cyclical) || []).length}`,
        ] },
        // 7 Treatment
        { heading: '7 · Treatment Log', lines: treatments.length === 0 ? ['No treatments recorded.'] : treatments.map(t => `${t.name} (${t.type}) — started ${dateLabel(t.startDate)} · effectiveness ${t.effectivenessNRS == null ? '—' : t.effectivenessNRS + '/10'}`) },
        // 8 Surgical
        { heading: '8 · Surgical History', lines: surgeries.length === 0 ? ['No surgical history recorded.'] : surgeries.map(s => `${dateLabel(s.date)} · ${s.type}${s.rasrm_stage ? ' · rASRM Stage ' + s.rasrm_stage : ''}${s.histology ? ' · histology confirmed' : ''}`) },
        // 9 Lab
        { heading: '9 · Lab Vault Summary', table: labs.length ? {
          headers: ['Date', 'Analyte', 'Value', 'Units'],
          rows: labs.slice(-10).map(l => [dateLabel(l.date), l.analyte, l.value, l.units]),
        } : null, lines: labs.length ? [] : ['No lab results recorded.'] },
        // 10 Imaging
        { heading: '10 · Imaging Vault Summary', lines: imaging.length === 0 ? ['No imaging recorded.'] : imaging.map(im => `${dateLabel(im.date)} · ${im.type} — R: ${im.endometriomaSizes?.right || '—'}mm, L: ${im.endometriomaSizes?.left || '—'}mm`) },
        // 11 User notes
        { heading: '11 · User Notes (selected)', lines: ['User-curated notes appear here when selected from the daily log.'] },
        // 12 Raw data
        { heading: '12 · Full Raw Data Appendix', lines: [`Total daily logs: ${dailyLogKeys.length}`, `Total bowel logs: ${Object.keys(state.endoBowelLog || {}).length}`, `Total PBAC days logged: ${Object.keys(state.endoPbacLog || {}).length}`] },
      ];

      window.HQ.generatePDF({
        title: 'Endometriosis Patient Report',
        subtitle: `Period: ${reportRange}`,
        sections,
        filename: `hormonaiq-endo-report-${todayKey()}.pdf`,
      });
    };

    return (
      <div>
        <MHeader eyebrow="F109 · PHYSICIAN REPORT" title={<>One <span style={{ color: 'var(--eucalyptus)' }}>page</span> for your specialist.</>} sub="12 sections, clinically formatted. Print, email, share-link." />
        <div className="card-clinical" style={{ background: 'var(--cream-warm)', color: 'var(--ink)', padding: 16, marginBottom: 14, fontSize: 11, lineHeight: 1.6 }}>
          <div style={{ fontWeight: 600, letterSpacing: '0.06em', borderBottom: '1px solid var(--ink)', paddingBottom: 8, marginBottom: 10 }}>
            ENDOMETRIOSIS PATIENT REPORT — {reportRange}
          </div>
          <ol style={{ paddingLeft: 18, margin: 0 }}>
            <li>Patient summary</li>
            <li>Clinical alerts (safety flags)</li>
            <li>Instrument score summary</li>
            <li>Pain trend charts (5-D)</li>
            <li>Body map composite</li>
            <li>GI symptom pattern</li>
            <li>Treatment log</li>
            <li>Surgical history</li>
            <li>Lab vault summary</li>
            <li>Imaging vault summary</li>
            <li>User notes</li>
            <li>Full raw data appendix</li>
          </ol>
        </div>
        <button className="btn-primary" style={{ width: '100%' }} onClick={generate}>⤓ Generate PDF</button>
      </div>
    );
  };

  // ============================================================
  // F110 — Comorbidity Tracker
  // ============================================================
  M.endoComorbidity = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const comorbid = state.endoComorbid || {};
    const COMORBIDS = [
      { k: 'ibs', l: 'IBS (3.5× risk)' },
      { k: 'ibd', l: 'IBD' },
      { k: 'fibromyalgia', l: 'Fibromyalgia' },
      { k: 'hypothyroidism', l: 'Hypothyroidism (7× risk)' },
      { k: 'hashimotos', l: 'Hashimoto\'s' },
      { k: 'mecfs', l: 'ME/CFS' },
      { k: 'adenomyosis', l: 'Adenomyosis' },
      { k: 'ic', l: 'Interstitial cystitis' },
      { k: 'migraines', l: 'Migraines' },
    ];
    const setStatus = (k, v) => setState(s => ({ ...s, endoComorbid: { ...(s.endoComorbid || {}), [k]: v } }));
    return (
      <div>
        <MHeader eyebrow="F110 · COMORBIDITIES" title={<>What else you're <span style={{ color: 'var(--eucalyptus)' }}>managing.</span></>} sub="Multiple conditions often explain symptoms — specialists need to know the full picture." />
        {COMORBIDS.map(c => (
          <div key={c.k} className="card" style={{ padding: 12, marginBottom: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{c.l}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
              {[null, 'diagnosed', 'suspected', 'ruled_out'].map(v => (
                <button key={String(v)} onClick={() => setStatus(c.k, v)}
                  style={{ padding: '6px 4px', borderRadius: 6, border: '1px solid var(--border)', background: comorbid[c.k] === v ? 'var(--eucalyptus)' : 'var(--surface)', color: comorbid[c.k] === v ? '#fff' : 'inherit', fontSize: 10, cursor: 'pointer' }}>
                  {v == null ? 'No' : v.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // ============================================================
  // F111 — Med Adherence (NSAID + Hormonal)
  // ============================================================
  M.endoMedLog = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const tk = todayKey();
    const today = (state.endoMedAdherenceLog && state.endoMedAdherenceLog[tk]) || { meds: {} };
    const treatments = state.endoTreatmentLog || [];
    const setMed = (name, status) => setState(s => ({
      ...s,
      endoMedAdherenceLog: {
        ...(s.endoMedAdherenceLog || {}),
        [tk]: { meds: { ...((s.endoMedAdherenceLog || {})[tk]?.meds || {}), [name]: status } },
      },
    }));
    const setNsaid = (taken) => setState(s => ({
      ...s,
      endoDailyLog: { ...(s.endoDailyLog || {}), [tk]: { ...((s.endoDailyLog || {})[tk] || {}), nsaid_taken: taken } },
    }));
    const nsaidTaken = !!(state.endoDailyLog && state.endoDailyLog[tk] && state.endoDailyLog[tk].nsaid_taken);
    return (
      <div>
        <MHeader eyebrow="F111 · MED LOG" title={<>Daily <span style={{ color: 'var(--eucalyptus)' }}>adherence</span> · NSAIDs.</>} sub="Feeds NSAID overuse detection (F118)." />
        <MSection title="NSAID / PAIN RELIEF TODAY">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
            <button className="btn-soft" style={{ background: nsaidTaken === true ? 'var(--coral)' : undefined, color: nsaidTaken === true ? '#fff' : undefined }} onClick={() => setNsaid(true)}>Took NSAID</button>
            <button className="btn-soft" style={{ background: nsaidTaken === false && (state.endoDailyLog && state.endoDailyLog[tk]) ? 'var(--eucalyptus)' : undefined, color: nsaidTaken === false && (state.endoDailyLog && state.endoDailyLog[tk]) ? '#fff' : undefined }} onClick={() => setNsaid(false)}>None today</button>
          </div>
        </MSection>
        <MSection title="HORMONAL MEDICATIONS">
          {treatments.length === 0 && (
            <div className="caption" style={{ fontSize: 12, padding: 12 }}>Add treatments in F104 to track adherence here.</div>
          )}
          {treatments.map((t, i) => {
            const status = today.meds[t.name];
            return (
              <div key={i} className="card" style={{ padding: 12, marginBottom: 6 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{t.name}</div>
                <div className="caption" style={{ fontSize: 11, marginBottom: 6 }}>{t.dose || '—'} · {t.frequency || '—'}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                  <button onClick={() => setMed(t.name, 'taken')}
                    style={{ padding: 8, borderRadius: 8, border: '1px solid var(--border)', background: status === 'taken' ? 'var(--eucalyptus)' : 'var(--surface)', color: status === 'taken' ? '#fff' : 'inherit', cursor: 'pointer', fontSize: 12 }}>Taken</button>
                  <button onClick={() => setMed(t.name, 'missed')}
                    style={{ padding: 8, borderRadius: 8, border: '1px solid var(--border)', background: status === 'missed' ? 'var(--severity-mod)' : 'var(--surface)', color: status === 'missed' ? '#fff' : 'inherit', cursor: 'pointer', fontSize: 12 }}>Missed</button>
                </div>
              </div>
            );
          })}
        </MSection>
      </div>
    );
  };

  // ============================================================
  // F112 — Trigger Log
  // ============================================================
  M.endoTriggers = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const tk = todayKey();
    const today = (state.endoTriggerLog && state.endoTriggerLog[tk]) || { food: [], stress: 0, activity: '', cycle: '' };
    const FOODS = ['gluten', 'dairy', 'red meat', 'processed', 'alcohol', 'caffeine', 'sugar', 'soy'];
    const setField = (k, v) => setState(s => ({
      ...s,
      endoTriggerLog: { ...(s.endoTriggerLog || {}), [tk]: { ...((s.endoTriggerLog || {})[tk] || {}), [k]: v } },
    }));
    const toggleFood = (f) => {
      const cur = today.food || [];
      setField('food', cur.includes(f) ? cur.filter(x => x !== f) : [...cur, f]);
    };
    return (
      <div>
        <MHeader eyebrow="F112 · TRIGGERS" title={<>What <span style={{ color: 'var(--eucalyptus)' }}>preceded</span> today's flare?</>} sub="After 30 days, the correlation engine surfaces patterns." />
        <MSection title="FOOD TRIGGERS">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {FOODS.map(f => {
              const on = (today.food || []).includes(f);
              return (
                <button key={f} onClick={() => toggleFood(f)}
                  style={{ padding: '8px 14px', borderRadius: 999, border: '1px solid var(--border)', background: on ? 'var(--coral)' : 'var(--surface)', color: on ? '#fff' : 'inherit', fontSize: 12, cursor: 'pointer' }}>{f}</button>
              );
            })}
          </div>
        </MSection>
        <MSection title="STRESS LEVEL (0-10)">
          <div className="card" style={{ padding: 12 }}>
            <NRS value={today.stress} onChange={v => setField('stress', v)} />
          </div>
        </MSection>
        <MSection title="ACTIVITY">
          <input type="text" placeholder="e.g. 30min walk, gym, none" value={today.activity || ''} onChange={e => setField('activity', e.target.value)} style={{ width: '100%' }} />
        </MSection>
        <MSection title="CYCLE / OTHER">
          <input type="text" placeholder="e.g. day 1 of period, ovulation" value={today.cycle || ''} onChange={e => setField('cycle', e.target.value)} style={{ width: '100%' }} />
        </MSection>
      </div>
    );
  };

  // ============================================================
  // F113 — PFPT Log
  // ============================================================
  M.endoPfpt = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const sessions = state.endoPfptLog || [];
    const [showForm, setShowForm] = useM(false);
    const [draft, setDraft] = useM({ date: todayKey(), therapist: '', intervention: '', postSessionPainDelta: 0, homeExercises: 'partial', notes: '' });
    const save = () => {
      setState(s => ({ ...s, endoPfptLog: [...(s.endoPfptLog || []), { ...draft, addedAt: Date.now() }] }));
      setShowForm(false);
      setDraft({ date: todayKey(), therapist: '', intervention: '', postSessionPainDelta: 0, homeExercises: 'partial', notes: '' });
    };
    // 8-week response trend: average pain delta last 8 weeks
    const eightWeeks = sessions.filter(s => Date.now() - new Date(s.date).getTime() < 56 * 86400000);
    const avgDelta = eightWeeks.length ? (eightWeeks.reduce((a, s) => a + (s.postSessionPainDelta || 0), 0) / eightWeeks.length).toFixed(1) : null;
    return (
      <div>
        <MHeader eyebrow="F113 · PFPT LOG" title={<>Pelvic floor <span style={{ color: 'var(--eucalyptus)' }}>physiotherapy.</span></>} sub="70% of endo patients have PFD. RCT-evidenced for endo-related pelvic pain." />
        {avgDelta != null && (
          <div className="card-mint" style={{ padding: 12, marginBottom: 12 }}>
            <div className="eyebrow" style={{ marginBottom: 4 }}>8-WEEK RESPONSE</div>
            <div className="data" style={{ fontSize: 18, color: avgDelta < 0 ? 'var(--eucalyptus)' : 'var(--severity-mod)' }}>{avgDelta > 0 ? '+' : ''}{avgDelta} NRS · post-session</div>
          </div>
        )}
        <button className="btn-soft" style={{ width: '100%', marginBottom: 12 }} onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Log session'}</button>
        {showForm && (
          <div className="card-warm" style={{ padding: 14, marginBottom: 14 }}>
            <input type="date" value={draft.date} onChange={e => setDraft({ ...draft, date: e.target.value })} style={{ marginBottom: 8 }} />
            <input type="text" placeholder="Therapist" value={draft.therapist} onChange={e => setDraft({ ...draft, therapist: e.target.value })} style={{ width: '100%', marginBottom: 8 }} />
            <input type="text" placeholder="Intervention focus" value={draft.intervention} onChange={e => setDraft({ ...draft, intervention: e.target.value })} style={{ width: '100%', marginBottom: 8 }} />
            <div className="caption" style={{ marginBottom: 4 }}>Post-session pain delta (-10 = much better, +10 = much worse)</div>
            <input type="number" min="-10" max="10" value={draft.postSessionPainDelta} onChange={e => setDraft({ ...draft, postSessionPainDelta: +e.target.value })} style={{ marginBottom: 8 }} />
            <select value={draft.homeExercises} onChange={e => setDraft({ ...draft, homeExercises: e.target.value })} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)', marginBottom: 8 }}>
              <option value="yes">Home exercises: yes</option>
              <option value="partial">Home exercises: partial</option>
              <option value="no">Home exercises: no</option>
            </select>
            <button className="btn-primary" style={{ width: '100%' }} onClick={save}>Save session</button>
          </div>
        )}
        {sessions.length === 0 && <div className="card" style={{ padding: 18, textAlign: 'center' }}><div className="caption" style={{ fontSize: 12 }}>No PFPT sessions yet.</div></div>}
        {sessions.slice().reverse().map((s, i) => (
          <div key={i} className="card-warm" style={{ padding: 12, marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{s.intervention || 'PFPT session'}</div>
              <div className="caption" style={{ fontSize: 11 }}>{dateLabel(s.date)}</div>
            </div>
            <div className="caption" style={{ fontSize: 11, marginTop: 2 }}>{s.therapist || '—'} · pain Δ {s.postSessionPainDelta > 0 ? '+' : ''}{s.postSessionPainDelta}</div>
          </div>
        ))}
      </div>
    );
  };

  // ============================================================
  // F114 — Adolescent Mode
  // ============================================================
  M.endoAdolescent = ({ state }) => {
    const adultMode = state.adultMode !== false;
    const verifiedMinor = state.verifiedMinor === true;
    const enabled = adultMode === false && verifiedMinor;

    if (!enabled) {
      return (
        <div>
          <MHeader eyebrow="F114 · ADOLESCENT MODE" title={<>Designed for <span style={{ color: 'var(--eucalyptus)' }}>under-18</span> users.</>} sub="Activated only when adult mode is off AND minor status is verified." />
          <div className="card-warm" style={{ padding: 18 }}>
            <p className="body" style={{ fontSize: 13, marginBottom: 8 }}>
              Adolescent mode is currently <strong>{adultMode ? 'inactive (adult mode is on)' : verifiedMinor ? 'ready' : 'pending — minor status not yet verified'}</strong>.
            </p>
            <p className="caption" style={{ fontSize: 12 }}>
              When active, the body map simplifies to 6 zones, dyspareunia is hidden by default, school absence tracking appears in the daily log, and language shifts to plain description ("period pain" not "dysmenorrhea").
            </p>
          </div>
        </div>
      );
    }

    const { setState } = window.HQ.useApp();
    const tk = todayKey();
    const today = (state.endoDailyLog && state.endoDailyLog[tk]) || {};
    const setField = (k, v) => setState(s => ({
      ...s,
      endoDailyLog: { ...(s.endoDailyLog || {}), [tk]: { ...((s.endoDailyLog || {})[tk] || {}), [k]: v } },
    }));
    return (
      <div>
        <MHeader eyebrow="F114 · ADOLESCENT MODE" title={<>Made for <span style={{ color: 'var(--eucalyptus)' }}>you.</span></>} sub="You're not alone — endo often starts in adolescence and takes years to diagnose. Your symptoms deserve to be taken seriously." />
        <div className="card" style={{ padding: 12, marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>How bad is your period pain today? (0-10)</div>
          <NRS value={today.dysmenorrhea_nrs} onChange={v => setField('dysmenorrhea_nrs', v)} />
        </div>
        <div className="card" style={{ padding: 12, marginBottom: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Bowel pain when going to the toilet</div>
          <NRS value={today.dyschezia_nrs} onChange={v => setField('dyschezia_nrs', v)} />
        </div>
        <ToggleRow label="Did symptoms keep you from school today?" checked={!!today.school_missed} onChange={v => setField('school_missed', v)} sub="School attendance is highly relevant for adolescent endo specialists." />
        {today.school_missed && (
          <div className="card" style={{ padding: 12, marginTop: 6 }}>
            <div className="caption" style={{ marginBottom: 4 }}>Hours of school missed</div>
            <input type="number" min="0" max="8" value={today.school_hours_missed || ''} onChange={e => setField('school_hours_missed', +e.target.value)} style={{ width: '100%' }} />
          </div>
        )}
        <div className="card-mint" style={{ padding: 12, marginTop: 12 }}>
          <p className="body" style={{ fontSize: 12 }}>Adult health questions (sex pain, sexual relationships) are hidden by default. You can turn them on from settings if relevant.</p>
        </div>
      </div>
    );
  };

  // ============================================================
  // F115 — Endometrioma Trend
  // ============================================================
  M.endoEndometriomaTrend = ({ state }) => {
    const imaging = (state.endoImagingVault || []).filter(x => x.endometriomaSizes && (x.endometriomaSizes.right || x.endometriomaSizes.left));
    const sorted = imaging.slice().sort((a, b) => new Date(a.date) - new Date(b.date));
    const right = sorted.map(x => x.endometriomaSizes.right || null).filter(Boolean);
    const left = sorted.map(x => x.endometriomaSizes.left || null).filter(Boolean);

    // Detect growth >5mm in any 6-month period
    const detectGrowth = (arr, dates) => {
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          const monthsApart = (new Date(dates[j]) - new Date(dates[i])) / (30 * 86400000);
          if (monthsApart <= 6 && (arr[j] - arr[i]) > 5) return true;
        }
      }
      return false;
    };
    const rightDates = sorted.filter(x => x.endometriomaSizes.right).map(x => x.date);
    const leftDates = sorted.filter(x => x.endometriomaSizes.left).map(x => x.date);
    const rightGrew = detectGrowth(right, rightDates);
    const leftGrew = detectGrowth(left, leftDates);

    return (
      <div>
        <MHeader eyebrow="F115 · ENDOMETRIOMA TREND" title={<>Size <span style={{ color: 'var(--eucalyptus)' }}>over time.</span></>} sub="Growth >5mm in 6 months → discuss with specialist. >4cm may affect ovarian reserve." />
        {sorted.length === 0 ? (
          <div className="card" style={{ padding: 18, textAlign: 'center' }}>
            <div className="caption" style={{ fontSize: 12 }}>No endometrioma measurements logged. Add imaging in F107 to track over time.</div>
          </div>
        ) : (
          <>
            {right.length >= 1 && (
              <div className="card-warm" style={{ padding: 14, marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Right ovary</span>
                  <span className="data" style={{ fontSize: 13 }}>latest {right[right.length - 1]}mm</span>
                </div>
                {right.length >= 2 && <Spark data={right} color="var(--eucalyptus)" />}
                {rightGrew && <div className="caption" style={{ fontSize: 11, color: 'var(--coral)', marginTop: 6 }}>⚠ Growth &gt;5mm in 6 months — discuss with your specialist.</div>}
                {right[right.length - 1] >= 40 && <div className="caption" style={{ fontSize: 11, color: 'var(--severity-mod)', marginTop: 4 }}>≥4cm — surgical evaluation often considered.</div>}
              </div>
            )}
            {left.length >= 1 && (
              <div className="card-warm" style={{ padding: 14, marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>Left ovary</span>
                  <span className="data" style={{ fontSize: 13 }}>latest {left[left.length - 1]}mm</span>
                </div>
                {left.length >= 2 && <Spark data={left} color="var(--coral)" />}
                {leftGrew && <div className="caption" style={{ fontSize: 11, color: 'var(--coral)', marginTop: 6 }}>⚠ Growth &gt;5mm in 6 months — discuss with your specialist.</div>}
                {left[left.length - 1] >= 40 && <div className="caption" style={{ fontSize: 11, color: 'var(--severity-mod)', marginTop: 4 }}>≥4cm — surgical evaluation often considered.</div>}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  // ============================================================
  // F116 — Low-FODMAP / Anti-inflammatory Tracker
  // ============================================================
  M.endoFodmap = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const tk = todayKey();
    const today = (state.endoFodmapLog && state.endoFodmapLog[tk]) || { phase: 'elimination', items: [] };
    const [newFood, setNewFood] = useM('');
    const [newSeverity, setNewSeverity] = useM(0);
    const setPhase = (p) => setState(s => ({
      ...s,
      endoFodmapLog: { ...(s.endoFodmapLog || {}), [tk]: { ...((s.endoFodmapLog || {})[tk] || { items: [] }), phase: p } },
    }));
    const addItem = () => {
      if (!newFood) return;
      setState(s => {
        const cur = (s.endoFodmapLog && s.endoFodmapLog[tk]) || { phase: 'elimination', items: [] };
        return {
          ...s,
          endoFodmapLog: { ...(s.endoFodmapLog || {}), [tk]: { ...cur, items: [...(cur.items || []), { food: newFood, severity: newSeverity }] } },
        };
      });
      setNewFood('');
      setNewSeverity(0);
    };
    const PHASES = [
      { v: 'elimination', l: 'Elimination', d: 'Weeks 1-4: cut high-FODMAP foods' },
      { v: 'reintroduction', l: 'Reintroduction', d: 'Weeks 5-8: test foods one at a time' },
      { v: 'personalization', l: 'Personalization', d: 'Long-term: keep tolerable foods, avoid triggers' },
    ];
    return (
      <div>
        <MHeader eyebrow="F116 · LOW-FODMAP" title={<>8-week <span style={{ color: 'var(--eucalyptus)' }}>protocol.</span></>} sub="2024 RCT: 60% GI response (vs 26% control) in endo." />
        <MSection title="CURRENT PHASE">
          {PHASES.map(p => (
            <div key={p.v}
              className={today.phase === p.v ? 'card-warm' : 'card'}
              style={{ padding: 12, marginBottom: 6, cursor: 'pointer', borderLeft: today.phase === p.v ? '3px solid var(--eucalyptus)' : '1px solid var(--border)' }}
              onClick={() => setPhase(p.v)}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{p.l}</div>
              <div className="caption" style={{ fontSize: 11 }}>{p.d}</div>
            </div>
          ))}
        </MSection>
        <MSection title="LOG FOOD ITEM TODAY">
          <div className="card-warm" style={{ padding: 12 }}>
            <input type="text" placeholder="Food item" value={newFood} onChange={e => setNewFood(e.target.value)} style={{ width: '100%', marginBottom: 8 }} />
            <div className="caption" style={{ marginBottom: 4 }}>Reaction severity (0-5)</div>
            <Severity value={newSeverity} onChange={setNewSeverity} max={5} />
            <button className="btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={addItem}>+ Add item</button>
          </div>
        </MSection>
        <MSection title="TODAY'S ITEMS">
          {(today.items || []).length === 0 ? (
            <div className="caption" style={{ fontSize: 12, padding: 12 }}>None logged yet today.</div>
          ) : (today.items || []).map((it, i) => (
            <div key={i} className="card" style={{ padding: 10, marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13 }}>{it.food}</span>
              <span className="data" style={{ fontSize: 12, color: sevColor(it.severity * 2) }}>{it.severity}/5</span>
            </div>
          ))}
        </MSection>
      </div>
    );
  };

  // ============================================================
  // F117 — Cycle-GI Correlation Insight Engine
  // ============================================================
  M.endoCycleGI = ({ state }) => {
    const dailyLog = state.endoDailyLog || {};
    const bowelLog = state.endoBowelLog || {};
    // Need 3 cycles of data (~84 days)
    const dailyKeys = Object.keys(dailyLog);
    const cycleLen = state.cycleLen || 28;
    const haveEnough = dailyKeys.length >= cycleLen * 3;

    if (!haveEnough) {
      return (
        <div>
          <MHeader eyebrow="F117 · CYCLE-GI CORRELATION" title={<>Need <span style={{ color: 'var(--eucalyptus)' }}>3 cycles</span> of data.</>} sub="Algorithm needs ~84 days of GI + cycle logs to compute meaningfully." />
          <div className="card-warm" style={{ padding: 18 }}>
            <p className="body" style={{ fontSize: 13, marginBottom: 8 }}>You have <strong>{dailyKeys.length}</strong> days logged. Keep logging — once you cross 84 days, this screen will compute whether your bowel symptoms cluster around your period.</p>
            <div style={{ height: 6, background: 'var(--mint-mist)', borderRadius: 999, marginTop: 12 }}>
              <div style={{ width: `${Math.min(100, (dailyKeys.length / (cycleLen * 3)) * 100)}%`, height: '100%', background: 'var(--eucalyptus)', borderRadius: 999 }} />
            </div>
          </div>
        </div>
      );
    }

    // Compute menstrual-phase mean vs non-menstrual-phase mean
    const phaseMeans = (key, source) => {
      const menstrual = [], other = [];
      dailyKeys.forEach(d => {
        const entry = source === 'bowel' ? bowelLog[d] : dailyLog[d];
        if (!entry) return;
        const v = entry[key];
        if (typeof v !== 'number') return;
        const phase = dailyLog[d]?.cyclePhase;
        if (phase === 'menstrual' || phase === 'M') menstrual.push(v); else other.push(v);
      });
      const avg = arr => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
      return { menstrualMean: avg(menstrual), otherMean: avg(other), n: menstrual.length };
    };

    const metrics = [
      { k: 'bloating_severity', l: 'Bloating', source: 'bowel' },
      { k: 'gi_pain_severity', l: 'GI pain', source: 'bowel' },
      { k: 'dyschezia_nrs', l: 'Dyschezia', source: 'daily' },
    ];

    const results = metrics.map(m => {
      const r = phaseMeans(m.k, m.source);
      const elevated = r.otherMean > 0 && (r.menstrualMean / r.otherMean) >= 1.3;
      return { ...m, ...r, elevated };
    });
    const anyElevated = results.some(r => r.elevated);

    return (
      <div>
        <MHeader eyebrow="F117 · CYCLE-GI CORRELATION" title={<>{anyElevated ? 'Endo-like pattern' : 'IBS-like pattern'} <span style={{ color: 'var(--eucalyptus)' }}>detected.</span></>} sub="Menstrual-phase mean vs non-menstrual-phase mean per GI metric." />
        {results.map(r => (
          <div key={r.k} className="card" style={{ padding: 12, marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{r.l}</span>
              <span className="data" style={{ fontSize: 12, color: r.elevated ? 'var(--coral)' : 'var(--ink-2)' }}>{r.elevated ? 'menstrually-linked' : 'stable'}</span>
            </div>
            <div className="caption" style={{ fontSize: 11 }}>menstrual {r.menstrualMean.toFixed(1)} · other {r.otherMean.toFixed(1)} · n={r.n}</div>
          </div>
        ))}
        <div className="card-mint" style={{ padding: 14, marginTop: 12 }}>
          <p className="body" style={{ fontSize: 13 }}>
            {anyElevated
              ? 'Your bowel symptoms appear significantly worse during your period. Bowel pain that follows the menstrual cycle can indicate endometriosis affecting the bowel area. This pattern is worth showing your doctor.'
              : 'Your bowel symptoms do not cluster around your period in this dataset. Symptoms that worsen with stress or certain foods (and are not cycle-linked) are more typical of IBS.'}
          </p>
        </div>
        <div className="caption" style={{ fontSize: 11, marginTop: 12, lineHeight: 1.5 }}>
          This is an observation from your logs, not a diagnosis. Your doctor can interpret it in context.
        </div>
      </div>
    );
  };

  // ============================================================
  // F118 — NSAID Overuse Detection
  // ============================================================
  M.endoNsaidOveruse = ({ state }) => {
    const dailyLog = state.endoDailyLog || {};
    const keys = Object.keys(dailyLog).sort().reverse();
    const last30 = keys.slice(0, 30);
    const nsaidDays = last30.filter(k => dailyLog[k].nsaid_taken).length;
    const totalLogged = last30.length;
    const pct = totalLogged ? Math.round((nsaidDays / totalLogged) * 100) : 0;
    const tier = pct >= 75 ? 'HIGH' : pct >= 50 ? 'MODERATE' : null;
    const TIER_COLOR = { HIGH: 'var(--severity-severe)', MODERATE: 'var(--severity-mod)' };

    return (
      <div>
        <MHeader eyebrow="F118 · NSAID OVERUSE" title={<>{pct}% of <span style={{ color: tier ? TIER_COLOR[tier] : 'var(--eucalyptus)' }}>30 days.</span></>} sub="50% threshold = MODERATE risk · 75% = HIGH risk." />
        <div className="card-warm" style={{ padding: 14, marginBottom: 14 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <Stat label="NSAID days" value={String(nsaidDays)} sub={`of ${totalLogged} logged`} />
            <Stat label="Use rate" value={`${pct}%`} color={tier ? TIER_COLOR[tier] : undefined} sub="trailing 30d" />
          </div>
          <div style={{ height: 6, background: 'var(--mint-mist)', borderRadius: 999 }}>
            <div style={{ width: `${pct}%`, height: '100%', background: tier ? TIER_COLOR[tier] : 'var(--eucalyptus)', borderRadius: 999 }} />
          </div>
        </div>
        {tier && (
          <div className="card" style={{ padding: 14, marginBottom: 12, borderLeft: `3px solid ${TIER_COLOR[tier]}` }}>
            <div className="eyebrow" style={{ marginBottom: 4, color: TIER_COLOR[tier] }}>{tier} RISK</div>
            <p className="body" style={{ fontSize: 13 }}>
              You've been using pain relief on more than {tier === 'HIGH' ? '75%' : 'half'} your logged days. Long-term frequent NSAID use can affect your kidneys, stomach, and cardiovascular health. Your provider can discuss other pain-management options that may be more suitable for regular use.
            </p>
          </div>
        )}
        {!tier && totalLogged > 0 && (
          <div className="card-mint" style={{ padding: 12 }}>
            <p className="body" style={{ fontSize: 13 }}>Use rate is below the alert threshold. Keep logging — this monitor runs continuously.</p>
          </div>
        )}
      </div>
    );
  };

  // ============================================================
  // F119 — Staging Display (rASRM + #ENZIAN)
  // ============================================================
  M.endoStaging = ({ state }) => {
    const surgeries = state.endoSurgicalHistory || [];
    const staged = surgeries.find(s => s.rasrm_stage);
    const stageLabel = { 1: 'Stage I (Minimal)', 2: 'Stage II (Mild)', 3: 'Stage III (Moderate)', 4: 'Stage IV (Severe)' };
    const ENZIAN_COPY = {
      P: 'Endometriosis on the membrane lining the abdomen',
      O: 'Endometriosis on or in the ovaries (chocolate cysts)',
      B: 'Endometriosis near the vagina or cervix',
      C: 'Endometriosis in the recto-vaginal septum',
      D: 'Endometriosis affecting the bowel/intestines',
      A: 'Adenomyosis findings',
    };

    if (!staged) {
      return (
        <div>
          <MHeader eyebrow="F119 · STAGING" title={<>No staging <span style={{ color: 'var(--eucalyptus)' }}>recorded.</span></>} sub="Add a surgery in F105 with rASRM stage and/or #ENZIAN to display here." />
          <div className="card-warm" style={{ padding: 14, borderLeft: '3px solid var(--eucalyptus)' }}>
            <div className="eyebrow" style={{ marginBottom: 4 }}>ESHRE 2022 NOTE</div>
            <p className="body" style={{ fontSize: 12 }}>ESHRE now accepts empirical clinical diagnosis — laparoscopy is no longer required to diagnose endometriosis in patients with a classical symptom presentation. You can pursue clinical diagnosis without demanding surgery.</p>
          </div>
        </div>
      );
    }
    return (
      <div>
        <MHeader eyebrow="F119 · STAGING" title={<>{stageLabel[staged.rasrm_stage]} <span style={{ color: 'var(--eucalyptus)' }}>recorded.</span></>} sub={`Surgery: ${dateLabel(staged.date)}`} />
        <div className="card-warm" style={{ padding: 14, marginBottom: 12, borderLeft: '3px solid var(--coral)' }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>IMPORTANT CONTEXT</div>
          <p className="body" style={{ fontSize: 12 }}>
            <strong>The stage describes anatomy, not your pain or function.</strong> rASRM staging does not predict how much pain or disability you experience. Stage I patients frequently report more severe pain than Stage IV patients. Your symptom log is a more accurate measure of your daily experience.
          </p>
        </div>
        <MSection title="#ENZIAN COMPARTMENTS">
          {Object.keys(ENZIAN_COPY).map(k => {
            const v = staged.enzian?.[k];
            return (
              <div key={k} className="card" style={{ padding: 12, marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <span className="data" style={{ fontSize: 14 }}>{k}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{v || '—'}</span>
                </div>
                <div className="caption" style={{ fontSize: 11 }}>{ENZIAN_COPY[k]}</div>
              </div>
            );
          })}
        </MSection>
      </div>
    );
  };

  // ============================================================
  // F120 — Multi-format Export
  // ============================================================
  M.endoExportFormats = ({ state }) => {
    const onPDF = () => {
      // Reuse the F109 generator
      if (window.HQ_MODULES?.endoPhysicianReport) {
        // Trigger the same render path: run the PDF generator directly
        const onb = state.endoOnboarding || {};
        const dailyLogKeys = Object.keys(state.endoDailyLog || {}).sort();
        const reportRange = `${dailyLogKeys[0] || '—'} → ${dailyLogKeys[dailyLogKeys.length - 1] || '—'}`;
        if (!window.HQ?.generatePDF) { alert('PDF generator not loaded.'); return; }
        const phq9All = Object.values(state.endoPhq9Log || {});
        const lastPhq = phq9All.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))[0];
        window.HQ.generatePDF({
          title: 'Endometriosis Patient Report',
          subtitle: `Period: ${reportRange}`,
          sections: [
            { heading: 'Patient Summary', lines: [
              { kind: 'kv', key: 'Diagnosis status', value: onb.diagnosisStatus || '—' },
              { kind: 'kv', key: 'Treatment', value: onb.currentTreatment || '—' },
            ] },
            { heading: 'PHQ-9 Latest', lines: [lastPhq ? `Score ${lastPhq.total}/27 · ${lastPhq.severity}` : 'Not completed'] },
          ],
          filename: `hormonaiq-endo-export-${todayKey()}.pdf`,
        });
      }
    };
    const onCSV = () => {
      const dailyLog = state.endoDailyLog || {};
      const keys = Object.keys(dailyLog).sort().slice(-90);
      const headers = ['date', 'dysmenorrhea', 'cpp', 'dyschezia', 'dysuria', 'dyspareunia', 'fatigue', 'brainfog', 'sleep', 'cyclePhase'];
      const rows = keys.map(k => {
        const d = dailyLog[k];
        return [k, d.dysmenorrhea_nrs ?? '', d.cpp_nrs ?? '', d.dyschezia_nrs ?? '', d.dysuria_nrs ?? '', d.dyspareunia_nrs ?? '', d.fatigue_nrs ?? '', d.brain_fog_nrs ?? '', d.sleep_quality_nrs ?? '', d.cyclePhase || ''].join(',');
      });
      const csv = [headers.join(','), ...rows].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `hormonaiq-endo-90d-${todayKey()}.csv`; a.click();
      URL.revokeObjectURL(url);
    };
    const onShareLink = () => {
      // Generate data URI as a simple, immediate share format (real impl would be a server-issued time-limited link)
      const summary = {
        generatedAt: new Date().toISOString(),
        diagnosisStatus: state.endoOnboarding?.diagnosisStatus,
        recentDays: Object.keys(state.endoDailyLog || {}).slice(-30).length,
        latestPHQ9: Object.values(state.endoPhq9Log || {}).pop()?.total,
        latestEHP5: Object.values(state.endoEhp5Log || {}).pop()?.total,
      };
      const json = JSON.stringify(summary, null, 2);
      const dataUri = 'data:application/json;base64,' + btoa(unescape(encodeURIComponent(json)));
      navigator.clipboard?.writeText(dataUri);
      alert('Shareable data URI copied to clipboard. Real implementation will issue a 7-day signed URL.');
    };

    return (
      <div>
        <MHeader eyebrow="F120 · EXPORT FORMATS" title={<>How would you like to <span style={{ color: 'var(--eucalyptus)' }}>send it?</span></>} sub="PDF for clinicians · CSV for EHRs · share-link for quick access." />
        <button className="btn-primary" style={{ width: '100%', marginBottom: 8 }} onClick={onPDF}>⤓ Download PDF</button>
        <button className="btn-soft" style={{ width: '100%', marginBottom: 8 }} onClick={onCSV}>⤓ Download CSV (last 90 days)</button>
        <button className="btn-soft" style={{ width: '100%', marginBottom: 8 }} onClick={onShareLink}>⤓ Copy shareable link</button>
        <div className="caption" style={{ fontSize: 11, marginTop: 12, lineHeight: 1.5 }}>
          PDF and CSV are generated entirely on-device. The shareable link prototype encodes a summary as a data URI; in production this becomes a 7-day signed URL.
        </div>
      </div>
    );
  };

  // ============================================================
  // F121 — Research Export (Opt-in)
  // ============================================================
  M.endoResearchExport = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const [optedIn, setOptedIn] = useM(!!state.endoResearchOptIn);
    const persist = (v) => {
      setOptedIn(v);
      setState(s => ({ ...s, endoResearchOptIn: v, endoResearchOptInAt: v ? new Date().toISOString() : null }));
    };
    const dump = () => {
      if (!optedIn) { alert('You must opt in first.'); return; }
      // Anonymize: strip identifiers
      const yob = state.yearOfBirth ? Math.floor(state.yearOfBirth / 5) * 5 : null;
      const payload = {
        anonId: 'anon-' + Math.random().toString(36).slice(2, 10),
        ageBand: yob ? `${yob}-${yob + 4}` : null,
        country: state.country || null,
        diagnosisStatus: state.endoOnboarding?.diagnosisStatus,
        comorbidities: state.endoOnboarding?.comorbidities,
        dailyLogDays: Object.keys(state.endoDailyLog || {}).length,
        instruments: {
          phq9: Object.values(state.endoPhq9Log || {}).map(p => ({ total: p.total, severity: p.severity })),
          gad7: Object.values(state.endoGad7Log || {}).map(p => ({ total: p.total, severity: p.severity })),
          ehp5: Object.values(state.endoEhp5Log || {}).map(p => ({ total: p.total })),
        },
        exportedAt: new Date().toISOString(),
      };
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = `hormonaiq-research-${payload.anonId}.json`; a.click();
      URL.revokeObjectURL(url);
    };
    return (
      <div>
        <MHeader eyebrow="F121 · RESEARCH EXPORT" title={<>Anonymized, <span style={{ color: 'var(--eucalyptus)' }}>opt-in.</span></>} sub="Compatible with Phendo (Columbia) and similar academic initiatives. Never default-on." />
        <div className="card-warm" style={{ padding: 14, marginBottom: 14 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>WHAT WOULD BE SHARED</div>
          <ul style={{ paddingLeft: 18, fontSize: 12, lineHeight: 1.6 }}>
            <li>Random anonymous ID (no name/email)</li>
            <li>5-year age band (not exact birth year)</li>
            <li>Country only (not city / postcode)</li>
            <li>Diagnosis status + comorbidity flags</li>
            <li>Number of daily logs · instrument totals (PHQ-9, GAD-7, EHP-5)</li>
          </ul>
          <div className="caption" style={{ fontSize: 11, marginTop: 8 }}>You can withdraw consent and request deletion at any time.</div>
        </div>
        <ToggleRow label="I opt in to anonymized research data export" checked={optedIn} onChange={persist} sub="Off by default. You see exactly what would be shared." />
        <button className="btn-soft" style={{ width: '100%', marginTop: 12 }} disabled={!optedIn} onClick={dump}>⤓ Download anonymized JSON</button>
        <div className="caption" style={{ fontSize: 11, marginTop: 12, lineHeight: 1.5 }}>
          Production launch requires IRB-reviewed data sharing agreement, GDPR + HIPAA compliance, and named research partners (no generic third parties).
        </div>
      </div>
    );
  };

  Object.assign(window.HQ_MODULES = window.HQ_MODULES || {}, M);
})();
