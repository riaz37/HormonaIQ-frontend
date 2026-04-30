function ProfileScreen() {
  const { useApp, Sprig, Leaf, Blob, Icon } = window.HQ;
  const { state, setState, theme, setTheme, goto } = useApp();
  // T-56 — reduce-motion lifted into context (state.reduceMotion)
  const reduceMotion = !!state.reduceMotion;
  const setReduceMotion = (v) => setState(s => ({ ...s, reduceMotion: v }));
  const [textSize, setTextSize] = React.useState(16);
  const [showAbout, setShowAbout] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  // T-85 — pregnancy/pause confirm modal
  const [showPauseModal, setShowPauseModal] = React.useState(false);
  // T-86 — sign out confirm modal
  const [showSignOut, setShowSignOut] = React.useState(false);

  // T-91 — passive mode toggle ("Show me data without questions today")
  const passiveActive = !!state.passiveMode || (state.passiveModeUntil && Date.now() < state.passiveModeUntil);
  const togglePassive = () => {
    if (passiveActive) {
      setState(s => ({ ...s, passiveMode: false, passiveModeUntil: null, passiveAutoOverride: true }));
    } else {
      setState(s => ({ ...s, passiveMode: true, passiveModeUntil: Date.now() + 24 * 3600 * 1000 }));
    }
  };

  const archivePause = () => {
    setState(s => ({ ...s, cyclePaused: true, generalOnly: false }));
    setShowPauseModal(false);
  };
  const generalOnlyPath = () => {
    setState(s => ({ ...s, cyclePaused: false, generalOnly: true }));
    setShowPauseModal(false);
  };
  const resumeCycle = () => {
    setState(s => ({ ...s, cyclePaused: false, generalOnly: false }));
  };

  const edSafe = state.ed_safe_mode === 'yes';
  const weightOpt = !!(state.featureFlags && state.featureFlags.weightTracker);
  const toggleWeightOpt = () => {
    if (edSafe) return;
    setState(s => ({ ...s, featureFlags: { ...(s.featureFlags || {}), weightTracker: !(s.featureFlags?.weightTracker) } }));
  };
  const toggleEdSafe = () => setState(s => ({ ...s, ed_safe_mode: s.ed_safe_mode === 'yes' ? 'no' : 'yes' }));
  const toggleBrainFog = () => setState(s => ({ ...s, brainFogMode: !s.brainFogMode }));

  const tags = [...(state.conditions || []), ...(state.adhd === 'Yes' || state.adhd === 'I think so' ? ['ADHD'] : [])];

  // T-52 — group tints by purpose. cardClass + extraClass let us layer (e.g. card-warm + privacy stripe)
  const Group = ({ title, titleIcon, children, cardClass, extraClass, idx }) => {
    const TI = titleIcon || null;
    return (
      <div className="fade-up" style={{ marginBottom: 28, animationDelay: (60 * (idx || 0)) + 'ms' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          {TI && <TI width="14" height="14" style={{ color: 'var(--eucalyptus-deep)' }} />}
          <div className="eyebrow" style={{ margin: 0 }}>{title}</div>
        </div>
        <div className={`${cardClass || 'card'} ${extraClass || ''}`} style={{ padding: '0 18px' }}>
          {children}
        </div>
      </div>
    );
  };

  const Row = ({ label, right, onClick, danger }) => (
    <div className="setting-row" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <div style={{ fontSize: 15, color: danger ? 'var(--danger)' : 'inherit', fontWeight: 500 }}>{label}</div>
      <div>{right}</div>
    </div>
  );

  return (
    <div className="screen" style={{ position: 'relative' }}>
      {/* T-52 — leaf decoration top-right */}
      <Leaf size={120} color="var(--sage-light)" style={{ top: -10, right: -30, opacity: 0.3 }} rotate={18} />
      <Blob size={220} color="var(--mint-mist)" style={{ bottom: 100, right: -100, opacity: 0.22 }} animate />

      {/* T-52 — header avatar block as card-warm with butter→mint gradient */}
      <div className="card-warm fade-up" style={{
        marginBottom: 24,
        padding: 18,
        background: 'linear-gradient(135deg, var(--butter) 0%, var(--mint-mist) 100%)',
        borderRadius: 'var(--radius-lg)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(43,78,60,0.12)' }} className="breathe">
            <Sprig size={36} />
          </div>
          <div>
            <h1 className="display-sm">Your space</h1>
            <div className="caption" style={{ color: 'var(--ink-2)' }}>Member since April 2026</div>
          </div>
        </div>
        {tags.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {tags.map(t => (
              <span key={t} className="badge" style={{ background: 'rgba(255,255,255,0.55)', color: 'var(--eucalyptus-deep)' }}>{t}</span>
            ))}
          </div>
        )}
      </div>

      <Group title="My data" titleIcon={Icon.Database} cardClass="card-mint" idx={1}>
        <Row label="Conditions tracked" right={<span className="caption">{(state.conditions || []).join(' · ')}</span>} onClick={() => {}} />
        <Row label="Cycle settings" right={<span className="caption">{state.cycleLen} day cycle</span>} />
        <Row label="Lab vault" right={<span className="caption">Testosterone · SHBG · AMH · 11 more</span>} />
        <Row label="Medication & response" right={<span className="caption">2 active · cycle-aware</span>} />
        <Row label="Export my data" right={<span className="caption">JSON · CSV · PDF report</span>} />
        <div className="setting-row" style={{ opacity: edSafe ? 0.5 : 1 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 500 }}>Weight tracker (optional)</div>
            <div className="caption" style={{ fontSize: 11, marginTop: 2 }}>
              {edSafe ? 'You opted out of weight-related tracking at onboarding.' : 'Hidden by default. Opt in if useful.'}
            </div>
          </div>
          <div className={`switch ${weightOpt ? 'on' : ''}`}
            onClick={edSafe ? null : toggleWeightOpt}
            style={{ cursor: edSafe ? 'not-allowed' : 'pointer' }} />
        </div>
        <div className="setting-row">
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 500 }}>Food/body sensitive mode</div>
            <div className="caption" style={{ fontSize: 11, marginTop: 2 }}>Hides voice-diet logging and weight tracker.</div>
          </div>
          <div className={`switch ${edSafe ? 'on' : ''}`} onClick={toggleEdSafe} />
        </div>
        {/* T-85 — Pause cycle tracking row */}
        {!state.cyclePaused && !state.generalOnly && (
          <Row
            label="Pause cycle tracking (pregnancy or other)"
            right={<span className="text-link">Pause</span>}
            onClick={() => setShowPauseModal(true)}
          />
        )}
        {(state.cyclePaused || state.generalOnly) && (
          <div className="setting-row">
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 500 }}>{state.cyclePaused ? 'Cycle tracking paused' : 'General health logging only'}</div>
              <div className="caption" style={{ fontSize: 11, marginTop: 2 }}>Resume any time — your data is here.</div>
            </div>
            <button className="text-link" onClick={resumeCycle}>Resume</button>
          </div>
        )}
        {/* T-91 — Passive mode toggle */}
        <div className="setting-row">
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 500 }}>Show me data without questions today</div>
            <div className="caption" style={{ fontSize: 11, marginTop: 2 }}>Quiets prompts and share-actions for 24 hours.</div>
          </div>
          <div className={`switch ${passiveActive ? 'on' : ''}`} onClick={togglePassive} />
        </div>
      </Group>

      {/* T-86 — Account group: Email · Subscription · Restore · Sign out */}
      <Group title="Account" titleIcon={Icon.Users} cardClass="card" idx={6}>
        <Row label="Email" right={<span className="caption">{state.email || 'No email saved'}</span>} />
        <Row label="Subscription tier" right={<span className="caption">Free trial · 14 days remaining</span>} />
        <Row label="Restore purchases" right={<span className="text-link">Restore</span>} onClick={() => {}} />
        <Row label="Sign out" right={<span className="text-link" style={{ color: 'var(--danger)' }}>Sign out</span>} onClick={() => setShowSignOut(true)} danger />
      </Group>

      {!state.accountCreated && (
        <div className="fade-up" style={{ marginBottom: 28, animationDelay: '120ms' }}>
          <div className="eyebrow" style={{ marginBottom: 10 }}>OPTIONAL</div>
          <div className="card-warm stripe-sage" style={{ padding: 18 }}>
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>Save your data to the cloud</div>
            <div className="caption" style={{ fontSize: 12, marginBottom: 12 }}>
              Your data lives on this device. Add an account if you want to back it up or use it on another phone. End-to-end encrypted.
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-soft" style={{ flex: 1 }} onClick={() => setState(s => ({ ...s, accountCreated: true }))}>Create account</button>
              <button className="btn-ghost" style={{ flex: 1, fontSize: 13 }} onClick={() => setState(s => ({ ...s, cloudSaveOffered: true }))}>Not now</button>
            </div>
          </div>
        </div>
      )}

      <Group title="Ora" titleIcon={Icon.Sparkle} cardClass="card-warm" idx={2}>
        <Row label="Ora is" right={<div className={`switch ${state.oraEnabled !== false ? 'on' : ''}`} onClick={() => setState(s => ({ ...s, oraEnabled: s.oraEnabled === false ? true : false }))} />} />
        <Row label="What does Ora use?" right={<span className="text-link">Learn</span>} />
        <div className="setting-row">
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 500 }}>Delete Ora's session</div>
            <div className="caption" style={{ fontSize: 11, marginTop: 2 }}>Wipes what I've been holding in conversation. Your logs and charts stay.</div>
          </div>
          <span className="text-link">Delete</span>
        </div>
      </Group>

      {/* T-52 — Privacy is the brand promise: card-warm + sage left stripe */}
      <Group title="Privacy" titleIcon={Icon.Lock} cardClass="card-warm" extraClass="stripe-sage" idx={3}>
        <Row label="Delete all data" right={<span className="text-link" style={{ color: 'var(--danger)' }}>Delete</span>} onClick={() => setConfirmDelete(true)} danger />
        <Row label="Privacy policy" right={<span className="text-link">Read</span>} />
        <Row label="About your data" right={<span className="text-link">Read</span>} onClick={() => setShowAbout(true)} />
      </Group>

      <Group title="Appearance" titleIcon={Icon.Eye} cardClass="card" idx={4}>
        <Row label="Dark mode" right={<div className={`switch ${theme === 'dark' ? 'on' : ''}`} onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />} />
        <Row label="Text size" right={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="range" min="14" max="20" value={textSize} onChange={e => setTextSize(+e.target.value)} style={{ width: 80 }} />
            <span className="data" style={{ fontSize: 12 }}>{textSize}px</span>
          </div>
        } />
        <Row label="Reduce motion" right={<div className={`switch ${reduceMotion ? 'on' : ''}`} onClick={() => setReduceMotion(!reduceMotion)} />} />
        <div className="setting-row">
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 15, fontWeight: 500 }}>Brain Fog Mode</div>
            <div className="caption" style={{ fontSize: 11, marginTop: 2 }}>Hides Tools / Ora / Calendar tabs. Increases font and tap targets. For your hardest days.</div>
          </div>
          <div className={`switch ${state.brainFogMode ? 'on' : ''}`} onClick={toggleBrainFog} />
        </div>
      </Group>

      <Group title="About" titleIcon={Icon.Info} cardClass="card" idx={5}>
        <Row label="Clinical methodology" right={<span className="text-link">Read</span>} />
        <Row label="Advisor team" right={<span className="text-link">View</span>} />
        <Row label="Version" right={<span className="caption">1.0.0 · build 248</span>} />
      </Group>

      {showAbout && (
        <div className="modal-backdrop" onClick={() => setShowAbout(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="display-sm" style={{ marginBottom: 14 }}>About your data</h2>
            <p className="body" style={{ marginBottom: 12 }}>Logs live on your device first and sync to encrypted servers under your account only. We never sell, share, or use your health data for ads.</p>
            <p className="body" style={{ marginBottom: 12 }}>Ora insights use only the symptom and cycle data you've logged — never your name, email, or location.</p>
            <p className="body" style={{ marginBottom: 18 }}>Export everything at any time. Delete it within 30 days of request.</p>
            <button className="btn-outline" style={{ width: '100%' }} onClick={() => setShowAbout(false)}>Close</button>
          </div>
        </div>
      )}

      {confirmDelete && (
        <div className="modal-backdrop" onClick={() => setConfirmDelete(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="display-sm" style={{ marginBottom: 12 }}>Delete all data?</h2>
            <p className="body" style={{ marginBottom: 22 }}>This permanently removes every log, chart, and report. We cannot recover it.</p>
            {/* T-51 — danger token used here, not severity */}
            <button className="btn-primary" style={{ background: 'var(--danger)', boxShadow: '0 4px 14px rgba(185,84,70,0.35)' }} onClick={() => {
              if (window.confirm('This will delete all your tracking data permanently. Continue?')) {
                try {
                  localStorage.removeItem('hq-state');
                  localStorage.removeItem('hq-theme');
                  localStorage.removeItem('hq-route');
                  Object.keys(localStorage)
                    .filter(k => k.startsWith('crisisShown_') || k.startsWith('endometrialAcknowledged_') || k.startsWith('headsUpCollapsed_'))
                    .forEach(k => localStorage.removeItem(k));
                  try { sessionStorage.removeItem('onboarding-state'); } catch {}
                } catch {}
                window.location.reload();
              }
              setConfirmDelete(false);
            }}>Delete everything</button>
            <button className="btn-outline" style={{ marginTop: 8, width: '100%' }} onClick={() => setConfirmDelete(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* T-85 — Pause cycle modal in Ora's voice */}
      {showPauseModal && (
        <div className="modal-backdrop" onClick={() => setShowPauseModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="ora-label" style={{ marginBottom: 8 }}>
              <span className="italic-display" style={{ fontSize: 14, marginRight: 4, textTransform: 'none', letterSpacing: 0, color: 'var(--eucalyptus)' }}>O</span>
              ORA
            </div>
            <p className="body" style={{ marginBottom: 18 }}>
              Got it. I'm setting your data aside, not deleting it — it'll be here when you want it. I'll stop logging cycle stuff. If you ever want to come back, just flip this switch.
            </p>
            <button className="btn-primary" style={{ marginBottom: 8 }} onClick={archivePause}>
              Archive + pause cycle features
            </button>
            <button className="btn-outline" style={{ width: '100%', marginBottom: 8 }} onClick={generalOnlyPath}>
              Continue logging general health
            </button>
            <button className="btn-ghost" style={{ width: '100%', fontSize: 13 }} onClick={() => setShowPauseModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* T-86 — Sign out confirmation modal */}
      {showSignOut && (
        <div className="modal-backdrop" onClick={() => setShowSignOut(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2 className="display-sm" style={{ marginBottom: 12 }}>Are you sure?</h2>
            <p className="body" style={{ marginBottom: 22 }}>You'll need to sign in to access your data on another device.</p>
            <button className="btn-primary" style={{ background: 'var(--danger)', boxShadow: '0 4px 14px rgba(185,84,70,0.35)' }} onClick={() => setShowSignOut(false)}>Sign out</button>
            <button className="btn-outline" style={{ marginTop: 8, width: '100%' }} onClick={() => setShowSignOut(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

window.ProfileScreen = ProfileScreen;
