// ============================================
// FIREBASE CONFIG - All config from environment variables
// Security fix: No hardcoded Firebase values
// ============================================

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

// Firebase config from app.json extra or environment
// In development, configure via app.json:
// {
//   "expo": {
//     "extra": {
//       "firebaseApiKey": "...",
//       "firebaseAuthDomain": "...",
//       ...
//     }
//   }
// }
const firebaseConfig = {
  apiKey: Constants.manifest?.extra?.firebaseApiKey || Constants.manifest?.extra?.FIREBASE_API_KEY,
  authDomain: Constants.manifest?.extra?.firebaseAuthDomain || Constants.manifest?.extra?.FIREBASE_AUTH_DOMAIN,
  projectId: Constants.manifest?.extra?.firebaseProjectId || Constants.manifest?.extra?.FIREBASE_PROJECT_ID,
  storageBucket: Constants.manifest?.extra?.firebaseStorageBucket || Constants.manifest?.extra?.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: Constants.manifest?.extra?.firebaseMessagingSenderId || Constants.manifest?.extra?.FIREBASE_MESSAGING_SENDER_ID,
  appId: Constants.manifest?.extra?.firebaseAppId || Constants.manifest?.extra?.FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
