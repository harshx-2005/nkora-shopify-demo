"use client";

import React from "react";
import Link from "next/link";
import { MapPin, Mail, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  const shopLinks = [
    { name: "Girls Collection", href: "/shop?collection=girls" },
    { name: "Boys Collection", href: "/shop?collection=boys" },
    { name: "New Arrivals", href: "/shop?collection=new-arrivals" },
    { name: "Party Wear", href: "/shop?collection=party-wear" },
    { name: "Accessories", href: "/shop?collection=accessories" },
  ];

  const policyLinks = [
    { name: "Privacy Policy", href: "/policies/privacy" },
    { name: "Terms & Conditions", href: "/policies/terms" },
    { name: "Refund & Return Policy", href: "/policies/refund" },
    { name: "Shipping Policy", href: "/policies/shipping" },
  ];

  const careLinks = [
    { name: "Contact Us", href: "/contact" },
    { name: "Returns & Exchanges", href: "/policies/refund" },
    { name: "Track Order", href: "/account" },
    { name: "FAQs", href: "/faqs" },
  ];

  return (
    <footer className="bg-white border-t border-borderCustom pt-16 pb-8 px-4 md:px-10 font-poppins">
      <div className="max-w-site mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-16">
        {/* Brand Column */}
        <div className="space-y-6">
          <Link href="/" className="flex flex-col select-none">
            <span className="text-2xl font-light tracking-[0.25em] text-textDark">
              NKORA
            </span>
            <span className="text-[9px] tracking-[0.35em] text-primary uppercase font-bold mt-1">
              K I D S W E A R
            </span>
          </Link>


          <p className="text-xs text-textDark/60 leading-relaxed font-sans">
            Luxury kidswear boutique designed to deliver maximum skin-friendly comfort without compromising on modern, dapper styling.
          </p>
          <div className="space-y-2.5 pt-2 text-xs text-textDark/80 font-sans">
            <div className="flex items-center space-x-2">
              <MapPin size={14} className="text-primary flex-shrink-0" />
              <span>Kolkata, West Bengal, India</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail size={14} className="text-primary flex-shrink-0" />
              <span>support@nkorakidswear.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <PhoneCall size={14} className="text-primary flex-shrink-0" />
              <span>+91 98765 43210</span>
            </div>
          </div>
        </div>

        {/* Categories Column */}
        <div>
          <h4 className="text-xs font-bold tracking-widest text-primary uppercase mb-6">
            Shop Categories
          </h4>
          <ul className="space-y-3">
            {shopLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="text-xs text-textDark/70 hover:text-primary font-sans transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Care Column */}
        <div>
          <h4 className="text-xs font-bold tracking-widest text-primary uppercase mb-6">
            Customer Care
          </h4>
          <ul className="space-y-3">
            {careLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  prefetch={false}
                  className="text-xs text-textDark/70 hover:text-primary font-sans transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Policies Column */}
        <div>
          <h4 className="text-xs font-bold tracking-widest text-primary uppercase mb-6">
            Store Policies
          </h4>
          <ul className="space-y-3">
            {policyLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  prefetch={false}
                  className="text-xs text-textDark/70 hover:text-primary font-sans transition-colors"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Social and Copyright Row */}
      <div className="max-w-site mx-auto pt-8 border-t border-borderCustom flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-[11px] text-textDark/50 font-sans">
          &copy; {new Date().getFullYear()} NKORA KidsWear. Made with love. All rights reserved.
        </p>

        {/* Social Media Links */}
        <div className="flex items-center space-x-4">
          <motion.a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-lightGray hover:bg-softPink text-textDark hover:text-primary flex items-center justify-center transition-colors"
            whileHover={{ scale: 1.15 }}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </motion.a>
          <motion.a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-lightGray hover:bg-softPink text-textDark hover:text-primary flex items-center justify-center transition-colors"
            whileHover={{ scale: 1.15 }}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
            </svg>
          </motion.a>
          <motion.a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-lightGray hover:bg-softPink text-textDark hover:text-primary flex items-center justify-center transition-colors"
            whileHover={{ scale: 1.15 }}
          >
            <svg viewBox="0 0 24 24" width="15" height="15" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
            </svg>
          </motion.a>
          <motion.a
            href="https://wa.me/919876543210"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-lightGray hover:bg-[#25D366]/10 text-textDark hover:text-[#25D366] flex items-center justify-center transition-colors"
            whileHover={{ scale: 1.15 }}
          >
            <svg viewBox="0 0 448 512" width="15" height="15" fill="currentColor">
              <path d="M380.9 97.1C339 55.1 283.2 32.3 223.9 32.3c-106.3 0-192.8 86.5-192.8 192.8 0 34.3 9.1 67.7 26.5 97.1L20.1 480l146.4-38.4c28.1 15.3 59.8 23.4 92 23.4h.1c106.3 0 192.8-86.5 192.8-192.8 0-59.4-22.8-115.1-64.7-157.1zM223.9 437.3c-28.7 0-56.8-7.7-81.4-22.2l-5.8-3.4-60.1 15.8 16.1-58.5-3.8-6.1c-16.1-26-24.6-56.1-24.6-87.1 0-89.2 72.5-161.7 161.7-161.7 43.1 0 83.7 16.8 114.2 47.3 30.5 30.5 47.3 71.1 47.3 114.2 0 89.2-72.5 161.7-161.7 161.7zm88.3-120.5c-4.8-2.4-28.5-14.1-32.9-15.7-4.4-1.6-7.6-2.4-10.8 2.4-3.2 4.8-12.4 15.7-15.2 18.9-2.8 3.2-5.6 3.6-10.4 1.2-4.8-2.4-20.2-7.5-38.4-23.7-14.2-12.6-23.8-28.1-26.6-32.9-2.8-4.8-.3-7.4 2.1-9.8 2.2-2.2 4.8-5.7 7.2-8.6 2.4-2.9 3.2-4.9 4.8-8.2 1.6-3.3.8-6.1-.4-8.5-1.2-2.4-10.8-26.1-14.8-35.8-3.9-9.4-7.8-8.1-10.8-8.3-2.8-.2-6.1-.2-9.3-.2-3.2 0-8.4 1.2-12.8 6-4.4 4.8-16.9 16.5-16.9 40.3 0 23.8 17.3 46.8 19.7 50 2.4 3.2 34 52 82.4 72.9 11.5 4.9 20.5 7.8 27.5 10 11.6 3.7 22.1 3.2 30.4 1.9 9.3-1.4 28.5-11.6 32.5-22.9 4-11.3 4-21 2.8-22.9-1.2-1.9-4.4-3.1-9.2-5.5z"/>
            </svg>
          </motion.a>
        </div>

      </div>
    </footer>
  );
}
