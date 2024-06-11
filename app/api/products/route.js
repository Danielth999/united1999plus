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

const CACHE_EXPIRATION = 60 * 30; // 30 minutes

async function getOrSetCache(key, cb) {
  const cachedData = await redis.get(key);
  if (cachedData) {
    try {
      return JSON.parse(cachedData);
    } catch (error) {
      console.error("Error parsing cached data:", error);
      await redis.del(key);
    }
  }

  const freshData = await cb();
  await redis.set(key, JSON.stringify(freshData), "EX", CACHE_EXPIRATION);
  return freshData;
}

export async function GET(req) {
  try {
    const searchQuery = req.nextUrl.searchParams.get("search");

    const products = await getOrSetCache(
      `products_${searchQuery}`,
      async () => {
        const where = searchQuery
          ? {
              OR: [{ name: { contains: searchQuery, mode: "insensitive" } }],
            }
          : {};

        return await prisma.product.findMany({
          where,
          include: {
            Category: true,
          },
        });
      }
    );

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
    const unitType = formData.get("unitType");
    const isPublished = formData.get("isPublished") === "true";
    const categoryId = formData.get("categoryId");
    const image = formData.get("image");

    if (
      !name ||
      !description ||
      !price ||
      !stock ||
      !color ||
      !size ||
      !unitType ||
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
        unitType,
        isPublished,
        categoryId: parseInt(categoryId, 10),
        imageUrl: productUrl.data.publicUrl,
      },
    });

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
