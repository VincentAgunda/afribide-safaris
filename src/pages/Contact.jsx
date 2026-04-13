import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import emailjs from "@emailjs/browser";

/* ================================
   SAFARI PACKAGES 
================================ */
const safaris = [
  { id: 1, title: "The Ultimate Northern & Masai Mara Journey" },
  { id: 2, title: "Kenya Signature Safari: 7 Days Iconic Parks" },
  { id: 3, title: "Kenya Signature Safari: 8 Days Iconic Parks" },
  { id: 4, title: "The Ultimate Bush & Beach Escape" },
  { id: "custom", title: "Custom Safari Quote" },
];

const Contact = ({ initialPackage = "", isModalOpen = false, onClose }) => {
  const [open, setOpen] = useState(isModalOpen);
  const [isMobile, setIsMobile] = useState(false);
  const [status, setStatus] = useState(null); // 'sending', 'success', 'error'
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    package: initialPackage,
    adults: "",
    children: "",
    travel_date: "",
  });

  const formRef = useRef(null);
  const sectionRef = useRef(null);

  /* ================================
     Auto-fill & Auto-open
  ================================= */
  useEffect(() => {
    if (initialPackage) {
      setFormData((prev) => ({ ...prev, package: initialPackage }));
    }
  }, [initialPackage]);

  useEffect(() => {
    setOpen(isModalOpen);
  }, [isModalOpen]);

  const handleClose = useCallback(() => {
    setOpen(false);
    if (onClose) onClose();
  }, [onClose]);

  /* ================================
     Responsive Check (Optimized)
  ================================= */
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    setIsMobile(mediaQuery.matches);

    const handleMediaChange = (e) => setIsMobile(e.matches);
    
    // Modern approach to event listeners for media queries
    mediaQuery.addEventListener("change", handleMediaChange);
    return () => mediaQuery.removeEventListener("change", handleMediaChange);
  }, []);

  /* ================================
     Scroll Animation
  ================================= */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center start"],
  });

  // Use spring physics for smoother scroll tracking
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [8, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);

  /* ================================
     Validation
  ================================= */
  const validate = useCallback(() => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.match(/^\S+@\S+\.\S+$/)) newErrors.email = "Valid email required";
    if (!formData.package) newErrors.package = "Select a package";
    if (!formData.travel_date) newErrors.travel_date = "Select a travel date";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  /* ================================
     Input Handler
  ================================= */
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  }, [errors]);

  /* ================================
     WhatsApp Fallback
  ================================= */
  const handleWhatsApp = useCallback(() => {
    const phoneNumber = "254700000000"; 
    
    const text = `Hello! I'm interested in a safari and would like a quote.\n\n*Package:* ${
      formData.package || "Not selected yet"
    }\n*Travel Date:* ${formData.travel_date || "Not decided"}\n*Adults:* ${
      formData.adults || "0"
    }\n*Children:* ${formData.children || "0"}\n\n*Name:* ${
      formData.name || "Not provided"
    }\n*Message:* ${formData.message || "None"}`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, "_blank");
  }, [formData]);

  /* ================================
     Send Email
  ================================= */
  const sendEmail = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setStatus("sending");

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formRef.current,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
        package: "",
        adults: "",
        children: "",
        travel_date: "",
      });

      // Clear success message after 5 seconds
      setTimeout(() => setStatus(null), 5000);
      
    } catch (err) {
      console.error("EmailJS Error:", err);
      setStatus("error");
    }
  };

  // Note the Fragment `<>` wrapping everything so the modal sits completely outside the transformed `<section>`
  return (
    <>
      <section
        ref={sectionRef}
        className="relative max-w-7xl mx-auto my-40 rounded-[40px] overflow-hidden"
        style={{ perspective: 1400 }}
      >
        {/* Background - Updated to match the Gray to Orange gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-[#d8d9dd] via-[#d8d9dd] via-45% to-[#e26c22]"
        />

        {/* Content */}
        <motion.div
          style={{
            ...(isMobile ? {} : { scale, rotateX, y, transformStyle: "preserve-3d" }),
            willChange: isMobile ? "auto" : "transform", 
          }}
          className="relative grid grid-cols-1 lg:grid-cols-2 items-center gap-12 px-8 md:px-16 py-28 bg-white/20 backdrop-blur-sm rounded-[40px] shadow-[0_40px_120px_rgba(0,0,0,0.12)]"
        >
          {/* Left */}
          <div>
            <h2 className="text-5xl md:text-7xl font-semibold tracking-tight text-neutral-900 leading-[1.05] mb-8">
              Your wild adventure <br /> begins here.
            </h2>

            <p className="text-xl text-neutral-800 mb-10 max-w-md leading-relaxed font-medium">
              Choose your safari, tell us your dates, and we’ll craft your perfect
              journey.
            </p>

            <motion.button
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setOpen(true)}
              className="bg-black text-white px-10 py-4 rounded-full text-lg font-medium shadow-xl hover:bg-neutral-800 transition-colors"
            >
              Plan Your Safari
            </motion.button>
          </div>

          {/* Right Image */}
          <div className="flex justify-center lg:justify-end">
            <img
              src="/calltoaction.png"
              alt="Safari Journey Concept"
              className="w-72 md:w-[450px] object-contain drop-shadow-2xl"
              loading="lazy"
            />
          </div>
        </motion.div>
      </section>

      {/* ================= MODAL MOVED OUTSIDE THE SECTION ================= */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-[100] px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={isMobile ? { y: "100%" } : { scale: 0.95, opacity: 0, y: 30 }}
              animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1, y: 0 }}
              exit={isMobile ? { y: "100%" } : { scale: 0.95, opacity: 0, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className={`bg-white shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto will-change-transform ${
                isMobile ? "fixed bottom-0 rounded-t-3xl p-6" : "rounded-3xl p-8 md:p-10"
              }`}
            >
              <h3 className="text-3xl font-semibold mb-2 tracking-tight">
                Plan Your Safari
              </h3>
              <p className="text-neutral-500 mb-6">
                Fill in your details and request a quotation.
              </p>

              {/* FORM */}
              <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
                
                {/* Package */}
                <div>
                  <select
                    name="package"
                    value={formData.package}
                    onChange={handleChange}
                    className={`w-full text-base border px-4 py-3 rounded-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-black/5 ${
                      errors.package ? 'border-red-500' : 'border-neutral-200'
                    }`}
                  >
                    <option value="">Select Package</option>
                    {safaris.map((pkg) => (
                      <option key={pkg.id} value={pkg.title}>
                        {pkg.title}
                      </option>
                    ))}
                  </select>
                  {errors.package && <span className="text-red-500 text-xs ml-2 mt-1 block">{errors.package}</span>}
                </div>

                {/* People */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="adults"
                    value={formData.adults}
                    placeholder="Adults"
                    min="1"
                    onChange={handleChange}
                    className="text-base border border-neutral-200 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                  <input
                    type="number"
                    name="children"
                    value={formData.children}
                    placeholder="Children"
                    min="0"
                    onChange={handleChange}
                    className="text-base border border-neutral-200 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5"
                  />
                </div>

                {/* Date */}
                <div className="flex flex-col">
                  <label className="text-sm text-neutral-500 ml-2 mb-1">
                    When would you like to start your vacation?
                  </label>
                  <input
                    type="date"
                    name="travel_date"
                    value={formData.travel_date}
                    onChange={handleChange}
                    className={`w-full text-base border px-4 py-3 rounded-2xl text-neutral-600 focus:outline-none focus:ring-2 focus:ring-black/5 ${
                      errors.travel_date ? 'border-red-500' : 'border-neutral-200'
                    }`}
                  />
                </div>

                {/* Contact Information */}
                <div>
                  <input
                    name="name"
                    value={formData.name}
                    placeholder="Name"
                    onChange={handleChange}
                    className={`w-full text-base border px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 ${
                      errors.name ? 'border-red-500' : 'border-neutral-200'
                    }`}
                  />
                </div>

                <div>
                  <input
                    name="email"
                    value={formData.email}
                    placeholder="Email"
                    type="email"
                    onChange={handleChange}
                    className={`w-full text-base border px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 ${
                      errors.email ? 'border-red-500' : 'border-neutral-200'
                    }`}
                  />
                </div>

                <input
                  name="phone"
                  value={formData.phone}
                  placeholder="Phone"
                  onChange={handleChange}
                  className="w-full text-base border border-neutral-200 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5"
                />

                {/* Message */}
                <textarea
                  name="message"
                  value={formData.message}
                  rows="3"
                  placeholder="Special requests or custom ideas..."
                  onChange={handleChange}
                  className="w-full text-base border border-neutral-200 px-4 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 resize-none"
                />

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 pb-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="text-neutral-500 w-full sm:w-auto text-center order-3 sm:order-1 hover:text-black transition-colors"
                  >
                    Cancel
                  </button>

                  <div className="flex w-full sm:w-auto gap-3 flex-col sm:flex-row order-1 sm:order-2">
                    {/* WhatsApp Fallback */}
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={handleWhatsApp}
                      className="px-6 py-3 rounded-full bg-[#25D366] text-white flex justify-center items-center gap-2 font-medium shadow-md hover:bg-[#20bd5a] transition-colors"
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                      </svg>
                      <span className="hidden sm:inline">WhatsApp</span>
                    </motion.button>

                    {/* Email Submit */}
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      type="submit"
                      disabled={status === "sending"}
                      className="px-8 py-3 rounded-full bg-black text-white font-medium whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed transition-opacity"
                    >
                      {status === "sending" ? "Requesting..." : "Email Quote"}
                    </motion.button>
                  </div>
                </div>

                {/* Feedback Messages */}
                <AnimatePresence mode="wait">
                  {status === "success" && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-green-600 text-sm text-center"
                    >
                      ✅ You’ll be contacted shortly.
                    </motion.p>
                  )}
                  {status === "error" && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-red-500 text-sm text-center"
                    >
                      ❌ Failed to send. Please try again or use WhatsApp.
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Contact;