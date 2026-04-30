# HormonaIQ — Perimenopause Complete Feature & Data-Logging Specification

**Version:** 1.0
**Date:** April 2026
**Audience:** Engineering, product, clinical advisory board
**Classification:** Internal working document — clinical-grade
**Companion:** `perimenopause-primer.md` (education), `features.md` §perimenopause (product), `pcos-complete-spec.md` + `pmdd-complete-spec.md`

---

## Preface

This document is the canonical specification for every perimenopause-related feature and data point in HormonaIQ. It is grounded in the STRAW+10 consensus staging framework, the Greene Climacteric Scale (GCS), NAMS/BMS/IMS/RANZCOG 2022–2024 clinical guidelines, NICE NG23, ESHRE 2016 POI guidelines, and peer-reviewed literature. Every data field collected has a clinical justification. Every alert threshold has an evidence base. Every feature has a clinical reason to exist.

Perimenopause is not "female aging." It is a multi-year neuroendocrine transition with cardiovascular, skeletal, cognitive, and psychiatric consequences. The tracking app for this transition is not a wellness journal. It is a clinical instrument.

---

## SECTION 1: CLINICAL FOUNDATION

### 1.1 STRAW+10 Staging System (International Consensus 2011)

*Source: Harlow et al., 2012, Climacteric; Soules et al., 2001, Fertility and Sterility*

The app assigns and updates each user's STRAW+10 stage dynamically, based on menstrual pattern data and optionally entered FSH/AMH lab values.

**Stage definitions and automated staging logic:**

| Stage | Code | Clinical criteria | Auto-staging rule |
|-------|------|------------------|------------------|
| Early perimenopause | **-2** | ≥2 consecutive cycles with ≥7-day difference in length | `cycleVariability >= 7 && cycleVariability < 60` |
| Late perimenopause | **-1** | ≥60-day gap between periods, in the last 1–3 years | `maxGap >= 60 && maxGap < 365` |
| Final Menstrual Period | **0** | Last period; identifiable only retrospectively | Automatically assigned 12 months after last period log |
| Early postmenopause A | **+1a** | Year 1 after FMP | `monthsSinceFMP >= 12 && monthsSinceFMP < 24` |
| Early postmenopause B | **+1b** | Year 2 after FMP | `monthsSinceFMP >= 24 && monthsSinceFMP < 36` |
| Early postmenopause C | **+1c** | Years 3–6 after FMP | `monthsSinceFMP >= 36 && monthsSinceFMP < 84` |
| Late postmenopause | **+2** | >6 years after FMP | `monthsSinceFMP >= 84` |

**Note:** Users at Stage -3 (regular cycles, no symptoms, pre-transition) may use HormonaIQ for cycle tracking but the perimenopause-specific modules are not activated. Stage -3 users with early vasomotor symptoms may self-identify as "-3b" (early reproductive aging) in onboarding.

**Staging data inputs:**

```
// Menstrual pattern data (primary staging driver)
state.periMenstrualLog = {
  [dateKey]: {
    type: 'period_start' | 'period_end' | 'spotting' | 'breakthrough_bleed' | 'amenorrhea_note',
    flow: 'none' | 'spotting' | 'light' | 'medium' | 'heavy' | 'very_heavy',
    noteHeavy: boolean,          // clinically significant heavy (>80mL estimated, soaking pad in <1hr)
    intermenstrual: boolean,     // bleeding between expected periods
    durationDays: number | null
  }
}

// Computed staging values
state.periStaging = {
  currentStage: '-2' | '-1' | '0' | '+1a' | '+1b' | '+1c' | '+2',
  lastPeriodDate: string,        // ISO date string
  monthsSinceFMP: number | null, // null until FMP confirmed (12 months amenorrhea)
  cycleVariabilityDays: number,  // max day-difference in last 12 months
  maxGapDays: number,            // longest amenorrhea stretch in last 12 months
  stageConfidence: 'auto' | 'user-confirmed' | 'lab-confirmed',
  poiConfirmed: boolean,         // true if user confirmed POI diagnosis
  poiDiagnosisAge: number | null
}
```

---

### 1.2 Greene Climacteric Scale (GCS) — Full Specification

*Source: Greene, 1998, Maturitas; validated by numerous international studies*

**Purpose:** Standardized perimenopause symptom severity assessment. Used at baseline, then every 3 months or after treatment changes.

**Items and subscales (full verbatim items):**

**Subscale 1: Psychological — Anxiety (Items 1–6)**

