"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";


export default function InstagramGallery() {
  const images = [
    "https://images.unsplash.com/photo-1622290319146-7b63df48a635?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1621452773781-0f992fd1f5cb?auto=format&fit=crop&q=80&w=300",
  ];


  return (
    <section className="bg-white py-16 px-4 md:px-10 border-b border-borderCustom font-poppins">
      <div className="max-w-site mx-auto">
        {/* Title */}
        <div className="text-center mb-10">
          <h2 className="text-xs font-bold tracking-widest text-primary uppercase">
            Follow Us On Instagram
          </h2>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-lg font-light tracking-[0.1em] text-textDark hover:text-primary transition-colors mt-1 inline-block"
          >
            @nkora.kidswear
          </a>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {images.map((src, idx) => (
            <motion.a
              key={idx}
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-3xl overflow-hidden bg-lightGray border border-borderCustom group block"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <Image
                src={src}
                alt={`Instagram grid post ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, 20vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-primary/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white">
                <motion.div
                  initial={{ scale: 0.8 }}
                  whileInView={{ scale: 1 }}
                  className="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center shadow-md"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </motion.div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

