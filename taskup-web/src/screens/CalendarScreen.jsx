/**
 * CalendarScreen — Monthly calendar view with task dots
 * ─────────────────────────────────────────────────────
 * Custom-built calendar grid (no external library) to maintain
 * full Neo-Brutalism styling control.
 *
 * Features:
 * - Month navigation (prev/next)
 * - Colored dots on days with tasks
 * - Click a day to see pending tasks for that date
 * - Today highlighted
 */

import React, { useState } from 'react';
import { useTasks } from '../contexts/TaskContext';

// Priority color mapping
const PRIORITY_COLORS = {
  low: '#00FF88', medium: '#00FFFF', high: '#FFD500', urgent: '#FF007F',
};

// Zone color mapping
const ZONE_COLORS = {
  'Work Zone':     { accent: '#FF007F', bg: '#FFB3D9' },
  'Reading Zone':  { accent: '#00FFFF', bg: '#B3FFFF' },
  'Meeting Zone':  { accent: '#FFD500', bg: '#FFF2B3' },
  'Food Zone':     { accent: '#00FF88', bg: '#B3FFD6' },
  'Exam Zone':     { accent: '#FF007F', bg: '#FFB3D9' },
  'Personal Zone': { accent: '#00FFFF', bg: '#B3FFFF' },
};
const DEFAULT_ZONE = { accent: '#000000', bg: '#E6E6E6' };

// Day names for the calendar header
const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarScreen() {
  const { tasks } = useTasks();
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState('');

  // Navigate to previous month
  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };

  // Navigate to next month
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  // Build calendar grid days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const totalCells = Math.ceil((firstDay + daysInMonth) / 7) * 7;

  const cells = [];
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - firstDay + 1;
    if (dayNum < 1) {
      // Previous month overflow
      cells.push({ day: daysInPrevMonth + dayNum, isOtherMonth: true, dateStr: '' });
    } else if (dayNum > daysInMonth) {
      // Next month overflow
      cells.push({ day: dayNum - daysInMonth, isOtherMonth: true, dateStr: '' });
    } else {
      // Current month
      const m = String(month + 1).padStart(2, '0');
      const d = String(dayNum).padStart(2, '0');
      cells.push({ day: dayNum, isOtherMonth: false, dateStr: `${year}-${m}-${d}` });
    }
  }

  // Build a map of date -> task dots (for dots on the calendar)
  const tasksByDate = {};
  tasks.forEach((t) => {
    if (t.calendarDate && t.status === 'pending') {
      if (!tasksByDate[t.calendarDate]) tasksByDate[t.calendarDate] = [];
      tasksByDate[t.calendarDate].push(t);
    }
  });

  // Tasks for the selected date
  const selectedTasks = selectedDate
    ? tasks.filter((t) => t.calendarDate === selectedDate && t.status === 'pending')
    : [];

  const monthName = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 'var(--space-xxl)' }}>
        <h1>Calendar</h1>
        <p className="text-muted mt-sm">Plan your schedule</p>
      </div>

      {/* Month navigation */}
      <div className="flex justify-between items-center mb-lg">
        <button className="btn btn-secondary btn-small" onClick={prevMonth}>{'\u2190'}</button>
        <h3>{monthName}</h3>
        <button className="btn btn-secondary btn-small" onClick={nextMonth}>{'\u2192'}</button>
      </div>

      {/* Calendar grid */}
      <div className="calendar-grid">
        {/* Day name headers */}
        {DAY_NAMES.map((d) => (
          <div key={d} className="calendar-header-cell">{d}</div>
        ))}
        {/* Day cells */}
        {cells.map((cell, i) => {
          const isToday = cell.dateStr === todayStr;
          const isSelected = cell.dateStr === selectedDate;
          const dots = tasksByDate[cell.dateStr] || [];
          return (
            <div
              key={i}
              className={`calendar-cell ${cell.isOtherMonth ? 'other-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected' : ''}`}
              onClick={() => !cell.isOtherMonth && setSelectedDate(cell.dateStr)}
            >
              <div className="calendar-day-num">{cell.day}</div>
              {dots.length > 0 && (
                <div className="calendar-dots">
                  {dots.slice(0, 3).map((t, j) => (
                    <div
                      key={j}
                      className="calendar-dot"
                      style={{ background: PRIORITY_COLORS[t.priority] || '#000' }}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected date panel */}
      {selectedDate ? (
        <div style={{ marginTop: 'var(--space-xl)' }}>
          <h4 className="text-mono" style={{ marginBottom: 'var(--space-md)' }}>{selectedDate}</h4>
          {selectedTasks.length === 0 ? (
            <p className="text-muted">No tasks due on this day.</p>
          ) : (
            selectedTasks.map((t) => {
              const zc = ZONE_COLORS[t.zone] || DEFAULT_ZONE;
              return (
                <div key={t.id} className="task-card" style={{ cursor: 'default' }}>
                  <div className="task-accent-bar" style={{ backgroundColor: PRIORITY_COLORS[t.priority] || '#000' }} />
                  <div className="task-body">
                    <div className="task-title" style={{ textTransform: 'uppercase' }}>{t.title}</div>
                    <div className="task-meta">
                      <span className="pill" style={{ background: zc.bg, color: zc.accent, borderColor: zc.accent }}>
                        {t.zone}
                      </span>
                      <span className="text-muted" style={{ fontSize: 11 }}>
                        {(t.priority || 'medium').charAt(0).toUpperCase() + (t.priority || 'medium').slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        <div className="text-center mt-xxl">
          <p className="text-muted">Tap a date to see tasks due that day.</p>
        </div>
      )}
    </div>
  );
}
