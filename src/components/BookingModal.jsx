import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import emailjs from "@emailjs/browser";
import MapIcon from "@mui/icons-material/Map"; // fallback icon

// Default fallbacks when modal is opened without a specific service/theme
const DEFAULT_SERVICE = {
  title: "Custom Safari",
  description: "Tailor your own African adventure",
  icon: MapIcon,
  features: [],
};

const DEFAULT_THEME = {
  bg: "#F5F5F7",
  text: "text-gray-900",
  subText: "text-gray-700 font-normal",
  iconBg: "bg-gray-200",
  iconColor: "text-gray-900",
  btnBg: "bg-black hover:bg-[#002D62]",
  btnText: "text-white",
  plusBorder: "border-[#0b1b32] text-[#0b1b32]",
  divider: "border-gray-300",
};

const BookingModal = ({ isOpen, onClose, service, theme }) => {
  const finalService = service || DEFAULT_SERVICE;
  const finalTheme = theme || DEFAULT_THEME;

  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const formRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    package: "",
    adults: "",
    children: "",
    travel_date: "",
  });

  // Auto-fill the package when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData((prev) => ({ ...prev, package: finalService.title }));
    }
  }, [isOpen, finalService.title]);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.match(/^\S+@\S+\.\S+$/))
      newErrors.email = "Valid email required";
    if (!formData.travel_date) newErrors.travel_date = "Select a travel date";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) {
      setErrors((prev) => ({ ...prev, [e.target.name]: null }));
    }
  };

  const handleWhatsApp = () => {
    const phoneNumber = "+254113073535";
    const text = `Hello! I'm interested in a safari and would like a quote.\n\n*Package:* ${
      formData.package || "Not selected"
    }\n*Travel Date:* ${formData.travel_date || "Not decided"}\n*Adults:* ${
      formData.adults || "0"
    }\n*Children:* ${formData.children || "0"}\n\n*Name:* ${
      formData.name || "Not provided"
    }\n*Message:* ${formData.message || "None"}`;

    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedText}`, "_blank");
  };

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
      setTimeout(() => onClose(), 3000);
    } catch (err) {
      setStatus("error");
    }
  };

  if (!isOpen) return null;

  const isDarkTheme = finalTheme.text === "text-white";
  const inputClass = `w-full px-4 py-3 rounded-xl border outline-none transition-colors ${
    isDarkTheme
      ? "bg-white/10 border-white/20 text-white placeholder:text-gray-300 focus:bg-white/20"
      : "bg-white border-gray-200 text-gray-900 focus:border-[#0b1b32]"
  }`;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            style={{ backgroundColor: finalTheme.bg }}
            className={`relative w-full max-w-5xl max-h-[95vh] rounded-[32px] shadow-2xl flex flex-col md:flex-row overflow-hidden ${finalTheme.text}`}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 z-20 p-2 rounded-full backdrop-blur-md ${
                isDarkTheme ? "bg-white/10 hover:bg-white/20" : "bg-black/5 hover:bg-black/10"
              } transition`}
            >
              <X size={20} />
            </button>

            {/* Left Side: Form */}
            <div className="w-full md:w-1/2 p-6 md:p-10 overflow-y-auto max-h-[95vh] scrollbar-hide">
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                Book Your Adventure
              </h3>
              <p className={`mb-8 ${finalTheme.subText}`}>
                You are requesting:{" "}
                <span className="font-semibold">{finalService.title}</span>
              </p>

              <form ref={formRef} onSubmit={sendEmail} className="space-y-4">
                <input type="hidden" name="package" value={formData.package} />

                {/* People */}
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="number"
                    name="adults"
                    value={formData.adults}
                    placeholder="Adults"
                    min="1"
                    onChange={handleChange}
                    className={inputClass}
                  />
                  <input
                    type="number"
                    name="children"
                    value={formData.children}
                    placeholder="Children"
                    min="0"
                    onChange={handleChange}
                    className={inputClass}
                  />
                </div>

                {/* Date */}
                <div className="flex flex-col">
                  <label className={`text-sm ml-2 mb-1 ${finalTheme.subText}`}>
                    When would you like to start your vacation?
                  </label>
                  <input
                    type="date"
                    name="travel_date"
                    value={formData.travel_date}
                    onChange={handleChange}
                    className={`${inputClass} ${
                      errors.travel_date ? "border-red-500" : ""
                    }`}
                  />
                </div>

                {/* Contact */}
                <input
                  name="name"
                  value={formData.name}
                  placeholder="Full Name"
                  onChange={handleChange}
                  className={`${inputClass} ${errors.name ? "border-red-500" : ""}`}
                />

                <input
                  name="email"
                  value={formData.email}
                  placeholder="Email Address"
                  type="email"
                  onChange={handleChange}
                  className={`${inputClass} ${errors.email ? "border-red-500" : ""}`}
                />

                <input
                  name="phone"
                  value={formData.phone}
                  placeholder="Phone Number"
                  onChange={handleChange}
                  className={inputClass}
                />

                {/* Message */}
                <textarea
                  name="message"
                  value={formData.message}
                  rows="3"
                  placeholder="Special requests or custom ideas..."
                  onChange={handleChange}
                  className={inputClass}
                />

                {/* Actions */}
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className={`w-full sm:w-auto text-center order-3 sm:order-1 ${finalTheme.subText} hover:opacity-70`}
                  >
                    Cancel
                  </button>

                  <div className="flex w-full sm:w-auto gap-3 flex-col sm:flex-row order-1 sm:order-2">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      type="button"
                      onClick={handleWhatsApp}
                      className="px-6 py-3 rounded-full bg-[#25D366] text-white flex justify-center items-center gap-2 font-medium shadow-md hover:bg-[#20bd5a] transition-colors"
                    >
                      WhatsApp Quote
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      type="submit"
                      className={`px-8 py-3 rounded-full font-medium whitespace-nowrap shadow-md transition-colors ${finalTheme.btnBg} ${finalTheme.btnText}`}
                    >
                      {status === "sending" ? "Requesting..." : "Email Quote"}
                    </motion.button>
                  </div>
                </div>

                {/* Status Feedback */}
                {status === "success" && (
                  <p className="text-green-500 text-sm text-center pt-2 font-medium">
                    ✅ Request sent! We will contact you shortly.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-red-500 text-sm text-center pt-2 font-medium">
                    ❌ Failed to send. Please try again or use WhatsApp.
                  </p>
                )}
              </form>
            </div>

            {/* Right Side: Image */}
            <div className="hidden md:flex w-1/2 relative bg-gray-100 items-center justify-center p-8">
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-black/20 z-0"></div>
              <img
                src="/calltoaction.png"
                alt="Safari Adventure"
                className="w-full max-w-md object-contain z-10 drop-shadow-2xl"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BookingModal;