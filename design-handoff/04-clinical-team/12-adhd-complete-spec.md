# ADHD Complete Technical Specification
**Document type:** Technical + Clinical specification  
**Condition:** Attention Deficit Hyperactivity Disorder (ADHD) — women-focused  
**Version:** 1.0 | April 2026  
**Cross-reference:** `docs/01-clinical/adhd-primer.md` · `docs/sprints/round-5-adhd/adhd-team-debates.md`

---

## Overview

This document defines the complete data model, clinical logic, instrument specifications, safety rules, and product architecture for the HormonaIQ ADHD module. It is the authoritative technical reference for all ADHD-related feature development (F122+).

The ADHD module integrates with HormonaIQ's existing cycle log, perimenopause module, and PMDD tracker — cross-condition correlation is a primary clinical value.

---

## Section 1: Condition Onboarding and State Schema

### 1.1 ADHD Onboarding State

```js
state.adhdOnboarding = {
  activatedAt: ISO_DATE,

  // Diagnosis status
  diagnosisStatus: 'undiagnosed' | 'suspected' | 'diagnosed' | 'recently_diagnosed',
  diagnosisDate: ISO_DATE | null,
  diagnosedBy: 'psychiatrist' | 'psychologist' | 'GP' | 'paediatrician' | 'self_suspected' | null,
  ageAtDiagnosis: Number | null,

  // Presentation type (if diagnosed)
  presentationType: 'inattentive' | 'hyperactive_impulsive' | 'combined' | 'unspecified' | null,

  // Hormonal context
  hasRegularCycle: Boolean,
  isOnHormonalContraception: Boolean,
  contraceptionType: 'combined_pill' | 'progestin_only_pill' | 'hormonal_iud' | 'implant' | 'injection' | 'patch' | 'ring' | 'none' | null,
  perimenopausalStatus: 'not_yet' | 'perimenopause' | 'postmenopause' | 'unknown',
  isOnHRT: Boolean,

  // Life stage flags
  postpartumFlag: Boolean,     // postpartum within 24 months
  pregnancyFlag: Boolean,

  // Comorbidity flags (set in onboarding; updated in F131)
  comorbidities: {
    pmdd: Boolean,
    anxiety: Boolean,
    depression: Boolean,
    ocd: Boolean,
    autism: Boolean,
    bipolar: Boolean,
    ptsd: Boolean,
    eating_disorder: Boolean,
    sleep_disorder: Boolean,
    substance_use: Boolean,
    fibromyalgia: Boolean,
    chronic_fatigue: Boolean,
    other: String | null
  },

  // Key symptom domains (pre-fills onboarding summary)
  primaryChallenges: ['time_management', 'task_initiation', 'working_memory', 'emotional_regulation', 'rsd', 'sleep', 'hyperfocus', 'relationships', 'finances', 'masking', 'bfrbs'],

  // Medication status
  currentlyMedicated: Boolean,
  medicationSatisfied: 'very_satisfied' | 'somewhat' | 'neutral' | 'somewhat_dissatisfied' | 'very_dissatisfied' | null,

  // Physician report preferences
  hasRegularPsychiatrist: Boolean,
  hasPrimaryCarePrescriber: Boolean,
  reportFrequency: 'monthly' | 'quarterly' | '6_monthly',

  // Privacy and display
  adultMode: Boolean,          // default true; false = simplified language mode
  brainFogModeEnabled: Boolean // user can activate simplified UI during hard days
}
```

### 1.2 Onboarding Branch Design

**Branch A — Suspected / Undiagnosed:**  
Language: "You're noticing patterns that you want to understand better."  
Emphasis: documentation as a path to assessment; normalizing the recognition of symptoms; preparing for clinical assessment with data.  
First screen copy (locked): "Many women with ADHD aren't diagnosed until their 30s or 40s. If something has always felt harder than it should, it's worth exploring. We'll help you document what your brain is doing — clearly enough to have a useful clinical conversation."

**Branch B — Recently Diagnosed (within 12 months):**  
Language: "You have a new answer and a lot of new questions."  
Emphasis: making sense of diagnosis; medication tracking from the start; building the first months of longitudinal data.  
Educational content: what diagnosis means, what it doesn't mean, why women are diagnosed late.

**Branch C — Diagnosed and Managing:**  
Language: "You know your brain — let's track it precisely."  
Emphasis: clinical instruments for treatment response monitoring; hormonal cycle correlation; physician report generation.  
Fast onboarding path (existing diagnosis → current medication → cycle status → go).

**Branch D — Perimenopausal with ADHD:**  
Language: "The hormones have changed. The treatment may need to change too."  
Emphasis: perimenopause-ADHD intersection; medication adjustment tracking; HRT-ADHD interaction; linking to perimenopause module.

---

## Section 2: Daily Symptom Log

### 2.1 Daily ADHD Log Schema

The daily log is the core data capture mechanism. Designed to complete in under 60 seconds on a standard day. All NRS fields use 0-10 scale. Prompted by morning notification (user-set time).

