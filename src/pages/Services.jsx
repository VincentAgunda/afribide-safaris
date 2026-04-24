import React, { useState, useEffect } from "react";

/* ================================================= */
/* DATA                                              */
/* ================================================= */

const items = [
  {
    type: "testimonials",
    title: "Guest Stories",
    subtitle: "Real safari experiences.",
    image: "/Animals/4zebras.jpeg",
    bg: "bg-[#f5f5f7]",
    button: "View Stories",
  },
  {
    type: "blog",
    blogIndex: 0,
    title: "Packing Guide",
    subtitle: "What to bring on safari.",
    image: "/gallery/hotel-room.jpeg",
    bg: "bg-[linear-gradient(90deg,#e5e5e7_0%,#e5e5e7_40%,#f6a96b_75%,#e67e22_100%)]",
    button: "Read",
  },
  {
    type: "blog",
    blogIndex: 1,
    title: "Great Migration",
    subtitle: "Nature’s greatest event.",
    image: "/Animals/3rhinos.jpeg",
    bg: "bg-[#f5f5f7]",
    button: "Explore",
  },
  {
    type: "blog",
    blogIndex: 2,
    title: "Luxury Lodges",
    subtitle: "Stay in the wild.",
    image: "/gallery/hotel2.jpeg",
    bg: "bg-[#f5f5f7]",
    button: "Discover",
  },
];

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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (active) {
      setVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [active]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => setActive(null), 260);
  };

  return (
    <section className="bg-[#e5e5e5] min-h-screen py-8 px-4">
      {/* GRID */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-5">
        {items.map((item, index) => (
          <div
            key={index}
            className={`h-[440px] md:h-[520px] rounded-2xl overflow-hidden flex flex-col justify-between items-center text-center ${item.bg}
            transition-transform duration-300 ease-out hover:scale-[1.015]`}
          >
            {/* TEXT */}
            <div className="pt-10 px-6">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                {item.title}
              </h2>

              <p className="text-gray-600 mt-2 text-sm md:text-base">
                {item.subtitle}
              </p>

              <button
                onClick={() => setActive(item)}
                className="mt-5 px-5 py-2 rounded-full bg-black text-white text-sm transition-opacity duration-200 hover:opacity-80"
              >
                {item.button}
              </button>
            </div>

            {/* IMAGE AREA (FIXED) */}
            <div className="w-full flex justify-center items-end h-[55%] pb-6 px-8">
              <img
                src={item.image}
                alt=""
                loading="lazy"
                className="max-h-full w-auto object-contain rounded-xl"
              />
            </div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {active && (
        <div
          onClick={handleClose}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300
          ${visible ? "opacity-100 bg-black/40" : "opacity-0 bg-black/0"}`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl overflow-hidden flex flex-col
            transform transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${
              visible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-6 scale-[0.98]"
            }`}
          >
            {/* CLOSE */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 bg-gray-100 w-9 h-9 rounded-full hover:bg-gray-200 transition"
            >
              ✕
            </button>

            {/* CONTENT */}
            <div className="overflow-y-auto">
              {active.type === "testimonials" && (
                <div className="p-6 md:p-10 space-y-6">
                  <h3 className="text-xl md:text-2xl font-semibold">
                    What Our Guests Say
                  </h3>

                  {testimonials.map((t, i) => (
                    <div key={i} className="flex gap-4 items-center">
                      <img
                        src={t.avatar}
                        alt=""
                        className="w-12 h-12 md:w-14 md:h-14 rounded-full object-cover"
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

              {active.type === "blog" && (
                <div>
                  <img
                    src={blogs[active.blogIndex].image}
                    alt=""
                    className="h-52 md:h-64 w-full object-cover"
                  />

                  <div className="p-6 md:p-10 space-y-5">
                    <h3 className="text-xl md:text-2xl font-semibold">
                      {blogs[active.blogIndex].title}
                    </h3>

                    <p className="text-gray-700 text-sm md:text-base leading-relaxed">
                      {blogs[active.blogIndex].content}
                    </p>

                    <div>
                      <h4 className="font-semibold mb-2">Highlights</h4>
                      <ul className="space-y-2 text-sm md:text-base">
                        {blogs[active.blogIndex].highlights.map((h, i) => (
                          <li key={i}>• {h}</li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Tips</h4>
                      <ul className="space-y-2 text-sm md:text-base">
                        {blogs[active.blogIndex].tips.map((t, i) => (
                          <li key={i}>• {t}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SafariGrid;