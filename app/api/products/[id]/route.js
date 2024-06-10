import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { Mutex } from "async-mutex";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import redis from "@/lib/redis";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

const prisma = new PrismaClient();
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const mutex = new Mutex();
const CACHE_EXPIRATION = 60 * 30; // 30 minutes

// Helper function to get or set cache
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

export async function GET(request, { params }) {
  const { nameSlug } = params;

  try {
    const category = await getOrSetCache(`category:${nameSlug}`, async () => {
      return await prisma.category.findFirst({
        where: { nameSlug },
        include: {
          Product: true,
        },
      });
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export const PUT = async (request, { params }) => {
  const release = await mutex.acquire();

  try {
    const { id } = params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const contentType = request.headers.get("Content-Type");

    if (contentType.startsWith("application/json")) {
      const { isPublished } = await request.json();
      const updatedProduct = await prisma.product.update({
        where: { productId },
        data: { isPublished },
      });

      // Clear cache after updating the product
      await redis.del("products");

      return NextResponse.json(updatedProduct, { status: 200 });
    } else if (contentType.startsWith("multipart/form-data")) {
      const formData = await request.formData();
      const name = formData.get("name");
      const description = formData.get("description");
      const price = parseFloat(formData.get("price"));
      const stock = parseInt(formData.get("stock"), 10);
      const color = formData.get("color");
      const size = formData.get("size");
      const categoryId = parseInt(formData.get("categoryId"), 10);
      const image = formData.get("image");

      const updateData = {
        name,
        description,
        price,
        stock,
        color,
        size,
        categoryId,
      };

      if (image && image.name) {
        const imageBuffer = Buffer.from(await image.arrayBuffer());
        const fileName = `${uuidv4()}.webp`;

        const buffer = await sharp(imageBuffer)
          .resize({ width: 800 }) // Resize image
          .webp() // Convert to webp
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

        updateData.imageUrl = supabase.storage.from("products").getPublicUrl(fileName).data.publicUrl;

        const oldProduct = await prisma.product.findUnique({
          where: { productId },
        });

        if (oldProduct && oldProduct.imageUrl) {
          const oldFileName = path.basename(oldProduct.imageUrl);
          const { error: deleteError } = await supabase.storage
            .from("products")
            .remove([oldFileName]);

          if (deleteError) {
            console.error("Error deleting old image from Supabase:", deleteError);
          }
        }
      }

      const updatedProduct = await prisma.product.update({
        where: { productId },
        data: updateData,
      });

      // Clear cache after updating the product
      await redis.del("products");

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
};

export const DELETE = async (request, { params }) => {
  const release = await mutex.acquire();

  try {
    const { id } = params;
    const productId = parseInt(id, 10);

    if (isNaN(productId)) {
      return NextResponse.json({ error: "Invalid product ID" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
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

    // Clear cache after deleting the product
    await redis.del("products");

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
};
