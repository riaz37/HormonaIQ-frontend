import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';

import { supabase } from '../../src/lib/supabase';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!email.trim() || password.length < 8) {
      Alert.alert('Check your details', 'Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({ email: email.trim(), password });
      if (error) throw error;
      Alert.alert('Check your email', 'Confirm your email address to continue.');
      router.replace('/(auth)/login');
    } catch (err: any) {
      Alert.alert('Sign up failed', err.message ?? 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.inner}>
        <Text style={styles.title}>Create account</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          placeholderTextColor="#9CA3AF"
        />
        <TextInput
          style={styles.input}
          placeholder="Password (8+ characters)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoComplete="new-password"
          placeholderTextColor="#9CA3AF"
        />
        <TouchableOpacity style={[styles.button, loading && styles.buttonDisabled]} onPress={handleSignup} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Creating account…' : 'Create account'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.link}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF8' },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 32, gap: 12 },
  title: { fontSize: 28, fontWeight: '600', color: '#1C1917', marginBottom: 8 },
  input: {
    height: 52, borderWidth: 1, borderColor: '#E7E5E4', borderRadius: 12,
    paddingHorizontal: 16, fontSize: 16, color: '#1C1917', backgroundColor: '#FFFFFF',
  },
  button: {
    height: 52, backgroundColor: '#2D5016', borderRadius: 12,
    alignItems: 'center', justifyContent: 'center', marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  link: { textAlign: 'center', color: '#6B7280', fontSize: 14, marginTop: 8 },
});
