

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { Mutex } from "async-mutex";
import path from "path";

const prisma = new PrismaClient();
const mutex = new Mutex();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);


export const GET = async (req, { params }) => {
  const { id } = params;
  try {
    const product = await prisma.product.findUnique({
      where: { productId: parseInt(id, 10) },
      include: {
        Category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
};

export const DELETE = async (req, { params }) => {
  const { id } = params;

  try {
    const product = await prisma.product.findUnique({
      where: { productId: parseInt(id, 10) },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    await prisma.product.delete({
      where: { productId: parseInt(id, 10) },
    });

    const fileName = path.basename(product.imageUrl);
    const { error } = await supabase.storage
      .from("products")
      .remove([fileName]);

    if (error) {
      console.error("Error deleting image from Supabase:", error);
      return NextResponse.json(
        { error: "Failed to delete image from storage" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Product and image deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
};

export const PUT = async (req, { params }) => {
  const { id } = params;
  const release = await mutex.acquire();

  try {
    const formData = await req.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const price = formData.get("price");
    const categoryId = formData.get("categoryId");
    const image = formData.get("image");

    const updateData = {
      name,
      description,
      price: parseFloat(price),
      categoryId: parseInt(categoryId, 10),
    };

    if (image && image.name) {
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      const fileName = `${uuidv4()}.png`;

      const { data, error: uploadError } = await supabase.storage
        .from("products")
        .upload(fileName, imageBuffer, {
          contentType: "image/png",
        });

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        return NextResponse.json(
          { error: "Failed to upload image" },
          { status: 500 }
        );
      }

      updateData.imageUrl = supabase.storage.from("products").getPublicUrl(fileName).data.publicUrl;

      const oldProduct = await prisma.product.findUnique({
        where: { productId: parseInt(id, 10) },
      });

      if (oldProduct && oldProduct.imageUrl) {
        const oldFileName = path.basename(oldProduct.imageUrl);
        const { error: deleteError } = await supabase.storage
          .from("products")
          .remove([oldFileName]);

        if (deleteError) {
          console.error("Error deleting old image from Supabase:", deleteError);
        }
      }
    }

    const updatedProduct = await prisma.product.update({
      where: { productId: parseInt(id, 10) },
      data: updateData,
    });

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  } finally {
    release();
    await prisma.$disconnect();
  }
};