| # | Item text (verbatim) | Response scale |
|---|---------------------|----------------|
| 1 | Heart beating quickly or strongly | 0=Not at all / 1=A little / 2=Quite a bit / 3=Extremely |
| 2 | Feeling tense or nervous | 0–3 |
| 3 | Difficulty sleeping | 0–3 |
| 4 | Excitability | 0–3 |
| 5 | Attacks of panic | 0–3 |
| 6 | Difficulty concentrating | 0–3 |

**Subscale 2: Psychological — Depression (Items 7–11)**

| # | Item text (verbatim) | Response scale |
|---|---------------------|----------------|
| 7 | Feeling tired or lacking in energy | 0–3 |
| 8 | Loss of interest in most things | 0–3 |
| 9 | Feeling unhappy or depressed | 0–3 |
| 10 | Crying spells | 0–3 |
| 11 | Irritability | 0–3 |

**Subscale 3: Somatic (Items 12–18)**

| # | Item text (verbatim) | Response scale |
|---|---------------------|----------------|
| 12 | Dizziness or faintness | 0–3 |
| 13 | Pressure or tightness in head or body | 0–3 |
| 14 | Parts of body feel numb or tingling | 0–3 |
| 15 | Headaches | 0–3 |
| 16 | Muscle and joint pains | 0–3 |
| 17 | Loss of feeling in hands or feet | 0–3 |
| 18 | Breathing difficulties | 0–3 |

**Subscale 4: Vasomotor (Items 19–20)**

| # | Item text (verbatim) | Response scale |
|---|---------------------|----------------|
| 19 | Hot flushes | 0–3 |
| 20 | Sweating at night | 0–3 |

**Item 21: Sexual function**

| # | Item text (verbatim) | Response scale |
|---|---------------------|----------------|
| 21 | Loss of interest in sex | 0–3 |

**Scoring rules:**

```javascript
// GCS Subscale Scoring
GCS_SUBSCALES = {
  anxiety:    { items: [1,2,3,4,5,6],    max: 18, threshold: 10 },
  depression: { items: [7,8,9,10,11],    max: 15, threshold: 7  },
  somatic:    { items: [12,13,14,15,16,17,18], max: 21, threshold: 9 },
  vasomotor:  { items: [19,20],          max: 6,  threshold: 3  },
  sexual:     { items: [21],             max: 3,  threshold: 2  }
}

GCS_TOTAL_MAX = 63

// Treatment response threshold
GCS_RESPONSE_THRESHOLD = 0.30  // 30% reduction in total score = treatment response
```

**Alert rules:**
- GCS depression subscale ≥ 10 → trigger mental health check-in + PHQ-9 prompt
- GCS total ≥ 42 → "High burden" — prompt to discuss with provider this month
- GCS vasomotor subscale = 6 (max) for ≥4 consecutive weeks → trigger HRT consideration educational content

**State shape:**
```javascript
state.gcsLog = {
  [dateKey]: {
    items: [0,0,0,...], // 21 values, 0–3 each
    totalScore: number,
    anxietyScore: number,
    depressionScore: number,
    somaticScore: number,
    vasomotorScore: number,
    sexualScore: number,
    completedAt: timestamp
  }
}
```

---

### 1.3 Hot Flash / Vasomotor Symptom (VMS) Logging

**Data model (time-stamped, granular):**

```javascript
state.hotFlashLog = {
  [dateKey]: [
    {
      time: 'HH:MM',
      severity: 'mild' | 'moderate' | 'severe',  // 1/2/3
      duration: '<1min' | '1-3min' | '3-5min' | '>5min',
      type: 'hot_flash' | 'night_sweat' | 'both',
      trigger: string | null,            // user-entered trigger tag
      woke_from_sleep: boolean,          // if night sweat
      sheet_change_required: boolean,    // if night sweat
      accompaniedBy: {
        palpitations: boolean,
        chills: boolean,
        nausea: boolean,
        anxiety: boolean
      }
    }
  ]
}
```

**Severity thresholds (clinical standard, NAMS 2022):**

| Severity | Per 24h count | Sleep disruption | Clinical classification |
|----------|-------------|-----------------|------------------------|
| Mild | 1–6 | None/minimal | Does not qualify for pharmacotherapy based on frequency alone |
| Moderate | 7–10 | Some | Qualifies for treatment discussion |
| Severe | >10 | Significant | First-line treatment indicated |
| Very Severe | >20 or any | Complete | Urgent treatment; may indicate other pathology |

