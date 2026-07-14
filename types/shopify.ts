export interface ShopifyImage {
  url: string;
  altText?: string;
  width?: number;
  height?: number;
}

export interface Money {
  amount: string;
  currencyCode: string;
}

export interface ProductPriceRange {
  minVariantPrice: Money;
  maxVariantPrice: Money;
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: Money;
  compareAtPrice?: Money;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image?: ShopifyImage;
}

export interface ProductOption {
  id: string;
  name: string;
  values: string[];
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml?: string;
  availableForSale: boolean;
  priceRange: ProductPriceRange;
  compareAtPriceRange?: ProductPriceRange;
  images: {
    edges: {
      node: ShopifyImage;
    }[];
  };
  variants: {
    edges: {
      node: ProductVariant;
    }[];
  };
  options: ProductOption[];
  tags: string[];
  productType?: string;
  vendor?: string;
}

export interface ShopifyCollection {
  id: string;
  handle: string;
  title: string;
  description?: string;
  image?: ShopifyImage;
  products: {
    edges: {
      node: ShopifyProduct;
    }[];
  };
}

export interface ShopifyCartLine {
  id: string;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    product: {
      id: string;
      handle: string;
      title: string;
      images: {
        edges: {
          node: ShopifyImage;
        }[];
      };
    };
    selectedOptions: {
      name: string;
      value: string;
    }[];
    price: Money;
  };
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: {
    edges: {
      node: ShopifyCartLine;
    }[];
  };
  totalQuantity: number;
}

export interface CartItem {
  id: string; // Cart line ID or local temp ID
  variantId: string;
  quantity: number;
  title: string;
  handle: string;
  variantTitle: string;
  image: string;
  price: number;
  compareAtPrice?: number;
  selectedOptions: { name: string; value: string }[];
}
