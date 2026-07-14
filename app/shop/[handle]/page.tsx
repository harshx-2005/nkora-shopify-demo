import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductByHandle, getProducts } from "@/lib/shopify/client";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductAccordion from "@/components/product/ProductAccordion";
import ProductReviews from "@/components/product/ProductReviews";
import { ShopifyProduct } from "@/types/shopify";
import { Metadata } from "next";



interface ProductPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateStaticParams() {
  try {
    const products = await getProducts();
    return products.map((product) => ({
      handle: product.handle,
    }));
  } catch (error) {
    console.error("Static generation params retrieval failed:", error);
    return [];
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    return {
      title: "Product Not Found | NKORA KidsWear",
    };
  }

  const imageUrl = product.images.edges[0]?.node?.url;

  return {
    title: `${product.title} | Premium Kidswear | NKORA`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const product = await getProductByHandle(handle);

  if (!product) {
    notFound();
  }

  const productImages = product.images.edges
    .map((e) => e.node)
    .filter((img) => img && typeof img.url === "string" && img.url.trim() !== "");

  // Fetch related products (e.g. same productType or first 4 fallbacks)
  let relatedProducts: ShopifyProduct[] = [];
  try {
    const allProducts = await getProducts();
    relatedProducts = allProducts
      .filter((p) => p.id !== product.id && p.productType === product.productType)
      .slice(0, 4);
    
    if (relatedProducts.length === 0) {
      relatedProducts = allProducts.filter((p) => p.id !== product.id).slice(0, 4);
    }
  } catch (error) {
    console.error("Failed to load related products:", error);
  }

  return (
    <div className="bg-white min-h-screen py-6 md:py-10 px-4 md:px-10 font-poppins">
      <div className="max-w-site mx-auto space-y-16">
        {/* Breadcrumb Section */}
        <nav className="text-[11px] font-sans font-semibold tracking-wider text-textDark/40 uppercase mb-0 flex items-center space-x-1.5 overflow-x-auto whitespace-nowrap pb-2 md:pb-0 select-none">
          <Link href="/" className="hover:text-primary transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-primary transition-colors">
            Shop
          </Link>
          <span>/</span>
          {product.productType && (
            <>
              <Link 
                href={`/shop?collection=${product.productType.toLowerCase()}`}
                className="hover:text-primary transition-colors"
              >
                {product.productType}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-textDark/80 truncate max-w-[200px]">
            {product.title}
          </span>
        </nav>

        {/* 3-Column Product Page Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 items-start">
          {/* Column 1: Gallery */}
          <div className="lg:col-span-1">
            <ProductGallery images={productImages} />
          </div>

          {/* Column 2: Core Information & Add Actions */}
          <div className="lg:col-span-1">
            <ProductInfo product={product} />
          </div>

          {/* Column 3: Bullet points, wash guidelines, and returns */}
          <div className="lg:col-span-1">
            <ProductAccordion descriptionHtml={product.descriptionHtml} product={product} />
          </div>
        </div>

        {/* Customer Reviews Section */}
        <ProductReviews />

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-borderCustom pt-16 font-poppins text-left">
            <h3 className="text-sm font-bold text-textDark tracking-wider uppercase mb-8">
              You May Also Like
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => {
                const relImage = rel.images.edges[0]?.node?.url || "https://images.unsplash.com/photo-1622290319146-7b63df48a635?auto=format&fit=crop&q=80&w=400";
                const price = rel.priceRange.minVariantPrice.amount;
                return (
                  <Link
                    key={rel.id}
                    href={`/shop/${rel.handle}`}
                    className="group flex flex-col space-y-3 cursor-pointer"
                  >
                    <div className="relative aspect-3/4 w-full rounded-2xl overflow-hidden bg-lightGray">
                      <img
                        src={relImage}
                        alt={rel.title}
                        className="object-cover object-top w-full h-full group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      {rel.compareAtPriceRange?.minVariantPrice?.amount && 
                       parseFloat(rel.compareAtPriceRange.minVariantPrice.amount) > parseFloat(price) && (
                        <span className="absolute top-3 left-3 bg-primary text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md">
                          Sale
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-textDark/40 font-bold font-poppins block">
                        {rel.productType}
                      </span>
                      <h4 className="text-xs font-bold text-textDark truncate group-hover:text-primary transition-colors font-poppins">
                        {rel.title}
                      </h4>
                      <span className="text-xs text-primary font-bold font-mono">
                        ₹{parseFloat(price).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

