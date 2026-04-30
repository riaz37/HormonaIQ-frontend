# Round 7 — Multi-Team UI Review

**Date:** 2026-04-30
**Convener:** PM
**Participants:** Brand Manager (Aria), Product Lead (Nova), CTO (Ravi), Designer (Sana), Clinical Lead (Dr. Marsh), User Research Lead (Iris), Investor (Marc)
**Stand-in personas:** Sofia 34 (ADHD inattentive, late-diagnosed), Emma 31 (endometriosis, post-laparoscopy), Sarah 28 (endometriosis, suspected/no diagnosis), Riona 22 (ADHD-PMDD overlap), Miranda 46 (peri-ADHD), Priya 17 (adolescent endometriosis)

**Object of review:** The HormonaIQ build after Phase 1–5 implementation — 151 documented features now backed by real state schemas, real clinical instruments, real PDF generation, real safety rules, real condition-aware UI.

---

## Section 1 — Brand & Voice Review

### Aria (Brand Manager)

**Headline finding:** The voice held. Across 60+ new modules, banned-language list was respected in every spot-check. Copy register stayed direct, honest, never therapeutic-speak.

**Concrete spot-checks:**
- F108 DIE safety rule copy: "Right shoulder or upper-abdomen pain that clusters with your period (especially with breathing) can be a sign of thoracic endometriosis." ✓ Direct, names the mechanism, no scare tactics, no "please consult your healthcare provider" boilerplate.
- F89 HBC caveat banner: "Your hormonal contraception suppresses FSH and creates regular bleeding patterns regardless of where you are in the menopausal transition." ✓ Plain English, names the why, owns the limit of the staging.
- F122 ADHD onboarding (suspected branch): "Three branches: diagnosed, suspected, recently_diagnosed. Branch 2 receives an 'understanding your ADHD' orientation." ✓ Doesn't pathologize the suspected user; doesn't diagnose them either.
- F135 Masking effort tracker: "How much energy did you spend managing how you appear to others today?" ✓ Avoids the clinical term "masking" in the UI per spec; the alienation risk is real for newly diagnosed users.

**Concerns to flag:**
1. "Apple-team standard" is asserted but not yet visualized. We have *language* parity with that standard. We don't yet have *motion* parity — most new modules use existing card animations but I haven't seen the F94 body map in motion. **Action:** Sana to do a 10-minute motion review of body map + correlation engine charts before final ship.
2. The endometriosis module landing experience is text-heavy in some flows (EHP-30 is 30 items). Section navigation helps but we should consider an "estimated time" badge on monthly instruments. **Action:** Add `Section [N/5] · ~2 min` headers to all multi-section instruments.
3. The "Late diagnosis support" module (F150) treads delicate emotional ground (grief-relief). Six articles is a lot. I want to re-read each card before ship. **Action:** Aria + Iris co-review F150 content next sprint.

**Verdict:** Brand-ready with the three actions above.

### Nova (Product Lead)

**Headline finding:** The thing we promised is the thing we built. Endometriosis exists now. ADHD has real instruments. Perimenopause is no longer half-built. The audit-fix sprint closed safety gaps that would have shipped a product I couldn't defend.

**Demoable moments after this round:**
1. Endometriosis user opens the app, sees pain body map, taps a zone, gets immediate visual feedback. Zero "endo coming soon" gates because endo *is* here.
2. ADHD user logs medication with BP/pulse, sees the cycle-phase effectiveness pattern emerging at day 60+ (F134 — the differentiator clinicians have never seen).
3. Perimenopausal user gets MRS + GSM tracker + bone health dashboard + CV risk dashboard, which means primary-care provider has actual data to discuss instead of the user describing symptoms cold.
4. Postmenopausal user logs unexpected bleeding, gets non-dismissible AUB alert with "discuss with doctor this week" — the safety net F88 was supposed to provide.
5. STRAW staging now caveats itself when HBC is active (F89), so a 30% subset of perimenopausal users no longer get silently-wrong staging.

