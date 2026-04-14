/**
 * ProfileScreen — User profile, stats, streak, and settings
 * ─────────────────────────────────────────────────────
 * Features:
 * - User info with avatar
 * - Stats grid (today, this week, completed, pending)
 * - Overall productivity progress bar
 * - Zone breakdown with mini bar charts
 * - Streak / XP gamification display
 * - Edit Profile modal
 * - Manage Zones link
 * - Logout button
 *
 * BUG FIX: Uses tasks from useTasks() context instead of
 * independent Firestore query (fixes stale stats bug).
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import StatsCard from '../components/StatsCard';
import Modal from '../components/Modal';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';

// Zone colors for the breakdown bar charts
const ZONE_COLORS = {
  'Work Zone':     { accent: '#FF007F', bg: '#FFB3D9' },
  'Reading Zone':  { accent: '#00FFFF', bg: '#B3FFFF' },
  'Meeting Zone':  { accent: '#FFD500', bg: '#FFF2B3' },
  'Food Zone':     { accent: '#00FF88', bg: '#B3FFD6' },
  'Exam Zone':     { accent: '#FF007F', bg: '#FFB3D9' },
  'Personal Zone': { accent: '#00FFFF', bg: '#B3FFFF' },
};
const DEFAULT_ZONE = { accent: '#000000', bg: '#E6E6E6' };

export default function ProfileScreen() {
  const { user, userProfile, logout, updateUserProfileData } = useAuth();
  // FIX: Use tasks from context (not independent Firestore fetch)
  const { tasks, zones } = useTasks();
  const navigate = useNavigate();

  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: userProfile?.name || '',
    college: userProfile?.college || '',
    dept: userProfile?.dept || '',
  });
  const [saving, setSaving] = useState(false);

  // Compute stats from context tasks (always up-to-date, no stale data)
  const completed = tasks.filter((t) => t.status === 'completed');
  const pending = tasks.filter((t) => t.status === 'pending');

  // Today and this week completion stats
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const weekAgo = new Date(now.getTime() - 7 * 86400000);

  const completedToday = completed.filter((t) => {
    if (!t.completedAt?.toDate) return false;
    return t.completedAt.toDate().toISOString().split('T')[0] === todayStr;
  }).length;

  const completedWeek = completed.filter((t) => {
    if (!t.completedAt?.toDate) return false;
    return t.completedAt.toDate() >= weekAgo;
  }).length;

  // Per-zone breakdown
  const zoneCounts = {};
  tasks.forEach((t) => {
    if (!zoneCounts[t.zone]) zoneCounts[t.zone] = { total: 0, done: 0 };
    zoneCounts[t.zone].total++;
    if (t.status === 'completed') zoneCounts[t.zone].done++;
  });

  // Overall productivity percentage
  const total = tasks.length;
  const pct = total > 0 ? Math.round((completed.length / total) * 100) : 0;

  // Streak and XP from profile
  const streak = userProfile?.streak || 0;
  const xp = userProfile?.xp || 0;

  // User initial for avatar
  const initial = (userProfile?.name || user?.email || 'U')[0].toUpperCase();

  // Handle logout with confirmation
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
      navigate('/');
    }
  };

  // Save edited profile
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateUserProfileData({
        name: editForm.name.trim(),
        college: editForm.college.trim(),
        dept: editForm.dept.trim(),
      });
      setEditOpen(false);
    } catch (e) {
      alert('Error: ' + e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      {/* Dark header band */}
      <div className="profile-header-band">
        <h1>Profile</h1>
      </div>

      {/* Avatar and user info */}
      <div className="text-center" style={{ marginTop: -44, marginBottom: 'var(--space-xxl)' }}>
        <div style={{ display: 'inline-block' }}>
          <div className="avatar-ring">
            <div className="avatar">
              <span className="avatar-text">{initial}</span>
            </div>
          </div>
        </div>
        <h2 style={{ marginTop: 'var(--space-md)' }}>{userProfile?.name || 'Student'}</h2>
        <p className="text-muted" style={{ fontSize: 13, marginTop: 'var(--space-xs)' }}>{userProfile?.college || ''}</p>
        <p style={{ fontSize: 12, color: 'var(--color-accent-cyan)', marginTop: 'var(--space-xs)' }}>
          {user?.email}
        </p>
        {userProfile?.dept && (
          <p style={{ fontSize: 12, color: 'var(--color-accent-cyan)', marginTop: 'var(--space-xs)' }}>
            {userProfile.dept}{userProfile?.year ? ` \u00B7 Year ${userProfile.year}` : ''}
          </p>
        )}

        {/* Streak + XP */}
        <div className="flex justify-center gap-md mt-lg">
          <div className="streak-badge">
            {'\u2B50'} {streak} day streak
          </div>
          <div className="streak-badge" style={{ background: 'var(--color-accent-mint)' }}>
            <span className="xp-text">{xp}</span> XP
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="flex flex-wrap gap-md mb-xl" style={{ padding: '0 var(--space-lg)' }}>
        <StatsCard value={completedToday} label="Today" color="#00FF88" />
        <StatsCard value={completedWeek} label="This Week" color="#FF007F" />
        <StatsCard value={completed.length} label="Completed" color="#000000" />
        <StatsCard value={pending.length} label="Pending" color="#FFD500" />
      </div>

      {/* Overall productivity bar */}
      <div style={{ marginBottom: 'var(--space-xxl)' }}>
        <div className="flex justify-between mb-sm">
          <span style={{ fontSize: 13, fontWeight: 700 }}>Overall Productivity</span>
          <span className="text-mono" style={{ fontSize: 14, fontWeight: 800, color: pct >= 70 ? '#00FF88' : '#FFD500' }}>
            {pct}%
          </span>
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%`, backgroundColor: pct >= 70 ? '#00FF88' : '#FFD500' }} />
        </div>
      </div>

      {/* Zone breakdown */}
      {Object.keys(zoneCounts).length > 0 && (
        <div style={{ marginBottom: 'var(--space-xxl)' }}>
          <h4 style={{ marginBottom: 'var(--space-md)' }}>Tasks by Zone</h4>
          {Object.entries(zoneCounts).map(([name, counts]) => {
            const zc = ZONE_COLORS[name] || DEFAULT_ZONE;
            const zpct = counts.total > 0 ? Math.round((counts.done / counts.total) * 100) : 0;
            return (
              <div key={name} className="flex items-center gap-sm mb-md">
                <div style={{ width: 12, height: 12, background: zc.accent, border: '2px solid var(--color-border)' }} />
                <span style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{name}</span>
                <span className="text-mono text-muted" style={{ fontSize: 12, minWidth: 32, textAlign: 'right' }}>
                  {counts.done}/{counts.total}
                </span>
                <div style={{
                  width: 60, height: 8,
                  background: 'var(--color-bg-card)',
                  border: '2px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                }}>
                  <div style={{ height: 8, width: `${zpct}%`, background: zc.accent, borderRadius: 'var(--radius-md)' }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Settings row — Manage Zones */}
      <div className="mb-xl">
        <div className="settings-row" onClick={() => navigate('/manage-zones')}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>Manage Zones</span>
          <span className="text-muted" style={{ fontSize: 20 }}>{'\u203A'}</span>
        </div>
      </div>

      {/* Edit Profile */}
      <div className="mb-xl">
        <div className="settings-row" onClick={() => { setEditForm({ name: userProfile?.name || '', college: userProfile?.college || '', dept: userProfile?.dept || '' }); setEditOpen(true); }}>
          <span style={{ fontSize: 15, fontWeight: 600 }}>Edit Profile</span>
          <span className="text-muted" style={{ fontSize: 20 }}>{'\u203A'}</span>
        </div>
      </div>

      {/* Logout */}
      <button className="btn btn-accent btn-full" onClick={handleLogout}>
        Log Out
      </button>

      {/* Edit Profile Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Profile">
        <InputField label="Name" value={editForm.name} onChange={(v) => setEditForm((f) => ({ ...f, name: v }))} />
        <InputField label="College" value={editForm.college} onChange={(v) => setEditForm((f) => ({ ...f, college: v }))} />
        <InputField label="Department" value={editForm.dept} onChange={(v) => setEditForm((f) => ({ ...f, dept: v }))} />
        <PrimaryButton label="Save Changes" onClick={handleSaveProfile} loading={saving} style={{ marginTop: 'var(--space-lg)' }} />
      </Modal>
    </div>
  );
}
