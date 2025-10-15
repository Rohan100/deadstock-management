import { warehouseStock } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import db from "@/db";
import { NextResponse } from "next/server";

export async function PUT(request, { params }) {
    const { itemid } = await params;
    try{
        const { quantityAvailable } = await request.json();
        if (quantityAvailable === undefined) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        const existingStock = await db.select().from(warehouseStock).where(eq(warehouseStock.itemId, parseInt(itemid))).first();
        if (!existingStock) {
            return NextResponse.json({ error: "Stock for this item does not exist. Use POST to create." }, { status: 400 });
        }
        const updated = await db.update(warehouseStock)
        .set({quantityAvailable})
        .where(eq(warehouseStock.itemId,parseInt(itemid)))
        .returning()

        return NextResponse.json(updated,{status:200})
    }catch(err){
        console.log(err)
        return NextResponse.json({message:"Error while updaing stock"},{status:500})
    }
}

export async function DELETE(request,{params}){
    try{
        const {itemId} = await params
        const record = await db.delete(warehouseStock).where(eq(warehouseStock.itemId),parseInt(itemId)).returning()
        return NextResponse.json({message:"record Delected",record},{status:200})
    }catch(err){
        return NextResponse.json({message:"Error while Deleting record"},{status:500})
    }
}