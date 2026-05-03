// CSS class -> React Native StyleSheet translations.
// Values lifted from HormonaIQ.html (lines 195-500). Gradients are applied at the
// component level via expo-linear-gradient (RN StyleSheet has no gradient support).

import { StyleSheet } from 'react-native';
import { colors, fonts, radius, shadows, spacing } from './tokens';

// Typography — DESIGN.md type scale + .h1/.h2/.h3 from HormonaIQ.html lines 196-208.
export const typography = StyleSheet.create({
  display: {
    fontFamily: fonts.display,
    fontSize: 32,
    lineHeight: 32 * 1.05,
    letterSpacing: -0.32,
    color: colors.ink,
  },
  displaySm: {
    fontFamily: fonts.display,
    fontSize: 26,
    lineHeight: 26 * 1.1,
    letterSpacing: -0.26,
    color: colors.ink,
  },
  displayXl: {
    fontFamily: fonts.display,
    fontSize: 56,
    lineHeight: 56,
    letterSpacing: -1.12,
    color: colors.ink,
  },
  h1: {
    fontFamily: fonts.display,
    fontSize: 24,
    lineHeight: 24 * 1.15,
    letterSpacing: -0.24,
    color: colors.ink,
  },
  h2: {
    fontFamily: fonts.sansSemibold,
    fontSize: 20,
    lineHeight: 20 * 1.3,
    letterSpacing: -0.1,
    color: colors.ink,
  },
  h3: {
    fontFamily: fonts.sansSemibold,
    fontSize: 17,
    lineHeight: 17 * 1.35,
    letterSpacing: -0.05,
    color: colors.ink,
  },
  bodyL: {
    fontFamily: fonts.sans,
    fontSize: 17,
    lineHeight: 17 * 1.55,
    color: colors.ink2,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 15 * 1.55,
    color: colors.ink,
  },
  caption: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 13 * 1.45,
    color: colors.ink3,
  },
  data: {
    fontFamily: fonts.mono,
    fontSize: 13,
    color: colors.ink,
  },
  eyebrow: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 11 * 0.16, // 0.16em
    textTransform: 'uppercase' as const,
    color: colors.eucalyptus,
  },
  italicDisplay: {
    fontFamily: fonts.displayItalic,
    fontStyle: 'italic' as const,
  },
});

// Cards — `.card`, `.card-warm`, `.card-mint`, `.card-paper`, `.card-clinical`.
// `.card` uses a gradient (paper -> cream-warm); apply via expo-linear-gradient
// using `cardGradient` colors and wrap with `card` for border/radius/padding.
export const cardGradient = {
  defaultColors: [colors.paper, colors.creamWarm] as const,
  start: { x: 0, y: 0 },
  end: { x: 0, y: 1 },
};

export const cards = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 18,
    overflow: 'hidden',
    ...shadows.sm,
  },
  cardWarm: {
    backgroundColor: colors.creamWarm,
    borderRadius: radius.md,
    padding: 18,
  },
  cardMint: {
    backgroundColor: colors.mintMist,
    borderRadius: radius.md,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(63, 111, 90, 0.1)',
  },
  cardPaper: {
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: 18,
    ...shadows.sm,
  },
  cardClinical: {
    backgroundColor: colors.paper,
    borderWidth: 1.5,
    borderColor: colors.inkDisabled,
    borderRadius: radius.md,
    padding: 16,
  },
});

// Buttons — `.btn-primary`, `.btn-soft`, `.btn-outline` (HormonaIQ.html 146-193).
export const buttons = StyleSheet.create({
  primary: {
    backgroundColor: colors.eucalyptus,
    height: 52,
    borderRadius: radius.pill,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...shadows.md,
  },
  primaryLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    letterSpacing: 0.15,
    color: colors.paper,
  },
  primaryDisabled: {
    opacity: 0.4,
  },
  soft: {
    backgroundColor: colors.mintMist,
    height: 48,
    borderRadius: radius.pill,
    paddingHorizontal: 22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  softLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.eucalyptusDeep,
  },
  outline: {
    backgroundColor: 'transparent',
    height: 48,
    borderRadius: radius.pill,
    paddingHorizontal: 22,
    borderWidth: 1.5,
    borderColor: colors.eucalyptus,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  outlineLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.eucalyptusDeep,
  },
});

// Components — `.badge`, `.chip`, `.phase-pill`, `.scale-btn`.
export const components = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: radius.pill,
    backgroundColor: colors.mintMist,
    alignSelf: 'flex-start',
  },
  badgeLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 11 * 0.02,
    color: colors.eucalyptusDeep,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.paper,
    borderRadius: radius.pill,
    minHeight: 44, // 44 tap target (CSS was 36)
    alignSelf: 'flex-start',
  },
  chipActive: {
    backgroundColor: colors.eucalyptus,
    borderColor: colors.eucalyptus,
  },
  chipLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.ink,
  },
  chipLabelActive: {
    color: colors.paper,
  },
  phasePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  phasePillLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
  },
  phaseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  scaleBtn: {
    height: 48,
    minWidth: 48,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.paper,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scaleBtnActive: {
    backgroundColor: colors.eucalyptus,
    borderColor: colors.eucalyptus,
  },
  scaleBtnLabel: {
    fontFamily: fonts.mono,
    fontSize: 16,
    color: colors.ink,
  },
  scaleBtnLabelActive: {
    color: colors.paper,
  },
});

// Layout — `.screen`, `.tabbar`, `.topbar`.
export const layout = StyleSheet.create({
  screen: {
    flex: 1,
    paddingTop: 22,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: 'rgba(250, 251, 246, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabbar: {
    flexDirection: 'row',
    marginHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.tabbarBorder,
    borderRadius: radius.pill,
    padding: 6,
    ...shadows.md,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: radius.pill,
    minHeight: 44,
  },
  tabActive: {
    backgroundColor: colors.eucalyptus,
  },
  tabLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 10,
    color: colors.ink3,
  },
  tabLabelActive: {
    color: colors.paper,
  },
});

// Re-export common spacing/radius for convenience at consumption sites.
export { colors, fonts, radius, shadows, spacing } from './tokens';
