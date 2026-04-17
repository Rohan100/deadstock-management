import { purchaseHistory, warehouseStock } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm"; // Added inArray
import db from "@/db";
import { NextResponse } from "next/server";

// Simple in-memory store to track processing requests
const processingRequests = new Set();

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get("itemId");
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const offset = (page - 1) * pageSize;   
    
    try {
        let queryConditions = [];
        
        if (itemId) {
            queryConditions.push(eq(purchaseHistory.itemId, parseInt(itemId)));
        }
        if (fromDate) {
            queryConditions.push(eq(purchaseHistory.purchaseDate, new Date(fromDate)));
        }
        if (toDate) {
            queryConditions.push(eq(purchaseHistory.purchaseDate, new Date(toDate)));
        }
        
        const query = await db
            .select()
            .from(purchaseHistory)
            .where(and(...queryConditions))
            .limit(pageSize)
            .offset(offset);
            
        return NextResponse.json(query);
    } catch (error) {
        console.error("Error fetching purchase history:", error);
        return NextResponse.json({ error: "Error fetching purchase history" }, { status: 500 });
    }
}

export async function POST(request) {
    // Generate a unique key for this request
    const requestId = `${Date.now()}-${Math.random()}`;
    
    // Check if this request is already being processed
    if (processingRequests.has(requestId)) {
        return NextResponse.json({ error: "Request already processing" }, { status: 429 });
    }
    
    processingRequests.add(requestId);
    
    try {
        const { 
            itemId, 
            vendorId, 
            quantityPurchased, 
            unitPrice, 
            totalAmount, 
            purchaseDate, 
            invoiceNumber, 
            invoiceDate, 
            remarks 
        } = await request.json();
        
        if (!itemId || !quantityPurchased || !purchaseDate) {
            processingRequests.delete(requestId);
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }
        
        // Check if this exact purchase was just created (prevent duplicates)
        const recentPurchase = await db.select()
            .from(purchaseHistory)
            .where(and(
                eq(purchaseHistory.itemId, parseInt(itemId)),
                eq(purchaseHistory.quantityPurchased, parseInt(quantityPurchased)),
                eq(purchaseHistory.purchaseDate, new Date(purchaseDate).toISOString().split('T')[0])
            ))
            .limit(1);
        
        if (recentPurchase.length > 0) {
            processingRequests.delete(requestId);
            return NextResponse.json({ error: "Duplicate purchase detected" }, { status: 409 });
        }
        
        // Format dates properly
        const formattedPurchaseDate = new Date(purchaseDate).toISOString().split('T')[0];
        const formattedInvoiceDate = invoiceDate ? new Date(invoiceDate).toISOString().split('T')[0] : null;
        
        // Insert purchase record
        const newPurchase = await db.insert(purchaseHistory).values({
            itemId: parseInt(itemId),
            vendorId: vendorId ? parseInt(vendorId) : null,
            quantityPurchased: parseInt(quantityPurchased),
            unitPrice: unitPrice || null,
            totalAmount: totalAmount || null,
            purchaseDate: formattedPurchaseDate,
            invoiceNumber: invoiceNumber || null,
            invoiceDate: formattedInvoiceDate,
            remarks: remarks || null
        }).returning();
        
        // Check if warehouse stock exists
        const stockRecords = await db.select()
            .from(warehouseStock)
            .where(eq(warehouseStock.itemId, parseInt(itemId)))
            .limit(1);
        
        // Update or insert warehouse stock
        if (stockRecords.length > 0) {
            const stockRecord = stockRecords[0];
            await db.update(warehouseStock)
                .set({
                    quantityAvailable: stockRecord.quantityAvailable + parseInt(quantityPurchased)
                })
                .where(eq(warehouseStock.warehouseStockId, stockRecord.warehouseStockId));
        } else {
            await db.insert(warehouseStock).values({
                itemId: parseInt(itemId),
                quantityAvailable: parseInt(quantityPurchased),
            });
        }
        
        processingRequests.delete(requestId);
        return NextResponse.json(newPurchase[0]);
    } catch (error) {
        processingRequests.delete(requestId);
        console.error("Error adding purchase record:", error);
        return NextResponse.json({ error: "Error adding purchase record" }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { ids } = await request.json();
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return NextResponse.json({ error: "No IDs provided" }, { status: 400 });
        }
        
        // Convert string IDs to numbers
        const numericIds = ids.map(id => parseInt(id));
        
        // FIXED: Use inArray instead of .in()
        await db.delete(purchaseHistory)
            .where(inArray(purchaseHistory.purchaseId, numericIds));
            
        return NextResponse.json({ message: "Purchase records deleted successfully" });
    } catch (error) {
        console.error("Error deleting purchase records:", error);
        return NextResponse.json({ error: "Error deleting purchase records" }, { status: 500 });
    }
}