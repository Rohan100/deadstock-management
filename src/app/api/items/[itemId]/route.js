import { items } from "@/db/schema";
import db from "@/db";
import { NextResponse } from "next/server";
import { eq, and, ne } from "drizzle-orm";

export async function GET(request, { params }) {
  const { itemId } = params;

  try {
    const item = await db
      .select()
      .from(items)
      .where(eq(items.itemId, Number(itemId)));

    if (!item.length) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(item[0], { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch item" }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  const { itemId } = params;

  try {
    const data = await request.json();

    // SKU duplicate check (correct way)
    if (data.sku) {
      const existing = await db
        .select()
        .from(items)
        .where(
          and(
            eq(items.sku, data.sku),
            ne(items.itemId, Number(itemId))
          )
        )
        .limit(1);

      if (existing.length) {
        return NextResponse.json({ error: "SKU already exists" }, { status: 409 });
      }
    }

    const updated = await db
      .update(items)
      .set(data)
      .where(eq(items.itemId, Number(itemId)))
      .returning();

    if (!updated.length) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const { itemId } = params;

  try {
    const deleted = await db
      .delete(items)
      .where(eq(items.itemId, Number(itemId)))
      .returning();

    if (!deleted.length) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Item deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
