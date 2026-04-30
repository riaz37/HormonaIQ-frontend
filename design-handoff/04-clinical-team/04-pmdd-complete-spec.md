# HormonaIQ — PMDD Complete Feature & Data-Logging Specification

**Version:** 1.0  
**Date:** April 2026  
**Audience:** Engineering, product, clinical advisory board  
**Classification:** Internal working document — clinical-grade

---

## Preface

This document is the canonical specification for every PMDD-related feature and data point in HormonaIQ. It is grounded in DSM-5 criteria, the DRSP validated instrument, ACOG 2023 Clinical Practice Guideline No. 7, and peer-reviewed literature. Every data field collected has a clinical justification. Every feature has an evidence base. Clinicians reading this document will find it accurate; engineers reading it will find it buildable.

PMDD is not severe PMS. It is a DSM-5 depressive disorder. It is cyclical. It is biologically driven by abnormal neurological sensitivity to normal hormonal fluctuations — specifically, aberrant response to allopregnanolone (ALLO), a progesterone metabolite that modulates GABA-A receptors. Women with PMDD do not have abnormal hormone levels; they have abnormal brain responses to normal hormone changes. This distinction matters for every design decision: the app must never frame PMDD as "bad PMS that lifestyle changes will fix."

---

## SECTION 1: CLINICAL FOUNDATION

### 1.1 DSM-5 Diagnostic Criteria for PMDD (Criteria A Through E)

*Source: DSM-5, APA 2013; StatPearls, NCBI Bookshelf NBK532307*

**Criterion A — Symptoms**  
In the majority of menstrual cycles, at least five of the following 11 symptoms must be present in the final week before the onset of menses, start to improve within a few days after the onset of menses, and become minimal or absent in the week post-menses. At least one of the symptoms must be from items 1–4 (the core mood symptoms).

**The 11 Core Symptoms:**

1. **Marked affective lability** — sudden onset of sadness, tearfulness, or increased sensitivity to rejection
2. **Marked irritability or anger** — persistent irritability, anger, or increased interpersonal conflicts
3. **Markedly depressed mood** — feelings of hopelessness, or self-deprecating thoughts
4. **Marked anxiety or tension** — feelings of being "keyed up" or "on edge"
5. **Decreased interest in usual activities** — work, school, friends, or hobbies
6. **Subjective sense of difficulty concentrating**
7. **Lethargy, easy fatigability, or marked lack of energy**
8. **Marked change in appetite** — overeating or specific food cravings
9. **Hypersomnia or insomnia**
10. **Subjective sense of being overwhelmed or out of control**
11. **Physical symptoms** — breast tenderness or swelling, joint or muscle pain, a sensation of "bloating," or weight gain

**Criterion B — Functional Impairment**  
The symptoms are associated with clinically significant distress or interference with work, school, usual social activities, or relationships with others.

**Criterion C — Cyclical Pattern and Differential Diagnosis**  
The disturbance is not merely an exacerbation of the symptoms of another disorder such as major depressive disorder, panic disorder, persistent depressive disorder, or a personality disorder. The symptoms must be discretely related to the menstrual cycle and not represent exacerbation of another disorder (though PMDD can co-occur with other conditions).

**Criterion D — Prospective Confirmation**  
Criteria A, B, and C are confirmed by prospective daily ratings during at least two consecutive symptomatic menstrual cycles. If the prospective daily ratings are not yet confirmed, the diagnosis should be recorded as "Provisional."

**Criterion E — Not Due to Substances or Other Medical Conditions**  
The disturbance is not attributable to the physiological effects of a substance (e.g., drugs, medications, other treatments) or another medical condition.

---

### 1.2 What Distinguishes PMDD from PMS

*Source: AAFP, American Family Physician 2016; MGH Center for Women's Mental Health*

The clinical threshold is the key differentiator. PMS requires the presence of at least one affective or somatic symptom in the five days before menses for three consecutive cycles. The symptoms are distressing but do not necessarily interfere significantly with daily function.

PMDD requires:
- A minimum of five symptoms (with at least one from the core mood cluster)
- Clinically significant distress or functional impairment in work, relationships, or social activities
- Prospective confirmation over two cycles
- Symptom-free interval in the follicular phase (days 4–10 post-menses)

The functional impairment threshold is the clinical line. An estimated 3–8% of menstruating women meet full PMDD criteria. Up to 75% experience some premenstrual symptoms; only the most severe functional impairment subset has PMDD.

---

### 1.3 What Distinguishes PMDD from Premenstrual Exacerbation (PME) of Another Disorder

*Source: Psychiatric Times, "Understanding Premenstrual Exacerbations of Psychiatric Illnesses"; CMAJ 2024*

This distinction is clinically critical and app-relevant. An estimated 40% of women who seek treatment for PMDD actually have Premenstrual Exacerbation (PME) — the worsening of an existing psychiatric disorder (major depression, bipolar II, panic disorder, PTSD, ADHD) during the luteal phase.

**The diagnostic tell:**
- **PMDD:** Symptom-free interval in follicular phase (days 4–10). Symptoms present ONLY in luteal phase. No persistent baseline mood disorder.
- **PME:** Symptoms are present throughout the cycle, with intensification premenstrually. A baseline disorder exists throughout the cycle.

**Why this matters for the app:** The app must track symptoms across the full cycle — including follicular phase — to distinguish PMDD from PME. An app that only asks about symptoms in the premenstrual week cannot support this distinction. Displaying the full cycle chart to the user's clinician is essential for differential diagnosis. Women with PME require continuous SSRI dosing; women with PMDD respond well to luteal-phase intermittent dosing. A misclassification has treatment consequences.

---

### 1.4 The 2-Cycle Prospective Tracking Requirement and Why It Matters for the App

*Source: ACOG Clinical Practice Guideline No. 7, December 2023; DSM-5 Criterion D*

Retrospective self-report of premenstrual symptoms is unreliable. Studies show that women recalling symptom severity from previous cycles overestimate severity in the follicular phase and misattribute symptoms. The prospective requirement exists because PMDD is pattern-dependent: it must be confirmed across two documented cycles with demonstrable symptom-free follicular intervals.

**App implications:**
- The app must collect data every day of the cycle, not just luteal phase days
- "Provisional PMDD" status should be displayed until two full cycles are logged
- The physician report should not be generated until the two-cycle minimum is met
- Onboarding must set this expectation explicitly: "It takes two full cycles to establish your pattern. This is not a limitation of the app — it is a clinical requirement."

---

## SECTION 2: THE DRSP — COMPLETE SPECIFICATION

### 2.1 Instrument Background

*Source: Endicott J, Nee J, Harrison W. "Daily Record of Severity of Problems (DRSP): Reliability and Validity." Archives of Women's Mental Health, 2006; IAPMD.org/drsp; Carolina Premenstrual Assessment Scoring System (C-PASS), PMC5205545*

The Daily Record of Severity of Problems (DRSP) is the gold-standard validated instrument for prospective PMDD symptom tracking. Developed by Jean Endicott and colleagues, it was designed specifically to operationalize DSM-IV (and subsequently DSM-5) PMDD diagnostic criteria in a daily self-report format. It is the instrument referenced by ACOG, IAPMD, and the DSM-5 diagnostic process. Individual items and summary scores have demonstrated high test-retest reliability and internal consistency in validation studies.

---

### 2.2 The 24 DRSP Items

*Source: Endicott et al. 2006; IAPMD DRSP resource; Physiopedia Premenstrual Symptoms Rating Scales*

The DRSP consists of **21 symptom items** and **3 functional impairment items** (total 24). Each is scored daily on a 6-point scale:

**Scoring Scale:**
- 1 = Not at all
- 2 = Minimal
- 3 = Mild
- 4 = Moderate
- 5 = Severe
- 6 = Extreme

**GROUP 1 — Core Mood Symptoms (corresponds to DSM-5 Criterion A, items 1–4)**

| # | Item Name | What It Measures | Clinical Rationale |
|---|-----------|------------------|--------------------|
| 1 | Depressed mood, sad, hopeless, self-deprecating | Dysphoric affect, cognitive dimension of depression | Core DSM-5 Criterion A symptom #3; distinguishes PMDD from physical PMS |
| 2 | Anxiety, tension, "keyed up" or "on edge" | Anxious arousal, hypervigilance | Core DSM-5 Criterion A symptom #4; anxiety is often the presenting complaint |
| 3 | Mood swings — suddenly sad or tearful, sensitive to rejection | Affective lability; emotional reactivity | Core DSM-5 Criterion A symptom #1; most distinguishing feature of PMDD vs. unipolar depression |
| 4 | Persistent irritability or anger, increased interpersonal conflicts | Rage, interpersonal aggression | Core DSM-5 Criterion A symptom #2; often most distressing to relationships |

**GROUP 2 — Secondary Affective and Cognitive Symptoms (Criterion A items 5–10)**

