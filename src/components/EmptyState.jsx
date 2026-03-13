import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../theme';

export default function EmptyState({ title, message, style }) {
  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.iconCircle}>
        <Text style={styles.iconText}>—</Text>
      </View>
      <Text style={styles.title}>{title || 'Nothing here yet'}</Text>
      <Text style={styles.message}>{message || 'Your tasks will appear here.'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingVertical: SPACING.section,
    paddingHorizontal: SPACING.xxxl,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.mossLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  iconText: {
    fontSize: 24,
    color: COLORS.primaryMoss,
    fontWeight: '300',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.textCharcoal,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: COLORS.mutedText,
    textAlign: 'center',
    lineHeight: 22,
  },
});
