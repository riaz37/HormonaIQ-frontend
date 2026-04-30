# HormonaIQ — Psychological Design Guidelines
**For designers, writers, and engineers**
Version 1.0 | April 2026

---

> This document is not a style guide. It is an explanation of why every design decision in HormonaIQ exists.
>
> Every person who touches this product — whether you write copy, build components, design flows, or write API responses — should read this once and keep it close. The women using this app have a specific psychological history with health technology. If you don't understand that history, you will make decisions that hurt them without knowing it.

---

## SECTION 1 — Understanding the Psychological Profile

### Who These Women Are (Not Clinically — Psychologically)

The women who will use HormonaIQ are not a demographic. They are the result of a specific, shared experience that has shaped how they relate to health information, health technology, and the people who claim to help them.

They are, in most cases, highly intelligent. They have done more research on their own conditions than most GPs have. They can parse clinical literature. They know what the DSM-5 says about PMDD diagnostic criteria. They know the average endometriosis diagnostic delay is seven to ten years, because they are living inside that delay. They arrived at this knowledge not because they enjoy research but because the alternative — trusting the system to figure it out — failed them repeatedly.

They are also, in most cases, exhausted. Not from their conditions alone, although those are exhausting. From advocacy. From the sustained, years-long effort of explaining themselves to people with institutional authority who chose not to believe them. From preparing for appointments. From calibrating how much clinical language to use so as not to seem threatening. From holding all of this labor alongside full professional and personal lives.

They have been burned by wellness apps. The ones that showed them a flower when they were fertile. The ones that told them they were late when their PCOS meant their cycle was just irregular. The ones that sent them cheerful streak notifications during the worst weeks of their month. They deleted those apps. They have a specific muscle memory for recognizing that kind of product, and when they see it, they close it and do not return.

They come to HormonaIQ with low trust, high standards, and a very specific need: to be taken seriously by a piece of software in a way the medical system never has.

---

### The Core Wound: Being Dismissed and Disbelieved

The single most important psychological fact about this user population is this: they have spent years, in many cases decades, being told that their experience of their own body was wrong.

Not dramatically wrong. Not told they were lying. Something more corrosive: told that what they felt was stress, or anxiety, or just the way periods are. Told that every woman feels this way sometimes. Told they were very in tune with their bodies — in a tone that implied that this was a problem, not a skill. Their careful self-documentation was received as evidence of anxiety rather than evidence of rigor.

This experience has specific psychological consequences:

**Internalized doubt.** Many of these women have, at some point, wondered whether they were making it up. When a GP, an OB-GYN, an internist, and a psychiatrist all suggest that the issue is really anxiety or stress, the rational response is eventually to consider that they might be right. This internalized doubt is not irrational — it is the expected result of sustained institutional dismissal. It causes these women to second-guess their own symptom reports, to soften their descriptions, to minimize when speaking to medical providers.

**Hypervigilance about credibility.** Because their credibility has been challenged so many times, they have become expert at managing how they present themselves in medical contexts. They prepare for appointments like they are preparing for a negotiation. They anticipate disbelief and preemptively defend against it. They bring spreadsheets and printed papers. They track in Notion databases. This is not pathology. This is survival strategy.

**Mistrust of enthusiasm.** They have been told that new products, new approaches, new doctors will help. Those promises have often not been kept. When something feels too enthusiastic about solving their problem, it triggers the same skepticism as the doctor who said "let's keep an eye on it." Optimism without evidence feels like dismissal wearing a friendlier mask.

**The specific grief of lost time.** Most women in this population have a reckoning at some point with how much of their life has been shaped by something they didn't have a name for. Aisha described white-knuckling through ICU shifts during the worst weeks of PMDD. Jennifer sat in her car calculating how many more years she would have to function in a body she didn't understand. This is not abstract. It is years of professional opportunities managed around symptoms, relationships strained by unexplained behavior, personal narrative disrupted by a medical system that couldn't see what was happening. The grief of lost time is real and frequently unprocessed.

---

### The Identity Split: Who They Are vs. Who They Become

One of the most distressing aspects of cyclical hormonal conditions — PMDD in particular, but also luteal-phase exacerbation of ADHD, and the cognitive fog of perimenopause — is that the person who suffers the symptoms is cognitively and emotionally not the same person who has to explain those symptoms to a doctor weeks later.

Sarah described this precisely: "I'm a very logical person. I could see the pattern but I couldn't let myself believe the pattern was real because it felt like an excuse."

There are, functionally, two versions of the user:

**The baseline self:** Competent, articulate, high-functioning, often professionally accomplished. This is the person who built the Notion database, printed the papers, prepared for the appointment. This is the person who downloads the app.

**The symptomatic self:** Operating with dramatically reduced cognitive capacity, emotional dysregulation, and — particularly in PMDD — a subjective experience of being someone entirely different. This person cannot maintain a spreadsheet. Cannot fill out a form. Cannot write a paragraph in a notes app. Cannot do what the baseline self set up for her.