**Concerns:**
- F134 cycle correlation engine is the stated primary differentiator but only unlocks at 60 days of data. We need a clear "[N/60] days" progress indicator visible from home, not buried in the module. **Action:** Eng to add home-card surface for F134 progress.
- 56 → 86+ tools in the Tools tab is a discoverability test. Search must be fast. **Action:** Verify search filters by name + keywords + F-code.
- We deferred Q3+ items (F33 food photo CV, F29 calendar sync, F148 CBT therapist booking). The roadmap section in features.md must be explicit so external comms doesn't claim what doesn't ship.

**Verdict:** Product-ready. Ship with the three actions logged for next sprint.

---

## Section 2 — Engineering Review

### Ravi (CTO)

**Headline finding:** Architecture held. State schemas extended cleanly. Crisis service expanded without breaking PMDD safety rules. PDF generation is real (jsPDF) — no more HTML mockups. Module registration via `window.HQ_MODULES` continues to work for the new modules-4-endo, modules-5-adhd, modules-6-peri files.

**Code quality observations:**
- `state.spottingLog`, `state.endoOnboarding`, all new state keys initialized in `app.jsx` defaultState. Existing user data unaffected by new keys (defaults to `{}` or `null`).
- `crisis-service.jsx` cleanly separates F88 (AUB rule) and F108 (DIE rules array) from existing PMDD tier logic. `assessAUBRule(state)` and `assessEndoSafetyRules(state)` can be called from any home/daily-log surface.
- `generatePDF(opts)` helper in `shared.jsx` is the correct abstraction. `M.pmddPDF` already migrated; M.compPDF and M.adhdReport will swap to it.
- 49 → 100+ registered modules. Registration pattern unchanged; just bigger.

**Concerns:**
1. **jsPDF + html2canvas via CDN.** For prototype this is fine. For ship-to-real-users we'd want self-hosted or bundle. Mark as Q3 infra task. **Action:** Add to backlog.
2. **localStorage size budget.** With 30 endo + 30 ADHD + 24 peri new state keys, each accumulating per-day data, a power user logging for 2+ years could approach the 5–10 MB localStorage cap. **Action:** Add localStorage usage indicator to profile screen; spec out IndexedDB migration for Q3.
3. **Brain-fog mode rendering in the new modules.** Existing peri/PMDD modules respect brain-fog mode. New endo + ADHD modules inherit the design tokens that auto-respond to brain-fog mode (font scale via `--bf-scale`), but I want a manual spot-check on F94 body map (touch targets in BF mode must be ≥56pt). **Action:** Designer + Eng spot-check.
4. **HMR / dev-mode regression.** Babel-standalone in-browser compilation handles 8 → 11 JSX files reasonably; we're at the upper edge of what `@babel/standalone` is performant with. Consider migrating to Vite for dev. **Action:** Q3 dev-experience task.

**Verdict:** Code-quality green. Three Q3 items logged.

---

## Section 3 — Design Review

### Sana (Designer)

**Headline finding:** Tokens held. Motion held. New modules inherit the warm card aesthetic correctly. Body map (F94) is the visual signature I wanted for endo.

**Polish notes:**
1. **Body map zone selection.** Tap a zone → bottom sheet with NRS slider. The bottom-sheet pattern is consistent with existing mobile UX. ✓
2. **EHP-30 section navigation.** Five subscales of 6 items each — section-by-section scroll with a top progress bar. ✓
3. **Cycle correlation chart (F134).** Pre-60-day state shows a soft gradient with a progress ring. Post-60-day state shows the actual phase × medication effectiveness chart. The transition is significant and emotionally meaningful — this is the "thing the user has been searching for" moment. Spec said it's the differentiator; the design lands it.
4. **PDF report aesthetics.** Generated PDF has a eucalyptus header band, warm cream background tone, JetBrains Mono for clinical numbers, Instrument Serif for headings. It looks like HormonaIQ, not like a generic medical printout. ✓
5. **Crisis modal copy.** F88 AUB modal: "I will book this week" / "I've already discussed this with my doctor" — both direct, both honor the user's autonomy. ✓

