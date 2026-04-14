/**
 * EmptyState — No-data placeholder
 * ─────────────────────────────────────────────────────
 * Shows when a list has no items (no tasks, no zones, etc.)
 */

import React from 'react';

export default function EmptyState({ title, message }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">--</div>
      <div className="empty-state-title">{title}</div>
      <div className="empty-state-msg">{message}</div>
    </div>
  );
}