```js
state.adhdDailyLog[date] = {
  // Core ADHD domains (0-10 NRS each)
  attention_nrs: 0-10,         // "How focused and able to sustain attention were you today?" (0 = couldn't focus at all; 10 = focused and productive)
  impulsivity_nrs: 0-10,       // "Did you act impulsively today — saying or doing things without thinking first?" (0 = not at all; 10 = very much)
  executive_function_nrs: 0-10, // "How easily could you start tasks, organize, and get things done?" (0 = complete paralysis; 10 = smooth and productive)
  working_memory_nrs: 0-10,    // "How was your working memory — holding information, remembering what you were doing?" (0 = very poor; 10 = sharp)
  emotional_regulation_nrs: 0-10, // "How steady were your emotions today?" (0 = very dysregulated/reactive; 10 = steady and regulated)

  // RSD (Rejection Sensitive Dysphoria)
  rsd_episode: Boolean,
  rsd_intensity_nrs: 0-10 | null,    // shown only if rsd_episode = true
  rsd_trigger: 'perceived_criticism' | 'perceived_rejection' | 'fell_short_of_expectations' | 'social_exclusion' | 'other' | null,
  rsd_recovery_time_hours: Number | null, // how many hours until emotional state normalized

  // Hyperfocus and energy cycles
  hyperfocus_episode: Boolean,
  hyperfocus_duration_hours: Number | null,
  hyperfocus_topic: String | null,      // brief text (what was the focus on)
  post_hyperfocus_crash: Boolean,
  crash_severity_nrs: 0-10 | null,

  // Masking effort
  masking_effort_nrs: 0-10,    // "How much effort did you spend today masking or compensating for ADHD symptoms?" (0 = none; 10 = exhausting effort)

  // Time management
  time_blindness_impact: Boolean, // "Did time blindness cause a problem today (late, lost track of time)?"
  missed_appointment_or_deadline: Boolean,

  // Body-focused repetitive behaviors
  bfrb_episode: Boolean,
  bfrb_type: ['skin_picking', 'hair_pulling', 'nail_biting', 'cheek_chewing', 'other'] | null,
  bfrb_context: 'boredom' | 'anxiety' | 'concentration' | 'emotional_overwhelm' | 'none' | null,

  // Sleep (carried from main sleep log or entered here)
  sleep_quality_nrs: 0-10,
  hours_slept: Number | null,
  sleep_onset_time: String | null,    // HH:MM
  wake_time: String | null,           // HH:MM
  night_waking: Boolean,

  // Medication
  medication_taken: Boolean,
  medication_effectiveness_nrs: 0-10 | null, // "How effective was your medication today?" (0 = no effect; 10 = fully effective)
  medication_side_effects: ['appetite_suppression', 'insomnia', 'irritability', 'headache', 'heart_racing', 'anxiety', 'emotional_blunting', 'crash_on_wearoff', 'none'],
  medication_timing_note: String | null,

  // Functional impact (optional additions)
  work_school_impact_nrs: 0-10 | null, // how much did ADHD symptoms affect work/school today
  relationship_impact: Boolean,         // did symptoms cause a relationship problem today

  // Cycle context (auto-populated from cycle log)
  cyclePhase: 'menstrual' | 'follicular' | 'periovulatory' | 'luteal' | 'premenstrual' | 'suppressed' | 'irregular' | 'unknown',
  cycleDayNumber: Number | null,

  // Free-text note (optional)
  note: String | null
}
```

### 2.2 Daily Log UX Design

- Default view: 5 core NRS sliders (attention, impulsivity, EF, WM, emotional regulation)
- "Good day" quick-complete: all five at 7-10, single tap option
- RSD, hyperfocus, BFRB: secondary section expanded with single tap ("Anything else to add?")
- Medication section: shown only if medication logged in onboarding or F133
- Cycle phase indicator: subtle phase dot (no label — visual only) shown in header
- Brain fog mode: if activated, reduces to 3 sliders (attention, EF, mood) with large touch targets and plain language

---

## Section 3: Clinical Instruments

### 3.1 ASRS-5 Monthly Screener

**Instrument:** Adult ADHD Self-Report Scale — Version 5 (DSM-5 compatible)  
**Format:** 6 items, 5-point frequency scale  
**Recall:** Past 6 months  
**Scoring:** Each item 0-4; total 0-24; clinical threshold varies by item endorsement pattern  
**Cadence in app:** Monthly (first day of month)  
**Completion time:** ~3 minutes

```js
state.adhdAsrs5Log[date] = {
  items: {
    q1: 0-4, // "How often do you have trouble wrapping up the final details of a project?"
    q2: 0-4, // "How often do you have difficulty getting things in order when you have to do a task that requires organization?"
    q3: 0-4, // "How often do you have problems remembering appointments or obligations?"
    q4: 0-4, // "When you have a task that requires a lot of thought, how often do you avoid or delay getting started?"
    q5: 0-4, // "How often do you fidget or squirm with your hands or feet when you have to sit down for a long time?"
    q6: 0-4  // "How often do you feel overly active and compelled to do things, like you were driven by a motor?"
  },
  // Items 1-4 = inattention-oriented; items 5-6 = hyperactivity-oriented
  highlyConsistentItems: Number,   // items 4-5 on this scale (frequency "Often" / "Very Often")
  totalScore: 0-24,
  positiveScreen: Boolean,          // ≥4 of 6 items at "Often" or above
  trend: 'improving' | 'stable' | 'worsening' | null,
  completedAt: ISO_DATETIME
}
```

**Scoring note:** A "positive screen" is triggered when 4 or more of the 6 questions are endorsed at "Often" or "Very often." This does NOT diagnose ADHD — it indicates that detailed assessment is warranted.

---

### 3.2 ADHD-RS Monthly (Symptom Severity Tracking)

**Instrument:** ADHD Rating Scale (adapted for self-report monitoring)  
**Format:** 18 items, 4-point scale (0-3)  
**Score range:** 0-54 total; 0-27 inattention subscale; 0-27 H/I subscale  
**Recall:** Past 1 month  
**Cadence:** Monthly  
**Completion time:** ~5 minutes