| # | Item Name | What It Measures | Clinical Rationale |
|---|-----------|------------------|--------------------|
| 5 | Decreased interest in usual activities | Anhedonia, withdrawal from hobbies, friends, work | DSM-5 Criterion A item 5; marker of functional shutdown |
| 6 | Difficulty concentrating | Cognitive impairment, executive dysfunction | DSM-5 Criterion A item 6; overlaps with ADHD presentation |
| 7 | Lethargy, fatigability, or lack of energy | Physical and mental exhaustion | DSM-5 Criterion A item 7; often confused with thyroid/anemia |
| 8 | Increased appetite, overeating, or food cravings | Appetite dysregulation, carbohydrate craving | DSM-5 Criterion A item 8; serotonin-mediated; carb craving is specific to PMDD |
| 9 | Hypersomnia or insomnia | Sleep architecture disruption | DSM-5 Criterion A item 9; sleep changes are both symptom and trigger of PMDD severity |
| 10 | Overwhelmed or out of control | Loss of regulatory capacity | DSM-5 Criterion A item 10; often precedes crisis states |

**GROUP 3 — Physical Symptoms (Criterion A item 11)**

| # | Item Name | What It Measures | Clinical Rationale |
|---|-----------|------------------|--------------------|
| 11 | Breast tenderness or swelling | Somatic estrogen/progesterone sensitivity | DSM-5 Criterion A item 11; differentiates from psychological conditions |
| 12 | Bloating, or sensation of being full or weight gain | Fluid retention, GI discomfort | DSM-5 Criterion A item 11; captured separately to track change over time |
| 13 | Headache | Tension or hormonal migraine | Associated somatic; relevant to treatment (NSAIDs, triptans) |
| 14 | Joint or muscle pain | Musculoskeletal inflammation | DSM-5 Criterion A item 11; prostaglandin-mediated |

**GROUP 4 — Behavioral Symptoms**

| # | Item Name | What It Measures | Clinical Rationale |
|---|-----------|------------------|--------------------|
| 15 | Decreased productivity at work or school | Functional cognitive impairment | Bridges mood and functional impact |
| 16 | Avoided or didn't do activities | Behavioral withdrawal | Captures avoidance behavior; linked to depression severity |
| 17 | Avoided or didn't complete activities requiring thinking or concentration | Cognitive avoidance | Specific to executive function impairment |
| 18 | Felt overwhelmed managing daily tasks | Dysexecutive syndrome | Relates to capacity to parent, work, maintain household |
| 19 | Felt hopeless about the future | Hopelessness as distinct dimension | Suicide risk factor; tracked separately |
| 20 | Experienced suicidal thoughts | Active suicidal ideation | Critical safety item; 39–82% of PMDD patients report this premenstrually (Eisenlohr-Moul et al. 2022) |
| 21 | Used alcohol or substances to cope | Substance use as maladaptive coping | Clinically relevant; common in untreated PMDD |

**GROUP 5 — Functional Impairment Items (the 3 dedicated impairment items)**

| # | Item Name | What It Measures | Clinical Rationale |
|---|-----------|------------------|--------------------|
| 22 | Work or school performance or productivity | Occupational impact | Required by DSM-5 Criterion B; quantifies impairment |
| 23 | Social/leisure activities (hobbies, social events) | Social withdrawal | DSM-5 Criterion B; isolation is risk factor |
| 24 | Relationship with partner, family, or close friends | Interpersonal impact | DSM-5 Criterion B; most reported area of PMDD damage |

---

### 2.3 Scoring the DRSP: Calculating PMDD Likelihood

*Source: C-PASS methodology, PMC5205545; Endicott et al. 2006*

**Step 1 — Identify Cycle Windows**

Divide the cycle into:
- **Luteal/premenstrual window:** Days −7 to −1 (the 7 days before onset of menses)
- **Follicular/postmenstrual window:** Days +4 to +10 (days 4–10 after onset of menses)

**Step 2 — Calculate Mean Scores Per Window**

For each of the 11 symptom items, calculate:
- Luteal mean score = average of daily ratings across the premenstrual 7-day window
- Follicular mean score = average of daily ratings across the follicular 7-day window

**Step 3 — Apply C-PASS Thresholds**

A pattern is consistent with PMDD when all of the following are met across at least two cycles:

1. **Absolute Severity:** At least 5 of the 11 symptom items reach a rating of ≥4 (moderate) during the luteal window
2. **Core Mood Requirement:** At least 1 of items 1–4 (affective lability, irritability, depressed mood, anxiety) reaches ≥4
3. **Absolute Clearance:** No symptom exceeds a rating of 3 during the follicular window (days 4–10) — this confirms the symptom-free interval that distinguishes PMDD from PME
4. **Cyclicity:** The "range-scaled luteal–follicular difference" exceeds 30%: (Luteal Mean − Follicular Mean) ÷ (Maximum Rating Used − 1) × 100 > 30%

**Step 4 — Score Interpretation**

| Pattern | Interpretation |
|---------|----------------|
| All four C-PASS criteria met across 2 cycles | Strong pattern consistent with PMDD; share with clinician |
| Criteria 1 and 2 met but criterion 3 not met (no follicular clearance) | Pattern consistent with PME — pre-existing disorder worsening premenstrually |
| Only 1–4 symptoms reach threshold | MRMD (Menstrually Related Mood Disorder) — below PMDD threshold |
| No consistent pattern | Symptoms not cycle-linked; other evaluation needed |

**Note on Display:** The app should never diagnose PMDD. It should display: "Your tracking data shows a pattern that meets [X of 4] criteria for PMDD. Share this report with your healthcare provider for a formal evaluation."

---

### 2.4 Formatting DRSP Data for a Physician Report

The physician report should include:
1. A cycle-calendar heatmap: 2 cycles minimum, color-coded by total symptom burden per day
2. Per-symptom line graphs: luteal vs. follicular mean scores for each of the 11 DRSP items
3. Functional impact scores: average of items 22–24 during luteal vs. follicular phases
4. C-PASS criteria checklist: which criteria are met and which are not
5. A plain-language summary: "In the past two cycles, [User] reported [X] symptoms consistently in the luteal phase that resolved in the follicular phase. The symptom-free interval was [X] days. Core mood symptoms affected were: [list]. These patterns are consistent with / are not sufficient to assess / are inconsistent with PMDD according to DSM-5 criteria."
6. Treatment log: any medications, supplements, or therapeutic interventions recorded during the period, with dates

---

## SECTION 3: ALL DATA POINTS TO LOG

### 3.1 Daily Core Log (Every Day of the Cycle)

**A. Mood and Emotional Symptoms**

| Field Name | Type | When | Clinical Justification | Maps To |
|------------|------|------|----------------------|---------|
| `depressed_mood` | Scale 1–6 | Every day | DRSP item 1; DSM-5 Criterion A3 | DRSP #1, DSM-5 A3 |
| `anxiety_tension` | Scale 1–6 | Every day | DRSP item 2; most common presenting complaint | DRSP #2, DSM-5 A4 |
| `mood_swings_lability` | Scale 1–6 | Every day | DRSP item 3; hallmark PMDD symptom | DRSP #3, DSM-5 A1 |
| `irritability_anger` | Scale 1–6 | Every day | DRSP item 4; relationship impact marker | DRSP #4, DSM-5 A2 |
| `hopelessness` | Scale 1–6 | Every day | Suicide risk precursor; tracked separately from depressed mood | DRSP #19, PSST |
| `overwhelmed_out_of_control` | Scale 1–6 | Every day | DRSP item 10; precedes crisis states | DRSP #10, DSM-5 A10 |
| `sensitivity_to_rejection` | Scale 1–5 | Every day | Interpersonal rejection sensitivity is PMDD-specific beyond standard depression criteria | DRSP #3 sub-dimension |

**B. Physical Symptoms**

| Field Name | Type | When | Clinical Justification | Maps To |
|------------|------|------|----------------------|---------|
| `breast_tenderness` | Scale 1–6 | Every day | DRSP item 11; physical marker of luteal hormonal shift | DRSP #11, DSM-5 A11 |
| `bloating_weight_gain` | Scale 1–6 | Every day | DRSP item 12; fluid retention from progesterone | DRSP #12, DSM-5 A11 |
| `headache` | Scale 1–6 | Every day | DRSP item 13; hormonal migraine is common comorbidity | DRSP #13 |
| `joint_muscle_pain` | Scale 1–6 | Every day | DRSP item 14; prostaglandin-mediated inflammation | DRSP #14, DSM-5 A11 |
| `cramps_menstrual_pain` | Scale 1–6 | Every day | Dysmenorrhea tracks with PMDD severity and confounds mood scores | Clinical standard |
| `gastrointestinal_nausea` | Scale 1–5 | Every day | Nausea is a distinct PMDD somatic accompaniment with different clinical correlates than diarrhea or constipation; separating them improves trigger identification | Associated somatic |
| `gastrointestinal_diarrhea` | Scale 1–5 | Every day | Diarrhea in late luteal phase is prostaglandin-mediated; co-occurs with dysmenorrhea; distinct from metformin-related GI (PCOS overlap tracking) | Associated somatic |
| `gastrointestinal_constipation` | Scale 1–5 | Every day | Progesterone slows GI motility in luteal phase causing constipation; clinically distinct from diarrhea and warrants separate tracking | Associated somatic |
| `lower_back_pain` | Scale 1–5 | Every day | Lower back pain is named explicitly in the CEW PMDD chart (Royal Hospital for Women, Sydney) and St. Joseph's PMDD tracking protocol; lumbopelvic pain in luteal phase is prostaglandin-driven and clinically relevant | Associated somatic |
| `skin_changes` | Binary + text | Every day | Hormonal acne flares in luteal phase; medication decision-relevant | Associated somatic |
| `hot_flashes_night_sweats` | Scale 1–5 | Every day | Available in base log for ALL users — not gated behind perimenopause module. Hot flash tracking reveals perimenopause transition within PMDD context; onset in users under 45 is a clinical signal requiring documentation | Perimenopause transition + Base log (all users) |

