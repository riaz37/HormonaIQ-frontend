// ─────────────────────────────────────────────────────────────────────────────
// CrisisTab — F19 · CRISIS SAFETY
// Tab id: 'crisis'
// ─────────────────────────────────────────────────────────────────────────────

import React, { useCallback } from 'react';
import {
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { cards, typography } from '../../constants/styles';
import { colors, fonts } from '../../constants/tokens';
import { MHeader } from './primitives';

// ─────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────

interface CrisisTier {
  tier: number;
  t: string;
  sub: string;
  icon: string;
  color: string;
}

const CRISIS_TIERS: CrisisTier[] = [
  {
    tier: 1,
    t: 'Grounding',
    sub: '60-second breath, 5-4-3-2-1 senses, cold water',
    icon: '◯',
    color: colors.mintMist,
  },
  {
    tier: 2,
    t: 'Reach out',
    sub: 'Text a chosen person from your safety plan',
    icon: '☎',
    color: colors.butter,
  },
  {
    tier: 3,
    t: 'Crisis line',
    sub: '988 Suicide & Crisis Lifeline · text or call',
    icon: '♡',
    color: colors.coralSoft,
  },
];

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function CrisisTab() {
  const handleTierPress = useCallback((tier: number) => {
    if (tier === 3) {
      Linking.openURL('tel:988').catch(() => {
        Alert.alert('Crisis Support', '988 Suicide & Crisis Lifeline\nCall or text: 988');
      });
    }
  }, []);

  return (
    <View>
      <MHeader
        eyebrow="F19 · CRISIS SAFETY"
        title="You are "
        titleAccent="not alone"
        sub="Three tiers, no alarms. You decide what helps."
      />
      {CRISIS_TIERS.map((t) => (
        <TouchableOpacity
          key={t.tier}
          style={[
            cards.cardWarm,
            s.crisisTile,
            { backgroundColor: t.color },
          ]}
          onPress={() => handleTierPress(t.tier)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={`Crisis tier ${t.tier}: ${t.t}. ${t.sub}`}
        >
          <View style={s.crisisIcon}>
            <Text style={s.crisisIconText}>{t.icon}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.crisisTierLabel}>TIER {t.tier}</Text>
            <Text style={s.crisisTierTitle}>{t.t}</Text>
            <Text style={s.crisisTierSub}>{t.sub}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <Text style={[typography.caption, { marginTop: 14, lineHeight: 20 }]}>
        This appears automatically during your historical high-severity luteal
        window. You are also in control: tap "I'm not okay" anytime from Home.
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const s = StyleSheet.create({
  crisisTile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    marginBottom: 8,
    minHeight: 76,
  },
  crisisIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crisisIconText: {
    fontSize: 18,
  },
  crisisTierLabel: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: 'rgba(0,0,0,0.55)',
    marginBottom: 2,
  },
  crisisTierTitle: {
    fontFamily: fonts.sansSemibold,
    fontSize: 15,
    color: 'rgba(0,0,0,0.78)',
  },
  crisisTierSub: {
    fontFamily: fonts.sans,
    fontSize: 12,
    color: 'rgba(0,0,0,0.6)',
  },
});
