import React, { useState, useEffect, useRef } from "react";

/* ================================================= */
/* DATA                                              */
/* ================================================= */

const items = [
  {
    type: "testimonials",
    title: "Guest Stories",
    subtitle: "Real safari experiences",
    image: "/Animals/4zebras.jpeg",
    bg: "bg-[#F9F8F6]", // Softer, warmer luxury white
    button: "View Stories",
  },
  {
    type: "blog",
    blogIndex: 0,
    title: "Packing Guide",
    subtitle: "What to bring on safari",
    image: "/gallery/hotel-room.jpeg",
    bg: "bg-[#F9F8F6]",
    button: "Read Guide",
  },
  {
    type: "blog",
    blogIndex: 1,
    title: "Great Migration",
    subtitle: "Nature’s greatest event",
    image: "/Animals/3rhinos.jpeg",
    bg: "bg-[#F9F8F6]",
    button: "Explore",
  },
  {
    type: "blog",
    blogIndex: 2,
    title: "Luxury Lodges",
    subtitle: "Stay in the wild",
    image: "/gallery/hotel2.jpeg",
    bg: "bg-[#F9F8F6]",
    button: "Discover",
  },
];

const testimonials = [
  {
    name: "Vincent A.",
    quote: "Absolutely breathtaking experience in the Masai Mara! The guides were incredibly knowledgeable.",
    avatar: "ecommerce.png",
  },
  {
    name: "Anastasia Wokoli",
    quote: "Afribide tailored our trip perfectly. The luxury lodges exceeded all expectations.",
    avatar: "camera1.webp",
  },
  {
    name: "David & Emma",
    quote: "A seamless and unforgettable honeymoon in the Serengeti.",
    avatar: "/gallery/jeep.jpeg",
  },
];

const blogs = [
  {
    type: "packing",
    title: "What to Pack for Your First Safari",
    content: "Preparation is everything when heading into the wild. Packing smart ensures comfort, safety, and the best possible viewing experience. Remember, light aircraft flights often have strict 15kg (33lbs) luggage limits.",
    highlights: [
      "Neutral-colored clothing blends with nature",
      "Layered outfits handle temperature shifts",
      "Binoculars & zoom camera improve viewing",
    ],
    tips: ["Avoid bright colors (especially blue/black)", "Pack light but versatile in soft-sided bags"],
    image: "/goose.jpeg",
    gallery: ["/parachute.jpeg", "/parachute.jpeg"],
    checklist: [
      { category: "Clothing", items: ["3-4 moisture-wicking t-shirts", "2 long-sleeve shirts", "Fleece jacket", "Walking boots"] },
      { category: "Gear & Tech", items: ["Binoculars (8x42)", "Camera with 300mm+ lens", "Universal adaptor", "Headlamp"] },
      { category: "Health & Docs", items: ["Yellow Fever Certificate", "Malaria Prophylaxis", "High SPF Sunscreen", "Passport & e-Visas"] }
    ]
  },
  {
    type: "migration",
    title: "The Great Migration Explained",
    content: "Over a million wildebeest, accompanied by hundreds of thousands of zebras and gazelles, move across the Serengeti-Mara ecosystems in a continuous, endless cycle driven by rainfall and fresh grass.",
    highlights: [
      "Over 1.5M animals migrate yearly",
      "Best seen in Serengeti & Masai Mara",
    ],
    tips: ["River crossings are best seen July–October", "Book camps 9-12 months in advance"],
    image: "/zebra.jpeg",
    gallery: ["/parachute.jpeg", "/parachute.jpeg"],
    timeline: [
      { period: "Jan - Mar", event: "Calving season in the southern Serengeti. Predators are highly active." },
      { period: "Apr - Jun", event: "The herds move north and west in long columns as the rut begins." },
      { period: "Jul - Oct", event: "Dramatic Mara River crossings. The herds arrive in the Masai Mara." },
      { period: "Nov - Dec", event: "Short rains begin, and the herds travel back south." }
    ]
  },
  {
    type: "lodges",
    title: "Top 5 Luxury Lodges",
    content: "Luxury lodges redefine comfort in the middle of nature. Experience the untamed wilderness during the day, and retreat to world-class elegance, fine dining, and unparalleled service by night.",
    highlights: [
      "Infinity pools overlooking active waterholes",
      "Private viewing decks & open-air bathtubs",
    ],
    tips: ["Choose private conservancies for night drives", "Check seasonal pricing (Green season is cheaper)"],
    image: "/parachute.jpeg",
    gallery: ["parachute.jpeg", "parachute.jpeg", "parachute.jpeg"],
    amenities: [
      "Private Plunge Pools", "Personal Butlers", "Spa & Wellness", 
      "Gourmet Bush Dinners", "Open-air Showers", "High-speed Wi-Fi", 
      "Premium Bar & Cellar"
    ]
  },
];

