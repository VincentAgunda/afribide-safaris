// SafariGalleryPage.jsx  –  Optimised for Apple-level smoothness
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
  memo,
  startTransition,
} from "react";
import {
  motion,
  AnimatePresence,
  MotionConfig,
  useReducedMotion,
} from "framer-motion";
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
} from "lucide-react";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import BookingModal from "../components/BookingModal";

/* ─────────────────────────────────────────────
   Animation Config  (defined once, never re-created)
───────────────────────────────────────────── */
const SPRING = {
  type: "spring",
  stiffness: 340,
  damping: 32,
  mass: 0.75,
};

// Crisp, Apple-like fade-up — no layout shift
const FADE_UP = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
  transition: { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] },
};

// Overlay backdrop
const BACKDROP = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
  transition: { duration: 0.22, ease: "easeInOut" },
};

/* ─────────────────────────────────────────────
   Card colour palette
───────────────────────────────────────────── */
const CARD_COLORS = [
  { bg: "#000000", text: "text-white",      button: "light" },
  { bg: "#F5F5F7", text: "text-[#F5F5F7]", button: "light" },
  { bg: "#979797", text: "text-white",      button: "light" },
  { bg: "#FAFAFA", text: "text-[#F5F5F7]", button: "light" },
];

/* ─────────────────────────────────────────────
   Gallery fallback
───────────────────────────────────────────── */
const DEFAULT_GALLERY = [
  "/Animals/2ducks.jpeg",
  "/zebra.jpeg",
  "/Animals/2ducks1.jpeg",
  "lion1.jpeg",
  "zebra-outside.jpeg",
  "/Animals/bird1.jpeg",
  "elephant1.jpeg",
  "/Animals/bird2.jpeg",
  "/Animals/bird3.jpeg",
  "/Animals/4zebras.jpeg",
];

