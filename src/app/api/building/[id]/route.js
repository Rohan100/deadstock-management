import db from "@/db";
import { NextResponse } from "next/server";
import { buildings } from "@/db/schema";
import { eq } from "drizzle-orm";

// GET single building
export async function GET(request, { params }) {
  try {
    const id = Number(params.id);

    const data = await db
      .select()
      .from(buildings)
      .where(eq(buildings.buildingId, id));

    if (data.length === 0) {
      return NextResponse.json(
        { error: "Building not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data[0], { status: 200 });
  } catch (error) {
    console.error("GET building error:", error);
    return NextResponse.json(
      { error: "Failed to fetch building" },
      { status: 500 }
    );
  }
}

// UPDATE building
export async function PUT(request, { params }) {
  try {
    const id = Number(params.id);
    const { buildingName, address } = await request.json();

    const updated = await db
      .update(buildings)
      .set({
        buildingName,
        address,
      })
      .where(eq(buildings.buildingId, id))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json(
        { error: "Building not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error("PUT building error:", error);
    return NextResponse.json(
      { error: "Failed to update building" },
      { status: 500 }
    );
  }
}

// DELETE building
export async function DELETE(request, { params }) {
  try {
    const id = Number(params.id);

    const deleted = await db
      .delete(buildings)
      .where(eq(buildings.buildingId, id))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: "Building not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Building deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE building error:", error);
    return NextResponse.json(
      { error: "Failed to delete building" },
      { status: 500 }
    );
  }
}