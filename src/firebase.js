import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Prefer env vars; fall back to current inline values for local dev
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyCjFLLW5zxLL-AhSo0egaPN3uqjBec5nKs",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "mapster-62700.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "mapster-62700",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "mapster-62700.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "631112543082",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:631112543082:web:4ee8b8e7ef5671e1811313"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);