/*
    export const categories = pgTable("categories", {
    categoryId: serial("category_id").primaryKey(),
    categoryName: varchar("category_name", { length: 100 }).notNull(),
    description: text("description"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
    });
*/

import db from '@/db'
import { NextResponse } from 'next/server'
import { categories } from '@/db/schema'

export async function GET() {
    try {
        const allCategories = await db.select().from(categories)
        return NextResponse.json(allCategories, { status: 200 })
    } catch (error) {
        console.error('Error fetching categories:', error)
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        const { categoryName, description,status } = await request.json()
        if (!categoryName) {
            return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
        }

        const newCategory = await db.insert(categories).values({
            categoryName,
            description,
            status
        }).returning()

        return NextResponse.json(newCategory[0], { status: 201 })
    } catch (error) {
        console.error('Error creating category:', error)
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
    }
}