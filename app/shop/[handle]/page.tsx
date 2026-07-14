import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductByHandle, getProducts } from "@/lib/shopify/client";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductAccordion from "@/components/product/ProductAccordion";
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


  return (
    <div className="bg-white min-h-screen py-6 md:py-10 px-4 md:px-10 font-poppins">
      <div className="max-w-site mx-auto">
        {/* Breadcrumb Section */}
        <nav className="text-[11px] font-sans font-semibold tracking-wider text-textDark/40 uppercase mb-8 flex items-center space-x-1.5 overflow-x-auto whitespace-nowrap pb-2 md:pb-0">
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
            <ProductAccordion descriptionHtml={product.descriptionHtml} />
          </div>
        </div>
      </div>
    </div>
  );
}
