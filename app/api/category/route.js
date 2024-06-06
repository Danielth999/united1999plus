export const GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const sortOrder = searchParams.get("sort") === "desc" ? "desc" : "asc";

    const categories = await prisma.category.findMany({
      orderBy: {
        categoryId: sortOrder,
      },
    });
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
};

export const POST = async (request) => {
  try {
    const { name, nameSlug } = await request.json();

    const newCategory = await prisma.category.create({
      data: {
        name,
        nameSlug,
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error adding category:", error);
    return NextResponse.json(
      { error: "Failed to add category" },
      { status: 500 }
    );
  }
};