// ============================================
// PRIMARY BUTTON COMPONENT - Neo-Brutalism Design
// ============================================

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZES, SHADOWS } from '../theme';

export default function PrimaryButton({
  children,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  fullWidth = false,
  style,
}) {
  const getBackgroundColor = () => {
    switch (variant) {
      case 'secondary':
        return COLORS.light.card;
      case 'danger':
        return COLORS.accent.pink;
      case 'mint':
        return COLORS.accent.mint;
      default:
        return COLORS.accent.yellow;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: getBackgroundColor() },
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#000' : '#FFF'} />
      ) : (
        <Text
          style={[
            styles.text,
            variant === 'primary' && styles.textDark,
            variant === 'mint' && styles.textDark,
          ]}
        >
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    ...SHADOWS.md,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.md,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: '#FFF',
  },
  textDark: {
    color: '#000',
  },
});
