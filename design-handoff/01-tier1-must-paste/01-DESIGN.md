# Design System — HormonaIQ

> Single source of truth for every visual decision. If something on screen disagrees with this file, this file wins. Update the decisions log when you change anything.

## Product Context

- **What this is:** A women's hormonal-health companion app for PMDD, PCOS, perimenopause, and ADHD-hormone overlap. The app is a clinical-grade tracker that talks like a knowledgeable friend, not a hospital intake form.
- **Who it's for:** Adults (13+ with parental consent for under-16; verified-minor 16-17) who have been gaslit by doctors, dismissed for years, and need data their clinician will actually read. Many have ED histories and post-Roe privacy concerns.
- **Space/industry:** Women's health. Direct competitive frame: Flo, Clue, Belle. Differentiation frame: Apple Health (clarity) × Headspace (emotional warmth) × Linear (typography discipline). We are explicitly NOT a fertility app, NOT a wellness app, NOT a clinical-cold tool.
- **Project type:** Cross-platform consumer product — mobile-first responsive web app today, native shells planned. Marketing landing site lives in the same shell.
- **Memorable thing:** *"This isn't a period tracker. It's for the other weeks of the month — the ones no one else tracks."* Every visual decision serves that one sentence.

## Aesthetic Direction

- **Direction:** Refreshing organic minimalism — Morning Garden. Eucalyptus + sage + cream + butter + coral, layered with soft organic decoration (leaves, blobs, breathing animations) on top of a disciplined Inter + Instrument Serif typographic frame.
- **Decoration level:** Intentional. Not minimal (we want warmth), not maximal (we want clinical credibility). Decorative leaves and gradient blobs appear once per primary screen, anchored to corners, opacity 0.18–0.4, with `pointer-events: none`.
- **Mood:** Walking into a place with greenery and good weather. Refreshing, positive, healthy, comforting. The opposite of a clinical dashboard. Premium without being precious.
- **Reference brands:** Apple Health (clarity, breathing room), Headspace (warmth, soft motion), Linear/Notion (typographic discipline, generous whitespace).

### What this is NOT