**C. Cognitive Symptoms**

| Field Name | Type | When | Clinical Justification | Maps To |
|------------|------|------|----------------------|---------|
| `difficulty_concentrating` | Scale 1–6 | Every day | DRSP item 6; ADHD confound; cognitive impairment during luteal | DRSP #6, DSM-5 A6 |
| `brain_fog` | Scale 1–5 | Every day | Distinct from concentration difficulty; encompasses word-finding, processing speed | Clinical; ADHD module |
| `memory_issues` | Scale 1–5 | Every day | Working memory impairment in luteal phase documented in neuroimaging studies | DRSP #6 sub |
| `indecisiveness` | Scale 1–5 | Every day | Dysexecutive feature; affects daily functioning | DSM-5 Criterion B |

**D. Behavioral Symptoms**

| Field Name | Type | When | Clinical Justification | Maps To |
|------------|------|------|----------------------|---------|
| `decreased_interest_activities` | Scale 1–6 | Every day | DRSP item 5; anhedonia marker | DRSP #5, DSM-5 A5 |
| `behavioral_avoidance` | Scale 1–6 | Every day | DRSP items 16–17; withdrawal behavior | DRSP #16, #17 |
| `appetite_change` | Scale 1–6 + direction (increase/decrease) | Every day | DRSP item 8; carb craving is serotonin-linked | DRSP #8, DSM-5 A8 |
| `food_cravings_type` | Multi-select (carbs/sweets/salt/fat) | Every day | Specific craving patterns have diagnostic value | DRSP #8 sub |
| `impulsivity` | Scale 1–5 | Every day | Captures rage episodes, reckless decisions; ADHD intersection | DRSP #4 sub |

**E. Functional Impact**

| Field Name | Type | When | Clinical Justification | Maps To |
|------------|------|------|----------------------|---------|
| `work_school_performance` | Scale 1–6 | Every day | DRSP item 22; DSM-5 Criterion B occupational function | DRSP #22, DSM-5 B |
| `social_leisure_activities` | Scale 1–6 | Every day | DRSP item 23; social withdrawal dimension | DRSP #23, DSM-5 B |
| `relationship_impact` | Scale 1–6 | Every day | DRSP item 24; most impacted functional area per patient reports | DRSP #24, DSM-5 B |
| `productivity_hours_lost` | Number (hours) | Every day | Quantifies economic impact; useful for insurance/accommodation documentation | DRSP #15 |
| `parenting_impact` | Scale 1–5 | Every day (if applicable) | No validated PMDD instrument captures parenting impact; critical gap; high guilt burden | App-specific |

**F. Sleep**

| Field Name | Type | When | Clinical Justification | Maps To |
|------------|------|------|----------------------|---------|
| `sleep_duration` | Number (hours, decimal) | Every day | DRSP item 9; sleep changes are both symptom and amplifier of PMDD | DRSP #9, DSM-5 A9 |
| `sleep_quality` | Scale 1–5 | Every day | Poor sleep quality in PMDD documented in PMC3503382; predictive of next-day severity | DRSP #9 |
| `sleep_onset_difficulty` | Scale 1–5 | Every day | Insomnia subtype differentiation (onset vs. maintenance) | DRSP #9 sub |
| `early_waking` | Binary + time | Every day | Early morning awakening is depression marker; differentiates from hypersomnia | DSM-5 A9 |
| `sleep_type` | Selection (too much/too little/disrupted/normal) | Every day | Direction of sleep change matters for treatment (hypersomnia vs. insomnia respond differently) | DRSP #9 |

**G. Energy and Vitality**

| Field Name | Type | When | Clinical Justification | Maps To |
|------------|------|------|----------------------|---------|
| `energy_level` | Scale 1–6 | Every day | DRSP item 7; lethargy is one of most common PMDD physical complaints | DRSP #7, DSM-5 A7 |
| `fatigue_type` | Selection (physical/mental/both) | Every day | Distinguishes muscular fatigue (somatic) from mental exhaustion (cognitive) | DRSP #7 sub |

**H. Cycle Data**

| Field Name | Type | When | Clinical Justification | Maps To |
|------------|------|------|----------------------|---------|
| `cycle_day` | Number (auto-calculated) | Every day | Foundation of all phase-based analysis | All DRSP calculations |
| `menstruation_today` | Binary | Every day | Anchor point for cycle calculations | Cycle algorithm |
| `bleed_intensity` | Scale 1–5 | On menstrual days | Dysmenorrhea correlates with PMDD severity; heavy bleeding is comorbidity flag | Associated |
| `spotting` | Binary | Every day | Spotting outside menses can indicate anovulatory cycles; affects luteal prediction | Cycle algorithm |
| `ovulation_confirmed` | Binary + method (LH strip/basal temp/CM/device) | Entered by user or synced | PMDD is luteal-phase specific — must confirm ovulation occurred | Phase model |
| `cycle_day_manual_override` | Number | On request | Allows correction without losing historical data | Data integrity |

---

### 3.2 Trigger Log (As-Needed, Prompted at Log Entry)

| Field Name | Type | Clinical Justification |
|------------|------|----------------------|
| `stress_level` | Scale 1–10 + stressor category | Stress is a documented PMDD amplifier; cortisol interacts with allopregnanolone pathway |
| `caffeine_intake` | Number (mg) or servings | Caffeine worsens anxiety and sleep in luteal phase; dose-dependent correlation |
| `alcohol_intake` | Standard drinks | Alcohol worsens PMDD symptoms; masks early-cycle emotional data |
| `exercise_type` | Multi-select (cardio/strength/yoga/walk/none) | Aerobic exercise increases serotonin; 3×/week significantly improves PMDD (Harvard Health review) |
| `exercise_duration` | Number (minutes) | Dose-response evidence for exercise benefits |
| `exercise_intensity` | Scale 1–5 | Distinguishes therapeutic exercise from overtraining (which can worsen fatigue) |
| `diet_quality` | Scale 1–5 + optional notes | High sugar, red meat, and salt worsen PMDD; simplified for compliance |
| `social_interaction_type` | Selection (isolated/small group/large group/avoided plans) | Isolation is both symptom and risk factor |
| `sun_exposure` | Scale 1–3 (none/some/lots) | Bright light therapy has limited but real evidence for PMDD mood; relevant for seasonal patterns |
| `work_from_home_vs_office` | Binary | Context variable; WFH may reduce interpersonal triggers or increase isolation |

---

### 3.3 Treatment Monitoring

| Field Name | Type | Clinical Justification |
|------------|------|----------------------|
| `ssri_name` | Text/select | SSRIs are first-line PMDD treatment (ACOG CPG No. 7, 2023) |
| `ssri_dose_mg` | Number | Dose tracking is essential for luteal-phase dosing protocol |
| `ssri_dosing_pattern` | Selection (continuous/luteal-phase only/other) | Luteal-phase intermittent dosing is evidence-based and changes what constitutes adequate response |
| `ssri_taken_today` | Binary | Adherence tracking; gaps during luteal phase explain treatment failures |
| `contraceptive_type` | Text/select | Hormonal contraceptives are first-line for PMDD (ACOG CPG No. 7); different formulations have different effects |
| `contraceptive_taken_today` | Binary | COC adherence matters; missed pills can trigger withdrawal bleeds and symptom spikes |
| `calcium_dose_mg` | Number | ACOG recommends 1000–1200 mg/day; RCT evidence exists |
| `magnesium_dose_mg` | Number | RCT evidence for irritability, depression, anxiety, fatigue reduction |
| `vitamin_b6_dose_mg` | Number | RCOG first-line; note: toxicity above 100 mg/day |
| `vitex_agnus_castus_dose_mg` | Number | Systematic review supports efficacy for PMS/PMDD; ACOG notes mechanism unclear |
| `other_supplements` | Text + dose | Evening primrose oil, omega-3, zinc — user-reported; clinically relevant to track |
| `therapy_session_today` | Binary | CBT is first-line treatment (ACOG CPG No. 7); tracks therapeutic engagement |
| `therapy_type` | Selection (CBT/DBT/EMDR/other) | Different modalities have different evidence bases for PMDD |

