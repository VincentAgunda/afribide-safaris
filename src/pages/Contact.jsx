import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
} from "framer-motion";
import emailjs from "@emailjs/browser";

const easing = [0.22, 1, 0.36, 1];

const Contact = () => {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [status, setStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const formRef = useRef(null);
  const sectionRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [8, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);

  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.match(/^\S+@\S+\.\S+$/))
      newErrors.email = "Enter a valid email";
    if (!formData.message.trim())
      newErrors.message = "Please tell us your safari plans";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
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
      setFormData({ name: "", email: "", phone: "", message: "" });
      formRef.current.reset();
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative max-w-7xl mx-auto my-40 rounded-[40px] overflow-hidden"
      style={{ perspective: 1400 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-[#e5e5e1] via-[#f5f5f7] to-[#d4d4d0]"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        style={{ backgroundSize: "200% 200%" }}
      />

      <motion.div
        style={isMobile ? {} : { scale, rotateX, y, transformStyle: "preserve-3d" }}
        className="relative grid grid-cols-1 lg:grid-cols-2 items-center gap-12 px-8 md:px-16 py-28 bg-white/60 backdrop-blur-2xl rounded-[40px] shadow-[0_40px_120px_rgba(0,0,0,0.12)]"
      >
        <div>
          <h2 className="text-5xl md:text-7xl font-semibold tracking-tight text-neutral-900 leading-[1.05] mb-8">
            Your wild adventure <br /> begins here.
          </h2>
          <p className="text-xl text-neutral-600 mb-10 max-w-md leading-relaxed">
            Ready to plan your dream safari? Reach out to our experts and let’s craft 
            your perfect African itinerary.
          </p>

          <motion.button
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setOpen(true)}
            className="bg-black text-white px-10 py-4 rounded-full text-lg font-medium shadow-xl hover:bg-neutral-800 transition-colors"
          >
            Start Your Journey
          </motion.button>
        </div>

        <div className="flex justify-center lg:justify-end">
          <img
            src="/calltoaction.png" // Ensure this is a relevant safari image or icon
            alt="Safari Contact"
            className="w-72 md:w-[450px] object-contain drop-shadow-2xl"
            loading="lazy"
          />
        </div>
      </motion.div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-xl flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={isMobile ? { y: "100%" } : { scale: 0.95, opacity: 0, y: 30 }}
              animate={isMobile ? { y: 0 } : { scale: 1, opacity: 1, y: 0 }}
              exit={isMobile ? { y: "100%" } : { scale: 0.95, opacity: 0, y: 30 }}
              className={`bg-white rounded-3xl shadow-2xl w-full max-w-xl ${
                isMobile ? "fixed bottom-0 rounded-b-none p-6" : "p-10"
              }`}
            >
              <h3 className="text-3xl font-semibold mb-2 tracking-tight text-neutral-900">
                Plan Your Safari
              </h3>
              <p className="text-neutral-500 mb-8">Fill in your details and we'll be in touch.</p>

              <form ref={formRef} onSubmit={sendEmail} className="space-y-5">
                {["name", "email", "phone"].map((field) => (
                  <div key={field}>
                    <input
                      name={field}
                      type={field === "email" ? "email" : "text"}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      onChange={handleChange}
                      className={`w-full border px-5 py-4 rounded-2xl transition-all focus:outline-none ${
                        errors[field] ? "border-red-400 bg-red-50/30" : "border-neutral-200 focus:ring-2 focus:ring-black"
                      }`}
                    />
                  </div>
                ))}

                <textarea
                  name="message"
                  rows="4"
                  placeholder="Tell us about your preferred destinations, travel dates, or specific interests (e.g., photography, family, bird watching)..."
                  onChange={handleChange}
                  className={`w-full border px-5 py-4 rounded-2xl transition-all focus:outline-none ${
                    errors.message ? "border-red-400 bg-red-50/30" : "border-neutral-200 focus:ring-2 focus:ring-black"
                  }`}
                />

                <div className="flex justify-between items-center pt-4">
                  <button type="button" onClick={() => setOpen(false)} className="text-neutral-500 hover:text-black">
                    Cancel
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    disabled={status === "sending"}
                    className="px-8 py-3 rounded-full bg-black text-white font-medium disabled:opacity-60"
                  >
                    {status === "sending" ? "Sending Request..." : "Request Itinerary"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Contact;