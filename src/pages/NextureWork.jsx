// SafariGalleryPage.jsx
import React, { useRef, useState, useEffect, useCallback, useMemo, memo } from "react";
import { motion, AnimatePresence, useIsPresent } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ImageIcon,
  Map,
  Banknote,
  CheckCircle2,
  XCircle,
  Calendar,
  MapPin,
  Home,
  Utensils,
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
  "/Animals/2ducks.jpeg", // parachute
  "/zebra.jpeg", // Lion
  "/Animals/2ducks1.jpeg", // Giraffe
  "lion1.jpeg", // Zebra
  "zebra-outside.jpeg", // Rhino
  "/Animals/bird1.jpeg", // Leopard
  "elephant1.jpeg", // Cheetah
  "/Animals/bird2.jpeg", // Safari jeep
  "/Animals/bird3.jpeg", // Landscape sunset
  "/Animals/4zebras.jpeg"  // Hippo
];

/* ===========================
   Details Modal (optimised & memoized)
=========================== */
const SafariModal = memo(({ item, onClose, onBookNow }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const isPresent = useIsPresent();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const tabs = useMemo(() => [
    { id: "overview", label: "Overview", icon: ImageIcon },
    { id: "itinerary", label: "Itinerary", icon: Map },
    { id: "pricing", label: "Pricing & Inclusions", icon: Banknote },
  ], []);

  const gallery = useMemo(
    () => (item.gallery?.length ? item.gallery : defaultGalleryImages),
    [item.gallery]
  );

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans antialiased"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <motion.div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        layoutId={`card-${item.id}`}
        transition={spring}
        className="relative z-10 w-full max-w-5xl h-full max-h-[85vh] flex flex-col rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)] bg-white will-change-transform"
      >
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-white/20 backdrop-blur-xl border border-white/20 text-white flex items-center justify-center hover:bg-white/30 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <X size={20} strokeWidth={2.5} />
        </motion.button>

        <div className="overflow-y-auto w-full h-full scrollbar-hide overscroll-contain pb-12 translate-z-0">
          <motion.div
            layoutId={`image-${item.id}`}
            transition={spring}
            className="h-[250px] sm:h-[350px] w-full relative shrink-0 overflow-hidden will-change-transform"
            style={{ backgroundColor: item.bg || "#000" }}
          >
            <img
              src={item.image || defaultGalleryImages[0]}
              alt={item.title}
              className="w-full h-full object-cover"
              width="1200"
              height="800"
              decoding="async"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 sm:p-8 text-white w-full max-w-3xl">
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
                className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]"
              >
                {item.title}
              </motion.h3>
              {item.duration && (
                <p className="mt-2 text-white/80 text-sm flex items-center gap-1">
                  <Calendar size={14} /> {item.duration}
                </p>
              )}
            </div>
          </motion.div>

          {/* Sticky Tabs + Book Now */}
          <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200/60 px-4 sm:px-8 pt-4 pb-0 flex gap-2 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap outline-none"
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1d1d1f] rounded-t-full"
                      transition={spring}
                    />
                  )}
                  <span
                    className={`relative z-10 flex items-center gap-2 ${
                      isActive
                        ? "text-[#1d1d1f]"
                        : "text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    {tab.label}
                  </span>
                </button>
              );
            })}
            <button
              onClick={() => {
                onClose();
                onBookNow(item);
              }}
              className="ml-auto px-5 py-2 bg-black text-white rounded-full text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Book Now
            </button>
          </div>

          <div className="px-4 sm:px-8 py-8 max-w-5xl mx-auto min-h-[300px]">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div key="overview" {...fadeUp} className="max-w-4xl">
                  <p className="text-lg sm:text-xl text-[#545454] font-medium leading-relaxed tracking-tight mb-8">
                    {item.description}
                  </p>
                  
                  {/* Journey at a Glance in Overview */}
                  {item.journeyAtAGlance && (
                    <div className="mt-8 p-6 rounded-2xl bg-gray-50 border border-gray-100">
                      <h4 className="text-xl font-bold text-[#1d1d1f] mb-3 flex items-center gap-2">
                        <MapPin className="text-blue-500" size={22} />
                        Journey at a Glance
                      </h4>
                      <p className="text-[#545454] leading-relaxed whitespace-pre-line">
                        {item.journeyAtAGlance}
                      </p>
                    </div>
                  )}

                  <h4 className="text-xl font-bold tracking-tight text-[#1d1d1f] mt-8 mb-4">
                    Gallery Highlights
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {gallery.map((imgUrl, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.02, y: -2 }}
                        transition={spring}
                        className="aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 shadow-sm ring-1 ring-black/5 will-change-transform"
                      >
                        <img
                          src={imgUrl}
                          alt={`${item.title} gallery ${idx + 1}`}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          decoding="async"
                          width="400"
                          height="500"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "itinerary" && (
                <motion.div key="itinerary" {...fadeUp} className="max-w-3xl mx-auto">
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gray-200">
                    {item.itinerary?.map((day, idx) => (
                      <div
                        key={idx}
                        className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
                      >
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#1d1d1f] text-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform duration-300 hover:scale-110">
                          <span className="text-xs font-bold tracking-tighter">
                            {day.day.replace("Day ", "")}
                          </span>
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.06)] transition-shadow duration-300">
                          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">
                            {day.day}
                          </span>
                          <h4 className="text-lg font-bold text-[#1d1d1f] tracking-tight mb-2">
                            {day.title}
                          </h4>
                          <p className="text-[#86868b] text-sm leading-relaxed">
                            {day.desc}
                          </p>

                          {/* Accommodation & Meal Plan per day */}
                          <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                            {day.accommodation && (
                              <div className="flex items-start gap-2">
                                <Home className="text-green-600 mt-0.5 shrink-0" size={14} />
                                <span className="text-sm text-[#545454]">
                                  <span className="font-medium">Accommodation:</span> {day.accommodation}
                                </span>
                              </div>
                            )}
                            {day.mealPlan && (
                              <div className="flex items-start gap-2">
                                <Utensils className="text-orange-500 mt-0.5 shrink-0" size={14} />
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
              )}

              {activeTab === "pricing" && (
                <motion.div
                  key="pricing"
                  {...fadeUp}
                  className="grid lg:grid-cols-12 gap-8"
                >
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <h4 className="text-2xl font-bold tracking-tight text-[#1d1d1f] mb-4 flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-xl">
                          <Banknote className="text-green-600" size={20} />
                        </div>
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
                        * Rates are based on persons traveling in a private 4x4 safari vehicle.
                      </p>
                    </div>
                  </div>
                  <div className="lg:col-span-5 space-y-6">
                    <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                      <h4 className="text-lg font-bold tracking-tight text-[#1d1d1f] mb-4 flex items-center gap-2">
                        <CheckCircle2 className="text-green-500" size={18} /> Included
                      </h4>
                      <ul className="space-y-2">
                        {item.included?.map((inc, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-[#86868b]"
                          >
                            <span className="text-green-500 mt-0.5">•</span> {inc}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                      <h4 className="text-lg font-bold tracking-tight text-[#1d1d1f] mb-4 flex items-center gap-2">
                        <XCircle className="text-red-500" size={18} /> Not Included
                      </h4>
                      <ul className="space-y-2">
                        {item.excluded?.map((exc, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-2 text-sm text-[#86868b]"
                          >
                            <span className="text-red-400 mt-0.5">✕</span> {exc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
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
      <section className="py-16 sm:py-24 bg-[#F5F5F7] min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="text-xl text-gray-500 font-medium"
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
            className="text-3xl md:text-4xl font-medium text-blue-600 tracking-tight mb-4"
          >
            Explore Afribide Safaris.
          </motion.h2>
        </div>

        <div className="relative">
          <div
            ref={carouselRef}
            className="overflow-x-auto scrollbar-hide snap-x snap-mandatory flex gap-4 sm:gap-6 pb-12 px-4 sm:px-6 -mx-4 sm:-mx-6 scroll-smooth"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              WebkitOverflowScrolling: "touch",
              overscrollBehaviorX: "contain",
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
                  className="snap-center shrink-0 relative rounded-[2rem] w-[85vw] sm:w-[350px] lg:w-[400px] h-[420px] sm:h-[500px] group cursor-pointer overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)] transition-shadow duration-500 will-change-transform translate-z-0"
                  style={{ backgroundColor: style.bg }}
                >
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
                        onClick={(e) => {
                          e.stopPropagation();
                          openBooking(item);
                        }}
                        className="bg-white text-black text-sm font-semibold px-5 py-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Book Now
                      </motion.button>
                    </div>
                  </div>
                  <motion.div
                    layoutId={`image-${item.id}`}
                    className="absolute inset-0 z-10 pointer-events-none will-change-transform"
                    transition={spring}
                  >
                    <img
                      src={item.image || defaultGalleryImages[0]}
                      alt={item.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
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
                  className="w-12 h-12 rounded-full bg-white border border-gray-200 text-[#1d1d1f] flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shadow-sm disabled:opacity-40"
                  disabled={active === 0}
                >
                  <ChevronLeft size={20} strokeWidth={2} />
                </button>
                <button
                  onClick={handleNext}
                  className="w-12 h-12 rounded-full bg-white border border-gray-200 text-[#1d1d1f] flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shadow-sm disabled:opacity-40"
                  disabled={active === safaris.length - 1}
                >
                  <ChevronRight size={20} strokeWidth={2} />
                </button>
              </div>
              <div className="flex space-x-2 order-1 sm:order-2 bg-gray-200/50 p-1.5 rounded-full backdrop-blur-sm">
                {safaris.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => scrollToIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-500 ease-out ${
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
        isModalOpen={!!bookingItem}
        onClose={() => setBookingItem(null)}
        initialPackage={bookingItem?.title || ""}
      />
    </section>
  );
};

export default SafariGalleryPage;