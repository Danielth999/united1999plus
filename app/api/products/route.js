import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import redis from "@/lib/redis";

const prisma = new PrismaClient();
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
    const url = new URL(req.url);
    const searchQuery = url.searchParams.get("search");

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
