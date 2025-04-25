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
      dislikedBy: [],
      comments: []
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

// Like a post
export const likePost = async (postId, userId) => {
  try {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);
    
    if (postSnap.exists()) {
      const postData = postSnap.data();
      
      // Check if user already liked this post
      const likedBy = postData.likedBy || [];
      const dislikedBy = postData.dislikedBy || [];
      
      if (likedBy.includes(userId)) {
        // User already liked, so remove the like
        await updateDoc(postRef, {
          likedBy: arrayRemove(userId),
          likes: increment(-1)
        });
        return { action: 'removed' };
      } else {
        // Add like and remove dislike if exists
        const updates = {
          likedBy: arrayUnion(userId),
          likes: increment(1)
        };
        
        // If user had disliked before, remove the dislike
        if (dislikedBy.includes(userId)) {
          await updateDoc(postRef, {
            dislikedBy: arrayRemove(userId),
            dislikes: increment(-1)
          });
        }
        
        await updateDoc(postRef, updates);
        return { action: 'added' };
      }
    }
  } catch (error) {
    console.error("Error liking post:", error);
    throw error;
  }
};

// Dislike a post
export const dislikePost = async (postId, userId) => {
  try {
    const postRef = doc(db, "posts", postId);
    const postSnap = await getDoc(postRef);
    
    if (postSnap.exists()) {
      const postData = postSnap.data();
      
      // Check if user already disliked this post
      const likedBy = postData.likedBy || [];
      const dislikedBy = postData.dislikedBy || [];
      
      if (dislikedBy.includes(userId)) {
        // User already disliked, so remove the dislike
        await updateDoc(postRef, {
          dislikedBy: arrayRemove(userId),
          dislikes: increment(-1)
        });
        return { action: 'removed' };
      } else {
        // Add dislike and remove like if exists
        const updates = {
          dislikedBy: arrayUnion(userId),
          dislikes: increment(1)
        };
        
        // If user had liked before, remove the like
        if (likedBy.includes(userId)) {
          await updateDoc(postRef, {
            likedBy: arrayRemove(userId),
            likes: increment(-1)
          });
        }
        
        await updateDoc(postRef, updates);
        return { action: 'added' };
      }
    }
  } catch (error) {
    console.error("Error disliking post:", error);
    throw error;
  }
};

// Add a comment to a post
export const addComment = async (postId, user, content) => {
  try {
    const postRef = doc(db, "posts", postId);
    
    const commentData = {
      userId: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL,
      content: content,
      createdAt: serverTimestamp()
    };
    
    await updateDoc(postRef, {
      comments: arrayUnion(commentData)
    });
    
    return commentData;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
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