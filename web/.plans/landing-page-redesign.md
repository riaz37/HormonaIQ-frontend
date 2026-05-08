# HormonaIQ Landing Page — Full Redesign Plan

**Status:** In review  
**Branch:** main  
**Date:** 2026-05-08  

## Brief

Transform the current waitlist-only landing page into a full professional company page.  
App is LIVE on iOS and Android. Core platform: Healthcare Opinion. AI assistant: **Ora**.

### Brand Identity
- Core: Healthcare Opinion — clinical-grade hormonal health tracking
- Ora: warm AI companion, listens to any problem, provides suggestions, strictly private
- Privacy is a core brand pillar — strict, named, repeated
- Professional team, professional company — every pixel earns trust

### What Changes
- Remove ALL waitlist CTAs → replace with App Store + Play Store download buttons
- Add Ora introduction section
- Add Privacy/Security section
- Add Social Proof / testimonials
- Add About / company section
- Add FAQ
- Full footer with links
- Navigation that can expand for future web app routes

---

## Page Sections (to build)

1. **Nav** — sticky, logo + links + App Store CTA
2. **Hero** — headline + Ora intro + App Store / Play Store badges
3. **Ora section** — who Ora is, warmth, privacy promise
4. **How it works** — 3-step flow
5. **Conditions** — PMDD, PCOS, Perimenopause, Endo, ADHD
6. **Privacy Promise** — no data sharing, on-device, encryption
7. **Social Proof** — App Store ratings, testimonial quotes
8. **FAQ** — 5–7 questions
9. **Download CTA** — full-width app store section
10. **Footer** — links: About, Privacy Policy, Terms, Contact, App Store, Play Store, social

---

## Design Decisions

### Information Architecture
- **Nav (confirmed):** Logo | How It Works | Conditions | Privacy | [App Store] [Play Store]
- **About:** Footer only (not in nav)
- **Ora:** Introduced in hero — no separate nav link
- **Page section order (confirmed):**
  1. Nav (sticky)
  2. Hero — headline + Ora intro + download badges
  3. Ora section — who she is, warmth, privacy
  4. How it works — 3-step flow
  5. Conditions — PMDD, PCOS, Perimenopause, Endo, ADHD overlap
  6. Privacy Promise — on-device, no selling, encryption
  7. Social Proof — App Store ratings + 2–3 testimonials
  8. FAQ — 5–7 questions
  9. Full-width Download CTA
  10. Footer — Privacy Policy | Terms | About | Contact | App Store | Play Store | social

### Interaction States
- **WaitlistForm:** Removed entirely — no form on the new page
- **FAQ:** Accordion pattern (`'use client'` component). States: collapsed (default), expanded. One item open at a time.
- **App Store / Play Store badges:** Plain anchor tags (`target="_blank" rel="noopener"`), no JS state
- **Nav CTA:** Anchor tags linking to App Store / Play Store — no state
- **Mobile nav:** Hamburger menu for viewports < 768px — open/closed state required

### User Journey & Emotional Arc
| Step | What we show | Desired feeling |
|------|-------------|-----------------|
| 1 Hero | "You already knew. Now your doctor will too." + download badges | Recognition — "this is for me" |
| 2 Ora | Warm intro: she listens, private, no judgment | Safety — "someone finally hears me" |
| 3 How it works | 3 steps, clinical but human | Confidence — "I can actually do this" |
| 4 Conditions | Named: PMDD, PCOS, Perimenopause, Endo, ADHD | Validation — "they know what I have" |
| 5 Privacy | On-device, no selling + "We will never tell you you're LUMINOUS" pull-quote | Trust — "I can believe this" |
| 6 Social proof | App Store ratings + 2–3 real quotes | Safety in numbers |
| 7 FAQ | 5–7 questions, honest answers | Confidence — "I'm not confused" |
| 8 Download CTA | Single action | Motivation to act |

**The Promise text** ("We will never tell you you're feeling LUMINOUS…") → pull-quote inside the Privacy section, not a standalone section.

### AI Slop Fixes
- **How it works:** Replace 3-column icon-card grid with numbered steps (large "01 02 03" numerals + title + prose). No icons, no colored circles.
- **Conditions section:** Keep 2-col card layout (distinctive enough via phase color strips, not pure feature grid). Reuse existing design.
- **Ora section:** NO cards. Full-width narrative layout — Instrument Serif italic quote from Ora + supporting body copy + one visual element (abstract or cycle-adjacent). Not a features list.
- **Privacy section:** NOT a bullet list of checkmarks. Prose paragraphs + the Promise pull-quote. More manifesto, less checklist.
- **Social proof:** App Store stars + 2–3 quotes in a horizontal scroll or stacked layout. NOT testimonial cards with headshots (no stock photos).

