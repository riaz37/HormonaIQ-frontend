// OraInsightModal — botanical sheet for Ora's chart explanation.
// Calls POST /api/v1/ora/explain with PHI-scrubbed context and renders
// the insight in Ora's voice. Handles loading, quota, and error states.

import { useEffect, useState } from 'react';
import type { ReactElement } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { buttons, cards, typography } from '../../constants/styles';
import { colors, fonts, radius, spacing } from '../../constants/tokens';
import { OraMarkSvg } from '../../components/illustrations/OraMarkSvg';
import { buildOraContext } from '../../lib/ora-context';
import type { OraContext } from '../../lib/ora-context';
import { supabase } from '../../lib/supabase';
import { useAppStore } from '../../stores/useAppStore';
import { useLogStore } from '../../stores/useLogStore';

interface OraInsightModalProps {
  visible: boolean;
  onClose: () => void;
  cycleNumber: number;
  reduceMotion: boolean;
}

interface ExplainResponse {
  insight?: string;
  detail?: string;
}

type ViewState =
  | { kind: 'loading' }
  | { kind: 'insight'; text: string }
  | { kind: 'quota' }
  | { kind: 'error'; message: string };

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

async function fetchOraInsight(
  context: OraContext,
  cycleNumber: number,
): Promise<ViewState> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    if (!token) {
      return {
        kind: 'error',
        message: 'Please sign in again to ask Ora.',
      };
    }

    const res = await fetch(`${API_BASE}/api/v1/ora/explain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ context, cycle_number: cycleNumber }),
    });

    if (res.status === 429) {
      return { kind: 'quota' };
    }

    if (!res.ok) {
      return {
        kind: 'error',
        message: 'Ora couldn\'t reach you right now. Try again in a moment.',
      };
    }

    const body = (await res.json()) as ExplainResponse;
    if (!body.insight) {
      return {
        kind: 'error',
        message: 'Ora didn\'t have anything to share this time.',
      };
    }
    return { kind: 'insight', text: body.insight };
  } catch {
    return {
      kind: 'error',
      message: 'Network hiccup. Check your connection and try again.',
    };
  }
}

export function OraInsightModal({
  visible,
  onClose,
  cycleNumber,
  reduceMotion,
}: OraInsightModalProps): ReactElement {
  const conditions = useAppStore((s) => s.conditions);
  const cycleLen = useAppStore((s) => s.cycleLen);
  const lastPeriod = useAppStore((s) => s.lastPeriod);
  const entries = useLogStore((s) => s.entries);

  const [view, setView] = useState<ViewState>({ kind: 'loading' });

  useEffect(() => {
    if (!visible) return;
    let cancelled = false;
    setView({ kind: 'loading' });

    const logEntries = entries.map((e) => ({
      date: e.date,
      drspScores: e.drspScores,
      mood: e.mood,
      energy: e.energy,
      createdAt: e.createdAt,
    }));
    const context = buildOraContext(
      logEntries,
      cycleLen,
      [...conditions],
      lastPeriod,
    );

    fetchOraInsight(context, cycleNumber).then((next) => {
      if (!cancelled) setView(next);
    });

    return () => {
      cancelled = true;
    };
  }, [visible, cycleNumber, cycleLen, lastPeriod, conditions, entries]);

  return (
    <Modal
      visible={visible}
      animationType={reduceMotion ? 'none' : 'slide'}
      transparent
      onRequestClose={onClose}
    >
      <View style={s.backdrop}>
        <View style={s.sheet}>
          <View style={s.handle} />
          <View style={s.header}>
            <OraMarkSvg
              size={28}
              state={view.kind === 'loading' ? 'thinking' : 'insight'}
            />
            <Text style={s.eyebrow}>ORA</Text>
          </View>

          <ScrollView
            style={s.scroll}
            contentContainerStyle={s.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {view.kind === 'loading' && (
              <View style={s.statePad}>
                <ActivityIndicator color={colors.eucalyptus} size="small" />
                <Text style={s.statusText}>
                  Reading your last cycle gently…
                </Text>
              </View>
            )}

            {view.kind === 'insight' && (
              <>
                <Text style={s.heading}>What I noticed</Text>
                <Text style={s.body}>{view.text}</Text>
                <Text style={s.footnote}>
                  This is a reflection on your prospective DRSP record — not a
                  diagnosis or medical advice.
                </Text>
              </>
            )}

            {view.kind === 'quota' && (
              <View style={[cards.cardWarm, s.notice]}>
                <Text style={s.heading}>You&apos;ve used your three free insights this month.</Text>
                <Text style={s.body}>
                  Upgrade to Pro for unlimited Ora insights, plus PDF reports
                  for your clinician.
                </Text>
              </View>
            )}

            {view.kind === 'error' && (
              <View style={s.statePad}>
                <Text style={s.statusText}>{view.message}</Text>
              </View>
            )}
          </ScrollView>

          <Pressable
            style={[buttons.outline, { marginTop: spacing.md }]}
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Close Ora insight"
          >
            <Text style={buttons.outlineLabel}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlayModal,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: radius.lg,
    borderTopRightRadius: radius.lg,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 36,
    maxHeight: '88%',
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  eyebrow: {
    fontFamily: fonts.sansMedium,
    fontSize: 11,
    letterSpacing: 1.6,
    color: colors.eucalyptus,
    textTransform: 'uppercase',
  },
  scroll: {
    maxHeight: 480,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  heading: {
    ...typography.h2,
    marginBottom: 12,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 16,
    lineHeight: 24,
    color: colors.ink,
    marginBottom: 16,
  },
  footnote: {
    fontFamily: fonts.sans,
    fontSize: 12,
    lineHeight: 18,
    color: colors.ink3,
    marginTop: 4,
  },
  statePad: {
    paddingVertical: 32,
    alignItems: 'center',
    gap: 12,
  },
  statusText: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: colors.ink2,
    textAlign: 'center',
    lineHeight: 20,
  },
  notice: {
    padding: 20,
    borderLeftWidth: 3,
    borderLeftColor: colors.butterDeep,
  },
});
