// GateCard — shown when the user hasn't logged enough cycle data
// to unlock the DRSP insights / C-PASS report.
// T-03 2-cycle gate empty state.

import type { ReactElement, ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

import { cards, typography } from '../../constants/styles';
import { colors, fonts, radius } from '../../constants/tokens';
import { SeedSproutSvg } from '../../components/illustrations/BotanicalEmpty';
import { purchasePro, checkProEntitlement } from '../../lib/revenuecat';
import { useSettingsStore } from '../../stores/useSettingsStore';

export interface GateCardProps {
  hasEnoughData: boolean;
  cyclesLogged: number;
  minimumRequired: number;
  daysUntilUnlocked: number | null;
  /** Days still needed in the luteal phase of the current cycle. */
  moreLutealNeeded: number;
  /** Days still needed in the follicular phase of the current cycle. */
  moreFolNeeded: number;
  /** Children rendered when the gate is bypassed (e.g. user is pro). */
  children?: ReactNode;
}

export function GateCard({
  cyclesLogged,
  moreLutealNeeded,
  moreFolNeeded,
  children,
}: GateCardProps): ReactElement {
  const isPro = useSettingsStore((s) => s.isPro);
  const setIsPro = useSettingsStore((s) => s.setIsPro);

  if (isPro && children) {
    return <>{children}</>;
  }

  const handleUpgrade = async (): Promise<void> => {
    const ok = await purchasePro();
    if (ok) {
      const verified = await checkProEntitlement();
      setIsPro(verified);
    }
  };

  return (
    <View
      style={[
        cards.cardWarm,
        {
          borderLeftWidth: 3,
          borderLeftColor: '#E8C97A',
          padding: 24,
          marginBottom: 16,
        },
      ]}
    >
      <View style={{ alignItems: 'flex-start', marginBottom: 16 }}>
        <SeedSproutSvg size={56} />
      </View>
      <Text style={[typography.eyebrow, { marginBottom: 8 }]}>
        YOUR DRSP REPORT
      </Text>
      <Text style={[typography.body, { marginBottom: 8 }]}>
        Your DRSP report needs 2 cycles with at least 7 consecutive
        luteal-phase days and 5 consecutive follicular-phase days each.
      </Text>
      <Text style={[typography.caption, { fontSize: 13, marginBottom: 16 }]}>
        Cycle{' '}
        <Text style={{ fontFamily: fonts.sansSemibold }}>
          {cyclesLogged + 1}
        </Text>{' '}
        · need{' '}
        <Text style={{ fontFamily: fonts.sansSemibold }}>
          {moreLutealNeeded}
        </Text>{' '}
        more luteal day{moreLutealNeeded === 1 ? '' : 's'} ·{' '}
        <Text style={{ fontFamily: fonts.sansSemibold }}>
          {moreFolNeeded}
        </Text>{' '}
        more follicular day{moreFolNeeded === 1 ? '' : 's'}.
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Upgrade to Pro"
        onPress={handleUpgrade}
        style={({ pressed }) => ({
          alignSelf: 'flex-start',
          paddingVertical: 10,
          paddingHorizontal: 18,
          borderRadius: radius.pill,
          backgroundColor: colors.eucalyptus,
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <Text
          style={{
            fontFamily: fonts.sansSemibold,
            fontSize: 14,
            color: colors.paper,
          }}
        >
          Upgrade to Pro
        </Text>
      </Pressable>
    </View>
  );
}
