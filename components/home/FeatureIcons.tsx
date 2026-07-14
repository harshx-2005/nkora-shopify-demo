"use client";

import React from "react";
import { Award, ShieldCheck, Truck, RefreshCw, LucideIcon } from "lucide-react";
import { motion } from "framer-motion";


export default function FeatureIcons() {
  const features = [
    {
      icon: Award,
      title: "Premium Quality",
      desc: "Carefully selected fabrics",
      color: "bg-softPink/30 hover:bg-softPink/60 text-primary",
    },
    {
      icon: ShieldCheck,
      title: "Safe for Kids",
      desc: "Skin-friendly materials",
      color: "bg-blueAccent/10 hover:bg-blueAccent/20 text-blueAccent",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      desc: "Pan India delivery",
      color: "bg-softPink/30 hover:bg-softPink/60 text-primary",
    },
    {
      icon: RefreshCw,
      title: "Easy Exchange",
      desc: "Hassle free returns",
      color: "bg-blueAccent/10 hover:bg-blueAccent/20 text-blueAccent",
    },
  ];

  return (
    <section className="bg-white py-12 px-4 md:px-10 border-b border-borderCustom">
      <div className="max-w-site mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {announcementCards(features)}
      </div>
    </section>
  );
}

function announcementCards(
  items: { icon: LucideIcon; title: string; desc: string; color: string }[]
) {


  return items.map((feat, idx) => {
    const Icon = feat.icon;
    return (
      <motion.div
        key={idx}
        className="flex items-center space-x-4 p-5 rounded-2xl border border-borderCustom bg-lightGray/40 hover:bg-white card-lift-hover cursor-default"
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: idx * 0.1, duration: 0.5 }}
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors duration-300 ${feat.color}`}>
          <Icon size={20} strokeWidth={1.5} />
        </div>
        <div className="font-poppins">
          <h3 className="text-xs font-bold text-textDark tracking-wider uppercase">
            {feat.title}
          </h3>
          <p className="text-[11px] text-textDark/50 font-sans mt-0.5 leading-relaxed">
            {feat.desc}
          </p>
        </div>
      </motion.div>
    );
  });
}
