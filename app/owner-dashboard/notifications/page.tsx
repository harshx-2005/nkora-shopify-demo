"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Mail, Bell, Eye, Layers, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const TEMPLATES = [
  {
    id: "placed",
    title: "Order Booked (Pending Payment)",
    whatsapp: "Hi [Customer Name],\n\nYour NKORA order [Order Number] for [Amount] has been booked! 🎉\n\nPlease complete your manual payment via UPI or Bank Transfer using details here: https://nkora-kidswear.com/payment?orderNumber=[Order Number]\n\nOnce completed, upload your UTR number and screenshot to secure shipping. Thank you!",
    emailSubject: "NKORA KidsWear - Order [Order Number] Booked Successfully",
    emailBody: "Dear [Customer Name],\n\nWe are excited to confirm your order [Order Number] is booked in our system.\n\nTo complete payment:\n1. Scan our merchant QR code or copy the UPI/Bank details.\n2. Transfer the exact amount: [Amount].\n3. Visit https://nkora-kidswear.com/payment to upload your screenshot and transaction ID.\n\nWarm regards,\nTeam NKORA"
  },
  {
    id: "submitted",
    title: "Receipt Verification Initiated",
    whatsapp: "Hi [Customer Name],\n\nWe have received your payment verification details for order [Order Number]. Our accounts desk is cross-checking the records. You will receive an status update shortly. Track order: https://nkora-kidswear.com/track",
    emailSubject: "NKORA KidsWear - Payment Verification Initiated",
    emailBody: "Dear [Customer Name],\n\nWe have received your transaction reference and screenshot. Our billing desk is verifying it with our bank statements. This usually takes 2-4 business hours. We will notify you once verified."
  },
  {
    id: "verified",
    title: "Payment Cleared & Confirmed",
    whatsapp: "Hi [Customer Name],\n\nAwesome news! Your payment for order [Order Number] has been successfully verified! 💖 We have initiated packing. Track details: https://nkora-kidswear.com/track?orderNumber=[Order Number]",
    emailSubject: "NKORA KidsWear - Payment Verified successfully",
    emailBody: "Dear [Customer Name],\n\nWe have successfully verified your payment. Your order [Order Number] is verified and sent to our packing desk. We will dispatch it shortly!"
  },
  {
    id: "shipped",
    title: "Order Dispatched (In Transit)",
    whatsapp: "Hi [Customer Name],\n\nYour NKORA order [Order Number] has been dispatched! 🚀\n\nCourier: [Courier Partner]\nTracking Number: [Tracking Number]\nEst Delivery: [Delivery Date]\n\nTrack progress: https://nkora-kidswear.com/track?orderNumber=[Order Number]",
    emailSubject: "NKORA KidsWear - Order [Order Number] Dispatched",
    emailBody: "Dear [Customer Name],\n\nYour order has been shipped via [Courier Partner].\n\nTracking Number: [Tracking Number]\nEstimated Delivery: [Delivery Date]\n\nYou can track the shipment progress on our tracking portal: https://nkora-kidswear.com/track"
  }
];

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<"whatsapp" | "email">("whatsapp");
  const [previewTemplate, setPreviewTemplate] = useState<any>(TEMPLATES[0]);

  return (
    <div className="bg-[#FAF8F5] min-h-screen font-poppins text-textDark">
      
      {/* Dashboard Top bar */}
      <div className="bg-white border-b border-borderCustom px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link href="/owner-dashboard" className="text-textDark/50 hover:text-primary transition-colors">
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="text-base font-bold uppercase tracking-widest text-textDark flex items-center gap-2">
              <Bell size={16} className="text-primary" />
              <span>Customer Update Templates</span>
            </h1>
            <p className="text-[10px] text-textDark/50">
              Visual email & notification templates for manual order updates
            </p>
          </div>
        </div>
        
        <Link href="/owner-dashboard" className="text-xs font-bold text-primary hover:underline flex items-center space-x-1">
          <span>Console Dashboard</span>
        </Link>
      </div>

      <div className="max-w-5xl mx-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Side: Template picker list */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white border border-borderCustom rounded-[32px] p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-textDark/80">
              Notification Events
            </h3>
            
            <div className="space-y-2">
              {TEMPLATES.map(temp => (
                <button
                  key={temp.id}
                  onClick={() => setPreviewTemplate(temp)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all text-xs font-sans flex items-center justify-between ${
                    previewTemplate.id === temp.id 
                      ? "border-primary bg-softPink/30 font-semibold text-textDark" 
                      : "border-borderCustom/60 hover:bg-lightGray/30 text-textDark/70"
                  }`}
                >
                  <span>{temp.title}</span>
                  <ChevronRight size={14} className="text-textDark/45" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Visual Previewer */}
        <div className="md:col-span-7 space-y-6">
          <div className="bg-white border border-borderCustom rounded-[32px] p-6 md:p-8 shadow-xs space-y-6">
            
            {/* View selectors */}
            <div className="flex justify-between items-center border-b border-borderCustom pb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-textDark">
                Message Layout Preview
              </h3>
              
              <div className="flex border border-borderCustom rounded-xl overflow-hidden p-0.5 bg-lightGray/40 text-xs">
                <button
                  onClick={() => setActiveTab("whatsapp")}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                    activeTab === "whatsapp" 
                      ? "bg-white shadow-xs font-bold text-textDark" 
                      : "text-textDark/60 hover:text-textDark"
                  }`}
                >
                  <MessageSquare size={13} className="text-green-500" />
                  <span>WhatsApp</span>
                </button>
                <button
                  onClick={() => setActiveTab("email")}
                  className={`px-3 py-1.5 rounded-lg flex items-center space-x-1.5 transition-all ${
                    activeTab === "email" 
                      ? "bg-white shadow-xs font-bold text-textDark" 
                      : "text-textDark/60 hover:text-textDark"
                  }`}
                >
                  <Mail size={13} className="text-blue-500" />
                  <span>Email</span>
                </button>
              </div>
            </div>

            {/* Visual template layouts */}
            {activeTab === "whatsapp" ? (
              <div className="space-y-4">
                <div className="bg-[#E5DDD5] rounded-[24px] p-6 shadow-inner relative max-w-sm mx-auto overflow-hidden border border-borderCustom">
                  {/* Phone screen preview style */}
                  <div className="space-y-3 font-sans text-xs max-w-[85%] bg-[#DCF8C6] shadow-xs rounded-xl p-3.5 relative rounded-tl-none border border-green-200">
                    <p className="whitespace-pre-wrap leading-relaxed">
                      {previewTemplate.whatsapp}
                    </p>
                    <span className="text-[9px] text-textDark/40 absolute right-2 bottom-1">
                      10:35 AM
                    </span>
                  </div>
                </div>
                
                <p className="text-[10px] text-center text-textDark/40 font-sans">
                  📲 Screen mock showing how the WhatsApp Business API pushes messages onto customer screens.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="border border-borderCustom rounded-[24px] overflow-hidden bg-white shadow-xs font-sans text-xs">
                  {/* Email header style */}
                  <div className="bg-lightGray/60 border-b border-borderCustom p-4 space-y-1">
                    <p className="text-textDark/50"><strong>Subject:</strong> {previewTemplate.emailSubject}</p>
                    <p className="text-textDark/50"><strong>From:</strong> NKORA billing &lt;billing@nkorakidswear.com&gt;</p>
                  </div>
                  
                  {/* Email body */}
                  <div className="p-6 whitespace-pre-wrap leading-relaxed text-textDark/80">
                    {previewTemplate.emailBody}
                  </div>
                  
                  {/* Email footer */}
                  <div className="bg-[#FAF8F5] border-t border-borderCustom p-4 text-[10px] text-center text-textDark/40">
                    This email is sent on behalf of NKORA KidsWear Storefront.
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
