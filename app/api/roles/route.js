import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async (request) => {
  try {
    // ดึงข้อมูล role ทั้งหมด
    const roles = await prisma.role.findMany();

    return Response.json(roles);
  } catch (error) {
    console.error("Error fetching roles:", error);
    return new Response.json(
      { error: "Failed to fetch data" },
      {
        status: 500,
      }
    );
  }
};
