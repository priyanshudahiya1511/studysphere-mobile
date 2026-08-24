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
import { ArrowLeft } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import {
  createQuizService,
  submitQuizService,
} from '../../services/quiz.services';
import { Quiz } from '../../types/quiz.types';
import { LibraryStackParamList } from '../../navigation/LibraryStack';

type Props = NativeStackScreenProps<LibraryStackParamList, 'Quiz'>;

export default function QuizScreen({ navigation, route }: Props) {
  const { theme } = useTheme();
  const { documentId } = route.params;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const generateQuiz = useCallback(async () => {
    try {
      setError('');
      setLoading(true);
      const data = await createQuizService('document', documentId, 5);
      setQuiz(data.quiz);
      // initialize answers array with -1 (unanswered) for each question
      setAnswers(new Array(data.quiz.questions.length).fill(-1));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not generate quiz');
    } finally {
      setLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    generateQuiz();
  }, [generateQuiz]);

  const selectAnswer = (questionIndex: number, optionIndex: number) => {
    setAnswers(prev => {
      const next = [...prev];
      next[questionIndex] = optionIndex;
      return next;
    });
  };

  const allAnswered = answers.length > 0 && answers.every(a => a !== -1);

  const handleSubmit = async () => {
    if (!quiz || !allAnswered) return;
    try {
      setSubmitting(true);
      const result = await submitQuizService(quiz._id, answers);
      navigation.replace('QuizResults', {
        score: result.score,
        total: result.total,
        percentage: result.percentage,
        results: result.results,
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} hitSlop={8}>
          <ArrowLeft size={24} color={theme.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>
          Quiz
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <View style={styles.centerBox}>
          <ActivityIndicator color={theme.primary} size="large" />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Generating quiz...
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
          <Pressable onPress={generateQuiz}>
            <Text style={[styles.retry, { color: theme.primary }]}>
              Tap to retry
            </Text>
          </Pressable>
        </View>
      ) : quiz ? (
        <ScrollView contentContainerStyle={styles.content}>
          {quiz.questions.map((q, qIndex) => (
            <View key={qIndex} style={styles.questionBlock}>
              <Text style={[styles.questionNum, { color: theme.textMuted }]}>
                Question {qIndex + 1} of {quiz.questions.length}
              </Text>
              <Text style={[styles.questionText, { color: theme.textPrimary }]}>
                {q.question}
              </Text>

              {q.options.map((option, oIndex) => {
                const selected = answers[qIndex] === oIndex;
                return (
                  <Pressable
                    key={oIndex}
                    onPress={() => selectAnswer(qIndex, oIndex)}
                    style={[
                      styles.option,
                      {
                        backgroundColor: selected ? theme.primary : theme.card,
                        borderColor: selected ? theme.primary : theme.border,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        { color: selected ? theme.white : theme.textPrimary },
                      ]}
                    >
                      {option}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ))}

          <Pressable
            onPress={handleSubmit}
            disabled={!allAnswered || submitting}
            style={({ pressed }) => [
              styles.submitButton,
              {
                backgroundColor: allAnswered ? theme.primary : theme.border,
              },
              pressed && { opacity: 0.85 },
            ]}
          >
            <Text style={[styles.submitText, { color: theme.white }]}>
              {submitting
                ? 'Submitting...'
                : allAnswered
                ? 'Submit quiz'
                : `Answer all questions`}
            </Text>
          </Pressable>
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
  questionBlock: { marginBottom: 28 },
  questionNum: { fontSize: 12, marginBottom: 6 },
  questionText: { fontSize: 16, fontWeight: '500', marginBottom: 14 },
  option: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  optionText: { fontSize: 14 },
  submitButton: {
    borderRadius: 24,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitText: { fontSize: 15, fontWeight: '600' },
});
