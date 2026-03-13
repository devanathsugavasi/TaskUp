import React, { createContext, useContext, useState, useCallback } from 'react';
import {
    collection, addDoc, getDocs, updateDoc,
    deleteDoc, doc, query, where, orderBy, serverTimestamp,
    writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export function TaskProvider({ children }) {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([]);
    const [zones, setZones] = useState([]);
    const [loading, setLoading] = useState(false);

    // ── TASKS ──────────────────────────────────────────────────────
    const fetchTasks = useCallback(async () => {
        if (!user) return;
        setLoading(true);
        try {
            const q = query(
                collection(db, 'tasks'),
                where('userId', '==', user.uid),
                orderBy('createdAt', 'desc'),
            );
            const snap = await getDocs(q);
            setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (e) {
            console.warn('fetchTasks error', e.message);
        } finally {
            setLoading(false);
        }
    }, [user]);

    const addTask = async (taskData) => {
        await addDoc(collection(db, 'tasks'), {
            ...taskData,
            userId: user.uid,
            status: 'pending',
            createdAt: serverTimestamp(),
        });
        await fetchTasks();
    };

    const updateTask = async (taskId, updates) => {
        await updateDoc(doc(db, 'tasks', taskId), updates);
        await fetchTasks();
    };

    const deleteTask = async (taskId) => {
        await deleteDoc(doc(db, 'tasks', taskId));
        await fetchTasks();
    };

    const completeTask = async (taskId) => {
        await updateDoc(doc(db, 'tasks', taskId), {
            status: 'completed',
            completedAt: serverTimestamp(),
        });
        await fetchTasks();
    };

    // ── ZONES ──────────────────────────────────────────────────────
    const fetchZones = useCallback(async () => {
        if (!user) return;
        try {
            const q = query(collection(db, 'zones'), where('userId', '==', user.uid));
            const snap = await getDocs(q);
            setZones(snap.docs.map(d => ({ id: d.id, ...d.data() })));
        } catch (e) {
            console.warn('fetchZones error', e.message);
        }
    }, [user]);

    const addZone = async (name, color) => {
        await addDoc(collection(db, 'zones'), {
            name, color,
            userId: user.uid,
            taskCount: 0,
            createdAt: serverTimestamp(),
        });
        await fetchZones();
    };

    const updateZone = async (zoneId, updates) => {
        const oldZone = zones.find(z => z.id === zoneId);
        await updateDoc(doc(db, 'zones', zoneId), updates);

        // If zone name changed, update all tasks referencing the old zone name
        if (oldZone && updates.name && updates.name !== oldZone.name) {
            const tasksQ = query(
                collection(db, 'tasks'),
                where('userId', '==', user.uid),
                where('zone', '==', oldZone.name),
            );
            const taskSnap = await getDocs(tasksQ);
            const batch = writeBatch(db);
            taskSnap.docs.forEach(d => {
                batch.update(d.ref, { zone: updates.name });
            });
            await batch.commit();
            await fetchTasks();
        }

        await fetchZones();
    };

    const deleteZone = async (zoneId) => {
        const zone = zones.find(z => z.id === zoneId);
        await deleteDoc(doc(db, 'zones', zoneId));

        // Reassign orphaned tasks to "Personal Zone" or first remaining zone
        if (zone) {
            const tasksQ = query(
                collection(db, 'tasks'),
                where('userId', '==', user.uid),
                where('zone', '==', zone.name),
            );
            const taskSnap = await getDocs(tasksQ);
            if (taskSnap.docs.length > 0) {
                const remaining = zones.filter(z => z.id !== zoneId);
                const fallback = remaining.find(z => z.name === 'Personal Zone')
                    || remaining[0];
                const fallbackName = fallback?.name || 'Uncategorized';
                const batch = writeBatch(db);
                taskSnap.docs.forEach(d => {
                    batch.update(d.ref, { zone: fallbackName });
                });
                await batch.commit();
                await fetchTasks();
            }
        }

        await fetchZones();
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
