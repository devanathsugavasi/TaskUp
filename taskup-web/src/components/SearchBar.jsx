/**
 * SearchBar — Search input with icon
 * ─────────────────────────────────────────────────────
 * Used on Dashboard to filter tasks by title or description.
 */

import React from 'react';

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="search-bar">
      <span className="search-icon">{'\u2315'}</span>
      <input
        className="input-field"
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}