**Daily VMS summary:**
```javascript
state.vmsDaily = {
  [dateKey]: {
    totalFlashes: number,
    nightSweats: number,
    severityScore: 1 | 2 | 3,    // max severity that day
    sleepDisruptions: number,     // times woken from night sweats
    compositeScore: number        // (total × severity) / 3 — trackable trend metric
  }
}
```

---

### 1.4 Pittsburgh Sleep Quality Index (PSQI)

*Source: Buysse et al., 1989, Psychiatry Research. Validated globally in menopausal populations.*

**Purpose:** Validated 19-item sleep quality assessment. Score >5 = poor sleep quality.

**7 component domains:**
1. Subjective sleep quality (1 item)
2. Sleep latency (2 items)
3. Sleep duration (1 item)
4. Sleep efficiency (2 items)
5. Sleep disturbances (9 items)
6. Use of sleep medication (1 item)
7. Daytime dysfunction (2 items)

**Each component scored 0–3; total score 0–21.**

**Thresholds:**
- ≤5: Good sleep quality
- 6–10: Poor sleep quality (common in perimenopause; discuss management)
- 11–21: Severely poor sleep quality → prompt evaluation for sleep apnea, restless legs, clinical management

**State shape:**
```javascript
state.psqiLog = {
  [dateKey]: {
    items: [...], // component scores
    globalScore: number,
    component1_quality: 0|1|2|3,
    component2_latency: 0|1|2|3,
    component3_duration: 0|1|2|3,
    component4_efficiency: 0|1|2|3,
    component5_disturbances: 0|1|2|3,
    component6_medication: 0|1|2|3,
    component7_dysfunction: 0|1|2|3
  }
}
```

---

### 1.5 Daily Perimenopause Symptom Log

**Purpose:** Brief daily logging (under 45 seconds) capturing the full perimenopause symptom spectrum. Designed for real-time capture on symptomatic days.

```javascript
state.periDailyLog = {
  [dateKey]: {
    // Vasomotor
    hotFlashCount: number,          // total today
    nightSweatsCount: number,       // total last night
    
    // Mood (0–3 scale: 0=none, 1=mild, 2=moderate, 3=severe)
    mood: {
      anxious: 0|1|2|3,
      irritable: 0|1|2|3,
      depressed: 0|1|2|3,
      tearful: 0|1|2|3,
      rage: 0|1|2|3,
      panicked: 0|1|2|3
    },
    
    // Cognitive (0–3)
    cognitive: {
      brainFog: 0|1|2|3,
      memoryLapses: 0|1|2|3,
      wordFinding: 0|1|2|3,
      concentration: 0|1|2|3
    },
    
    // Physical (0–3)
    physical: {
      fatigue: 0|1|2|3,
      jointPain: 0|1|2|3,
      headache: 0|1|2|3,
      bloating: 0|1|2|3,
      breastTenderness: 0|1|2|3,
      palpitations: 0|1|2|3,
      skinCrawling: 0|1|2|3,  // formication
      dryEyes: 0|1|2|3
    },
    
    // Genitourinary (logged weekly, not daily)
    gsm: {
      vaginalDryness: 0|1|2|3,
      dyspareunia: 0|1|2|3,
      urinaryUrgency: 0|1|2|3,
      urinaryIncontinence: 0|1|2|3,
      utiFlagThisWeek: boolean
    },
    
    // Sleep (previous night summary)
    sleep: {
      hoursEstimate: number,
      quality: 1|2|3|4|5,          // 1=terrible, 5=excellent
      wokenByNightSweats: boolean,
      timesWoken: number
    },
    
    // Wellbeing overall
    energyLevel: 1|2|3|4|5,
    overallWellbeing: 1|2|3|4|5,
    
    // Cycle note
    cycleNote: 'period' | 'spotting' | 'breakthrough' | 'none',
    
    // Voice note
    voiceNoteUri: string | null,
    
    // Logged at
    loggedAt: timestamp
  }
}
```

---

### 1.6 Genitourinary Syndrome of Menopause (GSM) Detailed Tracker

**Purpose:** Monthly assessment of GSM symptom severity. Under-reported; direct, destigmatized tracking closes the clinical gap.

```javascript
state.gsmAssessment = {
  [YYYY-MM]: {  // monthly
    vaginalDryness: 0|1|2|3,        // 0=none, 3=severe
    vaginalItching: 0|1|2|3,
    vaginalBurning: 0|1|2|3,
    dyspareunia: 0|1|2|3,           // pain with intercourse
    sexualAvoidance: boolean,       // avoiding sex due to symptoms
    urinaryFrequency: 0|1|2|3,
    urinaryUrgency: 0|1|2|3,
    urgeIncontinence: 0|1|2|3,
    stressIncontinence: 0|1|2|3,
    recurrentUTI: boolean,
    utisThisMonth: number,
    localTreatmentUsed: string[],   // ['vaginal_estrogen', 'lubricant', 'moisturiser', 'ospemifene', 'dhea']
    lubricantUsed: boolean,
    gsmCompositeScore: number       // sum of all 0–3 items
  }
}
```

