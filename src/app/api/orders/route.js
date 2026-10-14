import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      customer,
      items,
      paymentMethod,
      subtotal,
      shippingFee,
      discount = 0,
      totalAmount,
    } = body;

    if (!customer?.name || !customer?.phone || !customer?.address) {
      return NextResponse.json(
        { success: false, error: "Customer name, phone, and delivery address are required." },
        { status: 400 }
      );
    }

    if (!items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Order items cannot be empty." },
        { status: 400 }
      );
    }

    // Generate unique order ID like SC-58392
    const orderId = `SC-${Math.floor(10000 + Math.random() * 90000)}`;

    const newOrder = {
      orderId,
      customer: {
        name: customer.name,
        email: customer.email || "guest@suncart.com",
        phone: customer.phone,
        address: customer.address,
        city: customer.city || "Dhaka",
        district: customer.district || "Dhaka",
        notes: customer.notes || "",
      },
      items,
      paymentMethod: paymentMethod || "Cash on Delivery",
      paymentStatus: paymentMethod === "Cash on Delivery" ? "Unpaid (COD)" : "Paid / Pending Verification",
      subtotal: Number(subtotal),
      shippingFee: Number(shippingFee),
      discount: Number(discount),
      totalAmount: Number(totalAmount),
      status: "Pending",
      createdAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toDateString(),
    };

    try {
      const client = await clientPromise;
      const db = client.db("suncart");

      // Save order
      await db.collection("orders").insertOne(newOrder);

      // Decrement stock in products collection
      for (const item of items) {
        try {
          await db.collection("products").updateOne(
            { $or: [{ id: Number(item.id) || -1 }, { id: item.id }] },
            { $inc: { stock: -(Number(item.quantity) || 1) } }
          );
        } catch (stockErr) {
          console.warn("Stock decrement warning for item", item.id, stockErr.message);
        }
      }
    } catch (dbErr) {
      console.warn("MongoDB order save warning, returning generated receipt:", dbErr.message);
    }

    return NextResponse.json({
      success: true,
      orderId,
      order: newOrder,
    });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    const client = await clientPromise;
    const db = client.db("suncart");

    const query = email ? { "customer.email": email } : {};
    const orders = await db
      .collection("orders")
      .find(query)
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
