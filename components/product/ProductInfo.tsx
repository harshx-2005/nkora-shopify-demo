"use client";

import React, { useState, useEffect } from "react";
import { Star, ShoppingBag, CreditCard, MessageCircle, Truck, RefreshCw, ShieldCheck } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { ShopifyProduct, ProductVariant } from "@/types/shopify";
import { formatPrice } from "@/lib/utils";

interface ProductInfoProps {
  product: ShopifyProduct;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const { addItem, isLoading } = useCart();

  // Find default options
  const initialOptions: { [key: string]: string } = {};
  product.options.forEach((opt) => {
    if (opt.values.length > 0) {
      initialOptions[opt.name] = opt.values[0];
    }
  });

  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>(initialOptions);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);

  // Match selected options to variants
  useEffect(() => {
    const matched = product.variants.edges.find((edge) => {
      const variant = edge.node;
      return variant.selectedOptions.every(
        (opt) => selectedOptions[opt.name] === opt.value
      );
    });
    setSelectedVariant(matched ? matched.node : null);
  }, [selectedOptions, product.variants]);

  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [optionName]: value,
    }));
  };

  const currentPrice = selectedVariant 
    ? parseFloat(selectedVariant.price.amount) 
    : parseFloat(product.priceRange.minVariantPrice.amount);

  const comparePrice = selectedVariant?.compareAtPrice
    ? parseFloat(selectedVariant.compareAtPrice.amount)
    : product.compareAtPriceRange?.minVariantPrice?.amount
      ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
      : null;

  const handleAddToCart = async () => {
    if (!selectedVariant) return;

    const imgNode = selectedVariant.image || product.images.edges[0]?.node;

    await addItem({
      variantId: selectedVariant.id,
      quantity,
      title: product.title,
      handle: product.handle,
      variantTitle: selectedVariant.title,
      image: imgNode?.url || "",
      price: currentPrice,
      compareAtPrice: comparePrice || undefined,
      selectedOptions: selectedVariant.selectedOptions,
    });
  };

  const handleBuyNow = async () => {
    if (!selectedVariant) return;
    const imgNode = selectedVariant.image || product.images.edges[0]?.node;

    // Add to cart first
    await addItem({
      variantId: selectedVariant.id,
      quantity,
      title: product.title,
      handle: product.handle,
      variantTitle: selectedVariant.title,
      image: imgNode?.url || "",
      price: currentPrice,
      compareAtPrice: comparePrice || undefined,
      selectedOptions: selectedVariant.selectedOptions,
    });

    // We can redirect immediately using checkoutUrl in useCart (which will be fetched in the background).
    // Or we can query the checkout route. For headless, redirecting to cart works, but we can also trigger redirect to shopify checkout URL
    const savedCheckoutUrl = localStorage.getItem("nkora_checkout_url");
    if (savedCheckoutUrl) {
      window.location.href = savedCheckoutUrl;
    }
  };

  const handleWhatsApp = () => {
    const text = `Hi! I am interested in buying the "${product.title}" (${
      selectedVariant ? selectedVariant.title : ""
    }) priced at ${formatPrice(currentPrice)}. Is it available for delivery in Kolkata?`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div className="space-y-6 font-poppins">
      {/* Title & Tag */}
      <div>
        <span className="text-[10px] uppercase font-bold tracking-widest text-primary">
          {product.productType || "Premium Collection"}
        </span>
        <h1 className="text-xl md:text-2xl font-bold text-textDark mt-1 leading-snug">
          {product.title}
        </h1>
      </div>

      {/* Ratings & Reviews */}
      <div className="flex items-center space-x-1.5">
        <div className="flex items-center space-x-0.5">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={13} className="fill-amber-400 stroke-amber-400" />
          ))}
        </div>
        <span className="text-xs font-semibold text-textDark/80">5.0</span>
        <span className="text-xs text-textDark/40 font-sans font-medium hover:underline cursor-pointer">
          (25 Customer Reviews)
        </span>
      </div>

      {/* Price */}
      <div className="flex items-baseline space-x-3 border-b border-borderCustom pb-6">
        <span className="text-xl md:text-2xl font-bold text-primary font-mono">
          {formatPrice(currentPrice)}
        </span>
        {comparePrice && comparePrice > currentPrice && (
          <span className="text-sm text-textDark/30 line-through font-mono">
            {formatPrice(comparePrice)}
          </span>
        )}
        <span className="text-[10px] font-sans font-medium text-textDark/40">
          Inclusive of all taxes
        </span>
      </div>

      {/* Dynamic Option Selectors */}
      <div className="space-y-4">
        {product.options.map((option) => (
          <div key={option.id} className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-textDark uppercase tracking-wider">
                Select {option.name}:
              </span>
              {option.name.toLowerCase() === "size" && (
                <button className="text-primary hover:text-primary-hover font-bold text-[10px] tracking-wider uppercase underline">
                  SIZE CHART
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {option.values.map((val) => {
                const isSelected = selectedOptions[option.name] === val;
                const isColor = option.name.toLowerCase() === "color";

                if (isColor) {
                  // Style as a pill or swatch button
                  return (
                    <button
                      key={val}
                      onClick={() => handleOptionChange(option.name, val)}
                      className={`text-xs font-medium px-4 py-2 rounded-full border transition-all duration-300 ${
                        isSelected
                          ? "bg-primary border-primary text-white"
                          : "bg-white border-borderCustom text-textDark/80 hover:border-primary"
                      }`}
                    >
                      {val}
                    </button>
                  );
                }

                // Standard size box button
                return (
                  <button
                    key={val}
                    onClick={() => handleOptionChange(option.name, val)}
                    className={`min-w-10 h-10 flex items-center justify-center text-xs font-semibold rounded-xl border transition-all duration-300 font-mono ${
                      isSelected
                        ? "bg-primary border-primary text-white shadow-xs"
                        : "bg-white border-borderCustom text-textDark/80 hover:border-primary"
                    }`}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Quantity Selector */}
      <div className="space-y-2 pt-2">
        <span className="text-xs font-bold text-textDark uppercase tracking-wider block">
          Quantity:
        </span>
        <div className="flex items-center space-x-3 bg-lightGray/40 border border-borderCustom rounded-2xl w-32 justify-between p-1.5">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="w-8 h-8 rounded-xl bg-white hover:bg-softPink text-textDark flex items-center justify-center transition-colors shadow-xs"
          >
            -
          </button>
          <span className="text-xs font-bold font-mono text-textDark w-6 text-center">
            {quantity}
          </span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="w-8 h-8 rounded-xl bg-white hover:bg-softPink text-textDark flex items-center justify-center transition-colors shadow-xs"
          >
            +
          </button>
        </div>
      </div>

      {/* Primary Actions (Add to Cart / Buy Now) */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        <button
          onClick={handleAddToCart}
          disabled={!selectedVariant?.availableForSale || isLoading}
          className="bg-white border-2 border-primary hover:bg-softPink/20 text-primary text-xs tracking-widest font-bold uppercase py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50"
        >
          <ShoppingBag size={14} />
          <span>
            {selectedVariant?.availableForSale ? "ADD TO CART" : "OUT OF STOCK"}
          </span>
        </button>

        <button
          onClick={handleBuyNow}
          disabled={!selectedVariant?.availableForSale || isLoading}
          className="bg-textDark hover:bg-black text-white text-xs tracking-widest font-bold uppercase py-4 rounded-2xl flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-[1.02] active:scale-95 disabled:opacity-50 btn-glow-hover"
        >
          <CreditCard size={14} />
          <span>BUY NOW</span>
        </button>
      </div>

      {/* WhatsApp Quick Link */}
      <button
        onClick={handleWhatsApp}
        className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white text-xs tracking-widest font-bold uppercase py-3.5 rounded-2xl flex items-center justify-center space-x-2 transition-all duration-300 hover:scale-[1.01]"
      >
        <MessageCircle size={15} className="fill-white" />
        <span>NEED HELP? CHAT ON WHATSAPP</span>
      </button>

      {/* Trust Badges */}
      <div className="border-t border-borderCustom pt-6 grid grid-cols-3 gap-2 text-center">
        <div className="flex flex-col items-center space-y-1">
          <div className="w-8 h-8 rounded-full bg-softPink/40 text-primary flex items-center justify-center">
            <Truck size={14} />
          </div>
          <span className="text-[10px] font-sans font-bold text-textDark/80">
            COD Available
          </span>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <div className="w-8 h-8 rounded-full bg-blueAccent/10 text-blueAccent flex items-center justify-center">
            <RefreshCw size={13} />
          </div>
          <span className="text-[10px] font-sans font-bold text-textDark/80">
            Easy 7d Exchange
          </span>
        </div>
        <div className="flex flex-col items-center space-y-1">
          <div className="w-8 h-8 rounded-full bg-softPink/40 text-primary flex items-center justify-center">
            <ShieldCheck size={14} />
          </div>
          <span className="text-[10px] font-sans font-bold text-textDark/80">
            Secure Payment
          </span>
        </div>
      </div>
    </div>
  );
}
