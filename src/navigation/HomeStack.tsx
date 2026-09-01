import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/main/HomeScreen';
import SavedSummariesScreen from '../screens/main/SavedSummariesScreen';
import SavedSummaryViewScreen from '../screens/main/SavedSummaryViewScreen';
import SavedFlashcardsScreen from '../screens/main/SavedFlashcardsScreen';
import SavedFlashcardViewScreen from '../screens/main/SavedFlashcardViewScreen';
import { QuizResultItem } from '../types/quiz.types';
import SavedQuizzesScreen from '../screens/main/SavedQuizzesScreen';
import QuizScreen from '../screens/main/QuizScreen';
import QuizResultsScreen from '../screens/main/QuizResultsScreen';

export type HomeStackParamList = {
  HomeMain: undefined;
  SavedSummaries: undefined;
  SavedSummaryView: { summaryId: string };
  SavedFlashcards: undefined;
  SavedFlashcardView: { setId: string };
  SavedQuizzes: undefined;
  Quiz: { documentId?: string; quizId?: string };
  QuizResults: {
    score: number;
    total: number;
    percentage: number;
    results: QuizResultItem[];
  };
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="SavedSummaries" component={SavedSummariesScreen} />
      <Stack.Screen
        name="SavedSummaryView"
        component={SavedSummaryViewScreen}
      />
      <Stack.Screen name="SavedFlashcards" component={SavedFlashcardsScreen} />
      <Stack.Screen
        name="SavedFlashcardView"
        component={SavedFlashcardViewScreen}
      />
      <Stack.Screen name="SavedQuizzes" component={SavedQuizzesScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="QuizResults" component={QuizResultsScreen} />
    </Stack.Navigator>
  );
}
