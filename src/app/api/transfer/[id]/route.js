import db from '@/db';
import { NextResponse } from 'next/server';
import { stockTransfers, items, labs, usersTable } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

// ─── GET /api/transfer/[id] ──────────────────────────────────────────────────
export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const rows = await db
      .select({
        transferId: stockTransfers.transferId,
        transferType: stockTransfers.transferType,
        quantity: stockTransfers.quantity,
        transferDate: stockTransfers.transferDate,
        remarks: stockTransfers.remarks,
        itemId: stockTransfers.itemId,
        itemName: items.itemName,
        sku: items.sku,
        fromLabId: stockTransfers.fromLabId,
        fromLabName: sql`(SELECT lab_name FROM labs WHERE lab_id = ${stockTransfers.fromLabId})`,
        toLabId: stockTransfers.toLabId,
        toLabName: sql`(SELECT lab_name FROM labs WHERE lab_id = ${stockTransfers.toLabId})`,
        performedBy: stockTransfers.performedBy,
        performedByName: usersTable.name,
      })
      .from(stockTransfers)
      .leftJoin(items, eq(stockTransfers.itemId, items.itemId))
      .leftJoin(usersTable, eq(stockTransfers.performedBy, usersTable.id))
      .where(eq(stockTransfers.transferId, parseInt(id)))
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Transfer not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching transfer:', error);
    return NextResponse.json({ error: 'Failed to fetch transfer' }, { status: 500 });
  }
}

// ─── DELETE /api/transfer/[id] ───────────────────────────────────────────────
// Deletes the transfer log record only. Stock adjustments are NOT reversed
// (the transfer already happened in the physical world).
export async function DELETE(request, { params }) {
  const { id } = await params;
  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid transfer ID' }, { status: 400 });
  }
  try {
    const deleted = await db
      .delete(stockTransfers)
      .where(eq(stockTransfers.transferId, Number(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Transfer not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Transfer record deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting transfer:', error);
    return NextResponse.json({ error: 'Failed to delete transfer' }, { status: 500 });
  }
}
