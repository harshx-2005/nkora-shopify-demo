"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export default function Hero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1] as const,
      },
    },
  };


  return (
    <section className="relative w-full bg-[#FAF5F0] min-h-[480px] lg:h-[580px] flex items-center overflow-hidden font-poppins">
      
      {/* Landscape Banner Background Image */}
      <div className="absolute inset-0 w-full h-full pointer-events-none select-none z-0">
        <Image
          src="/hero-banner-far-right.png"
          alt="Premium Kidswear Banner"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center lg:object-right"
        />







        {/* Soft elegant gradient overlay to keep text highly readable and erase vertical lines */}
        <div 
          className="absolute inset-0 hidden lg:block" 
          style={{
            background: "linear-gradient(to right, #FAF5F0 0%, #FAF5F0 35%, rgba(250, 245, 240, 0.4) 50%, transparent 65%)"
          }}
        />
        <div className="absolute inset-0 bg-[#FAF5F0]/85 lg:hidden" />
      </div>



      <div className="max-w-site mx-auto w-full px-6 md:px-10 lg:px-16 relative z-10">
        {/* Left Side Content Column */}
        <motion.div
          className="max-w-md lg:max-w-lg space-y-5 md:space-y-6 text-left"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Tagline */}
          <motion.div 
            variants={itemVariants} 
            className="text-[10px] md:text-xs font-bold tracking-[0.2em] text-primary uppercase font-poppins"
          >
            NEW COLLECTION
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl xl:text-5xl font-poppins font-light leading-[1.2] text-textDark"
          >
            Premium Kidswear <br />
            for Newborn to 12 Years <span className="text-primary font-normal">♡</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-xs md:text-sm text-textDark/60 leading-relaxed font-sans max-w-sm"
          >
            Stylish. Comfortable. Made with love.
          </motion.p>

          {/* Action CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-1">
            <Link
              href="/shop?collection=girls"
              className="bg-primary hover:bg-primary-hover text-white text-[10px] tracking-widest font-bold uppercase py-3.5 px-8 rounded-full shadow-xs hover:shadow-md transition-all duration-300 btn-glow-hover hover:scale-[1.03] active:scale-95"
            >
              SHOP GIRLS
            </Link>
            <Link
              href="/shop?collection=boys"
              className="bg-blueAccent hover:bg-blueAccent-hover text-white text-[10px] tracking-widest font-bold uppercase py-3.5 px-8 rounded-full shadow-xs hover:shadow-md transition-all duration-300 btn-glow-hover hover:scale-[1.03] active:scale-95"
            >
              SHOP BOYS
            </Link>
          </motion.div>
        </motion.div>
      </div>


    </section>
  );
}

