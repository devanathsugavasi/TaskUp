/**
 * TaskCard — Displays a single task with priority accent
 * ─────────────────────────────────────────────────────
 * Shows task title, description, zone pill, priority badge,
 * due date, and a completion checkbox.
 */

import React from 'react';

// Priority color mapping — matches the design system
const PRIORITY_COLORS = {
  low: '#00FF88',
  medium: '#00FFFF',
  high: '#FFD500',
  urgent: '#FF007F',
};

const PRIORITY_BG = {
  low: '#B3FFD6',
  medium: '#B3FFFF',
  high: '#FFF2B3',
  urgent: '#FFB3D9',
};

// Default zone color for zones not in the predefined list
const DEFAULT_ZONE = { accent: '#000000', bg: '#E6E6E6' };

const ZONE_COLORS = {
  'Work Zone':     { accent: '#FF007F', bg: '#FFB3D9' },
  'Reading Zone':  { accent: '#00FFFF', bg: '#B3FFFF' },
  'Meeting Zone':  { accent: '#FFD500', bg: '#FFF2B3' },
  'Food Zone':     { accent: '#00FF88', bg: '#B3FFD6' },
  'Exam Zone':     { accent: '#FF007F', bg: '#FFB3D9' },
  'Personal Zone': { accent: '#00FFFF', bg: '#B3FFFF' },
};

export default function TaskCard({ task, onClick, onComplete }) {
  const priorityColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium;
  const priorityBg = PRIORITY_BG[task.priority] || PRIORITY_BG.medium;
  const zoneColor = ZONE_COLORS[task.zone] || DEFAULT_ZONE;

  // Handle checkbox click without triggering card click
  const handleCheck = (e) => {
    e.stopPropagation();
    if (onComplete) onComplete();
  };

  return (
    <div className="task-card" onClick={onClick}>
      {/* Priority accent bar on the left edge */}
      <div className="task-accent-bar" style={{ backgroundColor: priorityColor }} />

      {/* Completion checkbox */}
      {onComplete && (
        <div
          className="checkbox"
          style={{ borderColor: priorityColor }}
          onClick={handleCheck}
        >
          <div className="checkbox-inner" style={{ backgroundColor: priorityColor }} />
        </div>
      )}

      {/* Task content */}
      <div className="task-body">
        <div className="task-title">{task.title}</div>
        {task.desc && <div className="task-desc">{task.desc}</div>}

        {/* Zone and priority pills */}
        <div className="task-meta">
          <span
            className="pill"
            style={{ backgroundColor: zoneColor.bg, color: zoneColor.accent, borderColor: zoneColor.accent }}
          >
            {task.zone}
          </span>
          <span className="pill" style={{ backgroundColor: priorityBg, borderColor: priorityColor }}>
            <span className="pill-dot" style={{ backgroundColor: priorityColor }} />
            <span style={{ color: priorityColor, fontWeight: 700 }}>
              {(task.priority || 'medium').charAt(0).toUpperCase() + (task.priority || 'medium').slice(1)}
            </span>
          </span>
        </div>

        {/* Due date */}
        {task.dueDateStr && <div className="task-due">Due: {task.dueDateStr}</div>}
      </div>
    </div>
  );
}
