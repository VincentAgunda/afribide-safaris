import React, { useState } from "react";
import { MessageCircle, Phone, CalendarDays } from "lucide-react";
import BookingModal from "./BookingModal"; // Adjust path if needed

const FloatingActions = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Use the same number from your existing BookingModal
  const phoneNumber = "+254113073535"; 
  const whatsappMsg = encodeURIComponent("Hello! I'm interested in a safari and would like to make an enquiry.");

  return (
    <>
      {/* Floating Button Container */}
      <div className="fixed bottom-6 right-6 z-[9000] flex flex-col gap-4 items-end">
        
        {/* 1. Call Button */}
        <div className="group relative flex items-center">
          <span className="absolute right-14 bg-gray-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
            Call Us
          </span>
          <a
            href={`tel:${phoneNumber}`}
            className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex justify-center items-center hover:bg-blue-700 hover:scale-110 transition-all duration-300"
            aria-label="Call Us"
          >
            <Phone size={24} className="fill-current" />
          </a>
        </div>

        {/* 2. WhatsApp Button */}
        <div className="group relative flex items-center">
          <span className="absolute right-14 bg-gray-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
            WhatsApp
          </span>
          <a
            href={`https://wa.me/${phoneNumber}?text=${whatsappMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg flex justify-center items-center hover:bg-[#20bd5a] hover:scale-110 transition-all duration-300"
            aria-label="WhatsApp Enquiry"
          >
            <MessageCircle size={28} />
          </a>
        </div>

        {/* 3. Book Now Button */}
        <div className="group relative flex items-center">
          <span className="absolute right-14 bg-gray-900 text-white text-xs font-medium px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-md">
            Book Now
          </span>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-14 h-14 bg-black text-white rounded-full shadow-lg flex justify-center items-center hover:bg-gray-800 hover:scale-110 transition-all duration-300 border-2 border-white/20"
            aria-label="Open Booking Form"
          >
            <CalendarDays size={24} />
          </button>
        </div>
      </div>

      {/* Render the Booking Modal */}
      <BookingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        // service and theme props can be omitted here to use your DEFAULT_SERVICE and DEFAULT_THEME
      />
    </>
  );
};

export default FloatingActions;