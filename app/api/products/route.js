import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export const GET = async (req) => {
  try {
    const products = await prisma.product.findMany();
    return NextResponse.json(
      { products },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching products" },
      {
        status: 500,
      }
    );
  }
};

export async function POST(req) {
  try {
    const formData = await req.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const price = formData.get('price');
    const stock = formData.get('stock');
    const subcategoryId = formData.get('subcategoryId');
    const image = formData.get('image');

    if (!image || !image.name) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const imagePath = path.join(process.cwd(), 'public', 'uploads', Date.now() + path.extname(image.name));

    fs.writeFileSync(imagePath, imageBuffer);

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        stock: parseInt(stock, 10),
        subcategoryId: parseInt(subcategoryId, 10),
        imageUrl: `/uploads/${path.basename(imagePath)}`,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
