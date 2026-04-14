/**
 * Modal — Reusable overlay modal
 * ─────────────────────────────────────────────────────
 * Renders a backdrop + centered card.
 * Used for zone editor, edit profile, confirmations, etc.
 */

import React from 'react';

export default function Modal({ open, onClose, title, children }) {
  if (!open) return null;

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleBackdrop}>
      <div className="modal-card">
        {/* Modal header with title and close button */}
        <div className="flex justify-between items-center mb-xxl">
          <h3>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: 14,
              fontWeight: 600,
              color: 'var(--color-text-muted)',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