---

### 3.4 Contextual Factors

| Field Name | Type | Clinical Justification |
|------------|------|----------------------|
| `major_life_stressor` | Binary + free text | Major stressors amplify PMDD; needed for clinical interpretation |
| `relationship_conflict_today` | Scale 1–5 | DRSP item 24 functional impact; relationship conflict is both cause and effect |
| `work_conflict_today` | Scale 1–5 | Occupational impairment is Criterion B; conflict can be result of PMDD-driven irritability |
| `self_assessment_work_quality` | Scale 1–5 | Subjective productivity tracks with DRSP item 15 |
| `parenting_capacity` | Scale 1–5 | No existing validated scale captures parenting impact; critical for mothers |
| `social_cancellations` | Number | Behavioral withdrawal count; correlated with depression severity |
| `voice_note` | Audio (60 seconds max) | Qualitative capture on high-symptom days when typing is intolerable; timestamp preserved |
| `free_text_note` | Text | Open field; essential for capturing what scales miss |

---

### 3.5 Safety Module (Displayed Based on Item 20 Score or User-Initiated)

| Field Name | Type | Clinical Justification |
|------------|------|----------------------|
| `suicidal_ideation_today` | Scale 1–6 (mapped from DRSP item 20) | 39–82% of PMDD patients report luteal suicidal ideation; this must be tracked (Eisenlohr-Moul et al. 2022; PMC8832802) |
| `self_harm_urge` | Scale 1–5 | 47% of PMDD patients report self-harm during episodes (Frontiers in Psychiatry, 2024) |
| `safety_plan_reviewed_today` | Binary | Prompted when ideation score ≥4 |
| `crisis_contact_used` | Binary | 988 contact; supports clinical safety documentation |

---

### 3.6 ADHD Module (Activated When User Identifies ADHD Comorbidity)

*Source: PMC10751335; PMC10872410 — ADHD and Menstrual Cycle*

| Field Name | Type | Clinical Justification |
|------------|------|----------------------|
| `stimulant_medication_name` | Text/select | ~45% of women with ADHD have PMDD; stimulant tracking is critical |
| `stimulant_dose_mg` | Number | Luteal-phase stimulant dose adjustment is evidence-based (PMC10751335) |
| `stimulant_taken_today` | Binary | Adherence + effectiveness mapping |
| `stimulant_dose_adjusted` | Binary + new dose | Tracks premenstrual dose elevation protocol |
| `executive_function_rating` | Scale 1–5 | Captures ADHD-specific dimension distinct from general concentration |
| `hyperfocus_today` | Binary | Paradoxical hyperfocus is ADHD/luteal-specific |
| `impulsivity_level` | Scale 1–5 | Impulsivity increases in luteal phase in ADHD users |
| `adhd_medication_effectiveness` | Scale 1–5 | Documents reduced stimulant efficacy in late luteal (progesterone antagonizes dopamine pathway) |
| `task_initiation_difficulty` | Scale 1–5 | ADHD-specific executive function; not captured in standard DRSP |

---

## SECTION 4: FEATURE LIST — COMPLETE FROM A TO Z

### F-01: DRSP Daily Tracker
**Description:** A 24-item daily log implementing the full DRSP instrument with phase-aware interface.  
**Data used:** All 24 DRSP fields + cycle day.  
**Clinical evidence:** DRSP is the gold-standard validated instrument for PMDD prospective assessment (Endicott et al. 2006; ACOG CPG No. 7, 2023). No other instrument has equivalent validity for PMDD diagnosis support.  
**MVP Priority:** P0  
**Technical complexity:** M  
**Key design note:** The interface must be completable in under 90 seconds on a symptomatic day. During high-burden phases, the cognitive load must be minimal. One tap per symptom minimum.

---

### F-02: Luteal Phase Predictor
**Description:** Predicts when the user is entering the luteal phase based on cycle length history, with confidence intervals.  
**Data used:** Menstruation dates, cycle length history, optional ovulation markers.  
**Clinical evidence:** PMDD symptoms are exclusively luteal. Accurate luteal detection determines whether symptoms are being correctly attributed. Cycle irregularity is common; the algorithm must handle irregular cycles gracefully (mean ± SD method, updated with each new cycle).  
**MVP Priority:** P0  
**Technical complexity:** M  
**Note:** Prediction must degrade gracefully for irregular cycles. Display confidence: "We estimate your luteal phase starts around [date] ± 2 days." Never display overdue language.

---

### F-03: PMDD Diagnostic Pattern Detection
**Description:** Applies C-PASS logic to two completed cycles of DRSP data and displays which diagnostic criteria are met.  
**Data used:** All DRSP items across ≥2 complete cycles.  
**Clinical evidence:** C-PASS (PMC5205545) is the standardized protocol for applying DSM-5 PMDD criteria to DRSP data. It has published reliability and validity data.  
**MVP Priority:** P0  
**Technical complexity:** L  
**Liability note:** The app displays "consistent with PMDD pattern" not "you have PMDD." Formal diagnosis requires clinical evaluation.

---

### F-04: Physician Report Generator (DRSP Format PDF)
**Description:** Generates a clinical-grade PDF/shareable report with cycle calendar heatmap, per-symptom phase comparison, C-PASS criteria summary, and treatment log.  
**Data used:** All DRSP data, treatment log, contextual notes.  
**Clinical evidence:** ACOG CPG No. 7 requires prospective 2-cycle tracking for diagnosis; providing physician-ready output reduces the barrier to clinical evaluation and reduces the average 20-year diagnosis delay (Frontiers in Psychiatry 2024).  
**MVP Priority:** P0  
**Technical complexity:** M

---

### F-05: SSRI Luteal-Phase Dosing Tracker
**Description:** Tracks SSRI name, dose, dosing pattern (continuous vs. luteal-phase intermittent), and daily adherence. Displays effectiveness correlation against symptom severity.  
**Data used:** `ssri_name`, `ssri_dose_mg`, `ssri_dosing_pattern`, `ssri_taken_today`, DRSP scores.  
**Clinical evidence:** Intermittent luteal-phase SSRI dosing is FDA-recognized and evidence-based (PMC10074750; ACOG CPG No. 7). Adherence gaps during luteal phase explain many "non-responders." SSRIs have rapid onset in PMDD (1–3 days) unlike depression (weeks), making dose-timing correlation clinically meaningful.  
**MVP Priority:** P1  
**Technical complexity:** S

---

### F-06: Supplement Tracker with Evidence Ratings
**Description:** Logs supplements with doses and displays an evidence-tier badge (Strong/Moderate/Limited/Unsupported) for each supplement based on peer-reviewed evidence.  
**Data used:** All supplement fields.  
**Clinical evidence:** Calcium (1000–1200 mg): ACOG-recommended; RCT evidence. Magnesium: RCT support for irritability, fatigue. B6: RCOG first-line; toxicity above 100 mg. Vitex agnus castus: systematic review supports efficacy, mechanism unclear (ACOG CPG No. 7). Evidence ratings protect users from misinformation.  
**MVP Priority:** P1  
**Technical complexity:** S

---

### F-07: Crisis Detection and 988 Integration
**Description:** Monitors DRSP item 20 (suicidal ideation) and self-harm field. When scores reach threshold (≥4), displays a soft check-in prompt. When scores reach critical threshold (≥5) or user manually triggers, displays safety plan + direct dial to 988 + text option.  
**Data used:** `suicidal_ideation_today`, `self_harm_urge`, cycle phase.  
**Clinical evidence:** 39–82% of PMDD patients experience suicidal ideation during luteal peak (PMC8832802; Frontiers in Psychiatry 2024). Cyclical predictability of PMDD-related suicidality enables proactive safety planning — a feature no existing period app offers.  
**MVP Priority:** P0  
**Technical complexity:** M  
**Safety design rule:** Never bury the crisis resource. On a day when suicidal ideation is logged at any level, the crisis resource must be visible on the home screen without any navigation.

---

### F-08: Rage and Mood Episode Log (Timestamped)
**Description:** A one-tap quick-capture log for acute mood episodes: rage, crying, dissociation, panic. Records time, intensity, duration, and optional voice note or text description.  
**Data used:** `mood_swings_lability`, `irritability_anger`, `voice_note`, timestamp.  
**Clinical evidence:** PMDD mood episodes are often dismissed by clinicians because patients cannot recall specifics during appointments. Timestamped episode logs provide objective forensic-level evidence of cycle-linked pattern. This is the feature users most often request when explaining what existing apps miss.  
**MVP Priority:** P1  
**Technical complexity:** S

---

