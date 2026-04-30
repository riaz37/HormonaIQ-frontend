# HormonaIQ Feature Research
## Hormonal Health Tracking App — Clinical & Competitive Intelligence

**Research Date:** April 26, 2026
**Purpose:** Define the feature set for HormonaIQ targeting women with PMDD, PCOS, perimenopause, and the ADHD-hormone intersection.

---

## Table of Contents

1. [PMDD — Premenstrual Dysphoric Disorder](#1-pmdd)
2. [PCOS — Polycystic Ovary Syndrome](#2-pcos)
3. [Perimenopause](#3-perimenopause)
4. [ADHD & the Hormone Intersection](#4-adhd--the-hormone-intersection)
5. [Existing App Competitive Audit](#5-existing-app-competitive-audit)
6. [Privacy Architecture](#6-privacy-architecture)
7. [Cross-Condition Feature Gaps — Master List](#7-cross-condition-feature-gaps--master-list)

---

## 1. PMDD

### (a) What to Track — Clinical Standard

The gold-standard diagnostic instrument is the **DRSP (Daily Record of Severity of Problems)**, developed to satisfy DSM-5 PMDD diagnostic criteria. It is required to be completed prospectively for **at minimum 2 menstrual cycles**. Retrospective recall is considered clinically unreliable.

**The 11 DRSP Symptom Domains (rated daily on a 1–6 scale, 1 = Not at all, 6 = Extreme):**

| # | Symptom | Category |
|---|---------|----------|
| 1 | Depressed mood or hopelessness | Mood (core) |
| 2 | Anxiety or tension | Mood (core) |
| 3 | Mood swings / sensitivity to rejection | Mood (core) |
| 4 | Anger, irritability, or increased interpersonal conflict | Mood (core) |
| 5 | Decreased interest in usual activities | Behavioral |
| 6 | Difficulty concentrating | Cognitive |
| 7 | Fatigue or low energy | Physical |
| 8 | Changes in appetite (overeating, cravings) | Physical |
| 9 | Sleep changes (hypersomnia or insomnia) | Physical |
| 10 | Feeling overwhelmed or out of control | Psychological |
| 11 | Physical symptoms: breast tenderness, bloating, joint/muscle pain, headaches | Physical |

**DSM-5 Diagnosis Criteria (tracked via DRSP):**
- At least 5 symptoms present in final week before menses
- At least 1 must be a core mood symptom (symptoms 1–4)
- Symptoms improve within a few days of period onset
- Minimal or absent symptoms in week post-menses (confirming cyclical pattern, not baseline mood disorder)
- Symptoms cause clinically significant distress or functional impairment

**Additional validated tools:**
- **MDQ (Menstrual Distress Questionnaire)** — 47-item scale across 8 subgroups: pain, concentration, behavioral change, autonomic reactions, water retention, negative affect, arousal, control
- **MEDI-Q (updated MDQ)** — validated English version with Cronbach's alpha = 0.84 and ICC = 0.95; rated superior for clinical and research use
- **C-PASS (Carolina Premenstrual Assessment Scoring System)** — algorithmic scoring system for DSM-5 PMDD diagnosis from prospective diary data

**ACOG 2023 Guidelines** confirm: symptom tracking apps are an acceptable clinical documentation method when they capture daily, prospective, severity-rated symptom data across 2+ cycles.

### (b) Why It Matters Clinically

- PMDD affects approximately 5.5% of menstruating women (3–8% in broader estimates)
- Diagnosis requires prospective daily tracking — no blood test exists
- Misdiagnosis as generalized anxiety, MDD, or borderline personality disorder is common without documented cyclical pattern
- 46% of women with ADHD also have PMDD (see Section 4)
- Suicidal ideation is elevated in PMDD; severity documentation is critical for treatment escalation
- Treatment decisions (SSRIs luteal-phase dosing, combined oral contraceptives, GnRH agonists) depend on documented symptom severity

### (c) What Existing Apps Miss

**All major apps (Clue, Flo, Stardust, Eve):**
- Do not implement the full DRSP protocol (11 specific items, 6-point scale, 2-cycle minimum)
- Do not distinguish between "mood today" and clinically-validated PMDD symptom domains
- Clue and Flo use binary or 3-point scales rather than 1–6 clinical severity scales
- None produce a shareable clinical report formatted for physician review
- None alert users when their symptom pattern meets DSM-5 PMDD criteria thresholds
- None track the post-menstrual remission window (required for diagnosis)
- Apps assume regular 28-day cycles — PMDD patients often have variable cycle lengths

**From user-centered design research (JMIR 2024):**
- Users found apps tracked "are you happy or sad" — not severity-rated clinical domains
- Only one daily entry allowed in most apps — users need multiple entries or editability
- No app explains *why* symptoms occur in relation to cycle phase
- No therapeutic elements: journaling, psychoeducation, crisis support links

### (d) Product Feature Recommendations — PMDD Module

**Feature: DRSP-Compliant Daily Tracker**
- 11 DSM-5 PMDD symptom domains, each rated on a 1–6 Likert scale
- Accepts multiple daily entries or allows editing within 24 hours
- Tracks post-menstrual remission window automatically
- Visual flag when 5+ symptoms hit threshold (3 or above) in luteal phase

**Feature: 2-Cycle Diagnostic Report**
- After 2 cycles of consistent tracking, generate a physician-shareable PDF
- Report includes: day-by-day symptom severity graph, luteal vs. follicular comparison, remission confirmation, DSM-5 criteria checklist status
- Format mirrors what a psychiatrist or OB-GYN needs to initiate treatment

**Feature: Cyclical Pattern Explainer**
- Each day: brief in-app explanation of which hormone is doing what and how it connects to logged symptoms
- Estrogen drop at ovulation, progesterone peak in mid-luteal, estrogen-progesterone crash pre-menses — visualized in plain language

**Feature: Crisis Support Integration**
- When severity scores spike above 5 in any mood domain for 3+ consecutive days: soft nudge to crisis resources, IAPMD hotline, and prompt to contact healthcare provider
- Non-alarmist tone: "It looks like this may be a hard few days. Here are some things that might help."

**Feature: Remission Confirmation Window**
- 7-day post-period low-symptom tracker
- Required for PMDD differentiation from persistent mood disorder
- If user does NOT show remission: prompt to share data with clinician for alternative diagnosis exploration

---

## 2. PCOS

### (a) What to Track — Clinical Standard

PCOS is a metabolic, endocrine, and reproductive condition. It has **3 phenotypes** (Rotterdam criteria require 2 of 3):
1. Oligo/anovulation (irregular or absent periods)
2. Clinical/biochemical hyperandrogenism
3. Polycystic ovarian morphology (ultrasound)

**Daily/Weekly Symptom Tracking:**

| Category | Specific Symptoms |
|----------|------------------|
| Menstrual | Cycle length, irregularity, flow heaviness, spotting, anovulatory cycles |
| Androgen-related | Acne (location + severity), hirsutism (chin, chest, abdomen, inner thighs), hair thinning/loss (vertex scalp), skin darkening (acanthosis nigricans) |
| Metabolic | Energy levels, sugar cravings, post-meal fatigue/brain fog, weight fluctuations, hunger/satiety patterns |
| Mood & Cognitive | Anxiety, depression, irritability, brain fog |
| Reproductive | Fertile window signs, ovulation prediction (LH surge), cervical mucus |
| Physical | Bloating, pelvic pain, sleep quality, exercise tolerance |

**Lab Values That Require Tracking (periodic, not daily):**

| Biomarker | Normal Range | PCOS Signal | Frequency |
|-----------|-------------|-------------|-----------|
| LH:FSH ratio | ~1:1 | >2:1 or 3:1 in PCOS | Every 3–6 months |
| Total testosterone | 6–86 ng/dL | Elevated | Every 3–12 months |
| Free testosterone | 0.7–3.6 pg/mL | Elevated | Every 3–12 months |
| DHEA-S | 35–430 μg/dL | >200 μg/dL common in PCOS | Every 6–12 months |
| SHBG (Sex Hormone-Binding Globulin) | 16–120 nmol/L | Low in PCOS | Every 6–12 months |
| Fasting insulin | <25 mIU/L | Elevated | Every 6–12 months |
| HOMA-IR | <2.0 | >2.5 indicates IR (European threshold: >2.038) | Every 6–12 months |
| AMH (Anti-Müllerian Hormone) | 1.0–3.5 ng/mL | Elevated in PCOS | Annual |
| Fasting glucose | 70–100 mg/dL | Elevated | Every 6–12 months |
| HbA1c | <5.7% | 5.7–6.4% = pre-diabetes risk | Annual |
| Androstenedione | 0.7–3.1 ng/mL | Elevated | Every 6–12 months |
| TSH, Prolactin | Normal range varies | Rule out thyroid/prolactin causes | At diagnosis + annually |

**2023 International PCOS Guidelines** recommend:
- Metabolic risk assessment for ALL women with PCOS regardless of BMI (lean PCOS is common)
- Universal OGTT (Oral Glucose Tolerance Test) periodically, even without classic risk factors
- Lifestyle tracking (diet, exercise) as first-line intervention documentation
- Sample timing for labs: fasting, morning, menstrual cycle days 5–9 if regular cycles

### (b) Why It Matters Clinically

- PCOS affects 8–13% of women of reproductive age globally — the most common hormonal condition in this group
- Insulin resistance is present in 65–70% of women with PCOS regardless of BMI
- Unmanaged insulin resistance leads to type 2 diabetes (risk 5–10x higher), cardiovascular disease, and metabolic syndrome
- Androgen symptoms (acne, hirsutism) are major quality-of-life drivers — often the primary presenting complaint
- Fertility impact is significant: PCOS is the most common cause of anovulatory infertility
- Mental health: women with PCOS have 4x higher prevalence of anxiety and depression than women without

### (c) What Existing Apps Miss

- No app correlates symptom flares (acne, energy, mood) with specific hormonal markers
- No app has a lab value input vault — users have to manually note results in generic notes
- No CGM (Continuous Glucose Monitor) integration — CGM data is the most actionable insulin resistance signal but no period app integrates it
- Existing apps do not distinguish between PCOS phenotypes (which have different tracking needs)
- No app tracks androgen symptoms systematically (acne severity, hirsutism growth patterns)
- No app connects food logging to insulin response proxies (energy crashes, cravings, sleep disruption)
- PCOS women often have irregular cycles — all major apps fail or degrade substantially with irregular cycle inputs
- No app has a lab reminder system aligned to PCOS monitoring schedules

### (d) Product Feature Recommendations — PCOS Module

**Feature: PCOS Phenotype Onboarding**
- At setup: ask if they have been diagnosed (or suspect) PCOS
- Identify which Rotterdam criteria apply: irregular cycles / androgen symptoms / ultrasound finding
- Customize tracking module to their phenotype — lean PCOS metabolic focus vs. androgen-dominant focus

**Feature: Androgen Symptom Tracker**
- Acne: log location (jawline, chin, back, chest) + severity (1–5 scale) + photo journal option
- Hirsutism: track hair growth by body zone, rated on modified Ferriman-Gallwey scale (clinical standard)
- Hair loss: vertex thinning tracking, hair shedding count (optional)
- Acanthosis nigricans: skin darkening self-report

**Feature: Metabolic Snapshot**
- Daily: energy post-meal (log within 2 hours of eating), sugar cravings intensity (1–5), post-meal brain fog
- Weekly: fasting energy upon waking, weight trend
- Proxies for insulin resistance that don't require a CGM

**Feature: Lab Vault**
- Input and store PCOS-relevant lab results with date
- App interprets values in plain language: "Your LH:FSH ratio is 3.2:1 — this is above the PCOS threshold of 2:1. Here's what that means."
- Tracks trends over time, flags improvements or deterioration
- Smart reminders: "It's been 6 months since your last testosterone test — your doctor may want to recheck."

**Feature: CGM Integration (v2)**
- Connect Dexterity/Levels/Abbott Libre data
- Overlay glucose curves against cycle phase, symptom days, and food logs
- Insight engine: "On day 18 of your cycle (high-progesterone phase), your post-meal glucose spikes were 40% higher than in your follicular phase."

**Feature: Irregular Cycle Mode**
- Does not assume a 28-day cycle
- Learns each individual's cycle variability
- Tracks anovulatory cycles vs. ovulatory cycles separately
- Does not penalize or confuse users with "your cycle is late" alerts when they have chronic irregularity

---

## 3. Perimenopause

### (a) What to Track — Clinical Standard

**The 34 Symptoms of Perimenopause (clinically recognized):**

| Category | Symptoms |
|----------|----------|
| Vasomotor | Hot flushes, night sweats |
| Sleep & Cognitive | Sleep disturbances, brain fog, difficulty with word retrieval, memory problems |
| Reproductive & Sexual | Vaginal dryness, decreased libido, irregular periods, heavy periods, painful periods |
| Gastrointestinal | Bloating, digestive issues |
| Musculoskeletal | Hair loss, weight gain, bone loss, muscle and joint pain, nail changes |
| Cardiovascular & Neurological | Dizziness, irregular heartbeat (palpitations), headaches, tinnitus |
| Urinary & Bladder | Urinary incontinence, UTIs, bladder symptoms |
| Mood & Mental Health | Mood swings and irritability, anxiety and panic attacks, loss of confidence |
| Breast & Oral | Breast pain, gum and dental issues |
| Dermatological | Formication (crawling skin sensation), burning mouth syndrome, skin and hair changes |
| Immune | Changes to immune system response |

**Validated Clinical Tools:**

**Greene Climacteric Scale (GCS):**
- 21-item self-administered questionnaire
- Likert scale: 0 (Not at all) to 3 (Extremely)
- Six subscores: Psychological, Anxiety, Depressed Mood, Vasomotor, Somatic, Sexuality
- Limitation: Does not cover vaginal/urinary symptoms (a known gap)
- Used globally in both clinical practice and research

**Everyday Memory Questionnaire-Revised (EMQ-R):**
- Best-available validated tool for self-reported cognitive symptoms
- EMQ-R retrieval subscale specifically identifies menopause-related memory retrieval dysfunction
- Important caveat: No validated, perimenopause-specific cognitive tool exists yet (active research gap as of 2026)

**Hot Flash Timing (Clinical Research finding, 2024):**
- 59% of nocturnal hot flashes occur in the second half of the night (during REM sleep)
- Second-half-of-night hot flashes carry significantly higher cardiovascular risk than first-half
- Doctors specifically want data on: timing of night sweats, wake frequency, heart rate during events

**Perimenopause Staging (STRAW+10 Framework):**
Doctors use menstrual irregularity as the primary staging marker:
- Early perimenopause: cycle length varies ±7 days from baseline
- Late perimenopause: 2+ skipped cycles, >60-day gaps
- Postmenopause: 12+ months without a period

### (b) Why It Matters Clinically

- Perimenopause begins 2–10 years before menopause, typically starting in mid-40s (sometimes late 30s)
- 1 billion women globally will be in perimenopause/menopause by 2025
- Brain fog and cognitive symptoms affect 44–62% of perimenopausal women; most are not warned this is hormonal
- Hot flashes with nocturnal timing are linked to worsened cardiovascular outcomes (2024 research)
- Sleep disruption compounds all other symptoms exponentially
- HRT (Hormone Replacement Therapy) effectiveness is poorly tracked — women don't know if their treatment is working
- Most women see 3–7 doctors before receiving a perimenopause diagnosis
- Symptom burden correlates with estrogen decline rate, not absolute level — rate of change tracking matters

### (c) What Existing Apps Miss

**Balance App (menopause-focused):** Content-heavy, no systematic daily symptom tracking against clinical scales

**Flo for Perimenopause:** Launched 2025, uses proprietary "Perimenopause Score" — not mapped to GCS or any clinically validated scale; content-forward, not tracking-forward

**Natural Cycles NC° Perimenopause:** Allows symptom logging and cycle report downloads but not built around perimenopause-specific symptom taxonomy; strength is BBT/cycle data, not symptom severity

**Health & Her:** Calendar-based daily log, physician-reviewed content — but no GCS-based scoring, no hot flash timing analysis, no cardiovascular risk flag

**Universal Gaps:**
- No app implements Greene Climacteric Scale or any validated perimenopause scoring tool
- No app distinguishes hot flash timing (time-of-night data) for cardiovascular risk awareness
- No app tracks the rate of estrogen decline (cycle interval changes as a proxy)
- No app has an HRT effectiveness tracker: "Here's how your hot flash frequency changed after starting HRT"
- No cognitive tracking beyond generic "brain fog yes/no"
- Vaginal/urinary symptoms (GSM — Genitourinary Syndrome of Menopause) are missing from most apps, despite being a top quality-of-life issue

### (d) Product Feature Recommendations — Perimenopause Module

**Feature: GCS-Based Weekly Assessment**
- 21 Greene Climacteric Scale items, rated 0–3
- Generates 6 subscores (Vasomotor, Anxiety, Depressed Mood, Somatic, Sexuality, Psychological)
- Tracks score trajectory over months — visualizes symptom burden improving or worsening
- Exportable as a clinical report for OBGYN or menopause specialist

**Feature: Hot Flash Logger with Timing**
- Each hot flash / night sweat: log time, intensity (1–5), duration (minutes), associated wake
- Automatic detection of second-half-of-night events (clinically significant for cardiovascular risk)
- Weekly summary: "7 hot flashes this week — 5 occurred after 3am (the higher-risk window). Consider discussing this pattern with your doctor."

**Feature: HRT Effectiveness Tracker**
- When user enters that they've started HRT (type, dose, route): create baseline week
- Weekly comparison: hot flash frequency, sleep wake count, mood score, libido before vs. after
- Plain-language insight: "Week 6 on estradiol patch: your night sweat frequency is down 64% vs. your pre-HRT baseline."
- Shareable treatment response graph for physician visits

**Feature: Perimenopause Stage Identifier**
- Tracks cycle interval changes over time
- Automatically flags transition from early to late perimenopause based on STRAW+10 criteria
- Tells user: "Your cycles have become irregular by more than 7 days — this is a hallmark of early perimenopause. Here's what to expect next."

**Feature: Cognitive Symptom Tracker (Brain Fog Module)**
- Daily: word-finding difficulty (yes/no + notes), working memory lapses (scale 1–5), concentration difficulty
- Adapted from EMQ-R retrieval subscale items
- Correlates cognitive symptom days with sleep quality, hot flash frequency, and cycle phase
- Insight: "Your brain fog scores are consistently higher on days following 3+ night sweats."

**Feature: GSM (Vaginal/Urinary) Tracker**
- Tracks: vaginal dryness, pain with sex, UTI frequency, bladder urgency, incontinence episodes
- Sensitive, private interface (separate from main dashboard if user chooses)
- Correlates with HRT use and local estrogen therapy effectiveness

---

## 4. ADHD & the Hormone Intersection

### (a) What to Track — Clinical Standard

**The Science (2023–2026 Research Basis):**

- Estrogen is a dopamine amplifier: higher estrogen = more dopamine availability = better ADHD symptom control
- The follicular phase (rising estrogen, pre-ovulation) is typically the "best functioning" period for ADHD women
- The luteal phase (post-ovulation, progesterone dominance, estrogen decline) is typically when ADHD symptoms worsen
- The perimenstrual phase (estrogen-progesterone crash) is the worst functioning window
- 46% of women with ADHD also meet criteria for PMDD — the overlap is not coincidental; both conditions are driven by dopaminergic dysregulation worsened by hormonal flux
- 2024 published research (Journal of Women's Health): women with PMDD have significantly higher rates of comorbid ADHD and higher inattention scores across the entire cycle, not just premenstrually

**Cycle Phase Effects on ADHD:**

| Phase | Hormones | ADHD Effect |
|-------|----------|-------------|
| Menstruation (days 1–5) | Low E, low P | Moderate-to-severe symptoms, medication may feel less effective |
| Follicular (days 6–13) | Rising E | Best focus, productivity, medication works optimally |
| Ovulation (day 14 approx) | E peak, LH surge | Peak cognitive function, executive function best |
| Early luteal (days 15–21) | E + P rising | Mild worsening begins |
| Late luteal (days 22–28) | E drops sharply, P drops | Severe ADHD symptoms, medication effectiveness lowest, emotional dysregulation peaks |

**What to Track Daily:**
- Executive function: task initiation (1–5), sustained attention (1–5), working memory (1–5), impulse control (1–5)
- Emotional dysregulation: rejection sensitivity, irritability, emotional lability (1–5)
- Medication effectiveness: "Did your medication feel like it worked today?" (Yes / Partially / No)
- Dose notes: if dose was adjusted, what change was made
- Productivity output: estimated task completion vs. normal baseline
- Sleep: onset difficulty, total hours, quality

**Tracking Purpose:**
1. Map symptom pattern to cycle phase (confirm ADHD-hormone link)
2. Build case for cycle dosing conversation with prescriber
3. Document premenstrual ADHD worsening (grounds for PMDD co-diagnosis if applicable)
4. Track medication effectiveness systematically across cycle phases

### (b) Why It Matters Clinically

- Female ADHD is massively underdiagnosed — women are diagnosed on average 5–7 years later than men
- ADHD in women is frequently masked until hormonal fluctuations (periovulatory estrogen drops, perimenopause) unmask it
- Stimulant medications (amphetamine/methylphenidate) interact with estrogen: they are more effective when estrogen is high
- **Cycle dosing** (increasing stimulant dose in the luteal phase) is an emerging, evidence-based strategy — 9-patient case study showed all 9 experienced improved ADHD and mood symptoms with luteal dose elevation
- Without tracking, women and their prescribers cannot identify the hormonal contribution to poor medication response
- Perimenopause often triggers ADHD diagnosis for the first time, as estrogen decline permanently lowers dopamine availability

### (c) What Existing Apps Miss

- No period tracking app tracks ADHD symptoms or executive function
- No app tracks medication effectiveness in relation to cycle phase
- No app produces a physician-shareable luteal-phase ADHD severity report
- Apps that do track mood (Clue, Flo) use generic "mood" tags — not ADHD-specific domains (inattention, hyperactivity, emotional dysregulation, rejection sensitivity)
- No app surfaces the estrogen-dopamine connection to the user as an explanation for their experience
- The ADHD community (ADDitude Magazine readership, CHADD) is actively searching for this — no product has served them yet

### (d) Product Feature Recommendations — ADHD Module

**Feature: Executive Function Daily Check-in**
- 5 ADHD-specific dimensions tracked daily:
  1. Task initiation ("How hard was it to start tasks today?") — 1–5
  2. Sustained attention ("How long before your focus broke?") — 1–5
  3. Working memory ("Did your memory feel sharp?") — 1–5
  4. Impulse control ("Did you say/do things you regretted?") — 1–5
  5. Emotional regulation ("Did emotions feel bigger than the situation?") — 1–5
- Time commitment: 60 seconds max

**Feature: Medication Response Tracker**
- Daily: "Did your medication work today?" (Yes / Partial / No / Didn't take)
- Optional: current dose, time taken, brand
- Algorithm maps medication effectiveness to cycle phase over 2+ cycles
- Output: "Your medication is 40% less effective in your late luteal phase (days 22–28)"

**Feature: Cycle Dosing Conversation Starter**
- After 2 cycles of confirmed luteal-phase medication underperformance:
  Generate a PDF titled "Luteal Phase ADHD Symptom Report" with:
  - Phase-by-phase medication effectiveness scores
  - Executive function scores by cycle phase
  - Research citation on cycle dosing (PMC10751335)
  - Suggested discussion points for prescriber
  - Clear language: "Premenstrual dose adjustment is supported by clinical research. This report is for your doctor."

**Feature: ADHD-PMDD Overlap Detector**
- When user tracks both ADHD module + DRSP symptoms:
  - Identify whether premenstrual symptoms include both mood (PMDD domain) and cognitive/executive function (ADHD domain) spikes
  - Surface the co-occurrence: "Research shows 46% of women with ADHD also experience PMDD. Your tracking pattern is consistent with this overlap."

**Feature: Phase-Aware Scheduling Insight**
- Based on cycle phase: daily "energy forecast" for the user
  - Follicular: "High-focus window. Good day for deep work, learning, and decisions."
  - Ovulation: "Peak cognitive performance. Schedule important conversations or creative work."
  - Late luteal: "Executive function is typically lower in this phase. Use lists, reduce decision load, tell your support network."
- Not patronizing, just informational

---

## 5. Existing App Competitive Audit

### Clue (helloclue.com)
**What it does well:**
- 200+ trackable factors across mood, sleep, skin, cravings, energy, sex drive
- Wearable integration (Oura, WHOOP, Fitbit) for sleep/temperature/heart rate
- Premium: 10 tracking categories, unlimited custom tags
- Science-backed content, Berlin-based, strong reputation for data integrity
- New: Leisure, PMS, and Spotting tracking categories (2025 redesign)

**Critical gaps for HormonaIQ's target users:**
- No DRSP-compliant PMDD tracking (no clinical severity scale)
- No physician-report generation
- No ADHD symptom tracking
- No PCOS lab value vault
- No perimenopause-stage identification or GCS scoring
- No HRT effectiveness tracking
- No condition-specific modules — all conditions treated as generic symptom lists

**Privacy:** Strong — Clue is GDPR-compliant, Berlin-based, has not been involved in FTC data sale actions. No anonymous mode required (data held in EU).

---

### Flo (flo.health)
**What it does well:**
- 380M+ downloads, 70M monthly active users — largest player
- "Flo for Perimenopause" launched 2025 with proprietary Perimenopause Score
- AI health assistant, expert-led video courses
- Anonymous mode (added post-Roe v. Wade)
- PCOS/endometriosis symptom checker (educational, not diagnostic)

**Critical gaps:**
- Flo's "Perimenopause Score" is proprietary — not mapped to GCS or any validated clinical instrument
- No DRSP tracking — PMDD is addressed via generic "PMS" tags
- No ADHD module
- No PCOS lab tracking
- No physician-shareable clinical reports
- Settled FTC action 2021: shared health data with Facebook and Google analytics after promising privacy
- Meta found liable by jury (August 2025) for collecting Flo user health data via SDK without consent
- Premium costs ~$80/year

---

### Natural Cycles (naturalcycles.com)
**What it does well:**
- FDA-cleared contraceptive app — highest regulatory bar in this category
- BBT-based algorithm, LH strip integration, wearable temperature sync (Oura, Apple Watch, Garmin)
- NC° Perimenopause mode launched
- Downloadable Cycle Report for physician visits
- Research-grade temperature data

**Critical gaps:**
- Primary use case is contraception/fertility — symptom tracking is secondary
- No condition-specific modules for PMDD, PCOS, ADHD
- Perimenopause mode tracks cycles but not 34-symptom clinical taxonomy
- No lab value input
- Requires thermometer purchase (~$20) or compatible wearable

---

### Stardust (stardust.app)
**What it does well:**
- First period app with end-to-end encryption
- Privacy-first positioning — strong trust signal post-Dobbs
- Shows estimated estrogen/progesterone curves daily (educational)
- Moon cycle syncing (unique niche — spiritual/wellness angle)
- Social sharing with friends/partner for luteal phase awareness
- Free tier is generous

**Critical gaps:**
- Hormone curves are estimated, not personalized to actual hormone levels
- No clinical-grade PMDD tracking
- No PCOS, perimenopause, or ADHD modules
- Symptom tracking is basic (mood and physical symptoms, no severity scales)
- Astrology focus limits clinical credibility for medical users

---

### Eve by Glow (glowing.com)
**What it does well:**
- 20+ daily symptom tracking with visual charts
- Community features, sex-positive framing
- BBT and OPK charts available

**Critical gaps:**
- Privacy red flag: Mozilla Foundation gave it a poor privacy rating; data shared with vague "affiliates"
- No clinical condition support
- GlowGPT (AI assistant) is US-only
- Surface-level education; not medically rigorous
- Lowest clinical credibility of the major apps

---

### Belle Health (bellehealth.co) — PMDD-Focused
**What it does well:**
- Built specifically for PMDD
- Uses DRSP framework
- Connects users to PMDD treatment guidelines

**Critical gaps:**
- PMDD-only — does not support PCOS, perimenopause, ADHD
- Small user base, limited feature depth
- No physician report generation confirmed
- No medication tracking

---

### Hormona (hormona.io)
**What it does well:**
- Hormone-focused branding (closest competitor to HormonaIQ concept)
- At-home hormone testing integration (15-minute lab-grade results)
- Available in 185+ countries
- Covers perimenopause life stage

**Critical gaps:**
- Supports cycles 21–38 days only — excludes women with PCOS-driven irregular cycles
- No PMDD-specific DRSP tracking
- No ADHD module
- No PCOS phenotype support confirmed
- At-home testing adds friction and cost

---

### Competitive Summary Table

| Feature | Clue | Flo | Natural Cycles | Stardust | Belle | Hormona | **HormonaIQ Opportunity** |
|---------|------|-----|----------------|----------|-------|---------|--------------------------|
| DRSP PMDD tracking | No | No | No | No | Partial | No | **Full DRSP** |
| Physician PDF report | No | No | Partial | No | No | No | **Full clinical export** |
| PCOS phenotype module | No | No | No | No | No | No | **Yes** |
| Lab value vault | No | No | No | No | No | No | **Yes** |
| Perimenopause GCS scoring | No | No | No | No | No | No | **Yes** |
| HRT effectiveness tracker | No | No | No | No | No | No | **Yes** |
| ADHD executive function | No | No | No | No | No | No | **Yes** |
| Medication cycle tracking | No | No | No | No | No | No | **Yes** |
| E2E encryption / local data | No | No | No | Yes | Unknown | No | **Yes** |
| Irregular cycle support | Partial | Partial | Partial | Partial | No | No | **Full** |

---

## 6. Privacy Architecture

### The Problem

**FTC Action — Flo Health (2021):**
Flo settled FTC allegations that it shared health data with Facebook, Google, AppsFlyer, and Flurry despite promising user privacy. The data included pregnancy status and menstrual health information. Settlement required affirmative user consent before sharing and independent privacy audit.

**Meta/Flo Jury Verdict (August 2025):**
A U.S. jury found Meta liable for collecting Flo Health user data via Meta's SDK without informed consent. The data was used in Meta's advertising business. Judgment confirmed that period tracking health data is treated as sensitive personal information with legal protection.

**UK Police Guidance (December 2024):**
UK police guidance allows checking fertility trackers and search history on digital devices following unexpected pregnancy loss — making local data storage a legal protection strategy, not just a privacy preference.

**Post-Dobbs Reproductive Rights Context:**
In states with abortion restrictions, period tracking data can be used as legal evidence. Data stored server-side by any US-based company can be subpoenaed. If an app provider does not hold the data, there is nothing to hand over.

### Privacy-First Architectures in the Market

**Stardust:** First period app with end-to-end encryption. Data encrypted on device, not readable by Stardust servers.

**Drip, Euki, Periodical:** Store all data locally on device, no account required, no third-party data sharing.

**Apple Health Cycle Tracking:** When 2FA is enabled, data is end-to-end encrypted in iCloud. Apple does not hold the decryption key.

**Monthly (by Elizabeth Ha):** All health data stored privately on device, never enters a database, deletable at any time.

### HormonaIQ Privacy Architecture Recommendations

**Feature: Device-First Data Storage**
- All health data stored on-device by default
- Server sync is opt-in only, never required for app functionality
- If server sync is enabled: end-to-end encrypted (zero-knowledge architecture — server cannot read data)
- No health data sent to analytics SDKs (Meta Pixel, Google Firebase, AppsFlyer) — these are the exact SDKs that caused the Flo liability

**Feature: No Account Required for Core Features**
- Full PMDD, PCOS, perimenopause, and ADHD tracking available with no sign-up
- Account needed only for cross-device sync
- Account creation uses anonymous sign-in option (email-free, generates random ID)

**Feature: Data Deletion That Actually Works**
- One-tap deletion of all health data
- Confirmation that deletion is immediate and permanent (no 30-day retention)
- Export before deletion: allow user to download their full dataset before wiping

**Feature: Transparent Data Dictionary**
- In-app privacy dashboard shows exactly: what data is collected, where it is stored, who can access it, and what would happen under a law enforcement request
- "If we received a subpoena, here is what we would have to give them: [nothing — your data is not on our servers]"

**Feature: Legal Jurisdiction Awareness (v2)**
- Based on user's location: flag relevant data protection laws (EU: GDPR, US: state-by-state)
- In high-risk US states (abortion-restrictive states): proactive prompt to enable device-only mode

**Compliance Checklist for Build:**
- [ ] No Meta SDK, Google Analytics SDK, or advertising SDK integrated
- [ ] HIPAA-aware data handling (not technically a HIPAA-covered entity, but follow the same standards)
- [ ] GDPR compliant (required for EU users)
- [ ] Privacy policy reviewed by a lawyer before launch
- [ ] FTC Act Section 5 compliance (do not promise privacy and then share data)

---

## 7. Cross-Condition Feature Gaps — Master List

These are the features that NO existing app provides and that represent HormonaIQ's core differentiation:

### Diagnostic-Grade Tracking (vs. Wellness Tracking)
1. **DRSP-compliant PMDD tracker** — 11 DSM-5 symptoms, 1–6 scale, 2-cycle protocol, remission window, clinical report export
2. **Greene Climacteric Scale weekly assessment** — 21 items, 6 subscores, trend tracking, export
3. **Ferriman-Gallwey androgen symptom scale** — hirsutism and androgen symptom severity for PCOS

### Physician Communication Tools
4. **2-Cycle Diagnostic PDF** — PMDD diagnosis support document for physicians
5. **Perimenopause GCS Report** — exportable trend data on 6 symptom domains
6. **Luteal Phase ADHD Report** — medication effectiveness + executive function data for prescribers
7. **PCOS Lab Trend Summary** — structured lab history organized by marker with date and trajectory

### PCOS Metabolic Features
8. **Lab Value Vault** — structured input for all PCOS-relevant biomarkers, plain-language interpretation, smart reminders
9. **Irregular Cycle Mode** — full app functionality without assuming regular cycles
10. **CGM integration** — continuous glucose monitor data overlay with cycle phase (v2)
11. **Androgen symptom tracker** — acne location/severity, hirsutism by zone, hair shedding

### ADHD Features (unique in market)
12. **5-dimension executive function daily check-in** — initiation, attention, memory, impulse control, emotional regulation
13. **Medication effectiveness tracker** — daily log correlated to cycle phase over 2+ cycles
14. **Cycle dosing conversation generator** — phase-based medication efficacy report for prescriber
15. **ADHD-PMDD overlap detector** — identifies co-occurrence pattern, surfaces research to user

### Perimenopause Features
16. **Hot flash timing tracker** — time-of-night logging, second-half-night cardiovascular risk flagging
17. **HRT effectiveness tracker** — before/after symptom frequency comparison since HRT start
18. **Perimenopause stage identifier** — STRAW+10 criteria applied to cycle interval changes
19. **GSM (vaginal/urinary) tracker** — discreet, private tracking of genitourinary symptoms often absent from all apps
20. **Brain fog/cognitive symptom tracker** — EMQ-R adapted items correlated to sleep, hot flashes, and cycle phase

### Privacy Architecture
21. **Device-first storage with E2E encrypted optional sync** — zero-knowledge server architecture
22. **No-account core features** — full tracking without email or identity
23. **Genuine data deletion** — confirmed immediate, permanent, with export option
24. **Transparent data dictionary** — in-app legal exposure explainer

### Cross-Condition Features
25. **PMDD + ADHD overlap module** — co-tracking and co-detection (46% comorbidity rate)
26. **Multi-condition profile** — user can be in PCOS + perimenopause simultaneously, app handles both
27. **Cycle phase daily explainer** — plain language hormone status + how it connects to their logged symptoms

---

## Clinical Sources Referenced

- ACOG Clinical Practice Guideline: Management of Premenstrual Disorders (December 2023)
- IAPMD: Daily Record of Severity of Problems (DRSP) — iapmd.org/drsp
- DSM-5 PMDD Diagnostic Criteria — APA
- Endicott J et al. "Daily Record of Severity of Problems (DRSP): reliability and validity" — PubMed PMID 16172836
- Marjoribanks J et al. MEDI-Q English validation — Gynecological Endocrinology (2023)
- PMC10872410 — "Attention-Deficit/Hyperactivity Disorder and the Menstrual Cycle: Theory and Evidence" (2024)
- PMC10751335 — "Female-specific pharmacotherapy in ADHD: premenstrual adjustment of psychostimulant dosage" (2024)
- PMC7617793 — "Increased risk of provisional PMDD among women with ADHD"
- Journal of Women's Health 2024: "Comorbid ADHD in Women with PMDD"
- JMIR Formative Research 2024: "Developing a Mood and Menstrual Tracking App for People With PMDD: User-Centered Design Study" — PMC11687174
- Greene JG. "Greene Climacteric Scale" — validated tool, used globally
- PubMed 37788429 — Everyday Memory Questionnaire-Revised in menopausal population
- Frontiers in Human Neuroscience 2026: Menopause-related brain fog digital phenotyping
- International PCOS Guidelines 2023 (Evidence-based guidelines for PCOS assessment and management)
- PMC3277302 — "All Women With PCOS Should Be Treated For Insulin Resistance"
- FTC Press Release, January 2021: Flo Health data sharing settlement
- FTC Finalized Order, June 2021: Flo Health
- TBIJ Investigation, September 2025: Meta eavesdropping on Flo Health
- Menopause Society: "Timing of Nocturnal Hot Flashes May Affect Risk of Heart Disease" (2024)
- The Menstrual Health Apps Market sizing — Grand View Research, Toward Healthcare
