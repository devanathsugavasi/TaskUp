import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, StatusBar, Alert, Modal, TextInput,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import StatsCard from '../components/StatsCard';
import { COLORS, SPACING, RADIUS, SHADOWS, getZoneColor } from '../theme';

export default function ProfileScreen({ navigation }) {
  const { user, userProfile, logout, updateUserProfileData } = useAuth();
  // FIX: Use tasks from context instead of independent Firestore query
  const { tasks, zones } = useTasks();
  const [editOpen, setEditOpen] = useState(false);
  const [editName, setEditName] = useState(userProfile?.name || '');
  const [editCollege, setEditCollege] = useState(userProfile?.college || '');
  const [editDept, setEditDept] = useState(userProfile?.dept || '');
  const [saving, setSaving] = useState(false);

  // Compute stats directly from context (always up-to-date, no stale data)
  const completed = tasks.filter(t => t.status === 'completed');
  const pending = tasks.filter(t => t.status === 'pending');
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const weekAgo = new Date(now.getTime() - 7 * 86400000);

  const completedToday = completed.filter(t => {
    if (!t.completedAt?.toDate) return false;
    return t.completedAt.toDate().toISOString().split('T')[0] === todayStr;
  }).length;
  const completedWeek = completed.filter(t => {
    if (!t.completedAt?.toDate) return false;
    return t.completedAt.toDate() >= weekAgo;
  }).length;

  // Per-zone breakdown
  const zoneCounts = {};
  tasks.forEach(t => {
    if (!zoneCounts[t.zone]) zoneCounts[t.zone] = { total: 0, done: 0 };
    zoneCounts[t.zone].total++;
    if (t.status === 'completed') zoneCounts[t.zone].done++;
  });

  const weekly = tasks.length > 0 ? Math.round((completed.length / tasks.length) * 100) : 0;
  const initial = (userProfile?.name || user?.email || 'U')[0].toUpperCase();
  const streak = userProfile?.streak || 0;
  const xp = userProfile?.xp || 0;

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
  };

  // Save edited profile
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateUserProfileData({
        name: editName.trim(),
        college: editCollege.trim(),
        dept: editDept.trim(),
      });
      setEditOpen(false);
    } catch (e) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primaryMoss} />

      {/* Dark header band */}
      <View style={styles.headerBand}>
        <Text style={styles.screenTitle}>Profile</Text>
      </View>

      {/* Avatar + info */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarRing}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
        </View>
        <Text style={styles.displayName}>{userProfile?.name || 'Student'}</Text>
        <Text style={styles.college}>{userProfile?.college || ''}</Text>
        <Text style={styles.email}>{user?.email}</Text>
        {userProfile?.dept ? (
          <Text style={styles.dept}>
            {userProfile.dept}{userProfile?.year ? ` · Year ${userProfile.year}` : ''}
          </Text>
        ) : null}
      </View>

      {/* Stats grid */}
      <View style={styles.statsGrid}>
        <StatsCard value={completedToday} label="Today" color={COLORS.successSage} />
        <StatsCard value={completedWeek} label="This Week" color={COLORS.accentClay} />
        <StatsCard value={completed.length} label="Completed" color={COLORS.primaryMoss} />
        <StatsCard value={pending.length} label="Pending" color={COLORS.warningAmber} />
      </View>

      {/* Weekly productivity */}
      <View style={styles.progSection}>
        <View style={styles.progHeader}>
          <Text style={styles.progLabel}>Overall Productivity</Text>
          <Text style={[styles.progPct, {
            color: weekly >= 70 ? COLORS.successSage : COLORS.warningAmber,
          }]}>
            {weekly}%
          </Text>
        </View>
        <View style={styles.progTrack}>
          <View style={[styles.progFill, {
            width: `${weekly}%`,
            backgroundColor: weekly >= 70 ? COLORS.successSage : COLORS.warningAmber,
          }]} />
        </View>
      </View>

      {/* Zone breakdown */}
      {Object.keys(zoneCounts).length > 0 && (
        <View style={styles.zoneSection}>
          <Text style={styles.zoneSectionTitle}>Tasks by Zone</Text>
          {Object.entries(zoneCounts).map(([name, counts]) => {
            const zc = getZoneColor(name);
            const pct = counts.total > 0 ? Math.round((counts.done / counts.total) * 100) : 0;
            return (
              <View key={name} style={styles.zoneRow}>
                <View style={[styles.zDot, { backgroundColor: zc.accent }]} />
                <Text style={styles.zoneName}>{name}</Text>
                <Text style={styles.zoneCount}>{counts.done}/{counts.total}</Text>
                <View style={styles.zoneBar}>
                  <View style={[styles.zoneBarFill, { width: `${pct}%`, backgroundColor: zc.accent }]} />
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Settings actions */}
      <View style={styles.settingsSection}>
        <TouchableOpacity
          style={styles.settingsRow}
          onPress={() => navigation.navigate('ManageZones')}
          activeOpacity={0.8}
        >
          <Text style={styles.settingsText}>Manage Zones</Text>
          <Text style={styles.settingsArrow}>{"\u203A"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.settingsRow}
          onPress={() => {
            setEditName(userProfile?.name || '');
            setEditCollege(userProfile?.college || '');
            setEditDept(userProfile?.dept || '');
            setEditOpen(true);
          }}
          activeOpacity={0.8}
        >
          <Text style={styles.settingsText}>Edit Profile</Text>
          <Text style={styles.settingsArrow}>{"\u203A"}</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutTxt}>Log Out</Text>
      </TouchableOpacity>

      {/* Edit Profile Modal */}
      <Modal visible={editOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditOpen(false)}>
                <Text style={styles.modalCancel}>Cancel</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.fieldLabel}>Name</Text>
            <TextInput style={styles.modalInput} value={editName} onChangeText={setEditName} placeholder="Your name" />
            <Text style={styles.fieldLabel}>College</Text>
            <TextInput style={styles.modalInput} value={editCollege} onChangeText={setEditCollege} placeholder="Your college" />
            <Text style={styles.fieldLabel}>Department</Text>
            <TextInput style={styles.modalInput} value={editDept} onChangeText={setEditDept} placeholder="Your department" />
            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile} disabled={saving}>
              <Text style={styles.saveBtnText}>{saving ? '...' : 'Save Changes'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.backgroundCream },
  content: { paddingBottom: 80 },
  headerBand: {
    backgroundColor: COLORS.primaryMoss,
    paddingTop: 56,
    paddingBottom: 60,
    paddingHorizontal: SPACING.xxl,
  },
  screenTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: COLORS.white,
    textTransform: 'uppercase',
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: -44,
    marginBottom: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
  },
  avatarRing: {
    width: 90,
    height: 90,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.backgroundCream,
    borderWidth: 3,
    borderColor: COLORS.softBorder,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.card,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.warningAmber, // yellow pops nicely
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 42,
    fontWeight: '900',
    color: COLORS.textCharcoal,
  },
  displayName: {
    fontSize: 24,
    fontWeight: '900',
    color: COLORS.textCharcoal,
    textTransform: 'uppercase',
    letterSpacing: -0.5,
  },
  college: {
    fontSize: 13,
    color: COLORS.mutedText,
    marginTop: SPACING.xs,
  },
  email: {
    fontSize: 12,
    color: COLORS.infoMist,
    marginTop: SPACING.xs,
  },
  dept: {
    fontSize: 12,
    color: COLORS.infoMist,
    marginTop: SPACING.xs,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  progSection: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.xxl,
  },
  progHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  progLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.textCharcoal,
  },
  progPct: {
    fontSize: 14,
    fontWeight: '800',
    fontFamily: 'Courier',
  },
  progTrack: {
    height: 12,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.textCharcoal,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
  },
  progFill: {
    height: 12,
    borderRadius: RADIUS.sm,
  },
  zoneSection: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.xxl,
  },
  zoneSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.textCharcoal,
    marginBottom: SPACING.md,
  },
  zoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  zDot: {
    width: 12,
    height: 12,
    borderRadius: RADIUS.sm,
    borderWidth: 2,
    borderColor: COLORS.textCharcoal,
  },
  zoneName: {
    fontSize: 13,
    color: COLORS.textCharcoal,
    fontWeight: '500',
    flex: 1,
  },
  zoneCount: {
    fontSize: 12,
    color: COLORS.mutedText,
    fontFamily: 'Courier',
    fontWeight: '600',
    minWidth: 32,
    textAlign: 'right',
  },
  zoneBar: {
    width: 60,
    height: 8,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.textCharcoal,
    borderRadius: RADIUS.sm,
    overflow: 'hidden',
  },
  zoneBarFill: {
    height: 8,
    borderRadius: RADIUS.sm,
  },
  settingsSection: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
    padding: SPACING.lg,
    borderRadius: RADIUS.sm,
    borderWidth: 3,
    borderColor: COLORS.softBorder,
    marginBottom: SPACING.sm,
    ...SHADOWS.soft,
  },
  settingsText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.textCharcoal,
  },
  settingsArrow: {
    fontSize: 20,
    color: COLORS.mutedText,
    fontWeight: '400',
  },
  logoutBtn: {
    marginHorizontal: SPACING.xl,
    padding: SPACING.lg,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.warningAmber,
    borderWidth: 3,
    borderColor: COLORS.softBorder,
    alignItems: 'center',
    marginBottom: SPACING.xxl,
    ...SHADOWS.button,
  },
  logoutTxt: {
    color: COLORS.textCharcoal,
    fontWeight: '900',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  // Edit Profile modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: COLORS.backgroundCream,
    borderWidth: 3,
    borderColor: COLORS.softBorder,
    borderRadius: RADIUS.md,
    padding: SPACING.xxl,
    ...SHADOWS.elevated,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  modalCancel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.mutedText,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: SPACING.sm,
    color: COLORS.textCharcoal,
  },
  modalInput: {
    borderWidth: 3,
    borderColor: COLORS.softBorder,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: SPACING.lg,
    ...SHADOWS.soft,
  },
  saveBtn: {
    backgroundColor: COLORS.primaryMoss,
    borderWidth: 3,
    borderColor: COLORS.softBorder,
    borderRadius: RADIUS.md,
    padding: SPACING.md,
    alignItems: 'center',
    marginTop: SPACING.sm,
    ...SHADOWS.button,
  },
  saveBtnText: {
    color: COLORS.white,
    fontWeight: '900',
    fontSize: 16,
    textTransform: 'uppercase',
  },
});
