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
    const categories = await prisma.category.findMany({
      include: {
        Product: true,
      },
      orderBy: {
        categoryId: "asc",
      },
    });

    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};

export const POST = async (req) => {
  const release = await mutex.acquire();

  try {
    // รับข้อมูลจาก form data
    const formData = await req.formData();
    const name = formData.get("name");
    const nameSlug = formData.get("nameSlug");
    const image = formData.get("cateImg");

    // ตรวจสอบว่าข้อมูลที่ส่งมาครบหรือไม่
    if (!name || !nameSlug || !image) {
      console.error("Validation error: Missing required fields");
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // ทำการ buffer รูปภาพและสร้างชื่อไฟล์ใหม่
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const fileName = `${uuidv4()}.png`;

    // อัพโหลดรูปภาพไปยัง Supabase Storage
    const uploadResult = await supabase.storage
      .from("categories")
      .upload(fileName, imageBuffer, {
        contentType: "image/png",
      });

    // ตรวจสอบว่าอัพโหลดรูปภาพสำเร็จหรือไม่
    if (uploadResult.error) {
      console.error("Error uploading image:", uploadResult.error);
      return NextResponse.json(
        { error: "Failed to upload image" },
        { status: 500 }
      );
    }

    // ดึง URL ของรูปภาพที่อัพโหลดจาก Supabase Storage
    const imageUrl = supabase.storage.from("categories").getPublicUrl(fileName);

    // สร้างข้อมูลหมวดหมู่ใหม่ในฐานข้อมูล
    const category = await prisma.category.create({
      data: {
        name,
        nameSlug,
        cateImg: imageUrl.data.publicUrl,
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  } finally {
    release();
    await prisma.$disconnect();
  }
};
