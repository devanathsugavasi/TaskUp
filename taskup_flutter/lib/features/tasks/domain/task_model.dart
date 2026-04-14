import 'package:freezed_annotation/freezed_annotation.dart';

part 'task_model.freezed.dart';
part 'task_model.g.dart';

@freezed
sealed class TaskModel with _$TaskModel {
  const factory TaskModel({
    required String taskId,
    required String userId,
    required String title,
    @Default('') String desc,
    required String zone,
    @Default('Medium') String priority,
    String? dueDate,
    String? reminder,
    @Default('pending') String status,
    String? createdAt,
    String? calendarDate,
  }) = _TaskModel;

  factory TaskModel.fromJson(Map<String, dynamic> json) => _$TaskModelFromJson(json);
}
