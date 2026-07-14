"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CustomCursor() {
  const [hovered, setHovered] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [isMobile, setIsMobile] = useState(true);

  // Motion values for smooth hardware accelerated tracking
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Easing springs for luxury fluid lag-behind cursor movements
  const springConfig = { damping: 30, stiffness: 220, mass: 0.6 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Detect mobile touch screens to disable cursor drawing
    const checkMobile = () => {
      setIsMobile(
        window.matchMedia("(max-width: 1024px)").matches || 
        "ontouchstart" in window
      );
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    if (isMobile) return;

    // Enable custom cursor active class on body to hide default pointer
    document.body.classList.add("custom-cursor-active");

    const moveCursor = (e: MouseEvent) => {
      // Offset by half of default size to center cursor on target
      mouseX.set(e.clientX - 12);
      mouseY.set(e.clientY - 12);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      
      // Check clickable ancestors
      const isClickable = 
        target.tagName === "A" || 
        target.tagName === "BUTTON" || 
        target.closest("a") || 
        target.closest("button") || 
        target.closest("input") || 
        target.closest("select") ||
        target.classList.contains("cursor-pointer");

      // Check text override (e.g. data-cursor="view" or "drag")
      const cursorTextAttr = target.closest("[data-cursor]")?.getAttribute("data-cursor");

      if (isClickable) {
        setHovered(true);
      } else {
        setHovered(false);
      }

      if (cursorTextAttr) {
        setCursorText(cursorTextAttr);
        setHovered(true);
      } else {
        setCursorText("");
      }
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [isMobile, mouseX, mouseY]);

  if (isMobile) return null;

  return (
    <>
      {/* Outer Spring Ring */}
      <motion.div
        className="fixed top-0 left-0 rounded-full border border-primary pointer-events-none z-[9999] flex items-center justify-center"
        style={{
          x: cursorX,
          y: cursorY,
          width: hovered ? (cursorText ? 68 : 48) : 24,
          height: hovered ? (cursorText ? 68 : 48) : 24,
          backgroundColor: cursorText ? "rgba(233, 142, 165, 0.95)" : "rgba(233, 142, 165, 0.03)",
          borderColor: cursorText ? "transparent" : "#E98EA5",
          boxShadow: hovered ? "0 0 20px rgba(233, 142, 165, 0.45)" : "none",
          backdropFilter: hovered ? "blur(1px)" : "none",
        }}
        animate={{
          scale: hovered ? 1.15 : 1,
        }}
        transition={{ type: "spring", stiffness: 450, damping: 25 }}
      >
        {cursorText && (
          <motion.span 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[9px] uppercase font-bold tracking-widest text-white font-poppins select-none text-center px-2 leading-none"
          >
            {cursorText}
          </motion.span>
        )}
      </motion.div>

      {/* Inner Dot (scales down to 0 on hover to merge cleanly with the ring) */}
      <motion.div
        className="fixed top-0 left-0 w-2.5 h-2.5 bg-primary rounded-full pointer-events-none z-[9999]"
        style={{
          x: cursorX,
          y: cursorY,
          left: 7,
          top: 7,
        }}

        animate={{
          scale: hovered ? 0 : 1,
        }}
        transition={{ type: "spring", stiffness: 480, damping: 22 }}
      />

    </>
  );
}
