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

const Home = () => {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
          {/* BACKGROUND IMAGE */}
          <motion.div
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 2, ease: EASE }}
            className="absolute inset-0 z-0"
          >
            <img
              src="gallery/jeep.jpeg"
              alt="Afribide Safari"
              className="w-full h-full object-cover object-center"
            />
            {/* Premium dark overlay for high text contrast */}
            <div className="absolute inset-0 bg-black/60" />
          </motion.div>

          {/* FOREGROUND CONTENT */}
          <div className="relative z-20 px-6 w-full max-w-7xl mx-auto flex flex-col items-center text-center mt-16">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col items-center w-full"
            >
              <motion.h2
                variants={textVariants}
                className="text-sm md:text-base text-gray-300 tracking-[0.2em] uppercase mb-4"
              >
                Welcome to Afribide Safaris
              </motion.h2>

              <motion.h1
                variants={textVariants}
                className="text-white font-light tracking-wide uppercase leading-tight mb-10"
                style={{
                  fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                }}
              >
                Experience the wild<br />like never before
              </motion.h1>

              {/* CTA + SOCIAL */}
              <motion.div
                variants={textVariants}
                className="flex flex-col items-center gap-8"
              >
                <button
                  onClick={openModal}
                  className="px-10 py-4 border border-white text-white font-medium tracking-[0.15em] uppercase text-sm hover:bg-white hover:text-black transition-colors duration-300 rounded-sm"
                >
                  Plan Your Safari
                </button>

                <div className="flex gap-6 mt-8">
                  {[FaInstagram, FaFacebookF, FaWhatsapp].map((Icon, i) => (
                    <a
                      key={i}
                      href="#"
                      className="text-white hover:text-[#004700] transition-colors duration-300"
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

        {/* ================= BOOKING MODAL ================= */}
        <BookingModal isOpen={isModalOpen} onClose={closeModal} />
      </motion.div>
    </LayoutGroup>
  );
};

export default Home;