### F-09: Relationship Impact Log
**Description:** Dedicated logging for relationship conflicts caused or worsened by PMDD, with timestamp and relationship type (partner/family/friends/colleague).  
**Data used:** `relationship_conflict_today`, `relationship_impact`, timestamp, relationship type.  
**Clinical evidence:** DRSP item 24 captures relationship functional impairment. Research consistently identifies relationships as the most impacted functional domain in PMDD. Documenting this helps couples therapy, helps clinicians assess Criterion B, and helps users build the case for accommodation.  
**MVP Priority:** P1  
**Technical complexity:** S

---

### F-10: Work and Academic Impact Log
**Description:** Tracks hours lost to PMDD symptoms, self-assessed work quality, tasks avoided or postponed due to cognitive and emotional impairment.  
**Data used:** `work_school_performance`, `productivity_hours_lost`, `work_conflict_today`.  
**Clinical evidence:** DRSP items 15, 22 capture occupational impairment. PMDD carries significant economic burden through absenteeism and presenteeism. Documentation supports workplace accommodation requests and disability documentation.  
**MVP Priority:** P1  
**Technical complexity:** S

---

### F-11: ADHD-Hormone Interaction Tracker
**Description:** A module for users with PMDD + ADHD comorbidity. Tracks stimulant dose, ADHD symptom severity across cycle phases, and prompts for luteal-phase dose adjustment conversation with prescriber.  
**Data used:** All ADHD module fields.  
**Clinical evidence:** ~45% of women with ADHD have PMDD (PMC10872410). Luteal-phase stimulant dose increases are evidence-based (PMC10751335). No existing consumer health app implements this functionality.  
**MVP Priority:** P2  
**Technical complexity:** M

---

### F-12: Phase Transition Notifications
**Description:** When the app predicts the user is entering a new cycle phase (especially early luteal), it sends a personalized, compassionate notification that references their personal data: "Based on your last 3 cycles, your highest-intensity symptom days are typically days 22–26. You're entering that window now."  
**Data used:** Cycle predictor, historical DRSP average per phase, `typical_symptom_days`.  
**Clinical evidence:** PMDD predictability is both a burden and a resource. Knowing a wave is coming enables coping preparation. Cyclical crisis planning is clinically more effective for PMDD than general crisis intervention (Frontiers in Psychiatry 2024).  
**MVP Priority:** P1  
**Technical complexity:** M

---

### F-13: Historical Cycle Comparison
**Description:** Side-by-side visualization of the current cycle vs. the previous 2–6 cycles, showing how today compares to the same cycle day in previous cycles.  
**Data used:** All DRSP fields, all cycles logged.  
**Clinical evidence:** Prospective pattern comparison is the mechanism by which PMDD is distinguished from other conditions. Showing the user "this is cycle 3, last cycle looked like this" is powerful psychoeducation and supports clinical conversations.  
**MVP Priority:** P1  
**Technical complexity:** M

---

### F-14: Trigger Correlation Engine
**Description:** Statistical analysis of logged triggers vs. symptom severity. Displays: "On days after poor sleep, your irritability scores are 34% higher. On days you exercised in the follicular phase, your next-day mood scores were 21% better."  
**Data used:** All trigger fields, DRSP scores, cycle phase.  
**Clinical evidence:** Individual trigger profiles vary. Caffeine worsens anxiety in some users and has no effect in others. Personalized correlation feedback increases behavior change efficacy and clinical relevance beyond population-level recommendations.  
**MVP Priority:** P2  
**Technical complexity:** L

---

