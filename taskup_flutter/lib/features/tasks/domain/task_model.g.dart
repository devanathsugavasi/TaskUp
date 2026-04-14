// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'task_model.dart';

// **************************************************************************
// JsonSerializableGenerator
// **************************************************************************

_TaskModel _$TaskModelFromJson(Map<String, dynamic> json) => _TaskModel(
  taskId: json['taskId'] as String,
  userId: json['userId'] as String,
  title: json['title'] as String,
  desc: json['desc'] as String? ?? '',
  zone: json['zone'] as String,
  priority: json['priority'] as String? ?? 'Medium',
  dueDate: json['dueDate'] as String?,
  reminder: json['reminder'] as String?,
  status: json['status'] as String? ?? 'pending',
  createdAt: json['createdAt'] as String?,
  calendarDate: json['calendarDate'] as String?,
);

Map<String, dynamic> _$TaskModelToJson(_TaskModel instance) =>
    <String, dynamic>{
      'taskId': instance.taskId,
      'userId': instance.userId,
      'title': instance.title,
      'desc': instance.desc,
      'zone': instance.zone,
      'priority': instance.priority,
      'dueDate': instance.dueDate,
      'reminder': instance.reminder,
      'status': instance.status,
      'createdAt': instance.createdAt,
      'calendarDate': instance.calendarDate,
    };
