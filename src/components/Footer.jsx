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
    { icon: <FaInstagram />, link: "#", label: "Instagram" },
    { icon: <FaFacebookF />, link: "#", label: "Facebook" },
    { icon: <FaWhatsapp />, link: "#", label: "WhatsApp" },
  ];

  const quickLinks = [
    { path: "/#about", label: "About Us" },
    { path: "/#gallery", label: "Gallery" },
    { path: "/#testimonials", label: "Testimonials" },
    { path: "/#blog", label: "Travel Blog" },
    { path: "/#contact", label: "Contact Us" },
  ];

  return (
    <footer className="bg-[#0a0a0a] text-gray-500 pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14 mb-20">

          {/* Brand */}
          <div className="space-y-5">
            <h3 className="text-white text-[22px] font-semibold tracking-tight">
              Afribide Safaris
            </h3>
            <p className="text-sm leading-relaxed text-gray-500 max-w-xs">
              Curated African journeys designed with precision, elegance, and a deep respect for the wild.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white text-sm font-medium mb-6 tracking-wide">
              Explore
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.path}
                    className="text-sm text-gray-500 hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white text-sm font-medium mb-6 tracking-wide">
              Contact
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <FaMapMarkerAlt className="mt-1 text-gray-600" />
                <span>
                  Nairobi, Kenya
                </span>
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors">
                <FaPhoneAlt className="text-gray-600" />
                <a href="tel:+254123456789">+254 123 456 789</a>
              </li>
              <li className="flex items-center gap-3 hover:text-white transition-colors">
                <FaEnvelope className="text-gray-600" />
                <a href="mailto:info@afribidesafaris.com">
                  info@afribidesafaris.com
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white text-sm font-medium mb-6 tracking-wide">
              Stay Updated
            </h4>
            <p className="text-sm text-gray-500 mb-5">
              Get updates on new safari experiences and curated travel insights.
            </p>

            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex border border-white/10 rounded-lg overflow-hidden"
            >
              <input
                type="email"
                placeholder="Email address"
                className="w-full bg-transparent px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none"
                required
              />
              <button
                type="submit"
                className="px-4 text-sm text-white bg-white/10 hover:bg-white/20 transition"
              >
                →
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">

          {/* Copyright */}
          <p className="text-xs text-gray-600">
            © {currentYear} Afribide Safaris. All rights reserved.
          </p>

          {/* Socials */}
          <div className="flex items-center gap-5">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.link}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="text-gray-600 hover:text-white transition-colors duration-300 text-sm"
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