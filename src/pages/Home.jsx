import React, { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, LayoutGroup } from "framer-motion";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";

import Comprehensive from "./Comprehensive";
import NextureWork from "./NextureWork";
import Questions from "./Questions";
import Services from "./Services";
import Contact from "./Contact";
import GalleryPage from "./GalleryPage";
import BookingModal from "../components/BookingModal";

/* CONFIG */
const EASE = [0.22, 1, 0.36, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 1, ease: EASE },
  },
};

/* HERO SLIDER IMAGES */
const desktopImages = [
  "/Hero/leopard1.png",
  "/Hero/cheetah.png",
  "/Hero/cheetah.png",
  "/Hero/antelope.png",
];

const mobileImages = [
   "/Hero/leopard1.png",
  "/Hero/cheetah.png",
  "/Hero/parachute.jpeg",
  "/Hero/antelope.png",
];

// Determine max length to ensure we don't miss images if arrays differ
const TOTAL_SLIDES = Math.max(desktopImages.length, mobileImages.length);

const Home = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  /* HASH SCROLL */
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.substring(1);
        const el = document.getElementById(`${id}-section`);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location]);

  /* HERO IMAGE SLIDER INTERVAL */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % TOTAL_SLIDES);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <LayoutGroup>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="min-h-screen bg-[#F5F5F7] text-gray-900 overflow-x-hidden"
        style={{
          fontFamily:
            "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {/* ================= HERO ================= */}
        <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-black">
          
          {/* ================= BACKGROUND SLIDER ================= */}
          <div className="absolute inset-0 z-0 w-full h-full pointer-events-none">
            {/* By mapping the arrays and keeping them mounted, the browser pre-loads 
              the images. We transition opacity and scale for ultimate GPU smoothness.
            */}
            {Array.from({ length: TOTAL_SLIDES }).map((_, index) => {
              const isActive = currentSlide === index;
              
              // Safe fallbacks in case desktop/mobile arrays have different lengths
              const desktopSrc = desktopImages[index] || desktopImages[0];
              const mobileSrc = mobileImages[index] || mobileImages[0];

              return (
                <motion.div
                  key={index}
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    scale: isActive ? 1.05 : 1, // Smooth, slow zoom in
                  }}
                  transition={{
                    opacity: { duration: 1.5, ease: "easeInOut" },
                    scale: { duration: 6, ease: "linear" }, // Matches the 6s interval
                  }}
                  className="absolute inset-0 w-full h-full"
                  style={{
                    zIndex: isActive ? 10 : 0,
                    willChange: "opacity, transform", // Forces GPU acceleration
                  }}
                >
                  {/* Desktop Background */}
                  <img
                    src={desktopSrc}
                    alt={`Afribide Safari ${index + 1}`}
                    className="w-full h-full object-cover object-center hidden md:block"
                    // Eager load the first image, lazy load the rest
                    loading={index === 0 ? "eager" : "lazy"} 
                  />
                  
                  {/* Mobile Background */}
                  <img
                    src={mobileSrc}
                    alt={`Afribide Safari Mobile ${index + 1}`}
                    className="w-full h-full object-cover object-center block md:hidden"
                    loading={index === 0 ? "eager" : "lazy"}
                  />
                  
                  {/* Dark Overlay for Text Readability */}
                  <div className="absolute inset-0 bg-black/40" />
                </motion.div>
              );
            })}
          </div>

          {/* ================= FOREGROUND ================= */}
          <div className="relative z-20 px-6 w-full max-w-7xl mx-auto flex flex-col items-center text-center mt-16">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col items-center w-full"
            >
              <motion.h2
                variants={textVariants}
                className="text-sm md:text-base text-[#E5C07B] tracking-[0.2em] uppercase mb-4 drop-shadow-md"
              >
                Welcome to Afribide Safaris
              </motion.h2>

              <motion.h1
                variants={textVariants}
                className="text-white font-light tracking-wide uppercase leading-tight mb-10 drop-shadow-lg"
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                }}
              >
                Experience the wild
                <br />
                like never before
              </motion.h1>

              {/* CTA + SOCIAL */}
              <motion.div
                variants={textVariants}
                className="flex flex-col items-center gap-8"
              >
                <button
                  onClick={openModal}
                  className="px-10 py-4 bg-transparent backdrop-blur-sm border border-white/80 text-white font-medium tracking-[0.15em] uppercase text-sm hover:bg-white hover:text-black transition-all duration-300 rounded-sm shadow-[0_0_15px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                >
                  Plan Your Safari
                </button>

                <div className="flex gap-6 mt-8">
                  {[FaInstagram, FaFacebookF, FaWhatsapp].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="text-white hover:text-[#004700] transition-colors duration-300 drop-shadow-md"
                    >
                      <Icon size={20} />
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ================= SECTIONS ================= */}
        <div id="about-section">
          <Comprehensive />
        </div>
        <div id="gallery-section">
          <NextureWork />
        </div>
        <div id="full-gallery-section">
          <GalleryPage />
        </div>
        <div id="safariheros-section">
          <Services />
        </div>
        <Questions />
        <div id="contact-section">
          <Contact />
        </div>

        {/* ================= MODAL ================= */}
        <BookingModal isOpen={isModalOpen} onClose={closeModal} />
      </motion.div>
    </LayoutGroup>
  );
};

export default Home;