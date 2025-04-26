import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, getDocs, where } from "firebase/firestore";
import { 
  updateDoc, doc, arrayUnion, arrayRemove, 
  getDoc, increment, limit, startAfter
} from "firebase/firestore";

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
      characterCount: content.length,
      likes: 0,
      dislikes: 0,
      likedBy: [],
      dislikedBy: []
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

// Improved reaction function to handle both like and dislike
export const reactToPost = async (postId, userId, reactionType) => {
  try {
    const postRef = doc(db, "posts", postId);
    
    // Get the full post data
    const postSnap = await getDoc(postRef);
    
    if (!postSnap.exists()) {
      throw new Error(`Post with ID ${postId} not found`);
    }
    
    const postData = postSnap.data();
    const likedBy = postData.likedBy || [];
    const dislikedBy = postData.dislikedBy || [];
    
    const updates = {};
    
    if (reactionType === 'like') {
      // User wants to like the post
      if (likedBy.includes(userId)) {
        // User already liked, remove the like (toggle off)
        updates.likedBy = arrayRemove(userId);
        updates.likes = increment(-1);
      } else {
        // Add like
        updates.likedBy = arrayUnion(userId);
        updates.likes = increment(1);
        
        // If user had disliked before, remove the dislike
        if (dislikedBy.includes(userId)) {
          updates.dislikedBy = arrayRemove(userId);
          updates.dislikes = increment(-1);
        }
      }
    } else if (reactionType === 'dislike') {
      // User wants to dislike the post
      if (dislikedBy.includes(userId)) {
        // User already disliked, remove the dislike (toggle off)
        updates.dislikedBy = arrayRemove(userId);
        updates.dislikes = increment(-1);
      } else {
        // Add dislike
        updates.dislikedBy = arrayUnion(userId);
        updates.dislikes = increment(1);
        
        // If user had liked before, remove the like
        if (likedBy.includes(userId)) {
          updates.likedBy = arrayRemove(userId);
          updates.likes = increment(-1);
        }
      }
    }
    
    // Wait for the update to complete to ensure persistence
    await updateDoc(postRef, updates);
    
    // For UI update, we'll just return the reaction type
    // The component will handle the UI updates optimistically
    return { 
      success: true,
      postId,
      reactionType,
      action: reactionType === 'like' 
        ? (likedBy.includes(userId) ? 'removed' : 'added')
        : (dislikedBy.includes(userId) ? 'removed' : 'added')
    };
  } catch (error) {
    console.error(`Error with ${reactionType} reaction:`, error);
    throw error; // Make sure to propagate the error
  }
};

// Updated function to get paginated posts
export const getPaginatedPosts = async (lastVisible = null, postsPerPage = 10) => {
  try {
    let postsQuery;
    
    if (lastVisible) {
      postsQuery = query(
        collection(db, "posts"), 
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(postsPerPage)
      );
    } else {
      postsQuery = query(
        collection(db, "posts"), 
        orderBy("createdAt", "desc"),
        limit(postsPerPage)
      );
    }
    
    const querySnapshot = await getDocs(postsQuery);
    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
    
    const posts = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return {
      posts,
      lastDoc
    };
  } catch (error) {
    console.error("Error getting paginated posts:", error);
    throw error;
  }
};

export { auth, db };