import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { ArrowLeft, Layers, Trash2 } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import {
  getFlashcardSetsService,
  deleteFlashcardSetService,
} from '../../services/flashcard.services';
import { FlashcardSet } from '../../types/flashcard.types';
import { HomeStackParamList } from '../../navigation/HomeStack';

export default function SavedFlashcardsScreen() {
  const { theme } = useTheme();
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();

  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSets = useCallback(async () => {
    try {
      setError('');
      const data = await getFlashcardSetsService();
      setSets(data.flashcardSets);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not load flashcards');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchSets();
    }, [fetchSets]),
  );

  const handleDelete = async (id: string) => {
    const previous = sets;
    setSets(prev => prev.filter(s => s._id !== id));
    try {
      await deleteFlashcardSetService(id);
    } catch {
      setSets(previous);
    }
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  const renderRightActions = (id: string) => (
    <Pressable
      onPress={() => handleDelete(id)}
      style={[styles.deleteAction, { backgroundColor: theme.error }]}
    >
      <Trash2 size={22} color={theme.white} />
    </Pressable>
  );

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeft size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Flashcards
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator color={theme.primary} />
        </View>
      ) : (
        <FlatList
          data={sets}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <ReanimatedSwipeable
              renderRightActions={() => renderRightActions(item._id)}
              overshootRight={false}
            >
              <Pressable
                onPress={() =>
                  navigation.navigate('SavedFlashcardView', {
                    setId: item._id,
                  })
                }
                style={[styles.card, { backgroundColor: theme.card }]}
              >
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: theme.background },
                  ]}
                >
                  <Layers size={20} color={theme.primary} />
                </View>
                <View style={styles.cardContent}>
                  <Text
                    style={[styles.cardTitle, { color: theme.textPrimary }]}
                    numberOfLines={1}
                  >
                    {item.title || 'Untitled set'}
                  </Text>
                  <Text
                    style={[styles.cardMeta, { color: theme.textSecondary }]}
                  >
                    {item.cards.length} cards · {formatDate(item.createdAt)}
                  </Text>
                </View>
              </Pressable>
            </ReanimatedSwipeable>
          )}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                {error || 'No flashcard sets yet'}
              </Text>
            </View>
          }
        />
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
  listContent: { padding: 20, flexGrow: 1 },
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
  emptyBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyText: { fontSize: 14 },
  deleteAction: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 72,
    borderRadius: 14,
    marginBottom: 10,
    marginLeft: 8,
  },
});
