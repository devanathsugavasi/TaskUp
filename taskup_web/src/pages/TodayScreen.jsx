// ============================================
// TODAY SCREEN - Priority-Grouped Daily Tasks
// Shows today's pending tasks grouped by priority
// ============================================

import { useMemo } from 'react';
import { useTasks } from '../contexts/TaskContext';
import { PRIORITY_LEVELS } from '../contexts/TaskContext';
import TaskCard from '../components/TaskCard';
import ProgressBar from '../components/ProgressBar';
import './TodayScreen.css';

// Priority order for display
const PRIORITY_ORDER = ['urgent', 'high', 'medium', 'low'];

export default function TodayScreen() {
  const { tasks, getTasksByPriority } = useTasks();

  // Get today's date string
  const todayStr = new Date().toISOString().split('T')[0];

  // Format today's date for display
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  // Filter tasks for today and group by priority
  const todayTasks = useMemo(() => {
    const pendingTasks = tasks.filter(
      (t) => t.calendarDate === todayStr && t.status === 'pending'
    );
    return getTasksByPriority(pendingTasks);
  }, [tasks, todayStr, getTasksByPriority]);

  // Calculate overall progress
  const totalPending = Object.values(todayTasks).flat().length;
  const totalTasks = tasks.filter((t) => t.calendarDate === todayStr).length;
  const completed = totalTasks - totalPending;
  const progressPercent = totalTasks > 0 ? Math.round((completed / totalTasks) * 100) : 0;

  // Check if all tasks are done
  const allDone = totalPending === 0 && totalTasks > 0;

  return (
    <div className="today-screen">
      <div className="today-container">
        {/* Header */}
        <header className="today-header">
          <h1 className="today-title">Today</h1>
          <p className="today-date">{formattedDate}</p>
        </header>

        {/* Progress */}
        <div className="today-progress">
          <div className="today-progress__header">
            <h2 className="today-progress__title">Daily Progress</h2>
            <span className="today-progress__stats">
              {completed}/{totalTasks}
            </span>
          </div>
          <ProgressBar
            value={completed}
            max={totalTasks || 1}
            variant={allDone ? 'default' : 'info'}
          />
        </div>

        {/* All done state */}
        {allDone ? (
          <div className="today-empty">
            <div className="today-empty__icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M10 20L17 27L30 13" stroke="#000" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h2 className="today-empty__title">All Done!</h2>
            <p className="today-empty__text">
              Great job! You've completed all your tasks for today.
            </p>
          </div>
        ) : totalPending === 0 ? (
          <div className="today-empty">
            <div className="today-empty__icon">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="14" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 10V20L26 26" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h2 className="today-empty__title">No Tasks Today</h2>
            <p className="today-empty__text">
              You have no tasks scheduled for today. Enjoy your free time!
            </p>
          </div>
        ) : (
          /* Priority Sections */
          PRIORITY_ORDER.map((priority) => {
            const sectionTasks = todayTasks[priority] || [];
            if (sectionTasks.length === 0) return null;

            const priorityInfo = PRIORITY_LEVELS[priority];

            return (
              <div key={priority} className="today-section">
                <div className="today-section__header">
                  <div
                    className="today-section__indicator"
                    style={{ backgroundColor: priorityInfo.color }}
                  />
                  <h2 className="today-section__title">{priorityInfo.label}</h2>
                  <span className="today-section__count">
                    {sectionTasks.length} {sectionTasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                </div>
                <div className="today-section__tasks">
                  {sectionTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
