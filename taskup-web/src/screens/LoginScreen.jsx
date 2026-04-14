/**
 * LoginScreen — Email/password login
 * ─────────────────────────────────────────────────────
 * Includes a working "Forgot Password" button that
 * sends a password reset email via Firebase Auth.
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import ThemeToggle from '../components/ThemeToggle';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { login, forgotPassword } = useAuth();
  const navigate = useNavigate();

  // Handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setMessage('Please enter both email and password.');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await login(email.trim(), password);
      navigate('/dashboard');
    } catch (error) {
      // Show user-friendly error messages for common Firebase auth errors
      const msg = error.code === 'auth/invalid-credential'
        ? 'Incorrect email or password.'
        : error.code === 'auth/user-not-found'
        ? 'No account found with this email.'
        : error.message;
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  // Handle forgot password — sends reset email via Firebase Auth
  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setMessage('Enter your email address above, then click Forgot Password.');
      return;
    }
    try {
      await forgotPassword(email.trim());
      setMessage('Password reset email sent! Check your inbox.');
    } catch (error) {
      setMessage('Error sending reset email. Check the email address.');
    }
  };

  return (
    <div className="auth-page">
      {/* Theme toggle */}
      <div style={{ position: 'absolute', top: 24, right: 24 }}>
        <ThemeToggle />
      </div>

      <div className="auth-card">
        {/* Back link */}
        <Link to="/" style={{ fontSize: 14, fontWeight: 600, display: 'block', marginBottom: 'var(--space-xxl)' }}>
          Back
        </Link>

        {/* Logo */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 'var(--space-xl)' }}>
          <div className="logo-mark">
            <span className="logo-letter">T</span>
            <span className="logo-bar" />
          </div>
        </div>

        <h1 className="text-center" style={{ marginBottom: 'var(--space-xs)' }}>Welcome Back</h1>
        <p className="text-center text-muted mb-xxl">Sign in to continue planning</p>

        {/* Error/success message */}
        {message && (
          <div style={{
            padding: 'var(--space-md)',
            marginBottom: 'var(--space-lg)',
            border: '2px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontSize: 13,
            fontWeight: 600,
            background: message.includes('sent') ? 'var(--color-priority-low-bg)' : 'var(--color-priority-urgent-bg)',
          }}>
            {message}
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleLogin} className="card card-elevated">
          <InputField label="Email" value={email} onChange={setEmail} placeholder="you@university.edu" type="email" />
          <InputField label="Password" value={password} onChange={setPassword} placeholder="Enter your password" type="password" />

          {/* Forgot password button */}
          <div style={{ textAlign: 'right', marginBottom: 'var(--space-xl)', marginTop: 'calc(-1 * var(--space-sm))' }}>
            <button
              type="button"
              onClick={handleForgotPassword}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--color-accent-pink)',
                fontWeight: 600,
                fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Forgot password?
            </button>
          </div>

          <PrimaryButton label="Log In" type="submit" loading={loading} />
        </form>

        {/* Sign up link */}
        <p className="text-center mt-xxl text-muted" style={{ fontSize: 14 }}>
          New here? <Link to="/signup">Create Account</Link>
        </p>
      </div>
    </div>
  );
}
