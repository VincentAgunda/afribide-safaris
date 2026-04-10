import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // By default, new registrations are 'user'. Admin must manually change this in Firestore to 'admin' for the first time.
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email,
        role: "user" 
      });
      navigate("/");
    } catch (err) {
      setError("Failed to register. " + err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
      <div className="bg-white p-8 rounded-sm shadow-[0_4px_15px_rgba(0,0,0,0.05)] w-full max-w-md">
        <h2 className="text-3xl font-bold text-[#004700] mb-6 text-center">Register Account</h2>
        {error && <p className="text-red-600 bg-red-50 p-3 rounded-sm mb-4 text-sm">{error}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
            <input 
              type="email" 
              className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-[#004700]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full p-3 border border-gray-300 rounded-sm focus:outline-none focus:border-[#004700]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="w-full bg-[#004700] text-white p-3 rounded-sm font-bold hover:bg-[#003300] transition-colors">
            Register
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link to="/login" className="text-[#004700] font-bold hover:text-[#eab308]">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;