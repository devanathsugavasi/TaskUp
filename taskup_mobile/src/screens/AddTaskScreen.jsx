// ============================================
// ADD TASK SCREEN - Create/Edit Tasks
// FIX: Implemented date picker using @react-native-community/datetimepicker
// FIX: Implemented reminder scheduling using expo-notifications
// ============================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTasks } from '../contexts/TaskContext';
import { useNotification } from '../hooks/useNotification';
import InputField from '../components/InputField';
import ZoneChip from '../components/ZoneChip';
import PriorityPicker from '../components/PriorityPicker';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../theme';

export default function AddTaskScreen({ navigation, route }) {
  const { tasks, zones, addTask, updateTask, deleteTask } = useTasks();
  const { requestPermission, scheduleNotification } = useNotification();

  const editTaskId = route.params?.taskId;
  const editTask = editTaskId ? tasks.find((t) => t.id === editTaskId) : null;

  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [zone, setZone] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState(new Date());
  const [hasDueDate, setHasDueDate] = useState(false);
  const [reminder, setReminder] = useState(new Date());
  const [hasReminder, setHasReminder] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showReminderDatePicker, setShowReminderDatePicker] = useState(false);
  const [showReminderTimePicker, setShowReminderTimePicker] = useState(false);
  const [pickerMode, setPickerMode] = useState('date'); // 'date' or 'time'

  // Pre-fill form if editing
  useEffect(() => {
    if (editTask) {
      setTitle(editTask.title || '');
      setDesc(editTask.desc || '');
      setZone(editTask.zone || zones[0]?.name || '');
      setPriority(editTask.priority || 'medium');

      if (editTask.dueDateStr) {
        const due = new Date(editTask.dueDateStr);
        setDueDate(due);
        setHasDueDate(true);
      }

      if (editTask.reminderStr) {
        const rem = new Date(editTask.reminderStr);
        setReminder(rem);
        setHasReminder(true);
      }
    } else if (zones.length > 0 && !zone) {
      setZone(zones[0].name);
    }
  }, [editTask]);

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Task title is required';
    } else if (title.length > 200) {
      newErrors.title = 'Title must be 200 characters or less';
    }
    if (!zone) {
      newErrors.zone = 'Please select a zone';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Build dates
      const dueDateStr = hasDueDate ? dueDate.toISOString() : '';
      const reminderStr = hasReminder ? reminder.toISOString() : '';

      // Schedule notification if reminder is set
      if (hasReminder && reminder > new Date()) {
        await requestPermission();
        await scheduleNotification(
          `Task Reminder: ${title}`,
          desc || 'Time to work on this task!',
          reminder
        );
      }

      const taskData = {
        title: title.trim(),
        desc: desc.trim(),
        zone,
        priority,
        dueDateStr,
        reminderStr,
        calendarDate: hasDueDate ? dueDate.toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
      };

      if (editTaskId) {
        await updateTask(editTaskId, taskData);
      } else {
        await addTask(taskData);
      }

      navigation.goBack();
    } catch (err) {
      Alert.alert('Error', 'Failed to save task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle delete
  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTask(editTaskId);
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  // Date picker handlers
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(dueDate);
      newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      setDueDate(newDate);
      setHasDueDate(true);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(dueDate);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setDueDate(newDate);
      setHasDueDate(true);
    }
  };

  const handleReminderDateChange = (event, selectedDate) => {
    setShowReminderDatePicker(false);
    if (selectedDate) {
      const newDate = new Date(reminder);
      newDate.setFullYear(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
      setReminder(newDate);
      setHasReminder(true);
    }
  };

  const handleReminderTimeChange = (event, selectedTime) => {
    setShowReminderTimePicker(false);
    if (selectedTime) {
      const newDate = new Date(reminder);
      newDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
      setReminder(newDate);
      setHasReminder(true);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color={COLORS.light.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>
            {editTaskId ? 'Edit Task' : 'New Task'}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Title */}
          <InputField
            label="Task Title"
            value={title}
            onChangeText={setTitle}
            placeholder="What needs to be done?"
            error={errors.title}
          />

          {/* Description */}
          <InputField
            label="Description (Optional)"
            value={desc}
            onChangeText={setDesc}
            placeholder="Add more details"
            multiline
          />

          {/* Zone Selection */}
          <View style={styles.field}>
            <Text style={styles.label}>Zone *</Text>
            {errors.zone && <Text style={styles.error}>{errors.zone}</Text>}
            <View style={styles.zonesGrid}>
              {zones.map((z) => (
                <ZoneChip
                  key={z.id}
                  zone={z}
                  selected={zone === z.name}
                  onPress={() => setZone(z.name)}
                />
              ))}
            </View>
          </View>

          {/* Priority */}
          <View style={styles.field}>
            <Text style={styles.label}>Priority</Text>
            <PriorityPicker value={priority} onChange={setPriority} />
          </View>

          {/* Due Date */}
          <View style={styles.field}>
            <Text style={styles.label}>Due Date</Text>
            <View style={styles.dateRow}>
              <TouchableOpacity
                style={[styles.dateBtn, hasDueDate && styles.dateBtnActive]}
                onPress={() => {
                  setPickerMode('date');
                  setShowDatePicker(true);
                }}
              >
                <Ionicons name="calendar" size={20} color={hasDueDate ? '#000' : COLORS.light.textMuted} />
                <Text style={[styles.dateBtnText, hasDueDate && styles.dateBtnTextActive]}>
                  {hasDueDate ? formatDate(dueDate) : 'Select date'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.timeBtn, hasDueDate && styles.timeBtnActive]}
                onPress={() => {
                  setPickerMode('time');
                  setShowTimePicker(true);
                }}
                disabled={!hasDueDate}
              >
                <Ionicons name="time" size={20} color={hasDueDate ? '#000' : COLORS.light.textMuted} />
                <Text style={[styles.timeBtnText, hasDueDate && styles.timeBtnTextActive]}>
                  {hasDueDate ? formatTime(dueDate) : '--:--'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Reminder */}
          <View style={styles.field}>
            <Text style={styles.label}>Reminder (Optional)</Text>
            <View style={styles.dateRow}>
              <TouchableOpacity
                style={[styles.dateBtn, hasReminder && styles.dateBtnActive]}
                onPress={() => {
                  setPickerMode('date');
                  setShowReminderDatePicker(true);
                }}
              >
                <Ionicons name="notifications" size={20} color={hasReminder ? '#000' : COLORS.light.textMuted} />
                <Text style={[styles.dateBtnText, hasReminder && styles.dateBtnTextActive]}>
                  {hasReminder ? formatDate(reminder) : 'Set reminder'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.timeBtn, hasReminder && styles.timeBtnActive]}
                onPress={() => {
                  setPickerMode('time');
                  setShowReminderTimePicker(true);
                }}
                disabled={!hasReminder}
              >
                <Ionicons name="time" size={20} color={hasReminder ? '#000' : COLORS.light.textMuted} />
                <Text style={[styles.timeBtnText, hasReminder && styles.timeBtnTextActive]}>
                  {hasReminder ? formatTime(reminder) : '--:--'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          {editTaskId ? (
            <>
              <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
                <Text style={styles.deleteText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <PrimaryButton onPress={handleSubmit} disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </PrimaryButton>
            </>
          ) : (
            <>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <PrimaryButton onPress={handleSubmit} disabled={loading} fullWidth>
                {loading ? 'Creating...' : 'Create Task'}
              </PrimaryButton>
            </>
          )}
        </View>
      </ScrollView>

      {/* Date/Time Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={dueDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={dueDate}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleTimeChange}
        />
      )}
      {showReminderDatePicker && (
        <DateTimePicker
          value={reminder}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleReminderDateChange}
          minimumDate={new Date()}
        />
      )}
      {showReminderTimePicker && (
        <DateTimePicker
          value={reminder}
          mode="time"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={handleReminderTimeChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.xl,
    paddingBottom: SPACING.md,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.light.border,
  },
  headerTitle: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xxl,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  form: {
    marginBottom: SPACING.xl,
  },
  field: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.sm,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  error: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.accent.pink,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  zonesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dateRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  dateBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.light.card,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.md,
  },
  dateBtnActive: {
    backgroundColor: COLORS.accent.yellow,
  },
  dateBtnText: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.light.textMuted,
  },
  dateBtnTextActive: {
    color: '#000',
  },
  timeBtn: {
    width: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    backgroundColor: COLORS.light.card,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.md,
  },
  timeBtnActive: {
    backgroundColor: COLORS.accent.yellow,
  },
  timeBtnText: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    color: COLORS.light.textMuted,
  },
  timeBtnTextActive: {
    color: '#000',
  },
  actions: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  deleteBtn: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.accent.pink,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.md,
  },
  deleteText: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.sm,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: '#FFF',
  },
  cancelBtn: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    backgroundColor: COLORS.light.card,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.md,
  },
  cancelText: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.sm,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: COLORS.light.text,
  },
});
