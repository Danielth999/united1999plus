import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async (req, res) => {
  try {
    const subcategories = await prisma.subcategory.findMany();
    res.status(200).json(subcategories);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export default GET;
