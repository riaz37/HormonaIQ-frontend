// Modules — set 6: Perimenopause completeness (F65, F66, F71, F78, F79, F81–F87, F90, F91)
(function () {
  const useM = window.useM || React.useState;
  const { MHeader, Stat, Severity, Spark, EvidenceBar, ToggleRow, MSection } = window.HQ_UI;
  const M = {};

  // Small shared helpers
  const todayKey = () => new Date().toISOString().slice(0, 10);
  const weekKey = (d = new Date()) => {
    const tmp = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = tmp.getUTCDay() || 7;
    tmp.setUTCDate(tmp.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
    const week = Math.ceil((((tmp - yearStart) / 86400000) + 1) / 7);
    return `${tmp.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
  };
  const fmtDate = (d) => new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric' });
  const last = (arr, n) => (arr || []).slice(-n);
  const mean = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

  // ============================================================
  // F65 — DEXA Bone Density Vault
  // ============================================================
  M.dexa = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const vault = state.dexaVault || [];
    const [date, setDate] = useM(todayKey());
    const [lumbar, setLumbar] = useM('');
    const [hip, setHip] = useM('');
    const [frax, setFrax] = useM('');

    const addScan = () => {
      const lt = parseFloat(lumbar);
      const ht = parseFloat(hip);
      if (isNaN(lt) || isNaN(ht)) return;
      const fx = frax === '' ? null : parseFloat(frax);
      const next = [...vault, { date, lumbar_t: lt, hip_t: ht, fraxScore: isNaN(fx) ? null : fx }]
        .sort((a, b) => a.date.localeCompare(b.date));
      setState(s => ({ ...s, dexaVault: next }));
      setLumbar(''); setHip(''); setFrax('');
    };

    const interpret = (t) => {
      if (t == null) return { label: '—', color: 'var(--ink-3)' };
      if (t >= -1.0) return { label: 'Normal', color: 'var(--severity-mild)' };
      if (t >= -2.5) return { label: 'Osteopenia', color: 'var(--severity-mod)' };
      return { label: 'Osteoporosis', color: 'var(--severity-severe)' };
    };

    const latest = vault[vault.length - 1];
    const lumbarSeries = vault.map(v => v.lumbar_t);
    const hipSeries = vault.map(v => v.hip_t);

    return (
      <div>
        <MHeader eyebrow="F65 · DEXA BONE VAULT" title={<>Track your <span style={{ color: 'var(--eucalyptus)' }}>T-scores</span> over time.</>} sub="Lumbar spine and hip T-scores. Optional FRAX 10-year fracture risk." />

        <div className="card-warm" style={{ padding: 14, marginBottom: 14 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>ADD SCAN</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 8 }}>
            <label style={{ fontSize: 11 }}>
              <div className="caption" style={{ marginBottom: 4 }}>Scan date</div>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)' }} />
            </label>
            <label style={{ fontSize: 11 }}>
              <div className="caption" style={{ marginBottom: 4 }}>FRAX 10-yr (%)</div>
              <input type="number" step="0.1" value={frax} onChange={e => setFrax(e.target.value)} placeholder="optional" style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)' }} />
            </label>
            <label style={{ fontSize: 11 }}>
              <div className="caption" style={{ marginBottom: 4 }}>Lumbar T-score</div>
              <input type="number" step="0.1" value={lumbar} onChange={e => setLumbar(e.target.value)} placeholder="-1.2" style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)' }} />
            </label>
            <label style={{ fontSize: 11 }}>
              <div className="caption" style={{ marginBottom: 4 }}>Hip T-score</div>
              <input type="number" step="0.1" value={hip} onChange={e => setHip(e.target.value)} placeholder="-1.0" style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)' }} />
            </label>
          </div>
          <button className="btn-primary" style={{ width: '100%' }} onClick={addScan}>Add scan</button>
        </div>

        {latest && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <Stat label="Latest lumbar" value={latest.lumbar_t.toFixed(1)} color={interpret(latest.lumbar_t).color} sub={interpret(latest.lumbar_t).label} />
            <Stat label="Latest hip" value={latest.hip_t.toFixed(1)} color={interpret(latest.hip_t).color} sub={interpret(latest.hip_t).label} />
            {latest.fraxScore != null && <Stat label="FRAX 10-yr" value={latest.fraxScore + '%'} sub="major fracture" />}
          </div>
        )}

        {vault.length >= 2 && (
          <MSection title="LUMBAR T-SCORE TREND">
            <div className="card" style={{ padding: 12 }}>
              <Spark data={lumbarSeries} color="var(--eucalyptus)" height={50} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }} className="caption">
                <span>{fmtDate(vault[0].date)}</span>
                <span>{fmtDate(vault[vault.length - 1].date)}</span>
              </div>
            </div>
          </MSection>
        )}

        {vault.length >= 2 && (
          <MSection title="HIP T-SCORE TREND">
            <div className="card" style={{ padding: 12 }}>
              <Spark data={hipSeries} color="var(--severity-mod)" height={50} />
            </div>
          </MSection>
        )}

        <MSection title={vault.length ? 'ALL SCANS' : 'NO SCANS YET'}>
          {vault.length === 0 && <div className="caption" style={{ fontSize: 12 }}>Enter your first DEXA scan above.</div>}
          {vault.slice().reverse().map((s, i) => {
            const lI = interpret(s.lumbar_t);
            const hI = interpret(s.hip_t);
            return (
              <div key={i} className="card" style={{ padding: 12, marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div className="data" style={{ fontSize: 13 }}>{fmtDate(s.date)}</div>
                  {s.fraxScore != null && <div className="caption" style={{ fontSize: 11 }}>FRAX {s.fraxScore}%</div>}
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div className="caption" style={{ fontSize: 11 }}>Lumbar</div>
                    <div className="data" style={{ fontSize: 14, color: lI.color }}>{s.lumbar_t.toFixed(1)} · {lI.label}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div className="caption" style={{ fontSize: 11 }}>Hip</div>
                    <div className="data" style={{ fontSize: 14, color: hI.color }}>{s.hip_t.toFixed(1)} · {hI.label}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </MSection>

        <div className="card-mint" style={{ padding: 12, marginTop: 6 }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>INTERPRETATION GUIDE</div>
          <div style={{ fontSize: 12, lineHeight: 1.6 }}>
            <div><strong style={{ color: 'var(--severity-mild)' }}>T ≥ -1.0</strong> · Normal bone density</div>
            <div><strong style={{ color: 'var(--severity-mod)' }}>-1.1 to -2.4</strong> · Osteopenia (low bone mass)</div>
            <div><strong style={{ color: 'var(--severity-severe)' }}>T ≤ -2.5</strong> · Osteoporosis</div>
          </div>
          <div className="caption" style={{ fontSize: 10, marginTop: 6, color: 'var(--ink-3)' }}>WHO 1994 criteria · ISCD 2019 official positions</div>
        </div>
      </div>
    );
  };

  // ============================================================
  // F66 — Blood Pressure Log
  // ============================================================
  M.bp = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const log = state.bpLog || {};
    const [date, setDate] = useM(todayKey());
    const [sys, setSys] = useM('');
    const [dia, setDia] = useM('');
    const [pulse, setPulse] = useM('');

    const today = log[date] || {};
    const save = () => {
      const s = parseInt(sys, 10), d = parseInt(dia, 10), p = parseInt(pulse, 10);
      if (isNaN(s) || isNaN(d)) return;
      setState(st => ({
        ...st,
        bpLog: {
          ...(st.bpLog || {}),
          [date]: { systolic: s, diastolic: d, pulse: isNaN(p) ? null : p },
        },
      }));
      setSys(''); setDia(''); setPulse('');
    };

    const stage = (s, d) => {
      if (s == null || d == null) return null;
      if (s >= 180 || d >= 120) return { l: 'Hypertensive crisis', c: 'var(--severity-severe)' };
      if (s >= 140 || d >= 90) return { l: 'Stage 2 hypertension', c: 'var(--severity-severe)' };
      if (s >= 130 || d >= 80) return { l: 'Stage 1 hypertension', c: 'var(--severity-mod)' };
      if (s >= 120 && d < 80) return { l: 'Elevated', c: 'var(--severity-mild)' };
      return { l: 'Normal', c: 'var(--severity-mild)' };
    };

    const dates = Object.keys(log).sort();
    const recent = dates.slice(-30).map(k => ({ date: k, ...log[k] }));
    const last7 = recent.slice(-7);
    const last30 = recent.slice(-30);
    const avgSys30 = last30.length ? Math.round(mean(last30.map(r => r.systolic))) : null;
    const avgDia30 = last30.length ? Math.round(mean(last30.map(r => r.diastolic))) : null;

    const stage1or2Days = last30.filter(r => {
      const st = stage(r.systolic, r.diastolic);
      return st && (st.l.includes('Stage') || st.l === 'Hypertensive crisis');
    }).length;

    return (
      <div>
        <MHeader eyebrow="F66 · BLOOD PRESSURE" title={<>Daily BP, <span style={{ color: 'var(--eucalyptus)' }}>weekly view.</span></>} sub="Capture systolic, diastolic, pulse. Stage alerts per ACC/AHA 2017." />

        <div className="card-warm" style={{ padding: 14, marginBottom: 14 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>LOG READING</div>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)', marginBottom: 8 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 8 }}>
            <label style={{ fontSize: 11 }}>
              <div className="caption" style={{ marginBottom: 4 }}>Systolic</div>
              <input type="number" value={sys} onChange={e => setSys(e.target.value)} placeholder="120" style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)' }} />
            </label>
            <label style={{ fontSize: 11 }}>
              <div className="caption" style={{ marginBottom: 4 }}>Diastolic</div>
              <input type="number" value={dia} onChange={e => setDia(e.target.value)} placeholder="80" style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)' }} />
            </label>
            <label style={{ fontSize: 11 }}>
              <div className="caption" style={{ marginBottom: 4 }}>Pulse</div>
              <input type="number" value={pulse} onChange={e => setPulse(e.target.value)} placeholder="72" style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)' }} />
            </label>
          </div>
          <button className="btn-primary" style={{ width: '100%' }} onClick={save}>Save reading</button>
        </div>

        {(avgSys30 != null) && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <Stat label="30-day avg" value={`${avgSys30}/${avgDia30}`} sub={`${last30.length} readings`} />
            <Stat label="Stage 1+ days" value={String(stage1or2Days)} color={stage1or2Days >= 7 ? 'var(--severity-severe)' : 'var(--severity-mod)'} sub="last 30d" />
          </div>
        )}

        {stage1or2Days >= 7 && (
          <div className="card-warm" style={{ padding: 12, marginBottom: 14, borderLeft: '3px solid var(--severity-severe)' }}>
            <div className="eyebrow" style={{ marginBottom: 4, color: 'var(--severity-severe)' }}>HYPERTENSION PATTERN</div>
            <div style={{ fontSize: 13 }}>{stage1or2Days} of last 30 readings in Stage 1 or higher. Worth a primary-care conversation.</div>
          </div>
        )}

        {last7.length >= 2 && (
          <MSection title="LAST 7 DAYS · SYSTOLIC">
            <div className="card" style={{ padding: 12 }}>
              <Spark data={last7.map(r => r.systolic)} color="var(--coral)" height={40} />
            </div>
          </MSection>
        )}

        <MSection title={recent.length ? 'RECENT READINGS' : 'NO READINGS YET'}>
          {recent.length === 0 && <div className="caption" style={{ fontSize: 12 }}>Log your first reading above.</div>}
          {recent.slice().reverse().slice(0, 14).map((r, i) => {
            const st = stage(r.systolic, r.diastolic);
            return (
              <div key={i} className="card" style={{ padding: 10, marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div className="data" style={{ fontSize: 13 }}>{fmtDate(r.date)} · {r.systolic}/{r.diastolic}{r.pulse != null ? ` · ${r.pulse} bpm` : ''}</div>
                </div>
                {st && <div className="phase-pill" style={{ background: st.c + '20', color: st.c }}>{st.l}</div>}
              </div>
            );
          })}
        </MSection>

        <div className="card-mint" style={{ padding: 12, marginTop: 6 }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>STAGE GUIDE (ACC/AHA)</div>
          <div style={{ fontSize: 12, lineHeight: 1.6 }}>
            <div>Normal: &lt;120/80</div>
            <div>Elevated: 120–129/&lt;80</div>
            <div>Stage 1: 130–139/80–89</div>
            <div>Stage 2: ≥140/≥90</div>
            <div>Crisis: ≥180/≥120 (urgent)</div>
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // F71 — Non-hormonal treatment tracker
  // ============================================================
  M.periNonHrt = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const treatments = state.periNonHrtLog || [];
    const [name, setName] = useM('');
    const [dose, setDose] = useM('');
    const [startDate, setStartDate] = useM(todayKey());

    const COMMON = [
      { name: 'Paroxetine (SSRI)', dose: '7.5 mg' },
      { name: 'Venlafaxine (SNRI)', dose: '75 mg' },
      { name: 'Gabapentin', dose: '300 mg TID' },
      { name: 'Clonidine', dose: '0.1 mg' },
      { name: 'Oxybutynin', dose: '5 mg' },
    ];

    const addTreatment = () => {
      if (!name.trim()) return;
      const next = [...treatments, { name: name.trim(), dose: dose.trim(), response_nrs: [], startDate }];
      setState(s => ({ ...s, periNonHrtLog: next }));
      setName(''); setDose('');
    };

    const logResponse = (idx, nrs) => {
      const next = treatments.map((t, i) => i === idx ? { ...t, response_nrs: [...(t.response_nrs || []), { at: Date.now(), nrs }] } : t);
      setState(s => ({ ...s, periNonHrtLog: next }));
    };

    const removeTx = (idx) => {
      const next = treatments.filter((_, i) => i !== idx);
      setState(s => ({ ...s, periNonHrtLog: next }));
    };

    const weeksSince = (d) => Math.floor((Date.now() - new Date(d).getTime()) / (7 * 86400000));

    return (
      <div>
        <MHeader eyebrow="F71 · NON-HORMONAL TREATMENTS" title={<>Track <span style={{ color: 'var(--eucalyptus)' }}>response over 8 weeks.</span></>} sub="SSRIs, SNRIs, gabapentin, clonidine, bladder-targeted agents." />

        <div className="card-warm" style={{ padding: 14, marginBottom: 14 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>ADD TREATMENT</div>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Medication name" style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)', marginBottom: 6 }} />
          <input type="text" value={dose} onChange={e => setDose(e.target.value)} placeholder="Dose & frequency (e.g. 7.5 mg daily)" style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)', marginBottom: 6 }} />
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)', marginBottom: 8 }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
            {COMMON.map(c => (
              <button key={c.name} className="btn-soft" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => { setName(c.name); setDose(c.dose); }}>{c.name}</button>
            ))}
          </div>
          <button className="btn-primary" style={{ width: '100%' }} onClick={addTreatment}>Add treatment</button>
        </div>

        <MSection title={treatments.length ? 'ACTIVE TREATMENTS' : 'NO TREATMENTS LOGGED'}>
          {treatments.length === 0 && <div className="caption" style={{ fontSize: 12 }}>Add your first treatment above.</div>}
          {treatments.map((t, i) => {
            const w = weeksSince(t.startDate);
            const responses = t.response_nrs || [];
            const recent = responses.slice(-7);
            const avg = recent.length ? mean(recent.map(r => r.nrs)) : null;
            const trend = responses.length >= 2
              ? (responses[responses.length - 1].nrs - responses[0].nrs)
              : 0;
            return (
              <div key={i} className="card-warm" style={{ padding: 14, marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{t.name}</div>
                    <div className="caption" style={{ fontSize: 11 }}>{t.dose} · started {fmtDate(t.startDate)} · week {Math.max(0, w)}/8</div>
                  </div>
                  <button onClick={() => removeTx(i)} style={{ background: 'transparent', border: 'none', color: 'var(--ink-3)', fontSize: 11, cursor: 'pointer' }}>remove</button>
                </div>
                <div style={{ height: 4, background: 'var(--mint-mist)', borderRadius: 999, marginBottom: 10 }}>
                  <div style={{ width: Math.min(100, (Math.max(0, w) / 8) * 100) + '%', height: '100%', background: 'var(--eucalyptus)', borderRadius: 999 }} />
                </div>
                <div className="caption" style={{ fontSize: 11, marginBottom: 4 }}>Symptom relief today (0 = none, 10 = full relief)</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(11, 1fr)', gap: 2 }}>
                  {Array.from({ length: 11 }, (_, n) => (
                    <button key={n} onClick={() => logResponse(i, n)} style={{ padding: '6px 0', fontSize: 11, borderRadius: 4, border: '1px solid var(--border)', background: 'var(--surface)', cursor: 'pointer' }}>{n}</button>
                  ))}
                </div>
                {avg != null && (
                  <div className="caption" style={{ fontSize: 11, marginTop: 8 }}>
                    Recent avg: <strong>{avg.toFixed(1)}/10</strong> · {responses.length} entries · trend {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'}
                  </div>
                )}
                {recent.length >= 3 && (
                  <div style={{ marginTop: 8 }}>
                    <Spark data={recent.map(r => r.nrs)} color="var(--eucalyptus)" height={30} />
                  </div>
                )}
              </div>
            );
          })}
        </MSection>

        <div className="card-mint" style={{ padding: 12, marginTop: 6 }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>EVIDENCE NOTE</div>
          <div style={{ fontSize: 12, lineHeight: 1.5 }}>
            Paroxetine 7.5 mg is the only non-hormonal therapy FDA-approved for vasomotor symptoms. SNRIs, gabapentin, and clonidine are off-label but evidence-supported (NAMS 2023 position statement).
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // F78 — Cardiovascular Risk Dashboard
  // ============================================================
  M.cvDash = ({ state }) => {
    // R7 QA fix — convention across the app is state.labs (not state.labVault)
    const labVault = state.labs || [];
    const bpLog = state.bpLog || {};
    const currentYear = new Date().getFullYear();
    const age = currentYear - (state.yearOfBirth || 1985);

    // Pull most recent lipid panel from labVault (if structured that way)
    const findLab = (keys) => {
      for (let i = labVault.length - 1; i >= 0; i--) {
        const lab = labVault[i];
        const vals = lab.values || lab;
        for (const k of keys) {
          if (vals[k] != null) return { value: +vals[k], date: lab.date };
        }
      }
      return null;
    };
    const tc = findLab(['TC', 'totalCholesterol', 'total_cholesterol']);
    const hdl = findLab(['HDL', 'hdl']);
    const ldl = findLab(['LDL', 'ldl']);
    const tg = findLab(['TG', 'triglycerides']);
    const glu = findLab(['fastingGlucose', 'glucose', 'fasting_glucose']);
    const waist = state.waistCircumference;

    // Compute BP averages
    const bpDates = Object.keys(bpLog).sort();
    const bpRecent = bpDates.slice(-30).map(k => bpLog[k]);
    const sysAvg = bpRecent.length ? Math.round(mean(bpRecent.map(b => b.systolic))) : null;
    const diaAvg = bpRecent.length ? Math.round(mean(bpRecent.map(b => b.diastolic))) : null;

    // Simplified Framingham 10-year general CVD risk (women)
    // ATP III simplified — not a substitute for clinical calculator
    const framingham = (() => {
      if (!tc || !hdl || sysAvg == null || age < 30) return null;
      // Points for women (very simplified ATP III — for educational display only)
      let pts = 0;
      if (age >= 70) pts += 12;
      else if (age >= 60) pts += 8;
      else if (age >= 50) pts += 6;
      else if (age >= 40) pts += 3;
      if (tc.value >= 280) pts += 4;
      else if (tc.value >= 240) pts += 3;
      else if (tc.value >= 200) pts += 2;
      else if (tc.value >= 160) pts += 1;
      if (hdl.value < 40) pts += 2;
      else if (hdl.value < 50) pts += 1;
      else if (hdl.value >= 60) pts -= 1;
      if (sysAvg >= 160) pts += 4;
      else if (sysAvg >= 140) pts += 3;
      else if (sysAvg >= 130) pts += 2;
      else if (sysAvg >= 120) pts += 1;
      if (state.smoker) pts += 3;
      if (state.diabetic || (glu && glu.value >= 126)) pts += 4;
      // Map points to approximate 10-yr risk
      const riskMap = { '<9': 1, '9-12': 2, '13-14': 4, '15-16': 8, '17-18': 12, '19-20': 18, '21+': 25 };
      let band;
      if (pts < 9) band = '<9'; else if (pts <= 12) band = '9-12';
      else if (pts <= 14) band = '13-14'; else if (pts <= 16) band = '15-16';
      else if (pts <= 18) band = '17-18'; else if (pts <= 20) band = '19-20'; else band = '21+';
      return { points: pts, percent: riskMap[band], band };
    })();

    // Window of opportunity
    const fmpYear = state.finalMenstrualPeriodYear;
    const yearsSinceFMP = fmpYear ? currentYear - fmpYear : null;
    const inWindow = age < 60 && (yearsSinceFMP == null || yearsSinceFMP < 10);

    return (
      <div>
        <MHeader eyebrow="F78 · CARDIOVASCULAR DASHBOARD" title={<>Your <span style={{ color: 'var(--eucalyptus)' }}>10-year</span> heart picture.</>} sub="BP, lipids, glucose, waist — and the HRT timing window." />

        <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
          <Stat label="BP avg" value={sysAvg ? `${sysAvg}/${diaAvg}` : '—'} sub={bpRecent.length ? `${bpRecent.length} readings` : 'no data'} />
          {framingham && <Stat label="10-yr CVD risk" value={framingham.percent + '%'} color={framingham.percent >= 10 ? 'var(--severity-severe)' : framingham.percent >= 5 ? 'var(--severity-mod)' : 'var(--severity-mild)'} sub={`Framingham (${framingham.band} pts)`} />}
        </div>

        <MSection title="LIPID PANEL">
          {[
            { l: 'Total cholesterol', v: tc, target: '<200 mg/dL', flag: (x) => x >= 240 ? 'severe' : x >= 200 ? 'mod' : 'mild' },
            { l: 'LDL', v: ldl, target: '<100 mg/dL', flag: (x) => x >= 160 ? 'severe' : x >= 130 ? 'mod' : 'mild' },
            { l: 'HDL', v: hdl, target: '≥50 mg/dL', flag: (x) => x < 40 ? 'severe' : x < 50 ? 'mod' : 'mild' },
            { l: 'Triglycerides', v: tg, target: '<150 mg/dL', flag: (x) => x >= 200 ? 'severe' : x >= 150 ? 'mod' : 'mild' },
          ].map(r => {
            const colorMap = { mild: 'var(--severity-mild)', mod: 'var(--severity-mod)', severe: 'var(--severity-severe)' };
            const flag = r.v ? r.flag(r.v.value) : null;
            return (
              <div key={r.l} className="card" style={{ padding: 12, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{r.l}</div>
                  <div className="caption" style={{ fontSize: 11 }}>Target: {r.target}{r.v ? ` · ${fmtDate(r.v.date)}` : ''}</div>
                </div>
                <div className="data" style={{ fontSize: 14, color: flag ? colorMap[flag] : 'var(--ink-3)' }}>
                  {r.v ? `${r.v.value} mg/dL` : '—'}
                </div>
              </div>
            );
          })}
        </MSection>

        <MSection title="METABOLIC">
          <div className="card" style={{ padding: 12, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Fasting glucose</div>
              <div className="caption" style={{ fontSize: 11 }}>Target: &lt;100 mg/dL</div>
            </div>
            <div className="data" style={{ fontSize: 14 }}>{glu ? `${glu.value} mg/dL` : '—'}</div>
          </div>
          <div className="card" style={{ padding: 12, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Waist circumference</div>
              <div className="caption" style={{ fontSize: 11 }}>Target: &lt;88 cm (35 in)</div>
            </div>
            <div className="data" style={{ fontSize: 14 }}>{waist != null ? `${waist} cm` : '—'}</div>
          </div>
        </MSection>

        <div className="card-warm" style={{ padding: 14, marginTop: 14, borderLeft: `3px solid ${inWindow ? 'var(--eucalyptus)' : 'var(--severity-mod)'}` }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>HRT TIMING · WINDOW OF OPPORTUNITY</div>
          <p className="body" style={{ fontSize: 13, marginBottom: 8 }}>
            HRT initiated <strong>before age 60 AND within 10 years of menopause</strong> shows cardiovascular protection in observational and randomized data. Initiation later carries a different risk profile.
          </p>
          <div className="caption" style={{ fontSize: 12 }}>
            Age {age}{yearsSinceFMP != null ? ` · ${yearsSinceFMP}y post-FMP` : ''} — {inWindow ? 'in the protective window' : 'outside the protective window — different conversation needed'}.
          </div>
          <div className="caption" style={{ fontSize: 10, marginTop: 6, color: 'var(--ink-3)' }}>
            WHI age-stratified reanalysis · ELITE trial · NAMS 2022 position
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // F79 — Bone Health Dashboard
  // ============================================================
  M.boneDash = ({ state }) => {
    const vault = state.dexaVault || [];
    const supplements = state.supplements || [];
    const latest = vault[vault.length - 1];

    const interpretT = (t) => {
      if (t == null) return null;
      if (t >= -1.0) return { l: 'Normal', c: 'var(--severity-mild)' };
      if (t >= -2.5) return { l: 'Osteopenia', c: 'var(--severity-mod)' };
      return { l: 'Osteoporosis', c: 'var(--severity-severe)' };
    };

    // Find calcium / vit D
    const findSupp = (re) => supplements.find(s => re.test((s.name || '').toLowerCase()));
    const calc = findSupp(/calcium/);
    const vitD = findSupp(/vitamin\s*d|vit\s*d|cholecalciferol/);

    const calciumMg = calc ? parseFloat((calc.dose || '').match(/[\d.]+/)?.[0] || '0') : 0;
    const vitDIU = vitD ? parseFloat((vitD.dose || '').match(/[\d.]+/)?.[0] || '0') : 0;

    const calcAdequate = calciumMg >= 1000;
    const vitDAdequate = vitDIU >= 800;

    const lI = latest ? interpretT(latest.lumbar_t) : null;
    const hI = latest ? interpretT(latest.hip_t) : null;

    return (
      <div>
        <MHeader eyebrow="F79 · BONE HEALTH" title={<>Your <span style={{ color: 'var(--eucalyptus)' }}>skeleton</span>, watched.</>} sub="DEXA + supplement adequacy + 10-year fracture risk." />

        {!latest && (
          <div className="card-warm" style={{ padding: 18, marginBottom: 14 }}>
            <p className="body" style={{ fontSize: 13 }}>
              No DEXA scan logged yet. Add your most recent scan in <strong>F65 · DEXA Vault</strong> to populate this dashboard.
            </p>
          </div>
        )}

        {latest && (
          <>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <Stat label="Lumbar T" value={latest.lumbar_t.toFixed(1)} color={lI.c} sub={lI.l} />
              <Stat label="Hip T" value={latest.hip_t.toFixed(1)} color={hI.c} sub={hI.l} />
              {latest.fraxScore != null && <Stat label="FRAX 10-yr" value={latest.fraxScore + '%'} color={latest.fraxScore >= 20 ? 'var(--severity-severe)' : latest.fraxScore >= 10 ? 'var(--severity-mod)' : 'var(--severity-mild)'} sub="major fx" />}
            </div>

            {latest.fraxScore != null && (
              <MSection title="FRAX 10-YEAR RISK">
                <div className="card-warm" style={{ padding: 14 }}>
                  <div style={{ height: 12, background: 'var(--mint-mist)', borderRadius: 999, position: 'relative', marginBottom: 8 }}>
                    <div style={{ width: Math.min(100, latest.fraxScore * 2) + '%', height: '100%', background: latest.fraxScore >= 20 ? 'var(--severity-severe)' : latest.fraxScore >= 10 ? 'var(--severity-mod)' : 'var(--severity-mild)', borderRadius: 999 }} />
                  </div>
                  <div className="caption" style={{ fontSize: 11 }}>
                    {latest.fraxScore >= 20 ? 'High risk — pharmacologic therapy typically indicated.' : latest.fraxScore >= 10 ? 'Intermediate risk — discuss treatment thresholds.' : 'Lower risk — lifestyle measures.'}
                  </div>
                </div>
              </MSection>
            )}
          </>
        )}

        <MSection title="NUTRIENT ADEQUACY">
          <div className="card" style={{ padding: 12, marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Calcium</span>
              <span className="data" style={{ fontSize: 12, color: calcAdequate ? 'var(--severity-mild)' : 'var(--severity-mod)' }}>{calciumMg || 0} mg / 1000+ mg</span>
            </div>
            <div style={{ height: 6, background: 'var(--mint-mist)', borderRadius: 999 }}>
              <div style={{ width: Math.min(100, (calciumMg / 1200) * 100) + '%', height: '100%', background: calcAdequate ? 'var(--severity-mild)' : 'var(--severity-mod)', borderRadius: 999 }} />
            </div>
            <div className="caption" style={{ fontSize: 11, marginTop: 6 }}>
              Postmenopausal target: 1200 mg/day total (diet + supplements). NIH ODS.
            </div>
          </div>

          <div className="card" style={{ padding: 12, marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Vitamin D</span>
              <span className="data" style={{ fontSize: 12, color: vitDAdequate ? 'var(--severity-mild)' : 'var(--severity-mod)' }}>{vitDIU || 0} IU / 800+ IU</span>
            </div>
            <div style={{ height: 6, background: 'var(--mint-mist)', borderRadius: 999 }}>
              <div style={{ width: Math.min(100, (vitDIU / 2000) * 100) + '%', height: '100%', background: vitDAdequate ? 'var(--severity-mild)' : 'var(--severity-mod)', borderRadius: 999 }} />
            </div>
            <div className="caption" style={{ fontSize: 11, marginTop: 6 }}>
              Postmenopausal target: 800–1000 IU/day. Higher if 25(OH)D &lt; 30 ng/mL.
            </div>
          </div>
        </MSection>

        <div className="card-mint" style={{ padding: 12 }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>BONE-LOSS PREVENTION</div>
          <div style={{ fontSize: 12, lineHeight: 1.6 }}>
            Weight-bearing exercise 3–5×/week · Resistance training 2×/week · Adequate protein (1.0–1.2 g/kg) · Limit alcohol &lt;7/week · No smoking.
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // F81 — Menopause Rating Scale (MRS)
  // ============================================================
  M.mrs = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const ITEMS = [
      // Somatovegetative (1-4)
      { k: 0, sub: 'somatovegetative', label: 'Hot flashes, sweating' },
      { k: 1, sub: 'somatovegetative', label: 'Heart discomfort (racing, palpitations)' },
      { k: 2, sub: 'somatovegetative', label: 'Sleep problems' },
      { k: 3, sub: 'somatovegetative', label: 'Joint and muscular discomfort' },
      // Psychological (5-8)
      { k: 4, sub: 'psychological', label: 'Depressive mood' },
      { k: 5, sub: 'psychological', label: 'Irritability' },
      { k: 6, sub: 'psychological', label: 'Anxiety' },
      { k: 7, sub: 'psychological', label: 'Physical and mental exhaustion' },
      // Urogenital (9-11)
      { k: 8, sub: 'urogenital', label: 'Sexual problems' },
      { k: 9, sub: 'urogenital', label: 'Bladder problems' },
      { k: 10, sub: 'urogenital', label: 'Vaginal dryness' },
    ];
    const ANCHORS = ['None', 'Mild', 'Moderate', 'Severe', 'Very severe'];
    const tk = todayKey();
    const stored = (state.mrsLog && state.mrsLog[tk]) || {};
    const initialItems = stored.items || Array(11).fill(0);
    const [items, setItems] = useM(initialItems);

    const setItem = (idx, v) => {
      const next = items.slice();
      next[idx] = v;
      setItems(next);
      const somato = next.slice(0, 4).reduce((a, b) => a + b, 0);
      const psych = next.slice(4, 8).reduce((a, b) => a + b, 0);
      const uro = next.slice(8, 11).reduce((a, b) => a + b, 0);
      const total = somato + psych + uro;
      setState(s => ({
        ...s,
        mrsLog: {
          ...(s.mrsLog || {}),
          [tk]: { items: next, somatovegetative: somato, psychological: psych, urogenital: uro, total },
        },
      }));
    };

    const somato = items.slice(0, 4).reduce((a, b) => a + b, 0);
    const psych = items.slice(4, 8).reduce((a, b) => a + b, 0);
    const uro = items.slice(8, 11).reduce((a, b) => a + b, 0);
    const total = somato + psych + uro;

    const totalSeverity = (() => {
      if (total < 5) return { l: 'No / minimal symptoms', c: 'var(--severity-mild)' };
      if (total <= 8) return { l: 'Mild', c: 'var(--severity-mild)' };
      if (total <= 16) return { l: 'Moderate', c: 'var(--severity-mod)' };
      return { l: 'Severe', c: 'var(--severity-severe)' };
    })();

    const groups = [
      { key: 'somatovegetative', l: 'Somatovegetative', max: 16, val: somato, range: [0, 3] },
      { key: 'psychological', l: 'Psychological', max: 16, val: psych, range: [4, 7] },
      { key: 'urogenital', l: 'Urogenital', max: 12, val: uro, range: [8, 10] },
    ];

    return (
      <div>
        <MHeader eyebrow="F81 · MENOPAUSE RATING SCALE" title={<>11 items, <span style={{ color: 'var(--eucalyptus)' }}>three subscales.</span></>} sub="0 = none · 1 = mild · 2 = moderate · 3 = severe · 4 = very severe" />

        <div className="card-warm" style={{ padding: 16, marginBottom: 14, textAlign: 'center', background: 'linear-gradient(135deg, var(--paper), var(--mint-pale))' }}>
          <div className="data" style={{ fontSize: 32, fontWeight: 500, color: totalSeverity.c }}>{total}<span style={{ fontSize: 16, color: 'var(--ink-3)' }}> / 44</span></div>
          <div className="caption" style={{ marginTop: 4 }}>Total · {totalSeverity.l}</div>
        </div>

        {groups.map(g => (
          <div key={g.key} className="card" style={{ padding: 12, marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{g.l}</span>
              <span className="data" style={{ fontSize: 12 }}>{g.val}/{g.max}</span>
            </div>
            <div style={{ height: 6, background: 'var(--mint-mist)', borderRadius: 999 }}>
              <div style={{ width: ((g.val / g.max) * 100) + '%', height: '100%', background: 'var(--eucalyptus)', borderRadius: 999 }} />
            </div>
          </div>
        ))}

        <div style={{ marginTop: 18 }}>
          {groups.map(g => (
            <MSection key={g.key} title={g.l.toUpperCase()}>
              {ITEMS.filter(it => it.sub === g.key).map(it => (
                <div key={it.k} style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: 13, marginBottom: 6 }}>{it.label}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
                    {[0, 1, 2, 3, 4].map(n => (
                      <button
                        key={n}
                        onClick={() => setItem(it.k, n)}
                        style={{
                          padding: '6px 4px', borderRadius: 6,
                          background: items[it.k] === n ? 'var(--eucalyptus)' : 'var(--surface)',
                          color: items[it.k] === n ? '#fff' : 'inherit',
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

        <div className="card-mint" style={{ padding: 12, marginTop: 6 }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>TOTAL SCORE BANDS</div>
          <div style={{ fontSize: 12, lineHeight: 1.6 }}>
            <div>0–4: No / minimal symptoms</div>
            <div>5–8: Mild</div>
            <div>9–16: Moderate</div>
            <div>17+: Severe</div>
          </div>
          <div className="caption" style={{ fontSize: 10, marginTop: 6, color: 'var(--ink-3)' }}>
            Heinemann LA et al. Health Qual Life Outcomes 2003;1:28
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // F82 — Female Sexual Function Index (FSFI)
  // ============================================================
  M.fsfi = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const tk = todayKey();
    const stored = (state.fsfiLog && state.fsfiLog[tk]) || {};
    const [optedIn, setOptedIn] = useM(!!state.fsfiOptedIn || !!stored.items);
    const [items, setItems] = useM(stored.items || Array(19).fill(0));

    const ITEMS = [
      // Desire (1-2) — 1-5 scale
      { idx: 0, domain: 'desire', q: 'How often did you feel sexual desire?', anchors: ['Almost never', 'Few times', 'Sometimes', 'Most times', 'Almost always'], scale: 5, min: 1 },
      { idx: 1, domain: 'desire', q: 'How would you rate your level of sexual desire?', anchors: ['Very low', 'Low', 'Moderate', 'High', 'Very high'], scale: 5, min: 1 },
      // Arousal (3-6) — 0-5
      { idx: 2, domain: 'arousal', q: 'How often did you feel sexually aroused during activity?', anchors: ['No activity', 'Almost never', 'Few', 'Some', 'Most', 'Almost always'], scale: 6, min: 0 },
      { idx: 3, domain: 'arousal', q: 'How would you rate your level of arousal?', anchors: ['No activity', 'Very low', 'Low', 'Moderate', 'High', 'Very high'], scale: 6, min: 0 },
      { idx: 4, domain: 'arousal', q: 'How confident were you about becoming aroused?', anchors: ['No activity', 'Very low', 'Low', 'Moderate', 'High', 'Very high'], scale: 6, min: 0 },
      { idx: 5, domain: 'arousal', q: 'How often were you satisfied with your arousal?', anchors: ['No activity', 'Almost never', 'Few', 'Some', 'Most', 'Almost always'], scale: 6, min: 0 },
      // Lubrication (7-10) — 0-5
      { idx: 6, domain: 'lubrication', q: 'How often did you become lubricated during activity?', anchors: ['No activity', 'Almost never', 'Few', 'Some', 'Most', 'Almost always'], scale: 6, min: 0 },
      { idx: 7, domain: 'lubrication', q: 'How difficult was it to become lubricated?', anchors: ['No activity', 'Extremely difficult', 'Very difficult', 'Difficult', 'Slightly difficult', 'Not difficult'], scale: 6, min: 0 },
      { idx: 8, domain: 'lubrication', q: 'How often did you maintain lubrication until completion?', anchors: ['No activity', 'Almost never', 'Few', 'Some', 'Most', 'Almost always'], scale: 6, min: 0 },
      { idx: 9, domain: 'lubrication', q: 'How difficult was it to maintain lubrication?', anchors: ['No activity', 'Extremely difficult', 'Very difficult', 'Difficult', 'Slightly difficult', 'Not difficult'], scale: 6, min: 0 },
      // Orgasm (11-13) — 0-5
      { idx: 10, domain: 'orgasm', q: 'How often did you reach orgasm?', anchors: ['No activity', 'Almost never', 'Few', 'Some', 'Most', 'Almost always'], scale: 6, min: 0 },
      { idx: 11, domain: 'orgasm', q: 'How difficult was it to reach orgasm?', anchors: ['No activity', 'Extremely difficult', 'Very difficult', 'Difficult', 'Slightly difficult', 'Not difficult'], scale: 6, min: 0 },
      { idx: 12, domain: 'orgasm', q: 'How satisfied were you with your ability to reach orgasm?', anchors: ['No activity', 'Very dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very satisfied'], scale: 6, min: 0 },
      // Satisfaction (14-16) — items 14: 0-5, 15-16: 1-5
      { idx: 13, domain: 'satisfaction', q: 'How satisfied were you with the closeness with your partner?', anchors: ['No activity', 'Very dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very satisfied'], scale: 6, min: 0 },
      { idx: 14, domain: 'satisfaction', q: 'How satisfied have you been with your sexual relationship?', anchors: ['Very dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very satisfied'], scale: 5, min: 1 },
      { idx: 15, domain: 'satisfaction', q: 'How satisfied have you been with your overall sex life?', anchors: ['Very dissatisfied', 'Dissatisfied', 'Neutral', 'Satisfied', 'Very satisfied'], scale: 5, min: 1 },
      // Pain (17-19) — 0-5
      { idx: 16, domain: 'pain', q: 'How often did you experience discomfort/pain during penetration?', anchors: ['Did not attempt', 'Almost always', 'Most times', 'Sometimes', 'Few times', 'Almost never'], scale: 6, min: 0 },
      { idx: 17, domain: 'pain', q: 'How often did you experience discomfort/pain after penetration?', anchors: ['Did not attempt', 'Almost always', 'Most times', 'Sometimes', 'Few times', 'Almost never'], scale: 6, min: 0 },
      { idx: 18, domain: 'pain', q: 'How would you rate your level of discomfort/pain?', anchors: ['Did not attempt', 'Very high', 'High', 'Moderate', 'Low', 'Very low'], scale: 6, min: 0 },
    ];

    const WEIGHTS = { desire: 0.6, arousal: 0.3, lubrication: 0.3, orgasm: 0.4, satisfaction: 0.4, pain: 0.4 };
    const DOMAIN_ITEMS = { desire: [0, 1], arousal: [2, 3, 4, 5], lubrication: [6, 7, 8, 9], orgasm: [10, 11, 12], satisfaction: [13, 14, 15], pain: [16, 17, 18] };

    const computeDomain = (domain) => {
      const idxs = DOMAIN_ITEMS[domain];
      const sum = idxs.reduce((a, i) => a + (items[i] || 0), 0);
      return +(sum * WEIGHTS[domain]).toFixed(1);
    };

    const setItem = (idx, v) => {
      const next = items.slice();
      next[idx] = v;
      setItems(next);
      const domain_scores = {};
      Object.keys(DOMAIN_ITEMS).forEach(d => {
        const idxs = DOMAIN_ITEMS[d];
        const sum = idxs.reduce((a, i) => a + (next[i] || 0), 0);
        domain_scores[d] = +(sum * WEIGHTS[d]).toFixed(1);
      });
      const total = Object.values(domain_scores).reduce((a, b) => a + b, 0);
      setState(s => ({
        ...s,
        fsfiOptedIn: true,
        fsfiLog: { ...(s.fsfiLog || {}), [tk]: { items: next, domain_scores, total: +total.toFixed(1) } },
      }));
    };

    if (!optedIn) {
      return (
        <div>
          <MHeader eyebrow="F82 · FEMALE SEXUAL FUNCTION INDEX" title={<>Sensitive content. <span style={{ color: 'var(--eucalyptus)' }}>Optional.</span></>} sub="A validated 19-item questionnaire — only complete if you want to." />
          <div className="card-warm" style={{ padding: 16, marginBottom: 14, borderLeft: '3px solid var(--coral)' }}>
            <div className="eyebrow" style={{ marginBottom: 6, color: 'var(--coral)' }}>BEFORE YOU BEGIN</div>
            <p className="body" style={{ fontSize: 13, marginBottom: 8 }}>
              This module asks about sexual experiences over the past 4 weeks. You can skip questions that don't apply or feel too personal. Your answers stay on this device.
            </p>
            <p className="caption" style={{ fontSize: 12 }}>
              Score range: 2–36 · scores below 26.55 may indicate sexual dysfunction (Wiegel et al. 2005).
            </p>
          </div>
          <button className="btn-primary" style={{ width: '100%' }} onClick={() => setOptedIn(true)}>I'd like to begin</button>
          <button className="btn-soft" style={{ width: '100%', marginTop: 8 }} onClick={() => { /* skip */ }}>Not right now</button>
        </div>
      );
    }

    const domain_scores = {};
    Object.keys(DOMAIN_ITEMS).forEach(d => domain_scores[d] = computeDomain(d));
    const total = +Object.values(domain_scores).reduce((a, b) => a + b, 0).toFixed(1);
    const dysfunction = total < 26.55 && total > 0;

    return (
      <div>
        <MHeader eyebrow="F82 · FSFI" title={<>Domain-weighted <span style={{ color: 'var(--eucalyptus)' }}>sexual function</span> index.</>} sub="Skip any question that doesn't apply. Total range 2–36." />

        <div className="card-warm" style={{ padding: 16, marginBottom: 14, textAlign: 'center' }}>
          <div className="data" style={{ fontSize: 32, fontWeight: 500, color: dysfunction ? 'var(--severity-mod)' : 'var(--eucalyptus-deep)' }}>{total}<span style={{ fontSize: 16, color: 'var(--ink-3)' }}> / 36</span></div>
          <div className="caption" style={{ marginTop: 4 }}>{dysfunction ? 'Below cutoff (26.55) — discuss with clinician' : total === 0 ? 'Not yet scored' : 'Above clinical cutoff'}</div>
        </div>

        <MSection title="DOMAIN SCORES">
          {Object.keys(DOMAIN_ITEMS).map(d => {
            const max = +(DOMAIN_ITEMS[d].length * 5 * WEIGHTS[d]).toFixed(1);
            const v = domain_scores[d];
            return (
              <div key={d} className="card" style={{ padding: 12, marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, textTransform: 'capitalize' }}>{d}</span>
                  <span className="data" style={{ fontSize: 12 }}>{v}/{max}</span>
                </div>
                <div style={{ height: 6, background: 'var(--mint-mist)', borderRadius: 999 }}>
                  <div style={{ width: ((v / max) * 100) + '%', height: '100%', background: 'var(--eucalyptus)', borderRadius: 999 }} />
                </div>
              </div>
            );
          })}
        </MSection>

        <div style={{ marginTop: 18 }}>
          {ITEMS.map(it => (
            <div key={it.idx} className="card" style={{ padding: 12, marginBottom: 6 }}>
              <div style={{ fontSize: 12, marginBottom: 8 }}>{it.q}</div>
              <div style={{ display: 'grid', gridTemplateColumns: `repeat(${it.scale}, 1fr)`, gap: 4 }}>
                {Array.from({ length: it.scale }, (_, n) => n + it.min).map(n => (
                  <button
                    key={n}
                    onClick={() => setItem(it.idx, n)}
                    style={{
                      padding: '6px 4px', borderRadius: 6,
                      background: items[it.idx] === n ? 'var(--eucalyptus)' : 'var(--surface)',
                      color: items[it.idx] === n ? '#fff' : 'inherit',
                      border: '1px solid var(--border)',
                      fontSize: 10, cursor: 'pointer', minHeight: 36,
                    }}
                  >
                    <div style={{ fontFamily: 'var(--mono)', fontWeight: 600 }}>{n}</div>
                    <div style={{ fontSize: 8, marginTop: 1, lineHeight: 1.1 }}>{it.anchors[n - it.min]}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="card-mint" style={{ padding: 12, marginTop: 6 }}>
          <div className="caption" style={{ fontSize: 10, color: 'var(--ink-3)' }}>
            Rosen et al. J Sex Marital Ther 2000;26:191. Cutoff: Wiegel et al. 2005. Stored on-device only.
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // F83 — DIVA Questionnaire (GSM functional impact)
  // ============================================================
  M.diva = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const tk = todayKey();
    const stored = (state.divaLog && state.divaLog[tk]) || {};
    const initial = stored.domain_scores || { emotional: 0, physical: 0, sexual: 0, daily: 0 };
    const initialItems = stored.items || {};
    const [items, setItems] = useM(initialItems);

    const DOMAINS = [
      { k: 'emotional', l: 'Emotional impact', items: [
        'Felt embarrassed about vaginal symptoms',
        'Felt frustrated by symptoms',
        'Felt less feminine',
        'Felt self-conscious about my body',
        'Felt sad or low because of symptoms',
      ] },
      { k: 'physical', l: 'Physical comfort', items: [
        'Vaginal dryness',
        'Vaginal itching or irritation',
        'Burning sensation',
        'Tightness or pressure',
        'Pain or discomfort while sitting / clothing',
      ] },
      { k: 'sexual', l: 'Sexual functioning', items: [
        'Pain during intimacy',
        'Reduced desire because of discomfort',
        'Difficulty becoming aroused',
        'Avoided intimacy because of symptoms',
        'Symptoms strained partner relationship',
      ] },
      { k: 'daily', l: 'Daily activities', items: [
        'Symptoms during exercise',
        'Symptoms while doing chores',
        'Symptoms while urinating',
        'Difficulty sleeping due to discomfort',
        'Limited my clothing choices',
        'Affected my work concentration',
      ] },
    ];

    const ANCHORS = ['Not at all', 'A little', 'Moderately', 'Quite a bit', 'Extremely'];

    const setItemVal = (domainKey, idx, v) => {
      const key = `${domainKey}_${idx}`;
      const next = { ...items, [key]: v };
      setItems(next);
      const domain_scores = {};
      DOMAINS.forEach(d => {
        const vals = d.items.map((_, i) => next[`${d.k}_${i}`] || 0);
        domain_scores[d.k] = +(mean(vals)).toFixed(2);
      });
      setState(s => ({
        ...s,
        divaLog: { ...(s.divaLog || {}), [tk]: { items: next, domain_scores } },
      }));
    };

    const domainAvg = (d) => mean(d.items.map((_, i) => items[`${d.k}_${i}`] || 0));

    return (
      <div>
        <MHeader eyebrow="F83 · DIVA QUESTIONNAIRE" title={<>How GSM affects <span style={{ color: 'var(--eucalyptus)' }}>your day.</span></>} sub="Day-to-Day Impact of Vaginal Aging — 4 domains, 21 items. 0 = not at all, 4 = extremely." />

        <MSection title="DOMAIN SUMMARY">
          {DOMAINS.map(d => {
            const avg = domainAvg(d);
            const sev = avg >= 3 ? 'var(--severity-severe)' : avg >= 2 ? 'var(--severity-mod)' : avg >= 1 ? 'var(--severity-mild)' : 'var(--ink-3)';
            return (
              <div key={d.k} className="card" style={{ padding: 12, marginBottom: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{d.l}</span>
                  <span className="data" style={{ fontSize: 12, color: sev }}>{avg.toFixed(2)} / 4.00</span>
                </div>
                <div style={{ height: 6, background: 'var(--mint-mist)', borderRadius: 999 }}>
                  <div style={{ width: ((avg / 4) * 100) + '%', height: '100%', background: sev, borderRadius: 999 }} />
                </div>
              </div>
            );
          })}
        </MSection>

        {DOMAINS.map(d => (
          <MSection key={d.k} title={d.l.toUpperCase()}>
            {d.items.map((q, i) => (
              <div key={i} className="card" style={{ padding: 12, marginBottom: 6 }}>
                <div style={{ fontSize: 12, marginBottom: 8 }}>{q}</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
                  {[0, 1, 2, 3, 4].map(n => (
                    <button
                      key={n}
                      onClick={() => setItemVal(d.k, i, n)}
                      style={{
                        padding: '6px 4px', borderRadius: 6,
                        background: items[`${d.k}_${i}`] === n ? 'var(--eucalyptus)' : 'var(--surface)',
                        color: items[`${d.k}_${i}`] === n ? '#fff' : 'inherit',
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

        <div className="card-mint" style={{ padding: 12, marginTop: 6 }}>
          <div className="caption" style={{ fontSize: 10, color: 'var(--ink-3)' }}>
            Huang AJ et al. Menopause 2015;22:144. Used to track GSM treatment response.
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // F84 — ICIQ-UI Short Form
  // ============================================================
  M.iciq = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const tk = todayKey();
    const stored = (state.iciqLog && state.iciqLog[tk]) || {};
    const [items, setItems] = useM(stored.items || [0, 0, 0]);

    const ITEMS = [
      {
        q: 'How often do you leak urine?',
        opts: [
          { v: 0, l: 'Never' },
          { v: 1, l: 'About once a week or less' },
          { v: 2, l: 'Two or three times a week' },
          { v: 3, l: 'About once a day' },
          { v: 4, l: 'Several times a day' },
          { v: 5, l: 'All the time' },
        ],
      },
      {
        q: 'How much urine do you usually leak?',
        opts: [
          { v: 0, l: 'None' },
          { v: 2, l: 'A small amount' },
          { v: 4, l: 'A moderate amount' },
          { v: 6, l: 'A large amount' },
        ],
      },
      {
        q: 'Overall, how much does leaking urine interfere with your everyday life? (0 = not at all, 10 = a great deal)',
        opts: Array.from({ length: 11 }, (_, i) => ({ v: i, l: String(i) })),
      },
    ];

    const setItem = (idx, v) => {
      const next = items.slice();
      next[idx] = v;
      setItems(next);
      const total = next.reduce((a, b) => a + b, 0);
      const severity = total === 0 ? 'None' : total <= 5 ? 'Slight' : total <= 12 ? 'Moderate' : total <= 18 ? 'Severe' : 'Very severe';
      setState(s => ({
        ...s,
        iciqLog: { ...(s.iciqLog || {}), [tk]: { items: next, total, severity } },
      }));
    };

    const total = items.reduce((a, b) => a + b, 0);
    const severity = total === 0 ? { l: 'None', c: 'var(--ink-3)' } :
      total <= 5 ? { l: 'Slight', c: 'var(--severity-mild)' } :
      total <= 12 ? { l: 'Moderate', c: 'var(--severity-mod)' } :
      total <= 18 ? { l: 'Severe', c: 'var(--severity-severe)' } :
      { l: 'Very severe', c: 'var(--severity-severe)' };

    return (
      <div>
        <MHeader eyebrow="F84 · ICIQ-UI SHORT FORM" title={<>Urinary incontinence, <span style={{ color: 'var(--eucalyptus)' }}>scored.</span></>} sub="3 questions, 0–21 scale. ICIQ-UI SF (Avery et al. 2004)." />

        <div className="card-warm" style={{ padding: 16, marginBottom: 14, textAlign: 'center' }}>
          <div className="data" style={{ fontSize: 32, fontWeight: 500, color: severity.c }}>{total}<span style={{ fontSize: 16, color: 'var(--ink-3)' }}> / 21</span></div>
          <div className="caption" style={{ marginTop: 4 }}>{severity.l}</div>
        </div>

        {ITEMS.map((it, i) => (
          <div key={i} className="card" style={{ padding: 12, marginBottom: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{it.q}</div>
            <div style={{ display: 'grid', gridTemplateColumns: it.opts.length > 6 ? 'repeat(11, 1fr)' : '1fr', gap: 4 }}>
              {it.opts.map(opt => (
                <button
                  key={opt.v}
                  onClick={() => setItem(i, opt.v)}
                  style={{
                    padding: it.opts.length > 6 ? '8px 0' : '8px 12px',
                    borderRadius: 6,
                    background: items[i] === opt.v ? 'var(--eucalyptus)' : 'var(--surface)',
                    color: items[i] === opt.v ? '#fff' : 'inherit',
                    border: '1px solid var(--border)',
                    fontSize: it.opts.length > 6 ? 11 : 12,
                    cursor: 'pointer',
                    textAlign: it.opts.length > 6 ? 'center' : 'left',
                  }}
                >
                  {it.opts.length > 6 ? opt.l : `${opt.v} · ${opt.l}`}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="card-mint" style={{ padding: 12, marginTop: 6 }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>SEVERITY BANDS</div>
          <div style={{ fontSize: 12, lineHeight: 1.6 }}>
            <div>1–5: Slight</div>
            <div>6–12: Moderate</div>
            <div>13–18: Severe</div>
            <div>19–21: Very severe</div>
          </div>
          <div className="caption" style={{ fontSize: 10, marginTop: 6, color: 'var(--ink-3)' }}>
            Klovning et al. Neurourol Urodyn 2009;28:411 (severity bands).
          </div>
        </div>
      </div>
    );
  };

  // ============================================================
  // F85 — Joint Pain Log
  // ============================================================
  M.joint = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const tk = todayKey();
    const stored = (state.jointLog && state.jointLog[tk]) || {};
    const [zones, setZones] = useM(stored.zones || {});
    const [stiffMin, setStiffMin] = useM(stored.morningStiffnessMin != null ? String(stored.morningStiffnessMin) : '');
    const [impact, setImpact] = useM(stored.activityImpact != null ? stored.activityImpact : 0);

    const ZONES = [
      { k: 'shoulders', l: 'Shoulders' },
      { k: 'elbows', l: 'Elbows' },
      { k: 'wrists', l: 'Wrists / hands' },
      { k: 'hips', l: 'Hips' },
      { k: 'knees', l: 'Knees' },
      { k: 'ankles', l: 'Ankles / feet' },
    ];

    const persist = (next) => {
      setState(s => ({
        ...s,
        jointLog: { ...(s.jointLog || {}), [tk]: next },
      }));
    };

    const toggleZone = (k) => {
      const cur = zones[k] || 0;
      const nextSev = cur >= 3 ? 0 : cur + 1;
      const nextZones = { ...zones, [k]: nextSev };
      setZones(nextZones);
      persist({ zones: nextZones, morningStiffnessMin: parseInt(stiffMin, 10) || 0, activityImpact: impact });
    };

    const setStiffMinVal = (v) => {
      setStiffMin(v);
      persist({ zones, morningStiffnessMin: parseInt(v, 10) || 0, activityImpact: impact });
    };
    const setImpactVal = (v) => {
      setImpact(v);
      persist({ zones, morningStiffnessMin: parseInt(stiffMin, 10) || 0, activityImpact: v });
    };

    const sevColor = (n) => n === 0 ? 'var(--mint-mist)' : n === 1 ? 'var(--severity-mild)' : n === 2 ? 'var(--severity-mod)' : 'var(--severity-severe)';
    const sevLabel = (n) => ['none', 'mild', 'moderate', 'severe'][n];

    const activeZones = Object.entries(zones).filter(([, v]) => v > 0).length;

    return (
      <div>
        <MHeader eyebrow="F85 · JOINT PAIN LOG" title={<>Where it <span style={{ color: 'var(--eucalyptus)' }}>hurts today.</span></>} sub="Tap a zone to cycle severity (none → mild → moderate → severe)." />

        <MSection title="JOINT MAP">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 8 }}>
            {ZONES.map(z => {
              const sev = zones[z.k] || 0;
              return (
                <button
                  key={z.k}
                  onClick={() => toggleZone(z.k)}
                  className="card"
                  style={{
                    padding: 14,
                    border: `1px solid ${sev > 0 ? sevColor(sev) : 'var(--border)'}`,
                    borderLeft: `3px solid ${sevColor(sev)}`,
                    background: sev > 0 ? sevColor(sev) + '20' : 'var(--surface)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{z.l}</div>
                  <div className="caption" style={{ fontSize: 11, textTransform: 'capitalize', color: sev > 0 ? sevColor(sev) : 'var(--ink-3)' }}>{sevLabel(sev)}</div>
                </button>
              );
            })}
          </div>
        </MSection>

        <MSection title="MORNING STIFFNESS">
          <div className="card" style={{ padding: 12 }}>
            <div className="caption" style={{ fontSize: 11, marginBottom: 6 }}>How long did stiffness last this morning? (minutes)</div>
            <input
              type="number"
              value={stiffMin}
              onChange={e => setStiffMinVal(e.target.value)}
              placeholder="0"
              style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)' }}
            />
            {parseInt(stiffMin, 10) >= 60 && (
              <div className="caption" style={{ fontSize: 11, marginTop: 6, color: 'var(--severity-mod)' }}>
                ≥60 min stiffness — bring up with clinician (inflammatory pattern possible).
              </div>
            )}
          </div>
        </MSection>

        <MSection title="ACTIVITY IMPACT">
          <div className="card" style={{ padding: 12 }}>
            <div className="caption" style={{ fontSize: 11, marginBottom: 8 }}>How much did joint pain limit activity today?</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
              {[
                { v: 0, l: 'None' },
                { v: 1, l: 'Slight' },
                { v: 2, l: 'Moderate' },
                { v: 3, l: 'Severe' },
              ].map(opt => (
                <button
                  key={opt.v}
                  onClick={() => setImpactVal(opt.v)}
                  style={{
                    padding: '8px 0', borderRadius: 6,
                    background: impact === opt.v ? 'var(--eucalyptus)' : 'var(--surface)',
                    color: impact === opt.v ? '#fff' : 'inherit',
                    border: '1px solid var(--border)',
                    fontSize: 11, cursor: 'pointer',
                  }}
                >{opt.l}</button>
              ))}
            </div>
          </div>
        </MSection>

        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <Stat label="Active zones" value={String(activeZones)} sub="painful today" />
          <Stat label="Stiffness" value={stiffMin || '0'} sub="minutes AM" />
        </div>

        <div className="card-mint" style={{ padding: 12, marginTop: 14 }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>ESTROGEN & JOINTS</div>
          <p className="body" style={{ fontSize: 12 }}>
            Estrogen has anti-inflammatory effects on cartilage. Joint pain affects ~50% of women in the menopause transition (SWAN data). Pattern + duration matter when distinguishing from inflammatory arthritis.
          </p>
        </div>
      </div>
    );
  };

  // ============================================================
  // F86 — Headache / migraine episode log
  // ============================================================
  M.headache = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const log = state.headacheLog || {};
    const [severity, setSeverity] = useM(0);
    const [location, setLocation] = useM('frontal');
    const [duration, setDuration] = useM('');
    const [aura, setAura] = useM(false);
    const [triggers, setTriggers] = useM([]);

    const TRIGGERS = ['sleep deprivation', 'stress', 'menstrual', 'alcohol', 'dehydration', 'screen time', 'weather', 'food', 'caffeine'];
    const LOCATIONS = ['frontal', 'temporal', 'occipital', 'global'];

    const phaseFor = (ts) => {
      if (!state.lastPeriod || !window.HQ.phaseForDay) return null;
      const start = new Date(state.lastPeriod);
      const dt = new Date(ts);
      const cycleLen = state.cycleLen || 28;
      const cd = Math.max(1, ((Math.floor((dt - start) / 86400000)) % cycleLen) + 1);
      return window.HQ.phaseForDay(cd, cycleLen, { coarse: true });
    };

    const logEpisode = () => {
      if (severity === 0) return;
      const ts = Date.now();
      const cycle_phase = phaseFor(ts);
      const evt = {
        severity_nrs: severity,
        location,
        durationHours: parseFloat(duration) || null,
        aura,
        triggers,
        cycle_phase,
      };
      setState(s => ({ ...s, headacheLog: { ...(s.headacheLog || {}), [ts]: evt } }));
      setSeverity(0); setLocation('frontal'); setDuration(''); setAura(false); setTriggers([]);
    };

    const toggleTrigger = (t) => {
      setTriggers(triggers.includes(t) ? triggers.filter(x => x !== t) : [...triggers, t]);
    };

    const episodes = Object.entries(log).map(([ts, e]) => ({ ts: +ts, ...e })).sort((a, b) => b.ts - a.ts);
    const last90 = episodes.filter(e => Date.now() - e.ts < 90 * 86400000);

    // Cyclical migraine detection: ≥3 in same phase across 3 cycles
    const phaseCounts = last90.reduce((acc, e) => {
      if (e.cycle_phase) acc[e.cycle_phase] = (acc[e.cycle_phase] || 0) + 1;
      return acc;
    }, {});
    const dominantPhase = Object.entries(phaseCounts).sort((a, b) => b[1] - a[1])[0];
    const menstrualMigrainePattern = dominantPhase && dominantPhase[1] >= 3 && (dominantPhase[0] === 'M' || dominantPhase[0] === 'L');

    const phaseLabel = { F: 'follicular', O: 'ovulatory', L: 'luteal', M: 'menstrual' };

    return (
      <div>
        <MHeader eyebrow="F86 · HEADACHE LOG" title={<>Episode <span style={{ color: 'var(--eucalyptus)' }}>capture.</span></>} sub="Severity, location, duration, aura, triggers — phase-tagged automatically." />

        <div className="card-warm" style={{ padding: 14, marginBottom: 14 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>LOG EPISODE</div>
          <div className="caption" style={{ fontSize: 11, marginBottom: 6 }}>Severity (0 = none, 10 = worst possible)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(11, 1fr)', gap: 2, marginBottom: 10 }}>
            {Array.from({ length: 11 }, (_, n) => (
              <button key={n} onClick={() => setSeverity(n)} style={{
                padding: '8px 0', fontSize: 11, borderRadius: 4,
                border: '1px solid var(--border)',
                background: severity === n ? 'var(--coral)' : 'var(--surface)',
                color: severity === n ? '#fff' : 'inherit',
                cursor: 'pointer',
              }}>{n}</button>
            ))}
          </div>

          <div className="caption" style={{ fontSize: 11, marginBottom: 6 }}>Location</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4, marginBottom: 10 }}>
            {LOCATIONS.map(loc => (
              <button key={loc} onClick={() => setLocation(loc)} style={{
                padding: '8px 0', fontSize: 11, borderRadius: 6, textTransform: 'capitalize',
                border: '1px solid var(--border)',
                background: location === loc ? 'var(--eucalyptus)' : 'var(--surface)',
                color: location === loc ? '#fff' : 'inherit',
                cursor: 'pointer',
              }}>{loc}</button>
            ))}
          </div>

          <div className="caption" style={{ fontSize: 11, marginBottom: 6 }}>Duration (hours)</div>
          <input type="number" step="0.5" value={duration} onChange={e => setDuration(e.target.value)} placeholder="2" style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)', marginBottom: 10 }} />

          <ToggleRow label="Visual aura before pain" checked={aura} onChange={setAura} sub="Flashing lights, zigzag lines, blind spots" />

          <div className="caption" style={{ fontSize: 11, marginTop: 10, marginBottom: 6 }}>Triggers (tap to select)</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
            {TRIGGERS.map(t => (
              <button key={t} onClick={() => toggleTrigger(t)} style={{
                padding: '4px 10px', fontSize: 11, borderRadius: 999,
                border: `1px solid ${triggers.includes(t) ? 'var(--eucalyptus)' : 'var(--border)'}`,
                background: triggers.includes(t) ? 'var(--eucalyptus)' : 'var(--surface)',
                color: triggers.includes(t) ? '#fff' : 'inherit',
                cursor: 'pointer',
              }}>{t}</button>
            ))}
          </div>

          <button className="btn-primary" style={{ width: '100%' }} onClick={logEpisode} disabled={severity === 0}>Log episode</button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <Stat label="Last 90 days" value={String(last90.length)} sub="episodes" />
          <Stat label="With aura" value={String(last90.filter(e => e.aura).length)} sub={`${Math.round((last90.filter(e => e.aura).length / Math.max(1, last90.length)) * 100)}%`} />
        </div>

        {menstrualMigrainePattern && (
          <div className="card-warm" style={{ padding: 14, marginBottom: 14, borderLeft: '3px solid var(--coral)' }}>
            <div className="eyebrow" style={{ marginBottom: 6, color: 'var(--coral)' }}>MENSTRUAL MIGRAINE PATTERN</div>
            <p className="body" style={{ fontSize: 13 }}>
              {dominantPhase[1]} of your last 90-day episodes occurred in the <strong>{phaseLabel[dominantPhase[0]]}</strong> phase. This pattern fits ICHD-3 menstrual migraine criteria and changes the treatment conversation (consider triptan prophylaxis or estradiol bridge).
            </p>
          </div>
        )}

        <MSection title={episodes.length ? 'RECENT EPISODES' : 'NO EPISODES YET'}>
          {episodes.length === 0 && <div className="caption" style={{ fontSize: 12 }}>Log your first episode above.</div>}
          {episodes.slice(0, 10).map((e, i) => (
            <div key={i} className="card" style={{ padding: 10, marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <div className="data" style={{ fontSize: 13 }}>{fmtDate(e.ts)} · {e.severity_nrs}/10 · {e.location}</div>
                {e.cycle_phase && <span className="phase-pill" style={{ background: 'var(--mint-mist)', fontSize: 10 }}>{phaseLabel[e.cycle_phase]}</span>}
              </div>
              <div className="caption" style={{ fontSize: 11 }}>
                {e.durationHours != null ? `${e.durationHours}h` : 'duration —'}{e.aura ? ' · aura' : ''}{e.triggers && e.triggers.length ? ` · ${e.triggers.join(', ')}` : ''}
              </div>
            </div>
          ))}
        </MSection>
      </div>
    );
  };

  // ============================================================
  // F87 — Heart palpitations log
  // ============================================================
  M.palp = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const log = state.palpLog || {};
    const [duration, setDuration] = useM('');
    const [context, setContext] = useM('rest');
    const [severity, setSeverity] = useM(0);

    const CONTEXTS = ['rest', 'activity', 'anxiety', 'post-meal', 'unknown'];

    const logEpisode = () => {
      if (severity === 0) return;
      const ts = Date.now();
      setState(s => ({
        ...s,
        palpLog: {
          ...(s.palpLog || {}),
          [ts]: {
            duration_min: parseFloat(duration) || null,
            context,
            severity_nrs: severity,
          },
        },
      }));
      setDuration(''); setContext('rest'); setSeverity(0);
    };

    const episodes = Object.entries(log).map(([ts, e]) => ({ ts: +ts, ...e })).sort((a, b) => b.ts - a.ts);
    const last7 = episodes.filter(e => Date.now() - e.ts < 7 * 86400000);
    const last30 = episodes.filter(e => Date.now() - e.ts < 30 * 86400000);
    const cardiologyAlert = last7.length >= 3;

    return (
      <div>
        <MHeader eyebrow="F87 · PALPITATIONS LOG" title={<>Heart racing? <span style={{ color: 'var(--eucalyptus)' }}>Capture it.</span></>} sub="Common in perimenopause from estradiol fluctuation. Pattern matters." />

        <div className="card-warm" style={{ padding: 14, marginBottom: 14 }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>LOG EPISODE</div>

          <div className="caption" style={{ fontSize: 11, marginBottom: 6 }}>Severity (0 = none, 10 = severe)</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(11, 1fr)', gap: 2, marginBottom: 10 }}>
            {Array.from({ length: 11 }, (_, n) => (
              <button key={n} onClick={() => setSeverity(n)} style={{
                padding: '8px 0', fontSize: 11, borderRadius: 4,
                border: '1px solid var(--border)',
                background: severity === n ? 'var(--coral)' : 'var(--surface)',
                color: severity === n ? '#fff' : 'inherit',
                cursor: 'pointer',
              }}>{n}</button>
            ))}
          </div>

          <div className="caption" style={{ fontSize: 11, marginBottom: 6 }}>Duration (minutes)</div>
          <input type="number" step="0.5" value={duration} onChange={e => setDuration(e.target.value)} placeholder="2" style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)', marginBottom: 10 }} />

          <div className="caption" style={{ fontSize: 11, marginBottom: 6 }}>Context</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4, marginBottom: 12 }}>
            {CONTEXTS.map(c => (
              <button key={c} onClick={() => setContext(c)} style={{
                padding: '8px 0', fontSize: 10, borderRadius: 6, textTransform: 'capitalize',
                border: '1px solid var(--border)',
                background: context === c ? 'var(--eucalyptus)' : 'var(--surface)',
                color: context === c ? '#fff' : 'inherit',
                cursor: 'pointer',
              }}>{c}</button>
            ))}
          </div>

          <button className="btn-primary" style={{ width: '100%' }} onClick={logEpisode} disabled={severity === 0}>Log episode</button>
        </div>

        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <Stat label="Last 7 days" value={String(last7.length)} sub="episodes" color={cardiologyAlert ? 'var(--severity-severe)' : undefined} />
          <Stat label="Last 30 days" value={String(last30.length)} sub="episodes" />
        </div>

        {cardiologyAlert && (
          <div className="card-warm" style={{ padding: 14, marginBottom: 14, borderLeft: '3px solid var(--severity-severe)' }}>
            <div className="eyebrow" style={{ marginBottom: 6, color: 'var(--severity-severe)' }}>CARDIOLOGY CONVERSATION</div>
            <p className="body" style={{ fontSize: 13 }}>
              {last7.length} episodes in the last 7 days. While palpitations are common in perimenopause, this frequency warrants a baseline ECG and ambulatory monitor (Holter) discussion to rule out arrhythmia.
            </p>
          </div>
        )}

        <MSection title={episodes.length ? 'RECENT EPISODES' : 'NO EPISODES YET'}>
          {episodes.length === 0 && <div className="caption" style={{ fontSize: 12 }}>Log your first episode above.</div>}
          {episodes.slice(0, 10).map((e, i) => (
            <div key={i} className="card" style={{ padding: 10, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div className="data" style={{ fontSize: 13 }}>{fmtDate(e.ts)} · {e.severity_nrs}/10</div>
                <div className="caption" style={{ fontSize: 11, textTransform: 'capitalize' }}>
                  {e.context}{e.duration_min != null ? ` · ${e.duration_min} min` : ''}
                </div>
              </div>
              <div className="caption" style={{ fontSize: 11 }}>{new Date(e.ts).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</div>
            </div>
          ))}
        </MSection>

        <div className="card-mint" style={{ padding: 12, marginTop: 6 }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>WHEN TO ESCALATE NOW</div>
          <p className="body" style={{ fontSize: 12 }}>
            Chest pain, fainting, breathlessness, or palpitations lasting &gt;30 min — seek urgent care. This module is for tracking, not for emergencies.
          </p>
        </div>
      </div>
    );
  };

  // ============================================================
  // F90 — Weekly skin / hair tracker
  // ============================================================
  M.skinHair = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const wk = weekKey();
    const stored = (state.skinHairLog && state.skinHairLog[wk]) || {};
    const [skinDryness, setSkinDryness] = useM(stored.skinDryness || 0);
    const [hairLoss, setHairLoss] = useM(stored.hairVolumeLoss || 0);
    const [facialHair, setFacialHair] = useM(stored.facialHair || 0);
    const [nails, setNails] = useM(stored.nailChanges || 0);
    const [note, setNote] = useM(stored.note || '');

    const persist = (patch) => {
      const next = {
        skinDryness, hairVolumeLoss: hairLoss, facialHair, nailChanges: nails, note,
        ...patch,
      };
      setState(s => ({
        ...s,
        skinHairLog: { ...(s.skinHairLog || {}), [wk]: next },
      }));
    };

    const ITEMS = [
      { k: 'skin', l: 'Skin dryness', v: skinDryness, set: (v) => { setSkinDryness(v); persist({ skinDryness: v }); } },
      { k: 'hair', l: 'Hair volume loss', v: hairLoss, set: (v) => { setHairLoss(v); persist({ hairVolumeLoss: v }); } },
      { k: 'facial', l: 'New facial hair', v: facialHair, set: (v) => { setFacialHair(v); persist({ facialHair: v }); } },
      { k: 'nails', l: 'Nail changes', v: nails, set: (v) => { setNails(v); persist({ nailChanges: v }); } },
    ];

    const ANCHORS = ['None', 'Mild', 'Moderate', 'Severe'];

    // Trend across last 8 weeks
    const allLogs = state.skinHairLog || {};
    const weekKeys = Object.keys(allLogs).sort();
    const last8 = weekKeys.slice(-8);
    const skinTrend = last8.map(k => allLogs[k].skinDryness || 0);
    const hairTrend = last8.map(k => allLogs[k].hairVolumeLoss || 0);

    return (
      <div>
        <MHeader eyebrow="F90 · SKIN & HAIR" title={<>Weekly check-in. <span style={{ color: 'var(--eucalyptus)' }}>Estrogen-sensitive tissues.</span></>} sub="0 = none, 3 = severe. Once a week, when you notice." />

        <MSection title={`THIS WEEK (${wk})`}>
          {ITEMS.map(it => (
            <div key={it.k} className="card" style={{ padding: 12, marginBottom: 6 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{it.l}</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
                {[0, 1, 2, 3].map(n => (
                  <button
                    key={n}
                    onClick={() => it.set(n)}
                    style={{
                      padding: '6px 4px', borderRadius: 6,
                      background: it.v === n ? 'var(--eucalyptus)' : 'var(--surface)',
                      color: it.v === n ? '#fff' : 'inherit',
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

        <MSection title="REFLECTION (OPTIONAL)">
          <div className="card" style={{ padding: 12 }}>
            <textarea
              value={note}
              onChange={e => { setNote(e.target.value); }}
              onBlur={() => persist({ note })}
              placeholder="Anything you want to remember about this week — hair shedding pattern, products that helped, etc."
              rows={3}
              style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)', fontSize: 12, fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>
        </MSection>

        {last8.length >= 3 && (
          <MSection title="LAST 8 WEEKS">
            <div className="card" style={{ padding: 12, marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>Skin dryness</span>
                <span className="data" style={{ fontSize: 11 }}>avg {mean(skinTrend).toFixed(1)}</span>
              </div>
              <Spark data={skinTrend} color="var(--coral)" height={30} />
            </div>
            <div className="card" style={{ padding: 12, marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>Hair loss</span>
                <span className="data" style={{ fontSize: 11 }}>avg {mean(hairTrend).toFixed(1)}</span>
              </div>
              <Spark data={hairTrend} color="var(--butter-deep)" height={30} />
            </div>
          </MSection>
        )}

        <div className="card-mint" style={{ padding: 12, marginTop: 6 }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>WHY THESE TRACK TOGETHER</div>
          <p className="body" style={{ fontSize: 12 }}>
            Estrogen receptors are present in skin, scalp, and nail beds. Declining estradiol reduces collagen synthesis, sebum, and hair follicle phase length. Topical and systemic options exist — track first, then talk.
          </p>
        </div>
      </div>
    );
  };

  // ============================================================
  // F91 — Bladder symptom tracker
  // ============================================================
  M.bladder = ({ state }) => {
    const { setState } = window.HQ.useApp();
    const tk = todayKey();
    const stored = (state.bladderLog && state.bladderLog[tk]) || {};
    const [daytimeFreq, setDaytimeFreq] = useM(stored.daytimeFreq != null ? stored.daytimeFreq : '');
    const [nocturia, setNocturia] = useM(stored.nocturia != null ? stored.nocturia : '');
    const [urgency, setUrgency] = useM(stored.urgencyEpisodes != null ? stored.urgencyEpisodes : '');
    const [leakage, setLeakage] = useM(stored.leakage != null ? stored.leakage : '');

    const persist = (patch) => {
      const next = {
        daytimeFreq: parseInt(daytimeFreq, 10) || 0,
        nocturia: parseInt(nocturia, 10) || 0,
        urgencyEpisodes: parseInt(urgency, 10) || 0,
        leakage: parseInt(leakage, 10) || 0,
        ...patch,
      };
      setState(s => ({
        ...s,
        bladderLog: { ...(s.bladderLog || {}), [tk]: next },
      }));
    };

    const fields = [
      { l: 'Daytime voids', sub: 'Times you peed during the day', v: daytimeFreq, set: setDaytimeFreq, key: 'daytimeFreq' },
      { l: 'Nocturia', sub: 'Times you got up to pee at night', v: nocturia, set: setNocturia, key: 'nocturia' },
      { l: 'Urgency episodes', sub: 'Sudden compelling need to go', v: urgency, set: setUrgency, key: 'urgencyEpisodes' },
      { l: 'Leakage events', sub: 'Any involuntary loss', v: leakage, set: setLeakage, key: 'leakage' },
    ];

    // Nocturia alert: ≥2/night for 14 days
    const allLogs = state.bladderLog || {};
    const last14Keys = Object.keys(allLogs).sort().slice(-14);
    const nocturiaAlert = last14Keys.length >= 14 && last14Keys.every(k => (allLogs[k].nocturia || 0) >= 2);
    const recentNocturia = last14Keys.filter(k => (allLogs[k].nocturia || 0) >= 2).length;

    const dates = Object.keys(allLogs).sort();
    const recent7 = dates.slice(-7).map(k => allLogs[k]);
    const avgDaytime = recent7.length ? mean(recent7.map(r => r.daytimeFreq || 0)).toFixed(1) : '—';
    const avgNocturia = recent7.length ? mean(recent7.map(r => r.nocturia || 0)).toFixed(1) : '—';

    return (
      <div>
        <MHeader eyebrow="F91 · BLADDER TRACKER" title={<>Frequency, urgency, <span style={{ color: 'var(--eucalyptus)' }}>nocturia.</span></>} sub="GSM affects the lower urinary tract too — track patterns, not single days." />

        <MSection title="TODAY">
          {fields.map(f => (
            <div key={f.key} className="card" style={{ padding: 12, marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{f.l}</span>
                <span className="caption" style={{ fontSize: 11 }}>{f.sub}</span>
              </div>
              <input
                type="number"
                value={f.v}
                onChange={e => f.set(e.target.value)}
                onBlur={() => persist({ [f.key]: parseInt(f.v, 10) || 0 })}
                placeholder="0"
                style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid var(--border)' }}
              />
            </div>
          ))}
        </MSection>

        {recent7.length >= 3 && (
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            <Stat label="7-day avg daytime" value={avgDaytime} sub="voids/day" />
            <Stat label="7-day avg nocturia" value={avgNocturia} sub="wakes/night" color={parseFloat(avgNocturia) >= 2 ? 'var(--severity-mod)' : undefined} />
          </div>
        )}

        {nocturiaAlert && (
          <div className="card-warm" style={{ padding: 14, marginBottom: 14, borderLeft: '3px solid var(--severity-severe)' }}>
            <div className="eyebrow" style={{ marginBottom: 6, color: 'var(--severity-severe)' }}>UROLOGY EVALUATION</div>
            <p className="body" style={{ fontSize: 13 }}>
              You've had ≥2 nighttime wakes for 14 consecutive days. Persistent nocturia in this range warrants urology evaluation — overactive bladder, sleep-disordered breathing, and nocturnal polyuria are all worth ruling out.
            </p>
          </div>
        )}

        {recentNocturia >= 7 && !nocturiaAlert && (
          <div className="card-warm" style={{ padding: 12, marginBottom: 14, borderLeft: '3px solid var(--severity-mod)' }}>
            <div className="eyebrow" style={{ marginBottom: 4, color: 'var(--severity-mod)' }}>PATTERN BUILDING</div>
            <div style={{ fontSize: 12 }}>{recentNocturia} of last 14 nights with ≥2 wakes. Keep tracking — pattern may stabilize or warrant attention.</div>
          </div>
        )}

        <MSection title="LAST 14 DAYS">
          {dates.slice(-14).reverse().map((k, i) => {
            const r = allLogs[k];
            const flag = (r.nocturia || 0) >= 2;
            return (
              <div key={k} className="card" style={{ padding: 10, marginBottom: 6, display: 'flex', justifyContent: 'space-between', borderLeft: flag ? '3px solid var(--severity-mod)' : '1px solid var(--border)' }}>
                <div className="data" style={{ fontSize: 12 }}>{fmtDate(k)}</div>
                <div className="caption" style={{ fontSize: 11 }}>
                  Day {r.daytimeFreq || 0} · Night {r.nocturia || 0} · Urg {r.urgencyEpisodes || 0} · Leak {r.leakage || 0}
                </div>
              </div>
            );
          })}
          {dates.length === 0 && <div className="caption" style={{ fontSize: 12 }}>No entries yet.</div>}
        </MSection>

        <div className="card-mint" style={{ padding: 12, marginTop: 6 }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>FYI</div>
          <p className="body" style={{ fontSize: 12 }}>
            Adult normal: 4–7 daytime voids and 0–1 nocturnal voids. Vaginal estrogen often improves urgency and recurrent UTIs in postmenopausal women (NAMS 2020 GSM position).
          </p>
        </div>
      </div>
    );
  };

  Object.assign(window.HQ_MODULES = window.HQ_MODULES || {}, M);
})();
