import { PrismaClient } from "@prisma/client";
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export const DELETE = async (req, { params }) => {
  const { id } = params;

  try {
    const product = await prisma.product.findUnique({
      where: { productId: parseInt(id, 10) },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    await prisma.product.delete({
      where: { productId: parseInt(id, 10) },
    });

    const imagePath = path.join(process.cwd(), 'public', product.imageUrl);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
};

export const PUT = async (req, { params }) => {
  const { id } = params;

  try {
    const formData = await req.formData();
    const name = formData.get('name');
    const description = formData.get('description');
    const price = formData.get('price');
    const stock = formData.get('stock');
    const image = formData.get('image');

    const updateData = {
      name,
      description,
      price: parseFloat(price),
      stock: parseInt(stock, 10),
      subcategoryId: parseInt(formData.get('subcategoryId'), 10),
    };

    if (image && image.name) {
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      const imagePath = path.join(process.cwd(), 'public', 'uploads', Date.now() + path.extname(image.name));
      fs.writeFileSync(imagePath, imageBuffer);
      updateData.imageUrl = `/uploads/${path.basename(imagePath)}`;

      const oldProduct = await prisma.product.findUnique({
        where: { productId: parseInt(id, 10) },
      });
      if (oldProduct && oldProduct.imageUrl) {
        const oldImagePath = path.join(process.cwd(), 'public', oldProduct.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { productId: parseInt(id, 10) },
      data: updateData,
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
};
     