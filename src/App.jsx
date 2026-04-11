// App.jsx
import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom"; // ← Added Navigate
import { motion, AnimatePresence } from "framer-motion";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import About from "./pages/About";
import SafariGalleryPage from "./pages/NextureWork"; // your gallery component
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAuth from "./pages/AdminAuth"; // optional unified auth page

/* =========================
   PAGE ANIMATION VARIANTS
========================= */
const pageVariants = {
  initial: { opacity: 0, x: -30 },
  animate: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: "easeInOut" }
  },
  exit: {
    opacity: 0,
    x: 30,
    transition: { duration: 0.25, ease: "easeInOut" }
  }
};

/* =========================
   ROUTE TRANSITION INDICATOR
========================= */
const RouteTransitionIndicator = () => (
  <div className="route-transition-indicator" />
);

function AppContent() {
  const location = useLocation();

  return (
    <div className="app bg-gray-50 dark:bg-black min-h-screen">
      <ScrollToTop />
      <Header />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="page-content">
                <Home />
              </motion.div>
            }
          />
          <Route
            path="/about"
            element={
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="page-content">
                <About />
              </motion.div>
            }
          />
          <Route
            path="/gallery"
            element={
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="page-content">
                <SafariGalleryPage />
              </motion.div>
            }
          />

          {/* Auth Routes */}
          <Route
            path="/login"
            element={
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="page-content">
                <Login />
              </motion.div>
            }
          />
          <Route
            path="/register"
            element={
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="page-content">
                <Register />
              </motion.div>
            }
          />
          {/* Optional unified admin auth page */}
          <Route
            path="/admin-auth"
            element={
              <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="page-content">
                <AdminAuth />
              </motion.div>
            }
          />

          {/* Protected Admin Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit" className="page-content">
                  <AdminDashboard />
                </motion.div>
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>

      <Footer />

      <style>
        {`
          @keyframes fadePulse {
            0%, 100% { opacity: 0.4; transform: scale(0.9); }
            50% { opacity: 0.8; transform: scale(1.1); }
          }
          .route-transition-indicator {
            position: fixed;
            bottom: 24px;
            right: 24px;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #3b82f6;
            animation: fadePulse 1.2s ease-in-out infinite;
            z-index: 1000;
            pointer-events: none;
          }
          .page-content {
            min-height: calc(100vh - 140px);
          }
        `}
      </style>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;