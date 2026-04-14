import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../domain/zone_model.dart';

final zoneRepositoryProvider = Provider<ZoneRepository>((ref) {
  return ZoneRepository(FirebaseFirestore.instance);
});

class ZoneRepository {
  final FirebaseFirestore _firestore;

  ZoneRepository(this._firestore);

  CollectionReference get _zonesRef => _firestore.collection('zones');

  Stream<List<ZoneModel>> watchZones(String userId) {
    return _zonesRef
        .where('userId', isEqualTo: userId)
        .orderBy('createdAt', descending: false)
        .snapshots()
        .map((snap) => snap.docs.map((doc) {
              final data = doc.data() as Map<String, dynamic>;
              data['zoneId'] = doc.id;
              return ZoneModel.fromJson(data);
            }).toList());
  }

  Future<void> addZone(ZoneModel zone) async {
    await _zonesRef.doc(zone.zoneId).set(zone.toJson());
  }

  Future<void> updateZone(String zoneId, Map<String, dynamic> data) async {
    await _zonesRef.doc(zoneId).update(data);
  }

  Future<void> deleteZone(String zoneId) async {
    await _zonesRef.doc(zoneId).delete();
  }
}
