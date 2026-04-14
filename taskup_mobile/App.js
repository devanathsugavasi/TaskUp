// ============================================
// APP.JS - Navigation Setup with Error Boundary
// ============================================

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import { TaskProvider } from './src/contexts/TaskContext';

// Screens
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

import { COLORS, FONT_SIZES } from './src/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorMessage}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

// Loading fallback for auth check
function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

// Main Tab Navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'grid' : 'grid-outline';
              break;
            case 'Calendar':
              iconName = focused ? 'calendar' : 'calendar-outline';
              break;
            case 'AddTask':
              iconName = 'add';
              break;
            case 'Today':
              iconName = focused ? 'today' : 'today-outline';
              break;
            case 'Profile':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'ellipse';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.accent.pink,
        tabBarInactiveTintColor: COLORS.light.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.light.card,
          borderTopWidth: 3,
          borderTopColor: COLORS.light.border,
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'System',
          fontSize: 10,
          fontWeight: '900',
          textTransform: 'uppercase',
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen
        name="AddTask"
        component={AddTaskScreen}
        options={{
          tabBarLabel: 'Add',
          tabBarIcon: ({ color }) => (
            <View
              style={{
                backgroundColor: COLORS.accent.yellow,
                width: 48,
                height: 48,
                borderRadius: 24,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: -10,
                borderWidth: 3,
                borderColor: COLORS.light.border,
              }}
            >
              <Ionicons name="add" size={24} color="#000" />
            </View>
          ),
        }}
      />
      <Tab.Screen name="Today" component={TodayScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Auth Checker Component
function AuthChecker({ children }) {
  const { user, loading, userProfile } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  // User needs onboarding (no college set)
  if (user && (!userProfile || !userProfile.college)) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Zones" component={ZonesScreen} />
      </Stack.Navigator>
    );
  }

  return children;
}

// Main Navigation
function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Zones" component={ZonesScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen name="AddTask" component={AddTaskScreen} />
      <Stack.Screen name="ManageZones" component={ManageZonesScreen} />
    </Stack.Navigator>
  );
}

// Root App Component
export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TaskProvider>
          <NavigationContainer>
            <StatusBar style="dark" />
            <AppNavigator />
          </NavigationContainer>
        </TaskProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.light.background,
  },
  loadingText: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.md,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: COLORS.light.textMuted,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.light.background,
    padding: 20,
  },
  errorTitle: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xxl,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: COLORS.accent.pink,
    marginBottom: 10,
  },
  errorMessage: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.md,
    color: COLORS.light.textMuted,
    textAlign: 'center',
  },
});
