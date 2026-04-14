import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated } from 'react-native';
import { COLORS, TYPE, RADIUS, SHADOWS, SPACING } from '../theme';

export default function PrimaryButton({ label, onPress, disabled, loading, style }) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 50 }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 50 }).start();
  };

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity
        style={[styles.button, disabled && styles.disabled, style]}
        onPress={onPress}
        disabled={disabled || loading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
      >
        <Text style={[styles.label, disabled && styles.labelDisabled]}>{loading ? 'Please wait...' : label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: COLORS.warningAmber, // Yellow is more aggressive and brutalist
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xxl,
    borderRadius: RADIUS.sm,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
    borderWidth: 3,
    borderColor: COLORS.softBorder,
    ...SHADOWS.button,
  },
  disabled: {
    backgroundColor: COLORS.softSurface,
    ...SHADOWS.soft, // reduced shadow when disabled
  },
  label: {
    color: COLORS.textCharcoal, // High contrast black on yellow
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase', // Brutalist energy
  },
  labelDisabled: {
    color: COLORS.mutedText,
  }
});
