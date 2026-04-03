import React, { 
  useRef, 
  useState, 
  useEffect, 
  useCallback 
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, X, ImageIcon, Map, Banknote, CheckCircle2, XCircle } from "lucide-react";

/* ------------------ Animation Config ------------------ */

const spring = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 1,
};

const fadeUp = {
  initial: { opacity: 0, y: 15 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }
};

/* ------------------ Card Styles & Data ------------------ */

const cardColors = [
  { bg: "#000000", text: "text-white", button: "light" },
  { bg: "#F5F5F7", text: "text-[#F5F5F7]", button: "light" },
  { bg: "#2C3E50", text: "text-white", button: "light" },
  { bg: "#FAFAFA", text: "text-[#F5F5F7]", button: "light" },
];

const generateGallery = (seed) => 
  Array.from({ length: 10 }).map((_, i) => `https://picsum.photos/seed/${seed}${i}/800/600`);

const safaris = [
  {
    id: 1,
    title: "The Ultimate Northern & Masai Mara Journey",
    category: "Kenya • 9 Days",
    image: "/parachute.jpeg",
    description: "An immersion into Kenya's most diverse wilderness ecosystems. From the remote landscapes of Samburu and Buffalo Springs, through the conservation strongholds of Ol Pejeta and Solio, and into the forested highlands of Aberdare. The journey concludes in the legendary Masai Mara.",
    gallery: generateGallery("samburu"),
    itinerary: [
      { day: "Day 1", title: "Nairobi to Samburu", desc: "Depart Nairobi and drive north through central highlands. Arrive at Samburu National Reserve for lunch and an afternoon game drive." },
      { day: "Day 2", title: "Full Day Samburu", desc: "Explore Samburu and Buffalo Springs. Look out for the 'Samburu Special Five'." },
      { day: "Day 3", title: "Samburu to Ol Pejeta", desc: "Journey south to Ol Pejeta Conservancy. Enjoy an afternoon game drive and visit the chimpanzee sanctuary." },
      { day: "Day 4", title: "Ol Pejeta to Aberdare", desc: "Transition to the lush forests and cool mountain air of Aberdare." },
      { day: "Day 5", title: "Aberdare to Solio", desc: "Proceed to Solio Game Reserve, a private sanctuary offering great rhino viewing." },
      { day: "Day 6", title: "Solio to Lake Nakuru", desc: "Descend into the Great Rift Valley to Lake Nakuru National Park." },
      { day: "Day 7", title: "Lake Nakuru to Masai Mara", desc: "Journey to the Masai Mara. Enjoy your first game drive in the celebrated reserve." },
      { day: "Day 8", title: "Full Day Masai Mara", desc: "Optional early morning balloon safari. Spend the day exploring the vast plains." },
      { day: "Day 9", title: "Masai Mara to Nairobi", desc: "Begin your return journey to Nairobi, arriving in the afternoon." }
    ],
    pricing: [
      { title: "Jan - June", details: "2 Pax: Ksh 3555 Single / Ksh 3126 Double | 4 Pax: Ksh 3060 Single" },
      { title: "July - Dec", details: "2 Pax: Ksh 4135 Single / Ksh 3500 Double | 4 Pax: Ksh 3640 Single" }
    ],
    included: ["Full board accommodation", "Private 4x4 safari jeep", "Professional guide", "Park entry fees"],
    excluded: ["International flights", "Travel insurance", "Tips and gratuities", "Personal expenses"],
    ...cardColors[0],
  },
  {
    id: 2,
    title: "Kenya Signature Safari: 7 Days Iconic Parks",
    category: "Kenya • 7 Days",
    image: "/zebra.jpeg",
    description: "Experience the Best of Kenya. This journey gives you unforgettable wildlife encounters, breathtaking landscapes, and seamless comfort through the Masai Mara, Lake Nakuru, Hell's Gate, and Amboseli.",
    gallery: generateGallery("amboseli"),
    itinerary: [
      { day: "Day 1", title: "Nairobi to Masai Mara", desc: "Scenic drive descending into the Great Rift Valley. Afternoon game drive in the legendary Masai Mara." },
      { day: "Day 2", title: "Masai Mara Full Day", desc: "Full day game drive venturing deeper into the reserve. Encounter lions, elephants, cheetahs, and potentially the great migration." },
      { day: "Day 3", title: "Masai Culture & Lake Nakuru", desc: "Visit a traditional Maasai village in the morning. Continue to Lake Nakuru National Park to see endangered rhinos and birdlife." },
      { day: "Day 4", title: "Hell's Gate & Lake Naivasha", desc: "Explore Hell's Gate on foot or bicycle. Later, enjoy a guided boat ride on Lake Naivasha and a walk on Crescent Island." },
      { day: "Day 5", title: "Journey to Amboseli", desc: "Travel to Amboseli National Park. Enjoy breathtaking first views of Mount Kilimanjaro rising above the clouds." },
      { day: "Day 6", title: "Amboseli Full Day", desc: "Explore Amboseli's varied landscapes, encountering iconic elephant herds with the majestic Mount Kilimanjaro in the background." },
      { day: "Day 7", title: "Final Game Drive & Return", desc: "Early morning game drive to catch active predators. Return to Nairobi with unforgettable memories." }
    ],
    pricing: [
      { title: "Lodge Option (Based on 6 Pax)", details: "Ksh 2023 per person in a Double Room" },
      { title: "Midrange & Budget Hotel Option (Based on 6 Pax)", details: "Ksh 1728 per person in a Double Room" }
    ],
    included: ["Accommodation", "Transport in a safari vehicle", "Professional guide", "Park fees", "Meals as per itinerary", "Boat ride"],
    excluded: ["Flights", "Crescent Island fees", "Personal expenses", "Tips and gratuities", "Travel insurance"],
    ...cardColors[1],
  },
  {
    id: 3,
    title: "Kenya Signature Safari: 8 Days Iconic Parks",
    category: "Kenya • 8 Days",
    image: "/parachute.jpeg",
    description: "An extended exploration of Kenya's iconic parks. Spend extra time immersing yourself in the Masai Mara before venturing to Lake Nakuru, Naivasha, and the elephant-rich plains of Amboseli.",
    gallery: generateGallery("nakuru"),
    itinerary: [
      { day: "Day 1", title: "Nairobi to Masai Mara", desc: "Set off from Nairobi into the Great Rift Valley. Arrive for an afternoon game drive in the Masai Mara." },
      { day: "Day 2 & 3", title: "Masai Mara Immersion", desc: "Two full days dedicated to experiencing the richness of the Masai Mara without limits. Witness dramatic predator-prey interactions across the savannah." },
      { day: "Day 4", title: "Masai Culture & Lake Nakuru", desc: "Morning visit to a Maasai village. Journey to Lake Nakuru National Park for close encounters with rhinos and flamingos." },
      { day: "Day 5", title: "Hell's Gate & Lake Naivasha", desc: "Active exploration: cycle or walk through Hell's Gate. Relax with a boat ride on Lake Naivasha and a wildlife walk on Crescent Island." },
      { day: "Day 6", title: "Journey to Amboseli", desc: "Transfer south toward Amboseli National Park, getting your first glimpses of Mount Kilimanjaro." },
      { day: "Day 7", title: "Amboseli Wildlife", desc: "Full day game drive beneath Kilimanjaro. Traverse swamps and plains alongside massive elephant herds." },
      { day: "Day 8", title: "Return to Nairobi", desc: "Final early morning game drive before heading back to Nairobi to conclude your safari." }
    ],
    pricing: [
      { title: "Lodge Option (Based on 6 Pax)", details: "Ksh 2390 per person in a Double Room" },
      { title: "Midrange & Budget Hotel Option (Based on 6 Pax)", details: "Ksh 2030 per person in a Double Room" }
    ],
    included: ["Accommodation", "Transport in a safari vehicle", "Professional guide", "Park fees", "Meals as per itinerary", "Boat ride"],
    excluded: ["Flights", "Crescent Island fees", "Personal expenses", "Tips and gratuities", "Travel insurance"],
    ...cardColors[2],
  },
  {
    id: 4,
    title: "The Ultimate Bush & Beach Escape",
    category: "Kenya • 8 Days",
    image: "/goose.jpeg",
    description: "A seamless blend of Kenya’s most iconic safari destinations and its breathtaking coastline. Journey from the Masai Mara to Amboseli, concluding on the pristine shores of Diani Beach.",
    gallery: generateGallery("diani"),
    itinerary: [
      { day: "Day 1", title: "Nairobi to Masai Mara", desc: "Scenic drive via the Great Rift Valley. Afternoon game drive in the Mara as the golden light settles over the plains." },
      { day: "Day 2", title: "Masai Mara Full Day", desc: "Optional hot air balloon ride. Spend the day exploring the ecosystem, encountering big cats, and visiting the Mara River." },
      { day: "Day 3", title: "Masai Mara to Lake Nakuru", desc: "Drive through dramatic Rift Valley landscapes to Lake Nakuru. Late afternoon arrival and evening leisure." },
      { day: "Day 4", title: "Lake Nakuru to Amboseli", desc: "Morning game drive in Nakuru known for its rhinos. Depart for Amboseli, arriving in the evening under Kilimanjaro's shadow." },
      { day: "Day 5", title: "Amboseli Full Day", desc: "Game drives across swamps and plains, viewing large elephant herds against the dramatic backdrop of Mount Kilimanjaro." },
      { day: "Day 6", title: "Amboseli to Diani Beach", desc: "Transfer to Emali for the scenic SGR train journey to the coast. Arrive at the white sands and turquoise waters of Diani Beach." },
      { day: "Day 7", title: "Diani Beach Relaxation", desc: "A full day dedicated entirely to coastal bliss. Enjoy the resort facilities, the beach, or optional water activities." },
      { day: "Day 8", title: "Departure", desc: "Transfer to Ukunda Airport or Mombasa SGR station for your return journey to Nairobi." }
    ],
    pricing: [
      { title: "Jan to June", details: "Ksh 3200 Single / Ksh 2460 Double (Per Person)" },
      { title: "July to November", details: "Ksh 3562 Single / Ksh 2800 Double (Per Person)" },
      { title: "December", details: "Ksh 4300 Single / Ksh 3257 Double (Per Person)" }
    ],
    included: ["Full board accommodation on safari / All-Inclusive at beach", "Transport in a 4x4 safari jeep with pop-up roof", "Professional English-speaking driver-guide", "All park entry fees and government taxes", "Game drives", "Bottled drinking water", "SGR Tickets", "Airport transfers"],
    excluded: ["International flights", "Travel insurance", "Tips and gratuities", "Personal expenses", "Optional activities (balloon safari, Maasai village, boat rides)"],
    ...cardColors[3],
  },
];

