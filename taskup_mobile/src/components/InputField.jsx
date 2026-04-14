// ============================================
// INPUT FIELD COMPONENT - Neo-Brutalism Design
// ============================================

import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../theme';

export default function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  required = false,
  disabled = false,
  keyboardType = 'default',
  secureTextEntry = false,
  multiline = false,
  maxLength,
  ...props
}) {
  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          disabled && styles.inputDisabled,
          multiline && styles.multiline,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.light.textMuted}
        editable={!disabled}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        maxLength={maxLength}
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.md,
  },
  label: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.sm,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 1,
    color: COLORS.light.text,
    marginBottom: SPACING.sm,
  },
  required: {
    color: COLORS.accent.pink,
  },
  input: {
    backgroundColor: COLORS.light.card,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONT_SIZES.md,
    color: COLORS.light.text,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  inputError: {
    borderColor: COLORS.accent.pink,
  },
  inputDisabled: {
    opacity: 0.6,
    backgroundColor: COLORS.light.backgroundSecondary,
  },
  multiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  error: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.accent.pink,
    fontWeight: '600',
    marginTop: SPACING.xs,
  },
});
