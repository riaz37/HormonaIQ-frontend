function OraScreen() {
  const { useApp, DRSPChart, Icon, Leaf, Blob, OraFeedback } = window.HQ;
  const { state, setState } = useApp();
  const [oraOn, setOraOn] = React.useState(true);
  const [showTransparency, setShowTransparency] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [showPrep, setShowPrep] = React.useState(false);

  // T-91 — Passive mode: suspend prompts/outreach for 24h.
  // Auto-trigger in late luteal (within 2 days of predicted peak).
  const cycleDay = state.cycleDay;
  const cycleLen = state.cycleLen;
  const lutealPeakStart = Math.round(cycleLen * 0.78);
  const inLutealPeak = cycleDay >= lutealPeakStart - 2 && cycleDay <= cycleLen - 5;
  const passiveActiveByTime = state.passiveModeUntil && Date.now() < state.passiveModeUntil;
  const passiveAuto = inLutealPeak && state.passiveAutoOverride !== true;
  const passive = !!state.passiveMode || passiveActiveByTime || passiveAuto;

  // T-78 — Ora transparency block visible by default in first session
  const [firstSessionTransparency, setFirstSessionTransparency] = React.useState(() => {
    try { return !localStorage.getItem('oraTransparencyShown'); } catch { return true; }
  });
  const dismissFirstSession = () => {
    try { localStorage.setItem('oraTransparencyShown', '1'); } catch {}
    setFirstSessionTransparency(false);
    setState(s => ({ ...s, oraTransparencyShown: true }));
  };

  // T-12 — voice/text food logging surface
  const foodInputRef = React.useRef(null);
  const [foodText, setFoodText] = React.useState('');
  const [foodResponse, setFoodResponse] = React.useState(null);
  const [recording, setRecording] = React.useState(false);

  React.useEffect(() => {
    if (window.__oraFocus === 'food' && foodInputRef.current) {
      foodInputRef.current.focus();
      window.__oraFocus = null;
    }
  }, []);

  const submitFood = (text) => {
    if (!text || !text.trim()) return;
    const t = text.toLowerCase();
    let resp;
    if (/(rice|bread|pasta|noodle|pizza|cereal)/.test(t)) {
      resp = 'I noticed *' + text.split(/[,.]/)[0].trim() + '* — solid carbs. Pairing with protein and fiber typically softens the glycemic curve in your luteal phase. Notable items: none flagged.';
    } else if (/(chocolate|candy|cake|cookie|donut|sugar|ice cream)/.test(t)) {
      resp = 'I noticed *' + text.split(/[,.]/)[0].trim() + '* — sweet treats are part of life. Heads up that sugar pairings can amplify late-luteal mood drops; balancing with protein helps. Notable items: none flagged.';
    } else if (/(salad|veg|broccoli|spinach|kale|chicken|salmon|fish|tofu|egg)/.test(t)) {
      resp = 'I noticed *salmon* and *roasted veg* — that\'s solid protein and fiber. Likely a steady-glycemic meal for your luteal phase. Notable items: none flagged.';
    } else {
      resp = 'I noticed *' + text.split(/[,.]/)[0].trim() + '* — logged. Steady protein + fiber tends to help in your current phase. Notable items: none flagged.';
    }
    setFoodResponse(resp);
    setState(s => ({ ...s, voiceFoodEntries: [...(s.voiceFoodEntries || []), { text, ts: Date.now() }] }));
  };

  const startRecord = () => {
    setRecording(true);
    setTimeout(() => {
      setRecording(false);
      const mockText = foodText || 'salmon and roasted veg';
      setFoodText(mockText);
      submitFood(mockText);
    }, 3000); // MOCK — no real audio backend
  };

  const data = React.useMemo(() => {
    const arr = [];
    for (let d = 1; d <= 28; d++) {
      let s;
      if (d <= 5) s = 4 + (d % 2);
      else if (d <= 12) s = 1 + (d % 2);
      else if (d <= 18) s = 2 + (d % 2);
      else s = Math.min(6, 3 + Math.floor((d - 18) / 2));
      arr.push({ day: d, score: s });
    }
    return arr;
  }, []);

  // T-14 — pattern engine state by logged-day count
  const loggedDays = Object.keys(state.entries || {}).length;
  const patternState = loggedDays < 7 ? 'empty' : loggedDays < 35 ? 'early' : 'confirmed';

  const edSafe = state.ed_safe_mode === 'yes';

  return (
    <div className="screen" style={{ position: 'relative' }}>
      {/* T-58 — leaf + blob decorations */}
      <Leaf size={120} color="var(--mint-mist)" style={{ top: -18, right: -32, opacity: 0.28 }} rotate={12} />
      <Blob size={220} color="var(--butter)" style={{ bottom: 90, left: -110, opacity: 0.18 }} animate />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 22, paddingBottom: 18, borderBottom: '1px solid var(--border)' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Clinical intelligence</div>
          <h1 className="display-sm">
            <span className="italic-display" style={{ color: 'var(--eucalyptus)' }}>Ora</span> · {oraOn ? 'On' : 'Off'}
          </h1>
        </div>
        <div className={`switch ${oraOn ? 'on' : ''}`} onClick={() => setOraOn(!oraOn)} style={{ flexShrink: 0 }} />
      </div>

      {!oraOn ? (
        <div className="card-warm">
          <p className="body">Ora is paused. Your logs continue. Resume any time.</p>
        </div>
      ) : (
      <>
        {/* T-78 — first-session transparency block (visible by default until dismissed) */}
        {firstSessionTransparency && (
          <div className="ora-card" style={{ marginBottom: 18, position: 'relative' }}>
            <div className="ora-label">
              <span className="italic-display" style={{ fontSize: 14, marginRight: 4, textTransform: 'none', letterSpacing: 0, color: 'var(--eucalyptus)' }}>O</span>
              ORA · WHAT I SEE
            </div>
            <div className="ora-body" style={{ fontSize: 13 }}>
              <div style={{ marginBottom: 6 }}><strong>What I use:</strong> your DRSP scores and cycle dates from the last 90 days.</div>
              <div><strong>What I don't see:</strong> your name, email, location.</div>
            </div>
            <button
              onClick={dismissFirstSession}
              className="btn-soft"
              style={{ marginTop: 12, fontSize: 12, padding: '6px 12px' }}
            >
              Got it
            </button>
          </div>
        )}

        {/* T-12 — Tell Ora what you ate (or ED-safe replacement) */}
        {edSafe ? (
          <div className="card-warm" style={{ marginBottom: 20, padding: 14 }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>FOOD LOGGING</div>
            <p className="body" style={{ fontSize: 13, color: 'var(--ink-2)' }}>
              Voice diet logging is hidden because you opted out at onboarding. Turn on in Profile → My data.
            </p>
          </div>
        ) : (
          <div className="card-warm" style={{ marginBottom: 20, padding: 14 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>TELL ORA WHAT YOU ATE</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                ref={foodInputRef}
                type="text"
                placeholder="Salmon, roasted veg, half avocado…"
                value={foodText}
                onChange={e => setFoodText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') submitFood(foodText); }}
                style={{ flex: 1 }}
              />
              <button
                onClick={recording ? null : startRecord}
                aria-label="Record voice"
                style={{
                  width: 44, height: 44, borderRadius: '50%',
                  background: recording ? 'var(--coral)' : 'var(--eucalyptus)',
                  color: '#fff', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}
                className={recording ? 'breathe' : ''}
              >
                {recording ? '●' : '🎙'}
              </button>
              <button className="btn-soft" style={{ height: 44, paddingInline: 14 }} onClick={() => submitFood(foodText)}>Send</button>
            </div>
            {recording && <div className="caption" style={{ marginTop: 8 }}>Listening… (3 sec mock)</div>}
            {foodResponse && (
              <div className="ora-card" style={{ marginTop: 12 }}>
                <div className="ora-label">ORA · FOOD CONTEXT</div>
                <div className="ora-body">{foodResponse}</div>
              </div>
            )}
            <div className="caption" style={{ marginTop: 8, fontSize: 11 }}>
              No calories, no macros, no scores. Just context.
            </div>
          </div>
        )}

        <button className="btn-soft" style={{ marginBottom: 22, width: '100%' }} onClick={() => setShowPrep(true)}>
          <Icon.Sparkle width="16" height="16" /> Prepare for my appointment
        </button>

        <div className="chart-wrap" style={{ marginBottom: 16, position: 'relative' }}>
          <DRSPChart data={data} cycleLen={28} height={180} />
        </div>

        {/* T-14 — pattern engine empty/early/confirmed states */}
        {patternState === 'empty' ? (
          <div className="ora-card" style={{ marginBottom: 16 }}>
            <div className="ora-label">
              <span className="italic-display" style={{ fontSize: 14, marginRight: 4, textTransform: 'none', letterSpacing: 0, color: 'var(--eucalyptus)' }}>O</span>
              ORA
            </div>
            <div className="ora-body">
              I haven't seen enough of your cycle yet to say anything useful — about 2 weeks in, I'll start noticing things, and by your second luteal I'll have a real pattern to show you. Until then I'm here if you want to talk.
            </div>
            {OraFeedback && <OraFeedback insightId="ora-pattern-empty" />}
          </div>
        ) : patternState === 'early' ? (
          <div className="ora-card" style={{ marginBottom: 16 }}>
            <div className="ora-label">
              <span className="italic-display" style={{ fontSize: 14, marginRight: 4, textTransform: 'none', letterSpacing: 0, color: 'var(--eucalyptus)' }}>O</span>
              ORA · EARLY READ
            </div>
            <div className="ora-body">
              One cycle in. I'm seeing what looks like a luteal-phase shift around day 22, but I want one more cycle before I trust it. Hold tight.
            </div>
            {OraFeedback && <OraFeedback insightId="ora-pattern-early" />}
          </div>
        ) : loading ? (
          <div className="ora-card">
            <div className="caption">Ora is reading your data…</div>
            <div style={{ marginTop: 8, height: 3, borderRadius: 999, background: 'var(--border)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '60%', background: 'linear-gradient(90deg, var(--eucalyptus), var(--sage))', borderRadius: 999, animation: 'shimmer 1.4s linear infinite', backgroundSize: '200% 100%' }} />
            </div>
          </div>
        ) : (
          <div className="ora-card" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="ora-label">
                <span className="italic-display" style={{ fontSize: 14, marginRight: 4, textTransform: 'none', letterSpacing: 0, color: 'var(--eucalyptus)' }}>O</span>
                ORA
              </div>
              <button onClick={() => setShowTransparency(!showTransparency)} style={{ opacity: 0.6, color: 'var(--eucalyptus)' }}>
                <Icon.Info width="16" height="16" />
              </button>
            </div>
            <div className="ora-body">
              I've been watching your DRSP for three cycles now. Your luteal weeks come in at 4.8/6 on average; your follicular weeks at 1.5. That's a 3.2× swing — consistent with the prospective pattern DSM-5 evaluation calls for. Bring it to your clinician.
            </div>
            {/* T-41 — observation, not diagnosis */}
            <div className="caption" style={{ fontSize: 11, marginTop: 8, color: 'var(--ink-3)' }}>
              These patterns are observations from your logs. They are not a diagnosis. Bring them to your clinician.
            </div>
            {showTransparency && (
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px solid rgba(63,111,90,0.18)', fontFamily: 'var(--sans)', fontSize: 12, lineHeight: 1.6, color: 'var(--ink-2)' }}>
                <div style={{ marginBottom: 6 }}><strong style={{ color: 'var(--ink)' }}>Used:</strong> your DRSP scores from Jan 28 – Apr 24, your cycle phase data.</div>
                <div><strong style={{ color: 'var(--ink)' }}>Not used:</strong> your name, email, or location.</div>
              </div>
            )}
            {OraFeedback && <OraFeedback insightId="ora-pattern-confirmed" />}
          </div>
        )}

        {/* T-91 — passive mode hides prompt chips. Show a one-line note + escape hatch. */}
        {passive ? (
          <div className="caption" style={{ marginTop: 8, fontSize: 12, color: 'var(--ink-3)', textAlign: 'center', padding: '6px 12px' }}>
            Quiet view today — just the chart, no nudges.{' '}
            {passiveAuto && (
              <button
                onClick={() => setState(s => ({ ...s, passiveAutoOverride: true, passiveMode: false, passiveModeUntil: null }))}
                style={{ background: 'none', border: 'none', padding: 0, color: 'var(--eucalyptus)', textDecoration: 'underline', cursor: 'pointer', fontSize: 12 }}
              >Show prompts</button>
            )}
          </div>
        ) : (
          <div className="scroll-x" style={{ marginTop: 8 }}>
            {['What does this pattern mean?', 'Is my ADHD med working differently by phase?', 'Draft what to say to my doctor', 'If they say "it’s just PMS"'].map(p => (
              <button key={p} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 1400); }}
                className="chip"
                style={{ flex: '0 0 auto', whiteSpace: 'nowrap' }}>
                {p}
              </button>
            ))}
          </div>
        )}
      </>
      )}

      {showPrep && (
        <div className="modal-backdrop" onClick={() => setShowPrep(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxHeight: '85vh', overflowY: 'auto' }}>
            <div className="eyebrow" style={{ marginBottom: 6 }}>APPOINTMENT PREP</div>
            <h2 className="display-sm" style={{ marginBottom: 18 }}>For your visit on <em className="italic-display" style={{ color: 'var(--eucalyptus)' }}>May 8</em></h2>

            {[
              { title: 'CLINICAL SUMMARY', body: 'Patient presents with prospectively tracked DRSP scores over 3 cycles. Luteal mean 4.8/6, follicular 1.5/6. Differential ratio 3.2x. Pattern stable.' },
              { title: 'LANGUAGE TO USE', body: '"I\'ve been tracking my symptoms prospectively using a DRSP-based tool. Here is what the data shows."' },
              { title: 'IF "THIS IS JUST PMS"', body: 'PMS does not produce these severity scores over consecutive cycles. The DRSP differential ratio I\'m showing is consistent with the prospective pattern DSM-5 evaluation calls for.' },
              { title: 'ASK ABOUT', body: 'Given this pattern, would you consider an SSRI trial during the luteal phase, or referral to reproductive psychiatry?' },
            ].map(c => (
              <div key={c.title} className="ora-card" style={{ marginBottom: 12 }}>
                <div className="ora-label">{c.title}</div>
                <div className="ora-body">{c.body}</div>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
              <button className="btn-soft" style={{ flex: 1 }}>Copy</button>
              <button className="btn-soft" style={{ flex: 1 }}>Send to email</button>
            </div>
            <button className="btn-outline" style={{ marginTop: 12, width: '100%' }} onClick={() => setShowPrep(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

window.OraScreen = OraScreen;
