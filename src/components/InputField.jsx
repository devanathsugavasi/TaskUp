import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../theme';

export default function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  autoCapitalize = 'none',
  autoCorrect = false,
  multiline = false,
  style,
  inputStyle,
}) {
  return (
    <View style={[styles.wrapper, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <TextInput
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          inputStyle,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={COLORS.mutedText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoCorrect={autoCorrect}
        multiline={multiline}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.lg,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.primaryMoss,
    letterSpacing: 1.2,
    marginBottom: SPACING.sm,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: COLORS.softSurface,
    borderWidth: 1,
    borderColor: COLORS.softBorder,
    color: COLORS.textCharcoal,
    padding: SPACING.lg,
    borderRadius: RADIUS.md,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 50,
  },
  inputMultiline: {
    minHeight: 90,
    textAlignVertical: 'top',
    paddingTop: SPACING.lg,
  },
});
