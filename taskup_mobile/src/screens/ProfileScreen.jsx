// ============================================
// PROFILE SCREEN - User Stats and Profile Management
// FIX: Uses tasks from TaskContext (fixes stale stats)
// ============================================

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import InputField from '../components/InputField';
import ProgressBar from '../components/ProgressBar';
import PrimaryButton from '../components/PrimaryButton';
import { COLORS, SPACING, FONT_SIZES, RADIUS } from '../theme';

export default function ProfileScreen({ navigation }) {
  const { userProfile, logout, updateUserProfile } = useAuth();
  const { tasks, zones, getStats } = useTasks();

  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: userProfile?.name || '',
    college: userProfile?.college || '',
    dept: userProfile?.dept || '',
    year: userProfile?.year || 1,
  });
  const [loading, setLoading] = useState(false);

  // FIX: Get stats from TaskContext (fixes stale Profile stats issue)
  const stats = useMemo(() => getStats(), [getStats, tasks, zones]);

  // Calculate streak
  const streak = useMemo(() => {
    const completedTasks = tasks
      .filter((t) => t.status === 'completed' && t.completedAt)
      .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));

    if (completedTasks.length === 0) return 0;

    let streakCount = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const completedDates = new Set(
      completedTasks.map((t) => new Date(t.completedAt).toISOString().split('T')[0])
    );

    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (completedDates.has(dateStr)) {
        streakCount++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streakCount;
  }, [tasks]);

  const handleUpdateProfile = async () => {
    if (!editForm.name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }

    setLoading(true);
    try {
      await updateUserProfile({
        name: editForm.name.trim(),
        college: editForm.college.trim(),
        dept: editForm.dept.trim(),
        year: parseInt(editForm.year, 10) || 1,
      });
      setShowEditModal(false);
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userProfile?.name?.charAt(0)?.toUpperCase() || '?'}
            </Text>
          </View>
          <View style={styles.info}>
            <Text style={styles.name}>{userProfile?.name || 'User'}</Text>
            <Text style={styles.meta}>
              {userProfile?.college || 'College'} | {userProfile?.dept || 'Department'}
            </Text>
            <Text style={styles.email}>{userProfile?.email || 'email@example.com'}</Text>
          </View>
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => setShowEditModal(true)}
          >
            <Ionicons name="pencil" size={20} color={COLORS.light.text} />
          </TouchableOpacity>
        </View>

        {/* Streak & XP */}
        <View style={styles.streakRow}>
          <View style={styles.streakCard}>
            <View style={styles.streakIcon}>
              <Ionicons name="flame" size={24} color="#000" />
            </View>
            <View>
              <Text style={styles.streakLabel}>Streak</Text>
              <Text style={styles.streakValue}>{streak} {streak === 1 ? 'day' : 'days'}</Text>
            </View>
          </View>
          <View style={styles.xpCard}>
            <View style={[styles.streakIcon, { backgroundColor: COLORS.accent.mint }]}>
              <Ionicons name="star" size={24} color="#000" />
            </View>
            <View>
              <Text style={styles.streakLabel}>Total XP</Text>
              <Text style={styles.streakValue}>{stats.completed * 10}</Text>
            </View>
          </View>
        </View>

        {/* Overall Progress */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overall Progress</Text>
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Completion Rate</Text>
              <Text style={styles.progressValue}>{stats.completionRate}%</Text>
            </View>
            <ProgressBar
              value={stats.completed}
              max={stats.total || 1}
              variant={stats.completionRate >= 80 ? 'default' : 'warning'}
            />
            <View style={styles.progressStats}>
              <Text style={styles.progressStat}>{stats.completed} completed</Text>
              <Text style={styles.progressStat}>{stats.pending} pending</Text>
            </View>
          </View>
        </View>

        {/* Weekly Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>This Week</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.dueToday}</Text>
              <Text style={styles.statLabel}>Due Today</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.pending}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{zones.length}</Text>
              <Text style={styles.statLabel}>Zones</Text>
            </View>
          </View>
        </View>

        {/* Zone Breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Zone Breakdown</Text>
          {stats.zoneBreakdown.length === 0 ? (
            <Text style={styles.emptyText}>No zones yet</Text>
          ) : (
            stats.zoneBreakdown.map((zone) => (
              <View key={zone.id} style={styles.zoneItem}>
                <View style={styles.zoneHeader}>
                  <View style={styles.zoneName}>
                    <View style={[styles.zoneDot, { backgroundColor: zone.color }]} />
                    <Text style={styles.zoneNameText}>{zone.name}</Text>
                  </View>
                  <Text style={styles.zoneCount}>
                    {zone.completedCount}/{zone.taskCount}
                  </Text>
                </View>
                <ProgressBar
                  value={zone.completedCount}
                  max={zone.taskCount || 1}
                  variant="info"
                  showPercentage={false}
                />
              </View>
            ))
          )}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.accent.pink} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={showEditModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <InputField
              label="Name"
              value={editForm.name}
              onChangeText={(v) => setEditForm((p) => ({ ...p, name: v }))}
            />
            <InputField
              label="College"
              value={editForm.college}
              onChangeText={(v) => setEditForm((p) => ({ ...p, college: v }))}
            />
            <InputField
              label="Department"
              value={editForm.dept}
              onChangeText={(v) => setEditForm((p) => ({ ...p, dept: v }))}
            />
            <InputField
              label="Year"
              value={String(editForm.year)}
              onChangeText={(v) => setEditForm((p) => ({ ...p, year: v }))}
              keyboardType="numeric"
            />

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <PrimaryButton onPress={handleUpdateProfile} disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </PrimaryButton>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light.background,
  },
  scrollContent: {
    padding: SPACING.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.light.card,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    marginBottom: SPACING.xl,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  avatar: {
    width: 64,
    height: 64,
    backgroundColor: COLORS.accent.pink,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  avatarText: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xxl,
    fontWeight: '900',
    color: '#FFF',
  },
  info: {
    flex: 1,
  },
  name: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.lg,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: SPACING.xs,
  },
  meta: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.light.textMuted,
    marginBottom: 2,
  },
  email: {
    fontSize: FONT_SIZES.xs,
    color: COLORS.light.textMuted,
  },
  editBtn: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.light.card,
    borderWidth: 2,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakRow: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  streakCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.light.card,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  xpCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    backgroundColor: COLORS.light.card,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  streakIcon: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.accent.yellow,
    borderWidth: 2,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakLabel: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xs,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: COLORS.light.textMuted,
  },
  streakValue: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.lg,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: SPACING.md,
  },
  progressCard: {
    backgroundColor: COLORS.light.card,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  progressLabel: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.sm,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  progressValue: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
  },
  progressStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  progressStat: {
    fontSize: FONT_SIZES.sm,
    color: COLORS.light.textMuted,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  statCard: {
    width: '47%',
    backgroundColor: COLORS.light.card,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  statValue: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xxl,
    fontWeight: '900',
  },
  statLabel: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xs,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: COLORS.light.textMuted,
  },
  zoneItem: {
    backgroundColor: COLORS.light.card,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
  },
  zoneHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  zoneName: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  zoneDot: {
    width: 12,
    height: 12,
    borderRadius: RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.light.border,
  },
  zoneNameText: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.sm,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  zoneCount: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.sm,
    color: COLORS.light.textMuted,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.light.textMuted,
    paddingVertical: SPACING.xl,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    padding: SPACING.md,
    borderWidth: 3,
    borderColor: COLORS.accent.pink,
    borderRadius: RADIUS.md,
    marginTop: SPACING.lg,
  },
  logoutText: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.md,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: COLORS.accent.pink,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  modalContent: {
    backgroundColor: COLORS.light.card,
    borderWidth: 3,
    borderColor: COLORS.light.border,
    borderRadius: RADIUS.lg,
    padding: SPACING.xl,
  },
  modalTitle: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.xxl,
    fontWeight: '900',
    textTransform: 'uppercase',
    marginBottom: SPACING.lg,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: SPACING.md,
    marginTop: SPACING.md,
  },
  cancelBtn: {
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
  },
  cancelText: {
    fontFamily: 'System',
    fontSize: FONT_SIZES.sm,
    fontWeight: '900',
    textTransform: 'uppercase',
    color: COLORS.light.textMuted,
  },
});
