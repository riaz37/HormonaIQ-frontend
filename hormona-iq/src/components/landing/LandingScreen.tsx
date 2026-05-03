import React from 'react';
import type { ReactElement } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { router } from 'expo-router';
import Svg, { Circle, Path } from 'react-native-svg';
import { colors, fonts, radius, shadows } from '../../constants/tokens';
import { DecorativeBlob } from './DecorativeBlob';
import { WaitlistForm } from './WaitlistForm';
import { FAQItem } from './FAQItem';

type IconComponent = (props: { size?: number }) => ReactElement;

// ─────────────────────────────────────────────
// Inline SVG icons — Morning Garden organic motifs
// ─────────────────────────────────────────────

function LeafSprig({
  size = 24,
  fill = colors.eucalyptus,
}: {
  size?: number;
  fill?: string;
}): ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22V8"
        stroke={fill}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      <Path
        d="M12 16Q6.5 15.2 5 9.5Q10.5 9.8 12 16Z"
        fill={fill}
        opacity={0.85}
      />
      <Path
        d="M12 12Q17.5 11.2 19 5.5Q13.5 5.8 12 12Z"
        fill={fill}
        opacity={0.65}
      />
    </Svg>
  );
}

function PromiseLeaf1(): ReactElement {
  return <LeafSprig size={28} fill={colors.eucalyptus} />;
}
function PromiseLeaf2(): ReactElement {
  return <LeafSprig size={28} fill={colors.eucalyptusSoft} />;
}
function PromiseLeaf3(): ReactElement {
  return (
    <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 22V8"
        stroke={colors.eucalyptus}
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      <Path
        d="M12 16Q6.5 15.2 5 9.5Q10.5 9.8 12 16Z"
        fill={colors.mintMist}
      />
      <Path
        d="M12 12Q17.5 11.2 19 5.5Q13.5 5.8 12 12Z"
        fill={colors.mintMist}
      />
    </Svg>
  );
}

// PMDD — phase-segment arc
function IconPMDD(): ReactElement {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Circle
        cx={12}
        cy={12}
        r={9}
        stroke={colors.eucalyptus}
        strokeWidth={1.4}
      />
      <Path d="M12 3 A9 9 0 0 1 12 21 Z" fill={colors.eucalyptus} />
    </Svg>
  );
}

// PCOS — overlapping circles
function IconPCOS(): ReactElement {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Circle
        cx={9}
        cy={12}
        r={6}
        stroke={colors.eucalyptus}
        strokeWidth={1.4}
      />
      <Circle
        cx={15}
        cy={12}
        r={6}
        stroke={colors.eucalyptus}
        strokeWidth={1.4}
      />
    </Svg>
  );
}

// Perimenopause — half-circle horizon
function IconPeri(): ReactElement {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 15 A9 9 0 0 1 21 15"
        stroke={colors.eucalyptus}
        strokeWidth={1.6}
        strokeLinecap="round"
        fill="none"
      />
      <Path d="M2 15h20" stroke={colors.eucalyptus} strokeWidth={1.4} strokeLinecap="round" />
    </Svg>
  );
}

// ADHD — spark/lightning bolt
function IconADHD(): ReactElement {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path
        d="M13 2 L5 13 H11 L9 22 L19 10 H13 L15 2 Z"
        stroke={colors.eucalyptus}
        strokeWidth={1.4}
        strokeLinejoin="round"
        fill="none"
      />
    </Svg>
  );
}

// Endometriosis — 4-petal flower
function IconEndo(): ReactElement {
  return (
    <Svg width={26} height={26} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 4 Q15 8 12 12 Q9 8 12 4 Z"
        stroke={colors.eucalyptus}
        strokeWidth={1.3}
        fill="none"
      />
      <Path
        d="M12 20 Q15 16 12 12 Q9 16 12 20 Z"
        stroke={colors.eucalyptus}
        strokeWidth={1.3}
        fill="none"
      />
      <Path
        d="M4 12 Q8 9 12 12 Q8 15 4 12 Z"
        stroke={colors.eucalyptus}
        strokeWidth={1.3}
        fill="none"
      />
      <Path
        d="M20 12 Q16 9 12 12 Q16 15 20 12 Z"
        stroke={colors.eucalyptus}
        strokeWidth={1.3}
        fill="none"
      />
      <Circle cx={12} cy={12} r={1.4} fill={colors.eucalyptus} />
    </Svg>
  );
}

interface ConditionEntry {
  name: string;
  desc: string;
  Icon: IconComponent;
}

