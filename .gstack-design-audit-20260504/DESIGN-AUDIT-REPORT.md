# HormonaIQ — Design Audit Report
**Date:** 2026-05-04  
**Auditor:** Visual audit via live browser + source inspection  
**Scope:** Landing page + all 5 app screens (Home, Log, Cycle, Insights, Profile)  
**Design spec:** DESIGN.md (Morning Garden system)

---

## Overall Grade: B+

The design system is well-defined and often followed with taste. Typography is beautiful. The eucalyptus palette is distinctive and right. What drags the score down: emoji used as decorative icons throughout (explicit DESIGN.md ban), inconsistent spacing at the macro scale (landing page), and one critical content error in Insights that exposes internal spec language to users.

---

## Section 1 — First Impression

**Landing:** Strong concept execution. Instrument Serif italic in the hero reads immediately as premium and differentiated — nothing else in the women's health space looks like this. The morning cream background + eucalyptus green combination is exactly right: warm without being pink, clinical without being cold.

**App:** The floating pill tabbar is excellent — one of the best nav implementations in the mobile health space. The CycleRing SVG with phase segments is immediately comprehensible and visually distinctive.

**Biggest first-impression gap:** The landing page has severe vertical whitespace bloat between the hero and the promise section on desktop. The gap is approximately 180px — far beyond the 64px `3xl` max in the spacing scale. First scroll feels like falling.

---

## Section 2 — Design System Compliance

### Typography ✅ / ⚠️

| Finding | Location | Severity |
|---------|----------|----------|
| Instrument Serif italic used correctly in hero | Landing, Home | ✅ Correct |
| "Good morning, you" caption above display heading is ~11px | Home | ⚠️ Medium |
| Display type used correctly max once per screen | All screens | ✅ Correct |
| JetBrains Mono visible on DRSP scale numbers in Log | Log | ✅ Correct |
| Cycle day counter in CycleRing uses correct JetBrains Mono | Home | ✅ Correct |
| Body copy on conditions cards is ~13px (should be 15px body) | Landing | ⚠️ Low |

### Color ✅ / ⚠️

| Finding | Location | Severity |
|---------|----------|----------|
| Eucalyptus correctly used for primary CTAs | All | ✅ |
| Cream background correctly applied | All | ✅ |
| Phase colors carry meaning (ring segments match palette) | Cycle | ✅ |
| Butter color used in Profile header — warm, correct | Profile | ✅ |
| CoralSoft used as icon circle background for quick tools | Home | ⚠️ Medium (see emoji section) |
| MintMist used as icon circle background | Home | ⚠️ Medium (see emoji section) |

### Spacing ⚠️

| Finding | Location | Severity |
|---------|----------|----------|
| Hero → promise section gap ~180px (spec max: 64px) | Landing | 🔴 HIGH |
| Waitlist card right half empty on desktop (card ~55% width) | Landing | 🔴 HIGH |
| Conditions grid renders full-width single column on desktop | Landing | ⚠️ Medium |
| App screens spacing consistent with 4px base unit | All app | ✅ |

### Radius ✅

All cards, buttons, and modals use tokens from spec (sm:10, md:18, lg:28, xl:40, pill). No rogue border-radius values observed.

---

## Section 3 — AI Slop / Banned Patterns

DESIGN.md explicitly states the app is "NOT wellness-cliché" and tone must be "Direct, honest, never therapeutic-speak." The DRSP-grade clinical positioning is undermined by the following:

### 3.1 Emoji as Decorative Section Icons — 🔴 CRITICAL (Landing)

All 3 promise cards use emoji as primary icons:
- 🌿 "Clinical scales, not vibes"
- 🌼 "Adult language, every page"  
- 🌳 "No condition left behind"

All 5 condition cards use emoji as visual anchors:
- 🌗 PMDD, 🌀 PCOS, 🌾 Perimenopause, 🌟 ADHD, 🌺 Endometriosis

**The copy says "Adult language" while the icons say Duolingo.** This is the most damaging inconsistency in the entire product. The app is positioning itself against Flo and generic cycle trackers — then decorating with the exact visual vocabulary those apps use.

