import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
const prisma = new PrismaClient();

export const GET = async (Request) => {
  try {
    const users = await prisma.user.findMany();

    return Response.json({ users }, { status: 200 });
  } catch (err) {
    return Response.json({ message: err.message }, { status: 500 });
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

    return new Response(JSON.stringify({ newUser }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), {
      status: 500,
    });
  }
};
