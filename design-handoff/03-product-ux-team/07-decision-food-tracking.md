# Food Tracking Feature — Full Team Debate
**HormonaIQ Product Decision**  
**Feature proposal:** Food photo logging + Voice/conversational diet logging via Ora  
Version 1.0 | April 2026

---

> **The proposal on the table:**  
> 1. Users can photograph their meals — AI analyzes the image and logs dietary patterns  
> 2. Users can speak or type to Ora about what they ate — Ora extracts and logs diet data conversationally  
> 3. Ora sends diet-related insights correlated with cycle phase and symptoms

---

## THE MEETING

**Present:**
- **James** (CPO, Product) — wants features that drive daily active use and differentiation
- **Dr. Ananya** (endocrinologist, PCOS advisor) — insulin resistance is diet-driven; tracking matters clinically
- **Dr. Chen** (clinical psychologist) — eating disorder risk is very real in this population
- **Maya** (PCOS user, 31, has lost 20lbs by tracking glucose) — wants this feature badly
- **Lisa** (PCOS user, 28, had an eating disorder at 19) — is terrified of food tracking apps
- **Ravi** (AI engineer) — needs to tell us what's actually buildable
- **Dr. Park** (psychiatrist) — eating disorder + hormonal conditions comorbidity is high
- **Amara** (ethics/patient advocate) — worried about data sensitivity and manipulation risk
- **Keiko** (UX researcher) — has watched users fail with food tracking tools in research sessions

---

## PART 1: THE CASE FOR FOOD TRACKING

**James (CPO):** "Let me make the product case. PCOS users need to understand the food-symptom connection. That's not a nice-to-have — it's the core of PCOS management. Insulin resistance affects 64% of PCOS patients. Diet is the intervention with the strongest evidence base. If we don't help users see the connection between what they eat and how they feel, we're leaving the most important lever on the table. And from an engagement standpoint: food logging is the highest-frequency interaction any health app can offer. Three meals a day is three daily opens."

**Dr. Ananya:** "I'll back James clinically. When patients bring me evidence of dietary patterns correlated with their symptom severity, I can actually help them. Right now they either don't track anything, or they bring me calorie counts, which is not what I need. What I need is glycemic load patterns. Post-meal energy crashes. What they ate the week their acne flared. That data would transform appointments."

**Maya:** "I cracked my PCOS by tracking what I ate against my symptoms. I did it in a Google Sheet for eight months. It was incredibly tedious but it changed my life. My testosterone dropped 60%. My periods became regular. My doctor told me to keep doing whatever I was doing. If HormonaIQ had existed I wouldn't have needed to build that spreadsheet. I want this feature."

---

## PART 2: THE CASE AGAINST (OR FOR EXTREME CAUTION)

**Lisa:** "I have to be honest with you all. I had anorexia at 19. I recovered. I now manage PCOS. The moment any app starts asking me to log my food, I feel my heart rate go up. Every food tracking app I've used — MyFitnessPal, Lose It, Carb Manager — they all make me feel like I'm failing or succeeding at eating. There's no such thing as neutral food logging for someone with eating disorder history. And the eating disorder rates in PCOS are not small. One paper I found said 4x the general population. You need to understand that a significant portion of your users are me, not Maya."

**Dr. Park:** "Lisa is describing something clinically documented. PCOS patients have dramatically elevated rates of binge eating disorder, bulimia, and orthorexia — not just restriction disorders. Orthorexia in particular thrives in 'clean eating' communities, and PCOS communities have a strong culture of dietary purity that borders on orthorexic. Any food tracking feature will be used by some users in ways that worsen eating pathology. That's not hypothetical. It's epidemiologically certain given the population size."

**Dr. Chen:** "My concern is specifically with photo logging. There's research showing that photographing food before eating increases dietary preoccupation — the act of documentation intensifies your relationship with what you're eating, for better or worse. For users with eating disorder history, this is a harm vector. We'd be building a feature that helps Maya and harms Lisa, and we don't know which user is in front of us."

