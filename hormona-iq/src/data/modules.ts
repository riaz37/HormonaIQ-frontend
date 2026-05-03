// Module data layer — single source of truth for all dynamic module screens.
// Each ModuleDef maps to a dynamic route at app/(app)/modules/[id].tsx.

export type ModuleSectionType = 'info' | 'scale' | 'checklist' | 'tracker' | 'form';

export interface ModuleSection {
  title: string;
  body?: string;
  items?: string[];
  type?: ModuleSectionType;
}

export type Condition =
  | 'pmdd'
  | 'pcos'
  | 'perimenopause'
  | 'endometriosis'
  | 'adhd'
  | 'general';

export interface ModuleDef {
  id: string;
  title: string;
  subtitle?: string;
  condition: Condition;
  icon?: string;
  sections: ModuleSection[];
}

// ─────────────────────────────────────────────
// PCOS modules (F12 / F28 / F18 / F43 / F44 / F45 / F46 / F47 / F48
//               F49 / F50 / F51 / F52 / F53 / F54 / F55 / F56)
// ─────────────────────────────────────────────
const pcosModules: ModuleDef[] = [
  {
    id: 'labVault',
    title: 'Lab Value Vault',
    subtitle: "Reference ranges shown for context — your provider's interpretation matters.",
    condition: 'pcos',
    icon: '🧪',
    sections: [
      {
        title: 'YOUR PCOS LABS',
        body: 'Store and review your key hormone and metabolic lab results over time.',
        type: 'info',
        items: [
          'Total testosterone (ng/dL)',
          'Free testosterone (pg/mL)',
          'SHBG (nmol/L)',
          'AMH (ng/mL)',
          'Fasting insulin (µIU/mL)',
          'HOMA-IR (calculated)',
          'HbA1c (%)',
          'DHEA-S (µg/dL)',
          'Vitamin D (ng/mL)',
          'TSH (mIU/L)',
        ],
      },
      {
        title: 'ADD NEW RESULT',
        body: 'Log a new lab result with date, value, and whether you were fasting.',
        type: 'form',
      },
    ],
  },
  {
    id: 'metabolicSnap',
    title: 'Metabolic Snapshot',
    subtitle: 'Post-meal energy, cravings, brain fog — no calorie tracking.',
    condition: 'pcos',
    icon: '📈',
    sections: [
      {
        title: 'POST-MEAL ENERGY · 2HR · 1–5',
        body: 'Rate your energy level about 2 hours after eating. 1 = crashed, 5 = steady.',
        type: 'scale',
      },
      {
        title: 'SUGAR CRAVINGS · 1–5',
        body: 'How intense were sugar or carb cravings today? 1 = none, 5 = overwhelming.',
        type: 'scale',
      },
      {
        title: 'POST-MEAL BRAIN FOG',
        body: 'Did you feel mentally foggy after eating today?',
        type: 'checklist',
        items: ['Felt foggy after eating'],
      },
      {
        title: '7-DAY COMPOSITE',
        body: 'Your rolling composite of energy, cravings, and brain fog. Higher = better metabolic day.',
        type: 'tracker',
      },
    ],
  },
  {
    id: 'androgen',
    title: 'Androgen Tracker',
    subtitle: 'Modified Ferriman-Gallwey + IGA acne scales.',
    condition: 'pcos',
    icon: '💧',
    sections: [
      {
        title: 'ACNE TODAY · IGA SCALE',
        body: 'Rate acne severity: 0 = clear, 4 = severe nodulocystic.',
        type: 'scale',
      },
      {
        title: 'HIRSUTISM · 9 SITES · 0–4 EACH',
        body: 'Score each body site on the modified Ferriman-Gallwey scale. ≥8 total indicates clinically significant hirsutism.',
        type: 'checklist',
        items: [
          'Upper lip',
          'Chin',
          'Chest',
          'Upper back',
          'Lower back',
          'Upper abdomen',
          'Lower abdomen',
          'Upper arm',
          'Thigh',
        ],
      },
      {
        title: '3-MONTH TREND',
        body: 'Your hirsutism score trend since starting treatment.',
        type: 'tracker',
      },
    ],
  },
  {
    id: 'homaIR',
    title: 'HOMA-IR Calculator',
    subtitle: 'From your fasting insulin and glucose. Formula: (insulin × glucose) ÷ 405.',
    condition: 'pcos',
    icon: '✨',
    sections: [
      {
        title: 'FASTING INSULIN · µIU/mL',
        body: 'Enter your most recent fasting insulin value.',
        type: 'form',
      },
      {
        title: 'FASTING GLUCOSE · mg/dL',
        body: 'Enter your most recent fasting glucose value.',
        type: 'form',
      },
      {
        title: 'REFERENCE BANDS · EDUCATIONAL',
        body: 'HOMA-IR is an estimate of insulin resistance. These bands are general educational ranges — your provider considers HOMA-IR alongside your full clinical picture.',
        type: 'info',
        items: [
          '< 2.0 — typical',
          '2.0–2.4 — borderline',
          '≥ 2.5 — suggests insulin resistance',
          '≥ 3.0 — elevated',
          '≥ 4.0 — severe',
        ],
      },
    ],
  },
  {
    id: 'pcosSymptomTracker',
    title: 'PCOS Symptom Tracker',
    subtitle: 'Daily roll-up of cycle, androgen, metabolic, and mood signals.',
    condition: 'pcos',
    icon: '📊',
    sections: [
      {
        title: 'TODAY · 1–5 SEVERITY',
        body: 'Tap each domain to capture how it has shown up today.',
        type: 'scale',
        items: [
          'Acne',
          'Hair shedding',
          'Cravings',
          'Energy crash',
          'Mood reactivity',
          'Bloating',
        ],
      },
      {
        title: 'EVENTS TODAY',
        type: 'checklist',
        items: [
          'Period started',
          'Spotting',
          'Skipped meal',
          'Inositol taken',
          'Metformin taken',
          'Walked / moved 20+ min',
        ],
      },
      {
        title: '14-DAY COMPOSITE',
        body: 'Rolling severity composite across all logged domains.',
        type: 'tracker',
      },
    ],
  },
  {
    id: 'pcosMed',
    title: 'PCOS Medications',
    subtitle: 'Adherence and per-medication side-effect tracking.',
    condition: 'pcos',
    icon: '💊',
    sections: [
      {
        title: 'ACTIVE MEDICATIONS',
        body: 'Track your weekly adherence and primary side effects for each PCOS medication.',
        type: 'tracker',
      },
      {
        title: 'COMMON PCOS MEDICATIONS',
        type: 'info',
        items: [
          'Metformin XR — GI tolerance, B12 monitoring',
          'Spironolactone — blood pressure, breast tenderness',
          'Combined OCP — mood, breakthrough bleeding',
          'Letrozole — hot flashes, cycle response',
          'Inositol 4000 mg (40:1) — GI tolerance, ovulatory response',
          'Berberine — GI tolerance',
          'GLP-1 agonist — nausea, weight',
          'Levothyroxine — palpitations, sleep',
        ],
      },
    ],
  },
  {
    id: 'endoFlag',
    title: 'Endometrial Flag',
    subtitle: 'Monitors amenorrhea duration and endometrial safety threshold.',
    condition: 'pcos',
    icon: '🔔',
    sections: [
      {
        title: 'AMENORRHEA DURATION',
        body: 'Without monthly progesterone exposure, the endometrium thickens unchecked. After 90+ days of amenorrhea, your doctor may want to induce a withdrawal bleed. After 180+, an ultrasound is the standard of care.',
        type: 'info',
      },
      {
        title: 'THRESHOLD GUIDE',
        type: 'info',
        items: [
          '< 60 days — within typical PCOS range',
          '60–74 days — internal monitoring',
          '75–89 days — soft heads-up, consider contacting your doctor',
          '90+ days — worth a clinical conversation',
          '180+ days — ultrasound recommended as standard of care',
        ],
      },
    ],
  },
  {
    id: 'hair',
    title: 'Hair Shedding Log',
    subtitle: 'Daily strand count and Ludwig zone tracking, without judgement.',
    condition: 'pcos',
    icon: '〰️',
    sections: [
      {
        title: "TODAY'S SHED",
        body: 'How much hair did you shed today (per shower or brush stroke)?',
        type: 'checklist',
        items: ['None today', '< 10 strands', '10–25 strands', '25–50 strands', '> 50 strands'],
      },
      {
        title: 'LUDWIG ZONE · WHERE',
        body: 'Where is the shedding most noticeable?',
        type: 'checklist',
        items: ['Crown', 'Hairline', 'Top', 'Diffuse'],
      },
      {
        title: '30-DAY TREND',
        body: 'Your shedding pattern over the past 30 days.',
        type: 'tracker',
      },
    ],
  },
  {
    id: 'ovulation',
    title: 'Ovulation Detection',
    subtitle: 'Multi-signal, PCOS-aware. Accounts for false LH surges.',
    condition: 'pcos',
    icon: '🌀',
    sections: [
      {
        title: 'OPK RESULT TODAY',
        body: 'What did your ovulation predictor kit show today?',
        type: 'checklist',
        items: ['Negative', 'Low', 'High', 'Peak'],
      },
      {
        title: 'CERVICAL MUCUS',
        body: 'Observe and log your cervical mucus today.',
        type: 'checklist',
        items: ['Dry', 'Sticky', 'Creamy', 'Watery', 'Egg-white'],
      },
      {
        title: 'BBT · BASAL BODY TEMPERATURE',
        body: 'Log your basal body temperature taken first thing this morning before getting up.',
        type: 'form',
      },
      {
        title: 'PdG STRIP (PROGESTERONE URINE)',
        body: 'Confirm ovulation with a serum progesterone urine strip (PdG ≥5 µg/mg creatinine = ovulation confirmed).',
        type: 'checklist',
        items: ['Not tested', 'Negative (< 5)', 'Positive (≥ 5)'],
      },
    ],
  },
  {
    id: 'inositol',
    title: 'Inositol Protocol',
    subtitle: '40:1 myo-inositol + D-chiro-inositol daily tracking.',
    condition: 'pcos',
    icon: '🔬',
    sections: [
      {
        title: 'ABOUT INOSITOL',
        body: 'The 40:1 myo:DCI ratio mirrors physiological levels. Clinical trials show improvements in ovulation, insulin sensitivity, and androgen levels over 3–6 months.',
        type: 'info',
        items: [
          'Myo-inositol 4000 mg/day',
          'D-chiro-inositol 100 mg/day',
          'Folic acid 400 µg/day (often co-formulated)',
          'Take in divided doses with meals',
          'Allow 3 months for ovulatory response',
        ],
      },
      {
        title: 'DAILY ADHERENCE',
        body: 'Did you take your inositol today?',
        type: 'checklist',
        items: ['Morning dose taken', 'Evening dose taken'],
      },
      {
        title: 'SIDE EFFECTS LOG',
        body: 'Note any GI symptoms or changes.',
        type: 'tracker',
      },
    ],
  },
  {
    id: 'weight',
    title: 'Weight — Non-Punitive',
    subtitle: 'Metabolic trend only. No goal setting, no judgment.',
    condition: 'pcos',
    icon: '📊',
    sections: [
      {
        title: 'LOG WEIGHT',
        body: 'Optional. Recorded as a metabolic data point only — not a target or grade.',
        type: 'form',
      },
      {
        title: '12-WEEK TREND',
        body: 'Your metabolic trend over the past 12 weeks. Fluctuations of 1–3 kg across a cycle are normal in PCOS.',
        type: 'tracker',
      },
    ],
  },
  {
    id: 'txCompare',
    title: 'Treatment Compare',
    subtitle: '3-month before/after comparison for your current PCOS treatments.',
    condition: 'pcos',
    icon: '⇄',
    sections: [
      {
        title: 'BEFORE vs NOW',
        body: 'Compare your key PCOS markers from 3 months ago to today.',
        type: 'tracker',
      },
      {
        title: 'WHAT TO COMPARE',
        type: 'info',
        items: [
          'Cycle regularity and length',
          'Acne severity (IGA score)',
          'Hirsutism (mFG score)',
          'Hair shedding frequency',
          'Energy and cravings',
          'Lab values (testosterone, HOMA-IR)',
        ],
      },
    ],
  },
  {
    id: 'docPrep',
    title: 'Doctor Prep',
    subtitle: 'Phenotype-tailored appointment notes for your PCOS provider visit.',
    condition: 'pcos',
    icon: '📋',
    sections: [
      {
        title: 'YOUR APPOINTMENT SUMMARY',
        body: 'A structured summary of your PCOS data, tailored to your phenotype and current concerns.',
        type: 'info',
      },
      {
        title: 'QUESTIONS TO BRING',
        type: 'checklist',
        items: [
          'What phenotype do my labs suggest?',
          'Should I adjust my medication dose?',
          'What monitoring labs do I need this visit?',
          'Is my endometrium safe given my cycle gaps?',
          'Am I on the right inositol:metformin combination?',
        ],
      },
      {
        title: 'YOUR RECENT DATA',
        body: 'Summary of the past 30 days of tracked symptoms and labs.',
        type: 'tracker',
      },
    ],
  },
  {
    id: 'fertility',
    title: 'Fertility Mode',
    subtitle: 'TTC tracking with PCOS-aware cycle interpretation.',
    condition: 'pcos',
    icon: '♡',
    sections: [
      {
        title: 'FERTILITY OVERVIEW',
        body: 'PCOS is the leading cause of anovulatory infertility but is highly treatable. Letrozole is now first-line for ovulation induction.',
        type: 'info',
        items: [
          'Track OPK + BBT + PdG for confirmed ovulation',
          'Log timed intercourse',
          'Record cycle irregularities',
          'Note medication response (letrozole, inositol)',
        ],
      },
      {
        title: 'OVULATION CONFIRMED THIS CYCLE',
        body: 'PdG ≥5 µg/mg creatinine on days 7–10 post-peak OPK indicates confirmed ovulation.',
        type: 'checklist',
        items: ['PdG positive this cycle', 'Timed intercourse logged'],
      },
    ],
  },
  {
    id: 'metaSyn',
    title: 'Metabolic Syndrome',
    subtitle: '5-criteria status — are all 5 markers in range?',
    condition: 'pcos',
    icon: '❤️',
    sections: [
      {
        title: '5 CRITERIA (ATP-III)',
        body: 'Metabolic syndrome requires 3 of 5 criteria. Women with PCOS have 2–3× higher risk.',
        type: 'info',
        items: [
          'Waist circumference > 88 cm (35 in) for women',
          'Triglycerides ≥ 150 mg/dL',
          'HDL-C < 50 mg/dL',
          'Blood pressure ≥ 130/85 mmHg',
          'Fasting glucose ≥ 100 mg/dL',
        ],
      },
      {
        title: 'YOUR CRITERIA STATUS',
        body: 'Log your latest values to see how many criteria apply to you.',
        type: 'tracker',
      },
    ],
  },
  {
    id: 'phenotype',
    title: 'Phenotype Helper',
    subtitle: 'PCOS phenotype A / B / C / D based on Rotterdam criteria.',
    condition: 'pcos',
    icon: '🏷️',
    sections: [
      {
        title: 'ROTTERDAM CRITERIA',
        body: 'PCOS is diagnosed with 2 of 3 Rotterdam criteria. Your phenotype shapes which symptoms and risks are most relevant.',
        type: 'info',
        items: [
          'O — Oligo/anovulation (irregular or absent periods)',
          'A — Androgen excess (elevated androgens or signs)',
          'P — Polycystic ovarian morphology (≥20 follicles or ovarian volume > 10 mL)',
        ],
      },
      {
        title: 'PHENOTYPE PROFILES',
        type: 'info',
        items: [
          'Phenotype A (O+A+P) — classic, full metabolic risk',
          'Phenotype B (O+A) — no PCOM, high androgen risk',
          'Phenotype C (A+P) — ovulatory, androgen-dominant',
          'Phenotype D (O+P) — mild, low metabolic risk',
        ],
      },
    ],
  },
  {
    id: 'ultrasound',
    title: 'Ultrasound Vault',
    subtitle: 'Antral follicle count, ovarian volume, and endometrial thickness over time.',
    condition: 'pcos',
    icon: '🔬',
    sections: [
      {
        title: 'ADD ULTRASOUND RESULT',
        body: 'Log your pelvic ultrasound findings with date for longitudinal tracking.',
        type: 'form',
      },
      {
        title: 'PCOS MORPHOLOGY CRITERIA',
        body: 'PCOM is defined as ≥20 follicles per ovary (2–9 mm) or ovarian volume > 10 mL on transvaginal ultrasound.',
        type: 'info',
        items: [
          'Antral follicle count (AFC) per ovary',
          'Ovarian volume (mL) per ovary',
          'Follicle size distribution',
          'Endometrial thickness (mm)',
        ],
      },
    ],
  },
  {
    id: 'annual',
    title: 'Annual Review',
    subtitle: '9 monitoring standards for annual PCOS care.',
    condition: 'pcos',
    icon: '⏳',
    sections: [
      {
        title: '9 ANNUAL MONITORING STANDARDS',
        body: 'Check off which monitoring items are due at your next annual appointment.',
        type: 'checklist',
        items: [
          'Fasting glucose + insulin (HOMA-IR)',
          'Full lipid panel',
          'Blood pressure + waist circumference',
          'Thyroid (TSH)',
          'Vitamin D (25-OH)',
          'Androgen panel (testosterone, DHEA-S, SHBG)',
          'AMH (if TTC or monitoring ovarian reserve)',
          'Endometrial safety assessment (if anovulatory)',
          'Psychological wellbeing screening (PHQ-9 / GAD-7)',
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────
// Endometriosis modules (F92–F121)
// ─────────────────────────────────────────────
const endoModules: ModuleDef[] = [
  {
    id: 'endoOnboarding',
    title: 'Endometriosis Setup',
    subtitle: 'Three-branch onboarding: diagnosis status, surgical history, and current treatment.',
    condition: 'endometriosis',
    icon: '🧭',
    sections: [
      {
        title: 'DIAGNOSIS STATUS',
        body: 'Where are you in your endometriosis journey?',
        type: 'checklist',
        items: [
          'Confirmed surgical diagnosis',
          'Confirmed non-surgical / clinical diagnosis',
          'Suspected — awaiting assessment',
        ],
      },
      {
        title: 'CURRENT TREATMENT',
        body: 'What treatment approach are you currently on?',
        type: 'checklist',
        items: [
          'No treatment currently',
          'Hormonal suppression (OCP, progestogen, GnRH)',
          'Post-excision suppression',
          'Expectant management',
          'Trying to conceive (TTC)',
        ],
      },
      {
        title: 'PRIMARY CONCERNS',
        body: 'What brings you to the app today?',
        type: 'checklist',
        items: [
          'Pain management',
          'Fertility',
          'Bowel symptoms',
          'Fatigue',
          'Mental health',
          'Tracking for appointments',
        ],
      },
    ],
  },
  {
    id: 'endo5DPain',
    title: '5-D Pain Log',
    subtitle: 'Daily pain across five dimensions — pelvic, deep, bowel, bladder, and dyspareunia.',
    condition: 'endometriosis',
    icon: '💧',
    sections: [
      {
        title: 'PELVIC PAIN · NRS 0–10',
        body: 'Overall pelvic pain severity right now or in the past 24 hours.',
        type: 'scale',
      },
      {
        title: 'DEEP PAIN · NRS 0–10',
        body: 'Deep pelvic pain, distinct from surface cramping.',
        type: 'scale',
      },
      {
        title: 'BOWEL PAIN · NRS 0–10',
        body: 'Pain associated with bowel movements.',
        type: 'scale',
      },
      {
        title: 'BLADDER PAIN · NRS 0–10',
        body: 'Pain or burning when urinating.',
        type: 'scale',
      },
      {
        title: 'DYSPAREUNIA · NRS 0–10',
        body: 'Pain during or after sexual activity. Skip if not applicable today.',
        type: 'scale',
      },
    ],
  },
  {
    id: 'endoBodyMap',
    title: 'Pain Body Map',
    subtitle: 'Tag pain zones and describe character (sharp, aching, burning, stabbing).',
    condition: 'endometriosis',
    icon: '👁️',
    sections: [
      {
        title: 'PAIN ZONES',
        body: 'Which areas are affected today? Tap all that apply.',
        type: 'checklist',
        items: [
          'Lower abdomen centre',
          'Lower abdomen left',
          'Lower abdomen right',
          'Deep pelvis',
          'Lower back',
          'Upper thigh / hip',
          'Rectal / anal',
          'Shoulder tip (referred)',
        ],
      },
      {
        title: 'PAIN CHARACTER',
        body: 'How would you describe the pain quality?',
        type: 'checklist',
        items: ['Cramping', 'Sharp / stabbing', 'Aching / dull', 'Burning', 'Pressure', 'Shooting'],
      },
    ],
  },
  {
    id: 'endoFlareTracker',
    title: 'Flare Tracker',
    subtitle: 'Capture flare onset, suspected triggers, and recovery time.',
    condition: 'endometriosis',
    icon: '⚡',
    sections: [
      {
        title: 'CURRENT FLARE INTENSITY · NRS 0–10',
        body: 'How intense is the flare right now?',
        type: 'scale',
      },
      {
        title: 'SUSPECTED TRIGGERS',
        type: 'checklist',
        items: [
          'Period / luteal phase',
          'High-FODMAP food',
          'Gluten',
          'Alcohol',
          'Stress event',
          'Intense exercise',
          'Cold / damp weather',
          'Poor sleep',
          'Unknown',
        ],
      },
      {
        title: 'FLARE LOG',
        body: 'Log onset and resolution for trend detection.',
        type: 'tracker',
      },
    ],
  },
  {
    id: 'endoBowel',
    title: 'Bowel Symptoms',
    subtitle: 'Bristol Stool Scale + rectal bleeding flag for endo-bowel correlation.',
    condition: 'endometriosis',
    icon: '📊',
    sections: [
      {
        title: "TODAY'S BOWEL FUNCTION",
        body: 'Bowel symptoms often worsen in the luteal and menstrual phases with endometriosis.',
        type: 'checklist',
        items: [
          'Diarrhoea',
          'Constipation',
          'Alternating bowel habit',
          'Urgency',
          'Incomplete emptying',
          'Painful defecation',
          'Rectal bleeding / spotting',
          'Mucus in stool',
        ],
      },
      {
        title: 'BRISTOL STOOL TYPE',
        body: 'Which type best describes your stool today (1 = hard lumps, 7 = watery)?',
        type: 'scale',
      },
    ],
  },
  {
    id: 'endoPbac',
    title: 'PBAC Bleeding Score',
    subtitle: 'Pictorial Blood Assessment Chart — quantified menstrual flow + HMB flag.',
    condition: 'endometriosis',
    icon: '💧',
    sections: [
      {
        title: "TODAY'S FLOW",
        body: 'PBAC score ≥100 per cycle indicates heavy menstrual bleeding (HMB). Log pads, tampons, and clots passed.',
        type: 'tracker',
      },
      {
        title: 'HMB INDICATORS',
        type: 'checklist',
        items: [
          'Changing protection every 1–2 hours',
          'Clots > 2.5 cm (golf ball)',
          'Flooding through clothing',
          'Anaemia symptoms (fatigue, dizziness)',
        ],
      },
    ],
  },
  {
    id: 'endoFatigue',
    title: 'Fatigue + Brain Fog',
    subtitle: 'Daily severity tracking for endo-related fatigue and cognitive symptoms.',
    condition: 'endometriosis',
    icon: '🧠',
    sections: [
      {
        title: 'FATIGUE SEVERITY · NRS 0–10',
        body: '0 = no fatigue, 10 = completely unable to function.',
        type: 'scale',
      },
      {
        title: 'BRAIN FOG SEVERITY · NRS 0–10',
        body: '0 = thinking clearly, 10 = severe cognitive impairment.',
        type: 'scale',
      },
      {
        title: 'FATIGUE PATTERN',
        body: 'Did anything seem to trigger or worsen fatigue today?',
        type: 'checklist',
        items: ['Pain-related', 'Post-exertion', 'Sleep-related', 'Hormonal (cycle day)', 'Unexplained'],
      },
    ],
  },
  {
    id: 'endoSleep',
    title: 'Sleep (Endo)',
    subtitle: 'Pain-disrupted sleep, night sweats, and restfulness tracking.',
    condition: 'endometriosis',
    icon: '🌙',
    sections: [
      {
        title: 'SLEEP QUALITY LAST NIGHT · NRS 0–10',
        body: '0 = very poor, 10 = deeply restful.',
        type: 'scale',
      },
      {
        title: 'DISRUPTIONS',
        body: 'What disrupted your sleep?',
        type: 'checklist',
        items: [
          'Pain woke me up',
          'Night sweats',
          'Bladder urgency',
          'Restlessness',
          'Anxiety / racing thoughts',
          'No disruptions',
        ],
      },
    ],
  },
  {
    id: 'phq9',
    title: 'PHQ-9',
    subtitle: 'Patient Health Questionnaire — monthly depression safety screen.',
    condition: 'endometriosis',
    icon: '📋',
    sections: [
      {
        title: 'PHQ-9 QUESTIONNAIRE',
        body: 'Over the past 2 weeks, how often have you been bothered by each of the following problems? Rate 0 (not at all) to 3 (nearly every day).',
        type: 'scale',
        items: [
          'Little interest or pleasure in doing things',
          'Feeling down, depressed, or hopeless',
          'Trouble falling or staying asleep, or sleeping too much',
          'Feeling tired or having little energy',
          'Poor appetite or overeating',
          'Feeling bad about yourself',
          'Trouble concentrating on things',
          'Moving or speaking slowly — or being fidgety/restless',
          'Thoughts of being better off dead or hurting yourself',
        ],
      },
      {
        title: 'SCORE INTERPRETATION',
        type: 'info',
        items: [
          '0–4 — minimal depression',
          '5–9 — mild depression',
          '10–14 — moderate depression',
          '15–19 — moderately severe',
          '20–27 — severe depression',
        ],
      },
    ],
  },
  {
    id: 'gad7',
    title: 'GAD-7',
    subtitle: 'Generalised Anxiety Disorder scale — bi-weekly anxiety screen.',
    condition: 'endometriosis',
    icon: '📋',
    sections: [
      {
        title: 'GAD-7 QUESTIONNAIRE',
        body: 'Over the past 2 weeks, how often have you been bothered by each of the following? Rate 0 (not at all) to 3 (nearly every day).',
        type: 'scale',
        items: [
          'Feeling nervous, anxious, or on edge',
          'Not being able to stop or control worrying',
          'Worrying too much about different things',
          'Trouble relaxing',
          "Being so restless it's hard to sit still",
          'Becoming easily annoyed or irritable',
          'Feeling afraid as if something awful might happen',
        ],
      },
      {
        title: 'SCORE INTERPRETATION',
        type: 'info',
        items: ['0–4 — minimal', '5–9 — mild', '10–14 — moderate', '15–21 — severe'],
      },
    ],
  },
  {
    id: 'ehp30',
    title: 'EHP-30',
    subtitle: 'Endometriosis Health Profile — 30-item monthly quality of life measure.',
    condition: 'endometriosis',
    icon: '📋',
    sections: [
      {
        title: 'EHP-30 OVERVIEW',
        body: 'The EHP-30 measures how endometriosis affects your life across 5 core domains. Complete monthly for trend tracking.',
        type: 'info',
        items: [
          'Pain',
          'Control and powerlessness',
          'Emotional wellbeing',
          'Social support',
          'Self-image',
        ],
      },
      {
        title: 'MONTHLY LOG',
        body: 'Tap to start this month\'s EHP-30.',
        type: 'tracker',
      },
    ],
  },
  {
    id: 'ehp5',
    title: 'EHP-5',
    subtitle: 'Endometriosis Health Profile — 5-item weekly quick version.',
    condition: 'endometriosis',
    icon: '📋',
    sections: [
      {
        title: 'EHP-5 QUESTIONNAIRE',
        body: 'Rate each item 0 (never) to 4 (always) based on the past week.',
        type: 'scale',
        items: [
          'I have felt unable to do my daily activities',
          'I have felt unable to take part in social activities',
          'I have felt depressed',
          'I have been unable to work to my full potential',
          'I have felt unable to engage in close personal relationships',
        ],
      },
    ],
  },
  {
    id: 'bnb',
    title: 'Biberoglu & Behrman Scale',
    subtitle: 'Pelvic pain functional impact — dysmenorrhoea, dyspareunia, pelvic pain.',
    condition: 'endometriosis',
    icon: '📋',
    sections: [
      {
        title: 'B&B SYMPTOM SCORES',
        body: 'Rate each domain 0–3: 0 = none, 1 = mild, 2 = moderate, 3 = severe.',
        type: 'scale',
        items: ['Dysmenorrhoea (period pain)', 'Dyspareunia (pain with sex)', 'Non-cyclical pelvic pain', 'Pelvic tenderness (on exam)'],
      },
    ],
  },
  {
    id: 'endoTreatment',
    title: 'Treatment Log',
    subtitle: 'Hormonal, surgical, and PFPT treatment history and response.',
    condition: 'endometriosis',
    icon: '💊',
    sections: [
      {
        title: 'CURRENT TREATMENTS',
        body: 'Log and track your active endometriosis treatments.',
        type: 'tracker',
      },
      {
        title: 'TREATMENT CATEGORIES',
        type: 'info',
        items: [
          'Hormonal — OCP, progestogen-only, GnRH agonist/antagonist',
          'Surgical — excision, ablation, drainage',
          'PFPT — pelvic floor physical therapy',
          'Pain management — NSAIDs, gabapentin',
          'Complementary — acupuncture, TENS, heat therapy',
        ],
      },
    ],
  },
  {
    id: 'endoSurgical',
    title: 'Surgical History',
    subtitle: 'rASRM staging + #ENZIAN classification vault.',
    condition: 'endometriosis',
    icon: '📁',
    sections: [
      {
        title: 'ADD SURGICAL RECORD',
        body: 'Log each surgery with date, type, finding, and staging.',
        type: 'form',
      },
      {
        title: 'STAGING SYSTEMS',
        type: 'info',
        items: [
          'rASRM I — minimal (superficial implants only)',
          'rASRM II — mild',
          'rASRM III — moderate (endometriomas or adhesions)',
          'rASRM IV — severe (extensive adhesions, DIE)',
          '#ENZIAN — deep infiltrating endo classification',
        ],
      },
    ],
  },
  {
    id: 'endoLab',
    title: 'Endo Lab Vault',
    subtitle: 'CA-125, AMH, CRP, TSH and other relevant markers over time.',
    condition: 'endometriosis',
    icon: '🧪',
    sections: [
      {
        title: 'RELEVANT LABS',
        type: 'info',
        items: [
          'CA-125 (elevated in endo, not diagnostic)',
          'AMH (ovarian reserve)',
          'CRP (systemic inflammation)',
          'TSH (thyroid — common comorbidity)',
          'Full blood count (anaemia from HMB)',
          'Iron studies',
        ],
      },
      {
        title: 'ADD RESULT',
        type: 'form',
      },
    ],
  },
  {
    id: 'endoImaging',
    title: 'Imaging Vault',
    subtitle: 'Endometrioma sizes, DIE sites, and adenomyosis findings over time.',
    condition: 'endometriosis',
    icon: '🔬',
    sections: [
      {
        title: 'ADD IMAGING RESULT',
        body: 'Log ultrasound or MRI findings with date.',
        type: 'form',
      },
      {
        title: 'WHAT TO RECORD',
        type: 'info',
        items: [
          'Endometrioma size and location (left/right/bilateral)',
          'Deep infiltrating endo (DIE) sites — POD, uterosacral, bowel, bladder',
          'Adenomyosis features',
          'Ovarian volume',
          'Uterus position',
        ],
      },
    ],
  },
  {
    id: 'endoSafety',
    title: 'DIE Safety System',
    subtitle: '9 red-flag rules for deep infiltrating endometriosis emergencies.',
    condition: 'endometriosis',
    icon: '🔔',
    sections: [
      {
        title: 'RED FLAGS — SEEK URGENT CARE',
        body: 'Any of these symptoms warrants urgent medical assessment.',
        type: 'checklist',
        items: [
          'Sudden severe pelvic pain unlike usual pain',
          'Rectal bleeding outside menstruation',
          'Urinary blood (haematuria)',
          'Fever > 38°C with pelvic pain',
          'Shoulder tip pain with pelvic pain (diaphragmatic endo)',
          'Bowel obstruction symptoms (no output + pain)',
          'Acute ureteric obstruction (flank pain + no urine)',
          'Signs of ovarian torsion (sudden severe one-sided pain)',
          'Ruptured endometrioma (acute abdomen)',
        ],
      },
    ],
  },
  {
    id: 'endoPhysicianReport',
    title: 'Physician Report',
    subtitle: '12-section PDF export for your endometriosis specialist.',
    condition: 'endometriosis',
    icon: '⬇️',
    sections: [
      {
        title: 'REPORT SECTIONS',
        body: 'Your comprehensive physician report includes 12 sections from your tracked data.',
        type: 'info',
        items: [
          '1. Diagnosis status and surgical history',
          '2. Current treatments',
          '3. Pain log (last 30 days)',
          '4. Body map summary',
          '5. Bowel and bladder symptoms',
          '6. Fatigue and quality of life (EHP-5)',
          '7. Mental health screening (PHQ-9 / GAD-7)',
          '8. Menstrual bleeding (PBAC)',
          '9. Lab vault',
          '10. Imaging summary',
          '11. Comorbidities',
          '12. NSAID and medication adherence',
        ],
      },
      {
        title: 'GENERATE REPORT',
        type: 'tracker',
      },
    ],
  },
  {
    id: 'endoComorbidity',
    title: 'Comorbidities',
    subtitle: 'IBS, fibromyalgia, hypothyroidism, IC, and other common endo co-conditions.',
    condition: 'endometriosis',
    icon: '🗂️',
    sections: [
      {
        title: 'COMMON ENDOMETRIOSIS COMORBIDITIES',
        body: 'Tag which conditions have been diagnosed or suspected alongside your endometriosis.',
        type: 'checklist',
        items: [
          'Irritable Bowel Syndrome (IBS)',
          'Fibromyalgia',
          'Hypothyroidism / Hashimoto\'s',
          'Interstitial cystitis / bladder pain syndrome',
          'PCOS',
          'Adenomyosis',
          'Pelvic floor dysfunction',
          'Anxiety / depression',
          'Chronic fatigue syndrome',
          'Migraine',
        ],
      },
    ],
  },
  {
    id: 'endoMedLog',
    title: 'Med Adherence Log',
    subtitle: 'NSAID + hormonal medication adherence and side-effect tracking.',
    condition: 'endometriosis',
    icon: '💊',
    sections: [
      {
        title: 'NSAID USE TODAY',
        body: 'Track ibuprofen, naproxen, or mefenamic acid use. Overuse alert triggers at > 50% of days.',
        type: 'checklist',
        items: ['NSAID taken today', 'Dose > standard', 'Gastric symptoms noted'],
      },
      {
        title: 'HORMONAL MEDICATION',
        body: 'Did you take your hormonal medication today?',
        type: 'checklist',
        items: ['Morning dose taken', 'Breakthrough bleeding noted', 'Side effect to log'],
      },
    ],
  },
  {
    id: 'endoTriggers',
    title: 'Triggers Log',
    subtitle: 'Food, stress, and activity triggers correlated with pain flares.',
    condition: 'endometriosis',
    icon: '🏷️',
    sections: [
      {
        title: 'POSSIBLE TRIGGERS TODAY',
        body: 'Did any of these seem to worsen your symptoms?',
        type: 'checklist',
        items: [
          'High-FODMAP foods',
          'Gluten',
          'Dairy',
          'Alcohol',
          'Caffeine',
          'High stress',
          'Intense exercise',
          'Cold / damp weather',
          'Inadequate sleep',
        ],
      },
    ],
  },
  {
    id: 'endoPfpt',
    title: 'PFPT Log',
    subtitle: 'Pelvic floor physical therapy session and progress tracking.',
    condition: 'endometriosis',
    icon: '📊',
    sections: [
      {
        title: 'LOG SESSION',
        body: 'Track your pelvic floor physiotherapy sessions and home exercise compliance.',
        type: 'tracker',
      },
      {
        title: 'SESSION NOTES',
        body: 'Record pain levels before and after, exercises completed, and therapist notes.',
        type: 'form',
      },
    ],
  },
  {
    id: 'endoEndometriomaTrend',
    title: 'Endometrioma Trend',
    subtitle: 'Track endometrioma size growth across ultrasound scans.',
    condition: 'endometriosis',
    icon: '🔬',
    sections: [
      {
        title: 'SCAN HISTORY',
        body: 'Log each ultrasound scan to track endometrioma size over time. Rapid growth (> 1 cm per year) is a surgical consideration.',
        type: 'tracker',
      },
      {
        title: 'ADD SCAN',
        type: 'form',
      },
    ],
  },
  {
    id: 'endoFodmap',
    title: 'Low-FODMAP Protocol',
    subtitle: '8-week elimination and reintroduction guide for endo-related bowel symptoms.',
    condition: 'endometriosis',
    icon: '🧭',
    sections: [
      {
        title: 'THE LOW-FODMAP APPROACH',
        body: 'Up to 90% of women with endometriosis have bowel symptoms that may overlap with IBS. The low-FODMAP diet can help distinguish endo-bowel from dietary triggers.',
        type: 'info',
        items: [
          'Phase 1 (2–6 weeks): eliminate high-FODMAP foods',
          'Phase 2 (6–8 weeks): systematic reintroduction',
          'Phase 3: personalised long-term diet',
          'Work with a registered dietitian when possible',
        ],
      },
      {
        title: 'PHASE TRACKER',
        type: 'tracker',
      },
    ],
  },
  {
    id: 'endoCycleGI',
    title: 'Cycle-GI Engine',
    subtitle: 'IBS-vs-endo bowel symptom pattern distinction.',
    condition: 'endometriosis',
    icon: '〰️',
    sections: [
      {
        title: 'PATTERN DISTINCTION',
        body: 'Endo-bowel symptoms peak in the luteal and menstrual phases. IBS symptoms are less cyclically linked. Tracking both helps clarify the picture.',
        type: 'info',
        items: [
          'Endo-bowel: worsens with period, improves post-menstruation',
          'IBS: triggered by food, stress, independent of cycle',
          'Both can co-exist — the distinction guides treatment',
        ],
      },
      {
        title: 'DAILY GI LOG',
        type: 'tracker',
      },
    ],
  },
  {
    id: 'endoNsaidOveruse',
    title: 'NSAID Overuse Monitor',
    subtitle: 'Alert when NSAIDs are used more than 50% of days in a rolling window.',
    condition: 'endometriosis',
    icon: '🔔',
    sections: [
      {
        title: 'NSAID OVERUSE RISK',
        body: 'Using NSAIDs on more than 50% of days over 3 months increases risk of medication-overuse headache, GI complications, and renal effects.',
        type: 'info',
        items: [
          'Track daily NSAID use',
          'Alert threshold: > 10 days per month, or > 50% of days over 3 months',
          'Discuss alternatives with your provider if threshold approached',
        ],
      },
      {
        title: 'USAGE TRACKER',
        type: 'tracker',
      },
    ],
  },
  {
    id: 'endoStaging',
    title: 'Staging Display',
    subtitle: 'rASRM + #ENZIAN classification summary.',
    condition: 'endometriosis',
    icon: '🏷️',
    sections: [
      {
        title: 'YOUR STAGING',
        body: 'Your endometriosis staging from surgical reports. Staging guides treatment options but does not directly correlate with symptom severity.',
        type: 'info',
      },
      {
        title: 'STAGING SYSTEMS',
        type: 'info',
        items: [
          'rASRM I–IV (1997) — points-based peritoneal, ovarian, adhesion scoring',
          '#ENZIAN (2021) — deep infiltrating endo, compartment-based',
          'Note: stage does not predict pain severity or fertility impact',
        ],
      },
    ],
  },
  {
    id: 'endoExportFormats',
    title: 'Export Formats',
    subtitle: 'PDF, CSV, or shareable link for your endometriosis data.',
    condition: 'endometriosis',
    icon: '⬇️',
    sections: [
      {
        title: 'EXPORT YOUR DATA',
        body: 'Your data belongs to you. Export at any time in your preferred format.',
        type: 'info',
        items: [
          'PDF — formatted physician report',
          'CSV — raw data for personal analysis',
          'Shareable link — time-limited, read-only view for providers',
        ],
      },
    ],
  },
  {
    id: 'endoResearchExport',
    title: 'Research Export',
    subtitle: 'Anonymised, opt-in data contribution to endometriosis research.',
    condition: 'endometriosis',
    icon: '🗄️',
    sections: [
      {
        title: 'CONTRIBUTE TO RESEARCH',
        body: 'Endometriosis takes an average of 7 years to diagnose. Your anonymised data, combined with others, helps researchers understand symptom patterns and improve diagnostic tools.',
        type: 'info',
      },
      {
        title: 'WHAT IS SHARED',
        type: 'info',
        items: [
          'Anonymised symptom patterns (no name, email, or identifiers)',
          'Cycle phase correlations',
          'Treatment response patterns',
          'You can withdraw consent at any time',
        ],
      },
    ],
  },
];

// ─────────────────────────────────────────────
// ADHD modules (F122–F141)
// ─────────────────────────────────────────────
const adhdModules: ModuleDef[] = [
  {
    id: 'adhdOnboarding',
    title: 'ADHD Setup',
    subtitle: 'Three-branch onboarding: diagnosis status, presentation type, and comorbidities.',
    condition: 'adhd',
    icon: '🧭',
    sections: [
      {
        title: 'DIAGNOSIS STATUS',
        body: 'Where you are with diagnosis shapes what we show first.',
        type: 'checklist',
        items: [
          "I've been diagnosed (adult or recent diagnosis)",
          'Recently diagnosed — within 12 months',
          "I think I have it, awaiting assessment",
        ],
      },
      {
        title: 'PRESENTATION TYPE',
        body: 'What does your ADHD presentation look like?',
        type: 'checklist',
        items: ['Inattentive', 'Hyperactive-Impulsive', 'Combined', "I'm not sure"],
      },
      {
        title: 'PRIMARY CHALLENGES',
        body: 'What matters most to track right now?',
        type: 'checklist',
        items: [
          'Focus',
          'Organisation',
          'Time management',
          'Emotional regulation',
          'Relationships',
          'Work performance',
          'Sleep',
          'Impulsivity',
        ],
      },
    ],
  },
  {
    id: 'adhdFocusTracker',
    title: 'Focus Tracker',
    subtitle: 'Quick focus check-in across the day.',
    condition: 'adhd',
    icon: '🎯',
    sections: [
      {
        title: 'FOCUS RIGHT NOW · NRS 0–10',
        body: '0 = scattered, 10 = locked in.',
        type: 'scale',
      },
      {
        title: 'FOCUS BLOCKERS',
        type: 'checklist',
        items: [
          'Notifications / phone',
          'Open-plan noise',
          'Internal restlessness',
          'Task feels boring',
          'Task feels overwhelming',
          'Hungry / dehydrated',
          'Pre-medication window',
        ],
      },
      {
        title: 'TODAY ROLL-UP',
        body: 'Average focus and number of check-ins logged today.',
        type: 'tracker',
      },
    ],
  },
  {
    id: 'adhdMoodEnergy',
    title: 'Mood + Energy',
    subtitle: 'Twice-daily mood and energy capture for ADHD pattern detection.',
    condition: 'adhd',
    icon: '⚡',
    sections: [
      {
        title: 'MOOD · 1–5',
        body: '1 = low / flat, 5 = bright and steady.',
        type: 'scale',
      },
      {
        title: 'ENERGY · 1–5',
        body: '1 = depleted, 5 = activated.',
        type: 'scale',
      },
      {
        title: 'TODAY MARKERS',
        type: 'checklist',
        items: [
          'Slept ≥ 7 hours',
          'Took medication on schedule',
          'Moved body',
          'Protein at breakfast',
          'Crashed in afternoon',
          'RSD episode',
        ],
      },
      {
        title: '14-DAY MOOD × ENERGY',
        type: 'tracker',
      },
    ],
  },
  {
    id: 'adhdCycleBrain',
    title: 'Cycle × Brain',
    subtitle: 'How your ADHD shifts across the menstrual cycle.',
    condition: 'adhd',
    icon: '🔄',
    sections: [
      {
        title: 'PHASE TODAY',
        type: 'checklist',
        items: ['Menstrual', 'Follicular', 'Ovulatory', 'Early luteal', 'Late luteal'],
      },
      {
        title: 'BRAIN TODAY · NRS 0–10',
        body: 'Rate each domain. Lower = harder.',
        type: 'scale',
        items: [
          'Attention',
          'Working memory',
          'Emotional regulation',
          'Medication effect',
        ],
      },
      {
        title: '60-DAY CYCLE × BRAIN',
        body: 'Unlocks once two full cycles are logged.',
        type: 'tracker',
      },
    ],
  },
  {
    id: 'adhdDailyLogRich',
    title: 'Daily ADHD Log',
    subtitle: 'Five domains + masking effort + medication. Cycle context auto-captured.',
    condition: 'adhd',
    icon: '🧠',
    sections: [
      {
        title: 'OVERALL TODAY',
        body: 'How is your brain working today overall? 1 = crashed, 5 = in the zone.',
        type: 'scale',
      },
      {
        title: 'FIVE DOMAINS · NRS 0–10',
        type: 'scale',
        items: [
          'Attention / Focus',
          'Impulsivity',
          'Executive function (planning, starting, finishing)',
          'Working memory',
          'Emotional regulation',
        ],
      },
      {
        title: 'MASKING EFFORT · NRS 0–10',
        body: '0 = fully myself, 10 = exhausting all-day performance.',
        type: 'scale',
      },
      {
        title: 'DISCRETE EVENTS TODAY',
        type: 'checklist',
        items: [
          'Intense emotional reaction (RSD-like)',
          'Hyperfocus episode',
          'Time blindness caused real impact',
          'Skin-pick / hair-pull / nail-bite episode',
        ],
      },
    ],
  },
  {
    id: 'asrs5',
    title: 'ASRS-5',
    subtitle: 'WHO Adult ADHD Self-Report Scale — 6-item validated screener. Monthly.',
    condition: 'adhd',
    icon: '📋',
    sections: [
      {
        title: 'ASRS-5 QUESTIONNAIRE',
        body: 'Rate each item: 0 = Never, 1 = Rarely, 2 = Sometimes, 3 = Often, 4 = Very Often. ≥4 of 6 rated "Often" or "Very Often" = positive screen.',
        type: 'scale',
        items: [
          'Trouble wrapping up final details of a project',
          'Difficulty getting things in order for a task',
          'Problems remembering appointments or obligations',
          'Avoiding or delaying tasks requiring a lot of thought',
          'Fidgeting or squirming during long sitting periods',
          'Feeling overly active and compelled to do things',
        ],
      },
    ],
  },
  {
    id: 'adhdRs',
    title: 'ADHD-RS-5',
    subtitle: '18-item DSM-5-mapped symptom severity scale.',
    condition: 'adhd',
    icon: '📋',
    sections: [
      {
        title: 'ABOUT ADHD-RS-5',
        body: 'The ADHD Rating Scale (18 items) maps directly to DSM-5 criteria. Rate each symptom 0–3. Total 0–54; higher = more severe.',
        type: 'info',
        items: [
          'Items 1–9 — Inattention subscale',
          'Items 10–18 — Hyperactivity-impulsivity subscale',
          'Clinical threshold varies by age and gender',
        ],
      },
      {
        title: 'RATE SYMPTOMS',
        type: 'scale',
      },
    ],
  },
  {
    id: 'caarsEL',
    title: 'CAARS Emotional Lability',
    subtitle: '8-item emotional lability subscale with T-score conversion.',
    condition: 'adhd',
    icon: '📋',
    sections: [
      {
        title: 'EMOTIONAL LABILITY SUBSCALE',
        body: 'Emotional dysregulation is a core but under-recognised feature of ADHD. Rate each item 0–3.',
        type: 'scale',
        items: [
          'I have quick or extreme mood changes',
          'My mood is easily affected by small events',
          'I get upset easily by things that probably don\'t matter',
          'I am easily frustrated or annoyed',
          'My emotions feel out of control',
          'I react more strongly than situations warrant',
          'I have trouble calming down once upset',
          'Small setbacks feel catastrophic in the moment',
        ],
      },
    ],
  },
  {
    id: 'wfirs',
    title: 'WFIRS-S',
    subtitle: 'Weiss Functional Impairment Rating Scale — 50-item self-report.',
    condition: 'adhd',
    icon: '📋',
    sections: [
      {
        title: 'ABOUT WFIRS-S',
        body: 'The WFIRS-S measures how ADHD affects daily functioning across 6 life domains. Use monthly to track treatment impact.',
        type: 'info',
        items: [
          'Family relationships',
          'Work / school performance',
          'Life skills (finances, self-care)',
          'Child or partner relationship',
          'Social functioning',
          'Risky activities',
        ],
      },
      {
        title: 'RATE IMPAIRMENT',
        body: 'Rate each item 0 = never/not at all, 3 = often/very much.',
        type: 'scale',
      },
    ],
  },
  {
    id: 'isi',
    title: 'ISI',
    subtitle: 'Insomnia Severity Index — 7-item validated sleep measure.',
    condition: 'adhd',
    icon: '🌙',
    sections: [
      {
        title: 'ISI QUESTIONNAIRE',
        body: 'Rate each item 0–4 based on the past 2 weeks.',
        type: 'scale',
        items: [
          'Severity of difficulty falling asleep',
          'Severity of difficulty staying asleep',
          'Severity of waking up too early',
          'Satisfaction with current sleep',
          'Interference with daily functioning',
          'Noticeability of impairment by others',
          'Distress caused by sleep problem',
        ],
      },
      {
        title: 'SCORE INTERPRETATION',
        type: 'info',
        items: [
          '0–7 — no clinically significant insomnia',
          '8–14 — subthreshold insomnia',
          '15–21 — moderate clinical insomnia',
          '22–28 — severe clinical insomnia',
        ],
      },
    ],
  },
  {
    id: 'adhdRSDEpisode',
    title: 'RSD Episode Log',
    subtitle: 'Rejection Sensitive Dysphoria quick-capture and pattern tracker.',
    condition: 'adhd',
    icon: '♡',
    sections: [
      {
        title: 'WHAT IS RSD?',
        body: 'Rejection Sensitive Dysphoria (RSD) is an intense, often overwhelming emotional response to perceived or actual rejection, criticism, or failure. It is highly prevalent in ADHD.',
        type: 'info',
      },
      {
        title: 'LOG EPISODE',
        body: 'Log an RSD or intense emotional reaction episode.',
        type: 'tracker',
      },
      {
        title: 'EPISODE DETAILS',
        type: 'checklist',
        items: [
          'Triggered by criticism',
          'Triggered by perceived rejection',
          'Triggered by failure or mistake',
          'Physical symptoms (chest, stomach)',
          'Rage response',
          'Shutdown / freeze response',
          'Resolved within 1 hour',
          'Resolved within a day',
        ],
      },
    ],
  },
  {
    id: 'adhdHyperfocus',
    title: 'Hyperfocus + Crash Log',
    subtitle: 'Episode logging for hyperfocus periods and subsequent crashes.',
    condition: 'adhd',
    icon: '⚡',
    sections: [
      {
        title: 'LOG HYPERFOCUS EPISODE',
        body: 'Track when hyperfocus starts, how long it lasts, and the crash that follows.',
        type: 'tracker',
      },
      {
        title: 'EPISODE DETAILS',
        type: 'checklist',
        items: [
          'Duration > 2 hours',
          'Duration > 4 hours',
          'Forgot to eat or drink',
          'Missed other commitments',
          'Followed by energy crash',
          'Followed by emotional crash',
          'Productive (wanted outcome)',
          'Unproductive (lost to distraction)',
        ],
      },
    ],
  },
  {
    id: 'adhdMedLogReal',
    title: 'ADHD Med Log + BP',
    subtitle: 'Real medication tracker with blood pressure, timing, and efficacy.',
    condition: 'adhd',
    icon: '💊',
    sections: [
      {
        title: "TODAY'S MEDICATION",
        type: 'checklist',
        items: ['Morning dose taken', 'Afternoon booster taken (if prescribed)', 'Dose missed'],
      },
      {
        title: 'BLOOD PRESSURE',
        body: 'Stimulants can raise blood pressure. Log your BP when prompted by your provider.',
        type: 'form',
      },
      {
        title: 'MED EFFICACY TODAY · NRS 0–10',
        body: '0 = no effect, 10 = full symptom coverage.',
        type: 'scale',
      },
    ],
  },
  {
    id: 'adhdHormonalEngine',
    title: 'Hormonal-ADHD Engine',
    subtitle: 'Cycle correlation analysis across 60 days of logged ADHD symptoms.',
    condition: 'adhd',
    icon: '🔄',
    sections: [
      {
        title: 'HORMONE-ADHD INTERACTION',
        body: 'Oestrogen boosts dopamine and norepinephrine — the neurotransmitters central to ADHD. As oestrogen drops in the late luteal phase, ADHD symptoms typically worsen. This engine maps your pattern.',
        type: 'info',
        items: [
          'Follicular phase — higher oestrogen, often best ADHD function',
          'Ovulatory peak — highest oestrogen, often peak focus',
          'Luteal phase — falling oestrogen, worsening ADHD',
          'Late luteal — lowest oestrogen, worst ADHD (+ PMDD if present)',
          'Menstrual — hormones begin rising, gradual improvement',
        ],
      },
      {
        title: '60-DAY CORRELATION',
        body: 'Your attention and executive function scores mapped against cycle phase.',
        type: 'tracker',
      },
    ],
  },
  {
    id: 'adhdMaskingDaily',
    title: 'Masking Effort',
    subtitle: 'Daily NRS masking effort score with burnout detection flag.',
    condition: 'adhd',
    icon: '👁️',
    sections: [
      {
        title: 'MASKING EFFORT TODAY · NRS 0–10',
        body: '0 = fully myself, 10 = exhausting performance all day.',
        type: 'scale',
      },
      {
        title: 'MASKING BURNOUT SIGNS',
        body: 'Sustained high masking (≥7 for 5+ consecutive days) is associated with autistic and ADHD burnout.',
        type: 'checklist',
        items: [
          'Exhausted after work / socialising',
          'Need significant recovery time alone',
          'Suppressing stimming or natural behaviours',
          'Pretending to understand when you don\'t',
          'Hiding impulsivity or emotion at high cost',
        ],
      },
    ],
  },
  {
    id: 'adhdCircadian',
    title: 'Sleep Circadian Log',
    subtitle: 'DLMO phase delay detection for ADHD circadian rhythm patterns.',
    condition: 'adhd',
    icon: '🌙',
    sections: [
      {
        title: 'ADHD AND CIRCADIAN RHYTHM',
        body: 'Up to 75% of people with ADHD have Delayed Sleep Phase Syndrome (DSPS). The melatonin onset (DLMO) is typically delayed 1.5–3 hours versus neurotypical individuals.',
        type: 'info',
      },
      {
        title: 'LOG SLEEP TIMING',
        type: 'form',
      },
      {
        title: 'CIRCADIAN CHECKLIST',
        type: 'checklist',
        items: [
          'Feel most alert after 10pm',
          'Difficulty falling asleep before midnight',
          'Wake feeling unrefreshed even after 8+ hours',
          'Extremely difficult to wake before 8am',
          'Function better with later start times',
        ],
      },
    ],
  },
  {
    id: 'brownEFA',
    title: 'Brown EF/A Scales',
    subtitle: '5-cluster executive function and attention monthly self-rating.',
    condition: 'adhd',
    icon: '🧠',
    sections: [
      {
        title: '5 EF/A CLUSTERS',
        body: 'Rate how much each cluster has caused problems for you this month.',
        type: 'scale',
        items: [
          'Activation (organising, prioritising, starting tasks)',
          'Focus (sustaining and shifting attention)',
          'Effort (regulating alertness, effort, processing speed)',
          'Emotion (managing frustration, mood)',
          'Memory (working memory, accessing recall)',
        ],
      },
    ],
  },
  {
    id: 'adhdPhysicianReportReal',
    title: 'ADHD Physician Report',
    subtitle: 'Cycle × medication effectiveness PDF for your prescriber.',
    condition: 'adhd',
    icon: '⬇️',
    sections: [
      {
        title: 'REPORT SECTIONS',
        body: 'Your ADHD physician report contains cycle-correlated ADHD data for your prescriber.',
        type: 'info',
        items: [
          'ADHD-RS and ASRS-5 scores over time',
          'Daily log domain averages by cycle phase',
          'Medication adherence and efficacy',
          'Hormonal-ADHD correlation chart',
          'RSD and hyperfocus episode log',
          'Brown EF/A monthly trends',
          'PHQ-9 and GAD-7 comorbidity screens',
          'Accommodation letter (ADA-ready, on request)',
        ],
      },
    ],
  },
  {
    id: 'adhdTimeBlindness',
    title: 'Time Blindness Log',
    subtitle: 'Impact tracking and strategy library for ADHD time perception deficit.',
    condition: 'adhd',
    icon: '⏳',
    sections: [
      {
        title: 'TIME BLINDNESS IMPACT TODAY',
        type: 'checklist',
        items: [
          'Late for commitment',
          'Underestimated task duration',
          'Lost track of time while focused',
          'Overcommitted schedule',
          'Missed deadline',
          'No impact today',
        ],
      },
      {
        title: 'STRATEGIES',
        body: 'Evidence-based strategies for time blindness in ADHD.',
        type: 'info',
        items: [
          'Visual timers (Time Timer, Alexa)',
          'Body doubling for transitions',
          '"Time anchors" — recurring alarms',
          'Over-estimate all time by 50%',
          'External cues rather than internal sense of time',
        ],
      },
    ],
  },
  {
    id: 'adhdBfrb',
    title: 'BFRB + Sensory Log',
    subtitle: 'Body-focused repetitive behaviour and sensory sensitivity episode tracking.',
    condition: 'adhd',
    icon: '〰️',
    sections: [
      {
        title: 'BFRB LOG',
        body: 'Body-focused repetitive behaviours (BFRBs) are common in ADHD and autism. Tracking helps identify triggers.',
        type: 'checklist',
        items: ['Skin picking', 'Hair pulling (trichotillomania)', 'Nail biting', 'Cheek biting', 'Lip picking'],
      },
      {
        title: 'SENSORY SENSITIVITIES TODAY',
        type: 'checklist',
        items: [
          'Sound / auditory overload',
          'Texture / tactile discomfort',
          'Light / visual overload',
          'Smell sensitivity',
          'Clothing / tag discomfort',
          'Temperature sensitivity',
        ],
      },
    ],
  },
  {
    id: 'adhdSupplements',
    title: 'Supplements + Lifestyle',
    subtitle: 'Omega-3, exercise, melatonin, and other evidence-rated ADHD lifestyle factors.',
    condition: 'adhd',
    icon: '✨',
    sections: [
      {
        title: 'EVIDENCE-RATED SUPPLEMENTS',
        type: 'info',
        items: [
          'Omega-3 (EPA ≥1000 mg/day) — moderate evidence, meta-analyses positive',
          'Magnesium glycinate — low evidence, some sleep benefit',
          'Zinc — low-to-moderate evidence in deficient populations',
          'Iron — only if ferritin < 30; supplement with testing',
          'Melatonin 0.5–1 mg (DSPS) — good evidence for circadian shift',
        ],
      },
      {
        title: 'LIFESTYLE FACTORS',
        type: 'info',
        items: [
          'Aerobic exercise ≥30 min, 3×/week — acute and sustained ADHD benefit',
          'Sleep consistency — circadian alignment improves dopamine function',
          'Protein with breakfast — tyrosine precursor for dopamine synthesis',
          'Reduce ultra-processed carbohydrates — glycaemic variability worsens focus',
        ],
      },
      {
        title: 'DAILY ADHERENCE',
        type: 'checklist',
        items: ['Omega-3 taken', 'Exercise done', 'Consistent sleep time', 'Protein breakfast'],
      },
    ],
  },
];

// ─────────────────────────────────────────────
// Perimenopause modules (F65, F66, F71, F78, F79, F81–F87, F90, F91)
// ─────────────────────────────────────────────
const periModules: ModuleDef[] = [
  {
    id: 'dexa',
    title: 'DEXA Bone Density Vault',
    subtitle: 'Lumbar spine and hip T-scores + optional FRAX 10-year fracture risk.',
    condition: 'perimenopause',
    icon: '🗄️',
    sections: [
      {
        title: 'ADD SCAN',
        body: 'Log each DEXA scan with date, lumbar T-score, hip T-score, and optional FRAX score.',
        type: 'form',
      },
      {
        title: 'T-SCORE INTERPRETATION (WHO 1994)',
        type: 'info',
        items: [
          'T ≥ -1.0 — Normal bone density',
          'T -1.1 to -2.4 — Osteopenia (low bone mass)',
          'T ≤ -2.5 — Osteoporosis',
        ],
      },
      {
        title: 'T-SCORE TREND',
        body: 'Your lumbar and hip T-score trends across all scans.',
        type: 'tracker',
      },
    ],
  },
  {
    id: 'periSymptomRadar',
    title: 'Symptom Radar',
    subtitle: 'Six-axis weekly view of perimenopausal symptom load.',
    condition: 'perimenopause',
    icon: '🛰️',
    sections: [
      {
        title: 'THIS WEEK · 0–10 EACH AXIS',
        body: 'Rate the typical severity of each axis this week.',
        type: 'scale',
        items: [
          'Vasomotor (hot flushes, sweats)',
          'Sleep',
          'Mood',
          'Cognition',
          'Joint / muscle',
          'Genitourinary',
        ],
      },
      {
        title: 'WEEKLY HISTORY',
        body: 'Track how the radar shifts week to week.',
        type: 'tracker',
      },
    ],
  },
  {
    id: 'periHRT',
    title: 'HRT Tracker',
    subtitle: 'Hormone therapy adherence, response, and side effects.',
    condition: 'perimenopause',
    icon: '💊',
    sections: [
      {
        title: 'TODAY · ADHERENCE',
        type: 'checklist',
        items: [
          'Estrogen patch / gel applied',
          'Oral progestogen taken',
          'Vaginal estrogen used',
          'Dose missed',
        ],
      },
      {
        title: 'SYMPTOM RELIEF · NRS 0–10',
        body: 'How much have your symptoms improved on HRT this week? 0 = no change, 10 = full relief.',
        type: 'scale',
      },
      {
        title: 'SIDE EFFECTS THIS WEEK',
        type: 'checklist',
        items: [
          'Breast tenderness',
          'Headache',
          'Nausea',
          'Spotting / breakthrough bleeding',
          'Mood change',
          'Fluid retention',
          'No side effects',
        ],
      },
      {
        title: 'RESPONSE TRACKER',
        body: 'Weekly relief score across the past 12 weeks.',
        type: 'tracker',
      },
    ],
  },
  {
    id: 'periSleep',
    title: 'Perimenopause Sleep',
    subtitle: 'Vasomotor-aware sleep logging.',
    condition: 'perimenopause',
    icon: '🌙',
    sections: [
      {
        title: 'SLEEP QUALITY LAST NIGHT · NRS 0–10',
        body: '0 = very poor, 10 = deeply restful.',
        type: 'scale',
      },
      {
        title: 'DISRUPTIONS',
        type: 'checklist',
        items: [
          'Hot flush / night sweats',
          'Bladder waking',
          'Anxiety / racing thoughts',
          'Joint pain',
          'Partner snoring',
          'No disruptions',
        ],
      },
      {
        title: 'WAKE COUNT',
        body: 'How many times did you wake during the night?',
        type: 'scale',
      },
      {
        title: '14-DAY SLEEP TREND',
        type: 'tracker',
      },
    ],
  },
  {
    id: 'bp',
    title: 'Blood Pressure Log',
    subtitle: 'Daily BP + pulse. Stage alerts per ACC/AHA 2017 guidelines.',
    condition: 'perimenopause',
    icon: '❤️',
    sections: [
      {
        title: 'LOG READING',
        body: 'Enter systolic, diastolic, and pulse.',
        type: 'form',
      },
      {
        title: 'STAGE GUIDE (ACC/AHA 2017)',
        type: 'info',
        items: [
          'Normal: < 120/80',
          'Elevated: 120–129 / < 80',
          'Stage 1: 130–139 / 80–89',
          'Stage 2: ≥ 140 / ≥ 90',
          'Crisis: ≥ 180 / ≥ 120 — seek urgent care',
        ],
      },
      {
        title: '30-DAY TREND',
        type: 'tracker',
      },
    ],
  },
  {
    id: 'periNonHrt',
    title: 'Non-HRT Treatments',
    subtitle: 'Track response to SSRIs, SNRIs, gabapentin, clonidine and other non-hormonal options.',
    condition: 'perimenopause',
    icon: '💊',
    sections: [
      {
        title: 'ADD TREATMENT',
        body: 'Log medication name, dose, and start date.',
        type: 'form',
      },
      {
        title: 'COMMON NON-HORMONAL OPTIONS',
        type: 'info',
        items: [
          'Paroxetine 7.5 mg — FDA-approved for vasomotor symptoms',
          'Venlafaxine 75 mg — hot flash reduction ~60%',
          'Gabapentin 300 mg TID — night sweats, sleep',
          'Clonidine 0.1 mg — hot flashes',
          'Oxybutynin 5 mg — urinary urgency',
        ],
      },
      {
        title: 'RESPONSE TRACKER',
        body: 'Rate symptom relief weekly (0–10 NRS).',
        type: 'tracker',
      },
    ],
  },
  {
    id: 'cvDash',
    title: 'Cardiovascular Risk Dashboard',
    subtitle: 'BP × lipids × Framingham 10-year CVD risk composite.',
    condition: 'perimenopause',
    icon: '❤️',
    sections: [
      {
        title: 'CVD RISK IN PERIMENOPAUSE',
        body: 'Oestrogen decline increases cardiovascular risk. After menopause, women\'s CVD risk matches men\'s. Early perimenopause is an opportunity to act.',
        type: 'info',
        items: [
          'Track blood pressure longitudinally',
          'Annual lipid panel (TC, LDL, HDL, triglycerides)',
          'Know your Framingham 10-year risk score',
          'Lifestyle: smoking cessation, activity, Mediterranean diet',
        ],
      },
      {
        title: 'RISK FACTORS CHECKLIST',
        type: 'checklist',
        items: [
          'BP controlled (< 130/80)',
          'LDL-C < 100 mg/dL (or per provider target)',
          'Non-smoker',
          'Physically active ≥ 150 min/week',
          'BMI < 25 or healthy metabolic markers',
        ],
      },
    ],
  },
  {
    id: 'boneDash',
    title: 'Bone Health Dashboard',
    subtitle: 'DEXA T-scores × calcium × FRAX composite view.',
    condition: 'perimenopause',
    icon: '⚓',
    sections: [
      {
        title: 'BONE HEALTH IN PERIMENOPAUSE',
        body: 'Bone density loss accelerates significantly in the 3–5 years around menopause. The window for prevention is now.',
        type: 'info',
        items: [
          'Calcium 1000–1200 mg/day (diet + supplement)',
          'Vitamin D3 1500–2000 IU/day (target 25-OH ≥ 40 ng/mL)',
          'Weight-bearing exercise ≥ 3 days/week',
          'Avoid smoking and excessive alcohol',
          'DEXA every 2 years if osteopenia',
        ],
      },
      {
        title: 'BONE HEALTH TRACKER',
        type: 'tracker',
      },
    ],
  },
  {
    id: 'mrs',
    title: 'MRS Scale',
    subtitle: 'Menopause Rating Scale — 11-item validated symptom severity measure.',
    condition: 'perimenopause',
    icon: '📋',
    sections: [
      {
        title: 'MRS QUESTIONNAIRE',
        body: 'Rate each of the 11 symptoms 0 (none) to 4 (very severe).',
        type: 'scale',
        items: [
          'Hot flushes / sweating',
          'Heart discomfort (palpitations)',
          'Sleep problems',
          'Depressive mood',
          'Irritability',
          'Anxiety',
          'Physical and mental exhaustion',
          'Sexual problems',
          'Bladder problems',
          'Dryness of vagina',
          'Joint and muscular discomfort',
        ],
      },
    ],
  },
  {
    id: 'fsfi',
    title: 'FSFI',
    subtitle: 'Female Sexual Function Index — 19-item validated measure.',
    condition: 'perimenopause',
    icon: '♡',
    sections: [
      {
        title: 'FSFI OVERVIEW',
        body: 'The FSFI assesses sexual function across 6 domains. Score ≤ 26.55 indicates sexual dysfunction.',
        type: 'info',
        items: ['Desire', 'Arousal', 'Lubrication', 'Orgasm', 'Satisfaction', 'Pain'],
      },
      {
        title: 'COMPLETE FSFI',
        type: 'scale',
      },
    ],
  },
  {
    id: 'diva',
    title: 'DIVA',
    subtitle: 'Day-to-day Impact of Vaginal Aging — GSM functional impact questionnaire.',
    condition: 'perimenopause',
    icon: '💧',
    sections: [
      {
        title: 'GSM SYMPTOMS',
        body: 'Genitourinary syndrome of menopause (GSM) affects 50–80% of postmenopausal women and is highly treatable.',
        type: 'checklist',
        items: [
          'Vaginal dryness',
          'Vaginal discomfort or burning',
          'Dyspareunia (pain with sex)',
          'Urinary urgency',
          'Urinary frequency',
          'Recurrent UTIs',
          'Spotting after sex',
        ],
      },
      {
        title: 'FUNCTIONAL IMPACT',
        body: 'Rate how GSM symptoms impact your daily life.',
        type: 'scale',
      },
    ],
  },
  {
    id: 'iciq',
    title: 'ICIQ-UI',
    subtitle: 'International Consultation on Incontinence Questionnaire — urinary incontinence.',
    condition: 'perimenopause',
    icon: '💧',
    sections: [
      {
        title: 'ICIQ-UI SHORT FORM',
        body: 'Three scored questions assess urinary leakage frequency, amount, and impact on daily life.',
        type: 'scale',
        items: [
          'How often do you leak urine? (0–5)',
          'How much urine do you usually leak? (0–6)',
          'Overall how much does leaking urine interfere with your daily life? (0–10)',
        ],
      },
      {
        title: 'LEAKAGE TYPE',
        type: 'checklist',
        items: [
          'Stress (cough, sneeze, exercise)',
          'Urgency (sudden strong urge)',
          'Mixed',
          'Other',
        ],
      },
    ],
  },
  {
    id: 'joint',
    title: 'Joint Pain Log',
    subtitle: 'Body map + stiffness tracking for perimenopausal musculoskeletal symptoms.',
    condition: 'perimenopause',
    icon: '📊',
    sections: [
      {
        title: 'JOINT PAIN TODAY',
        body: 'Musculoskeletal pain affects up to 50% of perimenopausal women. Oestrogen has anti-inflammatory effects on joints.',
        type: 'scale',
      },
      {
        title: 'AFFECTED JOINTS',
        type: 'checklist',
        items: [
          'Hands / fingers (particularly morning stiffness)',
          'Wrists',
          'Knees',
          'Hips',
          'Shoulders',
          'Lower back',
          'Ankles / feet',
        ],
      },
      {
        title: 'STIFFNESS DURATION',
        body: 'How long does morning stiffness typically last?',
        type: 'checklist',
        items: ['< 15 minutes', '15–30 minutes', '30–60 minutes', '> 60 minutes'],
      },
    ],
  },
  {
    id: 'headache',
    title: 'Headache / Migraine Log',
    subtitle: 'Episode logging + cyclical detection for perimenopausal migraine patterns.',
    condition: 'perimenopause',
    icon: '⚡',
    sections: [
      {
        title: 'LOG EPISODE',
        type: 'tracker',
      },
      {
        title: 'EPISODE DETAILS',
        type: 'checklist',
        items: [
          'Migraine with aura',
          'Migraine without aura',
          'Tension headache',
          'Associated with period / cycle change',
          'Vomiting',
          'Lasted > 24 hours',
          'Rescued with triptan',
        ],
      },
      {
        title: 'SEVERITY · NRS 0–10',
        type: 'scale',
      },
    ],
  },
  {
    id: 'palp',
    title: 'Palpitations Log',
    subtitle: 'Episode logging and pattern detection for perimenopausal cardiac symptoms.',
    condition: 'perimenopause',
    icon: '💓',
    sections: [
      {
        title: 'LOG PALPITATION EPISODE',
        type: 'tracker',
      },
      {
        title: 'EPISODE DETAILS',
        type: 'checklist',
        items: [
          'Fluttering / missed beats',
          'Racing heart',
          'Associated with hot flush',
          'Associated with anxiety',
          'Lasted > 30 seconds',
          'Dizziness or near-faint',
          'Chest pain (seek urgent care if new + severe)',
        ],
      },
      {
        title: 'RED FLAG',
        body: 'Chest pain with palpitations, or fainting, warrants urgent medical assessment.',
        type: 'info',
      },
    ],
  },
  {
    id: 'skinHair',
    title: 'Skin & Hair Changes',
    subtitle: 'Weekly tracker for perimenopausal skin dryness, collagen loss, and hair changes.',
    condition: 'perimenopause',
    icon: '〰️',
    sections: [
      {
        title: "THIS WEEK'S CHANGES",
        type: 'checklist',
        items: [
          'Increased skin dryness',
          'New fine lines or deeper wrinkles',
          'Skin thinning or easy bruising',
          'Loss of skin elasticity',
          'Hair thinning on scalp',
          'New facial hair growth',
          'Nail changes (brittle, ridging)',
        ],
      },
      {
        title: 'SEVERITY · NRS 0–10',
        body: 'Overall severity of skin and hair changes this week.',
        type: 'scale',
      },
    ],
  },
  {
    id: 'bladder',
    title: 'Bladder Symptoms',
    subtitle: 'Frequency, urgency, nocturia, and leakage tracking.',
    condition: 'perimenopause',
    icon: '💧',
    sections: [
      {
        title: 'BLADDER LOG TODAY',
        type: 'checklist',
        items: [
          'Urgency (sudden strong urge to void)',
          'Urge incontinence (leakage with urgency)',
          'Stress incontinence (leakage with cough/sneeze)',
          'Frequency > 8 voids/day',
          'Nocturia (waking to void)',
          'Incomplete emptying',
          'Recurrent UTI (≥2 in 6 months)',
        ],
      },
      {
        title: 'NOCTURIA COUNT',
        body: 'How many times did you wake to urinate last night?',
        type: 'scale',
      },
    ],
  },
];

// ─────────────────────────────────────────────
// Combined export
// ─────────────────────────────────────────────
export const ALL_MODULES: readonly ModuleDef[] = [
  ...pcosModules,
  ...endoModules,
  ...adhdModules,
  ...periModules,
] as const;

export function findModule(id: string): ModuleDef | undefined {
  return ALL_MODULES.find((m) => m.id === id);
}
