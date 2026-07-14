import React from "react";

export const metadata = {
  title: "FAQs | NKORA KidsWear",
  description: "Find answers to frequently asked questions about sizing guides, shipping timelines, return policies, and wash care instructions.",
};

export default function FAQPage() {
  const faqs = [
    {
      q: "What fabric compositions does NKORA use?",
      a: "We prioritize comfort above everything else. Most of our base layers and coordinates are crafted from 100% organic premium combed cotton. For party wear, gowns, or tulle outfits, we use super-soft, skin-friendly nylon net layers backed with a premium 100% cotton inner lining to prevent any skin irritation or itchiness.",
    },
    {
      q: "How do I choose the correct size for my child?",
      a: "We design our garments to fit comfortably according to standard age groups. You can check the 'SIZE CHART' button on any product detail page for exact height, chest, and waist measurements. If your child is in-between sizes, we recommend ordering one size larger to accommodate growth.",
    },
    {
      q: "What is your return and exchange policy?",
      a: "We offer an easy 7-day exchange and return policy on all unworn items with tags intact. You can register an exchange request through your customer dashboard or email us at support@nkorakidswear.com. Return pickups are arranged free of cost across India.",
    },
    {
      q: "How long does shipping take?",
      a: "Standard shipping takes 4-7 business days across India. Express metro shipping options are available and deliver in 2-3 business days. Shipping is completely free on all prepaid and COD orders above ₹1999.",
    },
    {
      q: "Is Cash on Delivery (COD) available?",
      a: "Yes! Cash on Delivery is available for most pincodes across India at a nominal fee, and it is free for orders above ₹1999. You can verify if COD is active in your area by entering your pincode in the Delivery Estimator checker on any product page.",
    },
    {
      q: "How should I wash and care for NKORA garments?",
      a: "For coordinates and cotton tees, machine wash cold on a delicate cycle and lay flat to dry in shade. For party wear and tulle gowns, we highly recommend dry cleaning for the first wash, followed by separate gentle hand washing in cold water thereafter. Avoid twisting or wringing.",
    },
  ];

  return (
    <div className="bg-white min-h-screen py-16 px-4 md:px-10 font-poppins text-left">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Title */}
        <div className="text-center">
          <span className="text-[10px] uppercase font-bold tracking-widest text-primary">
            Quick Answers
          </span>
          <h1 className="text-3xl font-light tracking-wide text-textDark mt-2 uppercase">
            Frequently Asked Questions
          </h1>
          <div className="flex items-center justify-center space-x-2 mt-3">
            <div className="h-[1px] w-8 bg-borderCustom" />
            <span className="text-primary text-xs">♡</span>
            <div className="h-[1px] w-8 bg-borderCustom" />
          </div>
        </div>

        {/* FAQs List */}
        <div className="space-y-6">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-borderCustom rounded-3xl p-6 hover:bg-lightGray/20 transition-all duration-300 space-y-2 text-left"
            >
              <h3 className="text-sm font-bold text-textDark tracking-wide font-poppins flex items-start">
                <span className="text-primary mr-2 shrink-0">Q.</span>
                <span>{faq.q}</span>
              </h3>
              <p className="text-[11px] md:text-xs text-textDark/60 leading-relaxed font-sans pl-5 border-l-2 border-softPink">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