**Keiko:** "I watched twelve PCOS users interact with Cronometer in a research session. Eight of them — eight out of twelve — expressed anxiety within the first ten minutes. Phrases like 'I shouldn't have eaten that,' 'I'm already over my carbs,' 'this is making me feel bad.' Four of them closed the app and said they wouldn't use that feature. Two said it made them want to restrict. Only two found it purely useful. That's a 1-in-6 success rate. The feature helped 2 out of 12 and visibly harmed 4."

---

## PART 3: WHAT'S ACTUALLY BUILDABLE

**Ravi (AI engineer):** "Let me put technical constraints on the table before we debate a feature we may not be able to build.

**Food photo logging — current state:**
- Computer vision food recognition (Google Vision, Clarifai, Passio AI) can identify foods with ~70-80% accuracy for common Western foods, lower for complex mixed dishes, South Asian food, East African food, etc.
- Nutritional database matching after recognition is another layer of error
- The result is: we recognize 'rice and curry' but we can't tell you glycemic load with any clinical accuracy
- If we're framing this as 'calorie tracking' — don't build it. The accuracy isn't there for calories.
- If we're framing this as 'glycemic quality' — photo can tell us 'high glycemic meal' vs 'low glycemic meal' with reasonable accuracy. That's useful for PCOS.
- Build time: 6-8 weeks for an MVP photo log with AI food recognition and glycemic quality classification. Not a week-one feature.

**Voice/conversational logging via Ora — current state:**
- This is actually straightforward. User says or types 'I had oatmeal with berries and a coffee' — Ora extracts: meal type, rough glycemic quality, notable items (caffeine noted for PMDD correlation).
- No computer vision needed. No nutritional database needed.
- Ora can respond: 'Got it — that sounds relatively low glycemic. How did your energy feel an hour later?'
- Build time: 2 weeks once Ora's core chat is built. This is a low-complexity addition."

---

## PART 4: THE DEBATE RESOLUTION

**James:** "So if I understand correctly: voice/conversational is easy to build and Ravi thinks it's 2 weeks. Photo logging is technically possible but hard to do accurately and is 6-8 weeks."

**Ravi:** "Correct."

**Dr. Chen:** "Can I propose a framework? There are three different things we're conflating: (1) calorie tracking — never build this, full stop, (2) glycemic quality logging — clinically valid for PCOS, lower harm risk if framed right, (3) food-symptom correlation — the most valuable thing, and doesn't require precise nutritional data."

**Dr. Ananya:** "I agree with that framework. I don't need to know that a patient ate 340 calories at lunch. I need to know that they had a high-glycemic lunch and then crashed at 3pm and had brain fog. That correlation is what tells me something."

**Lisa:** "I could live with a feature that doesn't judge what I eat. If Ora asks 'how did that meal feel?' instead of 'that was 450 calories' — that's different. It's the numbers that trigger me, not the act of noticing what I ate."

**Amara:** "The data sensitivity point: food logs are intimate. They reveal religion, culture, income, health status. This data needs to be treated with the same sensitivity as menstrual data. It must be device-local by default, encrypted, never used for ad targeting, never sold."

**Dr. Park:** "I want a concrete safety guardrail on the table. If a user logs 'I didn't eat today' three days in a row, or if they start logging meals and the pattern looks like restriction — Ora must notice and respond. Not with judgment. But with presence: 'I notice you've mentioned not eating much lately. How are you feeling?' That's the difference between a helpful feature and a harmful one."

**Keiko:** "One more UX constraint from the research data: the log must never show a user a number that implies they did something wrong. No 'over your carb limit.' No 'high calorie day.' The visual must be neutral — a pattern chart, not a scorecard."

---

## DECISION

After 90 minutes of debate, the team reached the following decisions:

### DECISION 1: CALORIE TRACKING — NEVER BUILD
**Unanimous.** HormonaIQ will never include calorie counting, macro tracking, or any feature that assigns a numeric 'good/bad' value to food intake. This is a brand-level commitment, not just a feature decision. The reasons: eating disorder risk in the user population, clinical irrelevance for PMDD/PCOS management, and direct contradiction of the "not a diet app" positioning.

