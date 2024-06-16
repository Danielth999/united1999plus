// api/category/filter/[nameSlug].js

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request, { params }) {
  const { nameSlug } = params;
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get("limit"));

  try {
    // ทำการเช็กว่ามีการส่ง limit มาหรือไม่ ถ้ามีให้ทำตามเงื่อนไขด้านล่าง
    if (limit) {
      const category = await prisma.category.findFirst({
        where: { nameSlug },
        include: {
          Product: {
            where: {
              isPublished: true, // fetch product that is published only
            },
            take: limit, // Limit the number of products fetched
            orderBy: {
              createdAt: "asc", //
            },
          },
        },
      });
      return NextResponse.json(category, { status: 200 });
    }
    // ถ้าไม่มีการส่ง limit มาให้ทำตามเงื่อนไขด้านล่างเพื่อดึงข้อมูลทั้งหมด
    const category = await prisma.category.findFirst({
      where: { nameSlug },
      include: {
        Product: {
          where: {
            isPublished: true, // fetch product that is published only
          },
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
