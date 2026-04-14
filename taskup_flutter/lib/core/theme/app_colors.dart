import 'package:flutter/material.dart';

class AppColors {
  // Brand
  static const Color violet = Color(0xFF5B4FD4);
  static const Color mint = Color(0xFF00C9A7);
  static const Color cyan = Color(0xFF00B4D8);
  static const Color amber = Color(0xFFF5A623);
  static const Color rose = Color(0xFFF24E6F);
  static const Color navy = Color(0xFF1A2240);
  
  // Background & Surfaces
  static const Color background = Color(0xFFF8F9FC); // Light, clean academic background
  static const Color surface = Colors.white;
  static const Color softSurface = Color(0xFFF3F5F9);
  
  // Text
  static const Color textPrimary = navy;
  static const Color textSecondary = Color(0xFF6B7280);
  static const Color textMuted = Color(0xFF9CA3AF);
  
  // Priorities (Mapped to requirements)
  static const Color priorityLow = mint;
  static const Color priorityMedium = amber;
  static const Color priorityImportant = cyan;
  static const Color priorityUrgent = rose;

  // Zones (Default palette based on spec instructions for colorful but controlled)
  static const Color zoneWork = violet;
  static const Color zoneReading = mint;
  static const Color zoneMeeting = cyan;
  static const Color zoneFood = amber;
  static const Color zoneExam = rose;
  static const Color zonePersonal = Color(0xFF7A9B76); // Sage
}
