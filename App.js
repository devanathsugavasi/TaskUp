import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View, StyleSheet } from 'react-native';

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

/* ── Tab icon config (no emojis) ──────────────────── */
const TAB_LABELS = {
  Dashboard: 'D',
  Calendar: 'C',
  AddTask: '+',
  Today: 'T',
  Profile: 'P',
};

function TabIcon({ name, focused }) {
  const isAdd = name === 'AddTask';
  return (
    <View style={[
      styles.iconWrap,
      isAdd && styles.fabIcon,
      focused && !isAdd && styles.iconActive,
    ]}>
      <Text style={[
        styles.iconText,
        isAdd && styles.fabText,
        focused && !isAdd && styles.iconTextActive,
      ]}>
        {TAB_LABELS[name]}
      </Text>
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
        tabBarActiveTintColor: '#2E4036',
        tabBarInactiveTintColor: 'rgba(26,26,26,0.45)',
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

function RootNavigator() {
  const { user } = useAuth();
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

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </TaskProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FAF8F3',
    borderTopWidth: 1,
    borderTopColor: 'rgba(46,64,54,0.08)',
    elevation: 0,
    shadowColor: '#1A1A1A',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    height: 68,
    paddingBottom: 8,
    paddingTop: 8,
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
    backgroundColor: 'rgba(46,64,54,0.08)',
    borderRadius: 8,
  },
  iconText: {
    fontSize: 14,
    fontWeight: '700',
    color: 'rgba(26,26,26,0.45)',
  },
  iconTextActive: {
    color: '#2E4036',
  },
  fabIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#CC5833',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#CC5833',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  fabText: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '300',
    lineHeight: 28,
  },
});