/* ─────────────────────────────────────────────
   Lightbox  (split out so SafariModal stays lean)
───────────────────────────────────────────── */
const Lightbox = memo(({ index, total, src, onClose, onPrev, onNext }) => {
  // Arrow-key navigation – attached once
  useEffect(() => {
    const handle = (e) => {
      if (e.key === "ArrowRight") onNext();
      else if (e.key === "ArrowLeft") onPrev();
      else if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, [onClose, onPrev, onNext]);

  return (
    <motion.div
      {...BACKDROP}
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-xl"
      style={{ contain: "strict" }}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors z-[110] bg-white/10 hover:bg-white/20 p-2 rounded-full"
        aria-label="Close lightbox"
      >
        <X size={28} />
      </button>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-all hover:scale-110 z-[110] bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md"
        aria-label="Previous image"
      >
        <ChevronLeft size={32} />
      </button>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-all hover:scale-110 z-[110] bg-white/10 hover:bg-white/20 p-3 rounded-full backdrop-blur-md"
        aria-label="Next image"
      >
        <ChevronRight size={32} />
      </button>

      {/* Image */}
      <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-12 md:p-24 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.img
            key={index}
            initial={{ opacity: 0, scale: 0.96, x: 16 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.96, x: -16 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            src={src}
            alt={`Gallery full view ${index + 1}`}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            draggable={false}
            // GPU compositing for the slide animation
            style={{ willChange: "transform, opacity" }}
          />
        </AnimatePresence>
      </div>

      {/* Counter pill */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 font-medium tracking-widest text-sm bg-white/10 px-4 py-2 rounded-full backdrop-blur-md pointer-events-none">
        {index + 1} / {total}
      </div>
    </motion.div>
  );
});
Lightbox.displayName = "Lightbox";

/* ─────────────────────────────────────────────
   SafariModal  (fully memoised, no inline fns)
───────────────────────────────────────────── */
const SafariModal = memo(({ item, onClose, onBookNow }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const scrollRef = useRef(null);

  const gallery = useMemo(
    () => (item.gallery?.length ? item.gallery : DEFAULT_GALLERY),
    [item.gallery]
  );

  // Body scroll lock — single effect, single cleanup
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, []);

  // Stable lightbox handlers — no recreation on render
  const openLightbox  = useCallback((idx) => setLightboxIndex(idx), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);
  const prevImage = useCallback(
    () => setLightboxIndex((p) => (p - 1 + gallery.length) % gallery.length),
    [gallery.length]
  );
  const nextImage = useCallback(
    () => setLightboxIndex((p) => (p + 1) % gallery.length),
    [gallery.length]
  );

  // Smooth scroll to section with sticky-header offset baked in
  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    const container = scrollRef.current;
    if (!el || !container) return;
    container.scrollTo({ top: el.offsetTop - 80, behavior: "smooth" });
  }, []);

  const handleBookNow = useCallback(() => {
    onClose();
    onBookNow(item);
  }, [onClose, onBookNow, item]);

  return (
    <>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans antialiased"
        {...BACKDROP}
      >
        {/* Backdrop click-to-close */}
        <motion.div
          onClick={onClose}
          className="absolute inset-0 bg-black/40 backdrop-blur-md"
          {...BACKDROP}
        />

        {/* Modal panel */}
        <motion.div
          layoutId={`card-${item.id}`}
          transition={SPRING}
          className="relative z-10 w-full max-w-5xl h-full max-h-[90vh] flex flex-col rounded-2xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)] bg-white"
          // Only composite-friendly props animated — no width/height layout thrash
          style={{ willChange: "transform" }}
        >
          {/* Close button */}
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Close"
          >
            <X size={20} strokeWidth={2.5} />
          </motion.button>

          {/* Scrollable body — overscroll-contain prevents parent page scroll */}
          <div
            ref={scrollRef}
            className="overflow-y-auto w-full h-full scrollbar-hide overscroll-contain pb-12 scroll-smooth"
            style={{ contain: "paint layout" }} // isolate paint & layout
          >
            {/* Hero */}
            <motion.div
              layoutId={`image-${item.id}`}
              transition={SPRING}
              className="h-[300px] sm:h-[400px] w-full relative shrink-0 overflow-hidden"
              style={{ backgroundColor: item.bg || "#000", willChange: "transform" }}
            >
              <img
                src={item.image || DEFAULT_GALLERY[0]}
                alt={item.title}
                className="w-full h-full object-cover"
                width="1200"
                height="800"
                decoding="async"
                loading="eager"
                // Highest priority so it paints instantly when modal opens
                fetchpriority="high"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 sm:p-10 text-white w-full max-w-4xl">
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                  className="block text-sm sm:text-base font-semibold uppercase tracking-[0.2em] mb-2 sm:mb-3 text-white/90"
                >
                  {item.category}
                </motion.span>
                <motion.h3
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                  className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]"
                >
                  {item.title}
                </motion.h3>
                {item.duration && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.24 }}
                    className="mt-4 text-white/80 text-base font-medium flex items-center gap-2"
                  >
                    <Calendar size={18} /> {item.duration}
                  </motion.p>
                )}
              </div>
            </motion.div>

            {/* Sticky quick-nav */}
            <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-200/60 px-4 sm:px-8 py-3 flex items-center justify-between">
              <div className="hidden sm:flex gap-6 items-center">
                {[
                  ["overview",  "Overview"],
                  ...(item.itinerary?.length ? [["itinerary", "Itinerary"]] : []),
                  ["pricing",   "Pricing"],
                ].map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => scrollToSection(id)}
                    className="text-sm font-semibold text-gray-500 hover:text-[#1d1d1f] transition-colors"
                  >
                    {label}
                  </button>
                ))}
              </div>
              <button
                onClick={handleBookNow}
                className="ml-auto px-6 py-2.5 bg-[#1d1d1f] text-white rounded-full text-sm font-medium hover:bg-black transition-colors shadow-md"
              >
                Book Now
                
              </button>
            </div>

            {/* Content */}
            <div className="px-4 sm:px-8 py-10 max-w-5xl mx-auto space-y-20">

              {/* ── OVERVIEW ── */}
              <section id="overview" className="max-w-4xl scroll-mt-24">
                <motion.div {...FADE_UP}>
                  <h4 className="text-2xl font-bold tracking-tight text-[#1d1d1f] mb-4">
                    The Experience
                  </h4>
                  <p className="text-lg sm:text-xl text-[#545454] font-medium leading-relaxed tracking-tight">
                    {item.description}
                  </p>

                  {item.journeyAtAGlance && (
                    <div className="mt-8 p-6 rounded-2xl bg-gray-50 border border-gray-100">
                      <h4 className="text-lg font-bold text-[#1d1d1f] mb-3 flex items-center gap-2">
                        <MapPin className="text-blue-600" size={20} />
                        Journey at a Glance
                      </h4>
                      <p className="text-[#545454] leading-relaxed whitespace-pre-line">
                        {item.journeyAtAGlance}
                      </p>
                    </div>
                  )}

                  <h4 className="text-xl font-bold tracking-tight text-[#1d1d1f] mt-12 mb-6">
                    Gallery Highlights
                  </h4>

                  {/* Gallery grid — first 3 images eager, rest lazy */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                    {gallery.map((imgUrl, idx) => (
                      <GalleryThumb
                        key={imgUrl + idx}
                        src={imgUrl}
                        idx={idx}
                        title={item.title}
                        onClick={openLightbox}
                        priority={idx < 3}
                      />
                    ))}
                  </div>
                </motion.div>
              </section>

              {/* ── ITINERARY ── */}
              {item.itinerary?.length > 0 && (
                <section id="itinerary" className="max-w-4xl mx-auto scroll-mt-24 pt-4 border-t border-gray-100">
                  <motion.div {...FADE_UP}>
                    <h4 className="text-3xl font-bold tracking-tight text-[#1d1d1f] mb-10 flex items-center gap-3">
                      <Map className="text-blue-600" size={28} />
                      Itinerary Details
                    </h4>
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gray-200">
                      {item.itinerary.map((day, idx) => (
                        <ItineraryCard key={idx} day={day} />
                      ))}
                    </div>
                  </motion.div>
                </section>
              )}

              {/* ── PRICING ── */}
              <section id="pricing" className="max-w-4xl scroll-mt-24 pt-4 border-t border-gray-100">
                <motion.div {...FADE_UP} className="grid lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <h4 className="text-3xl font-bold tracking-tight text-[#1d1d1f] mb-6 flex items-center gap-3">
                        <Banknote className="text-blue-600" size={28} />
                        Package Pricing
                      </h4>
                      <div className="space-y-3">
                        {item.pricing?.map((price, idx) => (
                          <div
                            key={idx}
                            className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors duration-300"
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
                        * Rates are based on persons traveling in a private 4×4 safari vehicle.
                      </p>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-6 lg:mt-14">
                    <IncludedCard title="Included" items={item.included} icon={<CheckCircle2 className="text-blue-600" size={18} />} className="bg-white border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]" bullet="•" bulletClass="text-blue-600 font-bold mt-0.5" />
                    <IncludedCard title="Not Included" items={item.excluded} icon={<XCircle className="text-gray-400" size={18} />} className="bg-gray-50 border-gray-100" bullet="✕" bulletClass="text-gray-400 mt-0.5" />
                  </div>
                </motion.div>
              </section>

            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            index={lightboxIndex}
            total={gallery.length}
            src={gallery[lightboxIndex]}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </>
  );
});
SafariModal.displayName = "SafariModal";

/* ─────────────────────────────────────────────
   Sub-components  (memoised, no inline objs)
───────────────────────────────────────────── */

/** Single gallery thumbnail */
const GalleryThumb = memo(({ src, idx, title, onClick, priority }) => (
  <motion.div
    whileHover={{ scale: 1.02, y: -2 }}
    transition={SPRING}
    onClick={() => onClick(idx)}
    className="group relative aspect-[3/2] rounded-xl overflow-hidden bg-gray-100 shadow-sm ring-1 ring-black/5 cursor-pointer"
    style={{ willChange: "transform" }}
  >
    <img
      src={src}
      alt={`${title} gallery ${idx + 1}`}
      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      width="600"
      height="400"
    />
    <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center text-white z-10 pointer-events-none">
      <ZoomIn size={36} strokeWidth={1.5} />
    </div>
  </motion.div>
));
GalleryThumb.displayName = "GalleryThumb";

/** Single itinerary timeline card */
const ItineraryCard = memo(({ day }) => (
  <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#1d1d1f] text-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform duration-300 hover:scale-110">
      <span className="text-xs font-bold tracking-tighter">
        {day.day.replace("Day ", "")}
      </span>
    </div>
    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.06)] transition-shadow duration-300">
      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">
        {day.day}
      </span>
      <h4 className="text-lg font-bold text-[#1d1d1f] tracking-tight mb-2">{day.title}</h4>
      <p className="text-[#86868b] text-sm leading-relaxed">{day.desc}</p>
      <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
        {day.accommodation && (
          <div className="flex items-start gap-2">
            <Home className="text-blue-600 mt-0.5 shrink-0" size={14} />
            <span className="text-sm text-[#545454]">
              <span className="font-medium">Accommodation:</span> {day.accommodation}
            </span>
          </div>
        )}
        {day.mealPlan && (
          <div className="flex items-start gap-2">
            <Utensils className="text-blue-600 mt-0.5 shrink-0" size={14} />
            <span className="text-sm text-[#545454]">
              <span className="font-medium">Meal Plan:</span> {day.mealPlan}
            </span>
          </div>
        )}
      </div>
    </div>
  </div>
));
ItineraryCard.displayName = "ItineraryCard";

