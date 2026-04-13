import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ================================================= */
/* DATA                                              */
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
    avatar: "vincent.png",
  },
];

const blogs = [
  {
    title: "What to Pack for Your First Safari",
    excerpt: "Essential gear for your safari.",
    content:
      "Preparation is everything when heading into the wild. Packing smart ensures comfort and safety.",
    highlights: [
      "Neutral-colored clothing blends with nature",
      "Layered outfits handle temperature shifts",
      "Binoculars & zoom camera improve viewing",
    ],
    tips: [
      "Avoid bright colors",
      "Pack light but versatile",
      "Carry sunscreen & hat",
    ],
    image: "/goose.jpeg",
  },
  {
    title: "The Great Migration Explained",
    excerpt: "Understand the world’s greatest wildlife event.",
    content:
      "Over a million animals move across ecosystems in a continuous cycle.",
    highlights: [
      "Over 1.5M animals migrate yearly",
      "Best seen in Serengeti & Masai Mara",
      "River crossings are dramatic moments",
    ],
    tips: [
      "Visit July–October",
      "Book early for peak season",
    ],
    image: "/zebra.jpeg",
  },
  {
    title: "Top 5 Luxury Lodges",
    excerpt: "Stay in style in the wild.",
    content:
      "Luxury lodges redefine comfort in the middle of nature.",
    highlights: [
      "Infinity pools overlooking wildlife",
      "Private decks & premium views",
      "Eco-conscious architecture",
    ],
    tips: [
      "Choose conservancies for exclusivity",
      "Check seasonal pricing",
    ],
    image: "/parachute.jpeg",
  },
];

/* ================================================= */
/* COMPONENT                                         */
/* ================================================= */

const TestimonialsBlogs = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);

  const closeModal = () => setSelectedBlog(null);

  useEffect(() => {
    document.body.style.overflow = selectedBlog ? "hidden" : "auto";
  }, [selectedBlog]);

  return (
    <section className="min-h-screen bg-[#dadada] py-24 font-sans text-black">

      <div className="max-w-6xl mx-auto px-6">

        {/* HEADER */}
        <div className="flex justify-center mb-24">
          <h1 className="border-[3px] border-black px-8 py-3 text-3xl md:text-4xl font-bold tracking-widest uppercase">
            Testimonials & Blogs
          </h1>
        </div>

        {/* ================= TESTIMONIALS ================= */}
        <div className="mb-28">
          <h2 className="text-2xl font-semibold mb-12 uppercase tracking-wide">
            What Our Guests Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 180 }}
                className="bg-white p-8 rounded-3xl shadow-md text-center flex flex-col"
              >
                <div className="w-20 h-20 mx-auto mb-6 rounded-full overflow-hidden border">
                  <img src={t.avatar} className="w-full h-full object-cover" />
                </div>

                <p className="italic text-gray-800 mb-6 flex-grow leading-relaxed">
                  "{t.quote}"
                </p>

                <span className="text-sm font-semibold uppercase tracking-wide">
                  - {t.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ================= BLOGS ================= */}
        <div>
          <h2 className="text-2xl font-semibold mb-12 uppercase tracking-wide">
            Travel Guides & Stories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {blogs.map((blog, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 180 }}
                className="bg-white rounded-3xl overflow-hidden shadow-md flex flex-col group"
              >
                <div
                  className="h-52 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedBlog(blog)}
                >
                  <motion.img
                    src={blog.image}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6 }}
                  />
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold mb-3 tracking-tight">
                    {blog.title}
                  </h3>

                  <p className="text-sm text-gray-700 mb-6 flex-grow leading-relaxed">
                    {blog.excerpt}
                  </p>

                  <div className="flex justify-between items-center mt-auto">
                    <button
                      onClick={() => setSelectedBlog(blog)}
                      className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium"
                    >
                      Read More
                    </button>

                    <button
                      onClick={() => setSelectedBlog(blog)}
                      className="w-10 h-10 rounded-full bg-gray-200 text-xl flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* ================= MODAL ================= */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
          >
            <motion.div
              className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl"
              initial={{ scale: 0.92, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 20 }}
              transition={{ type: "spring", damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* CLOSE */}
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gray-100"
              >
                ✕
              </button>

              <div className="overflow-y-auto max-h-[92vh]">

                {/* IMAGE */}
                <div className="h-72 overflow-hidden">
                  <motion.img
                    src={selectedBlog.image}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                </div>

                {/* CONTENT */}
                <div className="p-10 space-y-8">

                  <div>
                    <p className="text-sm text-gray-500 mb-2">
                      Travel Guide • 5 min read
                    </p>

                    <h3 className="text-3xl font-semibold tracking-tight">
                      {selectedBlog.title}
                    </h3>
                  </div>

                  <p className="text-lg text-gray-800 leading-relaxed">
                    {selectedBlog.content}
                  </p>

                  {/* HIGHLIGHTS */}
                  <div>
                    <h4 className="font-semibold mb-4">Highlights</h4>
                    <ul className="space-y-3">
                      {selectedBlog.highlights.map((item, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="text-lg">•</span>
                          <span className="text-gray-800">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="h-px bg-gray-200"></div>

                  {/* TIPS */}
                  <div>
                    <h4 className="font-semibold mb-4">Pro Tips</h4>
                    <ul className="space-y-3">
                      {selectedBlog.tips.map((item, i) => (
                        <li key={i} className="flex gap-3">
                          <span className="text-lg">•</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
};

export default TestimonialsBlogs;