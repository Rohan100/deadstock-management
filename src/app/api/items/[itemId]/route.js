import { items } from '@/db/schema.js';
import db from '@/db'
import { NextResponse } from 'next/server'
import { eq, and } from 'drizzle-orm'

export async function GET(request, { params }) {
    const { itemId } = await params;
    try{
        const item = await db.select().from(items).where(eq(items.itemId, parseInt(itemId)));
        if (item.length === 0){
            return NextResponse.json({error: 'Item not found'}, {status: 404})
        }
        return NextResponse.json(item[0], {status: 200})
    }catch (error) {
        console.error('Error fetching item:', error)
        return NextResponse.json({error: 'Failed to fetch item'}, {status: 500})
    }
}

export async function DELETE(request, { params }){
    const { itemId } = await params;
    try {
        const deletedCount = await db.delete(items).where(eq(items.itemId, parseInt(itemId))).returning();
        if (deletedCount.length === 0){
            return NextResponse.json({error: 'Item not found'}, {status: 404})
        }
        return NextResponse.json({message: 'Item deleted successfully'}, {status: 200})
    } catch (error) {
        console.error('Error deleting item:', error)
        return NextResponse.json({error: 'Failed to delete item'}, {status: 500})
    }
}

export async function PATCH(request, { params }){
    const { itemId } = await params;
    try {
        const {
            itemName,
            categoryId,
            subCategoryId,
            brand,
            modelNumber,
            specifications, // can store JSON string
            unitOfMeasurement, // e.g., 'piece', 'meter', 'set'
            description, } = await request.json()
        if (!itemName || !categoryId) {
            return NextResponse.json({ error: 'Item name and Category ID are required' }, { status: 400 })
        }
        const existingItem = await db.select()
            .from(items)
            .where(and(eq(items.itemName, itemName), eq(items.brand, brand), eq(items.modelNumber, modelNumber), items.itemId.ne(parseInt(itemId))))
            .limit(1)
        if (existingItem.length > 0) {
            return NextResponse.json({ error: 'Item with the same name, brand, and model number already exists' }, { status: 409 })
        }
        const updatedItems = await db.update(items).set({
            itemName,
            categoryId,
            subCategoryId,
            brand,
            modelNumber,
            specifications,
            unitOfMeasurement,
            description,
        }).where(eq(items.itemId, parseInt(itemId))).returning()
        if (updatedItems.length === 0){
            return NextResponse.json({error: 'Item not found'}, {status: 404})
        }
        return NextResponse.json(updatedItems[0], {status: 200})
    } catch (error) {
        console.error('Error updating item:', error)
        return NextResponse.json({error: 'Failed to update item'}, {status: 500})
    }
}