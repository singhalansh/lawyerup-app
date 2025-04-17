import { createContext, useContext } from "react";
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { useState, useEffect } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_MSG_SEND_ID,
  appId: import.meta.env.VITE_APP_ID,
};

// Initialize Firebase services with error handling
let firebaseApp;
let db;
try {
  firebaseApp = initializeApp(firebaseConfig);
  db = getFirestore(firebaseApp);
  // Enable offline persistence
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === "failed-precondition") {
      console.warn(
        "Multiple tabs open, persistence can only be enabled in one tab at a time."
      );
    } else if (err.code === "unimplemented") {
      console.warn("The current browser does not support persistence.");
    }
  });
} catch (error) {
  console.error("Error initializing Firebase:", error);
  // You might want to show a user-friendly error message here
}

export const firebaseAuth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();
export { db };

const FirebaseContext = createContext(null);
export const useFirebase = () => useContext(FirebaseContext);

export const FirebaseProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      (user) => {
        console.log("📌 Firebase Auth state changed:", user);
        setCurrentUser(user);
        setLoading(false);
        setError(null);
      },
      (error) => {
        console.error("Auth state change error:", error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const saveToken = async (user) => {
    try {
      const token = await user.getIdToken();
      localStorage.setItem("authToken", token);
    } catch (error) {
      console.error("Error saving token:", error);
      setError("Failed to save authentication token");
    }
  };

  const signinEmail = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      saveToken(userCredential.user);
      return userCredential;
    } catch (error) {
      console.error("Sign-in error:", error);
      throw error;
    }
  };

  const signupEmail = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      saveToken(userCredential.user);
      return userCredential;
    } catch (error) {
      console.error("Sign-up error:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const userCredential = await signInWithPopup(
        firebaseAuth,
        googleProvider
      );
      saveToken(userCredential.user);
      return userCredential;
    } catch (error) {
      console.error("Google sign-in error:", error);
      throw error;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(firebaseAuth);
      localStorage.removeItem("authToken");
      setCurrentUser(null);
    } catch (error) {
      console.error("Error during sign out:", error);
    }
  };

  // Helper function to get default avatar URL
  const getDefaultAvatarUrl = (userId) => {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${userId}`;
  };

  return (
    <FirebaseContext.Provider
      value={{
        signupEmail,
        signInWithGoogle,
        signinEmail,
        currentUser,
        signOutUser,
        loading,
        getDefaultAvatarUrl,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};
