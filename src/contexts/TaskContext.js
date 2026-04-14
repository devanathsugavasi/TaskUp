/**
 * TaskContext — Tasks & Zones State Provider (Mobile)
 * ─────────────────────────────────────────────────────
 * UPGRADED: Uses onSnapshot real-time listeners instead of getDocs.
 * This means screens always show up-to-date data without manual refreshing.
 *
 * Features:
 * - onSnapshot real-time listeners (Bug #11 fix)
 * - Full CRUD for tasks and zones
 * - Zone rename cascade (updates all tasks referencing old zone name)
 * - Zone delete with fallback reassignment
 * - Streak / XP gamification on task completion
 * - Auth check before every write operation
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection, addDoc, getDocs, updateDoc,
  deleteDoc, doc, query, where, serverTimestamp,
  writeBatch, onSnapshot,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const { user, userProfile, updateGamification } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);

  // ── Real-time listeners (replace one-shot getDocs) ──────────
  useEffect(() => {
    if (!user) {
      setTasks([]);
      setZones([]);
      return;
    }

    setLoading(true);

    // Subscribe to tasks collection — real-time sync
    // NOTE: No orderBy here to avoid requiring a composite Firestore index.
    // Sorted client-side after data arrives.
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
    );
    const unsubTasks = onSnapshot(tasksQuery, (snap) => {
      const taskList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      // Sort by createdAt descending on the client
      taskList.sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0;
        const bTime = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0;
        return bTime - aTime;
      });
      setTasks(taskList);
      setLoading(false);
    }, (err) => {
      console.error('Tasks listener error:', err.message, err);
      setLoading(false);
    });

    // Subscribe to zones collection — real-time sync
    const zonesQuery = query(
      collection(db, 'zones'),
      where('userId', '==', user.uid),
    );
    const unsubZones = onSnapshot(zonesQuery, (snap) => {
      setZones(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    }, (err) => {
      console.warn('Zones listener error:', err.message);
    });

    // Cleanup: unsubscribe when user logs out or component unmounts
    return () => {
      unsubTasks();
      unsubZones();
    };
  }, [user]);

  // ── Helper: require auth before writes ──────────────────────
  const requireAuth = () => {
    if (!user) throw new Error('You must be logged in to perform this action.');
    return user.uid;
  };

  // Keep fetchTasks/fetchZones as no-ops for backward compatibility
  // (screens that still call them won't break, but data comes from onSnapshot)
  const fetchTasks = () => {};
  const fetchZones = () => {};

  // ── TASK CRUD ───────────────────────────────────────────────

  // Add a new task
  const addTask = async (taskData) => {
    const uid = requireAuth();
    await addDoc(collection(db, 'tasks'), {
      ...taskData,
      userId: uid,
      status: 'pending',
      createdAt: serverTimestamp(),
    });
    // No manual fetch — onSnapshot auto-updates
  };

  // Update an existing task
  const updateTask = async (taskId, updates) => {
    requireAuth();
    await updateDoc(doc(db, 'tasks', taskId), updates);
  };

  // Delete a task permanently
  const deleteTask = async (taskId) => {
    requireAuth();
    await deleteDoc(doc(db, 'tasks', taskId));
  };

  // Mark a task as completed + update streak/XP
  const completeTask = async (taskId) => {
    requireAuth();
    await updateDoc(doc(db, 'tasks', taskId), {
      status: 'completed',
      completedAt: serverTimestamp(),
    });

    // Gamification: Update streak and XP
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];
      const lastDate = userProfile?.lastCompletionDate || '';
      const currentStreak = userProfile?.streak || 0;
      const currentXP = userProfile?.xp || 0;

      let newStreak = currentStreak;
      if (lastDate === yesterdayStr) {
        newStreak = currentStreak + 1;
      } else if (lastDate !== todayStr) {
        newStreak = 1;
      }

      const streakBonus = Math.min(newStreak * 2, 20);
      const newXP = currentXP + 10 + streakBonus;

      if (updateGamification) {
        await updateGamification(newXP, newStreak, todayStr);
      }
    } catch (err) {
      console.warn('Gamification error:', err.message);
    }
  };

  // ── ZONE CRUD ───────────────────────────────────────────────

  // Add a new zone
  const addZone = async (name, color) => {
    const uid = requireAuth();
    await addDoc(collection(db, 'zones'), {
      name, color,
      userId: uid,
      taskCount: 0,
      createdAt: serverTimestamp(),
    });
  };

  // Update a zone (name and/or color) — cascades name change to tasks
  const updateZone = async (zoneId, updates) => {
    const uid = requireAuth();
    const oldZone = zones.find((z) => z.id === zoneId);
    await updateDoc(doc(db, 'zones', zoneId), updates);

    // If zone name changed, update all tasks referencing the old name
    if (oldZone && updates.name && updates.name !== oldZone.name) {
      const tasksQ = query(
        collection(db, 'tasks'),
        where('userId', '==', uid),
        where('zone', '==', oldZone.name),
      );
      const taskSnap = await getDocs(tasksQ);
      const batch = writeBatch(db);
      taskSnap.docs.forEach((d) => {
        batch.update(d.ref, { zone: updates.name });
      });
      await batch.commit();
    }
  };

  // Delete a zone — reassigns orphaned tasks to a fallback zone
  const deleteZone = async (zoneId) => {
    const uid = requireAuth();
    const zone = zones.find((z) => z.id === zoneId);
    await deleteDoc(doc(db, 'zones', zoneId));

    if (zone) {
      const tasksQ = query(
        collection(db, 'tasks'),
        where('userId', '==', uid),
        where('zone', '==', zone.name),
      );
      const taskSnap = await getDocs(tasksQ);
      if (taskSnap.docs.length > 0) {
        const remaining = zones.filter((z) => z.id !== zoneId);
        const fallback = remaining.find((z) => z.name === 'Personal Zone') || remaining[0];
        const fallbackName = fallback?.name || 'Uncategorized';
        const batch = writeBatch(db);
        taskSnap.docs.forEach((d) => {
          batch.update(d.ref, { zone: fallbackName });
        });
        await batch.commit();
      }
    }
  };

  return (
    <TaskContext.Provider value={{
      tasks, zones, loading,
      fetchTasks, addTask, updateTask, deleteTask, completeTask,
      fetchZones, addZone, updateZone, deleteZone,
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);
