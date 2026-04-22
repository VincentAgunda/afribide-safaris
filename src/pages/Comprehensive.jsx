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
import BookingModal from "../components/BookingModal"; // <-- Import the extracted modal

// Lazy-load icons (same as before)
const Map = React.lazy(() => import("@mui/icons-material/Map"));
const Explore = React.lazy(() => import("@mui/icons-material/Explore"));
const Landscape = React.lazy(() => import("@mui/icons-material/Landscape"));
const DirectionsCar = React.lazy(() =>
  import("@mui/icons-material/DirectionsCar")
);
const Article = React.lazy(() => import("@mui/icons-material/Article"));

const CARD_THEMES = [
  {
    bg: "#F5F5F7",
    text: "text-gray-900",
    subText: "text-gray-700 font-normal",
    iconBg: "bg-gray-200",
    iconColor: "text-gray-900",
    btnBg: "bg-black hover:bg-[#002D62]",
    btnText: "text-white",
    plusBorder: "border-[#0b1b32] text-[#0b1b32]",
    divider: "border-gray-300",
  },
  {
    bg: "#979797",
    text: "text-white",
    subText: "text-gray-100 font-light",
    iconBg: "bg-white/20",
    iconColor: "text-white",
    btnBg: "bg-black hover:bg-[#222]",
    btnText: "text-white",
    plusBorder: "border-white text-white hover:bg-white hover:text-[#979797]",
    divider: "border-white/30",
  },
  {
    bg: "#Ffffff",
    text: "text-gray-900",
    subText: "text-gray-700 font-normal",
    iconBg: "bg-white",
    iconColor: "text-gray-900",
    btnBg: "bg-black hover:bg-[#002D62]",
    btnText: "text-white",
    plusBorder: "border-[#0b1b32] text-[#0b1b32]",
    divider: "border-gray-300",
  },
  {
    bg: "#000000",
    text: "text-white",
    subText: "text-gray-300 font-light",
    iconBg: "bg-gray-800",
    iconColor: "text-white",
    btnBg: "bg-white hover:bg-gray-200",
    btnText: "text-black",
    plusBorder: "border-white text-white hover:bg-white hover:text-black",
    divider: "border-gray-800",
  },
  {
    bg: "#FFD600",
    text: "text-gray-900",
    subText: "text-gray-700 font-normal",
    iconBg: "bg-white",
    iconColor: "text-gray-900",
    btnBg: "bg-black hover:bg-[#002D62]",
    btnText: "text-white",
    plusBorder: "border-[#0b1b32] text-[#0b1b32]",
    divider: "border-gray-300",
  },
];

/* =========================================
   SERVICE CARD COMPONENT (unchanged)
========================================= */
const ServiceCard = memo(
  ({ service, index, onOpenModal, isMobile, totalCards }) => {
    const theme = CARD_THEMES[index % CARD_THEMES.length];

    const desktopMotionProps = {
      initial: { opacity: 0.5, scale: 0.9 },
      whileInView: { opacity: 1, scale: 1 },
      transition: { duration: 0.6, ease: "easeOut" },
      viewport: { amount: 0.6, once: false },
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
        className={`relative rounded-3xl overflow-hidden flex-shrink-0 snap-center flex flex-col p-8 shadow-md border border-transparent ${
          index === 0 ? "ml-6" : ""
        } ${index === totalCards - 1 ? "mr-6" : "mr-5"}`}
      >
        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${theme.iconBg} ${theme.iconColor}`}
        >
          <Suspense fallback={<div className="w-6 h-6" />}>
            <service.icon className="text-2xl" />
          </Suspense>
        </div>

        <h3 className={`text-xl font-bold mb-3 ${theme.text}`}>
          {service.title}
        </h3>

        <p className={`mb-6 ${theme.subText}`}>{service.description}</p>

        <ul className="space-y-2 mb-8">
          {service.features.map((item, i) => (
            <li key={i} className="flex items-start">
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full mt-2 mr-3 ${
                  theme.text === "text-white" ? "bg-white" : "bg-gray-600"
                }`}
              ></span>
              <span className={`text-sm ${theme.subText}`}>{item}</span>
            </li>
          ))}
        </ul>

        <div
          className={`mt-auto pt-4 border-t flex items-center justify-between ${theme.divider}`}
        >
          <motion.button
            whileHover={isMobile ? {} : { scale: 1.02 }}
            whileTap={isMobile ? {} : { scale: 0.98 }}
            onClick={() => onOpenModal(service, theme)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${theme.btnBg} ${theme.btnText}`}
          >
            Book Today
          </motion.button>

          <button
            onClick={() => onOpenModal(service, theme)}
            className={`w-10 h-10 flex items-center justify-center rounded-full border-2 transition transform hover:scale-105 ${theme.plusBorder}`}
          >
            <Plus size={20} strokeWidth={3} />
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
      const index = Math.round(scrollLeft / width);
      setActiveIndex(index);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToIndex = (index) => {
    const container = containerRef.current;
    if (!container) return;
    const width = container.offsetWidth;
    container.scrollTo({
      left: width * index,
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
        title: "Custom / Tailor-made Safari",
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
        title: "Blog / Travel Guide",
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
    <section className="w-full min-h-screen py-20 bg-[#F0F8FF]">
      <div className="max-w-7xl mx-auto mb-16 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-medium text-[#002D62]">
          Discover Africa
        </h2>
      </div>

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

      <div className="flex justify-center mt-4 gap-2">
        {services.map((_, idx) => (
          <button
            key={idx}
            onClick={() => scrollToIndex(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              activeIndex === idx
                ? "bg-[#002D62] scale-110"
                : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Use the extracted BookingModal */}
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