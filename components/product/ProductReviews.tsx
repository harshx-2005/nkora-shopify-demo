"use client";

import React, { useState } from "react";
import { Star, ShieldCheck, ThumbsUp, Edit3 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
  name: string;
  rating: number;
  title: string;
  text: string;
  date: string;
  verified: boolean;
  helpfulCount: number;
}

export default function ProductReviews() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      name: "Aditi Sen",
      rating: 5,
      title: "Perfect Birthday Dress!",
      text: "Bought this for my daughter's 4th birthday and she looked like a little princess! The tulle is exceptionally soft and did not cause any itching at all. The inner lining is pure cotton, which is excellent.",
      date: "3 days ago",
      verified: true,
      helpfulCount: 8,
    },
    {
      name: "Rohan Mukherjee",
      rating: 5,
      title: "Super Premium Fabric",
      text: "Normally, net dresses are very stiff and cause rashes, but this one is incredibly soft. The finishing is excellent. Highly recommended for special occasions.",
      date: "1 week ago",
      verified: true,
      helpfulCount: 4,
    },
    {
      name: "Meera Nair",
      rating: 4,
      title: "Lovely design, slightly large",
      text: "The style is beautiful and colors are exactly as shown. It was slightly loose around the waist for my 5-year-old, but we used the back sash tie to make it fit nicely. Excellent material quality.",
      date: "2 weeks ago",
      verified: true,
      helpfulCount: 2,
    },
  ]);

  const [isWriteReviewOpen, setIsWriteReviewOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 5,
    title: "",
    text: "",
  });
  const [newReviewError, setNewReviewError] = useState("");

  const handleHelpfulClick = (idx: number) => {
    setReviews((prev) =>
      prev.map((r, i) => (i === idx ? { ...r, helpfulCount: r.helpfulCount + 1 } : r))
    );
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name.trim() || !newReview.title.trim() || !newReview.text.trim()) {
      setNewReviewError("Please fill out all fields.");
      return;
    }

    const reviewToAdd: Review = {
      name: newReview.name,
      rating: newReview.rating,
      title: newReview.title,
      text: newReview.text,
      date: "Just now",
      verified: true,
      helpfulCount: 0,
    };

    setReviews([reviewToAdd, ...reviews]);
    setIsWriteReviewOpen(false);
    setNewReview({ name: "", rating: 5, title: "", text: "" });
    setNewReviewError("");
  };

  return (
    <div className="border-t border-borderCustom pt-16 font-poppins text-left">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Rating Summary Card (Col 4) */}
        <div className="lg:col-span-4 bg-lightGray/40 border border-borderCustom rounded-3xl p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-textDark tracking-wider uppercase">
              Customer Reviews
            </h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold font-mono text-textDark">4.9</span>
              <span className="text-xs text-textDark/40">out of 5</span>
            </div>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={15} className="fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xs text-textDark/60 font-semibold pl-1">
                25 Verified Reviews
              </span>
            </div>
          </div>

          {/* Rating Bars */}
          <div className="space-y-2.5 text-xs text-textDark/60">
            <div className="flex items-center space-x-3">
              <span className="w-8 shrink-0 font-mono">5 star</span>
              <div className="flex-grow h-2 bg-lightGray border border-borderCustom rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[92%]" />
              </div>
              <span className="w-6 shrink-0 text-right font-mono">92%</span>
            </div>
            <div className="flex items-center space-x-3">
              <span className="w-8 shrink-0 font-mono">4 star</span>
              <div className="flex-grow h-2 bg-lightGray border border-borderCustom rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-[8%]" />
              </div>
              <span className="w-6 shrink-0 text-right font-mono">8%</span>
            </div>
            <div className="flex items-center space-x-3 opacity-40">
              <span className="w-8 shrink-0 font-mono">3 star</span>
              <div className="flex-grow h-2 bg-lightGray border border-borderCustom rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-0" />
              </div>
              <span className="w-6 shrink-0 text-right font-mono">0%</span>
            </div>
            <div className="flex items-center space-x-3 opacity-40">
              <span className="w-8 shrink-0 font-mono">2 star</span>
              <div className="flex-grow h-2 bg-lightGray border border-borderCustom rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-0" />
              </div>
              <span className="w-6 shrink-0 text-right font-mono">0%</span>
            </div>
            <div className="flex items-center space-x-3 opacity-40">
              <span className="w-8 shrink-0 font-mono">1 star</span>
              <div className="flex-grow h-2 bg-lightGray border border-borderCustom rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full w-0" />
              </div>
              <span className="w-6 shrink-0 text-right font-mono">0%</span>
            </div>
          </div>

          {/* Action Trigger */}
          <button
            onClick={() => setIsWriteReviewOpen(true)}
            className="w-full bg-white border border-borderCustom text-textDark hover:bg-lightGray text-xs tracking-widest font-bold uppercase py-3.5 rounded-2xl flex items-center justify-center space-x-2 transition-all duration-300 active:scale-98"
          >
            <Edit3 size={14} />
            <span>WRITE A REVIEW</span>
          </button>
        </div>

        {/* Reviews List (Col 8) */}
        <div className="lg:col-span-8 space-y-6">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="border-b border-borderCustom/60 pb-6 last:border-b-0 space-y-4"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                <div className="space-y-1">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={12}
                        className={
                          i < rev.rating
                            ? "fill-primary text-primary"
                            : "fill-lightGray text-borderCustom"
                        }
                      />
                    ))}
                  </div>
                  <h4 className="text-xs font-bold text-textDark tracking-wide font-poppins">
                    {rev.title}
                  </h4>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-textDark/40">
                  <span className="font-semibold text-textDark">{rev.name}</span>
                  {rev.verified && (
                    <span className="inline-flex items-center text-teal-600 font-bold bg-[#E8F8F5] px-2 py-0.5 rounded-full uppercase tracking-wider scale-90">
                      <ShieldCheck size={11} className="mr-0.5" /> Verified
                    </span>
                  )}
                  <span>&bull;</span>
                  <span>{rev.date}</span>
                </div>
              </div>

              <p className="text-[11px] md:text-xs text-textDark/60 leading-relaxed font-sans">
                {rev.text}
              </p>

              {/* Helpfulness */}
              <button
                onClick={() => handleHelpfulClick(idx)}
                className="inline-flex items-center space-x-1.5 text-[10px] font-bold text-textDark/50 hover:text-primary transition-colors cursor-pointer"
              >
                <ThumbsUp size={11} />
                <span>Helpful ({rev.helpfulCount})</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Write a Review Modal */}
      <AnimatePresence>
        {isWriteReviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsWriteReviewOpen(false)}
            />
            {/* Modal Box */}
            <motion.div
              className="bg-white rounded-[32px] border border-borderCustom w-full max-w-md overflow-hidden shadow-2xl z-10 relative flex flex-col max-h-[90vh]"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <div className="p-6 md:p-8 pb-4 border-b border-borderCustom flex justify-between items-center bg-softPink/10">
                <h3 className="text-base font-bold text-textDark font-poppins tracking-wider uppercase">
                  Write a Review
                </h3>
                <button
                  onClick={() => setIsWriteReviewOpen(false)}
                  className="w-8 h-8 rounded-full bg-white border border-borderCustom text-textDark/60 hover:text-textDark flex items-center justify-center hover:shadow-xs transition-all duration-300"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleReviewSubmit} className="p-6 md:p-8 space-y-4 overflow-y-auto">
                {/* Rating selection */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-textDark/60 uppercase tracking-wider block">
                    Rating
                  </label>
                  <div className="flex items-center space-x-1.5">
                    {[...Array(5)].map((_, i) => {
                      const starValue = i + 1;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setNewReview({ ...newReview, rating: starValue })}
                          className="focus:outline-none"
                        >
                          <Star
                            size={20}
                            className={
                              starValue <= newReview.rating
                                ? "fill-primary text-primary hover:scale-110 transition-transform"
                                : "fill-lightGray text-borderCustom hover:scale-110 transition-transform"
                            }
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-textDark/60 uppercase tracking-wider block">
                    Your Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aditi Sen"
                    value={newReview.name}
                    onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
                    className="w-full bg-white border border-borderCustom px-4 py-2.5 rounded-xl text-xs text-textDark focus:outline-none focus:border-primary transition-colors text-left"
                  />
                </div>

                {/* Review Title */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-textDark/60 uppercase tracking-wider block">
                    Review Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Highly recommend!"
                    value={newReview.title}
                    onChange={(e) => setNewReview({ ...newReview, title: e.target.value })}
                    className="w-full bg-white border border-borderCustom px-4 py-2.5 rounded-xl text-xs text-textDark focus:outline-none focus:border-primary transition-colors text-left"
                  />
                </div>

                {/* Review Body */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-textDark/60 uppercase tracking-wider block">
                    Your Review
                  </label>
                  <textarea
                    placeholder="Tell us what you liked or disliked about this product..."
                    rows={4}
                    value={newReview.text}
                    onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
                    className="w-full bg-white border border-borderCustom px-4 py-2.5 rounded-xl text-xs text-textDark focus:outline-none focus:border-primary transition-colors text-left resize-none"
                  />
                </div>

                {newReviewError && (
                  <p className="text-[10px] font-semibold text-red-600">{newReviewError}</p>
                )}

                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-white text-xs tracking-widest font-bold uppercase py-4 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 btn-glow-hover hover:scale-[1.01]"
                >
                  SUBMIT REVIEW
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