**Lisa:** "Thank you. That's the only right answer."

---

### DECISION 2: VOICE/CONVERSATIONAL FOOD LOGGING — BUILD IN MVP (P1)
**Passed 7–1** (Dr. Park abstained pending safety guardrail confirmation).

**What it is:** User can tell Ora what they ate, in natural language, at any point. Ora responds conversationally and logs dietary context — not calories, not macros. Logs: meal timing, glycemic quality estimate (high/medium/low), notable items (caffeine, alcohol, sugar, processed food), and the user's own description of how they felt after.

**What Ora logs internally:**
- `meal_time` — breakfast / lunch / dinner / snack / unspecified
- `glycemic_quality` — high / medium / low / unknown (AI estimate, displayed as approximate)
- `notable_items` — caffeine (yes/no), alcohol (yes/no), sugar (yes/no), processed (yes/no)
- `post_meal_energy` — how user felt 1-2 hours after (optional, Ora asks)
- `user_description` — free text, what the user said, stored verbatim

**What Ora does NOT log:** Calories. Macros. Weight. Any numerical food assessment.

**Example interaction:**
> User: "I had a big bowl of pasta for lunch"  
> Ora: "Got it. Pasta tends to be higher glycemic — how did you feel about an hour later? Did you get that afternoon slump?"  
> User: "Yeah I crashed hard"  
> Ora: "That's useful pattern data. You've had energy crashes after high-carb lunches three times this cycle. Worth noting."

**Safety guardrail (agreed with Dr. Park):**
- If a user logs 0 meals for 3 consecutive days: Ora gently checks in — "I notice you haven't mentioned eating much lately. How are you feeling?"
- If a user's logged food becomes very restrictive or their logged descriptions indicate anxiety around food: Ora surfaces: "Some people find food tracking brings up complicated feelings. If that's happening, we can log things differently — or not log food at all. What works for you?"
- Ora never comments on quantity, only pattern

---

### DECISION 3: FOOD PHOTO LOGGING — BUILD IN PHASE 2, NOT MVP
**Passed 5–3** (Dr. Chen and Lisa and Dr. Park voted against; James, Dr. Ananya, Maya, Ravi, Keiko, and Amara voted for Phase 2 build).

**Conditions for Phase 2:**
1. Voice logging must be live and used by >30% of active users first — validates demand
2. Photo recognition must be limited to glycemic quality classification only (high/medium/low) — no calories displayed
3. Eating disorder screening during onboarding: if user indicates eating disorder history, food photo feature is hidden by default (opt-in only, with a specific disclosure)
4. No "food journal" framing — frame as "meal pattern" logging
5. The photo is analyzed and discarded — we do not store food photos on the server

**Lisa (who voted against):** "I understand why you're building it. I just want the opt-out to be real. Not buried in settings. When I open the photo feature for the first time, I want a clear choice: 'Some people find food logging isn't right for them. That's completely fine — you can turn this off anytime.' That sentence needs to be there."

**Agreed by all:** That exact sentence, or equivalent, will appear on first launch of the food photo feature.

---

### DECISION 4: DIET-SYMPTOM CORRELATION INSIGHTS — BUILD IN MVP (P1)
**Unanimous.**

Even without food logging, the app can surface correlations based on what users DO log:
- "Your PMDD symptoms tend to be worse in weeks where you've logged caffeine" (from trigger log)
- "Your energy crashes correlate with your post-ovulation phase" (from energy + phase data)
- "Three of your five worst luteal weeks included alcohol in your trigger log"

These insights require no food photo, no calorie count — only the trigger logging field that's already in the MVP spec.

---

## FEATURE SPECIFICATIONS

### Feature: Conversational Diet Log (via Ora)
**Priority:** P1 — ship in 8 weeks  
**Complexity:** S (2 weeks after Ora core is built)  
**Owner:** AI/Backend team

**User story:** As a PCOS user who needs to understand my diet-symptom connection, I want to tell Ora what I ate in plain language, so that she can help me see patterns without making me feel judged or count anything.