**Expected:** Custom SVG icons or the decorative leaf motif from the design system. Organic shapes tied to the Morning Garden direction.

### 3.2 Emoji as Quick Tool Icons — 🔴 HIGH (Home screen)

Quick tool cards ("Episode Tracker", "Safety Plan") show emoji in colored circle containers:
- ⚡ in coral-soft circle
- ♡ in mint-mist circle

Same issue as landing. The safety plan is a crisis resource — it should not share visual language with a meditation app's feature grid.

### 3.3 Copy Check — ✅ Mostly clean

Landing copy avoids banned words. The phrase "Some days in this phase can feel really dark" (Home screen crisis link) is correctly direct per DESIGN.md tone rules. No "journey," "wellness," "empower," or "transform" observed in the main flows.

**One flag:** Profile screen settings label "Your Journey" — direct banned-copy violation if present. Verify in source (could not confirm from screenshot).

---

## Section 4 — Screen-by-Screen Findings

### 4.1 Landing Page

**Hero section**
- ✅ Instrument Serif italic headline lands correctly
- ✅ Badge ("Early Access · Waitlist Open") is restrained and clear
- ✅ CTA button pair (primary eucalyptus fill + secondary outline) correct hierarchy
- ⚠️ Hero sub-headline font size on mobile is borderline — verify it's body-l (17px) not caption (13px)
- ⚠️ DecorativeBlob animation: confirm `prefers-reduced-motion` respected (code has it; verify runtime)

**Promise section (scroll 1)**
- 🔴 Emoji icons (see 3.1 above)
- ⚠️ Card titles appear to be ~16px Inter 600 — should be h2 (18–20px Inter 600)
- ✅ Card body copy reads at correct size

**Conditions grid (scroll 2–3)**
- 🔴 Emoji icons (see 3.1 above)
- 🔴 Grid layout breaks on desktop: cards stack full-width instead of 2-3 column grid
- ✅ Condition descriptions are clinically-anchored and use correct tone ("Rotterdam phenotyping", "DRSP", "Greene Scale")
- ✅ The condition names are large and scannable

**Waitlist section (scroll 4–5)**
- 🔴 Card is left-aligned and ~55% width on desktop — right half of screen is empty
- ✅ Form field design is clean
- ✅ Privacy note ("No spam. Leave anytime.") is appropriately restrained
- ⚠️ WaitlistForm success/error states not visible in audit — verify they match design system

**FAQ section (scroll 5–6)**
- ✅ Accordion interaction appears correct
- ✅ Questions are substantive, not typical marketing FAQ pablum
- ⚠️ FAQ section background appears same cream as body — no visual separation from waitlist. Needs a subtle surface shift (cream-warm `#F4F0E5`) to signal section break

**Footer**
- ✅ Clean, minimal
- ✅ Legal links present
- ⚠️ Footer background color — confirm it's not pure white (`paper`) since that's reserved for clinical-data surfaces only

---

### 4.2 Home Screen

**Phase ring + ORA greeting**
- ✅ CycleRing SVG is the visual centerpiece it should be
- ✅ Phase pulse animation present (verify reduced-motion compliance)
- ✅ "ORA" greeting card with phase-aware message is correctly positioned
- ⚠️ "Good morning, you" eyebrow text above the display heading is very small (~11px). The display heading ("Day 14 · Ovulatory") then hits immediately. The hierarchy gap is too large — the eyebrow doesn't read as a label, it reads as an afterthought. Should be `caption` (13px) or `eyebrow` (11px 500 0.16em LS) with proper vertical rhythm

**Week-ahead forecast strip**
- ✅ Phase color chips for each day are correct
- ⚠️ Day labels are very small — verify minimum 11px eyebrow spec

**Crisis support link**
- ⚠️ "Some days in this phase can feel really dark." link renders in ~12px centered text immediately above the 60px "Log today" CTA. The intent (Crisis Tier 1: "soft lavender text link, not a red button") is correct per spec. But the type size makes it nearly invisible. The user's eye goes directly to the large green button. Safety-critical content needs at least `caption` (13px) with sufficient contrast — the current rendering is under-specified.
- 🔴 Contrast check: lavender text on cream background — verify this clears WCAG AA 4.5:1. Lavender on cream is a risky pairing.

