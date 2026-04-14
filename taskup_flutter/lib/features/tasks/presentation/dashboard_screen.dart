import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_constants.dart';
import '../../auth/presentation/auth_controller.dart';
import '../../zones/presentation/zone_controller.dart';
import '../../zones/domain/zone_model.dart';
import 'task_controller.dart';
import '../domain/task_model.dart';

class DashboardScreen extends ConsumerStatefulWidget {
  const DashboardScreen({super.key});

  @override
  ConsumerState<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends ConsumerState<DashboardScreen> {
  String _searchQuery = '';

  Color _parseColor(String hex) {
    try {
      return Color(int.parse(hex.replaceFirst('#', '0xFF')));
    } catch (_) {
      return AppColors.violet;
    }
  }

  Color _priorityColor(String p) {
    switch (p) {
      case 'Urgent': return AppColors.rose;
      case 'High': return AppColors.cyan;
      case 'Medium': return AppColors.amber;
      default: return AppColors.mint;
    }
  }

  IconData _priorityIcon(String p) {
    switch (p) {
      case 'Urgent': return Icons.local_fire_department_rounded;
      case 'High': return Icons.arrow_upward_rounded;
      case 'Medium': return Icons.remove_rounded;
      default: return Icons.arrow_downward_rounded;
    }
  }

  @override
  Widget build(BuildContext context) {
    final tasksAsync = ref.watch(tasksProvider);
    final zonesAsync = ref.watch(zonesProvider);
    final user = ref.watch(authStateProvider).value;
    final name = user?.displayName ?? 'Student';

    return Scaffold(
      backgroundColor: AppColors.background,
      floatingActionButton: FloatingActionButton(
        onPressed: () => context.push('/add-task'),
        backgroundColor: AppColors.violet,
        elevation: 4,
        child: const Icon(Icons.add_rounded, color: Colors.white, size: 28),
      ).animate().scale(delay: 400.ms, duration: 300.ms, curve: Curves.easeOutBack),
      body: SafeArea(
        child: CustomScrollView(
          slivers: [
            // ─── HEADER ─────────────────────────────────
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(AppSpacing.xl, AppSpacing.lg, AppSpacing.xl, 0),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Hey, ${name.split(' ').first} 👋',
                            style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: AppColors.navy),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            _greetingByTime(),
                            style: TextStyle(fontSize: 14, color: AppColors.textMuted),
                          ),
                        ],
                      ),
                    ),
                    // Quick stats bubble
                    tasksAsync.when(
                      data: (tasks) {
                        final pending = tasks.where((t) => t.status == 'pending').length;
                        return Container(
                          padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                          decoration: BoxDecoration(
                            color: pending > 0 ? AppColors.amber.withValues(alpha: 0.12) : AppColors.mint.withValues(alpha: 0.12),
                            borderRadius: BorderRadius.circular(AppRadius.xxl),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                pending > 0 ? Icons.pending_actions_rounded : Icons.check_circle_rounded,
                                size: 16,
                                color: pending > 0 ? AppColors.amber : AppColors.mint,
                              ),
                              const SizedBox(width: 6),
                              Text(
                                pending > 0 ? '$pending left' : 'All done!',
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w700,
                                  color: pending > 0 ? AppColors.amber : AppColors.mint,
                                ),
                              ),
                            ],
                          ),
                        );
                      },
                      loading: () => const SizedBox.shrink(),
                      error: (_, __) => const SizedBox.shrink(),
                    ),
                  ],
                ).animate().fadeIn(duration: 400.ms).slideX(begin: -0.05, end: 0),
              ),
            ),

            // ─── SEARCH ─────────────────────────────────
            SliverToBoxAdapter(
              child: Padding(
                padding: const EdgeInsets.fromLTRB(AppSpacing.xl, AppSpacing.md, AppSpacing.xl, AppSpacing.sm),
                child: TextField(
                  onChanged: (v) => setState(() => _searchQuery = v),
                  decoration: InputDecoration(
                    hintText: 'Search tasks...',
                    prefixIcon: const Icon(Icons.search_rounded, color: AppColors.textMuted),
                    isDense: true,
                    filled: true,
                    fillColor: AppColors.surface,
                    contentPadding: const EdgeInsets.symmetric(vertical: 12),
                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(AppRadius.lg),
                      borderSide: BorderSide.none,
                    ),
                  ),
                ).animate(delay: 200.ms).fadeIn(duration: 300.ms),
              ),
            ),

            // ─── ZONE SECTIONS ──────────────────────────
            zonesAsync.when(
              data: (zones) {
                return tasksAsync.when(
                  data: (allTasks) {
                    // Filter tasks by search
                    var tasks = allTasks;
                    if (_searchQuery.isNotEmpty) {
                      tasks = tasks.where((t) =>
                        t.title.toLowerCase().contains(_searchQuery.toLowerCase())).toList();
                    }

                    if (zones.isEmpty) {
                      return SliverFillRemaining(
                        child: _EmptyState(
                          icon: Icons.category_outlined,
                          title: 'No zones yet',
                          subtitle: 'Create zones to organize your tasks.',
                        ),
                      );
                    }

                    // Build zone sections
                    return SliverList(
                      delegate: SliverChildBuilderDelegate(
                        (ctx, index) {
                          final zone = zones[index];
                          final zoneTasks = tasks.where((t) => t.zone == zone.name).toList();
                          final zoneColor = _parseColor(zone.color);
                          final pending = zoneTasks.where((t) => t.status == 'pending').length;
                          final done = zoneTasks.where((t) => t.status == 'completed').length;

                          return _ZoneCard(
                            zone: zone,
                            zoneColor: zoneColor,
                            tasks: zoneTasks,
                            pending: pending,
                            done: done,
                            priorityColor: _priorityColor,
                            priorityIcon: _priorityIcon,
                            onToggle: (t) => ref.read(tasksProvider.notifier).toggleTask(t.taskId, t.status),
                            onDelete: (t) => ref.read(tasksProvider.notifier).deleteTask(t.taskId),
                          ).animate(delay: (200 + index * 100).ms)
                            .fadeIn(duration: 400.ms)
                            .slideY(begin: 0.08, end: 0, curve: Curves.easeOutCubic);
                        },
                        childCount: zones.length,
                      ),
                    );
                  },
                  loading: () => const SliverFillRemaining(child: Center(child: CircularProgressIndicator())),
                  error: (e, _) => SliverFillRemaining(child: Center(child: Text('Error: $e'))),
                );
              },
              loading: () => const SliverFillRemaining(child: Center(child: CircularProgressIndicator())),
              error: (e, _) => SliverFillRemaining(child: Center(child: Text('Error: $e'))),
            ),

            // Bottom spacer for FAB
            const SliverToBoxAdapter(child: SizedBox(height: 80)),
          ],
        ),
      ),
    );
  }

  String _greetingByTime() {
    final h = DateTime.now().hour;
    if (h < 12) return 'Good morning! Let\'s get things done.';
    if (h < 17) return 'Good afternoon! Stay focused.';
    return 'Good evening! Wrap things up.';
  }
}

