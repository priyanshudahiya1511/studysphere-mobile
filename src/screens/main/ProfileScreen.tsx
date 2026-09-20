import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Switch,
  ScrollView,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Moon,
  Crown,
  Info,
  ChevronRight,
  LogOut,
  Brain,
  X,
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { theme, isDark, setPreference } = useTheme();
  const { user, logout } = useAuth();

  const [aboutVisible, setAboutVisible] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const initial = user?.name?.charAt(0)?.toUpperCase() ?? '?';

  const handleLogout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout();
    } catch {
      setLoggingOut(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.heading, { color: theme.textPrimary }]}>
          Profile
        </Text>

        <View style={styles.profileHeader}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text style={[styles.avatarText, { color: theme.white }]}>
              {initial}
            </Text>
          </View>
          <Text style={[styles.name, { color: theme.textPrimary }]}>
            {user?.name}
          </Text>
          <Text style={[styles.email, { color: theme.textSecondary }]}>
            {user?.email}
          </Text>
          <View style={[styles.planBadge, { backgroundColor: theme.card }]}>
            <Text style={[styles.planText, { color: theme.primary }]}>
              {user?.plan === 'premium' ? 'Premium plan' : 'Free plan'}
            </Text>
          </View>
        </View>

        <View style={styles.settingsList}>
          <View style={[styles.row, { backgroundColor: theme.card }]}>
            <View style={styles.rowLeft}>
              <Moon size={18} color={theme.textSecondary} />
              <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>
                Dark mode
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={val => setPreference(val ? 'dark' : 'light')}
              trackColor={{ true: theme.primary, false: theme.border }}
              thumbColor={theme.white}
            />
          </View>

          <View style={[styles.row, { backgroundColor: theme.card }]}>
            <View style={styles.rowLeft}>
              <Crown size={18} color={theme.textSecondary} />
              <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>
                Upgrade to Premium
              </Text>
            </View>
            <Text style={[styles.comingSoon, { color: theme.textMuted }]}>
              Coming soon
            </Text>
          </View>

          <Pressable
            onPress={() => setAboutVisible(true)}
            style={({ pressed }) => [
              styles.row,
              { backgroundColor: theme.card },
              pressed && { opacity: 0.7 },
            ]}
          >
            <View style={styles.rowLeft}>
              <Info size={18} color={theme.textSecondary} />
              <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>
                About
              </Text>
            </View>
            <ChevronRight size={18} color={theme.textMuted} />
          </Pressable>
        </View>

        <Pressable
          onPress={handleLogout}
          disabled={loggingOut}
          style={({ pressed }) => [
            styles.logoutButton,
            { borderColor: theme.error },
            (pressed || loggingOut) && { opacity: 0.7 },
          ]}
        >
          {loggingOut ? (
            <ActivityIndicator size="small" color={theme.error} />
          ) : (
            <>
              <LogOut size={18} color={theme.error} />
              <Text style={[styles.logoutText, { color: theme.error }]}>
                Log out
              </Text>
            </>
          )}
        </Pressable>
      </ScrollView>

      <Modal
        visible={aboutVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setAboutVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setAboutVisible(false)}
        >
          <Pressable
            style={[styles.aboutCard, { backgroundColor: theme.card }]}
          >
            <Pressable
              onPress={() => setAboutVisible(false)}
              style={styles.closeButton}
              hitSlop={8}
            >
              <X size={22} color={theme.textMuted} />
            </Pressable>

            <View
              style={[styles.aboutLogo, { backgroundColor: theme.primary }]}
            >
              <Brain size={36} color={theme.white} />
            </View>

            <Text style={[styles.aboutName, { color: theme.textPrimary }]}>
              StudySphere
            </Text>
            <Text style={[styles.aboutVersion, { color: theme.textSecondary }]}>
              Version 1.0.0
            </Text>
            <Text
              style={[styles.aboutDescription, { color: theme.textSecondary }]}
            >
              Your AI-powered study companion. Upload documents and instantly
              generate summaries, quizzes, and flashcards, or chat with your
              study material.
            </Text>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 20 },
  heading: { fontSize: 20, fontWeight: '500', marginBottom: 24 },
  profileHeader: { alignItems: 'center', marginBottom: 24 },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { fontSize: 28, fontWeight: '500' },
  name: { fontSize: 18, fontWeight: '500' },
  email: { fontSize: 13, marginTop: 2 },
  planBadge: {
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  planText: { fontSize: 12, fontWeight: '500' },
  settingsList: { gap: 8, marginBottom: 24 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rowLabel: { fontSize: 14 },
  comingSoon: { fontSize: 12 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1,
    borderRadius: 24,
    paddingVertical: 14,
  },
  logoutText: { fontSize: 14, fontWeight: '500' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  aboutCard: {
    width: '100%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  closeButton: { position: 'absolute', top: 12, right: 12 },
  aboutLogo: {
    width: 72,
    height: 72,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    marginTop: 8,
  },
  aboutName: { fontSize: 22, fontWeight: '600' },
  aboutVersion: { fontSize: 13, marginTop: 4 },
  aboutDescription: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginTop: 16,
  },
});
