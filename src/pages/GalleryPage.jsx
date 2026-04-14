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
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="text-4xl md:text-5xl font-semibold text-[#1d1d1f] tracking-tight transform-gpu"
          >
            The Wild in Focus.
          </motion.h2>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          <div 
            ref={scrollContainerRef}
            // Apple-like scroll polish: momentum scrolling on iOS, contain overscroll
            className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden overscroll-x-contain [-webkit-overflow-scrolling:touch] will-change-scroll"
          >
            {galleryData.map((item) => (
              <motion.div
                key={item.id}
                // Trigger animation when entering viewport for staggered performance
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ type: "spring", stiffness: 400, damping: 40 }}
                className={`relative flex-shrink-0 w-[85vw] sm:w-[320px] md:w-[400px] h-[500px] rounded-[2rem] overflow-hidden snap-start ${item.bgColor} shadow-sm border border-gray-100 transform-gpu will-change-transform`}
              >
                {/* Text Content */}
                <div className={`absolute top-8 left-8 right-8 z-20 ${item.textColor}`}>
                  <span className="block text-sm font-semibold mb-2">
                    {item.category}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-semibold tracking-tight leading-tight w-4/5">
                    {item.title}
                  </h3>
                </div>

                {/* Floating Image (Hardware Accelerated) */}
                <div className="absolute inset-x-0 bottom-0 top-32 flex justify-center items-end p-6 z-10 pointer-events-none">
                  <motion.img
                    layoutId={`image-${item.id}`} // Links thumbnail to modal for seamless transition
                    src={item.src}
                    alt={item.title}
                    decoding="async"
                    className="w-full h-full object-contain object-bottom transform transition-transform duration-700 hover:scale-105 transform-gpu will-change-transform"
                    loading="lazy"
                  />
                </div>

                {/* Plus Button */}
                <button 
                  onClick={() => setSelectedPhoto(item)}
                  className="absolute bottom-6 right-6 z-30 w-10 h-10 bg-white rounded-full flex items-center justify-center text-black shadow-[0_2px_10px_rgba(0,0,0,0.1)] hover:scale-105 hover:bg-gray-50 transition-all duration-200 transform-gpu"
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
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 backdrop-blur-xl bg-black/80 transform-gpu"
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 backdrop-blur-md transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </motion.button>

            <motion.div 
              layoutId={`card-bg-${selectedPhoto.id}`} // Links the background card
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative max-w-2xl w-full rounded-[2rem] p-10 overflow-hidden shadow-2xl ${selectedPhoto.bgColor} ${selectedPhoto.textColor} transform-gpu will-change-transform`}
            >
               <motion.span 
                 initial={{ opacity: 0 }} 
                 animate={{ opacity: 1 }} 
                 transition={{ delay: 0.2 }}
                 className="block text-sm font-semibold mb-2"
               >
                  {selectedPhoto.category}
                </motion.span>
                <motion.h3 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  transition={{ delay: 0.25 }}
                  className="text-3xl md:text-4xl font-semibold tracking-tight mb-8"
                >
                  {selectedPhoto.title}
                </motion.h3>
                <div className="w-full flex justify-center">
                  <motion.img
                    layoutId={`image-${selectedPhoto.id}`} // Matches the thumbnail layoutId
                    src={selectedPhoto.src}
                    alt={selectedPhoto.title}
                    className="max-h-[50vh] object-contain drop-shadow-2xl transform-gpu will-change-transform"
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