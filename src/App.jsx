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
   PAGE ANIMATION VARIANTS
========================= */
const pageVariants = {
  initial: {
    opacity: 0,
    x: -30
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  exit: {
    opacity: 0,
    x: 30,
    transition: {
      duration: 0.25,
      ease: "easeInOut"
    }
  }
};

/* =========================
   ROUTE TRANSITION INDICATOR
========================= */
const RouteTransitionIndicator = () => (
  <div className="route-transition-indicator" />
);

function App() {
  const location = useLocation();

  return (
    <div className="app bg-gray-50 dark:bg-black min-h-screen">
      <ScrollToTop />
      <Header />

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>

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

export default App;