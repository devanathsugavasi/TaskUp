// ============================================
// LOGIN SCREEN - User Authentication
// FIX: Implemented Forgot Password functionality
// ============================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../theme';

export default function LoginScreen({ navigation }) {
  const { login, resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // Handle login form submission
  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      // Navigation happens via auth state change
    } catch (err) {
      const errorMessages = {
        'auth/invalid-email': 'Invalid email address format',
        'auth/user-disabled': 'This account has been disabled',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/too-many-requests': 'Too many failed attempts. Please try again later',
        'auth/invalid-credential': 'Invalid email or password',
      };
      setError(errorMessages[err.code] || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // FIX: Handle password reset
  const handleForgotPassword = async () => {
    if (!forgotEmail.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(forgotEmail);
      setForgotSent(true);
    } catch (err) {
      const errorMessages = {
        'auth/invalid-email': 'Invalid email address format',
        'auth/user-not-found': 'No account found with this email',
      };
      Alert.alert(
        'Error',
        errorMessages[err.code] || 'Failed to send reset email. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <View style={styles.logoMark}>
              <View style={styles.logoBar} />
            </View>
            <Text style={styles.logoText}>TaskUp</Text>
          </View>
          <Text style={styles.tagline}>Plan clearly. Finish on time.</Text>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          <Text style={styles.title}>Log In</Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@college.edu"
            keyboardType="email-address"
            autoCapitalize="none"
            required
          />

          <InputField
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            required
          />

          {/* Forgot Password Button */}
          <TouchableOpacity
            style={styles.forgotBtn}
            onPress={() => setShowForgotModal(true)}
          >
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <PrimaryButton
            onPress={handleLogin}
            disabled={loading}
            fullWidth
          >
            {loading ? 'Signing In...' : 'Log In'}
          </PrimaryButton>

          {/* Sign Up Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.link}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Forgot Password Modal */}
      <Modal
        visible={showForgotModal}
        animationType="slide"
        transparent
        onRequestClose={() => setShowForgotModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reset Password</Text>

            {forgotSent ? (
              <View style={styles.successContainer}>
                <Ionicons
                  name="checkmark-circle"
                  size={64}
                  color={COLORS.accent.mint}
                />
                <Text style={styles.successText}>
                  Password reset email sent! Check your inbox and follow the instructions.
                </Text>
                <PrimaryButton onPress={() => setShowForgotModal(false)}>
                  Done
                </PrimaryButton>
              </View>
            ) : (
              <>
                <Text style={styles.modalText}>
                  Enter your email address and we'll send you a link to reset your password.
                </Text>

                <InputField
                  label="Email"
                  value={forgotEmail}
                  onChangeText={setForgotEmail}
                  placeholder="you@college.edu"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />

                <View style={styles.modalActions}>
                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={() => {
                      setShowForgotModal(false);
                      setForgotSent(false);
                      setForgotEmail('');
                    }}
                  >
                    <Text style={styles.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <PrimaryButton
                    onPress={handleForgotPassword}
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Reset Email'}
                  </PrimaryButton>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.xl,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  logoMark: {
    width: 48,
    height: 48,
    backgroundColor: '#000',
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.sm,
  },
  logoBar: {
    width: 24,
    height: 6,
    backgroundColor: COLORS.accent.mint,
    borderRadius: 2,
  },
  logoText: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xxxl,
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  tagline: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    textTransform: 'uppercase',
    color: COLORS.light.textMuted,
  },
  form: {
    backgroundColor: COLORS.light.card,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  title: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xxl,
    fontWeight: '900',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  error: {
    padding: SPACING.md,
    backgroundColor: 'rgba(255, 0, 127, 0.1)',
    borderWidth: 2,
    borderColor: COLORS.accent.pink,
    borderRadius: RADIUS.md,
    color: COLORS.accent.pink,
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.lg,
    marginTop: -SPACING.sm,
  },
  forgotText: {
    color: COLORS.light.textMuted,
    fontSize: FONT_SIZES.sm,
    textDecorationLine: 'underline',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    marginTop: SPACING.lg,
    paddingTop: SPACING.lg,
    borderTopWidth: 2,
    borderTopColor: COLORS.light.backgroundSecondary,
  },
  footerText: {
    color: COLORS.light.textMuted,
    fontSize: FONT_SIZES.sm,
  },
  link: {
    color: COLORS.accent.pink,
    fontSize: FONT_SIZES.sm,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    backgroundColor: COLORS.light.card,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
  },
  modalTitle: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xxl,
    fontWeight: '900',
    textTransform: 'uppercase',
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  modalText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.light.textSecondary,
    marginBottom: SPACING.lg,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.md,
  },
  cancelBtn: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  cancelText: {
    color: COLORS.light.textMuted,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  successContainer: {
    alignItems: 'center',
    gap: SPACING.md,
  },
  successText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.light.textSecondary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
});
