import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  ScrollView, StatusBar, Alert,
} from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import StatsCard from '../components/StatsCard';
import { COLORS, SPACING, RADIUS, SHADOWS, getZoneColor } from '../theme';

export default function ProfileScreen({ navigation }) {
  const { user, userProfile, logout } = useAuth();
  const { zones } = useTasks();
  const [stats, setStats] = useState({
    completed: 0, pending: 0, total: 0, zones: 0,
    completedToday: 0, completedWeek: 0,
  });
  const [zoneCounts, setZoneCounts] = useState({});

  useEffect(() => { loadStats(); }, []);

  const loadStats = async () => {
    try {
      const q = query(collection(db, 'tasks'), where('userId', '==', user.uid));
      const snap = await getDocs(q);
      const all = snap.docs.map(d => d.data());

      const now = new Date();
      const todayStr = now.toISOString().split('T')[0];
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const completed = all.filter(t => t.status === 'completed');
      const completedToday = completed.filter(t => {
        if (!t.completedAt?.toDate) return false;
        return t.completedAt.toDate().toISOString().split('T')[0] === todayStr;
      }).length;
      const completedWeek = completed.filter(t => {
        if (!t.completedAt?.toDate) return false;
        return t.completedAt.toDate() >= weekAgo;
      }).length;

      // Per-zone counts
      const zCounts = {};
      all.forEach(t => {
        if (!zCounts[t.zone]) zCounts[t.zone] = { total: 0, done: 0 };
        zCounts[t.zone].total++;
        if (t.status === 'completed') zCounts[t.zone].done++;
      });

      setStats({
        completed: completed.length,
        pending: all.filter(t => t.status === 'pending').length,
        total: all.length,
        zones: zones.length,
        completedToday,
        completedWeek,
      });
      setZoneCounts(zCounts);
    } catch (e) { console.warn(e.message); }
  };

  const weekly = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;
  const initial = (userProfile?.name || user?.email || 'U')[0].toUpperCase();

  const handleLogout = () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Log Out', style: 'destructive', onPress: logout },
    ]);
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
        <StatsCard value={stats.completedToday} label="Today" color={COLORS.successSage} />
        <StatsCard value={stats.completedWeek} label="This Week" color={COLORS.accentClay} />
        <StatsCard value={stats.completed} label="Completed" color={COLORS.primaryMoss} />
        <StatsCard value={stats.pending} label="Pending" color={COLORS.warningAmber} />
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
          <Text style={styles.settingsArrow}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutTxt}>Log Out</Text>
      </TouchableOpacity>
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
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.white,
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
    borderRadius: 45,
    backgroundColor: COLORS.backgroundCream,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primaryMoss,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 36,
    fontWeight: '800',
    color: COLORS.white,
  },
  displayName: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.textCharcoal,
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
    height: 8,
    backgroundColor: COLORS.softBorder,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progFill: {
    height: 8,
    borderRadius: 4,
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
    width: 8,
    height: 8,
    borderRadius: 4,
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
    height: 4,
    backgroundColor: COLORS.softBorder,
    borderRadius: 2,
    overflow: 'hidden',
  },
  zoneBarFill: {
    height: 4,
    borderRadius: 2,
  },
  settingsSection: {
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.xl,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.softSurface,
    padding: SPACING.lg,
    borderRadius: RADIUS.lg,
    borderWidth: 1,
    borderColor: COLORS.softBorder,
    marginBottom: SPACING.sm,
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
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.roseLight,
    alignItems: 'center',
    marginBottom: SPACING.xxl,
  },
  logoutTxt: {
    color: COLORS.criticalRose,
    fontWeight: '700',
    fontSize: 15,
  },
});
