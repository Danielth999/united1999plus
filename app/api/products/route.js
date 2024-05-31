import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export const GET = async (req) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        Category: true,
      },
    });
    return NextResponse.json(products , { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { message: "Error fetching products" },
      { status: 500 }
    );
  }
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const categoryId = formData.get("categoryId");
    const image = formData.get("image");
    console.log({ name, description, price, categoryId, image });
    if (
      !name ||
      !description ||
      !price ||
      !categoryId ||
      !image ||
      !image.name
    ) {
      console.error("Validation error: Missing required fields");
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const imagePath = path.join(
      process.cwd(),
      "public",
      "uploads",
      Date.now() + path.extname(image.name)
    );

    try {
      fs.writeFileSync(imagePath, imageBuffer);
    } catch (writeError) {
      console.error("Error writing image:", writeError);
      return NextResponse.json(
        { error: "Failed to save image" },
        { status: 500 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        categoryId: parseInt(categoryId, 10),
        imageUrl: `/uploads/${path.basename(imagePath)}`,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
