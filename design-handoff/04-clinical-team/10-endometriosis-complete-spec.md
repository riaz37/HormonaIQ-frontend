# Endometriosis — Complete Clinical Specification for HormonaIQ
**Version:** 1.0 — April 2026
**Based on:** ESHRE 2022, ACOG 2026, CMAJ 2023, EHP-30 (Oxford), ASRM guidelines, NICE NG73, multiple 2024-2025 meta-analyses

---

## Section 1: Clinical Foundation

### 1.1 Condition Definition and Onboarding State

```js
// state.endoOnboarding — collected at condition setup
state.endoOnboarding = {
  diagnosisConfirmed: true | false,     // "Have you been diagnosed with endometriosis?"
  diagnosisType: 'clinical' | 'surgical' | 'imaging' | 'empirical' | 'suspected',
  diagnosisYear: 'YYYY',
  // Disease characteristics
  knownSubtype: {
    superficialPeritoneal: bool,
    endometrioma: bool,
    deepInfiltrating: bool,   // DIE
    adenomyosis: bool,
    extrapelvic: bool,        // thoracic, scar, etc.
  },
  // rASRM staging if known
  rasrmStage: null | 'I' | 'II' | 'III' | 'IV',
  // Surgery history
  surgeriesCount: 0..n,
  lastSurgeryYear: 'YYYY' | null,
  surgeryType: ['excision', 'ablation', 'cystectomy', 'hysterectomy', 'other'],
  // Symptoms at presentation
  symptomsAtOnset: {
    dysmenorrhea: bool,
    dyspareunia: bool,
    dyschezia: bool,
    dysuria: bool,
    chronicPelvicPain: bool,
    bloating: bool,
    fatigue: bool,
    infertility: bool,
    other: string,
  },
  ageAtSymptomOnset: number,         // for diagnostic delay calculation
  ageAtDiagnosis: number,
  // Comorbidities
  comorbidities: {
    ibs: bool,
    ibsConfirmed: bool,
    hypothyroidism: bool,
    pcos: bool,
    pmdd: bool,
    fibromyalgia: bool,
    cfs: bool,
    lupus: bool,
    ra: bool,
    anxietyDiagnosed: bool,
    depressionDiagnosed: bool,
    pelvicFloorDysfunction: bool,
    interstitialCystitis: bool,
    vulvodynia: bool,
    other: string,
  },
  // Fertility
  currentlyTTC: bool,                // trying to conceive
  infertilityDiagnosis: bool,
  efiScore: null | number,           // Endometriosis Fertility Index (0-10)
  // Contraception / current hormonal status
  currentTreatment: string,          // free text
  amenorrhoeic: bool,                // relevant for B&B scoring
  sexuallyActive: bool,              // relevant for dyspareunia scoring
}
```

### 1.2 rASRM Staging Context

```js
// Staged at laparoscopy. Store with date for longitudinal tracking.
state.endoStagingLog = [
  {
    date: 'YYYY-MM-DD',
    method: 'laparoscopy' | 'imaging' | 'clinical',
    rasrmStage: 'I' | 'II' | 'III' | 'IV',
    rasrmPoints: number,            // 1-5 / 6-15 / 16-40 / >40
    enzianStage: string | null,     // optional #ENZIAN notation e.g. "P1O2B3C2A2"
    surgeonNotes: string,
    efiScore: null | number,        // if fertility assessment done
    atAppointment: bool,
  }
]

// Staging interpretation constants
const RASRM_STAGES = {
  I:   { label: 'Minimal',  pointRange: [1, 5],   description: 'Small lesions on peritoneum or ovary; minimal adhesions' },
  II:  { label: 'Mild',     pointRange: [6, 15],  description: 'More extensive lesions; may include small endometriomas' },
  III: { label: 'Moderate', pointRange: [16, 40], description: 'Multiple implants; endometriomas; some adhesions' },
  IV:  { label: 'Severe',   pointRange: [41, Infinity], description: 'Extensive implants and adhesions; large endometriomas; significant anatomical distortion' },
};

// Important caveat — always display alongside staging:
const STAGING_CAVEAT = "Endometriosis stage does not predict pain severity. Stage I can cause severe pain; Stage IV may be minimally symptomatic. Your experience matters more than your stage number.";
```

### 1.3 Daily Symptom Log (The Core Tracking Surface)

