// ============================================
// INPUT FIELD COMPONENT
// Neo-Brutalism styled text input with label and error state
// ============================================

import './InputField.css';

export default function InputField({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  id,
  name,
  autoComplete,
  min,
  max,
  step,
}) {
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="input-field">
      {label && (
        <label className="input-field__label" htmlFor={inputId}>
          {label}
          {required && <span className="input-field__required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name || inputId}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        autoComplete={autoComplete}
        min={min}
        max={max}
        step={step}
        className={`input-field__input ${error ? 'input-field__input--error' : ''}`}
      />
      {error && (
        <span className="input-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