**Concerns:**
1. **Tools tab density.** 86 cards across 8 groups. The group panels mitigate this, but on a small phone the visual rhythm gets crowded. **Action:** Add lazy-render / collapse by default for non-active condition groups. Show user's primary condition group expanded; others collapsed with a tap-to-expand summary.
2. **F94 body map on mobile.** SVG silhouette plus tap zones means precise targeting. Fingers are imprecise. **Action:** Increase zone hit-test padding to 12pt beyond visible zone bounds.
3. **F140 BFRB log copy.** "Body-focused repetitive behavior" is clinical. UI should say "skin picking, hair pulling, nail biting, cheek chewing, lip picking" without lumping. **Action:** Already correct in agent's spec; verify when modules-5-adhd ships.
4. **Empty states.** Every new module needs a thoughtful empty state ("Log your first day to start your record" not blank). **Action:** Empty-state pass for all new modules in Phase 7.

**Verdict:** Design-ready with five polish items in Phase 7.

---

## Section 4 — Clinical Review

### Dr. Marsh (Clinical Lead)

**Headline finding:** Instrument fidelity held. ASRS-5 items match WHO 2003 wording. ADHD-RS scoring formula matches Vyvanse Phase 3 RCT methodology. EHP-30 subscale structure matches Jones et al. 2001. PHQ-9 item-9 gate matches my standing requirement (cannot dismiss without explicit safety confirmation).

**Per-instrument review:**
1. **F124 ASRS-5** — 6 items verbatim from WHO. Threshold ≥4/6 at "Often"/"Very Often" → positive screen. ✓ Sensitivity 90%, specificity 88% applies.
2. **F125 ADHD-RS** — 18 items, 0–3 scale, total 0–54. Severity bands (≤16 mild, 17–28 moderate, ≥29 severe) match clinical convention. Vyvanse benchmark: 19-point reduction = clinically significant. ✓
3. **F126 CAARS Emotional Lability** — 8-item subscale, T-score conversion. Cutoff T≥65 elevated, T≥70 very elevated. ✓ Note: full normative tables stratify by sex and age decade — our linear approximation is acceptable for trending but a note in the physician report should clarify "T-score derived from raw sum approximation; full normative tables not applied."
4. **F127 WFIRS-S** — 50-item, 6-domain. Cutoff ≥0.65 mean = impaired. 83% sensitivity, 85% specificity. ✓
5. **F128/F129 PHQ-9 / GAD-7** — Standard clinical instruments. Item 9 hard gate enforced. ✓
6. **F130 ISI** — 7-item, validated. ✓
7. **F101 EHP-30** — 30 items, 5 core subscales + 6 optional modules. Subscale scoring 0–100 transformed Likert sum. ✓ Optional modules (work, partner, children, medical_profession, treatment, infertility) toggleable per spec.
8. **F108 DIE red flags** — All 9 rules implemented per ESHRE 2022 guidance. Cyclical pattern detection (≥2 cycles same phase) is correct.
9. **F88 AUB rule** — Postmenopausal bleeding ≥365-day amenorrhea = endometrial cancer screen indication. Critical and non-dismissible. ✓
10. **F89 HBC caveat** — STRAW staging is meaningless under HBC. Caveat is clear and present.