**Alert:** GSM composite score ≥ 12 for 2 consecutive months → prompt to discuss treatment with provider (specifically local vaginal estrogen, if not already using).

---

## SECTION 2: LAB VAULT AND BIOMARKER TRACKING

### 2.1 Perimenopause Lab Panel

```javascript
state.periLabVault = {
  [dateKey]: {
    // Reproductive hormones
    fsh: number | null,               // mIU/mL; Day 2–5 of cycle preferred
    lh: number | null,                // mIU/mL
    estradiol_e2: number | null,      // pg/mL (pmol/L in AU: multiply by 3.67)
    progesterone: number | null,      // ng/mL; ideally Day 21 or 7DPO
    amh: number | null,               // ng/mL (pmol/L in AU: multiply by 7.14)
    testosterone_total: number | null, // ng/dL
    testosterone_free: number | null, // pg/mL
    shbg: number | null,              // nmol/L
    
    // Thyroid (shared symptom differentiator)
    tsh: number | null,               // mIU/L
    free_t3: number | null,           // pmol/L
    free_t4: number | null,           // pmol/L
    tpo_antibodies: number | null,    // IU/mL (if Hashimoto's screening)
    
    // Metabolic
    fasting_glucose: number | null,   // mmol/L
    hba1c: number | null,             // %
    fasting_insulin: number | null,   // µIU/mL
    homa_ir: number | null,           // calculated: (glucose × insulin) / 22.5
    triglycerides: number | null,     // mmol/L
    ldl_cholesterol: number | null,   // mmol/L
    hdl_cholesterol: number | null,   // mmol/L
    total_cholesterol: number | null, // mmol/L
    
    // Bone and nutrition
    vitamin_d: number | null,         // nmol/L (AU) or ng/mL (US)
    calcium: number | null,           // mmol/L
    
    // Other
    ferritin: number | null,          // µg/L (iron stores; heavy bleeding → low ferritin)
    haemoglobin: number | null,       // g/dL
    
    // Metadata
    cycleDay: number | null,          // if still cycling; affects hormone interpretation
    fasting: boolean,                 // whether fasting blood draw
    labName: string | null,
    orderingProvider: string | null,
    notes: string | null
  }
}
```

**Interpretation flags (automated):**

| Lab | Alert threshold | Message |
|-----|----------------|---------|
| FSH (Day 2–5) | >10 → early peri signal; >25 → late peri/POI | "Your FSH of {X} is consistent with [stage]. Discuss with your doctor." |
| FSH | >40 | "FSH >40 on Day 2–5 is consistent with postmenopause. Has it been 12+ months since your last period?" |
| E2 | <20 pg/mL | "Your estradiol is below postmenopausal threshold — this suggests estrogen deficiency. Consider discussing with your provider." |
| AMH | <0.5 ng/mL | "Low AMH suggests reduced ovarian reserve — consistent with late perimenopause." |
| TSH | <0.4 or >4.0 | "Thyroid function outside normal range — this can cause symptoms similar to perimenopause. Worth discussing with your doctor." |
| Vitamin D | <50 nmol/L | "Low vitamin D affects bone density and mood. Supplementation is standard care." |
| Ferritin | <15 µg/L | "Low iron stores — if you've had heavy periods, iron deficiency is common. Discuss supplementation." |
| HbA1c | ≥5.7% | "Pre-diabetes range. Insulin resistance often worsens in perimenopause. Lifestyle + medication discussion warranted." |

---

### 2.2 Bone Density (DEXA Scan) Vault

```javascript
state.dexaVault = {
  [dateKey]: {
    lumbarSpine_tscore: number | null,  // L1–L4
    hipTotal_tscore: number | null,     // total hip
    femoralNeck_tscore: number | null,  // femoral neck (most predictive for hip fracture)
    forearm_tscore: number | null,      // distal 1/3 radius (optional)
    
    // Z-scores (comparison to age-matched; more relevant for POI patients)
    lumbarSpine_zscore: number | null,
    hip_zscore: number | null,
    
    fraxScore: number | null,           // 10-year major fracture risk %
    fraxHipScore: number | null,        // 10-year hip fracture risk %
    
    classification: 'normal' | 'osteopenia' | 'osteoporosis',
    facility: string | null,
    reportedBy: string | null
  }
}
```

