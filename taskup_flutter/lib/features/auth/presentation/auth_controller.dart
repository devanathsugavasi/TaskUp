import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:firebase_auth/firebase_auth.dart' as auth;
import '../data/auth_repository.dart';
import '../domain/user_model.dart';
import 'dart:async';

class AuthStateNotifier extends StreamNotifier<auth.User?> {
  @override
  Stream<auth.User?> build() {
    return ref.watch(authRepositoryProvider).authStateChanges;
  }
}

final authStateProvider = StreamNotifierProvider<AuthStateNotifier, auth.User?>(() {
  return AuthStateNotifier();
});

class UserProfileNotifier extends AsyncNotifier<UserModel?> {
  @override
  Future<UserModel?> build() async {
    final user = ref.watch(authStateProvider).value;
    if (user != null) {
      return ref.watch(authRepositoryProvider).getUserProfile(user.uid);
    }
    return null;
  }
}

final userProfileProvider = AsyncNotifierProvider<UserProfileNotifier, UserModel?>(() {
  return UserProfileNotifier();
});

class AuthController extends AsyncNotifier<void> {
  late final AuthRepository _authRepository;

  @override
  FutureOr<void> build() async {
    _authRepository = ref.watch(authRepositoryProvider);
  }

  Future<void> login(String email, String password) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => _authRepository.signInWithEmail(email, password));
  }

  Future<void> signUp({
    required String email,
    required String password,
    required String name,
    required String college,
    required String dept,
    required String year,
  }) async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => _authRepository.signUpWithEmail(
      email: email,
      password: password,
      name: name,
      college: college,
      dept: dept,
      year: year,
    ));
  }

  Future<void> logout() async {
    state = const AsyncValue.loading();
    state = await AsyncValue.guard(() => _authRepository.signOut());
  }
}

final authControllerProvider = AsyncNotifierProvider<AuthController, void>(() {
  return AuthController();
});
