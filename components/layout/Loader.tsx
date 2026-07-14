"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Check if user has already loaded in this session to make repeat visits faster
    const hasLoaded = sessionStorage.getItem("nkora_loaded");
    if (hasLoaded) {
      setVisible(false);
      return;
    }

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setVisible(false);
            sessionStorage.setItem("nkora_loaded", "true");
          }, 400); // Small pause at 100%
          return 100;
        }
        // Increment progress faster at first, then slow down
        const diff = Math.random() * 15;
        return Math.min(prev + Math.round(diff), 100);
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            y: "-100%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] as const } 
          }}

        >
          {/* Logo animation */}
          <div className="flex flex-col items-center max-w-xs w-full px-6">
            <motion.h1 
              className="text-4xl md:text-5xl font-poppins font-light tracking-[0.25em] text-textDark mb-1 text-center"
              initial={{ letterSpacing: "0.1em", opacity: 0 }}
              animate={{ letterSpacing: "0.25em", opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            >
              NKORA
            </motion.h1>
            <motion.p
              className="text-[10px] tracking-[0.4em] font-medium text-primary uppercase mb-8 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              K I D S W E A R
            </motion.p>

            {/* Progress Slider */}
            <div className="w-48 h-[2px] bg-lightGray rounded-full overflow-hidden relative mb-4">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>

            {/* Loading text percentage */}
            <motion.span
              className="text-xs font-mono tracking-widest text-blueAccent"
              key={progress}
            >
              {progress}%
            </motion.span>
          </div>

          {/* Decorative floating clouds/stars in soft pink */}
          <motion.div
            className="absolute top-[20%] left-[15%] w-12 h-12 bg-softPink rounded-full opacity-20 filter blur-xl"
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-[25%] right-[20%] w-16 h-16 bg-blueAccent rounded-full opacity-10 filter blur-xl"
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 5, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
