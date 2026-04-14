import React, { useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, SectionList,
  StyleSheet, StatusBar, Alert,
} from 'react-native';
import { useTasks } from '../contexts/TaskContext';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import SectionHeader from '../components/SectionHeader';
import { COLORS, PRIORITY_ORDER, PRIORITY_COLORS, SPACING, RADIUS } from '../theme';

export default function TodayScreen() {
  const { tasks, fetchTasks, completeTask } = useTasks();

  useEffect(() => { fetchTasks(); }, []);

  const pendingTasks = [...tasks]
    .filter(t => t.status === 'pending')
    .sort((a, b) => (PRIORITY_ORDER[a.priority] || 3) - (PRIORITY_ORDER[b.priority] || 3));

  // Group by priority
  const groups = {
    urgent: pendingTasks.filter(t => t.priority === 'urgent'),
    high: pendingTasks.filter(t => t.priority === 'high'),
    medium: pendingTasks.filter(t => t.priority === 'medium'),
    low: pendingTasks.filter(t => t.priority === 'low'),
  };

  const sections = [
    { title: 'Urgent', data: groups.urgent, key: 'urgent' },
    { title: 'Important', data: groups.high, key: 'high' },
    { title: 'Routine', data: groups.medium, key: 'medium' },
    { title: 'Low Priority', data: groups.low, key: 'low' },
  ].filter(s => s.data.length > 0);

  // Progress
  const totalToday = tasks.filter(t => t.status === 'pending' || t.status === 'completed').length;
  const doneToday = tasks.filter(t => t.status === 'completed').length;
  const progressPct = totalToday > 0 ? Math.round((doneToday / totalToday) * 100) : 0;

  const handleComplete = (item) => {
    Alert.alert('Complete Task', `Mark "${item.title}" as done?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Done', onPress: () => completeTask(item.id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.backgroundCream} />

      {/* Header */}
      <View style={styles.headerWrap}>
        <View>
          <Text style={styles.header}>Today's Focus</Text>
          <Text style={styles.sub}>
            {pendingTasks.length} task{pendingTasks.length !== 1 ? 's' : ''} remaining
          </Text>
        </View>

        {/* Progress indicator */}
        <View style={styles.progressCircle}>
          <Text style={styles.progressValue}>{progressPct}%</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressBarWrap}>
        <View style={styles.progressTrack}>
          <View style={[
            styles.progressFill,
            { width: `${progressPct}%` },
            progressPct >= 70 && { backgroundColor: COLORS.successSage },
          ]} />
        </View>
        <Text style={styles.progressLabel}>
          {progressPct >= 100 ? 'All tasks done' : progressPct >= 70 ? 'You are on track' : 'Keep going'}
        </Text>
      </View>

      {/* Sections */}
      {pendingTasks.length === 0 ? (
        <EmptyState
          title="All done"
          message="You have completed all your tasks. Take a well-deserved break."
        />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionRow}>
              <View style={[styles.sectionDot, { backgroundColor: PRIORITY_COLORS[section.key] }]} />
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Text style={styles.sectionCount}>{section.data.length}</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              onPress={() => handleComplete(item)}
              onComplete={() => handleComplete(item)}
            />
          )}
          stickySectionHeadersEnabled={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
  },
  headerWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: 56,
    paddingBottom: SPACING.sm,
  },
  header: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.textCharcoal,
    letterSpacing: -1,
    textTransform: 'uppercase',
  },
  sub: {
    fontSize: 13,
    color: COLORS.mutedText,
    marginTop: SPACING.xs,
    fontWeight: '500',
  },
  progressCircle: {
    width: 56,
    height: 56,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primaryMoss, // Black
    borderWidth: 3,
    borderColor: COLORS.textCharcoal,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.button,
  },
  progressValue: {
    fontSize: 16,
    fontWeight: '900',
    color: COLORS.white,
    fontFamily: 'Courier',
  },
  progressBarWrap: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: SPACING.xl,
    paddingTop: SPACING.md,
  },
  progressTrack: {
    height: 12,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.textCharcoal,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  progressFill: {
    height: 12,
    backgroundColor: COLORS.warningAmber, // Yellow by default
    borderRadius: 0,
  },
  progressLabel: {
    fontSize: 12,
    color: COLORS.mutedText,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 100,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.xl,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  sectionDot: {
    width: 12,
    height: 12,
    borderRadius: RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.textCharcoal,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '800',
    textTransform: 'uppercase',
    color: COLORS.textCharcoal,
    flex: 1,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.mutedText,
    fontFamily: 'Courier',
  },
});