interface PromiseEntry {
  Icon: IconComponent;
  title: string;
  body: string;
}

interface FAQEntry {
  q: string;
  a: string;
}

const CONDITIONS: ReadonlyArray<ConditionEntry> = [
  {
    name: 'PMDD',
    desc:
      'For the half of every month you disappear. We track it on the DRSP — the scale your psychiatrist already trusts.',
    Icon: IconPMDD,
  },
  {
    name: 'PCOS',
    desc:
      'Cycles 21–120 days are normal here. Lab values, androgen symptoms, insulin patterns — not just your period.',
    Icon: IconPCOS,
  },
  {
    name: 'Perimenopause',
    desc:
      'Greene Scale scoring, hot flash timing, HRT effectiveness. Including premature onset before 40.',
    Icon: IconPeri,
  },
  {
    name: 'ADHD overlap',
    desc:
      '46% of women with ADHD also have PMDD. We track how your meds work across your cycle.',
    Icon: IconADHD,
  },
  {
    name: 'Endometriosis & more',
    desc:
      "Many of you carry more than one condition. We don’t make you start over for each.",
    Icon: IconEndo,
  },
] as const;

const PROMISES: ReadonlyArray<PromiseEntry> = [
  {
    Icon: PromiseLeaf1,
    title: 'Clinical scales, not vibes',
    body:
      'DRSP for PMDD. Greene Scale for perimenopause. Rotterdam phenotyping for PCOS. Mapped to what your doctor uses.',
  },
  {
    Icon: PromiseLeaf2,
    title: 'Adult language, every page',
    body:
      'No euphemisms. No "flow days." No emoji-only mood pickers. We talk to you like the expert on your own body.',
  },
  {
    Icon: PromiseLeaf3,
    title: 'Device-first, never sold',
    body:
      'Your data stays on your phone. End-to-end encrypted if you sync. No advertising SDKs. Period.',
  },
] as const;

const FAQS: ReadonlyArray<FAQEntry> = [
  {
    q: 'Is this just another period tracker?',
    a:
      'No. We implement the DRSP for PMDD, the Greene Climacteric Scale for perimenopause, and Rotterdam Criteria phenotyping for PCOS. We generate the clinical documentation your doctor needs. Period prediction is a side effect — never the product.',
  },
  {
    q: 'My cycles are 60+ days. Will the app freak out?',
    a:
      'No. We never display "overdue." We never assume 28 days. PCOS cycles, perimenopause irregularity, and post-pill recovery are all first-class citizens here — not edge cases.',
  },
  {
    q: "I'm 33 and in early menopause. Does this work for me?",
    a:
      'Yes. Premature ovarian insufficiency and early perimenopause are explicitly supported. We do not group you with women 20 years older. Your experience is categorically different and the app reflects that.',
  },
  {
    q: "I've tracked for 11 years in spreadsheets. Will this talk down to me?",
    a:
      'No. There is a power-user mode with raw data export, custom symptom fields, and lab value tracking with PCOS-specific reference ranges. We respect that you know your body better than any provider you have seen.',
  },
  {
    q: 'Do I need a diagnosis to use it?',
    a:
      'Not at all. Many users are tracking precisely because they are trying to get one. The chart you build is the document many clinicians use to make that diagnosis. Average PMDD diagnostic delay is 12 years. We exist to shorten it.',
  },
  {
    q: 'What happens to my health data?',
    a:
      'It lives on your device first. End-to-end encrypted if you sync. No Meta SDK. No Google Analytics SDK. We will never sell or share it. We minimize what we store on our servers; sensitive data is encrypted client-side.',
  },
] as const;

const PLAY_STORE_URL = 'https://play.google.com/store';

function openOnboarding(): void {
  router.push('/(onboarding)/start');
}

