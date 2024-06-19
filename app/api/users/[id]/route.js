// File: app/api/users/[id]/route.js

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import redis from "@/lib/redis";

const prisma = new PrismaClient();

export const config = {
  runtime: "edge",
};
export const GET = async (request, { params }) => {
  const id = params.id;
  const userID = parseInt(id);

  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: userID,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

export const PUT = async (request, { params }) => {
  const id = params.id;
  const userID = parseInt(id);
  const updateUser = await request.json();

  try {
    const user = await prisma.user.update({
      where: {
        userId: userID,
      },
      data: {
        ...updateUser,
      },
    });

    await redis.del("users");
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};

export const DELETE = async (request, { params }) => {
  const id = params.id;
  const userID = parseInt(id);

  try {
    const user = await prisma.user.findUnique({
      where: {
        userId: userID,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: {
        userId: userID,
      },
    });

    await redis.del("users");
    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
};
