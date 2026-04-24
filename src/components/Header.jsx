import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { FaUserCircle, FaBars, FaTimes, FaChevronDown, FaSignOutAlt, FaShieldAlt } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "../firebase";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { path: "/#about", label: "About Us" },
  { path: "/#gallery", label: "Explore" },
  { path: "/#full-gallery", label: "Gallery" },
  {
    label: "Testimonials & Blogs",
    isDropdown: true,
    subLinks: [
      { path: "/#testimonials", label: "Testimonials" },
      { path: "/#blog", label: "Blogs" },
    ],
  },
];

const Header = React.memo(() => {
  const { currentUser, userRole } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [navDropdownOpen, setNavDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const dropdownRef = useRef(null);
  const navDropdownRef = useRef(null);
  const menuRef = useRef(null);
  const location = useLocation();

  const closeAllMenus = useCallback(() => {
    setDropdownOpen(false);
    setNavDropdownOpen(false);
    setMobileMenuOpen(false);
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
  }, []);

  const handleNavClick = useCallback((e, path) => {
    if (!path) return;
    if (path === "/") {
      if (location.pathname === "/") {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
        window.history.pushState(null, "", "/");
      }
    } else if (path.startsWith("/#") && location.pathname === "/") {
      e.preventDefault();
      const id = path.substring(2);
      const element = document.getElementById(id + "-section");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        window.history.pushState(null, "", path);
      }
    }
    closeAllMenus();
  }, [location.pathname, closeAllMenus]);

  const isScrolled = scrollY > 10;
  const isAdmin = userRole === "admin";

  useEffect(() => {
    console.log("Auth status:", { currentUser: !!currentUser, userRole, isAdmin });
  }, [currentUser, userRole, isAdmin]);

  const renderNavLinks = useMemo(() => (
    navLinks.map((link, idx) => {
      if (link.isDropdown) {
        return (
          <li key={idx} className="relative h-full flex items-center" ref={navDropdownRef}>
            <button
              onClick={() => setNavDropdownOpen(!navDropdownOpen)}
              className={`flex items-center px-4 h-full text-sm tracking-wide transition-colors duration-200 outline-none ${
                isScrolled ? "text-gray-900 hover:text-[#8A4413]" : "text-white hover:text-gray-200"
              }`}
            >
              {link.label}
              <FaChevronDown className={`ml-2 text-[10px] transition-transform duration-200 ${navDropdownOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {navDropdownOpen && (
                <motion.ul
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 w-48 bg-[#F5F5F7] shadow-md border border-gray-200 rounded-sm overflow-hidden"
                >
                  {link.subLinks.map((subLink) => (
                    <li key={subLink.path}>
                      <Link
                        to={subLink.path}
                        className="block px-4 py-3 text-sm text-gray-800 hover:bg-[#8A4413] hover:text-white transition-colors"
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
        <li key={link.path} className="h-full">
          <Link
            to={link.path}
            className={`flex items-center px-6 h-full text-sm tracking-wide transition-colors duration-300 ${
              isActive
                ? (isScrolled ? "bg-[#8A4413] text-white" : "bg-white/20 text-white")
                : (isScrolled ? "text-gray-900 hover:bg-gray-100" : "text-white hover:bg-white/10")
            }`}
            onClick={(e) => handleNavClick(e, link.path)}
          >
            {link.label}
          </Link>
        </li>
      );
    })
  ), [handleNavClick, location.pathname, location.hash, isScrolled, navDropdownOpen]);

  const renderMobileMenuLinks = useMemo(() => (
    navLinks.map((link, index) => {
      if (link.isDropdown) {
        return (
          <div key={index} className="mb-2">
            <p className="block py-2 px-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">
              {link.label}
            </p>
            {link.subLinks.map((subLink, subIdx) => (
              <motion.li
                key={subLink.path}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 + 0.1 + (subIdx * 0.05) }}
                className="ml-4 border-l border-gray-300"
              >
                <Link
                  to={subLink.path}
                  className="block py-2 px-4 text-sm text-gray-700 hover:text-[#8A4413]"
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
            className={`block py-3 px-4 transition-colors text-sm tracking-wide ${
              isActive
                ? "bg-[#8A4413] text-white"
                : "text-gray-800 hover:bg-gray-100"
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
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.header
        className={`fixed top-0 left-0 w-full z-[50] transition-colors duration-300 ${
          isScrolled
            ? "bg-[#F5F5F7] shadow-sm"
            : "bg-transparent border-b border-white/20"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <nav className="w-full flex justify-between items-center h-20 md:h-24">
          {/* LOGO */}
          <div className={`h-full flex items-center px-6 lg:px-12 transition-colors duration-300 ${isScrolled ? "bg-transparent" : "bg-white"}`}>
            <Link to="/" onClick={(e) => handleNavClick(e, "/")} className="flex items-center">
              <img
                src="/afribide-logo.png"
                alt="Afribide Safaris"
                className="h-8 md:h-12 w-auto object-contain"
              />
            </Link>
          </div>

          {/* DESKTOP LINKS */}
          <div className="hidden md:flex flex-1 justify-end items-center h-full">
            <ul className="flex h-full items-center m-0 p-0">
              {renderNavLinks}
              {isAdmin && (
                <li className="h-full">
                  <Link
                    to="/admin"
                    className={`flex items-center gap-2 px-6 h-full text-sm tracking-wide transition-colors duration-200 ${
                      isScrolled ? "text-gray-900 hover:bg-gray-100" : "text-white hover:bg-white/10"
                    }`}
                    onClick={closeAllMenus}
                  >
                    <FaShieldAlt size={14} />
                    <span>Admin</span>
                  </Link>
                </li>
              )}
            </ul>

            <div className={`flex items-center h-full px-6 border-l ${isScrolled ? "border-gray-300" : "border-white/30"}`}>
              <Link
                to="/#contact"
                onClick={(e) => handleNavClick(e, "/#contact")}
                className={`px-6 py-2 border text-sm tracking-widest uppercase transition-all duration-300 rounded-sm ${
                  isScrolled
                    ? "border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white"
                    : "border-white text-white hover:bg-white hover:text-black"
                }`}
              >
                Contact Us
              </Link>

              <div className="ml-6">
                {currentUser ? (
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={`flex items-center justify-center w-10 h-10 transition-colors rounded-sm ${
                        isScrolled ? "bg-gray-200 hover:bg-gray-300 text-gray-800" : "bg-white/20 hover:bg-white/30 text-white"
                      }`}
                    >
                      {currentUser.photoURL ? (
                        <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover rounded-sm" />
                      ) : (
                        <FaUserCircle size={22} />
                      )}
                    </button>
                    <AnimatePresence>
                      {dropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 5 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-3 w-48 bg-[#F5F5F7] shadow-lg border border-gray-200 rounded-sm overflow-hidden"
                        >
                          <div className="px-4 py-3 border-b border-gray-200 bg-white">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {currentUser.displayName || "User"}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {currentUser.email}
                            </p>
                          </div>
                          {isAdmin && (
                            <Link
                              to="/admin"
                              className="w-full flex items-center px-4 py-3 text-sm text-[#8A4413] hover:bg-gray-100 transition-colors"
                              onClick={closeAllMenus}
                            >
                              <FaShieldAlt className="mr-2" /> Admin Dashboard
                            </Link>
                          )}
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <FaSignOutAlt className="mr-2" /> Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className={`px-6 py-2 text-sm tracking-widest uppercase transition-all duration-300 rounded-sm ${
                      isScrolled
                        ? "bg-gray-900 text-white hover:bg-black"
                        : "bg-white text-black hover:bg-gray-200"
                    }`}
                  >
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* MOBILE MENU / AUTH TOGGLE */}
          <div className="flex items-center space-x-4 md:hidden pr-6">
            {currentUser && !mobileMenuOpen && (
              <div className="w-8 h-8 rounded-sm overflow-hidden border border-[#000000] bg-white">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <FaUserCircle className={`w-full h-full ${isScrolled ? "text-[#979797]" : "text-[#979797]"}`} />
                )}
              </div>
            )}
            <button
              className={`focus:outline-none p-2 transition-colors ${
                isScrolled ? "text-black" : "text-white"
              }`}
              onClick={toggleMobileMenu}
              aria-label="Mobile menu"
            >
              {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
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
                className="fixed inset-0 bg-black/60 z-[999] md:hidden"
                onClick={closeAllMenus}
              />
              <motion.div
                ref={menuRef}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3 }}
                className="fixed top-0 right-0 w-[85%] max-w-sm h-full z-[1000] bg-[#F5F5F7] shadow-2xl p-6 overflow-y-auto border-l border-gray-200"
              >
                <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
                  <h2 className="text-sm tracking-widest uppercase font-semibold text-gray-900">Menu</h2>
                  <button onClick={toggleMobileMenu} className="p-2 text-gray-500 hover:text-black">
                    <FaTimes size={20} />
                  </button>
                </div>

                {currentUser && (
                  <div className="mb-6 p-4 bg-white rounded-sm flex items-center space-x-3 border border-gray-200">
                    {currentUser.photoURL ? (
                      <img src={currentUser.photoURL} alt="Profile" className="w-10 h-10 rounded-sm object-cover" />
                    ) : (
                      <FaUserCircle size={40} className="text-gray-400" />
                    )}
                    <div className="flex-1 overflow-hidden">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {currentUser.displayName || "User"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                    </div>
                  </div>
                )}

                <ul className="space-y-1">
                  {renderMobileMenuLinks}

                  {isAdmin && (
                    <motion.li
                      initial={{ x: 20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.25 }}
                      className="mt-6 border-t border-gray-200 pt-4"
                    >
                      <Link
                        to="/admin"
                        className="flex items-center justify-center gap-2 py-3 px-4 text-sm font-bold text-[#8A4413] border border-[#8A4413] rounded-sm hover:bg-[#8A4413] hover:text-white transition-all"
                        onClick={closeAllMenus}
                      >
                        <FaShieldAlt /> Admin Dashboard
                      </Link>
                    </motion.li>
                  )}

                  <motion.li initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="pt-2">
                    <Link
                      to="/#contact"
                      className="block py-3 px-4 mt-2 bg-gray-900 text-white text-sm tracking-wide text-center rounded-sm hover:bg-black transition-colors"
                      onClick={(e) => handleNavClick(e, "/#contact")}
                    >
                      Contact Us
                    </Link>
                  </motion.li>

                  <motion.li initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.4 }}>
                    {currentUser ? (
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center py-3 px-4 mt-3 bg-red-50 text-red-600 text-sm tracking-wide text-center rounded-sm hover:bg-red-100 transition-colors"
                      >
                        <FaSignOutAlt className="mr-2" /> Logout
                      </button>
                    ) : (
                      <Link
                        to="/login"
                        onClick={closeAllMenus}
                        className="block py-3 px-4 mt-3 border border-gray-900 text-gray-900 text-sm tracking-wide text-center rounded-sm hover:bg-gray-100 transition-colors"
                      >
                        Login
                      </Link>
                    )}
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