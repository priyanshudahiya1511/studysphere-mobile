import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamlist } from '../../navigation/type';
import { useTheme } from '../../context/ThemeContext';
import { verifyForgotOtpService } from '../../services/auth.services';

type Props = NativeStackScreenProps<AuthStackParamlist, 'VerifyForgotOtp'>;

export default function VerifyForgotOtpScreen({ route, navigation }: Props) {
  const { theme } = useTheme();
  const { email } = route.params;

  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputs = useRef<Array<React.ComponentRef<typeof TextInput> | null>>([]);

  const handleChange = (text: string, index: number) => {
    const next = [...otp];
    next[index] = text;
    setOtp(next);
    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length !== 4) {
      setError('Please enter the 4-digit code');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const data = await verifyForgotOtpService(email, code);
      navigation.navigate('ResetPassword', { resetToken: data.resetToken });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Enter reset code
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          We sent a 4-digit code to {email}
        </Text>

        <View style={styles.otpRow}>
          {otp.map((digit, index) => (
            <TextInput
              key={index}
              ref={el => {
                inputs.current[index] = el;
              }}
              style={[
                styles.otpBox,
                {
                  borderColor: digit ? theme.primary : theme.border,
                  color: theme.textPrimary,
                },
              ]}
              value={digit}
              onChangeText={text => handleChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
              textAlign="center"
            />
          ))}
        </View>

        {error ? (
          <Text style={[styles.error, { color: theme.error }]}>{error}</Text>
        ) : null}

        <Pressable
          onPress={handleVerify}
          disabled={loading}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.primary },
            pressed && styles.buttonPressed,
            loading && styles.buttonDisabled,
          ]}
        >
          <Text style={[styles.buttonText, { color: theme.white }]}>
            {loading ? 'Verifying...' : 'Verify'}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: '500', textAlign: 'center' },
  subtitle: {
    fontSize: 13,
    marginTop: 6,
    marginBottom: 28,
    textAlign: 'center',
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  otpBox: {
    width: 56,
    height: 64,
    borderWidth: 1,
    borderRadius: 14,
    fontSize: 24,
    fontWeight: '500',
  },
  error: { fontSize: 12, marginBottom: 12, textAlign: 'center' },
  button: { borderRadius: 24, paddingVertical: 14, alignItems: 'center' },
  buttonPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { fontSize: 14, fontWeight: '500' },
});
