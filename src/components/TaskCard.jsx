import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { COLORS, PRIORITY_COLORS, PRIORITY_BG, RADIUS, SPACING, SHADOWS, getZoneColor } from '../theme';

export default function TaskCard({ task, onPress, onComplete }) {
  const priorityColor = PRIORITY_COLORS[task.priority] || PRIORITY_COLORS.medium;
  const priorityBg = PRIORITY_BG[task.priority] || PRIORITY_BG.medium;
  const zoneColor = getZoneColor(task.zone);
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true, speed: 50 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.card}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.95}
      >
        {/* Completion checkbox */}
        {onComplete && (
          <TouchableOpacity
            style={[styles.checkbox, { borderColor: priorityColor }]}
            onPress={onComplete}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <View style={[styles.checkInner, { backgroundColor: priorityColor + '30' }]} />
          </TouchableOpacity>
        )}

        <View style={styles.body}>
          {/* Title */}
          <Text style={styles.title} numberOfLines={1}>{task.title}</Text>

          {/* Description */}
          {task.desc ? (
            <Text style={styles.desc} numberOfLines={1}>{task.desc}</Text>
          ) : null}

          {/* Meta row: zone + priority */}
          <View style={styles.meta}>
            <View style={[styles.zonePill, { backgroundColor: zoneColor.bg }]}>
              <Text style={[styles.zoneText, { color: zoneColor.accent }]}>{task.zone}</Text>
            </View>

            <View style={[styles.priorityPill, { backgroundColor: priorityBg }]}>
              <View style={[styles.priorityDot, { backgroundColor: priorityColor }]} />
              <Text style={[styles.priorityText, { color: priorityColor }]}>
                {(task.priority || 'medium').charAt(0).toUpperCase() + (task.priority || 'medium').slice(1)}
              </Text>
            </View>
          </View>

          {/* Due date */}
          {task.dueDateStr ? (
            <Text style={styles.due}>Due: {task.dueDateStr}</Text>
          ) : null}
        </View>

        {/* Priority accent bar */}
        <View style={[styles.accentBar, { backgroundColor: priorityColor }]} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.softSurface,
    borderRadius: RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: COLORS.softBorder,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: RADIUS.sm,
    borderWidth: 2,
    marginRight: SPACING.md,
    marginTop: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkInner: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  body: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textCharcoal,
    marginBottom: SPACING.xs,
    letterSpacing: -0.1,
  },
  desc: {
    fontSize: 13,
    color: COLORS.mutedText,
    marginBottom: SPACING.sm,
    lineHeight: 20,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.xs,
  },
  zonePill: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
  },
  zoneText: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  priorityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.pill,
    gap: SPACING.xs + 1,
  },
  priorityDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '700',
  },
  due: {
    fontSize: 11,
    color: COLORS.mutedText,
    marginTop: SPACING.xs,
    fontWeight: '500',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    borderTopLeftRadius: RADIUS.xl,
    borderBottomLeftRadius: RADIUS.xl,
  },
});
