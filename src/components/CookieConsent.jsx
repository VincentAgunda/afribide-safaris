import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getConsent,
  setConsent,
  defaultConsent,
} from "./utils/cookieConsent";

const CookieConsent = ({ forceOpen = false }) => {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("consent");
  const [settings, setSettingsState] = useState(defaultConsent);

  useEffect(() => {
    setVisible(true);
    const existing = getConsent();
    if (existing) setSettingsState(existing);
  }, []);

  useEffect(() => {
    if (forceOpen) setVisible(true);
  }, [forceOpen]);

  const toggle = (key) => {
    if (key === "necessary") return;
    setSettingsState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = (custom = settings) => {
    setConsent(custom);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center px-3 sm:px-4"
        >
          <motion.div
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            exit={{ y: 80 }}
            className="
              bg-white w-full 
              max-w-4xl 
              rounded-t-2xl sm:rounded-xl 
              shadow-[0_20px_60px_rgba(0,0,0,0.2)] 
              overflow-hidden
              max-h-[90vh] flex flex-col
            "
          >
            {/* Tabs */}
            <div className="flex text-sm font-medium border-b">
              {["consent", "details", "about"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 sm:py-4 capitalize transition ${
                    activeTab === tab
                      ? "border-b-2 border-black text-black"
                      : "text-gray-400"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Scrollable Content */}
            <div className="px-5 sm:px-8 py-5 sm:py-6 text-[13px] sm:text-[14px] leading-relaxed text-gray-700 overflow-y-auto">
              {activeTab === "consent" && (
                <>
                  <h2 className="font-semibold text-[15px] sm:text-[16px] mb-3 text-black">
                    This website uses cookies
                  </h2>

                  <p className="text-gray-600">
                    We use cookies to personalise content and ads, to provide
                    social media features and to analyse our traffic. We also
                    share information about your use of our site with our social
                    media, advertising and analytics partners.
                  </p>

                  {/* Toggles */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mt-6 sm:mt-8 text-center">
                    {Object.keys(settings).map((key) => (
                      <div key={key}>
                        <p className="mb-2 sm:mb-3 text-[13px] sm:text-[14px] font-medium capitalize text-black">
                          {key}
                        </p>

                        <button
                          onClick={() => toggle(key)}
                          className={`relative w-11 h-6 sm:w-12 sm:h-6 rounded-full transition ${
                            settings[key] ? "bg-black" : "bg-gray-300"
                          } ${
                            key === "necessary"
                              ? "opacity-60 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          <span
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              settings[key] ? "translate-x-5 sm:translate-x-6" : ""
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {activeTab === "details" && (
                <div className="space-y-3 text-gray-700">
                  <p>
                    <b className="text-black">Necessary:</b> Required for core
                    functionality.
                  </p>
                  <p>
                    <b className="text-black">Preferences:</b> Remember user
                    settings.
                  </p>
                  <p>
                    <b className="text-black">Statistics:</b> Anonymous analytics.
                  </p>
                  <p>
                    <b className="text-black">Marketing:</b> Ads personalization.
                  </p>
                </div>
              )}

              {activeTab === "about" && (
                <div className="space-y-3 text-gray-700">
                  <p>
                    Cookies are small text files used to improve your experience.
                  </p>
                  <p>
                    We only store necessary cookies without consent. Others
                    require your permission.
                  </p>
                  <p>You can change or withdraw your consent anytime.</p>
                  <p>Learn more in our Privacy Policy.</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="border-t bg-[#f7f7f7] p-4 flex flex-col sm:flex-row gap-3 sm:gap-4 sm:justify-between">
              
              {/* Left button */}
              <button
                onClick={() =>
                  handleSave({
                    necessary: true,
                    preferences: false,
                    statistics: false,
                    marketing: false,
                  })
                }
                className="w-full sm:w-auto px-5 py-2 border border-black text-black text-sm font-medium rounded-md hover:bg-black hover:text-white transition"
              >
                Use necessary cookies only
              </button>

              {/* Right group */}
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={() => handleSave(settings)}
                  className="w-full sm:w-auto px-5 py-2 border border-black text-sm font-medium rounded-md hover:bg-black hover:text-white transition"
                >
                  Save preferences
                </button>

                <button
                  onClick={() =>
                    handleSave({
                      necessary: true,
                      preferences: true,
                      statistics: true,
                      marketing: true,
                    })
                  }
                  className="w-full sm:w-auto px-6 py-2 bg-yellow-400 hover:bg-[#8A4413] text-white text-sm font-semibold rounded-md"
                >
                  Allow all cookies
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;