import {labs} from "@/db/schema";
import db from '@/db'
import {NextResponse}  from 'next/server'

export async function GET(request){
    try {
        const {searchParams} = new URL(request.url)
        const buildingId = searchParams.get('buildingId')
        let query = db.select().from(labs)
        if (buildingId){
            query = query.where(labs.buildingId.eq(parseInt(buildingId)))
        }
        const allLabs = await query
        return NextResponse.json(allLabs, {status: 200})
    }catch (error) {
        console.error('Error fetching labs:', error)
        return NextResponse.json({error: 'Failed to fetch labs'}, {status: 500})
    }
}

export async function POST(request){
    try {
        const {labName, buildingId, description,labCode,floorNumber,labType} = await request.json()
        if (!labName || !buildingId){
            return NextResponse.json({error: 'Lab name and Building ID are required'}, {status: 400})
        }
        const newLab = await db.insert(labs).values({
            labName,
            buildingId,
            description,
            labCode,
            floorNumber,
            labType
        }).returning()
        return NextResponse.json(newLab[0], {status: 201})
    } catch (error) {
        console.error('Error creating lab:', error)
        return NextResponse.json({error: 'Failed to create lab'}, {status: 500})
    }
}