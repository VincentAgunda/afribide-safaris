import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, ShieldCheck, Leaf, HeartHandshake, Star, Plus, 
  Play 
} from "lucide-react";

/* ------------------ Animation ------------------ */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

/* ------------------ Data ------------------ */
const reasons = [
  {
    icon: MapPin,
    prefix: "Local ",
    highlight: "Nairobi Roots.",
    colorClass: "text-[#ff9500]", 
    iconColor: "#ff9500",
    desc: "Headquartered right where the action is. Our deep local networks ensure authentic access to both the Masai Mara and hidden, off-the-beaten-path reserves.",
  },
  {
    icon: Star,
    prefix: "Exclusive ",
    highlight: "Access.",
    colorClass: "text-[#bf5af2]", 
    iconColor: "#bf5af2",
    desc: "Skip the crowded trails. We secure prime, front-row experiences for the Great Migration and exclusive bookings at high-demand luxury lodges.",
  },
  {
    icon: ShieldCheck,
    prefix: "Uncompromising ",
    highlight: "Safety.",
    colorClass: "text-[#007aff]", 
    iconColor: "#007aff",
    desc: "From top-tier medical evacuation cover to meticulously maintained 4x4s, your peace of mind is engineered into every itinerary.",
  },
  {
    icon: Leaf,
    prefix: "Sustainable ",
    highlight: "Footprint.",
    colorClass: "text-[#34c759]", 
    iconColor: "#34c759",
    desc: "Partnering strictly with eco-conscious camps and conservation initiatives to protect Africa's vital ecosystems for future generations.",
  },
  {
    icon: HeartHandshake,
    prefix: "24/7 ",
    highlight: "Concierge.",
    colorClass: "text-[#ff9500]", 
    iconColor: "#ff3b30",
    desc: "A dedicated support team tracking your journey in real-time, ready to handle seamless on-the-ground adjustments at a moment's notice.",
  },
];

const WhyChooseAfribide = () => {
  const [expandedCards, setExpandedCards] = useState({});
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  const toggleCard = (index, e) => {
    e.stopPropagation(); 
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft } = scrollRef.current;
    const cardWidth = scrollRef.current.children[0].offsetWidth;
    const gap = 24; 
    
    const newIndex = Math.round(scrollLeft / (cardWidth + gap));
    setActiveIndex(newIndex);
  };

  const scrollToIndex = (index) => {
    if (scrollRef.current) {
      const cardWidth = scrollRef.current.children[0].offsetWidth;
      const gap = 24;
      scrollRef.current.scrollTo({
        left: index * (cardWidth + gap),
        behavior: "smooth",
      });
    }
  };

  const scrollNext = () => {
    if (activeIndex < reasons.length - 1) {
      scrollToIndex(activeIndex + 1);
    } else {
      scrollToIndex(0); 
    }
  };

  return (
    /* Wrapped in a React Fragment */
    <>
      <section className="py-28 bg-[#f5f5f7] font-sans antialiased overflow-hidden">
        <div className="max-w-7xl mx-auto pl-6 md:px-6">
          <div className="mb-12 pr-6 md:pr-0">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f]">
                Why Choose Afribide
              </h2>
            </motion.div>
          </div>

          {/* Carousel Container */}
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 pt-4 w-full pr-6 md:pr-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {reasons.map((item, i) => {
              const Icon = item.icon;
              const isExpanded = expandedCards[i];

              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="relative flex-none w-[62vw] md:w-[400px] snap-start bg-white p-8 md:p-10 rounded-[28px] shadow-[0_2px_12px_rgba(0,0,0,0.04)] min-h-[420px] flex flex-col"
                >
                  <div className="mb-8">
                    <Icon size={36} color={item.iconColor} strokeWidth={1.5} />
                  </div>

                  <h3 className="text-[24px] md:text-[32px] font-semibold tracking-tight leading-tight text-[#1d1d1f] mb-4">
                    {item.prefix}
                    <span className={item.colorClass}>{item.highlight}</span>
                  </h3>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-[#6e6e73] text-base md:text-lg leading-relaxed tracking-tight overflow-hidden mt-4 pb-12"
                      >
                        {item.desc}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button
                    onClick={(e) => toggleCard(i, e)}
                    className="absolute bottom-8 right-8 w-10 h-10 flex items-center justify-center rounded-full bg-[#1d1d1f] text-white hover:bg-black transition-colors duration-200 z-10"
                  >
                    <motion.div
                      animate={{ rotate: isExpanded ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Plus size={24} strokeWidth={2.5} />
                    </motion.div>
                  </button>
                </motion.div>
              );
            })}
          </div>

          {/* Custom Pagination (Pill & Play Button) */}
          <div className="flex justify-center mt-10 pr-6 md:pr-0">
            <div className="flex items-center gap-4">
              {/* Dots Pill Container */}
              <div className="flex items-center gap-2 bg-[#e8e8ed] rounded-full px-5 py-3.5">
                {reasons.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ease-out ${
                      activeIndex === i 
                        ? "w-7 bg-[#6e6e73]" 
                        : "w-2 bg-[#a1a1a6] hover:bg-[#86868b]" 
                    }`}
                  />
                ))}
              </div>

              {/* Play/Next Circular Button */}
              <button
                onClick={scrollNext}
                className="w-12 h-12 flex items-center justify-center rounded-full bg-[#e8e8ed] text-[#1d1d1f] hover:bg-[#d2d2d7] active:scale-95 transition-all"
                aria-label="Next slide"
              >
                <Play fill="currentColor" size={20} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>
    
      {/* ================= CLOSING (UPDATED) ================= */}
      <section className="relative py-32 text-white text-center px-6 overflow-hidden">
        
        {/* Background Image */}
        <img
          src="/Hero/antelopep.png"   // <-- change to your image
          alt="Safari Sunset"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Content */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="relative z-10 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-5xl font-semibold tracking-tight">
            The journey begins with intention
          </h2>
          <p className="mt-6 text-white/80 text-lg leading-relaxed tracking-tight">
            Afribide Safaris is more than a travel company—it’s a gateway to
            Africa’s most powerful experiences, curated with precision and
            passion.
          </p>
        </motion.div>
      </section>
    </>
  );
};

export default WhyChooseAfribide;