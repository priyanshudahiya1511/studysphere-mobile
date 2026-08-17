import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';

export default function OtpScreen() {
  const { theme } = useTheme();
  const [otp, setOtp] = useState(['', '', '', '']);
  const inputs = useRef<Array<React.ComponentRef<typeof TextInput> | null>>([]);
  const handleChange = (text: string, index: number) => {
    const next = [...otp];
    next[index] = text;
    setOtp(next);

    if (text && index < 3) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    console.log('Verify OTP:', code);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: theme.card }]}>
            <Text style={[styles.iconText, { color: theme.primary }]}>✉</Text>
          </View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Verify your email
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            We sent a 4-digit code to your email
          </Text>
        </View>

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

        <Pressable
          onPress={handleVerify}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.primary },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={[styles.buttonText, { color: theme.white }]}>
            Verify
          </Text>
        </Pressable>

        <Text style={[styles.footer, { color: theme.textSecondary }]}>
          Didn't get it?{' '}
          <Text style={{ color: theme.primary }}>Resend code</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 28 },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  iconText: { fontSize: 26 },
  title: { fontSize: 22, fontWeight: '500' },
  subtitle: { fontSize: 13, marginTop: 6, textAlign: 'center' },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 28,
  },
  otpBox: {
    width: 56,
    height: 64,
    borderWidth: 1,
    borderRadius: 14,
    fontSize: 24,
    fontWeight: '500',
  },
  button: {
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  buttonText: { fontSize: 14, fontWeight: '500' },
  footer: { fontSize: 12, textAlign: 'center', marginTop: 20 },
});
