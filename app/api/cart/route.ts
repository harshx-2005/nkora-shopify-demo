import { NextRequest, NextResponse } from "next/server";
import {
  createCart,
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
} from "@/lib/shopify/client";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cartId = searchParams.get("cartId");

  if (!cartId) {
    return NextResponse.json({ error: "Missing cartId" }, { status: 400 });
  }

  try {
    const cart = await getCart(cartId);
    return NextResponse.json({ cart });
  } catch (error) {
    console.error("GET Cart Error:", error);
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 });
  }

}

export async function POST(request: NextRequest) {
  try {
    const { cartId, variantId, quantity } = await request.json();

    if (!variantId) {
      return NextResponse.json({ error: "Missing variantId" }, { status: 400 });
    }

    let cart;
    if (!cartId) {
      // Create new cart with item
      cart = await createCart(variantId, quantity || 1);
    } else {
      // Add to existing cart
      cart = await addToCart(cartId, variantId, quantity || 1);
    }

    return NextResponse.json({ cart });
  } catch (error) {
    console.error("POST Cart Error:", error);
    return NextResponse.json({ error: "Failed to process cart item" }, { status: 500 });
  }

}

export async function PUT(request: NextRequest) {
  try {
    const { cartId, lineId, quantity } = await request.json();

    if (!cartId || !lineId || quantity === undefined) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const cart = await updateCart(cartId, lineId, quantity);
    return NextResponse.json({ cart });
  } catch (error) {
    console.error("PUT Cart Error:", error);
    return NextResponse.json({ error: "Failed to update cart line" }, { status: 500 });
  }

}

export async function DELETE(request: NextRequest) {
  try {
    const { cartId, lineId } = await request.json();

    if (!cartId || !lineId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const cart = await removeFromCart(cartId, lineId);
    return NextResponse.json({ cart });
  } catch (error) {
    console.error("DELETE Cart Error:", error);
    return NextResponse.json({ error: "Failed to remove cart line" }, { status: 500 });
  }

}
