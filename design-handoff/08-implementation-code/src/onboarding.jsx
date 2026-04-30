// Wave 3 onboarding — T-30 compressed 8→4, T-31 age gate, T-32 ED opt-out,
// T-33 multi-condition progressive disclosure, T-34 veteran fork, T-35 Ora intro,
// T-36 "that makes sense" rewrite.
function Onboarding() {
  const { useApp, ProgressBar, Sprig, Icon, CycleRing, Leaf } = window.HQ;
  const { state: appState, setState, goto } = useApp();

  // Persisted onboarding state — resumable from any step
  const STORAGE_KEY = 'onboarding-state';
  const persisted = (() => {
    try { return JSON.parse(sessionStorage.getItem(STORAGE_KEY) || '{}'); } catch { return {}; }
  })();

  // Step-by-step keys (the 4 required steps + sub-screens)
  // 1: You found us  → DOB capture (T-31)
  //   1a: hard-block (<13)
  //   1b: guardian consent (13-15)
  // 2: Ora introduction (T-35)
  // 3: Conditions selection
  //   3.5: Multi-condition disclosure (T-33)
  //   3.7: ED opt-out (T-32)
  //   3.8: Veteran fork (T-34)
  // 4: Cycle basics + "that makes sense" hero (T-36)
  const [step, setStep] = React.useState(persisted.step || 1);
  const [yob, setYob] = React.useState(persisted.yob || 1995);
  // T-90 — pre-select condition from landing route param if present
  const [conditions, setConditions] = React.useState(
    persisted.conditions || (appState.preselectedCondition ? [appState.preselectedCondition] : ['PMDD'])
  );
  const [primaryCondition, setPrimaryCondition] = React.useState(persisted.primaryCondition || null);
  const [edAnswer, setEdAnswer] = React.useState(persisted.edAnswer || null); // T-32
  const [trackingHistory, setTrackingHistory] = React.useState(persisted.trackingHistory || null); // T-34
  const [oraDisabled, setOraDisabled] = React.useState(!!persisted.oraDisabled); // T-35
  const [lastPeriod, setLastPeriod] = React.useState(persisted.lastPeriod || (() => {
    const d = new Date(); d.setDate(d.getDate() - 19); return d.toISOString().slice(0, 10);
  })());
  const [cycleLen, setCycleLen] = React.useState(persisted.cycleLen || 28);
  const [irregular, setIrregular] = React.useState(!!persisted.irregular);
  const [guardianEmail, setGuardianEmail] = React.useState('');
  // R7 — F89 HBC masking flag captured during onboarding
  const [hbcActive, setHbcActive] = React.useState(!!persisted.hbcActive);
  const [hbcType, setHbcType] = React.useState(persisted.hbcType || null);
  // R7 — perimenopause status capture (informs F89 staging caveat trigger)
  const [perimenopausalStatus, setPerimenopausalStatus] = React.useState(persisted.perimenopausalStatus || 'unknown');

  const currentYear = new Date().getFullYear();
  const age = currentYear - yob;

  // Persist on every change
  React.useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({
        step, yob, conditions, primaryCondition, edAnswer, trackingHistory, oraDisabled,
        lastPeriod, cycleLen, irregular, notifChoice,
      }));
    } catch {}
  }, [step, yob, conditions, primaryCondition, edAnswer, trackingHistory, oraDisabled, lastPeriod, cycleLen, irregular, notifChoice]);

  // T-83 — track in-onboarding notification choice
  const [notifChoice, setNotifChoice] = React.useState(persisted.notifChoice || null);

  // Step machine — using string keys for clarity
  const next = (target) => setStep(target);
  const back = () => {
    // Walk backward through the route
    if (step === 'block' || step === 'guardian') return setStep(1);
    if (step === 2) return setStep(1);
    if (step === 3) return setStep(2);
    if (step === '3.5') return setStep(3);
    if (step === '3.7') return setStep(3);
    if (step === '3.8') return setStep('3.7');
    if (step === 4) return setStep('3.8');
    if (step === 5) return setStep(4); // T-83 — notification step
    if (typeof step === 'number' && step > 1) return setStep(step - 1);
    goto('landing');
  };

  const conditionList = [
    { name: 'PMDD', desc: 'Severe premenstrual mood symptoms', emoji: '🌗' },
    { name: 'PCOS', desc: 'Irregular cycles, androgens, insulin', emoji: '🌀' },
    { name: 'Perimenopause', desc: 'Including premature onset before 40', emoji: '🌾' },
    { name: 'ADHD overlap', desc: 'Track meds across cycle phases', emoji: '🌟' },
    { name: 'Endometriosis', desc: 'Pelvic pain, tissue outside uterus', emoji: '🌺' },
    { name: "I'm still figuring it out", desc: 'No diagnosis yet — that\'s why you\'re here', emoji: '🍃' },
  ];

  const cycleDay = React.useMemo(() => {
    const start = new Date(lastPeriod);
    const today = new Date();
    const diff = Math.floor((today - start) / 86400000) + 1;
    return Math.max(1, ((diff - 1) % cycleLen) + 1);
  }, [lastPeriod, cycleLen]);

  const phaseLabel = (() => {
    if (cycleDay <= 5) return 'menstrual phase';
    if (cycleDay <= Math.round(cycleLen * 0.45)) return 'follicular phase';
    if (cycleDay <= Math.round(cycleLen * 0.55)) return 'ovulatory window';
    return 'luteal phase';
  })();

  const toggle = (arr, set, v) => set(arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]);

  // Handle DOB submit and route appropriately
  const submitDob = () => {
    if (age < 13) {
      next('block');
    } else if (age < 16) {
      next('guardian');
    } else {
      // 16+ — continue
      next(2);
    }
  };

  const finish = () => {
    const verifiedMinor = age >= 16 && age < 18 ? true : (age < 16 ? 'pending_consent' : false);
    const veteranMode = trackingHistory === 'years';
    const deferred = primaryCondition && conditions.length > 1
      ? conditions.filter(c => c !== primaryCondition)
      : [];
    setState(s => ({
      ...s,
      onboarded: true,
      conditions,
      lastPeriod, cycleLen, irregular,
      yearOfBirth: yob,
      verifiedMinor,
      guardianEmailSent: age < 16 ? !!guardianEmail : false,
      ed_safe_mode: edAnswer && edAnswer !== 'no' ? 'yes' : 'no',
      veteranMode,
      oraEnabled: !oraDisabled,
      deferredConditions: deferred,
      // T-83 — capture notification choice from onboarding (allow|deny)
      notif: notifChoice === 'allow' ? true : notifChoice === 'deny' ? false : (s.notif !== undefined ? s.notif : null),
      symptoms: s.symptoms || [],
      adhd: s.adhd || (conditions.includes('ADHD overlap') ? 'Yes' : null),
      // R7 — F89 hormonal birth control + perimenopausal status
      hbcActive,
      hbcType: hbcActive ? hbcType : null,
      perimenopausalStatus,
      // R7 — F114 adolescent mode auto-activation for endo users < 18 (Phase 7 polish)
      adultMode: !(conditions.includes('Endometriosis') && age < 18),
      // R7 — Late-diagnosis support auto-activation for ADHD recently_diagnosed
      adhdLateDiagnosisModule: (conditions.includes('ADHD overlap') && age >= 25)
        ? { activated: true, articles_read: [], assessment_prep_completed: false, diagnosis_age: age }
        : (s.adhdLateDiagnosisModule || { activated: false, articles_read: [] }),
    }));
    try { sessionStorage.removeItem(STORAGE_KEY); } catch {}
    goto('home');
  };

  // Dot count varies — show 4 dots for the 4 required visible steps; sub-screens highlight prev dot
  const visibleStepIndex = (() => {
    if (step === 1 || step === 'block' || step === 'guardian') return 1;
    if (step === 2) return 2;
    if (step === 3 || step === '3.5' || step === '3.7' || step === '3.8') return 3;
    if (step === 4) return 4;
    if (step === 5) return 5;
    return 1;
  })();

  const isHero = step === 1 || step === 4;
  // T-83 — total dots includes notification step
  const totalDots = 5;

  return (
    <div className={isHero ? 'onboarding-hero' : ''} style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {isHero && (
        <>
          <Leaf size={160} color="rgba(63,111,90,0.22)" style={{ top: 60, right: -40 }} rotate={-20} />
          <Leaf size={110} color="rgba(232,159,134,0.3)" style={{ bottom: 100, left: -30 }} rotate={130} />
        </>
      )}

      <div style={{ padding: '18px 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <button onClick={step === 1 ? () => goto('landing') : back} className="icon-btn" style={{ background: isHero ? 'rgba(255,255,255,0.6)' : 'var(--surface)' }}>
          <Icon.ChevLeft width="18" height="18" />
        </button>
        <div className="progress-dots">
          {Array.from({ length: totalDots }).map((_, i) => (
            <span key={i} className={i + 1 === visibleStepIndex ? 'active' : i + 1 < visibleStepIndex ? 'done' : ''} />
          ))}
        </div>
        <div style={{ width: 38 }} />
      </div>

      <div style={{ flex: 1, padding: '20px 26px 36px', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        {/* STEP 1 — You found us + DOB (T-30, T-31) */}
        {step === 1 && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 520, margin: '0 auto' }} className="fade-up">
            <div style={{ alignSelf: 'center', marginBottom: 32 }} className="float">
              <Sprig size={68} color="var(--eucalyptus)" />
            </div>
            <h1 className="display" style={{ marginBottom: 20, textAlign: 'center' }}>
              You found us.
            </h1>
            <p className="body-l" style={{ textAlign: 'center', marginBottom: 8 }}>
              This isn't a period tracker. It isn't a fertility app.
            </p>
            <p className="body-l" style={{ textAlign: 'center', marginBottom: 32 }}>
              It's for the other weeks of the month — the ones no one else tracks.
            </p>
            <div style={{ background: 'rgba(255,255,255,0.72)', borderRadius: 'var(--radius-md)', padding: 20, marginBottom: 16 }}>
              <label className="eyebrow" style={{ display: 'block', marginBottom: 10 }}>Year of birth</label>
              <select value={yob} onChange={e => setYob(+e.target.value)} style={{ width: '100%', height: 44, fontSize: 15 }}>
                {Array.from({ length: currentYear - 1940 + 1 }).map((_, i) => {
                  const y = currentYear - i;
                  return <option key={y} value={y}>{y}</option>;
                })}
              </select>
              <div className="caption" style={{ marginTop: 8, fontSize: 12 }}>We use age to tailor your safety resources. We don't share it.</div>
            </div>
            <button className="btn-primary" style={{ marginTop: 16, maxWidth: 360, alignSelf: 'center', width: '100%' }} onClick={submitDob}>
              Continue <Icon.ChevRight width="18" height="18" />
            </button>
            <button className="btn-ghost" style={{ marginTop: 14 }} onClick={() => goto('landing')}>I have an account</button>
          </div>
        )}

        {/* T-31 — Hard block screen */}
        {step === 'block' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 460, margin: '0 auto', textAlign: 'center' }} className="fade-up">
            <div className="eyebrow" style={{ marginBottom: 12 }}>AGE REQUIREMENT</div>
            <h1 className="display" style={{ marginBottom: 18 }}>You'll need to be a bit older.</h1>
            <p className="body-l" style={{ marginBottom: 18 }}>
              HormonaIQ requires users to be 13 or older. We're sorry — please come back when you're older.
            </p>
            <p className="caption" style={{ fontSize: 12 }}>
              If you're concerned about symptoms, please talk to a parent, guardian, or a school nurse.
            </p>
          </div>
        )}

        {/* T-31 — Guardian consent screen (13–15) */}
        {step === 'guardian' && (
          <div className="fade-up" style={{ maxWidth: 520, margin: '0 auto' }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>PARENT / GUARDIAN CONSENT</div>
            <h1 className="display" style={{ marginBottom: 14 }}>One quick step before we go further.</h1>
            <p className="body" style={{ color: 'var(--ink-2)', marginBottom: 22 }}>
              Because you're under 16, we need a parent or guardian's consent to keep your data. Send them a quick email and they'll be able to confirm.
            </p>
            <label className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>Guardian email</label>
            <input type="email" placeholder="adult@email.com" value={guardianEmail} onChange={e => setGuardianEmail(e.target.value)} />
            <button className="btn-primary" style={{ marginTop: 22 }} onClick={() => { setState(s => ({ ...s, guardianEmailSent: true })); next(2); }} disabled={!guardianEmail}>
              Send consent email
            </button>
            <button className="btn-ghost" style={{ marginTop: 10, width: '100%' }} onClick={() => next(2)}>I'll handle this later</button>
            <div className="caption" style={{ fontSize: 11, marginTop: 18 }}>
              Until consent is confirmed, your data lives only on this device.
            </div>
          </div>
        )}

        {/* STEP 2 — Ora introduction (T-35) */}
        {step === 2 && (
          <div className="fade-up" style={{ maxWidth: 520, margin: '0 auto' }}>
            <div style={{ marginBottom: 8 }}>
              <span className="italic-display" style={{ fontSize: 32, color: 'var(--eucalyptus)' }}>Ora</span>
            </div>
            <h1 className="display" style={{ marginBottom: 18 }}>Hi. I'm Ora.</h1>
            <div className="card-warm" style={{ padding: 18, marginBottom: 14, borderLeft: '3px solid var(--sage)', background: 'linear-gradient(135deg, var(--paper), var(--mint-pale))' }}>
              <p className="body" style={{ marginBottom: 12 }}>
                I'm not your doctor and I'm not a therapist — I'm an AI you can talk to who knows hormonal health and is going to know your cycle better than anyone.
              </p>
              <p className="body">
                I'll be here at 3am if you need me. I'll be quiet when you don't.
              </p>
            </div>
            <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '14px 16px', background: 'var(--surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: 18 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Disable Ora</div>
                <div className="caption" style={{ fontSize: 12 }}>You can turn me on later from Profile.</div>
              </div>
              <div className={`switch ${oraDisabled ? 'on' : ''}`} onClick={() => setOraDisabled(!oraDisabled)} />
            </label>
            <button className="btn-primary" onClick={() => next(3)}>Continue <Icon.ChevRight width="18" height="18" /></button>
          </div>
        )}

        {/* STEP 3 — Conditions */}
        {step === 3 && (
          <div className="fade-up">
            <h1 className="display" style={{ marginBottom: 10 }}>What brings you here?</h1>
            <p className="body" style={{ color: 'var(--ink-2)', marginBottom: 24 }}>Pick any that apply. These often travel together.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {conditionList.map(c => {
                const on = conditions.includes(c.name);
                return (
                  <button key={c.name} onClick={() => toggle(conditions, setConditions, c.name)}
                    style={{
                      minHeight: 110, padding: 16, textAlign: 'left',
                      border: `1.5px solid ${on ? 'var(--eucalyptus)' : 'var(--border)'}`,
                      background: on ? 'var(--mint-pale)' : 'var(--surface)',
                      borderRadius: 'var(--radius-md)',
                      transition: 'all 0.2s',
                      transform: on ? 'translateY(-2px)' : 'none',
                      boxShadow: on ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                    }}>
                    <div style={{ fontSize: 22, marginBottom: 6 }}>{c.emoji}</div>
                    <div style={{ fontWeight: 600, fontSize: 15 }}>{c.name}</div>
                    <div className="caption" style={{ marginTop: 4 }}>{c.desc}</div>
                  </button>
                );
              })}
            </div>
            <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => next(conditions.length >= 2 ? '3.5' : '3.7')} disabled={!conditions.length}>Continue</button>
          </div>
        )}

        {/* T-33 — Multi-condition disclosure */}
        {step === '3.5' && (
          <div className="fade-up" style={{ maxWidth: 520, margin: '0 auto' }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>WE'LL TAKE THESE ONE AT A TIME</div>
            <h1 className="display" style={{ marginBottom: 12 }}>We'll set up X first. The rest can wait.</h1>
            <p className="body" style={{ color: 'var(--ink-2)', marginBottom: 22 }}>
              Setting up everything at once is too much. Pick the one that matters most right now — the others will get their own setup later, when you're ready.
            </p>
            <div style={{ display: 'grid', gap: 10 }}>
              {conditions.map(c => {
                const on = primaryCondition === c;
                return (
                  <button key={c} onClick={() => setPrimaryCondition(c)}
                    style={{
                      minHeight: 60, padding: 16, textAlign: 'left',
                      border: `1.5px solid ${on ? 'var(--eucalyptus)' : 'var(--border)'}`,
                      background: on ? 'var(--mint-pale)' : 'var(--surface)',
                      borderRadius: 'var(--radius-md)', fontSize: 15, fontWeight: 500,
                    }}>
                    {c}
                  </button>
                );
              })}
            </div>
            <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => next('3.7')} disabled={!primaryCondition}>Continue</button>
          </div>
        )}

        {/* T-32 — ED opt-out */}
        {step === '3.7' && (
          <div className="fade-up" style={{ maxWidth: 520, margin: '0 auto' }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>A QUICK ASK BEFORE WE GO FURTHER</div>
            <h1 className="display" style={{ marginBottom: 14 }}>Have you had a difficult relationship with food or body image?</h1>
            <p className="caption" style={{ marginBottom: 20, fontSize: 13, color: 'var(--ink-2)' }}>
              We ask because some features can be unhelpful for people with ED history. Your answer just shapes what's visible.
            </p>
            <div style={{ display: 'grid', gap: 10 }}>
              {[
                { v: 'yes', l: 'Yes' },
                { v: 'currently', l: 'Currently' },
                { v: 'past', l: 'In the past' },
                { v: 'prefer-not', l: 'Prefer not to say' },
                { v: 'no', l: 'No' },
              ].map(o => {
                const on = edAnswer === o.v;
                return (
                  <button key={o.v} onClick={() => setEdAnswer(o.v)}
                    style={{
                      minHeight: 56, padding: 14, textAlign: 'left',
                      border: `1.5px solid ${on ? 'var(--eucalyptus)' : 'var(--border)'}`,
                      background: on ? 'var(--mint-pale)' : 'var(--surface)',
                      borderRadius: 'var(--radius-md)', fontSize: 15, fontWeight: 500,
                    }}>
                    {o.l}
                  </button>
                );
              })}
            </div>
            <button className="btn-primary" style={{ marginTop: 22 }} onClick={() => next('3.8')} disabled={!edAnswer}>Continue</button>
          </div>
        )}

        {/* T-34 — Veteran-tracker fork */}
        {step === '3.8' && (
          <div className="fade-up" style={{ maxWidth: 520, margin: '0 auto' }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>ONE MORE</div>
            <h1 className="display" style={{ marginBottom: 18 }}>How long have you been tracking?</h1>
            <div style={{ display: 'grid', gap: 10 }}>
              {[
                { v: 'new', l: "I'm new to this" },
                { v: 'under-year', l: 'Under a year' },
                { v: 'years', l: 'Years' },
              ].map(o => {
                const on = trackingHistory === o.v;
                return (
                  <button key={o.v} onClick={() => setTrackingHistory(o.v)}
                    style={{
                      minHeight: 60, padding: 16, textAlign: 'left',
                      border: `1.5px solid ${on ? 'var(--eucalyptus)' : 'var(--border)'}`,
                      background: on ? 'var(--mint-pale)' : 'var(--surface)',
                      borderRadius: 'var(--radius-md)', fontSize: 15, fontWeight: 500,
                    }}>
                    {o.l}
                  </button>
                );
              })}
            </div>
            <button className="btn-primary" style={{ marginTop: 22 }} onClick={() => next(4)} disabled={!trackingHistory}>Continue</button>
          </div>
        )}

        {/* STEP 4 — Cycle basics + "that makes sense" hero */}
        {step === 4 && (
          <div className="fade-up" style={{ maxWidth: 520, margin: '0 auto', width: '100%' }}>
            <h1 className="display" style={{ marginBottom: 22 }}>Cycle basics</h1>
            <label className="eyebrow" style={{ display: 'block', marginBottom: 8 }}>When did your last period start?</label>
            <input type="date" value={lastPeriod} onChange={e => setLastPeriod(e.target.value)} />
            <label className="eyebrow" style={{ display: 'block', marginTop: 22, marginBottom: 12 }}>Typical cycle length</label>
            <div className="stepper">
              <button onClick={() => setCycleLen(c => Math.max(14, c - 1))}>−</button>
              <span className="val">{cycleLen} days</span>
              <button onClick={() => setCycleLen(c => Math.min(120, c + 1))}>+</button>
            </div>
            <input type="range" min="14" max="120" value={cycleLen} onChange={e => setCycleLen(+e.target.value)} style={{ width: '100%', marginTop: 14 }} />
            <label style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 22, cursor: 'pointer', padding: '12px 16px', background: 'rgba(255,255,255,0.6)', borderRadius: 'var(--radius-md)' }}>
              <input type="checkbox" checked={irregular} onChange={e => setIrregular(e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--eucalyptus)' }} />
              <span style={{ fontSize: 15 }}>My cycles are irregular</span>
            </label>

            {/* R7 — F89 Hormonal birth control flag (peri / ADHD users especially affected) */}
            {(conditions.includes('Perimenopause') || conditions.includes('ADHD overlap') || age >= 35) && (
              <div style={{ marginTop: 22, padding: '14px 16px', background: 'rgba(255,255,255,0.6)', borderRadius: 'var(--radius-md)' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                  <input type="checkbox" checked={hbcActive} onChange={e => setHbcActive(e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--eucalyptus)' }} />
                  <span style={{ fontSize: 15 }}>I'm on hormonal birth control</span>
                </label>
                <div className="caption" style={{ marginTop: 6, fontSize: 12 }}>
                  HBC suppresses FSH and can mask cycle changes — knowing this helps us interpret your data accurately.
                </div>
                {hbcActive && (
                  <select value={hbcType || ''} onChange={e => setHbcType(e.target.value)} style={{ width: '100%', height: 40, marginTop: 12, fontSize: 14 }}>
                    <option value="">Type of HBC…</option>
                    <option value="combined_pill">Combined pill</option>
                    <option value="progestin_only_pill">Progestin-only pill</option>
                    <option value="hormonal_iud">Hormonal IUD (Mirena, Kyleena)</option>
                    <option value="implant">Implant (Nexplanon)</option>
                    <option value="injection">Injection (Depo-Provera)</option>
                    <option value="patch">Patch</option>
                    <option value="ring">Ring (NuvaRing)</option>
                  </select>
                )}
              </div>
            )}

            {/* R7 — Perimenopausal status (peri or 40+ users) */}
            {(conditions.includes('Perimenopause') || age >= 40) && (
              <div style={{ marginTop: 14, padding: '14px 16px', background: 'rgba(255,255,255,0.6)', borderRadius: 'var(--radius-md)' }}>
                <div className="eyebrow" style={{ marginBottom: 8 }}>WHERE ARE YOU IN YOUR TRANSITION?</div>
                <select value={perimenopausalStatus} onChange={e => setPerimenopausalStatus(e.target.value)} style={{ width: '100%', height: 40, fontSize: 14 }}>
                  <option value="unknown">Not sure yet</option>
                  <option value="not_yet">Not yet — cycles still regular</option>
                  <option value="perimenopause">Perimenopause — symptoms started, periods still happening</option>
                  <option value="postmenopause">Postmenopause — 12+ months since last period</option>
                </select>
                {perimenopausalStatus === 'postmenopause' && (
                  <div className="caption" style={{ marginTop: 8, fontSize: 12, color: 'var(--rose)' }}>
                    Important: bleeding after menopause needs evaluation. We'll flag this in your daily log.
                  </div>
                )}
              </div>
            )}

            {/* "that makes sense" hero — T-36 / T-94 verified */}
            <div className="breathe" style={{ marginTop: 32, textAlign: 'center', animationDuration: '6s' }}>
              <p className="body-l" style={{ marginBottom: 18 }}>
                You're on Day <span style={{ fontFamily: 'var(--mono)', fontWeight: 500, color: 'var(--eucalyptus-deep)' }}>{cycleDay}</span> — likely your {phaseLabel}.
              </p>
              <div className="float" style={{ display: 'flex', justifyContent: 'center' }}>
                <CycleRing cycleDay={cycleDay} cycleLen={cycleLen} size={220} />
              </div>
              <p className="italic-display fade-up" style={{ fontSize: 44, lineHeight: 1.05, letterSpacing: '-0.01em', marginTop: 28, color: 'var(--eucalyptus-deep)', animationDelay: '600ms' }}>
                that makes sense.
              </p>
              {trackingHistory !== 'years' && (
                <>
                  <p className="body-l fade-up" style={{ marginTop: 12, animationDelay: '1000ms' }}>
                    Many people start tracking in their luteal phase. We'll learn your specific pattern over the next 30 days.
                  </p>
                  <p className="caption fade-up" style={{ marginTop: 14, fontSize: 13, color: 'var(--ink-2)', maxWidth: 460, marginLeft: 'auto', marginRight: 'auto', animationDelay: '1000ms' }}>
                    It takes two full cycles to establish your pattern. This is not a limitation of the app — it is a clinical requirement.
                  </p>
                </>
              )}
            </div>

            <button className="btn-primary" style={{ marginTop: 28 }} onClick={() => next(5)}>
              Continue <Icon.ChevRight width="18" height="18" />
            </button>
          </div>
        )}

        {/* STEP 5 — T-83 notification permission (equalized) + T-93 SVG icon examples */}
        {step === 5 && (
          <div className="fade-up" style={{ maxWidth: 520, margin: '0 auto', width: '100%' }}>
            <div className="eyebrow" style={{ marginBottom: 8 }}>NOTIFICATIONS</div>
            <h1 className="display" style={{ marginBottom: 14 }}>Stay ahead of your cycle</h1>
            <p className="body" style={{ color: 'var(--ink-2)', marginBottom: 22 }}>
              I'll send a quiet heads-up before your harder days. You can turn this off anytime.
            </p>

            {/* T-93 — SVG icon previews replace emoji prefixes */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {[
                { I: Icon.Bell, line: 'Day 22: heads up — your usual harder window starts in 2 days.' },
                { I: Icon.Sparkle, line: "Sunday: I'm seeing two patterns this week — open Ora when you have a minute." },
                { I: Icon.Heart, line: "Day 5: the hard part is lifting. Rest counts." },
              ].map((ex, i) => (
                <div key={i} className="card" style={{ padding: 14, display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: '50%', background: 'var(--mint-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--eucalyptus)' }}>
                    <ex.I width="16" height="16" />
                  </div>
                  <div className="caption" style={{ fontSize: 13, color: 'var(--ink-2)' }}>{ex.line}</div>
                </div>
              ))}
            </div>

            {/* T-83 — equalized buttons (both btn-outline). "Allow notifications" + "Not now" */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button
                className="btn-outline"
                style={{
                  height: 52,
                  background: notifChoice === 'allow' ? 'var(--mint-pale)' : 'transparent',
                  borderColor: notifChoice === 'allow' ? 'var(--eucalyptus)' : 'var(--eucalyptus)',
                  borderWidth: notifChoice === 'allow' ? 2 : 1.5,
                }}
                onClick={() => {
                  setNotifChoice('allow');
                  // CRIT-6 — actually request system permission
                  if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
                    try { Notification.requestPermission(); } catch {}
                  }
                }}
              >
                Allow notifications
              </button>
              <button
                className="btn-outline"
                style={{
                  height: 52,
                  background: notifChoice === 'deny' ? 'var(--mint-pale)' : 'transparent',
                  borderColor: notifChoice === 'deny' ? 'var(--eucalyptus)' : 'var(--eucalyptus)',
                  borderWidth: notifChoice === 'deny' ? 2 : 1.5,
                }}
                onClick={() => setNotifChoice('deny')}
              >
                Not now
              </button>
            </div>

            <button className="btn-primary" style={{ marginTop: 24 }} onClick={finish} disabled={!notifChoice}>
              Begin <Icon.ChevRight width="18" height="18" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

window.Onboarding = Onboarding;
