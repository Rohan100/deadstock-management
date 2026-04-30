import { items } from "@/db/schema";
import db from "@/db";
import { NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get("categoryId");
    const subCategoryId = searchParams.get("subCategoryId");

    let query = db.select().from(items);
    const conditions = [];

    if (categoryId) conditions.push(eq(items.categoryId, Number(categoryId)));
    if (subCategoryId) conditions.push(eq(items.subCategoryId, Number(subCategoryId)));

    if (conditions.length) {
      query = query.where(and(...conditions));
    }

    const allItems = await query;
    return NextResponse.json(allItems, { status: 200 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    // Required fields validation
    if (
      !data.itemName ||
      !data.sku ||
      !data.categoryId ||
      data.unitPrice == null
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // SKU must be unique
    const existing = await db
      .select()
      .from(items)
      .where(eq(items.sku, data.sku))
      .limit(1);

    if (existing.length) {
      return NextResponse.json({ error: "SKU already exists" }, { status: 409 });
    }

    const newItem = await db.insert(items).values({
      itemName: data.itemName,
      sku: data.sku,
      categoryId: data.categoryId,
      subCategoryId: data.subCategoryId ?? null,
      quantity: data.quantity ?? 0,
      minStock: data.minStock ?? 0,
      unitPrice: data.unitPrice,
     departmentId: data.departmentId,
      supplierId: data.supplierId ?? null,
      location: data.location,
      condition: data.condition ?? "New",
      isConsumable: data.isConsumable ?? false,
      description: data.description ?? null
    }).returning();

    return NextResponse.json(newItem[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create item" }, { status: 500 });
  }
}
