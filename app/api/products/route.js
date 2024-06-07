import { PrismaClient } from "@prisma/client";

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

import { Mutex } from "async-mutex";

const prisma = new PrismaClient();
const mutex = new Mutex();

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
};

export async function POST(req) {
  const release = await mutex.acquire();

  try {
    // รับข้อมูลจาก form data
    const formData = await req.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const categoryId = formData.get("categoryId");
    const image = formData.get("image");

    // ตรวจสอบว่าข้อมูลที่ส่งมาครบหรือไม่
    if (!name || !description || !price || !categoryId || !image) {
      console.error("Validation error: Missing required fields");
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    // ทำการbuffer รูปภาพและสร้างชื่อไฟล์ใหม่
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const fileName = `${uuidv4()}.png`;

    // อัพโหลดรูปภาพไปยัง Supabase Storage
    const uploadPromise = supabase.storage
      .from("products")
      .upload(fileName, imageBuffer, {
        contentType: "image/png",
      });
    const uploadResult = await uploadPromise;

    // ตรวจสอบว่าอัพโหลดรูปภาพสำเร็จหรือไม่
    if (uploadResult.error) {
      console.error("Error uploading image:", uploadResult.error);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }
    // ดึง URL ของรูปภาพที่อัพโหลดจาก Supabase Storage
    const productUrl = supabase.storage.from("products").getPublicUrl(fileName);

    // สร้างข้อมูลสินค้าใหม่ในฐานข้อมูล
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId: parseInt(categoryId, 10),
        imageUrl: productUrl.data.publicUrl,
      },
    });

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

export const dynamic = "force-dynamic";
