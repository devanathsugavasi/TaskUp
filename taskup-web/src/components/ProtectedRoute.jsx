/**
 * ProtectedRoute — Auth guard wrapper
 * ─────────────────────────────────────────────────────
 * Wraps routes that require authentication.
 * If the user is not logged in, redirects to /login.
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();

  // If not authenticated, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
