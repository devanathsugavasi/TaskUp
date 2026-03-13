// Firebase Auth helpers
// All auth logic is handled via AuthContext.js
// This file provides direct exports if needed elsewhere.

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from './config';

export const loginUser = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

export const registerUser = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

export const logoutUser = () => signOut(auth);

export const resetPassword = (email) =>
    sendPasswordResetEmail(auth, email);
