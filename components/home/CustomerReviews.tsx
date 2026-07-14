"use client";

import React from "react";
import { Star, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function CustomerReviews() {
  const reviews = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      title: "Extremely Soft & Beautiful!",
      text: "The quality of the tulle net is out of this world. My daughter refused to take it off on her 3rd birthday! It has a soft cotton lining inside which is extremely skin-friendly.",
      initials: "PS",
      bgInitials: "bg-softPink text-primary",
      date: "2 days ago",
    },
    {
      name: "Aman Kapoor",
      location: "Delhi",
      rating: 5,
      title: "Excellent Daily Wear",
      text: "Softest organic cotton rompers ever. Usually, kids clothing tags and seams are very rough on sensitive baby skin, but NKORA has flatlock stitching. Highly recommended!",
      initials: "AK",
      bgInitials: "bg-blueAccent/20 text-blueAccent",
      date: "1 week ago",
    },
    {
      name: "Shweta Goenka",
      location: "Kolkata",
      rating: 5,
      title: "Spectacular Indo-Western Wear",
      text: "The kids ethnic wear collection is spectacular! The designs are modern yet traditional, and the sizing guide was 100% accurate. Fits my 5-year-old son perfectly.",
      initials: "SG",
      bgInitials: "bg-[#E8F8F5] text-teal-600",
      date: "2 weeks ago",
    },
  ];

  return (
    <section className="bg-lightGray/30 py-16 px-4 md:px-10 border-b border-borderCustom font-poppins">
      <div className="max-w-site mx-auto">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-light tracking-[0.2em] text-textDark uppercase">
            Parent Testimonials
          </h2>
          <p className="text-xs text-textDark/40 tracking-wider mt-1 uppercase font-semibold">
            Loved by Little Stars & Parents
          </p>
          <div className="flex items-center justify-center space-x-2 mt-2.5">
            <div className="h-[1px] w-8 bg-borderCustom" />
            <span className="text-primary text-xs">♡</span>
            <div className="h-[1px] w-8 bg-borderCustom" />
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <motion.div
              key={idx}
              className="bg-white rounded-3xl p-6 md:p-8 border border-borderCustom shadow-xs hover:shadow-md transition-all duration-500 hover:-translate-y-1.5 flex flex-col justify-between"
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.6 }}
            >
              <div className="space-y-4">
                {/* Stars */}
                <div className="flex items-center space-x-1">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} size={13} className="fill-primary text-primary" />
                  ))}
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-bold text-textDark tracking-wide font-poppins">
                    &ldquo;{rev.title}&rdquo;
                  </h3>
                  <p className="text-[11px] md:text-xs text-textDark/60 leading-relaxed font-sans">
                    {rev.text}
                  </p>
                </div>
              </div>

              {/* Author Info */}
              <div className="flex items-center space-x-3.5 pt-6 border-t border-borderCustom/60 mt-6">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${rev.bgInitials}`}>
                  {rev.initials}
                </div>
                <div className="font-poppins flex-grow">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-textDark">
                      {rev.name}
                    </span>
                    <ShieldCheck size={13} className="text-teal-600 fill-teal-50" />
                  </div>
                  <p className="text-[10px] text-textDark/40">
                    {rev.location} &bull; Verified Buyer
                  </p>
                </div>
                <span className="text-[9px] text-textDark/30 font-sans self-end pb-0.5">
                  {rev.date}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
