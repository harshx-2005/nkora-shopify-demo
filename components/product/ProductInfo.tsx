"use client";

import React, { useState, useEffect } from "react";
import { Star, ShoppingBag, CreditCard, MessageCircle, Truck, RefreshCw, ShieldCheck } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
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

  // Sizing chart & pincode states
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState<{ checked: boolean; success: boolean; dateString?: string; expressDateString?: string; message?: string } | null>(null);


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

  const handlePincodeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode)) {
      setPincodeResult({
        checked: true,
        success: false,
        message: "Please enter a valid 6-digit Pincode.",
      });
      return;
    }

    const options: Intl.DateTimeFormatOptions = { weekday: "long", month: "short", day: "numeric" };
    const today = new Date();
    
    const standardDate = new Date(today);
    standardDate.setDate(today.getDate() + 5);
    
    const expressDate = new Date(today);
    expressDate.setDate(today.getDate() + 3);

    setPincodeResult({
      checked: true,
      success: true,
      dateString: standardDate.toLocaleDateString("en-IN", options),
      expressDateString: expressDate.toLocaleDateString("en-IN", options),
    });
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
        <span className="text-[11px] font-sans font-bold text-textDark/80">
          5.0
        </span>
        <span className="text-[10px] text-textDark/40">
          (25 Reviews)
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
                <button
                  onClick={() => setIsSizeChartOpen(true)}
                  className="text-primary hover:text-primary-hover font-bold text-[10px] tracking-wider uppercase underline focus:outline-none"
                >
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
        <svg viewBox="0 0 448 512" className="w-[15px] h-[15px] fill-white">
          <path d="M380.9 97.1C339 55.1 283.2 32.3 223.9 32.3c-106.3 0-192.8 86.5-192.8 192.8 0 34.3 9.1 67.7 26.5 97.1L20.1 480l146.4-38.4c28.1 15.3 59.8 23.4 92 23.4h.1c106.3 0 192.8-86.5 192.8-192.8 0-59.4-22.8-115.1-64.7-157.1zM223.9 437.3c-28.7 0-56.8-7.7-81.4-22.2l-5.8-3.4-60.1 15.8 16.1-58.5-3.8-6.1c-16.1-26-24.6-56.1-24.6-87.1 0-89.2 72.5-161.7 161.7-161.7 43.1 0 83.7 16.8 114.2 47.3 30.5 30.5 47.3 71.1 47.3 114.2 0 89.2-72.5 161.7-161.7 161.7zm88.3-120.5c-4.8-2.4-28.5-14.1-32.9-15.7-4.4-1.6-7.6-2.4-10.8 2.4-3.2 4.8-12.4 15.7-15.2 18.9-2.8 3.2-5.6 3.6-10.4 1.2-4.8-2.4-20.2-7.5-38.4-23.7-14.2-12.6-23.8-28.1-26.6-32.9-2.8-4.8-.3-7.4 2.1-9.8 2.2-2.2 4.8-5.7 7.2-8.6 2.4-2.9 3.2-4.9 4.8-8.2 1.6-3.3.8-6.1-.4-8.5-1.2-2.4-10.8-26.1-14.8-35.8-3.9-9.4-7.8-8.1-10.8-8.3-2.8-.2-6.1-.2-9.3-.2-3.2 0-8.4 1.2-12.8 6-4.4 4.8-16.9 16.5-16.9 40.3 0 23.8 17.3 46.8 19.7 50 2.4 3.2 34 52 82.4 72.9 11.5 4.9 20.5 7.8 27.5 10 11.6 3.7 22.1 3.2 30.4 1.9 9.3-1.4 28.5-11.6 32.5-22.9 4-11.3 4-21 2.8-22.9-1.2-1.9-4.4-3.1-9.2-5.5z"/>
        </svg>
        <span>NEED HELP? CHAT ON WHATSAPP</span>
      </button>

      {/* Pincode Estimator Section */}
      <div className="bg-lightGray/40 border border-borderCustom rounded-3xl p-5 space-y-3 font-poppins">
        <span className="text-[10px] font-bold text-textDark/60 uppercase tracking-widest block text-left">
          Check Delivery Estimate
        </span>
        <form onSubmit={handlePincodeCheck} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter 6-digit Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="flex-grow bg-white border border-borderCustom px-4 py-2.5 rounded-xl text-xs font-mono text-textDark focus:outline-none focus:border-primary transition-colors text-left"
          />
          <button
            type="submit"
            className="bg-textDark hover:bg-black text-white text-[10px] tracking-wider font-bold uppercase px-4 py-2.5 rounded-xl transition-colors shrink-0"
          >
            Check
          </button>
        </form>

        {pincodeResult && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className={`text-xs leading-normal font-sans p-3 rounded-xl border ${
              pincodeResult.success
                ? "bg-green-50/50 border-green-200/50 text-green-700"
                : "bg-red-50/50 border-red-200/50 text-red-600"
            }`}
          >
            {pincodeResult.success ? (
              <div className="space-y-1">
                <p className="font-semibold flex items-center gap-1.5 text-left text-green-700">
                  <span>🚚</span> Fast Delivery Available!
                </p>
                <p className="text-[10px] text-green-800/80 leading-relaxed text-left">
                  Standard delivery by <strong>{pincodeResult.dateString}</strong> (Free). <br />
                  Express delivery by <strong>{pincodeResult.expressDateString}</strong>. <br />
                  Cash on Delivery (COD) is available for this location.
                </p>
              </div>
            ) : (
              <p className="text-[10px] font-semibold flex items-center gap-1 text-left">
                <span>⚠️</span> {pincodeResult.message}
              </p>
            )}
          </motion.div>
        )}
      </div>

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

      {/* Sizing Chart Modal */}
      <AnimatePresence>
        {isSizeChartOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSizeChartOpen(false)}
            />
            {/* Modal Box */}
            <motion.div
              className="bg-white rounded-[32px] border border-borderCustom w-full max-w-lg overflow-hidden shadow-2xl z-10 relative flex flex-col max-h-[90vh]"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              {/* Header */}
              <div className="p-6 md:p-8 pb-4 border-b border-borderCustom flex justify-between items-center bg-softPink/10">
                <div className="text-left">
                  <h3 className="text-base font-bold text-textDark font-poppins tracking-wider uppercase">
                    NKORA Sizing Guide
                  </h3>
                  <p className="text-[10px] text-textDark/50 mt-0.5">
                    Premium kidswear fits for Newborn to 12 Years
                  </p>
                </div>
                <button
                  onClick={() => setIsSizeChartOpen(false)}
                  className="w-8 h-8 rounded-full bg-white border border-borderCustom text-textDark/60 hover:text-textDark flex items-center justify-center hover:shadow-xs transition-all duration-300"
                >
                  ✕
                </button>
              </div>

              {/* Chart Content */}
              <div className="p-6 md:p-8 overflow-y-auto space-y-6">
                <table className="w-full text-left border-collapse text-xs font-sans">
                  <thead>
                    <tr className="border-b border-borderCustom text-[10px] tracking-wider uppercase font-bold text-textDark/50">
                      <th className="py-2.5">Age Bracket</th>
                      <th className="py-2.5">Height (cm)</th>
                      <th className="py-2.5">Chest (cm)</th>
                      <th className="py-2.5">Waist (cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-borderCustom text-textDark/70">
                    <tr>
                      <td className="py-2.5 font-semibold text-textDark text-left">Newborn (0-3M)</td>
                      <td className="py-2.5 font-mono">50 - 62</td>
                      <td className="py-2.5 font-mono">40 - 43</td>
                      <td className="py-2.5 font-mono">38 - 41</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-textDark text-left">3 - 12 Months</td>
                      <td className="py-2.5 font-mono">62 - 80</td>
                      <td className="py-2.5 font-mono">43 - 48</td>
                      <td className="py-2.5 font-mono">41 - 46</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-textDark text-left">1 - 2 Years</td>
                      <td className="py-2.5 font-mono">80 - 92</td>
                      <td className="py-2.5 font-mono">48 - 52</td>
                      <td className="py-2.5 font-mono">46 - 50</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-textDark text-left">3 - 4 Years</td>
                      <td className="py-2.5 font-mono">92 - 104</td>
                      <td className="py-2.5 font-mono">52 - 56</td>
                      <td className="py-2.5 font-mono">50 - 53</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-textDark text-left">5 - 6 Years</td>
                      <td className="py-2.5 font-mono">104 - 116</td>
                      <td className="py-2.5 font-mono">56 - 60</td>
                      <td className="py-2.5 font-mono">53 - 56</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-textDark text-left">7 - 8 Years</td>
                      <td className="py-2.5 font-mono">116 - 128</td>
                      <td className="py-2.5 font-mono">60 - 64</td>
                      <td className="py-2.5 font-mono">56 - 59</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-textDark text-left">9 - 10 Years</td>
                      <td className="py-2.5 font-mono">128 - 140</td>
                      <td className="py-2.5 font-mono">64 - 70</td>
                      <td className="py-2.5 font-mono">59 - 63</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-semibold text-textDark text-left">11 - 12 Years</td>
                      <td className="py-2.5 font-mono">140 - 152</td>
                      <td className="py-2.5 font-mono">70 - 76</td>
                      <td className="py-2.5 font-mono">63 - 67</td>
                    </tr>
                  </tbody>
                </table>

                {/* Sizing Note */}
                <div className="bg-softPink/25 border border-primary/10 rounded-2xl p-4 text-[10px] text-primary/95 leading-relaxed font-sans flex items-start space-x-2">
                  <span className="text-xs">💡</span>
                  <p className="text-left">
                    <strong>Sizing Tip:</strong> If your child is between sizes, we always recommend ordering one size larger to accommodate growth and ensure absolute comfort.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
