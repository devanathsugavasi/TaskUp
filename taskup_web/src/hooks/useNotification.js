// ============================================
// NOTIFICATION HOOK - Browser Push Notifications
// Requests permission and handles notification display
// ============================================

import { useState, useCallback, useEffect } from 'react';

// Request notification permission from the browser
export function useNotification() {
  const [permission, setPermission] = useState('default');
  const [supported, setSupported] = useState(false);

  // Check if notifications are supported on mount
  useEffect(() => {
    if ('Notification' in window) {
      setSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  // Request permission from user
  const requestPermission = useCallback(async () => {
    if (!supported) return 'unsupported';

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (err) {
      console.error('Notification permission error:', err);
      return 'denied';
    }
  }, [supported]);

  // Show a browser notification
  const showNotification = useCallback(
    (title, options = {}) => {
      if (!supported || permission !== 'granted') {
        console.warn('Notifications not permitted');
        return null;
      }

      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        ...options,
      });

      // Auto-close after 5 seconds
      setTimeout(() => notification.close(), 5000);

      return notification;
    },
    [permission, supported]
  );

  // Schedule a notification using setTimeout (simple approach)
  // For production, consider using Service Workers and Push API
  const scheduleNotification = useCallback(
    (title, scheduledTime, options = {}) => {
      const now = new Date().getTime();
      const delay = scheduledTime - now;

      if (delay <= 0) {
        console.warn('Scheduled time is in the past');
        return null;
      }

      const timeoutId = setTimeout(() => {
        showNotification(title, options);
      }, delay);

      return timeoutId;
    },
    [showNotification]
  );

  // Cancel a scheduled notification
  const cancelScheduledNotification = useCallback((timeoutId) => {
    clearTimeout(timeoutId);
  }, []);

  return {
    permission,
    supported,
    requestPermission,
    showNotification,
    scheduleNotification,
    cancelScheduledNotification,
  };
}
