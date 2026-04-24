// SafariGalleryPage.jsx
import React, { useRef, useState, useEffect, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Map,
  Banknote,
  CheckCircle2,
  XCircle,
  Calendar,
  MapPin,
  Home,
  Utensils,
  ZoomIn,
  Camera
} from "lucide-react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import BookingModal from "../components/BookingModal";

/* ------------------ Animation Config ------------------ */
const spring = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
};

/* ------------------ Card Styles ------------------ */
const cardColors = [
  { bg: "#000000", text: "text-white", button: "light" },
  { bg: "#F5F5F7", text: "text-[#F5F5F7]", button: "light" },
  { bg: "#979797", text: "text-white", button: "light" },
  { bg: "#FAFAFA", text: "text-[#F5F5F7]", button: "light" },
];

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
   Details Modal (optimised & memoized)
=========================== */
const SafariModal = memo(({ item, onClose, onBookNow }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const scrollContainerRef = useRef(null);

  const gallery = useMemo(
    () => (item.gallery?.length ? item.gallery : defaultGalleryImages),
    [item.gallery]
  );

  // Lock body scroll when modal or lightbox is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") {
        setLightboxIndex((prev) => (prev + 1) % gallery.length);
      }
      if (e.key === "ArrowLeft") {
        setLightboxIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
      }
      if (e.key === "Escape") {
        setLightboxIndex(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, gallery.length]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el && scrollContainerRef.current) {
      // Offset for sticky header
      const topPos = el.offsetTop - 80;
      scrollContainerRef.current.scrollTo({
        top: topPos,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-6 font-sans antialiased"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
      >
        <motion.div
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-md transform-gpu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        />

        <motion.div
          layoutId={`card-${item.id}`}
          transition={spring}
          className="relative z-10 w-full max-w-5xl h-[100dvh] sm:h-full sm:max-h-[90vh] flex flex-col sm:rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)] bg-white transform-gpu will-change-transform"
        >
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/30 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center hover:bg-black/50 transition-all duration-300 transform-gpu"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X size={20} strokeWidth={2.5} />
          </motion.button>

          <div 
            ref={scrollContainerRef}
            className="overflow-y-auto w-full h-full scrollbar-hide overscroll-contain pb-12 scroll-smooth transform-gpu"
            style={{ WebkitOverflowScrolling: "touch", willChange: "scroll-position" }}
          >
            <motion.div
              layoutId={`image-${item.id}`}
              transition={spring}
              className="h-[300px] sm:h-[400px] w-full relative shrink-0 overflow-hidden transform-gpu will-change-transform bg-black"
            >
              <img
                src={item.image || defaultGalleryImages[0]}
                alt={item.title}
                className="w-full h-full object-cover transform-gpu"
                width="1200"
                height="800"
                decoding="async"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 sm:p-10 text-white w-full max-w-4xl">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="block text-sm sm:text-base font-semibold uppercase tracking-[0.2em] mb-2 sm:mb-3 text-white/90"
                >
                  {item.category}
                </motion.span>
                <motion.h3
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]"
                >
                  {item.title}
                </motion.h3>
                {item.duration && (
                  <p className="mt-4 text-white/80 text-base font-medium flex items-center gap-2">
                    <Calendar size={18} /> {item.duration}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Sticky Quick-Nav & Book Action */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 px-4 sm:px-8 py-3 flex items-center justify-between transform-gpu">
              <div className="hidden sm:flex gap-6 items-center">
                <button onClick={() => scrollToSection('overview')} className="text-sm font-semibold text-gray-500 hover:text-[#1d1d1f] transition-colors">Overview</button>
                {item.itinerary?.length > 0 && (
                  <button onClick={() => scrollToSection('itinerary')} className="text-sm font-semibold text-gray-500 hover:text-[#1d1d1f] transition-colors">Itinerary</button>
                )}
                <button onClick={() => scrollToSection('pricing')} className="text-sm font-semibold text-gray-500 hover:text-[#1d1d1f] transition-colors">Pricing</button>
                <button onClick={() => scrollToSection('gallery')} className="text-sm font-semibold text-gray-500 hover:text-[#1d1d1f] transition-colors">Gallery</button>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onBookNow(item);
                }}
                className="ml-auto px-6 py-2.5 bg-[#1d1d1f] text-white rounded-full text-sm font-medium hover:bg-black transition-colors shadow-md transform-gpu"
              >
                Book Now
              </button>
            </div>

            <div className="px-4 sm:px-8 py-10 max-w-5xl mx-auto space-y-20">
              
              {/* --- OVERVIEW --- */}
              <section id="overview" className="max-w-4xl scroll-mt-24">
                <motion.div {...fadeUp} className="will-change-transform">
                  <h4 className="text-2xl font-bold tracking-tight text-[#1d1d1f] mb-4">
                    The Experience
                  </h4>
                  <p className="text-lg sm:text-xl text-[#545454] font-medium leading-relaxed tracking-tight">
                    {item.description}
                  </p>
                  
                  {item.journeyAtAGlance && (
                    <div className="mt-8 p-6 rounded-2xl bg-gray-50 border border-gray-100 transform-gpu">
                      <h4 className="text-lg font-bold text-[#1d1d1f] mb-3 flex items-center gap-2">
                        <MapPin className="text-[#8A4413]" size={20} />
                        Journey at a Glance
                      </h4>
                      <p className="text-[#545454] leading-relaxed whitespace-pre-line">
                        {item.journeyAtAGlance}
                      </p>
                    </div>
                  )}
                </motion.div>
              </section>

              {/* --- ITINERARY --- */}
              {item.itinerary?.length > 0 && (
                <section id="itinerary" className="max-w-4xl mx-auto scroll-mt-24 pt-4 border-t border-gray-100">
                  <motion.div {...fadeUp} className="will-change-transform">
                    <h4 className="text-3xl font-bold tracking-tight text-[#1d1d1f] mb-10 flex items-center gap-3">
                      <Map className="text-[#8A4413] " size={28} />
                      Itinerary Details
                    </h4>
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gray-200">
                      {item.itinerary.map((day, idx) => (
                        <div
                          key={idx}
                          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                        >
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#1d1d1f] text-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform duration-300 hover:scale-110 transform-gpu">
                            <span className="text-xs font-bold tracking-tighter">
                              {day.day.replace("Day ", "")}
                            </span>
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.06)] transition-shadow duration-300 transform-gpu">
                            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">
                              {day.day}
                            </span>
                            <h4 className="text-lg font-bold text-[#1d1d1f] tracking-tight mb-2">
                              {day.title}
                            </h4>
                            <p className="text-[#86868b] text-sm leading-relaxed">
                              {day.desc}
                            </p>

                            <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                              {day.accommodation && (
                                <div className="flex items-start gap-2">
                                  <Home className="text-[#8A4413] mt-0.5 shrink-0" size={14} />
                                  <span className="text-sm text-[#545454]">
                                    <span className="font-medium">Accommodation:</span> {day.accommodation}
                                  </span>
                                </div>
                              )}
                              {day.mealPlan && (
                                <div className="flex items-start gap-2">
                                  <Utensils className="text-[#8A4413] mt-0.5 shrink-0" size={14} />
                                  <span className="text-sm text-[#545454]">
                                    <span className="font-medium">Meal Plan:</span> {day.mealPlan}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </section>
              )}

              {/* --- PRICING --- */}
              <section id="pricing" className="max-w-4xl scroll-mt-24 pt-4 border-t border-gray-100">
                <motion.div {...fadeUp} className="grid lg:grid-cols-12 gap-8 will-change-transform">
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <h4 className="text-3xl font-bold tracking-tight text-[#1d1d1f] mb-6 flex items-center gap-3">
                        <Banknote className="text-[#8A4413]" size={28} />
                        Package Pricing
                      </h4>
                      <div className="space-y-3">
                        {item.pricing?.map((price, idx) => (
                          <div
                            key={idx}
                            className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors duration-300 transform-gpu"
                          >
                            <h5 className="text-base font-bold text-[#1d1d1f] tracking-tight mb-1">
                              {price.title}
                            </h5>
                            <p className="text-[#86868b] text-sm leading-relaxed">
                              {price.details}
                            </p>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-4 font-medium">
                        * Rates are based on persons traveling in a private 4x4 safari vehicle.
                      </p>
                    </div>
                  </div>
                  
                  <div className="lg:col-span-5 space-y-6 lg:mt-14">
                    <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] transform-gpu">
                      <h4 className="text-lg font-bold tracking-tight text-[#1d1d1f] mb-4 flex items-center gap-2">
                        <CheckCircle2 className="text-[#8A4413] " size={18} /> Included
                      </h4>
                      <ul className="space-y-2">
                        {item.included?.map((inc, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-[#545454]"
                          >
                            <span className="text-[#8A4413] font-bold mt-0.5">•</span> {inc}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 transform-gpu">
                      <h4 className="text-lg font-bold tracking-tight text-[#1d1d1f] mb-4 flex items-center gap-2">
                        <XCircle className="text-gray-400" size={18} /> Not Included
                      </h4>
                      <ul className="space-y-2">
                        {item.excluded?.map((exc, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-[#86868b]"
                          >
                            <span className="text-gray-400 mt-0.5">✕</span> {exc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </section>

              {/* --- GALLERY HIGHLIGHTS (Moved to the bottom) --- */}
              <section id="gallery" className="max-w-4xl mx-auto scroll-mt-24 pt-4 border-t border-gray-100 pb-10">
                <motion.div {...fadeUp} className="will-change-transform">
                  <h4 className="text-3xl font-bold tracking-tight text-[#1d1d1f] mb-8 flex items-center gap-3">
                    <Camera className="text-[#8A4413] " size={28} />
                    Gallery Highlights
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {gallery.map((imgUrl, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02, y: -2 }}
                        transition={spring}
                        onClick={() => setLightboxIndex(idx)}
                        className="group relative aspect-[3/2] rounded-xl overflow-hidden bg-gray-100 shadow-sm ring-1 ring-black/5 will-change-transform transform-gpu cursor-pointer"
                      >
                        <img
                          src={imgUrl}
                          alt={`${item.title} gallery ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105 transform-gpu"
                          loading="lazy"
                          decoding="async"
                          width="600"
                          height="400"
                        />
                        <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white z-10 pointer-events-none transform-gpu">
                          <ZoomIn size={36} strokeWidth={1.5} className="mb-2" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </section>

            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Lightbox / Fullscreen Gallery */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setLightboxIndex(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl transform-gpu"
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[110] bg-white/10 hover:bg-white/20 p-2 rounded-full transform-gpu"
            >
              <X size={28} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
              }}
              className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-all hover:scale-110 z-[110] bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md transform-gpu"
            >
              <ChevronLeft size={32} />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex((prev) => (prev + 1) % gallery.length);
              }}
              className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-all hover:scale-110 z-[110] bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md transform-gpu"
            >
              <ChevronRight size={32} />
            </button>

            <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 md:p-24 overflow-hidden outline-none transform-gpu">
              <AnimatePresence mode="wait">
                <motion.img
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.95, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  src={gallery[lightboxIndex]}
                  alt={`Gallery full view ${lightboxIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transform-gpu"
                  onClick={(e) => e.stopPropagation()} 
                  draggable={false}
                />
              </AnimatePresence>
            </div>

            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 font-medium tracking-widest text-sm bg-white/10 px-4 py-2 rounded-full backdrop-blur-md transform-gpu">
              {lightboxIndex + 1} / {gallery.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});
SafariModal.displayName = "SafariModal";

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
      <section className="py-16 sm:py-24 bg-[#F5F5F7] min-h-screen flex items-center justify-center transform-gpu">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-xl text-[#86868b] font-medium tracking-tight"
        >
          Loading safaris...
        </motion.div>
      </section>
    );
  }

  return (
    <section className="py-16 sm:py-24 bg-[#F5F5F7] min-h-screen font-sans antialiased overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] tracking-tight mb-4 transform-gpu will-change-transform"
          >
            Explore Afribide Safaris.
          </motion.h2>
        </div>

        <div className="relative">
          <div
            ref={carouselRef}
            className="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-4 sm:gap-6 pb-12 px-4 sm:px-6 -mx-4 sm:-mx-6 scroll-smooth transform-gpu"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
              overscrollBehaviorX: "contain",
              willChange: "scroll-position"
            }}
          >
            {safaris.map((item, i) => {
              const style = cardColors[i % cardColors.length];
              const enrichedItem = { ...item, ...style };
              return (
                <motion.div
                  key={item.id}
                  data-index={i}
                  ref={(el) => (cardRefs.current[i] = el)}
                  layoutId={`card-${item.id}`}
                  whileHover={{ scale: 0.98 }}
                  transition={spring}
                  onClick={() => setSelectedItem(enrichedItem)}
                  className="snap-center shrink-0 relative rounded-2xl w-[85vw] sm:w-[350px] lg:w-[400px] h-[420px] sm:h-[500px] group cursor-pointer overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-shadow duration-500 will-change-transform transform-gpu"
                  style={{ backgroundColor: style.bg }}
                >
                  <div
                    className={`absolute inset-0 p-6 sm:p-8 z-20 flex flex-col justify-between ${style.text} bg-gradient-to-b from-black/50 via-black/0 to-black/50 transform-gpu`}
                  >
                    <div className="max-w-[95%] pt-4">
                      <span className="block text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-2 sm:mb-3 opacity-90">
                        {item.category}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-medium tracking-tight leading-[1.2] line-clamp-2">
                        {item.title}
                      </h3>
                      {item.duration && (
                        <p className="mt-2 text-xs opacity-80 flex items-center gap-1">
                          <Calendar size={12} /> {item.duration}
                        </p>
                      )}
                    </div>
                    <div className="flex items-end justify-between pb-4">
                      <span className="opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out transform-gpu">
                        <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-5 py-3 rounded-full">
                          View Details <ChevronRight size={16} />
                        </span>
                      </span>
                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          openBooking(item);
                        }}
                        className="bg-white text-black text-sm font-semibold px-5 py-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors transform-gpu"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Book Now
                      </motion.button>
                    </div>
                  </div>
                  <motion.div
                    layoutId={`image-${item.id}`}
                    className="absolute inset-0 z-10 pointer-events-none will-change-transform transform-gpu"
                    transition={spring}
                  >
                    <img
                      src={item.image || defaultGalleryImages[0]}
                      alt={item.title}
                      className="w-full h-full object-cover transform-gpu group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                      loading="eager"
                      decoding="async"
                      width="800"
                      height="1000"
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>

          {safaris.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-2 px-4 sm:px-6">
              <div className="flex gap-3 order-2 sm:order-1">
                <button
                  onClick={handlePrev}
                  className="w-12 h-12 rounded-full bg-white border border-gray-200 text-[#1d1d1f] flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shadow-sm disabled:opacity-40 transform-gpu"
                  disabled={active === 0}
                >
                  <ChevronLeft size={20} strokeWidth={2} />
                </button>
                <button
                  onClick={handleNext}
                  className="w-12 h-12 rounded-full bg-white border border-gray-200 text-[#1d1d1f] flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shadow-sm disabled:opacity-40 transform-gpu"
                  disabled={active === safaris.length - 1}
                >
                  <ChevronRight size={20} strokeWidth={2} />
                </button>
              </div>
              <div className="flex space-x-2 order-1 sm:order-2 bg-gray-200/50 p-1.5 rounded-full backdrop-blur-sm transform-gpu">
                {safaris.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-500 ease-out transform-gpu ${
                      idx === active
                        ? "w-6 bg-[#1d1d1f]"
                        : "w-2 bg-gray-400 hover:bg-gray-600"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

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