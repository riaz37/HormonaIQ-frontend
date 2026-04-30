# HormonaIQ — Design Handoff Package

**Built:** 2026-04-30
**For:** Claude Design (or any external designer/agency)
**Project:** HormonaIQ — a hormonal-cycle-aware health app for women with PMDD, PCOS, perimenopause, endometriosis, and ADHD

---

## What this folder is

A self-contained, copyable design handoff. Every file relevant to brand, UI/UX, voice, clinical guardrails, user research, and implementation is in here — organized by team and by paste-priority.

If you're handing this to Claude Design or any other designer, you can either:
- **Paste tier-by-tier** (recommended for context-window-limited tools)
- **Hand them the whole folder** as a zip

Nothing in this folder is a copy from outside the repo — every file is also in the main repo. Edits to the handoff folder won't affect the main project; if the main repo updates, re-run the copy.

---

## Folder structure (paste in this order)

### `01-tier1-must-paste/` — the 5 files you absolutely paste first

These five files give a designer everything they need to produce on-brand, on-spec UI without reading anything else.

| File | What it is | Lines |
|---|---|---|
| `01-DESIGN.md` | Design system spec — color tokens, typography, motion, banned-language, copy register | 286 |
| `02-product-brief.md` | What HormonaIQ is, who it's for, GTM positioning, primary targets (PMDD + PCOS), differentiator | 1,568 |
| `03-brand-and-ux.md` | Brand foundations — voice, tone, "Morning Garden" palette intent | 450 |
| `04-ui-components.md` | UI components catalog — cards, buttons, eyebrow/h2/caption typography, scale-btn, switch, tabbar, modals | 1,207 |
| `05-copy-guidelines.md` | Voice rules — what to say, what not to say, banned phrases, examples per surface | 1,286 |

**Tier 1 total: ~4,800 lines.** Paste this first. A designer can produce work after just this.

### `02-brand-team/` — the brand team's perspective

Voice, tone, brand-team debates, psychological guardrails. Paste alongside Tier 1 if the design touches copy or visual identity.

- `01-brand-team.md` — brand-team debates and decisions
- `02-visual-design-team.md` — visual design team specifics
- `03-psychological-guidelines.md` — psychology rules behind the design (no shame, no streaks, no calorie counting)
- `04-brand-and-ux.md` — brand foundations (also in Tier 1)
- `05-copy-guidelines.md` — copy rules (also in Tier 1)
- `06-naming-debate.md` — naming history (only if relevant)
- `07-launch-posts.md` — launch comms style (only if writing marketing)

### `03-product-ux-team/` — the product/UX team's perspective

Features, decisions, build-guidance. Paste if the design adds or changes a feature.

- `01-product-ux-team.md` — product-UX team debates and decisions
- `02-features-spec.md` — full feature spec, F1–F151, every feature with state schema + UX notes + Round 7 status
- `03-product-brief.md` — product brief (also in Tier 1)
- `04-build-guidance.md` — implementation guidance per condition
- `05-office-hours-design-doc.md` — office-hours design doc
- `06-ui-components.md` — UI components catalog (also in Tier 1)
- `07-decision-food-tracking.md` — decision: food tracking debate
- `08-decision-one-vs-many-apps.md` — decision: one app vs many
- `09-decision-ora-team.md` — decision: Ora AI architecture

### `04-clinical-team/` — the doctor/clinical team's perspective

Medical ethics, clinical primers, instrument schemas. Paste if the design touches a clinical-instrument surface (PHQ-9, ADHD-RS, EHP-30, etc.).

- `01-medical-ethics.md` — what we won't claim, what we won't diagnose, where we send users
- `02-user-restrictions.md` — age gates, ED safe-mode, adolescent guardrails
- `03-pmdd-primer.md` — clinical primer: what PMDD is, DSM-5 criteria
- `04-pmdd-complete-spec.md` — full PMDD spec with instruments
- `05-pcos-primer.md` — clinical primer: PCOS, Rotterdam criteria, phenotypes
- `06-pcos-complete-spec.md` — full PCOS spec
- `07-perimenopause-primer.md` — clinical primer: peri, STRAW+10
- `08-perimenopause-complete-spec.md` — full peri spec
- `09-endometriosis-primer.md` — clinical primer: rASRM, ENZIAN, DIE
- `10-endometriosis-complete-spec.md` — full endo spec
- `11-adhd-primer.md` — clinical primer: women's ADHD, RSD, masking, hormonal-ADHD
- `12-adhd-complete-spec.md` — full ADHD spec

### `05-ora-voice/` — the AI companion's voice

How Ora talks, what Ora won't say. Paste if the design adds an Ora surface or insight card.

- `01-ora-persona.md` — who Ora is, how she talks, what she won't say
- `02-ora-companion-research.md` — research backing the AI-companion approach

### `06-user-voice/` — what users actually say

Real personas, real quotes, real interviews. Paste if the design is user-facing copy or a new persona-targeted surface.

