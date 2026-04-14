// ============================================
// EMPTY STATE COMPONENT
// Displayed when no content is available
// ============================================

import { PrimaryButton } from './Button';
import './EmptyState.css';

export default function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}) {
  return (
    <div className="empty-state">
      {icon && <div className="empty-state__icon">{icon}</div>}
      <h3 className="empty-state__title">{title}</h3>
      {message && <p className="empty-state__message">{message}</p>}
      {actionLabel && onAction && (
        <PrimaryButton onClick={onAction}>{actionLabel}</PrimaryButton>
      )}
    </div>
  );
}
