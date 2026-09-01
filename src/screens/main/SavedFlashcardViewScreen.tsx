import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../context/ThemeContext';
import { getFlashcardSetByIdService } from '../../services/flashcard.services';
import { FlashcardSet } from '../../types/flashcard.types';
import { HomeStackParamList } from '../../navigation/HomeStack';

type ViewRoute = RouteProp<HomeStackParamList, 'SavedFlashcardView'>;

export default function SavedFlashcardViewScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<ViewRoute>();
  const { setId } = route.params;

  const [set, setSet] = useState<FlashcardSet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const flipAnim = useRef(new Animated.Value(0)).current;

  const fetchSet = useCallback(async () => {
    try {
      setError('');
      const data = await getFlashcardSetByIdService(setId);
      setSet(data.flashcardSet);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not load flashcards');
    } finally {
      setLoading(false);
    }
  }, [setId]);

  useEffect(() => {
    fetchSet();
  }, [fetchSet]);

  const flipCard = () => {
    Animated.spring(flipAnim, {
      toValue: flipped ? 0 : 1,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
    setFlipped(!flipped);
  };

  const resetFlip = () => {
    flipAnim.setValue(0);
    setFlipped(false);
  };

  const goNext = () => {
    if (set && index < set.cards.length - 1) {
      resetFlip();
      setIndex(index + 1);
    }
  };

  const goPrev = () => {
    if (index > 0) {
      resetFlip();
      setIndex(index - 1);
    }
  };

  const frontRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backRotate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

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

  if (error || !set) {
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

  const card = set.cards[index];

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

      <View style={styles.counterRow}>
        <Text style={[styles.counter, { color: theme.textSecondary }]}>
          {index + 1} / {set.cards.length}
        </Text>
      </View>

      <View style={styles.cardArea}>
        <Pressable onPress={flipCard} style={styles.cardTouch}>
          <Animated.View
            style={[
              styles.card,
              { backgroundColor: theme.card },
              {
                transform: [{ rotateY: frontRotate }],
                backfaceVisibility: 'hidden',
              },
            ]}
          >
            <Text style={[styles.cardLabel, { color: theme.textMuted }]}>
              QUESTION
            </Text>
            <Text style={[styles.cardText, { color: theme.textPrimary }]}>
              {card?.front}
            </Text>
            <Text style={[styles.tapHint, { color: theme.textMuted }]}>
              Tap to flip
            </Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.card,
              { backgroundColor: theme.primary },
              {
                transform: [{ rotateY: backRotate }],
                backfaceVisibility: 'hidden',
              },
            ]}
          >
            <Text
              style={[styles.cardLabel, { color: 'rgba(255,255,255,0.7)' }]}
            >
              ANSWER
            </Text>
            <Text style={[styles.cardText, { color: theme.white }]}>
              {card?.back}
            </Text>
          </Animated.View>
        </Pressable>
      </View>

      <View style={styles.navRow}>
        <Pressable
          onPress={goPrev}
          disabled={index === 0}
          style={[styles.navButton, { opacity: index === 0 ? 0.4 : 1 }]}
        >
          <ChevronLeft size={24} color={theme.textPrimary} />
        </Pressable>
        <Pressable
          onPress={goNext}
          disabled={index === set.cards.length - 1}
          style={[
            styles.navButton,
            { opacity: index === set.cards.length - 1 ? 0.4 : 1 },
          ]}
        >
          <ChevronRight size={24} color={theme.textPrimary} />
        </Pressable>
      </View>
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
  counterRow: { alignItems: 'center', paddingVertical: 12 },
  counter: { fontSize: 14, fontWeight: '500' },
  cardArea: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  cardTouch: { height: 360 },
  card: {
    position: 'absolute',
    width: '100%',
    height: 360,
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 16,
  },
  cardText: {
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 28,
  },
  tapHint: { fontSize: 12, position: 'absolute', bottom: 20 },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
  navButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
