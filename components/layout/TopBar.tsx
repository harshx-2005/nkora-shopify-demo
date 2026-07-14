"use client";

import React, { useEffect, useState } from "react";
import { Truck, Landmark, RefreshCw } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

export default function TopBar() {
  const announcements = [
    { icon: Truck, text: "FREE SHIPPING on orders above ₹1999" },
    { icon: Landmark, text: "Cash On Delivery (COD) Available" },
    { icon: RefreshCw, text: "Easy 7-Day Exchange & Returns" }
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [announcements.length]);

  return (
    <div className="bg-softPink text-textDark text-xs font-medium py-2.5 px-4 border-b border-borderCustom z-40 relative">
      {/* Desktop view: 3 Columns grid */}
      <div className="hidden md:flex max-w-site mx-auto justify-between items-center px-4 md:px-10">
        {announcements.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center space-x-2 text-[11px] tracking-wide uppercase font-poppins">
              <Icon size={13} className="text-primary animate-pulse" />
              <span>{item.text}</span>
            </div>
          );
        })}
      </div>

      {/* Mobile view: Auto rotating announcement ticker */}
      <div className="flex md:hidden justify-center items-center h-4 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="flex items-center space-x-2 text-[10px] tracking-wider uppercase font-poppins absolute"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {React.createElement(announcements[index].icon, { size: 12, className: "text-primary" })}
            <span>{announcements[index].text}</span>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
