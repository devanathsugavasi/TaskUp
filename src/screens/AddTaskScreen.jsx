import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, Alert, StatusBar,
} from 'react-native';
import { useTasks } from '../contexts/TaskContext';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import ZoneChip from '../components/ZoneChip';
import { COLORS, PRIORITY_COLORS, PRIORITY_BG, SPACING, RADIUS, SHADOWS } from '../theme';

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

export default function AddTaskScreen({ route, navigation }) {
  const existing = route.params?.task;
  const { zones, addTask, updateTask, deleteTask } = useTasks();

  const [title, setTitle] = useState(existing?.title || '');
  const [desc, setDesc] = useState(existing?.desc || '');
  const [zone, setZone] = useState(existing?.zone || '');
  const [priority, setPriority] = useState(existing?.priority || 'medium');
  const [dueDate, setDueDate] = useState(existing?.dueDateStr || '');
  const [reminder, setReminder] = useState(existing?.reminderStr || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!zone && zones.length > 0) setZone(zones[0].name);
  }, [zones]);

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Required', 'Task title cannot be empty.');
      return;
    }
    if (!zone) {
      Alert.alert('Required', 'Please select a zone.');
      return;
    }
    setLoading(true);
    const payload = {
      title: title.trim(),
      desc,
      zone,
      priority,
      dueDateStr: dueDate,
      reminderStr: reminder,
      calendarDate: dueDate.match(/^\d{4}-\d{2}-\d{2}/) ? dueDate.slice(0, 10) : '',
    };
    try {
      if (existing) {
        await updateTask(existing.id, payload);
      } else {
        await addTask(payload);
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally { setLoading(false); }
  };

  const handleDelete = () => {
    Alert.alert('Delete Task', 'Are you sure? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => { await deleteTask(existing.id); navigation.goBack(); },
      },
    ]);
  };

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.backgroundCream} />
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <View style={styles.topRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.cancel}>Close</Text>
          </TouchableOpacity>
          <Text style={styles.screenTitle}>{existing ? 'Edit Task' : 'New Task'}</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Form card */}
        <View style={styles.card}>
          <InputField
            label="Task Title"
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Submit assignment"
          />

          <InputField
            label="Description"
            value={desc}
            onChangeText={setDesc}
            placeholder="Add details..."
            multiline
          />

          {/* Zone selection */}
          <Text style={styles.label}>ZONE</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipScroll}>
            {zones.map(z => (
              <ZoneChip
                key={z.id}
                zone={z}
                selected={zone === z.name}
                onPress={() => setZone(z.name)}
              />
            ))}
          </ScrollView>

          {/* Priority selection */}
          <Text style={styles.label}>PRIORITY</Text>
          <View style={styles.chipRow}>
            {PRIORITIES.map(p => {
              const isActive = priority === p;
              const color = PRIORITY_COLORS[p];
              const bg = PRIORITY_BG[p];
              return (
                <TouchableOpacity
                  key={p}
                  style={[
                    styles.priorityChip,
                    { borderColor: color },
                    isActive && { backgroundColor: color },
                  ]}
                  onPress={() => setPriority(p)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.priorityChipText,
                    { color: isActive ? COLORS.white : color },
                  ]}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <InputField
            label="Due Date"
            value={dueDate}
            onChangeText={setDueDate}
            placeholder="e.g. 2026-03-15, 5:00 PM"
          />

          <InputField
            label="Reminder"
            value={reminder}
            onChangeText={setReminder}
            placeholder="e.g. 30 min before"
          />

          <PrimaryButton
            label={existing ? 'Update Task' : 'Save Task'}
            onPress={handleSave}
            loading={loading}
            disabled={loading}
            style={{ marginTop: SPACING.sm }}
          />

          {existing && (
            <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
              <Text style={styles.deleteTxt}>Delete Task</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
  },
  container: {
    padding: SPACING.xxl,
    paddingTop: 56,
    paddingBottom: 80,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  cancel: {
    fontSize: 14,
    color: COLORS.primaryMoss,
    fontWeight: '600',
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: COLORS.textCharcoal,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    padding: SPACING.xxl,
    borderWidth: 3,
    borderColor: COLORS.softBorder,
    ...SHADOWS.elevated,
  },
  label: {
    fontSize: 12,
    fontWeight: '900',
    color: COLORS.textCharcoal,
    letterSpacing: 1.5,
    marginBottom: SPACING.sm,
    marginTop: SPACING.sm,
  },
  chipScroll: {
    marginBottom: SPACING.lg,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: SPACING.lg,
  },
  priorityChip: {
    borderWidth: 2,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    ...SHADOWS.soft,
  },
  priorityChipText: {
    fontSize: 14,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  deleteBtn: {
    marginTop: SPACING.xl,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.roseLight,
    alignItems: 'center',
  },
  deleteTxt: {
    color: COLORS.criticalRose,
    fontWeight: '700',
    fontSize: 14,
  },
});
