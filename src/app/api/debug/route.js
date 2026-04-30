import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    databaseUrlExists: !!process.env.DATABASE_URL,
    preview: process.env.DATABASE_URL?.slice(0, 30),
  });
}