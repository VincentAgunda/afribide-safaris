import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

import About from "./pages/About";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

/* =========================
   APPLE-LIKE PAGE VARIANTS
========================= */
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
    filter: "blur(6px)"
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] // Apple cubic-bezier
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    scale: 0.985,
    filter: "blur(6px)",
    transition: {
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

/* =========================
   REUSABLE PAGE WRAPPER
========================= */
const PageWrapper = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="page-content"
  >
    {children}
  </motion.div>
);

/* =========================
   ROUTE TRANSITION INDICATOR
========================= */
const RouteTransitionIndicator = () => (
  <motion.div
    className="route-transition-indicator"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  />
);

function App() {
  const location = useLocation();

  return (
    <div className="app bg-gray-50 dark:bg-black min-h-screen flex flex-col">
      <ScrollToTop />
      <Header />

      {/* Indicator */}
      <RouteTransitionIndicator />

      {/* ROUTES */}
      <div className="flex-1">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>

            <Route
              path="/"
              element={
                <PageWrapper>
                  <Home />
                </PageWrapper>
              }
            />

            <Route
              path="/about"
              element={
                <PageWrapper>
                  <About />
                </PageWrapper>
              }
            />

            <Route
              path="/login"
              element={
                <PageWrapper>
                  <Login />
                </PageWrapper>
              }
            />

            <Route
              path="/register"
              element={
                <PageWrapper>
                  <Register />
                </PageWrapper>
              }
            />

          </Routes>
        </AnimatePresence>
      </div>

      <Footer />

      {/* =========================
          GLOBAL STYLES
      ========================= */}
      <style>
        {`
          .page-content {
            min-height: calc(100vh - 140px);
            will-change: transform, opacity, filter;
          }

          /* Smooth scrolling feel */
          html {
            scroll-behavior: smooth;
          }

          /* Apple-like floating indicator */
          @keyframes pulseSmooth {
            0% { transform: scale(0.9); opacity: 0.4; }
            50% { transform: scale(1.15); opacity: 0.9; }
            100% { transform: scale(0.9); opacity: 0.4; }
          }

          .route-transition-indicator {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: linear-gradient(135deg, #60a5fa, #3b82f6);
            animation: pulseSmooth 1.4s ease-in-out infinite;
            z-index: 9999;
            pointer-events: none;
            box-shadow: 0 0 12px rgba(59, 130, 246, 0.6);
          }
        `}
      </style>
    </div>
  );
}

export default App;