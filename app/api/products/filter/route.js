import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const searchQuery = req.nextUrl.searchParams.get("search");

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
