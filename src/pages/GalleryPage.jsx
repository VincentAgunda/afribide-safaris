import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ChevronLeft, ChevronRight, X } from "lucide-react";

/* ------------------ Configuration ------------------ */
const galleryData = [
  {
    id: 1,
    src: "/lion1.jpeg",
    category: "Safari",
    title: "Journey together.",
    bgColor: "bg-[#979797]",
    textColor: "text-white",
    relatedImages: [
      "/chettah1.jpeg", "/zebra-outside.jpeg", "/goose.jpeg",
      "/chimpanzee.jpeg", "/lion2.jpeg", "/giraffe1.jpeg",
      "/elephant1.jpeg", "/lion1.jpeg", "/zebra.jpeg",
      "/Leopard.jpeg", "/goose2.jpeg", "/girrafe2.jpeg"
    ],
  },
  {
    id: 2,
    src: "/RhinoT.png",
    category: "Exploration",
    title: "Venture into the wild.",
    bgColor: "bg-[#F5F5F7]",
    textColor: "text-black",
    relatedImages: [
      "/chettah1.jpeg", "/zebra-outside.jpeg", "/goose.jpeg",
      "/chimpanzee.jpeg", "/lion2.jpeg", "/giraffe1.jpeg",
      "/elephant1.jpeg", "/lion1.jpeg", "/zebra.jpeg",
      "/Leopard.jpeg", "/goose2.jpeg", "/girrafe2.jpeg"
    ],
  },
  {
    id: 3,
    src: "/cheetahT.png",
    category: "Speed",
    title: "The fastest on land.",
    bgColor: "bg-[#000000]",
    textColor: "text-white",
    relatedImages: [
      "/chettah1.jpeg", "/zebra-outside.jpeg", "/goose.jpeg",
      "/chimpanzee.jpeg", "/lion2.jpeg", "/giraffe1.jpeg",
      "/elephant1.jpeg", "/lion1.jpeg", "/zebra.jpeg",
      "/Leopard.jpeg", "/goose2.jpeg", "/girrafe2.jpeg"
    ],
  },
  {
    id: 4,
    src: "/parachute.png",
    category: "Lodges",
    title: "Rest in luxury.",
    bgColor: "bg-[#FAFAFA]",
    textColor: "text-black",
    relatedImages: [
      "/chettah1.jpeg", "/zebra-outside.jpeg", "/goose.jpeg",
      "/chimpanzee.jpeg", "/lion2.jpeg", "/giraffe1.jpeg",
      "/elephant1.jpeg", "/lion1.jpeg", "/zebra.jpeg",
      "/Leopard.jpeg", "/goose2.jpeg", "/girrafe2.jpeg"
    ],
  },
  {
    id: 5,
    src: "/horizonT.png",
    category: "Landscape",
    title: "Endless horizons.",
    bgColor: "bg-[#F5F5F7]",
    textColor: "text-black",
    relatedImages: [
      "/chettah1.jpeg", "/zebra-outside.jpeg", "/goose.jpeg",
      "/chimpanzee.jpeg", "/lion2.jpeg", "/giraffe1.jpeg",
      "/elephant1.jpeg", "/lion1.jpeg", "/zebra.jpeg",
      "/Leopard.jpeg", "/goose2.jpeg", "/girrafe2.jpeg"
    ],
  },
  {
    id: 6,
    src: "/mud-rhinoT.png",
    category: "Predators",
    title: "Silent hunters.",
    bgColor: "bg-[#000000]",
    textColor: "text-white",
    relatedImages: [
     "/chettah1.jpeg", "/zebra-outside.jpeg", "/goose.jpeg",
      "/chimpanzee.jpeg", "/lion2.jpeg", "/giraffe1.jpeg",
      "/elephant1.jpeg", "/lion1.jpeg", "/zebra.jpeg",
      "/Leopard.jpeg", "/goose2.jpeg", "/girrafe2.jpeg"
    ],
  },
  {
    id: 7,
    src: "/gooseT.png",
    category: "Avian",
    title: "Masters of the sky.",
    bgColor: "bg-[#FAFAFA]",
    textColor: "text-black",
    relatedImages: [
      "/chettah1.jpeg", "/zebra-outside.jpeg", "/goose.jpeg",
      "/chimpanzee.jpeg", "/lion2.jpeg", "/giraffe1.jpeg",
      "/elephant1.jpeg", "/lion1.jpeg", "/zebra.jpeg",
      "/Leopard.jpeg", "/goose2.jpeg", "/girrafe2.jpeg"
    ],
  },
  {
    id: 8,
    src: "/majestic-elephant.png",
    category: "Wildlife",
    title: "Majestic Elephant.",
    bgColor: "bg-[#979797]",
    textColor: "text-white",
    relatedImages: [
     "/chettah1.jpeg", "/zebra-outside.jpeg", "/goose.jpeg",
      "/chimpanzee.jpeg", "/lion2.jpeg", "/giraffe1.jpeg",
      "/elephant1.jpeg", "/lion1.jpeg", "/zebra.jpeg",
      "/Leopard.jpeg", "/goose2.jpeg", "/girrafe2.jpeg"
    ],
  },
];