```js
state.adhdRsLog[date] = {
  // Inattention items (I1-I9)
  inattention: {
    i1: 0-3, // fails to give close attention / careless mistakes
    i2: 0-3, // difficulty sustaining attention
    i3: 0-3, // does not seem to listen
    i4: 0-3, // does not follow through / fails to finish
    i5: 0-3, // difficulty organizing
    i6: 0-3, // avoids tasks requiring sustained mental effort
    i7: 0-3, // loses things
    i8: 0-3, // easily distracted
    i9: 0-3  // forgetful in daily activities
  },
  // Hyperactivity-Impulsivity items (H1-H9)
  hyperactivity: {
    h1: 0-3, // fidgets / squirms
    h2: 0-3, // leaves seat
    h3: 0-3, // runs about / climbs / restless
    h4: 0-3, // cannot play or engage quietly
    h5: 0-3, // "on the go" / driven by motor
    h6: 0-3, // talks excessively
    h7: 0-3, // blurts out answers
    h8: 0-3, // difficulty waiting turn
    h9: 0-3  // interrupts / intrudes
  },
  inattentionScore: 0-27,
  hyperactivityScore: 0-27,
  totalScore: 0-54,
  predominantPresentation: 'inattentive' | 'hyperactive_impulsive' | 'combined',
  trend: 'improving' | 'stable' | 'worsening' | null,
  completedAt: ISO_DATETIME,

  // Medication response benchmark
  // Lisdexamfetamine RCT benchmark: 19-point total score reduction from baseline
  // Clinical responder definition: ≥30% total score reduction from baseline
  treatmentResponseFlag: Boolean | null  // true if ≥30% reduction from first logged baseline
}
```

---

### 3.3 CAARS-S:S Abbreviated (Monthly)

**Instrument:** Conners' Adult ADHD Rating Scale — Self-Report, Short Form (26 items) — selected subscales  
**Format:** 26 items, 4-point scale  
**Key subscales for HormonaIQ:**
- Inattention/Memory Problems
- Hyperactivity/Restlessness
- Impulsivity/Emotional Lability (critical for women — RSD and emotional dysregulation)
- DSM-IV Inattention Symptoms
- ADHD Index

**Scoring:** T-scores (Mean = 50, SD = 10)
- T < 60: not elevated
- T 60-64: borderline  
- T 65-69: clinically significant
- T ≥ 70: very elevated

**Cadence:** Monthly (alternating weeks with full ADHD-RS to avoid instrument fatigue)

```js
state.adhdCaarsLog[date] = {
  items: { [q1..q26]: 0-3 },
  subscales: {
    inattention_memory:    { rawScore: Number, tScore: Number },
    hyperactivity:         { rawScore: Number, tScore: Number },
    impulsivity_emotional: { rawScore: Number, tScore: Number }, // critical for women
    self_concept:          { rawScore: Number, tScore: Number },
    dsm_inattention:       { rawScore: Number, tScore: Number },
    adhd_index:            { rawScore: Number, tScore: Number }
  },
  emotionalLabilityElevated: Boolean, // impulsivity_emotional tScore ≥ 65
  trend: 'improving' | 'stable' | 'worsening' | null,
  completedAt: ISO_DATETIME
}
```

**Clinical note:** The Impulsivity/Emotional Lability subscale of the CAARS is the primary tracking instrument for emotional dysregulation and RSD in the HormonaIQ ADHD module. Elevations here (T ≥ 65) predict relationship impairment and daily dysfunction beyond what the attention/hyperactivity subscales capture.

---

### 3.4 WFIRS-S Monthly (Functional Impairment)

**Instrument:** Weiss Functional Impairment Rating Scale — Self-Report  
**Format:** 50 items, 4-point scale (0-3)  
**Six domains:** Family, Work/School, Life Skills, Social Activities, Risky Activities, Self-Concept  
**Clinical threshold:** Items rated 2-3 indicate impairment; domain mean ≥ 0.65 = clinically impaired  
**Cadence:** Monthly  
**Completion time:** ~8 minutes

```js
state.adhdWfirsLog[date] = {
  domains: {
    family:        { items: [0-3 × ~9],   domainMean: Number, impaired: Boolean },
    work_school:   { items: [0-3 × ~9],   domainMean: Number, impaired: Boolean },
    life_skills:   { items: [0-3 × ~9],   domainMean: Number, impaired: Boolean },
    social:        { items: [0-3 × ~7],   domainMean: Number, impaired: Boolean },
    risky:         { items: [0-3 × ~5],   domainMean: Number, impaired: Boolean },
    self_concept:  { items: [0-3 × ~8],   domainMean: Number, impaired: Boolean }
  },
  totalMean: Number,
  impairedDomains: String[],
  clinicallyImpaired: Boolean,  // ≥1 domain with mean ≥ 0.65
  trend: 'improving' | 'stable' | 'worsening' | null,
  completedAt: ISO_DATETIME
}
```

**Physician report use:** The WFIRS-S is the primary instrument for documenting functional impairment for disability accommodation purposes (ADA, Equality Act). A WFIRS-S with domain means ≥0.65 constitutes documentation-quality evidence of ADHD-related functional impairment.

---

### 3.5 PHQ-9 Monthly Safety Screen

**Cadence:** Monthly  
**Threshold actions:** Same as endometriosis module (shared safety architecture)

```js
state.adhdPhq9Log[date] = {
  items: { q1: 0-3, q2: 0-3, q3: 0-3, q4: 0-3, q5: 0-3, q6: 0-3, q7: 0-3, q8: 0-3, q9: 0-3 },
  totalScore: 0-27,
  severityCategory: 'minimal' | 'mild' | 'moderate' | 'moderately_severe' | 'severe',
  item9Flag: Boolean,                   // suicidality screen — any score > 0
  crisisResourcesDisplayed: Boolean,
  acknowledgedAt: ISO_DATETIME | null,
  trend: 'improving' | 'stable' | 'worsening' | null
}
```