```js
// state.endoDailyLog[YYYY-MM-DD] — logged daily
state.endoDailyLog['YYYY-MM-DD'] = {
  // === THE FOUR Ds — NRS 0-10 each ===
  // ASRM primary outcome measure; separate NRS required per pain type
  pain: {
    dysmenorrhea:  0..10,   // menstrual cramp severity (only relevant during/near period)
    chronicPelvic: 0..10,   // non-menstrual pelvic pain (today, right now)
    dyspareunia:   0..10,   // pain during/after sex (null if no intercourse today)
    dyschezia:     0..10,   // pain on defecation (null if no bowel movement)
    dysuria:       0..10,   // pain on urination (null if no relevant episode)
    // Additional pain types
    backPain:      0..10,
    legPain:       0..10,   // includes sciatic-type pain
    ovulationPain: 0..10,   // mittelschmerz
    shoulderPain:  0..10,   // cyclical shoulder = thoracic endo flag
    overall:       0..10,   // overall pain day rating
  },
  // === PAIN CHARACTERISTICS (when pain > 0) ===
  painCharacter: {
    cramping:  bool,
    stabbing:  bool,
    burning:   bool,
    aching:    bool,
    pressure:  bool,
    throbbing: bool,
  },
  painLocation: {
    lowerAbdomenLeft:   bool,
    lowerAbdomenRight:  bool,
    lowerAbdomenMid:    bool,
    upperAbdomen:       bool,
    lowerBack:          bool,
    pelvis:             bool,
    rectum:             bool,
    vagina:             bool,
    bladder:            bool,
    legLeft:            bool,
    legRight:           bool,
    shoulderLeft:       bool,
    shoulderRight:      bool,
  },
  // === GASTROINTESTINAL ===
  gi: {
    bloating:        0..3,   // 0=none, 1=mild, 2=moderate, 3=severe ("endo belly")
    nausea:          0..3,
    constipation:    bool,
    diarrhea:        bool,
    rectalPressure:  bool,
    rectalBleeding:  bool,   // SAFETY FLAG — cyclical rectal bleeding = bowel endo signal
    abdominalCramps: bool,
    ibs_flare:       bool,   // user-identified IBS flare
  },
  // === URINARY ===
  urinary: {
    frequency:       bool,   // more frequent than usual
    urgency:         bool,
    painOnUrination: bool,
    hematuria:       bool,   // SAFETY FLAG — blood in urine
    incompleteEmpty: bool,
  },
  // === BLEEDING ===
  bleeding: {
    periodDay:    bool,      // is this a period day?
    flowLevel:    null | 'spotting' | 'light' | 'moderate' | 'heavy' | 'very_heavy',
    clots:        bool,
    clotSize:     null | 'small' | 'large',
    intermenstrual: bool,    // spotting outside of period
    color:        null | 'bright_red' | 'dark_red' | 'brown' | 'pink',
  },
  // === SYSTEMIC ===
  systemic: {
    fatigue:       0..10,    // severe fatigue is a primary symptom
    brainFog:      0..10,    // cognitive difficulty: memory, concentration, word-finding
    nausea:        0..3,
    headache:      0..3,
    sleep: {
      quality:     0..3,     // 0=good, 3=very poor
      hoursSlept:  number,
      nightWaking: bool,
      painWoke:    bool,     // woke specifically due to pain
    },
  },
  // === MOOD ===
  mood: {
    overall:    -3..3,   // -3=very low, 0=neutral, +3=very positive
    anxious:    bool,
    irritable:  bool,
    tearful:    bool,
    lowMood:    bool,
  },
  // === MEDICATION ===
  medication: {
    nsaidTaken:      bool,
    nsaidType:       string,    // ibuprofen / naproxen / mefenamic acid / other
    nsaidDosesMg:    number,
    breakthroughPain: bool,     // pain despite medication
    hormonal:        bool,      // took hormonal treatment today
    hormonalType:    string,
    otherMeds:       string,
    heatUsed:        bool,
    restRequired:    bool,      // had to rest / stop activities due to pain
  },
  // === TRIGGERS ===
  triggers: {
    food:            string,    // food consumed that may have triggered
    stress:          bool,
    exercise:        bool,
    exerciseType:    string,
    intercourse:     bool,
    bowelMovement:   bool,
    standing:        bool,      // pain worse when standing
  },
  // === FUNCTIONAL IMPACT ===
  impact: {
    missedWork:      bool,
    reducedWork:     bool,      // presenteeism
    missedSchool:    bool,
    socialCancelled: bool,
    houseworkImpaired: bool,
    exerciseImpaired: bool,
    sleepImpaired:   bool,
  },
  // === CYCLE CONTEXT ===
  cycleContext: {
    cycleDay:      number | null,
    cyclePhase:    'menstrual' | 'follicular' | 'ovulatory' | 'luteal' | null,
    daysUntilPeriod: number | null,
  },
  // === FREE TEXT ===
  notes: string,
}
```

### 1.4 EHP-30 Monthly Assessment

The gold standard QoL instrument for endometriosis. Administered monthly after 3-month baseline establishment. Also administered at treatment changes.

