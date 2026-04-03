import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* ================================================= */
/* DATA FOR TESTIMONIALS & BLOGS                     */
/* ================================================= */

const testimonials = [
  {
    name: "Vincent. A",
    quote:
      "Absolutely breathtaking experience in the Masai Mara! The guides were incredibly knowledgeable and made us feel safe the entire time.",
    avatar: "vincent.png",
  },
  {
    name: "Anastasia Wokoli",
    quote:
      "Afribide tailored our trip perfectly. The luxury lodges and the wildlife viewing exceeded all our expectations.",
    avatar: "camera2.webp",
  },
  {
    name: "David & Emma",
    quote:
      "A seamless and unforgettable honeymoon in the Serengeti. From the hot air balloon ride to the sunset drives, highly recommend!",
    avatar: "vincent.png",
  },
];

const blogs = [
  {
    title: "What to Pack for Your First Safari",
    excerpt:
      "Essential gear, clothing tips, and camera equipment to make your African adventure comfortable and memorable.",
    content:
      "Going on your first safari is a thrilling experience! Make sure you pack neutral-colored clothing to blend in with the environment. Layers are key, as early morning game drives can be freezing, while afternoons get blistering hot. Don't forget a high-quality pair of binoculars, a camera with a good zoom lens, and plenty of sunscreen. Finally, a sturdy pair of walking boots is essential for any guided bush walks.",
    image: "helicopter.jpeg",
  },
  {
    title: "The Great Migration Explained",
    excerpt:
      "Everything you need to know about the greatest wildlife spectacle on earth, including the best times and places to visit.",
    content:
      "The Great Migration is an ever-moving circular journey of over a million wildebeest, zebra, and gazelle across the Serengeti-Mara ecosystem. Timing is everything: visit the southern Serengeti from January to March for calving season, or head to the Masai Mara between July and October to witness the dramatic river crossings. It's a true testament to the raw, untamed beauty of nature.",
    image:
      "/zebra.jpeg",
  },
  {
    title: "Top 5 Luxury Lodges in Kenya",
    excerpt:
      "Experience the untamed wild without sacrificing an ounce of comfort at these stunning, eco-friendly luxury locations.",
    content:
      "Kenya offers some of the most spectacular luxury lodges in the world, seamlessly blending eco-conscious design with five-star comfort. Imagine infinity pools overlooking watering holes frequented by elephants, private plunge pools, and open-air spa treatments in the heart of the savannah. From the exclusive conservancies of Laikipia to the rolling plains of the Mara, these lodges redefine what it means to go 'glamping'.",
    image:
      "/parachute.jpeg",
  },
];

/* ================================================= */
/* MAIN COMPONENT                                    */
/* ================================================= */

const TestimonialsBlogs = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);

  const closeModal = () => setSelectedBlog(null);

  // Lock background scroll (Apple feel)
  useEffect(() => {
    document.body.style.overflow = selectedBlog ? "hidden" : "auto";
  }, [selectedBlog]);

  return (
    <section className="min-h-screen bg-[#dadada] py-20 font-sans text-black relative">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header (UNCHANGED) */}
        <div className="flex justify-center mb-20">
          <h1 className="border-[3px] border-black px-6 py-2 text-3xl md:text-4xl font-bold tracking-widest bg-transparent text-center uppercase">
            Testimonials & Blogs
          </h1>
        </div>

        {/* ======================================= */}
        {/* TESTIMONIALS */}
        {/* ======================================= */}
        <div className="mb-24">
          <h2 className="text-xl md:text-2xl font-bold mb-10 tracking-wide uppercase text-center md:text-left">
            What Our Guests Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="flex flex-col items-center text-center bg-white p-8 rounded-3xl shadow-md"
              >
                <div className="w-20 h-20 mb-6 rounded-full overflow-hidden border-2 border-black">
                  <img src={t.avatar} className="w-full h-full object-cover" />
                </div>
                <p className="italic text-gray-800 mb-6 flex-grow">
                  "{t.quote}"
                </p>
                <span className="text-sm font-bold uppercase tracking-wider">
                  - {t.name}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* ======================================= */}
        {/* BLOGS */}
        {/* ======================================= */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold mb-10 tracking-wide uppercase text-center md:text-left">
            Travel Guides & Stories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((blog, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="flex flex-col group bg-white rounded-3xl overflow-hidden shadow-md"
              >
                <div
                  className="w-full h-48 overflow-hidden cursor-pointer"
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
                  <h3 className="text-xl font-bold mb-3">
                    {blog.title}
                  </h3>

                  <p className="text-sm text-gray-700 mb-6 flex-grow">
                    {blog.excerpt}
                  </p>

                  {/* BUTTONS (KEPT + IMPROVED) */}
                  <div className="flex justify-between items-center mt-auto">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedBlog(blog)}
                      className="bg-black text-white px-5 py-2.5 rounded-full text-sm font-semibold shadow-md"
                    >
                      Read More
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedBlog(blog)}
                      className="w-10 h-10 rounded-full bg-gray-200 text-black flex items-center justify-center text-2xl"
                    >
                      +
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* ======================================= */}
      {/* APPLE-STYLE MODAL */}
      {/* ======================================= */}
      <AnimatePresence>
        {selectedBlog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, backdropFilter: "blur(10px)" }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, y: 40, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 20, opacity: 0 }}
              transition={{
                type: "spring",
                stiffness: 180,
                damping: 22,
              }}
              className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-[2rem] shadow-2xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close */}
              <button
                onClick={closeModal}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                ✕
              </button>

              {/* Scrollable Content */}
              <div className="overflow-y-auto scrollbar-hide">

                {/* Image */}
                <div className="w-full h-64 overflow-hidden">
                  <motion.img
                    src={selectedBlog.image}
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.8 }}
                  />
                </div>

                {/* Content */}
                <div className="p-8">
                  <h3 className="text-3xl font-bold mb-4 tracking-tight">
                    {selectedBlog.title}
                  </h3>

                  <div className="w-12 h-1 bg-black mb-6 rounded-full"></div>

                  <p className="text-gray-800 leading-relaxed text-lg">
                    {selectedBlog.content}
                  </p>
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