**ADHD-specific context:** Women with ADHD carry approximately 2.3× higher risk of suicidal ideation compared to non-ADHD women. PHQ-9 item 9 is a mandatory monthly safety gate. Any response other than "Not at all" triggers immediate crisis resource display.

**Comorbidity context:** The PHQ-9 in ADHD users may reflect ADHD-driven low mood (situational, responsive to ADHD treatment) vs. true MDD. The note shown with elevated PHQ-9 scores includes: "Depression is very common with ADHD and can improve significantly with ADHD treatment. Please discuss these results with your provider."

---

### 3.6 GAD-7 Bi-weekly Screen

```js
state.adhdGad7Log[date] = {
  items: { q1: 0-3, q2: 0-3, q3: 0-3, q4: 0-3, q5: 0-3, q6: 0-3, q7: 0-3 },
  totalScore: 0-21,
  severityCategory: 'minimal' | 'mild' | 'moderate' | 'severe',
  trend: 'improving' | 'stable' | 'worsening' | null
}
```

**ADHD note:** Anxiety and ADHD share symptoms (difficulty concentrating, restlessness, worry). The GAD-7 in ADHD context should prompt: "Some symptoms on this scale can be caused by ADHD itself. Your provider can help identify whether what you're experiencing is anxiety, ADHD symptoms, or both."

---

### 3.7 ISI — Insomnia Severity Index (Monthly)

**Instrument:** Insomnia Severity Index (Morin, 2001)  
**Format:** 7 items, 5-point scale (0-4)  
**Score range:** 0-28  
**Thresholds:**
- 0-7: no clinically significant insomnia
- 8-14: sub-threshold insomnia
- 15-21: moderate insomnia
- 22-28: severe insomnia

```js
state.adhdIsiLog[date] = {
  items: {
    q1a: 0-4, // difficulty falling asleep
    q1b: 0-4, // difficulty staying asleep
    q1c: 0-4, // problems waking too early
    q2:  0-4, // sleep dissatisfaction
    q3:  0-4, // noticeability to others of sleep problem
    q4:  0-4, // worry/distress about sleep
    q5:  0-4  // interference with daytime functioning
  },
  totalScore: 0-28,
  severityCategory: 'none' | 'subthreshold' | 'moderate' | 'severe',
  trend: 'improving' | 'stable' | 'worsening' | null
}
```

**Circadian rhythm note:** If sleep onset consistently after midnight AND ISI items q1a (difficulty falling asleep) ≥ 2 across ≥3 months of data → automated insight: "Your sleep data suggests a delayed sleep phase pattern, which is very common in ADHD. This is a circadian rhythm difference, not poor sleep hygiene. Discuss chronotherapy options (light therapy, timed melatonin) with your provider."

---

### 3.8 Executive Function Daily Rating (EF Check-in)

A simplified daily 3-item executive function check-in (separate from the main daily log; appears as a quick-add within the Today screen). Derived from Brown's 5-cluster model.

```js
state.adhdEfDailyLog[date] = {
  activation_nrs: 0-10,  // "How easy was it to START tasks today?" (0 = couldn't start anything; 10 = easy to begin)
  memory_nrs: 0-10,      // "How was your working memory — holding information, following through?" 
  emotion_nrs: 0-10,     // "How well did you manage frustration and emotional reactions today?"
  completedAt: ISO_DATETIME | null
}
```

**Correlation engine:** After 30+ days of EF daily logs, the insight engine computes correlation between activation_nrs and:
- Cycle phase (is EF worse in luteal phase?)
- Sleep quality (does poor sleep predict low activation next day?)
- Medication effectiveness (does high medication_effectiveness_nrs predict high activation_nrs?)

---

## Section 4: Medication Tracking

### 4.1 ADHD Medication Log

```js
state.adhdMedicationLog = {
  current: [{
    name: String,              // e.g., "Lisdexamfetamine (Vyvanse)"
    class: 'stimulant_amphetamine' | 'stimulant_methylphenidate' | 'atomoxetine' | 'viloxazine' | 'guanfacine' | 'bupropion' | 'other_non_stimulant',
    dose_mg: Number,
    timing: String,            // e.g., "7am daily"
    startDate: ISO_DATE,
    prescribedBy: String | null,
    notes: String | null
  }],
  history: [{
    ...same as current,
    endDate: ISO_DATE,
    reasonStopped: String | null
  }],
  responseLog: [{
    date: ISO_DATE,
    weeksOnCurrent: Number,
    effectivenessNRS: 0-10,
    sideEffects: String[],
    luteAlPhaseNote: String | null,    // user's note about how medication performs in luteal phase
    notes: String | null
  }]
}
```

### 4.2 Medication Response Benchmarking

When 6+ weeks of medication effectiveness data exists alongside ADHD-RS data:

```js
const ADHD_MEDICATION_BENCHMARKS = {
  lisdexamfetamine: {
    expectedAdhdrsTotalReduction: 19,  // from Vyvanse RCT (DuPaul 2007)
    clinicalResponderThreshold: 0.30,  // ≥30% total score reduction
    expectedEffectOnsetWeeks: 1
  },
  methylphenidate: {
    expectedAdhdrsTotalReduction: 13,
    clinicalResponderThreshold: 0.25,
    expectedEffectOnsetWeeks: 1
  },
  atomoxetine: {
    expectedAdhdrsTotalReduction: 10,
    clinicalResponderThreshold: 0.20,
    expectedEffectOnsetWeeks: 6    // atomoxetine has delayed onset
  },
  viloxazine: {
    expectedAdhdrsTotalReduction: 5,  // modest effect
    clinicalResponderThreshold: 0.15,
    expectedEffectOnsetWeeks: 3
  }
}
```