```js
// state.ehp30Log[YYYY-MM-DD] — monthly assessment
state.ehp30Log['YYYY-MM-DD'] = {
  // CORE: 30 items, scored 0-4 each
  // Response: 0=Never, 1=Rarely, 2=Sometimes, 3=Often, 4=Always

  // === SCALE 1: PAIN (11 items) ===
  // Reference period: "During the past 4 weeks..."
  pain: {
    p1_unableToSocialize:      0..4,   // Unable to go to social events because of the pain
    p2_unableToHousework:      0..4,   // Unable to do jobs around the home
    p3_difficultToStand:       0..4,   // Found it difficult to stand
    p4_difficultToSit:         0..4,   // Found it difficult to sit
    p5_difficultToWalk:        0..4,   // Found it difficult to walk
    p6_unableToWork:           0..4,   // Unable to go to work / studies
    p7_unableToSport:          0..4,   // Unable to carry out sporting activities
    p8_unableToConcentrate:    0..4,   // Unable to concentrate
    p9_depressedAboutPain:     0..4,   // Felt depressed about your pain
    p10_frustrated:            0..4,   // Felt frustrated by your pain
    p11_afraid:                0..4,   // Felt afraid because of your pain
    // Subscale score: (sum / 44) × 100 = 0-100 (lower = better)
  },

  // === SCALE 2: CONTROL AND POWERLESSNESS (6 items) ===
  controlPowerlessness: {
    cp1_rulingLife:            0..4,   // Felt as though your symptoms are ruling your life
    cp2_bodyCantControl:       0..4,   // Felt that your body was out of your control
    cp3_changedPlans:          0..4,   // Had to change your plans because of your symptoms
    cp4_dependentOnOthers:     0..4,   // Felt dependent on others because of your symptoms
    cp5_unableToPlan:          0..4,   // Been unable to make plans because of your symptoms
    cp6_uncertain:             0..4,   // Felt uncertain about the future because of your symptoms
    // Subscale score: (sum / 24) × 100
  },

  // === SCALE 3: EMOTIONAL WELL-BEING (6 items) ===
  emotionalWellbeing: {
    ew1_moodSwings:            0..4,   // Had mood swings
    ew2_cried:                 0..4,   // Cried
    ew3_irritable:             0..4,   // Felt irritable
    ew4_miserable:             0..4,   // Felt miserable
    ew5_depressed:             0..4,   // Felt depressed
    ew6_anxious:               0..4,   // Felt anxious
    // Subscale score: (sum / 24) × 100
  },

  // === SCALE 4: SOCIAL SUPPORT (4 items) ===
  socialSupport: {
    ss1_notUnderstood:         0..4,   // Felt others do not understand what you are going through
    ss2_unsupported:           0..4,   // Felt unsupported
    ss3_hidingFeelings:        0..4,   // Had to hide your feelings from others
    ss4_feltAlone:             0..4,   // Felt alone
    // Subscale score: (sum / 16) × 100
  },

  // === SCALE 5: SELF-IMAGE (3 items) ===
  selfImage: {
    si1_feelingUnwomanly:      0..4,   // Felt that you were less of a woman
    si2_bodyChanges:           0..4,   // Felt that your body had changed negatively
    si3_selfConscious:         0..4,   // Felt self-conscious about your body
    // Subscale score: (sum / 12) × 100
  },

  // === OPTIONAL MODULE: SEXUAL RELATIONSHIP (5 items) ===
  // Only surfaced if user is sexually active AND opts in
  sexualRelationship: {
    sr1_avoidedSex:            0..4 | null,   // Avoided having sex because of the pain
    sr2_guiltAboutSex:         0..4 | null,   // Felt guilty about avoiding sex
    sr3_closenessAffected:     0..4 | null,   // The closeness of your relationship has been affected
    sr4_partnerReaction:       0..4 | null,   // Been concerned about your partner's reaction to your symptoms
    sr5_fearOfIntercourse:     0..4 | null,   // Felt afraid to have sexual intercourse because of pain
  },

  // === OPTIONAL MODULE: WORK (5 items) ===
  work: {
    w1_hardToConcentrate:      0..4 | null,
    w2_missedWork:             0..4 | null,
    w3_reducedProductivity:    0..4 | null,
    w4_concernedAboutJob:      0..4 | null,
    w5_underperformedAtWork:   0..4 | null,
  },

  // === OPTIONAL MODULE: INFERTILITY (4 items) ===
  // Only surfaced if user flags fertility concerns
  infertility: {
    i1_worriedAboutFertility:  0..4 | null,
    i2_sadAboutInfertility:    0..4 | null,
    i3_feltLoss:               0..4 | null,
    i4_lossOfIdentity:         0..4 | null,
  },

  // === COMPUTED SCORES ===
  scores: {
    painScore:                number,   // 0-100 (lower = better QoL)
    controlPowerlessnessScore: number,
    emotionalWellbeingScore:  number,
    socialSupportScore:       number,
    selfImageScore:           number,
    coreTotal:                number,   // average of 5 subscale scores
    // Module scores (if completed)
    sexualRelationshipScore:  number | null,
    workScore:                number | null,
    infertilityScore:         number | null,
  },

  // === TREND vs PRIOR ASSESSMENT ===
  trend: {
    painDelta:                 number,   // positive = worsened, negative = improved
    controlDelta:              number,
    emotionalDelta:            number,
    coreTotalDelta:            number,
    treatmentStartedSince:     bool,     // was a new treatment started since last assessment?
  },
}

// Clinical alert thresholds
const EHP30_ALERTS = {
  painScore: {
    high: 70,         // severe pain impact
    veryHigh: 85,     // prompt "consider discussing surgical options or second opinion"
  },
  controlPowerlessnessScore: {
    high: 70,         // key QoL domain; this subscale most responsive to treatment
  },
  emotionalWellbeingScore: {
    high: 65,         // trigger PHQ-9 + GAD-7 prompt
  },
}
```

### 1.5 EHP-5 Weekly Assessment (Short Form)

```js
// state.ehp5Log[YYYY-MM-DD] — weekly (lighter alternative to monthly EHP-30)
state.ehp5Log['YYYY-MM-DD'] = {
  // One item per core domain (selected by highest item-to-total correlation)
  pain_walkDifficulty:          0..4,   // "Found it difficult to walk because of the pain?"
  control_rulingLife:           0..4,   // "Felt as though your symptoms are ruling your life?"
  emotional_moodSwings:         0..4,   // "Had mood swings?"
  social_notUnderstood:         0..4,   // "Felt others do not understand what you are going through?"
  selfImage_lessWomanly:        0..4,   // "Felt that you were less of a woman?"

  // Optional modules (one per module)
  sexual_avoidedSex:            0..4 | null,
  work_reducedProductivity:     0..4 | null,
  infertility_worriedFertility: 0..4 | null,

  // Computed
  coreTotal:    number,   // sum of 5 core items (0-20), transformed to 0-100 for display
  moduleTotal:  number | null,
}
```

