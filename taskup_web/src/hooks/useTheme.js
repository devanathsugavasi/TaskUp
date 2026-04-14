// ============================================
// THEME HOOK - Dark/Light Mode Management
// Persists theme preference to localStorage
// ============================================

import { useState, useEffect, useCallback } from 'react';

const THEME_KEY = 'taskup_theme';

export function useTheme() {
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(true);

  // Load saved theme from localStorage on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    setLoading(false);
  }, []);

  // Toggle between light and dark theme
  // Saves preference to localStorage for persistence
  const toggleTheme = useCallback(() => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  }, [theme]);

  // Set a specific theme
  const setThemeMode = useCallback((mode) => {
    setTheme(mode);
    localStorage.setItem(THEME_KEY, mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, []);

  return {
    theme,
    isDark: theme === 'dark',
    toggleTheme,
    setThemeMode,
    loading,
  };
}
