"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, User, Heart, ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import SearchDrawer from "./SearchDrawer";

export default function Navbar() {
  const { openCart, totalQuantity } = useCart();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);

  // Scroll detection to trigger background blur
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setShopMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "SHOP", href: "/shop", dropdown: true },
    { name: "GIRLS", href: "/shop?collection=girls" },
    { name: "BOYS", href: "/shop?collection=boys" },
    { name: "NEW ARRIVALS", href: "/shop?collection=new-arrivals" },
    { name: "PARTY WEAR", href: "/shop?collection=party-wear" },
    { name: "ACCESSORIES", href: "/shop?collection=accessories" },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrolled
            ? "bg-white/85 backdrop-blur-md shadow-sm py-3"
            : "bg-white py-5"
        } border-b border-borderCustom`}
      >
        <div className="max-w-site mx-auto px-4 md:px-10 flex justify-between items-center">
          {/* Logo Left */}
          <Link href="/" className="flex flex-col select-none group">
            <span className="text-2xl md:text-3xl font-poppins font-light tracking-[0.2em] text-textDark leading-none">
              NKORA
            </span>
            <span className="text-[8px] tracking-[0.3em] text-primary uppercase font-bold mt-1.5 transition-colors group-hover:text-blueAccent">
              K I D S W E A R
            </span>
          </Link>

          {/* Navigation Center (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-6">
            {navLinks.map((link) => {
              if (link.dropdown) {
                return (
                  <div
                    key={link.name}
                    className="relative"
                    onMouseEnter={() => setShopMenuOpen(true)}
                    onMouseLeave={() => setShopMenuOpen(false)}
                  >
                    <Link
                      href={link.href}
                      className="flex items-center space-x-1 text-xs tracking-widest font-medium text-textDark hover:text-primary transition-colors py-2 uppercase font-poppins"
                    >
                      <span>{link.name}</span>
                      <ChevronDown size={12} className={`transition-transform duration-200 ${shopMenuOpen ? "rotate-180" : ""}`} />
                    </Link>

                    {/* Staggered Mega Menu Dropdown */}
                    <AnimatePresence>
                      {shopMenuOpen && (
                        <motion.div
                          className="absolute left-1/2 -translate-x-1/2 top-full w-[500px] bg-white border border-borderCustom rounded-2xl shadow-xl p-6 mt-1 flex gap-8 z-50"
                          initial={{ opacity: 0, y: 15, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] as const }}
                        >

                          {/* Columns */}
                          <div className="flex-1">
                            <h4 className="text-xs font-bold tracking-widest text-primary font-poppins border-b border-borderCustom pb-2 mb-3">
                              COLLECTIONS
                            </h4>
                            <ul className="space-y-2">
                              <li>
                                <Link
                                  href="/shop?collection=girls"
                                  className="text-xs text-textDark hover:text-primary font-medium transition-colors block py-1"
                                >
                                  Girls Fashion (Dresses, Frocks)
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/shop?collection=boys"
                                  className="text-xs text-textDark hover:text-primary font-medium transition-colors block py-1"
                                >
                                  Boys Fashion (Shirts, Suspenders)
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/shop?collection=party-wear"
                                  className="text-xs text-textDark hover:text-primary font-medium transition-colors block py-1"
                                >
                                  Party Wear (Festive Luxury)
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/shop?collection=accessories"
                                  className="text-xs text-textDark hover:text-primary font-medium transition-colors block py-1"
                                >
                                  Accessories (Bows, Bags, Shoes)
                                </Link>
                              </li>
                            </ul>
                          </div>

                          <div className="w-[180px] bg-softPink/30 rounded-xl p-4 flex flex-col justify-between">
                            <div>
                              <p className="text-[10px] tracking-wider text-primary font-bold uppercase mb-1">
                                New In
                              </p>
                              <h5 className="text-xs font-bold text-textDark font-poppins mb-2">
                                Stars & Ribbons
                              </h5>
                              <p className="text-[10px] text-textDark/70 leading-relaxed">
                                Explore the finest collection designed for delicate child comfort.
                              </p>
                            </div>
                            <Link
                              href="/shop?collection=new-arrivals"
                              className="text-[10px] font-bold tracking-wider text-primary hover:text-primary-hover uppercase mt-4 block"
                            >
                              Shop New Arrivals &rarr;
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              const isActive = pathname === link.href;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-xs tracking-widest font-medium transition-colors hover:text-primary font-poppins relative py-1 ${
                    isActive ? "text-primary font-semibold" : "text-textDark"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 w-full h-[1.5px] bg-primary"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons Right */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search Icon */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-textDark hover:text-primary transition-colors duration-200"
              aria-label="Search"
            >
              <Search size={18} />
            </button>

            {/* Profile Icon */}
            <Link
              href="/account"
              className="hidden sm:inline-block p-2 text-textDark hover:text-primary transition-colors duration-200"
              aria-label="Account"
            >
              <User size={18} />
            </Link>

            {/* Wishlist */}
            <Link
              href="/wishlist"
              className="hidden sm:inline-block p-2 text-textDark hover:text-primary transition-colors duration-200"
              aria-label="Wishlist"
            >
              <Heart size={18} />
            </Link>

            {/* Cart Icon with soft-pink badge */}
            <button
              onClick={openCart}
              className="p-2 text-textDark hover:text-primary transition-colors duration-200 relative"
              aria-label="Cart"
            >
              <ShoppingBag size={18} />
              {totalQuantity > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-4.5 h-4.5 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center font-mono shadow-sm"
                >
                  {totalQuantity}
                </motion.span>
              )}
            </button>

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 text-textDark hover:text-primary transition-colors duration-200"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Drawer Overlay backdrop */}
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />

            {/* Drawer Content */}
            <motion.div
              className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl p-6 flex flex-col justify-between"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
            >
              <div>
                <div className="flex justify-between items-center border-b border-borderCustom pb-4 mb-6">
                  <span className="text-xl font-poppins font-light tracking-[0.25em] text-textDark">
                    NKORA
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 text-textDark hover:text-primary transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <nav className="flex flex-col space-y-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`text-sm tracking-widest font-semibold font-poppins py-2 border-b border-borderCustom/50 hover:text-primary transition-colors ${
                        pathname === link.href ? "text-primary" : "text-textDark"
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                  <Link
                    href="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm tracking-widest font-semibold font-poppins py-2 border-b border-borderCustom/50 text-textDark"
                  >
                    WISHLIST
                  </Link>
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-sm tracking-widest font-semibold font-poppins py-2 border-b border-borderCustom/50 text-textDark"
                  >
                    MY ACCOUNT
                  </Link>
                </nav>
              </div>

              {/* Bottom drawer info */}
              <div className="text-[10px] tracking-wide text-textDark/60 font-poppins border-t border-borderCustom pt-4">
                <p className="font-semibold text-textDark uppercase mb-1">NKORA KIDSWEAR</p>
                <p>Kolkata, India</p>
                <p className="mt-2">Free Delivery on prepaid orders above ₹1999.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Search Overlay Drawer */}
      <SearchDrawer isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