/** Included / Not-included card */
const IncludedCard = memo(({ title, items, icon, className, bullet, bulletClass }) => (
  <div className={`p-6 rounded-2xl border ${className}`}>
    <h4 className="text-lg font-bold tracking-tight text-[#1d1d1f] mb-4 flex items-center gap-2">
      {icon} {title}
    </h4>
    <ul className="space-y-2">
      {items?.map((item, idx) => (
        <li key={idx} className="flex items-start gap-2 text-sm text-[#545454]">
          <span className={bulletClass}>{bullet}</span> {item}
        </li>
      ))}
    </ul>
  </div>
));
IncludedCard.displayName = "IncludedCard";

/* ─────────────────────────────────────────────
   Main Gallery Component
───────────────────────────────────────────── */
const SafariGalleryPage = () => {
  const carouselRef  = useRef(null);
  const cardRefs     = useRef([]);
  const prefersReduced = useReducedMotion();

  const [active,       setActive]       = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [bookingItem,  setBookingItem]  = useState(null);
  const [safaris,      setSafaris]      = useState([]);
  const [loading,      setLoading]      = useState(true);

  /* Firestore subscription */
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "safaris"),
      (snapshot) => {
        const packages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          gallery: doc.data().gallery?.length ? doc.data().gallery : DEFAULT_GALLERY,
        }));
        // Non-urgent — don't block the current paint frame
        startTransition(() => {
          setSafaris(packages);
          setLoading(false);
        });
      },
      (err) => {
        console.error("Firestore error:", err);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  /* Scroll carousel to a specific card (stable ref) */
  const scrollToIndex = useCallback((index) => {
    const container = carouselRef.current;
    const card      = cardRefs.current[index];
    if (!container || !card) return;
    // Read offsetLeft once — no layout thrash
    const left = card.offsetLeft - 24;
    container.scrollTo({ left, behavior: "smooth" });
  }, []);

  /* IntersectionObserver — tracks active card */
  useEffect(() => {
    const container = carouselRef.current;
    if (!container || safaris.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = parseInt(entry.target.getAttribute("data-index"), 10);
            if (!isNaN(idx)) {
              // Non-urgent dot/arrow update
              startTransition(() => setActive(idx));
            }
          }
        }
      },
      { root: container, threshold: 0.55 }
    );

    const cards = cardRefs.current;
    cards.forEach((c) => c && observer.observe(c));
    return () => {
      cards.forEach((c) => c && observer.unobserve(c));
      observer.disconnect();
    };
  }, [safaris]);

  /* Touch-swipe on carousel (passive, no jank) */
  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let startX = 0;
    const onTouchStart = (e) => { startX = e.touches[0].clientX; };
    const onTouchEnd   = (e) => {
      const delta = startX - e.changedTouches[0].clientX;
      if (Math.abs(delta) > 50) {
        delta > 0
          ? scrollToIndex(Math.min(safaris.length - 1, active + 1))
          : scrollToIndex(Math.max(0, active - 1));
      }
    };
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchend",   onTouchEnd,   { passive: true });
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchend",   onTouchEnd);
    };
  }, [active, safaris.length, scrollToIndex]);

  const handlePrev     = useCallback(() => scrollToIndex(Math.max(0, active - 1)), [active, scrollToIndex]);
  const handleNext     = useCallback(() => scrollToIndex(Math.min(safaris.length - 1, active + 1)), [active, safaris.length, scrollToIndex]);
  const openModal      = useCallback((item) => setSelectedItem(item), []);
  const closeModal     = useCallback(() => setSelectedItem(null), []);
  const openBooking    = useCallback((item) => setBookingItem(item), []);
  const closeBooking   = useCallback(() => setBookingItem(null), []);

  if (loading) {
    return (
      <section className="py-16 sm:py-24 bg-[#F5F5F7] min-h-screen flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xl text-[#86868b] font-medium tracking-tight"
        >
          Loading safaris…
        </motion.div>
      </section>
    );
  }

  return (
    /*
      MotionConfig propagates two global optimisations:
        1. reducedMotion: "user" — respects OS accessibility setting automatically
        2. Shared transition prevents accidental layout animation cascades
    */
    <MotionConfig reducedMotion={prefersReduced ? "always" : "user"} transition={SPRING}>
      <section className="py-16 sm:py-24 bg-[#F5F5F7] min-h-screen font-sans antialiased overflow-hidden">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">

          {/* Heading */}
          <div className="text-center mb-12 sm:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-3xl md:text-5xl font-semibold text-[#1d1d1f] tracking-tight mb-4"
            >
              Explore Afribide Safaris.
            </motion.h2>
          </div>

          <div className="relative">
            {/* Carousel */}
            <div
              ref={carouselRef}
              className="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-4 sm:gap-6 pb-12 px-4 sm:px-6 -mx-4 sm:-mx-6"
              style={{
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                WebkitOverflowScrolling: "touch",
                overscrollBehaviorX: "contain",
              }}
            >
              {safaris.map((item, i) => {
                const style       = CARD_COLORS[i % CARD_COLORS.length];
                const enrichedItem = { ...item, ...style };
                return (
                  <SafariCard
                    key={item.id}
                    index={i}
                    item={item}
                    style={style}
                    enrichedItem={enrichedItem}
                    cardRef={(el) => (cardRefs.current[i] = el)}
                    onOpen={openModal}
                    onBook={openBooking}
                  />
                );
              })}
            </div>

            {/* Controls */}
            {safaris.length > 0 && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-2 px-4 sm:px-6">
                <div className="flex gap-3 order-2 sm:order-1">
                  <NavButton onClick={handlePrev} disabled={active === 0} label="Previous slide">
                    <ChevronLeft size={20} strokeWidth={2} />
                  </NavButton>
                  <NavButton onClick={handleNext} disabled={active === safaris.length - 1} label="Next slide">
                    <ChevronRight size={20} strokeWidth={2} />
                  </NavButton>
                </div>
                <div className="flex space-x-2 order-1 sm:order-2 bg-gray-200/50 p-1.5 rounded-full backdrop-blur-sm">
                  {safaris.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-2 rounded-full transition-all duration-500 ease-out ${
                        idx === active ? "w-6 bg-[#1d1d1f]" : "w-2 bg-gray-400 hover:bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Detail Modal */}
        <AnimatePresence>
          {selectedItem && (
            <SafariModal
              item={selectedItem}
              onClose={closeModal}
              onBookNow={openBooking}
            />
          )}
        </AnimatePresence>

        {/* Booking Modal */}
        <BookingModal
          isOpen={!!bookingItem}
          onClose={closeBooking}
          service={
            bookingItem
              ? { title: bookingItem.title, description: bookingItem.description }
              : undefined
          }
        />
      </section>
    </MotionConfig>
  );
};

export default SafariGalleryPage;

/* ─────────────────────────────────────────────
   Carousel Card  (own memo component → zero
   re-renders when active/selection changes)
───────────────────────────────────────────── */
const SafariCard = memo(({ index, item, style, enrichedItem, cardRef, onOpen, onBook }) => {
  const handleOpen = useCallback(() => onOpen(enrichedItem), [onOpen, enrichedItem]);
  const handleBook = useCallback((e) => { e.stopPropagation(); onBook(item); }, [onBook, item]);

  return (
    <motion.div
      data-index={index}
      ref={cardRef}
      layoutId={`card-${item.id}`}
      whileHover={{ scale: 0.98 }}
      transition={SPRING}
      onClick={handleOpen}
      className="snap-center shrink-0 relative rounded-2xl w-[85vw] sm:w-[350px] lg:w-[400px] h-[420px] sm:h-[500px] group cursor-pointer overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-shadow duration-500"
      style={{ backgroundColor: style.bg, willChange: "transform" }}
    >
      {/* Text overlay */}
      <div
        className={`absolute inset-0 p-6 sm:p-8 z-20 flex flex-col justify-between ${style.text} bg-gradient-to-b from-black/50 via-black/0 to-black/50`}
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
          <span className="opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out">
            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-5 py-3 rounded-full">
              View Details <ChevronRight size={16} />
            </span>
          </span>
          <motion.button
            onClick={handleBook}
            className="bg-white text-black text-sm font-semibold px-5 py-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Book Now
          </motion.button>
        </div>
      </div>

      {/* Card image */}
      <motion.div
        layoutId={`image-${item.id}`}
        className="absolute inset-0 z-10 pointer-events-none"
        transition={SPRING}
        style={{ willChange: "transform" }}
      >
        <img
          src={item.image || DEFAULT_GALLERY[0]}
          alt={item.title}
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
          loading={index < 2 ? "eager" : "lazy"}
          decoding="async"
          width="800"
          height="1000"
          fetchpriority={index === 0 ? "high" : "auto"}
        />
      </motion.div>
    </motion.div>
  );
});
SafariCard.displayName = "SafariCard";

/* Tiny reusable nav button */
const NavButton = memo(({ onClick, disabled, label, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className="w-12 h-12 rounded-full bg-white border border-gray-200 text-[#1d1d1f] flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shadow-sm disabled:opacity-40"
  >
    {children}
  </button>
));
NavButton.displayName = "NavButton";