**6-week check-in:** Automated prompt 6 weeks after new medication or dose change: "It's been 6 weeks since you changed to [medication/dose]. Based on your ADHD-RS scores and daily logs, [here is what the data shows]. Do you feel the medication is working for you?"

---

### 4.3 Hormonal-Medication Interaction Tracker

This is a unique feature that no other ADHD app offers. For users who have ≥2 months of daily medication effectiveness logs AND cycle phase data:

```js
state.adhdCycleMedResponse = {
  // Computed from rolling 3-month window
  follicularPhaseMedEffectMean: Number,    // avg medication_effectiveness_nrs during follicular phase
  lutealPhaseMedEffectMean: Number,        // avg medication_effectiveness_nrs during luteal phase
  premenstrualPhaseMedEffectMean: Number,  // last 5 days before period
  cycleVariationCoefficient: Number,       // luteal - follicular difference
  luteAlPhaseDipFlag: Boolean,             // luteal mean < follicular mean by ≥2 points
  lastUpdated: ISO_DATE
}
```

**Insight card (when dip detected):**  
"Your medication appears to be less effective during your luteal phase (the week before your period). This is caused by falling estrogen, which reduces dopamine activity — the same system your medication targets. About 60% of women with ADHD notice this pattern. Your provider may want to discuss a temporary dose increase or supplementary strategy for your premenstrual week."

---

## Section 5: Safety Rules

```js
const ADHD_SAFETY_RULES = {
  // Mental health safety gates
  phq9Item9Positive: {
    trigger: 'phq9Log[date].items.q9 >= 1',
    urgency: 'CRISIS',
    message: 'We noticed you may be having some difficult thoughts about yourself or your safety. You are not alone. Support is available right now.',
    action: 'display_crisis_resources_immediately',
    cannotDismissWithout: 'user_confirmation_seen'
  },

  phq9ModeratelySevere: {
    trigger: 'phq9Log[date].totalScore >= 15',
    urgency: 'HIGH',
    message: 'Your responses suggest significant depression. Depression is very common with ADHD and is treatable. Please reach out to your GP or mental health provider this week.',
    action: 'provide_resources_and_physician_flag'
  },

  phq9Moderate: {
    trigger: 'phq9Log[date].totalScore >= 10',
    urgency: 'MODERATE',
    message: 'You\'ve been experiencing difficult mood symptoms. Depression can worsen ADHD — getting support for your mood may also improve your focus and energy. Here are some resources.',
    action: 'soft_resource_display'
  },

  gad7Severe: {
    trigger: 'gad7Log[date].totalScore >= 15',
    urgency: 'HIGH',
    message: 'Your anxiety responses are in the severe range. Anxiety and ADHD frequently co-occur. Please consider speaking with your provider — effective treatments exist for both.',
    action: 'provider_recommendation'
  },

  rsdSevereRepeated: {
    trigger: 'adhdDailyLog: rsd_intensity_nrs >= 8 on ≥3 days in any 7-day window',
    urgency: 'MODERATE',
    message: 'You\'ve been experiencing frequent intense emotional reactions this week. This pattern can indicate that ADHD-related emotional dysregulation needs more support. Consider discussing this with your provider.',
    action: 'physician_report_flag_plus_resources'
  },

  burnoutRisk: {
    trigger: 'adhdDailyLog: masking_effort_nrs >= 8 AND post_hyperfocus_crash = true on ≥5 days in any 14-day window',
    urgency: 'MODERATE',
    message: 'Your logs show signs of ADHD burnout — high masking effort combined with repeated hyperfocus-crash cycles. Burnout in ADHD can take weeks to months to recover from. Consider protective scheduling and discussing this with your provider.',
    action: 'burnout_recovery_resources'
  },

  medicationPersistentlyLow: {
    trigger: 'adhdDailyLog: medication_effectiveness_nrs mean < 4 over 14+ consecutive days',
    urgency: 'MODERATE',
    message: 'Your medication has been feeling less effective recently. This can happen due to tolerance, hormonal changes (especially around your period or perimenopause), or dose requirements changing. Consider flagging this for your next appointment.',
    action: 'medication_review_prompt_plus_physician_report_note'
  },

  sleepSevere: {
    trigger: 'adhdDailyLog: sleep_quality_nrs <= 3 on ≥10 of last 14 logged days',
    urgency: 'MODERATE',
    message: 'Severe sleep disruption has a direct effect on ADHD symptoms — poor sleep increases inattention, impulsivity, and emotional reactivity. Discussing sleep management options with your provider may significantly improve your ADHD symptoms.',
    action: 'sleep_resources_and_physician_flag'
  },

  isiBedtime: {
    trigger: 'isiLog[most_recent].totalScore >= 15',
    urgency: 'MODERATE',
    message: 'Your sleep assessment shows moderate-to-severe insomnia. Sleep disorders are very common in ADHD and can significantly worsen symptoms. Non-medication options (light therapy, melatonin timing, CBT for insomnia) have strong evidence.',
    action: 'sleep_intervention_guide'
  }
}
```

---

## Section 6: Cycle-ADHD Correlation Engine

The cycle-ADHD correlation engine is HormonaIQ's primary differentiator for ADHD users. It computes the relationship between cycle phase and ADHD symptom domains automatically from longitudinal data.

### 6.1 Insight Rules

