# HormonaIQ — Round 7 Completion Plan

**Date:** 2026-04-30
**Goal:** Close every gap surfaced by the Round 6 audit. Deliver a complete, Apple-team-quality UI where every documented feature is reachable, every condition is real, and every user feels welcomed and seen on their first session.
**Scope:** 92 features (67 missing + 25 partial) + cross-cutting fixes + multi-team review + final polish.

---

## 1. Guiding principles

These are non-negotiable. Every team works to these.

1. **Spec parity.** Every feature in `docs/02-product/features.md` has working code by the end of Round 7, OR an explicit "Q3-roadmap" status flag in the spec itself. No phantom conditions, no mockups masquerading as features.
2. **Safety first.** F88 (postmenopausal bleeding gate), F89 (HBC masking flag), F108 (DIE red flags), F128 (ADHD PHQ-9 item-9 gate) all ship before any other Phase ships. These are non-skippable.
3. **Discoverability.** Every registered module in `window.HQ_MODULES` has a navigation path the user can find in ≤2 taps from home or profile. No orphans.
4. **Condition-aware everything.** Onboarding selection drives daily-log fields, home cards, Ora insights, physician report content. PCOS users see PCOS questions, endo users see pelvic pain, ADHD users see RSD/masking/hyperfocus, peri users see hot-flash and STRAW.
5. **Real implementations only.** No hardcoded sample data on shipping screens. If a chart needs 60 days of data to be meaningful, gate the chart with a clear "coming in N days" message — don't fake it.
6. **DESIGN.md is law.** Banned-language list, on-token colors, motion respecting `prefers-reduced-motion`, typography locked. Every component reviewed against DESIGN.md before merge.
7. **No new dependencies in MVP.** Use jsPDF (already required for F138) and that's it. No analytics SDKs, no third-party widgets. localStorage-only persistence, GDPR-defensible by default.
8. **Apple standard for finish.** Rich without busy. Refreshing without sterile. Welcoming without saccharine. Every transition deliberate, every word chosen, every space measured. The user should feel seen, not sold to.

---

## 2. Phase ledger

Phases are sequential where dependencies require it; parallel where independent. Each phase has a clear entry/exit gate.

| # | Phase | Scope | Owner | Dependencies | Exit gate |
|---|---|---|---|---|---|
| 0 | Master plan (this doc) | Sequencing, owners, gates | PM | — | Doc reviewed; teams aligned |
| 1 | Audit-fix sprint | F88, F89, jsPDF, Tools tab, onboarding gates, Ora real data | Eng + Clinical | Phase 0 | Six items shipped + tested |
| 2 | Endometriosis buildout | F92–F121 (30 features) | Eng + Clinical | Phase 1 (jsPDF available for F109) | Endo P0 fully reachable; DIE rules in crisis-service |
| 3 | ADHD buildout | F122–F151 (30 features) | Eng + Clinical | Phase 1 (jsPDF for F138) | All 8 instruments shippable; mockups removed |
| 4 | Perimenopause completeness | F65, F66, F71, F78, F79, F81–F87, F90, F91 + 13 partial closures | Eng + Clinical | Phase 1 (F88 already done) | Peri v2 shippable |
| 5 | PMDD/PCOS partial closures + flow polish | 7 PMDD partials + 1 PCOS partial + daily-log condition fields | Eng | Phase 1 | All "PARTIAL" items resolved |
| 6 | Multi-team UI review | Brand + Product + UI + User research debate | All teams | Phases 1–5 | Verdict doc with agreed changes |
| 7 | Apply verdict + final polish | Implement Phase 6 changes | Eng + Design | Phase 6 | All review changes shipped |
| 8 | Final satisfaction review | Whole team sign-off + user journey walkthrough | All teams | Phase 7 | Sign-off doc with no open concerns |
| 9 | features.md status update | Per-feature status flags + roadmap | PM | Phase 8 | Spec annotated; combined total accurate |

---

## 3. Feature batches (the actual work)

### Batch A — Audit-fix sprint (Phase 1)

**6 items, ~5–6 days human equivalent. Ship before any new module work.**

