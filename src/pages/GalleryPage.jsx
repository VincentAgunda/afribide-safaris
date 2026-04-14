import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronLeft, ChevronRight, X } from "lucide-react";

/* ------------------ Configuration ------------------ */
const galleryData = [
  { id: 1, src: "/majestic-elephant.png", category: "Wildlife", title: "Majestic Elephant.", bgColor: "bg-[#000000]", textColor: "text-white" },
  { id: 2, src: "/RhinoT.png", category: "Exploration", title: "Venture into the wild.", bgColor: "bg-[#1d1d1f]", textColor: "text-white" },
  { id: 3, src: "/cheetahT.png", category: "Speed", title: "The fastest on land.", bgColor: "bg-[#F5F5F7]", textColor: "text-black" },
  { id: 4, src: "/parachute.png", category: "Lodges", title: "Rest in luxury.", bgColor: "bg-[#FAFAFA]", textColor: "text-black" },
  { id: 5, src: "/horizonT.png", category: "Landscape", title: "Endless horizons.", bgColor: "bg-[#F5F5F7]", textColor: "text-black" },
  { id: 6, src: "/mud-rhinoT.png", category: "Predators", title: "Silent hunters.", bgColor: "bg-[#000000]", textColor: "text-white" },
  { id: 7, src: "/gooseT.png", category: "Avian", title: "Masters of the sky.", bgColor: "bg-[#FAFAFA]", textColor: "text-black" },
  { id: 8, src: "/jeep.png", category: "Safari", title: "Journey together.", bgColor: "bg-[#1d1d1f]", textColor: "text-white" },
];

/* ------------------ Physics Config ------------------ */
// Highly optimized spring for mobile fluid transitions
const smoothSpring = {
  type: "spring",
  stiffness: 280,
  damping: 28,
  mass: 0.8,
};

/* ===========================
   Apple Style Safari Gallery
=========================== */
const SafariPhotoGallery = () => {
  const scrollContainerRef = useRef(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  // Lock body scroll when lightbox is open
  useEffect(() => {
    if (selectedPhoto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedPhoto]);

  // Optimized scroll function
  const scroll = useCallback((direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth > 768 ? 420 : clientWidth * 0.85; 
      const scrollTo = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({ 
        left: scrollTo, 
        behavior: "smooth" 
      });
    }
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-white min-h-screen font-sans antialiased overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={smoothSpring}
            className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] tracking-tight"
          >
            The Wild in Focus.
          </motion.h2>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overscroll-x-contain [-webkit-overflow-scrolling:touch]"
          >
            {galleryData.map((item) => (
              <motion.div
                key={item.id}
                layoutId={`card-${item.id}`} // Links entire card for layout animation
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={smoothSpring}
                className={`relative flex-shrink-0 w-[85vw] sm:w-[320px] md:w-[400px] h-[500px] rounded-[2rem] overflow-hidden snap-start ${item.bgColor} shadow-sm border border-gray-100`}
              >
                {/* Text Content */}
                <motion.div 
                  layoutId={`text-container-${item.id}`}
                  className={`absolute top-8 left-8 right-8 z-20 ${item.textColor}`}
                >
                  <span className="block text-sm font-semibold mb-2">
                    {item.category}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-semibold tracking-tight leading-tight w-4/5">
                    {item.title}
                  </h3>
                </motion.div>

                {/* Floating Image */}
                <div className="absolute inset-x-0 bottom-0 top-32 flex justify-center items-end p-6 z-10 pointer-events-none">
                  <motion.img
                    layoutId={`image-${item.id}`} // Independent layout transition for the image
                    src={item.src}
                    alt={item.title}
                    decoding="async"
                    loading="lazy"
                    className="w-full h-full object-contain object-bottom transition-transform duration-700 hover:scale-105"
                  />
                </div>

                {/* Plus Button */}
                <button 
                  onClick={() => setSelectedPhoto(item)}
                  className="absolute bottom-6 right-6 z-30 w-10 h-10 bg-white rounded-full flex items-center justify-center text-black shadow-[0_2px_10px_rgba(0,0,0,0.1)] hover:scale-105 hover:bg-gray-50 transition-all duration-200"
                  aria-label="View Details"
                >
                  <Plus size={24} strokeWidth={2.5} />
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <div className="flex justify-end gap-4 mt-2 pr-2">
          <button 
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full bg-[#e8e8ed] text-[#1d1d1f] flex items-center justify-center hover:bg-[#d2d2d7] transition-colors active:scale-95"
            aria-label="Scroll Left"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full bg-[#e8e8ed] text-[#1d1d1f] flex items-center justify-center hover:bg-[#d2d2d7] transition-colors active:scale-95"
            aria-label="Scroll Right"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8">
            {/* Background Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelectedPhoto(null)}
              className="absolute inset-0 backdrop-blur-xl bg-black/80"
            />

            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: 0.1 }}
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 z-[60] w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 backdrop-blur-md transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </motion.button>

            {/* Modal Card */}
            <motion.div 
              layoutId={`card-${selectedPhoto.id}`} // Matches the parent card thumbnail
              transition={smoothSpring}
              className={`relative max-w-2xl w-full rounded-[2rem] p-8 md:p-12 overflow-hidden shadow-2xl z-50 ${selectedPhoto.bgColor} ${selectedPhoto.textColor}`}
            >
              <motion.div layoutId={`text-container-${selectedPhoto.id}`} className="relative z-20">
                <span className="block text-sm font-semibold mb-2 opacity-80">
                  {selectedPhoto.category}
                </span>
                <h3 className="text-3xl md:text-5xl font-semibold tracking-tight mb-8">
                  {selectedPhoto.title}
                </h3>
              </motion.div>
              
              <div className="w-full flex justify-center relative z-10 mt-4">
                <motion.img
                  layoutId={`image-${selectedPhoto.id}`} // Matches the thumbnail image layoutId
                  transition={smoothSpring}
                  src={selectedPhoto.src}
                  alt={selectedPhoto.title}
                  className="max-h-[55vh] object-contain drop-shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SafariPhotoGallery;