import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/ThemeContext';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './src/navigation/AuthNavigator';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { ActivityIndicator, View } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import MainNavigator from './src/navigation/MainNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NetworkBanner from './src/components/NetworkBanner';
import { linking } from './src/navigation/linking';
import {
  getFcmToken,
  requestNotificationPermission,
} from './src/services/notifications';

function RootNavigator() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (user) {
      const setup = async () => {
        const granted = await requestNotificationPermission();
        if (granted) {
          const token = await getFcmToken();
          console.log('FCM TOKEN', token);
        }
      };
      setup();
    }
  }, [user]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return user ? <MainNavigator /> : <AuthNavigator />;
}

GoogleSignin.configure({
  webClientId:
    '68958329884-o8utk1eopsdt5um15oom7f716hkn5e62.apps.googleusercontent.com',
  iosClientId:
    '868958329884-dmjpjgguq0u8c39hudmt799m0nj5tf46.apps.googleusercontent.com',
});

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <NavigationContainer linking={linking}>
              <RootNavigator />
            </NavigationContainer>
            <NetworkBanner />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
