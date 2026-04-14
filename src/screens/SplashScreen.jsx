import React from 'react';
import { View, Text, StyleSheet, StatusBar } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import SecondaryButton from '../components/SecondaryButton';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme';

export default function SplashScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.backgroundCream} />

      <View style={styles.spacer} />

      {/* Logo mark */}
      <View style={styles.logoContainer}>
        <View style={styles.logoBox}>
          <Text style={styles.logoLetter}>T</Text>
          <View style={styles.logoAccent} />
        </View>
      </View>

      {/* Wordmark */}
      <Text style={styles.appName}>TaskUp</Text>
      <Text style={styles.subtitle}>Smart Student Planner</Text>

      <View style={styles.divider} />

      {/* Headline */}
      <Text style={styles.headline}>Plan clearly.{'\n'}Finish on time.</Text>

      <View style={styles.spacer} />

      {/* CTAs */}
      <View style={styles.ctaGroup}>
        <PrimaryButton
          label="Log In"
          onPress={() => navigation.navigate('Login')}
        />
        <View style={{ height: SPACING.md }} />
        <SecondaryButton
          label="Create Account"
          onPress={() => navigation.navigate('SignUp')}
        />
      </View>

      <View style={styles.bottomPad} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.xxxl,
  },
  spacer: { flex: 1 },
  logoContainer: {
    marginBottom: SPACING.xl,
  },
  logoBox: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.primaryMoss,
    borderWidth: 3,
    borderColor: COLORS.softBorder,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.card,
  },
  logoLetter: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.white,
    lineHeight: 52,
  },
  logoAccent: {
    position: 'absolute',
    bottom: 16,
    right: 14,
    width: 20,
    height: 3,
    backgroundColor: COLORS.accentClay,
    borderRadius: 2,
    transform: [{ rotate: '-18deg' }],
  },
  appName: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.textCharcoal,
    letterSpacing: -1,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.mutedText,
    marginTop: SPACING.xs,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
  divider: {
    width: 40,
    height: 2,
    backgroundColor: COLORS.softBorder,
    marginVertical: SPACING.xxl,
    borderRadius: 1,
  },
  headline: {
    fontSize: 22,
    fontWeight: '300',
    color: COLORS.textCharcoal,
    textAlign: 'center',
    lineHeight: 32,
    fontStyle: 'italic',
    letterSpacing: 0.2,
  },
  ctaGroup: {
    width: '100%',
    paddingHorizontal: SPACING.lg,
  },
  bottomPad: {
    height: SPACING.section,
  },
});
