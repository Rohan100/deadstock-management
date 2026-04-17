import { NextResponse } from "next/server";
import db from "@/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    await db.execute(sql`select 1`);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DB ERROR:", err);
    return NextResponse.json({
      success: false,
      error: err.message,
    });
  }
}
