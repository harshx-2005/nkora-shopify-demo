"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Package, Star, Calendar, Loader2, LogOut, ArrowRight, ShoppingBag } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { useCustomer } from "@/context/CustomerContext";

export default function AccountPage() {
  const { isLoggedIn, customer, loading, logout } = useCustomer();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLogoutLoading(true);
    await logout();
    router.push("/");
  };

  // 1. Loading State
  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center font-poppins">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="animate-spin text-primary" size={32} />
          <p className="text-xs text-textDark/60 tracking-wider">Syncing secure Shopify session...</p>
        </div>
      </div>
    );
  }

  // 2. Unauthenticated State
  if (!isLoggedIn || !customer) {
    return (
      <div className="bg-gradient-to-br from-softPink/10 via-white to-lightGray/20 min-h-screen flex items-center justify-center py-16 px-4 font-poppins">
        <div className="w-full max-w-md bg-white border border-borderCustom rounded-[36px] p-8 text-center shadow-[0_24px_80px_rgba(0,0,0,0.05)] space-y-6">
          <div className="w-16 h-16 rounded-full bg-softPink text-primary flex items-center justify-center mx-auto shadow-inner">
            <ShoppingBag size={24} />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-textDark tracking-wide">Elite Customer Lounge</h1>
            <p className="text-xs text-textDark/60 leading-relaxed px-2">
              Sign in to trace your live deliveries, manage shipping profiles, and accumulate exclusive parent tier reward points.
            </p>
          </div>
          
          <div className="border-y border-borderCustom/60 py-4 text-left space-y-3 text-xs text-textDark/70">
            <div className="flex items-center space-x-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              <span>Accelerated secure checkout flow</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              <span>Real-time shipping and delivery history tracking</span>
            </div>
            <div className="flex items-center space-x-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
              <span>Exclusive access to pre-launches and designer collections</span>
            </div>
          </div>

          <Link
            href="/account/login"
            className="w-full bg-primary hover:bg-primary-hover text-white text-xs tracking-widest font-bold uppercase py-4 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>Sign In to Account</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  // Calculate Name Initials
  const firstName = customer.firstName || "";
  const lastName = customer.lastName || "";
  const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase() || "C";

  // Parse Orders
  const orders = customer.orders?.edges?.map((edge: any) => edge.node) || [];

  return (
    <div className="bg-white min-h-screen py-10 px-4 md:px-10 font-poppins">
      <div className="max-w-site mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-borderCustom gap-4">
          <div>
            <h1 className="text-2xl font-light tracking-[0.15em] text-textDark uppercase">
              My Account
            </h1>
            <p className="text-[10px] text-textDark/40 tracking-wider uppercase mt-1">
              Customer Portal &amp; Live Tracking
            </p>
          </div>
          <button
            onClick={handleLogout}
            disabled={logoutLoading}
            className="flex items-center space-x-2 bg-lightGray/60 hover:bg-red-50 text-textDark hover:text-red-700 text-xs tracking-wider font-bold uppercase py-2.5 px-5 rounded-2xl border border-borderCustom hover:border-red-200 transition-all duration-300"
          >
            {logoutLoading ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <>
                <LogOut size={14} />
                <span>Log Out</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Columns: Profile Overview & default addresses */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Profile Overview */}
            <div className="bg-lightGray/40 border border-borderCustom rounded-[32px] p-6 space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-softPink text-primary flex items-center justify-center font-bold text-lg shadow-sm">
                  {initials}
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm font-bold text-textDark truncate">
                    {firstName} {lastName}
                  </h2>
                  <p className="text-[10px] text-textDark/50 font-sans truncate">
                    {customer.email}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between items-center bg-white border border-borderCustom/60 rounded-xl p-3.5 text-xs text-textDark/80">
                <span className="flex items-center space-x-1.5 font-medium">
                  <Star size={13} className="text-primary animate-pulse" />
                  <span>Star Parent Status</span>
                </span>
                <span className="font-bold text-primary font-mono">
                  {customer.id.includes("mock") ? "150 Pts" : "Active Member"}
                </span>
              </div>
            </div>

            {/* Default Shipping Address */}
            <div className="bg-lightGray/40 border border-borderCustom rounded-[32px] p-6 space-y-4">
              <div className="flex items-center space-x-2 border-b border-borderCustom pb-3">
                <MapPin size={15} className="text-primary" />
                <h3 className="text-xs font-bold text-textDark uppercase tracking-wider">
                  Default Shipping Address
                </h3>
              </div>
              
              {customer.defaultAddress ? (
                <div className="text-xs text-textDark/70 font-sans leading-relaxed space-y-1">
                  <p className="font-bold text-textDark">
                    {customer.defaultAddress.firstName || firstName} {customer.defaultAddress.lastName || lastName}
                  </p>
                  <p>{customer.defaultAddress.address1}</p>
                  {customer.defaultAddress.address2 && <p>{customer.defaultAddress.address2}</p>}
                  <p>
                    {customer.defaultAddress.city}
                    {customer.defaultAddress.province ? `, ${customer.defaultAddress.province}` : ""}
                  </p>
                  <p className="font-bold text-textDark">
                    {customer.defaultAddress.zip}
                  </p>
                  <p>{customer.defaultAddress.country}</p>
                  {customer.defaultAddress.phone && (
                    <p className="pt-2 text-[10px] text-textDark/40">Phone: {customer.defaultAddress.phone}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2 py-2">
                  <p className="text-xs text-textDark/50 font-sans italic">
                    No shipping addresses registered on Shopify yet.
                  </p>
                  <p className="text-[10px] text-textDark/40 font-sans leading-relaxed">
                    Addresses are automatically saved when you type them in the Shopify checkout page.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Columns: Live Order History */}
          <div className="lg:col-span-8 bg-lightGray/40 border border-borderCustom rounded-[32px] p-6 md:p-8 space-y-6">
            <div className="flex items-center space-x-2 border-b border-borderCustom pb-3">
              <Package size={16} className="text-primary" />
              <h3 className="text-xs font-bold text-textDark uppercase tracking-wider">
                Order History
              </h3>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-borderCustom/60 space-y-4">
                <p className="text-xs text-textDark/50 font-sans">
                  You haven&apos;t placed any orders with this account yet.
                </p>
                <Link
                  href="/shop"
                  className="bg-primary hover:bg-primary-hover text-white text-[10px] tracking-widest font-bold uppercase py-3 px-6 rounded-xl inline-block"
                >
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => {
                  const dateStr = new Date(order.processedAt).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  });

                  // Format line items string
                  const itemsSummary = order.lineItems?.edges
                    ?.map((edge: any) => `${edge.node.title} (${edge.node.variant?.title || "Default"}) x ${edge.node.quantity}`)
                    .join(", ") || "";

                  return (
                    <div
                      key={order.id}
                      className="bg-white border border-borderCustom rounded-2xl p-5 space-y-3 shadow-xs hover:border-primary transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-borderCustom/60 pb-3 gap-2">
                        <div>
                          <span className="text-xs font-bold text-textDark font-mono">
                            #{order.orderNumber || order.id.split("/").pop()}
                          </span>
                          <div className="flex items-center space-x-1 text-[10px] text-textDark/40 font-sans mt-0.5">
                            <Calendar size={10} />
                            <span>Placed on {dateStr}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <span className="bg-pink-50 border border-pink-100 text-primary text-[8px] font-bold tracking-wider uppercase py-0.5 px-2 rounded-full">
                            {order.financialStatus}
                          </span>
                          <span className="bg-green-50 border border-green-100 text-green-700 text-[8px] font-bold tracking-wider uppercase py-0.5 px-2 rounded-full">
                            {order.fulfillmentStatus}
                          </span>
                        </div>
                      </div>

                      <div className="text-xs text-textDark/70 font-sans leading-relaxed">
                        <span className="font-semibold text-textDark block mb-0.5">Items Purchased:</span>
                        <p className="truncate sm:whitespace-normal">{itemsSummary}</p>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-borderCustom/40 text-xs">
                        <span className="text-textDark/50">Total Paid</span>
                        <span className="font-bold text-primary font-mono text-sm">
                          {formatPrice(order.totalPrice?.amount, order.totalPrice?.currencyCode)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
