import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyANIBeRcaEj0m5UmYkqwoH9eCKCZqjHXe4",
  authDomain: "e-commerce-bd85f.firebaseapp.com",
  projectId: "e-commerce-bd85f",
  storageBucket: "e-commerce-bd85f.firebasestorage.app",
  messagingSenderId: "506732487716",
  appId: "1:506732487716:web:eede830fcbae2d271ea4b1",
  measurementId: "G-YVEE44E4YH"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };
