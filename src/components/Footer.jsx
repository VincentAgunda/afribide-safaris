import React from "react";
import { FaInstagram, FaFacebookF, FaWhatsapp } from "react-icons/fa";

function Footer() {
  const socialLinks = [
    {
      icon: <FaInstagram />,
      link: "#", // Update with actual Afribide Instagram link
      label: "Instagram",
    },
    {
      icon: <FaFacebookF />,
      link: "#", // Update with actual Afribide Facebook link
      label: "Facebook",
    },
    {
      icon: <FaWhatsapp />,
      link: "#", // Update with actual Afribide WhatsApp wa.me link
      label: "WhatsApp",
    },
  ];

  return (
    <footer className="bg-black text-gray-400 py-12">
      <div className="max-w-6xl mx-auto px-6 flex flex-col items-center space-y-6">

        {/* Brand Name */}
        <h3 className="text-white text-xl font-semibold tracking-tight">
          Afribide Safaris
        </h3>

        {/* Short Tagline */}
        <p className="text-sm text-gray-500 text-center max-w-md">
          Experience the wild like never before. Designing unforgettable African adventures and tailor-made safaris.
        </p>

        {/* Social Icons */}
        <div className="flex space-x-6">
          {socialLinks.map((social, index) => (
            <a
              key={index}
              href={social.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="text-gray-500 hover:text-white transition duration-300 text-xl"
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="text-xs text-gray-600 pt-4">
          © {new Date().getFullYear()} Afribide Safaris. All rights reserved.
        </p>

      </div>
    </footer>
  );
}

export default Footer;