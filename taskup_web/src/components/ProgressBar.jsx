// ============================================
// PROGRESS BAR COMPONENT
// Displays completion progress with percentage
// ============================================

import './ProgressBar.css';

export default function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  variant = 'default',
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={`progress-bar progress-bar--${variant}`}>
      {label && <span className="progress-bar__label">{label}</span>}
      <div className="progress-bar__track">
        <div
          className="progress-bar__fill"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showPercentage && (
        <span className="progress-bar__percentage">{Math.round(percentage)}%</span>
      )}
    </div>
  );
}
