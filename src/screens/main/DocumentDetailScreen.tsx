import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  FileText,
  Sparkles,
  HelpCircle,
  Layers,
  MessageCircle,
} from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { getDocumentByIdService } from '../../services/document.services';
import { LibraryStackParamList } from '../../navigation/LibraryStack';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<LibraryStackParamList, 'DocumentDetail'>;

export default function DocumentDetailScreen({ navigation, route }: Props) {
  const { theme } = useTheme();
  const { documentId, title } = route.params;

  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDocument = useCallback(async () => {
    try {
      setError('');
      const data = await getDocumentByIdService(documentId);
      setDocument(data.document);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not load document');
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    fetchDocument();
  }, [fetchDocument]);

  const actions = [
    { icon: Sparkles, label: 'Summarize', color: theme.primary },
    { icon: HelpCircle, label: 'Quiz me', color: theme.primary },
    { icon: Layers, label: 'Flashcards', color: theme.primary },
    { icon: MessageCircle, label: 'Ask AI', color: theme.primary },
  ];

  const handleView = async () => {
    if (!document?.fileUrl) return;
    const isPdf = document.fileType?.includes('pdf');
    if (isPdf) {
      navigation.navigate('PdfViewer', {
        fileUrl: document.fileUrl,
        title: document.title,
      });
    } else {
      await Linking.openURL(document.fileUrl);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeft size={24} color={theme.textPrimary} />
        </Pressable>
        <Text
          style={[styles.headerTitle, { color: theme.textPrimary }]}
          numberOfLines={1}
        >
          {title}
        </Text>
        <View style={{ width: 24 }} />
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
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={[styles.docCard, { backgroundColor: theme.card }]}>
            <View
              style={[styles.iconBox, { backgroundColor: theme.background }]}
            >
              <FileText size={28} color={theme.primary} />
            </View>
            <Text style={[styles.docTitle, { color: theme.textPrimary }]}>
              {document?.title}
            </Text>
            <Text style={[styles.docMeta, { color: theme.textSecondary }]}>
              {document?.fileType}
            </Text>
          </View>

          <Pressable
            onPress={handleView}
            style={({ pressed }) => [
              styles.viewButton,
              { backgroundColor: theme.primary },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={[styles.viewButtonText, { color: theme.white }]}>
              View document
            </Text>
          </Pressable>

          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            What would you like to do?
          </Text>

          <View style={styles.actionsGrid}>
            {actions.map((action, i) => {
              const Icon = action.icon;
              return (
                <Pressable
                  key={i}
                  style={({ pressed }) => [
                    styles.actionCard,
                    { backgroundColor: theme.card },
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <Icon size={24} color={action.color} />
                  <Text
                    style={[styles.actionLabel, { color: theme.textPrimary }]}
                  >
                    {action.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      )}
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
  centerBox: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 14 },
  content: { padding: 20 },
  docCard: {
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  docTitle: { fontSize: 18, fontWeight: '500', textAlign: 'center' },
  docMeta: { fontSize: 12, marginTop: 4 },
  sectionTitle: { fontSize: 15, fontWeight: '500', marginBottom: 12 },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '47%',
    flexGrow: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 14,
    gap: 8,
  },
  actionLabel: { fontSize: 14, fontWeight: '500' },
  viewButton: {
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 24,
  },
  viewButtonText: { fontSize: 14, fontWeight: '500' },
});