**Quick tools grid**
- 🔴 Emoji in colored circles (see 3.2 above) — ⚡ Episode Tracker, ♡ Safety Plan

**ORA pattern cards / DRSP progress**
- ✅ Card surface colors (mint-mist, butter-tint) used correctly
- ✅ JetBrains Mono on numeric data
- ⚠️ "Log today" button at 60px height is correct spec (56px FAB equivalent). Verify the radius is `pill` (9999) not `xl` (40) — from screenshot it appears correct

**"Log today" CTA**
- ✅ Full-width pill, eucalyptus, prominent
- ✅ Correct hierarchy as primary action

---

### 4.3 Log Screen

**Fast log toggles**
- ✅ Clean toggle row at top — quick capture path visible
- ✅ Feeling picker with 5 options and tone circles is distinctive and on-brand

**Vibe feeling picker**
- ✅ The tone circles (color dots not emoji) are correctly using the palette
- ✅ Labels below circles are readable
- ⚠️ Active state indicator — verify the selected state has sufficient contrast (eucalyptus outline or background change)

**Cycle day strip**
- ✅ Day numbers with phase color chips — correct data visualization

**DRSP scale (20 items)**
- ✅ JetBrains Mono on scale numbers
- ✅ Grid layout for the 20-item scale is compact but legible
- ⚠️ Scale items: tap targets on the rating buttons — verify 44px minimum. At the scale density shown, buttons may be undersized

**SI item 12 (safety-critical)**
- ✅ Item 12 is visually distinguished from other DRSP items (based on source review)
- ⚠️ From screenshot alone the visual distinction was not obvious — needs clear visual separation from the other 19 items (border, background shift, or explicit label)

**Voice note**
- ✅ Microphone CTA is clearly positioned

**Save CTA**
- ✅ Eucalyptus full-width pill — consistent with Home CTA pattern

---

### 4.4 Cycle Screen

**Ring / Month / Week toggle**
- ✅ Segmented control at top is clean and clear
- ✅ Phase segment ring is the correct visual centerpiece

**Phase segment ring**
- ✅ Multi-segment arc with phase colors is excellent — this is the most distinctive visual element in the product
- ✅ Phase labels and day counts in center text use correct type hierarchy
- ✅ Phase colors match the spec tokens

**Month calendar grid**
- ✅ Day cells with phase color chips readable
- ⚠️ Today indicator — verify it uses `eucalyptus` or `eucalyptus-deep` outline, not a color that conflicts with phase colors

**Week column view**
- ✅ Column layout with phase headers

**Day detail modal**
- ✅ Modal animation (slide up + fade) is specified at 300ms ease-out — verify
- ⚠️ Modal header close button — verify 44px tap target

---

### 4.5 Insights Screen

**Empty state**
- 🔴 CRITICAL: Empty state text includes **"per C-PASS / spec §6.3"** — this is internal specification language exposed directly to users. Real users will see this and it will destroy trust immediately. This is a production-blocking bug, not a design preference.
- ⚠️ Empty state illustration / visual is minimal — needs a more inviting placeholder that explains what will appear here (e.g., a muted version of the chart type, with "Log 14+ days to unlock pattern insights")
- ✅ The empty state acknowledges there's nothing yet rather than showing fake data

**Chart / pattern cards (when populated)**
- Unable to audit in this session — screen is in empty state

---

### 4.6 Profile Screen

**Header card**
- ✅ Butter (`#F5E4B8`) background with initial-based avatar is warm and personal
- ✅ Name + condition tags are well-spaced
- ✅ The warmth of this card against the cream background is exactly the "Morning Garden" mood

**Settings list**
- ✅ Clean, Inter-based list — correct
- ✅ Section headers use Inter 600 at correct weight
- ⚠️ List item tap targets — verify 44px minimum
- ⚠️ Destructive action ("Delete account" if present) — verify it uses `danger` (`#B95446`) and is separated from non-destructive items