The product must be designed for both of these people. It must be sophisticated enough to earn the trust of the baseline self — who is the skeptic, the evaluator, the person who decides whether to keep or delete the app. And it must be usable enough for the symptomatic self — who has almost no cognitive or emotional bandwidth available.

This is not a UX challenge alone. It is a psychological one. When the app is too demanding during low-capacity moments, it communicates to the symptomatic self that she is failing. That is exactly the wrong message for someone who already believes, because she has been told, that her failures during these windows are character flaws rather than symptoms.

---

### The Exhaustion of Self-Advocacy

These women have been doing the work that the medical system should have done for them. They have been their own primary investigators, their own clinical coordinators, their own advocates. They have tracked in Google Docs and Notion databases and paper planners and Excel files with 22 columns. They have printed papers and brought them to appointments. They have scheduled follow-ups. They have found second and third opinions.

This labor is invisible to the healthcare system — it is, in fact, sometimes used against them ("you've done a lot of research," in a tone that pathologizes their effort). It is also profoundly exhausting in a way that compounds the exhaustion of the conditions themselves.

HormonaIQ's design must honor this labor without adding to it. Every interaction that asks for unnecessary effort, every screen that requires them to figure something out, every notification that demands attention for no good reason — these are acts of disrespect toward women who have already given enormous amounts of themselves with very little return.

The design principle that flows from this: **earn every second of attention, or don't ask for it.**

---

### What Safety Feels Like for This Demographic

This is important and often misunderstood by designers who approach it from a wellness context.

Safety for these women is not warmth. Warmth, in the wellness app register, is what they have been given instead of answers. "You're doing great" and "take care of yourself" and "listen to your body" are warm. They are also, for this population, meaningless at best and insulting at worst.

Safety for these women is **accuracy and honesty**. It is naming what is actually happening. It is saying "this phase is genuinely difficult" rather than offering a softer alternative. It is showing them a chart that reflects reality rather than one that is optimistically rounded.

Safety is also **predictability**. For someone whose life has been disrupted by unpredictable cycles of suffering, knowing what is coming — even if what is coming is hard — is a form of relief. The app that can say "last month your symptoms peaked on day 23, and you're currently on day 21" is offering something profoundly safety-making: a preview of the terrain ahead.

Safety is **consistency without intrusion**. The app that is always there, that does not demand anything, that does not send empty encouragement — and that, when it does speak, says something true and useful — builds a kind of trust that no amount of warmth can manufacture.

Safety is also **data sovereignty**. Post-Roe, the privacy of reproductive health data is not abstract. For many of these women, who they are in the healthcare system — their diagnoses, their medication, their cycles — is information with real-world legal implications. An app that handles that data carelessly is not safe. An app that makes data privacy a visible, explicit, foregrounded commitment is.

---

## SECTION 2 — Trauma-Informed Design Principles

### What Trauma-Informed Design Means Here

Trauma-informed design does not mean designing a therapy app. It does not mean adding crisis resources to every screen. It does not mean using clinical language about trauma or treating every user as a patient in recovery.

In this context, it means designing with full awareness that many of the women using this product have had their healthcare experiences shaped by repeated institutional dismissal — and that the design choices we make can either compound that experience or counteract it.

Specifically, it means:

- Understanding that these users carry existing skepticism that our design must work against, not reinforce
- Designing for low-capacity moments as carefully as for high-capacity ones
- Never making a user feel pathologized for experiencing exactly the symptoms the app is built to track
- Being honest when honesty is what the situation requires, even if warmth would be easier
- Creating predictability wherever possible, because predictability reduces anxiety for people whose lives have been marked by unpredictability
- Ensuring that every design decision — particularly around crisis moments — has been thought through with care and reviewed by people with appropriate clinical expertise

---

### The 8 Principles

---

**Principle 1: Validate Before You Educate**

The first thing the app communicates in any interaction must be acknowledgment of experience — not information, not advice, not education.

This is not sentimental. It is functional. A person in distress who receives information before their distress is acknowledged will not retain the information. More importantly, for women who have spent years having their distress bypassed in favor of quick clinical responses, receiving information first is experienced as dismissal wearing an educated costume.

DO:
> "Luteal phase is genuinely hard. Not in your head. Not dramatic. Hard. Here's what's happening biologically."

DON'T:
> "During the luteal phase, declining progesterone and estrogen levels can cause mood changes, sleep disruption, and increased anxiety."

The second version is accurate. The first version will actually be heard.

DO: When a user logs a high distress score, acknowledge the experience before offering any context.
> "That's a high number. We have it recorded. This week matters."

DON'T: Immediately follow a high distress log with an educational card about PMDD symptoms.

---

**Principle 2: Accuracy Over Reassurance**

When the choice is between what is accurate and what is reassuring, choose accuracy. This is one of the most important and counterintuitive principles in this document.

