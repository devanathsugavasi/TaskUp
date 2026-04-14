// ============================================
// ZONE CHIP COMPONENT - Neo-Brutalism Design
// FIX: Extracted from ManageZonesScreen to fix hooks violation
// ============================================

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS, FONT_SIZES } from '../theme';

export default function ZoneChip({
  zone,
  selected = false,
  onPress,
  onDelete,
  showDelete = false,
}) {
  return (
    <TouchableOpacity
      style={[
        styles.chip,
        selected && { backgroundColor: zone.color, borderColor: zone.color },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={[styles.colorDot, { backgroundColor: zone.color }]} />
      <Text style={[styles.name, selected && styles.nameSelected]}>{zone.name}</Text>
      {showDelete && onDelete && (
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={(e) => {
            e.stopPropagation();
            onDelete(zone);
          }}
        >
          <Text style={styles.deleteText}>X</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    backgroundColor: COLORS.light.card,
    borderWidth: 2,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.md,
    marginRight: SPACING.sm,
    marginBottom: SPACING.sm,
  },
  colorDot: {
    width: 12,
    height: 12,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  name: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.sm,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: COLORS.light.text,
  },
  nameSelected: {
    color: '#000',
  },
  deleteBtn: {
    marginLeft: SPACING.xs,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0,0,0,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: 10,
    fontWeight: '900',
    color: COLORS.light.textMuted,
  },
});
