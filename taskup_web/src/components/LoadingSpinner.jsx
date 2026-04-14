// ============================================
// LOADING SPINNER COMPONENT
// Full-screen loading indicator
// ============================================

import './LoadingSpinner.css';

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="loading-screen">
      <div className="loading-spinner" />
      <p className="loading-message">{message}</p>
    </div>
  );
}
