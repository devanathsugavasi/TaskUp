/**
 * ThemeContext — Dark / Light Mode Provider
 * ─────────────────────────────────────────────────────
 * Manages the app theme (dark or light) and persists
 * the preference to localStorage.
 *
 * How it works:
 * - Reads saved theme from localStorage on mount
 * - Sets `data-theme` attribute on <html> so CSS custom properties switch
 * - Provides toggleTheme() and isDark to all components
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

// Key used in localStorage to persist the theme choice
const STORAGE_KEY = 'taskup-theme';

export function ThemeProvider({ children }) {
  // Initialize from localStorage or default to 'light'
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || 'light';
    } catch {
      return 'light';
    }
  });

  // Whenever theme changes, update the DOM attribute and localStorage
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // localStorage might be unavailable in some contexts
    }
  }, [theme]);

  // Toggle between dark and light
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Convenience boolean for components that need to know the current mode
  const isDark = theme === 'dark';

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to access theme state
export const useTheme = () => useContext(ThemeContext);
