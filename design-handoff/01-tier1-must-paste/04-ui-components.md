# HormonaIQ — UI Component Specification
**Version:** 1.0
**Date:** April 26, 2026
**Audience:** Engineers and designers building HormonaIQ
**Token source:** docs/04-design/design-tokens.yaml
**Brand source:** docs/04-design/brand-and-ux.md
**Feature source:** docs/02-product/features.md

---

## Section 1 — Component Principles

Five rules govern every component in HormonaIQ. A component that violates any of these rules is not shippable.

### Rule 1: 44pt Minimum Touch Target, No Exceptions

Every interactive element — buttons, chips, icons, sliders, close targets — has a minimum touch target of 44 × 44pt on iOS and 48 × 48dp on Android. The visible element may be smaller than the touch target; the touch target is never smaller than the minimum. This is non-negotiable for a demographic that includes users with chronic pain, brain fog, and reduced fine motor precision during hard phases.

Implementation: use an invisible tap extension layer when the visual element is smaller than the target. Never rely on "it looks big enough."

### Rule 2: No Pure Black, No Pure White, No Cold Colors

`#000000` is never used. `#FFFFFF` is never used. All black is warm black (`#1C1A18` — text primary). All white is cloud white (`#FAFAF9` — bg primary) or warm white (`#F5F4F1`). Every shadow uses warm-tinted rgba, never pure gray (`rgba(28, 26, 24, X)` — see shadow tokens). The app must feel warm and safe at all times. Cold, sterile UI is what we are not building.

### Rule 3: Phase Colors Are Informational, Never Alarming

Phase colors communicate where the user is in their cycle. They are never used as urgency signals. Luteal peak lavender is not red. Menstruation blush is not a warning color. The crisis indicator (`#C95555` — signal red) is reserved for genuine safety contexts only. When in doubt about whether a color conveys alarm, test it: show it to someone and ask what action they feel compelled to take. If the answer is "panic," the color is wrong.

### Rule 4: The Luteal Peak Test

Before shipping any component, render it with luteal peak phase coloring active, brain fog mode enabled, and the component in its most information-dense state. If the component passes — it is understandable, operable, and calming — it ships. If it overwhelms or confuses in this state, it is redesigned. The hardest moment for users is the most important moment for the app to work.

### Rule 5: Every State Is Designed

Every component ships with all states fully designed: default, hover (where applicable), focused, pressed/active, disabled, loading, error, and empty. Components without a complete state set are not production-ready. "We'll handle that edge case later" is how broken UI ships.

---

## Section 2 — Foundation Components

---

### Button

**Description:** The primary action trigger. Four variants serve all interaction contexts.

---

#### Button — Primary

The default action button. Used for confirmations, primary CTAs, log submission, report export.

**Dimensions:**
- Height: 44px (md), 52px (lg), 32px (sm)
- Min width: 120px
- Padding horizontal: 20px (md), 24px (lg), 12px (sm)
- Border radius: `{radius.md}` — 10px
- Font: 15px / 600 weight / Inter

**Token references:**
- Background: `{semantic.interactive.primary_bg}` — sage-400 `#8DAF8A`
- Background hover: `{semantic.interactive.primary_bg_hover}` — sage-600 `#5F8A5C`
- Text: `{semantic.interactive.primary_text}` — cloud white `#FAFAF9`
- Shadow (resting): `{shadow.xs}` — `0 1px 2px rgba(28, 26, 24, 0.05)`
- Shadow (hover): `{shadow.sm}`

**States:**
- Default: sage-400 fill, white text, xs shadow
- Hover / focused: sage-600 fill, transition 120ms ease-default
- Pressed: sage-400 fill, brightness -8%, scale 0.98, 50ms instant
- Disabled: `{primitive.white.fog}` fill `#D6D1C9`, text `{neutral.500}` `#9E9891`, no shadow, cursor not-allowed
- Loading: spinner icon (20px, white) replaces label text; button remains same size; background stays sage-400

**DO:**
- Use for the single primary action per screen
- Use lg size for the single most important action (e.g., "Save Log", "Generate Report")
- Use md size for standard in-screen actions
- Use sm size in compact contexts (inside chips, tool bars)

**DON'T:**
- Do not use more than one Primary button per screen view
- Do not use Primary for destructive actions (use Destructive variant)
- Do not truncate button label; resize button instead

**Accessibility:**
- `accessibilityRole="button"` / `role="button"`
- Disabled state: `accessibilityState={{ disabled: true }}`
- Loading state: `accessibilityLabel="[action], loading"` — announce state change to screen reader

---

#### Button — Secondary

Outlined button for secondary actions that are present alongside a primary action.

**Dimensions:** Same as Primary (same height, padding, radius)

**Token references:**
- Background: transparent
- Border: 1.5px solid `{semantic.interactive.secondary_border}` — sage-400 `#8DAF8A`
- Text: `{semantic.interactive.secondary_text}` — sage-600 `#5F8A5C`

**States:**
- Default: transparent fill, sage-400 border, sage-600 text
- Hover / focused: sage-50 `#EDF5EC` fill, border stays, 120ms
- Pressed: sage-100 `#D5E8D4` fill, 50ms
- Disabled: fog border `#D6D1C9`, fog text `#9E9891`
- Loading: same spinner behavior as Primary; sage-600 spinner

**DO:**
- Use alongside a Primary button for cancel / back / secondary path
- Use for actions that are optional or reversible

**DON'T:**
- Do not use as the only button on a screen — one action always has primary visual weight

---

#### Button — Ghost

Text-only button, no background or border. For tertiary, low-emphasis actions and in-flow navigation.

**Dimensions:**
- Height: 44px touch area; visual label only
- No min width; label-driven
- Padding horizontal: 8px
- Font: 15px / 500 weight

**Token references:**
- Text: `{semantic.interactive.ghost_text}` — neutral-600 `#6B6661`
- Background: transparent always

**States:**
- Default: no visual container; neutral-600 text
- Hover / focused: text underline, neutral-700 `#47433D`
- Pressed: neutral-800 `#2E2B27`, 50ms
- Disabled: neutral-400 `#B8B2AA`, no underline

**DO:**
- Use for "Skip", "Cancel", "Learn more", in-flow de-emphasis actions
- Use for navigation actions within a flow (Back)

**DON'T:**
- Do not use Ghost for actions the user might overlook and cause flow breakage
- Do not use in combination with two higher-emphasis buttons (creates too many options)

---

#### Button — Destructive

For irreversible actions: account deletion, data wipe, removing a condition module.

**Dimensions:** Same as Primary

**Token references:**
- Background: `{primitive.signal.red}` `#C95555`
- Text: white `#FAFAF9`
- Background hover: `#A8393C` (10% darker)

**States:** Same structure as Primary with red palette

**DO:**
- Always precede with a confirmation modal before the action executes
- Label the button with the exact action, not "OK" or "Continue" (e.g., "Delete All My Data")

**DON'T:**
- Do not use Destructive as the first interaction in a flow; always confirm
- Do not use during onboarding

