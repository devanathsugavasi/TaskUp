// ============================================
// FIREBASE CONFIGURATION
// All config values loaded from environment variables
// Never hardcode Firebase credentials
// ============================================

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration object - reads from VITE_ environment variables
// Copy .env.example to .env and fill in your Firebase project values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase app with config
// If config values are missing, Firebase will throw a helpful error
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export for use throughout the app
export const auth = getAuth(app);

// Initialize Firestore database and export for use throughout the app
export const db = getFirestore(app);

// Export the app instance for potential use (analytics, etc.)
export default app;
