import {
  GET_PRODUCTS_QUERY,
  GET_PRODUCT_BY_HANDLE_QUERY,
  GET_COLLECTIONS_QUERY,
  GET_COLLECTION_PRODUCTS_QUERY,
  SEARCH_PRODUCTS_QUERY,
  GET_CUSTOMER_QUERY,
} from "./queries";
import {
  CREATE_CART_MUTATION,
  ADD_CART_LINES_MUTATION,
  UPDATE_CART_LINES_MUTATION,
  REMOVE_CART_LINES_MUTATION,
  GET_CART_QUERY,
  CUSTOMER_CREATE_MUTATION,
  CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
  CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION,
} from "./mutations";

import { ShopifyProduct, ShopifyCollection, ShopifyCart } from "@/types/shopify";

const domain = process.env.SHOPIFY_STORE_DOMAIN || "";
const accessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
const endpoint = `https://${domain}/api/2024-04/graphql.json`;

// Real-world fallback mock products to match the premium design mockup images
export const MOCK_PRODUCTS: ShopifyProduct[] = [
  {
    id: "gid://shopify/Product/mock-1",
    handle: "girls-floral-layered-tulle-dress",
    title: "Girls Floral Layered Tulle Dress",
    description: "Beautiful floral layered tulle dress for girls. Perfect for birthday parties, weddings and special occasions.",
    descriptionHtml: "<p>Beautiful floral layered tulle dress for girls. Perfect for birthday parties, weddings and special occasions.</p><ul><li>Fabric: Premium Net with Cotton Lining</li><li>Color: Pink</li><li>Neck Type: Round Neck</li><li>Sleeve: Sleeveless</li><li>Closure: Back Button</li><li>Fit: Regular Fit</li></ul>",
    availableForSale: true,
    tags: ["girls", "new", "partywear"],
    productType: "Dress",
    vendor: "NKORA",
    priceRange: {
      minVariantPrice: { amount: "1699.00", currencyCode: "INR" },
      maxVariantPrice: { amount: "1699.00", currencyCode: "INR" },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: "2499.00", currencyCode: "INR" },
      maxVariantPrice: { amount: "2499.00", currencyCode: "INR" },
    },
    images: {
      edges: [
        {
          node: {
            url: "https://images.unsplash.com/photo-1622290319146-7b63df48a635?auto=format&fit=crop&q=80&w=800",
            altText: "Girls Floral Layered Tulle Dress",
            width: 800,
            height: 1000
          }
        },
        {
          node: {
            url: "https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&q=80&w=800",
            altText: "Girls Floral Layered Tulle Dress - Back",
            width: 800,
            height: 1000
          }
        },
        {
          node: {
            url: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=800",
            altText: "Girls Floral Layered Tulle Dress - Detail",
            width: 800,
            height: 1000
          }
        }
      ]
    },
    options: [
      { id: "size", name: "Size", values: ["2Y", "3Y", "4Y", "5Y", "6Y", "7Y", "8Y"] },
      { id: "color", name: "Color", values: ["Pink", "Soft Peach"] }
    ],
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-1-v1",
            title: "2Y / Pink",
            availableForSale: true,
            price: { amount: "1699.00", currencyCode: "INR" },
            compareAtPrice: { amount: "2499.00", currencyCode: "INR" },
            selectedOptions: [
              { name: "Size", value: "2Y" },
              { name: "Color", value: "Pink" }
            ],
            image: { url: "https://images.unsplash.com/photo-1622290319146-7b63df48a635?auto=format&fit=crop&q=80&w=800" }
          }
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-1-v2",
            title: "3Y / Pink",
            availableForSale: true,
            price: { amount: "1699.00", currencyCode: "INR" },
            compareAtPrice: { amount: "2499.00", currencyCode: "INR" },
            selectedOptions: [
              { name: "Size", value: "3Y" },
              { name: "Color", value: "Pink" }
            ],
            image: { url: "https://images.unsplash.com/photo-1622290319146-7b63df48a635?auto=format&fit=crop&q=80&w=800" }
          }
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-1-v3",
            title: "4Y / Pink",
            availableForSale: true,
            price: { amount: "1699.00", currencyCode: "INR" },
            compareAtPrice: { amount: "2499.00", currencyCode: "INR" },
            selectedOptions: [
              { name: "Size", value: "4Y" },
              { name: "Color", value: "Pink" }
            ],
            image: { url: "https://images.unsplash.com/photo-1622290319146-7b63df48a635?auto=format&fit=crop&q=80&w=800" }
          }
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-1-v4",
            title: "5Y / Pink",
            availableForSale: true,
            price: { amount: "1699.00", currencyCode: "INR" },
            compareAtPrice: { amount: "2499.00", currencyCode: "INR" },
            selectedOptions: [
              { name: "Size", value: "5Y" },
              { name: "Color", value: "Pink" }
            ],
            image: { url: "https://images.unsplash.com/photo-1622290319146-7b63df48a635?auto=format&fit=crop&q=80&w=800" }
          }
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-1-v5",
            title: "6Y / Pink",
            availableForSale: true,
            price: { amount: "1699.00", currencyCode: "INR" },
            compareAtPrice: { amount: "2499.00", currencyCode: "INR" },
            selectedOptions: [
              { name: "Size", value: "6Y" },
              { name: "Color", value: "Pink" }
            ],
            image: { url: "https://images.unsplash.com/photo-1622290319146-7b63df48a635?auto=format&fit=crop&q=80&w=800" }
          }
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-1-v6",
            title: "7Y / Pink",
            availableForSale: true,
            price: { amount: "1699.00", currencyCode: "INR" },
            compareAtPrice: { amount: "2499.00", currencyCode: "INR" },
            selectedOptions: [
              { name: "Size", value: "7Y" },
              { name: "Color", value: "Pink" }
            ],
            image: { url: "https://images.unsplash.com/photo-1622290319146-7b63df48a635?auto=format&fit=crop&q=80&w=800" }
          }
        },
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-1-v7",
            title: "8Y / Pink",
            availableForSale: true,
            price: { amount: "1699.00", currencyCode: "INR" },
            compareAtPrice: { amount: "2499.00", currencyCode: "INR" },
            selectedOptions: [
              { name: "Size", value: "8Y" },
              { name: "Color", value: "Pink" }
            ],
            image: { url: "https://images.unsplash.com/photo-1622290319146-7b63df48a635?auto=format&fit=crop&q=80&w=800" }
          }
        }
      ]
    }
  },
  {
    id: "gid://shopify/Product/mock-2",
    handle: "checked-shirt-set",
    title: "Checked Shirt Set",
    description: "Premium checkered cotton shirt paired with elegant shorts. Playful, comfortable, and perfect for active boys.",
    descriptionHtml: "<p>Premium checkered cotton shirt paired with elegant shorts. Playful, comfortable, and perfect for active boys.</p>",
    availableForSale: true,
    tags: ["boys", "new"],
    productType: "Shirt Set",
    vendor: "NKORA",
    priceRange: {
      minVariantPrice: { amount: "1459.00", currencyCode: "INR" },
      maxVariantPrice: { amount: "1459.00", currencyCode: "INR" },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: "1999.00", currencyCode: "INR" },
      maxVariantPrice: { amount: "1999.00", currencyCode: "INR" },
    },
    images: {
      edges: [
        {
          node: {
            url: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=800",
            altText: "Checked Shirt Set",
            width: 800,
            height: 1000
          }
        }
      ]
    },
    options: [
      { id: "size", name: "Size", values: ["2Y", "3Y", "4Y", "5Y", "6Y"] }
    ],
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-2-v1",
            title: "2Y",
            availableForSale: true,
            price: { amount: "1459.00", currencyCode: "INR" },
            compareAtPrice: { amount: "1999.00", currencyCode: "INR" },
            selectedOptions: [{ name: "Size", value: "2Y" }]
          }
        }
      ]
    }
  },
  {
    id: "gid://shopify/Product/mock-3",
    handle: "lace-party-dress",
    title: "Lace Party Dress",
    description: "Stunning yellow lace party dress with delicate ribbon styling. The perfect summer highlight.",
    descriptionHtml: "<p>Stunning yellow lace party dress with delicate ribbon styling. The perfect summer highlight.</p>",
    availableForSale: true,
    tags: ["girls", "new", "partywear"],
    productType: "Dress",
    vendor: "NKORA",
    priceRange: {
      minVariantPrice: { amount: "1899.00", currencyCode: "INR" },
      maxVariantPrice: { amount: "1899.00", currencyCode: "INR" },
    },
    images: {
      edges: [
        {
          node: {
            url: "https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&q=80&w=800",
            altText: "Lace Party Dress",
            width: 800,
            height: 1000
          }
        }
      ]
    },
    options: [
      { id: "size", name: "Size", values: ["2Y", "3Y", "4Y", "5Y", "6Y", "7Y"] }
    ],
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-3-v1",
            title: "2Y",
            availableForSale: true,
            price: { amount: "1899.00", currencyCode: "INR" },
            selectedOptions: [{ name: "Size", value: "2Y" }]
          }
        }
      ]
    }
  },
  {
    id: "gid://shopify/Product/mock-4",
    handle: "bow-tie-suspender-set",
    title: "Bow Tie Suspender Set",
    description: "Classic bow tie, crisp light-blue shirt, and suspender trousers set. A dapper look for little gentlemen.",
    descriptionHtml: "<p>Classic bow tie, crisp light-blue shirt, and suspender trousers set. A dapper look for little gentlemen.</p>",
    availableForSale: true,
    tags: ["boys", "new", "partywear"],
    productType: "Suspender Set",
    vendor: "NKORA",
    priceRange: {
      minVariantPrice: { amount: "1599.00", currencyCode: "INR" },
      maxVariantPrice: { amount: "1599.00", currencyCode: "INR" },
    },
    images: {
      edges: [
        {
          node: {
            url: "https://images.unsplash.com/photo-1607990283143-e81e7a2c93ab?auto=format&fit=crop&q=80&w=800",
            altText: "Bow Tie Suspender Set",
            width: 800,
            height: 1000
          }
        }
      ]
    },
    options: [
      { id: "size", name: "Size", values: ["2Y", "3Y", "4Y", "5Y", "6Y"] }
    ],
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-4-v1",
            title: "2Y",
            availableForSale: true,
            price: { amount: "1599.00", currencyCode: "INR" },
            selectedOptions: [{ name: "Size", value: "2Y" }]
          }
        }
      ]
    }
  },
  {
    id: "gid://shopify/Product/mock-5",
    handle: "cotton-frock",
    title: "Cotton Frock",
    description: "Lightweight and breathable printed cotton frock. Perfect for standard daily play and warm days.",
    descriptionHtml: "<p>Lightweight and breathable printed cotton frock. Perfect for standard daily play and warm days.</p>",
    availableForSale: true,
    tags: ["girls", "new", "accessories"],
    productType: "Frock",
    vendor: "NKORA",
    priceRange: {
      minVariantPrice: { amount: "1299.00", currencyCode: "INR" },
      maxVariantPrice: { amount: "1299.00", currencyCode: "INR" },
    },
    images: {
      edges: [
        {
          node: {
            url: "https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&q=80&w=800",
            altText: "Cotton Frock",
            width: 800,
            height: 1000
          }
        }
      ]
    },
    options: [
      { id: "size", name: "Size", values: ["2Y", "3Y", "4Y", "5Y", "6Y"] }
    ],
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-5-v1",
            title: "2Y",
            availableForSale: true,
            price: { amount: "1299.00", currencyCode: "INR" },
            selectedOptions: [{ name: "Size", value: "2Y" }]
          }
        }
      ]
    }
  },
  {
    id: "gid://shopify/Product/mock-6",
    handle: "pink-leather-bag-and-bow",
    title: "Pink Leather Bag & Bow Accessory",
    description: "Cute leather purse and matches-all pink satin bow hair accessory set for girls.",
    descriptionHtml: "<p>Cute leather purse and matches-all pink satin bow hair accessory set for girls.</p>",
    availableForSale: true,
    tags: ["accessories"],
    productType: "Accessories",
    vendor: "NKORA",
    priceRange: {
      minVariantPrice: { amount: "699.00", currencyCode: "INR" },
      maxVariantPrice: { amount: "699.00", currencyCode: "INR" },
    },
    images: {
      edges: [
        {
          node: {
            url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800",
            altText: "Accessories Set",
            width: 800,
            height: 1000
          }
        }
      ]
    },
    options: [
      { id: "size", name: "Size", values: ["One Size"] }
    ],
    variants: {
      edges: [
        {
          node: {
            id: "gid://shopify/ProductVariant/mock-6-v1",
            title: "One Size",
            availableForSale: true,
            price: { amount: "699.00", currencyCode: "INR" },
            selectedOptions: [{ name: "Size", value: "One Size" }]
          }
        }
      ]
    }
  }
];

