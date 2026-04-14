/**
 * InputField — Styled text input with label
 * ─────────────────────────────────────────────────────
 * Reusable form input with Neo-Brutalism styling.
 * Supports text, email, password, number, and textarea.
 */

import React from 'react';

export default function InputField({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  multiline = false,
  required = false,
  maxLength,
  disabled = false,
}) {
  const inputProps = {
    className: 'input-field',
    value,
    onChange: (e) => onChange(e.target.value),
    placeholder,
    required,
    maxLength,
    disabled,
  };

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      {multiline ? (
        <textarea {...inputProps} rows={3} style={{ resize: 'vertical', fontFamily: 'inherit' }} />
      ) : (
        <input {...inputProps} type={type} />
      )}
    </div>
  );
}
