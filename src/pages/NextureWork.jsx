// pages/SafariGalleryPage.jsx
import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { db } from "../firebase"; // Update the path as necessary based on your structure
import { collection, onSnapshot } from "firebase/firestore";
import BookingModal from "../components/BookingModal";
import SafariModal from "../components/SafariModal"; // Ensure correct import path

/* ------------------ Animation Config ------------------ */
const spring = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

/* ------------------ Hardcoded Gallery Fallback ------------------ */
const defaultGalleryImages = [
  "/Animals/2ducks.jpeg",
  "/zebra.jpeg",
  "/Animals/2ducks1.jpeg",
  "lion1.jpeg",
  "zebra-outside.jpeg",
  "/Animals/bird1.jpeg",
  "elephant1.jpeg",
  "/Animals/bird2.jpeg",
  "/Animals/bird3.jpeg",
  "/Animals/4zebras.jpeg" 
];

/* ===========================
   Main Gallery Component
=========================== */
const SafariGalleryPage = () => {
  const carouselRef = useRef(null);
  const [active, setActive] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [bookingItem, setBookingItem] = useState(null);
  const cardRefs = useRef([]);
  const [safaris, setSafaris] = useState([]);
  const [loading, setLoading] = useState(true);

  // Firestore subscription
  useEffect(() => {
    const q = collection(db, "safaris");
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const packages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          gallery: doc.data().gallery?.length ? doc.data().gallery : defaultGalleryImages,
        }));
        setSafaris(packages);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching safaris:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const scrollToIndex = useCallback((index) => {
    const container = carouselRef.current;
    const card = cardRefs.current[index];
    if (!container || !card) return;
    
    // Adjusted offset to match the new container paddings
    container.scrollTo({
      left: card.offsetLeft - 24,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const container = carouselRef.current;
    if (!container || safaris.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute("data-index"), 10);
            if (!isNaN(index)) {
              setActive(index);
            }
          }
        });
      },
      {
        root: container,
        threshold: 0.6,
      }
    );

    const currentCards = cardRefs.current;
    currentCards.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      currentCards.forEach((card) => {
        if (card) observer.unobserve(card);
      });
      observer.disconnect();
    };
  }, [safaris]);

  const handlePrev = useCallback(() => scrollToIndex(Math.max(0, active - 1)), [active, scrollToIndex]);
  const handleNext = useCallback(() => scrollToIndex(Math.min(safaris.length - 1, active + 1)), [active, safaris.length, scrollToIndex]);

  const openBooking = useCallback((item) => {
    setBookingItem(item);
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-white min-h-screen flex items-center justify-center transform-gpu">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-xl text-gray-400 font-light tracking-wide uppercase"
        >
          Loading safaris...
        </motion.div>
      </section>
    );
  }

  return (
    <section className="w-full min-h-screen py-24 bg-[#F5F5F7] font-sans antialiased overflow-hidden">
      
      {/* ================= HEADER SECTION ================= */}
      <div className="max-w-7xl mx-auto mb-12 px-6 lg:px-12 flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm tracking-widest uppercase font-semibold text-[#8A4413] mb-3"
          >
            Gallery & Adventures
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 tracking-wide"
          >
            Explore Afribide Safaris
          </motion.h3>
        </div>
      </div>

      {/* ================= CAROUSEL CONTAINER ================= */}
      <div className="max-w-7xl mx-auto md:px-12">
        <div className="relative">
          <div
            ref={carouselRef}
            className="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-6 pb-4 px-6 md:px-0 scroll-smooth transform-gpu"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
              overscrollBehaviorX: "contain",
              willChange: "scroll-position"
            }}
          >
            {safaris.map((item, i) => (
              <motion.div
                key={item.id}
                data-index={i}
                ref={(el) => (cardRefs.current[i] = el)}
                layoutId={`card-${item.id}`}
                whileHover={{ scale: 0.98 }}
                transition={spring}
                onClick={() => setSelectedItem(item)}
                className="snap-center shrink-0 relative rounded-sm w-[85vw] sm:w-[350px] lg:w-[400px] h-[480px] group cursor-pointer overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-500 will-change-transform transform-gpu bg-[#111111]"
              >
                {/* Overlay Background */}
                <div
                  className="absolute inset-0 p-8 z-20 flex flex-col justify-between text-white bg-gradient-to-b from-black/60 via-black/10 to-black/80 transform-gpu"
                >
                  <div className="max-w-[95%] pt-2">
                    <span className="block text-xs font-semibold uppercase tracking-[0.2em] mb-3 text-white opacity-90 drop-shadow-md">
                      {item.category || "Adventure"}
                    </span>
                    <h3 className="text-2xl sm:text-3xl font-light tracking-wide leading-snug line-clamp-2 drop-shadow-lg">
                      {item.title}
                    </h3>
                    {item.duration && (
                      <p className="mt-3 text-sm font-light tracking-wide opacity-80 flex items-center gap-2 drop-shadow-md">
                        <Calendar size={14} /> {item.duration}
                      </p>
                    )}
                  </div>

                  {/* Buttons Section matches Comprehensive Theme */}
                  <div className="flex items-end justify-between pb-2 relative z-30">
                    <span className="opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out transform-gpu">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          openBooking(item);
                        }}
                        className="bg-[#8A4413] border border-[#8A4413] hover:bg-[#733810] text-white px-6 py-2.5 rounded-sm text-xs tracking-widest uppercase transition-colors duration-300 shadow-lg"
                      >
                        Book Now
                      </button>
                    </span>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedItem(item);
                      }}
                      className="bg-transparent border border-white text-white hover:bg-white hover:text-black px-6 py-2.5 rounded-sm text-xs tracking-widest uppercase transition-colors duration-300 backdrop-blur-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>

                {/* Image Background */}
                <motion.div
                  layoutId={`image-${item.id}`}
                  className="absolute inset-0 z-10 pointer-events-none will-change-transform transform-gpu"
                  transition={spring}
                >
                  <img
                    src={item.image || defaultGalleryImages[0]}
                    alt={item.title}
                    className="w-full h-full object-cover transform-gpu group-hover:scale-105 transition-transform duration-[1.5s] ease-out opacity-80 group-hover:opacity-100"
                    loading="lazy"
                    decoding="async"
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ================= BOTTOM CONTROLS & PAGINATION ================= */}
        {safaris.length > 0 && (
          <div className="flex justify-between items-center mt-6 px-6 md:px-0">
            {/* Pagination Dashes */}
            <div className="flex items-center gap-2 sm:gap-3">
              {safaris.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToIndex(idx)}
                  className={`h-1 transition-all duration-300 rounded-sm ${
                    idx === active
                      ? "w-6 sm:w-8 bg-[#8A4413]"
                      : "w-3 sm:w-4 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Navigation Arrows */}
            <div className="flex gap-2">
              <button
                onClick={handlePrev}
                disabled={active === 0}
                className="w-10 h-10 border border-gray-300 rounded-sm flex items-center justify-center text-gray-500 hover:text-[#8A4413] hover:border-[#8A4413] disabled:opacity-30 disabled:hover:border-gray-300 disabled:hover:text-gray-500 transition-colors"
              >
                <ChevronLeft size={20} strokeWidth={1.5} />
              </button>
              <button
                onClick={handleNext}
                disabled={active === safaris.length - 1}
                className="w-10 h-10 border border-gray-300 rounded-sm flex items-center justify-center text-gray-500 hover:text-[#8A4413] hover:border-[#8A4413] disabled:opacity-30 disabled:hover:border-gray-300 disabled:hover:text-gray-500 transition-colors"
              >
                <ChevronRight size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= MODALS ================= */}
      <AnimatePresence>
        {selectedItem && (
          <SafariModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onBookNow={openBooking}
          />
        )}
      </AnimatePresence>

      <BookingModal
        isOpen={!!bookingItem}
        onClose={() => setBookingItem(null)}
        service={
          bookingItem
            ? {
                title: bookingItem.title,
                description: bookingItem.description,
              }
            : undefined
        }
      />
    </section>
  );
};

export default SafariGalleryPage;