import { Platform } from 'react-native';

export const COLORS = {
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  secondary: '#10b981',
  danger: '#f43f5e',
  warning: '#F59E0B',
  white: '#ffffff',
  black: '#000000',
};

export const LIGHT_THEME = {
  ...COLORS,
  background: '#f1f5f9',
  card: '#ffffff',
  text: '#0f172a',
  textLight: '#64748b',
  border: '#e2e8f0',
  dark: '#0f172a',
  glass: 'rgba(255, 255, 255, 0.8)',
};

export const DARK_THEME = {
  ...COLORS,
  primary: '#818cf8',
  background: '#020617',
  card: '#0f172a',
  text: '#f8fafc',
  textLight: '#94a3b8',
  border: '#1e293b',
  dark: '#f8fafc',
  white: '#0f172a',
  glass: 'rgba(15, 23, 42, 0.8)',
};

export const SIZES = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  h1: 32,
  h2: 24,
  h3: 20,
  h4: 18,
  body1: 16,
  body2: 14,
  caption: 12,
};

export const SHADOWS = {
  sm: {
    ...Platform.select({
      ios: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: `0px 2px 4px rgba(99, 102, 241, 0.1)`,
      },
    }),
  },
  md: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: `0px 10px 15px rgba(0, 0, 0, 0.15)`,
      },
    }),
  },
};