These women have been over-reassured for years. "Let's see how you feel in a month" and "it sounds like stress" are reassurances. They did not help. Empty reassurance is, at this point, a familiar signal that the person speaking does not take the situation seriously.

DO: When a pattern indicates a difficult week ahead, say that directly.
> "Your data shows this is typically your hardest stretch. Day 22 to 25."

DON'T:
> "You're doing so well with your tracking. Keep it up — every day of data makes the picture clearer."

DO: When data shows an escalating pattern across cycles, name it.
> "Your severity scores have been increasing over the last three cycles. That's something to bring to your provider."

DON'T: Soften this with encouragement or minimize it by following it immediately with a positive data point.

---

**Principle 3: Honor the Labor That Got Her Here**

These women have been tracking manually for months or years before finding this app. That labor is real and it has real emotional weight. The app should acknowledge it and build from it — not treat each user as if they are starting from zero.

DO: In onboarding, acknowledge prior tracking.
> "A lot of women who come to HormonaIQ have been keeping track themselves for years. If that's you, your data is already more valuable than you might think."

DON'T: Ask her to "get started" as though this is her first time engaging with the question.

DO: When pattern recognition activates for the first time, frame it as the app confirming what she already had evidence for.
> "Ora has found a pattern in your data. It's consistent with what many users with PMDD experience in the luteal phase. You were right to track this."

DON'T:
> "Great news — you've been using HormonaIQ long enough for Ora to detect your first pattern."

---

**Principle 4: Design for the Lowest-Capacity Moment**

The moment a user most needs this app is the moment she has the least capacity to use it. Luteal peak. PMDD crisis. The 3AM insomnia window. The day she called in sick because she could not face the world.

Every design decision should be evaluated against this question: can she use this if she is at her lowest?

Practically, this means:

- Core logging must be achievable in under 30 seconds, with no text fields required
- Crisis-adjacent resources must be reachable in two taps from anywhere in the app
- The app must not require decisions during low-capacity states — phase-aware UI should simplify automatically
- During detected difficult phases, push non-essential features behind one additional layer
- Font size, tap target size, and color contrast must meet accessibility standards at all times — during luteal peak, these users are functionally impaired

DO: When pattern data suggests the user is in a predicted hard window, simplify the home screen to its most essential elements.

DON'T: Introduce new features, prompt habit formation, or surface optional settings during luteal peak.

DO: Single-tap mood entry must be available from the lock screen for users who have opted in.

DON'T: Require authentication steps, logging flows, or form completion to record basic wellbeing during crisis moments.

---

**Principle 5: Predictability as Safety**

For someone whose life has been disrupted by the unpredictability of their cycle, knowing what is coming is not just useful — it is emotionally regulating.

The app's pattern recognition capability is one of its most powerful features, and the psychological reason is this: a predicted hard week is a categorically different experience from an unexpected hard week. When you know it is coming, you can prepare. You can cancel things, rest in advance, tell your partner, reduce your obligations. The suffering may be the same, but the terror is reduced.

This principle shapes how and when the app communicates predictions:

DO: Communicate phase transitions with enough advance notice for the user to prepare — at least two to three days before a predicted luteal peak.
> "Your data suggests your harder stretch typically begins around day 20. You're on day 18."

DON'T: Deliver phase information only at the moment it is already happening.

DO: Be specific about predictions.
> "Last month your highest severity window was days 22 to 25, lasting about four days."

DON'T: Be vague or hedge excessively.
> "You might start feeling a bit different over the next week or so."

---

**Principle 6: Never Pathologize the Experience You're Tracking**

This principle requires constant vigilance. The app is tracking symptoms that are real, that are serious, and that — particularly for PMDD — can include suicidal ideation, dissociation, and acute psychological distress. These symptoms must be acknowledged. They must not cause the app to treat the user as though she is unstable or dangerous.

The distinction is: there is a difference between symptoms that are severe and a user who needs intervention. The app's job is to track the former with accuracy and to respond to the latter with appropriate calibration. Over-triggering crisis responses for users who are logging routine luteal symptoms is a harm — it communicates that their normal experience is an emergency, which is frightening and inaccurate.

DO: Normalize the existence of difficult symptoms, including suicidal ideation in PMDD, without making the user feel that logging them triggers an alarm.
> "This is one of the symptoms some people experience during PMDD's hardest phase. Logging it is the right thing to do."

DON'T: Auto-display crisis resources every time a user logs suicidal ideation in the context of an established PMDD pattern.

DO: Distinguish between first-time logging of severe symptoms and a user with an established pattern logging within their expected window.

DON'T: Use the same response to both situations. (See Section 4 for the full three-tier crisis protocol.)

---

**Principle 7: No Gamification of Medical Experience**

Streaks, badges, confetti, and completion celebrations belong to habit apps. HormonaIQ is not a habit app. It is a clinical tracking tool. The daily log is not an achievement — it is a medical record.

