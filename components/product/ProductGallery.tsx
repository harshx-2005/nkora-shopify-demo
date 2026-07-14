"use client";

import React, { useState } from "react";
import Image from "next/image";
import { ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductGalleryProps {
  images: { url: string; altText?: string }[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomStyle, setZoomStyle] = useState({ display: "none", transformOrigin: "center" });
  const [lightboxOpen, setLightboxOpen] = useState(false);

  const validImages = images.filter((img) => img && typeof img.url === "string" && img.url.trim() !== "");
  const productImages = validImages.length > 0 
    ? validImages 
    : [{ url: "https://images.unsplash.com/photo-1622290319146-7b63df48a635?auto=format&fit=crop&q=80&w=800", altText: "Fallback Product Image" }];


  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      display: "block",
      transformOrigin: `${x}% ${y}%`,
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none", transformOrigin: "center" });
  };

  const prevImage = () => {
    setActiveIdx((prev) => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setActiveIdx((prev) => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 h-full font-poppins">
        {/* Left Vertical Thumbnails (Desktop) */}
        <div className="hidden md:flex flex-col gap-3 order-2 md:order-1 flex-shrink-0 w-20">
          {productImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIdx(idx)}
              className={`relative aspect-[3/4] w-20 rounded-2xl overflow-hidden bg-lightGray border-2 transition-all duration-300 ${
                activeIdx === idx
                  ? "border-primary shadow-sm scale-98"
                  : "border-transparent hover:border-softPink"
              }`}
            >
              <Image
                src={img.url}
                alt={img.altText || `Product thumbnail ${idx + 1}`}
                fill
                sizes="100px"
                className="object-cover"
              />
            </button>
          ))}
        </div>

        {/* Center Main Image Panel */}
        <div className="relative aspect-[3/4] flex-1 bg-lightGray rounded-[32px] overflow-hidden order-1 md:order-2 group select-none">
          <div
            className="w-full h-full relative cursor-zoom-in"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => setLightboxOpen(true)}
          >
            {/* Main Image */}
            <Image
              src={productImages[activeIdx].url}
              alt={productImages[activeIdx].altText || "Product main image"}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 40vw"
              className="object-cover transition-transform duration-100"
              style={{
                transform: zoomStyle.display === "block" ? "scale(2)" : "scale(1)",
                transformOrigin: zoomStyle.transformOrigin,
              }}
            />
          </div>

          {/* Zoom Overlay Hint */}
          <span className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-xs p-2 rounded-full text-textDark/60 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ZoomIn size={16} />
          </span>

          {/* Navigation Arrows for Mobile */}
          <button
            onClick={prevImage}
            className="md:hidden absolute left-4 top-1/2 -translate-y-1/2 bg-white/70 p-2.5 rounded-full text-textDark z-10"
            aria-label="Previous image"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextImage}
            className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 bg-white/70 p-2.5 rounded-full text-textDark z-10"
            aria-label="Next image"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* Fullscreen Lightbox Overlay */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Close */}
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close Lightbox"
            >
              <X size={20} />
            </button>

            {/* Main Lightbox Image */}
            <div className="relative w-[90vw] h-[80vh] max-w-4xl">
              <Image
                src={productImages[activeIdx].url}
                alt="Product High Resolution"
                fill
                sizes="90vw"
                className="object-contain"
              />
            </div>

            {/* Slide Indicators */}
            <div className="absolute bottom-6 text-white/60 text-xs font-mono">
              {activeIdx + 1} / {productImages.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
