import db from "@/db";
import { usersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function DELETE(request, { params }) {
  let { id } = params;

  try {
    id = parseInt(id, 10);
    // Check if user exists
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Delete user
    await db.delete(usersTable).where(eq(usersTable.id, id));

    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}