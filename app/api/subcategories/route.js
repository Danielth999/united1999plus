import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async (req) => {
  try {
    const subcategories = await prisma.subcategory.findMany();
    Response.json(subcategories);
  } catch (e) {
    Response.json({ error: e.message }

     
    );
  }
};
