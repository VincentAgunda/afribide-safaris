import React, { useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExpandMore } from "@mui/icons-material";

const easing = [0.22, 1, 0.36, 1];

const FAQ_DATA = [
  {
    q: "What is the best time of year to go on a safari?",
    a: "The best time depends on the destination. For the Great Migration in the Masai Mara, July to October is ideal. Generally, the dry season (June to October) offers the best wildlife viewing as animals gather around water sources."
  },
  {
    q: "Are your safari tours family-friendly?",
    a: "Yes, we curate family-oriented itineraries with child-friendly lodges, junior ranger programs, and shorter game drives for comfort and engagement."
  },
  {
    q: "What should I pack for my bush expedition?",
    a: "We recommend neutral-colored clothing, a quality camera, binoculars, sun protection, and comfortable walking shoes. A destination-specific list is provided after booking."
  },
  {
    q: "Is it safe to go on a guided safari?",
    a: "Safety is our highest priority. Our guides are highly trained professionals with years of field experience. We also use premium custom safari vehicles and trusted luxury lodges."
  },
  {
    q: "Do I need specific vaccinations or travel insurance?",
    a: "Requirements vary by country. We recommend visiting a travel clinic 4–6 weeks before departure. Comprehensive travel insurance is required."
  },
  {
    q: "Can you customize a private itinerary?",
    a: "Absolutely. We specialize in bespoke safari journeys tailored to your style, pace, and preferred experiences."
  }
];

// 1. Define variants for the parent container to handle staggering
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Controls the delay between each item
    }
  }
};

// 2. Define variants for the individual items
const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.45, ease: easing } 
  }
};

const FAQItem = memo(({ item, index, isActive, onClick }) => {
  return (
    // 3. Remove whileInView here. The parent handles the trigger now.
    <motion.div variants={itemVariants}>
      <div className="relative overflow-hidden rounded-2xl border border-black/[0.06] bg-white/85 shadow-[0_8px_24px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-all duration-300 hover:shadow-[0_14px_34px_rgba(0,0,0,0.07)]">
        <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-white/30 to-transparent pointer-events-none" />

        <button
          onClick={() => onClick(index)}
          className="relative w-full flex items-center justify-between text-left px-6 md:px-8 py-5 md:py-6 gap-5"
        >
          <h3 className="text-[17px] md:text-[19px] font-medium text-[#1d1d1f] leading-[1.3] tracking-[-0.02em] max-w-[34ch]">
            {item.q}
          </h3>

          <motion.div
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.32, ease: easing }}
            className="shrink-0"
          >
            <span className="flex items-center justify-center w-10 h-10 rounded-full bg-[#f5f5f7] text-[#6e6e73] shadow-sm">
              <ExpandMore fontSize="medium" />
            </span>
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isActive && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{
                height: { duration: 0.28, ease: easing },
                opacity: { duration: 0.2 }
              }}
              className="overflow-hidden"
            >
              <div className="px-6 md:px-8 pb-6">
                <p className="text-[#6e6e73] text-[15px] md:text-[16px] leading-[1.75] max-w-2xl">
                  {item.a}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
});

FAQItem.displayName = "FAQItem";

const Questions = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);

  const toggleFAQ = useCallback((index) => {
    setActiveFAQ((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#fafafa] py-28 md:py-36 px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[560px] h-[560px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[360px] h-[360px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl">
        <motion.div
          className="mb-16 md:mb-20 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "100px" }} // Pre-trigger before it hits the viewport
          transition={{ duration: 0.55, ease: easing }}
        >
          <div className="mx-auto mb-5 inline-flex items-center gap-3 rounded-full border border-black/[0.06] bg-white/70 px-4 py-2 text-[12px] font-medium tracking-[0.18em] uppercase text-[#6e6e73] backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            FAQ
          </div>

          <h2 className="mx-auto text-center text-5xl md:text-7xl font-semibold tracking-[-0.06em] text-[#1d1d1f] leading-[0.95] whitespace-nowrap">
            <span>Common </span>
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
              Questions
            </span>
          </h2>

          <p className="mt-6 mx-auto max-w-2xl text-[17px] md:text-[20px] leading-[1.7] tracking-[-0.01em] text-[#6e6e73]">
            Everything you need to know about planning your next luxury African
            wilderness experience.
          </p>
        </motion.div>

        {/* 4. Wrap the list in a motion.div to control the stagger centrally */}
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "150px" }} // Triggers 150px BEFORE scrolling into view
        >
          {FAQ_DATA.map((item, index) => (
            <FAQItem
              key={index}
              item={item}
              index={index}
              isActive={activeFAQ === index}
              onClick={toggleFAQ}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Questions;