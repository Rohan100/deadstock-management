import { labStock } from "@/db/schema";
import db from '@/db'
import { NextResponse } from 'next/server'

export async function GET(request) {
    try{
        const {searchParams} = new URL(request.url)
        const labId = searchParams.get('labId')
        const itemId = searchParams.get('itemId')        
        const query = db.select().from(labStock).innerJoin(labs, labStock.labId.eq(labs.id)).innerJoin(items, labStock.itemId.eq(items.id))

        if (labId){
            query.where(labStock.labId.eq(parseInt(labId)))
        }
        if (itemId){
            query.where(labStock.itemId.eq(parseInt(itemId)))
        }
        const stockItems = await query
        return NextResponse.json(stockItems, {status: 200})
    }catch (error) {
        console.error('Error fetching lab stock:', error)
        return NextResponse.json({error: 'Failed to fetch lab stock'}, {status: 500})
    }
}

// export async function POST(request) {
//     try{
//         const { labId, itemId, quantity,remark,conditionStatus } = await request.json()
//         if (!labId || !itemId || quantity == null){
//             return NextResponse.json({error: 'Lab ID, Item ID, and Quantity are required'}, {status: 400})
//         }
//         const newStock = await db.insert(labStock).values({
//             labId,
//             itemId,
//             quantity,
//             remark,
//             conditionStatus
//         }).returning()
//         return NextResponse.json(newStock[0], {status: 201})

//     }catch (error) {
//         console.error('Error adding lab stock:', error)
//         return NextResponse.json({error: 'Failed to add lab stock'}, {status: 500})
//     }
// }