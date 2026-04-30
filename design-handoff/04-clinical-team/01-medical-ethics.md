# HormonaIQ Medical Ethics & Clinical Boundaries

**Document version:** 1.0  
**Last updated:** 2026-04-26  
**Owner:** Product & Legal  
**Review cycle:** Quarterly, and before any major content or feature launch

---

## Purpose of This Document

This document defines the ethical and clinical operating boundaries for HormonaIQ. It is written for the founding team, any future employees, content moderators, legal reviewers, and third-party partners. Every person who ships a feature, writes copy, or responds to a user support ticket is bound by the standards here.

The central tension HormonaIQ navigates: we serve a population that has been systematically dismissed, misdiagnosed, and underserved by medicine — and we can genuinely help them — while operating as a consumer wellness app, not a healthcare provider. That distinction is not a legal technicality. It is a design principle that runs through every interaction.

---

## Section 1 — What HormonaIQ Is and Is Not

### 1.1 What HormonaIQ Is

HormonaIQ is:

- A **personal health journal** that allows users to log symptoms, moods, energy levels, sleep, medications, lab values, and cycle data over time.
- A **pattern recognition tool** that surfaces correlations between user-logged data points (e.g., "your logged irritability scores are consistently higher in days 21–28 of your cycle").
- An **educational resource** that provides evidence-based information about hormonal conditions including PMDD, PCOS, perimenopause, and ADHD-hormone interactions.
- A **self-advocacy tool** that helps users prepare for, and communicate with, their healthcare providers.
- A **community space** where users with shared conditions can connect, share experiences, and reduce isolation.

### 1.2 What HormonaIQ Is Not

HormonaIQ is **not**:

- A medical device, diagnostic instrument, or clinical assessment tool.
- A substitute for evaluation, diagnosis, or treatment by a licensed healthcare provider.
- A mental health treatment provider or crisis intervention service.
- A prescribing entity or source of individualized medical recommendations.
- A system for interpreting lab results in a clinical context.

These are not merely legal disclaimers. They represent the actual limits of what logged personal data and pattern recognition can do. No app can replicate the clinical judgment formed through physical examination, complete history, differential diagnosis, and professional training.

### 1.3 Regulatory Classification

**Current classification: General wellness app (not a medical device)**

Under FDA guidance (Digital Health Center of Excellence, 2022 Software Policy), HormonaIQ is designed to fall within the general wellness app category:

- We do not claim to diagnose, cure, treat, mitigate, or prevent any disease.
- We do not provide specific treatment recommendations.
- The app's intended use is to help users maintain or encourage a general state of health and wellbeing.

**What would change our classification to Software as a Medical Device (SaMD):**

Any feature or claim that references a specific disease or condition AND is intended to aid in diagnosis or drive clinical decision-making would trigger SaMD classification under FDA's Framework for Digital Health Technology. The following would push us into SaMD territory and require regulatory engagement before launch:

- Claiming the DRSP report "confirms" or "indicates" PMDD
- Algorithmic output that recommends specific medications or dose changes
- A "risk score" for any specific disease
- Integration with clinical decision support systems used by providers to make treatment decisions

**Our position:** We design for, and stay within, general wellness classification. Any feature proposed that could shift this classification must be reviewed by legal counsel with FDA regulatory experience before development begins — not before launch.

### 1.4 Language Implications

Regulatory classification has direct implications for every word we publish. See Section 2 for the full claims policy.

---

## Section 2 — Clinical Claims Policy

### 2.1 Allowed Language

The following language is approved for use in UI copy, push notifications, reports, educational content, marketing, and support communications:

| Context | Approved phrasing |
|---|---|
| Describing what the app does | "tracks," "logs," "records," "monitors your own data" |
| Describing patterns found | "your data shows," "you've logged," "a pattern appears in your entries" |
| Describing correlations | "correlates with," "appears to coincide with," "is consistent with" |
| Describing information provided | "research suggests," "evidence indicates," "studies have found," "according to [source]" |
| Referring to a condition | "you've indicated you experience PMDD," "symptoms you've logged may be consistent with" |
| Encouraging professional care | "consider discussing with your provider," "bring this report to your next appointment" |

### 2.2 Prohibited Language

The following language is **never permitted** in any user-facing context, regardless of how qualified it sounds:

