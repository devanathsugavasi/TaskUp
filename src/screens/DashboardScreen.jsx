import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, StatusBar, RefreshControl,
} from 'react-native';
import { useTasks } from '../contexts/TaskContext';
import { useAuth } from '../contexts/AuthContext';
import SearchBar from '../components/SearchBar';
import FilterTabs from '../components/FilterTabs';
import TaskCard from '../components/TaskCard';
import EmptyState from '../components/EmptyState';
import SectionHeader from '../components/SectionHeader';
import { COLORS, SPACING, RADIUS, SHADOWS, PRIORITY_COLORS } from '../theme';

export default function DashboardScreen({ navigation }) {
  const { tasks, zones, fetchTasks, fetchZones, loading, completeTask } = useTasks();
  const { userProfile } = useAuth();
  const [activeZone, setActiveZone] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchTasks();
    fetchZones();
  }, []);

  // Build filter tabs
  const filterTabs = [
    { key: 'All', label: 'All' },
    { key: 'Today', label: 'Today' },
    ...zones.map(z => ({ key: z.name, label: z.name.replace(' Zone', '') })),
  ];

  // Filter tasks
  let filtered = tasks.filter(t => t.status === 'pending');

  if (activeZone === 'Today') {
    // FIX: Actually filter by today's date (was previously a no-op)
    const todayStr = new Date().toISOString().split('T')[0];
    filtered = filtered.filter(t => t.calendarDate === todayStr);
  } else if (activeZone !== 'All') {
    filtered = filtered.filter(t => t.zone === activeZone);
  }

  // Search filter
  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(t =>
      t.title?.toLowerCase().includes(q) ||
      t.desc?.toLowerCase().includes(q)
    );
  }

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalCount = tasks.length;
  const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = userProfile?.name?.split(' ')[0] || 'Student';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.backgroundCream} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{greeting()},</Text>
          <Text style={styles.name}>{firstName}</Text>
        </View>
        <View style={styles.progressBubble}>
          <Text style={styles.progressNum}>{progress}%</Text>
          <Text style={styles.progressLbl}>Done</Text>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchWrap}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search tasks..."
        />
      </View>

      {/* Zone filter tabs */}
      <FilterTabs
        tabs={filterTabs}
        activeTab={activeZone}
        onTabPress={setActiveZone}
      />

      {/* Task list */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={() => { fetchTasks(); fetchZones(); }}
            tintColor={COLORS.primaryMoss}
          />
        }
        ListHeaderComponent={
          filtered.length > 0 ? (
            <SectionHeader
              title="Plan for Today"
              subtitle={`${filtered.length} task${filtered.length !== 1 ? 's' : ''} remaining`}
              style={{ marginBottom: SPACING.lg }}
            />
          ) : null
        }
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onPress={() => navigation.navigate('AddTask', { task: item })}
            onComplete={() => completeTask(item.id)}
          />
        )}
        ListEmptyComponent={
          <EmptyState
            title={searchQuery ? 'No results found' : 'All clear'}
            message={
              searchQuery
                ? `No tasks match "${searchQuery}". Try a different search.`
                : activeZone !== 'All'
                  ? `No pending tasks in ${activeZone}. Tap + to add one.`
                  : 'No pending tasks. Tap + to create your first task.'
            }
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundCream,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.xl,
    paddingTop: 56,
    paddingBottom: SPACING.lg,
  },
  greeting: {
    fontSize: 13,
    color: COLORS.mutedText,
    fontWeight: '500',
  },
  name: {
    fontSize: 28,
    fontWeight: '900',
    color: COLORS.textCharcoal,
    letterSpacing: -0.5,
    textTransform: 'uppercase',
  },
  progressBubble: {
    backgroundColor: COLORS.primaryMoss, // Now black
    borderRadius: RADIUS.sm,
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    alignItems: 'center',
    minWidth: 64,
    borderWidth: 3,
    borderColor: '#000000',
    ...SHADOWS.card,
  },
  progressNum: {
    fontSize: 20,
    fontWeight: '900',
    color: COLORS.successSage,
    fontFamily: 'Courier',
  },
  progressLbl: {
    fontSize: 9,
    color: 'rgba(255,255,255,0.65)',
    marginTop: 2,
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  searchWrap: {
    paddingHorizontal: SPACING.xl,
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 100,
  },
});
