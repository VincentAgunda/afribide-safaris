// Contact.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import BookingModal from "../components/BookingModal";

const Contact = ({ initialPackage = "", isModalOpen = false, onClose }) => {
  const [open, setOpen] = useState(isModalOpen);
  const [isMobile, setIsMobile] = useState(false);

  const sectionRef = useRef(null);

  /* ================================
     Modal Sync (robust)
  ================================= */
  useEffect(() => {
    setOpen(isModalOpen);
  }, [isModalOpen]);

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
    if (onClose) onClose();
  }, [onClose]);

  /* ================================
     Responsive Check
  ================================= */
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaChange = (e) => setIsMobile(e.matches);
    mediaQuery.addEventListener("change", handleMediaChange);

    return () =>
      mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  /* ================================
     Scroll Animation
  ================================= */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [6, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [60, 0]);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative max-w-7xl mx-auto my-40 rounded-[40px] overflow-visible"
        style={{ perspective: 1400 }}
      >
        {/* ================================
           Background Gradient (Smooth Blend)
        ================================= */}
        <motion.div
          className="absolute inset-0 rounded-[40px]"
          style={{
            background:
              "linear-gradient(115deg, #d8d9dd 0%, #d8d9dd 35%, #d0c7bf 50%, #d89a6a 65%, #e26c22 85%, #e26c22 100%)",
            zIndex: 0,
          }}
        />

        {/* ================================
           Content Card
        ================================= */}
        <motion.div
          style={{
            ...(isMobile
              ? {}
              : {
                  scale,
                  rotateX,
                  y,
                }),
            transformStyle: "preserve-3d",
          }}
          className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 px-8 md:px-16 py-28 bg-[#d8d9dd] rounded-[40px] shadow-[0_40px_120px_rgba(0,0,0,0.12)]"
        >
          {/* Left Content */}
          <div className="relative z-20">
            <h2 className="text-5xl md:text-7xl font-semibold tracking-tight text-neutral-900 leading-[1.05] mb-8">
              Your wild adventure <br /> begins here.
            </h2>

            <p className="text-xl text-neutral-800 mb-10 max-w-md leading-relaxed font-medium">
              Choose your safari, tell us your dates, and we’ll craft your
              perfect journey.
            </p>

            <motion.button
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleOpen}
              className="relative z-30 bg-black text-white px-10 py-4 rounded-full text-lg font-medium shadow-xl hover:bg-neutral-800 transition-all duration-300"
            >
              Plan Your Safari
            </motion.button>
          </div>

          {/* Right Image */}
          <div className="relative z-10 flex justify-center lg:justify-end pointer-events-none">
            <img
              src="/calltoaction.png"
              alt="Safari Journey Concept"
              className="w-72 md:w-[450px] object-contain drop-shadow-2xl select-none"
              loading="lazy"
            />
          </div>
        </motion.div>
      </section>

      {/* ================================
         Booking Modal
      ================================= */}
      <BookingModal
        isModalOpen={open}
        onClose={handleClose}
        initialPackage={initialPackage}
      />
    </>
  );
};

export default Contact;