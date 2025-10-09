import db from '@/db'
import { NextResponse } from 'next/server'
import {  subCategories } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request, { params }) {
    const { id } =await params
    try {
        const category = await db.select().from(subCategories).where(eq(subCategories.subCategoryId, parseInt(id))).limit(1)
        if (category.length === 0) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 })
        }
        return NextResponse.json(category[0], { status: 200 })
    } catch (error) {
        console.error('Error fetching category:', error)
        return NextResponse.json({ error: 'Failed to fetch sub category' }, { status: 500 })
    }
}

export async function PUT(request, { params }) {
    const { id } =await params
    try {
        const { subCategoryName, description } = await request.json()
        if (!subCategoryName) {
            return NextResponse.json({ error: 'Sub Category name is required' }, { status: 400 })
        }
        const updatedCategory = await db.update(subCategories).set({
            subCategoryName,
            description,
        }).where(eq(subCategories.subCategoryId, parseInt(id))).returning()

        if (updatedCategory.length === 0) {
            return NextResponse.json({ error: 'subcategory not found' }, { status: 404 })
        }
        return NextResponse.json(updatedCategory[0], { status: 200 })
    } catch (error) {
        console.error('Error updating category:', error)
        return NextResponse.json({ error: 'Failed to update subcategory' }, { status: 500 })
    }

}

export async function DELETE(request, { params }) {
    const { id } =await params
    try {
        const deletedCategory = await db.delete(subCategories).where(eq(subCategories.subCategoryId, parseInt(id))).returning()
        if (deletedCategory.length === 0) {
            return NextResponse.json({ error: 'Subcategory not found' }, { status: 404 })
        }
        return NextResponse.json({ message: 'Subcategory deleted successfully' }, { status: 200 })
    } catch (error) {
        console.error('Error deleting category:', error)
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
    }
}
