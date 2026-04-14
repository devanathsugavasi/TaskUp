/**
 * Firebase Configuration — TaskUp Web
 * ─────────────────────────────────────────────────────
 * Initializes Firebase using environment variables from .env.
 * NEVER hardcode API keys directly in this file.
 * Run `cp .env.example .env` and fill in your Firebase project values.
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Read Firebase config from Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app instance
const app = initializeApp(firebaseConfig);

// Export auth and Firestore database instances for use across the app
export const auth = getAuth(app);
export const db = getFirestore(app);
