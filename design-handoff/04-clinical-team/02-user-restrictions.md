# HormonaIQ User Restrictions & Safety Guardrails

**Document version:** 1.0  
**Last updated:** 2026-04-26  
**Owner:** Product & Engineering  
**Review cycle:** Quarterly, and before any feature launch that touches access control or safety logic

---

## Purpose of This Document

This document defines what different user types can access, what is restricted and why, and how safety guardrails are implemented in the product. It is the reference document for engineers building access logic, designers shaping gating decisions, and customer support handling access-related tickets.

Every restriction in this document has a reason. Business reasons alone are insufficient justification for gating features that affect user safety. Ethical reasons are documented alongside commercial ones.

---

## Section 1 — User Tiers and Access

### 1.1 Overview

HormonaIQ has three user types:

| Tier | Who it is | How they get it |
|---|---|---|
| **Free** | Anyone who creates an account | Default on signup |
| **Premium** | Paying subscribers | Monthly or annual subscription |
| **Clinical Partner** | Licensed healthcare providers using HormonaIQ with patients | Verified application, separate pricing |

### 1.2 Feature Access by Tier

| Feature | Free | Premium | Clinical Partner |
|---|---|---|---|
| Cycle tracking (start/end dates, phase display) | Yes | Yes | View only (patient-shared) |
| Daily symptom logging (mood, energy, pain, etc.) | Yes | Yes | View only (patient-shared) |
| Medication log | Yes | Yes | View only (patient-shared) |
| Journal entries | Yes | Yes | No access |
| DRSP log (symptom entry) | Yes | Yes | View only (patient-shared) |
| DRSP summary report (generated) | 2 cycles per lifetime | Unlimited | View only (patient-shared) |
| Pattern insights (cycle phase correlations) | Last 3 months | Full history | N/A |
| Lab value entry | Yes | Yes | View only (patient-shared) |
| Lab value context (educational reference ranges) | Limited | Full | N/A |
| Cycle predictions | After 3 cycles logged | After 2 cycles logged | N/A |
| Community access (read) | Yes | Yes | No |
| Community access (post) | After 7 days + email verified | Yes | No |
| Educational content library | Partial | Full | Clinical evidence summaries |
| Data export (full personal archive) | Yes | Yes | No (cannot export patient data) |
| Provider sharing (generate share link) | No | Yes | Receive only |
| Crisis resources access | Always, no tier restriction | Always | Always |
| Onboarding condition profile | Yes | Yes | N/A |

**Why some features are free when we could charge for them:**

- Crisis resources: gating emergency information behind a paywall is ethically indefensible.
- Medication and symptom logging: core to user safety; withholding it creates an incentive to underlog.
- Basic DRSP entry: the symptom tracking itself is the user's self-care practice; the report generation is the commercial feature.
- Community read access: users in medical crisis often come to communities first. Restricting passive access would harm our most vulnerable users.

### 1.3 Upgrade Prompts — When and How

Upgrade prompts must be:

- Contextually relevant (shown at the moment the user reaches a feature limit)
- Non-coercive (presented once at a natural moment, not repeated until user action)
- Never shown during crisis detection events (see Section 3.2)
- Never shown during high-distress logging moments

**Hard rules:**

- No upgrade prompt appears during any interaction where the app has detected a user is in distress (5/5 severity logged, NLP flag triggered, crisis resources surfaced).
- No upgrade prompt appears during the luteal phase peak window if the user's history shows this is their highest-distress window. (The app knows this from their pattern data. It would be ethically incoherent to use that pattern data to time a sales pitch at their lowest moment.)
- Upgrade prompts are never modal blocks that prevent the user from continuing an action. They are always dismissible with a single tap.
- A/B testing for upgrade prompt timing is only run on users outside distress windows, and distress-window exclusion logic is not a variable in the test.

---

## Section 2 — Age Restrictions

### 2.1 Minimum Age and Justification

**Minimum age for a standard account: 16**

PMDD onset frequently coincides with puberty. Excluding younger teens from a tool designed for their condition would harm them. At the same time, users under 16 require additional protections given that they are minors engaging with sensitive health data, mental health content, and community interaction.

### 2.2 Age Gate Implementation

During onboarding, users enter a date of birth. This is used to:

1. Block under-13 users completely (hard block, no exceptions — see 2.5).
2. Route under-16 users to a parental consent flow before account creation is complete.
3. Route 16–17 users to the modified experience described in 2.3.
4. Route 18+ users to the standard experience.

