"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Package, MapPin, Calendar, Truck, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { formatPrice } from "@/lib/utils";

const TIMELINE_STEPS = [
  { status: "Ordered", label: "Order Placed" },
  { status: "Payment Verified", label: "Payment Verified" },
  { status: "Packed", label: "Order Packed" },
  { status: "Picked Up", label: "Courier Picked Up" },
  { status: "In Transit", label: "In Transit" },
  { status: "Out For Delivery", label: "Out For Delivery" },
  { status: "Delivered", label: "Delivered" }
];

function TrackContent() {
  const searchParams = useSearchParams();
  const initialOrderNumber = searchParams.get("orderNumber") || "";

  const [orderNumber, setOrderNumber] = useState(initialOrderNumber);
  const [identifier, setIdentifier] = useState("");
  const [order, setOrder] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const performSearch = async (ordNum: string, ident: string) => {
    if (!ordNum.trim() || !ident.trim()) {
      setError("Please fill in both fields.");
      return;
    }

    setError("");
    setIsLoading(true);
    setOrder(null);

    try {
      const response = await fetch(`/api/orders?orderNumber=${encodeURIComponent(ordNum)}&identifier=${encodeURIComponent(ident)}`);
      
      if (!response.ok) {
        const data = await response.json();
        setError(data.error || "Order not found. Check details.");
        return;
      }

      const data = await response.json();
      setOrder(data.order);
    } catch (err: any) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    await performSearch(orderNumber, identifier);
  };

  useEffect(() => {
    const initialIdentifier = searchParams.get("identifier") || "";
    if (initialOrderNumber) {
      setOrderNumber(initialOrderNumber);
      if (initialIdentifier) {
        setIdentifier(initialIdentifier);
        performSearch(initialOrderNumber, initialIdentifier);
      }
    }
  }, [initialOrderNumber, searchParams]);

  const getActiveStepIndex = (status: string) => {
    if (status === "Pending Payment" || status === "Payment Under Verification") return 0;
    if (status === "Payment Failed" || status === "Cancelled" || status === "Returned") return -1;
    
    const idx = TIMELINE_STEPS.findIndex(step => step.status === status);
    if (idx !== -1) return idx;
    
    if (status === "Preparing Order") return 1;
    return 0;
  };

  const activeIndex = order ? getActiveStepIndex(order.status) : -1;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      
      {/* Tracking Search Card */}
      <div className="lg:col-span-4 bg-white rounded-[32px] border border-borderCustom p-6 md:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-widest">
            Track Your Order
          </h2>
          <p className="text-[10px] text-textDark/50 mt-0.5 font-sans leading-relaxed">
            Enter your unique Order ID and verified contacts to lookup live parcel locations.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 rounded-2xl p-3.5 text-xs font-sans border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSearch} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-[9px] uppercase font-bold text-textDark/60 tracking-wider">
              Order Number *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. NK-1051"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="w-full bg-lightGray/40 border border-borderCustom rounded-2xl px-4 py-3 text-xs outline-none focus:border-primary focus:bg-white transition-all font-sans"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[9px] uppercase font-bold text-textDark/60 tracking-wider">
              Email or Mobile Number *
            </label>
            <input
              type="text"
              required
              placeholder="name@email.com or mobile"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full bg-lightGray/40 border border-borderCustom rounded-2xl px-4 py-3 text-xs outline-none focus:border-primary focus:bg-white transition-all font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary hover:bg-primary-hover text-white text-xs tracking-widest font-bold uppercase py-3.5 rounded-2xl transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Searching...</span>
            ) : (
              <>
                <span>Look Up Order</span>
                <Search size={14} />
              </>
            )}
          </button>
        </form>
      </div>

      {/* Tracking Result View */}
      <div className="lg:col-span-8">
        {order ? (
          <div className="space-y-6">
            
            {/* Status Box */}
            <div className="bg-white rounded-[32px] border border-borderCustom p-6 md:p-8 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-borderCustom pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-primary tracking-widest">
                    Status Update
                  </span>
                  <h3 className="text-base font-bold uppercase tracking-wider text-textDark mt-0.5">
                    {order.status === "Pending Payment" && "Awaiting Payment Verification"}
                    {order.status === "Payment Under Verification" && "Payment verification in progress"}
                    {order.status === "Payment Verified" && "Payment cleared successfully"}
                    {order.status === "Preparing Order" && "Fulfillment initiated"}
                    {order.status === "Packed" && "Parcel packed and ready"}
                    {order.status === "Picked Up" && "Dispatched from warehouse"}
                    {order.status === "In Transit" && "In transit with courier"}
                    {order.status === "Out For Delivery" && "Out for delivery today"}
                    {order.status === "Delivered" && "Successfully Delivered!"}
                    {["Payment Failed", "Cancelled", "Returned"].includes(order.status) && `Order ${order.status}`}
                  </h3>
                </div>
                <span className="text-xs font-bold font-mono bg-softPink text-primary rounded-full px-3 py-1 uppercase">
                  {order.status}
                </span>
              </div>

              {/* Shipment details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-sans text-xs pt-1">
                <div className="space-y-1">
                  <div className="text-textDark/40 flex items-center space-x-1.5">
                    <Truck size={13} />
                    <span>Courier Partner</span>
                  </div>
                  <p className="font-bold text-textDark">{order.courierPartner || "Awaiting verification"}</p>
                </div>

                <div className="space-y-1">
                  <div className="text-textDark/40 flex items-center space-x-1.5">
                    <MapPin size={13} />
                    <span>Tracking Number</span>
                  </div>
                  <p className="font-mono font-bold text-textDark">{order.trackingNumber || "Awaiting dispatch"}</p>
                </div>

                <div className="space-y-1">
                  <div className="text-textDark/40 flex items-center space-x-1.5">
                    <Calendar size={13} />
                    <span>Est. Delivery Date</span>
                  </div>
                  <p className="font-bold text-primary">{order.estimatedDelivery || "5 - 8 days"}</p>
                </div>
              </div>

              {/* Complete Progress Timeline */}
              {activeIndex !== -1 && (
                <div className="border-t border-borderCustom/60 pt-8 space-y-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-textDark/80">
                    Shipment Progress Timeline
                  </h4>

                  <div className="relative pl-6 space-y-8 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-borderCustom">
                    {TIMELINE_STEPS.map((step, idx) => {
                      const isDone = idx <= activeIndex;
                      const isCurrent = idx === activeIndex;

                      return (
                        <div key={idx} className="relative flex items-start space-x-4">
                          <div className={`absolute -left-[22px] w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center transition-colors duration-300 ${
                            isDone 
                              ? "border-primary bg-primary text-white" 
                              : "border-borderCustom"
                          }`}>
                            {isDone && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                          </div>

                          <div className="font-sans text-xs">
                            <p className={`font-bold transition-colors ${isDone ? "text-textDark" : "text-textDark/40"}`}>
                              {step.label}
                            </p>
                            {isCurrent && (
                              <p className="text-[10px] text-primary font-medium mt-0.5 animate-pulse">
                                Current Location & Stage
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>

            {/* Order summary info */}
            <div className="bg-white rounded-[32px] border border-borderCustom p-6 md:p-8 shadow-xs space-y-6 font-sans">
              <div className="flex items-center space-x-2 border-b border-borderCustom pb-4">
                <Package size={16} className="text-primary" />
                <h3 className="text-xs font-bold tracking-widest uppercase font-poppins">
                  Verified Order Invoice
                </h3>
              </div>

              <div className="divide-y divide-borderCustom/40">
                {order.items.map((item: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-center py-3 first:pt-0 last:pb-0 text-xs">
                    <div>
                      <p className="font-bold text-textDark font-poppins">{item.title}</p>
                      <p className="text-[10px] text-textDark/50 mt-0.5 uppercase">Size: {item.variantTitle} × {item.quantity}</p>
                    </div>
                    <span className="font-bold text-textDark font-mono">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-borderCustom/50 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-textDark/60">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatPrice(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Coupon Discount</span>
                    <span className="font-mono">-{formatPrice(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-textDark/60">
                  <span>Shipping</span>
                  <span className="font-mono">{order.shipping === 0 ? "FREE" : formatPrice(order.shipping)}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-borderCustom pt-3 mt-1 font-poppins uppercase">
                  <span>Total Invoice</span>
                  <span className="font-mono text-primary">{formatPrice(order.total)}</span>
                </div>
              </div>

              <div className="bg-lightGray/40 rounded-2xl p-4 border border-borderCustom/60 text-xs space-y-2 text-textDark/70 leading-relaxed">
                <p>
                  <strong className="text-textDark">Shipping Address:</strong> {order.address}, {order.city}, {order.state} - {order.pincode}
                </p>
                <p>
                  <strong className="text-textDark">Customer Contacts:</strong> {order.customerName} ({order.mobile})
                </p>
              </div>
            </div>

          </div>
        ) : (
          <div className="h-full bg-white rounded-[32px] border border-borderCustom p-10 shadow-xs flex flex-col items-center justify-center text-center space-y-4 min-h-[300px]">
            <div className="w-12 h-12 bg-lightGray rounded-full flex items-center justify-center text-textDark/30">
              <Package size={22} />
            </div>
            <div>
              <h3 className="text-xs font-bold tracking-widest uppercase">
                No Order Loaded
              </h3>
              <p className="text-[10px] text-textDark/50 max-w-xs leading-relaxed font-sans mt-0.5">
                Query your active order details using the form on the left.
              </p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 px-4 md:px-10 font-poppins text-textDark">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header link */}
        <Link href="/shop" className="inline-flex items-center space-x-2 text-xs font-bold tracking-widest text-primary uppercase group transition-colors">
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
          <span>Return to shop</span>
        </Link>

        {/* Outer Grid */}
        <Suspense fallback={
          <div className="max-w-md mx-auto bg-white rounded-3xl p-10 text-center shadow-xs border border-borderCustom">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
            <p className="text-xs text-textDark/50 mt-4">Loading tracker details...</p>
          </div>
        }>
          <TrackContent />
        </Suspense>

      </div>
    </div>
  );
}
