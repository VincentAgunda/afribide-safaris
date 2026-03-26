import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExpandMore } from "@mui/icons-material";

const easing = [0.16, 1, 0.3, 1];

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
    a: "Absolutely. We specialize in bespoke digital transformation of the traditional safari. We can tailor every detail—from private bush flights to specific dietary requirements and exclusive-use conservancies."
  }
];

const FAQItem = ({ item, index, isActive, onClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.05, duration: 0.6, ease: easing }}
      className="relative"
    >
      <div className="rounded-2xl bg-white/70 backdrop-blur-xl border border-black/[0.04] shadow-[0_4px_30px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_10px_40px_rgba(0,0,0,0.06)]">
        
        <button
          onClick={() => onClick(index)}
          className="w-full flex justify-between items-center text-left px-8 py-7 group"
        >
          <h3 className="text-[17px] md:text-[19px] font-medium text-[#1d1d1f] tracking-tight pr-8">
            {item.q}
          </h3>

          <motion.div
            animate={{ rotate: isActive ? 180 : 0 }}
            transition={{ duration: 0.4, ease: easing }}
            className="text-[#86868b] group-hover:text-[#1d1d1f] transition-colors"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-50 group-hover:bg-gray-100">
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
              transition={{ duration: 0.4, ease: easing }}
              className="overflow-hidden"
            >
              <div className="px-8 pb-8">
                <p className="text-[#6e6e73] text-[15px] md:text-[16px] leading-relaxed">
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
    <section className="relative py-32 px-6 bg-[#fafafa] overflow-hidden">
      <div className="max-w-3xl mx-auto">
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: easing }}
        >
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f] mb-6">
            <span className="text-[#6e6e73]">Common</span> Questions
          </h2>
          <p className="text-[#6e6e73] text-lg max-w-xl mx-auto leading-relaxed">
            Everything you need to know about planning your next 
            unforgettable African wilderness expedition.
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