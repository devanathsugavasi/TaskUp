// ============================================
// NOTIFICATION HOOK - expo-notifications Integration
// FIX: Implemented for mobile using expo-notifications
// ============================================

import { useState, useEffect, useCallback } from 'react';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotification() {
  const [permission, setPermission] = useState(null);
  const [token, setToken] = useState(null);

  // Request notification permission
  const requestPermission = useCallback(async () => {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      setPermission(finalStatus);

      if (finalStatus !== 'granted') {
        return 'denied';
      }

      // Get push notification token
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
        });
      }

      const pushToken = await Notifications.getExpoPushTokenAsync();
      setToken(pushToken.data);

      return 'granted';
    } catch (err) {
      console.error('Notification permission error:', err);
      return 'error';
    }
  }, []);

  // Schedule a local notification
  const scheduleNotification = useCallback(
    async (title, body, triggerDate) => {
      if (permission !== 'granted') {
        console.warn('Notifications not permitted');
        return null;
      }

      try {
        const identifier = await Notifications.scheduleNotificationAsync({
          content: {
            title,
            body,
            sound: true,
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: triggerDate,
          },
        });
        return identifier;
      } catch (err) {
        console.error('Error scheduling notification:', err);
        return null;
      }
    },
    [permission]
  );

  // Cancel a scheduled notification
  const cancelNotification = useCallback(async (identifier) => {
    try {
      await Notifications.cancelScheduledNotificationAsync(identifier);
    } catch (err) {
      console.error('Error canceling notification:', err);
    }
  }, []);

  // Cancel all notifications
  const cancelAllNotifications = useCallback(async () => {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (err) {
      console.error('Error canceling all notifications:', err);
    }
  }, []);

  // Add notification received listener
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      console.log('Notification received:', notification);
    });

    return () => subscription.remove();
  }, []);

  // Add notification response received listener
  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('Notification response:', response);
    });

    return () => subscription.remove();
  }, []);

  return {
    permission,
    token,
    requestPermission,
    scheduleNotification,
    cancelNotification,
    cancelAllNotifications,
  };
}
