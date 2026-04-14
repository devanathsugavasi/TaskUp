// ============================================
// TASK CONTEXT - Task and Zone State Management
// Manages all task and zone operations with real-time sync via onSnapshot
// All Firestore operations respect user ownership via userId
// ============================================

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const TaskContext = createContext(null);

// Priority levels with their order and colors
export const PRIORITY_LEVELS = {
  urgent: { order: 0, label: 'Urgent', color: '#FF007F' },
  high: { order: 1, label: 'High', color: '#FF4500' },
  medium: { order: 2, label: 'Medium', color: '#FFD500' },
  low: { order: 3, label: 'Low', color: '#00FF88' },
};

export function TaskProvider({ children }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set up real-time Firestore listeners when user changes
  // Uses onSnapshot for real-time sync instead of getDocs
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setZones([]);
      setLoading(false);
      return;
    }

    // Create queries for tasks and zones filtered by userId
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const zonesQuery = query(
      collection(db, 'zones'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'asc')
    );

    // Set up real-time listener for tasks collection
    // onSnapshot automatically updates state when data changes in Firestore
    const unsubscribeTasks = onSnapshot(
      tasksQuery,
      (snapshot) => {
        const taskData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          // Convert Firestore timestamp to ISO string for display
          createdAt: doc.data().createdAt?.toDate()?.toISOString() || new Date().toISOString(),
          completedAt: doc.data().completedAt?.toDate()?.toISOString() || null,
        }));
        setTasks(taskData);
        setLoading(false);
      },
      (err) => {
        console.error('Tasks listener error:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    // Set up real-time listener for zones collection
    const unsubscribeZones = onSnapshot(
      zonesQuery,
      (snapshot) => {
        const zoneData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setZones(zoneData);
      },
      (err) => {
        console.error('Zones listener error:', err);
        setError(err.message);
      }
    );

    // Cleanup listeners on unmount or user change
    return () => {
      unsubscribeTasks();
      unsubscribeZones();
    };
  }, [user]);

  // Create a new task in Firestore
  const addTask = useCallback(
    async (taskData) => {
      if (!user) return;
      setError(null);
      try {
        const newTask = {
          userId: user.uid,
          title: taskData.title,
          desc: taskData.desc || '',
          zone: taskData.zone,
          priority: taskData.priority || 'medium',
          status: 'pending',
          dueDateStr: taskData.dueDateStr || '',
          reminderStr: taskData.reminderStr || '',
          calendarDate: taskData.calendarDate || new Date().toISOString().split('T')[0],
          createdAt: serverTimestamp(),
          completedAt: null,
        };
        const docRef = await addDoc(collection(db, 'tasks'), newTask);
        return { id: docRef.id, ...newTask };
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [user]
  );

  // Update an existing task in Firestore
  const updateTask = useCallback(
    async (taskId, updates) => {
      if (!user) return;
      setError(null);
      try {
        const taskRef = doc(db, 'tasks', taskId);
        await updateDoc(taskRef, {
          ...updates,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [user]
  );

  // Mark a task as complete or incomplete
  const toggleTaskComplete = useCallback(
    async (taskId, currentStatus) => {
      const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
      const updates = {
        status: newStatus,
        completedAt: newStatus === 'completed' ? serverTimestamp() : null,
      };
      await updateTask(taskId, updates);
    },
    [updateTask]
  );

  // Delete a task from Firestore
  const deleteTask = useCallback(
    async (taskId) => {
      if (!user) return;
      setError(null);
      try {
        await deleteDoc(doc(db, 'tasks', taskId));
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [user]
  );

  // Create a new zone in Firestore
  const addZone = useCallback(
    async (zoneData) => {
      if (!user) return;
      setError(null);
      try {
        const newZone = {
          userId: user.uid,
          name: zoneData.name,
          color: zoneData.color,
          taskCount: 0,
          createdAt: serverTimestamp(),
        };
        const docRef = await addDoc(collection(db, 'zones'), newZone);
        return { id: docRef.id, ...newZone };
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [user]
  );

  // Update an existing zone in Firestore
  const updateZone = useCallback(
    async (zoneId, updates) => {
      if (!user) return;
      setError(null);
      try {
        const zoneRef = doc(db, 'zones', zoneId);
        await updateDoc(zoneRef, updates);
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [user]
  );

  // Delete a zone and reassign its tasks to a default zone
  const deleteZone = useCallback(
    async (zoneId, zoneName) => {
      if (!user) return;
      setError(null);
      try {
        // Find or create a "Personal" zone for reassignment
        let personalZone = zones.find(
          (z) => z.name.toLowerCase() === 'personal' && z.id !== zoneId
        );

        if (!personalZone && zones.length > 1) {
          personalZone = zones.find((z) => z.id !== zoneId);
        }

        const batch = writeBatch(db);

        if (personalZone) {
          // Reassign all tasks from deleted zone to the fallback zone
          const tasksQuery = query(
            collection(db, 'tasks'),
            where('userId', '==', user.uid),
            where('zone', '==', zoneName)
          );
          const tasksSnapshot = await getDocs(tasksQuery);
          tasksSnapshot.forEach((taskDoc) => {
            batch.update(taskDoc.ref, { zone: personalZone.name });
          });
        }

        // Delete the zone
        batch.delete(doc(db, 'zones', zoneId));

        await batch.commit();
      } catch (err) {
        setError(err.message);
        throw err;
      }
    },
    [user, zones]
  );

  // Get tasks filtered by various criteria
  const getFilteredTasks = useCallback(
    (filters = {}) => {
      let filtered = [...tasks];

      // Filter by zone
      if (filters.zone && filters.zone !== 'all') {
        filtered = filtered.filter((t) => t.zone === filters.zone);
      }

      // Filter by search term (searches title and description)
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filtered = filtered.filter(
          (t) =>
            t.title.toLowerCase().includes(searchLower) ||
            (t.desc && t.desc.toLowerCase().includes(searchLower))
        );
      }

      // Filter by "Today" - tasks due today
      if (filters.today) {
        const today = new Date().toISOString().split('T')[0];
        filtered = filtered.filter((t) => t.calendarDate === today);
      }

      // Filter by status
      if (filters.status) {
        filtered = filtered.filter((t) => t.status === filters.status);
      }

      // Filter by priority
      if (filters.priority) {
        filtered = filtered.filter((t) => t.priority === filters.priority);
      }

      // Sort by priority (urgent first) then by creation date
      filtered.sort((a, b) => {
        const priorityOrder = PRIORITY_LEVELS[a.priority]?.order ?? 4;
        const priorityOrderB = PRIORITY_LEVELS[b.priority]?.order ?? 4;
        if (priorityOrder !== priorityOrderB) {
          return priorityOrder - priorityOrderB;
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });

      return filtered;
    },
    [tasks]
  );

  // Get tasks grouped by priority for Today screen
  const getTasksByPriority = useCallback(
    (taskList) => {
      const grouped = {
        urgent: [],
        high: [],
        medium: [],
        low: [],
      };

      taskList.forEach((task) => {
        if (task.status === 'pending') {
          if (grouped[task.priority]) {
            grouped[task.priority].push(task);
          } else {
            grouped.low.push(task);
          }
        }
      });

      return grouped;
    },
    []
  );

  // Calculate completion statistics for profile
  const getStats = useCallback(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const pending = total - completed;
    const today = new Date().toISOString().split('T')[0];
    const dueToday = tasks.filter(
      (t) => t.calendarDate === today && t.status === 'pending'
    ).length;

    // Calculate completion rate
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Calculate zone breakdown
    const zoneBreakdown = zones.map((zone) => ({
      ...zone,
      taskCount: tasks.filter((t) => t.zone === zone.name).length,
      completedCount: tasks.filter(
        (t) => t.zone === zone.name && t.status === 'completed'
      ).length,
    }));

    return {
      total,
      completed,
      pending,
      dueToday,
      completionRate,
      zoneBreakdown,
    };
  }, [tasks, zones]);

  const value = {
    tasks,
    zones,
    loading,
    error,
    addTask,
    updateTask,
    toggleTaskComplete,
    deleteTask,
    addZone,
    updateZone,
    deleteZone,
    getFilteredTasks,
    getTasksByPriority,
    getStats,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

// Custom hook to use task context in components
export function useTasks() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