### Design System Rules (new sections)
- All backgrounds: `bg-cream`, `bg-cream-warm`, `bg-mint-mist` — alternate per section for visual rhythm
- Section headings: `font-display italic` (Instrument Serif) for emotional lines, `font-sans font-bold` for functional headings
- Body copy: `text-ink-2`, `text-[16px] leading-[1.65]` minimum
- Borders: `ring-1 ring-sage/20` — never hard borders
- Ora section bg: `bg-cream-warm` with subtle sage/20 border-top
- Privacy section bg: `bg-mint-mist` — same as old waitlist section (repurposed)
- Download CTA section: `bg-eucalyptus` (dark green, light text) — the only full-color section
- App Store / Play Store badges: SVG badges, no rasterized PNGs
- No `system-ui` or `-apple-system` as primary font — Inter is already set correctly

### Responsive & Accessibility
**Mobile nav:** Logo | [Download] | Hamburger. Links revealed on tap. `'use client'` component with ARIA `aria-expanded`, `role="dialog"` for the open drawer.

**Per-section responsive specs:**
| Section | Desktop | Mobile |
|---------|---------|--------|
| Hero | 2-col (copy left, ring right) | 1-col stacked, ring moves below CTA |
| Ora | Full-width narrative, 2-col (text + abstract visual) | 1-col stacked |
| How it works | 3 numbered steps side-by-side | Vertical stack, numbers large |
| Conditions | 2-col card grid | 1-col stack |
| Privacy | Max-width centered prose | Full-width, same padding |
| Social proof | Horizontal 3-col quotes | Vertical stack |
| FAQ | Max-width centered accordion | Full-width accordion |
| Download CTA | 2-col (copy + badges side-by-side) | 1-col, badges centered |
| Footer | 4-col link groups | 2-col then 1-col |

**Accessibility requirements:**
- All interactive elements: 44px minimum touch target
- Contrast: body text ≥ 4.5:1, `ink` on `cream` = #1B2E25 on #FAFBF6 ≈ 14.5:1 (passes)
- Hamburger button: `aria-label="Open navigation"`, `aria-expanded`
- FAQ accordion: `role="button"`, `aria-expanded`, `aria-controls`
- App Store badges: meaningful `alt` text ("Download HormonaIQ on the App Store")
- Cycle ring: `role="img"` + `aria-label` (already present in existing code)
- Skip-to-content link at top of page
- `prefers-reduced-motion` already handled in globals.css

### Unresolved Decisions (resolved during Pass 7)
| Decision | Resolution |
|----------|-----------|
| Social proof content | Build with clean semantic placeholders — fill with real reviews before deploy |
| App Store / Play Store URLs | Placeholder `href="#"` with `TODO:` comment — fill before deploy |
| FAQ content | Implementer writes 5–7 questions with HormonaIQ-specific answers (see FAQ spec below) |
| Ora section visual | **Dedicated graphic designer + prompt engineer will produce custom assets.** Build section to accept `<Image>` with known dimensions slot — no SVG fallback needed |
| About/Team | Single paragraph in footer, no separate page for now |
| Contact | Email address in footer (`contact@hormona-iq.com` or similar) — user to confirm |

### FAQ Content Spec (5–7 questions)
1. Is HormonaIQ free?
2. Is my data private?
3. What conditions does HormonaIQ track?
4. What is Ora?
5. Do I need to be a doctor to understand the reports?
6. Can I share my data with my doctor?
7. Is HormonaIQ available on iPhone and Android?

### Web App Route Structure (future-proofing)
The landing page lives at `/`. Reserve these routes for the future web app:
- `/app` — web app entry (gated by auth)
- `/app/log` — daily log
- `/app/insights` — insights dashboard
- `/about` — full about page (deferred)
- `/privacy` — Privacy Policy (required, build now)
- `/terms` — Terms of Service (required, build now)

Add `app/(marketing)/` route group for landing/privacy/terms, and `app/(web-app)/` group (empty) for future web features.

---

## NOT in scope (explicitly deferred)
- Web app features (`/app/log`, `/app/insights`, etc.) — structure reserved, not built
- Full `/about` page — single paragraph in footer is sufficient for now
- Contact form — email address in footer only
- Push notification opt-in flow — mobile only
- Blog / press section — deferred post-launch
- Internationalization (i18n) — English only for now
- Dark mode — not in scope for landing page
- Unit/E2E tests — deferred; plain static marketing page, no business logic

