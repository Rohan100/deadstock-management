import db from '@/db';
import { NextResponse } from 'next/server';
import { departments, items } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';

// GET /api/departments — list all departments with item count
export async function GET() {
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
      })
      .from(departments)
      .orderBy(departments.departmentName);

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Error fetching departments:', error);
    return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 });
  }
}

// POST /api/departments — create a new department
export async function POST(request) {
  try {
    const { departmentName, head, location, status, description } = await request.json();

    if (!departmentName) {
      return NextResponse.json({ error: 'Department name is required' }, { status: 400 });
    }

    const newDept = await db
      .insert(departments)
      .values({
        departmentName,
        head: head || null,
        location: location || null,
        status: status || 'Active',
        description: description || null,
      })
      .returning();

    return NextResponse.json(newDept[0], { status: 201 });
  } catch (error) {
    console.error('Error creating department:', error);
    return NextResponse.json({ error: 'Failed to create department' }, { status: 500 });
  }
}
