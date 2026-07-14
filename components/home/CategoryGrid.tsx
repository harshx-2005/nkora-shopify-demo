"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export default function CategoryGrid() {
  const categories = [
    {
      name: "Girls Collection",
      href: "/shop?collection=girls",
      image: "https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&q=80&w=600",
      color: "bg-[#FEF9E7]", // soft warm cream/yellow
    },
    {
      name: "Boys Collection",
      href: "/shop?collection=boys",
      image: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=600",
      color: "bg-[#EBF5FB]", // soft light blue
    },
    {
      name: "Party Wear",
      href: "/shop?collection=party-wear",
      image: "https://images.unsplash.com/photo-1622290319146-7b63df48a635?auto=format&fit=crop&q=80&w=600",
      color: "bg-[#FDEDEC]", // soft pinkish cream
    },
    {
      name: "Accessories",
      href: "/shop?collection=accessories",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600",
      color: "bg-[#F4ECF7]", // soft lilac/purple cream
    },
  ];

  return (
    <section className="bg-white py-16 px-4 md:px-10 font-poppins">
      <div className="max-w-site mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-light tracking-[0.2em] text-textDark uppercase">
            Shop by Category
          </h2>
          <div className="flex items-center justify-center space-x-2 mt-2">
            <div className="h-[1px] w-8 bg-borderCustom" />
            <span className="text-primary text-xs">♡</span>
            <div className="h-[1px] w-8 bg-borderCustom" />
          </div>
        </div>

        {/* Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6, ease: "easeOut" }}
              className="flex w-full"
            >
              <div className={`group w-full rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-2 transition-all duration-500 flex flex-col justify-between ${cat.color}`}>
                {/* Card Content Top */}
                <div className="p-6 md:p-8 pb-0">
                  <h3 className="text-lg font-medium text-textDark font-poppins mb-4">
                    {cat.name}
                  </h3>
                  <Link
                    href={cat.href}
                    className="bg-primary hover:bg-primary-hover text-white text-[10px] tracking-widest font-bold uppercase py-2 px-5 rounded-full inline-block transition-colors duration-300"
                  >
                    SHOP NOW
                  </Link>
                </div>

                {/* Card Image Bottom */}
                <div className="relative w-full h-64 mt-4 overflow-hidden rounded-t-[30px] flex items-end">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover object-top group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                </div>
              </div>
            </motion.div>
          ))}


        </div>
      </div>
    </section>
  );
}
