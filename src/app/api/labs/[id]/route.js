import {labs} from "@/db/schema";
import db from '@/db'
import {NextResponse}  from 'next/server'
import {eq} from "drizzle-orm";

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

export async function DELETE(request, { params }){
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