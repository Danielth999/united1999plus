import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { Mutex } from "async-mutex";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import redis from "@/lib/redis";
const prisma = new PrismaClient();
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const mutex = new Mutex();

export async function DELETE(request, { params }) {
  const release = await mutex.acquire();

  try {
    const { id } = params;
    const imageId = parseInt(id, 10);

    if (isNaN(imageId)) {
      return NextResponse.json({ error: "Invalid image ID" }, { status: 400 });
    }

    const image = await prisma.image.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    await prisma.image.delete({
      where: { id: imageId },
    });

    if (image.url) {
      const fileName = path.basename(image.url);
      const { error } = await supabase.storage
        .from("images")
        .remove([fileName]);

      if (error) {
        console.error("Error deleting image from Supabase:", error);
        return NextResponse.json(
          { error: "Failed to delete image from storage" },
          { status: 500 }
        );
      }
    }
    await redis.del('carousel_images');
    return NextResponse.json(
      { message: "Image deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  } finally {
    release();
    await prisma.$disconnect();
  }
}

export async function PATCH(request, { params }) {
  const release = await mutex.acquire();

  try {
    const { id } = params;
    const imageId = parseInt(id, 10);
    const { isPublished } = await request.json();

    if (isNaN(imageId)) {
      return NextResponse.json({ error: "Invalid image ID" }, { status: 400 });
    }

    const image = await prisma.image.findUnique({
      where: { id: imageId },
    });

    if (!image) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }

    const updatedImage = await prisma.image.update({
      where: { id: imageId },
      data: { isPublished },
    });

    return NextResponse.json(updatedImage, { status: 200 });
  } catch (error) {
    console.error("Error updating image:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    );
  } finally {
    release();
    await prisma.$disconnect();
  }
}
