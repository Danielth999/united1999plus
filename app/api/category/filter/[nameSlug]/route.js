// pages/api/category/filter/[nameSlug].js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import redis from '@/lib/redis'; // Import Redis client

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { nameSlug } = params;
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit"));

  const cacheKey = `category:${nameSlug}:limit:${limit || 'all'}`;

  try {
    // Check cache first
    const cachedCategory = await redis.get(cacheKey);
    if (cachedCategory) {
      return NextResponse.json(JSON.parse(cachedCategory), { status: 200 });
    }

    // If not found in cache, fetch from database
    const category = await prisma.category.findFirst({
      where: { nameSlug },
      include: {
        Product: {
          where: {
            isPublished: true,
          },
          take: limit || undefined,
          orderBy: {
            createdAt: limit ? "asc" : "desc",
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    // Save to cache with TTL (Time-To-Live) of 1 hour
    await redis.set(cacheKey, JSON.stringify(category), 'EX', 3600);

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
