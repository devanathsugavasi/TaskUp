// ============================================
// THEME HOOK - Dark/Light Mode with AsyncStorage
// Persists theme preference across app restarts
// FIX: Implemented for mobile using AsyncStorage
// ============================================

import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = '@taskup_theme';

export function useTheme() {
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);

  // Load saved theme from AsyncStorage on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_KEY);
        if (savedTheme) {
          setTheme(savedTheme);
        }
      } catch (err) {
        console.error('Error loading theme:', err);
      } finally {
        setLoading(false);
      }
    };
    loadTheme();
  }, []);

  // Toggle between light and dark theme
  const toggleTheme = useCallback(async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    try {
      await AsyncStorage.setItem(THEME_KEY, newTheme);
    } catch (err) {
      console.error('Error saving theme:', err);
    }
  }, [theme]);

  // Set a specific theme
  const setThemeMode = useCallback(async (mode) => {
    setTheme(mode);
    try {
      await AsyncStorage.setItem(THEME_KEY, mode);
    } catch (err) {
      console.error('Error saving theme:', err);
    }
  }, []);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setThemeMode,
    loading,
  };
}
