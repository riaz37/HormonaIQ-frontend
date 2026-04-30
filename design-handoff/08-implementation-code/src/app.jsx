const { AppCtx, Icon, Logo, PHASE_COLORS, phaseForDay } = window.HQ;

// R7 polish — First-launch 3-card tour (proper named component so hooks order is stable)
function FirstLaunchTour({ onFinish }) {
  const [tourStep, setTourStep] = React.useState(0);
  const cards = [
    { eyebrow: 'WELCOME', title: <>This is your <em className="italic-display" style={{ color: 'var(--eucalyptus)' }}>home.</em></>, body: "Phase-aware. Updated as your cycle moves. Anything urgent surfaces here first — safety alerts, patterns, what's due this week." },
    { eyebrow: 'YOUR DAILY LOG', title: <>Under <em className="italic-display" style={{ color: 'var(--eucalyptus)' }}>90 seconds.</em></>, body: 'Tap "+" anywhere. Mood, sleep, anything physical. We learn the pattern over the first two cycles.' },
    { eyebrow: 'YOUR TOOLKIT', title: <>Everything else lives in <em className="italic-display" style={{ color: 'var(--eucalyptus)' }}>Tools.</em></>, body: "Clinical instruments, physician reports, condition-specific modules. Search if you're looking for something specific. Nothing is buried." },
  ];
  return (
    <div className="tour-overlay" onClick={onFinish}>
      <div className="tour-card" onClick={e => e.stopPropagation()}>
        <div className="tour-dots">
          {cards.map((_, i) => <span key={i} className={i === tourStep ? 'active' : ''} />)}
        </div>
        <div className="eyebrow" style={{ marginBottom: 8 }}>{cards[tourStep].eyebrow}</div>
        <h2 className="h2" style={{ marginBottom: 10 }}>{cards[tourStep].title}</h2>
        <p className="body" style={{ color: 'var(--ink-2)', marginBottom: 22, fontSize: 14 }}>{cards[tourStep].body}</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn-ghost" onClick={onFinish}>Skip</button>
          <button className="btn-primary" style={{ flex: 1 }} onClick={() => tourStep < cards.length - 1 ? setTourStep(tourStep + 1) : onFinish()}>
            {tourStep < cards.length - 1 ? 'Next' : 'Get started'}
          </button>
        </div>
      </div>
    </div>
  );
}

