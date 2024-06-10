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

const CACHE_EXPIRATION = 60 * 30; // 5 minutes

// ฟังก์ชันสำหรับดึงข้อมูลจาก cache หรือเรียกใช้ callback เพื่อดึงข้อมูลใหม่
async function getOrSetCache(key, cb) {
  const cachedData = await redis.get(key); // ตรวจสอบว่ามีข้อมูลใน cache หรือไม่
  if (cachedData) {
    try {
      return JSON.parse(cachedData); // ถ้ามีข้อมูลใน cache ให้คืนค่าข้อมูลนั้น
    } catch (error) {
      console.error('Error parsing cached data:', error);
      // ถ้ามีข้อผิดพลาดในการแปลง JSON แสดงว่า cache อาจมีปัญหา
      await redis.del(key); // ลบข้อมูลใน cache ที่ไม่ถูกต้อง
    }
  }

  const freshData = await cb(); // ถ้าไม่มีข้อมูลใน cache ให้เรียกใช้ callback เพื่อดึงข้อมูลใหม่
  await redis.set(key, JSON.stringify(freshData), 'EX', CACHE_EXPIRATION); // เก็บข้อมูลใหม่ลงใน cache พร้อมตั้งเวลาหมดอายุ
  return freshData; // คืนค่าข้อมูลใหม่
}

export const GET = async (req) => {
  try {
    const products = await getOrSetCache("products", async () => {
      return await prisma.product.findMany({
        include: {
          Category: true,
        },
      });
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
    const formData = await req.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const stock = formData.get("stock");
    const color = formData.get("color");
    const size = formData.get("size");
    const isPublished = formData.get("isPublished") === "true"; // รับค่าเป็น boolean
    const categoryId = formData.get("categoryId");
    const image = formData.get("image");

    if (
      !name ||
      !description ||
      !price ||
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

    // บีบอัดรูปภาพและแปลงเป็น .webp
    const buffer = await sharp(await image.arrayBuffer())
      .resize({ width: 800 }) // ปรับขนาดรูปภาพ
      .webp() // แปลงเป็น .webp
      .toBuffer();

    const { error: uploadError } = await supabase.storage
      .from("products")
      .upload(fileName, buffer, {
        contentType: "image/webp",
      });

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
        price: parseFloat(price),
        stock,
        color,
        size,
        isPublished,
        categoryId: parseInt(categoryId, 10),
        imageUrl: productUrl.data.publicUrl,
      },
    });

    // เคลียร์ cache หลังจากสร้างผลิตภัณฑ์ใหม่
    await redis.del("products");

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
