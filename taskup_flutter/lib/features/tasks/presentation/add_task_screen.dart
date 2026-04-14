import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_constants.dart';
import '../../zones/presentation/zone_controller.dart';
import 'task_controller.dart';

class AddTaskScreen extends ConsumerStatefulWidget {
  const AddTaskScreen({super.key});

  @override
  ConsumerState<AddTaskScreen> createState() => _AddTaskScreenState();
}

class _AddTaskScreenState extends ConsumerState<AddTaskScreen> {
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  String _selectedZone = '';
  String _selectedPriority = 'Medium';
  String? _selectedReminder;
  DateTime? _dueDate;
  TimeOfDay? _dueTime;
  bool _saving = false;

  static const _priorities = ['Low', 'Medium', 'High', 'Urgent'];

  static const _reminderOptions = {
    'at_time': 'At due time',
    '15_min': '15 min before',
    '1_hour': '1 hour before',
    '1_day': '1 day before',
  };

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
  void dispose() {
    _titleController.dispose();
    _descController.dispose();
    super.dispose();
  }

  Future<void> _pickDate() async {
    final d = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime.now().subtract(const Duration(days: 1)),
      lastDate: DateTime.now().add(const Duration(days: 365)),
    );
    if (d != null) setState(() => _dueDate = d);
  }

  Future<void> _pickTime() async {
    final t = await showTimePicker(context: context, initialTime: TimeOfDay.now());
    if (t != null) setState(() => _dueTime = t);
  }

  Future<void> _save() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedZone.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a zone.')),
      );
      return;
    }

    setState(() => _saving = true);
    try {
      String? dateStr;
      if (_dueDate != null) {
        dateStr = '${_dueDate!.year}-${_dueDate!.month.toString().padLeft(2, '0')}-${_dueDate!.day.toString().padLeft(2, '0')}';
        if (_dueTime != null) {
          dateStr += ' ${_dueTime!.hour.toString().padLeft(2, '0')}:${_dueTime!.minute.toString().padLeft(2, '0')}';
        }
      }

      await ref.read(tasksProvider.notifier).addTask(
            title: _titleController.text.trim(),
            desc: _descController.text.trim(),
            zone: _selectedZone,
            priority: _selectedPriority,
            dueDate: dateStr,
            reminder: _selectedReminder,
          );
      if (mounted) context.pop();
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final zonesAsync = ref.watch(zonesProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('New Task'),
        leading: IconButton(
          icon: const Icon(Icons.close_rounded),
          onPressed: () => context.pop(),
        ),
      ),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(AppSpacing.xl),
          children: [
            // Title
            TextFormField(
              controller: _titleController,
              decoration: const InputDecoration(
                labelText: 'What do you need to do?',
                hintText: 'e.g. Finish Math Assignment',
                prefixIcon: Icon(Icons.edit_outlined, size: 20),
              ),
              validator: (v) => v!.isEmpty ? 'Required' : null,
              textCapitalization: TextCapitalization.sentences,
            ).animate().fadeIn(duration: 300.ms).slideY(begin: 0.1, end: 0),
            const SizedBox(height: AppSpacing.md),

            // Description
            TextFormField(
              controller: _descController,
              decoration: const InputDecoration(
                labelText: 'Notes (optional)',
                hintText: 'Add details...',
                prefixIcon: Icon(Icons.notes_rounded, size: 20),
              ),
              maxLines: 3,
            ).animate(delay: 100.ms).fadeIn(duration: 300.ms).slideY(begin: 0.1, end: 0),
            const SizedBox(height: AppSpacing.xl),

            // Zone selector
            const Text('Zone', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textMuted, letterSpacing: 1))
                .animate(delay: 200.ms).fadeIn(duration: 200.ms),
            const SizedBox(height: AppSpacing.xs),
            zonesAsync.when(
              data: (zones) {
                if (zones.isNotEmpty && _selectedZone.isEmpty) {
                  _selectedZone = zones.first.name;
                }
                return Wrap(
                  spacing: AppSpacing.xs,
                  runSpacing: AppSpacing.xs,
                  children: zones.map((z) {
                    final sel = _selectedZone == z.name;
                    return GestureDetector(
                      onTap: () => setState(() => _selectedZone = z.name),
                      child: AnimatedContainer(
                        duration: 160.ms,
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: sel ? AppColors.violet.withValues(alpha: 0.12) : AppColors.surface,
                          borderRadius: BorderRadius.circular(AppRadius.xxl),
                          border: Border.all(
                            color: sel ? AppColors.violet : const Color(0xFFE5E7EB),
                            width: sel ? 2 : 1,
                          ),
                        ),
                        child: Text(
                          z.name,
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: sel ? AppColors.violet : AppColors.textSecondary,
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                );
              },
              loading: () => const CircularProgressIndicator(),
              error: (_, __) => const Text('Could not load zones'),
            ),
            const SizedBox(height: AppSpacing.xl),

            // Priority selector
            const Text('Priority', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textMuted, letterSpacing: 1))
                .animate(delay: 300.ms).fadeIn(duration: 200.ms),
            const SizedBox(height: AppSpacing.xs),
            Wrap(
              spacing: AppSpacing.xs,
              runSpacing: AppSpacing.xs,
              children: _priorities.map((p) {
                final sel = _selectedPriority == p;
                final c = _priorityColor(p);
                final ic = _priorityIcon(p);
                return GestureDetector(
                  onTap: () => setState(() => _selectedPriority = p),
                  child: AnimatedContainer(
                    duration: 160.ms,
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: BoxDecoration(
                      color: sel ? c.withValues(alpha: 0.15) : AppColors.surface,
                      borderRadius: BorderRadius.circular(AppRadius.xxl),
                      border: Border.all(color: sel ? c : const Color(0xFFE5E7EB), width: sel ? 2 : 1),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(ic, size: 14, color: sel ? c : AppColors.textMuted),
                        const SizedBox(width: 6),
                        Text(
                          p,
                          style: TextStyle(
                            fontSize: 13,
                            fontWeight: FontWeight.w600,
                            color: sel ? c : AppColors.textSecondary,
                          ),
                        ),
                      ],
                    ),
                  ),
                );
              }).toList(),
            ).animate(delay: 350.ms).fadeIn(duration: 300.ms),
            const SizedBox(height: AppSpacing.xl),

            // Date & Time
            const Text('Schedule', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textMuted, letterSpacing: 1))
                .animate(delay: 400.ms).fadeIn(duration: 200.ms),
            const SizedBox(height: AppSpacing.xs),
            Row(
              children: [
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _pickDate,
                    icon: const Icon(Icons.calendar_today_outlined, size: 18),
                    label: Text(
                      _dueDate != null
                          ? '${_dueDate!.day}/${_dueDate!.month}/${_dueDate!.year}'
                          : 'Due Date',
                    ),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ),
                const SizedBox(width: AppSpacing.md),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: _pickTime,
                    icon: const Icon(Icons.access_time_outlined, size: 18),
                    label: Text(
                      _dueTime != null ? _dueTime!.format(context) : 'Time',
                    ),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 14),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                  ),
                ),
              ],
            ).animate(delay: 450.ms).fadeIn(duration: 300.ms),
            const SizedBox(height: AppSpacing.xl),

            // Reminder selector (only shows when a due date is set)
            if (_dueDate != null) ...[
              const Text('Reminder', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w700, color: AppColors.textMuted, letterSpacing: 1))
                  .animate().fadeIn(duration: 200.ms),
              const SizedBox(height: AppSpacing.xs),
              Wrap(
                spacing: AppSpacing.xs,
                runSpacing: AppSpacing.xs,
                children: _reminderOptions.entries.map((entry) {
                  final sel = _selectedReminder == entry.key;
                  return GestureDetector(
                    onTap: () => setState(() {
                      _selectedReminder = sel ? null : entry.key;
                    }),
                    child: AnimatedContainer(
                      duration: 160.ms,
                      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                      decoration: BoxDecoration(
                        color: sel ? AppColors.violet.withValues(alpha: 0.12) : AppColors.surface,
                        borderRadius: BorderRadius.circular(AppRadius.xxl),
                        border: Border.all(
                          color: sel ? AppColors.violet : const Color(0xFFE5E7EB),
                          width: sel ? 2 : 1,
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            sel ? Icons.notifications_active_rounded : Icons.notifications_none_rounded,
                            size: 14,
                            color: sel ? AppColors.violet : AppColors.textMuted,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            entry.value,
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: FontWeight.w600,
                              color: sel ? AppColors.violet : AppColors.textSecondary,
                            ),
                          ),
                        ],
                      ),
                    ),
                  );
                }).toList(),
              ).animate().fadeIn(duration: 300.ms),
              const SizedBox(height: AppSpacing.xxl),
            ] else
              const SizedBox(height: AppSpacing.xxl),

            // Save button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: _saving ? null : _save,
                style: ElevatedButton.styleFrom(
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
                child: _saving
                    ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                    : const Text('Save Task', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
              ),
            ).animate(delay: 500.ms).fadeIn(duration: 300.ms).slideY(begin: 0.1, end: 0),
          ],
        ),
      ),
    );
  }
}
