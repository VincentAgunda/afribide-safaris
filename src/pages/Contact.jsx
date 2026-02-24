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

  /* ---------------------------------- */
  /* Responsive Detection */
  /* ---------------------------------- */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ---------------------------------- */
  /* Apple-style Scroll Depth */
  /* ---------------------------------- */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [8, 0]);
  const y = useTransform(scrollYProgress, [0, 1], [80, 0]);

  /* ---------------------------------- */
  /* Validation */
  /* ---------------------------------- */
  const validate = useCallback(() => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.match(/^\S+@\S+\.\S+$/))
      newErrors.email = "Enter a valid email";
    if (!formData.message.trim())
      newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  /* ---------------------------------- */
  /* Send Email */
  /* ---------------------------------- */
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
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <section
      ref={sectionRef}
      className="relative max-w-7xl mx-auto my-40 rounded-[40px] overflow-hidden"
      style={{ perspective: 1400 }}
    >
      {/* Animated Soft Gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-neutral-200 via-neutral-100 to-neutral-300"
        animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
        style={{ backgroundSize: "200% 200%" }}
      />

      {/* Content */}
      <motion.div
        style={
          isMobile
            ? {}
            : {
                scale,
                rotateX,
                y,
                transformStyle: "preserve-3d",
              }
        }
        className="relative grid grid-cols-1 lg:grid-cols-2 items-center gap-12 px-8 md:px-16 py-28 bg-white/60 backdrop-blur-2xl rounded-[40px] shadow-[0_40px_120px_rgba(0,0,0,0.12)]"
      >
        {/* LEFT */}
        <div>
          <h2 className="text-5xl md:text-7xl font-semibold tracking-tight text-neutral-900 leading-[1.05] mb-8">
            Let’s create <br /> something meaningful.
          </h2>

          

          <motion.button
            whileHover={{ y: -3 }}
            whileTap={{ scale: 0.97 }}
            transition={{ duration: 0.25, ease: easing }}
            onClick={() => setOpen(true)}
            className="bg-black text-white px-10 py-4 rounded-full text-lg font-medium shadow-xl"
          >
            Start a Conversation
          </motion.button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="flex justify-center lg:justify-end">
          <img
            src="/calltoaction.png"
            alt="Contact"
            className="w-72 md:w-96 object-contain drop-shadow-2xl"
            loading="lazy"
          />
        </div>
      </motion.div>

      {/* ========================================== */}
      {/* MODAL / SHEET */}
      {/* ========================================== */}

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-xl flex items-center justify-center z-50 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={
                isMobile
                  ? { y: "100%" }
                  : { scale: 0.95, opacity: 0, y: 30 }
              }
              animate={
                isMobile
                  ? { y: 0 }
                  : { scale: 1, opacity: 1, y: 0 }
              }
              exit={
                isMobile
                  ? { y: "100%" }
                  : { scale: 0.95, opacity: 0, y: 30 }
              }
              transition={{
                type: "spring",
                stiffness: 260,
                damping: 28,
              }}
              className={`bg-white rounded-3xl shadow-[0_30px_100px_rgba(0,0,0,0.18)] w-full max-w-xl ${
                isMobile ? "fixed bottom-0 rounded-b-none p-6" : "p-10"
              }`}
            >
              <h3 className="text-3xl font-semibold mb-8 tracking-tight text-neutral-900">
                Get in touch
              </h3>

              <form ref={formRef} onSubmit={sendEmail} className="space-y-6">
                {["name", "email", "phone"].map((field) => (
                  <div key={field}>
                    <input
                      name={field}
                      type={field === "email" ? "email" : "text"}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      onChange={handleChange}
                      className={`w-full border px-5 py-4 rounded-2xl transition-all focus:outline-none ${
                        errors[field]
                          ? "border-red-400 focus:ring-2 focus:ring-red-400"
                          : "border-neutral-200 focus:ring-2 focus:ring-black"
                      }`}
                    />
                    {errors[field] && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors[field]}
                      </p>
                    )}
                  </div>
                ))}

                <textarea
                  name="message"
                  rows="4"
                  placeholder="Tell me about your project"
                  onChange={handleChange}
                  className={`w-full border px-5 py-4 rounded-2xl transition-all focus:outline-none ${
                    errors.message
                      ? "border-red-400 focus:ring-2 focus:ring-red-400"
                      : "border-neutral-200 focus:ring-2 focus:ring-black"
                  }`}
                />

                {status === "success" && (
                  <p className="text-green-600 text-sm">
                    Message sent successfully.
                  </p>
                )}
                {status === "error" && (
                  <p className="text-red-500 text-sm">
                    Failed to send. Try again.
                  </p>
                )}

                <div className="flex justify-between items-center pt-4">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="text-neutral-500"
                  >
                    Cancel
                  </button>

                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.96 }}
                    transition={{ duration: 0.2, ease: easing }}
                    type="submit"
                    disabled={status === "sending"}
                    className="px-8 py-3 rounded-full bg-black text-white font-medium disabled:opacity-60"
                  >
                    {status === "sending" ? "Sending..." : "Send Message"}
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