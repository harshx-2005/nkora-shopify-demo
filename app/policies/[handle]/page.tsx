import React from "react";
import { notFound } from "next/navigation";

interface PolicyPageProps {
  params: Promise<{ handle: string }>;
}

export const revalidate = 3600; // Revalidate policies hourly

export default async function PolicyPage({ params }: PolicyPageProps) {
  const { handle } = await params;

  // Static fallback documents
  const policies: { [key: string]: { title: string; subtitle: string; content: string[] } } = {
    privacy: {
      title: "Privacy Policy",
      subtitle: "Last Updated: July 2026",
      content: [
        "NKORA KidsWear respects your privacy and is committed to protecting your personal data. This privacy policy informs you about how we look after your personal data when you visit our website (regardless of where you visit it from) and tells you about your privacy rights.",
        "We collect contact details (name, billing/shipping address, email, phone number) when you purchase products, create an account, or contact our support channels. This data is strictly used to fulfill shipments, authorize local payment checkouts, and improve user profile tracking.",
        "Your billing credentials are process-secured under 256-bit encrypted SSL loops. We do not store credit card/prepaid wallet PINs on headless storefront instances.",
        "We use cookies to maintain customer carts, identify dynamic active login sessions, and track storefront analytics. You can configure your browser preferences to reject cookies, though some interactive dashboard features may become unavailable.",
      ],
    },
    terms: {
      title: "Terms & Conditions",
      subtitle: "Last Updated: July 2026",
      content: [
        "Welcome to the NKORA KidsWear online boutique. By accessing or using this website, you agree to comply with and be bound by the following terms and conditions of use.",
        "All product designs, layouts, photography models, logos, custom illustrations, and graphics on this storefront are intellectual properties owned by NKORA and protected by copyright regulations. Unauthorized commercial replication is strictly prohibited.",
        "Garment sizes are charted based on standard Indian children measurements. Please refer to the size guide modal on individual product pages before purchasing. Minor variations in fabrics or stitching may occur due to handcrafted manufacturing.",
        "Payment must be cleared during checkout using pre-authorized gateways (UPI, credit/debit cards, Netbanking) or settled upon physical arrival when choosing Cash on Delivery (COD). We reserve the right to verify high-value COD bookings prior to fulfillment.",
      ],
    },
    refund: {
      title: "Refund & Return Policy",
      subtitle: "Last Updated: July 2026",
      content: [
        "We want you and your child to love their NKORA outfits. If you are not completely satisfied, we offer an easy 7-day exchange and refund policy on all eligible purchases.",
        "To qualify for an exchange or return, items must be unworn, unwashed, and undamaged, with all original brand tags and pricing cards attached. Garments showing visible makeup, dirt, or perfume traces will be disqualified.",
        "You can request a return or size exchange directly from your Customer Account Lounge or by sending an email with order details to support@nkorakidswear.com.",
        "Once approved, a reverse pick-up will be scheduled free of cost. Refunds are processed to the original payment source (prepaid orders) or credited to your preferred bank account (COD orders) within 5-7 business days of the package arriving at our sorting hub.",
      ],
    },
    shipping: {
      title: "Shipping Policy",
      subtitle: "Last Updated: July 2026",
      content: [
        "NKORA delivers premium kidswear right to your doorstep across India. We pack and dispatch products within 24-48 hours of order confirmation.",
        "Standard shipping takes 4-7 business days for delivery depending on the destination. Metros and tier-1 hubs typically receive packages faster.",
        "Shipping is free for all orders above ₹1999 (prepaid and COD). A nominal delivery fee of ₹99 is applicable to standard orders below the threshold.",
        "Once your shipment is dispatched, you will receive a tracking link via email or SMS. You can also view your live shipment status inside your Customer Account Lounge.",
      ],
    },
  };

  const policy = policies[handle.toLowerCase()];

  if (!policy) {
    notFound();
  }

  return (
    <div className="bg-white min-h-screen py-16 px-4 md:px-10 font-poppins text-left">
      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center">
          <span className="text-[10px] uppercase font-bold tracking-widest text-primary">
            Store Policy
          </span>
          <h1 className="text-3xl font-light tracking-wide text-textDark mt-2 uppercase">
            {policy.title}
          </h1>
          <p className="text-xs text-textDark/40 font-mono mt-1">
            {policy.subtitle}
          </p>
          <div className="flex items-center justify-center space-x-2 mt-3.5">
            <div className="h-[1px] w-8 bg-borderCustom" />
            <span className="text-primary text-xs">♡</span>
            <div className="h-[1px] w-8 bg-borderCustom" />
          </div>
        </div>

        {/* Content Paragraphs */}
        <div className="space-y-6 text-sm text-textDark/70 leading-relaxed font-sans select-text">
          {policy.content.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>

        {/* Contact Note */}
        <div className="bg-lightGray/40 border border-borderCustom rounded-2xl p-5 text-xs text-textDark/60 leading-relaxed font-sans">
          <p>
            <strong>Have questions?</strong> If you have any inquiries regarding our policy terms, please contact our support desk directly at <strong>support@nkorakidswear.com</strong> or call us at <strong>+91 98765 43210</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
