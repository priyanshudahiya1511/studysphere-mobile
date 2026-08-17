export const colors = {
  light: {
    primary: '#0E9F6E',
    primaryDark: '#0B7D57',
    secondary: '#34D399',
    accent: '#F59E0B',

    background: '#FFFFFF',
    card: '#F1FBF6',

    textPrimary: '#0B2E22',
    textSecondary: '#5B7268',
    textMuted: '#9CB0A8',

    border: '#E2E8E5',

    success: '#0E9F6E',
    error: '#D64545',
    warning: '#F59E0B',

    white: '#FFFFFF',
  },
  dark: {
    primary: '#34D399',
    primaryDark: '#0E9F6E',
    secondary: '#6EE7B7',
    accent: '#FBBF24',

    background: '#0F1613',
    card: '#1A241F',

    textPrimary: '#ECFDF5',
    textSecondary: '#8BA99C',
    textMuted: '#5F7A6E',

    border: '#2A3A33',

    success: '#34D399',
    error: '#F87171',
    warning: '#FBBF24',

    white: '#FFFFFF',
  },
};

export type ThemeColors = typeof colors.light;
