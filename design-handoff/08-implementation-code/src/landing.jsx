function Landing() {
  const { Logo, Sprig, Leaf, Icon, useApp, CycleRing } = window.HQ;
  const { goto, setMode, setState } = useApp();
  const [email, setEmail] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  // T-87 — track which FAQ items have entered viewport for stagger fade-up
  const faqRefs = React.useRef([]);
  const [faqVisible, setFaqVisible] = React.useState({});

  React.useEffect(() => { setMode('landing'); return () => setMode('app'); }, []);

  // T-90 — read ?condition= from URL on mount and pre-select
  React.useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const cond = params.get('condition');
      if (cond) {
        setState && setState(s => ({ ...s, preselectedCondition: cond }));
      }
    } catch {}
  }, []);

  // T-87 — IntersectionObserver to add fade-up class to FAQ items as they scroll into view
  React.useEffect(() => {
    const els = faqRefs.current.filter(Boolean);
    if (!els.length || typeof IntersectionObserver === 'undefined') return;
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = +entry.target.dataset.idx;
          setFaqVisible(v => ({ ...v, [idx]: true }));
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const startWith = (cond) => {
    setState && setState(s => ({ ...s, preselectedCondition: cond }));
    goto('onboarding');
  };

  const conditions = [
    { name: 'PMDD', desc: 'For the half of every month you disappear. We track it on the DRSP — the scale your psychiatrist already trusts.', emoji: '🌗' },
    { name: 'PCOS', desc: 'Cycles 21–120 days are normal here. Lab values, androgen symptoms, insulin patterns — not just your period.', emoji: '🌀' },
    { name: 'Perimenopause', desc: 'Greene Scale scoring, hot flash timing, HRT effectiveness. Including premature onset before 40.', emoji: '🌾' },
    { name: 'ADHD overlap', desc: '46% of women with ADHD also have PMDD. We track how your meds work across your cycle.', emoji: '🌟' },
    { name: "Endometriosis & more", desc: 'Many of you carry more than one condition. We don\u2019t make you start over for each.', emoji: '🌺' },
  ];

  const faqs = [
    { q: 'Is this just another period tracker?', a: 'No. We implement the DRSP for PMDD, the Greene Climacteric Scale for perimenopause, and Rotterdam Criteria phenotyping for PCOS. We generate the clinical documentation your doctor needs. Period prediction is a side effect — never the product.' },
    { q: 'My cycles are 60+ days. Will the app freak out?', a: 'No. We never display "overdue." We never assume 28 days. PCOS cycles, perimenopause irregularity, and post-pill recovery are all first-class citizens here — not edge cases.' },
    { q: "I'm 33 and in early menopause. Does this work for me?", a: 'Yes. Premature ovarian insufficiency and early perimenopause are explicitly supported. We do not group you with women 20 years older. Your experience is categorically different and the app reflects that.' },
    { q: "I've tracked for 11 years in spreadsheets. Will this talk down to me?", a: 'No. There is a power-user mode with raw data export, custom symptom fields, and lab value tracking with PCOS-specific reference ranges. We respect that you know your body better than any provider you have seen.' },
    { q: 'Do I need a diagnosis to use it?', a: 'Not at all. Many users are tracking precisely because they are trying to get one. The chart you build is the document many clinicians use to make that diagnosis. Average PMDD diagnostic delay is 12 years. We exist to shorten it.' },
    { q: 'What happens to my health data?', a: 'It lives on your device first. End-to-end encrypted if you sync. No Meta SDK. No Google Analytics SDK. We will never sell or share it. We minimize what we store on our servers; sensitive data is encrypted client-side.' },
  ];

  return (
    <div className="landing">
      {/* Decorative blobs */}
      <div style={{ position: 'absolute', top: -100, right: -120, width: 380, height: 380, borderRadius: '50%', background: 'var(--mint-mist)', filter: 'blur(60px)', opacity: 0.7, zIndex: 0 }} className="drift" />
      <div style={{ position: 'absolute', top: 280, left: -160, width: 320, height: 320, borderRadius: '50%', background: 'var(--butter)', filter: 'blur(70px)', opacity: 0.5, zIndex: 0 }} className="drift" />

      {/* Top */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 56, position: 'relative', zIndex: 1, gap: 12 }}>
        <Logo size={18} />
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexShrink: 0 }}>
          <a className="text-link hide-narrow" style={{ fontSize: 14 }} href="#about">How it works</a>
          <button className="btn-soft" style={{ height: 40 }} onClick={() => goto('onboarding')}>Open the app →</button>
        </div>
      </div>

      {/* Hero */}
      <div className="landing-hero" style={{ position: 'relative', zIndex: 1 }}>
        <div className="fade-up">
          <span className="badge" style={{ marginBottom: 22 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--eucalyptus)' }} className="breathe" />
            For women who already knew
          </span>
          <h1 className="display-xl">You already knew. <em className="italic-display" style={{ color: 'var(--eucalyptus)' }}>Now your doctor will too.</em></h1>
          <p className="body-l" style={{ marginTop: 24, maxWidth: 540 }}>
            The average woman with PMDD waits 12 years and sees 6 providers before diagnosis. Most are told it’s anxiety, stress, or to just lose weight. HormonaIQ turns what you already feel into the clinical chart your doctor can’t dismiss.
          </p>
          <div style={{ marginTop: 32, display: 'flex', gap: 12, flexWrap: 'wrap', maxWidth: 460 }}>
            <button className="btn-primary" style={{ flex: '1 1 220px' }} onClick={() => goto('onboarding')}>
              Join the waitlist <Icon.ChevRight width="18" height="18" />
            </button>
            <button className="btn-outline" style={{ flex: '0 1 auto' }} onClick={() => { const el = document.getElementById('how'); if (el) window.scrollTo({ top: el.offsetTop - 24, behavior: 'smooth' }); }}>See how it works</button>
          </div>
          <div style={{ marginTop: 18, fontSize: 13, color: 'var(--ink-3)' }}>
            <span>Reviewed by clinicians who treat PMDD, PCOS, and perimenopause</span>
          </div>
        </div>

        {/* Hero visual */}
        <div className="hero-visual" style={{ minHeight: 480 }}>
          <Leaf size={140} color="rgba(63,111,90,0.4)" style={{ top: 20, right: 24 }} rotate={-15} />
          <Leaf size={90} color="rgba(63,111,90,0.5)" style={{ bottom: 32, left: 28 }} rotate={120} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <div className="float">
              <CycleRing cycleDay={19} cycleLen={28} size={280} />
            </div>
            <div style={{ marginTop: 24, padding: '12px 18px', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(10px)', borderRadius: 999, fontSize: 13, fontFamily: 'var(--display)', fontStyle: 'italic', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              "that makes sense."
            </div>
          </div>
        </div>
      </div>

      {/* Promise strip */}
      <div id="how" style={{ marginTop: 96, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, position: 'relative', zIndex: 1 }}>
        {[
          { icon: '🌿', title: 'Clinical scales, not vibes', body: 'DRSP for PMDD. Greene Scale for perimenopause. Rotterdam phenotyping for PCOS. Mapped to what your doctor uses.' },
          { icon: '🌼', title: 'Adult language, every page', body: 'No euphemisms. No "flow days." No emoji-only mood pickers. We talk to you like the expert on your own body.' },
          { icon: '🌳', title: 'Device-first, never sold', body: 'Your data stays on your phone. End-to-end encrypted if you sync. No advertising SDKs. Period.' },
        ].map((c, i) => (
          <div key={i} className="card-warm" style={{ padding: 22, animationDelay: `${i * 0.1}s` }}>
            <div style={{ fontSize: 28 }}>{c.icon}</div>
            <div className="h2" style={{ marginTop: 10 }}>{c.title}</div>
            <div className="body" style={{ color: 'var(--ink-2)', marginTop: 6 }}>{c.body}</div>
          </div>
        ))}
      </div>

      {/* Conditions */}
      <h2 className="display" style={{ marginTop: 120, marginBottom: 28, position: 'relative', zIndex: 1 }}>
        Five conditions. <em className="italic-display" style={{ color: 'var(--eucalyptus)' }}>One gentle home.</em>
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14, position: 'relative', zIndex: 1 }}>
        {conditions.map(c => (
          <div key={c.name} className="card" style={{ padding: 22, transition: 'all 0.3s', cursor: 'pointer', display: 'flex', flexDirection: 'column' }}
            onClick={() => startWith(c.name)}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}>
            <div style={{ fontSize: 26, marginBottom: 8 }}>{c.emoji}</div>
            <div className="h2" style={{ marginBottom: 6 }}>{c.name}</div>
            <div className="body" style={{ color: 'var(--ink-2)', flex: 1 }}>{c.desc}</div>
            {/* T-90 — per-card sub-CTA "Built for X →" */}
            <button
              onClick={(e) => { e.stopPropagation(); startWith(c.name); }}
              className="text-link"
              style={{ marginTop: 14, alignSelf: 'flex-start', fontSize: 13, background: 'none', border: 'none', padding: 0 }}
            >
              Built for {c.name} →
            </button>
          </div>
        ))}
      </div>

      {/* Email capture */}
      <div style={{ marginTop: 120, position: 'relative', zIndex: 1 }}>
        <div className="card-mint" style={{ padding: 'clamp(28px, 5vw, 56px)', borderRadius: 'var(--radius-xl)', position: 'relative', overflow: 'hidden' }}>
          <Leaf size={180} color="rgba(63,111,90,0.18)" style={{ top: -30, right: -40 }} rotate={-30} />
          <div style={{ maxWidth: 560, position: 'relative' }}>
            <h2 className="display" style={{ marginBottom: 12 }}>
              Join the <em className="italic-display">waitlist.</em>
            </h2>
            <p className="body-l" style={{ marginBottom: 24 }}>An invitation arrives when your module opens. We don't send anything else — promise.</p>
            {submitted ? (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 16, background: 'var(--paper)', borderRadius: 'var(--radius-md)' }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--eucalyptus)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon.Check width="20" height="20" />
                </div>
                <div>
                  <div style={{ fontWeight: 600 }}>You're on the list.</div>
                  <div className="caption">Watch for your invitation.</div>
                </div>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (email) setSubmitted(true); }} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <input type="email" placeholder="you@email.com" value={email} onChange={e => setEmail(e.target.value)} required style={{ flex: '1 1 240px' }} />
                <button className="btn-primary" type="submit" style={{ flex: '0 0 auto', width: 180 }}>Count me in</button>
              </form>
            )}
            <div className="caption" style={{ marginTop: 12 }}>No spam, no sharing. Unsubscribe anytime.</div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ marginTop: 100, maxWidth: 760, position: 'relative', zIndex: 1 }}>
        <h2 className="display" style={{ marginBottom: 20 }}>
          Common <em className="italic-display">questions.</em>
        </h2>
        {faqs.map((f, i) => (
          <details
            key={i}
            className={`faq-item ${faqVisible[i] ? 'fade-up' : ''}`}
            ref={el => faqRefs.current[i] = el}
            data-idx={i}
            style={{
              opacity: faqVisible[i] ? 1 : 0,
              animationDelay: faqVisible[i] ? `${i * 60}ms` : '0ms',
            }}
          >
            <summary>
              <span className="h2">{f.q}</span>
              <span className="chev"><Icon.ChevDown width="22" height="22" /></span>
            </summary>
            <div className="faq-answer">
              <div className="body" style={{ padding: '14px 0 22px', color: 'var(--ink-2)' }}>{f.a}</div>
            </div>
          </details>
        ))}
      </div>

      <div style={{ marginTop: 100, paddingTop: 32, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <Logo size={14} />
        <div className="caption">© 2026 HormonaIQ · Reviewed by clinicians · Not a substitute for medical care</div>
      </div>
    </div>
  );
}

window.Landing = Landing;
