import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/ThemeContext';
import LoginScreen from './src/screens/auth/LoginScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <LoginScreen />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
