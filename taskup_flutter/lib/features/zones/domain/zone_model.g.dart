// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'zone_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_ZoneModel _$ZoneModelFromJson(Map<String, dynamic> json) => _ZoneModel(
  zoneId: json['zoneId'] as String,
  userId: json['userId'] as String,
  name: json['name'] as String,
  color: json['color'] as String,
  icon: json['icon'] as String? ?? '',
  taskCount: (json['taskCount'] as num?)?.toInt() ?? 0,
  createdAt: json['createdAt'] as String?,
);

Map<String, dynamic> _$ZoneModelToJson(_ZoneModel instance) =>
    <String, dynamic>{
      'zoneId': instance.zoneId,
      'userId': instance.userId,
      'name': instance.name,
      'color': instance.color,
      'icon': instance.icon,
      'taskCount': instance.taskCount,
      'createdAt': instance.createdAt,
    };
