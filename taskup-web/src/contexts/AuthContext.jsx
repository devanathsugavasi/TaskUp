/**
 * AuthContext — Authentication State Provider
 * ─────────────────────────────────────────────────────
 * Manages Firebase Auth state across the entire app.
 * Provides: user, userProfile, loading, signUp, login, logout,
 *           forgotPassword, updateUserProfile
 *
 * How it works:
 * - onAuthStateChanged listens for Firebase login/logout events
 * - User profile data (name, college, etc.) is stored in Firestore
 * - The loading flag is true until Firebase resolves the initial auth state
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

// Create the context — components use useAuth() to access it
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
        // Load extra profile data from Firestore users collection
        try {
          const snap = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (snap.exists()) setUserProfile(snap.data());
        } catch (err) {
          console.warn('Failed to load user profile:', err.message);
        }
      } else {
        // User logged out — clear everything
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });
    // Cleanup listener on unmount
    return unsubscribe;
  }, []);

  // Sign up a new user with email/password + save profile to Firestore
  const signUp = async (email, password, name, college, dept, year) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    // Set the display name on the Firebase user object
    await updateProfile(cred.user, { displayName: name });
    // Save full profile to Firestore
    const profile = {
      uid: cred.user.uid,
      name,
      email,
      college,
      dept,
      year,
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
  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);

  // Log out the current user
  const logout = () => signOut(auth);

  // Send a password reset email to the given address
  const forgotPassword = (email) => sendPasswordResetEmail(auth, email);

  // Update editable profile fields (name, college, dept) in Firestore
  const updateUserProfileData = async (updates) => {
    if (!auth.currentUser) throw new Error('Not authenticated');
    const uid = auth.currentUser.uid;
    await updateDoc(doc(db, 'users', uid), updates);
    // Also update display name if name changed
    if (updates.name) {
      await updateProfile(auth.currentUser, { displayName: updates.name });
    }
    // Refresh local profile state
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

// Custom hook for consuming auth context — use this in any component
export const useAuth = () => useContext(AuthContext);
