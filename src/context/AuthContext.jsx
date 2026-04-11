import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (!user) {
        setUserRole(null);
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userDocRef);

        // 🔥 If user doc DOES NOT exist → create it
        if (!userDoc.exists()) {
          await setDoc(userDocRef, {
            email: user.email,
            role: "user",
            createdAt: new Date()
          });

          setUserRole("user");
        } else {
          setUserRole(userDoc.data().role || "user");
        }

      } catch (error) {
        console.error("Error fetching/creating user:", error);
        setUserRole("user"); // fallback
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = { currentUser, userRole };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};