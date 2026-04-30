function ChartScreen() {
  const { useApp, DRSPChart, Icon, PHASE_COLORS, Leaf, Blob, Logo, PhaseLegend, EmptyState } = window.HQ;
  const { state, setState } = useApp();
  const [docEmail, setDocEmail] = React.useState('');
  const [showReport, setShowReport] = React.useState(false);
  const [tab, setTab] = React.useState('severity'); // T-17

  // T-03 — disclaimer interstitial gate (per-session)
  const [acknowledged, setAcknowledged] = React.useState(!!state.drspAcknowledged);
  const [showInterstitial, setShowInterstitial] = React.useState(false);

  // DRSP-21 keys, mirroring daily-log.jsx
  const DRSP_ITEM_LABELS = [
    { k: 'depressed', label: 'Felt depressed, sad, "down," or "blue"', core: false },
    { k: 'hopeless', label: 'Felt hopeless', core: false },
    { k: 'worthless_guilty', label: 'Felt worthless or guilty', core: false },
    { k: 'anxiety', label: 'Felt anxious, tense, "keyed up," or "on edge"', core: true },
    { k: 'mood_swings', label: 'Mood swings (suddenly tearful, sensitive)', core: true },
    { k: 'rejection_sensitive', label: 'More sensitive to rejection', core: false },
    { k: 'irritability', label: 'Felt angry, irritable', core: true },
    { k: 'conflicts', label: 'Had conflicts or problems with people', core: false },
    { k: 'decreased_interest', label: 'Less interest in usual activities', core: false },
    { k: 'concentration', label: 'Difficulty concentrating', core: false },
    { k: 'fatigue', label: 'Felt lethargic, tired, fatigued, or low energy', core: false },
    { k: 'appetite', label: 'Increased appetite or food cravings', core: false },
    { k: 'hypersomnia', label: 'Slept more / hard to get up', core: false },
    { k: 'insomnia', label: 'Trouble falling or staying asleep', core: false },
    { k: 'overwhelmed', label: 'Felt overwhelmed or unable to cope', core: true },
    { k: 'out_of_control', label: 'Felt out of control', core: false },
    { k: 'breast_tenderness', label: 'Breast tenderness', core: false },
    { k: 'breast_swelling_bloating', label: 'Bloating / weight gain', core: false },
    { k: 'headache', label: 'Headache', core: false },
    { k: 'joint_muscle_pain', label: 'Joint or muscle pain', core: false },
  ];

  // Helper: longest run of consecutive ISO date strings present in `dates` set
  function maxConsecutive(dateList) {
    if (!dateList.length) return 0;
    const sorted = [...dateList].sort();
    let max = 1, run = 1;
    for (let i = 1; i < sorted.length; i++) {
      const diff = Math.round((new Date(sorted[i]) - new Date(sorted[i - 1])) / 86400000);
      if (diff === 1) { run++; max = Math.max(max, run); }
      else { run = 1; }
    }
    return max;
  }

  // Compute cycles from entries
  const cycleAnalysis = React.useMemo(() => {
    const entries = state.entries || {};
    const cycleLen = state.cycleLen || 28;
    const lastPeriod = new Date(state.lastPeriod);
    // Build cycle buckets: cycle 1 = days 1..cycleLen from lastPeriod, cycle 2 = before that
    const cycles = [];
    for (let cycleNum = 0; cycleNum < 3; cycleNum++) {
      const startOffset = cycleNum * cycleLen;
      const endOffset = startOffset + cycleLen - 1;
      // For "current" cycle we look forward from lastPeriod, for "previous" cycles we look backward
      // Simplest: walk backwards in time from today by cycleLen day chunks
      const cycleStart = new Date(lastPeriod);
      cycleStart.setDate(cycleStart.getDate() - (cycleNum * cycleLen));
      const cycleEnd = new Date(cycleStart);
      cycleEnd.setDate(cycleEnd.getDate() + cycleLen - 1);

      // Luteal window = last 7 days of cycle (days -7 to -1 relative to next period)
      const lutealStart = new Date(cycleStart);
      lutealStart.setDate(lutealStart.getDate() + cycleLen - 7);
      // Follicular window = days +4 to +10
      const folStart = new Date(cycleStart);
      folStart.setDate(folStart.getDate() + 3);
      const folEnd = new Date(cycleStart);
      folEnd.setDate(folEnd.getDate() + 9);

      let lutealDays = 0;
      let folDays = 0;
      let totalDaysLogged = 0;
      const lutealDateList = [];
      const folDateList = [];
      let totalItemsLogged = 0;
      const lutealMeans = {};
      const folMeans = {};
      const lutealSums = {};
      const folSums = {};
      const lutealCounts = {};
      const folCounts = {};
      DRSP_ITEM_LABELS.forEach(it => { lutealSums[it.k] = 0; folSums[it.k] = 0; lutealCounts[it.k] = 0; folCounts[it.k] = 0; });

      for (let d = 0; d < cycleLen; d++) {
        const day = new Date(cycleStart);
        day.setDate(day.getDate() + d);
        const key = day.toISOString().slice(0, 10);
        const e = entries[key];
        if (!e) continue;
        totalDaysLogged++;
        const inLuteal = day >= lutealStart && day <= cycleEnd;
        const inFol = day >= folStart && day <= folEnd;
        if (inLuteal) { lutealDays++; lutealDateList.push(key); }
        if (inFol) { folDays++; folDateList.push(key); }
        let itemsThisDay = 0;
        DRSP_ITEM_LABELS.forEach(it => {
          const v = e?.drsp?.[it.k];
          if (typeof v === 'number') {
            itemsThisDay++;
            if (inLuteal) { lutealSums[it.k] += v; lutealCounts[it.k]++; }
            if (inFol) { folSums[it.k] += v; folCounts[it.k]++; }
          }
        });
        totalItemsLogged += itemsThisDay;
      }
      DRSP_ITEM_LABELS.forEach(it => {
        lutealMeans[it.k] = lutealCounts[it.k] ? lutealSums[it.k] / lutealCounts[it.k] : null;
        folMeans[it.k] = folCounts[it.k] ? folSums[it.k] / folCounts[it.k] : null;
      });

      const coverage = cycleLen ? (totalDaysLogged / cycleLen) : 0;
      const lutealConsecutive = maxConsecutive(lutealDateList);
      const folConsecutive = maxConsecutive(folDateList);
      const meanItemsPerDay = totalDaysLogged ? (totalItemsLogged / totalDaysLogged) : 0;
      // Spec §6.3: ≥7 consecutive luteal AND ≥5 consecutive follicular per cycle
      const cycleQualifies = lutealConsecutive >= 7 && folConsecutive >= 5 && meanItemsPerDay >= 4;

      // C-PASS criteria
      const cpass = {
        absoluteSeverity: DRSP_ITEM_LABELS.filter(it => (lutealMeans[it.k] || 0) >= 4).length >= 5,
        coreMood: DRSP_ITEM_LABELS.filter(it => it.core).some(it => (lutealMeans[it.k] || 0) >= 4),
        absoluteClearance: DRSP_ITEM_LABELS.every(it => (folMeans[it.k] == null) || folMeans[it.k] <= 3),
        cyclicity: (() => {
          const allLuteal = DRSP_ITEM_LABELS.map(it => lutealMeans[it.k]).filter(v => v != null);
          const allFol = DRSP_ITEM_LABELS.map(it => folMeans[it.k]).filter(v => v != null);
          if (!allLuteal.length || !allFol.length) return false;
          const lAvg = allLuteal.reduce((a,b)=>a+b,0) / allLuteal.length;
          const fAvg = allFol.reduce((a,b)=>a+b,0) / allFol.length;
          return ((lAvg - fAvg) / 5) * 100 > 30;
        })(),
      };

      cycles.push({
        cycleNum: cycleNum + 1,
        coverage,
        totalDaysLogged,
        lutealConsecutive,
        folConsecutive,
        meanItemsPerDay,
        cycleQualifies,
        lutealMeans,
        folMeans,
        cpass,
      });
    }

    const completedCycles = cycles.filter(c => c.cycleQualifies).length;
    const currentCoverage = cycles[0]?.coverage || 0;
    const currentLutealConsec = cycles[0]?.lutealConsecutive || 0;
    const currentFolConsec = cycles[0]?.folConsecutive || 0;

    return { cycles, completedCycles, currentCoverage, currentLutealConsec, currentFolConsec };
  }, [state.entries, state.cycleLen, state.lastPeriod]);

  // Mock chart data for cycle visualization (only used for chart display)
  const data = React.useMemo(() => {
    const arr = [];
    for (let d = 1; d <= state.cycleLen; d++) {
      let s;
      if (d <= 5) s = 4 + (d % 2);
      else if (d <= 12) s = 1 + (d % 2 === 0 ? 1 : 0);
      else if (d <= 18) s = 2 + (d % 2);
      else s = Math.min(6, 3 + Math.floor((d - 18) / 2));
      arr.push({ day: d, score: s, estimated: d === 9 || d === 16 });
    }
    return arr;
  }, [state.cycleLen]);

  const luteal = data.filter(d => d.day > Math.round(state.cycleLen * 0.55));
  const follicular = data.filter(d => d.day > 5 && d.day <= Math.round(state.cycleLen * 0.45));
  const lAvg = (luteal.reduce((a,b) => a+b.score,0) / luteal.length).toFixed(1);
  const fAvg = (follicular.reduce((a,b) => a+b.score,0) / follicular.length).toFixed(1);

  const loggedDays = Object.keys(state.entries || {}).length;

  // T-03 — 2-cycle gate
  const gateMet = cycleAnalysis.completedCycles >= 2;

  const acknowledge = () => {
    setAcknowledged(true);
    setShowInterstitial(false);
    setState(s => ({ ...s, drspAcknowledged: true }));
  };

  // T-03 — Pattern conclusion language: consistent with / not sufficient to assess / inconsistent with PMDD
  const overallCpass = cycleAnalysis.cycles.slice(0, 2);
  const allMet = overallCpass.length >= 2 && overallCpass.every(c =>
    c.cpass.absoluteSeverity && c.cpass.coreMood && c.cpass.absoluteClearance && c.cpass.cyclicity
  );
  const someMet = overallCpass.some(c =>
    c.cpass.absoluteSeverity || c.cpass.coreMood || c.cpass.absoluteClearance || c.cpass.cyclicity
  );
  const conclusion = !gateMet
    ? 'not sufficient to assess'
    : allMet ? 'consistent with PMDD'
    : someMet ? 'not sufficient to assess'
    : 'inconsistent with PMDD';

  const exportSI = !!state.exportSI;
  const toggleExportSI = () => setState(s => ({ ...s, exportSI: !s.exportSI }));

  // T-91 — passive mode (manual or auto via late-luteal)
  const cycleDay2 = state.cycleDay;
  const cycleLen2 = state.cycleLen || 28;
  const lutealPeakStart2 = Math.round(cycleLen2 * 0.78);
  const inLutealPeak2 = cycleDay2 >= lutealPeakStart2 - 2 && cycleDay2 <= cycleLen2 - 5;
  const passiveActiveByTime2 = state.passiveModeUntil && Date.now() < state.passiveModeUntil;
  const passiveAuto2 = inLutealPeak2 && state.passiveAutoOverride !== true;
  const passive = !!state.passiveMode || passiveActiveByTime2 || passiveAuto2;

  return (
    <div className="screen" style={{ position: 'relative' }}>
      <Leaf size={120} color="var(--butter)" style={{ top: -10, right: -30, opacity: 0.22 }} rotate={20} />
      <Blob size={240} color="var(--mint-mist)" style={{ bottom: 100, left: -120, opacity: 0.2 }} animate />

      <div style={{ marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Icon.Sparkle width="18" height="18" style={{ color: 'var(--butter-deep)' }} />
        <span className="eyebrow" style={{ color: 'var(--butter-deep)' }}>YOUR DRSP LOG SUMMARY</span>
      </div>
      <h1 className="display" style={{ marginBottom: 14 }}>
        A pattern <em className="italic-display" style={{ color: 'var(--eucalyptus)' }}>worth showing.</em>
      </h1>

      {/* T-03 — 2-cycle gate empty state — spec §6.3 minimums */}
      {!gateMet && (
        <div className="card-warm" style={{ padding: 22, marginBottom: 18, borderLeft: '3px solid var(--butter-deep)' }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>YOUR DRSP REPORT</div>
          <p className="body" style={{ marginBottom: 8 }}>
            Your DRSP report needs 2 cycles with at least 7 consecutive luteal-phase days and 5 consecutive follicular-phase days each (per C-PASS / spec §6.3).
          </p>
          <p className="body" style={{ fontSize: 13, color: 'var(--ink-2)' }}>
            Cycle <strong>{cycleAnalysis.completedCycles + 1}</strong> · need <strong>{Math.max(0, 7 - cycleAnalysis.currentLutealConsec)}</strong> more luteal day{(7 - cycleAnalysis.currentLutealConsec) === 1 ? '' : 's'} · <strong>{Math.max(0, 5 - cycleAnalysis.currentFolConsec)}</strong> more follicular day{(5 - cycleAnalysis.currentFolConsec) === 1 ? '' : 's'}.
          </p>
        </div>
      )}

      {/* T-03 — disclaimer interstitial gate */}
      {gateMet && !acknowledged && (
        <div className="card-warm" style={{ padding: 22, marginBottom: 18, background: 'var(--cream-warm)' }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>BEFORE YOU SEE YOUR REPORT</div>
          <p className="body" style={{ fontSize: 14, marginBottom: 12 }}>
            Tap below to read the disclaimer and reveal your report.
          </p>
          <button className="btn-primary" onClick={() => setShowInterstitial(true)}>Read disclaimer</button>
        </div>
      )}

      {/* Empty state for no logs at all */}
      {loggedDays === 0 && EmptyState && (
        <EmptyState
          icon={Icon.Activity}
          title="Your first chart will show up here."
          body="Once you've logged for two cycles, I can chart your pattern and show you the differential."
        />
      )}

      {gateMet && acknowledged && (
        <>
          <p className="body" style={{ color: 'var(--ink-2)', marginBottom: 20 }}>
            Across two completed cycles, your data is <strong style={{ color: 'var(--ink)' }}>{conclusion}</strong>. This is what your prospective DRSP record shows — not a diagnosis.
          </p>

          {/* T-17 sub-tabs */}
          <div style={{ display: 'flex', gap: 4, padding: 4, background: 'var(--mint-pale)', borderRadius: 999, marginBottom: 14, width: 'fit-content' }}>
            {[
              { k: 'severity', l: 'Severity' },
              { k: 'mood', l: 'Mood' },
              { k: 'fog', l: 'Brain fog' },
            ].map(t => (
              <button key={t.k} onClick={() => setTab(t.k)}
                style={{ padding: '6px 14px', fontSize: 12, fontWeight: 500, borderRadius: 999, background: tab === t.k ? 'var(--eucalyptus)' : 'transparent', color: tab === t.k ? '#fff' : 'var(--ink-2)' }}>
                {t.l}
              </button>
            ))}
          </div>

          {tab === 'severity' && (
            <>
              <div className="chart-wrap" style={{ marginBottom: 8 }}>
                <DRSPChart data={data} cycleLen={state.cycleLen} height={210} />
              </div>
              {PhaseLegend && (
                <div style={{ marginBottom: 14, display: 'flex', justifyContent: 'center' }}>
                  <PhaseLegend compact />
                </div>
              )}
            </>
          )}

          {tab === 'mood' && (
            <div className="card-warm" style={{ padding: 14, marginBottom: 12 }}>
              <div className="caption" style={{ marginBottom: 10 }}>Mood distribution by cycle phase</div>
              <div className="caption" style={{ fontSize: 11 }}>Aggregated across your logged cycles.</div>
            </div>
          )}

          {tab === 'fog' && (
            <div className="chart-wrap" style={{ marginBottom: 12 }}>
              <DRSPChart data={data} cycleLen={state.cycleLen} height={210} />
              <div className="caption" style={{ marginTop: 6 }}>Concentration (DRSP item) trend across your logged days.</div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 16 }}>
            <div className="card-warm" style={{ padding: 14 }}>
              <div className="caption">Luteal avg</div>
              <div className="data" style={{ fontSize: 24, color: 'var(--severity-severe)', fontWeight: 500 }}>{lAvg}</div>
            </div>
            <div className="card-warm" style={{ padding: 14 }}>
              <div className="caption">Follicular avg</div>
              <div className="data" style={{ fontSize: 24, color: 'var(--severity-mild)', fontWeight: 500 }}>{fAvg}</div>
            </div>
            <div className="card-warm" style={{ padding: 14 }}>
              <div className="caption">Cycles</div>
              <div className="data" style={{ fontSize: 24, color: 'var(--ink)', fontWeight: 500 }}>{cycleAnalysis.completedCycles}</div>
            </div>
          </div>

          {/* T-03 — C-PASS 4-criterion checklist across both cycles */}
          <div className="card-paper" style={{ padding: 14, marginBottom: 16, background: 'var(--cream-warm)', color: 'var(--ink)' }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>C-PASS · 4 CRITERIA · 2 CYCLES</div>
            <table style={{ width: '100%', fontSize: 12, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--ink)' }}>
                  <th style={{ textAlign: 'left', padding: 6 }}>Criterion</th>
                  <th style={{ padding: 6 }}>Cycle 1</th>
                  <th style={{ padding: 6 }}>Cycle 2</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { k: 'absoluteSeverity', l: '≥5 items reach ≥4 in luteal' },
                  { k: 'coreMood', l: 'At least 1 core mood item ≥4' },
                  { k: 'absoluteClearance', l: 'No symptom > 3 in follicular' },
                  { k: 'cyclicity', l: 'Luteal–follicular gap > 30%' },
                ].map(row => (
                  <tr key={row.k} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: 6 }}>{row.l}</td>
                    <td style={{ padding: 6, textAlign: 'center' }}>{cycleAnalysis.cycles[0]?.cpass[row.k] ? '✓' : '○'}</td>
                    <td style={{ padding: 6, textAlign: 'center' }}>{cycleAnalysis.cycles[1]?.cpass[row.k] ? '✓' : '○'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="caption" style={{ fontSize: 10, marginTop: 8, lineHeight: 1.5 }}>
              C-PASS · Carolina Premenstrual Assessment Scoring System (Rubinow et al. 2017, PMC5205545)
            </div>
          </div>

          {/* T-03 — 11-item per-symptom table */}
          <div className="card-paper" style={{ padding: 14, marginBottom: 16, background: 'var(--cream-warm)', color: 'var(--ink)' }}>
            <div className="eyebrow" style={{ marginBottom: 10 }}>PER-SYMPTOM · 11 ITEMS · LUTEAL VS FOLLICULAR</div>
            <table style={{ width: '100%', fontSize: 11, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--ink)' }}>
                  <th style={{ textAlign: 'left', padding: 4 }}>Symptom</th>
                  <th style={{ padding: 4 }}>Luteal</th>
                  <th style={{ padding: 4 }}>Follicular</th>
                </tr>
              </thead>
              <tbody style={{ fontFamily: 'var(--mono)' }}>
                {DRSP_ITEM_LABELS.map(it => {
                  const c1 = cycleAnalysis.cycles[0] || {};
                  const lAvgItem = c1.lutealMeans?.[it.k];
                  const fAvgItem = c1.folMeans?.[it.k];
                  return (
                    <tr key={it.k} style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: 4, fontFamily: 'var(--sans)' }}>{it.label}{it.core ? ' *' : ''}</td>
                      <td style={{ padding: 4, textAlign: 'center' }}>{lAvgItem != null ? lAvgItem.toFixed(1) : '—'}</td>
                      <td style={{ padding: 4, textAlign: 'center' }}>{fAvgItem != null ? fAvgItem.toFixed(1) : '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="caption" style={{ fontSize: 10, marginTop: 8 }}>* core mood items (anxiety, mood swings, irritability, overwhelmed)</div>
          </div>

          <div className="caption" style={{ marginBottom: 28 }}>
            {cycleAnalysis.cycles[0]?.totalDaysLogged || 0} of {state.cycleLen} days logged in current cycle.
          </div>

          {/* T-03 — Explicit SI export opt-in */}
          <div className="card-warm" style={{ padding: 14, marginBottom: 16 }}>
            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={exportSI}
                onChange={toggleExportSI}
                style={{ marginTop: 4 }}
              />
              <span>
                <strong>Include suicidal ideation tracking in this export</strong> — only do this for a clinician you trust.
                <div className="caption" style={{ fontSize: 11, marginTop: 4 }}>
                  Default: excluded from physician export. Your DRSP item 12 stays on your device unless you turn this on.
                </div>
              </span>
            </label>
          </div>

          {/* T-91 — passive mode hides Send / Email / Download CTAs */}
          {!passive && (
            <div className="card-mint" style={{ padding: 22, marginBottom: 24 }}>
              <h2 className="h2" style={{ marginBottom: 8 }}>Bring this to your appointment</h2>
              <p className="body" style={{ marginBottom: 16, color: 'var(--ink-2)', fontSize: 14 }}>
                Ready to talk to your doctor? Here's how to share this report.
              </p>
              <input type="email" placeholder="Your doctor's email" value={docEmail} onChange={e => setDocEmail(e.target.value)} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
                <button className="btn-primary" onClick={() => setShowReport(true)}>Send</button>
                <button className="btn-outline" onClick={() => setShowReport(true)}>Download PDF</button>
              </div>
            </div>
          )}
          {passive && (
            <div className="caption" style={{ marginBottom: 24, padding: '10px 14px', textAlign: 'center', fontSize: 12, color: 'var(--ink-3)' }}>
              Quiet view — sharing actions are hidden today.{' '}
              {passiveAuto2 && (
                <button onClick={() => setState(s => ({ ...s, passiveAutoOverride: true, passiveMode: false, passiveModeUntil: null }))}
                  style={{ background: 'none', border: 'none', padding: 0, color: 'var(--eucalyptus)', textDecoration: 'underline', cursor: 'pointer', fontSize: 12 }}>
                  Show share options
                </button>
              )}
            </div>
          )}

          {/* T-03 / T-60 — warm-paper aesthetic preview */}
          <div>
            <div className="eyebrow" style={{ marginBottom: 10 }}>Report preview</div>
            <div className="card-clinical" style={{
              background: 'var(--cream-warm)',
              color: 'var(--ink)',
              padding: 18,
              border: '1px solid var(--border)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--ink)', paddingBottom: 10, marginBottom: 12 }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', color: 'var(--ink)' }}>
                  YOUR DRSP LOG SUMMARY — APR 2026
                </div>
                <Logo size={13} color="var(--ink)" />
              </div>
              <div style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 12, color: 'var(--ink-2)', marginBottom: 14 }}>
                Daily Record of Severity of Problems · Endicott et al., Columbia University
              </div>
              <DRSPChart data={data} cycleLen={state.cycleLen} mono={true} height={160} />
              <div style={{ fontSize: 12, marginTop: 14, lineHeight: 1.6 }}>
                Across 2 cycles your prospective record is <strong>{conclusion}</strong>.
                {!exportSI && <span> Item 12 (SI) excluded from this export.</span>}
              </div>
              <div style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 11, color: 'var(--ink-2)', marginTop: 14 }}>
                Generated from prospective daily ratings. For clinical review — not a diagnosis.
              </div>
            </div>
          </div>
        </>
      )}

      {/* T-03 — full-screen disclaimer interstitial */}
      {showInterstitial && (
        <div className="modal-backdrop" style={{ alignItems: 'stretch' }}>
          <div className="modal" style={{ maxWidth: 480, width: '92%', maxHeight: '92vh', overflowY: 'auto' }}>
            <div className="eyebrow" style={{ marginBottom: 10, color: 'var(--butter-deep)' }}>IMPORTANT</div>
            <h2 className="display-sm" style={{ marginBottom: 14 }}>Before you see your DRSP Log Summary</h2>
            <p className="body" style={{ fontSize: 14, marginBottom: 14, lineHeight: 1.6 }}>
              The DRSP (Daily Record of Severity of Problems) is a validated symptom tracking tool used in clinical settings to support — not replace — professional assessment of PMDD.
            </p>
            <p className="body" style={{ fontSize: 14, marginBottom: 14, lineHeight: 1.6 }}>
              Your completed DRSP reflects what you've logged. It does not diagnose PMDD. A diagnosis requires evaluation by a licensed healthcare provider, typically over at least two cycles.
            </p>
            <p className="body" style={{ fontSize: 14, marginBottom: 22, lineHeight: 1.6 }}>
              You are encouraged to share this report with your provider.
            </p>
            <button
              className="btn-primary"
              style={{ width: '100%', height: 56 }}
              onClick={acknowledge}
            >
              I understand
            </button>
          </div>
        </div>
      )}

      {showReport && (
        <div className="modal-backdrop" onClick={() => setShowReport(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'var(--mint-mist)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
              <Icon.Check width="28" height="28" stroke="var(--eucalyptus)" />
            </div>
            <div className="display-sm" style={{ marginBottom: 10 }}>Your report is ready.</div>
            <p className="body" style={{ marginBottom: 22 }}>{docEmail ? `Sent to ${docEmail}.` : 'PDF prepared.'} Saved in My Reports.</p>
            <button className="btn-primary" onClick={() => setShowReport(false)}>Done</button>
          </div>
        </div>
      )}
    </div>
  );
}

window.ChartScreen = ChartScreen;
