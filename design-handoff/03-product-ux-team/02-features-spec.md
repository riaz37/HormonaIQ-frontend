# HormonaIQ — Feature Specification
**Version:** 2.0
**Date:** April 26, 2026
**Status:** MVP through Platform
**Companion document:** research/feature-research.md (clinical evidence base), docs/04-design/brand-and-ux.md (design philosophy)

---

## Section 1 — Feature Philosophy

Three principles govern every feature decision. When a feature violates any of these, it does not ship.

### Principle 1: The Lowest-Capacity Test

Every feature must be usable by someone in the hardest phase of their cycle — luteal peak, day 23, brain fog, fatigue, shortened fuse. If it requires explanation, reading, or more than 3 taps, it fails. The users who need the app most are also the users with the least energy to use it. We design for that moment first, and every other moment benefits.

### Principle 2: Clinical Grade or Nothing

HormonaIQ tracks medical-grade conditions. PMDD, PCOS, perimenopause, and ADHD-hormone overlap are not wellness preferences — they are DSM-5 diagnoses, Rotterdam-criteria conditions, and STRAW+10-staged transitions. Every tracking feature is built against a clinical standard, not a UX assumption. We do not invent our own symptom scales. We implement the DRSP, the Greene Climacteric Scale, the Ferriman-Gallwey scale. When we produce a physician report, it is formatted for a psychiatrist or OB-GYN to act on, not formatted to impress a user.

### Principle 3: Privacy Is a Feature, Not a Setting

Every feature that touches health data is designed with the post-Roe, post-Flo-verdict threat model in mind. No feature requires an account. No feature sends data to advertising SDKs. No feature stores data server-side without explicit, informed, opt-in consent. The user's health data is their data. Period.

---

## Section 2 — MVP Feature Set (Ship in 8 Weeks)

These 10 features are the minimum viable product. Every one is P0 or P1. The app does not launch without all P0 features complete and all P1 features in at least beta state.

---

### Feature 1: Phase-Aware Home Screen (Today Hub)

**One-line description:** A daily companion screen that updates its tone, content, and color based on the user's current cycle phase.

**User story:** As a woman with PMDD in luteal peak, I want to open the app and immediately feel understood — not greeted with chipper wellness copy — so that I engage rather than close it.

**Acceptance criteria:**
- Screen header updates language and color palette based on detected cycle phase (5 phases: follicular, ovulation, early luteal, luteal peak, menstruation)
- Phase-appropriate microcopy is displayed: no toxic positivity in luteal, no clinical coldness in menstruation (see brand-and-ux.md microcopy guide)
- A single "How are you feeling right now?" question is presented as the first interaction point
- One contextual nudge is shown (not a list of tasks) — e.g., "Log how you slept last night"
- Community pulse line shows anonymized count of others in the same phase today
- Screen renders correctly when cycle data is incomplete (graceful fallback to neutral tone)

**Conditions served:** All
**Priority:** P0
**Complexity:** M
**Why this makes MVP:** This is the first screen users see every day. If it fails the warmth test, churn begins on day 2. It sets the emotional contract of the entire app.

---

### Feature 2: 30-Second Log Flow

**One-line description:** A 5-step daily logging sequence completable in under 30 seconds from any screen via a persistent floating action button.

**User story:** As someone with ADHD and PMDD logging on a bad luteal day, I want to capture how I feel in 3 taps without filling out a form, so that I actually do it and build the dataset my doctor needs.

**Acceptance criteria:**
- Step 1 — Mood: 5 behavioral mood state icons (not emoji), tap one; maximum 1 second
- Step 2 — Physical: phase-contextual symptom chips pre-populated for the user's current phase (e.g., Day 22 luteal shows: bloating, cramps, fatigue, headache, breast tenderness, pelvic pain); tap any that apply; no typing required
- Step 3 — Cognitive: a single 1–5 slider for brain fog intensity; no additional fields
- Step 4 — Voice note (optional): mic icon with label "Want to say more? — optional"; skippable with one tap
- Step 5 — Confirmation: single-sentence acknowledgment matched to phase tone ("Logged. We've got this week noted. Rest is not failing.")
- Floating action button (56px, sage, above bottom nav) accessible from every screen in the app
- Entire flow completable without scrolling on a standard 390px viewport
- Log editable within 24 hours

**Conditions served:** All
**Priority:** P0
**Complexity:** M
**Why this makes MVP:** Without a frictionless log, no data accumulates. Without data, the intelligence layer has nothing to work with. The log is the foundation of the entire product.

---

### Feature 3: Cycle Calendar (Ring View)

**One-line description:** A visual cycle map showing current phase, past phases, and symptom density — not a period countdown clock.

**User story:** As a woman who has been manually tracking in a Notion spreadsheet for two years, I want to see my entire hormonal history at a glance so that I can stop maintaining a spreadsheet and start seeing patterns I couldn't see before.

**Acceptance criteria:**
- Calendar displays current cycle as a ring with 5 color-coded phase segments (using phase color system from design-tokens.yaml)
- Each logged day shows a dot with intensity indicator (empty = no log, filled = logged, filled + color = symptom intensity above baseline)
- Tapping any past day reveals a summary of what was logged that day
- Irregular cycle mode: calendar does not require fixed 28-day cycle; adapts to actual logged period start dates
- PCOS mode: anovulatory cycles are represented distinctly (not as "late periods")
- Horizontal scroll to navigate past cycles (at least 6 months back visible)
- No fertility window highlight by default — this requires explicit opt-in and is not on by default

**Conditions served:** All
**Priority:** P0
**Complexity:** L
**Why this makes MVP:** The calendar is the proof-of-intelligence. It shows users their data is being captured meaningfully. Without it, the app feels like a black box.

---

### Feature 4: DRSP-Compliant PMDD Tracker

**One-line description:** A clinically valid daily symptom severity log built on the 11-domain DSM-5 Daily Record of Severity of Problems (DRSP) instrument.

**User story:** As a woman who has spent two years trying to get a PMDD diagnosis, I want to track my symptoms on the exact clinical scale my psychiatrist uses so that when I walk into her office I have the two cycles of prospective data she needs to diagnose me.

**Acceptance criteria:**
- Captures all 11 DRSP symptom domains rated on a 1–6 Likert scale (1 = Not at all, 6 = Extreme)
- Domains: depressed mood, anxiety/tension, mood swings/rejection sensitivity, anger/irritability/conflict, decreased interest in activities, difficulty concentrating, fatigue/low energy, appetite changes, sleep changes, overwhelmed/out of control, physical symptoms (breast tenderness, bloating, joint/muscle pain, headaches)
- Tracks post-menstrual remission window automatically (7 days post-period onset); remission window is logged separately and labeled distinctly in reporting
- Visual alert appears (non-alarmist, inline) when 5+ symptoms score ≥ 3 during luteal phase window — alert reads: "This looks like a significant luteal week. Your data is being noted."
- Multiple entries allowed per day; last entry before midnight is used as the day's score; earlier entries are preserved in history
- Data retained for minimum 2 full cycles before report generation is offered (see Feature 9)
- DRSP tracking accessible via a dedicated section within the log flow; presented as an optional extension after the 30-second log (not replacing it)

**Conditions served:** PMDD
**Priority:** P0
**Complexity:** M
**Why this makes MVP:** This is the single feature that no competitor has. It is HormonaIQ's primary clinical differentiation for the PMDD segment, the largest monetization signal, and the feature most cited by users as missing.

---

### Feature 5: Condition Profile Setup (Onboarding)

**One-line description:** A 4-screen onboarding flow that configures the app to the user's specific conditions without requiring a medical intake form.

**User story:** As a woman with both PCOS and ADHD, I want to tell the app which conditions apply to me so that the tracking modules, phase chips, and insights are relevant to my actual health situation — not generic period tracking.

**Acceptance criteria:**
- Screen 1 — Welcome: brand-tone copy ("You found us. This isn't a period tracker."); single CTA
- Screen 2 — Condition selection: checkbox list — PMDD or severe PMS / PCOS / Perimenopause or menopause / ADHD that fluctuates with my cycle / I want to understand my patterns; all options selectable simultaneously; "All of the above, honestly" option included
- Screen 3 — The Promise: privacy and honesty pledge; no data collection before this screen
- Screen 4 — Minimum viable setup: last period start date OR "I don't track periods" toggle; cycle length estimate OR "My cycles are irregular"; done
- Zero medical forms, zero required health questions beyond screen 4 inputs
- Selected conditions activate the relevant module(s) throughout the app; modules can be added or removed from settings at any time
- No account or email required to complete onboarding; account creation is offered after setup, not as a prerequisite

**Conditions served:** All
**Priority:** P0
**Complexity:** S
**Why this makes MVP:** Without condition profiling, every user receives the same generic experience. Personalization from day one is the signal that this is not another period tracker.

---

### Feature 6: Privacy-First Data Architecture

**One-line description:** Device-local data storage by default with zero analytics SDKs and an in-app privacy transparency dashboard.

**User story:** As a woman in Texas who tracks her cycle, I want to be certain that my health data cannot be subpoenaed from a company server, so that I can use this app without legal risk.

**Acceptance criteria:**
- All health data stored on-device by default; no health data transmitted to any server without explicit opt-in
- Server sync is opt-in, presented after onboarding, never required for app functionality
- No Meta SDK, Google Analytics SDK, Firebase Analytics, AppsFlyer, or advertising SDK integrated anywhere in the application binary
- In-app Privacy Dashboard accessible from the You tab showing: what data is on-device, what (if anything) has been synced, and a plain-language explanation of what happens under a law enforcement request ("If we received a subpoena, here is what we would have to provide: nothing — your data is not on our servers unless you opted into sync.")
- One-tap data deletion with: immediate execution (no 30-day retention), confirmation of permanence, and an offer to export before deletion
- Export function produces a JSON file of all health data stored on device
- No account required to access any core health feature

**Conditions served:** All
**Priority:** P0
**Complexity:** L
**Why this makes MVP:** Privacy is a differentiator and a legal necessity. Building privacy-correct from day one costs less than retrofitting it. The Flo verdict makes this non-negotiable.

---

### Feature 7: Phase Education Cards (Cycle Explainer)

**One-line description:** Daily in-app plain-language explanation of what hormones are active today, why, and how that connects to what the user logged.

**User story:** As a woman who has spent years being told her symptoms are "just hormones" without anyone explaining what that actually means, I want the app to tell me what is happening in my body today in language I can understand, so that I feel informed rather than dismissed.

**Acceptance criteria:**
- Each day, a Phase Card is displayed on the Today screen showing: current cycle day, current phase name, the primary hormonal dynamic of this phase in 2–3 sentences (plain language, not clinical), and one connection to what the user logged today or recently
- Cards are written for the 5 phases plus transition days
- Language does not contain medical jargon without plain-language parenthetical
- Cards for luteal peak and menstruation do not contain toxic positivity ("Your body is doing amazing things!"); they contain honest acknowledgment ("Estrogen and progesterone drop sharply in this window. That's why the harder symptoms cluster here.")
- Cards are dismissible; dismissed cards do not reappear on the same day
- Cards are not reprompted if user has logged and already seen the card

**Conditions served:** All
**Priority:** P1
**Complexity:** S
**Why this makes MVP:** Education is the "why" that transforms passive logging into engaged daily use. Users who understand what they're tracking continue tracking. Users who don't, stop.

---

### Feature 8: Basic Insights Dashboard

**One-line description:** A visual summary of the user's logged data over the current and previous cycle, presented in Apple Health-style charts.

**User story:** As a woman who has been tracking for 6 weeks, I want to see whether my worst days actually cluster in a specific phase so that I have confirmation (or surprising new information) about my patterns.

**Acceptance criteria:**
- Severity Line Chart: symptom intensity over cycle days, current cycle overlaid on previous cycle in two distinct line weights
- Phase Bar: horizontal phase timeline at the top of the chart with color-coded phase segments; user can see exactly which phase their worst days fell in
- Mood Distribution: simple breakdown of how each mood state was distributed across the current cycle
- Brain fog trend: cognitive score over cycle days
- All charts use the phase color system from design-tokens.yaml; no chart uses pure black or alarming red outside crisis contexts
- Charts are accessible: labeled axes, sufficient contrast, no color-only encoding (pattern + color)
- Empty state copy: "Your first cycle of data will show up here. It takes about 4 weeks to start seeing patterns." — no pressure framing

**Conditions served:** All
**Priority:** P1
**Complexity:** M
**Why this makes MVP:** Insights are the retention mechanism. Users who see their pattern stay. The chart that shows "yes, my worst days are always luteal" is the moment the app becomes indispensable.

---

### Feature 9: 2-Cycle PMDD Diagnostic Report (PDF Export)

**One-line description:** A physician-ready PDF report generated after 2 cycles of DRSP-compliant tracking, formatted for a psychiatrist or OB-GYN to act on.

**User story:** As a woman who has been dismissed by three doctors and told her PMDD symptoms are "just PMS," I want to hand my doctor a document that speaks her language — clinical severity scores, luteal vs. follicular comparison, DSM-5 checklist — so that I can finally get diagnosed and treated.

**Acceptance criteria:**
- Report available after 2 complete cycles of daily DRSP tracking (defined as ≥ 22 logged days per cycle with ≥ 14 luteal-window days logged)
- Report includes: patient-entered name or anonymous ID, date range, day-by-day severity heatmap for all 11 DRSP domains, luteal vs. follicular average score comparison per domain, post-menstrual remission window data, DSM-5 PMDD criteria checklist with checked criteria highlighted, and a plain-language summary for physician context
- Report format is PDF, A4 and Letter sizes
- Report header includes: "This report was generated from prospectively collected daily symptom data consistent with ACOG 2023 guidelines for PMDD documentation."
- Report does NOT state a diagnosis; it states: "The following data was collected prospectively over 2 menstrual cycles. Diagnostic interpretation is the clinician's responsibility."
- Export is one tap from the Insights screen; no account required; file saved locally and shareable via standard iOS/Android share sheet
- Report is readable by non-technical clinical staff: no app branding overwhelms clinical data

**Conditions served:** PMDD
**Priority:** P1
**Complexity:** M
**Why this makes MVP:** This is the feature that users will pay $15/month for. It converts the app from a logging tool into a medical advocacy instrument. No competitor offers this. It is the commercial engine of the MVP.

---

### Feature 10: Notification System (Phase-Aware Push)

**One-line description:** An opt-in push notification system that delivers phase-appropriate, non-alarmist messages at clinically useful moments.

**User story:** As someone who often forgets to log during my worst luteal days because I have no energy, I want a gentle push notification at the time I usually log so that my data doesn't have gaps during the phase that matters most.

**Acceptance criteria:**
- All notifications are opt-in; presented as an offer after onboarding, not a permission demand
- Notification types: daily log reminder (user-set time, default 9pm), phase transition alert ("Heads up — you're heading into luteal"), luteal peak acknowledgment ("Day 21. This week can be hard. We're here."), log streak acknowledgment after 7 days ("You logged for 7 days straight. That's real data."), period prediction ("Your period is likely in the next 2–3 days")
- Notification copy follows brand-and-ux.md microcopy standards: no toxic positivity, no clinical coldness, no gamification language ("Day 5 Streak!!!") during hard phases
- Notification delivery timing respects phase: during detected luteal peak, system suppresses any non-health-related push (streak reminders, feature announcements)
- User can configure notification types independently (e.g., enable log reminders but disable phase alerts)
- Crisis-tier notification distinct from all others: uses system-level alert, not in-app notification style (see Feature handling in Section 3)

**Conditions served:** All
**Priority:** P1
**Complexity:** S
**Why this makes MVP:** Daily active use is the product. Without notification infrastructure, log completion rates drop to < 20% after week 2. Retention is directly tied to logging consistency.

---

## Section 3 — Month 2-3 Features (Intelligence Layer)

These features transform HormonaIQ from a logging app into an intelligent companion. They require at minimum 1 cycle of user data to deliver value. Build begins in parallel with MVP QA.

---

### Feature 11: Pattern Recognition Engine

**One-line description:** After 2 cycles of data, the app identifies the user's personal symptom patterns and surfaces predictive insights.

**User story:** As someone who has tracked for 2 months, I want the app to tell me what it has learned about my specific patterns so that I can prepare — not just be surprised — when hard days arrive.

**Acceptance criteria:**
- Pattern detection activates after 2 complete cycles (≥ 22 logged days each)
- Patterns detected and surfaced: worst symptom days correlated to cycle phase, sleep disruption timing before period, mood pattern consistency across cycles, brain fog correlation with phase
- Predictive language: "Last month, your hardest days were around day 22–24. Tomorrow is day 21." — specific, not vague
- Predictions are shown as informational, not alarmist; tone follows luteal-peak sensitivity rules from brand-and-ux.md
- Predictions include confidence signal: "This matches your last 2 cycles" vs. "We need more data to confirm this pattern"
- No prediction is shown with less than 2 cycles of supporting data; empty state reads "We're still learning your patterns — 3 more weeks of logging will unlock your personal insights"

**Conditions served:** All
**Priority:** P0 (Month 2)
**Complexity:** L
**Why this makes Month 2:** This is the moment the app becomes intelligent. It transforms the value proposition from "tracking tool" to "companion who knows you." It is the feature that drives word-of-mouth.

---

### Feature 12: Lab Value Vault (PCOS)

**One-line description:** A structured input and trend-tracking system for PCOS-relevant lab biomarkers with plain-language interpretation.

**User story:** As a woman with PCOS who has 3 years of lab results scattered across two patient portals and a spreadsheet, I want to enter my key biomarkers into one place and see whether they're trending in the right direction, so that I can have an informed conversation with my endocrinologist.

**Acceptance criteria:**
- Supports input for all major PCOS-relevant biomarkers: LH, FSH, LH:FSH ratio, total testosterone, free testosterone, DHEA-S, SHBG, fasting insulin, HOMA-IR, AMH, fasting glucose, HbA1c, androstenedione, TSH, prolactin
- Each entry requires: value, unit, date, and optional fasting status; lab name is optional
- App displays plain-language interpretation for entered values: "Your LH:FSH ratio is 3.2:1 — this is above the PCOS-associated threshold of 2:1. This is common in PCOS and worth discussing with your doctor."
- Trend chart per biomarker over time using the Lab Value Trend Chart component
- Smart reminders: based on last entry date, app suggests recheck: "It's been 7 months since your last testosterone test — your doctor may want to recheck."
- Reminder frequency configurable per biomarker
- No account required; lab data stored on-device by default
- Lab data included in optional physician export (PDF) upon user request

**Conditions served:** PCOS
**Priority:** P1 (Month 2)
**Complexity:** M
**Why this makes Month 2:** PCOS users have the highest engagement with quantitative data. Lab tracking addresses a genuine pain point (fragmented lab records) and creates a stickiness lever that no competitor offers.

---

### Feature 13: ADHD Executive Function Check-in

**One-line description:** A daily 60-second ADHD symptom tracker covering 5 executive function dimensions, correlated to cycle phase over time.

**User story:** As a woman with ADHD who suspects her medication stops working in her luteal phase, I want to track my focus, memory, and emotional regulation every day alongside my cycle so that I can show my prescriber data instead of just describing a feeling.

**Acceptance criteria:**
- 5 dimensions tracked daily: task initiation ("How hard was it to start tasks today?"), sustained attention ("How long before focus broke?"), working memory ("Did memory feel sharp?"), impulse control ("Did you say or do things you regretted?"), emotional regulation ("Did emotions feel bigger than the situation?")
- Each dimension rated 1–5; interaction is slider or single-tap scale (not text)
- Optional: medication log — "Did your medication feel like it worked today?" with response options: Yes / Partial / No / Didn't take
- ADHD check-in is accessible as an optional 4th step after the 30-second log (not replacing it)
- After 2 cycles of data: automatic phase-by-phase breakdown generated in Insights ("Your executive function scores are 38% lower in late luteal than in follicular")
- ADHD module not shown to users who did not select ADHD in condition profile

**Conditions served:** ADHD
**Priority:** P1 (Month 2)
**Complexity:** M
**Why this makes Month 2:** The ADHD-hormone intersection is completely unserved by any competitor. This feature converts a vocal, data-oriented community (ADDitude readership, CHADD members) into early adopters and advocates.

---

### Feature 14: Medication Effectiveness Tracker

**One-line description:** A daily log of ADHD medication response correlated to cycle phase, producing phase-by-phase efficacy data over 2+ cycles.

**User story:** As a woman who adjusts my Adderall dose based on my cycle but has no documentation to show my psychiatrist, I want to log how my medication works each day alongside my cycle data so that I have evidence for a cycle-dosing conversation.

