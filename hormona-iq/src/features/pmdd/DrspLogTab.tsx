// ─────────────────────────────────────────────────────────────────────────────
// DrspLogTab — F9 · DRSP LOG SUMMARY
// Tab id: 'pmddPDF'
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

import { buttons, typography } from '../../constants/styles';
import { colors, fonts, radius } from '../../constants/tokens';
import { DRSPBarChart, MHeader } from './primitives';
import type { PMDDState } from './types';

// ─────────────────────────────────────────────
// Props
// ─────────────────────────────────────────────

interface DrspLogTabProps {
  state: PMDDState;
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

export default function DrspLogTab({ state }: DrspLogTabProps) {
  const sampleData = Array.from({ length: 28 }, (_, i) => ({
    day: i + 1,
    score:
      i < 5
        ? 4 + (i % 2)
        : i < 14
        ? 1 + (i % 2)
        : i < 18
        ? 2 + (i % 2)
        : Math.min(6, 3 + Math.floor((i - 17) / 2)),
  }));

  const handleDownload = useCallback(() => {
    const subject = encodeURIComponent('HormonaIQ DRSP Log Summary');
    const body = encodeURIComponent(
      'Please attach your generated PDF from the HormonaIQ web app.\n\n— from HormonaIQ',
    );
    Linking.openURL(`mailto:?subject=${subject}&body=${body}`).catch(() => {
      Alert.alert(
        'Email not available',
        'Please set up an email account to share your report.',
      );
    });
  }, []);

  const handleEmail = useCallback(() => {
    const subject = encodeURIComponent('HormonaIQ DRSP report');
    const body = encodeURIComponent(
      'Generate PDF first, then attach.\n\n— from HormonaIQ',
    );
    Linking.openURL(`mailto:?subject=${subject}&body=${body}`).catch(() => {
      Alert.alert(
        'Email not available',
        'Please set up an email account to share your report.',
      );
    });
  }, []);

  const loggedCount = Object.keys(state.entries).length;

  return (
    <View>
      <MHeader
        eyebrow="YOUR DRSP LOG SUMMARY"
        title="Physician-ready, "
        titleAccent="2 cycles deep."
        sub="Generated from your prospective DRSP record. Not a diagnosis."
      />
      <View style={[s.clinicalCard, { marginBottom: 14 }]}>
        <Text style={s.clinicalHeading}>
          DRSP LOG PREVIEW · {loggedCount} DAYS LOGGED
        </Text>
        <Text style={s.clinicalItalic}>
          Daily Record of Severity of Problems
        </Text>
        <DRSPBarChart data={sampleData} />
        <Text style={[typography.body, { fontSize: 11, marginTop: 12, lineHeight: 18 }]}>
          <Text style={{ fontFamily: fonts.sansSemibold }}>Pattern summary:</Text>{' '}
          Tap "Download PDF" to generate your physician-ready report from your
          prospective DRSP record. Not a diagnosis — bring to a licensed
          clinician.
        </Text>
        {!state.exportSI && (
          <Text style={s.exportNote}>
            Item 12 (suicidal ideation) excluded from this export.
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={[buttons.primary, s.fullWidth]}
        onPress={handleDownload}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Download DRSP PDF report"
      >
        <Text style={buttons.primaryLabel}>↓ Download PDF</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[buttons.outline, s.fullWidth, { marginTop: 8 }]}
        onPress={handleEmail}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel="Email DRSP report to my doctor"
      >
        <Text style={buttons.outlineLabel}>Email to my doctor</Text>
      </TouchableOpacity>
    </View>
  );
}

// ─────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────

const s = StyleSheet.create({
  fullWidth: {
    width: '100%',
  },
  clinicalCard: {
    backgroundColor: colors.creamWarm,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 18,
  },
  clinicalHeading: {
    fontFamily: fonts.sansSemibold,
    fontSize: 11,
    letterSpacing: 0.7,
    borderBottomWidth: 1,
    borderBottomColor: colors.ink,
    paddingBottom: 8,
    marginBottom: 10,
    color: colors.ink,
  },
  clinicalItalic: {
    fontFamily: fonts.displayItalic,
    fontStyle: 'italic',
    fontSize: 12,
    marginBottom: 10,
    color: colors.ink2,
  },
  exportNote: {
    fontFamily: fonts.sans,
    fontStyle: 'italic',
    fontSize: 10,
    marginTop: 8,
    color: colors.ink3,
  },
});
