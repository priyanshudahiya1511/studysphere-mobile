import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LibraryScreen from '../screens/main/LibraryScreen';
import DocumentDetailScreen from '../screens/main/DocumentDetailScreen';
import PdfViewerScreen from '../screens/main/PdfViewerScreen';
import SummaryScreen from '../screens/main/SummaryScreen';
import { QuizResultItem } from '../types/quiz.types';
import QuizScreen from '../screens/main/QuizScreen';
import QuizResultsScreen from '../screens/main/QuizResultsScreen';
import FlashcardScreen from '../screens/main/FlashcardScreen';
import ChatScreen from '../screens/main/ChatScreen';

export type LibraryStackParamList = {
  LibraryList: undefined;
  DocumentDetail: { documentId: string; title: string };
  PdfViewer: { fileUrl: string; title: string };
  Summary: { documentId: string };
  Quiz: { documentId: string };
  QuizResults: {
    score: number;
    total: number;
    percentage: number;
    results: QuizResultItem[];
  };
  Flashcards: { documentId: string };
  Chat: { documentId: string };
};

const Stack = createNativeStackNavigator<LibraryStackParamList>();

export default function LibraryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LibraryList" component={LibraryScreen} />
      <Stack.Screen name="DocumentDetail" component={DocumentDetailScreen} />
      <Stack.Screen name="PdfViewer" component={PdfViewerScreen} />
      <Stack.Screen name="Summary" component={SummaryScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="QuizResults" component={QuizResultsScreen} />
      <Stack.Screen name="Flashcards" component={FlashcardScreen} />
      <Stack.Screen name="Chat" component={ChatScreen} />
    </Stack.Navigator>
  );
}