**Condition management**
- ✅ Condition chips with phase-associated colors are readable

---

## Section 5 — Interaction States

| Element | Found | Issue |
|---------|-------|-------|
| Primary button press state | Not verified (no interaction testing) | Need hover/press eucalyptus-deep |
| Toggle selected state | Not verified | Verify contrast |
| Tab bar active indicator | ✅ Eucalyptus fill visible | Correct |
| Calendar day selection | Not verified | Need eucalyptus ring |
| DRSP item selected | Not verified | Verify 44px targets |
| FAQ accordion open state | ✅ Appears functional | — |
| Modal backdrop dismiss | Not verified | — |

---

## Section 6 — Responsive / Layout

| Finding | Severity |
|---------|----------|
| App screens: mobile-only layout, no wide-screen variant (correct per spec "mobile-first, no wide-screen layout") | ✅ Correct |
| Landing: conditions grid collapses to single column on desktop | 🔴 HIGH |
| Landing: waitlist card left-aligned with 45% dead space on desktop | 🔴 HIGH |
| Landing: hero → promise gap ~180px on desktop | 🔴 HIGH |
| Landing: tablet breakpoint (768px) renders correctly | ✅ |
| Landing: mobile (375px) renders correctly | ✅ |

---

## Section 7 — Motion

| Finding | Severity |
|---------|----------|
| DecorativeBlob has `prefers-reduced-motion` check in source | ✅ |
| CycleRing pulse uses `useReducedMotion()` from react-native-reanimated | ✅ |
| Landing blob animation: 8px translate, 2deg rotate, 7s — within spec | ✅ |
| Tab active transition duration not verified | ⚠️ |
| Modal entrance animation not verified | ⚠️ |

---

## Section 8 — Content / Microcopy

| Finding | Severity |
|---------|----------|
| "per C-PASS / spec §6.3" in Insights empty state | 🔴 CRITICAL |
| Banned-copy audit: no "journey," "wellness," "empower" found in main flows | ✅ |
| "Some days in this phase can feel really dark" — correctly direct | ✅ |
| Condition descriptions use clinical language throughout | ✅ |
| Promise card copy ("Adult language, every page") correct tone | ✅ |
| "Your Journey" on Profile — verify presence, would be banned copy | ⚠️ Check |
| Medical disclaimer visibility on app screens | ⚠️ Not observed — required per spec |

---

## Section 9 — Ranked Issues

### 🔴 CRITICAL — Block before launch

1. **Insights empty state exposes "per C-PASS / spec §6.3"** — internal spec language visible to users. Production blocker.

2. **Emoji icons in Promise grid (🌿🌼🌳) and Conditions grid (🌗🌀🌾🌟🌺)** — directly contradicts the "NOT wellness-cliché" positioning and the clinical-grade identity. These are the most visible elements on the landing page after the hero text.

3. **Emoji icons in Home quick tools (⚡♡ in colored circles)** — same problem in the app, compounded by the fact that one of these is a Safety Plan (crisis resource).

### 🔴 HIGH — Fix before public beta

4. **Landing desktop layout: hero → promise gap ~180px** — first scroll feels broken

5. **Landing desktop layout: conditions grid single-column** — 5 cards stacked vertically on a 1440px screen wastes the layout

6. **Landing desktop layout: waitlist card unbalanced (55% width, right half empty)** — either center the card or make it full-width with two-column layout

7. **Crisis support link contrast on Home** — "Some days in this phase can feel really dark" in lavender on cream. Must pass WCAG AA 4.5:1. Lavender on cream typically fails. Verify and fix.

### ⚠️ MEDIUM — Fix before v1

8. **"Good morning, you" eyebrow on Home is too small** — doesn't read as a label at current size/contrast; hierarchy gap between it and the display heading below

9. **Medical disclaimer missing from visible app screens** — DESIGN.md safety spec requires it on "all in-app screens"

10. **DRSP scale tap targets** — at the density of 20 items in a grid, rating buttons may be under the 44px minimum

