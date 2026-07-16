"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Copy, CheckCircle2, ChevronRight, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/utils";

function PaymentContent() {
  const searchParams = useSearchParams();
  
  // Try to parse values from URL search parameters, fallback to empty
  const orderNumber = searchParams.get("orderNumber") || "NK-1000";
  const amount = searchParams.get("amount") || "0";
  const initialMobile = searchParams.get("mobile") || "";
  const initialName = searchParams.get("name") || "";
  
  const [settings, setSettings] = useState({
    qrCodeUrl: "",
    upiId: "",
    accountName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branch: "",
    supportNumber: "",
    whatsappNumber: ""
  });
  const [form, setForm] = useState({
    customerName: initialName,
    mobileNumber: initialMobile,
    orderNumber: orderNumber,
    amountPaid: amount,
    utr: "",
    transactionId: "",
    method: "UPI",
    notes: ""
  });
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  // Fetch admin settings dynamically on mount
  useEffect(() => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setSettings(data.settings);
        }
      })
      .catch(err => console.error("Failed to load settings:", err));

    const methodParam = searchParams.get("method");
    if (methodParam === "COD") {
      setIsSuccess(true);
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.customerName.trim() || form.customerName.trim().length < 2) {
      setError("Please enter a valid Sender Name (minimum 2 characters).");
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(form.mobileNumber.trim())) {
      setError("Please enter a valid 10-digit Mobile Number.");
      return;
    }

    const cleanUtr = form.utr.trim();
    if (!cleanUtr) {
      setError("Please enter UTR Number or Transaction ID for verification.");
      return;
    }

    if (form.method === "UPI") {
      const upiUtrRegex = /^\d{12}$/;
      if (!upiUtrRegex.test(cleanUtr)) {
        setError("UPI UTR Number must be exactly 12 digits (e.g. 123456789012).");
        return;
      }
    } else {
      const bankRefRegex = /^[a-zA-Z0-9]{8,22}$/;
      if (!bankRefRegex.test(cleanUtr)) {
        setError("Bank Reference / IMPS ID must be between 8 and 22 alphanumeric characters.");
        return;
      }
    }

    setError("");
    setIsSubmitting(true);

    try {
      // 1. Locate order in database and update verification details
      const ordersRes = await fetch(`/api/orders`);
      const ordersData = await ordersRes.json();
      const targetOrder = ordersData.orders?.find((o: any) => o.orderNumber.toUpperCase() === form.orderNumber.trim().toUpperCase());

      if (!targetOrder) {
        throw new Error("Provided Order Number was not found in database. Double check the order number.");
      }

      const updateRes = await fetch("/api/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: targetOrder.id,
          action: "submit_payment",
          paymentDetails: {
            utr: form.utr,
            method: form.method,
            senderName: form.customerName,
            notes: form.notes
          }
        })
      });

      if (!updateRes.ok) {
        throw new Error("Failed to submit verification details.");
      }

      setIsSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong. Please check details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div 
            key="payment-panel"
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
          >
            {/* Left Column: Bank Details / Instructions */}
            <div className="lg:col-span-6 space-y-6">
              <div className="bg-white rounded-[32px] border border-borderCustom p-6 md:p-8 shadow-xs space-y-6">
                <div>
                  <span className="text-[10px] uppercase font-bold text-primary tracking-widest">
                    Step 2 of 3
                  </span>
                  <h2 className="text-xl font-bold uppercase tracking-wider mt-1">
                    Manual Bank Transfer / UPI
                  </h2>
                  <p className="text-xs text-textDark/60 font-sans mt-0.5 leading-relaxed">
                    Please transfer the exact amount and submit details below.
                  </p>
                </div>

                {/* Summary items */}
                <div className="bg-[#FAF5F0] rounded-2xl p-4 divide-y divide-borderCustom/40 space-y-3 font-sans">
                  <div className="flex justify-between items-center text-xs pb-3 first:pt-0">
                    <span className="text-textDark/60 font-medium">Order Number:</span>
                    <span className="font-bold text-textDark">{form.orderNumber}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs pt-3">
                    <span className="text-textDark/60 font-medium">Total Amount Payable:</span>
                    <span className="font-bold text-primary text-sm font-mono">
                      {formatPrice(parseFloat(form.amountPaid) || 0)}
                    </span>
                  </div>
                </div>

                {/* UPI QR Section */}
                <div className="border-t border-borderCustom/60 pt-6 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-textDark/80">
                    Option A: Scan & Pay with UPI
                  </h3>
                  
                  <div className="flex items-center space-x-6">
                    {settings.qrCodeUrl ? (
                      <div className="relative w-32 h-32 border border-borderCustom rounded-2xl overflow-hidden bg-[#F9F9F9] p-1 flex-shrink-0 flex items-center justify-center">
                        <img
                          src={settings.qrCodeUrl}
                          alt="Payment QR Code"
                          className="object-contain w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="w-32 h-32 bg-lightGray animate-pulse rounded-2xl flex-shrink-0" />
                    )}

                    <div className="space-y-2 flex-grow min-w-0">
                      <p className="text-[10px] text-textDark/50 font-sans uppercase font-bold">
                        Official Merchant UPI ID
                      </p>
                      <div className="flex items-center space-x-2 bg-lightGray/40 border border-borderCustom rounded-xl p-2.5">
                        <span className="text-xs font-mono font-medium truncate flex-grow">
                          {settings.upiId || "nkora.store@okaxis"}
                        </span>
                        <button
                          onClick={() => copyToClipboard(settings.upiId, "upi")}
                          className="text-textDark/40 hover:text-primary transition-colors flex-shrink-0 p-0.5"
                        >
                          {copiedField === "upi" ? "Copied!" : <Copy size={13} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank Details Section */}
                <div className="border-t border-borderCustom/60 pt-6 space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-textDark/80">
                    Option B: Net Banking / Bank Transfer
                  </h3>

                  <div className="space-y-3 font-sans text-xs">
                    <div className="flex justify-between py-1 border-b border-borderCustom/30">
                      <span className="text-textDark/50">Beneficiary Name:</span>
                      <span className="font-semibold text-right">{settings.accountName || "NKORA KidsWear Pvt Ltd"}</span>
                    </div>
                    
                    <div className="flex justify-between py-1 border-b border-borderCustom/30 items-center">
                      <span className="text-textDark/50">Account Number:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-semibold">{settings.accountNumber || "923020054321098"}</span>
                        <button
                          onClick={() => copyToClipboard(settings.accountNumber, "acc")}
                          className="text-textDark/40 hover:text-primary transition-colors"
                        >
                          {copiedField === "acc" ? "Copied!" : <Copy size={12} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between py-1 border-b border-borderCustom/30 items-center">
                      <span className="text-textDark/50">IFSC Code:</span>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-semibold">{settings.ifscCode || "UTIB0000005"}</span>
                        <button
                          onClick={() => copyToClipboard(settings.ifscCode, "ifsc")}
                          className="text-textDark/40 hover:text-primary transition-colors"
                        >
                          {copiedField === "ifsc" ? "Copied!" : <Copy size={12} />}
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between py-1 border-b border-borderCustom/30">
                      <span className="text-textDark/50">Bank & Branch:</span>
                      <span className="font-semibold text-right text-textDark/80">
                        {settings.bankName || "Axis Bank"}, {settings.branch || "Kolkata Main"}
                      </span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column: Verification Form */}
            <div className="lg:col-span-6">
              <div className="bg-white rounded-[32px] border border-borderCustom p-6 md:p-8 shadow-xs space-y-6">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-textDark">
                    Submit Payment Details
                  </h2>
                  <p className="text-[11px] text-textDark/50 mt-0.5 font-sans">
                    Our billing desk validates payment details within 2-4 working hours.
                  </p>
                </div>

                {error && (
                  <div className="bg-red-50 text-red-600 rounded-2xl p-4 text-xs font-sans border border-red-100">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-bold text-textDark/60 tracking-wider">
                        Sender Name *
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        required
                        value={form.customerName}
                        onChange={handleInputChange}
                        placeholder="Account Holder's Name"
                        suppressHydrationWarning
                        className="w-full bg-lightGray/40 border border-borderCustom rounded-2xl px-4 py-3 text-xs outline-none focus:border-primary focus:bg-white transition-all font-sans"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-bold text-textDark/60 tracking-wider">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        required
                        value={form.mobileNumber}
                        onChange={handleInputChange}
                        placeholder="10-digit number"
                        suppressHydrationWarning
                        className="w-full bg-lightGray/40 border border-borderCustom rounded-2xl px-4 py-3 text-xs outline-none focus:border-primary focus:bg-white transition-all font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-bold text-textDark/60 tracking-wider">
                        Order Number
                      </label>
                      <input
                        type="text"
                        name="orderNumber"
                        readOnly
                        value={form.orderNumber}
                        suppressHydrationWarning
                        className="w-full bg-lightGray/30 border border-borderCustom/60 text-textDark/50 rounded-2xl px-4 py-3 text-xs outline-none font-sans cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-bold text-textDark/60 tracking-wider">
                        Amount Payable (₹)
                      </label>
                      <input
                        type="text"
                        name="amountPaid"
                        readOnly
                        value={form.amountPaid}
                        suppressHydrationWarning
                        className="w-full bg-lightGray/30 border border-borderCustom/60 text-textDark/50 rounded-2xl px-4 py-3 text-xs outline-none font-sans cursor-not-allowed font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[9px] uppercase font-bold text-textDark/60 tracking-wider">
                        UTR / Transaction ID *
                      </label>
                      <input
                        type="text"
                        name="utr"
                        required
                        value={form.utr}
                        onChange={handleInputChange}
                        placeholder="12-digit Ref or Txn ID"
                        suppressHydrationWarning
                        className="w-full bg-lightGray/40 border border-borderCustom rounded-2xl px-4 py-3 text-xs outline-none focus:border-primary focus:bg-white transition-all font-sans"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] uppercase font-bold text-textDark/60 tracking-wider">
                        Method *
                      </label>
                      <select
                        name="method"
                        value={form.method}
                        onChange={handleInputChange}
                        suppressHydrationWarning
                        className="w-full bg-lightGray/40 border border-borderCustom rounded-2xl px-3 py-3 text-xs outline-none focus:border-primary focus:bg-white transition-all font-sans"
                      >
                        <option value="UPI">UPI / QR</option>
                        <option value="Bank Transfer">Bank Transfer</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] uppercase font-bold text-textDark/60 tracking-wider">
                      Optional Notes
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      value={form.notes}
                      onChange={handleInputChange}
                      placeholder="Any updates regarding your transaction"
                      suppressHydrationWarning
                      className="w-full bg-lightGray/40 border border-borderCustom rounded-2xl px-4 py-3 text-xs outline-none focus:border-primary focus:bg-white transition-all font-sans resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    suppressHydrationWarning
                    className="w-full bg-primary hover:bg-primary-hover text-white text-xs tracking-widest font-bold uppercase py-4 rounded-2xl transition-all duration-300 btn-glow-hover flex items-center justify-center space-x-2 mt-4 disabled:opacity-50"
                  >
                    <span>{isSubmitting ? "Submitting..." : "Submit Verification Details"}</span>
                    <ChevronRight size={14} />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success-panel"
            className="bg-white rounded-[32px] border border-borderCustom p-10 max-w-xl mx-auto shadow-xs text-center space-y-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} className="animate-bounce" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-bold uppercase tracking-wider text-textDark">
                {searchParams.get("method") === "COD" ? "Order Placed Successfully!" : "Verification Details Submitted"}
              </h2>
              <p className="text-xs text-textDark/60 font-sans max-w-md mx-auto leading-relaxed">
                {searchParams.get("method") === "COD" ? (
                  <>
                    Thank you! Your Cash on Delivery order <span className="font-bold text-textDark">{form.orderNumber}</span> has been confirmed and synced to Shopify. We are preparing it for shipment.
                  </>
                ) : (
                  <>
                    Thank you! Your transaction details for order <span className="font-bold text-textDark">{form.orderNumber}</span> have been submitted to our verification desk. We will review it shortly.
                  </>
                )}
              </p>
            </div>

            {/* Next Steps Info */}
            <div className="bg-lightGray/50 border border-borderCustom/60 rounded-2xl p-5 text-left font-sans text-xs space-y-3 max-w-md mx-auto">
              <h4 className="font-bold text-textDark uppercase tracking-wider text-[10px]">
                What happens next?
              </h4>
              {searchParams.get("method") === "COD" ? (
                <ul className="space-y-2 text-textDark/70 leading-relaxed list-disc list-inside">
                  <li>We package and dispatch your items from our warehouse.</li>
                  <li>Delivery partner will deliver the parcel to your doorstep in 5 - 8 days.</li>
                  <li>Pay with cash or digital UPI to the courier agent upon arrival.</li>
                </ul>
              ) : (
                <ul className="space-y-2 text-textDark/70 leading-relaxed list-disc list-inside">
                  <li>Our desk cross-references the UTR / Ref ID with our bank entries.</li>
                  <li>Once verified, you will receive a confirmation message.</li>
                  <li>You can track the fulfillment timeline in real-time.</li>
                </ul>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                href={`/track?orderNumber=${encodeURIComponent(form.orderNumber)}&identifier=${encodeURIComponent(form.mobileNumber)}`}
                className="bg-primary hover:bg-primary-hover text-white text-xs tracking-widest font-bold uppercase py-3.5 px-6 rounded-2xl transition-all"
              >
                Track Order Status
              </Link>
              
              <a
                href={`https://wa.me/${settings.whatsappNumber.replace(/[^0-9]/g, "")}?text=Hi%20NKORA%2C%20I%20have%20placed%20a%20Cash%20on%20Delivery%20order%20${form.orderNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-borderCustom hover:bg-lightGray/40 text-textDark text-xs tracking-widest font-bold uppercase py-3.5 px-6 rounded-2xl transition-all flex items-center justify-center space-x-2"
              >
                <MessageSquare size={14} className="text-green-500" />
                <span>Notify via WhatsApp</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function PaymentInstructionsPage() {
  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12 px-4 md:px-10 font-poppins text-textDark">
      <Suspense fallback={
        <div className="max-w-md mx-auto bg-white rounded-3xl p-10 text-center shadow-xs border border-borderCustom">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-xs text-textDark/50 mt-4">Loading billing details...</p>
        </div>
      }>
        <PaymentContent />
      </Suspense>
    </div>
  );
}
