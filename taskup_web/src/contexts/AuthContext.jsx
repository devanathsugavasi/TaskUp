// ============================================
// AUTH CONTEXT - Firebase Authentication State
// Manages user authentication state throughout the app
// Provides login, signup, logout, and password reset
// ============================================

import { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

const AuthContext = createContext(null);

// Default zones for new users when they first sign up
// These will be created in Firestore for each new user
export const DEFAULT_ZONES = [
  { name: 'Work', color: '#FF007F' },
  { name: 'Reading', color: '#FFD500' },
  { name: 'Meeting', color: '#00FF88' },
  { name: 'Food', color: '#00FFFF' },
  { name: 'Exam', color: '#5B4FD4' },
  { name: 'Personal', color: '#FF6B6B' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set up auth state listener on mount
  // This handles persistent auth state across page reloads
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        // Fetch user profile from Firestore when auth state changes
        await fetchUserProfile(firebaseUser.uid);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  // Fetch user profile from Firestore users collection
  const fetchUserProfile = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserProfile({ id: userDoc.id, ...userDoc.data() });
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err.message);
    }
  };

  // Create user profile document in Firestore
  const createUserProfile = async (uid, userData) => {
    const userRef = doc(db, 'users', uid);
    const profileData = {
      uid,
      name: userData.name,
      email: userData.email,
      college: userData.college || '',
      dept: userData.dept || '',
      year: userData.year || 1,
      createdAt: serverTimestamp(),
    };
    await setDoc(userRef, profileData);
    setUserProfile({ id: uid, ...profileData });
  };

  // Create default zones for new user in Firestore
  const createDefaultZones = async (uid) => {
    const zonePromises = DEFAULT_ZONES.map((zone, index) => {
      const zoneRef = doc(db, 'zones', `${uid}_zone_${index}`);
      return setDoc(zoneRef, {
        userId: uid,
        name: zone.name,
        color: zone.color,
        taskCount: 0,
        createdAt: serverTimestamp(),
      });
    });
    await Promise.all(zonePromises);
  };

  // Sign up new user with email and password
  // Also creates user profile and default zones in Firestore
  const signup = async (email, password, userData) => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user: firebaseUser } = userCredential;

      // Update Firebase Auth profile with display name
      await updateProfile(firebaseUser, { displayName: userData.name });

      // Create user profile document in Firestore
      await createUserProfile(firebaseUser.uid, { ...userData, email });

      // Create default zones for the new user
      await createDefaultZones(firebaseUser.uid);

      return firebaseUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Sign in existing user with email and password
  const login = async (email, password) => {
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Sign out current user
  const logout = async () => {
    setError(null);
    try {
      await signOut(auth);
      setUserProfile(null);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Send password reset email to user
  const resetPassword = async (email) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update user profile in Firestore
  const updateUserProfile = async (updates) => {
    if (!user) return;
    setError(null);
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, updates, { merge: true });
      await fetchUserProfile(user.uid);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    error,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context in components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
