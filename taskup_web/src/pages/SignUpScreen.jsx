// ============================================
// SIGNUP SCREEN
// New user registration with profile information
// ============================================

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { PrimaryButton, SecondaryButton } from '../components/Button';
import InputField from '../components/InputField';
import './AuthScreen.css';

export default function SignUpScreen() {
  const navigate = useNavigate();
  const { signup } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    dept: '',
    year: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validate form data before submission
  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // College (optional but encouraged)
    if (!formData.college.trim()) {
      newErrors.college = 'College name is required';
    }

    // Department validation
    if (!formData.dept.trim()) {
      newErrors.dept = 'Department is required';
    }

    // Year validation (1-6 for college years)
    const yearNum = parseInt(formData.year, 10);
    if (!formData.year) {
      newErrors.year = 'Year is required';
    } else if (isNaN(yearNum) || yearNum < 1 || yearNum > 6) {
      newErrors.year = 'Enter a valid year (1-6)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      await signup(formData.email, formData.password, {
        name: formData.name.trim(),
        college: formData.college.trim(),
        dept: formData.dept.trim(),
        year: parseInt(formData.year, 10),
      });
      // After signup, user will be redirected via auth state change
      navigate('/dashboard');
    } catch (err) {
      const errorMessages = {
        'auth/email-already-in-use': 'An account with this email already exists',
        'auth/invalid-email': 'Invalid email address format',
        'auth/weak-password': 'Password is too weak. Use at least 6 characters',
        'auth/network-request-failed': 'Network error. Please check your connection',
      };
      setAuthError(errorMessages[err.code] || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-container auth-container--signup">
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

        {/* Signup form */}
        <div className="auth-card auth-card--wide">
          <h1 className="auth-title">Create Account</h1>

          <form onSubmit={handleSubmit} className="auth-form">
            {authError && <div className="auth-error">{authError}</div>}

            <div className="auth-form-row">
              <InputField
                label="Full Name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Alex Johnson"
                required
                error={errors.name}
                autoComplete="name"
              />

              <InputField
                label="College"
                name="college"
                type="text"
                value={formData.college}
                onChange={handleChange}
                placeholder="State University"
                required
                error={errors.college}
              />
            </div>

            <div className="auth-form-row">
              <InputField
                label="Department"
                name="dept"
                type="text"
                value={formData.dept}
                onChange={handleChange}
                placeholder="Computer Science"
                required
                error={errors.dept}
              />

              <InputField
                label="Year"
                name="year"
                type="number"
                value={formData.year}
                onChange={handleChange}
                placeholder="1"
                required
                error={errors.year}
                min="1"
                max="6"
              />
            </div>

            <InputField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@college.edu"
              required
              error={errors.email}
              autoComplete="email"
            />

            <InputField
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              required
              error={errors.password}
              autoComplete="new-password"
            />

            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              required
              error={errors.confirmPassword}
              autoComplete="new-password"
            />

            <div className="auth-terms">
              By creating an account, you agree to our terms of service and privacy policy.
            </div>

            <PrimaryButton type="submit" fullWidth disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </PrimaryButton>
          </form>

          <div className="auth-footer">
            <span>Already have an account?</span>
            <Link to="/login" className="auth-link">Log In</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
