import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart } from 'react-native-gifted-charts';
import { FileText, Sparkles, Layers, HelpCircle } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { getAnalyticsService } from '../../services/analytics.services';
import { Analytics } from '../../types/analytics.types';

export default function AnalyticsScreen() {
  const { theme } = useTheme();

  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchAnalytics = useCallback(async () => {
    try {
      setError('');
      const data = await getAnalyticsService();
      setAnalytics(data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not load analytics');
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

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.safe, { backgroundColor: theme.background }]}
      >
        <View style={styles.centerBox}>
          <ActivityIndicator color={theme.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !analytics) {
    return (
      <SafeAreaView
        style={[styles.safe, { backgroundColor: theme.background }]}
      >
        <View style={styles.centerBox}>
          <Text style={[styles.errorText, { color: theme.error }]}>
            {error || 'No data'}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const { content, planner, quizPerformance } = analytics;

  const chartData = quizPerformance.recentAttempts.map(a => ({
    value: a.percentage,
  }));

  const libraryItems = [
    { icon: FileText, label: 'Documents', value: content.documents },
    { icon: Sparkles, label: 'Summaries', value: content.summaries },
    { icon: Layers, label: 'Flashcard sets', value: content.flashcardSets },
    { icon: HelpCircle, label: 'Quizzes', value: content.quizzes },
  ];

  const screenWidth = Dimensions.get('window').width;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={[styles.heading, { color: theme.textPrimary }]}>
          Analytics
        </Text>

        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={[styles.cardLabel, { color: theme.textSecondary }]}>
            Average quiz score
          </Text>
          <Text style={[styles.bigStat, { color: theme.primary }]}>
            {quizPerformance.averageScore}%
          </Text>

          {chartData.length > 1 ? (
            <View style={styles.chartWrap}>
              <LineChart
                data={chartData}
                width={screenWidth - 120}
                height={120}
                color={theme.primary}
                thickness={3}
                startFillColor={theme.primary}
                endFillColor={theme.background}
                startOpacity={0.3}
                endOpacity={0.05}
                areaChart
                hideDataPoints={false}
                dataPointsColor={theme.primary}
                hideRules
                hideYAxisText
                yAxisColor="transparent"
                xAxisColor="transparent"
                maxValue={100}
                initialSpacing={10}
              />
              <Text style={[styles.chartCaption, { color: theme.textMuted }]}>
                Recent attempts
              </Text>
            </View>
          ) : (
            <Text style={[styles.noChartText, { color: theme.textMuted }]}>
              Take more quizzes to see your trend
            </Text>
          )}
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.smallCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.smallStat, { color: theme.textPrimary }]}>
              {quizPerformance.totalAttempts}
            </Text>
            <Text style={[styles.smallLabel, { color: theme.textSecondary }]}>
              Attempts
            </Text>
          </View>
          <View style={[styles.smallCard, { backgroundColor: theme.card }]}>
            <Text style={[styles.smallStat, { color: theme.textPrimary }]}>
              {quizPerformance.bestScore}%
            </Text>
            <Text style={[styles.smallLabel, { color: theme.textSecondary }]}>
              Best score
            </Text>
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Your library
        </Text>
        {libraryItems.map((item, i) => {
          const Icon = item.icon;
          return (
            <View
              key={i}
              style={[styles.libraryRow, { backgroundColor: theme.card }]}
            >
              <View style={styles.libraryLeft}>
                <Icon size={18} color={theme.primary} />
                <Text
                  style={[styles.libraryLabel, { color: theme.textPrimary }]}
                >
                  {item.label}
                </Text>
              </View>
              <Text style={[styles.libraryValue, { color: theme.primary }]}>
                {item.value}
              </Text>
            </View>
          );
        })}

        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Task completion
        </Text>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.completionHeader}>
            <Text
              style={[styles.completionText, { color: theme.textSecondary }]}
            >
              {planner.completed} of {planner.total} done
            </Text>
            <Text style={[styles.completionPct, { color: theme.primary }]}>
              {planner.completionRate}%
            </Text>
          </View>
          <View
            style={[
              styles.progressTrack,
              { backgroundColor: theme.background },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: theme.primary,
                  width: `${planner.completionRate}%`,
                },
              ]}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20 },
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 14 },
  heading: { fontSize: 22, fontWeight: '600', marginBottom: 18 },
  card: { borderRadius: 16, padding: 16, marginBottom: 16 },
  cardLabel: { fontSize: 13, marginBottom: 4 },
  bigStat: { fontSize: 32, fontWeight: '600', marginBottom: 14 },
  chartWrap: { alignItems: 'center' },
  chartCaption: { fontSize: 11, marginTop: 8 },
  noChartText: { fontSize: 13, textAlign: 'center', paddingVertical: 20 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  smallCard: { flex: 1, borderRadius: 16, padding: 14 },
  smallStat: { fontSize: 22, fontWeight: '600' },
  smallLabel: { fontSize: 12, marginTop: 2 },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 12,
    marginTop: 4,
  },
  libraryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  libraryLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  libraryLabel: { fontSize: 14 },
  libraryValue: { fontSize: 15, fontWeight: '600' },
  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  completionText: { fontSize: 13 },
  completionPct: { fontSize: 13, fontWeight: '600' },
  progressTrack: { height: 8, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
});
