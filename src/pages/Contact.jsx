// Contact.jsx
import React, { useState, useEffect, useCallback } from "react";
import BookingModal from "../components/BookingModal";

/* ================================================= */
/* SERVICE                                           */
/* ================================================= */

const getContactService = (packageTitle = "Custom Safari") => ({
  title: packageTitle,
  description: "Tailor your own African adventure",
  icon: null,
  features: [],
});

/* ================================================= */
/* COMPONENT                                         */
/* ================================================= */

const Contact = ({ initialPackage = "", isModalOpen = false, onClose }) => {
  const [open, setOpen] = useState(isModalOpen);
  const [visible, setVisible] = useState(false);

  /* ================================
     Modal Sync
  ================================= */
  useEffect(() => {
    if (isModalOpen) {
      setOpen(true);
      setVisible(true);
      document.body.style.overflow = "hidden";
    } else {
      handleClose();
    }
  }, [isModalOpen]);

  const handleOpen = useCallback(() => {
    setOpen(true);
    setTimeout(() => setVisible(true), 10);
    document.body.style.overflow = "hidden";
  }, []);

  const handleClose = useCallback(() => {
    setVisible(false);
    document.body.style.overflow = "auto";

    setTimeout(() => {
      setOpen(false);
      if (onClose) onClose();
    }, 260);
  }, [onClose]);

  return (
    <>
      {/* ================================
         SECTION (NO SCROLL ANIMATION)
      ================================= */}
      <section className="relative max-w-7xl mx-auto my-32 rounded-[40px] overflow-hidden">
        {/* Background */}
        <div
          className="absolute inset-0 rounded-[40px]"
          style={{
            background:
              "linear-gradient(115deg, #d8d9dd 0%, #d8d9dd 35%, #d0c7bf 50%, #d89a6a 65%, #e26c22 85%, #e26c22 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 items-center gap-12 px-8 md:px-16 py-24 bg-[#d8d9dd] rounded-[40px] shadow-[0_40px_120px_rgba(0,0,0,0.12)]">
          {/* Text */}
          <div>
            <h2 className="text-5xl md:text-7xl font-semibold tracking-tight text-neutral-900 leading-[1.05] mb-8">
              Your wild adventure <br /> begins here.
            </h2>

            <p className="text-xl text-neutral-800 mb-10 max-w-md leading-relaxed font-medium">
              Choose your safari, tell us your dates, and we'll craft your
              perfect journey.
            </p>

            <button
              onClick={handleOpen}
              className="bg-black text-white px-10 py-4 rounded-full text-lg font-medium shadow-md hover:bg-neutral-800 transition-colors duration-200"
            >
              Plan Your Safari
            </button>
          </div>

          {/* Image */}
          <div className="flex justify-center lg:justify-end pointer-events-none">
            <img
              src="/calltoaction.png"
              alt="Safari Journey Concept"
              className="w-72 md:w-[450px] object-contain select-none"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ================================
         MODAL (ONLY ANIMATION HERE)
      ================================= */}
      {open && (
        <div
          onClick={handleClose}
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300
          ${visible ? "opacity-100 bg-black/40" : "opacity-0 bg-black/0"}`}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className={`w-full max-w-2xl transform transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
            ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-[0.98]"}`}
          >
            <BookingModal
              isOpen={true}
              onClose={handleClose}
              service={getContactService(initialPackage)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default Contact;