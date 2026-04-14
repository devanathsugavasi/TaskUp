/**
 * SecondaryButton — Outlined secondary button
 * ─────────────────────────────────────────────────────
 * White/transparent background with border. Used for secondary actions.
 */

import React from 'react';

export default function SecondaryButton({
  label,
  onClick,
  loading = false,
  disabled = false,
  className = '',
  style = {},
}) {
  return (
    <button
      className={`btn btn-secondary btn-full ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      style={style}
    >
      {loading ? '...' : label}
    </button>
  );
}
