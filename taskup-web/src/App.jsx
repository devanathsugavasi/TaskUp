/**
 * App.jsx — Root router configuration
 * ─────────────────────────────────────────────────────
 * Sets up React Router v6 with:
 * - Public routes: Splash, Login, SignUp
 * - Protected routes: Zone setup, Dashboard, AddTask, Calendar, Today, Profile, ManageZones
 * - Layout wraps all authenticated pages (sidebar + bottom nav)
 * - ErrorBoundary catches render crashes
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { TaskProvider } from './contexts/TaskContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingScreen from './components/LoadingScreen';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Screens
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import SignUpScreen from './screens/SignUpScreen';
import ZonesScreen from './screens/ZonesScreen';
import DashboardScreen from './screens/DashboardScreen';
import AddTaskScreen from './screens/AddTaskScreen';
import CalendarScreen from './screens/CalendarScreen';
import TodayScreen from './screens/TodayScreen';
import ProfileScreen from './screens/ProfileScreen';
import ManageZonesScreen from './screens/ManageZonesScreen';

// Inner component that can access auth loading state
function AppRoutes() {
  const { loading, user } = useAuth();

  // Show loading screen while Firebase resolves auth state
  if (loading) return <LoadingScreen />;

  return (
    <Routes>
      {/* Public routes — accessible without login */}
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <SplashScreen />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <LoginScreen />} />
      <Route path="/signup" element={user ? <Navigate to="/zones" replace /> : <SignUpScreen />} />

      {/* Zone setup (onboarding) — protected but no layout */}
      <Route
        path="/zones"
        element={<ProtectedRoute><ZonesScreen /></ProtectedRoute>}
      />

      {/* Main app routes — protected + wrapped in Layout */}
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="/add-task" element={<AddTaskScreen />} />
        <Route path="/calendar" element={<CalendarScreen />} />
        <Route path="/today" element={<TodayScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/manage-zones" element={<ManageZonesScreen />} />
      </Route>

      {/* Catch-all — redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <TaskProvider>
              <AppRoutes />
            </TaskProvider>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