**Alert logic:**
- T-score ≤ -2.5 at any site → "Your bone scan shows osteoporosis. Treatment significantly reduces fracture risk — please discuss with your doctor."
- T-score between -1.0 and -2.5 → "Osteopenia detected. This is common in perimenopause and early postmenopause. Calcium, vitamin D, and discussion of HRT are standard next steps."
- FRAX 10-year major fracture risk >20% or hip fracture risk >3% → treatment threshold regardless of T-score

---

### 2.3 Blood Pressure Log

```javascript
state.bpLog = {
  [dateKey]: [
    {
      systolic: number,
      diastolic: number,
      pulse: number,
      time: 'morning' | 'afternoon' | 'evening',
      notes: string | null
    }
  ]
}

// Computed
state.bpSummary = {
  [YYYY-MM]: {
    avgSystolic: number,
    avgDiastolic: number,
    maxSystolic: number,
    hypertensionFlag: boolean  // any systolic ≥ 140 or diastolic ≥ 90
  }
}
```

**Alert:** Systolic ≥ 160 or diastolic ≥ 100 on 2+ consecutive days → "Your blood pressure readings are elevated — this needs prompt medical attention. Please contact your doctor or seek urgent care."

---

## SECTION 3: TREATMENT TRACKING

### 3.1 MHT/HRT Tracker

```javascript
state.hrtConfig = {
  isUsing: boolean,
  startDate: string | null,
  
  estrogen: {
    type: 'estradiol' | 'conjugated_equine' | 'none',
    delivery: 'transdermal_patch' | 'transdermal_gel' | 'transdermal_spray' | 'oral' | 'vaginal' | 'implant',
    brandName: string | null,
    dose: string | null,           // e.g., "50mcg patch", "1.5mg gel"
    frequency: 'daily' | 'twice_weekly' | 'weekly' | 'other',
    startDate: string | null
  },
  
  progestogen: {
    type: 'micronized_progesterone' | 'medroxyprogesterone' | 'norethisterone' | 'dydrogesterone' | 'levonorgestrel_iud' | 'none',
    delivery: 'oral' | 'vaginal' | 'iud' | 'patch_combined',
    brandName: string | null,
    dose: string | null,
    regimen: 'sequential_12days' | 'sequential_14days' | 'continuous' | 'other',
    startDate: string | null
  },
  
  vaginalEstrogen: {
    isUsing: boolean,
    type: 'estriol_cream' | 'estradiol_tablet' | 'estradiol_ring' | 'dhea' | 'other',
    frequency: 'daily' | 'twice_weekly' | 'weekly',
    brandName: string | null,
    startDate: string | null
  },
  
  testosterone: {
    isUsing: boolean,
    brandName: string | null,
    dose: string | null,
    frequency: string | null,
    startDate: string | null
  },
  
  nonHormonal: {
    ssri_snri: string | null,           // drug name
    fezolinetant: boolean,
    gabapentin: boolean,
    clonidine: boolean,
    ospemifene: boolean,
    otherMeds: string[]
  },
  
  sideEffects: string[],               // user-tagged side effects
  stoppedDate: string | null,
  stoppedReason: string | null,
  
  changeLog: [
    {
      date: string,
      change: string,                  // free text description of what changed
      reason: string | null
    }
  ]
}
```

**Treatment response tracking:**
- Compare GCS total score at HRT start vs. 3, 6, 12 months
- Compare VMS frequency at start vs. 3, 6, 12 months
- Compare PSQI global score at start vs. 3 months
- Auto-generate "treatment response summary" for physician report

---

### 3.2 Supplement Tracker

```javascript
state.periSupplements = [
  {
    name: string,                     // e.g., "Calcium Carbonate", "Vitamin D3", "Magnesium"
    dose: string,                     // e.g., "500mg", "2000IU"
    frequency: 'daily' | 'twice_daily' | 'weekly',
    startDate: string,
    indication: 'bone' | 'sleep' | 'mood' | 'vasomotor' | 'other',
    active: boolean
  }
]
```

---

## SECTION 4: SAFETY FEATURES

### 4.1 Depression Safety Protocol (Perimenopause-Specific)

**Trigger conditions:**
1. GCS depression subscale ≥ 10 on any assessment
2. PHQ-9 score ≥ 10 when administered
3. periDailyLog.mood.depressed = 3 on 3+ consecutive days
4. User taps "I'm struggling" or "I don't want to be here" on any screen

