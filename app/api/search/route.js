import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (req) => {
  const { q } = req.query;
  const encodedQuery = decodeURIComponent(q || '');

  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: encodedQuery, mode: 'insensitive' } },
          
        ],
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Request error', error);
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
  }
};