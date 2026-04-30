# HormonaIQ — One App vs. Many Apps: Full Team Debate
**Decision date:** April 26, 2026
**Status:** DECIDED — see Section 6 Verdict
**Triggered by:** Nilab's question: should we build one unified app or separate apps per condition?

---

## Section 1 — The Question

**Option A: One unified app** — HormonaIQ covers PMDD, PCOS, perimenopause, and ADHD-hormone overlap. User onboards, selects conditions, sees only what's relevant to them.

**Option B: Multiple separate apps** — Four apps: HormonaIQ PMDD, HormonaIQ PCOS, HormonaIQ Peri, HormonaIQ ADHD. Separate listings, separate codebases, separate branding.

**Option C: Hybrid (one app, modular)** — One codebase, one App Store listing, one subscription. Onboarding asks "what do you have?" and the entire UI adapts. A single-condition user sees only their module. A dual-condition user sees both modules woven together.

Option C is what Nilab described ("if he has only one thing then he will show only one thing; if he has two things then we will show two things"). This debate tests whether Option C beats A and B, and why.

---

## Section 2 — Research Findings (from agents, April 26 2026)

### 2.1 Comorbidity Rates

These numbers are why this question matters more than it appears at first:

| Condition pair | Overlap rate | Source |
|---------------|-------------|--------|
| Perimenopause + PMDD criteria | **23%** of perimenopausal women | PMC4207004 |
| PCOS + premenstrual disorder | **1.33–1.55× higher risk** than general population | PMC12221545 (Swedish registry) |
| PCOS mothers → ADHD in children | **42–43% more likely** | Cardiff University |
| Women with multiple chronic conditions simultaneously | **Nearly 60%** of the target demographic | NIH NBK607728 |

**What this means for product architecture:** At least 1 in 4 users who download any single-condition version of this app will have a second condition that version cannot serve. If we build four separate apps, we are guaranteed to fragment our own users.

### 2.2 What Competitors Do

Every app with >1 million users uses a single-app multi-condition architecture:

| App | Users | Conditions covered | Architecture |
|-----|-------|--------------------|-------------|
| Flo | 58M MAU | PCOS, PMDD, endometriosis, fibroids, perimenopause, ADHD symptoms | Single app |
| Clue | Tens of millions | 21 confirmed diagnoses including PCOS, PMDD, perimenopause, ADHD | Single app with condition tiers |
| Ovia | Millions | PCOS, full fertility spectrum, perimenopause, menopause | Single app |
| CHARLI (Australia) | Early stage | Endometriosis + PCOS + cycles + fertility + menopause | Single app |

No app with significant user traction uses the multi-app approach. The ones that do are either tiny or have never scaled.

### 2.3 App Fatigue Data

- **70% median abandonment** within first 100 days across health apps (PLOS Digital Health)
- Users already using 3 apps simultaneously (Natural Cycles + Premom + Oura Ring) because nothing serves them completely — and they complain about it
- Subscription confusion is a documented churn cause: users unsure which apps they're paying for
- Women are less likely to return after they take a break — meaning re-engagement friction kills multi-app strategies

### 2.4 Reddit User Signal

Real quotes from actual users:
- *"She was doing everything right but kept getting generic advice that didn't account for how PCOS actually affects the body"* — developer who built PCOS-specific app because generic ones failed
- *"Tracking apps have me confused ttc"* — user forced to use 3 apps because no single one worked
- Users with simultaneous PCOS + PMDD + ADHD are posting about having all three with zero app support for the combination
- *"Clue app subscription... honestly sucked"* — multi-condition app that wasn't good enough at any single condition

### 2.5 Market Size

- Women's health app market: $5.76B (2025) → $25.18B (2034), **17.81% CAGR**
- Growth rewards specialized, AI-enabled, comprehensive platforms — not fragmented single-condition tools

---

## Section 3 — Business Team Debate

**Format:** CEO pitches Option C → Investor interrogates → CEO defends → Verdict

---

### CEO (Market Builder) — Opening Pitch for Option C

The question isn't one app vs. many apps. The question is: do we want to build one category-defining platform or four small apps nobody remembers?

Our users don't have "a condition." They have a body, and their body has multiple things going on simultaneously. 23% of our perimenopause users will also meet PMDD criteria. More than half of our PCOS users will have metabolic and androgenic AND reproductive AND psychological symptoms that span what would be three separate apps if we split. ADHD-hormone users found us because nobody else connects those dots.

