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
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: EASE },
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
        className="min-h-screen bg-white text-gray-900 overflow-x-hidden"
        style={{
          fontFamily:
            "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
        }}
      >
        {/* ================= HERO ================= */}
        <section className="relative w-full min-h-[100svh] md:min-h-screen flex items-center overflow-hidden pt-16 md:pt-0">
          {/* IMAGE */}
          <motion.div
            initial={{ scale: 1.08, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.6, ease: EASE }}
            className="absolute top-0 right-0 w-full md:w-[55%] h-full z-0"
          >
            <img
              src="gallery/jeep.jpeg"
              alt="Afribide Safari"
              className="w-full h-full object-cover object-center md:object-right brightness-[0.92] contrast-[1.05]"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-black/10 to-transparent" />
          </motion.div>

          {/* GRADIENT SPLIT */}
          <div
            className="absolute inset-0 z-10 md:hidden"
            style={{
              background:
                "linear-gradient(103deg, #E5E5E5 60%, rgba(229,229,229,0) 60.2%)",
            }}
          />
          <div
            className="absolute inset-0 z-10 hidden md:block"
            style={{
              background:
                "linear-gradient(103deg, #E5E5E5 50%, rgba(229,229,229,0) 50.2%)",
            }}
          />

          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 px-6 lg:px-12 relative z-20">
            {/* TEXT */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col justify-center max-w-full"
            >
              <motion.h2
                variants={textVariants}
                className="text-lg md:text-2xl text-gray-800 mb-2 tracking-tight"
              >
                Welcome to
              </motion.h2>

              <motion.h1
                variants={textVariants}
                className="font-semibold tracking-[-0.02em] leading-[1] mb-4 whitespace-nowrap"
                style={{
                  fontSize: "clamp(2.2rem, 6vw, 5.5rem)",
                }}
              >
                Afribide Safaris
              </motion.h1>

              <motion.p
                variants={textVariants}
                className="text-base md:text-lg text-gray-500 mb-8 max-w-md"
              >
                Experience the wild like never before
              </motion.p>

              {/* CTA + SOCIAL */}
              <motion.div
                variants={textVariants}
                className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-4"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={openModal}
                  className="px-6 py-3 rounded-full bg-blue-600 text-white font-medium shadow-lg hover:bg-blue-700 transition"
                >
                  Plan Your Safari
                </motion.button>

                <div className="flex gap-3">
                  {[FaInstagram, FaFacebookF, FaWhatsapp].map((Icon, i) => (
                    <motion.div
                      key={i}
                      whileHover={{ y: -4, scale: 1.05 }}
                      className="w-11 h-11 flex items-center justify-center rounded-xl bg-white border border-black/10 shadow-sm hover:bg-blue-700 hover:text-white transition"
                    >
                      <Icon size={18} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>

            <div className="hidden md:block" />
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