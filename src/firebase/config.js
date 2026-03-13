import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD6GA7U1N71V-2IM7hOogESxoCoDSUjm1U",
  authDomain: "task-4f5f9.firebaseapp.com",
  projectId: "task-4f5f9",
  storageBucket: "task-4f5f9.firebasestorage.app",
  messagingSenderId: "1090821655655",
  appId: "1:1090821655655:web:86c52304e5f68b784058c2",
  measurementId: "G-KJHF9CBWTB",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
