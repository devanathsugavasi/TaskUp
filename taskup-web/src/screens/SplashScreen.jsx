/**
 * SplashScreen — Landing page
 * ─────────────────────────────────────────────────────
 * The first page users see. Shows logo, tagline,
 * and Login / Create Account CTAs.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';

export default function SplashScreen() {
  return (
    <div className="auth-page">
      {/* Theme toggle in top right */}
      <div style={{ position: 'absolute', top: 24, right: 24 }}>
        <ThemeToggle />
      </div>

      <div className="auth-card" style={{ textAlign: 'center' }}>
        {/* Logo mark */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-xl)' }}>
          <div className="logo-mark" style={{ width: 80, height: 80 }}>
            <span className="logo-letter" style={{ fontSize: 42 }}>T</span>
            <span className="logo-bar" style={{ width: 20, height: 3, bottom: 16, right: 14 }} />
          </div>
        </div>

        {/* Wordmark */}
        <h1 style={{ fontSize: 42, letterSpacing: -1, marginBottom: 'var(--space-xs)' }}>
          TaskUp
        </h1>
        <p className="text-muted" style={{ marginBottom: 'var(--space-xxl)' }}>
          Smart Student Planner
        </p>

        {/* Divider */}
        <div className="divider" style={{ margin: '24px auto' }} />

        {/* Tagline */}
        <p style={{
          fontSize: 22,
          fontWeight: 300,
          fontStyle: 'italic',
          lineHeight: 1.5,
          marginBottom: 'var(--space-section)',
        }}>
          Plan clearly.<br />Finish on time.
        </p>

        {/* CTAs */}
        <div className="flex flex-col gap-md">
          <Link
            to="/login"
            className="btn btn-primary btn-full"
            style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="btn btn-secondary btn-full"
            style={{ textDecoration: 'none', display: 'flex', justifyContent: 'center' }}
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