export const MOCK_COLLECTIONS: ShopifyCollection[] = [
  {
    id: "gid://shopify/Collection/mock-c1",
    handle: "girls",
    title: "Girls Collection",
    description: "Premium dresses, frocks and accessories for girls.",
    image: { url: "https://images.unsplash.com/photo-1622290319146-7b63df48a635?auto=format&fit=crop&q=80&w=800" },
    products: { edges: MOCK_PRODUCTS.filter(p => p.tags.includes("girls")).map(p => ({ node: p })) }
  },
  {
    id: "gid://shopify/Collection/mock-c2",
    handle: "boys",
    title: "Boys Collection",
    description: "Suits, shirts, shorts and casual wear for boys.",
    image: { url: "https://images.unsplash.com/photo-1519457431-44ccd64a579b?auto=format&fit=crop&q=80&w=800" },
    products: { edges: MOCK_PRODUCTS.filter(p => p.tags.includes("boys")).map(p => ({ node: p })) }
  },
  {
    id: "gid://shopify/Collection/mock-c3",
    handle: "party-wear",
    title: "Party Wear",
    description: "Elegant and luxury attire for festive and social occasions.",
    image: { url: "https://images.unsplash.com/photo-1595853035070-59a39fe84de3?auto=format&fit=crop&q=80&w=800" },
    products: { edges: MOCK_PRODUCTS.filter(p => p.tags.includes("partywear")).map(p => ({ node: p })) }
  },
  {
    id: "gid://shopify/Collection/mock-c4",
    handle: "accessories",
    title: "Accessories",
    description: "Top off their style with hair clips, matching socks, and bags.",
    image: { url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=800" },
    products: { edges: MOCK_PRODUCTS.filter(p => p.tags.includes("accessories")).map(p => ({ node: p })) }
  }
];

export async function shopifyFetch<T>({
  query,
  variables = {},
  cache = "force-cache",
}: {
  query: string;
  variables?: Record<string, unknown>;
  cache?: RequestCache;
}): Promise<{ status: number; body: T } | null> {

  if (!domain || !accessToken) {
    console.warn("Shopify environment variables are missing! Using mockup server mode.");
    return null;
  }

  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": accessToken,
      },
      body: JSON.stringify({ query, variables }),
      cache,
      next: cache === "force-cache" ? { revalidate: 3600 } : undefined, // Cache for 1 hour
    });

    const body = await result.json();

    if (body.errors) {
      console.error("Shopify Storefront GraphQL Errors:", body.errors);
      throw new Error("GraphQL fetch failed");
    }

    return {
      status: result.status,
      body: body.data as T,
    };
  } catch (error) {
    console.error("Failed to fetch from Shopify API. Details:", error);
    return null;
  }
}

