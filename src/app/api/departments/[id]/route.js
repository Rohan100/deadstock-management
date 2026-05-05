import db from '@/db';
import { NextResponse } from 'next/server';
import { departments, items, labs } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { requireAdmin } from '@/lib/authorization';

// GET /api/departments/[id]
export async function GET(request, { params }) {
  const { id } = await params;
  try {
    const rows = await db
      .select({
        departmentId: departments.departmentId,
        departmentName: departments.departmentName,
        head: departments.head,
        location: departments.location,
        status: departments.status,
        description: departments.description,
        createdAt: departments.createdAt,
        updatedAt: departments.updatedAt,
        itemCount: sql`(
          SELECT COUNT(*) FROM items
          WHERE items.department_id = departments.department_id
        )`.mapWith(Number),
        labCount: sql`(
          SELECT COUNT(*) FROM labs
          WHERE labs.department_id = departments.department_id
        )`.mapWith(Number),
      })
      .from(departments)
      .where(eq(departments.departmentId, parseInt(id)))
      .limit(1);

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }
    return NextResponse.json(rows[0], { status: 200 });
  } catch (error) {
    console.error('Error fetching department:', error);
    return NextResponse.json({ error: 'Failed to fetch department' }, { status: 500 });
  }
}

// PUT /api/departments/[id]
export async function PUT(request, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  try {
    const { departmentName, head, location, status, description } = await request.json();

    if (!departmentName) {
      return NextResponse.json({ error: 'Department name is required' }, { status: 400 });
    }

    const updated = await db
      .update(departments)
      .set({
        departmentName,
        head: head || null,
        location: location || null,
        status: status || 'Active',
        description: description || null,
        updatedAt: new Date(),
      })
      .where(eq(departments.departmentId, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }
    return NextResponse.json(updated[0], { status: 200 });
  } catch (error) {
    console.error('Error updating department:', error);
    return NextResponse.json({ error: 'Failed to update department' }, { status: 500 });
  }
}

// DELETE /api/departments/[id]
export async function DELETE(request, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;

  if (!id || isNaN(Number(id))) {
    return NextResponse.json({ error: 'Invalid department ID' }, { status: 400 });
  }

  try {
    // Guard: check if any items are linked to this department
    const linkedItems = await db
      .select()
      .from(items)
      .where(eq(items.departmentId, Number(id)))
      .limit(1);

    if (linkedItems.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete: items are still linked to this department.' },
        { status: 409 }
      );
    }

    const linkedLabs = await db
      .select()
      .from(labs)
      .where(eq(labs.departmentId, Number(id)))
      .limit(1);

    if (linkedLabs.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete: labs are still linked to this department.' },
        { status: 409 }
      );
    }

    const deleted = await db
      .delete(departments)
      .where(eq(departments.departmentId, Number(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Department not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Department deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting department:', error);
    return NextResponse.json({ error: 'Failed to delete department' }, { status: 500 });
  }
}