```js
const ADHD_CYCLE_INSIGHTS = [
  {
    id: 'luteal_attention_dip',
    dataRequirement: '3+ complete cycles with daily ADHD logs',
    computation: 'compare mean attention_nrs in luteal phase vs follicular phase',
    threshold: 'luteal mean < follicular mean by ≥1.5 points',
    insight: 'Your attention scores are consistently lower in the week before your period. This is caused by falling estrogen reducing dopamine activity — the same neurotransmitter that affects ADHD. About 60% of women with ADHD notice this pattern. Consider discussing luteal phase management strategies with your prescriber.'
  },
  {
    id: 'premenstrual_rsd_spike',
    dataRequirement: '2+ complete cycles with RSD episode logs',
    computation: 'compare rsd_episode frequency in premenstrual phase vs rest of cycle',
    threshold: 'premenstrual rsd rate > 2x non-premenstrual rate',
    insight: 'RSD episodes occur more frequently in your premenstrual phase. This is consistent with the estrogen-dopamine connection — emotional regulation depends on dopamine, which drops before your period. This pattern is distinct from PMDD, though the two can coexist.'
  },
  {
    id: 'medication_luteal_dip',
    dataRequirement: '2+ months medication + cycle data',
    computation: 'compare medication_effectiveness_nrs by cycle phase',
    threshold: 'luteal mean ≥2 points below follicular mean',
    insight: 'Your medication is consistently less effective in your luteal phase. This is a well-documented interaction between estrogen decline and stimulant medication efficacy. Discuss pre-menstrual dose adjustment with your prescriber.'
  },
  {
    id: 'sleep_adhd_next_day',
    dataRequirement: '30+ days paired sleep + ADHD daily logs',
    computation: 'Pearson correlation between sleep_quality_nrs and next-day attention_nrs',
    threshold: 'r > 0.4',
    insight: 'Your data shows a meaningful relationship between sleep quality and next-day attention. When you sleep well, your focus is significantly better. Protecting your sleep may have as much impact on your ADHD symptoms as medication optimization.'
  },
  {
    id: 'masking_burnout_trajectory',
    dataRequirement: '30+ days of masking_effort_nrs',
    computation: '14-day rolling average of masking_effort_nrs; trend analysis',
    threshold: 'rolling mean ≥7 for 14+ consecutive days',
    insight: 'Your masking effort has been very high for an extended period. Sustained high masking effort is associated with ADHD burnout. Consider protective scheduling — building in unmasked time, reducing discretionary commitments, and discussing this pattern with your therapist or ADHD coach.'
  },
  {
    id: 'hyperfocus_crash_cycle',
    dataRequirement: '30+ days of hyperfocus and crash logs',
    computation: 'lag correlation between hyperfocus_episode and post_hyperfocus_crash next day',
    threshold: 'crash follows hyperfocus on ≥70% of logged hyperfocus days',
    insight: 'Your data shows a consistent hyperfocus-crash pattern. Hyperfocus sessions are reliably followed by a crash the next day. Setting intentional hyperfocus limits and scheduling recovery time afterward may reduce the crash severity.'
  },
  {
    id: 'perimenopause_symptom_escalation',
    dataRequirement: 'perimenopausal status = true + 3+ months ADHD-RS data',
    computation: 'compare ADHD-RS total scores pre-perimenopause onset vs current',
    threshold: 'trend line slope significantly positive',
    insight: 'Your ADHD symptom scores have been trending upward since perimenopause began. This is a well-documented hormonal effect. HRT (hormone replacement therapy) has been shown to restore medication efficacy for some women in perimenopause — this is worth discussing with your gynaecologist and ADHD prescriber jointly.'
  }
]
```

---

## Section 7: Executive Function Tracker

### 7.1 Brown EF/A Scale (Monthly)

Simplified implementation of Brown's 5-cluster executive function model for monthly tracking:

```js
state.adhdBrownEfLog[date] = {
  clusters: {
    activation: {
      // Organizing tasks, time estimation, prioritization, task initiation
      items: [
        { q: 'Organizing tasks and materials before starting', score: 0-4 },
        { q: 'Estimating how long tasks will take', score: 0-4 },
        { q: 'Prioritizing tasks by importance', score: 0-4 },
        { q: 'Getting started on tasks without procrastinating', score: 0-4 },
        { q: 'Managing time during the day', score: 0-4 }
      ],
      subscaleScore: 0-20,
      tScore: Number
    },
    focus: {
      items: [
        { q: 'Staying focused on tasks even when not interested', score: 0-4 },
        { q: 'Ignoring distractions when trying to concentrate', score: 0-4 },
        { q: 'Keeping focused when reading or listening', score: 0-4 },
        { q: 'Keeping focused when working on long tasks', score: 0-4 }
      ],
      subscaleScore: 0-16,
      tScore: Number
    },
    effort: {
      items: [
        { q: 'Maintaining effort on tasks that are not interesting', score: 0-4 },
        { q: 'Working under pressure of deadlines', score: 0-4 },
        { q: 'Producing work even when tired or not motivated', score: 0-4 }
      ],
      subscaleScore: 0-12,
      tScore: Number
    },
    emotion: {
      items: [
        { q: 'Managing frustration when things go wrong', score: 0-4 },
        { q: 'Regulating emotional reactions to setbacks', score: 0-4 },
        { q: 'Calming yourself when upset', score: 0-4 },
        { q: 'Not overreacting to criticism or perceived rejection', score: 0-4 }
      ],
      subscaleScore: 0-16,
      tScore: Number
    },
    memory: {
      items: [
        { q: 'Holding information in mind while using it', score: 0-4 },
        { q: 'Remembering what you were doing when interrupted', score: 0-4 },
        { q: 'Using memory to manage daily responsibilities', score: 0-4 },
        { q: 'Keeping track of what you said you would do', score: 0-4 }
      ],
      subscaleScore: 0-16,
      tScore: Number
    }
  },
  dominantImpairmentCluster: 'activation' | 'focus' | 'effort' | 'emotion' | 'memory' | null,
  completedAt: ISO_DATETIME,
  trend: { activation: String, focus: String, effort: String, emotion: String, memory: String }
}
```

