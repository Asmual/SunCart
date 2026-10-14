import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import staticProducts from "@/data/products.json";

const defaultSeedProducts = staticProducts;

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    let products = [];

    try {
      const client = await clientPromise;
      const db = client.db("suncart");
      const collection = db.collection("products");

      // Auto-sync missing products to DB
      const count = await collection.countDocuments();
      if (count < defaultSeedProducts.length) {
        for (const p of defaultSeedProducts) {
          await collection.updateOne({ id: p.id }, { $set: p }, { upsert: true });
        }
      }
      // Ensure any legacy 404 URL in MongoDB is updated
      await collection.updateOne(
        { image: { $regex: "photo-1608248597359-5f21d3f9b2fa" } },
        { $set: { image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=600&q=80" } }
      );

      // Build MongoDB filter query
      const query = {};
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { brand: { $regex: search, $options: "i" } },
        ];
      }

      if (category && category !== "All") {
        query.category = { $regex: `^${category}$`, $options: "i" };
      }

      if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
      }

      // Build sort options
      let sortOption = { id: 1 };
      if (sort === "price-low") sortOption = { price: 1 };
      if (sort === "price-high") sortOption = { price: -1 };
      if (sort === "rating") sortOption = { rating: -1 };
      if (sort === "newest") sortOption = { _id: -1 };

      products = await collection.find(query).sort(sortOption).toArray();
    } catch (dbErr) {
      console.warn("MongoDB fetch error, falling back to local dataset:", dbErr.message);

      // In-memory fallback filter
      products = defaultSeedProducts.filter((p) => {
        const matchesSearch =
          !search ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.category.toLowerCase().includes(search.toLowerCase()) ||
          (p.brand && p.brand.toLowerCase().includes(search.toLowerCase()));
        const matchesCategory =
          !category || category === "All" || p.category.toLowerCase() === category.toLowerCase();
        const matchesMinPrice = !minPrice || p.price >= Number(minPrice);
        const matchesMaxPrice = !maxPrice || p.price <= Number(maxPrice);
        return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice;
      });

      if (sort === "price-low") products.sort((a, b) => a.price - b.price);
      if (sort === "price-high") products.sort((a, b) => b.price - a.price);
      if (sort === "rating") products.sort((a, b) => b.rating - a.rating);
    }

    return NextResponse.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, category, price, stock, image, description, brand } = body;

    if (!name || !price || !category) {
      return NextResponse.json(
        { success: false, error: "Name, price, and category are required." },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("suncart");
    const collection = db.collection("products");

    const newProduct = {
      id: Date.now(),
      name,
      category,
      price: Number(price),
      stock: Number(stock) || 20,
      rating: 4.8,
      image: image || "/images/sunglasses.jpg",
      description: description || "Fresh summer collection product.",
      brand: brand || "SunCart",
      createdAt: new Date(),
    };

    const result = await collection.insertOne(newProduct);

    return NextResponse.json({
      success: true,
      product: { ...newProduct, _id: result.insertedId },
    });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
