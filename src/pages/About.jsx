import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSun, FaMoon, FaTimes, FaLinkedin, FaTwitter } from "react-icons/fa";

// Updated Material-UI icons for a Safari/Travel theme
import ExploreOutlinedIcon from '@mui/icons-material/ExploreOutlined';
import PublicOutlinedIcon from '@mui/icons-material/PublicOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const modalVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.2,
      ease: "easeIn"
    }
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

// Updated Data for Afribide Safaris
const TEAM_MEMBERS = [
  {
    id: 1,
    name: "Vincent Agunda",
    role: "Founder & Lead Safari Guide",
    bio: "Born in the heart of East Africa, Vincent curates authentic and thrilling wilderness experiences.",
    image: "guide-vincent.jpg", // Update with actual image
    linkedin: "#",
    twitter: "#"
  },
  {
    id: 2,
    name: "Brian Okungu",
    role: "Head of Travel Operations",
    bio: "Ensuring every logistical detail is flawless for a seamless African adventure.",
    image: "guide-brian1.jpg", // Update with actual image
    linkedin: "#",
    twitter: "#"
  },
  {
    id: 3,
    name: "Brian Oloo",
    role: "Wildlife & Conservation Expert",
    bio: "Passionate about sustainable tourism and protecting Africa's natural heritage.",
    image: "guide-brian2.jpg", // Update with actual image
    linkedin: "#",
    twitter: "#"
  }
];

const CORE_VALUES = [
  {
    title: "Authenticity",
    description: "Real, unfiltered encounters with Africa's majestic wildlife and cultures.",
    icon: ExploreOutlinedIcon 
  },
  {
    title: "Conservation",
    description: "Committed to sustainable travel that protects habitats and uplifts local communities.",
    icon: PublicOutlinedIcon 
  },
  {
    title: "Tailor-Made",
    description: "Bespoke itineraries designed from scratch to match your unique travel dreams.",
    icon: MapOutlinedIcon 
  }
];

