"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Heart, Activity } from "lucide-react";
import { motion } from "framer-motion";

export default function WhyChooseUs() {
  const points = [
    {
      icon: Sparkles,
      title: "Premium Fabrics",
      desc: "Soft & Comfortable, carefully vetted for sensitive baby skin",
    },
    {
      icon: Heart,
      title: "Trendy Designs",
      desc: "Stylish & Unique silhouettes that combine playfulness with elegance",
    },
    {
      icon: Activity,
      title: "Loved by Kids",
      desc: "Tested & Approved for durability, flexibility, and daily play",
    },
  ];

  const kidsPortraits = [
    "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1622290319146-7b63df48a635?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&q=80&w=300",
  ];

  return (
    <section className="bg-white py-16 px-4 md:px-10 border-b border-borderCustom font-poppins">
      <div className="max-w-site mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side Info */}
        <div className="lg:col-span-6 space-y-8">
          <div>
            <h2 className="text-2xl font-light tracking-[0.2em] text-textDark uppercase">
              Why Parents Love NKORA
            </h2>
            <div className="flex items-center space-x-2 mt-2">
              <div className="h-[1px] w-8 bg-borderCustom" />
              <span className="text-primary text-xs">♡</span>
              <div className="h-[1px] w-8 bg-borderCustom" />
            </div>
          </div>

          <div className="space-y-6">
            {points.map((pt, idx) => {
              const Icon = pt.icon;
              return (
                <motion.div
                  key={idx}
                  className="flex items-start space-x-4"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15, duration: 0.6 }}
                >
                  <div className="w-10 h-10 rounded-full bg-softPink/50 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                    <Icon size={16} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-textDark tracking-wider uppercase font-poppins">
                      {pt.title}
                    </h3>
                    <p className="text-[11px] md:text-xs text-textDark/60 font-sans mt-0.5 leading-relaxed">
                      {pt.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Side Portrait Circles */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <div className="flex items-center gap-3 md:gap-4">
            {kidsPortraits.map((src, idx) => (
              <motion.div
                key={idx}
                className={`relative overflow-hidden shadow-sm border border-borderCustom ${
                  idx % 2 === 0
                    ? "w-20 h-32 md:w-24 md:h-36 rounded-full"
                    : "w-20 h-28 md:w-24 md:h-32 rounded-full mt-8"
                }`}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.7 }}
                whileHover={{ scale: 1.05 }}
              >
                <Image
                  src={src}
                  alt={`NKORA Happy Child Portrait ${idx + 1}`}
                  fill
                  sizes="150px"
                  className="object-cover"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