### 1.6 Biberoglu and Behrman (B&B) Monthly Clinical Assessment

For physician report and treatment response tracking. Based on 4-week recall.

```js
// state.bbLog[YYYY-MM-DD] — monthly, based on 4-week recall period
state.bbLog['YYYY-MM-DD'] = {
  // === 3 SYMPTOM ITEMS (0=None, 1=Mild, 2=Moderate, 3=Severe) ===
  dysmenorrhea:   0..3,   // 0=none, 1=mild, 2=moderate, 3=severe/incapacitating
  dyspareunia:    0..3 | null,   // null if not sexually active (note: not scored as 0)
  chronicPain:    0..3,   // non-menstrual pelvic pain

  // Symptom summary interpretation
  symptomSummary: number,   // sum of dysmenorrhea + dyspareunia + chronicPain
  // 0=none, 1-3=mild, 4-6=moderate, 7-9=severe

  // === FLAGS ===
  amenorrhoeic:    bool,   // on treatment causing no periods — note in physician report
  notSexuallyActive: bool, // dyspareunia not applicable

  // === NOTES for physician report ===
  treatmentAtTime: string,
  cycleDay: number | null,
}

// Note: Physical sign items (pelvic tenderness + induration) are clinician-assessed only.
// HormonaIQ does not capture these — they go in physician report as blank fields for clinician to fill.
```

### 1.7 NRS Pain Assessment — Per-Type Daily Tracking

The NRS ratings are embedded in the daily log (Section 1.3). The app must display them in the following clinical format for physician reports.

```js
// Clinical display thresholds
const NRS_SEVERITY = {
  none:     0,
  mild:     [1, 3],
  moderate: [4, 7],
  severe:   [8, 10],
};

// ASRM treatment response criterion
const NRS_RESPONDER_THRESHOLD = 0.30; // ≥30% reduction from baseline = clinical responder

// Separate NRS required per pain type
const PAIN_TYPES_NRS = [
  'dysmenorrhea',
  'chronicPelvicPain',
  'dyspareunia',
  'dyschezia',
  'dysuria',
  'backPain',
  'legPain',
];
```

---

## Section 2: Lab Vault

```js
state.endoLabVault = {
  ca125: [
    {
      date: 'YYYY-MM-DD',
      value: number,       // IU/mL
      lab: string,
      cycleDay: number | null,
      interpretation: null | 'normal' | 'elevated',
      // CA-125 >35 IU/mL = elevated; sensitivity 54%, specificity 91% for endo
      // Always render with caveat: "CA-125 elevation is not specific to endometriosis"
    }
  ],
  amh: [
    {
      date: 'YYYY-MM-DD',
      value: number,       // pmol/L or ng/mL (capture unit)
      unit: 'pmol/L' | 'ng/mL',
      lab: string,
      // AMH reflects ovarian reserve; falls after endometrioma surgery
      // Track trend for women post-cystectomy
    }
  ],
  fsh: [
    {
      date: 'YYYY-MM-DD',
      value: number,       // IU/L
      cycleDay: number | null,
      lab: string,
    }
  ],
  estradiol: [
    {
      date: 'YYYY-MM-DD',
      value: number,       // pmol/L or pg/mL
      unit: 'pmol/L' | 'pg/mL',
      cycleDay: number | null,
      onTreatment: bool,   // on GnRH agonist/antagonist: expected to be very low
    }
  ],
  progesterone: [
    {
      date: 'YYYY-MM-DD',
      value: number,
      cycleDay: number | null,
    }
  ],
  tsh: [
    {
      date: 'YYYY-MM-DD',
      value: number,       // mIU/L
      // TSH flagged because hypothyroidism is 7× more common in endo patients
      // TSH >4.5 = elevated; <0.4 = suppressed
    }
  ],
  testosterone: [
    { date: 'YYYY-MM-DD', value: number, unit: 'nmol/L' | 'ng/dL' }
  ],
  crp: [
    {
      date: 'YYYY-MM-DD',
      value: number,       // mg/L; inflammation marker
      // Elevated CRP correlates with endo severity in some studies
    }
  ],
  // Ultrasound / imaging vault
  imagingVault: [
    {
      date: 'YYYY-MM-DD',
      type: 'TVUS' | 'MRI' | 'transabdominal' | 'transrectal',
      findings: string,   // free text from report
      endometrioma: {
        present: bool,
        locationLeft: bool,
        locationRight: bool,
        sizeCm: number | null,
      },
      adenomyosis: {
        present: bool,
        type: 'diffuse' | 'focal' | null,
        junctionZoneThickness: number | null,  // mm; >12mm = adenomyosis criterion
      },
      dieFindings: {
        present: bool,
        locationNotes: string,
      },
      slidingSignNormal: bool | null,    // uterus-sigmoid sliding sign
      reportUrl: string | null,          // user can attach PDF
    }
  ],
}

// Lab interpretation rules
const ENDO_LAB_RULES = [
  {
    key: 'ca125_elevated',
    condition: (labs) => labs.ca125.some(l => l.value > 35),
    message: 'CA-125 is elevated. This can occur in endometriosis but also in ovarian cancer, PID, and during menstruation. A single elevated result requires clinical interpretation — not self-diagnosis.',
    severity: 'info',
  },
  {
    key: 'amh_declining',
    condition: (labs) => {
      const vals = labs.amh.map(l => l.value);
      return vals.length >= 2 && vals[vals.length-1] < vals[vals.length-2] * 0.8;
    },
    message: 'Your AMH has fallen by more than 20%. This may reflect changes in ovarian reserve. Discuss with your gynaecologist, especially if fertility is a concern.',
    severity: 'caution',
  },
  {
    key: 'tsh_elevated',
    condition: (labs) => labs.tsh.some(l => l.value > 4.5),
    message: 'TSH is elevated, suggesting possible hypothyroidism. Hypothyroidism is 7× more common in women with endometriosis. Please discuss thyroid function with your doctor.',
    severity: 'caution',
  },
];
```

