// pages/SafariGalleryPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "../firebase";
import { collection, onSnapshot } from "firebase/firestore";
import BookingModal from "../components/BookingModal";
import SafariModal from "../components/SafariModal";

/* ------------------ Apple-like easing ------------------ */
const EASE = [0.25, 0.1, 0.25, 1];

/* ------------------ Fallback Images ------------------ */
const defaultGalleryImages = [
  "/Animals/2ducks.jpeg",
  "/zebra.jpeg",
  "/Animals/2ducks1.jpeg",
  "lion1.jpeg",
  "zebra-outside.jpeg",
  "/Animals/bird1.jpeg",
  "elephant1.jpeg",
  "/Animals/bird2.jpeg",
  "/Animals/bird3.jpeg",
  "/Animals/4zebras.jpeg",
];

const SafariGalleryPage = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [bookingItem, setBookingItem] = useState(null);
  const [safaris, setSafaris] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ------------------ Firestore ------------------ */
  useEffect(() => {
    const q = collection(db, "safaris");
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const packages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          gallery: doc.data().gallery?.length
            ? doc.data().gallery
            : defaultGalleryImages,
        }));
        setSafaris(packages);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching safaris:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const openBooking = useCallback((item) => {
    setBookingItem(item);
  }, []);

  /* ------------------ Loading ------------------ */
  if (loading) {
    return (
      <section className="min-h-screen flex items-center justify-center bg-[#F5F5F7]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-gray-400 uppercase tracking-[0.3em] text-xs"
        >
          Loading safaris...
        </motion.div>
      </section>
    );
  }

  return (
    <section className="w-full min-h-screen bg-[#F5F5F7] py-24 font-sans">

      {/* ================= HEADER ================= */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12 mb-20">

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-[12px] tracking-[0.38em] uppercase text-[#8A4413] mb-6"
        >
          Gallery & Experiences
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="
           text-3xl md:text-5xl font-semibold text-[#1d1d1f] tracking-tight
          "
        >
          Explore Afribide Safaris
        </motion.h1>

        
      </div>

      {/* ================= GRID ================= */}
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[12px] bg-[#ffffff]">

          {safaris.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: i * 0.05,
                duration: 0.8,
                ease: EASE,
              }}
              onClick={() => setSelectedItem(item)}
              className="
                relative aspect-square overflow-hidden cursor-pointer
                group bg-black
              "
            >
              {/* IMAGE */}
              <motion.img
                src={item.image || defaultGalleryImages[0]}
                alt={item.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 1.2, ease: EASE }}
              />

              {/* OVERLAY */}
              <div className="
                absolute inset-0
                bg-gradient-to-t
                from-black/85 via-black/30 to-transparent
              " />

              {/* TEXT */}
              <div className="absolute bottom-0 left-0 p-7 text-white">

                <span className="
                  block text-[10px]
                  tracking-[0.4em]
                  uppercase
                  mb-3
                  opacity-70
                ">
                  {item.category || "Adventure"}
                </span>

                <h3 className="
                  text-[18px] md:text-[20px]
                  font-[300]
                  leading-[1.25]
                  tracking-[-0.015em]
                  mb-4
                  max-w-[85%]
                ">
                  {item.title}
                </h3>

                {/* LINK */}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(item);
                  }}
                  className="
                    text-[11px]
                    tracking-[0.35em]
                    uppercase
                    border-b border-white/50
                    pb-1
                    group-hover:border-white
                    transition-all duration-500
                  "
                >
                  Explore More
                </span>
              </div>

              {/* HOVER FADE (APPLE STYLE) */}
              <div className="
                absolute inset-0 bg-black/0
                group-hover:bg-black/10
                transition duration-700
              " />
            </motion.div>
          ))}
        </div>
      </div>

      {/* ================= MODALS ================= */}
      <AnimatePresence>
        {selectedItem && (
          <SafariModal
            item={selectedItem}
            onClose={() => setSelectedItem(null)}
            onBookNow={openBooking}
          />
        )}
      </AnimatePresence>

      <BookingModal
        isOpen={!!bookingItem}
        onClose={() => setBookingItem(null)}
        service={
          bookingItem
            ? {
                title: bookingItem.title,
                description: bookingItem.description,
              }
            : undefined
        }
      />
    </section>
  );
};

export default SafariGalleryPage;