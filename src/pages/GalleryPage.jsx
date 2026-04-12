// SafariPhotoGallery.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ZoomIn } from "lucide-react";

/* ------------------ Configuration ------------------ */
const spring = {
  type: "spring",
  stiffness: 250,
  damping: 28,
  mass: 0.8,
};

const categories = ["All", "Wildlife", "Landscapes", "Lodges"];

// Premium placeholder images (Replace with your actual Firebase/Storage URLs)
const galleryData = [
  { id: 1, src: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=1600", category: "Wildlife", title: "Majestic Elephant", size: "large" },
  { id: 2, src: "https://images.unsplash.com/photo-1614531341773-3bff8b7cb3fc?auto=format&fit=crop&q=80&w=800", category: "Landscapes", title: "Serengeti Plains", size: "wide" },
  { id: 3, src: "https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&q=80&w=600", category: "Wildlife", title: "Leopard in Tree", size: "tall" },
  { id: 4, src: "https://images.unsplash.com/photo-1504430580004-94a2824cc40c?auto=format&fit=crop&q=80&w=600", category: "Lodges", title: "Luxury Tents", size: "small" },
  { id: 5, src: "https://images.unsplash.com/photo-1547471080-7fc2caa6f17f?auto=format&fit=crop&q=80&w=1200", category: "Wildlife", title: "Lion Pride", size: "large" },
  { id: 6, src: "https://images.unsplash.com/photo-1534177616072-ef7dc120449d?auto=format&fit=crop&q=80&w=800", category: "Landscapes", title: "Baobab Sunset", size: "tall" },
  { id: 7, src: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?auto=format&fit=crop&q=80&w=800", category: "Wildlife", title: "Giraffe Herd", size: "wide" },
  { id: 8, src: "https://images.unsplash.com/photo-1551009175-15bdf9dcb580?auto=format&fit=crop&q=80&w=600", category: "Lodges", title: "Lodge Pool", size: "small" },
  { id: 9, src: "https://images.unsplash.com/photo-1517815233158-b64db4a80277?auto=format&fit=crop&q=80&w=600", category: "Wildlife", title: "Cheetah Sprint", size: "small" },
];

/* ------------------ Helper: Size Classes ------------------ */
const getSizeClasses = (size) => {
  switch (size) {
    case "large": return "md:col-span-2 md:row-span-2";
    case "wide": return "md:col-span-2 md:row-span-1";
    case "tall": return "md:col-span-1 md:row-span-2";
    default: return "md:col-span-1 md:row-span-1"; // small
  }
};

/* ===========================
   Photo Gallery Component
=========================== */
const SafariPhotoGallery = () => {
  const [activeFilter, setActiveFilter] = useState("All");
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

  const filteredPhotos = galleryData.filter(
    (photo) => activeFilter === "All" || photo.category === activeFilter
  );

  return (
    <section className="py-16 sm:py-24 bg-[#F5F5F7] min-h-screen font-sans antialiased selection:bg-[#002D62] selection:text-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-medium text-blue-600 tracking-tight mb-4"
            >
              The Wild in Focus.
            </motion.h2>
            
          </div>

          {/* Filter Pills */}
          <motion.div 
            initial={{ opacity: 0, opacity: 0 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 bg-white p-1.5 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-gray-100"
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className="relative px-5 py-2.5 text-sm font-medium rounded-full transition-colors outline-none"
              >
                {activeFilter === category && (
                  <motion.div
                    layoutId="active-filter"
                    className="absolute inset-0 bg-[#1d1d1f] rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className={`relative z-10 ${activeFilter === category ? "text-white" : "text-[#86868b] hover:text-[#1d1d1f]"}`}>
                  {category}
                </span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* Mosaic Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-[250px]"
        >
          <AnimatePresence mode="popLayout">
            {filteredPhotos.map((photo) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={spring}
                onClick={() => setSelectedPhoto(photo)}
                className={`relative group rounded-[2rem] overflow-hidden cursor-pointer bg-gray-200 ${getSizeClasses(photo.size)}`}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-[1.5s] ease-out will-change-transform"
                  loading="lazy"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6 sm:p-8">
                  <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="block text-xs font-bold uppercase tracking-widest text-white/80 mb-2">
                      {photo.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-semibold text-white tracking-tight flex items-center justify-between">
                      {photo.title}
                      <ZoomIn className="text-white/80" size={20} />
                    </h3>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredPhotos.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-xl text-gray-500">No photos found in this category.</p>
          </div>
        )}
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 backdrop-blur-xl bg-black/90"
          >
            {/* Close Button */}
            <motion.button
              onClick={() => setSelectedPhoto(null)}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full bg-white/10 border border-white/20 text-white flex items-center justify-center hover:bg-white/20 backdrop-blur-md transition-colors"
            >
              <X size={24} strokeWidth={2} />
            </motion.button>

            <motion.div
              layoutId={`image-container-${selectedPhoto.id}`}
              className="relative max-w-7xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            >
              <motion.img
                src={selectedPhoto.src}
                alt={selectedPhoto.title}
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={spring}
              />
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mt-6"
              >
                <h3 className="text-2xl font-medium text-white tracking-tight">
                  {selectedPhoto.title}
                </h3>
                <p className="text-white/60 text-sm tracking-widest uppercase mt-2">
                  {selectedPhoto.category}
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default SafariPhotoGallery;