**Concerns:**
1. **F134 Cycle correlation engine** — Algorithm is sound (luteal mean attention < follicular by ≥1.5 NRS triggers insight). I want the framing in the user-facing card to be "patterns that match what's been observed in research" not "you have luteal ADHD." Diagnostic overreach risk. **Action:** Eng to add framing review in Phase 7.
2. **F143 Accommodation letter generator** — ADA-ready PDF for HR. We must include a footer disclaimer: "This document summarizes patient self-report. It is not a clinical diagnosis. A licensed clinician's letter may be required for formal accommodation request." **Action:** Add to the generated PDF template.
3. **F148 CBT skill library** — Safren protocol cards are psychoeducational. Hard limit copy required: "This is psychoeducational content, not therapy. For clinical CBT, please see a licensed therapist who specializes in ADHD." Already in spec — verify in implementation. **Action:** Spot-check when modules-5-adhd ships.
4. **F149 Postpartum ADHD mode** — EPDS administration is appropriate. Item 10 SI gate must use the same crisis-service modal pattern as PHQ-9. **Action:** Verify when ADHD modules ship.
5. **F101 EHP-30** — 30 items can be exhausting on a flare day. Brain-fog mode should auto-suggest deferring to next month if user starts and abandons mid-form. **Action:** Add abandonment detection.

**Verdict:** Clinically sound with five clarifications above. None block ship; all should be addressed in Phase 7.

---

## Section 5 — User Research Review

### Iris (User Research Lead) — Persona Walkthroughs

#### Sofia 34 — ADHD inattentive, late-diagnosed last year

**Walkthrough:** Onboarding → 3-branch routing recognizes "recently_diagnosed" → late diagnosis support module (F150) auto-suggests on home → daily log captures 5 EF domains + masking effort + medication + sleep onset time → ASRS-5 monthly reminds at day 30.

**Sofia's verbatim reaction (simulated):** "It knows I just got diagnosed. It's not asking me to prove I have ADHD — it's offering me articles about reframing my history. The masking question is the first time an app has asked me that. I would screenshot this and send it to my therapist."

**Friction:** Five clinical instruments stacked monthly is a lot. Sofia would skip some. **Recommendation:** Stagger reminders so user doesn't see ASRS-5 + ADHD-RS + WFIRS-S + Brown EF/A all in the same week.

#### Emma 31 — Endometriosis, post-laparoscopy 2 years ago

**Walkthrough:** Onboarding → "diagnosed" branch + surgical history captured (rASRM stage, ENZIAN compartments, last surgery date) → home shows endo-aware Today screen with pain body map link → daily 5-D pain logger → EHP-30 monthly → physician report PDF generates a real document she can email to her surgeon.

**Emma's reaction (simulated):** "The mandatory caveat card on the staging screen — 'Stage describes anatomy, not your pain or function' — is everything. My stage 2 surgeon told me my pain shouldn't be this bad. This app says my pain is real. I'd recommend this to my Endo Sisters Discord."

**Friction:** Adolescent mode (F114) toggle is buried. Emma's cousin is 16 and has dysmenorrhea. **Recommendation:** Surface adolescent mode in onboarding for users who select endo + age <18, automatically.

#### Sarah 28 — Endometriosis, suspected, no diagnosis (3-year diagnostic delay)

**Walkthrough:** Onboarding → "suspected" branch → assessment prep guide preview → daily 5-D pain log → DIE red flag system (F108) fires when she logs cyclical right shoulder pain across 2 cycles → physician report generates with "what to ask your doctor" template.

**Sarah's reaction (simulated):** "I've been to four doctors. They all said it's IBS. The DIE flag for cyclical bowel symptoms — that's the thing I couldn't articulate. I'm taking this PDF to my next appointment."

**Friction:** DIE alert fires at 2 cycles. Sarah has been logging only 3 weeks. The pre-fire state should still show "watching for these patterns" so she knows the safety net exists. **Recommendation:** Add a "what we're watching" card in the safety section even before any rule fires.

#### Riona 22 — ADHD-PMDD overlap, on combined OCP

