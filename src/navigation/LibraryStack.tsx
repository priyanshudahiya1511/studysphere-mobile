import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LibraryScreen from '../screens/main/LibraryScreen';
import DocumentDetailScreen from '../screens/main/DocumentDetailScreen';
import PdfViewerScreen from '../screens/main/PdfViewerScreen';

export type LibraryStackParamList = {
  LibraryList: undefined;
  DocumentDetail: { documentId: string; title: string };
  PdfViewer: { fileUrl: string; title: string };
};

const Stack = createNativeStackNavigator<LibraryStackParamList>();

export default function LibraryStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LibraryList" component={LibraryScreen} />
      <Stack.Screen name="DocumentDetail" component={DocumentDetailScreen} />
      <Stack.Screen name="PdfViewer" component={PdfViewerScreen} />
    </Stack.Navigator>
  );
}
