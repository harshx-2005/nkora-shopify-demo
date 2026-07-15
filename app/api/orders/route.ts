import { NextRequest, NextResponse } from "next/server";
import { getDB, saveDB, Order, OrderItem } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get("orderNumber");
  const identifier = searchParams.get("identifier"); // Email or Mobile

  const db = getDB();

  if (orderNumber && identifier) {
    // Tracking query
    const cleanId = identifier.trim().toLowerCase();
    const order = db.orders.find(o => 
      o.orderNumber.toUpperCase() === orderNumber.trim().toUpperCase() &&
      (o.email.toLowerCase() === cleanId || o.mobile.replace(/\s+/g, "") === cleanId.replace(/\s+/g, ""))
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found with provided details" }, { status: 404 });
    }
    return NextResponse.json({ order });
  }

  // Otherwise, list all for dashboard
  return NextResponse.json({ orders: db.orders });
}

export async function POST(request: NextRequest) {
  try {
    const { 
      customerName, 
      email, 
      mobile, 
      address, 
      city, 
      state, 
      pincode, 
      items, 
      subtotal, 
      shipping, 
      discount, 
      total 
    } = await request.json();

    if (!customerName || !email || !mobile || !address || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required shipping fields or items" }, { status: 400 });
    }

    const db = getDB();
    
    // Generate order number like NK-1053
    const nextNum = 1000 + db.orders.length + 1;
    const orderNumber = `NK-${nextNum}`;

    const newOrder: Order = {
      id: `ord_${Math.random().toString(36).substr(2, 9)}`,
      orderNumber,
      status: "Pending Payment",
      customerName,
      email,
      mobile,
      address,
      city,
      state,
      pincode,
      items: items as OrderItem[],
      subtotal,
      shipping,
      discount,
      total,
      createdAt: new Date().toISOString(),
      statusHistory: [
        { status: "Pending Payment", timestamp: new Date().toISOString() }
      ]
    };

    // Sync with Shopify Admin Draft Orders if API Access Token is configured
    const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
    const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;

    if (adminToken && storeDomain) {
      try {
        const nameParts = customerName.trim().split(/\s+/);
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";

        let formattedPhone = mobile.replace(/\s+/g, "");
        if (/^\d{10}$/.test(formattedPhone)) {
          formattedPhone = `+91${formattedPhone}`;
        } else if (!formattedPhone.startsWith("+")) {
          formattedPhone = undefined;
        }

        const draftOrderBody = {
          draft_order: {
            line_items: items.map((item: any) => ({
              title: item.title,
              price: item.price,
              quantity: item.quantity
            })),
            customer: {
              first_name: firstName,
              last_name: lastName,
              email: email,
              ...(formattedPhone ? { phone: formattedPhone } : {})
            },
            shipping_address: {
              first_name: firstName,
              last_name: lastName,
              address1: address,
              city: city,
              province: state,
              zip: pincode,
              country: "India",
              ...(formattedPhone ? { phone: formattedPhone } : {})
            },
            note: "Manual UPI Payment Order. UTR verification required."
          }
        };

        const shopifyRes = await fetch(`https://${storeDomain}/admin/api/2024-04/draft_orders.json`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": adminToken
          },
          body: JSON.stringify(draftOrderBody)
        });

        if (shopifyRes.ok) {
          const shopifyData = await shopifyRes.json();
          if (shopifyData.draft_order) {
            newOrder.shopifyDraftOrderId = String(shopifyData.draft_order.id);
            newOrder.shopifyDraftOrderName = String(shopifyData.draft_order.name);
          }
        } else {
          console.error("Shopify Admin API Draft Order creation failed:", await shopifyRes.text());
        }
      } catch (err) {
        console.error("Error creating draft order on Shopify Admin API:", err);
      }
    }

    db.orders.unshift(newOrder); // Add to the top
    saveDB(db);

    return NextResponse.json({ order: newOrder });
  } catch (error) {
    console.error("Create Order Error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, action, paymentDetails, internalNotes, courierPartner, trackingNumber, estimatedDelivery, status } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const db = getDB();
    const orderIndex = db.orders.findIndex(o => o.id === orderId);

    if (orderIndex === -1) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const order = db.orders[orderIndex];

    // Handle submit payment details
    if (action === "submit_payment") {
      order.status = "Payment Under Verification";
      order.paymentDetails = {
        utr: paymentDetails.utr || "",
        transactionId: paymentDetails.transactionId || "",
        method: paymentDetails.method || "UPI",
        senderName: paymentDetails.senderName || "",
        date: paymentDetails.date || "",
        time: paymentDetails.time || "",
        screenshotUrl: paymentDetails.screenshotUrl || "",
        notes: paymentDetails.notes || "",
        submittedAt: new Date().toISOString()
      };
      order.statusHistory?.push({
        status: "Payment Under Verification",
        timestamp: new Date().toISOString()
      });
    } 
    // Handle manual status transition or dashboard actions
    else {
      if (status && status !== order.status) {
        order.status = status;
        order.statusHistory?.push({
          status,
          timestamp: new Date().toISOString()
        });

        // Auto-complete Draft Order in Shopify Admin if token is present
        if (status === "Payment Verified" && order.shopifyDraftOrderId) {
          const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
          const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;
          if (adminToken && storeDomain) {
            try {
              const completeRes = await fetch(`https://${storeDomain}/admin/api/2024-04/draft_orders/${order.shopifyDraftOrderId}/complete.json`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  "X-Shopify-Access-Token": adminToken
                }
              });
              if (!completeRes.ok) {
                console.error("Failed to complete Shopify Draft Order:", await completeRes.text());
              }
            } catch (err) {
              console.error("Error completing Shopify Draft Order:", err);
            }
          }
        }
      }

      if (internalNotes !== undefined) {
        order.internalNotes = internalNotes;
      }

      if (courierPartner !== undefined) {
        order.courierPartner = courierPartner;
      }

      if (trackingNumber !== undefined) {
        order.trackingNumber = trackingNumber;
      }

      if (estimatedDelivery !== undefined) {
        order.estimatedDelivery = estimatedDelivery;
      }
    }

    db.orders[orderIndex] = order;
    saveDB(db);

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Update Order Error:", error);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}
