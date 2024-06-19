import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import redis from "@/lib/redis"; // Assuming you have Redis client setup correctly

const prisma = new PrismaClient();

export const config = {
  runtime: "edge",
};
export async function GET(req) {
  try {
    const searchQuery = req.nextUrl.searchParams.get("search");

    // Generate a cache key based on the search query
    const cacheKey = `products:search:${searchQuery || "all"}`;

    // Check if the result is already cached
    const cachedProducts = await redis.get(cacheKey);
    if (cachedProducts) {
      return NextResponse.json(JSON.parse(cachedProducts), { status: 200 });
    }

    const where = {
      isPublished: true,
      OR: searchQuery
        ? [{ name: { contains: searchQuery, mode: "insensitive" } }]
        : undefined,
    };

    if (!where.OR) {
      delete where.OR;
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        Category: true,
      },
    });

    // Set cache for 1 hour (3600 seconds)
    await redis.set(cacheKey, JSON.stringify(products), "ex", 3600);

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
