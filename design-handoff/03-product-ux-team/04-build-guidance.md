# HormonaIQ — Complete Build Guidance
**For the whole team: Founder, Brand, Product, Design, Engineering, Research, Medical, Legal**  
Version 1.0 | April 2026

---

> This is not a timeline. It is a step-by-step guide on how to go forward — the full sequence every team follows, what to do, what to read, who to talk to, and what tells you a step is complete before moving on. Follow this in order. Skipping steps creates expensive rework later.

---

## HOW TO READ THIS GUIDE

Each step has:
- **Action** — exactly what to do
- **Who** — which team role leads it
- **Output** — what you produce (proof the step is done)
- **Research / Read** — what to learn before or during this step
- **Gate** — the question to answer YES before moving on

Steps in `[ GROUP ]` can be done in parallel. Steps in `— THEN —` must happen in sequence.

---

---

# PHASE 0 — KNOW BEFORE YOU BUILD
## Validate. Talk to real people. Fix the assumptions.

*You have research from Reddit, simulated interviews, and 30 personas. This is a foundation, not a validation. Real interviews with real strangers will either confirm everything or surprise you. Do this before any design work begins — changing a Figma screen is cheap, changing a wrong belief after you've built it is not.*

---

### STEP 0.1 — RECORD EVERYTHING YOU KNOW TODAY
**Action:** Open `product-brief.md` and the entire `docs/` folder. Read all of it as a founder. Write a single 1-page document: "What we believe is true about the user, the problem, and the solution — before any user has confirmed it." Label every claim as ASSUMED or VALIDATED. Assume = you read it on Reddit. Validated = a real human in a real conversation said it to you.

**Who:** Founder (you, Nilab)  
**Output:** `assumptions-map.md` — every belief in the product listed, labeled ASSUMED or VALIDATED  
**Research:** Read *The Mom Test* by Rob Fitzpatrick (one evening, 150 pages) — it will change how you run every user conversation  
**Gate:** You have a list. Every item is honestly labeled.

---

### STEP 0.2 — RECRUIT 15 REAL USER INTERVIEW PARTICIPANTS
**Action:** Go to r/PMDD, r/PCOS, r/Perimenopause, r/adhdwomen. Read the recruitment instructions in `research/user-interviews-template.md`. Send the 3-question screener as DMs to 40-50 people. You need 15 people who score 6+/10 on impact. Offer $25 Amazon gift card per completed interview. Book 30-minute video calls.

**Who:** Founder  
**Output:** 15 calendar invites confirmed  
**Research:** Re-read the screener in `research/user-interviews-template.md`. Know every question before the first call.  
**Gate:** 15 interviews scheduled (not 10, not "almost 15" — 15 minimum).

---

### STEP 0.3 — CONDUCT 15 REAL USER INTERVIEWS
**Action:** Run all 15 interviews using the guide in `research/user-interviews-template.md`. Record every call (with permission). Take notes in the raw notes section of the template. After every 5 interviews, fill in the Synthesis Template. What you are validating:
- Is medical gaslighting real and universal? (target: 12/15 mention it)
- Are existing apps the wrong tone? (target: 11/15 mention it unprompted)
- Willingness to pay $10+/month? (target: 10/15 confirm)
- ADHD-hormone overlap is a real pain point? (target: 6/15 bring it up)
- Privacy is a real concern? (target: 8/15 mention Flo or data)