The psychological harm of gamification in this context is specific: when a user fails to log on a bad day — which is exactly when logging would be most valuable — a gamification system punishes her. The streak breaks. The badge is lost. For someone whose symptomatic self already struggles with self-recrimination, this is a design choice with real psychological cost.

DO: Acknowledge logging in plain functional language.
> "Day 22 recorded."

DON'T: Celebrate logging with animation, emoji, or points systems.

DO: If patterns suggest a logging gap, acknowledge it with care and without judgment.
> "You haven't logged in a few days. No pressure — we're here when you're ready."

DON'T: Send "you broke your streak" notifications or display streak counters.

---

**Principle 8: Privacy as Psychological Safety, Not Fine Print**

These women are acutely aware of the implications of their health data. Post-Roe, reproductive health data has become a legal question, not just a privacy preference. For many of them, being tracked is already a source of anxiety in a medical context — unnecessary surveillance, insurance implications, the experience of having their detailed tracking used as evidence of anxiety rather than evidence of rigor.

Privacy settings must be:

- Visible, not buried in settings menus
- Explained in plain language before the user generates any data
- Framed as a commitment, not a compliance exercise
- Default-protective rather than default-sharing

DO: Make data privacy a named feature with a dedicated screen, not a footnote.
> "Your data stays on your device by default. We do not share cycle data with insurers, employers, or third parties. Period."

DON'T: Bury data controls in Settings > Privacy > Advanced > Data Sharing.

DO: Make data deletion simple, irreversible, and clearly confirmed.
> "Everything deleted. Gone from our servers within 24 hours."

DON'T: Make deletion require multiple steps, a waiting period, or a customer service request.

---

## SECTION 3 — Phase-Specific Psychological States

### How to Read This Section

For each phase, we describe: the typical psychological state, the cognitive capacity (what the user can and cannot do), the emotional needs, the design adaptations required, and what should never be shown or asked during this phase.

These are patterns, not prescriptions. Individual variation is significant, and the app must learn the individual's pattern over time. These guidelines apply to the general case before personalization data is available, and should be overridden by individual pattern data whenever that data is present.

---

### Follicular Phase (Days 1-13 after period begins)

**Psychological state:**
Most users report this as their most functional period. Estrogen rises, mood typically stabilizes or lifts, cognitive capacity is generally better. For users with PMDD, this phase is often described as "feeling like myself again." There is frequently a post-crisis relief quality — the worst is over, for this cycle at least.

**Cognitive capacity:**
High. Can handle complex tasks, longer forms, multi-step processes, new information. This is the phase when users are most likely to review their data thoughtfully, read educational content, adjust settings, or explore new features.

**Emotional needs:**
- Acknowledgment that the hard part is behind her, for now
- Forward-looking information (what to expect as the cycle continues)
- Space to process the previous luteal window without having to re-enter it

**Design adaptations:**
- Restore full UI complexity
- Surface educational content and pattern insights
- Offer optional deeper engagement (reading their DRSP trends, understanding their data)
- This is the right time to request optional setup tasks (appointment reminders, condition settings, notification preferences)
- Warm tone, not clinical neutrality

**What NOT to show or ask:**
- Do not re-trigger the previous luteal phase by surfacing dramatic symptom summaries
- Do not surface crisis resources — this is a recovery phase, not a risk window
- Do not ask about severe symptoms that are phase-specific to luteal

---

### Ovulatory Phase (Day 14, ±2 days)

**Psychological state:**
Estrogen peaks, energy is often at its highest for the cycle. Testosterone also rises. For many users, this is the phase of highest social energy and clearest thinking. For users with conditions like PCOS, ovulation may not be predictable or may not occur regularly — this is an important caveat.

**Cognitive capacity:**
High to very high, but with individual variation. For users with irregular ovulation (PCOS, perimenopause), this data may not be available or may be unreliable.

**Emotional needs:**
- Accurate phase information without excessive enthusiasm
- For users with PCOS: acknowledgment that this phase may be variable or absent
- No toxic positivity about energy peaks ("This is your LUMINOUS day") — some users experience this phase as pleasant, others notice it as the last comfortable window before luteal begins

**Design adaptations:**
- Neutral to warm tone
- If the user has PCOS or irregular cycles: use predictive language with appropriate uncertainty, never hard predictions
- This is an appropriate time for pattern-sharing moments (appointment prep, data review)
- Surface relevant data about what their personal pattern shows for the upcoming luteal phase

**What NOT to show or ask:**
- Do not assume the user wants to celebrate this phase
- Do not use fertility-forward language — HormonaIQ is not a fertility app and ovulation framing should never imply pregnancy
- Do not, under any circumstances, use the phrase "your most fertile window"

---

### Early Luteal Phase (Days 15-21)

