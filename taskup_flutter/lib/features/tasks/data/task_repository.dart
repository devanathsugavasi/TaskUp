import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../domain/task_model.dart';

final taskRepositoryProvider = Provider<TaskRepository>((ref) {
  return TaskRepository(FirebaseFirestore.instance);
});

class TaskRepository {
  final FirebaseFirestore _firestore;

  TaskRepository(this._firestore);

  CollectionReference get _tasksRef => _firestore.collection('tasks');

  Stream<List<TaskModel>> watchTasks(String userId) {
    return _tasksRef
        .where('userId', isEqualTo: userId)
        .orderBy('createdAt', descending: true)
        .snapshots()
        .map((snap) => snap.docs.map((doc) {
              final data = doc.data() as Map<String, dynamic>;
              data['taskId'] = doc.id;
              return TaskModel.fromJson(data);
            }).toList());
  }

  Future<void> addTask(TaskModel task) async {
    await _tasksRef.doc(task.taskId).set(task.toJson());
  }

  Future<void> updateTask(String taskId, Map<String, dynamic> data) async {
    await _tasksRef.doc(taskId).update(data);
  }

  Future<void> deleteTask(String taskId) async {
    await _tasksRef.doc(taskId).delete();
  }
}
