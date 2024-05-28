import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const GET = async (req, res) => {
  try {
    const products = await prisma.product.findMany();
    res.status(200).json(products);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export default GET;
