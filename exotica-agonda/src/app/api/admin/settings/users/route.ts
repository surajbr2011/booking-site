import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';
import { withErrorHandler } from '@/lib/api-error';

// GET /api/admin/settings/users - Fetch all admin users
export const GET = withErrorHandler(async () => {
    const users = await db.adminUser.findMany({
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            isActive: true,
            lastLogin: true,
            createdAt: true,
        },
        orderBy: { createdAt: 'asc' },
    });

    return NextResponse.json(users);
});

// POST /api/admin/settings/users - Create a new admin user
export const POST = withErrorHandler(async (request: Request) => {
    const body = await request.json();
    const { fullName, email, role, password } = body;

    if (!fullName || !email || !role) {
        return NextResponse.json({ error: 'Name, email, and role are required' }, { status: 400 });
    }

    const existing = await db.adminUser.findUnique({ where: { email } });
    if (existing) {
        return NextResponse.json({ error: 'A user with this email already exists' }, { status: 409 });
    }

    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash(password || 'changeme123', 10);

    const newUser = await db.adminUser.create({
        data: {
            fullName,
            email,
            role,
            passwordHash,
            isActive: true,
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
        },
    });

    return NextResponse.json(newUser, { status: 201 });
});