**Psychological state:**
Progesterone rises after ovulation. For most users, there is a noticeable shift in mood, energy, and cognitive tone — not dramatic yet, but present. Many describe this as "the feeling of the weather changing." Irritability may increase. Sleep quality often begins to shift. For users with ADHD, this phase frequently marks the beginning of medication efficacy reduction.

**Cognitive capacity:**
Moderately reduced from follicular and ovulation. Users can still engage with moderate complexity — reading, decisions, multi-step tasks — but may be less patient with friction. Emotional regulation requires more effort.

**Emotional needs:**
- Advance notice without alarm ("the shift is beginning")
- Practical information about what to expect
- A sense of being prepared, not ambushed
- Acknowledgment that irritability and fatigue are physiological, not personal failings

**Design adaptations:**
- Begin the phase color transition toward deeper lavender
- Reduce notification frequency — this is the start of the low-demand period
- Surface the "what to expect" information card that previews luteal peak
- Begin simplifying the UI slightly: fewer optional elements, slightly larger tap targets
- Tone shift: warmer, steadier, less educational and more companioning

**What NOT to show or ask:**
- Do not introduce new features, onboarding prompts, or settings reviews
- Do not surface content that requires high cognitive engagement (complex charts, long articles)
- Do not ask for feedback on the app experience — this is not the moment

---

### Luteal Peak / PMDD Phase (Days 22-28, variable by individual)

**Psychological state:**
This is the phase the entire app is built around. For users with PMDD, this window can include suicidal ideation, dissociative episodes, acute anxiety, clinical-level depressive symptoms, and a pervasive sense that the suffering is not temporary but permanent. Users frequently describe this phase as being unable to recognize themselves — "I stop being me." For users without PMDD but with significant PMS, the experience is milder but qualitatively similar.

This phase also carries a specific cognitive distortion: in the middle of it, it is very difficult to believe it will end. The app can directly counter this by providing historical evidence that it always has.

**Cognitive capacity:**
Severely limited. Reading long text is difficult. Making decisions is difficult. Multi-step processes are effectively impossible for many users at peak severity. Emotional regulation has very little reserve. The user who opens the app during luteal peak has almost nothing to give — the app must give, not take.

**Emotional needs:**
- Acknowledgment that this is real and serious, without pathologizing
- Evidence that this phase ends (historical data: "last month, this lasted five days")
- Company without demands — the "you are not alone" message, but shown through data, not announced
- Access to crisis resources without having those resources feel like an alarm
- Permission to rest, to not function, to be where they are without being told to do anything about it

