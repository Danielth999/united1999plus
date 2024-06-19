import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import { Mutex } from "async-mutex";
import redis from "@/lib/redis";
const prisma = new PrismaClient();
const mutex = new Mutex();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Missing Supabase environment variables");
}

export async function GET() {
  try {
    const images = await prisma.image.findMany();
    return NextResponse.json(images, { status: 200 });
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json(
      { message: "Error fetching images" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const release = await mutex.acquire();

  try {
    const formData = await req.formData();
    const images = formData.getAll("images");

    if (!images || images.length === 0) {
      console.error("Validation error: Missing images");
      return NextResponse.json(
        { error: "Images are required" },
        { status: 400 }
      );
    }

    const uploadResults = await Promise.all(
      images.map(async (image) => {
        const fileName = `${uuidv4()}-${image.name}`;
        const { error: uploadError } = await supabase.storage
          .from("images")
          .upload(fileName, image);

        if (uploadError) {
          throw new Error(`Error uploading image: ${uploadError.message}`);
        }

        const { publicUrl } = supabase.storage
          .from("images")
          .getPublicUrl(fileName).data;
        return publicUrl;
      })
    );

    const newImages = await prisma.image.createMany({
      data: uploadResults.map((url) => ({ url })),
    });
    await redis.del("carousel_images");
    return NextResponse.json(newImages, { status: 201 });
  } catch (error) {
    console.error("Error creating images:", error);
    return NextResponse.json(
      { error: "Failed to create images" },
      { status: 500 }
    );
  } finally {
    release();
  }
}