/* ================================================= */
/* COMPONENT                                         */
/* ================================================= */

const SafariGrid = () => {
  const [active, setActive] = useState(null);
  const [visible, setVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (active) {
      setVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [active]);

  useEffect(() => {
    let interval;
    if (isPlaying && !active) {
      interval = setInterval(() => {
        const nextSlide = (currentSlide + 1) % items.length;
        scrollToSlide(nextSlide);
      }, 5000); // Slowed down slightly for a more relaxed, premium feel
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentSlide, active]);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => setActive(null), 400); // Matched with slower CSS transition
  };

  const scrollToSlide = (index) => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const slideWidth = container.scrollWidth / items.length;
    container.scrollTo({
      left: slideWidth * index,
      behavior: "smooth",
    });
    setCurrentSlide(index);
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollPosition = container.scrollLeft;
    const slideWidth = container.scrollWidth / items.length;
    const newIndex = Math.round(scrollPosition / slideWidth);
    if (newIndex !== currentSlide) {
      setCurrentSlide(newIndex);
    }
  };

 return (
    // Changed to 100dvh so it strictly fits the mobile viewport perfectly
    <section className="bg-[#FAF9F6] min-h-[100dvh] py-4 md:py-16 relative flex flex-col justify-center font-sans">
      
      {/* CAROUSEL CONTAINER */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory px-4 md:px-[10vw] gap-6 pb-6 pt-4 
                   [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full"
      >
        {items.map((item, index) => (
          <div
            key={index}
            // 1. Added `isolate` to fix z-index layering
            // 2. Switched mobile height to a fluid `h-[65vh] max-h-[420px]`
            className={`group snap-center shrink-0 w-[90vw] md:w-[75vw] max-w-[1100px] h-[65vh] min-h-[380px] max-h-[420px] md:max-h-none md:h-[560px] 
            overflow-hidden flex flex-col md:flex-row relative rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] 
            transition-shadow duration-500 hover:shadow-[0_8px_40px_rgb(0,0,0,0.08)] bg-white isolate`}
          >
            {/* TEXT AREA */}
            <div className="absolute bottom-0 left-0 w-full h-[85%] md:h-full md:relative md:w-1/2 flex flex-col justify-end md:justify-center items-start p-6 md:p-14 z-10 gap-4 md:gap-6 
                            bg-gradient-to-t from-white via-white/90 to-transparent md:bg-gradient-to-r md:from-white md:via-white/90 md:to-white/10">
              <div className="space-y-2 md:space-y-3">
                <p className="text-[10px] md:text-sm tracking-[0.2em] text-[#A67C52] uppercase font-semibold">
                  {item.subtitle}
                </p>
                <h2 className="text-3xl md:text-6xl font-serif text-neutral-900 leading-tight">
                  {item.title}
                </h2>
              </div>

              <button
                onClick={() => setActive(item)}
                className="mt-2 md:mt-4 px-6 md:px-8 py-3 rounded-full bg-neutral-900 text-white text-xs md:text-sm tracking-wide uppercase font-medium transition-all duration-300 hover:bg-[#A67C52] hover:shadow-lg active:scale-95"
              >
                {item.button}
              </button>
            </div>

            {/* IMAGE AREA */}
            {/* Fixed z-index (z-0 instead of -z-10) and forced inset-0 on mobile */}
            <div className="absolute inset-0 w-full h-full md:relative md:flex-1 z-0 overflow-hidden bg-[#F2F0EA]">
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
              />
            </div>
          </div>
        ))}
      </div>

      {/* REFINED PAGINATION */}
      <div className="flex justify-center items-center gap-6 mt-0 md:mt-4">
        <div className="flex items-center gap-3">
          {items.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-500 ease-out ${
                currentSlide === index ? "bg-neutral-800 w-8" : "bg-neutral-300 w-2 hover:bg-neutral-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <div className="w-px h-4 bg-neutral-300" /> {/* Elegant separator */}

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-neutral-500 hover:text-neutral-900 transition-colors p-2"
          aria-label={isPlaying ? "Pause autoplay" : "Start autoplay"}
        >
          {isPlaying ? (
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg className="w-4 h-4 fill-current ml-0.5" viewBox="0 0 24 24">
              <path d="M6 4l14 8-14 8z" />
            </svg>
          )}
        </button>
      </div>

      {/* LUXURY MODAL */}
      {active && (
        <div
          onClick={handleClose}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${visible ? "opacity-100 bg-neutral-900/40 backdrop-blur-md" : "opacity-0 bg-neutral-900/0 backdrop-blur-none"}`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full max-w-5xl max-h-[90vh] bg-white overflow-hidden flex flex-col shadow-[0_20px_50px_rgba(0,0,0,0.1)]
            transform transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] rounded-3xl
            ${
              visible
                ? "opacity-100 translate-y-0 scale-100"
                : "opacity-0 translate-y-12 scale-[0.95]"
            }`}
          >
            {/* CLOSE BUTTON */}
            <button
              onClick={handleClose}
              className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm w-12 h-12 rounded-full hover:bg-neutral-100 hover:rotate-90 transition-all duration-300 shadow-sm flex items-center justify-center z-20 text-neutral-800"
            >
              <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M1 1L13 13M1 13L13 1" />
              </svg>
            </button>

            {/* SCROLLABLE CONTENT */}
            <div className="overflow-y-auto w-full h-full pb-16 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-neutral-200 [&::-webkit-scrollbar-thumb]:rounded-full">
              
              {/* TESTIMONIALS LAYOUT */}
              {active.type === "testimonials" && (
                <div className="p-10 md:p-16 space-y-12">
                  <div className="text-center space-y-4 mb-8">
                    <p className="text-sm tracking-[0.2em] text-[#A67C52] uppercase font-semibold">Testimonials</p>
                    <h3 className="text-4xl md:text-5xl font-serif text-neutral-900">
                      What Our Guests Say
                    </h3>
                  </div>
                  
                  <div className="grid gap-8 md:grid-cols-2">
                    {testimonials.map((t, i) => (
                      <div key={i} className="relative bg-[#FAF9F6] p-10 rounded-[2rem] flex flex-col gap-6 overflow-hidden group hover:bg-white hover:shadow-xl transition-all duration-500 border border-neutral-100">
                        {/* Giant decorative quote */}
                        <span className="absolute -top-4 -left-2 text-9xl text-neutral-200/50 font-serif leading-none select-none group-hover:text-[#A67C52]/10 transition-colors duration-500">
                          "
                        </span>
                        
                        <p className="relative text-neutral-700 text-xl font-serif italic leading-relaxed z-10">
                          "{t.quote}"
                        </p>
                        <div className="flex items-center gap-4 mt-auto pt-6 border-t border-neutral-200/60 relative z-10">
                          <img
                            src={t.avatar}
                            alt={t.name}
                            className="w-14 h-14 rounded-full object-cover bg-neutral-200 shadow-sm"
                          />
                          <div>
                            <span className="block font-semibold text-neutral-900">{t.name}</span>
                            <span className="block text-xs text-neutral-500 tracking-wider uppercase mt-0.5">Verified Guest</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* RICH BLOG LAYOUT */}
              {active.type === "blog" && (
                <div className="flex flex-col">
                  {/* Hero Image */}
                  <div className="relative h-80 md:h-[28rem] w-full">
                    <img
                      src={blogs[active.blogIndex].image}
                      alt={blogs[active.blogIndex].title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-10 left-10 md:bottom-16 md:left-16 space-y-4">
                      <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-white text-xs tracking-widest uppercase font-medium">
                        {active.subtitle}
                      </span>
                      <h3 className="text-4xl md:text-6xl font-serif text-white max-w-3xl leading-tight">
                        {blogs[active.blogIndex].title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-8 md:p-16 max-w-5xl mx-auto space-y-16 w-full">
                    {/* Intro Text */}
                    <p className="text-neutral-600 text-xl md:text-2xl leading-relaxed font-light">
                      {blogs[active.blogIndex].content}
                    </p>

                    {/* DYNAMIC SECTION: PACKING CHECKLIST */}
                    {blogs[active.blogIndex].type === "packing" && (
                      <div className="space-y-8">
                        <h4 className="text-3xl font-serif text-neutral-900">Essential Checklist</h4>
                        <div className="grid md:grid-cols-3 gap-6">
                          {blogs[active.blogIndex].checklist.map((list, idx) => (
                            <div key={idx} className="bg-[#FAF9F6] p-8 rounded-3xl border border-neutral-100">
                              <h5 className="font-sans text-sm tracking-widest uppercase text-[#A67C52] mb-6 font-semibold">{list.category}</h5>
                              <ul className="space-y-4">
                                {list.items.map((item, i) => (
                                  <li key={i} className="flex items-start gap-4 text-neutral-700">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#A67C52] mt-2 flex-shrink-0" />
                                    <span className="text-base leading-snug font-light">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* DYNAMIC SECTION: MIGRATION TIMELINE */}
                    {blogs[active.blogIndex].type === "migration" && (
                      <div className="space-y-8">
                        <h4 className="text-3xl font-serif text-neutral-900">Migration Timeline</h4>
                        <div className="flex flex-col gap-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-neutral-200 before:to-transparent">
                          {blogs[active.blogIndex].timeline.map((event, idx) => (
                            <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-[#A67C52] text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 absolute left-0 md:left-1/2 z-10">
                                <span className="w-2 h-2 bg-white rounded-full"></span>
                              </div>
                              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-[#FAF9F6] p-6 rounded-3xl border border-neutral-100 shadow-sm ml-16 md:ml-0 hover:-translate-y-1 transition-transform duration-300">
                                <span className="font-sans text-sm tracking-widest uppercase text-[#A67C52] font-semibold mb-2 block">{event.period}</span>
                                <p className="text-neutral-700 font-light">{event.event}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* DYNAMIC SECTION: LODGE AMENITIES */}
                    {blogs[active.blogIndex].type === "lodges" && (
                      <div className="space-y-8">
                        <h4 className="text-3xl font-serif text-neutral-900">Luxury Amenities</h4>
                        <div className="flex flex-wrap gap-4">
                          {blogs[active.blogIndex].amenities.map((amenity, idx) => (
                            <span key={idx} className="px-6 py-3 bg-white border border-neutral-200 text-neutral-600 rounded-full text-sm font-medium shadow-sm hover:border-[#A67C52] hover:text-[#A67C52] transition-colors cursor-default">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* TWO-COLUMN INFO */}
                    <div className="grid md:grid-cols-2 gap-8 bg-neutral-900 rounded-[2rem] p-8 md:p-12 text-white shadow-xl">
                      <div>
                        <h4 className="font-serif text-2xl mb-6 text-white/90">Key Highlights</h4>
                        <ul className="space-y-4 text-white/70 font-light">
                          {blogs[active.blogIndex].highlights.map((h, i) => (
                            <li key={i} className="flex gap-4 items-start">
                              <span className="text-[#A67C52] font-bold mt-0.5">—</span> {h}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-serif text-2xl mb-6 text-white/90">Insider Tips</h4>
                        <ul className="space-y-4 text-white/70 font-light">
                          {blogs[active.blogIndex].tips.map((t, i) => (
                            <li key={i} className="flex gap-4 items-start">
                              <span className="text-[#A67C52] font-bold mt-0.5">—</span> {t}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* IMAGE GALLERY */}
                    {blogs[active.blogIndex].gallery && (
                      <div className="grid grid-cols-2 gap-4 md:gap-6">
                        {blogs[active.blogIndex].gallery.map((img, idx) => (
                          <div key={idx} className={`overflow-hidden rounded-3xl ${idx === 2 ? 'col-span-2 md:col-span-1' : ''}`}>
                            <img 
                              src={img} 
                              alt="Gallery detail" 
                              className="w-full h-64 md:h-96 object-cover hover:scale-105 transition-transform duration-700 ease-out"
                            />
                          </div>
                        ))}
                      </div>
                    )}
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