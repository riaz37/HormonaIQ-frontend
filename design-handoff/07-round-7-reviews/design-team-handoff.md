# Design Team Hand-Off — What to Read, In What Order
**For:** Incoming design team / agency / freelancer
**Created:** April 29, 2026
**Time to read everything in Tier 1 + Tier 2:** ~3 hours
**Time to read everything: ~8 hours**

> **TL;DR:** Read Tier 1 (the 6 design system docs) before opening Figma. Read Tier 2 (product + user context) before making any decisions. Tiers 3–5 are reference material — only when you have a specific question.
>
> **Once you've read Tier 1, also open: [`docs/design-improvement-brief.md`](design-improvement-brief.md)** — that file lists the specific elevation requests the founder wants you to focus on (waitlist counter on landing, refreshing the DRSP entry surface, etc.). It's the *what to do* layered on top of the *what exists*.

---

## How this product is organized

The project root has two folders that matter for design:

```
market-scanner/
├── DESIGN.md              ← Single source of truth, root-level. Read first.
├── app/                   ← The shipped prototype (live working UI)
│   ├── HormonaIQ.html     ← Open this in a browser to see it
│   └── src/               ← 16 JSX component files
└── docs/                  ← All documentation, organized into 10 sections
    ├── 01-clinical/       ← What PMDD/PCOS actually are (medical primers)
    ├── 02-product/        ← Feature specs and product decisions
    ├── 03-ora/            ← The AI companion's persona
    ├── 04-design/         ← THE design system
    ├── 05-safety/         ← Medical ethics and clinical limits
    ├── 06-strategy/       ← Business strategy (skip — not design)
    ├── 07-product-overview/ ← Master product brief
    ├── 08-teams/          ← Internal team debate transcripts (mostly skip)
    ├── 09-research/       ← User research and clinical research
    └── sprints/           ← Sprint execution history (skip)
```

---

## Tier 1 — Design System (read FIRST, before any design work)

These six docs ARE the design system. If anything you propose contradicts them, you need to either change your design or update the doc + the decisions log.

| # | File | What it is | Why it matters |
|---|------|-----------|----------------|
| 1 | [`DESIGN.md`](../DESIGN.md) | Executive index. Everything you need on one page. | **Start here.** Aesthetic direction, color tokens, type scale, motion rules, voice register, file map. |
| 2 | [`docs/04-design/brand-and-ux.md`](04-design/brand-and-ux.md) | Brand strategy, north star, "what this is NOT" | Tells you why every Flo / Clue / wellness-app convention is banned here. The opposite of what most design libraries default to. |
| 3 | [`docs/04-design/copy-guidelines.md`](04-design/copy-guidelines.md) | Every word rule | Banned-language list, voice register per phase, scenario-by-scenario microcopy. Read before naming any button. |
| 4 | [`docs/04-design/psychological-guidelines.md`](04-design/psychological-guidelines.md) | Trauma-informed rules | The lowest-capacity test, anti-anchoring, gamification ban, the "3am principle." Read before designing any state where the user is struggling. |
| 5 | [`docs/04-design/ui-components.md`](04-design/ui-components.md) | Component spec | Every card variant, button, scale button, modal, sheet — with states, accessibility, copy standards. |
| 6 | [`docs/04-design/design-tokens.yaml`](04-design/design-tokens.yaml) | Token source file | Importable into Figma Tokens, Tailwind, Style Dictionary. The full primitive + semantic token tree. |

---

## Tier 2 — Product context (read BEFORE making decisions)

You can technically design the system from Tier 1 alone. You can't design *for the right person* without Tier 2.

| # | File | What it is | Why a designer needs it |
|---|------|-----------|------------------------|
| 7 | [`docs/01-clinical/pmdd-primer.md`](01-clinical/pmdd-primer.md) | What PMDD is, in plain English | Without this you'll design wellness-app vibes that get deleted in 30 seconds. PMDD users have been gaslit by 12 doctors. |
| 8 | [`docs/01-clinical/pcos-primer.md`](01-clinical/pcos-primer.md) | What PCOS is | Same — without context you'll center weight loss (banned) and miss what insulin resistance feels like. |
| 9 | [`docs/02-product/features.md`](02-product/features.md) | All 56 features with acceptance criteria | The product surface area. Some are trivial; some are clinically loaded. Read them in priority order (P0 → P1 → P2). |
| 10 | [`docs/07-product-overview/product-brief.md`](07-product-overview/product-brief.md) | Master product brief | Vision, GTM, positioning. Why we're building this and who pays. |
| 11 | [`docs/03-ora/ora-persona.md`](03-ora/ora-persona.md) | The AI companion's voice rules | Ora has a face the user can recognize even though there's no avatar. Her tab icon, card treatment, eyebrow label, response cadence are all design questions. |

---

## Tier 3 — User research (read to design for real humans, not assumptions)

| # | File | What it is |
|---|------|-----------|
| 12 | [`docs/09-research/user-personas.md`](09-research/user-personas.md) | 30 personas across 5 archetypes — grounded in 270+ real Reddit posts |
| 13 | [`docs/09-research/pmdd-user-voice.md`](09-research/pmdd-user-voice.md) | Real PMDD-community quotes |
| 14 | [`docs/09-research/pcos-user-voice.md`](09-research/pcos-user-voice.md) | Real PCOS-community quotes |
| 15 | [`docs/09-research/simulated-interviews.md`](09-research/simulated-interviews.md) | Researcher-constructed personas with full interview transcripts (Sarah, Daniela, Karen, Nadia, Amara) |

