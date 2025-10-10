// export const buildings = pgTable("buildings", {
//   buildingId: serial("building_id").primaryKey(),
//   buildingName: varchar("building_name", { length: 100 }).notNull(),
//   address: text("address"),
// });

import db from '@/db'
import { NextResponse } from 'next/server'
import { buildings } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(request) {
    try {
        const allBuildings = await db.select().from(buildings)
        return NextResponse.json(allBuildings, { status: 200 })
    }
    catch (error) {
        console.error('Error fetching buildings:', error)
        return NextResponse.json({ error: 'Failed to fetch buildings' }, { status: 500 })
    }
}

export async function POST(request) {
    try {
        const { buildingName, address } = await request.json()
        if (!buildingName) {
            return NextResponse.json({ error: 'Building name is required' }, { status: 400 })
        }
        const newBuilding = await db.insert(buildings).values({
            buildingName,
            address,
        }).returning()
        return NextResponse.json(newBuilding[0], { status: 201 })
    } catch (error) {
        console.error('Error creating building:', error)
        return NextResponse.json({ error: 'Failed to create building' }, { status: 500 })
    }
}