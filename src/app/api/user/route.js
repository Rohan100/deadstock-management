import db from '@/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { usersTable } from '@/db/schema';
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

export async function GET(request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {

    const users = await db.select(userColumns).from(usersTable)
    if (!users) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  const { error } = await requireAdmin();
  if (error) return error;

  try {
    const { name, username, password, email,isAdmin } = await request.json();

    if (!name || !username || !password || !email ) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      username,
      password: hashedPassword,
      email,
      isAdmin: Boolean(isAdmin),
    };

    const [insertedUser] = await db.insert(usersTable).values(newUser).returning(userColumns);

    return NextResponse.json(insertedUser, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

