/**
 * LoadingScreen — Full-page loading spinner
 * ─────────────────────────────────────────────────────
 * Shown while Firebase resolves auth state on app startup,
 * or during any full-page loading state.
 */

import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      {/* Spinning square — Neo-Brutalism spinner */}
      <div className="spinner" />
      <p
        style={{
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          fontSize: 12,
        }}
      >
        Loading...
      </p>
    </div>
  );
}