---

## Section 3: Treatment Tracking

### 3.1 Hormonal and Medical Treatment Log

```js
state.endoTreatmentLog = {
  current: [
    {
      id: uuid,
      name: string,         // "Dienogest 2mg", "Norethindrone acetate 5mg", etc.
      type: 'progestin' | 'coc' | 'gnrh_agonist' | 'gnrh_antagonist' |
            'aromatase_inhibitor' | 'nsaid' | 'lngius' | 'implant' | 'other',
      route: 'oral' | 'im' | 'sc' | 'intrauterine' | 'subdermal' | 'patch' | 'ring' | 'nasal',
      dose: string,
      frequency: string,
      startDate: 'YYYY-MM-DD',
      endDate: 'YYYY-MM-DD' | null,
      prescribedFor: ['dysmenorrhea', 'cpp', 'dyspareunia', 'hrt_addback', 'anovulation', 'other'],
      addbback: bool,        // if GnRH agonist — is add-back therapy included?
      notes: string,
    }
  ],
  history: [],   // same schema, ended treatments
  
  // Treatment response tracking
  responseLog: [
    {
      treatmentId: uuid,
      date: 'YYYY-MM-DD',
      weeksOnTreatment: number,
      // Self-assessed response per symptom
      dysmenorrheaChange: -3..3,   // -3=much worse, 0=no change, +3=much better
      cppChange: -3..3,
      dyspareuniafChange: -3..3,
      fatigueChange: -3..3,
      bleedingChange: -3..3,
      overallChange: -3..3,
      sideEffects: string,
      continuationIntent: 'continue' | 'discuss_change' | 'want_to_stop',
    }
  ],
}

// Treatment response prompt rules:
// - 6 weeks after any new treatment start → "How is this treatment working for you?"
// - 3 months after GnRH agonist start → mandatory response + bone density reminder
// - 6 months after hormonal treatment → annual review prompt
```

### 3.2 Surgical History Vault

```js
state.endoSurgicalHistory = [
  {
    id: uuid,
    date: 'YYYY-MM-DD',
    type: 'diagnostic_laparoscopy' | 'excision' | 'ablation' | 'cystectomy' |
          'hysterectomy_partial' | 'hysterectomy_total' | 'oophorectomy' | 'other',
    findingsRasrm: 'I' | 'II' | 'III' | 'IV' | null,
    findingsEnzian: string | null,
    diseaseSites: string,     // free text: "uterosacral ligaments, rectovaginal septum"
    surgeonNotes: string,
    hospital: string,
    outcome: 'good' | 'partial' | 'poor' | null,  // assessed at 3 months
    postOpHormonalSuppression: bool,
    postOpTreatment: string,
    recurrenceDate: 'YYYY-MM-DD' | null,   // date symptoms recurred post-surgery
  }
]
```

### 3.3 Non-Pharmacological Treatment Tracker

```js
state.endoNonPharmaLog = {
  pfpt: {     // Pelvic Floor Physical Therapy
    active: bool,
    startDate: 'YYYY-MM-DD',
    therapistName: string,
    sessionsCompleted: number,
    painImpact: -3..3,       // self-assessed change
    sexualFunctionImpact: -3..3,
    bowelImpact: -3..3,
    notes: string,
  },
  diet: {
    lowFodmap: bool,
    antiInflammatory: bool,
    dairyFree: bool,
    glutenFree: bool,
    startDate: 'YYYY-MM-DD',
    adherencePercent: 0..100,
    painImpact: -3..3,
    bloatingImpact: -3..3,
    notes: string,
  },
  mindBody: {
    cbt: bool,
    act: bool,
    mindfulness: bool,
    yoga: bool,
    notes: string,
  },
  heatTherapy: bool,    // daily heat — tracked in daily log
  tens: bool,           // TENS unit use
  supplements: [
    {
      name: string,    // "Omega-3 2000mg", "Vitamin D 1000IU", "Turmeric"
      startDate: 'YYYY-MM-DD',
      evidenceLevel: 'strong' | 'moderate' | 'anecdotal',
    }
  ],
}
```

---

## Section 4: Safety Features

### 4.1 Safety Gates — Mandatory Alerts

