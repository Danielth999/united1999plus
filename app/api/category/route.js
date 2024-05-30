import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import translate from "@vitalets/google-translate-api";
import slugify from "slugify";

const prisma = new PrismaClient();

export const GET = async () => {
  try {
    const categories = await prisma.category.findMany({
   
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
};

export const POST = async (request) => {
  try {
    const { name, nameSlug } = await request.json(); // รับค่า name และ cateImg จาก request

    const newCategory = await prisma.category.create({
      data: {
        name,
        nameSlug,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error adding category:", error);
    return NextResponse.json(
      { error: "Failed to add category" },
      { status: 500 }
    );
  }
};
