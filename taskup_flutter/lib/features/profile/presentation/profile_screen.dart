import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_constants.dart';
import '../../auth/presentation/auth_controller.dart';
import '../../tasks/presentation/task_controller.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final userAsync = ref.watch(userProfileProvider);
    final tasksAsync = ref.watch(tasksProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      body: CustomScrollView(
        slivers: [
          // ─── HEADER ─────────────────────────────────
          SliverToBoxAdapter(
            child: Container(
              padding: const EdgeInsets.fromLTRB(AppSpacing.xl, 60, AppSpacing.xl, AppSpacing.xl),
              decoration: const BoxDecoration(
                color: AppColors.navy,
                borderRadius: BorderRadius.only(
                  bottomLeft: Radius.circular(32),
                  bottomRight: Radius.circular(32),
                ),
              ),
              child: Column(
                children: [
                  Container(
                    width: 72,
                    height: 72,
                    decoration: BoxDecoration(
                      color: AppColors.violet,
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(color: AppColors.violet.withValues(alpha: 0.3), blurRadius: 20, offset: const Offset(0, 6)),
                      ],
                    ),
                    child: const Center(
                      child: Text('✦', style: TextStyle(fontSize: 28, color: Colors.white)),
                    ),
                  ).animate().fadeIn(duration: 400.ms).scale(begin: const Offset(0.8, 0.8), curve: Curves.easeOutBack),
                  const SizedBox(height: AppSpacing.md),
                  userAsync.when(
                    data: (profile) => Column(
                      children: [
                        Text(
                          profile?.name ?? 'Student',
                          style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w800, color: Colors.white),
                        ),
                        if (profile?.college != null)
                          Text(profile!.college!, style: const TextStyle(color: Colors.white70, fontSize: 14)),
                        if (profile?.dept != null)
                          Text(
                            '${profile!.dept!}${profile.year != null ? ' · Year ${profile.year}' : ''}',
                            style: const TextStyle(color: Colors.white54, fontSize: 13),
                          ),
                      ],
                    ).animate(delay: 200.ms).fadeIn(duration: 400.ms).slideY(begin: 0.1, end: 0),
                    loading: () => const CircularProgressIndicator(color: Colors.white),
                    error: (_, __) => const Text('Error loading profile', style: TextStyle(color: Colors.white)),
                  ),
                ],
              ),
            ),
          ),

          // ─── STATS ──────────────────────────────────
          SliverToBoxAdapter(
            child: tasksAsync.when(
              data: (tasks) {
                final completed = tasks.where((t) => t.status == 'completed').length;
                final pending = tasks.where((t) => t.status == 'pending').length;
                final total = tasks.length;
                final pct = total > 0 ? (completed / total * 100).round() : 0;

                return Padding(
                  padding: const EdgeInsets.all(AppSpacing.xl),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          _StatCard(value: '$completed', label: 'Completed', color: AppColors.mint),
                          const SizedBox(width: AppSpacing.sm),
                          _StatCard(value: '$pending', label: 'Pending', color: AppColors.amber),
                          const SizedBox(width: AppSpacing.sm),
                          _StatCard(value: '$total', label: 'Total', color: AppColors.violet),
                        ],
                      ).animate(delay: 300.ms).fadeIn(duration: 400.ms).slideY(begin: 0.08, end: 0),
                      const SizedBox(height: AppSpacing.xl),
                      // Productivity bar
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
                                const Text('Overall Productivity', style: TextStyle(fontWeight: FontWeight.w700, color: AppColors.navy)),
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
                                value: total > 0 ? completed / total : 0,
                                minHeight: 6,
                                backgroundColor: const Color(0xFFE5E7EB),
                                valueColor: AlwaysStoppedAnimation(pct >= 70 ? AppColors.mint : AppColors.amber),
                              ),
                            ),
                          ],
                        ),
                      ).animate(delay: 450.ms).fadeIn(duration: 400.ms).slideY(begin: 0.08, end: 0),
                    ],
                  ),
                );
              },
              loading: () => const Padding(
                padding: EdgeInsets.all(AppSpacing.xl),
                child: Center(child: CircularProgressIndicator()),
              ),
              error: (e, _) => Padding(
                padding: const EdgeInsets.all(AppSpacing.xl),
                child: Text('Error: $e'),
              ),
            ),
          ),

          // ─── SETTINGS ──────────────────────────────
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xl),
              child: Column(
                children: [
                  _SettingsRow(
                    label: 'Manage Zones',
                    icon: Icons.category_outlined,
                    onTap: () => context.push('/manage-zones'),
                  ).animate(delay: 550.ms).fadeIn(duration: 300.ms).slideX(begin: 0.05, end: 0),
                  const SizedBox(height: AppSpacing.sm),
                  _SettingsRow(
                    label: 'Log Out',
                    icon: Icons.logout_rounded,
                    color: AppColors.rose,
                    onTap: () {
                      ref.read(authControllerProvider.notifier).logout();
                      context.go('/');
                    },
                  ).animate(delay: 650.ms).fadeIn(duration: 300.ms).slideX(begin: 0.05, end: 0),
                  const SizedBox(height: AppSpacing.xxl),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _StatCard extends StatelessWidget {
  final String value;
  final String label;
  final Color color;

  const _StatCard({required this.value, required this.label, required this.color});

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: AppSpacing.lg),
        decoration: BoxDecoration(
          color: color.withValues(alpha: 0.08),
          borderRadius: BorderRadius.circular(AppRadius.xl),
        ),
        child: Column(
          children: [
            Text(
              value,
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.w800, color: color),
            ),
            const SizedBox(height: 2),
            Text(label, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: color.withValues(alpha: 0.7))),
          ],
        ),
      ),
    );
  }
}

class _SettingsRow extends StatelessWidget {
  final String label;
  final IconData icon;
  final VoidCallback onTap;
  final Color? color;

  const _SettingsRow({required this.label, required this.icon, required this.onTap, this.color});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: 14),
        decoration: BoxDecoration(
          color: AppColors.surface,
          borderRadius: BorderRadius.circular(AppRadius.lg),
          border: Border.all(color: const Color(0xFFF3F4F6)),
        ),
        child: Row(
          children: [
            Icon(icon, color: color ?? AppColors.textSecondary, size: 20),
            const SizedBox(width: AppSpacing.sm),
            Expanded(
              child: Text(
                label,
                style: TextStyle(fontWeight: FontWeight.w600, color: color ?? AppColors.textPrimary),
              ),
            ),
            Icon(Icons.chevron_right_rounded, color: AppColors.textMuted, size: 20),
          ],
        ),
      ),
    );
  }
}
