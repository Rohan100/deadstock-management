import db from "@/db";
import { NextResponse } from "next/server";
import { buildings, labs } from "@/db/schema";
import { eq, count, sql } from "drizzle-orm";

// GET all buildings (with lab count)
export async function GET() {
  try {
    const data = await db
      .select({
        buildingId: buildings.buildingId,
        buildingName: buildings.buildingName,
        address: buildings.address,
        labCount: count(labs.labId).as("labCount"),
      })
      .from(buildings)
      .leftJoin(labs, eq(labs.buildingId, buildings.buildingId))
      .groupBy(buildings.buildingId)
      .orderBy(buildings.buildingName);

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("GET buildings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch buildings" },
      { status: 500 }
    );
  }
}

// CREATE building
export async function POST(request) {
  try {
    const { buildingName, address } = await request.json();

    if (!buildingName) {
      return NextResponse.json(
        { error: "Building name is required" },
        { status: 400 }
      );
    }

    const newBuilding = await db
      .insert(buildings)
      .values({
        buildingName,
        address: address || null,
      })
      .returning();

    return NextResponse.json(newBuilding[0], { status: 201 });
  } catch (error) {
    console.error("POST buildings error:", error);
    return NextResponse.json(
      { error: "Failed to create building" },
      { status: 500 }
    );
  }
}