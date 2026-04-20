import React, {
  useMemo,
  memo,
  Suspense,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X } from "lucide-react";
import emailjs from "@emailjs/browser";

// Swap out IT icons for Safari/Travel relevant icons
const Map = React.lazy(() => import("@mui/icons-material/Map"));
const Explore = React.lazy(() => import("@mui/icons-material/Explore"));
const Landscape = React.lazy(() => import("@mui/icons-material/Landscape"));
const DirectionsCar = React.lazy(() =>
  import("@mui/icons-material/DirectionsCar")
);
const Article = React.lazy(() => import("@mui/icons-material/Article"));

const CARD_THEMES = [
  {
    bg: "#fafafa",
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
   BOOKING MODAL COMPONENT
========================================= */
const BookingModal = ({ isOpen, onClose, service, theme }) => {
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    package: "",
    adults: "",
    children: "",
    travel_date: "",
  });

  // Auto-fill the package when modal opens based on the clicked card
  useEffect(() => {
    if (isOpen && service) {
      setFormData((prev) => ({ ...prev, package: service.title }));
    }
  }, [isOpen, service]);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.match(/^\S+@\S+\.\S+$/))
      newErrors.email = "Valid email required";
    if (!formData.travel_date) newErrors.travel_date = "Select a travel date";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    }
  };

  const handleWhatsApp = () => {
    const phoneNumber = "+254113073535"; // Replace with your number
    const text = `Hello! I'm interested in a safari and would like a quote.\n\n*Package:* ${
      formData.package || "Not selected"
    }\n*Travel Date:* ${formData.travel_date || "Not decided"}\n*Adults:* ${
      formData.adults || "0"
    }\n*Children:* ${formData.children || "0"}\n\n*Name:* ${
      formData.name || "Not provided"
    }\n*Message:* ${formData.message || "None"}`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, "_blank");
  };

  const sendEmail = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      setStatus("success");
      setTimeout(() => onClose(), 3000); // Auto close after success
    } catch (err) {
      setStatus("error");
    }
  };

  if (!isOpen || !service || !theme) return null;

  // Determine input field styling based on background to ensure readability
  const isDarkTheme = theme.text === "text-white";
  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none transition-colors ${
    isDarkTheme
      ? "bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:bg-white/20"
      : "bg-white border-gray-200 text-gray-900 focus:border-[#0b1b32]"
  }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            style={{ backgroundColor: theme.bg }}
            className={`relative w-full max-w-5xl max-h-[95vh] rounded-[32px] shadow-2xl flex flex-col md:flex-row overflow-hidden ${theme.text}`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 z-20 p-2 rounded-full backdrop-blur-md ${
                isDarkTheme ? "bg-white/10 hover:bg-white/20" : "bg-black/5 hover:bg-black/10"
              } transition`}
            >
              <X size={20} />
            </button>

            {/* Left Side: Form */}
            <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto max-h-[95vh] scrollbar-hide">
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                Book Your Adventure
              </h3>
              <p className={`mb-8 ${theme.subText}`}>
                You are requesting: <span className="font-semibold">{service.title}</span>
              </p>

              <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
                <input type="hidden" name="package" value={formData.package} />

                {/* People */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="adults"
                    value={formData.adults}
                    placeholder="Adults"
                    min="1"
                    onChange={handleChange}
                    className={inputClass}
                  />
                  <input
                    type="number"
                    name="children"
                    value={formData.children}
                    placeholder="Children"
                    min="0"
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                {/* Date */}
                <div className="flex flex-col">
                  <label className={`text-sm ml-2 mb-1 ${theme.subText}`}>
                    When would you like to start your vacation?
                  </label>
                  <input
                    type="date"
                    name="travel_date"
                    value={formData.travel_date}
                    onChange={handleChange}
                    className={`${inputClass} ${
                      errors.travel_date ? "border-red-500" : ""
                    }`}
                  />
                </div>

                {/* Contact */}
                <input
                  name="name"
                  value={formData.name}
                  placeholder="Full Name"
                  onChange={handleChange}
                  className={`${inputClass} ${errors.name ? "border-red-500" : ""}`}
                />

                <input
                  name="email"
                  value={formData.email}
                  placeholder="Email Address"
                  type="email"
                  onChange={handleChange}
                  className={`${inputClass} ${errors.email ? "border-red-500" : ""}`}
                />

                <input
                  name="phone"
                  value={formData.phone}
                  placeholder="Phone Number"
                  onChange={handleChange}
                  className={inputClass}
                />

                {/* Message */}
                <textarea
                  name="message"
                  value={formData.message}
                  rows="3"
                  placeholder="Special requests or custom ideas..."
                  onChange={handleChange}
                  className={inputClass}
                />

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`w-full sm:w-auto text-center order-3 sm:order-1 ${theme.subText} hover:opacity-70`}
                  >
                    Cancel
                  </button>

                  <div className="flex w-full sm:w-auto gap-3 flex-col sm:flex-row order-1 sm:order-2">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={handleWhatsApp}
                      className="px-6 py-3 rounded-full bg-[#25D366] text-white flex justify-center items-center gap-2 font-medium shadow-md hover:bg-[#20bd5a] transition-colors"
                    >
                      WhatsApp Quote
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      type="submit"
                      className={`px-8 py-3 rounded-full font-medium whitespace-nowrap shadow-md transition-colors ${theme.btnBg} ${theme.btnText}`}
                    >
                      {status === "sending" ? "Requesting..." : "Email Quote"}
                    </motion.button>
                  </div>
                </div>

                {/* Status Feedback */}
                {status === "success" && (
                  <p className="text-green-500 text-sm text-center pt-2 font-medium">
                    ✅ Request sent! We will contact you shortly.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-red-500 text-sm text-center pt-2 font-medium">
                    ❌ Failed to send. Please try again or use WhatsApp.
                  </p>
                )}
              </form>
            </div>

            {/* Right Side: Image */}
            <div className="hidden md:flex w-1/2 relative bg-gray-100 items-center justify-center p-8">
              {/* Optional background pattern/gradient overlay could go here */}
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/20 z-0"></div>
              <img
                src="/calltoaction.png"
                alt="Safari Adventure"
                className="w-full max-w-md object-contain z-10 drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/* =========================================
   SERVICE CARD COMPONENT
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

      {/* Embedded Modal Component */}
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