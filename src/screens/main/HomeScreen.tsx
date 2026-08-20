import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function HomeScreen() {
  const { theme } = useTheme();
  const { user, logout } = useAuth();
  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Hi, {user?.name?.split(' ')[0]} 👋
        </Text>
        <Text style={[styles.sub, { color: theme.textSecondary }]}>
          Home dashboard coming soon
        </Text>
        <Pressable
          onPress={() => {
            logout();
          }}
        >
          <Text>LOGOUT</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 24, fontWeight: '600' },
  sub: { fontSize: 14, marginTop: 8 },
});