- "This confirms you have [condition]"
- "You have PMDD" (or PCOS, perimenopause, etc.)
- "This is caused by [hormone/condition]"
- "You should take [medication/supplement]"
- "This dose is appropriate for you"
- "Your results are abnormal"
- "Based on your data, we recommend..."
- "This proves..." / "This diagnoses..." / "This treats..."
- "Clinically validated to..."
- "Medically approved..."

**The test:** Would a reasonable person reading this language believe they received a medical opinion? If yes, rewrite it.

### 2.3 Gray Zone Language — Requires Disclaimer

The following language is permitted only when paired with a required disclaimer (see 2.4):

- Any reference to the DRSP (Daily Record of Severity of Problems) and its relationship to PMDD diagnosis
- Pattern summaries that describe symptom clusters resembling a known condition
- Educational content about specific medications (SSRIs, hormonal contraceptives, progesterone)
- Statements about lab value ranges
- Any predictive statement ("based on your past cycles, you may experience...")

### 2.4 Required Disclaimers — Exact Text

**General disclaimer (appears in footer, settings, onboarding, and every report):**

> "HormonaIQ is a personal health tracking tool, not a medical device or diagnostic service. Nothing in this app constitutes medical advice. Always consult a qualified healthcare provider for diagnosis, treatment, or questions about your health."

**DRSP report disclaimer (must appear before the report is generated and rendered, not after):**

> "The DRSP (Daily Record of Severity of Problems) is a validated symptom tracking tool used in clinical settings to support — not replace — professional assessment of PMDD. Your completed DRSP reflects what you've logged. It does not diagnose PMDD. A diagnosis requires evaluation by a licensed healthcare provider, typically over at least two cycles. You are encouraged to share this report with your provider."

**Lab values disclaimer (appears adjacent to any entered lab result and any educational content about lab ranges):**

> "Lab values vary by laboratory, methodology, and individual context. The reference ranges shown here are general educational information. Only your healthcare provider can interpret your results in the context of your full clinical picture."

