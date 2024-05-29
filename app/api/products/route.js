import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function DELETE(req, { params }) {
  const { id } = params;

  try {
    // Fetch the product to get the image URL
    const product = await prisma.product.findUnique({
      where: {
        productId: parseInt(id, 10),
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Delete the product
    await prisma.product.delete({
      where: {
        productId: parseInt(id, 10),
      },
    });

    // Delete the image file
    const imagePath = path.join(process.cwd(), 'public', product.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    return NextResponse.json({ message: 'Product and image deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product and image:', error);
    return NextResponse.json({ error: 'Failed to delete product and image' }, { status: 500 });
  }
}

export const segmentConfig = {
  runtime: 'nodejs',
};
