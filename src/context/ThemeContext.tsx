import { createContext, ReactNode, useContext, useState } from 'react';
import { colors, ThemeColors } from '../theme/colors';
import { useColorScheme } from 'react-native';

type ThemePreference = 'light' | 'dark' | 'system';

type ThemeContextValue = {
  theme: ThemeColors;
  isDark: boolean;
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>('system');

  const activeMode =
    preference === 'system'
      ? systemScheme === 'dark'
        ? 'dark'
        : 'light'
      : preference;

  const isDark = activeMode === 'dark';
  const theme = isDark ? colors.dark : colors.light;

  return (
    <ThemeContext.Provider value={{ theme, isDark, preference, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
