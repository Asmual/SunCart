import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import staticProducts from "@/data/products.json";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    try {
      const client = await clientPromise;
      const db = client.db("suncart");
      const collection = db.collection("products");

      // Query by numeric id or string id
      const product = await collection.findOne({
        $or: [{ id: Number(id) || -1 }, { id: id }],
      });

      if (product) {
        return NextResponse.json({ success: true, product });
      }
    } catch (dbErr) {
      console.warn("MongoDB single product lookup error, checking static:", dbErr.message);
    }

    const staticFound = staticProducts.find((p) => String(p.id) === String(id));
    if (staticFound) {
      return NextResponse.json({ success: true, product: staticFound });
    }

    return NextResponse.json({ success: false, error: "Product not found" }, { status: 404 });
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