### F-15: Ora Phase-Aware Conversation Module
**Description:** The Ora AI companion (HormonaIQ's conversational assistant) operates under PMDD-specific persona rules. During luteal peak, Ora shifts from information delivery to validation and safety-checking. Ora never offers "mood tips" or "try these exercises" during a crisis state. Ora speaks from a place of "I see you, this is real, here is what is happening in your body."  
**Data used:** Current cycle phase, today's DRSP scores, safety scores.  
**Clinical evidence:** Psychoeducation about the biological basis of PMDD reduces shame and increases treatment-seeking (IAPMD Facts & Figures). PMDD patients consistently report that being told "it's hormones" without validation is harmful. Ora must embody the clinical reality: PMDD is a neurobiological disorder, not a character flaw.  
**MVP Priority:** P0 (persona rules); P1 (automated phase switching)  
**Technical complexity:** M

---

### F-16: Community Phase Matching
**Description:** Anonymous matching with other users in the same estimated cycle phase. Users can see they are "not alone right now" without exposing personal data. Optional: post to a shared "luteal wall."  
**Data used:** Current phase (anonymized), opt-in status.  
**Clinical evidence:** Social isolation worsens PMDD. Connecting with at least one person during crisis significantly reduces risk (Frontiers in Psychiatry 2024). Phase-matched community creates the shared understanding that traditional support communities cannot.  
**MVP Priority:** P2  
**Technical complexity:** L

---

### F-17: Partner and Support Person Share Mode
**Description:** A limited-access view that users can share with a partner, parent, or close friend. Shows current phase, today's symptom summary, and what kind of support is requested. The support person does not see full DRSP data.  
**Data used:** Current phase, mood summary (aggregate), `support_preference_today`.  
**Clinical evidence:** Interpersonal support is protective against PMDD severity. Partners consistently report not understanding what is happening or what to do. Structured sharing reduces conflict caused by miscommunication during symptomatic phases.  
**MVP Priority:** P2  
**Technical complexity:** M

---

### F-18: Export to Doctor (DRSP Format)
**Description:** One-tap export of the physician report (see F-04) as a PDF, shareable via email, AirDrop, or medical portal.  
**Data used:** All DRSP data, treatment log.  
**Clinical evidence:** The average time from PMDD symptom onset to diagnosis is approximately 20 years (Frontiers in Psychiatry 2024). The primary barrier is lack of prospective documentation when patients arrive at appointments. This feature directly addresses that gap.  
**MVP Priority:** P0  
**Technical complexity:** S

---

### F-19: Perimenopause Transition Tracker
**Description:** For users over 35 or users experiencing irregular cycles, an additional module tracks hot flashes, night sweats, cycle irregularity, and perimenopausal symptom onset. Flags when PMDD symptom patterns begin shifting (e.g., more frequent cycles, longer symptomatic windows, anovulatory cycles).  
**Data used:** `hot_flashes_night_sweats`, `cycle_day`, `cycle_length_history`, age.  
**Clinical evidence:** PMDD worsens significantly during perimenopause due to erratic hormonal fluctuations (Gennev; Elektra Health; Mayo Clinic Press). As cycles become irregular, PMDD symptoms become less predictable and more frequent. HRT stabilizes the hormonal environment and reduces PMDD severity in perimenopause.  
**MVP Priority:** P2  
**Technical complexity:** M

---

### F-20: Safety Planning Feature
**Description:** A cycle-aware, pre-built safety plan that users complete during a low-symptom follicular phase. The plan is surfaced automatically when the app detects the user is entering their high-risk luteal window. Includes: warning signs list, coping strategies, people to contact, reasons to live (user-authored), 988 and local emergency contacts.  
**Data used:** Safety plan content (user-authored), cycle phase, `suicidal_ideation_today`.  
**Clinical evidence:** The Stanley-Brown Safety Planning Intervention is evidence-based for suicide prevention. PMDD's cyclical predictability makes it uniquely suitable for pre-built, phase-triggered safety plans — a functionality gap in all existing PMDD apps and general safety plan apps alike.  
**MVP Priority:** P0  
**Technical complexity:** M

---

## SECTION 5: DOCTOR TEAM DEBATE

*Simulated clinical meeting: HormonaIQ Medical Advisory Panel*  
*Location: Virtual meeting, Q1 2026*  
*Participants: Dr. Andrea (reproductive psychiatrist), Dr. Maya (OB-GYN), Dr. Chen (clinical psychologist), Sarah (patient advocate, IAPMD community), Dr. Park (psychiatrist, suicidology)*

---

**FACILITATOR:** What is the single most important data point to collect from PMDD users?

**Dr. Maya (OB-GYN):** I'll go first — it's the DRSP total luteal score, full stop. Every other data point in this spec is downstream of that. If I have a patient come in with two cycles of DRSP data, I can make a diagnosis. If she comes in with a voice note diary or a mood emoji log, I'm starting over. We are building a clinical tool, not a journaling app. The physician report depends on DRSP data. The C-PASS calculation depends on DRSP data. Without that foundation, none of the other features matter. Prioritize DRSP compliance above everything.

**Dr. Chen (clinical psychologist):** I disagree with the framing. The single most important data point is the relationship impact score — DRSP item 24. Not because it's more diagnostically significant, but because it's what brings people to treatment. Nobody seeks help because their DRSP item 7 (fatigue) is elevated. They come in because they said something they regret to their partner. They come in because they're watching their marriage deteriorate and they don't understand why. Item 24 is the motivational lever. If you want users to engage with the app long enough to complete two cycles of DRSP data, lead with what they actually care about. Relationship impact is that entry point.

**Sarah (patient advocate):** With respect — you're both right about what's useful clinically, but you're missing what people actually need. The most important thing isn't a data field. It's the voice note. I can't fill in a scale on day 26. I can't even hold my phone steady. But I can tap one button, hold it up, and say "I feel like I'm going to die and I don't know why." That recording with a timestamp is proof. It's proof for my doctor, it's proof for my partner, and it's proof for myself that what I experienced was real — because on day 3 of my next cycle I will not believe it happened. The voice note is the feature that makes me trust the app.

**Dr. Andrea (reproductive psychiatrist):** Sarah is making a design argument and I want to validate it while adding the clinical piece. The voice note is a qualitative anchor for quantitative data — I agree it should be there. But the most important data point for my purposes is the symptom-free follicular interval. Without confirming that symptoms resolve between day 4 and day 10 of the next cycle, I cannot distinguish PMDD from PME or from treatment-refractory depression. The app must collect every day, not just symptomatic days. That data point — the clean follicular phase — is what makes the difference between a PMDD diagnosis and a major depressive disorder diagnosis.

**Dr. Park (suicidology):** From my perspective, none of those are the most important if we don't have the safety field. DRSP item 20 — suicidal ideation — must be collected daily, every single day of the cycle, not just during luteal. We know from the research that ideation typically intensifies in luteal and resolves postmenstrually, but some patients have residual ideation outside the luteal phase. If we're only asking about suicidality on luteal days, we create a dangerous blind spot. And the app needs to be very careful about how it asks. "Do you have thoughts of hurting yourself?" asked in the wrong tone on day 26 is a crisis intervention. It needs to be asked in a normalized, non-alarming way that validates PMDD experience while still capturing the data and connecting users to resources.

---

**FACILITATOR:** Should the app attempt to detect PMDD diagnostically, or only provide data?

**Dr. Andrea:** The app should not diagnose. Full stop. That is a clinical decision requiring history, physical exam, differential diagnosis, and professional judgment. The liability exposure alone is prohibitive. What the app should do is say: "Your data pattern meets [X] of 4 C-PASS criteria for PMDD. Here is a report to share with your clinician." That is a clinically meaningful and legally defensible statement.

**Dr. Maya:** I mostly agree with Andrea, but I want to push back on the liability framing slightly. The bigger clinical danger is not over-diagnosing — it's under-diagnosing. The 20-year average diagnosis gap exists because women go to doctors without data and get dismissed. If the app says nothing interpretive, users with clear patterns will still be told "it's just stress." The app should display pattern information — what the DRSP data shows — clearly enough that it is actionable in a clinical conversation. "Your data is consistent with PMDD" + a physician report is defensible. A blank data export that requires a PhD to interpret is not serving users.

**Dr. Chen:** The clinical liability argument is real, but the more important thing is user expectation management. If the app implies diagnostic authority and a user's doctor later disagrees, the user loses trust in the app and potentially in the doctor. We need language that's clear: "This is data. Your clinician interprets it." The physician report should do the heavy lifting — not the in-app copy.

**Sarah:** I've talked to hundreds of PMDD patients. They know they have PMDD. They've known for years. What they don't have is proof in a format their doctor will take seriously. The app shouldn't try to diagnose — Sarah agrees with Andrea — but it should validate. There's a difference between saying "you have PMDD" and saying "your data shows a consistent pattern of symptoms that resolve after menstruation begins. This is exactly what PMDD looks like. Here's the report." That second thing is not a diagnosis. It's recognition. And recognition is what has been missing for 20 years.

---

**FACILITATOR:** How granular should the daily log be? More data vs. more compliance.

**Dr. Chen:** Research on ecological momentary assessment is clear: log burden is the primary predictor of dropout. The ideal log takes 60 seconds on a symptomatic day. That means the core DRSP questions must be collapsible, swipeable, or tappable — not 24 individual text fields. The app should not present all 24 items every day. It should present the highest-priority items (the 4 core mood symptoms + the 3 functional impact items) as the minimum viable daily log, with the option to expand to full detail. On days when a user is in crisis, the 7-item condensed version should be the default.

**Dr. Maya:** I agree with the compliance argument but I want to preserve the ability for full DRSP data collection. The physician report is only as good as the data behind it. If we start collapsing and abbreviating, we degrade clinical utility. My recommendation: full DRSP by default in the first 7 days to establish a baseline, then user-selectable between full and condensed. The app should not decide for the user; it should respect clinical utility.

**Dr. Andrea:** The way to solve this is adaptive questioning. If a user's item 20 (suicidal ideation) has been a consistent 1 across 30 days, stop asking about it daily — ask weekly with a one-tap "same as usual" default. But if item 20 ever scores a 4 or above, it moves back to daily mandatory. Build intelligence into the log cadence.

**Sarah:** I just want to say: the worst days are when you cannot interact with the app at all. And those are exactly the days the data is most important. The one-button voice memo is my answer to this. Don't require 90 seconds on day 26 — give me 10 seconds to record something real, and let the app fill in the rest with yesterday's scores as defaults. Asking me to rate my depressed mood on a 1-to-6 scale when I am in full PMDD episode is its own act of cruelty.

---

**FACILITATOR:** What do PMDD patients need that no existing tool provides?

**Dr. Park:** A cycle-aware safety plan that is pre-built and pre-staged. Every mental health app has a generic safety plan. None of them understand that for PMDD users, they know with some predictability when the danger window is coming. The safety plan should surface itself three days before their historically highest-risk luteal days. It should not wait for the user to reach out. It should say: "This is typically when things get hard for you. Your safety plan is here."

**Dr. Chen:** A bridge from app to clinician that actually works. Not PDF export into a void. Ideally, structured data in a format that imports into EHR systems. But even short of that: a templated email the user can send to their doctor from the app, with the report attached, and a subject line that says "PMDD prospective tracking data — requesting evaluation."

**Sarah:** The "I forgive myself" button. That is not a joke. One of the most devastating things about PMDD is the follicular phase remorse — when the symptoms clear and you look back at what you said or did. An app that helps me understand that my behavior was a symptom, not a character flaw, and that gives me language to process it — that is what no existing tool does.

**Dr. Maya:** Perimenopause transition detection. PMDD patients in their late 30s and early 40s are falling off the diagnostic cliff. Their cycles become irregular. Their PMDD becomes less predictable. The algorithms that work perfectly for a 28-day regular cycle fail. An app that can detect "your cycle patterns are changing in ways consistent with perimenopause, and here is how that changes your PMDD management" would serve a vastly underserved population.

---

**FACILITATOR:** What is the single most dangerous thing an app could do wrong for PMDD users?

**Dr. Park:** Normalizing suicidal ideation as a PMDD symptom without providing safety resources. There is a clinical distinction between "this is a recognized feature of PMDD" (which reduces shame and enables treatment) and "this is normal so you don't need to take it seriously" (which creates lethal complacency). The app must track suicidal ideation, must normalize the conversation, and must immediately connect it to resources. Every time. No exceptions.

**Dr. Andrea:** Allowing users to screen themselves as "not PMDD" based on app data alone, when they might have a more serious condition — bipolar II, PTSD with premenstrual exacerbation, psychosis with luteal triggering. The app must always recommend clinical evaluation for any user whose data shows significant impairment. "Your data does not meet PMDD criteria" cannot be displayed without "Please discuss your symptoms with a healthcare provider."

**Dr. Chen:** Gamification of logging during symptomatic phases. Any streak counter, reward badge, or completion score that punishes missed logs on the worst days is actively harmful. A user who misses three days during luteal peak because she cannot get out of bed should not open the app and see a broken streak. She should see: "We missed you. Are you okay? Here is a quick 30-second check-in."

**Sarah:** Telling me what I already know is hormonal. "Remember, your symptoms will pass when your period starts." I know that. That knowledge does not make day 26 survivable. The most dangerous thing the app can do is reduce my lived experience to a hormonal explanation and call it support. Validation first. Biology second.

---

## SECTION 6: LOGGING PROTOCOL

### 6.1 Recommended Logging Frequency Per Phase

| Phase | Days (Approximate) | Recommended Log | Minimum Required |
|-------|-------------------|-----------------|------------------|
| Menstrual | Days 1–5 | Full DRSP + bleed intensity | DRSP 4 core + functional 3 |
| Follicular (early) | Days 6–10 | Full DRSP | DRSP 4 core — this window is the diagnostic baseline |
| Follicular (late)/Ovulatory | Days 11–17 | Abbreviated (4 core + 3 functional + 1 energy) | 4 core mood |
| Early luteal | Days 17–21 | Full DRSP | DRSP 4 core + functional 3 |
| Late luteal/PMDD peak | Days 22–28 | Full DRSP + triggers + safety | All 24 items; safety item always required |

### 6.2 What Happens if a User Doesn't Log for 3+ Days

1. **Day 1 missed:** No notification. Missed days appear as data gaps in the chart — no negative language.
2. **Day 2 missed:** Gentle in-app prompt on next open: "We haven't heard from you in a couple of days. A quick 30-second log helps preserve your pattern. No pressure."
3. **Day 3 missed (in luteal phase only):** Soft check-in notification: "Are you okay? We noticed you haven't logged during what's typically a harder time for you. We're here." Include direct link to safety resources.
4. **Day 3 missed (in follicular phase):** Soft reminder with backfill option. Allow backdating up to 7 days for approximate entries, with a note that backdated entries are marked as retrospective in the physician report.
5. **Never:** Broken streaks, guilt language, missed badge removal, or any framing that implies the user has failed.

### 6.3 Minimum Dataset for PMDD Diagnostic Pattern

- At least **2 complete menstrual cycles** of daily logs
- At least **7 consecutive days** logged in the late luteal window (days −7 to −1) for each cycle
- At least **5 consecutive days** logged in the follicular window (days +4 to +10) for each cycle
- At least **4 of the 11 DRSP symptom items** completed on each logged day
- At minimum, **1 of the 4 core mood symptoms** completed each day

If this threshold is not met, the physician report is not generated and the C-PASS pattern assessment is not run. Instead, the app displays: "You need [X more days] of data to generate a clinical report. Keep logging — you're [X%] there."

### 6.4 Minimum Dataset for Physician Report

All of the above, plus:
- Treatment log entries for at least one full cycle
- At least one free-text or voice note entry (strongly recommended; displayed as optional)
- User-verified start and end dates for at least two menstrual periods

### 6.5 How to Incentivize Logging Without Gamification

**Do:**
- Show the user their own pattern: "You've tracked 18 days this cycle — your pattern is becoming clearer."
- Progress toward clinical utility: "You're 5 days away from a complete physician report."
- Surface insights as they become available: "We noticed your sleep score affects your next-day irritability. Here's what your data shows."
- Celebrate clinical milestones: "You now have two complete cycles of DRSP data. This is enough for your doctor to evaluate you for PMDD."

**Do not:**
- Use streak counters of any kind
- Display "days missed" counts
- Use completion percentages that emphasize what is missing
- Send motivational reminders with language like "stay consistent" or "don't break your habit"

---

### 6.6 Anti-Anchoring UX Protocol (Clinically Validated)

*Source: CEW PMDD Daily Tracking Chart, Royal Hospital for Women (Sydney); St. Joseph's Hospital PMDD Tracking Protocol; DRSP validation literature (PMC5205545)*

**The clinical problem:** When users log their symptoms while seeing yesterday's scores, they anchor to the prior entry. This distorts longitudinal data in a predictable direction — users adjust their score relative to the previous day rather than reporting their absolute experience. This is a known psychometric bias called "anchoring" or "context bias" in rating scale research. The DRSP validation studies note this as a source of measurement error.

**The clinical solution — blinding during entry:** Clinical tracking protocols at the CEW (Sydney) and St. Joseph's (Hamilton) explicitly instruct patients to cover previous entries while filling in the current day's column. The St. Joseph's chart is a physical paper form where each day's column is narrow enough to fold and cover prior entries.

**App implementation requirement (P0):**
- During any active logging session, the app must NOT display the previous day's scores on the logging screen
- Scores from previous days are only visible in the calendar/history view — never on the active log form
- After completing the log, the user may review their history (full chart view, swipe to see prior entries)
- The physician report shows all days — including the blinded entries — in full

**Why this is non-negotiable:** An anchored dataset looks like smoother, lower-variance PMDD than actually exists. This systematically underestimates severity at the DRSP scoring step and can cause clinical misclassification (fails C-PASS threshold). A misclassification means the user is told she doesn't have PMDD when she does.

---

### 6.7 Plain-Language Scale Anchors

*Source: St. Joseph's PMDD Tracking Protocol; user research from Beddig et al. PMC11687174; CEW PMDD chart labels*

The DRSP's 1–6 numerical scale is clinically validated but requires anchor labels to be used accurately in a consumer app. The following anchor labels are mandatory on every logging slider or scale element:

| Score | DRSP Label | Plain-Language Anchor (HormonaIQ UI) |
|-------|-----------|--------------------------------------|
| 1 | Not at all | Not at all |
| 2 | Minimal | Very mild — barely noticeable |
| 3 | Mild | Mild — I notice it but it's manageable |
| 4 | Moderate | Moderate — it's affecting my day |
| 5 | Severe | Severe — it's significantly impairing me |
| 6 | Extreme | Extreme — I can barely function |

**Implementation rule:** Labels must appear at minimum at the endpoints (1 and 6) with midpoint label at 3. Ideally all 6 labels are shown on a horizontal slider. The labels must be visible without tapping — they cannot be hidden in tooltips. Users in luteal peak have reduced cognitive bandwidth; tooltips add friction they will not tolerate.

---

## SECTION 7: WHAT NO EXISTING APP DOES

*Gap analysis: features with clinical value that are absent from Belle, Me v PMDD, PMDD Tracker, and all general period trackers as of April 2026*

### Gap 1: Cycle-Aware, Phase-Triggered Safety Planning
No existing PMDD app, and no general mental health safety plan app, implements a safety plan that is pre-staged based on the user's personal historical risk window within their cycle. The clinical literature clearly shows that PMDD suicidality is cyclically predictable for individual users. An app that can say "your highest-risk window historically is days 23–27 — would you like to review your safety plan today?" is delivering crisis prevention, not just crisis response. This is a novel, clinically significant feature that could reduce PMDD-related suicides.

### Gap 2: Stimulant Dose Tracking for PMDD-ADHD Comorbidity
No consumer health app tracks the interaction between ADHD medication efficacy and menstrual cycle phase. The evidence for luteal-phase stimulant dose adjustment exists (PMC10751335), affects ~45% of women with ADHD, and is never implemented in any tracking tool. A user who knows her Adderall stops working in her luteal phase — and has data to show her psychiatrist — can get appropriate care. Without the data, she's told to "take a break" from stimulants during her most cognitively impaired week.

### Gap 3: PME vs. PMDD Differentiation Tool
Every existing PMDD app tracks only luteal symptoms. None of them track the follicular phase with clinical rigor to enable the PME vs. PMDD distinction. The C-PASS diagnostic framework requires demonstrated follicular clearance — absence of significant symptoms between days +4 and +10. An app that only logs luteal-phase symptoms actively prevents this distinction from being made. The 40% of women who seek PMDD treatment but have PME need different treatment (continuous vs. intermittent SSRI). Building the follicular baseline into the core logging loop is a clinical differentiator no existing app has.

### Gap 4: Perimenopause Transition Detection Within a PMDD Context
No PMDD app handles cycle irregularity gracefully or flags the perimenopause transition. Women with PMDD who enter perimenopause — a group whose symptoms become more severe and less predictable, affecting potentially 8–10 years of their lives — have no tool. General menopause apps don't have PMDD context. PMDD apps don't handle irregular cycles. This gap affects millions of women in their late 30s through early 50s.

### Gap 5: A Structured Tool for Post-Episode Processing (Follicular Remorse)
PMDD patients universally describe the follicular phase as a time of profound remorse, shame, and relationship repair effort. The transition from the PMDD state to the non-PMDD state involves the user looking back at the previous two weeks with horror — and often without clinical language to understand what happened. No app provides: (1) a structured post-episode review, (2) psychoeducation framed as "this was a symptom, not you," (3) a relationship repair prompt to share with a partner. The follicular phase is actually the highest-engagement window for education and reflection — and every existing app treats it as the "normal days" where no support is needed.

---

## SECTION 8: NEVER-BUILD LIST

### 8.1 Streaks

**Do not build.** Streaks punish the worst days. A user who scores a 6 on suicidal ideation, cannot get out of bed, and misses logging three days in a row will return to the app and see a broken streak counter. This is the app adding shame to crisis. Beyond the ethics: the user was not lazy during those three days. She was in the worst part of her cycle. The entire clinical logic of PMDD is that certain days are neurobiologically impaired. Building a gamification system that penalizes neurobiological impairment is contradictory to the product's mission. No variant of streaks is acceptable — not "soft streaks," not "you're on a roll," not streak recovery features.

### 8.2 Framing Cycle Tracking as Ovulation Prediction

**Do not build.** PMDD is a disorder of the luteal phase. Ovulation prediction framing — common in apps like Clue, Flo, and Natural Cycles — positions the fertile window as the goal and menstruation as the endpoint. For PMDD users, ovulation is the trigger event that begins their symptomatic phase. Framing ovulation as something to "optimize" or celebrate is clinically inaccurate and emotionally tone-deaf for this population. The app should track ovulation as a data point for phase calculation, not as a primary product frame.

### 8.3 "Mood Lifting Tips" During Luteal Peak

**Do not build.** Sending a notification that says "Try a walk to lift your mood!" on day 26 when a user has logged irritability of 6, depressed mood of 6, and suicidal ideation of 4 is not supportive — it is dismissive. It communicates that the user could feel better if she tried harder. This is the exact message PMDD patients receive from everyone in their lives and it is the message the app must not replicate. During any day when the safety score is elevated, or when total DRSP burden exceeds a clinical threshold, no wellness tips should be displayed. The interface should instead display: validation + safety resources + "you have data — here is what it shows."

### 8.4 Retroactive Diagnosis Framing

**Do not build.** If a user inputs symptoms retrospectively — filling in the past two weeks from memory — the app must not run C-PASS analysis on that data. Retrospective symptom recall is demonstrably unreliable and is the reason the DSM-5 requires prospective tracking. Running a diagnostic pattern check on retrospective data would be clinically invalid. The physician report must clearly distinguish between prospective (real-time) and retrospective (backdated) entries and exclude backdated entries from diagnostic calculations.

### 8.5 Symptom Normalization Without Safety Context

**Do not build.** The statement "suicidal thoughts during PMDD are common" is clinically accurate. But displayed to a user who is currently experiencing suicidal ideation without an immediate safety resource attached, it functions as dismissal: "this is normal, so it's not serious." Every clinical fact about PMDD prevalence must be paired with appropriate action. "30–40% of PMDD patients experience suicidal ideation during the luteal phase — this is why we ask, and this is what you can do." Clinical accuracy without clinical action is dangerous.

### 8.6 Cycle Phase as Identity

**Do not build.** Framing luteal phase as "your inner critic phase" or "your dark feminine" or any archetypal/spiritual language is harmful. It aestheticizes a medical condition and suggests that PMDD symptoms are a psychological or spiritual experience to be explored rather than a neurobiological event to be managed. Users in crisis do not need archetype language. They need clinical clarity. The app should use plain language: "You are in the late luteal phase. Based on your history, this is typically a higher-symptom window."

---

## Appendix A: Key Clinical Sources Referenced

1. American Psychiatric Association. *Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition (DSM-5).* 2013. PMDD criteria pp. 171–175.
2. ACOG Clinical Practice Guideline No. 7: "Management of Premenstrual Disorders." *Obstetrics & Gynecology*, December 2023. PMID 37973069.
3. Endicott J, Nee J, Harrison W. "Daily Record of Severity of Problems (DRSP): Reliability and Validity." *Archives of Women's Mental Health*, 2006. PMID 16172836.
4. Rubinow DR, et al. "Toward the Reliable Diagnosis of DSM-5 Premenstrual Dysphoric Disorder: The Carolina Premenstrual Assessment Scoring System (C-PASS)." *American Journal of Psychiatry*, 2017. PMC5205545.
5. Eisenlohr-Moul TA, et al. "Prevalence and Correlates of Current Suicidal Ideation in Women with Premenstrual Dysphoric Disorder." *Suicide and Life-Threatening Behavior*, 2022. PMC8832802.
6. Doyle K, et al. "Women with Premenstrual Dysphoric Disorder: Experiences of Suicidal Thoughts and Behaviours." *Frontiers in Psychiatry*, 2024. 10.3389/fpsyt.2024.1442767.
7. Dorani D, et al. "Female-Specific Pharmacotherapy in ADHD: Premenstrual Adjustment of Psychostimulant Dosage." *Frontiers in Psychiatry*, 2023. PMC10751335.
8. Eisenlohr-Moul TA, et al. "Attention-Deficit/Hyperactivity Disorder and the Menstrual Cycle: Theory and Evidence." *PMC10872410*, 2024.
9. Marjoribanks J, et al. "Selective Serotonin Reuptake Inhibitors for Premenstrual Syndrome and PMDD." *Cochrane Database of Systematic Reviews*, 2013/2024 update. PMC11323276.
10. Beddig T, et al. "Developing a Mood and Menstrual Tracking App for People with PMDD: User-Centered Design Study." *JMIR Formative Research*, 2024. PMC11687174.
11. IAPMD Facts & Figures. International Association for Premenstrual Disorders. iapmd.org/facts-figures. Accessed April 2026.
12. Steiner M, et al. "Intermittent SSRIs for Premenstrual Syndromes: A Systematic Review and Meta-Analysis." PMC10074750.
13. Gennev. "PMDD and Menopause: Why It Gets Worse in Perimenopause." gennev.com/learn/pmdd-and-menopause.
14. Oliveri S, Muir K, Mu E, Kulkarni J. "A Dialectical Behaviour Therapy-Informed Model for PMDD." *Australian & New Zealand Journal of Psychiatry*, 2025. PMC12375139.
15. Border R, Miller DM. "Diagnosis and Management of Premenstrual Dysphoric Disorder in Australia." PMC12779906. (Confirms: no dedicated national Australian PMDD guideline exists as of 2026.)
16. RANZCP. "Royal Australian and New Zealand College of Psychiatrists Mood Disorders CPG 2020." (Standard: 12-month prospective tracking required for full psychiatric PMDD evaluation in Australian clinical pathway — stricter than DSM-5's 2-cycle minimum.)

---

## Appendix B: Australian Clinical Context — Spec Corrections and Additions

*Added April 2026 based on: Border & Miller 2026 (PMC12779906), Oliveri et al. 2025 (PMC12375139), RANZCP CPG 2020, Royal Women's Hospital Melbourne, Cabrini Health, MAPrc/HER Centre (Alfred/Monash), Jean Hailes Foundation*

### B.1 Australian Diagnosis Delay Statistics (Corrected)

The spec's reference to "20-year average diagnosis delay" applies to the global/historical figure. The current Australian-specific figure from Border & Miller 2026 is:
- **Australian average: 8–12 years** from symptom onset to PMDD diagnosis
- **Average HCPs seen before diagnosis: 5.1**
- This is still a major delay but different from the 20-year figure used in general advocacy materials

### B.2 Australian Treatment Hierarchy Difference

Australian clinicians (Kulkarni/MAPrc, Alfred Hospital/Monash) apply an OCP-first treatment hierarchy that differs from ACOG's SSRI co-equal approach:

| Guideline | First-Line Treatment |
|-----------|---------------------|
| ACOG CPG No. 7 (2023) — US | SSRIs co-equal with drospirenone-containing OCP |
| Kulkarni/MAPrc framework — Australia | OCP first (specifically Zoely: nomegestrol acetate + 17β-estradiol), then SSRI + OCP combined, then luteal-phase SSRI |
| RCOG 2017 — UK | Transdermal oestradiol patches as first-line option alongside SSRIs |

**Product implication:** The contraceptive tracking field must capture OCP formulation specifically (not just "OCP yes/no"). Zoely (nomegestrol acetate + 17β-estradiol) has a distinct mood profile vs. drospirenone-containing pills vs. levonorgestrel-containing pills. Different progestogens have meaningfully different mood effects in the luteal phase.

### B.3 DBT-Informed Psychological Treatment for PMDD (New Evidence, 2025)

Oliveri et al. (2025, PMC12375139) published the first structured DBT-informed treatment model for PMDD, validated in the Australian healthcare context. It is structured around Australia's Medicare 10 mental health sessions per year model.

**Clinical rationale for DBT over CBT in PMDD:**
- PMDD symptoms are driven by real hormonal fluctuations — not by cognitive distortions
- CBT's cognitive restructuring ("challenge the thought") is poorly suited for symptoms that are biologically caused
- DBT's acceptance framework + adaptive coping within the luteal phase is a better fit: accept that this week is neurobiologically harder, implement pre-planned coping strategies (not challenge the feelings as distorted)

**Spec update required:** The existing spec lists "CBT first-line" as the psychological treatment standard. Update: add DBT-informed as a distinct, published category for PMDD. In the therapy tracking module, `therapy_type` should include: CBT / DBT-informed / EMDR / Psychodynamic / Other (do not merge DBT-informed into the generic DBT option used in other contexts).

### B.4 ISPMD Terminology and Onboarding Language

Australian institutions use "Menstrually Related Mood Symptoms" (MRMS) and "Menstrually Related Mood Disorders" (MRMD) as broader patient-facing umbrella terms that encompass PMDD, PMS, and PME. This is consistent with International Society for Premenstrual Disorders (ISPMD) terminology and reduces the diagnostic gatekeeping that occurs when users must self-identify as having "PMDD."

**Onboarding language update:** Do not force users to select "I have PMDD" as the only entry point. Offer:
- "I experience mood changes before my period" (catches MRMS/PMS population)
- "I've been told I might have PMDD" (provisional diagnosis users)
- "I have a PMDD diagnosis" (confirmed users)
- All three pathways lead to the same tracking module; the label differs in onboarding only.

### B.5 Unique Australian Clinical Resources Worth Referencing

- **PMD Care (pmdcare.com.au):** Australia's first dedicated PMDD clinical psychology telehealth service (AHPRA-registered); structured around Medicare model; treats both PMDD and PME. Recommend for Australian users who need specialist support.
- **Cabrini 3-Day Inpatient Rapid Assessment Program (Melbourne):** Only such program in Australia; for complex/refractory PMDD not responding to outpatient treatment. Reference as escalation option for Australian users with severe PMDD.
- **Jean Hailes Foundation:** National women's health resource; uses IAPMD printable tracker; does not provide validated digital tracking. HormonaIQ exceeds their current offering.
