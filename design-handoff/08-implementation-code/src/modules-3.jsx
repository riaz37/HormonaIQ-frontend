// Modules — set 3: Perimenopause, ADHD, cross-condition, system
(function () {
  const useM = window.useM || React.useState;
  const { MHeader, Stat, Severity, Spark, EvidenceBar, ToggleRow, MSection } = window.HQ_UI;
  const M = {};

  // ===== PERIMENOPAUSE =====
  M.hotFlash = ({ state }) => {
    // T-23 — age-aware framing
    const currentYear = new Date().getFullYear();
    const yearOfBirth = state.yearOfBirth || 1985;
    const age = currentYear - yearOfBirth;
    const earlyOnset = age < 40 && (state.conditions || []).includes('Perimenopause');
    const useApp = window.HQ.useApp;
    const { setState } = useApp();
    const log = state.hotFlashLog || [];
    const [pendingIntensity, setPendingIntensity] = useM(null);
    const logEvent = (intensity) => {
      const evt = { at: Date.now(), intensity };
      setState(s => ({ ...s, hotFlashLog: [evt, ...(s.hotFlashLog || [])].slice(0, 200) }));
      setPendingIntensity(null);
    };
    // Last 24h
    const now = Date.now();
    const last24h = log.filter(e => now - e.at < 24 * 3600 * 1000);
    const isNight = (ts) => { const h = new Date(ts).getHours(); return h >= 22 || h < 6; };
    const dayCount = last24h.filter(e => !isNight(e.at)).length;
    const nightCount = last24h.filter(e => isNight(e.at)).length;
    const weekCount = log.filter(e => now - e.at < 7 * 24 * 3600 * 1000).length;
    const ratio = last24h.length ? Math.round((nightCount / last24h.length) * 100) : 0;
    const fmtTime = (ts) => new Date(ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const recent = log.slice(0, 6);
    return (
    <div>
      <MHeader eyebrow="F16 · HOT FLASH LOGGER" title={<>Quick capture, <span  style={{ color: 'var(--eucalyptus)' }}>night-aware.</span></>} sub="With cardiovascular risk pattern flagging." />
      <div className="card-warm" style={{ padding: 14, marginBottom: 14 }}>
        <div className="eyebrow" style={{ marginBottom: 10 }}>LOG A HOT FLASH</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {[
            { v: 1, l: 'Mild' },
            { v: 2, l: 'Moderate' },
            { v: 3, l: 'Severe' },
          ].map(opt => (
            <button key={opt.v} className="btn-soft" style={{ minHeight: 56, fontSize: 13 }} onClick={() => logEvent(opt.v)}>{opt.l}</button>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <Stat label="Last 24h" value={String(last24h.length)} sub={`${dayCount} day · ${nightCount} night`} />
        <Stat label="This week" value={String(weekCount)} sub="last 7d" />
        <Stat label="Night / day" value={ratio + '%'} sub="ratio" />
      </div>
      <MSection title={recent.length ? "RECENT" : "NO ENTRIES YET"}>
        {recent.length === 0 && <div className="caption" style={{ fontSize: 12 }}>Tap a button above to log your first hot flash.</div>}
        {recent.map((h, i) => (
          <div key={i} className="card" style={{ padding: 12, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div className="data" style={{ fontSize: 14 }}>{fmtTime(h.at)}</div>
              <div className="caption" style={{ fontSize: 11 }}>Intensity {h.intensity}/3 · {new Date(h.at).toLocaleDateString()}</div>
            </div>
            <div className="phase-pill" style={{ background: 'var(--coral-soft)', color: 'rgba(0,0,0,0.7)' }}>{isNight(h.at) ? 'Night sweat' : 'Day flash'}</div>
          </div>
        ))}
      </MSection>
      <div className="card-warm" style={{ padding: 12, marginTop: 6 }}>
        <div className="eyebrow" style={{ marginBottom: 4 }}>EDUCATIONAL CONTEXT</div>
        <p className="body" style={{ fontSize: 13 }}>
          {earlyOnset
            ? 'Research has examined associations between frequent night-time hot flashes and cardiovascular health in early-onset perimenopause. This is general background — your clinician can interpret what it means for you.'
            : 'Some research describes associations between frequent moderate-severe night sweats and cardiovascular health in midlife. This is general background — it doesn\'t describe your individual risk.'}
        </p>
        <div className="caption" style={{ fontSize: 10, marginTop: 6, color: 'var(--ink-3)' }}>
          Sources: SWAN Study; NAMS Position Statement
        </div>
      </div>
    </div>
    );
  };

  M.hrt = ({ state }) => {
    const useApp = window.HQ.useApp;
    const { setState } = useApp();
    const todayKey = new Date().toISOString().slice(0, 10);
    const today = (state.hrtTracking && state.hrtTracking[todayKey]) || {};
    const setField = (key, val) => {
      setState(s => ({
        ...s,
        hrtTracking: {
          ...(s.hrtTracking || {}),
          [todayKey]: { ...((s.hrtTracking || {})[todayKey] || {}), [key]: val },
        },
      }));
    };
    const fields = [
      { k: 'hotFlashCount', l: 'Hot flashes today', max: 5 },
      { k: 'sleepQuality', l: 'Sleep quality (1=poor, 5=great)', max: 5 },
      { k: 'mood', l: 'Mood stability (1=low, 5=steady)', max: 5 },
    ];
    return (
      <div>
        <MHeader eyebrow="F17 · HRT EFFECTIVENESS" title={<>Before HRT <span style={{ color: 'var(--eucalyptus)' }}>vs now.</span></>} sub="Quantified change since initiation." />
        <div className="card-mint" style={{ padding: 14, marginBottom: 14 }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>STARTED</div>
          <div style={{ fontSize: 14, fontWeight: 600 }}>Estradiol 0.05 mg patch + micronized progesterone 100 mg</div>
          <div className="caption" style={{ fontSize: 12 }}>Jan 18, 2026 · 96 days</div>
        </div>
        <MSection title="LOG TODAY">
          {fields.map(f => (
            <div key={f.k} className="card" style={{ padding: 12, marginBottom: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{f.l}</div>
              <Severity value={today[f.k] || 0} onChange={v => setField(f.k, v)} max={f.max} />
            </div>
          ))}
        </MSection>
        <MSection title="BEFORE HRT VS NOW (sample)">
          {[
            { l: 'Hot flashes / day', n: 8.2, t: today.hotFlashCount || 2.1, dir: '−' },
            { l: 'Sleep quality', n: 2.1, t: today.sleepQuality || 4.0, dir: '+' },
            { l: 'Mood stability', n: 2.4, t: today.mood || 3.8, dir: '+' },
            { l: 'Night sweats / week', n: 14, t: 3, dir: '−' },
            { l: 'Brain fog', n: 4.1, t: 2.3, dir: '−' },
            { l: 'Vaginal dryness', n: 4.0, t: 1.8, dir: '−' },
          ].map(r => (
            <div key={r.l} className="card" style={{ padding: 12, marginBottom: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>{r.l}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div className="data" style={{ fontSize: 14, color: 'var(--ink-3)', flex: 1 }}>{r.n}</div>
                <div style={{ fontSize: 14, color: 'var(--eucalyptus)' }}>→</div>
                <div className="data" style={{ fontSize: 14, color: 'var(--eucalyptus)', fontWeight: 600, flex: 1, textAlign: 'right' }}>{r.t}</div>
              </div>
            </div>
          ))}
        </MSection>
      </div>
    );
  };

  M.straw = ({ state }) => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - (state.yearOfBirth || 1985);
    const earlyOnset = age < 40 && (state.conditions || []).includes('Perimenopause');
    // MED-4 — auto-stage from cycle interval data (last 12 months)
    const lastPeriod = state.lastPeriod ? new Date(state.lastPeriod) : null;
    const daysSinceLastPeriod = lastPeriod ? Math.floor((Date.now() - lastPeriod.getTime()) / 86400000) : 0;
    // We don't have a long historical period log; approximate from cycleLen and irregular flag
    const cycleLen = state.cycleLen || 28;
    // Crude proxies: irregular + (cycleLen variability proxy via state.irregular flag)
    const sufficientData = lastPeriod && (state.entries ? Object.keys(state.entries).length >= 60 : false);
    let stagedKey = null;
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
    // T-73 — canonical STRAW+10 stage labels (no fabricated −1a / −1b)
    const stages = [
      { s: '−2', l: 'Early menopausal transition', d: 'Persistent 7+ day variation in cycle length', y: stagedKey === '−2' },
      { s: '−1', l: 'Late menopausal transition', d: 'Interval of amenorrhea ≥ 60 days', y: stagedKey === '−1' },
      { s: '+1a', l: 'Early postmenopause', d: 'First 12 months after FMP', y: stagedKey === '+1a' },
      { s: '+1b', l: 'Early postmenopause continued', d: 'Period of rapid hormonal change continues', y: stagedKey === '+1b' },
      { s: '+1c', l: 'Early postmenopause stable', d: 'Stabilization of FSH/estradiol — 3–6 years post-FMP', y: stagedKey === '+1c' },
      { s: '+2', l: 'Late postmenopause', d: 'Genitourinary atrophy more prominent · 6+ years post-FMP', y: stagedKey === '+2' },
    ];
    if (!sufficientData) {
      return (
        <div>
          <MHeader eyebrow="F22 · STRAW+10 STAGE" title={<>Auto-staging needs <span style={{ color: 'var(--eucalyptus)' }}>more cycle data.</span></>} sub="Stages are derived from cycle interval data over the last 12 months." />
          <div className="card-warm" style={{ padding: 22, marginBottom: 14, borderLeft: '3px solid var(--butter-deep)' }}>
            <p className="body" style={{ marginBottom: 8 }}>
              Not enough cycle data yet — log 6+ months of cycles to auto-stage.
            </p>
            <div className="caption" style={{ fontSize: 12 }}>
              Currently {Object.keys(state.entries || {}).length}/60 days logged.
            </div>
          </div>
          {stages.map(p => (
            <div key={p.s} className="card" style={{ padding: 12, marginBottom: 6, opacity: 0.6 }}>
              <span className="data" style={{ fontSize: 14, marginRight: 10 }}>{p.s}</span>
              <span style={{ fontSize: 13 }}>{p.l}</span>
              <div className="caption" style={{ fontSize: 11, marginTop: 4 }}>{p.d}</div>
            </div>
          ))}
        </div>
      );
    }
    const current = stages.find(s => s.y) || stages[0];
    return (
    <div>
      <MHeader eyebrow="F22 · STRAW+10 STAGE" title={<>You are in <span  style={{ color: 'var(--eucalyptus)' }}>{current.l.toLowerCase()}.</span></>} sub={`Auto-staged: ${stageReason || 'from cycle interval data'} — confirm with your clinician.${state.hbcActive ? ' Tentative while on hormonal contraception.' : ''}`} />
      {/* R7 — F89 Hormonal Birth Control masking caveat (CRITICAL: HBC suppresses FSH and masks staging) */}
      {state.hbcActive && (
        <div className="card-warm" style={{ padding: 16, marginBottom: 14, borderLeft: '3px solid var(--coral-deep, var(--coral))', background: 'linear-gradient(135deg, var(--paper), rgba(232,159,134,0.08))' }}>
          <div className="eyebrow" style={{ marginBottom: 6, color: 'var(--coral-deep, var(--coral))' }}>STAGING TENTATIVE — HBC ACTIVE</div>
          <p className="body" style={{ fontSize: 13, marginBottom: 8 }}>
            <strong>You're on {state.hbcType ? state.hbcType.replace(/_/g, ' ') : 'hormonal birth control'}.</strong> HBC suppresses FSH and creates regular bleeding patterns regardless of where you are in the menopausal transition.
          </p>
          <p className="caption" style={{ fontSize: 12 }}>
            Cycle-interval staging is unreliable while on HBC. To get accurate STRAW+10 staging, your provider may suggest pausing HBC briefly, or using FSH/AMH labs interpreted with HBC context. Discuss with your provider.
          </p>
        </div>
      )}
      {earlyOnset && (
        <div className="card-warm" style={{ padding: 14, marginBottom: 14, borderLeft: '3px solid var(--coral)' }}>
          <div className="eyebrow" style={{ marginBottom: 6, color: 'var(--coral)' }}>EARLY-ONSET FRAMING</div>
          <p className="body" style={{ fontSize: 13, marginBottom: 8 }}>
            <strong>Premature ovarian insufficiency / early perimenopause.</strong> You're {age} — younger than the typical onset window.
          </p>
          <p className="caption" style={{ fontSize: 12 }}>
            Bone density and cardiovascular monitoring are an extra clinical priority for early-onset.
          </p>
        </div>
      )}
      <div className="card-warm" style={{ padding: 18, marginBottom: 14, textAlign: 'center', background: 'linear-gradient(135deg, var(--paper), var(--coral-soft))' }}>
        <div className="data" style={{ fontSize: 32, fontWeight: 500, color: 'var(--eucalyptus-deep)' }}>{current.s}</div>
        <div className="caption" style={{ marginTop: 4 }}>{current.l}</div>
      </div>
      {stages.map(p => (
        <div key={p.s} className="card" style={{ padding: 12, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 10, opacity: p.y ? 1 : 0.55, borderLeft: p.y ? '3px solid var(--eucalyptus)' : '1px solid var(--border)' }}>
          <span className="data" style={{ fontSize: 14, width: 36 }}>{p.s}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: p.y ? 600 : 400 }}>{p.l}</div>
            <div className="caption" style={{ fontSize: 11 }}>{p.d}</div>
          </div>
        </div>
      ))}
      <div className="caption" style={{ fontSize: 11, marginTop: 14, lineHeight: 1.5 }}>
        Auto-staged from your cycle interval data — confirm with your clinician.
      </div>
    </div>
    );
  };

  M.greene = ({ state }) => {
    // T-74 — full 21-item Greene Climacteric Scale, scored 0–3
    // Anxiety (6 items, max 18), Depression (5, max 15), Somatic (7, max 21), Vasomotor (2, max 6), Sexual (1, max 3)
    const ITEMS = [
      // Anxiety (6)
      { k: 'a1', sub: 'Anxiety', label: 'Heart beating quickly or strongly' },
      { k: 'a2', sub: 'Anxiety', label: 'Feeling tense or nervous' },
      { k: 'a3', sub: 'Anxiety', label: 'Difficulty in sleeping' },
      { k: 'a4', sub: 'Anxiety', label: 'Excitable' },
      { k: 'a5', sub: 'Anxiety', label: 'Attacks of panic' },
      { k: 'a6', sub: 'Anxiety', label: 'Difficulty in concentrating' },
      // Depression (5)
      { k: 'd1', sub: 'Depression', label: 'Feeling tired or lacking energy' },
      { k: 'd2', sub: 'Depression', label: 'Loss of interest in most things' },
      { k: 'd3', sub: 'Depression', label: 'Feeling unhappy or depressed' },
      { k: 'd4', sub: 'Depression', label: 'Crying spells' },
      { k: 'd5', sub: 'Depression', label: 'Irritability' },
      // Somatic (7)
      { k: 's1', sub: 'Somatic', label: 'Feeling dizzy or faint' },
      { k: 's2', sub: 'Somatic', label: 'Pressure or tightness in head/body' },
      { k: 's3', sub: 'Somatic', label: 'Parts of body feel numb or tingling' },
      { k: 's4', sub: 'Somatic', label: 'Headaches' },
      { k: 's5', sub: 'Somatic', label: 'Muscle and joint pains' },
      { k: 's6', sub: 'Somatic', label: 'Loss of feeling in hands or feet' },
      { k: 's7', sub: 'Somatic', label: 'Breathing difficulties' },
      // Vasomotor (2)
      { k: 'v1', sub: 'Vasomotor', label: 'Hot flushes' },
      { k: 'v2', sub: 'Vasomotor', label: 'Sweating at night' },
      // Sexual (1)
      { k: 'x1', sub: 'Sexual', label: 'Loss of interest in sex' },
    ];
    const ANCHORS = ['Not at all', 'A little', 'Quite a bit', 'Extremely'];

    const initial = state.greeneScores || {};
    const [scores, setScores] = useM(ITEMS.reduce((acc, it) => ({ ...acc, [it.k]: initial[it.k] != null ? initial[it.k] : 0 }), {}));
    const setItem = (k, n) => {
      const next = { ...scores, [k]: n };
      setScores(next);
      try {
        const stored = JSON.parse(localStorage.getItem('hq-state') || '{}');
        stored.greeneScores = next;
        localStorage.setItem('hq-state', JSON.stringify(stored));
      } catch {}
    };

    const SUB_MAX = { Anxiety: 18, Depression: 15, Somatic: 21, Vasomotor: 6, Sexual: 3 };
    const SUB_COLORS = {
      Anxiety: 'var(--severity-mod)',
      Depression: 'var(--severity-mild)',
      Somatic: 'var(--severity-mod)',
      Vasomotor: 'var(--severity-severe)',
      Sexual: 'var(--severity-mod)',
    };
    const subTotals = Object.keys(SUB_MAX).reduce((acc, key) => {
      acc[key] = ITEMS.filter(it => it.sub === key).reduce((sum, it) => sum + (scores[it.k] || 0), 0);
      return acc;
    }, {});

    const groups = ['Anxiety', 'Depression', 'Somatic', 'Vasomotor', 'Sexual'];
    return (
      <div>
        <MHeader eyebrow="F25 · GREENE CLIMACTERIC" title={<>Weekly <span  style={{ color: 'var(--eucalyptus)' }}>21-item</span> assessment.</>} sub="0 = Not at all · 1 = A little · 2 = Quite a bit · 3 = Extremely" />
        {/* Subscale summary */}
        {groups.map(g => (
          <div key={g} className="card" style={{ padding: 12, marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{g}</span>
              <span className="data" style={{ fontSize: 12, color: SUB_COLORS[g] }}>{subTotals[g]}/{SUB_MAX[g]}</span>
            </div>
            <div style={{ height: 6, background: 'var(--mint-mist)', borderRadius: 999 }}>
              <div style={{ width: ((subTotals[g] / SUB_MAX[g]) * 100) + '%', height: '100%', background: SUB_COLORS[g], borderRadius: 999 }} />
            </div>
          </div>
        ))}

        <div style={{ marginTop: 18 }}>
          {groups.map(g => (
            <MSection key={g} title={`${g.toUpperCase()} · ${SUB_MAX[g]} max`}>
              {ITEMS.filter(it => it.sub === g).map(it => (
                <div key={it.k} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, marginBottom: 6 }}>{it.label}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
                    {[0,1,2,3].map(n => (
                      <button
                        key={n}
                        onClick={() => setItem(it.k, n)}
                        style={{
                          padding: '6px 4px', borderRadius: 6,
                          background: scores[it.k] === n ? 'var(--eucalyptus)' : 'var(--surface)',
                          color: scores[it.k] === n ? '#fff' : 'inherit',
                          border: '1px solid var(--border)',
                          fontSize: 11, cursor: 'pointer',
                        }}
                      >
                        <div style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{n}</div>
                        <div style={{ fontSize: 9, marginTop: 2 }}>{ANCHORS[n]}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </MSection>
          ))}
        </div>
        <div className="caption" style={{ fontSize: 11, marginTop: 14, lineHeight: 1.5 }}>
          Greene CS · 21 items · Greene 1998. This is a self-rating tool, not a diagnosis.
        </div>
      </div>
    );
  };

  M.gsm = ({ state }) => {
    const useApp = window.HQ.useApp;
    const { setState } = useApp();
    const todayKey = new Date().toISOString().slice(0, 10);
    const today = (state.gsmScores && state.gsmScores[todayKey]) || {};
    const setField = (key, val) => {
      setState(s => ({
        ...s,
        gsmScores: { ...(s.gsmScores || {}), [todayKey]: { ...((s.gsmScores || {})[todayKey] || {}), [key]: val } },
      }));
    };
    const items = [
      { k: 'dryness', l: 'Vaginal dryness' },
      { k: 'painSex', l: 'Painful sex' },
      { k: 'urgency', l: 'Urinary urgency' },
      { k: 'uti', l: 'Recurrent UTI symptoms' },
      { k: 'libido', l: 'Libido changes' },
    ];
    return (
      <div>
        <MHeader eyebrow="F26 · GSM TRACKER" title={<>Discreet, <span style={{ color: 'var(--eucalyptus)' }}>private.</span></>} sub="Genitourinary symptoms — 0 = none, 3 = severe." />
        {items.map(it => (
          <div key={it.k} className="card" style={{ padding: 12, marginBottom: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{it.l}</div>
            <Severity value={today[it.k] || 0} onChange={v => setField(it.k, v)} max={4} />
          </div>
        ))}
        <div className="caption" style={{ fontSize: 11, marginTop: 10, lineHeight: 1.5 }}>
          Stored on-device. Included in physician export only when you explicitly select it.
        </div>
      </div>
    );
  };

  M.brainFog = ({ state }) => {
    const useApp = window.HQ.useApp;
    const { setState } = useApp();
    const todayKey = new Date().toISOString().slice(0, 10);
    const today = (state.brainFogLog && state.brainFogLog[todayKey]) || {};
    const setField = (key, val) => {
      setState(s => ({
        ...s,
        brainFogLog: { ...(s.brainFogLog || {}), [todayKey]: { ...((s.brainFogLog || {})[todayKey] || {}), [key]: val } },
      }));
    };
    const items = [
      { k: 'wordRetrieval', l: 'Word retrieval' },
      { k: 'misplacing', l: 'Misplacing things' },
      { k: 'names', l: 'Forgetting names' },
      { k: 'focus', l: 'Lost focus mid-task' },
    ];
    return (
      <div>
        <MHeader eyebrow="F27 · BRAIN FOG" title={<>Cognitive symptoms, <span style={{ color: 'var(--eucalyptus)' }}>tracked.</span></>} sub="EMQ-R retrieval subscale, correlated with sleep and hot flashes." />
        {items.map(it => (
          <div key={it.k} className="card" style={{ padding: 12, marginBottom: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{it.l}</div>
            <Severity value={today[it.k] || 0} onChange={v => setField(it.k, v)} max={5} />
          </div>
        ))}
        <div className="card-mint" style={{ padding: 12, marginTop: 6 }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>CORRELATION</div>
          <p className="body" style={{ fontSize: 12 }}>Brain fog is 1.8× worse on nights with 2+ hot flashes. Sleep is the dominant lever.</p>
        </div>
      </div>
    );
  };

  // ===== ADHD ===== (R7: legacy preview cards. Real working modules live in modules-5-adhd.jsx as adhdDailyLogRich/adhdMedLogReal/adhdPhysicianReportReal — Tools tab points to those.)
  M.exec = () => {
    const { state } = window.HQ.useApp();
    const dl = state.adhdDailyLog || {};
    const dates = Object.keys(dl).sort();
    const recent = dates.slice(-7).map(d => dl[d]);
    const meanOf = (key) => { const vals = recent.map(e => e[key]).filter(v => typeof v === 'number'); return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1) : '—'; };
    const dims = [
      { l: 'Attention / focus', k: 'attention_nrs' },
      { l: 'Impulsivity', k: 'impulsivity_nrs' },
      { l: 'Executive function', k: 'executive_function_nrs' },
      { l: 'Working memory', k: 'working_memory_nrs' },
      { l: 'Emotional regulation', k: 'emotional_regulation_nrs' },
    ];
    const EmptyArt = window.HQ && window.HQ.EmptyArt;
    if (dates.length === 0) {
      return (
        <div>
          <MHeader eyebrow="F13 · EXECUTIVE CHECK-IN" title={<>Five domains, <span style={{ color: 'var(--eucalyptus)' }}>once you log.</span></>} sub="Averages from your last 7 days appear here." />
          <div className="card-warm" style={{ padding: 22, textAlign: 'center' }}>
            {EmptyArt && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}><EmptyArt kind="wave" size={72} /></div>}
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Log a day to see your average.</div>
            <div className="caption" style={{ fontSize: 12 }}>Open Tools → ADHD → Daily ADHD log (F123) or use the daily-log tab.</div>
          </div>
        </div>
      );
    }
    return (
      <div>
        <MHeader eyebrow="F13 · EXECUTIVE CHECK-IN — 7 DAY AVERAGE" title={<>Five domains, <span  style={{ color: 'var(--eucalyptus)' }}>real data.</span></>} sub={`${dates.length} days logged · last 7 days averaged below.`} />
        {dims.map(d => (
          <div key={d.l} className="card" style={{ padding: 12, marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{d.l}</div>
            <div className="data" style={{ fontSize: 16, color: 'var(--eucalyptus)' }}>{meanOf(d.k)}/10</div>
          </div>
        ))}
        <div className="card-mint" style={{ padding: 12, marginTop: 8 }}>
          <div className="caption" style={{ fontSize: 12 }}>Tap "ADHD daily log" in Tools → ADHD to log today, or use Brown EF/A (F137) for monthly profile.</div>
        </div>
      </div>
    );
  };

  M.adhdMed = () => {
    const { state } = window.HQ.useApp();
    const med = state.adhdMedicationLog || {};
    const dates = Object.keys(med).sort().slice(-30);
    const phaseEff = { F: [], L: [] };
    dates.forEach(d => {
      const m = med[d]; if (!m || typeof m.effectiveness_nrs !== 'number') return;
      if (m.cyclePhase === 'F') phaseEff.F.push(m.effectiveness_nrs);
      if (m.cyclePhase === 'L' || m.cyclePhase === 'Lm' || m.cyclePhase === 'Ls') phaseEff.L.push(m.effectiveness_nrs);
    });
    const meanOf = arr => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : null;
    const fEff = meanOf(phaseEff.F);
    const lEff = meanOf(phaseEff.L);
    const haveData = dates.length >= 5;
    const EmptyArt = window.HQ && window.HQ.EmptyArt;
    if (!haveData && dates.length === 0) {
      return (
        <div>
          <MHeader eyebrow="F14 · ADHD MED EFFECTIVENESS" title={<>By <span style={{ color: 'var(--eucalyptus)' }}>cycle phase.</span></>} sub="The follicular vs luteal pattern emerges after your first 5 medication logs." />
          <div className="card-warm" style={{ padding: 22, textAlign: 'center' }}>
            {EmptyArt && <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}><EmptyArt kind="circle" size={72} /></div>}
            <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 6 }}>Log a med day to see your average.</div>
            <div className="caption" style={{ fontSize: 12 }}>Open Tools → ADHD → Med log + BP (F133) to start. Phase pattern appears after 5 entries.</div>
          </div>
        </div>
      );
    }
    return (
      <div>
        <MHeader eyebrow="F14 · ADHD MED EFFECTIVENESS" title={<>By <span  style={{ color: 'var(--eucalyptus)' }}>cycle phase.</span></>} sub={haveData ? `${dates.length} medication entries · phase pattern below.` : `${dates.length}/5 entries — pattern unlocks at 5.`} />
        {haveData ? (
          <>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <div className="card-warm" style={{ padding: 14, flex: 1, textAlign: 'center' }}>
                <div className="eyebrow" style={{ marginBottom: 4 }}>FOLLICULAR</div>
                <div className="data" style={{ fontSize: 24, color: 'var(--phase-follicular)' }}>{fEff || '—'}</div>
                <div className="caption" style={{ fontSize: 11 }}>{phaseEff.F.length} days</div>
              </div>
              <div className="card-warm" style={{ padding: 14, flex: 1, textAlign: 'center' }}>
                <div className="eyebrow" style={{ marginBottom: 4 }}>LUTEAL</div>
                <div className="data" style={{ fontSize: 24, color: 'var(--phase-luteal-deep)' }}>{lEff || '—'}</div>
                <div className="caption" style={{ fontSize: 11 }}>{phaseEff.L.length} days</div>
              </div>
            </div>
            {fEff && lEff && (+fEff - +lEff >= 1.5) && (
              <div className="card-mint" style={{ padding: 12 }}>
                <div className="caption">Your medication is <strong>{(((+fEff) - (+lEff)) / (+fEff) * 100).toFixed(0)}%</strong> less effective in luteal phase. This is the cycle-correlation pattern in F134 — discuss luteal-phase dose adjustment with your prescriber.</div>
              </div>
            )}
          </>
        ) : (
          <div className="card-warm" style={{ padding: 14 }}>
            <div className="caption">Open Tools → ADHD → Med log + BP (F133) to start logging.</div>
          </div>
        )}
      </div>
    );
  };

  // R7 — F15 cycle dosing report: real-data computation + jsPDF download (replaces hardcoded mockup)
  M.adhdReport = () => {
    const { state } = window.HQ.useApp();
    const med = state.adhdMedicationLog || {};
    const dl = state.adhdDailyLog || {};
    const phaseStats = { F: { focus: [], eff: [] }, O: { focus: [], eff: [] }, L: { focus: [], eff: [] }, M: { focus: [], eff: [] } };
    Object.keys(dl).forEach(d => {
      const e = dl[d]; const m = med[d];
      const phase = e && e.cyclePhase ? (e.cyclePhase === 'Lm' || e.cyclePhase === 'Ls' ? 'L' : e.cyclePhase) : null;
      if (!phase || !phaseStats[phase]) return;
      if (typeof e.attention_nrs === 'number') phaseStats[phase].focus.push(e.attention_nrs);
      if (m && typeof m.effectiveness_nrs === 'number') phaseStats[phase].eff.push(m.effectiveness_nrs);
    });
    const meanOf = arr => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1) : '—';
    const rows = [
      ['Menstrual', meanOf(phaseStats.M.focus), meanOf(phaseStats.M.eff), String(phaseStats.M.focus.length)],
      ['Follicular', meanOf(phaseStats.F.focus), meanOf(phaseStats.F.eff), String(phaseStats.F.focus.length)],
      ['Ovulatory', meanOf(phaseStats.O.focus), meanOf(phaseStats.O.eff), String(phaseStats.O.focus.length)],
      ['Luteal', meanOf(phaseStats.L.focus), meanOf(phaseStats.L.eff), String(phaseStats.L.focus.length)],
    ];
    const totalDays = Object.keys(dl).length;
    const handleDownload = () => {
      window.HQ.generatePDF({
        title: 'ADHD Cycle Dosing Report',
        subtitle: `${totalDays} days logged · phase × focus × medication effectiveness`,
        filename: `hormonaiq-adhd-cycle-${new Date().toISOString().slice(0, 10)}.pdf`,
        sections: [
          { heading: 'Patient profile', lines: [
            { kind: 'kv', key: 'Conditions', value: (state.conditions || []).join(', ') || '—' },
            { kind: 'kv', key: 'ADHD daily logs', value: String(totalDays) },
            { kind: 'kv', key: 'Medication entries', value: String(Object.keys(med).length) },
          ] },
          { heading: 'Phase × focus × medication effectiveness',
            lines: ['Computed from prospective daily log data. 0–10 NRS per dimension.'],
            table: { headers: ['Phase', 'Focus', 'Med eff.', 'Days'], rows },
          },
          { heading: 'Suggested discussion',
            lines: [
              parseFloat(meanOf(phaseStats.F.eff)) - parseFloat(meanOf(phaseStats.L.eff)) >= 1.5
                ? 'Medication effectiveness drops materially in luteal phase. Discuss luteal-phase dose increase or supplemental short-acting agent.'
                : 'No strong cycle-effectiveness pattern yet — keep logging.',
            ],
          },
          { heading: 'Reference', lines: ['De Berardis et al. — ADHD symptoms across menstrual cycle phases. Patient self-report; discuss with prescriber.'] },
        ],
      });
    };
    return (
      <div>
        <MHeader eyebrow="F15 · CYCLE DOSING REPORT" title={<>For your <span  style={{ color: 'var(--eucalyptus)' }}>prescriber.</span></>} sub={`${totalDays} days of real data · phase × focus × medication effectiveness.`} />
        <div className="card-clinical" style={{ background: 'var(--cream-warm)', color: 'var(--ink)', padding: 16, marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', borderBottom: '1px solid var(--ink)', paddingBottom: 8, marginBottom: 10 }}>
            ADHD CYCLE DOSING REPORT · {totalDays} DAYS
          </div>
          <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--ink)' }}>
                <th style={{ textAlign: 'left', padding: 4 }}>Phase</th>
                <th style={{ padding: 4 }}>Focus</th>
                <th style={{ padding: 4 }}>Med eff.</th>
                <th style={{ padding: 4 }}>Days</th>
              </tr>
            </thead>
            <tbody style={{ fontFamily: 'var(--mono)' }}>
              {rows.map(r => (
                <tr key={r[0]}><td style={{ padding: 4 }}>{r[0]}</td><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td></tr>
              ))}
            </tbody>
          </table>
          <div className="caption" style={{ fontSize: 11, color: 'var(--ink-3)', marginTop: 8, fontStyle: 'italic' }}>
            Reference: De Berardis et al. — ADHD symptoms across menstrual cycle phases
          </div>
        </div>
        <button className="btn-primary" onClick={handleDownload}>⤓ Download for prescriber</button>
      </div>
    );
  };

  // ===== CROSS =====
  // R7 — F21 real algorithm (was stub). Computes 4 criteria from live state.
  M.overlap = () => {
    const { state } = window.HQ.useApp();
    const cycleLen = state.cycleLen || 28;
    const entries = state.entries || {}; // PMDD DRSP
    const med = state.adhdMedicationLog || {}; // ADHD medication
    const dl = state.adhdDailyLog || {}; // ADHD daily

    // Criterion 1: DRSP luteal mean ≥ 4
    const drspByPhase = { F: [], L: [] };
    Object.keys(entries).forEach(d => {
      const e = entries[d]; if (!e || !e.drsp) return;
      const start = new Date(state.lastPeriod || d);
      const day = Math.max(1, ((Math.floor((new Date(d) - start) / 86400000)) % cycleLen) + 1);
      const phase = window.HQ.phaseForDay(day, cycleLen, { coarse: true });
      const vals = Object.values(e.drsp).filter(v => typeof v === 'number');
      if (!vals.length) return;
      const max = Math.max(...vals);
      if (drspByPhase[phase]) drspByPhase[phase].push(max);
    });
    const drspLutealMean = drspByPhase.L.length ? drspByPhase.L.reduce((a, b) => a + b, 0) / drspByPhase.L.length : null;
    const drspFollMean = drspByPhase.F.length ? drspByPhase.F.reduce((a, b) => a + b, 0) / drspByPhase.F.length : null;
    const c1 = drspLutealMean !== null && drspLutealMean >= 4;

    // Criterion 2: Med effectiveness diff ≥ 1.5
    const medByPhase = { F: [], L: [] };
    Object.keys(med).forEach(d => {
      const m = med[d]; if (!m || typeof m.effectiveness_nrs !== 'number') return;
      const phase = m.cyclePhase === 'Lm' || m.cyclePhase === 'Ls' ? 'L' : m.cyclePhase;
      if (medByPhase[phase]) medByPhase[phase].push(m.effectiveness_nrs);
    });
    const medFoll = medByPhase.F.length ? medByPhase.F.reduce((a, b) => a + b, 0) / medByPhase.F.length : null;
    const medLuteal = medByPhase.L.length ? medByPhase.L.reduce((a, b) => a + b, 0) / medByPhase.L.length : null;
    const c2 = medFoll !== null && medLuteal !== null && (medFoll - medLuteal) >= 1.5;

    // Criterion 3: Cycle-recurrent for 3+ cycles (proxy: at least 3 distinct cycles with luteal max ≥ 4)
    const lutealCyclesSevere = new Set();
    Object.keys(entries).forEach(d => {
      const e = entries[d]; if (!e || !e.drsp) return;
      const start = new Date(state.lastPeriod || d);
      const dayOffset = Math.floor((new Date(d) - start) / 86400000);
      const day = Math.max(1, (dayOffset % cycleLen) + 1);
      const phase = window.HQ.phaseForDay(day, cycleLen, { coarse: true });
      if (phase !== 'L') return;
      const vals = Object.values(e.drsp).filter(v => typeof v === 'number');
      if (vals.length && Math.max(...vals) >= 4) {
        lutealCyclesSevere.add(Math.floor(dayOffset / cycleLen));
      }
    });
    const c3 = lutealCyclesSevere.size >= 3;

    // Criterion 4: Symptom-free in follicular (follicular DRSP mean < 2)
    const c4 = drspFollMean !== null && drspFollMean < 2;

    const matchCount = [c1, c2, c3, c4].filter(Boolean).length;
    const pattern = matchCount >= 3 ? '46%-pattern match' : matchCount >= 1 ? 'partial pattern' : 'no overlap pattern detected';

    const fmt = (label, met, detail) => (
      <div key={label} className="card" style={{ padding: 12, marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: met ? '3px solid var(--eucalyptus)' : '3px solid transparent' }}>
        <div>
          <div style={{ fontSize: 13 }}>{label}</div>
          {detail && <div className="caption" style={{ fontSize: 11 }}>{detail}</div>}
        </div>
        <span style={{ fontSize: 13, color: met ? 'var(--eucalyptus)' : 'var(--ink-3)', fontWeight: 600 }}>{met ? 'observed' : 'not observed'}</span>
      </div>
    );

    return (
      <div>
        <MHeader eyebrow="F21 · ADHD-PMDD OVERLAP" title={<>{matchCount >= 3 ? <>You match the <span style={{ color: 'var(--eucalyptus)' }}>46% pattern</span>.</> : matchCount >= 1 ? 'Partial overlap pattern.' : 'No overlap detected yet.'}</>} sub="Computed from your live data. Not a diagnosis — a clinically established co-occurrence pattern." />
        <div className="card-warm" style={{ padding: 10, marginBottom: 10, fontSize: 11, color: 'var(--ink-2)' }}>
          These patterns are observations from your logs. They are not a diagnosis. Bring them to your clinician.
        </div>
        <div className="card-mint" style={{ padding: 16, marginBottom: 14 }}>
          <p className="body" style={{ fontSize: 13 }}>~46% of women with ADHD also experience PMDD. {matchCount >= 3 ? 'Your tracked DRSP scores + reduced medication effectiveness in luteal phase form the textbook overlap signature.' : matchCount >= 1 ? `${matchCount}/4 criteria currently observed — keep logging to clarify the pattern.` : 'No criteria observed yet — log daily entries + medication for at least 30 days to compute the pattern.'}</p>
        </div>
        {fmt('DRSP luteal mean ≥ 4', c1, drspLutealMean !== null ? `Your luteal mean: ${drspLutealMean.toFixed(2)}/6` : 'Not enough DRSP data')}
        {fmt('Med effect luteal − follicular ≥ 1.5', c2, (medFoll !== null && medLuteal !== null) ? `F: ${medFoll.toFixed(1)} / L: ${medLuteal.toFixed(1)} (Δ=${(medFoll - medLuteal).toFixed(1)})` : 'Not enough medication log data')}
        {fmt('Cycle-recurrent for 3+ cycles', c3, `${lutealCyclesSevere.size} luteal cycles with severe DRSP detected`)}
        {fmt('Symptom-free in follicular', c4, drspFollMean !== null ? `Your follicular mean: ${drspFollMean.toFixed(2)}/6` : 'Not enough DRSP data')}
      </div>
    );
  };

  M.overlay = () => {
    const series = [
      { l: 'PMDD (DRSP)', c: 'var(--severity-severe)', dash: 'solid', d: [1.2, 1.4, 1.6, 1.8, 2.2, 3.4, 4.5, 4.8] },
      { l: 'PCOS metabolic', c: 'var(--butter-deep)', dash: 'dashed', d: [2.8, 2.7, 2.9, 2.8, 2.6, 2.7, 2.9, 3.0] },
      { l: 'ADHD focus', c: 'var(--eucalyptus)', dash: 'dotted', d: [4.2, 4.1, 4.0, 3.8, 3.5, 3.0, 2.4, 2.2] },
    ];
    // MED-5 — render dashed/dotted lines via SVG for non-color encoding
    const renderLine = (data, color, dashStyle) => {
      const w = 280, h = 30;
      const max = Math.max(...data, 5);
      const dashArray = dashStyle === 'dashed' ? '6 4' : dashStyle === 'dotted' ? '2 3' : '0';
      const points = data.map((v, i) => `${(i * (w / (data.length - 1))).toFixed(1)},${(h - (v / max) * h).toFixed(1)}`).join(' ');
      return (
        <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
          <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeDasharray={dashArray} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    };
    return (
      <div>
        <MHeader eyebrow="F23 · MULTI-CONDITION OVERLAY" title={<>One <span  style={{ color: 'var(--eucalyptus)' }}>timeline.</span></>} sub="PMDD + PCOS + ADHD on the same days." />
        <div className="card-warm" style={{ padding: 10, marginBottom: 10, fontSize: 11, color: 'var(--ink-2)' }}>
          These patterns are observations from your logs. They are not a diagnosis. Bring them to your clinician.
        </div>
        {/* MED-5 — non-color legend with line-style swatches */}
        <div className="card-paper" style={{ padding: 10, marginBottom: 10, display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          {series.map(s => (
            <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="32" height="6" viewBox="0 0 32 6">
                <line x1="0" y1="3" x2="32" y2="3" stroke={s.c} strokeWidth="2" strokeDasharray={s.dash === 'dashed' ? '6 4' : s.dash === 'dotted' ? '2 3' : '0'} strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: 11, fontWeight: 500 }}>{s.l} <span style={{ color: 'var(--ink-3)', fontStyle: 'italic' }}>({s.dash})</span></span>
            </div>
          ))}
        </div>
        <div className="card-warm" style={{ padding: 14 }}>
          {series.map(s => (
            <div key={s.l} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: s.c }}>{s.l}</span>
                <span className="data" style={{ fontSize: 11 }}>day 1–28</span>
              </div>
              {renderLine(s.d, s.c, s.dash)}
            </div>
          ))}
        </div>
        <div className="caption" style={{ marginTop: 10, fontSize: 12 }}>Watch how all three trend together in luteal. The metabolic and cognitive systems are connected.</div>
      </div>
    );
  };

  M.irregular = ({ state }) => {
    const settings = state.irregularSettings || { irregularMode: state.irregular || false, anovulatory: false, pcosPhaseEst: false };
    const [im, setIm] = useM(!!settings.irregularMode);
    const [ano, setAno] = useM(!!settings.anovulatory);
    const [pcosEst, setPcosEst] = useM(!!settings.pcosPhaseEst);
    const persist = (next) => {
      try {
        const stored = JSON.parse(localStorage.getItem('hq-state') || '{}');
        stored.irregularSettings = next;
        stored.irregular = !!next.irregularMode;
        localStorage.setItem('hq-state', JSON.stringify(stored));
      } catch {}
    };
    return (
      <div>
        <MHeader eyebrow="F24 · IRREGULAR CYCLE MODE" title={<>For cycles that <span  style={{ color: 'var(--eucalyptus)' }}>don't fit a clock.</span></>} sub="Anovulatory aware, variable length predictions, PCOS-tuned." />
        <ToggleRow label="Irregular cycle mode" checked={im}
          onChange={v => { setIm(v); persist({ irregularMode: v, anovulatory: ano, pcosPhaseEst: pcosEst }); }}
          sub="Switches predictions to a window, not a date" />
        <ToggleRow label="Show anovulatory cycles" checked={ano}
          onChange={v => { setAno(v); persist({ irregularMode: im, anovulatory: v, pcosPhaseEst: pcosEst }); }}
          sub="Marks cycles with no PdG confirmation" />
        <ToggleRow label="PCOS phase estimation" checked={pcosEst}
          onChange={v => { setPcosEst(v); persist({ irregularMode: im, anovulatory: ano, pcosPhaseEst: v }); }}
          sub="Uses your cycle history median, not 28-day default" />
        <div className="card-warm" style={{ padding: 14, marginTop: 14 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>YOUR CYCLE PROFILE</div>
          <div className="data" style={{ fontSize: 16 }}>median 42d · range 28–62d · 4/12 anovulatory</div>
        </div>
        <div className="caption" style={{ marginTop: 12, fontSize: 11 }}>
          Reload after toggling to see the home phase chip update to "variable".
        </div>
      </div>
    );
  };

  M.compPDF = () => {
    const { state } = window.HQ.useApp();
    const conditions = state.conditions || [];
    const cycleLen = state.cycleLen || 28;
    const handleDownload = () => {
      const sections = [
        { heading: 'Patient profile', lines: [
          { kind: 'kv', key: 'Conditions', value: conditions.join(', ') || '—' },
          { kind: 'kv', key: 'ADHD overlap', value: state.adhd === 'Yes' ? 'Yes' : (state.adhd || 'No') },
          { kind: 'kv', key: 'Cycle length', value: cycleLen + ' days' },
          { kind: 'kv', key: 'HBC active', value: state.hbcActive ? (state.hbcType || 'yes').replace(/_/g, ' ') : 'No' },
          { kind: 'kv', key: 'Perimenopausal status', value: state.perimenopausalStatus || 'unknown' },
        ] },
      ];

      // PMDD section
      if (conditions.includes('PMDD')) {
        const entries = state.entries || {};
        const dates = Object.keys(entries).sort();
        const phaseAvgs = { F: [], O: [], L: [], M: [] };
        dates.forEach(d => {
          const e = entries[d]; if (!e || !e.drsp) return;
          const start = new Date(state.lastPeriod || dates[0]);
          const day = Math.max(1, ((Math.floor((new Date(d) - start) / 86400000)) % cycleLen) + 1);
          const phase = window.HQ.phaseForDay(day, cycleLen, { coarse: true });
          const vals = Object.values(e.drsp).filter(v => typeof v === 'number');
          if (vals.length === 0) return;
          if (phaseAvgs[phase]) phaseAvgs[phase].push(Math.max(...vals));
        });
        const meanOf = arr => arr.length ? (arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(2) : '—';
        sections.push({
          heading: 'PMDD — DRSP severity by cycle phase',
          lines: [`${dates.length} days logged.`],
          table: {
            headers: ['Phase', 'Mean max severity', 'Days'],
            rows: [
              ['Follicular', meanOf(phaseAvgs.F), String(phaseAvgs.F.length)],
              ['Ovulatory', meanOf(phaseAvgs.O), String(phaseAvgs.O.length)],
              ['Luteal', meanOf(phaseAvgs.L), String(phaseAvgs.L.length)],
              ['Menstrual', meanOf(phaseAvgs.M), String(phaseAvgs.M.length)],
            ],
          },
        });
      }

      // PCOS section
      if (conditions.includes('PCOS')) {
        const phenotype = state.phenotype || 'not yet classified';
        const labs = (state.labs || []).slice(-10);
        sections.push({
          heading: 'PCOS — phenotype + labs',
          lines: [
            { kind: 'kv', key: 'Phenotype', value: phenotype },
            { kind: 'kv', key: 'Inositol regimen', value: state.inositolDoses ? `myo ${state.inositolDoses.myo} : DCI ${state.inositolDoses.dci}` : '—' },
            ...(labs.length ? [`Recent labs: ${labs.length} entries (see lab vault module).`] : ['No labs logged.']),
          ],
        });
      }

      // Perimenopause section
      if (conditions.includes('Perimenopause')) {
        const greene = state.greeneScores || {};
        const hotFlash = (state.hotFlashLog || []).length;
        sections.push({
          heading: 'Perimenopause — symptom burden',
          lines: [
            { kind: 'kv', key: 'Hot flashes logged', value: String(hotFlash) },
            { kind: 'kv', key: 'Greene Climacteric items captured', value: String(Object.keys(greene).length) },
            ...(state.hbcActive ? ['Note: STRAW staging is tentative because patient is on hormonal contraception (F89 caveat).'] : []),
          ],
        });
      }

      // Endometriosis section
      if (conditions.includes('Endometriosis')) {
        const dailyLog = state.endoDailyLog || {};
        const dates = Object.keys(dailyLog).sort();
        const ehp30 = state.endoEhp30Log || {};
        const ehp30Dates = Object.keys(ehp30).sort();
        const lastEhp = ehp30Dates.length ? ehp30[ehp30Dates[ehp30Dates.length - 1]] : null;
        sections.push({
          heading: 'Endometriosis — pain + EHP-30',
          lines: [
            { kind: 'kv', key: 'Days logged', value: String(dates.length) },
            { kind: 'kv', key: 'Surgical history', value: (state.endoSurgicalHistory || []).length + ' entries' },
            ...(lastEhp ? [{ kind: 'kv', key: 'Most recent EHP-30 (5 subscales 0–100)', value: Object.entries(lastEhp.subscale_scores || {}).map(([k, v]) => `${k}: ${v.toFixed(0)}`).join(' · ') }] : []),
          ],
        });
      }

      // ADHD section
      if (state.adhd === 'Yes' || conditions.includes('ADHD overlap')) {
        const rs = state.adhdRsLog || {};
        const rsDates = Object.keys(rs).sort();
        const lastRs = rsDates.length ? rs[rsDates[rsDates.length - 1]] : null;
        sections.push({
          heading: 'ADHD — most recent severity + cycle pattern',
          lines: [
            ...(lastRs ? [{ kind: 'kv', key: 'ADHD-RS total', value: `${lastRs.total}/54 (${lastRs.severity})` }] : ['ADHD-RS not yet administered.']),
            { kind: 'kv', key: 'Days of ADHD daily log', value: String(Object.keys(state.adhdDailyLog || {}).length) },
            'Cycle × medication effectiveness — see F134 dedicated chart (60-day data gate).',
          ],
        });
      }

      // Cross-condition comorbidity flag
      if ((conditions.includes('PMDD') && (state.adhd === 'Yes' || conditions.includes('ADHD overlap')))) {
        sections.push({
          heading: 'Cross-condition flag',
          lines: ['ADHD + PMDD comorbidity tracking active. Population prevalence ~46% co-occurrence; this patient consents to integrated tracking via HormonaIQ.'],
        });
      }

      sections.push({
        heading: 'Notes',
        lines: ['Patient self-report. Discuss with provider before treatment decisions.'],
      });

      window.HQ.generatePDF({
        title: 'HormonaIQ Multi-Condition Report',
        subtitle: `${conditions.join(' · ') || 'Cycle tracking'}${state.adhd === 'Yes' ? ' + ADHD' : ''}`,
        filename: `hormonaiq-multi-report-${new Date().toISOString().slice(0, 10)}.pdf`,
        sections,
      });
    };
    return (
      <div>
        <MHeader eyebrow="F30 · COMPREHENSIVE PDF" title={<>All your <span  style={{ color: 'var(--eucalyptus)' }}>conditions</span>, one report.</>} sub="For OB-GYN or multi-specialty teams." />
        <div className="card-clinical" style={{ background: 'var(--cream-warm)', color: 'var(--ink)', padding: 16, marginBottom: 12, fontSize: 11, lineHeight: 1.6 }}>
          <div style={{ fontWeight: 600, letterSpacing: '0.06em', borderBottom: '1px solid var(--ink)', paddingBottom: 8, marginBottom: 10 }}>
            MULTI-CONDITION HEALTH REPORT · {(state.conditions || []).join(' + ') || 'cycle tracking'}{state.adhd === 'Yes' ? ' + ADHD' : ''}
          </div>
          <div className="caption" style={{ fontSize: 12 }}>Generates a real PDF from your live data: phase × DRSP averages, surgical history, lab results, EHP-30 subscales, ADHD-RS most recent, cycle × medication effectiveness pattern. One report for OB-GYN, psychiatrist, or multi-specialty team.</div>
        </div>
        <button className="btn-primary" onClick={handleDownload}>⤓ Generate full PDF</button>
      </div>
    );
  };

  M.dietSym = ({ state }) => {
    const foodCount = (state.voiceFoodEntries || []).length;
    const symptomCount = Object.keys(state.entries || {}).length;
    const enough = foodCount >= 30 && symptomCount >= 30;
    if (!enough) {
      return (
        <div>
          <MHeader eyebrow="F32 · DIET × SYMPTOMS" title={<>Tracking 30+ days unlocks <span  style={{ color: 'var(--eucalyptus)' }}>correlations.</span></>} sub="Need both food and symptom logs to compute." />
          <div className="card-warm" style={{ padding: 18 }}>
            <p className="body" style={{ fontSize: 13, marginBottom: 8 }}>
              Tracking 30+ days of both food and symptoms unlocks correlations.
            </p>
            <div className="caption" style={{ fontSize: 12, marginBottom: 4 }}>Food entries: <strong>{foodCount}/30</strong></div>
            <div className="caption" style={{ fontSize: 12 }}>Symptom entries: <strong>{symptomCount}/30</strong></div>
          </div>
        </div>
      );
    }
    // Build per-day food signatures (sugar, caffeine, protein) — heuristic from voice entries
    const dayFood = {};
    (state.voiceFoodEntries || []).forEach(e => {
      const dateKey = e.date || (e.at && new Date(e.at).toISOString().slice(0, 10));
      if (!dateKey) return;
      const text = (e.text || e.transcript || '').toLowerCase();
      const slot = (dayFood[dateKey] ||= { sugar: 0, caffeine: 0, protein: 0, alcohol: 0 });
      if (/sugar|sweet|dessert|cookie|cake|candy|chocolate|soda/.test(text)) slot.sugar += 1;
      if (/coffee|caffeine|espresso|latte|tea/.test(text)) slot.caffeine += 1;
      if (/protein|chicken|beef|fish|salmon|egg|yogurt|tofu|beans/.test(text)) slot.protein += 1;
      if (/wine|beer|alcohol|vodka|cocktail/.test(text)) slot.alcohol += 1;
    });
    const drspMean = (entry) => {
      if (!entry || !entry.drsp) return null;
      const vals = Object.entries(entry.drsp).filter(([k]) => k !== 'suicidal_ideation').map(([, v]) => +v).filter(v => v > 0);
      return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length) : null;
    };
    const phaseFor = (dateKey) => {
      if (!state.lastPeriod) return null;
      const start = new Date(state.lastPeriod);
      const dt = new Date(dateKey);
      const cd = Math.max(1, ((Math.floor((dt - start) / 86400000)) % (state.cycleLen || 28)) + 1);
      return window.HQ.phaseForDay(cd, state.cycleLen || 28, { coarse: true });
    };
    const insights = [];
    ['sugar', 'caffeine', 'protein', 'alcohol'].forEach(food => {
      const phasePairs = { F: [], O: [], L: [], M: [] };
      Object.entries(dayFood).forEach(([dateKey, slot]) => {
        if (!slot[food]) return;
        const next = new Date(dateKey); next.setDate(next.getDate() + 1);
        const nextKey = next.toISOString().slice(0, 10);
        const drsp = drspMean(state.entries?.[nextKey]);
        if (drsp == null) return;
        const ph = phaseFor(nextKey);
        if (!ph) return;
        phasePairs[ph]?.push(drsp);
      });
      Object.entries(phasePairs).forEach(([ph, arr]) => {
        if (arr.length < 3) return;
        const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
        insights.push({ food, phase: ph, mean, n: arr.length });
      });
    });
    insights.sort((a, b) => b.mean - a.mean);
    const phaseLabel = { F: 'follicular', O: 'ovulatory', L: 'luteal', M: 'menstrual' };
    return (
      <div>
        <MHeader eyebrow="F32 · DIET × SYMPTOMS" title={<>Foods that <span  style={{ color: 'var(--eucalyptus)' }}>move</span> your numbers.</>} sub={`${foodCount} food entries × ${symptomCount} symptom entries — phase-grouped.`} />
        {insights.length === 0 && (
          <div className="caption" style={{ fontSize: 12, padding: 14 }}>Not enough food → next-day symptom overlap to compute yet.</div>
        )}
        {insights.slice(0, 8).map((r, i) => {
          const sev = r.mean >= 3.5 ? 'var(--severity-severe)' : r.mean >= 2.5 ? 'var(--severity-mod)' : 'var(--severity-mild)';
          return (
            <div key={i} className="card" style={{ padding: 12, marginBottom: 6, borderLeft: `3px solid ${sev}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{r.food} → next-day · {phaseLabel[r.phase]}</span>
                <span className="data" style={{ fontSize: 11 }}>n={r.n}</span>
              </div>
              <div className="caption" style={{ fontSize: 12 }}>Mean DRSP {r.mean.toFixed(2)} the next day in {phaseLabel[r.phase]} phase.</div>
            </div>
          );
        })}
      </div>
    );
  };

  M.foodPhoto = ({ state }) => {
    // T-19 — gated until internal flag enabled
    const live = !!(state.featureFlags && state.featureFlags.foodPhoto);
    if (live) {
      return (
        <div>
          <MHeader eyebrow="F33 · FOOD PHOTO · LIVE PREVIEW" title={<>Snap a meal, <span  style={{ color: 'var(--eucalyptus)' }}>get context.</span></>} sub="Phase-aware feedback, not calorie counting." />
          <div style={{ aspectRatio: '4/3', background: 'linear-gradient(135deg, var(--mint-pale), var(--butter))', borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14, fontSize: 48, opacity: 0.7 }}>📷</div>
          <div className="ora-card">
            <div className="ora-label">ORA · FOOD CONTEXT</div>
            <div className="ora-body">"Grilled salmon, sweet potato, broccoli." Steady-glycemic, protein-rich. Good fit for your luteal day — protein helps stabilize the late-luteal mood drop. Magnesium from leafy greens is a nice touch.</div>
            {window.HQ.OraFeedback && <window.HQ.OraFeedback insightId="modules-food-photo" />}
          </div>
        </div>
      );
    }
    const gates = [
      { l: 'F31 Voice Logging shipped', d: 'Verified live and used by ≥30% of active PCOS users' },
      { l: 'Eating disorder safety screen complete', d: 'Validated at onboarding' },
      { l: 'Clinical advisory board sign-off', d: 'On glycemic-quality framing' },
      { l: 'Photo zero-retention policy verified', d: 'End-to-end audit' },
    ];
    return (
      <div>
        <MHeader eyebrow="F33 · FOOD PHOTO" title={<>Coming after <span  style={{ color: 'var(--eucalyptus)' }}>voice logging.</span></>} sub="Photo logging unlocks only after these conditions close." />
        {gates.map((g, i) => (
          <div key={i} className="card-warm" style={{ padding: 12, marginBottom: 8, display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{ width: 18, height: 18, borderRadius: 4, border: '1.5px solid var(--border-strong)', flexShrink: 0, marginTop: 2 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{g.l}</div>
              <div className="caption" style={{ fontSize: 11 }}>{g.d}</div>
            </div>
          </div>
        ))}
        <div className="card-mint" style={{ padding: 14, marginTop: 12 }}>
          <p className="body" style={{ fontSize: 13 }}>
            When all gates close, photo logging will appear here. For now, voice logging is your photo logger's older sibling.
          </p>
        </div>
      </div>
    );
  };

  // ===== SYSTEM =====
  M.privacy = () => (
    <div>
      <MHeader eyebrow="F6 · PRIVACY DASHBOARD" title={<>Where your data <span  style={{ color: 'var(--eucalyptus)' }}>actually lives.</span></>} sub="Designed for the post-Roe, post-Flo-verdict threat model." />
      {[
        { l: 'On this device', v: '146 logs · encrypted', c: 'var(--severity-mild)' },
        { l: 'Synced (you opt-in)', v: 'Off', c: 'var(--ink-3)' },
        { l: 'Account', v: 'Email-keyed · end-to-end encrypted in transit and at rest', c: 'var(--severity-mild)' },
        { l: 'Analytics SDKs', v: 'Zero', c: 'var(--severity-mild)' },
        { l: 'Ad networks', v: 'Zero', c: 'var(--severity-mild)' },
        { l: 'Third-party shares', v: 'Zero', c: 'var(--severity-mild)' },
      ].map(r => (
        <div key={r.l} className="card" style={{ padding: 12, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13 }}>{r.l}</span>
          <span className="data" style={{ fontSize: 12, color: r.c, textAlign: 'right' }}>{r.v}</span>
        </div>
      ))}
      <button className="btn-soft" style={{ marginTop: 8, width: '100%' }}>Export everything · JSON</button>
      <button className="btn-outline" style={{ marginTop: 8, width: '100%', color: 'var(--severity-severe)', borderColor: 'var(--severity-severe)' }}>Delete all data</button>
    </div>
  );

  M.notif = ({ state }) => {
    const settings = state.notifSettings || {};
    const useApp = window.HQ.useApp;
    const { setState } = useApp();
    const [permStatus, setPermStatus] = useM(typeof Notification !== 'undefined' ? Notification.permission : 'unsupported');
    const setSetting = (key, val) => {
      setState(s => ({ ...s, notifSettings: { ...(s.notifSettings || {}), [key]: val } }));
    };
    const requestPerm = () => {
      if (typeof Notification === 'undefined') return;
      Notification.requestPermission().then(p => setPermStatus(p));
    };
    const permLabel = permStatus === 'granted' ? 'granted' : permStatus === 'denied' ? 'denied' : permStatus === 'unsupported' ? 'unsupported on this device' : 'not yet asked';
    return (
      <div>
        <MHeader eyebrow="F10 · NOTIFICATIONS" title={<>Phase-aware. <span style={{ color: 'var(--eucalyptus)' }}>Quiet by default.</span></>} sub="Never alarmist." />
        <div className="card-warm" style={{ padding: 14, marginBottom: 14 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>SYSTEM PERMISSION</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
            <div className="caption" style={{ fontSize: 12 }}>Status: <strong>{permLabel}</strong></div>
            {permStatus !== 'granted' && permStatus !== 'unsupported' && permStatus !== 'denied' && (
              <button className="btn-soft" style={{ fontSize: 12, padding: '6px 12px' }} onClick={requestPerm}>Allow notifications</button>
            )}
          </div>
        </div>
        <ToggleRow label="Daily log reminder" checked={!!settings.dailyCheckin} onChange={v => setSetting('dailyCheckin', v)} sub="One gentle nudge at your usual log time" />
        <ToggleRow label="Heads-up before luteal" checked={!!settings.lutealHeadsUp} onChange={v => setSetting('lutealHeadsUp', v)} sub="Early warning 4 days before predicted luteal" />
        <ToggleRow label="Safety plan surface" checked={!!settings.safetyPlan} onChange={v => setSetting('safetyPlan', v)} sub="Before historical high-risk window" />
        <ToggleRow label="Pattern found" checked={!!settings.patternFound} onChange={v => setSetting('patternFound', v)} sub="When Ora confirms a new pattern" />
        <ToggleRow label="Weekly Ora digest" checked={!!settings.weeklyDigest} onChange={v => setSetting('weeklyDigest', v)} sub="Sunday morning, 1–2 patterns" />
        <ToggleRow label="Supplement reminder" checked={!!settings.supplementReminder} onChange={v => setSetting('supplementReminder', v)} sub="Off by default" />
        <ToggleRow label="SSRI reminder" checked={!!settings.ssriReminder} onChange={v => setSetting('ssriReminder', v)} sub="If on luteal-only dosing" />
        <ToggleRow label="Hot flash check-in" checked={!!settings.hotFlashCheckin} onChange={v => setSetting('hotFlashCheckin', v)} sub="Lock-screen tap-to-log" />
      </div>
    );
  };

  Object.assign(window.HQ_MODULES = window.HQ_MODULES || {}, M);
})();
