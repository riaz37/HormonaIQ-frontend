// Profile — settings, data exports, accessibility toggles, account management.
// Port of design-handoff/08-implementation-code/src/profile.jsx.
// T-52, T-56, T-85, T-86, T-91 features fully ported.

import { useState } from 'react';
import type { ReactElement } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useReducedMotion } from 'react-native-reanimated';

import {
  buttons,
  cards,
  layout,
  typography,
} from '../../src/constants/styles';
import { OraMarkSvg } from '../../src/components/illustrations/OraMarkSvg';
import { colors, fonts, radius, spacing } from '../../src/constants/tokens';
import { useAppStore, useSettingsStore } from '../../src/stores';

// ─────────────────────────────────────────────
// Local state shape — replaces window.HQ.useApp()
// ─────────────────────────────────────────────
interface FeatureFlags {
  weightTracker?: boolean;
}

// Local-only profile state — fields that are *not* persisted in the global
// stores (transient session UI, account-creation flow, passive-mode TTL).
interface ProfileState {
  email: string | null;
  passiveModeUntil: number | null;
  passiveAutoOverride: boolean;
  cyclePaused: boolean;
  generalOnly: boolean;
  featureFlags: FeatureFlags;
  brainFogMode: boolean;
  accountCreated: boolean;
  cloudSaveOffered: boolean;
}

const INITIAL_STATE: ProfileState = {
  email: null,
  passiveModeUntil: null,
  passiveAutoOverride: false,
  cyclePaused: false,
  generalOnly: false,
  featureFlags: {},
  brainFogMode: false,
  accountCreated: false,
  cloudSaveOffered: false,
};

// ─────────────────────────────────────────────
// Sub-component prop types
// ─────────────────────────────────────────────
interface GroupProps {
  title: string;
  children: ReactElement | ReactElement[];
  cardStyle?: object;
  stripStyle?: object;
}

interface RowProps {
  label: string;
  right?: ReactElement;
  onPress?: () => void;
  danger?: boolean;
}

// ─────────────────────────────────────────────
// Group — section container with eyebrow title + card wrapper
// ─────────────────────────────────────────────
function Group({ title, children, cardStyle, stripStyle }: GroupProps): ReactElement {
  return (
    <View style={s.group}>
      <Text style={[typography.eyebrow, s.groupTitle]}>{title}</Text>
      <View style={[s.groupCard, cardStyle, stripStyle, s.groupCardOverride]}>{children}</View>
    </View>
  );
}

// ─────────────────────────────────────────────
// Row — standard setting row with label + right slot
// ─────────────────────────────────────────────
function Row({ label, right, onPress, danger = false }: RowProps): ReactElement {
  const inner = (
    <View style={s.settingRow}>
      <Text style={[s.rowLabel, danger && s.rowLabelDanger]}>{label}</Text>
      {right !== undefined && <View>{right}</View>}
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => (pressed ? s.rowPressed : undefined)}
        accessibilityRole="button"
        accessibilityLabel={label}
      >
        {inner}
      </Pressable>
    );
  }

  return inner;
}

// ─────────────────────────────────────────────
// TextLink — inline link-style text
// ─────────────────────────────────────────────
function TextLink({
  children,
  color: colorOverride,
}: {
  children: string;
  color?: string;
}): ReactElement {
  return (
    <Text style={[s.textLink, colorOverride ? { color: colorOverride } : undefined]}>
      {children}
    </Text>
  );
}