Date of birth is stored and used only for age-gating. It is not used for marketing segmentation or shared with third parties.

### 2.3 Under-18 Experience Modifications

For users 16–17 (verified minor accounts):

**Access changes:**

| Feature | Standard (18+) | Minor (16–17) |
|---|---|---|
| Community read access | Yes | Yes |
| Community post access | After 7 days | Requires parent/guardian verification |
| Medication log | Yes | Yes, with additional disclaimer |
| DRSP report | Yes | Yes, with additional framing note |
| Journal entries | Yes | Yes |
| Lab value entry | Yes | Yes, with additional note to discuss with adult |
| Data export | Yes | Yes (minor controls their own data) |

**Crisis response modifications for under-18 users:**

In addition to standard resources (988, Crisis Text Line, IAPMD), the under-18 crisis card surfaces:

- Teen Line: 1-800-852-8336 (6pm–10pm PT)
- Crisis Text Line teen entry point: text HELLO to 741741
- trevorproject.org (relevant for LGBTQ+ teens, and PCOS/hormonal conditions intersect with gender identity experiences)

The wording of the crisis card for under-18 users:

> "You're going through something really hard. That's not weakness — it's your body and brain chemistry doing something difficult. You deserve support. Here are people who get it."

### 2.4 Parental Consent Considerations

For users under 16, a parent or guardian must:

1. Provide a verified email address separate from the minor's.
2. Confirm they are the legal guardian.
3. Review a plain-language summary of what the app collects, stores, and shares.
4. Confirm consent for the minor to use the app.

**The minor retains full control of their health data.** The parent's role is consent-to-use, not data oversight. Parents cannot:

- Read the minor's journal entries.
- View the minor's symptom severity logs without the minor's explicit share.
- Delete the minor's data without the minor's consent (except in documented legal guardianship situations, handled through legal@hormonaiq.com).
- Revoke the minor's account access without the minor being notified first.

This design reflects a core value: a teenager's health data belongs to them. Parental oversight of a minor's menstrual and mental health data, without the minor's knowledge or consent, is a form of surveillance that we will not enable.

### 2.5 Under-13 Hard Block

Users who indicate they are under 13 during onboarding are blocked from account creation. No exception. No workaround path. No "ask a parent to register for you" option.

This is both a legal requirement (COPPA in the US) and an ethical one. We are not equipped to serve users under 13 safely, and our content — including community content, mental health logging, and crisis materials — is not designed for that age group.

If an under-13 user is detected on the platform (e.g., through a date-of-birth correction, a support ticket, or a community disclosure), the account is suspended pending age verification and a standard-form notification is sent explaining that the platform requires users to be at least 13, and that accounts for users under 16 require parental consent.

---

## Section 3 — Safety Guardrails

### 3.1 Severity Logging: What Happens at Maximum Distress

**Trigger:** User logs 5/5 (maximum available) distress, depression, hopelessness, or suicidal ideation severity on any individual logging item for 3 or more consecutive days.

**What happens:**

1. On day 3, the app surfaces the crisis resource card (see medical-ethics.md Section 3.4 for exact copy).
2. The resource card is presented as a supportive moment, not an alert. It appears at the end of the logging flow, not as an interruption.
3. The resource card is dismissible.
4. The app does not lock, restrict, or change any functionality based on this trigger.
5. The trigger resets after the user goes below maximum distress for 2 consecutive days.
6. The trigger event itself (that resources were surfaced) is stored as temporary operational metadata, purged within 72 hours, and is never visible to the user, never stored in their exportable log, and never accessible to Clinical Partners.

**What does NOT happen:**

- The app does not contact anyone.
- The app does not notify a Clinical Partner automatically.
- The app does not send a push notification to an emergency contact.
- The app does not restrict the user from logging.
- The app does not change the UI in ways that signal to the user that an "alert" has been triggered.

### 3.2 Crisis Detection: NLP-Based Flagging

Journal entries are optionally analyzed for language indicating acute crisis. This feature:

