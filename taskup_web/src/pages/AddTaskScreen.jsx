// ============================================
// ADD TASK SCREEN - Create and Edit Tasks
// Form for creating new tasks or editing existing ones
// ============================================

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useTasks } from '../contexts/TaskContext';
import { PrimaryButton, SecondaryButton, DangerButton } from '../components/Button';
import InputField from '../components/InputField';
import ZoneChip from '../components/ZoneChip';
import PriorityPicker from '../components/PriorityPicker';
import { useNotification } from '../hooks/useNotification';
import './AddTaskScreen.css';

export default function AddTaskScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { tasks, zones, addTask, updateTask, deleteTask } = useTasks();
  const { showNotification, requestPermission, permission } = useNotification();

  // Get edit task ID from URL if present
  const editTaskId = searchParams.get('edit');
  const editTask = editTaskId ? tasks.find((t) => t.id === editTaskId) : null;

  // Form state - zone will be set via useEffect after zones load
  const [formData, setFormData] = useState({
    title: '',
    desc: '',
    zone: '', // Will be set once zones are confirmed loaded
    priority: 'medium',
    dueDate: '',
    dueTime: '',
    reminder: '',
    reminderTime: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [zonesLoaded, setZonesLoaded] = useState(false);

  // Set initial zone once zones are confirmed loaded
  useEffect(() => {
    if (zones.length > 0 && !zonesLoaded && !editTask) {
      setFormData((prev) => ({ ...prev, zone: zones[0].name }));
      setZonesLoaded(true);
    } else if (zones.length > 0 && !zonesLoaded && editTask) {
      // For editing, use the task's existing zone or first available
      const taskZone = editTask.zone || zones[0].name;
      setFormData((prev) => ({ ...prev, zone: taskZone }));
      setZonesLoaded(true);
    }
  }, [zones, zonesLoaded, editTask]);

  // Pre-fill form if editing
  useEffect(() => {
    if (editTask) {
      setFormData({
        title: editTask.title || '',
        desc: editTask.desc || '',
        zone: editTask.zone || zones[0]?.name || '',
        priority: editTask.priority || 'medium',
        dueDate: editTask.dueDateStr ? editTask.dueDateStr.split('T')[0] : '',
        dueTime: editTask.dueDateStr ? editTask.dueDateStr.split('T')[1]?.substring(0, 5) : '',
        reminder: editTask.reminderStr || '',
        reminderTime: editTask.reminderStr ? editTask.reminderStr.split('T')[1]?.substring(0, 5) : '',
      });
      setZonesLoaded(true);
    }
  }, [editTask]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Handle priority change
  const handlePriorityChange = (priority) => {
    setFormData((prev) => ({ ...prev, priority }));
  };

  // Handle zone selection
  const handleZoneSelect = (zoneName) => {
    setFormData((prev) => ({ ...prev, zone: zoneName }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (formData.title.length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }

    if (!formData.zone) {
      newErrors.zone = 'Please select a zone';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!validateForm()) return;

    setLoading(true);

    try {
      // Build dueDateStr in ISO format
      let dueDateStr = '';
      if (formData.dueDate) {
        const date = formData.dueDate;
        const time = formData.dueTime || '23:59';
        dueDateStr = `${date}T${time}:00`;
      }

      // Build reminderStr in ISO format
      let reminderStr = '';
      if (formData.reminder) {
        const date = formData.reminder;
        const time = formData.reminderTime || '09:00';
        reminderStr = `${date}T${time}:00`;

        // Show notification permission prompt if not granted
        if (permission !== 'granted') {
          await requestPermission();
        }

        // Schedule browser notification
        const reminderDate = new Date(reminderStr);
        if (reminderDate > new Date()) {
          showNotification(`Task Reminder: ${formData.title}`, {
            body: formData.desc || 'Time to work on this task!',
            tag: `task-${Date.now()}`,
          });
        }
      }

      // Build calendarDate (YYYY-MM-DD format for calendar view)
      const calendarDate = formData.dueDate || new Date().toISOString().split('T')[0];

      const taskData = {
        title: formData.title.trim(),
        desc: formData.desc.trim(),
        zone: formData.zone,
        priority: formData.priority,
        dueDateStr,
        reminderStr,
        calendarDate,
      };

      if (editTaskId) {
        await updateTask(editTaskId, taskData);
      } else {
        await addTask(taskData);
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving task:', err);
      setFormError('Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle task deletion
  const handleDelete = async () => {
    if (!editTaskId) return;

    if (window.confirm('Are you sure you want to delete this task?')) {
      setLoading(true);
      try {
        await deleteTask(editTaskId);
        navigate('/dashboard');
      } catch (err) {
        console.error('Error deleting task:', err);
        setFormError('Failed to delete task. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="add-task-screen">
      <div className="add-task-container">
        {/* Header */}
        <header className="add-task-header">
          <Link to="/dashboard" className="add-task-back">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Back
          </Link>
          <h1 className="add-task-title">
            {editTaskId ? 'Edit Task' : 'New Task'}
          </h1>
          <div style={{ width: 60 }} /> {/* Spacer for alignment */}
        </header>

        {/* Form */}
        <form onSubmit={handleSubmit} className="add-task-form">
          {formError && <div className="add-task-error">{formError}</div>}

          {/* Title */}
          <InputField
            label="Task Title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="What needs to be done?"
            required
            error={errors.title}
          />

          {/* Description */}
          <InputField
            label="Description"
            name="desc"
            type="text"
            value={formData.desc}
            onChange={handleChange}
            placeholder="Add more details (optional)"
          />

          {/* Zone Selection */}
          <div className="zone-selection">
            <span className="zone-selection__label">
              Zone <span style={{ color: 'var(--color-accent-pink)' }}>*</span>
            </span>
            {errors.zone && (
              <span className="error-message">{errors.zone}</span>
            )}
            <div className="zone-selection__grid">
              {zones.map((zone) => (
                <ZoneChip
                  key={zone.id}
                  zone={zone}
                  selected={formData.zone === zone.name}
                  onClick={() => handleZoneSelect(zone.name)}
                />
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <label className="zone-selection__label">Priority</label>
            <PriorityPicker
              value={formData.priority}
              onChange={handlePriorityChange}
            />
          </div>

          {/* Due Date */}
          <div className="date-input-wrapper">
            <InputField
              label="Due Date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleChange}
            />
            <InputField
              label="Due Time"
              name="dueTime"
              type="time"
              value={formData.dueTime}
              onChange={handleChange}
            />
          </div>

          {/* Reminder */}
          <div className="date-input-wrapper">
            <InputField
              label="Reminder Date"
              name="reminder"
              type="date"
              value={formData.reminder}
              onChange={handleChange}
            />
            <InputField
              label="Reminder Time"
              name="reminderTime"
              type="time"
              value={formData.reminderTime}
              onChange={handleChange}
            />
          </div>

          {/* Actions */}
          <div className="add-task-actions">
            {editTaskId ? (
              <>
                <DangerButton type="button" onClick={handleDelete} disabled={loading}>
                  Delete
                </DangerButton>
                <SecondaryButton type="button" onClick={() => navigate('/dashboard')}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={loading}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </PrimaryButton>
              </>
            ) : (
              <>
                <SecondaryButton type="button" onClick={() => navigate('/dashboard')}>
                  Cancel
                </SecondaryButton>
                <PrimaryButton type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Task'}
                </PrimaryButton>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
