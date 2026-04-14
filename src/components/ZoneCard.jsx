/**
 * ZoneCard — Individual zone card with animated entrance
 * ─────────────────────────────────────────────────────
 * Extracted as a standalone component to comply with React
 * Hooks rules (useRef and useEffect must be called at the
 * top level of a component, not inside a callback like renderItem).
 *
 * This fixes the original bug where hooks were called inside
 * the FlatList renderItem function in ManageZonesScreen.
 */

import React, { useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme';

export default function ZoneCard({ zone, index, onEdit, onDelete }) {
  // Animation value for fade-in entrance — hooks at top level (correct)
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Run entrance animation on mount with staggered delay
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      delay: index * 60,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View style={{
      opacity: fadeAnim,
      transform: [{
        translateY: fadeAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [12, 0],
        }),
      }],
    }}>
      <View style={styles.zoneCard}>
        {/* Color accent stripe at the top */}
        <View style={[styles.colorStripe, { backgroundColor: zone.color || COLORS.primaryMoss }]} />

        <View style={styles.zoneBody}>
          <View style={styles.zoneInfo}>
            <View style={[styles.colorDot, { backgroundColor: zone.color || COLORS.primaryMoss }]} />
            <Text style={styles.zoneName}>{zone.name}</Text>
          </View>

          <View style={styles.zoneActions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => onEdit(zone)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => onDelete(zone)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  zoneCard: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    marginBottom: SPACING.md,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: COLORS.softBorder,
    ...SHADOWS.soft,
  },
  colorStripe: {
    height: 3,
    width: '100%',
  },
  zoneBody: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.lg,
  },
  zoneInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: SPACING.md,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: COLORS.textCharcoal,
  },
  zoneName: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.textCharcoal,
    textTransform: 'uppercase',
    flex: 1,
  },
  zoneActions: {
    flexDirection: 'row',
    gap: SPACING.lg,
  },
  actionBtn: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
  },
  editText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.accentClay,
  },
  deleteText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.criticalRose,
  },
});
