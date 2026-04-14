/**
 * ErrorBoundary — Catches rendering errors
 * ─────────────────────────────────────────────────────
 * Wraps the app to prevent white-screen crashes.
 * Shows a friendly Neo-Brutalism error message instead.
 */

import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="loading-screen">
          <div
            style={{
              width: 64, height: 64,
              border: '3px solid var(--color-border)',
              background: 'var(--color-accent-pink)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, fontWeight: 900, color: '#fff',
              boxShadow: 'var(--shadow-card)',
            }}
          >
            !
          </div>
          <h2 style={{ textTransform: 'uppercase' }}>Something Went Wrong</h2>
          <p className="text-muted" style={{ maxWidth: 400, textAlign: 'center' }}>
            An unexpected error occurred. Try refreshing the page.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Reload Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
