import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export const GET = async (request, { params }) => {
  try {
    const { id } = params;
    const category = await prisma.category.findUnique({
      where: { categoryId: parseInt(id, 10) },
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category, { status: 200 });
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
};

export const PUT = async (request, { params }) => {
  try {
    const { id } = params;
    const { name, nameSlug } = await request.json();

    const updatedCategory = await prisma.category.update({
      where: { categoryId: parseInt(id, 10) },
      data: {
        name,
        nameSlug,
      },
    });

    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
};

export const DELETE = async (request, { params }) => {
  try {
    const { id } = params;

    await prisma.category.delete({
      where: { categoryId: parseInt(id, 10) },
    });

    return NextResponse.json({ message: "Category deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
};
