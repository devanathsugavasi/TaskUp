// ============================================
// PROGRESS BAR COMPONENT
// ============================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../theme';

export default function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = true,
  variant = 'default',
}) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  const getFillColor = () => {
    switch (variant) {
      case 'danger':
        return COLORS.accent.pink;
      case 'warning':
        return COLORS.accent.yellow;
      case 'info':
        return COLORS.accent.cyan;
      default:
        return COLORS.accent.mint;
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { width: `${percentage}%`, backgroundColor: getFillColor() },
          ]}
        />
      </View>
      {showPercentage && (
        <Text style={styles.percentage}>{Math.round(percentage)}%</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  label: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.sm,
    fontWeight: '900',
    textTransform: 'uppercase',
    minWidth: 80,
  },
  track: {
    flex: 1,
    height: 24,
    backgroundColor: COLORS.light.backgroundSecondary,
    borderWidth: 2,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.md,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
  percentage: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    minWidth: 45,
    textAlign: 'right',
    color: COLORS.light.textMuted,
  },
});
