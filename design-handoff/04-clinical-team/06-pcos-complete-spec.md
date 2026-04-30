# HormonaIQ — PCOS Complete Feature & Data-Logging Specification

**Document type:** Clinical product specification  
**Product:** HormonaIQ — Hormonal Health Companion App  
**Condition module:** Polycystic Ovary Syndrome (PCOS)  
**Version:** 1.0  
**Date:** April 2026  
**Intended readers:** Product team, engineering, clinical advisors  

> **Clinical accuracy notice:** Every diagnostic criterion, reference range, and prevalence figure in this document is sourced from peer-reviewed literature or international clinical guidelines. This specification is not a substitute for clinical judgment. All clinical content must be reviewed by a licensed endocrinologist or OB-GYN before shipping to users.

---

## SECTION 1: CLINICAL FOUNDATION

### 1.1 Rotterdam Criteria (2003) — Verbatim Standard

The Rotterdam Criteria were established at a 2003 consensus workshop in Rotterdam, Netherlands, jointly sponsored by the European Society of Human Reproduction and Embryology (ESHRE) and the American Society for Reproductive Medicine (ASRM). Published in both *Fertility and Sterility* (2004, 81(1):19–25) and *Human Reproduction* (2004, 19(1):41–47), they remain the most widely used diagnostic standard and were unanimously reaffirmed in the 2018 and 2023 International Evidence-Based PCOS Guidelines.

**PCOS is diagnosed when at least 2 of the following 3 criteria are present, after exclusion of other etiologies:**

1. **Oligo-ovulation or anovulation** — cycles >35 days or <8 cycles per year, or cycles <21 days; or confirmed anovulation by progesterone testing
2. **Clinical and/or biochemical signs of hyperandrogenism** — clinical: hirsutism (mFG score ≥8), acne, androgenic alopecia; biochemical: elevated total testosterone, free testosterone, or DHEA-S above reference range
3. **Polycystic ovarian morphology (PCOM) on ultrasound** — per 2018 updated threshold: ≥20 follicles per ovary (2–9 mm) and/or ovarian volume ≥10 mL on transvaginal ultrasound (TVUS), in the absence of a dominant follicle, cyst, or corpus luteum

*Source: Rotterdam ESHRE/ASRM-Sponsored PCOS Consensus Workshop Group, Fertil Steril 2004; Human Reprod 2004.*

---

### 1.2 The Four PCOS Phenotypes (A, B, C, D)

The 2-of-3 rule generates four clinically distinct phenotypes, formally identified and codified by the NIH Evidence-Based Methodology Workshop on PCOS (2012):

| Phenotype | Features Present | Shorthand | Clinical Significance |
|-----------|-----------------|-----------|----------------------|
| **A** | HA + OD + PCOM | "Classic Full" | Most severe metabolic and hormonal profile; highest insulin resistance risk; most commonly studied |
| **B** | HA + OD | "Classic without ultrasound" | Similar to A; metabolic risk near-equivalent; does not require ultrasound confirmation |
| **C** | HA + PCOM | "Ovulatory PCOS" | Hyperandrogenism present but cycles regular; most contested phenotype; some metabolic risk |
| **D** | OD + PCOM | "Non-androgenic" | No hyperandrogenism; milder metabolic profile; solely ovarian pathogenesis; lowest insulin resistance prevalence |

**Key:**  
- HA = Hyperandrogenism (clinical or biochemical)  
- OD = Ovulatory Dysfunction (oligo/anovulation)  
- PCOM = Polycystic Ovarian Morphology on ultrasound  

**Clinical significance of phenotyping for app design:**  
Phenotypes A and B carry the highest metabolic and cardiovascular risk and most benefit from insulin resistance monitoring (HOMA-IR, fasting insulin). Phenotype C users may have regular cycles but still present with acne and hirsutism — standard cycle-irregularity messaging will alienate them. Phenotype D users may not have any androgenic skin symptoms at all and should not be shown hirsutism-heavy content. The app should use progressive phenotype identification based on user-reported data (see Section 4, Feature 11).

*Source: Bozdag et al., Current Guidelines for Diagnosing PCOS, PMC 2023. Lizneva et al., Prevalence of PCOS Phenotypes, PMC 2016.*

---

### 1.3 Androgen Excess Society (AES) Criteria vs. Rotterdam

The Androgen Excess Society published its own PCOS criteria in 2006 (Azziz et al., *JCEM* 2006, 91(11):4237–4245), with an updated "AE-PCOS Society" report in 2009 (*Fertility and Sterility*, 2009).

**AES/AE-PCOS Society criteria require:**
1. **Hyperandrogenism is mandatory** — clinical (hirsutism, acne, alopecia) and/or biochemical (elevated androgen levels)
2. **Plus one of:** ovarian dysfunction (oligo/anovulation) OR polycystic ovarian morphology on ultrasound

**Key difference from Rotterdam:**  
The AES criteria **exclude Rotterdam Phenotype D** (OD + PCOM without hyperandrogenism) from the PCOS diagnosis. The AES position is that PCOS is "predominantly a hyperandrogenic disorder" and that non-androgenic irregular cycles with PCOM represent a different clinical entity.

**Where they agree:**  
Both criteria sets agree that Phenotypes A, B, and C constitute PCOS. Both require exclusion of other causes. Both accept clinical or biochemical hyperandrogenism as interchangeable.

**Practical implication for the app:**  
Some users with Phenotype D (irregular cycles + PCOM, no androgenism) will have been diagnosed under Rotterdam but not AES criteria. These users have genuine PCOS diagnoses and belong in the app. The app must not require or imply that androgenic symptoms are universal — doing so will alienate ~10-15% of PCOS users.

*Source: Azziz et al., AES Position Statement, JCEM 2006. Azziz et al., AE-PCOS Society complete task force report, Fertil Steril 2009.*

---

### 1.4 Differential Diagnosis — What PCOS Is Not

Before a PCOS diagnosis is confirmed, clinicians must exclude:

| Condition | Key distinguishing feature | Lab to exclude |
|-----------|---------------------------|----------------|
| **Hypothyroidism** | Cold intolerance, weight gain, low energy, dry skin | TSH (target <2.5 mIU/L in reproductive-age women) |
| **Hyperprolactinemia** | Galactorrhea, headaches, visual changes | Prolactin (normal <25 ng/mL) |
| **Non-classic CAH** (congenital adrenal hyperplasia) | Clinically indistinguishable from PCOS; often family history | 17-OH progesterone (early AM, follicular phase; >2 ng/mL warrants ACTH stimulation) |
| **Cushing's syndrome** | Central obesity, violaceous striae, dorsal fat pad, easy bruising | 24-hour urinary free cortisol; dexamethasone suppression test |
| **Androgen-secreting tumor** | Rapid onset virilization, very high testosterone (>200 ng/dL) | Total testosterone; DHEA-S |
| **Premature ovarian insufficiency** | Menopausal symptoms, hot flashes, age <40 | FSH (>40 IU/L), estradiol |

**App implication:** HormonaIQ is not a diagnostic tool. The app should never confirm a PCOS diagnosis. It should ask "Has a clinician diagnosed you with PCOS?" and accept the user's self-report. Differential diagnosis information can be surfaced in "Prepare for your appointment" content.

*Source: Emedicine/Medscape, PCOS Differential Diagnoses. NCBI StatPearls, Polycystic Ovarian Syndrome, 2023.*

---

### 1.5 Why Diagnosis Is Delayed — And How This Shapes User Psychology

PCOS is among the most under- and late-diagnosed conditions in women's medicine:

