// ============================================
// PRIMARY BUTTON COMPONENT
// Neo-Brutalism styled button with hard shadow and hover effect
// ============================================

import './Button.css';

export default function PrimaryButton({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
}) {
  const buttonClass = [
    'btn',
    `btn-${variant}`,
    fullWidth ? 'btn-full' : '',
    loading ? 'btn-loading' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={buttonClass}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="btn-spinner" />
      ) : (
        children
      )}
    </button>
  );
}

// Secondary button variant
export function SecondaryButton(props) {
  return <PrimaryButton {...props} variant="secondary" />;
}

// Danger button variant
export function DangerButton(props) {
  return <PrimaryButton {...props} variant="danger" />;
}

// Mint button variant
export function MintButton(props) {
  return <PrimaryButton {...props} variant="mint" />;
}
