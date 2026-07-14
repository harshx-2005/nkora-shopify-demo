"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { searchProducts } from "@/lib/shopify/client";
import { ShopifyProduct } from "@/types/shopify";
import { formatPrice } from "@/lib/utils";

interface SearchDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchDrawer({ isOpen, onClose }: SearchDrawerProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const popularSearches = [
    "Floral Dress",
    "Bow Tie Suspender",
    "Frock",
    "Checked Shirt Set",
    "Pink Bag"
  ];

  // Focus input when drawer opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
      const saved = localStorage.getItem("nkora_recent_searches");
      if (saved) {
        try {
          setRecentSearches(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Debounced search trigger
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setLoading(true);
      try {
        const searchResults = await searchProducts(query);
        setResults(searchResults);
      } catch (error) {
        console.error("Predictive search failed:", error);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Save to recent searches
    const updated = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("nkora_recent_searches", JSON.stringify(updated));

    // Redirect to Shop page with search parameter
    window.location.href = `/shop?search=${encodeURIComponent(query)}`;
    onClose();
  };

  const handlePopularSearchClick = (searchVal: string) => {
    setQuery(searchVal);
    inputRef.current?.focus();
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem("nkora_recent_searches");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-white flex flex-col"
          initial={{ opacity: 0, y: "-10%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-10%" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
        >

          {/* Top Search Bar Row */}
          <div className="border-b border-borderCustom py-6 px-4 md:px-10">
            <div className="max-w-site mx-auto flex items-center justify-between">
              <form onSubmit={handleSearchSubmit} className="flex-1 flex items-center max-w-3xl">
                <Search size={22} className="text-textDark/60 mr-4" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Search for premium children's clothing..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full text-lg md:text-xl font-poppins font-light text-textDark outline-none bg-transparent placeholder-textDark/30"
                />
                {loading && <Loader2 size={20} className="text-primary animate-spin ml-2" />}
              </form>

              <button
                onClick={onClose}
                className="p-2 ml-4 rounded-full bg-lightGray hover:bg-softPink/50 transition-colors"
                aria-label="Close search"
              >
                <X size={20} className="text-textDark" />
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="flex-1 overflow-y-auto px-4 md:px-10 py-10">
            <div className="max-w-site mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Left Column: Popular & Recent Searches */}
              <div className="md:col-span-1 space-y-8">
                {/* Popular searches */}
                <div>
                  <h3 className="text-xs font-bold tracking-widest text-primary font-poppins mb-4 uppercase">
                    Popular Searches
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handlePopularSearchClick(term)}
                        className="text-xs font-poppins text-textDark/80 hover:text-white bg-lightGray hover:bg-primary py-2 px-4 rounded-full transition-all duration-300"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Recent searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xs font-bold tracking-widest text-primary font-poppins uppercase">
                        Recent Searches
                      </h3>
                      <button
                        onClick={clearRecentSearches}
                        className="text-[10px] tracking-wider font-bold text-blueAccent hover:underline uppercase"
                      >
                        Clear All
                      </button>
                    </div>
                    <ul className="space-y-2">
                      {recentSearches.map((term, idx) => (
                        <li key={idx} className="flex items-center space-x-2">
                          <button
                            onClick={() => handlePopularSearchClick(term)}
                            className="text-xs font-poppins text-textDark/70 hover:text-primary transition-colors py-1 block text-left"
                          >
                            {term}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Right Columns: Predictive Products Showcase */}
              <div className="md:col-span-2 space-y-6">
                <h3 className="text-xs font-bold tracking-widest text-primary font-poppins uppercase border-b border-borderCustom pb-2">
                  {query ? `Suggestions (${results.length})` : "Featured Suggestions"}
                </h3>

                {query && results.length === 0 && !loading && (
                  <p className="text-sm font-poppins text-textDark/50">
                    No products found matching &ldquo;{query}&rdquo;. Try another search term.
                  </p>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <AnimatePresence>
                    {results.map((product) => {
                      const validImages = product.images.edges
                        .map((e) => e.node?.url)
                        .filter((url) => typeof url === "string" && url.trim() !== "");
                      const imgUrl = validImages[0] || "https://images.unsplash.com/photo-1622290319146-7b63df48a635?auto=format&fit=crop&q=80&w=800";
                      const price = parseFloat(product.priceRange.minVariantPrice.amount);
                      
                      return (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Link
                            href={`/shop/${product.handle}`}
                            onClick={onClose}
                            className="flex items-center space-x-4 p-2.5 rounded-2xl hover:bg-lightGray border border-transparent hover:border-borderCustom transition-all duration-300 group"
                          >
                            <div className="relative w-16 h-20 bg-lightGray rounded-xl overflow-hidden flex-shrink-0">
                              <Image
                                src={imgUrl}
                                alt={product.title}
                                fill
                                sizes="100px"
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <div className="min-w-0">

                              <h4 className="text-xs md:text-sm font-bold font-poppins text-textDark truncate group-hover:text-primary transition-colors">
                                {product.title}
                              </h4>
                              <p className="text-[10px] text-textDark/50 mt-1 uppercase tracking-wider">
                                {product.productType || "Kidswear"}
                              </p>
                              <p className="text-xs font-bold text-primary font-mono mt-1.5">
                                {formatPrice(price)}
                              </p>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
