import React, {
  useMemo,
  memo,
  Suspense,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import BookingModal from "../components/BookingModal";

// Lazy-load icons
const Map = React.lazy(() => import("@mui/icons-material/Map"));
const Explore = React.lazy(() => import("@mui/icons-material/Explore"));
const Landscape = React.lazy(() => import("@mui/icons-material/Landscape"));
const DirectionsCar = React.lazy(() => import("@mui/icons-material/DirectionsCar"));
const Article = React.lazy(() => import("@mui/icons-material/Article"));

const CARD_THEMES = [
  {
    bg: "#FFFFFF",
    text: "text-gray-900",
    subText: "text-gray-500 font-light tracking-wide",
    iconBg: "bg-[#F5F5F7]",
    iconColor: "text-[#8A4413]",
    btnBg: "bg-transparent border border-gray-900 hover:bg-gray-900",
    btnText: "text-gray-900 hover:text-white",
    plusBorder: "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white",
    divider: "border-gray-200",
    bullet: "bg-[#8A4413]",
  },
  {
    bg: "#F5F5F7",
    text: "text-gray-900",
    subText: "text-gray-600 font-light tracking-wide",
    iconBg: "bg-white",
    iconColor: "text-[#8A4413]",
    btnBg: "bg-[#8A4413] border border-[#8A4413] hover:bg-[#733810]",
    btnText: "text-white",
    plusBorder: "border-[#8A4413] text-[#8A4413] hover:bg-[#8A4413] hover:text-white",
    divider: "border-gray-300",
    bullet: "bg-[#8A4413]",
  },
  {
    bg: "#111111",
    text: "text-white",
    subText: "text-gray-400 font-light tracking-wide",
    iconBg: "bg-gray-800",
    iconColor: "text-[#8A4413]",
    btnBg: "bg-white border border-white hover:bg-gray-200",
    btnText: "text-black",
    plusBorder: "border-white text-white hover:bg-white hover:text-black",
    divider: "border-gray-800",
    bullet: "bg-[#8A4413]",
  },
];

/* =========================================
   SERVICE CARD COMPONENT
========================================= */
const ServiceCard = memo(
  ({ service, index, onOpenModal, isMobile, totalCards }) => {
    const theme = CARD_THEMES[index % CARD_THEMES.length];

    const desktopMotionProps = {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      transition: { duration: 0.6, ease: "easeOut", delay: index * 0.1 },
      viewport: { amount: 0.2, once: true },
    };

    const MotionWrapper = isMobile ? "div" : motion.div;
    const motionProps = isMobile ? {} : desktopMotionProps;

    return (
      <MotionWrapper
        {...motionProps}
        style={{
          willChange: isMobile ? "auto" : "transform, opacity",
          width: "90%",
          maxWidth: "380px",
          minHeight: "480px",
          backgroundColor: theme.bg,
        }}
        className={`relative rounded-sm overflow-hidden flex-shrink-0 snap-center flex flex-col p-8 border ${
          theme.bg === "#FFFFFF" ? "border-gray-200" : "border-transparent"
        } ${index === 0 ? "ml-6 md:ml-0" : ""} ${
          index === totalCards - 1 ? "mr-6 md:mr-0" : "mr-6"
        }`}
      >
        <div
          className={`w-14 h-14 rounded-sm flex items-center justify-center mb-8 ${theme.iconBg} ${theme.iconColor}`}
        >
          <Suspense fallback={<div className="w-6 h-6" />}>
            <service.icon className="text-2xl" />
          </Suspense>
        </div>

        <h3 className={`text-xl font-medium tracking-wide mb-3 ${theme.text}`}>
          {service.title}
        </h3>

        <p className={`mb-8 text-sm leading-relaxed ${theme.subText}`}>
          {service.description}
        </p>

        <ul className="space-y-3 mb-8">
          {service.features.map((item, i) => (
            <li key={i} className="flex items-start">
              <span
                className={`inline-block w-1.5 h-1.5 rounded-sm mt-1.5 mr-3 flex-shrink-0 ${theme.bullet}`}
              ></span>
              <span className={`text-sm ${theme.subText}`}>{item}</span>
            </li>
          ))}
        </ul>

        <div
          className={`mt-auto pt-6 border-t flex items-center justify-between ${theme.divider}`}
        >
          <motion.button
            whileHover={isMobile ? {} : { scale: 1.02 }}
            whileTap={isMobile ? {} : { scale: 0.98 }}
            onClick={() => onOpenModal(service, theme)}
            className={`px-6 py-2.5 rounded-sm text-xs tracking-widest uppercase transition-colors duration-300 ${theme.btnBg} ${theme.btnText}`}
          >
            Book Today
          </motion.button>

          <button
            onClick={() => onOpenModal(service, theme)}
            className={`w-10 h-10 flex items-center justify-center rounded-sm border transition-all duration-300 ${theme.plusBorder}`}
          >
            <Plus size={18} strokeWidth={2} />
          </button>
        </div>
      </MotionWrapper>
    );
  }
);

ServiceCard.displayName = "ServiceCard";

/* =========================================
   MAIN COMPREHENSIVE COMPONENT
========================================= */
const Comprehensive = () => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Modal State
  const [modalData, setModalData] = useState({
    isOpen: false,
    service: null,
    theme: null,
  });

  const handleOpenModal = useCallback((service, theme) => {
    setModalData({ isOpen: true, service, theme });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalData((prev) => ({ ...prev, isOpen: false }));
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 768px)");
    const onChange = (e) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft;
      const width = container.offsetWidth;
      // Added a slight offset to calculate active index better on mobile
      const index = Math.round((scrollLeft + 20) / width);
      setActiveIndex(index);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToIndex = (index) => {
    const container = containerRef.current;
    if (!container) return;
    
    // Calculate scroll position factoring in card width and margins
    const cardWidth = container.querySelector('div').offsetWidth;
    const margin = 24; // mr-6 is 24px
    container.scrollTo({
      left: (cardWidth + margin) * index,
      behavior: "smooth",
    });
  };

  const services = useMemo(
    () => [
      {
        title: "Safari Packages",
        description:
          "Browse our curated list of unforgettable safari adventures across East Africa.",
        icon: Explore,
        features: [
          "Multi-day itineraries",
          "Family-friendly options",
          "Luxury & budget choices",
        ],
      },
      {
        title: "Kenya Safaris",
        description:
          "Experience the magic of the Masai Mara and the beauty of the Great Rift Valley.",
        icon: Map,
        features: [
          "The Great Migration",
          "Amboseli & Tsavo",
          "Beach & Bush combos",
        ],
      },
      {
        title: "Tanzania Safaris",
        description:
          "Witness the vast plains of the Serengeti and the incredible Ngorongoro Crater.",
        icon: Landscape,
        features: [
          "Serengeti National Park",
          "Mount Kilimanjaro climbs",
          "Zanzibar getaways",
        ],
      },
      {
        title: "Tailor-made Safari",
        description:
          "Design your dream African adventure exactly the way you want it.",
        icon: DirectionsCar,
        features: [
          "Personalized itineraries",
          "Choose your accommodations",
          "Private tour guides",
        ],
      },
      {
        title: "Travel Guide",
        description:
          "Read our latest tips, destination guides, and stories from the wild.",
        icon: Article,
        features: [
          "Packing guides",
          "Best times to visit",
          "Wildlife photography tips",
        ],
      },
    ],
    []
  );

  return (
    <section className="w-full min-h-screen py-24 bg-white">
      <div className="max-w-7xl mx-auto mb-16 px-6 lg:px-12 flex flex-col md:flex-row md:items-end justify-between">
        <div>
          <h2 className="text-sm tracking-widest uppercase font-semibold text-[#8A4413] mb-3">
            Our Offerings
          </h2>
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-light text-gray-900 tracking-wide">
            Discover Africa
          </h3>
        </div>
        
        {/* Desktop Navigation Arrows (Optional, stylistic addition to match premium feel) */}
        <div className="hidden md:flex gap-2 mt-6 md:mt-0">
           <button 
             onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
             className="w-10 h-10 border border-gray-300 rounded-sm flex items-center justify-center text-gray-500 hover:text-[#8A4413] hover:border-[#8A4413] transition-colors"
           >
             <span className="transform rotate-180 text-lg">➔</span>
           </button>
           <button 
             onClick={() => scrollToIndex(Math.min(services.length - 1, activeIndex + 1))}
             className="w-10 h-10 border border-gray-300 rounded-sm flex items-center justify-center text-gray-500 hover:text-[#8A4413] hover:border-[#8A4413] transition-colors"
           >
             <span className="text-lg">➔</span>
           </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto md:px-12">
        <div
          ref={containerRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide scroll-smooth py-4 pb-12"
        >
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              index={index}
              service={service}
              onOpenModal={handleOpenModal}
              isMobile={isMobile}
              totalCards={services.length}
            />
          ))}
        </div>
      </div>

      {/* Pagination Indicators - Changed to premium dashes instead of dots */}
      <div className="flex justify-center mt-2 gap-3">
        {services.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToIndex(idx)}
            className={`h-1 transition-all duration-300 rounded-sm ${
              activeIndex === idx
                ? "w-8 bg-[#8A4413]"
                : "w-4 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      <BookingModal
        isOpen={modalData.isOpen}
        onClose={handleCloseModal}
        service={modalData.service}
        theme={modalData.theme}
      />
    </section>
  );
};

export default memo(Comprehensive);