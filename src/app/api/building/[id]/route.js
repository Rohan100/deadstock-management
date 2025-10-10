import db from '@/db'
import { NextResponse } from 'next/server'
import { buildings } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request, { params }) {
    const { id } = await params;
    try {
        const building = await db.select().from(buildings).where(eq(buildings.buildingId, parseInt(id)));
        if (building.length === 0) {
            return NextResponse.json({ error: 'Building not found' }, { status: 404 });
        }
        return NextResponse.json(building[0], { status: 200 });
    }catch (error) {
        console.error('Error fetching building:', error)
        return NextResponse.json({ error: 'Failed to fetch building' }, { status: 500 })
    }
}

export async function DELETE(request, { params }) {
    const { id } = await params;
    try {
        const deletedCount = await db.delete(buildings).where(eq(buildings.buildingId, parseInt(id))).returning();
        if (deletedCount.length === 0) {
            return NextResponse.json({ error: 'Building not found' }, { status: 404 });
        }
        return NextResponse.json({ message: 'Building deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting building:', error)
        return NextResponse.json({ error: 'Failed to delete building' }, { status: 500 })
    }
}