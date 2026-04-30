// HomeScreen — Wave 1: anti-anchoring (T-02), luteal Support link (T-07), endometrial 75/90 (T-09)
// Wave 2: T-S08 Safety Plan auto-surface, T-11 caption, T-14 pattern states, T-15 variable phase,
// T-16 brain fog auto-suggest, T-21 Log episode tile, T-24 community pulse, T-fix-3 med gate.

// daysSinceLastPeriod helper (T-09)
function daysSinceLastPeriod(lastPeriod) {
  if (!lastPeriod) return 0;
  const start = new Date(lastPeriod);
  const today = new Date();
  return Math.floor((today - start) / 86400000);
}

// T-fix-3 — return true when state.medications include any class that affects bleeding/withdrawal patterns
function suppressEndoForMeds(state) {
  const meds = state.medications || [];
  if (!meds.length) return false;
  const re = /(progestogen|progesterone|ocp|coc|combined oral|iud|mirena|provera|levonorgestrel|drospirenone|norethindrone|medroxyprogesterone)/i;
  return meds.some(m => m && (re.test(m.name || '') || re.test(m.class || '')));
}

function HomeScreen() {
  const { useApp, nextDays, ProgressBar, PHASE_COLORS, PHASE_NAMES, PHASE_VIBES, CycleRing, Icon, Leaf, Blob, phaseForDay, PhaseLegend, OraFeedback, PhaseIconFor } = window.HQ;
  const HQ_CRISIS = window.HQ_CRISIS;
  const { state, setState, goto } = useApp();

  // T-85 — paused cycle: replace phase content with paused notice
  if (state.cyclePaused) {
    return (
      <div className="screen" style={{ position: 'relative' }}>
        <h1 className="display" style={{ marginBottom: 18 }}>Welcome back.</h1>
        <div className="card-warm" style={{ padding: 22, marginBottom: 18 }}>
          <div className="eyebrow" style={{ marginBottom: 8 }}>CYCLE TRACKING PAUSED</div>
          <p className="body" style={{ marginBottom: 12 }}>
            Cycle tracking is paused. Tap Profile to resume.
          </p>
          <button className="btn-soft" onClick={() => goto('profile')}>Open Profile</button>
        </div>
        {state.generalOnly && (
          <button className="btn-primary" onClick={() => goto('log')} style={{ height: 56, fontSize: 15 }}>
            <window.HQ.Icon.Plus width="20" height="20" /> Log general health
          </button>
        )}
      </div>
    );
  }

  const cycleDay = state.cycleDay;
  const cycleLen = state.cycleLen;
  const irregular = !!(state.irregular || (state.conditions || []).includes('PCOS'));
  const days = nextDays(cycleDay, cycleLen, 7);
  const phase = irregular ? '?' : days[0].phase;
  const symptom = (state.symptoms?.[0] || 'mood shifts').toLowerCase();

  const todayKey = new Date().toISOString().slice(0, 10);
  // T-02 — gate history-anchored surfaces on today's log existing
  const loggedToday = !!(state.entries && state.entries[todayKey]);

  // T-07 — Tier-2 sheet trigger from luteal support link
  const [showTier2, setShowTier2] = React.useState(false);
  // T-21 — rage / mood episode module sheet
  const [showEpisode, setShowEpisode] = React.useState(false);

  // T-09 — endometrial trigger
  const hasPCOS = (state.conditions || []).includes('PCOS');
  const daysSince = daysSinceLastPeriod(state.lastPeriod);
  // Find the active "period start" key for acknowledgement
  const periodKey = state.lastPeriod || 'unknown';
  const ackKey = `endometrialAcknowledged_${periodKey}`;
  const acknowledged = !!(state[ackKey]);

  const medSuppress = suppressEndoForMeds(state); // T-fix-3
  const showEndo75 = hasPCOS && !medSuppress && daysSince >= 75 && daysSince < 90 && !acknowledged;
  const showEndo90 = hasPCOS && !medSuppress && daysSince >= 90 && !acknowledged;

  const acknowledgeEndo = () => {
    setState(s => ({ ...s, [ackKey]: Date.now() }));
  };

  // Period start tracking — surfaces a "My period started today" affordance during late luteal,
  // menstrual phase, or extended amenorrhea. Updates state.lastPeriod and seeds state.periodLog.
  const todayKeyForPeriod = new Date().toISOString().slice(0, 10);
  const periodLog = state.periodLog || {};
  const periodLoggedToday = !!periodLog[todayKeyForPeriod];
  // Show prompt when: late luteal (phase Ls or last 3 days of cycle), menstrual phase but no flow logged,
  // OR irregular/PCOS user past day 28 with no period in 30+ days
  const showPeriodStartPrompt = !periodLoggedToday && (
    (phase === 'Ls') ||
    (phase === 'L' && cycleDay >= cycleLen - 3) ||
    (phase === 'M' && cycleDay <= 2) ||
    (irregular && daysSince >= 28 && daysSince < 75)
  );
  const markPeriodStarted = (flow = null) => {
    const today = new Date().toISOString().slice(0, 10);
    setState(s => ({
      ...s,
      lastPeriod: today,
      periodLog: { ...(s.periodLog || {}), [today]: { flow, started: true, at: Date.now() } },
    }));
  };

  // T-S08 — Safety Plan auto-surface when within 2-3 days of predicted luteal peak
  const lutealPeakStart = Math.round(cycleLen * 0.78);
  const daysToPeak = lutealPeakStart - cycleDay;
  const showSafetyAutoCard = daysToPeak >= 2 && daysToPeak <= 3 && (state.conditions || []).includes('PMDD');

  // T-16 — auto-suggest Brain Fog Mode (one-time) when in luteal AND within 2 days of peak
  const showBfSuggest = phase === 'L' && Math.abs(daysToPeak) <= 2 && !state.brainFogMode && !state.brainFogSuggested;

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  })();

  // T-43 — phase-aware Ora greeting variants (first person, Ora-attributed)
  // Detect early vs late luteal for the Lm/Ls split
  const lutealStart = Math.round(cycleLen * 0.55) + 1;
  const lutealMid = Math.round((lutealStart + cycleLen) / 2);
  const isLateLuteal = phase === 'L' && cycleDay >= lutealMid;
  const isEarlyLuteal = phase === 'L' && cycleDay < lutealMid;
  const phaseGreeting = (() => {
    if (phase === 'M' && cycleDay === 1) return 'There it is. End of the hard stretch.';
    if (phase === 'M') return 'Your body just did a lot. Rest counts.';
    if (phase === 'F') return 'Higher-capacity window for a lot of people. What do you want to use it for?';
    if (phase === 'O') return 'Ovulatory window. Match what your body is doing if you can.';
    if (isEarlyLuteal) return 'Heading into the harder stretch. I\'ll keep things light here today.';
    if (isLateLuteal) return 'Hardest stretch of your cycle. I\'ll keep things light here today.';
    return null;
  })();
  // T-34 — veteran mode tightens the explainer line; veterans see the core sentence only
  const veteranMode = !!state.veteranMode;
  const phaseGuidance = veteranMode ? {
    F: { tone: 'Energy rising.', emoji: '🌱' },
    O: { tone: 'Ovulatory window.', emoji: '☀️' },
    L: { tone: 'Late luteal.', emoji: '🍂' },
    M: { tone: 'Menstrual.', emoji: '🌙' },
    '?': { tone: 'Variable cycle.', emoji: '🍃' },
  } : {
    F: { tone: 'Energy is usually rising here. Plan with it, not against it.', emoji: '🌱' },
    O: { tone: 'Energy is often higher here. Or it isn\'t. Either is fine.', emoji: '☀️' },
    L: { tone: 'Late luteal stretch. Less is enough.', emoji: '🍂' },
    M: { tone: 'The hard part is lifting. Rest counts.', emoji: '🌙' },
    '?': { tone: 'Your cycle runs on its own clock. We meet it where it is.', emoji: '🍃' },
  };

  // T-06 — Tier 1 inline card if any DRSP ≥ 4 today (post-log only)
  const tier = HQ_CRISIS ? HQ_CRISIS.assessCrisisTier(state.entries || {}) : 'none';

  // T-14 — pattern engine state by logged-day count
  const loggedDays = Object.keys(state.entries || {}).length;
  const patternState = loggedDays < 7 ? 'empty' : loggedDays < 35 ? 'early' : 'confirmed';

  // T-24 — community pulse line (deterministic by phase)
  const communityCount = ({ F: 4213, O: 1847, L: 2896, M: 1432 })[phase] || 2200;

  // Phase chip copy (T-15)
  const phaseChipText = irregular ? 'Phase: variable' : `${PHASE_NAMES[phase]} phase`;

  return (
    <div className="screen" style={{ position: 'relative' }}>
      <Leaf size={120} color="var(--mint-mist)" style={{ top: -20, right: -40, opacity: 0.4 }} rotate={-20} />
      {/* T-48 — drift blob in background */}
      <Blob size={240} color="var(--butter)" style={{ top: 80, right: -130, opacity: 0.22 }} animate />

      {/* Greeting */}
      <div className="fade-up" style={{ marginBottom: 20, position: 'relative' }}>
        <div className="caption" style={{ marginBottom: 4 }}>{greeting}, you</div>
        <h1 className="display">
          <em className="italic-display" style={{ color: 'var(--eucalyptus)' }}>{PHASE_VIBES[phase]?.word || 'Today'}</em>{irregular ? '' : ` · Day ${cycleDay}`}
        </h1>
      </div>

      {/* R7 — F88 AUB safety card (highest priority, surfaces above everything else) */}
      {(() => {
        const aubFinding = HQ_CRISIS && HQ_CRISIS.assessAUBRule ? HQ_CRISIS.assessAUBRule(state) : null;
        if (!aubFinding) return null;
        return (
          <div className="card-warm fade-up" style={{ padding: 16, marginBottom: 14, borderLeft: '3px solid var(--coral)', background: 'linear-gradient(135deg, var(--paper), rgba(232,159,134,0.10))' }}>
            <div className="eyebrow" style={{ color: 'var(--coral)', marginBottom: 6 }}>F88 · BLEEDING WORTH DISCUSSING</div>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 6 }}>{aubFinding.title}</div>
            <div className="body" style={{ fontSize: 13, marginBottom: 12, color: 'var(--ink-2)' }}>{aubFinding.body}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {aubFinding.actions.map(a => (
                <button key={a.id} className={a.resolves ? 'btn-soft' : 'btn-primary'} style={{ width: '100%' }}
                  onClick={() => {
                    if (a.resolves) {
                      // Mark all spotting entries as discharged with doctor
                      setState(s => ({
                        ...s,
                        spottingLog: Object.fromEntries(Object.entries(s.spottingLog || {}).map(([k, v]) => [k, { ...v, dischargedWithDoctor: true }])),
                        aubAcknowledged: new Date().toISOString(),
                      }));
                    } else {
                      // Acknowledge the booking intent without resolving
                      setState(s => ({ ...s, aubAcknowledged: new Date().toISOString() }));
                    }
                  }}>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        );
      })()}

      {/* R7 — F134 ADHD cycle correlation engine progress card (only for ADHD users approaching the 60-day unlock) */}
      {(() => {
        const isAdhd = state.adhd === 'Yes' || (state.conditions || []).includes('ADHD overlap');
        if (!isAdhd) return null;
        const days = Object.keys(state.adhdDailyLog || {}).length;
        if (days >= 60) {
          return (
            <div className="card-mint fade-up" style={{ padding: 14, marginBottom: 14, borderLeft: '3px solid var(--eucalyptus)' }}>
              <div className="eyebrow" style={{ color: 'var(--eucalyptus)', marginBottom: 4 }}>F134 · UNLOCKED</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Your hormonal-ADHD pattern is ready.</div>
              <div className="caption" style={{ fontSize: 12 }}>{days} days logged. Open Tools → ADHD → Hormonal-ADHD engine.</div>
            </div>
          );
        }
        if (days < 7) return null;
        return (
          <div className="card-warm fade-up" style={{ padding: 14, marginBottom: 14 }}>
            <div className="eyebrow" style={{ marginBottom: 4 }}>F134 · LEARNING YOUR PATTERN</div>
            <div style={{ fontSize: 13, marginBottom: 8 }}>{days}/60 days · the cycle × ADHD pattern unlocks at 60.</div>
            <div style={{ height: 6, background: 'var(--mint-mist)', borderRadius: 999, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: Math.min(100, Math.round((days / 60) * 100)) + '%', background: 'linear-gradient(90deg, var(--sage), var(--eucalyptus))', borderRadius: 999, transition: 'width 0.6s' }} />
            </div>
          </div>
        );
      })()}

      {/* R7 polish — Staggered monthly clinical instrument reminders (P0-3) */}
      {(() => {
        const useStagger = window.HQ && window.HQ.useStaggeredReminders;
        const due = useStagger ? useStagger(state) : [];
        if (!due.length) return null;
        return (
          <div className="card-warm fade-up" style={{ padding: 14, marginBottom: 14 }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>DUE THIS WEEK · {due.length} INSTRUMENT{due.length === 1 ? '' : 'S'}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {due.slice(0, 3).map(d => (
                <button key={d.id} className="card" style={{ padding: 10, textAlign: 'left', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', background: 'var(--paper)', border: '1px solid var(--border)' }}
                  onClick={() => goto('tools')}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{d.label}</div>
                    <div className="caption" style={{ fontSize: 11 }}>~{d.minutes} min · open in Tools</div>
                  </div>
                  <span style={{ color: 'var(--ink-3)' }}>→</span>
                </button>
              ))}
              {due.length > 3 && (
                <div className="caption" style={{ fontSize: 11, marginTop: 4 }}>+{due.length - 3} more in Tools</div>
              )}
            </div>
          </div>
        );
      })()}

      {/* R7 — F108 endo "what we're watching" pre-fire card (for endo users) */}
      {(() => {
        const hasEndo = (state.conditions || []).includes('Endometriosis');
        if (!hasEndo) return null;
        const findings = HQ_CRISIS && HQ_CRISIS.assessEndoSafetyRules ? HQ_CRISIS.assessEndoSafetyRules(state) : [];
        if (findings.length > 0) {
          // Active findings — show urgent card
          return (
            <div className="card-warm fade-up" style={{ padding: 14, marginBottom: 14, borderLeft: '3px solid var(--coral)' }}>
              <div className="eyebrow" style={{ color: 'var(--coral)', marginBottom: 6 }}>F108 · {findings.length} PATTERN{findings.length === 1 ? '' : 'S'} TO DISCUSS</div>
              {findings.slice(0, 2).map(f => (
                <div key={f.id} style={{ fontSize: 13, marginBottom: 6 }}><strong>{f.label}:</strong> {f.message}</div>
              ))}
              <div className="caption" style={{ fontSize: 12, marginTop: 6 }}>Open Tools → Endometriosis → DIE safety system for full detail.</div>
            </div>
          );
        }
        const dayCount = Object.keys(state.endoDailyLog || {}).length;
        if (dayCount < 14) return null;
        // Pre-fire — show "we're watching" reassurance card
        return (
          <div className="card fade-up" style={{ padding: 12, marginBottom: 14, opacity: 0.85, border: '1px dashed var(--border)' }}>
            <div className="caption" style={{ fontSize: 12, color: 'var(--ink-2)' }}>
              <strong style={{ color: 'var(--eucalyptus)' }}>F108 · Watching your patterns.</strong> No red flags fired today. We watch for cyclical bowel symptoms, persistent severe pain, and other DIE markers across your logs.
            </div>
          </div>
        );
      })()}

      {/* MED-6 — F29 phase-aware single-line forecast on Today */}
      {(() => {
        // Compute typical energy from last 14 days of DRSP fatigue (inverse — lower fatigue = higher energy)
        const entries = state.entries || {};
        const cutoff = Date.now() - 14 * 86400000;
        const recent = Object.entries(entries).filter(([k]) => new Date(k).getTime() > cutoff);
        const fatigueAvg = recent.length
          ? recent.reduce((sum, [, e]) => sum + (e?.drsp?.fatigue || 3), 0) / recent.length
          : null;
        // Phase baseline (1–10): F=8, O=9, M=4, Lm=6, Ls=4, L=5
        const phaseBaseline = { F: 8, O: 9, M: 4, Lm: 6, Ls: 4, L: 5, '?': 6 }[phase] || 6;
        const dataAdjust = fatigueAvg != null ? Math.round((6 - fatigueAvg) * 0.5) : 0;
        const energy = Math.max(1, Math.min(10, phaseBaseline + dataAdjust));
        const energyIcon = energy >= 8 ? '☀️' : energy >= 6 ? '🌤️' : energy >= 4 ? '🍃' : '🌙';
        return (
          <div className="caption" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 12, padding: '8px 12px', fontSize: 12, color: 'var(--ink-2)' }}>
            <span style={{ fontSize: 14 }}>{energyIcon}</span>
            <span>Today's energy: ~{energy}/10 typical for your phase</span>
          </div>
        );
      })()}

      {/* T-43 — phase-aware Ora greeting (Ora-attributed first-person) */}
      {phaseGreeting && state.oraEnabled !== false && (
        <div className="ora-card" style={{ marginBottom: 16 }}>
          <div className="ora-label">
            <span className="italic-display" style={{ fontSize: 14, marginRight: 4, textTransform: 'none', letterSpacing: 0, color: 'var(--eucalyptus)' }}>O</span>
            ORA
          </div>
          <div className="ora-body">{phaseGreeting}</div>
          {OraFeedback && <OraFeedback insightId={`home-greeting-${phase}-${cycleDay}`} />}
        </div>
      )}

      {/* Cycle ring hero */}
      <div className="card-warm fade-up" style={{ padding: 20, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 16, position: 'relative', overflow: 'hidden', animationDelay: '60ms' }}>
        <div style={{ flexShrink: 0 }}>
          <CycleRing cycleDay={cycleDay} cycleLen={cycleLen} size={140} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* T-49 — phase pill uses PHASE_INK for proper contrast */}
          <div className="phase-pill" style={{ background: PHASE_COLORS[phase] || 'var(--mint-mist)', color: window.HQ.PHASE_INK[phase] || 'rgba(0,0,0,0.75)', marginBottom: 8 }}>
            {/* T-93 — custom SVG phase icon replaces emoji */}
            <span style={{ display: 'inline-flex', alignItems: 'center' }}>{PhaseIconFor ? PhaseIconFor(phase) : (PHASE_VIBES[phase]?.icon || '🍃')}</span>
            <span>{phaseChipText}</span>
          </div>
          <div className="body" style={{ fontSize: 14, lineHeight: 1.45 }}>{phaseGuidance[phase]?.tone || phaseGuidance['?'].tone}</div>
        </div>
      </div>

      {/* Period-start affordance — surfaces in late luteal, menstrual phase, or extended cycle */}
      {showPeriodStartPrompt && (
        <div className="card-warm fade-up" style={{ padding: 16, marginBottom: 18, borderLeft: '3px solid var(--rose)', animationDelay: '120ms' }}>
          <div className="eyebrow" style={{ marginBottom: 6, color: 'var(--rose)' }}>A quick check</div>
          <div className="body" style={{ fontSize: 14, marginBottom: 12 }}>Did your period start today?</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn-soft" style={{ flex: '1 1 auto', minWidth: 80 }} onClick={() => markPeriodStarted()}>Yes — log it</button>
            <button className="btn-ghost" style={{ flex: '0 0 auto', fontSize: 13 }} onClick={() => setState(s => ({ ...s, periodLog: { ...(s.periodLog || {}), [todayKeyForPeriod]: { flow: null, dismissed: true } } }))}>Not yet</button>
          </div>
        </div>
      )}

      {/* Period-flow logger when in menstrual phase and period has been logged */}
      {phase === 'M' && periodLog[todayKeyForPeriod] && periodLog[todayKeyForPeriod].started && !periodLog[todayKeyForPeriod].flow && (
        <div className="card-warm fade-up" style={{ padding: 16, marginBottom: 18, borderLeft: '3px solid var(--rose)' }}>
          <div className="eyebrow" style={{ marginBottom: 6, color: 'var(--rose)' }}>How's the flow today?</div>
          <div className="caption" style={{ marginBottom: 10, fontSize: 12 }}>Optional. Helpful clinically — heavy bleeding can flag endometriosis, fibroids, or PCOS-related issues worth discussing.</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6 }}>
            {['Spotting', 'Light', 'Medium', 'Heavy'].map(flow => (
              <button key={flow} className="chip" style={{ minHeight: 40, fontSize: 12 }}
                onClick={() => setState(s => ({ ...s, periodLog: { ...(s.periodLog || {}), [todayKeyForPeriod]: { ...(s.periodLog?.[todayKeyForPeriod] || {}), flow } } }))}>
                {flow}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* T-24 — community pulse line */}
      <div className="caption" style={{ textAlign: 'center', marginBottom: 18, fontSize: 12 }}>
        {communityCount.toLocaleString()} others are in their {PHASE_NAMES[phase] || 'current'} phase today
      </div>

      {/* 7-day strip */}
      <div className="eyebrow" style={{ marginBottom: 10 }}>The week ahead</div>
      <div className="week-strip" style={{ marginBottom: 14 }}>
        {days.map((d, i) => (
          <div key={i} className={`day-pill ${i === 0 ? 'today' : ''}`}>
            <div className="dn">{d.cycleDay}</div>
            <div className="ph">{irregular ? '?' : d.phase}</div>
            <div className="dot-row">
              <i style={{ background: PHASE_COLORS[irregular ? '?' : d.phase] || 'var(--mint-mist)' }} />
            </div>
          </div>
        ))}
      </div>
      {/* T-61 — phase legend below week strip */}
      {!irregular && PhaseLegend && (
        <div style={{ marginBottom: 22, display: 'flex', justifyContent: 'center' }}>
          <PhaseLegend compact />
        </div>
      )}

      {/* T-09 — endometrial Day 75 card (subtle butter accent, calm) */}
      {showEndo75 && (
        <div className="card-warm stripe-butter" style={{ marginBottom: 18, position: 'relative' }}>
          <div className="eyebrow" style={{ marginBottom: 6, color: 'var(--butter-deep)' }}>A note on cycle length</div>
          <p className="body" style={{ marginBottom: 12, fontSize: 14 }}>
            It's been 75 days since your last logged period. In PCOS, longer cycles are common — but cycles over 90 days without a withdrawal bleed are worth discussing with your doctor.
          </p>
          <button className="btn-ghost" onClick={acknowledgeEndo} style={{ fontSize: 13 }}>I spoke to my doctor about this</button>
        </div>
      )}

      {/* T-09 — endometrial Day 90+ card */}
      {showEndo90 && (
        <div className="card-warm stripe-sage" style={{ marginBottom: 18, position: 'relative' }}>
          <div className="eyebrow" style={{ marginBottom: 6, color: 'var(--eucalyptus-deep)' }}>Worth a conversation</div>
          <p className="body" style={{ marginBottom: 14, fontSize: 14 }}>
            You've been in an extended cycle for 90+ days. In PCOS, prolonged amenorrhea without progestogen protection can cause endometrial changes. We recommend discussing this with your doctor at your next appointment.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <button className="btn-soft" onClick={() => alert('Appointment note saved as a draft. Open Tools → Doctor prep to review.')}>Pre-fill appointment note</button>
            <button className="btn-ghost" onClick={acknowledgeEndo} style={{ fontSize: 13, textAlign: 'left' }}>I spoke to my doctor about this</button>
          </div>
        </div>
      )}

      {/* T-S08 — Safety plan auto-surface card (BELOW endometrial, ABOVE heads-up) */}
      {showSafetyAutoCard && (
        <div className="card-warm stripe-coral" style={{ marginBottom: 18, position: 'relative' }}>
          <div className="eyebrow" style={{ marginBottom: 6, color: 'var(--coral)' }}>A heads-up</div>
          <p className="body" style={{ marginBottom: 12, fontSize: 14 }}>
            Your higher-symptom window typically starts in about {daysToPeak} days. Your safety plan is ready if you need it.
          </p>
          <button className="btn-soft" onClick={() => goto('tools')} style={{ fontSize: 13 }}>Open my safety plan</button>
        </div>
      )}

      {/* T-02 — heads-up card hidden until logged today
          T-88 — close affordance + auto-collapse-to-line after first view per cycle */}
      {loggedToday && (phase === 'L' || phase === 'M') && (() => {
        // Cycle number: count of cycles since lastPeriod
        const ms = new Date() - new Date(state.lastPeriod);
        const cycleNumber = Math.floor(ms / (cycleLen * 86400000));
        const collapseKey = `headsUpCollapsed_${cycleNumber}`;
        const collapsed = !!(state[collapseKey] || (state.headsUpCollapsed || {})[cycleNumber]);
        const closeCard = () => {
          setState(s => ({
            ...s,
            [collapseKey]: true,
            headsUpCollapsed: { ...(s.headsUpCollapsed || {}), [cycleNumber]: true },
          }));
        };
        if (collapsed) {
          // Single-line non-interactive note
          return (
            <div className="caption" style={{ marginBottom: 16, padding: '8px 12px', fontSize: 12, color: 'var(--ink-3)', borderLeft: '2px solid var(--coral-soft)', paddingLeft: 10 }}>
              Heads-up: your usual harder window for this cycle.
            </div>
          );
        }
        return (
          <div className="card-warm" style={{ marginBottom: 18, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -10, right: -10, fontSize: 64, opacity: 0.15 }}>🍂</div>
            {/* T-88 — close affordance top-right */}
            <button
              onClick={closeCard}
              aria-label="Close heads-up"
              style={{
                position: 'absolute', top: 8, right: 8,
                width: 26, height: 26, borderRadius: '50%',
                background: 'transparent', color: 'var(--ink-3)',
                border: 'none', fontSize: 18, lineHeight: 1, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                opacity: 0.7,
              }}
            >×</button>
            <div className="eyebrow" style={{ marginBottom: 6 }}>A heads-up, not a diagnosis</div>
            <p className="body" style={{ marginBottom: 12 }}>Looking at your last 3 cycles, <em>{symptom}</em> tends to peak around Day 22 for you. That's the window where a lot of people with PMDD see the same shift.</p>
            <div style={{ display: 'flex', gap: 8 }}>
              {/* T-88 — "I feel okay" is UI-only, never alters tracking */}
              <button className="chip" onClick={closeCard}>I feel okay</button>
              <button className="chip">Tell me more</button>
            </div>
          </div>
        );
      })()}

      {/* T-16 — Brain Fog Mode auto-suggest one-time card */}
      {showBfSuggest && (
        <div className="card-warm stripe-eucalyptus" style={{ marginBottom: 18 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Want to simplify?</div>
          <p className="body" style={{ fontSize: 14, marginBottom: 10 }}>
            Want to simplify the app for today? Brain Fog Mode hides extras.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-soft" style={{ flex: 1 }}
              onClick={() => setState(s => ({ ...s, brainFogMode: true, brainFogSuggested: true }))}>
              Yes, simplify
            </button>
            <button className="btn-ghost" style={{ flex: 1 }}
              onClick={() => setState(s => ({ ...s, brainFogSuggested: true }))}>
              No thanks
            </button>
          </div>
        </div>
      )}

      {/* T-06 — Tier 1 inline card */}
      {loggedToday && tier === 'tier1' && HQ_CRISIS && (
        <HQ_CRISIS.Tier1Surface onOpenTier2={() => setShowTier2(true)} />
      )}

      {/* T-07 — luteal-phase Tier-1 persistent Support link */}
      {phase === 'L' && (
        <div style={{ marginBottom: 16, padding: '10px 14px', textAlign: 'center' }}>
          <button onClick={() => setShowTier2(true)}
            style={{ background: 'none', border: 'none', padding: 0, fontSize: 12, color: 'var(--ink-2)', textAlign: 'center', lineHeight: 1.5, cursor: 'pointer' }}>
            Some days in this phase can feel really dark. If that's where you are,{' '}
            <span style={{ textDecoration: 'underline', textUnderlineOffset: 3 }}>tap here.</span>
          </button>
        </div>
      )}

      {/* Log CTA — T-89 edit-within-24h affordance */}
      {(() => {
        const todayEntry = (state.entries || {})[todayKey];
        const savedAt = todayEntry?.savedAt;
        const within24h = savedAt && (Date.now() - savedAt) < 24 * 3600 * 1000;
        if (within24h) {
          return (
            <button
              className="card-warm stripe-sage"
              onClick={() => goto('log')}
              style={{
                marginBottom: 8, padding: 18, width: '100%',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', textAlign: 'left',
              }}
            >
              <div>
                <div className="eyebrow" style={{ marginBottom: 4 }}>SAVED</div>
                <div style={{ fontSize: 15, fontWeight: 500 }}>Today's log saved · <span className="text-link" style={{ textDecoration: 'underline' }}>edit</span></div>
              </div>
              <Icon.ChevRight width="20" height="20" style={{ color: 'var(--eucalyptus)' }} />
            </button>
          );
        }
        return (
          <button className="btn-primary" onClick={() => goto('log')} style={{ height: 60, fontSize: 16, marginBottom: 8 }}>
            <Icon.Plus width="20" height="20" /> Log today
          </button>
        );
      })()}
      {/* T-11 — caption updated */}
      <div className="caption" style={{ textAlign: 'center', marginBottom: 24 }}>
        Fast: ~30s · Full: ~90s{irregular ? '' : ` · Day ${cycleDay}, ${PHASE_NAMES[phase]}`}
      </div>

      {/* T-30 — Personalize further card after first log (when symptoms or notif still null) */}
      {loggedToday && (state.symptoms?.length === 0 || !state.symptoms || state.notif === null || state.adhd === null) && !state.personalizeDismissed && (
        <div className="card-warm stripe-sage" style={{ marginBottom: 18 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>OPTIONAL</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Personalize further</div>
          <div className="caption" style={{ fontSize: 12, marginBottom: 12 }}>
            Add symptoms, ADHD meds, or notification preferences to sharpen what I can show you.
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-soft" style={{ flex: 1 }} onClick={() => goto('profile')}>Open settings</button>
            <button className="btn-ghost" style={{ flex: 1, fontSize: 13 }} onClick={() => setState(s => ({ ...s, personalizeDismissed: true }))}>Not now</button>
          </div>
        </div>
      )}

      {/* T-33 — Deferred-condition setup card */}
      {(state.deferredConditions || []).length > 0 && (
        <div className="card-warm stripe-butter" style={{ marginBottom: 18 }}>
          <div className="eyebrow" style={{ marginBottom: 6 }}>WHEN YOU'RE READY</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Complete your {state.deferredConditions[0]} setup</div>
          <div className="caption" style={{ fontSize: 12, marginBottom: 12 }}>
            We started with one condition. Add the rest when you have a few minutes.
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-soft" style={{ flex: 1 }} onClick={() => goto('onboarding')}>Continue setup</button>
            <button className="btn-ghost" style={{ flex: 1, fontSize: 13 }} onClick={() => setState(s => ({ ...s, deferredConditions: (s.deferredConditions || []).slice(1) }))}>Skip for now</button>
          </div>
        </div>
      )}

      {/* Quick tools row — T-21 replaced toolkit with Log episode */}
      <div className="eyebrow" style={{ marginBottom: 10 }}>Today's quick tools</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 22 }}>
        <button className="card" onClick={() => setShowEpisode(true)} style={{ padding: 14, textAlign: 'left', cursor: 'pointer' }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--coral-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', fontSize: 18, color: 'var(--coral)', marginBottom: 8 }}>⚡</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Log an episode</div>
          <div className="caption" style={{ fontSize: 12 }}>Rage, panic, dissociation</div>
        </button>
        <button className="card" onClick={() => goto('tools')} style={{ padding: 14, textAlign: 'left', cursor: 'pointer', background: 'linear-gradient(135deg, var(--paper), var(--coral-soft))', borderColor: 'transparent' }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--display)', fontSize: 18, color: 'var(--eucalyptus-deep)', marginBottom: 8 }}>♡</div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>Safety plan</div>
          <div className="caption" style={{ fontSize: 12 }}>Built when well, ready now</div>
        </button>
      </div>

      {/* T-02 / T-14 — Ora pattern card with empty/early/confirmed states */}
      {patternState === 'empty' && state.oraEnabled !== false && (
        <div className="ora-card" style={{ marginBottom: 22 }}>
          <div className="ora-label">
            <span className="italic-display" style={{ fontSize: 14, marginRight: 4, textTransform: 'none', letterSpacing: 0, color: 'var(--eucalyptus)' }}>O</span>
            ORA
          </div>
          <div className="ora-body">
            I haven't seen enough of your cycle yet to say anything useful — about 2 weeks in, I'll start noticing things, and by your second luteal I'll have a real pattern to show you. Until then I'm here if you want to talk.
          </div>
          {OraFeedback && <OraFeedback insightId="home-pattern-empty" />}
        </div>
      )}
      {patternState === 'early' && state.oraEnabled !== false && (
        <div className="ora-card" style={{ marginBottom: 22 }}>
          <div className="ora-label">
            <span className="italic-display" style={{ fontSize: 14, marginRight: 4, textTransform: 'none', letterSpacing: 0, color: 'var(--eucalyptus)' }}>O</span>
            ORA · EARLY READ
          </div>
          <div className="ora-body">
            One cycle in. I'm seeing what looks like a luteal-phase shift around day 22, but I want one more cycle before I trust it. Hold tight.
          </div>
          {OraFeedback && <OraFeedback insightId="home-pattern-early" />}
        </div>
      )}
      {/* T-42 — multi-condition variants. Picks the most specific match. */}
      {patternState === 'confirmed' && loggedToday && state.oraEnabled !== false && (() => {
        const conds = state.conditions || [];
        const hasPMDD = conds.includes('PMDD');
        const hasPCOS = conds.includes('PCOS');
        const hasPeri = conds.includes('Perimenopause');
        const hasADHD = state.adhd === 'Yes' || state.adhd === 'I think so';
        let body = null;
        let label = 'ORA · PATTERN FOUND';
        if (hasPMDD && hasPCOS) {
          body = `Two things I'm watching across your cycles: your DRSP swing in the late luteal (real, 3.2× differential), and your cycle length (averaging ${cycleLen} days). Both worth bringing to your endocrinologist and psychiatrist.`;
        } else if (hasPMDD && hasADHD) {
          body = "Across your last cycles, your ADHD med effectiveness drops in the late luteal — a real pattern worth bringing to your psychiatrist.";
        } else if (hasPMDD) {
          body = "Across 3 cycles, your focus and irritability scores get measurably worse from Day 22 onward — the late luteal window when estrogen drops. This is the biological signal your prescriber needs to discuss luteal-phase dosing.";
        } else if (hasPCOS) {
          body = `I'm watching your cycle length and androgen-symptom logs. So far I'm seeing what looks like a roughly ${cycleLen}-day cycle pattern, with skin changes clustering in your ${(window.HQ.PHASE_NAMES[phase] || 'current').toLowerCase()} phase.`;
        } else if (hasPeri) {
          body = "Your hot flash log is showing roughly 6 per week — most clustered in the late afternoon. Your cycle length is variable.";
        } else {
          body = "I'm seeing your cycle take shape. Give me one more cycle and I'll have something specific to show you.";
        }
        return (
          <div className="ora-card" style={{ marginBottom: 22 }}>
            <div className="ora-label">
              <span className="italic-display" style={{ fontSize: 14, marginRight: 4, textTransform: 'none', letterSpacing: 0, color: 'var(--eucalyptus)' }}>O</span>
              {label}
            </div>
            <div className="ora-body">{body}</div>
            <button className="text-link" style={{ marginTop: 10, fontSize: 13 }} onClick={() => goto('ora')}>See the data →</button>
            {OraFeedback && <OraFeedback insightId={`home-pattern-confirmed-${(state.conditions || []).join('-')}`} />}
          </div>
        );
      })()}

      {/* Progress */}
      {(() => {
        const loggedCount = Object.keys(state.entries || {}).length;
        return (
          <div className="card-warm" style={{ padding: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
              <div className="eyebrow">Your DRSP chart</div>
              <div className="data caption">{loggedCount} {loggedCount === 1 ? 'day' : 'days'} logged</div>
            </div>
            <div className="caption" style={{ marginTop: 4 }}>{loggedCount === 0 ? 'Your first log will show up here.' : 'Your DRSP picture is building.'}</div>
          </div>
        );
      })()}

      {/* T-07 → Tier 2 surface */}
      {showTier2 && HQ_CRISIS && (
        <HQ_CRISIS.Tier2Surface onClose={() => setShowTier2(false)} />
      )}

      {/* T-21 — episode module sheet */}
      {showEpisode && <window.ModuleSheet id="rage" onClose={() => setShowEpisode(false)} />}
    </div>
  );
}

window.HomeScreen = HomeScreen;
window.HQ_HOME = { daysSinceLastPeriod, suppressEndoForMeds };
