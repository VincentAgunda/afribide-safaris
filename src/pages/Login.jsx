import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import {
  FaEye,
  FaEyeSlash,
  FaSpinner,
  FaShieldAlt,
  FaArrowRight,
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  /* ===============================
     LOGIN
  =============================== */
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await signInWithEmailAndPassword(auth, email, password);

      toast.success("Login successful");

      setTimeout(() => {
        navigate("/admin");
      }, 900);
    } catch (error) {
      toast.error("Failed to log in. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     RESET PASSWORD
  =============================== */
  const handleForgotPassword = async () => {
    if (!email) {
      return toast.warning("Enter your email first.");
    }

    try {
      setResetLoading(true);

      await sendPasswordResetEmail(auth, email);

      toast.success("Password reset email sent.");
    } catch (error) {
      toast.error("Failed to send reset email.");
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center px-4">
      <ToastContainer
        position="top-center"
        autoClose={2600}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

      <div className="w-full max-w-md">
        {/* CARD */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-8 md:p-10">
          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-black text-white flex items-center justify-center shadow-md mb-5">
              <FaShieldAlt size={22} />
            </div>

            <h1 className="text-3xl font-semibold text-blue-600  tracking-tight">
              Admin Login
            </h1>

            <p className="text-sm text-gray-500 mt-2">
              Secure access to your dashboard
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-5">
            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full h-12 px-4 rounded-2xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 outline-none focus:border-black transition-all"
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full h-12 px-4 pr-12 rounded-2xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 outline-none focus:border-black transition-all"
                />

                {/* TOGGLE PASSWORD */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black transition"
                >
                  {showPassword ? (
                    <FaEyeSlash size={18} />
                  ) : (
                    <FaEye size={18} />
                  )}
                </button>
              </div>

              {/* FORGOT PASSWORD */}
              <div className="mt-3 text-right">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={resetLoading}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 transition inline-flex items-center gap-2"
                >
                  {resetLoading ? (
                    <>
                      <FaSpinner className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Forgot Password?"
                  )}
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-2xl bg-blue-600  text-white font-medium hover:opacity-90 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Signing In...
                </>
              ) : (
                <>
                  Login
                  <FaArrowRight size={13} />
                </>
              )}
            </button>
          </form>

          {/* FOOTER */}
          <p className="text-center text-sm text-gray-500 mt-7">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:opacity-70 transition"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;