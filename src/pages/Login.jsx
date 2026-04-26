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
import { motion } from "framer-motion";
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
    <div className="min-h-screen bg-[#F5F5F7] flex items-center justify-center px-4 py-20 overflow-hidden relative">
      {/* Background Accent */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#8A4413]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-black/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      </div>

      <ToastContainer
        position="top-center"
        autoClose={2600}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white rounded-sm border border-gray-200 shadow-[0_25px_70px_rgba(0,0,0,0.08)] overflow-hidden">
          {/* Accent Top Border */}
          <div className="h-1 bg-[#8A4413] w-full"></div>

          <div className="p-8 md:p-10">
            {/* HEADER */}
            <div className="text-center mb-10">
              <div className="w-16 h-16 mx-auto rounded-sm bg-[#111111] text-white flex items-center justify-center mb-6 shadow-md">
                <FaShieldAlt size={22} />
              </div>

              <p className="text-xs tracking-[0.25em] uppercase text-[#8A4413] font-semibold mb-3">
                Secure Access
              </p>

              <h1 className="text-3xl md:text-4xl font-semibold tracking-wide text-gray-900">
                Admin Login
              </h1>

              
            </div>

            {/* FORM */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* EMAIL */}
              <div>
                <label className="block text-xs uppercase tracking-[0.18em] text-gray-500 mb-3">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full h-14 px-5 bg-[#F5F5F7] border border-gray-200 rounded-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-[#8A4413] focus:bg-white"
                />
              </div>

              {/* PASSWORD */}
              <div>
                <label className="block text-xs uppercase tracking-[0.18em] text-gray-500 mb-3">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full h-14 px-5 pr-14 bg-[#F5F5F7] border border-gray-200 rounded-sm text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-[#8A4413] focus:bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#8A4413] transition-colors"
                  >
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>

                {/* FORGOT PASSWORD */}
                <div className="mt-4 text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    disabled={resetLoading}
                    className="text-sm tracking-wide text-[#8A4413] hover:opacity-80 transition inline-flex items-center gap-2"
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
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-sm bg-[#8A4413] hover:bg-[#733810] text-white uppercase tracking-[0.18em] text-sm transition-all duration-300 disabled:opacity-70 flex items-center justify-center gap-3"
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
              </motion.button>
            </form>

            {/* DIVIDER */}
            <div className="flex items-center my-8">
              <div className="flex-1 h-px bg-gray-200"></div>
              
              <div className="flex-1 h-px bg-gray-200"></div>
            </div>

            {/* FOOTER */}
            <p className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link
                to="/register"
                className="font-medium text-[#8A4413] hover:opacity-70 transition"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;