export function LandingScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 880;
  const isMid = width >= 640;

  const heroHeadlineSize = Math.min(76, Math.max(40, width * 0.06));
  const displaySize = isWide ? 44 : isMid ? 36 : 32;

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Decorative ambient blobs */}
      <DecorativeBlob
        size={380}
        color={colors.mintMist}
        opacity={0.7}
        blurRadius={60}
        style={{ top: -100, right: -120 }}
      />
      <DecorativeBlob
        size={320}
        color={colors.butter}
        opacity={0.5}
        blurRadius={70}
        style={{ top: 280, left: -160 }}
      />

      <View style={styles.frame}>
        {/* NavBar */}
        <View style={styles.nav}>
          <Text style={styles.logo} accessibilityRole="header">
            HormonaIQ
          </Text>
          <Pressable
            onPress={openOnboarding}
            accessibilityRole="button"
            accessibilityLabel="Open the app"
            style={({ pressed }) => [
              styles.navButton,
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={styles.navButtonLabel}>Open the app →</Text>
          </Pressable>
        </View>

        {/* Hero */}
        <View style={[styles.hero, isWide && styles.heroWide]}>
          <View style={[styles.heroCopy, isWide && styles.heroCopyWide]}>
            <View style={styles.badge}>
              <View style={styles.badgeDot} />
              <Text style={styles.badgeLabel}>For women who already knew</Text>
            </View>

            <Text
              style={[styles.displayXL, { fontSize: heroHeadlineSize, lineHeight: heroHeadlineSize }]}
            >
              You already knew.{' '}
              <Text style={[styles.displayXLItalic, { fontSize: heroHeadlineSize, lineHeight: heroHeadlineSize }]}>
                Now your doctor will too.
              </Text>
            </Text>

            <Text style={styles.bodyL}>
              The average woman with PMDD waits 12 years and sees 6 providers
              before diagnosis. Most are told it&rsquo;s anxiety, stress, or to
              just lose weight. HormonaIQ turns what you already feel into the
              clinical chart your doctor can&rsquo;t dismiss.
            </Text>

            <View style={styles.ctaRow}>
              <Pressable
                onPress={openOnboarding}
                accessibilityRole="button"
                accessibilityLabel="Join the waitlist"
                style={({ pressed }) => [
                  styles.btnPrimary,
                  pressed && { opacity: 0.9 },
                ]}
              >
                <Text style={styles.btnPrimaryLabel}>Join the waitlist →</Text>
              </Pressable>

              <Pressable
                onPress={openOnboarding}
                accessibilityRole="button"
                accessibilityLabel="See how it works"
                style={({ pressed }) => [
                  styles.btnOutline,
                  pressed && { backgroundColor: colors.mintPale },
                ]}
              >
                <Text style={styles.btnOutlineLabel}>See how it works</Text>
              </Pressable>
            </View>

            <Text style={styles.trust}>
              Reviewed by clinicians who treat PMDD, PCOS, and perimenopause
            </Text>

            <Pressable
              onPress={() => {
                if (typeof window !== 'undefined') {
                  window.open(PLAY_STORE_URL, '_blank', 'noopener');
                }
              }}
              accessibilityRole="link"
              accessibilityLabel="Available on Google Play"
              style={({ pressed }) => [
                styles.playBadge,
                pressed && { opacity: 0.85 },
              ]}
            >
              <Text style={styles.playBadgeKicker}>Now live</Text>
              <Text style={styles.playBadgeLabel}>Available on Google Play →</Text>
            </Pressable>
          </View>

          {/* Hero visual — CycleRing placeholder */}
          <View style={[styles.heroVisual, isWide && styles.heroVisualWide]}>
            <View style={styles.cycleRingOuter}>
              <View style={styles.cycleRingInner}>
                <Text style={styles.cycleDay}>Day</Text>
                <Text style={styles.cycleDayNumber}>19</Text>
                <Text style={styles.cyclePhase}>luteal</Text>
              </View>
            </View>
            <View style={styles.heroQuote}>
              <Text style={styles.heroQuoteText}>&ldquo;that makes sense.&rdquo;</Text>
            </View>
          </View>
        </View>

        {/* Promise strip */}
        <View
          style={[
            styles.promiseGrid,
            isWide ? styles.promiseGridWide : isMid ? styles.promiseGridMid : null,
          ]}
        >
          {PROMISES.map((p) => {
            const Icon = p.Icon;
            return (
              <View key={p.title} style={styles.promiseCard}>
                <View style={styles.promiseIconWrap}>
                  <Icon />
                </View>
                <Text style={styles.h2}>{p.title}</Text>
                <Text style={styles.body}>{p.body}</Text>
              </View>
            );
          })}
        </View>

        {/* Conditions */}
        <Text style={[styles.display, { fontSize: displaySize, lineHeight: displaySize * 1.05 }, styles.conditionsHeading]}>
          Five conditions.{' '}
          <Text style={[styles.displayItalic, { fontSize: displaySize, lineHeight: displaySize * 1.05 }]}>
            One gentle home.
          </Text>
        </Text>

        <View
          style={[
            styles.conditionsGrid,
            isWide ? styles.conditionsGridWide : isMid ? styles.conditionsGridMid : null,
          ]}
        >
          {CONDITIONS.map((c) => {
            const Icon = c.Icon;
            return (
              <Pressable
                key={c.name}
                onPress={openOnboarding}
                accessibilityRole="button"
                accessibilityLabel={`Built for ${c.name}`}
                style={({ pressed }) => [
                  styles.conditionCard,
                  isWide && styles.conditionCardWide,
                  isMid && !isWide && styles.conditionCardMid,
                  pressed && styles.conditionCardActive,
                ]}
              >
                <View style={styles.conditionIconWrap}>
                  <Icon />
                </View>
                <Text style={[styles.h2, { marginBottom: 6 }]}>{c.name}</Text>
                <Text style={[styles.body, { flex: 1 }]}>{c.desc}</Text>
                <Text style={styles.conditionLink}>Built for {c.name} →</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Email capture */}
        <View style={styles.waitlistWrap}>
          <View style={[styles.waitlistCard, isWide && styles.waitlistCardWide]}>
            <Text style={[styles.display, { fontSize: displaySize, lineHeight: displaySize * 1.05, marginBottom: 12 }]}>
              Join the{' '}
              <Text style={[styles.displayItalic, { fontSize: displaySize, lineHeight: displaySize * 1.05 }]}>
                waitlist.
              </Text>
            </Text>
            <Text style={[styles.bodyL, { marginBottom: 24 }]}>
              An invitation arrives when your module opens. We don&rsquo;t send
              anything else — promise.
            </Text>

            <WaitlistForm />

            <Text style={[styles.caption, { marginTop: 12 }]}>
              No spam, no sharing. Unsubscribe anytime.
            </Text>
          </View>
        </View>

        {/* FAQ */}
        <View style={styles.faqWrap}>
          <Text style={[styles.display, { fontSize: displaySize, lineHeight: displaySize * 1.05, marginBottom: 20 }]}>
            Common{' '}
            <Text style={[styles.displayItalic, { fontSize: displaySize, lineHeight: displaySize * 1.05 }]}>
              questions.
            </Text>
          </Text>
          {FAQS.map((f) => (
            <FAQItem key={f.q} question={f.q} answer={f.a} />
          ))}
        </View>

        {/* Disclaimer + Footer */}
        <View style={styles.disclaimer}>
          <Text style={styles.caption}>
            HormonaIQ is not a substitute for medical advice.
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.logoSmall}>HormonaIQ</Text>
          <Text style={styles.caption}>
            © 2026 HormonaIQ · Not a substitute for medical care
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  scrollContent: {
    paddingBottom: 64,
  },
  frame: {
    width: '100%',
    maxWidth: 1120,
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    position: 'relative',
    zIndex: 1,
  },

  // NavBar
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 56,
  },
  logo: {
    fontFamily: fonts.display,
    fontSize: 22,
    color: colors.ink,
    letterSpacing: -0.3,
  },
  logoSmall: {
    fontFamily: fonts.display,
    fontSize: 18,
    color: colors.ink,
    letterSpacing: -0.2,
  },
  navButton: {
    height: 40,
    paddingHorizontal: 18,
    backgroundColor: colors.mintMist,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
  },
  navButtonLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.eucalyptusDeep,
  },

  // Hero
  hero: {
    flexDirection: 'column',
    gap: 32,
  },
  heroWide: {
    flexDirection: 'row',
    gap: 64,
    alignItems: 'center',
  },
  heroCopy: {
    width: '100%',
  },
  heroCopyWide: {
    flex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: radius.pill,
    backgroundColor: colors.mintMist,
    alignSelf: 'flex-start',
    marginBottom: 22,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.eucalyptus,
  },
  badgeLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 0.22,
    color: colors.eucalyptusDeep,
  },
  displayXL: {
    fontFamily: fonts.display,
    color: colors.ink,
    letterSpacing: -0.8,
  },
  displayXLItalic: {
    fontFamily: fonts.displayItalic,
    fontStyle: 'italic',
    color: colors.eucalyptus,
    letterSpacing: -0.8,
  },
  bodyL: {
    marginTop: 24,
    fontFamily: fonts.sans,
    fontSize: 17,
    lineHeight: 26.35,
    color: colors.ink2,
    maxWidth: 540,
  },
  ctaRow: {
    marginTop: 32,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    maxWidth: 480,
  },
  btnPrimary: {
    flexGrow: 1,
    flexBasis: 220,
    height: 52,
    paddingHorizontal: 24,
    borderRadius: radius.pill,
    backgroundColor: colors.eucalyptus,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
  btnPrimaryLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.paper,
    letterSpacing: 0.15,
  },
  btnOutline: {
    height: 48,
    paddingHorizontal: 22,
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.eucalyptus,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnOutlineLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.eucalyptusDeep,
  },
  trust: {
    marginTop: 18,
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink3,
  },
  playBadge: {
    marginTop: 20,
    alignSelf: 'flex-start',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    minHeight: 44,
  },
  playBadgeKicker: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 1.76,
    textTransform: 'uppercase',
    color: colors.eucalyptus,
  },
  playBadgeLabel: {
    fontFamily: fonts.sansSemibold,
    fontSize: 13,
    color: colors.ink,
  },

  // Hero visual placeholder for CycleRing
  heroVisual: {
    minHeight: 360,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heroVisualWide: {
    flex: 1,
    minHeight: 480,
  },
  cycleRingOuter: {
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 18,
    borderColor: colors.coralSoft,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cream,
    ...shadows.md,
  },
  cycleRingInner: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cycleDay: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 1.76,
    textTransform: 'uppercase',
    color: colors.eucalyptus,
  },
  cycleDayNumber: {
    fontFamily: fonts.display,
    fontSize: 64,
    lineHeight: 68,
    color: colors.ink,
    marginTop: 4,
  },
  cyclePhase: {
    fontFamily: fonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 16,
    color: colors.ink2,
    marginTop: 2,
  },
  heroQuote: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 18,
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: radius.pill,
    ...shadows.sm,
  },
  heroQuoteText: {
    fontFamily: fonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 14,
    color: colors.ink,
  },

  // Promise strip
  promiseGrid: {
    marginTop: 64,
    flexDirection: 'column',
    gap: 20,
  },
  promiseIconWrap: {
    width: 32,
    height: 32,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 4,
  },
  promiseGridMid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  promiseGridWide: {
    flexDirection: 'row',
  },
  promiseCard: {
    flex: 1,
    minWidth: 240,
    backgroundColor: colors.creamWarm,
    borderRadius: radius.md,
    padding: 22,
    gap: 6,
  },
  promiseIcon: {
    fontSize: 28,
    lineHeight: 32,
  },
  h2: {
    fontFamily: fonts.sansSemibold,
    fontSize: 20,
    lineHeight: 26,
    color: colors.ink,
    letterSpacing: -0.1,
    marginTop: 10,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 15,
    lineHeight: 23.25,
    color: colors.ink2,
    marginTop: 6,
  },

  // Conditions
  conditionsHeading: {
    marginTop: 96,
    marginBottom: 28,
  },
  display: {
    fontFamily: fonts.display,
    color: colors.ink,
    letterSpacing: -0.32,
  },
  displayItalic: {
    fontFamily: fonts.displayItalic,
    fontStyle: 'italic',
    color: colors.eucalyptus,
    letterSpacing: -0.32,
  },
  conditionsGrid: {
    flexDirection: 'column',
    gap: 14,
  },
  conditionsGridMid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  conditionsGridWide: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  conditionCard: {
    flexGrow: 1,
    flexBasis: '100%',
    minWidth: 0,
    padding: 22,
    backgroundColor: colors.paper,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: 'column',
    ...shadows.sm,
  },
  conditionCardMid: {
    flexBasis: '48%',
    maxWidth: '49%',
  },
  conditionCardWide: {
    flexBasis: '31%',
    maxWidth: '32.5%',
  },
  conditionCardActive: {
    transform: [{ translateY: -4 }],
    ...shadows.md,
  },
  conditionIconWrap: {
    width: 30,
    height: 30,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 10,
  },
  conditionLink: {
    marginTop: 14,
    alignSelf: 'flex-start',
    fontFamily: fonts.sansMedium,
    fontSize: 13,
    color: colors.eucalyptus,
    textDecorationLine: 'underline',
  },

  // Waitlist
  waitlistWrap: {
    marginTop: 96,
    alignItems: 'center',
  },
  waitlistCard: {
    backgroundColor: colors.mintMist,
    borderRadius: radius.xl,
    padding: 32,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(63, 111, 90, 0.1)',
    width: '100%',
    maxWidth: 640,
  },
  waitlistCardWide: {
    alignSelf: 'center',
  },

  // FAQ
  faqWrap: {
    marginTop: 100,
    maxWidth: 760,
  },

  // Disclaimer + Footer
  disclaimer: {
    marginTop: 48,
  },
  footer: {
    marginTop: 48,
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  caption: {
    fontFamily: fonts.sans,
    fontSize: 13,
    lineHeight: 18.85,
    color: colors.ink3,
  },
});
