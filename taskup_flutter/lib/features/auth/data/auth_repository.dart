import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../domain/user_model.dart';
import 'package:intl/intl.dart';

final authRepositoryProvider = Provider<AuthRepository>((ref) {
  return AuthRepository(
    FirebaseAuth.instance,
    FirebaseFirestore.instance,
  );
});

class AuthRepository {
  final FirebaseAuth _auth;
  final FirebaseFirestore _firestore;

  AuthRepository(this._auth, this._firestore);

  Stream<User?> get authStateChanges => _auth.authStateChanges();

  User? get currentUser => _auth.currentUser;

  Future<UserModel?> getUserProfile(String uid) async {
    try {
      final doc = await _firestore.collection('users').doc(uid).get();
      if (doc.exists && doc.data() != null) {
        return UserModel.fromJson(doc.data()!);
      }
      return null;
    } catch (e) {
      throw Exception('Failed to fetch user profile: $e');
    }
  }

  Future<void> signInWithEmail(String email, String password) async {
    try {
      await _auth.signInWithEmailAndPassword(email: email, password: password);
    } on FirebaseAuthException catch (e) {
      throw Exception(e.message ?? 'Unknown sign in error');
    }
  }

  Future<void> signUpWithEmail({
    required String email,
    required String password,
    required String name,
    required String college,
    required String dept,
    required String year,
  }) async {
    try {
      final userCredential = await _auth.createUserWithEmailAndPassword(
        email: email,
        password: password,
      );

      final user = userCredential.user;
      if (user != null) {
        final now = DateFormat('yyyy-MM-dd HH:mm:ss').format(DateTime.now());
        final newUser = UserModel(
          uid: user.uid,
          email: email,
          name: name,
          college: college,
          dept: dept,
          year: year,
          createdAt: now,
        );

        await _firestore.collection('users').doc(user.uid).set(newUser.toJson());
      }
    } on FirebaseAuthException catch (e) {
      throw Exception(e.message ?? 'Unknown sign up error');
    }
  }

  Future<void> signOut() async {
    await _auth.signOut();
  }
}