**Safety flow:**
- Tier 1: Validation card with assessment prompt ("You've logged high distress for several days. How are you doing right now?")
- Tier 2: PHQ-9 administration + safety question ("Over the last 2 weeks, have you had thoughts of hurting yourself?")
- Tier 3: Full-screen crisis resource if PHQ-9 item 9 ≥ 2 ("Thoughts that you would be better off dead or of hurting yourself")

**PHQ-9 suicidality item thresholds:**
- Score 0–1: Monitoring mode
- Score 2–3: Enhanced support + resource surfacing
- Score 3: Immediate crisis resources (as per crisis-service.jsx Tier 3 protocol)

### 4.2 Heavy Bleeding Safety Alert

**Trigger:** Any log entry with `noteHeavy: true` OR `periDailyLog.cycleNote = 'breakthrough'` + `periDailyLog.physical.bloating ≥ 2`

**Alert:** "Heavy or unexpected bleeding can have several causes in perimenopause, some of which need prompt evaluation. Please contact your GP or gynaecologist this week — especially if this is a new pattern."

**Critical rule:** Any logged post-menopausal bleeding (after 12+ months of no periods) triggers an urgent alert: "Bleeding after menopause always requires medical evaluation. Please contact your doctor today."

### 4.3 Cardiovascular Alert

**Trigger:** BP systolic ≥ 160 OR diastolic ≥ 100 on any single reading; OR average ≥ 140/90 over 7 days

**Alert:** Phase-appropriate clinical language directing user to seek prompt care.

### 4.4 POI Mental Health Support

**Special protocol for users with confirmed POI:**
- Acknowledge grief and shock at diagnosis in onboarding
- PHQ-9 administered at onboarding + 1 month + 3 months
- GAD-7 at same intervals
- Fertility conversation handled with explicit care: "We know this may not be what you wanted to read. If you want to discuss fertility options, a reproductive endocrinologist can talk through what's possible for you."

---

## SECTION 5: CLINICAL INSTRUMENTS REFERENCE

### 5.1 PHQ-9 (Patient Health Questionnaire-9)

*Used for depression screening in perimenopause. Validated in menopausal populations.*

**9 items, each 0–3 (Not at all / Several days / More than half the days / Nearly every day):**
1. Little interest or pleasure in doing things
2. Feeling down, depressed, or hopeless
3. Trouble falling asleep / staying asleep / sleeping too much
4. Feeling tired or having little energy
5. Poor appetite or overeating
6. Feeling bad about yourself — a failure or letting yourself down
7. Trouble concentrating on things
8. Moving or speaking so slowly others notice; or being fidgety/restless
9. Thoughts that you would be better off dead or of hurting yourself

**Scoring thresholds:**
| Score | Severity | Clinical action |
|-------|---------|----------------|
| 0–4 | None–minimal | Monitor |
| 5–9 | Mild | Watchful waiting; consider lifestyle support |
| 10–14 | Moderate | Warrants discussion of treatment; consider referral |
| 15–19 | Moderately severe | Treatment indicated; refer if not already treated |
| 20–27 | Severe | Urgent treatment; immediate referral |

### 5.2 GAD-7 (Generalized Anxiety Disorder-7)

*Anxiety screening — particularly relevant given perimenopause-related new-onset anxiety and panic.*

**7 items, 0–3 each:**
1. Feeling nervous, anxious, or on edge
2. Not being able to stop or control worrying
3. Worrying too much about different things
4. Trouble relaxing
5. Being so restless that it is hard to sit still
6. Becoming easily annoyed or irritable
7. Feeling afraid as if something awful might happen

**Thresholds:**
| Score | Severity |
|-------|---------|
| 0–4 | Minimal |
| 5–9 | Mild |
| 10–14 | Moderate — warrants discussion |
| ≥15 | Severe — referral recommended |

### 5.3 PSQI (Pittsburgh Sleep Quality Index)

See Section 1.4.

### 5.4 Menopause Rating Scale (MRS)

*Alternative to GCS for symptom burden tracking; used in clinical trials.*

**11 items, scored 0–4:**
- Somatic: hot flushes/sweating (item 1), heart discomfort (2), sleep problems (3), joint and muscle discomfort (4)
- Psychological: depressive mood (5), irritability (6), anxiety (7), mental exhaustion (8)
- Urogenital: sexual problems (9), bladder problems (10), dryness of vagina (11)

**Subscale totals and total score (max 44).**

---

## SECTION 6: AUTOMATED INSIGHTS ENGINE (PERIMENOPAUSE)

### 6.1 Pattern Detection Rules

