import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { encode } from 'next-auth/jwt';
import db from '@/lib/mongodb';
import { withErrorHandler } from '@/lib/api-error';

/**
 * POST /api/auth/login
 * Custom login that validates credentials and sets a NextAuth-compatible
 * JWT session cookie so the middleware (proxy.ts) recognises the session.
 */
export const POST = withErrorHandler(async (request: Request) => {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const user = await db.adminUser.findUnique({ where: { email } });

    if (!user || !user.isActive) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    // Update last login timestamp
    await db.adminUser.update({
        where: { email },
        data: { lastLogin: new Date() },
    });

    // Create a NextAuth-compatible JWT token so the middleware (proxy.ts)
    // can correctly verify the session on subsequent admin API requests.
    const secret = process.env.NEXTAUTH_SECRET!;
    const token = await encode({
        token: {
            sub: user.id,
            id: user.id,
            email: user.email,
            name: user.fullName,
            role: user.role,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60, // 30 days
        },
        secret,
    });

    const response = NextResponse.json({
        message: 'Login successful',
        user: {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
        },
    });

    // Set the session cookie that NextAuth middleware reads
    const cookieName = process.env.NODE_ENV === 'production'
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token';

    response.cookies.set(cookieName, token, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        maxAge: 30 * 24 * 60 * 60, // 30 days
        secure: process.env.NODE_ENV === 'production',
    });

    return response;
});
