/**
 * AuthContext — Authentication State Provider (Mobile)
 * ─────────────────────────────────────────────────────
 * UPGRADED with:
 * - Loading state while Firebase resolves auth (Bug #10 fix)
 * - Forgot password method
 * - Edit profile method
 * - Gamification (XP/streak) updates
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  // Firebase user object (null when logged out)
  const [user, setUser] = useState(null);
  // Extra profile data from Firestore (name, college, dept, year)
  const [userProfile, setUserProfile] = useState(null);
  // True while waiting for Firebase to resolve initial auth state
  const [loading, setLoading] = useState(true);

  // Listen to Firebase auth state changes on mount
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Load user profile from Firestore
        try {
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (snap.exists()) setUserProfile(snap.data());
        } catch (err) {
          console.warn('Failed to load profile:', err.message);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      // Auth state resolved — hide loading screen
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Sign up with email/password + save profile to Firestore
  const signUp = async (email, password, name, college, dept, year) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const profile = {
      uid: cred.user.uid,
      name, email, college, dept, year,
      xp: 0,
      streak: 0,
      lastCompletionDate: null,
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'users', cred.user.uid), profile);
    setUserProfile(profile);
    return cred.user;
  };

  // Log in with email and password
  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  // Log out the current user
  const logout = () => signOut(auth);

  // Send a password reset email
  const forgotPassword = (email) =>
    sendPasswordResetEmail(auth, email);

  // Update editable profile fields in Firestore
  const updateUserProfileData = async (updates) => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    const uid = auth.currentUser.uid;
    await updateDoc(doc(db, 'users', uid), updates);
    if (updates.name) {
      await updateProfile(auth.currentUser, { displayName: updates.name });
    }
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  // Update XP and streak values (called by TaskContext on task completion)
  const updateGamification = async (xp, streak, lastCompletionDate) => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    const updates = { xp, streak, lastCompletionDate };
    await updateDoc(doc(db, 'users', uid), updates);
    setUserProfile((prev) => ({ ...prev, ...updates }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        signUp,
        login,
        logout,
        forgotPassword,
        updateUserProfileData,
        updateGamification,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
