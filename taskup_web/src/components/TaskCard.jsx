// ============================================
// TASK CARD COMPONENT
// Displays a single task with checkbox, zone, priority, and actions
// Neo-Brutalism styling with hard shadows and bold borders
// ============================================

import { useState } from 'react';
import { useTasks } from '../contexts/TaskContext';
import { PRIORITY_LEVELS } from '../contexts/TaskContext';
import './TaskCard.css';

export default function TaskCard({ task, onEdit, showZone = true }) {
  const { toggleTaskComplete, deleteTask } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);
  const isCompleted = task.status === 'completed';
  const priority = PRIORITY_LEVELS[task.priority] || PRIORITY_LEVELS.medium;

  // Handle checkbox toggle with optimistic UI update
  const handleToggle = async () => {
    await toggleTaskComplete(task.id, task.status);
  };

  // Handle task deletion with confirmation
  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
    } catch (err) {
      console.error('Delete error:', err);
      setIsDeleting(false);
    }
  };

  // Handle edit action
  const handleEdit = () => {
    if (onEdit) {
      onEdit(task);
    }
  };

  return (
    <div className={`task-card ${isCompleted ? 'task-card--completed' : ''}`}>
      <div className="task-card__checkbox-wrapper">
        <button
          className={`task-card__checkbox ${isCompleted ? 'task-card__checkbox--checked' : ''}`}
          onClick={handleToggle}
          aria-label={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {isCompleted && (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
      </div>

      <div className="task-card__content" onClick={handleEdit}>
        <div className="task-card__header">
          <h4 className={`task-card__title ${isCompleted ? 'task-card__title--strikethrough' : ''}`}>
            {task.title}
          </h4>
          <div className="task-card__actions">
            <button
              className="task-card__action-btn"
              onClick={(e) => { e.stopPropagation(); handleEdit(); }}
              aria-label="Edit task"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M11.5 2.5L13.5 4.5L5 13H3V11L11.5 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className="task-card__action-btn task-card__action-btn--delete"
              onClick={(e) => { e.stopPropagation(); handleDelete(); }}
              disabled={isDeleting}
              aria-label="Delete task"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 4H13L12 14H4L3 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M2 4H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M6 2H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>

        {task.desc && (
          <p className="task-card__description">
            {task.desc}
          </p>
        )}

        <div className="task-card__meta">
          {showZone && task.zone && (
            <span
              className="task-card__zone"
              style={{ backgroundColor: getZoneColor(task.zone) }}
            >
              {task.zone}
            </span>
          )}
          <span
            className={`task-card__priority task-card__priority--${task.priority}`}
            style={{ backgroundColor: priority.color }}
          >
            {priority.label}
          </span>
          {task.dueDateStr && (
            <span className="task-card__date">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <rect x="1" y="2" width="10" height="9" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M1 5H11" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M4 1V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M8 1V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              {formatDate(task.dueDateStr)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper function to get zone color based on zone name
// Falls back to a default color if zone not found
function getZoneColor(zoneName) {
  const colors = {
    Work: '#FF007F',
    Reading: '#FFD500',
    Meeting: '#00FF88',
    Food: '#00FFFF',
    Exam: '#5B4FD4',
    Personal: '#FF6B6B',
  };
  return colors[zoneName] || '#888888';
}

// Format date string for display
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (dateStr === today.toISOString().split('T')[0]) {
    return 'Today';
  }
  if (dateStr === tomorrow.toISOString().split('T')[0]) {
    return 'Tomorrow';
  }

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