- **Average time from symptom onset to diagnosis: 2+ years.** A Canadian study found the average delay was 4.3 years from first symptom awareness to formal diagnosis (Challenges in diagnosis and health care in PCOS in Canada, BMC Women's Health 2023).
- **47.1% of women consulted 3 or more healthcare providers** before receiving a diagnosis (Delayed Diagnosis Associated With Dissatisfaction in PCOS, PMC 2018).
- **Only 35.2% were satisfied** with their diagnosis experience; only 15.6% were satisfied with the information they received post-diagnosis.
- Common reasons for delay: birth control prescribed for acne/irregular cycles masking symptoms, provider dismissal ("it's just stress"), failure to perform diagnostic testing, and lack of multidisciplinary referral.

**What this means for HormonaIQ:**  
Many users arrive having already self-diagnosed — sometimes correctly, sometimes not. They are often exhausted, skeptical of medical authority, and hungry for data. They want to understand their own body, not be told to wait for a doctor. The app must:
- Validate that their data is real, their symptoms are real, and their frustration is legitimate
- Never gatekeep features behind a formal clinical diagnosis
- Present clinical information as "here's how doctors think about this" rather than "here's what you definitely have"
- Be a tool for self-advocacy, not a substitute for clinical care

---

### 1.6 Weight and PCOS — The Evidence vs. The Harm

This is addressed fully in Section 6. Summary for clinical foundation:

- 40–80% of people with PCOS have obesity or overweight (Cleveland Clinic; WHO PCOS Fact Sheet 2023)
- However, 20–30% of PCOS diagnoses occur in people with a BMI in the "normal" range — PCOS is not a condition caused by excess weight
- Insulin resistance, not weight itself, is the primary metabolic driver in PCOS
- Even modest weight reduction of 5–10% in those with overweight can improve insulin sensitivity, restore ovulatory function, and reduce androgen levels — but this is a metabolic intervention, not an aesthetic one
- The 2023 International Evidence-Based PCOS Guidelines explicitly acknowledge weight stigma as a pervasive problem in PCOS care and call for weight-sensitive communication from all healthcare providers

*Source: WHO PCOS Fact Sheet 2023. 2023 International Evidence-Based Guideline for PCOS, ASRM/ESHRE/Monash.*

---

## SECTION 2: THE FERRIMAN-GALLWEY SCALE

### 2.1 Clinical Background

The Ferriman-Gallwey (FG) scale was originally published by Ferriman and Gallwey in 1961, assessing 11 body sites. The **modified Ferriman-Gallwey (mFG) scale** reduced this to 9 androgen-sensitive body sites by removing the forearm and lower leg, which show inconsistent association with hyperandrogenemia. It is the gold-standard clinical instrument for quantifying hirsutism and is used by endocrinologists, gynecologists, and dermatologists worldwide.

### 2.2 The 9 Body Sites and Scoring Method

Each of the 9 sites is scored on a scale of **0 to 4**:
- **0** = No terminal hair growth
- **1** = Minimal terminal hair growth
- **2** = Moderate terminal hair growth
- **3** = Moderate-to-extensive growth
- **4** = Extensive/frank terminal hair growth

| Site | Location |
|------|----------|
| 1 | Upper lip |
| 2 | Chin |
| 3 | Chest (including periareolar) |
| 4 | Upper abdomen (above umbilicus) |
| 5 | Lower abdomen (below umbilicus to pubic line) |
| 6 | Upper arm (lateral surface) |
| 7 | Thigh (anterior/medial surface) |
| 8 | Upper back (shoulders, interscapular) |
| 9 | Lower back (sacral area) |

**Total score range: 0–36**

### 2.3 Clinical Threshold

- **Score ≥8:** Clinically significant hirsutism in Caucasian women (most widely used threshold)
- **Score ≥6:** Threshold used for some non-Caucasian populations (Asian, East Asian women have lower baseline terminal hair density)
- **Score 8–15:** Mild hirsutism
- **Score 16–25:** Moderate hirsutism
- **Score >25:** Severe hirsutism

Prevalence: Hirsutism affects an estimated 65–75% of women with PCOS. More than 80% of women with clinically significant hirsutism have PCOS as the underlying cause.

*Source: Modified Ferriman-Gallwey Score and Hirsutism, PMC 2017. Grading of hirsutism: a practical approach to mFG, PMC 2022. Ferriman-Gallwey score, Wikipedia/myendoconsult.com.*

### 2.4 App Implementation

The full 9-site mFG is burdensome for daily logging. HormonaIQ uses two levels:

**Level 1 — Onboarding baseline (once, then every 3 months):**  
Simplified 5-zone self-assessment (upper face [lip + chin], chest, abdomen, arms, back/thigh) with photo-guided silhouette diagrams. User rates each zone 0–4. Total score calculated and tracked over time as the primary androgenic skin trend signal.

**Level 2 — Monthly check-in:**  
"Since last month, have you noticed more, less, or about the same hair growth?" (More / Same / Less / Not applicable). Optional photo log (stored locally, encrypted, never uploaded to server unless user explicitly consents).

**Why this matters in the app:**  
The mFG score is the only self-reportable objective measure of androgenic symptom change over time. Treatment response for spironolactone, oral contraceptives, and laser hair removal can be tracked through mFG trend. A decreasing mFG score over 6–12 months is a concrete signal that antiandrogen treatment is working — more motivating than any generic progress message.

**Patient-clinician concordance:** A study published in *Fertility and Sterility* (2011) showed moderate-to-good concordance between clinician-scored and patient self-scored mFG, supporting the validity of patient self-report as a tracking method.

---

## SECTION 3: ALL DATA POINTS TO LOG

This is the master data specification for PCOS tracking in HormonaIQ. Every field is justified by clinical evidence.

---

### 3.1 Cycle Tracking — The Special PCOS Problem

PCOS cycles are fundamentally different from typical cycles. Standard period apps assume a 28-day cycle with predictable ovulation at day 14. PCOS cycles can range from **21 to 90+ days**, are frequently anovulatory, and cannot be predicted by any standard algorithm. The app must never generate cycle predictions based on past cycle averages for PCOS users.

| Field | Type | Frequency | Clinical Justification | Maps To |
|-------|------|-----------|----------------------|---------|
| Cycle start date | Date picker | Per cycle | Primary record of menstrual pattern; essential for Rotterdam Criterion 1 monitoring | Oligo/anovulation criterion; menstrual regularity |
| Cycle length (calculated) | Calculated (days between periods) | Auto | Core diagnostic marker; cycles >35 days confirm oligo-ovulation; <21 days may indicate luteal phase defect | Rotterdam Criterion 1 |
| Period flow — day 1 | Selection: spotting/light/medium/heavy/very heavy | Daily during period | Heavy menstrual bleeding is common in PCOS due to anovulatory estrogen buildup; important for endometrial health monitoring | Endometrial hyperplasia risk |
| Period flow — subsequent days | Selection: spotting/light/medium/heavy/very heavy | Daily during period | Tracks pattern changes, particularly with OCP or progesterone therapy | Treatment response monitoring |
| Spotting (between periods) | Binary + day of cycle | Daily | Intermenstrual spotting may indicate breakthrough bleeding on OCP or progesterone insufficiency | Medication side effect / hormonal imbalance |
| Confirmed anovulatory cycle | Binary (Y/N) | Per cycle | Anovulation confirmed by low luteal-phase progesterone (<3 ng/mL) or sustained flat BBT; critical Rotterdam Criterion 1 data | Rotterdam Criterion 1 |
| OPK result | Selection: negative/low/high/peak | Daily (during fertile window attempt) | LH surge detection; PCOS users may have multiple LH peaks without ovulation; requires pattern-based, not single-test interpretation | LH dynamics; fertility monitoring |
| Cervical mucus | Selection: dry/sticky/creamy/watery/egg-white | Daily (optional) | Secondary fertility sign; combined with OPK provides more reliable ovulation signal than OPK alone in PCOS | Fertility awareness method (FAM) |
| Progesterone test result (PdG) | Number (ng/mL) or urine PdG (positive/negative) | Day 7–10 post-suspected ovulation | PdG urine testing (e.g., Proov) confirms whether ovulation occurred; most reliable ovulation confirmation method for PCOS | Confirms ovulation; Rotterdam Criterion 1 verification |
| Cycle pattern flag | Auto-calculated | Per cycle | App auto-flags cycle as: regular (<35 days), oligomenorrhea (35–90 days), amenorrhea (>90 days) | Physician report generation |

---

### 3.2 Daily Symptom Log

#### Androgenic/Hormonal Symptoms

| Field | Type | Frequency | Clinical Justification | Maps To |
|-------|------|-----------|----------------------|---------|
| Acne — face | Scale 1–5 (+ optional new lesions count) | Daily | Facial acne is a primary clinical sign of hyperandrogenism; 61% of PCOS patients have acne; face acne (especially jawline/chin) is distinctly androgenic in pattern | Rotterdam Criterion 2 (clinical HA); Global Acne Grading System (GAGS) |
| Acne — chest/back | Scale 1–5 | Daily | Truncal acne is a marker of higher androgen levels; often undertreated and underreported; correlates with DHEA-S elevation | Rotterdam Criterion 2; GAGS |
| Hair shedding | Scale 1–5 (or estimated count: <10 / 10–25 / 25–50 / 50+ strands per shower) | Daily | Androgenic alopecia affects 48% of PCOS patients; temporal/diffuse hair loss (Ludwig pattern) is androgen-mediated; subjective daily shedding estimate is tractable self-report | Androgenic alopecia; Ludwig Classification |
| Hirsutism — new growth noticed | Binary (Y/N) + location selector | Daily | Rapid-detection hirsutism log; complements monthly mFG; new growth on chin/upper lip is most commonly reported androgenic sign | mFG score; Rotterdam Criterion 2 |
| Skin oiliness | Scale 1–5 | Daily | Seborrhoea (oily skin) is androgen-driven; correlates with testosterone levels; tracks treatment response to OCP/spironolactone | Androgenic skin symptoms |
| Scalp health | Scale 1–5 | Daily | Scalp seborrhoea and dandruff co-occur with androgenic alopecia; often worsens during high-androgen periods | Androgenic alopecia |
| Acanthosis nigricans observation | Binary (Y/N) + location (neck/axilla/groin) | Monthly | Dark, velvety skin patches in skin folds are a clinical sign of insulin resistance; 40–80% prevalence in PCOS with IR | Insulin resistance marker |
| Skin tags | Binary (Y/N) + approximate count | Monthly | Acrochordons (skin tags) in skin fold areas are an underrecognized insulin resistance marker; named in the Endocrine Society PCOS patient guide and RCOG Patient Information Leaflet 2022 alongside acanthosis nigricans; prevalence in PCOS with IR is significant and underreported | Insulin resistance marker; Rotterdam comorbidity |

#### Metabolic Symptoms

| Field | Type | Frequency | Clinical Justification | Maps To |
|-------|------|-----------|----------------------|---------|
| Energy level | Scale 1–5 | Daily | Fatigue is one of the most commonly reported PCOS symptoms; correlates with insulin resistance severity | Insulin resistance; metabolic health |
| Hunger / appetite level | Scale 1–5 | Daily | Hyperinsulinemia drives dysregulated appetite; post-meal hyperinsulinemic response causes rebound hunger | Insulin signaling |
| Carbohydrate / sugar cravings | Selection: none/mild/strong | Daily | Insulin resistance creates glucose dysregulation patterns; strong sugar cravings post-meal are a proxy marker for glucose-insulin cycling | Insulin resistance signal |
| Post-meal energy crash | Binary (Y/N) + estimated timing (30 min / 1 hr / 2 hr) | Daily (optional) | Reactive hypoglycemia after high-GI meals is a direct insulin resistance symptom; timing correlates with peak insulin response | Insulin resistance; guides dietary intervention |
| Brain fog | Scale 1–5 | Daily | Cognitive symptoms (poor concentration, memory) are consistently reported in PCOS and correlate with insulin resistance and inflammatory cytokines | Metabolic inflammation |
| Fatigue — general | Scale 1–5 | Daily | Distinct from post-meal crash; chronic fatigue in PCOS associated with sleep apnea, hypothyroidism comorbidity, and chronic inflammation | Metabolic / inflammatory symptom |
| Bloating | Scale 1–5 | Daily | Abdominal bloating worsens in anovulatory cycles due to unopposed estrogen; common GI complaint in PCOS, amplified by metformin use | GI symptom / medication side effect |

#### Reproductive and Pelvic Symptoms

| Field | Type | Frequency | Clinical Justification | Maps To |
|-------|------|-----------|----------------------|---------|
| Pelvic pain | Scale 1–5 + cycle day | Daily (or on symptom) | Pelvic pain in PCOS can signal large follicle rupture, ovarian torsion risk (enlarged ovaries), or endometriosis comorbidity | Ovarian health |
| Ovulation pain (mittelschmerz) | Binary (Y/N) | Daily | Mittelschmerz indicates follicle rupture — a positive ovulation signal; in PCOS, false mittelschmerz (follicle growth without rupture) can also occur | Ovulation detection aid |
| Breast tenderness | Scale 1–5 | Daily | Cyclical breast tenderness indicates progesterone activity; absent tenderness in expected luteal phase may confirm anovulation | Luteal phase marker |
| Pelvic heaviness / pressure | Scale 1–5 | Daily | Enlarged polycystic ovaries can cause chronic pelvic pressure; worsens with ovarian hyperstimulation | Ovarian morphology symptom |

#### Mood and Mental Health

| Field | Type | Frequency | Clinical Justification | Maps To |
|-------|------|-----------|----------------------|---------|
| Anxiety | Scale 1–5 | Daily | Anxiety prevalence in PCOS is 3–4× the general population rate; meta-analyses show pooled anxiety prevalence of ~41% in PCOS (Psychiatric disorders in PCOS, PubMed 2018) | Mental health comorbidity; 2023 PCOS Guidelines mental health domain |
| Low mood / depression | Scale 1–5 | Daily | Depression prevalence in PCOS approximately 36.6% (median across studies); women with PCOS are 2.79× more likely to have a clinical depression diagnosis | Mental health comorbidity |
| Irritability | Scale 1–5 | Daily | Hormonal fluctuations drive irritability; tracked in context with cycle phase to differentiate PCOS-related from PMDD-related irritability | PCOS-PMDD overlap |
| Body image / self-image | Scale 1–5 | Weekly (NOT daily — daily prompting is harmful) | Body image distress is significantly elevated in PCOS (acne, hirsutism, weight changes); tracked weekly with careful, non-judgmental framing | Psychosocial wellbeing; weight stigma context |
| Sleep quality | Scale 1–5 + hours slept | Daily | Sleep apnea comorbidity is high in PCOS (up to 30%); poor sleep worsens insulin resistance; sleep is a key lifestyle intervention target per 2023 guidelines | Metabolic health; comorbidity screening |

---

### 3.3 Weekly and Periodic Tracking

| Field | Type | Frequency | Clinical Justification | Maps To |
|-------|------|-----------|----------------------|---------|
| Weight | Number (kg or lbs) — **user-initiated, hidden by default** | Weekly (optional, user turns on) | 5–10% weight reduction improves insulin sensitivity, restores ovulation, reduces androgen levels in overweight PCOS; tracked as metabolic health signal, NOT aesthetic goal | Metabolic health marker — see Section 6 |
| Waist circumference | Number (cm or inches) — optional | Monthly | Waist circumference >88 cm (women) is a metabolic syndrome criterion; more clinically meaningful than BMI for PCOS | Metabolic syndrome risk (IDF/ATP-III criteria) |
| Blood pressure | Systolic/Diastolic (mmHg) — optional, wearable sync preferred | Monthly (or per reading) | Hypertension risk is elevated in PCOS; hypertension is an annual monitoring standard per Endocrine Society PCOS patient guide and RCOG 2022. Required monitoring for spironolactone users (spironolactone lowers blood pressure — BP tracking is a safety check in that context) | Cardiovascular risk; spironolactone safety monitoring |
| Sleep apnea screening | Binary flag (yes/no/suspected/diagnosed) + daytime sleepiness scale 1–5 | Monthly | Sleep apnea affects up to 30% of PCOS patients — substantially higher than the general female population; untreated sleep apnea worsens insulin resistance and is a metabolic syndrome component; the Endocrine Society PCOS guide names sleep apnea as a health risk requiring monitoring | Metabolic comorbidity; insulin resistance amplifier |
| Exercise — type | Selection: none / walking / cardio / strength / yoga / other | Daily or weekly | Aerobic and resistance exercise enhance insulin sensitivity; lifestyle intervention is first-line PCOS management (2023 PCOS Guidelines) | Lifestyle intervention tracking |
| Exercise — duration | Minutes | Daily or weekly | Dose-response relationship between exercise and insulin sensitivity improvement | Lifestyle intervention |
| Steps (wearable sync) | Number (auto from Apple Health / Google Fit) | Daily | Non-exercise activity thermogenesis (NEAT) is a meaningful metabolic intervention; automatic passive tracking reduces burden | Metabolic activity |

---

### 3.4 Food and Lifestyle (Simplified — Not a Food Diary)

HormonaIQ does **not** implement calorie counting. The evidence base for calorie restriction in PCOS is weak relative to evidence for dietary quality and glycemic index reduction. Calorie counting reinforces harmful relationships with food in a population already prone to disordered eating (binge eating disorder is elevated in PCOS). See Section 9 (Never-Build List).

| Field | Type | Frequency | Clinical Justification | Maps To |
|-------|------|-----------|----------------------|---------|
| Meal quality (overall) | Scale 1–5 | Daily (at day end) | Proxy for dietary adherence; low burden; directional signal over time | Glycemic load; insulin sensitivity |
| Low-glycemic eating today | Selection: yes / mostly / no | Daily | Low-GI diets significantly reduce HOMA-IR, fasting insulin, total testosterone vs. high-GI diets (meta-analysis RCTs, Advances in Nutrition 2022) | Insulin resistance improvement |
| Sugar / refined carb intake | Selection: high / medium / low | Daily | Refined carbohydrate intake drives hyperinsulinemia, the central metabolic driver in most PCOS phenotypes | Insulin resistance; androgen excess pathway |
| Alcohol | Selection: none / 1–2 drinks / 3+ drinks | Daily (optional) | Alcohol disrupts glucose metabolism; moderate-to-heavy use worsens insulin resistance and disrupts sex hormone-binding globulin (SHBG) levels | Metabolic / hormonal tracking |
| Anti-inflammatory eating (Mediterranean adherence) | Scale 1–5 | Weekly | Mediterranean diet with low-GI emphasis is the best-evidenced dietary pattern for PCOS (multiple RCTs; Frontiers in Nutrition 2022; PMC 2022). Johns Hopkins Medicine PCOS diet guidance specifically names: whole grains, legumes, fatty fish, leafy greens, colorful vegetables, nuts, and berries as recommended; and refined carbs, sugary drinks, processed foods, red and processed meats, and full-fat dairy as foods to reduce. Frame as anti-inflammatory eating guidance, not calorie restriction | Inflammation; insulin resistance |
| Caffeine intake today | Selection: none / 1 cup / 2+ cups | Daily (optional) | Caffeine worsens anxiety symptoms in PCOS; interferes with sleep quality in a population already at risk for sleep apnea; r/PMDD and r/PCOS data both identify caffeine as a trigger worth tracking | Symptom trigger tracking |
| Sugar / processed food today | Selection: none / some / significant amount | Daily | Refined sugar and ultra-processed foods are the highest-impact dietary drivers of hyperinsulinemia in PCOS; Johns Hopkins names sugar-sweetened beverages specifically as the highest priority item to reduce | Insulin resistance; androgen excess pathway |
| Alcohol | Selection: none / 1–2 drinks / 3+ drinks | Daily (optional) | Alcohol disrupts glucose metabolism; moderate-to-heavy use worsens insulin resistance and disrupts sex hormone-binding globulin (SHBG) levels | Metabolic / hormonal tracking |
| Inositol supplement taken | Binary (Y/N) + dose | Daily (if prescribed) | Myo-inositol + D-chiro-inositol at 40:1 ratio improves insulin resistance, reduces testosterone, restores ovulatory function; not FDA-approved but substantial RCT evidence | Supplement adherence; treatment response |

---

### 3.5 Lab Values Vault

Users enter lab values manually from paper/PDF reports. The app stores, timestamps, and visualizes them over time. Reference ranges shown are general guidance; the app should always note "your lab's reference range may vary."

| Lab Test | Units | PCOS-Relevant Finding | Normal Range (approx.) | PCOS Range Indicator |
|----------|-------|----------------------|----------------------|---------------------|
| Total testosterone | ng/dL | Primary androgen excess marker | 6–86 ng/dL (pre-menopausal) | Often >60–70 ng/dL; frank elevation >80–100 |
| Free testosterone | pg/mL | More sensitive than total T; unbound/active fraction | 0.7–3.6 pg/mL | Elevated in most HA PCOS |
| DHEA-S | μg/dL | Adrenal androgen; elevated in adrenal-dominant PCOS | 35–430 μg/dL | >200 μg/dL common in PCOS; >700 suggests adrenal tumor |
| LH | IU/L | Elevated LH drives excess androgen production in theca cells | 2–15 IU/L (follicular) | Often elevated; LH:FSH >2:1 classic PCOS pattern |
| FSH | IU/L | Used as denominator for LH:FSH ratio | 3–10 IU/L (follicular) | Usually low-normal; FSH >10 suggests diminished ovarian reserve or POI |
| LH:FSH ratio | Calculated | Classic PCOS marker; >2:1 or >3:1 | ~1:1 typical | >2:1 common; >3:1 more specific; not universal in PCOS |
| Estradiol (E2) | pg/mL | Used for cycle phase confirmation; anovulatory cycles have low/flat E2 | 12–150 pg/mL (follicular) | Variable; may be elevated in anovulatory estrogen accumulation |
| Progesterone (luteal phase) | ng/mL | <3 ng/mL day 21 confirms anovulation | >10 ng/mL (mid-luteal) = ovulation confirmed | <3 ng/mL = anovulatory |
| AMH (Anti-Müllerian Hormone) | ng/mL | Elevated in PCOS due to large antral follicle pool; increasingly used as PCOS biomarker | 1.0–3.5 ng/mL (reproductive age) | >3.8–5.0 ng/mL elevated; PCOS threshold varies by lab and age |
| Fasting insulin | μIU/mL | Direct measure of hyperinsulinemia; not routinely tested but clinically critical in PCOS | <15 μIU/mL | >15–20 μIU/mL clinically significant even within "normal" lab ranges |
| Fasting glucose | mg/dL | Fasting glucose with insulin used to calculate HOMA-IR | 70–99 mg/dL | 100–125 mg/dL = pre-diabetes; ≥126 = diabetes |
| HOMA-IR (calculated) | Unitless | **Formula: (fasting insulin [μIU/mL] × fasting glucose [mg/dL]) ÷ 405** | <2.0 typical | ≥2.5 suggests insulin resistance; ≥3.0 elevated; ≥4.0 severe |
| HbA1c | % | Long-term glycemic control; screened in PCOS due to T2DM risk | <5.7% | 5.7–6.4% = pre-diabetes; ≥6.5% = diabetes |
| 2-hour glucose (75g OGTT) | mg/dL | **The Endocrine Society PCOS guide specifies the 2-hour 75g oral glucose tolerance test — not just fasting glucose — as the correct screening test for impaired glucose tolerance and T2DM in PCOS.** Fasting glucose alone misses a clinically significant proportion of glucose-impaired PCOS patients whose impairment shows only in post-load response | <140 mg/dL | 140–199 mg/dL = impaired glucose tolerance; ≥200 mg/dL = diabetes |
| TSH | mIU/L | Thyroid function; hypothyroidism mimics and co-occurs with PCOS | 0.4–4.0 mIU/L | Optimal <2.5 mIU/L in reproductive-age women |
| Prolactin | ng/mL | Hyperprolactinemia differential; excludes pituitary cause of anovulation | <25 ng/mL | Elevated >25 ng/mL warrants further workup (MRI pituitary) |
| 17-OH Progesterone | ng/mL | Screens for non-classic CAH; drawn early AM follicular phase | <2 ng/mL | >2 ng/mL warrants ACTH stimulation test |
| SHBG (Sex Hormone-Binding Globulin) | nmol/L | Low SHBG increases free testosterone; insulin suppresses SHBG | 40–120 nmol/L | <30–40 nmol/L common in insulin-resistant PCOS |
| Vitamin D (25-OH) | ng/mL | 67–85% of PCOS patients are deficient; deficiency worsens insulin resistance and inflammation | >30 ng/mL = sufficient | <20 ng/mL = deficiency; 20–29 = insufficiency |
| Lipid panel (total cholesterol, LDL, HDL, triglycerides) | mg/dL | Dyslipidemia (high TG, low HDL) is a metabolic syndrome component; elevated in PCOS | Per standard lab | High TG (>150), low HDL (<50 women) concerning |
| CRP (C-reactive protein) | mg/L | Inflammatory marker; chronically elevated in PCOS | <1.0 mg/L | >3.0 mg/L elevated inflammation signal |

**App UX note:** The Lab Values Vault should display sparkline trend charts for each value over time, with a "bring this to your doctor" export function. Do not auto-interpret values with severity language — surface the number, the trend direction, and a non-alarmist contextual note.

---

### 3.6 Medication Tracking

| Medication | Dose field | Frequency | Side Effects to Track | Clinical Notes |
|-----------|-----------|-----------|----------------------|---------------|
| Metformin | mg (500 / 1000 / 1500 / 2000 mg) | Daily (timed log) | GI: nausea, diarrhea, abdominal cramping (scale 1–3); also B12 deficiency (long-term) | Most-evidenced metabolic drug in PCOS; first-line for metabolic features per 2023 PCOS guidelines |
| Spironolactone | mg (25–200 mg range) | Daily | Blood pressure (manual entry or wearable sync); dizziness; irregular bleeding; breast tenderness | Aldosterone antagonist + antiandrogen; requires concurrent contraception; side effects dose-dependent |
| Oral contraceptive pill | Brand name (free text) + pill timing | Daily | Breakthrough bleeding (Y/N); mood changes (scale 1–5); libido change (1–5); nausea | First-line for menstrual regularity and hyperandrogenism; no specific OCP recommended; lower EE doses preferred |
| Letrozole | mg (2.5 / 5.0 / 7.5 mg) | Daily during treatment cycle | Hot flashes; dizziness; cycle day of administration | First-line ovulation induction in PCOS; superior live birth rates to clomiphene (27.5% vs 19.1%) |
| Clomiphene citrate | mg (50 / 100 mg) | Daily during treatment cycle | Hot flashes; mood changes; visual disturbances (flag immediately) | Second-line ovulation induction; multiple gestation risk ~6% |
| Inositol (Myo-inositol) | mg (standard 2000–4000 mg/day) | Daily | GI tolerance (scale 1–3) | RCT evidence for insulin resistance and ovulatory improvement; 40:1 Myo:DCI physiological ratio |
| Inositol (D-chiro-inositol) | mg | Daily | GI tolerance | Combined with Myo at 40:1 ratio; DCI alone can worsen ovarian function at high doses |
| Berberine | mg (400 mg × 3 doses) | Daily | GI: nausea, cramping | Insulin sensitizer; comparable to metformin in some small RCTs; not FDA-approved; significant herb-drug interactions |
| NAC (N-acetyl cysteine) | mg (1200–1800 mg/day) | Daily | GI tolerance | Antioxidant + insulin sensitizer; improves ovulation rates and insulin sensitivity; RCT evidence (multiple studies, PMC 2024) |
| Vitamin D supplement | IU | Daily | None significant | Supplementation improves insulin metabolism, reduces testosterone, reduces inflammation in deficient PCOS patients |
| Progesterone (prescribed) | mg or cream | Per cycle (timed log) | Drowsiness; mood changes; breakthrough bleeding | Used to induce withdrawal bleed in amenorrhea; protects endometrium from hyperplasia |
| Omega-3 (fish oil / algae-based) | mg (EPA+DHA combined) | Daily | GI tolerance; fishy aftertaste (noted in compliance literature) | Anti-inflammatory; reduces triglycerides (dyslipidemia is a PCOS metabolic complication); listed in Johns Hopkins PCOS supplement guidance; algae-based option for vegetarian/vegan PCOS users |
| Chromium picolinate | μg (200–1000 μg range) | Daily | None significant at standard doses | Insulin sensitizer; improves glucose tolerance and reduces fasting insulin; listed in Johns Hopkins PCOS supplement guidance; small but positive RCT evidence base |
| Eflornithine cream (Vaniqa) | Percentage (typically 13.9%) | Per application (twice daily) | Skin irritation; stinging; rash | Prescription topical cream for facial hirsutism; inhibits ornithine decarboxylase in hair follicles to slow growth; commonly used alongside laser hair removal in PCOS; tracking side effects and application adherence is clinically relevant for response assessment |

---

### 3.7 Hirsutism Tracking (Detailed)

| Field | Type | Frequency | Clinical Justification |
|-------|------|-----------|----------------------|
| mFG simplified zone score | 0–4 per 5 zones | Quarterly baseline + monthly trend | Primary androgenic symptom trend signal |
| Hirsutism photo log | Photo (encrypted, local-first) | Monthly (optional) | Visual comparison over time; private; helpful for evaluating laser/medication response |
| Hair removal sessions | Selection: waxing / threading / laser / electrolysis / shaving / cream | Per session | Tracking removal method and frequency; time between removal sessions is an indirect growth rate proxy |
| Time since last removal (per zone) | Days since last removal | Calculated | If upper lip required threading every 2 weeks before treatment and now every 5 weeks, that is measurable treatment response |
| Laser/IPL session log | Date + session number + area treated | Per session | Laser hair removal is common treatment for PCOS hirsutism; 8–12 sessions typical course; tracking progress expected |

---

### 3.8 Fertility-Specific Tracking (Activated in "Trying to Conceive" Mode)

| Field | Type | Frequency | Clinical Justification |
|-------|------|-----------|----------------------|
| OPK brand + test strip result | Brand + scale (0–9 for quantitative monitors like Mira) | Daily during cycle | LH-only OPKs are unreliable in PCOS; quantitative hormone monitors better; dual LH + E2 tracking preferred |
| BBT (Basal Body Temperature) | Temperature (°C or °F) — from wearable preferred | Daily (AM before rising) | Thermal shift confirms ovulation occurred; high-burden but provides ovulation confirmation signal; wearable sync (Ava, TempDrop) reduces burden |
| Intercourse timing | Binary Y/N | Daily (private, end-to-end encrypted, not visible in any export) | Helps user identify timing relative to LH surge; never transmitted to server in identifiable form |
| Fertility treatment — cycle day | Number + treatment type | Daily (during treatment cycle) | Letrozole/IUI/IVF cycles require day-specific logging; integration with clinic cycle calendars is a P2 feature |
| PdG (progesterone metabolite) urine test | Positive / Negative | Day 7–10 post OPK peak | Best ovulation confirmation method in PCOS; confirms egg was released not just LH surged |
| Ultrasound follicle monitoring results | Number of dominant follicles + sizes (mm) | Per scan (manual entry) | Used during ovulation induction cycles; user enters from clinic report; tracked alongside OPK for context |
| TTC (trying to conceive) cycle number | Number | Per cycle | Emotional context; helps app calibrate sensitivity of messaging as time increases |
| Pregnancy test result | Positive / Negative / Not tested | Per cycle | End-cycle data point; enables downstream pregnancy transition if positive |

---

## SECTION 4: FEATURE LIST — COMPLETE FROM A TO Z

For each feature: description, data used, clinical evidence, MVP priority (P0–P3), technical complexity (S/M/L/XL).

---

### Feature 1: Irregular Cycle Support
**Description:** Cycle calendar that accepts any cycle length from 14 to 365+ days without prediction, judgment, or normalization toward 28 days.  
**Data used:** Cycle start dates, period flow logs, OPK results  
**Clinical evidence:** PCOS cycles range 21 to >90 days. Standard apps predicting ovulation at day 14 are clinically wrong for PCOS users and can cause harm (incorrect fertility timing, false reassurance). Rotterdam Criterion 1 is defined by cycles >35 days.  
**Priority:** P0  
**Complexity:** S — disable prediction model; show raw logged dates only

---

### Feature 2: Ovulation Detection Module
**Description:** Multi-signal ovulation tracking combining OPK logs, cervical mucus, BBT, PdG confirmation, and mittelschmerz — with PCOS-specific interpretation. No single-method prediction. Shows pattern across all signals.  
**Data used:** OPK results, CM observations, BBT, PdG, mittelschmerz, progesterone lab value  
**Clinical evidence:** Standard OPK algorithms fail PCOS users because elevated baseline LH creates false positives. Multi-method approach (OPK + CM + PdG) dramatically improves ovulation detection accuracy. Quantitative hormone monitors (Mira, Inito) outperform standard strip OPKs in PCOS. PdG is the most reliable ovulation confirmation.  
**Priority:** P0  
**Complexity:** M

---

### Feature 3: Androgen Symptom Tracker
**Description:** Daily log for acne (location + severity), hirsutism (mFG-simplified), hair shedding, and oily skin. Monthly trend charts. Photo log option (encrypted, local-first).  
**Data used:** Acne fields, mFG zone scores, hair shedding, skin oiliness, hirsutism event log  
**Clinical evidence:** Hyperandrogenism (Rotterdam Criterion 2) affects 60–100% of PCOS patients. Tracking androgenic symptoms over time is the primary way patients can objectively measure treatment response to spironolactone, OCP, or laser treatment. GAGS and mFG are validated clinical instruments.  
**Priority:** P0  
**Complexity:** M

---

### Feature 4: Lab Values Vault
**Description:** Secure store for manually entered lab results. Each value timestamped and plotted on a trend chart. HOMA-IR auto-calculated from fasting insulin + glucose entry. Export as PDF for physician appointments.  
**Data used:** All lab value fields from Section 3.5  
**Clinical evidence:** PCOS patients are surveyed repeatedly over years. Lab trending is clinically meaningful — declining testosterone, improving HOMA-IR, rising SHBG all indicate treatment success. Reddit PCOS study (PMC 2023) found testosterone and DHEA-S are the most-discussed values in PCOS communities. Users are already self-tracking labs; the app gives them a structured, longitudinal home for this data.  
**Priority:** P0  
**Complexity:** S (data entry + charting); M (PDF export)

---

### Feature 5: HOMA-IR Calculator
**Description:** User enters fasting insulin (μIU/mL) and fasting glucose (mg/dL). App calculates HOMA-IR = (insulin × glucose) ÷ 405. Shows result with contextual reference: <2.0 typical, ≥2.5 suggests IR, ≥3.0 elevated, ≥4.0 severe. Tracks over time.  
**Data used:** Fasting insulin entry, fasting glucose entry  
**Clinical evidence:** HOMA-IR is the most widely used clinical measure of insulin resistance outside of the gold-standard euglycemic clamp. 64% of PCOS patients have insulin resistance by HOMA-IR criteria (Fertil Steril 2005). HOMA-IR ≥2.5 in a PCOS patient is clinically significant regardless of whether the lab flags it as "abnormal." Lifestyle interventions reduce HOMA-IR within 8–12 weeks.  
**Priority:** P0  
**Complexity:** S

---

### Feature 6: Metabolic Syndrome Risk Tracker
**Description:** Displays user's current status across the 5 metabolic syndrome criteria (waist circumference, blood pressure, fasting glucose, triglycerides, HDL). Calculated from lab values vault and body metric entries. Shows how many criteria are met.  
**Data used:** Waist circumference, blood pressure (if logged), fasting glucose, triglycerides, HDL  
**Clinical evidence:** Women with PCOS have 2–3× increased risk of metabolic syndrome. The 2023 International PCOS Guidelines specifically call out metabolic risk as a priority assessment area. Metabolic syndrome is defined by the IDF/ATP-III criteria: waist ≥88 cm + any 2 of: TG ≥150, HDL <50, BP ≥130/85, fasting glucose ≥100 mg/dL.  
**Priority:** P1  
**Complexity:** S

---

### Feature 7: Medication Adherence Log
**Description:** Daily medication check-in with custom medication list. Tracks dose, timing, and side effects. Shows adherence streaks. Spironolactone log includes blood pressure field. Metformin log includes GI tolerance field. OCP log includes breakthrough bleeding field.  
**Data used:** Medication tracking fields from Section 3.6  
**Clinical evidence:** Medication adherence is a primary factor in PCOS treatment outcomes. Metformin GI side effects (abdominal pain, diarrhea) are the primary reason for discontinuation — dose-escalation tracking allows users to communicate their tolerance curve to physicians. Spironolactone can cause hypotension requiring monitoring.  
**Priority:** P0  
**Complexity:** M (custom medication builder + reminder system)

---

### Feature 8: Inositol Protocol Tracker
**Description:** Specialized tracking for Myo-inositol + D-chiro-inositol supplementation. Supports the evidence-based 40:1 ratio (standard dose: 2000–4000 mg Myo + 50–100 mg DCI daily). Tracks dose, timing, adherence, and GI tolerance. Shows 3-month trend for ovulatory symptoms.  
**Data used:** Inositol fields; OPK results (for ovulatory response); androgen symptom log  
**Clinical evidence:** The 40:1 Myo:DCI ratio mirrors the physiological plasma ratio. RCTs show combined Myo+DCI at 40:1 significantly improves insulin resistance, LH/FSH ratio, testosterone, and ovulatory function in PCOS (PMC 2024; Karger 2024). Not FDA-approved — app must frame as "supplement tracking" not "treatment recommendation."  
**Priority:** P1  
**Complexity:** S

---

### Feature 9: Glycemic Eating Log
**Description:** Simplified daily dietary quality log. No calorie counting. Three daily prompts: overall meal quality (1–5), low-GI adherence (yes/mostly/no), sugar/refined carb level (low/medium/high). Weekly chart shows dietary consistency vs. energy levels and other symptoms.  
**Data used:** Glycemic eating fields; energy level; post-meal crash; HOMA-IR trend  
**Clinical evidence:** Low-GI diets significantly reduce HOMA-IR, fasting insulin, total testosterone, and waist circumference in PCOS vs. high-GI diets (meta-analysis of RCTs, Advances in Nutrition 2022). Mediterranean-style dietary patterns with low-GI emphasis are recommended by the 2023 PCOS Guidelines as first-line lifestyle intervention.  
**Priority:** P1  
**Complexity:** S

---

### Feature 10: Weight Tracking (Non-Punitive, Optional)
**Description:** Opt-in weight log. Hidden by default. Framed as a metabolic health signal. No BMI displayed. No "goal weight" or "target" language. No comparison to others. Shows only user's own trend over time with neutral framing. Full design spec in Section 6.  
**Data used:** Weight entry (user-initiated); waist circumference  
**Clinical evidence:** 5–10% weight reduction in overweight PCOS patients significantly improves insulin sensitivity, testosterone levels, and ovulatory function. The 2023 PCOS Guidelines emphasize that weight management must be offered with weight-sensitive care and without stigma.  
**Priority:** P1  
**Complexity:** S (tracking); M (anti-stigma UX design)

---

### Feature 11: Phenotype Identification Helper
**Description:** After 60 days of logging, the app generates a suggested PCOS phenotype based on symptom patterns. "Based on what you've logged, your symptom pattern is most consistent with [Phenotype A/B/C/D]. This is not a diagnosis — it's a pattern to discuss with your doctor." Shows what that phenotype means for monitoring priorities.  
**Data used:** Cycle regularity, androgen symptom logs, lab values (if entered), OPK results  
**Clinical evidence:** The 4 PCOS phenotypes have distinct risk profiles and optimal monitoring approaches. Phenotype D (OD + PCOM, no HA) has the lowest metabolic risk and does not need intensive androgen tracking. Phenotype A has the highest insulin resistance prevalence and most benefits from HOMA-IR monitoring.  
**Priority:** P2  
**Complexity:** M (rule-based phenotype inference engine)

---

### Feature 12: PCOS Mood Module
**Description:** Daily anxiety and mood log with cyclical and non-cyclical pattern visualization. Shows mood patterns relative to cycle phase (where cycle data exists). Links to in-app psychoeducation about PCOS-anxiety-depression connection. Not a mental health treatment — includes in-app prompt to seek professional support when PHQ-2 equivalent score is persistently elevated.  
**Data used:** Anxiety, depression, irritability log; cycle phase; sleep quality  
**Clinical evidence:** Anxiety and depression are 3–4× more prevalent in PCOS than general population. Women with PCOS have 2.79× higher odds of clinical depression diagnosis. The 2023 PCOS Guidelines recommend emotional wellbeing screening as a core component of care — currently absent from most clinical workflows and all existing PCOS apps.  
**Priority:** P0  
**Complexity:** M (mood charting + safe escalation logic)

---

### Feature 13: Physician Report Generator
**Description:** One-tap PDF report of: last 3 months of cycle data, androgen symptom trends, lab values table (all entries), medication log, HOMA-IR trend, and mood summary. Designed to be printable and physician-readable. Framed as "a head start for your appointment."  
**Data used:** All tracked data  
**Clinical evidence:** Only 35.2% of PCOS patients are satisfied with their diagnosis experience; 47% saw 3+ providers. Preparing structured data for appointments is one of the highest-value things an app can do for a chronically under-served patient population. Physician reports have been shown to improve diagnosis quality and reduce diagnostic time in other chronic conditions.  
**Priority:** P1  
**Complexity:** L (PDF generation, layout, data aggregation)

---

### Feature 14: Fertility Mode
**Description:** Toggled "Trying to Conceive" mode. Activates BBT log, PdG testing, intercourse timing, and fertility treatment cycle tracking. Changes calendar interface to show fertile window estimate (based on actual OPK/CM/BBT data, NOT algorithmic prediction). Shows cycle day count prominently.  
**Data used:** All fertility-specific fields from Section 3.8; OPK; CM; BBT; PdG  
**Clinical evidence:** PCOS is the most common cause of anovulatory infertility, accounting for approximately 75% of anovulatory infertility cases. Multi-method fertility awareness is more effective than OPK alone in PCOS. Letrozole is the first-line ovulation induction agent (2023 PCOS Guidelines).  
**Priority:** P1  
**Complexity:** M

---

### Feature 15: Ultrasound Result Vault
**Description:** Manual entry form for ultrasound findings: date, antral follicle count (AFC) per ovary, ovarian volume (mL) per ovary, dominant follicle presence, radiologist's PCOM finding. Stores and displays trends over time.  
**Data used:** Ultrasound fields; AMH lab value (correlated with AFC)  
**Clinical evidence:** PCOM threshold per 2018 updated criteria is ≥20 follicles per ovary (2–9 mm) or ovarian volume ≥10 mL. AFC is highly correlated with AMH levels and is the primary ultrasound diagnostic marker. Users undergoing fertility monitoring receive serial ultrasounds; having a longitudinal vault is clinically useful.  
**Priority:** P2  
**Complexity:** S (data entry + display)

---

### Feature 16: Community Matching (Same Phenotype)
**Description:** Anonymous peer community where users are matched primarily by PCOS phenotype. Phenotype D users (non-androgenic) are not shown advice for Phenotype A (classic, high-androgen). Moderated forum with clinician-verified information. Opt-in.  
**Data used:** Self-identified phenotype; symptom profile  
**Clinical evidence:** PCOS communities on Reddit (r/PCOS has >300K members) are one of the primary information sources for PCOS patients. Phenotype-specific communities reduce misinformation (Phenotype A advice given to Phenotype D users and vice versa). Social support improves chronic condition management across evidence base.  
**Priority:** P3  
**Complexity:** XL

---

### Feature 17: Doctor Appointment Prep
**Description:** Pre-appointment checklist tailored by PCOS phenotype and user's tracking history. Suggests: which labs to request, which symptoms to describe, what questions to ask. Includes "talking points" for weight-related conversations (boundary-setting language). Physician report auto-attaches.  
**Data used:** All tracked data; phenotype; medication list; lab gaps  
**Clinical evidence:** Provider dismissal is a documented cause of diagnostic delay in PCOS. Structured appointment preparation tools have been shown to improve patient-physician communication and patient satisfaction in multiple chronic condition studies.  
**Priority:** P1  
**Complexity:** M

---

### Feature 18: Ferriman-Gallwey Simplified Self-Assessment
**Description:** Illustrated body diagram with 5 simplified zones (face, chest, abdomen, arms, back). Tappable body map where user rates each zone 0–4. Total mFG-equivalent score calculated and stored. Baseline taken at onboarding, then available quarterly.  
**Data used:** mFG zone scores  
**Clinical evidence:** Modified mFG ≥8 is the primary clinical criterion for hirsutism. Patient self-scoring shows moderate-to-good concordance with clinician scoring (Fertil Steril 2011). A simplified app-based version allows longitudinal tracking of androgenic symptom change — the only objective self-reportable androgen marker available outside of lab tests.  
**Priority:** P0  
**Complexity:** M (illustrated body map component)

---

### Feature 19: Hair Shedding Tracker
**Description:** Daily log of hair shedding (scale or estimated count). Monthly trend chart. Optional location identifier (diffuse / frontal / temples / crown — Ludwig classification zones). Photo log option (crown/part photos for comparison).  
**Data used:** Hair shedding fields; androgenic alopecia location; Ludwig zone  
**Clinical evidence:** Androgenic alopecia affects 48% of PCOS patients. Ludwig classification (I: mild diffuse thinning at crown; II: marked thinning; III: complete loss at crown) is the clinical grading system. Hair loss is one of the most psychologically distressing PCOS symptoms and one of the least well-tracked by existing apps.  
**Priority:** P0  
**Complexity:** S

---

### Feature 20: Treatment Response Tracker
**Description:** Monthly auto-generated "How is your treatment working?" summary card. Shows side-by-side comparison of androgen symptoms, cycle regularity, mood, and energy from 3 months ago vs. now. No judgment — just data. Option to share with physician.  
**Data used:** All symptom logs; lab value trends; medication log  
**Clinical evidence:** PCOS treatment response takes 3–6 months for most interventions (spironolactone, OCP, metformin, inositol). Users frequently discontinue effective treatments because they don't see evidence of progress. A structured monthly review showing objective data change reduces inappropriate discontinuation and helps users have evidence-based conversations with their doctors.  
**Priority:** P1  
**Complexity:** M (data aggregation + comparison view)

---

## SECTION 5: DOCTOR TEAM DEBATE

*Simulated meeting of the HormonaIQ Clinical Advisory Panel. Participants are composite experts.*

**Dr. Ananya Krishnamurthy** — Endocrinologist, PCOS and insulin resistance specialist, academic medical center  
**Dr. Marcus Burke** — Reproductive endocrinologist, PCOS-related infertility, IVF program director  
**Dr. Kwame Osei** — OB-GYN, PCOS generalist, community health center  
**Lisa Valdez** — Patient advocate, PCOS diagnosed at 24, metabolic PCOS, 11 documented "just lose weight" encounters, co-founded PCOS support group  
**Dr. Yuki Nakamura** — Dermatologist, androgen effects on skin and hair, mFG user since residency  

---

**Debate 1: What is the single most important data point for monitoring PCOS progress?**

**Dr. Ananya:** Fasting insulin and HOMA-IR, no contest. They're the root cause for 64% of our patients. You can normalize a cycle with a pill, you can suppress androgens with spironolactone, but if you're not addressing insulin resistance, you haven't touched the disease. HOMA-IR is the one number that tells me if the underlying pathology is moving. When it drops from 4.2 to 2.1 over six months, I know the lifestyle change is working.

**Dr. Burke:** I disagree. Cycle regularity is the most important. Why? Because it's the one PCOS marker that is universally present — by definition, you can't have PCOS without ovulatory dysfunction (in phenotypes A, B, D), and for my fertility patients, a spontaneous cycle is the entire goal. An app that helps my patients log even one more spontaneous cycle per year is more valuable than any HOMA-IR chart.

**Dr. Nakamura:** You're both thinking like clinicians. I use the mFG every single appointment. Hirsutism is the symptom that drives the most psychological distress in my PCOS patients. Hair doesn't lie — it takes 6 months for spironolactone to show up in the mFG. When a patient tracks their mFG declining from 14 to 9 over a year, that's a tangible, visible sign that their body is responding. For daily motivation, that matters more than a number they can't see.

**Lisa:** With respect to everyone at this table — for me, and for most of the women in my group, it's the acne. I can hide my irregular period. I can hide my hair removal. But I wake up every morning and look at my face. If the app could show me that my jawline acne decreased from a 4 to a 2 over three months, that would be the first time any tool has actually reflected what I live with. Don't optimize this app for what's clinically elegant. Optimize it for what the patient sees in the mirror.

**Resolution for the app:** Track all four simultaneously. HOMA-IR gets its own calculator (Feature 5). Cycle regularity is a P0 calendar feature. mFG is tracked quarterly. Acne severity is tracked daily. The Treatment Response Tracker (Feature 20) surfaces all four in one monthly comparison view, letting each user prioritize the metric that matters to them.

---

**Debate 2: Should the app recommend inositol supplementation?**

**Dr. Ananya:** The evidence is real. The 40:1 Myo:DCI ratio has multiple RCTs showing improvement in insulin resistance, testosterone, and ovulatory function. I recommend it to patients off-label, and I'm transparent that it's not FDA-approved. An app can present the evidence without "recommending."

**Dr. Osei:** I'm more cautious. The app will be used by hundreds of thousands of people. If we surface inositol as a tracked supplement with a protocol, we are de facto endorsing it. Some users will interpret tracking = recommended. I'd rather the app track it without initiating any suggestion.

**Dr. Burke:** The practical question is: are users already taking inositol? Absolutely yes. The r/PCOS subreddit has thousands of posts about inositol. They're taking it without guidance, at incorrect ratios, buying DCI-heavy products that can actually impair ovarian function at high doses. An app that helps them track the correct protocol and their response is harm reduction, not promotion.

**Lisa:** I spent four months taking DCI alone because I misread a post. Nobody told me the ratio mattered. If the app had said "track your dose, here's the evidence-based ratio," I would have had four better months.

**Resolution for the app:** The app tracks inositol as a supplement (user-initiated). When a user adds inositol to their medication list, the app shows a single contextual note: "The most studied protocol for PCOS is Myo-inositol + D-chiro-inositol at a 40:1 ratio (e.g., 2000 mg Myo + 50 mg DCI). This is not FDA-approved. Discuss with your doctor." No push notification, no recommendation engine, no re-surfacing. One-time educational note. This is not medical advice; it is accurate information about a supplement a user has already elected to track.

---

**Debate 3: How do you handle weight tracking without repeating the medical system's harm?**

**Lisa:** I have been told to "just lose weight" eleven times by eleven different clinicians. Three of them said it without looking at my lab results. Two said it while I was in a BMI-normal range. One time, I had lost 12 pounds and my testosterone was actually higher — and the doctor said "keep losing weight." The damage those conversations do is not theoretical. I stopped going to the doctor for two years after one of them.

**Dr. Osei:** The evidence does show that 5–10% weight loss in overweight PCOS patients restores ovulation and reduces androgens. That's real and we shouldn't hide it. But the delivery matters enormously. The message is "weight is a metabolic lever," not "you are broken and the fix is smaller."

**Dr. Ananya:** The app should never initiate weight tracking. It should never ask "what's your goal weight?" It should never display BMI. If a user chooses to turn on weight tracking, show the number, show the trend, and contextualize it only as: "weight can affect insulin sensitivity and hormonal balance." No comparisons. No ideal ranges. No progress bars toward a target.

**Dr. Nakamura:** The language is everything. "Your metabolic health data" instead of "your weight loss journey." "What your body is doing" instead of "are you making progress."

**Resolution for the app:** See Section 6 for complete weight stigma protocol.

---

**Debate 4: How do you build a useful calendar for someone whose cycles are 35–90 days?**

**Dr. Burke:** You don't predict anything. You just record. Show a clean timeline with period markers and OPK peaks. Let the user see their own pattern emerge. After 3 cycles, you might be able to show an average — but never extrapolate forward.

**Dr. Ananya:** I want the app to flag cycles for the user. If a cycle goes past 90 days with no period, the app should prompt: "You've been in this cycle for 90 days. This might be a good time to take a pregnancy test if relevant, and to contact your doctor." That's clinically useful.

**Dr. Osei:** Agreed, but the prompt needs to be gentle, not alarming. Many PCOS users have had 90-day cycles their entire reproductive lives. The app must not behave like this is a crisis.

**Lisa:** The worst thing apps do is show the little "you're X days late" counter like you're doing something wrong by not having your period on schedule. My period is never on schedule. I am not "late." That word carries weight that the developers have no idea about.

**Resolution for the app:** Calendar shows only logged data. No prediction line. After 45 days without a new cycle start, app offers a neutral check-in: "It's been 45 days since your last period. Want to log anything?" At 90 days: "It's been 90 days. Many PCOS cycles do go this long. If this is unusual for you, or if you'd like support, here are some resources." No "late" language anywhere in the product.

---

**Debate 5: Should fertility tracking be integrated or a separate mode?**

**Dr. Burke:** Separate mode, clearly. Fertility tracking changes the entire emotional context of every interaction. Cycle day tracking becomes high-stakes. OPK results become emotionally loaded. A user not trying to conceive does not want to see fertile window calculations. Keep them separate so the emotional context is appropriate for each.

**Lisa:** I'm against rigid separation. I went through 18 months of not knowing if I wanted children, tracking loosely, before I decided yes. If fertility mode had been an entirely different app, I would have had to start from scratch. The data should be continuous. The *presentation* can switch.

**Dr. Osei:** Compromise: one underlying data model, two presentation modes. A user in PCOS general mode and a user in fertility mode are logging the same things — but the fertility mode shows them differently. The calendar emphasizes fertile window; the general mode emphasizes symptom patterns. No data lost either way.

**Resolution for the app:** Single data model. Toggle between "PCOS Management Mode" and "Trying to Conceive Mode." Fertility mode activates BBT, PdG, and intercourse log. The calendar view changes; the underlying data structure does not. Users can switch at any time with no data loss.

---

## SECTION 6: THE WEIGHT STIGMA PROBLEM

### 6.1 The Medical Record

"Just lose weight" is the single most commonly reported harmful clinical experience of PCOS patients. The International Evidence-Based PCOS Guidelines 2023 explicitly acknowledge that weight stigma is pervasive in the PCOS healthcare community. Research on medical gaslighting documents that providers with heavier patients spend less appointment time, show less positive rapport, engage in less patient-centered communication, and are less likely to order diagnostic tests (WebMD / Journal of General Internal Medicine).

For PCOS patients specifically:
- 20–30% of PCOS diagnoses are in people with BMI in the "normal" range — PCOS is not caused by weight
- Weight is a symptom/comorbidity of PCOS in many patients, not a cause
- Even when weight loss helps, the mechanism is metabolic (reduced insulin, reduced androgen production) — the loss itself is not the goal
- Eating disorders (binge eating disorder, orthorexia) are elevated in PCOS — calorie-focused language is a direct risk factor

### 6.2 What the Evidence Actually Says

A 5–10% weight reduction in overweight women with PCOS:
- Reduces fasting insulin and HOMA-IR significantly
- Restores spontaneous ovulation in a meaningful subset (up to 30–40%)
- Reduces total testosterone and increases SHBG
- Improves cycle regularity

This is real evidence. The app does not hide it. But the framing is: **"This is a metabolic mechanism, not a moral imperative."**

### 6.3 The Weight Tracking Protocol for HormonaIQ

**Default state:** Weight tracking is OFF. It does not appear in the daily log. No prompts.

**Activation:** User manually navigates to Settings > Metabolic Tracking > Add Body Metrics > Weight. They choose their unit. No persuasion language. No "this can help your PCOS" prompt.

**Display:** A simple number and a trend line. The Y-axis shows only the user's own data range — not ideal weight ranges, not BMI thresholds. No color coding (no green/yellow/red). No percentage change callout.

**Contextualization:** One non-invasive contextual note, shown once upon activation: "Weight can be one signal in metabolic health — changes over time may reflect shifts in insulin sensitivity. We display your data as a trend, not a target." Never shown again.

**What never appears:**
- BMI (never calculated, never displayed)
- "Goal weight" field
- "Ideal weight range" reference
- "Progress toward goal" bars
- "You've gained X" notifications
- Any comparison to others
- Any framing of weight change as success/failure

**Language examples — what NOT to say:**

| Harmful | Why |
|---------|-----|
| "You're X lbs away from a healthy weight" | Assumes current weight is unhealthy; uses "healthy weight" as a moral category |
| "Great job hitting your weight loss goal!" | Frames weight loss as an achievement/performance |
| "Your BMI indicates overweight" | BMI is a flawed metric with racist origins; does not account for muscle mass; inflammatory for a population already medicalized around body size |
| "Losing weight may help your PCOS symptoms" | Correct information, harmful unsolicited delivery |
| "You've gained weight this week" | No context, pure harm |

**Language examples — what TO say:**

| Better | Why |
|--------|-----|
| "Your metabolic health trend" | Frames data as health signal, not body judgment |
| "Here's your data over the past 3 months" | Neutral, user-owned framing |
| "Your body metrics" | Non-judgmental container |
| "Any shift in metabolic markers over 3–6 months may be worth discussing with your doctor" | Accurate, deferential to clinician, non-prescriptive |

---

## SECTION 7: LOGGING PROTOCOL

### 7.1 How PCOS Logging Differs from PMDD Logging

PMDD symptoms follow a predictable pattern: onset in the luteal phase (approximately days 14–28 of a 28-day cycle), resolution within a few days of menstruation. PMDD tracking is inherently cyclical — you know when to look.

PCOS symptoms are **chronic with flares**. Insulin resistance is present every day. Acne severity fluctuates but has no reliable cyclical pattern in many PCOS phenotypes. Hirsutism is a long-term trend, not a cyclical symptom. Fatigue may be constant, worsening with dietary lapses. The cycle is unpredictable, so the "cyclical symptom" framework breaks down.

Practical implications:
- Daily logging is the core tracking unit, not phase-based tracking
- Trends are measured in months, not weeks
- "Good days" and "bad days" exist but are not reliably cycle-phase-linked (unless the user has BOTH PCOS and PMDD — see Section 8)
- The app must surface long-range trends (90-day rolling average) rather than just this-week vs. last-week

### 7.2 Recommended Minimum Logging Frequency

**Daily (the core log — designed to take under 2 minutes):**
- 3 androgenic symptoms (acne, hair shedding, skin oiliness) on a 1–5 scale
- Energy + mood (3 taps)
- Cycle status (period / no period / spotting — 1 tap)
- Any OPK result if testing

**Weekly:**
- Sleep quality average
- Exercise summary
- Dietary quality rating

**Monthly:**
- mFG zone self-assessment
- Body metrics (if opted in)
- Hair removal log

**Per cycle:**
- Cycle length confirmation
- Any fertility-specific entries

**On trigger (symptoms spike):**
- Pelvic pain episode
- Significant acne flare
- Any medication side effect

### 7.3 What a "Good Enough" Dataset Looks Like for Physician Report

A physician report is clinically meaningful after:
- ≥90 days of data (3 cycles, or 3 months of daily logs)
- ≥2 lab value entries (even just testosterone + fasting insulin provides signal)
- ≥1 cycle start date logged (establishes baseline cycle length)
- Daily log completion rate ≥50% (even spotty daily data is meaningful at 90 days)

The app should generate a physician report flag when this threshold is reached: "You have enough data to generate a meaningful doctor report."

### 7.4 Handling Gaps in Data

PCOS users disengage from tracking apps at high rates — often during the worst symptomatic periods (when logging feels like another burden on top of living with a chronic condition). The app must handle gaps gracefully.

**3–7 days missed:** No notification, no nudge. App notes "3 days unlogged" in the log view.

**7–14 days missed:** Single gentle notification: "We noticed you haven't logged in a while. No pressure — your data is here whenever you come back."

**14+ days missed:** No further notifications until user returns. When user opens the app: "Welcome back. Your data from before [gap date] is all here. You can catch up if you want, or just start from today — either works."

**When user skips 3 weeks and returns:**  
App shows a non-judgmental check-in screen: "You were away for 3 weeks. Some things you might want to log: Did you have a period? Any big changes in symptoms? Or just start fresh from today?" User can bulk-log key events retroactively or skip. The app never penalizes gaps in adherence scores or streak counts.

**No streaks as primary gamification.** Streaks punish chronic illness patterns where bad symptom days = inability to log. If HormonaIQ uses engagement mechanics, they must be based on cumulative data richness, not consecutive daily logging.

---

## SECTION 8: THE PCOS-PMDD OVERLAP

### 8.1 The Evidence

A large Swedish register-based study (PMC 2025) found that individuals diagnosed with PCOS were at significantly increased risk for premenstrual disorders, with a hazard ratio of 1.54 (95% CI 1.46–1.63) after adjustment for confounders. The mechanistic link: PCOS disrupts the progesterone/estrogen ratio via anovulation, and PMDD is triggered by neurosteroid (particularly allopregnanolone) fluctuations in the luteal phase. When PCOS causes anovulation, the luteal phase progesterone surge does not occur — yet when ovulation does happen, the progesterone-withdrawal event can be more severe. PCOS-related insulin resistance also disrupts neurotransmitter production, worsening PMDD-type mood symptoms.

### 8.2 Tracking Modules When User Selects Both Conditions

When a user marks both PCOS and PMDD in their profile:

**Activated from PCOS module:**
- Full androgenic symptom log
- Irregular cycle support (no 28-day assumption)
- Metabolic tracking
- Lab values vault
- Medication log (may include both PCOS and PMDD medications)

**Activated from PMDD module:**
- Daily mood + anxiety + irritability log (P0 for both)
- Luteal phase symptom amplification detection
- DRSP (Daily Record of Severity of Problems) or equivalent scoring
- PMDD "window" display (but displayed only around confirmed ovulation, not assumed day 14)

**Key conflict:** PMDD tracking requires knowing the luteal phase. The luteal phase begins after ovulation. PCOS users often don't know when (or if) they ovulated. The app resolves this by:
- Only displaying PMDD phase tracking in cycles where OPK peak or PdG confirmation of ovulation was logged
- In anovulatory cycles: PMDD module shows "PMDD tracking is most accurate in ovulatory cycles. This cycle appears anovulatory — mood data is still recorded, but phase-specific analysis isn't available for this cycle."
- Providing a multi-month retrospective view to identify whether PMDD symptoms cluster after confirmed ovulations vs. random distribution

### 8.3 Calendar Handling

Single calendar. Color layers:
- Menstrual phase: red
- Confirmed ovulation marker: green dot
- OPK peak: teal dot
- PMDD symptom window (luteal phase, if ovulation confirmed): soft purple highlight
- Anovulatory cycle: no luteal phase highlight, no PMDD window shown

The calendar must visually show the difference between an anovulatory month (no PMDD window) and an ovulatory month (PMDD window present), helping users understand their own cycle variability over time.

### 8.4 Medication Interaction Note

Some medications overlap (SSRIs taken luteal-phase-only for PMDD; OCPs used for both PCOS cycle regulation and PMDD suppression). The medication log must support:
- Continuous medications (daily metformin, daily spironolactone)
- Cyclical medications (luteal-phase SSRIs, cycle-specific letrozole)
- Supplement stack (inositol, vitamin D — both relevant to PCOS and potentially PMDD via inflammatory pathway)

---

## SECTION 9: NEVER-BUILD LIST FOR PCOS

The following features seem useful but are clinically wrong or actively harmful for PCOS users. Do not build these.

### 1. Standard 28-Day Cycle Prediction
**Why not:** PCOS cycles range from 21 to 90+ days. A predicted "next period" date based on 28-day average will be wrong for a majority of users. The app predicting an expected period date and the period not arriving creates anxiety in users who then don't know if they're "late" or just having a normal PCOS cycle. There is no safe way to display a predicted period date for PCOS users. Remove this entirely.

### 2. LH-Algorithm Ovulation Prediction
**Why not:** Ovulation prediction algorithms (used by Clue, Flo, Natural Cycles) are based on population data for regular cycles. They assume a consistent follicular phase length and luteal phase length. PCOS follicular phases are variable (can be 21–70+ days). Displaying a fertile window based on these algorithms will be wrong for most PCOS users and can lead to incorrect contraception assumptions or missed conception windows.

### 3. Fertility Framing by Default
**Why not:** Approximately 40% of PCOS users are not trying to conceive and do not want their condition medicalized primarily through the lens of fertility. Showing "fertile window" by default, leading with "your fertility signs" in onboarding, or framing cycle irregularity primarily as a "fertility challenge" alienates users managing PCOS for skin, mood, metabolic, or quality-of-life reasons. Fertility mode is an opt-in, clearly separated feature (see Section 4, Feature 14).

### 4. BMI Display or "Healthy Weight Range" Prompts
**Why not:** BMI is a flawed metric with significant racial bias (developed on white European male populations). For PCOS specifically, BMI does not distinguish between fat mass and lean mass, does not indicate insulin resistance severity, and does not account for the endocrine etiology of weight changes. Displaying BMI will communicate "you are overweight" to a population that has already been harmed by that message repeatedly. Do not calculate or display BMI anywhere in the app.

### 5. Calorie Counting Integration
**Why not:** The evidence base for calorie restriction in PCOS is significantly weaker than for dietary quality and glycemic index reduction. Calorie counting triggers disordered eating in populations predisposed to it. Binge eating disorder is elevated in PCOS compared to the general population. Integrating MyFitnessPal-style calorie tracking would undermine the app's commitment to weight-sensitive, metabolically-framed health management. The evidence-based dietary intervention for PCOS is low-GI, Mediterranean-style dietary quality — not calorie deficit.

### 6. Ovulation Predictor Badge or "Best Days to Try" Banner
**Why not:** For users not in fertility mode, this banner is invasive, assumes fertility intent, and triggers dysphoria in users who are not trying to conceive or who have faced infertility. For users in fertility mode, the "best days" framing is oversimplified for PCOS — in a condition where LH surges don't reliably indicate ovulation, a "best days" badge can provide false confidence.

### 7. "Normal" Cycle Length Reference
**Why not:** Do not display "a typical cycle is 21–35 days" anywhere in the app's standard flow. Many PCOS users know their cycle is atypical and have been told this repeatedly by doctors in dismissive contexts. Normalizing the "typical" cycle implicitly pathologizes the PCOS user's cycle, which is already PCOS-pathologized enough. If clinical context is needed (e.g., in educational content), frame it as: "Cycles vary widely. PCOS cycles often run longer — anywhere from 35 to 90+ days is within the PCOS experience."

### 8. Aggressive Re-engagement Push Notifications
**Why not:** Push notifications for apps managing chronic conditions are a double-edged sword. For PCOS users who are disengaging during symptom flares, repeated "You haven't logged in 3 days!" notifications are harmful. They create guilt, reinforce the idea that not logging is a failure, and may associate the app with stress. Use gentle, opt-in reminders only. Default: no daily reminder notifications. User sets their own notification preference with explicit choices.

### 9. "Success Story" Weight Loss Content
**Why not:** Before-and-after weight loss content, even framed as PCOS success stories, reinforces that weight loss is the primary success metric for PCOS management. Many PCOS users who are managing their condition well will not have experienced weight loss. Centering weight loss stories as success marginalizes users who are succeeding in other dimensions (restored ovulation, reduced androgenic symptoms, improved insulin sensitivity, better mood).

---

## SECTION 10: GAP ANALYSIS — FEATURES THAT DON'T EXIST ANYWHERE

The following data points and features would be clinically valuable for PCOS users but are absent from all current apps (AskPCOS, Clue, Flo, Natural Cycles, Bearable, PCOS Tracker).

### Gap 1: HOMA-IR Longitudinal Tracking with Lifestyle Correlation
**Current state:** No PCOS app calculates or tracks HOMA-IR over time.  
**Clinical value:** HOMA-IR is the most clinically meaningful metric of PCOS disease activity in insulin-resistant phenotypes (64% of PCOS patients). Tracking HOMA-IR as it responds to dietary changes, exercise, metformin, and inositol supplementation gives users and clinicians a direct insulin resistance readout. HOMA-IR responds within 8–12 weeks to lifestyle intervention — a timeline that makes longitudinal app tracking directly clinically useful.  
**Why it's missing:** Requires users to have ordered fasting insulin testing, which is not routinely performed in all healthcare systems. The barrier is test access, not tracking complexity.  
**Evidence:** Prevalence of Insulin Resistance in PCOS using HOMA-IR, Fertil Steril 2005 (64% prevalence). HOMA-IR responds rapidly to lifestyle change, 8–12 weeks (Lamkin Clinic, based on multiple clinical studies).

### Gap 2: Hirsutism Growth Rate Tracking (Time-to-Removal Metric)
**Current state:** No app tracks hair removal session frequency as a proxy for hair growth rate.  
**Clinical value:** A patient who required upper lip threading every 10 days before spironolactone and now requires it every 25 days has documented treatment response — but no app captures this. Time between hair removal sessions for a given zone is an indirect but reliable measure of androgenic hair growth rate. This is particularly valuable for tracking laser hair removal progress (typical course: 8–12 sessions over 12–18 months).  
**Why it's missing:** Requires connecting hair removal behavior logging to time-series analysis — a non-obvious product insight.  
**Evidence:** Spironolactone reduces terminal hair growth rate in androgen-sensitive zones over 6–12 months (multiple RCTs). mFG score combined with treatment timing is used in clinical trials to document response.

### Gap 3: Phenotype-Adaptive Content Engine
**Current state:** All PCOS apps deliver the same content regardless of phenotype. A Phenotype D user (no hyperandrogenism) sees the same hirsutism-focused content as a Phenotype A user.  
**Clinical value:** The 4 PCOS phenotypes have significantly different risk profiles. Phenotype D has markedly lower metabolic risk and no androgenic skin symptoms. Phenotype C (HA + PCOM, ovulatory) requires a fundamentally different cycle calendar approach than Phenotype A (classic anovulatory). Content, tracking priorities, and physician report templates should all adapt to phenotype.  
**Why it's missing:** Requires a phenotype inference engine and content taxonomy — significant product architecture investment.  
**Evidence:** PCOS phenotype review, PMC 2021. Clinical Phenotypes of PCOS: a Cross-Sectional Study, Springer 2023. Phenotype-specific metabolic risk differences are well-documented.

### Gap 4: Endometrial Health Risk Flag (Long Amenorrhea Cycles)
**Current state:** No PCOS app flags endometrial hyperplasia risk from prolonged anovulation.  
**Clinical value:** Unopposed estrogen (from anovulatory cycles) causes progressive endometrial hyperplasia, increasing endometrial cancer risk. Women with PCOS who are amenorrheic for >90 days, especially without progestogen protection, are at elevated risk. No current app surfaces this. A simple flag — "You've been in this cycle for 90+ days without a period. Discuss progestogen protection with your doctor" — could prompt a clinically important conversation.  
**Why it's missing:** Liability concerns and lack of clinical advisory involvement in current app development.  
**Evidence:** PCOS and endometrial cancer risk is 2–3× elevated vs. general population (multiple epidemiological studies). Progestogen-induced withdrawal bleed is the recommended protective intervention after 90 days of amenorrhea.

### Gap 5: Multi-Cycle OPK Pattern Analysis (Not Just Single-Test Interpretation)
**Current state:** Current apps show OPK result as positive/negative per test. None analyze LH patterns across multiple tests per cycle, or across multiple cycles.  
**Clinical value:** PCOS LH dynamics are complex: elevated baseline LH, multiple LH peaks without ovulation, blunted or absent peaks in some cycles, and variable surge-to-ovulation lag time. Pattern-based OPK analysis (comparing this cycle's LH curve to previous cycles; flagging multiple peaks in one cycle; identifying cycles with no peak at all) is far more useful to PCOS users than individual test interpretation. Combined with PdG confirmation, multi-cycle LH pattern analysis could help users identify which LH patterns actually predict ovulation for them individually.  
**Why it's missing:** Requires longitudinal data analysis and quantitative hormone monitor integration (Mira, Inito). Most OPK logging is binary (positive/negative) in current apps.  
**Evidence:** PCOS LH dynamics and multiple LH peaks without ovulation, Bird&Be and OOVA.life clinical content, supported by endocrine literature on LH pulse frequency in PCOS (elevated pulse amplitude and frequency in phenotypes A and B).

---

## SECTION 11: ANNUAL HEALTH MONITORING PROTOCOL

*Sources: Endocrine Society PCOS Patient Guide; RCOG Patient Information Leaflet 2022; AskPCOS.org (Monash University / PCOS Society); 2023 International Evidence-Based PCOS Guidelines*

PCOS is a lifelong condition with evolving risk profile across the reproductive years, perimenopause, and menopause. Five clinical bodies — the Endocrine Society, RCOG, PCOS Society, Jean Hailes Foundation, and the 2023 International PCOS Guidelines — unanimously agree on an annual monitoring standard. This section defines the monitoring protocol HormonaIQ must support.

---

### 9.1 Annual Checks — Consensus Across All Guidelines

The following checks are recommended at least annually for all PCOS users regardless of phenotype:

| Parameter | Method | What to Flag | App Implementation |
|-----------|--------|-------------|-------------------|
| Blood pressure | Manual reading (or wearable sync) | ≥130/80 mmHg (AHA threshold) | Periodic log in Section 3.3; annual reminder prompt |
| Fasting blood glucose | Blood test (GP-ordered) | ≥100 mg/dL (pre-diabetes threshold) | Lab Values Vault entry; trend chart |
| 2-hour 75g OGTT | Blood test (GP-ordered) | ≥140 mg/dL | Lab Values Vault entry; recommended over fasting glucose alone |
| Lipid panel (TC, LDL, HDL, triglycerides) | Blood test | High TG (>150 mg/dL), Low HDL (<50 mg/dL women) | Lab Values Vault; metabolic syndrome risk alert |
| HbA1c | Blood test | ≥5.7% (pre-diabetes) | Lab Values Vault; trend chart |
| Vitamin D (25-OH) | Blood test | <20 ng/mL (deficiency) | Lab Values Vault; supplement prompt |
| Thyroid (TSH) | Blood test | <0.4 or >4.0 mIU/L | Lab Values Vault; differential diagnosis context |
| Weight / waist circumference | Self-measured | Waist >88 cm (women) | Weekly tracking (optional); annual trend review |
| Mood and mental health screen | PHQ-9 and/or GAD-7 (in app) | PHQ-9 ≥10 / GAD-7 ≥10 | In-app annual prompt; link to GP referral information |

---

### 9.2 Phenotype-Specific Additional Monitoring

| Phenotype | Additional Annual Check | Rationale |
|-----------|------------------------|-----------|
| A (HA + OD + PCOM) | Fasting insulin + HOMA-IR calculation | Highest IR risk; insulin trends are the most important metabolic data point |
| A + B | Total and free testosterone trend | HA phenotypes benefit from androgen trend tracking to assess treatment response |
| All (amenorrhea >90 days) | Endometrial thickness discussion with GP | Unopposed estrogen causes endometrial hyperplasia; 90-day amenorrhea without progestogen protection is a safety trigger |
| Any with sleep complaints | Sleep apnea screening (Epworth Sleepiness Scale) | Up to 30% PCOS prevalence; untreated OSA worsens IR and cardiovascular risk |

---

### 9.3 HormonaIQ Implementation of Annual Monitoring

**Annual Health Review Prompt (Feature P1):**

At 12-month intervals from app start date (or from last Annual Review), HormonaIQ displays an "Annual PCOS Health Review" prompt containing:
1. Lab Values Vault completeness check — which of the 9 annual labs have been entered in the past 12 months
2. Pre-filled "Prepare for your GP appointment" checklist: tests to request, symptoms to mention, trends to share
3. One-page exportable summary of the past 12 months of data formatted for GP review (blood pressure trend, weight trend, lab trends, symptom burden summary, medication log)

**Phrasing guidance for the prompt:**
> "It's been 12 months since you started tracking. Your data is ready for your annual PCOS health check. Here's what to discuss with your doctor and which tests to ask for."

Do NOT use: "You're overdue for..." or "You need to..." — directive language is harmful in a population that already feels dismissed by the healthcare system.

---

### 9.4 Endometrial Hyperplasia Risk Protocol

The 90-day amenorrhea trigger is the most critical safety feature in the PCOS module.

**Trigger:** User has not logged a period start date for ≥90 days.

**App response sequence:**
1. Day 60 (silent): Internal flag. No user-facing message.
2. Day 75: In-app card (not notification): "It's been 75 days since your last logged period. In PCOS, longer cycles are common — but cycles over 90 days without a withdrawal bleed are worth discussing with your doctor."
3. Day 90: Definitive prompt: "You've been in an extended cycle for 90+ days. In PCOS, prolonged amenorrhea without progestogen protection can cause endometrial changes. We recommend discussing this with your doctor at your next appointment." Include pre-filled appointment prep note. Do NOT send this as a push notification — display in-app only on next open.
4. Day 90+: Offer "Log a conversation with your doctor" note to capture what was discussed.

*Source: PCOS and endometrial cancer risk is 2–3× the general population (multiple epidemiological studies). Progestogen-induced withdrawal bleed is the recommended protective intervention after 90 days of amenorrhea. RCOG Green-top Guideline No. 22 (Long-term Consequences of Polycystic Ovarian Syndrome).*

---

## APPENDIX: KEY SOURCES

1. Rotterdam ESHRE/ASRM PCOS Consensus Workshop Group. *Revised 2003 consensus on diagnostic criteria and long-term health risks related to polycystic ovary syndrome.* Hum Reprod. 2004;19(1):41–47. [PubMed](https://pubmed.ncbi.nlm.nih.gov/14688154/)

2. Azziz R et al. *Criteria for defining polycystic ovary syndrome as a predominantly hyperandrogenic syndrome: an Androgen Excess Society guideline.* J Clin Endocrinol Metab. 2006;91(11):4237–4245. [Oxford](https://academic.oup.com/jcem/article/91/11/4237/2656314)

3. Bozdag G et al. *Current Guidelines for Diagnosing PCOS.* PMC 2023. [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC10047373/)

4. Teede HJ et al. *Recommendations from the 2023 International Evidence-based Guideline for the Assessment and Management of Polycystic Ovary Syndrome.* Hum Reprod. 2023;38(9):1655–1679. [Oxford](https://academic.oup.com/humrep/article/38/9/1655/7241786)

5. Legro RS et al. *Prevalence and predictors of risk for type 2 diabetes mellitus and impaired glucose tolerance in polycystic ovary syndrome.* J Clin Endocrinol Metab. 1999. [PubMed link](https://pubmed.ncbi.nlm.nih.gov/15866584/)

6. Cooney LG et al. *Psychiatric disorders in women with polycystic ovary syndrome: a systematic review and meta-analysis.* PubMed. 2018. [PubMed](https://pubmed.ncbi.nlm.nih.gov/30066285/)

7. Lizneva D et al. *Prevalence of Polycystic Ovary Syndrome Phenotypes.* PMC 2016. [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC4126218/)

8. Rosenfield RL, Ehrmann DA. *The Pathogenesis of Polycystic Ovary Syndrome.* NEJM 2016.

9. Carmina E et al. *Modified Ferriman–Gallwey Score in Hirsutism.* PMC 2017. [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC5514800/)

10. Moran LJ et al. *Dietary composition in restoring reproductive and metabolic physiology in overweight women with PCOS.* J Clin Endocrinol Metab. 2003.

11. Unfer V et al. *A Combined Therapy with Myo-Inositol and D-Chiro-Inositol Improves Endocrine Parameters and Insulin Resistance in PCOS.* PMC 2016. [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC4963579/)

12. Polycystic Ovary Syndrome and Risk of Premenstrual Disorders. PMC 2025. [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12221545/)

13. PCOS Stigma and Weight Stigma. PCOS Nutrition Center. [pcosnutrition.com](https://www.pcosnutrition.com/weightstigma/)

14. Mobile Apps for PCOS: Content Analysis Using MARS. PMC 2025. [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12187023/)

15. Comparing Reddit-Derived and Literature Lab Values in PCOS. PMC 2023. [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC10492173/)

16. Delayed Diagnosis and Dissatisfaction in PCOS. PMC 2018. [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC6283441/)

17. Acne severity and the GAGS in PCOS. PubMed 2013. [PubMed](https://pubmed.ncbi.nlm.nih.gov/23948280/)

18. Dietary supplements in PCOS — current evidence. PMC 2024. [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11466749/)

19. Effects of Dietary GI and GL on PCOS: RCT meta-analysis. Advances in Nutrition 2022. [ScienceDirect](https://www.sciencedirect.com/science/article/pii/S2161831322003726)

20. The 40:1 myo-inositol/D-chiro-inositol plasma ratio. PMC 2024. [PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11126204/)
21. Endocrine Society. "PCOS Patient Guide." endocrine.org. (Annual monitoring standards; 75g OGTT as preferred glucose test; sleep apnea and NAFLD risk; acanthosis nigricans and skin tags as IR markers.)
22. Royal College of Obstetricians and Gynaecologists. "Polycystic Ovary Syndrome: Patient Information Leaflet." RCOG 2022. rcog.org.uk. (Plain-language clinical standard; annual blood pressure and cholesterol monitoring; UK patient-facing language.)
23. PCOS Society / Monash University. askpcos.org. (OPK unreliability in PCOS; PdG confirmation; sleep and insulin resistance; eating disorder 4× prevalence; inositol evidence base.)
24. Johns Hopkins Medicine. "PCOS Diet: What to Eat and What to Avoid." hopkinsmedicine.org. (Anti-inflammatory dietary framework; specific recommended/avoid food categories; omega-3, Vitamin D, NAC, inositol, chromium supplement guidance.)
25. Arabkermani Z et al. "Mobile Apps Designed for Patients With Polycystic Ovary Syndrome: Content Analysis Using the Mobile App Rating Scale." JMIR. 2025;27:e71118. DOI: 10.2196/71118. PMC12187023. (Every existing PCOS app scores lowest on engagement and evidence-based information quality.)
