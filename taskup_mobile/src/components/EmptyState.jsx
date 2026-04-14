// ============================================
// EMPTY STATE COMPONENT
// ============================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../theme';
import PrimaryButton from './PrimaryButton';

export default function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onAction,
}) {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
      {actionLabel && onAction && (
        <PrimaryButton onPress={onAction} style={styles.button}>
          {actionLabel}
        </PrimaryButton>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xxl,
  },
  icon: {
    width: 80,
    height: 80,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.light.backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xl,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: COLORS.light.text,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: FONT_SIZES.md,
    color: COLORS.light.textMuted,
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: SPACING.lg,
  },
  button: {
    marginTop: SPACING.md,
  },
});
