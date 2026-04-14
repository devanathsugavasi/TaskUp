/**
 * StatsCard — Numeric stat tile
 * ─────────────────────────────────────────────────────
 * Displays a single stat (value + label) in a bordered card.
 * Used in the Profile screen stats grid.
 */

import React from 'react';

export default function StatsCard({ value, label, color }) {
  return (
    <div className="stats-card">
      <div className="stats-value" style={{ color }}>{value}</div>
      <div className="stats-label">{label}</div>
    </div>
  );
}
