import React from "react";

export const metadata = {
  title: "About Us | NKORA KidsWear",
  description: "Learn about NKORA's journey in creating luxury, skin-friendly, and dapper kidswear for newborns to 12-year-olds.",
};

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen py-16 px-4 md:px-10 font-poppins text-left">
      <div className="max-w-3xl mx-auto space-y-12">
        {/* Title */}
        <div className="text-center">
          <span className="text-[10px] uppercase font-bold tracking-widest text-primary">
            Our Journey
          </span>
          <h1 className="text-3xl font-light tracking-wide text-textDark mt-2 uppercase">
            About NKORA KidsWear
          </h1>
          <div className="flex items-center justify-center space-x-2 mt-3">
            <div className="h-[1px] w-8 bg-borderCustom" />
            <span className="text-primary text-xs">♡</span>
            <div className="h-[1px] w-8 bg-borderCustom" />
          </div>
        </div>

        {/* Brand Mission */}
        <div className="space-y-6 text-sm text-textDark/70 leading-relaxed font-sans">
          <p>
            Welcome to <strong>NKORA</strong>, where luxury meets playfulness. We are a premium childrenswear label dedicated to crafting comfortable, stylish, and skin-friendly clothing for newborns up to 12 years old.
          </p>
          <p>
            The name NKORA is born out of a desire to create a sanctuary of soft, premium fabrics that let children explore, play, and celebrate the magical years of childhood in absolute comfort. We believe that kids shouldn&apos;t have to compromise on dapper styling for the sake of comfort, and parents shouldn&apos;t have to choose between elegance and safety.
          </p>
        </div>

        {/* Three Core Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="border border-borderCustom rounded-2xl p-5 space-y-2.5">
            <span className="text-xl">🧶</span>
            <h3 className="text-xs font-bold text-textDark uppercase tracking-wider">
              Skin-Safe Fabrics
            </h3>
            <p className="text-[11px] text-textDark/60 leading-relaxed font-sans">
              Every garment uses strictly vetted, breathable fabrics and flatlock sewing to prevent skin irritations.
            </p>
          </div>
          <div className="border border-borderCustom rounded-2xl p-5 space-y-2.5">
            <span className="text-xl">🎨</span>
            <h3 className="text-xs font-bold text-textDark uppercase tracking-wider">
              Modern Silhouettes
            </h3>
            <p className="text-[11px] text-textDark/60 leading-relaxed font-sans">
              Our designers combine playful pastel palettes with timeless cuts for elegant, head-turning festive and daily styles.
            </p>
          </div>
          <div className="border border-borderCustom rounded-2xl p-5 space-y-2.5">
            <span className="text-xl">🛡️</span>
            <h3 className="text-xs font-bold text-textDark uppercase tracking-wider">
              Parents Vetted
            </h3>
            <p className="text-[11px] text-textDark/60 leading-relaxed font-sans">
              Tested for durability, ease of wash, and color preservation so they survive playground antics and cleanings.
            </p>
          </div>
        </div>

        {/* Story details */}
        <div className="space-y-4 text-xs text-textDark/60 font-sans leading-relaxed pt-4 border-t border-borderCustom">
          <p>
            NKORA began as a boutique passion project and has since grown into a trusted family brand delivering premium clothing across India. From our cozy sleepwear rompers to our layered tulle tutu gowns and Indo-Western coordinates, each dress is made with precision and love.
          </p>
          <p>
            Thank you for welcoming NKORA into your homes and letting us be a part of your child&apos;s beautiful milestones.
          </p>
        </div>
      </div>
    </div>
  );
}
