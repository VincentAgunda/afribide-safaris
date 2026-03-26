import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { FaSearch, FaUserCircle, FaBars, FaTimes, FaChevronDown } from "react-icons/fa"; 
import { Link, useLocation } from "react-router-dom";
import { auth } from "../firebase"; 
import { signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";

// Updated links logic to support dropdowns
const navLinks = [
  { path: "/#about", label: "About Us" },
  { path: "/#gallery", label: "Gallery" },
  {
    label: "Testimonials & Blogs",
    isDropdown: true,
    subLinks: [
      { path: "/#testimonials", label: "Testimonials" },
      { path: "/#blog", label: "Blogs" },
    ],
  },
];

const Header = React.memo(({ user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navDropdownOpen, setNavDropdownOpen] = useState(false); // For Testimonials & Blogs
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const dropdownRef = useRef(null);
  const navDropdownRef = useRef(null);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const location = useLocation();

  const closeAllMenus = useCallback(() => {
    setDropdownOpen(false);
    setNavDropdownOpen(false);
    setMobileMenuOpen(false);
    setSearchOpen(false);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      closeAllMenus();
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [closeAllMenus]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen((prev) => !prev);
    setDropdownOpen(false);
    setNavDropdownOpen(false);
    setSearchOpen(false);
  }, []);

  // Custom Click Handler for Hash Links & Home
  const handleNavClick = useCallback((e, path) => {
    if (!path) return; // Prevent errors on empty paths (dropdown toggles)
    if (path === "/") {
      if (location.pathname === "/") {
        e.preventDefault(); 
        window.scrollTo({ top: 0, behavior: "smooth" }); 
        window.history.pushState(null, '', '/'); 
      }
    } else if (path.startsWith("/#") && location.pathname === "/") {
      e.preventDefault();
      const id = path.substring(2);
      const element = document.getElementById(id + "-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, '', path);
      }
    }
    closeAllMenus();
  }, [location.pathname, closeAllMenus]);

  const isScrolled = scrollY > 10;

  const renderNavLinks = useMemo(() => (
    navLinks.map((link, idx) => {
      if (link.isDropdown) {
        return (
          <li key={idx} className="relative" ref={navDropdownRef}>
            <button
              onClick={() => setNavDropdownOpen(!navDropdownOpen)}
              className={`flex items-center px-2 py-1 transition-colors duration-200 group outline-none ${
                isScrolled ? "text-gray-800 hover:text-black dark:text-gray-300 dark:hover:text-white" : "text-gray-300 hover:text-white"
              }`}
            >
              {link.label}
              <FaChevronDown className={`ml-1 text-xs transition-transform duration-200 ${navDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {navDropdownOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700"
                >
                  {link.subLinks.map((subLink) => (
                    <li key={subLink.path}>
                      <Link
                        to={subLink.path}
                        className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        onClick={(e) => handleNavClick(e, subLink.path)}
                      >
                        {subLink.label}
                      </Link>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        );
      }

      const isActive = location.pathname === link.path || 
                       (link.path.includes(location.hash) && location.hash !== "");
                       
      return (
        <li key={link.path}>
          <Link
            to={link.path}
            className={`relative px-2 py-1 transition-colors duration-200 group ${
              isActive ? "font-medium" : ""
            } ${isScrolled ? "text-gray-800 hover:text-black dark:text-gray-300 dark:hover:text-white" : "text-gray-300 hover:text-white"}`}
            onClick={(e) => handleNavClick(e, link.path)}
          >
            {link.label}
            <span className={`absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ${
              isActive ? "w-full" : "w-0 group-hover:w-full"
            }`}></span>
          </Link>
        </li>
      );
    })
  ), [handleNavClick, location.pathname, location.hash, isScrolled, navDropdownOpen]);

  const renderMobileMenuLinks = useMemo(() => (
    navLinks.map((link, index) => {
      if (link.isDropdown) {
        return (
          <div key={index}>
            <p className="block py-2 px-4 text-sm font-semibold text-gray-400 uppercase tracking-wider">
              {link.label}
            </p>
            {link.subLinks.map((subLink, subIdx) => (
              <motion.li
                key={subLink.path}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 + 0.1 + (subIdx * 0.05) }}
                className="ml-4 border-l-2 border-gray-100 dark:border-gray-800"
              >
                <Link
                  to={subLink.path}
                  className="block py-2 px-4 text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                  onClick={(e) => handleNavClick(e, subLink.path)}
                >
                  {subLink.label}
                </Link>
              </motion.li>
            ))}
          </div>
        );
      }

      const isActive = location.pathname === link.path || 
                       (link.path.includes(location.hash) && location.hash !== "");
                       
      return (
        <motion.li
          key={link.path}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: index * 0.05 + 0.1 }}
        >
          <Link
            to={link.path}
            className={`block py-2 px-4 rounded-lg transition-colors text-sm ${
              isActive 
                ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 text-blue-600 dark:text-blue-400"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100/50 dark:hover:bg-gray-700/50"
            }`}
            onClick={(e) => handleNavClick(e, link.path)}
          >
            {link.label}
          </Link>
        </motion.li>
      );
    })
  ), [handleNavClick, location.pathname, location.hash]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (navDropdownRef.current && !navDropdownRef.current.contains(event.target)) {
        setNavDropdownOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target) && 
          !event.target.closest('[aria-label="Mobile menu"]')) {
        setMobileMenuOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target) && 
          !event.target.closest('[aria-label="Search"]')) {
        setSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.header 
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm" 
            : "bg-transparent"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <nav className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center h-24">
          
          {/* LOGO */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
          >
            <Link 
              to="/" 
              onClick={(e) => handleNavClick(e, "/")}
              className="flex items-center"
            >
              <img 
                src="/logo.png" 
                alt="Afribide Safaris" 
                className="h-10 md:h-12 w-auto object-contain" 
              />
            </Link>
          </motion.div>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex flex-1 justify-end items-center space-x-10 pr-10">
            <ul className="flex space-x-8 items-center">
              {renderNavLinks}
            </ul>
            
            {/* Contact Us Button */}
            <Link
              to="/#contact"
              onClick={(e) => handleNavClick(e, "/#contact")}
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                isScrolled 
                ? "bg-black text-white hover:bg-gray-800" 
                : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              Contact Us
            </Link>
          </div>

          {/* MOBILE MENU / AUTH */}
          <div className="flex items-center space-x-4">
            <motion.button
              className={`md:hidden focus:outline-none p-2 rounded-full transition-colors ${
                isScrolled ? "text-black" : "text-white"
              }`}
              onClick={toggleMobileMenu}
              aria-label="Mobile menu"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </motion.button>
          </div>
        </nav>

        {/* MOBILE MENU DROPDOWN */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 z-40 md:hidden"
                onClick={closeAllMenus}
              />
              <motion.div
                ref={menuRef}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", ease: "easeOut", duration: 0.25 }}
                className="fixed top-0 right-0 w-64 h-full z-50 bg-white dark:bg-gray-900 shadow-lg p-6 overflow-y-auto"
              >
                <div className="flex justify-end mb-8">
                   <button onClick={toggleMobileMenu}><FaTimes size={24} className="text-gray-800 dark:text-white" /></button>
                </div>
                <ul className="space-y-4">
                  {renderMobileMenuLinks}
                  <motion.li initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
                    <Link
                      to="/#contact"
                      className="block py-2 px-4 mt-4 bg-black text-white text-center rounded-lg"
                      onClick={(e) => handleNavClick(e, "/#contact")}
                    >
                      Contact Us
                    </Link>
                  </motion.li>
                </ul>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
});

Header.displayName = "Header";
export default Header;