- Is opt-in only, with a clear explanation before consent: "HormonaIQ can gently check in with you during difficult moments. This works by looking for certain words or phrases in your journal. We never store or share this analysis — it runs locally on your device and doesn't leave it. You can turn this off at any time."
- Runs on-device where technically feasible (not server-side) to protect journal privacy.
- Uses a conservative detection threshold: the cost of a false negative (missing a person in crisis) is higher than the cost of a false positive (surfacing resources to someone who doesn't need them).
- When triggered, surfaces the standard crisis resource card.
- Does not escalate to any external party.
- Does not log the content of the journal entry that triggered the flag.

**What triggers the NLP flag (approximate categories, not final implementation):**

- Direct statements of intent to harm oneself
- Statements expressing a desire not to be alive
- Specific planning language

**What does NOT trigger the NLP flag:**

- General expressions of hopelessness or despair ("I don't see the point")
- Anger, including at self ("I hate myself")
- Frustration with the medical system
- Descriptions of severe physical or emotional pain without suicidal ideation language

### 3.3 Medication Tracking: Log vs. Advise Boundary

HormonaIQ allows users to log medications they take. It does not advise on medications.

**What the medication log can do:**

- Record medication name, dose (user-entered), frequency, and start/stop dates
- Display the log as part of the user's pattern data
- Surface an educational information card about a logged medication (pulled from a vetted database) when the user taps a medication entry
- Show correlation patterns between medication log entries and symptom severity trends

**What the medication log cannot do:**

- Recommend a medication or dose to a user
- Suggest that a user add or remove a medication
- Flag a logged dose as "too high" or "too low" (this requires clinical context we don't have)
- Alert a Clinical Partner automatically when a medication is logged or changed

**Required disclaimer for the medication log feature:**

> "Your medication log is a personal record, not medical guidance. Changes to any medication — including supplements — should be discussed with your prescribing provider."

This disclaimer appears once per session when the user accesses the medication log, and is included in all medication information cards.

### 3.4 Lab Value Input: Display vs. Interpret Boundary

Users can enter lab values (e.g., TSH, estradiol, progesterone, free testosterone, DHEA-S, fasting insulin). This is useful for tracking trends in their own data over time.

**What the lab value feature can do:**

- Store user-entered values with the date of the test
- Display a trend graph over time
- Show a general educational reference range alongside the user's value, clearly labeled as a general reference
- Allow the user to add notes to each entry

**What the lab value feature cannot do:**

- Declare a value "normal" or "abnormal" for this specific user
- Interpret a value in the context of the user's symptoms, cycle, or medications
- Recommend action based on a value
- Show a "flag" or "warning" indicator if a value falls outside a reference range (the reference range is not a clinical interpretation for that user)

**Required disclaimer for lab value display:**

> "Reference ranges shown are general educational information. Lab ranges vary by laboratory and individual. Only your healthcare provider can interpret your results in the context of your full health picture."

This disclaimer appears permanently adjacent to any lab value reference range display — not in a footer or tooltip that requires user action to reveal.

### 3.5 DRSP Report: Confidence and Gating Requirements

The DRSP report is generated only when sufficient data exists. This is both a data quality decision and an ethical one: generating a pattern report from inadequate data creates false confidence.

**Minimum data requirements before a DRSP report can be generated:**

- At least 2 full cycles of consecutive daily logging (a "full cycle" means logging on at least 75% of days)
- The user has completed at least one post-menstrual baseline week (to allow comparison between premenstrual and non-premenstrual days)

**If minimum data requirements are not met:**

The report generation button is grayed out, with a clear explanation: "Your DRSP report needs at least 2 full cycles of data to show meaningful patterns. You've completed [X] cycles so far. Keep logging — you're building something useful."

This message is not a push notification. It appears only when the user navigates to the report section. It does not create pressure to log on days when the user is unable to.

**Before report generation:**

The user sees a full-screen interstitial with the DRSP disclaimer (see medical-ethics.md Section 2.4). They must tap "I understand" to proceed. This is not a checkbox. It is a dedicated screen with the disclaimer as the primary content.

### 3.6 Cycle Predictions: Confidence Thresholds

The app shows cycle predictions (estimated next period, estimated luteal phase start, estimated ovulation window) only when sufficient cycle data exists.

**Minimum data before predictions are displayed:**

- Period start/end dates for at least 3 cycles
- For symptom phase predictions: at least 3 cycles of logged symptom data aligned with cycle phases

**Before minimum threshold:**

The prediction area shows: "Predictions get more accurate with more cycles. Log [X] more cycles to unlock phase predictions."

**Display requirements:**

- All cycle predictions include a confidence indicator. Below 3 cycles: "Early estimate — accuracy improves with more cycles logged."
- Predictions are never presented as certainties. Language: "Your next period may start around [date range]" — not "Your next period starts on [date]."
- Predictions are not shown as a countdown clock or in high-urgency visual framing. This reduces the risk that users treat them as clinical fact.

---

## Section 4 — Content Restrictions

### 4.1 What Users Cannot Post in Community

The following content is not permitted in any community space operated by HormonaIQ:

**Prohibited immediately on detection:**

- Specific medication dosage recommendations directed at another user ("you should try 100mg of X")
- Claims that a specific treatment, supplement, or protocol cured a condition, framed as universal advice
- "Ask me for my doctor's protocol" or DM solicitations for medical advice
- Content describing or glorifying self-harm in a way that violates safe messaging guidelines (detailed method descriptions, positive framing of self-harm as coping)
- Commercial promotion, affiliate links, or product promotion disguised as personal experience
- Content targeting under-18 users in a way designed to exploit their vulnerability
- Content that discloses another user's personal health information without their consent

**Requires moderator review before publication:**

- Supplement stacks with specific doses (can be shared as personal experience after moderation review, with a "personal experience" tag applied)
- Posts describing non-standard treatment protocols obtained outside standard medical care
- Posts that appear to encourage users to discontinue prescribed medications

### 4.2 Framing Required for "This Worked for Me" Posts

Experience-sharing is one of the most valuable things our community offers. It is also the most common vector for accidental medical misinformation.

The required framing for posts that describe personal treatment experiences:

Users are prompted during post composition (not after): "You're sharing something that worked for you — that's valuable. To keep this safe for others, we'll add a note that this is your personal experience, not medical advice. That OK?"

If the user confirms, the post is published with a system-added tag: "Personal experience — not medical advice. What works for one person may not work for another. Talk to your provider before making changes."

If the user declines this framing, the post is held for moderator review before publication.

### 4.3 Enforcement: Three-Strike System

**Strike 1:** Content removed, user notified with specific reason and relevant community guideline. No restriction applied.

**Strike 2:** Content removed, user notified, 7-day posting restriction. The user can still read and react to community content.

**Strike 3:** Content removed, user notified, permanent community posting ban. The user can still use all other app features. Community access is not the whole product.

**Automatic permanent ban (no strikes):**

- Content designed to exploit or harm minors
- Coordinated inauthentic behavior (multiple accounts operated by the same entity)
- Threats to other users or moderators

**Appeals:** All strike-based restrictions are appealable within 14 days. Appeals are reviewed by a human moderator (not the same one who applied the original strike). The appeal outcome is communicated within 5 business days.

---

## Section 5 — Data Access Restrictions

### 5.1 What Users Can Export

Users have the right to export everything they have logged. This is non-negotiable — it is their data.

**Exportable data (available in Settings > Privacy > Export My Data):**

- All symptom logs with dates and values
- All cycle start/end dates
- All medication log entries
- All lab value entries
- All journal text entries
- DRSP daily logs
- Account settings and condition profile
- All data as a structured JSON file and as a human-readable PDF

Export is available to all tiers. It is not a Premium feature.

Export requests are processed within 48 hours. The user receives a download link via email.

### 5.2 Export Format and Legal Risk Considerations

We design the export format with the user's legal safety in mind.

**What the export does NOT include:**

- Metadata showing when the user opened crisis resources (this is purged within 72 hours per medical-ethics.md Section 3.6)
- NLP crisis flag events (these are not stored beyond 72 hours)
- IP addresses, device identifiers, or location data tied to specific log entries
- Any inferred data that was not explicitly entered by the user (e.g., we do not infer or store "probable luteal phase" labels on historical data in a way that persists in the export)

**Why this matters:** In states where reproductive health data is legally sensitive, a user's exported data archive is something they could be compelled to produce. We design the export to contain the minimum interpretable information required to serve the user, not the maximum data we could technically include.

### 5.3 Third-Party Integration Guardrails

**Apple Health and Google Fit integration:**

- The user explicitly selects which data types to sync, in both directions (what HormonaIQ reads from Apple Health, and what it writes back).
- Default is no sync. The user opts in.
- HormonaIQ does not write reproductive health data to Apple Health or Google Fit without explicit user consent per data type.
- HormonaIQ does not read financial, location, or biometric sensor data from Apple Health without explicit user consent.
- The user can revoke the integration at any time from Settings > Integrations, and revocation immediately stops all data flow.

**Wearable device integrations (e.g., Oura, Whoop, Garmin):**

- Follows the same explicit-consent-per-data-type model.
- HormonaIQ reads: sleep data, HRV, resting heart rate, activity data.
- HormonaIQ does not read: continuous location, calendar data, or any data type not directly relevant to hormonal health pattern analysis.

**No third-party integration receives access to:**

- Journal entries
- Lab values
- Medication log
- DRSP logs or reports
- Any crisis-adjacent data

### 5.4 Provider Sharing

Clinical Partner access to a user's data requires:

1. The user explicitly generates a share link from their account (Settings > Sharing > Share with Provider).
2. The share link has a defined expiration (default 30 days, user-adjustable from 7 to 90 days).
3. The user sees exactly what data the share includes before generating the link — not a general summary, but a specific list of data types.
4. The user can revoke the share link at any time. Revocation immediately removes the provider's access.
5. The Clinical Partner cannot download or export the shared data. They can view it within the Clinical Partner dashboard.

**What a provider can see (when user has shared):**

- Symptom severity logs
- Cycle data
- Medication log
- Lab value entries
- DRSP log and generated report (if user has shared these specifically)
- Pattern insights generated from the above

**What a provider cannot see, even with a share link:**

- Journal entries (these are never shareable by design — the journal is a private space)
- Crisis resource access history
- Community activity
- Account settings, payment status, or tier information

**Providers cannot contact users through HormonaIQ.** The share link is one-way. There is no messaging feature between providers and users.

---

## Section 6 — Emergency Override Protocols

### 6.1 When the App Overrides User Preferences for Safety

In general, the app does not override user preferences. Autonomy is a core design value.

There is one exception: when a user has turned off all safety notifications and the app's passive detection (severity logging, NLP flagging) identifies a crisis-level event, the crisis resource card is surfaced once regardless of notification preferences.

**The logic:** A user turning off notifications to reduce anxiety during non-crisis moments should not result in the app going silent when those same signals reach crisis thresholds. The single override is narrow, specific, and occurs within the app flow — not as a push notification, not as an external contact.

This override is surfaced once per crisis event. If the user dismisses it, the app does not re-surface it for the same event.

### 6.2 When We Do Not Contact Emergency Services

HormonaIQ will never autonomously contact 911, emergency services, law enforcement, or emergency contacts on behalf of a user.

**Why:**

1. We cannot assess whether an emergency is real or requires the response level of 911.
2. An autonomous 911 contact for a user logging mental health distress in a cycle tracking app is likely to cause harm: police involvement in mental health crises causes documented harm to the people these interventions are intended to help, particularly for communities that have faced police violence.
3. The user's right to make decisions about when to seek emergency help is a form of autonomy we protect, even in crisis moments.
4. Contacting emergency services without user consent, in many jurisdictions, may violate privacy law.

**What we do instead:** We surface resources clearly and repeatedly as needed. We make the act of calling 988 or texting a crisis line as low-friction as possible — one tap from the resource card. We trust the user to take that step when they are ready.

### 6.3 When We Surface Crisis Resources Without the User Asking

In addition to the triggers in Section 3.1 and 3.2, crisis resources are surfaced proactively in the following contexts:

- During onboarding, as part of the "about this app" flow — so users know resources exist before they need them.
- In the educational content for PMDD specifically, because the PMDD-suicidality link is clinically documented and our users deserve to know this is a known phenomenon, not a personal failing.
- As a persistent, low-prominence link in the main navigation (a "support" or "resources" section) so it is always findable without requiring a crisis event to trigger it.

Resources surfaced proactively are presented in a tone of warmth and normalization, not alarm: "PMDD can bring really dark moments. A lot of people in this community have been there. Here's where to find support when you need it."

### 6.4 Designing These Moments So They Do Not Feel Like Surveillance

The greatest risk in safety features is that users who most need them disengage from the app because the features make them feel monitored.

**Design principles for all safety moments:**

- **No visible alerts.** The app does not show a red banner, emergency icon, or system-level alert. The safety moment looks like the rest of the app.
- **Warm, not clinical.** Copy is written in a human voice. It does not use clinical terminology like "ideation," "risk assessment," or "safety plan" in user-facing copy.
- **Control is visible.** Users can see and manage all safety settings in a dedicated section. The settings are written in plain language. The section is not buried.
- **No confirmation that a threshold was crossed.** The app does not tell the user "we detected that you may be in crisis." It simply surfaces resources in a caring way.
- **Dismissible, not blocking.** Every safety moment is a card or overlay that can be dismissed. Nothing blocks the user from continuing to use the app.
- **No record that the user can find.** The app does not add a marker to the user's timeline, log, or export indicating that a safety event occurred.
- **No third-party notification.** Not to a provider, not to an emergency contact (even if one is set), not to anyone.

The goal is: a user in crisis who has the app open has immediate, clear, human access to support. A user who is not in crisis and sees the card does not feel surveilled — they feel cared for.