// ─────────────────────────────────────────────
// ProfileScreen
// ─────────────────────────────────────────────
export default function ProfileScreen(): ReactElement {
  // router available for future navigation calls (e.g. goto('insights'))
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const router = useRouter();

  // T-56 — system reduce-motion preference from react-native-reanimated
  const systemReduceMotion = useReducedMotion();

  // ── Global persistent state ───────────────────────────────────────────
  const conditions = useAppStore((s) => s.conditions);
  const adhdFlag = useAppStore((s) => s.adhdFlag);
  const cycleLen = useAppStore((s) => s.cycleLen);
  const passiveMode = useAppStore((s) => s.passiveMode);
  const setPassiveModeStore = useAppStore((s) => s.setPassiveMode);

  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const reduceMotionPref = useSettingsStore((s) => s.reduceMotion);
  const setReduceMotionPref = useSettingsStore((s) => s.setReduceMotion);
  const oraEnabled = useSettingsStore((s) => s.oraEnabled);
  const setOraEnabledStore = useSettingsStore((s) => s.setOraEnabled);
  const edSafeMode = useSettingsStore((s) => s.edSafeMode);
  const setEdSafeModeStore = useSettingsStore((s) => s.setEdSafeMode);

  // ── Local UI / transient state ────────────────────────────────────────
  const [state, setState] = useState<ProfileState>(INITIAL_STATE);
  const [textSize, setTextSize] = useState(16);
  const [showAbout, setShowAbout] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  // T-85 — pregnancy/pause confirm modal
  const [showPauseModal, setShowPauseModal] = useState(false);
  // T-86 — sign out confirm modal
  const [showSignOut, setShowSignOut] = useState(false);

  // T-56 — combine system preference with in-app override
  const reduceMotion = systemReduceMotion || reduceMotionPref;
  const setReduceMotion = (v: boolean): void => {
    setReduceMotionPref(v);
  };

  // T-91 — passive mode (24h TTL kept locally; persisted toggle in store)
  const passiveActive =
    passiveMode ||
    (state.passiveModeUntil !== null && Date.now() < state.passiveModeUntil);

  const togglePassive = (): void => {
    if (passiveActive) {
      setPassiveModeStore(false);
      setState((prev) => ({
        ...prev,
        passiveModeUntil: null,
        passiveAutoOverride: true,
      }));
    } else {
      setPassiveModeStore(true);
      setState((prev) => ({
        ...prev,
        passiveModeUntil: Date.now() + 24 * 3600 * 1000,
      }));
    }
  };

  // T-85 — pause cycle actions
  const archivePause = (): void => {
    setState((prev) => ({ ...prev, cyclePaused: true, generalOnly: false }));
    setShowPauseModal(false);
  };

  const generalOnlyPath = (): void => {
    setState((prev) => ({ ...prev, cyclePaused: false, generalOnly: true }));
    setShowPauseModal(false);
  };

  const resumeCycle = (): void => {
    setState((prev) => ({ ...prev, cyclePaused: false, generalOnly: false }));
  };

  const edSafe = edSafeMode;
  const weightOpt = !!(state.featureFlags && state.featureFlags.weightTracker);

  const toggleWeightOpt = (): void => {
    if (edSafe) return;
    setState((prev) => ({
      ...prev,
      featureFlags: {
        ...prev.featureFlags,
        weightTracker: !prev.featureFlags.weightTracker,
      },
    }));
  };

  const toggleEdSafe = (): void => setEdSafeModeStore(!edSafeMode);

  const toggleBrainFog = (): void =>
    setState((prev) => ({ ...prev, brainFogMode: !prev.brainFogMode }));

  const toggleOra = (): void => setOraEnabledStore(!oraEnabled);

  const toggleTheme = (): void => setTheme(theme === 'dark' ? 'light' : 'dark');

  const avatarInitial = state.email?.[0]?.toUpperCase() ?? '?';

  const tags: string[] = [
    ...conditions,
    ...(adhdFlag ? ['ADHD'] : []),
  ];

  const modalAnimation = reduceMotion ? 'none' : ('slide' as const);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.cream }}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[layout.screen, { paddingBottom: 48 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* T-52 — header avatar block with butter → mint gradient tones */}
        <View style={[s.headerCard, { marginBottom: 24 }]}>
          <View style={s.headerRow}>
            <View style={s.avatarCircle}>
              <Text style={s.avatarGlyph}>{avatarInitial}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={typography.displaySm}>Your space</Text>
            </View>
          </View>
          {tags.length > 0 && (
            <View style={s.tagsRow}>
              {tags.map((tag) => (
                <View key={tag} style={s.badge}>
                  <Text style={s.badgeLabel}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* ── My data ──────────────────────────────────────────────────── */}
        <Group title="My data" cardStyle={cards.cardMint}>
          <>
            <Row
              label="Conditions tracked"
              right={
                <Text style={typography.caption}>
                  {conditions.length ? conditions.join(' · ') : 'None yet'}
                </Text>
              }
              onPress={() => {}}
            />
            <View style={s.divider} />
            <Row
              label="Cycle settings"
              right={
                <Text style={typography.caption}>{cycleLen} day cycle</Text>
              }
            />
            <View style={s.divider} />
            <Row
              label="Lab vault"
              right={
                <Text style={typography.caption}>
                  Testosterone · SHBG · AMH · 11 more
                </Text>
              }
            />
            <View style={s.divider} />
            <Row
              label="Medication & response"
              right={
                <Text style={typography.caption}>2 active · cycle-aware</Text>
              }
            />
            <View style={s.divider} />
            <Row
              label="Export my data"
              right={
                <Text style={typography.caption}>JSON · CSV · PDF report</Text>
              }
              onPress={() => {}}
            />
            <View style={s.divider} />

            {/* Weight tracker */}
            <View style={[s.settingRow, edSafe && s.settingRowDisabled]}>
              <View style={{ flex: 1 }}>
                <Text style={s.rowLabel}>Weight tracker (optional)</Text>
                <Text style={s.rowCaption}>
                  {edSafe
                    ? 'You opted out of weight-related tracking at onboarding.'
                    : 'Hidden by default. Opt in if useful.'}
                </Text>
              </View>
              <Switch
                value={weightOpt}
                onValueChange={edSafe ? undefined : toggleWeightOpt}
                disabled={edSafe}
                trackColor={{ false: colors.inkDisabled, true: colors.eucalyptus }}
                thumbColor={colors.paper}
                accessibilityLabel="Weight tracker toggle"
              />
            </View>
            <View style={s.divider} />

            {/* ED-safe mode */}
            <View style={s.settingRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.rowLabel}>Food/body sensitive mode</Text>
                <Text style={s.rowCaption}>
                  Hides voice-diet logging and weight tracker.
                </Text>
              </View>
              <Switch
                value={edSafe}
                onValueChange={toggleEdSafe}
                trackColor={{ false: colors.inkDisabled, true: colors.eucalyptus }}
                thumbColor={colors.paper}
                accessibilityLabel="Food and body sensitive mode toggle"
              />
            </View>
            <View style={s.divider} />

            {/* T-85 — Pause cycle tracking row */}
            {!state.cyclePaused && !state.generalOnly && (
              <Row
                label="Pause cycle tracking (pregnancy or other)"
                right={<TextLink>Pause</TextLink>}
                onPress={() => setShowPauseModal(true)}
              />
            )}
            {(state.cyclePaused || state.generalOnly) && (
              <>
                <View style={s.settingRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={s.rowLabel}>
                      {state.cyclePaused
                        ? 'Cycle tracking paused'
                        : 'General health logging only'}
                    </Text>
                    <Text style={s.rowCaption}>
                      Resume any time — your data is here.
                    </Text>
                  </View>
                  <Pressable
                    onPress={resumeCycle}
                    style={s.textLinkBtn}
                    accessibilityRole="button"
                    accessibilityLabel="Resume cycle tracking"
                  >
                    <Text style={s.textLink}>Resume</Text>
                  </Pressable>
                </View>
                <View style={s.divider} />
              </>
            )}

            {/* T-91 — Passive mode toggle */}
            <View style={s.settingRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.rowLabel}>Show me data without questions today</Text>
                <Text style={s.rowCaption}>
                  Quiets prompts and share-actions for 24 hours.
                </Text>
              </View>
              <Switch
                value={passiveActive}
                onValueChange={togglePassive}
                trackColor={{ false: colors.inkDisabled, true: colors.eucalyptus }}
                thumbColor={colors.paper}
                accessibilityLabel="Passive mode toggle"
              />
            </View>
          </>
        </Group>

        {/* ── Account ──────────────────────────────────────────────────── */}
        <Group title="Account" cardStyle={cards.card}>
          <>
            <Row
              label="Email"
              right={
                <Text style={typography.caption}>
                  {state.email ?? 'No email saved'}
                </Text>
              }
            />
            <View style={s.divider} />
            <Row
              label="Subscription tier"
              right={
                <Text style={typography.caption}>
                  Free trial · 14 days remaining
                </Text>
              }
            />
            <View style={s.divider} />
            <Row
              label="Restore purchases"
              right={<TextLink>Restore</TextLink>}
              onPress={() => {}}
            />
            <View style={s.divider} />
            <Row
              label="Sign out"
              onPress={() => setShowSignOut(true)}
              danger
            />
          </>
        </Group>

        {/* ── Optional: save to cloud ───────────────────────────────────── */}
        {!state.accountCreated && (
          <View style={s.group}>
            <Text style={[typography.eyebrow, s.groupTitle]}>OPTIONAL</Text>
            <View style={[s.groupCard, cards.cardWarm, s.stripSage]}>
              <View style={s.accentDot} />
              <Text
                style={[
                  typography.body,
                  { fontFamily: fonts.sansSemibold, marginBottom: 4 },
                ]}
              >
                Save your data to the cloud
              </Text>
              <Text style={[typography.caption, { fontSize: 12, marginBottom: 12 }]}>
                Your data lives on this device. Add an account if you want to
                back it up or use it on another phone. End-to-end encrypted.
              </Text>
              <View style={s.buttonRow}>
                <Pressable
                  style={[buttons.soft, { flex: 1 }]}
                  onPress={() =>
                    setState((prev) => ({ ...prev, accountCreated: true }))
                  }
                  accessibilityRole="button"
                  accessibilityLabel="Create account"
                >
                  <Text style={buttons.softLabel}>Create account</Text>
                </Pressable>
                <Pressable
                  style={[s.ghostBtn, { flex: 1 }]}
                  onPress={() =>
                    setState((prev) => ({ ...prev, cloudSaveOffered: true }))
                  }
                  accessibilityRole="button"
                  accessibilityLabel="Not now, skip cloud save"
                >
                  <Text style={[s.ghostBtnLabel, { fontSize: 13 }]}>
                    Not now
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}

        {/* ── Ora ──────────────────────────────────────────────────────── */}
        <Group title="Ora" cardStyle={cards.cardWarm}>
          <>
            <Row
              label="Ora is"
              right={
                <Switch
                  value={oraEnabled}
                  onValueChange={toggleOra}
                  trackColor={{ false: colors.inkDisabled, true: colors.eucalyptus }}
                  thumbColor={colors.paper}
                  accessibilityLabel="Ora AI companion toggle"
                />
              }
            />
            <View style={s.divider} />
            <Row
              label="What does Ora use?"
              right={<TextLink>Learn</TextLink>}
              onPress={() => {}}
            />
            <View style={s.divider} />
            <View style={s.settingRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.rowLabel}>Delete Ora's session</Text>
                <Text style={s.rowCaption}>
                  Wipes what I've been holding in conversation. Your logs and
                  charts stay.
                </Text>
              </View>
              <Pressable
                style={s.textLinkBtn}
                onPress={() => {}}
                accessibilityRole="button"
                accessibilityLabel="Delete Ora's conversation session"
              >
                <Text style={s.textLink}>Delete</Text>
              </Pressable>
            </View>
          </>
        </Group>

        {/* ── Privacy (T-52 — brand promise: warm card + sage stripe) ───── */}
        <Group
          title="Privacy"
          cardStyle={cards.cardWarm}
          stripStyle={s.stripSage}
        >
          <>
            <View style={s.accentDot} />
            <Row
              label="Delete all data"
              right={<TextLink color={colors.danger}>Delete</TextLink>}
              onPress={() => setConfirmDelete(true)}
              danger
            />
            <View style={s.divider} />
            <Row
              label="Privacy policy"
              right={<TextLink>Read</TextLink>}
              onPress={() => {}}
            />
            <View style={s.divider} />
            <Row
              label="About your data"
              right={<TextLink>Read</TextLink>}
              onPress={() => setShowAbout(true)}
            />
          </>
        </Group>

        {/* ── Appearance ───────────────────────────────────────────────── */}
        <Group title="Appearance" cardStyle={cards.card}>
          <>
            <Row
              label="Dark mode"
              right={
                <Switch
                  value={theme === 'dark'}
                  onValueChange={toggleTheme}
                  trackColor={{ false: colors.inkDisabled, true: colors.eucalyptus }}
                  thumbColor={colors.paper}
                  accessibilityLabel="Dark mode toggle"
                />
              }
            />
            <View style={s.divider} />

            {/* Text size — +/- buttons replace the web <input type="range"> */}
            <View style={s.settingRow}>
              <Text style={s.rowLabel}>Text size</Text>
              <View style={s.textSizeControl}>
                <Pressable
                  style={s.textSizeBtn}
                  onPress={() => setTextSize((v) => Math.max(14, v - 1))}
                  accessibilityRole="button"
                  accessibilityLabel="Decrease text size"
                >
                  <Text style={s.textSizeBtnLabel}>−</Text>
                </Pressable>
                <Text style={s.textSizeValue}>{textSize}px</Text>
                <Pressable
                  style={s.textSizeBtn}
                  onPress={() => setTextSize((v) => Math.min(20, v + 1))}
                  accessibilityRole="button"
                  accessibilityLabel="Increase text size"
                >
                  <Text style={s.textSizeBtnLabel}>+</Text>
                </Pressable>
              </View>
            </View>
            <View style={s.divider} />

            {/* T-56 — reduce motion (system pref + in-app override) */}
            <Row
              label="Reduce motion"
              right={
                <Switch
                  value={reduceMotion}
                  onValueChange={setReduceMotion}
                  trackColor={{ false: colors.inkDisabled, true: colors.eucalyptus }}
                  thumbColor={colors.paper}
                  accessibilityLabel="Reduce motion toggle"
                />
              }
            />
            <View style={s.divider} />

            {/* Brain Fog Mode */}
            <View style={s.settingRow}>
              <View style={{ flex: 1 }}>
                <Text style={s.rowLabel}>Brain Fog Mode</Text>
                <Text style={s.rowCaption}>
                  Hides Tools / Ora / Calendar tabs. Increases font and tap
                  targets. For your hardest days.
                </Text>
              </View>
              <Switch
                value={state.brainFogMode}
                onValueChange={toggleBrainFog}
                trackColor={{ false: colors.inkDisabled, true: colors.eucalyptus }}
                thumbColor={colors.paper}
                accessibilityLabel="Brain Fog Mode toggle"
              />
            </View>
          </>
        </Group>

        {/* ── About ────────────────────────────────────────────────────── */}
        <Group title="About" cardStyle={cards.card}>
          <>
            <Row
              label="Clinical methodology"
              right={<TextLink>Read</TextLink>}
              onPress={() => {}}
            />
            <View style={s.divider} />
            <Row
              label="Advisor team"
              right={<TextLink>View</TextLink>}
              onPress={() => {}}
            />
            <View style={s.divider} />
            <Row
              label="Version"
              right={
                <Text style={typography.caption}>1.0.0 · build 248</Text>
              }
            />
          </>
        </Group>

        {/* ── About your data modal ─────────────────────────────────────── */}
        <Modal
          visible={showAbout}
          animationType={modalAnimation}
          transparent
          onRequestClose={() => setShowAbout(false)}
        >
          <Pressable
            style={s.modalBackdrop}
            onPress={() => setShowAbout(false)}
            accessibilityRole="button"
            accessibilityLabel="Close about your data modal"
          >
            <Pressable
              style={s.modalSheet}
              onPress={(e) => e.stopPropagation()}
              accessibilityLabel="About your data dialog"
            >
              <Text style={[typography.displaySm, { marginBottom: 14 }]}>
                About your data
              </Text>
              <Text style={[typography.body, { marginBottom: 12 }]}>
                Logs live on your device first and sync to encrypted servers
                under your account only. We never sell, share, or use your
                health data for ads.
              </Text>
              <Text style={[typography.body, { marginBottom: 12 }]}>
                Ora insights use only the symptom and cycle data you've logged
                — never your name, email, or location.
              </Text>
              <Text style={[typography.body, { marginBottom: 18 }]}>
                Export everything at any time. Delete it within 30 days of
                request.
              </Text>
              <Pressable
                style={[buttons.outline, { width: '100%' }]}
                onPress={() => setShowAbout(false)}
                accessibilityRole="button"
                accessibilityLabel="Close about your data"
              >
                <Text style={buttons.outlineLabel}>Close</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>

        {/* ── Delete all data confirm modal ─────────────────────────────── */}
        <Modal
          visible={confirmDelete}
          animationType={modalAnimation}
          transparent
          onRequestClose={() => setConfirmDelete(false)}
        >
          <Pressable
            style={s.modalBackdrop}
            onPress={() => setConfirmDelete(false)}
            accessibilityRole="button"
            accessibilityLabel="Close delete confirmation modal"
          >
            <Pressable
              style={s.modalSheet}
              onPress={(e) => e.stopPropagation()}
              accessibilityLabel="Delete all data confirmation dialog"
            >
              <Text style={[typography.displaySm, { marginBottom: 12 }]}>
                Delete all data?
              </Text>
              <Text style={[typography.body, { marginBottom: 22 }]}>
                This permanently removes every log, chart, and report. We
                cannot recover it.
              </Text>
              {/* T-51 — danger token */}
              <Pressable
                style={[
                  buttons.primary,
                  { backgroundColor: colors.danger, marginBottom: 8 },
                ]}
                onPress={() => setConfirmDelete(false)}
                accessibilityRole="button"
                accessibilityLabel="Delete everything permanently"
              >
                <Text style={buttons.primaryLabel}>Delete everything</Text>
              </Pressable>
              <Pressable
                style={[buttons.outline, { width: '100%' }]}
                onPress={() => setConfirmDelete(false)}
                accessibilityRole="button"
                accessibilityLabel="Cancel delete"
              >
                <Text style={buttons.outlineLabel}>Cancel</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>

        {/* ── T-85 — Pause cycle modal (Ora's voice) ────────────────────── */}
        <Modal
          visible={showPauseModal}
          animationType={modalAnimation}
          transparent
          onRequestClose={() => setShowPauseModal(false)}
        >
          <Pressable
            style={s.modalBackdrop}
            onPress={() => setShowPauseModal(false)}
            accessibilityRole="button"
            accessibilityLabel="Close pause cycle modal"
          >
            <Pressable
              style={s.modalSheet}
              onPress={(e) => e.stopPropagation()}
              accessibilityLabel="Pause cycle tracking dialog"
            >
              <View style={s.oraLabel}>
                <OraMarkSvg size={22} state="listening" />
                <Text style={s.oraLabelText}>ORA</Text>
              </View>
              <Text style={[typography.body, { marginTop: 10, marginBottom: 18 }]}>
                Got it. I'm setting your data aside, not deleting it — it'll
                be here when you want it. I'll stop logging cycle stuff. If
                you ever want to come back, just flip this switch.
              </Text>
              <Pressable
                style={[buttons.primary, { marginBottom: 8 }]}
                onPress={archivePause}
                accessibilityRole="button"
                accessibilityLabel="Archive and pause cycle features"
              >
                <Text style={buttons.primaryLabel}>
                  Archive + pause cycle features
                </Text>
              </Pressable>
              <Pressable
                style={[buttons.outline, { width: '100%', marginBottom: 8 }]}
                onPress={generalOnlyPath}
                accessibilityRole="button"
                accessibilityLabel="Continue logging general health only"
              >
                <Text style={buttons.outlineLabel}>
                  Continue logging general health
                </Text>
              </Pressable>
              <Pressable
                style={[s.ghostBtn, { width: '100%' }]}
                onPress={() => setShowPauseModal(false)}
                accessibilityRole="button"
                accessibilityLabel="Cancel pause"
              >
                <Text style={[s.ghostBtnLabel, { fontSize: 13 }]}>Cancel</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>

        {/* ── T-86 — Sign out confirm modal ─────────────────────────────── */}
        <Modal
          visible={showSignOut}
          animationType={modalAnimation}
          transparent
          onRequestClose={() => setShowSignOut(false)}
        >
          <Pressable
            style={s.modalBackdrop}
            onPress={() => setShowSignOut(false)}
            accessibilityRole="button"
            accessibilityLabel="Close sign out modal"
          >
            <Pressable
              style={s.modalSheet}
              onPress={(e) => e.stopPropagation()}
              accessibilityLabel="Sign out confirmation dialog"
            >
              <Text style={[typography.displaySm, { marginBottom: 12 }]}>
                Are you sure?
              </Text>
              <Text style={[typography.body, { marginBottom: 22 }]}>
                You'll need to sign in to access your data on another device.
              </Text>
              <Pressable
                style={[
                  buttons.primary,
                  { backgroundColor: colors.danger, marginBottom: 8 },
                ]}
                onPress={() => setShowSignOut(false)}
                accessibilityRole="button"
                accessibilityLabel="Confirm sign out"
              >
                <Text style={buttons.primaryLabel}>Sign out</Text>
              </Pressable>
              <Pressable
                style={[buttons.outline, { width: '100%' }]}
                onPress={() => setShowSignOut(false)}
                accessibilityRole="button"
                accessibilityLabel="Cancel sign out"
              >
                <Text style={buttons.outlineLabel}>Cancel</Text>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────
const s = StyleSheet.create({
  // ── Header card ────────────────────────────────────────────────────────
  headerCard: {
    padding: 18,
    backgroundColor: colors.butter,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarGlyph: {
    fontFamily: fonts.displayItalic,
    fontSize: 28,
    color: colors.eucalyptusDeep,
    fontStyle: 'italic',
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    paddingVertical: 5,
    paddingHorizontal: 11,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  badgeLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    color: colors.eucalyptusDeep,
  },

  // ── Group ──────────────────────────────────────────────────────────────
  group: {
    marginBottom: 28,
  },
  groupTitle: {
    marginBottom: 10,
  },
  groupCard: {
    overflow: 'hidden',
  },
  groupCardOverride: {
    paddingHorizontal: 18,
    paddingVertical: 0,
  },

  // ── Setting rows ───────────────────────────────────────────────────────
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    minHeight: 44,
    gap: spacing.sm,
  },
  settingRowDisabled: {
    opacity: 0.5,
  },
  rowLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.ink,
    fontWeight: '500',
    flex: 1,
  },
  rowLabelDanger: {
    color: colors.danger,
    flex: 0,
  },
  rowPressed: {
    opacity: 0.7,
  },
  rowCaption: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.ink3,
    marginTop: 2,
    lineHeight: 15,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginHorizontal: -18,
  },
  textLink: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.eucalyptusDeep,
  },
  textLinkBtn: {
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },

  // ── Text size control ──────────────────────────────────────────────────
  textSizeControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  textSizeBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.mintMist,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textSizeBtnLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 18,
    color: colors.eucalyptusDeep,
    lineHeight: 22,
  },
  textSizeValue: {
    fontFamily: fonts.mono,
    fontSize: 12,
    color: colors.ink,
    minWidth: 36,
    textAlign: 'center',
  },

  // ── Stripe accents ─────────────────────────────────────────────────────
  stripSage: {
    // accent dot is rendered as the first child View at each usage site
  },
  accentDot: {
    width: 4,
    backgroundColor: colors.eucalyptus,
    borderRadius: 2,
    alignSelf: 'stretch',
    marginBottom: spacing.sm,
  },

  // ── Buttons ────────────────────────────────────────────────────────────
  buttonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  ghostBtn: {
    height: 44,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  ghostBtnLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.eucalyptusDeep,
  },

  // ── Modals ─────────────────────────────────────────────────────────────
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(27, 46, 37, 0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    padding: 24,
    paddingBottom: 40,
  },

  // ── Ora label ──────────────────────────────────────────────────────────
  oraLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  oraGlyph: {
    fontSize: 14,
    color: colors.eucalyptus,
  },
  oraLabelText: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 1.6,
    color: colors.eucalyptus,
    textTransform: 'uppercase',
  },
});
