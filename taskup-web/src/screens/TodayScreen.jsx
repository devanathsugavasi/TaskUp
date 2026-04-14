/**
 * TodayScreen — Priority-grouped task checklist
 * ─────────────────────────────────────────────────────
 * Shows all pending tasks grouped by priority level
 * (Urgent -> Important -> Routine -> Low Priority).
 * Includes a progress bar showing completion percentage.
 */

import React from 'react';
import { useTasks } from '../contexts/TaskContext';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';

// Priority sorting order — urgent first
const PRIORITY_ORDER = { urgent: 0, high: 1, medium: 2, low: 3 };
const PRIORITY_COLORS = { low: '#00FF88', medium: '#00FFFF', high: '#FFD500', urgent: '#FF007F' };

export default function TodayScreen() {
  const { tasks, completeTask } = useTasks();

  // Get all pending tasks sorted by priority
  const pendingTasks = [...tasks]
    .filter((t) => t.status === 'pending')
    .sort((a, b) => (PRIORITY_ORDER[a.priority] || 3) - (PRIORITY_ORDER[b.priority] || 3));

  // Group tasks by priority level
  const groups = {
    urgent: pendingTasks.filter((t) => t.priority === 'urgent'),
    high: pendingTasks.filter((t) => t.priority === 'high'),
    medium: pendingTasks.filter((t) => t.priority === 'medium'),
    low: pendingTasks.filter((t) => t.priority === 'low'),
  };

  // Build sections array (only include non-empty groups)
  const sections = [
    { title: 'Urgent', key: 'urgent', data: groups.urgent },
    { title: 'Important', key: 'high', data: groups.high },
    { title: 'Routine', key: 'medium', data: groups.medium },
    { title: 'Low Priority', key: 'low', data: groups.low },
  ].filter((s) => s.data.length > 0);

  // Progress calculation
  const totalAll = tasks.length;
  const doneAll = tasks.filter((t) => t.status === 'completed').length;
  const progressPct = totalAll > 0 ? Math.round((doneAll / totalAll) * 100) : 0;

  // Handle task completion with confirmation
  const handleComplete = (item) => {
    if (window.confirm(`Mark "${item.title}" as done?`)) {
      completeTask(item.id);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 style={{ fontSize: 30 }}>Today's Focus</h1>
          <p className="text-muted mt-sm" style={{ fontSize: 13 }}>
            {pendingTasks.length} task{pendingTasks.length !== 1 ? 's' : ''} remaining
          </p>
        </div>
        {/* Progress circle */}
        <div style={{
          width: 56, height: 56,
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-primary)',
          border: '3px solid var(--color-border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: 'var(--shadow-button)',
        }}>
          <span className="text-mono" style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>
            {progressPct}%
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginTop: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{
              width: `${progressPct}%`,
              backgroundColor: progressPct >= 70 ? '#00FF88' : '#FFD500',
            }}
          />
        </div>
        <p className="text-muted mt-sm" style={{ fontSize: 12, fontStyle: 'italic' }}>
          {progressPct >= 100 ? 'All tasks done' : progressPct >= 70 ? 'You are on track' : 'Keep going'}
        </p>
      </div>

      {/* Task sections by priority */}
      {pendingTasks.length === 0 ? (
        <EmptyState
          title="All done"
          message="You have completed all your tasks. Take a well-deserved break."
        />
      ) : (
        sections.map((section) => (
          <div key={section.key}>
            {/* Section header with colored dot */}
            <div className="section-row">
              <div className="section-dot" style={{ backgroundColor: PRIORITY_COLORS[section.key] }} />
              <span className="section-title" style={{ flex: 1 }}>{section.title}</span>
              <span className="section-count">{section.data.length}</span>
            </div>
            {/* Section tasks */}
            {section.data.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => handleComplete(task)}
                onComplete={() => handleComplete(task)}
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
}
