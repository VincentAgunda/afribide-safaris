// components/SafariModal.jsx 
import React, { useRef, useState, useEffect, useMemo, memo } from "react";
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
  Camera,
  Loader2
} from "lucide-react";

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

/* ------------------ Optimized Image Component ------------------ */
const GalleryImage = memo(({ src, alt, onClick }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      transition={spring}
      onClick={onClick}
      className="group relative aspect-[3/2] rounded-xl overflow-hidden bg-gray-100 shadow-sm ring-1 ring-black/5 will-change-transform transform-gpu cursor-pointer"
    >
      {/* Subtle Skeleton Loader */}
      <div 
        className={`absolute inset-0 bg-gray-200/60 animate-pulse transition-opacity duration-500 ${loaded ? 'opacity-0' : 'opacity-100'}`} 
      />
      
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-all duration-[0.8s] ease-out transform-gpu group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        loading="lazy"
        decoding="async"
        width="600"
        height="400"
      />
      
      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col items-center justify-center text-white z-10 pointer-events-none transform-gpu">
        <ZoomIn size={36} strokeWidth={1.5} className="mb-2" />
      </div>
    </motion.div>
  );
});

GalleryImage.displayName = "GalleryImage";

/* ===========================
   Main Modal Component
=========================== */
const SafariModal = memo(({ item, onClose, onBookNow }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [heroLoaded, setHeroLoaded] = useState(false);
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

  // Keyboard navigation & Image Preloading for Lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;
    
    // Preload next and previous images to ensure instant transitions
    const nextIdx = (lightboxIndex + 1) % gallery.length;
    const prevIdx = (lightboxIndex - 1 + gallery.length) % gallery.length;
    const imgNext = new Image(); imgNext.src = gallery[nextIdx];
    const imgPrev = new Image(); imgPrev.src = gallery[prevIdx];

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
  }, [lightboxIndex, gallery]);

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
              className="h-[300px] sm:h-[400px] w-full relative shrink-0 overflow-hidden transform-gpu will-change-transform bg-[#111111]"
            >
              {/* Hero Image Skeleton */}
              <div className={`absolute inset-0 bg-gray-800 animate-pulse transition-opacity duration-700 ${heroLoaded ? 'opacity-0' : 'opacity-100'}`} />
              
              <img
                src={item.image || defaultGalleryImages[0]}
                alt={item.title}
                onLoad={() => setHeroLoaded(true)}
                className={`w-full h-full object-cover transform-gpu transition-opacity duration-700 ${heroLoaded ? 'opacity-100' : 'opacity-0'}`}
                width="1200"
                height="800"
                decoding="async"
                loading="eager"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
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
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 px-4 sm:px-8 py-3 flex items-center justify-between gap-4 transform-gpu shadow-sm">
              <div className="flex flex-1 gap-2 sm:gap-3 items-center overflow-x-auto scrollbar-hide whitespace-nowrap">
                <button 
                  onClick={() => scrollToSection('overview')} 
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-[#1d1d1f] bg-black/5 hover:bg-black/10 backdrop-blur-md rounded-full transition-all duration-300 border border-transparent hover:border-black/5"
                >
                  Overview
                </button>
                {item.itinerary?.length > 0 && (
                  <button 
                    onClick={() => scrollToSection('itinerary')} 
                    className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-[#1d1d1f] bg-black/5 hover:bg-black/10 backdrop-blur-md rounded-full transition-all duration-300 border border-transparent hover:border-black/5"
                  >
                    Itinerary
                  </button>
                )}
                <button 
                  onClick={() => scrollToSection('pricing')} 
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-[#1d1d1f] bg-black/5 hover:bg-black/10 backdrop-blur-md rounded-full transition-all duration-300 border border-transparent hover:border-black/5"
                >
                  Pricing
                </button>
                <button 
                  onClick={() => scrollToSection('gallery')} 
                  className="px-3 py-1.5 sm:px-4 sm:py-2 text-sm font-medium text-[#1d1d1f] bg-black/5 hover:bg-black/10 backdrop-blur-md rounded-full transition-all duration-300 border border-transparent hover:border-black/5"
                >
                  Gallery
                </button>
              </div>
              <button
                onClick={() => {
                  onClose();
                  onBookNow(item);
                }}
                className="shrink-0 px-5 py-2 sm:px-6 sm:py-2.5 bg-[#1d1d1f] text-white rounded-full text-sm font-medium hover:bg-black transition-colors shadow-md transform-gpu"
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

              {/* --- GALLERY HIGHLIGHTS --- */}
              <section id="gallery" className="max-w-4xl mx-auto scroll-mt-24 pt-4 border-t border-gray-100 pb-10">
                <motion.div {...fadeUp} className="will-change-transform">
                  <h4 className="text-3xl font-bold tracking-tight text-[#1d1d1f] mb-8 flex items-center gap-3">
                    <Camera className="text-[#8A4413] " size={28} />
                    Gallery Highlights
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {gallery.map((imgUrl, idx) => (
                      <GalleryImage 
                        key={idx} 
                        src={imgUrl} 
                        alt={`${item.title} gallery ${idx + 1}`} 
                        onClick={() => setLightboxIndex(idx)}
                      />
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
              {/* Added a subtle global loading spinner behind the image in case of slow networks */}
              <div className="absolute inset-0 flex items-center justify-center -z-10">
                <Loader2 className="animate-spin text-white/30" size={40} />
              </div>
              
              <AnimatePresence mode="wait">
                <motion.img
                  key={lightboxIndex}
                  initial={{ opacity: 0, scale: 0.95, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95, x: -20 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  src={gallery[lightboxIndex]}
                  alt={`Gallery full view ${lightboxIndex + 1}`}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl transform-gpu relative z-10"
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
export default SafariModal;