// ─── ZONE CARD ──────────────────────────────────────────────

class _ZoneCard extends StatelessWidget {
  final ZoneModel zone;
  final Color zoneColor;
  final List<TaskModel> tasks;
  final int pending;
  final int done;
  final Color Function(String) priorityColor;
  final IconData Function(String) priorityIcon;
  final void Function(TaskModel) onToggle;
  final void Function(TaskModel) onDelete;

  const _ZoneCard({
    required this.zone,
    required this.zoneColor,
    required this.tasks,
    required this.pending,
    required this.done,
    required this.priorityColor,
    required this.priorityIcon,
    required this.onToggle,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final pct = tasks.isNotEmpty ? done / tasks.length : 0.0;

    return Container(
      margin: const EdgeInsets.fromLTRB(AppSpacing.xl, 0, AppSpacing.xl, AppSpacing.md),
      decoration: BoxDecoration(
        color: AppColors.surface,
        borderRadius: BorderRadius.circular(AppRadius.xxl),
        border: Border.all(color: zoneColor.withValues(alpha: 0.15)),
        boxShadow: [
          BoxShadow(color: zoneColor.withValues(alpha: 0.06), blurRadius: 16, offset: const Offset(0, 4)),
        ],
      ),
      child: Column(
        children: [
          // Zone header
          Container(
            padding: const EdgeInsets.fromLTRB(AppSpacing.lg, AppSpacing.md, AppSpacing.md, AppSpacing.sm),
            child: Row(
              children: [
                // Zone color dot
                Container(
                  width: 10,
                  height: 10,
                  decoration: BoxDecoration(color: zoneColor, shape: BoxShape.circle),
                ),
                const SizedBox(width: 10),
                Expanded(
                  child: Text(
                    zone.name,
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: zoneColor),
                  ),
                ),
                // Mini progress
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: zoneColor.withValues(alpha: 0.08),
                    borderRadius: BorderRadius.circular(AppRadius.xxl),
                  ),
                  child: Text(
                    '$done/${tasks.length}',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: zoneColor),
                  ),
                ),
              ],
            ),
          ),

          // Progress bar
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(3),
              child: LinearProgressIndicator(
                value: pct,
                minHeight: 4,
                backgroundColor: zoneColor.withValues(alpha: 0.08),
                valueColor: AlwaysStoppedAnimation(zoneColor),
              ),
            ),
          ),

          // Tasks
          if (tasks.isEmpty)
            Padding(
              padding: const EdgeInsets.all(AppSpacing.lg),
              child: Text(
                'No tasks in this zone',
                style: TextStyle(fontSize: 13, color: AppColors.textMuted),
              ),
            )
          else
            ...tasks.map((t) => _SwipeableTaskTile(
              task: t,
              priorityColor: priorityColor(t.priority),
              priorityIcon: priorityIcon(t.priority),
              onToggle: () => onToggle(t),
              onDelete: () => onDelete(t),
            )),

          const SizedBox(height: AppSpacing.xs),
        ],
      ),
    );
  }
}

