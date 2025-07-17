// pages/api/reset-password.js
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import db from '@/db';
import { usersTable } from '@/db/schema';
import { and, eq, gt } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export async function POST(req) {

    try {
        const { token, password } = await req.json();

        if (!token || !password) {
            return res.status(400).json({ message: 'Token and password are required' });
        }

        // Hash the token to compare with stored hash
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find user with valid token
        const [user] = await db.select().from(usersTable).where(and(
            eq(usersTable.resetPasswordToken, hashedToken),
            gt(usersTable.resetPasswordExpires, new Date())
        ));

        console.log(user);
        if (!user) {
            return NextResponse.json({ message: 'Invalid or expired token' },{status: 400});
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password and clear reset token
        await db
            .update(usersTable)
            .set({
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null,
            })
            .where(eq(usersTable.id, user.id));

        return NextResponse.json({ message: 'Password has been reset' },{status: 200});
    } catch (error) {
        console.error('Reset password error:', error);
        return NextResponse.json({ message: 'Internal server error' },{status: 500});
    }
}