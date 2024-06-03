import { PrismaClient } from "@prisma/client";
import cloudinary from "@/lib/cloudinary";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
const prisma = new PrismaClient();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const GET = async (req) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        Category: true,
      },
    });

    // ตรวจสอบว่าผลลัพธ์เป็นอาเรย์หรือไม่
    if (Array.isArray(products)) {
      return NextResponse.json(products, { status: 200 });
    } else {
      console.error("Expected an array but received", products);
      return NextResponse.json(
        { message: "Error fetching products" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
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

    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const compressedImageBuffer = await sharp(imageBuffer)
      .resize(800, 600) // Resize image to 800x600
      .png({ quality: 80 }) // Compress image with quality of 80
      .toBuffer();
    const fileName = `${uuidv4()}.png`;

    const { data, error } = await supabase.storage
      .from("products")
      .upload(fileName, compressedImageBuffer, {
        contentType: "image/png",
      });

    if (error) {
      console.error("Error uploading image:", error);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    const productUrl = supabase.storage.from("products").getPublicUrl(fileName);

    const products = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId: parseInt(categoryId, 10),
        imageUrl: productUrl.data.publicUrl,
      },
    });

    return NextResponse.json(products, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export const dynamic = "force-dynamic";
