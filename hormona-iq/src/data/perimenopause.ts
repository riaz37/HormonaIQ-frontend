// Perimenopause module data (F65, F66, F71, F78, F79, F81–F87, F90, F91)

import type { ModuleDef } from './types';

export const periModules: readonly ModuleDef[] = [
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
        body: "Oestrogen decline increases cardiovascular risk. After menopause, women's CVD risk matches men's. Early perimenopause is an opportunity to act.",
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
] as const;