| # | Feature | Effort | Files touched | Acceptance |
|---|---|---|---|---|
| A1 | F88 Spotting tracker + AUB safety alert | S | app.jsx (state.spottingLog), daily-log.jsx (new section), crisis-service.jsx (rule) | Logging surface in daily log; rule fires when bleeding logged after ≥365-day amenorrhea; alert non-dismissible without "discussed with doctor" confirm |
| A2 | F89 HBC masking flag | XS | app.jsx (state.hbcActive, state.hbcType), onboarding.jsx (toggle), modules-3.jsx M.straw (caveat banner) | When HBC=true, STRAW module shows top-banner "Your hormonal contraception masks staging — discuss with provider"; staging conclusion deferred or marked tentative |
| A3 | jsPDF integration + working PDFs | M | HormonaIQ.html (CDN), shared.jsx (PDF helper), modules-1.jsx M.pmddPDF, modules-3.jsx M.compPDF | Click "Download for prescriber" → real PDF with token-styled output; print stylesheet inherited; PMDD report verified end-to-end |
| A4 | Tools tab (module library) | S | tools.jsx (rewrite), profile.jsx (link), HormonaIQ.html (route) | All 49 modules categorized by condition + topic; searchable; reachable from profile in 2 taps |
| A5 | Onboarding gates for endo/ADHD | XS | onboarding.jsx | Selecting endo or ADHD as primary shows "Coming soon — module ready in Q3/Q4" interstitial; offers cycle tracking + crisis support today; option to switch primary |
| A6 | Ora tab uses real insight logic | S | ora.jsx (refactor 229), shared.jsx (extract insight helper from home.jsx 513–524) | Ora tab shows actual user data; no hardcoded "4.8/6 swing"; gracefully shows "not enough data yet" pre-30 days |

### Batch B — Endometriosis P0-MVP (Phase 2, slice 1)

**16 features. The visible differentiator is the body map.**

F92 onboarding (3 branches: diagnosed, suspected, post-surgical), F93 5-D pain NRS, F94 pain location body map, F95 GI/bowel log, F96 PBAC bleeding log, F97 fatigue + brain fog, F98 sleep quality, F99 PHQ-9 monthly, F100 GAD-7 bi-weekly, F101 EHP-30 monthly, F102 EHP-5 weekly, F103 BnB monthly, F104 treatment + response, F105 surgical history vault, F108 DIE red flag system (9 rules in ENDO_SAFETY_RULES), F109 physician report PDF.

### Batch C — Endometriosis Month 2-3 (Phase 2, slice 2)

