// ============================================
// TODAY SCREEN - Priority-Grouped Daily Tasks
// FIX: Uses tasks from TaskContext (fixes stale Profile stats)
// ============================================

import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../contexts/TaskContext';
import TaskCard from '../components/TaskCard';
import ProgressBar from '../components/ProgressBar';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../theme';
import { PRIORITY_LEVELS } from '../contexts/TaskContext';

const PRIORITY_ORDER = ['urgent', 'high', 'medium', 'low'];

export default function TodayScreen({ navigation }) {
  const { tasks, getTasksByPriority } = useTasks();

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter today's pending tasks and group by priority
  const todayTasks = useMemo(() => {
    const pendingTasks = tasks.filter(
      (t) => t.calendarDate === todayStr && t.status === 'pending'
    );
    return getTasksByPriority(pendingTasks);
  }, [tasks, todayStr, getTasksByPriority]);

  // Calculate progress
  const totalPending = Object.values(todayTasks).flat().length;
  const todayAllTasks = tasks.filter((t) => t.calendarDate === todayStr);
  const total = todayAllTasks.length;
  const completed = total - totalPending;
  const allDone = totalPending === 0 && total > 0;

  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const handleEditTask = (task) => {
    navigation.navigate('AddTask', { taskId: task.id });
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Today</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>

        {/* Progress */}
        <View style={styles.progressCard}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Daily Progress</Text>
            <Text style={styles.progressStat}>
              {completed}/{total}
            </Text>
          </View>
          <ProgressBar
            value={completed}
            max={total || 1}
            variant={allDone ? 'default' : 'info'}
          />
        </View>

        {/* All Done State */}
        {allDone ? (
          <View style={styles.allDone}>
            <View style={styles.allDoneIcon}>
              <Ionicons name="checkmark" size={40} color="#000" />
            </View>
            <Text style={styles.allDoneTitle}>All Done!</Text>
            <Text style={styles.allDoneText}>
              Great job! You've completed all your tasks for today.
            </Text>
          </View>
        ) : totalPending === 0 ? (
          <View style={styles.allDone}>
            <View style={styles.allDoneIcon}>
              <Ionicons name="calendar-outline" size={40} color={COLORS.light.textMuted} />
            </View>
            <Text style={styles.allDoneTitle}>No Tasks Today</Text>
            <Text style={styles.allDoneText}>
              You have no tasks scheduled for today. Enjoy your free time!
            </Text>
          </View>
        ) : (
          /* Priority Sections */
          PRIORITY_ORDER.map((priority) => {
            const sectionTasks = todayTasks[priority] || [];
            if (sectionTasks.length === 0) return null;

            const priorityInfo = PRIORITY_LEVELS[priority];

            return (
              <View key={priority} style={styles.section}>
                <View style={styles.sectionHeader}>
                  <View
                    style={[
                      styles.sectionIndicator,
                      { backgroundColor: priorityInfo.color },
                    ]}
                  />
                  <Text style={styles.sectionTitle}>{priorityInfo.label}</Text>
                  <Text style={styles.sectionCount}>
                    {sectionTasks.length} {sectionTasks.length === 1 ? 'task' : 'tasks'}
                  </Text>
                </View>
                <View style={styles.sectionTasks}>
                  {sectionTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
                  ))}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
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
    marginBottom: SPACING.xl,
  },
  title: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  date: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.md,
    color: COLORS.light.textMuted,
  },
  progressCard: {
    backgroundColor: COLORS.light.card,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  progressLabel: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.lg,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  progressStat: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  allDone: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  allDoneIcon: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.accent.mint,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  allDoneTitle: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xl,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  allDoneText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.light.textMuted,
    textAlign: 'center',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  sectionIndicator: {
    width: 8,
    height: 32,
    borderRadius: RADIUS.sm,
  },
  sectionTitle: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.lg,
    fontWeight: '900',
    textTransform: 'uppercase',
    flex: 1,
  },
  sectionCount: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.sm,
    color: COLORS.light.textMuted,
  },
  sectionTasks: {
    paddingLeft: SPACING.lg,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.light.backgroundSecondary,
  },
});