**Medication information disclaimer (appears before any content describing a medication's mechanism, dose, or effects):**

> "This information is educational only. HormonaIQ does not recommend, prescribe, or advise on medications. Medication decisions require a conversation with your prescribing provider."

**Prediction/forecast disclaimer (appears before any cycle prediction or symptom forecast):**

> "This estimate is based on the data you've logged and improves with more entries. It is not a medical prediction. Individual cycles vary."

### 2.5 The DRSP Report — Special Handling

The DRSP is a legitimate, peer-reviewed clinical tool (Freeman et al., 1996; validated in DSM-5 context). It is also the closest HormonaIQ comes to a diagnostic-adjacent output, which creates our highest risk of misinterpretation.

**Rules for DRSP report design:**

1. The report title is "Your DRSP Log Summary" — never "Your PMDD Assessment" or "PMDD Score."
2. The report renders the user's own logged data. It does not add a severity classification, diagnostic label, or clinical interpretation.
3. The report includes a visual representation of symptom patterns across the cycle. It does not include a "positive" or "negative" result for PMDD.
4. The required DRSP disclaimer (see 2.4) appears as a mandatory interstitial before the report renders. The user must acknowledge it. This is not a checkbox — it is a full-screen moment.
5. The report ends with: "Ready to talk to your doctor? Here's how to share this report." — with a share/export option.

---

## Section 3 — Crisis and Mental Health Ethics

### 3.1 Our Duty of Care Boundaries

HormonaIQ is not a mental health provider, crisis line, or emergency service. We do not have clinical staff. We cannot call for help on behalf of a user. We cannot verify a user's safety.

What we can do:

- Recognize that our users are a population with elevated risk of depression, suicidal ideation, and crisis moments — PMDD specifically is associated with suicidal ideation in the premenstrual phase.
- Design features that do not inadvertently harm users in crisis.
- Surface appropriate resources at the right moments without making the experience feel surveilled or clinical.
- Handle crisis-adjacent data with privacy protections that ensure the app is not a liability for users.
- Train all team members who interact with user data or support tickets on safe messaging.

We do not:

- Position ourselves as a mental health resource.
- Respond to crisis moments with AI-generated therapeutic content.
- Keep detailed records of crisis disclosures in a way that could be subpoenaed and used against a user.

### 3.2 Safe Messaging Guidelines

We follow the JED Foundation and American Foundation for Suicide Prevention (AFSP) safe messaging guidelines for all content, features, and user-facing copy involving mental health, self-harm, and suicidal ideation.

**Core principles:**

- **Do not ask directly about methods.** Safe messaging guidelines advise against clinical language like "are you thinking about suicide?" in non-clinical contexts. This language, without clinical training and follow-up capacity, can increase distress rather than reduce it.
- **Acknowledge without amplifying.** Validate the experience without dwelling on details of the method, plan, or intent.
- **Provide resources quickly and clearly.** Do not bury the resource after a paragraph of copy.
- **Do not make the user feel surveilled.** The trigger for a safety response should not be visible to the user as a system event.
- **Do not describe the crisis experience in detail.** Avoid language that could be perceived as romanticizing or normalizing.

### 3.3 What Triggers a Crisis Response

**Triggers that surface crisis resources:**

- User logs a "0" or lowest available score on a "reason for living" or "hopelessness" item (if such an item exists in a validated scale we integrate)
- User logs maximum severity (5/5) distress for 3 or more consecutive days
- User submits a journal entry that includes explicit language indicating suicidal ideation (NLP-based detection, with a conservative threshold — false positives are preferable to false negatives)
- User directly contacts support with language indicating crisis

**Triggers that do NOT escalate to a crisis response:**

- High distress scores on a single day (normal within PMDD experience)
- Negative mood entries ("I feel terrible," "I hate everything") without escalation indicators
- User describing frustration with their medical situation
- User expressing anger (including at self)

The distinction matters because over-triggering crisis responses creates alert fatigue and makes users feel pathologized for expressing normal distress within a condition that is defined by severe mood symptoms.

### 3.4 Safe Messaging Language — Approved Phrasing

When the app surfaces crisis resources, the following language is approved:

**In-app card (triggered, non-intrusive):**

> "You've been logging some really heavy days. That's real, and it matters. If things feel overwhelming right now, support is available — you don't have to get through this alone."

Followed by:

> "988 Suicide & Crisis Lifeline: call or text 988 (US)"  
> "IAPMD Peer Support: iapmd.org/support"  
> "Crisis Text Line: text HOME to 741741"

**In journal entry flow (if NLP flags a high-risk entry):**

> "What you wrote sounds really hard. We hear you. If you're in a difficult place right now, these resources are here for you."

Followed by same resource list.

**What we will never say:**

- "Are you thinking about hurting yourself?" (too clinical, requires clinical follow-up capacity)
- "Are you safe?" (implies we can assess or intervene)
- "This is a medical emergency." (we cannot determine this)
- "We are concerned about you." (implies we are monitoring — creates surveillance feeling)
- "Please call 911." (appropriate in some contexts; not appropriate as a default response to a distress log in a cycle tracking app — this level of escalation language can harm more than help)

### 3.5 Handoff Protocol to Professional Resources

When crisis resources are surfaced:

1. Resources are displayed immediately, without requiring the user to "confirm" their distress level first.
2. Resources include at minimum: 988 (US), IAPMD crisis support, Crisis Text Line.
3. For users who have indicated they are outside the US during onboarding, the app surfaces region-appropriate resources.
4. The handoff is a card or modal — not a redirect that takes the user away from the app without their intent.
5. The user can dismiss the resource card. We do not re-trigger it for the same entry.
6. If the user dismisses the card and continues logging, the app continues normally. We do not gate the experience behind a "I am safe" confirmation — this is coercive and counterproductive.

### 3.6 Documentation of Crisis Interactions — Privacy vs. Safety Tension

This is our most complex ethical tension.

**The risk:** If we log that a user experienced suicidal ideation on specific dates, that data could be subpoenaed in a legal proceeding. In a post-Dobbs environment, with the expansion of state-level surveillance of reproductive health data, a user's crisis history is not safe in our hands unless we design for that explicitly.

**Our policy:**

- Crisis detection events (NLP flags, resource surfacing) are stored as **temporary operational metadata only** — they are used to prevent re-triggering the same card, then purged within 72 hours.
- They are NOT stored in the user's permanent health log.
- They are NOT exportable.
- They are NOT visible to Clinical Partner accounts.
- Journal entry text is stored encrypted, client-side key where technically feasible, so that even HormonaIQ cannot read the content of journal entries in plaintext.
- In the event of a legal request for a specific user's crisis history, our legal position is: we do not maintain such records.

---

## Section 4 — Data Ethics

### 4.1 What Data We Collect and Why

We collect only data that directly enables the product's core purpose: helping users understand their own hormonal patterns.

| Data category | Why we collect it | Minimum retention |
|---|---|---|
| Cycle dates and phase | Core product function — cycle tracking | User-controlled |
| Symptom severity logs (mood, pain, energy, etc.) | Pattern recognition | User-controlled |
| Medication log entries | Correlation with symptom patterns | User-controlled |
| Lab value entries (user-entered) | Educational context for patterns | User-controlled |
| Journal text entries | Self-reflection; not used for analysis without consent | User-controlled |
| App usage analytics (anonymized, aggregated) | Product improvement | 12 months maximum |
| Device type, OS version | Technical support | 90 days |

**Purpose limitation:** Data collected for one purpose is not used for another. Symptom logs collected for personal pattern tracking are not used to train commercial models without explicit opt-in consent with clear explanation of what that means.

### 4.2 Data We Will Never Collect

We will never collect, infer, or store:

- **Fertility intent.** Whether a user is trying to conceive, avoiding pregnancy, or has no intent either way. We do not ask. We do not infer from cycle data.
- **Precise location data** without explicit, revocable, in-context consent for a specific feature that requires it.
- **Biometric data** beyond what the user explicitly enters (we do not pull passively from device sensors without consent).
- **Contacts or social graph data.**
- **Financial information** beyond what is required to process payment (handled by Stripe or equivalent — we do not store card data).
- **Insurance information.**
- **Employer or employer health plan information.**
- **Data about whether the user has sought an abortion, is pregnant, or has had a pregnancy loss** — this data, in the current legal environment, creates direct legal risk for users.

### 4.3 Data Retention Policy

- User health data (all logs) is retained as long as the account is active and for 30 days after account deletion, to allow recovery from accidental deletion.
- After 30 days post-deletion: all personal health data is permanently deleted from our systems. This is not an archive. It is a deletion.
- Anonymized, aggregated analytics data may be retained longer for product research, but it cannot be re-identified.
- Backups containing user data are purged on a rolling 30-day cycle.
- Users can request full data deletion at any time via Settings > Privacy > Delete My Data. This triggers the same 30-day process.

### 4.4 Legal Exposure Under Current US State Laws

Following the Supreme Court's 2022 Dobbs decision, period and reproductive health tracking data became legally sensitive in states that criminalize abortion access. As of 2026, multiple states have laws that could in theory compel disclosure of reproductive health data in investigations related to pregnancy outcomes.

**Our position:**

We are not a reproductive health app. We do not ask about pregnancies, fertility intent, or pregnancy outcomes. However, cycle tracking data, in the wrong legal context, could be used to infer these things.

**Our design response:**

1. We do not collect the categories listed in 4.2 that create the highest legal risk.
2. Our data architecture minimizes what we hold centrally. Where technically feasible, sensitive logs are encrypted with user-held keys.
3. We do not store data in states with active reproductive surveillance laws on infrastructure domiciled in those states.
4. We publish our government request policy (see 4.5) prominently and keep it updated.
5. We do not build features that would create a fertility intent inference engine, even if that data would be commercially valuable.

### 4.5 Government Data Request Policy

If we receive a legal demand for user data (subpoena, court order, law enforcement request):

1. We notify the affected user as soon as legally permitted. If a gag order prevents notification, we comply with the gag order but log the request for future transparency reporting.
2. We respond only to valid legal process. Informal requests or requests without legal authority are declined and logged.
3. We provide only the minimum data required by the legal demand. We do not provide data beyond what is specifically demanded.
4. We challenge overbroad demands. We retain legal counsel to contest requests that we believe exceed legal authority or constitute fishing expeditions.
5. We publish an annual transparency report disclosing the number of requests received, the number complied with, and the number challenged — without user-identifying detail.

**We will never voluntarily provide user health data to any government entity, law enforcement agency, employer, insurance company, or third party without valid legal process and user notification where permitted.**

### 4.6 Breach Notification Protocol

In the event of a data breach or unauthorized access to user data:

1. Internal detection → immediate escalation to CEO and legal counsel.
2. Scope assessment within 24 hours: what data, which users, what exposure risk.
3. Affected users notified within 72 hours of breach confirmation (exceeds GDPR standard of 72 hours for authority notification; we hold ourselves to user notification at the same standard).
4. Notification includes: what happened, what data was involved, what we are doing, what users should do.
5. State AG notification per applicable laws (currently required in all 50 US states for breaches above certain thresholds).
6. Public disclosure for material breaches affecting more than 500 users.

### 4.7 Position on Selling or Sharing Data

**We do not sell user health data. We do not share user health data with third parties for commercial purposes. This is not contingent on business conditions.**

This is a founding-level commitment. Violating it would constitute a material breach of user trust in a population that has already been exploited by medical institutions. The reputational and ethical cost is not recoverable.

What this means in practice:

- Health data is not shared with advertisers, data brokers, or analytics platforms.
- We do not use health data to serve behavioral advertising.
- Aggregated, fully anonymized research datasets may be shared with academic research institutions under strict data use agreements, only with explicit opt-in consent from users, and only when re-identification risk is negligible. Users are told exactly what the research is before they opt in.
- If HormonaIQ is acquired, the acquirer is bound by these policies under the terms of the acquisition. In the event of a change in these policies post-acquisition, users will be notified and given the right to delete their data before the new policy takes effect.

---

## Section 5 — Vulnerable Population Ethics

### 5.1 This Demographic as a Vulnerable Population

PMDD, PCOS, and perimenopause are conditions characterized by:

- Chronic, cyclically recurring symptoms that affect functioning
- High rates of comorbid depression and anxiety (PMDD in particular has a lifetime suicidal ideation rate estimated at 30–70% in clinical samples)
- A documented history of medical gaslighting (patients told symptoms are "just PMS," refused diagnosis, dismissed as hypochondriacs)
- Frequent interaction with healthcare systems that have failed them

This is not a casual wellness audience. Users who come to HormonaIQ often arrive with trauma from medical encounters. Design decisions must account for this.

**What this means in practice:**

- Validation language matters. Copy that implicitly dismisses or minimizes symptoms causes real harm.
- Do not use language that positions the app as an authority over the user's own experience ("your symptoms don't meet the threshold for...").
- Do not gamify health data in ways that create pressure or shame (no streaks for logging on your worst days).
- Educational content about conditions must include acknowledgment of the history of medical dismissal, not just clinical facts.

### 5.2 Special Protections for Minors

PMDD affects teenagers. Onset often coincides with puberty. Under-18 users are permitted on the platform with the following modifications:

**Age gate:** Users who indicate they are under 16 during onboarding are directed to a parent/guardian consent flow before proceeding. Users under 13 are hard-blocked (see Section 2, user-restrictions.md).

**For users 16–17:**

- Community access is restricted to read-only until a parent or guardian has verified their account.
- Content involving medication information includes an additional prompt: "Talk to a parent, guardian, or doctor about anything medication-related."
- Crisis response protocol includes: in addition to standard resources, the app surfaces the Teen Line (1-800-852-8336) and Crisis Text Line for teens (text HELLO to 741741).
- DRSP report is available but accompanied by an additional note: "Your doctor or a trusted adult can help you make sense of this information."
- Data deletion requests from under-18 users do not require parental consent — the user controls their own data.

**Under-18 data is never used in any form of aggregate research or model training, even anonymized, without explicit parental consent in addition to user consent.**

### 5.3 Eating Disorder Risk — PCOS and Weight Content

PCOS is frequently managed, in part, through dietary and lifestyle interventions. This is clinically appropriate. It also creates a direct collision with eating disorder risk.

PCOS users have elevated rates of eating disorders, body dysmorphia, and disordered eating, partly because medical providers have historically told PCOS patients to "just lose weight" without appropriate context or support.

**Content rules for weight and nutrition content in HormonaIQ:**

1. We never display a calorie counter or suggest a calorie target.
2. We do not include BMI as a tracked metric. BMI is not a useful clinical tool for PCOS management and its use in consumer contexts has been directly linked to disordered eating.
3. Any content about diet and PCOS is framed around symptom management and metabolic health — not weight loss as a goal.
4. We do not use "before and after" language or imagery.
5. Phrases like "lose weight," "slim down," or "get to a healthy weight" are prohibited in UI copy.
6. Users who log food intake (if we build food logging) are shown a reminder at least once per week: "Tracking food can be helpful for some people and harmful for others. It's okay to turn this off if it doesn't feel good."
7. All content related to weight and PCOS is reviewed by a registered dietitian with eating disorder training before publication.

### 5.4 Substance Use

Some users self-medicate symptoms with alcohol, cannabis, or other substances. This is a documented coping pattern in chronic pain and mood disorder populations.

**Our approach:**

- We do not moralize about substance use in any copy, notification, or UI element.
- If users log substance use, we treat it as a data point for their own pattern recognition, not a behavior to be flagged or corrected.
- We do not include warnings or judgmental language attached to substance use entries (e.g., no "alcohol can worsen PMDD symptoms" message triggered by a log entry — that is the user's research to do, not ours to push on them).
- Educational content about substance use and hormonal conditions is available and accurate, but accessed voluntarily — not pushed.

### 5.5 Pregnancy

Users may become pregnant while using the app. Some users track cycles specifically because they are managing fertility concerns (PCOS and fertility are closely linked).

**When a user indicates they are pregnant:**

- The app enters a "pregnancy pause" mode: standard PMDD/cycle tracking features are deprioritized in the UI.
- The user is given the option to archive their data, export it, or continue logging general health data without cycle-specific features.
- No assumptions are made about the outcome of the pregnancy. The app does not ask about pregnancy intent, fertility treatments, or outcomes.
- If the user indicates a pregnancy loss, the app does not surface cycle tracking prompts. It surfaces a single, non-intrusive message: "We're sorry for your loss. Your data is here whenever you're ready to return. There's no rush."
- Pregnancy loss data, if logged, is stored under the same privacy protections as all health data and is subject to the government request policy in 4.5.

---

## Section 6 — Content Moderation Ethics

### 6.1 Community Standards

HormonaIQ's community features (if launched) operate under the following standards:

**Permitted:**
- Personal experience sharing, including descriptions of severe symptoms
- Questions about conditions, treatments, and providers
- Emotional support exchanges
- Sharing of published research articles and links to credentialed sources
- Disagreement with mainstream medical advice, framed as personal experience ("I had a different experience with X")
- Frustration with the medical system

**Requires moderation review before posting (held, not removed):**
- Specific dosage recommendations ("I take X mg of Y and it helped")
- Claims that a specific treatment cured a condition
- Information about obtaining medications without a prescription

**Removed immediately:**
- Medical advice presented as authoritative fact to a specific user in response to a specific health situation
- Content targeting or exploiting under-18 users
- Content that violates safe messaging guidelines for crisis and suicide (detailed descriptions of methods, content that glorifies self-harm)
- Spam or commercial promotion disguised as personal experience

### 6.2 Medical Misinformation Policy

The hormonal health space has an active ecosystem of misinformation — unproven supplements marketed as PCOS cures, anti-medication sentiment that discourages users from treatments with actual evidence, and conspiracy-adjacent wellness content.

**Our approach is not to suppress dissent — it is to label uncertainty honestly.**

- Posts claiming unproven treatments are curative may be labeled with a "community experience, not medical guidance" tag rather than removed, unless they are actively dangerous.
- Anti-medication posts are not removed but may be tagged: "Medication decisions are personal. HormonaIQ encourages discussing options with your provider."
- We do not remove content simply because it disagrees with a pharmaceutical company's preferred narrative.
- We do not allow content that discourages users from seeking professional care for acute symptoms.
- We do not allow content that misrepresents scientific consensus on safety (e.g., claiming vaccines cause PCOS without evidence).

### 6.3 Moderation Team Wellbeing

Content moderators for a hormonal health community read crisis content, descriptions of medical trauma, eating disorder disclosures, and suicidal ideation regularly.

**Minimum standards for anyone performing moderation:**

- No moderator works more than 4 hours of active moderation without a break.
- All moderators are trained in safe messaging before they begin.
- All moderators have access to an EAP (Employee Assistance Program) or equivalent mental health support.
- A check-in protocol is in place: weekly brief with a team lead that includes a direct question about moderator wellbeing, not just content queues.
- Moderators are not required to read detailed descriptions of self-harm in full in order to make a moderation decision. The moderation tool is designed to allow partial review and escalation.
- Secondary traumatic stress is recognized explicitly as an occupational hazard of this role, and accommodation requests related to it are treated with the same seriousness as any other workplace health accommodation.
