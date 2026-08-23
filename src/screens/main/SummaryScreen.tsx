import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Sparkles } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import { generateSummaryService } from '../../services/summary.services';
import { Summary } from '../../types/summary.types';
import { LibraryStackParamList } from '../../navigation/LibraryStack';

type Props = NativeStackScreenProps<LibraryStackParamList, 'Summary'>;

export default function SummaryScreen({ navigation, route }: Props) {
  const { theme } = useTheme();
  const { documentId } = route.params;

  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSummary = useCallback(async () => {
    try {
      setError('');
      setLoading(true);
      const data = await generateSummaryService('document', documentId);
      setSummary(data.summary);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not generate summary');
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeft size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Summary
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator color={theme.primary} size="large" />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Generating summary...
          </Text>
          <Text style={[styles.loadingSub, { color: theme.textMuted }]}>
            This may take a few seconds
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centerBox}>
          <Text style={[styles.errorText, { color: theme.error }]}>
            {error}
          </Text>
          <Pressable onPress={fetchSummary}>
            <Text style={[styles.retry, { color: theme.primary }]}>
              Tap to retry
            </Text>
          </Pressable>
        </View>
      ) : summary ? (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.titleRow}>
            <Sparkles size={20} color={theme.primary} />
            <Text style={[styles.summaryTitle, { color: theme.textPrimary }]}>
              {summary.title}
            </Text>
          </View>

          <Text style={[styles.overview, { color: theme.textSecondary }]}>
            {summary.overview}
          </Text>

          {summary.sections?.map((section, i) => (
            <View key={i} style={styles.section}>
              <Text
                style={[styles.sectionHeading, { color: theme.textPrimary }]}
              >
                {section.heading}
              </Text>
              <Text
                style={[styles.sectionContent, { color: theme.textSecondary }]}
              >
                {section.content}
              </Text>
            </View>
          ))}

          {summary.keyPoints?.length > 0 && (
            <View style={styles.keyPointsBox}>
              <Text
                style={[styles.sectionHeading, { color: theme.textPrimary }]}
              >
                Key points
              </Text>
              {summary.keyPoints.map((point, i) => (
                <View key={i} style={styles.bulletRow}>
                  <Text style={[styles.bullet, { color: theme.primary }]}>
                    •
                  </Text>
                  <Text
                    style={[styles.bulletText, { color: theme.textSecondary }]}
                  >
                    {point}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '500',
    textAlign: 'center',
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: { fontSize: 15, fontWeight: '500', marginTop: 16 },
  loadingSub: { fontSize: 13, marginTop: 4 },
  errorText: { fontSize: 14, textAlign: 'center' },
  retry: { fontSize: 13, fontWeight: '500', marginTop: 8 },
  content: { padding: 20 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  summaryTitle: { flex: 1, fontSize: 20, fontWeight: '600' },
  overview: { fontSize: 14, lineHeight: 21, marginBottom: 20 },
  section: { marginBottom: 18 },
  sectionHeading: { fontSize: 15, fontWeight: '600', marginBottom: 6 },
  sectionContent: { fontSize: 14, lineHeight: 21 },
  keyPointsBox: { marginTop: 8 },
  bulletRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  bullet: { fontSize: 14, lineHeight: 21 },
  bulletText: { flex: 1, fontSize: 14, lineHeight: 21 },
});
