import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Compass, Globe, Waves, Truck, Users, Plus, 
  ArrowRight, Play 
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
const services = [
  {
    icon: Compass,
    prefix: "Bespoke ",
    highlight: "Savanna Itineraries.",
    colorClass: "text-[#9c51e0]", 
    iconColor: "#9c51e0",
    desc: "Fully customized journeys tailored to your rhythm—whether tracking the Great Migration or retreating into quiet wilderness.",
  },
  {
    icon: Waves,
    prefix: "Exotic ",
    highlight: "Beach Safaris.",
    colorClass: "text-[#f56300]", 
    iconColor: "#f56300",
    desc: "From the savanna to the shoreline, experience seamless transitions into Africa’s most pristine coastal escapes.",
  },
  {
    icon: Globe,
    prefix: "Curated ",
    highlight: "Pan-African Tours.",
    colorClass: "text-[#00a29b]", 
    iconColor: "#00a29b",
    desc: "Travel beyond borders with curated routes across Africa’s most iconic and remote destinations.",
  },
  {
    icon: Truck,
    prefix: "Premium ",
    highlight: "Fleet & Logistics.",
    colorClass: "text-[#007aff]", 
    iconColor: "#007aff",
    desc: "Custom-engineered safari vehicles built for comfort, safety, and exceptional wildlife viewing.",
  },
  {
    icon: Users,
    prefix: "Expert ",
    highlight: "Tour Consultancy.",
    colorClass: "text-[#34c759]", 
    iconColor: "#34c759",
    desc: "Strategic planning from lodge selection to seasonal timing—ensuring a seamless, elevated journey.",
  },
];

const AboutAfribide = () => {
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

  // Update active dot on scroll
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft } = scrollRef.current;
    const cardWidth = scrollRef.current.children[0].offsetWidth;
    const gap = 24; // 1.5rem (gap-6)
    
    const newIndex = Math.round(scrollLeft / (cardWidth + gap));
    setActiveIndex(newIndex);
  };

  // Scroll to a specific index
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

  // Next button logic
  const scrollNext = () => {
    if (activeIndex < services.length - 1) {
      scrollToIndex(activeIndex + 1);
    } else {
      scrollToIndex(0); // Loop back to start
    }
  };

  return (
    <main className="bg-white text-[#1d1d1f] font-sans antialiased overflow-hidden">
      {/* ================= HERO ================= */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <img
          src="/Hero/cheetah.png"
          alt="Afribide Safari"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          className="relative z-10 text-center px-6 max-w-4xl"
        >
          <h1 className="text-white font-semibold tracking-tight leading-tight text-[clamp(2.5rem,6vw,5rem)]">
            Where Adventure Meets Expertise
          </h1>
          <p className="text-white/80 mt-6 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            A safari is not just a journey—it’s a return to the wild.
          </p>
        </motion.div>
      </section>

      {/* ================= INTRO ================= */}
      <section className="py-24 px-6 max-w-5xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <p className="text-xl md:text-2xl leading-relaxed text-[#424245] font-medium tracking-tight">
            At <span className="text-black font-semibold">Afribide Safaris</span>, we curate
            sophisticated, high-impact journeys that place you at the very heart
            of the wilderness.
          </p>
          <p className="mt-8 text-lg text-[#6e6e73] leading-relaxed tracking-tight">
            Based in Nairobi, we bridge rugged adventure with refined luxury—
            from the sweeping plains of the Masai Mara to secluded landscapes
            and the turquoise shores of the Indian Ocean. Every encounter is
            designed to feel both raw and effortlessly comfortable.
          </p>
        </motion.div>
      </section>

      {/* ================= A CLOSER LOOK ================= */}
      <section className="py-32 bg-[#f5f5f7]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f]">
               A balance of wild and refined.
            </h1>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="bg-gradient-to-r from-[#d9d9e3] via-[#d9d9e3] to-[#ffb37b] rounded-[28px] p-12 md:p-20 grid md:grid-cols-2 gap-12 items-center shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
          >
            <div className="text-center md:text-left flex flex-col items-center md:items-start z-10">
              <p className="mt-6 text-[#1d1d1f]/90 text-lg md:text-xl font-medium leading-relaxed max-w-[420px]">
                Whether beneath an acacia canopy or along untouched coastlines,
                Afribide Safaris ensures each moment feels immersive yet effortlessly
                luxurious.
              </p>
              <motion.a
                href="#explore"
                whileHover={{ scale: 1.02 }}
                className="mt-10 inline-flex items-center gap-2.5 px-8 py-3.5 text-base font-semibold rounded-full bg-black text-white group hover:bg-[#1d1d1f] transition-colors"
              >
                Explore Our Journeys
                <motion.span className="transition-transform group-hover:translate-x-1">
                  <ArrowRight size={20} strokeWidth={2} />
                </motion.span>
              </motion.a>
            </div>
            <motion.div 
              className="relative w-full flex justify-center md:justify-end"
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <img
                src="/Hero/ante.png"
                alt="Safari Guide"
                className="w-full max-w-[400px] h-[400px] object-contain drop-shadow-xl"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ================= WHAT WE OFFER ================= */}
      <section className="py-28 bg-[#f5f5f7]">
        <div className="max-w-7xl mx-auto pl-6 md:px-6">
          <div className="mb-12 pr-6 md:pr-0">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f]">
                What We Offer
              </h2>
            </motion.div>
          </div>

          {/* Carousel Container */}
          <div 
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-8 pt-4 w-full pr-6 md:pr-0 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {services.map((item, i) => {
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
                  // w-[62vw] ensures exactly 1.5 cards are visible on mobile viewports
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
                {services.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToIndex(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ease-out ${
                      activeIndex === i 
                        ? "w-7 bg-[#6e6e73]" // Elongated active indicator
                        : "w-2 bg-[#a1a1a6] hover:bg-[#86868b]" // Small circular inactive dot
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
          src="/Hero/antelopep.png"   // <-- change to your image
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
    </main>
  );
};

export default AboutAfribide;