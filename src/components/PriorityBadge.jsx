import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PRIORITY_COLORS, PRIORITY_BG, RADIUS, SPACING } from '../theme';

export default function PriorityBadge({ priority }) {
  const color = PRIORITY_COLORS[priority] || PRIORITY_COLORS.medium;
  const bg = PRIORITY_BG[priority] || PRIORITY_BG.medium;
  const label = priority ? priority.charAt(0).toUpperCase() + priority.slice(1) : 'Medium';

  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={[styles.text, { color }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 1,
    borderRadius: RADIUS.pill,
    gap: SPACING.xs + 2,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  text: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
