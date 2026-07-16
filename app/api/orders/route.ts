import { NextRequest, NextResponse } from "next/server";
import { getDB, saveDB, Order, OrderItem } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderNumber = searchParams.get("orderNumber");
  const identifier = searchParams.get("identifier"); // Email or Mobile

  const adminToken = process.env.SHOPIFY_ADMIN_ACCESS_TOKEN;
  const storeDomain = process.env.SHOPIFY_STORE_DOMAIN;

  if (orderNumber && identifier) {
    const cleanId = identifier.trim().toLowerCase();

    // 1. Try to locate the order in Shopify Admin Draft Orders first (Stateless/Serverless support)
    if (adminToken && storeDomain) {
      try {
        const queryUrl = `https://${storeDomain}/admin/api/2024-04/draft_orders.json?limit=20`;
        const res = await fetch(queryUrl, {
          headers: {
            "X-Shopify-Access-Token": adminToken
          }
        });

        if (res.ok) {
          const data = await res.json();
          const matchingDraft = data.draft_orders?.find((draft: any) => {
            const matchesTag = draft.tags && draft.tags.toUpperCase().includes(orderNumber.trim().toUpperCase());
            const matchesNote = draft.note && draft.note.toUpperCase().includes(orderNumber.trim().toUpperCase());
            const matchesName = draft.name && draft.name.toUpperCase() === orderNumber.trim().toUpperCase();

            if (matchesTag || matchesNote || matchesName) {
              const draftEmail = draft.customer?.email?.toLowerCase() || "";
              const draftPhone = draft.customer?.phone?.replace(/\s+/g, "") || "";
              const cleanIdentifier = cleanId.replace(/\s+/g, "");
              return draftEmail === cleanId || draftPhone === cleanIdentifier || draftPhone.includes(cleanIdentifier) || cleanIdentifier.includes(draftPhone);
            }
            return false;
          });

          if (matchingDraft) {
            let orderStatus = "Pending Payment";
            if (matchingDraft.status === "open") {
              orderStatus = "Payment Under Verification";
            }

            let courierPartner = "";
            let trackingNumber = "";
            let estimatedDelivery = "";

            if (matchingDraft.completed_at) {
              orderStatus = "Payment Verified";

              if (matchingDraft.order_id) {
                try {
                  const orderRes = await fetch(`https://${storeDomain}/admin/api/2024-04/orders/${matchingDraft.order_id}.json`, {
                    headers: { "X-Shopify-Access-Token": adminToken }
                  });
                  if (orderRes.ok) {
                    const orderData = await orderRes.json();
                    const shopifyOrder = orderData.order;

                    if (shopifyOrder.fulfillment_status === "fulfilled") {
                      orderStatus = "Delivered";
                      const fulfillment = shopifyOrder.fulfillments?.[0];
                      if (fulfillment) {
                        courierPartner = fulfillment.tracking_company || "";
                        trackingNumber = fulfillment.tracking_number || "";
                        orderStatus = "In Transit";
                      }
                    } else if (shopifyOrder.financial_status === "paid") {
                      orderStatus = "Preparing Order";
                    }
                  }
                } catch (e) {
                  console.error("Error fetching Shopify order details:", e);
                }
              }
            }

            const order: Order = {
              id: String(matchingDraft.id),
              orderNumber: orderNumber.trim(),
              status: orderStatus as any,
              customerName: matchingDraft.customer ? `${matchingDraft.customer.first_name} ${matchingDraft.customer.last_name || ""}`.trim() : "",
              email: matchingDraft.customer?.email || "",
              mobile: matchingDraft.customer?.phone || "",
              address: matchingDraft.shipping_address?.address1 || "",
              city: matchingDraft.shipping_address?.city || "",
              state: matchingDraft.shipping_address?.province || "",
              pincode: matchingDraft.shipping_address?.zip || "",
              items: matchingDraft.line_items.map((li: any) => ({
                title: li.title,
                quantity: li.quantity,
                price: parseFloat(li.price),
                image: "",
                variantTitle: li.variant_title || ""
              })),
              subtotal: parseFloat(matchingDraft.subtotal_price),
              shipping: matchingDraft.shipping_line ? parseFloat(matchingDraft.shipping_line.price) : 0,
              discount: parseFloat(matchingDraft.applied_discount?.amount || "0"),
              total: parseFloat(matchingDraft.total_price),
              createdAt: matchingDraft.created_at,
              courierPartner,
              trackingNumber,
              estimatedDelivery,
              statusHistory: [
                { status: "Pending Payment", timestamp: matchingDraft.created_at }
              ]
            };

            return NextResponse.json({ order });
          }
        }
      } catch (err) {
        console.error("Shopify search failed in GET /api/orders:", err);
      }
    }

    // 2. Fallback to local file database
    const db = getDB();
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
  const db = getDB();
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
      total,
      paymentMethod = "MANUAL"
    } = await request.json();

    if (!customerName || !email || !mobile || !address || !items || items.length === 0) {
      return NextResponse.json({ error: "Missing required shipping fields or items" }, { status: 400 });
    }

    const db = getDB();
    
    // Generate a unique randomized order number to prevent duplicates in stateless serverless environments
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `NK-${randomNum}`;

    const isCod = paymentMethod === "COD";
    const initialStatus = isCod ? "Preparing Order" : "Pending Payment";

    const newOrder: Order = {
      id: `ord_${Math.random().toString(36).substr(2, 9)}`,
      orderNumber,
      status: initialStatus,
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
      paymentMethod,
      createdAt: new Date().toISOString(),
      statusHistory: [
        { status: initialStatus, timestamp: new Date().toISOString() }
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
            note: isCod ? "Cash on Delivery (COD) Order. Pay on delivery." : "Manual UPI Payment Order. UTR verification required.",
            tags: isCod ? `manual-checkout, COD, ${orderNumber}` : `manual-checkout, ${orderNumber}`
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
            const draftId = shopifyData.draft_order.id;
            newOrder.shopifyDraftOrderId = String(draftId);
            newOrder.shopifyDraftOrderName = String(shopifyData.draft_order.name);

            // If COD, complete the draft order immediately as pending payment (unpaid)
            if (isCod) {
              try {
                const completeRes = await fetch(`https://${storeDomain}/admin/api/2024-04/draft_orders/${draftId}/complete.json?payment_pending=true`, {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": adminToken
                  }
                });
                if (completeRes.ok) {
                  const completeData = await completeRes.json();
                  if (completeData.draft_order && completeData.draft_order.order_id) {
                    newOrder.shopifyOrderId = String(completeData.draft_order.order_id);
                  }
                } else {
                  console.error("Failed to complete COD draft order:", await completeRes.text());
                }
              } catch (completeErr) {
                console.error("Error completing COD draft order:", completeErr);
              }
            }
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