```js
const ENDO_SAFETY_RULES = [

  // RULE 1: Post-menopausal / post-amenorrhoeic bleeding
  {
    id: 'cyclical_rectal_bleeding',
    trigger: (log) => log.gi.rectalBleeding === true,
    message: 'You\'ve logged rectal bleeding. Cyclical rectal bleeding can be a sign of bowel endometriosis. Please discuss this with your doctor — it should be investigated.',
    severity: 'warning',
    prompt: 'See your doctor',
  },

  // RULE 2: Cyclical hematuria
  {
    id: 'cyclical_hematuria',
    trigger: (log) => log.urinary.hematuria === true,
    message: 'You\'ve logged blood in your urine. Cyclical haematuria can indicate bladder endometriosis and should be evaluated by a urologist.',
    severity: 'warning',
    prompt: 'See your doctor',
  },

  // RULE 3: Cyclical shoulder pain (thoracic endometriosis)
  {
    id: 'shoulder_pain_cyclical',
    trigger: (log, context) => log.pain.shoulderPain >= 4 && context.onPeriodDay,
    message: 'Shoulder tip pain during your period can be a rare but important sign of diaphragmatic or thoracic endometriosis. Please mention this to your doctor.',
    severity: 'info',
    prompt: 'Mention to your doctor',
  },

  // RULE 4: Flank pain (ureteral risk)
  {
    id: 'flank_pain_ureteral_risk',
    trigger: (log) => log.painLocation.legLeft || log.painLocation.legRight,
    // Note: used as proxy — actual flank field needed; add to v2
    message: 'Ongoing flank or deep leg pain can sometimes indicate involvement of the ureter by endometriosis. Ureteral endometriosis can cause silent kidney damage. Please discuss with your specialist.',
    severity: 'info',
    firstTriggerOnly: true,
  },

  // RULE 5: PHQ-9 Item 9 (suicidality)
  {
    id: 'phq9_item9',
    trigger: (assessment) => assessment.phq9.item9 >= 1,
    message: null,   // triggers crisis safety protocol (existing system)
    protocol: 'crisis_safety',
  },

  // RULE 6: PHQ-9 total ≥ 10 (moderate depression)
  {
    id: 'phq9_moderate_depression',
    trigger: (assessment) => assessment.phq9.total >= 10,
    message: 'Your PHQ-9 score suggests you may be experiencing moderate depression. Depression is significantly more common in endometriosis — this isn\'t weakness, it\'s biology. Please discuss with your doctor.',
    severity: 'caution',
    note: 'Fatigue, sleep disruption, and concentration difficulty may be endo-related, not just depressive. Discuss which symptoms are driving your score.',
  },

  // RULE 7: Severe pain + no treatment response signal
  {
    id: 'severe_pain_no_response',
    trigger: (state) => {
      const recentDays = getRecentDailyLogs(7);
      const avgPain = mean(recentDays.map(d => d.pain.overall));
      return avgPain >= 7 && state.endoTreatmentLog.current.length > 0;
    },
    message: 'You\'ve been logging severe pain this week despite being on treatment. This is important data for your doctor — it suggests your current treatment may need review.',
    severity: 'caution',
    prompt: 'Consider contacting your gynaecologist',
  },

  // RULE 8: Very heavy bleeding pattern
  {
    id: 'very_heavy_bleeding',
    trigger: (log) => log.bleeding.flowLevel === 'very_heavy' && log.bleeding.clots && log.bleeding.clotSize === 'large',
    message: 'You\'ve logged very heavy bleeding with large clots. This pattern should be investigated — it may indicate adenomyosis or a condition requiring treatment. Please speak to your doctor.',
    severity: 'caution',
  },

  // RULE 9: Ureteral involvement suspicion (silent hydronephrosis)
  {
    id: 'ureteral_risk_education',
    trigger: (onboarding) => onboarding.knownSubtype.deepInfiltrating && !onboarding.renalCheckConfirmed,
    message: 'With deep infiltrating endometriosis, the ureter can sometimes be involved. Ureteral endometriosis can cause silent kidney damage without obvious symptoms. Ask your specialist whether a renal ultrasound is appropriate.',
    severity: 'info',
    oneTimeOnly: true,
  },
];
```

### 4.2 PHQ-9 Monthly Assessment

```js
state.endoPhq9Log['YYYY-MM-DD'] = {
  item1_anhedonia:         0..3,   // Little interest or pleasure in doing things
  item2_depressed:         0..3,   // Feeling down, depressed, hopeless
  item3_sleep:             0..3,   // Trouble sleeping or sleeping too much
  item4_tired:             0..3,   // Feeling tired or having little energy
  item5_appetite:          0..3,   // Poor appetite or overeating
  item6_badAboutSelf:      0..3,   // Feeling bad about yourself
  item7_concentration:     0..3,   // Trouble concentrating
  item8_slowOrFidgety:     0..3,   // Moving or speaking slowly/being fidgety
  item9_suicidality:       0..3,   // Thoughts of hurting yourself

  total: number,   // 0-27
  severity: 'none' | 'mild' | 'moderate' | 'moderately_severe' | 'severe',

  // Clinical note specific to endometriosis
  endoNote: "Some symptoms (fatigue, sleep difficulty, concentration) may relate to your endometriosis rather than depression alone. Your doctor can help distinguish these.",
}

// Severity thresholds
const PHQ9_SEVERITY = {
  none:               [0, 4],
  mild:               [5, 9],
  moderate:           [10, 14],
  moderately_severe:  [15, 19],
  severe:             [20, 27],
};
```

### 4.3 GAD-7 Anxiety Assessment

```js
state.endoGad7Log['YYYY-MM-DD'] = {
  item1_anxious:       0..3,
  item2_cantStopWorry: 0..3,
  item3_tooMuchWorry:  0..3,
  item4_troubled:      0..3,
  item5_restless:      0..3,
  item6_irritable:     0..3,
  item7_afraid:        0..3,
  total: number,   // 0-21
  severity: 'minimal' | 'mild' | 'moderate' | 'severe',
};

const GAD7_SEVERITY = {
  minimal:  [0, 4],
  mild:     [5, 9],
  moderate: [10, 14],
  severe:   [15, 21],
};
```

