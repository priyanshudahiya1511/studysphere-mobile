import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamlist } from '../../navigation/type';
import { useTheme } from '../../context/ThemeContext';
import { forgotPasswordService } from '../../services/auth.services';

type Props = NativeStackScreenProps<AuthStackParamlist, 'ForgotPassword'>;

export default function ForgotPasswordScreen({ navigation }: Props) {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setError('Please enter your email');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await forgotPasswordService(email);
      navigation.navigate('VerifyForgotOtp', { email });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Forgot password?
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Enter your email and we'll send a reset code
        </Text>

        <Text style={[styles.label, { color: theme.textSecondary }]}>
          Email
        </Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.border, color: theme.textPrimary },
          ]}
          value={email}
          onChangeText={setEmail}
          placeholder="you@example.com"
          placeholderTextColor={theme.textMuted}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {error ? (
          <Text style={[styles.error, { color: theme.error }]}>{error}</Text>
        ) : null}

        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.primary },
            pressed && styles.buttonPressed,
            loading && styles.buttonDisabled,
          ]}
        >
          <Text style={[styles.buttonText, { color: theme.white }]}>
            {loading ? 'Sending...' : 'Send code'}
          </Text>
        </Pressable>

        <Text style={[styles.footer, { color: theme.textSecondary }]}>
          Remembered it?{' '}
          <Text
            style={{ color: theme.primary }}
            onPress={() => navigation.navigate('Login')}
          >
            Back to login
          </Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '500' },
  subtitle: { fontSize: 13, marginTop: 4, marginBottom: 24 },
  label: { fontSize: 12, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 14,
  },
  error: { fontSize: 12, marginBottom: 12, textAlign: 'center' },
  button: { borderRadius: 24, paddingVertical: 14, alignItems: 'center' },
  buttonPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { fontSize: 14, fontWeight: '500' },
  footer: { fontSize: 12, textAlign: 'center', marginTop: 20 },
});
