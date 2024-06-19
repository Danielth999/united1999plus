import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { Mutex } from "async-mutex";
import sharp from "sharp";
import redis from "@/lib/redis";
const prisma = new PrismaClient();
const mutex = new Mutex();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

export const runtime = "edge"
// GET all products with optional search query
export async function GET(req) {
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
  } finally {
    await prisma.$disconnect();
  }
}

// POST a new product
export async function POST(req) {
  const release = await mutex.acquire();

  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const description = formData.get("description");

    const stock = formData.get("stock");
    const color = formData.get("color");
    const size = formData.get("size");

    const isPublished = formData.get("isPublished") === "true";
    const categoryId = formData.get("categoryId");
    const image = formData.get("image");

    if (
      !name ||
      !description ||
      !stock ||
      !color ||
      !size ||
      !categoryId ||
      !image
    ) {
      console.error("Validation error: Missing required fields");
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const fileName = `${uuidv4()}.webp`;

    const buffer = await sharp(await image.arrayBuffer())
      .resize({ width: 800 })
      .webp()
      .toBuffer();

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, buffer, { contentType: "image/webp" });

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    const productUrl = supabase.storage.from("products").getPublicUrl(fileName);

    const product = await prisma.product.create({
      data: {
        name,
        description,
        stock,
        color,
        size,
        isPublished,
        categoryId: parseInt(categoryId, 10),
        imageUrl: productUrl.data.publicUrl,
      },
    });
    // ลบ cache keys ที่เกี่ยวข้องกับ category
    const keys = await redis.keys("category:*");
    console.log("Keys to be deleted:", keys); // แสดง keys ที่จะถูกลบ โดยการ console.log
    if (keys.length > 0) {
      await redis.del(keys);
    }
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  } finally {
    release();
    await prisma.$disconnect();
  }
}
