"use client";

import React, { useState } from "react";
import { Gift, Copy, Check } from "lucide-react";
import { motion } from "framer-motion";

export default function DiscountBanner() {
  const [copied, setCopied] = useState(false);
  const code = "NKORA5";

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="bg-white py-10 px-4 md:px-10">
      <div className="max-w-site mx-auto">
        <motion.div
          className="bg-softPink/60 border border-primary/20 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Main Info */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left z-10">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shadow-sm">
              <Gift size={22} className="animate-bounce" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-textDark font-poppins uppercase tracking-wider">
                EXTRA 5% OFF on Prepaid Orders
              </h3>
              <p className="text-[11px] md:text-xs text-textDark/60 font-sans mt-0.5">
                Apply discount during checkout. Valid on all premium items.
              </p>
            </div>
          </div>

          {/* Copy Button */}
          <div className="flex items-center space-x-3 bg-white border border-borderCustom rounded-2xl p-2 z-10 shadow-xs">
            <span className="text-xs font-mono font-bold tracking-widest text-textDark pl-3">
              Use Code: <span className="text-primary font-extrabold">{code}</span>
            </span>
            <button
              onClick={handleCopy}
              className="bg-primary hover:bg-primary-hover text-white text-[10px] tracking-widest font-bold uppercase py-2.5 px-4 rounded-xl flex items-center space-x-1.5 transition-all duration-300"
            >
              {copied ? (
                <>
                  <Check size={12} />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>COPY CODE</span>
                </>
              )}
            </button>
          </div>

          {/* Decorative faint background shapes */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full filter blur-xl -z-0 pointer-events-none" />
          <div className="absolute -bottom-6 left-[20%] w-32 h-32 bg-blueAccent/5 rounded-full filter blur-xl -z-0 pointer-events-none" />
        </motion.div>
      </div>
    </section>
  );
}
