import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { AuthStackParamlist } from '../../navigation/type';
import { useTheme } from '../../context/ThemeContext';
import { resetPasswordService } from '../../services/auth.services';

type Props = NativeStackScreenProps<AuthStackParamlist, 'ResetPassword'>;

export default function ResetPasswordScreen({ route, navigation }: Props) {
  const { theme } = useTheme();
  const { resetToken } = route.params;

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!password || !confirm) {
      setError('Please fill in both fields');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setLoading(true);
    try {
      await resetPasswordService(resetToken, password);
      Alert.alert('Success', 'Password reset. Please log in.', [
        { text: 'OK', onPress: () => navigation.navigate('Login') },
      ]);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          New password
        </Text>
        <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
          Choose a strong password
        </Text>

        <Text style={[styles.label, { color: theme.textSecondary }]}>
          New password
        </Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={[
              styles.passwordInput,
              { borderColor: theme.border, color: theme.textPrimary },
            ]}
            value={password}
            onChangeText={setPassword}
            placeholder="Enter new password"
            placeholderTextColor={theme.textMuted}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeButton}
            hitSlop={8}
          >
            {showPassword ? (
              <EyeOff size={20} color={theme.textMuted} />
            ) : (
              <Eye size={20} color={theme.textMuted} />
            )}
          </Pressable>
        </View>

        <Text style={[styles.label, { color: theme.textSecondary }]}>
          Confirm password
        </Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.border, color: theme.textPrimary },
          ]}
          value={confirm}
          onChangeText={setConfirm}
          placeholder="Re-enter new password"
          placeholderTextColor={theme.textMuted}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />

        {error ? (
          <Text style={[styles.error, { color: theme.error }]}>{error}</Text>
        ) : null}

        <Pressable
          onPress={handleReset}
          disabled={loading}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.primary },
            pressed && styles.buttonPressed,
            loading && styles.buttonDisabled,
          ]}
        >
          <Text style={[styles.buttonText, { color: theme.white }]}>
            {loading ? 'Resetting...' : 'Reset password'}
          </Text>
        </Pressable>
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
  passwordWrapper: { position: 'relative', marginBottom: 14 },
  passwordInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingRight: 44,
    paddingVertical: 12,
    fontSize: 14,
  },
  eyeButton: {
    position: 'absolute',
    right: 12,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  error: { fontSize: 12, marginBottom: 12, textAlign: 'center' },
  button: { borderRadius: 24, paddingVertical: 14, alignItems: 'center' },
  buttonPressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { fontSize: 14, fontWeight: '500' },
});
