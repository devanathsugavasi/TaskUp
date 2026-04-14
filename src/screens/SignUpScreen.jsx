import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  StyleSheet, ScrollView, Alert, StatusBar,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import InputField from '../components/InputField';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS, SPACING, RADIUS, SHADOWS } from '../theme';

export default function SignUpScreen({ navigation }) {
  const [form, setForm] = useState({
    name: '', college: '', dept: '', year: '',
    email: '', password: '', confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSignUp = async () => {
    if (!form.name || !form.email || !form.password || !form.college) {
      Alert.alert('Missing Fields', 'Please fill in Name, College, Email and Password.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      Alert.alert('Password Mismatch', 'Password and Confirm Password do not match.');
      return;
    }
    if (form.password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await signUp(form.email.trim(), form.password, form.name, form.college, form.dept, Number(form.year));
    } catch (error) {
      Alert.alert('Sign Up Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.backgroundCream} />

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}
      >
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Join TaskUp and start planning smarter</Text>

      <View style={styles.card}>
        <InputField
          label="Full Name"
          value={form.name}
          onChangeText={v => set('name', v)}
          placeholder="Your full name"
          autoCapitalize="words"
        />

        <InputField
          label="College / University"
          value={form.college}
          onChangeText={v => set('college', v)}
          placeholder="Your institution"
          autoCapitalize="words"
        />

        <InputField
          label="Department / Course"
          value={form.dept}
          onChangeText={v => set('dept', v)}
          placeholder="e.g. Computer Science"
          autoCapitalize="words"
        />

        <InputField
          label="Year of Study"
          value={form.year}
          onChangeText={v => set('year', v)}
          placeholder="1 - 5"
          keyboardType="number-pad"
        />

        <InputField
          label="Email Address"
          value={form.email}
          onChangeText={v => set('email', v)}
          placeholder="you@university.edu"
          keyboardType="email-address"
        />

        <InputField
          label="Password"
          value={form.password}
          onChangeText={v => set('password', v)}
          placeholder="At least 6 characters"
          secureTextEntry
        />

        <InputField
          label="Confirm Password"
          value={form.confirmPassword}
          onChangeText={v => set('confirmPassword', v)}
          placeholder="Re-enter your password"
          secureTextEntry
        />

        <PrimaryButton
          label="Create Account"
          onPress={handleSignUp}
          loading={loading}
          disabled={loading}
          style={{ marginTop: SPACING.sm }}
        />
      </View>

      <TouchableOpacity
        style={styles.linkWrap}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.linkText}>
          Already have an account?{' '}
          <Text style={styles.linkBold}>Log in</Text>
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
  content: {
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
    fontWeight: '800',
    textTransform: 'uppercase',
    color: COLORS.textCharcoal,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.textCharcoal,
    letterSpacing: -1,
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.mutedText,
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
  linkWrap: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
    paddingBottom: SPACING.xl,
  },
  linkText: {
    fontSize: 14,
    color: COLORS.mutedText,
  },
  linkBold: {
    color: COLORS.accentClay, // Hot pink!
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});