> **Pro move:** Pick 3 personas (one from each archetype A/B/C/D/E) and design every flow against those 3 specifically. Generic personas produce generic design.

---

## Tier 4 — Safety and ethics (the design "do not" rules)

You won't read these cover-to-cover, but you'll hit them as references when designing crisis surfaces, food/weight features, or anything that touches medical claims.

| # | File | When to consult |
|---|------|-----------------|
| 16 | [`docs/05-safety/medical-ethics.md`](05-safety/medical-ethics.md) | Crisis card design, DRSP report, lab vault, supplement tracker, anywhere the app makes a medical claim |
| 17 | [`docs/05-safety/user-restrictions.md`](05-safety/user-restrictions.md) | Age gate, ED-history flow, content moderation rules |
| 18 | [`docs/02-product/decisions/`](02-product/decisions/) | Three full-team debate transcripts: one-vs-many-apps, food tracking, Ora character. When you wonder "why is it like this?" — it's in here. |

---

## Tier 5 — The shipped prototype (look at this!)

The current UI is at `app/HormonaIQ.html`. It is a working prototype implementing every feature in this design system through 6 waves of iteration. **Open it before designing anything.** It tells you:

- What the design system looks like in motion (animations, phase colors, dark mode, brain-fog mode)
- Which features exist and how they connect
- Where the design currently has rough edges (the prototype is functional, not pixel-perfect)
- How the navigation works (5 tabs: Home / Log / Cycle / Tools / Ora)

To run it locally:
```bash
cd app/
python3 -m http.server 8765
# Open http://localhost:8765/HormonaIQ.html
```

Or just open `app/HormonaIQ.html` directly — only works via http:// because Babel needs to fetch the JSX files.

---

## What to skip (so you don't drown)

These folders are NOT for designers:

- **`docs/06-strategy/`** — Business strategy, funding paths, market intel. Skip.
- **`docs/08-teams/`** — Internal team debate transcripts (brand, product-ux, visual-design, ai-feature, naming). The decisions are already in the Tier 1 docs. Skip unless you're curious about reasoning history.
- **`docs/sprints/`** — Sprint execution logs from Round 1. Useful only for the dev team picking this up. Skip.
- **`docs/09-research/`** non-personas files — Clinical research analyses (DRSP instruments, hospital chart analyses, academic papers, competitor analyses, feature research). Skip unless you have a specific clinical question.
- **`docs/sprints/round-2-backend/`** — Backend hand-off. Skip.

---

## Reading order if you have…

### …8 hours
Read Tiers 1–5 in order. Open the prototype. You'll know everything.

### …3 hours
Tier 1 only (6 docs) + open the prototype. You can start designing.

### …1 hour
Read `DESIGN.md` (root) + `docs/04-design/copy-guidelines.md` §1 (banned language) + open the prototype + skim 2 personas. You can avoid the worst mistakes.

### …15 minutes
Read `DESIGN.md` and open the prototype. Don't propose anything yet.

---

## When you're ready to propose changes

1. **Read the [`DESIGN.md` Decisions Log](../DESIGN.md#decisions-log).** Every major design call is recorded with date and rationale. If you want to change one, you're updating an existing decision, not creating one.
2. **Open a PR / proposal that updates `DESIGN.md`.** Don't open a PR that touches CSS without first updating the design system doc and adding a row to the decisions log.
3. **Run the design through the team that wrote the original system:** Brand (`docs/08-teams/brand-team.md`), Product/UX (`docs/08-teams/product-ux-team.md`), Visual Design (`docs/08-teams/visual-design-team.md`). They'll either approve or push back with reasons.
4. **For high-stakes surfaces (crisis cards, DRSP report, onboarding step 1) — also run it past Clinical and Psychology.** These are the surfaces where bad design causes real harm.

---

## File map cheat sheet (print this)

```
DESIGN.md                                    ← THE design system (root)
docs/04-design/brand-and-ux.md              ← Brand strategy
docs/04-design/copy-guidelines.md           ← Voice + banned language
docs/04-design/psychological-guidelines.md  ← Trauma-informed rules
docs/04-design/ui-components.md             ← Component spec
docs/04-design/design-tokens.yaml           ← Token source

docs/01-clinical/pmdd-primer.md             ← What PMDD is
docs/01-clinical/pcos-primer.md             ← What PCOS is
docs/02-product/features.md                 ← All 56 features
docs/03-ora/ora-persona.md                  ← AI companion voice
docs/07-product-overview/product-brief.md   ← Vision

docs/09-research/user-personas.md           ← 30 personas
docs/09-research/pmdd-user-voice.md         ← Real quotes
docs/09-research/pcos-user-voice.md         ← Real quotes

docs/05-safety/medical-ethics.md            ← Medical "do not" rules
docs/05-safety/user-restrictions.md         ← Safety guardrails

app/HormonaIQ.html                          ← THE working prototype
```

That's it. Everything else is supporting material.