- `01-user-personas.md` — the 8 personas (Sofia, Emma, Sarah, Riona, Miranda, Priya, Lila, Maya) — full backgrounds, what they need, what they fear
- `02-pmdd-user-voice.md` — real user quotes from PMDD subreddits + interviews
- `03-pcos-user-voice.md` — real user quotes from PCOS users
- `04-simulated-interviews.md` — simulated user interviews across all conditions
- `05-feature-research.md` — feature-by-feature user research
- `06-team-simulations.md` — team-simulation transcripts

### `07-round-7-reviews/` — the most recent multi-team reviews

The chronological story of how this build got to 100/100. Paste only if the designer needs to know what just shipped + what the audit said.

- `00-master-plan.md` — Round 7 master plan
- `02-multi-team-review.md` — Brand + Product + UX + Clinical + Investor reviews + 6 persona walkthroughs
- `03-final-satisfaction-review.md` — Phase 8 sign-off
- `05-ui-ux-completion.md` — UI/UX audit: every polish item with status
- `07-f150-content-co-review.md` — Brand × UX co-review of late-diagnosis content (good example of how the teams work together)
- `08-qa-multi-team-final-review.md` — full QA + 8 personas at the table
- `09-health-100-100.md` — health 100/100 close-out
- `10-theme-component-team-user-review.md` — most recent: theme + component audit + 8-persona round-table
- `design-improvement-brief.md` — older design improvement brief (round-1 era)
- `design-team-handoff.md` — older design team handoff (round-1 era)

### `08-implementation-code/` — what the design looks like in code today

Reference only. Paste if the designer wants to see how the design tokens and primitives are actually wired.

- `01-HormonaIQ.html` — entrypoint with the `:root` CSS variables (the design tokens in code)
- `02-shared-primitives.jsx` — design primitives (CycleRing, DRSPChart, EmptyArt, ShareInsight, SectionProgress, TimeBadge, OraFeedback, generatePDF)
- `03-module-ui-primitives.jsx` — module-sheet primitives (MHeader, Stat, Severity, Spark, EvidenceBar, ToggleRow, MSection)
- `04-design-tokens.yaml` — design tokens in YAML format (if available)

---

## Recommended paste order for Claude Design

If Claude Design has a context window limit, paste in this order:

1. **Message 1:** Tier 1 — `01-tier1-must-paste/` (~4,800 lines). Designer can produce work after just this.
2. **Message 2:** Whatever team is most relevant to your current ask
   - Designing copy? → `02-brand-team/`
   - Designing a new feature surface? → `03-product-ux-team/`
   - Designing a clinical-instrument screen? → `04-clinical-team/` + the relevant primer
   - Designing an Ora insight? → `05-ora-voice/`
3. **Message 3:** User voice — `06-user-voice/01-user-personas.md` + the relevant condition's user-voice doc
4. **Message 4 (optional):** Round 7 reviews if the designer wants to see the most recent state of consistency across the build
5. **Message 5 (optional):** Implementation code if the designer wants to see how tokens are wired

---

## Quick-reference team ownership

- **Brand team owns:** DESIGN.md · brand-and-ux.md · copy-guidelines.md · brand-team.md · ora-persona.md
- **Product / UX team owns:** product-brief.md · features-spec.md · ui-components.md · product-ux-team.md · psychological-guidelines.md · build-guidance.md
- **Clinical / doctor team owns:** medical-ethics.md · user-restrictions.md · 5× *-primer.md · 5× *-complete-spec.md
- **Visual design team owns:** visual-design-team.md · ui-components.md · DESIGN.md (jointly with Brand)
- **User research team owns:** user-personas.md · pmdd-user-voice.md · pcos-user-voice.md · simulated-interviews.md

---

## File counts

| Folder | Files |
|---|---|
| `01-tier1-must-paste/` | 5 |
| `02-brand-team/` | 7 |
| `03-product-ux-team/` | 9 |
| `04-clinical-team/` | 12 |
| `05-ora-voice/` | 2 |
| `06-user-voice/` | 6 |
| `07-round-7-reviews/` | 10 |
| `08-implementation-code/` | 4 |
| **Total** | **55** |

**Total size: ~2.5 MB**

---

## What's NOT in this handoff

- Source code beyond the primitive files (no module-1/2/3/4-endo/5-adhd/6-peri.jsx) — those are too big and not design-relevant per file. If the designer needs them, they're in `app/src/`.
- Sprint logs from rounds 1–6 — round 7 reviews supersede them.
- Strategy docs (`docs/06-strategy/`) — those are GTM/business, not design-relevant.

If the designer asks for any of these, point them at the main repo path.

---

## Refresh

If the main repo updates and you want to refresh this handoff, re-run the build from the project root:

```bash
# (paste the cp commands from the original creation step)
```

Or just delete `design-handoff/` and ask Claude to rebuild it with the latest files.
