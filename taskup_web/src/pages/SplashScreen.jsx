// ============================================
// SPLASH SCREEN
// Initial loading screen with logo and navigation
// ============================================

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import './SplashScreen.css';

export default function SplashScreen() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  // Navigate based on auth state once loaded
  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="splash-screen">
      <div className="splash-content">
        {/* Logo */}
        <div className="splash-logo">
          <div className="splash-logo-mark">
            <div className="splash-logo-bar" />
          </div>
          <span className="splash-logo-text">TaskUp</span>
        </div>

        {/* Tagline */}
        <p className="splash-tagline">Plan clearly. Finish on time.</p>

        {/* Loading indicator */}
        <LoadingSpinner message="Loading..." />
      </div>
    </div>
  );
}