**Walkthrough:** Onboarding → both ADHD overlap + PMDD selected → primary picker → HBC question fires (because she's <35 with both conditions) → daily log captures DRSP + ADHD-EF → F146 PMDD-ADHD intersection module activates after 60 days → home shows double-peak warning during premenstrual phase.

**Riona's reaction (simulated):** "I've been told my mood swings are 'just PMS' for years. The double-peak detection is the first time something has named the pattern of being unable to focus AND falling apart emotionally in the same week. I'm showing my mom this."

**Friction:** Onboarding asks about ADHD presentation type (inattentive/hyperactive/combined) which Riona doesn't know — she just knows she's been struggling. **Recommendation:** Add an "I'm not sure" option that doesn't pathologize.

#### Miranda 46 — Peri-ADHD, perimenopausal, on HRT

**Walkthrough:** Onboarding → ADHD + Peri selected → HBC question (no, on HRT, separate flag) → STRAW staging → F144 perimenopause-ADHD intersection module → tracks HRT response on ADHD symptoms → physician report shows medication effectiveness changing as estrogen levels stabilize on HRT.

**Miranda's reaction (simulated):** "My psychiatrist had no idea why my Adderall stopped working at 44. My OB-GYN had no idea I have ADHD. This app is the bridge between them. The HRT response chart is the thing I needed to bring to both."

**Friction:** F144 module is technically dense. Could use a plain-English summary at top. **Recommendation:** Add a "what this means" card before the data dashboard.

#### Priya 17 — Adolescent endometriosis, undiagnosed

**Walkthrough:** Onboarding → DOB 17 → guardian consent flow already exists (T-31) → endo selected → adolescent mode (F114) auto-activated → simplified 6-zone body map → school absence tracking → dyspareunia field hidden by default → parent portal export option.

**Priya's reaction (simulated):** "Most period apps are pink and treat me like I'm 12. This is serious. The school-absence section helped me explain to my teacher why I miss class. The body map on my pelvis without all the medical names — I could show my mom without it being weird."

**Friction:** Crisis resources show adult set by default if guardian consent not yet received. Should default to teen set during pending consent. **Recommendation:** Verify teen-set selection logic for `verifiedMinor === 'pending_consent'` (already in code per existing T-31 logic — confirm).

### Iris's overall verdict

**Six personas. Six "I would tell my [therapist / surgeon / mom / Discord / doctor / teacher]" moments.** That's the felt experience the user asked for: "feel like he has come somewhere he is always finding, always searching."

The product earns that line for these personas because:
1. It names patterns no other app names (RSD, masking, DIE flags, double-peak, HRT-ADHD interaction, postmenopausal bleeding gate)
2. It hands the user a real artifact (the PDF) to take to their doctor
3. It respects the user's autonomy (every alert offers "I've discussed this" / "I'll book this" — never paternalistic)
4. It doesn't diagnose; it documents

**Verdict:** User-research-validated. Six recommendations logged for Phase 7.

---

## Section 6 — Investor Review

### Marc

**Headline finding:** The pitch deck and the product now match. Before Round 7, claiming "5 conditions" was overreach. After Round 7, claiming "5 conditions, real clinical instruments, real physician PDFs, real safety rules across all 5" is defensible.

**Demo readiness:**
- 30-second demo: open app → Sofia logs ADHD day → cycle correlation engine pre-60 progress bar → done. Demonstrates the differentiator (cycle × ADHD).
- 90-second demo: Emma navigates body map → logs PHQ-9 → DIE red flag fires from her bowel log history → PDF generates → email to surgeon. Demonstrates the artifact.
- 5-minute deep dive: Riona's PMDD-ADHD intersection over 90 days. Demonstrates depth.

**Concerns:**
1. **What's the one chart on the marketing site?** I'd argue it's the cycle × medication effectiveness chart from F134. It's clinically novel and visually intuitive. **Action:** Designer to mock the marketing-site hero variant of this chart.
2. **Pricing.** $14.99/mo includes all 5 conditions in a single app. Competitors (Inflow $0.55/day, Caria peri $5.99/mo) don't bundle. We charge ~$0.50/day. The math holds if our conversion rate is anywhere above 1.5%.
3. **Clinical advisory board.** With this product, I can recruit. Before Round 7, I couldn't have. **Action:** Begin clinical advisory recruitment in parallel with launch prep.

**Verdict:** Investor-ready. Two recommendations + one external action logged.

---

## Section 7 — Agreed Changes (Phase 7 inputs)

Aggregated from all team verdicts. Prioritized.

### P0 — Must do before final ship

1. **Add "what we're watching" pre-fire card to F108 endo safety section** (Iris/Sarah persona finding)
2. **Auto-activate adolescent mode (F114) for endo users <18** (Iris/Emma persona finding)
3. **Stagger monthly clinical instrument reminders** so user doesn't see 4 instruments in same week (Iris/Sofia)
4. **Add F134 progress indicator on home** ("[N/60] days until your hormonal-ADHD pattern report") (Nova)
5. **F143 accommodation letter footer disclaimer** (Dr. Marsh)
6. **F101 EHP-30 abandonment detection + brain-fog mode auto-defer** (Dr. Marsh)
7. **Tools tab — collapse non-active condition groups by default** (Sana)
8. **F94 body map zone hit-test padding +12pt** (Sana)
9. **Empty-state pass for all new modules** (Sana)
10. **Add "I'm not sure" option to ADHD presentation type** (Iris/Riona)
11. **F134 framing copy review — patterns vs. diagnosis** (Dr. Marsh)
12. **Verify teen-set crisis resources for pending_consent state** (Iris/Priya)

### P1 — Q3 backlog (not blocking ship)

1. Self-host jsPDF + html2canvas (Ravi)
2. localStorage usage indicator + IndexedDB migration plan (Ravi)
3. Vite migration for dev-mode (Ravi)
4. F33 food photo CV — kill flag or specify Q3+ scope (PM)
5. F148 CBT therapist marketplace — clearly Q3+ scope (PM)
6. F29 calendar OS sync — Q3+ scope (PM)
7. F150 late diagnosis content co-review (Aria + Iris)
8. Apple Health / Health Connect integration scope (Ravi)
9. Clinical advisory board recruitment (Marc)
10. Marketing-site hero chart — F134 cycle × medication effectiveness (Sana)

---

## Section 8 — Sign-Off

| Team | Status | Notes |
|---|---|---|
| Brand (Aria) | ✓ Ready with 3 actions in Phase 7 | Voice held; F150 needs co-review next sprint |
| Product (Nova) | ✓ Ready with 3 actions in Phase 7 | Endo + ADHD now real, not phantom |
| Engineering (Ravi) | ✓ Ready with 3 Q3 backlog items | localStorage budget watched |
| Design (Sana) | ✓ Ready with 5 polish items in Phase 7 | Body map is the visual signature |
| Clinical (Dr. Marsh) | ✓ Clinically sound with 5 clarifications | All instruments verified |
| User Research (Iris) | ✓ All 6 personas land | "Always searching, finally found" achieved for each |
| Investor (Marc) | ✓ Pitch and product now align | Differentiator chart locked |

**All teams: GREEN. Ship after Phase 7 polish.**

---

## Section 9 — The "Apple-team standard" check

The user asked: rich, refreshing, welcoming, "always searching, finally found."

**Rich:** 151 features. Real clinical instruments. Cycle-phase correlation. Cross-condition intersections. Six personas all served distinctly. ✓

**Refreshing:** Voice avoids therapeutic clichés. Doesn't treat hormonal users like fragile patients. Direct without being cold. The "Logged. This is real." crisis tier-1 copy is the kind of restraint Apple's accessibility team writes. ✓

**Welcoming:** Onboarding is condition-aware from screen 3. By cycle basics step, user already knows the app understands what they have. Empty states (still in polish pass) will land softly. ✓

**Always searching, finally found:** Six personas, six "I would tell my [trusted person]" moments. That phrase the user wrote — that's exactly the test we built toward. Every persona earned it on a different feature. That's the breadth × depth × intentionality test passing. ✓

---

## Section 10 — Reconvene plan

After Phase 7 polish completes, all 7 team leads return for Phase 8 final satisfaction review. Iris re-runs the 6 persona walkthroughs on the polished build. Sign-off doc records each lead's confirmation of "no remaining concerns" or escalates to a blocker.

End of multi-team review.
