// ============================================
// SIGN UP SCREEN - New User Registration
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
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../theme';

export default function SignUpScreen({ navigation }) {
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    college: '',
    dept: '',
    year: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.college.trim()) {
      newErrors.college = 'College name is required';
    }

    if (!formData.dept.trim()) {
      newErrors.dept = 'Department is required';
    }

    const yearNum = parseInt(formData.year, 10);
    if (!formData.year) {
      newErrors.year = 'Year is required';
    } else if (isNaN(yearNum) || yearNum < 1 || yearNum > 6) {
      newErrors.year = 'Enter a valid year (1-6)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await signup(formData.email, formData.password, {
        name: formData.name.trim(),
        college: formData.college.trim(),
        dept: formData.dept.trim(),
        year: parseInt(formData.year, 10),
      });
    } catch (err) {
      const errorMessages = {
        'auth/email-already-in-use': 'An account with this email already exists',
        'auth/invalid-email': 'Invalid email address',
        'auth/weak-password': 'Password is too weak',
        'auth/network-request-failed': 'Network error. Check your connection',
      };
      Alert.alert('Signup Failed', errorMessages[err.code] || 'Please try again.');
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join TaskUp and organize your studies</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.row}>
            <View style={styles.halfField}>
              <InputField
                label="Full Name"
                value={formData.name}
                onChangeText={(v) => handleChange('name', v)}
                placeholder="Alex Johnson"
                error={errors.name}
                required
              />
            </View>
            <View style={styles.halfField}>
              <InputField
                label="Year"
                value={formData.year}
                onChangeText={(v) => handleChange('year', v)}
                placeholder="1"
                keyboardType="numeric"
                maxLength={1}
                error={errors.year}
                required
              />
            </View>
          </View>

          <InputField
            label="College"
            value={formData.college}
            onChangeText={(v) => handleChange('college', v)}
            placeholder="State University"
            error={errors.college}
            required
          />

          <InputField
            label="Department"
            value={formData.dept}
            onChangeText={(v) => handleChange('dept', v)}
            placeholder="Computer Science"
            error={errors.dept}
            required
          />

          <InputField
            label="Email"
            value={formData.email}
            onChangeText={(v) => handleChange('email', v)}
            placeholder="you@college.edu"
            keyboardType="email-address"
            autoCapitalize="none"
            error={errors.email}
            required
          />

          <InputField
            label="Password"
            value={formData.password}
            onChangeText={(v) => handleChange('password', v)}
            placeholder="At least 6 characters"
            secureTextEntry
            error={errors.password}
            required
          />

          <InputField
            label="Confirm Password"
            value={formData.confirmPassword}
            onChangeText={(v) => handleChange('confirmPassword', v)}
            placeholder="Repeat your password"
            secureTextEntry
            error={errors.confirmPassword}
            required
          />

          <PrimaryButton
            onPress={handleSignUp}
            disabled={loading}
            fullWidth
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </PrimaryButton>

          {/* Login Link */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  title: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xxl,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: FONT_SIZES.md,
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
  row: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  halfField: {
    flex: 1,
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
});