// SDK Functions
export async function getProducts(query?: string): Promise<ShopifyProduct[]> {
  const response = await shopifyFetch<{ products: { edges: { node: ShopifyProduct }[] } }>({
    query: GET_PRODUCTS_QUERY,
    variables: { first: 50, query },
  });

  const products = response?.body?.products?.edges.map(edge => edge.node) || [];
  if (products.length === 0) {
    console.log("No products returned from Shopify. Serving fallback Mock products.");
    return query 
      ? MOCK_PRODUCTS.filter(p => p.title.toLowerCase().includes(query.toLowerCase()) || p.tags.includes(query.toLowerCase()))
      : MOCK_PRODUCTS;
  }
  return products;
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const response = await shopifyFetch<{ product: ShopifyProduct }>({
    query: GET_PRODUCT_BY_HANDLE_QUERY,
    variables: { handle },
  });

  const product = response?.body?.product || null;
  if (!product) {
    console.log(`Product "${handle}" not found on Shopify. Searching in mock database.`);
    return MOCK_PRODUCTS.find(p => p.handle === handle) || null;
  }
  return product;
}

export async function getCollections(): Promise<ShopifyCollection[]> {
  const response = await shopifyFetch<{ collections: { edges: { node: ShopifyCollection }[] } }>({
    query: GET_COLLECTIONS_QUERY,
    variables: { first: 10 },
  });

  const collections = response?.body?.collections?.edges.map(edge => edge.node) || [];
  if (collections.length === 0) {
    console.log("No collections returned from Shopify. Serving mock collections.");
    return MOCK_COLLECTIONS;
  }
  return collections;
}