**Design adaptations:**
- Phase color transitions to deeper lavender (#B8AAD4)
- UI simplification is maximum at this point: home screen shows only the most essential elements
- Single-tap check-in from home screen — no logging flow required, just one question answered once
- Font sizes increase slightly
- Tap targets increase
- All optional features pushed behind an additional layer
- Proactive, gentle reach-out once per day (not more)
- Tone: quiet, steady, honest, no optimism, no encouragement

**What NOT to show or ask:**
- No gamification of any kind — no streaks, no progress metrics
- No new feature prompts, onboarding nudges, or setting suggestions
- No educational content unless the user specifically seeks it
- No comparative data ("your worst day this cycle vs. other users") — this is not the moment for benchmarking
- No positivity of any kind — no "you're doing great," no "almost there," nothing that minimizes

---

### Menstruation Phase

**Psychological state:**
For most users with PMDD and significant PMS, the start of menstruation is accompanied by a dramatic shift — within hours for some, a day or two for others. The acute psychological symptoms lift. The relief is often described as profound and physical: "like a pressure releasing." This is not the same as feeling good — there is often physical pain, fatigue, and the beginning of processing the preceding luteal window. But the darkness lifts.

For users who have been in acute distress, the arrival of menstruation can also bring a processing moment: a kind of reckoning with what the luteal phase was. Some users feel grief. Some feel anger. Some feel simply grateful to be back.

**Cognitive capacity:**
Variable. The cognitive fog of late luteal typically lifts rapidly, but physical symptoms (cramps, fatigue, heavy bleeding) may reduce energy and focus. Most users can engage with moderate cognitive tasks.

**Emotional needs:**
- Acknowledgment of the relief (without overstating it — physical symptoms are real)
- Space to process without pressure to immediately engage with new tasks
- Gentle forward-looking information (the follicular phase is beginning)
- For users who experienced significant distress: a quiet acknowledgment of what they survived

**Design adaptations:**
- Phase color transitions to blush (#F2CFC9)
- Tone shifts to quieter and warmer
- Surface the "relief" message (see copy guidelines for specific language)
- Offer the option to log what the luteal phase felt like overall — but do not require it
- Begin transitioning toward follicular UI gradually

**What NOT to show or ask:**
- Do not immediately ramp up to follicular energy and complexity — allow transition time
- Do not celebrate the end of the cycle with gamification
- Do not ignore physical symptoms by pivoting too quickly to "you're back"
- Do not ask for detailed retrospective reviews of the luteal phase on the first day of menstruation

---

## SECTION 4 — Crisis Protocol

### The Fundamental Tension This Protocol Must Navigate

There are two failure modes for crisis design, and they are equally harmful:

**Under-response:** A user who is in genuine crisis reaches out through the app — or logs at crisis levels — and the app does not adequately respond. She feels unseen. She may not reach out again.

**Over-response:** A user who is logging expected luteal symptoms — including suicidal ideation that is a known, documented symptom of PMDD within her established pattern — is met with a full crisis intervention response. This tells her that her normal experience is an emergency. It is frightening, it is inaccurate, and it will cause her to under-report in future logging sessions, which destroys the clinical value of the data and leaves her feeling pathologized for having the condition she came here to track.

The protocol below navigates this tension through a three-tier system, calibrated to individual pattern data wherever available.

---

### Distinguishing "Normal Luteal Darkness" from Active Crisis

The clinical distinction between PMDD-related suicidal ideation and active suicidal crisis is real and significant, but it is not something the app can make. What the app can do is distinguish between:

**Within-pattern severity:** The user's logs show that she experiences suicidal ideation in the luteal phase, she has logged this before, she is currently in the predicted luteal window, and her current log is consistent with her historical pattern.

**Outside-pattern severity:** The user's logs show unprecedented severity — either scores dramatically above her personal baseline, or the presence of symptoms she has never previously logged, or distress occurring outside her typical window.

**Explicit expression of intent:** The user has, through a log or a text entry, expressed something that goes beyond passive ideation and suggests active planning or immediate risk.

The three-tier system responds differently to each of these situations.

---

### The Three-Tier Response System

**Tier 1: Passive Acknowledgment (for within-pattern severity)**

When: Suicidal ideation logged within established PMDD window, consistent with personal pattern, no escalation.

Response design:
- Log completes normally — no interruption to the logging flow
- At end of log, a quiet, phase-appropriate acknowledgment card appears, not a modal
- The card acknowledges the experience directly without alarming
- One soft link to additional support resources, not prominent, not urgent

Example copy:
> "Logged. This kind of darkness in this phase is something your data has shown before. It's real and it's part of what we're tracking. If you'd like to talk to someone, we've made that easy to reach."

The link to resources is a quiet text link, not a button. It does not say "Crisis Hotline" in the heading — it says "Support."

What this achieves: The user is not alarmed. She is acknowledged. She is given a path to resources without being told she is in crisis.

---

**Tier 2: Active Check-In (for outside-pattern severity)**

When: Severity scores are meaningfully above the user's established baseline, or the user is experiencing symptoms they have not logged before, or the pattern is outside their typical luteal window.

Response design:
- An active check-in is triggered — not a pop-up, not a modal that blocks the screen, but a gentle in-app message sent within 15 minutes of the log
- The check-in asks directly: "That was a harder log than usual for you. Are you okay right now?"
- Three response options: "I'm okay," "I'm struggling," and "I need help now"
- "I'm okay" closes the check-in and logs the response
- "I'm struggling" opens a brief, calm, non-clinical conversation with grounding resources
- "I need help now" triggers Tier 3

Example check-in copy:
> "That was harder than your usual pattern for this phase. We noticed. Are you okay right now?"

---

**Tier 3: Crisis Resources (for explicit intent or "I need help now")**

When: User selects "I need help now," or the log contains explicit expressions of active intent.

Response design:
- Full-screen crisis resource screen, not a modal
- Warm acknowledgment at the top — not clinical, not alarming
- Three resources, clearly labeled, with the least-barrier option first:
  - Text line (lowest barrier for someone who cannot speak)
  - Phone line
  - Emergency services
- An option to call someone they trust — not a hotline
- The screen can be dismissed; it does not lock the app

Example copy for Tier 3 header:
> "You reached out, and that matters. Here are people who are available right now, any time of day or night."

This phrasing does not call her a crisis. It does not say she is in danger. It acknowledges that she asked for help and provides it.

---

### Exact Language for Crisis Moments

**What these moments require:**
- Direct, not clinical
- Calm, not urgent
- Human, not procedural
- Present, not forward-looking (don't tell her what will happen next — just be here now)

**What to avoid:**
- "If you are in immediate danger, call 911" as the first thing she reads — this creates panic rather than support for someone in a PMDD luteal crisis who is not in immediate physical danger but is suffering severely
- Mental health jargon
- Hollow validation ("your feelings are valid") — this is what doctors said before they moved on
- Long explanations of what the resources do — she doesn't have capacity for that
- Making her explain herself to access resources

---

### When NOT to Trigger Crisis UI

Specifying this explicitly, because over-triggering is the more common design mistake in health apps:

- Do not trigger crisis UI for a single high-distress log if it is within the user's established luteal pattern
- Do not trigger crisis UI for users who have explicitly indicated in their profile that they experience suicidal ideation as a PMDD symptom
- Do not trigger crisis UI for users who are in their first two cycles of tracking and have not yet established a pattern, unless severity scores are at the extreme end
- Do not trigger crisis UI based solely on mood emoji selection — mood data is too coarse for this
- Do not trigger crisis UI more than once per 48-hour period for the same user during an active luteal phase unless new triggering data is logged

---

### Post-Crisis Design: Re-Engaging Without Shame

When a user returns to the app after a crisis period — whether she used the crisis resources or not — the app must not reference the crisis directly unless she initiates it.

What this looks like:
- The app returns to normal phase-appropriate behavior
- The previous hard logs are in the data but are not surfaced immediately
- If the user opens the log within 1-2 days of a crisis-tier log, the logging screen opens normally — it does not re-display the crisis card or ask about the previous event

If the user navigates to her history and views the crisis-period logs, the app adds a quiet note:
> "This was a hard stretch. You're still here."

That is the entirety of the retrospective acknowledgment. No clinical interpretation. No "are you feeling better?" No reopening of what has passed.

---

### Legal and Ethical Considerations

This protocol was developed with reference to standard crisis response guidelines and should be reviewed by a licensed mental health professional before implementation. Specific requirements:

- The app cannot be classified as a crisis intervention service and must not represent itself as such
- All crisis resource information must be reviewed for accuracy before each release
- The three-tier protocol should be documented in the app's clinical advisory review process
- Any changes to Tier 2 or Tier 3 response design should require sign-off from the Head of Clinical Advisory (Dr. Amara Osei or equivalent)
- Data from crisis-tier logs must be handled with enhanced privacy protections and must never be transmitted without explicit, informed, specific user consent

---

## SECTION 5 — Community Psychology

### Why Community Is Specifically Therapeutic for This Demographic

For women who have spent years managing these conditions in isolation — without a diagnosis, without community, without the knowledge that others experience the same thing — the discovery of a community of people who share the experience is genuinely transformative.

The relief is not about getting advice. It is about recognition. It is about finding out that the thing you thought was uniquely wrong with you is, in fact, a documented and shared experience. Sarah found out she had PMDD on Reddit. Maya started trusting her own tracking after reading other PCOS women's experiences. The community provided what the medical system did not: an accurate mirror.

But — and this is critical — these same women report that existing communities can become exhausting. r/PCOS: "I wish PCOS spaces weren't so exhausting." The exhaustion comes from: the repetitive cycle of questions (every newly diagnosed person asks the same questions), the unsolicited medical advice, the emotional labor of holding space for acute distress when you are also in your own luteal phase, and the absence of any moderating intelligence that maintains quality or safety.

HormonaIQ's community must provide the therapeutic benefit of recognition without the exhaustion of unstructured open forums.

---

### Safe Community Design

**Anonymous by default.** Users should never be identifiable in community spaces without explicitly choosing to be. The default state is a chosen display name, with no profile photo and no link to tracked data. A user who wants to share her DRSP chart in the community can do so voluntarily — it should never happen automatically.

**Phase-segmented spaces.** "What is everyone in luteal feeling today?" is useful. "General discussion" is where communities go to become exhausting. Phase-segmented spaces ensure that when a user is in luteal, she is in a space with other people in luteal — people who are in the same cognitive and emotional state, who are not going to ask her to respond to a long thread about something that requires high-capacity thinking.

**Moderated.** Zero tolerance for medical misinformation, unsolicited treatment advice, and advice that could cause harm (supplement recommendation without clinical context, telling someone to stop a medication). Zero tolerance does not mean heavy-handed moderation of emotional expression — distress, anger, and grief should be allowed. What is not allowed is claiming clinical authority without it.

**Read-only mode always available.** The therapeutic benefit of community is available to a user who reads and does not write. The knowledge that 342 other people are in luteal today is meaningful even if she never posts a single word. The app must support passive participation as a full, legitimate mode of community engagement — not a second-class experience that constantly prompts her to post something.

---

### Preventing the "Exhausting Spaces" Problem

The most important structural choice is **phase segmentation**. A user who is in luteal peak is not in the right headspace to hold emotional space for someone who just got diagnosed and is in crisis. Keeping these populations in different spaces reduces the emotional labor that users in vulnerable phases are asked to carry.

Additional preventive design:

**Rate-limit distress content.** If a community space is showing a high density of high-distress posts within a short time window, reduce visibility of new high-distress posts for users who are themselves in luteal peak. This is not censorship — it is protecting users who have already indicated (through their tracked data) that they are at low capacity.

**The "I'm just reading" button.** A single tap that tells the app "I'm here but I'm not engaging" — which suppresses all community reply prompts and nudges for the current session. For a user in luteal who just wants to know she's not alone without being asked to contribute anything.

**Restrict advice-giving.** In community spaces, frame all interactions as sharing experience, not giving advice. The difference: "When I was in perimenopause I tried X and it helped me" is sharing experience. "You should try X" is giving advice. The copy and prompts of the community interface should consistently frame sharing over advising.

---

### Passive Community as a Full Design Priority

The number that appears on the home screen — "342 others are tracking luteal today" — is one of the most psychologically impactful features in the app, and it requires no posting, no engagement, no community participation.

This number does something specific: it tells a user who may be experiencing the cognitive distortion of "no one understands this" that there are three hundred people right now in the same phase, experiencing similar things. The distortion that she is uniquely broken is directly countered by data.

This feature should be:
- Always present on the home screen during luteal phase
- Never gamified (not a competition or a leaderboard)
- Anonymized completely
- Framed in terms of company, not comparison

The phrasing matters: "342 others are in luteal today" — not "you're one of 342 people tracking luteal" (which centers the count) and not "342 people are struggling like you" (which centers the struggle comparatively).

---

## SECTION 6 — The Proactive Companion Model

### Why Proactive Outreach Works for This Demographic

These women have spent years having to initiate everything. They initiate appointments. They initiate follow-ups. They initiate tracking. They initiate the conversation about what is wrong. The medical system has never proactively shown up for them. Their tracking apps have never reached out. The burden of engagement has been entirely theirs.

An app that reaches out first — that says "you're heading into luteal, I know what that means for you, here's what you can expect" — is providing something categorically different from what they've experienced. It is the system showing up, for once, rather than waiting to be asked.

This is the psychological root of why proactive outreach works. It is not about convenience. It is about a reversal of the habitual dynamic in which the user carries all the labor.

---

### How to Be Proactive Without Being Intrusive

The line between proactive and intrusive is calibrated by:

**Timing.** A proactive message sent at the right moment (two days before luteal, during a detected insomnia window) is helpful. A proactive message sent at a random time with no connection to the user's current state is noise.

**Relevance.** A proactive message that is specific to the user's pattern ("last month this phase lasted five days for you") is companioning. A proactive message that is generic ("the luteal phase can be challenging") is not worth the notification permission it uses.

**Volume.** One proactive message per day, maximum, during active phases. Zero proactive messages during follicular — this phase does not need the app's attention. The user should feel that the app knows when to speak and when to stay quiet.

**Opt-in control.** Users should have explicit control over which categories of proactive messages they receive, with the ability to turn off any category without turning off all notifications. Phase-awareness notifications, pattern discovery alerts, and crisis-adjacent notifications should each be independently controllable.

---

### The Difference Between Helpful Anticipation and Patronizing Assumption

Helpful anticipation is specific to the user's actual data:
> "Your data shows day 22 is typically when your hardest stretch begins. You're on day 20."

Patronizing assumption is general advice applied regardless of the user's individual pattern:
> "Heads up — this is when PMDD typically gets worse for most people."

The distinction is: anticipation works from her data. Assumption works from a generic model and applies it to her without her consent.

After two to three cycles of data, every proactive message should be grounded in the user's individual pattern, not in the population average. Until that data exists, messages should be appropriately hedged and framed as possibilities, not predictions.

---

### Timing: When to Reach Out, When to Stay Quiet

**Reach out:**
- Two to three days before predicted luteal peak (when she can still prepare)
- On the day of predicted menstruation onset (the relief message)
- During detected insomnia patterns (the 3AM message — optional, user-activated)
- When Ora has found a new pattern (appointment prep opportunity)
- When severity has been escalating across cycles (but see Tier 2 protocol)

**Stay quiet:**
- During follicular phase (unless the user has requested insight summaries)
- When the user has not logged in several days during follicular — absence during a good phase is not concerning
- When the user has recently acknowledged a crisis — give a 24-48 hour quiet window
- Immediately after a high-severity log — give the log time to breathe before following up
- When the user has dismissed the most recent proactive message — interpret this as a signal to reduce frequency temporarily

---

### The 3AM Design Principle

One of the consistent findings across user research is that this demographic is frequently awake in the early hours of the morning during luteal phase and during menstruation. Insomnia is a documented symptom of PMDD and perimenopause. For many of these women, 3AM is a known, recurring experience during their hard phases.

The 3AM notification is an opt-in feature: users can choose to receive a single notification if the app detects they are awake (via app open in the early morning hours) during a predicted hard phase. The notification is not sent routinely — it is triggered by evidence of wakefulness.

The message:
> "Can't sleep. You're not the only one awake right now."

What this achieves: It names the experience without alarming her. It tells her she is not alone. It is not a crisis resource — it does not assume distress beyond the insomnia. It simply shows up.

The notification should never be sent more than once per night. It should not include a call to action — it does not ask her to log anything, open the app, or engage with the community. It simply says: we know. You're not alone. That is the entirety of its design brief.

---

*Psychological Design Guidelines v1.0 | HormonaIQ | April 2026*
*Cross-reference: brand-team.md (user interviews, psychological research), brand-and-ux.md (phase color system, UI principles), copy-guidelines.md (specific copy for each scenario)*
