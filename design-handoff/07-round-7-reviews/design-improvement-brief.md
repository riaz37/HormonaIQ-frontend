# Design Improvement Brief — For the Design Team
**From:** Nilab (founder)
**Date:** April 29, 2026
**Status:** UI is shipped and documented. This brief lists where the founder wants design elevation.

---

## Read this first

The product, design system, and a fully-shipped working prototype already exist. Before you propose anything, read these in order:

1. **[`docs/design-team-handoff.md`](design-team-handoff.md)** — what to read, in what order. This is your map.
2. **[`DESIGN.md`](../DESIGN.md)** (root) — the design system. Single source of truth.
3. **[`docs/04-design/`](04-design/)** — the deeper design docs (brand, copy, psychology, components, tokens).

Also open the prototype in your browser:
```
cd app/ && python3 -m http.server 8765
# then open http://localhost:8765/HormonaIQ.html
```

Once you've read those, come back here for the specific elevation requests.

---

## What this brief is

I built the UI and the documentation. It's all there. What I want from you isn't a redesign — it's **subtle elevation**. The bones are right; I want the design team's eye on the polish moments where the prototype currently reads "good enough" instead of "premium and refreshing."

Below are the specific places I've already noticed. Treat them as starting points, not the full list. As you go through the prototype you'll spot more — please flag them.

---

## Specific elevation requests

### 1. Landing page hero — needs a waitlist counter + more premium feel

**Where:** `app/src/landing.jsx` — the hero section visible at first paint.

**Current state:**
- Headline: "You already knew. *Now your doctor will too.*"
- Subhead: "The average woman with PMDD waits 12 years and sees 6 providers..."
- Two CTAs: "Join the waitlist" (primary) + "See how it works" (outline)
- Below CTAs: "Reviewed by clinicians who treat PMDD, PCOS, and perimenopause"
- Right side: cycle ring visual on a warm gradient card, "Day 19 — early luteal" + "*that makes sense.*" pill
- "For women who already knew" eyebrow pill at top

**What I want:**

**a. A waitlist counter (real number, not fabricated).**
Earlier in the sprint we explicitly removed the fabricated "2,847 women on the waitlist" line because we have a no-fabricated-stats rule. But the social-proof signal is still missing. I want the real version. Two paths:

- **Path A (recommended):** Wire to a real backend counter. When the count crosses a credible threshold (e.g., ≥200 sign-ups), display "Join {N} women on the waitlist" with subtle live-update micro-animation when the number ticks. Below the threshold, hide the line entirely.
- **Path B (interim):** Replace the count with verifiable proof: "Reviewed by [X] clinicians" with named clinician initials/headshots in a small row. This is true today and useful proof.

The design team should propose how this counter visually integrates without becoming a SaaS-template "social proof bar." Premium products handle social proof with restraint.

**b. The hero feels static. Add subtle life.**
The cycle ring + warm gradient card on the right is the visual centerpiece. Right now it's a still image. What if:
- The cycle ring pulses gently at "Day 19" (like a heartbeat — slow, 4–6s breathing)
- The leaf decorations drift very slowly (already defined as `drift` animation — 7s — but might not be wired here)
- The "*that makes sense.*" pill fades in 600–800ms after the rest of the hero
- A very subtle gradient shift on the warm card (cream → butter shift over 30 seconds, almost imperceptible)

The point: the hero should feel alive without being busy. Headspace's marquee animations are the reference.

**c. More editorial weight on the headline.**
"You already knew. Now your doctor will too." is a great line. The Instrument Serif italic on "*Now your doctor will too.*" is right. But on a wide screen the headline could push to `clamp(48px, 7vw, 96px)` instead of the current `clamp(40px, 6vw, 76px)` — give it more poster energy.