**Hot flash trigger analysis:**
- Input: `hotFlashLog` + `periDailyLog` (food notes, stress, sleep, caffeine flag)
- Output: Personal trigger correlation score per item
- Method: Log-binomial regression on 30-day windows; minimum 10 flash events before surfacing insights
- Display: "Alcohol appears to increase your hot flash frequency the following day" only when correlation r > 0.3 and n ≥ 10

**Sleep-VMS correlation:**
- If PSQI component 5 (disturbances) score correlates with prior-night hot flash count (r > 0.3), surface: "Your sleep quality tends to be worse on nights you have more night sweats."

**GCS trend analysis:**
- Auto-generate 3-month trend line for each GCS subscale
- Surface when any subscale is trending up ≥ 20% over 3 months: "Your [anxiety/depression/vasomotor] score has increased over the last 3 months. It may be worth a check-in with your provider."

**HRT response analysis:**
- Compare GCS subscale scores pre-HRT vs. 3 months post-HRT start
- Surface: "Since starting HRT, your vasomotor symptoms have reduced by {X}% and your sleep score has improved by {Y} points."

**Stage transition detection:**
- Auto-detect Stage -2→-1 transition when maxGapDays ≥ 60
- Notify user: "Your cycle patterns suggest you may be entering late perimenopause. This doesn't require any action — but it may be worth checking in with your doctor."

---

## SECTION 7: PHYSICIAN REPORT SPECIFICATION

### 7.1 Perimenopause Physician Report

**Trigger:** User requests; or after 3+ months of data accumulation

**Content (in order):**

1. **Patient summary header**
   - Age, STRAW+10 stage (auto-estimated), date range covered
   - POI flag if applicable

2. **Vasomotor Summary (VMS)**
   - Average hot flash frequency per 24h (past 30 days)
   - Average night sweat frequency per night
   - Severity distribution (% mild / moderate / severe)
   - VMS trend graph (12-week view)

3. **Greene Climacteric Scale Scores**
   - Most recent GCS (full subscale breakdown)
   - If 2+ GCS assessments: trend line per subscale
   - Comparison to baseline (if available)

4. **Sleep Quality (PSQI)**
   - Most recent global score
   - Trend over time

5. **Mood and Mental Health**
   - PHQ-9 and GAD-7 scores (most recent + trend)
   - GSM depression/anxiety subscores from GCS

6. **GSM Assessment**
   - Most recent monthly GSM composite score
   - Flagged symptoms (dyspareunia, recurrent UTI, urinary urgency)

7. **Lab Values (user-entered)**
   - Most recent FSH, E2, AMH, TSH, fasting glucose, HbA1c, lipid panel
   - DEXA T-scores (if entered)

8. **Treatment History**
   - Current HRT regimen (type, dose, route, duration)
   - Any changes in the past 12 months
   - Non-hormonal treatments if applicable
   - Supplements

9. **Menstrual Pattern**
   - Last period date
   - Pattern summary (regular/irregular/amenorrhea duration)
   - Any heavy or breakthrough bleeding flagged

10. **Clinical Notes**
    - Any automated safety alerts triggered in the reporting period

**Format:** Exportable PDF (or printable HTML). Designed for a GP or gynaecologist to read in 2 minutes during an appointment.

---

## SECTION 8: ONBOARDING DATA COLLECTION

### 8.1 Required Perimenopause Onboarding Data

```javascript
state.periOnboarding = {
  // Age and history
  dateOfBirth: string,               // YYYY-MM-DD
  lastPeriodDate: string | null,
  periodsRegular: boolean | null,
  cycleChangesStartedDate: string | null,  // when did things start changing
  
  // Diagnosis and history
  hasDiagnosis: boolean | null,      // has a doctor confirmed perimenopause/menopause
  poiDiagnosed: boolean,
  hysterectomy: boolean,
  oophorectomy: 'none' | 'unilateral' | 'bilateral',
  
  // Co-existing conditions (crosses with PMDD, PCOS, ADHD modules)
  hasPMDD: boolean,
  hasPCOS: boolean,
  hasADHD: boolean,
  
  // Current symptoms (checkbox grid at onboarding)
  currentSymptoms: string[],         // from symptom list
  
  // Current treatment
  currentlyOnHRT: boolean,
  
  // Goals
  trackingGoals: string[],           // ['manage_symptoms', 'prepare_for_doctor', 'understand_transition', 'monitor_bone_health', 'fertility_preservation']
  
  // Fertility
  wantsPregnancy: boolean | null,    // relevant for POI users
  
  // Risk factors (for cardiovascular, bone, cancer)
  smoker: boolean,
  bmiSelfReport: number | null,
  familyHistoryOsteoporosis: boolean,
  familyHistoryHeartDisease: boolean,
  familyHistoryBreastCancer: boolean,
  previousBloodClot: boolean,
  migraine: boolean,
  migraineWithAura: boolean
}
```

