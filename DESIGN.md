# Design System — HormonaIQ

> Single source of truth for all visual decisions. If code disagrees with this file, this file wins.
> Source: `design-handoff/01-tier1-must-paste/01-DESIGN.md` (canonical), extracted 2026-05-03.

## Product Context

- **What this is:** Women's hormonal health companion for PMDD, PCOS, perimenopause, endometriosis, and ADHD-hormone overlap
- **Who it's for:** Adults (13+) who have been dismissed by doctors and need clinical-grade data their clinician will act on
- **Space:** Women's health. NOT a fertility app, NOT a wellness app, NOT clinical-cold
- **Memorable thing:** *"This isn't a period tracker. It's for the other weeks of the month — the ones no one else tracks."*
- **Platform:** Expo (React Native), mobile-first, iOS + Android

## Aesthetic Direction

- **Direction:** Refreshing organic minimalism — "Morning Garden"
- **Mood:** Walking into a place with greenery and good weather. Refreshing, positive, comforting, premium without precious
- **Decoration:** Intentional. Decorative leaves and gradient blobs appear once per primary screen, anchored to corners, opacity 0.18–0.4, `pointer-events: none`
- **References:** Apple Health (clarity) × Headspace (warmth) × Linear (typographic discipline)

### What this is NOT
- ❌ Not pink fertility-app (no hot pink, no flowers)
- ❌ Not clinical-cold (no doctor white, no hospital blue)
- ❌ Not wellness-cliché (no crystals, no toxic positivity)
- ❌ Not Flo-generic (no gradient-everything)

## Typography

Three families, each with a clear job. No system fonts as primary.

| Role | Family | Weight | Usage |
|------|--------|--------|-------|
| Display/Hero | **Instrument Serif** | 400, italic | Emotional moments, hero headlines, max once per screen |
| Body / UI / Labels | **Inter** | 400 / 500 / 600 / 700 | All copy, buttons, form labels |
| Data / Numerics | **JetBrains Mono** | 400 / 500 | DRSP scale numbers, lab values, cycle day counters |

### Type Scale

| Token | Family | Size | Weight | Line-height | Usage |
|-------|--------|------|--------|-------------|-------|
| `display-xl` | Instrument Serif | clamp(40, 6vw, 76)px | 400 | 1.0 | Landing hero only |
| `display` | Instrument Serif | 32px | 400 | 1.05 | Screen-level h1 |
| `display-sm` | Instrument Serif | 26px | 400 | 1.15 | Module sheet headers |
| `h1` | Instrument Serif | 30px | 400 | 1.15 | Section headers |
| `h2` | Inter | 18–20px | 600 | 1.3 | Card titles |
| `body-l` | Inter | 17px | 400 | 1.55 | Lead paragraphs |
| `body` | Inter | 15px | 400 | 1.55 | Default body |
| `caption` | Inter | 13px | 400 | 1.45 | Captions, metadata |
| `data` | JetBrains Mono | 13px | 400 | — | Numerics |
| `eyebrow` | Inter | 11px | 500 | — | Uppercase, letter-spacing 0.16em |

**Rule:** Italic display (`.italic-display`) max **once per screen**, hero h1 only.

### Loading (Expo)
```
expo-font or @expo-google-fonts/instrument-serif
@expo-google-fonts/inter
@expo-google-fonts/jetbrains-mono
```

## Color — Morning Garden Palette

### Brand Greens
| Token | Hex | Usage |
|-------|-----|-------|
| `eucalyptus` | `#3F6F5A` | Primary CTAs, brand accent, links |
| `eucalyptus-deep` | `#2C5443` | Hover/press state on primary |
| `eucalyptus-soft` | `#5C8A75` | Secondary emphasis |
| `sage` | `#9CB89A` | Dividers, secondary accent |
| `sage-light` | `#C7D9C5` | Phase-follicular fill, gentle highlight |
| `mint-mist` | `#DCEBDD` | Card backgrounds, soft button bg |
| `mint-pale` | `#ECF4EC` | Subtle hover, faint surface |

### Neutrals (warm, not gray)
| Token | Hex | Usage |
|-------|-----|-------|
| `ink` | `#1B2E25` | Primary text — warm near-black |
| `ink-2` | `#4A5C53` | Secondary text |
| `ink-3` | `#7A8B82` | Captions, hints |
| `ink-disabled` | `#B5C0BA` | Disabled state |
| `paper` | `#FFFFFF` | Clinical-data surfaces (Lab Vault, PDF) |
| `cream` | `#FAFBF6` | Default background |
| `cream-warm` | `#F4F0E5` | Warm surface variant |

### Accents
| Token | Hex | Usage |
|-------|-----|-------|
| `butter` | `#F5E4B8` | Warm highlight |
| `butter-deep` | `#E8C97A` | Notification dots, ovulatory emphasis |
| `coral` | `#E89F86` | Warm accent, luteal phase |
| `coral-soft` | `#F5C8B5` | Gentle coral tint |
| `rose` | `#D88A95` | Menstrual phase |
| `danger` | `#B95446` | Irreversible actions ONLY (not phase colors) |

### Phase Colors (carry meaning, never decoration)
| Token | Hex | Phase |
|-------|-----|-------|
| `phase-follicular` | `#C7D9C5` | Follicular |
| `phase-ovulatory` | `#F5E4B8` | Ovulatory |
| `phase-luteal` | `#E89F86` | Early luteal |
| `phase-luteal-deep` | `#C97962` | Late luteal / luteal peak |
| `phase-menstrual` | `#B97A8A` | Menstrual |

