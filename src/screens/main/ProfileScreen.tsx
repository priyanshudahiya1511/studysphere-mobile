import React from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Switch,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Moon, Crown, Info, ChevronRight, LogOut } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const { theme, isDark, setPreference } = useTheme();
  const { user, logout } = useAuth();

  const initial = user?.name?.charAt(0)?.toUpperCase() ?? '?';

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

          <Pressable
            style={({ pressed }) => [
              styles.row,
              { backgroundColor: theme.card },
              pressed && { opacity: 0.7 },
            ]}
          >
            <View style={styles.rowLeft}>
              <Crown size={18} color={theme.textSecondary} />
              <Text style={[styles.rowLabel, { color: theme.textPrimary }]}>
                Upgrade to Premium
              </Text>
            </View>
            <ChevronRight size={18} color={theme.textMuted} />
          </Pressable>

          <Pressable
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
          onPress={logout}
          style={({ pressed }) => [
            styles.logoutButton,
            { borderColor: theme.error },
            pressed && { opacity: 0.7 },
          ]}
        >
          <LogOut size={18} color={theme.error} />
          <Text style={[styles.logoutText, { color: theme.error }]}>
            Log out
          </Text>
        </Pressable>
      </ScrollView>
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
});
