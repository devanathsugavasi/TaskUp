// ============================================
// DASHBOARD SCREEN - Main Task List View
// Displays tasks with filtering, search, and zone tabs
// ============================================

import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTasks } from '../contexts/TaskContext';
import { PrimaryButton } from '../components/Button';
import TaskCard from '../components/TaskCard';
import SearchBar from '../components/SearchBar';
import FilterTabs from '../components/FilterTabs';
import EmptyState from '../components/EmptyState';
import ProgressBar from '../components/ProgressBar';
import './DashboardScreen.css';

export default function DashboardScreen() {
  const { userProfile } = useAuth();
  const { tasks, zones, getFilteredTasks } = useTasks();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeZone, setActiveZone] = useState('all');
  const [showToday, setShowToday] = useState(false);

  // Get greeting based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  // Calculate today's progress
  const todayStats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter((t) => t.calendarDate === today);
    const completed = todayTasks.filter((t) => t.status === 'completed').length;
    const total = todayTasks.length;
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [tasks]);

  // Calculate overall stats
  const overallStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    return { total, completed, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [tasks]);

  // Build filter tabs from zones
  const filterTabs = useMemo(() => {
    const tabs = [
      {
        value: 'all',
        label: 'All',
        count: tasks.length,
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="9" y="1" width="6" height="6" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="1" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.5"/>
            <rect x="9" y="9" width="6" height="6" stroke="currentColor" strokeWidth="1.5"/>
          </svg>
        ),
      },
      {
        value: 'today',
        label: 'Today',
        count: todayStats.total,
        icon: (
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="1" y="2" width="14" height="13" rx="1" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M1 6H15" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M5 1V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M11 1V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        ),
      },
    ];

    // Add zone tabs
    zones.forEach((zone) => {
      const zoneTaskCount = tasks.filter((t) => t.zone === zone.name).length;
      tabs.push({
        value: zone.name,
        label: zone.name,
        count: zoneTaskCount,
        icon: (
          <span
            style={{
              width: 12,
              height: 12,
              backgroundColor: zone.color,
              borderRadius: 2,
            }}
          />
        ),
      });
    });

    return tabs;
  }, [zones, tasks, todayStats.total]);

  // Determine active filter
  const activeTab = showToday ? 'today' : activeZone;

  // Handle tab change
  const handleTabChange = (tab) => {
    if (tab === 'all') {
      setActiveZone('all');
      setShowToday(false);
    } else if (tab === 'today') {
      setActiveZone('all');
      setShowToday(true);
    } else {
      setActiveZone(tab);
      setShowToday(false);
    }
  };

  // Filter tasks based on current filters
  const filteredTasks = useMemo(() => {
    return getFilteredTasks({
      zone: activeZone !== 'all' ? activeZone : undefined,
      search: searchQuery,
      today: showToday,
      status: 'pending',
    });
  }, [getFilteredTasks, activeZone, searchQuery, showToday]);

  // Handle edit task navigation
  const handleEditTask = (task) => {
    // Navigate to add task screen with task data for editing
    window.location.href = `/add-task?edit=${task.id}`;
  };

  // Get user's first name
  const firstName = userProfile?.name?.split(' ')[0] || 'there';

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Header */}
        <header className="dashboard-header">
          <div className="dashboard-greeting">
            <h1 className="dashboard-title">{getGreeting()}, {firstName}</h1>
            <p className="dashboard-subtitle">
              {showToday
                ? "Here's your plan for today"
                : activeZone === 'all'
                ? 'All your pending tasks'
                : `${activeZone} tasks`}
            </p>
          </div>
          <Link to="/add-task" className="dashboard-add-link">
            <PrimaryButton>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3V13M3 8H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              Add Task
            </PrimaryButton>
          </Link>
        </header>

        {/* Progress Summary */}
        <div className="dashboard-progress">
          <div className="dashboard-progress-card">
            <h3 className="dashboard-progress-label">Today</h3>
            <ProgressBar
              value={todayStats.completed}
              max={todayStats.total}
              showPercentage={false}
              variant={todayStats.percentage >= 100 ? 'default' : 'info'}
            />
            <span className="dashboard-progress-stat">
              {todayStats.completed}/{todayStats.total}
            </span>
          </div>
          <div className="dashboard-progress-card">
            <h3 className="dashboard-progress-label">Overall</h3>
            <ProgressBar
              value={overallStats.completed}
              max={overallStats.total}
              showPercentage={false}
              variant={overallStats.percentage >= 100 ? 'default' : 'info'}
            />
            <span className="dashboard-progress-stat">
              {overallStats.completed}/{overallStats.total}
            </span>
          </div>
        </div>

        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onClear={() => setSearchQuery('')}
          placeholder="Search tasks..."
        />

        {/* Filter Tabs */}
        <FilterTabs
          tabs={filterTabs}
          activeTab={activeTab}
          onChange={handleTabChange}
        />

        {/* Task List */}
        <div className="dashboard-tasks">
          {filteredTasks.length === 0 ? (
            <EmptyState
              icon={
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <rect x="4" y="4" width="32" height="32" rx="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M12 20H28M12 14H28M12 26H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              }
              title={searchQuery ? 'No matching tasks' : 'No tasks yet'}
              message={
                searchQuery
                  ? 'Try a different search term or clear the filter'
                  : showToday
                  ? 'No tasks due today. Enjoy your free time!'
                  : 'Add your first task to get started'
              }
              actionLabel={!searchQuery ? 'Add Task' : undefined}
              onAction={!searchQuery ? () => (window.location.href = '/add-task') : undefined}
            />
          ) : (
            <div className="task-list">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
