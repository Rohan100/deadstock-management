import db from "@/db";
import { NextResponse } from "next/server";
import { departments, items, labs } from "@/db/schema";
import { sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/authorization";

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
        itemCount: sql`(
          SELECT COUNT(*) FROM ${items}
          WHERE ${items.departmentId} = ${departments.departmentId}
        )`.mapWith(Number),
        labCount: sql`(
          SELECT COUNT(*) FROM ${labs}
          WHERE ${labs.departmentId} = ${departments.departmentId}
        )`.mapWith(Number),
      })
      .from(departments)
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
  const { error } = await requireAdmin();
  if (error) return error;

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
