// api/category/filter/[nameSlug].js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import redis from "@/lib/redis";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { nameSlug } = params;
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit"));
  const cacheKey = `category_${nameSlug}_${limit || "all"}`;

  try {
    // ตรวจสอบแคชใน Redis
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData), { status: 200 });
    }

    // ดึงข้อมูลจากฐานข้อมูล
    const category = await prisma.category.findFirst({
      where: { nameSlug },
      include: {
        Product: {
          where: {
            isPublished: true, // fetch product that is published only
          },
          ...(limit && { take: limit }), // Limit the number of products fetched if limit is provided
          orderBy: {
            createdAt: "desc",
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

    // เก็บข้อมูลในแคช
    await redis.set(cacheKey, JSON.stringify(category), "EX", 3600); // Cache for 1 hour

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
