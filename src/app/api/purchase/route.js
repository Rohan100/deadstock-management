import { purchaseHistory,warehouseStock } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import db from "@/db";
import { NextResponse } from "next/server";

export async function GET(request) {

    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const offset = (page - 1) * pageSize;   
    try {
        const query = await db
            .select()
            .from(purchaseHistory)
            .where(
                and(
                    itemId ? eq(purchaseHistory.itemId, parseInt(itemId)) : undefined,
                    fromDate ? eq(purchaseHistory.purchaseDate, new Date(fromDate)) : undefined,
                    toDate ? eq(purchaseHistory.purchaseDate, new Date(toDate)) : undefined
                )
            ).limit(pageSize)
            .offset(offset);
        return NextResponse.json(query);
    } catch (error) {
        console.error("Error fetching purchase history:", error);
        return NextResponse.json({ error: "Error fetching purchase history" }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { itemId, vendorId, quantityPurchased, unitPrice, totalAmount, purchaseDate, invoiceNumber, invoiceDate, remarks } = await request.json();
        if (!itemId || !quantityPurchased || !purchaseDate) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        const newPurchase = await db.insert(purchaseHistory).values({
            itemId,
            vendorId,
            quantityPurchased,
            unitPrice,
            totalAmount,
            purchaseDate: new Date(purchaseDate),
            invoiceNumber,
            invoiceDate: invoiceDate ? new Date(invoiceDate) : null,
            remarks
        }).returning();
        const stockRecord = await db.select().from(warehouseStock).where(eq(warehouseStock.itemId, itemId)).first();
        if (stockRecord) {
            await db.update(warehouseStock).set({
                quantityAvailable: stockRecord.quantityAvailable + quantityPurchased
            }).where(eq(warehouseStock.warehouseStockId, stockRecord.warehouseStockId));
        }else {
            await db.insert(warehouseStock).values({
                itemId,
                quantityAvailable: quantityPurchased,
            });
        }
        return NextResponse.json(newPurchase);
    } catch (error) {
        console.error("Error adding purchase record:", error);
        return NextResponse.json({ error: "Error adding purchase record" }, { status: 500 });
    }
}

export async function DELETE(request) {
    // delete one or multiple purchase records by ids
    try {
        const { ids } = await request.json();
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
        }
        await db.delete(purchaseHistory).where(purchaseHistory.purchaseId.in(ids));
        return NextResponse.json({ message: "Purchase records deleted successfully" });
    } catch (error) {
        console.error("Error deleting purchase records:", error);
        return NextResponse.json({ error: "Error deleting purchase records" }, { status: 500 });
    }
}
 
