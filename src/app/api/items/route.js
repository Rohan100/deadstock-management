import { items } from '@/db/schema.js';
import db from '@/db'
import { NextResponse } from 'next/server'
import { eq, and } from 'drizzle-orm'

export async function GET(request) {
    try {
        const {searchParams} = new URL(request.url)
        const categoryId = searchParams.get('categoryId')
        const subCategoryId = searchParams.get('subCategoryId')
        let query = db.select().from(items)
        if (categoryId) {
            query = query.where(eq(items.categoryId, parseInt(categoryId)))
        }
        if (subCategoryId) {
            query = query.where(eq(items.subCategoryId, parseInt(subCategoryId)))
        }

        const allItems = await query
        return NextResponse.json(allItems, { status: 200 })
    }
    catch (error) {
        console.error('Error fetching items:', error)
        return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 })
    }
}

export async function POST(request) {
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
            .where(and(eq(items.itemName, itemName), eq(items.brand, brand), eq(items.modelNumber, modelNumber)))
            .limit(1)
        if (existingItem.length > 0) {
            return NextResponse.json({ error: 'Item with the same name, brand, and model number already exists' }, { status: 409 })
        }
        const newItem = await db.insert(items).values({
            itemName,
            categoryId,
            subCategoryId,
            brand,
            modelNumber,
            specifications,
            unitOfMeasurement,
            description,
        }).returning()
        return NextResponse.json(newItem[0], { status: 201 })
    } catch (error) {
        console.error('Error creating item:', error)
        return NextResponse.json({ error: 'Failed to create item' }, { status: 500 })
    }
}