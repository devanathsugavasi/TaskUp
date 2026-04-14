// ============================================
// LAYOUT COMPONENT - App Shell with Navigation
// Wraps protected routes with bottom navigation bar
// ============================================

import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import './Layout.css';

export default function Layout() {
  const { theme, isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="layout" data-theme={theme}>
      {/* Main content area */}
      <main className="layout__content">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="layout__nav">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `layout__nav-link ${isActive ? 'layout__nav-link--active' : ''}`
          }
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
            <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
            <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
            <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
          </svg>
          <span>Tasks</span>
        </NavLink>

        <NavLink
          to="/calendar"
          className={({ isActive }) =>
            `layout__nav-link ${isActive ? 'layout__nav-link--active' : ''}`
          }
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
            <path d="M3 10H21" stroke="currentColor" strokeWidth="2"/>
            <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Calendar</span>
        </NavLink>

        <NavLink
          to="/add-task"
          className="layout__nav-link layout__nav-link--add"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Add</span>
        </NavLink>

        <NavLink
          to="/today"
          className={({ isActive }) =>
            `layout__nav-link ${isActive ? 'layout__nav-link--active' : ''}`
          }
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Today</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `layout__nav-link ${isActive ? 'layout__nav-link--active' : ''}`
          }
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
            <path d="M4 20C4 17.2386 7.58172 15 12 15C16.4183 15 20 17.2386 20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span>Profile</span>
        </NavLink>

        {/* Theme Toggle */}
        <button
          className="layout__nav-link layout__theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
          {isDark ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="2"/>
              <path d="M12 2V4M12 20V22M4 12H2M22 12H20M5.64 5.64L4.22 4.22M19.78 19.78L18.36 18.36M5.64 18.36L4.22 19.78M19.78 4.22L18.36 5.64" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
          <span>{isDark ? 'Light' : 'Dark'}</span>
        </button>
      </nav>
    </div>
  );
}
