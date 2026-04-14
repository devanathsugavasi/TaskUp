// ============================================
// THEME - Neo-Brutalism Design System
// Centralized design tokens for consistent styling
// ============================================

export const COLORS = {
  // Light mode
  light: {
    background: '#FFFFFF',
    backgroundSecondary: '#F5F5F5',
    card: '#FFFFFF',
    text: '#000000',
    textSecondary: '#333333',
    textMuted: '#666666',
    border: '#000000',
  },
  // Dark mode
  dark: {
    background: '#0D0F1A',
    backgroundSecondary: '#1A2240',
    card: '#1A2240',
    text: '#FFFFFF',
    textSecondary: '#E0E0E0',
    textMuted: '#A0A0A0',
    border: '#FFFFFF',
  },
  // Accent colors
  accent: {
    pink: '#FF007F',
    yellow: '#FFD500',
    mint: '#00FF88',
    cyan: '#00FFFF',
    violet: '#5B4FD4',
  },
  // Priority colors
  priority: {
    urgent: '#FF007F',
    high: '#FF4500',
    medium: '#FFD500',
    low: '#00FF88',
  },
  // Zone colors
  zones: {
    Work: '#FF007F',
    Reading: '#FFD500',
    Meeting: '#00FF88',
    Food: '#00FFFF',
    Exam: '#5B4FD4',
    Personal: '#FF6B6B',
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const RADIUS = {
  sm: 2,
  md: 4,
  lg: 8,
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const SHADOWS = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 6,
  },
};

export const THEME_MODE = {
  LIGHT: 'light',
  DARK: 'dark',
};

export default {
  COLORS,
  SPACING,
  RADIUS,
  FONT_SIZES,
  SHADOWS,
  THEME_MODE,
};
