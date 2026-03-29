import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';
import { withErrorHandler } from '@/lib/api-error';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Simple in-memory store for reset tokens (use Redis in production)
const resetTokens = new Map<string, { adminId: string; expiresAt: number }>();

// POST /api/admin/reset-password — Step 1: Request a reset token
export const POST = withErrorHandler(async (request: Request) => {
    const body = await request.json();
    const { email } = body;

    if (!email) {
        return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await db.adminUser.findUnique({
        where: { email },
        select: { id: true, fullName: true, email: true, isActive: true },
    });

    // Always return 200 to avoid email enumeration (don't reveal if user exists)
    if (!user || !user.isActive) {
        return NextResponse.json({ message: 'If an account with that email exists, a reset link has been sent.' });
    }

    // Generate secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + 60 * 60 * 1000; // 1 hour
    resetTokens.set(token, { adminId: user.id, expiresAt });

    // Log reset token (in production, send via email)
    console.log(`[Password Reset] Token for ${user.email}: ${token} (expires in 1 hour)`);

    // If SendGrid is configured, send the email
    try {
        const { sendEmail } = await import('@/lib/email');
        await sendEmail({
            to: user.email,
            subject: 'Password Reset - The Exotica Agonda Admin',
            html: `
                <h2>Hello ${user.fullName},</h2>
                <p>You requested a password reset for your admin account.</p>
                <p>Use the following token to reset your password (valid for 1 hour):</p>
                <code style="background:#f1f5f9;padding:12px;border-radius:8px;display:block;font-size:18px;letter-spacing:2px;">${token}</code>
                <p>If you did not request this, please ignore this email.</p>
                <br/>
                <p>The Exotica Agonda Team</p>
            `,
        });
    } catch (err) {
        console.error('[Password Reset] Failed to send email:', err);
    }

    return NextResponse.json({ message: 'If an account with that email exists, a reset link has been sent.' });
});

// PATCH /api/admin/reset-password — Step 2: Use token to set new password
export const PATCH = withErrorHandler(async (request: Request) => {
    const body = await request.json();
    const { token, newPassword } = body;

    if (!token || !newPassword) {
        return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 8) {
        return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 });
    }

    const tokenData = resetTokens.get(token);

    if (!tokenData || tokenData.expiresAt < Date.now()) {
        return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 });
    }

    // Hash new password
    const passwordHash = await bcrypt.hash(newPassword, 12);

    await db.adminUser.update({
        where: { id: tokenData.adminId },
        data: { passwordHash },
    });

    // Invalidate the token after use
    resetTokens.delete(token);

    console.log(`[Password Reset] Password updated for admin user: ${tokenData.adminId}`);

    return NextResponse.json({ message: 'Password updated successfully. Please log in with your new password.' });
});
