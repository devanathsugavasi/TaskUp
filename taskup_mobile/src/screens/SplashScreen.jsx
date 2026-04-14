// ============================================
// SPLASH SCREEN - Initial Loading Screen
// FIX: Shows loading indicator while Firebase resolves auth state
// ============================================

import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { COLORS, SPACING, FONT_SIZES } from '../theme';

export default function SplashScreen({ navigation }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigation.replace('Main');
      } else {
        navigation.replace('Login');
      }
    }
  }, [user, loading, navigation]);

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <View style={styles.logoMark}>
          <View style={styles.logoBar} />
        </View>
        <Text style={styles.logoText}>TaskUp</Text>
      </View>

      {/* Tagline */}
      <Text style={styles.tagline}>Plan clearly. Finish on time.</Text>

      {/* Loading */}
      <ActivityIndicator size="large" color={COLORS.accent.pink} style={styles.spinner} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.light.background,
    padding: SPACING.xl,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  logoMark: {
    width: 64,
    height: 64,
    backgroundColor: '#000',
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  logoBar: {
    width: 32,
    height: 8,
    backgroundColor: COLORS.accent.mint,
    borderRadius: 2,
  },
  logoText: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
    color: COLORS.light.text,
  },
  tagline: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: COLORS.light.textMuted,
    marginBottom: SPACING.xxl,
  },
  spinner: {
    marginBottom: SPACING.md,
  },
  loadingText: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.sm,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: COLORS.light.textMuted,
  },
});