**Physician report use:** The Brown EF/A cluster profile identifies which domain is most impairing — this guides both therapeutic focus (what to address in CBT or coaching) and medication selection (e.g., atomoxetine vs. stimulant preference differs by EF profile).

---

## Section 8: Supplement and Lifestyle Log

```js
state.adhdSupplementLog[date] = {
  omega3: {
    taken: Boolean,
    dose_mg: Number | null,    // total EPA + DHA
    epa_fraction_pct: Number | null  // EPA as % of total — higher EPA linked to better outcomes
  },
  zinc: { taken: Boolean, dose_mg: Number | null },
  magnesium: { taken: Boolean, dose_mg: Number | null, form: 'oxide'|'glycinate'|'citrate'|'other'|null },
  iron: { taken: Boolean, dose_mg: Number | null },
  vitaminD: { taken: Boolean, dose_iu: Number | null },
  melatonin: {
    taken: Boolean,
    dose_mg: Number | null,
    timing: String | null    // HH:MM — critical for circadian intervention effectiveness
  },
  caffeine: {
    consumed: Boolean,
    estimate_mg: Number | null,   // 1 cup coffee ≈ 95mg; logged loosely
    timing_last: String | null    // last caffeine time — affects sleep
  }
}

state.adhdLifestyleLog[date] = {
  exercise: {
    completed: Boolean,
    type: 'aerobic' | 'strength' | 'walking' | 'yoga' | 'other' | null,
    duration_minutes: Number | null,
    intensity: 'low' | 'moderate' | 'vigorous' | null
  },
  pomodoro_sessions: Number | null,      // number of focused work blocks completed
  body_doubling_sessions: Number | null, // Focusmate or other
  meditation_minutes: Number | null,
  screen_free_wind_down: Boolean         // did user have screen-free time before bed
}
```

**Omega-3 response tracking:**  
After 16 weeks of regular omega-3 logging, compare ADHD-RS scores from week 1-4 vs. week 13-16. Clinical evidence shows efficacy only at ≥4 months. App prompts: "It takes at least 4 months of omega-3 supplementation to see potential ADHD benefits. You've been consistent for [X weeks]. Keep going."

---

## Section 9: BFRB and Sensory Log

Body-focused repetitive behaviors and sensory seeking patterns are tracked as part of the daily log but can also be logged separately with more detail.

```js
state.adhdBfrbDetailLog[date] = {
  skinPicking: {
    occurred: Boolean,
    duration_minutes: Number | null,
    bodyLocations: String[] | null,
    emotionalContext: 'boredom' | 'anxiety' | 'concentration' | 'overwhelm' | 'neutral' | null,
    precededByADHDSymptom: 'attention_lapse' | 'emotional_dysregulation' | 'nothing_specific' | null
  },
  hairPulling: {
    occurred: Boolean,
    duration_minutes: Number | null,
    emotionalContext: String | null
  },
  nailBiting: { occurred: Boolean, context: String | null },
  otherBfrb: { occurred: Boolean, description: String | null },
  sensorySeekingActivities: {
    fidgeting: Boolean,
    proprioceptive: Boolean,  // weighted blanket, exercise, tight clothing
    rocking: Boolean,
    other: String | null
  },
  note: String | null
}
```

---

## Section 10: Physician Report Specification

### 10.1 ADHD Physician Report Structure

Designed for prescribing psychiatrist, GP, or ADHD specialist. Clinical format — not wellness aesthetic.

**12-section structure:**

1. **Patient Summary**  
   Name/ID, report date range, diagnosis status, ADHD presentation type, current medications, hormonal context (cycle status, HRT, contraception type)

2. **Clinical Alerts (Safety Flags)**  
   Any PHQ-9 item 9 responses, elevated PHQ-9/GAD-7 scores, burnout risk flags, medication efficacy decline patterns — highlighted box at top

3. **Instrument Score Summary Table**  
   | Instrument | Last Score | Previous Score | Trend | Severity |  
   One row per completed instrument: ASRS-5, ADHD-RS (total + subscales), CAARS (emotional lability subscale), WFIRS-S (by domain), PHQ-9, GAD-7, ISI  

4. **Symptom Trend Charts**  
   Sparklines for ADHD-RS total score and PHQ-9 total score over the report period; emotional lability CAARS subscale; ISI score  

5. **Daily Log Summary**  
   Average NRS by domain (attention, impulsivity, EF, WM, emotional regulation) by week — heat map style table  

6. **Hormonal-ADHD Correlation Analysis**  
   (If ≥2 cycles of data): Average attention NRS and medication effectiveness NRS by cycle phase (table + bar chart); whether luteal phase dip detected; clinical interpretation note  

7. **Medication Response Section**  
   Medication name, dose, duration; ADHD-RS baseline vs. current; 6-week check-in responses; patient-reported side effects; luteal phase effectiveness comparison  

8. **Executive Function Profile**  
   Brown EF/A cluster scores with trend; most impaired cluster highlighted; domain-specific recommendation for therapy or coaching target  