export async function getCollectionProducts(handle: string): Promise<ShopifyCollection | null> {
  const response = await shopifyFetch<{ collection: ShopifyCollection }>({
    query: GET_COLLECTION_PRODUCTS_QUERY,
    variables: { handle, first: 50 },
  });

  const collection = response?.body?.collection || null;
  if (!collection || !collection.products?.edges || collection.products.edges.length === 0) {
    console.log(`Collection "${handle}" empty or missing on Shopify. Serving mock collection.`);
    return MOCK_COLLECTIONS.find(c => c.handle === handle) || null;
  }
  return collection;
}

export async function searchProducts(query: string): Promise<ShopifyProduct[]> {
  const response = await shopifyFetch<{ products: { edges: { node: ShopifyProduct }[] } }>({
    query: SEARCH_PRODUCTS_QUERY,
    variables: { query, first: 20 },
  });

  const products = response?.body?.products?.edges.map(edge => edge.node) || [];
  if (products.length === 0) {
    return MOCK_PRODUCTS.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
    );
  }
  return products;
}

// Cart Management Calls (Redirected to Storefront API mutations)
export async function createCart(variantId?: string, quantity: number = 1): Promise<ShopifyCart | null> {
  const input = variantId ? { lines: [{ merchandiseId: variantId, quantity }] } : {};
  const response = await shopifyFetch<{ cartCreate: { cart: ShopifyCart } }>({
    query: CREATE_CART_MUTATION,
    variables: { input },
    cache: "no-store",
  });
  return response?.body?.cartCreate?.cart || null;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const response = await shopifyFetch<{ cart: ShopifyCart }>({
    query: GET_CART_QUERY,
    variables: { cartId },
    cache: "no-store",
  });
  return response?.body?.cart || null;
}