---

### Input

**Description:** Text and data entry fields. All inputs are designed for use with brain fog — large targets, clear labels, no in-label placeholders that disappear.

---

#### Input — Text

Standard single-line text input.

**Dimensions:**
- Height: 48px
- Border radius: `{radius.md}` — 10px
- Padding horizontal: `{components.input.padding_h}` — 14px
- Font: 15px / 400 weight

**Token references:**
- Background: `{semantic.background.secondary}` — warm white `#F5F4F1`
- Border default: 1px solid `{semantic.border.default}` — mist `#EBE8E3`
- Border focused: 2px solid `{primitive.sage.400}` `#8DAF8A`
- Border error: 2px solid `{primitive.signal.red}` `#C95555`
- Label text: `{text.secondary}` — neutral-600 `#6B6661`, 13px / 500, positioned above the input field
- Input text: `{text.primary}` — neutral-900 `#1C1A18`
- Placeholder text: `{text.tertiary}` — neutral-500 `#9E9891`

**States:**
- Default: mist border, warm white bg
- Focused: sage-400 border (2px), subtle box shadow `0 0 0 3px rgba(141, 175, 138, 0.12)`
- Filled: same as default — no special filled state
- Error: signal-red border (2px), error message below in 13px / signal-red; error message icon (!) 16px left-aligned
- Disabled: fog background `#D6D1C9`, fog border, neutral-400 text; not editable
- Read-only: warm white background, mist border, primary text; a small lock icon or "(read-only)" caption appears

**DO:**
- Always place the label above the input field, not inside it (placeholder text is separate)
- Always show character count when there is a limit
- Always show the error message inline, below the input, not as a toast

**DON'T:**
- Do not use floating labels that animate out of the field — this increases cognitive load for brain fog users
- Do not rely on placeholder text to convey required information; use label + helper text below

**Accessibility:**
- `accessibilityLabel` = label text
- `accessibilityHint` = helper text if present
- Error state: `accessibilityState={{ invalid: true }}` and error message associated via `accessibilityDescribedBy`

---

#### Input — Number

Used for lab values, severity scales entered numerically.

**Dimensions:** Same as Text

**Additional elements:**
- Increment / decrement stepper buttons (+/-) on right edge, each 44 × 44pt touch target
- Unit label (e.g., "ng/dL") displayed in the input as right-aligned secondary text, always visible

**States:** Same as Text; number keyboard auto-opens on iOS/Android

---

#### Input — Date

Date picker input. Displays a formatted date string; tapping opens a native date picker.

**Dimensions:** Same as Text

**Additional elements:**
- Calendar icon (16px, neutral-500) on right edge; tapping either the icon or the input opens the picker
- Formatted display: "April 26, 2026" (never timestamp format in user-facing date inputs)

**DON'T:**
- Do not build a custom date picker; use the native OS date picker for accessibility and familiarity

---

#### Input — Slider

Used for severity ratings (1–6 DRSP scale, 1–5 symptom scales, brain fog 1–5).

**Dimensions:**
- Track height: 6px; border radius full
- Thumb: 28px diameter (touch target: 44 × 44pt via extended hit area)
- Total component height: 48px

**Token references:**
- Track (unselected): `{primitive.neutral.200}` `#EBE8E3`
- Track (selected): `{semantic.interactive.primary_bg}` sage-400 `#8DAF8A`
- Thumb: white `#FAFAF9`, shadow `{shadow.sm}`, border 1.5px sage-400
- Labels: numeric endpoint labels (e.g., "1" and "6") in caption style (11px / 500) below track ends

**States:**
- Default: thumb at current position
- Focused / dragging: thumb scale 1.15, box shadow `0 0 0 4px rgba(141, 175, 138, 0.20)`
- Disabled: track neutral-200, thumb neutral-300, no interaction

**Accessibility:**
- Slider must respond to accessibilityIncrement and accessibilityDecrement actions (arrow keys, switch control)
- `accessibilityValue` = current value + label (e.g., "3 of 6: Moderate")
- Label text for scale endpoints must be visible, not only conveyed by position

---

### Chip

**Description:** Compact, selectable tokens for multi-select symptom selection, filtering, and tagging. The primary interaction element in the log flow.

---

#### Chip — Selectable

Used in the log flow symptom chips and condition filtering.

**Dimensions:**
- Height: 32px
- Padding horizontal: 12px
- Gap between icon and label: 6px
- Border radius: `{radius.sm}` — 6px
- Font: 13px / 500

**Token references:**
- Default bg: `{semantic.background.tertiary}` `#EBE8E3`
- Default text: `{text.secondary}` `#6B6661`
- Selected bg: `{semantic.interactive.primary_bg}` sage-400 `#8DAF8A`
- Selected text: `{semantic.interactive.primary_text}` cloud white `#FAFAF9`
- Selected border: none (bg is sufficient)
- Default border: 1px solid `{semantic.border.subtle}` `#D6D1C9`
- Hover (unselected): `{primitive.neutral.200}` bg

**States:**
- Default: mist background, neutral border, secondary text
- Selected: sage-400 background, white text; subtle scale 1.02 animation on select (50ms, spring easing)
- Disabled: fog background, neutral-400 text, no interaction

**Touch target:** 44pt minimum; chips smaller than 44pt vertically use invisible padding

**DO:**
- Pre-populate symptom chips based on current cycle phase (Day 22 luteal: bloating, cramps, fatigue, headache, breast tenderness)
- Allow multi-select with no maximum unless there is a genuine clinical reason for a cap
- Use a 2-column or 3-column wrap layout; never force horizontal scroll for chips

**DON'T:**
- Do not use chips for single-select where a radio group would be more semantically correct
- Do not use more than 12 chips in a single group without a "show more" collapse

---

#### Chip — Tag

Non-interactive display tags used to label condition modules, report sections, phase context.

**Dimensions:** Height 24px; padding horizontal 8px; border radius `{radius.sm}`

**Variants by condition context:**
- PMDD: lavender-100 bg `#E3DFF2`, lavender-700 text `#503F7A`
- PCOS: sage-100 bg `#D5E8D4`, sage-700 text `#477044`
- Perimenopause: gold-100 bg `#F8EDCA`, gold-600 text `#8A6D21`
- ADHD: blush-100 bg `#F9E8E5`, blush-700 text `#A0504A`
- Phase tags: use the matching phase background and text tokens from design-tokens.yaml

---

#### Chip — Filter

Used in the Insights screen to filter chart data by condition, time period, or symptom type.

**Dimensions:** Same as Selectable chip

**Variant difference:** Filter chips show a small downward caret (8px) when they control a dropdown; remove caret when no dropdown is attached.

---

### Badge / Tag

**Description:** Small informational labels displayed inline with content or in the top-right corner of cards and icons.

**Dimensions:**
- Dot badge (notification indicator): 8px diameter, no text
- Number badge (count): height 18px, min width 18px, padding horizontal 5px; font 11px / 600
- Label badge (text): height 20px, padding horizontal 6px; font 11px / 500

