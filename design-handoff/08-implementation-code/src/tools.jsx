// Tools — comprehensive 56-feature directory, condition-grouped
// Wave 4 T-47 — phase-tinted group panels, Phosphor icons, F-code tooltip, fade-up stagger
function ToolsScreen() {
  const { useApp, Icon, Leaf, Blob } = window.HQ;
  const { state, goto } = useApp();
  const [openModule, setOpenModule] = React.useState(null);
  const [filter, setFilter] = React.useState('all');

  const conditions = state.conditions || [];
  const hasPMDD = conditions.includes('PMDD');
  const hasPCOS = conditions.includes('PCOS');
  const hasPeri = conditions.includes('Perimenopause');
  const hasEndo = conditions.includes('Endometriosis');
  const hasADHD = state.adhd === 'Yes' || state.adhd === 'I think so' || conditions.includes('ADHD overlap');

  // Module catalog — every feature mapped to a card with Phosphor-style icon
  const groups = [
    {
      id: 'core', label: 'Core', show: true, panel: 'group-mint-warm', titleIcon: Icon.Sparkle,
      items: [
        { id: 'F1', name: 'Today hub', desc: 'Phase-aware home', I: Icon.Home, featured: true, go: () => goto('home') },
        { id: 'F2', name: '30-second log', desc: 'Daily DRSP capture', I: Icon.Plus, go: () => goto('log') },
        { id: 'F3', name: 'Cycle calendar', desc: 'Ring view', I: Icon.Calendar, go: () => goto('calendar') },
        { id: 'F8', name: 'Insights', desc: 'Charts & patterns', I: Icon.Activity, go: () => goto('chart') },
        { id: 'F20', name: 'Ora', desc: 'AI companion', I: Icon.Sparkle, go: () => goto('ora') },
        { id: 'F7', name: 'Phase education', desc: "What's happening today", I: Icon.Eye, go: () => setOpenModule('phaseEd') },
        { id: 'F11', name: 'Pattern engine', desc: 'After 2 cycles', I: Icon.Wave, go: () => setOpenModule('patterns') },
        { id: 'F29', name: 'Energy forecast', desc: 'Tomorrow at a glance', I: Icon.Sun, go: () => setOpenModule('energy') },
      ]
    },
    {
      id: 'pmdd', label: 'PMDD', show: hasPMDD, panel: 'group-sage', titleIcon: Icon.Heart,
      items: [
        { id: 'F4', name: 'DRSP tracker', desc: '11-domain daily', I: Icon.Bars, featured: true, go: () => goto('log') },
        { id: 'F9', name: 'PMDD log summary', desc: '2-cycle physician report', I: Icon.Download, go: () => setOpenModule('pmddPDF') },
        { id: 'F19', name: 'Support', desc: '3 tiers, calm by default', I: Icon.Heart, go: () => setOpenModule('crisis') },
        { id: 'F34', name: 'Luteal predictor', desc: 'With confidence interval', I: Icon.Compass, go: () => setOpenModule('lutealPred') },
        { id: 'F35', name: 'Safety plan', desc: "Built when you're well", I: Icon.Anchor, go: () => setOpenModule('safetyPlan') },
        { id: 'F36', name: 'SSRI luteal dosing', desc: 'Adherence × DRSP', I: Icon.Pill, go: () => setOpenModule('ssri') },
        { id: 'F37', name: 'Supplements', desc: 'With evidence ratings', I: Icon.Sparkle, go: () => setOpenModule('supps') },
        { id: 'F38', name: 'Rage / mood episodes', desc: 'One-tap capture', I: Icon.Bolt, go: () => setOpenModule('rage') },
        { id: 'F39', name: 'Relationship impact', desc: 'For Criterion B', I: Icon.Users, go: () => setOpenModule('relImpact') },
        { id: 'F40', name: 'Work / academic impact', desc: 'For accommodations', I: Icon.Clipboard, go: () => setOpenModule('workImpact') },
        { id: 'F41', name: 'Trigger correlation', desc: 'Sleep, stress, alcohol…', I: Icon.Tag, go: () => setOpenModule('triggers') },
        { id: 'F42', name: 'Phase-matched community', desc: 'Anonymous, no profiles', I: Icon.Users, go: () => setOpenModule('community') },
      ]
    },
    {
      id: 'pcos', label: 'PCOS', show: hasPCOS, panel: 'group-blush', titleIcon: Icon.Flask,
      items: [
        { id: 'F12', name: 'Lab value vault', desc: 'Testosterone, AMH, more', I: Icon.Database, featured: true, go: () => setOpenModule('labVault') },
        { id: 'F18', name: 'Androgen tracker', desc: 'Acne, hirsutism, hair', I: Icon.Drop, go: () => setOpenModule('androgen') },
        { id: 'F28', name: 'Metabolic snapshot', desc: 'Daily proxy markers · post-meal energy / cravings', I: Icon.Heartbeat, go: () => setOpenModule('metabolicSnap') },
        { id: 'F43', name: 'HOMA-IR calculator', desc: 'Insulin resistance score', I: Icon.Sparkle, go: () => setOpenModule('homaIR') },
        { id: 'F44', name: 'PCOS medications', desc: 'Metformin, spiro…', I: Icon.Pill, go: () => setOpenModule('pcosMed') },
        { id: 'F45', name: 'Endometrial flag', desc: 'Amenorrhea risk monitor', I: Icon.Bell, go: () => setOpenModule('endoFlag') },
        { id: 'F46', name: 'Hair shedding', desc: 'Strand count + Ludwig', I: Icon.Wave, go: () => setOpenModule('hair') },
        { id: 'F47', name: 'Ovulation detection', desc: 'OPK, BBT, PdG', I: Icon.Spiral, go: () => setOpenModule('ovulation') },
        { id: 'F48', name: 'Inositol protocol', desc: '40:1 myo + DCI', I: Icon.TestTube, go: () => setOpenModule('inositol') },
        // T-20 — Weight tracker hidden unless opted-in via Profile → My data
        ...(state.featureFlags?.weightTracker ? [{ id: 'F49', name: 'Weight (non-punitive)', desc: 'Metabolic trend only', I: Icon.Activity, go: () => setOpenModule('weight') }] : []),
        { id: 'F50', name: 'Treatment compare', desc: '3 months vs now', I: Icon.Swap, go: () => setOpenModule('txCompare') },
        { id: 'F51', name: 'Doctor prep', desc: 'Phenotype-tailored', I: Icon.Clipboard, go: () => setOpenModule('docPrep') },
        { id: 'F52', name: 'Fertility mode', desc: 'TTC tracking', I: Icon.Heart, go: () => setOpenModule('fertility') },
        { id: 'F53', name: 'Metabolic syndrome', desc: '5-criteria status', I: Icon.Heartbeat, go: () => setOpenModule('metaSyn') },
        { id: 'F54', name: 'Phenotype helper', desc: 'A / B / C / D', I: Icon.Tag, go: () => setOpenModule('phenotype') },
        { id: 'F55', name: 'Ultrasound vault', desc: 'AFC, ovarian volume', I: Icon.Microscope, go: () => setOpenModule('ultrasound') },
        { id: 'F56', name: 'Annual review', desc: '9 monitoring standards', I: Icon.Hourglass, go: () => setOpenModule('annual') },
      ]
    },
    {
      id: 'peri', label: 'Perimenopause', show: hasPeri, panel: 'group-butter', titleIcon: Icon.Sun,
      items: [
        { id: 'F16', name: 'Hot flash logger', desc: 'With CV risk pattern', I: Icon.Flame, featured: true, go: () => setOpenModule('hotFlash') },
        { id: 'F17', name: 'HRT effectiveness', desc: 'Before / after', I: Icon.Swap, go: () => setOpenModule('hrt') },
        { id: 'F22', name: 'Stage identifier', desc: 'STRAW+10', I: Icon.Compass, go: () => setOpenModule('straw') },
        { id: 'F25', name: 'Greene scale', desc: '21-item weekly', I: Icon.Clipboard, go: () => setOpenModule('greene') },
        { id: 'F26', name: 'GSM tracker', desc: 'Genitourinary, discreet', I: Icon.Drop, go: () => setOpenModule('gsm') },
        { id: 'F27', name: 'Brain fog', desc: 'EMQ-R adapted', I: Icon.Brain, go: () => setOpenModule('brainFog') },
        // R7 — Peri completeness
        { id: 'F65', name: 'DEXA bone density', desc: 'T-score + FRAX trend', I: Icon.Database, go: () => setOpenModule('dexa') },
        { id: 'F66', name: 'Blood pressure', desc: 'BP + pulse log', I: Icon.Heartbeat, go: () => setOpenModule('bp') },
        { id: 'F71', name: 'Non-HRT treatments', desc: 'SSRI, gabapentin, more', I: Icon.Pill, go: () => setOpenModule('periNonHrt') },
        { id: 'F78', name: 'Cardiovascular risk', desc: 'BP × lipids × Framingham', I: Icon.Heartbeat, go: () => setOpenModule('cvDash') },
        { id: 'F79', name: 'Bone health', desc: 'DEXA × calcium × FRAX', I: Icon.Anchor, go: () => setOpenModule('boneDash') },
        { id: 'F81', name: 'MRS scale', desc: '11-item Menopause Rating', I: Icon.Clipboard, go: () => setOpenModule('mrs') },
        { id: 'F82', name: 'FSFI', desc: 'Sexual function index', I: Icon.Heart, go: () => setOpenModule('fsfi') },
        { id: 'F83', name: 'DIVA', desc: 'GSM functional impact', I: Icon.Drop, go: () => setOpenModule('diva') },
        { id: 'F84', name: 'ICIQ-UI', desc: 'Urinary incontinence', I: Icon.Drop, go: () => setOpenModule('iciq') },
        { id: 'F85', name: 'Joint pain log', desc: 'Body map + stiffness', I: Icon.Activity, go: () => setOpenModule('joint') },
        { id: 'F86', name: 'Headache / migraine', desc: 'Episode log + cyclical detect', I: Icon.Bolt, go: () => setOpenModule('headache') },
        { id: 'F87', name: 'Palpitations', desc: 'Episode log + pattern', I: Icon.Pulse, go: () => setOpenModule('palp') },
        { id: 'F90', name: 'Skin & hair changes', desc: 'Weekly tracker', I: Icon.Wave, go: () => setOpenModule('skinHair') },
        { id: 'F91', name: 'Bladder symptoms', desc: 'Frequency + nocturia', I: Icon.Drop, go: () => setOpenModule('bladder') },
      ]
    },
    {
      id: 'endo', label: 'Endometriosis', show: hasEndo, panel: 'group-blush', titleIcon: Icon.Heart,
      items: [
        { id: 'F92', name: 'Endometriosis setup', desc: '3-branch onboarding', I: Icon.Compass, featured: true, go: () => setOpenModule('endoOnboarding') },
        { id: 'F93', name: '5-D pain log', desc: 'Daily pain × 5 dimensions', I: Icon.Drop, go: () => setOpenModule('endo5DPain') },
        { id: 'F94', name: 'Pain body map', desc: 'Tag zones + character', I: Icon.Eye, go: () => setOpenModule('endoBodyMap') },
        { id: 'F95', name: 'Bowel symptoms', desc: 'BSS + rectal bleeding flag', I: Icon.Activity, go: () => setOpenModule('endoBowel') },
        { id: 'F96', name: 'PBAC bleeding', desc: 'Quantified flow + HMB flag', I: Icon.Drop, go: () => setOpenModule('endoPbac') },
        { id: 'F97', name: 'Fatigue + brain fog', desc: 'Daily severity', I: Icon.Brain, go: () => setOpenModule('endoFatigue') },
        { id: 'F98', name: 'Sleep (endo)', desc: 'Pain woke me + sweats', I: Icon.Moon, go: () => setOpenModule('endoSleep') },
        { id: 'F99', name: 'PHQ-9', desc: 'Monthly safety screen', I: Icon.Clipboard, go: () => setOpenModule('phq9') },
        { id: 'F100', name: 'GAD-7', desc: 'Bi-weekly anxiety', I: Icon.Clipboard, go: () => setOpenModule('gad7') },
        { id: 'F101', name: 'EHP-30', desc: 'Endo QoL — monthly', I: Icon.Clipboard, go: () => setOpenModule('ehp30') },
        { id: 'F102', name: 'EHP-5', desc: 'Endo QoL — weekly', I: Icon.Clipboard, go: () => setOpenModule('ehp5') },
        { id: 'F103', name: 'B&B Scale', desc: 'Pelvic pain functional', I: Icon.Clipboard, go: () => setOpenModule('bnb') },
        { id: 'F104', name: 'Treatment log', desc: 'Hormonal, surgical, PFPT', I: Icon.Pill, go: () => setOpenModule('endoTreatment') },
        { id: 'F105', name: 'Surgical history', desc: 'rASRM + #ENZIAN vault', I: Icon.Folder, go: () => setOpenModule('endoSurgical') },
        { id: 'F106', name: 'Lab vault', desc: 'CA-125, AMH, CRP, TSH', I: Icon.Flask, go: () => setOpenModule('endoLab') },
        { id: 'F107', name: 'Imaging vault', desc: 'Endometriomas + DIE sites', I: Icon.Microscope, go: () => setOpenModule('endoImaging') },
        { id: 'F108', name: 'DIE safety system', desc: '9 red-flag rules', I: Icon.Bell, go: () => setOpenModule('endoSafety') },
        { id: 'F109', name: 'Physician report', desc: '12-section PDF', I: Icon.Download, go: () => setOpenModule('endoPhysicianReport') },
        { id: 'F110', name: 'Comorbidities', desc: 'IBS, fibro, hypothyroid', I: Icon.Stack, go: () => setOpenModule('endoComorbidity') },
        { id: 'F111', name: 'Med adherence', desc: 'NSAID + hormonal', I: Icon.Pill, go: () => setOpenModule('endoMedLog') },
        { id: 'F112', name: 'Triggers', desc: 'Food / stress / activity', I: Icon.Tag, go: () => setOpenModule('endoTriggers') },
        { id: 'F113', name: 'PFPT log', desc: 'Pelvic floor sessions', I: Icon.Activity, go: () => setOpenModule('endoPfpt') },
        { id: 'F115', name: 'Endometrioma trend', desc: 'Size growth chart', I: Icon.Microscope, go: () => setOpenModule('endoEndometriomaTrend') },
        { id: 'F116', name: 'Low-FODMAP', desc: '8-week protocol', I: Icon.Compass, go: () => setOpenModule('endoFodmap') },
        { id: 'F117', name: 'Cycle-GI engine', desc: 'IBS-vs-endo distinction', I: Icon.Wave, go: () => setOpenModule('endoCycleGI') },
        { id: 'F118', name: 'NSAID overuse', desc: '>50% days alert', I: Icon.Bell, go: () => setOpenModule('endoNsaidOveruse') },
        { id: 'F119', name: 'Staging display', desc: 'rASRM + #ENZIAN', I: Icon.Tag, go: () => setOpenModule('endoStaging') },
        { id: 'F120', name: 'Export formats', desc: 'PDF / CSV / link', I: Icon.Download, go: () => setOpenModule('endoExportFormats') },
        { id: 'F121', name: 'Research export', desc: 'Anonymized, opt-in', I: Icon.Database, go: () => setOpenModule('endoResearchExport') },
      ]
    },
    {
      id: 'adhd', label: 'ADHD × cycle', show: hasADHD, panel: 'group-mint-warm', titleIcon: Icon.Bolt,
      items: [
        { id: 'F122', name: 'ADHD setup', desc: '3-branch onboarding', I: Icon.Compass, featured: true, go: () => setOpenModule('adhdOnboarding') },
        { id: 'F123', name: 'Daily ADHD log', desc: '5 domains + RSD + meds', I: Icon.Brain, go: () => setOpenModule('adhdDailyLogRich') },
        { id: 'F124', name: 'ASRS-5', desc: 'WHO 6-item screen', I: Icon.Clipboard, go: () => setOpenModule('asrs5') },
        { id: 'F125', name: 'ADHD-RS', desc: '18-item severity', I: Icon.Clipboard, go: () => setOpenModule('adhdRs') },
        { id: 'F126', name: 'CAARS Emotional Lability', desc: '8-item T-score', I: Icon.Clipboard, go: () => setOpenModule('caarsEL') },
        { id: 'F127', name: 'WFIRS-S', desc: '50-item functional', I: Icon.Clipboard, go: () => setOpenModule('wfirs') },
        { id: 'F128', name: 'PHQ-9 (ADHD)', desc: 'Monthly safety screen', I: Icon.Clipboard, go: () => setOpenModule('phq9') },
        { id: 'F129', name: 'GAD-7 (ADHD)', desc: 'Bi-weekly anxiety', I: Icon.Clipboard, go: () => setOpenModule('gad7') },
        { id: 'F130', name: 'ISI', desc: 'Insomnia severity', I: Icon.Moon, go: () => setOpenModule('isi') },
        { id: 'F131', name: 'RSD episode log', desc: 'Quick-add pattern tracker', I: Icon.Heart, go: () => setOpenModule('adhdRSDEpisode') },
        { id: 'F132', name: 'Hyperfocus + crash', desc: 'Episode log', I: Icon.Bolt, go: () => setOpenModule('adhdHyperfocus') },
        { id: 'F133', name: 'Med log + BP', desc: 'Real medication tracker', I: Icon.Pill, go: () => setOpenModule('adhdMedLogReal') },
        { id: 'F134', name: 'Hormonal-ADHD engine', desc: 'Cycle correlation (60d)', I: Icon.Cycle, featured: true, go: () => setOpenModule('adhdHormonalEngine') },
        { id: 'F135', name: 'Masking effort', desc: 'Daily NRS + burnout flag', I: Icon.Eye, go: () => setOpenModule('adhdMaskingDaily') },
        { id: 'F136', name: 'Sleep circadian', desc: 'DLMO phase delay detect', I: Icon.Moon, go: () => setOpenModule('adhdCircadian') },
        { id: 'F137', name: 'Brown EF/A', desc: '5-cluster monthly', I: Icon.Brain, go: () => setOpenModule('brownEFA') },
        { id: 'F138', name: 'ADHD physician report', desc: 'Cycle × med PDF', I: Icon.Download, go: () => setOpenModule('adhdPhysicianReportReal') },
        { id: 'F139', name: 'Time blindness', desc: 'Impact + strategy log', I: Icon.Hourglass, go: () => setOpenModule('adhdTimeBlindness') },
        { id: 'F140', name: 'BFRB + sensory', desc: 'Skin/hair-pull + sensory', I: Icon.Wave, go: () => setOpenModule('adhdBfrb') },
        { id: 'F141', name: 'Supplements + lifestyle', desc: 'Omega-3, exercise, melatonin', I: Icon.Sparkle, go: () => setOpenModule('adhdSupplements') },
        { id: 'F142', name: 'Body doubling', desc: 'Session × productivity', I: Icon.Users, go: () => setOpenModule('adhdBodyDoubling') },
        { id: 'F143', name: 'Accommodation letter', desc: 'ADA-ready PDF', I: Icon.Clipboard, go: () => setOpenModule('adhdAccommodationGen') },
        { id: 'F144', name: 'Peri × ADHD', desc: 'HRT response tracking', I: Icon.Stack, go: () => setOpenModule('adhdPerimenopauseIntersect') },
        { id: 'F145', name: 'Burnout risk', desc: 'Detection + recovery', I: Icon.Bell, go: () => setOpenModule('adhdBurnoutDetect') },
        { id: 'F146', name: 'PMDD × ADHD', desc: 'Double-peak detection', I: Icon.Stack, go: () => setOpenModule('adhdPmddIntersection') },
        { id: 'F147', name: 'Financial dysregulation', desc: 'Weekly impulse log', I: Icon.Database, go: () => setOpenModule('adhdFinancial') },
        { id: 'F148', name: 'CBT skill library', desc: 'Safren protocol cards', I: Icon.Folder, go: () => setOpenModule('adhdCbtLibrary') },
        { id: 'F149', name: 'Postpartum ADHD', desc: 'EPDS + ADHD overlay', I: Icon.Heart, go: () => setOpenModule('adhdPostpartum') },
        { id: 'F150', name: 'Late diagnosis', desc: '6-article support', I: Icon.Compass, go: () => setOpenModule('adhdLateDiagnosis') },
        { id: 'F151', name: 'Relationship impact', desc: 'Weekly conflict log', I: Icon.Users, go: () => setOpenModule('adhdRelationship') },
      ]
    },
    {
      id: 'cross', label: 'Cross-condition', show: true, panel: 'group-cream', titleIcon: Icon.Stack,
      items: [
        { id: 'F21', name: 'ADHD-PMDD overlap', desc: '46% comorbidity check', I: Icon.Stack, featured: true, go: () => setOpenModule('overlap') },
        { id: 'F23', name: 'Multi-condition overlay', desc: 'Single timeline', I: Icon.Bars, go: () => setOpenModule('overlay') },
        { id: 'F24', name: 'Irregular cycle mode', desc: 'Anovulatory aware', I: Icon.Cycle, go: () => setOpenModule('irregular') },
        { id: 'F30', name: 'Comprehensive PDF', desc: 'All conditions', I: Icon.Download, go: () => setOpenModule('compPDF') },
      ]
    },
    {
      id: 'food', label: 'Food & Diet', show: !(state.ed_safe_mode === 'yes'), panel: 'group-cream', titleIcon: Icon.Mic,
      items: [
        { id: 'F31', name: 'Voice diet log', desc: 'Tell Ora what you ate', I: Icon.Mic, featured: true, go: () => { window.__oraFocus = 'food'; goto('ora'); } },
        { id: 'F32', name: 'Diet × symptoms', desc: 'Correlation engine', I: Icon.Wave, go: () => setOpenModule('dietSym') },
        { id: 'F33', name: 'Food photo (beta)', desc: 'Phase-aware feedback', I: Icon.Eye, go: () => setOpenModule('foodPhoto') },
      ]
    },
    {
      id: 'system', label: 'Privacy & system', show: true, panel: 'group-cream', titleIcon: Icon.Lock,
      items: [
        { id: 'F5', name: 'Onboarding', desc: 'Re-run setup', I: Icon.Compass, go: () => goto('onboarding') },
        { id: 'F6', name: 'Privacy dashboard', desc: 'Where your data lives', I: Icon.Lock, featured: true, go: () => setOpenModule('privacy') },
        { id: 'F10', name: 'Notifications', desc: 'Phase-aware push', I: Icon.Bell, go: () => setOpenModule('notif') },
      ]
    },
  ];

  const visibleGroups = groups.filter(g => g.show && (filter === 'all' || filter === g.id));
  const total = groups.flatMap(g => g.items).length;

  // R7 polish — collapse logic. Default open: Core + the user's primary condition group.
  const primary = state.primaryCondition || (hasPMDD ? 'PMDD' : hasPCOS ? 'PCOS' : hasEndo ? 'Endometriosis' : hasPeri ? 'Perimenopause' : null);
  const primaryGroupId = primary === 'PMDD' ? 'pmdd' : primary === 'PCOS' ? 'pcos' : primary === 'Endometriosis' ? 'endo' : primary === 'Perimenopause' ? 'peri' : null;
  const defaultOpenIds = new Set(['core', primaryGroupId, hasADHD ? 'adhd' : null].filter(Boolean));
  const [openGroups, setOpenGroups] = React.useState(defaultOpenIds);
  const toggleGroup = (id) => {
    setOpenGroups(s => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  // Search query for in-place tool search
  const [query, setQuery] = React.useState('');
  const matchesQuery = (it) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return it.name.toLowerCase().includes(q) || (it.desc || '').toLowerCase().includes(q) || it.id.toLowerCase().includes(q);
  };

  return (
    <div className="screen" style={{ position: 'relative' }}>
      <Leaf size={140} color="var(--mint-mist)" style={{ top: -30, right: -50, opacity: 0.4 }} rotate={20} />
      <Blob size={260} color="var(--butter)" style={{ bottom: 60, left: -120, opacity: 0.18 }} animate />

      <div style={{ marginBottom: 20, position: 'relative' }}>
        <div className="eyebrow" style={{ marginBottom: 6 }}>EVERYTHING IN HORMONAIQ</div>
        <h1 className="display">
          Your <em className="italic-display" style={{ color: 'var(--eucalyptus)' }}>full toolkit.</em>
        </h1>
        <p className="body" style={{ color: 'var(--ink-2)', fontSize: 14, marginTop: 4 }}>{total} tools · adjusted to {conditions.join(', ') || 'your profile'}{hasADHD ? ' + ADHD' : ''}.</p>
        {/* R7 polish — instant search */}
        <div style={{ marginTop: 14, position: 'relative' }}>
          <input type="search" placeholder="Search tools…" value={query} onChange={e => setQuery(e.target.value)}
            style={{ width: '100%', height: 40, padding: '0 14px', fontSize: 14, border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', background: 'var(--surface)' }} />
        </div>
      </div>

      <div className="scroll-x" style={{ marginBottom: 18 }}>
        {[
          { k: 'all', label: 'All' },
          { k: 'core', label: 'Core' },
          ...(hasPMDD ? [{ k: 'pmdd', label: 'PMDD' }] : []),
          ...(hasPCOS ? [{ k: 'pcos', label: 'PCOS' }] : []),
          ...(hasPeri ? [{ k: 'peri', label: 'Peri' }] : []),
          ...(hasEndo ? [{ k: 'endo', label: 'Endo' }] : []),
          ...(hasADHD ? [{ k: 'adhd', label: 'ADHD' }] : []),
          { k: 'cross', label: 'Cross' },
          ...(state.ed_safe_mode === 'yes' ? [] : [{ k: 'food', label: 'Food' }]),
          { k: 'system', label: 'System' },
        ].map(t => (
          <button key={t.k} className={`chip ${filter === t.k ? 'active' : ''}`} onClick={() => setFilter(t.k)} style={{ flex: '0 0 auto' }}>
            {t.label}
          </button>
        ))}
      </div>

      {visibleGroups.map(g => {
        const TI = g.titleIcon || Icon.Sparkle;
        // R7 polish — filter items by search query, collapse non-default groups
        const filteredItems = g.items.filter(matchesQuery);
        if (query && filteredItems.length === 0) return null;
        const isOpen = !!query || openGroups.has(g.id);
        return (
          <div key={g.id} className={`group-panel ${g.panel || ''}`}>
            <button
              onClick={() => toggleGroup(g.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: isOpen ? 12 : 0,
                width: '100%', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', textAlign: 'left',
              }}>
              <TI width="16" height="16" style={{ color: 'var(--eucalyptus-deep)' }} />
              <div className="eyebrow" style={{ margin: 0, flex: 1 }}>{g.label.toUpperCase()} · {filteredItems.length}{filteredItems.length !== g.items.length ? ` of ${g.items.length}` : ''}</div>
              <span style={{ color: 'var(--ink-3)', fontSize: 12, transition: 'transform 0.2s', transform: isOpen ? 'rotate(0)' : 'rotate(-90deg)', display: 'inline-flex' }}>
                <Icon.ChevDown width="16" height="16" />
              </span>
            </button>
            {isOpen && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
                {filteredItems.map((it, i) => {
                  const TileI = it.I || Icon.Sparkle;
                  const cardClass = it.featured ? (g.id === 'pmdd' ? 'card-mint' : g.id === 'core' ? 'card-mint' : 'card-warm') : 'card-warm';
                  return (
                    <button
                      key={it.id}
                      className={`${cardClass} fade-up`}
                      title={`${it.id} — for engineers`}
                      onClick={it.go}
                      style={{
                        padding: 16, textAlign: 'left',
                        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10,
                        minHeight: 118, cursor: 'pointer',
                        animationDelay: Math.min(60 + i * 40, 300) + 'ms',
                        transition: 'transform 0.18s ease, box-shadow 0.18s ease',
                        border: '1px solid transparent',
                      }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 12, background: 'var(--mint-mist)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--eucalyptus-deep)' }}>
                        <TileI width="20" height="20" strokeWidth="1.5" />
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.25, marginBottom: 2 }}>{it.name}</div>
                        <div className="caption" style={{ fontSize: 12 }}>{it.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}

      {openModule && <window.ModuleSheet id={openModule} onClose={() => setOpenModule(null)} />}
    </div>
  );
}

window.ToolsScreen = ToolsScreen;
