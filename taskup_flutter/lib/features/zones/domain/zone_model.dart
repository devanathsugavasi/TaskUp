import 'package:freezed_annotation/freezed_annotation.dart';

part 'zone_model.freezed.dart';
part 'zone_model.g.dart';

@freezed
sealed class ZoneModel with _$ZoneModel {
  const factory ZoneModel({
    required String zoneId,
    required String userId,
    required String name,
    required String color,
    @Default('') String icon,
    @Default(0) int taskCount,
    String? createdAt,
  }) = _ZoneModel;

  factory ZoneModel.fromJson(Map<String, dynamic> json) => _$ZoneModelFromJson(json);
}
