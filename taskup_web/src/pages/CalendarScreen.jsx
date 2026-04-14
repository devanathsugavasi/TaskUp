// ============================================
// CALENDAR SCREEN - Monthly Calendar View
// Shows tasks marked on calendar by due date
// ============================================

import { useState, useMemo } from 'react';
import { useTasks } from '../contexts/TaskContext';
import { PRIORITY_LEVELS } from '../contexts/TaskContext';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import './CalendarScreen.css';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CalendarScreen() {
  const { tasks, zones } = useTasks();

  // Current displayed month/year
  const [currentDate, setCurrentDate] = useState(new Date());
  // Selected day for showing tasks
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Get year and month for current view
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Navigate to previous month
  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Navigate to today
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Generate calendar days for current month view
  const calendarDays = useMemo(() => {
    const days = [];

    // Get first day of month and total days
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const startingDayOfWeek = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();

    // Add days from previous month to fill the first week
    const prevMonth = new Date(currentYear, currentMonth, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(currentYear, currentMonth - 1, prevMonthDays - i),
        isOtherMonth: true,
      });
    }

    // Add days of current month
    for (let day = 1; day <= totalDays; day++) {
      days.push({
        date: new Date(currentYear, currentMonth, day),
        isOtherMonth: false,
      });
    }

    // Add days from next month to complete the last week
    const remainingDays = 42 - days.length; // 6 rows * 7 days
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(currentYear, currentMonth + 1, day),
        isOtherMonth: true,
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Map tasks to dates for marking
  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      if (task.calendarDate) {
        if (!map[task.calendarDate]) {
          map[task.calendarDate] = [];
        }
        map[task.calendarDate].push(task);
      }
    });
    return map;
  }, [tasks]);

  // Get tasks for selected date
  const selectedDateStr = formatDateKey(selectedDate);
  const selectedDayTasks = tasksByDate[selectedDateStr] || [];

  // Check if a date is today
  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Check if a date is selected
  const isSelected = (date) => {
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Format date key for lookup (YYYY-MM-DD)
  const formatDateKey = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Get zone color by name
  const getZoneColor = (zoneName) => {
    const zone = zones.find((z) => z.name === zoneName);
    return zone?.color || '#888888';
  };

  // Handle day click
  const handleDayClick = (date) => {
    setSelectedDate(date);
  };

  // Format selected date for display
  const formatSelectedDate = () => {
    return selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="calendar-screen">
      <div className="calendar-container">
        {/* Header */}
        <header className="calendar-header">
          <h1 className="calendar-title">Calendar</h1>
          <div className="calendar-nav">
            <button
              className="calendar-nav-btn"
              onClick={goToPrevMonth}
              aria-label="Previous month"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              className="calendar-nav-btn"
              onClick={goToToday}
              aria-label="Go to today"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M8 4V8L10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
            <button
              className="calendar-nav-btn"
              onClick={goToNextMonth}
              aria-label="Next month"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <span className="calendar-current-month">
            {MONTHS[currentMonth]} {currentYear}
          </span>
        </header>

        {/* Calendar Grid */}
        <div className="calendar-grid">
          {/* Weekday Headers */}
          <div className="calendar-weekdays">
            {WEEKDAYS.map((day) => (
              <div key={day} className="calendar-weekday">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="calendar-days">
            {calendarDays.map((dayInfo, index) => {
              const dateKey = formatDateKey(dayInfo.date);
              const dayTasks = tasksByDate[dateKey] || [];
              const maxDots = 4;
              const visibleDots = dayTasks.slice(0, maxDots);

              return (
                <div
                  key={index}
                  className={[
                    'calendar-day',
                    dayInfo.isOtherMonth ? 'calendar-day--other-month' : '',
                    isToday(dayInfo.date) ? 'calendar-day--today' : '',
                    isSelected(dayInfo.date) ? 'calendar-day--selected' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() => handleDayClick(dayInfo.date)}
                >
                  <div className="calendar-day__number">
                    {dayInfo.date.getDate()}
                  </div>
                  <div className="calendar-day__dots">
                    {visibleDots.map((task, i) => (
                      <div
                        key={task.id}
                        className="calendar-day__dot"
                        style={{
                          backgroundColor: PRIORITY_LEVELS[task.priority]?.color || '#888',
                        }}
                      />
                    ))}
                    {dayTasks.length > maxDots && (
                      <span style={{ fontSize: '8px', color: '#666' }}>
                        +{dayTasks.length - maxDots}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Tasks */}
        <div className="calendar-tasks">
          <div className="calendar-tasks-header">
            <h2 className="calendar-tasks-title">Tasks</h2>
            <span className="calendar-tasks-date">{formatSelectedDate()}</span>
          </div>

          {selectedDayTasks.length === 0 ? (
            <EmptyState
              icon={
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect x="4" y="4" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 20H28M12 14H28M12 26H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              }
              title="No tasks"
              message="No tasks due on this day"
            />
          ) : (
            <div className="calendar-tasks-list">
              {selectedDayTasks.map((task) => (
                <div key={task.id} className="calendar-task-card">
                  <div className="calendar-task-card__meta">
                    <span
                      className="calendar-task-card__zone"
                      style={{ backgroundColor: getZoneColor(task.zone) }}
                    >
                      {task.zone}
                    </span>
                    <span
                      className="calendar-task-card__zone"
                      style={{
                        backgroundColor: PRIORITY_LEVELS[task.priority]?.color || '#888',
                        color: task.priority === 'medium' || task.priority === 'low' ? '#000' : '#fff',
                      }}
                    >
                      {PRIORITY_LEVELS[task.priority]?.label || 'Medium'}
                    </span>
                    {task.dueDateStr && (
                      <span className="calendar-task-card__time">
                        {new Date(task.dueDateStr).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                    )}
                  </div>
                  <h3 className="calendar-task-card__title">{task.title}</h3>
                  {task.desc && (
                    <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>
                      {task.desc}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
