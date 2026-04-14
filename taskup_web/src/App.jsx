// ============================================
// APP COMPONENT - Main Router Setup
// Handles route protection and navigation structure
// ============================================

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoadingSpinner from './components/LoadingSpinner';
import Layout from './components/Layout';

// Pages
import SplashScreen from './pages/SplashScreen';
import LoginScreen from './pages/LoginScreen';
import SignUpScreen from './pages/SignUpScreen';
import ZonesScreen from './pages/ZonesScreen';
import DashboardScreen from './pages/DashboardScreen';
import AddTaskScreen from './pages/AddTaskScreen';
import CalendarScreen from './pages/CalendarScreen';
import TodayScreen from './pages/TodayScreen';
import ProfileScreen from './pages/ProfileScreen';
import ManageZonesScreen from './pages/ManageZonesScreen';

// Protected Route wrapper
// Redirects to login if user is not authenticated
function ProtectedRoute({ children, requireZones = false }) {
  const { user, loading, userProfile } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if user needs to complete onboarding (no zones)
  if (requireZones && (!userProfile || !userProfile.college)) {
    // Allow access to zones screen during onboarding
    return children;
  }

  return children;
}

// Auth Route wrapper
// Redirects to dashboard if user is already logged in
function AuthRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Loading..." />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Splash - auto-redirects based on auth state */}
      <Route path="/" element={<SplashScreen />} />

      {/* Auth routes - only accessible when logged out */}
      <Route
        path="/login"
        element={
          <AuthRoute>
            <LoginScreen />
          </AuthRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <AuthRoute>
            <SignUpScreen />
          </AuthRoute>
        }
      />

      {/* Protected routes with layout */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        {/* Zones onboarding - required for new users */}
        <Route
          path="/zones"
          element={
            <AuthRoute>
              <ZonesScreen />
            </AuthRoute>
          }
        />

        {/* Main app screens */}
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/add-task" element={<AddTaskScreen />} />
        <Route path="/calendar" element={<CalendarScreen />} />
        <Route path="/today" element={<TodayScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/manage-zones" element={<ManageZonesScreen />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