---

## Section 5: Validated Instruments Summary Reference

| Instrument | Items | Frequency | Purpose | Scoring |
|-----------|-------|-----------|---------|---------|
| EHP-30 | 30 core + 23 modular | Monthly | QoL, treatment response | 5 subscales 0-100 (lower=better) |
| EHP-5 | 5 core + 6 modular | Weekly | Quick QoL pulse | 0-100 (lower=better) |
| B&B Scale | 3 symptom | Monthly | Clinical symptom severity | 0-9 (symptom); 0-6 (signs — clinician only) |
| NRS per pain type | 7 pain types | Daily | Primary ASRM endpoint | 0-10 per type |
| ESD pattern | Embedded in daily log | Daily | FDA-compliant daily diary | As per daily log |
| PHQ-9 | 9 items | Monthly | Depression screening | 0-27 |
| GAD-7 | 7 items | Monthly | Anxiety screening | 0-21 |
| PSQI | 7 components | Monthly | Sleep quality | 0-21 (>5 = poor) |

---

## Section 6: Automated Insights Engine

```js
const ENDO_INSIGHT_RULES = [

  // INSIGHT 1: Cyclical symptom pattern detection
  {
    id: 'cyclical_endo_pattern',
    trigger: (logs) => {
      // NRS dysmenorrhea peaks on period days vs non-period days
      const periodDayPain = mean(logs.filter(l => l.bleeding.periodDay).map(l => l.pain.dysmenorrhea));
      const nonPeriodPain = mean(logs.filter(l => !l.bleeding.periodDay).map(l => l.pain.dysmenorrhea));
      return periodDayPain > nonPeriodPain * 2;
    },
    insight: "Your pain is consistently higher on period days — a classic cyclical pattern. This data supports the clinical picture of endometriosis-related dysmenorrhea.",
    minDataDays: 28,
  },

  // INSIGHT 2: GI-cycle correlation
  {
    id: 'gi_cyclical_pattern',
    trigger: (logs) => {
      const periodGIBloating = mean(logs.filter(l => l.bleeding.periodDay && l.cycleContext.cyclePhase === 'menstrual').map(l => l.gi.bloating));
      const nonPeriodGIBloating = mean(logs.filter(l => !l.bleeding.periodDay).map(l => l.gi.bloating));
      return periodGIBloating > nonPeriodGIBloating * 1.5;
    },
    insight: "Your bloating and GI symptoms are consistently worse around your period. Cyclical GI symptoms are a key differentiator between endometriosis and IBS — this pattern is worth sharing with your doctor.",
    minDataDays: 28,
  },

  // INSIGHT 3: Treatment response signal
  {
    id: 'treatment_response_positive',
    trigger: (logs, state) => {
      const treatStart = state.endoTreatmentLog.current[0]?.startDate;
      if (!treatStart) return false;
      const beforeMeanPain = mean(logs.filter(l => l.date < treatStart).slice(-30).map(l => l.pain.overall));
      const afterMeanPain = mean(logs.filter(l => l.date >= treatStart).slice(0, 42).map(l => l.pain.overall));
      return afterMeanPain < beforeMeanPain * 0.7;  // ≥30% reduction = ASRM responder
    },
    insight: "Your average pain score has fallen by more than 30% since starting your current treatment. By ASRM clinical standards, this is a meaningful treatment response.",
    minDataDays: 42,
  },

  // INSIGHT 4: EHP-30 control subscale change
  {
    id: 'ehp30_control_improving',
    trigger: (ehp30Logs) => {
      if (ehp30Logs.length < 2) return false;
      const recent = ehp30Logs[ehp30Logs.length - 1].scores.controlPowerlessnessScore;
      const prior = ehp30Logs[ehp30Logs.length - 2].scores.controlPowerlessnessScore;
      return recent < prior - 10;  // ≥10 point improvement
    },
    insight: "Your 'Control and Powerlessness' score has improved by more than 10 points. This domain is the most responsive to treatment in clinical trials — it reflects how much your symptoms are running your life.",
    minDataDays: 60,
  },

  // INSIGHT 5: Fatigue-pain correlation
  {
    id: 'fatigue_pain_correlation',
    trigger: (logs) => {
      const correlation = pearsonCorrelation(
        logs.map(l => l.pain.overall),
        logs.map(l => l.systemic.fatigue)
      );
      return correlation > 0.6;
    },
    insight: "Your fatigue levels closely track your pain levels. This is a common pattern in endometriosis — inflammation drives both. Effective pain management often improves fatigue simultaneously.",
    minDataDays: 30,
  },

  // INSIGHT 6: NSAID overuse flag
  {
    id: 'nsaid_overuse',
    trigger: (logs) => {
      const nsaidDays = logs.filter(l => l.medication.nsaidTaken).length;
      return nsaidDays > logs.length * 0.5;   // NSAIDs on >50% of days
    },
    insight: "You've been taking NSAIDs on more than half of your tracked days. Long-term frequent NSAID use carries GI and cardiovascular risks. If your pain requires this level of management, discuss hormonal or other treatment options with your doctor.",
    minDataDays: 28,
  },

  // INSIGHT 7: Sleep-pain cycle
  {
    id: 'sleep_pain_cycle',
    trigger: (logs) => {
      const poorSleepHighPainDays = logs.filter(l => l.systemic.sleep.quality >= 2 && l.pain.overall >= 6).length;
      return poorSleepHighPainDays > logs.length * 0.4;
    },
    insight: "On more than 40% of your tracked days, you're experiencing both poor sleep and high pain. Poor sleep amplifies pain sensitivity — breaking this cycle, through treatment, sleep hygiene, or pelvic physiotherapy, may help both.",
    minDataDays: 21,
  },
]
```

