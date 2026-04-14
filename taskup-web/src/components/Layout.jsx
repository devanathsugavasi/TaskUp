/**
 * Layout — App shell with sidebar (desktop) and bottom nav (mobile)
 * ─────────────────────────────────────────────────────
 * Wraps all authenticated pages.
 * Desktop: left sidebar with nav links
 * Mobile: bottom tab navigation bar
 * Includes theme toggle in the sidebar footer.
 */

import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

// Navigation items with SVG-based icons (using unicode symbols, no emojis)
const NAV_ITEMS = [
  { path: '/dashboard', label: 'Planner',  icon: '\u2637' }, // trigram
  { path: '/calendar',  label: 'Calendar', icon: '\u2610' }, // ballot box
  { path: '/add-task',  label: '',          icon: '+',  isFab: true },
  { path: '/today',     label: 'Today',    icon: '\u2606' }, // star outline
  { path: '/profile',   label: 'Profile',  icon: '\u2302' }, // house
];

export default function Layout() {
  const location = useLocation();

  return (
    <div className="app-layout">
      {/* ── Desktop Sidebar ────────────────────────── */}
      <aside className="sidebar">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-mark">
            <span className="logo-letter">T</span>
            <span className="logo-bar" />
          </div>
          <span className="logo-text">TaskUp</span>
        </div>

        {/* Navigation links */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="nav-icon" style={item.isFab ? {
                background: 'var(--color-accent-yellow)',
                border: '2px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                width: 28, height: 28,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 900, fontSize: 18, color: '#000',
                boxShadow: 'var(--shadow-soft)',
              } : {}}>
                {item.icon}
              </span>
              {item.label && <span>{item.label}</span>}
              {item.isFab && <span>New Task</span>}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar footer — theme toggle */}
        <div className="sidebar-footer">
          <ThemeToggle />
        </div>
      </aside>

      {/* ── Main Content Area ──────────────────────── */}
      <main className="main-content">
        <Outlet />
      </main>

      {/* ── Mobile Bottom Navigation ───────────────── */}
      <nav className="bottom-nav">
        <div className="bottom-nav-items">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                item.isFab
                  ? 'fab-link'
                  : `bottom-nav-link ${isActive ? 'active' : ''}`
              }
            >
              <span className="nav-icon">{item.icon}</span>
              {!item.isFab && <span>{item.label}</span>}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
