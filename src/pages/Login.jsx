import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (err) {
      setError("Failed to log in. Check credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
      <div className="bg-white p-8 rounded-sm shadow-[0_4px_15px_rgba(0,0,0,0.05)] w-full max-w-md">
        <h2 className="text-3xl font-bold text-blue-600  mb-6 text-center">Admin Login</h2>
        {error && <p className="text-red-600 bg-red-50 p-3 rounded-sm mb-4 text-sm">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
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
          <button type="submit" className="w-full bg-blue-500  text-white p-3 rounded-sm font-bold hover:bg-blue-600  transition-colors">
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-blue-600  font-bold hover:text-blue-500 ">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;