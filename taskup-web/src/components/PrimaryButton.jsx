/**
 * PrimaryButton — Main call-to-action button
 * ─────────────────────────────────────────────────────
 * Black background with white text. Shows "..." when loading.
 */

import React from 'react';

export default function PrimaryButton({
  label,
  onClick,
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  style = {},
}) {
  return (
    <button
      className={`btn btn-primary btn-full ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
      style={style}
    >
      {loading ? '...' : label}
    </button>
  );
}
