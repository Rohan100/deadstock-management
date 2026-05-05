import { NextResponse } from 'next/server';
import db from '@/db';
import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { requireAdmin } from '@/lib/authorization';

const userColumns = {
  id: usersTable.id,
  name: usersTable.name,
  username: usersTable.username,
  email: usersTable.email,
  createdAt: usersTable.createdAt,
  isAdmin: usersTable.isAdmin,
  isEnabled: usersTable.isEnabled,
};

export async function PATCH(request, { params }) {
  const { user: currentUser, error } = await requireAdmin();
  if (error) return error;

  try {
    const { id } = await params;
    const { isEnabled } = await request.json();
    const userId = parseInt(id, 10);

    if (currentUser.id === userId && isEnabled === false) {
      return NextResponse.json(
        { error: 'You cannot disable your own account' },
        { status: 400 }
      );
    }

    // Update user status
    const [updatedUser] = await db
      .update(usersTable)
      .set({ isEnabled: Boolean(isEnabled) })
      .where(eq(usersTable.id, userId))
      .returning(userColumns);

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
