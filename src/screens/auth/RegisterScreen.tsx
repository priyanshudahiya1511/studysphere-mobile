import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, Brain } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

export default function RegisterScreen() {
  const { theme } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = () => {
    if (!name || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setError('');
    console.log('Register:', name, email, password);
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={[styles.logo, { backgroundColor: theme.primary }]}>
            <Brain size={28} color={theme.white} />
          </View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Create account
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Start learning smarter today
          </Text>
        </View>

        <Text style={[styles.label, { color: theme.textSecondary }]}>Name</Text>
        <TextInput
          style={[
            styles.input,
            { borderColor: theme.border, color: theme.textPrimary },
          ]}
          value={name}
          onChangeText={setName}
          placeholder="Priyanshu Dahiya"
          placeholderTextColor={theme.textMuted}
        />

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

        <Text style={[styles.label, { color: theme.textSecondary }]}>
          Password
        </Text>
        <View style={styles.passwordWrapper}>
          <TextInput
            style={[
              styles.passwordInput,
              { borderColor: theme.border, color: theme.textPrimary },
            ]}
            value={password}
            onChangeText={setPassword}
            placeholder="Create a password"
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
        <View style={styles.passwordWrapper}>
          <TextInput
            style={[
              styles.passwordInput,
              { borderColor: theme.border, color: theme.textPrimary },
            ]}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            placeholder="Re-enter your password"
            placeholderTextColor={theme.textMuted}
            secureTextEntry={!showConfirm}
            autoCapitalize="none"
          />
          <Pressable
            onPress={() => setShowConfirm(!showConfirm)}
            style={styles.eyeButton}
            hitSlop={8}
          >
            {showConfirm ? (
              <EyeOff size={20} color={theme.textMuted} />
            ) : (
              <Eye size={20} color={theme.textMuted} />
            )}
          </Pressable>
        </View>

        {error ? (
          <Text style={[styles.error, { color: theme.error }]}>{error}</Text>
        ) : null}

        <Pressable
          onPress={handleRegister}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.primary },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={[styles.buttonText, { color: theme.white }]}>
            Sign up
          </Text>
        </Pressable>

        <Text style={[styles.footer, { color: theme.textSecondary }]}>
          Already have an account?{' '}
          <Text style={{ color: theme.primary }}>Log in</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '500',
  },
  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },
  label: {
    fontSize: 12,
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    marginBottom: 14,
  },
  passwordWrapper: {
    position: 'relative',
    marginBottom: 14,
  },
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
  error: {
    fontSize: 12,
    marginBottom: 12,
    marginTop: -4,
  },
  button: {
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
});