11. **FAQ section no visual separation from Waitlist** — same cream background creates a seamless wall of content; needs surface shift to cream-warm

12. **Footer background** — verify it's cream (`#FAFBF6`), not paper (`#FFFFFF`) which is reserved for clinical data surfaces

13. **SI item 12 visual distinction in Log** — safety-critical DRSP item needs clear visual separation from the other 19

### ⚠️ LOW — Polish pass

14. **Condition card body text on landing** — appears ~13px; should be 15px body per type scale

15. **Landing hero sub-headline** — verify body-l (17px), not caption

16. **"Your Journey" string in Profile** — verify not present (banned copy)

17. **Today indicator in Cycle calendar** — verify eucalyptus, not phase-color conflict

---

## Section 10 — Quick Wins (highest impact, lowest effort)

| Win | Files | Time |
|-----|-------|------|
| Replace emoji in PROMISES/CONDITIONS arrays with SVG icon components | `LandingScreen.tsx` | 2h |
| Replace emoji in quick tool cards with SVG | `home.tsx` | 30m |
| Fix Insights empty state copy — remove "per C-PASS / spec §6.3" | `insights.tsx` or similar | 5m |
| Landing desktop gap: add `maxGap={spacing['3xl']}` between hero and promises | `LandingScreen.tsx` | 30m |
| Waitlist card: center or expand to full-width on desktop | `LandingScreen.tsx` | 30m |
| Conditions grid: add 2-column grid on desktop breakpoint | `LandingScreen.tsx` | 1h |
| Crisis link: bump to 13px, verify contrast | `home.tsx` | 15m |
| Add medical disclaimer text to HomeScreen footer | `home.tsx` | 15m |

---

## Summary

The design system foundations are strong. The eucalyptus palette, Instrument Serif editorial moments, JetBrains Mono on clinical data, and the phase ring visualization are all excellent and distinctive. The tabbar floating pill is a standout mobile nav pattern.

The two acute problems are: (1) the emoji icon pattern throughout the landing page and app directly undercuts the clinical positioning in the one place where positioning matters most — what users see before they sign up, and (2) an internal spec string exposed live to users in Insights.

Everything else is refinement. Fix the emoji, fix the spec leak, tighten the desktop layout, and this is a strong B+ → A- product.

---

*Generated by gstack design-review — visual screenshots at `.gstack-design-audit-20260504/screenshots/`*

---

# Workflow Audit — Addendum
**Date:** 2026-05-04  
**Method:** Live browser interaction + full scroll on all screens  
**Screens added:** Onboarding, ORA, PMDD module, Perimenopause module, Tools  
**Screens re-examined:** Log (full scroll), Insights (confirmed), Profile (full)

---

## Critical Workflow Finding — Web Interaction Bug

**`TouchableOpacity` and `Pressable` `onPress` does not fire from browser click/pointer events.**

Every interactive element in the app that uses RN's `TouchableOpacity` or `Pressable` fails to trigger `onPress` when clicked via a browser. Confirmed failures:

- Onboarding "Continue →" button — does not advance steps
- "Log today" CTA on Home — does not navigate to /log
- Crisis support "tap here" link — does not open Tier-2 modal
- Tab bar navigation (Home/Log/Cycle/Insights/Profile) — none fire on click

The tab bar and screen navigation only work via direct URL navigation. This means the web build of this app has a fundamental interaction regression — the entire `onPress` event layer is non-functional in browser context.

**Severity: 🔴 CRITICAL for web mode.** On iOS/Android native this is a non-issue since RN touch events work correctly. But if anyone ever opens the web build, nothing is tappable.

**Root cause likely:** React Native web's event delegation expects pointer touch events or a specific bubbling sequence that headless Chrome doesn't produce for `TouchableOpacity`. The fix is to use `onClick` handlers on web-targeted elements, or wrap with `Platform.select`.

---

## Onboarding Flow

**Step 1 — "You found us."**

