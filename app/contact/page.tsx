import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export const metadata = {
  title: "Contact Us | NKORA KidsWear",
  description: "Get in touch with the NKORA support team. Reach out via email, phone, or WhatsApp for assistance with orders and sizing.",
};

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen py-16 px-4 md:px-10 font-poppins text-left">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Title */}
        <div className="text-center">
          <span className="text-[10px] uppercase font-bold tracking-widest text-primary">
            Get In Touch
          </span>
          <h1 className="text-3xl font-light tracking-wide text-textDark mt-2 uppercase">
            Contact Support
          </h1>
          <div className="flex items-center justify-center space-x-2 mt-3">
            <div className="h-[1px] w-8 bg-borderCustom" />
            <span className="text-primary text-xs">♡</span>
            <div className="h-[1px] w-8 bg-borderCustom" />
          </div>
        </div>

        {/* Contact Info and Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Info Card (Col 5) */}
          <div className="md:col-span-5 bg-lightGray/40 border border-borderCustom rounded-3xl p-6 md:p-8 space-y-6">
            <div className="space-y-2">
              <h3 className="text-sm font-bold text-textDark tracking-wider uppercase">
                Customer Care
              </h3>
              <p className="text-[11px] text-textDark/60 leading-relaxed font-sans">
                Have questions about our collection, sizes, or custom orders? Reach out and we&apos;ll respond within 24 hours.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-borderCustom text-xs text-textDark/80 font-sans">
              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-softPink/40 text-primary flex items-center justify-center shrink-0">
                  <Mail size={14} />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-textDark/40 font-bold">Email</p>
                  <p className="font-semibold mt-0.5">support@nkorakidswear.com</p>
                </div>
              </div>

              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-blueAccent/10 text-blueAccent flex items-center justify-center shrink-0">
                  <Phone size={14} />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-textDark/40 font-bold">Call / WhatsApp</p>
                  <p className="font-semibold mt-0.5">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-center space-x-3.5">
                <div className="w-8 h-8 rounded-full bg-softPink/40 text-primary flex items-center justify-center shrink-0">
                  <MapPin size={14} />
                </div>
                <div>
                  <p className="text-[9px] uppercase tracking-wider text-textDark/40 font-bold">Location</p>
                  <p className="font-semibold mt-0.5">Kolkata, West Bengal, India</p>
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full bg-[#25D366] hover:bg-[#20ba59] text-white text-center text-[10px] tracking-widest font-bold uppercase py-3.5 rounded-2xl transition-all duration-300 active:scale-98"
            >
              CHAT WITH US ON WHATSAPP
            </a>
          </div>

          {/* Form (Col 7) */}
          <div className="md:col-span-7 border border-borderCustom rounded-3xl p-6 md:p-8 space-y-6">
            <h3 className="text-xs font-bold text-textDark tracking-wider uppercase">
              Send us a Message
            </h3>
            
            <form className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-textDark/60 uppercase tracking-wider block">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    className="w-full bg-white border border-borderCustom px-4 py-2.5 rounded-xl text-xs text-textDark focus:outline-none focus:border-primary transition-colors text-left"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-textDark/60 uppercase tracking-wider block">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. priya@gmail.com"
                    className="w-full bg-white border border-borderCustom px-4 py-2.5 rounded-xl text-xs text-textDark focus:outline-none focus:border-primary transition-colors text-left"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-textDark/60 uppercase tracking-wider block">
                  Subject
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Size advice / Order enquiry"
                  className="w-full bg-white border border-borderCustom px-4 py-2.5 rounded-xl text-xs text-textDark focus:outline-none focus:border-primary transition-colors text-left"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-textDark/60 uppercase tracking-wider block">
                  Message
                </label>
                <textarea
                  required
                  placeholder="Type your message here..."
                  rows={4}
                  className="w-full bg-white border border-borderCustom px-4 py-2.5 rounded-xl text-xs text-textDark focus:outline-none focus:border-primary transition-colors text-left resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-primary hover:bg-primary-hover text-white text-xs tracking-widest font-bold uppercase py-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 btn-glow-hover hover:scale-[1.01]"
              >
                SEND INQUIRY
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
