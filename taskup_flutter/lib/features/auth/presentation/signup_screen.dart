import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_animate/flutter_animate.dart';
import 'package:go_router/go_router.dart';
import '../../../core/theme/app_colors.dart';
import '../../../core/theme/app_constants.dart';
import 'auth_controller.dart';

class SignUpScreen extends ConsumerStatefulWidget {
  const SignUpScreen({super.key});

  @override
  ConsumerState<SignUpScreen> createState() => _SignUpScreenState();
}

class _SignUpScreenState extends ConsumerState<SignUpScreen> {
  final _nameController = TextEditingController();
  final _collegeController = TextEditingController();
  final _deptController = TextEditingController();
  final _yearController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _formKey = GlobalKey<FormState>();
  bool _obscure = true;

  @override
  void dispose() {
    _nameController.dispose();
    _collegeController.dispose();
    _deptController.dispose();
    _yearController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _signUp() {
    if (_formKey.currentState!.validate()) {
      ref.read(authControllerProvider.notifier).signUp(
            email: _emailController.text.trim(),
            password: _passwordController.text,
            name: _nameController.text.trim(),
            college: _collegeController.text.trim(),
            dept: _deptController.text.trim(),
            year: _yearController.text.trim(),
          );
    }
  }

  @override
  Widget build(BuildContext context) {
    final authState = ref.watch(authControllerProvider);

    ref.listen(authControllerProvider, (previous, next) {
      if (!next.isLoading && !next.hasError && ref.read(authStateProvider).value != null) {
        context.go('/zones');
      } else if (next.hasError) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text(next.error.toString())),
        );
      }
    });

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_rounded),
          onPressed: () => context.go('/login'),
        ),
      ),
      body: SafeArea(
        child: Form(
          key: _formKey,
          child: ListView(
            padding: const EdgeInsets.all(AppSpacing.xl),
            children: [
              const Text(
                'Create Account ✦',
                style: TextStyle(fontSize: 28, fontWeight: FontWeight.w800, color: AppColors.navy),
              ).animate().fadeIn(duration: 400.ms).slideY(begin: 0.1, end: 0),

              const SizedBox(height: 4),
              Text(
                'Tell us about yourself so we can personalize your experience.',
                style: TextStyle(color: AppColors.textMuted, height: 1.4),
              ).animate(delay: 100.ms).fadeIn(duration: 300.ms),

              const SizedBox(height: AppSpacing.xl),

              // About you section
              _sectionLabel('About You'),
              const SizedBox(height: AppSpacing.xs),

              TextFormField(
                controller: _nameController,
                decoration: const InputDecoration(
                  labelText: 'Full Name',
                  prefixIcon: Icon(Icons.person_outline_rounded, size: 20),
                ),
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ).animate(delay: 200.ms).fadeIn(duration: 300.ms),
              const SizedBox(height: AppSpacing.md),

              TextFormField(
                controller: _collegeController,
                decoration: const InputDecoration(
                  labelText: 'College / University',
                  prefixIcon: Icon(Icons.school_outlined, size: 20),
                ),
                validator: (v) => v!.isEmpty ? 'Required' : null,
              ).animate(delay: 250.ms).fadeIn(duration: 300.ms),
              const SizedBox(height: AppSpacing.md),

              Row(
                children: [
                  Expanded(
                    flex: 2,
                    child: TextFormField(
                      controller: _deptController,
                      decoration: const InputDecoration(
                        labelText: 'Major / Dept',
                        prefixIcon: Icon(Icons.menu_book_outlined, size: 20),
                      ),
                      validator: (v) => v!.isEmpty ? 'Required' : null,
                    ),
                  ),
                  const SizedBox(width: AppSpacing.md),
                  Expanded(
                    child: TextFormField(
                      controller: _yearController,
                      decoration: const InputDecoration(labelText: 'Year'),
                      keyboardType: TextInputType.number,
                      validator: (v) => v!.isEmpty ? 'Required' : null,
                    ),
                  ),
                ],
              ).animate(delay: 300.ms).fadeIn(duration: 300.ms),

              const SizedBox(height: AppSpacing.xl),

              // Account section
              _sectionLabel('Account'),
              const SizedBox(height: AppSpacing.xs),

              TextFormField(
                controller: _emailController,
                decoration: const InputDecoration(
                  labelText: 'Student Email',
                  prefixIcon: Icon(Icons.email_outlined, size: 20),
                ),
                keyboardType: TextInputType.emailAddress,
                validator: (v) => !v!.contains('@') ? 'Enter a valid email' : null,
              ).animate(delay: 350.ms).fadeIn(duration: 300.ms),
              const SizedBox(height: AppSpacing.md),

              TextFormField(
                controller: _passwordController,
                decoration: InputDecoration(
                  labelText: 'Password',
                  prefixIcon: const Icon(Icons.lock_outline_rounded, size: 20),
                  suffixIcon: IconButton(
                    onPressed: () => setState(() => _obscure = !_obscure),
                    icon: Icon(_obscure ? Icons.visibility_off_outlined : Icons.visibility_outlined, size: 20, color: AppColors.textMuted),
                  ),
                ),
                obscureText: _obscure,
                validator: (v) => v!.length < 6 ? 'Min 6 characters' : null,
              ).animate(delay: 400.ms).fadeIn(duration: 300.ms),

              const SizedBox(height: AppSpacing.xl),

              SizedBox(
                height: 52,
                child: ElevatedButton(
                  onPressed: authState.isLoading ? null : _signUp,
                  style: ElevatedButton.styleFrom(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                  ),
                  child: authState.isLoading
                      ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                      : const Text('Create Account', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
                ),
              ).animate(delay: 500.ms).fadeIn(duration: 300.ms).slideY(begin: 0.1, end: 0),

              const SizedBox(height: AppSpacing.lg),

              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text('Already have an account? ', style: TextStyle(color: AppColors.textMuted)),
                  GestureDetector(
                    onTap: () => context.go('/login'),
                    child: const Text('Log In', style: TextStyle(color: AppColors.violet, fontWeight: FontWeight.w700)),
                  ),
                ],
              ).animate(delay: 600.ms).fadeIn(duration: 300.ms),
            ],
          ),
        ),
      ),
    );
  }

  Widget _sectionLabel(String text) {
    return Text(
      text,
      style: const TextStyle(
        fontSize: 13,
        fontWeight: FontWeight.w700,
        color: AppColors.textMuted,
        letterSpacing: 1,
      ),
    );
  }
}