If we build four separate apps: each app is mediocre at what the unified app does brilliantly. The cross-condition pattern recognition that is our moat — the thing that catches PCOS-driven cycle disruption interacting with PMDD severity — disappears. You cannot detect cross-condition interactions with data locked in separate apps.

One app. One subscription. One brand. The user tells us what they have in onboarding. We show them only what's relevant. A PMDD-only user never sees the PCOS module. A PCOS+PMDD user sees both, and the app is the only tool in the world that shows her how they interact. That is not achievable any other way.

Revenue picture: one user paying $14.99/month is better than one user who might pay $9.99 for the PMDD app and might also need the PCOS app and has to decide whether it's worth $20/month for two separate subscriptions. Single subscription removes that decision entirely.

**CEO verdict:** Option C. Non-negotiable.

---

### Investor — Interrogation

I hear the pitch. Now let me steelman the case against it.

**Risk 1 — Positioning diffusion.** "We help women with hormonal conditions" is the kind of positioning that sounds comprehensive and is actually meaningless. Flo tried to be everything and now it's known for nothing clinical. If you're everything to everyone with hormones, you're nothing to the psychiatrist who might recommend your DRSP tracker. Condition-specific apps have cleaner GTM: you go to r/PMDD, you say "this is the PMDD app," you convert at 40%. With a multi-condition app you have to explain yourself to four different communities simultaneously.

**Risk 2 — Build complexity kills the team.** Four condition modules in one app at v1 means four onboarding flows, four data models, four insight engines, four physician report formats. For a 2-person team this is not 4 weeks — this is 6 months before anything ships. Separate apps let you ship one condition in 6 weeks and validate before building the next.

**Risk 3 — The App Store taxonomy problem.** iOS and Android have category taxonomies. "Medical" vs. "Health & Fitness" vs. "Lifestyle." A multi-condition app doesn't fit cleanly anywhere. A PCOS app fits in "PCOS app." Category clarity drives ASO.

**Risk 4 — The Flo / Clue counter-argument.** Yes, Flo has 58M users and covers multiple conditions. Flo also has 300 engineers and $200M in funding. You are not Flo at launch. The reason Flo survived expanding to multiple conditions is that they had 20M users in one condition first, then expanded. The lesson from Flo is not "build multi-condition from day one." The lesson is "nail one condition, expand from strength."

**Investor's steelman bear case:** Build PMDD-only first. 3-8% of reproductive-age women × English-speaking market = ~800K–1.2M potential users. Nail the DRSP tracker, the safety plan, the physician report. Build a brand that PMDD users trust. Then add PCOS as a module. Then peri. Then ADHD. Don't try to serve four conditions simultaneously from day one with two engineers.

---

### CEO — Defense

The investor's bear case is strategically right about sequencing but wrong about architecture.

The investor is conflating **what you build first** with **how you build it**. Nobody is saying we ship four fully-built modules in Week 8. We ship the PMDD module fully built. The PCOS module is in the architecture from the start — it's just empty at launch. The onboarding asks "what do you have?" and if a user says PCOS, they see a "coming soon" card, not a broken experience.

This is the difference between **modular architecture** and **premature scope expansion**. We commit to the architecture once. We fill the modules over time.

On positioning: the investor is right that "we help women with hormonal conditions" is bad positioning. The answer is not four separate apps. The answer is **"HormonaIQ is the only app that understands that you have more than one thing happening in your body"** — and that's a sharper, more differentiated position than anything a single-condition app can claim, because it's true and competitors cannot copy it without rebuilding everything.

On ASO: a single app can rank for PCOS keywords AND PMDD keywords AND perimenopause keywords. Four apps split keyword authority four ways and fight each other for algorithm space if any user searches across conditions.

On Flo: Flo expanded from single-condition because their single-condition architecture didn't support multiple conditions at the data layer. We build cross-condition data architecture from day one. The engineering cost of doing it right upfront is far lower than retrofitting it later.

**Business Team Verdict:** Option C — one app, modular architecture, PMDD module ships fully at MVP. PCOS module follows Month 2. Perimenopause Month 4. ADHD Month 3. Positioning: "the only app that understands all of your hormones, not just one."

---

## Section 4 — Technical Team Debate

**Format:** complexity card → stack recommendation → v1 definition → v2 definition → landmines list

---

### CTO (Pragmatic Architect) — Complexity Card

**Option B (separate apps) complexity card:**