**14 features.** F106 lab vault, F107 imaging vault, F110 comorbidity tracker, F111 medication log (NSAID + hormonal), F112 trigger log, F113 PFPT log, F114 adolescent mode, F115 endometrioma size monitoring, F116 low-FODMAP diet, F117 cycle-GI correlation, F118 NSAID overuse alert, F119 staging display (rASRM + #ENZIAN), F120 multi-format export, F121 research export.

### Batch D — ADHD P0-MVP (Phase 3, slice 1)

**15 features. Clinical instrument backbone.**

F122 3-branch onboarding, F123 full daily log (5 domains + RSD + hyperfocus + masking + medication + circadian + BFRB + time blindness fields), F124 ASRS-5 monthly, F125 ADHD-RS monthly, F126 CAARS Emotional Lability, F127 WFIRS-S monthly, F128 PHQ-9 monthly (item 9 gate), F129 GAD-7 bi-weekly, F130 ISI monthly, F131 RSD episode quick-add, F132 hyperfocus + crash log, F133 medication log + BP/pulse, F135 masking effort daily NRS, F136 sleep circadian tracker, F137 Brown EF/A monthly.

### Batch E — ADHD Month 2 (Phase 3, slice 2)

**8 features.** F134 hormonal-ADHD cycle correlation engine (the differentiator — gated to 60+ days data), F138 ADHD physician report PDF (3 variants), F139 time blindness log, F140 BFRB + sensory log, F141 supplement + lifestyle log, F142 body doubling log, F143 accommodation doc generator, F144 perimenopause-ADHD module, F145 burnout risk detection.

### Batch F — ADHD Month 3 (Phase 3, slice 3)

**6 features.** F146 PMDD-ADHD intersection, F147 financial dysregulation log, F148 CBT skill library (Safren-protocol cards), F149 postpartum ADHD mode (EPDS), F150 late diagnosis support module, F151 relationship impact log.

### Batch G — Perimenopause completeness (Phase 4)

**11 missing + 13 partial = 24 items.**

Critical missing: F65 DEXA vault, F66 BP log, F71 non-HRT treatment tracker, F78 CV risk dashboard, F79 bone health dashboard, F81 MRS, F82 FSFI, F83 DIVA, F84 ICIQ-UI, F85 joint pain, F86 headache, F87 palpitations, F90 skin/hair, F91 bladder log.
Partial closures: F7 phase ed deepen, F8 insights dashboard, F11 pattern recognition, F23 multi-condition overlay, F33 food photo (or kill flag), F53 metabolic syndrome score, F68 POI standalone, F69 cognitive deepening, F70 weight+metabolic peri-specific, F73 peri-aware home, F74 VMS triggers, F75-77 condition intersections (3 items), F80 education library.

### Batch H — PMDD/PCOS partials + daily-log polish (Phase 5)

PMDD partials: F7, F8, F11, F14 (med tracker scoring), F15 ADHD report (improve), F21 ADHD-PMDD overlap detector (real algorithm), F41 trigger correlation algorithm.
PCOS partial: F53.
Daily-log condition fields: PCOS gets androgen + insulin/glucose section; peri gets hot-flash count + night sweats + GSM mini check.

---

## 4. Team responsibilities

| Team | Role in this round |
|---|---|
| **PM** | Owns master plan, sequencing, gates, exit criteria. Updates features.md status flags. |
| **Eng** | Implements all batches. One commit per logical change. JSX + state schemas + scoring algorithms. |
| **Clinical Lead (Dr. Marsh)** | Reviews instrument fidelity (ASRS-5 items, ADHD-RS scoring, EHP-30 items, BnB scoring). Approves DIE safety rules. Approves PHQ-9/GAD-7 cutoffs. |
| **Brand Manager** | Phase 6 review: language register, tone, positioning. Confirms "rich, refreshing, welcoming" before final ship. |
| **Designer (Sana)** | Token compliance, motion, body map visual design, typography locks, copy register check. |
| **User Research** | Stand-in personas for Phase 6 walkthrough: Sofia 34 ADHD, Emma 31 endo, Sarah 28 endo, Riona 22 ADHD-PMDD, Miranda 46 peri-ADHD, Priya 17 endo-adolescent. |
| **Investor** | Phase 6 review: does the GTM story match what ships? Are differentiators (cycle correlation, body map, physician PDF) actually demonstrable? |

---

## 5. Cross-cutting requirements

These apply to every batch:

**State schema discipline.** Every new feature initializes its state keys in `app.jsx` defaultState. No undefined-checks-everywhere code. Every key gets a sensible default.

**Module registration.** Every new clinical screen registers via `window.HQ_MODULES`. Every registration has a navigation path (Tools tab, home card, daily-log link, profile entry).

**Crisis service integration.** Every new instrument with a safety threshold (PHQ-9 item 9, EHP-30 item 30 SI, F88 postmenopausal bleeding, F108 DIE flags) registers a rule in `crisis-service.jsx`. Anti-fatigue gates use existing `localStorage` keys.

**Cycle-phase context.** Every new daily-log field captures `cyclePhase` and `cycleDayNumber` for downstream correlation.

**Reachability test.** For each new feature, name the user journey: "User opens app → home → [path] → reaches feature in N taps." If N > 2 from any of the four hubs (home, daily-log, calendar, profile), redesign navigation.

**Daily-log non-bloat.** Daily log stays ≤90 seconds for the gestalt path. Detail expansion is opt-in. Brain-fog mode auto-collapses.

**Design tokens.** No new colors. No new font stacks. Use existing CSS variables in `HormonaIQ.html :root`.

**Voice.** Direct, honest, never therapeutic-speak. "Logged. This is real." not "Thank you for sharing." See DESIGN.md banned-language list.

---

## 6. Sequencing rationale

- **Phase 1 first** because F88/F89 are safety-critical and jsPDF unblocks every later report.
- **Endo before ADHD** because endo's body map is the day-1 visible differentiator (lights up immediately) while ADHD's correlation engine needs 60 days of data (lights up on day 60). Endo also has shorter clinical instrument count (EHP-30 + BnB), letting it ship faster.
- **Peri completeness alongside endo** because F88/F89 are part of audit-fix sprint, and the remaining peri instruments (MRS, FSFI, ICIQ) are short forms reusable from the same patterns.
- **PMDD/PCOS polish after** because they're mostly working — partials are refinements, not rebuilds.
- **Multi-team review at Phase 6, not earlier** because review on incomplete UI produces feedback we can't act on. Review when there's something to review.
- **Final satisfaction review at Phase 8** because between review and ship, polish happens; between polish and ship, sign-off happens.

---

## 7. Risk register

| Risk | Mitigation |
|---|---|
| Scope explosion from 92 features | Strict batch boundaries. Don't add features to active batches. |
| Quality drift toward more mockups | "Real implementations only" principle (§1.5). Every commit must include working scoring/state/UI, not just JSX shell. |
| Design system erosion | Phase 6 design review enforces DESIGN.md before final ship. |
| Crisis-service correctness | Clinical Lead manually reviews every new safety rule before merge. |
| Mobile/performance regression | jsPDF lazy-loaded; no blocking scripts added; module sheet bundle stays under current size budget. |
| User overwhelm in onboarding | Conditional rendering: only show condition-specific questions for selected primary. Defer secondaries. |
| ADHD module looking like a stub if we ship F134 (cycle correlation) before 60 days of data | Gate F134 with "Your hormonal-ADHD pattern report unlocks at day 60. Tracking [N] days of [60]." Real progress bar. |
| Endo body map complexity | Use SVG layered approach (front + back silhouettes, zone polygons). Spec-driven; designer signs off before code merges. |

---

## 8. Acceptance for Round 7 closure

The round is complete when:

- [ ] All 92 audit-flagged features have status SHIPPED, SHIPPED-WITH-GAPS (with documented gap), or DEFERRED-Q3+ (with rationale)
- [ ] Crisis service implements all P0-MVP safety rules: PMDD DRSP-12, F88 AUB, F108 DIE (9 rules), F128 ADHD PHQ-9 item 9, EHP-30 item 30
- [ ] Tools tab exists; ≤2 taps from profile to any registered module
- [ ] Onboarding never leaves a user in a phantom-condition state
- [ ] Every new clinical instrument has scoring algorithm + state schema + reachable UI
- [ ] PDF generation works end-to-end for at least PMDD report; all other condition reports follow the same template
- [ ] Multi-team Phase 6 review sign-off by Brand, Product, UI, User Research, Investor
- [ ] Phase 8 user-journey walkthrough produces no critical concerns from any persona
- [ ] features.md combined total accurately reflects implementation status (not just documentation)
- [ ] DESIGN.md compliance spot-check passes on 5 random new screens

---

## 9. What we explicitly will NOT do in Round 7

- No backend / cloud sync (privacy-first, localStorage-only stays in scope)
- No native mobile app shells (web-first PWA aesthetic continues)
- No real speech-to-text (food voice logging stays simulated transcript with explicit "demo mode" label, or feature stays flagged off)
- No real food-photo computer vision (F33 remains feature-flagged off)
- No third-party calendar sync (F29 deferred Q3+)
- No Apple Health / Health Connect integration (Q3+ scope)
- No CBT therapist marketplace (F148 ships as content library only, not provider booking)
- No insurance / billing integrations
- No social / community features beyond the existing anonymized pulse (F42 stays as-is)

These boundaries protect the round from scope drift. Anything off-list goes into Q3+ backlog.

---

## 10. Go signal

If the user signs off on this plan, execution begins immediately at Phase 1. Parallel implementation agents fan out across batches as soon as their dependencies clear. Progress documented continuously in `docs/sprints/round-7-completion/`.
