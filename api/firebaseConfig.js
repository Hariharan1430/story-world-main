import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Move this to a secure place (.env file or environment variables)
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAL06DqE6yvmulpKZ9GG4iYn_Z6lt4VJYk",
  authDomain: "story-world-app.firebaseapp.com",
  projectId: "story-world-app",
  storageBucket: "story-world-app.firebasestorage.app",
  messagingSenderId: "117539190816",
  appId: "1:117539190816:web:45cde01c26bd22c68ea445"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider, firestore, storage };
