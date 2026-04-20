import React, { useState, useRef, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import emailjs from "@emailjs/browser";
import { Close } from "@mui/icons-material";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";

import Comprehensive from "./Comprehensive";
import NextureWork from "./NextureWork";
import Questions from "./Questions";
import Services from "./Services";
import Contact from "./Contact";
import GalleryPage from "./GalleryPage";
// IMPORT YOUR NEW COMPONENTS HERE WHEN READY:
// import Testimonials from "./Testimonials";
// import Blogs from "./Blogs";

/* -------------------------------------------------- */
/* CONFIG & ANIMATION */
/* -------------------------------------------------- */

const EASE = [0.22, 1, 0.36, 1];
const SPRING = { type: "spring", stiffness: 280, damping: 30, mass: 0.8 };

const FONT_STYLE = {
  fontFamily: "'SF Pro Display', -apple-system, BlinkMacSystemFont, sans-serif",
  fontWeight: 400,
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
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

/* -------------------------------------------------- */
/* HOME */
/* -------------------------------------------------- */

const Home = () => {
  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState("");
  const formRef = useRef();
  const location = useLocation();

  /* Hash scroll */
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const id = location.hash.substring(1);
        const element = document.getElementById(`${id}-section`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    }
  }, [location]);

  const handleOpenModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const sendEmail = useCallback(async (e) => {
    e.preventDefault();
    setMessage("Sending...");
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setMessage("Success. We'll contact you shortly.");
      e.target.reset();
    } catch {
      setMessage("Something went wrong. Please try again.");
    }
  }, []);

  return (
    <LayoutGroup>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="min-h-screen bg-white text-gray-900 overflow-x-hidden"
        style={FONT_STYLE}
      >
        {/* HERO SECTION */}
        <section className="relative w-full min-h-[100svh] md:min-h-screen flex items-center overflow-hidden pt-16 md:pt-0">
          
          <motion.div
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: EASE }}
            className="absolute top-0 right-0 w-full md:w-[55%] h-full z-0"
          >
            <img
              src="gallery/jeep.jpeg" 
              alt="Afribide Safari Experience"
              className="w-full h-full object-cover object-center md:object-right"
              loading="eager"
            />
          </motion.div>

          {/* Background Gradient Split - Mobile (60% solid for better text fit) */}
          <div 
            className="absolute inset-0 z-10 md:hidden"
            style={{
              background: "linear-gradient(103deg, #E5E5E5 60%, transparent 60.1%)",
            }}
          />
          
          {/* Background Gradient Split - Desktop (50% solid) */}
          <div 
            className="absolute inset-0 z-10 hidden md:block"
            style={{
              background: "linear-gradient(103deg, #E5E5E5 50%, transparent 50.1%)",
            }}
          />

          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 px-6 lg:px-12 relative z-20 h-full">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              // Constrain max-width on mobile so it doesn't cross over the transparent part
              className="flex flex-col justify-center pt-10 pb-6 md:py-0 max-w-[60%] md:max-w-none pr-2 md:pr-0"
            >
              <motion.h2
                variants={textVariants}
                className="text-xl sm:text-2xl md:text-4xl font-semibold text-gray-900 mb-2 md:mb-4"
              >
                Welcome to
              </motion.h2>

              <motion.h1
                variants={textVariants}
                // Responsive font sizes to prevent word breaks overlapping the image
                className="text-4xl sm:text-5xl md:text-[80px] font-bold text-black tracking-tight leading-tight md:leading-none mb-3 md:mb-4 break-words"
              >
                Afribide Safaris
              </motion.h1>

              <motion.h3
                variants={textVariants}
                className="text-base sm:text-xl md:text-3xl font-medium text-gray-500 mb-6 md:mb-10 leading-snug"
              >
                Experience the wild like never before
              </motion.h3>

              <motion.div variants={textVariants} className="flex gap-3 md:gap-4 flex-wrap">
                {[
                  { icon: FaInstagram, link: "#" },
                  { icon: FaFacebookF, link: "#" },
                  { icon: FaWhatsapp, link: "#" },
                ].map(({ icon: Icon, link }, idx) => (
                  <a
                    key={idx}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-gray-300/60 hover:bg-black hover:text-white rounded-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </motion.div>
            </motion.div>
            <div className="hidden md:block"></div>
          </div>
        </section>

        {/* SECTIONS */}
        <div id="about-section" className="scroll-mt-24">
          <Comprehensive onOpenModal={handleOpenModal} />
        </div>

        <div id="gallery-section" className="scroll-mt-24">
          <NextureWork />
        </div>

        {/* NEW GALLERY PAGE SECTION */}
        <div id="full-gallery-section" className="scroll-mt-24">
          <GalleryPage />
        </div>
        
        {/* TESTIMONIALS SECTION - ADDED */}
        <div id="testimonials-section" className="scroll-mt-24">
          {/* <Testimonials /> */}
        </div>

        {/* BLOGS SECTION - ADDED */}
        <div id="blog-section" className="scroll-mt-24">
          {/* <Blogs /> */}
        </div>

        <div id="safariheros-section" className="scroll-mt-24">
          <Services />
        </div>
        
        {/* If Questions component has an anchor point, wrap it in a div too */}
        <Questions />

        <div id="contact-section" className="scroll-mt-24">
          <Contact />
        </div>

        {/* MODAL */}
        <AnimatePresence>
          {showModal && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xl"
                onClick={() => setShowModal(false)}
              />

              <motion.div
                layoutId="modal-container"
                transition={SPRING}
                className="fixed z-50 inset-4 sm:inset-12 bg-white rounded-[28px] shadow-2xl p-6 sm:p-10 overflow-auto"
              >
                <motion.button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
                >
                  <Close />
                </motion.button>

                <h2 className="text-2xl sm:text-3xl font-semibold mb-8">
                  Plan Your Dream Safari
                </h2>

                <form
                  ref={formRef}
                  onSubmit={sendEmail}
                  className="space-y-6 max-w-xl"
                >
                  {["name", "email", "phone"].map((field) => (
                    <input
                      key={field}
                      name={field}
                      type={field === "email" ? "email" : "text"}
                      placeholder={
                        field.charAt(0).toUpperCase() + field.slice(1)
                      }
                      className="w-full px-5 py-4 rounded-2xl border border-black/10 focus:ring-2 focus:ring-black/20 outline-none"
                      required={field !== "phone"}
                    />
                  ))}

                  <textarea
                    name="message"
                    rows="4"
                    placeholder="Tell us about your trip (Travel dates, number of travelers, preferred destinations...)"
                    className="w-full px-5 py-4 rounded-2xl border border-black/10 focus:ring-2 focus:ring-black/20 outline-none"
                    required
                  />

                  {message && (
                    <div className="text-sm text-gray-600">{message}</div>
                  )}

                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    type="submit"
                    className="w-full py-4 rounded-full bg-black text-white font-medium"
                  >
                    {message === "Sending..."
                      ? "Sending..."
                      : "Send Inquiry"}
                  </motion.button>
                </form>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
    </LayoutGroup>
  );
};

export default Home;