9. **Functional Impairment (WFIRS-S)**  
   Domain-by-domain impairment table; which domains are clinically impaired; comparison to previous period  

10. **Sleep and Lifestyle Data**  
    ISI score; average sleep quality NRS; average hours slept; estimated DLMO pattern (from sleep onset logs); exercise frequency; supplement adherence  

11. **User Notes (Patient-Curated)**  
    Representative notes from the patient's daily logs — patient selects which to include  

12. **Full Raw Data Appendix**  
    Tabular daily log data for every logged day  

---

## Section 11: Accommodation Documentation Feature

Women with ADHD frequently need workplace accommodation documentation. The app generates a structured summary that can be provided to HR or occupational health.

```js
state.adhdAccommodationDoc = {
  generated: Boolean,
  lastGeneratedDate: ISO_DATE | null,
  contents: {
    diagnosisStatement: String | null,     // user fills in diagnosis detail
    functionalImpactSummary: String,       // auto-generated from WFIRS-S most impaired domains
    accommodationsRequested: String[],     // user selects from list + adds custom
    supportingData: {
      wfirsWorkDomainScore: Number | null,
      wfirsLifeSkillsScore: Number | null,
      adhdRsTotal: Number | null,
      reportPeriod: String | null
    }
  }
}

const ADHD_ACCOMMODATION_OPTIONS = [
  'Flexible working hours / start time adjustments',
  'Ability to work from home when needed',
  'Extended deadlines when requested',
  'Written instructions for multi-step tasks',
  'Reduced interruptions / private workspace option',
  'Regular check-ins with supervisor for task prioritization',
  'Extended time on assessments or performance reviews',
  'Permission to use noise-cancelling headphones',
  'Frequent short breaks (Pomodoro-compatible scheduling)',
  'Digital calendar and reminder systems',
  'Body doubling / coworking partner if needed',
  'Accommodation for medical appointments'
]
```

---

## Section 12: State Shape Summary

| State Key | Purpose | Data Volume |
|-----------|---------|-------------|
| `state.adhdOnboarding` | Condition setup, flags, clinical context | One-time, ~50 fields |
| `state.adhdDailyLog` | Core daily symptom + behavior data | Daily, ~25 fields |
| `state.adhdAsrs5Log` | ASRS-5 monthly screener | Monthly, 6 items |
| `state.adhdRsLog` | ADHD-RS severity tracking | Monthly, 18 items |
| `state.adhdCaarsLog` | CAARS subscale monitoring | Monthly, 26 items |
| `state.adhdWfirsLog` | Functional impairment | Monthly, 50 items |
| `state.adhdPhq9Log` | Depression safety screen | Monthly, 9 items |
| `state.adhdGad7Log` | Anxiety monitoring | Bi-weekly, 7 items |
| `state.adhdIsiLog` | Insomnia severity | Monthly, 7 items |
| `state.adhdEfDailyLog` | Executive function daily quick-check | Daily (optional), 3 items |
| `state.adhdBrownEfLog` | Brown EF cluster monthly profile | Monthly, ~20 items |
| `state.adhdMedicationLog` | Treatment tracking + response | Per change + monthly |
| `state.adhdCycleMedResponse` | Hormonal-medication interaction | Computed, updated monthly |
| `state.adhdBfrbDetailLog` | BFRB and sensory detail | As-needed |
| `state.adhdSupplementLog` | Supplement adherence | Daily (optional) |
| `state.adhdLifestyleLog` | Exercise, body doubling, sleep hygiene | Daily (optional) |
| `state.adhdAccommodationDoc` | Workplace accommodation documentation | As-needed |

---

## Section 13: Clinical Rules Summary

| Rule ID | Trigger | Urgency | Action |
|---------|---------|---------|--------|
| PHQ9_ITEM9 | PHQ-9 item 9 ≥ 1 | CRISIS | Immediate crisis resource display |
| PHQ9_MODERATELY_SEVERE | PHQ-9 total ≥ 15 | HIGH | Provider recommendation this week |
| PHQ9_MODERATE | PHQ-9 total ≥ 10 | MODERATE | Resources + physician flag |
| GAD7_SEVERE | GAD-7 ≥ 15 | HIGH | Provider recommendation |
| RSD_SEVERE_REPEATED | RSD intensity ≥8 on ≥3 days in 7 | MODERATE | Physician flag + resources |
| BURNOUT_RISK | Masking ≥8 + crash ≥5 days in 14 | MODERATE | Burnout resources |
| MEDICATION_LOW | Med effectiveness mean <4 over 14 days | MODERATE | Medication review prompt |
| SLEEP_SEVERE | Sleep quality ≤3 on ≥10 of 14 days | MODERATE | Sleep intervention resources |
| ISI_MODERATE | ISI total ≥ 15 | MODERATE | Sleep resources + physician flag |
| LUTEAL_ATTENTION_DIP | Luteal mean <follicular mean by ≥1.5 | INFORMATIONAL | Cycle-ADHD insight card |
| MED_LUTEAL_DIP | Med effectiveness luteal <follicular by ≥2 | INFORMATIONAL | Luteal dosing discussion prompt |
| HYPERFOCUS_CRASH_PATTERN | Crash follows hyperfocus ≥70% of logged episodes | INFORMATIONAL | Hyperfocus management card |
| MASKING_SUSTAINED_HIGH | Rolling 14d masking mean ≥7 | MODERATE | Burnout prevention card |
| PERIMENOPAUSE_ESCALATION | ADHD-RS trend significantly positive post-peri | INFORMATIONAL | HRT discussion prompt |

---

*HormonaIQ ADHD Complete Technical Specification v1.0 | April 2026*  
*Prepared for product and engineering teams*
