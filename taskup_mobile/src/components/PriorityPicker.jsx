// ============================================
// PRIORITY PICKER COMPONENT - Neo-Brutalism Design
// ============================================

import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../theme';
import { PRIORITY_LEVELS } from '../contexts/TaskContext';

const PRIORITIES = Object.entries(PRIORITY_LEVELS).map(([key, value]) => ({
  value: key,
  ...value,
}));

export default function PriorityPicker({ value, onChange }) {
  return (
    <View style={styles.container}>
      {PRIORITIES.map((priority) => (
        <TouchableOpacity
          key={priority.value}
          style={[
            styles.option,
            value === priority.value && {
              backgroundColor: priority.color,
              borderColor: priority.color,
            },
          ]}
          onPress={() => onChange(priority.value)}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.indicator,
              value === priority.value && styles.indicatorSelected,
            ]}
          />
          <Text
            style={[
              styles.label,
              value === priority.value && styles.labelSelected,
            ]}
          >
            {priority.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.light.card,
    borderWidth: 2,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.md,
  },
  indicator: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.light.card,
  },
  indicatorSelected: {
    backgroundColor: '#000',
  },
  label: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.sm,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: COLORS.light.text,
  },
  labelSelected: {
    color: '#000',
  },
});
