import React, { useState, useCallback, memo } from "react";
import { ExpandMore } from "@mui/icons-material";

/* ------------------ DATA ------------------ */
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
    a: "Safety is our highest priority. Our guides are highly trained professionals with years of field experience."
  },
  {
    q: "Do I need specific vaccinations or travel insurance?",
    a: "Requirements vary by country. We recommend visiting a travel clinic 4–6 weeks before departure."
  },
  {
    q: "Can you customize a private itinerary?",
    a: "Absolutely. We specialize in bespoke safari journeys tailored to your style, pace, and preferred experiences."
  }
];

/* ------------------ ITEM ------------------ */
const FAQItem = memo(({ item, isActive, onClick }) => {
  return (
    <div className="border-b border-black/10 last:border-none">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between py-6 text-left group"
      >
        <h3 className="text-[18px] md:text-[20px] font-medium text-[#1d1d1f] tracking-[-0.015em] max-w-[42ch]">
          {item.q}
        </h3>

        <span
          className={`ml-4 flex items-center justify-center w-9 h-9 rounded-full bg-white/70 backdrop-blur-sm border border-black/10 transition-transform duration-300 ${
            isActive ? "rotate-180" : ""
          }`}
        >
          <ExpandMore fontSize="small" />
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          isActive ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="pb-6 text-[15.5px] md:text-[16px] leading-[1.7] text-[#6e6e73] max-w-2xl">
            {item.a}
          </p>
        </div>
      </div>
    </div>
  );
});

FAQItem.displayName = "FAQItem";

/* ------------------ MAIN ------------------ */
const Questions = () => {
  const [active, setActive] = useState(null);

  const toggle = useCallback((i) => {
    setActive((prev) => (prev === i ? null : i));
  }, []);

  return (
    <section className="bg-[#f5f5f7] py-28 px-6">
      <div className="max-w-6xl mx-auto">

        {/* TITLE */}
        <h2 className="text-[34px] md:text-[48px] font-semibold tracking-[-0.02em] text-[#1d1d1f] mb-16">
          Take a closer look.
        </h2>

        {/* GRADIENT CONTAINER (APPLE STYLE) */}
        <div className="relative rounded-[32px] overflow-hidden">

          {/* smooth blend background */}
          <div className="absolute inset-0 bg-[linear-gradient(90deg,#e5e5e7_0%,#e5e5e7_40%,#f6a96b_75%,#e67e22_100%)]" />

          {/* subtle noise-free overlay */}
          <div className="absolute inset-0 bg-white/10" />

          <div className="relative z-10 px-8 md:px-16 py-14 md:py-20 max-w-3xl">

            <h3 className="text-[22px] md:text-[28px] font-medium text-[#1d1d1f] tracking-[-0.02em] mb-10">
              Everything you need to know
            </h3>

            {/* FAQ LIST */}
            <div className="divide-y divide-black/10">
              {FAQ_DATA.map((item, i) => (
                <FAQItem
                  key={i}
                  item={item}
                  isActive={active === i}
                  onClick={() => toggle(i)}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Questions;
