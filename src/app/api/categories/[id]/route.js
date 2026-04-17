import db from '@/db'
import { NextResponse } from 'next/server'
import { categories,items } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request, { params }) {
    const { id } = await params
    try {
        const category = await db.select().from(categories).where(eq(categories.categoryId, parseInt(id))).limit(1)
        if (category.length === 0) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 })
        }
        return NextResponse.json(category[0], { status: 200 })
    } catch (error) {
        console.error('Error fetching category:', error)
        return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    const { id } = await params
    try {
        const { categoryName, description } = await request.json()
        if (!categoryName) {
            return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
        }
        const updatedCategory = await db.update(categories).set({
            categoryName,
            description,
        }).where(eq(categories.categoryId, parseInt(id))).returning()

        if (updatedCategory.length === 0) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 })
        }
        return NextResponse.json(updatedCategory[0], { status: 200 })
    } catch (error) {
        console.error('Error updating category:', error)
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
    }

}

export async function DELETE(request, context) {
  // ✅ MUST await params
  const { id } = await context.params;

  // ✅ Validate ID
  if (!id || isNaN(Number(id))) {
    return NextResponse.json(
      { error: "Invalid category ID" },
      { status: 400 }
    );
  }

  try {
    // ✅ Check if category is used by items
    const linkedItems = await db
      .select()
      .from(items)
      .where(eq(items.categoryId, Number(id)));

    if (linkedItems.length > 0) {
      return NextResponse.json(
        { error: "Category has items. Delete items first." },
        { status: 409 }
      );
    }

    // ✅ Delete category
    const deleted = await db
      .delete(categories)
      .where(eq(categories.categoryId, Number(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
  { error: "Cannot delete category because items exist under it" },
  { status: 409 }
);

    }

    return NextResponse.json(
      { message: "Category deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
