import {labs} from "@/db/schema";
import db from '@/db'
import {NextResponse}  from 'next/server'
import {eq} from "drizzle-orm";
import { requireAdmin } from "@/lib/authorization";

export async function GET(request, { params }){
    const { id } = await params;
    try {
        const lab = await db.select().from(labs).where(eq(labs.labId, parseInt(id)));
        if (lab.length === 0){
            return NextResponse.json({error: 'Lab not found'}, {status: 404})
        }
        return NextResponse.json(lab[0], {status: 200})
    }catch (error) {
        console.error('Error fetching lab:', error)
        return NextResponse.json({error: 'Failed to fetch lab'}, {status: 500})
    }
}

export async function PUT(request, { params }){
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
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
        } = await request.json();

        if (!labName || !departmentId){
            return NextResponse.json({error: 'Lab name and Department ID are required'}, {status: 400})
        }

        const [updatedLab] = await db
            .update(labs)
            .set({
                labName,
                buildingId: buildingId ? Number(buildingId) : null,
                departmentId: Number(departmentId),
                labCode: labCode || null,
                floorNumber: floorNumber ? Number(floorNumber) : null,
                labType: labType || null,
                capacity: capacity ? Number(capacity) : null,
                inChargeName: inChargeName || null,
                inChargeContact: inChargeContact || null,
            })
            .where(eq(labs.labId, parseInt(id)))
            .returning();

        if (!updatedLab){
            return NextResponse.json({error: 'Lab not found'}, {status: 404})
        }

        return NextResponse.json(updatedLab, {status: 200})
    }catch (error) {
        console.error('Error updating lab:', error)
        return NextResponse.json({error: 'Failed to update lab'}, {status: 500})
    }
}

export async function DELETE(request, { params }){
    const { error } = await requireAdmin();
    if (error) return error;

    const { id } = await params;
    try {
        const deletedCount = await db.delete(labs).where(eq(labs.labId, parseInt(id))).returning();
        if (deletedCount.length === 0){
            return NextResponse.json({error: 'Lab not found'}, {status: 404})
        }
        return NextResponse.json({message: 'Lab deleted successfully'}, {status: 200})
    } catch (error) {
        console.error('Error deleting lab:', error)
        return NextResponse.json({error: 'Failed to delete lab'}, {status: 500})
    }
}
