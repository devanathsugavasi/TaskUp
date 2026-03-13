import React, { useRef, useEffect } from 'react';
import { ScrollView, TouchableOpacity, Text, View, StyleSheet, Animated } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../theme';

export default function FilterTabs({ tabs, activeTab, onTabPress, style }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={[styles.scrollView, style]}
      contentContainerStyle={styles.container}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, isActive && styles.tabActive]}
            onPress={() => onTabPress(tab.key)}
            activeOpacity={0.8}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    maxHeight: 48,
    marginBottom: SPACING.md,
  },
  container: {
    paddingHorizontal: SPACING.xl,
    gap: SPACING.sm,
  },
  tab: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 2,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.mossLight,
    borderWidth: 1,
    borderColor: COLORS.transparent,
  },
  tabActive: {
    backgroundColor: COLORS.primaryMoss,
    borderColor: COLORS.primaryMoss,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.mutedText,
  },
  tabTextActive: {
    color: COLORS.white,
  },
});
