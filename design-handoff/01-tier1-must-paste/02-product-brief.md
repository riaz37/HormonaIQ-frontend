# HormonaIQ — Master Product Brief
**Full Executive Team Meeting | April 25, 2026**

> This document compiles the complete output of four parallel executive working sessions. Every decision in here was debated, refined, and ratified by the team members listed. It is the single source of truth for what HormonaIQ is, what it does, and how we will bring it to market.

---

## THE TEAM

| Name | Role | Background |
|---|---|---|
| **Sarah Chen** | Chief Design Officer | 18 years. Apple (Health & Fitness), Headspace, Nike Digital. Led design for HealthKit launch. |
| **Marcus Whitfield** | Brand Director | 14 years. Designed brand systems for Spotify, Notion, Calm, Figma. Built three zero-to-product brand identities from scratch. |
| **Priya Nair** | Chief Product Officer | 16 years. Flo Health (left after data integrity conflict), Apple HealthKit, Samsung Health. Knows how period apps fail from the inside. |
| **Dr. James Okafor** | Head of User Research | PhD in HCI. 12 years. Google Health, Headspace, Apple. Interviewed 3,000+ chronic illness patients. |
| **Elena Vasquez** | Chief Marketing Officer | 15 years. Led marketing for Hims & Hers (0→public), Ritual, Noom. Positioned three health tech brands for acquisition. |
| **Ryan Park** | Head of SEO & Content | 12 years. NerdWallet (ate Bankrate's lunch), WebMD, Wirecutter. Expert in E-E-A-T health content. |
| **Diana Torres** | Head of Social & Community | 11 years. Duolingo (viral growth era), Headspace, Maven Clinic. Built health communities from 0. |
| **Alex Morgan** | Chief Technology Officer | 14 years. Stripe (payments infra), Epic Systems (EHR), Vercel. Understands HIPAA at infra level. |
| **Dr. Amara Osei** | Chief Clinical Advisor | MD/MPH. 17 years. Reproductive endocrinologist. Published PMDD research. Consults for FDA on women's health digital tools. |

---

## PART 1: BRAND IDENTITY
*Sarah Chen (CDO) + Marcus Whitfield (Brand Director)*

---

### The Brand in One Line

> **"HormonaIQ: the first app built for women who already knew."**

These women have been right about their own bodies for years. Medicine dismissed them. We don't validate them — we confirm what they already knew and give them the proof to make it undeniable.

---

### What We Are — And Are Not

| We are | We are not |
|---|---|
| A clinical tracking tool | A wellness app |
| A diagnostic ally | A period tracker |
| Medically serious | Emotionally soft |
| Built for the dismissed | Built for the average |
| Infrastructure for the healthcare system | A supplement to it |

---

### Brand Voice — Six Attributes

**Unflinching.** We don't soften clinical reality. If her symptoms meet PMDD criteria, we say so in plain language. Not "you may want to explore..." — the data shows what the data shows.

**Precise.** We use the right clinical terms with plain-language explanations alongside. No jargon without translation. No translation that loses accuracy.

**Grounded.** No hype. No exclamation points. No "you've got this!" The app is serious because the condition is serious. A woman logging symptoms at 2am during a PMDD crisis is not in the mood for a pep talk.

**Ally.** We are on her side in the medical system. Not neutral. We help her walk into a doctor's office with evidence, not apologies.

**Earned.** Trust is not claimed, it is built. Every design choice, every notification, every data display earns or loses that trust. We earn it slowly. We lose it with a single careless line of copy.

**Steady.** She has spent years in a storm of uncertainty. HormonaIQ is the calm thing that's always there, that keeps working, that doesn't make demands.

---

### What We Never Say

- "Balance your hormones" — medically meaningless, attracts the wrong audience, signals supplement-brand thinking
- "Listen to your body" — puts the burden back on her when we should be doing the work for her
- "Period tracker" — we are not Flo, we are not Clue, we do not live in that category
- Any exclamation points
- "You're not alone!" — it's true but it's cheap; show her the community, don't announce it
- "Hormone health journey" — the word journey implies leisurely progress; this is diagnosis, not a journey

---

### Emotional Territory — We Own: VINDICATION

Not joy. Not calm. Not empowerment.

**Vindication**: The specific feeling when you have been right about something for years and finally someone confirms it. Relief + righteous anger + "I KNEW IT." This emotion is social — vindication makes you want to tell someone. That is our growth loop. The DRSP chart reveal is the moment of vindication. We design everything around that moment.

---

### Color System

**Primary — Mariana**
Deep blue-green. Hex: `#1B4D5C`. Named after the Mariana Trench — the part of the ocean humans know least about. Like the female hormonal system.

Why this color: Medical without being clinical. Serious without being cold. Distinct from every competitor. Headspace owns lavender. Calm owns blue. Flo owns coral. Mariana is unowned.

**Surface Colors**
- Background (light mode): `#F7F5F1` — warm white, not clinical white
- Background (dark mode): `#0F1F26` — deep navy, not pure black
- Text primary: `#111827` — near-black
- Text secondary: `#6B7280` — muted, for non-critical information

**Semantic Colors**
- Follicular phase: `#A8C5DA` — calm blue
- Luteal phase: `#C17F5B` — amber deepening toward rust as severity increases
- Menstrual: `#8B4A6B` — muted plum
- Severity (mild): `#4CAF50` — green
- Severity (moderate): `#FF9800` — amber
- Severity (severe): `#D32F2F` — red
- Victory / milestone: `#B8860B` — earned gold. Never cheap gold. Used sparingly for: first DRSP chart generated, first doctor report exported, 30-day logging streak.

**Severity color for the calendar:** Never just color alone. Always paired with a text label. Accessibility requires both.

---

### Typography

**Headings: Söhne**
Swiss grotesque. Clinical confidence. No warmth performance. Used for: app headers, chart labels, notification headings, marketing headlines.

**Body: Tiempos Text**
Humanist serif. Readable at small sizes. Warm without being decorative. Used for: all body copy in the app, long-form educational content, email, the doctor report PDF.

**Data / Numbers: Söhne Mono**
Monospaced. For DRSP scores, lab values, cycle day numbers. Numbers that mean something look like numbers.

**Type scale** (mobile base):
- Display: 28px / Söhne Bold
- Heading 1: 22px / Söhne Semibold
- Heading 2: 18px / Söhne Medium
- Body: 16px / Tiempos Text Regular
- Caption: 13px / Söhne Regular
- Data: 14px / Söhne Mono

---

### Logo Direction

**Mark: Cell Mark**
An abstract representation of a cell in the luteal phase — a circle with an internal orbital form. Not a uterus. Not a flower. Not a lotus. A cell. Scientific. Distinctive. Works as a standalone app icon.

**Wordmark: HormonaIQ**
Set in Canela (editorial serif). The IQ is set in Söhne — a deliberate typographic shift that signals: this is intelligent, this is clinical. Two typefaces in one wordmark. The tension is intentional.

**Color application:**
- Default: Mariana mark + dark wordmark on light background
- Reversed: White mark + white wordmark on Mariana background
- App icon: Cell mark on `#1B4D5C` at full bleed

---

### Design System Principles

**1. No gamification.**
No streaks. No badges for consecutive logging. No progress bars measuring "how healthy you are." A woman who missed 3 days of logging because she was in a PMDD crisis does not need to see a broken streak. We celebrate *presence*, not *consistency*.

**Exception:** The earned gold milestone for first DRSP chart is not gamification — it is marking a real clinical achievement.

**2. Proactive, not reactive.**
The app does not wait to be asked. It shows up before she needs it. Pattern alerts surface automatically. The luteal phase warning comes 3 days before. The notification knows her cycle day. She should never have to navigate to find information she needed — it should have come to her.

**3. Density calibrated to the day.**
On a normal day: full information density. On a predicted high-severity day (or a day she reports severe symptoms): simplified mode. Fewer elements. Larger touch targets. Single primary action. The interface gets easier to use exactly when she needs it to be easiest.

**4. Clinical without being cold.**
Every design choice walks the line between medical credibility (she needs to trust that this is real) and human warmth (she needs to feel like someone built this for her). The calibration: information structure is clinical. Language is human.

**5. No unsolicited body comparison.**
We never display BMI. We never suggest a "healthy weight." We never compare her to population averages without explicit context. Her body is her reference point, not a statistical mean.

---

### Accessibility as Design Baseline

- WCAG 2.1 AA minimum on all elements
- All severity indicators use both color and text label — never color alone
- Dark mode available in onboarding (not buried in settings) — required for nausea-prone users
- Minimum touch target: 60x60px for all interactive elements
- Font scaling support: all text scales with device accessibility settings
- Screen reader support from day one (VoiceOver + TalkBack)
- Portrait and landscape orientation both fully supported

---

## PART 2: PRODUCT STRATEGY & FEATURES
*Priya Nair (CPO) + Dr. James Okafor (Head of User Research)*

---

### Product Principle

> **"Does this help her be taken seriously by a doctor?"**

Every feature, every design decision, every notification is tested against this question. If yes — build it. If no — cut it or defer it.

---

### The Three-Screen Loop (All Modules)

Every module runs on the same underlying engine:

```
DAILY LOG → CYCLE CALENDAR → DOCTOR REPORT
```

The symptom sets differ. The clinical instruments differ. The report format differs. The engine is the same.

---

### MODULE 1: PMDD (Beachhead — Ship First)

#### Onboarding Flow (8-9 Screens)

**Screen 1 — The Opening Statement**
No logo. No splash screen. A statement:

> *"Severe mood changes before your period. Feeling like a different person for two weeks. There's a clinical diagnosis for this, and there's finally an app built around it."*

No sign-up. No email. Just "Get Started." This is a positioning statement. It tells her immediately: this app did its homework.

**Screen 2 — Account Creation**
Email + password. Before asking:
> *"We'll keep your account secure and synced across devices. We will never sell your health data."*

Google Sign-In available as secondary option — but our recommended path is email + password. The legal landscape around reproductive health data makes linking her tracking app to her Google account a privacy risk we don't want to minimize.

**Screen 3 — Condition Selection**
Four primary tiles: PMDD / PCOS / Perimenopause / Endometriosis. Hashimoto's shown as secondary option (frequently co-occurs). Multi-select allowed — because these conditions are comorbid constantly.

Secondary CTA: *"Not sure what you have? Answer a few questions and we'll help."* — This leads to a symptom-first flow for undiagnosed users. We never gatekeep by vocabulary.

**Screen 4 — Cycle Basics (PMDD Path)**
Last period start date. Cycle length selector: 21–45 days. No 28-day default. Irregular cycle checkbox — when checked, triggers: *"No problem. Our predictions improve with every cycle you log."*

What we DO NOT ask in onboarding: sexual activity, pregnancy intention, birth control method, height, weight, BMI, diet, exercise habits, relationship status, exact date of birth (we ask decade: 20s/30s/40s/50s).

**Screen 5 — DRSP Symptom Selection**
Grid of DRSP symptoms in human language (clinical term in parentheses):

- "Mood shifts that feel extreme or out of proportion" *(mood lability)*
- "Irritability or anger that feels out of character" *(irritability)*
- "Feeling depressed or hopeless" *(depression)*
- "Anxiety or tension" *(anxiety)*
- "Losing interest in things you normally enjoy" *(anhedonia)*
- "Difficulty concentrating or focusing" *(cognitive impairment)*
- "Low energy or fatigue" *(lethargy)*
- "Changes in appetite or cravings" *(appetite disturbance)*
- "Sleep too much or can't sleep" *(sleep disturbance)*
- "Feeling overwhelmed or out of control" *(sense of overwhelm)*
- Physical: bloating, breast tenderness, joint pain, headaches

She taps all that apply. These pre-populate her daily log — she won't be asked about 24 symptoms every day, only the ones she actually has.

**Screen 6 — ADHD Check**
*"Do you have ADHD or suspect you might?"*
Options: Yes / No / I think so / Not sure. Completely neutral, clinical, matter-of-fact. No chirpiness. If yes or "I think so" — ADHD medication effectiveness overlay activates.

**Screen 7 — The Immediate Insight**
Based on cycle date entered: we calculate her likely current phase and surface the first personalized insight without asking her to log a single thing.

If she's in luteal phase: *"Based on your last period on [date], you're currently around day [X] — likely in your luteal phase. This is typically when PMDD symptoms are most intense. If you're feeling [her selected symptom], that makes sense. You're in the right place."*

The phrase *"that makes sense"* is doing enormous emotional work. It may be the first time technology has validated her experience with clinical precision.

**Screen 8 — Notification Permission**
We explain before we ask:
> *"We'll remind you to log daily (takes 90 seconds), warn you 3 days before your luteal phase typically starts, and alert you when we detect a pattern worth knowing about."*

If she says no: *"No problem. You can enable this anytime in settings. You'll still get all the same features."* No friction, no punishment.

**Screen 9 — First Daily Log**
She lands directly on the daily log, pre-contextualized with her cycle day. Onboarding ends by handing her to the core experience, not a success screen.

---

#### Daily Log (The Most Important Screen)

Maximum 8 questions. Only questions relevant to what she selected in onboarding. Target: 90 seconds on average day, 15 seconds on a bad day.

**Question 1 — Overall Feeling**
Five options, words not emojis:
`Fine` / `Okay` / `Struggling` / `Really hard` / `Can't function`

Plus: a one-tap option — *"Too much to describe right now — just log that today was bad."*
This captures: date, cycle day, that a log happened, and one severity slider (1–10). The bad-day log still counts toward the DRSP chart.

**Question 2 — Cycle Day Confirmation**
Shown as a visual cycle strip, not a question. The app predicts; she confirms or corrects. Not data entry — active calibration.

**Question 3 — DRSP Symptom Ratings**
Only her selected symptoms from onboarding. Rated on the actual DRSP 1–6 scale:
`1 = not present` → `6 = severely disabling`
This is the actual clinical scale — not remapped, not approximated. When this data goes to a doctor, it is directly comparable to clinical literature.

**Question 4 — Physical Symptoms**
One multi-select: bloating / cramps / headache / breast tenderness / fatigue / joint pain / skin changes.

**Question 5 — Medication Effectiveness (ADHD users only)**
*"How well did your ADHD medication work today?"* Scale 1–5. Optional.
Tooltip: *"Estrogen affects dopamine. When estrogen drops before your period, your meds may feel less effective. We're tracking this."*

**Questions 6–8 — PMDD-specific**
Sleep quality / notable stressors / optional free-text notes.

Voice notes (not available in v1 — committed to v1.5).

---

#### Cycle Calendar

**Month view (default).** Each day color-coded by phase:
- Follicular: calm blue, deepening toward ovulation
- Luteal: amber to rust, deepening as severity typically increases
- Menstrual: muted plum

Colors updated by: (a) predicted phase and (b) what she logs. If she logs severe symptoms on a predicted low-severity day, we flag the discrepancy.

**Logged symptom dots:** Small colored dot in corner of each day. Green (mild/none) → Amber (moderate) → Red (severe). Stack up to 3 dots for multiple logged severe symptoms.

**Week view (secondary).** Next 7 days with predictions and predicted symptom intensity as a colored bar under each day. Calendar events entered manually (no calendar sync in v1 — privacy decision, not a technical deferral).

**Legend:** Always visible at the bottom. Never hidden.

---

#### DRSP Chart Auto-Generation (Killer Feature)

The DRSP (Daily Record of Severity of Problems) is the clinically validated gold standard for PMDD diagnosis. Currently: a paper PDF that women must print, fill out by hand for two months, and physically bring to an appointment. We automate it invisibly.

Every daily log entry is building the DRSP chart without her knowing. After 28 days of logging (with smart gap-filling for missed days), we surface the chart.

**The chart reveal moment — designed as a ceremony:**

Push notification: *"Your symptom chart is ready. This is what we've been building toward."*

Full-screen view: Two-month chart, follicular phase in one color, luteal phase in another. The symptom lines peak clearly in the luteal phase.

Above the chart: *"Your data shows a clear premenstrual pattern. Symptoms consistently elevated in your luteal phase and consistently lower in your follicular phase."*

Below the chart: Three buttons:
1. `Understand this chart` → 3-screen educational overlay
2. `Share with my doctor` → Doctor report generation
3. `Save for later`

**Educational overlay (3 screens):**
1. What the two phases mean for PMDD
2. What the DRSP is — *"You've completed it without even knowing"*
3. What to say to her doctor — exact language: *"I've been tracking my symptoms using a clinical tool. Here's what the data shows."*

**Data quality indicator:** The chart displays: how many days were logged, how many were estimated. Honest about its own confidence. Essential for clinical credibility.

---

#### Doctor Report PDF

Contents:
- DRSP chart (two months)
- Summary table: average symptom severity by cycle phase
- Luteal/follicular differential ratio (the ratio that makes PMDD a specific diagnosis vs. general anxiety)
- ADHD medication effectiveness data (if applicable)
- Brief clinical explainer of PMDD at top — framed as: *"Research summary included for reference"* (not as correction to the doctor)

Format: Professional, clinical, plaintext-formatted. Not branded. Not designed. Looks like a medical document.

Delivery: Email from within the app. She enters doctor's email. Subject: *"Patient Symptom Report — [Date Range] — Generated by HormonaIQ."* She receives a copy. Stored under "My Reports" indefinitely.

---

#### Pattern Detection

Activates after 14 days of logging. All patterns are derived from *her* data — never generic.

- *"Your most severe mood symptoms typically occur on days X–Y of your cycle."*
- *"Your symptom severity in the luteal phase averages [X] — significantly higher than your follicular average of [Y]. This ratio is consistent with PMDD criteria."*
- *"Over the last [N] cycles, your luteal symptoms start an average of [X] days before period onset."*

All patterns use confidence language: *"Based on your last two cycles"* — never *"you always."*

Pattern notifications: *"New insight: over your last 3 cycles, your sleep quality drops consistently 5 days before your period. Want to see the data?"*

---

#### ADHD Medication Effectiveness Overlay

The differentiating feature no app currently offers.

After 14 days with both ADHD and cycle data: correlation view showing medication effectiveness mapped against cycle phase.

If the expected pattern shows — medication less effective in luteal phase — we surface: *"Your medication appears less effective during your luteal phase (days X–Y). This is consistent with how estrogen affects dopamine availability. This information may be useful to discuss with your prescriber."*

Every medication insight has a mandatory footer: *"This is observational data for discussion with your prescriber. Do not adjust your medication based on app data alone."* No exceptions.

---

### MODULE 2: PCOS

**What's different:** PCOS onboarding diverges at the condition selection. First question:

*"Are your cycles regular, irregular, or absent?"*

Because PCOS is fundamentally about cycle irregularity — and the 28-day assumption baked into Flo and Clue is the reason 82% of PCOS users report those apps fail them.

**Irregular cycle prediction:** Bayesian model. We start with the prior she gives us (average length, variability), update with every logged period start date, and output a *probability range* — not a single day. Calendar shows: *"Your period is likely to start between May 1–8, with highest probability around May 4–5."* Uncertainty visible, not hidden.

**Ovulation tracking:** Probabilistic. We don't claim to predict ovulation without additional data. We offer optional input fields for BBT and LH strip results.

**Lab Result Tracker:** Unique to PCOS module. Tracks over time:
- Testosterone
- Fasting insulin / HOMA-IR (insulin sensitivity proxy)
- LH/FSH ratio
- AMH
- Thyroid (because Hashimoto's and PCOS co-occur frequently)

Every flag includes: *"Reference range shown is the general population range. Your doctor may have different target ranges based on your situation."*

**Symptom set (replaces DRSP for PCOS):**
Excess hair growth / acne / weight changes / fatigue / hair loss / sugar cravings / energy crashes after meals / difficulty losing weight.

---

### MODULE 3: PERIMENOPAUSE + HRT

**The user:** Typically late 30s–50s. High-functioning professional whose body is doing things she doesn't recognize. Often told she's *"too young for menopause"* when perimenopause can begin mid-30s.

**HRT Dose Log:** The centerpiece feature.
- Type: patch / pill / gel / cream / pellet / vaginal ring
- Dose in standard units
- Application site (transdermal)
- Time of administration
- Brand name and generic name (not equivalent across formulations)

**Dose vs. symptom correlation:** After 30 days on a dose:
*"Since your dose increased on [date], your hot flash frequency has decreased from [X] per day to [Y] per day."*

**Hot Flash Frequency Tracker:** One-tap button. No description required. Logs time and cycle day. Weekly view: frequency by time of day, by cycle phase, trending up or down. Ready for the doctor appointment as objective data.

**What we do not ask in perimenopause onboarding:** DRSP symptoms (not applicable). Instead: current HRT status / which symptoms are most disruptive / cycle change pattern.

**HRT + Levothyroxine interaction alert:** If she's also on Hashimoto's module (or reports levothyroxine use): *"Oral estrogen can increase your levothyroxine requirements. If you recently started or changed HRT, discuss your TSH levels with your doctor."*

---

### MODULE 4: ENDOMETRIOSIS

**The core problem:** 7–10 year average diagnosis time. Primary barrier: women cannot adequately document pain in a 15-minute appointment. HormonaIQ solves the documentation problem.

**Pain Body Map:**
Simple body outline — front / back toggle. She taps where it hurts. Dots are color-coded by intensity. She selects pain type: stabbing / cramping / pressure / burning / radiating / constant / intermittent.

Radiating pain: second tap point with dotted line between them. Clinically important for sciatic-nerve-type endo pain that radiates down the leg — often unrecognized as endometriosis.

Touch targets on this screen are extra large (minimum 70x70px) — because she may be logging during active severe pain.

**Flare Trigger Log:** What happened in the last 24 hours: specific foods (gluten, dairy, alcohol) / exercise intensity / stress / sexual activity (clearly marked as sensitive, fully optional) / cold exposure.

**Pre-Surgery Documentation Report:** Organized by pain location, frequency, and intensity rather than cycle phase. This is clinically distinct from the PMDD doctor report — built for surgical planning, not psychiatric diagnosis.

---

### MODULE 5: HASHIMOTO'S + LEVOTHYROXINE

**Medication Timing Log:** Levothyroxine must be taken first thing in the morning, 30–60 minutes before eating, away from calcium, iron, and other medications. We log: time of dose / pre-eat wait / co-administered medications and supplements.

**TSH Lab Result Tracker:** Plotted over time. Flagged when outside her personal optimal range (which she sets with doctor input — not just population reference). Tracked against dose adjustments.

**HRT + Levothyroxine Interaction Alert:** As described in Perimenopause module. The cross-condition insight that primary care doctors frequently miss.

---

### THE ADHD OVERLAY (Cross-Cutting — Not a Standalone Module)

Activates for any user who answers yes or "I think so" to the ADHD question in onboarding. Works across all 5 modules.

Tracks: ADHD medication effectiveness daily (question 5 in daily log). After 14 days: correlation view against cycle phase.

The connective tissue between psychiatry and gynecology — two specialties that almost never share patient information. The woman with PMDD and ADHD brings one HormonaIQ report to two separate appointments.

---

### PROACTIVE EXPERIENCE — All Push Notification Copy

**Daily Log Reminder (if not logged by 8pm):**
*"Quick check-in — how's today going? 90 seconds to log, then you're done."*

**Pre-Luteal Warning (3 days before predicted luteal start):**
*"Heads up: your luteal phase is likely starting in about 3 days. Based on your previous cycles, this is when [her most common symptom] tends to appear. You might want to plan lighter commitments for [dates]."*

**Day 1 of Predicted Luteal Phase:**
*"Your luteal phase may be starting. You've logged symptoms during this window before. This usually lasts [X] days for you."*

**Period Due Reminder (2 days before predicted start):**
*"Your period is likely due around [date]. You might want to have supplies ready."*

**Post-Period Recovery:**
*"Based on your cycle, you're likely entering your follicular phase — usually when symptoms improve. How are you feeling today?"*

**ADHD Medication Alert (opt-in):**
*"Day [X] of your luteal phase — in previous cycles, your medication effectiveness has dropped around this point. You may want to discuss this pattern with your prescriber."*
Plus: *"If possible, this might be a week to ease your schedule and communicate your workload to trusted colleagues."*

**Pattern Alert (new pattern detected):**
*"New insight: over your last 3 cycles, your sleep quality drops consistently 5 days before your period. Want to see the data?"*

**Week 1 Re-engagement (if no log for 3 days):**
*"No pressure — even logging once a week is valuable. When you're ready, we're here."*

---

### HOME SCREEN — "This Week" View

**Top:** 7-day strip — today and next 6 days. Each day labeled: cycle day number + phase name. Today circled. Predicted symptom intensity shown as a small colored bar under each day (derived from her historical data).

**Card below strip:**
- Good predicted days: *"This looks like a lighter week — good window for high-stakes work or social plans."*
- Heavy predicted days: *"Your luteal phase is active. Your patterns show this is typically [what her data shows]."*

**Card interaction:** One-tap option — `I'm fine` / `Tell me more`. She controls the depth.

**Below card:** Daily log button (large, prominent) + most recent pattern insight.

---

### TRUST ARCHITECTURE

#### Empty States

**Day 1, no data:**
Not a grey placeholder. Not "log to see your data here."

*"Your calendar will fill in as you log. After 14 days, you'll start seeing patterns. After 28 days, you'll have a clinical-grade symptom chart to share with your doctor."*

Plus: the cycle phase colors are already visible on the calendar from day one — based on the cycle date she gave in onboarding. The calendar is never fully empty. It already knows something about her.

#### Crisis Protocol — Suicidal Ideation

PMDD-specific premenstrual dysphoric ideation is documented in 30–40% of severe PMDD patients. This is not rare. We will encounter it.

**Trigger:** Top-of-scale severity on any mood-related symptom, combined with hopelessness or self-harm indicators.

**Response:** Full-screen modal (not a banner) from bottom:

> *"We noticed you're having a really hard time right now. If you're having thoughts of hurting yourself, please reach out to the 988 Suicide and Crisis Lifeline — call or text 988. You're not alone in this."*
>
> *"Your PMDD data shows that these feelings often occur during the luteal phase. If this is pattern-consistent, logging today still matters. But your safety comes first."*

Two options: `Contact crisis line` / `Continue logging`

We do NOT require her to confirm she's okay before continuing. Forced interaction during crisis drives users away exactly when they most need to stay.

**Post-crisis insight (surfaced in the weekly summary, NOT the same session):**
*"You've been here before. In your last 3 cycles, this level of distress lasted an average of [X] days before your period came."*
Predictability reduces terror. Knowing the darkness ends is one of the most clinically meaningful things we can offer.

#### Privacy Architecture

Communicated in three places — never buried in Terms of Service:

1. Account creation screen: *"Your health data is stored on your device first. We never sell your data. Period."*
2. Dedicated onboarding screen — "About Your Data" (30 seconds to read): what's stored where, who can see it, what happens if we're subpoenaed (to the extent legally possible), how to delete your account and all data.
3. Settings, always accessible.

Commitment: We will fight legal challenges to user data to the extent possible and notify users when legally permitted.

#### Simple Mode

Activates: manually by user, or automatically (with permission) when we detect she's in a predicted high-severity window.

Reduces every screen to: one question, one input, one button. Designed for cognitive impairment during PMDD episodes, dissociative episodes, and severe pain states.

#### Incomplete Logs

If she starts a log and doesn't finish, we save what she entered. We do not restart from zero. No guilt. No red badge.

---

### ACCESSIBILITY (Beyond WCAG Baseline)

**Cognitive accessibility (PMDD brain fog + ADHD):**
- Single-question screens on all critical flows
- Minimum touch target: 60x60px standard, 70x70px for pain-log screens
- Progress indicators on all multi-step flows
- No multi-step interactions buried in small UI elements
- Flexible notification timing: not just "8pm daily" but "[X hours after wake-up]"
- Short, scannable text — no walls of copy

**Physical accessibility (endometriosis pain):**
- Landscape orientation fully supported
- Large touch targets on all log screens
- One-tap bad-day log option reduces interaction to a single gesture

**Vision accessibility:**
- Dark mode available from onboarding — medical necessity for nausea-prone users
- All severity indicators: both color AND text label
- Font size scaling with device accessibility settings

**Emotional accessibility (depression, dissociation):**
- Clear primary action on every screen requiring no reading to execute
- Voice notes (v1.5)
- No punishing of missed logs or non-completion

---

### FEATURES NOT BUILT IN V1

| Feature | Reason Cut | When |
|---|---|---|
| Social / community features | Moderation burden, liability, small team | V2 |
| Telehealth / doctor matching | Medical licensing, liability, no physician network | V3+ |
| Nutrition tracking | Pulls us toward wellness-app category | V2 (endo triggers only) |
| Exercise / fitness tracking | Not what we are | V3 |
| Wearable integration (Oura, Apple Watch) | Technical complexity, data quality variance | Early V2 |
| Hormone-adaptive workout plans | Requires physio expertise we don't have | V3+ |
| Supplement recommendations | Never without rigorous clinical backing | Review annually |
| ~~AI chatbot / symptom checker~~ | **ADDED: Ora AI companion built and included in Pro tier** | **V1** |
| Partner / family view | Requires extensive user research, consent architecture | V3 |
| Insurance / employer integration | Legal review required, explicit opt-in only | Never without legal sign-off |
| Calendar sync (Google/Apple) | Privacy risk (legal landscape) | V2 with full privacy review |
| Voice notes | Technical complexity for v1 | V1.5 |

---

### FREEMIUM MODEL

**Free (forever):**
- Daily logging (always free)
- Cycle calendar with phase predictions
- First DRSP chart generated after one cycle
- Basic pattern insights (top 2 patterns detected)
- One Ora insight at day 30 (chart explanation — the vindication moment)
- Ora: 3 "Explain My Chart" queries/month + 1 cycle-contextual insight per phase

**HormonaIQ Premium — $12.99/month or $79.99/year:**
- Full pattern library
- DRSP chart generation every cycle
- Doctor report PDF export
- ADHD medication effectiveness overlay
- Multi-module tracking (PCOS + PMDD simultaneously)
- All future module access
- Priority support

**HormonaIQ Pro — $19.99/month or $119.99/year:**
- Everything in Premium
- **Ora: unlimited access to all 6 AI companion features**
  - Explain My Chart (unlimited)
  - Prepare Me For My Appointment
  - Why Is This Happening Right Now (unlimited)
  - AI-Written Clinical Letter (physician-readable format, Dr. Amara's template)
  - AI Pattern Discovery (4+ cycle requirement, Pearson ≥0.6)
  - AI Crisis Contextualization (4+ cycle minimum, surfaced post-crisis only)
- Ora data transparency: one-tap view of exactly what Ora used for any insight
- Ora opt-out toggle on home screen (keep tracking, disable Ora)

**Paywall hit:** Day 30. She's had enough time to experience core value, generate her first chart, form the habit. She's invested.

**Why first Ora insight is free:** The free Ora moment at day 30 is the vindication event — the first time she sees her data explained in clinical language. She will tell every person she knows. That conversion moment must be free. The unlimited Ora access — the tool she uses every day, every cycle, every appointment — is Pro.

---

### USER JOURNEY MAP

**Week 1:**
Downloads after finding us on r/PMDD or r/adhdwomen. Completes onboarding in 8–12 minutes. Gets the immediate insight on Screen 7 — first validation. Logs first day. Days 2–3: log reminder, calendar starts building. Day 5–7: pre-luteal warning notification, first proactive moment. End of week: 5–7 days logged or churned.

**Churn risk:** Users who don't log for 3+ consecutive days in Week 1 almost never return. Re-engagement at day 3 of no logging: *"No pressure — even logging once a week is valuable. When you're ready, we're here."*

**Month 1:**
Day 14: first pattern insights. Day 21–28: first full logged cycle. Calendar has a month of visual data — pattern visible for the first time. Day 30: paywall hit.

**Month 3:**
Three cycles logged. Two-month DRSP chart complete. First doctor report used. The referral moment: the appointment went better, or she finally got a diagnosis. We make sharing easy: *"This report took [X weeks] of logging to build. Know someone who's been struggling to get answers? They can start tracking today."*

**Month 12:**
10+ cycles logged. Predictions are highly accurate. Power user. Potential multi-module user. Annual renewal decision supported by personal year-in-review: *"In the past year, you logged [X] days. Your most severe symptoms occurred [when]. Your lowest-symptom weeks were [when] — your best weeks for big plans."*

---

## PART 3: MARKETING, SEO & SOCIAL
*Elena Vasquez (CMO) + Ryan Park (SEO) + Diana Torres (Social)*

---

### Positioning

> **"HormonaIQ is the clinical tracking app that turns years of dismissed symptoms into proof your doctor can't ignore."**

**Three messaging pillars:**

**Pillar 1: You Were Right All Along.**
Not "we believe you" — that's patronizing. You already knew something was wrong, and you were correct. We're building the tool that proves it. This is vindication, not validation.

**Pillar 2: Data First, Feelings Second.**
She's spent years being told her symptoms are emotional, not physiological. We give her numbers. DRSP scores. Symptom severity across cycle phases. ADHD medication efficacy correlated to luteal phase. Hard data.

**Pillar 3: Built for the Complexity, Not the Average.**
Flo is built for the 28-day-cycle woman who wants to know when she's ovulating. Our user is not that woman. We are the first product that acknowledges her body is complex — not broken, complex.

---

### Competitive Wedge

**vs. Flo:** Flo fails 82% of PCOS users. Their algorithm is built on average cycle data. Their content on PMDD, multi-condition tracking, and clinical instruments is thin. They cannot pivot to serve our user without rebuilding their product architecture.

**vs. Clue:** Great UX, generic SEO content. Ranks for "period pain" — high volume, low intent. Our user who types "PMDD DRSP chart how to fill out" is 10x more valuable because she's already diagnosed, already motivated, already going to the doctor.

**Our moat:** DRSP automation. Multi-condition tracking. Clinical credibility. Community trust. Practitioner relationships. By the time Flo or Clue tries to replicate any of this, we'll own the search positions, the community trust, and the clinical relationships.

---

### SEO Strategy

#### Trust Infrastructure (Build Before Content)
E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness) is mandatory for health content. Without it, Google sandboxes new health domains regardless of content quality.

Required before publishing:
- Medical advisory board listed on site with credentials
- Author bios with credentials (MD, WHNP, psychiatrist) on every article
- Clinical citations to PubMed (never Wikipedia) in every article
- Transparent "how we make content" policy page
- Early links from .edu/.gov domains or recognized health publications

#### Top 20 Keywords at Launch

**Tier 1 — Diagnostic Intent (Highest Value)**

| # | Keyword | Volume | Opportunity |
|---|---|---|---|
| 1 | PMDD symptoms | 74,000/mo | Flo ranks #4 with thin content |
| 2 | **DRSP chart PMDD** | 2,900/mo | **Zero competition. We own it.** |
| 3 | PCOS symptoms checklist | 33,100/mo | Healthline ranks with generic content |
| 4 | perimenopause symptoms list | 27,000/mo | Growing 364.9% — massive opportunity |
| 5 | **ADHD worse before period** | 1,600/mo | **Nobody serving this. Rank #1 in 90 days.** |
| 6 | PMDD diagnosis criteria | 4,400/mo | Medical sites rank non-actionably |
| 7 | do I have PCOS quiz | 9,900/mo | We build interactive tool, not article |
| 8 | perimenopause and ADHD | 1,300/mo | Growing fast, almost zero competition |
| 9 | PMDD vs PMS difference | 8,100/mo | High volume, top of funnel |
| 10 | endometriosis symptom tracker | 1,000/mo | Low competition, exactly what we offer |

**Tier 2 — Treatment & Management Intent**

| # | Keyword | Volume | Opportunity |
|---|---|---|---|
| 11 | HRT perimenopause side effects | 22,200/mo | Compete with tracking angle |
| 12 | ADHD medication cycle tracking | 320/mo | Zero competition, maps directly to our feature |
| 13 | PCOS irregular periods management | 2,400/mo | Flo's content here is poor |
| 14 | luteal phase ADHD symptoms | 880/mo | Emerging, growing 200%+ |
| 15 | PMDD treatment options 2025 | 1,900/mo | Patient-perspective angle vs. medical journals |

**Tier 3 — Commercial Intent**

| # | Keyword | Volume | Opportunity |
|---|---|---|---|
| 16 | best PMDD app | 1,600/mo | Direct competitor comparison — must rank here |
| 17 | PCOS tracking app | 2,900/mo | Flo underserves — our chance |
| 18 | perimenopause tracker app | 1,300/mo | Very low competition, $1T+ market |
| 19 | Hashimoto's symptoms tracker | 590/mo | Plant the flag for future module |
| 20 | ADHD women hormones | 4,400/mo | r/adhdwomen validates search demand |

#### Five SEO Content Pillars

**Pillar 1: Clinical Diagnosis Tools**
DRSP explained, how to fill it out, how to bring to a doctor, what scores mean. We are the only destination on the internet making the DRSP accessible to a lay audience. This is our moat.

**Pillar 2: ADHD + Hormones**
ADHD medication effectiveness across the menstrual cycle. Luteal phase ADHD exacerbation. Why women are diagnosed later than men. Fastest-growing search cluster in our universe, almost completely unserved.

**Pillar 3: Multi-Condition Life**
PMDD AND PCOS. Endometriosis AND Hashimoto's. The reality of overlapping diagnoses. This content category literally does not exist anywhere.

**Pillar 4: Doctor Conversations**
How to advocate for yourself. What to say when dismissed. How to read your own lab results. How to bring data to an appointment. Highest-performing social content too — clips directly to TikTok.

**Pillar 5: Research Translations**
New studies on PMDD, PCOS, perimenopause — translated from PubMed into plain English. Credentialed authors. Fast turnaround. We break research before anyone else covers it.

#### SEO Landmines to Avoid

1. AI-generated content without medical review — Google penalizes this; every article needs a credentialed reviewer
2. Chasing volume over intent — 500 visits to our DRSP page > 50,000 to "period late"
3. Republishing generic content — we cannot out-Healthline Healthline; we own intersections and depth
4. Ignoring Core Web Vitals — our user is searching from her phone at 2am; sub-2-second load times are non-negotiable
5. Internal linking neglect — hub-and-spoke model; every pillar page linked from every related article

#### Domain Authority — How We Build It Fast

**Original research:** We have anonymized, aggregated user data. "We surveyed 500 women with PMDD: here's what doctors told them." Gets linked to by Healthline, The Cut, academic researchers. One research piece → 50+ backlinks.

**Expert quotes and partnerships:** Identify 20 credentialed gynecologists, psychiatrists, reproductive endocrinologists who are active on social. Build relationships before launch. Their mentions are high-DA health domain backlinks.

**PR-driven links:** Every tier-1 press feature is a DA70+ backlink. The PR strategy and the SEO strategy are the same strategy.

**Programmatic SEO (Q2 onwards):**
- Symptom combinations: "PMDD fatigue brain fog" — one page per meaningful pair
- Medication + cycle: "Vyvanse effectiveness luteal phase" — nobody has this
- Research summaries: auto-structured summaries with human editorial layer
- Target: 2,000 indexed pages within 6 months → 200K–400K monthly organic sessions from long-tail

#### SEO Traffic Timeline (Realistic)

| Period | Activity | Traffic |
|---|---|---|
| Months 1–2 | Indexing, crawling, technical foundation | Near zero |
| Months 3–4 | Long-tail starts moving, DRSP chart, niche searches | 5,000/mo |
| Months 5–8 | Pillar pages gain authority | 30,000–80,000/mo |
| Months 9–18 | Full execution | 200,000–500,000/mo |

---

### Launch Articles (5 at Launch)

**Article 1: The DRSP Chart Explained**
H1: *The DRSP Chart Explained: How to Fill It Out, What It Measures, and How to Use It With Your Doctor*
Gating: **FREE** — our link magnet and product proof. Every user who completes a manual DRSP using this guide then wants an app that automates it.

**Article 2: ADHD Symptoms Before Your Period**
H1: *ADHD Symptoms Before Your Period: Why Your Medication Stops Working in the Luteal Phase*
Gating: **FREE** — search score 48.7, we can rank #1 in 60–90 days. Email capture via exit-intent: "Track your ADHD across your cycle with HormonaIQ — free."

**Article 3: PMDD vs PMS**
H1: *PMDD vs. PMS: A Clinical Comparison With the Diagnostic Criteria Your Doctor Uses*
Gating: **FREE** — clinical depth outperforms generic results. Exit CTA: "Your next step is a DRSP chart — HormonaIQ automates it."

**Article 4: Perimenopause Before 40**
H1: *Perimenopause Symptoms Before 40: The Complete Clinical Guide to Early Perimenopause Signs and Testing*
Gating: **EMAIL CAPTURE** — "Download the complete perimenopause symptom tracking guide (PDF)"

**Article 5: Living With PCOS and PMDD**
H1: *Living With PCOS and PMDD: How to Track and Manage Two Overlapping Hormonal Conditions*
Gating: **EMAIL CAPTURE + FREE TRIAL CTA** — bottom-of-funnel, she's been living with both for years, ready to act.

---

### Social Media Strategy

#### Platform Stack at Launch

**TikTok — Primary (4–5x per week)**
Where we build awareness and reach people who don't know they have a condition yet. The "wait, I have WHAT?" moment. TikTok is also now a search engine — "PMDD symptoms TikTok" is a real search behavior.

**Instagram — Secondary (3–4x per week)**
Longer-form educational carousels for the medically literate, already-diagnosed user. Where she decides if HormonaIQ is serious enough for her.

**Reddit — Strategy, Not Posting**
We do NOT create a brand account. See Reddit Strategy section.

**Pinterest — Sleeper (semi-automated)**
Search-driven, not social. Huge for health content. Perimenopause content performs extremely well on Pinterest — the demographic is older and more Pinterest-native.

**YouTube — Month 3 onwards**
Long-form explainers, doctor interviews, "I finally got diagnosed" stories. Feeds SEO (Google owns YouTube).

**Twitter/X — Thought leadership only**
Medical advisors and founder tweet. Brand account minimal. Algorithm hostile to women's health content without paid reach.

#### TikTok Content Calendar

- **Monday:** Research translation ("new study just found...")
- **Tuesday:** Community story / user feature
- **Wednesday:** "Things your doctor never told you" — highest performer
- **Thursday:** Product feature education (show the tool without it feeling like an ad)
- **Friday:** Reactive — trending health conversation, news, Reddit thread (read the room)

#### The TikTok Viral Formula for Health

1. **Personal diagnostic revelation:** "I spent 8 years being told my symptoms were anxiety. I filled out a DRSP chart. My psychiatrist said I have severe PMDD." Requires real people. We find these users and amplify them.

2. **"Did you know" with cognitive dissonance hook:** "Did you know your ADHD medication might not be working because of your period?" Hook creates pause. Content delivers science.

3. **Doctor + patient duet formats:** Partner with credentialed clinicians who post on TikTok (dozens with 100K+ followers). Credibility transfer is enormous.

4. **"Show your chart" format:** DRSP chart walk-through — what each section means, how it changed over 3 months. Product demo that doesn't feel like a product demo.

5. **Rage-bait (carefully):** "My doctor told me PMDD wasn't a real diagnosis." Comment section becomes 90% women sharing their dismissal story. Need crisis response protocol before using this format.

#### Reddit Strategy

r/PMDD has **banned AI-generated content**. We have been warned.

**What we do NOT do:**
- Create a brand account
- Post about our app
- Sponsor posts
- Ask mods for anything promotional

**What we do:**
3–5 internal team members (customer success lead, clinical advisor, ideally founder) who are genuinely present in these communities — not posing. They answer questions. Share research. When someone asks "has anyone found a good tracking system for DRSP," they can authentically say "I've been testing HormonaIQ — here's what I found."

**Hard rule:** No one at HormonaIQ posts anything on Reddit related to our product without approval. One wrong move destroys 6 months of community goodwill.

Reddit as research tool: highest-upvoted posts in r/PMDD, r/PCOS, r/adhdwomen are our content calendar. Those questions are Ryan's keywords. Those frustrations are Elena's messaging.

#### Tone of Voice — Two Registers

**In the app:** Calm, clinical, precise. The voice of a trusted clinician who believes you. No cheerfulness. No "you've got this!" She may be logging at 2am in a PMDD crisis.

**On social:** Still credible, still serious, but warmer. Wry. The tone of a friend who happens to have a medical degree and who is also furious on your behalf. We can be a little angrier on social.

#### Creator / Influencer Strategy

**What we do NOT do:** Target wellness influencers with large followings and no specificity. "Hormone health creator with 800K followers" who posts about collagen and seed cycling — wrong audience, wrong credibility.

**Tier 1 — Micro-clinicians (10K–100K followers):** OB-GYNs, reproductive endocrinologists, psychiatrists, NPs who specialize in women's health and are active on TikTok or Instagram. Offer: early access, co-creation of content, attribution in articles.

**Tier 2 — Patient advocates (20K–200K):** Real women who have documented their PMDD/PCOS/perimenopause journey publicly. Offer: free lifetime premium, collaboration on content, feature on our platform.

**Tier 3 — Niche podcast hosts:** ADHD women's podcast space is enormous and undermonetized. Offer: free access for their audience, affiliate revenue share, co-created episodes.

**Rule:** Payment is never for a claim we can't substantiate. No "this app cured my PMDD." Every influencer content piece goes through clinical review before posting.

#### Handling Negative Comments

**"The app gave me wrong information":** Acknowledge immediately, do not be defensive, move to DMs within 10 minutes. Actually fix it. Never argue.

**"This app is not a replacement for a doctor":** Agree loudly. "You're absolutely right — HormonaIQ is designed to help you have better doctor conversations, not to replace them."

**General negativity / competitor attacks:** Ignore or like without responding. Engaging gives oxygen.

---

### Launch Plan

#### Pre-Launch: Building to 2,000+ Waitlist

**Weeks -6 to -4:**
- Landing page live: single purpose, email capture. Headline: *"The first app that turns your symptoms into evidence your doctor can't ignore. Join the waitlist."* No screenshots, no features — just the promise.
- Founder posts on LinkedIn: founding story, personal, vulnerable where appropriate
- Community members participate authentically in Reddit (not spam)
- First two cornerstone articles published: DRSP explainer + ADHD luteal phase (starts the SEO clock)

**Weeks -3 to -2:**
- Referral engine: waitlist priority for referrals. "Move to the front of the line" — status, not discount
- 5 Tier 2 patient advocates activated (combined audience 300K+) with early access
- Original research published: "We surveyed 200 women with PMDD about their doctor experiences." Pitched to Healthline and The Cut with 2-week lead time
- Target: 1,200 emails

**Week -1:**
- All hands on social — team members post personal connections to the product
- 3 Tier 1 clinical creators share with their audiences
- Press outreach goes live: embargo pitch to Glamour, The Cut, SELF, Healthline for launch-day coverage
- Target: **2,000+ emails**

#### Launch Day — Timed Sequence

| Time (ET) | Action |
|---|---|
| 6:00 AM | Press embargo lifts — tier-1 publication story goes live |
| 7:00 AM | Founder posts on LinkedIn + Twitter/X (personal, narrative, not promotional) |
| 8:00 AM | Email to full waitlist: "You've been waiting. The DRSP app is live." |
| 9:00 AM | Tier 2 advocates post simultaneously on TikTok + Instagram |
| 11:00 AM | Tier 1 clinical creators post — the clinical credibility wave |
| 2:00 PM | Ryan monitors Search Console for branded searches |
| 4:00 PM | Community engagement — respond to every single comment today |

**#launch-day Slack channel:** Anyone who sees press coverage, TikTok mention, Reddit post — drops the link. We respond within 15 minutes everywhere on launch day.

---

### Growth Loops

**Growth Loop 1: The Doctor Loop**
User fills DRSP chart → app generates clinical PDF → user brings to appointment → doctor asks "what tool is this?" → doctor recommends HormonaIQ to other patients → those patients enter the loop.

The PDF export must look like it came from a hospital. Clinical formatting, no consumer branding. Psychiatrists mentioning HormonaIQ on their practice resource pages = high-DA health backlinks.

**Growth Loop 2: The Referral Mechanic**
Not discounts. Generosity: *"Invite a friend — she gets 3 months premium free, you get 3 months premium free."*

Timing: after first DRSP chart completion. Not before. That's the vindication moment. That's when she wants to share.

Copy: *"You've just done something most doctors don't do — you've documented your symptoms with clinical precision. Know someone who's been struggling to get answers? Send them this."*

**Growth Loop 3: The Practitioner Partnership Channel (Month 3+)**
Target: psychiatrists who specialize in PMDD, OB-GYNs with PCOS/perimenopause interest, NPs in women's health, integrative medicine doctors.

Outreach: invitation to clinical advisory board, free premium for their patients, co-created "HormonaIQ Practice Guide" PDF they can share with patients.

Each practitioner = a micro-distribution channel. 100 practitioners × 50 relevant patients/year = 5,000 high-intent downloads annually from word of mouth alone.

---

### Email Welcome Sequence (7 Emails Over 14 Days)

**Email 1 (Day 0):** Subject: *"You found it. Here's what happens next."* — Story, not feature tour. CTA: complete first DRSP chart.

**Email 2 (Day 2):** Subject: *"What the DRSP actually measures (and why your doctor needs to see it)"* — Clinical education, links to DRSP article.

**Email 3 (Day 5):** Subject: *"The ADHD thing nobody talks about"* — bridges PMDD to ADHD module. Highest open-rate email in testing.

**Email 4 (Day 7):** Subject: *"A real conversation to have with your doctor (with a script)"* — Literal script. This email gets forwarded. That's our referral mechanic in email.

**Email 5 (Day 10):** Subject: *"What 3 months of tracking looks like"* — Show the product working with real-looking anonymized data. CTA: upgrade to premium.

**Email 6 (Day 12):** Subject: *"The research that changed how we think about [their condition]"* — Personalized by condition tag from onboarding.

**Email 7 (Day 14):** Subject: *"What would it mean to finally have an answer?"* — Emotional close. Community invite. Premium offer.

---

### PR Strategy

**The story for journalists:** Not "new app launches." Journalists don't write about apps. The story is:

> *"Women are diagnosing their own hormonal conditions because the medical system isn't. Here's the clinical tool they're using."*

Data hook: PMDD up 193% in search in 5 years. Women bringing Reddit threads to doctor appointments. A health system failure story — HormonaIQ is the response.

**Secondary angle:** *"The ADHD crisis in women: why medication stops working once a month — and what nobody tells you."*

**Tier 1 targets (need one on launch day):** The Cut / SELF / Glamour / Healthline

**Tier 2 (within first month):** Bloomberg Health / Stat News / Forbes Women

**Podcast (as guest, months 1–6):** ADHD Experts Podcast, I Have ADHD, Hacking Your ADHD (500K+ combined), The Hormone Solution, Gyn & Tonic

---

### Metrics

#### North Star Metric: Weekly Active Symptom Loggers (WASL)
A user who opens the app and logs at least one symptom in the past 7 days.

Downloads without logging = no product value.
Logging without weekly return = no habit formed.
Weekly active logging = product is working.

#### Metrics We Track Weekly

1. WASL (North Star)
2. DRSP chart completion rate
3. PDF export rate (growth loop signal)
4. D7 retention (target: 40%+)
5. D30 retention (target: 25%+)
6. Email open rate on welcome sequence
7. App store rating (4.5 minimum — investigate immediately if below)
8. Organic search sessions (week over week)
9. Referral rate (% of new signups from referral)

#### Metrics We Ignore
Total downloads / Social follower count / Raw pageviews / Press mentions without traffic / App store rankings by category

#### Milestones

**30 Days:**
5,000 WASL / D7 retention >35% / 1 tier-1 press placement / 3 TikToks with 50K+ views / 25 practitioners in advisory program / 15,000 organic search sessions

**90 Days:**
20,000 WASL / 80,000 monthly organic sessions / D30 retention >25% / 3 core keywords in top 5 positions / NPS 50+

**12 Months:**
150,000 WASL / 500,000 monthly organic sessions / 200 practitioners actively referring / Tier-1 mainstream outlet coverage / $1.8M ARR (30% WASL conversion at $10/month average)

---

## PART 4: ENGINEERING & CLINICAL ARCHITECTURE
*Alex Morgan (CTO) + Dr. Amara Osei (Clinical Advisor)*

---

### Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Mobile | React Native (Expo) | Cross-platform, fast iteration, large ecosystem |
| Local storage | WatermelonDB (SQLite) | Offline-first, works without connectivity |
| Backend | Supabase (HIPAA-eligible tier + BAA) | Postgres, real-time, HIPAA-eligible, signed BAA |
| Payments | RevenueCat | Cross-platform subscription management |
| AI / Insights | Claude API (Anthropic) | Pattern detection, notification copy personalization |
| Safety layer | Claude API guard model eval | Secondary Claude call flags medical diagnosis language before display |
| Report generation | React-PDF on Vercel serverless functions | DRSP PDF generation without storing files server-side |
| Hosting | Vercel | Edge functions, global CDN, preview deployments |
| Monitoring | Sentry + PostHog | Error tracking + product analytics |

---

### Architecture Principles

**Offline-first:** All logging works without connectivity. WatermelonDB stores all symptom data locally and syncs to Supabase when connected. She can log at 3am in airplane mode and the data is there.

**Local computation first:** Cycle phase predictions, pattern detection, and most insight generation happen on-device. Server round-trips are for persistence and report generation — not for basic features.

**Defensive data minimization:** We store what we need and nothing more. Exact birth date: not stored. GPS: never requested. Communication identifiers (name, phone): not linked to health data in the same record.

---

### Database Schema (Simplified)

```sql
-- Users table (minimal identifiers)
users (
  id UUID PRIMARY KEY,
  email_hash VARCHAR,        -- hashed, not plaintext
  age_decade SMALLINT,       -- 2=20s, 3=30s, 4=40s, 5=50s
  created_at TIMESTAMPTZ,
  conditions TEXT[]          -- ['pmdd', 'pcos', 'adhd']
)

-- Symptom logs with JSONB for flexibility + Postgres validation
symptom_logs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  cycle_day SMALLINT CHECK (cycle_day BETWEEN 1 AND 60),
  log_date DATE NOT NULL,
  overall_severity SMALLINT CHECK (overall_severity BETWEEN 1 AND 10),
  drsp_scores JSONB,         -- {"mood_shifts": 4, "irritability": 3, ...}
  physical_symptoms TEXT[],
  adhd_medication_effectiveness SMALLINT CHECK (...),
  bad_day_only BOOLEAN DEFAULT false,   -- one-tap log
  created_at TIMESTAMPTZ
)

-- DRSP charts (generated, not computed live)
drsp_charts (
  id UUID PRIMARY KEY,
  user_id UUID,
  start_date DATE,
  end_date DATE,
  days_logged INTEGER,
  days_estimated INTEGER,    -- data quality indicator
  chart_data JSONB,
  generated_at TIMESTAMPTZ
)
```

JSONB with Postgres-level validation: we validate DRSP score ranges (1–6) at the database level, not just application level. Clinical data integrity is not optional.

---

### Privacy & Security Architecture

**Encryption:**
- All data encrypted at rest (Supabase AES-256)
- All transit encrypted (TLS 1.3 minimum)
- DRSP exports: ephemeral PDF generation — file generated on Vercel edge, streamed to user, not stored server-side

**HIPAA compliance path:**
- Supabase HIPAA-eligible tier with signed Business Associate Agreement (BAA)
- SOC 2 Type I target: year one
- SOC 2 Type II target: year two (required for enterprise practitioner partnerships)

**Legal landscape preparedness:**
- No period start dates in plaintext linked to identifiable user data
- No GPS data ever collected
- Legal response protocol: fight challenges to extent legally possible, notify users when legally permitted
- Data deletion: full account + all associated health data deletion within 30 days of request

**Guard model eval (Claude API):**
Every AI-generated insight goes through a secondary Claude API call that evaluates: does this text make a medical diagnosis? Does this text recommend a medication dose change? If yes to either — the insight is suppressed and replaced with a safe alternative or a "discuss with your doctor" prompt.

This prevents the AI from accidentally crossing from "observational data" into "medical advice."

---

### Clinical Safety Architecture

**Crisis detection pipeline:**
```
User logs symptom data
    → Severity scoring algorithm
        → If DRSP item 22 (thoughts of harming oneself) ≥ 3
           OR combination of top-scale mood severity + hopelessness markers:
            → Crisis modal triggers immediately
            → Log crisis event internally (cycle day, severity, not shown to user)
            → Post-episode: weekly summary includes predictability data
```

**DRSP item 22 threshold:** DRSP item 22 is "Thoughts of harming myself." A rating of 3 or above (on the 1–6 scale where 3 = "moderately") triggers the immediate full-screen crisis modal. This threshold was set in consultation with Dr. Osei based on published clinical guidelines.

**Clinical advisory board:** 6 compensated advisors:
- 2 reproductive endocrinologists with PMDD research
- 1 psychiatrist specializing in PMDD and perinatal mood disorders
- 1 OB-GYN with PCOS subspecialty
- 1 NP specializing in perimenopause and HRT
- 1 patient advocate with lived experience + clinical training

Meeting cadence: monthly. Compensation: equity + honorarium. Responsibility: review all clinical language in the app, review all AI-generated insight templates, sign off on DRSP scoring implementation.

**Disclaimer infrastructure:**
Every medication-related insight has this footer, no exceptions:
> *"This is observational data for discussion with your prescriber. Do not adjust your medication based on app data alone."*

Every clinical pattern insight uses confidence language:
> *"Based on your last [N] cycles..."* — never *"you always"* or *"you will."*

Every symptom-to-condition observation is framed as observational:
> *"Your data shows a pattern consistent with PMDD criteria"* — never *"you have PMDD."*

---

### DRSP Scoring Implementation

The DRSP scale is 1–6, not 1–10. This is the actual clinical instrument. We do not remap it.

1 = Not present
2 = Minimal
3 = Mild
4 = Moderate
5 = Severe
6 = Severely disabling — unable to function

The two-month comparison required for PMDD diagnosis: we require data across two full cycles (follicular + luteal phases each). The diagnostic criterion is that symptoms are markedly elevated in the luteal phase compared to the follicular phase, with a luteal/follicular ratio that demonstrates the premenstrual pattern.

Data quality indicator on every chart: X of Y days logged. Days estimated using interpolation rules that are disclosed to the user.

---

### Build Sequence — What Ships in What Order

**Sprint 1–4 (Weeks 1–8): PMDD Module**
- Onboarding (all 9 screens)
- Daily log (PMDD symptom set + one-tap bad day)
- Cycle calendar (month view + phase colors)
- Local WatermelonDB sync + Supabase persistence
- Crisis modal (crisis protocol, 988 integration)

**Sprint 5–8 (Weeks 9–16): DRSP + Doctor Report**
- DRSP chart generation (28-day threshold, data quality indicator)
- React-PDF generation on Vercel serverless
- Doctor report email delivery
- ADHD medication effectiveness overlay
- Pattern detection (14-day trigger)

**Sprint 9–12 (Weeks 17–24): PCOS Module + Paywall**
- PCOS condition selection path
- Irregular cycle Bayesian prediction model
- Lab result tracker
- RevenueCat subscription integration
- Free vs. premium feature gating

**Sprint 13–16 (Weeks 25–32): Perimenopause + Hashimoto's**
- HRT dose log
- Hot flash one-tap tracker
- TSH lab result tracker
- HRT + levothyroxine interaction alert

**Sprint 17–20 (Weeks 33–40): Endometriosis + Polish**
- Pain body map
- Flare trigger log
- Pre-surgery documentation report
- Simple mode
- Accessibility audit and remediation

**Sprint 21+ (Weeks 41+): Voice Notes, Wearable Integration, Community**
- Voice notes for daily log (v1.5)
- Oura Ring + Apple Health integration (early V2)
- Discord community infrastructure (month 3)

---

## PART 5: ORA — AI COMPANION
*Full team meeting: April 25, 2026 — Marcus Whitfield (Brand), Priya Nair (CPO), Dr. James Okafor (UX Research), Elena Vasquez (CMO), Ryan Park (SEO), Diana Torres (Social), Alex Morgan (CTO), Dr. Amara Osei (Clinical), Camille Okafor (Visual Design)*

---

### The Decision to Build

Users in r/PMDD are already using ChatGPT as a workaround: *"ChatGPT has been a life changer. Even when I'm in the pits of depression and doom and blind with rage, this damn app has kept my wits about me."* Google Trends confirms: "AI health app" grew +374% in 12 months. "AI period tracker" is essentially zero search volume — a blue ocean, first mover wins.

The risk is real: r/PMDD and r/adhdwomen have banned AI-generated content. Users have been burned by period app data scandals post-Roe. The answer is not to avoid AI — it's to build it in a way that proves the data serves only her.

**Vote:** Unanimous yes, with three non-negotiable constraints:
1. Ora never claims diagnostic authority — she describes data, she does not diagnose
2. Data deletion is real and prominent — not buried, not delayed, not a policy
3. Users can opt out of Ora entirely while keeping the tracker

---

### The Name: Ora

**Etymology:** Latin *hora* (hour/time) + *orare* (to speak, to testify, to bear witness) + Hebrew *ora* (golden) + Italian/Portuguese *ora* (now — the present moment).

**Brand connection:** The motto is *"You already knew. Now your doctor will too."* Ora is the **now** — the moment of vindication. Ora has been keeping time for her when no one else was. Ora testifies on her behalf. The O in Ora is a circle — a cycle — the visual embodiment of the product itself.

**The oracle connection:** Ora contains the first three letters of *oracle* — that which reveals what was always true. An oracle doesn't interpret on your behalf. It reveals what's already there. That is exactly what we built.

**Why Ora over other candidates (full naming debate on file: naming-debate.md):**
- SYN: reads as "SIN" in uppercase — directly contradicts anti-shame brand architecture
- LUX: trademark conflicts in Class 42 + Class 44 (Lux Health platform + supplements)
- Via: Via Women's Health is a clinical care provider in same vertical — naming collision
- Ora: founder rejected (four-letter name, not three-letter)

**Critical rules for Ora:**
- Never called "AI" inside the product — always "Ora" or "insights" or "clinical intelligence"
- Always third person: "Ora has detected" — never "I've noticed"
- Always written as "Ora" — title case. Not ORA (reads as acronym). Not ora (no lowercase in clinical context).
- Never an avatar. The O glyph (Söhne, 12pt, Mariana blue) is the presence indicator — the name is the mark.
- The word "Ora" appears exactly once per screen — repetition cheapens it

---

### What Ora Does — 6 Features

#### Feature 1: Explain My Chart
She taps her DRSP chart and Ora proactively surfaces a specific finding — "This luteal phase was 23% more severe than your 3-cycle average." She can ask Ora to explain in plain English. Ora uses clinical framing, appropriate uncertainty, and connects to DSM-5 criteria where relevant.

**Guardrails:** Ora says *"your data shows a pattern consistent with PMDD criteria"* — never *"you have PMDD."* Pre-populated prompts steer toward data description, not diagnosis. Guard model blocks any diagnostic language before display.

**Tier:** Free (3 queries/month) → unlimited on Pro

#### Feature 2: Prepare Me For My Appointment
She has a doctor appointment tomorrow. She opens the app. Ora generates: a 3-sentence clinical summary in physician-readable format, exact phrases to use in the appointment, responses to common dismissals, and the single most useful question to ask. The dismissal responses are data-forward, not combative: *"I've been tracking for X cycles using a validated instrument. I'd like to understand whether this pattern warrants further evaluation."*

**Tier:** Pro only

#### Feature 3: Why Is This Happening Right Now
Day 22. She feels terrible. Ora contextualizes her current state against her cycle phase and historical data: what's predictable, how long it typically lasts based on her own prior cycles (not population averages), what she logged that historically helped. Ora anchors predictions to her data specifically: *"Based on your last 4 cycles, this level of severity typically lasts 4-6 more days."*

**Tier:** 1 cycle-contextual insight/phase free → unlimited on Pro

#### Feature 4: AI-Written Clinical Letter
Not a chart PDF — a letter in physician-readable format she hands to any doctor. *"I have been tracking my premenstrual symptoms using the DRSP instrument for 90 days across 3 menstrual cycles..."* Every data point is traceable to a logged entry. No hallucination. Dr. Amara Osei wrote the clinical template personally.

**Tier:** Pro only

#### Feature 5: AI Pattern Discovery
Ora surfaces correlations she didn't know to ask for — sleep vs. severity, stress vs. severity, medication effectiveness across cycles. Minimum 4 cycles of data required. Pearson correlation threshold ≥0.6 before surfacing. Language always says "associated with," never "causes." Confidence disclosed: *"This pattern is based on 4 cycles. More data will confirm or adjust this observation."*

**Tier:** Pro only

#### Feature 6: AI Crisis Contextualization
In a later session — **never during active crisis, never within 48 hours of a crisis log** — Ora shows: *"You've been here before. In your last 3 cycles, this level of distress lasted between X and Y days."* Predictability reduces terror. Range is always displayed, not just average. Minimum 4 cycles required before feature activates. Crisis resources always present on screen. Requires external clinical safety review before launch.

**Tier:** Pro only

---

### Data Deletion Architecture

Data deletion is a V1 launch feature — not a roadmap item.

| Feature | Detail |
|---|---|
| Delete specific date ranges | Surgical deletion, real-time, under 24 hours |
| Delete all data + account | Completed under 24 hours (target), 30-day max per CCPA/GDPR |
| Opt out of Ora entirely | Database flag + on-device flag. She keeps tracking; Ora never runs. Toggle lives on the home screen, not in settings. |
| Pause Ora | Temporary suspension — Ora stops generating insights, tracking continues. She unpages any time. |
| Transparency icon | Every Ora insight has an "i" — one tap shows exactly which data fields produced that insight, inline. |
| "What does Ora use?" screen | Plain-language disclosure: what Ora accesses, what it never sees, accessible from home screen. |
| Data portability | Full export in JSON + CSV. Every logged entry. Standard format. No lock-in. |

**Audit logs after deletion:** The log records only that a deletion event occurred on a given date — no content, no symptoms, no identifiers. If crisis-level data is deleted, it is deleted completely. It cannot be retained for "safety review" without explicit user consent.

**Ora is stateless:** No conversation history stored anywhere. Each Ora interaction is a one-time API call with anonymized data as context. She cannot see what she said to the user in a previous session.

---

### Marketing Language — Two-Track Strategy

**In-product:** "Ora," "insights," "clinical intelligence" — never "AI." The word "AI" does not appear in the product interface.

**External/SEO:** Optimize for "AI health app," "AI period tracker," "AI hormonal health" — these terms appear in meta descriptions, blog content, and paid creative. Never in product copy.

**External positioning statement:** *"Ora learns from your data, not from everyone else's."* — accurate, implies intelligence, directly answers the extraction concern.

**Community (Reddit, etc.):** Lead with feature value stories, not technology announcement. "Ora noticed a pattern in my data that I've been trying to articulate for three years." — this is what gets shared in r/PMDD. Not "HormonaIQ launches AI feature."

**App Store listing:** DRSP automation tool headline. Ora is a named feature callout, not the app description. App Store keyword metadata includes "AI" for algorithmic discovery — invisible to users.

---

### Visual Design of Ora

**No avatar. No animation. No warm colors.**

Ora's visual presence is a specific typographic treatment:

- **Ora Card:** slightly tighter tracking on insight text; thin left border in mid-tone slate; Ora insights sit in a section clearly demarked with "ORA" in small caps above the insight block
- **Presence indicator:** 6px filled circle in Mariana blue, no animation, appears on the chart when Ora has detected a new pattern. She taps it; the Ora panel expands. She dismisses it; it's gone. Ora never insists.
- **Loading state:** thin progress bar at top of Ora panel — not streaming text, not typing dots. Ora doesn't perform intelligence. She exercises it.
- **Transparency icon:** small "i" right-aligned in the Ora panel header. Tapping expands the data disclosure inline — never navigates away from context.
- **One invocation per screen:** the word "Ora" appears once. Repetition cheapens it. She should feel rare.

*The metaphor is a radiologist reading a scan. Ora doesn't tell the user things — Ora shows the user what was always there.*

---

### Technical Architecture

| Layer | Decision |
|---|---|
| Underlying model | Claude API (Anthropic), branded as Ora |
| User visibility | Never sees "Claude" or "Anthropic" — standard industry practice |
| System prompt | Defines Ora's clinical persona, hard limits, DSM-5 reference framing. Written jointly by Alex Morgan + Dr. Amara Osei. Clinical constraint spec written by Dr. Amara first. |
| PHI scrubbing | All identifying information stripped on-device before any API call. API receives: DRSP scores by cycle-day, optional tracked fields, relative dates (day 22 of cycle — not a calendar date). |
| Guard model eval | Every Ora response goes through a secondary Claude call before display. If the guard flags diagnostic language, treatment recommendations, or clinical certainty — blocked and rewritten. User sees only the post-guard response. |
| On-device processing | Basic correlations and pattern math run locally on WatermelonDB. Only natural language generation requires a Claude API call. Ora can surface insights offline; she can't explain them in plain English without a network connection. |
| Stateless | No conversation history persisted. Each Ora interaction is one API call with anonymized context. |
| Model updates | No auto-upgrade on Anthropic model releases. Guard model evals must be revalidated before any model update deploys. |
| Cost | ~$0.80/user/month at expected Pro usage (300 Ora interactions/month). At $19.99 Pro pricing: under 4% of revenue. |

**Ora API call is gated by crisis state check.** If a crisis flag is active, no Claude API call is made. Ora is completely offline during any active crisis logging session.

---

### Market Data: The AI Opportunity

| Signal | Data |
|---|---|
| "AI health app" search growth (12 months) | +374% (5.3 → 25.2 index) |
| "ChatGPT symptoms" search growth | +263% (4.1 → 14.9 index) |
| "AI period tracker" search volume | ~0 — blue ocean, no competition |
| "AI PMDD" search volume | 0.0 — completely empty |
| "ChatGPT health" baseline | 14.9 — significant existing use |
| Reddit organic use | r/PMDD users already using ChatGPT for this need, unguided |
| Competitor Herafia | "AI-driven PMDD management" — launched, failed to gain traction. Led with "AI." We learn from this. |

**The opportunity:** Users are already using general-purpose AI for a highly specialized need because no specialized tool exists. Ora is the specialized tool.

---

## PART 6: KEY DECISIONS — FULL LOG

| Decision | What We Decided | Why |
|---|---|---|
| Default cycle length | No default — user selects 21–45 days | 28-day default fails PCOS users and misrepresents normal variation |
| DRSP scale | Use actual 1–6 scale, not remapped to 1–10 | Clinical data must be directly comparable to published literature |
| First DRSP chart | FREE | Chart reveal drives the referral. Subsequent charts are premium. |
| Paywall timing | Day 30 | Enough time for core value, habit formed, investment made |
| Calendar sync | V1: no. Manual event entry only. | Legal landscape around reproductive health data; privacy first |
| DRSP chart visibility | She sees it first, before it goes anywhere | It's her data. She decides what to do with it. |
| Suicidal ideation response | Modal (not banner), two options only, no forced confirmation | Forced interaction during crisis drives users away at exactly the wrong moment |
| Doctor report branding | No consumer branding — looks like a medical document | Branded reports are dismissed by clinicians |
| ADHD as overlay vs. module | Cross-cutting overlay, not standalone module | ADHD co-occurs with all 5 conditions; it's a layer, not a category |
| Weight / BMI | Never asked, never displayed | Weight stigma alienates users before they experience value |
| Partner/family view | V3 at minimum | Mixed user research results; consent architecture required |
| AI companion (Ora) | **V1 — Pro tier** | Built as Ora, branded as clinical intelligence. Named Ora (Latin: truth). PHI scrubbed before every API call. Guard model eval on every response. Stateless — no conversation history stored. |
| Reddit brand account | We don't create one | r/PMDD bans AI-generated/promotional content; authenticity is the only strategy |
| Color palette | Mariana (deep blue-green) as primary | Unowned in market; clinical without cold; distinct from every competitor |
| No exclamation points | Enforced style rule | The conditions we're treating are serious; the tone must match |
| Celebrate presence, not consistency | No streaks | Women in PMDD crisis should not feel punished for missing a log |

---

## PART 7: WHAT'S NEXT — IMMEDIATE ACTION ITEMS

**Design (Sarah + Marcus):**
- [ ] Full design system in Figma (color tokens, type scale, component library) — 3 weeks
- [ ] Onboarding flow high-fidelity prototype — 2 weeks
- [ ] Daily log prototype for usability testing — 2 weeks
- [ ] Dark mode baseline — before any other screen is designed

**Product / UX (Priya + James):**
- [ ] Draft formal PRD from this meeting — 1 week
- [ ] Recruit 30 user research participants (PMDD-diagnosed or suspected, 10 also with ADHD) — 2 weeks
- [ ] Usability test onboarding with 10 participants before finalizing — 3 weeks
- [ ] Behavioral analytics setup: screen-level completion rate, drop-off points

**Marketing / SEO (Elena + Ryan + Diana):**
- [ ] Waitlist landing page — 10 days
- [ ] Technical SEO foundation (author bios, medical review credits, Core Web Vitals) — before first article
- [ ] DRSP explainer article + ADHD luteal phase article — drafted and reviewed within 3 weeks
- [ ] Social media policy and crisis response protocol — before first post
- [ ] First 5 Tier 2 patient advocates contacted this week

**Engineering (Alex):**
- [ ] Supabase HIPAA-eligible tier setup + BAA signed — week 1
- [ ] WatermelonDB offline-first architecture — week 1
- [ ] Database schema + JSONB validation — week 2
- [ ] Claude API guard model eval prototype — week 3
- [ ] PHI scrubbing layer for all Claude API calls — architecture sprint
- [ ] Ora data deletion: real-time row deletion + 24-hour server purge — V1 launch
- [ ] Ora opt-out flag (on-device + server mirror) + home-screen toggle — V1 launch
- [ ] Ora stateless architecture: confirm no session logs persisted — before any Ora goes live
- [ ] RevenueCat: add Pro tier at $19.99/month, $119.99/year — before beta
- [ ] Trademark check on "Ora" in health/software categories — 3 days
- [ ] Ora Feature 6 (crisis contextualization): 48-hour cool-down gating after crisis flag — V1 launch

**Ora System Prompt (Alex + Dr. Amara):**
- [ ] Dr. Amara writes clinical constraint specification (what Ora can/cannot say) — 2 weeks
- [ ] System prompt development begins only after clinical spec received — week 3
- [ ] Guard model eval ruleset written in collaboration with Dr. Amara — week 3

**Visual Design (Camille):**
- [ ] Ora visual system: Ora Card design, small-caps label, slate left border — design sprint (2 weeks)
- [ ] Ora presence indicator (6px circle, no animation) — design sprint
- [ ] Ora transparency icon ("i") + inline data disclosure design — design sprint
- [ ] Home-screen Ora opt-out toggle design — design sprint

**Brand (Marcus):**
- [ ] Ora brand guidelines v1: name, voice, third-person rule, "about your own data" qualifier, no avatar policy — 1 week
- [ ] Ora onboarding copy (first explanation to user of what Ora is) — 1 week
- [ ] External positioning: "Ora learns from your data, not from everyone else's" — landing page update

**Marketing (Elena + Ryan + Diana):**
- [ ] SEO brief: keyword strategy for AI health/period tracker terms — 1 week
- [ ] Community strategy: Ora feature value story framework for r/PMDD, r/adhdwomen — 2 weeks
- [ ] App store listing copy: DRSP tool headline, Ora as feature callout — 2 weeks
- [ ] Update waitlist landing page with Ora / Pro tier positioning — 1 week

**Clinical (Dr. Osei):**
- [ ] Clinical advisory board: identify 6 candidates and initiate outreach — 2 weeks
- [ ] DRSP scoring implementation sign-off — before sprint 1 ends
- [ ] Crisis protocol clinical review — before any user logging live
- [ ] All clinical language in onboarding reviewed and approved — before beta
- [ ] AI-Written Clinical Letter template (physician-readable format, DRSP instrument framing) — 2 weeks
- [ ] Feature 6 (crisis contextualization): identify 2 external clinical safety reviewers — 2 weeks; review complete before launch
- [ ] Ora pre-populated prompt list clinical review — before any Ora feature ships

---

## APPENDIX: MARKET DATA (Live Data — April 25, 2026)

### Google Trends — 5-Year Search Growth

| Condition | 5-Year Growth |
|---|---|
| Perimenopause | +364.9% |
| ADHD in women | +204.3% |
| PMDD | +193.2% |
| Endometriosis | +99.2% |
| PCOS | Stable high (83.3 normalized) |

### Google Trends — Current Volume Index

| Keyword | Index |
|---|---|
| PCOS | 83.3 |
| Levothyroxine | 74.6 |
| Endometriosis | 53.5 |
| Perimenopause | 50.3 |
| Luteal phase | 48.8 |
| ADHD women | 18.3 |
| HRT menopause | 7.0 |
| Hashimoto's | 11.8 |

### Google Trends — AI Health Market (April 2026)

| Keyword | 5-Year Baseline | Last 12 Months | Growth |
|---|---|---|---|
| AI health app | 5.3 | 25.2 | **+374%** |
| ChatGPT symptoms | 4.1 | 14.9 | **+263%** |
| ChatGPT health | — | 14.9 | Significant baseline |
| AI period tracker | 0.0 | 0.2 | **Blue ocean — nobody there** |
| AI PMDD | 0.0 | 0.0 | **Completely empty** |
| AI diagnosis | — | 5.0 | Growing |

**Key insight:** The AI + hormonal health category does not yet exist as a search category. Ora is a first-mover with no competition for the specific term "AI PMDD" or "AI period tracker."

### Reddit Engagement (April 2026)

| Community | Notable Data |
|---|---|
| r/adhdwomen | 6,965 upvotes on highest ADHD + hormones post; **AI-generated content banned** |
| r/PMDD | Active, high-intent community; **AI content banned (posts)**; users actively using ChatGPT |
| r/PCOS | Active, high frustration with existing apps; competitor being built in-community |
| r/Perimenopause | Growing rapidly, underserved by tools |
| r/Hashimotos | Niche but loyal; levothyroxine questions dominate |
| r/Endo | High engagement on tracking and diagnosis posts |

### AI User Voice (Direct Quotes from r/PMDD)

- *"ChatGPT has been a life changer. I can tell it how I'm feeling right in the moment and it has a reply right away. Even when I'm in the pits of depression and doom and blind with rage, this damn app has kept my wits about me."*
- *"I don't even know if it's life or luteal anymore… But my chat gpt has me."*
- *"I stopped using apps to track my period because of data security concerns. I'm really concerned about AI over usage."*

**What these quotes mean:** High demand for AI assistance exists AND high distrust of AI exists in the same community. Ora's design — data serves only the user, deletion is real, opt-out is prominent — is the direct response to the distrust.

---

*Document compiled: April 25, 2026*
*Updated: April 25, 2026 — Part 5 (Ora AI Companion) added following full team AI feature meeting*
*Based on: 5 parallel executive working sessions (Brand/Design, Product/UX, Marketing/SEO/Social, Engineering/Clinical, AI Feature)*
*Next review: 30 days post-launch*

---

**File Index:**
- `product-brief.md` — This document. Master reference. Updated April 25, 2026 with Ora AI companion (Part 5).
- `ai-feature-team-meeting.md` — Full team meeting transcript on Ora: 6 features, data deletion architecture, pricing, visual design, technical architecture. All 9 team members. All key decisions.
- `naming-debate.md` — Emergency naming session: why SYN/LUX/Via were rejected, full debate on candidates, unanimous selection of **Ora** with etymological rationale and visual identity argument.
- `brand-team.md` — Full brand team working session: brand identity, motto development, user interviews, doctor interviews, competitive analysis
- `product-ux-team.md` — Full product/UX team working session: behavioral research, onboarding design, proactive UX strategy, retention mechanics
- `visual-design-team.md` — Full visual design team working session: logo, color system, typography, motion principles, A/B testing results
- `hormonaiq-platform.md` — Live market data, condition breakdowns, tech stack costs, revenue model, YC pitch
- `plan.md` — Launch plan, all Reddit/Twitter/TikTok copy, 30-day calendar, build sequence
- `launch-posts.md` — 5 Reddit posts, 10-tweet thread, 3 standalone tweets, TikTok script, hashtag strategy