**Token references:**
- Signal / notification: signal-red bg `#C95555`, white text
- Phase count: uses current phase accent color as background
- Achievement: gold-400 bg `#C9A84C`, white text
- New / unread: sage-400 bg, white text

**States:** Static — badges are not interactive; they convey information only.

**Accessibility:** Screen reader reads badge value as part of the parent element label (e.g., button label "Insights, 3 new insights").

---

### Avatar / Initials

**Description:** User identity representation. HormonaIQ has no social feeds; avatars appear in the You tab and in doctor reports.

**Dimensions:**
- sm: 32px diameter
- md: 40px diameter
- lg: 64px diameter
- Border radius: `{radius.full}` — 9999px

**Token references:**
- Default (no photo): sage-100 bg `#D5E8D4`, sage-700 text `#477044`, initials displayed in 500 weight
- Photo: circular crop, object-fit cover

**Initials logic:** First + last name initials. If only one name, first two characters. If no name, a leaf icon (18px, sage-500).

**Accessibility:** `accessibilityLabel` = user name or "Profile photo".

---

### Divider

**Description:** Horizontal line separating content sections.

**Variants:**
- Standard: 1px solid `{semantic.border.default}` `#EBE8E3`; full width
- Subtle: 1px solid `{semantic.border.subtle}` `#D6D1C9`; used inside cards
- Section: 8px vertical spacing above and below the divider line; no line — spacing only (for visual rhythm without a literal line)
- Label divider: divider with a centered text label (e.g., "This cycle" / "Previous cycle") — label in caption style (11px / 500 / neutral-500), background bg-secondary, padding horizontal 8px

**DON'T:** Do not use a divider between every item in a list. Use list-item-gap spacing instead. Dividers are for major section transitions only.

---

### Icon Specs

**Description:** Iconography standards for HormonaIQ.

