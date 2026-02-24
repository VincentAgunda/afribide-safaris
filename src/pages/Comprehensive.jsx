import React, {
  useMemo,
  memo,
  Suspense,
  useRef,
  useState,
  useEffect,
} from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

// ✅ Lazy load icons
const AdminPanelSettings = React.lazy(() =>
  import("@mui/icons-material/AdminPanelSettings")
);
const Storage = React.lazy(() => import("@mui/icons-material/Storage"));
const BugReport = React.lazy(() =>
  import("@mui/icons-material/BugReport")
);
const Engineering = React.lazy(() =>
  import("@mui/icons-material/Engineering")
);
const CloudDone = React.lazy(() =>
  import("@mui/icons-material/CloudDone")
);
const ColorLens = React.lazy(() =>
  import("@mui/icons-material/ColorLens")
);
const Terminal = React.lazy(() =>
  import("@mui/icons-material/Terminal")
);
const Psychology = React.lazy(() =>
  import("@mui/icons-material/Psychology")
);
const Lightbulb = React.lazy(() =>
  import("@mui/icons-material/Lightbulb")
);

// ✅ Color Themes
const CARD_THEMES = [
  {
    bg: "#fafafa",
    text: "text-gray-900",
    subText: "text-gray-700 font-normal",
    iconBg: "bg-gray-200",
    iconColor: "text-gray-900",
    btnBg: "bg-[#0b1b32] hover:bg-[#002D62]",
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
    plusBorder:
      "border-white text-white hover:bg-white hover:text-[#979797]",
    divider: "border-white/30",
  },
  {
    bg: "#F5F5F7",
    text: "text-gray-900",
    subText: "text-gray-700 font-normal",
    iconBg: "bg-white",
    iconColor: "text-gray-900",
    btnBg: "bg-[#0b1b32] hover:bg-[#002D62]",
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
    plusBorder:
      "border-white text-white hover:bg-white hover:text-black",
    divider: "border-gray-800",
  },
  {
    bg: "#ffffff",
    text: "text-gray-900",
    subText: "text-gray-700 font-normal",
    iconBg: "bg-white",
    iconColor: "text-gray-900",
    btnBg: "bg-[#0b1b32] hover:bg-[#002D62]",
    btnText: "text-white",
    plusBorder: "border-[#0b1b32] text-[#0b1b32]",
    divider: "border-gray-300",
  },
];

// ✅ Service Card Component
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

        <p className={`mb-6 ${theme.subText}`}>
          {service.description}
        </p>

        <ul className="space-y-2 mb-8">
          {service.features.map((item, i) => (
            <li key={i} className="flex items-start">
              <span
                className={`inline-block w-1.5 h-1.5 rounded-full mt-2 mr-3 ${
                  theme.text === "text-white"
                    ? "bg-white"
                    : "bg-gray-600"
                }`}
              ></span>
              <span className={`text-sm ${theme.subText}`}>
                {item}
              </span>
            </li>
          ))}
        </ul>

        <div
          className={`mt-auto pt-4 border-t flex items-center justify-between ${theme.divider}`}
        >
          <motion.button
            whileHover={isMobile ? {} : { scale: 1.02 }}
            whileTap={isMobile ? {} : { scale: 0.98 }}
            onClick={onOpenModal}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${theme.btnBg} ${theme.btnText}`}
          >
            Get Started
          </motion.button>

          <button
            onClick={onOpenModal}
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

// ✅ Main Component
const Comprehensive = ({ onOpenModal }) => {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

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
        title: "System Administration",
        description:
          "Professional system administration and engineering services.",
        icon: AdminPanelSettings,
        features: [
          "Server setup",
          "Network security",
          "System monitoring",
        ],
      },
      {
        title: "Database Design",
        description:
          "Custom database solutions tailored to your needs.",
        icon: Storage,
        features: [
          "Relational databases",
          "NoSQL solutions",
          "Performance tuning",
        ],
      },
      {
        title: "Software Testing",
        description:
          "Ensure your software is reliable and secure.",
        icon: BugReport,
        features: [
          "Unit testing",
          "Automation",
          "Security testing",
        ],
      },
      {
        title: "Cloud Management",
        description:
          "Optimize and manage your cloud infrastructure.",
        icon: CloudDone,
        features: [
          "Cloud architecture",
          "AWS/Azure/GCP",
          "DevOps automation",
        ],
      },
      {
        title: "AI Integration",
        description:
          "Intelligent automation for smarter decisions.",
        icon: Psychology,
        features: [
          "Machine learning",
          "Chatbots",
          "Predictive analytics",
        ],
      },
      {
        title: "IT Consultancy",
        description:
          "Strategic guidance for digital transformation.",
        icon: Lightbulb,
        features: [
          "Technology audits",
          "Architecture design",
          "Cloud strategy",
        ],
      },
      {
        title: "Custom Development",
        description:
          "Scalable software tailored to your workflows.",
        icon: Terminal,
        features: [
          "Web applications",
          "API development",
          "Legacy modernization",
        ],
      },
      {
        title: "UI/UX Design",
        description:
          "User-centric design that maximizes engagement.",
        icon: ColorLens,
        features: [
          "Wireframing",
          "Prototyping",
          "User research",
        ],
      },
      {
        title: "IT Equipment Supply",
        description:
          "Reliable sourcing and supply of enterprise-grade IT hardware and infrastructure.",
        icon: Engineering,
        features: [
          "Laptops & desktops",
          "Networking equipment",
          "Servers & storage solutions",
        ],
      },
    ],
    []
  );

  return (
    <section className="w-full min-h-screen py-20 bg-[#F0F8FF]">
      <div className="max-w-7xl mx-auto mb-16 px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-medium text-[#002D62]">
          My Expertise
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
            onOpenModal={onOpenModal}
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
    </section>
  );
};

export default memo(Comprehensive);
