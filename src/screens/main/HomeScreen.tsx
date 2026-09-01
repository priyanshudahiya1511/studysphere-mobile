import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  FileText,
  Sparkles,
  HelpCircle,
  Layers,
  Upload,
  ChevronRight,
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getAnalyticsService } from '../../services/analytics.services';
import { Analytics } from '../../types/analytics.types';
import { HomeStackParamList } from '../../navigation/HomeStack';

export default function HomeScreen() {
  const { theme } = useTheme();
  const { user } = useAuth();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    try {
      const data = await getAnalyticsService();
      setAnalytics(data);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchAnalytics();
    }, [fetchAnalytics]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchAnalytics();
  };

  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const contentCards = [
    {
      icon: FileText,
      label: 'Documents',
      value: analytics?.content.documents ?? 0,
      onPress: () => navigation.getParent()?.navigate('Library'),
    },
    {
      icon: Sparkles,
      label: 'Summaries',
      value: analytics?.content.summaries ?? 0,
      onPress: () => navigation.navigate('SavedSummaries'),
    },
    {
      icon: HelpCircle,
      label: 'Quizzes',
      value: analytics?.content.quizzes ?? 0,
      onPress: () => navigation.navigate('SavedQuizzes'),
    },
    {
      icon: Layers,
      label: 'Flashcards',
      value: analytics?.content.flashcardSets ?? 0,
      onPress: () => navigation.navigate('SavedFlashcards'),
    },
  ];

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.greeting}>
          <Text style={[styles.hi, { color: theme.textPrimary }]}>
            Hi, {firstName} 👋
          </Text>
          <Text style={[styles.sub, { color: theme.textSecondary }]}>
            Ready to study?
          </Text>
        </View>

        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator color={theme.primary} />
          </View>
        ) : (
          <>
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Your content
            </Text>
            <View style={styles.grid}>
              {contentCards.map((card, i) => {
                const Icon = card.icon;
                return (
                  <Pressable
                    key={i}
                    onPress={card.onPress}
                    style={({ pressed }) => [
                      styles.card,
                      { backgroundColor: theme.card },
                      pressed && { opacity: 0.7 },
                    ]}
                  >
                    <View style={styles.cardTop}>
                      <Icon size={20} color={theme.primary} />
                      <ChevronRight size={16} color={theme.textMuted} />
                    </View>
                    <Text
                      style={[styles.cardValue, { color: theme.textPrimary }]}
                    >
                      {card.value}
                    </Text>
                    <Text
                      style={[styles.cardLabel, { color: theme.textSecondary }]}
                    >
                      {card.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Quick actions
        </Text>
        <Pressable
          onPress={() =>
            navigation.getParent()?.navigate('Library', {
              screen: 'LibraryList',
              params: { openPicker: true },
            })
          }
          style={({ pressed }) => [
            styles.actionPrimary,
            { backgroundColor: theme.primary },
            pressed && { opacity: 0.85 },
          ]}
        >
          <Upload size={20} color={theme.white} />
          <Text style={[styles.actionPrimaryText, { color: theme.white }]}>
            Upload a document
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  container: { padding: 20 },
  greeting: { marginBottom: 20 },
  hi: { fontSize: 22, fontWeight: '600' },
  sub: { fontSize: 13, marginTop: 2 },
  centerBox: { paddingVertical: 40, alignItems: 'center' },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 12,
    marginTop: 4,
  },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  card: { width: '47%', flexGrow: 1, borderRadius: 16, padding: 16 },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardValue: { fontSize: 26, fontWeight: '600', marginTop: 10 },
  cardLabel: { fontSize: 12, marginTop: 2 },
  chatRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  chatLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  chatLabel: { fontSize: 14 },
  actionPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    padding: 16,
  },
  actionPrimaryText: { fontSize: 14, fontWeight: '500' },
});
