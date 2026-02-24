import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { FaSearch, FaUserCircle, FaBars, FaTimes } from "react-icons/fa"; 
import { Link, useLocation } from "react-router-dom";
import { auth } from "../firebase"; // Keep your existing imports
import { signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { path: "/#about", label: "About me" },
  { path: "/#skills", label: "Skills" },
  { path: "/#portfolio", label: "Portfolio" },
];

const Header = React.memo(({ user }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const dropdownRef = useRef(null);
  const menuRef = useRef(null);
  const searchRef = useRef(null);
  const location = useLocation();

  const closeAllMenus = useCallback(() => {
    setDropdownOpen(false);
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
    setSearchOpen(false);
  }, []);

  const toggleSearch = useCallback(() => {
    setSearchOpen((prev) => !prev);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  }, []);

  // Custom Click Handler for Hash Links & Home
  const handleNavClick = useCallback((e, path) => {
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
    navLinks.map((link) => {
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
  ), [handleNavClick, location.pathname, location.hash, isScrolled]);

  const renderMobileMenuLinks = useMemo(() => (
    navLinks.map((link, index) => {
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
          
          {/* LOGO (Updated to use logo.png) */}
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
                alt="Brand Logo" 
                className="h-10 md:h-12 w-auto object-contain" 
              />
            </Link>
          </motion.div>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex flex-1 justify-end items-center space-x-10 pr-10">
            <ul className="flex space-x-8 items-center">
              {renderNavLinks}
            </ul>
            
            {/* Contact Me Button */}
            <Link
              to="/#contact"
              onClick={(e) => handleNavClick(e, "/#contact")}
              className={`px-6 py-2.5 rounded-full font-medium transition-all ${
                isScrolled 
                ? "bg-black text-white hover:bg-gray-800" 
                : "bg-white text-black hover:bg-gray-100"
              }`}
            >
              Contact Me
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
                      Contact Me
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