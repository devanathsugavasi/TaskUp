import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

import '../features/auth/presentation/splash_screen.dart';
import '../features/auth/presentation/login_screen.dart';
import '../features/auth/presentation/signup_screen.dart';
import '../features/zones/presentation/zones_screen.dart';
import '../features/zones/presentation/manage_zones_screen.dart';
import '../features/tasks/presentation/dashboard_screen.dart';
import '../features/tasks/presentation/add_task_screen.dart';
import '../features/tasks/presentation/today_screen.dart';
import '../features/calendar/presentation/calendar_screen.dart';
import '../features/profile/presentation/profile_screen.dart';
import '../core/theme/app_colors.dart';

final _rootNavigatorKey = GlobalKey<NavigatorState>();
final _shellNavigatorKey = GlobalKey<NavigatorState>();

final router = GoRouter(
  navigatorKey: _rootNavigatorKey,
  initialLocation: '/',
  routes: [
    // Welcome / Splash
    GoRoute(
      path: '/',
      builder: (context, state) => const SplashScreen(),
    ),
    // Auth
    GoRoute(
      path: '/login',
      builder: (context, state) => const LoginScreen(),
    ),
    GoRoute(
      path: '/signup',
      builder: (context, state) => const SignUpScreen(),
    ),
    // Onboarding zones
    GoRoute(
      path: '/zones',
      builder: (context, state) => const ZonesScreen(),
    ),
    // Add task (full-screen overlay)
    GoRoute(
      path: '/add-task',
      parentNavigatorKey: _rootNavigatorKey,
      builder: (context, state) => const AddTaskScreen(),
    ),
    // Manage zones from profile
    GoRoute(
      path: '/manage-zones',
      parentNavigatorKey: _rootNavigatorKey,
      builder: (context, state) => const ManageZonesScreen(),
    ),

    // ─── MAIN APP WITH BOTTOM NAV ───
    ShellRoute(
      navigatorKey: _shellNavigatorKey,
      builder: (context, state, child) => _MainShell(child: child),
      routes: [
        GoRoute(
          path: '/dashboard',
          builder: (context, state) => const DashboardScreen(),
        ),
        GoRoute(
          path: '/today',
          builder: (context, state) => const TodayScreen(),
        ),
        GoRoute(
          path: '/calendar',
          builder: (context, state) => const CalendarScreen(),
        ),
        GoRoute(
          path: '/profile',
          builder: (context, state) => const ProfileScreen(),
        ),
      ],
    ),
  ],
);

class _MainShell extends StatelessWidget {
  final Widget child;
  const _MainShell({required this.child});

  int _index(BuildContext context) {
    final location = GoRouterState.of(context).uri.path;
    if (location.startsWith('/today')) return 1;
    if (location.startsWith('/calendar')) return 2;
    if (location.startsWith('/profile')) return 3;
    return 0;
  }

  @override
  Widget build(BuildContext context) {
    final idx = _index(context);
    return Scaffold(
      body: child,
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          boxShadow: [
            BoxShadow(color: Colors.black.withValues(alpha: 0.04), blurRadius: 20, offset: const Offset(0, -4)),
          ],
        ),
        child: NavigationBar(
          selectedIndex: idx,
          elevation: 0,
          backgroundColor: Colors.transparent,
          indicatorColor: AppColors.violet.withValues(alpha: 0.1),
          labelBehavior: NavigationDestinationLabelBehavior.alwaysShow,
          height: 68,
          onDestinationSelected: (i) {
            switch (i) {
              case 0: context.go('/dashboard');
              case 1: context.go('/today');
              case 2: context.go('/calendar');
              case 3: context.go('/profile');
            }
          },
          destinations: const [
            NavigationDestination(
              icon: Icon(Icons.grid_view_rounded, size: 22),
              selectedIcon: Icon(Icons.grid_view_rounded, size: 22, color: AppColors.violet),
              label: 'Planner',
            ),
            NavigationDestination(
              icon: Icon(Icons.wb_sunny_outlined, size: 22),
              selectedIcon: Icon(Icons.wb_sunny_rounded, size: 22, color: AppColors.violet),
              label: 'Today',
            ),
            NavigationDestination(
              icon: Icon(Icons.calendar_month_outlined, size: 22),
              selectedIcon: Icon(Icons.calendar_month_rounded, size: 22, color: AppColors.violet),
              label: 'Calendar',
            ),
            NavigationDestination(
              icon: Icon(Icons.person_outline_rounded, size: 22),
              selectedIcon: Icon(Icons.person_rounded, size: 22, color: AppColors.violet),
              label: 'Profile',
            ),
          ],
        ),
      ),
    );
  }
}
