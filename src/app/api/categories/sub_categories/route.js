/*export const subCategories = pgTable("sub_categories", {
  subCategoryId: serial("sub_category_id").primaryKey(),
  categoryId: integer("category_id").notNull().references(() => categories.categoryId, { onDelete: "cascade" }),
  subCategoryName: varchar("sub_category_name", { length: 100 }).notNull(),
  description: text("description"),
});
*/
import db from '@/db'
import { NextResponse } from 'next/server'
import { subCategories } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')
    try {
        let query = db.select().from(subCategories)
        if (categoryId) {
            query = query.where(eq(subCategories.categoryId, parseInt(categoryId)))
        }
        const allSubCategories = await query
        return NextResponse.json(allSubCategories, { status: 200 })
    } catch (error) {
        console.error('Error fetching sub-categories:', error)
        return NextResponse.json({ error: 'Failed to fetch sub-categories' }, { status: 500 })
    }   
}

export async function POST(request) {
    try {
        const { categoryId, subCategoryName, description } = await request.json()
        if (!categoryId || !subCategoryName) {
            return NextResponse.json({ error: 'Category ID and Sub-category name are required' }, { status: 400 })
        }
        const newSubCategory = await db.insert(subCategories).values({
            categoryId,
            subCategoryName,
            description,
        }).returning()
        return NextResponse.json(newSubCategory[0], { status: 201 })
    } catch (error) {
        console.error('Error creating sub-category:', error)
        return NextResponse.json({ error: 'Failed to create sub-category' }, { status: 500 })
    }
}
