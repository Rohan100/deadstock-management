import db from '@/db';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
// export const usersTable = pgTable("users", {
//   id: serial('id').primaryKey(), 
//   name: varchar({ length: 255 }).notNull(),
//   username: varchar({ length: 255 }).notNull().unique(),
//   password: varchar({ length: 255 }).notNull(),
//   createdAt: timestamp().notNull().defaultNow(),
//   email: varchar({ length: 255 }).notNull().unique(),
//   isAdmin: boolean().notNull().default(false),
// });

import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const user = await db.query.usersTable.findFirst({
      where: eq(usersTable.username, username),
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { name, username, password, email } = await request.json();

    if (!name || !username || !password || !email) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      username,
      password: hashedPassword,
      email,
      isAdmin: true,
    };

    const insertedUser = await db.insert(usersTable).values(newUser).returning();

    return NextResponse.json(insertedUser[0], { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

