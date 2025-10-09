import { NextResponse } from 'next/server';
import db from '@/db';
import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const { isEnabled } = await request.json();

    // Update user status
    const [updatedUser] = await db
      .update(usersTable)
      .set({ isEnabled })
      .where(eq(usersTable.id, parseInt(id)))
      .returning();

    if (!updatedUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user status:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}