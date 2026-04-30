// Crisis service — three-tier crisis surface system (T-06, T-07, T-08)
// Anti-fatigue: localStorage flag `crisisShown_{phase}_{date}` — never re-show Tier 3 within 48h for same active luteal phase
(function () {
  const { Icon } = window.HQ;

  // DRSP item key for suicidal ideation (DRSP item 12 — T-05)
  // Wave-2 fix: SI_KEY is the data key used in entry.drsp / entry.suicidal_ideation.
  const SI_KEY = 'suicidal_ideation';
  const SI_LABEL = 'Thoughts that life isn\'t worth living';

  // Returns true if entry has any DRSP item ≥ threshold
  function anyAtOrAbove(entry, threshold) {
    if (!entry || !entry.drsp) return false;
    return Object.values(entry.drsp).some(v => typeof v === 'number' && v >= threshold);
  }

  // Get last N days of entries (sorted descending by date, most recent first)
  function lastNEntries(entries, n) {
    if (!entries) return [];
    const keys = Object.keys(entries).sort().reverse();
    return keys.slice(0, n).map(k => ({ date: k, entry: entries[k] }));
  }

  // Today's date in YYYY-MM-DD
  function todayKey() {
    return new Date().toISOString().slice(0, 10);
  }

  // assessCrisisTier(entries, opts?) → 'none' | 'tier1' | 'tier2' | 'tier3'
  // tier3 if: 3 consecutive days of any DRSP item ≥5/5 OR DRSP item 12 (SI) ≥4 OR explicit "I'm not okay" tap
  // tier2 if: today's entry has any DRSP ≥5
  // tier1 if: any DRSP item ≥4 today (passive acknowledgment)
  function assessCrisisTier(entries, opts) {
    opts = opts || {};
    if (opts.explicitNotOkay) return 'tier3';
    if (!entries) return 'none';

    const today = entries[todayKey()];

    // Tier 3 — SI ≥4 today (check both top-level and drsp.suicidal_ideation)
    if (today && today.suicidal_ideation && today.suicidal_ideation >= 4) return 'tier3';
    if (today && today.drsp && today.drsp[SI_KEY] && today.drsp[SI_KEY] >= 4) return 'tier3';
    if (today && today.drsp && today.drsp.suicidal_ideation && today.drsp.suicidal_ideation >= 4) return 'tier3';

    // Tier 3 — 3 consecutive days of any DRSP item ≥ 5
    const last3 = lastNEntries(entries, 3);
    if (last3.length === 3) {
      const allSevere = last3.every(({ entry }) => anyAtOrAbove(entry, 5));
      // also check the dates are actually consecutive
      if (allSevere) {
        const d0 = new Date(last3[0].date);
        const d2 = new Date(last3[2].date);
        const gap = Math.round((d0 - d2) / 86400000);
        if (gap === 2) return 'tier3';
      }
    }

    // Tier 2 — today has any DRSP ≥ 5
    if (today && anyAtOrAbove(today, 5)) return 'tier2';

    // Tier 1 — today has any DRSP ≥ 4
    if (today && anyAtOrAbove(today, 4)) return 'tier1';

    return 'none';
  }

  // Anti-fatigue check for Tier 3 — don't re-show within 48h for same luteal phase
  function shouldShowTier3(phase) {
    try {
      const today = todayKey();
      const k = `crisisShown_${phase}_${today}`;
      if (localStorage.getItem(k)) return false;
      // Also check last 48h of any tier3 shown for same phase
      const allKeys = Object.keys(localStorage).filter(x => x.startsWith(`crisisShown_${phase}_`));
      for (const key of allKeys) {
        const dateStr = key.split('_').slice(2).join('_');
        const d = new Date(dateStr);
        const hours = (Date.now() - d.getTime()) / 3600000;
        if (hours < 48) return false;
      }
      return true;
    } catch { return true; }
  }

  function markTier3Shown(phase) {
    try {
      localStorage.setItem(`crisisShown_${phase}_${todayKey()}`, '1');
    } catch {}
  }

  // Wave-2 fix: anti-fatigue for Tier 2 — mirror Tier 3 logic, 48h within same phase
  function shouldShowTier2(phase) {
    try {
      const today = todayKey();
      const k = `crisisT2Shown_${phase}_${today}`;
      if (localStorage.getItem(k)) return false;
      const allKeys = Object.keys(localStorage).filter(x => x.startsWith(`crisisT2Shown_${phase}_`));
      for (const key of allKeys) {
        const dateStr = key.split('_').slice(2).join('_');
        const d = new Date(dateStr);
        const hours = (Date.now() - d.getTime()) / 3600000;
        if (hours < 48) return false;
      }
      return true;
    } catch { return true; }
  }
  function markTier2Shown(phase) {
    try {
      localStorage.setItem(`crisisT2Shown_${phase}_${todayKey()}`, '1');
    } catch {}
  }

  // Resources — order: lowest barrier first (text → peer support → phone → international)
  // T-31 — Adult resource set (default)
  const ADULT_RESOURCES = [
    {
      label: 'Crisis Text Line',
      detail: 'Text HOME to 741741',
      href: 'sms:741741?body=HOME',
    },
    {
      label: 'IAPMD Peer Support',
      detail: 'iapmd.org/support',
      href: 'https://iapmd.org/support',
    },
    {
      label: '988 Suicide & Crisis Lifeline',
      detail: 'Call or text 988',
      href: 'tel:988',
    },
    {
      label: "Find your country's line",
      detail: 'findahelpline.com',
      href: 'https://findahelpline.com',
    },
  ];

  // T-31 — Teen resource set (verifiedMinor === true, ages 16-17, or pending_consent)
  const TEEN_RESOURCES = [
    {
      label: 'Crisis Text Line (teen)',
      detail: 'Text HOME to 741741',
      href: 'sms:741741?body=HOME',
    },
    {
      label: 'Teen Line',
      detail: '1-800-852-8336 · 6pm-10pm PT',
      href: 'tel:18008528336',
    },
    {
      label: 'The Trevor Project',
      detail: 'Text START to 678-678',
      href: 'sms:678678?body=START',
    },
    {
      label: "Find your country's line",
      detail: 'findahelpline.com',
      href: 'https://findahelpline.com',
    },
  ];

  // T-31 — Function form: returns the appropriate set based on age/verifiedMinor
  function getResources(opts) {
    opts = opts || {};
    const isMinor = opts.verifiedMinor === true || opts.verifiedMinor === 'pending_consent';
    return isMinor ? TEEN_RESOURCES : ADULT_RESOURCES;
  }

  // Back-compat default (uses adult set when no opts available)
  const RESOURCES = ADULT_RESOURCES;

  function ResourceList({ tone, verifiedMinor }) {
    const resources = getResources({ verifiedMinor });
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {resources.map(r => (
          <a key={r.label} href={r.href} target="_blank" rel="noopener noreferrer"
            style={{
              textDecoration: 'none',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              padding: '14px 16px',
              background: tone === 'tier3' ? 'var(--paper)' : 'rgba(255,255,255,0.7)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--ink)',
            }}>
            <span style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{r.label}</span>
              <span style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 2 }}>{r.detail}</span>
            </span>
            <Icon.ChevRight width="18" height="18" stroke="var(--ink-3)" />
          </a>
        ))}
      </div>
    );
  }

  // Tier 3 — full screen modal, with pre-question gating before resources
  function Tier3Surface({ onClose, verifiedMinor }) {
    const [stage, setStage] = React.useState('pre'); // 'pre' | 'resources'
    const [answer, setAnswer] = React.useState(null);

    const handleAnswer = (which) => {
      setAnswer(which);
      setStage('resources');
    };

    return (
      <div className="modal-backdrop" style={{ background: 'rgba(27,46,37,0.7)' }}>
        <div className="modal" style={{
          background: 'var(--cream-warm)',
          maxWidth: 460,
          padding: 28,
        }}>
          <div className="eyebrow" style={{ color: 'var(--rose)', marginBottom: 12 }}>A pause for you</div>
          {stage === 'pre' && (
            <>
              <div className="display-sm" style={{ marginBottom: 16 }}>
                When you say "extreme" — is that…
              </div>
              <p className="body" style={{ marginBottom: 22, color: 'var(--ink-2)' }}>
                We want to understand before pointing you somewhere. There's no wrong answer here.
              </p>
              <button className="feel-btn" style={{ marginBottom: 10 }} onClick={() => handleAnswer('hurts')}>
                <span style={{ flex: 1 }}>This hurts and I need it to be over</span>
              </button>
              <button className="feel-btn" style={{ marginBottom: 18 }} onClick={() => handleAnswer('hurting')}>
                <span style={{ flex: 1 }}>I'm thinking about hurting myself</span>
              </button>
              <button className="btn-outline" style={{ width: '100%' }} onClick={onClose}>Close</button>
            </>
          )}
          {stage === 'resources' && (
            <>
              <div className="display-sm" style={{ marginBottom: 14 }}>
                You've been logging some really heavy days.
              </div>
              <p className="body" style={{ marginBottom: 20, color: 'var(--ink-2)' }}>
                That's real, and it matters. If things feel overwhelming right now, support is available — you don't have to get through this alone.
              </p>
              <ResourceList tone="tier3" verifiedMinor={verifiedMinor} />
              <button className="btn-primary" style={{ marginTop: 22, background: 'var(--sage)', color: 'var(--ink)' }} onClick={onClose}>Close</button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Tier 2 — bottom sheet, dismissible by tap-outside, calmer voice
  function Tier2Surface({ onClose, verifiedMinor }) {
    return (
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(27,46,37,0.35)',
          zIndex: 100,
          display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          backdropFilter: 'blur(4px)',
          animation: 'fade-up 0.25s ease-out',
        }}>
        <div
          onClick={e => e.stopPropagation()}
          style={{
            width: '100%', maxWidth: 460,
            background: 'var(--surface)',
            borderTopLeftRadius: 28, borderTopRightRadius: 28,
            padding: '24px 22px 28px',
            boxShadow: 'var(--shadow-lg)',
            animation: 'fade-up 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
          }}>
          <div style={{ width: 40, height: 4, background: 'var(--border-strong)', borderRadius: 2, margin: '0 auto 18px' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--coral-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Icon.Heart width="20" height="20" />
            </div>
            <div className="h3">Today's been a heavy one.</div>
          </div>
          <p className="body" style={{ color: 'var(--ink-2)', marginBottom: 18, fontSize: 14 }}>
            No pressure to use any of these. They're here in case you want them.
          </p>
          <ResourceList tone="tier2" verifiedMinor={verifiedMinor} />
          <button className="btn-ghost" style={{ marginTop: 18, width: '100%', textAlign: 'center' }} onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  // Tier 1 — small inline card on home (not modal)
  function Tier1Surface({ onOpenTier2 }) {
    return (
      <div className="card-warm" style={{ marginBottom: 14, padding: 14, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Icon.Heart width="18" height="18" style={{ color: 'var(--rose)', flexShrink: 0 }} />
        <div style={{ flex: 1, fontSize: 13, color: 'var(--ink-2)' }}>
          Logged. This is real. <button className="text-link" onClick={onOpenTier2} style={{ background: 'none', border: 'none', padding: 0, fontSize: 13 }}>Support is one tap away.</button>
        </div>
      </div>
    );
  }

  // <CrisisCard tier onClose /> — top-level renderer
  function CrisisCard({ tier, onClose, onOpenTier2, verifiedMinor }) {
    if (tier === 'tier3') return <Tier3Surface onClose={onClose} verifiedMinor={verifiedMinor} />;
    if (tier === 'tier2') return <Tier2Surface onClose={onClose} verifiedMinor={verifiedMinor} />;
    if (tier === 'tier1') return <Tier1Surface onOpenTier2={onOpenTier2} />;
    return null;
  }

  // R7 — F88 Postmenopausal bleeding (AUB) safety rule
  // Returns 'critical' if user has logged any bleeding after ≥365-day amenorrhea AND not yet acknowledged.
  function assessAUBRule(state) {
    if (!state) return null;
    const spotting = state.spottingLog || {};
    const dates = Object.keys(spotting).sort().reverse();
    if (dates.length === 0) return null;
    const latest = spotting[dates[0]];
    if (!latest || latest.dischargedWithDoctor) return null;
    if (typeof latest.postmenopausalGap === 'number' && latest.postmenopausalGap >= 365) {
      return {
        ruleId: 'F88_AUB',
        severity: 'critical',
        title: 'Bleeding after a year without periods.',
        body: 'Bleeding after 12+ months without a period can be a sign of endometrial issues that need evaluation. Please see your doctor this week.',
        actions: [
          { id: 'will_book', label: 'I will book this week', resolves: false },
          { id: 'discussed', label: "I've already discussed this with my doctor", resolves: true },
        ],
        nonDismissible: true,
      };
    }
    return null;
  }

  // R7 — F108 Endometriosis DIE (Deep Infiltrating Endometriosis) red-flag rules.
  // Each rule returns a finding object or null. detectCyclical / detectPersistent / detectNSAID helpers below.
  const ENDO_SAFETY_RULES = [
    {
      id: 'DIE_RECTAL_BLEEDING',
      label: 'Cyclical rectal bleeding',
      severity: 'high',
      message: 'Rectal bleeding clustering with your period across 2+ cycles can be a sign of bowel-wall endometriosis (DIE). Bring this pattern to your provider — colorectal evaluation may be warranted.',
    },
    {
      id: 'DIE_HEMATURIA',
      label: 'Cyclical urinary bleeding / dysuria',
      severity: 'high',
      message: 'Painful urination with blood in urine, clustering with your period across 2+ cycles, can be a sign of bladder endometriosis. Bring this pattern to your provider.',
    },
    {
      id: 'DIE_SHOULDER_PAIN',
      label: 'Cyclical right shoulder/diaphragm pain',
      severity: 'high',
      message: 'Right shoulder or upper-abdomen pain that clusters with your period (especially with breathing) can be a sign of thoracic endometriosis. This is rare but worth raising — your provider may order chest imaging.',
    },
    {
      id: 'DIE_FLANK_PAIN',
      label: 'Cyclical flank or lower-back pain',
      severity: 'high',
      message: 'Flank or lower-back pain that clusters with your period across 2+ cycles can be a sign of ureteral endometriosis. Silent kidney damage is possible — this warrants imaging.',
    },
    {
      id: 'PHQ9_ITEM9_SI',
      label: 'PHQ-9 item 9: thoughts of hurting yourself',
      severity: 'critical',
      message: 'You indicated thoughts of hurting yourself or being better off dead. Support is available right now — you don\'t have to figure this out alone.',
    },
    {
      id: 'PHQ9_SEVERE',
      label: 'PHQ-9 ≥15 (moderately-severe to severe depression)',
      severity: 'high',
      message: 'Your PHQ-9 score is in the moderately-severe to severe range. This is treatable. Talk to your provider — depression is part of the picture for many people with chronic pelvic pain.',
    },
    {
      id: 'PHQ9_MODERATE',
      label: 'PHQ-9 10–14 (moderate depression)',
      severity: 'moderate',
      message: 'Your PHQ-9 score suggests moderate depression. Consider discussing this with your provider as part of your overall care plan.',
    },
    {
      id: 'PAIN_PERSISTENT_SEVERE',
      label: 'Pain ≥8/10 for 7+ consecutive days',
      severity: 'high',
      message: 'Your pain has been severe (≥8/10) for a full week. This is not "just a flare." Reach out to your provider — escalation care may be needed.',
    },
    {
      id: 'PBAC_VERY_HEAVY',
      label: 'Very heavy bleeding (PBAC >150)',
      severity: 'high',
      message: 'Your bleeding score this cycle is very high. Heavy menstrual bleeding can lead to anemia and warrants iron-status testing + a discussion with your provider about hormonal management.',
    },
  ];

  // Helpers to detect patterns from state
  function detectCyclicalPattern(logEntries, predicate, minCycles, cycleLen) {
    // logEntries: dict of date → entry. predicate: (entry) => bool. minCycles: number.
    if (!logEntries) return false;
    const dates = Object.keys(logEntries).sort().reverse();
    const matches = dates.filter(d => predicate(logEntries[d]));
    if (matches.length < minCycles) return false;
    // Group by approximate cycle phase. For simplicity: count unique cycle indices where matches occurred
    const cycleSet = new Set();
    matches.forEach(d => {
      const day = (Math.floor(new Date(d).getTime() / 86400000));
      const cycleIdx = Math.floor(day / (cycleLen || 28));
      cycleSet.add(cycleIdx);
    });
    return cycleSet.size >= minCycles;
  }

  function detectPersistentSeverity(entries, key, threshold, consecutiveDays) {
    if (!entries) return false;
    const dates = Object.keys(entries).sort().reverse().slice(0, consecutiveDays);
    if (dates.length < consecutiveDays) return false;
    return dates.every(d => {
      const e = entries[d];
      return e && typeof e[key] === 'number' && e[key] >= threshold;
    });
  }

  function detectNSAIDOveruse(medAdherenceLog, dailyLog, windowDays, thresholdPct) {
    // Look at trailing windowDays days. Count days where NSAID was taken.
    const today = new Date();
    let nsaidDays = 0, totalDays = 0;
    for (let i = 0; i < windowDays; i++) {
      const d = new Date(today); d.setDate(d.getDate() - i);
      const k = d.toISOString().slice(0, 10);
      const dl = (dailyLog || {})[k];
      const mal = (medAdherenceLog || {})[k];
      if (dl || mal) totalDays++;
      const tookNsaid = (dl && dl.nsaid_taken) || (mal && mal.meds && Object.keys(mal.meds).some(m => /nsaid|ibuprofen|naproxen|aspirin|diclofenac|mefenamic/i.test(m) && mal.meds[m] === 'taken'));
      if (tookNsaid) nsaidDays++;
    }
    if (totalDays === 0) return null;
    return nsaidDays / windowDays;
  }

  // R7 polish — body-map cyclical zone detector. Returns true when a zone has elevated severity in the menstrual phase across `minCycles` distinct cycles.
  function detectCyclicalBodyMapZone(painLocationLog, zoneId, minSeverity, minCycles, cycleLen) {
    if (!painLocationLog) return false;
    const dates = Object.keys(painLocationLog);
    const matchedCycles = new Set();
    dates.forEach(d => {
      const entry = painLocationLog[d];
      if (!entry || !entry.zones) return;
      const zone = entry.zones[zoneId];
      if (!zone || (zone.nrs || 0) < minSeverity) return;
      // Treat "during period" timing as menstrual phase. If unset, infer from cycleDay if present.
      const inMenstrualPhase = zone.timing === 'period' || (entry.cyclePhase === 'M');
      if (!inMenstrualPhase) return;
      const day = Math.floor(new Date(d).getTime() / 86400000);
      matchedCycles.add(Math.floor(day / (cycleLen || 28)));
    });
    return matchedCycles.size >= minCycles;
  }

  // Run all endo safety rules against current state. Returns array of fired rule findings.
  function assessEndoSafetyRules(state) {
    if (!state) return [];
    const findings = [];
    const cycleLen = state.cycleLen || 28;

    // R1 — cyclical rectal bleeding
    if (detectCyclicalPattern(state.endoBowelLog || {}, e => e && e.rectal_bleeding, 2, cycleLen)) {
      const r = ENDO_SAFETY_RULES.find(x => x.id === 'DIE_RECTAL_BLEEDING');
      if (r) findings.push(r);
    }
    // R2 — cyclical hematuria (dysuria + bleeding signal). Approximation: dysuria_nrs ≥ 4 AND bladder bleeding flag.
    if (detectCyclicalPattern(state.endoDailyLog || {}, e => e && e.dysuria_nrs >= 4, 2, cycleLen)
        && detectCyclicalPattern(state.bladderLog || {}, e => e && e.leakage, 2, cycleLen)) {
      const r = ENDO_SAFETY_RULES.find(x => x.id === 'DIE_HEMATURIA');
      if (r) findings.push(r);
    }
    // R7 polish — R3 cyclical right shoulder/diaphragm pain via body map zone "right_shoulder"
    if (detectCyclicalBodyMapZone(state.endoPainLocation || {}, 'right_shoulder', 4, 2, cycleLen)) {
      const r = ENDO_SAFETY_RULES.find(x => x.id === 'DIE_SHOULDER_PAIN');
      if (r) findings.push(r);
    }
    // R7 polish — R4 cyclical flank/back pain via body map zone "lower_back" or "flank"
    if (detectCyclicalBodyMapZone(state.endoPainLocation || {}, 'lower_back', 4, 2, cycleLen)
        || detectCyclicalBodyMapZone(state.endoPainLocation || {}, 'flank', 4, 2, cycleLen)) {
      const r = ENDO_SAFETY_RULES.find(x => x.id === 'DIE_FLANK_PAIN');
      if (r) findings.push(r);
    }
    // R5 — PHQ-9 item 9
    const phqLogs = { ...(state.endoPhq9Log || {}), ...(state.adhdPhq9Log || {}) };
    const phqDates = Object.keys(phqLogs).sort().reverse();
    if (phqDates.length > 0) {
      const latestPhq = phqLogs[phqDates[0]];
      if (latestPhq && latestPhq.item9_si >= 1) {
        const r = ENDO_SAFETY_RULES.find(x => x.id === 'PHQ9_ITEM9_SI');
        if (r) findings.push(r);
      }
      if (latestPhq && latestPhq.total >= 15) {
        const r = ENDO_SAFETY_RULES.find(x => x.id === 'PHQ9_SEVERE');
        if (r) findings.push(r);
      } else if (latestPhq && latestPhq.total >= 10) {
        const r = ENDO_SAFETY_RULES.find(x => x.id === 'PHQ9_MODERATE');
        if (r) findings.push(r);
      }
    }
    // R8 — pain ≥8 for 7+ days
    if (detectPersistentSeverity(state.endoDailyLog || {}, 'cpp_nrs', 8, 7) ||
        detectPersistentSeverity(state.endoDailyLog || {}, 'dysmenorrhea_nrs', 8, 7)) {
      const r = ENDO_SAFETY_RULES.find(x => x.id === 'PAIN_PERSISTENT_SEVERE');
      if (r) findings.push(r);
    }
    // R9 — PBAC very heavy
    const pbac = state.endoPbacLog || {};
    const pbacDates = Object.keys(pbac).sort().reverse();
    for (const d of pbacDates.slice(0, 35)) {
      const e = pbac[d];
      if (e && (e.cycle_total_so_far >= 150 || e.daily_score >= 150)) {
        const r = ENDO_SAFETY_RULES.find(x => x.id === 'PBAC_VERY_HEAVY');
        if (r) { findings.push(r); break; }
      }
    }
    return findings;
  }

  window.HQ_CRISIS = {
    assessCrisisTier,
    shouldShowTier3,
    markTier3Shown,
    shouldShowTier2,
    markTier2Shown,
    CrisisCard,
    Tier1Surface,
    Tier2Surface,
    Tier3Surface,
    SI_KEY,
    SI_LABEL,
    RESOURCES,
    getResources, // T-31
    // R7 — F88 + F108
    assessAUBRule,
    ENDO_SAFETY_RULES,
    assessEndoSafetyRules,
    detectCyclicalPattern,
    detectPersistentSeverity,
    detectNSAIDOveruse,
  };
})();
