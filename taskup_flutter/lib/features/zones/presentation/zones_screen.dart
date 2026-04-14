import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_constants.dart';
import 'zone_controller.dart';

class _ZoneOption {
  final String name;
  final Color color;
  final IconData icon;
  bool selected;

  _ZoneOption({required this.name, required this.color, required this.icon, this.selected = true});
}

class ZonesScreen extends ConsumerStatefulWidget {
  const ZonesScreen({super.key});

  @override
  ConsumerState<ZonesScreen> createState() => _ZonesScreenState();
}

class _ZonesScreenState extends ConsumerState<ZonesScreen> {
  final _customController = TextEditingController();
  bool _loading = false;
  bool _showCustomInput = false;

  final List<_ZoneOption> _options = [
    _ZoneOption(name: 'Work', color: AppColors.violet, icon: Icons.work_outline_rounded),
    _ZoneOption(name: 'Reading', color: AppColors.mint, icon: Icons.auto_stories_rounded),
    _ZoneOption(name: 'Meetings', color: AppColors.cyan, icon: Icons.groups_outlined),
    _ZoneOption(name: 'Food', color: AppColors.amber, icon: Icons.restaurant_rounded),
    _ZoneOption(name: 'Exams', color: AppColors.rose, icon: Icons.school_rounded),
    _ZoneOption(name: 'Personal', color: AppColors.zonePersonal, icon: Icons.favorite_rounded),
    _ZoneOption(name: 'Fitness', color: const Color(0xFF10B981), icon: Icons.fitness_center_rounded, selected: false),
    _ZoneOption(name: 'Creative', color: const Color(0xFFF59E0B), icon: Icons.palette_rounded, selected: false),
  ];

  @override
  void dispose() {
    _customController.dispose();
    super.dispose();
  }

  String _colorToHex(Color c) =>
      '#${c.toARGB32().toRadixString(16).padLeft(8, '0').substring(2)}';

  Future<void> _setupZones() async {
    final selected = _options.where((z) => z.selected).toList();
    if (selected.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Pick at least one zone to get started.')),
      );
      return;
    }
    setState(() => _loading = true);
    try {
      final notifier = ref.read(zonesProvider.notifier);
      for (final z in selected) {
        await notifier.addZone(z.name, _colorToHex(z.color));
      }
      if (mounted) context.go('/dashboard');
    } catch (e) {
      if (mounted) ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final selectedCount = _options.where((z) => z.selected).length;

    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: AppSpacing.xl),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const SizedBox(height: AppSpacing.xxl),

              // Header
              const Text(
                'Pick Your\nZones ✦',
                style: TextStyle(fontSize: 32, fontWeight: FontWeight.w900, color: AppColors.navy, height: 1.2),
              ).animate().fadeIn(duration: 400.ms).slideY(begin: 0.1, end: 0),

              const SizedBox(height: AppSpacing.xs),
              Text(
                'Zones organize your tasks. Tap to select, long-press to customize. You can always edit them later.',
                style: TextStyle(fontSize: 14, color: AppColors.textMuted, height: 1.4),
              ).animate(delay: 150.ms).fadeIn(duration: 300.ms),

              const SizedBox(height: AppSpacing.xl),

              // Grid
              Expanded(
                child: GridView.builder(
                  gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                    crossAxisCount: 2,
                    crossAxisSpacing: 12,
                    mainAxisSpacing: 12,
                    childAspectRatio: 1.4,
                  ),
                  itemCount: _options.length,
                  itemBuilder: (context, index) {
                    final zone = _options[index];
                    return GestureDetector(
                      onTap: () => setState(() => zone.selected = !zone.selected),
                      child: AnimatedContainer(
                        duration: 200.ms,
                        curve: Curves.easeOutCubic,
                        decoration: BoxDecoration(
                          color: zone.selected ? zone.color.withValues(alpha: 0.1) : AppColors.surface,
                          borderRadius: BorderRadius.circular(AppRadius.xl),
                          border: Border.all(
                            color: zone.selected ? zone.color : const Color(0xFFE5E7EB),
                            width: zone.selected ? 2 : 1,
                          ),
                          boxShadow: zone.selected
                              ? [BoxShadow(color: zone.color.withValues(alpha: 0.12), blurRadius: 12, offset: const Offset(0, 4))]
                              : [],
                        ),
                        child: Stack(
                          children: [
                            // Selected checkmark
                            if (zone.selected)
                              Positioned(
                                top: 8,
                                right: 8,
                                child: Container(
                                  width: 20,
                                  height: 20,
                                  decoration: BoxDecoration(color: zone.color, shape: BoxShape.circle),
                                  child: const Icon(Icons.check, size: 12, color: Colors.white),
                                ),
                              ),
                            Center(
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(zone.icon, color: zone.color, size: 28),
                                  const SizedBox(height: 8),
                                  Text(
                                    zone.name,
                                    style: TextStyle(
                                      fontSize: 14,
                                      fontWeight: FontWeight.w700,
                                      color: zone.selected ? zone.color : AppColors.textSecondary,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ).animate(delay: (200 + index * 60).ms)
                        .fadeIn(duration: 300.ms)
                        .scale(begin: const Offset(0.9, 0.9), end: const Offset(1, 1), curve: Curves.easeOutCubic);
                  },
                ),
              ),

              // Custom zone toggle
              if (!_showCustomInput)
                TextButton.icon(
                  onPressed: () => setState(() => _showCustomInput = true),
                  icon: const Icon(Icons.add_rounded, size: 18),
                  label: const Text('Add custom zone'),
                  style: TextButton.styleFrom(foregroundColor: AppColors.violet),
                ).animate().fadeIn(delay: 600.ms)
              else
                Row(
                  children: [
                    Expanded(
                      child: TextField(
                        controller: _customController,
                        decoration: const InputDecoration(hintText: 'Zone name...', isDense: true),
                        autofocus: true,
                      ),
                    ),
                    const SizedBox(width: 8),
                    IconButton(
                      onPressed: () {
                        final name = _customController.text.trim();
                        if (name.isEmpty || _options.any((z) => z.name == name)) return;
                        setState(() {
                          _options.add(_ZoneOption(
                            name: name,
                            color: AppColors.violet,
                            icon: Icons.label_rounded,
                          ));
                          _customController.clear();
                          _showCustomInput = false;
                        });
                      },
                      icon: const Icon(Icons.check_circle_rounded, color: AppColors.mint),
                    ),
                    IconButton(
                      onPressed: () => setState(() => _showCustomInput = false),
                      icon: Icon(Icons.close_rounded, color: AppColors.textMuted),
                    ),
                  ],
                ).animate().fadeIn(duration: 200.ms),

              const SizedBox(height: AppSpacing.md),

              // CTA button
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _loading ? null : _setupZones,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: _loading
                      ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : Text(
                          'Continue with $selectedCount zone${selectedCount == 1 ? '' : 's'}',
                          style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                        ),
                ),
              ),
              const SizedBox(height: AppSpacing.lg),
            ],
          ),
        ),
      ),
    );
  }
}
