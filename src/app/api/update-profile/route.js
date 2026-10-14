import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function PUT(request) {
  try {
    const client = await clientPromise;
    const { email, name, phone, image } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required to identify the user profile." },
        { status: 400 }
      );
    }

    const db = client.db("suncart");
    const usersCollection = db.collection("user");

    const updateFields = {};
    if (name !== undefined) updateFields.name = name;
    if (phone !== undefined) updateFields.phone = phone;
    if (image !== undefined) updateFields.image = image;

    const result = await usersCollection.updateOne(
      { email: email },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "User profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      modifiedCount: result.modifiedCount,
    });
  } catch (error) {
    console.error("Database Update Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server database error: " + error.message },
      { status: 500 }
    );
  }
}