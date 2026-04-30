import db from "@/db";
import { NextResponse } from "next/server";
import { departments, items } from "@/db/schema";
import { eq, count } from "drizzle-orm";

// GET
export async function GET() {
  try {
    const rows = await db
      .select({
        departmentId: departments.departmentId,
        departmentName: departments.departmentName,
        head: departments.head,
        location: departments.location,
        status: departments.status,
        description: departments.description,
        createdAt: departments.createdAt,
        updatedAt: departments.updatedAt,
        itemCount: count(items.itemId),
      })
      .from(departments)
      .leftJoin(items, eq(items.departmentId, departments.departmentId))
      .groupBy(
        departments.departmentId,
        departments.departmentName,
        departments.head,
        departments.location,
        departments.status,
        departments.description,
        departments.createdAt,
        departments.updatedAt
      )
      .orderBy(departments.departmentName);

    return NextResponse.json(rows);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}

// POST
export async function POST(request) {
  try {
    const { departmentName, head, location, status, description } =
      await request.json();

    if (!departmentName) {
      return NextResponse.json(
        { error: "Department name is required" },
        { status: 400 }
      );
    }

    const newDept = await db
      .insert(departments)
      .values({
        departmentName,
        head: head || null,
        location: location || null,
        status: status || "Active",
        description: description || null,
      })
      .returning();

    return NextResponse.json(newDept[0], { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to create department" },
      { status: 500 }
    );
  }
}