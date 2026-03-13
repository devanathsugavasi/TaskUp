import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS } from '../theme';

export default function SearchBar({ value, onChangeText, placeholder, style }) {
  return (
    <View style={[styles.wrapper, style]}>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || 'Search tasks...'}
        placeholderTextColor={COLORS.mutedText}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: SPACING.lg,
  },
  input: {
    backgroundColor: COLORS.softSurface,
    borderWidth: 1,
    borderColor: COLORS.softBorder,
    color: COLORS.textCharcoal,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADIUS.lg,
    fontSize: 15,
    lineHeight: 22,
    minHeight: 46,
    ...SHADOWS.soft,
  },
});