### Severity Scale
| Token | Hex | Usage |
|-------|-----|-------|
| `severity-mild` | `#5C8A75` | Low severity |
| `severity-mod` | `#E8C97A` | Moderate severity |
| `severity-severe` | `#C97962` | High severity |

### Dark Mode
Rebuild surface hierarchy — near-neutral grays + ember accents:
- `bg`: `#181F1B` | `surface`: `#1F2620` | `surface-warm`: `#243A2D`
- `ink`: `#ECF2EE` | `ink-2`: `#B8C7BE` | `ink-3`: `#8A9D93`
- Reduce phase color saturation ~15%

## Spacing

- **Base unit:** 4px
- **Density:** Comfortable
- **Scale:** 2(2px) 4(4px) 8(8px) 12(12px) 16(16px) 24(24px) 32(32px) 48(48px) 64(64px)

## Layout

- **Approach:** Grid-disciplined for clinical data, warmer for home/emotional screens
- **Max content width:** 390px (device frame) — mobile-first, no wide-screen layout
- **Border radius:**
  - `radius-sm`: 10px
  - `radius-md`: 18px
  - `radius-lg`: 28px
  - `radius-xl`: 40px
  - `radius-pill`: 9999px
- **Bottom nav height:** 64px
- **FAB:** 56px circle, eucalyptus background, fixed above bottom nav at bottom: 88px

## Motion

- **Approach:** Intentional — only transitions that aid comprehension or provide emotional warmth
- **Rule:** All animations MUST respect `prefers-reduced-motion` (and app-level `reduceMotion` toggle)
- **Easing:** enter `ease-out` | exit `ease-in` | move `ease-in-out`
- **Duration:** micro 50–100ms | short 150–250ms | medium 250–400ms | long 400–700ms
- **Specific patterns:**
  - Phase pulse ring: 6s ease-in-out infinite
  - Tab active transition: 250ms ease-out
  - FAB entrance: 200ms ease-out scale from 0.85
  - Modal entrance: 300ms ease-out slide up + fade
  - Brain fog mode: slow all transitions by 1.5×

## Accessibility

- **Tap targets:** 44px minimum, 56px in brain-fog mode
- **Brain fog mode:** Font scale ×1.1, 3-tab simplified nav, slower transitions
- **Reduce-motion:** Global `data-reduce-motion` attribute on root; disable pulse rings, scale animations
- **Contrast:** All text/background combos must meet WCAG AA (4.5:1 for body, 3:1 for large text)
- **Screen readers:** `accessibilityLabel` on all interactive elements

## Banned Copy (never use in user-facing strings)

Wonderful, luminous, glowing, radiant, flourish, journey, wellness, take control,
listen to your body, your feelings are valid, I hear you, you deserve, be gentle with
yourself, lean into, halfway there, almost there, you've got this, calorie, macro, BMI,
goal weight, thrive, empower, transform, optimize.

**Tone:** Direct, honest, never therapeutic-speak.
- ✅ "Logged. This is real."
- ✅ "Some days in this phase can feel really dark."
- ❌ "Thank you for sharing!"
- ❌ "We hear you. You're doing great."

## Safety Copy Rules

- Crisis Tier 1 (quiet, luteal home screen): soft lavender text link, not a red button
- Crisis Tier 2 (full modal): acknowledging language FIRST, resources second
- Crisis Tier 3 (non-dismissible): requires "I have discussed this with a doctor" confirmation
- Medical disclaimer on all in-app screens: "HormonaIQ is not a substitute for medical advice."

## Component Tokens (Expo StyleSheet reference)

```typescript
// src/constants/tokens.ts
export const colors = {
  eucalyptus: '#3F6F5A',
  eucalyptusDeep: '#2C5443',
  eucalyptusSoft: '#5C8A75',
  sage: '#9CB89A',
  sageLight: '#C7D9C5',
  mintMist: '#DCEBDD',
  mintPale: '#ECF4EC',
  ink: '#1B2E25',
  ink2: '#4A5C53',
  ink3: '#7A8B82',
  inkDisabled: '#B5C0BA',
  paper: '#FFFFFF',
  cream: '#FAFBF6',
  creamWarm: '#F4F0E5',
  butter: '#F5E4B8',
  butterDeep: '#E8C97A',
  coral: '#E89F86',
  coralSoft: '#F5C8B5',
  rose: '#D88A95',
  danger: '#B95446',
} as const;

export const phase = {
  follicular: '#C7D9C5',
  ovulatory: '#F5E4B8',
  luteal: '#E89F86',
  lutealDeep: '#C97962',
  menstrual: '#B97A8A',
} as const;

export const radius = {
  sm: 10,
  md: 18,
  lg: 28,
  xl: 40,
  pill: 9999,
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;
```

## Decisions Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-05-03 | DESIGN.md created at project root | Extracted from design-handoff/01-tier1-must-paste/01-DESIGN.md for Expo mobile development |
| 2026-04-26 | Morning Garden palette chosen | Organic minimalism — warmth + clinical credibility, not fertility-pink |
| 2026-04-26 | Instrument Serif + Inter + JetBrains Mono | Three jobs: emotional (display), functional (UI), precise (data) |
| 2026-04-26 | Single app, modular — Option C | 23%+ comorbidity rate; multi-app fragments own users |
| 2026-05-03 | Expo over Flutter | Logic reuse (14,890 lines JSX), OTA safety updates, team knows React |