- ✅ Sprig icon (SVG plant) as the screen's decorative element — correct use of organic motif, not emoji
- ✅ Instrument Serif display "You found us." — lands perfectly
- ✅ 5-dot progress indicator in header — clear and restrained
- ✅ Year-of-birth picker: scrollable radio list, 1995 pre-selected, checkmark indicator on selection
- ✅ Ghost "I have an account" link below CTA — correct secondary hierarchy
- ⚠️ The YOB picker occupies ~80% of the screen height — users must scroll to the bottom to reach "Continue →". The button is below the fold on all viewport sizes. No sticky CTA or visible affordance that there's more below.
- 🔴 Continue button `onPress` non-functional on web (see above)
- ⚠️ Progress dots at top are too small (~6px) and very low contrast (sage dots on cream). A user can't tell which step they're on.

**Steps 2–5 (Ora intro, Conditions, Cycle basics, Notifications)**  
Could not walk through due to the `onPress` regression. Source confirms these exist (T-30 through T-36). Not audited visually.

---

## Log Screen — Full Scroll

**Vibe check section**
- ✅ 5 feeling options (Steady/Slight/Off/Heavy/Hard) use colored circles — NOT emoji. Correct design.
- ✅ Circle colors correctly follow the palette: sage → butter → coral-soft → coral → rose, mapping mood severity to palette severity. Intentional and readable.
- ✅ "How are you, really? A vibe check. Just for you — not part of your clinical record." — excellent framing, correct tone

**Cycle day strip**
- ✅ "Day 19 · Early luteal" with left/right chevrons to correct the date — simple and functional
- ✅ Phase label uses correct language (not "luteal phase 2" corporate speak)

**DRSP scale**
- ✅ Explanatory legend ("1 Not at all … 6 Extreme") in a fixed card above the items — users can reference without scrolling back
- ⚠️ Rating buttons (1–6) appear to be ~44px wide but only ~44px tall — passes minimum but tight. In brain fog mode these need to be 56px.
- ✅ JetBrains Mono correctly applied to the 1–6 rating numbers

**SI Item 12 — "Thoughts that life isn't worth living"**
- ✅ **Well done.** The item is visually separated in an outlined card with warm background, preceded by "Item 12 — important to track. There's no judgement here." The label is calm, non-alarmist, and the layout makes the separation unmistakable.
- ✅ No red color, no warning icon — the design doesn't stigmatize the question

**Functional impairment section**
- ✅ "Did symptoms interfere?" with subtitle "The DRSP needs this for diagnosis." — correct clinical framing, not buried

**Physical symptoms chips**
- ✅ Pill chip tags (Bloating, Cramps, Headache, Breast tenderness, Fatigue, Joint pain, Skin changes) — clean multi-select pattern
- ✅ Consistent chip style with screen's radius tokens

**Sleep scale**
- ✅ 5 options (None/Mild disruption/Moderate/Severe/Extreme) as horizontal pill strip — compact and scannable

**Voice note**
- ✅ "Quick voice note (optional)" with mic icon in eucalyptus circle — on-brand
- ✅ "Tap mic to add" placeholder — correctly restrained

**Save CTA**
- ✅ "✦ Save today's entry" — the ✦ glyph adds a slight ceremonial quality to the save action without being precious
- ✅ "🔒 On this device. Encrypted." directly below CTA — trust signal at the moment of commitment, correct placement
- ⚠️ The lock emoji (🔒) is the only emoji in the entire log screen. This is inconsistent with the no-emoji stance elsewhere. Should be replaced with a lock SVG icon.

---

## Insights Screen — Confirmed

The Insights screen confirms the critical finding from the static audit:

**Body text reads:** "Your DRSP report needs 2 cycles with at least 7 consecutive luteal-phase days and 5 consecutive follicular-phase days each **(per C-PASS / spec §6.3)**."

This is live in the app. Real users will see "spec §6.3". **This is the single highest priority fix in the entire product.**

