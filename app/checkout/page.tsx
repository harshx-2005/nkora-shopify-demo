"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, CreditCard, ShoppingBag, Truck, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";

const STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", 
  "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", 
  "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", 
  "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", 
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Delhi", "Mumbai"
];

export default function CheckoutPage() {
  const { cartItems, subtotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "West Bengal",
    pincode: ""
  });
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"MANUAL" | "COD">("MANUAL");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStep, setSubmissionStep] = useState(0); // 0: Idle, 1: Syncing, 2: Creating, 3: Completed
  const [error, setError] = useState("");
  const [shippingFee, setShippingFee] = useState(99);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(1999);

  const shippingCharge = subtotal >= freeShippingThreshold ? 0 : shippingFee;
  const discountAmount = couponApplied ? subtotal * 0.05 : 0;
  const estimatedTotal = subtotal - discountAmount + shippingCharge;

  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setShippingFee(data.settings.shippingFee ?? 99);
          setFreeShippingThreshold(data.settings.freeShippingThreshold ?? 1999);
        }
      })
      .catch(err => console.error("Failed to load settings:", err));
  }, []);

  useEffect(() => {
    // If cart is empty on refresh, redirect to shop
    if (cartItems.length === 0 && !isSubmitting) {
      // Allow a brief moment to load local storage
    }
  }, [cartItems, isSubmitting]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const applyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === "NKORA5") {
      setCouponApplied(true);
      setError("");
    } else {
      setError("Invalid coupon code! Try NKORA5");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      setError("Your cart is empty!");
      return;
    }

    // Form Field Validation Rules
    if (!formData.name.trim() || formData.name.trim().length < 2) {
      setError("Please enter a valid Name (minimum 2 characters).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setError("Please enter a valid Email Address.");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.mobile.trim())) {
      setError("Please enter a valid 10-digit Mobile Number.");
      return;
    }

    if (!formData.address.trim() || formData.address.trim().length < 5) {
      setError("Please enter a valid Delivery Address (minimum 5 characters).");
      return;
    }

    if (!formData.city.trim()) {
      setError("Please enter your City.");
      return;
    }

    if (!formData.state.trim()) {
      setError("Please select your State.");
      return;
    }

    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(formData.pincode.trim())) {
      setError("Please enter a valid 6-digit Pincode.");
      return;
    }

    setError("");
    setIsSubmitting(true);
    
    // Animate loading stages
    setSubmissionStep(1); // Syncing
    await new Promise(r => setTimeout(r, 1200));
    
    setSubmissionStep(2); // Generating Shopify Order
    await new Promise(r => setTimeout(r, 1500));

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: formData.name,
          email: formData.email,
          mobile: formData.mobile,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          items: cartItems.map(item => ({
            title: item.title,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
            variantTitle: item.variantTitle
          })),
          subtotal,
          shipping: shippingCharge,
          discount: discountAmount,
          total: estimatedTotal,
          paymentMethod
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate order.");
      }

      const data = await response.json();
      setSubmissionStep(3); // Completed
      await new Promise(r => setTimeout(r, 800));

      // Clear headless client cart local storage and context
      clearCart();

      const redirectMethod = paymentMethod === "COD" ? "&method=COD" : "";
      window.location.href = `/payment?orderNumber=${encodeURIComponent(data.order.orderNumber)}&amount=${encodeURIComponent(estimatedTotal.toString())}&mobile=${encodeURIComponent(formData.mobile)}&name=${encodeURIComponent(formData.name)}${redirectMethod}`;
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong while booking the order. Please try again.");
      setIsSubmitting(false);
      setSubmissionStep(0);
    }
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 px-4 md:px-10 font-poppins text-textDark">
      {/* Loading Overlay */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-white rounded-[32px] p-10 max-w-sm w-full text-center space-y-6 shadow-2xl border border-borderCustom mx-4">
              <div className="relative w-20 h-20 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                <div className="absolute inset-2 rounded-full border-4 border-blueAccent/20 border-b-blueAccent animate-spin [animation-duration:1.5s]" />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-base font-bold uppercase tracking-wider">
                  {submissionStep === 1 && "Syncing Cart Items..."}
                  {submissionStep === 2 && "Generating Shopify Order..."}
                  {submissionStep === 3 && "Booking Confirmed!"}
                </h3>
                <p className="text-xs text-textDark/60 font-sans leading-relaxed">
                  {submissionStep === 1 && "Verifying inventory and store configurations..."}
                  {submissionStep === 2 && "Securing order IDs on your Shopify headless endpoint..."}
                  {submissionStep === 3 && "Redirecting to payment instructions panel..."}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Breadcrumbs */}
        <div className="flex items-center justify-between">
          <Link href="/shop" className="inline-flex items-center space-x-2 text-xs font-bold tracking-widest text-primary uppercase group transition-colors">
            <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
            <span>Back to Shopping</span>
          </Link>
          <span className="text-[10px] tracking-widest uppercase font-bold text-textDark/40">
            Secure Native Checkout
          </span>
        </div>

        {/* Layout grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form Column */}
          <div className="lg:col-span-7 bg-white rounded-[32px] border border-borderCustom p-6 md:p-8 shadow-xs space-y-8">
            <div className="flex items-center space-x-3 border-b border-borderCustom pb-4">
              <div className="w-8 h-8 rounded-full bg-softPink flex items-center justify-center text-primary">
                <Truck size={16} />
              </div>
              <div>
                <h2 className="text-sm font-bold tracking-widest uppercase">
                  Shipping Information
                </h2>
                <p className="text-[10px] text-textDark/50">
                  Where should we deliver your luxury kidswear?
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 rounded-2xl p-4 text-xs font-sans border border-red-100 flex items-center space-x-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-textDark/60 tracking-wider">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter full name"
                    suppressHydrationWarning
                    className="w-full bg-lightGray/40 border border-borderCustom rounded-2xl px-4 py-3.5 text-xs outline-none focus:border-primary focus:bg-white transition-all font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-textDark/60 tracking-wider">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="mobile"
                    required
                    pattern="[0-9]{10}"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    suppressHydrationWarning
                    className="w-full bg-lightGray/40 border border-borderCustom rounded-2xl px-4 py-3.5 text-xs outline-none focus:border-primary focus:bg-white transition-all font-sans"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-textDark/60 tracking-wider">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="name@example.com"
                  suppressHydrationWarning
                  className="w-full bg-lightGray/40 border border-borderCustom rounded-2xl px-4 py-3.5 text-xs outline-none focus:border-primary focus:bg-white transition-all font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-textDark/60 tracking-wider">
                  Detailed Address *
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="House/Flat No, Apartment, Street name"
                  suppressHydrationWarning
                  className="w-full bg-lightGray/40 border border-borderCustom rounded-2xl px-4 py-3.5 text-xs outline-none focus:border-primary focus:bg-white transition-all font-sans"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-textDark/60 tracking-wider">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City name"
                    suppressHydrationWarning
                    className="w-full bg-lightGray/40 border border-borderCustom rounded-2xl px-4 py-3.5 text-xs outline-none focus:border-primary focus:bg-white transition-all font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-textDark/60 tracking-wider">
                    State *
                  </label>
                  <select
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-lightGray/40 border border-borderCustom rounded-2xl px-4 py-3.5 text-xs outline-none focus:border-primary focus:bg-white transition-all font-sans"
                  >
                    {STATES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-textDark/60 tracking-wider">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    pattern="[0-9]{6}"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="6-digit ZIP code"
                    suppressHydrationWarning
                    className="w-full bg-lightGray/40 border border-borderCustom rounded-2xl px-4 py-3.5 text-xs outline-none focus:border-primary focus:bg-white transition-all font-sans"
                  />
                </div>
              </div>

              <div className="space-y-3.5 mt-6">
                <label className="text-[10px] uppercase font-bold text-textDark/60 tracking-wider">
                  Select Payment Method *
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Option 1: Manual */}
                  <div 
                    onClick={() => setPaymentMethod("MANUAL")}
                    className={`border rounded-2xl p-4 cursor-pointer transition-all duration-300 flex items-start space-x-3 ${
                      paymentMethod === "MANUAL" 
                        ? "border-primary bg-[#FAF5F0]" 
                        : "border-borderCustom bg-white hover:bg-lightGray/10"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                      paymentMethod === "MANUAL" ? "border-primary bg-primary text-white" : "border-textDark/30"
                    }`}>
                      {paymentMethod === "MANUAL" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold uppercase text-textDark">
                        UPI / Bank Transfer
                      </h4>
                      <p className="text-[10px] text-textDark/60 font-sans mt-0.5 leading-relaxed">
                        Pay manually via UPI QR or Bank account transfer on the next screen.
                      </p>
                    </div>
                  </div>

                  {/* Option 2: COD */}
                  <div 
                    onClick={() => setPaymentMethod("COD")}
                    className={`border rounded-2xl p-4 cursor-pointer transition-all duration-300 flex items-start space-x-3 ${
                      paymentMethod === "COD" 
                        ? "border-primary bg-[#F0F5FA]" 
                        : "border-borderCustom bg-white hover:bg-lightGray/10"
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                      paymentMethod === "COD" ? "border-primary bg-primary text-white" : "border-textDark/30"
                    }`}>
                      {paymentMethod === "COD" && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xs font-bold uppercase text-textDark">
                        Cash on Delivery (COD)
                      </h4>
                      <p className="text-[10px] text-textDark/60 font-sans mt-0.5 leading-relaxed">
                        Pay with cash upon delivery. COD is active for your pincode.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={cartItems.length === 0}
                className="w-full bg-primary hover:bg-primary-hover text-white text-xs tracking-widest font-bold uppercase py-4 rounded-2xl transition-all duration-300 btn-glow-hover hover:scale-[1.02] disabled:opacity-50 mt-4 flex items-center justify-center space-x-2"
              >
                <span>Place Order & Pay</span>
                <Check size={14} />
              </button>
            </form>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-5 space-y-6">
            {/* Cart Summary Card */}
            <div className="bg-white rounded-[32px] border border-borderCustom p-6 md:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between border-b border-borderCustom pb-4">
                <div className="flex items-center space-x-2">
                  <ShoppingBag size={16} className="text-primary" />
                  <h3 className="text-xs font-bold tracking-widest uppercase">
                    Order Summary
                  </h3>
                </div>
                <span className="text-[11px] font-bold font-mono bg-softPink text-primary rounded-full px-2.5 py-0.5">
                  {cartItems.length} items
                </span>
              </div>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-borderCustom/55 pr-1 font-sans">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-4 py-3 first:pt-0 last:pb-0">
                    <div className="relative w-12 h-14 bg-lightGray rounded-xl overflow-hidden flex-shrink-0 border border-borderCustom">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="text-xs font-bold text-textDark truncate font-poppins">
                        {item.title}
                      </h4>
                      <p className="text-[10px] text-textDark/50 mt-0.5 capitalize">
                        Size: {item.variantTitle} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-xs font-bold text-textDark font-mono flex-shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Coupon Form */}
              <form onSubmit={applyCoupon} className="flex gap-2 pt-2 border-t border-borderCustom/50">
                <input
                  type="text"
                  placeholder="Promo Code (NKORA5)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={couponApplied}
                  className="flex-1 bg-lightGray/40 border border-borderCustom rounded-xl px-4 py-2.5 text-xs outline-none uppercase font-poppins placeholder-textDark/30 focus:border-primary disabled:bg-gray-100"
                />
                <button
                  type="submit"
                  disabled={couponApplied || !couponCode.trim()}
                  className="bg-primary hover:bg-primary-hover text-white text-[10px] tracking-widest font-bold uppercase py-2.5 px-4 rounded-xl transition-all"
                >
                  Apply
                </button>
              </form>

              {/* Fee calculations */}
              <div className="space-y-3 pt-2 text-xs border-t border-borderCustom/50 font-sans">
                <div className="flex justify-between text-textDark/70">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatPrice(subtotal)}</span>
                </div>
                
                {couponApplied && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount (5% Off)</span>
                    <span className="font-mono">-{formatPrice(subtotal * 0.05)}</span>
                  </div>
                )}

                <div className="flex justify-between text-textDark/70">
                  <span>Shipping</span>
                  <span className="font-mono">{shippingCharge === 0 ? "FREE" : formatPrice(shippingCharge)}</span>
                </div>

                <div className="flex justify-between text-sm font-bold border-t border-borderCustom pt-4 mt-2">
                  <span className="font-poppins uppercase">Total Payable</span>
                  <span className="font-mono text-primary text-base">
                    {formatPrice(estimatedTotal)}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
