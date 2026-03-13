// Firestore helpers
// These are convenience wrappers around Firestore operations.
// Most CRUD logic lives in TaskContext.js — use these for one-off queries.

import {
    collection, doc, getDoc, getDocs,
    addDoc, updateDoc, deleteDoc,
    query, where, orderBy, serverTimestamp,
} from 'firebase/firestore';
import { db } from './config';

// ── Users ────────────────────────────────────────────────
export const getUserDoc = (uid) => getDoc(doc(db, 'users', uid));

export const updateUserDoc = (uid, data) =>
    updateDoc(doc(db, 'users', uid), data);

// ── Tasks ────────────────────────────────────────────────
export const getTasksForUser = async (uid) => {
    const q = query(
        collection(db, 'tasks'),
        where('userId', '==', uid),
        orderBy('createdAt', 'desc'),
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const createTask = (data) =>
    addDoc(collection(db, 'tasks'), { ...data, createdAt: serverTimestamp() });

export const updateTask = (taskId, data) =>
    updateDoc(doc(db, 'tasks', taskId), data);

export const removeTask = (taskId) =>
    deleteDoc(doc(db, 'tasks', taskId));

// ── Zones ────────────────────────────────────────────────
export const getZonesForUser = async (uid) => {
    const q = query(collection(db, 'zones'), where('userId', '==', uid));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
};

export const createZone = (data) =>
    addDoc(collection(db, 'zones'), { ...data, createdAt: serverTimestamp() });
