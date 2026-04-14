/**
 * ZoneChip — Selectable zone pill
 * ─────────────────────────────────────────────────────
 * Used in AddTaskScreen for selecting which zone a task belongs to.
 */

import React from 'react';

export default function ZoneChip({ zone, selected, onPress }) {
  return (
    <button
      className={`zone-chip ${selected ? 'selected' : ''}`}
      onClick={onPress}
      style={selected ? {
        borderColor: zone.color,
        backgroundColor: zone.color + '15',
      } : {}}
    >
      <span className="zone-chip-dot" style={{ backgroundColor: zone.color }} />
      {zone.name}
    </button>
  );
}