- ❌ Not pink fertility-app (no hot pink, no flowers, no babies)
- ❌ Not clinical-cold (no doctor white, no hospital-blue, no stark grids)
- ❌ Not wellness-cliché (no crystals, no toxic positivity, no "manifest your best self")
- ❌ Not a Notion-template aesthetic (we have personality)
- ❌ Not Flo-genericism (we don't gradient-everything)

## Typography

Three families, each with a clear job. No system fonts as primary.

- **Display/Hero:** **Instrument Serif** (Google Fonts) — for emotional moments, hero headlines, "you found us" / "that makes sense" pivots, italicized accent words. Weight 400, occasionally italic.
- **Body / UI / Labels:** **Inter** — body copy, buttons, form labels, microcopy. Weights 400 / 500 / 600 / 700. Use 500 for CTAs and chips, 400 for body, 600 for UI section headers.
- **Data / Tables / Numerics:** **JetBrains Mono** — DRSP scale numbers, lab values, cycle day counters, dose strings. Weight 400 / 500. Always tabular-nums-equivalent.
- **Code:** JetBrains Mono (same family).
- **Loading:** Google Fonts via `<link>` preconnect + crossorigin in `app/HormonaIQ.html`. Fallback chains: Instrument Serif → Georgia → serif; Inter → -apple-system → sans-serif; JetBrains Mono → monospace.

### Type scale (locked in `app/HormonaIQ.html`, no inline overrides)

| Class | Family | Size | Weight | Line-height | Usage |
|-------|--------|------|--------|-------------|-------|
| `.display-xl` | Instrument Serif | clamp(40, 6vw, 76)px | 400 | 1.0 | Landing hero only |
| `.display` | Instrument Serif | 32px | 400 | 1.05 | Screen-level h1 |
| `.display-sm` | Instrument Serif | 26px | 400 | 1.15 | Module sheet headers |
| `.h1` | Instrument Serif | 30px | 400 | 1.15 | Section headers |
| `.h2` | Inter | 18–20px | 600 | 1.3 | Card titles |
| `.body-l` | Inter | 17px | 400 | 1.55 | Lead paragraphs |
| `.body` | Inter | 15px | 400 | 1.55 | Default body |
| `.caption` | Inter | 13px | 400 | 1.45 | Captions, metadata |
| `.data` | JetBrains Mono | 13px | 400 | — | Numerics |
| `.eyebrow` | Inter | 11px | 500 | — | Uppercase, letter-spacing 0.16em |

Italic-display (`.italic-display`) appears max **once per screen**, on the hero h1 only. Module sheet headers are roman, never italic.

## Color

### Approach
**Restrained-balanced.** One primary brand color (eucalyptus), one neutral surface family (cream → paper), one warm accent (butter), one severity accent (coral, used sparingly). Phase colors carry meaning, never decoration.

### The Morning Garden palette

#### Brand greens
| Token | Hex | Usage |
|-------|-----|-------|
| `--eucalyptus` | `#3F6F5A` | Primary CTAs, brand accent, link color |
| `--eucalyptus-deep` | `#2C5443` | Hover state on primary |
| `--eucalyptus-soft` | `#5C8A75` | Secondary emphasis |
| `--sage` | `#9CB89A` | Sage divider, secondary accent |
| `--sage-light` | `#C7D9C5` | Phase-follicular fill, gentle highlight |
| `--mint-mist` | `#DCEBDD` | Card-mint background, soft button bg |
| `--mint-pale` | `#ECF4EC` | Subtle hover, faint surface |

#### Neutrals (warm, not gray)
| Token | Hex | Usage |
|-------|-----|-------|
| `--ink` | `#1B2E25` | Primary text — warm near-black with green undertone |
| `--ink-2` | `#4A5C53` | Secondary text |
| `--ink-3` | `#7A8B82` | Captions, hints |
| `--ink-disabled` | `#B5C0BA` | Disabled state |
| `--paper` | `#FFFFFF` | Clinical-data-only surfaces (Lab Vault, doctor PDF) |
| `--cream` | `#FAFBF6` | Default app background — warm, breathing |
| `--cream-warm` | `#F4F0E5` | Card-warm surface, default content cards |

#### Warm accents
| Token | Hex | Usage |
|-------|-----|-------|
| `--butter` | `#F5E4B8` | Phase-ovulatory, gentle celebration |
| `--butter-deep` | `#E8C97A` | Notification dot, achievement chip |
| `--coral` | `#E89F86` | Phase-luteal, FAB, gentle attention |
| `--coral-soft` | `#F5C8B5` | Crisis-card surface (warm, never alarming red) |
| `--rose` | `#D88A95` | Phase-menstrual |

#### Phase colors (informational, never decorative)
| Token | Hex | Phase | Cycle days |
|-------|-----|-------|-----------|
| `--phase-follicular` | `#C7D9C5` | Follicular | 6 to ~45% of cycle length |
| `--phase-ovulatory` | `#F5E4B8` | Ovulatory | ~45–55% |
| `--phase-luteal` | `#E89F86` | Early luteal (Lm) | 55–78% |
| `--phase-luteal-deep` | `#C97962` | Late luteal / PMDD peak (Ls) | 78% to last 5 days |
| `--phase-menstrual` | `#B97A8A` | Menstrual | Last 5 days |

Phase colors are 5 distinct tiers. Late luteal (peak PMDD window, days ~22–26) is a deeper coral than early luteal — clinically the most important moment in the app, must be visually distinct.

#### Severity (charts only)
| Token | Hex | Usage |
|-------|-----|-------|
| `--severity-mild` | `#5C8A75` | DRSP 1–2 |
| `--severity-mod` | `#E8C97A` | DRSP 3–4 |
| `--severity-severe` | `#C97962` | DRSP 5–6 — chart bars only, NOT for danger CTAs |

#### Action / danger
| Token | Hex | Usage |
|-------|-----|-------|
| `--danger` | `#B95446` | Irreversible-action buttons only (delete, sign out). Decoupled from phase coral so "danger" never reads as "you're in luteal." |

### Dark mode

Dark mode is a deliberate redesign, not a token inversion. Surfaces become near-neutral dark grays with a faint green hint (`#181F1B`, `#1F2620`), NOT saturated eucalyptus-deep. Phase colors desaturate to ~60% (ember glow, not fluorescent). Shadows use warm-tinted black. A `[data-night-mode="true"]` tier auto-activates between 11pm–6am during predicted luteal peak — even darker, lower chroma, larger text.

```css
[data-theme="dark"] {
  --bg: #181F1B;
  --surface: #1F2620;
  --surface-elevated: #233B2D;
  --phase-follicular: #4F6E51;
  --phase-ovulatory: #8B7B45;
  --phase-luteal: #8E5848;
  --phase-luteal-deep: #6E3F33;
  --phase-menstrual: #74494F;
  /* …shadows warm-tinted black, butter/coral/mint ember-glow */
}
```

## Spacing

- **Base unit:** 4px (8-point system × 0.5 for tighter mobile rhythm).
- **Density:** Comfortable. Generous whitespace is the premium signal.
- **Scale:** `2xs(2) xs(4) sm(8) md(12) lg(18) xl(24) 2xl(28) 3xl(40) 4xl(64)`
- **Screen padding:** 24px horizontal, 28px bottom, 20px top.
- **Card internal padding:** 18px minimum (never below).
- **Card-to-card gap:** 12px minimum.
- **Section-to-section gap:** 28px.
- **Tap targets:** 44×44pt iOS / 48×48dp Android minimum. ≥56px during luteal peak (Brain Fog Mode auto-activates this).

## Layout

- **Approach:** Hybrid — disciplined grid for app surfaces (Home, Log, Tools, Profile), creative-editorial for marketing (Landing) and emotional moments (Onboarding hero, "that makes sense" pivot).
- **Grid:** Mobile single-column up to 540px; landing hero shifts to 1.05fr / 1fr at 900px+.
- **Max content width:** 440px for app shell (the device frame), 1200px for landing.
- **Border radius scale:**
  - `--radius-sm: 10px` (chips, scale buttons)
  - `--radius-md: 18px` (cards, inputs)
  - `--radius-lg: 28px` (modals)
  - `--radius-xl: 40px` (hero visual)
  - `--radius-pill: 999px` (buttons, phase pills, tabbar)

### Card variants (use rule)

| Class | Surface | Use case |
|-------|---------|----------|
| `.card` (default warm) | `linear-gradient(180deg, paper 0%, cream-warm 100%)` | Most content cards |
| `.card-warm` | `--cream-warm` solid | Hero / today moments, premium surfaces |
| `.card-mint` | `--mint-mist` | Calls-to-action, community moments |
| `.card-paper` | Pure paper white | Clinical data lists (Lab Vault) |
| `.card-clinical` | Paper + sharper border, no shadow, mono body | Doctor PDF previews only |

Default is warm. Plain white surfaces are an exception, used only for clinical numerical data. ~60% of cards explicitly `card-warm`; default `.card` already rides the warm gradient — visual warm coverage ~95%.

## Motion

- **Approach:** Intentional. Motion adds personality and signals state — never decorative for its own sake. Suspends globally when `prefers-reduced-motion` OR `state.reduceMotion === true` OR `state.brainFogMode === true` during luteal peak.
- **Easing:** `ease-out` for enter, `ease-in` for exit, `cubic-bezier(0.34, 1.56, 0.64, 1)` for primary buttons (gentle bounce).
- **Duration:** micro (50–100ms) / short (150–250ms — most transitions) / medium (250–400ms) / long (400–700ms — hero reveals).

### Defined animations

- `breathe` (4.5s) — primary buttons idle, active tab indicator, Tier-1 inline acknowledgments
- `float` (5s) — onboarding sprig, marketing hero accents
- `drift` (7s) — background blobs on every primary screen
- `fade-up` (0.6s) — every card list, staggered 60–100ms per item
- `leaf-grow` (0.8s) — `<Leaf>` decorations on first paint
- `pulse-ring` — central "Day {n}" label inside CycleRing, Ora notification dot
- `shimmer` — DRSP chart bars on initial render

## Tab bar / nav

- 5 tabs: Home / Log / Cycle / Tools / Ora
- Tab bar background: warm gradient `paper → cream-warm`
- Backdrop-filter blur 18px (floats over content)
- Active tab: eucalyptus fill, paper text, subtle `breathe` scale 1.0→1.02
- Ora tab uses a custom 24×24 organic offset-circle SVG mark (sage-400 stroke, 1.8px), notification dot in `--butter-deep` (NEVER coral — coral signals luteal phase, not alarm), `pulse-ring` animation at 6s

## Voice & copy (the rules that govern every word)

The full copy guidelines live in `docs/04-design/copy-guidelines.md`. Top-line rules:

### Banned language

Never appear in user-facing copy:
> Wonderful · Welcome (as h1) · Lean into · be gentle with yourself · Halfway there · Thank you (post-save) · Bloom · Inward · Renewal · Reset (as phase vibe-word) · Get early access · journey · wellness · take control · listen to your body · your feelings are valid · I hear you · you deserve · luminous · glowing · radiant · flourish · you've got this · almost there · calorie · macro · BMI · goal weight

### Required register

- **Honest, not harsh:** "This is hard. That's real." Not "you're glowing!"
- **Clinical, not cold:** "Daily Record of Severity of Problems · 1 = not present, 6 = severely disabling" not "How are you feeling, sweetie?"
- **Direct, not blunt:** Name the thing. PMDD-related rage. Suicidal ideation. Endometrial hyperplasia risk. Don't euphemize.
- **Earned celebration:** Logging is not a milestone. The only celebration moments are: first complete DRSP cycle, first physician export, two-cycle diagnostic threshold reached.
- **No self-congratulation:** The app never thanks itself. "Day 22 recorded." not "Thank you for logging today!"

### Phase tones (the four sentences)

| Phase | Copy |
|-------|------|
| Follicular | "Energy is usually rising here. Plan with it, not against it." |
| Ovulatory | "Energy is often higher here. Or it isn't. Either is fine." |
| Luteal | "Late luteal stretch. Less is enough." |
| Menstrual | "The hard part is lifting. Rest counts." |
| Variable (PCOS) | "Your cycle runs on its own clock. We meet it where it is." |

### Ora's voice

- First person. Always "I", never "we", never "the system."
- Honest knowledge boundaries: "I haven't seen enough of your cycle yet to say anything useful."
- Never causal. "I noticed a pattern" / "your data shows" — never "your hormones cause."
- Never diagnoses. "consistent with the prospective pattern DSM-5 evaluation calls for."
- Never plays therapist on suicidal ideation. Defers to crisis resources. Never couples a phase explanation to a possibly-suicidal moment.

## Iconography

- Phosphor-style line icons at 18–22px, eucalyptus-deep stroke (1.5–1.8px), no fills
- Custom SVG mood icons replace weather emojis on the daily-log feel buttons
- Phase icons: sprout (F), sun (O), autumn-leaf (Lm), deeper autumn-leaf (Ls), moon (M), wavy-line (variable)
- Logo: "Hormona" italic Instrument Serif 400 + "IQ" roman Instrument Serif 500 in `--eucalyptus`. Single typeface family — weight + italic differentiates.
- No emoji as primary icons. Emoji are explicitly banned next to crafted SVGs (icon-family mixing).

## Accessibility (non-negotiable)

- WCAG AA contrast minimum (4.5:1 body, 3:1 UI components)
- Color-only encoding never — always pair color with label, pattern, or position
- Dynamic type up to 3× without breakage
- Screen-reader labels meaningful (behavioral state, not visual description: "Icon: Overwhelmed and depleted" not "Gray circle")
- Reduce-motion respected at CSS level (`prefers-reduced-motion`) AND in-app toggle
- **Brain Fog Mode** auto-suggests during luteal peak: hides Tools / Ora / Calendar tabs, increases font 110%, tap targets ≥56px, suspends non-essential animation

## Crisis safety surfaces (special design rules)

- Crisis cards use `--coral-soft` background (warm, never alarming red)
- Tier 1 (passive acknowledgment): inline card on Home only, `--ink-2` text, no icon, no animation, dismissible by close — NEVER a modal
- Tier 2 (gentle check-in): bottom-sheet, heart icon, dismiss by tap-outside or "Close"
- Tier 3 (auto-escalation only): full-screen modal with pre-question gating ("when you say 'extreme' — is that 'this hurts and I need it to be over' or 'I'm thinking about hurting myself'?"), resources only after the second answer
- Resources order: Crisis Text Line (HOME → 741741) / IAPMD / 988 / "Find your country's line" — lowest barrier first
- "I'm safe — keep logging" coercive button: BANNED. Dismiss CTA is "Close" only.
- 48-hour anti-fatigue: never re-trigger the same tier within 48h for the same active luteal phase
- Under-18 users see a modified resource list (Teen Line, Trevor Project, Crisis Text Line teen)

## Where this design system lives in code

| Concept | File |
|---------|------|
| All CSS variables | `app/HormonaIQ.html` `:root` (lines 11–69) and `[data-theme="dark"]` (71–106) |
| Phase color logic | `app/src/shared.jsx` `phaseForDay`, `PHASE_COLORS`, `PHASE_NAMES`, `PHASE_INK`, `PHASE_VIBES` |
| Reusable components | `app/src/shared.jsx` (CycleRing, DRSPChart, Leaf, Logo, Sprig, EmptyState, Icon set) |
| Copy / voice rules | `docs/04-design/copy-guidelines.md` (full version) |
| Psychological design rules | `docs/04-design/psychological-guidelines.md` |
| Component library | `docs/04-design/ui-components.md` |
| Brand strategy / north star | `docs/04-design/brand-and-ux.md` |
| Token source (extended) | `docs/04-design/design-tokens.yaml` |

## Decisions log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-25 | Initial design system draft (sage / blush / lavender) | First pass during product brief |
| 2026-04-26 | **Pivot to "Morning Garden" palette** (eucalyptus / sage / cream / butter / coral) | User feedback: needed refreshing, greenery-inspired feel; original palette was too clinical |
| 2026-04-26 | Added 5-tier phase color system with luteal-deep | Late luteal (PMDD peak window, days 22–26) is the most clinically important moment — must be visually distinct from early luteal |
| 2026-04-26 | Banned "wellness register": Bloom / Inward / Renewal / Reset, "lean into it", "be gentle with yourself" | User research showed these phrases trigger immediate delete by target users |
| 2026-04-29 | Default `.card` rebuilt with warm gradient; new `.card-paper` for clinical-data | Wave 1 review found ~70% of cards looked wireframe-grade white; warm-card audit shifted ~95% of surfaces to warm gradient |
| 2026-04-29 | Ora voice rewritten in first person across all surfaces | Persona bible (single source of truth) declared first-person; older third-person treatment was a draft that leaked through |
| 2026-04-29 | `--danger` token decoupled from `--severity-severe` | Coral was simultaneously signaling "luteal phase" and "delete this" — broke the phase color system |
| 2026-04-29 | Typography rhythm locked (32 / 26 / 24 / 20 / 17 px); inline overrides removed | ~25 inline `style.fontSize` overrides created a sub-pixel-deltas rhythm-break across screens |
| 2026-04-29 | Dark mode rebuilt with neutral grays (`#181F1B`, `#1F2620`) instead of saturated eucalyptus-deep | Original dark mode was inverted, not redesigned — saturated greens at 3am feel alarming, not calming |
| 2026-04-29 | This DESIGN.md created as root-level single-source consolidation | All design knowledge was scattered across 5 docs; QA + dev needed one file to point to |

---

*This document supersedes any conflicting information in `docs/04-design/*` for executive summary purposes. The deeper docs remain authoritative on their specific subject (copy-guidelines, psychological-guidelines, ui-components). When this file disagrees with code, update either this file or the code — not both — and log the decision above.*
