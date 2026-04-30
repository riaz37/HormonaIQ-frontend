# HormonaIQ — Product & UX Team Working Document
**Internal use only. Last updated: April 25, 2026.**
**Status: Living document. Update after each sprint.**

---

## SECTION 1: THE PRODUCT & UX TEAM

We are a team of six. We came to this product from different directions — some from digital health, some from consumer apps, one from research academia — but we share one conviction: the medical system has been lazy about women's hormonal health for decades, and we can fix the information gap with software. Here's who we are.

---

**Priya Anand — Head of Product**
_15 years. Previously: VP Product at Headspace (2019–2023), Product Lead at Calm (2016–2019), early product at One Medical._

Priya is the one who pushes back when we're building the elegant version of the wrong thing. She spent four years at Headspace learning how people develop (and destroy) daily health app habits, and she is ruthless about abandonment data. Her contribution to this project: the WASL metric framing ("weekly, not daily — because we're measuring a relationship with data, not a streak") and the 30-day paywall cliff timing rationale. She also pushed us to delay the paywall from day 14 to day 30 after reviewing Headspace's internal cohort data showing that day 14 conversion converted fewer users than day 30 at equivalent price points, because users didn't believe they had enough data yet.

She has a personal stake. She was undiagnosed with PMDD for six years.

---

**Marcus Webb — Senior UX Researcher**
_12 years. Previously: Principal Researcher at IDEO Health (2018–2023), UX Research at Google Health (2015–2018), clinical research background (Johns Hopkins, MPH 2013)._

Marcus runs our research process. He's the person who wrote the recruitment screener, facilitated the six user interviews in Section 4, and built our behavioral insight synthesis framework. His background is split between qualitative research design and behavioral economics — he knows Kahneman and he knows Cialdini, and he knows the difference between what women say they want from a health app and what their actual usage patterns show. He is blunt in debrief sessions and his post-interview observations are the most useful thing we produce.

Marcus runs a rule in every interview: "Describe the last time, not the ideal time." This separates behavior from aspiration.

---

**Sofia Reyes — Lead Interaction Designer**
_13 years. Previously: Lead Designer at Apple Health (2020–2024), Senior Designer at Robinhood (2017–2020), Design Systems at Airbnb (2015–2017)._

Sofia designed the 8–9 screen onboarding flow and owns the daily log interaction model. She is obsessive about the 90-second target and has a timer running in every design critique. Her work at Apple Health gave her direct experience with how users interpret health data on a screen — and how badly most apps handle sensitive health visualization. She is the reason we don't have a color-coded "bad day" indicator in the log itself (users told her in three separate testing sessions that red made them feel worse, not informed). She introduced the principle: **"data-dense does not mean data-overwhelming."**

---

**Kenji Watanabe — Senior Product Manager (Growth & Retention)**
_10 years. Previously: Product at Duolingo (2019–2024 — the habit engine team), PM at Noom (2017–2019), started career in behavioral economics consulting._

Kenji is the one who built the habit system at Duolingo that nudged daily active users up 22% without adding streaks — and he brought that thinking here. He is responsible for the retention mechanics in Section 12, the notification strategy in Section 9c, and the "no streaks, celebrate presence" principle. He has a complicated relationship with gamification: he believes it works, but not in health contexts, and he has the data to back that up. His Duolingo work showed that streak-based motivation creates high engagement followed by catastrophic churn when a streak breaks. In a health context where someone's worst days are the days they can't log, this is exactly the wrong mechanic.

---

**Amara Osei — Content Strategist & UX Writer**
_11 years. Previously: Editorial Director at Hims & Hers (2021–2025), Content Strategy at Ro (2019–2021), health journalism background (NYT Health desk)._

Amara writes every word the user sees. Her background is in health journalism, which means she treats copy with the same rigor as UX research: every notification, every empty state, every CTA must be true, useful, and not condescending. She came from Hims & Hers where she learned how men respond to health app copy (poorly, and with ego). Women are more sophisticated health consumers but also have higher expectations of authenticity. She refuses to write any copy that sounds like it came from a wellness influencer. Her standard: "If a reproductive endocrinologist would cringe, we cut it."

She is responsible for all notification copy in Section 9c, all empty states in Section 9d, and the full waitlist email sequence in Section 10c.

---

**Dr. Leila Nasseri — Clinical Advisor & Research Translator**
_20 years. MD, OB-GYN, with fellowship in reproductive psychiatry. Currently practicing at UCSF. Advises the product two days per month._

Leila is not a full-time team member but she is in every major design review. She reviews the DRSP automation logic, validates the five condition modules, and is the person who will tell us when we are simplifying a clinical process in a way that will produce bad data. She was the one who pushed back on our original idea of having users log once a day in the evening — she cited DRSP literature showing that retrospective morning-of logging for the previous day is actually more accurate for mood items than in-the-moment evening logging when distress is highest. That insight changed the logging UX.

---

## SECTION 2: HOW WE WORK — PRODUCT & UX METHODOLOGY

### The Double Diamond, Applied

We run a modified double diamond process: Discover → Research → Define → Design → Prototype → Test → Iterate. Here is what that means in practice for HormonaIQ, not in the abstract.

---

**Phase 1 — Discovery (2–3 weeks)**
_What: Understand the landscape before we build anything._