**Acceptance criteria:**
- User can say/type anything about food to Ora at any time
- Ora extracts: meal timing, glycemic estimate, notable items (caffeine/alcohol/sugar), post-meal energy if mentioned
- Ora responds conversationally — always asks one follow-up if useful
- No numbers displayed to user (no calories, no carbs, no grams)
- Logged data visible in the Insights screen as a pattern trend (glycemic quality over time), not a daily scorecard
- Data stored device-local by default, encrypted
- Zero food photos required

**Ora language rules for diet conversations:**
- Never: "that's high calorie," "you shouldn't eat that," "that's a lot of carbs," any numerical food assessment
- Always: curious and neutral ("how did that feel?" "does that seem to connect with your energy today?")
- If user expresses guilt about food: "Food doesn't need to be perfect to track patterns. Even imperfect days are useful data."
- If user says they didn't eat: log it, don't comment on it unless it's 3+ consecutive days

---

### Feature: Food Photo Logging (Phase 2)
**Priority:** P2 — after MVP, after voice logging validated  
**Complexity:** L (6-8 weeks, requires computer vision API integration)  
**Owner:** AI/Backend team

**Technical approach:**
- Use Passio AI or Google Vision API for food recognition
- Map recognized foods to glycemic index database
- Display result: "This looks like a medium-high glycemic meal" — not a number
- Photo processed and discarded — not stored on server or device after analysis
- Eating disorder safety: opt-in screen with explicit "you can skip this feature" option
- No "photo food diary" UI — each photo is a single moment log, not a gallery

---

### Feature: Diet-Symptom Correlation Insights (MVP)
**Priority:** P1 — ship in 8 weeks  
**Complexity:** M (uses trigger log data already being collected)  
**Owner:** Product/Backend team

**What it does:** When a user has 4+ weeks of logged data including trigger log entries (caffeine, alcohol, sugar), the insights engine looks for correlations between those entries and elevated symptom scores. If correlation coefficient > 0.4: surface an insight to the user.

**Example insights:**
- "Your worst luteal weeks often follow days with caffeine logged. This might be worth discussing with your doctor."
- "Your energy crashes in follicular phase — which is unusual. Your glucose patterns might be a factor."
- "Weeks where you logged alcohol show 35% higher symptom scores in luteal phase."

**Language rules:**
- Always hedged: "might be," "seems to," "worth discussing" — never "caffeine is making your PMDD worse"
- Always actionable: every insight ends with what to do with it (discuss with doctor, try observing, note it)
- Never shame: never "you drank too much" — just pattern observation

---

## OPEN QUESTIONS FOR PHASE 2

1. **Eating disorder screening in onboarding:** Should we ask directly ("have you had an eating disorder?") or use a validated screening tool (EDE-Q brief)? Dr. Chen recommends EDE-Q brief; James is concerned it creates friction. Unresolved.

2. **Inositol and supplement correlation:** Should Ora track inositol intake against PCOS symptom severity? Evidence supports myo-inositol for PCOS. But this gets into supplement advice. Medical ethics team needs to review.

3. **Mediterranean diet guidance:** AskPCOS.org and Hopkins both recommend Mediterranean diet for PCOS. Can Ora mention this? Under what circumstances? Legal review needed before building.

---

## NEVER-BUILD LIST FOR DIET FEATURES

- **Calorie counter** — never, for any reason
- **Macro tracker** — never
- **"Net carb" calculations** — never (keto framing reinforces orthorexia risk)
- **Goal weight / progress toward goal** — never in any form
- **Food scoring systems** — no "good food / bad food" binary or green/yellow/red coding
- **Streak tracking for healthy eating** — never (same problem as log streaks)
- **Dietary comparison to other users** — never
- **"You are what you eat" framing** — never
- **Calorie burn from exercise** — never
- **BMI calculator or display** — never

---

*Food Tracking Feature Debate v1.0 | HormonaIQ | April 2026*  
*Decision: Voice logging → P1 MVP. Photo logging → P2 post-validation. Calorie tracking → never.*  
*Next review: After 60 days of voice logging usage data from beta users*
