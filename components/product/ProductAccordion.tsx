"use client";

import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ProductAccordionProps {
  descriptionHtml?: string;
}

export default function ProductAccordion({ descriptionHtml }: ProductAccordionProps) {
  const [openSection, setOpenSection] = useState<string | null>("details");

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const sections = [
    {
      id: "details",
      title: "PRODUCT DETAILS",
      content: descriptionHtml ? (
        <div 
          className="prose prose-sm prose-pink text-xs text-textDark/70 font-sans leading-relaxed space-y-2 select-text"
          dangerouslySetInnerHTML={{ __html: descriptionHtml }}
        />
      ) : (
        <ul className="list-disc list-inside text-xs text-textDark/70 font-sans leading-relaxed space-y-2 select-text">
          <li>Fabric: Premium Cotton Net Blend</li>
          <li>Design: Floral pattern with layered tutu</li>
          <li>Fit: Comfortable regular fit</li>
          <li>Occasion: Party wear / Festive wear</li>
        </ul>
      ),
    },
    {
      id: "wash",
      title: "WASH CARE",
      content: (
        <ul className="list-disc list-inside text-xs text-textDark/70 font-sans leading-relaxed space-y-2 select-text">
          <li>Dry clean recommended for first wash.</li>
          <li>Hand wash separately in cold water with mild detergent thereafter.</li>
          <li>Do not wring or twist. Lay flat to dry in shade.</li>
          <li>Iron on reverse side on cool setting (low heat) if required.</li>
        </ul>
      ),
    },
    {
      id: "shipping",
      title: "SHIPPING & DELIVERY",
      content: (
        <p className="text-xs text-textDark/70 font-sans leading-relaxed select-text">
          Standard Pan India delivery takes 4-7 business days. Express shipping is available in select metros (2-3 business days). Shipping is free on orders above ₹1999.
        </p>
      ),
    },
    {
      id: "returns",
      title: "EXCHANGE & RETURNS",
      content: (
        <p className="text-xs text-textDark/70 font-sans leading-relaxed select-text">
          We offer an easy 7-day exchange and return policy for all unworn garments with tags intact. Simply initiate an exchange request in your account panel or email support@nkorakidswear.com.
        </p>
      ),
    },
  ];

  return (
    <div className="border-t border-borderCustom space-y-1 font-poppins mt-2">
      {sections.map((sec) => {
        const isOpen = openSection === sec.id;
        return (
          <div key={sec.id} className="border-b border-borderCustom py-3.5">
            <button
              onClick={() => toggleSection(sec.id)}
              className="w-full flex items-center justify-between text-left group"
            >
              <span className="text-xs font-bold text-textDark tracking-wider uppercase group-hover:text-primary transition-colors">
                {sec.title}
              </span>
              <span className="text-textDark/40 group-hover:text-primary transition-colors">
                {isOpen ? <Minus size={14} /> : <Plus size={14} />}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1, transition: { height: { duration: 0.35 }, opacity: { duration: 0.25 } } }}
                  exit={{ height: 0, opacity: 0, transition: { height: { duration: 0.3 }, opacity: { duration: 0.15 } } }}
                  className="overflow-hidden"
                >
                  <div className="pt-4 pb-2">
                    {sec.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