/* ===========================
   Modal (Gallery Expansion)
=========================== */

const SafariModal = ({ item, onClose }) => {
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);

  const tabs = [
    { id: "overview", label: "Overview", icon: ImageIcon },
    { id: "itinerary", label: "Itinerary", icon: Map },
    { id: "pricing", label: "Pricing & Details", icon: Banknote },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 font-sans antialiased"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        onClick={onClose}
        className="absolute inset-0 bg-black/40 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      />

      <motion.div
        layoutId={`card-${item.id}`}
        transition={spring}
        className="relative z-10 w-full max-w-5xl h-full max-h-[85vh] flex flex-col rounded-[2rem] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.3)] bg-white"
      >
        <motion.button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full
                     bg-white/20 backdrop-blur-xl border border-white/20 text-white
                     flex items-center justify-center hover:bg-white/30 transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <X size={20} strokeWidth={2.5} />
        </motion.button>

        <div className="overflow-y-auto w-full h-full scrollbar-none pb-12">
          
          <motion.div
            layoutId={`image-${item.id}`}
            className="h-[250px] sm:h-[350px] w-full relative shrink-0 overflow-hidden"
            style={{ backgroundColor: item.bg }}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 p-6 sm:p-8 text-white w-full max-w-3xl">
              {/* MODAL CATEGORY DISPLAY ADDED HERE */}
              <motion.span 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="block text-sm sm:text-base font-semibold uppercase tracking-[0.2em] mb-2 sm:mb-3 text-white/90"
              >
                {item.category}
              </motion.span>

              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1]"
              >
                {item.title}
              </motion.h3>
            </div>
          </motion.div>

          <div className="sticky top-0 z-20 bg-white/90 backdrop-blur-md border-b border-gray-200/60 px-4 sm:px-8 pt-4 pb-0 flex gap-2 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="relative px-4 py-3 text-sm font-semibold transition-colors whitespace-nowrap outline-none"
                >
                  {isActive && (
                    <motion.div
                      layoutId="active-tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#1d1d1f] rounded-t-full"
                      transition={spring}
                    />
                  )}
                  <span className={`relative z-10 flex items-center gap-2 ${isActive ? "text-[#1d1d1f]" : "text-gray-400 hover:text-gray-700"}`}>
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    {tab.label}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="px-4 sm:px-8 py-8 max-w-5xl mx-auto min-h-[300px]">
            <AnimatePresence mode="wait">
              {activeTab === "overview" && (
                <motion.div key="overview" {...fadeUp} className="max-w-4xl">
                  <p className="text-lg sm:text-xl text-[#545454] font-medium leading-relaxed tracking-tight mb-8">
                    {item.description}
                  </p>
                  
                  <h4 className="text-xl font-bold tracking-tight text-[#1d1d1f] mb-4">Gallery Highlights</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                    {item.gallery.map((imgUrl, idx) => (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.03, y: -3 }}
                        transition={spring}
                        className="aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 shadow-sm ring-1 ring-black/5"
                      >
                        <img 
                          src={imgUrl} 
                          alt={`${item.title} gallery ${idx + 1}`} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "itinerary" && (
                <motion.div key="itinerary" {...fadeUp} className="max-w-3xl mx-auto">
                  <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gray-200">
                    {item.itinerary.map((day, idx) => (
                      <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#1d1d1f] text-white shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform duration-300 hover:scale-110">
                          <span className="text-xs font-bold tracking-tighter">{day.day.replace('Day ', '')}</span>
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_15px_rgba(0,0,0,0.03)] hover:shadow-[0_6px_25px_rgba(0,0,0,0.06)] transition-shadow duration-300">
                          <span className="inline-block px-3 py-1 bg-gray-100 text-gray-800 text-[10px] font-bold uppercase tracking-wider rounded-full mb-3">
                            {day.day}
                          </span>
                          <h4 className="text-lg font-bold text-[#1d1d1f] tracking-tight mb-2">{day.title}</h4>
                          <p className="text-[#86868b] text-sm leading-relaxed">{day.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "pricing" && (
                <motion.div key="pricing" {...fadeUp} className="grid lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-7 space-y-6">
                    <div>
                      <h4 className="text-2xl font-bold tracking-tight text-[#1d1d1f] mb-4 flex items-center gap-3">
                        <div className="p-2 bg-green-50 rounded-xl"><Banknote className="text-green-600" size={20} /></div>
                        Package Pricing
                      </h4>
                      <div className="space-y-3">
                        {item.pricing.map((price, idx) => (
                          <div key={idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors duration-300">
                            <h5 className="text-base font-bold text-[#1d1d1f] tracking-tight mb-1">{price.title}</h5>
                            <p className="text-[#86868b] text-sm leading-relaxed">{price.details}</p>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-400 mt-4 font-medium">
                        * Rates are based on persons traveling in a private 4x4 safari vehicle.
                      </p>
                    </div>
                  </div>

                  <div className="lg:col-span-5 space-y-6">
                    <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                      <h4 className="text-lg font-bold tracking-tight text-[#1d1d1f] mb-4 flex items-center gap-2">
                        <CheckCircle2 className="text-green-500" size={18} /> Included
                      </h4>
                      <ul className="space-y-2">
                        {item.included.map((inc, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-[#86868b]">
                            <span className="text-green-500 mt-0.5">•</span> {inc}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
                      <h4 className="text-lg font-bold tracking-tight text-[#1d1d1f] mb-4 flex items-center gap-2">
                        <XCircle className="text-red-500" size={18} /> Not Included
                      </h4>
                      <ul className="space-y-2">
                        {item.excluded.map((exc, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-[#86868b]">
                            <span className="text-red-400 mt-0.5">✕</span> {exc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

/* ===========================
   Main Gallery Component
=========================== */

const SafariGalleryPage = () => {
  const carouselRef = useRef(null);
  const [active, setActive] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const cardRefs = useRef([]);

  const scrollToIndex = useCallback((index) => {
    const container = carouselRef.current;
    const card = cardRefs.current[index];
    if (!container || !card) return;

    container.scrollTo({
      left: card.offsetLeft - 24, 
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const container = carouselRef.current;
    if (!container) return;
    let raf;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const scrollLeft = container.scrollLeft;
        let closestIndex = 0;
        let minDistance = Infinity;

        cardRefs.current.forEach((card, i) => {
          if(!card) return;
          const distance = Math.abs(card.offsetLeft - 24 - scrollLeft);
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = i;
          }
        });

        setActive(closestIndex);
      });
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    return () => container.removeEventListener("scroll", onScroll);
  }, []);

  const handlePrev = () => scrollToIndex(Math.max(0, active - 1));
  const handleNext = () => scrollToIndex(Math.min(safaris.length - 1, active + 1));

  return (
    <section className="py-16 sm:py-24 bg-[#F5F5F7] min-h-screen font-sans antialiased overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">

        <div className="text-center mb-12 sm:mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-medium text-[#002D62] tracking-tight mb-4"
          >
            Explore Afribide Safaris.
          </motion.h2>
          
        </div>

        <div className="relative">
          <div
            ref={carouselRef}
            className="overflow-x-auto scrollbar-none snap-x snap-mandatory flex gap-4 sm:gap-6 pb-12 px-4 sm:px-6 -mx-4 sm:-mx-6"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {safaris.map((item, i) => (
              <motion.div
                key={item.id}
                ref={(el) => (cardRefs.current[i] = el)}
                layoutId={`card-${item.id}`}
                whileHover={{ scale: 0.98 }}
                transition={spring}
                onClick={() => setSelectedItem(item)}
                className="snap-center shrink-0 relative rounded-[2rem] 
                           w-[85vw] sm:w-[350px] lg:w-[400px] h-[420px] sm:h-[500px] group cursor-pointer overflow-hidden
                           shadow-[0_10px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]
                           transition-shadow duration-500"
                style={{ backgroundColor: item.bg }}
              >
                {/* Overlay Text */}
                <div className={`absolute inset-0 p-6 sm:p-8 z-20 flex flex-col justify-between ${item.text} bg-gradient-to-b from-black/50 via-black/0 to-black/50`}>
                  <div className="max-w-[95%] pt-4">
                    {/* CARD CATEGORY DISPLAY ADDED HERE */}
                    <span className="block text-xs sm:text-sm font-semibold uppercase tracking-[0.2em] mb-2 sm:mb-3 opacity-90">
                      {item.category}
                    </span>
                    <h3 className="text-3xl sm:text-4xl font-bold tracking-tight leading-[1.05]">
                      {item.title}
                    </h3>
                  </div>
                  
                  <div className="opacity-0 translate-y-6 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out pb-4">
                    <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-5 py-3 rounded-full hover:bg-white/30 transition-colors">
                      View Details <ChevronRight size={16} />
                    </span>
                  </div>
                </div>

                <motion.div
                  layoutId={`image-${item.id}`}
                  className="absolute inset-0 z-10 pointer-events-none"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out"
                  />
                </motion.div>

                <motion.button
                  className={`absolute bottom-6 right-6 w-12 h-12 rounded-full z-30
                     flex items-center justify-center shadow-xl
                     opacity-0 group-hover:opacity-100 transition-opacity duration-500
                     ${item.button === "dark" ? "bg-[#1d1d1f] text-white" : "bg-white text-[#1d1d1f]"}`}
                >
                  <Plus size={24} strokeWidth={2.5} />
                </motion.button>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-2 px-4 sm:px-6">
            <div className="flex gap-3 order-2 sm:order-1">
              <button
                onClick={handlePrev}
                className="w-12 h-12 rounded-full bg-white border border-gray-200 text-[#1d1d1f]
                           flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
              >
                <ChevronLeft size={20} strokeWidth={2} />
              </button>
              <button
                onClick={handleNext}
                className="w-12 h-12 rounded-full bg-white border border-gray-200 text-[#1d1d1f]
                           flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all shadow-sm"
              >
                <ChevronRight size={20} strokeWidth={2} />
              </button>
            </div>

            <div className="flex space-x-2 order-1 sm:order-2 bg-gray-200/50 p-1.5 rounded-full backdrop-blur-sm">
              {safaris.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => scrollToIndex(idx)}
                  className={`h-2 rounded-full transition-all duration-500 ease-out ${
                    idx === active
                      ? "w-6 bg-[#1d1d1f]"
                      : "w-2 bg-gray-400 hover:bg-gray-600"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selectedItem && (
          <SafariModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
};

export default SafariGalleryPage;