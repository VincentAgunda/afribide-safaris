// pages/AdminAuth.jsx
import React, { useState } from "react";
import { auth, db } from "../firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AdminAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        // Login Flow
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        // Check Role
        const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
        if (userDoc.exists() && userDoc.data().role === "admin") {
          navigate("/admin");
        } else {
          auth.signOut();
          setError("Access Denied. You do not have admin privileges.");
        }
      } else {
        // Registration Flow
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Create user document with 'admin' role 
        // (In production, restrict who can do this)
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: userCredential.user.email,
          role: "admin" // Automatically assigning admin for demonstration
        });
        navigate("/admin");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-[#002D62]">
          {isLogin ? "Admin Login" : "Admin Registration"}
        </h2>
        
        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-[#002D62]"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-1 p-3 border rounded-xl outline-none focus:ring-2 focus:ring-[#002D62]"
              required 
            />
          </div>
          <button type="submit" className="w-full bg-[#002D62] text-white p-3 rounded-xl font-semibold hover:bg-blue-900 transition">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-gray-500 hover:text-[#002D62] transition"
          >
            {isLogin ? "Need an admin account? Register" : "Already an admin? Login"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;