import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';

import { supabase } from '../../src/lib/supabase';
import { buttons, typography } from '../../src/constants/styles';
import { colors, fonts, radius, spacing } from '../../src/constants/tokens';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) return;
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      router.replace('/(app)/home');
    } catch (err: any) {
      Alert.alert('Sign in failed', err.message ?? 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.inner}>
        <Text style={typography.display}>Welcome back</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          placeholderTextColor={colors.inkDisabled}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="password"
          placeholderTextColor={colors.inkDisabled}
        />
        <Pressable
          style={[buttons.primary, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel={loading ? 'Signing in' : 'Sign in'}
        >
          <Text style={buttons.primaryLabel}>{loading ? 'Signing in…' : 'Sign in'}</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/(auth)/signup')}
          accessibilityRole="button"
          accessibilityLabel="No account? Sign up"
        >
          <Text style={styles.link}>No account? Sign up</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.xl, gap: spacing.sm },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.card,
    paddingHorizontal: spacing.md,
    fontSize: 15,
    fontFamily: fonts.sans,
    color: colors.ink,
    backgroundColor: colors.paper,
  },
  buttonDisabled: { opacity: 0.6 },
  link: { textAlign: 'center', fontFamily: fonts.sans, color: colors.ink2, fontSize: 14, marginTop: spacing.sm },
});
