import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, getDocs, where } from "firebase/firestore";

// Use environment variables in production, fallback to hardcoded values for development
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDk6cProJ8bCqYywXsXEhdhpycBWJxU-uY",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "micro--blogging.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "micro--blogging",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "micro--blogging.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "539391995132",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:539391995132:web:782baa10eb66dd6d49fb79"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Auth functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const logOut = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Blog post functions
export const addBlogPost = async (user, content) => {
  try {
    const docRef = await addDoc(collection(db, "posts"), {
      userId: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      email: user.email,
      content,
      createdAt: serverTimestamp(),
      characterCount: content.length
    });
    return docRef.id;
  } catch (error) {
    console.error("Error adding blog post:", error);
    throw error;
  }
};

export const getAllPosts = async () => {
  try {
    const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting all posts:", error);
    throw error;
  }
};

export const getUserPosts = async (userId) => {
  try {
    const q = query(
      collection(db, "posts"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error getting user posts:", error);
    throw error;
  }
};

export { auth, db }; 