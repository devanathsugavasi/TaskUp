// ============================================
// CALENDAR SCREEN - Monthly Calendar View
// ============================================

import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../contexts/TaskContext';
import { useTheme } from '../hooks/useTheme';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../theme';
import { PRIORITY_LEVELS } from '../contexts/TaskContext';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CalendarScreen({ navigation }) {
  const { tasks } = useTasks();
  const { theme } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const days = [];
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    // Previous month days
    const prevMonth = new Date(currentYear, currentMonth, 0);
    const prevDays = prevMonth.getDate();
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({ date: new Date(currentYear, currentMonth - 1, prevDays - i), isOther: true });
    }

    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      days.push({ date: new Date(currentYear, currentMonth, d), isOther: false });
    }

    // Next month days
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      days.push({ date: new Date(currentYear, currentMonth + 1, d), isOther: true });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Map tasks to dates
  const tasksByDate = useMemo(() => {
    const map = {};
    tasks.forEach((task) => {
      if (task.calendarDate) {
        if (!map[task.calendarDate]) map[task.calendarDate] = [];
        map[task.calendarDate].push(task);
      }
    });
    return map;
  }, [tasks]);

  // Get tasks for selected date
  const selectedDateStr = selectedDate.toISOString().split('T')[0];
  const selectedTasks = tasksByDate[selectedDateStr] || [];

  // Navigation
  const goToPrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Check if date is today
  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is selected
  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString();
  };

  // Format date key
  const formatDateKey = (date) => date.toISOString().split('T')[0];

  // Get zone color
  const getZoneColor = (zoneName) => {
    const colors = {
      Work: '#FF007F', Reading: '#FFD500', Meeting: '#00FF88',
      Food: '#00FFFF', Exam: '#5B4FD4', Personal: '#FF6B6B',
    };
    return colors[zoneName] || '#888';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Calendar</Text>
        <View style={styles.nav}>
          <TouchableOpacity style={styles.navBtn} onPress={goToPrevMonth}>
            <Ionicons name="chevron-back" size={20} color={COLORS.light.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.todayBtn} onPress={goToToday}>
            <Text style={styles.todayBtnText}>Today</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navBtn} onPress={goToNextMonth}>
            <Ionicons name="chevron-forward" size={20} color={COLORS.light.text} />
          </TouchableOpacity>
        </View>
        <Text style={styles.monthYear}>{MONTHS[currentMonth]} {currentYear}</Text>
      </View>

      {/* Weekday Headers */}
      <View style={styles.weekdays}>
        {WEEKDAYS.map((day) => (
          <Text key={day} style={styles.weekday}>{day}</Text>
        ))}
      </View>

      {/* Calendar Grid */}
      <View style={styles.daysGrid}>
        {calendarDays.map((dayInfo, index) => {
          const dateKey = formatDateKey(dayInfo.date);
          const dayTasks = tasksByDate[dateKey] || [];

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.day,
                dayInfo.isOther && styles.dayOther,
                isToday(dayInfo.date) && styles.dayToday,
                isSelected(dayInfo.date) && styles.daySelected,
              ]}
              onPress={() => setSelectedDate(dayInfo.date)}
            >
              <Text style={[
                styles.dayNumber,
                isToday(dayInfo.date) && styles.dayNumberToday,
              ]}>
                {dayInfo.date.getDate()}
              </Text>
              {dayTasks.length > 0 && (
                <View style={styles.dots}>
                  {dayTasks.slice(0, 3).map((task, i) => (
                    <View
                      key={task.id}
                      style={[
                        styles.dot,
                        { backgroundColor: PRIORITY_LEVELS[task.priority]?.color || '#888' }
                      ]}
                    />
                  ))}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Selected Day Tasks */}
      <View style={styles.tasksSection}>
        <View style={styles.tasksSectionHeader}>
          <Text style={styles.tasksSectionTitle}>Tasks</Text>
          <Text style={styles.tasksSectionDate}>
            {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </Text>
        </View>

        <ScrollView style={styles.tasksList}>
          {selectedTasks.length === 0 ? (
            <Text style={styles.noTasks}>No tasks on this day</Text>
          ) : (
            selectedTasks.map((task) => (
              <View key={task.id} style={styles.taskItem}>
                <View style={styles.taskMeta}>
                  <View style={[styles.zoneTag, { backgroundColor: getZoneColor(task.zone) }]}>
                    <Text style={styles.zoneTagText}>{task.zone}</Text>
                  </View>
                  <View style={[styles.priorityTag, { backgroundColor: PRIORITY_LEVELS[task.priority]?.color }]}>
                    <Text style={styles.priorityTagText}>{PRIORITY_LEVELS[task.priority]?.label}</Text>
                  </View>
                </View>
                <Text style={styles.taskTitle}>{task.title}</Text>
                {task.dueDateStr && (
                  <Text style={styles.taskTime}>
                    {new Date(task.dueDateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </Text>
                )}
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.lg,
  },
  title: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xxl,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  navBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.light.card,
    borderWidth: 2,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.md,
  },
  todayBtn: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.light.card,
    borderWidth: 2,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.md,
  },
  todayBtnText: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xs,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  monthYear: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.md,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: COLORS.light.textMuted,
  },
  weekdays: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
    paddingBottom: SPACING.sm,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.light.border,
  },
  weekday: {
    flex: 1,
    textAlign: 'center',
    fontFamily: 'System',
    fontSize: FONT_SIZES.xs,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: COLORS.light.textMuted,
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: COLORS.light.card,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.lg,
    overflow: 'hidden',
  },
  day: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.light.backgroundSecondary,
    padding: 2,
  },
  dayOther: {
    backgroundColor: COLORS.light.backgroundSecondary,
    opacity: 0.5,
  },
  dayToday: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  daySelected: {
    backgroundColor: 'rgba(0, 255, 136, 0.1)',
    borderWidth: 2,
    borderColor: COLORS.accent.mint,
  },
  dayNumber: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
  },
  dayNumberToday: {
    backgroundColor: COLORS.accent.yellow,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
  },
  dots: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 2,
    marginTop: 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 1,
  },
  tasksSection: {
    flex: 1,
    marginTop: SPACING.xl,
  },
  tasksSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  tasksSectionTitle: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.lg,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  tasksSectionDate: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.sm,
    color: COLORS.light.textMuted,
  },
  tasksList: {
    flex: 1,
  },
  noTasks: {
    textAlign: 'center',
    color: COLORS.light.textMuted,
    paddingVertical: SPACING.xl,
  },
  taskItem: {
    backgroundColor: COLORS.light.card,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  taskMeta: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  zoneTag: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.light.border,
  },
  zoneTagText: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#000',
  },
  priorityTag: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.light.border,
  },
  priorityTagText: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: '#000',
  },
  taskTitle: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.md,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  taskTime: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xs,
    color: COLORS.light.textMuted,
    marginTop: SPACING.xs,
  },
});
