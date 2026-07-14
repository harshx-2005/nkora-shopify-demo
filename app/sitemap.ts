import { MetadataRoute } from "next";
import { getProducts } from "@/lib/shopify/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://nkorakidswear.com";

  // Core static pages
  const routes = [
    "",
    "/shop",
    "/wishlist",
    "/account",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  // Dynamic product routes
  try {
    const products = await getProducts();
    const productRoutes = products.map((product) => ({
      url: `${baseUrl}/shop/${product.handle}`,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    return [...routes, ...productRoutes];
  } catch (error) {
    console.error("Failed to generate dynamic sitemap routes:", error);
    return routes;
  }
}
