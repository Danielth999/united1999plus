import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// GET ALL DATA FROM USERS TABLE
export const GET = async () => {
  const users = await prisma.user.findMany();
  return Response.json(users);
};
// REGISTER A NEW USER
export const POST = async (request) => {
  try {
    // import username ,email ,passwor from reques and convert to json
    const { username, email, password } = await request.json();
    //hash password lenght = 10
    const hashedPassword = await bcrypt.hash(password, 10);
    // check email
    const existingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    // Check condition email
    if (existingUser) {
      return Response.json(
        {
          message: "Email already in use. Please use a different email.",
        },
        {
          status: 409, // Conflict status
        }
      );
    }
    //let prisma create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    // ค้นหา role ที่มีชื่อเป็น 'member'
    const memberRole = await prisma.role.findFirst({
      where: { roleName: "member" },
    });

    // จากนั้นให้ prisma สร้างข้อมูลในตาราง userRole โดย role มาจาก memberRole และ userId มาจาก user ที่สร้างไว้
    await prisma.userRole.create({
      data: {
        userId: user.userId,
        roleId: memberRole.roleId,
      },
    });

    // return message json to user
    return Response.json({
      message: "User registered successfully.",
      user,
    });
  } catch (error) {
    return Response.json({
      message: "Failed to register. Please try again.",
    });
  }
};