/* ===========================
    Apple Style Safari Gallery
=========================== */
const SafariPhotoGallery = () => {
  const scrollContainerRef = useRef(null);
  
  // States
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState(null);

  // Lock body scroll when any lightbox is open
  useEffect(() => {
    if (selectedPhoto || galleryIndex !== null) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedPhoto, galleryIndex]);

  // Keyboard navigation for full screen gallery
  useEffect(() => {
    if (galleryIndex === null || !selectedPhoto) return;

    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") handleNextImage();
      if (e.key === "ArrowLeft") handlePrevImage();
      if (e.key === "Escape") setGalleryIndex(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [galleryIndex, selectedPhoto]);

  // Optimized scroll function for main carousel
  const scroll = useCallback((direction) => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth > 768 ? 420 : clientWidth * 0.85;
      const scrollTo =
        direction === "left"
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;

      scrollContainerRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  }, []);

  // Handlers for full screen slide navigation
  const handleNextImage = (e) => {
    if (e) e.stopPropagation();
    setGalleryIndex((prev) => 
      (prev + 1) % selectedPhoto.relatedImages.length
    );
  };

  const handlePrevImage = (e) => {
    if (e) e.stopPropagation();
    setGalleryIndex((prev) => 
      prev === 0 ? selectedPhoto.relatedImages.length - 1 : prev - 1
    );
  };

  // Drag handler for swipe functionality (Optimized for Mobile)
  const handleDragEnd = (e, { offset, velocity }) => {
    const swipeThreshold = 40; // Lowered threshold for easier swiping
    const swipeVelocity = 400; // Consider fast swipes even if distance is short

    if (offset.x < -swipeThreshold || velocity.x < -swipeVelocity) {
      handleNextImage();
    } else if (offset.x > swipeThreshold || velocity.x > swipeVelocity) {
      handlePrevImage();
    }
  };

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
            // Hide scrollbar natively across browsers
            className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-8 pt-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {galleryData.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setSelectedPhoto(item)}
                className={`relative flex-shrink-0 w-[85vw] sm:w-[320px] md:w-[400px] h-[500px] rounded-[2rem] overflow-hidden snap-start cursor-pointer ${item.bgColor} shadow-sm border border-gray-100 group`}
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
                    className="w-full h-full object-contain object-bottom transform transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                {/* Plus Button - Bottom Right */}
                <button
                  className="absolute bottom-6 right-6 z-30 w-10 h-10 bg-white rounded-full flex items-center justify-center text-black shadow-[0_2px_10px_rgba(0,0,0,0.1)] group-hover:scale-105 group-hover:bg-gray-50 transition-all duration-200"
                  aria-label="View Details"
                >
                  <Plus size={24} strokeWidth={2.5} />
                </button>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Navigation Arrows - Main Carousel */}
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

      {/* Expanded Lightbox / Modal (Grid View) */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 backdrop-blur-xl bg-black/80"
          >
            {/* Don't show close button for grid modal if fullscreen image is active */}
            {galleryIndex === null && (
              <motion.button
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-6 right-6 z-50 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 backdrop-blur-md transition-colors"
                aria-label="Close modal"
              >
                <X size={20} className="md:w-6 md:h-6" />
              </motion.button>
            )}

            {/* Scrollable Detail Container */}
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()} 
              className={`relative max-w-5xl w-full max-h-[90vh] overflow-y-auto rounded-[2rem] p-6 md:p-12 shadow-2xl ${selectedPhoto.bgColor} ${selectedPhoto.textColor} [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
            >
              {/* Top Section */}
              <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center mb-12 md:mb-16">
                <div className="flex-1 text-center md:text-left">
                  <span className="block text-sm font-semibold mb-2 uppercase tracking-wider opacity-80">
                    {selectedPhoto.category}
                  </span>
                  <h3 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
                    {selectedPhoto.title}
                  </h3>
                  <p className="text-base md:text-lg opacity-80 max-w-md mx-auto md:mx-0">
                    Dive deeper into this collection. Explore the environment, 
                    the movement, and the breathtaking details captured in the wild.
                  </p>
                </div>
                <div className="flex-1 w-full flex justify-center bg-black/5 rounded-[2rem] p-4 md:p-6">
                  <img
                    src={selectedPhoto.src}
                    alt={selectedPhoto.title}
                    className="max-h-[30vh] md:max-h-[40vh] object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* Bottom Section: Grid */}
              <div>
                <div className="flex items-center justify-between mb-6 md:mb-8 border-b border-current pb-4 opacity-90">
                  <h4 className="text-xl md:text-2xl font-semibold">Gallery Collection</h4>
                  <span className="text-sm font-medium">{selectedPhoto.relatedImages.length} Photos</span>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
                  {selectedPhoto.relatedImages.map((imgSrc, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      onClick={() => setGalleryIndex(idx)}
                      className="aspect-square rounded-2xl overflow-hidden bg-black/10 relative group cursor-pointer"
                    >
                      <img
                        src={imgSrc}
                        alt={`${selectedPhoto.category} detail ${idx + 1}`}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                         <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-md font-medium text-sm md:text-base">View</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Full Screen Slide Gallery Overlay */}
      <AnimatePresence>
        {galleryIndex !== null && selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black flex items-center justify-center overflow-hidden touch-none"
          >
            {/* Top Bar Controls */}
            <div className="absolute top-0 inset-x-0 p-4 sm:p-6 flex justify-between items-center z-[70] bg-gradient-to-b from-black/60 to-transparent pointer-events-none">
              <span className="text-white/80 font-medium tracking-wide pointer-events-auto text-sm sm:text-base drop-shadow-md">
                {galleryIndex + 1} / {selectedPhoto.relatedImages.length}
              </span>
              <button
                onClick={() => setGalleryIndex(null)}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors pointer-events-auto"
                aria-label="Close full screen"
              >
                <X size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Left Nav Area */}
            <div 
              className="absolute left-0 inset-y-0 w-20 sm:w-1/6 z-[65] flex items-center justify-start pl-4 sm:pl-6 cursor-pointer"
              onClick={handlePrevImage}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 sm:bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors shadow-lg">
                <ChevronLeft size={20} className="sm:w-8 sm:h-8" />
              </div>
            </div>

            {/* Right Nav Area */}
            <div 
              className="absolute right-0 inset-y-0 w-20 sm:w-1/6 z-[65] flex items-center justify-end pr-4 sm:pr-6 cursor-pointer"
              onClick={handleNextImage}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/30 sm:bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors shadow-lg">
                <ChevronRight size={20} className="sm:w-8 sm:h-8" />
              </div>
            </div>

            {/* Image Wrapper (Handles Swipe Gestures & Overlapping Crossfade) */}
            <div className="relative w-full h-full flex items-center justify-center">
              <AnimatePresence>
                <motion.img
                  key={galleryIndex}
                  src={selectedPhoto.relatedImages[galleryIndex]}
                  // Soft crossfade replacing the harsh horizontal movement
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.04 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragEnd={handleDragEnd}
                  // Absolute positioning forces images to overlap during the transition
                  // will-change properties prevent mobile rendering flickers
                  className="absolute w-full h-full object-contain cursor-grab active:cursor-grabbing z-[60] px-0 sm:px-16 will-change-transform will-change-opacity"
                  alt={`Gallery visual ${galleryIndex + 1}`}
                />
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SafariPhotoGallery;