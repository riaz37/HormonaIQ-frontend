import React, { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { colors, fonts, radius } from '../../constants/tokens';

const FORMSPREE_URL = `https://formspree.io/f/${
  process.env.EXPO_PUBLIC_FORMSPREE_ID ?? 'placeholder'
}`;

type Status = 'idle' | 'loading' | 'success' | 'error';

function isValidEmail(value: string): boolean {
  return value.includes('@') && value.trim().length >= 3;
}

export function WaitlistForm() {
  const [email, setEmail] = useState<string>('');
  const [status, setStatus] = useState<Status>('idle');

  const handleSubmit = async (): Promise<void> => {
    if (!isValidEmail(email)) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);

    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({ email }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      // 429 is "rate limited" — must NOT be treated as success even if res.ok.
      if (res.ok && res.status !== 429) {
        setStatus('success');
        return;
      }

      setStatus('error');
    } catch {
      clearTimeout(timeout);
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <View style={styles.successCard} accessibilityLiveRegion="polite">
        <View style={styles.successDot}>
          <Text style={styles.successCheck}>{'✓'}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.successTitle}>You&apos;re on the list.</Text>
          <Text style={styles.successCaption}>
            Watch for your invitation.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.row}>
        <TextInput
          value={email}
          onChangeText={(v) => {
            setEmail(v);
            if (status === 'error') setStatus('idle');
          }}
          placeholder="you@email.com"
          placeholderTextColor={colors.ink3}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          inputMode="email"
          editable={status !== 'loading'}
          onSubmitEditing={handleSubmit}
          accessibilityLabel="Email address"
          style={styles.input}
        />

        <Pressable
          onPress={handleSubmit}
          disabled={status === 'loading'}
          accessibilityRole="button"
          accessibilityLabel="Join the waitlist"
          style={({ pressed }) => [
            styles.submit,
            status === 'loading' && { opacity: 0.7 },
            pressed && { opacity: 0.85 },
          ]}
        >
          {status === 'loading' ? (
            <ActivityIndicator color={colors.paper} />
          ) : (
            <Text style={styles.submitLabel}>Count me in</Text>
          )}
        </Pressable>
      </View>

      {status === 'error' ? (
        <View style={styles.errorRow} accessibilityLiveRegion="polite">
          <Text style={styles.errorText}>
            Something went wrong. Try again.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  input: {
    flexGrow: 1,
    flexBasis: 240,
    minWidth: 0,
    height: 50,
    paddingHorizontal: 16,
    fontFamily: fonts.sans,
    fontSize: 15,
    color: colors.ink,
    backgroundColor: colors.paper,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
  },
  submit: {
    minWidth: 180,
    height: 52,
    paddingHorizontal: 24,
    backgroundColor: colors.eucalyptus,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitLabel: {
    fontFamily: fonts.sansMedium,
    fontSize: 15,
    color: colors.paper,
    letterSpacing: 0.15,
  },
  errorRow: {
    marginTop: 12,
  },
  errorText: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.danger,
  },
  successCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    backgroundColor: colors.paper,
    borderRadius: radius.md,
  },
  successDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.eucalyptus,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successCheck: {
    color: colors.paper,
    fontFamily: fonts.sansSemibold,
    fontSize: 18,
    lineHeight: 20,
  },
  successTitle: {
    fontFamily: fonts.sansSemibold,
    fontSize: 15,
    color: colors.ink,
  },
  successCaption: {
    marginTop: 2,
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.ink3,
  },
});
