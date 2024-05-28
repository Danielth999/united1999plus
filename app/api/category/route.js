import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async (request) => {
  try {
    // ดึงข้อมูล category พร้อมกับ subcategory ที่เกี่ยวข้อง
    const categories = await prisma.category.findMany({
      include: {
        subcategories: true,
      },
    });

    return Response.json(categories);
  } catch (error) {
    return new Response.json(
      { error: "Failed to fetch data" },
      {
        status: 500,
      }
    );
  }
};
