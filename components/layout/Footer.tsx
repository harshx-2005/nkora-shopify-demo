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
        </div>
      </div>
    </footer>
  );
}
