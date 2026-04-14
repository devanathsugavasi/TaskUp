// ============================================
// DASHBOARD SCREEN - Main Task List
// FIX: Fixed Today filter bug
// ============================================

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import TaskCard from '../components/TaskCard';
import ProgressBar from '../components/ProgressBar';
import EmptyState from '../components/EmptyState';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../theme';

export default function DashboardScreen({ navigation }) {
  const { userProfile } = useAuth();
  const { tasks, zones, getFilteredTasks } = useTasks();
  const [activeZone, setActiveZone] = useState('all');
  const [showToday, setShowToday] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // FIX: Calculate today's progress correctly
  const todayStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter((t) => t.calendarDate === today);
    const completed = todayTasks.filter((t) => t.status === 'completed').length;
    const total = todayTasks.length;
    return { completed, total };
  }, [tasks]);

  const overallStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    return { total, completed };
  }, [tasks]);

  // FIX: Filter tasks properly - the "Today" filter now actually filters
  const filteredTasks = useMemo(() => {
    return getFilteredTasks({
      zone: activeZone !== 'all' ? activeZone : undefined,
      today: showToday,
      status: 'pending',
    });
  }, [getFilteredTasks, activeZone, showToday]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 500);
  };

  const handleEditTask = (task) => {
    navigation.navigate('AddTask', { taskId: task.id });
  };

  const firstName = userProfile?.name?.split(' ')[0] || 'there';

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{getGreeting()}, {firstName}</Text>
            <Text style={styles.subtitle}>
              {showToday ? "Here's your plan for today" : 'All your pending tasks'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => navigation.navigate('AddTask')}
          >
            <Ionicons name="add" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Progress Cards */}
        <View style={styles.progressRow}>
          <View style={styles.progressCard}>
            <Text style={styles.progressLabel}>Today</Text>
            <ProgressBar
              value={todayStats.completed}
              max={todayStats.total || 1}
              showPercentage={false}
            />
            <Text style={styles.progressStat}>
              {todayStats.completed}/{todayStats.total}
            </Text>
          </View>
          <View style={styles.progressCard}>
            <Text style={styles.progressLabel}>Overall</Text>
            <ProgressBar
              value={overallStats.completed}
              max={overallStats.total || 1}
              showPercentage={false}
            />
            <Text style={styles.progressStat}>
              {overallStats.completed}/{overallStats.total}
            </Text>
          </View>
        </View>

        {/* Zone Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsContainer}
        >
          <TouchableOpacity
            style={[styles.tab, activeZone === 'all' && !showToday && styles.tabActive]}
            onPress={() => {
              setActiveZone('all');
              setShowToday(false);
            }}
          >
            <Text style={[styles.tabText, activeZone === 'all' && !showToday && styles.tabTextActive]}>
              All ({tasks.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, showToday && styles.tabActive]}
            onPress={() => {
              setActiveZone('all');
              setShowToday(true);
            }}
          >
            <Ionicons
              name="today"
              size={16}
              color={showToday ? '#000' : COLORS.light.textMuted}
            />
            <Text style={[styles.tabText, showToday && styles.tabTextActive]}>
              Today ({todayStats.total})
            </Text>
          </TouchableOpacity>
          {zones.map((zone) => {
            const zoneTasks = tasks.filter((t) => t.zone === zone.name);
            return (
              <TouchableOpacity
                key={zone.id}
                style={[styles.tab, activeZone === zone.name && !showToday && styles.tabActive]}
                onPress={() => {
                  setActiveZone(zone.name);
                  setShowToday(false);
                }}
              >
                <View style={[styles.zoneDot, { backgroundColor: zone.color }]} />
                <Text style={[styles.tabText, activeZone === zone.name && !showToday && styles.tabTextActive]}>
                  {zone.name} ({zoneTasks.length})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Task List */}
        <View style={styles.taskList}>
          {filteredTasks.length === 0 ? (
            <EmptyState
              title={showToday ? 'No tasks today' : 'No tasks yet'}
              message={
                showToday
                  ? 'Enjoy your free time!'
                  : 'Add your first task to get started'
              }
              actionLabel={!showToday ? 'Add Task' : undefined}
              onAction={!showToday ? () => navigation.navigate('AddTask') : undefined}
            />
          ) : (
            filteredTasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
            ))
          )}
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SPACING.xl,
  },
  greeting: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xxl,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
    color: COLORS.light.textMuted,
  },
  addBtn: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.accent.yellow,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  progressRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  progressCard: {
    flex: 1,
    backgroundColor: COLORS.light.card,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  progressLabel: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.sm,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
  },
  progressStat: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.sm,
    color: COLORS.light.textMuted,
    textAlign: 'right',
    marginTop: SPACING.xs,
  },
  tabsContainer: {
    marginBottom: SPACING.lg,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    marginRight: SPACING.sm,
    backgroundColor: COLORS.light.card,
    borderWidth: 2,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.md,
  },
  tabActive: {
    backgroundColor: COLORS.accent.yellow,
  },
  tabText: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: COLORS.light.textMuted,
  },
  tabTextActive: {
    color: '#000',
  },
  zoneDot: {
    width: 10,
    height: 10,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  taskList: {
    flex: 1,
  },
});
