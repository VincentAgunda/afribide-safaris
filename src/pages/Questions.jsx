import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExpandMore } from "@mui/icons-material";

const easing = [0.22, 1, 0.36, 1];

const FAQ_DATA = [
  {
    q: "What is the best time of year to go on a safari?",
    a: "The 'best' time depends on the destination. For the Great Migration in the Masai Mara, July to October is ideal. Generally, the dry season (June to October) offers the best wildlife viewing as animals congregate around water sources."
  },
  {
    q: "Are your safari tours family-friendly?",
    a: "Yes, we curate specific family-oriented itineraries. These include child-friendly lodges, specialized junior ranger programs, and shorter game drives to ensure a comfortable and engaging experience for all ages."
  },
  {
    q: "What should I pack for my bush expedition?",
    a: "We recommend neutral-colored clothing (khaki, beige, green), a high-quality camera, binoculars, sun protection, and comfortable walking shoes. We provide a detailed, destination-specific packing list upon booking."
  },
  {
    q: "Is it safe to go on a guided safari?",
    a: "Safety is our absolute priority. Our guides are highly trained professionals with years of experience in animal behavior. We use custom-built, high-safety vehicles and partner only with secure, top-tier luxury lodges."
  },
  {
    q: "Do I need specific vaccinations or travel insurance?",
    a: "Requirements vary by country (e.g., Yellow Fever or Malaria precautions). We strongly advise consulting a travel clinic 4–6 weeks before departure. Comprehensive travel insurance is mandatory for all our expeditions."
  },
  {
    q: "Can you customize a private itinerary?",
    a: "Absolutely. We specialize in bespoke safari experiences. Every detail can be tailored—from private bush flights to exclusive-use conservancies and personalized services."
  }
];

const FAQItem = ({ item, index, isActive, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.06, duration: 0.7, ease: easing }}
    >
      <div className="relative rounded-2xl border border-black/[0.05] bg-white/60 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.06)] hover:shadow-[0_12px_50px_rgba(0,0,0,0.08)] transition-all duration-500">

        {/* subtle glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/40 to-transparent pointer-events-none" />

        <button
          onClick={() => onClick(index)}
          className="relative w-full flex justify-between items-center text-left px-8 py-7 group"
        >
          <h3 className="text-[18px] md:text-[20px] font-medium text-[#1d1d1f] tracking-tight leading-snug pr-8">
            {item.q}
          </h3>

          <motion.div
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.5, ease: easing }}
            className="text-[#86868b] group-hover:text-[#1d1d1f] transition-colors"
          >
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-white/70 backdrop-blur-md shadow-sm group-hover:scale-110 transition-all">
              <ExpandMore fontSize="medium" />
            </span>
          </motion.div>
        </button>

        <AnimatePresence initial={false}>
          {isActive && (
            <motion.div
              key="content"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: easing }}
              className="overflow-hidden"
            >
              <div className="px-8 pb-8">
                <p className="text-[#6e6e73] text-[16px] leading-relaxed tracking-[0.2px]">
                  {item.a}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const Questions = () => {
  const [activeFAQ, setActiveFAQ] = useState(null);

  const toggleFAQ = useCallback((index) => {
    setActiveFAQ((prev) => (prev === index ? null : index));
  }, []);

  return (
    <section className="relative py-36 px-6 bg-[#fafafa] overflow-hidden">

      {/* PREMIUM BACKGROUND LIGHTING */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto relative z-10">
        
        <motion.div
          className="text-center mb-28"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: easing }}
        >
          <h2 className="text-4xl md:text-6xl font-semibold tracking-tight text-[#1d1d1f] mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              Common
            </span>{" "}
            Questions
          </h2>

          <p className="text-[#6e6e73] text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
            Everything you need to know about planning your next 
            luxury African wilderness experience.
          </p>
        </motion.div>

        <div className="space-y-6">
          {FAQ_DATA.map((item, index) => (
            <FAQItem
              key={index}
              item={item}
              index={index}
              isActive={activeFAQ === index}
              onClick={toggleFAQ}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Questions;