const AboutPage = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [showTeam, setShowTeam] = useState(false);
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const formRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    plan: '',
    message: ''
  });
  
  const [message, setMessage] = useState('');

  const sendEmail = (e) => {
    e.preventDefault();
    setMessage("Sending your inquiry...");
    setTimeout(() => {
      setMessage("Message sent successfully! Our safari experts will reach out shortly.");
      setFormData({ name: '', email: '', phone: '', plan: '', message: '' });
    }, 2000);
  };

  return (
    <section className={`${darkMode ? "bg-black" : "bg-white"} min-h-screen transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto py-12 px-4 md:px-6">
        {/* Theme Toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full text-xs transition-all"
          >
            {darkMode ? <FaSun size={14} /> : <FaMoon size={14} />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>
        </div>

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-8 md:py-12 flex flex-col md:flex-row items-center gap-6 md:gap-8">
          <div className="flex-1">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="mb-4"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                    delayChildren: 0.15
                  }
                }
              }}
            >
              <motion.h1
                className={`text-3xl md:text-4xl font-medium leading-tight mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
                variants={fadeInUp}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Unforgettable</span> African
              </motion.h1>
              <motion.h1
                className={`text-3xl md:text-4xl font-medium leading-tight mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
                variants={fadeInUp}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">safaris</span> tailored
              </motion.h1>
              <motion.h1
                className={`text-3xl md:text-4xl font-medium leading-tight mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
                variants={fadeInUp}
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">just for you</span>
              </motion.h1>
            </motion.div>

            <motion.p
              className={`text-lg mb-6 max-w-lg ${darkMode ? "text-white/80" : "text-gray-700"}`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeInUp}
              transition={{ delay: 0.6 }}
            >
              Our journey is rooted in a deep love for the African continent. We are a collective of <span className={`${darkMode ? "text-cyan-400" : "text-blue-600"}`}>passionate guides</span> and <span className={`${darkMode ? "text-cyan-400" : "text-blue-600"}`}>travel experts</span>, dedicated to designing bespoke wilderness adventures that not only thrill but also respect the <span className={`${darkMode ? "text-cyan-400" : "text-blue-600"}`}>natural habitats</span> and local communities.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5, ease:"circOut" }}
            className="flex-1 aspect-video md:aspect-square bg-gray-800 rounded-xl overflow-hidden border border-gray-700 shadow-lg"
          >
            {/* Update this image source to a safari picture */}
            <img
              src="/safari-hero.jpg" 
              alt="Afribide Safari Experience"
              className="w-full h-full object-cover"
              loading="lazy"
              width="500"
              height="500"
            />
          </motion.div>
        </div>

        {/* Values Section */}
        <motion.div
          className="container mx-auto px-4 py-12 mb-16"
          initial="hidden"
          whileInView="visible"
          variants={fadeInUp}
          viewport={{ once: true, margin: "-50px" }}
        >
          <motion.h2
            className={`text-2xl md:text-3xl font-medium text-center mb-12 ${darkMode ? "text-white" : "text-gray-900"}`}
            variants={fadeInUp}
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Our Core</span> Values
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            {CORE_VALUES.map((item, index) => (
              <motion.div
                key={item.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeInUp}
                transition={{ delay: index * 0.2, duration: 0.7, ease: "easeOut" }}
                className={`p-6 rounded-lg ${darkMode ? "bg-gray-900/60" : "bg-gray-50/80"} border ${darkMode ? "border-gray-700/50" : "border-gray-200/80"} hover:border-cyan-400/50 transition-all duration-300`}
                whileHover={{ y: -5, boxShadow: darkMode ? "0px 8px 15px rgba(0, 220, 220, 0.15)" : "0px 8px 15px rgba(50, 100, 250, 0.1)" }}
              >
                <div className={`text-3xl mb-3 ${darkMode ? "text-cyan-300" : "text-blue-500"}`}>
                  <item.icon fontSize="large" />
                </div>
                <h3 className={`text-lg font-medium mb-1.5 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {item.title}
                </h3>
                <p className={`text-sm ${darkMode ? "text-white/70" : "text-gray-600"}`}>
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className={`rounded-3xl p-8 text-center ${darkMode ? "bg-gray-900/60" : "bg-gray-100/80"} border ${darkMode ? "border-gray-700/50" : "border-gray-200/80"} mb-16 shadow-md`}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{duration: 0.6, ease: "easeOut"}}
        >
          <motion.h2
            className={`text-2xl md:text-3xl font-medium mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}
            variants={fadeInUp}
            initial="hidden" whileInView="visible" viewport={{ once: true }}
          >
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">explore</span> the wild with us?
          </motion.h2>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <motion.button
              onClick={() => setShowConsultationModal(true)}
              variants={fadeInUp}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className={`px-6 py-2.5 rounded-lg font-semibold border-2 ${darkMode ? "border-cyan-400 text-white hover:bg-cyan-400/10" : "border-blue-600 text-blue-600 hover:bg-blue-600/10"} transition-all duration-300 text-sm`}
              whileHover={{ scale: 1.03, y: -2, boxShadow: darkMode ? "0px 4px 12px rgba(0, 200, 200, 0.2)" : "0px 4px 12px rgba(59, 130, 246, 0.15)" }}
              whileTap={{ scale: 0.97 }}
            >
              Plan Your Safari
            </motion.button>

            <motion.button
              onClick={() => setShowTeam(true)}
              variants={fadeInUp}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
              transition={{ delay: 0.25 }}
              className={`px-6 py-2.5 rounded-lg font-semibold transition-all duration-300 text-sm ${darkMode ? "bg-gray-800 text-white hover:bg-gray-700" : "bg-gray-200 text-gray-800 hover:bg-gray-300"}`}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              Meet Our Team
            </motion.button>
          </div>
        </motion.div>

        {/* Consultation Form Modal */}
        <AnimatePresence>
          {showConsultationModal && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setShowConsultationModal(false)}
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className={`relative w-full max-w-md max-h-[90vh] rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-900/90 border border-gray-700' : 'bg-white/95 border border-gray-200'} shadow-xl flex flex-col`}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
              >
                <button
                  onClick={() => setShowConsultationModal(false)}
                  className={`absolute top-3 right-3 z-10 p-1.5 rounded-full ${darkMode ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white' : 'text-gray-500 hover:bg-gray-200/70 hover:text-gray-800'} transition-colors`}
                  aria-label="Close modal"
                >
                  <FaTimes className="text-lg" />
                </button>

                <div className={`overflow-y-auto flex-1 p-5 md:p-6`}>
                  <motion.h2
                    id="modal-title"
                    className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}
                    variants={staggerItem}
                  >
                    Start Your Adventure
                  </motion.h2>

                  <form ref={formRef} onSubmit={sendEmail}>
                    <motion.div
                      variants={{
                        visible: { 
                          transition: { 
                            staggerChildren: 0.05 
                          } 
                        }
                      }}
                      initial="hidden"
                      animate="visible"
                      className="space-y-3"
                    >
                      <motion.div variants={staggerItem}>
                        <label htmlFor="name" className={`block text-xs mb-1 ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>Your Name</label>
                        <input id="name" type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className={`w-full rounded-lg px-3 py-2.5 ${darkMode ? 'bg-gray-800 text-white placeholder-gray-500 border-gray-700' : 'bg-gray-100 text-gray-900 placeholder-gray-400 border-gray-300'} border focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none transition text-sm`} required placeholder="e.g. Jane Doe"/>
                      </motion.div>
                      <motion.div variants={staggerItem}>
                        <label htmlFor="email" className={`block text-xs mb-1 ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>Email Address</label>
                        <input id="email" type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className={`w-full rounded-lg px-3 py-2.5 ${darkMode ? 'bg-gray-800 text-white placeholder-gray-500 border-gray-700' : 'bg-gray-100 text-gray-900 placeholder-gray-400 border-gray-300'} border focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none transition text-sm`} required placeholder="you@example.com"/>
                      </motion.div>
                      <motion.div variants={staggerItem}>
                        <label htmlFor="phone" className={`block text-xs mb-1 ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>Phone Number </label>
                        <input id="phone" type="tel" name="phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className={`w-full rounded-lg px-3 py-2.5 ${darkMode ? 'bg-gray-800 text-white placeholder-gray-500 border-gray-700' : 'bg-gray-100 text-gray-900 placeholder-gray-400 border-gray-300'} border focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none transition text-sm`} placeholder="(Optional)"/>
                      </motion.div>
                      <motion.div variants={staggerItem}>
                        <label htmlFor="service" className={`block text-xs mb-1 ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>Type of Safari</label>
                        <select id="service" name="service" value={formData.plan} onChange={(e) => setFormData({...formData, plan: e.target.value})} className={`w-full rounded-lg px-3 py-2.5 ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-gray-100 text-gray-900 border-gray-300'} border focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none transition appearance-none text-sm`} required>
                          <option value="">Select an option</option>
                          <option value="Classic Safari">Classic Safari</option>
                          <option value="Luxury Lodge Safari">Luxury Lodge Safari</option>
                          <option value="Family Holiday">Family Holiday</option>
                          <option value="Custom Itinerary">Custom Tailor-Made Itinerary</option>
                        </select>
                      </motion.div>
                      <motion.div variants={staggerItem}>
                        <label htmlFor="message" className={`block text-xs mb-1 ${darkMode ? 'text-white/80' : 'text-gray-700'}`}>Trip Details</label>
                        <textarea id="message" name="message" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows="3" className={`w-full rounded-lg px-3 py-2.5 ${darkMode ? 'bg-gray-800 text-white placeholder-gray-500 border-gray-700' : 'bg-gray-100 text-gray-900 placeholder-gray-400 border-gray-300'} border focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400 outline-none transition text-sm`} required placeholder="Tell us about your dream trip, dates, and group size..."></textarea>
                      </motion.div>
                    </motion.div>

                    {message && (
                      <motion.div className={`mt-3 p-2 rounded-lg text-xs ${message.includes("successfully") ? (darkMode ? 'bg-green-500/20 text-green-300' : 'bg-green-100 text-green-700') : (darkMode ? 'bg-yellow-500/20 text-yellow-300' : 'bg-yellow-100 text-yellow-700')}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} role="alert" >
                        {message}
                      </motion.div>
                    )}
                    <motion.button type="submit" className="w-full mt-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold py-2.5 px-5 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 text-sm" variants={staggerItem} whileHover={{ scale: 1.01, y: -1, boxShadow: "0px 3px 10px rgba(0, 180, 180, 0.2)"}} whileTap={{ scale: 0.98 }} >
                      {message === "Sending your inquiry..." ? "Sending..." : "Send Request"}
                    </motion.button>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Team Popup Modal */}
        <AnimatePresence>
          {showTeam && (
            <motion.div
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black bg-opacity-60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTeam(false)}
            >
              <motion.div
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className={`relative w-full max-w-3xl max-h-[90vh] rounded-2xl overflow-hidden ${darkMode ? 'bg-gray-900/90 border border-gray-700' : 'bg-white/95 border border-gray-200'} shadow-xl flex flex-col`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={`p-3 md:p-4 sticky top-0 ${darkMode ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-sm border-b ${darkMode ? 'border-gray-700/50' : 'border-gray-200/50'} z-10 flex justify-between items-center`}>
                  <h3 className={`text-lg md:text-xl font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                      Meet Our Safari Experts
                    </span>
                  </h3>
                  <button
                    onClick={() => setShowTeam(false)}
                    className={`p-1.5 rounded-full ${darkMode ? 'text-gray-300 hover:bg-gray-700/50 hover:text-white' : 'text-gray-500 hover:bg-gray-200/70 hover:text-gray-800'} transition-colors`}
                    aria-label="Close team modal"
                  >
                    <FaTimes className="text-lg" />
                  </button>
                </div>

                <div className="overflow-y-auto p-3 md:p-5">
                  <motion.div
                    variants={{
                      visible: { 
                        transition: { 
                          staggerChildren: 0.08 
                        } 
                      }
                    }}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {TEAM_MEMBERS.map((member) => (
                      <motion.div
                        key={member.id}
                        variants={staggerItem}
                        className={`rounded-lg overflow-hidden ${darkMode ? 'bg-gray-800/70' : 'bg-gray-50/90'} border ${darkMode ? 'border-gray-700/60' : 'border-gray-200/70'} transition-all duration-300 hover:shadow-md`}
                        whileHover={{y: -3, boxShadow: darkMode ? "0px 5px 12px rgba(0,0,0,0.2)" : "0px 5px 12px rgba(0,0,0,0.08)"}}
                      >
                        <div className="h-40 w-full bg-gray-300 dark:bg-gray-700 relative overflow-hidden">
                          <img src={member.image} alt={member.name} className="w-full h-full object-cover object-center" loading="lazy" width="300" height="300" />
                        </div>
                        <div className="p-4">
                          <h3 className={`text-base font-semibold mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {member.name}
                          </h3>
                          <p className={`text-xs mb-2 font-medium ${darkMode ? 'text-cyan-400' : 'text-blue-600'}`}>
                            {member.role}
                          </p>
                          <p className={`text-xs mb-3 ${darkMode ? 'text-white/70' : 'text-gray-600'}`}>
                            {member.bio}
                          </p>
                          <div className="flex gap-2 mt-auto">
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className={`p-1.5 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-900'} transition-colors`}>
                              <FaLinkedin size={14} />
                            </a>
                            <a href={member.twitter} target="_blank" rel="noopener noreferrer" className={`p-1.5 rounded-full ${darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300 hover:text-gray-900'} transition-colors`}>
                              <FaTwitter size={14} />
                            </a>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default AboutPage;