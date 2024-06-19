// pages/api/carousel.js
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import redis from "@/lib/redis";

const prisma = new PrismaClient();

export const config = {
  runtime: "edge",
};
export async function GET(req) {
  try {
    const cacheKey = "carousel_images";
    const cachedData = await redis.get(cacheKey);

    if (cachedData) {
      return NextResponse.json(JSON.parse(cachedData), { status: 200 });
    }

    const carousel = await prisma.image.findMany({
      where: {
        isPublished: true,
      },
    });

    await redis.set(cacheKey, JSON.stringify(carousel), "EX", 3600); // Cache for 1 hour

    return NextResponse.json(carousel, { status: 200 });
  } catch (error) {
    console.error("Error fetching carousel:", error);
    return NextResponse.json(
      { message: "Error fetching carousel" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