### 8.2 Contraindications Screening for HRT Education Content

The app does NOT prescribe. However, when delivering HRT educational content, it must flag that certain conditions require specialist discussion rather than standard GP care:

- Migraine with aura → flag: combined oral contraceptive and some oral estrogens carry stroke risk; transdermal preferred; must discuss with doctor
- Previous VTE (blood clot) → transdermal estrogen has no elevated clot risk; oral estrogen does; must clarify with doctor
- Active liver disease → oral HRT contraindicated; transdermal preferred
- Hormone-sensitive cancer (personal history of estrogen-receptor-positive breast cancer) → systemic HRT requires oncologist discussion; local vaginal estrogen is usually considered safe but requires discussion
- BMI > 35 → elevated clot risk with oral estrogen; transdermal strongly preferred

**Rule:** The app does not tell users not to take HRT. It tells users which conversations to have and which HRT format discussions are most relevant to their risk profile.

---

## SECTION 9: STATE SHAPE SUMMARY

All perimenopause state fields added to `defaultState` in `app.jsx`:

```javascript
// Perimenopause state block
periStaging: {
  currentStage: null,
  lastPeriodDate: null,
  monthsSinceFMP: null,
  cycleVariabilityDays: 0,
  maxGapDays: 0,
  stageConfidence: 'auto',
  poiConfirmed: false,
  poiDiagnosisAge: null
},
periMenstrualLog: {},          // date → menstrual event object
periDailyLog: {},              // date → daily symptom object
hotFlashLog: {},               // date → [flash events array]
vmsDaily: {},                  // date → VMS summary
gcsLog: {},                    // date → GCS assessment
psqiLog: {},                   // date → PSQI scores
gsmAssessment: {},             // YYYY-MM → monthly GSM
periLabVault: {},              // date → lab values
dexaVault: {},                 // date → DEXA results
hrtConfig: { isUsing: false, changeLog: [] },
periSupplements: [],
phq9Log: {},                   // date → PHQ-9
gad7Log: {},                   // date → GAD-7
bpLog: {},                     // already in state from PCOS spec; shared
periOnboarding: {}
```

---

## SECTION 10: CLINICAL RULES SUMMARY

| Rule | Trigger | Response |
|------|---------|---------|
| Post-menopausal bleeding alert | Any bleeding after 12+ months amenorrhea | Urgent prompt to see doctor today |
| Heavy perimenopausal bleeding | noteHeavy flag or breakthrough bleed | Prompt to see doctor this week |
| High GCS depression | GCS depression subscale ≥ 10 | PHQ-9 prompt + support resources |
| High PHQ-9 | Total ≥ 10 | Clinical action guidance per severity |
| High PHQ-9 item 9 | Score ≥ 2 | Crisis resources (Tier 3 protocol) |
| Hypertension | Any SBP ≥ 160 or DBP ≥ 100 | Urgent medical attention prompt |
| Low vitamin D | <50 nmol/L | Supplementation information |
| Osteoporosis | DEXA T-score ≤ -2.5 | Treatment discussion prompt |
| FSH >40 + amenorrhea | Both conditions present | Stage +1a suggestion; confirm 12-month amenorrhea |
| POI + no HRT | poiConfirmed = true + hrtConfig.isUsing = false | Monthly reminder of HRT recommendation for POI |
| Long symptom duration | GCS total ≥ 35 × 6+ months | Prompt: "You've been tracking significant symptoms for 6 months. Have you discussed treatment options with your doctor?" |

---

*Sources: STRAW+10 (Harlow et al., 2012); GCS (Greene, 1998); NAMS 2022 Position Statement; BMS 2020/2023 Guidelines; IMS Recommendations 2020; RANZCOG 2022; ESHRE 2016 POI Guidelines; NICE NG23 (2015, updated 2019); PHQ-9 (Spitzer et al., 1999); GAD-7 (Spitzer et al., 2006); PSQI (Buysse et al., 1989); MRS (Heinemann et al., 2003); Fezolinetant approval data (Lederman et al., 2023, NEJM); ELITE Trial (Hodis et al., 2016, NEJM); UK Biobank (Vinogradova et al., 2020, BMJ); DOPS Trial (Schierbeck et al., 2012, BMJ)*
