"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem } from "@/types/shopify";

interface CartContextType {
  cartItems: CartItem[];
  cartId: string | null;
  checkoutUrl: string | null;
  isOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: {
    variantId: string;
    quantity: number;
    title: string;
    handle: string;
    variantTitle: string;
    image: string;
    price: number;
    compareAtPrice?: number;
    selectedOptions: { name: string; value: string }[];
  }) => Promise<void>;
  updateItemQuantity: (variantId: string, quantity: number) => Promise<void>;
  removeItem: (variantId: string) => Promise<void>;
  subtotal: number;
  totalQuantity: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCartId = localStorage.getItem("nkora_cart_id");
    const savedCheckoutUrl = localStorage.getItem("nkora_checkout_url");
    const savedItems = localStorage.getItem("nkora_cart_items");

    if (savedCartId) setCartId(savedCartId);
    if (savedCheckoutUrl) setCheckoutUrl(savedCheckoutUrl);
    if (savedItems) {
      try {
        setCartItems(JSON.parse(savedItems));
      } catch (e) {
        console.error("Failed to parse local cart items:", e);
      }
    }

    // Sync with Shopify Cart API on load if cartId exists
    if (savedCartId) {
      fetchShopifyCart(savedCartId);
    }
  }, []);

  // Save cart items to localStorage whenever they change
  const saveCartToLocalStorage = (items: CartItem[], id: string | null, url: string | null) => {
    setCartItems(items);
    localStorage.setItem("nkora_cart_items", JSON.stringify(items));
    if (id) {
      setCartId(id);
      localStorage.setItem("nkora_cart_id", id);
    }
    if (url) {
      setCheckoutUrl(url);
      localStorage.setItem("nkora_checkout_url", url);
    }
  };

  const fetchShopifyCart = async (id: string) => {
    try {
      const response = await fetch("/api/cart?cartId=" + encodeURIComponent(id));
      if (response.ok) {
        const data = await response.json();
        if (data.cart) {
          const formattedItems = formatShopifyCartLines(data.cart.lines.edges);
          saveCartToLocalStorage(formattedItems, data.cart.id, data.cart.checkoutUrl);
        } else {
          // Cart expired or deleted on Shopify
          clearCart();
        }
      }
    } catch (error) {
      console.error("Error syncing cart with Shopify:", error);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setCartId(null);
    setCheckoutUrl(null);
    localStorage.removeItem("nkora_cart_items");
    localStorage.removeItem("nkora_cart_id");
    localStorage.removeItem("nkora_checkout_url");
  };

  const formatShopifyCartLines = (linesEdges: any[]): CartItem[] => {
    return linesEdges.map((edge: any) => {
      const node = edge.node;
      const merchandise = node.merchandise;
      const product = merchandise.product;
      const imgNode = product.images.edges[0]?.node;

      return {
        id: node.id,
        variantId: merchandise.id,
        quantity: node.quantity,
        title: product.title,
        handle: product.handle,
        variantTitle: merchandise.title,
        image: imgNode?.url || "https://images.unsplash.com/photo-1622290319146-7b63df48a635?auto=format&fit=crop&q=80&w=800",
        price: parseFloat(merchandise.price.amount),
        compareAtPrice: merchandise.compareAtPrice ? parseFloat(merchandise.compareAtPrice.amount) : undefined,
        selectedOptions: merchandise.selectedOptions,
      };
    });
  };


  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  const addItem = async (item: Omit<CartItem, "id">) => {
    setIsLoading(true);
    setIsOpen(true); // Open cart immediately for micro-interaction feedback

    // 1. Optimistic Update (UI updates instantly)
    const existingIndex = cartItems.findIndex((i) => i.variantId === item.variantId);
    let updatedItems = [...cartItems];

    if (existingIndex > -1) {
      updatedItems[existingIndex].quantity += item.quantity;
    } else {
      updatedItems.push({
        ...item,
        id: `temp-${Date.now()}`, // Temporary local ID
      });
    }
    setCartItems(updatedItems);

    // 2. Perform Shopify Cart API Call
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId: cartId,
          variantId: item.variantId,
          quantity: item.quantity,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.cart) {
          const formattedItems = formatShopifyCartLines(data.cart.lines.edges);
          saveCartToLocalStorage(formattedItems, data.cart.id, data.cart.checkoutUrl);
        }
      }
    } catch (error) {
      console.error("Failed to sync add item to Shopify:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateItemQuantity = async (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(variantId);
      return;
    }

    setIsLoading(true);

    // 1. Optimistic update
    const updatedItems = cartItems.map((item) =>
      item.variantId === variantId ? { ...item, quantity } : item
    );
    setCartItems(updatedItems);

    // 2. Sync with API
    const itemToUpdate = cartItems.find((i) => i.variantId === variantId);
    if (!itemToUpdate || !cartId) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId,
          lineId: itemToUpdate.id, // we need line ID
          quantity,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.cart) {
          const formattedItems = formatShopifyCartLines(data.cart.lines.edges);
          saveCartToLocalStorage(formattedItems, data.cart.id, data.cart.checkoutUrl);
        }
      }
    } catch (error) {
      console.error("Failed to sync update quantity on Shopify:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (variantId: string) => {
    setIsLoading(true);

    // 1. Optimistic update
    const updatedItems = cartItems.filter((item) => item.variantId !== variantId);
    setCartItems(updatedItems);

    // 2. Sync with API
    const itemToRemove = cartItems.find((i) => i.variantId === variantId);
    if (!itemToRemove || !cartId) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/cart", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cartId,
          lineId: itemToRemove.id,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.cart) {
          const formattedItems = formatShopifyCartLines(data.cart.lines.edges);
          saveCartToLocalStorage(formattedItems, data.cart.id, data.cart.checkoutUrl);
        }
      }
    } catch (error) {
      console.error("Failed to sync delete item on Shopify:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartId,
        checkoutUrl,
        isOpen,
        isLoading,
        openCart,
        closeCart,
        addItem,
        updateItemQuantity,
        removeItem,
        subtotal,
        totalQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
