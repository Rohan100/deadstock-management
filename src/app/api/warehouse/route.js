import { warehouseStock } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import db from "@/db";
import { NextResponse } from "next/server";

export async function GET(request) {

    try{
        const query = await db
        .select()
        .from(warehouseStock);
        return NextResponse.json(query);
    }catch(error){
        console.error("Error fetching warehouse stock:", error);
        return NextResponse.json({ error: "Error fetching warehouse stock" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { itemId, quantityAvailable } = await request.json();
        if (!itemId || quantityAvailable === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        const existingStock = await db.select().from(warehouseStock).where(eq(warehouseStock.itemId, itemId)).first();
        if (existingStock) {
            return NextResponse.json({ error: "Stock for this item already exists. Use PUT to update." }, { status: 400 });
        }
        const newStock = await db.insert(warehouseStock).values({
            itemId,
            quantityAvailable,
        }).returning();
        return NextResponse.json(newStock);
    } catch (error) {
        console.error("Error adding warehouse stock:", error);
        return NextResponse.json({ error: "Error adding warehouse stock" }, { status: 500 });
    }
}

