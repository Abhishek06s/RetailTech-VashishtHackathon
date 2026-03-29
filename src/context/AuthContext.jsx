import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // "customer" or "vendor"
  const [loading, setLoading] = useState(true);

  // Signup functionality
  async function signup(email, password, role, userData = {}) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save expanded user info to Firestore
    await setDoc(doc(db, "users", user.uid), {
      email,
      role, // Either 'customer' or 'vendor'
      fullName: userData.fullName || "",
      phoneNumber: userData.phoneNumber || "",
      businessName: role === "vendor" ? (userData.businessName || "") : null,
      createdAt: new Date().toISOString()
    });

    return user;
  }

  // Login functionality
  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  // Logout functionality
  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          // Fetch the user's role from Firestore
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserRole(docSnap.data().role);
          } else {
            setUserRole("customer"); // Default fallback
          }
        } catch (error) {
           console.error("Error fetching user role", error);
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
