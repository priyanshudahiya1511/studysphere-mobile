import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, X } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useTheme } from '../../context/ThemeContext';
import { LibraryStackParamList } from '../../navigation/LibraryStack';

type Props = NativeStackScreenProps<LibraryStackParamList, 'QuizResults'>;

export default function QuizResultsScreen({ navigation, route }: Props) {
  const { theme } = useTheme();
  const { score, total, percentage, results } = route.params;

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.scoreCard, { backgroundColor: theme.card }]}>
          <Text style={[styles.scoreBig, { color: theme.primary }]}>
            {percentage}%
          </Text>
          <Text style={[styles.scoreSub, { color: theme.textPrimary }]}>
            You scored {score} out of {total}
          </Text>
        </View>

        {results.map((r, i) => (
          <View
            key={i}
            style={[styles.resultBlock, { backgroundColor: theme.card }]}
          >
            <View style={styles.resultHeader}>
              {r.isCorrect ? (
                <Check size={18} color={theme.success ?? theme.primary} />
              ) : (
                <X size={18} color={theme.error} />
              )}
              <Text
                style={[styles.resultQuestion, { color: theme.textPrimary }]}
              >
                {r.question}
              </Text>
            </View>

            {r.options.map((option, oIndex) => {
              const isCorrect = oIndex === r.correctAnswer;
              const isUserWrong = oIndex === r.userAnswer && !r.isCorrect;
              return (
                <View
                  key={oIndex}
                  style={[
                    styles.optionRow,
                    isCorrect && { backgroundColor: 'rgba(14,159,110,0.15)' },
                    isUserWrong && { backgroundColor: 'rgba(214,69,69,0.15)' },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      {
                        color: isCorrect
                          ? theme.primary
                          : isUserWrong
                          ? theme.error
                          : theme.textSecondary,
                      },
                    ]}
                  >
                    {option}
                  </Text>
                </View>
              );
            })}

            {r.explanation ? (
              <Text
                style={[styles.explanation, { color: theme.textSecondary }]}
              >
                {r.explanation}
              </Text>
            ) : null}
          </View>
        ))}

        <Pressable
          onPress={() => navigation.popToTop()}
          style={({ pressed }) => [
            styles.doneButton,
            { backgroundColor: theme.primary },
            pressed && { opacity: 0.85 },
          ]}
        >
          <Text style={[styles.doneText, { color: theme.white }]}>Done</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20 },
  scoreCard: {
    alignItems: 'center',
    padding: 28,
    borderRadius: 16,
    marginBottom: 24,
  },
  scoreBig: { fontSize: 44, fontWeight: '700' },
  scoreSub: { fontSize: 15, marginTop: 8 },
  resultBlock: { padding: 16, borderRadius: 14, marginBottom: 12 },
  resultHeader: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  resultQuestion: { flex: 1, fontSize: 15, fontWeight: '500' },
  optionRow: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 6,
  },
  optionText: { fontSize: 14 },
  explanation: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
    fontStyle: 'italic',
  },
  doneButton: {
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  doneText: { fontSize: 15, fontWeight: '600' },
});