**d. Premium signals to layer in:**
- A subtle paper-texture overlay on the warm card (very faint noise, ~3% opacity)
- More refined kerning on the wordmark (already specified in `DESIGN.md` — verify it's actually applied)
- A signature pull-quote from a real clinician below the fold (when one exists)
- The "How it works" link in the topbar could have a subtle underline-animate on hover

---

### 2. DRSP daily entry — feels too survey-form, needs to feel refreshing

**Where:** `app/src/daily-log.jsx` — the 11-domain × 6-point grid the user fills out daily.

**Current state:**
- Anchor legend at top: "1 Not at all / 2 Minimal / 3 Mild / 4 Moderate / 5 Severe / 6 Extreme"
- 11 question rows + 1 SI item + 3 functional impairment rows = 15 rows
- Each row has a question label + 6 separate tap-target boxes labeled 1, 2, 3, 4, 5, 6
- Total: 90+ tap targets visible at once
- Functionally correct, clinically valid, but visually dense and form-y

**The clinical constraint (do not break this):**
Per `docs/01-clinical/pmdd-complete-spec.md` and `docs/04-design/psychological-guidelines.md`, the DRSP scale must remain a **6-point per-symptom scale** with the exact anchors. We can't reduce items, can't change the scale, and tap targets must be ≥44px (≥56px in Brain Fog Mode). Anti-anchoring rule applies — yesterday's score must NOT pre-fill or display.

**Within those constraints, what I want:**

**a. Make the grid breathe.** Right now 15 rows × 6 buttons feels like a survey questionnaire. What if:
- More vertical space between rows (24–28px gap, not 16px)
- Each row gets a subtle phase-tinted background that shifts as the user moves through (the active row has a light sage-pale wash)
- Question labels in `Instrument Serif` (medium weight) instead of Inter — gives each item literary weight, not form-field weight

**b. Replace the 6 separate boxes with a single severity slider OR a connected segmented control.**
Two design options to explore:
- **Option 1: Slider.** A horizontal slider with 6 detents, labels above (1-Not at all, 6-Extreme). Feels more tactile, less form-y.
- **Option 2: Connected segmented control.** Six numbers but visually joined into a single pill, with a sliding selection indicator that animates between detents. Apple Music-style.

Both keep the ≥44px tap target and 6-point scale. Both feel more refreshing than 6 separate boxes.

**c. Progressive reveal.**
Show 1–3 questions at a time, scroll to reveal more. Or: collapse all to one-line summary chips after answering, expanding only the unanswered one. Reduces visual density during entry without changing what's tracked.

**d. Subtle micro-feedback on tap.**
When the user selects a value, the chosen number animates slightly (scale 1.04, 120ms spring), the row could subtly fade-up the next question, and a very faint sound (`<audio>`-tag click, optional and off by default per privacy) confirms the tap. Premium products have this; we don't yet.

**e. A progress indicator that doesn't gamify.**
Per the no-gamification rule we can't show "5/11 — keep going!" But a quiet visual progress could exist as the rows themselves fade from uncolored → color-shifted as they're answered. The user sees their entry building visually without a pointer-finger metric.

**f. "I'm having a baseline day" shortcut at the top.**
For users who genuinely have a low-symptom day, a single chip "Today is a baseline day — log all items as 1" pre-fills the form. They can still adjust any individual item. Removes the friction of tapping "1" 15 times on follicular days. Important: this must NEVER be the default; it's an explicit user action.

**g. Frame the whole screen with one calming line at the top.**
Currently it dives straight into the anchor legend. What about: a single phase-aware Ora line at top — *"Day 19. We're in early luteal — let me know how things are landing."* — sets the emotional tone before the clinical work starts.

---

### 3. Other places to look (open call to the design team)

While you're in the prototype, these are spots I'd want a design eye on:

| Surface | Where | What to look for |
|---------|-------|------------------|
| **Tools tab** | `app/src/tools.jsx` | Currently 56 cards in condition-tinted groups. Visually correct, but could it feel more like a curated toolkit and less like a directory? |
| **Onboarding step 1 ("You found us.")** | `app/src/onboarding.jsx` | The brand's first emotional contact. Does it feel like the moment it should be? |
| **Onboarding step 7 ("that makes sense.")** | `app/src/onboarding.jsx` | The emotional pivot. Currently 44px italic — could it be even more of a moment? |
| **Save-state confirmation** | `app/src/daily-log.jsx` | Currently a small mint check + "Day {n} recorded." — minimal by design. Right register, or could it have one more moment of warmth without breaking the no-celebration rule? |
| **Crisis Tier 3 modal** | `app/src/crisis-service.jsx` | Highest-stakes design moment. Get the emotional calibration exactly right. |
| **Profile screen** | `app/src/profile.jsx` | Has a leaf decoration + tinted group cards. Does ownership of the data feel evident? |
| **Calendar Ring view** | `app/src/calendar.jsx` | The default view. Should be a beautiful artifact, not just a data view. |
| **Empty states** | Various | Already use the `EmptyState` component. Could each one have its own moment of warmth specific to the feature? |
| **Dark mode at 3am** | Toggle dark mode + brain-fog mode | The most vulnerable moment in the product. Does it feel like a quiet companion or a glowing screen? |
| **Phase color luteal-deep transition** | `app/src/shared.jsx` CycleRing | The 5-segment ring crossing into late-luteal coral. Does that visual transition land with the emotional weight it should? |

---

## How to deliver feedback

The design team can return work in any of these formats:

1. **Annotated screenshots** — Loom / Figma comments / Marvel / etc. Best for quick polish notes.
2. **Figma file with proposed updates** — works well for component-level work.
3. **A markdown response doc** committed to `docs/design-feedback/` (create the folder if it doesn't exist) with sections per surface, including: current observation, proposed change, rationale.
4. **PRs against the prototype directly** — for small visual fixes, open PRs against `app/src/*.jsx` and `app/HormonaIQ.html`. Each PR should reference the section of `DESIGN.md` it affects, and add a row to the decisions log if it's a system-level change.

For copy / voice work, route through the `copy-guidelines.md` rules. For trauma-informed surfaces (luteal screens, crisis cards, anything around suicidal ideation, food/weight), route through `psychological-guidelines.md` and `medical-ethics.md` first — these are non-negotiable.

---

## What I'm explicitly NOT asking for

These are **hard locks** — they have clinical, ethical, or legal reasons that aren't up for design negotiation:

- **No new features.** All 56 features in `docs/02-product/features.md` are shipped. Don't propose new ones until the existing ones land.
- **No changes to clinical scales.** DRSP 6-point per-symptom scale, Ferriman-Gallwey 0–4 per site × 9 sites, HOMA-IR thresholds, Greene Climacteric subscale maxes, STRAW+10 staging — all locked by clinical spec. The visual *presentation* of these scales is open (see DRSP elevation request above), but the data model and scoring rules are not.
- **No changes to crisis copy.** Locked verbatim per `medical-ethics.md` §3.4. The visual treatment of crisis cards is open; the words inside are not.
- **No calorie counts, weight-loss framing, fertility prediction, or partner-shared dashboards.** These are in the permanent never-build list (`docs/02-product/features.md` final section) for documented ethical reasons. Don't propose them.

---

## What IS open to your judgment

Palette, brand direction, aesthetic, typography, layout language, motion language — **all of it is open to improvement.** Morning Garden is what we landed on this round, not what we're forever-married to. If the design team proposes a palette / brand / aesthetic that's genuinely better — more refreshing, more premium, more on-brief for the user we're building for — bring it. We'll consider it on merit.

The bar to clear is high but not closed:

- Show why your direction beats Morning Garden specifically (what does it solve that Morning Garden doesn't?)
- Keep the brand promise: refreshing, honest, warm, sharp, brave — and the explicit "what this is NOT" guards in `brand-and-ux.md` (not a fertility app, not clinical-cold, not a wellness app, not a period tracker)
- Demonstrate it on the highest-stakes surfaces: luteal-peak Home, crisis card, DRSP report, Onboarding step 1 — if the new direction works there, it works everywhere
- Update `DESIGN.md` and add a row to the decisions log explaining the change and why
- Run it past the original review teams (Brand, Product/UX, Visual Design, Clinical, Psychology) before merging

Same logic applies for typography (we picked Instrument Serif + Inter + JetBrains Mono — propose better if you have it), for the leaf-decoration motif, for the cycle-ring visual treatment, for any system-level visual call.

If the team thinks any of the **hard locks** above should change, raise it as a discussion in `docs/design-feedback/` first — but expect a high bar. Those locks exist for clinical, ethical, or legal reasons, not aesthetic ones.

Don't ship code that contradicts the design system without a `DESIGN.md` decisions-log update.

---

## File map for this brief

```
DESIGN.md                                      ← the design system
docs/design-team-handoff.md                    ← reading order for new designers
docs/design-improvement-brief.md               ← THIS FILE (what to elevate)
docs/04-design/                                ← deeper design docs
docs/01-clinical/                              ← what PMDD / PCOS are (context)
docs/03-ora/ora-persona.md                     ← AI companion voice
docs/05-safety/                                ← safety + ethics (do-not rules)
docs/09-research/user-personas.md              ← who you're designing for
docs/09-research/{pmdd,pcos}-user-voice.md     ← real user quotes

app/HormonaIQ.html                             ← the working prototype
app/src/                                       ← 16 JSX component files
```

---

*This brief is a living document. Add new elevation requests as we spot them. The design team can also append their observations directly here as they review the prototype.*
