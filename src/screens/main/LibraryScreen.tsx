import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { FileText, Plus } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import {
  getDocumentsService,
  uploadDocumentService,
} from '../../services/document.services';
import { Document } from '../../types/document.types';
import { pick, types } from '@react-native-documents/picker';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LibraryStackParamList } from '../../navigation/LibraryStack';

export default function LibraryScreen() {
  const navigation =
    useNavigation<NativeStackNavigationProp<LibraryStackParamList>>();
  const route = useRoute<any>();

  const { theme } = useTheme();

  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [uploading, setUploading] = useState(false);

  const fetchDocuments = useCallback(async () => {
    try {
      setError('');
      const data = await getDocumentsService();
      setDocuments(data.documents);
    } catch {
      setError('Could not load documents');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDocuments();
    }, [fetchDocuments]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchDocuments();
  };

  const handleUpload = useCallback(async () => {
    try {
      const [file] = await pick({
        type: [types.pdf, types.docx, types.plainText],
      });
      setUploading(true);
      await uploadDocumentService({
        uri: file.uri,
        name: file.name ?? 'document',
        type: file.type ?? 'application/octet-stream',
      });
      await fetchDocuments();
    } catch (err: any) {
      if (err?.code === 'DOCUMENT_PICKER_CANCELED') return;
      setError('Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [fetchDocuments]);

  useEffect(() => {
    if (route.params?.openPicker) {
      handleUpload();
      navigation.setParams({ openPicker: false });
    }
  }, [route.params?.openPicker]);

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderItem = ({ item }: { item: Document }) => (
    <Pressable
      onPress={() => {
        navigation.navigate('DocumentDetail', {
          documentId: item._id,
          title: item.title,
        });
      }}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: theme.card },
        pressed && { opacity: 0.7 },
      ]}
    >
      <View style={[styles.iconBox, { backgroundColor: theme.background }]}>
        <FileText size={22} color={theme.primary} />
      </View>
      <View style={styles.cardContent}>
        <Text
          style={[styles.cardTitle, { color: theme.textPrimary }]}
          numberOfLines={1}
        >
          {item.title}
        </Text>
        <Text style={[styles.cardMeta, { color: theme.textSecondary }]}>
          {formatSize(item.fileSize)} · {formatDate(item.createdAt)}
        </Text>
      </View>
    </Pressable>
  );

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

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.heading, { color: theme.textPrimary }]}>
          Library
        </Text>
        <Pressable
          onPress={handleUpload}
          disabled={uploading}
          style={({ pressed }) => [
            styles.addButton,
            { backgroundColor: theme.primary },
            pressed && { opacity: 0.85 },
          ]}
        >
          {uploading ? (
            <ActivityIndicator size="small" color={theme.white} />
          ) : (
            <Plus size={20} color={theme.white} />
          )}
        </Pressable>
      </View>

      <FlatList
        data={documents}
        keyExtractor={item => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          error ? (
            <View style={styles.centerBox}>
              <Text style={[styles.emptyText, { color: theme.error }]}>
                {error}
              </Text>
              <Pressable onPress={fetchDocuments}>
                <Text style={[styles.retry, { color: theme.primary }]}>
                  Tap to retry
                </Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.centerBox}>
              <FileText size={40} color={theme.textMuted} />
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>
                No documents yet
              </Text>
              <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                Upload your first document to get started
              </Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  heading: { fontSize: 22, fontWeight: '600' },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: { padding: 20, paddingTop: 8, flexGrow: 1 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 14,
    marginBottom: 10,
    gap: 12,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '500' },
  cardMeta: { fontSize: 12, marginTop: 2 },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: { fontSize: 16, fontWeight: '500', marginTop: 12 },
  emptyText: { fontSize: 13, marginTop: 4, textAlign: 'center' },
  retry: { fontSize: 13, fontWeight: '500', marginTop: 8 },
});
