import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_constants.dart';
import 'zone_controller.dart';

class ManageZonesScreen extends ConsumerWidget {
  const ManageZonesScreen({super.key});

  Color _parseColor(String hex) {
    try {
      return Color(int.parse(hex.replaceFirst('#', '0xFF')));
    } catch (_) {
      return AppColors.violet;
    }
  }

  static const _presetColors = [
    Color(0xFF7C5CFC), // violet
    Color(0xFF2DD4A8), // mint
    Color(0xFF38BDF8), // cyan
    Color(0xFFFBBF24), // amber
    Color(0xFFF43F5E), // rose
    Color(0xFF10B981), // green
    Color(0xFFF59E0B), // orange
    Color(0xFF6366F1), // indigo
    Color(0xFFEC4899), // pink
    Color(0xFF14B8A6), // teal
    Color(0xFF8B5CF6), // purple
    Color(0xFFEF4444), // red
  ];

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final zonesAsync = ref.watch(zonesProvider);

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: const Text('Manage Zones'),
        actions: [
          IconButton(
            onPressed: () => _showAddZoneSheet(context, ref),
            icon: const Icon(Icons.add_rounded, color: AppColors.violet),
          ),
        ],
      ),
      body: zonesAsync.when(
        data: (zones) {
          if (zones.isEmpty) {
            return Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Container(
                    width: 72, height: 72,
                    decoration: BoxDecoration(
                      color: AppColors.violet.withValues(alpha: 0.08),
                      shape: BoxShape.circle,
                    ),
                    child: const Icon(Icons.category_outlined, size: 32, color: AppColors.violet),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  const Text('No zones yet', style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700)),
                  const SizedBox(height: 4),
                  Text('Tap + to create your first zone.', style: TextStyle(color: AppColors.textMuted)),
                ],
              ).animate().fadeIn(duration: 400.ms),
            );
          }

          return ReorderableListView.builder(
            padding: const EdgeInsets.all(AppSpacing.xl),
            itemCount: zones.length,
            onReorder: (old, nw) {
              // Reorder is visual feedback only for now
            },
            itemBuilder: (context, index) {
              final zone = zones[index];
              final color = _parseColor(zone.color);
              return Container(
                key: ValueKey(zone.zoneId),
                margin: const EdgeInsets.only(bottom: AppSpacing.sm),
                decoration: BoxDecoration(
                  color: AppColors.surface,
                  borderRadius: BorderRadius.circular(AppRadius.xl),
                  border: Border.all(color: color.withValues(alpha: 0.15)),
                ),
                child: ListTile(
                  contentPadding: const EdgeInsets.symmetric(horizontal: AppSpacing.lg, vertical: 4),
                  leading: Container(
                    width: 40, height: 40,
                    decoration: BoxDecoration(
                      color: color.withValues(alpha: 0.12),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(Icons.category_rounded, color: color, size: 20),
                  ),
                  title: Text(
                    zone.name,
                    style: TextStyle(fontWeight: FontWeight.w700, color: color),
                  ),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        onPressed: () => _showEditZoneSheet(context, ref, zone.zoneId, zone.name, color),
                        icon: Icon(Icons.edit_rounded, size: 18, color: AppColors.textMuted),
                      ),
                      IconButton(
                        onPressed: () => _confirmDelete(context, ref, zone.zoneId, zone.name),
                        icon: Icon(Icons.delete_outline_rounded, size: 18, color: AppColors.rose),
                      ),
                      const Icon(Icons.drag_handle_rounded, color: AppColors.textMuted, size: 18),
                    ],
                  ),
                ),
              ).animate(delay: (index * 80).ms).fadeIn(duration: 300.ms).slideX(begin: 0.05, end: 0);
            },
          );
        },
        loading: () => const Center(child: CircularProgressIndicator()),
        error: (e, _) => Center(child: Text('Error: $e')),
      ),
    );
  }

  void _showAddZoneSheet(BuildContext context, WidgetRef ref) {
    final controller = TextEditingController();
    Color selectedColor = _presetColors.first;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setBS) {
            return Container(
              padding: EdgeInsets.fromLTRB(AppSpacing.xl, AppSpacing.xl, AppSpacing.xl,
                  MediaQuery.of(ctx).viewInsets.bottom + AppSpacing.xl),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(width: 40, height: 4,
                      decoration: BoxDecoration(color: const Color(0xFFE5E7EB), borderRadius: BorderRadius.circular(2))),
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  const Text('New Zone', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.navy)),
                  const SizedBox(height: AppSpacing.md),
                  TextField(
                    controller: controller,
                    autofocus: true,
                    decoration: const InputDecoration(hintText: 'Zone name'),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  const Text('Color', style: TextStyle(fontWeight: FontWeight.w600, color: AppColors.textSecondary)),
                  const SizedBox(height: AppSpacing.xs),
                  Wrap(
                    spacing: 10, runSpacing: 10,
                    children: _presetColors.map((c) {
                      final sel = c.toARGB32() == selectedColor.toARGB32();
                      return GestureDetector(
                        onTap: () => setBS(() => selectedColor = c),
                        child: AnimatedContainer(
                          duration: 150.ms,
                          width: 36, height: 36,
                          decoration: BoxDecoration(
                            color: c,
                            shape: BoxShape.circle,
                            border: sel ? Border.all(color: AppColors.navy, width: 3) : null,
                            boxShadow: sel
                                ? [BoxShadow(color: c.withValues(alpha: 0.4), blurRadius: 8)]
                                : [],
                          ),
                          child: sel ? const Icon(Icons.check, size: 16, color: Colors.white) : null,
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: AppSpacing.xl),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        final name = controller.text.trim();
                        if (name.isEmpty) return;
                        final hex = '#${selectedColor.toARGB32().toRadixString(16).padLeft(8, '0').substring(2)}';
                        ref.read(zonesProvider.notifier).addZone(name, hex);
                        Navigator.pop(ctx);
                      },
                      style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 14)),
                      child: const Text('Create Zone'),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _showEditZoneSheet(BuildContext context, WidgetRef ref, String zoneId, String currentName, Color currentColor) {
    final controller = TextEditingController(text: currentName);
    Color selectedColor = currentColor;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(
          builder: (ctx, setBS) {
            return Container(
              padding: EdgeInsets.fromLTRB(AppSpacing.xl, AppSpacing.xl, AppSpacing.xl,
                  MediaQuery.of(ctx).viewInsets.bottom + AppSpacing.xl),
              decoration: const BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Center(
                    child: Container(width: 40, height: 4,
                      decoration: BoxDecoration(color: const Color(0xFFE5E7EB), borderRadius: BorderRadius.circular(2))),
                  ),
                  const SizedBox(height: AppSpacing.lg),
                  const Text('Edit Zone', style: TextStyle(fontSize: 20, fontWeight: FontWeight.w800, color: AppColors.navy)),
                  const SizedBox(height: AppSpacing.md),
                  TextField(
                    controller: controller,
                    autofocus: true,
                    decoration: const InputDecoration(hintText: 'Zone name'),
                  ),
                  const SizedBox(height: AppSpacing.md),
                  const Text('Color', style: TextStyle(fontWeight: FontWeight.w600, color: AppColors.textSecondary)),
                  const SizedBox(height: AppSpacing.xs),
                  Wrap(
                    spacing: 10, runSpacing: 10,
                    children: _presetColors.map((c) {
                      final sel = c.toARGB32() == selectedColor.toARGB32();
                      return GestureDetector(
                        onTap: () => setBS(() => selectedColor = c),
                        child: AnimatedContainer(
                          duration: 150.ms,
                          width: 36, height: 36,
                          decoration: BoxDecoration(
                            color: c,
                            shape: BoxShape.circle,
                            border: sel ? Border.all(color: AppColors.navy, width: 3) : null,
                            boxShadow: sel
                                ? [BoxShadow(color: c.withValues(alpha: 0.4), blurRadius: 8)]
                                : [],
                          ),
                          child: sel ? const Icon(Icons.check, size: 16, color: Colors.white) : null,
                        ),
                      );
                    }).toList(),
                  ),
                  const SizedBox(height: AppSpacing.xl),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: () {
                        final name = controller.text.trim();
                        if (name.isEmpty) return;
                        final hex = '#${selectedColor.toARGB32().toRadixString(16).padLeft(8, '0').substring(2)}';
                        ref.read(zonesProvider.notifier).updateZone(zoneId, name, hex);
                        Navigator.pop(ctx);
                      },
                      style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 14)),
                      child: const Text('Save Changes'),
                    ),
                  ),
                ],
              ),
            );
          },
        );
      },
    );
  }

  void _confirmDelete(BuildContext context, WidgetRef ref, String zoneId, String name) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: const Text('Delete Zone?'),
        content: Text('Are you sure you want to delete "$name"? Tasks in this zone won\'t be deleted.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(
            onPressed: () {
              ref.read(zonesProvider.notifier).deleteZone(zoneId);
              Navigator.pop(ctx);
            },
            child: const Text('Delete', style: TextStyle(color: AppColors.rose)),
          ),
        ],
      ),
    );
  }
}
