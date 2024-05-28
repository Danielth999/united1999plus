// File: app/api/users/[id]/route.js

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
      return Response.json({ message: "User not found" }, { status: 404 });
    }

    return Response.json(user, { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return Response.json({ error: "Failed to fetch data" }, { status: 500 });
  }
};

// File: app/api/users/[id]/route.js (continued)

//update user
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

    return Response.json(user, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return Response.json({ error: "Failed to update user" }, { status: 500 });
  }
};

//delete user

export const DELETE = async (request, { params }) => {
  const id = params.id;
  const userID = parseInt(id);

  try {
    const user = await prisma.user.delete({
      where: {
        userId: userID,
      },
    });

    return Response.json(user, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return Response.json({ error: "Failed to delete user" }, { status: 500 });
  }
};
