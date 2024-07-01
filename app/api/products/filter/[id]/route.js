import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
const prisma = new PrismaClient();

export async function GET(request, { params }) {
     const { id } = params;
   
     try {
       // const cachedProduct = await redis.get(`productId:${id}`);
       // if (cachedProduct) {
       //   return NextResponse.json(JSON.parse(cachedProduct), { status: 200 });
       // }
       const product = await prisma.product.findUnique({
         where: { productId: parseInt(id, 10) }
       });
   
       if (!product) {
         return NextResponse.json({ error: "Product not found" }, { status: 404 });
       }
   
       // await redis.set(`product:${id}`, JSON.stringify(product), "ex", 3600);
   
       return NextResponse.json(product, { status: 200 });
     } catch (error) {
       console.error("Error fetching product:", error);
       return NextResponse.json(
         { error: "Failed to fetch product" },
         { status: 500 }
       );
     }
   }