/**
 * DashboardScreen — Main task list view
 * ─────────────────────────────────────────────────────
 * Features:
 * - Greeting with user name
 * - Progress percentage bubble
 * - Search bar for task filtering
 * - Zone filter tabs (All, Today, + user zones)
 * - Task card list with completion checkboxes
 *
 * BUG FIX: "Today" filter now properly filters by today's date
 * (was previously a no-op: `filtered = filtered`)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../contexts/TaskContext';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from '../components/SearchBar';
import FilterTabs from '../components/FilterTabs';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';

export default function DashboardScreen() {
  const { tasks, zones, loading, error, completeTask } = useTasks();
  const { userProfile, user } = useAuth();
  const navigate = useNavigate();
  const [activeZone, setActiveZone] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Build filter tab list from user zones
  const filterTabs = [
    { key: 'All', label: 'All' },
    { key: 'Today', label: 'Today' },
    ...zones.map((z) => ({ key: z.name, label: z.name.replace(' Zone', '') })),
  ];

  // Start with pending tasks only
  let filtered = tasks.filter((t) => t.status === 'pending');

  // Apply zone/today filter
  if (activeZone === 'Today') {
    // FIX: Actually filter by today's date (was a no-op before)
    const todayStr = new Date().toISOString().split('T')[0];
    filtered = filtered.filter((t) => t.calendarDate === todayStr);
  } else if (activeZone !== 'All') {
    filtered = filtered.filter((t) => t.zone === activeZone);
  }

  // Apply search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter((t) =>
      t.title?.toLowerCase().includes(q) || t.desc?.toLowerCase().includes(q),
    );
  }

  // Calculate completion progress
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Time-based greeting
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = userProfile?.name?.split(' ')[0] || 'Student';

  return (
    <div>
      {/* Header — greeting + progress */}
      <div className="flex justify-between items-center mb-xxl">
        <div>
          <p className="text-muted" style={{ fontSize: 13, fontWeight: 500 }}>{greeting()},</p>
          <h1 style={{ fontSize: 28 }}>{firstName}</h1>
        </div>
        <div
          className="card-soft"
          style={{
            background: 'var(--color-primary)',
            borderRadius: 'var(--radius-md)',
            padding: '12px 20px',
            textAlign: 'center',
            minWidth: 64,
            border: '3px solid var(--color-border)',
          }}
        >
          <div className="text-mono" style={{ fontSize: 20, fontWeight: 900, color: 'var(--color-accent-mint)' }}>
            {progress}%
          </div>
          <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.65)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1 }}>
            Done
          </div>
        </div>
      </div>

      {/* Search */}
      <SearchBar value={searchQuery} onChange={setSearchQuery} placeholder="Search tasks..." />

      {/* Zone filter tabs */}
      <FilterTabs tabs={filterTabs} activeTab={activeZone} onTabPress={setActiveZone} />

      {/* Section header */}
      {filtered.length > 0 && (
        <div className="section-header">
          <div className="section-title">Plan for Today</div>
          <div className="section-subtitle">
            {filtered.length} task{filtered.length !== 1 ? 's' : ''} remaining
          </div>
        </div>
      )}

      {/* Task list */}
      {filtered.length === 0 ? (
        <EmptyState
          title={searchQuery ? 'No results found' : 'All clear'}
          message={
            searchQuery
              ? `No tasks match "${searchQuery}". Try a different search.`
              : activeZone !== 'All'
              ? `No pending tasks in ${activeZone}. Click + to add one.`
              : 'No pending tasks. Click + to create your first task.'
          }
        />
      ) : (
        <div>
          {filtered.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={() => navigate('/add-task', { state: { task } })}
              onComplete={() => {
                if (window.confirm(`Mark "${task.title}" as done?`)) {
                  completeTask(task.id);
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
