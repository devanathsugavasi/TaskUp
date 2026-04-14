import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, Alert, KeyboardAvoidingView,
  Platform, StatusBar, ScrollView,
} from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // Send password reset email via Firebase Auth
  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert('Enter Email', 'Please enter your email address above, then tap Forgot Password.');
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert('Email Sent', 'A password reset link has been sent to your email.');
    } catch (error) {
      Alert.alert('Error', 'Could not send reset email. Check the email address.');
    }
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Missing Fields', 'Please enter both email and password.');
      return;
    }
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (error) {
      const msg = error.code === 'auth/invalid-credential'
        ? 'Incorrect email or password.'
        : error.message;
      Alert.alert('Login Failed', msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.backgroundCream} />

      {/* Back navigation */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      {/* Logo */}
      <View style={styles.logoWrap}>
        <View style={styles.logoBox}>
          <Text style={styles.logoT}>T</Text>
          <View style={styles.logoAccent} />
        </View>
      </View>

      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>Sign in to continue planning</Text>

      {/* Form card */}
      <View style={styles.card}>
        <InputField
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="you@university.edu"
          keyboardType="email-address"
        />

        <InputField
          label="Password"
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
        />

        <TouchableOpacity style={styles.forgotWrap} onPress={handleForgotPassword}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <PrimaryButton
          label="Log In"
          onPress={handleLogin}
          loading={loading}
          disabled={loading}
        />
      </View>

      {/* Sign up link */}
      <TouchableOpacity
        style={styles.linkWrap}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.linkText}>
          New here?{' '}
          <Text style={styles.linkBold}>Create account</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
  },
  scrollContent: {
    padding: SPACING.xxl,
    paddingTop: 56,
    paddingBottom: SPACING.section,
  },
  backBtn: {
    marginBottom: SPACING.xxl,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.primaryMoss,
  },
  logoWrap: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  logoBox: {
    width: 64,
    height: 64,
    backgroundColor: COLORS.primaryMoss,
    borderWidth: 3,
    borderColor: COLORS.softBorder,
    borderRadius: 0,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.button,
  },
  logoT: {
    fontSize: 34,
    fontWeight: '900',
    color: COLORS.white,
    lineHeight: 42,
  },
  logoAccent: {
    position: 'absolute',
    bottom: 12,
    right: 10,
    width: 16,
    height: 3,
    backgroundColor: COLORS.accentClay,
    borderRadius: 2,
    transform: [{ rotate: '-18deg' }],
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.textCharcoal,
    textAlign: 'center',
    letterSpacing: -1,
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.mutedText,
    textAlign: 'center',
    marginTop: SPACING.xs,
    marginBottom: SPACING.xxl,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    padding: SPACING.xxl,
    borderWidth: 3,
    borderColor: COLORS.softBorder,
    ...SHADOWS.elevated,
  },
  forgotWrap: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.xl,
    marginTop: -SPACING.sm,
  },
  forgotText: {
    fontSize: 13,
    color: COLORS.accentClay,
    fontWeight: '600',
  },
  linkWrap: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
  },
  linkText: {
    fontSize: 14,
    color: COLORS.mutedText,
  },
  linkBold: {
    color: COLORS.accentClay,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});
