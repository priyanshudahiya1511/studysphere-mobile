import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Eye, EyeOff, Brain } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';

export default function LoginScreen() {
  const { theme, isDark, setPreference } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    console.log('Login pressed:', email, password);
  };

  const toggleTheme = () => {
    setPreference(isDark ? 'light' : 'dark');
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={[styles.logo, { backgroundColor: theme.primary }]}>
            <Brain size={32} color={theme.white} />
          </View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Welcome back
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Log in to continue studying
          </Text>
        </View>

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
            placeholder="Enter your password"
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

        <Text style={[styles.forgot, { color: theme.primary }]}>
          Forgot password?
        </Text>

        <Pressable
          onPress={handleLogin}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.primary },
            pressed && styles.buttonPressed,
          ]}
        >
          <Text style={[styles.buttonText, { color: theme.white }]}>
            Log in
          </Text>
        </Pressable>

        <Text style={[styles.footer, { color: theme.textSecondary }]}>
          New here? <Text style={{ color: theme.primary }}>Create account</Text>
        </Text>

        <Pressable onPress={toggleTheme} style={styles.themeToggle}>
          <Text style={[styles.themeToggleText, { color: theme.textMuted }]}>
            Switch to {isDark ? 'light' : 'dark'} mode
          </Text>
        </Pressable>
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
    marginBottom: 28,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 18,
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
  forgot: {
    fontSize: 12,
    textAlign: 'right',
    marginBottom: 20,
  },
  button: {
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
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
  themeToggle: {
    marginTop: 28,
    alignItems: 'center',
  },
  themeToggleText: {
    fontSize: 12,
  },
});