**Icon family:** [Phosphor Icons](https://phosphoricons.com/) — Regular weight as default, Bold for emphasis, Duotone for specialty/feature icons. Phosphor is chosen for its warmth relative to Heroicons/Feather and its full coverage of health-adjacent metaphors.

**Sizes:**
- Micro: 12px — for badges and inline contextual indicators
- Small: 16px — for button icons, chip icons, inline text icons
- Medium: 20px — for navigation items, list items
- Large: 24px — for primary navigation, cards, feature entry points
- XL: 32px — for empty states, feature illustrations

**Color:** Icons inherit text color of their context by default. Phase-specific icons use the phase icon_color token. Never use icon colors from outside the design token system.

**Touch target for standalone icons:** 44 × 44pt minimum, regardless of icon size. Use invisible padding.

**DO:**
- Use filled icons for selected/active states; outlined for unselected
- Use the same icon consistently for the same concept across the entire app

**DON'T:**
- Do not mix icon families (no Heroicons next to Phosphor)
- Do not use icons without text labels in bottom navigation
- Do not use decorative icons that don't add information

---

## Section 3 — Layout Components

---

### Card — Standard

**Description:** The primary content container. Used for Today screen sections, list items, and general content groupings.

**Dimensions:**
- Border radius: `{radius.lg}` — 16px
- Padding: `{spacing.card_padding}` — 16px
- Background: `{semantic.background.secondary}` — warm white `#F5F4F1`
- Border: 1px solid `{semantic.border.subtle}` `#D6D1C9`
- Shadow: `{shadow.sm}` — `0 1px 4px rgba(28, 26, 24, 0.08)`

**States:**
- Default: above tokens
- Interactive (tappable): pressed state applies bg darken to `#EBE8E3`, scale 0.99 (50ms instant easing)
- Highlighted / selected: sage-50 bg `#EDF5EC`, sage-400 border
- Phase-tinted: background uses current phase background token (from design-tokens.yaml phase section)

**Anatomy:**
- Optional eyebrow label (caption 11px / 500 / neutral-500, uppercase 0.02em tracking) — above the title
- Title: h3 — 17px / 600
- Optional subtitle: body-small — 13px / 400 / neutral-600
- Content area: flexible, no enforced inner layout
- Optional footer row: right-aligned CTA or metadata

---

### Card — Insight / Ora Card

**Description:** The Ora AI insight card. Visually distinct from standard cards — this is Ora speaking, not the system.

**Dimensions:**
- Border radius: `{radius.xl}` — 24px
- Padding: 20px
- Background: gradient from sage-50 `#EDF5EC` (top-left) to lavender-50 `#F3F1F9` (bottom-right), 145 degrees; linear gradient only (no radial, no noise texture in MVP)
- Border: 1px solid sage-200 `#BBDAB9`
- Shadow: `{shadow.md}`

**Anatomy:**
- Top row: "Ora" label (caption / 500 / sage-600) + small leaf-loop icon (Phosphor `plant` or custom) on the left; dismiss (x) button 44pt touch target on the right
- Insight text: body-large — 17px / 400 — neutral-900; Fraunces typeface for the first sentence only (emotional weight), Inter for the remainder
- Optional action link: ghost link style, sage-600 text, "Talk to your doctor about this" or "See your data"
- Optional data callout: a small inline data chip (number + label, e.g., "40% less effective") in a rounded pill, sage-100 bg, sage-700 text

**States:**
- Default
- Dismissed: slide out to the left, 220ms ease-exit; height collapses to 0 after exit; next content fills the gap
- Long-press: "Pin to My Story" contextual menu appears

**Phase sensitivity:** Ora cards are never shown on days where brain fog mode is auto-active (days 23–26 luteal peak) unless the insight is specifically a safety or crisis context.

---

### Card — Phase Card

**Description:** The "Today's Phase" display card. Appears as the hero element on the Today screen. Communicates phase, cycle day, and hormonal context.

**Dimensions:**
- Full width (screen margin 20px each side)
- Height: 120px (default) / 96px (compact/scrolled)
- Border radius: `{radius.xl}` — 24px
- Background: uses the current phase background token from design-tokens.yaml (e.g., luteal peak = lavender-100 `#E3DFF2`)
- No border
- Shadow: none (background itself provides visual weight)

**Anatomy:**
- Left column (60% width):
  - Phase name: h2 — 20px / 600, uses phase text token
  - Day label: body-small — 13px / 400 — neutral-600 ("Day 22 of your cycle")
  - Phase message: body — 15px / 400 — neutral-700; 2 lines max (truncates gracefully)
- Right column (40% width): Abstract phase illustration or icon (32px XL icon in phase icon_color)
- Transition: when phase changes, card re-renders with a 550ms gentle fade and background color crossfade

---

### Card — Community Card

**Description:** Displays anonymous community pulse data. Used on the Today screen as a supporting element, never as the primary element.

**Dimensions:**
- Compact: 52px height, full width, horizontal layout
- Standard: standard card height, vertical layout

**Anatomy:**
- Compact: "[X] others in [current phase] today." — body / neutral-700; small community icon (phosphor `users-three`) 20px sage-400 on the left
- Standard: phase segment breakdown, anonymous; never shows individual user data

**Privacy rule:** Community cards never display data that could identify an individual. Minimum count displayed: 50 (numbers below 50 show "a group of others" — not a specific count). This prevents de-anonymization in small user cohorts.

---

### Modal / Bottom Sheet

**Description:** Overlays for confirmations, detail views, log flows, and settings panels.

**Variants:**

**Alert Modal (center-screen):**
- Width: screen width minus 40px (20px each side)
- Max width: 360px
- Border radius: `{radius.xl}` — 24px
- Background: `{semantic.background.secondary}`
- Shadow: `{shadow.xl}`
- Overlay: `rgba(28, 26, 24, 0.40)` behind modal (not pure black)
- Anatomy: icon (optional, 40px center), title (h2), body text (body / neutral-600), action row (1–2 buttons, right-aligned for standard; centered for destructive)
- Dismiss: tapping overlay dismisses unless the modal requires a decision

**Bottom Sheet:**
- Slides up from the bottom
- Border radius: `{radius.xl}` top corners only; bottom corners square
- Background: `{semantic.background.secondary}`
- Handle: 4px × 36px pill, neutral-300 `#D6D1C9`, centered at the top with 12px top padding
- Max height: 90% of screen height
- When content exceeds height: internal scroll; handle becomes sticky at top
- Dismiss: swipe down or tap overlay; velocity threshold 400dp/s triggers dismiss regardless of drag distance
- Shadow: `{shadow.xl}` upward (y offset negative)

**States (both variants):**
- Enter: slide up + fade, 220ms ease-enter
- Exit: slide down + fade, 180ms ease-exit
- Background scroll lock: always; body scroll is locked when any modal or sheet is open

**Accessibility:**
- Focus trapped inside modal when open
- First focusable element inside modal receives focus on open
- Close button (x or back) always present and accessible
- `role="dialog"` + `aria-modal="true"` + `aria-labelledby` pointing to title
- Dismiss on Escape key (web/keyboard)
- Screen reader announces: "Dialog: [title]. Swipe to dismiss." on mobile

---

### Navigation Bar (Bottom Nav)

**Description:** The persistent bottom navigation bar. 5 tabs. Always visible; never hidden except in log flow (where full-screen log replaces it).

**Dimensions:**
- Height: 64px
- Background: `{semantic.background.primary}` `#FAFAF9`
- Border top: 1px solid `{semantic.border.subtle}` `#D6D1C9`
- Icon size: 24px
- Label size: 10px / 500
- Icon-to-label gap: 2px
- Tab touch target: 20% of screen width each (for 5 tabs)

**Token references:**
- Active icon: `{semantic.interactive.primary_bg}` sage-400
- Active label: sage-600 `#5F8A5C`
- Inactive icon: neutral-400 `#B8B2AA`
- Inactive label: neutral-500 `#9E9891`

**Tab items:** Today / Cycle / [Log FAB — not a tab] / Insights / You

**The Log FAB:** The center tab position is occupied by the floating action button (56px circular, sage-400, above the nav bar baseline by 8px). It is NOT a nav tab — it triggers the log flow from any screen. It must never be hidden or covered by other content. z-index: `{z_index.raised}` (10) relative to content; the nav bar itself is at `{z_index.sticky}` (200).

**States:**
- Active tab: filled icon (Phosphor Bold weight), label in sage-600, no underline or pill indicator
- Inactive tab: outlined icon (Phosphor Regular weight), neutral-500 label
- Tab press: scale 0.94 on icon for 50ms (instant easing), returns to 1.0 with spring easing 220ms

**Accessibility:**
- `accessibilityRole="tab"` for each item
- Active tab: `accessibilityState={{ selected: true }}`
- Tab bar: `accessibilityRole="tablist"`
- Log FAB: `accessibilityLabel="Log how you're feeling"` — separate from tab bar accessibility tree

---

### Header / Top Bar

**Description:** The top of each screen. Contains back navigation, screen title, and optional trailing actions.

**Dimensions:**
- Height: 56px
- Horizontal padding: 20px
- Background: same as screen background (transparent over content; opaque white on scroll)
- No border at rest; 1px bottom border `{semantic.border.subtle}` on scroll (sticky header mode)

**Anatomy:**
- Leading: back arrow (Phosphor `arrow-left`, 24px, neutral-700) for sub-screens; nothing for root tabs
- Center: screen title (h3 — 17px / 600 / neutral-900) OR app wordmark on Today tab
- Trailing: up to 2 icon actions (24px each, 44pt touch target, neutral-600)

**Variants:**
- Root tab header: no back button; title is the tab name or the Today greeting (which is not a traditional header — it uses Display type and phase color)
- Sub-screen header: back button + title + optional trailing action (e.g., "Share" on report screens)
- Transparent: used over hero cards on Today; text color inverts based on phase background

---

### Section Header

**Description:** Labels a content section within a scrollable screen. Used to separate log categories, insights categories, settings groups.

**Dimensions:**
- Font: caption — 11px / 500 / uppercase / 0.02em tracking
- Color: `{text.tertiary}` neutral-500 `#9E9891`
- Top margin: 24px (section_gap)
- Bottom margin: 8px

**Variants:**
- Standard: text only
- With action: text + right-aligned ghost text link (e.g., "See all" in body-small / sage-600)

**DO:** Use section headers to organize a long scrollable screen into clear categories.

**DON'T:** Do not use section headers for every card — only when there are 3+ items in a distinct group.

---

### Empty State

**Description:** What users see when a section has no data yet.

**Dimensions:**
- Container: vertically centered, full screen height minus nav bars
- Icon: 48px Phosphor Duotone icon, sage-400 / sage-100 duotone fill
- Title: h2 — 20px / 600 / neutral-700
- Body: body — 15px / 400 / neutral-500, 2–3 lines max
- CTA: optional Primary button

**Copy standard (from brand-and-ux.md):**
- No "No data yet!" or "Nothing here!"
- Use: "Your first [X] will show up here." or "It takes about [X] to see [Y]."
- No pressure framing; no urgency

**Examples by context:**
- Insights, new user: "[Cycle icon] Your first cycle of data will appear here. Keep logging — patterns take about 4 weeks to emerge."
- Ora, early user: "[Leaf icon] Ora is still learning your patterns. Check back after your next cycle."
- Lab Vault, PCOS user: "[Flask icon] Nothing here yet. Add your first lab result and we'll keep track of trends over time."

---

### Loading State

**Description:** Communicates that content is loading or an action is in progress.

**Variants:**

**Inline spinner:** 20px circular spinner in sage-400 (stroke weight 2px); used inside buttons and as inline indicators.

**Skeleton screen:** Used for cards and the Insights dashboard. Gray placeholder shapes matching the approximate layout of the real content. Skeleton bg: `{primitive.neutral.200}` `#EBE8E3` with a subtle shimmer animation (pulse: opacity 0.5 → 1.0 → 0.5, 1400ms infinite, ease-in-out).

**Full screen loader:** For app startup and initial data sync only. Centered sage logo mark (40px) with a subtle fade pulse. Copy: "Getting your data ready." — no percentage, no indefinite "loading..." text.

**DO:** Show skeleton screens rather than spinners for content that takes > 300ms to load (reduces perceived load time).

**DON'T:** Do not show a loading state for actions that complete in < 200ms; it creates unnecessary visual noise.

---

## Section 4 — Data Visualization Components

These are the intelligence layer made visible. Every chart must pass the accessibility test (accessible without color) and the brain fog test (interpretable without effort).

---

### Cycle Ring

**Description:** The primary calendar visualization. A ring segmented by cycle phase, with logged days represented as dots around the outer circumference. The primary chart on the Cycle tab.

**Dimensions:**
- Outer diameter: screen width minus 40px (standard) or 240px (compact, for Today screen)
- Ring width: 24px
- Center space: available for: current phase label (h2), cycle day count (display), or a progress percentage

**Structure:**
- Ring segments: one segment per cycle phase, proportional to phase length, using phase background token as fill color
- Phase boundary: 1px arc separator in neutral-200
- Logged days: dots (6px diameter) on the outer edge of the ring, one per calendar day; dot fill opacity indicates log completeness (full log = solid sage-500; partial = sage-300; no log = neutral-200 empty dot)
- Current day: a slightly larger dot (8px) with a subtle pulse animation (scale 1.0 → 1.1 → 1.0, 2000ms infinite, ease-in-out); indicator line from ring center to current day dot (1px, sage-400, 50% opacity)
- Symptom intensity overlay (optional): colored halo around logged-day dots, radius proportional to symptom severity (higher severity = larger halo in the day's phase color at 30% opacity)

**States:**
- Default: current cycle displayed
- Tapped day: day detail tooltip (Card — Standard component, appears as a floating bottom sheet with that day's log summary)
- Empty cycle: ring shows phase segment outlines only (dashed borders instead of fills); prompt to start logging
- Irregular cycle: ring adapts segment proportions to estimated phase lengths; anovulatory cycles shown with a distinct segment pattern (diagonal line fill)

**Accessibility:**
- Ring has a companion accessible view: a linear list of cycle days with date, phase, and logged symptoms as text; togglable with a "List view" button below the ring
- Ring described to screen readers as: "Cycle ring. Day [X] of your current cycle. Current phase: [phase name]. [X] days logged this cycle."

**Animation:** Phase transitions animate the ring segments recoloring with a 550ms gentle fade. Do not animate individual dot placements as they appear — batch render.

---

### Severity Line Chart

**Description:** A line chart plotting symptom or score severity over cycle days. Used in Insights for DRSP scores, executive function trends, and mood patterns.

**Dimensions:**
- Chart area: screen width minus 40px horizontal × 180px height (standard); 120px (compact card variant)
- x-axis: cycle days (1 to cycle length); tick marks every 5 days; axis labels: day numbers, caption style
- y-axis: severity scale (1–5 or 1–6 depending on instrument); labels at each integer
- Horizontal phase bands: subtle background fills using phase background tokens across the chart area, dividing the x-axis into phase zones (allows instant visual correlation of symptom spikes to phases)

**Line styles:**
- Current cycle: sage-500 line, 2px stroke, with filled dots at each logged data point (6px diameter)
- Previous cycle (comparison): neutral-400 dashed line, 1.5px stroke, no dots
- Predicted values: lavender-300 dotted line, 1px stroke
- ADHD medication effectiveness (overlay): blush-400 line, 2px stroke (for when medication and symptom lines appear on same chart)

**States:**
- Default: current cycle only
- With comparison: current + previous overlaid
- Tapped data point: vertical cursor line (1px neutral-300) + tooltip card (Card — Standard, compact variant) showing: date, phase, logged value, and any relevant context
- Empty: skeleton line with empty state copy inside chart area

**DO:** Label the line legend always. Color alone is never the only encoding. Use line weight + dash pattern to differentiate lines.

**Accessibility:** A data table view accessible to screen readers contains the underlying data. The chart SVG/canvas layer is marked `aria-hidden="true"`; the table below it is the accessible representation.

---

### Phase Bar

**Description:** A horizontal phase timeline indicator. Used as a header element above charts and as a standalone orientation tool on the Cycle and Insights screens.

**Dimensions:**
- Height: 20px
- Width: full content width (screen minus 40px)
- Border radius: `{radius.full}` — pill ends
- No gap between phases — continuous bar

**Structure:**
- Segments: proportional phase fills using phase background tokens; phase name label (caption 11px / 500) inside each segment if wide enough (minimum 48px to show label); otherwise no label in segment
- Current position indicator: a 12px wide × 20px tall darker-tinted notch on the top edge of the bar in the current day's phase segment position; no animation
- Optional cycle day labels below the bar: cycle day numbers at phase start points

**Used with:** Always appears directly above or directly below a Severity Line Chart or Cycle Ring.

**Accessibility:** Phase bar described to screen reader as: "Phase timeline: [list of phases with day ranges]. Current: [phase name], day [X]."

---

### Streak / Consistency Display

**Description:** Shows logging consistency and streaks without gamification framing. Used on the You tab and in the Today screen below the hero card.

**Dimensions:**
- Display: 7-day dot grid (7 dots × 7px each, 6px gap) showing the last 7 days
- Current streak count: display type (32px / 600 / Fraunces) for the number; caption label below
- Monthly grid: optional; 5 rows of 7 dots representing the last 5 weeks

**Dot states:**
- Logged full: sage-500 solid dot
- Logged partial (only mood, not full): sage-200 dot
- Not logged: neutral-200 empty dot
- Today (not yet logged): neutral-400 outlined dot
- Today (logged): sage-500 dot with subtle green border highlight

**Tone rules:**
- During luteal peak: streak count is hidden (de-emphasized); only the 7-day dot grid remains visible; no copy about streaks
- In follicular/ovulation: streak count displayed with earned language ("X days of data — that's real")
- Never: "Don't break your streak!" language. The only streak copy is neutral, e.g., "X days logged."

---

### Lab Value Trend Chart

**Description:** A single-biomarker line chart showing a lab value over time (not over cycle days — over calendar time). Used in the Lab Value Vault.

**Dimensions:**
- Chart area: screen width minus 40px × 140px
- x-axis: calendar dates of lab entries (sparse, irregular intervals)
- y-axis: biomarker value in appropriate units; reference range marked as a horizontal band

**Reference range band:**
- Normal range: sage-50 horizontal band `#EDF5EC` filling the normal value range on the y-axis
- Out-of-range values: data point dot in signal-amber `#C98B3A` (not red — this is informational, not emergency)
- In-range values: data point dot in sage-500

**States:**
- Single data point (no trend): dot with a helper text below: "Add more results to see your trend."
- Trend: line connecting dots; line color inherits the dot color of the most recent point
- Tapped data point: tooltip showing: date, value, unit, distance from reference range in plain language ("2.1 above the upper reference limit")

---

### Comparison View (This Cycle vs. Last Cycle)

**Description:** A side-by-side or overlay comparison of the current cycle's symptom data against the previous cycle. Used in the Insights screen.

**Variants:**

**Overlay:** Two lines on the same Severity Line Chart (current = solid sage, previous = dashed neutral). Phase band background provides the phase context for both cycles simultaneously.

**Side-by-side cards:** Two Phase Cards placed horizontally (50% width each); current left, previous right; each shows a mini Severity Line Chart (compact variant 120px height). Useful for at-a-glance comparison when the cycles are very similar or very different.

**Headline stat block:** Above either comparison variant, a 2–3 stat summary:
- "Worst day: Day [X] this cycle → Day [Y] last cycle"
- "Average DRSP score: [X] this cycle → [Y] last cycle (↓ [Z]% improvement)"
- Stat style: large number (h1 24px / 600) + label (caption 11px / 500 / neutral-500)

**Color encoding for delta:** improvement = sage-500, worsening = signal-amber; no color for neutral change. Always pair color with an arrow symbol (↓ ↑ →) so color is never the only encoding.

---

## Section 5 — Specialty Components

---

### Mood Icon Set

5 behavioral mood states. These are not emoji and not generic emotion faces. They represent the specific experiential states of a woman managing a hormonal condition. Each icon is a distinct vector illustration (28px display size, 52px touch target, outlined in resting state, filled sage-400 bg in selected state).

---

**State 1: Steady**
Behavioral description: Present, functional, not good or bad — just here. The neutral default. Not forced contentment.
Visual direction: A simple horizontal ellipse, slightly irregular (hand-drawn feel). Conveys stability without performance. Not a smile.
VoiceOver label: "Steady — present and functional"
Color when selected: sage-200 bg tint, sage-600 outline

**State 2: Depleted**
Behavioral description: Running on empty. Low energy, low motivation. Not in crisis — just deeply tired. The most common luteal peak mood.
Visual direction: A downward sloping soft curve or a half-moon shape oriented downward. Conveys deflation, not despair.
VoiceOver label: "Depleted — low energy, running on empty"
Color when selected: lavender-200 bg tint, lavender-600 outline

**State 3: Activated**
Behavioral description: Irritable, reactive, or anxious. Things feel louder than they should. Edges are sharp. This is distinct from angry — it is the wired, sensitized state.
Visual direction: A jagged or spiked horizontal line. Conveys heightened reactivity. Not aggressive — alert and edgy.
VoiceOver label: "Activated — irritable, reactive, or anxious"
Color when selected: gold-200 bg tint, gold-600 outline

**State 4: Heavy**
Behavioral description: Weighed down by sadness, despair, or emotional overwhelm. Crying is possible. The world feels thick. This is the PMDD mood state that users most need to be seen in.
Visual direction: A teardrop or downward drop shape. Not a tear — a weight. Something pulling downward by gravity.
VoiceOver label: "Heavy — weighed down, sad, or overwhelmed"
Color when selected: blush-200 bg tint, blush-600 outline

**State 5: Clear**
Behavioral description: Sharp, light, energized. Good focus, good mood, good body. Not euphoric — just clear. Follicular and ovulation window.
Visual direction: An open upward curve or arc — like sunrise, or a clearing. Light, open, upward energy without excess.
VoiceOver label: "Clear — sharp, energized, and light"
Color when selected: sage-100 bg tint, sage-500 outline

---

**Mood icon grid layout:** 5 icons displayed in a single row, equally spaced (flex row, justify-space-evenly). Touch target 64 × 64pt per icon (tap area is larger than the 52px visible element — use invisible padding). No text labels below icons on mobile (labels accessible via VoiceOver only) — this reduces cognitive load in the log flow. Labels appear on long-press for new users only (first 7 days).

---

### Phase Indicator Card

**Description:** The compact version of the Phase Card, used in non-Today contexts (e.g., top of the Log screen, inside the Insights header).

**Dimensions:**
- Height: 56px
- Width: full content width
- Border radius: `{radius.lg}` — 16px
- Background: phase background token (current phase)
- Padding: 12px horizontal, 10px vertical

**Anatomy:**
- Left: phase color dot (10px, phase accent token) + phase name (h3 — 17px / 600, phase text token) + " · Day [X]" (body-small / neutral-600)
- Right: small caret icon or cycle ring thumbnail (32px) if space allows

**States:**
- Default: phase-colored
- Interactive: tapping navigates to the Cycle tab
- Loading: skeleton height 56px

---

### Ora Card

**Description:** The AI insight card. Precision spec — this is the most important specialty component in the product.

**Dimensions:**
- Border radius: `{radius.xl}` — 24px
- Padding: top 20px, sides 20px, bottom 16px
- Background: linear gradient 145° from sage-50 `#EDF5EC` 0% to lavender-50 `#F3F1F9` 100%
- Border: 1px solid sage-200 `#BBDAB9`
- Shadow: `{shadow.md}`
- Maximum width: full content width (screen minus 40px)
- Minimum height: 88px; grows to content

**Anatomy (top to bottom):**

Row 1 — Header:
- Left: Ora icon (16px — custom leaf-loop mark, sage-600 fill) + "Ora" label (caption / 500 / sage-600 / 0.04em tracking / uppercase)
- Right: Dismiss button (x icon, Phosphor `x`, 16px, neutral-400; touch target 44 × 44pt via padding expansion)

Gap: 10px

Row 2 — Insight text:
- First sentence: Fraunces, 17px, 400 weight, line-height 1.5, neutral-900 — the emotional hook
- Remaining body: Inter, 15px, 400, line-height 1.6, neutral-700 — the supporting detail
- Maximum 4 sentences total; Ora insights are never long-form

Gap: 10px (conditional — only if data callout or action link present)

Row 3 — Data callout (optional):
- Pill chip: rounded-full, sage-100 bg `#D5E8D4`, sage-700 text, 13px / 600
- Content: the specific number or comparison ("40% lower in late luteal")
- Appears inline in the text where the data point is most relevant; not below the text

Gap: 8px (conditional — only if action link present)

Row 4 — Action link (optional):
- Ghost style: 13px / 500, sage-600, underline on hover; arrow-right icon (12px) trailing
- Content: "Talk to your doctor about this" or "See your full data" (specific, not generic "Learn more")

**Insight tone rules (enforced in content before it ships):**
- First sentence must start from the user's experience, not a statistic ("Your brain fog..." not "Research shows...")
- No exclamation points
- No "you should..." language
- Every clinical claim must end with "worth discussing with your doctor"
- Insights that contain numbers must show the actual numbers from the user's data, not generic benchmarks

**Dismissal behavior:**
- Tap x: card slides left 100%, opacity 0, height collapses, next content flows up; 220ms ease-exit
- Do not re-show on the same day
- After 7 days: if insight is still relevant (pattern persists), a new Ora card can be generated with updated data

**Brain fog mode:** Ora card is hidden during auto-detected brain fog days (days 23–26 luteal peak). Only emergency/safety Ora cards override this.

---

### Crisis Safety Card

3-tier design. Full spec.

---

**Tier 1 — Contextual Acknowledgment (inline, Today screen)**

Visibility: During detected luteal peak phase (all users); or during detected menstruation with high DRSP scores.

Component: A single line of text added below the Phase Card on the Today screen. Not a card. Not a button. Just text with a tap target.

Anatomy: "[Soft dot indicator, 8px, lavender-400] Some days in this phase can feel really dark. If that's where you are, [tap here]."

- "tap here" is a ghost text link (sage-600)
- Full line is 44px tap target
- No border, no background, no card — pure inline text with the dot
- Color: neutral-700 text, lavender-400 dot

z-index: standard content layer — this is not elevated or alarming

---

**Tier 2 — Support Resources Modal (user-initiated)**

Triggered by: Tapping Tier 1 link, or tapping "I need support" in the You > Help section.

Component: Full-screen bottom sheet, slides up.

Anatomy:
- Handle at top (standard bottom sheet handle)
- Spacer: 24px
- Acknowledgment block:
  - Icon: Phosphor `heart` duotone, 40px, blush-400 fill / blush-100 background, centered
  - Spacer: 16px
  - Title: h2 — "This phase is genuinely hard." — Fraunces typeface
  - Body: "What you're feeling is real. You're not being dramatic. Here are some things that might help right now." — Inter / body / neutral-600
- Spacer: 24px
- Resources list (3 items):
  - Item 1: "Talk to someone right now" — Crisis Text Line, text HOME to 741741 — primary button style (sage)
  - Item 2: "PMDD community support" — IAPMD resources link — secondary button style
  - Item 3: "[Country]-specific emergency services" — ghost button — country-detected
- Spacer: 16px
- Optional low-friction action: "Would you like to simplify the app for today?" — toggle; activates brain fog mode
- Spacer: 24px
- Dismiss: ghost "Close" button, centered

z-index: `{z_index.modal}` — 400

---

**Tier 3 — Automatic Escalation Card (severity-triggered)**

Triggered by: DRSP item 1 (depressed mood / hopelessness) scoring 6 for 3 consecutive days.

Component: Full-screen modal (center modal, not bottom sheet — this requires deliberate acknowledgment).

Anatomy:
- Background: blush-50 `#FDF6F5` overlay over the modal (warm, not alarming)
- Ora icon: 40px — but with blush-400 fill (not sage) to signal this is a different kind of Ora message
- Title: h1 (Fraunces) — "We noticed the last few days have been really hard."
- Body: "Your logs show this has been a difficult stretch. You don't have to manage this alone. Here's what might help right now."
- Same resources list as Tier 2
- Additional item: "Tell a safe person how you're feeling" with a native share sheet option to send a message to a contact of the user's choice (they compose it; we don't)
- Acknowledgment button (Primary, sage): "I've seen this" — this is the only dismiss action; cannot be dismissed by tapping outside

z-index: `{z_index.crisis}` — 9999 — always on top of everything

**Critical rules for all 3 tiers:**
- Never sends a notification. All crisis UI is in-app only.
- Never logs the crisis interaction as a data event visible anywhere except in aggregate anonymized safety reporting.
- Never automatically contacts anyone on the user's behalf.
- All copy reviewed by a licensed clinical psychologist before shipping.
- Does not appear during a log session if the user is mid-log — waits until the log session completes.

---

### Log Quick Entry

**Description:** The 5-step 30-second log flow. Full interaction spec.

**Container:** Full-screen overlay that replaces the current screen. Opens from the FAB. Does not use a bottom sheet — it is a full-screen immersive experience.

**Header:**
- Back / close button (top left, 44pt): exits log without saving; shows a "Discard log?" confirmation if any step has been completed
- Progress indicator: 5 dots (6px each, 4px gap) at the top center; active dot = sage-400 filled, inactive = neutral-200 outlined
- No step numbers, no percentage — just the dots

**Step 1 — Mood:**
- Prompt: "How are you feeling right now?" — h2, centered, Fraunces
- Mood icon grid (Section 5 spec)
- Selected icon: scale 1.08, colored bg tint, spring easing 120ms
- Auto-advances to Step 2 after selection (200ms delay for visual confirmation)
- User can return to this step via back arrow

**Step 2 — Physical:**
- Prompt: "Anything physical today?" — h2, centered, Fraunces
- Phase-contextual chip grid (see Chip — Selectable)
- "None of these" ghost button (bottom, centered, 44pt)
- Continue button (Primary, lg) — "Continue" — visible below chip grid
- Chips do not auto-advance; user reviews selection then taps Continue

**Step 3 — Cognitive:**
- Prompt: "How's your head today?" — h2, centered, Fraunces
- Single slider component (1–5 scale); endpoint labels: "Clear" (1) and "Foggy" (5)
- Helper line below slider: current value description ("2 — Mostly clear, minor fog")
- Continue button (Primary, lg) — auto-activates once slider is moved from default position
- If ADHD module is active: Step 3 expands to show the 5 ADHD dimensions below the brain fog slider (each as a secondary slider, smaller); the step splits into a 2-section view with "Basic" and "ADHD Detail" tabs for users who want the short version

**Step 4 — Voice (Optional):**
- Prompt: "Want to say more?" — h3, centered, Inter
- Sub-prompt: "Optional — this goes to your private notes only." — caption / neutral-500
- Large microphone button (64px, sage-400, circular, centered): tap to record; recording max 60 seconds
- Recording state: pulsing red dot (8px, signal-red), waveform animation, elapsed time counter
- Skip button (Ghost, lg): "Skip for now" — always visible and prominent; this step must never feel like an obligation
- If voice is recorded: playback controls appear; user can re-record

**Step 5 — Confirmation:**
- No prompt — just a response
- The response text fills the screen center; Fraunces display type; text is phase-aware:
  - Luteal peak: "Logged. We've got this week noted. Rest is not failing."
  - Follicular: "Logged. Your data is building. Good window."
  - Menstruation: "Logged. You made it through another hard stretch."
  - Generic fallback: "Logged. Your data is yours."
- Below: a compact summary of what was just logged (mood icon + chips as horizontal row, brain fog score as a small number chip)
- Dismiss button: "Done" (Primary, lg) — returns user to wherever they opened the log from
- 3-second auto-dismiss if no interaction (the done button should feel light, not like a gate)

**Back navigation:** Each step has a back arrow that returns to the previous step without losing data. Step 1 back arrow shows the discard confirmation.

**Accessibility:** The log flow is the highest-priority accessibility surface in the app. Every step must be fully operable via VoiceOver, switch control, and voice control. No step requires visual-only interaction.

---

### Doctor Brief Card

**Description:** The preview card shown before a physician report is generated or exported. Used in Insights > Reports section.

**Dimensions:**
- Full width card
- Border radius: `{radius.xl}` — 24px
- Background: warm white `#F5F4F1`
- Border: 1px solid mist `#EBE8E3`
- Shadow: `{shadow.md}`
- Padding: 20px

**Anatomy:**
- Top row: document icon (Phosphor `file-text`, 24px, sage-500) + report type label (h3 / sage-700) + date range (caption / neutral-500)
- Divider (subtle)
- Data readiness row: a small grid showing required data fields and whether they have sufficient data to include (checkmark = sage-500, warning = amber, missing = neutral-400)
  - Example items: "DRSP Scores (2 cycles) ✓", "Remission Window Data ✓", "Physical Symptoms (partial) △"
- Generate button (Primary, lg): "Generate Report" — only active when minimum data requirements are met
- If data is insufficient: a soft inline note ("You need 3 more weeks of data for a complete PMDD report.") replaces the generate button
- Legal disclaimer line: caption / neutral-500 — "This report is for discussion with your healthcare provider. It is not a diagnosis."

---

### Onboarding Step Card

**Description:** The full-screen card used during the 4-step onboarding flow.

**Dimensions:**
- Full screen minus safe areas
- No card border or shadow — the card IS the screen
- Background: cloud white `#FAFAF9` (screen 1), then warm white `#F5F4F1` (screens 2–4)
- Padding: 40px top, 20px horizontal, 24px bottom safe-area

**Anatomy:**
- Progress dots: 4 dots at top center (same spec as Log flow progress dots)
- Optional illustration / icon: 80px centered, below progress dots
- Title: Display type (32px / 600 / Fraunces), centered, top-of-content-area
- Body: body-large (17px / 400 / neutral-700), centered, max-width 300px
- Content area (custom per step — see features.md Feature 5 for screen content)
- CTA area (bottom, above safe area):
  - Primary button (lg, full width): the advance action
  - Optional ghost text below: "Back" or a skip link if applicable

**Transitions between steps:** Horizontal slide (new card slides in from right, current card exits to left); 220ms ease-default; no bouncing. No vertical transitions in onboarding — this is a linear left-to-right flow.

---

## Section 6 — Motion and Animation Spec

HormonaIQ is an intentionally calm app. Animation does not celebrate itself. It communicates state change and guides attention without demanding it.

---

### Core Principles

**1. Calm, not bouncy — except for one exception.**
The app uses 3 easing curves: ease-default (standard), ease-enter, and ease-exit. The spring easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`) is reserved exclusively for micro-interactions that celebrate user input: mood icon selection, chip selection, and streak achievement display. Spring easing is never used for screen transitions, modals, or data display.

**2. During luteal peak: all motion slows or stops.**
When brain fog mode is active (auto or manual), animation durations increase by 40% and the spring easing is replaced with ease-default. This is a configurable token override, not a hardcoded exception.

**3. Respect OS reduce motion settings.**
If the user has enabled "Reduce Motion" in their OS accessibility settings, all animations are replaced with simple opacity transitions (cross-fades) at the default duration (220ms). No exceptions. No "the cycle ring needs to animate" overrides.

**4. Never animate content that is already visible.**
Animations communicate: content entering, content exiting, and state changing. Content that is already rendered and stable does not animate. The phase bar does not wiggle. Logged dots do not pulse. Only the current-day indicator has a persistent animation (gentle 2s pulse), and this is disabled in reduce-motion mode.

**5. No loading skeletons that animate faster than 1400ms.**
Shimmer animations on skeleton screens run at 1400ms per cycle minimum. Faster shimmer causes visual noise that is disorienting for the target demographic.

---

### Duration Reference

| Use | Token | Duration | Easing |
|-----|-------|----------|--------|
| Touch feedback (press) | instant | 50ms | ease-default |
| State change (toggle, chip select) | fast | 120ms | spring (or ease-default in reduced motion) |
| Component enter / exit | default | 220ms | ease-enter / ease-exit |
| Screen transition (push/pop) | default | 220ms | ease-default |
| Modal / sheet enter | default | 220ms | ease-enter |
| Modal / sheet exit | fast | 180ms | ease-exit (exits should be slightly faster) |
| Phase transition (card recolor) | gentle | 550ms | ease-default |
| Ora card enter | slow | 380ms | ease-enter |
| Cycle ring phase recolor | gentle | 550ms | ease-default |
| Skeleton shimmer cycle | — | 1400ms | ease-in-out, infinite |
| Current day pulse | — | 2000ms | ease-in-out, infinite |
| Brain fog mode: all durations | +40% | × 1.4 | replace spring with ease-default |

---

### Component-Specific Animation Notes

**Bottom Sheet enter:** Translates from bottom (Y: +100% → Y: 0) + opacity (0 → 1), 220ms ease-enter. The overlay backdrop fades in separately at 150ms ease-default.

**Bottom Sheet exit:** Translates to bottom (Y: 0 → Y: +100%) + opacity (1 → 0), 180ms ease-exit. Slightly faster than entry — exits should not linger.

**Modal enter:** Scale (0.96 → 1.0) + opacity (0 → 1), 220ms ease-enter. Center screen modal feels like it materializes, not slides.

**Log flow step transitions:** Horizontal slide. Step entering from right: translateX(100% → 0), 220ms ease-default. Step exiting to left: translateX(0 → -100%), 220ms ease-default. Steps should appear to be spatially left-to-right.

**Mood icon selection:** Selected icon scales 1.0 → 1.08, 120ms spring. Background fill fades in 80ms ease-default simultaneously. Previously selected icon scales 1.08 → 1.0, 80ms ease-default.

**Chip selection:** Selected chip scales 1.0 → 1.02, 120ms spring; background transitions from neutral to sage-400, 80ms ease-default. Deselect is the reverse at 80ms.

**Ora card entry:** Opacity 0 → 1, translateY(12px → 0), 380ms ease-enter. This is the slowest standard animation — Ora cards should feel like they are arriving thoughtfully, not popping in.

**Ora card dismissal:** TranslateX(0 → -100%), opacity (1 → 0), 220ms ease-exit; then height collapses to 0 + margin collapses to 0, 180ms ease-exit. Content below flows up after both animations complete.

**Phase transition (Today screen recolor):** When a new phase begins, the Phase Card background cross-fades from old phase color to new phase color, 550ms ease-default. The phase message text fades out (120ms) and fades in with new content (220ms delay after crossfade begins). This is the single most emotionally significant animation in the app — it must feel like a gentle season change, not a digital refresh.

**Empty state:** Content fades in 220ms ease-enter once the empty state check completes. No bounce, no scale — just a simple fade.

**Streak achievement (earned celebration only):** A single confetti-like particle burst (10–12 particles, 40px spread radius, 500ms, ease-exit on each particle, then fade). This animation is gold-400 and sage-400 particles only. It plays once, is not repeatable by tapping, and is not shown during luteal peak phase regardless of the achievement trigger.

---

*HormonaIQ UI Component Specification v1.0 | April 2026*
*Token references: docs/04-design/design-tokens.yaml*
*Accessibility standard: WCAG 2.1 AA + iOS HIG + Android Material 3 Accessibility*
