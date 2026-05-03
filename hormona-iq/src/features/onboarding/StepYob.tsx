// StepYob — Step 1: Year of birth / age, block, and guardian sub-screens.
// Props-only — no direct store access.

import type { ReactElement } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

import { buttons, typography } from '../../constants/styles';
import { colors, fonts, radius, spacing } from '../../constants/tokens';
import type { StepKey } from './types';

// ─────────────────────────────────────────────
// Sprig SVG logo mark
// ─────────────────────────────────────────────

function Sprig({ size = 28 }: { size?: number }): ReactElement {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M 16 28 Q 16 18 16 6"
        stroke={colors.eucalyptus}
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <Path
        d="M 16 22 Q 9 21 7 14 Q 14 14 16 22"
        fill={colors.eucalyptus}
        opacity="0.85"
      />
      <Path
        d="M 16 17 Q 23 16 25 9 Q 18 9 16 17"
        fill={colors.eucalyptus}
        opacity="0.7"
      />
      <Path
        d="M 16 12 Q 11 11 10 6 Q 15 6 16 12"
        fill={colors.eucalyptus}
        opacity="0.55"
      />
      <Circle cx="16" cy="6" r="2.4" fill={colors.eucalyptus} />
    </Svg>
  );
}

// ─────────────────────────────────────────────
// SelectPicker — used for year of birth
// ─────────────────────────────────────────────

interface SelectOption<T extends string> {
  readonly value: T;
  readonly label: string;
}

