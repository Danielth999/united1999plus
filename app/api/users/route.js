import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import redis from "@/lib/redis";

const prisma = new PrismaClient();
const CACHE_EXPIRATION = 60 * 5; // 5 minutes

// ฟังก์ชันสำหรับดึงข้อมูลจาก cache หรือเรียกใช้ callback เพื่อดึงข้อมูลใหม่
async function getOrSetCache(key, cb) {
  const cachedData = await redis.get(key); // ตรวจสอบว่ามีข้อมูลใน cache หรือไม่
  if (cachedData) {
    try {
      return JSON.parse(cachedData); // ถ้ามีข้อมูลใน cache ให้คืนค่าข้อมูลนั้น
    } catch (error) {
      console.error("Error parsing cached data:", error);
      // ถ้ามีข้อผิดพลาดในการแปลง JSON แสดงว่า cache อาจมีปัญหา
      await redis.del(key); // ลบข้อมูลใน cache ที่ไม่ถูกต้อง
    }
  }

  const freshData = await cb(); // ถ้าไม่มีข้อมูลใน cache ให้เรียกใช้ callback เพื่อดึงข้อมูลใหม่
  await redis.set(key, JSON.stringify(freshData), "EX", CACHE_EXPIRATION); // เก็บข้อมูลใหม่ลงใน cache พร้อมตั้งเวลาหมดอายุ
  return freshData; // คืนค่าข้อมูลใหม่
}

export const GET = async (Request) => {
  try {
    const users = await getOrSetCache("users", async () => {
      return await prisma.user.findMany();
    });

    return Response.json(users, { status: 200 });
  } catch (err) {
    console.error("Error fetching users:", err);
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
};

export const POST = async (request) => {
  const { email, username, password, role } = await request.json();

  try {
    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        roles: role,
      },
    });

    // เคลียร์ cache หลังจากเพิ่มผู้ใช้ใหม่
    await redis.del("users");

    return new Response.json(newUser, { status: 201 });
  } catch (err) {
    console.error("Error creating user:", err);
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
    });
  } finally {
    await prisma.$disconnect();
  }
};
