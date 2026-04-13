import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronLeft, ChevronRight, X } from "lucide-react";

/* ------------------ Configuration ------------------ */
// Expanded dataset with #F5F5F7 and #FAFAFA colors integrated.
// Ensure your image sources (.png) have transparent backgrounds for the floating effect.
const galleryData = [
  { 
    id: 1, 
    src: "/giraffeT.png", 
    category: "Wildlife", 
    title: "Majestic Elephant.", 
    bgColor: "bg-[#000000]", 
    textColor: "text-white" 
  },
  { 
    id: 2, 
    src: "/gooseT.png", 
    category: "Exploration", 
    title: "Venture into the wild.", 
    bgColor: "bg-[#1d1d1f]", 
    textColor: "text-white" 
  },
  { 
    id: 3, 
    src: "/giraffeT.png", 
    category: "Speed", 
    title: "The fastest on land.", 
    bgColor: "bg-[#F5F5F7]", 
    textColor: "text-black" 
  },
  { 
    id: 4, 
    src: "/parachute.png", 
    category: "Lodges", 
    title: "Rest in luxury.", 
    bgColor: "bg-[#FAFAFA]", 
    textColor: "text-black" 
  },
  { 
    id: 5, 
    src: "/giraffeT.png", 
    category: "Landscape", 
    title: "Endless horizons.", 
    bgColor: "bg-[#F5F5F7]", 
    textColor: "text-black" 
  },
  { 
    id: 6, 
    src: "/giraffeT.png", 
    category: "Predators", 
    title: "Silent hunters.", 
    bgColor: "bg-[#000000]", 
    textColor: "text-white" 
  },
  { 
    id: 7, 
    src: "/bird.png", 
    category: "Avian", 
    title: "Masters of the sky.", 
    bgColor: "bg-[#FAFAFA]", 
    textColor: "text-black" 
  },
  { 
    id: 8, 
    src: "/jeep.png", 
    category: "Safari", 
    title: "Journey together.", 
    bgColor: "bg-[#1d1d1f]", 
    textColor: "text-white" 
  },
];

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

  // Optimized scroll function to prevent unnecessary re-renders
  const scroll = useCallback((direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      // Scroll by roughly one card width (card width + gap)
      const scrollAmount = clientWidth > 768 ? 420 : clientWidth * 0.85; 
      const scrollTo = direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({ 
        left: scrollTo, 
        behavior: "smooth" 
      });
    }
  }, []);

  return (
    <section className="py-16 sm:py-24 bg-white min-h-screen font-sans antialiased">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8 sm:mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] tracking-tight"
          >
            The Wild in Focus.
          </motion.h2>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <motion.div 
            ref={scrollContainerRef}
            layout
            // Hide scrollbar natively across browsers using Tailwind arbitrary variants
            className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {galleryData.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`relative flex-shrink-0 w-[85vw] sm:w-[320px] md:w-[400px] h-[500px] rounded-[2rem] overflow-hidden snap-start ${item.bgColor} shadow-sm border border-gray-100`}
              >
                {/* Text Content - Top Left */}
                <div className={`absolute top-8 left-8 right-8 z-20 ${item.textColor}`}>
                  <span className="block text-sm font-semibold mb-2">
                    {item.category}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-semibold tracking-tight leading-tight w-4/5">
                    {item.title}
                  </h3>
                </div>

                {/* Floating Image */}
                <div className="absolute inset-x-0 bottom-0 top-32 flex justify-center items-end p-6 z-10 pointer-events-none">
                  <img
                    src={item.src}
                    alt={item.title}
                    // object-contain ensures it fits without distortion, object-bottom anchors it
                    className="w-full h-full object-contain object-bottom transform transition-transform duration-700 hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Plus Button - Bottom Right */}
                <button 
                  onClick={() => setSelectedPhoto(item)}
                  className="absolute bottom-6 right-6 z-30 w-10 h-10 bg-white rounded-full flex items-center justify-center text-black shadow-[0_2px_10px_rgba(0,0,0,0.1)] hover:scale-105 hover:bg-gray-50 transition-all duration-200"
                  aria-label="View Details"
                >
                  <Plus size={24} strokeWidth={2.5} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Arrows - External */}
        <div className="flex justify-end gap-4 mt-2 pr-2">
          <button 
            onClick={() => scroll("left")}
            className="w-10 h-10 rounded-full bg-[#e8e8ed] text-[#1d1d1f] flex items-center justify-center hover:bg-[#d2d2d7] transition-colors"
            aria-label="Scroll Left"
          >
            <ChevronLeft size={24} />
          </button>
          <button 
            onClick={() => scroll("right")}
            className="w-10 h-10 rounded-full bg-[#e8e8ed] text-[#1d1d1f] flex items-center justify-center hover:bg-[#d2d2d7] transition-colors"
            aria-label="Scroll Right"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>

      {/* Lightbox / Modal */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)} // Clicking the backdrop closes the modal
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 backdrop-blur-xl bg-black/80"
          >
            <motion.button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 backdrop-blur-md transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </motion.button>

            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()} // Prevents closing when clicking inside the content box
              className={`relative max-w-2xl w-full rounded-[2rem] p-10 overflow-hidden shadow-2xl ${selectedPhoto.bgColor} ${selectedPhoto.textColor}`}
            >
               <span className="block text-sm font-semibold mb-2">
                  {selectedPhoto.category}
                </span>
                <h3 className="text-3xl md:text-4xl font-semibold tracking-tight mb-8">
                  {selectedPhoto.title}
                </h3>
                <div className="w-full flex justify-center">
                  <img
                    src={selectedPhoto.src}
                    alt={selectedPhoto.title}
                    className="max-h-[50vh] object-contain drop-shadow-2xl"
                  />
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SafariPhotoGallery;