function SelectPicker<T extends string>({
  options,
  value,
  onChange,
  placeholder,
  accessibilityLabel,
}: {
  options: readonly SelectOption<T>[];
  value: T | null;
  onChange: (v: T) => void;
  placeholder?: string;
  accessibilityLabel?: string;
}): ReactElement {
  return (
    <View style={selectStyles.container} accessibilityLabel={accessibilityLabel}>
      {placeholder && !value && (
        <Text style={selectStyles.placeholder}>{placeholder}</Text>
      )}
      {options.map((opt) => {
        const selected = value === opt.value;
        return (
          <TouchableOpacity
            key={opt.value}
            onPress={() => onChange(opt.value)}
            activeOpacity={0.7}
            style={[selectStyles.option, selected && selectStyles.optionSelected]}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            accessibilityLabel={opt.label}
          >
            <Text style={[selectStyles.optionLabel, selected && selectStyles.optionLabelSelected]}>
              {opt.label}
            </Text>
            {selected && <Text style={selectStyles.checkmark}>✓</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const selectStyles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    overflow: 'hidden',
    backgroundColor: colors.paper,
  },
  placeholder: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink3,
    padding: 12,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    minHeight: 44,
    backgroundColor: colors.paper,
  },
  optionSelected: {
    backgroundColor: colors.mintPale,
  },
  optionLabel: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink,
  },
  optionLabelSelected: {
    fontFamily: fonts.sansMedium,
    color: colors.eucalyptusDeep,
  },
  checkmark: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.eucalyptus,
  },
});

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

export interface StepYobProps {
  /** Current sub-step: 1 (main), 'block', or 'guardian' */
  subStep: 1 | 'block' | 'guardian';
  yob: number;
  yobOptions: readonly SelectOption<string>[];
  guardianEmail: string;
  onYobChange: (yob: number) => void;
  onGuardianEmailChange: (email: string) => void;
  /** Called when user taps Continue — shell decides next sub-step based on age */
  onSubmitDob: () => void;
  /** Continue from guardian screen */
  onGuardianContinue: () => void;
  onGoHome: () => void;
}

// ─────────────────────────────────────────────
// Sub-screens
// ─────────────────────────────────────────────

function MainScreen({
  yob,
  yobOptions,
  onYobChange,
  onSubmitDob,
  onGoHome,
}: Pick<StepYobProps, 'yob' | 'yobOptions' | 'onYobChange' | 'onSubmitDob' | 'onGoHome'>): ReactElement {
  return (
    <View style={s.centerColumn}>
      <View style={s.sprigWrap}>
        <Sprig size={68} />
      </View>
      <Text style={[typography.display, s.displayCenter]}>
        You found us.
      </Text>
      <Text style={[typography.bodyL, s.bodyCenter, { marginBottom: 8 }]}>
        This isn't a period tracker. It isn't a fertility app.
      </Text>
      <Text style={[typography.bodyL, s.bodyCenter, { marginBottom: spacing.xl }]}>
        It's for the other weeks of the month — the ones no one else tracks.
      </Text>

      <View style={s.dobCard}>
        <Text style={[typography.eyebrow, { marginBottom: 10 }]}>
          Year of birth
        </Text>
        <SelectPicker<string>
          options={yobOptions}
          value={String(yob)}
          onChange={(v) => onYobChange(parseInt(v, 10))}
          accessibilityLabel="Select year of birth"
        />
        <Text style={[typography.caption, { marginTop: 8 }]}>
          We use age to tailor your safety resources. We don't share it.
        </Text>
      </View>

      <TouchableOpacity
        style={[buttons.primary, s.ctaFull, { marginTop: spacing.md }]}
        onPress={onSubmitDob}
        {...(Platform.OS === 'web' ? { onClick: onSubmitDob } : {})}
        accessibilityRole="button"
        accessibilityLabel="Continue"
        activeOpacity={0.85}
      >
        <Text style={buttons.primaryLabel}>Continue →</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={s.ghostBtn}
        onPress={onGoHome}
        accessibilityRole="button"
        accessibilityLabel="I have an account, go to home"
        activeOpacity={0.7}
      >
        <Text style={s.ghostBtnLabel}>I have an account</Text>
      </TouchableOpacity>
    </View>
  );
}

function BlockScreen(): ReactElement {
  return (
    <View style={s.centerColumn}>
      <Text style={[typography.eyebrow, { marginBottom: 12 }]}>
        AGE REQUIREMENT
      </Text>
      <Text style={[typography.display, s.displayCenter, { marginBottom: 18 }]}>
        You'll need to be a bit older.
      </Text>
      <Text style={[typography.bodyL, s.bodyCenter, { marginBottom: 18 }]}>
        HormonaIQ requires users to be 13 or older. We're sorry — please
        come back when you're older.
      </Text>
      <Text style={[typography.caption, s.bodyCenter]}>
        If you're concerned about symptoms, please talk to a parent,
        guardian, or a school nurse.
      </Text>
    </View>
  );
}

function GuardianScreen({
  guardianEmail,
  onGuardianEmailChange,
  onGuardianContinue,
}: Pick<StepYobProps, 'guardianEmail' | 'onGuardianEmailChange' | 'onGuardianContinue'>): ReactElement {
  return (
    <View style={s.maxColumn}>
      <Text style={[typography.eyebrow, { marginBottom: 8 }]}>
        PARENT / GUARDIAN CONSENT
      </Text>
      <Text style={[typography.display, { marginBottom: 14 }]}>
        One quick step before we go further.
      </Text>
      <Text style={[typography.body, { color: colors.ink2, marginBottom: 22 }]}>
        Because you're under 16, we need a parent or guardian's consent
        to keep your data. Send them a quick email and they'll be able to
        confirm.
      </Text>
      <Text style={[typography.eyebrow, { marginBottom: 8 }]}>
        Guardian email
      </Text>
      <TextInput
        style={s.textInput}
        value={guardianEmail}
        onChangeText={onGuardianEmailChange}
        placeholder="adult@email.com"
        placeholderTextColor={colors.ink3}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
        accessibilityLabel="Guardian email address"
      />
      <TouchableOpacity
        style={[
          buttons.primary,
          { marginTop: 22 },
          !guardianEmail && buttons.primaryDisabled,
        ]}
        onPress={onGuardianContinue}
        disabled={!guardianEmail}
        accessibilityRole="button"
        accessibilityLabel="Send consent email and continue"
        activeOpacity={0.85}
      >
        <Text style={buttons.primaryLabel}>Send consent email</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[s.ghostBtn, { marginTop: 10, alignSelf: 'center' }]}
        onPress={onGuardianContinue}
        accessibilityRole="button"
        accessibilityLabel="Handle consent later and continue"
        activeOpacity={0.7}
      >
        <Text style={s.ghostBtnLabel}>I'll handle this later</Text>
      </TouchableOpacity>
      <Text style={[typography.caption, { fontSize: 11, marginTop: 18 }]}>
        Until consent is confirmed, your data lives only on this device.
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────
// StepYob — exported component
// ─────────────────────────────────────────────

export function StepYob({
  subStep,
  yob,
  yobOptions,
  guardianEmail,
  onYobChange,
  onGuardianEmailChange,
  onSubmitDob,
  onGuardianContinue,
  onGoHome,
}: StepYobProps): ReactElement {
  if (subStep === 'block') {
    return <BlockScreen />;
  }

  if (subStep === 'guardian') {
    return (
      <GuardianScreen
        guardianEmail={guardianEmail}
        onGuardianEmailChange={onGuardianEmailChange}
        onGuardianContinue={onGuardianContinue}
      />
    );
  }

  return (
    <MainScreen
      yob={yob}
      yobOptions={yobOptions}
      onYobChange={onYobChange}
      onSubmitDob={onSubmitDob}
      onGoHome={onGoHome}
    />
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const s = StyleSheet.create({
  centerColumn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 520,
    alignSelf: 'center',
    width: '100%',
  },
  maxColumn: {
    maxWidth: 520,
    alignSelf: 'center',
    width: '100%',
  },
  displayCenter: {
    textAlign: 'center',
    marginBottom: 20,
  },
  bodyCenter: {
    textAlign: 'center',
    color: colors.ink2,
  },
  dobCard: {
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: radius.md,
    padding: 20,
    marginBottom: 16,
    width: '100%',
  },
  sprigWrap: {
    alignSelf: 'center',
    marginBottom: 32,
  },
  ghostBtn: {
    height: 44,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },
  ghostBtnLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 14,
    color: colors.eucalyptusDeep,
  },
  ctaFull: {
    width: '100%',
    maxWidth: 360,
  },
  textInput: {
    height: 48,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: 14,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.paper,
  },
});