export async function addToCart(cartId: string, variantId: string, quantity: number = 1): Promise<ShopifyCart | null> {
  const response = await shopifyFetch<{ cartLinesAdd: { cart: ShopifyCart } }>({
    query: ADD_CART_LINES_MUTATION,
    variables: { cartId, lines: [{ merchandiseId: variantId, quantity }] },
    cache: "no-store",
  });
  return response?.body?.cartLinesAdd?.cart || null;
}

export async function updateCart(
  cartId: string,
  lineId: string,
  quantity: number
): Promise<ShopifyCart | null> {
  const response = await shopifyFetch<{ cartLinesUpdate: { cart: ShopifyCart } }>({
    query: UPDATE_CART_LINES_MUTATION,
    variables: { cartId, lines: [{ id: lineId, quantity }] },
    cache: "no-store",
  });
  return response?.body?.cartLinesUpdate?.cart || null;
}


export async function removeFromCart(cartId: string, lineId: string): Promise<ShopifyCart | null> {
  const response = await shopifyFetch<{ cartLinesRemove: { cart: ShopifyCart } }>({
    query: REMOVE_CART_LINES_MUTATION,
    variables: { cartId, lineIds: [lineId] },
    cache: "no-store",
  });
  return response?.body?.cartLinesRemove?.cart || null;
}

