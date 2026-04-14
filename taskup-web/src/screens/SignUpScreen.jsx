/**
 * SignUpScreen — New account registration
 * ─────────────────────────────────────────────────────
 * 7-field form with validation:
 * - Name, College, Department, Year (1-6), Email, Password, Confirm Password
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';

export default function SignUpScreen() {
  const [form, setForm] = useState({
    name: '', college: '', dept: '', year: '',
    email: '', password: '', confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signUp } = useAuth();
  const navigate = useNavigate();

  // Helper to update a single field in the form state
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  // Validate all fields and submit
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');

    // Required fields check
    if (!form.name || !form.email || !form.password || !form.college) {
      setError('Please fill in Name, College, Email, and Password.');
      return;
    }
    // Email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    // Password length check
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    // Password match check
    if (form.password !== form.confirmPassword) {
      setError('Password and Confirm Password do not match.');
      return;
    }
    // Year of study validation (1-6)
    if (form.year && (Number(form.year) < 1 || Number(form.year) > 6)) {
      setError('Year of study must be between 1 and 6.');
      return;
    }

    setLoading(true);
    try {
      await signUp(
        form.email.trim(),
        form.password,
        form.name.trim(),
        form.college.trim(),
        form.dept.trim(),
        form.year ? Number(form.year) : null,
      );
      navigate('/zones');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Back link */}
        <Link to="/" style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', display: 'block', marginBottom: 'var(--space-xxl)' }}>
          Back
        </Link>

        <h1 style={{ marginBottom: 'var(--space-xs)' }}>Create Account</h1>
        <p className="text-muted mb-xxl">Join TaskUp and start planning smarter</p>

        {/* Error message */}
        {error && (
          <div style={{
            padding: 'var(--space-md)',
            marginBottom: 'var(--space-lg)',
            border: '2px solid var(--color-accent-pink)',
            borderRadius: 'var(--radius-md)',
            fontSize: 13,
            fontWeight: 600,
            background: 'var(--color-priority-urgent-bg)',
          }}>
            {error}
          </div>
        )}

        {/* Registration form */}
        <form onSubmit={handleSignUp} className="card card-elevated">
          <InputField label="Full Name" value={form.name} onChange={(v) => set('name', v)} placeholder="Your full name" required />
          <InputField label="College / University" value={form.college} onChange={(v) => set('college', v)} placeholder="Your institution" required />
          <InputField label="Department / Course" value={form.dept} onChange={(v) => set('dept', v)} placeholder="e.g. Computer Science" />
          <InputField label="Year of Study" value={form.year} onChange={(v) => set('year', v)} placeholder="1 - 6" type="number" />
          <InputField label="Email Address" value={form.email} onChange={(v) => set('email', v)} placeholder="you@university.edu" type="email" required />
          <InputField label="Password" value={form.password} onChange={(v) => set('password', v)} placeholder="At least 6 characters" type="password" required />
          <InputField label="Confirm Password" value={form.confirmPassword} onChange={(v) => set('confirmPassword', v)} placeholder="Re-enter your password" type="password" required />
          <PrimaryButton label="Create Account" type="submit" loading={loading} style={{ marginTop: 'var(--space-sm)' }} />
        </form>

        {/* Login link */}
        <p className="text-center mt-xxl text-muted" style={{ fontSize: 14 }}>
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}