// T-53 — custom Ora "O" mark: organic offset oval
function OraMark({ active = false, size = 24 }) {
  const fill = active ? 'var(--sage)' : 'var(--paper)';
  const stroke = active ? 'transparent' : 'var(--sage)';
  return (
    <svg width={size} height={size * 22 / 24} viewBox="0 0 24 22" fill="none" style={{ display: 'block', transform: active ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.25s' }}>
      <ellipse cx="12.4" cy="11" rx="9.2" ry="8.4" fill={fill} stroke={stroke} strokeWidth="1.8" />
    </svg>
  );
}

function App() {
  const [theme, setTheme] = React.useState(() => localStorage.getItem('hq-theme') || 'light');
  const [route, setRoute] = React.useState(() => localStorage.getItem('hq-route') || 'landing');
  const [mode, setMode] = React.useState('app');
  const [tweaksOpen, setTweaksOpen] = React.useState(false);

  const defaultState = {
    onboarded: false,
    conditions: ['PMDD', 'PCOS', 'Perimenopause'],
    lastPeriod: (() => { const d = new Date(); d.setDate(d.getDate() - 19); return d.toISOString().slice(0,10); })(),
    cycleLen: 28,
    symptoms: ['Mood shifts that feel extreme', 'Irritability or anger that feels out of character', 'Difficulty concentrating', 'Anxiety or tension'],
    adhd: 'Yes',
    notif: true,
    entries: {}, // YYYY-MM-DD → { drsp, feeling, physical, adhdRating, sleep, suicidal_ideation, savedAt } (T-04)
    // Wave 2 additions:
    irregular: false,
    irregularSettings: { irregularMode: false, anovulatory: false, pcosPhaseEst: false }, // T-15
    yearOfBirth: 1985, // T-23
    brainFogMode: false, // T-16
    brainFogSuggested: false, // T-16 — one-time auto-suggest dismissed
    ed_safe_mode: 'no', // T-12 / T-20
    safetyPlanEditOverride: false, // T-S08
    labs: [], // T-18
    pdgResults: {}, // T-27
    inositolDoses: { myo: 4000, dci: 100, updatedAt: null }, // T-28
    medications: [], // T-fix-3 — array of { name, class }
    metabolicEntries: {}, // T-10 — date → { energy, cravings, brainFog }
    voiceFoodEntries: [], // T-12
    rageEpisodes: [], // T-21 / T-26
    relationshipImpacts: [], // T-26
    workImpacts: [], // T-26
    fastLogMode: false, // T-11
    featureFlags: { foodPhoto: false, weightTracker: false, lutealWall: false }, // T-19, T-20, T-25
    // Wave 3 additions:
    verifiedMinor: false, // T-31 — false | true | 'pending_consent'
    guardianEmailSent: false, // T-31
    oraEnabled: true, // T-35
    veteranMode: false, // T-34
    deferredConditions: [], // T-33
    cloudSaveOffered: false, // T-30 — Profile cloud-save tile dismissed?
    accountCreated: false, // T-30 — moved post-onboarding
    // Wave 4 additions:
    reduceMotion: false, // T-56 — global reduce-motion toggle (in addition to OS pref)
    // Wave 5 additions:
    exportSI: false, // T-03 — explicit opt-in to include SI in exports
    fgScores: {}, // T-71 — Ferriman-Gallwey per-site scores
    fgScoredAt: null, // T-71
    greeneScores: {}, // T-74 — per-item Greene Climacteric Scale scores
    oraTransparencyShown: false, // T-78 — Ora transparency block dismissed?
    drspAcknowledged: false, // T-03 — DRSP disclaimer interstitial acknowledged this session
    // Wave 6 additions
    oraFeedback: {}, // T-84 — { insightId: 'helpful' | 'not_relevant' | 'wrong' }
    cyclePaused: false, // T-85
    generalOnly: false, // T-85
    passiveMode: false, // T-91
    passiveModeUntil: null, // T-91 — timestamp ms
    headsUpCollapsed: {}, // T-88 — { cycleNumber: true }
    preselectedCondition: null, // T-90
    email: null, // T-86
    cycleRingDefault: true, // T-82
    // Period tracking (Round 1.5 fix — was missing as a real user surface)
    periodLog: {}, // YYYY-MM-DD → { flow: 'Spotting'|'Light'|'Medium'|'Heavy'|null, started: bool, dismissed?: bool, at: timestamp }
    // F10 — notification toggle settings (CRIT-6)
    notifSettings: {
      dailyCheckin: true,
      lutealHeadsUp: true,
      patternFound: true,
      safetyPlan: true,
      supplementReminder: false,
      ssriReminder: false,
      hotFlashCheckin: false,
      weeklyDigest: true,
    },
    // CRIT-8 — peri/cross input pipelines
    hotFlashLog: [], // [{ at: timestamp, intensity: 1-3 }]
    hrtTracking: {}, // YYYY-MM-DD → { hotFlashCount, sleepQuality, mood }
    gsmScores: {}, // YYYY-MM-DD → { dryness, painSex, urgency, uti, libido }
    brainFogLog: {}, // YYYY-MM-DD → { wordRetrieval, misplacing, names, focus }
    // MED-2 — F46 hair shedding persistence
    hairShedding: {}, // YYYY-MM-DD → { bin, ludwigZone }
    // MED-3 — F47 ovulation extra signals
    opkLog: {}, // YYYY-MM-DD → result
    cmLog: {},  // YYYY-MM-DD → type
    bbtLog: {}, // YYYY-MM-DD → number
    // Final pass — feature completion
    ssriConfig: null, // { name, dose, pattern }
    ssriLog: {}, // YYYY-MM-DD → { taken: bool, note?: string }
    triggerLog: {}, // YYYY-MM-DD → { sleep, caffeine, alcohol, exercise, stress, isolation }
    phenotype: null, // computed/cached A|B|C|D
    fertilityMode: false,
    fertilityCycleStart: null,
    intercourseLog: {}, // private — never exported
    ultrasoundVault: [], // [{ date, afcLeft, afcRight, ovVolLeft, ovVolRight, dominant, dominantSize, pcom, scanType }]
    bpLog: {}, // YYYY-MM-DD → { systolic, diastolic, pulse }

    // R7 — F88 Spotting tracker + AUB safety alert
    spottingLog: {}, // YYYY-MM-DD → { flow: 'spotting'|'light'|'medium'|'heavy', daysSincePeriod, postmenopausalGap, dischargedWithDoctor, note }
    aubAcknowledged: null, // ISO date when user confirmed they've discussed with doctor

    // R7 — F89 Hormonal birth control masking flag
    hbcActive: false,
    hbcType: null, // 'combined_pill'|'progestin_only_pill'|'hormonal_iud'|'implant'|'injection'|'patch'|'ring'|null
    hbcStartDate: null,
    perimenopausalStatus: 'unknown', // 'not_yet'|'perimenopause'|'postmenopause'|'unknown'

    // R7 — Module ready flags (toggle as each module ships)
    moduleReady: { endo: true, adhdFull: true },

    // R7 — Endometriosis module (F92–F121)
    endoOnboarding: null, // { activatedAt, diagnosisStatus, surgicalHistory, ... }
    endoDailyLog: {}, // YYYY-MM-DD → { dysmenorrhea_nrs, dyspareunia_nrs, dyschezia_nrs, dysuria_nrs, cpp_nrs, ... }
    endoPainLocation: {}, // YYYY-MM-DD → { zones: { ... }, view }
    endoBowelLog: {}, // YYYY-MM-DD → { bristol, frequency, rectalBleeding, ... }
    endoPbacLog: {}, // YYYY-MM-DD → { pads, tampons, clots, flooding, daily_score, cycle_total }
    endoPhq9Log: {}, // YYYY-MM-DD → { items, total, severity, item9_si, ... } (cross-condition uses same)
    endoGad7Log: {}, // YYYY-MM-DD → { items, total, severity }
    endoEhp30Log: {}, // YYYY-MM-DD → { items, subscale_scores, optionalModules }
    endoEhp5Log: {}, // YYYY-MM-DD → { items, total }
    endoBnbLog: {}, // YYYY-MM-DD → { patient_items, clinician_items, total }
    endoTreatmentLog: [], // [{ name, type, startDate, endDate, dose, frequency, sideEffects, effectivenessNRS }]
    endoSurgicalHistory: [], // [{ date, surgeon, hospital, type, rasrm_stage, enzian, notes }]
    endoLabVault: [], // [{ date, analyte, value, units }]
    endoImagingVault: [], // [{ date, type, findings, endometriomaSizes, dieSites }]
    endoComorbid: {}, // tracking flags + severity over time
    endoMedAdherenceLog: {}, // YYYY-MM-DD → { meds: { name: 'taken'|'missed' } }
    endoTriggerLog: {}, // YYYY-MM-DD → { food, stress, activity, cycle }
    endoPfptLog: [], // [{ date, therapist, intervention, postSessionPainDelta }]
    endoFodmapLog: {}, // YYYY-MM-DD → { phase, items: [{ food, severity }] }
    endoAcknowledgedRules: {}, // ruleId → ISO date
    endoDIETriggered: [], // [{ ruleId, firedAt, acknowledged }]

    // R7 — ADHD module (F122–F151) — replaces partial state
    adhdOnboarding: null,
    adhdDailyLog: {}, // YYYY-MM-DD → full schema
    adhdAsrs5Log: {}, // YYYY-MM-DD → { items, partA_positive_count, screen_positive }
    adhdRsLog: {}, // YYYY-MM-DD → { items, inattention_total, hyperactivity_total, total, severity }
    adhdCaarsLog: {}, // YYYY-MM-DD → { items, raw_sum, t_score, elevation }
    adhdWfirsLog: {}, // YYYY-MM-DD → { items, domain_scores, global_mean, global_impaired }
    adhdPhq9Log: {}, // shares logic with endoPhq9Log via cross-condition module
    adhdGad7Log: {},
    adhdIsiLog: {}, // YYYY-MM-DD → { items, total, severity }
    adhdEpisodeLog: {}, // timestamp → { intensity, trigger, recoveryTime, masked }
    adhdHyperfocusLog: {}, // timestamp → { duration, domain, intentional, postCrash }
    adhdMedicationLog: {}, // YYYY-MM-DD → { name, class, dose_mg, time_taken, effectiveness, sideEffects, bp_systolic, bp_diastolic, pulse }
    adhdCircadianLog: {}, // YYYY-MM-DD → { sleep_onset_time, wake_time, hours_slept, free_day }
    adhdBrownEfLog: {}, // YYYY-MM-DD → { items, cluster_scores, total }
    adhdPhysicianReportLog: [], // [{ date, variant, dataRangeDays }]
    adhdTimeBlindnessLog: {}, // YYYY-MM-DD → { impactToday, impactTypes, strategyUsed, strategyWorked }
    adhdBfrbDetailLog: {}, // YYYY-MM-DD → { occurred, types, context, distress, wantedToStop }
    adhdSupplementLog: {}, // YYYY-MM-DD → { omega3, magnesium, exercise_minutes, caffeine_mg }
    adhdBodyDoublingLog: {}, // timestamp → { duration, platform, taskCompleted, productivity }
    adhdAccommodationDoc: {}, // ISO_DATE → { setting, accommodations, dataRangeDays }
    adhdPerimenopauseLog: {}, // YYYY-MM-DD → { hotFlashCount, brainFog, hrtTaken, adhdSymptomChange }
    adhdBurnoutRisk: {}, // YYYY-MM-DD → { score, risk_level, primary_driver }
    adhdCbtLibrary: { cards_completed: [], modules_completed: [], bookmarked_cards: [] },
    adhdFinancialLog: {}, // ISO_WEEK → { impulsePurchase, billsMissed, financialDistress }
    adhdRelationshipLog: {}, // ISO_WEEK → { conflict, adhdContributing, copingStrategy, copingHealthy }
    adhdLateDiagnosisModule: { activated: false, articles_read: [] },
    adhdPostpartumLog: {}, // YYYY-MM-DD → { weeksPP, breastfeeding, epdsItems, epdsTotal }

    // R7 polish — first-launch tour seen flag
    firstLaunchTourSeen: false,

    // R7 — Perimenopause completeness
    dexaVault: [], // [{ date, lumbar_t, hip_t, fraxScore }]
    periNonHrtLog: [], // [{ name, dose, response_nrs, startDate }]
    mrsLog: {}, // YYYY-MM-DD → { items, somatovegetative, psychological, urogenital, total }
    fsfiLog: {}, // YYYY-MM-DD → { items, domain_scores, total }
    divaLog: {}, // YYYY-MM-DD → { domain_scores }
    iciqLog: {}, // YYYY-MM-DD → { items, total, severity }
    jointLog: {}, // YYYY-MM-DD → { zones, morningStiffnessMin, activityImpact }
    headacheLog: {}, // timestamp → { severity, location, durationHours, aura, triggers }
    palpLog: {}, // timestamp → { duration_min, context, severity }
    skinHairLog: {}, // ISO_WEEK → { skinDryness, hairVolumeLoss, facialHair, nailChanges }
    bladderLog: {}, // YYYY-MM-DD → { daytimeFreq, nocturia, urgencyEpisodes, leakage }
  };

  const [state, setState] = React.useState(() => {
    try {
      const stored = localStorage.getItem('hq-state');
      return stored ? { ...defaultState, ...JSON.parse(stored) } : defaultState;
    } catch { return defaultState; }
  });

  const cycleDay = React.useMemo(() => {
    const start = new Date(state.lastPeriod);
    const today = new Date();
    const diff = Math.floor((today - start) / 86400000) + 1;
    return Math.max(1, ((diff - 1) % state.cycleLen) + 1);
  }, [state.lastPeriod, state.cycleLen]);

  React.useEffect(() => { document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('hq-theme', theme); }, [theme]);
  React.useEffect(() => { localStorage.setItem('hq-route', route); }, [route]);
  React.useEffect(() => { localStorage.setItem('hq-state', JSON.stringify(state)); }, [state]);

  // T-56 — apply reduce-motion + brain-fog data attributes to the root element
  React.useEffect(() => {
    document.documentElement.setAttribute('data-reduce-motion', state.reduceMotion ? 'true' : 'false');
  }, [state.reduceMotion]);
  React.useEffect(() => {
    document.documentElement.setAttribute('data-brain-fog', state.brainFogMode ? 'true' : 'false');
  }, [state.brainFogMode]);

  // T-66 — Night mode auto-darken when dark theme + brain-fog + late-luteal + 23-6h
  React.useEffect(() => {
    const startDate = new Date(state.lastPeriod);
    const today = new Date();
    const diff = Math.floor((today - startDate) / 86400000);
    const cycleDay = Math.max(1, ((diff) % state.cycleLen) + 1);
    const lutealPeakStart = Math.round(state.cycleLen * 0.78);
    const isLateLuteal = cycleDay > lutealPeakStart && cycleDay <= state.cycleLen - 5;
    const h = today.getHours();
    const isNightHour = h >= 23 || h < 6;
    const nightMode = theme === 'dark' && state.brainFogMode && isLateLuteal && isNightHour;
    document.documentElement.setAttribute('data-night-mode', nightMode ? 'true' : 'false');
  }, [theme, state.brainFogMode, state.lastPeriod, state.cycleLen]);

  React.useEffect(() => { document.body.classList.toggle('landing-mode', mode === 'landing'); }, [mode]);

  const goto = (r) => {
    setRoute(r);
    if (r === 'landing') setMode('landing'); else setMode('app');
    window.scrollTo(0, 0);
  };

  const ctx = { state: { ...state, cycleDay }, setState, theme, setTheme, route, goto, setMode };

  const isAppRoute = ['home', 'log', 'calendar', 'chart', 'ora', 'profile', 'tools'].includes(route);
  const showFab = isAppRoute && route !== 'log'; // T-11
  const brainFog = !!state.brainFogMode; // T-16

  // T-16 — apply font scale + min tap target via inline data attribute
  React.useEffect(() => {
    document.documentElement.style.setProperty('--bf-scale', brainFog ? '1.1' : '1');
    document.documentElement.style.setProperty('--bf-tap', brainFog ? '56px' : '44px');
    if (brainFog) {
      document.body.style.fontSize = '17.6px';
      document.body.classList.add('brain-fog-mode');
    } else {
      document.body.style.fontSize = '';
      document.body.classList.remove('brain-fog-mode');
    }
  }, [brainFog]);

  React.useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "showOraDot": true
  }/*EDITMODE-END*/;
  const [tweaks, setTweaks] = React.useState(TWEAK_DEFAULTS);

  return (
    <AppCtx.Provider value={ctx}>
      <div id="root" style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
        <div className="device" style={mode === 'landing' ? { maxWidth: '100%', boxShadow: 'none', background: 'transparent' } : {}}>

          {isAppRoute && (() => {
            // T-55 — phase-aware topbar tint + dot
            const currentPhase = phaseForDay(cycleDay, state.cycleLen, { irregular: !!state.irregular });
            const phaseColor = ({
              F: 'rgba(199,217,197,0.18)',
              O: 'rgba(245,228,184,0.20)',
              Lm: 'rgba(232,159,134,0.16)',
              Ls: 'rgba(201,121,98,0.20)',
              L: 'rgba(232,159,134,0.16)',
              M: 'rgba(185,122,138,0.16)',
              '?': 'rgba(220,235,221,0.18)',
            })[currentPhase] || 'transparent';
            const dotColor = window.HQ.PHASE_COLORS[currentPhase] || 'var(--sage)';
            return (
              <div className="topbar" style={{ background: `linear-gradient(180deg, ${phaseColor} 0%, var(--paper) 60%)` }}>
                <button onClick={() => goto('landing')} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Logo size={15} />
                  <span title={`Currently ${window.HQ.PHASE_NAMES[currentPhase] || 'phase'}`}
                    className="topbar-phase-dot pulse-ring"
                    style={{ background: dotColor }} />
                </button>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="icon-btn" onClick={() => goto('profile')} aria-label="Settings">
                    <Icon.Settings width="18" height="18" />
                  </button>
                  <button className="icon-btn" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label="Toggle theme">
                    {theme === 'dark' ? <Icon.Sun width="18" height="18" /> : <Icon.Moon width="18" height="18" />}
                  </button>
                </div>
              </div>
            );
          })()}

          {/* R7 polish — first-launch 3-card tour overlay (shows once for users who completed onboarding but haven't seen the tour) */}
          {state.onboarded && !state.firstLaunchTourSeen && route === 'home' && (
            <FirstLaunchTour onFinish={() => setState(s => ({ ...s, firstLaunchTourSeen: true }))} />
          )}

          {route === 'landing' && <window.Landing />}
          {route === 'onboarding' && <window.Onboarding />}
          {route === 'home' && <window.HomeScreen />}
          {route === 'log' && <window.DailyLog />}
          {route === 'calendar' && <window.CalendarScreen />}
          {route === 'chart' && <window.ChartScreen />}
          {route === 'ora' && <window.OraScreen />}
          {route === 'profile' && <window.ProfileScreen />}
          {route === 'tools' && <window.ToolsScreen />}

          {/* T-77 — General disclaimer footer (in-app screens only, not Landing/Onboarding) */}
          {isAppRoute && (
            <div style={{ padding: '12px 16px', textAlign: 'center', fontSize: 11, color: 'var(--ink-3)', lineHeight: 1.5 }}>
              HormonaIQ is not a substitute for medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider.
            </div>
          )}

          {isAppRoute && (
            <nav className="tabbar">
              {(brainFog ? [
                { k: 'home', label: 'Home', I: Icon.Home },
                { k: 'log', label: 'Log', I: Icon.Plus },
                { k: 'profile', label: 'You', I: Icon.Settings },
              ] : [
                { k: 'home', label: 'Home', I: Icon.Home },
                { k: 'log', label: 'Log', I: Icon.Plus },
                { k: 'calendar', label: 'Cycle', I: Icon.Grid },
                { k: 'tools', label: 'Tools', I: Icon.Bars },
                // T-35 — when Ora disabled, the tab becomes a generic Insights tab
                state.oraEnabled === false
                  ? { k: 'ora', label: 'Insights', I: Icon.Sparkle }
                  : { k: 'ora', label: 'Ora', I: null },
              ]).map(t => (
                <button key={t.k} className={`tab ${route === t.k ? 'active' : ''}`} onClick={() => goto(t.k)}>
                  {t.I ? <t.I /> : (
                    <span style={{ position: 'relative', display: 'inline-flex', width: 24, height: 24, alignItems: 'center', justifyContent: 'center' }}>
                      <OraMark active={route === t.k} size={22} />
                      {/* T-53 — butter-deep notification dot using pulse-ring (6s) */}
                      {tweaks.showOraDot && <span style={{ position: 'absolute', top: -1, right: -3, width: 7, height: 7, borderRadius: '50%', background: 'var(--butter-deep)' }} className="pulse-ring" />}
                    </span>
                  )}
                  <span>{t.label}</span>
                </button>
              ))}
            </nav>
          )}

          {/* T-11 — persistent FAB above bottom nav (every screen except onboarding/landing/log) */}
          {showFab && (
            <button
              onClick={() => goto('log')}
              aria-label="Quick log"
              style={{
                position: 'fixed',
                right: 20,
                bottom: 88,
                width: 56,
                height: 56,
                borderRadius: '50%',
                background: 'var(--eucalyptus)',
                color: '#fff',
                border: 'none',
                boxShadow: '0 8px 22px rgba(43,78,60,0.32)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 50,
              }}
            >
              <Icon.Plus width="22" height="22" />
            </button>
          )}

          {tweaksOpen && (
            <div className="tweaks-panel show">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3>Tweaks</h3>
                <button onClick={() => { setTweaksOpen(false); window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); }} style={{ fontSize: 18, lineHeight: 1, padding: 4 }}>×</button>
              </div>
              <div className="tweak-row">
                <span>Theme</span>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button className={`tweak-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>Light</button>
                  <button className={`tweak-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>Dark</button>
                </div>
              </div>
              <div className="tweak-row"><span>Jump to</span></div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {['landing','onboarding','home','log','calendar','chart','tools','ora','profile'].map(r => (
                  <button key={r} className={`tweak-btn ${route === r ? 'active' : ''}`} onClick={() => goto(r)}>{r}</button>
                ))}
              </div>
              <div className="tweak-row" style={{ marginTop: 8 }}><span>Conditions active</span></div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {['PMDD','PCOS','Perimenopause'].map(c => (
                  <button key={c} className={`tweak-btn ${state.conditions?.includes(c) ? 'active' : ''}`}
                    onClick={() => setState(s => ({ ...s, conditions: (s.conditions || []).includes(c) ? s.conditions.filter(x => x !== c) : [...(s.conditions || []), c] }))}>{c}</button>
                ))}
              </div>
              <div className="tweak-row" style={{ marginTop: 8 }}>
                <span>ADHD overlap</span>
                <div className={`switch ${state.adhd === 'Yes' ? 'on' : ''}`} onClick={() => setState(s => ({ ...s, adhd: s.adhd === 'Yes' ? 'No' : 'Yes' }))} style={{ width: 36, height: 20 }} />
              </div>
              <div className="tweak-row" style={{ marginTop: 8 }}>
                <span>Cycle day</span>
                <input type="number" min="1" max={state.cycleLen} value={cycleDay}
                  onChange={e => {
                    const newDay = +e.target.value;
                    const d = new Date(); d.setDate(d.getDate() - (newDay - 1));
                    setState(s => ({ ...s, lastPeriod: d.toISOString().slice(0,10) }));
                  }}
                  style={{ width: 70, height: 32, textAlign: 'center', fontSize: 13 }} />
              </div>
              <div className="tweak-row">
                <span>Ora unread dot</span>
                <div className={`switch ${tweaks.showOraDot ? 'on' : ''}`} onClick={() => setTweaks(t => ({ ...t, showOraDot: !t.showOraDot }))} style={{ width: 36, height: 20 }} />
              </div>
              <div className="tweak-row">
                <span>Food photo flag</span>
                <div className={`switch ${state.featureFlags?.foodPhoto ? 'on' : ''}`}
                  onClick={() => setState(s => ({ ...s, featureFlags: { ...(s.featureFlags || {}), foodPhoto: !(s.featureFlags?.foodPhoto) } }))}
                  style={{ width: 36, height: 20 }} />
              </div>
              <div className="tweak-row">
                <span>Brain fog mode</span>
                <div className={`switch ${state.brainFogMode ? 'on' : ''}`}
                  onClick={() => setState(s => ({ ...s, brainFogMode: !s.brainFogMode }))}
                  style={{ width: 36, height: 20 }} />
              </div>
              <div className="tweak-row">
                <span>Irregular cycle</span>
                <div className={`switch ${state.irregular ? 'on' : ''}`}
                  onClick={() => setState(s => ({ ...s, irregular: !s.irregular }))}
                  style={{ width: 36, height: 20 }} />
              </div>
              <div className="tweak-row">
                <span>ED safe mode</span>
                <div className={`switch ${state.ed_safe_mode === 'yes' ? 'on' : ''}`}
                  onClick={() => setState(s => ({ ...s, ed_safe_mode: s.ed_safe_mode === 'yes' ? 'no' : 'yes' }))}
                  style={{ width: 36, height: 20 }} />
              </div>
              {/* T-35 — Ora enabled toggle */}
              <div className="tweak-row">
                <span>Ora enabled</span>
                <div className={`switch ${state.oraEnabled !== false ? 'on' : ''}`}
                  onClick={() => setState(s => ({ ...s, oraEnabled: s.oraEnabled === false ? true : false }))}
                  style={{ width: 36, height: 20 }} />
              </div>
              {/* T-34 — Veteran tracker mode */}
              <div className="tweak-row">
                <span>Veteran mode</span>
                <div className={`switch ${state.veteranMode ? 'on' : ''}`}
                  onClick={() => setState(s => ({ ...s, veteranMode: !s.veteranMode }))}
                  style={{ width: 36, height: 20 }} />
              </div>
              {/* T-37 — Demo persona toggles */}
              <div className="tweak-row" style={{ marginTop: 8 }}><span>Demo persona</span></div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                <button className="tweak-btn" onClick={() => {
                  const d = new Date(); d.setDate(d.getDate() - 19);
                  const entries = {};
                  for (let i = 0; i < 22; i++) {
                    const dt = new Date(); dt.setDate(dt.getDate() - i);
                    const day = ((28 - i) % 28) + 1;
                    const sev = day > 17 ? 5 : day < 6 ? 3 : 2;
                    entries[dt.toISOString().slice(0,10)] = { drsp: { irritability: sev, concentration: sev, overwhelmed: sev, suicidal_ideation: 1 }, savedAt: Date.now() };
                  }
                  setState(s => ({ ...s, conditions: ['PMDD'], adhd: 'No', entries, lastPeriod: d.toISOString().slice(0,10), cycleLen: 28, demoPersona: 'PMDD' }));
                }}>PMDD-only</button>
                <button className="tweak-btn" onClick={() => {
                  const d = new Date(); d.setDate(d.getDate() - 40);
                  setState(s => ({ ...s, conditions: ['PCOS'], adhd: 'No', entries: {}, lastPeriod: d.toISOString().slice(0,10), cycleLen: 42, irregular: true, demoPersona: 'PCOS' }));
                }}>PCOS-only</button>
                <button className="tweak-btn" onClick={() => {
                  const d = new Date(); d.setDate(d.getDate() - 19);
                  setState(s => ({ ...s, conditions: ['PMDD','PCOS','Perimenopause'], adhd: 'Yes', entries: {}, lastPeriod: d.toISOString().slice(0,10), cycleLen: 28, irregular: false, demoPersona: 'Multi' }));
                }}>Multi</button>
                <button className="tweak-btn" onClick={() => setState(s => ({ ...s, demoPersona: null }))}>Clear demo</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppCtx.Provider>
  );
}

ReactDOM.createRoot(document.getElementById('stage')).render(<App />);
