import React from "react";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaWhatsapp,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: <FaInstagram size={18} />, link: "#", label: "Instagram" },
    { icon: <FaFacebookF size={16} />, link: "#", label: "Facebook" },
    { icon: <FaWhatsapp size={18} />, link: "#", label: "WhatsApp" },
  ];

  const quickLinks = [
    { path: "/#about", label: "About Us" },
    { path: "/#gallery", label: "Gallery" },
    { path: "/#testimonials", label: "Testimonials" },
    { path: "/#blog", label: "Travel Blog" },
    { path: "/#contact", label: "Contact Us" },
  ];

  return (
    <footer className="bg-[#050505] text-white/60 pt-24 pb-10 border-t border-white/10 antialiased font-sans relative overflow-hidden">
      {/* Subtle background glow effect for a premium feel */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[100px] bg-white/5 blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 mb-20">

          

          {/* Links */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-[0.15em] mb-8">
              Explore
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="group flex items-center text-[15px] text-white/60 hover:text-white transition-all duration-300 w-fit"
                  >
                    <span className="transform group-hover:translate-x-1 transition-transform duration-300">
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-[0.15em] mb-8">
              Contact
            </h4>
            <ul className="space-y-5 text-[15px] text-white/60 font-light">
              <li className="flex items-start gap-4 group">
                <FaMapMarkerAlt className="mt-1 text-white/40 group-hover:text-white transition-colors duration-300" />
                <span className="group-hover:text-white transition-colors duration-300">
                  Nairobi, Kenya
                </span>
              </li>
              <li className="flex items-center gap-4 group">
                <FaPhoneAlt className="text-white/40 group-hover:text-white transition-colors duration-300" />
                <a href="tel:+254123456789" className="group-hover:text-white transition-colors duration-300">
                  +254 113 073 535
                </a>
              </li>
              <li className="flex items-center gap-4 group">
                <FaEnvelope className="text-white/40 group-hover:text-white transition-colors duration-300" />
                <a href="mailto:info@afribidesafaris.com" className="group-hover:text-white transition-colors duration-300">
                  info@afribidesafaris.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-[0.15em] mb-8">
              Stay Updated
            </h4>
            <p className="text-[15px] text-white/50 font-light mb-6 leading-relaxed">
              Get updates on new safari experiences and curated travel insights.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex items-center p-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl focus-within:border-white/30 focus-within:bg-white/10 transition-all duration-300"
            >
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-transparent px-4 py-2.5 text-[15px] text-white placeholder-white/30 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="px-5 py-2.5 text-sm font-medium text-black bg-white rounded-lg hover:bg-gray-200 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Divider & Bottom Section */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Copyright */}
          <p className="text-sm font-light text-white">
            © {currentYear} Afribide Safaris. All rights reserved.
          </p>

          {/* Socials */}
          <div className="flex items-center gap-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-white hover:text-white transform hover:scale-110 hover:-translate-y-1 transition-all duration-300"
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;