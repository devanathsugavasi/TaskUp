/**
 * TaskContext — Tasks & Zones State Provider
 * ─────────────────────────────────────────────────────
 * DEBUGGING VERSION — Extra console.log at every step
 * to diagnose why tasks aren't being saved/displayed.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  collection, addDoc, updateDoc, deleteDoc, doc,
  query, where, serverTimestamp,
  onSnapshot, writeBatch, getDocs,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const { user, userProfile, updateGamification } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [zones, setZones] = useState([]);
  const [loading, setLoading] = useState(false);
  // Track errors so they can be displayed in the UI
  const [error, setError] = useState(null);

  // ── Real-time listeners ──
  useEffect(() => {
    if (!user) {
      console.log('[TaskContext] No user — clearing tasks and zones');
      setTasks([]);
      setZones([]);
      return;
    }

    console.log('[TaskContext] User logged in:', user.uid);
    console.log('[TaskContext] Setting up Firestore listeners...');
    setLoading(true);
    setError(null);

    // ── Tasks listener ──
    const tasksQuery = query(
      collection(db, 'tasks'),
      where('userId', '==', user.uid),
    );

    const unsubTasks = onSnapshot(
      tasksQuery,
      (snap) => {
        console.log('[TaskContext] ✅ Tasks snapshot received:', snap.size, 'documents');
        const taskList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        // Sort client-side by createdAt descending
        taskList.sort((a, b) => {
          const aTime = a.createdAt?.toMillis?.() || a.createdAt?.seconds * 1000 || 0;
          const bTime = b.createdAt?.toMillis?.() || b.createdAt?.seconds * 1000 || 0;
          return bTime - aTime;
        });
        console.log('[TaskContext] Task list after sort:', taskList.map(t => t.title));
        setTasks(taskList);
        setLoading(false);
      },
      (err) => {
        console.error('[TaskContext] ❌ TASKS LISTENER ERROR:', err.code, err.message);
        console.error('[TaskContext] Full error:', err);
        setError('Tasks listener failed: ' + err.message);
        setLoading(false);
      },
    );

    // ── Zones listener ──
    const zonesQuery = query(
      collection(db, 'zones'),
      where('userId', '==', user.uid),
    );

    const unsubZones = onSnapshot(
      zonesQuery,
      (snap) => {
        console.log('[TaskContext] ✅ Zones snapshot received:', snap.size, 'documents');
        const zoneList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        console.log('[TaskContext] Zones:', zoneList.map(z => z.name));
        setZones(zoneList);
      },
      (err) => {
        console.error('[TaskContext] ❌ ZONES LISTENER ERROR:', err.code, err.message);
        console.error('[TaskContext] Full error:', err);
        setError('Zones listener failed: ' + err.message);
      },
    );

    return () => {
      console.log('[TaskContext] Cleaning up listeners');
      unsubTasks();
      unsubZones();
    };
  }, [user]);

  // ── Helper: verify auth ──
  const requireAuth = () => {
    if (!user) throw new Error('You must be logged in.');
    return user.uid;
  };

  // ── TASK CRUD ──

  const addTask = async (taskData) => {
    const uid = requireAuth();
    console.log('[TaskContext] addTask called with:', taskData);
    console.log('[TaskContext] Writing to Firestore for userId:', uid);

    const payload = {
      ...taskData,
      userId: uid,
      status: 'pending',
      createdAt: serverTimestamp(),
    };
    console.log('[TaskContext] Full payload:', payload);

    try {
      const docRef = await addDoc(collection(db, 'tasks'), payload);
      console.log('[TaskContext] ✅ Task saved! Document ID:', docRef.id);
      return docRef;
    } catch (err) {
      console.error('[TaskContext] ❌ addTask FAILED:', err.code, err.message);
      console.error('[TaskContext] Full error:', err);
      throw err; // Re-throw so the screen can show the error
    }
  };

  const updateTask = async (taskId, updates) => {
    requireAuth();
    console.log('[TaskContext] updateTask:', taskId, updates);
    await updateDoc(doc(db, 'tasks', taskId), updates);
  };

  const deleteTask = async (taskId) => {
    requireAuth();
    console.log('[TaskContext] deleteTask:', taskId);
    await deleteDoc(doc(db, 'tasks', taskId));
  };

  const completeTask = async (taskId) => {
    const uid = requireAuth();
    console.log('[TaskContext] completeTask:', taskId);
    await updateDoc(doc(db, 'tasks', taskId), {
      status: 'completed',
      completedAt: serverTimestamp(),
    });

    // Gamification
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
      await updateGamification(newXP, newStreak, todayStr);
    } catch (err) {
      console.warn('Gamification error:', err.message);
    }
  };

  // ── ZONE CRUD ──

  const addZone = async (name, color) => {
    const uid = requireAuth();
    console.log('[TaskContext] addZone:', name, color);
    try {
      const docRef = await addDoc(collection(db, 'zones'), {
        name,
        color,
        userId: uid,
        taskCount: 0,
        createdAt: serverTimestamp(),
      });
      console.log('[TaskContext] ✅ Zone saved! ID:', docRef.id);
    } catch (err) {
      console.error('[TaskContext] ❌ addZone FAILED:', err.code, err.message);
      throw err;
    }
  };

  const updateZone = async (zoneId, updates) => {
    const uid = requireAuth();
    const oldZone = zones.find((z) => z.id === zoneId);
    await updateDoc(doc(db, 'zones', zoneId), updates);

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
    <TaskContext.Provider
      value={{
        tasks,
        zones,
        loading,
        error,
        addTask,
        updateTask,
        deleteTask,
        completeTask,
        addZone,
        updateZone,
        deleteZone,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => useContext(TaskContext);
