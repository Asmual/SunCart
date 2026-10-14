import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json({ success: false, error: "No image file provided." }, { status: 400 });
    }

    const apiKey = process.env.IMGBB_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "IMGBB_API_KEY is not configured on the server." },
        { status: 500 }
      );
    }

    // Forward upload to ImgBB
    const imgbbForm = new FormData();
    imgbbForm.append("image", file);

    const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
      method: "POST",
      body: imgbbForm,
    });

    const data = await res.json();

    if (data.success) {
      return NextResponse.json({
        success: true,
        url: data.data.url,
        display_url: data.data.display_url,
      });
    }

    return NextResponse.json(
      { success: false, error: data?.error?.message || "ImgBB upload failed" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
