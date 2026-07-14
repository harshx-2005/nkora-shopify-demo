import React from "react";
import Hero from "@/components/home/Hero";
import FeatureIcons from "@/components/home/FeatureIcons";
import CategoryGrid from "@/components/home/CategoryGrid";
import NewArrivals from "@/components/home/NewArrivals";
import DiscountBanner from "@/components/home/DiscountBanner";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CustomerReviews from "@/components/home/CustomerReviews";
import InstagramGallery from "@/components/home/InstagramGallery";
import Newsletter from "@/components/home/Newsletter";
import { getProducts } from "@/lib/shopify/client";
import { ShopifyProduct } from "@/types/shopify";

export const revalidate = 60; // Revalidate every minute

export default async function HomePage() {
  let products: ShopifyProduct[] = [];
  try {

    products = await getProducts();
  } catch (error) {
    console.error("Failed to load products for homepage:", error);
  }

  // Filter for new arrivals tags or fallback to top 6 products
  const newArrivals = products.filter(
    (p) => p.tags.includes("new") || p.tags.includes("New") || p.tags.includes("new-arrivals")
  ).slice(0, 10);

  const displayProducts = newArrivals.length > 0 ? newArrivals : products.slice(0, 8);

  return (
    <div className="bg-white overflow-hidden">
      {/* 1. Large Lifestyle Hero */}
      <Hero />

      {/* 2. Brand Propositions Bar */}
      <FeatureIcons />

      {/* 3. Shop by Category Grid */}
      <CategoryGrid />

      {/* 4. Horizontal Slider for New Arrivals */}
      <NewArrivals products={displayProducts} />

      {/* 5. Luxury Gift Code Banner */}
      <DiscountBanner />

      {/* 6. Why Choose Us (Why Parents Love Us) */}
      <WhyChooseUs />

      {/* 7. Parent Testimonials Carousel */}
      <CustomerReviews />

      {/* 8. Social Instagram grid */}
      <InstagramGallery />

      {/* 9. Newsletter subscription Form */}
      <Newsletter />
    </div>
  );
}