export async function registerCustomer(input: any) {
  const response = await shopifyFetch<{ customerCreate: { customer: any, customerUserErrors: any[] } }>({
    query: CUSTOMER_CREATE_MUTATION,
    variables: { input },
    cache: "no-store",
  });
  
  if (!response) {
    console.log("Mocking registration for:", input.email);
    return {
      customer: {
        id: "gid://shopify/Customer/mock-customer-id",
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
      },
      customerUserErrors: [],
    };
  }
  
  return response?.body?.customerCreate || null;
}

export async function loginCustomer(input: any) {
  const response = await shopifyFetch<{ customerAccessTokenCreate: { customerAccessToken: any, customerUserErrors: any[] } }>({
    query: CUSTOMER_ACCESS_TOKEN_CREATE_MUTATION,
    variables: { input },
    cache: "no-store",
  });

  if (!response) {
    console.log("Mocking login for:", input.email);
    if (input.password === "error") {
      return {
        customerAccessToken: null,
        customerUserErrors: [{ code: "UNAUTHORIZED_ACCESS", field: ["password"], message: "Incorrect password. Try another password!" }],
      };
    }
    return {
      customerAccessToken: {
        accessToken: `mock-token-${input.email}`,
        expiresAt: new Date(Date.now() + 86400 * 1000).toISOString(),
      },
      customerUserErrors: [],
    };
  }

  return response?.body?.customerAccessTokenCreate || null;
}

export async function logoutCustomer(customerAccessToken: string) {
  const response = await shopifyFetch<{ customerAccessTokenDelete: { deletedAccessToken: string, userErrors: any[] } }>({
    query: CUSTOMER_ACCESS_TOKEN_DELETE_MUTATION,
    variables: { customerAccessToken },
    cache: "no-store",
  });

  if (!response) {
    return {
      deletedAccessToken: customerAccessToken,
      userErrors: [],
    };
  }

  return response?.body?.customerAccessTokenDelete || null;
}

export async function getCustomerProfile(customerAccessToken: string) {
  const response = await shopifyFetch<{ customer: any }>({
    query: GET_CUSTOMER_QUERY,
    variables: { customerAccessToken },
    cache: "no-store",
  });

  if (!response || !response.body?.customer) {
    if (customerAccessToken.startsWith("mock-token-")) {
      const email = customerAccessToken.replace("mock-token-", "");
      return {
        id: "gid://shopify/Customer/mock-customer-id",
        firstName: "Mahesh",
        lastName: "Dutt",
        email: email,
        phone: "+91 98765 43210",
        defaultAddress: {
          id: "gid://shopify/MailingAddress/mock-address",
          address1: "Flat 4B, Sunflower Apartments",
          address2: "12/1 Gariahat Road, Ballygunge",
          city: "Kolkata",
          province: "West Bengal",
          zip: "700019",
          country: "India",
          phone: "+91 98765 43210",
        },
        orders: {
          edges: [
            {
              node: {
                id: "gid://shopify/Order/mock-order-1",
                orderNumber: 94821,
                processedAt: "2026-05-14T10:00:00Z",
                financialStatus: "PAID",
                fulfillmentStatus: "FULFILLED",
                totalPrice: {
                  amount: "3158.00",
                  currencyCode: "INR"
                },
                lineItems: {
                  edges: [
                    {
                      node: {
                        title: "Girls Floral Layered Tulle Dress",
                        quantity: 1,
                        variant: {
                          title: "Pink / 4Y",
                          price: { amount: "1699.00" }
                        }
                      }
                    },
                    {
                      node: {
                        title: "Bow Tie Suspender Set",
                        quantity: 1,
                        variant: {
                          title: "Navy Blue / M",
                          price: { amount: "1459.00" }
                        }
                      }
                    }
                  ]
                }
              }
            }
          ]
        }
      };
    }
    return null;
  }

  return response?.body?.customer || null;
}

