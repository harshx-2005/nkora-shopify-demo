import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://nkorakidswear.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/cart",
        "/account",
        "/wishlist",
        "/checkout",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