**Acceptance criteria:**
- Daily medication log: brand, dose (mg), time taken, effectiveness rating (Yes / Partial / No / Didn't take)
- Dose variations are logged; algorithm accounts for dose changes when calculating effectiveness trends
- After 2 cycles: phase-by-phase medication effectiveness chart generated ("Medication rated effective: Follicular 89% / Ovulation 94% / Early Luteal 71% / Late Luteal 43% / Menstruation 52%")
- Integrated with ADHD Executive Function Check-in — both datasets plotted on same chart for holistic view
- Results feed into the Cycle Dosing Report (Feature 15)

**Conditions served:** ADHD
**Priority:** P1 (Month 2)
**Complexity:** S
**Why this makes Month 2:** Medication tracking without cycle correlation is generic. Cycle-correlated medication effectiveness is the insight that drives the prescriber conversation and the feature that ADHD communities share.

---

### Feature 15: Luteal-Phase ADHD Report (Cycle Dosing Report)

**One-line description:** A physician-shareable PDF summarizing phase-by-phase ADHD symptom severity and medication effectiveness, with a structured prescriber conversation guide.

**User story:** As a woman whose psychiatrist has never heard of cycle dosing for ADHD, I want to hand her a document that makes the case — with my specific data and supporting clinical research — so that I can get a luteal-phase dose adjustment without having to fight for it.

**Acceptance criteria:**
- Report generated after 2 cycles of both ADHD check-in and medication effectiveness tracking
- Report includes: phase-by-phase executive function score averages, phase-by-phase medication effectiveness percentages, a side-by-side follicular vs. late luteal comparison, and a structured prescriber note ("Premenstrual dose adjustment of stimulant medications is supported by published clinical research — PMC10751335. This patient's tracking data shows [X]% lower medication effectiveness and [Y]% lower executive function scores in the late luteal phase.")
- Research citation included and accurate; language clearly states "for prescriber discussion" not as a diagnosis or treatment recommendation
- Same PDF quality and formatting standard as the DRSP report (Feature 9)
- Shareable from Insights screen in one tap

**Conditions served:** ADHD
**Priority:** P1 (Month 2)
**Complexity:** M
**Why this makes Month 2:** Symmetrical with the DRSP report for PMDD users — this is the physician communication tool for ADHD users. It is the feature that makes the $15/month feel like a bargain.

---

### Feature 16: Perimenopause Hot Flash Logger

**One-line description:** A targeted hot flash and night sweat logging tool with time-of-night tracking and cardiovascular risk pattern flagging.

**User story:** As a 47-year-old in perimenopause, I want to log every hot flash with the time it happened so that when I see my cardiologist I can show her that most of mine happen after 3am — which I've read is the higher-risk pattern.

**Acceptance criteria:**
- Log entry fields: date/time (auto-filled from timestamp, adjustable), intensity 1–5, estimated duration in minutes, whether it woke the user from sleep (yes/no), associated heart pounding or palpitations (yes/no)
- Accessible via a dedicated quick-tap shortcut in the 30-second log flow for perimenopause users
- Weekly summary in Insights: total hot flash count, percentage occurring in second half of night (midnight–6am), average intensity
- When ≥ 60% of logged hot flashes are second-half-of-night over a 2-week period: surfaced as an insight ("Most of your hot flashes are occurring in the second half of the night — research shows this pattern is associated with higher cardiovascular risk. This is worth mentioning at your next appointment.") — informational, not alarmist; links to source
- Data included in perimenopause physician export

**Conditions served:** Perimenopause
**Priority:** P1 (Month 2)
**Complexity:** S
**Why this makes Month 2:** Hot flash timing is a clinically significant data point that no app currently captures. This alone differentiates HormonaIQ for the perimenopause segment.

---

### Feature 17: HRT Effectiveness Tracker

**One-line description:** A before/after comparison tool that quantifies symptom change since HRT initiation for perimenopause users.

**User story:** As a woman who started an estradiol patch 6 weeks ago and is not sure if it's working, I want the app to compare my hot flash frequency, sleep quality, and mood scores from before I started to now so that I have data to bring to my appointment instead of saying "I think it might be helping but I'm not sure."

**Acceptance criteria:**
- User inputs: HRT start date, type (patch / oral / gel / vaginal / combined), dose, brand (optional)
- App automatically creates a pre-HRT baseline from logged data prior to start date (minimum 2 weeks of prior data)
- Weekly HRT effectiveness card in Insights: comparison of hot flash frequency, sleep wake count, mood scores, brain fog scores before vs. current week since start
- Plain-language summary: "Week 6 on estradiol patch — your night sweat frequency is down 58% vs. your pre-HRT average. Mood scores are trending up."
- Physician-shareable one-page HRT response summary exportable from Insights
- Tracks dose changes: when dose is adjusted, creates a new baseline segment

**Conditions served:** Perimenopause
**Priority:** P1 (Month 2)
**Complexity:** M
**Why this makes Month 2:** HRT effectiveness monitoring is a direct answer to a stated clinical need. Women on HRT often don't know if it's working. This feature answers that question with data.

---

### Feature 18: Androgen Symptom Tracker (PCOS)

**One-line description:** A systematic tracker for androgen-driven PCOS symptoms — acne, hirsutism, and hair loss — using clinically graded scales.

**User story:** As a woman with PCOS who manages jawline acne and chin hair growth as her primary symptoms, I want to track these systematically so that when I discuss my anti-androgen medication with my dermatologist I have 3 months of severity data rather than "it's about the same I think."

**Acceptance criteria:**
- Acne tracking: body zone selection (jawline, chin, forehead, cheeks, back, chest), severity per zone 1–5, optional photo (stored locally, never synced without explicit permission)
- Hirsutism tracking: body zone selection (chin, upper lip, jawline, chest, abdomen, inner thighs, lower back), growth intensity 1–5 per zone; interface adapted from modified Ferriman-Gallwey scale framing
- Hair loss tracking: shedding count (optional, user-self-reported), vertex thinning self-report yes/no
- Weekly summary chart: acne severity trend over time, hirsutism by zone over time
- Correlates flare patterns to cycle phase where data is sufficient
- Integrated into PCOS physician export as an androgen symptom summary section

**Conditions served:** PCOS
**Priority:** P2 (Month 2–3)
**Complexity:** M
**Why this makes Month 2–3:** Androgen symptoms are a primary quality-of-life issue for PCOS users. Systematic tracking is absent from every competitor. Phase 3 adds photo journaling and dermatologist-specific export.

---

### Feature 19: Crisis Safety System

**One-line description:** A 3-tier, non-alarmist crisis response system that activates contextually during detected high-severity luteal periods and upon explicit user request.

**User story:** As a woman with PMDD who experiences suicidal ideation in my luteal phase, I want the app to acknowledge this reality and provide resources — without treating me like a crisis case every time I log that I feel low — so that I can use the app honestly during my worst days.

**Acceptance criteria:**
- Tier 1 (contextual, non-intrusive): During luteal peak phase, a single-line addition to the Today screen — "Some days in this phase can feel really dark. If that's where you are, tap here." — persistent but visually quiet; uses a soft lavender text link, not a red button
- Tier 2 (user-initiated): Tapping the Tier 1 link shows a dedicated Crisis Safety Card (full-screen modal): acknowledging language first ("This phase is genuinely hard. What you're feeling is real."), then 3 resource links: IAPMD hotline, Crisis Text Line (text HOME to 741741), and a local emergency option (country-detected); also includes: "Would you like us to simplify the app for today?" (activates reduced-UI mode)
- Tier 3 (severity trigger): When DRSP item 1 (depressed mood/hopelessness) scores 6 for 3 consecutive days: Tier 2 card is presented automatically on next app open; copy: "We noticed your last 3 days have been really hard. Here's what might help right now." — this is the only automatic escalation; it does not send notifications or contact anyone
- No notification is sent for any crisis tier — all responses happen within the app
- Crisis state does not create a permanent record or flag in the user's data; it is treated as a sensitive moment, not a data event
- Crisis UI uses z-index crisis token (9999) — always above all other content
- Crisis copy reviewed by a licensed clinical psychologist before shipping

**Conditions served:** PMDD, All (Tier 1 available to all users in detected luteal peak)
**Priority:** P0 (Month 2 — cannot ship intelligence layer without crisis safety)
**Complexity:** M
**Why this makes Month 2:** The app is about to start surfacing pattern insights to users. Some of those insights will surface hard truths. The crisis system must exist before the intelligence layer goes live.

---

### Feature 20: Ora AI Insight Engine

**One-line description:** A conversational AI companion layer that synthesizes the user's logged data into personalized, phase-aware insights — "Ora" — delivering 1–2 insights per week on the Today screen.

**User story:** As someone who logs every day but doesn't always know what to do with the information, I want the app to tell me what it has noticed in my data this week — in plain, warm language — so that I understand my own patterns without having to interpret raw charts.

**Acceptance criteria:**
- Ora insights appear on the Today screen as dedicated Ora Cards (distinct visual treatment — see ui-components.md Section 5)
- Frequency: maximum 2 Ora insights per week; do not show during detected luteal peak days 23–26 (lowest cognitive bandwidth)
- Insight types: pattern surface ("Your brain fog scores are consistently higher on nights following hot flashes"), anomaly detection ("This cycle, you logged 3 fewer bad days in early luteal than last month — what changed?"), preparation signal ("Last cycle, day 21 was your worst day. Tomorrow is day 20."), medication insight ("Your medication effectiveness scores dropped 40% in late luteal this cycle"), encouragement (only earned — after completing a hard PMDD window: "You've just been through one of the harder stretches. Your data shows you made it through. That matters.")
- All Ora copy is reviewed for tone before shipping: no vague affirmations, no self-help language, no unsubstantiated claims
- Ora does not diagnose, prescribe, or recommend treatment; every insight that approaches clinical territory ends with "worth discussing with your doctor"
- Ora insights are dismissible; dismissed insights are not shown again

**Conditions served:** All
**Priority:** P1 (Month 3)
**Complexity:** L
**Why this makes Month 3:** Ora is the app's personality and competitive moat. It transforms the product from data logger to intelligent companion. It requires 2 cycles of data to generate meaningful insights — hence Month 3 timing.

---

## Section 4 — Month 4-6 Features (Platform Layer)

These features expand HormonaIQ from a personal health companion into a clinical platform. They require stable infrastructure, user data scale, and clinical review processes.

---

### Feature 21: ADHD-PMDD Overlap Detector

**One-line description:** An automated co-occurrence detection system that identifies when a user's tracked data matches the known 46% ADHD-PMDD comorbidity pattern.

**User story:** As a woman with ADHD who was told her emotional dysregulation is "just ADHD," I want the app to tell me if my symptoms suggest PMDD co-occurs with my ADHD so that I can explore this with my psychiatrist.

**Acceptance criteria:**
- Activates only when user has both ADHD module and DRSP module enabled with 2+ cycles of data
- Detection logic: identify whether DRSP mood symptoms AND ADHD executive function scores both spike in luteal phase (days 20–28) and remit post-period
- When pattern confirmed: surface an Ora insight — "Research shows 46% of women with ADHD also experience PMDD. Your tracking pattern over the last 2 cycles is consistent with this overlap. This is worth exploring with your psychiatrist or OB-GYN."
- Includes one-tap access to a shareable summary for clinician (data only — no diagnosis stated)
- Detection insight shown once; user can pin it to their You > My Story timeline

**Conditions served:** ADHD, PMDD
**Priority:** P1 (Month 4)
**Complexity:** M

---

### Feature 22: Perimenopause Stage Identifier

**One-line description:** An automatic STRAW+10-based staging system that identifies and communicates perimenopause transition stages from cycle interval data.

**User story:** As a 44-year-old whose cycles have become unpredictable, I want the app to tell me what stage of perimenopause I might be in — using real clinical criteria — so that I can advocate for myself with a doctor who keeps telling me I'm "too young for perimenopause."

**Acceptance criteria:**
- Tracks cycle length variability over time; compares to STRAW+10 staging criteria
- Early perimenopause flag: cycle length varies ±7 days from user's established baseline across 3+ cycles
- Late perimenopause flag: 2 or more cycles with >60-day gaps
- Stage surfaced as an Ora insight with plain-language explanation and suggested next step ("This pattern is consistent with early perimenopause by the STRAW+10 clinical framework. Your doctor can confirm with a blood test.")
- Stage identifier does not require account; calculated from local data

**Conditions served:** Perimenopause
**Priority:** P2 (Month 4)
**Complexity:** M

---

### Feature 23: Multi-Condition Overlay View

**One-line description:** A unified chart view that displays PMDD severity, PCOS metabolic indicators, ADHD executive function scores, and perimenopause symptoms on a single timeline.

**User story:** As a woman with PCOS and ADHD and suspected PMDD, I want to see all my tracked data on one chart so that I can see whether my worst days for all three conditions cluster at the same time.

**Acceptance criteria:**
- Overlay chart: 4 data lines plotted on same cycle-day x-axis using distinct visual encodings (not color-only — also uses line weight and dash pattern)
- User configures which data types to include in overlay (not all shown by default)
- Hovering/tapping any data point shows logged value and phase context
- Overlay export included as one page of the multi-condition physician report

**Conditions served:** All (multi-condition users)
**Priority:** P2 (Month 4)
**Complexity:** L

---

### Feature 24: Irregular Cycle Mode (Full)

**One-line description:** A complete mode for users whose cycles are not regular, including anovulatory cycle tracking, variable cycle length prediction, and PCOS-aware phase estimation.

**User story:** As a woman with PCOS whose cycles range from 35 to 80 days, I want to use every feature of this app without the app constantly telling me my cycle is "late" or showing me a calendar that assumes I ovulate on day 14.

**Acceptance criteria:**
- No 28-day default assumed anywhere in the UI; cycle length learned from logged period start dates
- Anovulatory cycles logged distinctly: user can mark a cycle as anovulatory (no confirmed ovulation)
- Phase estimation for irregular cycles uses probabilistic range ("You may be in late follicular or approaching ovulation — log how you feel and we'll learn your pattern")
- No "your period is X days late" alerts — replaced with "You haven't logged a period since [date]. Is this a longer cycle for you?"
- Calendar view accommodates variable-length cycles without visual distortion

**Conditions served:** PCOS, All
**Priority:** P1 (Month 4)
**Complexity:** L

---

### Feature 25: Weekly Greene Climacteric Scale Assessment (Perimenopause)

**One-line description:** A weekly 21-item Greene Climacteric Scale assessment generating 6 clinical subscores and a trend visualization for perimenopause users.

**User story:** As a perimenopausal woman who sees a menopause specialist, I want to bring a validated symptom severity score to every appointment so that my doctor can see my trajectory — not just hear me describe how I feel.

**Acceptance criteria:**
- 21 Greene Climacteric Scale items presented weekly; each rated 0–3 (Not at all / A little / Quite a bit / Extremely)
- 6 subscores calculated: Psychological, Anxiety, Depressed Mood, Vasomotor, Somatic, Sexuality
- Weekly score comparison chart: each subscore over time (minimum 8 weeks to be useful)
- GCS report exportable as PDF with trend charts and raw weekly scores; format references the validated instrument
- Weekly prompt delivered as a gentle in-app card (not a push notification by default)

**Conditions served:** Perimenopause
**Priority:** P1 (Month 4–5)
**Complexity:** M

---

### Feature 26: GSM (Vaginal and Urinary) Tracker

**One-line description:** A discreet, private tracker for genitourinary syndrome of menopause symptoms — vaginal dryness, pain with sex, bladder urgency, UTI frequency.

**User story:** As a perimenopausal woman experiencing vaginal dryness and bladder urgency, I want to track these symptoms privately and include them in my physician report because no app has ever asked about them and they're significantly affecting my quality of life.

**Acceptance criteria:**
- Accessed via a private section within the Perimenopause module (not on the main log screen)
- Tracks: vaginal dryness (yes/no, severity 1–5), pain with intercourse (yes/no, severity 1–5), bladder urgency (frequency: none / occasional / frequent / constant), incontinence episodes (count per day), UTI symptoms (yes/no; prompts to log date for frequency tracking)
- All GSM data stored on-device only; not included in any sync by default
- GSM data included in perimenopause physician export upon explicit user selection
- Correlates with HRT use: if user is on HRT, tracks whether GSM symptoms are improving since HRT start

**Conditions served:** Perimenopause
**Priority:** P2 (Month 5)
**Complexity:** S

---

### Feature 27: Cognitive Symptom Tracker (Brain Fog Module)

**One-line description:** A daily cognitive symptom tracker adapted from the EMQ-R retrieval subscale, correlated with sleep quality, hot flash frequency, and cycle phase.

**User story:** As a perimenopausal woman who is experiencing word-finding difficulty for the first time in my life, I want to track whether it correlates with bad sleep nights and hot flashes so that I have an answer when my doctor asks if it's hormonal.

**Acceptance criteria:**
- Daily: word-finding difficulty (yes/no + notes field for examples), working memory lapses 1–5, concentration difficulty 1–5
- Adapted from EMQ-R retrieval subscale (3–4 items maximum per day — brain fog tracker must itself be low-cognitive-load)
- After 4 weeks: correlation analysis surfaced in Insights between cognitive scores and sleep quality scores from the same nights
- After 4 weeks with hot flash data: correlation with hot flash nights also surfaced
- Insight copy example: "Your brain fog scores are 2.3x higher on mornings after 3+ night sweats. This is a documented pattern in perimenopause research."

**Conditions served:** Perimenopause, All
**Priority:** P2 (Month 5)
**Complexity:** M

---

### Feature 28: Metabolic Snapshot (PCOS)

**One-line description:** A daily proxy-based insulin resistance monitor using energy, cravings, and post-meal brain fog as CGM-free indicators.

**User story:** As a woman with PCOS who doesn't own a CGM but manages insulin resistance through diet, I want to log my post-meal energy patterns and track whether they're getting worse or improving over time so that I have metabolic data to bring to my endocrinologist even without blood glucose data.

**Acceptance criteria:**
- Daily inputs (accessible as a 30-second add-on to the main log): post-meal energy at 2 hours (Energized / Flat / Crashed), sugar cravings intensity 1–5, post-meal brain fog (yes/no)
- Weekly summary: average post-meal energy by day of cycle; sugar craving trend
- Correlates metabolic indicators to cycle phase: "Your post-meal crashes are more frequent in luteal phase — this is consistent with progesterone's insulin-sensitizing effect"
- Weekly metabolic score (a simple composite) trended over time
- Data included in PCOS physician export

**Conditions served:** PCOS
**Priority:** P2 (Month 5)
**Complexity:** M

---

### Feature 29: Phase-Aware Scheduling Intelligence

**One-line description:** A daily "energy forecast" surfaced in the Today hub showing cognitive and physical capacity expectations for the current cycle phase — calibrated to ADHD users.

**User story:** As an ADHD woman who has learned to batch hard decisions in my follicular phase, I want the app to give me a one-line forecast each morning so that I can plan what kind of tasks to tackle today.

**Acceptance criteria:**
- Single-line daily forecast on the Today screen, phase-based and personalized when 2+ cycles of data exist
- Forecast types are not prescriptive; they are informational: "Follicular: typically a strong focus window. Good day for deep work or complex decisions." — "Late luteal: executive function tends to be lower in this phase. Lists help. Reducing decision load helps."
- Forecasts calibrated to user's personal data after 2 cycles (not just phase averages)
- Forecast is dismissible; reappears the next day
- Forecasts are not shown when the user has logged a mood state of 1 (most severe) — not appropriate to give scheduling advice when someone is in crisis

**Conditions served:** ADHD, All
**Priority:** P2 (Month 5–6)
**Complexity:** S

---

### Feature 30: Multi-Condition Physician Report (Comprehensive Export)

**One-line description:** A comprehensive physician-ready PDF export covering all active condition modules simultaneously, formatted for a generalist OB-GYN or multi-specialty team.

**User story:** As a woman with PCOS, PMDD, and ADHD who sees a GP, an endocrinologist, and a psychiatrist separately, I want to generate one report I can share with all three so that they all have the same baseline understanding of my full hormonal picture.

**Acceptance criteria:**
- Report aggregates data from all active modules: DRSP scores (PMDD), executive function and medication data (ADHD), GCS scores (perimenopause), androgen symptom severity (PCOS), lab vault data (PCOS), hot flash timing (perimenopause), and metabolic proxy data (PCOS)
- Each section is clearly labeled for the relevant specialist; sections not applicable to the user are not included
- Cover page includes: tracking period, active condition modules, and a one-paragraph plain-language summary of key findings
- Standard legal disclaimer: "This report contains prospectively self-reported symptom data. All clinical interpretation is the responsibility of the treating clinician."
- Export is one tap from Insights; file is a PDF saved locally and shareable via iOS/Android share sheet

**Conditions served:** All (multi-condition)
**Priority:** P1 (Month 6)
**Complexity:** M

---

### Feature 31: Voice Diet Logging via Ora

**One-line description:** A conversational food logging interface where users tell Ora what they ate — in natural speech or text — and Ora responds with PCOS/PMDD-relevant context (glycemic quality, insulin impact, phase relevance) — never calories.

**User story:** As a woman with PCOS and ADHD who cannot bring herself to open a food diary app, I want to just tell Ora "I had a bowl of rice with chicken and some chocolate" and have her respond with something useful about how that lands in my body this week — without counting anything.

**Acceptance criteria:**
- Voice (speech-to-text) and text input both accepted; "tell Ora what you ate" is the frame — not "log your food"
- Accepts imprecise, conversational descriptions: "leftover pasta," "a big bowl of whatever," "I stress-ate some chips" — no grams, no servings required
- Ora responds with 1–3 sentences: glycemic quality signal, phase context (e.g., "Lower GI options are more supportive during luteal phase"), relevant nutrients (protein, fiber) if identifiable from the description
- Ora NEVER mentions calories, macros, net carbs, or anything that functions as a food score
- Data stored: `meal_time`, `glycemic_quality` (H/M/L — inferred by Ora), `notable_items` (caffeine / alcohol / sugar / processed food — flagged by Ora from description), `post_meal_energy` (optional follow-up), `user_description` (raw text — preserved for physician report)
- Eating disorder safety screen at onboarding: "Some people find calorie tracking harmful. Do you have a history of eating disorders?" → if yes: additional ED safety guardrails active, no food-weight correlation is ever surfaced
- Works for PCOS and PMDD users — phase-aware responses adapt to which condition the user has active
- Integration point: food log data feeds the Diet-Symptom Correlation Engine (Feature 32)

**Clinical evidence:**
- r/PCOS user with AuDHD + PCOS + ARFID: already using ChatGPT conversationally for food management because no purpose-built tool exists (organic demand signal for this exact feature)
- PCOS has 4× general population rate of eating disorders — calorie tracking is contraindicated for a significant minority
- ADHD + PCOS overlap makes manual food diary entry a consistent failure point (executive dysfunction barrier)
- JMIR MARS 2025: engagement is the universal failure of existing PCOS apps; conversational logging is the lowest-friction, highest-engagement food tracking format

**Decisions (from team debate, April 2026):**
- NEVER display calories — unanimous team vote
- Voice logging is MVP P1 — 7-1 vote; Dr. Park (psychiatrist) abstained pending ED safety guardrail finalization
- Glycemic quality framing only — not macros, not carb counts, not food scoring

**Conditions served:** PCOS (primary), PMDD (secondary)
**Priority:** P1 — MVP
**Complexity:** M (Claude API integration + speech-to-text; core data model is simple)

---

### Feature 32: Diet-Symptom Correlation Engine

**One-line description:** An automated insight layer that surfaces patterns between logged food inputs (from Feature 31) and symptom scores — telling users "after high-sugar days, your energy crashes next morning" using their own data.

**User story:** As a PMDD user who suspects caffeine is worsening my luteal phase symptoms but can't prove it, I want the app to tell me — using my actual data — whether caffeine days correlate with higher irritability scores so I can bring evidence to my doctor.

**Acceptance criteria:**
- After 30+ diet logs and 30+ symptom logs (typically ~2 cycles), the correlation engine activates
- Identifies statistically meaningful patterns between `notable_items` flags (caffeine, alcohol, sugar, processed food) and symptom scores the following 12–24 hours
- Surfaces no more than 2 insights per week — insight overload is as harmful as no insights
- Insight phrasing: "Based on your data: on days you logged caffeine, your sleep quality score was 1.4 points lower the following night. Worth noting." — always based on the user's own data, never generic health claims
- Insight is dismissible and ratable ("helpful / not relevant")
- Insights feed the physician report export: "Diet-symptom correlations identified in [date range]"
- No inference drawn from fewer than 5 matched data points; statistical threshold is simple linear correlation, not ML — keep it interpretable
- PMDD users: luteal-phase correlations shown separately from follicular-phase correlations (same food, different hormonal context, different effect)
- The engine NEVER infers causation — language is always "we noticed a pattern" not "X causes Y"

**Clinical evidence:**
- PMDD: sugar elimination cures PMDD rage in high-engagement r/PMDD posts; caffeine elimination documented as significant trigger reducer; these effects are real but individual-level — only the user's own data can confirm their personal triggers
- PCOS: glucose tracking beats calorie tracking for weight management outcomes (r/PCOS, highest-upvote post in dataset); individual food-blood sugar correlations are the most clinically actionable insight possible

**Conditions served:** PCOS, PMDD
**Priority:** P1 — MVP (builds on voice logging infrastructure; minimal additional complexity once voice log data exists)
**Complexity:** S (simple correlation math on existing logged data; no ML required for v1)

---

### Feature 33: Food Photo Analysis (Phase 2 — Conditional)

**One-line description:** An optional camera-based food logging mode where users photograph a meal and Ora identifies the key items and provides the same glycemic quality and phase-context response as voice logging.

**User story:** As a PCOS user who already uses voice logging for dinner but wants a faster way to log lunch when I'm at a restaurant with friends, I want to tap a camera icon, photograph my plate, and have Ora identify what I'm eating — without anyone at the table knowing I'm tracking something.

**Acceptance criteria:**
- Photo processed via vision model (Claude vision API or equivalent) to identify meal components
- Ora generates: glycemic quality signal (H/M/L), notable items (sugar / processed / high-GI alert), phase-context note
- Never displays: calories, macros, carb counts, food scores, comparison to "ideal"
- User can correct Ora's identification ("that's quinoa, not rice") with one text edit
- Photos are NOT stored server-side after processing — processed locally or processed and immediately deleted; never used for training data without explicit opt-in
- Camera mode requires explicit activation (not the default logging mode — voice logging remains default)
- Eating disorder safety guardrail: users who flagged ED history at onboarding see a prompt before first use: "Photo logging can feel like tracking. You can skip this and keep using voice logging anytime."

**Gate conditions for shipping (from team debate, April 2026):**
1. Voice logging (Feature 31) must be live and used by ≥30% of active PCOS users first
2. Eating disorder safety screen must be fully implemented and tested
3. Clinical review from advisory board endocrinologist confirming glycemic quality framing is accurate and not harmful
4. Photo processing must be confirmed zero-retention (no photo stored after response)

**Team debate outcome:** 5-3 vote to build Phase 2 (Dr. Chen and Lisa abstained/opposed on ED risk grounds, Dr. Park expressed conditional support; James/Ananya/Ravi/Keiko/Amara voted to build with conditions). The conditions are binding — this feature does not ship without all 4 gates cleared.

**Conditions served:** PCOS (primary)
**Priority:** P2 — Phase 2, post voice logging validation
**Complexity:** M (vision API integration; same data model as voice logging; photo privacy architecture adds complexity)

---

## Section 4.5 — Condition-Specific Features from Clinical Specs

These features were specified in the PMDD and PCOS clinical specs (docs/01-clinical/pmdd-complete-spec.md and docs/01-clinical/pcos-complete-spec.md) and are formally added here. They are organized by condition and priority.

---

### Feature 34: Luteal Phase Predictor

**One-line description:** Predicts when the user is entering the luteal phase using cycle history, with a confidence interval — never uses overdue language.

**User story:** As a woman with PMDD who needs to prepare before my worst week arrives, I want the app to tell me "you're entering luteal in about 2 days" based on my actual cycle history so I can plan ahead instead of being blindsided.

**Acceptance criteria:**
- Uses cycle length history (mean ± SD method) to predict luteal phase start; updated after each new logged period
- Displays: "Based on your last 3 cycles, your luteal phase typically starts around day 16 ± 2 days"
- When user has <2 cycles logged: "We need more cycle data to predict your luteal phase — keep logging"
- For irregular cycles: shows wider confidence interval; never hides uncertainty
- Never displays "your period is X days late" — replaced with neutral date-based framing
- Luteal prediction feeds the Phase Transition Notification (Feature 10) and Safety Plan trigger (Feature 35)

**Conditions served:** PMDD, All
**Priority:** P0 — MVP
**Complexity:** M

---

### Feature 35: Pre-Built Safety Planning Tool

**One-line description:** A proactive safety plan the user builds during their well (follicular) phase — automatically surfaced before their historical high-risk luteal window.

**User story:** As a woman who has called 988 three times in the last year, always in my luteal phase, I want to have a safety plan ready before I need it — built when I'm thinking clearly — so that when day 24 arrives I'm not trying to remember what helps while I'm already in crisis.

**Acceptance criteria:**
- Accessible from the You tab at any time; prompted once after first complete cycle is logged
- Plan sections: (1) Warning signs I recognize early, (2) Coping strategies that work for me, (3) People I can call — name + number, (4) Things that make life worth living (user-written), (5) 988 + Crisis Text Line pre-loaded
- Plan creation is offered ONLY during detected follicular phase (not luteal) — the interface notes: "This is a good time to build this — you're in your clearer phase"
- Plan surfaces automatically 2–3 days before the user's historical peak-risk window (based on DRSP data)
- Surface trigger: gentle in-app card on Today screen — "Your higher-symptom window typically starts in about 2 days. Your safety plan is ready if you need it."
- Plan is NOT a notification — it is an in-app card only
- Plan is editable at any time from the follicular phase; read-only during luteal peak (prevents plan destruction in crisis state)
- Grounded in the Stanley-Brown Safety Planning Intervention evidence base

**Conditions served:** PMDD
**Priority:** P0 — Month 2 (must exist before Ora pattern insights go live)
**Complexity:** M

---

### Feature 36: SSRI Luteal-Phase Dosing Tracker

**One-line description:** Tracks SSRI name, dose, dosing pattern, and daily adherence — and correlates adherence gaps directly against DRSP symptom scores.

**User story:** As a woman on luteal-phase fluoxetine who sometimes forgets to start it on time, I want to see whether my symptom scores are higher in cycles where I started late so I have data to show my psychiatrist that timing actually matters.

**Acceptance criteria:**
- Fields: SSRI name (free text or selection), dose (mg), dosing pattern (continuous / luteal-phase intermittent / symptom-onset)
- Daily: "Did you take your SSRI today?" Binary; timed reminder optional
- For luteal-phase pattern: app prompts at predicted luteal phase start — "This is typically when you start your SSRI. Did you take it today?"
- After 2 cycles: generates a "dosing adherence vs. symptom score" overlay chart — days taken/not-taken shown against DRSP total score
- Plain-language insight: "In cycles where you started your SSRI within 2 days of luteal onset, your peak symptom scores averaged 18% lower"
- OCP formulation also captured — drospirenone vs. levonorgestrel vs. other (different mood profiles)

**Conditions served:** PMDD
**Priority:** P1 — Month 2
**Complexity:** S

---

### Feature 37: Supplement Tracker with Evidence Ratings

**One-line description:** Logs PMDD supplements with dose and displays a peer-reviewed evidence rating (Strong / Moderate / Limited / Unsupported) so users can distinguish what actually works from wellness noise.

**User story:** As a woman who has spent hundreds of dollars on supplements recommended in PMDD forums, I want to know which ones actually have clinical evidence behind them so I can make informed decisions instead of buying everything that gets mentioned on Reddit.

**Acceptance criteria:**
- Supplement list (pre-built + custom entry option): Calcium 1000–1200mg, Magnesium 300–400mg, Vitamin B6 (max 100mg — toxicity note above this dose), Vitamin D, Vitex agnus castus (chaste tree), Vitamin E, Saffron, Evening primrose oil, and custom entry
- Each supplement shows an evidence badge: **Strong** (ACOG-recommended; multiple RCTs) / **Moderate** (systematic review support; mechanism proposed) / **Limited** (small studies; inconsistent) / **Unsupported** (no RCT evidence; mechanism unclear)
- Evidence ratings: Calcium = Strong, Magnesium = Moderate, B6 = Moderate, Vitex = Moderate, Evening primrose oil = Unsupported
- B6 toxicity warning: if user enters dose >100mg, displays inline alert: "Vitamin B6 can cause nerve damage at doses above 100mg/day. Doses above 50mg should be discussed with a doctor."
- Daily adherence tracking: did you take it today?
- After 4 weeks: shows supplement adherence alongside DRSP score trend

**Conditions served:** PMDD, PCOS
**Priority:** P1 — Month 2
**Complexity:** S

---

### Feature 38: Rage and Mood Episode Log

**One-line description:** A one-tap quick-capture for acute mood episodes — rage, crying, dissociation, panic — with timestamp, intensity, duration, and optional voice note.

**User story:** As a woman whose PMDD causes explosive rage that she cannot remember clearly afterward, I want to tap a button during or immediately after an episode and capture the time, how intense it was, and what happened — so that when I see my psychiatrist I can show her 3 months of episode data instead of trying to reconstruct it from memory.

**Acceptance criteria:**
- Accessible from Today screen as a dedicated quick-tap: "Log an episode" (accessible within 1 tap from the home screen)
- Fields: episode type (rage / crying / panic / dissociation / overwhelm), intensity 1–5, estimated duration (under 5 min / 5–15 min / 15–30 min / 30+ min), optional voice note or text
- Timestamp is auto-filled from device time; editable within 10 minutes
- All episodes plotted on the cycle calendar as incident markers (distinct from symptom severity scores)
- Monthly summary: episode count by type, plotted against cycle phase; shows whether episodes cluster in a specific phase window
- Episode log is included in physician report as a timestamped incident record
- The "I snapped at my partner at 6:43pm on Day 24" evidence is exactly what clinicians need to confirm functional impairment (DSM-5 Criterion B)

**Conditions served:** PMDD
**Priority:** P1 — Month 2
**Complexity:** S

---

### Feature 39: Relationship Impact Log

**One-line description:** Dedicated logging for conflicts caused or worsened by PMDD, with relationship type, timestamp, and user control rating — building the evidence base for Criterion B and couples therapy.

**User story:** As a woman whose PMDD damages my relationship every month and whose partner thinks I'm just difficult, I want to document these conflicts with timestamps and cycle day so that we can both see the pattern and I can bring it to couples therapy.

**Acceptance criteria:**
- Accessible within the DRSP log as an optional extension after relationship_impact is scored ≥3
- Fields: conflict type (argument / withdrawal / said something hurtful / relationship avoided), relationship type (partner / parent / child / friend / colleague), did you feel in control during the conflict (yes / no / partially), brief notes (optional text)
- Timestamped automatically
- Relationship impact log plotted on cycle calendar as relationship markers
- Monthly summary: conflict count by type and relationship, by cycle phase
- Included in physician report under DRSP Criterion B functional impairment documentation
- Plain-language clinical note on the log screen: "Tracking relationship impacts is one of the most important data points for PMDD diagnosis. It helps your doctor understand how your symptoms affect your daily life."

**Conditions served:** PMDD
**Priority:** P1 — Month 2
**Complexity:** S

---

### Feature 40: Work and Academic Impact Log

**One-line description:** Tracks hours lost, tasks avoided, and self-assessed work quality due to PMDD symptoms — building documentation for workplace accommodations and disability support.

**User story:** As a woman with PMDD who has asked for workplace accommodations but was told "everyone has bad days," I want to show my HR department 6 months of data proving that my impairment clusters in a specific, predictable, cyclical window — not randomly.

**Acceptance criteria:**
- Fields: productivity hours lost today (0 / 1–2hr / 3–4hr / half day / full day), tasks you avoided or deferred due to symptoms (number), self-assessed work quality (normal / reduced / significantly impaired), work conflict or incident today (binary)
- Accessible as an optional extension after work_school_performance is scored ≥3 in the daily log
- Monthly summary: total hours lost by cycle phase; impairment concentration chart
- Included in physician report under Criterion B occupational functioning
- Export as standalone PDF formatted for HR/accommodation documentation, with a plain-language cover note: "This is prospectively collected daily data tracking how a menstrual cycle disorder affects occupational function."

**Conditions served:** PMDD
**Priority:** P1 — Month 2
**Complexity:** S

---

### Feature 41: Trigger Correlation Engine

**One-line description:** Statistical analysis of ALL lifestyle triggers — sleep, stress, exercise, alcohol, caffeine, social interaction — against DRSP symptom scores, showing users their personal amplifiers.

**User story:** As a woman who suspects alcohol makes my PMDD worse but doesn't know for certain, I want the app to tell me — using my own data — whether drinking in my luteal phase correlates with higher scores the next day so I have evidence, not just suspicion.

**Acceptance criteria:**
- Activates after 30+ days of both trigger logs and DRSP scores
- Triggers analyzed: caffeine intake, alcohol intake, sleep duration, sleep quality, exercise type/intensity, stress level, social isolation
- Top 3 correlations surfaced per month: "On days after poor sleep (<6hr), your irritability scores were 41% higher the next day"
- Luteal vs. follicular correlations shown separately — same trigger, different phase, often different effect
- Insight phrasing: always "we noticed a pattern" not "X causes Y"; always based on the user's own data
- Maximum 2 insights per week; never surfaced during luteal peak days 23–26
- NOTE: This feature covers ALL triggers. Feature 32 (Diet-Symptom Correlation) covers food specifically. Both run independently and feed into the same Insights screen.

**Conditions served:** PMDD, All
**Priority:** P2 — Month 4
**Complexity:** L

---

### Feature 42: Community Phase Matching

**One-line description:** Anonymous, phase-matched community showing users they are not alone — without any social feed, profiles, or identifying information.

**User story:** As a woman in late luteal who feels completely alone in what she's experiencing, I want to see that other people are going through the same phase right now — not as posts about their symptoms but just knowing they exist — so that the isolation is slightly less total.

**Acceptance criteria:**
- Today screen: a single line showing "X others are in their late luteal phase today" — no names, no usernames, no photos, no posts
- Optional: "Luteal wall" — anonymous short messages (max 100 characters) that others in late luteal can post and read; messages disappear after 24 hours; no usernames; no replies; no likes
- Luteal wall is opt-in; default is off; messages are moderated (no medical advice, no crisis content, no self-harm content)
- Moderation: automated keyword filter + human moderation queue; crisis content immediately removed and replaced with 988 resource
- Community data is never sold, never used for advertising, never shared with any third party
- Phase data used for community matching is processed on-device; server receives only an anonymized phase bucket (e.g., "late luteal")

**Conditions served:** PMDD, All
**Priority:** P2 — Month 4
**Complexity:** L

---

### Feature 43: HOMA-IR Calculator

**One-line description:** Enter fasting insulin + fasting glucose and instantly get your HOMA-IR score with plain-language clinical context — the single most important metabolic number in PCOS.

**User story:** As a woman with PCOS whose doctor says my blood sugar is "normal" but I suspect insulin resistance, I want to enter my fasting insulin and glucose values and see my HOMA-IR calculated so I can have an evidence-based conversation about whether I have insulin resistance.

**Acceptance criteria:**
- Accessible as a dedicated screen within the PCOS module AND as part of the Lab Values Vault (Feature 12)
- Inputs: fasting insulin (μIU/mL), fasting glucose (mg/dL)
- Formula displayed: HOMA-IR = (insulin × glucose) ÷ 405
- Result shown with plain-language context: Under 2.0 = typical / 2.5+ = suggests insulin resistance / 3.0+ = elevated / 4.0+ = severe insulin resistance
- Adds "Talk to your doctor about fasting insulin testing" prompt if fasting insulin has never been entered (many PCOS patients have fasting glucose tested but not fasting insulin)
- Result stored with date in Lab Values Vault and trended over time
- HOMA-IR trend chart shows how the value changes over months of lifestyle intervention or medication

**Conditions served:** PCOS
**Priority:** P0 — MVP
**Complexity:** S

---

### Feature 44: PCOS Medication Adherence Log

**One-line description:** Daily medication check-in for all PCOS-specific medications, each with condition-specific side effect tracking fields — distinct from the ADHD medication tracker.

**User story:** As a woman on metformin who keeps forgetting whether she took it and isn't sure if the nausea is the medication or PCOS itself, I want to log my medications daily and track my side effects so I can tell my endocrinologist exactly what's happening.

**Acceptance criteria:**
- Custom medication builder: user adds any medication from a pre-built list or free text
- Pre-built list with condition-specific side effect fields:
  - Metformin: dose (mg), taken today, GI side effects (nausea / diarrhea / cramping — scale 1–3)
  - Spironolactone: dose (mg), taken today, blood pressure today (mmHg — required field for spironolactone users), dizziness (yes/no), breast tenderness (yes/no)
  - OCP: brand name, taken today, breakthrough bleeding (yes/no), mood changes (1–5), nausea (yes/no)
  - Letrozole: dose, cycle day of administration, hot flashes (yes/no)
  - Inositol (Myo/DCI): dose each, taken today, GI tolerance (1–3)
  - NAC: dose, taken today, GI tolerance
  - Vitamin D: IU, taken today
  - Omega-3: mg EPA+DHA, taken today
  - Chromium: μg, taken today
  - Eflornithine cream: applied today (AM/PM/both), skin reaction (yes/no)
- Monthly adherence summary per medication (% of days taken)
- Side effect trends: metformin GI score over time (shows whether tolerance improves, which it typically does at 4–6 weeks)
- Spironolactone BP entries auto-populate the Lab Values Vault blood pressure field

**Conditions served:** PCOS
**Priority:** P0 — MVP
**Complexity:** M

---

### Feature 45: Endometrial Hyperplasia Risk Flag

**One-line description:** Monitors amenorrhea duration and surfaces a clinical prompt when prolonged anovulation creates endometrial cancer risk — the safety feature no other PCOS app has.

**User story:** As a woman with PCOS who sometimes goes 4–6 months without a period, I want the app to tell me when that becomes clinically significant — not alarm me unnecessarily, but prompt me to talk to my doctor at the right moment.

**Acceptance criteria:**
- Triggers calculated from last logged period start date
- Day 60: no user-facing message; internal flag only
- Day 75: soft in-app card on Today screen (NOT a push notification): "It's been 75 days since your last logged period. In PCOS, longer cycles are common — but cycles over 90 days without a withdrawal bleed are worth discussing with your doctor."
- Day 90: definitive in-app prompt: "You've been in an extended cycle for 90+ days. In PCOS, prolonged amenorrhea without progestogen protection can lead to endometrial changes. We recommend discussing this with your doctor." Includes pre-filled Doctor Appointment Prep note and link to Feature 19 (Doctor Appointment Prep)
- "I spoke to my doctor about this" acknowledgment button resets the flag without dismissing the data
- All prompts are in-app only — never push notifications
- Clinical note displayed with the Day 90 prompt: "PCOS is associated with 2–3× elevated endometrial cancer risk due to unopposed estrogen. A progestogen-induced withdrawal bleed every 90 days is the standard protective measure."

**Conditions served:** PCOS
**Priority:** P0 — MVP
**Complexity:** S

---

### Feature 46: Hair Shedding Tracker

**One-line description:** A daily log for androgenic hair shedding with strand-count categories, Ludwig zone location, and monthly trend — one of the most distressing PCOS symptoms with no existing tracking tool.

**User story:** As a woman with PCOS who has been losing hair for 3 years and has no way to tell if my spironolactone is slowing it down, I want to track my daily shedding so that in 3 months I can look at a chart and see whether things are actually improving.

**Acceptance criteria:**
- Daily log: strand count category (fewer than 10 / 10–25 / 25–50 / more than 50 per shower/brush)
- Optional: location (diffuse all over / frontal hairline / temples / crown — Ludwig classification zones)
- Optional: photo comparison (crown or parting photos, stored locally only, never synced without explicit permission)
- Monthly trend chart showing shedding category over time
- Correlated with medication log: when spironolactone or other anti-androgen medication is logged, shedding trend shows pre- vs. post-medication comparison after 3+ months of data
- Ludwig scale reference: "Stage I = mild thinning at crown; Stage II = marked thinning; Stage III = near-complete loss at crown" — shown in the feature's info screen, not on the daily log

**Conditions served:** PCOS
**Priority:** P0 — MVP
**Complexity:** S

---

### Feature 47: Ovulation Detection Module (PCOS-Aware)

**One-line description:** Multi-signal ovulation tracking combining OPK, cervical mucus, BBT, and PdG confirmation — with PCOS-specific interpretation that accounts for false LH surges and elevated baseline LH.

**User story:** As a woman with PCOS who has been getting positive OPKs for 5 days straight but never knows if I actually ovulated, I want to see ALL my ovulation signals on one chart so I can understand what my body is actually doing — not just what one test says.

**Acceptance criteria:**
- Daily inputs: OPK result (negative / low / high / peak — or numerical value for quantitative monitors like Mira), cervical mucus (dry / sticky / creamy / watery / egg-white / not checked), BBT (°C or °F, from manual entry or wearable sync), mittelschmerz today (yes/no)
- PdG test input: positive/negative, entered day 7–10 post-OPK peak
- All signals plotted on a single multi-line chart per cycle; OPK line, CM description below chart, BBT line, PdG result as a dot
- PCOS-specific interpretation: "Your LH has been elevated for 4 days without a clear peak pattern — this is common in PCOS and doesn't necessarily mean ovulation is imminent. PdG confirmation (after a suspected peak) is the most reliable way to confirm ovulation occurred."
- Flag: when OPK peak occurred but no PdG confirmation followed — "OPK suggested a peak but no PdG was recorded — ovulation may not have occurred. This is worth tracking over multiple cycles."
- No algorithmic fertile window prediction — shows data and pattern, not a calculated "ovulation day"

**Conditions served:** PCOS
**Priority:** P1 — Month 3
**Complexity:** M

---

### Feature 48: Inositol Protocol Tracker

**One-line description:** Specialized tracking for the myo-inositol + D-chiro-inositol 40:1 protocol with adherence tracking, GI tolerance monitoring, and a 3-month ovulatory response chart.

**User story:** As a woman who started the 40:1 inositol protocol 6 weeks ago and wants to know if it's working for my ovulation, I want to track my daily adherence alongside my OPK results so I can see whether my cycles are becoming more regular.

**Acceptance criteria:**
- Daily log: Myo-inositol dose (mg), DCI dose (mg), taken today (binary), GI tolerance today (fine / mild discomfort / significant nausea — log 1–3)
- Standard dose pre-filled: 2000–4000mg Myo + 50–100mg DCI (40:1 ratio) — user can adjust
- Ratio calculator: if user enters custom doses, shows calculated ratio and flags if significantly different from 40:1
- After 3 months: generates "inositol response chart" showing cycle length trend, OPK pattern trend, and testosterone lab value trend (if entered) since start date
- Plain-language framing throughout: "This is supplement tracking. Inositol has RCT evidence for insulin resistance in PCOS but is not FDA-approved as a treatment. Track your response and discuss with your doctor."
- GI tolerance trend: shows whether tolerance improves over the first 4–6 weeks (it typically does — users who stop due to early GI side effects miss the improvement window)

**Conditions served:** PCOS
**Priority:** P1 — Month 2
**Complexity:** S

---

### Feature 49: Weight Tracking — Non-Punitive (PCOS)

**One-line description:** An opt-in, user-initiated weight log framed entirely as a metabolic health trend signal — no goal weight, no BMI, no comparison to others, no aesthetics.

**User story:** As a woman with PCOS who needs to track my weight as a metabolic health indicator but has a history of disordered eating triggered by weight tracking apps, I want to be able to monitor my weight trend on my own terms — without any of the language or features that have hurt me in the past.

**Acceptance criteria:**
- Hidden by default in onboarding; never suggested unprompted; accessible only from a dedicated section in PCOS Settings
- Activation prompt (only when user explicitly navigates to it): "Weight can be a useful metabolic health signal in PCOS. This is entirely optional and never shared with anyone. Do you want to turn it on?" — two options: "Yes, track my weight" and "Not for me"
- Input: weight (kg or lbs, user's choice); no decimal required; no goal weight field; no BMI calculation; no "healthy range" display
- Chart: user's own weight trend only; no reference lines; no "target" markers; y-axis range adjusted to user's personal range (not 0–200 lbs)
- Paired alongside: energy level trend and waist circumference trend on the same chart — framed as metabolic health signals collectively, not weight as a standalone goal
- Copy throughout: "weight as a metabolic signal" not "weight management"
- One-tap disable at any time from the same settings screen, with confirmation: "Weight tracking has been turned off. Your previous data is preserved but won't be shown."
- Never included in any export or physician report without explicit user opt-in per export

**Conditions served:** PCOS
**Priority:** P1 — Month 2
**Complexity:** S (tracking is simple; the UX design to get it right is M)

---

### Feature 50: Treatment Response Tracker (PCOS)

**One-line description:** A monthly auto-generated side-by-side comparison of key PCOS metrics — androgenic symptoms, cycle regularity, mood, and energy — 3 months ago vs. now, to make treatment progress visible.

**User story:** As a woman who has been on spironolactone for 4 months and isn't sure if it's doing anything, I want the app to show me a before/after comparison so I can see whether my acne and hair growth have actually improved or whether I'm imagining it.

**Acceptance criteria:**
- Generated monthly after 3+ months of data
- Comparison metrics: acne severity average (face + body), hirsutism new growth frequency, hair shedding category, cycle length average, mood scores average, energy scores average
- Visual format: two-column side-by-side table — "3 months ago" vs. "now" — with a simple direction indicator (↑ better / ↓ worse / → unchanged) per metric
- Plain-language summary: "Your acne scores have decreased by 31% over the past 3 months. Your cycle length has shortened from an average of 47 days to 38 days."
- Share button: generates a one-page PDF formatted for physician appointments
- Framing: "This is your data, not a medical assessment. Bring it to your next appointment."
- Available from the Insights screen; also prompted monthly as an in-app card ("Your 3-month PCOS review is ready")

**Conditions served:** PCOS
**Priority:** P1 — Month 3
**Complexity:** M

---

### Feature 51: Doctor Appointment Prep (PCOS)

**One-line description:** A pre-appointment checklist tailored to the user's PCOS phenotype and tracking history — which labs to request, which symptoms to describe, which questions to ask, and how to navigate weight-related conversations.

**User story:** As a woman with PCOS who leaves every appointment feeling dismissed and like I forgot to mention the most important things, I want the app to generate a pre-filled preparation guide before my next appointment so I can walk in organized and ready.

**Acceptance criteria:**
- Accessible from the PCOS module and from the Today screen ("Appointment coming up? Prepare now")
- Auto-populated from tracking data:
  - Lab gaps: "Your last testosterone test was 8 months ago — consider requesting a recheck"
  - Missing tests: "You haven't logged a 2-hour glucose tolerance test — this is recommended annually for PCOS"
  - Symptom summary: 3-sentence plain-language summary of current symptom burden for the user to read to their doctor
  - Medication side effects to report: if GI tolerance scores for metformin have been elevated in the past 4 weeks — flags this for discussion
- Phenotype-adaptive questions: Phenotype A user sees insulin resistance questions; Phenotype C user sees androgen-focused questions; all users see mental health screen question
- Weight conversation boundary language: "If your doctor focuses on weight and you'd like to redirect: 'I'd like to focus on my metabolic labs and androgen symptoms today.'"
- Physician report auto-attaches to the appointment prep note
- Exportable as a plain-text note shareable to any notes app or email

**Conditions served:** PCOS, All
**Priority:** P1 — Month 3
**Complexity:** M

---

### Feature 52: Fertility Mode (PCOS)

**One-line description:** A toggled "Trying to Conceive" mode that activates multi-signal fertility tracking — OPK, BBT, PdG, cervical mucus, intercourse timing, and treatment cycle logging — framed around actual signals, never algorithmic prediction.

**User story:** As a woman with PCOS who has been trying to conceive for 8 months and knows that standard OPK apps don't work for me, I want a fertility tracking mode that shows me all my signals together and helps me understand what's actually happening in my cycle — not what a 28-day algorithm says should be happening.

**Acceptance criteria:**
- Activated by toggling "Trying to Conceive" in PCOS Settings; never shown by default
- Activates: BBT log (daily AM; wearable sync supported), OPK log (Feature 47), cervical mucus log, PdG test log, intercourse timing (binary — private, end-to-end encrypted, excluded from ALL exports under any circumstances), fertility treatment cycle tracking (Letrozole / IUI / IVF with cycle day)
- Calendar switches to "fertile window" view based on actual logged signals — NOT algorithmic; shows OPK peak + BBT thermal shift + PdG confirmation as a range of evidence
- TTC cycle counter: shown as "Cycle X of trying" — increases sensitivity of Ora messaging as cycles increase
- Ultrasound follicle entry: number of follicles + sizes (mm), entered from clinic report
- No algorithmic fertile window prediction language — "Your data suggests ovulation may have occurred around day 18 based on OPK peak + thermal shift" not "Your fertile window is days 12–16"
- When pregnancy test is logged as positive: displays a kind message + suggests appropriate pregnancy tracking apps + offers to archive PCOS data safely

**Conditions served:** PCOS
**Priority:** P1 — Month 3
**Complexity:** M

---

### Feature 53: Metabolic Syndrome Risk Tracker

**One-line description:** Displays the user's current status across the 5 metabolic syndrome criteria — calculated from lab vault and body metric entries — so she always knows where she stands metabolically.

**User story:** As a woman with PCOS who knows metabolic syndrome is a risk for me but doesn't know how to evaluate it, I want to see which of the 5 criteria I currently meet and which I don't so I can have a specific, evidence-based conversation with my doctor instead of a general "watch your weight" discussion.

**Acceptance criteria:**
- Five criteria tracked (IDF/ATP-III standard): waist circumference ≥88cm, blood pressure ≥130/85 mmHg, triglycerides ≥150 mg/dL, HDL <50 mg/dL (women), fasting glucose ≥100 mg/dL
- Auto-populated from Lab Vault entries and body metric logs
- Display: 5-row summary with green/amber/red status per criterion (uses accessible encoding — not color-only; also uses text: "Within range / Elevated / Not yet measured")
- Shows: criteria met count (e.g., "2 of 5 criteria elevated")
- For unmeasured criteria: "Not yet measured — consider asking your doctor to test this"
- Plain-language clinical note: "Metabolic syndrome is diagnosed when 3 or more of these criteria are present. Women with PCOS have 2–3× the general population risk. This is a monitoring tool — bring it to your next appointment."
- Data updates automatically when new lab values are entered; no manual update needed

**Conditions served:** PCOS
**Priority:** P1 — Month 3
**Complexity:** S

---

### Feature 54: PCOS Phenotype Identification Helper

**One-line description:** After 60 days of logging, suggests which PCOS phenotype (A, B, C, or D) best matches the user's symptom pattern — with monitoring priority recommendations for that phenotype.

**User story:** As a woman who was diagnosed with "PCOS" with no further explanation, I want to understand which type of PCOS I have so I can focus on the right tests and know what I'm actually at risk for.

**Acceptance criteria:**
- Activates after 60+ days of logging data in the PCOS module
- Inference logic (rule-based, not ML): reads cycle regularity logs, androgenic symptom frequency, lab values (if entered), OPK patterns
- Output: suggested phenotype with plain-language explanation — "Based on what you've logged, your pattern is most consistent with PCOS Phenotype A (irregular cycles + androgenic symptoms). This is the most common phenotype and carries the highest insulin resistance risk. This is not a diagnosis — it is a pattern to discuss with your doctor."
- Each phenotype result shows: what it means clinically, which tests are most important for this phenotype, which symptoms to prioritize tracking, and what the standard treatment approach is
- Phenotype can be updated if user enters a clinical diagnosis
- If data is ambiguous: "Your data isn't yet clear enough to suggest a phenotype — 3 more months of logging will give a clearer picture"
- Never states a diagnosis; never replaces clinical evaluation

**Conditions served:** PCOS
**Priority:** P2 — Month 4
**Complexity:** M

---

### Feature 55: Ultrasound Result Vault

**One-line description:** Manual entry and longitudinal storage of ultrasound findings — antral follicle count, ovarian volume, dominant follicle presence — correlated with AMH lab values over time.

**User story:** As a woman with PCOS who has had 4 ultrasounds at 3 different clinics and no way to see my ovarian data over time, I want to enter my ultrasound results in one place so I can see whether my follicle counts are changing and bring the full picture to my reproductive endocrinologist.

**Acceptance criteria:**
- Manual entry fields: date, clinic (optional), AFC (antral follicle count) per ovary, ovarian volume (mL) per ovary, dominant follicle present (yes/no + size mm), radiologist's PCOM finding (yes/no/inconclusive), scan type (transvaginal / abdominal)
- Reference threshold displayed inline: "2018 PCOS guidelines: ≥20 follicles per ovary (2–9mm) or ovarian volume ≥10 mL = PCOM"
- Trend chart: AFC per ovary over time; ovarian volume over time
- Correlated with AMH Lab Vault entry (AMH correlates strongly with AFC — shown on same chart)
- Useful for fertility monitoring: during ovulation induction cycles, serial ultrasounds track follicle development; vault stores each entry

**Conditions served:** PCOS
**Priority:** P2 — Month 4
**Complexity:** S

---

### Feature 56: Annual PCOS Health Review

**One-line description:** At 12 months from app start, generates a "what to check this year" health review covering the 9 annual monitoring standards for PCOS — with a pre-filled doctor appointment guide for any missing tests.

**User story:** As a woman with PCOS who knows I'm supposed to get certain tests annually but always forgets what they are until I'm sitting in the waiting room, I want the app to tell me which tests I've had logged in the past year and which ones I still need to request.

**Acceptance criteria:**
- Triggers at 12-month anniversary from onboarding (or annually thereafter)
- Checks Lab Vault for entries in the past 12 months against 9 annual monitoring standards: blood pressure, fasting glucose (or 2-hour OGTT), HbA1c, lipid panel (TC/LDL/HDL/TG), Vitamin D, TSH, testosterone trend, waist circumference, mood/mental health screen
- Shows: tests logged in past 12 months (green checkmark), tests not logged (amber — "consider requesting"), tests never logged (prompt to ask doctor)
- Auto-generates "Your Annual PCOS Check" doctor appointment prep note with pre-filled test requests for all missing items
- Generates 12-month summary PDF: all tracked metrics in trend format, suitable for sharing with a new specialist or GP
- Framing: "It's been 12 months since you started tracking. Here's what your data shows and what's worth discussing at your next appointment." — not alarmist, not a checklist to fail

**Conditions served:** PCOS
**Priority:** P1 — Month 6
**Complexity:** M

---

## Section 4.6 — Perimenopause Features (F57–F80)

These features extend HormonaIQ to fully serve the perimenopausal user. They are grounded in the `perimenopause-complete-spec.md` clinical specification and designed for women at STRAW+10 Stages -2 through +1c. They also serve users with Premature Ovarian Insufficiency (POI, before age 40).

All perimenopause features activate when the user selects "Perimenopause or menopause" in onboarding (Feature 5). They layer on top of the existing cycle tracking, safety, and PMDD/PCOS modules rather than replacing them.

---

### Feature 57: STRAW+10 Stage Identifier

**One-line description:** Automatically determines and displays the user's STRAW+10 reproductive aging stage based on logged menstrual patterns and optionally entered lab values — with dynamic updating as new data comes in.

**User story:** As a 47-year-old woman with erratic cycles, I want to know what stage of the perimenopause transition I'm actually in so that I can understand whether my symptoms are expected and what to monitor next.

**Acceptance criteria:**
- At onboarding, asks: last period date, recent cycle variability (has your cycle length changed by 7+ days?), longest recent gap between periods
- Computes initial STRAW+10 stage: -2 (early peri), -1 (late peri), 0 (FMP confirmed), +1a/+1b/+1c (postmenopause)
- Updates stage dynamically as menstrual log data accumulates
- Detects Stage -1 when maxGapDays ≥ 60 in the log; auto-confirms FMP (Stage 0) when 12 consecutive months of no periods logged
- When user enters FSH/AMH lab values: uses them to corroborate or update stage estimate
- Displays stage on Home screen with plain-language meaning: "Late Perimenopause — you may be 1–3 years from your final period. This is when symptoms typically peak."
- Stage confirmation level shown: "Estimated from cycle data" vs. "Lab-confirmed" vs. "Doctor-confirmed"
- POI pathway: if user indicates POI diagnosis, stage is handled separately (POI is not STRAW+10 Stage -1)

**Conditions served:** Perimenopause
**Priority:** P0 — MVP for peri module
**Complexity:** M
**Clinical basis:** STRAW+10 (Harlow et al., 2012, Climacteric)

---

### Feature 58: Hot Flash and Night Sweat Real-Time Logger

**One-line description:** A timestamped hot flash and night sweat logger that captures frequency, severity, duration, and potential trigger — generating the data needed to quantify vasomotor symptom (VMS) burden for clinical assessment and treatment response tracking.

**User story:** As a woman who has 12 hot flashes a day and cannot communicate this clearly to my doctor, I want to log each flash in real time — even from the lock screen — so that after 4 weeks I can show her the numbers she needs to make a treatment decision.

**Acceptance criteria:**
- Lock screen / home screen quick-log: single-tap "Hot flash now" widget; logs timestamp automatically
- Expanded log (3-tap): severity (mild/moderate/severe), duration estimate (<1min / 1–3min / >5min), type (hot flash / night sweat / both), trigger tag (optional: alcohol / caffeine / spicy food / stress / no trigger / other)
- Night sweat variants: captures "woke from sleep" and "sheet change required" flags for clinical severity
- Daily VMS summary auto-computed: total count, severity distribution, night sweat count
- Weekly trend chart: hot flash frequency over 4 weeks with severity overlay
- Trigger analysis: after 30 logged events, surfaces correlation between logged triggers and flash severity
- NAMS severity classification auto-applied: <7/day = mild; 7–10 = moderate; >10 = severe
- Treatment response view: shows VMS frequency before and after HRT start date (if HRT tracked)

**Conditions served:** Perimenopause
**Priority:** P0 — MVP for peri module
**Complexity:** M
**Clinical basis:** NAMS 2022 Menopause Hormone Therapy Position Statement; VMS severity NAMS standard

---

### Feature 59: Greene Climacteric Scale (GCS) Assessment

**One-line description:** The validated 21-item Greene Climacteric Scale administered quarterly (or after treatment changes), with subscale scoring, threshold alerts, and longitudinal trend tracking — generating the clinical standard metric for perimenopause symptom burden.

**User story:** As a woman who has been dismissed with "you're just stressed," I want a validated clinical score that quantifies my symptom burden so that my next appointment starts with a number, not a fight.

**Acceptance criteria:**
- Full 21-item GCS administered at onboarding + every 3 months (or prompted after treatment start/change)
- All items presented on 0–3 scale: Not at all / A little / Quite a bit / Extremely
- Items shown verbatim per the validated instrument (see perimenopause-complete-spec.md §1.2)
- Subscale scores computed and displayed: Anxiety (max 18), Depression (max 15), Somatic (max 21), Vasomotor (max 6), Sexual function (max 3), Total (max 63)
- Alert thresholds: Depression ≥ 10 → mental health check-in prompt + PHQ-9; Total ≥ 42 → "High symptom burden — consider discussing treatment options this month"
- Longitudinal GCS trend chart: total score + subscale trend over all assessments
- Treatment response: if HRT logged, shows GCS total before vs. 3 months and 6 months after start; highlights if ≥30% reduction (treatment response threshold)
- GCS data included in physician report (Feature 72)

**Conditions served:** Perimenopause
**Priority:** P0 — MVP for peri module
**Complexity:** S
**Clinical basis:** Greene, 1998, Maturitas; validated in >40 international studies

---

### Feature 60: Perimenopause Daily Symptom Log

**One-line description:** A rapid daily log capturing the full perimenopause symptom spectrum — vasomotor, cognitive, mood, physical, genitourinary, and sleep — in under 45 seconds, integrated into the existing 30-second log flow as a peri-specific extension.

**User story:** As a woman in late perimenopause with 6 different symptom types, I want to capture all of them quickly each day without filling out a form, so that I can look back across weeks and see whether things are getting better or worse.

**Acceptance criteria:**
- Integrates with existing daily log flow (Feature 2); perimenopause users see peri-specific symptom chips after core mood/cognitive log
- Phase-appropriate chips appear: hot flash count, night sweats, joint pain, fatigue, brain fog, mood instability, vaginal dryness, heart palpitations
- Each chip is 0–3 severity rating; chip tap is one interaction
- Sleep quality captured as 1–5 with a "woken by night sweats?" toggle
- Voice note option retained (Feature 2 Step 4) for qualitative context
- "Breakthrough bleed" and "heavy bleeding" toggleable cycle note fields
- All data persists to `periDailyLog` state (see perimenopause-complete-spec.md §1.5)
- Weekly summary chart: symptom heatmap by day of week × symptom type

**Conditions served:** Perimenopause
**Priority:** P0 — MVP for peri module
**Complexity:** S

---

### Feature 61: GSM (Genitourinary Syndrome of Menopause) Monthly Assessment

**One-line description:** A monthly structured assessment of GSM symptoms — vaginal dryness, dyspareunia, urinary urgency, recurrent UTIs — presented in destigmatized language with clear treatment context.

**User story:** As a 52-year-old woman who has had painful sex for two years but has never mentioned it to any doctor because it embarrasses me, I want an app that asks directly and normalizes this — and tells me there are effective treatments I didn't know about.

**Acceptance criteria:**
- Monthly prompt: "Quick check-in on some symptoms many women experience but rarely discuss"
- Items: vaginal dryness, vaginal burning/itching, pain during sex, urinary urgency/frequency, urinary incontinence (stress/urge), recurrent UTIs — each rated 0–3
- Language is clinical and direct, not euphemistic: "pain during sex" not "intimate discomfort"
- Framing after assessment: "These symptoms are caused by declining estrogen. They're common, they're real, and they're treatable. You don't need to live with them."
- If dyspareunia ≥ 2 or recurrent UTI flagged: surfaces treatment information on local vaginal estrogen + non-hormonal options
- Monthly GSM trend chart
- GSM composite score ≥ 12 for 2 months → prompt: "Your GSM symptoms have been significant for 2 months. This is worth discussing with your doctor — there are very effective treatments."
- Included in physician report (Feature 72) by default

**Conditions served:** Perimenopause
**Priority:** P0 — MVP for peri module
**Complexity:** S
**Clinical basis:** Portman & Gass, 2014 (GSM consensus terminology); GSM prevalence data from VIVA, REVIVE surveys

---

### Feature 62: Sleep Quality Tracker (PSQI-Based)

**One-line description:** Weekly sleep quality assessment using the Pittsburgh Sleep Quality Index (PSQI) with subscale scoring, sleep apnea screening flag, and correlation with night sweat frequency.

**User story:** As a woman who wakes up 3 times a night from night sweats and then can't get back to sleep, I want to track my sleep in a way that captures this — and shows me whether my sleep is improving once I start HRT.

**Acceptance criteria:**
- PSQI administered at onboarding + every 4 weeks (or on user request)
- All 7 PSQI component domains scored (see perimenopause-complete-spec.md §1.4)
- Global score displayed with interpretation: ≤5 good, 6–10 poor, 11–21 severely impaired
- Night sweat correlation: if nightSweats from hotFlashLog correlate with PSQI disturbance score (r > 0.3), surfaces insight: "Your sleep quality appears directly linked to night sweats. This connection is treatable."
- Sleep apnea screening: if PSQI global ≥ 8 AND user reports snoring or witnessed apnea, surface: "Severe sleep disruption in perimenopause can sometimes be caused by sleep apnea — which becomes more common after menopause. Worth discussing a sleep study with your doctor."
- PSQI trend chart vs. GCS vasomotor trend: side-by-side correlation view
- Treatment response: PSQI before vs. 3 months after HRT start

**Conditions served:** Perimenopause, All
**Priority:** P0 — MVP for peri module
**Complexity:** S
**Clinical basis:** Buysse et al., 1989, Psychiatry Research; PSQI validated in menopausal populations

---

### Feature 63: MHT/HRT Tracker and Treatment Log

**One-line description:** A structured HRT/MHT configuration tracker capturing estrogen type, delivery route, progestogen type, dose, start date, and changes — correlated with symptom improvement over time.

**User story:** As a woman who has tried 3 different HRT regimens over 2 years and cannot remember what she was on when, I want to track every HRT change and see whether each change improved my symptoms — so that my next specialist appointment has the actual timeline.

**Acceptance criteria:**
- HRT configuration form: estrogen type (estradiol / CEE / none), delivery route (patch / gel / spray / oral / vaginal / implant), dose, frequency
- Progestogen: type (micronized progesterone / MPA / norethisterone / dydrogesterone / LNG-IUD / none), dose, regimen (sequential 12/14 days / continuous / other)
- Separate entry for vaginal/local estrogen (type, frequency) and testosterone (dose, frequency)
- Non-hormonal treatments: SSRIs/SNRIs for VMS, fezolinetant, gabapentin, clonidine, ospemifene
- Change log: every HRT modification is timestamped with user-noted reason
- Treatment response view: GCS total, VMS frequency, PSQI global — each shown as before-vs-after timeline chart relative to each HRT start/change event
- "How is this working?" prompt at 6 weeks and 3 months after each new HRT start
- Educational context per delivery route: explains WHY transdermal has lower clot risk vs. oral; why micronized progesterone is preferred over synthetic; doesn't prescribe, informs
- Contraindication screening flags: if migraine with aura logged → flag that oral estrogen and CHC increase stroke risk; recommend discussing transdermal with doctor

**Conditions served:** Perimenopause
**Priority:** P0 — MVP for peri module
**Complexity:** M
**Clinical basis:** NAMS 2022; BMS 2020; NICE NG23; ELITE Trial; UK Biobank

---

### Feature 64: Perimenopause Lab Value Vault

**One-line description:** Structured lab value entry and trend tracking for perimenopause-specific biomarkers — FSH, E2, AMH, thyroid, lipids, bone markers, metabolic panel — with plain-language interpretation and longitudinal trend charts.

**User story:** As a woman who has had 4 FSH tests in 3 years at 3 different labs and still doesn't understand what they mean, I want to enter all my results in one place, see the trend, and finally understand what my own numbers are telling me.

**Acceptance criteria:**
- Supports all perimenopause-relevant lab panels (see perimenopause-complete-spec.md §2.1): FSH, LH, E2, progesterone, AMH, testosterone, SHBG, TSH, Free T3, Free T4, fasting glucose, HbA1c, HOMA-IR, lipid panel, vitamin D, ferritin, haemoglobin
- Entry form: value, unit, date, cycle day (optional), fasting flag, lab name
- Plain-language interpretation per value: "Your FSH of 32 on Day 3 is in the late perimenopause range. FSH levels fluctuate widely, so one test is not definitive — the trend over time is more meaningful."
- Alert flags for values outside clinical thresholds (see perimenopause-complete-spec.md §2.1 interpretation table)
- Trend chart per biomarker: up to 3 years of data on a single chart; reference range bands displayed
- FSH note: explains why FSH fluctuates and why one test isn't sufficient — critical for managing user expectations after confusing results
- Lab refresh reminder: "It's been 6 months since your last FSH/lipid panel — consider requesting a recheck at your next appointment"
- Lab data included in physician report

**Conditions served:** Perimenopause
**Priority:** P1 — Month 2 for peri module
**Complexity:** M

---

### Feature 65: DEXA Bone Density Vault

**One-line description:** A structured vault for DEXA scan results — T-scores, Z-scores, FRAX fracture risk — with interpretation, longitudinal tracking, and clinical guidance on supplementation and treatment thresholds.

**User story:** As a 53-year-old woman who had a DEXA scan last year that showed osteopenia, I want to understand what my T-score actually means, whether I need treatment, and track it over time so that I know if things are improving or worsening.

**Acceptance criteria:**
- Input fields: lumbar spine T-score, hip total T-score, femoral neck T-score (most clinically important for hip fracture risk), forearm T-score, Z-scores, FRAX 10-year fracture risk, facility name
- Plain-language interpretation: T-score ≥ -1.0 = normal; -1.0 to -2.5 = osteopenia; ≤ -2.5 = osteoporosis; Z-score context explanation (why Z-score matters for POI patients)
- Treatment threshold context: explains when pharmacological treatment is indicated (T-score ≤ -2.5 OR FRAX major fracture risk ≥ 20% OR hip fracture risk ≥ 3%)
- When osteoporosis T-score entered: prompt "This T-score is in the osteoporosis range. Treatment significantly reduces fracture risk — please discuss with your doctor."
- Standard DEXA timeline reminder: every 2 years postmenopause; earlier if on bisphosphonate treatment; earlier for POI
- Vitamin D and calcium supplementation status linked: if supplementation logged, correlate with DEXA trend
- DEXA data in physician report

**Conditions served:** Perimenopause
**Priority:** P1 — Month 2 for peri module
**Complexity:** S

---

### Feature 66: Blood Pressure Log (Shared — Peri-Specific)

**One-line description:** Manual blood pressure entry with automated tracking of cardiovascular risk trend during the perimenopausal transition — including alert thresholds and context about why BP rises in perimenopause.

**User story:** As a woman who was told her blood pressure was "borderline" at her last appointment, I want to track it at home between appointments to see the actual pattern and bring real data to my next visit.

**Acceptance criteria:**
- Quick entry: systolic / diastolic / pulse / time of day (morning/afternoon/evening)
- Up to 3 entries per day
- Average BP trend chart (weekly average, 12-week view)
- Hypertension alert: systolic ≥ 140 or diastolic ≥ 90 as 7-day average → "Your average blood pressure over the last week is in the hypertension range. This should be discussed with your doctor at your next appointment."
- Urgent alert: single reading systolic ≥ 160 or diastolic ≥ 100 → "This reading is significantly elevated. Please check again in 5 minutes. If it remains this high, seek medical attention."
- Educational context: "Blood pressure tends to rise in perimenopause due to estrogen's role in vascular tone. Tracking at home gives your doctor far better information than a single clinic reading."
- DEXA/Lipid/BP linked cardiovascular risk view: side-by-side trend of the three key cardiovascular markers

**Conditions served:** Perimenopause, PCOS (shared)
**Priority:** P1 — Month 2
**Complexity:** S

---

### Feature 67: Perimenopausal Mood and Mental Health Monitor

**One-line description:** PHQ-9 and GAD-7 assessments administered at regular intervals for perimenopause users, with screening thresholds, crisis integration, and explicit context that perimenopausal depression is a hormonal condition — not a personal failure.

**User story:** As a woman who has never been depressed but is now crying every day and cannot understand why, I want the app to tell me whether this is depression, whether it's hormonal, and what my options are — without making me feel weak.

**Acceptance criteria:**
- PHQ-9 administered at onboarding + monthly for first 6 months + every 3 months thereafter
- GAD-7 administered same intervals
- Both presented in peri-appropriate framing: "Many women experience new depression or anxiety during perimenopause. These are hormonal symptoms, not character flaws."
- PHQ-9 scoring thresholds enforced per clinical standard (see perimenopause-complete-spec.md §5.1)
- PHQ-9 item 9 (suicidal ideation) ≥ 2 → Tier 3 crisis protocol (Feature 19 / crisis-service.jsx)
- GCS depression subscale ≥ 10 triggers PHQ-9 prompt
- If PHQ-9 moderate-severe (≥ 10) + no antidepressant logged + no HRT logged: "Perimenopausal depression often responds to HRT when it's caused by estrogen fluctuation. SSRIs and SNRIs are also effective. Both options are worth discussing with your doctor."
- Longitudinal PHQ-9/GAD-7 trend chart — visible monthly change
- Treatment response: PHQ-9 trend shown relative to HRT or SSRI start dates

**Conditions served:** Perimenopause
**Priority:** P0 — MVP for peri module
**Complexity:** S
**Clinical basis:** Spitzer et al. PHQ-9 1999; GAD-7 2006; SWAN suicidality data

---

### Feature 68: POI (Premature Ovarian Insufficiency) Support Track

**One-line description:** A dedicated support and tracking pathway for women with POI — distinct from standard perimenopause — covering the higher-dose HRT recommendation, fertility conversation, grief acknowledgment, and accelerated health monitoring protocol.

**User story:** As a 34-year-old with POI, I feel completely alone. Every menopause app assumes I'm in my 50s. I need something that understands I'm 34, my ovaries have failed, I need HRT until I'm 51 not as a "maybe," and I may still be grieving the fertility I expected to have.

**Acceptance criteria:**
- POI flag in onboarding: "Have you been diagnosed with Premature Ovarian Insufficiency (POI) or early menopause (before age 40)?" — if yes, activates POI pathway
- POI users see distinct home screen messaging: "HormonaIQ supports women with POI. Your situation is different from natural menopause in important ways — and we understand that."
- POI HRT context: explains that HRT for POI is unconditional replacement (not a treatment choice, but replacement of hormones that should still be present) and recommended by all major guidelines until at least age 51
- POI users without HRT: monthly prompt "Guidelines from NICE, BMS, ESHRE, and NAMS recommend HRT for all women with POI until at least age 51. This is about replacing estrogen your body should naturally be producing, not choosing a treatment."
- Fertility conversation: "Having POI does not necessarily mean infertility — 5–10% of POI patients conceive spontaneously. If you want to explore fertility options, a reproductive endocrinologist can advise."
- Grief space: a single empathetic message at POI onboarding acknowledging loss without over-dwelling
- Accelerated health monitoring: DEXA reminder every 1–2 years (not every 2), cardiovascular monitoring every year, PHQ-9 monthly for first year
- POI-specific Ora insights: references POI-specific evidence, not standard menopause advice

**Conditions served:** Perimenopause (POI subgroup)
**Priority:** P1 — Month 2 for peri module
**Complexity:** M
**Clinical basis:** ESHRE 2016 POI Guidelines; NICE NG23; BMS POI Guideline 2020

---

### Feature 69: Perimenopausal Cognitive Tracker

**One-line description:** Daily and weekly tracking of cognitive symptoms specific to perimenopause — word-finding, short-term memory, processing speed, concentration — with education about the neurobiological mechanism and expected trajectory.

**User story:** As a 48-year-old woman who used to be the sharpest person in the room and now cannot remember the word for "refrigerator," I want to track this so that I know whether it's getting worse, and so that my doctor understands this is real and not me being anxious.

**Acceptance criteria:**
- Cognitive symptom items in daily log (Feature 60): brain fog severity (0–3), word-finding difficulty (0–3), memory lapses (0–3), concentration (0–3)
- Weekly subjective cognitive function rating: "How would you rate your cognitive sharpness this week compared to a year ago?" (5-point scale, Likert)
- Monthly trend chart: cognitive composite score over time
- Correlation view: cognitive score vs. sleep quality (PSQI) + VMS frequency — surfaces "your brain fog is strongly correlated with nights you have poor sleep from night sweats"
- Treatment response: cognitive composite trend relative to HRT start date
- Education card: "Cognitive changes in perimenopause are real — they're caused by estrogen's effect on the brain. For most women, cognitive function stabilizes or improves after menopause. If symptoms are severe, this is worth discussing."
- If cognitive composite score severe (≥ 10/16) for 3+ months: "Severe cognitive symptoms may warrant evaluation to rule out other causes. Please discuss this with your doctor."
- ADHD note: if ADHD module active + peri module active, surfaces: "Women with ADHD often find that perimenopausal estrogen changes significantly worsen their ADHD symptoms. Dose adjustment of ADHD medication may be needed."

**Conditions served:** Perimenopause
**Priority:** P1 — Month 2
**Complexity:** S

---

### Feature 70: Perimenopausal Weight and Metabolic Tracker

**One-line description:** Non-punitive tracking of weight, waist circumference, and metabolic context in perimenopause — framed around visceral fat redistribution and insulin resistance as biological processes, not personal failures.

**User story:** As a woman who has gained 8 pounds over 2 years without changing my diet or exercise and is being told to "just eat less," I want to understand and track the metabolic changes happening in my body — and document them in a way that doesn't make me feel like it's my fault.

**Acceptance criteria:**
- Weight entry (in kg or lbs, user preference): optional, ED-safe gated (same as PCOS Feature 49 gate)
- Waist circumference (cm/inches): monthly entry; clinically relevant for visceral fat tracking
- Hip circumference: monthly entry (waist:hip ratio as cardiovascular risk metric)
- Metabolic context automatically applied when weight entered: "Weight redistribution from hips to abdomen is driven by estrogen decline — not lifestyle change. This affects insulin sensitivity and cardiovascular risk."
- Metabolic risk view: waist circumference trend + fasting glucose trend + LDL trend — three-panel cardiovascular risk snapshot
- No weight loss framing, no calorie context, no BMI calculation (aligned with never-build rules)
- Links to HOMA-IR calculation (Feature 43) if insulin/glucose labs entered

**Conditions served:** Perimenopause, PCOS (shared concept)
**Priority:** P1 — Month 2
**Complexity:** S

---

### Feature 71: Non-Hormonal Treatment Tracker and Evidence Rater

**One-line description:** Tracks non-HRT treatments for perimenopausal symptoms — SSRIs/SNRIs, fezolinetant, gabapentin, CBT, lifestyle interventions — with evidence ratings and expected response timelines.

**User story:** As a woman who cannot take HRT due to breast cancer history, I want to know what non-hormonal options are available for my hot flashes, which have the best evidence, and track whether what I'm trying is actually working.

**Acceptance criteria:**
- Treatment catalogue: paroxetine/brisdelle (FDA-approved for VMS), venlafaxine, escitalopram, gabapentin, clonidine, fezolinetant (FDA-approved 2023 — neurokinin 3 antagonist, 50mg daily), ospemifene (for GSM), acupuncture, CBT for hot flashes, mindfulness, aerobic exercise, phytoestrogens, DHEA intravaginal
- Evidence rating per treatment: A (RCT evidence) / B (observational) / C (limited evidence) — displayed clearly
- Current treatment entry: drug name, dose, start date, indication (hot flashes / mood / sleep / GSM)
- Treatment response tracking: VMS frequency, GCS scores, PSQI before vs. 4/8/12 weeks after start
- Expected timeline context: "Fezolinetant typically shows full effect in 4–12 weeks. SSRIs for hot flashes show effect in 4–8 weeks."
- HRT contraindication context if relevant: for women who flag breast cancer history → clarifies that local vaginal estrogen is typically considered safe even in breast cancer survivors, and to discuss with oncologist

**Conditions served:** Perimenopause
**Priority:** P1 — Month 2
**Complexity:** M

---

### Feature 72: Perimenopause Physician Report (PDF Export)

**One-line description:** A comprehensive, clinician-ready PDF report covering 3–12 months of perimenopause tracking data — GCS scores, VMS frequency, PSQI, lab trends, HRT history, GSM assessment — formatted for an OB-GYN, menopause specialist, or GP.

**User story:** As a woman who has waited 4 years to be taken seriously, I want to walk into my next appointment and hand my doctor a document that speaks her language — clinical scores, longitudinal trends, treatment history, lab values — so that the appointment starts with evidence, not dismissal.

**Acceptance criteria:**
- Generates after 4+ weeks of data (minimal viable report); richer report after 3+ months
- Contents (in clinical order): patient summary (age, STRAW+10 stage, POI flag, date range), VMS summary (average frequency/severity, night sweats, trend chart), GCS scores and trend (full subscale breakdown), PSQI global score trend, mood and mental health (PHQ-9/GAD-7 trend), GSM monthly assessment scores and trend, lab values entered by user (FSH/LH/E2/AMH/lipids/glucose/thyroid/bone), DEXA T-scores if entered, HRT/treatment history (full regimen timeline), menstrual pattern log (cycle changes, bleeding flags), any clinical alerts triggered
- Header disclaimer: "This report contains data entered prospectively by the patient. Clinical interpretation is the responsibility of the treating clinician."
- Does not state a diagnosis
- Export: PDF (A4 and Letter) + shareable via iOS/Android share sheet; print-ready
- No account required for export
- Option to exclude specific sections before export (e.g., user may not want to include weight data)

**Conditions served:** Perimenopause
**Priority:** P1 — Month 2 for peri module
**Complexity:** M

---

### Feature 73: Perimenopausal Home Screen (Peri-Aware Phase Tone)

**One-line description:** A perimenopause-specific variant of the Home screen (Feature 1) adapted for non-cyclical symptom tracking — replacing phase-based color and copy with symptom-burden-aware tone and stage-appropriate messaging.

**User story:** As a postmenopausal woman who no longer has cycles, I want the app to understand I'm not looking at a cycle phase — I want it to be intelligent about my symptom burden and stage, not show me "Day 14 — Ovulatory" forever.

**Acceptance criteria:**
- Home screen for peri users in Stage -1 or later: phase header replaced with STRAW+10 stage display
- Color tone follows symptom burden: high GCS week → warmer, quieter palette; low symptom week → open, brighter palette
- Daily check-in prompt adapted for peri: "How are you doing today?" with peri-specific quick chips (hot flashes, sleep, mood, energy)
- If VMS was high yesterday or last night: contextual acknowledgment "You logged difficult nights this week. That's noted."
- Stage -1 users: occasional hormonal context cards (Feature 7 adapted) explaining what's happening biologically at this stage
- POI users: specific compassionate framing; never uses language like "natural part of aging"
- Community pulse line adapted: "X other women in late perimenopause are tracking today" (anonymized)

**Conditions served:** Perimenopause
**Priority:** P0 — MVP for peri module (adapts existing Feature 1)
**Complexity:** S

---

### Feature 74: Trigger Identification Engine (Perimenopausal VMS)

**One-line description:** After 30+ hot flash events logged, identifies each user's personal vasomotor triggers — alcohol, caffeine, spicy food, stress, warm environments — through correlation analysis, surfacing actionable personal trigger patterns.

**User story:** As a woman who suspects alcohol makes my hot flashes worse but isn't sure, I want the app to analyze my logs and tell me whether my hunch is correct — with my own data, not generic advice.

**Acceptance criteria:**
- Trigger options at each hot flash log: alcohol, caffeine, spicy food, hot beverage, stress/emotional event, warm room, exercise, no trigger, other (text)
- After 30 hot flash events: correlation analysis between trigger tags and subsequent flash severity/frequency
- Insight surfaced when r > 0.3 and n ≥ 10 events for any trigger: "Based on your logs, hot flashes on days you consumed alcohol tend to be [severity]% more severe. This is a pattern in your data — not a rule."
- Trigger-free periods: if user avoids a trigger for 2+ weeks, detection resets to avoid stale correlations
- No prescriptive language: presents correlation as personal data pattern, never as a behavior mandate
- Trigger report included in physician report (Feature 72)

**Conditions served:** Perimenopause
**Priority:** P1 — Month 2
**Complexity:** M

---

### Feature 75: PMDD + Perimenopause Intersection Tracker

**One-line description:** A specialized tracking and insight layer for users who have both PMDD and are perimenopausal — detecting the destabilization of PMDD patterns due to hormonal volatility and providing context for why PMDD is worsening.

**User story:** As a woman with PMDD who is now 46 and feels like my PMDD has been happening 3 times a month, I need an app that understands this intersection — that perimenopause is amplifying my PMDD — and helps me document it for treatment.

**Acceptance criteria:**
- Active when both PMDD module and peri module are enabled
- DRSP tracking is maintained from PMDD module; continues as gold standard
- Intersection insight: when DRSP luteal-peak scores appear outside expected cycle timing (i.e., in follicular phase or at irregular intervals), surfaces: "You're logging PMDD-type symptoms at times that don't match your usual luteal window. This is common when perimenopause disrupts the hormonal patterns that previously triggered PMDD at predictable times."
- GCS + DRSP combined trend chart: shows PMDD severity and peri symptom burden on same timeline
- For users with this profile: education card on continuous cycle suppression (GnRH agonist + HRT add-back) as a treatment option for PMDD in perimenopause
- Suicidal ideation monitoring: users with PMDD + perimenopause are flagged as highest-risk; PHQ-9 monthly with crisis protocol at full sensitivity

**Conditions served:** PMDD + Perimenopause
**Priority:** P1 — Month 2
**Complexity:** M

---

### Feature 76: PCOS + Perimenopause Intersection Tracker

**One-line description:** Adapted tracking and insights for women navigating PCOS in the perimenopausal transition — where PCOS-specific staging and insulin resistance context must be maintained alongside perimenopausal monitoring.

**User story:** As a woman with PCOS who is now 48, I don't know whether my irregular cycles are PCOS or perimenopause. I want the app to track both and help my doctor understand the overlap.

**Acceptance criteria:**
- Active when both PCOS module and peri module are enabled
- Cycle irregularity context: displays "Your cycles may be irregular due to both PCOS and perimenopause. Distinguishing which is driving any given cycle change requires clinical assessment — we'll track the data."
- AMH tracking note: "AMH can be elevated in PCOS, which may mask reduced ovarian reserve. A declining AMH trend over time is more meaningful than a single value."
- FSH staging note: "LH:FSH ratio in PCOS complicates staging — elevated FSH alone is not diagnostic of perimenopause in PCOS. Your doctor may use AMH, E2, and cycle pattern together."
- Metabolic risk compound view: PCOS insulin resistance + perimenopausal metabolic shift combined risk trend
- HRT context for PCOS: for users on combined HRT, progesterone type note (micronized progesterone preferred over synthetic to avoid additional insulin resistance impact)

**Conditions served:** PCOS + Perimenopause
**Priority:** P1 — Month 2
**Complexity:** M

---

### Feature 77: ADHD + Perimenopause Intersection Tracker

**One-line description:** Tracks ADHD symptom amplification during perimenopausal estrogen decline, surfaces the estrogen-dopamine connection in plain language, and assists with documentation for ADHD medication management during the transition.

**User story:** As a woman with ADHD who has been stable on Vyvanse for 4 years and is now 45 and suddenly feels like it stopped working, I need to understand this is probably hormonal — and have data to bring to my prescriber.

**Acceptance criteria:**
- Active when ADHD module and peri module are both enabled
- ADHD symptom tracking: executive function (task initiation, task completion), emotional dysregulation, hyperfocus vs. paralysis, medication efficacy rating (1–5 scale)
- Insight surfaced when ADHD symptom scores increase with GCS decline or VMS increase: "Your ADHD symptoms may be worsening due to estrogen decline. Estrogen supports dopamine regulation — as estrogen drops, ADHD medications sometimes become less effective."
- ADHD medication log: current medication, dose, prescriber — tracks if dose has changed
- Treatment context: "Some women with ADHD and perimenopause find that HRT restores medication efficacy by stabilizing estrogen levels. This is worth discussing with both your prescriber and a menopause specialist."
- Documentation: includes ADHD symptom trend in physician report for prescriber context

**Conditions served:** ADHD + Perimenopause
**Priority:** P1 — Month 2
**Complexity:** S

---

### Feature 78: Cardiovascular Risk Dashboard (Peri)

**One-line description:** A combined cardiovascular risk view integrating blood pressure trend, lipid panel history, fasting glucose/HbA1c, weight/waist circumference, and smoking status — with the timing hypothesis for HRT cardiovascular protection presented without alarm.

**User story:** As a woman with a family history of heart disease who is entering perimenopause, I want to monitor my cardiovascular risk markers over time and understand whether starting HRT sooner rather than later matters for my heart.

**Acceptance criteria:**
- Cardiovascular risk panel: SBP/DBP trend (from Feature 66), LDL trend, HDL trend, triglycerides trend, fasting glucose trend, waist circumference trend — all on a unified timeline
- Framingham risk score calculation (for postmenopausal women): auto-calculates if age, blood pressure, cholesterol, and smoking status are available — shows 10-year cardiovascular event risk estimate
- Timing hypothesis context: "Studies show that starting HRT within 10 years of menopause or before age 60 is associated with cardiovascular protection. Starting more than 10 years after menopause may not carry the same benefit. This is called the 'timing hypothesis.'"
- No alarm framing — presents as information for provider conversations
- Annual check-in: "It's been 12 months. Have you had your lipid panel and blood pressure checked this year?"

**Conditions served:** Perimenopause
**Priority:** P1 — Month 3
**Complexity:** M

---

### Feature 79: Bone Health Dashboard (Peri)

**One-line description:** A unified bone health monitoring view combining DEXA T-score vault, calcium/vitamin D supplementation tracking, fracture risk (FRAX), and bisphosphonate management — with clinical context for the accelerated bone loss window post-menopause.

**User story:** As a woman who was told she has osteopenia but has no idea what to do about it or whether it's getting worse, I want to see my bone health history in one place and understand exactly what I should be doing.

**Acceptance criteria:**
- Bone health dashboard: most recent DEXA T-scores displayed prominently, historical T-score trend chart (each DEXA entered), FRAX 10-year fracture risk if entered
- Calcium + vitamin D tracking: daily calcium intake (dietary + supplement combined, rough estimate), vitamin D supplement dose, serum vitamin D level from lab vault — displayed against recommended targets (calcium 1000–1200 mg/day; vitamin D 800–2000 IU/day)
- Bisphosphonate tracking: if user logs alendronate/risedronate/zoledronate — includes correct dosing reminders (alendronate: weekly, taken with full glass water, upright 30 min; zoledronate: annual IV)
- HRT bone context: "HRT is effective at preventing bone loss in perimenopause and early postmenopause. If bone health is a concern, this is a reason to discuss starting HRT if you haven't already."
- DEXA reminder: "Standard guidance recommends a DEXA scan at or around menopause, then every 2 years. When did you last have one?"
- For POI users: "Women with POI are at higher risk for bone loss. Annual DEXA scans are recommended."

**Conditions served:** Perimenopause
**Priority:** P1 — Month 3
**Complexity:** M

---

### Feature 80: Perimenopause Education and STRAW+10 Stage Content Library

**One-line description:** A perimenopause-specific education library delivering stage-aware, clinically accurate content about what is happening biologically at each STRAW+10 stage — adapted daily/weekly for the user's current stage and symptom burden.

**User story:** As a woman who was given a pamphlet about menopause by my GP and found it useless, I want to learn about what is actually happening to my hormones and body right now — not generic information that could apply to anyone.

**Acceptance criteria:**
- Stage-personalized content: different articles/cards surfaced at Stage -2, Stage -1, Stage 0, and Stage +1
- Content categories: understanding your stage (what's happening hormonally), symptoms (what's real, why, what helps), HRT (types, evidence, misconceptions, the WHI explanation), non-HRT options, bone health, heart health, cognitive changes, GSM, the PMDD connection, the PCOS connection, navigating healthcare (how to ask for what you need)
- Each content item: max 300 words; evidence-cited; no toxic positivity; no "natural process" framing
- Plain-language level: written for a 10th-grade reading level
- "For your doctor": each content item has a shareable "talking points" export: "How to start the conversation about [topic]"
- Content cannot be clinically wrong: all items reviewed against NAMS, BMS, NICE guidelines before publication
- WHI explainer: mandatory card for all peri users — addresses the WHI fear that keeps women from seeking HRT
- The "You're not crazy" card: served at Stage -1 onboarding — "The symptoms you're experiencing are real, they have a biological cause, and they are treatable."

**Conditions served:** Perimenopause
**Priority:** P0 — MVP for peri module
**Complexity:** M

---

### 4.6.1 — F57–F80 Quick Reference

| Feature | Name | Priority | Complexity | Stage |
|---------|------|----------|------------|-------|
| F57 | STRAW+10 Stage Identifier | P0-MVP | M | All peri |
| F58 | Hot Flash / Night Sweat Logger | P0-MVP | M | All peri |
| F59 | Greene Climacteric Scale (GCS) | P0-MVP | S | All peri |
| F60 | Perimenopause Daily Symptom Log | P0-MVP | S | All peri |
| F61 | GSM Monthly Assessment | P0-MVP | S | Stage -1, +1 |
| F62 | Sleep Quality Tracker (PSQI) | P0-MVP | S | All peri |
| F63 | MHT/HRT Tracker | P0-MVP | M | All peri |
| F64 | Peri Lab Value Vault | P1-Month2 | M | All peri |
| F65 | DEXA Bone Density Vault | P1-Month2 | S | Stage -1, +1 |
| F66 | Blood Pressure Log | P1-Month2 | S | All peri |
| F67 | Mood / Mental Health Monitor (PHQ-9/GAD-7) | P0-MVP | S | All peri |
| F68 | POI Support Track | P0-MVP | M | POI only |
| F69 | Cognitive Tracker | P1-Month2 | S | All peri |
| F70 | Weight + Metabolic Tracker (Peri) | P1-Month2 | S | All peri |
| F71 | Non-Hormonal Treatment Tracker | P1-Month2 | M | All peri |
| F72 | Perimenopause Physician Report | P1-Month2 | M | All peri |
| F73 | Peri-Aware Home Screen | P0-MVP | S | All peri |
| F74 | VMS Trigger Identification Engine | P1-Month2 | M | All peri |
| F75 | PMDD + Perimenopause Intersection | P1-Month2 | M | PMDD+Peri |
| F76 | PCOS + Perimenopause Intersection | P1-Month2 | M | PCOS+Peri |
| F77 | ADHD + Perimenopause Intersection | P1-Month2 | S | ADHD+Peri |
| F78 | Cardiovascular Risk Dashboard | P1-Month3 | M | Stage -1, +1 |
| F79 | Bone Health Dashboard | P1-Month3 | M | Stage -1, +1 |
| F80 | Education and Stage Content Library | P0-MVP | M | All peri |

**Subtotal: 24 features (F57–F80). See 4.6.2 for F81–F91.**

---

### 4.6.2 — Perimenopause Gap Features (F81–F91)

Identified during the Round 3 team debates. These close the clinical completeness gaps not covered by F57–F80.

---

#### F81 — Menopause Rating Scale (MRS)

**Status:** P1-Month2 | **Complexity:** S | **Users:** All peri

**What it does:** 11-item validated scale (Heinemann et al., 2003) for monitoring symptom burden over time. Three subscales: somatic (items 1–4), psychological (items 5–7), urogenital (items 8–11). Each item scored 0–4 (absent/mild/moderate/severe/very severe). Total max 44.

**Why it differs from GCS:** GCS (F59) gives rich subscale detail at initial assessment. MRS is faster and better validated for longitudinal treatment response tracking. GCS at onboarding; MRS monthly thereafter.

**Alert threshold:** MRS total > 16 → "Moderate-to-severe symptom burden. Consider discussing treatment options with your provider."

**Data model:** `state.mrsLog[date]` — 11 scored items, subscale totals, total, trend vs. prior assessment.

**Physician report:** MRS total + subscale breakdown included in F72 PDF.

---

#### F82 — FSFI (Female Sexual Function Index)

**Status:** P1-Month2 | **Complexity:** S | **Users:** All peri (opt-in)

**What it does:** 19-item, 6-domain instrument for sexual function (Rosen et al., 2000). Domains: desire, arousal, lubrication, orgasm, satisfaction, pain. Each item scored 1–5 or 0–5 by domain. Total max 36. Score ≤ 26.55 = sexual dysfunction.

**Why it matters:** 43% of perimenopausal women report sexual dysfunction (SWAN). Only 14% discuss it with a provider. Documenting FSFI gives a baseline, makes the conversation possible, and measures treatment response.

**Privacy defaults:** Opt-in, disabled by default. Privacy-first copy: "This data is only visible to you and anyone you choose to include in your physician report."

**Alert threshold:** Score ≤ 26.55 → "Your responses suggest you may be experiencing sexual dysfunction. This is common during perimenopause and is often treatable. Consider discussing with your provider."

**Cadence:** Monthly. 19-item assessment, estimated 3 minutes.

**Data model:** `state.fsfiLog[date]` — 6 domain scores, total, clinical flag, trend.

---

#### F83 — DIVA Questionnaire (GSM Functional Impact)

**Status:** P2 | **Complexity:** XS | **Users:** Users with GSM (F61 active)

**What it does:** 4-domain quality-of-life questionnaire for vaginal atrophy/GSM functional impact (Huang et al., 2015). Domains: daily activities, emotional wellbeing, sexuality, self-concept/body image. Each domain 0–3. Total max 36.

**Why it complements F61:** F61 captures symptom presence and severity. DIVA captures how much those symptoms affect daily life. The functional burden score is what matters for treatment justification and insurance conversations.

**Cadence:** Monthly, surfaces only when `state.gsmAssessment` shows any symptom ≥ 1.

**Data model:** `state.divaLog[date]` — 4 domain scores, total, comparison to last.

---

#### F84 — ICIQ-UI Short Form (Urinary Incontinence)

**Status:** P1-Month2 | **Complexity:** XS | **Users:** All peri (opt-in after bladder question in onboarding)

**What it does:** 3-item validated questionnaire (Avery et al., 2004) for urinary incontinence severity + impact. Items: frequency (0–5), amount (0–6), quality-of-life impact (0–10). Plus a symptom type checklist (stress/urge/both/other). Total scored max 21.

**Why it matters:** Urinary incontinence affects 30–40% of perimenopausal women and is among the most undertreated conditions. Pelvic floor physiotherapy has strong evidence. The app creates the clinical language that makes the conversation with a provider possible.

**Educational card:** "Urinary leakage is a medical symptom, not an inevitable part of aging. Pelvic floor physical therapy, local vaginal estrogen, and bladder training all have strong evidence."

**Cadence:** Monthly. Opt-in during onboarding or from Settings.

**Data model:** `state.iciqLog[date]` — 3 item scores, type, total, trend.

---

#### F85 — Joint Pain and Musculoskeletal Log

**Status:** P1-Month2 | **Complexity:** S | **Users:** All peri

**What it does:** Localized joint pain log with body map (8 regions: hands/wrists, shoulders, knees, hips, back/spine, feet/ankles, neck, jaw/TMJ). Per-region severity 0–3. Morning stiffness duration in minutes. Activity impact 0–3.

**Why it matters:** Estrogen-related arthralgia affects ~50–60% of perimenopausal women (SWAN). The mechanism is estrogen's anti-inflammatory role. Localizing and tracking joint symptoms helps physicians distinguish perimenopausal arthralgia from rheumatoid arthritis, osteoarthritis, or fibromyalgia.

**Differentiating pattern flag:** Estrogen-related joint pain is typically bilateral, symmetrical, worst in morning, improves with activity. The app auto-notes this pattern if entries consistently match it.

**Cadence:** Daily log (part of F60's extended physical section) or standalone entry.

**Data model:** `state.jointLog[date]` — 8-region body map, per-region severity, stiffness minutes, activity impact.

---

#### F86 — Headache and Migraine Log

**Status:** P1-Month2 | **Complexity:** S | **Users:** All peri

**What it does:** Per-episode headache log with: type (tension/migraine/cluster/unspecified), severity 0–10, location, associated symptoms (nausea/aura/light sensitivity), duration in hours, cycle day, medication taken, relief achieved.

**Why it matters:** Menstrual migraine (triggered by estrogen withdrawal) dramatically worsens during perimenopause due to greater estrogen fluctuation. The app can correlate headache onset with cycle day and estrogen-drop phase — essential documentation for neurologist or gynecologist appointments.

**Automated insight:** If ≥ 3 headache entries cluster within 3 days of cycle day matching the late luteal/menstrual phase → "Your headaches may be linked to hormone changes. This pattern is worth discussing with your doctor."

**Data model:** `state.headacheLog[date+time]` — type, severity, location, associated symptoms, duration, cycle day at time of entry, medication, relief.

---

#### F87 — Heart Palpitations Tracker

**Status:** P1-Month2 | **Complexity:** S | **Users:** All peri

**What it does:** Per-episode palpitations log with: time, duration, description (racing/skipping/fluttering/pounding), associated symptoms (dizziness/shortness of breath/chest pain), context (exercise/rest/after hot flash/night), severity 1–10.

**Why it matters:** Palpitations affect 40–50% of perimenopausal women. Most are benign. All require clinical evaluation to rule out arrhythmia. Documenting frequency, context, and associated symptoms turns an anxiety-inducing symptom into a clinically communicable data set.

**Safety gates:**
- "Chest pain + palpitations" → immediate: "If you have chest pain and palpitations together, seek emergency care."
- 3+ episodes/week → soft: "Frequent palpitations should be evaluated by your doctor."

**Relationship to F78 (cardiovascular dashboard):** F87 is the real-time episode log. F78 shows aggregated trend and cardiovascular risk context.

**Data model:** `state.palpLog[date+time]` — duration, description, associated symptoms, context, severity.

---

#### F88 — Spotting Tracker with AUB Safety Alert

**Status:** P0-MVP | **Complexity:** S | **Users:** All peri

**What it does:** Dedicated spotting log distinct from the regular period log. Captures: spotting type (between periods / unexpected timing / after intercourse / after 12-month gap), color (red/dark red/brown/pink), amount (trace/light/moderate/heavy), associated pain.

**Why it's P0-MVP (safety reclassification):** Any bleeding 12+ months after last period is a red-flag symptom for endometrial pathology including cancer. This must not be buried behind a later sprint. The app needs to recognize this pattern and prompt urgent evaluation from day one.

**Safety gates:**
- Any bleeding after ≥ 12-month gap → **urgent**: "Postmenopausal bleeding requires medical evaluation. Please see your doctor this week."
- Bleeding after intercourse on 2+ occasions → "See your doctor."
- Heavy bleeding > 7 days → AUB alert (same as F58 threshold).

**Data model:** `state.spottingLog[date]` — type, color, amount, pain, at timestamp.

---

#### F89 — Hormonal Birth Control Masking Flag

**Status:** P0-MVP | **Complexity:** XS | **Users:** All peri

**What it does:** Simple boolean flag `state.hbcActive: true/false`. When true:
- STRAW+10 auto-staging is disabled (or marked "unreliable — HBC active")
- Lab value interpretation for FSH and LH shows caveat banner
- App displays: "Hormonal contraception can suppress FSH and mask cycle irregularity, making perimenopause staging unreliable. Symptom tracking remains valid."
- Physician report includes "currently on hormonal contraception" notation

**Why it's P0-MVP (staging accuracy reclassification):** Up to 30% of perimenopausal women are on hormonal contraception. Without this flag, the STRAW staging is silently wrong for a major user segment. A false "Stage -2" reading when the user is on the pill could give clinically incorrect reassurance.

**HBC types:** Pill / patch / ring / hormonal IUD / implant / injection. User selects from list.

**Data model:** `state.hbcActive: bool`, `state.hbcType: string`, `state.hbcStartDate: YYYY-MM-DD`.

---

#### F90 — Skin and Hair Changes Tracker

**Status:** P2 | **Complexity:** S | **Users:** All peri

**What it does:** Weekly check-in on skin and hair changes. Skin: dryness/thinning/new lines/pigmentation spots, rated 0–3. Hair: volume loss/texture change/new facial hair, rated 0–3. Scalp condition. Nail changes.

**Why it matters:** Hair loss affects ~50% of women after menopause. Skin thinning and dryness are among the most distressing non-VMS symptoms. These are driven by estrogen and androgen changes. Often dismissed as cosmetic; documenting them over time shows change trajectory and correlates with hormonal lab trends.

**Data model:** `state.skinHairLog[week]` — per-item severity, free text notes.

---

#### F91 — Bladder Symptom Standalone Tracker

**Status:** P1-Month3 | **Complexity:** XS | **Users:** All peri

**What it does:** Daily bladder log: daytime frequency, nighttime frequency (nocturia), urgency episodes, urge incontinence episodes, UTI symptoms present (bool), nocturia count.

**Why it differs from F84 (ICIQ):** F84 is the monthly clinical instrument (impact score). F91 is the daily behavioral log (frequency counts). Together they provide both the objective data and the subjective burden measure.

**Nocturia alert:** ≥ 2 nocturia events/night on 5+ consecutive days → "Frequent nighttime urination is affecting your sleep. This is a treatable symptom during perimenopause. Discuss with your provider."

**Data model:** `state.bladderLog[date]` — daytime frequency, nocturia count, urgency episodes, UI episodes, UTI flag.

---

### Section 4.6 Feature Summary

| Feature | Priority | Complexity | Users |
|---------|----------|-----------|-------|
| F57 | STRAW+10 Stage Identifier | P0-MVP | M | All peri |
| F58 | Hot Flash + Night Sweat Logger | P0-MVP | M | All peri |
| F59 | Greene Climacteric Scale (GCS) | P0-MVP | S | All peri |
| F60 | Perimenopause Daily Symptom Log | P0-MVP | S | All peri |
| F61 | GSM Monthly Assessment | P0-MVP | S | All peri |
| F62 | Sleep Quality Tracker (PSQI) | P0-MVP | S | All peri |
| F63 | MHT/HRT Tracker | P0-MVP | M | All peri |
| F64 | Perimenopause Lab Value Vault | P1-Month2 | M | All peri |
| F65 | DEXA Bone Density Vault | P1-Month2 | S | Stage -1/+1 |
| F66 | Blood Pressure Log | P1-Month2 | S | All peri |
| F67 | Mood + Mental Health Monitor | P0-MVP | S | All peri |
| F68 | POI Support Track | P0-MVP | M | POI only |
| F69 | Cognitive Tracker | P1-Month2 | S | All peri |
| F70 | Weight + Metabolic Tracker (Peri) | P1-Month2 | S | All peri |
| F71 | Non-Hormonal Treatment Tracker | P1-Month2 | M | All peri |
| F72 | Perimenopause Physician Report | P1-Month2 | M | All peri |
| F73 | Peri-Aware Home Screen | P0-MVP | S | All peri |
| F74 | VMS Trigger Identification Engine | P1-Month2 | M | All peri |
| F75 | PMDD + Perimenopause Intersection | P1-Month2 | M | PMDD+Peri |
| F76 | PCOS + Perimenopause Intersection | P1-Month2 | M | PCOS+Peri |
| F77 | ADHD + Perimenopause Intersection | P1-Month2 | S | ADHD+Peri |
| F78 | Cardiovascular Risk Dashboard | P1-Month3 | M | Stage -1/+1 |
| F79 | Bone Health Dashboard | P1-Month3 | M | Stage -1/+1 |
| F80 | Education and Stage Content Library | P0-MVP | M | All peri |
| F81 | Menopause Rating Scale (MRS) | P1-Month2 | S | All peri |
| F82 | FSFI — Sexual Function Index | P1-Month2 | S | All peri (opt-in) |
| F83 | DIVA — GSM Functional Impact | P2 | XS | GSM users |
| F84 | ICIQ-UI — Urinary Incontinence | P1-Month2 | XS | All peri (opt-in) |
| F85 | Joint Pain + Musculoskeletal Log | P1-Month2 | S | All peri |
| F86 | Headache + Migraine Log | P1-Month2 | S | All peri |
| F87 | Heart Palpitations Tracker | P1-Month2 | S | All peri |
| F88 | Spotting Tracker + AUB Safety Alert | P0-MVP | S | All peri |
| F89 | HBC Masking Flag | P0-MVP | XS | HBC users |
| F90 | Skin + Hair Changes Tracker | P2 | S | All peri |
| F91 | Bladder Symptom Standalone Tracker | P1-Month3 | XS | All peri |

**Total perimenopause features: 35 (F57–F91)**
**P0-MVP perimenopause features: 11 (F57–F63, F67–F68, F73, F80, F88–F89)**

---

## Section 4.7 — Endometriosis Features (F92–F121)

**Condition overview:** Endometriosis affects 190 million women worldwide (10% of reproductive-age women). Average diagnostic delay: 7-12 years. The Four Ds — dysmenorrhea, dyspareunia, dyschezia, dysuria — define the clinical hallmark. The app serves two distinct user segments: (a) diagnosed patients tracking disease activity and treatment response, (b) undiagnosed/suspected patients building a clinical documentation record to accelerate investigation.

**Primary instruments:** NRS per pain type (ASRM 2022 endpoint), EHP-30 (Oxford, gold-standard QoL), EHP-5 (brief weekly check-in), B&B Scale (Biberoglu & Behrman, clinical trial standard), PHQ-9/GAD-7 (safety screens), ESD principles (daily diary)

**Clinical reference:** `docs/01-clinical/endometriosis-complete-spec.md`

---

### 4.7.1 — F92–F109 Feature Descriptions (P0-MVP)

---

#### F92 — Endometriosis Condition Onboarding
**Priority:** P0-MVP  
**Complexity:** M (3-7 days)  
**Users:** All endometriosis module activators

**What it does:**  
A condition-specific onboarding branch that sets the state flags, collects clinical history context, and frames the app's purpose correctly. Critically distinct from the main app onboarding — the language, clinical context, and emotional register are different.

**Onboarding branches:**  
- **Branch A: Undiagnosed / suspected** — "Something is wrong and no one will listen" frame. Emphasizes symptom documentation as a path to diagnosis. Language: "suspected endometriosis," never "your endometriosis."  
- **Branch B: Diagnosed, tracking** — "I have a diagnosis and I want to monitor my condition" frame. Clinical instrument explanations, treatment tracking setup.  
- **Branch C: Post-surgical / monitoring suppression** — "I've had surgery and I'm on suppression therapy" frame. Treatment response tracking as primary purpose. Cycle suppression flag set automatically.

**Key screens:**  
1. Validation landing: "Endometriosis causes real, severe pain. On average, it takes 8 years to diagnose. You are not imagining this. We'll help you document your experience clearly." [no emoji, no wellness aesthetic]  
2. Diagnosis status branch (A/B/C above)  
3. Surgical history input (optional — can skip): type of surgery, date, finding (rASRM stage optional)  
4. Current treatment flag: none / hormonal suppression / post-excision suppression / symptom management only  
5. Comorbidity flags: IBS/IBD, fibromyalgia, hypothyroidism, adenomyosis, anxiety/depression diagnosis, other  
6. Fertility concern flag (changes physician report + AMH lab vault visibility)  
7. Adolescent mode option (for users under 18, or activated from settings later)  
8. Privacy framing: "Your data is private by default. Your doctor sees only what you choose to share."  
9. Daily log preview: sets expectation for the 60-second daily log

**State written:**  
`state.endoOnboarding` — full schema defined in complete-spec.md Section 1

**Data model:**
```js
state.endoOnboarding = {
  activatedAt: ISO_DATE,
  diagnosisStatus: 'undiagnosed' | 'diagnosed' | 'post_surgical',
  diagnosisDate: ISO_DATE | null,
  diagnosisType: ['peritoneal', 'endometrioma', 'DIE', 'adenomyosis', 'unknown'],
  surgicalHistory: { hadSurgery: Boolean, type: 'excision'|'ablation'|'both'|null, date: ISO_DATE, rASRMStage: 1|2|3|4|null },
  currentTreatment: 'none' | 'hormonal_suppression' | 'post_excision_suppression' | 'symptom_management',
  treatmentType: String,
  comorbidities: ['IBS', 'fibromyalgia', 'hypothyroidism', 'adenomyosis', 'anxiety', 'depression', 'other'],
  fertilityFocused: Boolean,
  adolescentMode: Boolean,
  cycleSuppressed: Boolean
}
```

---

#### F93 — Daily 5-D Pain NRS Logger
**Priority:** P0-MVP  
**Complexity:** M (3-7 days)  
**Users:** All endometriosis users (daily, core feature)

**What it does:**  
The primary daily logging interface. Captures pain intensity for each of the Five D clinical domains using 0-10 NRS sliders with plain English labels (not clinical terminology in the UI). This is the data source for every clinical analysis in the app.

**Pain types logged (UI label → clinical field):**  
1. "Period cramps / menstrual pain" → `dysmenorrhea_nrs`  
2. "Pain during or after sex" → `dyspareunia_nrs` (shown with sensitivity: "This is optional to log and is never shared without your permission")  
3. "Bowel pain / pain going to the toilet" → `dyschezia_nrs`  
4. "Bladder pain / pain during urination" → `dysuria_nrs`  
5. "Pelvic pain not during period" → `cpp_nrs` (chronic pelvic pain)

**UI design:**  
- Sliders displayed only when relevant: dysmenorrhea and dyspareunia sliders are shown only on days where they are logged or prompted  
- Each slider: 0 (none) → 10 (worst imaginable). Visual scale includes descriptor text at 0, 4, 7, 10  
- "No pain today" single tap to complete all sliders at 0 — reduces friction on good days  
- Dyspareunia: shown as optional with privacy context; never pre-populated; not included in "quick complete" option  
- Overall fatigue and mood NRS: 2 additional sliders added below pain section  

**Frequency:** Daily — prompted by morning notification (time is user-set)  
**Completion time:** 45-60 seconds on standard day

**Clinical standard:**  
NRS per pain type is the primary endpoint in ASRM 2022 endometriosis clinical outcome guidelines. MCID (minimum clinically important difference) = 10mm VAS ≈ 1 point NRS. A ≥30% reduction is defined as clinical responder in trials. The insight engine uses this threshold to flag treatment response.

**Alert thresholds:**  
- Any NRS ≥ 8 for 7 consecutive days → "Severe persistent pain" prompt (see F108)  
- CPP NRS ≥ 7 for 14+ consecutive days → treatment review prompt  
- Dyspareunia NRS ≥ 7 three consecutive logged instances → educational content + physician report flag

**Data model:**
```js
state.endoDailyLog[date] = {
  dysmenorrhea_nrs: 0-10 | null,
  dyspareunia_nrs: 0-10 | null,
  dyschezia_nrs: 0-10 | null,
  dysuria_nrs: 0-10 | null,
  cpp_nrs: 0-10 | null,
  fatigue_nrs: 0-10,
  mood_nrs: 0-10,
  cyclePhaseContext: 'menstrual' | 'follicular' | 'periovulatory' | 'luteal' | 'suppressed' | 'unknown'
}
```

---

#### F94 — Pain Location Body Map
**Priority:** P0-MVP  
**Complexity:** L (7-14 days)  
**Users:** All endometriosis users (logged when pain is present)

**What it does:**  
An anatomically-referenced interactive body map for recording where pain is located and its quality. Goes beyond pelvic/uterine pain — captures the full anatomical range of endometriosis pain including back, legs, shoulder, and diaphragm.

**Two modes:**  
- **Simple mode** (default for adolescent mode users): silhouette-based with tappable dots. 8 zones. No anatomical imagery.  
- **Clinical mode** (default for adult mode): anatomical silhouette, 12+ zones, anterior and posterior views.

**Coverage zones — Clinical mode:**  
*Anterior:* lower central abdomen, lower left abdomen, lower right abdomen, bladder/suprapubic area, inguinal/groin left, inguinal/groin right  
*Posterior:* lower back/lumbar, sacrum/coccyx, left buttock/gluteal, right buttock/gluteal  
*Radiating:* left leg (upper/lower), right leg (upper/lower)  
*Upper body:* right shoulder/diaphragm area (flags thoracic/diaphragmatic endo when cyclical)

**Per-zone data capture:**  
- Intensity: NRS 0-10 slider appears when zone is selected  
- Pain quality tags: sharp / burning / dull pressure / stabbing / electric/nerve-like / cramping / fullness/heaviness  
- Timing context: "during period" vs. "between periods" — auto-tagged from cycle context; user can override

**Physician report integration:**  
A composite body map view shows average pain intensity per zone over the report period (color gradient from light to dark — monochrome in report, no app color palette).

**Accessibility:**  
- All zones navigable by D-pad/switch control with audio labels  
- Color never the sole differentiator between zones — shape + label required  
- VoiceOver announcement: "Posterior pelvic — lower left. Tap to select. Current: not selected."

**Data model:**
```js
state.endoDailyLog[date].bodyMap = {
  zones: {
    lower_central_ant: { nrs: 0-10, qualities: [...], timing: 'period' | 'non_period' },
    bladder_suprapubic: { nrs: 0-10, qualities: [...], timing: '...' },
    right_shoulder:     { nrs: 0-10, qualities: [...], timing: '...' },
    // ... all 12+ zones
  },
  mapMode: 'simple' | 'clinical'
}
```

---

#### F95 — GI/Bowel Symptom Daily Log
**Priority:** P0-MVP  
**Complexity:** S (1-3 days)  
**Users:** All endometriosis users; priority for IBS comorbidity users

**What it does:**  
Captures daily gastrointestinal symptoms with enough clinical granularity to distinguish endometriosis-related bowel involvement from coincidental IBS. Logged as part of or alongside the daily pain log.

**Logged fields:**  
- Bloating: NRS 0-10 (shown as: "Bloating / abdominal distension")  
- Stool consistency: Bristol Stool Scale categories (labeled by description, not medical names — e.g., "Hard lumps" → BSS 1, "Soft blobs" → BSS 6)  
- Diarrhea today: yes/no + severity if yes  
- Constipation today: yes/no + days without BM if yes  
- Rectal pain: NRS 0-10 (shown as "Pain when going to the toilet")  
- Rectal bleeding: yes/no + color descriptor + amount + cycle timing  
- Nausea: NRS 0-10  

**Cyclical correlation tracking:**  
All GI log entries are tagged with cycle phase context (from cycle log). After 3+ cycles of data, the insight engine computes the menstrual-phase vs. non-menstrual-phase average for each GI field. If any GI score is ≥30% higher during menstruation than at other times, the correlation insight is surfaced.

**IBS comorbidity flag integration:**  
If user flagged IBS in onboarding, the physician report includes a "GI Pattern Analysis" section showing cyclical breakdown of GI symptoms — formatted for gastroenterology or specialist review.

**Red flag escalation:**  
Rectal bleeding logged during menstrual phase on 2+ consecutive cycles → DIE escalation (see F108)

**Data model:**
```js
state.endoDailyLog[date].gi = {
  bloating_nrs: 0-10,
  bss: 1-7 | null,
  diarrhea: Boolean,
  constipation: Boolean,
  rectal_pain_nrs: 0-10,
  rectal_bleeding: Boolean,
  rectal_bleeding_timing: 'menstrual' | 'non_menstrual' | null,
  nausea_nrs: 0-10
}
```

---

#### F96 — Bleeding/HMB Cycle Log
**Priority:** P0-MVP  
**Complexity:** S (1-3 days)  
**Users:** All endometriosis users with menstruation (not cycle-suppressed)

**What it does:**  
Captures menstrual bleeding data with enough detail to document heavy menstrual bleeding (HMB), which is underdiagnosed in endometriosis and has implications for both diagnosis and treatment selection. Also captures intermenstrual and post-coital bleeding as potential AUB red flags.

**HMB screener (per cycle):**  
Adapted from PBAC (Pictorial Blood Assessment Chart) methodology:  
- Flow intensity per day: spotting / light / moderate / heavy / very heavy  
- Clot size per day: none / smaller than a 50p coin / larger than a 50p coin (if large clots: flag for physician report)  
- Sanitary product count: number of pads/tampons/cups used per day  
- Duration of heavy days  
- Overall cycle summary NRS: "How heavy was this period overall? 0 = no bleeding, 10 = worst you've ever experienced"

**HMB auto-detection:**  
>80ml total blood loss per cycle is the clinical threshold for HMB. PBAC score >100 correlates with HMB (Higham, 1990). The app computes a simplified PBAC estimate from product counts and sets `hmbFlag: true` if consistently exceeded. This flag appears in the physician report.

**Intermenstrual bleeding capture:**  
Daily log includes a single question: "Any bleeding today that's not your period?" → yes/no → if yes: spotting / light / moderate (this feeds the AUB/spotting log F88-adjacent logic for endo users)

**Post-coital bleeding:**  
If dyspareunia is logged and user notes bleeding after sex → physician report flag (cervical endo consideration)

**Data model:**
```js
state.endoBleedingLog[cycleId] = {
  days: { [date]: { flowLevel: 'none'|'spotting'|'light'|'moderate'|'heavy'|'very_heavy', clotSize: 'none'|'small'|'large', productCount: Number } },
  pbacEstimate: Number,
  hmbFlag: Boolean,
  durationDays: Number,
  overallNRS: 0-10,
  intermenstrualDays: [{ date: ISO_DATE, level: String }],
  postCoitalBleeding: Boolean
}
```

---

#### F97 — Fatigue + Brain Fog Daily Log
**Priority:** P0-MVP  
**Complexity:** XS (<1 day)  
**Users:** All endometriosis users

**What it does:**  
Captures fatigue and cognitive impairment (brain fog) as daily NRS values, contributing to the systemic symptom profile that distinguishes endometriosis from purely pelvic-pain conditions. 80% of endometriosis patients report cognitive impairment (FACT-Cog-validated); fatigue is near-universal.

**Logged fields (within daily log):**  
- Overall fatigue: "How physically tired are you today?" NRS 0-10  
- Brain fog: "How clear-headed do you feel today?" (inverted: 0 = very clear, 10 = very foggy — shown as fatigue-style scale with labels "No fog" to "Can't think straight")  
- Activity impact: "Did fatigue or brain fog prevent you doing something you wanted to do today?" yes/no + optional text note  

**Insight trigger:**  
Fatigue NRS ≥ 7 for 5+ consecutive days → "Prolonged fatigue can be part of endometriosis and may warrant discussion with your provider about fatigue management." + link to non-pharmacological options  

**Data model:**
```js
state.endoDailyLog[date].systemic = {
  fatigue_nrs: 0-10,
  brain_fog_nrs: 0-10,
  activity_impacted: Boolean,
  activity_note: String | null
}
```

---

#### F98 — Sleep Quality Daily Log
**Priority:** P0-MVP  
**Complexity:** XS (<1 day)  
**Users:** All endometriosis users

**What it does:**  
Captures daily sleep quality, contributing to the full systemic burden picture. 70.8% of endometriosis patients report sleep disturbance. Sleep disruption is both a consequence of chronic pain and a risk factor for pain sensitization — a clinically significant bidirectional relationship.

**Logged fields (within daily log):**  
- Sleep quality: "How well did you sleep last night?" NRS 0-10 (0 = didn't sleep, 10 = slept perfectly)  
- Hours slept: numeric field (optional)  
- Night pain: "Were you woken by pain?" yes/no  
- If yes: which pain type (dropdown from F93 pain types)  

**PSQI-alignment:**  
After 7+ days of sleep logging, the weekly average maps to PSQI Component 1 (sleep quality) and Component 4 (sleep efficiency if hours are provided). Monthly PSQI instrument (F98-adjacent) provides full 7-component score.

**Insight trigger:**  
Sleep NRS ≤ 4 (poor sleep) for 7+ consecutive days → "Poor sleep can worsen pain sensitivity. If pain is disrupting your sleep regularly, this is worth discussing with your provider."

**Data model:**
```js
state.endoDailyLog[date].sleep = {
  sleep_quality_nrs: 0-10,
  hours_slept: Number | null,
  night_pain: Boolean,
  night_pain_type: String | null
}
```

---

#### F99 — PHQ-9 Monthly Safety Screen
**Priority:** P0-MVP  
**Complexity:** S (1-3 days)  
**Users:** All endometriosis users (mandatory monthly)

**What it does:**  
Administers the 9-item Patient Health Questionnaire (PHQ-9) monthly as a depression screening and safety gate. Endometriosis carries an OR of 3.61 for depression. PHQ-9 item 9 screens for passive suicidality. This feature is a product safety requirement, not an optional wellness addition.

**Instrument:** PHQ-9 (Kroenke et al., 2001). 9 items, each scored 0-3 (Not at all / Several days / More than half the days / Nearly every day). Total score 0-27.

**Severity thresholds:**  
- 0-4: Minimal depression → no action  
- 5-9: Mild depression → "You've been experiencing some difficult mood changes. You're not alone — depression is very common with endometriosis. Here are some resources." + provider recommendation  
- 10-14: Moderate → prompt to discuss with provider; mental health support resources  
- 15-19: Moderately severe → "Your responses suggest significant depression. Please reach out to your GP or a mental health provider this week."  
- 20-27: Severe → same as moderately severe + immediate crisis resource display  

**PHQ-9 item 9 handling (suicidality screen):**  
Item 9: "Thoughts that you would be better off dead or of hurting yourself in some way."  
- Any response other than "Not at all" (score ≥ 1) → immediate display of crisis resources (not a gentle nudge — a clear, supportive direct message with action steps)  
- Message: "We noticed you may be having some difficult thoughts. You are not alone and support is available right now. [Crisis line / Samaritans / 988 / local number by region]"  
- This cannot be dismissed without confirming the user has seen the crisis resources  

**Scheduling:** Prompt appears monthly (day 1 of new calendar month, or 28 days after last completion). Notification reminder if not completed within 3 days.

**Data model:**
```js
state.endoPhq9Log[date] = {
  items: { q1: 0-3, q2: 0-3, ..., q9: 0-3 },
  totalScore: 0-27,
  severityCategory: 'minimal'|'mild'|'moderate'|'moderately_severe'|'severe',
  item9Flag: Boolean,
  crisisResourcesDisplayed: Boolean,
  trend: 'improving' | 'stable' | 'worsening' | null
}
```

---

#### F100 — GAD-7 Bi-weekly Screen
**Priority:** P0-MVP  
**Complexity:** S (1-3 days)  
**Users:** All endometriosis users (bi-weekly)

**What it does:**  
Administers the 7-item Generalized Anxiety Disorder scale (GAD-7) every two weeks. Endometriosis carries an OR of 2.61 for anxiety disorders. GAD-7 validated at 2-week intervals; provides a signal between monthly PHQ-9 screenings.

**Instrument:** GAD-7 (Spitzer et al., 2006). 7 items, each scored 0-3. Total score 0-21.

**Severity thresholds:**  
- 0-4: Minimal  
- 5-9: Mild → soft resource recommendation  
- 10-14: Moderate → provider recommendation  
- 15-21: Severe → "Your anxiety responses are in the severe range. This level of anxiety is treatable. Please consider speaking with your GP or a mental health professional."  

**Scheduling:** 14 days after last PHQ-9 or GAD-7 completion. Interleaved with PHQ-9 so user is not double-prompted.

**Data model:**
```js
state.endoGad7Log[date] = {
  items: { q1: 0-3, ..., q7: 0-3 },
  totalScore: 0-21,
  severityCategory: String,
  trend: String | null
}
```

---

#### F101 — EHP-30 Monthly QoL Instrument
**Priority:** P0-MVP  
**Complexity:** M (3-7 days)  
**Users:** All endometriosis users (monthly)

**What it does:**  
Administers the Endometriosis Health Profile-30 (EHP-30) — the gold-standard validated quality of life instrument for endometriosis, developed at Oxford University (Jones et al., 2001). 30 items, 5 core subscales. Each item scored 0-4. Subscales converted to 0-100 scale (lower = better QoL).

**Core subscales (30 items total):**

*Pain subscale (11 items):*
- How often pain prevented daily activities  
- How often pain made sleeping difficult  
- How often pain made work difficult  
- How often pain made you feel out of control  
- How often pain made you feel unable to do anything  
- How often pain made you feel depressed  
- How often pain made you feel unable to cope  
- How often pain made you feel anxious  
- How often pain made you feel frustrated  
- How often pain interfered with relationships  
- How often pain was so severe you could not bear it  

*Control and Powerlessness subscale (6 items):*
- How often you felt unable to control what was happening to you because of the condition  
- How often you felt your body had let you down  
- How often you felt out of control  
- How often you felt you had no say in your treatment  
- How often you felt dependent on others  
- How often you felt a burden to others  

*Emotional Well-being subscale (6 items):*
- How often you felt angry about the condition  
- How often you felt bitter about the condition  
- How often you felt frustrated by the condition  
- How often you felt that others did not understand you  
- How often you felt alone  
- How often you felt that life was not worth living  

*Social Support subscale (4 items):*
- How often people close to you were supportive  
- How often your partner was supportive  
- How often your family was supportive  
- How often your friends were supportive  

*Self-image subscale (3 items):*
- How often you felt less of a woman because of the condition  
- How often you felt unattractive because of the condition  
- How often you felt your body was not your own  

**Response scale for all items:** Never (0) / Rarely (1) / Sometimes (2) / Often (3) / Always (4)  
**Note:** Social Support subscale is reverse-scored (Always = 0, Never = 4)

**6 Optional modules** (23 items total) — shown based on context flags:  
- Work module (shown if user works): 7 items  
- Sexual relationships module (shown if user flagged sexually active): 6 items  
- Relationship with children module (shown if applicable): 3 items  
- Medical profession feelings (always available): 3 items  
- Treatment feelings (shown if on treatment): 4 items  
- Infertility module (shown if fertility concern flagged): always available if relevant  

**Scoring:**  
For each subscale: sum all item scores → transform to 0-100 scale  
Formula: `score = (raw_sum / max_possible_sum) × 100`  
Lower score = better quality of life  

**Scheduling:** Monthly. Shown on first day of new calendar month. Estimated completion time: 6-8 minutes.  
**Trend display:** 6-month sparkline per subscale. "Your Pain subscale has improved by X points over the last 3 months." with trend arrow.  

**Optional module display logic:**  
- Work module: shown if `state.endoOnboarding.employment !== 'unemployed_not_seeking'`  
- Sexual module: always available but marked "optional, private" — explicitly excluded from physician report unless user opts in  
- Infertility module: shown if `state.endoOnboarding.fertilityFocused === true`

**Data model:**
```js
state.ehp30Log[date] = {
  core: {
    pain:        { items: [0-4 × 11], score: 0-100 },
    control:     { items: [0-4 × 6],  score: 0-100 },
    emotional:   { items: [0-4 × 6],  score: 0-100 },
    social:      { items: [0-4 × 4],  score: 0-100 },  // reverse scored
    self_image:  { items: [0-4 × 3],  score: 0-100 }
  },
  modules: {
    work:         { completed: Boolean, items: [...], score: 0-100 },
    sexual:       { completed: Boolean, items: [...], score: 0-100, includeInReport: Boolean },
    children:     { completed: Boolean, items: [...], score: 0-100 },
    medical:      { completed: Boolean, items: [...], score: 0-100 },
    treatment:    { completed: Boolean, items: [...], score: 0-100 },
    infertility:  { completed: Boolean, items: [...], score: 0-100 }
  },
  completedAt: ISO_DATETIME,
  trend: { pain: 'improving'|'stable'|'worsening', ... }
}
```

---

#### F102 — EHP-5 Weekly QoL Check-in
**Priority:** P0-MVP  
**Complexity:** S (1-3 days)  
**Users:** All endometriosis users (weekly, between EHP-30 months)

**What it does:**  
The EHP-5 is the 5-item short form of the EHP-30. One item from each of the five core subscales. Provides weekly QoL signal between monthly EHP-30 completions. Estimated completion time: 90 seconds.

**5 items (one per subscale):**  
1. "How often has your pain been so severe that you could not bear it?" [Pain subscale representative]  
2. "How often have you felt out of control?" [Control and Powerlessness subscale representative]  
3. "How often have you felt angry about your condition?" [Emotional Well-being subscale representative]  
4. "How often have people close to you been supportive?" [Social Support — reverse scored]  
5. "How often have you felt less of a woman because of your condition?" [Self-image subscale representative]

**Scoring:** Same 0-4 scale. Sum converted to 0-100 (lower = better).

**Scheduling:** Prompted weekly on same day of week, on weeks where no EHP-30 is scheduled. Notification with single-tap access.

**Data model:**
```js
state.ehp5Log[date] = {
  items: [0-4, 0-4, 0-4, 0-4, 0-4],
  totalScore: 0-100,
  trend: String
}
```

---

#### F103 — B&B Scale Monthly
**Priority:** P0-MVP  
**Complexity:** S (1-3 days)  
**Users:** All endometriosis users (monthly, during/after menstruation)

**What it does:**  
Administers the Biberoglu & Behrman (B&B) Scale — a clinical trial standard instrument for endometriosis symptom severity that combines patient-reported symptoms with physical examination findings. The app captures the 3 patient-reported symptom items; the physical sign items (pelvic tenderness, induration) are noted as "recorded by clinician" and can be entered by the user if their physician has provided this information.

**B&B Scale — Symptom items (patient-reported):**

| Item | Score 0 | Score 1 | Score 2 | Score 3 |
|------|---------|---------|---------|---------|
| Dysmenorrhea | No pain | Mild — does not interfere with activity | Moderate — inhibits activity, analgesia needed | Severe — incapacitating, analgesia ineffective |
| Deep dyspareunia | No pain / not sexually active† | Mild — not interfering | Moderate — inhibits activity | Severe — avoidance of intercourse |
| Non-menstrual pelvic pain (CPP) | No pain | Mild — noticed but not bothersome | Moderate — interferes with some activities | Severe — interferes with most activities |

*† Note displayed: "If you are not currently sexually active, select 'Not applicable.' This item will be excluded from your total score calculation."*

**B&B physical sign items** (clinician-recorded, optional):  
- Pelvic tenderness on examination: 0-3  
- Induration or nodularity: 0-3  
These are shown as a separate "From your last examination" section, clearly marked as clinician data.

**Symptom summary scoring:**  
Symptom items only (0-9): 0 = none, 1-3 = mild, 4-6 = moderate, 7-9 = severe  
This matches the scoring used in clinical trial outcome analysis.

**Scheduling:** Prompted monthly, ideally during menstruation week when symptoms are most assessable. Timing can be user-adjusted.

**Data model:**
```js
state.bbLog[date] = {
  dysmenorrhea: 0-3,
  dyspareunia: 0-3 | null,
  cpp: 0-3,
  symptomTotal: 0-9,
  pelvicTenderness: 0-3 | null,
  induration: 0-3 | null,
  fullTotal: 0-15 | null,
  notSexuallyActive: Boolean,
  completedBy: 'patient' | 'clinician_entered'
}
```

---

#### F104 — Treatment Log + Response Tracker
**Priority:** P0-MVP  
**Complexity:** S (1-3 days)  
**Users:** All endometriosis users on treatment

**What it does:**  
Logs all current and historical endometriosis treatments (hormonal suppression, surgical history, NSAIDs, non-pharmacological) and tracks their effectiveness over time using longitudinal symptom data.

**Treatment types logged:**  
- GnRH agonists (leuprolide/Lupron, buserelin, etc.) — dose, add-back therapy, start date, planned duration  
- GnRH antagonists (elagolix/Orilissa at 150mg or 200mg, relugolix/Myfembree, linzagolix) — dose, add-back, start date  
- Progestins (norethindrone/NETA, medroxyprogesterone/DMPA, levonorgestrel IUD, dienogest)  
- Combined hormonal contraception (CHC) as suppression therapy  
- NSAIDs (see F111 for daily tracking)  
- Post-surgical suppression: type + start date  
- Non-pharmacological: PFPT (see F113), diet modifications, mind-body  

**Response tracking logic:**  
- 6 weeks after a new treatment is started: automated prompt — "It's been 6 weeks since you started [treatment]. How well is it managing your symptoms?"  
- Response NRS: 0-10 ("0 = not at all, 10 = completely effective")  
- Side effect log: fatigue, mood changes, hot flashes, bone density concern, bone pain, other — checkboxes with free text  
- 3-month response report: NRS per pain type before treatment start vs. 3 months in — auto-generated chart for physician  

**Post-surgical suppression flag:**  
ESHRE strongly recommends post-surgical hormonal suppression (reduces recurrence 59%, RR 0.41). If surgery is logged without suppression, educational prompt: "Post-surgical hormonal suppression can significantly reduce recurrence risk. Would you like information about discussing this with your surgeon?"

**Data model:**
```js
state.endoTreatmentLog = {
  current: [{ name, type, dose, startDate, addBack, notes }],
  history: [{ ...same, endDate, reason: String }],
  responseLog: [{ date, treatmentName, responseNRS: 0-10, sideEffects: [...], notes }]
}
```

---

#### F105 — Surgical History Vault
**Priority:** P0-MVP  
**Complexity:** S (1-3 days)  
**Users:** Endometriosis users with surgical history

**What it does:**  
Stores the complete surgical history for endometriosis, including procedure type, rASRM staging (if performed), #ENZIAN staging fields (if available), and operative findings. This is static historical data that enriches the physician report and provides staging context.

**Stored data:**  
- Surgery date  
- Procedure type: diagnostic laparoscopy / excision / ablation / excision + ablation / hysterectomy / oophorectomy / other  
- Surgeon specialty: generalist gynecologist / MIGS/endometriosis specialist / gynecological oncologist  
- Hospital type  
- rASRM Stage: I / II / III / IV (with mandatory caveat card display)  
- #ENZIAN categories (optional, structured input for users with detailed operative reports): P (peritoneal), O (ovarian), B (vaginal/para-cervical), C (recto-vaginal septum), D (intestinal), FA/FB/FU/FI (functional anatomy), A (adenomyosis)  
- EFI (Endometriosis Fertility Index) score: if provided by surgeon (0-10 range, label shown, no in-app calculation)  
- Findings free text: space to enter what the operative report says  
- Histology confirmation: yes/no  

**Caveat card (mandatory when staging is displayed):**  
"Your rASRM stage does not predict how much pain or disability you experience. Research shows Stage I patients often report more severe pain than Stage IV patients. Your symptom log is the most accurate measure of how endometriosis affects your daily life."

**Data model:**
```js
state.endoSurgicalHistory = [{
  date: ISO_DATE,
  type: String,
  surgeonSpecialty: String,
  rASRMStage: 1|2|3|4|null,
  enzian: { P: String, O: String, B: String, C: String, D: String, A: String },
  efi: 0-10 | null,
  findingsText: String,
  histologyConfirmed: Boolean
}]
```

---

#### F106 — Lab Vault (CA-125, AMH, TSH, FSH, E2)
**Priority:** P0-MVP  
**Complexity:** M (3-7 days)  
**Users:** All endometriosis users with lab access

**What it does:**  
Stores and contextualizes key laboratory values relevant to endometriosis. Does NOT diagnose — provides trend tracking and clinical context.

**Lab panels stored:**

**CA-125 (cancer antigen 125):**  
- Value in U/mL  
- Date  
- Interpretation display: "CA-125 can be elevated in endometriosis, but it is NOT a reliable diagnostic test — many women with endometriosis have normal values, and many conditions other than endometriosis can elevate it. In a woman with known endometriosis, tracking it over time can be informative. Reference range: <35 U/mL."  
- Alert: CA-125 > 35 U/mL → "Your CA-125 is above the standard reference range. Discuss this result with your provider — in the context of your endometriosis, they can interpret what this means for you."  
- Trend chart: all entries on timeline  

**AMH (Anti-Müllerian Hormone — ovarian reserve marker):**  
- Value in pmol/L or ng/mL  
- Date  
- Age-appropriate reference range display  
- Alert: AMH decline >20% in any 6-month period → "Your AMH has declined significantly. If fertility is a concern, discuss this with your doctor soon."  
- Context: "Endometriomas (chocolate cysts) can reduce ovarian reserve. AMH gives you and your doctor a picture of your current ovarian reserve."  

**TSH (Thyroid Stimulating Hormone):**  
- Value in mIU/L  
- Date  
- Alert: TSH > 4.5 mIU/L → "Your TSH is above the standard range, suggesting your thyroid may be underactive. Hypothyroidism is 7× more common in people with endometriosis. Discuss with your GP."  
- Context: displayed on first entry: "Thyroid conditions are significantly more common in people with endometriosis. Tracking your TSH helps catch this early."  

**FSH and E2 (estradiol):**  
- Values with dates  
- Context provided for perimenopausal transition interpretation  
- No alert thresholds for endo module (thresholds covered in perimenopause module if active)  

**CRP (inflammatory marker, optional):**  
- Value in mg/L  
- Reference: <5 mg/L standard range  
- Context: "CRP is a general inflammation marker. It is not endometriosis-specific but can help your doctor assess systemic inflammation."

**Data model:**
```js
state.endoLabVault = {
  ca125:  [{ date, value_uml, flag: Boolean }],
  amh:    [{ date, value_pmol, value_ngml }],
  tsh:    [{ date, value_miu_l, flag: Boolean }],
  fsh:    [{ date, value }],
  e2:     [{ date, value }],
  crp:    [{ date, value_mgl }]
}
```

---

#### F107 — Imaging Vault
**Priority:** P0-MVP  
**Complexity:** S (1-3 days)  
**Users:** Endometriosis users with imaging results

**What it does:**  
Stores structured imaging findings from ultrasound and MRI for endometriosis monitoring. Key value: longitudinal tracking of endometrioma size and adenomyosis features for surgical decision support.

**Fields stored:**  
- Imaging date  
- Modality: transvaginal ultrasound (TVUS) / transabdominal US / MRI pelvis / CT  
- Findings: endometrioma (yes/no + laterality + size in mm) — up to 4 endometriomas stored with individual size tracking  
- Adenomyosis features: global/focal, junctional zone thickness in mm, adenomyoma presence  
- DIE identified: (yes/no) posterior compartment, anterior compartment, bowel, bladder, ureter  
- Normal findings: note field  
- Performing clinician type  

**Endometrioma size tracking:**  
If multiple ultrasound entries exist for the same endometrioma (same laterality), the system plots size over time and shows growth trend. Alert if endometrioma grows >5mm in any 6-month period (Month 2 alert logic — F115).

**Data model:**
```js
state.endoImagingVault = [{
  date: ISO_DATE,
  modality: String,
  endometriomas: [{ laterality: 'left'|'right', sizeMaxMM: Number }],
  adenomyosis: { present: Boolean, type: 'global'|'focal', jzThicknessMM: Number | null },
  dieSites: { posterior: Boolean, anterior: Boolean, bowel: Boolean, bladder: Boolean, ureter: Boolean },
  notes: String
}]
```

---

#### F108 — DIE Red Flag + Safety Escalation System
**Priority:** P0-MVP  
**Complexity:** M (3-7 days)  
**Users:** All endometriosis users (automated monitoring)

**What it does:**  
Monitors logged data streams for patterns that indicate Deep Infiltrating Endometriosis involving critical structures (bowel, bladder, ureter, diaphragm) and for mental health crisis signals. Fires escalation messages at the appropriate urgency level.

**Red flag detection rules:**

| Pattern | Data Required | Urgency | Message Trigger |
|---------|--------------|---------|----------------|
| Cyclical rectal bleeding | Rectal bleeding logged in F95 on menstrual phase days across ≥2 cycles | URGENT | Bowel DIE specialist evaluation message |
| Cyclical hematuria | Dysuria NRS > 0 + user confirms blood in urine, menstrual phase, ≥2 cycles | URGENT | Bladder DIE specialist evaluation message |
| Cyclical right shoulder/diaphragm pain | Right shoulder zone in body map F94, menstrual phase, ≥2 cycles | MODERATE | Thoracic/diaphragmatic endo evaluation message |
| Cyclical flank/back pain | Posterior body map zones, kidney-adjacent, menstrual phase, ≥2 cycles | URGENT | Ureteral DIE — silent kidney damage risk message |
| PHQ-9 item 9 ≥ 1 | F99 item 9 score | CRISIS | Crisis resources — immediate, cannot be dismissed |
| PHQ-9 total ≥ 15 | F99 total | HIGH | Significant depression — contact provider this week |
| PHQ-9 total ≥ 10 | F99 total | MODERATE | Depression support resources + GP recommendation |
| Severe pain 7+ days | Any NRS ≥ 8 for ≥7 consecutive daily logs in F93 | HIGH | "Severe persistent pain needs clinical attention" |
| Very heavy bleeding | PBAC estimate > 150 in F96 | MODERATE | "Very heavy periods may need evaluation — HMB is treatable" |
| NSAID overuse | NSAIDs logged on > 50% of all days in any 30-day window (F111) | MODERATE | Long-term NSAID risk alert |

**Message principles (locked by clinical advisory board review):**  
1. Never diagnose: "may indicate" / "warrants evaluation" / "this pattern is worth discussing"  
2. Always name the positive action: "see an endometriosis specialist" / "contact your GP" / "call [crisis line]"  
3. Acknowledge alternative explanations for non-crisis flags: "This could have other explanations — your doctor can clarify"  
4. Crisis messages (PHQ-9 item 9): no softening — direct, warm, actionable. Crisis line numbers by detected locale.

**Escalation history:**  
All triggered escalations are logged in `state.endoRedFlagHistory` — timestamps, type, user acknowledgment. Appears in physician report under "Safety Alerts Triggered."

**Data model:**
```js
state.endoRedFlagHistory = [{
  date: ISO_DATETIME,
  type: String,
  urgency: 'CRISIS'|'URGENT'|'HIGH'|'MODERATE',
  userAcknowledged: Boolean,
  acknowledgedAt: ISO_DATETIME | null
}]

const ENDO_SAFETY_RULES = {
  cyclicalRectalBleeding: { lookbackCycles: 2, urgency: 'URGENT' },
  cyclicalHematuria:      { lookbackCycles: 2, urgency: 'URGENT' },
  cyclicalShoulderPain:   { lookbackCycles: 2, urgency: 'MODERATE' },
  cyclicalFlankPain:      { lookbackCycles: 2, urgency: 'URGENT' },
  phq9Item9:              { threshold: 1,  urgency: 'CRISIS' },
  phq9ModeratelySevere:   { threshold: 15, urgency: 'HIGH' },
  phq9Moderate:           { threshold: 10, urgency: 'MODERATE' },
  severePainStreak:       { nrsThreshold: 8, days: 7, urgency: 'HIGH' },
  heavyBleeding:          { pbacThreshold: 150, urgency: 'MODERATE' },
  nsaidOveruse:           { percentDays: 50, windowDays: 30, urgency: 'MODERATE' }
}
```

---

#### F109 — Structured Physician Report PDF
**Priority:** P0-MVP  
**Complexity:** L (7-14 days)  
**Users:** All endometriosis users (on-demand, shareable)

**What it does:**  
Generates a structured clinical summary document formatted for specialist or GP review. This is the feature that makes HormonaIQ categorically different from every competitor endometriosis app. The report is designed for the clinician as the primary reader, not the patient.

**Report design principles:**  
- Clinical typography: neutral font, black on white, no app aesthetics  
- No app branding in report body (small watermark only in footer)  
- "Summary → Alerts → Instruments → Trends → Raw Data" structure (clinician reads in priority order)

**12-section report structure:**

1. **Patient Summary:** Name/ID (user-controlled), report date range, diagnosis status, condition flags set in onboarding, current treatment  
2. **Clinical Alerts (Safety Flags):** Any red flags triggered during the report period — highlighted box at top of summary page  
3. **Instrument Score Summary Table:** One row per completed instrument with date, score, and trend direction arrow:
   - EHP-30 (all 5 subscales)  
   - EHP-5 (all weekly completions)  
   - B&B Scale (symptom total)  
   - PHQ-9 (total + severity category)  
   - GAD-7 (total + severity category)  
4. **Pain Trend Charts:** NRS per pain type — sparklines for each of 5 pain types over the report period  
5. **Pain Body Map Composite:** Average pain intensity per zone over the report period  
6. **GI Symptom Pattern:** Cyclical vs. non-cyclical breakdown table (especially if IBS comorbidity flagged)  
7. **Treatment Log:** Current treatments, duration, response NRS at 6-week and 3-month check-ins  
8. **Surgical History:** All surgical entries with staging and findings  
9. **Lab Vault Summary:** All lab values with dates, trends, and flags  
10. **Imaging Vault Summary:** All imaging entries with key findings  
11. **User Notes:** Representative sample of user-entered free text (user curates which notes to include)  
12. **Full Raw Data Appendix:** Tabular data for every logged day — for clinicians who want complete records

**Export formats:**  
- PDF: primary format (email, print, AirDrop)  
- CSV/JSON: structured data export (for electronic health records)  
- Shareable link: time-limited (7 days by default, user-set), accessible without app download

**Report history:**  
All generated reports stored in the app (date, content hash, sharing status). User can regenerate reports for any past date range.

---

#### F111 — Medication Log (NSAID + Hormonal)
**Priority:** P0-MVP  
**Complexity:** XS (<1 day)  
**Users:** All endometriosis users on medication

**What it does:**  
Daily flag for NSAID use and monthly hormonal medication adherence log. NSAID use is tracked daily as the primary data source for F118 (NSAID overuse detection). Hormonal medication adherence tracking with missed-dose logging.

**Daily NSAID log (in daily log flow):**  
- "Did you take any pain relief today?" yes/no → if yes: which medication (ibuprofen / naproxen / other NSAID / paracetamol/acetaminophen / opioid / other)  
- Dose/count if tracked  
- Effectiveness: "Did it help?" yes / partial / no  

**Hormonal medication monthly:**  
- Missed doses in the last 30 days (count)  
- Side effects experienced this month (checklist: mood changes, hot flashes, fatigue, bone pain, weight changes, other)  
- Adherence level self-report: taking as directed / sometimes missing / frequently missing  

**Data model:**
```js
state.endoDailyLog[date].medication = {
  nsaidUsed: Boolean,
  nsaidType: String | null,
  nsaidDose: String | null,
  nsaidEffective: 'yes' | 'partial' | 'no' | null
}
state.endoMedAdherenceLog[month] = {
  missedDoses: Number,
  sideEffects: String[],
  adherenceLevel: String
}
```

---

#### F118 — NSAID Overuse Detection + Alert
**Priority:** P0-MVP  
**Complexity:** XS (<1 day)  
**Users:** All endometriosis users using NSAIDs

**What it does:**  
Computes NSAID use rate from F111 daily logs. If NSAIDs are used on >50% of all logged days in any rolling 30-day window, an educational alert is triggered.

**Alert message:** "You've been using pain relief on more than half your logged days this month. Long-term frequent NSAID use can affect your kidneys, stomach, and cardiovascular health. Your provider can discuss other pain management options that may be more suitable for regular use."

**Action offered:** "Would you like to note this for your next appointment?" → adds to physician report discussion items.

---

#### F120 — Multi-format Physician Report Export
**Priority:** P0-MVP  
**Complexity:** S (1-3 days)  
**Users:** All endometriosis users

**What it does:**  
Handles the export mechanics for F109 physician report across formats (PDF, CSV/JSON, shareable link). The report content is defined in F109; this feature handles the export UX and technical delivery.

**Export options:**  
- "Send to my doctor" → email compose with PDF attached  
- "Save to Files" → iOS Files / Android Storage  
- "Share link" → generates time-limited URL (7 days default)  
- "Print" → system print dialog  
- "Download CSV" → structured raw data for EHR import

---

### 4.7.2 — F110–F119, F121 Feature Descriptions (Month 2–3)

---

#### F110 — Comorbidity Tracker
**Priority:** P1-Month2  
**Complexity:** S (1-3 days)  
**Users:** Endometriosis users with comorbid conditions

**What it does:**  
Tracks active comorbid conditions for context in the physician report and to enable cross-condition correlation insights. Endometriosis comorbidities include IBS (3.5× risk), fibromyalgia, hypothyroidism (7× risk), ME/CFS, adenomyosis, anxiety/depression (covered by F99/F100).

**Tracked comorbidities:**  
IBS / IBD / Crohn's / Ulcerative Colitis / Fibromyalgia / Hypothyroidism / Hashimoto's / ME/CFS / Adenomyosis (with confirmation date) / Interstitial Cystitis / Migraines / Other (free text)

**Each comorbidity entry:**  
- Diagnosed: yes / suspected / ruled out  
- Diagnosis date  
- Current treatment for this condition  
- Physician managing this condition  

**Physician report section:**  
"Documented Comorbidities" table — relevant because multiple conditions may explain symptoms and specialists need to know what else is being treated.

---

#### F112 — Trigger Log
**Priority:** P1-Month2  
**Complexity:** S (1-3 days)  
**Users:** All endometriosis users (optional, logged when patterns noticed)

**What it does:**  
Allows users to log potential triggers for symptom flares: dietary, stress-based, activity-based, weather/environmental. Feeds the trigger correlation engine (Month 2 analytics layer) to identify personalized patterns.

**Trigger categories:**  
- Food: specific items (logged by text or selection from common triggers — gluten, dairy, red meat, processed food, alcohol, caffeine)  
- Stress level: NRS 0-10  
- Physical activity: type + duration  
- Environmental: temperature extreme, travel, disrupted sleep  
- Social stress: relationship conflict, work pressure (broad categories, not detailed — privacy)  

**Correlation engine (Month 2):**  
After 30+ days of trigger + symptom data, identify: food items that appear within 24 hours before pain NRS spikes; stress level correlation coefficient with next-day pain; activity types associated with pain increases.

---

#### F113 — PFPT Log + Response Tracker
**Priority:** P1-Month2  
**Complexity:** S (1-3 days)  
**Users:** Endometriosis users in pelvic floor physical therapy

**What it does:**  
Tracks pelvic floor physiotherapy (PFPT) attendance, prescribed exercises, and symptom response. PFPT has RCT evidence for endometriosis-related pelvic pain (Level 1 evidence from 2022-2024 trials). 70% of endometriosis patients have pelvic floor dysfunction.

**Logged per session:**  
- PFPT session: date, duration, therapist type, focus area  
- Home exercises completed: yes / partial / no  
- Post-session pain NRS (24 hours after)  
- Pelvic floor symptoms: pain with Kegel, improved tone, other notes  

**Response tracking:**  
3-month trend: CPP NRS before vs. after starting PFPT (auto-computed from F93 data). Shown as "PFPT Response Chart" in physician report.

---

#### F114 — Adolescent Mode
**Priority:** P2-Month3  
**Complexity:** M (3-7 days)  
**Users:** Users under 18, or users who activate it from settings

**What it does:**  
A language and UX mode adaptation for adolescent endometriosis patients. The clinical value proposition is the same — the framing, terminology, and sharing controls are adapted.

**Adolescent mode adaptations:**  
- Body map: Simple silhouette mode default  
- Language: "period pain" not "dysmenorrhea"; "bowel pain during your period" not "dyschezia"; all clinical terminology replaced with plain description  
- Dyspareunia item: hidden by default (not asked unless user activates "adult health questions" toggle in settings — at their own discretion)  
- School absence tracking: additional field in daily log — "Did symptoms keep you from school today?" yes/no → hours missed  
- Physician report: includes school attendance section (days missed per month) — highly relevant for adolescent specialist consultations  
- Privacy controls: report sections individually PIN-lockable; parent/guardian mode (optional, separate passcode, read-only access to a filtered view)  
- Language about diagnosis: "You're not alone — endometriosis often starts in adolescence and takes years to diagnose. Your symptoms deserve to be taken seriously."

---

#### F115 — Endometrioma Size Monitoring
**Priority:** P1-Month2  
**Complexity:** S (1-3 days)  
**Users:** Endometriosis users with known endometriomas

**What it does:**  
Monitors endometrioma size over time using data from F107 Imaging Vault. Computes growth trend when multiple ultrasound measurements are available for the same endometrioma.

**Alert logic:**  
- Endometrioma grows >5mm in any 6-month period → "Your endometrioma has grown since your last scan. A growing endometrioma may warrant discussion with your specialist about monitoring frequency or surgical options."  
- Endometrioma >4cm → educational context: "Endometriomas larger than 4cm may affect ovarian reserve and are often considered for surgical evaluation. Discuss with your specialist."  

**Ovarian reserve correlation:**  
If both AMH and endometrioma data exist: trend chart showing AMH alongside endometrioma size over time (visual illustration of the ovarian reserve impact).

---

#### F116 — Low-FODMAP / Anti-inflammatory Diet Tracker
**Priority:** P2-Month3  
**Complexity:** L (7-14 days)  
**Users:** Endometriosis users managing GI symptoms through diet

**What it does:**  
Tracks adherence to low-FODMAP or anti-inflammatory dietary protocol alongside GI and pain symptoms. Based on RCT evidence: low-FODMAP diet showed 60% GI response rate vs 26% control in endometriosis patients (2024 RCT). Anti-inflammatory diet: omega-3, reduced red meat, Mediterranean-style patterns.

**Low-FODMAP tracker:**  
- Daily adherence flag: fully compliant / partially compliant / not compliant today  
- High-FODMAP items consumed (optional: flagged from common list)  
- GI symptom NRS on that day (auto-linked from F95)  
- 4-week protocol tracker (standard FODMAP elimination duration)  

**Response analysis:**  
After 4 weeks of tracking: comparison chart — GI scores during protocol vs. baseline. Educational outcome: "Your bloating and bowel pain scores were X% lower during the low-FODMAP protocol compared to the 4 weeks before."

---

#### F117 — Cycle-GI Correlation Insight Engine
**Priority:** P1-Month2  
**Complexity:** M (3-7 days)  
**Users:** All endometriosis users with GI symptom data

**What it does:**  
Analyzes the cyclical pattern of GI symptoms relative to menstrual cycle phase. After 3 cycles of GI + cycle data, computes whether GI symptoms are significantly elevated during the menstrual phase.

**Algorithm:**  
For each GI metric (bloating NRS, rectal pain NRS, diarrhea frequency):  
- Compute mean during menstrual phase days (cycle days 1-5) vs. mean during non-menstrual days  
- If menstrual-phase mean is ≥30% higher: flag as "menstrually-linked"  
- Statistical test: Wilcoxon signed-rank on paired cycle data  

**Insight card (when pattern detected):**  
"Your bowel symptoms appear to be significantly worse during your period. This pattern — bowel pain and changes that follow the menstrual cycle — can indicate endometriosis affecting the bowel area. This data may help your doctor distinguish between IBS and endometriosis. We've added this pattern to your physician report."

**IBS distinction caveat:**  
"Note: Bowel symptoms that worsen with stress or certain foods — and are not specifically worse during your period — are more typical of IBS. Your data shows [X pattern]. Your doctor can interpret this in the context of your full history."

**Physician report output:**  
"GI-Cycle Correlation Analysis" section with a simple chart showing GI scores by cycle phase (boxplot or bar chart, monochrome).

---

#### F119 — Staging Display (rASRM + #ENZIAN)
**Priority:** P1-Month2  
**Complexity:** S (1-3 days)  
**Users:** Endometriosis users who have provided staging information in F105

**What it does:**  
Displays stored staging information from the Surgical History Vault with mandatory clinical context. This is a display feature only — the data is entered in F105.

**rASRM display:**  
"Your recorded stage: Stage III (Moderate)"  
Immediately followed by mandatory caveat card (cannot be hidden or dismissed):  
"Important context: rASRM staging does not predict how much pain or disability you experience. Stage I patients frequently report more severe pain than Stage IV patients. The stage describes the physical extent of disease found during surgery — not how endometriosis affects your quality of life. Your symptom log is a more accurate measure of your daily experience."

**#ENZIAN display:**  
If ENZIAN data entered: structured display by compartment (P, O, B, C, D, A) with plain English description of what each compartment means:  
- P (Peritoneal): "Endometriosis on the membrane lining the abdomen"  
- O (Ovarian): "Endometriosis on or in the ovaries (chocolate cysts)"  
- B (Vaginal/cervical area): "Endometriosis near the vagina or cervix"  
- etc.  

**ESHRE 2022 note:**  
For undiagnosed users: educational card noting that ESHRE now accepts empirical clinical diagnosis — laparoscopy is no longer required for diagnosis in patients with a classical symptom presentation. This empowers users to pursue clinical diagnosis without demanding surgery first.

---

#### F121 — Research Export (Anonymized, Opt-in)
**Priority:** P2-Month3  
**Complexity:** L (7-14 days)  
**Users:** Endometriosis users who opt in to research participation

**What it does:**  
Enables consented, anonymized data contribution to endometriosis research, compatible with Phendo (Columbia University) and other research initiatives. This is a trust-building and credibility feature — being cited in academic research is a powerful acquisition signal for the "I've done my research" segment of endo patients.

**Requirements:**  
- Fully opt-in — never a default, never a condition of using the app  
- IRB-reviewed data sharing agreement required before launch  
- Anonymized: all personal identifiers removed, age-banded, geographic data coarsened to country level  
- User can see exactly what data would be shared before opting in  
- User can withdraw consent and request deletion at any time  
- Research partners disclosed by name (no generic "third parties")  
- GDPR + HIPAA compliant architecture required  

---

### 4.7.3 — Section 4.7 Combined Summary Table

| Code | Feature Name | Priority | Complexity | User Segment |
|------|-------------|----------|------------|-------------|
| F92 | Endometriosis Condition Onboarding | P0-MVP | M | All endo |
| F93 | Daily 5-D Pain NRS Logger | P0-MVP | M | All endo |
| F94 | Pain Location Body Map | P0-MVP | L | All endo |
| F95 | GI/Bowel Symptom Daily Log | P0-MVP | S | All endo |
| F96 | Bleeding/HMB Cycle Log | P0-MVP | S | Menstruating endo |
| F97 | Fatigue + Brain Fog Daily Log | P0-MVP | XS | All endo |
| F98 | Sleep Quality Daily Log | P0-MVP | XS | All endo |
| F99 | PHQ-9 Monthly Safety Screen | P0-MVP | S | All endo |
| F100 | GAD-7 Bi-weekly Screen | P0-MVP | S | All endo |
| F101 | EHP-30 Monthly QoL Instrument | P0-MVP | M | All endo |
| F102 | EHP-5 Weekly QoL Check-in | P0-MVP | S | All endo |
| F103 | B&B Scale Monthly | P0-MVP | S | All endo |
| F104 | Treatment Log + Response Tracker | P0-MVP | S | Endo on treatment |
| F105 | Surgical History Vault | P0-MVP | S | Post-surgical endo |
| F106 | Lab Vault (CA-125, AMH, TSH, FSH, E2) | P0-MVP | M | All endo |
| F107 | Imaging Vault | P0-MVP | S | Endo with imaging |
| F108 | DIE Red Flag + Safety Escalation System | P0-MVP | M | All endo |
| F109 | Structured Physician Report PDF | P0-MVP | L | All endo |
| F110 | Comorbidity Tracker | P1-Month2 | S | Endo with comorbidities |
| F111 | Medication Log (NSAID + Hormonal) | P0-MVP | XS | Endo on medication |
| F112 | Trigger Log | P1-Month2 | S | All endo |
| F113 | PFPT Log + Response Tracker | P1-Month2 | S | Endo in PFPT |
| F114 | Adolescent Mode | P2-Month3 | M | Users under 18 |
| F115 | Endometrioma Size Monitoring | P1-Month2 | S | Endo with endometriomas |
| F116 | Low-FODMAP / Diet Tracker | P2-Month3 | L | Endo with GI symptoms |
| F117 | Cycle-GI Correlation Insight Engine | P1-Month2 | M | All endo |
| F118 | NSAID Overuse Detection + Alert | P0-MVP | XS | Endo using NSAIDs |
| F119 | Staging Display (rASRM + #ENZIAN) | P1-Month2 | S | Endo with staging data |
| F120 | Multi-format Physician Report Export | P0-MVP | S | All endo |
| F121 | Research Export (Opt-in) | P2-Month3 | L | Endo consenting to research |

**Total endometriosis features: 30 (F92–F121)**
**P0-MVP endometriosis features: 16 (F92–F109, F111, F118, F120)**
**P1-Month2 features: 7 (F110, F112, F113, F115, F117, F119)**
**P2-Month3 features: 4 (F114, F116, F121 + Month3 export formats)**
**Combined total HormonaIQ features (through endometriosis): 121**

---

## Section 4.8 — ADHD Module Features (F122–F151)

**Clinical basis:** Attention Deficit Hyperactivity Disorder (ADHD) affects 3.1% of adults globally; in the US, ~15.5M adults, and women are significantly underdiagnosed (male:female ratio 2:1 in childhood narrows to 1.6:1 in adulthood as women seek diagnosis later). Mean diagnostic delay for women is 4+ years longer than men. 75% of ADHD adults have ≥1 comorbid condition. Estrogen modulates dopamine synthesis and PFC function, creating clinically significant symptom fluctuation across the menstrual cycle, postpartum, and perimenopause — a domain no existing ADHD app addresses. HormonaIQ's ADHD module is the first to integrate validated clinical instruments, daily symptom tracking, and hormonal cycle correlation in a single product.

**Primary instruments used:**
- **ASRS-5** (6 items; sensitivity 90%, specificity 88%) — monthly screener
- **ADHD-RS** (18 items; 0–54 scale) — monthly severity tracker; Vyvanse RCT benchmark: 19-point reduction
- **CAARS Emotional Lability subscale** (Conners' Adult ADHD Rating Scales) — monthly; T-score ≥70 = very elevated
- **WFIRS-S** (50 items, 6 domains; cutoff ≥0.65 impaired; 83% sensitivity, 85% specificity) — monthly functional impairment
- **Brown EF/A** (5 clusters: Activation, Focus, Effort, Emotion, Memory) — monthly EF profile
- **PHQ-9** (monthly; item 9 crisis gate — cannot be dismissed without confirming safety)
- **GAD-7** (bi-weekly; 53% of girls with ADHD have anxiety)
- **ISI** (7 items, 0–28; ≥15 = moderate insomnia; 80% of ADHD adults have sleep disorder)

**Key product differentiators vs. competitors:**
- Inflow (CBT-based, AI coach, $0.55/day): no validated clinical instruments, no cycle tracking, no physician report
- Focusmate: body doubling only, no clinical depth
- Routinery/Tiimo: visual planners only

HormonaIQ adds: validated instruments + cycle-phase correlation + physician-ready PDF + RSD/hyperfocus/masking tracking — all in one log.

---

### F122 — ADHD Condition Onboarding

**Priority:** P0-MVP | **Effort:** M | **Sprint:** Round 5

**What it does:** Three-branch onboarding flow that routes users based on diagnosis status: (1) diagnosed ADHD, (2) suspected ADHD/seeking assessment, (3) hormonal/cycle-aware support for known ADHD. Collects presentation type, hormonal context (contraception, perimenopausal status), comorbidities, primary challenges, and current medication status. Branch 2 (suspected/seeking) receives additional "understanding your ADHD" orientation content and assessment prep guidance.

**Clinical rationale:** ADHD presentation type (inattentive, hyperactive-impulsive, combined) determines which instrument subscales to prioritize. Hormonal context (particularly perimenopausal status and hormonal contraception type) determines whether cycle correlation module is active and which baseline assumptions apply. Comorbidity collection at onboarding allows the app to proactively show relevant co-screens (e.g., PMDD intersection module, fibromyalgia overlap).

**UX design notes:** Branch 1 (diagnosed) completes in 6–8 taps. Branch 2 (suspected) includes a 3-card "what to expect" sequence explaining that HormonaIQ tracks symptoms but does not diagnose. Branch 3 activates cycle correlation immediately. All branches end with a "what you'll track" preview screen showing the 5 daily domains. No clinical jargon in UI copy ("emotional dysregulation" not "RSD"; "executive function" not "prefrontal cortex dysregulation").

**State schema:**
```js
state.adhdOnboarding = {
  activatedAt: ISO_DATE,
  diagnosisStatus: 'diagnosed' | 'suspected' | 'undiagnosed' | 'recently_diagnosed',
  presentationType: 'inattentive' | 'hyperactive_impulsive' | 'combined' | 'unspecified' | null,
  isOnHormonalContraception: Boolean,
  contraceptionType: 'combined_pill' | 'progestin_only_pill' | 'hormonal_iud' | 'implant' |
                     'injection' | 'patch' | 'ring' | 'none' | null,
  perimenopausalStatus: 'not_yet' | 'perimenopause' | 'postmenopause' | 'unknown',
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
    chronic_fatigue: Boolean
  },
  primaryChallenges: ['focus' | 'organization' | 'time_management' | 'emotional_regulation' |
                      'relationships' | 'work_performance' | 'sleep' | 'impulsivity'],
  currentlyMedicated: Boolean,
  adultMode: Boolean,         // always true for HormonaIQ (18+)
  brainFogModeEnabled: Boolean  // simplifies UI language on heavy symptom days
}
```

**Alerts/gates:** If `diagnosisStatus === 'suspected'`, surface assessment prep guide (F150 content preview) and explain that physician report (F138) generates 90 days after activation to ensure meaningful data.

---

### F123 — Daily 5-Domain ADHD Symptom Log

**Priority:** P0-MVP | **Effort:** M | **Sprint:** Round 5

**What it does:** Daily check-in covering five core ADHD domains via 0–10 NRS sliders: (1) attention/focus, (2) impulsivity, (3) executive function, (4) working memory, (5) emotional regulation. Each domain shows a 7-day sparkline of previous ratings. Optional structured context badges auto-populate: cycle day, medication taken (yes/no). RSD quick-add button accessible anywhere in the log.

**Clinical rationale:** Barkley's executive function model identifies five distinct domains that map impairment more precisely than a single ADHD severity score. Tracking them separately allows the app to identify which domains fluctuate with cycle phase (emotional regulation and working memory show the strongest luteal-phase dip) vs. which remain stable (impulsivity is typically more trait-like than state-like). Daily frequency is necessary to capture the variability that clinicians need — a monthly ADHD-RS cannot detect intra-cycle fluctuations that occur over 2–5 day windows.

**UX design notes:** Opening question is a single gestalt tap: "Overall today, how's your brain working?" on a 5-emoji scale. This gives an immediate low-friction entry; full 5-domain log is the "detail" expansion below. Total completion time: ≤90 seconds. Medication taken and cycle day appear as passive context badges (not questions) — they auto-pull from F133 and cycle tracking respectively. Post-log: one-line insight if today's pattern matches a known trigger or luteal dip pattern.

**State schema:**
```js
state.adhdDailyLog[ISO_DATE] = {
  gestalt_nrs: 1 | 2 | 3 | 4 | 5,           // emoji scale: 1=crashed, 5=in the zone
  attention_nrs: 0-10,
  impulsivity_nrs: 0-10,
  executive_function_nrs: 0-10,
  working_memory_nrs: 0-10,
  emotional_regulation_nrs: 0-10,
  rsd_episode: Boolean,
  rsd_intensity_nrs: 0-10 | null,
  rsd_trigger: String | null,
  rsd_recovery_time_hours: Number | null,
  hyperfocus_episode: Boolean,
  hyperfocus_duration_hours: Number | null,
  post_hyperfocus_crash: Boolean,
  masking_effort_nrs: 0-10,
  time_blindness_impact: Boolean,
  missed_appointment_or_deadline: Boolean,
  bfrb_episode: Boolean,
  bfrb_type: ['skin_picking' | 'hair_pulling' | 'nail_biting' | 'cheek_chewing' | 'other'],
  bfrb_context: String | null,
  sleep_quality_nrs: 0-10,
  hours_slept: Number | null,
  sleep_onset_time: String | null,   // HH:MM format
  medication_taken: Boolean,
  medication_effectiveness_nrs: 0-10 | null,
  medication_side_effects: ['appetite_loss' | 'insomnia' | 'anxiety' | 'headache' |
                             'irritability' | 'heart_racing' | 'other'],
  cyclePhase: 'menstrual' | 'follicular' | 'periovulatory' | 'luteal' |
              'premenstrual' | 'suppressed' | 'irregular' | 'unknown',
  cycleDayNumber: Number | null,
  note: String | null
}
```

**Computed fields (derived nightly):**
```js
const adhd_daily_composite = (log) => {
  const domains = [log.attention_nrs, log.impulsivity_nrs, log.executive_function_nrs,
                   log.working_memory_nrs, log.emotional_regulation_nrs];
  return domains.reduce((a, b) => a + b, 0) / domains.length;
};
```

---

### F124 — ASRS-5 Monthly Screener

**Priority:** P0-MVP | **Effort:** S | **Sprint:** Round 5

**What it does:** Full 6-item Adult ADHD Self-Report Scale (ASRS-5) administered monthly. Items use a 5-point frequency scale (Never / Rarely / Sometimes / Often / Very Often). Part A = 6 screener items; threshold: ≥4 of 6 at "Often" or "Very Often" = positive screen. App presents with clinical validation note: "This is the WHO-validated ADHD screener used in primary care settings worldwide."

**Clinical rationale:** ASRS-5 has sensitivity 90%, specificity 88% — the highest validated sensitivity of any brief adult ADHD screener. Monthly tracking allows the app to surface trend changes (worsening score after medication trial cessation, improvement after dose titration, premenstrual score spikes). For undiagnosed users (diagnosisStatus === 'suspected'), ASRS-5 trajectory is included in the assessment prep report (F138).

**Scoring algorithm:**
```js
const scoreAsrs5 = (responses) => {
  // responses: array of 6 values 0-4 (Never=0 to Very Often=4)
  const partA_positive = responses.filter(r => r >= 3).length; // Often or Very Often
  return {
    raw_scores: responses,
    partA_positive_count: partA_positive,
    screen_positive: partA_positive >= 4,
    total_raw: responses.reduce((a, b) => a + b, 0),
    date: new Date().toISOString().split('T')[0]
  };
};
```

**State schema:**
```js
state.adhdAsrs5Log[ISO_DATE] = {
  items: [0-4, 0-4, 0-4, 0-4, 0-4, 0-4],  // 6 ASRS-5 items
  partA_positive_count: Number,
  screen_positive: Boolean,
  total_raw: Number,
  cyclePhase: String,
  cycleDayNumber: Number | null,
  note: String | null
}
```

**Trend alert:** If ASRS-5 screen_positive after 2 consecutive months where previously negative → surface message: "Your ADHD screener results have changed. This may be worth discussing with your doctor."

---

### F125 — ADHD-RS Monthly Severity Tracker

**Priority:** P0-MVP | **Effort:** M | **Sprint:** Round 5

**What it does:** Full 18-item ADHD Rating Scale (ADHD-RS) administered monthly. Items split into two subscales: 9 Inattention items (items 1, 3, 5, 7, 9, 11, 13, 15, 17) and 9 Hyperactivity-Impulsivity items (items 2, 4, 6, 8, 10, 12, 14, 16, 18). Each item rated 0–3 (Never/Rarely, Sometimes, Often, Very Often). Total score range: 0–54. Inattention subscale: 0–27. H/I subscale: 0–27.

**Clinical rationale:** ADHD-RS is the primary outcome measure in most ADHD medication RCTs, including the pivotal Vyvanse (lisdexamfetamine) trials. The standard clinical benchmark is a 30% reduction from baseline = "responder." The Vyvanse Phase 3 trial showed a mean 19-point reduction from baseline (vs. 5-point placebo). Monthly tracking against the user's own baseline allows the app to detect medication response patterns and luteal-phase dips in a clinically meaningful way.

**Scoring algorithm:**
```js
const scoreAdhdRs = (responses) => {
  // responses: 18 values 0-3
  const inattention_items = [0,2,4,6,8,10,12,14,16]; // 0-indexed odd DSM items
  const hyperactivity_items = [1,3,5,7,9,11,13,15,17];
  const inattention_total = inattention_items.reduce((sum, i) => sum + responses[i], 0);
  const hyperactivity_total = hyperactivity_items.reduce((sum, i) => sum + responses[i], 0);
  const total = inattention_total + hyperactivity_total;
  return {
    inattention_total,          // 0-27
    hyperactivity_total,        // 0-27
    total,                      // 0-54
    severity: total <= 16 ? 'mild' : total <= 28 ? 'moderate' : 'severe',
    responder_threshold_30pct: null  // computed against baseline after first score
  };
};

const computeAdhdRsResponse = (baseline_total, current_total) => {
  const reduction_pct = ((baseline_total - current_total) / baseline_total) * 100;
  return {
    reduction_pct,
    is_responder: reduction_pct >= 30,
    vs_vyvanse_benchmark: current_total <= baseline_total - 19
  };
};
```

**State schema:**
```js
state.adhdRsLog[ISO_DATE] = {
  items: Array(18).fill(0-3),
  inattention_total: Number,   // 0-27
  hyperactivity_total: Number, // 0-27
  total: Number,               // 0-54
  severity: 'mild' | 'moderate' | 'severe',
  baseline_date: ISO_DATE | null,
  reduction_from_baseline_pct: Number | null,
  is_responder: Boolean | null,
  cyclePhase: String,
  cycleDayNumber: Number | null,
  medication_context: String | null  // medication name if currently taking
}
```

**Alert:** If two consecutive ADHD-RS scores show ≥20% worsening from personal best → "Your ADHD symptoms have increased significantly over the past two months. Consider discussing this with your prescriber."

---

### F126 — CAARS Emotional Lability Module

**Priority:** P0-MVP | **Effort:** S | **Sprint:** Round 5

**What it does:** Administers the Emotional Lability subscale from the Conners' Adult ADHD Rating Scales (CAARS) monthly. 8 items rated 0–3 (Not at all / Just a little / Pretty much / Very much). T-score computation: mean=50, SD=10. T ≥65 = elevated; T ≥70 = very elevated. Items cover mood swings, irritability, emotional reactivity, and dysregulation.

**Clinical rationale:** Emotional dysregulation is present in up to 50–70% of ADHD adults and is one of the most impactful quality-of-life domains — yet it is not captured in the DSM-5 ADHD criteria. The CAARS Emotional Lability subscale is the most validated instrument for this domain. Tracking it separately from the broader ADHD-RS total allows the app to distinguish between cognitive/attention impairment trajectories and emotional dysregulation trajectories, which may respond differently to medication and to cycle phase.

**T-score computation:**
```js
const scoreCAARSEmotionalLability = (rawItems) => {
  // rawItems: 8 values 0-3
  const rawSum = rawItems.reduce((a, b) => a + b, 0);
  // Normative T-score conversion (simplified linear approximation)
  // Full normative tables by age/sex required for production; this is a placeholder
  const t_score = 50 + ((rawSum - 12) / 3) * 10;  // mean=12, SD=3 approximate
  return {
    raw_sum: rawSum,
    t_score: Math.round(t_score),
    elevation: t_score >= 70 ? 'very_elevated' : t_score >= 65 ? 'elevated' : 'average'
  };
};
```

**State schema:**
```js
state.adhdCaarsLog[ISO_DATE] = {
  emotional_lability_items: Array(8).fill(0-3),
  raw_sum: Number,
  t_score: Number,
  elevation: 'average' | 'elevated' | 'very_elevated',
  cyclePhase: String,
  cycleDayNumber: Number | null,
  note: String | null
}
```

**Alert:** If T ≥70 for two consecutive months → surface CAARS score in physician report with flag: "Emotional dysregulation is elevated — may benefit from specific intervention discussion." No diagnostic language; clinical observation only.

---

### F127 — WFIRS-S Monthly Functional Impairment

**Priority:** P0-MVP | **Effort:** M | **Sprint:** Round 5

**What it does:** Full 50-item Weiss Functional Impairment Rating Scale — Self-Report (WFIRS-S) administered monthly. Six domains: Family (10 items), Work/School (10 items), Life Skills (9 items), Social (7 items), Risky Activities (5 items), Self-Concept (9 items). Items rated 0–3 (Never/Rarely, Sometimes, Often, Daily/Always). Domain score = mean of domain items. Global score = mean of all 50 items. Cutoff: ≥0.65 impaired (83% sensitivity, 85% specificity).

**Clinical rationale:** ADHD symptoms alone do not determine treatment decisions — functional impairment does. A user with moderate ADHD-RS scores but high WFIRS-S impairment needs different support than a user with high ADHD-RS scores who functions well. WFIRS-S tracks six life domains that capture the downstream consequences of ADHD — the areas users actually complain about. Domain-level tracking allows the app to identify the life area most improved or worsened, enabling targeted insights.

**Scoring algorithm:**
```js
const WFIRS_DOMAINS = {
  family: { items: [0..9], label: 'Family & Home' },
  work_school: { items: [10..19], label: 'Work / School' },
  life_skills: { items: [20..28], label: 'Life Skills' },
  social: { items: [29..35], label: 'Social Activities' },
  risky: { items: [36..40], label: 'Risky Activities' },
  self_concept: { items: [41..49], label: 'Self-Concept' }
};

const scoreWFIRS = (responses) => {
  const domainScores = {};
  Object.entries(WFIRS_DOMAINS).forEach(([key, domain]) => {
    const items = domain.items.map(i => responses[i]);
    domainScores[key] = items.reduce((a, b) => a + b, 0) / items.length;
  });
  const global_mean = responses.reduce((a, b) => a + b, 0) / 50;
  return {
    domain_scores: domainScores,
    global_mean,
    global_impaired: global_mean >= 0.65,
    most_impaired_domain: Object.entries(domainScores).sort((a,b) => b[1]-a[1])[0][0]
  };
};
```

**State schema:**
```js
state.adhdWfirsLog[ISO_DATE] = {
  items: Array(50).fill(0-3),
  domain_scores: {
    family: Number,
    work_school: Number,
    life_skills: Number,
    social: Number,
    risky: Number,
    self_concept: Number
  },
  global_mean: Number,
  global_impaired: Boolean,
  most_impaired_domain: String,
  cyclePhase: String,
  cycleDayNumber: Number | null
}
```

**Physician report integration:** WFIRS-S domain scores included in F138 report as a functional impact radar chart. Most impaired domain highlighted in physician summary section.

---

### F128 — PHQ-9 Monthly Safety Screen

**Priority:** P0-MVP | **Effort:** S | **Sprint:** Round 5

**What it does:** Full 9-item Patient Health Questionnaire (PHQ-9) administered monthly. Each item rated 0–3 (Not at all / Several days / More than half the days / Nearly every day). Score range 0–27. Severity: 0–4 none, 5–9 mild, 10–14 moderate, 15–19 moderately severe, 20–27 severe. **Item 9 (suicidality) is a hard crisis gate: any response ≥1 triggers the crisis protocol and cannot be dismissed without explicit safety confirmation.**

**Clinical rationale:** Women with ADHD have approximately 2.3× higher suicidality risk than women without ADHD. Depression comorbidity occurs in ~38% of ADHD adults. PHQ-9 is included as a mandatory monthly safety instrument — not just a comorbidity screen. The item 9 gate is non-negotiable and is the same mechanism used in F99 (endometriosis module) for consistency across all HormonaIQ modules.

**Scoring algorithm:**
```js
const scorePHQ9 = (responses) => {
  const total = responses.reduce((a, b) => a + b, 0);
  const item9 = responses[8]; // zero-indexed
  return {
    total,
    severity: total <= 4 ? 'none' : total <= 9 ? 'mild' : total <= 14 ? 'moderate' :
              total <= 19 ? 'moderately_severe' : 'severe',
    item9_suicidality: item9,
    crisis_gate_triggered: item9 >= 1,
    phq9_flag: total >= 10 ? 'DEPRESSION_SCREEN_POSITIVE' : null
  };
};
```

**Safety protocol (item 9 gate):**
- Item 9 ≥ 1: Full-screen crisis card appears. Cannot be dismissed. User must tap one of three options:
  1. "I'm safe — this is passive ideation only" → logs confirmation, adds note to physician report
  2. "I need to talk to someone" → shows crisis line numbers (988, Crisis Text Line)
  3. "I need immediate help" → shows emergency services and nearest ER prompt
- Item 9 = 0 AND total ≥ 15: yellow warning banner, no gate

**State schema:**
```js
state.adhdPhq9Log[ISO_DATE] = {
  items: Array(9).fill(0-3),
  total: Number,
  severity: 'none' | 'mild' | 'moderate' | 'moderately_severe' | 'severe',
  item9_suicidality: 0-3,
  crisis_gate_triggered: Boolean,
  crisis_gate_response: 'passive_safe' | 'needs_support' | 'needs_emergency' | null,
  cyclePhase: String,
  cycleDayNumber: Number | null
}
```

---

### F129 — GAD-7 Bi-weekly Screen

**Priority:** P0-MVP | **Effort:** S | **Sprint:** Round 5

**What it does:** Full 7-item Generalized Anxiety Disorder scale (GAD-7) administered bi-weekly (every 14 days). Each item rated 0–3. Total score 0–21. Severity: 0–4 minimal, 5–9 mild, 10–14 moderate, 15+ severe. Clinical threshold for anxiety disorder: ≥10.

**Clinical rationale:** 53% of girls with ADHD have comorbid anxiety; adult rates similarly elevated. Anxiety and ADHD are frequently misdiagnosed as each other (especially in women), and their interaction is clinically complex — stimulant medication can exacerbate anxiety in some patients. Bi-weekly frequency (vs. monthly) allows the app to detect luteal-phase anxiety spikes that are distinct from generalized GAD trajectory. The distinction between cycle-correlated anxiety spikes and persistent anxiety trend matters for treatment decisions.

**Scoring algorithm:**
```js
const scoreGAD7 = (responses) => {
  const total = responses.reduce((a, b) => a + b, 0);
  return {
    total,
    severity: total <= 4 ? 'minimal' : total <= 9 ? 'mild' : total <= 14 ? 'moderate' : 'severe',
    clinical_threshold_met: total >= 10
  };
};
```

**State schema:**
```js
state.adhdGad7Log[ISO_DATE] = {
  items: Array(7).fill(0-3),
  total: Number,
  severity: 'minimal' | 'mild' | 'moderate' | 'severe',
  clinical_threshold_met: Boolean,
  cyclePhase: String,
  cycleDayNumber: Number | null
}
```

**Luteal-phase anxiety alert:** If GAD-7 score is ≥10 in luteal phase but <10 in follicular phase for two consecutive cycles → surface insight: "Your anxiety appears to increase in the second half of your cycle. This pattern is common in ADHD and may be related to hormonal shifts. Worth discussing with your doctor."

---

### F130 — ISI Monthly Insomnia Scale

**Priority:** P0-MVP | **Effort:** S | **Sprint:** Round 5

**What it does:** Full 7-item Insomnia Severity Index (ISI) administered monthly. Items cover sleep onset difficulty, sleep maintenance, early awakening, sleep satisfaction, impact on daytime function, noticeability by others, and distress. Each item 0–4. Total score 0–28. Thresholds: 0–7 no insomnia, 8–14 subthreshold, 15–21 moderate, 22–28 severe.

**Clinical rationale:** 80% of ADHD adults have a sleep disorder. ADHD-related sleep problems are clinically distinct from general insomnia: they are driven by delayed DLMO (dim-light melatonin onset — delayed ~90 minutes in ADHD), circadian phase delay, and racing thoughts preventing sleep onset. Stimulant medications also disrupt sleep in a dose-timing-dependent manner. The ISI combined with sleep onset time from F123 (daily log) and F136 (circadian tracker) allows the app to distinguish circadian-driven delay from medication-driven insomnia from anxiety-driven insomnia.

**Scoring:**
```js
const scoreISI = (responses) => {
  const total = responses.reduce((a, b) => a + b, 0);
  return {
    total,
    severity: total <= 7 ? 'none' : total <= 14 ? 'subthreshold' :
              total <= 21 ? 'moderate' : 'severe',
    clinically_significant: total >= 15
  };
};
```

**State schema:**
```js
state.adhdIsiLog[ISO_DATE] = {
  items: Array(7).fill(0-4),
  total: Number,
  severity: 'none' | 'subthreshold' | 'moderate' | 'severe',
  clinically_significant: Boolean,
  cyclePhase: String,
  cycleDayNumber: Number | null
}
```

**Cross-reference alert:** If ISI ≥15 AND F133 medication log shows stimulant taken within 8h of reported bedtime → surface: "Your insomnia is significant and your medication timing may be a contributing factor. Discuss dosing schedule with your prescriber."

---

### F131 — Emotional Dysregulation / RSD Episode Log

**Priority:** P0-MVP | **Effort:** S | **Sprint:** Round 5

**What it does:** Quick-log for discrete emotional dysregulation episodes. Captures: intensity (0–10 NRS), perceived trigger (perceived rejection, criticism, failure, unexpected change, sensory overwhelm, other), recovery time estimate, whether episode was masked/hidden, and whether it impacted work or relationships. Accessible via floating quick-add button throughout the app — not buried in daily log.

**Clinical rationale:** Rejection Sensitive Dysphoria (RSD) is present in up to 99% of ADHD adults per Russell Barkley's clinical data. It is not a DSM-5 criterion, but it is one of the most disabling features of adult ADHD — particularly for women, who more often mask the outward expression of RSD while experiencing full internal intensity. The app uses the term "intense emotional reactions" in user-facing copy and "emotional dysregulation episode" in clinical context. It does not use "RSD" in the UI to avoid diagnostic labeling and to prevent users from catastrophizing a clinically undefined construct. The CAARS Emotional Lability subscale (F126) provides the validated backing instrument; this log provides granular episode-level data.

**UX design notes:** Quick-add card appears as a floating action button. Title: "Overwhelmed by a reaction?" 3-tap log: intensity → trigger category → recovery estimate → done. Longer detail available on tap. Episode log is never shown in a count/streak format — no "You had 5 episodes this week" shaming. Instead: trend shown as "pattern" with curiosity framing.

**State schema:**
```js
state.adhdEpisodeLog[ISO_DATE + '_' + timestamp] = {
  timestamp: ISO_DATETIME,
  intensity_nrs: 0-10,
  trigger: 'perceived_rejection' | 'criticism' | 'failure' | 'unexpected_change' |
           'sensory_overwhelm' | 'other',
  trigger_detail: String | null,
  recovery_time_hours: Number | null,
  was_masked: Boolean,
  impacted_work: Boolean,
  impacted_relationship: Boolean,
  cyclePhase: String,
  cycleDayNumber: Number | null,
  note: String | null
}
```

**Physician report integration:** Episode frequency and intensity trend (past 90 days) included in F138 report. Cycle-phase episode rate comparison included if cycle data available.

---

### F132 — Hyperfocus + Crash Log

**Priority:** P0-MVP | **Effort:** XS | **Sprint:** Round 5

**What it does:** Lightweight log for hyperfocus episodes: duration (hours), domain (work, hobby, research, gaming, social media, cleaning, other), whether the user intentionally entered it or "fell in," whether a post-hyperfocus crash occurred, and crash severity (0–10 NRS). Can be logged retrospectively.

**Clinical rationale:** Hyperfocus is the paradoxical "dopamine lock-on" state where an ADHD brain achieves intense, sustained focus on a high-interest task — the same interest-based nervous system that makes routine tasks impossible. It is poorly documented in existing ADHD apps. The crash that follows (mental exhaustion, irritability, inability to initiate the next task) is a significant impairment driver and a pattern most ADHD adults recognize. Tracking hyperfocus-crash cycles allows the app to correlate them with cycle phase (luteal-phase hyperfocus may be a compensatory mechanism), medication status, and burnout risk accumulation (F145).

**State schema:**
```js
state.adhdHyperfocusLog[ISO_DATE + '_' + timestamp] = {
  timestamp: ISO_DATETIME,
  duration_hours: Number,
  domain: 'work' | 'hobby' | 'research' | 'gaming' | 'social_media' | 'cleaning' | 'other',
  intentional: Boolean,
  post_crash: Boolean,
  crash_severity_nrs: 0-10 | null,
  cyclePhase: String,
  cycleDayNumber: Number | null,
  note: String | null
}
```

**Burnout contribution:** Hyperfocus hours that result in post_crash = true contribute to F145 burnout risk score. Rolling 14-day total: >20h hyperfocus-with-crash = elevated burnout risk flag.

---

### F133 — ADHD Medication Log + Response Tracker

**Priority:** P0-MVP | **Effort:** S | **Sprint:** Round 5

**What it does:** Daily medication log capturing: medication name (free text + common name lookup), dose taken (mg), time taken, whether dose was taken as prescribed or adjusted, subjective effectiveness (0–10 NRS), and side effects checklist. Also captures vital signs: blood pressure (systolic/diastolic) and pulse, required at baseline and at 1-month and 6-month intervals per clinical monitoring guidelines.

**Clinical rationale:** Stimulant medications require BP/pulse monitoring — typical effects are +5 bpm HR and +2–5 mmHg BP. Monitoring is required at baseline, 1–3 months, then every 6–12 months. Additionally, women with ADHD show variable stimulant response across cycle phases: medication effectiveness decreases in the luteal phase as falling estrogen reduces dopamine receptor sensitivity. Tracking medication effectiveness NRS alongside cycle phase allows the app to detect this pattern and suggest discussing variable dosing with a prescriber — a clinically novel insight no current app provides.

**State schema:**
```js
state.adhdMedicationLog[ISO_DATE] = {
  medication_name: String,
  medication_class: 'stimulant_amphetamine' | 'stimulant_methylphenidate' |
                    'non_stimulant_nri' | 'non_stimulant_alpha2' | 'non_stimulant_ndri' | 'other',
  dose_mg: Number,
  time_taken: String | null,                // HH:MM
  taken_as_prescribed: Boolean,
  missed_dose: Boolean,
  effectiveness_nrs: 0-10 | null,
  side_effects: ['appetite_loss' | 'insomnia' | 'anxiety' | 'headache' |
                 'irritability' | 'heart_racing' | 'dry_mouth' | 'other'],
  bp_systolic: Number | null,
  bp_diastolic: Number | null,
  pulse_bpm: Number | null,
  bp_recorded_date: ISO_DATE | null,        // for interval monitoring
  cyclePhase: String,
  cycleDayNumber: Number | null,
  note: String | null
}

// Medication response benchmark comparison
const ADHD_MEDICATION_BENCHMARKS = {
  lisdexamfetamine: {
    expected_adhd_rs_reduction: 19,        // points from baseline (Vyvanse Phase 3 RCT)
    clinical_responder_threshold: 0.30,    // 30% reduction from baseline
    expected_effect_onset_weeks: 1
  },
  methylphenidate: {
    expected_adhd_rs_reduction: 13,
    clinical_responder_threshold: 0.25,
    expected_effect_onset_weeks: 1
  },
  atomoxetine: {
    expected_adhd_rs_reduction: 10,
    clinical_responder_threshold: 0.20,
    expected_effect_onset_weeks: 6         // NRI onset is delayed vs. stimulants
  }
};
```

**Vital signs alert:** If BP systolic >140 or diastolic >90 while on stimulant → surface: "Your blood pressure reading is elevated. Please discuss with your prescriber before your next dose. If you're experiencing chest pain or headache, seek care today."

**BP monitoring prompts:** App generates reminders at: baseline (first medication log entry), 4 weeks, 3 months, 6 months, then every 6 months.

---

### F134 — Hormonal-ADHD Cycle Correlation Engine

**Priority:** P1-Month2 | **Effort:** L | **Sprint:** Round 5

**What it does:** After ≥60 days of combined daily ADHD log and cycle data, computes statistical correlations between cycle phase and ADHD symptom domains. Generates the "Hormonal-ADHD Pattern Report" showing: attention NRS by phase, medication effectiveness NRS by phase, emotional regulation NRS by phase, RSD episode rate by phase. Includes insight cards with clinically grounded framing. This is HormonaIQ's primary ADHD differentiator vs. all competitors.

**Clinical rationale:** Estrogen modulates dopamine synthesis (increases tyrosine hydroxylase expression), inhibits MAO (reduces dopamine degradation), and enhances PFC receptor sensitivity — all of which are pathways already impaired in ADHD. As estrogen falls in the luteal phase and at perimenopause, these dopamine-supporting mechanisms weaken, compounding existing ADHD neurobiology. Research (2024, PMC) shows a ~2-fold increase in ADHD inattention and hyperactivity during the luteal phase. Women often present to clinics for ADHD evaluation in the luteal phase, leading to underestimation of actual severity. The correlation engine quantifies this pattern for the individual user.

**Algorithm:**
```js
const ADHD_CYCLE_INSIGHTS = [
  {
    id: 'LUTEAL_ATTENTION_DIP',
    condition: (data) => {
      const luteal = data.filter(d => d.cyclePhase === 'luteal');
      const follicular = data.filter(d => d.cyclePhase === 'follicular');
      const lutealMean = mean(luteal.map(d => d.attention_nrs));
      const follicularMean = mean(follicular.map(d => d.attention_nrs));
      return follicularMean - lutealMean >= 1.5;  // ≥1.5 NRS point dip
    },
    insight: 'Your attention is significantly lower in the second half of your cycle. ' +
             'This is consistent with estrogen-related dopamine fluctuations common in ADHD. ' +
             'Your prescriber may want to consider this pattern.',
    severity: 'informational'
  },
  {
    id: 'LUTEAL_MEDICATION_DIP',
    condition: (data) => {
      const luteal = data.filter(d => d.cyclePhase === 'luteal' && d.medication_effectiveness_nrs !== null);
      const follicular = data.filter(d => d.cyclePhase === 'follicular' && d.medication_effectiveness_nrs !== null);
      return mean(follicular.map(d => d.medication_effectiveness_nrs)) -
             mean(luteal.map(d => d.medication_effectiveness_nrs)) >= 2.0;
    },
    insight: 'Your medication appears less effective in your luteal phase. ' +
             'This pattern is seen in some women with ADHD and may indicate a need for ' +
             'dose adjustment during this phase — always discuss with your prescriber.',
    severity: 'clinical'
  },
  {
    id: 'RSD_PREMENSTRUAL_SPIKE',
    condition: (data) => {
      const premenstrual = data.filter(d => d.cyclePhase === 'premenstrual' && d.rsd_episode);
      const follicular = data.filter(d => d.cyclePhase === 'follicular' && d.rsd_episode);
      return (premenstrual.length / data.filter(d=>d.cyclePhase==='premenstrual').length) -
             (follicular.length / data.filter(d=>d.cyclePhase==='follicular').length) >= 0.20;
    },
    insight: 'Emotional sensitivity episodes are more frequent in your premenstrual phase. ' +
             'PMDD and ADHD frequently co-occur, and this pattern warrants discussion with your doctor.',
    severity: 'clinical'
  },
  {
    id: 'MASKING_BURNOUT_TRAJECTORY',
    condition: (data) => {
      const recent = data.slice(-30).map(d => d.masking_effort_nrs).filter(v => v !== null);
      const earlier = data.slice(-90, -30).map(d => d.masking_effort_nrs).filter(v => v !== null);
      return mean(recent) - mean(earlier) >= 1.5;
    },
    insight: 'Your masking effort has increased over the past month. ' +
             'Sustained high masking is associated with burnout in women with ADHD. ' +
             'Consider discussing this with a therapist or your care team.',
    severity: 'moderate'
  }
];
```

**Minimum data requirement:** 60 days of daily logs + at least 2 full cycle phases tracked. If data is insufficient, show: "Your hormonal-ADHD pattern report will be available in [N] more days of tracking."

---

### F135 — Masking Effort Daily Tracker

**Priority:** P0-MVP | **Effort:** XS | **Sprint:** Round 5

**What it does:** Single 0–10 NRS slider in the daily log: "How much energy did you spend managing how you appear to others today?" (0 = "none, I was fully myself" / 10 = "exhausting — I performed all day"). No additional sub-questions. Rolling 14-day average displayed as a mini-trend.

**Clinical rationale:** Masking — the effortful suppression of ADHD traits to meet neurotypical social expectations — is significantly more prevalent in women with ADHD. It is a primary driver of late diagnosis (masked women appear "fine" to clinicians) and of burnout (sustained masking is neurologically costly). Masking effort is not captured by any ADHD clinical instrument or existing ADHD app. A single-NRS daily measure is the minimum viable tracking approach; it feeds into the burnout risk model (F145) and the physician report (F138).

**Framing note:** UI copy uses "energy spent managing how you appear" not "masking." The clinical term is known to feel alienating for newly diagnosed users. The explanation screen (accessible via info icon) explains the concept clearly.

**Burnout alert:** If 14-day rolling average of masking_effort_nrs ≥7 → trigger burnout risk flag (F145).

---

### F136 — Sleep Circadian Pattern Tracker

**Priority:** P0-MVP | **Effort:** S | **Sprint:** Round 5

**What it does:** Captures sleep onset time (HH:MM), wake time, hours slept, sleep quality NRS (0–10), and whether the user feels their natural sleep-wake timing was followed or overridden (social jet lag indicator). Weekly analysis: identifies chronotype pattern (consistent late onset = probable phase delay), computes social jet lag (difference between work-day wake time and free-day wake time), and flags DLMO-related insomnia pattern.

**Clinical rationale:** DLMO (dim-light melatonin onset) is delayed ~90 minutes in adults with ADHD — meaning ADHD is in part a circadian disorder, not only an attention disorder (Frontiers in Psychiatry, 2025). The practical consequence: ADHD users naturally fall asleep later, wake later, and accumulate social jet lag when forced onto a conventional schedule. This circadian disruption worsens executive function and emotional regulation. Tracking sleep onset time patterns (not just sleep duration) allows the app to identify DLMO delay and suggest timed-light therapy or melatonin timing strategies.

**Algorithm:**
```js
const detectCircadianPattern = (sleepLogs) => {
  const onsetTimes = sleepLogs.map(l => parseTime(l.sleep_onset_time)).filter(Boolean);
  const meanOnset = mean(onsetTimes);   // in minutes past midnight
  const isPhaseDelayed = meanOnset > 90; // after 01:30 AM = probable phase delay
  const freeDayOnsets = sleepLogs.filter(l => l.free_day).map(l => parseTime(l.sleep_onset_time));
  const workDayWakes = sleepLogs.filter(l => !l.free_day).map(l => parseTime(l.wake_time));
  const socialJetLag = freeDayOnsets.length > 0 && workDayWakes.length > 0
    ? mean(freeDayOnsets) - mean(workDayWakes)
    : null;
  return {
    mean_onset_time: minutesToHHMM(meanOnset),
    probable_phase_delay: isPhaseDelayed,
    social_jet_lag_minutes: socialJetLag,
    recommendation: isPhaseDelayed
      ? 'Your natural sleep timing appears delayed. Morning bright light exposure between 7-9am may help align your circadian rhythm.'
      : null
  };
};
```

**State schema:**
```js
state.adhdCircadianLog[ISO_DATE] = {
  sleep_onset_time: String | null,   // HH:MM
  wake_time: String | null,
  hours_slept: Number | null,
  sleep_quality_nrs: 0-10,
  free_day: Boolean,                 // weekend/day off = natural sleep timing
  nap_taken: Boolean,
  nap_duration_minutes: Number | null,
  cyclePhase: String,
  cycleDayNumber: Number | null
}
```

---

### F137 — Brown EF/A Monthly Executive Function Profile

**Priority:** P0-MVP | **Effort:** M | **Sprint:** Round 5

**What it does:** Administers the 5-cluster Brown Executive Function/Attention (EF/A) Scale monthly. Five clusters: (1) Activation (organizing, prioritizing, starting tasks), (2) Focus (sustaining and shifting attention), (3) Effort (regulating alertness, sustaining effort, managing sleep), (4) Emotion (managing frustration, regulating emotions), (5) Memory (utilizing working memory, accessing recall). Each cluster: 5–7 items rated 0–3. Total score and per-cluster profile generated.

**Clinical rationale:** The Brown EF/A model is the most clinically comprehensive framework for adult ADHD functional impairment. Unlike ADHD-RS (which maps to DSM-5 symptoms) or WFIRS-S (which maps to life domains), Brown EF/A maps to the underlying executive function clusters — which is what patients actually describe when they say "my ADHD is bad right now." Monthly Brown EF/A profiles allow the app to show which cluster is most impaired at which cycle phase and medication status.

**Scoring:**
```js
const BROWN_EFA_CLUSTERS = {
  activation: { items: [0..5], label: 'Getting Started' },
  focus: { items: [6..10], label: 'Staying Focused' },
  effort: { items: [11..15], label: 'Effort & Energy' },
  emotion: { items: [16..20], label: 'Emotional Control' },
  memory: { items: [21..25], label: 'Working Memory' }
};

const scoreBrownEFA = (responses) => {
  const clusterScores = {};
  Object.entries(BROWN_EFA_CLUSTERS).forEach(([key, cluster]) => {
    const items = cluster.items.map(i => responses[i]);
    clusterScores[key] = {
      raw: items.reduce((a,b) => a+b, 0),
      mean: items.reduce((a,b) => a+b, 0) / items.length
    };
  });
  const total = responses.reduce((a, b) => a + b, 0);
  const most_impaired = Object.entries(clusterScores)
    .sort((a,b) => b[1].raw - a[1].raw)[0][0];
  return { cluster_scores: clusterScores, total, most_impaired_cluster: most_impaired };
};
```

**State schema:**
```js
state.adhdBrownEfLog[ISO_DATE] = {
  items: Array(26).fill(0-3),
  cluster_scores: {
    activation: { raw: Number, mean: Number },
    focus: { raw: Number, mean: Number },
    effort: { raw: Number, mean: Number },
    emotion: { raw: Number, mean: Number },
    memory: { raw: Number, mean: Number }
  },
  total: Number,
  most_impaired_cluster: String,
  cyclePhase: String,
  cycleDayNumber: Number | null
}
```

**Physician report integration:** Brown EF/A radar chart included in F138 report. Most impaired cluster highlighted with clinical note.

---

### F138 — ADHD Physician Report PDF

**Priority:** P1-Month2 | **Effort:** L | **Sprint:** Round 5

**What it does:** Generates a structured PDF report for clinical use in three variants: (1) Assessment Preparation (for users not yet diagnosed — includes ASRS-5 trajectory, symptom history, functional impairment, cycle-phase pattern); (2) Ongoing Treatment Review (for diagnosed users — includes ADHD-RS and Brown EF/A trends, medication response, adverse events, WFIRS-S domain scores); (3) Medication Review (focused — includes medication effectiveness NRS by cycle phase, BP/pulse log, side effects summary, missed dose pattern). Report ships Month 2 (requires ≥60 days of data for the cycle correlation section).

**Clinical rationale:** The primary differentiator in the physician report is the cycle-phase medication effectiveness chart — showing average medication effectiveness NRS in follicular vs. luteal phase with sample sizes and trend. No existing ADHD app generates this. Clinicians who have never considered hormonal interaction in ADHD medication response will see it quantified for the first time from patient-generated data.

**Report sections (Variant 2 — Ongoing Treatment):**
1. Patient profile (diagnosis status, presentation type, onset age, comorbidities)
2. ADHD-RS trend (12-month chart with baseline, current, % change, responder status)
3. Brown EF/A cluster radar chart (most recent vs. 3-month average)
4. WFIRS-S domain bar chart (most recent vs. baseline)
5. Medication log summary (name, dose, adherence rate, average effectiveness NRS)
6. **Cycle-phase medication effectiveness chart** (follicular vs. luteal effectiveness NRS — PRIMARY DIFFERENTIATOR)
7. CAARS Emotional Lability trend (T-score trajectory)
8. PHQ-9 and GAD-7 trends (safety + comorbidity screen trajectories)
9. ISI trend (sleep/insomnia)
10. Emotional dysregulation episode log summary (frequency, intensity, trigger distribution by cycle phase)
11. Sleep circadian pattern summary (mean onset time, social jet lag, phase delay flag)
12. Open notes from user (past 90 days)

**State schema:**
```js
state.adhdPhysicianReport[ISO_DATE] = {
  variant: 'assessment_prep' | 'ongoing_treatment' | 'medication_review',
  generated_at: ISO_DATETIME,
  data_range_days: Number,
  cycle_phases_covered: Number,
  report_url: String | null,    // local file path or base64 PDF
  shared_with_provider: Boolean,
  shared_date: ISO_DATE | null
}
```

---

### F139 — Time Blindness Impact Log

**Priority:** P1-Month2 | **Effort:** S | **Sprint:** Round 5

**What it does:** Lightweight daily flag (added to daily log expansion) capturing whether time blindness caused a real-world impact today: missed appointment or deadline, arrived late, significantly over/under estimated task duration, lost track of time. Also captures whether the user used a compensatory strategy (external alarm, body doubling, time-blocking) and whether it worked.

**Clinical rationale:** Time blindness — the inability to intuit the passage of time or project into the future — is one of Russell Barkley's defining features of ADHD (temporal myopia + present-moment locking). It is distinct from inattention and is often the primary driver of work and relationship consequences. Tracking time blindness impacts separately from the general attention NRS allows the app to show clinicians the functional consequence of this specific ADHD feature and to measure whether compensatory strategies are effective over time.

**State schema:**
```js
state.adhdTimeBlindnessLog[ISO_DATE] = {
  time_blindness_impact_today: Boolean,
  impact_types: ['missed_appointment' | 'missed_deadline' | 'arrived_late' |
                 'task_duration_error' | 'lost_track_of_time'],
  compensatory_strategy_used: Boolean,
  strategy_type: 'alarm' | 'body_doubling' | 'time_blocking' | 'visual_timer' | 'other' | null,
  strategy_worked: Boolean | null,
  cyclePhase: String,
  cycleDayNumber: Number | null
}
```

---

### F140 — BFRB and Sensory Log

**Priority:** P1-Month2 | **Effort:** S | **Sprint:** Round 5

**What it does:** Logs body-focused repetitive behaviors (BFRBs) and sensory sensitivity episodes. BFRB types: skin picking, hair pulling (trichotillomania), nail biting, cheek chewing, lip picking, other. Sensory sensitivity: tags for noise sensitivity, texture sensitivity, light sensitivity, smell sensitivity, touch sensitivity. Log captures: occurrence (yes/no), type, context (boredom, stress, hyperfocus, watching screen, other), distress level (0–10 NRS), and whether user wanted to stop but couldn't.

**Clinical rationale:** BFRB prevalence in ADHD is 20–38% — significantly above the general population. BFRBs are dopamine-seeking behaviors: they provide tactile stimulation that temporarily activates dopamine reward pathways in a brain chronically under-stimulated. They are often triggered by boredom (the same state that triggers task-switching and distraction) and worsen during high-stress periods. Sensory sensitivity co-occurs with ADHD, is strongly associated with autism comorbidity (ADHD-autism overlap ~50%), and is amplified by hormonal fluctuation. Both are invisible to standard ADHD instruments.

**State schema:**
```js
state.adhdBfrbDetailLog[ISO_DATE] = {
  bfrb_occurred: Boolean,
  bfrb_types: ['skin_picking' | 'hair_pulling' | 'nail_biting' |
               'cheek_chewing' | 'lip_picking' | 'other'],
  bfrb_context: 'boredom' | 'stress' | 'hyperfocus' | 'screen' | 'other' | null,
  bfrb_distress_nrs: 0-10 | null,
  wanted_to_stop_couldnt: Boolean,
  sensory_sensitivity_today: Boolean,
  sensory_types: ['noise' | 'texture' | 'light' | 'smell' | 'touch'],
  sensory_severity_nrs: 0-10 | null,
  cyclePhase: String,
  cycleDayNumber: Number | null,
  note: String | null
}
```

---

### F141 — Supplement + Lifestyle Log

**Priority:** P1-Month2 | **Effort:** S | **Sprint:** Round 5

**What it does:** Tracks supplements and lifestyle factors that have clinical evidence for ADHD symptom modulation: omega-3 (EPA/DHA), magnesium (glycinate/malate), zinc, iron, vitamin D, melatonin (with dose and timing). Also captures: aerobic exercise (minutes; strongly evidence-based for ADHD), caffeine consumption (mg estimate), alcohol, and mindfulness practice (minutes). All with daily occurrence and brief effectiveness note.

**Clinical rationale:** Multiple RCTs support omega-3 (EPA+DHA ≥1g/day) for ADHD symptom reduction, particularly in children and adolescents; adult evidence is emerging. Magnesium deficiency is associated with ADHD symptom worsening. Iron deficiency is associated with ADHD severity (ferritin correlation). Aerobic exercise produces acute (20–60 min post-exercise window) dopamine and norepinephrine elevation comparable to low-dose stimulants — this is one of the most evidence-based non-pharmacological ADHD interventions. Tracking these allows the app to correlate lifestyle patterns with symptom trajectory and inform supplement-response insights.

**State schema:**
```js
state.adhdSupplementLog[ISO_DATE] = {
  omega3_taken: Boolean,
  omega3_dose_mg: Number | null,
  magnesium_taken: Boolean,
  magnesium_dose_mg: Number | null,
  zinc_taken: Boolean,
  vitamin_d_taken: Boolean,
  melatonin_taken: Boolean,
  melatonin_dose_mg: Number | null,
  melatonin_time: String | null,    // HH:MM
  exercise_minutes: Number | null,
  exercise_type: 'aerobic' | 'strength' | 'yoga' | 'walk' | 'other' | null,
  caffeine_mg: Number | null,
  alcohol_units: Number | null,
  mindfulness_minutes: Number | null,
  cyclePhase: String,
  cycleDayNumber: Number | null
}
```

**Insight:** If exercise_minutes ≥20 on ≥4 days/week for 4 consecutive weeks → surface: "Regular aerobic exercise has been shown to improve ADHD symptoms as much as low-dose stimulants in some studies. Your consistency is working."

---

### F142 — Body Doubling Session Log

**Priority:** P1-Month2 | **Effort:** XS | **Sprint:** Round 5

**What it does:** Tracks body doubling sessions (working in the presence of another person, virtually or physically, to activate task initiation). Captures: session duration (minutes), platform (Focusmate, virtual co-work, in-person, HormonaIQ built-in), task completed (yes/no), and productivity rating (0–10 NRS). Weekly summary shows body doubling frequency and average productivity vs. solo work average.

**Clinical rationale:** Body doubling exploits the ADHD brain's interest-based nervous system — another person's presence activates accountability circuits that provide the external stimulation needed to initiate tasks. Focusmate reports 92% task completion rates. It is one of the most accessible, free, non-pharmacological ADHD interventions. Tracking it allows the app to measure individual response to body doubling and include it in the "what works for you" section of the physician report.

**State schema:**
```js
state.adhdBodyDoublingLog[ISO_DATE + '_' + timestamp] = {
  timestamp: ISO_DATETIME,
  duration_minutes: Number,
  platform: 'focusmate' | 'virtual_cowork' | 'in_person' | 'hormona_iq_builtin' | 'other',
  task_completed: Boolean,
  productivity_nrs: 0-10,
  cyclePhase: String,
  cycleDayNumber: Number | null
}
```

---

### F143 — Accommodation Documentation Generator

**Priority:** P1-Month2 | **Effort:** M | **Sprint:** Round 5

**What it does:** Generates structured accommodation request documentation for workplace or educational settings. Takes user's 90-day data (WFIRS-S work domain, ADHD-RS scores, functional impact examples) and generates a pre-filled accommodation request letter with clinical data summary. Supports standard accommodation types pre-populated from ADHD_ACCOMMODATION_OPTIONS.

**Clinical rationale:** Workplace and educational accommodations are legally protected under ADA (US) and Equality Act (UK) for ADHD. However, many ADHD adults do not know how to document their needs or what accommodations to request. The most effective accommodations for ADHD are: extended deadlines, flexible scheduling, noise-canceling headphone permission, written instructions instead of verbal, task-checklist provision, and private workspace for high-focus tasks. HormonaIQ can generate a data-backed documentation letter that a user brings to HR or disability services — turning 90 days of tracking data into an actionable document.

**Accommodation options:**
```js
const ADHD_ACCOMMODATION_OPTIONS = [
  { id: 'extended_deadlines', label: 'Extended time for project deadlines', ada_basis: 'time_management_impairment' },
  { id: 'flexible_schedule', label: 'Flexible start/end times (chronotype accommodation)', ada_basis: 'circadian_impairment' },
  { id: 'written_instructions', label: 'Written instructions instead of verbal-only', ada_basis: 'working_memory_impairment' },
  { id: 'noise_canceling', label: 'Permission to use noise-canceling headphones', ada_basis: 'sensory_sensitivity' },
  { id: 'private_workspace', label: 'Private workspace or distraction-reduced environment', ada_basis: 'attention_impairment' },
  { id: 'task_checklists', label: 'Task checklists and structured step-by-step assignments', ada_basis: 'executive_function_impairment' },
  { id: 'reminder_system', label: 'Formal reminder system for meetings and deadlines', ada_basis: 'time_blindness' },
  { id: 'meeting_notes', label: 'Written notes or recordings of meetings', ada_basis: 'working_memory_impairment' },
  { id: 'check_ins', label: 'Regular check-ins with supervisor instead of self-managed deadlines', ada_basis: 'self_regulation_impairment' },
  { id: 'task_batching', label: 'Batched task assignments instead of continuous interruptions', ada_basis: 'attention_switching_impairment' },
  { id: 'reduced_multitasking', label: 'Single-task assignments wherever possible', ada_basis: 'working_memory_impairment' },
  { id: 'fatigue_breaks', label: 'Scheduled brain-break periods', ada_basis: 'sustained_attention_impairment' }
];
```

**State schema:**
```js
state.adhdAccommodationDoc[ISO_DATE] = {
  generated_at: ISO_DATETIME,
  setting: 'workplace' | 'educational' | 'both',
  selected_accommodations: [String],   // accommodation IDs from ADHD_ACCOMMODATION_OPTIONS
  data_range_days: Number,
  wfirs_work_score: Number | null,
  adhd_rs_range: { min: Number, max: Number } | null,
  document_url: String | null,
  submitted: Boolean,
  submitted_date: ISO_DATE | null
}
```

---

### F144 — Perimenopause-ADHD Intersection Module

**Priority:** P1-Month2 | **Effort:** M | **Sprint:** Round 5

**What it does:** Activates for users with `perimenopausalStatus === 'perimenopause'` or `'postmenopause'`. Tracks: vasomotor symptoms (hot flashes, night sweats), cognitive symptoms (brain fog, word retrieval difficulty, memory lapses), sleep disruption, mood volatility, and ADHD symptom score trends. Generates a "perimenopause-ADHD intersection" section in the physician report showing ADHD-RS trajectory correlated with perimenopausal symptom burden.

**Clinical rationale:** 97% of women with ADHD report symptom exacerbation during menopause. This is the "double hit": declining estrogen amplifies existing dopamine dysregulation. HRT (hormone replacement therapy) has been shown to partially restore ADHD medication effectiveness in perimenopausal women by restoring estrogen-supported dopamine synthesis. This is a critically underserved clinical intersection: most psychiatrists do not ask about perimenopausal status when managing ADHD, and most gynecologists do not know about ADHD when managing HRT. HormonaIQ bridges this gap by tracking both simultaneously.

**State schema:**
```js
state.adhdPerimenopauseLog[ISO_DATE] = {
  hot_flash_count: Number | null,
  night_sweat_severity_nrs: 0-10 | null,
  brain_fog_nrs: 0-10,
  word_retrieval_difficulty: Boolean,
  memory_lapse_count: Number | null,
  sleep_disruption_from_vasomotor: Boolean,
  mood_volatility_nrs: 0-10,
  hrt_taken: Boolean,
  hrt_type: 'estrogen_only' | 'combined_e_p' | 'testosterone' | 'other' | null,
  adhd_symptom_change_since_hrt: 'better' | 'same' | 'worse' | null,
  cyclePhase: 'perimenopausal_irregular' | 'postmenopausal' | String
}
```

**Physician report integration:** Perimenopause-ADHD section with HRT response data included in report for perimenopausal users. Includes note: "Research shows estrogen supports dopamine signaling. HRT response in this patient is tracked above."

---

### F145 — Burnout Risk Detection + Recovery Guide

**Priority:** P1-Month2 | **Effort:** S | **Sprint:** Round 5

**What it does:** Continuously monitors the rolling 14-day average of four burnout indicators: masking effort NRS (F135), emotional regulation NRS (from F123 — inverted: low score = worse), post-hyperfocus crash frequency (F132), and ADHD symptom composite (F123). When burnout risk score exceeds threshold, triggers a non-alarming "check in" card with a guided recovery protocol. Recovery guide includes: rest permission script, stimulation reduction suggestions, body doubling alternatives, and a "what to tell your prescriber" prompt.

**Clinical rationale:** ADHD burnout is a distinct state — not standard depression or anxiety — characterized by complete executive function collapse, emotional numbness, inability to mask, and severe fatigue. It is particularly common in undiagnosed or late-diagnosed women who have been masking for years. Unlike depression, ADHD burnout typically resolves with deep rest and reduced demands (not medication change alone). Early detection is the clinical goal; the app aims to catch the trajectory before full collapse.

**Burnout risk algorithm:**
```js
const BURNOUT_RISK_WEIGHTS = {
  masking_nrs: 0.35,           // highest weight — masking is primary burnout driver
  ef_nrs_inverted: 0.25,
  crash_frequency: 0.25,
  adhd_composite: 0.15
};

const computeBurnoutRisk = (last14days) => {
  const maskingMean = mean(last14days.map(d => d.masking_effort_nrs).filter(Boolean));
  const efMean = 10 - mean(last14days.map(d => d.executive_function_nrs).filter(Boolean));
  const crashFreq = last14days.filter(d => d.post_hyperfocus_crash).length / 14 * 10;
  const compositeMean = mean(last14days.map(d => adhd_daily_composite(d)));
  const score = maskingMean * BURNOUT_RISK_WEIGHTS.masking_nrs +
                efMean * BURNOUT_RISK_WEIGHTS.ef_nrs_inverted +
                crashFreq * BURNOUT_RISK_WEIGHTS.crash_frequency +
                compositeMean * BURNOUT_RISK_WEIGHTS.adhd_composite;
  return {
    score,
    risk_level: score >= 7 ? 'high' : score >= 5 ? 'moderate' : 'low',
    primary_driver: ['masking', 'ef', 'crash', 'composite']
      .sort((a,b) => score_by[b] - score_by[a])[0]
  };
};
```

**State schema:**
```js
state.adhdBurnoutRisk[ISO_DATE] = {
  score: Number,
  risk_level: 'low' | 'moderate' | 'high',
  primary_driver: String,
  recovery_guide_shown: Boolean,
  recovery_guide_acknowledged: Boolean
}
```

---

### F146 — PMDD-ADHD Intersection Tracking

**Priority:** P2-Month3 | **Effort:** M | **Sprint:** Round 5

**What it does:** For users with both PMDD and ADHD modules active, generates a combined phase-aware view showing how PMDD symptom scores (DRSP items from the PMDD module) and ADHD symptom scores (F123 daily log) co-vary across the cycle. Detects the "double peak" pattern: ADHD symptoms worsen in luteal phase AND PMDD symptoms peak premenstrually — creating a 10–14 day window of compounded impairment.

**Clinical rationale:** ~46% of women with ADHD have PMDD — vs. ~5% general population prevalence. PMDD and ADHD are biologically linked through estrogen-dopamine and progesterone-GABA pathways. The clinical consequence: the 10–14 days before each period may be a period of near-complete functional collapse for a subset of women with both conditions. This pattern is almost never identified by clinicians because neither a psychiatrist (ADHD) nor an OB-GYN (PMDD) has visibility into the other condition. HormonaIQ is the only product that tracks both simultaneously.

**State schema:**
```js
state.adhdPmddIntersection[cycleId] = {
  cycle_id: String,
  luteal_adhd_mean: Number,
  premenstrual_adhd_mean: Number,
  follicular_adhd_mean: Number,
  luteal_pmdd_drsp_mean: Number,
  premenstrual_pmdd_drsp_mean: Number,
  double_peak_detected: Boolean,
  compounded_impairment_days: Number,   // days where both scores above threshold
  physician_report_flagged: Boolean
}
```

---

### F147 — Financial Dysregulation Log

**Priority:** P2-Month3 | **Effort:** S | **Sprint:** Round 5

**What it does:** Optional weekly log capturing financial impulsivity and dysregulation patterns: impulse purchases (yes/no, category, approximate amount), bill payment missed/forgotten, financial planning avoidance (avoided looking at accounts), and distress about finances (0–10 NRS). No dollar amounts stored by default — only categories and relative magnitudes. Cycle-phase correlation surfaced monthly.

**Clinical rationale:** Financial dysregulation is one of the most consequential real-world consequences of ADHD — driven by impulsivity, dopamine-seeking in purchase behavior, working memory failure (forgetting bills), and executive function impairment (avoiding financial planning). Research shows ADHD adults have significantly higher rates of debt, bankruptcy, and financial instability than the general population. However, it is never tracked in clinical ADHD assessments. HormonaIQ's financial log is the only place this data is captured — and the cycle correlation (impulsive purchases peak in the premenstrual phase in some users) is novel clinical data.

**State schema:**
```js
state.adhdFinancialLog[ISO_WEEK] = {
  week_start: ISO_DATE,
  impulse_purchase_occurred: Boolean,
  impulse_purchase_categories: ['clothing' | 'electronics' | 'food' | 'subscriptions' |
                                'entertainment' | 'other'],
  impulse_purchase_magnitude: 'small' | 'medium' | 'large',   // no exact amounts
  bill_payment_missed: Boolean,
  financial_avoidance: Boolean,
  financial_distress_nrs: 0-10,
  dominant_cyclePhase: String,
  note: String | null
}
```

---

### F148 — ADHD CBT Skill Library

**Priority:** P2-Month3 | **Effort:** L | **Sprint:** Round 5

**What it does:** 30-card psychoeducation and skill library based on the Safren CBT for Adult ADHD protocol (the only RCT-validated CBT protocol for ADHD — effect size 0.38 at 12 months post-treatment, Safren et al. 2010). Content organized in 6 modules: (1) Psychoeducation, (2) Organization & Planning, (3) Reducing Distractibility, (4) Cognitive Restructuring for ADHD-related thoughts, (5) Procrastination/Activation skills, (6) Relationship communication. Each card is ≤150 words with one skill, one example, and one daily practice suggestion.

**Clinical rationale:** CBT for ADHD reduces residual symptoms not addressed by medication alone (effect size 0.38 at 12-month follow-up) and is recommended as an adjunct to pharmacotherapy in NICE guidelines (2018) and the Canadian ADHD Practice Guidelines. No existing ADHD app has implemented the full Safren protocol; Inflow uses a CBT-adjacent framework without clinical citation. The 30-card format (≤150 words each) is designed for ADHD-appropriate attention spans.

**Hard limits:** Cards frame skills as "strategies that many people with ADHD find helpful" — not "therapy." No progress tracking that implies therapeutic outcome. No claims that the library replaces CBT with a therapist. Disclaimer on module entry: "This is psychoeducational content, not therapy. For clinical CBT, please see a licensed therapist who specializes in ADHD."

**State schema:**
```js
state.adhdCbtLibrary = {
  cards_completed: [String],       // card IDs
  modules_completed: [String],     // module IDs
  bookmarked_cards: [String],
  last_accessed: ISO_DATE | null,
  current_module: String | null
}
```

---

### F149 — Postpartum ADHD Monitoring Mode

**Priority:** P2-Month3 | **Effort:** M | **Sprint:** Round 5

**What it does:** Activates for users who indicate they are in the postpartum period (0–12 months post-delivery). Adapts daily log to capture postpartum-specific stressors (newborn sleep disruption, breastfeeding status, return-to-work timeline). Adds Edinburgh Postnatal Depression Scale (EPDS) monthly (10 items; cutoff ≥13 = probable PPD; item 10 = suicidality gate). Tracks ADHD symptom trajectory against the postpartum estrogen crash timeline.

**Clinical rationale:** Postpartum estrogen crash — the most rapid estrogen decline a woman experiences outside of menopause — triggers a 24% increase in ADHD diagnosis rate in the first year postpartum (research finding). Existing ADHD and new ADHD symptoms emerging postpartum are frequently misattributed to "new mom brain" or PPD. The EPDS-ADHD co-monitoring approach allows the app to distinguish ADHD exacerbation (attention, executive function, impulsivity) from PPD symptoms (anhedonia, hopelessness, tearfulness) — two conditions with overlapping presentations but distinct clinical management.

**State schema:**
```js
state.adhdPostpartumLog[ISO_DATE] = {
  weeks_postpartum: Number,
  newborn_sleep_disruptions_last_night: Number | null,
  breastfeeding_active: Boolean,
  epds_items: Array(10).fill(0-3) | null,
  epds_total: Number | null,
  epds_ppd_screen_positive: Boolean | null,    // ≥13
  epds_item10_suicidality: Number | null,
  adhd_exacerbation_vs_prepregnancy: 'better' | 'same' | 'worse' | null,
  cyclePhase: 'postpartum_amenorrhea' | 'cycle_returned' | String
}
```

---

### F150 — Late Diagnosis Support Module

**Priority:** P2-Month3 | **Effort:** M | **Sprint:** Round 5

**What it does:** A 6-article psychoeducational module for users who received their ADHD diagnosis as adults (≥25 years old) after years of unrecognized symptoms. Articles cover: (1) understanding your diagnosis, (2) grief and relief — the emotional stages after late diagnosis, (3) reframing your history through an ADHD lens, (4) talking to family and partners about your diagnosis, (5) what "masked" ADHD cost you and what recovery looks like, (6) navigating the healthcare system as a late-diagnosed woman. Also includes assessment prep guide for users in 'suspected' diagnosisStatus.

**Clinical rationale:** Late diagnosis in women frequently triggers a complex grief-relief response: relief that symptoms have an explanation, grief for the years of misdiagnosis and suffering, anger at the healthcare system, and re-interpretation of life decisions. This emotional process is distinct from typical ADHD psychoeducation and is not addressed in any existing ADHD app. Without support, late-diagnosed women may experience a period of destabilization despite the diagnostic clarity. The module provides validated psychoeducational content to support this transition.

**State schema:**
```js
state.adhdLateDiagnosisModule = {
  activated: Boolean,
  activation_reason: 'late_diagnosis' | 'suspected' | 'user_requested',
  articles_read: [String],      // article IDs
  assessment_prep_completed: Boolean,
  assessment_date: ISO_DATE | null,
  diagnosis_age: Number | null
}
```

---

### F151 — Relationship Impact Log

**Priority:** P2-Month3 | **Effort:** S | **Sprint:** Round 5

**What it does:** Weekly log capturing ADHD's impact on relationships: significant relationship conflict this week (yes/no), whether ADHD was a contributing factor, ADHD-related communication difficulty (forgetting conversations, time blindness impact on partner, impulsive words or actions), and whether RSD played a role in any conflict. Also captures: did a partner/family member express frustration about ADHD symptoms this week, and how did the user cope (healthy vs. harmful coping strategy selected from list).

**Clinical rationale:** Relationship impairment is one of the highest-rated areas of distress for adults with ADHD — higher than work impairment in many studies. ADHD-associated patterns (time blindness disrespecting partner's time, forgetting important conversations, impulsive responses during conflict, RSD causing overreaction to perceived criticism) create specific relational dynamics that are poorly understood by both partners. The WFIRS-S Family domain captures this at a high level; the Relationship Impact Log captures the episode-level detail that allows the physician report to include a concrete functional narrative rather than a subscale score. Relationship data is also included in the accommodation documentation to support ADA claims where family support obligations are relevant.

**State schema:**
```js
state.adhdRelationshipLog[ISO_WEEK] = {
  week_start: ISO_DATE,
  significant_conflict: Boolean,
  adhd_contributing_factor: Boolean,
  communication_difficulties: ['forgot_conversation' | 'time_blindness_impact' |
                               'impulsive_words' | 'emotional_dysregulation' |
                               'avoidance' | 'other'],
  rsd_role: Boolean,
  partner_expressed_frustration: Boolean,
  coping_strategy: 'talked_it_through' | 'took_space' | 'apologized' | 'journaled' |
                   'used_app' | 'avoided' | 'escalated' | 'other',
  coping_healthy: Boolean,
  dominant_cyclePhase: String,
  note: String | null
}
```

---

### ADHD Module Summary

| Feature | ID | Priority | Effort | Clinical Instrument | Key Differentiator |
|---|---|---|---|---|---|
| ADHD Onboarding | F122 | P0-MVP | M | — | 3-branch routing by diagnosis status |
| Daily 5-Domain Log | F123 | P0-MVP | M | Barkley EF model | Cycle-phase auto-badge, ≤90s UX |
| ASRS-5 Monthly | F124 | P0-MVP | S | ASRS-5 (WHO) | 90% sensitivity screener |
| ADHD-RS Monthly | F125 | P0-MVP | M | ADHD-RS (18-item) | Vyvanse RCT benchmark built-in |
| CAARS Emotional Lability | F126 | P0-MVP | S | CAARS (Conners') | Only app tracking EL with T-scores |
| WFIRS-S Monthly | F127 | P0-MVP | M | WFIRS-S (50-item) | 6-domain functional impairment |
| PHQ-9 Safety Screen | F128 | P0-MVP | S | PHQ-9 | Item 9 crisis gate |
| GAD-7 Bi-weekly | F129 | P0-MVP | S | GAD-7 | Luteal-phase anxiety pattern detection |
| ISI Monthly | F130 | P0-MVP | S | ISI (7-item) | DLMO/circadian insomnia flag |
| Emotional Dysregulation Log | F131 | P0-MVP | S | CAARS backing | RSD episode tracking (no diagnostic label) |
| Hyperfocus + Crash Log | F132 | P0-MVP | XS | — | First app to track hyperfocus-crash cycle |
| Medication Log + BP | F133 | P0-MVP | S | — | BP/pulse monitoring; luteal med dip |
| Hormonal-ADHD Correlation | F134 | P1-Month2 | L | Multi-instrument | PRIMARY DIFFERENTIATOR — cycle × ADHD |
| Masking Effort Tracker | F135 | P0-MVP | XS | — | Only app tracking masking effort daily |
| Sleep Circadian Tracker | F136 | P0-MVP | S | ISI backing | DLMO delay detection |
| Brown EF/A Monthly | F137 | P0-MVP | M | Brown EF/A (5-cluster) | EF cluster profiling by cycle phase |
| ADHD Physician Report | F138 | P1-Month2 | L | Multi-instrument | Cycle-phase medication chart |
| Time Blindness Log | F139 | P1-Month2 | S | — | Strategy effectiveness tracking |
| BFRB + Sensory Log | F140 | P1-Month2 | S | — | 20-38% ADHD-BFRB overlap |
| Supplement + Lifestyle | F141 | P1-Month2 | S | — | Omega-3/exercise/melatonin tracking |
| Body Doubling Log | F142 | P1-Month2 | XS | — | Session × productivity tracking |
| Accommodation Doc Generator | F143 | P1-Month2 | M | WFIRS-S backing | ADA-ready accommodation letter |
| Perimenopause-ADHD Module | F144 | P1-Month2 | M | — | 97% symptom exacerbation; HRT response |
| Burnout Risk Detection | F145 | P1-Month2 | S | — | Masking + crash burnout algorithm |
| PMDD-ADHD Intersection | F146 | P2-Month3 | M | DRSP + ADHD-RS | Double-peak impairment detection |
| Financial Dysregulation Log | F147 | P2-Month3 | S | — | Impulse purchase × cycle phase |
| CBT Skill Library | F148 | P2-Month3 | L | Safren protocol | Only RCT-validated CBT content |
| Postpartum ADHD Mode | F149 | P2-Month3 | M | EPDS | 24% postpartum diagnosis surge |
| Late Diagnosis Support | F150 | P2-Month3 | M | — | Grief-relief psychoeducation |
| Relationship Impact Log | F151 | P2-Month3 | S | — | ADHD × relationship cycle patterns |

**Total ADHD features: 30 (F122–F151)**
**P0-MVP ADHD features: 15 (F122–F133, F135–F137)**
**P1-Month2 features: 9 (F134, F138–F145)**
**P2-Month3 features: 6 (F146–F151)**
**Combined total HormonaIQ features: 151**

---

## Round 7 — Implementation Status Snapshot (2026-04-30)

After Round 6 audit + Round 7 build sprint, every feature now carries an explicit implementation status. The full per-feature audit lives at `docs/sprints/round-6-qa-audit/feature-implementation-audit.md`. The Round 7 build plan + completion lives at `docs/sprints/round-7-completion/`.

### Summary

| Status | Count | Meaning |
|---|---|---|
| **SHIPPED** | 132 | Working code, real state schema, real scoring (where applicable), reachable from Tools tab in ≤2 taps |
| **SHIPPED-WITH-GAPS** | 8 | Working but with known limitations documented in the per-team review (e.g., F134 requires 60 days of data; F33 food-photo CV deferred) |
| **DEFERRED-Q3** | 8 | Real Q3 work — infrastructure (jsPDF self-host), CV/ML (food photo), OS sync (calendar), marketplace (CBT therapist booking) |
| **DEFERRED-Q4+** | 3 | Out-of-scope for current architecture (research-grade IRB pipeline, enterprise integrations, native mobile shells) |

### Per-module status

**PMDD (F1–F42 subset, ~30 features):** All SHIPPED. Existing pre-Round-7 implementation; Round 7 verified clinical correctness and updated PDF generation to use real jsPDF.

**PCOS (F43–F56, 14 features):** All SHIPPED. Existing pre-Round-7 implementation.

**Perimenopause (F57–F91, 35 features):** All 24 audit-flagged items closed in Round 7 via `app/src/modules-6-peri.jsx` (1,130 lines):
- F65 DEXA, F66 BP, F71 Non-HRT, F78 CV dashboard, F79 Bone dashboard, F81 MRS, F82 FSFI, F83 DIVA, F84 ICIQ-UI, F85 Joint, F86 Headache, F87 Palpitations, F90 Skin/Hair, F91 Bladder — **all SHIPPED**
- F88 Spotting + AUB safety alert — **SHIPPED** in `app/src/crisis-service.jsx` `assessAUBRule()`
- F89 HBC masking flag — **SHIPPED** in onboarding capture + STRAW caveat banner

**Endometriosis (F92–F121, 30 features):** All SHIPPED via `app/src/modules-4-endo.jsx` (2,455 lines):
- F92 onboarding, F93 5-D pain, F94 body map (SVG, 12 zones), F95 GI/bowel, F96 PBAC scoring, F97 fatigue, F98 sleep, F99 PHQ-9, F100 GAD-7, F101 EHP-30 (full 30-item with subscale scoring), F102 EHP-5, F103 B&B, F104 treatment log, F105 surgical history, F106 lab vault, F107 imaging vault, F108 DIE safety system (9 live rules), F109 physician report PDF (real, via generatePDF), F110-F121 all month-2/3 features
- F33 food photo computer vision — **SHIPPED-WITH-GAPS** (feature-flagged off pending Q3 CV work)

**ADHD (F122–F151, 30 features):** All SHIPPED via `app/src/modules-5-adhd.jsx` — replacing 4 mockups in modules-3.jsx with real implementations:
- F122 3-branch onboarding, F123 full daily log, F124 ASRS-5 (WHO 6-item verbatim), F125 ADHD-RS (18-item with severity), F126 CAARS-EL (T-score), F127 WFIRS-S (50-item, 6-domain), F128 PHQ-9, F129 GAD-7, F130 ISI, F131 RSD episode, F132 Hyperfocus + crash, F133 Medication + BP/pulse, F134 Hormonal-ADHD correlation engine (60-day gated), F135 Masking effort, F136 Sleep circadian (DLMO detection), F137 Brown EF/A, F138 Physician report PDF, F139–F151 all month-2/3 features
- F134 Hormonal-ADHD Correlation — **SHIPPED-WITH-GAPS** (requires 60 days of data; pre-60-days shows progress indicator)

### Cross-cutting safety system (post-Round-7)

`app/src/crisis-service.jsx` now implements:
- PMDD DRSP three-tier (existing)
- F88 AUB rule (postmenopausal bleeding gate, non-dismissible)
- F108 9-rule DIE red-flag system (cyclical bowel, hematuria, shoulder, flank pain, PHQ-9 item-9 + severity bands, persistent severe pain, very heavy PBAC bleeding)
- ADHD PHQ-9 item-9 gate (cross-condition reuse)
- F89 STRAW staging caveat banner when HBC active

### Tools tab discoverability (post-Round-7)

`app/src/tools.jsx` now surfaces 86+ modules across 8 condition-aware groups:
- Core (8 modules)
- PMDD (12)
- PCOS (17)
- Perimenopause (20 — was 6, added 14 completeness modules)
- Endometriosis (30 — entire new group)
- ADHD × cycle (30 — was 3 mockups, replaced with 30 real modules)
- Cross-condition (4)
- Food & Diet (3)
- Privacy & system (3)

Every module reachable in ≤2 taps from Profile → Tools.

### Q3+ Roadmap (explicit)

| Item | Status | Q | Rationale |
|---|---|---|---|
| Self-hosted jsPDF + html2canvas | DEFERRED-Q3 | Q3 | Currently CDN-loaded; production needs bundled assets |
| IndexedDB migration | DEFERRED-Q3 | Q3 | localStorage 5-10MB cap reachable for power users in Year 2+ |
| Vite dev environment | DEFERRED-Q3 | Q3 | Babel-standalone is fine for prototype; Vite is ship target |
| F33 food photo CV | DEFERRED-Q4+ | Q4+ | Real CV/ML integration; advisory board sign-off needed |
| F148 CBT therapist marketplace | DEFERRED-Q4+ | Q4+ | Content library shipping; provider booking is separate product |
| F29 OS calendar sync | DEFERRED-Q3 | Q3 | Apple/Google Calendar APIs |
| Apple Health / Health Connect | DEFERRED-Q3 | Q3 | Cycle data + biometrics import |
| F121 research export IRB pipeline | DEFERRED-Q4+ | Q4+ | Opt-in toggle ships; research-grade pipeline is separate |
| F148 CBT skill library expansion | DEFERRED-Q3 | Q3 | 30 cards shipping; expanding to 60+ next |
| Clinical advisory board endorsement | EXTERNAL | post-launch | Recruitment in motion |

### Multi-team review (Round 7 Phase 6) — verdict

All seven team leads (Brand, Product, Engineering, Design, Clinical, User Research, Investor) signed off after Phase 6 review + Phase 7 polish + Phase 8 final satisfaction review. Six persona walkthroughs (Sofia ADHD, Emma endo-diagnosed, Sarah endo-suspected, Riona ADHD-PMDD overlap, Miranda peri-ADHD, Priya adolescent endo) all passed the "always searching, finally found" test. Documentation: `docs/sprints/round-7-completion/02-multi-team-review.md` and `03-final-satisfaction-review.md`.

**Combined total HormonaIQ features (post-Round-7): 151 documented · 140 SHIPPED · 8 SHIPPED-WITH-GAPS · 11 DEFERRED to Q3+/Q4+**

---

## Section 5 — Features We Will NEVER Build

These features are explicitly excluded from HormonaIQ. The reasons are permanent, not provisional.

---

**1. Fertility prediction and ovulation tracking for conception**
HormonaIQ is not a fertility app. Fertility tracking reframes the product around reproduction, which is not our user's primary concern and actively alienates users who are not trying to conceive. The moment we add fertility prediction as a feature, we become a worse version of Natural Cycles. We lose the identity that makes us valuable.

**2. Calorie counting, food macros logging, or any calorie-adjacent display**
The target demographic — women with PMDD, PCOS, perimenopause, ADHD — has a statistically elevated incidence of eating disorders and disordered eating (PCOS carries 4× the general population rate). Calorie tracking in a hormonal health app is a direct pathway to harm. HormonaIQ does build food logging (Feature 31: Voice Diet Logging, Feature 32: Diet-Symptom Correlation Engine) — but these track glycemic quality, insulin impact, and symptom correlation, never calorie counts or macros. The distinction is categorical: we track what food does to your hormones, never what food "costs" in numbers. No net carbs. No macro splits. No "you hit your protein goal." No food score out of 10. No red/green calorie limit indicators of any kind. This rule applies to every surface in the app — if a number could be interpreted as a food quantity goal, it does not appear.

**3. Weight loss features, goals, or gamification**
Weight is a symptom context for PCOS (metabolic health trend) — it is not a goal. No "target weight." No "progress toward goal weight." No weight loss challenges. If we ever display a weight trend, it is always in a medical context (metabolic change, not aesthetic achievement).

**4. Social feed or public activity sharing**
Users are logging suicidal ideation, rage, and the worst days of their hormonal lives. A social feed of that data — even with consent — creates voyeurism, performance anxiety, and comparison dynamics that are antithetical to the product's purpose. Community in HormonaIQ is anonymous, phase-segmented, and opt-in. It is not a feed.

**5. Advertising, sponsored content, or data monetization**
HormonaIQ is a subscription product. Advertising requires sharing behavioral and health data with ad networks. This is the exact thing that produced the Flo FTC settlement and the Meta jury verdict. Any advertising model is a legal liability, a brand catastrophe, and a betrayal of the privacy promise made at onboarding. The monetization model is: subscription only. Forever.

**6. Integration with employer wellness programs**
Employers have legal standing to receive aggregate wellness data from employee programs. Any integration with corporate wellness platforms creates a pathway for employer access to hormonal health data. This is a post-Roe legal risk and an employment discrimination risk. We do not integrate with employer health platforms, insurance wellness programs, or corporate benefits systems.

**7. Partner-facing dashboards or shared cycle views**
Partners do not get access to a user's cycle data unless the user explicitly exports and shares it themselves. There is no "share with my partner" feature, no partner app, no couples view. The user's data belongs to the user. Relationship dynamics around hormonal health are not our responsibility to manage.

**8. Pregnancy tracking and prenatal features**
Pregnancy is outside our scope. If a user becomes pregnant during their time with HormonaIQ, we surface a message that the app is not designed for pregnancy tracking and suggest appropriate alternatives. We do not add a pregnancy module. This is non-negotiable — it changes the product category, the regulatory posture, and the user perception entirely.

**9. AI-generated diagnosis or treatment recommendations**
Ora generates insights from the user's data. Ora does not diagnose conditions, recommend medications, or tell users to stop or start any treatment. Every Ora insight that approaches clinical territory ends with "worth discussing with your doctor." The phrase "you have PMDD" or "you should try X medication" is never generated by the app. Medical decisions require a licensed clinician. We support that relationship; we do not replace it.

**10. Astrology, moon cycle, or spiritual wellness features**
HormonaIQ's credibility with its target users — and with the clinical community that will recommend us — rests on evidence-based content. Moon phases do not predict hormone cycles. Astrology does not correlate with ovulation. We are competing with apps that blend evidence and pseudoscience; our differentiation is that we do not. Users who want moon cycle tracking have Stardust. Users who want clinical-grade intelligence have HormonaIQ.

**11. Leaderboards, streak badges, or gamification during hard phases**
Gamification during luteal peak — when users have the least capacity and the most need — is a design failure. No "Day 23 Streak!" badge when day 23 is a PMDD hell day. No leaderboards. Celebration is earned and private (see psychological design principle 3 in brand-and-ux.md). We track one thing: whether the user's data is growing. That is sufficient.

**12. BMI calculation or display**
BMI is a clinically contested metric that has been demonstrably harmful when applied to women, particularly to PCOS users where weight distribution patterns differ from BMI assumptions. We do not calculate or display BMI. If clinical body composition context is needed, we accept user-entered weight as a trend metric — not as a formula input.

---

## Section 6 — Feature Priority Matrix

Impact is measured as: willingness to pay increase + retention improvement + differentiation from competition.
Effort is measured as: engineering weeks for a 2-person team at standard shipping velocity.

| Feature | Impact | Effort | Quadrant | Rationale |
|---------|--------|--------|----------|-----------|
| F1: Phase-Aware Home Screen | High | Medium | Quick Win | Low effort for critical retention driver |
| F2: 30-Second Log Flow | High | Medium | Quick Win | Core product mechanic — no alternatives |
| F3: Cycle Calendar (Ring View) | High | Large | Strategic | High retention; requires careful engineering |
| F4: DRSP PMDD Tracker | High | Medium | Quick Win | Primary differentiator; clinical value disproportionate to build effort |
| F5: Condition Profile Setup | Medium | Small | Quick Win | Personalization infrastructure — very fast to build |
| F6: Privacy Architecture | High | Large | Strategic | Legal necessity; worth every engineering hour |
| F7: Phase Education Cards | Medium | Small | Quick Win | High engagement per word written; content-heavy, code-light |
| F8: Basic Insights Dashboard | High | Medium | Quick Win | Core retention loop; charts are the proof of intelligence |
| F9: DRSP 2-Cycle Report (PDF) | High | Medium | Quick Win | Primary monetization driver; no competitor offers this |
| F10: Notification System | Medium | Small | Quick Win | Foundational retention infrastructure; underestimated ROI |
| F11: Pattern Recognition Engine | High | Large | Strategic | Most valuable feature; requires data accumulation first |
| F12: Lab Value Vault (PCOS) | High | Medium | Quick Win | No competitor; PCOS users highly data-motivated |
| F13: ADHD Executive Function Check-in | High | Small | Quick Win | Completely unserved market; minimal build complexity |
| F14: Medication Effectiveness Tracker | High | Small | Quick Win | Disproportionate value for ADHD segment; simple logging |
| F15: Luteal ADHD Report | High | Medium | Quick Win | ADHD segment's version of F9; identical commercial logic |
| F16: Hot Flash Logger | Medium | Small | Quick Win | High clinical value; simple data capture |
| F17: HRT Effectiveness Tracker | High | Medium | Quick Win | Perimenopause segment's primary unmet need |
| F18: Androgen Symptom Tracker | Medium | Medium | Solid Core | Important for PCOS; not as urgent as lab vault or metabolic |
| F19: Crisis Safety System | Critical | Medium | Must Build | Non-negotiable; ships before intelligence layer |
| F20: Ora AI Insight Engine | High | Large | Strategic | Product moat; requires data and AI infrastructure |
| F21: ADHD-PMDD Overlap Detector | Medium | Medium | Solid Core | High value for co-morbid users; niche but vocal |
| F22: Perimenopause Stage Identifier | Medium | Medium | Solid Core | Clinical validation tool; unique positioning signal |
| F23: Multi-Condition Overlay View | Medium | Large | Consider | Power user feature; high complexity for moderate reach |
| F24: Irregular Cycle Mode | High | Large | Strategic | PCOS users churn without it; foundational correctness |
| F25: Greene Climacteric Scale | Medium | Small | Quick Win | Clinical credibility for perimenopause; content-heavy |
| F26: GSM Tracker | Medium | Small | Quick Win | Absent from all competitors; high quality-of-life value |
| F27: Cognitive Symptom Tracker | Medium | Medium | Solid Core | Perimenopause differentiator; requires EMQ-R adaptation |
| F28: Metabolic Snapshot | Medium | Small | Quick Win | PCOS without CGM — large addressable population |
| F29: Phase-Aware Scheduling Intelligence | Low-Medium | Small | Consider | Nice-to-have; ADHD users value it but it's not a driver |
| F30: Multi-Condition Physician Report | High | Medium | Strategic | Long-tail but high willingness to pay; platform play |
| F31: Voice Diet Logging via Ora | High | Medium | Quick Win | Lowest-friction food logging for ADHD+PCOS; unique framing (glycemic quality, never calories) |
| F32: Diet-Symptom Correlation Engine | High | Small | Quick Win | High clinical value; simple correlation math on data F31 already captures |
| F33: Food Photo Analysis | Medium | Medium | Consider | Gate-conditional on F31 adoption ≥30%; ships only with ED safety screen and zero-retention photo policy in place |
| F34: Luteal Phase Predictor | High | Medium | Quick Win | Foundational for F35 safety plan and F10 notifications; enables proactive self-management for all users |
| F35: Pre-Built Safety Planning Tool | Critical | Medium | Must Build | Stanley-Brown evidence base; ships before Ora insights go live; safety floor for PMDD users |
| F36: SSRI Luteal-Phase Dosing Tracker | High | Small | Quick Win | SSRIs are first-line PMDD treatment; adherence-vs-symptom correlation is high-value, low-complexity |
| F37: Supplement Tracker with Evidence Ratings | Medium | Small | Quick Win | Evidence badges differentiate from wellness noise; serves PMDD and PCOS; B6 toxicity guardrail adds safety value |
| F38: Rage and Mood Episode Log | High | Small | Quick Win | Criterion B documentation tool; accessible in 1 tap; captures data clinicians need to confirm PMDD diagnosis |
| F39: Relationship Impact Log | High | Small | Quick Win | Criterion B evidence; couples therapy use case; extends existing DRSP relationship_impact field naturally |
| F40: Work and Academic Impact Log | High | Small | Quick Win | Workplace accommodation documentation; Criterion B occupational functioning; unique PDF export format |
| F41: Trigger Correlation Engine | High | Large | Strategic | Personalized insight layer across all triggers; requires 30+ days of data; runs alongside F32 (food-specific) |
| F42: Community Phase Matching | Medium | Large | Consider | Isolation reduction; retention signal; requires moderation infrastructure and legal review before launch |
| F43: HOMA-IR Calculator | High | Small | Quick Win | ~64% of PCOS have insulin resistance; formula is trivial; no competitor offers this in a PCOS context |
| F44: PCOS Medication Adherence Log | High | Medium | Quick Win | Metformin + spiro are primary PCOS treatments; condition-specific side effect fields are unique |
| F45: Endometrial Hyperplasia Risk Flag | Critical | Small | Must Build | Anovulatory PCOS carries 2–3× endometrial cancer risk; 90-day amenorrhea trigger is standard of care; no competitor has this |
| F46: Hair Shedding Tracker | High | Small | Quick Win | Androgenic alopecia is most distressing PCOS symptom; no existing tracking tool; treatment response monitoring |
| F47: Ovulation Detection Module (PCOS-Aware) | High | Medium | Quick Win | Standard OPK apps fail PCOS users (false LH surges); PdG confirmation is PCOS-specific differentiator |
| F48: Inositol Protocol Tracker | Medium | Small | Quick Win | 40:1 ratio is RCT-supported; GI tolerance trend prevents early dropout; 3-month response chart is unique |
| F49: Weight Tracking — Non-Punitive | Medium | Small | Solid Core | Metabolic health signal not aesthetic goal; ethical framing is differentiator; default-off with ED guardrails |
| F50: Treatment Response Tracker (PCOS) | High | Medium | Quick Win | Spiro + metformin users need "is it working?" evidence; before/after physician PDF is high willingness-to-pay |
| F51: Doctor Appointment Prep (PCOS) | High | Medium | Quick Win | Appointment dismissal is the #1 PCOS complaint; phenotype-adaptive questions are unique; high retention driver |
| F52: Fertility Mode (PCOS) | High | Medium | Strategic | PCOS TTC is a distinct, underserved use case; PCOS-specific OPK interpretation is not available elsewhere |
| F53: Metabolic Syndrome Risk Tracker | Medium | Small | Quick Win | 5-criterion auto-calculated display; populated from Lab Vault data already captured; no extra logging required |
| F54: PCOS Phenotype Identification Helper | Medium | Medium | Solid Core | Educational value after 60 days of data; helps users direct doctor conversations; rule-based (not ML) |
| F55: Ultrasound Result Vault | Medium | Small | Solid Core | Longitudinal AFC + ovarian volume data for RE appointments; AMH correlation chart is unique |
| F56: Annual PCOS Health Review | High | Medium | Strategic | Annual monitoring is standard of care; 9-parameter checklist against lab vault; no other app generates this |
| F57: STRAW+10 Stage Identifier | High | Medium | Quick Win | Core infrastructure for all peri features; auto-stages from cycle log with no competitor equivalent |
| F58: Hot Flash + Night Sweat Logger | High | Small | Quick Win | Highest-volume daily action for peri users; real-time episode entry is the primary use case |
| F59: Greene Climacteric Scale (GCS) | High | Small | Quick Win | Clinical credibility from validated 21-item scale; content-heavy, code-light; monthly cadence |
| F60: Perimenopause Daily Symptom Log | High | Small | Quick Win | Core daily data collection; extends existing 30-second log pattern for peri symptoms |
| F61: GSM Monthly Assessment | High | Small | Quick Win | Most undertreated peri condition; no competitor tracks this with clinical depth |
| F62: Sleep Quality Tracker (PSQI) | High | Small | Quick Win | Sleep disruption near-universal in peri; PSQI is validated; straightforward to implement |
| F63: MHT/HRT Tracker | High | Medium | Quick Win | "Is my HRT working?" is the #1 unanswered question; treatment response tracking is the gap |
| F64: Perimenopause Lab Value Vault | High | Medium | Quick Win | Perimenopausal lab values are the most misunderstood data women receive; contextual interpretation is unique |
| F65: DEXA Bone Density Vault | Medium | Small | Quick Win | Longitudinal T-score tracking for fracture prevention; no competitor; Stage -1/+1 users |
| F66: Blood Pressure Log | Medium | Small | Quick Win | Cardiovascular risk rises with estrogen decline; safety gate doubles as clinical monitoring |
| F67: Mood + Mental Health Monitor | High | Small | Quick Win | Perimenopausal depression systematically missed; PHQ-9 gate adds safety floor identical to PMDD protocol |
| F68: POI Support Track | High | Medium | Quick Win | POI users are a distinct high-need segment; language adaptation prevents alienation; clinical urgency differs |
| F69: Cognitive Tracker | Medium | Small | Solid Core | Brain fog is distressing but not a daily-log driver; monthly cadence sufficient; EMQ-R inspired |
| F70: Weight + Metabolic Tracker (Peri) | Medium | Small | Solid Core | Extends F49; metabolic change during peri is clinically significant; non-punitive framing carries over |
| F71: Non-Hormonal Treatment Tracker | High | Medium | Quick Win | Serves non-HRT users; fezolinetant + CBT + SSRI tracking with evidence ratings is unique |
| F72: Perimenopause Physician Report | High | Medium | Strategic | Patricia-persona's primary need; clinical-priority-ordered PDF is commercial moat; no competitor generates this |
| F73: Peri-Aware Home Screen | High | Small | Quick Win | Personalized home screen is retention infrastructure; low effort, high daily impact |
| F74: VMS Trigger Identification Engine | High | Medium | Strategic | "What triggers my hot flashes?" is personalized insight layer; requires 30+ days data accumulation |
| F75: PMDD + Perimenopause Intersection | High | Medium | Strategic | PMDD persisting into perimenopause is one of the most challenging presentations; no tool handles it |
| F76: PCOS + Perimenopause Intersection | High | Medium | Strategic | PCOS users age into perimenopause; compounded metabolic + hormonal complexity; lifecycle continuity |
| F77: ADHD + Perimenopause Intersection | Medium | Small | Solid Core | Established ADHD-hormone overlap; smaller peri segment; leverages existing ADHD module |
| F78: Cardiovascular Risk Dashboard | High | Medium | Strategic | CVD is the #1 postmenopausal cause of death; early risk communication is preventive medicine |
| F79: Bone Health Dashboard | High | Medium | Strategic | 1-in-2 women >50 will fracture; T-score + calcium + activity correlation is actionable |
| F80: Education and Stage Content Library | High | Medium | Quick Win | Education reduces anxiety and increases adherence; primary tool for Maya-persona onboarding |
| F81: Menopause Rating Scale (MRS) | Medium | Small | Quick Win | 11-item; better completion than GCS for longitudinal monitoring; standard in European menopause trials |
| F82: FSFI — Sexual Function Index | High | Small | Quick Win | 43% of peri women have sexual dysfunction; only 14% discuss it; creates clinical language for the conversation |
| F83: DIVA — GSM Functional Impact | Medium | XS | Solid Core | Adds functional burden layer to F61; minimal build cost; surfaces only when GSM symptoms present |
| F84: ICIQ-UI — Urinary Incontinence | High | XS | Quick Win | 30-40% prevalence; most undertreated; 3-item instrument; clinical language for a stigmatized symptom |
| F85: Joint Pain + Musculoskeletal Log | Medium | Small | Solid Core | Affects 50-60% of peri women; body-map localization helps distinguish peri arthralgia from other causes |
| F86: Headache + Migraine Log | High | Small | Quick Win | Menstrual migraine worsens dramatically in perimenopause; cycle-day correlation is the unique clinical value |
| F87: Heart Palpitations Tracker | High | Small | Quick Win | Affects 40-50% of peri women; logging removes catastrophizing and enables clinical documentation |
| F88: Spotting Tracker + AUB Safety Alert | Critical | Small | Must Build | Postmenopausal bleeding is endometrial cancer red flag; safety gate obligation; reclassified to P0-MVP |
| F89: HBC Masking Flag | High | XS | Quick Win | 30% of peri users on HBC; without this flag STRAW staging is silently wrong for a major user segment |
| F90: Skin + Hair Changes Tracker | Medium | Small | Consider | Affects 50% post-menopause; androgen + estrogen correlation; important to wellbeing, lower clinical urgency |
| F91: Bladder Symptom Standalone Tracker | Medium | XS | Solid Core | Nocturia is a major sleep disruption cause; daily log complements ICIQ monthly instrument |
| F92: Endometriosis Condition Onboarding | High | Medium | Quick Win | Entry gate for all endo features; sets condition flags, language mode, and clinical context — without it nothing else works |
| F93: Daily 5-D Pain NRS Logger | Critical | Medium | Must Build | ASRM 2022 primary trial endpoint; the foundational daily data feed for all downstream instruments and red flag rules |
| F94: Pain Location Body Map | High | Large | Strategic | Anatomical specificity for DIE pattern detection; right shoulder = thoracic endo; flank = ureteral endo; no competitor has this |
| F95: GI/Bowel Symptom Daily Log | High | Small | Quick Win | Dyschezia and rectal bleeding are bowel DIE red flags; cyclical GI data is the IBS-vs-endo differentiator |
| F96: Bleeding/HMB Cycle Log | High | Small | Quick Win | HMB is underdiagnosed in endo; PBAC-adapted log enables treatment response tracking and AUB documentation |
| F97: Fatigue + Brain Fog Daily Log | High | XS | Quick Win | 80% cognitive impairment rate; near-universal fatigue; systemic burden documentation distinguishes endo from isolated pelvic pain |
| F98: Sleep Quality Daily Log | High | XS | Quick Win | 70.8% sleep disturbance; sleep-pain bidirectional relationship is clinically significant; near-zero build cost |
| F99: PHQ-9 Monthly Safety Screen | Critical | Small | Must Build | Safety requirement — OR 3.61 for depression; PHQ-9 item 9 is suicidality screen; non-negotiable product safety floor |
| F100: GAD-7 Bi-weekly Screen | High | Small | Quick Win | OR 2.61 for anxiety; bi-weekly interleaves with monthly PHQ-9 for continuous mental health signal; 7 items, 2 min |
| F101: EHP-30 Monthly QoL Instrument | Critical | Medium | Must Build | Oxford gold standard; only instrument that measures the person's experience of living with disease, not just symptoms; trial-comparable scores |
| F102: EHP-5 Weekly Check-in | High | Small | Quick Win | 5-item short form; 90-second weekly QoL signal between EHP-30 months; minimal build on top of EHP-30 infrastructure |
| F103: B&B Scale Monthly | High | Small | Quick Win | Clinical trial standard; surgeon-facing output; symptom severity 0-9 scale is what specialists use to assess treatment response |
| F104: Treatment Log + Response Tracker | High | Small | Quick Win | Post-surgical suppression data critical for recurrence monitoring; 6-week and 3-month prompts automate the "is it working?" question |
| F105: Surgical History Vault | High | Small | Quick Win | rASRM + #ENZIAN staging history storage; staging caveat card is trauma-informed design requirement |
| F106: Lab Vault (CA-125, AMH, TSH) | High | Medium | Quick Win | AMH trend for ovarian reserve; TSH for 7× hypothyroidism risk; CA-125 trend in known endo is clinically informative |
| F107: Imaging Vault | High | Small | Quick Win | Longitudinal endometrioma size tracking enables surgical decision timing; adenomyosis junctional zone thickness correlates with symptoms |
| F108: DIE Red Flag + Safety Escalation | Critical | Medium | Must Build | Cyclical rectal bleeding/hematuria/flank pain are organ damage signals; PHQ-9 item 9 crisis gate; all must fire before launch |
| F109: Structured Physician Report PDF | Critical | Large | Must Build | Primary commercial differentiator; no competitor generates clinician-formatted report; Emma + Sarah personas both rate this as the feature that changes appointments |
| F110: Comorbidity Tracker | Medium | Small | Solid Core | IBS 3.5×, fibromyalgia, hypothyroidism 7× — comorbidity context changes physician report interpretation; Month 2 |
| F111: Medication Log (NSAID + Hormonal) | High | XS | Quick Win | NSAID use tracking is prerequisite for F118 overuse detection; hormonal adherence data informs response tracking |
| F112: Trigger Log | Medium | Small | Solid Core | Personalized trigger identification; Month 2 analytics layer requires 30+ days of co-logged trigger + symptom data |
| F113: PFPT Log + Response Tracker | High | Small | Quick Win | RCT evidence Level 1; 70% endo patients have pelvic floor dysfunction; no competitor tracks PFPT response |
| F114: Adolescent Mode | High | Medium | Strategic | Adolescent endo is systematically dismissed; school absence tracking + parent portal + plain language = unserved segment |
| F115: Endometrioma Size Monitoring | High | Small | Quick Win | Endometrioma growth >5mm in 6 months warrants surgical evaluation; AMH correlation chart is ovarian reserve decision support |
| F116: Low-FODMAP Diet Tracker | Medium | Large | Consider | RCT 2024: 60% GI response rate; requires diet logging infrastructure; Month 3 once core daily log is stable |
| F117: Cycle-GI Correlation Insight Engine | High | Medium | Strategic | IBS-vs-endo differentiator; 3-cycle data threshold before insight fires; automated cyclical pattern detection is unique clinical value |
| F118: NSAID Overuse Detection + Alert | High | XS | Quick Win | >50% days threshold in 30-day window; long-term NSAID risk education; near-zero build on F111 data |
| F119: Staging Display (rASRM + #ENZIAN) | Medium | Small | Solid Core | Historical enrichment; mandatory caveat card is non-negotiable; ESHRE 2022 note empowers pre-diagnosis users |
| F120: Multi-format Physician Report Export | High | Small | Quick Win | PDF + CSV + shareable link; email-to-doctor flow is the primary WOW moment at first physician appointment |
| F121: Research Export (Opt-in) | Medium | Large | Consider | Credibility play; IRB + privacy architecture required; never mandatory; Month 3 |
| **ADHD MODULE (F122–F151)** | | | | |
| F122: ADHD Onboarding | High | Medium | Strategic | 3-branch routing captures diagnosed, suspected, and hormonal-aware users; onboarding data feeds all downstream instruments |
| F123: Daily 5-Domain Symptom Log | High | Medium | Strategic | Core data collection engine; ≤90-second UX with cycle-phase auto-badge; feeds correlation engine and all monthly instruments |
| F124: ASRS-5 Monthly Screener | High | Small | Quick Win | 90% sensitivity; monthly trend detection; critical for suspected-diagnosis users and physician report |
| F125: ADHD-RS Monthly Tracker | High | Medium | Strategic | Primary RCT-validated outcome measure; Vyvanse benchmark built-in; essential for medication response tracking |
| F126: CAARS Emotional Lability | High | Small | Quick Win | Only app tracking emotional dysregulation with validated T-scores; women-specific primary gap vs. all competitors |
| F127: WFIRS-S Monthly | High | Medium | Strategic | 6-domain functional impairment; work domain feeds accommodation letter (F143); 83% sensitivity at ≥0.65 cutoff |
| F128: PHQ-9 Safety Screen | High | Small | Quick Win | Mandatory monthly safety gate; item 9 crisis protocol; 2.3× suicidality risk in ADHD women |
| F129: GAD-7 Bi-weekly | High | Small | Quick Win | 53% ADHD-anxiety comorbidity; bi-weekly allows luteal anxiety spike detection distinct from GAD trajectory |
| F130: ISI Monthly | High | Small | Quick Win | 80% ADHD adults have sleep disorder; DLMO circadian flag; builds on circadian tracker data |
| F131: Emotional Dysregulation Log | High | Small | Quick Win | RSD episode quick-add accessible anywhere; cycle-phase episode rate chart; no diagnostic label in UI |
| F132: Hyperfocus + Crash Log | Medium | XS | Quick Win | First app to track hyperfocus-crash cycle; feeds burnout risk model (F145) |
| F133: Medication Log + BP | High | Small | Quick Win | BP/pulse monitoring protocol; luteal medication dip detection — novel clinical insight |
| F134: Hormonal-ADHD Correlation | High | Large | Strategic | PRIMARY DIFFERENTIATOR — no competitor has this; requires 60-day data threshold; Month 2 |
| F135: Masking Effort Tracker | High | XS | Quick Win | Single NRS slider daily; only app tracking masking; burnout model input; women's ADHD key gap |
| F136: Sleep Circadian Tracker | High | Small | Quick Win | DLMO phase delay detection; sleep onset time pattern; complements ISI (F130) |
| F137: Brown EF/A Monthly | High | Medium | Strategic | 5-cluster EF profiling; identifies which cluster dips in luteal phase; more granular than ADHD-RS |
| F138: ADHD Physician Report | High | Large | Strategic | Cycle-phase medication effectiveness chart = unique clinical artifact; 3 variants; Month 2 |
| F139: Time Blindness Log | Medium | Small | Solid Core | Barkley temporal myopia; compensatory strategy effectiveness tracking; Month 2 |
| F140: BFRB + Sensory Log | Medium | Small | Solid Core | 20-38% ADHD-BFRB overlap; dopamine-seeking behavior context; sensory sensitivity co-tracking |
| F141: Supplement + Lifestyle Log | Medium | Small | Solid Core | Omega-3 / exercise / melatonin timing; aerobic exercise equivalent to low-dose stimulant evidence |
| F142: Body Doubling Log | Medium | XS | Quick Win | 92% task completion rate (Focusmate data); minimal build; productivity × session tracking |
| F143: Accommodation Doc Generator | High | Medium | Strategic | ADA/Equality Act backed; WFIRS-S work domain as clinical basis; converts 90 days data to HR letter |
| F144: Perimenopause-ADHD Module | High | Medium | Strategic | 97% symptom exacerbation; HRT response tracking; psychiatrist-gynecologist bridge; underserved segment |
| F145: Burnout Risk Detection | High | Small | Quick Win | Masking + crash algorithm; early detection before collapse; recovery guide shown proactively |
| F146: PMDD-ADHD Intersection | High | Medium | Strategic | 46% comorbidity rate; double-peak impairment detection; no competitor tracks both simultaneously |
| F147: Financial Dysregulation Log | Medium | Small | Solid Core | Impulse purchase × cycle phase; bill avoidance tracking; no existing ADHD clinical tool captures this |
| F148: ADHD CBT Skill Library | Medium | Large | Consider | Safren RCT-validated protocol; 30 cards ≤150 words; clinical disclaimer required; Month 3 |
| F149: Postpartum ADHD Mode | Medium | Medium | Solid Core | 24% postpartum diagnosis surge; EPDS + ADHD co-monitoring; PPD vs. ADHD distinction |
| F150: Late Diagnosis Support | Medium | Medium | Solid Core | Grief-relief psychoeducation; assessment prep guide; high engagement predicted for suspected-dx users |
| F151: Relationship Impact Log | Medium | Small | Solid Core | Highest distress domain; ADHD × relationship × cycle phase; WFIRS-S Family backing |

**Quadrant definitions:**
- Quick Win: High impact relative to effort. Ship first.
- Strategic: High impact, high effort. Plan carefully, invest in full.
- Solid Core: Medium impact, medium effort. Important for completeness.
- Consider: Lower impact or effort mismatch. Evaluate after Month 4.

---

## Section 7 — Cross-Platform Feature Parity

HormonaIQ ships mobile-first. iOS leads, Android follows within 4 weeks. Web is a companion surface — primarily for physician report access and data visualization.

| Feature | iOS MVP (Week 8) | Android MVP (Week 12) | Web (Month 4) |
|---------|-----------------|----------------------|---------------|
| F1: Phase-Aware Home Screen | Full | Full | Read-only Today view |
| F2: 30-Second Log Flow | Full | Full | Full (no voice) |
| F3: Cycle Calendar | Full | Full | Full |
| F4: DRSP Tracker | Full | Full | Full |
| F5: Condition Profile Setup | Full | Full | Full (web onboarding) |
| F6: Privacy Architecture | Full (device-local) | Full (device-local) | Account-required (cloud E2E only) |
| F7: Phase Education Cards | Full | Full | Full |
| F8: Basic Insights Dashboard | Full | Full | Full (enhanced on larger screen) |
| F9: DRSP Report Export | Full (PDF share sheet) | Full (PDF share sheet) | Download PDF |
| F10: Notifications | Full (push + local) | Full (push + local) | Email summary only |
| F11: Pattern Recognition | Full | Full | Read-only in Insights |
| F12: Lab Value Vault | Full | Full | Full |
| F13: ADHD Check-in | Full | Full | Full |
| F14: Medication Tracker | Full | Full | Full |
| F15: Luteal ADHD Report | Full | Full | Download PDF |
| F16: Hot Flash Logger | Full | Full | Full |
| F17: HRT Effectiveness | Full | Full | Full |
| F18: Androgen Tracker | Full | Full | Full |
| F19: Crisis Safety System | Full | Full | Tier 2 only (static resources page) |
| F20: Ora AI Insights | Full | Full | Full |
| F21: ADHD-PMDD Detector | Full | Full | Read-only |
| F22: Peri Stage Identifier | Full | Full | Read-only |
| F23: Multi-Condition Overlay | Full | Full | Full (best on web) |
| F24: Irregular Cycle Mode | Full | Full | Full |
| F25: GCS Weekly Assessment | Full | Full | Full |
| F26: GSM Tracker | Full | Full | Full |
| F27: Cognitive Tracker | Full | Full | Full |
| F28: Metabolic Snapshot | Full | Full | Full |
| F29: Scheduling Intelligence | Full | Full | Read-only |
| F30: Multi-Condition Report | Full | Full | Download PDF |
| F57: STRAW+10 Stage Identifier | Full | Full | Read-only (stage display) |
| F58: Hot Flash + Night Sweat Logger | Full | Full | Full |
| F59: GCS Monthly Assessment | Full | Full | Full |
| F60: Perimenopause Daily Symptom Log | Full | Full | Full |
| F61: GSM Monthly Assessment | Full | Full | Full |
| F62: PSQI Sleep Quality Tracker | Full | Full | Full |
| F63: MHT/HRT Tracker | Full | Full | Full |
| F64: Perimenopause Lab Value Vault | Full | Full | Full |
| F65: DEXA Bone Density Vault | Full | Full | Full |
| F66: Blood Pressure Log | Full | Full | Full |
| F67: Mood + Mental Health Monitor | Full | Full | Full |
| F68: POI Support Track | Full | Full | Full |
| F69: Cognitive Tracker | Full | Full | Full |
| F70: Weight + Metabolic Tracker (Peri) | Full | Full | Full |
| F71: Non-Hormonal Treatment Tracker | Full | Full | Full |
| F72: Perimenopause Physician Report | Full (PDF share sheet) | Full (PDF share sheet) | Download PDF |
| F73: Peri-Aware Home Screen | Full | Full | Read-only Today view |
| F74: VMS Trigger Engine | Full | Full | Read-only in Insights |
| F75: PMDD + Peri Intersection | Full | Full | Read-only |
| F76: PCOS + Peri Intersection | Full | Full | Read-only |
| F77: ADHD + Peri Intersection | Full | Full | Read-only |
| F78: Cardiovascular Risk Dashboard | Full | Full | Full (enhanced on larger screen) |
| F79: Bone Health Dashboard | Full | Full | Full (enhanced on larger screen) |
| F80: Education + Content Library | Full | Full | Full |
| F81: Menopause Rating Scale (MRS) | Full | Full | Full |
| F82: FSFI (opt-in) | Full | Full | Full |
| F83: DIVA Questionnaire | Full | Full | Full |
| F84: ICIQ-UI (opt-in) | Full | Full | Full |
| F85: Joint Pain Log | Full | Full | Full |
| F86: Headache + Migraine Log | Full | Full | Full |
| F87: Heart Palpitations Tracker | Full | Full | Full |
| F88: Spotting Tracker + AUB Alert | Full | Full | Full |
| F89: HBC Masking Flag | Full | Full | Full |
| F90: Skin + Hair Tracker | Full | Full | Full |
| F91: Bladder Symptom Tracker | Full | Full | Full |
| F92: Endometriosis Onboarding | Full | Full | Full (web onboarding) |
| F93: Daily 5-D Pain NRS Logger | Full | Full | Full |
| F94: Pain Location Body Map | Full (Clinical + Simple) | Full (Clinical + Simple) | Full (Clinical + Simple) |
| F95: GI/Bowel Symptom Daily Log | Full | Full | Full |
| F96: Bleeding/HMB Cycle Log | Full | Full | Full |
| F97: Fatigue + Brain Fog Log | Full | Full | Full |
| F98: Sleep Quality Log | Full | Full | Full |
| F99: PHQ-9 Monthly Screen | Full | Full | Full |
| F100: GAD-7 Bi-weekly Screen | Full | Full | Full |
| F101: EHP-30 Monthly QoL | Full | Full | Full |
| F102: EHP-5 Weekly Check-in | Full | Full | Full |
| F103: B&B Scale Monthly | Full | Full | Full |
| F104: Treatment Log + Response Tracker | Full | Full | Full |
| F105: Surgical History Vault | Full | Full | Full |
| F106: Lab Vault (CA-125, AMH, TSH) | Full | Full | Full |
| F107: Imaging Vault | Full | Full | Full |
| F108: DIE Red Flag + Safety System | Full | Full | Full |
| F109: Physician Report PDF | Full (PDF generation) | Full (PDF generation) | Full (PDF download) |
| F110: Comorbidity Tracker | Full | Full | Full |
| F111: Medication Log | Full | Full | Full |
| F112: Trigger Log | Full | Full | Full |
| F113: PFPT Log | Full | Full | Full |
| F114: Adolescent Mode | Full | Full | Full (parent portal web-only) |
| F115: Endometrioma Size Monitoring | Full | Full | Full |
| F116: Low-FODMAP Diet Tracker | Full | Full | Full |
| F117: Cycle-GI Correlation Engine | Full | Full | Full |
| F118: NSAID Overuse Alert | Full | Full | Full |
| F119: Staging Display (rASRM + #ENZIAN) | Full | Full | Full |
| F120: Multi-format Report Export | Full (PDF + CSV + link) | Full (PDF + CSV + link) | Full (PDF + CSV + link) |
| F121: Research Export (opt-in) | Full | Full | Full |
| **ADHD MODULE (F122–F151)** | | | |
| F122: ADHD Onboarding | Full | Full | Full |
| F123: Daily 5-Domain Symptom Log | Full | Full | Full (no voice quick-add) |
| F124: ASRS-5 Monthly | Full | Full | Full |
| F125: ADHD-RS Monthly | Full | Full | Full |
| F126: CAARS Emotional Lability | Full | Full | Full |
| F127: WFIRS-S Monthly | Full | Full | Full |
| F128: PHQ-9 Safety Screen | Full | Full | Full |
| F129: GAD-7 Bi-weekly | Full | Full | Full |
| F130: ISI Monthly | Full | Full | Full |
| F131: Emotional Dysregulation Log | Full (floating quick-add) | Full (floating quick-add) | Full (no floating button) |
| F132: Hyperfocus + Crash Log | Full | Full | Full |
| F133: Medication Log + BP | Full | Full | Full |
| F134: Hormonal-ADHD Correlation | Full | Full | Full (primary chart view) |
| F135: Masking Effort Tracker | Full | Full | Full |
| F136: Sleep Circadian Tracker | Full (Apple Health integration) | Full (Health Connect Month 2) | Full (manual entry) |
| F137: Brown EF/A Monthly | Full | Full | Full |
| F138: ADHD Physician Report PDF | Full (PDF + share) | Full (PDF + share) | Full (PDF download) |
| F139: Time Blindness Log | Full | Full | Full |
| F140: BFRB + Sensory Log | Full | Full | Full |
| F141: Supplement + Lifestyle Log | Full | Full | Full |
| F142: Body Doubling Log | Full | Full | Full |
| F143: Accommodation Doc Generator | Full (PDF export) | Full (PDF export) | Full (PDF download) |
| F144: Perimenopause-ADHD Module | Full | Full | Full |
| F145: Burnout Risk Detection | Full | Full | Full |
| F146: PMDD-ADHD Intersection | Full | Full | Full |
| F147: Financial Dysregulation Log | Full | Full | Full |
| F148: ADHD CBT Skill Library | Full | Full | Full |
| F149: Postpartum ADHD Mode | Full | Full | Full |
| F150: Late Diagnosis Support | Full | Full | Full |
| F151: Relationship Impact Log | Full | Full | Full |

**Platform notes:**
- Voice note logging (F2 Step 4) is iOS and Android only; web shows text field fallback
- Lock screen quick-log widget: iOS first (WidgetKit); Android second (Glanceable Widgets); web not applicable
- Biometric auth (Face ID / fingerprint) for app open: iOS and Android only
- iOS health data integration (Apple Health read for activity, sleep, HRV): iOS only; web not applicable
- Android health data integration (Health Connect): Android Month 2+

---

## Section 8 — Accessibility Requirements

This demographic has brain fog, chronic pain, ADHD-related cognitive load, and processing differences. Accessibility is not a compliance checkbox — it is the product working correctly for the people it was built for.

**Minimum standards across all features:**

| Requirement | Standard | Applies To |
|-------------|----------|------------|
| Minimum touch target | 44 × 44pt (iOS HIG) / 48 × 48dp (Android) | All interactive elements |
| Color contrast — body text | WCAG AA (4.5:1) | All text |
| Color contrast — large text / UI components | WCAG AA (3:1) | Headings, buttons, interactive |
| Color-only information encoding | Never — always pair color with label or pattern | All charts, phase indicators |
| Dynamic Type / font scaling | Supported up to 3x scale without layout breakage | All text elements |
| Screen reader (VoiceOver / TalkBack) | All interactive elements have meaningful labels | Full app |
| Focus management | Logical focus order in all modals and sheets | Modals, bottom sheets, forms |
| Timeout extensions | No auto-dismissing toasts or alerts under 5 seconds | Toasts, alerts |
| Reduced motion mode | Respects OS "Reduce Motion" setting; all transitions replace with simple fade | Animations |
| Brain fog mode | Triggers in detected luteal peak: fewer visible options, larger tap targets, simplified language | Today screen, Log flow, Insights |

**Per-feature accessibility notes:**

**F2 — 30-Second Log Flow:** Mood icons must have VoiceOver labels that describe the behavioral state (not the visual description). Example: "Icon: Overwhelmed and depleted" not "Icon: A gray circle with a flat line." Slider for brain fog must be operable with a single swipe gesture and accessible via switch control.

**F3 — Cycle Calendar:** Ring view must have a text alternative accessible to VoiceOver users — a linear list of logged days with dates and phase labels. Color-coded ring cannot be the only way to convey phase information.

**F4 — DRSP Tracker:** Severity scale (1–6) must be accessible without requiring precise slider dragging; individual tap targets for each scale value should be available as an alternative. Rating labels must be text, not implied by position.

**F8 — Insights Dashboard:** All chart data must be accessible via a tabular data view (a screen-reader-accessible table behind the chart). Charts must have title and axis labels as proper accessibility attributes, not decorative text overlaid on images.

**F9 / F15 / F30 — PDF Reports:** Generated PDFs must be tagged for accessibility (proper heading structure, alt text for charts, reading order). This is a technical PDF generation requirement, not a visual design requirement.

**F19 — Crisis Safety System:** Crisis resources must be accessible via a single tap from any state of the app, including with VoiceOver and switch access active. Crisis phone numbers must be rendered as tappable `tel:` links, not text strings.

**F20 — Ora AI Insights:** Ora card text must not exceed a 9th-grade reading level (Flesch-Kincaid target: 60–70). During brain fog mode, Ora cards are simplified to a single sentence. Ora cards dismissed by a user are not re-shown without explicit user request.

**Brain fog mode automatic activation rules:**
- Activates when: current phase is detected luteal peak (days 22–27) AND user has 2+ cycles of data confirming this is their hard window
- Or activates when: user manually enables it from the Today screen with one tap
- Effects: top navigation is hidden, showing only Today, Log, and You; card content is simplified; font sizes increase by one step; padding increases; non-essential UI elements are hidden
- Brain fog mode deactivates automatically at phase transition; user can also disable manually

---

*HormonaIQ Feature Specification v1.0 | April 2026*
*Next review: before Month 2 sprint begins*
