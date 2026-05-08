// Morning Garden design tokens — single source of truth for all visual decisions.
// Mirrors DESIGN.md and HormonaIQ.html CSS variables.

import { useColorScheme } from 'react-native';

export const colors = {
  // Brand greens
  eucalyptus: '#3F6F5A',
  eucalyptusDeep: '#2C5443',
  eucalyptusSoft: '#5C8A75',
  sage: '#9CB89A',
  sageLight: '#C7D9C5',
  mintMist: '#DCEBDD',
  mintPale: '#ECF4EC',

  // Warm neutrals
  ink: '#1B2E25',
  ink2: '#4A5C53',
  ink3: '#7A8B82',
  inkDisabled: '#B5C0BA',
  paper: '#FFFFFF',
  cream: '#FAFBF6',
  creamWarm: '#F4F0E5',

  // Accents
  butter: '#F5E4B8',
  butterDeep: '#E8C97A',
  coral: '#E89F86',
  coralSoft: '#F5C8B5',
  rose: '#D88A95',
  lavender: '#5C4A7A',
  danger: '#B95446',

  // Severity scale
  severityMild: '#5C8A75',
  severityMod: '#E8C97A',
  severitySevere: '#C97962',

  // Neutral dark — use where a neutral (non-green) dark is needed on coloured surfaces
  charcoal: 'rgba(0,0,0,0.78)',

  // Overlay tokens — semi-transparent surfaces for modals, badges, and captions
  overlayDark: 'rgba(0,0,0,0.7)',
  overlayLight: 'rgba(255,255,255,0.8)',
  overlayModal: 'rgba(27, 46, 37, 0.45)',
  inkMuted: 'rgba(0,0,0,0.55)',

  // Surface tokens (semantic, not brand)
  border: 'rgba(60, 95, 75, 0.14)',
  borderStrong: 'rgba(60, 95, 75, 0.28)',
  borderSubtle: 'rgba(63, 111, 90, 0.12)',
  tabbarBorder: 'rgba(156, 184, 154, 0.42)',

  // Panel background tints — phase-tinted group panels in the Tools screen
  panelSage: '#EEF4EE',
  panelBlush: '#FAF0EE',
  panelButter: '#FBF6E9',

  /** cardMint border — green tint at 10% opacity */
  borderMint: 'rgba(63, 111, 90, 0.1)',
  /** Cream (#FAFBF6) at 85% opacity — used for topbar backdrop */
  creamAlpha: 'rgba(250, 251, 246, 0.85)',
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
  card: 12,
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

// Box-shadow ports — match CSS rgba(43, 78, 60, X) values from HormonaIQ.html.
// Using React Native shadow* + elevation. Web (react-native-web) reads boxShadow.
export const shadows = {
  sm: {
    shadowColor: '#2B4E3C',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: '#2B4E3C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
  lg: {
    shadowColor: '#2B4E3C',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 40,
    elevation: 12,
  },
} as const;

// Font family identifiers — must match the loaded keys in app/_layout.tsx.
export const fonts = {
  display: 'InstrumentSerif_400Regular',
  displayItalic: 'InstrumentSerif_400Regular_Italic',
  sans: 'Inter_400Regular',
  sansMedium: 'Inter_500Medium',
  sansSemibold: 'Inter_600SemiBold',
  sansBold: 'Inter_700Bold',
  mono: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_500Medium',
} as const;

export const darkColors = {
  // Backgrounds
  cream: '#141918',
  creamWarm: '#1A1F1C',
  creamAlpha: 'rgba(20, 25, 24, 0.95)',
  paper: '#1E2422',
  paperOverlay: 'rgba(30, 36, 34, 0.92)',

  // Ink (text)
  ink: '#EEF2EE',
  ink2: '#B8C4B8',
  ink3: '#7A8E7A',
  inkDisabled: '#3A4A3A',

  // Brand — eucalyptus family (keep relatively similar, slight desaturation)
  eucalyptus: '#4A9E6A',
  eucalyptusDeep: '#3A8A5A',
  eucalyptusSoft: '#2A5A3A',
  eucalyptusLight: '#1E3A28',

  // Accent palette (desaturated for dark mode)
  mintMist: '#1A2E22',
  mintPale: '#162018',
  sageLight: '#1E2E20',
  butter: '#2E2A18',
  butterDeep: '#3A3210',
  coralSoft: '#2E1A1A',
  coral: '#C05050',
  rose: '#8A3040',
  lavender: '#9090C0',

  // Borders
  border: '#2A3A2A',
  borderMint: '#1E3028',
  tabbarBorder: '#2A3A2A',

  // Shadows (dark mode shadows are subtle)
  shadowColor: '#000000',
} as const;

export function useThemeColors() {
  const scheme = useColorScheme();
  return scheme === 'dark' ? darkColors : colors;
}

// Phase-aware ring interior fills — warmer/more saturated than phase[] for filled areas
export const phaseFill = {
  follicular: 'rgba(156, 184, 154, 0.32)',  // sage @ 32%
  ovulatory:  'rgba(245, 228, 184, 0.50)',  // butter @ 50%
  luteal:     'rgba(232, 159, 134, 0.38)',  // coral @ 38%
  menstrual:  'rgba(216, 138, 149, 0.32)',  // rose @ 32%
} as const;

// Ora identity mark — visual presence tokens
export const oraTokens = {
  breatheMin: 0.78,
  breatheMax: 1.0,
  breatheDuration: 4200,   // ms — slow deliberate breathing pace
  scaleMin: 0.97,
  scaleMax: 1.0,
} as const;

// Canonical animation durations — use everywhere instead of ad-hoc ms values
export const duration = {
  micro: 150,      // tap press feedback, toggle flick
  standard: 250,   // navigation, screen transitions (iOS HIG compliant)
  reveal: 350,     // data reveals, phase info appearing
  ceremonial: 420, // milestones, Ora first appearance, save confirmation
  accessible: 80,  // Reduce Motion mode — near-instant
} as const;

// Botanical geometry illustration colors (for SVG illustration components)
export const botanical = {
  primary:   colors.eucalyptus,   // '#3F6F5A'
  secondary: colors.sage,          // '#9CB89A'
  warm:      colors.coral,         // '#E89F86'
  light:     colors.mintMist,      // '#DCEBDD'
  ground:    colors.creamWarm,     // '#F4F0E5'
  accent:    colors.butterDeep,    // '#E8C97A'
} as const;

export type ColorToken = keyof typeof colors;
export type PhaseToken = keyof typeof phase;
export type RadiusToken = keyof typeof radius;
export type SpacingToken = keyof typeof spacing;
export type FontToken = keyof typeof fonts;
