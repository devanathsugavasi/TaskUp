/**
 * AddTaskScreen — Create / Edit / Delete tasks
 * ─────────────────────────────────────────────────────
 * Features:
 * - Title, description, zone selector, priority picker
 * - Native HTML datetime-local input for due date (replaces text input)
 * - Reminder field with browser notification scheduling
 * - Edit mode when navigated with a task in location state
 * - Delete button in edit mode
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTasks } from '../contexts/TaskContext';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import ZoneChip from '../components/ZoneChip';

// Priority levels available
const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

// Priority color mapping for the chips
const PRIORITY_COLORS = {
  low: '#00FF88',
  medium: '#00FFFF',
  high: '#FFD500',
  urgent: '#FF007F',
};

export default function AddTaskScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const existing = location.state?.task || null; // Edit mode if task was passed
  const { zones, addTask, updateTask, deleteTask } = useTasks();

  const [title, setTitle] = useState(existing?.title || '');
  const [desc, setDesc] = useState(existing?.desc || '');
  const [zone, setZone] = useState(existing?.zone || '');
  const [priority, setPriority] = useState(existing?.priority || 'medium');
  const [dueDate, setDueDate] = useState(existing?.dueDateStr || '');
  const [reminder, setReminder] = useState(existing?.reminderMinutes || '');
  const [loading, setLoading] = useState(false);

  // Auto-select first zone if none selected
  useEffect(() => {
    if (!zone && zones.length > 0) setZone(zones[0].name);
  }, [zones, zone]);

  // Schedule a browser notification for the task reminder
  const scheduleReminder = (taskTitle, dueDateStr, reminderMinutes) => {
    if (!dueDateStr || !reminderMinutes) return;
    // Request notification permission if not granted
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }
    if (Notification.permission !== 'granted') return;

    const dueTime = new Date(dueDateStr).getTime();
    const reminderTime = dueTime - (parseInt(reminderMinutes) * 60 * 1000);
    const delay = reminderTime - Date.now();

    if (delay > 0) {
      setTimeout(() => {
        new Notification('TaskUp Reminder', {
          body: `"${taskTitle}" is due in ${reminderMinutes} minutes.`,
          icon: '/favicon.ico',
        });
      }, delay);
    }
  };

  // Save or update the task
  const handleSave = async () => {
    if (!title.trim()) {
      alert('Task title cannot be empty.');
      return;
    }
    if (!zone) {
      alert('Please select a zone. If no zones appear, go to Profile → Manage Zones first.');
      return;
    }
    setLoading(true);

    // Build the task payload
    const payload = {
      title: title.trim(),
      desc: desc.trim(),
      zone,
      priority,
      dueDateStr: dueDate,
      reminderMinutes: reminder ? parseInt(reminder) : null,
      calendarDate: dueDate ? dueDate.split('T')[0] : '',
    };

    console.log('[AddTask] Saving task with payload:', payload);

    try {
      if (existing) {
        await updateTask(existing.id, payload);
        console.log('[AddTask] ✅ Task updated:', existing.id);
      } else {
        const result = await addTask(payload);
        console.log('[AddTask] ✅ Task created! Doc ID:', result?.id);
      }
      // Schedule browser notification if reminder is set
      scheduleReminder(payload.title, payload.dueDateStr, payload.reminderMinutes);
      navigate(-1);
    } catch (e) {
      console.error('[AddTask] ❌ SAVE FAILED:', e);
      alert(
        'Error saving task!\n\n' +
        'Code: ' + (e.code || 'unknown') + '\n' +
        'Message: ' + e.message + '\n\n' +
        'This usually means Firestore security rules are blocking the write.\n' +
        'Check the Firebase Console → Firestore → Rules.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Delete the task (edit mode only)
  const handleDelete = () => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    deleteTask(existing.id).then(() => navigate(-1));
  };

  return (
    <div style={{ maxWidth: 600 }}>
      {/* Header */}
      <div className="flex justify-between items-center mb-xxl">
        <button
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', fontSize: 14, fontWeight: 600, color: 'var(--color-accent-pink)', cursor: 'pointer' }}
        >
          Close
        </button>
        <h2>{existing ? 'Edit Task' : 'New Task'}</h2>
        <div style={{ width: 40 }} />
      </div>

      {/* Form card */}
      <div className="card card-elevated">
        <InputField label="Task Title" value={title} onChange={setTitle} placeholder="e.g. Submit assignment" required />
        <InputField label="Description" value={desc} onChange={setDesc} placeholder="Add details..." multiline />

        {/* Zone selection */}
        <label className="input-label">Zone</label>
        <div className="flex flex-wrap gap-sm mb-lg">
          {zones.map((z) => (
            <ZoneChip key={z.id} zone={z} selected={zone === z.name} onPress={() => setZone(z.name)} />
          ))}
        </div>

        {/* Priority selection */}
        <label className="input-label">Priority</label>
        <div className="flex flex-wrap gap-sm mb-lg">
          {PRIORITIES.map((p) => {
            const isActive = priority === p;
            const color = PRIORITY_COLORS[p];
            return (
              <button
                key={p}
                className="priority-chip"
                onClick={() => setPriority(p)}
                style={{
                  borderColor: color,
                  backgroundColor: isActive ? color : 'var(--color-bg-card)',
                  color: isActive ? '#000' : color,
                }}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            );
          })}
        </div>

        {/* Due date — native HTML datetime-local (replaces plain text input) */}
        <div className="input-group">
          <label className="input-label">Due Date</label>
          <input
            type="datetime-local"
            className="input-field"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>

        {/* Reminder — minutes before due date */}
        <div className="input-group">
          <label className="input-label">Reminder (minutes before due)</label>
          <select
            className="input-field"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
          >
            <option value="">No reminder</option>
            <option value="5">5 minutes before</option>
            <option value="15">15 minutes before</option>
            <option value="30">30 minutes before</option>
            <option value="60">1 hour before</option>
            <option value="1440">1 day before</option>
          </select>
        </div>

        {/* Save button */}
        <PrimaryButton
          label={existing ? 'Update Task' : 'Save Task'}
          onClick={handleSave}
          loading={loading}
          style={{ marginTop: 'var(--space-sm)' }}
        />

        {/* Delete button (edit mode only) */}
        {existing && (
          <button
            className="btn btn-danger btn-full"
            onClick={handleDelete}
            style={{ marginTop: 'var(--space-xl)' }}
          >
            Delete Task
          </button>
        )}
      </div>
    </div>
  );
}
