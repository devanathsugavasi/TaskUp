import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, SHADOWS, getZoneColor } from '../theme';

export default function ZoneChip({ zone, selected, onPress }) {
  const zoneColor = zone?.color
    ? { accent: zone.color, bg: '#FFFFFF' }
    : getZoneColor(zone?.name);

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        { backgroundColor: selected ? zoneColor.accent : zoneColor.bg },
        selected && styles.chipSelected,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.text,
          { color: selected ? COLORS.textCharcoal : COLORS.textCharcoal },
        ]}
      >
        {zone?.name || zone}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 2,
    borderColor: COLORS.softBorder,
    borderRadius: RADIUS.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    marginRight: SPACING.sm,
    marginBottom: SPACING.md,
    ...SHADOWS.soft,
  },
  chipSelected: {
    borderWidth: 3,
    ...SHADOWS.button,
  },
  text: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
