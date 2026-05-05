import { buildings, departments, labs } from "@/db/schema";
import db from '@/db'
import {NextResponse}  from 'next/server'
import { and, eq, sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/authorization";

const labColumns = {
    labId: labs.labId,
    buildingId: labs.buildingId,
    buildingName: buildings.buildingName,
    departmentId: labs.departmentId,
    departmentName: departments.departmentName,
    labName: labs.labName,
    labCode: labs.labCode,
    floorNumber: labs.floorNumber,
    labType: labs.labType,
    capacity: labs.capacity,
    inChargeName: labs.inChargeName,
    inChargeContact: labs.inChargeContact,
};

export async function GET(request){
    try {
        const {searchParams} = new URL(request.url)
        const buildingId = searchParams.get('buildingId')
        const departmentId = searchParams.get('departmentId')
        const conditions = []
        let query = db
            .select(labColumns)
            .from(labs)
            .leftJoin(buildings, eq(labs.buildingId, buildings.buildingId))
            .leftJoin(departments, eq(labs.departmentId, departments.departmentId))
        if (buildingId){
            conditions.push(eq(labs.buildingId, parseInt(buildingId)))
        }
        if (departmentId){
            conditions.push(eq(labs.departmentId, parseInt(departmentId)))
        }
        if (conditions.length > 0) {
            query = query.where(and(...conditions))
        }
        const allLabs = await query.orderBy(sql`${departments.departmentName}, ${labs.labName}`)
        return NextResponse.json(allLabs, {status: 200})
    }catch (error) {
        console.error('Error fetching labs:', error)
        return NextResponse.json({error: 'Failed to fetch labs'}, {status: 500})
    }
}

export async function POST(request){
    const { error } = await requireAdmin();
    if (error) return error;

    try {
        const {
            labName,
            buildingId,
            departmentId,
            labCode,
            floorNumber,
            labType,
            capacity,
            inChargeName,
            inChargeContact,
        } = await request.json()
        if (!labName || !departmentId){
            return NextResponse.json({error: 'Lab name and Department ID are required'}, {status: 400})
        }
        const [newLab] = await db.insert(labs).values({
            labName,
            buildingId: buildingId ? Number(buildingId) : null,
            departmentId: Number(departmentId),
            labCode: labCode || null,
            floorNumber: floorNumber ? Number(floorNumber) : null,
            labType: labType || null,
            capacity: capacity ? Number(capacity) : null,
            inChargeName: inChargeName || null,
            inChargeContact: inChargeContact || null,
        }).returning()
        return NextResponse.json(newLab, {status: 201})
    } catch (error) {
        console.error('Error creating lab:', error)
        return NextResponse.json({error: 'Failed to create lab'}, {status: 500})
    }
}
