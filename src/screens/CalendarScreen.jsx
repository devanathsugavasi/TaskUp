import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, StatusBar, ScrollView, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTasks } from '../contexts/TaskContext';
import { COLORS, PRIORITY_COLORS, SPACING, RADIUS, SHADOWS, getZoneColor } from '../theme';

export default function CalendarScreen() {
  const { tasks, fetchTasks } = useTasks();
  const [selected, setSelected] = useState('');
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => { fetchTasks(); }, []);

  useEffect(() => {
    const marks = {};
    tasks.forEach(task => {
      if (!task.calendarDate || task.status === 'completed') return;
      const key = task.calendarDate;
      if (key) {
        marks[key] = {
          marked: true,
          dotColor: PRIORITY_COLORS[task.priority] || COLORS.primaryMoss,
          selected: key === selected,
          selectedColor: COLORS.primaryMoss,
        };
      }
    });
    if (selected && !marks[selected]) {
      marks[selected] = { selected: true, selectedColor: COLORS.primaryMoss };
    }
    setMarkedDates(marks);
  }, [tasks, selected]);

  const todayStr = new Date().toISOString().split('T')[0];
  const selectedTasks = selected
    ? tasks.filter(t => t.calendarDate === selected && t.status === 'pending')
    : [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.backgroundCream} />

      <View style={styles.headerWrap}>
        <Text style={styles.header}>Calendar</Text>
        <Text style={styles.headerSub}>Plan your schedule</Text>
      </View>

      <View style={styles.calendarCard}>
        <Calendar
          style={styles.calendar}
          theme={{
            backgroundColor: COLORS.white,
            calendarBackground: COLORS.white,
            textSectionTitleColor: COLORS.mutedText,
            selectedDayBackgroundColor: COLORS.primaryMoss,
            selectedDayTextColor: COLORS.white,
            todayTextColor: COLORS.accentClay,
            dayTextColor: COLORS.textCharcoal,
            textDisabledColor: 'rgba(26,26,26,0.2)',
            dotColor: COLORS.accentClay,
            monthTextColor: COLORS.textCharcoal,
            textMonthFontWeight: '800',
            textDayFontWeight: '500',
            textDayHeaderFontWeight: '700',
            arrowColor: COLORS.primaryMoss,
          }}
          markedDates={markedDates}
          onDayPress={day => setSelected(day.dateString)}
          current={todayStr}
        />
      </View>

      {selected ? (
        <View style={styles.dayPanel}>
          <Text style={styles.dayTitle}>{selected}</Text>
          {selectedTasks.length === 0 ? (
            <Text style={styles.noTasks}>No tasks due on this day.</Text>
          ) : (
            <ScrollView>
              {selectedTasks.map(t => {
                const zoneColor = getZoneColor(t.zone);
                return (
                  <View key={t.id} style={styles.taskRow}>
                    <View style={[styles.taskAccent, { backgroundColor: PRIORITY_COLORS[t.priority] || COLORS.primaryMoss }]} />
                    <View style={styles.taskBody}>
                      <Text style={styles.taskTitle}>{t.title}</Text>
                      <View style={styles.taskMeta}>
                        <View style={[styles.zonePill, { backgroundColor: zoneColor.bg }]}>
                          <Text style={[styles.zoneText, { color: zoneColor.accent }]}>{t.zone}</Text>
                        </View>
                        <Text style={styles.taskPriority}>
                          {(t.priority || 'medium').charAt(0).toUpperCase() + (t.priority || 'medium').slice(1)}
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}
        </View>
      ) : (
        <View style={styles.hint}>
          <Text style={styles.hintText}>Tap a date to see tasks due that day.</Text>
          <Text style={styles.hintNote}>Tasks appear on calendar when you set a due date in YYYY-MM-DD format.</Text>
        </View>
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
    paddingHorizontal: SPACING.xl,
    paddingTop: 56,
    paddingBottom: SPACING.lg,
  },
  header: {
    fontSize: 30,
    fontWeight: '900',
    color: COLORS.textCharcoal,
    letterSpacing: -1,
    textTransform: 'uppercase',
  },
  headerSub: {
    fontSize: 13,
    color: COLORS.mutedText,
    marginTop: SPACING.xs,
  },
  calendarCard: {
    marginHorizontal: SPACING.lg,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: COLORS.softBorder,
    ...SHADOWS.elevated,
  },
  calendar: {
    borderRadius: RADIUS.sm,
  },
  dayPanel: {
    marginHorizontal: SPACING.xl,
    marginTop: SPACING.xl,
  },
  dayTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textCharcoal,
    marginBottom: SPACING.md,
    fontFamily: 'Courier',
  },
  noTasks: {
    color: COLORS.mutedText,
    fontSize: 14,
  },
  taskRow: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.softBorder,
    overflow: 'hidden',
    ...SHADOWS.soft,
  },
  taskAccent: {
    width: 3,
    height: '100%',
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderTopLeftRadius: RADIUS.sm,
    borderBottomLeftRadius: RADIUS.sm,
  },
  taskBody: {
    flex: 1,
    paddingLeft: SPACING.sm,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: COLORS.textCharcoal,
    marginBottom: SPACING.xs,
    textTransform: 'uppercase',
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  zonePill: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: 2,
    borderRadius: RADIUS.sm,
    borderWidth: 1.5,
    borderColor: COLORS.softBorder,
  },
  zoneText: {
    fontSize: 10,
    fontWeight: '600',
  },
  taskPriority: {
    fontSize: 11,
    color: COLORS.mutedText,
    fontWeight: '500',
  },
  hint: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
    paddingHorizontal: SPACING.xxxl,
  },
  hintText: {
    color: COLORS.mutedText,
    fontSize: 14,
    fontWeight: '500',
  },
  hintNote: {
    color: COLORS.infoMist,
    fontSize: 12,
    marginTop: SPACING.sm,
    textAlign: 'center',
    lineHeight: 18,
  },
});
