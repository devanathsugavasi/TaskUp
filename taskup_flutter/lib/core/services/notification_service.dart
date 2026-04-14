import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/timezone.dart' as tz;
import 'package:timezone/data/latest_all.dart' as tzdata;

/// Singleton service for scheduling local notifications (task reminders).
class NotificationService {
  NotificationService._();
  static final NotificationService instance = NotificationService._();

  final FlutterLocalNotificationsPlugin _plugin =
      FlutterLocalNotificationsPlugin();
  bool _initialized = false;

  /// Call once during app startup (in main.dart).
  Future<void> initialize() async {
    if (_initialized) return;

    // Timezone data required for scheduled notifications
    tzdata.initializeTimeZones();

    const android = AndroidInitializationSettings('@mipmap/ic_launcher');
    const ios = DarwinInitializationSettings(
      requestAlertPermission: true,
      requestBadgePermission: true,
      requestSoundPermission: true,
    );

    await _plugin.initialize(
      settings: const InitializationSettings(android: android, iOS: ios),
    );

    // Create Android notification channel
    const channel = AndroidNotificationChannel(
      'taskup_reminders',
      'Task Reminders',
      description: 'Reminders for upcoming tasks',
      importance: Importance.high,
    );

    final androidPlatform =
        _plugin.resolvePlatformSpecificImplementation<
            AndroidFlutterLocalNotificationsPlugin>();
    await androidPlatform?.createNotificationChannel(channel);

    _initialized = true;
  }

  /// Schedule a reminder at [scheduledTime] for task identified by [taskId].
  /// Uses the hashCode of [taskId] as the notification ID.
  Future<void> scheduleTaskReminder({
    required String taskId,
    required String title,
    String? body,
    required DateTime scheduledTime,
  }) async {
    if (scheduledTime.isBefore(DateTime.now())) return;

    final id = taskId.hashCode.abs() % 2147483647; // fit into 32-bit int

    await _plugin.zonedSchedule(
      id: id,
      title: 'Task Reminder',
      body: title,
      scheduledDate: tz.TZDateTime.from(scheduledTime, tz.local),
      notificationDetails: const NotificationDetails(
        android: AndroidNotificationDetails(
          'taskup_reminders',
          'Task Reminders',
          channelDescription: 'Reminders for upcoming tasks',
          importance: Importance.high,
          priority: Priority.high,
          icon: '@mipmap/ic_launcher',
        ),
        iOS: DarwinNotificationDetails(
          presentAlert: true,
          presentBadge: true,
          presentSound: true,
        ),
      ),
      androidScheduleMode: AndroidScheduleMode.inexactAllowWhileIdle,
    );
  }

  /// Cancel a specific task reminder by [taskId].
  Future<void> cancelReminder(String taskId) async {
    final id = taskId.hashCode.abs() % 2147483647;
    await _plugin.cancel(id: id);
  }

  /// Cancel all pending notifications.
  Future<void> cancelAll() async {
    await _plugin.cancelAll();
  }
}
