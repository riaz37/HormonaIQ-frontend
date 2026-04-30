// Modules — set 1: Core, PMDD
(function () {
  const useM = window.useM || React.useState;
  const { MHeader, Stat, Severity, Spark, EvidenceBar, ToggleRow, MSection } = window.HQ_UI;

  const M = {};

  // ===== CORE =====
  M.phaseEd = ({ state }) => (
    <div>
      <MHeader eyebrow="F7 · PHASE EDUCATION" title={<>What's happening <span  style={{ color: 'var(--eucalyptus)' }}>today.</span></>} sub="Plain-language, one card per day. Tied to what you logged." />
      <div className="card-warm" style={{ marginBottom: 12 }}>
        <div className="phase-pill" style={{ background: 'var(--phase-luteal)', color: 'rgba(0,0,0,0.7)', marginBottom: 10 }}>🍂 Late luteal · Day {state.cycleDay}</div>
        <p className="body" style={{ marginBottom: 8 }}>Your progesterone is dropping fast. Estrogen is also low. This is the steepest hormone gradient of your cycle — and the reason you're tired, foggy, and reactive.</p>
        <p className="body" style={{ fontSize: 13, color: 'var(--ink-2)' }}>What you logged today (irritability 4, focus 5) lines up exactly with this drop. It is biological.</p>
      </div>
      {[
        { d: 'Day 1–5', t: 'Menstrual', c: 'Estrogen low, progesterone low. Body sheds the lining. Iron drops. Slow it all down.' },
        { d: 'Day 6–14', t: 'Follicular', c: 'Estrogen climbs. Energy and focus return. Best window for new starts and cardio.' },
        { d: 'Day 14–16', t: 'Ovulatory', c: 'Estrogen peaks, LH surge. Verbal expression at its best. Confidence high.' },
        { d: 'Day 17–28', t: 'Luteal', c: 'Progesterone rises then crashes. PMDD-vulnerable window. Plan light, sleep more.' },
      ].map(p => (
        <div key={p.t} className="card-warm" style={{ marginBottom: 8, padding: 14 }}>
          <div className="data caption" style={{ marginBottom: 4 }}>{p.d}</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{p.t}</div>
          <div className="caption" style={{ fontSize: 12 }}>{p.c}</div>
        </div>
      ))}
    </div>
  );

  M.patterns = ({ state }) => {
    // T-14 — empty / early / confirmed states by logged days
    const loggedDays = Object.keys(state.entries || {}).length;
    const patternState = loggedDays < 7 ? 'empty' : loggedDays < 35 ? 'early' : 'confirmed';
    // F11 refinement — compute real luteal vs follicular DRSP averages from state.entries
    const { phaseForDay } = window.HQ;
    const cycleLen = state.cycleLen || 28;
    const lastPeriod = state.lastPeriod ? new Date(state.lastPeriod) : null;
    const meanDrsp = (entry) => {
      if (!entry || !entry.drsp) return null;
      const vals = Object.entries(entry.drsp).filter(([k]) => k !== 'suicidal_ideation').map(([, v]) => +v).filter(v => v > 0);
      return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length) : null;
    };
    const phaseDayFor = (dateKey) => {
      if (!lastPeriod) return null;
      const dt = new Date(dateKey);
      const diff = Math.floor((dt - lastPeriod) / 86400000);
      return Math.max(1, ((diff) % cycleLen) + 1);
    };
    const lutealVals = [];
    const follVals = [];
    const itemSums = {};
    const itemCounts = {};
    Object.entries(state.entries || {}).forEach(([k, e]) => {
      const cd = phaseDayFor(k);
      if (!cd) return;
      const ph = phaseForDay(cd, cycleLen, { coarse: true });
      const m = meanDrsp(e);
      if (m == null) return;
      if (ph === 'L') {
        lutealVals.push(m);
        Object.entries(e.drsp || {}).forEach(([key, v]) => {
          if (key === 'suicidal_ideation') return;
          itemSums[key] = (itemSums[key] || 0) + (+v || 0);
          itemCounts[key] = (itemCounts[key] || 0) + 1;
        });
      } else if (ph === 'F') {
        follVals.push(m);
      }
    });
    const lutealMean = lutealVals.length ? (lutealVals.reduce((a, b) => a + b, 0) / lutealVals.length) : null;
    const follMean = follVals.length ? (follVals.reduce((a, b) => a + b, 0) / follVals.length) : null;
    const swing = (lutealMean && follMean && follMean > 0) ? (lutealMean / follMean) : null;
    const topItems = Object.entries(itemSums)
      .map(([k, sum]) => ({ k, avg: sum / (itemCounts[k] || 1) }))
      .sort((a, b) => b.avg - a.avg)
      .slice(0, 3);
    const itemLabel = (k) => ({
      irritability: 'irritability', anxiety: 'anxiety', overwhelmed: 'overwhelmed',
      concentration: 'concentration', fatigue: 'fatigue', mood_swings: 'mood swings',
      depressed: 'depression', rejection_sensitive: 'rejection sensitivity',
      out_of_control: 'feeling out of control', hopeless: 'hopelessness',
      breast_tenderness: 'breast tenderness', headache: 'headache',
      appetite: 'appetite/cravings', insomnia: 'insomnia', hypersomnia: 'hypersomnia',
    })[k] || k.replace(/_/g, ' ');
    const cmap = { severe: 'var(--severity-severe)', mod: 'var(--severity-mod)', mild: 'var(--severity-mild)' };

    // R7 — F11/F41 real trigger correlations from triggerLog × DRSP next-day
    const triggerLog = state.triggerLog || {};
    const corrFor = (triggerKey) => {
      // Compare DRSP mean on days when trigger present (1) vs absent (0). Returns { withTrigger, without, delta, n }.
      const withT = []; const withoutT = [];
      Object.keys(state.entries || {}).forEach(d => {
        const drsp = meanDrsp(state.entries[d]);
        if (drsp == null) return;
        const t = triggerLog[d];
        if (!t) return;
        if (t[triggerKey]) withT.push(drsp); else withoutT.push(drsp);
      });
      if (!withT.length || !withoutT.length) return null;
      const a = withT.reduce((x, y) => x + y, 0) / withT.length;
      const b = withoutT.reduce((x, y) => x + y, 0) / withoutT.length;
      return { withT: a, without: b, delta: a - b, n: withT.length + withoutT.length };
    };
    const triggerCorrs = [
      { id: 'sleep', label: 'Days you slept poorly', invert: false },
      { id: 'caffeine', label: 'Days with caffeine', invert: false },
      { id: 'alcohol', label: 'Days with alcohol', invert: false },
      { id: 'exercise', label: 'Days you exercised', invert: true },
      { id: 'stress', label: 'High-stress days', invert: false },
    ].map(t => ({ ...t, c: corrFor(t.id) })).filter(t => t.c && Math.abs(t.c.delta) >= 0.5);

    const dynamicPatterns = [];
    if (lutealMean != null && follMean != null && swing && swing >= 1.5) {
      dynamicPatterns.push({
        t: `Cycle-recurrent severity confirmed (${swing.toFixed(1)}× swing)`,
        d: `Across ${lutealVals.length + follVals.length} logged days, your luteal mean is ${swing.toFixed(1)}× higher than follicular. This is the prospective pattern DSM-5 PMDD evaluation looks for.`,
        c: Math.min(99, Math.round((swing - 1) * 50 + 50)),
        s: swing >= 2.5 ? 'severe' : swing >= 2 ? 'mod' : 'mild',
      });
    }
    triggerCorrs.forEach(t => {
      const sign = t.c.delta > 0 ? '+' : '';
      const direction = (t.invert ? -1 : 1) * t.c.delta;
      dynamicPatterns.push({
        t: `${t.label} → DRSP ${sign}${t.c.delta.toFixed(1)}`,
        d: `On ${t.label.toLowerCase()}, your DRSP averages ${t.c.withT.toFixed(1)}/6 vs ${t.c.without.toFixed(1)}/6 on other days. ${t.invert && direction > 0 ? 'Notable protective effect.' : direction > 0.5 ? 'Worth tracking the link.' : 'Subtle correlation — keep watching.'}`,
        c: Math.min(99, Math.round(Math.abs(t.c.delta) * 30 + 40)),
        s: Math.abs(t.c.delta) >= 1 ? 'mod' : 'mild',
      });
    });
    const patterns = dynamicPatterns;
    return (
      <div>
        <MHeader eyebrow="F11 · PATTERN ENGINE" title={<>What 3 cycles <span  style={{ color: 'var(--eucalyptus)' }}>actually show.</span></>} sub="Your personal correlations, not population averages." />
        {patternState === 'empty' && (
          <div className="ora-card">
            <div className="ora-label">ORA</div>
            <div className="ora-body">
              I haven't seen enough of your cycle yet to say anything useful — about 2 weeks in, I'll start noticing things, and by your second luteal I'll have a real pattern to show you. Until then I'm here if you want to talk.
            </div>
          </div>
        )}
        {patternState === 'early' && (
          <div className="ora-card">
            <div className="ora-label">ORA · EARLY READ</div>
            <div className="ora-body">
              One cycle in. I'm seeing what looks like a luteal-phase shift around day 22, but I want one more cycle before I trust it. Hold tight.
            </div>
          </div>
        )}
        {patternState === 'confirmed' && (
          <>
            {(lutealMean != null && follMean != null) ? (
              <div className="card-warm" style={{ padding: 14, marginBottom: 10, borderLeft: '3px solid var(--severity-severe)' }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Your luteal vs follicular swing</div>
                <div className="caption" style={{ fontSize: 12, marginBottom: 6 }}>
                  Luteal mean DRSP: <strong className="data">{lutealMean.toFixed(1)}/6</strong> · follicular mean: <strong className="data">{follMean.toFixed(1)}/6</strong>{swing ? <> · a <strong className="data">{swing.toFixed(1)}×</strong> swing</> : null}.
                </div>
                {topItems.length > 0 && (
                  <div className="caption" style={{ fontSize: 12 }}>
                    Most consistent luteal symptoms: {topItems.map(i => itemLabel(i.k)).join(', ')}.
                  </div>
                )}
              </div>
            ) : null}
            {patterns.map(p => (
              <div key={p.t} className="card-warm" style={{ padding: 14, marginBottom: 10, borderLeft: `3px solid ${cmap[p.s]}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3, paddingRight: 8 }}>{p.t}</div>
                  <span className="data" style={{ fontSize: 12, color: cmap[p.s] }}>{p.c}%</span>
                </div>
                <div className="caption" style={{ fontSize: 12 }}>{p.d}</div>
              </div>
            ))}
          </>
        )}
      </div>
    );
  };

  M.energy = () => (
    <div>
      <MHeader eyebrow="F29 · ENERGY FORECAST" title={<>Your week, <span  style={{ color: 'var(--eucalyptus)' }}>energy-honest.</span></>} sub="Built for ADHD-cycle reality. Plan with your body, not against it." />
      <div className="card-warm" style={{ padding: 16, marginBottom: 14 }}>
        <div className="eyebrow" style={{ marginBottom: 8 }}>TODAY · DAY {19} · LUTEAL</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <div className="caption">Cognitive</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <div style={{ width: 100, height: 6, background: 'var(--mint-mist)', borderRadius: 999 }}>
                <div style={{ width: '38%', height: '100%', background: 'var(--coral)', borderRadius: 999 }} />
              </div>
              <span className="data" style={{ fontSize: 12 }}>38%</span>
            </div>
          </div>
          <div>
            <div className="caption">Physical</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
              <div style={{ width: 100, height: 6, background: 'var(--mint-mist)', borderRadius: 999 }}>
                <div style={{ width: '52%', height: '100%', background: 'var(--severity-mod)', borderRadius: 999 }} />
              </div>
              <span className="data" style={{ fontSize: 12 }}>52%</span>
            </div>
          </div>
        </div>
      </div>
      <MSection title="THIS WEEK">
        {[
          { d: 'Wed', day: 19, ph: 'L', cog: 38, phys: 52 },
          { d: 'Thu', day: 20, ph: 'L', cog: 32, phys: 48 },
          { d: 'Fri', day: 21, ph: 'L', cog: 28, phys: 45 },
          { d: 'Sat', day: 22, ph: 'L', cog: 25, phys: 40 },
          { d: 'Sun', day: 23, ph: 'L', cog: 30, phys: 42 },
          { d: 'Mon', day: 24, ph: 'L', cog: 38, phys: 50 },
          { d: 'Tue', day: 25, ph: 'L', cog: 50, phys: 58 },
        ].map(d => (
          <div key={d.day} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 50 }}>
              <div className="data" style={{ fontSize: 13 }}>{d.d}</div>
              <div className="caption" style={{ fontSize: 10 }}>Day {d.day}</div>
            </div>
            <div style={{ flex: 1, display: 'flex', gap: 6 }}>
              <div style={{ flex: 1 }}>
                <div style={{ height: 4, background: 'var(--mint-mist)', borderRadius: 999 }}>
                  <div style={{ width: d.cog + '%', height: '100%', background: 'var(--eucalyptus)', borderRadius: 999 }} />
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ height: 4, background: 'var(--mint-mist)', borderRadius: 999 }}>
                  <div style={{ width: d.phys + '%', height: '100%', background: 'var(--coral)', borderRadius: 999 }} />
                </div>
              </div>
            </div>
            <span className="data" style={{ fontSize: 11, color: 'var(--ink-3)', width: 50, textAlign: 'right' }}>{d.cog}/{d.phys}</span>
          </div>
        ))}
        <div className="caption" style={{ marginTop: 10, fontSize: 11 }}>Green = cognitive · coral = physical. 0–100, calibrated to your last 2 cycles.</div>
      </MSection>
    </div>
  );

  // ===== PMDD =====
  M.pmddPDF = ({ state, DRSPChart }) => {
    // T-03 — re-framed as DRSP Log Summary (not a diagnostic report)
    // R7 — real PDF generation via window.HQ.generatePDF
    const sampleData = Array.from({ length: 28 }, (_, i) => ({ day: i + 1, score: i < 5 ? 4 + (i % 2) : i < 14 ? 1 + (i % 2) : i < 18 ? 2 + (i % 2) : Math.min(6, 3 + Math.floor((i - 17) / 2)) }));

    const handleDownload = () => {
      const entries = state.entries || {};
      const dates = Object.keys(entries).sort();
      const cycleLen = state.cycleLen || 28;
      const yearOfBirth = state.yearOfBirth || null;
      const age = yearOfBirth ? new Date().getFullYear() - yearOfBirth : null;

      // Compute phase averages
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

      // Crisis events count
      const tier3Count = dates.filter(d => entries[d] && entries[d].drsp &&
        (entries[d].drsp.suicidal_ideation >= 4 ||
         Object.values(entries[d].drsp).some(v => typeof v === 'number' && v >= 5))).length;

      window.HQ.generatePDF({
        title: 'PMDD DRSP Log Summary',
        subtitle: `${dates.length} days logged · ${age ? age + ' years old · ' : ''}cycle length ${cycleLen}d`,
        filename: `hormonaiq-pmdd-report-${new Date().toISOString().slice(0, 10)}.pdf`,
        sections: [
          {
            heading: 'Patient profile',
            lines: [
              { kind: 'kv', key: 'Conditions tracked', value: (state.conditions || []).join(', ') || '—' },
              { kind: 'kv', key: 'Days logged', value: String(dates.length) },
              { kind: 'kv', key: 'Cycle length', value: cycleLen + ' days' },
              { kind: 'kv', key: 'ADHD overlap', value: state.adhd === 'Yes' ? 'Yes' : state.adhd || 'No' },
              { kind: 'kv', key: 'Hormonal contraception', value: state.hbcActive ? (state.hbcType || 'yes — type not specified').replace(/_/g, ' ') : 'No' },
            ],
          },
          {
            heading: 'DRSP severity by cycle phase',
            lines: ['Highest daily DRSP item score, averaged across logged days within each phase. Higher = more severe.'],
            table: {
              headers: ['Phase', 'Mean max severity (1–6)', 'Days logged'],
              rows: [
                ['Follicular', meanOf(phaseAvgs.F), String(phaseAvgs.F.length)],
                ['Ovulatory', meanOf(phaseAvgs.O), String(phaseAvgs.O.length)],
                ['Luteal', meanOf(phaseAvgs.L), String(phaseAvgs.L.length)],
                ['Menstrual', meanOf(phaseAvgs.M), String(phaseAvgs.M.length)],
              ],
            },
          },
          {
            heading: 'Pattern interpretation',
            lines: [
              `Luteal mean: ${meanOf(phaseAvgs.L)} · Follicular mean: ${meanOf(phaseAvgs.F)}.`,
              `Phase ratio (luteal ÷ follicular): ${(phaseAvgs.L.length && phaseAvgs.F.length)
                ? ((phaseAvgs.L.reduce((a, b) => a + b, 0) / phaseAvgs.L.length) / Math.max(phaseAvgs.F.reduce((a, b) => a + b, 0) / phaseAvgs.F.length, 0.5)).toFixed(2)
                : '—'}× (DSM-5 PMDD criterion A pattern shows a clear cyclical worsening in luteal phase that resolves with menses).`,
              'This is what the patient\'s prospective DRSP record shows — not a diagnosis. Clinical evaluation required.',
            ],
          },
          {
            heading: 'Safety events (last 90 days)',
            lines: [
              { kind: 'kv', key: 'Tier-3 crisis surfaces', value: String(tier3Count) },
              { kind: 'kv', key: 'Crisis resources accessed', value: 'Anonymized — counts only, no message content' },
            ],
          },
          {
            heading: 'Treatment & response (current)',
            lines: state.ssriConfig
              ? [{ kind: 'kv', key: 'SSRI', value: `${state.ssriConfig.name || '—'} ${state.ssriConfig.dose || ''} (${state.ssriConfig.pattern || 'continuous'})` }]
              : ['No SSRI logged.'],
          },
          {
            heading: 'Notes',
            lines: [
              state.exportSI ? 'Item 12 (suicidal ideation) included by patient consent.' : 'Item 12 (suicidal ideation) excluded from this export.',
              'Generated by HormonaIQ — patient self-report. Discuss with provider before treatment decisions.',
            ],
          },
        ],
      });
    };

    return (
      <div>
        <MHeader eyebrow="F9 · YOUR DRSP LOG SUMMARY" title={<>Physician-ready, <span  style={{ color: 'var(--eucalyptus)' }}>2 cycles deep.</span></>} sub="Generated from your prospective DRSP record. Not a diagnosis." />
        <div className="card-clinical" style={{ background: 'var(--cream-warm)', color: 'var(--ink)', padding: 18, marginBottom: 14, border: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', borderBottom: '1px solid var(--ink)', paddingBottom: 8, marginBottom: 10 }}>
            DRSP LOG PREVIEW · {Object.keys(state.entries || {}).length} DAYS LOGGED
          </div>
          <div style={{ fontFamily: 'var(--display)', fontStyle: 'italic', fontSize: 12, marginBottom: 10 }}>Daily Record of Severity of Problems</div>
          <DRSPChart data={Object.keys(state.entries || {}).length > 0 ? sampleData : sampleData} cycleLen={28} mono height={150} />
          <div style={{ fontSize: 11, marginTop: 12, lineHeight: 1.5 }}>
            <strong>Pattern summary:</strong> Click "Download PDF" to generate your physician-ready report from your prospective DRSP record. Not a diagnosis — bring to a licensed clinician.
          </div>
          {!state.exportSI && (
            <div className="caption" style={{ fontSize: 10, marginTop: 8, fontStyle: 'italic' }}>Item 12 (suicidal ideation) excluded from this export.</div>
          )}
        </div>
        <button className="btn-primary" onClick={handleDownload}>⤓ Download PDF</button>
        <button className="btn-outline" style={{ marginTop: 8, width: '100%' }} onClick={() => window.location.href = `mailto:?subject=HormonaIQ%20DRSP%20report&body=Generate%20PDF%20first,%20then%20attach.`}>Email to my doctor</button>
      </div>
    );
  };

  M.crisis = () => (
    <div>
      <MHeader eyebrow="F19 · CRISIS SAFETY" title={<>You are <span  style={{ color: 'var(--eucalyptus)' }}>not alone</span> right now.</>} sub="Three tiers, no alarms. You decide what helps." />
      {[
        { tier: 1, t: 'Grounding', sub: '60-second breath, 5-4-3-2-1 senses, cold water', icon: '◯', color: 'var(--mint-mist)' },
        { tier: 2, t: 'Reach out', sub: 'Text a chosen person from your safety plan', icon: '☎', color: 'var(--butter)' },
        { tier: 3, t: 'Crisis line', sub: '988 Suicide & Crisis Lifeline · text or call', icon: '♡', color: 'var(--coral-soft)' },
      ].map(t => (
        <button key={t.tier} className="card-warm" style={{ width: '100%', padding: 16, marginBottom: 8, textAlign: 'left', display: 'flex', alignItems: 'center', gap: 12, background: t.color }}>
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'rgba(255,255,255,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{t.icon}</div>
          <div style={{ flex: 1 }}>
            <div className="caption" style={{ marginBottom: 2 }}>TIER {t.tier}</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(0,0,0,0.78)' }}>{t.t}</div>
            <div style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)' }}>{t.sub}</div>
          </div>
        </button>
      ))}
      <div className="caption" style={{ marginTop: 14, lineHeight: 1.5 }}>This appears automatically during your historical high-severity luteal window. You are also in control: tap "I'm not okay" anytime from Home.</div>
    </div>
  );

  M.lutealPred = () => (
    <div>
      <MHeader eyebrow="F34 · LUTEAL PREDICTOR" title={<>Heads up: <span  style={{ color: 'var(--eucalyptus)' }}>your luteal</span> begins soon.</>} sub="Predicted from your cycle history. Never overdue language." />
      <div className="card-warm" style={{ padding: 18, marginBottom: 14, textAlign: 'center' }}>
        <div className="data" style={{ fontSize: 44, color: 'var(--eucalyptus)', fontWeight: 500 }}>4 days</div>
        <div className="caption" style={{ marginTop: 2 }}>± 1 day · 87% confidence</div>
      </div>
      <div className="card-mint" style={{ padding: 14 }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>WHILE YOU'RE WELL</div>
        <p className="body" style={{ fontSize: 13 }}>Use this window to refresh your safety plan, schedule lighter days, and let close people know what to watch for.</p>
      </div>
    </div>
  );

  M.safetyPlan = ({ state }) => {
    // T-S08 — gate edit on phase. In luteal, edit is read-only unless explicit override.
    const { phaseForDay } = window.HQ;
    const phase = phaseForDay(state.cycleDay, state.cycleLen);
    const lutealLocked = phase === 'L' && !state.safetyPlanEditOverride;
    const [items] = useM([
      { k: 'warning', l: 'Warning signs', v: 'Snapping at partner · waking at 4am · canceling plans' },
      { k: 'cope', l: 'Things that help me cope', v: 'Walk outside · cold shower · noise-cancelling headphones' },
      { k: 'people', l: 'People I can text', v: 'Maya · Mom · Dr. Reyes' },
      { k: 'pro', l: 'Professionals', v: 'Therapist Jen — Tue/Thu · 988 Lifeline' },
      { k: 'safe', l: 'Make environment safe', v: 'Alcohol out of house · meds in lockbox' },
    ]);
    const requestOverride = () => {
      // T-S08 — log override (would be server-logged in production)
      try { console.log('[T-S08] safety plan edit override at', new Date().toISOString()); } catch {}
      // MOCK — would persist via setState in real impl
      alert('Override logged. Edits are now unlocked. (This is logged, not blocked.)');
    };
    return (
      <div>
        <MHeader eyebrow="F35 · SAFETY PLAN" title={<>Built when you were <span  style={{ color: 'var(--eucalyptus)' }}>well.</span></>} sub="Surfaces automatically before high-risk luteal days." />
        {items.map(it => (
          <div key={it.k} className="card-warm" style={{ padding: 14, marginBottom: 8 }}>
            <div className="caption" style={{ marginBottom: 4 }}>{it.l}</div>
            <div style={{ fontSize: 13, lineHeight: 1.5 }}>{it.v}</div>
          </div>
        ))}
        {lutealLocked ? (
          <>
            <button className="btn-soft" style={{ marginTop: 8, width: '100%', opacity: 0.45, cursor: 'not-allowed' }} disabled>Update plan (read-only in luteal)</button>
            <button className="btn-ghost" style={{ marginTop: 6, width: '100%', fontSize: 12 }} onClick={requestOverride}>I want to edit anyway</button>
            <div className="caption" style={{ fontSize: 11, marginTop: 8, textAlign: 'center' }}>
              Editing is read-only during your luteal phase to protect a plan you built when well.
            </div>
          </>
        ) : (
          <button className="btn-soft" style={{ marginTop: 8, width: '100%' }}>Update plan</button>
        )}
      </div>
    );
  };

  M.ssri = ({ state }) => {
    const useApp = window.HQ.useApp;
    const { setState } = useApp();
    const cfg = state.ssriConfig || null;
    const log = state.ssriLog || {};
    const [showEditor, setShowEditor] = useM(!cfg);
    const [name, setName] = useM(cfg?.name || 'Sertraline');
    const [dose, setDose] = useM(cfg?.dose || 50);
    const [pattern, setPattern] = useM(cfg?.pattern || 'luteal-phase');
    const todayKey = new Date().toISOString().slice(0, 10);
    const todayLog = log[todayKey] || {};
    const [note, setNote] = useM(todayLog.note || '');

    const SSRI_OPTIONS = ['Fluoxetine', 'Sertraline', 'Citalopram', 'Escitalopram', 'Paroxetine', 'Other'];
    const PATTERNS = [
      { v: 'continuous', l: 'Continuous (daily)' },
      { v: 'luteal-phase', l: 'Luteal-phase only (day 14 → menses)' },
      { v: 'symptom-onset', l: 'Symptom-onset' },
    ];
    const saveConfig = () => {
      setState(s => ({ ...s, ssriConfig: { name, dose: +dose || 0, pattern } }));
      setShowEditor(false);
    };
    const setTaken = (taken) => {
      setState(s => ({
        ...s,
        ssriLog: { ...(s.ssriLog || {}), [todayKey]: { ...(s.ssriLog?.[todayKey] || {}), taken, at: Date.now() } },
      }));
    };
    const persistNote = (val) => {
      setNote(val);
      setState(s => ({
        ...s,
        ssriLog: { ...(s.ssriLog || {}), [todayKey]: { ...(s.ssriLog?.[todayKey] || {}), note: val } },
      }));
    };

    // Last 7 days adherence
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (6 - i));
      const k = d.toISOString().slice(0, 10);
      const drsp = state.entries?.[k]?.drsp || {};
      const vals = Object.entries(drsp).filter(([key]) => key !== 'suicidal_ideation').map(([, v]) => +v).filter(v => v > 0);
      const drspMean = vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length) : null;
      return { k, taken: log[k]?.taken, drspMean };
    });

    return (
      <div>
        <MHeader eyebrow="F36 · SSRI LUTEAL DOSING" title={<>Your meds, <span  style={{ color: 'var(--eucalyptus)' }}>tracked against DRSP.</span></>} />

        {cfg && !showEditor ? (
          <div className="card-warm" style={{ padding: 14, marginBottom: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
              <div className="eyebrow">CURRENT</div>
              <button className="btn-ghost" style={{ fontSize: 11 }} onClick={() => setShowEditor(true)}>Edit</button>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{cfg.name} {cfg.dose} mg</div>
            <div className="caption" style={{ marginTop: 2 }}>{(PATTERNS.find(p => p.v === cfg.pattern) || {}).l || cfg.pattern}</div>
          </div>
        ) : (
          <div className="card-warm" style={{ padding: 14, marginBottom: 12 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>{cfg ? 'EDIT CONFIG' : 'SET UP YOUR SSRI'}</div>
            <label className="caption" style={{ display: 'block', marginBottom: 4 }}>SSRI</label>
            <select value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', marginBottom: 10, padding: 8, borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}>
              {SSRI_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
            <label className="caption" style={{ display: 'block', marginBottom: 4 }}>Dose (mg)</label>
            <input type="number" value={dose} onChange={e => setDose(e.target.value)} style={{ width: '100%', marginBottom: 10 }} />
            <label className="caption" style={{ display: 'block', marginBottom: 4 }}>Pattern</label>
            <select value={pattern} onChange={e => setPattern(e.target.value)} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 8, border: '1px solid var(--border)', fontSize: 13 }}>
              {PATTERNS.map(p => <option key={p.v} value={p.v}>{p.l}</option>)}
            </select>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={saveConfig}>Save</button>
              {cfg && <button className="btn-ghost" style={{ flex: 1 }} onClick={() => setShowEditor(false)}>Cancel</button>}
            </div>
          </div>
        )}

        {cfg && (
          <MSection title="TODAY'S DOSE">
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              <button
                className="btn-soft"
                style={{ flex: 1, background: todayLog.taken === true ? 'var(--eucalyptus)' : '', color: todayLog.taken === true ? '#fff' : '' }}
                onClick={() => setTaken(true)}
              >Yes — taken</button>
              <button
                className="btn-soft"
                style={{ flex: 1, background: todayLog.taken === false ? 'var(--coral)' : '', color: todayLog.taken === false ? '#fff' : '' }}
                onClick={() => setTaken(false)}
              >No — missed</button>
            </div>
            <input
              type="text"
              placeholder="Note (optional)"
              value={note}
              onChange={e => persistNote(e.target.value)}
              style={{ width: '100%' }}
            />
          </MSection>
        )}

        <MSection title="LAST 7 DAYS · ADHERENCE × DRSP">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {last7.map((d, i) => {
              const t = d.taken;
              return (
                <div key={i} style={{ textAlign: 'center' }}>
                  <div style={{ height: 30, borderRadius: 6, background: t === true ? 'var(--eucalyptus)' : t === false ? 'var(--coral)' : 'var(--mint-mist)', color: t == null ? 'var(--ink-3)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontFamily: 'var(--mono)' }}>
                    {t === true ? '✓' : t === false ? '✕' : '·'}
                  </div>
                  <div className="data" style={{ fontSize: 10, marginTop: 4 }}>{d.drspMean != null ? d.drspMean.toFixed(1) : '—'}</div>
                </div>
              );
            })}
          </div>
          <div className="caption" style={{ marginTop: 10, fontSize: 12 }}>Top row: adherence. Bottom row: that day's DRSP mean (excluding SI).</div>
        </MSection>
      </div>
    );
  };

  M.supps = () => {
    // T-72 — supplement names + dose-aware B6 toxicity warning
    const initial = [
      { n: 'Calcium', dose: 1200, unit: 'mg', d: 'Daily', e: 'Strong' },
      { n: 'Chasteberry (Vitex)', dose: 20, unit: 'mg', d: 'Daily', e: 'Moderate' },
      { n: 'Vit B6 (Pyridoxine)', dose: 100, unit: 'mg', d: 'Luteal only', e: 'Limited' },
      { n: 'Magnesium glycinate', dose: 300, unit: 'mg', d: 'Evenings', e: 'Moderate' },
      { n: 'Evening primrose oil', dose: 1000, unit: 'mg', d: 'Daily', e: 'Unsupported' },
    ];
    const [supps, setSupps] = useM(initial);
    const [warnB6, setWarnB6] = useM(null);

    const isB6 = (name) => /B6|Pyridoxine/i.test(name || '');

    const updateDose = (i, value) => {
      const next = [...supps];
      const newDose = +value || 0;
      const wasUnder = (next[i].dose || 0) <= 100;
      next[i] = { ...next[i], dose: newDose };
      setSupps(next);
      // T-72 — non-blocking inline confirmation modal when editing dose to >100 for B6
      if (isB6(next[i].n) && wasUnder && newDose > 100) {
        setWarnB6({ idx: i, dose: newDose });
      }
    };

    return (
      <div>
        <MHeader eyebrow="F37 · SUPPLEMENTS" title={<>Evidence ratings, <span  style={{ color: 'var(--eucalyptus)' }}>not vibes.</span></>} sub="Peer-reviewed strength of evidence for each." />
        {supps.map((s, i) => {
          const showWarning = isB6(s.n) && (s.dose >= 100);
          return (
            <div key={s.n} className="card-warm" style={{ padding: 14, marginBottom: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{s.n}</div>
                  <div className="caption" style={{ fontSize: 12 }}>{s.d}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 6 }}>
                    <input
                      type="number"
                      value={s.dose}
                      onChange={e => updateDose(i, e.target.value)}
                      style={{ width: 72, padding: 4, fontSize: 12 }}
                    />
                    <span className="caption" style={{ fontSize: 11 }}>{s.unit}</span>
                  </div>
                </div>
                <EvidenceBar level={s.e} />
              </div>
              {showWarning && (
                <div style={{ marginTop: 10, padding: 10, background: 'var(--coral-soft)', borderRadius: 8, fontSize: 12, color: 'var(--ink-2)', lineHeight: 1.5 }}>
                  <strong style={{ color: 'var(--severity-severe)' }}>Heads up:</strong> Doses above 100 mg/day are associated with peripheral neuropathy. Discuss your dose with your prescriber.
                </div>
              )}
            </div>
          );
        })}
        <button className="btn-soft" style={{ marginTop: 8, width: '100%' }}>+ Add supplement</button>

        {warnB6 && (
          <div className="modal-backdrop" onClick={() => setWarnB6(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="eyebrow" style={{ marginBottom: 6, color: 'var(--severity-severe)' }}>B6 DOSE NOTE</div>
              <h2 className="display-sm" style={{ marginBottom: 12 }}>You set {warnB6.dose} mg.</h2>
              <p className="body" style={{ fontSize: 14, marginBottom: 16 }}>
                Doses above 100 mg/day of B6 (pyridoxine) are associated with peripheral neuropathy. Please discuss your dose with your prescriber.
              </p>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-soft" style={{ flex: 1 }} onClick={() => setWarnB6(null)}>Got it</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  M.rage = ({ state }) => {
    const useApp = window.HQ.useApp;
    const { setState } = useApp();
    const [intensity, setIntensity] = useM(0);
    const types = ['Rage', 'Crying', 'Dissociation', 'Panic', 'Numbness'];
    const [type, setType] = useM(null);
    const [duration, setDuration] = useM('');
    const [note, setNote] = useM('');
    const [savedFlash, setSavedFlash] = useM(false);
    const episodes = state.rageEpisodes || [];
    const save = () => {
      if (!type || !intensity) return;
      const evt = { at: Date.now(), type, intensity, duration: duration || null, note: note || null };
      setState(s => ({ ...s, rageEpisodes: [evt, ...(s.rageEpisodes || [])].slice(0, 200) }));
      setIntensity(0); setType(null); setDuration(''); setNote('');
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 1500);
    };
    const fmt = (ts) => {
      const dt = new Date(ts);
      const now = new Date();
      const diff = Math.floor((now - dt) / 86400000);
      const time = dt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
      if (diff === 0) return `Today ${time}`;
      if (diff === 1) return `Yesterday ${time}`;
      return `${diff} days ago ${time}`;
    };
    const recent = episodes.slice(0, 5);
    return (
      <div>
        <MHeader eyebrow="F38 · MOOD EPISODES" title={<>One-tap <span  style={{ color: 'var(--eucalyptus)' }}>capture.</span></>} sub="No judgement. Just data for your DRSP." />
        <MSection title="WHAT'S HAPPENING">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {types.map(t => (
              <button key={t} className={`chip ${type === t ? 'active' : ''}`} onClick={() => setType(t)}>{t}</button>
            ))}
          </div>
        </MSection>
        <MSection title="INTENSITY 1–5">
          <Severity value={intensity} onChange={setIntensity} max={5} />
        </MSection>
        <MSection title="DURATION (OPTIONAL)">
          <input type="text" placeholder="e.g. 22 min" value={duration} onChange={e => setDuration(e.target.value)} style={{ width: '100%' }} />
        </MSection>
        <MSection title="WHAT TRIGGERED IT (OPTIONAL)">
          <input type="text" placeholder="e.g. Snapped over dishes" value={note} onChange={e => setNote(e.target.value)} style={{ width: '100%' }} />
        </MSection>
        <button
          className="btn-primary"
          style={{ marginBottom: 18, opacity: (!type || !intensity) ? 0.5 : 1 }}
          disabled={!type || !intensity}
          onClick={save}
        >{savedFlash ? '✓ Saved' : 'Save · 3 sec'}</button>
        <MSection title={recent.length ? "RECENT EPISODES" : "NO EPISODES YET"}>
          {recent.length === 0 && <div className="caption" style={{ fontSize: 12 }}>Saved episodes appear here for cycle-by-cycle DRSP context.</div>}
          {recent.map((r, i) => (
            <div key={i} className="card" style={{ padding: 12, marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{r.type} · {r.intensity}/5</span>
                {r.duration && <span className="caption" style={{ fontSize: 11 }}>{r.duration}</span>}
              </div>
              <div className="caption" style={{ fontSize: 12, marginBottom: 2 }}>{fmt(r.at)}</div>
              {r.note && <div style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--ink-2)' }}>"{r.note}"</div>}
            </div>
          ))}
        </MSection>
      </div>
    );
  };

  M.relImpact = () => (
    <div>
      <MHeader eyebrow="F39 · RELATIONSHIP IMPACT" title={<>Conflicts, <span  style={{ color: 'var(--eucalyptus)' }}>logged briefly.</span></>} sub="Builds the documentation for Criterion B and couples therapy." />
      {[
        { who: 'Partner', when: 'Yesterday', sev: 4, ctrl: 2, n: 'Out-of-proportion reaction · day 22' },
        { who: 'Mom', when: '5 days ago', sev: 3, ctrl: 2, n: 'Phone call escalated' },
        { who: 'Coworker', when: '8 days ago', sev: 2, ctrl: 4, n: 'Tone in slack · self-corrected' },
      ].map((r, i) => (
        <div key={i} className="card-warm" style={{ padding: 14, marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{r.who}</span>
            <span className="caption" style={{ fontSize: 11 }}>{r.when}</span>
          </div>
          <div style={{ fontSize: 12, fontStyle: 'italic', color: 'var(--ink-2)', marginBottom: 8 }}>{r.n}</div>
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="caption" style={{ fontSize: 11 }}>Severity <strong style={{ color: 'var(--severity-severe)' }}>{r.sev}/5</strong></div>
            <div className="caption" style={{ fontSize: 11 }}>Control <strong style={{ color: 'var(--severity-mild)' }}>{r.ctrl}/5</strong></div>
          </div>
        </div>
      ))}
      <button className="btn-soft" style={{ marginTop: 8, width: '100%' }}>+ Log conflict</button>
    </div>
  );

  M.workImpact = () => (
    <div>
      <MHeader eyebrow="F40 · WORK / ACADEMIC" title={<>Hours lost, <span  style={{ color: 'var(--eucalyptus)' }}>tracked honestly.</span></>} sub="For accommodations, FMLA, or disability documentation." />
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        <Stat label="This luteal" value="14 hrs" sub="Hours lost" color="var(--severity-severe)" />
        <Stat label="Last luteal" value="11 hrs" sub="Same window" />
        <Stat label="Follicular" value="0 hrs" sub="Baseline" color="var(--severity-mild)" />
      </div>
      <MSection title="THIS CYCLE">
        {[
          { d: 'Day 22', h: 4, t: 'WFH · couldn\u2019t start', q: 2 },
          { d: 'Day 21', h: 3, t: 'Skipped 1:1', q: 3 },
          { d: 'Day 20', h: 2, t: 'Late · brain fog', q: 3 },
          { d: 'Day 19', h: 5, t: 'Took sick day', q: 1 },
        ].map((d, i) => (
          <div key={i} className="card" style={{ padding: 12, marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{d.d} · {d.h} hr</span>
              <span className="data" style={{ fontSize: 11 }}>self-quality {d.q}/5</span>
            </div>
            <div className="caption" style={{ fontSize: 12, marginTop: 2 }}>{d.t}</div>
          </div>
        ))}
      </MSection>
    </div>
  );

  M.triggers = ({ state }) => {
    const useApp = window.HQ.useApp;
    const { setState } = useApp();
    const todayKey = new Date().toISOString().slice(0, 10);
    const log = state.triggerLog || {};
    const today = log[todayKey] || {};
    const setField = (k, v) => {
      setState(s => ({
        ...s,
        triggerLog: { ...(s.triggerLog || {}), [todayKey]: { ...((s.triggerLog || {})[todayKey] || {}), [k]: v } },
      }));
    };
    const meanDrsp = (entry) => {
      if (!entry || !entry.drsp) return null;
      const vals = Object.entries(entry.drsp).filter(([k]) => k !== 'suicidal_ideation').map(([, v]) => +v).filter(v => v > 0);
      return vals.length ? (vals.reduce((a, b) => a + b, 0) / vals.length) : null;
    };
    // Correlate trigger fields against next-day DRSP mean (need 30+ entries)
    const triggerEntries = Object.entries(log);
    const computeCorrelations = () => {
      const features = ['sleep', 'caffeine', 'alcohol', 'stress', 'isolation'];
      const results = [];
      features.forEach(f => {
        const pairs = [];
        triggerEntries.forEach(([dateKey, t]) => {
          if (t[f] == null || t[f] === '') return;
          const next = new Date(dateKey); next.setDate(next.getDate() + 1);
          const nextKey = next.toISOString().slice(0, 10);
          const nextDrsp = meanDrsp(state.entries?.[nextKey]);
          if (nextDrsp == null) return;
          pairs.push([+t[f], nextDrsp]);
        });
        if (pairs.length < 5) return;
        const n = pairs.length;
        const meanX = pairs.reduce((s, p) => s + p[0], 0) / n;
        const meanY = pairs.reduce((s, p) => s + p[1], 0) / n;
        const num = pairs.reduce((s, p) => s + (p[0] - meanX) * (p[1] - meanY), 0);
        const denomX = Math.sqrt(pairs.reduce((s, p) => s + Math.pow(p[0] - meanX, 2), 0));
        const denomY = Math.sqrt(pairs.reduce((s, p) => s + Math.pow(p[1] - meanY, 2), 0));
        const r = (denomX && denomY) ? (num / (denomX * denomY)) : 0;
        results.push({ feature: f, r, n });
      });
      // Exercise as categorical
      const exerciseImpact = (() => {
        const groups = {};
        triggerEntries.forEach(([dateKey, t]) => {
          if (!t.exercise) return;
          const next = new Date(dateKey); next.setDate(next.getDate() + 1);
          const nextDrsp = meanDrsp(state.entries?.[next.toISOString().slice(0, 10)]);
          if (nextDrsp == null) return;
          (groups[t.exercise] ||= []).push(nextDrsp);
        });
        const means = Object.entries(groups).map(([k, arr]) => ({ k, m: arr.reduce((a, b) => a + b, 0) / arr.length, n: arr.length }));
        if (means.length < 2) return null;
        means.sort((a, b) => a.m - b.m);
        return means;
      })();
      results.sort((a, b) => Math.abs(b.r) - Math.abs(a.r));
      return { features: results.slice(0, 3), exercise: exerciseImpact };
    };
    const enough = triggerEntries.length >= 30;
    const corr = enough ? computeCorrelations() : null;
    const labelMap = {
      sleep: 'Sleep hours', caffeine: 'Caffeine cups', alcohol: 'Alcohol drinks',
      stress: 'Stress level', isolation: 'Social isolation',
    };
    const exerciseOpts = ['None', 'Light', 'Moderate', 'Intense'];
    return (
      <div>
        <MHeader eyebrow="F41 · TRIGGER CORRELATION" title={<>Your <span  style={{ color: 'var(--eucalyptus)' }}>specific</span> triggers.</>} sub="Daily inputs correlated against your next-day DRSP." />
        <MSection title="LOG TODAY'S TRIGGERS">
          <div className="card-warm" style={{ padding: 14 }}>
            <div style={{ marginBottom: 10 }}>
              <div className="caption" style={{ marginBottom: 4 }}>Sleep hours</div>
              <input type="number" step="0.5" min="0" max="14" value={today.sleep || ''} onChange={e => setField('sleep', e.target.value === '' ? '' : +e.target.value)} placeholder="e.g. 7" style={{ width: '100%' }} />
            </div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <div style={{ flex: 1 }}>
                <div className="caption" style={{ marginBottom: 4 }}>Caffeine cups</div>
                <input type="number" min="0" max="12" value={today.caffeine || ''} onChange={e => setField('caffeine', e.target.value === '' ? '' : +e.target.value)} style={{ width: '100%' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div className="caption" style={{ marginBottom: 4 }}>Alcohol drinks</div>
                <input type="number" min="0" max="12" value={today.alcohol || ''} onChange={e => setField('alcohol', e.target.value === '' ? '' : +e.target.value)} style={{ width: '100%' }} />
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <div className="caption" style={{ marginBottom: 4 }}>Exercise</div>
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {exerciseOpts.map(o => (
                  <button key={o} className={`chip ${today.exercise === o ? 'active' : ''}`} onClick={() => setField('exercise', o)}>{o}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 10 }}>
              <div className="caption" style={{ marginBottom: 6 }}>Stress (1–5)</div>
              <Severity value={today.stress || 0} onChange={v => setField('stress', v)} max={5} />
            </div>
            <div>
              <div className="caption" style={{ marginBottom: 6 }}>Social isolation (1–5)</div>
              <Severity value={today.isolation || 0} onChange={v => setField('isolation', v)} max={5} />
            </div>
          </div>
        </MSection>
        <MSection title={enough ? 'CORRELATIONS · NEXT-DAY DRSP' : `LOGGED ${triggerEntries.length}/30 DAYS`}>
          {!enough ? (
            <div className="card-warm" style={{ padding: 14 }}>
              <p className="body" style={{ fontSize: 13, marginBottom: 4 }}>
                Tracking 30+ days unlocks correlations.
              </p>
              <div className="caption" style={{ fontSize: 12 }}>You're at {triggerEntries.length}/30.</div>
            </div>
          ) : (
            <>
              {corr.features.length === 0 && (
                <div className="caption" style={{ fontSize: 12, padding: 10 }}>Not enough next-day DRSP overlap yet — keep logging.</div>
              )}
              {corr.features.map(t => {
                const pct = Math.min(100, Math.abs(t.r) * 100);
                const dir = t.r > 0 ? '+' : '−';
                return (
                  <div key={t.feature} className="card" style={{ padding: 12, marginBottom: 6 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{labelMap[t.feature]}</span>
                      <span className="data" style={{ fontSize: 12, color: t.r > 0 ? 'var(--severity-severe)' : 'var(--severity-mild)' }}>{dir} r={Math.abs(t.r).toFixed(2)} · n={t.n}</span>
                    </div>
                    <div style={{ height: 4, background: 'var(--mint-mist)', borderRadius: 999, marginBottom: 6 }}>
                      <div style={{ width: pct + '%', height: '100%', background: t.r > 0 ? 'var(--coral)' : 'var(--eucalyptus)', borderRadius: 999 }} />
                    </div>
                    <div className="caption" style={{ fontSize: 11 }}>
                      {t.r > 0 ? 'Higher values associate with higher next-day DRSP.' : 'Higher values associate with lower next-day DRSP.'}
                    </div>
                  </div>
                );
              })}
              {corr.exercise && (
                <div className="card" style={{ padding: 12, marginBottom: 6 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>Exercise level vs next-day DRSP</div>
                  {corr.exercise.map(g => (
                    <div key={g.k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0' }}>
                      <span>{g.k} (n={g.n})</span>
                      <span className="data">{g.m.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </MSection>
      </div>
    );
  };

  M.community = ({ state }) => {
    // T-25 — Luteal Wall opt-in panel
    const wallOn = !!(state.featureFlags && state.featureFlags.lutealWall);
    const sampleMessages = [
      'Day 23 here. Brain fog is unreal. Just wanted to say I exist.',
      'Tried logging at 2am because I couldn\'t sleep. Glad someone is awake.',
      'It\'s not just me, right?',
    ];
    const toggleWall = () => {
      // MOCK — would setState in real impl
      alert('Luteal Wall toggled. (In a real build this would persist; for the prototype, toggle in Tweaks panel.)');
    };
    return (
      <div>
        <MHeader eyebrow="F42 · PHASE-MATCHED COMMUNITY" title={<>You're <span  style={{ color: 'var(--eucalyptus)' }}>not alone</span> in this phase.</>} sub="Anonymous. No profiles. No feed. Just numbers." />
        <div className="card-mint" style={{ padding: 18, marginBottom: 14, textAlign: 'center' }}>
          <div className="data" style={{ fontSize: 36, color: 'var(--eucalyptus-deep)', fontWeight: 500 }}>2,847</div>
          <div className="caption" style={{ marginTop: 4 }}>others on day 19–22 of their cycle right now</div>
        </div>
        {[
          { l: 'Logged irritability ≥ 4 today', v: '64%' },
          { l: 'Reported sleep disturbance', v: '71%' },
          { l: 'Logged a mood episode this week', v: '58%' },
          { l: 'Currently on an SSRI', v: '34%' },
        ].map(r => (
          <div key={r.l} className="card" style={{ padding: 12, marginBottom: 6, display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13 }}>{r.l}</span>
            <span className="data" style={{ fontSize: 13, fontWeight: 500, color: 'var(--eucalyptus)' }}>{r.v}</span>
          </div>
        ))}
        <div className="caption" style={{ marginTop: 14, fontSize: 11 }}>Aggregated &gt; 100 users · no individual data shared.</div>

        {/* T-25 — Luteal Wall opt-in panel */}
        <div className="card-warm" style={{ marginTop: 18, padding: 14, borderLeft: '3px solid var(--coral)' }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>LUTEAL WALL · OPT-IN</div>
          {!wallOn ? (
            <>
              <p className="body" style={{ fontSize: 13, marginBottom: 10 }}>
                This is opt-in; default off.
              </p>
              <button className="btn-soft" onClick={toggleWall}>Turn on Luteal Wall</button>
            </>
          ) : (
            <>
              <p className="caption" style={{ fontSize: 11, marginBottom: 10 }}>Anonymous · max 100 chars · 24h auto-purge</p>
              {sampleMessages.map((m, i) => (
                <div key={i} className="card" style={{ padding: 10, marginBottom: 6, fontSize: 13, fontStyle: 'italic', color: 'var(--ink-2)' }}>
                  "{m}"
                </div>
              ))}
              <button className="btn-soft" disabled style={{ marginTop: 8, width: '100%', opacity: 0.55, cursor: 'not-allowed' }}>
                Post a message
              </button>
              <div className="caption" style={{ fontSize: 11, marginTop: 6, textAlign: 'center' }}>
                Anonymous posting opens at v1 launch
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  Object.assign(window.HQ_MODULES = window.HQ_MODULES || {}, M);
})();
