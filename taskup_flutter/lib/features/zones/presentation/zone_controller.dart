import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../data/zone_repository.dart';
import '../domain/zone_model.dart';
import '../../auth/presentation/auth_controller.dart';
import 'dart:async';
import 'package:uuid/uuid.dart';
import 'package:intl/intl.dart';

final zonesProvider = StreamNotifierProvider<ZoneNotifier, List<ZoneModel>>(() {
  return ZoneNotifier();
});

class ZoneNotifier extends StreamNotifier<List<ZoneModel>> {
  late final ZoneRepository _repo;

  @override
  Stream<List<ZoneModel>> build() {
    _repo = ref.watch(zoneRepositoryProvider);
    final user = ref.watch(authStateProvider).value;
    if (user == null) return Stream.value([]);
    return _repo.watchZones(user.uid);
  }

  Future<void> addZone(String name, String color) async {
    final user = ref.read(authStateProvider).value;
    if (user == null) return;

    final id = const Uuid().v4();
    final now = DateFormat('yyyy-MM-dd HH:mm:ss').format(DateTime.now());
    final zone = ZoneModel(
      zoneId: id,
      userId: user.uid,
      name: name,
      color: color,
      createdAt: now,
    );
    await _repo.addZone(zone);
  }

  Future<void> updateZone(String zoneId, String name, String color) async {
    await _repo.updateZone(zoneId, {'name': name, 'color': color});
  }

  Future<void> deleteZone(String zoneId) async {
    await _repo.deleteZone(zoneId);
  }
}
