/**
 * App.js — Root Entry Point (Mobile)
 * ─────────────────────────────────────────────────────
 * UPGRADED:
 * - Ionicons for tab bar icons (replaces letter placeholders)
 * - Loading screen while Firebase resolves auth state
 * - ErrorBoundary wrapping NavigationContainer
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SHADOWS, RADIUS } from './src/theme';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { TaskProvider } from './src/contexts/TaskContext';

import SplashScreen from './src/screens/SplashScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ZonesScreen from './src/screens/ZonesScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import AddTaskScreen from './src/screens/AddTaskScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import TodayScreen from './src/screens/TodayScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ManageZonesScreen from './src/screens/ManageZonesScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Ionicons icon names for each tab
const TAB_ICONS = {
  Dashboard: { active: 'grid', inactive: 'grid-outline' },
  Calendar:  { active: 'calendar', inactive: 'calendar-outline' },
  AddTask:   { active: 'add', inactive: 'add' },
  Today:     { active: 'today', inactive: 'today-outline' },
  Profile:   { active: 'person', inactive: 'person-outline' },
};

function TabIcon({ name, focused }) {
  const isAdd = name === 'AddTask';
  const icons = TAB_ICONS[name] || { active: 'ellipse', inactive: 'ellipse-outline' };
  const iconName = focused ? icons.active : icons.inactive;

  if (isAdd) {
    // FAB-style center button
    return (
      <View style={styles.fabIcon}>
        <Ionicons name="add" size={26} color={COLORS.textCharcoal} />
      </View>
    );
  }

  return (
    <View style={[styles.iconWrap, focused && styles.iconActive]}>
      <Ionicons name={iconName} size={20} color={focused ? COLORS.textCharcoal : COLORS.mutedText} />
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: COLORS.textCharcoal,
        tabBarInactiveTintColor: COLORS.mutedText,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ tabBarLabel: 'Planner' }} />
      <Tab.Screen name="Calendar" component={CalendarScreen} options={{ tabBarLabel: 'Calendar' }} />
      <Tab.Screen name="AddTask" component={AddTaskScreen} options={{ tabBarLabel: '' }} />
      <Tab.Screen name="Today" component={TodayScreen} options={{ tabBarLabel: 'Today' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarLabel: 'Profile' }} />
    </Tab.Navigator>
  );
}

// Loading screen shown while Firebase resolves auth state
function AuthLoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <View style={styles.loadingSpinner}>
        <ActivityIndicator size="large" color={COLORS.textCharcoal} />
      </View>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

function RootNavigator() {
  const { user, loading } = useAuth();

  // Show loading screen while auth is resolving
  if (loading) return <AuthLoadingScreen />;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade' }}>
      {user ? (
        <>
          <Stack.Screen name="Zones" component={ZonesScreen} />
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="ManageZones" component={ManageZonesScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

// Simple Error Boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, info) {
    console.error('App Error:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.errorTitle}>Something Went Wrong</Text>
          <Text style={styles.errorMsg}>Please restart the app.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TaskProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </TaskProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.backgroundCream,
    borderTopWidth: 3,
    borderTopColor: COLORS.softBorder,
    elevation: 0,
    height: 72,
    paddingBottom: 10,
    paddingTop: 10,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  iconWrap: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  iconActive: {
    backgroundColor: COLORS.mossLight,
    borderRadius: RADIUS.sm,
  },
  fabIcon: {
    width: 52,
    height: 52,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.warningAmber,
    borderWidth: 3,
    borderColor: COLORS.softBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...SHADOWS.button,
  },
  // Loading screen styles
  loadingContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingSpinner: {
    width: 48,
    height: 48,
    borderWidth: 3,
    borderColor: COLORS.softBorder,
    backgroundColor: COLORS.warningAmber,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    ...SHADOWS.soft,
  },
  loadingText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: COLORS.textCharcoal,
  },
  // Error boundary styles
  errorTitle: {
    fontSize: 22,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: COLORS.textCharcoal,
    marginBottom: 8,
  },
  errorMsg: {
    fontSize: 14,
    color: COLORS.mutedText,
  },
});
