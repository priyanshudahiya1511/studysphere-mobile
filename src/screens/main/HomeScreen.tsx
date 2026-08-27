import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Analytics } from '../../types/analytics.types';
import { getAnalyticsService } from '../../services/analytics.services';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FileText,
  Layers,
  HelpCircle,
  CheckSquare,
  Upload,
} from 'lucide-react-native';

export default function HomeScreen({ navigation }: any) {
  const { theme } = useTheme();
  const { user } = useAuth();

  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalysis = useCallback(async () => {
    try {
      setError('');
      const data = await getAnalyticsService();
      setAnalytics(data);
    } catch (err) {
      setError('Could not load your stats');
      console.log(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalysis();
  }, [fetchAnalysis]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAnalysis();
  };

  const firstName = user?.name?.split(' ')[0] ?? 'there';

  const stats = analytics
    ? [
        {
          icon: FileText,
          value: analytics.content.documents,
          label: 'Documents',
        },
        {
          icon: Layers,
          value: analytics.content.flashcardSets,
          label: 'Flashcard sets',
        },
        {
          icon: HelpCircle,
          value: `${analytics.quizPerformance.averageScore}%`,
          label: 'Avg quiz score',
        },
        {
          icon: CheckSquare,
          value: analytics.planner.pending,
          label: 'Tasks pending',
        },
      ]
    : [];

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
        ) : error ? (
          <View style={styles.centerBox}>
            <Text style={[styles.errorText, { color: theme.error }]}>
              {error}
            </Text>
            <Pressable onPress={fetchAnalysis}>
              <Text style={[styles.retry, { color: theme.primary }]}>
                Tap to retry
              </Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.statsGrid}>
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <View
                  key={i}
                  style={[styles.statCard, { backgroundColor: theme.card }]}
                >
                  <Icon size={20} color={theme.primary} />
                  <Text
                    style={[styles.statValue, { color: theme.textPrimary }]}
                  >
                    {stat.value}
                  </Text>
                  <Text
                    style={[styles.statLabel, { color: theme.textSecondary }]}
                  >
                    {stat.label}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Ouick actions
        </Text>
        <View style={styles.actions}>
          <Pressable
            onPress={() => {
              navigation.navigate('Library', {
                screen: 'LibraryList',
                params: { openPicker: true },
              });
            }}
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
        </View>
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
  errorText: { fontSize: 14, marginBottom: 8 },
  retry: { fontSize: 13, fontWeight: '500' },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '47%',
    flexGrow: 1,
    borderRadius: 16,
    padding: 16,
  },
  statValue: { fontSize: 24, fontWeight: '600', marginTop: 8 },
  statLabel: { fontSize: 12, marginTop: 2 },
  sectionTitle: { fontSize: 15, fontWeight: '500', marginBottom: 12 },
  actions: { gap: 8 },
  actionPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    padding: 16,
  },
  actionPrimaryText: { fontSize: 14, fontWeight: '500' },
  actionSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 14,
    padding: 16,
  },
  actionSecondaryText: { fontSize: 14, fontWeight: '500' },
});