**Who:** Founder  
**Output:** `research/real-interviews.md` — 15 completed interview logs + synthesis  
**Research / Doctors:** During interviews, ask: "Have you ever seen a specialist for this? What did they say? What did they wish the doctor knew?" — this is clinical intelligence you cannot get from papers.  
**Gate:** 15 interviews done. Synthesis written. At least 3 surprises noted (things Reddit didn't tell you).

---

### STEP 0.4 — MEDICAL CONSULTATION: TALK TO A SPECIALIST
**Action:** Find ONE of the following and have a 60-minute consultation:
- A gynecologist who specializes in PMDD or PCOS (search the IAPMD provider directory at iapmd.org)
- A reproductive psychiatrist (deals with PMDD and ADHD-hormone interaction)
- A menopause specialist (NAMS-certified — the North American Menopause Society has a directory at menopause.org/find-a-provider)

Ask these specific questions:
1. Is the DRSP the right instrument for daily tracking? Any newer alternatives?
2. What is the one thing patients most get wrong about their own cycle data?
3. What would make a physician report actually useful — what format, what data?
4. What clinical claims should we NEVER make in an app?
5. Is there a medico-legal issue with an AI companion giving information about PMDD?
6. What's missing in every period app you've seen?

If you cannot afford a consultation: email. IAPMD has patient advocates. Menopause specialists often reply to founder emails. Or: find their published papers, read those, and email them with a specific question about a finding.

**Who:** Founder  
**Output:** A 1-page notes doc: `research/medical-consultation-notes.md` — exact answers to all 6 questions  
**Research — books to read before this consultation:**
- *In the Flo* — Alisa Vitti (cycle-syncing, practical hormone education)
- *The Period Repair Manual* — Lara Briden (clinical, practitioner-written, evidence-based)
- *The Menopause Brain* — Lisa Mosconi (perimenopause neuroscience, very accessible)
- DRSP instrument documentation — freely available from UCSF's PMDD research group
**Gate:** You can answer: "What does a doctor actually need from our physician report to act on it?" with a specific answer.

---

### STEP 0.5 — LEGAL AND PRIVACY FOUNDATION
**Action:** Answer these 3 legal questions before writing a single line of code:

1. **Company formation:** Register as an LLC or C-Corp (C-Corp if you plan to raise funding; YC prefers Delaware C-Corp). This is a $500-$1,500 step through Stripe Atlas, Clerky, or a local attorney. Do not skip this — you cannot take investor money or sign contracts without a legal entity.

2. **HIPAA review:** HormonaIQ is NOT a covered entity under HIPAA unless you are processing insurance claims or partnering with healthcare providers. However, health data is still regulated. Research: FTC Health Breach Notification Rule (this is what fined Flo, not HIPAA). Understand what you can and cannot do with user health data. Read: *HIPAA for Developers* on the Aptible blog (free, excellent, 1 hour).

3. **Post-Roe data liability:** Read the Electronic Frontier Foundation's guide on reproductive health data and law enforcement. Understand: which states have laws restricting reproductive health data disclosure, what your government request policy must say, and why zero-knowledge local encryption is not optional for this app.

**Who:** Founder + a startup lawyer (1 hour consultation, ~$300)  
**Output:** `legal/privacy-architecture-decision.md` — 3 decisions documented: entity type chosen, HIPAA applicability confirmed, data storage architecture committed  
**Research:** Aptible blog "HIPAA for Startups" series, EFF Surveillance Self-Defense guide for reproductive health apps  
**Gate:** You have a legal entity. You know exactly what data you can and cannot store server-side.

---

### STEP 0.6 — UPDATE THE ASSUMPTIONS MAP
**Action:** Return to `assumptions-map.md` from Step 0.1. For every item, mark: CONFIRMED (interview confirmed it), WRONG (interviews contradicted it), or STILL UNKNOWN. For every WRONG item: update the product brief, personas, or feature list accordingly. Wrong assumptions found here are gifts — finding them after you build costs 10x more.

**Who:** Founder  
**Output:** Updated `assumptions-map.md` + any changes to `docs/features.md` or `docs/ora-persona.md` driven by new findings  
**Gate:** You can say: "I talked to 15 real people and a doctor. Here are the 3 things I thought were true that turned out to be different."

---

---

# PHASE 1 — BRAND FOUNDATION
## Build the identity before you build the product.

*The logo, the colors, and the name all need to be locked before design begins. Changing the logo after you have 40 Figma screens means redoing 40 screens.*

---

### STEP 1.1 — FINALIZE THE NAME: HORMONAIQ
**Action:** Confirm the name is available:
1. Check trademark: USPTO TESS database (tess2.uspto.gov) — search "HormonaIQ" and close variants
2. Check domain: Is hormonaiq.com available? If not, what variants? (.io, .app, .health)
3. Check App Store: Search "HormonaIQ" in the iOS App Store and Google Play
4. Check Instagram / TikTok / Twitter: Is @hormonaiq available?

If the name is clear: lock it. Buy the domain. Register the social handles immediately (free, takes 10 minutes, do it today).

**Who:** Founder  
**Output:** Domain purchased, social handles registered, trademark search results documented  
**Gate:** Name is confirmed available across all channels. You own the domain.

---

### STEP 1.2 — LOGO DESIGN
**Action:** You have three logo directions from `docs/brand-and-ux.md`:
- **Option A — Crescent Wave:** Lowercase "h" with a crescent cut; the h-wave suggests cycle, breath, the female silhouette
- **Option B — Leaf Loop:** An infinity loop made of two organic leaves
- **Option C — Overlapping Phases:** Three overlapping soft circles representing phases

To design the logo, you have three paths:
1. **DIY with Figma or Canva** (free, slow, lower quality)
2. **Hire a freelancer** — use Contra.com or Dribbble Hiring. Budget: $300-$700 for a brand identity package (logo + color + typography)
3. **Use an AI design tool** — Looka.com or Brandmark.io will generate options based on keywords (fast, $65, starting point only)

Recommended approach: Use Looka or Brandmark for rough concepts ($65), then hire a freelancer on Contra to refine the best direction ($300). Total: ~$365, 1 week.

What the logo must do (from brand-and-ux.md):
- Work in 1 color (for embossing, small size)
- Work at 32px (app icon) and 300px (splash screen)
- Not look like a medical cross or fertility symbol
- Not be pink
- Feel like an Apple-quality premium product

**Who:** Brand designer (freelancer) + Founder  
**Output:** Final logo in SVG and PNG: primary (full color), secondary (1-color), icon-only variant, dark mode variant  
**Research:** Before briefing the designer, read: *Logo Design Love* by David Airey (2 hours, will make you a better brief-writer) OR just study 20 logos you love and write down what they have in common  
**Gate:** Logo renders correctly at 32px and 300px. Works in 1-color. Does not look like any existing health app.

---

### STEP 1.3 — FINALIZE DESIGN TOKENS
**Action:** The design tokens YAML file (`docs/design-tokens.yaml`) is complete. Now import it into Figma as a real token library:
1. Install the Figma Tokens plugin (free)
2. Import `design-tokens.yaml` as a token set
3. Verify all phase colors render correctly in the Figma canvas
4. Add the finalized logo colors to the token file if they differ from current values
5. Share the Figma file with the developer so they can use the Style Dictionary export later

**Who:** Designer (you or a freelancer)  
**Output:** Figma file with all tokens imported, named, and working  
**Gate:** All colors, fonts, spacing, and radius values are in Figma and can be applied with one click.

---

### STEP 1.4 — RECORD THE BRAND VOICE REFERENCE DECK
**Action:** Create a 10-slide internal reference deck (can be in Figma or Google Slides) that captures:
- Slide 1: Ora's voice in 3 words
- Slide 2: Before/After copy examples (5 pairs from `docs/copy-guidelines.md`)
- Slide 3: The "never say" list (from `docs/ora-persona.md`)
- Slide 4: Phase tone examples (Day 1, 8, 18, 23, 28)
- Slide 5: The 3 logo directions with rationale for chosen direction
- Slide 6: Full color palette with phase mapping
- Slide 7: Typography specimens (headers, body, caption)
- Slide 8: Example Ora conversation screenshot mockup
- Slide 9: What HormonaIQ is NOT (anti-mood board)
- Slide 10: The one sentence every team member must be able to say

This deck is used to onboard any new team member, any freelancer, any investor in under 20 minutes.

**Who:** Founder + Brand lead  
**Output:** Brand reference deck (10 slides) shared to Figma or Google Drive  
**Gate:** Any person who reads this deck can correctly identify whether a design, copy, or feature decision is "on brand" without asking you.

---

---

# PHASE 2 — PRODUCT DESIGN
## Design every screen before writing any code.

*The most expensive thing you can do is build a screen that turns out to be wrong. Figma is free. Redoing a Figma frame takes 20 minutes. Redoing a coded screen takes 2 days.*

---

### STEP 2.1 — INFORMATION ARCHITECTURE: MAP ALL SCREENS
**Action:** Before designing anything, map every screen in the app as a list. Start from `docs/brand-and-ux.md` navigation architecture (Today / Cycle / Log / Insights / You) and expand to every sub-screen, modal, and state.

Format (just a list, no design yet):
```
TODAY HUB
  - Home screen (per-phase variant × 5)
  - Ora chat thread
  - Today's log shortcut

LOG FLOW
  - Step 1: Mood
  - Step 2: Physical symptoms
  - Step 3: Cognitive slider
  - Step 4: Voice note (optional)
  - Step 5: Confirmation

CYCLE CALENDAR
  - Ring view (current month)
  - Past month comparison
  - Phase detail overlay
  ...etc
```

**Who:** Product (you) + Designer  
**Output:** `design/screen-map.md` — complete list of every screen  
**Research:** Study how Oura Ring, Apple Health, and Clue (despite its flaws) structure their information architecture. Not to copy — to understand what works and what to avoid.  
**Gate:** You can count the exact number of screens in the MVP. Target: under 25. More than 35 screens in v1 is scope creep.

---

### STEP 2.2 — WIREFRAMES (LOW-FIDELITY, ALL SCREENS)
**Action:** Sketch every screen as a low-fidelity wireframe — no colors, no fonts, just boxes and labels. Use Figma with gray rectangles. The goal is: does the layout make sense? Is the flow logical? Can someone who has never seen the app figure out where to tap?

Do the log flow wireframe first — it is the most used flow. Then the home screen. Then Ora chat. Then calendar.

Test each wireframe yourself: go through the flow as if you are a user in PMDD peak (slow, foggy, low patience). If any screen requires reading more than 2 sentences before knowing what to do — redesign it.

**Who:** Designer (you or freelancer)  
**Output:** Figma file with wireframes for all MVP screens  
**Research:** Read *Hooked* by Nir Eyal — not for dark patterns, but for understanding how habit-forming flows work. Then read the critique of it in *Indistractable* by the same author. The product must earn daily use, not manipulate for it.  
**Gate:** Someone who doesn't know the product can navigate the wireframes and find the log button within 5 seconds.

---

### STEP 2.3 — USER TESTING ON WIREFRAMES
**Action:** Take the wireframes and test them on 5 real people from your interview pool (the people from Step 0.3 who wanted to be beta testers). Do not explain anything. Say: "I'm going to show you a prototype. Can you try to log how you're feeling today?" Watch what they do. Do not help. Note every moment of confusion.

This is not about showing a beautiful design — wireframes are meant to be ugly. It's about finding broken flows before you invest in high-fidelity design.

**Who:** Founder + User research  
**Output:** Notes from 5 sessions, list of 3-5 flows that need redesign  
**Gate:** Users can complete the log flow without help. If they can't — redesign and retest before moving on.

---

### STEP 2.4 — HIGH-FIDELITY DESIGN: ALL MVP SCREENS
**Action:** Apply the design tokens and brand to the wireframes. Design every MVP screen in full color, correct typography, real icons, real copy (use `docs/copy-guidelines.md` for all text).

Priority order:
1. Home screen (Today Hub) — this is the face of the app
2. Log flow (5 steps) — most used feature
3. Ora chat interface — most emotionally important feature
4. Cycle calendar — the insight layer
5. Onboarding (first launch, 5 screens)
6. Settings / Profile
7. Physician report view
8. Ora insight card variants (per phase)

For each screen, design 3 states:
- Empty state (new user, no data)
- Populated state (user has 3 months of data)
- Error state (no connection, data sync issue)

**Who:** Designer  
**Output:** Figma file with all MVP screens in high fidelity, all 3 states  
**Research:** Study Apple's Human Interface Guidelines (HIG) — free at developer.apple.com/design/human-interface-guidelines. This is the standard your iOS screens will be judged against. Read the sections on: Typography, Color, Navigation, Inputs.  
**Gate:** Figma prototype is fully clickable through the core user journey (onboarding → home → log → see result → Ora responds).

---

### STEP 2.5 — ORA CONVERSATION DESIGN
**Action:** Before building the AI backend, design Ora's conversations as static Figma prototypes. For each of the 9 scenarios in `docs/ora-persona.md`, design what the chat interface looks like. What is the bubble style, the timestamp, the typing indicator, the "Ora is thinking" state?

Then write the system prompt for Ora. The system prompt is the set of instructions you give the LLM that defines who Ora is. Using `docs/ora-persona.md` as the source, write:
- Who Ora is (identity paragraph)
- What she never says (prohibited phrases)
- Phase context injection format (how the current phase data gets passed to her)
- Crisis detection rules (when to escalate to resources)
- Chit-chat permissions

**Who:** Product + AI Engineer  
**Output:** `design/ora-system-prompt-v1.md` — the full LLM system prompt, plus Figma mockup of the chat interface  
**Research:** 
- Read Anthropic's prompt engineering guide (free, at docs.anthropic.com) — this app likely uses Claude as the underlying LLM
- Read OpenAI's safety guidelines for mental health applications
- Read the AFSP (American Foundation for Suicide Prevention) safe messaging guidelines — free at afsp.org/safe-messaging
**Gate:** The system prompt tested manually against Claude produces responses that match Ora's persona in all 9 test scenarios from `docs/ora-persona.md`.

---

---

# PHASE 3 — TECH FOUNDATION
## Decide the stack. Set it up. Don't overthink it.

*The fastest path is a proven stack used by people who have shipped similar apps. This is not the place for experimentation. Pick boring technology that thousands of developers know, has good documentation, and gets the app in the App Store.*

---

### STEP 3.1 — CHOOSE THE TECH STACK
**Action:** Make this decision once and commit. Here is the recommended stack for a 1-2 person team building a health app:

**Frontend (mobile):**
- **React Native (Expo)** — recommended. One codebase for iOS and Android. Expo handles the hard parts. Largest community. Best third-party library support. 
- Alternative: Flutter — if you have a Flutter-experienced developer, use it. Similar tradeoffs.
- NOT recommended for v1: Native iOS/Android (double the codebase, double the work)

**Backend:**
- **Supabase** — recommended. Postgres database, authentication, storage, edge functions. Open-source. HIPAA-eligible (with Business plan + BAA). Very fast to set up.
- Alternative: Firebase — fine, but more Google lock-in, less SQL-friendly for health data queries.

**AI / Ora:**
- **Anthropic Claude API (claude-sonnet-4-6)** — recommended. Best-in-class for nuanced conversation, safety, and instruction-following. Exact model ID: `claude-sonnet-4-6`.
- Alternative: OpenAI GPT-4o — also good, slightly different personality, similar cost.

**Payments:**
- **RevenueCat** — industry standard for mobile subscription management (App Store + Play Store). Free up to $2.5K MRR.

**Analytics (privacy-first):**
- **PostHog** — open-source, self-hostable, GDPR-compliant. No advertising SDK. This is the only analytics you are allowed to use given the health data sensitivity.
- NOT: Firebase Analytics, Amplitude, Mixpanel — these all have data-sharing implications incompatible with the privacy architecture.

**Who:** CTO / Lead Developer  
**Output:** `tech/stack-decision.md` — stack documented with rationale for each choice  
**Research:** Read the Expo documentation (expo.dev/docs) — specifically the sections on EAS Build (the tool that compiles your app for App Store submission) and Expo Router (for navigation). This takes 2-3 hours. Do it before writing a line of code.  
**Gate:** Stack decision committed. Developer can set up a running "Hello World" in the chosen stack within 1 hour.

---

### STEP 3.2 — DEVELOPMENT ENVIRONMENT SETUP
**Action:** Set up the full development pipeline:
1. Monorepo (recommend Turborepo if you have web + mobile)
2. React Native / Expo project initialized
3. Supabase project created, database schema started
4. Environment variables managed (never commit secrets — use .env.local)
5. Git repository (GitHub) with branch protection on main
6. Basic CI: run lints and tests on every PR (GitHub Actions, free)
7. Expo EAS account set up (needed for App Store builds)

**Who:** Developer  
**Output:** Repository on GitHub with: working dev environment, connected to Supabase, CI passing  
**Gate:** Two developers (if applicable) can independently clone the repo, run it, and see the app on their phone using Expo Go within 20 minutes.

---

### STEP 3.3 — DATA ARCHITECTURE AND PRIVACY IMPLEMENTATION
**Action:** Design and implement the database schema with privacy first. Every table design must answer: "Who can see this data, under what conditions?"

Core tables (minimum):
- `users` — id, created_at, account_type (anonymous / email), consent_version
- `cycles` — user_id, cycle_start, cycle_length, method (tracked / predicted)
- `daily_logs` — user_id, date, mood (1-5), symptoms (JSON array), brain_fog (1-5), voice_note_exists (bool), phase_at_log
- `ora_conversations` — user_id, message_id, role (user/ora), content (encrypted), phase_at_message, timestamp
- `conditions` — user_id, condition_type (PMDD/PCOS/perimenopause/ADHD), diagnosis_status, onboarding_date

Privacy implementation:
- Ora conversation content: encrypted at rest (Supabase column-level encryption or application-level before storage)
- No user email required for core functionality — support anonymous accounts
- Data export endpoint: user can download all their data as JSON (GDPR-required)
- Data deletion endpoint: user can delete all data (GDPR-required, also good trust-building)

**Who:** Developer + Privacy lead  
**Output:** `tech/database-schema.sql` — documented schema with privacy annotations  
**Research:** Read the Supabase Row Level Security documentation — this is how you ensure users can only see their own data, even if there's a bug. Read it. Implement it. Test it.  
**Gate:** No user can query another user's data under any conditions. Verified by running a test with two test accounts.

---

---

# PHASE 4 — MVP BUILD
## Build the 10 features from `docs/features.md`. In this exact order.

*Build the log before the calendar. Build the calendar before insights. The intelligence layer only works if data exists. Build data-capture first, intelligence second.*

---

### STEP 4.1 — BUILD: ONBOARDING FLOW
**Action:** The first experience a user has. 5 screens:
1. Welcome — name + "What brings you here?" (4 condition options, multi-select)
2. Cycle input — last period date + average cycle length
3. Condition details — one screen per selected condition (PMDD symptoms, PCOS details, etc.)
4. Privacy promise — explicit, clear, not legal-speak: "Your health data stays on your device by default. We never sell it."
5. Meet Ora — brief intro to the companion, no feature tour

Every screen: one question per screen, large tap targets, skip option always visible.

**Who:** Developer + Designer  
**Output:** Working onboarding flow on device, all 5 screens, all 3 states (empty/filled/error)  
**Gate:** 3 users (from beta pool) complete onboarding without help in under 3 minutes.

---

### STEP 4.2 — BUILD: 30-SECOND LOG FLOW
**Action:** The single most important feature. Build it first among the core features. Spec in `docs/features.md` Feature 2. Key constraints:
- Floating action button accessible from every screen
- 5 steps completable without scrolling on 390px viewport
- Voice note uses native device microphone (no third-party audio SDK)
- Log editable for 24 hours after submission
- Confirmation message is phase-aware (requires phase detection to be working)

**Who:** Developer  
**Output:** Log flow working end-to-end, data persisting to Supabase  
**Gate:** You can log 7 days of data in a row in under 5 minutes total.

---

### STEP 4.3 — BUILD: CYCLE CALENDAR
**Action:** Ring view calendar showing current phase, past phases, and symptom density. Spec in `docs/features.md` Feature 3. The calendar is a visualization layer on top of the cycle data — it does not generate data, it displays it. Build after the log because it needs logged data to show anything meaningful.

Critical: the calendar must work gracefully for PCOS users with irregular cycles. Do not assume 28-day cycles. Do not crash if cycle length is unknown.

**Who:** Developer  
**Output:** Calendar screen showing current cycle with phase coloring, past 3 months visible  
**Gate:** Calendar displays correctly for: regular 28-day user, PCOS user with 45-day cycle, perimenopause user with 2 cycles logged and 1 missed.

---

### STEP 4.4 — BUILD: PHASE-AWARE HOME SCREEN
**Action:** The Today Hub. What the user sees every morning. Spec in `docs/features.md` Feature 1. This screen must:
- Detect the user's current phase
- Display phase-appropriate microcopy (from `docs/copy-guidelines.md`)
- Apply phase color palette (from `docs/design-tokens.yaml`)
- Show one contextual nudge
- Show a single "How are you feeling?" entry point

**Who:** Developer + Designer  
**Output:** Home screen adapting across all 5 phases, verified with test data for each phase  
**Gate:** Set test data to each of the 5 phases. Home screen looks and reads correctly for all 5.

---

### STEP 4.5 — BUILD: ORA CHAT INTERFACE
**Action:** The conversational companion. Two components:
1. The chat UI (messages, Ora typing indicator, input field, voice input option)
2. The Ora AI backend (API call to Claude with system prompt + conversation history + phase context)

Ora's system prompt must include:
- The identity and persona from `docs/ora-persona.md`
- The user's current phase (injected dynamically)
- The user's condition(s) (from onboarding)
- The last 5 log entries (summary)
- The crisis detection instruction

Build the UI first, wire it to a static response. Then add the AI API call. Then add phase context injection. Then test crisis scenarios.

**Who:** Developer (full-stack)  
**Output:** Working Ora chat that responds in her correct persona, aware of phase context  
**Research:** Study Anthropic's API documentation for: streaming responses (makes Ora feel real-time), context window management (conversation history can get long), tool use (may be needed for phase data injection)  
**Gate:** Run all 9 scenarios from `docs/ora-persona.md` Part 6. Ora's response must pass the persona check in every scenario. Especially test the PMDD peak scenario and the crisis scenario.

---

### STEP 4.6 — BUILD: SYMPTOM PATTERN INSIGHTS
**Action:** After a user has 4+ weeks of data, the app surfaces pattern insights. Spec in `docs/features.md` Feature 5. Basic version:
- "Your symptoms peak around day X in your cycle"
- "Your brain fog is highest in the luteal phase — it's been there for 3 cycles"
- "Your sleep quality drops before your period — here's the pattern"

These are generated as templated strings initially (not AI-generated), pulling from actual logged data. Upgrade to AI-generated insights in Phase 2 of the app.

**Who:** Developer + Product  
**Output:** Insights screen showing 3-5 pattern insights based on real logged data  
**Gate:** With 4 weeks of logged test data, the screen shows at least 3 accurate, specific insights (not "you have good days and bad days" — real pattern data).

---

### STEP 4.7 — BUILD: PHYSICIAN REPORT GENERATOR
**Action:** A PDF export that the user can share with their doctor. The most powerful feature in terms of clinical utility. Contents:
- DRSP scores for the last 2 cycles (formatted as the clinical instrument, not a custom format)
- Symptom pattern summary
- Phase-correlated mood data
- List of conditions the user is managing
- Patient note field (user writes what they want the doctor to know)
- Privacy note: "This report was generated by HormonaIQ. Data entered by patient."

**Who:** Developer  
**Output:** PDF that generates correctly on device and can be shared via iOS/Android share sheet  
**Research — Consult a doctor:** Before finalizing the report format, email the IAPMD or the specialist from Step 0.4 and ask: "Here is a draft physician report format. Is there anything clinically incorrect? What would you add or remove?" This is the most important medical validation step for the feature set.  
**Gate:** A real doctor (even a GP) looks at the report and says "I would read this in a patient appointment."

---

### STEP 4.8 — BUILD: DRSP TRACKER
**Action:** The Daily Record of Severity of Problems — the DSM-5 gold standard PMDD instrument. 24 items, rated 1-6 daily. Must be implemented exactly as the clinical instrument specifies. Spec in `docs/feature-research.md` clinical features section.

The DRSP is the instrument that CONFIRMS or RULES OUT PMDD. This is a clinical differentiator from every competitor. It is the feature that converts the physician report from "an app export" to "a clinical document."

**Who:** Developer + Medical consultant  
**Output:** DRSP module that produces a filled instrument in the physician report format  
**Research:** Download the actual DRSP instrument from UCSF or find the Endicott 1999 paper that defines it. Implement it exactly. Do not invent your own version.  
**Gate:** The DRSP output in the physician report matches the format a PMDD specialist would expect to see.

---

### STEP 4.9 — BUILD: NOTIFICATION SYSTEM (PHASE-AWARE)
**Action:** Notifications must be:
- Off by default (ask permission, do not assume)
- Phase-aware (different frequency and tone per phase)
- Never pushy during PMDD peak (max 1 per day, gentle copy only)
- Based on real events (not scheduled marketing pings)

Notification types:
- "Time to log" (if user logs daily but missed today — send after 6pm)
- "Ora noticed something" (when pattern insight is ready)
- "Phase shift" (when phase changes — optional, user-controlled)
- NO "streak reminder" — this punishes the worst days

**Who:** Developer  
**Output:** Notification system with phase-aware scheduling, user controls in Settings  
**Gate:** During simulated PMDD peak (test data Day 23-28), only 1 notification is sent per day maximum.

---

### STEP 4.10 — BUILD: ONBOARDING CONDITION MODULES
**Action:** At onboarding, users select their condition(s). Each condition activates a module that customizes the experience:
- PMDD: activates DRSP, luteal symptom chips pre-selected, PMDD-specific Ora knowledge
- PCOS: activates irregular cycle support, PCOS symptom chips, GI and metabolic symptoms
- Perimenopause: activates Greene Climacteric Scale, brain fog module, hot flash logging
- ADHD + Hormones: activates ADHD medication tracker, cognitive symptom emphasis

The modules are not separate apps — they adjust which features are foregrounded, which symptom chips appear, and what Ora knows about this user's primary concern.

**Who:** Developer + Product  
**Output:** 4 condition modules working, each producing a meaningfully different experience  
**Gate:** A PCOS user and a PMDD user have a noticeably different home screen, log flow, and Ora conversation — not just a label change.

---

---

# PHASE 5 — BETA TESTING
## Get real users on the real app before launch.

---

### STEP 5.1 — RECRUIT 20 BETA TESTERS
**Action:** From the 15 interview participants (Step 0.3), invite the ones who said "yes, I'd test this." Supplement with 5-10 more recruited from the same Reddit communities. Target mix:
- 6 PMDD (severe, clinically diagnosed or strongly suspected)
- 4 PCOS
- 4 perimenopause
- 3 ADHD + hormones
- 3 multiple conditions

**Who:** Founder  
**Output:** 20 beta testers onboarded, TestFlight (iOS) and Google Play beta links sent  
**Gate:** 20 people have the app on their phone and have completed onboarding.

---

### STEP 5.2 — OBSERVE THE BETA (2 FULL CYCLES)
**Action:** Run the beta for 2 complete menstrual cycles (8-12 weeks for most users, longer for PCOS). During this time:
- Check PostHog analytics weekly: which features are used, which are ignored
- Do 3 check-in calls (weeks 2, 5, 8) with 5 beta testers each
- Read every bug report
- Read every piece of feedback in the beta testing channel (set up a Discord or Slack for beta testers)

What you are watching for:
- Does anyone use Ora more than 3x/week? (sign of genuine companion behavior)
- Does the log flow actually happen daily or drop off?
- What is the Day 7 retention rate? (If < 40%, the product has a hook problem)
- Does anyone cry reading their physician report? (This happened in user interviews with analogous products — it is a signal of emotional resonance)

**Who:** Founder + Product  
**Output:** `research/beta-report.md` — observations from 2 cycles of real use  
**Gate:** Day 30 retention is over 35%. At least 5 users have used Ora in a genuine emotional conversation (not just "test message").

---

### STEP 5.3 — FIX CRITICAL ISSUES
**Action:** From the beta observations, fix everything in Category 1 (crashes, wrong data, broken flows, Ora giving a response that violates persona rules) before launch. Defer Category 2 (nice-to-haves, feature requests, UI preferences) to the first post-launch update.

Category 1 issues must be fixed before launch. No exceptions.
Category 2 goes into `docs/features.md` M2-M3 section.

**Who:** Developer + Product  
**Output:** Updated app version with all Category 1 issues resolved, re-tested with 5 beta testers  
**Gate:** Zero crashes in 3 consecutive days of testing. Ora passes all 9 scenario tests in `docs/ora-persona.md` with current system prompt.

---

---

# PHASE 6 — PAYMENTS AND FIRST REVENUE
## Get paid before you launch publicly.

*The goal is to have paying customers before the App Store launch. Not "users who said they'd pay." People who gave you a card number.*

---

### STEP 6.1 — IMPLEMENT REVENUECAT
**Action:** Integrate RevenueCat for subscription management. Set up:
- Monthly plan: $14.99/month (center of gravity from `research/simulated-interviews.md`)
- Annual plan: $99/year (~$8.25/month — standard 45% discount)
- Free tier: limited features (cycle calendar + basic log, no Ora, no physician report, no insights)

RevenueCat handles App Store and Play Store billing validation automatically. This is not a web payment — mobile subscriptions are processed through the App Store/Play Store, which take a 15-30% cut (15% for small developers).

**Who:** Developer  
**Output:** Paywall screen in app, RevenueCat integrated, both subscription plans purchasable  
**Gate:** A real subscription purchase completes end-to-end in the Sandbox testing environment.

---

### STEP 6.2 — CONVERT BETA TESTERS TO PAID
**Action:** Before any public launch, go back to your 20 beta testers and ask them to pay. Send a personal message (not a mass email):

> "You've been using HormonaIQ for [X] weeks. I wanted to ask you first, before we launch publicly: would you be willing to subscribe? The plan is $14.99/month. I'd love to have you as one of our first real customers — and I'd give you 3 months free to start."

Track how many say yes. If fewer than 8/20 say yes: you have a pricing or value problem. Do not launch publicly until you understand why.

**Who:** Founder  
**Output:** First paying customers (target: 8-12 out of 20 beta testers)  
**Gate:** At least 8 paying customers exist before public launch. You have spoken to the ones who said no and understand their reason.

---

---

# PHASE 7 — APP STORE LAUNCH
## The technical and marketing launch.

---

### STEP 7.1 — APP STORE SUBMISSION (iOS)
**Action:** Prepare the App Store listing:
- App name: HormonaIQ
- Subtitle: "Your cycle, understood" (30 char max)
- Description: written from `docs/copy-guidelines.md` voice — honest, not wellness-speak
- Screenshots: 6 screens, showing Today Hub, Log Flow, Ora chat, Physician Report, Cycle Calendar — all with real (simulated) data, not empty states
- Keywords: PMDD tracker, PCOS app, perimenopause, hormone health, cycle companion, DRSP
- Privacy policy URL: Required. Must be live on your website.
- Category: Health & Fitness
- Content rating: 17+ (due to discussions of suicidal ideation in PMDD context — Apple requires this)
- Review notes: Explain to Apple reviewer what PMDD is and why the 17+ rating is appropriate

Build using Expo EAS: `eas build --platform ios`  
Submit using `eas submit --platform ios`

**Who:** Developer + Founder  
**Output:** App submitted to App Store Review (typically 1-3 day review time)  
**Gate:** App approved and live on App Store.

---

### STEP 7.2 — APP STORE SUBMISSION (ANDROID / PLAY STORE)
**Action:** Same content as iOS. Android Play Store review is faster (typically 24-48 hours). Differences:
- Android screenshots need different dimensions
- Play Store health apps may require declaration of whether the app is a medical device (answer: no — HormonaIQ is a wellness/tracking app, not a medical device)
- Data safety form: fill out accurately — what data is collected, whether it's shared, how it's secured

Build: `eas build --platform android`  
Submit: `eas submit --platform android`

**Who:** Developer  
**Output:** App live on Google Play Store  
**Gate:** App live and downloadable on both stores.

---

### STEP 7.3 — LAUNCH MARKETING — COMMUNITY FIRST
**Action:** The launch strategy is community-led, not paid ads. In order:

1. **Post in r/PMDD** — personal post from you as the founder. Not a product launch. Your story: "I built this because..." Tell your actual story. Link to the app. Follow subreddit rules — some require mod approval for app promotions.

2. **Post in r/PCOS, r/Perimenopause, r/adhdwomen** — same authentic post, slightly adapted for each community. Space them out by 48 hours.

3. **Twitter/X post** — write the full story of why you built this. Tag the PMDD/PCOS community accounts. Use hashtags: #PMDD #PCOS #Perimenopause #WomensHealth #HormonaIQ

4. **Product Hunt launch** — schedule for a Tuesday. Write a 5-sentence maker comment explaining the problem. Ask beta testers to upvote. Target: top 10 of the day.

5. **Email the people who said "yes" in user interviews** — personal email, not a newsletter. Tell them it's live.

**Who:** Founder  
**Output:** App posts live in 5 communities, Product Hunt page live  
**Gate:** 100 downloads in first 72 hours. If not: read the comments to find out why.

---

---

# PHASE 8 — POST-LAUNCH ITERATION
## The most important phase. This is where you learn what the product actually is.

---

### STEP 8.1 — WEEK 1 POST-LAUNCH: WATCH, DON'T ADD
**Action:** Do not add features in the first week. Watch the PostHog analytics every day:
- What does the activation flow look like? (From download to first log)
- What is the Day 3 retention? Day 7?
- Which feature is used most? Which is ignored?
- What does Ora get asked that she isn't handling well? (Read the conversation logs — anonymized)

Talk to 3 users who downloaded and stuck around. Talk to 3 who downloaded and didn't come back.

**Who:** Founder + Product  
**Output:** `research/week-1-launch-report.md`  
**Gate:** You know the three biggest problems with the current product before adding anything new.

---

### STEP 8.2 — MONTH 1: FIX BEFORE ADDING
**Action:** Fix the three problems identified in Week 1. Improve Ora's responses in the top 10 conversation scenarios that aren't landing. Update the system prompt based on real conversation data.

**Who:** Developer + Founder  
**Output:** App update version 1.1, in both stores  
**Gate:** Day 30 retention improves from baseline by at least 10 percentage points.

---

### STEP 8.3 — MONTH 2-3: MILESTONE 2 FEATURES
**Action:** From `docs/features.md` M2-M3 section, build the next highest-priority features. The order should be driven by what the beta users asked for most, not by what seemed important before launch. Likely candidates:
- Community connection (anonymized peer matching by phase)
- Lab vault (upload hormone test results)
- ADHD dose tracking
- Ora pattern briefings (weekly summaries from Ora)
- Partner/support person mode

**Who:** Developer + Product  
**Output:** Version 1.2 in both stores with 2-3 M2 features  
**Gate:** MRR growing month-over-month. Churn rate under 10%/month.

---

---

# PHASE 9 — OPTIONAL: YC APPLICATION
## If you want venture funding, this is the path.

*YC applications open twice a year (March and September). The next deadline after this guide is written would be approximately September 2026. You need real traction — paying users, user interviews conducted, retention numbers — before applying. "We have research" is not traction. "We have 200 paying users and 40% Day-30 retention" is traction.*

---

### STEP 9.1 — YC APPLICATION CHECKLIST
Before applying, run through the checklist in CLAUDE.md:
- [ ] 50-word company description written
- [ ] 3 mock interview questions answered with specific numbers
- [ ] Founder-market fit narrative (why YOU for this problem)
- [ ] Current traction (MRR, paying users, retention, interviews conducted)
- [ ] Why now (what changed in last 12-18 months)
- [ ] Competitive landscape named (Flo, Clue, Natural Cycles, Gennev, Midi — what you do differently)
- [ ] Use of funds ($500K seed — what does it buy?)

**Gate:** You can answer "How many paying users do you have?" with a real number over 100.

---

---

# RESEARCH LIBRARY
## Read these. In this order. As you reach each phase.

---

### Before Phase 0 (Read NOW):
| Book | Why | Time |
|------|-----|------|
| *The Mom Test* — Rob Fitzpatrick | Learn to run user interviews without leading witnesses | 3 hours |
| *Running Lean* — Ash Maurya | Lean Canvas and validated learning process | 4 hours |

### During Phase 0 (Medical foundation):
| Book / Resource | Why | Time |
|----------------|-----|------|
| *In the Flo* — Alisa Vitti | Cycle-syncing, foundational hormone education, written for laypeople | 5 hours |
| *The Period Repair Manual* — Lara Briden | Clinical, practitioner-written, evidence-based; read before doctor consultation | 6 hours |
| *The Menopause Brain* — Lisa Mosconi | Perimenopause neuroscience, best accessible book on the topic | 5 hours |
| DRSP instrument (free PDF) | Know the clinical standard you are implementing | 1 hour |
| AFSP Safe Messaging Guidelines (free) | Required reading before Ora crisis protocol is finalized | 1 hour |

### During Phase 1-2 (Brand and Design):
| Book | Why | Time |
|------|-----|------|
| *Logo Design Love* — David Airey | Become a better design brief writer | 2 hours |
| Apple Human Interface Guidelines (free) | Design standard for iOS — live on developer.apple.com | 3 hours |
| *Badass: Making Users Awesome* — Kathy Sierra | Philosophy of products that make users feel capable | 4 hours |

### During Phase 3-4 (Building):
| Resource | Why | Time |
|---------|-----|------|
| Expo Documentation (expo.dev) | Required before writing any React Native code | 3 hours |
| Supabase Row Level Security docs | Required for privacy architecture | 2 hours |
| Anthropic Prompt Engineering Guide (free) | Required before finalizing Ora system prompt | 2 hours |
| *Hooked* — Nir Eyal | Habit loop design — read critically | 3 hours |

### During Phase 5-7 (Launch):
| Book | Why | Time |
|------|-----|------|
| *Traction* — Gabriel Weinberg | 19 customer acquisition channels — find which 2 work for you | 4 hours |
| *Obviously Awesome* — April Dunford | Product positioning and messaging for launch | 3 hours |

### For deep medical knowledge (long-term):
| Resource | Why |
|---------|-----|
| *The ADHD Advantage* — Dale Archer | ADHD framing — useful for the ADHD module |
| *Roar* — Stacy Sims | Female athletic performance and hormones — useful for PCOS/exercise intersection |
| PMC10751335 (free PubMed paper) | ADHD and menstrual cycle dosing — the paper behind the ADHD dose feature |
| *Come As You Are* — Emily Nagoski | Female sexual response and hormones — useful for libido tracking context |
| IAPMD Clinical Practice Guidelines | Free from iapmd.org — the clinical authority on PMDD |

---

---

# DOCTOR AND EXPERT CONSULTATIONS NEEDED
## Not optional. Do these before, during, and after building.

| When | Who to Talk To | What to Ask |
|------|---------------|-------------|
| Phase 0 (before building) | PMDD specialist gynecologist or reproductive psychiatrist | Is the DRSP implementation correct? What should the physician report contain? What clinical claims are off-limits? |
| Phase 2 (before finalizing Ora) | Clinical psychologist or trauma therapist | Review the Ora persona and system prompt for safe messaging compliance |
| Phase 4 (before shipping physician report) | Any practicing OB-GYN or GP | Look at the physician report format and give feedback |
| Phase 5 (beta) | Let your 20 beta testers be your experts | They know more about their conditions than most doctors |
| Phase 7 (post-launch) | A perimenopause specialist (NAMS-certified) | Validate the Greene Climacteric Scale implementation |

**How to find doctors if you can't afford consultation fees:**
1. Email the corresponding author of a PMDD research paper — academics often reply to founders
2. Contact IAPMD (iapmd.org) — they have a patient and clinical network
3. Post in r/medicine or r/ObGyn asking for 15 minutes of feedback
4. Find a doctor who has PMDD themselves — they are often the most willing to help

---

---

# GATE CHECKLIST
## You must answer YES to every question before launching publicly.

- [ ] 15 real user interviews conducted with strangers (not family, not friends)
- [ ] At least 1 doctor has reviewed the physician report format
- [ ] Legal entity registered, domain owned, social handles secured
- [ ] Logo works at 32px and in 1-color
- [ ] All 10 MVP features working on device
- [ ] All 9 Ora persona scenarios produce correct responses
- [ ] Ora correctly handles the crisis scenario (active ideation → 988 provided)
- [ ] 8+ paying customers exist before public launch
- [ ] Privacy policy live at your domain
- [ ] Day-30 retention in beta is over 35%
- [ ] Zero Category 1 bugs in 3 consecutive days

---

*Build Guidance v1.0 | HormonaIQ | April 2026*  
*Next review: after 15 real user interviews complete, update assumptions-map.md and revise any steps that were wrong*