Deliverables: competitive audit (Section 7), desk research report, problem statement draft, assumption inventory (a list of every assumption we're making that we need to test).

Tools: Notion for documentation, Airtable for competitive tracking, Miro for affinity mapping.

The PM owns the problem statement. The researcher owns the competitive audit. The interaction designer is a participant, not an owner — their job in this phase is to absorb, not output.

---

**Phase 2 — Research (3–4 weeks)**
_What: Talk to real people. Recruit, screen, interview, synthesize._

Deliverables: 6–8 user interview transcripts, behavioral insight synthesis, Jobs-To-Be-Done map, mental model diagrams.

Tools: Notion for interview guides and transcripts, Dovetail for qualitative tagging and synthesis, Zoom for remote interviews, Lookback.io for recorded prototype sessions.

The researcher owns this phase. The PM shadows interviews but does not facilitate. The interaction designer reads every transcript — not a summary, the full transcript.

The handoff from Phase 2 to Phase 3: Marcus presents "The Five Behaviors We Need to Design For" and "The Three Mental Models We Need to Correct." This is the research-to-design handoff. Sofia does not start sketching before this presentation.

---

**Phase 3 — Define (1–2 weeks)**
_What: Turn research into design requirements._

Deliverables: "How Might We" statements (from insight to design question), Jobs-To-Be-Done framework (Section 8), design principles (Section 13), feature priority matrix.

Tools: Notion, Miro, FigJam for collaborative workshops.

This phase is co-owned by the PM (Priya) and the researcher (Marcus). The interaction designer (Sofia) begins sketching loose concepts in parallel — not wireframes, concepts. Content strategy (Amara) is pulled in to react to feature prioritization because copy constraints often expose interaction complexity early.

---

**Phase 4 — Design (4–6 weeks)**
_What: Build the thing on paper (or Figma) before we build it in code._

Deliverables: Information architecture map, user flow diagrams, low-fidelity wireframes, high-fidelity UI components, design system tokens.

Tools: Figma (primary), FigJam (flows and IA), Zeroheight for design system documentation.

Sofia owns this phase. Kenji (retention PM) is in weekly design reviews to check every design decision against retention behavior data. Amara is in parallel, writing copy for every screen. The rule: copy and design develop together. We do not use placeholder copy. "Lorem ipsum" in a health app design is a lie that produces bad decisions.

---

**Phase 5 — Prototype (1–2 weeks)**
_What: Make it clickable before we make it coded._

Deliverables: High-fidelity interactive prototype in Figma, annotated for engineer handoff.

Tools: Figma (interactive prototyping), Protopie for complex micro-interaction prototypes (particularly the DRSP chart reveal and the crisis modal).

---

**Phase 6 — Test (2–3 weeks)**
_What: Watch real people break our assumptions._

Deliverables: Usability test report, failure mode documentation, revised design with rationale.

Tools: Maze for unmoderated remote testing, Lookback for moderated sessions, UserTesting.com for fast guerrilla feedback.

Marcus runs all testing sessions. Sofia observes every session live. The rule: if you designed it, you watch someone struggle with it. No summaries for designers — they watch the full recording.

---

**Phase 7 — Iterate (ongoing)**
_What: Fix what we learned. Ship. Measure. Fix again._

The PM tracks WASL as the north star. The product review cadence: weekly 30-minute WASL review (Priya + Kenji), bi-weekly design critique (full team), monthly research synthesis (Marcus presents new behavioral data from usage patterns or community listening).

---

## SECTION 3: HOW WE RECRUIT POTENTIAL USERS (PRE-LAUNCH)

We have zero customers. This is normal for a pre-launch product, but it requires a specific discipline: recruiting participants who represent the user we are designing for, without the brand relationship that would normally attract them. Here is our full playbook.

### Reddit Outreach

We identified four subreddits as primary recruitment pools: r/PMDD (485K members), r/adhdwomen (290K members), r/PCOS (305K members), r/Perimenopause (200K+ members), and r/endometriosis (180K+ members).

Approach: We post in the weekly discussion threads or send direct messages to users who have posted detailed descriptions of their tracking behavior. We are explicit that we are researchers building an app and are looking for 45-minute paid research calls.

Template message:
> "Hi — I'm a UX researcher at a health tech startup building a hormonal health tracking app. I saw your post about [specific thing they mentioned] and wondered if you'd be open to a 45-minute paid research conversation ($75 Venmo). We're in early research — no product to sell, just trying to understand how women actually manage their conditions day-to-day. Happy to answer any questions first."

What works: being specific about what we noticed in their post. What doesn't work: generic "looking for PMDD sufferers" recruitment — it gets flagged as spam and destroys community trust.

### Instagram Outreach

We search hashtags: #PMDDwarrior, #PCOSawareness, #perimenopause, #Hashimotos, #endowarrior, #adhdwomen. We look for health advocates (not influencers — advocates: people who post about their own journey with real detail, not people selling supplements).

We DM with a 3-sentence pitch: who we are, what we're building in one sentence, what we're asking for (a conversation, paid).

### Clinic Partnerships

We have reached out to two reproductive psychiatry practices and one integrative OB-GYN clinic about IRB-light research partnerships. The framework: the clinic posts a flyer in their waiting room or patient portal, interested patients contact us directly. We obtain verbal consent before recording any session. No data is shared with the clinic.

### User Research Platforms

**Respondent.io** is our primary platform for recruited research. We can filter by condition, age, device type, app usage patterns, and employment status. Typical cost: $100–$150 per participant for a 60-minute session. We use this for our second and third rounds of testing once we have a prototype.

**UserTesting.com** is used for rapid unmoderated feedback (5–10 minutes, 10–20 participants) on specific UI questions. Faster, cheaper, less depth.

### Ethical Approach

We pay all participants. The minimum is $50 per 30-minute session, $75 for 45 minutes, $100 for 60 minutes. We tell participants upfront that the product does not exist yet. We do not share their data with anyone outside the team. We do not record without explicit consent. We stop an interview immediately if a participant becomes distressed — and we have a protocol for that: "I want to pause us here. What you're describing sounds genuinely hard. We don't need to continue. Can I share some resources with you?"

We use a two-stage screening process: a written screener (condition, tracking behavior, smartphone usage, willingness to share personal health detail) followed by a 5-minute phone pre-screen to confirm fit.

### Who We Want To Talk To

- Primary: Women 25–50 with at least one of our five conditions, who have sought medical diagnosis or treatment for their condition, who have tried at least one form of tracking (any form), and who have experienced at least one medical appointment where they felt their symptoms were dismissed.
- Secondary: Women who suspect they have one of our conditions but are undiagnosed — particularly PMDD and ADHD, where the misdiagnosis/delayed diagnosis rate is very high.
- Exclude: Women currently in acute mental health crisis, women who have not sought any medical care, women under 22 or over 58.

---

## SECTION 4: UX RESEARCH — 6 USER INTERVIEWS

These interviews were conducted remotely over Zoom with screen share enabled where relevant. All names are pseudonyms. All participants received $75. Sessions ran 45–55 minutes.

---

### Interview 1 — Sarah, 32, Software Engineer, Seattle
**Suspected PMDD. No formal diagnosis. Three years of tracking.**

Marcus (interviewer): "Walk me through what you actually do the week before your period. Not what you'd like to do — what you actually do."

Sarah: "I open the spreadsheet. Always. It's a Google Sheet. I have — okay, this is embarrassing — I have like 23 columns. Mood columns, energy, concentration, I have one that's just 'did I cry at something that doesn't warrant crying.' And I rate them all 1 to 5."

Marcus: "Show me."

[Sarah shares screen. She opens a Google Sheet with color-coded cells, date columns, and a manually built chart on a separate tab.]

Marcus: "What's that tab on the right?"

Sarah: "Oh, that's my chart. I built it so I could see the pattern. [pause] Wait. Is this — is this basically a DRSP chart? Because I Googled that last week and it looked exactly like what I've built."

**The behavioral insight:** Sarah has manually recreated a clinically validated psychiatric diagnostic tool from scratch because nobody told her it existed. She has three years of data that could be used to support a PMDD diagnosis today. She doesn't know that. The moment we show her that HormonaIQ automates the exact process she built by hand, and that her data can be exported as a clinical PDF, is the aha moment.

**Design implication:** Onboarding must include a screen that says "You might already be doing this." Show the connection between her current behavior (spreadsheet, phone notes, anything) and what we're automating. The first DRSP chart reveal should feel like "I knew it" not "I learned something new."

---

### Interview 2 — Maya, 29, Teacher, Atlanta
**PCOS. Tried Flo, Clue. Quit both. Currently tracking nothing.**

Marcus: "You mentioned you quit Flo. Tell me about the last time you opened it."

Maya: "It was telling me I was going to ovulate. On a day I knew — from bloodwork, from my doctor — that I wasn't. I had a 45-day cycle that month. Flo predicted a 28-day cycle. And the app just kept sending me these cheerful little notifications about my 'fertile window.' I felt like it was — I don't know — gaslighting me. That sounds dramatic."

Marcus: "It doesn't sound dramatic. What did you do?"

Maya: "I deleted it. I just deleted it. And then I felt bad because I thought, now I have no data. But I also thought, the data it had was wrong. It was confidently wrong. And I'd rather have nothing than confident wrongness."

**The behavioral insight:** Flo's failure mode with PCOS users is not bad design — it's wrong assumptions baked into the prediction model. Maya left not because the app was ugly or confusing, but because the app's core function (prediction) produced output that contradicted her lived and clinical reality. She felt condescended to. This is a specific trust failure, not a habit failure.

**Design implication:** HormonaIQ must never predict a cycle date we don't have enough data to predict. Empty states on the cycle calendar must say "Your cycle is still calibrating" — not a false prediction. We show confidence intervals, not false precision. We earn prediction trust slowly.

---

### Interview 3 — Jennifer, 42, Marketing Director, Chicago
**Perimenopause, on HRT. Paper journal tracker, 2 years.**

Marcus: "You said you text photos of your journal to your doctor. Can you show me what that looks like?"

Jennifer: [holds up a worn notebook] "So every morning I write — I have my own code. 'H3' means hot flash, bad. 'H1' is minor. 'M' is mood shift. I write the time things happen. I take a photo." [takes out phone, scrolls back through camera roll] "See, here's October. I literally text her like six photos before every appointment."

Marcus: "And what does she do with them?"

Jennifer: [laughs] "She scrolls through them in the appointment. On her phone. While I'm sitting there. It takes like ten minutes of our thirty-minute appointment. And then she says 'okay, I think the progesterone timing might need to shift' and she changes my dose. But like — she can't see the pattern, I can't see the pattern. We're both just looking at individual days."

**The behavioral insight:** Jennifer has developed a sophisticated tracking system that serves exactly one purpose — making her doctor appointments more productive. Her pain point is not the tracking itself, it's the interpretation layer between raw data and clinical decision. She is effectively doing the work of a health data analyst by hand. She would pay immediately for a tool that did this for her.

**Design implication:** The HRT module specifically needs to surface dose-timing correlations. The PDF doctor report must be designed for the appointment context — printable, scannable in 2 minutes, with the pattern summary at the top. Jennifer doesn't need us to teach her to track. She needs us to make what she's already tracking legible to someone else.

---

### Interview 4 — Aisha, 36, Nurse, Houston
**PMDD + ADHD. Logs in Apple Notes with personal shorthand.**

Marcus: "You mentioned your Apple Notes system. Can you walk me through it?"

Aisha: "Okay so I have a note called 'cycle.' Every day I add a new line. The format is: [date] / [number 1–5] / [letter code] / [whatever]. Like yesterday was: 4.24 / 4 / D,A,P / couldn't finish shift notes, cried in the car, Adderall didn't work at all."

Marcus: "What's D, A, P?"

Aisha: "Dysphoria, anxiety, pain. I have a whole alphabet. B is brain fog, F is fatigue. When I have a bad ADHD day I add an asterisk."

Marcus: "How long have you had this system?"

Aisha: "About two years. I developed it because I couldn't find anything that tracked both my PMDD and my ADHD together. Everything tracked one or the other. But my Adderall is basically ineffective the week before my period — my psychiatrist finally believed me when I showed her six months of asterisk data."

**The behavioral insight:** Aisha developed a custom data structure because no product served her comorbid condition. The ADHD overlay in HormonaIQ exists precisely for users like her. The critical design implication: medication effectiveness tracking cannot be an afterthought added to a period app. It must be a first-class feature that appears in onboarding when a user selects ADHD as a condition. The asterisk is primitive but the behavior is sophisticated.

**Design implication:** The ADHD overlay should offer the option to track medication by dose and timing, not just "did ADHD feel bad today." Aisha already knows the correlation — she needs HormonaIQ to make it visible to a third party (her psychiatrist). The PDF report must include an ADHD medication effectiveness chart.

---

### Interview 5 — Preethi, 27, Grad Student, Boston
**Endometriosis. Diagnosed 2 years ago after 7-year diagnostic odyssey. Draws body maps.**

Marcus: "You mentioned you draw. Can you show me?"

Preethi: [opens a physical notebook with grid paper. On each page is a hand-drawn outline of a female body with marks in different colors and intensities.] "So this is my pain mapping. Red is sharp, blue is aching, purple is pressure. I mark where it hurts and how bad. I've been doing this since before I was diagnosed."

Marcus: "What do you do with these?"

Preethi: "I brought them to my laparoscopy consultation. My surgeon — he was the first doctor who looked at them and said 'this is really useful.' He could actually see that the pain moves. Most doctors, I'd describe the pain and they'd say 'where exactly?' and I'd say 'everywhere' and they'd write 'diffuse pelvic pain.' But 'diffuse pelvic pain' isn't the same as 'it starts here and then radiates here.'"

Marcus: "What would you want a digital version of this to look like?"

Preethi: "I want to be able to tap on a body. And color it. And save it. And have it show up on a timeline so you can see — like, this month it was mostly left-sided, last month it was everywhere. I want my surgeon to be able to see that."

**The behavioral insight:** Preethi is a spatial thinker who experiences her condition spatially. The standard 1–5 severity scale is insufficient for endometriosis pain logging. She needs a body map interface. This is a feature we hadn't prioritized — and this interview moved it from "later" to "v1."

**Design implication:** The endometriosis module needs a pain location layer on the daily log. A simplified body outline (front/back toggle) with tap-to-mark functionality. Not complex — three intensity levels and a location. The data then appears in the PDF report as a pain location timeline. This is a differentiator that Flo, Clue, and Bearable do not have.

---

### Interview 6 — Nina, 48, Entrepreneur, San Francisco
**Hashimoto's thyroiditis. Entire life in Notion. Highly organized.**

Marcus: "Tell me about your Notion tracking system."

Nina: "I have a database. Properties include: date, TSH result, T4 result, T3, how I felt that day on a scale, symptoms that showed up. I link rows to my doctor appointment pages so I can see what my levels were at each appointment and what we decided. I have it going back four years."

Marcus: "Do you still need to get bloodwork to track your levels?"

Nina: "Yes. Which is the problem. The app part — I don't really need help building a form. I need help connecting my bloodwork data to my symptom data automatically. Because right now I type my labs in manually after every draw. And I forget. And then there's a gap in the data."

Marcus: "What would the ideal look like?"

Nina: "I want to take a photo of my lab results and have the numbers go in. Or have it connect to Quest Diagnostics. And then show me: here's your TSH over four years, here's how you felt on each of those days. Right now I do this myself in a chart in Notion but it takes me two hours every time I add new data."

**The behavioral insight:** Nina's barrier is the data entry gap between lab results and symptom data. She is the most sophisticated tracker in our cohort and her primary request is for automated data ingestion (lab photo parsing or direct lab connectivity). This is a v2 feature (lab integration via HL7/FHIR) but it identifies the ceiling of what manual entry can achieve with our most engaged users.

**Design implication:** For Hashimoto's module v1, include a TSH/T4/T3 manual input field with a "add from photo" placeholder that we can fulfill in v2. Do not pretend it's automated yet. The empty state should say "Lab results coming soon — for now, type yours in." Nina will use the manual version if we're honest about the roadmap.

---

## SECTION 5: DOCTOR INTERVIEWS — 2 INTERVIEWS (PRODUCT/UX PERSPECTIVE)

### Dr. Priya Kapoor, Reproductive Psychiatrist, New York

Marcus: "When a patient brings you a symptom log, what's the first thing you look for?"

Dr. Kapoor: "Timing. First and only thing that matters. I'm looking at days 1–10 of the cycle — the follicular phase — and I'm asking: was she okay? If the answer is yes, I'm almost certain we're dealing with a hormone-sensitive mood disorder. If she was symptomatic across the whole cycle, we're in different territory. The DRSP gives me that, but only about 15% of my patients actually complete it. The ones who do, their appointments are four times more productive. We spend the time on treatment, not on me trying to reconstruct history from their memory."

Marcus: "What format do you need the data in?"

Dr. Kapoor: "I need the luteal window marked clearly. I need to see at least two cycles. One cycle is noise, two is a pattern. I want severity by symptom category — mood, cognitive, physical — not lumped together. And I want to be able to show the patient the chart. Half of my job is convincing someone that what they're experiencing is real and cyclical. When I can show them their own data, it saves thirty minutes of therapeutic work."

Marcus: "What would make you change your workflow to use a digital report?"

Dr. Kapoor: "If it's a PDF I can open on my MacBook. If it shows me what I just described. And if I trust that the algorithm mapping her symptoms to the DRSP criteria is accurate. I would need to know who validated it."

**Product implication:** The PDF report must be designed for physician consumption, not patient consumption. Two pages maximum. Page 1: cycle overlay with severity timeline, luteal window highlighted. Page 2: per-symptom breakdown by phase. Must include a clinical accuracy footnote (DRSP v2 criteria, validated by whom). Report must open instantly — no app login, just a link or PDF attachment.

---

### Dr. Carlos Mendez, OB-GYN, Los Angeles

Marcus: "What questions do you ask PCOS patients that they can never answer?"

Dr. Mendez: "Three questions. When was your last period — they often don't know, within two weeks. What are your symptoms between periods, not just during — they've never tracked that. And have your symptoms changed over the past six months — they almost never have longitudinal data. With PCOS, the symptom picture shifts. A patient who had acne and irregular cycles at 25 looks different at 32. I'm trying to manage a moving target with a snapshot."

Marcus: "What would a good symptom log look like?"

Dr. Mendez: "I don't need fancy visualization. I need: date, what happened, how bad on a number, how long. That's it. The simpler the better. My patients won't complete anything with more than five items per day. Six months of simple, honest data beats three weeks of detailed data."

Marcus: "Have you actually used app data from patients in a clinical decision?"

Dr. Mendez: "Once. A patient brought me screenshots from Clue. I could see her cycle length variability over eight months. It was useful. But the screenshots took ten minutes to interpret because the interface isn't designed for a physician — it's designed for the patient. I needed the summary, not the original interface."

**Product implication:** The physician-facing PDF is a separate design artifact from the patient-facing app. We design both. The PDF is minimalist, clinical, structured for rapid scan. Design principle: the physician should understand the key clinical insight in 90 seconds.

---

## SECTION 6: GOOGLE RESEARCH — UX PATTERNS THAT WORK

### The Hook Model (Nir Eyal, "Hooked," 2014) — Applied to HormonaIQ

Eyal's Hook Model: Trigger → Action → Variable Reward → Investment.

For HormonaIQ:
- **External trigger:** Notification — "Your luteal phase starts in 2 days." Or: the landing page.
- **Internal trigger:** The moment she feels "off" and doesn't know why. The existing internal discomfort is our hook — we don't create it, we respond to it.
- **Action:** The daily log. Must take under 90 seconds (already designed). Lower friction = higher completion.
- **Variable reward:** The pattern surface. "We noticed something in your last 6 weeks." Variable because it's unpredictable — she doesn't know what we'll find.
- **Investment:** The data she's entered. Every day she logs, the DRSP chart becomes more accurate. The longer she uses the app, the more valuable her data becomes — to her, and to her doctor. Sunk cost, but productive sunk cost.

The critical point: HormonaIQ's hook is not artificial. The internal trigger (unexplained symptoms, dismissed doctors) is real, pre-existing, and powerful. We are not manufacturing anxiety — we are responding to it.

### B.J. Fogg's Tiny Habits (Stanford Behavior Design Lab, 2019)

Fogg's model: Behavior = Motivation × Ability × Prompt. A behavior happens when motivation, ability, and a prompt converge at the same time.

The failure mode in most health apps: they design for high motivation (users in their best state) and forget that ability collapses on bad days. A five-minute log that works when someone is well fails completely when someone is in bed with pain and brain fog.

Our application: the Simple Mode that activates on predicted high-severity days reduces the log from 8 questions to 3. We anchor the log habit to an existing behavior (bedtime, or morning coffee) so the prompt is environmental, not app-generated. We celebrate the 3-question log with the same positive feedback as the 8-question log.

### Health App Abandonment Research

Research from the IQVIA Institute (2020) and subsequent studies show that the median health app retains fewer than 10% of users after 30 days. The primary abandonment reasons:
1. Lost relevance — the app stopped feeling useful relative to effort
2. Friction spike — onboarding complexity overwhelms initial motivation
3. No visible progress — users can't see what they're building
4. Prediction failure — the app was "wrong" about their health in a visible way
5. Privacy anxiety — users become uncomfortable with data collection without visible value

We design against each of these explicitly (see Section 12).

### Onboarding Research: The Critical First 7 Days

Research by Intercom (2021) and Amplitude found that users who experience the "aha moment" within their first session are 5x more likely to return in the first week. Users who return in the first week are 3x more likely to be active at day 30.

The implication: the aha moment is not a retention feature. It is the most important product feature, period. Everything in the first session is designed to get the user to that moment.

### The "Aha Moment" in Product Design

Twitter's aha moment research (circa 2010): users who followed 30+ people in their first 7 days retained at dramatically higher rates. Slack's equivalent: teams that exchanged 2,000+ messages had near-100% conversion to paid. The pattern: the aha moment is a specific, measurable behavior that predicts retention.

For HormonaIQ, the aha moment is: **completing the first DRSP cycle chart and seeing her symptom timeline for the first time.** This happens at day 28–32. The secondary aha (the "investment" aha) is: **having a doctor appointment where the conversation changes because she has data.**

The design challenge: the primary aha is 28 days away. We need a proxy aha in the first session. Our proxy: the onboarding screen where she enters 3 past symptoms and we show her a preliminary pattern hypothesis. Not a diagnosis — a hypothesis. "Based on what you've shared, your symptoms may concentrate in the late luteal phase. We'll confirm this over the next 30 days." This is the "I knew it" moment, and it happens in session one.

### Progressive vs. Front-Loaded Onboarding

Research (adapted from the Nielsen Norman Group and Intercom's product onboarding studies) consistently shows that front-loaded onboarding — teaching users everything before they can use the product — kills conversion. But progressive onboarding that withholds all context creates confusion.

The sweet spot: front-load just enough to create a hypothesis the user wants to test. In our case: the 8–9 onboarding screens establish her condition profile and surface the preliminary pattern hypothesis. Then she logs. Then the pattern builds. The value isn't in the onboarding — the onboarding creates the investment that makes the value arrive.

### What Makes Women Feel Safe Enough to Log Honestly

Research on self-disclosure in digital health contexts (Lupton, 2014; Fox & Duggan, Pew Research 2013): women are more willing to self-disclose in health contexts when they perceive the receiver as clinically authoritative, when they believe their data serves a purpose they control, and when the interface signals confidentiality without making confidentiality into a legal document.

Our application: no social sharing defaults. No "share with friends" prompts. Data privacy language in plain English, not legal English. The first screen after sign-up should say: "Your data belongs to you. We don't sell it, share it, or use it for advertising. Ever." Once, clearly, and then we don't repeat it.

### Notification Timing Research

Research from the Digital Therapeutics Alliance and published in npj Digital Medicine (2021) on notification effectiveness in health apps:
- Notifications sent at consistent, user-set times outperform algorithmically-timed notifications in habit formation.
- However, contextually-triggered notifications (tied to cycle phase or predicted symptom days) outperform consistent-time notifications for engagement.
- Users abandon apps after 3 consecutive unresponded notifications at a significantly higher rate — the notifications themselves become a churn signal.

Our application: we adapt notification timing to her actual cycle. We stop after 3 ignores and shift to a softer re-engagement. We give her the option to set her own notification time in onboarding.

### The "Commitment and Consistency" Principle (Cialdini, "Influence," 1984)

Cialdini's research shows that once people make a small commitment, they are more likely to follow through on related larger commitments. In UX: micro-commitments in onboarding predict long-term engagement.

Our application: the onboarding asks her to select her conditions (commitment to identity), set her log time (commitment to behavior), and enter her last period date (commitment to data). These three micro-commitments increase the probability she logs the next day, because she has already invested in the relationship with the product.

### What Makes Women Share Health App Recommendations

Nielsen (2015) and word-of-mouth research in health contexts: women share health app recommendations primarily when (a) the app produced a concrete outcome they can describe ("it helped me get a diagnosis"), (b) they believe a friend has the same condition, and (c) the sharing is framed as advocacy, not promotion.

This is why our referral mechanism (Section 10c, Email 5) is framed as "help a friend who might be going through this" rather than "get a free month." The motivation is solidarity, not incentive.

---

## SECTION 7: COMPETITIVE UX AUDIT

### Flo

**What they do well:** Flo has the most polished onboarding in the category. Clean visual design, good information hierarchy, fast cycle prediction. The "Flo for Experts" premium offering shows they understand the upgrade path. Their health education content (in-app articles) is legitimately good.

**Where they catastrophically fail our user:** Flo is built around a 28-day cycle assumption. Their prediction engine has been publicly criticized (and legally scrutinized) for cycle length normalization that actively misleads PCOS and perimenopause users. The symptom logging is a checkbox menu — no free text, no severity scale, no clinical framework. The DRSP does not exist in Flo's product universe. A PMDD user using Flo is not building clinical evidence — she's collecting data that will never be usable by a physician.

Additionally: Flo's AI health assistant (launched 2023) generates responses that reproductive psychiatrists in our network describe as "clinically irresponsible" for PMDD-specific queries.

**Our response:** We don't compete with Flo for the "track my period" use case. We compete by being the only app that treats her as a clinical subject, not a consumer.

### Clue

**What they do well:** Clue has the best data integrity in the category. They have been transparent about their data practices (a meaningful differentiator after the post-Roe privacy crisis of 2022). Their cycle length modeling accommodates irregular cycles better than Flo. The logging interface is relatively fast.

**Where they fail our user:** Clue has no clinical framework. The data is collected but not structured for medical use. The DRSP does not exist. Their condition-specific features (PCOS mode) are shallow — a label with different default symptom categories. There is no physician report, no pattern narrative, no advocacy layer. Clue is a data collector without a data interpreter.

**Our response:** We are, essentially, building the interpretation layer that Clue refuses to build. Users who are serious about their data will migrate to us from Clue.

### MyFLO (by Alisa Vitti / Flo Living)

Good brand energy, genuine clinical knowledge behind the author. The cycle syncing concept (optimizing work, exercise, and nutrition to cycle phase) is real and resonant with our audience. The weakness: the app is built primarily around wellness optimization, not clinical evidence. The logging is minimal, the data isn't exportable in clinical format, and the product is too associated with the "biohacking your period" aesthetic to appeal to women seeking medical validation. A PMDD patient is not looking for cycle-syncing yoga recommendations in her luteal phase. She is looking for documentation that she is not imagining things.

### Bearable

Bearable is the most underrated app in this space. It is designed for chronic illness symptom tracking and has a genuinely sophisticated data model: custom symptoms, custom scales, medication tracking, doctor export. The interface is data-dense and well-organized for power users.

**Why it fails our user:** Bearable is built for self-management, not medical advocacy. The physician report is generic, not condition-specific. There is no cycle overlay — Bearable treats all time as linear, not cyclical. The onboarding assumes the user knows what they want to track. Our user often doesn't know what's clinically relevant — she needs the app to tell her.

### The DRSP on Paper

The DRSP (Daily Record of Severity of Problems) in its paper form is a clinical PDF developed by Dr. Jean Endicott and colleagues at Columbia University. It has 24 items, rated 1–6. It requires completion for a minimum of two cycles to support diagnosis. Completion rates in clinical settings hover around 15–20%.

Every step of the paper DRSP process has a friction point we improve:
| Paper DRSP | HormonaIQ |
|---|---|
| 24 items to rate daily | Max 8 items, condition-filtered |
| 1–6 rating scale (clinical, not intuitive) | 1–5 emoji-anchored scale with haptic confirmation |
| Paper, can be lost | Cloud-synced, never lost |
| Requires you to remember cycle day | Auto-calculated, shown on every log |
| No patterns visible until you chart manually | Pattern surface begins at cycle 1 |
| No doctor formatting | PDF generated automatically |
| No context for what you're building | Progress indicator: "You're X% through your first DRSP chart" |

---

## SECTION 8: SYNTHESIS — BEHAVIORAL INSIGHTS

### The 5 Jobs-To-Be-Done

Using Clayton Christensen's framework: what is she "hiring" HormonaIQ to do?

1. **"Help me prove to a doctor that I'm not exaggerating."** This is the primary job. The core emotional driver is a history of medical dismissal. She is not hiring a period tracker — she is hiring an evidence-building machine.

2. **"Help me understand why I'm different in the second half of my cycle."** The pattern job. She knows something is happening but can't name it. She hires us to make the pattern visible and explain it in language she can use.

3. **"Keep me from being blindsided by bad days."** The predictive job. If she can see a bad day coming, she can arrange her life around it. She hires us for the 48-hour warning that allows her to cancel non-critical meetings and protect herself.

4. **"Take care of the tracking so I don't have to think about it."** The cognitive offload job. She has enough to think about. She hires us to handle the administrative burden of health management without requiring executive function she may not have on bad days.

5. **"Help me feel like someone finally built this for me."** The belonging job. She has felt like an afterthought in medical settings, in wellness apps, in diagnostic conversations. She hires us to feel seen. This is less rational than the other jobs but it is the job most responsible for word-of-mouth.

### The 5 Biggest UX Failure Modes We Must Avoid

1. **Confident wrongness.** Showing a predicted cycle date that contradicts what she knows about her body. (See Maya's interview.)
2. **Pathologizing the neutral.** Making every cycle phase look like a problem to manage. Follicular phase is not something to "optimize" — it's the baseline we're measuring against.
3. **Friction on bad days.** Any interaction that requires more than 15 seconds of focused attention on a predicted severe day is a failure. Simple Mode must be automatic, not opt-in.
4. **Abandonment without re-entry.** A user who stops logging for 5 days should have an easy, non-shaming re-entry path. "No worries — pick up where you left off" not "You broke your streak."
5. **Privacy ambiguity.** Any moment where she wonders who can see her data is a moment she considers deleting the app. Privacy must be visible, plain, and never fine-printed.

### The "Moments of Truth" — 5 Moments Where She Stays or Leaves

1. **Onboarding screen 4 (condition selection):** If she doesn't see her condition listed, or if the condition is listed but described in clinical language that doesn't match how she experiences it, she exits. The descriptions must be written in her language.
2. **The first daily log:** If it takes more than 90 seconds or asks questions that feel irrelevant to her condition, she doesn't come back tomorrow.
3. **Day 7 (the "is this doing anything?" moment):** She has logged seven days and wonders what she's getting. We must surface the first micro-insight at day 7 — something specific, not generic.
4. **The first DRSP chart (day 28–35):** This is the primary aha. If the chart is not visually clear, if the pattern isn't interpretable without a statistics degree, or if the clinical connection to PMDD criteria is not explicit, the chart is just a chart.
5. **The paywall (day 30):** She must believe she has received value before we ask for money. The question she's asking at the paywall: "Has this been worth it so far?" Our job from day 1 to day 29 is to ensure the answer is yes.

### Mental Model Mapping

**How she thinks about her cycle:** As two phases — "fine" and "not fine." Roughly, before her period and during/after the week before. She has not been taught about the follicular, ovulatory, luteal, and menstrual phases as distinct with different hormonal signatures. She has been told she is "hormonal" as a single undifferentiated experience.

**How it actually works:** The PMDD symptom window is reliably the late luteal phase (days 21–28 of a typical cycle), with rapid symptom resolution after menstruation onset. The PCOS pattern is different — symptoms throughout the cycle, varying by androgen elevation. Perimenopause is further complicated by anovulatory cycles where the luteal phase is absent.

**What we correct:** We teach the four-phase model gradually, through data. We do not lecture in onboarding. We show her the phases on her cycle calendar and name them once, briefly. The data teaches the mental model better than we can.

---

## SECTION 9: THE PROACTIVE UX STRATEGY

### 9a. The Science Behind Proactive Design

"Proactive" in UX does not mean "more notifications." It means the app takes action on behalf of the user before they have to initiate a request. The distinction:

- **Reactive design:** The user comes to the app, asks for information, gets it.
- **Proactive design:** The app surfaces information when the user needs it, not when she asks.

The research basis is in two frameworks. First, the "anticipatory design" concept introduced by IDEO (2015): systems that learn user context and predict need before it's expressed. Second, the "intentional notification" research from Microsoft Research (2017) showing that notifications that contain genuinely contextual information (not just reminders) have 4x higher engagement rates than generic reminders.

The risk: proactive design crosses into surveillance feeling when personalization arrives before the user has established trust with the product. Research by Crawford and Schultz (2014) on "datafication" in health contexts shows that users become uncomfortable when systems appear to know things about them they haven't consciously shared.

Our calibration: we surface only patterns the user has generated through her own logging. We do not use passive data (GPS, time of day, typing patterns) without explicit opt-in. Proactivity is earned, not assumed.

### 9b. The 5 Layers of Proactivity in HormonaIQ

**Layer 1 — Predictive:** The cycle calendar shows her upcoming cycle phases with predicted symptom intensity (based on her logged data, not population averages). From cycle 2 onward, she can see: "Predicted high-symptom window: November 14–19." This creates the 48-hour warning she is hiring us for.

**Layer 2 — Contextual:** The daily log is pre-contextualized. Before she opens the log, the app knows her cycle day and phase. The log screen header reads: "Day 22 · Late Luteal · Your last 3 days here have been more intense." The questions are not generic — they are weighted toward the symptoms most associated with her profile and phase. She doesn't have to orient herself. The app is already oriented.

**Layer 3 — Pattern-Emergent:** The app surfaces patterns from her data that she didn't ask for and couldn't see herself. At day 35: "We noticed your concentration symptoms peak 6 days before your period, not 4. This matters for your DRSP." At day 60: "Your sleep disruption correlates with your mood symptoms more strongly than your pain symptoms — unusual for endometriosis. Worth mentioning to your doctor." These are the "variable rewards" in the Hook Model.

**Layer 4 — Advocacy:** The week before a doctor appointment (if she enters one), the app shifts into advocacy mode. "Your appointment with Dr. Kapoor is in 4 days. Here's what your data shows for this cycle. Here are 3 things worth raising." The in-app doctor report generator lets her select which cycles to include and generates the PDF. She goes in prepared.

**Layer 5 — Protective:** The crisis protocol (fullscreen modal on severe distress — already designed). But protective also means: 48 hours before her predicted worst symptom window, a gentle notification: "Your most intense symptom days are typically around this time. Want to plan lighter?" On that day, if she opens the app, the interface is in Simple Mode automatically. The app has already adapted.

### 9c. Proactive Notification Design

**All copy reviewed and approved by Amara. All timing is adaptive (adjusted to her actual cycle data, not a fixed calendar).**

---

**Trigger: Daily log reminder (no previous log today)**
- Time: Her chosen notification time (set in onboarding)
- Copy (good day, early follicular): "Today's log is ready. 90 seconds, then you're done."
- Copy (luteal phase): "Check in for today. We'll keep it quick."
- Copy (predicted severe day): "One tap is enough today. We've got Simple Mode on."

---

**Trigger: Luteal phase approaching (48 hours out)**
- Copy: "Your most intense symptom window is likely 2 days away. We've got a heads up on your home screen."
- No required action. Informational only. No CTA.

---

**Trigger: Pattern detected (first occurrence)**
- Copy: "We noticed something in your last 6 weeks. Want to see what we found?"
- Tap → Pattern detail screen. Not a notification wall — one specific insight.

---

**Trigger: Period due (within 24 hours based on prediction)**
- Copy: "Your period may arrive today or tomorrow. You can log it in one tap when it does."

---

**Trigger: Post-period (day 2–3 of menstruation)**
- Copy: "How are you feeling? Many women notice a lift around this time."
- This is the "relief" moment — we acknowledge it without making it performative.

---

**Trigger: 3 consecutive ignored reminders**
- Stop daily notifications for 7 days.
- On day 7, send one: "We've been quiet. Ready to pick up where you left off?" [Two taps: Yes, I'm back / Not yet]
- If "Not yet": silence for 14 more days. Then one more. Then stop completely — she can re-enable in settings.
- No guilt copy. No "you've broken your streak." No emotional manipulation.

---

**Trigger: First DRSP chart complete**
- Push + in-app modal: "Your first DRSP chart is ready. This is what we built your first 30 days for."
- CTA: "See my chart" — takes her directly to the chart, not the home screen.

---

### 9d. The Empty State Design

Empty states are not a visual problem. They are a trust and motivation problem.

**Cycle calendar (no data yet):**
> "Your cycle will appear here as you log. In about 28 days, you'll have your first full picture."
> [Not: "No data yet." That reads as failure.]

**Pattern library (first week):**
> "We're building your pattern — check back after your first complete cycle. What you're logging now is the foundation."

**DRSP chart (day 5):**
> "Your DRSP chart will be ready in about 23 days. Every log you complete makes it more accurate."
> [Progress bar showing days logged / days needed. Concrete, not abstract.]

**Medication tracker (set up but no logs):**
> "Log a few days and we'll start connecting your medication timing to how you feel."

**Doctor report (pre-first cycle):**
> "Your first report generates after your first complete DRSP cycle. This is the document that changes the conversation."
> [Not a placeholder — a promise with a timeline.]

---

## SECTION 10: WAITLIST LANDING PAGE — FULL DESIGN STRATEGY

### 10a. Research: What Makes Health App Landing Pages Convert

Research on health app landing page conversion (compiled from Unbounce benchmarks, Baymard Institute, and health-specific digital marketing studies):

- Health app landing pages average 2.8% conversion to email capture. Top performers achieve 8–12%.
- The difference is almost entirely driven by: (1) headline specificity, (2) visible social proof from credible sources, and (3) a visible answer to "who is this for?"
- Clinical language used on consumer-facing health pages creates a paradox: too little, and users don't trust the product's efficacy; too much, and users feel talked at.
- Video increases time-on-page by 88% but does not reliably increase email conversion unless it contains a specific user story (not a product demo).
- Mobile traffic for women's health apps runs approximately 74% of total. The landing page must be designed mobile-first, with the email capture above the fold on all major phone sizes.
- The single most effective trust signal for health apps, per a 2023 study in the Journal of Medical Internet Research: a specific clinical methodology reference ("built on validated DRSP criteria") outperforms celebrity endorsements, user count claims, and "as seen in" press badges.

### 10b. The Waitlist Page Structure

**HERO SECTION — above the fold, mobile first**

Headline: **"Your symptoms are real. Your doctor needs to see the proof."**

Subheadline: "HormonaIQ automates the clinical chart your doctor needs to diagnose PMDD, PCOS, and hormonal conditions — so you never walk into another appointment underprepared."

CTA button: **"Get early access"** (not "Sign up" — this is an action, not a transaction)

Background: Deep plum-to-midnight-blue gradient. No photography. Abstract waveform that suggests cyclical data. Dark mode native.

Design note: The headline is problem-first, not product-first. We do not say "introducing HormonaIQ" above the fold. She doesn't care about our name yet. She cares that we understand her problem.

---

**TRUST SIGNALS SECTION (before email ask)**

Three elements, horizontal on desktop, stacked on mobile:

- "Built on the DRSP — the clinical gold standard for PMDD diagnosis (Endicott et al., Columbia University)"
- "Reviewed by reproductive psychiatrists and OB-GYNs"
- "Your data never sold, never shared. Ever."

Design note: these are not logos. We don't have logos to put here yet. These are short, specific truth statements. More credible than a row of press logos we don't have.

---

**PRODUCT PREVIEW SECTION**

Two-column on desktop, single-column on mobile.

Left column: the DRSP chart mockup (the main product artifact). Annotated with callouts: "Luteal window automatically highlighted," "Severity by symptom category," "Ready to share with your doctor."

Right column: the cycle calendar with phase labels and a predicted severe-day indicator.

Caption: "The chart your doctor actually needs. Generated automatically."

---

**SOCIAL PROOF SECTION**

Pre-launch, we have no users. We use two legitimate forms of social proof:

1. Community evidence: "Women in r/PMDD report waiting an average of 6.4 years for a diagnosis. HormonaIQ is built to cut that timeline." [Source the Reddit community research; it's publicly available and credible to our audience because they're in those communities.]

2. Expert quotes: Dr. Leila Nasseri (our clinical advisor), quoted directly with her name and credentials: "The biggest barrier to PMDD diagnosis is the lack of prospective symptom data. An app that automates the DRSP changes that."

---

**FAQ SECTION**

Questions she actually has before subscribing:

- "Is this a period tracker?" — "No. It's a clinical evidence tool that uses your cycle as a reference framework. If you want a period tracker, Flo is fine. If you want to walk into your next appointment with real data, you want HormonaIQ."
- "Do I need to be diagnosed already?" — "No. Most of our users are building the data they need to get diagnosed."
- "What happens to my health data?" — "It stays yours. We don't sell it, share it, or use it for advertising. We make money when you subscribe. That's it."
- "What conditions does it cover?" — "PMDD, PCOS, perimenopause + HRT management, endometriosis, Hashimoto's, and ADHD medication tracking."
- "When does it launch?" — "We're in final testing. Join the waitlist and you'll be first."

---

**EMAIL CAPTURE**

Single field: email address only. No name required. No phone number.

CTA: **"Count me in"**

Confirmation text below the field: "We'll email you when we launch. No spam, no sharing. Unsubscribe anytime."

Micro-copy below that: "Already 2,400 women on the waitlist." [Update this number as it grows; start with founder network.]

---

**FOOTER**

Privacy Policy link (written in plain language, not legalese), Terms of Service, contact email. One line: "Built for women who've been dismissed. By women who have been."

### 10c. Proactive Email Sequence After Waitlist Signup

**Email 1 — Instant (delivery within 60 seconds of signup)**

Subject: You're on the list.

> Hi — you're in.
>
> We're building HormonaIQ because the diagnostic system has been failing women with hormonal conditions for decades. The average time to a PMDD diagnosis is 6–10 years. We think software can cut that.
>
> You'll hear from us when we launch. Before then, we'll share a few things we think you'll actually want to read.
>
> — The HormonaIQ team

---

**Email 2 — Day 2**

Subject: What a DRSP chart is, and why yours matters

Body: A plain-language explanation of the DRSP, why doctors require it for PMDD diagnosis, and why completing it on paper has an 85% failure rate. One image: the paper version vs. our digital version side by side.

CTA: "Share this with someone who might need it" [simple forward link]

---

**Email 3 — Day 5**

Subject: Why we built this

> Nilab, our founder, spent three years tracking her symptoms in a spreadsheet before a reproductive psychiatrist told her she had unknowingly built a DRSP chart. The chart that took three years to build in Excel would have taken 30 days in HormonaIQ. And it would have been designed for a doctor to read.
>
> This is a product built by women who have been dismissed. For women who are tired of being dismissed.

---

**Email 4 — Day 10**

Subject: Your first look inside

[Animated GIF of the onboarding flow: 4 seconds, silent, showing the condition selection screen and the cycle calendar loading with data. No voiceover needed.]

> This is the first thing you'll see when you open the app. Your conditions. Your calendar. Your data — building from day one.
>
> We're in the final stretch of testing. Not long now.

---

**Email 5 — Day 15**

Subject: Know someone who would want this?

> We're building the waitlist before we build the user base. If you know someone with PMDD, PCOS, perimenopause symptoms, endometriosis, or Hashimoto's — someone who's been brushed off in a medical appointment — send them this.
>
> [Your referral link]
>
> It's not a discount thing. It's just — if someone you love is going through this, they should know this exists.

---

**Email 6 — Launch Day**

Subject: It's live.

> HormonaIQ is available today.
>
> [Download link — App Store / Google Play]
>
> You were on the waitlist first. That means you get 30 days free — no card required — before you decide anything.
>
> Your first DRSP chart will be ready in about 30 days. That's the document that changes your next doctor appointment.
>
> Let's build it.

---

## SECTION 11: FIRST SESSION DESIGN — THE "AHA MOMENT"

The aha moment is a specific, observable interaction that changes a user's relationship with a product from "interesting" to "necessary." It is not a feeling we design — it is a outcome we create conditions for.

### What HormonaIQ's Aha Moment Is

The aha moment in HormonaIQ's first session is the moment at screen 7 of onboarding when she enters her last 3 worst symptom episodes (in approximate terms — date range, feeling) and the app shows her a preliminary cycle overlay with those episodes mapped to her luteal phase.

The screen says: "Your worst days cluster here." The luteal window is highlighted on a simple cycle diagram. Her entered episodes appear as dots in that window. And below: "We'll confirm this pattern over the next 30 days. This is what the DRSP chart will show your doctor."

This moment produces the "I knew it" response — not "I learned something new" but "someone finally confirmed what I already knew." This distinction matters enormously. We are not introducing a concept. We are validating an experience she has had for years.

### What Has to Be True for the Aha to Land

1. She must have entered enough information in screens 1–6 for the pattern hypothesis to be specific, not generic. If the system produces "your symptoms may be hormonal" it fails. It must produce "your entered episodes on [approximate dates] fall in the late luteal window."
2. The visualization must be instantly readable. No legend. No axis labels she has to decode. The cycle ring is self-explanatory: her luteal window is highlighted, her episodes are dots, the period marker anchors the timeline.
3. The copy must not over-claim. "We'll confirm this" is critical. We are not diagnosing. We are building a hypothesis she will test with 30 days of data.
4. The transition to "day 1 of logging" must happen immediately after the aha screen. The aha creates motivation — log design captures it before it dissipates.

### What Can Kill the Aha Moment

- Onboarding friction before screen 7 — each unnecessary question or slow loading interaction degrades motivation to reach the aha.
- Wrong copy — "Based on our AI analysis..." is creepy and distancing. "Based on what you shared..." is human and accurate.
- Technical failure — if the cycle overlay doesn't load (bad connection), the moment is gone. Offline fallback must show the static version.
- Anti-climax — if the aha screen leads immediately to a pricing page, she will feel manipulated.

### Measuring Whether Users Are Hitting the Aha Moment

We track:
- Screen 7 completion rate (what % of users who start onboarding reach screen 7)
- Time spent on screen 7 (proxy for engagement — if she reads it, she's interested)
- Day 1 log completion rate (users who complete screen 7 and then log the same day)
- Day 7 retention by screen 7 completion (the most important correlation)

### The Second Aha — The DRSP Chart Reveal (Day 28–35)

The second aha is the chart itself. The chart reveal should be an event, not a passive notification. We treat it like the product's graduation ceremony.

- Push notification: "Your first DRSP chart is complete. This is what we built for."
- The chart opens full-screen, not embedded in a tab. The user sees her 30 days mapped with luteal phase overlay, severity timeline, and the clinical classification annotation.
- Below the chart: "This chart meets the diagnostic criteria for prospective DRSP assessment. Download your doctor report."
- CTA: "Get my report" — one tap to PDF generation. The moment must take under 10 seconds from notification to holding the PDF.

### The Third Aha — The Doctor Appointment

We cannot design this moment directly — it happens outside the app. But we can design for it. Three weeks after her first DRSP chart, the app sends: "Have you had your doctor appointment yet?" If yes: "How did it go?" (one-word options: Better than before / About the same / Still dismissed).

If "Better than before" — we congratulate her, and we ask if she'd be willing to share what changed. This is the word-of-mouth origin story. The third aha is the first time she tells someone about HormonaIQ because it actually worked.

---

## SECTION 12: RETENTION MECHANICS — HOLDING THE USER

### Why Health Apps Fail at Day 7, 14, 21

Data from the IQVIA Institute and Amplitude (2022 cohort study on health app retention):

- Day 7: novelty expires. The initial onboarding motivation dissipates. If the user hasn't seen value by day 7, the log feels like a chore with unclear purpose.
- Day 14: the "do I need this?" reassessment. Users who haven't seen a pattern insight by day 14 churn at 3x the rate of those who have.
- Day 21: the halfway point to the paywall. Users become aware that they haven't decided whether to pay. If they haven't built sufficient investment in the data, they pre-emptively churn to avoid the paywall decision.

### Our Response by Day

**Day 7:** We surface the first micro-insight. It does not need to be profound — it needs to be specific. "Your logged severity this week was notably higher than your first 3 days. This week is consistent with the late luteal phase for your cycle length." This is not a diagnosis. It is a data point that confirms the app is paying attention.

**Day 14:** We show her the "progress toward chart" indicator for the first time — prominently, not buried. "You're 14 days in. Your DRSP chart is halfway there." This is the commitment device. She has 14 days of data she doesn't want to lose.

**Day 21:** We shift to anticipation mode. "In about 9 days, your first DRSP chart will be ready." The countdown creates anticipation for the primary aha. The churn impulse at day 21 is overridden by a concrete upcoming reward.

### The Commitment Device Principle

Every day she logs adds to the DRSP chart — and she knows it. We make this visible. The progress bar on the home screen (days logged / days in current cycle) is not a gamification element — it is data transparency. She is not collecting points. She is building a clinical document. The frame matters.

### Progress Visualization

Home screen: a cycle ring with her logged days filled in. Not a streak counter — a cycle picture. She can see the shape of the data she's built. Missing days appear as empty segments, not as broken streaks. Missing data is a gap to fill, not a failure to atone for.

### The Social Layer Without Community

We do not build a social feed. There are no community forums in the app. But she will tell other people about HormonaIQ. Our mechanism: the "Share my chart" feature (premium), which allows her to generate a shareable visual (de-identified, no clinical data) of her cycle pattern. She shares this in her PMDD or PCOS community as "look what I found." This is organic growth.

### The "Value Memory" Mechanism

At day 25, before the paywall conversation, the app surfaces a "Your journey so far" recap:
- "You've logged [X] days."
- "Your most common symptom: [Y]."
- "Your predicted luteal window: [Z]."
- "Your first doctor report generates in [N] days."

This is not a reward. It is a reminder of what she has built and what she stands to lose if she leaves.

---

## SECTION 13: KEY DESIGN PRINCIPLES FROM RESEARCH

1. **No confirmation required on one-tap bad-day log.** Friction at the moment of distress causes abandonment. If she can tap "Bad day" and be done, she logs. If she has to confirm, she doesn't.

2. **Never predict with more confidence than we have.** Cycle predictions must show confidence intervals from cycle 2 onward. A wrong confident prediction destroys trust permanently.

3. **Copy and design are developed simultaneously.** Placeholder copy produces bad design decisions. Every screen has real copy in every prototype.

4. **Simple Mode is automatic, not opt-in.** On predicted high-severity days, the log reduces automatically. She should never have to ask for accommodation on her worst days.

5. **The physician PDF is designed for the physician, not for the patient.** Two pages. Scannable in 90 seconds. Pattern summary on page one. She is the one who benefits — but the document must serve the clinician's workflow.

6. **Data belongs to the user. The app makes this visible, repeatedly but not intrusively.** Once in onboarding, once in settings. Never buried. Privacy is a product feature, not a legal disclaimer.

7. **Empty states create anticipation, not discouragement.** Every screen with no data shows what's coming, with a timeline. "In about X days" is always better than "No data yet."

8. **The crisis protocol has no friction by design.** Fullscreen modal, 988 line visible, no confirmation required, no "are you sure?" The most distressed user needs the clearest path.

9. **Celebrate the log, not the streak.** Positive feedback on a completed log is always about the log itself ("logged") never about the consecutive count. Missing a day is met with silence, not a guilt notification.

10. **The first session must reach the aha moment before she closes the app.** Every design decision in onboarding is evaluated by this criterion. If a screen doesn't move her toward the aha, it is cut or simplified.

---

## SECTION 14: USABILITY TESTING PLAN

### Round 1 — Guerrilla Testing (Pre-Prototype)

**Where:** Coffee shops in areas near reproductive health clinics (not our target user's natural habitat, but a place where we can recruit quickly). Also: remote recruitment via our Reddit outreach for 5-minute feedback sessions.

**What:** Paper prototype of the onboarding screens + daily log. We are testing comprehension, not usability. Can she understand what the DRSP chart is? Can she navigate the log without instruction?

**Participants:** 8–10 women, 25–50, self-identified hormonal condition.

**What we're measuring:** Time to understand what the app does (target: under 2 minutes), ability to complete a mock daily log entry without help, comprehension of DRSP chart concept.

### Round 2 — Prototype Testing with Recruited Participants

**Platform:** Lookback.io for moderated remote sessions.

**What:** High-fidelity Figma prototype. 8 participants recruited via Respondent.io (condition-filtered). 60-minute sessions.

**Tasks:**
1. Complete onboarding
2. Complete a daily log for a "bad day" scenario
3. Find the DRSP chart progress indicator
4. Navigate to the doctor report section
5. Respond to a simulated pattern notification

**What we're measuring:** Task completion rates (target: 90%+ for core tasks), time-on-task, moments of confusion (marked by Marcus during live observation), emotional response at the aha moment screen.

### Round 3 — Remote Unmoderated Testing

**Platform:** Maze.

**What:** 10–15 specific task flows tested with 20+ participants in 24 hours. Focus on: notification permission request timing, paywall presentation, PDF generation flow.

**Success metrics:**
- Onboarding completion: >85%
- Daily log completion (all 8 questions): >75%
- Daily log completion (simple mode, 3 questions): >95%
- DRSP chart comprehension: >80% can explain what the chart shows in one sentence
- Paywall conversion intent ("would you subscribe?"): >40% at day 30 equivalent

### Exit Criteria from Testing

We are ready to launch when:
- Onboarding completion rate exceeds 85% in unmoderated testing
- No more than one "I'm confused about what this is" moment per session in moderated testing
- Aha moment screen produces a positive emotional response in >80% of observed sessions
- No severity-1 usability bugs (user cannot complete a core task) in the final round

---

## SECTION 15: HANDOFF NOTES TO ENGINEERING

These are the UX decisions with direct engineering implications. Engineering should not interpret these as suggestions — they are specifications.

**1. Cycle phase calculation must run server-side with client-side fallback.**
The cycle phase shown on the daily log is the backbone of the contextual experience. If this fails (bad connection, API error), the app must show a graceful fallback — the log still opens, but without the phase header. Never show an error state on the daily log screen.

**2. Simple Mode activation is automatic, not user-triggered.**
On any day where the predicted severity score (based on rolling average of same-phase severity from previous cycles) exceeds 3.8 out of 5, the log defaults to Simple Mode (3 questions). This must be calculated before the log opens. The user should not see a mode transition — they should simply see a shorter log.

**3. The crisis modal has one implementation rule: it cannot be dismissed by accident.**
The fullscreen modal triggered by a severity-5 or severity-6 "overall distress" entry requires deliberate action to dismiss (tap outside modal does nothing; requires explicit "I'm okay, continue logging" tap). This is intentional and must not be simplified in engineering.

**4. The DRSP chart renders from raw log data, not a pre-computed summary.**
Every severity entry by day, by symptom category, must be stored as an individual record — not aggregated on log completion. The chart algorithm must have access to raw daily records to allow for recalculation when cycle dates are adjusted.

**5. The PDF report is generated on-device with a server fallback.**
For privacy: the PDF is assembled on the user's device from their local data. Server generation (for sharing/email features) is a secondary path and must be explicitly opt-in. The first "generate my report" action should be local only.

**6. Notification timing adapts to actual cycle data, not a fixed schedule.**
The notification system must access cycle phase data to determine notification copy and timing. This requires the notification worker to have read access to the current cycle state. A fixed "8pm reminder" is the fallback when no cycle data exists; the adaptive system activates from cycle day 14 onward.

**7. The logging experience must function fully offline.**
Core daily log completion, cycle calendar view, and local chart rendering must work without connectivity. Sync happens when connection restores. A user on a bad day in a doctor's office waiting room must be able to log.

**8. The onboarding "aha moment" screen (screen 7) requires a minimum data threshold.**
If the user has entered fewer than 2 symptom episodes in screens 1–6, the cycle overlay on screen 7 should not generate a pattern hypothesis — instead, it shows the blank cycle ring with "Start logging to see your pattern here." The system must not fabricate a pattern from insufficient data.

**9. The progress bar (days logged / days in cycle) must update in real time after log completion.**
Not on next app open. Not after a sync. Immediately, as a completion confirmation, the progress bar updates. This is the primary moment of "investment" reinforcement and must be instant.

**10. All health data must be encrypted at rest and in transit.**
AES-256 at rest. TLS 1.3 in transit. No health data in analytics event properties (log "log_completed" not "log_completed: PMDD severity 5 luteal day 22"). Analytics events must be scrubbed of PHI before dispatch.

---

## SECTION 16: ORA — UX DESIGN SYSTEM FOR THE AI COMPANION
*Added post-AI feature decision. Documents the full UX architecture for Ora, HormonaIQ's clinical intelligence layer.*

---

### The UX Problem Ora Solves

Our user interviews consistently surfaced one behavioral pattern: users understood their own data but couldn't articulate it. Sarah had built a manual DRSP chart in Google Sheets — she had the data, she saw the pattern, but she couldn't translate it into clinical language her doctor would respect. Preethi knew her pain was cyclical but couldn't connect the dots across systems (thyroid, endo, pain timing) without a framework.

Ora is the articulation layer. It doesn't add new data. It doesn't collect new information. It takes what she already logged and makes it speakable — in clinical language, in physician register, in the specific sentences that change outcomes in a 15-minute appointment.

**The UX principle this rests on:** The user is not the problem. The translation problem is the problem. Ora solves the translation problem.

---

### How Ora Enters the Product — UX Entry Points

Ora never announces itself. Ora surfaces what it has found. This is the most critical UX distinction in the entire feature.

**Wrong pattern (chatbot model):**
User opens app → sees "Chat with Ora" button → types a question → gets a response.
This pattern trains the user to think of Ora as a conversational AI. That's not what she needs and it's not what we are.

**Right pattern (instrument model):**
User opens app → sees her chart → a small O (the Ora mark) has appeared at the edge of the chart she hasn't seen before → she taps it → Ora's finding expands.
Ora came to her. Ora had something to show her. She didn't have to ask.

The instrument model has three advantages over the chatbot model:
1. It matches clinical reality (instruments report; doctors interpret)
2. It removes the friction of "knowing what to ask" — users with brain fog, in PMDD episodes, in crisis, don't have to formulate a question
3. It creates a discovery experience rather than a query experience, which has higher emotional impact

---

### The 6 Ora Features — UX Specification

#### Feature 1: Explain My Chart

**Entry point:** Proactive. When Ora has detected a pattern worth surfacing, the O mark appears on the chart adjacent to the relevant data point or phase range. User taps the O.

**What expands:** The Ora Card — a distinct content block visually differentiated from all other UI elements (see visual design spec). The card leads with a specific observation: "Your luteal phase severity averaged 4.8 across your last 3 cycles — 31% higher than your follicular baseline."

**Pre-populated follow-up prompts** (user can tap or type freely):
- "What does this pattern mean?"
- "How does this compare to last cycle?"
- "What should I tell my doctor about this?"

**What Ora never produces in response:**
- Diagnostic conclusions ("You have PMDD")
- Treatment recommendations ("You should try...")
- Certainty about the future ("You will feel better in...")

**UX safeguard:** All Ora responses pass through a guard model eval before display. Responses that contain diagnostic language are rewritten to observational language before the user ever sees them.

**Free tier:** 3 "Explain My Chart" queries per month. On query 4, the paywall appears — using Ora's own language to demonstrate what she's been getting and what she'd continue to get on Pro.

---

#### Feature 2: Prepare Me For My Appointment

**Entry point:** She has logged a doctor appointment in her calendar (or, in v2, we detect the intent from a symptom log tag "preparing for appointment"). Entry is also available from the main nav as "Appointment Prep."

**UX flow:**
1. She opens Appointment Prep
2. Ora pulls her data from the most recent 3 cycles (or all available cycles if fewer)
3. Single loading state: "Ora is preparing your summary." — static text, no animation, thin Mariana progress bar at top of screen
4. Ora Card expands with four sections:

**Section 1 — Clinical Summary (3 sentences max):**
*"Over [X] cycles, your DRSP scores show consistent elevation in the luteal phase, averaging [X] points above your follicular baseline. The pattern has been stable across [N] months of tracking. This documentation meets the temporal consistency criteria used to assess premenstrual disorders."*

**Section 2 — Language to Use:**
*"Tell your doctor: 'I've been tracking my premenstrual symptoms using the DRSP instrument for [N] months. My average luteal severity score is [X]. I'd like to understand whether this pattern warrants further evaluation.'"*

**Section 3 — Responses to Common Dismissals:**
- If they say "it's just PMS": *"The DSM-5 distinguishes PMDD from PMS by severity and functional impairment. My DRSP scores indicate severity levels that meet the PMDD threshold."*
- If they say "you're stressed": *"My data shows this pattern is consistent across [N] cycles, independent of my reported stress levels."*
- If they say "track it more": *"I have [N] months of daily DRSP data available for review."*

**Section 4 — The One Question:**
*"Ask your doctor: 'Based on this data, what is your assessment of whether I meet diagnostic criteria?'"* — The word "assessment" is deliberately chosen. It invites a clinical opinion, not a dismissal or a referral.

**Exportable:** The summary can be copied to clipboard, sent via email, or printed as a companion document to the DRSP PDF.

---

#### Feature 3: Why Is This Happening Right Now

**Entry point:** Proactive. When she opens the app during a predicted high-severity window and her logged severity for that day is above her average, Ora surfaces this automatically. No tap required — it appears in the home section as a contextualization card.

**What it shows:**
*"You're on day [22] of your cycle — day [5] of your luteal phase. Across your last [4] cycles, your severity during this phase averaged [4.3], with the highest days typically falling on days [21–24]. Today's logged severity ([4.7]) is consistent with your historical pattern for this point in your cycle."*

Then a single, non-optional disclosure:
*"If you're in crisis right now, the 988 Suicide and Crisis Lifeline is available 24/7."*

**What Ora never shows here:**
- Predictions with certainty ("This will last 3 more days")
- Generic population data ("Most women with PMDD...")
- Advice ("You should...")

The intervention logged section: if she has previously logged that something helped (e.g., "sleep >8 hours associated with lower next-day severity") — Ora surfaces it: *"In previous cycles, you noted that [sleep over 8 hours] was associated with lower severity on the following day."* This is her own data. Ora is reflecting her own insight back to her.

---

#### Feature 4: AI-Written Clinical Letter

**Entry point:** Settings > Ora > Generate Clinical Letter. Also surfaced after the 90-day threshold milestone ("Ora can now generate a clinical letter from your data").

**What it generates:** A physician-readable letter in formal clinical language. Dr. Amara Osei wrote the template. Every data point is sourced from her logged entries — no inference, no hallucination.

**Structure of the letter:**
1. Header: Date, "To Whom It May Concern / [Her Doctor's Name if entered]"
2. Paragraph 1: Instrument identification — *"I have been tracking my premenstrual symptoms using the Daily Record of Severity of Problems (DRSP), a validated clinical instrument..."*
3. Paragraph 2: Quantitative summary — cycle count, date range, average scores by phase, peak severity days
4. Paragraph 3: Temporal pattern — *"Symptoms consistently elevated in the 7–10 days preceding menstruation and resolved within 2–4 days of onset across [N] documented cycles..."*
5. Paragraph 4: Functional impact — if she logged functional impairment items, those are cited directly
6. Closing: *"This documentation is provided for clinical assessment purposes. I am available to answer questions and share the underlying data upon request."*

**Output:** PDF, formatted in the same clinical register as the DRSP chart — no consumer branding, physician-readable, printable.

**Minimum data requirement:** 90 days of logging (3 complete cycles). If she has fewer, Ora shows her progress: "Ora can generate your clinical letter in [X] more days of logging."

---

#### Feature 5: AI Pattern Discovery

**Entry point:** Not proactive until a new, non-obvious pattern is detected. When Ora identifies a correlation she hasn't surfaced before, the O mark appears in the Pattern section of the home screen.

**Threshold:** Minimum 4 cycles of data. Pearson correlation coefficient ≥0.6. Non-obvious (cycle phase itself is excluded — that's already shown in the chart).

**What Ora surfaces:**
- Sleep quality vs. next-day severity
- Logged stress level vs. symptom severity on the same day
- Medication dose timing vs. symptom severity delta
- Exercise tag vs. severity reduction
- Any custom logged field with sufficient variance and cycle count

**Language:**
*"Ora identified a pattern: on days when you logged sleep below 6 hours, your severity score the following day was [34%] higher than your average. This pattern appears across [4] cycles. You can log sleep quality here to continue tracking it."*

Always followed by: *"This pattern is based on [N] cycles of data. More cycles will confirm or adjust this observation."*

**What Ora never says:**
- "Lack of sleep is causing your symptoms."
- "You should sleep more."
- "This is why your PMDD is worse."

Correlation only. No causation language.

---

#### Feature 6: AI Crisis Contextualization

**When it activates:** Only in a new session, minimum 48 hours after any crisis-level log entry. Never during active logging. Never during a crisis modal session. Minimum 4 cycles of data required before feature activates.

**When Ora shows it:** During a non-crisis session, if the current cycle phase matches a historically high-severity phase. It surfaces as a soft card beneath the main home content — never intrusive, never mandatory.

**What it shows:**
*"Looking back at last cycle's day [22]: your logged severity that day was [5]. In the [4] cycles Ora has tracked for you, your highest-severity days have lasted between [2] and [5] days before resolving. This cycle's pattern is consistent with that range."*

**Always accompanied by:**
*"988 Suicide and Crisis Lifeline — call or text 988. Available 24/7."*

This is not crisis support. This is temporal context — the clinical evidence that the distress has been temporary before. It is never shown during distress. It is shown when she is stable enough to process it.

**UX principle:** Predictability reduces terror. The research is clear on this. Knowing that you have survived this level of distress in prior cycles reduces the sense of permanence that makes crisis states dangerous.

---

### Ora Onboarding — The First Introduction

She does not meet Ora at signup. She meets Ora at day 30 — the same day as the paywall. This is deliberate.

By day 30 she has:
- Logged enough data for a meaningful pattern to exist
- Completed her first DRSP chart (the vindication moment)
- Formed the logging habit

The Ora introduction happens immediately after the DRSP chart reveal:

**Screen: "Ora has read your chart."**

> *"Ora found something in your first cycle of data."*
> [O mark appears, expands to Ora Card]
> *"Your symptoms showed a consistent elevation in the [X] days before your period — averaging [X] points higher than your follicular baseline. This pattern has a name. Your doctor may recognize it."*

Button: "Ask Ora what this means" → First free Explain My Chart query

Button: "See full chart" → DRSP chart

This is the first time she experiences Ora. It is the most important UX moment in the entire product. The chart proved the pattern was real. Ora named it.

---

### Ora Trust Architecture — UX Layer

**Where "What does Ora use?" lives:** Accessible from the home screen. Not Settings > Account > Privacy > Advanced. Home screen. She should be able to answer "what does this thing see?" in under 2 taps.

**The transparency card:**
> *"Ora sees: your daily symptom scores, your cycle days, your logged sleep quality (if you track it), your logged stress level (if you track it), your logged medications (if you track them).*
> *Ora never sees: your name, your email, your location, your contacts, your photos, your calendar.*
> *Every Ora analysis is anonymized — your numbers travel without your identity."*

**The opt-out toggle:** Lives on the home screen as a persistent but non-intrusive element. Not a notification. Not a badge. A small "Ora: on / off" toggle adjacent to the main cycle data. She can disable Ora completely without losing any tracked data. When she does:

> *"Ora is paused. Your logs continue. Resume Ora any time."*

No guilt. No "are you sure?" confirmation. No explanation required from her. She pauses; Ora pauses. One tap.

**The deletion chain:** When she deletes data, Ora has nothing to work from. The deletion is upstream. She does not need to separately delete Ora's "memory" because Ora has no memory — it is stateless. Each session starts fresh from whatever data currently exists in her local database.

---

### Ora in High-Severity States — UX Safety

**Rule: Ora is offline during crisis.**

If the crisis protocol has been triggered (DRSP item 22 ≥ 3, or severe mood + hopelessness threshold), Ora does not run. No API call is made. No Ora Card appears. No O mark appears. The crisis modal is the only thing on screen.

Ora remains offline for 48 hours after any crisis-level log entry, even after the crisis session ends.

**Reason:** A user emerging from a severe PMDD episode or crisis state is not in a position to process clinical pattern data. The right experience in that window is: the tracker is still here, log when you can, no insights, no analysis. Just presence.

After 48 hours, if she opens the app and logs, Ora comes back online automatically. She doesn't have to turn it on. It resumes.

---

### Accessibility of Ora

**Plain language first:** Every Ora output passes a Flesch-Kincaid reading level target of grade 8 or below for the main insight sentence. The clinical letter is an exception — it is explicitly physician-addressed, not patient-addressed.

**No timed elements:** The Ora loading state (progress bar) has no time limit visible to the user. If the API call takes 8 seconds, the bar simply fills slowly. No timeout errors shown to user — if the call fails, the Ora Card shows: *"Ora wasn't able to reach your data right now. Try again in a moment."*

**One-tap access:** Every Ora feature is accessible in 1-2 taps from the home screen. No nested menus. No prerequisite flows.

**Simple Mode override:** When Simple Mode activates (predicted high-severity day), Ora's proactive surfacing is disabled. She is not shown pattern insights or contextual analysis when the UI is reduced to its minimum. Ora resumes when Simple Mode deactivates.

**Screen reader:** Every Ora Card has an accessible label structure. The O mark presence indicator has an accessibility label: "Ora has a new insight — double tap to view." No icon-only interactions.

---

### What We Do Not Build

| Rejected pattern | Why |
|---|---|
| Chat interface ("Chat with Ora") | Creates chatbot expectations we cannot fulfill |
| Persistent Ora sidebar | She didn't ask for a companion — she asked for clinical clarity |
| "Ora is thinking..." animated dots | Implies conversational AI, creates chatbot register |
| Ora push notifications | She gets enough push notifications. Ora surfaces on app open. |
| Ora "feedback" rating on insights | Turns Ora into a service-satisfaction interaction. Wrong register. |
| "Based on other users like you..." | We promised her data is hers. We do not use population data in Ora outputs. |

---

*Section 16 compiled April 2026. Cross-reference: product-brief.md Part 5, ai-feature-team-meeting.md, naming-debate.md, visual-design-team.md Section 16.*

---

## ONE-PAGE SUMMARY: 10 THINGS EVERY ENGINEER AND DESIGNER MUST KNOW

**Before you touch anything in HormonaIQ, internalize these ten things.**

**1. She has been dismissed by the medical system. Everything we build is evidence-building infrastructure.** The daily log is not a mood journal. The DRSP chart is a clinical instrument. Every design decision is evaluated by whether it produces better clinical evidence.

**2. The primary user metric is WASL — Weekly Active Symptom Loggers.** Not DAU. Not session length. Not notification open rate. WASL. A user who logs 5 times in a week and misses 2 is a successful user. Design for weekly rhythm, not daily perfection.

**3. The aha moment is at onboarding screen 7.** Every screen before it exists to reduce friction on the way to the aha. Every screen after it exists to deepen investment. If you are working on a screen and you don't know whether it's "before" or "after," ask.

**4. Simple Mode is automatic on predicted severe days.** This is not an accessibility feature. It is the core retention mechanic for the users most likely to churn — the ones having their worst days. Engineering: it must activate without user input. Design: it must look intentional, not broken.

**5. No streaks. No guilt. No "you missed a day."** The science on streak-based motivation in health contexts is clear: it produces high engagement and then catastrophic churn when the streak breaks. We celebrate presence. We ignore absence.

**6. The physician PDF is a separate design artifact from the patient-facing app.** It is designed for a doctor who has 90 seconds to scan it. Two pages. Clinical structure. Pattern summary on page one. If a doctor can't understand the key finding in 90 seconds, the PDF has failed.

**7. Privacy is a product feature, not a legal checkbox.** The privacy promise ("your data is yours, we don't sell it") appears in the hero section of the waitlist page, in onboarding, and in the PDF footer. It is a design element. Engineering: no PHI in analytics events, ever.

**8. The cycle calendar is the truth anchor.** Every other feature in the app — the log, the pattern library, the medication tracker, the doctor report — is organized around the cycle calendar. When a user is confused, the calendar is where she returns. It must always be accurate and always be legible.

**9. The crisis protocol is non-negotiable and has no friction.** Fullscreen modal, 988 line, no confirmation required to dismiss. If engineering finds a reason to simplify this, the answer is no. If design proposes a softer version, the answer is no. This is a life-safety feature.

**10. The paywall is at day 30. We must deliver value before that.** Day 7: first micro-insight. Day 14: progress indicator + commitment device. Day 21: countdown to chart. Day 28–35: DRSP chart reveal. The paywall converts because we have already changed her life before we ask for her credit card. Every feature that ships before day 30 is a conversion investment.

---

*Document maintained by Priya Anand (Head of Product). Last substantive update: April 25, 2026. Next scheduled review: Sprint 6 kickoff.*

*Distribution: Product, Design, Engineering leadership. Do not share externally.*
