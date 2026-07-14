"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    cartItems,
    subtotal,
    updateItemQuantity,
    removeItem,
    checkoutUrl,
    isLoading,
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const FREE_SHIPPING_THRESHOLD = 1999;

  // Calculate free shipping progress
  const progressPercent = Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - subtotal;

  const handleCheckout = () => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
    } else {
      alert("Checkout is currently syncing. Please try again in a moment.");
    }
  };

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "NKORA5") {
      setCouponApplied(true);
    } else {
      alert("Invalid coupon code! Try NKORA5");
    }
  };

  const discountedSubtotal = couponApplied ? subtotal * 0.95 : subtotal;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-poppins">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer Wrapper */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              className="w-screen max-w-md bg-white flex flex-col shadow-2xl relative"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
            >
              {/* Header */}
              <div className="px-6 py-5 border-b border-borderCustom flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag size={18} className="text-primary" />
                  <h2 className="text-sm font-bold tracking-widest text-textDark uppercase">
                    Your Shopping Cart ({cartItems.length})
                  </h2>
                </div>
                <button
                  onClick={closeCart}
                  className="p-2 -mr-2 text-textDark hover:text-primary transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Free Shipping Progress Meter */}
              {cartItems.length > 0 && (
                <div className="px-6 py-4 bg-lightGray/50 border-b border-borderCustom space-y-2">
                  <p className="text-[11px] text-textDark/80 font-sans font-medium text-center">
                    {remainingForFreeShipping > 0 ? (
                      <>
                        Add <span className="font-bold text-primary">{formatPrice(remainingForFreeShipping)}</span> more to unlock <span className="font-bold">FREE SHIPPING</span>
                      </>
                    ) : (
                      "Congratulations! You've unlocked FREE SHIPPING! 🎉"
                    )}
                  </p>
                  <div className="w-full h-2 bg-borderCustom rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>
                </div>
              )}

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="w-16 h-16 bg-lightGray rounded-full flex items-center justify-center text-textDark/40">
                      <ShoppingBag size={28} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-textDark uppercase tracking-wider">
                        Your Cart is Empty
                      </h3>
                      <p className="text-xs text-textDark/50 mt-1 max-w-xs leading-relaxed font-sans">
                        Browse our luxury collection to find the perfect clothing for your little stars.
                      </p>
                    </div>
                    <Link
                      href="/shop"
                      onClick={closeCart}
                      className="inline-flex items-center space-x-2 text-xs font-bold tracking-widest text-primary hover:text-primary-hover uppercase border-b-2 border-primary pb-0.5 transition-all duration-300"
                    >
                      <span>Shop Now</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : (
                  cartItems.map((item) => (
                    <div
                      key={item.variantId}
                      className="flex space-x-4 py-3 border-b border-borderCustom/50 relative group"
                    >
                      {/* Image */}
                      <div className="relative w-16 h-20 bg-lightGray rounded-xl overflow-hidden flex-shrink-0">
                        {item.image && (
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            sizes="100px"
                            className="object-cover"
                          />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-grow min-w-0 pr-4">
                        <h4 className="text-xs font-bold text-textDark truncate font-poppins">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-textDark/50 mt-0.5 capitalize">
                          Size: {item.variantTitle}
                        </p>
                        <p className="text-xs font-bold text-primary font-mono mt-1.5">
                          {formatPrice(item.price)}
                        </p>

                        {/* Quantity controls */}
                        <div className="flex items-center space-x-2.5 mt-2">
                          <button
                            onClick={() => updateItemQuantity(item.variantId, item.quantity - 1)}
                            className="w-6 h-6 rounded-md bg-lightGray hover:bg-softPink text-textDark flex items-center justify-center transition-colors"
                          >
                            <Minus size={10} />
                          </button>
                          <span className="text-xs font-semibold font-mono w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateItemQuantity(item.variantId, item.quantity + 1)}
                            className="w-6 h-6 rounded-md bg-lightGray hover:bg-softPink text-textDark flex items-center justify-center transition-colors"
                          >
                            <Plus size={10} />
                          </button>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => removeItem(item.variantId)}
                        className="absolute right-0 top-3 text-textDark/30 hover:text-red-500 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer Summary */}
              {cartItems.length > 0 && (
                <div className="border-t border-borderCustom px-6 py-6 space-y-4 bg-lightGray/30">
                  {/* Coupon Field */}
                  <form onSubmit={applyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Coupon Code (NKORA5)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={couponApplied}
                      className="flex-1 bg-white border border-borderCustom rounded-xl px-4 py-2 text-xs font-poppins outline-none uppercase placeholder-textDark/30 focus:border-primary disabled:bg-gray-100"
                    />
                    <button
                      type="submit"
                      disabled={couponApplied || !couponCode.trim()}
                      className="bg-primary hover:bg-primary-hover text-white text-[10px] tracking-widest font-bold uppercase py-2 px-4 rounded-xl transition-all duration-300 disabled:opacity-50"
                    >
                      Apply
                    </button>
                  </form>

                  {/* Calculations */}
                  <div className="space-y-2 text-xs font-poppins">
                    <div className="flex justify-between text-textDark/70">
                      <span>Subtotal</span>
                      <span className="font-mono">{formatPrice(subtotal)}</span>
                    </div>

                    {couponApplied && (
                      <div className="flex justify-between text-green-600">
                        <span>Discount (5% Off)</span>
                        <span className="font-mono">-{formatPrice(subtotal * 0.05)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-textDark/70">
                      <span>Shipping</span>
                      <span className="font-mono">
                        {subtotal >= FREE_SHIPPING_THRESHOLD ? "FREE" : formatPrice(150)}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm font-bold text-textDark border-t border-borderCustom pt-3 mt-1">
                      <span>Estimated Total</span>
                      <span className="font-mono text-primary">
                        {formatPrice(discountedSubtotal + (subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 150))}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isLoading}
                    className="w-full bg-primary hover:bg-primary-hover text-white text-xs tracking-widest font-bold uppercase py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all duration-300 btn-glow-hover hover:scale-[1.02]"
                  >
                    <span>{isLoading ? "SYNCING..." : "PROCEED TO CHECKOUT"}</span>
                    {!isLoading && <ArrowRight size={14} />}
                  </button>

                  <p className="text-[9px] text-textDark/40 text-center font-sans">
                    Shipping & taxes calculated at checkout. Powered by Shopify.
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
