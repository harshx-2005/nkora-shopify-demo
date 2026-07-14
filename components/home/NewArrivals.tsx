"use client";

import React, { useCallback, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useEmblaCarousel from "embla-carousel-react";
import { Heart, ShoppingBag, Eye, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { ShopifyProduct } from "@/types/shopify";
import { formatPrice } from "@/lib/utils";


interface NewArrivalsProps {
  products: ShopifyProduct[];
}

export default function NewArrivals({ products }: NewArrivalsProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: true,
    slidesToScroll: 1,
  });

  const { addItem } = useCart();
  const [wishlist, setWishlist] = useState<string[]>([]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleQuickAdd = async (e: React.MouseEvent, product: ShopifyProduct) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Grab the first available variant
    const variant = product.variants.edges[0]?.node;
    if (!variant) return;

    const imgNode = product.images.edges[0]?.node;

    await addItem({
      variantId: variant.id,
      quantity: 1,
      title: product.title,
      handle: product.handle,
      variantTitle: variant.title,
      image: imgNode?.url || "",
      price: parseFloat(variant.price.amount),
      compareAtPrice: variant.compareAtPrice ? parseFloat(variant.compareAtPrice.amount) : undefined,
      selectedOptions: variant.selectedOptions,
    });
  };

  return (
    <section className="bg-white py-16 px-4 md:px-10 border-b border-borderCustom font-poppins overflow-hidden">
      <div className="max-w-site mx-auto relative">
        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-2xl font-light tracking-[0.2em] text-textDark uppercase">
              New Arrivals
            </h2>
            <div className="flex items-center space-x-2 mt-2">
              <div className="h-[1px] w-8 bg-borderCustom" />
              <span className="text-primary text-xs">♡</span>
              <div className="h-[1px] w-8 bg-borderCustom" />
            </div>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={scrollPrev}
              className="p-2.5 rounded-full border border-borderCustom hover:bg-softPink/50 transition-colors"
              aria-label="Previous Arrivals"
              suppressHydrationWarning
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={scrollNext}
              className="p-2.5 rounded-full border border-borderCustom hover:bg-softPink/50 transition-colors"
              aria-label="Next Arrivals"
              suppressHydrationWarning
            >
              <ChevronRight size={16} />
            </button>

          </div>
        </div>

        {/* Carousel Slider */}
        <div 
          className="embla overflow-hidden" 
          ref={emblaRef}
          data-cursor="drag"
        >
          <div className="embla__container flex -ml-6">
            {products.map((product) => {
              const validImages = product.images.edges
                .map((e) => e.node?.url)
                .filter((url) => typeof url === "string" && url.trim() !== "");
              const primaryImg = validImages[0] || "https://images.unsplash.com/photo-1622290319146-7b63df48a635?auto=format&fit=crop&q=80&w=800";
              const secondaryImg = validImages[1] || primaryImg;
              const minPrice = parseFloat(product.priceRange.minVariantPrice.amount);
              const comparePrice = product.compareAtPriceRange?.minVariantPrice?.amount 
                ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount) 
                : undefined;


              const isNew = product.tags.includes("new") || product.tags.includes("New");
              const isWishlisted = wishlist.includes(product.id);

              return (
                <div key={product.id} className="embla__slide flex-[0_0_80%] sm:flex-[0_0_45%] md:flex-[0_0_33.33%] lg:flex-[0_0_20%] pl-6">
                  <div className="group rounded-[28px] border border-borderCustom bg-white overflow-hidden card-lift-hover relative flex flex-col h-full">
                    {/* Image Box */}
                    <div className="relative aspect-[3/4] bg-lightGray overflow-hidden">
                      <Link href={`/shop/${product.handle}`} className="block w-full h-full relative">
                        {/* Primary Image */}
                        <Image
                          src={primaryImg}
                          alt={product.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-0"
                        />
                        {/* Secondary Image for Hover Swap */}
                        <Image
                          src={secondaryImg}
                          alt={`${product.title} Alternate`}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                          className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                        />
                      </Link>

                      {/* Tag Badge */}
                      {isNew && (
                        <span className="absolute top-4 left-4 bg-primary text-white text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-sm">
                          NEW
                        </span>
                      )}

                      {comparePrice && comparePrice > minPrice && (
                        <span className="absolute top-4 right-4 bg-softPink text-textDark text-[9px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full shadow-sm">
                          SALE
                        </span>
                      )}

                      {/* Wishlist Button */}
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className={`absolute bottom-4 right-4 p-2.5 rounded-full shadow-md z-20 transition-all duration-300 ${
                          isWishlisted
                            ? "bg-primary text-white"
                            : "bg-white/80 backdrop-blur-xs text-textDark hover:bg-white hover:text-primary"
                        }`}
                        aria-label="Add to wishlist"
                      >
                        <Heart size={14} fill={isWishlisted ? "currentColor" : "none"} />
                      </button>

                      {/* Add To Cart Hover Overlay */}
                      <div className="absolute inset-x-4 bottom-4 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-10 flex gap-2">
                        <button
                          onClick={(e) => handleQuickAdd(e, product)}
                          className="flex-1 bg-white hover:bg-primary text-textDark hover:text-white rounded-full py-3 text-[10px] font-bold tracking-widest uppercase flex items-center justify-center space-x-1.5 transition-all duration-300 shadow-lg"
                        >
                          <ShoppingBag size={12} />
                          <span>ADD TO CART</span>
                        </button>
                        <Link
                          href={`/shop/${product.handle}`}
                          className="bg-white hover:bg-blueAccent text-textDark hover:text-white rounded-full p-3 flex items-center justify-center transition-all duration-300 shadow-lg"
                        >
                          <Eye size={12} />
                        </Link>
                      </div>
                    </div>

                    {/* Meta info */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        {/* Rating */}
                        <div className="flex items-center space-x-1 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={10} className="fill-amber-400 stroke-amber-400" />
                          ))}
                          <span className="text-[9px] text-textDark/40 font-semibold font-sans ml-1">
                            (5.0)
                          </span>
                        </div>

                        {/* Title */}
                        <Link href={`/shop/${product.handle}`} className="block">
                          <h3 className="text-xs font-bold text-textDark font-poppins leading-snug group-hover:text-primary transition-colors line-clamp-1">
                            {product.title}
                          </h3>
                        </Link>
                      </div>

                      {/* Prices */}
                      <div className="flex items-baseline space-x-2 mt-2">
                        <span className="text-sm font-bold text-primary font-mono">
                          {formatPrice(minPrice)}
                        </span>
                        {comparePrice && comparePrice > minPrice && (
                          <span className="text-xs text-textDark/30 line-through font-mono">
                            {formatPrice(comparePrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