---

## Section 7: Physician Report Specification

The physician report is a structured PDF designed to be read by a gynaecologist in under 5 minutes. Content in clinical priority order:

### Report Section Order (F-Priority)
1. **Patient summary** — age, diagnosis status, rASRM stage if known, surgical history summary, years to diagnosis
2. **Current treatment** — medication name, dose, route, start date, purpose, response-to-date
3. **Chief complaints today** — user-defined "what I want to discuss today" (free text, appears prominently)
4. **Pain data** — NRS per type (dysmenorrhea, CPP, dyspareunia, dyschezia, dysuria) as 3-month trend chart. Average NRS per type. Worst day in period. Responder status vs. baseline.
5. **EHP-30 scores** — most recent assessment, subscale breakdown, trend vs. 3 months ago, control/powerlessness score highlighted
6. **B&B symptom score** — current month, trend
7. **Bleeding log** — flow pattern, HMB flag if present, intermenstrual spotting
8. **GI and urinary symptoms** — cyclical pattern noted, rectal/hematuria flags
9. **Comorbidity status** — PHQ-9 score, GAD-7 score, PSQI, fatigue average
10. **Lab vault** — CA-125 trend, AMH trend, TSH, imaging findings
11. **PFPT and non-pharmacological** — active treatments, patient-reported response
12. **Work/functional impact** — days missed, presenteeism proportion, EHP-30 work module score

---

## Section 8: Adolescent Mode

When `state.endoOnboarding.ageAtDiagnosis < 18` or `state.age < 19`:

```js
state.endoAdolescentMode = {
  enabled: bool,
  // Language adjustments
  // - "Your period" not "menstruation"
  // - "Stomach cramps" as alternative label for dysmenorrhea
  // - School/study impact field instead of work impact
  // - Parent/carer awareness card (opt-in)
  schoolAbsenceDays: number,   // tracked instead of / in addition to work days
  supportPersonAware: bool,    // parent / school counsellor awareness
  adolescentNote: "Period pain that stops you going to school or doing normal activities is not normal and deserves investigation, no matter your age.",
}
```

---

## Section 9: State Shape Summary

All new state keys added for endometriosis module:

| State Key | Type | Purpose |
|-----------|------|---------|
| `state.endoOnboarding` | Object | Condition setup, known subtype, comorbidities, surgery history |
| `state.endoStagingLog` | Array | rASRM staging records with date and method |
| `state.endoDailyLog[date]` | Object | Full daily symptom log (pain NRS per type, GI, urinary, bleeding, systemic, mood, meds, triggers, impact) |
| `state.ehp30Log[date]` | Object | Monthly EHP-30 assessment (30 items, 5+6 subscale scores, trends) |
| `state.ehp5Log[date]` | Object | Weekly EHP-5 short-form assessment |
| `state.bbLog[date]` | Object | Monthly B&B symptom severity scale |
| `state.endoPhq9Log[date]` | Object | Monthly PHQ-9 depression screening |
| `state.endoGad7Log[date]` | Object | Monthly GAD-7 anxiety screening |
| `state.endoLabVault` | Object | CA-125, AMH, FSH, E2, TSH, CRP; imaging records |
| `state.endoTreatmentLog` | Object | Current + historical treatments; response logs |
| `state.endoSurgicalHistory` | Array | Surgical records with type, findings, outcome |
| `state.endoNonPharmaLog` | Object | PFPT, diet, mind-body, TENS, supplements |
| `state.endoAdolescentMode` | Object | Adolescent-specific tracking fields |

---

## Section 10: Clinical Rules Summary

| Rule | Trigger | Response | Priority |
|------|---------|---------|---------|
| Cyclical rectal bleeding | `gi.rectalBleeding = true` | "See doctor — bowel endo assessment needed" | Safety |
| Cyclical hematuria | `urinary.hematuria = true` | "See urologist — bladder endo assessment" | Safety |
| Cyclical shoulder pain | `shoulderPain ≥4 on period day` | "Discuss thoracic endo with specialist" | Safety |
| PHQ-9 item 9 ≥ 1 | `item9 ≥ 1` | Crisis protocol | Critical safety |
| PHQ-9 total ≥ 10 | `total ≥ 10` | "See doctor — depression screening" with endo context note | High |
| CA-125 elevation | `value > 35 IU/mL` | Contextual caveat — not diagnostic | Info |
| AMH decline >20% | Two consecutive AMH values | "Discuss ovarian reserve with gynaecologist" | Caution |
| TSH elevation | `TSH > 4.5 mIU/L` | "Discuss thyroid function — 7× elevated risk in endo" | Caution |
| Very heavy bleeding | `flowLevel = very_heavy + large clots` | "Adenomyosis component — discuss with doctor" | Caution |
| NSAID >50% of days | >50% of tracked days | "Discuss alternative treatment — NSAID overuse risk" | Info |
| Severe pain despite treatment | 7-day avg ≥7 on treatment | "Treatment may need review — contact gynaecologist" | Caution |
| Ureteral DIE education | DIE subtype flagged at onboarding | One-time renal ultrasound reminder | Info |
| NRS ≥30% reduction | Vs baseline 30 days pre-treatment | "Treatment response detected — positive signal" | Insight |
