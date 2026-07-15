"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Save, ShieldAlert, RefreshCw, Upload } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    qrCodeUrl: "",
    upiId: "",
    accountName: "",
    accountNumber: "",
    ifscCode: "",
    bankName: "",
    branch: "",
    supportNumber: "",
    whatsappNumber: "",
    shippingFee: 99,
    freeShippingThreshold: 1999,
    couriers: [] as string[]
  });
  const [newCourier, setNewCourier] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = () => {
    fetch("/api/settings")
      .then(res => res.json())
      .then(data => {
        if (data.settings) {
          setSettings(data.settings);
        }
      })
      .catch(err => console.error("Error loading settings:", err));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCourier = () => {
    if (!newCourier.trim()) return;
    if (settings.couriers.includes(newCourier.trim())) {
      setError("Courier already exists.");
      return;
    }
    setError("");
    setSettings(prev => ({
      ...prev,
      couriers: [...prev.couriers, newCourier.trim()]
    }));
    setNewCourier("");
  };

  const handleRemoveCourier = (index: number) => {
    setSettings(prev => ({
      ...prev,
      couriers: prev.couriers.filter((_, idx) => idx !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });

      if (!res.ok) {
        throw new Error("Failed to save configuration settings.");
      }

      setMessage("Admin parameters saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSaving(false);
    }
  };

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
              <ShieldAlert size={16} className="text-primary" />
              <span>Administrative Configuration Settings</span>
            </h1>
            <p className="text-[10px] text-textDark/50">
              Manage bank details, UPI credentials and courier lists in real-time
            </p>
          </div>
        </div>
        
        <Link href="/owner-dashboard" className="text-xs font-bold text-primary hover:underline">
          Console Dashboard
        </Link>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Bank / UPI settings */}
          <div className="md:col-span-7 bg-white border border-borderCustom rounded-[32px] p-6 md:p-8 shadow-xs space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest border-b border-borderCustom pb-3 text-textDark/80">
              Manual Payment Details
            </h3>

            {message && (
              <div className="bg-green-50 text-green-600 rounded-2xl p-4 text-xs font-sans border border-green-100">
                {message}
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-600 rounded-2xl p-4 text-xs font-sans border border-red-100">
                {error}
              </div>
            )}

            <div className="space-y-4 text-xs font-sans">
              <div className="space-y-1.5">
                <label className="text-[9px] uppercase font-bold text-textDark/60 tracking-wider">QR Code URL Placeholder</label>
                <input
                  type="text"
                  name="qrCodeUrl"
                  value={settings.qrCodeUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/qr-code.png"
                  className="w-full bg-lightGray/40 border border-borderCustom rounded-xl px-4 py-2.5 outline-none font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] uppercase font-bold text-textDark/60 tracking-wider">Merchant UPI ID</label>
                <input
                  type="text"
                  name="upiId"
                  required
                  value={settings.upiId}
                  onChange={handleInputChange}
                  placeholder="name@okaxis"
                  className="w-full bg-lightGray/40 border border-borderCustom rounded-xl px-4 py-2.5 outline-none font-sans"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] uppercase font-bold text-textDark/60 tracking-wider">Beneficiary Account Name</label>
                <input
                  type="text"
                  name="accountName"
                  required
                  value={settings.accountName}
                  onChange={handleInputChange}
                  placeholder="Company Name / Owner Name"
                  className="w-full bg-lightGray/40 border border-borderCustom rounded-xl px-4 py-2.5 outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-bold text-textDark/60 tracking-wider">Account Number</label>
                  <input
                    type="text"
                    name="accountNumber"
                    required
                    value={settings.accountNumber}
                    onChange={handleInputChange}
                    placeholder="Enter bank account number"
                    className="w-full bg-lightGray/40 border border-borderCustom rounded-xl px-4 py-2.5 outline-none font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-bold text-textDark/60 tracking-wider">IFSC Code</label>
                  <input
                    type="text"
                    name="ifscCode"
                    required
                    value={settings.ifscCode}
                    onChange={handleInputChange}
                    placeholder="IFSC Code"
                    className="w-full bg-lightGray/40 border border-borderCustom rounded-xl px-4 py-2.5 outline-none font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-bold text-textDark/60 tracking-wider">Bank Name</label>
                  <input
                    type="text"
                    name="bankName"
                    value={settings.bankName}
                    onChange={handleInputChange}
                    placeholder="Bank Name"
                    className="w-full bg-lightGray/40 border border-borderCustom rounded-xl px-4 py-2.5 outline-none font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-bold text-textDark/60 tracking-wider">Bank Branch</label>
                  <input
                    type="text"
                    name="branch"
                    value={settings.branch}
                    onChange={handleInputChange}
                    placeholder="Branch location"
                    className="w-full bg-lightGray/40 border border-borderCustom rounded-xl px-4 py-2.5 outline-none font-sans"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-t border-borderCustom/50 pt-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-bold text-textDark/60 tracking-wider">Support Contact</label>
                  <input
                    type="text"
                    name="supportNumber"
                    value={settings.supportNumber}
                    onChange={handleInputChange}
                    placeholder="+91..."
                    className="w-full bg-lightGray/40 border border-borderCustom rounded-xl px-4 py-2.5 outline-none font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-bold text-textDark/60 tracking-wider">WhatsApp Contact</label>
                  <input
                    type="text"
                    name="whatsappNumber"
                    value={settings.whatsappNumber}
                    onChange={handleInputChange}
                    placeholder="+91..."
                    className="w-full bg-lightGray/40 border border-borderCustom rounded-xl px-4 py-2.5 outline-none font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-borderCustom/50 pt-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-bold text-textDark/60 tracking-wider">Default Shipping Fee (₹)</label>
                  <input
                    type="number"
                    name="shippingFee"
                    value={settings.shippingFee}
                    onChange={(e) => setSettings(prev => ({ ...prev, shippingFee: parseFloat(e.target.value) || 0 }))}
                    placeholder="99"
                    className="w-full bg-lightGray/40 border border-borderCustom rounded-xl px-4 py-2.5 outline-none font-sans"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-bold text-textDark/60 tracking-wider">Free Shipping Min Order (₹)</label>
                  <input
                    type="number"
                    name="freeShippingThreshold"
                    value={settings.freeShippingThreshold}
                    onChange={(e) => setSettings(prev => ({ ...prev, freeShippingThreshold: parseFloat(e.target.value) || 0 }))}
                    placeholder="1999"
                    className="w-full bg-lightGray/40 border border-borderCustom rounded-xl px-4 py-2.5 outline-none font-sans"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-primary hover:bg-primary-hover text-white text-xs tracking-widest font-bold uppercase py-3.5 rounded-xl transition-all flex items-center justify-center space-x-2"
            >
              <span>{isSaving ? "Saving..." : "Save Settings"}</span>
              <Save size={14} />
            </button>
          </div>

          {/* Right Column: Courier settings */}
          <div className="md:col-span-5 bg-white border border-borderCustom rounded-[32px] p-6 md:p-8 shadow-xs space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-widest border-b border-borderCustom pb-3 text-textDark/80">
              Courier Partners
            </h3>
            
            <div className="space-y-4">
              {/* Add courier */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="New Courier"
                  value={newCourier}
                  onChange={(e) => setNewCourier(e.target.value)}
                  className="flex-1 bg-lightGray/40 border border-borderCustom rounded-xl px-3 py-2 text-xs outline-none font-sans"
                />
                <button
                  type="button"
                  onClick={handleAddCourier}
                  className="bg-primary hover:bg-primary-hover text-white text-[10px] tracking-widest font-bold uppercase py-2 px-4 rounded-xl transition-all"
                >
                  Add
                </button>
              </div>

              {/* Courier list */}
              <div className="divide-y divide-borderCustom/50 text-xs font-sans">
                {settings.couriers.map((courier, index) => (
                  <div key={courier} className="flex justify-between items-center py-2.5 first:pt-0">
                    <span className="font-medium text-textDark">{courier}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveCourier(index)}
                      className="text-red-500 hover:underline font-bold text-[10px] uppercase"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </form>
      </div>

    </div>
  );
}
