import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";

import db from "@/db";
import { usersTable } from "@/db/schema";
import { authOptions } from "@/lib/auth";

export const forbiddenResponse = () =>
  NextResponse.json({ error: "Forbidden" }, { status: 403 });

export const unauthorizedResponse = () =>
  NextResponse.json({ error: "Unauthorized" }, { status: 401 });

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return null;
  }

  const [user] = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      username: usersTable.username,
      email: usersTable.email,
      isAdmin: usersTable.isAdmin,
      isEnabled: usersTable.isEnabled,
    })
    .from(usersTable)
    .where(eq(usersTable.id, Number(session.user.id)));

  if (!user?.isEnabled) {
    return null;
  }

  return user;
}

export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    return { error: unauthorizedResponse() };
  }

  return { user };
}

export async function requireAdmin() {
  const { user, error } = await requireAuth();

  if (error) {
    return { error };
  }

  if (!user.isAdmin) {
    return { error: forbiddenResponse() };
  }

  return { user };
}
