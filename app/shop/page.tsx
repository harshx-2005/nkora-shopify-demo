import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Star } from "lucide-react";

import { getProducts, getCollectionProducts, getCollections } from "@/lib/shopify/client";
import { formatPrice } from "@/lib/utils";
import { ShopifyProduct } from "@/types/shopify";

interface ShopPageProps {
  searchParams: Promise<{
    collection?: string;
    search?: string;
    sort?: string;
  }>;
}

export const revalidate = 60; // Cache lists for 60 seconds

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const activeCollection = params.collection || "";
  const searchQuery = params.search || "";
  const activeSort = params.sort || "relevance";

  let products: ShopifyProduct[] = [];
  let collectionTitle = "ALL PRODUCTS";
  let collectionDesc = "Discover our complete catalog of luxury children's clothing.";

  // Fetch collections list for the filter sidebar
  const collections = await getCollections();

  try {
    if (activeCollection && activeCollection !== "new-arrivals") {
      const colData = await getCollectionProducts(activeCollection);
      if (colData) {
        products = colData.products.edges.map((e) => e.node);
        collectionTitle = colData.title;
        collectionDesc = colData.description || `Browse our premium selections for ${colData.title}.`;
      }
    } else {
      products = await getProducts(searchQuery || undefined);
      if (activeCollection === "new-arrivals") {
        products = products.filter((p) => p.tags.includes("new") || p.tags.includes("New"));
        collectionTitle = "New Arrivals";
        collectionDesc = "Fresh designs curated with light pastel shades and skin-friendly threads.";
      } else if (searchQuery) {
        collectionTitle = `Search: "${searchQuery}"`;
        collectionDesc = `Found ${products.length} products matching your query.`;
      }
    }
  } catch (error) {
    console.error("Failed to query shop products:", error);
  }

  // Handle Sort operations on the server side
  const sortedProducts = [...products];
  if (activeSort === "price-asc") {

    sortedProducts.sort(
      (a, b) => parseFloat(a.priceRange.minVariantPrice.amount) - parseFloat(b.priceRange.minVariantPrice.amount)
    );
  } else if (activeSort === "price-desc") {
    sortedProducts.sort(
      (a, b) => parseFloat(b.priceRange.minVariantPrice.amount) - parseFloat(a.priceRange.minVariantPrice.amount)
    );
  } else if (activeSort === "title-asc") {
    sortedProducts.sort((a, b) => a.title.localeCompare(b.title));
  }

  return (
    <div className="bg-white min-h-screen py-10 px-4 md:px-10 font-poppins">
      <div className="max-w-site mx-auto">
        {/* Banner header block */}
        <div className="text-center bg-lightGray rounded-[40px] border border-borderCustom py-12 px-6 mb-12">
          <span className="text-[10px] uppercase font-bold tracking-widest text-primary">
            NKORA KIDSWEAR
          </span>
          <h1 className="text-3xl font-light tracking-wide text-textDark uppercase mt-1">
            {collectionTitle}
          </h1>
          <p className="text-xs text-textDark/50 max-w-xl mx-auto font-sans leading-relaxed mt-2">
            {collectionDesc}
          </p>
        </div>

        {/* Filters and Grid layout split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Filters (Desktop) */}
          <aside className="lg:col-span-3 space-y-8 lg:sticky lg:top-28">
            {/* Category Filter */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold tracking-widest text-textDark uppercase border-b border-borderCustom pb-2">
                Filter by Category
              </h3>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/shop"
                    className={`text-xs block py-1 transition-colors ${
                      !activeCollection ? "text-primary font-bold" : "text-textDark/70 hover:text-primary"
                    }`}
                  >
                    All Products
                  </Link>
                </li>
                {collections.map((col) => (
                  <li key={col.id}>
                    <Link
                      href={`/shop?collection=${col.handle}`}
                      className={`text-xs block py-1 capitalize transition-colors ${
                        activeCollection === col.handle ? "text-primary font-bold" : "text-textDark/70 hover:text-primary"
                      }`}
                    >
                      {col.title}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/shop?collection=new-arrivals"
                    className={`text-xs block py-1 transition-colors ${
                      activeCollection === "new-arrivals" ? "text-primary font-bold" : "text-textDark/70 hover:text-primary"
                    }`}
                  >
                    New Arrivals
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sorting Filter */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold tracking-widest text-textDark uppercase border-b border-borderCustom pb-2">
                Sort Options
              </h3>
              <div className="flex flex-col gap-1.5">
                <Link
                  href={`/shop?${activeCollection ? `collection=${activeCollection}&` : ""}${searchQuery ? `search=${searchQuery}&` : ""}sort=relevance`}
                  className={`text-xs py-1 transition-colors ${
                    activeSort === "relevance" ? "text-primary font-bold" : "text-textDark/70 hover:text-primary"
                  }`}
                >
                  Featured Relevance
                </Link>
                <Link
                  href={`/shop?${activeCollection ? `collection=${activeCollection}&` : ""}${searchQuery ? `search=${searchQuery}&` : ""}sort=price-asc`}
                  className={`text-xs py-1 transition-colors ${
                    activeSort === "price-asc" ? "text-primary font-bold" : "text-textDark/70 hover:text-primary"
                  }`}
                >
                  Price: Low to High
                </Link>
                <Link
                  href={`/shop?${activeCollection ? `collection=${activeCollection}&` : ""}${searchQuery ? `search=${searchQuery}&` : ""}sort=price-desc`}
                  className={`text-xs py-1 transition-colors ${
                    activeSort === "price-desc" ? "text-primary font-bold" : "text-textDark/70 hover:text-primary"
                  }`}
                >
                  Price: High to Low
                </Link>
                <Link
                  href={`/shop?${activeCollection ? `collection=${activeCollection}&` : ""}${searchQuery ? `search=${searchQuery}&` : ""}sort=title-asc`}
                  className={`text-xs py-1 transition-colors ${
                    activeSort === "title-asc" ? "text-primary font-bold" : "text-textDark/70 hover:text-primary"
                  }`}
                >
                  Alphabetical: A-Z
                </Link>
              </div>
            </div>
          </aside>

          {/* Core Products Grid (Desktop) */}
          <main className="lg:col-span-9">
            {sortedProducts.length === 0 ? (
              <div className="text-center py-20 bg-lightGray/30 rounded-3xl border border-borderCustom space-y-4">
                <p className="text-sm font-sans text-textDark/50">
                  No products found matching the criteria.
                </p>
                <Link
                  href="/shop"
                  className="bg-primary hover:bg-primary-hover text-white text-xs tracking-widest font-bold uppercase py-3.5 px-6 rounded-2xl inline-block"
                >
                  Clear Filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                {sortedProducts.map((product) => {
                  const validImages = product.images.edges
                    .map((e) => e.node?.url)
                    .filter((url) => typeof url === "string" && url.trim() !== "");
                  const imgUrl = validImages[0] || "https://images.unsplash.com/photo-1622290319146-7b63df48a635?auto=format&fit=crop&q=80&w=800";
                  const secondaryImg = validImages[1] || imgUrl;
                  const price = parseFloat(product.priceRange.minVariantPrice.amount);
                  const comparePrice = product.compareAtPriceRange?.minVariantPrice?.amount
                    ? parseFloat(product.compareAtPriceRange.minVariantPrice.amount)
                    : null;


                  return (
                    <div
                      key={product.id}
                      className="group rounded-[28px] border border-borderCustom bg-white overflow-hidden card-lift-hover relative flex flex-col justify-between"
                    >
                      {/* Image Box */}
                      <div className="relative aspect-[3/4] bg-lightGray overflow-hidden">
                        <Link href={`/shop/${product.handle}`} className="block w-full h-full relative">
                          <Image
                            src={imgUrl}
                            alt={product.title}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105 group-hover:opacity-0"
                          />
                          <Image
                            src={secondaryImg}
                            alt={`${product.title} Alternate`}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out"
                          />
                        </Link>
                      </div>

                      {/* Info details */}
                      <div className="p-4 flex-grow flex flex-col justify-between">
                        <div>
                          <div className="flex items-center space-x-1 mb-1.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={9} className="fill-amber-400 stroke-amber-400" />
                            ))}
                            <span className="text-[8px] text-textDark/40 font-bold ml-1">(5.0)</span>
                          </div>

                          <Link href={`/shop/${product.handle}`}>
                            <h3 className="text-xs font-bold text-textDark leading-snug line-clamp-1 group-hover:text-primary transition-colors">
                              {product.title}
                            </h3>
                          </Link>
                          <p className="text-[9px] text-textDark/40 uppercase tracking-widest mt-1">
                            {product.productType || "Kidswear"}
                          </p>
                        </div>

                        {/* Prices */}
                        <div className="flex items-baseline space-x-2 mt-2">
                          <span className="text-xs font-bold text-primary font-mono">
                            {formatPrice(price)}
                          </span>
                          {comparePrice && comparePrice > price && (
                            <span className="text-[10px] text-textDark/30 line-through font-mono">
                              {formatPrice(comparePrice)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