Secondary findings:
- ✅ "A pattern worth showing." display heading — Instrument Serif italic, correct
- ✅ Progress message "Cycle 1 · need 7 more luteal days · 5 more follicular days." — informative, not discouraging
- ✅ "Your first chart will show up here." placeholder — honest, no fake data
- ✅ "Log today →" link at bottom — correct secondary action placement
- ⚠️ Large empty space between the progress card and the placeholder card (~48px gap) — feels abandoned, not intentional

---

## ORA Screen

**Header**
- ✅ "CLINICAL INTELLIGENCE" eyebrow in correct style
- ✅ "Ora · On" in Instrument Serif italic with eucalyptus toggle — this is the best screen header in the app. The toggle next to the name is elegant and functional.

**Transparency card**
- ✅ "ORA · WHAT I SEE" with explicit data disclosure — "What I use: your DRSP scores and cycle dates from the last 90 days. What I don't see: your name, email, location." This is excellent. Privacy-forward without being defensive.
- ⚠️ "Got it" dismiss is centered plain text with no button affordance — looks like body copy, not a tappable action. Needs button styling or underline at minimum.

**Food logging**
- ✅ "No calories, no macros, no scores. Just context." — correct anti-diet framing
- ✅ Placeholder "Salmon, roasted veg, half avocado..." — normalizes real food, not diet-tracking

**DRSP chart**
- ✅ Bar chart using eucalyptus dark bars — data visualization is readable
- ⚠️ Chart bars are very dark (near-ink eucalyptus) on a white/paper background. Lacks phase color coding. A user cannot tell from the chart which bars correspond to which cycle phase — phase color context would make this far more meaningful.
- ✅ Day axis labels (1, 7, 14, 21, 28) correct JetBrains Mono

**ORA insight feedback**
- ✅ "Helpful · Not for me · Wrong about today" as dot-separated text links — minimal, correct
- ✅ ORA message uses correct direct tone: "I haven't seen enough of your cycle yet to say anything useful — about 2 weeks in, I'll start noticing things..."

**"Prepare for my appointment" CTA**
- ✅ Mint-mist background, secondary button style — correct hierarchy below the primary data

---

## PMDD Module

**Tab navigation strip**
- ✅ Horizontal scrollable pill tabs: DRSP Log | Crisis | Luteal | Safety | SSRI | Supps | Episodes | Relations | Work | Triggers | Community
- ✅ Active tab uses eucalyptus fill — correct
- ⚠️ "F9" feature tag prefix on the section eyebrow ("F9 · YOUR DRSP LOG SUMMARY") — internal feature flag ID exposed to users. Same class of issue as "spec §6.3" in Insights.

**DRSP Log tab**
- ✅ "Physician-ready, 2 cycles deep." — correct Instrument Serif italic with green emphasis on "2 cycles deep."
- ✅ "Generated from your prospective DRSP record. Not a diagnosis." — correctly scoped
- ✅ "Item 12 (suicidal ideation) excluded from this export." — present, correct placement
- ✅ Medical disclaimer at screen bottom — required and present

**CTA hierarchy**
- ✅ "Download PDF" primary eucalyptus fill — dominant
- ✅ "Email to my doctor" secondary outline — correct hierarchy
- ⚠️ "Email to my doctor" button uses outline style but the outline color appears to be `ink-3` (gray) rather than `eucalyptus`. Should use eucalyptus outline for brand consistency on secondary actions.

---

## Perimenopause Module

**Hot Flash logger**
- ✅ Three large equally-weighted buttons (Mild/Moderate/Severe) in mint-mist — this is a one-tap quick capture flow, the large target size is correct
- ✅ Night/day ratio stat uses JetBrains Mono on "0%" — correct
- ✅ "NO ENTRIES YET · Tap a button above to log your first hot flash." — clear empty state instruction

**Educational context card**
- ✅ "Some research describes associations between frequent moderate-severe night sweats and cardiovascular health in midlife. This is general background — it doesn't describe your individual risk." — this is an excellent example of the correct tone: honest, nuanced, not alarmist, not dismissive
- ✅ "Sources: SWAN Study; NAMS Position Statement" — citations visible, correct clinical credibility signal

