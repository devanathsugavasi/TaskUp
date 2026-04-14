import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_constants.dart';
import '../../tasks/presentation/task_controller.dart';
import '../../tasks/domain/task_model.dart';

class TodayScreen extends ConsumerWidget {
  const TodayScreen({super.key});

  String _todayKey() {
    final n = DateTime.now();
    return '${n.year}-${n.month.toString().padLeft(2, '0')}-${n.day.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final tasksAsync = ref.watch(tasksProvider);
    final today = _todayKey();

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text(
          "Today's Tasks",
          style: const TextStyle(fontWeight: FontWeight.w800),
        ),
      ),
      body: tasksAsync.when(
        data: (allTasks) {
          // Filter to today's tasks (by dueDate or calendarDate)
          var todayTasks = allTasks.where((t) {
            if (t.dueDate != null && t.dueDate!.startsWith(today)) return true;
            if (t.calendarDate != null && t.calendarDate!.startsWith(today)) return true;
            return false;
          }).toList();

          // Also include pending tasks without a date (treat as "today")
          final noDuePending = allTasks.where((t) => t.dueDate == null && t.status == 'pending');
          todayTasks.addAll(noDuePending);

          if (todayTasks.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.wb_sunny_outlined, size: 56, color: AppColors.amber),
                  const SizedBox(height: AppSpacing.md),
                  const Text(
                    'You\'re all clear!',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700, color: AppColors.navy),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'No tasks scheduled for today.',
                    style: TextStyle(color: AppColors.textMuted),
                  ),
                ],
              ),
            );
          }

          // Group by priority
          final urgent = todayTasks.where((t) => t.priority == 'Urgent').toList();
          final high = todayTasks.where((t) => t.priority == 'High').toList();
          final medium = todayTasks.where((t) => t.priority == 'Medium').toList();
          final low = todayTasks.where((t) => t.priority == 'Low').toList();

          final completed = todayTasks.where((t) => t.status == 'completed').length;
          final pct = todayTasks.isNotEmpty ? (completed / todayTasks.length * 100).round() : 0;

          return ListView(
            padding: const EdgeInsets.all(AppSpacing.xl),
            children: [
              // Progress summary
              Container(
                padding: const EdgeInsets.all(AppSpacing.lg),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(AppRadius.xl),
                  border: Border.all(color: const Color(0xFFF3F4F6)),
                ),
                child: Column(
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Daily Progress', style: TextStyle(fontWeight: FontWeight.w700, color: AppColors.navy)),
                        Text(
                          '$pct%',
                          style: TextStyle(
                            fontWeight: FontWeight.w800,
                            fontSize: 18,
                            color: pct >= 70 ? AppColors.mint : AppColors.amber,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: AppSpacing.sm),
                    ClipRRect(
                      borderRadius: BorderRadius.circular(4),
                      child: LinearProgressIndicator(
                        value: todayTasks.isNotEmpty ? completed / todayTasks.length : 0,
                        minHeight: 6,
                        backgroundColor: const Color(0xFFE5E7EB),
                        valueColor: AlwaysStoppedAnimation(pct >= 70 ? AppColors.mint : AppColors.amber),
                      ),
                    ),
                    const SizedBox(height: AppSpacing.xs),
                    Text(
                      '$completed of ${todayTasks.length} tasks done',
                      style: const TextStyle(fontSize: 12, color: AppColors.textMuted),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppSpacing.xl),

              if (urgent.isNotEmpty) _PriorityGroup(title: 'Urgent', tasks: urgent, color: AppColors.rose, ref: ref),
              if (high.isNotEmpty) _PriorityGroup(title: 'Important', tasks: high, color: AppColors.cyan, ref: ref),
              if (medium.isNotEmpty) _PriorityGroup(title: 'To Do', tasks: medium, color: AppColors.amber, ref: ref),
              if (low.isNotEmpty) _PriorityGroup(title: 'Personal', tasks: low, color: AppColors.mint, ref: ref),
            ],
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
      ),
    );
  }
}

class _PriorityGroup extends StatelessWidget {
  final String title;
  final List<TaskModel> tasks;
  final Color color;
  final WidgetRef ref;

  const _PriorityGroup({
    required this.title,
    required this.tasks,
    required this.color,
    required this.ref,
  });

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Container(width: 4, height: 16, decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(2))),
            const SizedBox(width: 8),
            Text(title, style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700, color: color)),
          ],
        ),
        const SizedBox(height: AppSpacing.xs),
        ...tasks.map((t) {
          final done = t.status == 'completed';
          return GestureDetector(
            onTap: () => ref.read(tasksProvider.notifier).toggleTask(t.taskId, t.status),
            child: Container(
              margin: const EdgeInsets.only(bottom: AppSpacing.xs),
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 12),
              decoration: BoxDecoration(
                color: AppColors.surface,
                borderRadius: BorderRadius.circular(AppRadius.lg),
                border: Border.all(color: const Color(0xFFF3F4F6)),
              ),
              child: Row(
                children: [
                  AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    width: 22,
                    height: 22,
                    decoration: BoxDecoration(
                      color: done ? AppColors.mint : Colors.transparent,
                      shape: BoxShape.circle,
                      border: Border.all(color: done ? AppColors.mint : AppColors.textMuted, width: 2),
                    ),
                    child: done ? const Icon(Icons.check, size: 14, color: Colors.white) : null,
                  ),
                  const SizedBox(width: AppSpacing.sm),
                  Expanded(
                    child: Text(
                      t.title,
                      style: TextStyle(
                        fontWeight: FontWeight.w600,
                        decoration: done ? TextDecoration.lineThrough : null,
                        color: done ? AppColors.textMuted : AppColors.textPrimary,
                      ),
                    ),
                  ),
                  Text(t.zone, style: const TextStyle(fontSize: 12, color: AppColors.textMuted)),
                ],
              ),
            ),
          );
        }),
        const SizedBox(height: AppSpacing.md),
      ],
    );
  }
}
