import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExpandMore } from "@mui/icons-material";

const easing = [0.16, 1, 0.3, 1];

const FAQ_DATA = [
  {
    q: "Do you provide end-to-end system architecture and infrastructure setup?",
    a: "Yes. I design, deploy, and manage complete system architectures including server configuration, database design, cloud infrastructure, security hardening, and performance optimization to ensure scalability and reliability."
  },
  {
    q: "Can you migrate our existing systems to the cloud?",
    a: "Absolutely. I handle full cloud migration strategies including architecture redesign, AWS/Azure/GCP implementation, cost optimization, security compliance, and post-migration performance tuning."
  },
  {
    q: "How do you ensure software quality and system reliability?",
    a: "Iimplement structured QA processes including unit testing, integration testing, automated pipelines, load testing, and vulnerability assessments to guarantee stable and secure deployments."
  },
  {
    q: "Do you offer ongoing system monitoring and maintenance?",
    a: "Yes. I provide continuous monitoring, patch management, performance tracking, incident management, and long-term technical support to keep your systems operating at peak performance."
  },
  {
    q: "Can you integrate AI or automation into our business processes?",
    a: "Yes. I develop custom AI models, predictive analytics systems, chatbots, and intelligent automation workflows tailored to enhance operational efficiency and decision-making."
  },
  {
    q: "Do you offer strategic IT consultancy and digital transformation guidance?",
    a: "I provide expert advisory services including technology audits, stack selection, DevOps implementation, architecture design, and digital transformation roadmaps aligned with your business goals."
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
            <ExpandMore fontSize="medium" />
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

        {/* Heading */}
        <motion.div
          className="text-center mb-24"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: easing }}
        >
          <h2 className="text-4xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f] mb-6">
  <span className="text-[#6e6e73]">Frequently</span>{" "}
  Asked Questions
</h2>

          <p className="text-[#6e6e73] text-lg max-w-xl mx-auto leading-relaxed">
            Clear answers about my engineering methodology, infrastructure
            strategy, and digital transformation expertise.
          </p>
        </motion.div>

        {/* FAQ List */}
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