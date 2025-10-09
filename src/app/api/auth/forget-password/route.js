// pages/api/forgot-password.js
import { Resend } from 'resend';
import crypto from 'crypto';
import { NextResponse } from 'next/server';
import db from '@/db';
import { usersTable } from '@/db/schema';
import { eq } from 'drizzle-orm';
const resend = new Resend(process.env.RESEND_API_KEY);
export async function POST(req, res) {

    try {
        const { email } = await req.json();
        
        // Always return the same response whether the email exists or not
        // to prevent email enumeration attacks
        if (!email) {
            return NextResponse.json({ message: 'Email is required' }, { status: 400 });
        }

        // Find the user (if they exist)
        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email))
        console.log('User found:', user);
        // If the user exists, create a reset token
        if (user) {
            // Generate a random token
            const resetToken = crypto.randomBytes(32).toString('hex');
            const hashedToken = crypto
                .createHash('sha256')
                .update(resetToken)
                .digest('hex');

            // Save the token to the database with expiration
            await db.update(usersTable).set({
                resetPasswordToken: hashedToken,
                resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hour expiry
            }).where(eq(usersTable.id, user.id));

            // Send the email
            const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

            // const transporter = nodemailer.createTransport({
            //     host: "smtp.ethereal.email",
            //     port: 587,
            //     secure: false, // true for 465, false for other ports
            //     auth: {
            //         user: "maddison53@ethereal.email",
            //         pass: "jn7jnAPss4f63QBp6D",
            //     },
            // });

            await resend.emails.send({
                from: "onboarding@resend.dev",
                to: "rohannagare70@gmail.com",
                subject: 'Password Reset Request',
                html: `
          <p>You requested a password reset.</p>
          <p>Click this link to reset your password:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>This link is valid for 1 hour.</p>
        `,
            });
        }

        // Always return success to prevent email enumeration
        return NextResponse.json({ message: 'Reset email sent if account exists' },{status: 200});
    } catch (error) {
        console.error('Password reset error:', error);
        return NextResponse.json({ message: 'Internal server error' },{status: 500});
    }
}