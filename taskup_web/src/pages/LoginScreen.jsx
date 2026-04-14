// ============================================
// LOGIN SCREEN
// Email/password authentication with forgot password functionality
// ============================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import InputField from '../components/InputField';
import Modal from '../components/Modal';
import './AuthScreen.css';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login, resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotError, setForgotError] = useState('');

  // Handle form submission for login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Provide user-friendly error messages
      const errorMessages = {
        'auth/invalid-email': 'Invalid email address format',
        'auth/user-disabled': 'This account has been disabled',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later',
        'auth/invalid-credential': 'Invalid email or password',
      };
      setError(errorMessages[err.code] || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Handle password reset request
  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotError('');
    setLoading(true);

    try {
      await resetPassword(forgotEmail);
      setForgotSent(true);
    } catch (err) {
      const errorMessages = {
        'auth/invalid-email': 'Invalid email address format',
        'auth/user-not-found': 'No account found with this email',
      };
      setForgotError(errorMessages[err.code] || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-container">
        {/* Logo and branding */}
        <div className="auth-header">
          <div className="auth-logo">
            <div className="auth-logo-mark">
              <div className="auth-logo-bar" />
            </div>
            <span className="auth-logo-text">TaskUp</span>
          </div>
          <p className="auth-tagline">Plan clearly. Finish on time.</p>
        </div>

        {/* Login form */}
        <div className="auth-card">
          <h1 className="auth-title">Log In</h1>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}

            <InputField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@college.edu"
              required
              autoComplete="email"
            />

            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoComplete="current-password"
            />

            <button
              type="button"
              className="auth-forgot"
              onClick={() => setShowForgotModal(true)}
            >
              Forgot Password?
            </button>

            <PrimaryButton type="submit" fullWidth disabled={loading}>
              {loading ? 'Signing In...' : 'Log In'}
            </PrimaryButton>
          </form>

          <div className="auth-footer">
            <span>Don't have an account?</span>
            <Link to="/signup" className="auth-link">Create Account</Link>
          </div>
        </div>

        {/* Demo credentials hint */}
        <div className="auth-demo">
          <p>New here? The signup form will create your account and set up your zones.</p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={showForgotModal}
        onClose={() => {
          setShowForgotModal(false);
          setForgotSent(false);
          setForgotEmail('');
          setForgotError('');
        }}
        title="Reset Password"
        footer={
          !forgotSent && (
            <>
              <SecondaryButton onClick={() => setShowForgotModal(false)}>
                Cancel
              </SecondaryButton>
              <PrimaryButton onClick={handleForgotPassword} disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Email'}
              </PrimaryButton>
            </>
          )
        }
      >
        {forgotSent ? (
          <div className="forgot-success">
            <div className="forgot-success__icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
                <path d="M10 16L14 20L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <p>Password reset email sent! Check your inbox and follow the instructions.</p>
          </div>
        ) : (
          <>
            <p className="forgot-text">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            {forgotError && <div className="auth-error">{forgotError}</div>}
            <InputField
              label="Email"
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              placeholder="you@college.edu"
              required
            />
          </>
        )}
      </Modal>
    </div>
  );
}
