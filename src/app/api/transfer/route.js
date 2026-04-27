import db from '@/db';
import { NextResponse } from 'next/server';
import { stockTransfers, items, labs, warehouseStock, labStock, usersTable } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// ─── GET /api/transfer ───────────────────────────────────────────────────────
// Returns all transfers with joined item name, lab names, and performer name.
// Optional query param: ?transferType=Warehouse+to+Lab
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const transferType = searchParams.get('transferType');

    let query = db
      .select({
        transferId: stockTransfers.transferId,
        transferType: stockTransfers.transferType,
        quantity: stockTransfers.quantity,
        transferDate: stockTransfers.transferDate,
        remarks: stockTransfers.remarks,
        // item
        itemId: stockTransfers.itemId,
        itemName: items.itemName,
        sku: items.sku,
        // from lab
        fromLabId: stockTransfers.fromLabId,
        fromLabName: sql`(SELECT lab_name FROM labs WHERE lab_id = ${stockTransfers.fromLabId})`,
        // to lab
        toLabId: stockTransfers.toLabId,
        toLabName: sql`(SELECT lab_name FROM labs WHERE lab_id = ${stockTransfers.toLabId})`,
        // performed by
        performedBy: stockTransfers.performedBy,
        performedByName: usersTable.name,
      })
      .from(stockTransfers)
      .leftJoin(items, eq(stockTransfers.itemId, items.itemId))
      .leftJoin(usersTable, eq(stockTransfers.performedBy, usersTable.id))
      .orderBy(sql`${stockTransfers.transferDate} DESC`);

    const rows = await query;

    // filter by transferType if provided
    const filtered = transferType
      ? rows.filter((r) => r.transferType === transferType)
      : rows;

    return NextResponse.json(filtered, { status: 200 });
  } catch (error) {
    console.error('Error fetching transfers:', error);
    return NextResponse.json({ error: 'Failed to fetch transfers' }, { status: 500 });
  }
}

// ─── POST /api/transfer ──────────────────────────────────────────────────────
// Creates a transfer and adjusts source/destination stock atomically.
//
// Body:
//   { itemId, transferType, fromLabId?, toLabId?, quantity, remarks? }
//
// transferType must be one of:
//   "Warehouse to Lab" | "Lab to Lab" | "Lab to Warehouse"
export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const performedBy = Number(session.user.id);

  try {
    const { itemId, transferType, fromLabId, toLabId, quantity, remarks } = await request.json();

    // ── Validation ──────────────────────────────────────────────────────────
    if (!itemId || !transferType || !quantity || quantity <= 0) {
      return NextResponse.json(
        { error: 'itemId, transferType, and a positive quantity are required.' },
        { status: 400 }
      );
    }
    if (transferType === 'Warehouse to Lab' && !toLabId) {
      return NextResponse.json({ error: 'toLabId is required for Warehouse to Lab transfer.' }, { status: 400 });
    }
    if (transferType === 'Lab to Lab' && (!fromLabId || !toLabId)) {
      return NextResponse.json({ error: 'fromLabId and toLabId are required for Lab to Lab transfer.' }, { status: 400 });
    }
    if (transferType === 'Lab to Warehouse' && !fromLabId) {
      return NextResponse.json({ error: 'fromLabId is required for Lab to Warehouse transfer.' }, { status: 400 });
    }

    // ── Run everything in a transaction ─────────────────────────────────────
    const result = await db.transaction(async (tx) => {

      // 1. Check & decrement source stock
      if (transferType === 'Warehouse to Lab') {
        const [wh] = await tx.select().from(warehouseStock).where(eq(warehouseStock.itemId, Number(itemId)));
        if (!wh || wh.quantityAvailable < quantity) {
          throw new Error(`Insufficient warehouse stock. Available: ${wh?.quantityAvailable ?? 0}`);
        }
        await tx.update(warehouseStock)
          .set({ quantityAvailable: wh.quantityAvailable - quantity })
          .where(eq(warehouseStock.itemId, Number(itemId)));

      } else if (transferType === 'Lab to Lab' || transferType === 'Lab to Warehouse') {
        const [src] = await tx.select().from(labStock)
          .where(and(eq(labStock.itemId, Number(itemId)), eq(labStock.labId, Number(fromLabId))));
        if (!src || src.quantity < quantity) {
          throw new Error(`Insufficient lab stock. Available: ${src?.quantity ?? 0}`);
        }
        await tx.update(labStock)
          .set({ quantity: src.quantity - quantity })
          .where(and(eq(labStock.itemId, Number(itemId)), eq(labStock.labId, Number(fromLabId))));
      }

      // 2. Increment destination stock
      if (transferType === 'Warehouse to Lab' || transferType === 'Lab to Lab') {
        const destLabId = Number(toLabId);
        const [dest] = await tx.select().from(labStock)
          .where(and(eq(labStock.itemId, Number(itemId)), eq(labStock.labId, destLabId)));
        if (dest) {
          await tx.update(labStock)
            .set({ quantity: dest.quantity + quantity })
            .where(and(eq(labStock.itemId, Number(itemId)), eq(labStock.labId, destLabId)));
        } else {
          await tx.insert(labStock).values({ itemId: Number(itemId), labId: destLabId, quantity });
        }

      } else if (transferType === 'Lab to Warehouse') {
        const [wh] = await tx.select().from(warehouseStock).where(eq(warehouseStock.itemId, Number(itemId)));
        if (wh) {
          await tx.update(warehouseStock)
            .set({ quantityAvailable: wh.quantityAvailable + quantity })
            .where(eq(warehouseStock.itemId, Number(itemId)));
        } else {
          await tx.insert(warehouseStock).values({ itemId: Number(itemId), quantityAvailable: quantity });
        }
      }

      // 3. Log the transfer
      const [transfer] = await tx.insert(stockTransfers).values({
        itemId: Number(itemId),
        transferType,
        fromLabId: fromLabId ? Number(fromLabId) : null,
        toLabId: toLabId ? Number(toLabId) : null,
        quantity,
        performedBy,
        remarks: remarks || null,
      }).returning();

      return transfer;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error creating transfer:', error);
    const isBusinessError = error.message?.startsWith('Insufficient');
    return NextResponse.json(
      { error: error.message || 'Failed to create transfer' },
      { status: isBusinessError ? 422 : 500 }
    );
  }
}
