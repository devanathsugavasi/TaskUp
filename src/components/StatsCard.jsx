import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../theme';

export default function StatsCard({ value, label, color, style }) {
  const accentColor = color || COLORS.primaryMoss;

  return (
    <View style={[styles.card, style]}>
      <Text style={[styles.value, { color: accentColor }]}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.softSurface,
    borderRadius: RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.softBorder,
    minWidth: '47%',
    ...SHADOWS.soft,
  },
  value: {
    fontSize: 28,
    fontWeight: '800',
    fontFamily: 'Courier',
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.mutedText,
    marginTop: SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
});
