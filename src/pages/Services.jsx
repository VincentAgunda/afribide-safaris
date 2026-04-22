import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ================================================= */
/* DATA (MINIMAL GRID CARDS)                         */
/* ================================================= */

const items = [
  {
    type: "testimonials",
    title: "Guest Stories",
    subtitle: "Real safari experiences.",
    image: "/camera1.webp",
    bg: "bg-[#f5f5f7]",
    button: "View Stories",
  },
  {
    type: "blog",
    blogIndex: 0,
    title: "Packing Guide",
    subtitle: "What to bring on safari.",
    image: "/gallery/jeep.jpeg",
    bg: "bg-gradient-to-r from-blue-100 to-blue-200",
    button: "Read",
  },
  {
    type: "blog",
    blogIndex: 1,
    title: "Great Migration",
    subtitle: "Nature’s greatest event.",
    image: "/Animals/lion1T.png",
    bg: "bg-[#f5f5f7]",
    button: "Explore",
  },
  {
    type: "blog",
    blogIndex: 2,
    title: "Luxury Lodges",
    subtitle: "Stay in the wild.",
    image: "/parachute.jpeg",
    bg: "bg-[#f5f5f7]",
    button: "Discover",
  },
];

/* ================================================= */
/* TESTIMONIALS                                      */
/* ================================================= */

const testimonials = [
  {
    name: "Vincent. A",
    quote:
      "Absolutely breathtaking experience in the Masai Mara! The guides were incredibly knowledgeable.",
    avatar: "ecommerce.png",
  },
  {
    name: "Anastasia Wokoli",
    quote:
      "Afribide tailored our trip perfectly. The luxury lodges exceeded expectations.",
    avatar: "camera1.webp",
  },
  {
    name: "David & Emma",
    quote:
      "A seamless and unforgettable honeymoon in the Serengeti.",
    avatar: "/gallery/jeep.jpeg",
  },
];

/* ================================================= */
/* BLOGS                                             */
/* ================================================= */

const blogs = [
  {
    title: "What to Pack for Your First Safari",
    content:
      "Preparation is everything when heading into the wild. Packing smart ensures comfort and safety.",
    highlights: [
      "Neutral-colored clothing blends with nature",
      "Layered outfits handle temperature shifts",
      "Binoculars & zoom camera improve viewing",
    ],
    tips: ["Avoid bright colors", "Pack light but versatile"],
    image: "/goose.jpeg",
  },
  {
    title: "The Great Migration Explained",
    content:
      "Over a million animals move across ecosystems in a continuous cycle.",
    highlights: [
      "Over 1.5M animals migrate yearly",
      "Best seen in Serengeti & Masai Mara",
    ],
    tips: ["Visit July–October", "Book early"],
    image: "/zebra.jpeg",
  },
  {
    title: "Top 5 Luxury Lodges",
    content:
      "Luxury lodges redefine comfort in the middle of nature.",
    highlights: [
      "Infinity pools overlooking wildlife",
      "Private decks & premium views",
    ],
    tips: ["Choose conservancies", "Check seasonal pricing"],
    image: "/parachute.jpeg",
  },
];

/* ================================================= */
/* COMPONENT                                         */
/* ================================================= */

const SafariGrid = () => {
  const [active, setActive] = useState(null);

  const closeModal = () => setActive(null);

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "auto";
  }, [active]);

  return (
    <section className="bg-[#e5e5e5] min-h-screen py-6 px-4">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">

        {items.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.01 }}
            className={`h-[420px] md:h-[480px] rounded-2xl overflow-hidden flex flex-col justify-between items-center text-center ${item.bg}`}
          >
            {/* TEXT */}
            <div className="pt-10 px-6">
              <h2 className="text-2xl md:text-3xl font-semibold">
                {item.title}
              </h2>

              <p className="text-gray-600 mt-2 text-sm md:text-base">
                {item.subtitle}
              </p>

              <button
                onClick={() => setActive(item)}
                className="mt-4 px-5 py-2 rounded-full bg-black text-white text-sm"
              >
                {item.button}
              </button>
            </div>

            {/* IMAGE */}
            <div className="w-full flex justify-center items-end pb-6">
              <img
                src={item.image}
                className="max-h-[220px] object-contain"
              />
            </div>
          </motion.div>
        ))}

      </div>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="w-full max-w-3xl bg-white rounded-3xl overflow-hidden"
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* CLOSE */}
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 bg-gray-100 w-10 h-10 rounded-full"
              >
                ✕
              </button>

              {/* TESTIMONIALS VIEW */}
              {active.type === "testimonials" && (
                <div className="p-10 space-y-8">
                  <h3 className="text-2xl font-semibold">
                    What Our Guests Say
                  </h3>

                  {testimonials.map((t, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <img
                        src={t.avatar}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-gray-700 text-sm italic">
                          "{t.quote}"
                        </p>
                        <span className="text-xs font-semibold">
                          {t.name}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* BLOG VIEW */}
              {active.type === "blog" && (
                <div>
                  <img
                    src={blogs[active.blogIndex].image}
                    className="h-64 w-full object-cover"
                  />

                  <div className="p-10 space-y-6">
                    <h3 className="text-2xl font-semibold">
                      {blogs[active.blogIndex].title}
                    </h3>

                    <p className="text-gray-700">
                      {blogs[active.blogIndex].content}
                    </p>

                    <div>
                      <h4 className="font-semibold mb-2">Highlights</h4>
                      <ul className="space-y-2">
                        {blogs[active.blogIndex].highlights.map((h, i) => (
                          <li key={i}>• {h}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Tips</h4>
                      <ul className="space-y-2">
                        {blogs[active.blogIndex].tips.map((t, i) => (
                          <li key={i}>• {t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SafariGrid;