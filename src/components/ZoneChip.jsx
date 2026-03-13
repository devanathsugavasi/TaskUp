import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS, SPACING, getZoneColor } from '../theme';

export default function ZoneChip({ zone, selected, onPress }) {
  const zoneColor = zone?.color
    ? { accent: zone.color, bg: zone.color + '18' }
    : getZoneColor(zone?.name);

  return (
    <TouchableOpacity
      style={[
        styles.chip,
        { borderColor: zoneColor.accent },
        selected && { backgroundColor: zoneColor.accent },
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.text,
          { color: selected ? COLORS.white : zoneColor.accent },
        ]}
      >
        {zone?.name || zone}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderWidth: 1.5,
    borderRadius: RADIUS.pill,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 1,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.transparent,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