## What already exists (reuse)
- `CycleRing` SVG component — currently **inlined** in `page.tsx`; **extract** to `app/components/landing/CycleRing.tsx`
- `DecorativeLeaf` SVG — currently **inlined** in `page.tsx`; **extract** to `app/components/landing/DecorativeLeaf.tsx`
- `LeafIcon`, `SprigIcon`, `BranchIcon` SVGs — currently inlined; extract alongside above
- Design tokens in `globals.css` — use as-is, no changes needed
- Font stack (Instrument Serif + Inter + JetBrains Mono) — keep exactly
- Conditions section card design — reuse with minimal changes
- `bg-mint-mist` section (old waitlist) — repurpose as Privacy section
- Gradient blob in hero — keep, adds visual warmth

## Component Location Convention
All new landing page components → `app/components/landing/`

```
app/components/landing/
  CycleRing.tsx        (extracted from page.tsx)
  DecorativeLeaf.tsx   (extracted from page.tsx)
  Nav.tsx              ('use client')
  OraSection.tsx
  HowItWorks.tsx
  ConditionsSection.tsx
  PrivacySection.tsx
  SocialProof.tsx
  FAQSection.tsx       ('use client')
  DownloadCTA.tsx
  Footer.tsx
```

## Implementation Order
0. **Read Next.js 16 docs** — `node_modules/next/dist/docs/` — verify route group API, `'use client'`, `next/image`, and metadata API before writing any code (AGENTS.md requirement)
1. Restructure routes into `app/(marketing)/` group:
   - Keep `app/layout.tsx` at root (applies to all future routes including `/app`)
   - Add `app/(marketing)/layout.tsx` — contains skip-to-content link only
   - Move `app/page.tsx` → `app/(marketing)/page.tsx`
   - Create `app/(web-app)/` (empty placeholder)
2. Extract inline SVGs from current `page.tsx` → `app/components/landing/` (CycleRing, DecorativeLeaf, icon SVGs)
3. Build `Nav` component — `app/components/landing/Nav.tsx` (`'use client'`, hamburger)
4. Update `Hero` — replace waitlist CTA with App Store + Play Store badges, add Ora mention
5. Build `OraSection` — 2-col narrative, `next/image` slot (480×480 desktop / 320×320 mobile); **use an aspect-ratio placeholder div** (`aspect-square bg-mint-mist rounded-[28px]`) until custom asset is delivered — no broken img tag
6. Replace `HowItWorks` icon cards with numbered steps (01 02 03 large numerals)
7. Keep `ConditionsSection` — minor copy updates
8. Build `PrivacySection` — prose + Promise pull-quote (moved from current standalone section)
9. Build `SocialProof` — placeholder stars + quote slots (use `aria-hidden` on placeholders; mark placeholder quotes clearly in code comments so they can't accidentally ship)
10. Build `FAQSection` — `'use client'` controlled accordion; **shared state** (`useState<number | null>`) drives all items — do NOT give each item its own `useState`
11. Build `DownloadCTA` — full-width `bg-eucalyptus` section
12. Build full `Footer` with 4-col link groups
13. Add `/privacy` and `/terms` stub pages (with `export const metadata` per page)
14. Delete `app/components/WaitlistForm.tsx` (git history preserves it)
15. Run `next build` — verify zero errors, zero TypeScript errors, check bundle output

## TODO
- [ ] **Legal copy for `/privacy` and `/terms`** — Healthcare app requires careful language (data retention, third-party SDKs, HIPAA-adjacent disclosures). Get legal review before these pages go live. Owner: TBD.
- [ ] **Confirm contact email** — `contact@hormona-iq.com` or actual address — required for Footer
- [ ] **App Store + Play Store URLs** — replace `href="#"` placeholders before any public link to the site
- [ ] **Ora section custom asset** — 480×480px (2× for retina). Owner: graphic designer / prompt engineer. Aspect-ratio placeholder renders until ready.

---

## GSTACK REVIEW REPORT

| Review | Trigger | Why | Runs | Status | Findings |
|--------|---------|-----|------|--------|----------|
| CEO Review | `/plan-ceo-review` | Scope & strategy | 0 | — | — |
| Outside Voice | `/plan-eng-review` | Independent 2nd opinion | 1 | CLEAR | 8 findings reviewed, 5 cross-model resolved |
| Eng Review | `/plan-eng-review` | Architecture & tests (required) | 1 | CLEAR | 6 issues, 0 critical gaps |
| Design Review | `/plan-design-review` | UI/UX gaps | 1 | CLEAR | score: 2/10 → 8/10, 9 decisions |
| DX Review | `/plan-devex-review` | Developer experience gaps | 0 | — | — |

- **CROSS-MODEL:** Outside voice and eng review agree on: Next.js 16 docs-check required, Ora image blocking dep, route layout split. Disagree on FAQ approach — original `'use client'` plan retained per user decision.
- **UNRESOLVED:** 0
- **VERDICT:** ENG + DESIGN CLEARED — ready to implement.

