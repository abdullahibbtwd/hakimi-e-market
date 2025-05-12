import { NextResponse,NextRequest } from "next/server";
import { db } from "@/lib/db";
import { v2 as cloudinaryV2 } from "cloudinary";
import {  getTokenFromRequest } from "@/utils/auth";

cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request:NextRequest){
 try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized - No token provided" },
        { status: 401 }
      );
    }


    const formData = await request.formData();
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const images = formData.getAll("images") as File[];

    if (
      !name ||
      !description ||
      !images.length
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const buffer = await image.arrayBuffer();
        const base64Image = Buffer.from(buffer).toString("base64");
        const dataURI = `data:${image.type};base64,${base64Image}`;

        const result = await cloudinaryV2.uploader.upload(dataURI, {
          folder: "products",
        });
        return result.secure_url;
      })
    );

    await db.banner.create({
      data: {
        name,
        description,
        imageUrl: imageUrls,
      },
    });

    return NextResponse.json(
      { message: "Product added successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST /api/products:", error);
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 }
    );
  }
}

