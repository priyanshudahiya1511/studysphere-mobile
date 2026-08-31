import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/main/HomeScreen';
import SavedSummariesScreen from '../screens/main/SavedSummariesScreen';
import SavedSummaryViewScreen from '../screens/main/SavedSummaryViewScreen';

export type HomeStackParamList = {
  HomeMain: undefined;
  SavedSummaries: undefined;
  SavedSummaryView: { summaryId: string };
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
    </Stack.Navigator>
  );
}
