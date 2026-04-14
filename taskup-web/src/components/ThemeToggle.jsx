/**
 * ThemeToggle — Dark/Light mode switch button
 * ─────────────────────────────────────────────────────
 * A square button that toggles between sun and moon symbols.
 * Uses geometric shapes instead of emojis.
 */

import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-label="Toggle theme"
    >
      {/* Sun symbol for dark mode, Moon symbol for light mode */}
      {isDark ? '\u2600' : '\u263E'}
    </button>
  );
}
