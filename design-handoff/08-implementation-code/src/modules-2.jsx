// Modules — set 2: PCOS
(function () {
  const useM = window.useM || React.useState;
  const { MHeader, Stat, Severity, Spark, EvidenceBar, ToggleRow, MSection } = window.HQ_UI;
  const M = {};

  // T-18 — 15 lab types from spec
  const LAB_TYPES = [
    { n: 'Total testosterone', u: 'ng/dL' },
    { n: 'Free testosterone', u: 'pg/mL' },
    { n: 'DHEA-S', u: 'µg/dL' },
    { n: 'SHBG', u: 'nmol/L' },
    { n: 'AMH', u: 'ng/mL' },
    { n: 'Fasting insulin', u: 'μIU/mL' },
    { n: 'Fasting glucose', u: 'mg/dL' },
    { n: 'HOMA-IR', u: '(calculated)' },
    { n: 'HbA1c', u: '%' },
    { n: '2-hour OGTT glucose', u: 'mg/dL' },
    { n: 'TSH', u: 'mIU/L' },
    { n: 'Vitamin D', u: 'ng/mL' },
    { n: 'Lipid panel — Total cholesterol', u: 'mg/dL' },
    { n: 'Lipid panel — HDL', u: 'mg/dL' },
    { n: 'Lipid panel — LDL', u: 'mg/dL' },
  ];

  // T-18 — inline add-result form sheet
  function LabAddSheet({ onSave, onCancel }) {
    const [type, setType] = useM(LAB_TYPES[0].n);
    const [value, setValue] = useM('');
    const [unit, setUnit] = useM(LAB_TYPES[0].u);
    const [date, setDate] = useM(new Date().toISOString().slice(0, 10));
    const [fasting, setFasting] = useM(false);
    const onTypeChange = (n) => {
      setType(n);
      const lt = LAB_TYPES.find(x => x.n === n);
      if (lt) setUnit(lt.u);
    };
    const submit = () => {
      if (!value) return;
      onSave({ n: type, v: `${value} ${unit}`, value: +value, unit, date, fasting, addedAt: Date.now() });
    };
    return (
      <div className="card-warm" style={{ padding: 14, marginTop: 8, marginBottom: 8 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>NEW LAB RESULT</div>
        <label className="caption" style={{ display: 'block', marginBottom: 4 }}>Lab type</label>
        <select value={type} onChange={e => onTypeChange(e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}>
          {LAB_TYPES.map(l => <option key={l.n} value={l.n}>{l.n}</option>)}
        </select>
        <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
          <div style={{ flex: 1 }}>
            <label className="caption" style={{ display: 'block', marginBottom: 4 }}>Value</label>
            <input type="number" step="any" value={value} onChange={e => setValue(e.target.value)} />
          </div>
          <div style={{ width: 110 }}>
            <label className="caption" style={{ display: 'block', marginBottom: 4 }}>Unit</label>
            <input type="text" value={unit} onChange={e => setUnit(e.target.value)} />
          </div>
        </div>
        <label className="caption" style={{ display: 'block', marginBottom: 4 }}>Date</label>
        <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ marginBottom: 10 }} />
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, fontSize: 13 }}>
          <input type="checkbox" checked={fasting} onChange={e => setFasting(e.target.checked)} />
          Fasting
        </label>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-primary" style={{ flex: 1 }} onClick={submit}>Save</button>
          <button className="btn-ghost" style={{ flex: 1 }} onClick={onCancel}>Cancel</button>
        </div>
      </div>
    );
  }

  M.labVault = ({ state }) => {
    const [showForm, setShowForm] = useM(false);
    const [localLabs, setLocalLabs] = useM(state.labs || []);
    // T-68/T-70 — corrected ranges, no flags, optional caption notes
    const seedLabs = (state.labs && state.labs.length > 0) ? null : [
      { n: 'Total testosterone', v: '52 ng/dL', date: 'Mar 12', range: '6–86 ng/dL', note: '↑ from last result' },
      { n: 'Free testosterone', v: '2.4 pg/mL', date: 'Mar 12', range: '0.7–3.6 pg/mL' },
      { n: 'SHBG', v: '28 nmol/L', date: 'Mar 12', range: '40–120 nmol/L' },
      { n: 'AMH', v: '8.4 ng/mL', date: 'Mar 12', range: '1.0–3.5 ng/mL (reproductive age)', note: 'PCOS literature uses >3.8–5.0 ng/mL as a supporting signal — discuss with your clinician.' },
      { n: 'Fasting insulin', v: '14 µIU/mL', date: 'Feb 4', range: '< 15 µIU/mL', fasting: true },
      { n: 'HOMA-IR', v: '3.2', date: 'Feb 4', range: '< 2.0 typical' },
      { n: '2-hour OGTT glucose', v: '142 mg/dL', date: 'Feb 4', range: '<140 / 140–199 / ≥200 mg/dL' },
      { n: 'HbA1c', v: '5.6%', date: 'Feb 4', range: '< 5.7%' },
      { n: 'DHEA-S', v: '210 µg/dL', date: 'Feb 4', range: '35–430 µg/dL' },
      { n: 'Vitamin D', v: '24 ng/mL', date: 'Feb 4', range: '30–80 ng/mL' },
      { n: 'TSH', v: '2.1 mIU/L', date: 'Mar 12', range: '0.5–4 mIU/L', note: 'Optimal <2.5 mIU/L for reproductive age.' },
    ];
    const labsList = localLabs.length > 0 ? localLabs : (seedLabs || []);
    const handleSave = (lab) => {
      const updated = [lab, ...localLabs];
      setLocalLabs(updated);
      try {
        const stored = JSON.parse(localStorage.getItem('hq-state') || '{}');
        stored.labs = updated;
        localStorage.setItem('hq-state', JSON.stringify(stored));
      } catch {}
      setShowForm(false);
    };
    return (
      <div>
        <MHeader eyebrow="F12 · LAB VAULT" title={<>Your <span  style={{ color: 'var(--eucalyptus)' }}>PCOS labs.</span></>} sub="Reference ranges shown for context — your provider's interpretation matters." />
        {labsList.map((l, i) => (
          <div key={(l.n || '') + i} className="card-paper" style={{ padding: 12, marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{l.n}</div>
                <div className="caption" style={{ fontSize: 11 }}>{l.range ? `Range ${l.range}` : ''}{l.date ? ` · ${l.date}` : ''}{l.fasting ? ' · fasting' : ''}</div>
                {l.note && <div className="caption" style={{ fontSize: 11, marginTop: 4, fontStyle: 'italic', color: 'var(--ink-3)' }}>{l.note}</div>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div className="data" style={{ fontSize: 14, fontWeight: 500 }}>{l.v}</div>
              </div>
            </div>
          </div>
        ))}
        {showForm ? (
          <LabAddSheet onSave={handleSave} onCancel={() => setShowForm(false)} />
        ) : (
          <button className="btn-soft" style={{ marginTop: 8, width: '100%' }} onClick={() => setShowForm(true)}>+ Add new result</button>
        )}
        {/* T-68/T-70 — permanent disclaimer */}
        <div className="card-warm" style={{ padding: 12, marginTop: 14, fontSize: 11, lineHeight: 1.5, color: 'var(--ink-2)' }}>
          Lab values vary by laboratory and clinical context. Reference ranges shown are general — your lab's reference range may vary, and your provider's interpretation matters.
        </div>
      </div>
    );
  };

  // T-10 — F28 Metabolic Snapshot module
  M.metabolicSnap = ({ state }) => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const existing = (state.metabolicEntries && state.metabolicEntries[todayKey]) || {};
    const [energy, setEnergy] = useM(existing.energy || 0);
    const [cravings, setCravings] = useM(existing.cravings || 0);
    const [brainFog, setBrainFog] = useM(!!existing.brainFog);
    const save = () => {
      // MOCK — write to localStorage so it survives reload
      try {
        const stored = JSON.parse(localStorage.getItem('hq-state') || '{}');
        stored.metabolicEntries = { ...(stored.metabolicEntries || {}), [todayKey]: { energy, cravings, brainFog } };
        localStorage.setItem('hq-state', JSON.stringify(stored));
      } catch {}
      alert('Metabolic snapshot saved for today.');
    };
    // 7-day mock composite trend
    const trend = [3.2, 3.8, 3.5, 4.1, 3.6, 3.9, 4.0];
    return (
      <div>
        <MHeader eyebrow="F28 · METABOLIC SNAPSHOT" title={<>Daily <span  style={{ color: 'var(--eucalyptus)' }}>proxy markers.</span></>} sub="Post-meal energy, cravings, brain fog — no calorie tracking." />
        <MSection title="POST-MEAL ENERGY · 2HR · 1–5">
          <Severity value={energy} onChange={setEnergy} max={5} />
        </MSection>
        <MSection title="SUGAR CRAVINGS · 1–5">
          <Severity value={cravings} onChange={setCravings} max={5} />
        </MSection>
        <MSection title="POST-MEAL BRAIN FOG">
          <ToggleRow label="Felt foggy after eating today" checked={brainFog} onChange={setBrainFog} />
        </MSection>
        <button className="btn-primary" onClick={save} style={{ marginBottom: 18 }}>Save today's snapshot</button>
        <MSection title="7-DAY COMPOSITE">
          <div className="card-warm" style={{ padding: 14 }}>
            <Spark data={trend} color="var(--eucalyptus)" />
            <div className="caption" style={{ fontSize: 12, marginTop: 6 }}>Composite of energy, cravings, and brain fog. Higher = better metabolic day.</div>
          </div>
        </MSection>
      </div>
    );
  };

  M.androgen = ({ state }) => {
    const [acne, setAcne] = useM(2);
    const SITES = ['Upper lip', 'Chin', 'Chest', 'Upper back', 'Lower back', 'Upper abdomen', 'Lower abdomen', 'Upper arm', 'Thigh'];
    const initial = state.fgScores || {};
    const [scores, setScores] = useM(SITES.reduce((acc, s) => ({ ...acc, [s]: initial[s] || 0 }), {}));
    const [scoredAt, setScoredAt] = useM(state.fgScoredAt || new Date().toISOString().slice(0, 10));
    const total = Object.values(scores).reduce((a, b) => a + (b || 0), 0);
    const setSite = (site, n) => {
      const next = { ...scores, [site]: n };
      setScores(next);
      try {
        const stored = JSON.parse(localStorage.getItem('hq-state') || '{}');
        stored.fgScores = next;
        stored.fgScoredAt = scoredAt;
        localStorage.setItem('hq-state', JSON.stringify(stored));
      } catch {}
    };
    const persistDate = (d) => {
      setScoredAt(d);
      try {
        const stored = JSON.parse(localStorage.getItem('hq-state') || '{}');
        stored.fgScoredAt = d;
        localStorage.setItem('hq-state', JSON.stringify(stored));
      } catch {}
    };
    return (
      <div>
        <MHeader eyebrow="F18 · ANDROGEN TRACKER" title={<>Acne, hair, <span  style={{ color: 'var(--eucalyptus)' }}>graded.</span></>} sub="Modified Ferriman-Gallwey + IGA acne scales." />
        <MSection title="ACNE TODAY · IGA SCALE">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
            {[0,1,2,3,4].map(n => (
              <button key={n} className={`scale-btn ${acne === n ? 'active' : ''}`} onClick={() => setAcne(n)}>{n}</button>
            ))}
          </div>
          <div className="caption" style={{ marginTop: 8, fontSize: 11 }}>0 = clear · 4 = severe nodulocystic</div>
        </MSection>
        <MSection title="HIRSUTISM · 9 SITES · 0–4 EACH">
          {SITES.map(s => (
            <div key={s} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13 }}>{s}</span>
              <div style={{ display: 'flex', gap: 3 }}>
                {[0,1,2,3,4].map(n => {
                  const active = scores[s] === n;
                  return (
                    <button
                      key={n}
                      onClick={() => setSite(s, n)}
                      style={{
                        width: 28, height: 28, borderRadius: 6,
                        background: active ? 'var(--eucalyptus)' : (n <= 1 ? 'var(--mint-mist)' : 'var(--surface)'),
                        color: active ? '#fff' : 'inherit',
                        border: '1px solid var(--border)',
                        fontSize: 11, fontFamily: 'var(--mono)', cursor: 'pointer',
                      }}
                    >{n}</button>
                  );
                })}
              </div>
            </div>
          ))}
          <div className="caption" style={{ marginTop: 10 }}>
            Total: <strong className="data">{total}/36</strong>
          </div>
          <div className="caption" style={{ fontSize: 11, marginTop: 6, lineHeight: 1.5, color: 'var(--ink-2)' }}>
            ≥8 indicates clinically significant hirsutism (Caucasian populations); ≥6 is used for some non-Caucasian populations — discuss with your clinician.
          </div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <label className="caption" style={{ flex: '0 0 auto' }}>When did you last score this?</label>
            <input type="date" value={scoredAt} onChange={e => persistDate(e.target.value)} style={{ flex: 1 }} />
          </div>
        </MSection>
        <div className="card-mint" style={{ padding: 12 }}>
          <div className="caption" style={{ marginBottom: 4 }}>3-MONTH TREND</div>
          <Spark data={[10, 11, 9, 8, 8, 7]} />
          <div className="caption" style={{ fontSize: 11, marginTop: 4 }}>Decreasing since spironolactone titration</div>
        </div>
      </div>
    );
  };

  M.homaIR = () => {
    const [insulin, setInsulin] = useM(14);
    const [glucose, setGlucose] = useM(92);
    const homa = +((insulin * glucose) / 405).toFixed(2);
    // T-69 — corrected threshold bands (educational reference, not user verdict)
    const bands = [
      { range: '< 2.0', label: 'typical' },
      { range: '2.0 – 2.4', label: 'borderline' },
      { range: '≥ 2.5', label: 'suggests insulin resistance' },
      { range: '≥ 3.0', label: 'elevated' },
      { range: '≥ 4.0', label: 'severe' },
    ];
    return (
      <div>
        <MHeader eyebrow="F43 · HOMA-IR CALCULATOR" title={<>An <span  style={{ color: 'var(--eucalyptus)' }}>important</span> PCOS number.</>} sub="From your fasting insulin and glucose. Formula: (insulin × glucose) ÷ 405." />
        <MSection title="FASTING INSULIN · µIU/mL">
          <input type="number" value={insulin} onChange={e => setInsulin(+e.target.value || 0)} />
        </MSection>
        <MSection title="FASTING GLUCOSE · mg/dL">
          <input type="number" value={glucose} onChange={e => setGlucose(+e.target.value || 0)} />
        </MSection>
        <div className="card-warm" style={{ padding: 22, textAlign: 'center', marginBottom: 14, background: 'linear-gradient(135deg, var(--paper), var(--mint-pale))' }}>
          <div className="caption" style={{ marginBottom: 6 }}>YOUR HOMA-IR</div>
          <div className="data" style={{ fontSize: 56, color: 'var(--ink)', fontWeight: 500, lineHeight: 1 }}>{homa}</div>
          <div className="caption" style={{ marginTop: 8, fontSize: 11 }}>(insulin × glucose) ÷ 405</div>
        </div>
        <MSection title="REFERENCE BANDS · EDUCATIONAL">
          <div className="card-paper" style={{ padding: 12 }}>
            {bands.map(b => (
              <div key={b.range} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border)', fontSize: 13 }}>
                <span className="data">{b.range}</span>
                <span style={{ color: 'var(--ink-2)' }}>{b.label}</span>
              </div>
            ))}
          </div>
        </MSection>
        <div className="card-mint" style={{ padding: 14 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>WHAT IT MEANS</div>
          <p className="body" style={{ fontSize: 13 }}>HOMA-IR is an estimate of insulin resistance from a fasting blood draw. The bands above are general educational ranges — they aren't a personal verdict. Your provider considers HOMA-IR alongside your full clinical picture.</p>
        </div>
      </div>
    );
  };

  M.pcosMed = () => {
    // Spec §3.6 — full 14-medication list with condition-specific side-effect tracking
    const meds = [
      { n: 'Metformin XR 1500 mg', se: 'GI tolerance', adh: 6, gap: 1, track: 'GI tolerance · stool changes · B12 (annually)' },
      { n: 'Spironolactone 100 mg', se: 'Blood pressure', adh: 7, gap: 0, track: 'BP (manual entry) · dizziness · breast tenderness · irregular bleeding' },
      { n: 'Combined OCP', se: 'Mood / breakthrough bleeding', adh: 7, gap: 0, track: 'Mood · breakthrough bleeding · BP · headaches' },
      { n: 'Drospirenone-only OCP (Slynd)', se: 'Mood', adh: 7, gap: 0, track: 'Mood · breakthrough bleeding · K+ (if on ACE/ARBs)' },
      { n: 'Letrozole 2.5 mg (cycle 3–7)', se: 'Hot flashes', adh: 5, gap: 0, track: 'Hot flashes · headache · cycle response · OPK/PdG' },
      { n: 'Inositol 4000 mg (40:1)', se: 'GI / nausea', adh: 7, gap: 0, track: 'GI tolerance · ovulatory response (PdG) · cycle regularity' },
      { n: 'NAC 1800 mg', se: 'GI', adh: 6, gap: 1, track: 'GI · headache · ovulatory response' },
      { n: 'Vitamin D3 2000 IU', se: 'None typical', adh: 7, gap: 0, track: 'Annual 25-OH vitamin D level' },
      { n: 'Omega-3 (EPA/DHA) 2000 mg', se: 'Fishy aftertaste', adh: 7, gap: 0, track: 'GI tolerance · bleeding (if on anticoag)' },
      { n: 'Chromium picolinate 200 µg', se: 'GI', adh: 6, gap: 1, track: 'GI tolerance · cravings' },
      { n: 'Eflornithine cream (Vaniqa)', se: 'Skin irritation', adh: 6, gap: 0, track: 'Skin irritation · hair growth (mFG)' },
      { n: 'Berberine 1500 mg', se: 'GI', adh: 5, gap: 2, track: 'GI tolerance · LFTs (if long-term)' },
      { n: 'GLP-1 (Ozempic / Mounjaro)', se: 'GI / nausea', adh: 7, gap: 0, track: 'Nausea · vomiting · pancreatitis signs · weight (opt-in)' },
      { n: 'Levothyroxine 50 µg', se: 'Palpitations if over-replaced', adh: 7, gap: 0, track: 'TSH (every 6 months) · palpitations · sleep' },
    ];
    return (
      <div>
        <MHeader eyebrow="F44 · PCOS MEDICATIONS" title={<>Adherence + <span  style={{ color: 'var(--eucalyptus)' }}>side effects.</span></>} sub="14 PCOS medications · per-medication side-effect tracking per spec §3.6." />
        {meds.map(m => (
          <div key={m.n} className="card-warm" style={{ padding: 14, marginBottom: 8 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{m.n}</div>
            <div className="caption" style={{ fontSize: 11, marginBottom: 8, color: 'var(--ink-2)' }}>Track: {m.track}</div>
            <div style={{ display: 'flex', gap: 4 }}>
              {Array.from({ length: 7 }, (_, i) => (
                <div key={i} style={{ flex: 1, height: 22, borderRadius: 4, background: i < m.adh ? 'var(--eucalyptus)' : 'var(--mint-mist)' }} />
              ))}
            </div>
            <div className="caption" style={{ fontSize: 11, marginTop: 4 }}>{m.adh}/7 days · {m.gap} miss this week · primary side effect: {m.se}</div>
          </div>
        ))}
      </div>
    );
  };

  M.endoFlag = ({ state }) => {
    // Compute actual days since last period from state (not hardcoded 72)
    const daysSince = (() => {
      if (!state.lastPeriod) return 0;
      const start = new Date(state.lastPeriod);
      const today = new Date();
      return Math.floor((today - start) / 86400000);
    })();
    const periodKey = state.lastPeriod || 'unknown';
    const ackKey = `endometrialAcknowledged_${periodKey}`;
    const acknowledged = !!(state[ackKey]);
    const reset = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('hq-state') || '{}');
        stored[ackKey] = Date.now();
        localStorage.setItem('hq-state', JSON.stringify(stored));
      } catch {}
      alert('Acknowledged. We will not surface this prompt again for the current cycle.');
    };
    let band = { color: 'var(--severity-mild)', status: 'Within typical PCOS range' };
    if (daysSince >= 90) band = { color: 'var(--severity-severe)', status: '90+ days — worth a clinical conversation' };
    else if (daysSince >= 75) band = { color: 'var(--severity-mod)', status: '75+ days — soft heads-up' };
    else if (daysSince >= 60) band = { color: 'var(--severity-mod)', status: '60+ days — internal monitoring' };
    const pct = Math.min(100, (daysSince / 180) * 100);
    return (
      <div>
        <MHeader eyebrow="F45 · ENDOMETRIAL FLAG" title={<>The safety check no other <span style={{ color: 'var(--eucalyptus)' }}>PCOS app has.</span></>} sub="Monitors amenorrhea duration. Tells you when prolonged anovulation crosses the safety threshold." />
        <div className="card-warm" style={{ padding: 22, textAlign: 'center', marginBottom: 14, background: 'linear-gradient(135deg, var(--paper), var(--butter))' }}>
          <div className="data" style={{ fontSize: 56, color: band.color, fontWeight: 500, lineHeight: 1 }}>{daysSince}</div>
          <div className="caption" style={{ marginTop: 8 }}>days since last period</div>
          <div style={{ marginTop: 12, fontSize: 13, fontWeight: 600 }}>{band.status}</div>
        </div>
        <div style={{ height: 8, background: 'var(--mint-mist)', borderRadius: 999, marginBottom: 6, position: 'relative' }}>
          <div style={{ width: pct + '%', height: '100%', background: 'linear-gradient(90deg, var(--severity-mild), var(--severity-mod))', borderRadius: 999 }} />
          <div style={{ position: 'absolute', left: '50%', top: -2, width: 2, height: 12, background: 'var(--severity-severe)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span className="caption" style={{ fontSize: 11 }}>0d</span>
          <span className="caption" style={{ fontSize: 11 }}>90d</span>
          <span className="caption" style={{ fontSize: 11, color: 'var(--severity-severe)' }}>180d</span>
        </div>
        <div className="card-mint" style={{ padding: 14, marginTop: 14 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>WHY THIS MATTERS</div>
          <p className="body" style={{ fontSize: 13 }}>Without monthly progesterone exposure, the endometrium thickens unchecked. After 90+ days of amenorrhea, your doctor may want to induce a withdrawal bleed. After 180+, an ultrasound is the standard of care.</p>
        </div>
        {daysSince >= 75 && !acknowledged && (
          <button className="btn-soft" style={{ marginTop: 12, width: '100%' }} onClick={reset}>I spoke to my doctor about this</button>
        )}
        {acknowledged && (
          <div className="caption" style={{ marginTop: 12, padding: '8px 12px', textAlign: 'center', fontSize: 11, background: 'var(--mint-pale)', borderRadius: 8, color: 'var(--eucalyptus-deep)' }}>
            Acknowledged for this cycle. We won't prompt again until your next logged period.
          </div>
        )}
      </div>
    );
  };

  M.hair = ({ state }) => {
    const useApp = window.HQ.useApp;
    const { setState } = useApp();
    const todayKey = new Date().toISOString().slice(0, 10);
    const todayEntry = (state.hairShedding && state.hairShedding[todayKey]) || {};
    const setField = (key, val) => {
      setState(s => ({
        ...s,
        hairShedding: { ...(s.hairShedding || {}), [todayKey]: { ...((s.hairShedding || {})[todayKey] || {}), [key]: val } },
      }));
    };
    // Spec §3.2 bins: per shower or brush stroke
    const bins = ['None today', '< 10 strands', '10–25', '25–50', '> 50'];
    const ludwig = ['Crown', 'Hairline', 'Top', 'Diffuse'];
    // 30-day trend from logged data (count entries by bin index)
    const last30 = Object.entries(state.hairShedding || {})
      .filter(([k]) => {
        const dt = new Date(k);
        return (Date.now() - dt.getTime()) < 30 * 86400000;
      });
    const avg = last30.length ? (last30.reduce((s, [, e]) => s + (bins.indexOf(e.bin)), 0) / last30.length) : null;
    return (
      <div>
        <MHeader eyebrow="F46 · HAIR SHEDDING" title={<>Daily strand count, <span style={{ color: 'var(--eucalyptus)' }}>without judgement.</span></>} sub="Per spec §3.2 — bins are per shower or brush stroke." />
        <MSection title="TODAY'S SHED">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
            {bins.map(n => (
              <button
                key={n}
                onClick={() => setField('bin', n)}
                className={`scale-btn ${todayEntry.bin === n ? 'active' : ''}`}
                style={{ fontSize: 10, padding: '8px 4px' }}
              >{n}</button>
            ))}
          </div>
        </MSection>
        <MSection title="LUDWIG ZONE · WHERE">
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {ludwig.map(z => (
              <button
                key={z}
                onClick={() => setField('ludwigZone', z)}
                className={`chip ${todayEntry.ludwigZone === z ? 'active' : ''}`}
              >{z}</button>
            ))}
          </div>
        </MSection>
        <div className="card-warm" style={{ padding: 14, marginBottom: 12 }}>
          <div className="caption" style={{ marginBottom: 6 }}>30-DAY READING</div>
          {avg == null ? (
            <div className="caption" style={{ fontSize: 12 }}>Log a few days to see your trend appear here.</div>
          ) : (
            <>
              <Spark data={last30.slice(-10).map(([, e]) => bins.indexOf(e.bin))} color="var(--eucalyptus)" />
              <div className="caption" style={{ fontSize: 11, marginTop: 4 }}>{last30.length} day{last30.length === 1 ? '' : 's'} logged · avg bin: {bins[Math.round(avg)] || 'n/a'}</div>
            </>
          )}
        </div>
      </div>
    );
  };

  M.ovulation = ({ state }) => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const existing = (state.pdgResults && state.pdgResults[todayKey]) || null;
    const [pdg, setPdg] = useM(existing ? existing.result : null);
    const savePdg = (val) => {
      setPdg(val);
      try {
        const stored = JSON.parse(localStorage.getItem('hq-state') || '{}');
        stored.pdgResults = { ...(stored.pdgResults || {}), [todayKey]: { result: val } };
        localStorage.setItem('hq-state', JSON.stringify(stored));
      } catch {}
    };
    // MED-3 — OPK / CM / BBT capture
    const useApp = window.HQ.useApp;
    const { setState } = useApp();
    const opk = (state.opkLog && state.opkLog[todayKey]) || null;
    const cm = (state.cmLog && state.cmLog[todayKey]) || null;
    const bbt = (state.bbtLog && state.bbtLog[todayKey]) || '';
    const setOpk = (val) => setState(s => ({ ...s, opkLog: { ...(s.opkLog || {}), [todayKey]: val } }));
    const setCm = (val) => setState(s => ({ ...s, cmLog: { ...(s.cmLog || {}), [todayKey]: val } }));
    const setBbt = (val) => setState(s => ({ ...s, bbtLog: { ...(s.bbtLog || {}), [todayKey]: val } }));
    const opkOptions = ['Negative', 'Low', 'High', 'Peak'];
    const cmOptions = ['Dry', 'Sticky', 'Creamy', 'Watery', 'Egg-white'];
    return (
      <div>
        <MHeader eyebrow="F47 · OVULATION DETECTION" title={<>Multi-signal, <span  style={{ color: 'var(--eucalyptus)' }}>PCOS-aware.</span></>} sub="OPK + cervical mucus + BBT + PdG. Accounts for false LH surges." />
        <div className="card-mint" style={{ padding: 14, marginBottom: 14 }}>
          <div className="eyebrow" style={{ marginBottom: 4 }}>STATUS</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 4 }}>Likely anovulatory cycle</div>
          <div className="caption" style={{ fontSize: 12 }}>2 LH surges detected without PdG confirmation — typical false-positive pattern in PCOS.</div>
        </div>

        <MSection title="OPK RESULT TODAY">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {opkOptions.map(o => (
              <button key={o} onClick={() => setOpk(o)} className={`scale-btn ${opk === o ? 'active' : ''}`} style={{ fontSize: 11 }}>{o}</button>
            ))}
          </div>
        </MSection>

        <MSection title="CERVICAL MUCUS">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {cmOptions.map(o => (
              <button key={o} onClick={() => setCm(o)} className={`chip ${cm === o ? 'active' : ''}`}>{o}</button>
            ))}
          </div>
        </MSection>

        <MSection title="BBT · °F">
          <input
            type="number"
            step="0.05"
            placeholder="e.g. 97.6"
            value={bbt}
            onChange={e => setBbt(e.target.value)}
            style={{ width: '100%' }}
          />
        </MSection>

        {/* T-27 — PdG entry */}
        <MSection title="LOG PDG RESULT">
          <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
            <button className={`btn-soft ${pdg === 'positive' ? 'active' : ''}`} style={{ flex: 1, background: pdg === 'positive' ? 'var(--eucalyptus)' : '', color: pdg === 'positive' ? '#fff' : '' }} onClick={() => savePdg('positive')}>Positive</button>
            <button className={`btn-soft ${pdg === 'negative' ? 'active' : ''}`} style={{ flex: 1, background: pdg === 'negative' ? 'var(--coral)' : '', color: pdg === 'negative' ? '#fff' : '' }} onClick={() => savePdg('negative')}>Negative</button>
          </div>
          <div className="card-warm" style={{ padding: 12, fontSize: 12, lineHeight: 1.5 }}>
            In PCOS, OPK strips can show LH surges that don't lead to ovulation. PdG is the most reliable confirmation method — test on days 7–10 post-suspected ovulation.
          </div>
        </MSection>

        <MSection title="THIS CYCLE">
          {[
            { d: 'Day 11', sig: 'OPK 0.6', dir: 'rising' },
            { d: 'Day 14', sig: 'OPK 1.4', dir: 'surge?' },
            { d: 'Day 18', sig: 'OPK 0.4', dir: 'fade' },
            { d: 'Day 21', sig: 'OPK 1.6', dir: 'second surge' },
            { d: 'Day 28', sig: 'PdG < 5', dir: 'no ovulation' },
          ].map(r => (
            <div key={r.d} className="card" style={{ padding: 12, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{r.d}</div>
                <div className="caption" style={{ fontSize: 11 }}>{r.dir}</div>
              </div>
              <span className="data" style={{ fontSize: 13 }}>{r.sig}</span>
            </div>
          ))}
        </MSection>
      </div>
    );
  };

  M.inositol = ({ state }) => {
    const seed = state.inositolDoses || { myo: 4000, dci: 100 };
    const [myo, setMyo] = useM(seed.myo);
    const [dci, setDci] = useM(seed.dci);
    const ratio = dci > 0 ? (myo / dci) : 0;
    const ratioPct = Math.min(100, (ratio / 100) * 100); // axis 1:1 → 100:1
    const lowRatio = ratio < 20;
    const saveDoses = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('hq-state') || '{}');
        stored.inositolDoses = { myo, dci, updatedAt: Date.now() };
        localStorage.setItem('hq-state', JSON.stringify(stored));
      } catch {}
      alert('Inositol doses saved.');
    };
    return (
      <div>
        <MHeader eyebrow="F48 · INOSITOL PROTOCOL" title={<>The <span  style={{ color: 'var(--eucalyptus)' }}>40:1 ratio</span>, tracked.</>} sub="Myo + D-chiro inositol with GI tolerance and ovulatory response." />

        {/* T-28 — calculator */}
        <MSection title="DOSING">
          <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
            <div style={{ flex: 1 }}>
              <div className="caption" style={{ marginBottom: 4 }}>Myo-inositol (mg)</div>
              <input type="number" value={myo} onChange={e => setMyo(+e.target.value || 0)} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="caption" style={{ marginBottom: 4 }}>D-chiro (mg)</div>
              <input type="number" value={dci} onChange={e => setDci(+e.target.value || 0)} />
            </div>
          </div>
          <div className="card-warm" style={{ padding: 16, textAlign: 'center', marginBottom: 10 }}>
            <div className="caption" style={{ marginBottom: 4 }}>YOUR RATIO</div>
            <div className="data" style={{ fontSize: 36, color: lowRatio ? 'var(--severity-severe)' : 'var(--eucalyptus)', fontWeight: 500 }}>{ratio.toFixed(1)} : 1</div>
            <div className="caption" style={{ marginTop: 6, fontSize: 11 }}>Studied ratio: 40 : 1</div>
          </div>
          {/* Visual axis 1:1 → 100:1 */}
          <div style={{ position: 'relative', height: 10, background: 'var(--mint-mist)', borderRadius: 999, marginBottom: 4 }}>
            <div style={{ position: 'absolute', left: '40%', top: -3, width: 2, height: 16, background: 'var(--eucalyptus)' }} />
            <div style={{ width: ratioPct + '%', height: '100%', background: lowRatio ? 'var(--severity-severe)' : 'var(--eucalyptus)', borderRadius: 999 }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className="caption" style={{ fontSize: 11 }}>1:1</span>
            <span className="caption" style={{ fontSize: 11, color: 'var(--eucalyptus)' }}>40:1 target</span>
            <span className="caption" style={{ fontSize: 11 }}>100:1</span>
          </div>
          {lowRatio && (
            <div className="card-warm" style={{ marginTop: 10, padding: 12, borderLeft: '3px solid var(--severity-severe)' }}>
              <div className="eyebrow" style={{ color: 'var(--severity-severe)', marginBottom: 4 }}>HEADS UP</div>
              <p className="body" style={{ fontSize: 12 }}>
                Your ratio is DCI-heavier than the studied 40:1. High-dose DCI alone may worsen ovarian function — discuss with your provider.
              </p>
            </div>
          )}
          <button className="btn-soft" style={{ width: '100%', marginTop: 10 }} onClick={saveDoses}>Save doses</button>
        </MSection>

        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <Stat label="On protocol" value="84 days" sub="Started Feb 1" />
          <Stat label="Adherence" value="91%" color="var(--severity-mild)" />
          <Stat label="GI score" value="1.3/5" sub="Tolerated well" />
        </div>
        <MSection title="OVULATORY RESPONSE · 3 MONTHS">
          <div className="card-warm" style={{ padding: 14 }}>
            <Spark data={[0, 0, 1, 1, 1, 1, 1]} color="var(--eucalyptus)" />
            <div className="caption" style={{ fontSize: 12, marginTop: 6 }}>5/7 cycles ovulatory since starting · vs 0/3 prior. Strong responder.</div>
          </div>
        </MSection>
        <div className="card-warm" style={{ padding: 14 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>TODAY</div>
          <ToggleRow label="AM dose" checked={true} onChange={() => {}} />
          <ToggleRow label="PM dose" checked={false} onChange={() => {}} />
        </div>
      </div>
    );
  };

  M.weight = () => (
    <div>
      <MHeader eyebrow="F49 · WEIGHT · METABOLIC TREND" title={<>No goal. <span  style={{ color: 'var(--eucalyptus)' }}>No BMI.</span></>} sub="Just a metabolic health signal — opt in any time." />
      <div className="card-warm" style={{ padding: 18, marginBottom: 14 }}>
        <div className="caption" style={{ marginBottom: 6 }}>90-DAY TREND</div>
        <Spark data={[178, 177, 176, 175, 173, 172, 171]} height={50} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span className="caption" style={{ fontSize: 11 }}>Jan</span>
          <span className="caption" style={{ fontSize: 11 }}>Apr</span>
        </div>
      </div>
      <div className="card-mint" style={{ padding: 14 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>READING THIS</div>
        <p className="body" style={{ fontSize: 13 }}>Your weight has fluctuated within a 7-pound range over 90 days. This is typical. We don't track aesthetics, comparisons, or "goal weight." If this stops being useful to you, turn it off.</p>
      </div>
      <button className="btn-soft" style={{ marginTop: 12, width: '100%' }}>+ Log weight</button>
    </div>
  );

  M.txCompare = ({ state }) => {
    const now = Date.now();
    const ninetyAgo = now - 90 * 86400000;
    const drspMean = (entry) => {
      if (!entry || !entry.drsp) return null;
      const vals = Object.entries(entry.drsp).filter(([k]) => k !== 'suicidal_ideation').map(([, v]) => +v).filter(v => v > 0);
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
    };
    const collect = (kind) => {
      const old = [], rec = [];
      const source = kind === 'energy' ? (state.metabolicEntries || {}) : (state.entries || {});
      Object.entries(source).forEach(([k, e]) => {
        const t = new Date(k).getTime();
        const v = kind === 'mood' ? drspMean(e) :
          kind === 'energy' ? (e.energy || null) :
          null;
        if (v == null) return;
        if (t >= ninetyAgo) rec.push(v); else old.push(v);
      });
      const mean = (a) => a.length ? (a.reduce((x, y) => x + y, 0) / a.length) : null;
      return { old: mean(old), now: mean(rec), nNow: rec.length, nOld: old.length };
    };
    const moodC = collect('mood');
    const energyC = collect('energy');
    // HOMA-IR latest from labs
    const homaEntries = (state.labs || []).filter(l => /HOMA-IR/i.test(l.n || '')).sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
    const homaNow = homaEntries[0]?.value || null;
    const homaOld = homaEntries.find(l => (l.addedAt || 0) < ninetyAgo)?.value || null;
    // mFG total now (sum) — old not stored, so just show now
    const fg = state.fgScores || {};
    const fgTotal = Object.values(fg).reduce((a, b) => a + (+b || 0), 0);
    // Cycle regularity from periodLog
    const periodKeys = Object.keys(state.periodLog || {}).filter(k => state.periodLog[k]?.started).sort();
    const intervals = [];
    for (let i = 1; i < periodKeys.length; i++) {
      intervals.push((new Date(periodKeys[i]) - new Date(periodKeys[i - 1])) / 86400000);
    }
    const recentIntervals = intervals.slice(-3);
    const oldIntervals = intervals.slice(0, Math.max(0, intervals.length - 3));
    const avg = (a) => a.length ? (a.reduce((x, y) => x + y, 0) / a.length) : null;
    const totalLogged = Object.keys(state.entries || {}).length;
    const insufficient = totalLogged < 90 && moodC.nOld === 0 && moodC.nNow === 0;
    if (insufficient) {
      return (
        <div>
          <MHeader eyebrow="F50 · TREATMENT RESPONSE" title={<>3 months ago <span  style={{ color: 'var(--eucalyptus)' }}>vs now.</span></>} sub="Auto-generated from your tracking data." />
          <div className="card-warm" style={{ padding: 18 }}>
            <p className="body" style={{ fontSize: 13, marginBottom: 6 }}>Need 3+ months of tracking for treatment response.</p>
            <div className="caption" style={{ fontSize: 12 }}>Currently at {totalLogged} day{totalLogged === 1 ? '' : 's'} logged. Comparison unlocks once you have entries spanning ≥90 days.</div>
          </div>
        </div>
      );
    }
    const fmt = (v) => v == null ? '—' : (typeof v === 'number' ? v.toFixed(1) : v);
    const rows = [
      { l: 'DRSP mean (mood)', n: fmt(moodC.old), t: fmt(moodC.now), dir: (moodC.old != null && moodC.now != null && moodC.now < moodC.old) ? '−' : '+' },
      { l: 'Energy avg', n: fmt(energyC.old), t: fmt(energyC.now), dir: (energyC.old != null && energyC.now != null && energyC.now > energyC.old) ? '+' : '−' },
      { l: 'HOMA-IR', n: fmt(homaOld), t: fmt(homaNow), dir: (homaOld != null && homaNow != null && homaNow < homaOld) ? '−' : '+' },
      { l: 'mFG total (now)', n: '—', t: fgTotal ? `${fgTotal}/36` : '—', dir: '−' },
      { l: 'Cycle interval avg (days)', n: fmt(avg(oldIntervals)), t: fmt(avg(recentIntervals)), dir: '+' },
    ];
    return (
      <div>
        <MHeader eyebrow="F50 · TREATMENT RESPONSE" title={<>3 months ago <span  style={{ color: 'var(--eucalyptus)' }}>vs now.</span></>} sub="Computed from your tracking data, labs, and period log." />
        {rows.map(r => (
          <div key={r.l} className="card" style={{ padding: 12, marginBottom: 6 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 8 }}>{r.l}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div className="caption" style={{ fontSize: 10 }}>3 MO AGO</div>
                <div className="data" style={{ fontSize: 16 }}>{r.n}</div>
              </div>
              <div style={{ fontSize: 18, color: r.dir === '+' ? 'var(--severity-mild)' : 'var(--eucalyptus)' }}>→</div>
              <div style={{ flex: 1 }}>
                <div className="caption" style={{ fontSize: 10 }}>NOW</div>
                <div className="data" style={{ fontSize: 16, color: 'var(--eucalyptus)' }}>{r.t}</div>
              </div>
            </div>
          </div>
        ))}
        <div className="caption" style={{ fontSize: 11, marginTop: 12, lineHeight: 1.5 }}>
          Computed live from {totalLogged} logged days, {(state.labs || []).length} lab results, and {periodKeys.length} period start{periodKeys.length === 1 ? '' : 's'}.
        </div>
      </div>
    );
  };

  M.docPrep = ({ state }) => {
    const conditions = state.conditions || [];
    const hasPMDD = conditions.includes('PMDD');
    const hasPCOS = conditions.includes('PCOS');
    const hasPeri = conditions.includes('Perimenopause');
    // Lab gap detection
    const PCOS_LABS = ['Total testosterone', 'Free testosterone', 'DHEA-S', 'SHBG', 'AMH', 'Fasting insulin', 'Fasting glucose', 'HOMA-IR', 'HbA1c', 'TSH', 'Vitamin D', 'Lipid panel — Total cholesterol', 'Lipid panel — HDL', 'Lipid panel — LDL'];
    const onFile = new Set((state.labs || []).map(l => l.n));
    const labGaps = hasPCOS ? PCOS_LABS.filter(n => !onFile.has(n)) : [];

    const sections = [];
    if (hasPMDD) {
      sections.push({
        title: 'PMDD FOCUS',
        items: [
          'Bring your DRSP log summary (F9) — 2+ cycles of prospective tracking',
          state.ssriConfig ? `Discuss SSRI timing — currently on ${state.ssriConfig.name} ${state.ssriConfig.dose}mg, ${state.ssriConfig.pattern}` : 'Discuss SSRI options + timing (continuous vs luteal-phase vs symptom-onset)',
          (state.rageEpisodes || []).length > 0 ? `Mention episode log — ${state.rageEpisodes.length} captured episodes` : 'Episode log empty — start capturing episodes for Criterion B documentation',
          'Confirm safety plan exists',
        ],
      });
    }
    if (hasPCOS) {
      sections.push({
        title: 'PCOS FOCUS',
        items: [
          'Discuss medication side effects you have tracked',
          state.endoFlagDays && state.endoFlagDays >= 75 ? 'Bring up endometrial monitoring (75+ days amenorrhea)' : 'Confirm endometrial monitoring threshold',
          'Review HOMA-IR and metabolic markers',
          'Phenotype confirmation per Rotterdam',
        ],
      });
    }
    if (hasPeri) {
      sections.push({
        title: 'PERIMENOPAUSE FOCUS',
        items: [
          'Bring HRT effectiveness data (F17) — hot flashes, sleep, mood',
          `Hot flash log — ${(state.hotFlashLog || []).length} entries`,
          'Greene Climacteric subscale trend',
          'GSM (genitourinary) symptoms — discuss vaginal estrogen if relevant',
        ],
      });
    }

    return (
      <div>
        <MHeader eyebrow="F51 · DOCTOR PREP" title={<>For <span  style={{ color: 'var(--eucalyptus)' }}>your conditions.</span></>} sub={conditions.length ? `Adapted to: ${conditions.join(', ')}` : 'Set conditions to see tailored prep.'} />
        {sections.map(sec => (
          <MSection key={sec.title} title={sec.title}>
            <div className="card-warm" style={{ padding: 14 }}>
              {sec.items.map((q, i) => (
                <div key={i} style={{ padding: '8px 0', fontSize: 13, color: 'var(--ink-2)', borderBottom: i === sec.items.length - 1 ? 'none' : '1px solid var(--border)' }}>☐ {q}</div>
              ))}
            </div>
          </MSection>
        ))}
        {hasPCOS && (
          <MSection title="LAB GAPS">
            <div className="card-warm" style={{ padding: 14 }}>
              {labGaps.length === 0 ? (
                <div className="caption" style={{ fontSize: 12 }}>All standard PCOS labs on file. ✓</div>
              ) : (
                <>
                  <div className="caption" style={{ fontSize: 12, marginBottom: 8 }}>{labGaps.length} labs not yet on file — ask your provider:</div>
                  {labGaps.map(l => (
                    <div key={l} style={{ padding: '6px 0', fontSize: 13, borderBottom: '1px solid var(--border)' }}>☐ {l}</div>
                  ))}
                </>
              )}
            </div>
          </MSection>
        )}
        <MSection title="QUESTIONS TO ASK">
          <div className="card-warm" style={{ padding: 14 }}>
            {[
              hasPMDD && '"Does my prospective DRSP record support a PMDD evaluation per DSM-5?"',
              hasPCOS && '"Given my labs and cycle pattern, would you confirm Rotterdam criteria?"',
              hasPCOS && '"Do you do endometrial monitoring at 90+ day amenorrhea?"',
              hasPeri && '"Is my HRT regimen still appropriate given my symptom changes?"',
              hasPeri && '"Should I add vaginal estrogen for GSM symptoms?"',
              conditions.length > 1 && '"How do you coordinate care across these conditions?"',
            ].filter(Boolean).map(q => (
              <div key={q} style={{ padding: '8px 0', fontSize: 13, fontStyle: 'italic', color: 'var(--ink-2)', borderBottom: '1px solid var(--border)' }}>{q}</div>
            ))}
          </div>
        </MSection>
      </div>
    );
  };

  M.fertility = ({ state }) => {
    const useApp = window.HQ.useApp;
    const { setState } = useApp();
    const on = !!state.fertilityMode;
    const todayKey = new Date().toISOString().slice(0, 10);
    const setMode = (v) => {
      setState(s => ({
        ...s,
        fertilityMode: v,
        fertilityCycleStart: v && !s.fertilityCycleStart ? new Date().toISOString().slice(0, 10) : s.fertilityCycleStart,
      }));
    };
    const setIntercourse = (v) => {
      setState(s => ({
        ...s,
        intercourseLog: { ...(s.intercourseLog || {}), [todayKey]: v },
      }));
    };
    const setStart = (date) => setState(s => ({ ...s, fertilityCycleStart: date }));
    const intercourse = !!(state.intercourseLog && state.intercourseLog[todayKey]);
    // Cycle X of trying — months since start
    const trying = (() => {
      if (!state.fertilityCycleStart) return null;
      const start = new Date(state.fertilityCycleStart);
      const months = Math.max(1, Math.floor((Date.now() - start.getTime()) / (30 * 86400000)) + 1);
      return months;
    })();
    const opk = state.opkLog?.[todayKey] || null;
    const cm = state.cmLog?.[todayKey] || null;
    const bbt = state.bbtLog?.[todayKey] || '';
    const pdg = state.pdgResults?.[todayKey]?.result || null;
    const setOpk = (val) => setState(s => ({ ...s, opkLog: { ...(s.opkLog || {}), [todayKey]: val } }));
    const setCm = (val) => setState(s => ({ ...s, cmLog: { ...(s.cmLog || {}), [todayKey]: val } }));
    const setBbt = (val) => setState(s => ({ ...s, bbtLog: { ...(s.bbtLog || {}), [todayKey]: val } }));
    const setPdg = (val) => setState(s => ({ ...s, pdgResults: { ...(s.pdgResults || {}), [todayKey]: { result: val } } }));
    const opkOptions = ['Negative', 'Low', 'High', 'Peak'];
    const cmOptions = ['Dry', 'Sticky', 'Creamy', 'Watery', 'Egg-white'];
    return (
      <div>
        <MHeader eyebrow="F52 · FERTILITY MODE" title={<>Trying to <span  style={{ color: 'var(--eucalyptus)' }}>conceive.</span></>} sub="Off by default. Multi-signal, PCOS-realistic. Intercourse log stays private — never exported." />
        <div className="card-warm" style={{ padding: 16, marginBottom: 14 }}>
          <ToggleRow label="Fertility mode (TTC)" checked={on} onChange={setMode} sub="Activates OPK + BBT + cervical mucus + intercourse logs" />
        </div>
        {on && (
          <>
            <MSection title="DAILY FERTILITY LOG">
              <div className="card-warm" style={{ padding: 14, marginBottom: 12 }}>
                <div style={{ marginBottom: 12 }}>
                  <div className="caption" style={{ marginBottom: 4 }}>BBT (°F)</div>
                  <input type="number" step="0.05" placeholder="e.g. 97.6" value={bbt} onChange={e => setBbt(e.target.value)} style={{ width: '100%' }} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div className="caption" style={{ marginBottom: 4 }}>Cervical mucus</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {cmOptions.map(o => (
                      <button key={o} onClick={() => setCm(o)} className={`chip ${cm === o ? 'active' : ''}`}>{o}</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div className="caption" style={{ marginBottom: 4 }}>OPK result</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
                    {opkOptions.map(o => (
                      <button key={o} onClick={() => setOpk(o)} className={`scale-btn ${opk === o ? 'active' : ''}`} style={{ fontSize: 11 }}>{o}</button>
                    ))}
                  </div>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <div className="caption" style={{ marginBottom: 4 }}>PdG result</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-soft" style={{ flex: 1, background: pdg === 'positive' ? 'var(--eucalyptus)' : '', color: pdg === 'positive' ? '#fff' : '' }} onClick={() => setPdg('positive')}>Positive</button>
                    <button className="btn-soft" style={{ flex: 1, background: pdg === 'negative' ? 'var(--coral)' : '', color: pdg === 'negative' ? '#fff' : '' }} onClick={() => setPdg('negative')}>Negative</button>
                  </div>
                </div>
                <div>
                  <div className="caption" style={{ marginBottom: 4 }}>Intercourse today (private — never exported)</div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-soft" style={{ flex: 1, background: intercourse ? 'var(--eucalyptus)' : '', color: intercourse ? '#fff' : '' }} onClick={() => setIntercourse(true)}>Yes</button>
                    <button className="btn-soft" style={{ flex: 1, background: state.intercourseLog && state.intercourseLog[todayKey] === false ? 'var(--mint-mist)' : '' }} onClick={() => setIntercourse(false)}>No</button>
                  </div>
                </div>
              </div>
            </MSection>
            <MSection title="TTC TIMELINE">
              <div className="card-warm" style={{ padding: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <div className="caption" style={{ flex: '0 0 auto' }}>Started TTC</div>
                  <input type="date" value={state.fertilityCycleStart || ''} onChange={e => setStart(e.target.value)} style={{ flex: 1 }} />
                </div>
                {trying != null && (
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Cycle {trying} of trying</div>
                )}
              </div>
            </MSection>
            <div className="caption" style={{ fontSize: 11, marginTop: 10, lineHeight: 1.5 }}>
              Intercourse data is stored on-device and never included in any export, share, or PDF.
            </div>
          </>
        )}
      </div>
    );
  };

  M.metaSyn = ({ state }) => {
    const useApp = window.HQ.useApp;
    const { setState } = useApp();
    const labs = state.labs || [];
    const latest = (matcher) => {
      const matches = labs.filter(l => matcher.test(l.n || '')).sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
      return matches[0] || null;
    };
    const tg = latest(/triglyceride/i);
    const hdl = latest(/HDL/i);
    const fg = latest(/Fasting glucose/i);
    // BP latest
    const bpEntries = Object.entries(state.bpLog || {}).sort((a, b) => new Date(b[0]) - new Date(a[0]));
    const bpLatest = bpEntries[0] ? bpEntries[0][1] : null;
    // Waist — pull from most recent lab labelled waist circumference
    const waist = latest(/waist/i);

    const todayKey = new Date().toISOString().slice(0, 10);
    const [showBP, setShowBP] = useM(false);
    const [sys, setSys] = useM(bpLatest?.systolic || '');
    const [dia, setDia] = useM(bpLatest?.diastolic || '');
    const saveBP = () => {
      if (!sys || !dia) return;
      setState(s => ({ ...s, bpLog: { ...(s.bpLog || {}), [todayKey]: { systolic: +sys, diastolic: +dia } } }));
      setShowBP(false);
    };

    const criteria = [
      {
        l: 'Waist circumference > 35"',
        v: waist ? waist.v : null,
        met: waist ? (+waist.value > 35) : null,
      },
      {
        l: 'Triglycerides ≥ 150 mg/dL',
        v: tg ? tg.v : null,
        met: tg ? (+tg.value >= 150) : null,
      },
      {
        l: 'HDL < 50 mg/dL (women)',
        v: hdl ? hdl.v : null,
        met: hdl ? (+hdl.value < 50) : null,
      },
      {
        l: 'BP ≥ 130/85',
        v: bpLatest ? `${bpLatest.systolic}/${bpLatest.diastolic}` : null,
        met: bpLatest ? (bpLatest.systolic >= 130 || bpLatest.diastolic >= 85) : null,
      },
      {
        l: 'Fasting glucose ≥ 100 mg/dL',
        v: fg ? fg.v : null,
        met: fg ? (+fg.value >= 100) : null,
      },
    ];
    const measured = criteria.filter(c => c.met != null).length;
    const count = criteria.filter(c => c.met === true).length;
    return (
      <div>
        <MHeader eyebrow="F53 · METABOLIC SYNDROME" title={<>Your 5-criteria <span  style={{ color: 'var(--eucalyptus)' }}>status.</span></>} sub="Computed from your labs and BP log. Add what's missing to complete." />
        <div className="card-warm" style={{ padding: 22, textAlign: 'center', marginBottom: 14 }}>
          <div className="data" style={{ fontSize: 48, color: count >= 3 ? 'var(--severity-severe)' : count >= 2 ? 'var(--severity-mod)' : 'var(--severity-mild)', fontWeight: 500 }}>{count} of {measured}</div>
          <div className="caption" style={{ marginTop: 6 }}>
            {measured === 0 ? 'No criteria measured yet — add labs + BP to compute.' :
              count >= 3 ? `${count} of 5 criteria elevated · meets metabolic syndrome threshold` :
              count >= 2 ? `${count} of 5 criteria elevated · approaching threshold` :
              `${count} of 5 criteria elevated · below threshold`}
          </div>
        </div>
        {criteria.map(c => (
          <div key={c.l} className="card" style={{
            padding: 12, marginBottom: 6,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderLeft: `3px solid ${c.met == null ? 'var(--ink-3)' : c.met ? 'var(--severity-severe)' : 'var(--severity-mild)'}`,
          }}>
            <span style={{ fontSize: 13 }}>{c.l}</span>
            <span className="data" style={{ fontSize: 13, color: c.met == null ? 'var(--ink-3)' : c.met ? 'var(--severity-severe)' : 'var(--ink)' }}>
              {c.v || 'Not yet measured'}
            </span>
          </div>
        ))}
        <div className="card-warm" style={{ padding: 14, marginTop: 12 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>LOG TODAY'S BP</div>
          {showBP ? (
            <>
              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                <input type="number" placeholder="Systolic" value={sys} onChange={e => setSys(e.target.value)} style={{ flex: 1 }} />
                <input type="number" placeholder="Diastolic" value={dia} onChange={e => setDia(e.target.value)} style={{ flex: 1 }} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-primary" style={{ flex: 1 }} onClick={saveBP}>Save</button>
                <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowBP(false)}>Cancel</button>
              </div>
            </>
          ) : (
            <button className="btn-soft" style={{ width: '100%' }} onClick={() => setShowBP(true)}>+ Add BP reading</button>
          )}
        </div>
      </div>
    );
  };

  M.phenotype = ({ state }) => {
    // T-76 — gated behind ≥60 logging days AND ≥1 androgen lab AND (ultrasound OR amenorrhea pattern)
    const loggedDays = Object.keys(state.entries || {}).length;
    const labs = state.labs || [];
    const ANDROGEN_NAMES = ['Total testosterone', 'Free testosterone', 'DHEA-S', 'SHBG'];
    const hasAndrogen = labs.some(l => ANDROGEN_NAMES.includes(l.n));
    const hasUltrasound = !!state.ultrasoundLogged || (state.ultrasoundVault && state.ultrasoundVault.length > 0) || labs.some(l => /ultrasound|AFC/i.test(l.n || ''));
    const hasAmenorrheaPattern = !!state.irregular || (state.cycleLen && state.cycleLen >= 60);
    const hasMorph = hasUltrasound || hasAmenorrheaPattern;

    const checks = [
      { ok: loggedDays >= 60, label: `${loggedDays}/60 days logged`, target: 'log' },
      { ok: hasAndrogen, label: 'At least one androgen lab on file', target: 'labVault' },
      { ok: hasMorph, label: 'Ultrasound on file or amenorrhea pattern', target: 'ultrasound' },
    ];
    const allMet = checks.every(c => c.ok);
    const goto = window.HQ?.useApp?.()?.goto;

    if (!allMet) {
      return (
        <div>
          <MHeader eyebrow="F54 · PHENOTYPE HELPER" title={<>Add more data to <span  style={{ color: 'var(--eucalyptus)' }}>suggest a phenotype.</span></>} sub="Phenotype suggestions need consistent logging plus a few clinical signals." />
          {checks.map((c, i) => (
            <div key={i} className="card" style={{ padding: 12, marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `3px solid ${c.ok ? 'var(--severity-mild)' : 'var(--ink-3)'}` }}>
              <span style={{ fontSize: 13 }}>{c.ok ? '✓ ' : '○ '}{c.label}</span>
              {!c.ok && goto && (
                <button className="btn-ghost" style={{ fontSize: 11 }} onClick={() => goto(c.target === 'log' ? 'log' : 'tools')}>
                  Go to {c.target === 'log' ? 'daily log' : c.target === 'labVault' ? 'Lab Vault' : 'Ultrasound'}
                </button>
              )}
            </div>
          ))}
          <div className="card-warm" style={{ padding: 12, marginTop: 14, fontSize: 12, lineHeight: 1.5, color: 'var(--ink-2)' }}>
            We don't show a phenotype until enough signal is on file. Phenotype is a clinical conversation, not an app verdict.
          </div>
        </div>
      );
    }

    // Real inference logic
    const ANDROGEN_REF = { 'Total testosterone': 60, 'Free testosterone': 3.6, 'DHEA-S': 350, 'SHBG': 30 };
    const androgenElevated = labs.some(l => {
      if (!ANDROGEN_REF[l.n]) return false;
      const ref = ANDROGEN_REF[l.n];
      if (l.n === 'SHBG') return +l.value < ref; // low SHBG suggests free androgen excess
      return +l.value > ref;
    });
    const irregularCycles = !!state.irregular || (state.cycleLen && state.cycleLen >= 35);
    const ultrasoundEntries = state.ultrasoundVault || [];
    const pcomConfirmed = ultrasoundEntries.some(u => u.pcom === 'yes' || (u.afcLeft && +u.afcLeft >= 12) || (u.afcRight && +u.afcRight >= 12));
    let computed = null;
    let why = '';
    if (irregularCycles && androgenElevated && pcomConfirmed) {
      computed = 'A'; why = 'Irregular cycles + elevated androgens + PCOM on ultrasound (full Rotterdam triad).';
    } else if (irregularCycles && androgenElevated) {
      computed = 'B'; why = 'Irregular cycles + elevated androgens, ultrasound not yet on file or inconclusive.';
    } else if (!irregularCycles && androgenElevated && pcomConfirmed) {
      computed = 'C'; why = 'Regular cycles + elevated androgens + PCOM (ovulatory phenotype).';
    } else if (irregularCycles && pcomConfirmed && !androgenElevated) {
      computed = 'D'; why = 'Irregular cycles + PCOM, no androgen elevation.';
    } else {
      computed = '?'; why = 'Pattern does not match any single phenotype cleanly — discuss with your clinician.';
    }
    const phenotypes = [
      { k: 'A', l: 'A · Classic',
        cond: 'Irregular cycles + androgens elevated + PCOM',
        whyNot: !irregularCycles ? 'Your cycles are within typical range.' : !androgenElevated ? 'Androgen labs not elevated above thresholds.' : !pcomConfirmed ? 'Ultrasound PCOM not confirmed in vault.' : null,
      },
      { k: 'B', l: 'B · No PCOM',
        cond: 'Irregular cycles + androgens elevated, no ultrasound',
        whyNot: !irregularCycles ? 'Your cycles are within typical range.' : !androgenElevated ? 'Androgen labs not elevated above thresholds.' : null,
      },
      { k: 'C', l: 'C · Ovulatory',
        cond: 'Regular cycles + androgens elevated + PCOM',
        whyNot: irregularCycles ? 'Your cycles are not regular.' : !androgenElevated ? 'Androgen labs not elevated.' : !pcomConfirmed ? 'PCOM not confirmed.' : null,
      },
      { k: 'D', l: 'D · Mild',
        cond: 'Irregular cycles + PCOM, no androgen elevation',
        whyNot: !irregularCycles ? 'Your cycles are within typical range.' : !pcomConfirmed ? 'PCOM not confirmed.' : androgenElevated ? 'Your androgens are elevated, which moves you toward A/B.' : null,
      },
    ];
    // Cache the computed phenotype
    React.useEffect(() => {
      if (computed && computed !== state.phenotype) {
        try {
          const stored = JSON.parse(localStorage.getItem('hq-state') || '{}');
          stored.phenotype = computed;
          localStorage.setItem('hq-state', JSON.stringify(stored));
        } catch {}
      }
    }, [computed]);
    return (
      <div>
        <MHeader eyebrow="F54 · PHENOTYPE HELPER" title={computed === '?' ? <>Pattern doesn't fit a single <span style={{ color: 'var(--eucalyptus)' }}>phenotype yet.</span></> : <>Your data looks most like <span  style={{ color: 'var(--eucalyptus)' }}>Phenotype {computed}.</span></>} sub="This is not a diagnosis." />
        <div className="card-mint" style={{ padding: 16, marginBottom: 14 }}>
          <div className="data" style={{ fontSize: 30, color: 'var(--eucalyptus)', fontWeight: 500 }}>{computed}</div>
          <div className="caption" style={{ marginTop: 4 }}>{why}</div>
        </div>
        {phenotypes.map(p => {
          const isMatch = p.k === computed;
          return (
            <div key={p.l} className="card" style={{ padding: 12, marginBottom: 6, opacity: isMatch ? 1 : 0.7, borderLeft: isMatch ? '3px solid var(--eucalyptus)' : '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 13, fontWeight: isMatch ? 600 : 400 }}>{p.l}</span>
                <span className="caption" style={{ fontSize: 12 }}>{isMatch ? 'matches your data' : p.cond}</span>
              </div>
              {!isMatch && p.whyNot && (
                <div className="caption" style={{ fontSize: 11, marginTop: 4, fontStyle: 'italic', color: 'var(--ink-3)' }}>Why not: {p.whyNot}</div>
              )}
            </div>
          );
        })}
        <div className="card-warm" style={{ padding: 14, marginTop: 14 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>PRIORITY MONITORING</div>
          <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13, lineHeight: 1.7 }}>
            <li>HOMA-IR every 6 months</li>
            <li>Endometrial monitoring at 90+ days amenorrhea</li>
            <li>Annual lipid + HbA1c</li>
          </ul>
        </div>
        <div className="caption" style={{ fontSize: 11, marginTop: 12, lineHeight: 1.5 }}>
          Bring this to your clinician for confirmation. Rotterdam phenotyping requires formal evaluation.
        </div>
      </div>
    );
  };

  M.ultrasound = ({ state }) => {
    const useApp = window.HQ.useApp;
    const { setState } = useApp();
    const vault = state.ultrasoundVault || [];
    const [showForm, setShowForm] = useM(false);
    const [date, setDate] = useM(new Date().toISOString().slice(0, 10));
    const [afcL, setAfcL] = useM('');
    const [afcR, setAfcR] = useM('');
    const [volL, setVolL] = useM('');
    const [volR, setVolR] = useM('');
    const [domYes, setDomYes] = useM(false);
    const [domSize, setDomSize] = useM('');
    const [pcom, setPcom] = useM('inconclusive');
    const [scanType, setScanType] = useM('transvaginal');
    const reset = () => {
      setDate(new Date().toISOString().slice(0, 10));
      setAfcL(''); setAfcR(''); setVolL(''); setVolR('');
      setDomYes(false); setDomSize(''); setPcom('inconclusive'); setScanType('transvaginal');
    };
    const save = () => {
      const entry = {
        date,
        afcLeft: afcL === '' ? null : +afcL,
        afcRight: afcR === '' ? null : +afcR,
        ovVolLeft: volL === '' ? null : +volL,
        ovVolRight: volR === '' ? null : +volR,
        dominant: domYes,
        dominantSize: domYes && domSize ? +domSize : null,
        pcom,
        scanType,
        addedAt: Date.now(),
      };
      setState(s => ({ ...s, ultrasoundVault: [entry, ...(s.ultrasoundVault || [])] }));
      reset();
      setShowForm(false);
    };
    const sorted = [...vault].sort((a, b) => new Date(b.date) - new Date(a.date));
    const latest = sorted[0];
    const trend = sorted.slice().reverse().map(e => ((+e.afcLeft || 0) + (+e.afcRight || 0))).filter(v => v > 0);
    return (
      <div>
        <MHeader eyebrow="F55 · ULTRASOUND VAULT" title={<>Findings, <span  style={{ color: 'var(--eucalyptus)' }}>tracked over time.</span></>} sub="Antral follicle count and ovarian volume vs your AMH." />

        {showForm ? (
          <div className="card-warm" style={{ padding: 14, marginBottom: 12 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>NEW ULTRASOUND</div>
            <label className="caption" style={{ display: 'block', marginBottom: 4 }}>Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%', marginBottom: 10 }} />
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <label className="caption" style={{ display: 'block', marginBottom: 4 }}>AFC left</label>
                <input type="number" value={afcL} onChange={e => setAfcL(e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label className="caption" style={{ display: 'block', marginBottom: 4 }}>AFC right</label>
                <input type="number" value={afcR} onChange={e => setAfcR(e.target.value)} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <label className="caption" style={{ display: 'block', marginBottom: 4 }}>Vol left (ml)</label>
                <input type="number" step="0.1" value={volL} onChange={e => setVolL(e.target.value)} />
              </div>
              <div style={{ flex: 1 }}>
                <label className="caption" style={{ display: 'block', marginBottom: 4 }}>Vol right (ml)</label>
                <input type="number" step="0.1" value={volR} onChange={e => setVolR(e.target.value)} />
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label className="caption" style={{ display: 'block', marginBottom: 4 }}>Dominant follicle</label>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className={`chip ${domYes ? 'active' : ''}`} onClick={() => setDomYes(true)}>Yes</button>
                <button className={`chip ${!domYes ? 'active' : ''}`} onClick={() => setDomYes(false)}>No</button>
                {domYes && <input type="number" placeholder="Size mm" value={domSize} onChange={e => setDomSize(e.target.value)} style={{ flex: 1 }} />}
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <label className="caption" style={{ display: 'block', marginBottom: 4 }}>PCOM finding</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {['yes', 'no', 'inconclusive'].map(o => (
                  <button key={o} className={`chip ${pcom === o ? 'active' : ''}`} onClick={() => setPcom(o)}>{o}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="caption" style={{ display: 'block', marginBottom: 4 }}>Scan type</label>
              <div style={{ display: 'flex', gap: 6 }}>
                <button className={`chip ${scanType === 'transvaginal' ? 'active' : ''}`} onClick={() => setScanType('transvaginal')}>Transvaginal</button>
                <button className={`chip ${scanType === 'abdominal' ? 'active' : ''}`} onClick={() => setScanType('abdominal')}>Abdominal</button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={save}>Save</button>
              <button className="btn-ghost" style={{ flex: 1 }} onClick={() => { setShowForm(false); reset(); }}>Cancel</button>
            </div>
          </div>
        ) : (
          <button className="btn-soft" style={{ width: '100%', marginBottom: 12 }} onClick={() => setShowForm(true)}>+ Add ultrasound</button>
        )}

        {vault.length === 0 ? (
          <div className="card-warm" style={{ padding: 14 }}>
            <div className="caption" style={{ fontSize: 12 }}>No ultrasounds logged yet. Add one to start tracking AFC and ovarian volume over time.</div>
          </div>
        ) : (
          <>
            {latest && (
              <MSection title={`LATEST · ${new Date(latest.date).toLocaleDateString()}`}>
                <div className="card-warm" style={{ padding: 14 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <div className="caption">Right AFC</div>
                      <div className="data" style={{ fontSize: 20 }}>{latest.afcRight ?? '—'}</div>
                    </div>
                    <div>
                      <div className="caption">Left AFC</div>
                      <div className="data" style={{ fontSize: 20 }}>{latest.afcLeft ?? '—'}</div>
                    </div>
                    <div>
                      <div className="caption">Right vol</div>
                      <div className="data" style={{ fontSize: 20 }}>{latest.ovVolRight != null ? `${latest.ovVolRight} ml` : '—'}</div>
                    </div>
                    <div>
                      <div className="caption">Left vol</div>
                      <div className="data" style={{ fontSize: 20 }}>{latest.ovVolLeft != null ? `${latest.ovVolLeft} ml` : '—'}</div>
                    </div>
                  </div>
                  <div className="caption" style={{ marginTop: 10, fontSize: 12 }}>
                    PCOM: <strong>{latest.pcom}</strong> · scan: {latest.scanType}{latest.dominant ? ` · dominant follicle ${latest.dominantSize || '—'}mm` : ''}
                  </div>
                </div>
              </MSection>
            )}
            {trend.length >= 2 && (
              <MSection title={`AFC TREND · ${trend.length} SCAN${trend.length === 1 ? '' : 'S'}`}>
                <div className="card-warm" style={{ padding: 14 }}>
                  <Spark data={trend} color="var(--eucalyptus)" />
                  <div className="caption" style={{ fontSize: 11, marginTop: 4 }}>Total AFC across {trend.length} ultrasound{trend.length === 1 ? '' : 's'}.</div>
                </div>
              </MSection>
            )}
            <MSection title="ALL ENTRIES">
              {sorted.map((e, i) => (
                <div key={i} className="card" style={{ padding: 12, marginBottom: 6 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{new Date(e.date).toLocaleDateString()}</span>
                    <span className="caption" style={{ fontSize: 11 }}>{e.scanType}</span>
                  </div>
                  <div className="caption" style={{ fontSize: 12, marginTop: 4 }}>
                    AFC L:{e.afcLeft ?? '—'} R:{e.afcRight ?? '—'} · Vol L:{e.ovVolLeft ?? '—'} R:{e.ovVolRight ?? '—'} · PCOM: {e.pcom}
                  </div>
                </div>
              ))}
            </MSection>
          </>
        )}
      </div>
    );
  };

  M.annual = ({ state }) => {
    const labs = state.labs || [];
    const now = Date.now();
    const oneYear = 365 * 86400000;
    const within = (lab) => {
      const t = lab.addedAt || (lab.date ? new Date(lab.date).getTime() : 0);
      return t && (now - t) < oneYear;
    };
    const hasLab = (matcher) => labs.some(l => matcher.test(l.n || ''));
    const hasRecent = (matcher) => labs.some(l => matcher.test(l.n || '') && within(l));
    // BP recent
    const bpEntries = Object.entries(state.bpLog || {});
    const bpRecent = bpEntries.some(([k]) => (now - new Date(k).getTime()) < oneYear);
    const bpEver = bpEntries.length > 0;
    // Mental health: drsp entries within last year
    const drspRecent = Object.keys(state.entries || {}).some(k => (now - new Date(k).getTime()) < oneYear);
    const drspEver = Object.keys(state.entries || {}).length > 0;
    // Waist
    const waistRecent = hasRecent(/waist/i);
    const waistEver = hasLab(/waist/i);
    // Define 9 standards
    const standards = [
      { id: 'bp', l: 'Blood pressure', recent: bpRecent, ever: bpEver },
      { id: 'fg', l: 'Fasting glucose OR 2-hour OGTT', recent: hasRecent(/fasting glucose|OGTT/i), ever: hasLab(/fasting glucose|OGTT/i) },
      { id: 'hba1c', l: 'HbA1c', recent: hasRecent(/HbA1c/i), ever: hasLab(/HbA1c/i) },
      { id: 'lipid', l: 'Lipid panel (TC, LDL, HDL, TG)', recent: hasRecent(/lipid|cholesterol|HDL|LDL|triglyceride/i), ever: hasLab(/lipid|cholesterol|HDL|LDL|triglyceride/i) },
      { id: 'vitd', l: 'Vitamin D', recent: hasRecent(/vitamin d/i), ever: hasLab(/vitamin d/i) },
      { id: 'tsh', l: 'TSH', recent: hasRecent(/TSH/i), ever: hasLab(/TSH/i) },
      { id: 'test', l: 'Testosterone', recent: hasRecent(/testosterone/i), ever: hasLab(/testosterone/i) },
      { id: 'waist', l: 'Waist circumference', recent: waistRecent, ever: waistEver },
      { id: 'mh', l: 'Mood / mental health screen', recent: drspRecent, ever: drspEver },
    ];
    const status = (s) => s.recent ? 'logged' : s.ever ? 'overdue' : 'never';
    const sc = { logged: 'var(--severity-mild)', overdue: 'var(--severity-mod)', never: 'var(--ink-3)' };
    const label = { logged: '✓ logged in past 12mo', overdue: '⚠ overdue', never: '✕ never logged' };
    const missing = standards.filter(s => status(s) !== 'logged').map(s => s.l);
    const generatePrep = () => {
      try {
        const stored = JSON.parse(localStorage.getItem('hq-state') || '{}');
        stored.docPrepLabGaps = missing;
        localStorage.setItem('hq-state', JSON.stringify(stored));
      } catch {}
      alert(`Doctor prep updated with ${missing.length} item${missing.length === 1 ? '' : 's'}: ${missing.slice(0, 3).join(', ')}${missing.length > 3 ? '…' : ''}`);
    };
    return (
      <div>
        <MHeader eyebrow="F56 · ANNUAL REVIEW" title={<>Your 9 PCOS <span  style={{ color: 'var(--eucalyptus)' }}>monitoring standards.</span></>} sub="Computed from your labs, BP log, and tracking entries over the last 12 months." />
        {standards.map(s => {
          const st = status(s);
          return (
            <div key={s.id} className="card" style={{ padding: 12, marginBottom: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `3px solid ${sc[st]}` }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{s.l}</div>
                <div className="caption" style={{ fontSize: 11 }}>{label[st]}</div>
              </div>
              <span style={{ fontSize: 11, fontWeight: 500, color: sc[st], textTransform: 'capitalize' }}>{st}</span>
            </div>
          );
        })}
        <button className="btn-primary" style={{ marginTop: 14 }} onClick={generatePrep}>
          Auto-generate doctor prep ({missing.length} missing)
        </button>
      </div>
    );
  };

  Object.assign(window.HQ_MODULES = window.HQ_MODULES || {}, M);
})();
