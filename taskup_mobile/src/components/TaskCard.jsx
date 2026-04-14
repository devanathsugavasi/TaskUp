// ============================================
// TASK CARD COMPONENT - Neo-Brutalism Design
// FIX: Extracted ZoneCard logic to separate component to fix hooks violation
// ============================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES, SHADOWS } from '../theme';
import { useTasks } from '../contexts/TaskContext';
import { PRIORITY_LEVELS } from '../contexts/TaskContext';

export default function TaskCard({ task, onEdit }) {
  const { toggleTaskComplete, deleteTask } = useTasks();
  const isCompleted = task.status === 'completed';
  const priority = PRIORITY_LEVELS[task.priority] || PRIORITY_LEVELS.medium;

  // Handle completion toggle
  const handleToggle = async () => {
    try {
      await toggleTaskComplete(task.id, task.status);
    } catch (err) {
      Alert.alert('Error', 'Failed to update task');
    }
  };

  // Handle delete with confirmation
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
              await deleteTask(task.id);
            } catch (err) {
              Alert.alert('Error', 'Failed to delete task');
            }
          },
        },
      ]
    );
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    const dateOnly = dateStr.split('T')[0];
    if (dateOnly === todayStr) return 'Today';
    if (dateOnly === tomorrowStr) return 'Tomorrow';

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Get zone color
  const getZoneColor = (zoneName) => {
    const colors = {
      Work: '#FF007F',
      Reading: '#FFD500',
      Meeting: '#00FF88',
      Food: '#00FFFF',
      Exam: '#5B4FD4',
      Personal: '#FF6B6B',
    };
    return colors[zoneName] || '#888888';
  };

  return (
    <TouchableOpacity
      style={[styles.card, isCompleted && styles.cardCompleted]}
      onPress={() => onEdit && onEdit(task)}
      activeOpacity={0.8}
    >
      {/* Checkbox */}
      <TouchableOpacity style={styles.checkbox} onPress={handleToggle}>
        <Ionicons
          name={isCompleted ? 'checkmark' : 'square-outline'}
          size={24}
          color={isCompleted ? COLORS.accent.mint : COLORS.light.border}
        />
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.content}>
        <Text
          style={[styles.title, isCompleted && styles.titleCompleted]}
          numberOfLines={2}
        >
          {task.title}
        </Text>

        {task.desc && (
          <Text style={styles.description} numberOfLines={2}>
            {task.desc}
          </Text>
        )}

        <View style={styles.meta}>
          {task.zone && (
            <View style={[styles.zone, { backgroundColor: getZoneColor(task.zone) }]}>
              <Text style={styles.zoneText}>{task.zone}</Text>
            </View>
          )}
          <View style={[styles.priority, { backgroundColor: priority.color }]}>
            <Text
              style={[
                styles.priorityText,
                task.priority === 'medium' || task.priority === 'low'
                  ? styles.priorityTextDark
                  : null,
              ]}
            >
              {priority.label}
            </Text>
          </View>
          {task.dueDateStr && (
            <View style={styles.date}>
              <Ionicons name="calendar-outline" size={12} color={COLORS.light.textMuted} />
              <Text style={styles.dateText}>{formatDate(task.dueDateStr)}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => onEdit && onEdit(task)}>
          <Ionicons name="pencil" size={18} color={COLORS.light.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={18} color={COLORS.accent.pink} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.light.card,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOWS.md,
  },
  cardCompleted: {
    opacity: 0.7,
  },
  checkbox: {
    marginRight: SPACING.md,
    paddingTop: 2,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.md,
    fontWeight: '800',
    textTransform: 'uppercase',
    color: COLORS.light.text,
    marginBottom: SPACING.xs,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  description: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.light.textSecondary,
    marginBottom: SPACING.sm,
  },
  meta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  zone: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.light.border,
  },
  zoneText: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#000',
  },
  priority: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.light.border,
  },
  priorityText: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#FFF',
  },
  priorityTextDark: {
    color: '#000',
  },
  date: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xs,
    color: COLORS.light.textMuted,
  },
  actions: {
    marginLeft: SPACING.sm,
    justifyContent: 'center',
    gap: SPACING.xs,
  },
  actionBtn: {
    padding: SPACING.xs,
  },
});
