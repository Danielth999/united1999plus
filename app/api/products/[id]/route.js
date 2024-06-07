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

export const PUT = async (request, { params }) => {
  const release = await mutex.acquire();

  try {
    const { id } = params;
    const formData = await request.formData();
    const name = formData.get("name");
    const nameSlug = formData.get("nameSlug");
    const image = formData.get("cateImg");

    const updateData = {
      name,
      nameSlug,
    };

    if (image && image.name) {
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      const fileName = `${uuidv4()}.png`;

      const { data, error: uploadError } = await supabase.storage
        .from("categories")
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

      updateData.cateImg = supabase.storage.from("categories").getPublicUrl(fileName).data.publicUrl;

      const oldCategory = await prisma.category.findUnique({
        where: { categoryId: parseInt(id, 10) },
      });

      if (oldCategory && oldCategory.cateImg) {
        const oldFileName = path.basename(oldCategory.cateImg);
        const { error: deleteError } = await supabase.storage
          .from("categories")
          .remove([oldFileName]);

        if (deleteError) {
          console.error("Error deleting old image from Supabase:", deleteError);
        }
      }
    }

    const updatedCategory = await prisma.category.update({
      where: { categoryId: parseInt(id, 10) },
      data: updateData,
    });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  } finally {
    release();
    await prisma.$disconnect();
  }
};

export const DELETE = async (request, { params }) => {
  const release = await mutex.acquire();

  try {
    const { id } = params;

    const category = await prisma.category.findUnique({
      where: { categoryId: parseInt(id, 10) },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    await prisma.category.delete({
      where: { categoryId: parseInt(id, 10) },
    });

    if (category.cateImg) {
      const fileName = path.basename(category.cateImg);
      const { error } = await supabase.storage
        .from("categories")
        .remove([fileName]);

      if (error) {
        console.error("Error deleting image from Supabase:", error);
        return NextResponse.json(
          { error: "Failed to delete image from storage" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { message: "Category and image deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  } finally {
    release();
    await prisma.$disconnect();
  }
};