**Tab strip**
- ⚠️ Some tab labels are abbreviations that need decoding: "STRAW+10", "GSM", "Cycle Mode" — users who are not clinically literate may not know what "GSM" (Genitourinary Syndrome of Menopause) means from the tab label alone. Consider a tooltip or expand on hover/focus.

---

## Tools Screen

**Header**
- ✅ "Your full toolkit." with Instrument Serif italic on "full toolkit." — correct
- ✅ "125 tools · adjusted to PMDD" — personalized count is a good trust signal
- ✅ Search field at top — correct for a library of 125 items
- ✅ Filter chips (All/Core/PMDD/Cross/Food/System) — functional categorization

**Section accordion**
- 🔴 "CORE · 8" section header shows chevron (▾ = expanded) but the section body is empty — no tools are rendered inside the expanded accordion. This is a rendering bug: the section appears expanded but has no content, just a large mint-mist void.
- This is visible to all users. The tools screen is effectively non-functional.

---

## Profile Screen — Confirmed

- ✅ Butter header card with initial avatar "S", "Your space", "Member since April 2026" — warm, correct
- ✅ No "Your Journey" banned copy confirmed — clean
- ✅ MY DATA grouped list in mint-mist card — correct surface
- ✅ "Lab vault" shows "Testosterone · SHBG · AMH · 11 more" as secondary value — informative
- ✅ "Medication & response" shows "2 active · cycle-aware" — good
- ✅ "Export my data JSON · CSV · PDF report" — all three formats, good for clinical use
- ✅ Toggle switches (Weight tracker, Food/body sensitive mode) — correct opt-in defaults
- ✅ "Show me data without questions today — Quiets prompts and share-actions for 24 hours." — thoughtful UX for hard days
- ⚠️ Section header "MY DATA" uses `eyebrow` style correctly, but "ACCOUNT" section at the bottom is cut off — verify the ACCOUNT section has a destructive "Delete account" with `danger` color

---

## Workflow Audit — Additional Issues Summary

| # | Finding | Severity |
|---|---------|----------|
| W1 | `onPress` non-functional on web for all `TouchableOpacity`/`Pressable` | 🔴 CRITICAL |
| W2 | Tools screen accordion section renders empty — no tools visible | 🔴 CRITICAL |
| W3 | "per C-PASS / spec §6.3" in Insights body text (confirmed live) | 🔴 CRITICAL |
| W4 | "F9 ·" feature ID in PMDD module eyebrow | ⚠️ HIGH |
| W5 | Onboarding Continue button below fold, no sticky CTA | ⚠️ HIGH |
| W6 | ORA chart has no phase color coding — bars are all one color | ⚠️ MEDIUM |
| W7 | ORA "Got it" has no button affordance | ⚠️ MEDIUM |
| W8 | 🔒 emoji in Log save area — only emoji in an otherwise emoji-free screen | ⚠️ LOW |
| W9 | DRSP rating buttons ~44px — at minimum, need 56px in brain fog mode | ⚠️ MEDIUM |
| W10 | Peri module tab labels (GSM, STRAW+10) not self-explanatory | ⚠️ LOW |
| W11 | Onboarding progress dots low contrast, indeterminate size | ⚠️ LOW |
| W12 | PMDD module "Email to my doctor" secondary button uses gray outline, not eucalyptus | ⚠️ LOW |

---

## What the Workflow Audit Confirmed as Working Well

- **SI item 12 handling** — the visual separation, neutral framing, and exclusion from PDF export is exactly right
- **Vibe check color system** — palette-mapped circles (not emoji) are on-brand and expressive
- **Save CTA trust signal** — "On this device. Encrypted." at the moment of save is excellent UX
- **ORA transparency card** — explicit data disclosure in plain language, not legalese
- **Hot flash logger** — large, instant, three-tap capture with cardiovascular context
- **Peri module educational card** — citations + nuanced language is the best health copy in the app
- **Profile sensitive mode toggles** — opt-in defaults for weight/food are thoughtful
- **DRSP Item 12 visual separation in log** — outstanding safety UX

---

*Workflow audit complete. Screenshots at `.gstack-design-audit-20260504/screenshots/workflow/`*