| Item | Reality |
|------|---------|
| Codebases to maintain | 4 |
| Authentication systems | 4 separate or 1 shared (architectural decision that creates its own complexity) |
| Shared components | UI components must be duplicated or extracted into a private package — adds a monorepo or package management layer |
| Feature flag parity | Every feature that applies to 2+ conditions must be replicated manually in 2+ codebases |
| Bug fixes | Any bug touching shared logic must be patched in 4 places |
| App Store accounts | 4 separate apps to manage, review, update, respond to reviews |
| CI/CD pipelines | 4 |
| Data model | User data is fragmented — cross-condition analysis is impossible; a user's PCOS cycle data and PMDD symptom data are in separate databases |
| 2-person team viability | No. This is a 6-person maintenance burden. |

**Option C (one app, modular) complexity card:**

| Item | Reality |
|------|---------|
| Codebases | 1 |
| Authentication | 1 |
| Condition modules | Feature-flag gated sections; onboarding profile determines which flags are active |
| Data model | Single unified schema with `condition_modules: [pmdd, pcos]` array per user — cross-condition queries are first-class |
| Bug fixes | 1 patch, deployed once |
| App Store | 1 listing, 1 review cadence |
| CI/CD | 1 pipeline |
| The hardest engineering problem | Onboarding flow that feels native to each condition while sharing infrastructure — this is Medium complexity, not Large |
| 2-person team viability | Yes, with correct architecture decisions at the start |

**CTO's honest warning:** Option C is not free. The upfront architecture cost — designing the data model, the condition module system, and the feature flag infrastructure — adds approximately 1–2 weeks to the initial setup compared to a single-condition app. That cost is paid once. Option B's cost is paid every week, forever.

The one thing that will surprise you in Option C: **the onboarding flow**. When a user selects "I have PCOS and PMDD," you need an onboarding that doesn't make her feel like she's getting two separate experiences bolted together. This requires careful UX thinking before the first line of code is written. This is the iceberg.

---

### Developer (Shipping Pragmatist) — What Can We Ship This Week?

I don't care about the architecture debate. Show me the pull request.

Here's what the diff looks like for Option C vs Option B:

**Week 1–2 — Option C foundation work:**
```
/core
  /auth
  /data
    user.model.ts        // conditions: ConditionModule[]
    cycle.model.ts       // shared across conditions
  /feature-flags
    condition.flags.ts   // isPMDDActive(), isPCOSActive(), isAdhdActive()

/modules
  /pmdd                  // PMDD module — fully built for MVP
    /screens
    /components
    /data
  /pcos                  // PCOS module — stub at MVP, filled Month 2
    index.tsx            // "PCOS module coming soon — join waitlist"
  /perimenopause         // stub
  /adhd                  // stub with ADHD check-in (F13) — simple enough for MVP
```

**The onboarding flow for Option C (the "iceberg"):**

```typescript
// Onboarding Step 3: What do you have?
const conditions = [
  { id: 'pmdd', label: 'PMDD', status: 'live' },
  { id: 'pcos', label: 'PCOS', status: 'coming_soon' },
  { id: 'perimenopause', label: 'Perimenopause', status: 'coming_soon' },
  { id: 'adhd_hormone', label: 'ADHD + hormone overlap', status: 'beta' },
  { id: 'unsure', label: "I'm not sure yet", status: 'live' },
]
// User selects one or more. We set their condition profile.
// Feature flags activate accordingly.
// Coming Soon modules show a beautiful "You're on the list" card.
```

This is not 4 apps. It's 1 app with a routing decision at onboarding. The routing decision costs 1 day of engineering. The architecture decision costs 2 weeks upfront. The ongoing benefit is every feature built once, deployed once, debugged once.

**Developer's v1 (MVP, Week 8):**
- Full PMDD module (all P0 PMDD features)
- PCOS stub (HOMA-IR calculator + lab vault because these are P0 and simple)
- ADHD module (F13 check-in is Small complexity — ships in v1)
- Perimenopause stub

**Developer's v2 (Month 3):**
- Full PCOS module
- ADHD full module
- Cross-condition overlay begins

