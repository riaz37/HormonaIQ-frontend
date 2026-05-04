// Morning Garden design tokens — single source of truth for all visual decisions.
// Mirrors DESIGN.md and HormonaIQ.html CSS variables.

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

  // Surface tokens (semantic, not brand)
  border: 'rgba(60, 95, 75, 0.14)',
  borderStrong: 'rgba(60, 95, 75, 0.28)',
  tabbarBorder: 'rgba(156, 184, 154, 0.42)',
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

export type ColorToken = keyof typeof colors;
export type PhaseToken = keyof typeof phase;
export type RadiusToken = keyof typeof radius;
export type SpacingToken = keyof typeof spacing;
export type FontToken = keyof typeof fonts;
