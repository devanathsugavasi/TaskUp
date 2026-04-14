// ============================================
// PROFILE SCREEN - User Stats and Profile Management
// Displays user info, stats, productivity, and zone breakdown
// ============================================

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import { PrimaryButton, SecondaryButton, DangerButton } from '../components/Button';
import InputField from '../components/InputField';
import Modal from '../components/Modal';
import ProgressBar from '../components/ProgressBar';
import './ProfileScreen.css';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { userProfile, logout, updateUserProfile } = useAuth();
  const { tasks, zones, getStats } = useTasks();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: userProfile?.name || '',
    college: userProfile?.college || '',
    dept: userProfile?.dept || '',
    year: userProfile?.year || 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get stats from TaskContext
  const stats = getStats();

  // Calculate streak (days with completed tasks)
  const streak = calculateStreak(tasks);

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile update
  const handleUpdateProfile = async () => {
    if (!editForm.name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await updateUserProfile({
        name: editForm.name.trim(),
        college: editForm.college.trim(),
        dept: editForm.dept.trim(),
        year: parseInt(editForm.year, 10) || 1,
      });
      setShowEditModal(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await logout();
      navigate('/login');
    }
  };

  return (
    <div className="profile-screen">
      <div className="profile-container">
        {/* Profile Header */}
        <header className="profile-header">
          <div className="profile-avatar">
            <span>{userProfile?.name?.charAt(0)?.toUpperCase() || '?'}</span>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{userProfile?.name || 'User'}</h1>
            <p className="profile-meta">
              {userProfile?.college || 'College'} | {userProfile?.dept || 'Department'}
            </p>
            <p className="profile-meta">{userProfile?.email || 'email@example.com'}</p>
          </div>
          <button
            className="profile-edit-btn"
            onClick={() => setShowEditModal(true)}
            aria-label="Edit profile"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M14 3L17 6L8 15H5V12L14 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </button>
        </header>

        {/* Streak & XP Section */}
        <section className="profile-streak">
          <div className="streak-card">
            <div className="streak-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 4L20 12L28 14L22 20L24 28L16 24L8 28L10 20L4 14L12 12L16 4Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="streak-info">
              <span className="streak-label">Current Streak</span>
              <span className="streak-value">{streak} {streak === 1 ? 'day' : 'days'}</span>
            </div>
          </div>
          <div className="xp-card">
            <div className="xp-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="12" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 8V16L20 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="xp-info">
              <span className="xp-label">Total XP</span>
              <span className="xp-value">{stats.completed * 10}</span>
            </div>
          </div>
        </section>

        {/* Overall Progress */}
        <section className="profile-section">
          <h2 className="profile-section-title">Overall Progress</h2>
          <div className="progress-card">
            <div className="progress-card__header">
              <span className="progress-card__label">Completion Rate</span>
              <span className="progress-card__value">{stats.completionRate}%</span>
            </div>
            <ProgressBar
              value={stats.completed}
              max={stats.total || 1}
              variant={stats.completionRate >= 80 ? 'default' : 'warning'}
            />
            <div className="progress-card__stats">
              <span>{stats.completed} completed</span>
              <span>{stats.pending} pending</span>
            </div>
          </div>
        </section>

        {/* Weekly Stats */}
        <section className="profile-section">
          <h2 className="profile-section-title">This Week</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-value">{stats.dueToday}</span>
              <span className="stat-label">Due Today</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.completed}</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{stats.pending}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card">
              <span className="stat-value">{zones.length}</span>
              <span className="stat-label">Zones</span>
            </div>
          </div>
        </section>

        {/* Zone Breakdown */}
        <section className="profile-section">
          <h2 className="profile-section-title">Zone Breakdown</h2>
          {stats.zoneBreakdown.length === 0 ? (
            <p className="empty-text">No zones yet</p>
          ) : (
            <div className="zone-breakdown">
              {stats.zoneBreakdown.map((zone) => {
                const zonePercent = zone.taskCount > 0
                  ? Math.round((zone.completedCount / zone.taskCount) * 100)
                  : 0;
                return (
                  <div key={zone.id} className="zone-item">
                    <div className="zone-item__header">
                      <div className="zone-item__name">
                        <span
                          className="zone-item__color"
                          style={{ backgroundColor: zone.color }}
                        />
                        {zone.name}
                      </div>
                      <span className="zone-item__count">
                        {zone.completedCount}/{zone.taskCount}
                      </span>
                    </div>
                    <ProgressBar
                      value={zone.completedCount}
                      max={zone.taskCount || 1}
                      variant="info"
                      showPercentage={false}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Logout */}
        <section className="profile-section profile-logout">
          <DangerButton onClick={handleLogout} fullWidth>
            Log Out
          </DangerButton>
        </section>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Profile"
        footer={
          <>
            <SecondaryButton onClick={() => setShowEditModal(false)}>
              Cancel
            </SecondaryButton>
            <PrimaryButton onClick={handleUpdateProfile} disabled={loading}>
              {loading ? 'Saving...' : 'Save Changes'}
            </PrimaryButton>
          </>
        }
      >
        <div className="edit-profile-form">
          {error && <div className="profile-error">{error}</div>}

          <InputField
            label="Name"
            name="name"
            type="text"
            value={editForm.name}
            onChange={handleEditChange}
            required
          />

          <InputField
            label="College"
            name="college"
            type="text"
            value={editForm.college}
            onChange={handleEditChange}
          />

          <InputField
            label="Department"
            name="dept"
            type="text"
            value={editForm.dept}
            onChange={handleEditChange}
          />

          <InputField
            label="Year"
            name="year"
            type="number"
            value={editForm.year}
            onChange={handleEditChange}
            min="1"
            max="6"
          />
        </div>
      </Modal>
    </div>
  );
}

// Calculate streak of consecutive days with completed tasks
function calculateStreak(tasks) {
  const completedTasks = tasks
    .filter((t) => t.status === 'completed' && t.completedAt)
    .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

  if (completedTasks.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const completedDates = new Set(
    completedTasks.map((t) => new Date(t.completedAt).toISOString().split('T')[0])
  );

  // Check consecutive days
  while (true) {
    const dateStr = currentDate.toISOString().split('T')[0];
    if (completedDates.has(dateStr)) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}
