// ============================================
// AUTH CONTEXT - Firebase Authentication State
// Manages user authentication throughout the app
// FIX: Added loading state for auth indicator
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

// FIX: Use a function to return default zones instead of mutating a constant
export const getDefaultZones = () => [
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
  // FIX: Added loading state to show splash screen while Firebase resolves auth
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Listen to Firebase auth state changes
  // This handles persistent auth across app restarts
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        await fetchUserProfile(firebaseUser.uid);
      } else {
        setUser(null);
        setUserProfile(null);
      }
      // FIX: Set loading to false once auth state is resolved
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch user profile from Firestore
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

  // Create user profile document
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

  // FIX: Create zones without mutating a constant array
  const createDefaultZones = async (uid) => {
    const zones = getDefaultZones(); // Get fresh copy each time
    const zonePromises = zones.map((zone, index) => {
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

  // Sign up new user
  const signup = async (email, password, userData) => {
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { user: firebaseUser } = userCredential;

      await updateProfile(firebaseUser, { displayName: userData.name });
      await createUserProfile(firebaseUser.uid, { ...userData, email });
      await createDefaultZones(firebaseUser.uid);

      return firebaseUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Sign in existing user
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

  // Sign out
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

  // FIX: Implemented password reset functionality
  const resetPassword = async (email) => {
    setError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Update user profile
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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
