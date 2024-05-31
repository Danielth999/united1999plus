import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";

const prisma = new PrismaClient();

export const GET = async (req) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        Category: true,
      },
    });
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  }
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const categoryId = formData.get("categoryId");
    const image = formData.get("image");

    if (!name || !description || !price || !categoryId || !image) {
      console.error("Validation error: Missing required fields");
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Convert image to buffer
    const imageBuffer = Buffer.from(await image.arrayBuffer());

    // Upload image to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(imageBuffer);
    });

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId: parseInt(categoryId, 10),
        imageUrl: uploadResult.secure_url,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
