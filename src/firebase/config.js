/**
 * Firebase Configuration — TaskUp Mobile
 * ─────────────────────────────────────────────────────
 * Reads Firebase credentials from app.json's "extra" block
 * via expo-constants. NEVER hardcode API keys directly here.
 *
 * For production EAS builds, use EAS Secrets to inject
 * environment variables that override these values.
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

// Read config from app.json > expo > extra (set via EAS Secrets in production)
const extra = Constants.expoConfig?.extra || {};

const firebaseConfig = {
  apiKey: extra.firebaseApiKey,
  authDomain: extra.firebaseAuthDomain,
  projectId: extra.firebaseProjectId,
  storageBucket: extra.firebaseStorageBucket,
  messagingSenderId: extra.firebaseMessagingSenderId,
  appId: extra.firebaseAppId,
  measurementId: extra.firebaseMeasurementId,
};

// Initialize Firebase app instance
const app = initializeApp(firebaseConfig);

// Export auth and Firestore database instances
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});
