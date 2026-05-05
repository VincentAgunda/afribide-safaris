import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import FloatingActions from "./components/FloatingActions";
import CookieBanner from "./components/CookieConsent"; // ✅ ADDED

import Home from "./pages/Home";
import About from "./pages/About";
import NextureWork from "./pages/NextureWork";
import GalleryPage from "./pages/GalleryPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAuth from "./pages/AdminAuth";

/* =========================
   PAGE ANIMATION VARIANTS
========================= */
const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }
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
    <div className="app bg-[#F5F5F7] dark:bg-[#111111] min-h-screen">
      <ScrollToTop />
      <Header />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

          {/* =========================
              PUBLIC ROUTES
          ========================= */}

          <Route
            path="/"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="page-content"
              >
                <Home />
              </motion.div>
            }
          />

          <Route
            path="/about"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="page-content"
              >
                <About />
              </motion.div>
            }
          />

          <Route
            path="/nexture-work"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="page-content"
              >
                <NextureWork />
              </motion.div>
            }
          />

          <Route
            path="/gallery"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="page-content"
              >
                <GalleryPage />
              </motion.div>
            }
          />

          {/* =========================
              AUTH ROUTES
          ========================= */}

          <Route
            path="/login"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="page-content"
              >
                <Login />
              </motion.div>
            }
          />

          <Route
            path="/register"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="page-content"
              >
                <Register />
              </motion.div>
            }
          />

          <Route
            path="/admin-auth"
            element={
              <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="page-content"
              >
                <AdminAuth />
              </motion.div>
            }
          />

          {/* =========================
              PROTECTED ADMIN ROUTE
          ========================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <motion.div
                  variants={pageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className="page-content"
                >
                  <AdminDashboard />
                </motion.div>
              </ProtectedRoute>
            }
          />

          {/* FALLBACK ROUTE */}
          <Route path="*" element={<Navigate to="/" replace />} />

        </Routes>
      </AnimatePresence>

      <Footer />

      {/* Floating Buttons */}
      <FloatingActions />

      {/* ✅ COOKIE CONSENT (GLOBAL OVERLAY) */}
      <CookieBanner />

      {/* =========================
          GLOBAL STYLES
      ========================= */}
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