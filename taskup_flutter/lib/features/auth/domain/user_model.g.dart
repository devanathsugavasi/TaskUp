// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_UserModel _$UserModelFromJson(Map<String, dynamic> json) => _UserModel(
  uid: json['uid'] as String,
  email: json['email'] as String,
  name: json['name'] as String?,
  college: json['college'] as String?,
  dept: json['dept'] as String?,
  year: json['year'] as String?,
  createdAt: json['createdAt'] as String?,
  fcmToken: json['fcmToken'] as String?,
);

Map<String, dynamic> _$UserModelToJson(_UserModel instance) =>
    <String, dynamic>{
      'uid': instance.uid,
      'email': instance.email,
      'name': instance.name,
      'college': instance.college,
      'dept': instance.dept,
      'year': instance.year,
      'createdAt': instance.createdAt,
      'fcmToken': instance.fcmToken,
    };
