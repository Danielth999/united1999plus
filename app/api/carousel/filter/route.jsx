import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const carousel = await prisma.image.findMany({
      where: {
        isPublished: true,
      },
    });

    return NextResponse.json(carousel, { status: 200 });
  } catch (error) {
    console.error("Error fetching carousel:", error);
    return NextResponse.json(
      { message: "Error fetching carousel" },
      { status: 500 }
    );
  }
}