**Landmines List:**
1. **Data model lock-in.** If you design the data model for PMDD only and add PCOS later, you will have a migration. Design for conditions as a first-class concept from day one.
2. **Onboarding length.** Multi-condition onboarding for a user with 3 conditions can become 40+ questions. Solve this with progressive disclosure — not all-upfront.
3. **Notification logic.** When a PCOS+PMDD user is in luteal phase, the notification system needs to know which condition's logic to apply. This gets complex. Plan the notification architecture before Month 2.
4. **Privacy flags per condition.** The physician report for PMDD is formatted differently than for PCOS. Ensure condition-specific privacy flags (e.g., "intercourse timing" from Fertility Mode is excluded from ALL exports) are enforced at the data layer, not the UI layer.
5. **ASO metadata.** One App Store listing must rank for both "PCOS app" and "PMDD tracker." Keywords must be carefully managed. Subtitle rotation, screenshots per condition, A/B tested onboarding screenshots.

**Technical Team Verdict:** Option C. Single codebase, modular architecture. Build PMDD fully, PCOS as stub at launch, expand on a quarterly cadence.

---

## Section 5 — User Research Team

**Format:** user story → willingness to pay → moment of wallet-open

---

### User (Real Customer Voice) — For a Woman with Both PCOS and PMDD

I have PCOS and PMDD. I was diagnosed with PCOS at 24, PMDD at 27. They interact in ways nobody has ever explained to me. My irregular PCOS cycles make PMDD tracking nearly impossible — I never know when my luteal phase starts because I never know when my period is coming.

Right now I use: Clue (cycle tracking, useless for me), a paper symptom diary, Reddit, and nothing else. I've tried Flo — too generic. I've tried PMDD-specific apps — they assume 28-day cycles. I've tried PCOS apps — they don't track mood or DRSP.

**Would I pay for one unified app?** Yes. $14.99/month for something that actually understands me — immediately, without me having to explain the interaction between these two conditions.

**Would I pay for two separate apps?** No. I would have to decide which subscription to maintain when money is tight, and I would resent both of them for not being complete.

**What stops me?** The moment an app tells me to "log your symptoms for Days 21–28" when my cycles are 47 days long, I close it. The moment it shows me a 28-day cycle wheel, I close it. One unified app that knows I have irregular cycles AND PMDD does not make this mistake, because PCOS-aware cycle logic feeds directly into PMDD tracking logic.

**Moment I open my wallet:** When I see a physician report that shows my PCOS cycle length, my DRSP scores, and my HOMA-IR side by side — and I think "I could give this to both my endocrinologist and my psychiatrist." That PDF is worth $14.99/month to me. No single-condition app can produce that document.

---

### Designer (Experience Strategist) — The UX of Choice

The user's question is not "one app or many apps." The user's question is "will this app feel cluttered and overwhelming, or focused and relevant?"

The answer is architecture, not product count. The answer is **conditioned clarity** — the app knows who you are, shows you only what's yours, and hides everything else.

Here is the 3-click MVP for a new PMDD+PCOS user:
1. Onboarding: "I have PMDD and PCOS" — two taps
2. Home screen: shows PMDD Today card + PCOS Today card — contextual, not overwhelming
3. Daily log: PMDD DRSP first (primary condition), PCOS quick log second (30 additional seconds)

Here is the 3-click MVP for a PMDD-only user:
1. Onboarding: "I have PMDD" — one tap
2. Home screen: shows PMDD Today card only — no PCOS card, no perimenopause card
3. Daily log: PMDD DRSP only

**Same app. Completely different experience.** The user with one condition never knows the other modules exist unless she goes looking.

**The viral hook for the multi-condition user:** "This is the first app that knew I had two things." That is a word-of-mouth hook that a single-condition app can never generate. A woman who has been gaslit by apps that didn't understand her complexity — and then finds an app that does — tells people. This is the emotional moment that drives organic growth.

