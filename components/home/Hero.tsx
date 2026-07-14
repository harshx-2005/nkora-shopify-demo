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
    <section className="relative bg-white overflow-hidden py-10 lg:py-16 px-4 md:px-10">
      <div className="max-w-site mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side Content Column */}
        <motion.div
          className="lg:col-span-6 space-y-6 md:space-y-8 z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Tagline */}
          <motion.div 
            variants={itemVariants} 
            className="inline-flex items-center space-x-2 bg-softPink/50 border border-primary/20 rounded-full px-4 py-1.5"
          >
            <Sparkles size={12} className="text-primary animate-pulse" />
            <span className="text-[10px] md:text-xs font-bold tracking-widest text-primary uppercase font-poppins">
              NEW COLLECTION
            </span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-5xl xl:text-6xl font-poppins font-light leading-[1.15] text-textDark"
          >
            Premium Kidswear <br />
            for Little Stars <span className="text-primary font-normal">♡</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className="text-sm md:text-base text-textDark/60 leading-relaxed font-sans max-w-lg"
          >
            Stylish. Comfortable. Made with love. Handcrafted luxury garments designed to fit your child&apos;s playful lifestyle perfectly.
          </motion.p>

          {/* Action CTAs */}
          <motion.div variants={itemVariants} className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/shop?collection=girls"
              className="bg-primary hover:bg-primary-hover text-white text-xs tracking-widest font-bold uppercase py-4 px-8 rounded-full shadow-sm hover:shadow-md transition-all duration-300 btn-glow-hover hover:scale-[1.03] active:scale-95"
            >
              SHOP GIRLS
            </Link>
            <Link
              href="/shop?collection=boys"
              className="bg-blueAccent hover:bg-blueAccent-hover text-white text-xs tracking-widest font-bold uppercase py-4 px-8 rounded-full shadow-sm hover:shadow-md transition-all duration-300 btn-glow-hover hover:scale-[1.03] active:scale-95"
            >
              SHOP BOYS
            </Link>
          </motion.div>
        </motion.div>

        {/* Right Side Image Column */}
        <div className="lg:col-span-6 relative w-full h-[350px] sm:h-[450px] md:h-[500px] lg:h-[550px]">
          {/* Main Rounded Image */}
          <motion.div
            className="w-full h-full rounded-[40px] overflow-hidden relative shadow-lg z-10"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Image
              src="https://images.unsplash.com/photo-1622290319146-7b63df48a635?auto=format&fit=crop&q=80&w=1200"
              alt="Premium Kidswear for Little Stars"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {/* Subtle overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
          </motion.div>

          {/* Floating Cloud Element (Pink) */}
          <motion.div
            className="absolute -top-6 -left-6 w-24 h-14 bg-softPink rounded-full opacity-60 filter blur-xs -z-0 flex items-center justify-center"
            animate={{ 
              y: [0, -12, 0],
              x: [0, 8, 0]
            }}
            transition={{ 
              duration: 5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />

          {/* Floating Circle Element (Blue) */}
          <motion.div
            className="absolute -bottom-8 -right-8 w-32 h-32 bg-blueAccent/15 rounded-full filter blur-xl -z-0"
            animate={{ 
              y: [0, 15, 0],
              x: [0, -10, 0]
            }}
            transition={{ 
              duration: 6, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 0.5
            }}
          />

          {/* Extra Decorative Cloud Badge */}
          <motion.div
            className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md border border-borderCustom rounded-2xl p-4 shadow-md z-20 flex items-center space-x-3 hidden sm:flex"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <div className="w-8 h-8 rounded-full bg-softPink flex items-center justify-center text-primary font-bold text-sm">
              ★
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-textDark">
                100% Organic Fabrics
              </p>
              <p className="text-[9px] text-textDark/60">
                Safe for delicate baby skin
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