// ─── SWIPEABLE TASK TILE ────────────────────────────────────

class _SwipeableTaskTile extends StatelessWidget {
  final TaskModel task;
  final Color priorityColor;
  final IconData priorityIcon;
  final VoidCallback onToggle;
  final VoidCallback onDelete;

  const _SwipeableTaskTile({
    required this.task,
    required this.priorityColor,
    required this.priorityIcon,
    required this.onToggle,
    required this.onDelete,
  });

  @override
  Widget build(BuildContext context) {
    final done = task.status == 'completed';
    return Dismissible(
      key: Key(task.taskId),
      direction: DismissDirection.horizontal,
      confirmDismiss: (dir) async {
        if (dir == DismissDirection.endToStart) {
          onDelete();
          return true;
        } else {
          onToggle();
          return false;
        }
      },
      background: Container(
        margin: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 2),
        decoration: BoxDecoration(
          color: AppColors.mint.withValues(alpha: 0.15),
          borderRadius: BorderRadius.circular(AppRadius.lg),
        ),
        alignment: Alignment.centerLeft,
        padding: const EdgeInsets.only(left: 20),
        child: Icon(Icons.check_circle_rounded, color: AppColors.mint),
      ),
      secondaryBackground: Container(
        margin: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 2),
        decoration: BoxDecoration(
          color: AppColors.rose.withValues(alpha: 0.15),
          borderRadius: BorderRadius.circular(AppRadius.lg),
        ),
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        child: Icon(Icons.delete_rounded, color: AppColors.rose),
      ),
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 2),
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.md, vertical: 12),
        decoration: BoxDecoration(
          color: done ? const Color(0xFFF9FAFB) : Colors.white,
          borderRadius: BorderRadius.circular(AppRadius.lg),
        ),
        child: Row(
          children: [
            // Priority indicator
            Container(
              width: 28,
              height: 28,
              decoration: BoxDecoration(
                color: priorityColor.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(priorityIcon, size: 16, color: priorityColor),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    task.title,
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                      decoration: done ? TextDecoration.lineThrough : null,
                      color: done ? AppColors.textMuted : AppColors.textPrimary,
                    ),
                  ),
                  if (task.dueDate != null)
                    Padding(
                      padding: const EdgeInsets.only(top: 2),
                      child: Text(
                        task.dueDate!,
                        style: TextStyle(fontSize: 12, color: AppColors.textMuted),
                      ),
                    ),
                ],
              ),
            ),
            // Toggle checkbox
            GestureDetector(
              onTap: onToggle,
              child: AnimatedContainer(
                duration: 200.ms,
                width: 22,
                height: 22,
                decoration: BoxDecoration(
                  color: done ? AppColors.mint : Colors.transparent,
                  shape: BoxShape.circle,
                  border: Border.all(color: done ? AppColors.mint : AppColors.textMuted, width: 2),
                ),
                child: done ? const Icon(Icons.check, size: 14, color: Colors.white) : null,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ─── EMPTY STATE ────────────────────────────────────────────

class _EmptyState extends StatelessWidget {
  final IconData icon;
  final String title;
  final String subtitle;

  const _EmptyState({required this.icon, required this.title, required this.subtitle});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            width: 72,
            height: 72,
            decoration: BoxDecoration(
              color: AppColors.violet.withValues(alpha: 0.08),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, size: 32, color: AppColors.violet),
          ),
          const SizedBox(height: AppSpacing.md),
          Text(title, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.navy)),
          const SizedBox(height: 4),
          Text(subtitle, style: TextStyle(color: AppColors.textMuted)),
        ],
      ),
    ).animate().fadeIn(duration: 500.ms).scale(begin: const Offset(0.95, 0.95));
  }
}
