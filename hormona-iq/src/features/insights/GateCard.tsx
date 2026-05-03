// GateCard — shown when the user hasn't logged enough cycle data
// to unlock the DRSP insights / C-PASS report.
// T-03 2-cycle gate empty state.

import type { ReactElement } from 'react';
import { Text, View } from 'react-native';

import { cards, typography } from '../../constants/styles';
import { fonts } from '../../constants/tokens';

export interface GateCardProps {
  hasEnoughData: boolean;
  cyclesLogged: number;
  minimumRequired: number;
  daysUntilUnlocked: number | null;
  /** Days still needed in the luteal phase of the current cycle. */
  moreLutealNeeded: number;
  /** Days still needed in the follicular phase of the current cycle. */
  moreFolNeeded: number;
}

export function GateCard({
  cyclesLogged,
  moreLutealNeeded,
  moreFolNeeded,
}: GateCardProps): ReactElement {
  return (
    <View
      style={[
        cards.cardWarm,
        {
          borderLeftWidth: 3,
          borderLeftColor: '#E8C97A', // butterDeep token value
          padding: 22,
          marginBottom: 18,
        },
      ]}
    >
      <Text style={[typography.eyebrow, { marginBottom: 8 }]}>
        YOUR DRSP REPORT
      </Text>
      <Text style={[typography.body, { marginBottom: 8 }]}>
        Your DRSP report needs 2 cycles with at least 7 consecutive
        luteal-phase days and 5 consecutive follicular-phase days each.
      </Text>
      <Text style={[typography.caption, { fontSize: 13 }]}>
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
    </View>
  );
}
