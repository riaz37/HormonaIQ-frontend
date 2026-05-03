// PCOS module data (F12 / F28 / F18 / F43 / F44 / F45 / F46 / F47 / F48
//                   F49 / F50 / F51 / F52 / F53 / F54 / F55 / F56)

import type { ModuleDef } from './types';

export const pcosModules: readonly ModuleDef[] = [
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
] as const;
