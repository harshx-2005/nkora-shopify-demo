import React from "react";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";


export default function WishlistPage() {
  return (
    <div className="bg-white min-h-[70vh] py-16 px-4 md:px-10 font-poppins flex items-center justify-center">
      <div className="text-center max-w-md space-y-5">
        <div className="w-16 h-16 rounded-full bg-softPink/60 text-primary flex items-center justify-center mx-auto shadow-sm">
          <Heart size={28} />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-textDark uppercase tracking-wider">
            Your Wishlist is Empty
          </h1>
          <p className="text-xs text-textDark/50 leading-relaxed font-sans max-w-sm">
            Save your favorite premium kidswear articles here to monitor restocks or buy them for special celebrations.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/shop"
            className="inline-flex items-center space-x-2 text-xs font-bold tracking-widest text-primary hover:text-primary-hover uppercase border-b-2 border-primary pb-0.5 transition-all duration-300"
          >
            <span>START SHOPPING</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
