import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/task_repository.dart';
import '../domain/task_model.dart';
import '../../auth/presentation/auth_controller.dart';
import '../../../core/services/notification_service.dart';
import 'dart:async';
import 'package:uuid/uuid.dart';
import 'package:intl/intl.dart';

final tasksProvider = StreamNotifierProvider<TaskNotifier, List<TaskModel>>(() {
  return TaskNotifier();
});

class TaskNotifier extends StreamNotifier<List<TaskModel>> {
  late final TaskRepository _repo;

  @override
  Stream<List<TaskModel>> build() {
    _repo = ref.watch(taskRepositoryProvider);
    final user = ref.watch(authStateProvider).value;
    if (user == null) return Stream.value([]);
    return _repo.watchTasks(user.uid);
  }

  Future<void> addTask({
    required String title,
    String desc = '',
    required String zone,
    String priority = 'Medium',
    String? dueDate,
    String? reminder,
  }) async {
    final user = ref.read(authStateProvider).value;
    if (user == null) return;

    final id = const Uuid().v4();
    final now = DateFormat('yyyy-MM-dd HH:mm:ss').format(DateTime.now());
    final task = TaskModel(
      taskId: id,
      userId: user.uid,
      title: title,
      desc: desc,
      zone: zone,
      priority: priority,
      dueDate: dueDate,
      reminder: reminder,
      status: 'pending',
      createdAt: now,
      calendarDate: dueDate,
    );
    await _repo.addTask(task);

    // Schedule a local notification if a reminder offset and due date are set
    _scheduleReminder(id, title, dueDate, reminder);
  }

  Future<void> toggleTask(String taskId, String currentStatus) async {
    final newStatus = currentStatus == 'completed' ? 'pending' : 'completed';
    await _repo.updateTask(taskId, {'status': newStatus});

    // Cancel the reminder when marking a task complete
    if (newStatus == 'completed') {
      NotificationService.instance.cancelReminder(taskId);
    }
  }

  Future<void> deleteTask(String taskId) async {
    await _repo.deleteTask(taskId);
    // Cancel any pending reminder for the deleted task
    NotificationService.instance.cancelReminder(taskId);
  }

  // ── Private helper ──────────────────────────────────────────────

  void _scheduleReminder(
    String taskId,
    String title,
    String? dueDate,
    String? reminder,
  ) {
    if (dueDate == null || reminder == null || reminder.isEmpty) return;

    // Parse due date (supports "yyyy-MM-dd" and "yyyy-MM-dd HH:mm")
    DateTime? due;
    try {
      if (dueDate.contains(':')) {
        due = DateFormat('yyyy-MM-dd HH:mm').parse(dueDate);
      } else {
        due = DateFormat('yyyy-MM-dd').parse(dueDate);
        // Default to 9:00 AM if no time was specified
        due = DateTime(due.year, due.month, due.day, 9, 0);
      }
    } catch (_) {
      return;
    }

    // Compute the notification time from the reminder offset
    final notifyAt = switch (reminder) {
      'at_time' => due,
      '15_min' => due.subtract(const Duration(minutes: 15)),
      '1_hour' => due.subtract(const Duration(hours: 1)),
      '1_day' => due.subtract(const Duration(days: 1)),
      _ => due,
    };

    NotificationService.instance.scheduleTaskReminder(
      taskId: taskId,
      title: title,
      scheduledTime: notifyAt,
    );
  }
}