**What I will not allow in the UX:**
- Condition tabs at the top of the screen (this makes users feel they're in multiple apps)
- A PCOS section and a PMDD section as separate visual silos — the experience must feel unified
- "You have 2 conditions" messaging anywhere — that's clinical language, not product language
- Overwhelming the single-condition user with options she never selected

**Designer's verdict:** One app, personalized by condition profile. The visual architecture must feel like ONE experience with intelligent personalization, not two apps glued together.

**User Research Team Verdict:** Option C. The user story for multi-condition users is uniquely powerful. The single-condition user experience is identical to a single-condition app as long as the UX hides irrelevant modules. No UX penalty; large UX upside.

---

## Section 6 — YC Panel

**Format:** score + mock interview for the architecture decision

---

### YC Partner 1 (Paul Graham Mode)

The fact that you're asking this question tells me you haven't talked to enough users yet. Let me answer it with a test:

**Can you name 10 users with multiple hormonal conditions who would be desperate for a unified app?**

If yes: build Option C. The architecture follows the desperation.
If no: build the single-condition MVP first, find those 10 users, then decide.

My instinct from the research you've presented: the 10 desperate users exist. The 23% perimenopause-PMDD overlap, the PCOS-ADHD correlation, the Reddit posts of people manually managing 3 apps — this is the signal. The "10 desperate users" test is passed.

**Red flag I'm watching for:** Option C fails if the multi-condition experience is just two apps stacked on top of each other with a shared login. The insight that justifies Option C — the cross-condition pattern recognition — must actually exist. If you build Option C but the PMDD module and PCOS module never talk to each other, you've built the worst of both worlds: a complex app that provides no multi-condition value.

**The simple first principles argument:** Why hasn't this been built? Because every women's health app was built by people who understood one condition and bolted on others later. You have the opportunity to build the data architecture correctly from the start. That is a genuine moat. Do not waste it by building four separate apps that have the same problem.

---

### YC Partner 2 (Garry Tan Mode)

What does this look like at $100M ARR?

**Option B (four apps) at $100M ARR:** Four separate brands competing for the same users on the App Store. Marketing spend is split four ways. The user with multiple conditions — who is the highest-value user because she has the most pain and the highest willingness to pay — falls through the cracks between apps. No cross-condition data moat. No network effects. You are four small businesses, not one platform.

**Option C (one app) at $100M ARR:** A hormonal health platform with a cross-condition data layer that no competitor can replicate without years of data collection. The PMDD-PCOS-perimenopause-ADHD interaction model becomes a proprietary insight engine. The physician report covers all conditions — one document for all her doctors. This is the clinical data layer that gets acquired by a health system or IPOs as a Women's Health Platform.

**The moat in year 3:** Every data point collected from a multi-condition user is cross-condition training data. A PCOS user's ovulation data combined with her PMDD DRSP data teaches you something about PCOS-PMDD interaction that no PCOS-only app can ever learn. This is the network effect. It compounds with every dual-condition user who logs. Four separate apps cannot generate this data.

**What kills this at Series A:** If the cross-condition insight engine never ships. If the PCOS module is "coming soon" for 18 months. If the multi-condition promise is a marketing claim without product substance. The architecture decision (Option C) is correct. The execution risk is building the architecture and then failing to deliver the multi-condition value that justifies it.

**YC verdict for Option C:** Strong yes — if cross-condition pattern recognition ships by Month 6.

---

### YC Application Checklist — Architecture Decision

- [x] Architecture justification grounded in specific comorbidity data (23% PMDD-peri overlap; 1.33× PCOS-PMD risk)
- [x] Competitor analysis confirms single-app architecture is standard at scale
- [x] Technical team confirms single codebase is viable for 2-person team
- [x] User story for multi-condition user is clearly differentiated
- [x] Why now: existing apps all built single-condition first, none built cross-condition data architecture from day one — window exists
- [ ] Still needed: Talk to 5 women with multiple hormonal conditions and validate the unified app preference in person before committing final architecture

---

## Section 7 — Scoring Matrix

**Option B: Separate Apps**

| Dimension | Weight | Score | Weighted |
|-----------|--------|-------|---------|
| Market Size | 20% | 3 — each app serves a fraction of the market; no cross-condition capture | 0.6 |
| Ease of Build | 20% | 2 — 4× maintenance burden kills 2-person team velocity | 0.4 |
| Competition | 15% | 4 — condition-specific positioning is cleaner per channel | 0.6 |
| Trend Momentum | 15% | 5 — women's health app growth benefits all apps | 0.75 |
| Monetization | 15% | 4 — per-condition pricing is possible but creates friction | 0.6 |
| YC Fundability | 15% | 2 — four small apps is not a venture-scale story | 0.3 |

**Option B Total Score: 3.25 / 10 → 32.5 — Shelve**

---

**Option C: One App, Modular**

| Dimension | Weight | Score | Weighted |
|-----------|--------|-------|---------|
| Market Size | 20% | 9 — serves all 4 conditions + multi-condition users; TAM is additive, not divided | 1.8 |
| Ease of Build | 20% | 7 — single codebase; upfront architecture cost paid once; ongoing simplicity | 1.4 |
| Competition | 15% | 8 — no competitor has built cross-condition architecture from day one; this is the moat | 1.2 |
| Trend Momentum | 15% | 9 — $25.18B market by 2034; AI personalization trend rewards platforms | 1.35 |
| Monetization | 15% | 9 — one subscription, no "which app do I pay for?" friction; multi-condition users are highest-value | 1.35 |
| YC Fundability | 15% | 9 — "the only app built for women with multiple hormonal conditions" is a venture-scale narrative | 1.35 |

**Option C Total Score: 8.45 / 10 → 84.5 — Build now**

---

## Section 8 — Devil's Advocate (Required per CLAUDE.md debate rules)

Before the verdict: what is the strongest case the debate has not fully answered?

**The sequencing argument is real and unresolved.** Option C is correct as an architecture. But the YC partner made a real point: Flo nailed one condition first, then expanded. The question is not "one app or many" — the question is "how many conditions do we activate at MVP?"

**The risk:** If we launch with PMDD fully built and PCOS half-built, does the PCOS user who downloads the app have a bad experience? A "PCOS module coming soon" card during onboarding is a churn event. If that user tells her r/PCOS community that HormonaIQ doesn't really do PCOS, we have a brand problem before we've established a brand.

**The resolution:** The MVP must ship with both PMDD and PCOS at functional quality — not equally deep, but both usable from day one. PMDD at full depth (all P0 PMDD features). PCOS at meaningful depth (HOMA-IR calculator, lab vault, medication adherence log, endometrial hyperplasia risk flag, hair shedding tracker — all P0 PCOS features, which are all Small-complexity). These are the features that show PCOS users the app is real before the full PCOS module is complete.

The developer's v1 plan already accounts for this: PCOS P0 features are predominantly Small complexity and can ship alongside the PMDD module in Week 8.

---

## Section 9 — Verdict

**Decision: Option C — One app, modular, condition-personalized.**

This is not a close decision. It is an 84.5 vs. 32.5 score. The reasoning:

**1. The user with multiple conditions is our most valuable user.** She has the highest pain, the highest willingness to pay, and the most evangelism potential. Four separate apps abandon her. Option C is built for her.

**2. The data moat requires unified data.** Cross-condition pattern recognition — PCOS cycle irregularity feeding into PMDD DRSP accuracy, perimenopause-PMDD interaction, ADHD-hormone dose timing — is impossible with fragmented databases. This is the 3-year moat that prevents Sequoia from funding a competitor and catching up.

**3. A 2-person team cannot maintain 4 codebases.** This is not a strategic argument. It is a survival argument. Four separate apps will kill the team before the product finds PMF.

**4. Every major competitor already made this choice.** Flo at 58M users, Clue, Ovia — all single-app multi-condition. The lesson from their success is clear; the lesson from their limitations (none built cross-condition data architecture from day one) is our opportunity.

**5. Monetization is cleaner.** One subscription. One account. No "which app do I need?" friction at the purchase decision.

---

### The Architecture in One Sentence

One app. One codebase. Onboarding asks which conditions the user has. Feature flags activate the relevant modules. Single-condition users see a single-condition experience. Multi-condition users see an intelligently unified experience. Cross-condition pattern recognition ships by Month 6. The database is designed for cross-condition queries from day one.

---

### What We Build, in Order

| Quarter | What ships |
|---------|-----------|
| MVP (Week 8) | Full PMDD module (all P0 features) + PCOS P0 features (lab vault, HOMA-IR, medication log, endometrial flag, hair shedding) + ADHD check-in (F13, Small complexity) |
| Month 3 | Full PCOS module (all P1 features) + ADHD full module |
| Month 4 | Perimenopause module (P1 features) + cross-condition overlay view |
| Month 6 | Cross-condition pattern recognition engine + Annual PCOS health review |

---

### What We Do Before Writing Code

Per CLAUDE.md validation gates:
- [ ] Talk to 5 women who have both PCOS and PMDD — ask how they currently manage two conditions with existing apps, what they miss, what they'd pay for
- [ ] Talk to 3 women who have perimenopause + PMDD — validate the 23% overlap stat is lived experience, not just epidemiology
- [ ] Confirm with technical advisor: the unified data model design before a line of product code is written
- [ ] Make the onboarding UX decision before architecture begins: what does it look like when a user says "I have PCOS and PMDD"?

---

*Document generated from full 4-team debate: Business (CEO + Investor), Technical (CTO + Developer), User Research (User + Designer), YC Panel (Partner 1 + Partner 2).*
*Research: Reddit scanner + web research agents, April 26 2026.*
*Decision rule: Score ≥ 80 = build. Option C scored 84.5.*
