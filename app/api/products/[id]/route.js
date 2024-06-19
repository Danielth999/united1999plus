import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { Mutex } from "async-mutex";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
import redis from "@/lib/redis";

const prisma = new PrismaClient();
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const mutex = new Mutex();

export const runtime = "edge"
export async function GET(request, { params }) {
  const { id } = params;

  try {
    // สร้าง cache โดยใช้ key ชื่อ product:${id}
    const cachedProduct = await redis.get(`productId:${id}`);
    // ถ้ามี cahce  ให้ return ข้อมูลจาก cache ออกไป โดยการแปลงจาก json เป็น javascript object
    if (cachedProduct) {
      return NextResponse.json(JSON.parse(cachedProduct), { status: 200 });
    }

    // ถ้าไม่มี cache ให้ดึงข้อมูลจาก database และเก็บลงใน cache
    const product = await prisma.product.findUnique({
      where: { productId: parseInt(id, 10) },
      include: { Category: true },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    // Set cache for 1 hour (3600 seconds)
    await redis.set(`product:${id}`, JSON.stringify(product), "ex", 3600);

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function PUT(request, { params }) {
  const release = await mutex.acquire();

  try {
    const { id } = params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const contentType = request.headers.get("Content-Type");

    if (contentType.startsWith("application/json")) {
      const { isPublished } = await request.json();
      const updatedProduct = await prisma.product.update({
        where: { productId },
        data: { isPublished },
      });
      await redis.del(`product:${id}`);
      return NextResponse.json(updatedProduct, { status: 200 });
    } else if (contentType.startsWith("multipart/form-data")) {
      const formData = await request.formData();
      const name = formData.get("name");
      const description = formData.get("description");
      const stock = formData.get("stock");
      const color = formData.get("color");
      const size = formData.get("size");
      const categoryId = parseInt(formData.get("categoryId"), 10);
      const image = formData.get("image");

      const updateData = {
        name,
        description,
        stock,
        color,
        size,
        categoryId,
      };

      if (image && image.name) {
        const imageBuffer = Buffer.from(await image.arrayBuffer());
        const fileName = `${uuidv4()}.webp`;

        const buffer = await sharp(imageBuffer)
          .resize({ width: 800 })
          .webp()
          .toBuffer();

        const { data, error: uploadError } = await supabase.storage
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

        updateData.imageUrl = supabase.storage
          .from("products")
          .getPublicUrl(fileName).data.publicUrl;

        const oldProduct = await prisma.product.findUnique({
          where: { productId },
        });

        if (oldProduct && oldProduct.imageUrl) {
          const oldFileName = path.basename(oldProduct.imageUrl);
          const { error: deleteError } = await supabase.storage
            .from("products")
            .remove([oldFileName]);

          if (deleteError) {
            console.error(
              "Error deleting old image from Supabase:",
              deleteError
            );
          }
        }
      }

      const updatedProduct = await prisma.product.update({
        where: { productId },
        data: updateData,
      });

      const keys = await redis.keys("category:*");
      console.log("Keys to be deleted:", keys); // แสดง keys ที่จะถูกลบ โดยการ console.log
      if (keys.length > 0) {
        await redis.del(keys);
      }
      await redis.del(`product:${id}`);
      return NextResponse.json(updatedProduct, { status: 200 });
    } else {
      return NextResponse.json(
        { error: "Unsupported Content-Type" },
        { status: 415 }
      );
    }
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  } finally {
    release();
    await prisma.$disconnect();
  }
}

export async function DELETE(request, { params }) {
  const release = await mutex.acquire();

  try {
    const { id } = params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const product = await prisma.product.findUnique({
      where: { productId },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({
      where: { productId },
    });

    if (product.imageUrl) {
      const fileName = path.basename(product.imageUrl);
      const { error } = await supabase.storage
        .from("products")
        .remove([fileName]);

      if (error) {
        console.error("Error deleting image from Supabase:", error);
        return NextResponse.json(
          { error: "Failed to delete image from storage" },
          { status: 500 }
        );
      }
    }
    const keys = await redis.keys("category:*");
    console.log("Keys to be deleted:", keys); // แสดง keys ที่จะถูกลบ โดยการ console.log
    if (keys.length > 0) {
      await redis.del(keys);
    }
    await redis.del(`product:${id}`);
    return NextResponse.json(
      { message: "Product and image deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);

    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  } finally {
    release();
    await prisma.$disconnect();
  }
}
