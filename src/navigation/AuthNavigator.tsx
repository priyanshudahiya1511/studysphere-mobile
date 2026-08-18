import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamlist } from './type';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import OtpScreen from '../screens/auth/otpScreen';

const Stack = createNativeStackNavigator<AuthStackParamlist>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
      <Stack.Screen name="otp" component={OtpScreen} />
    </Stack.Navigator>
  );
}
