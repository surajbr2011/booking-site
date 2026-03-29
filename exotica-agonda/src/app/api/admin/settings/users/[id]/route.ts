import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';
import { withErrorHandler } from '@/lib/api-error';

// PATCH /api/admin/settings/users/[id] - Update an admin user
export const PATCH = withErrorHandler(async (request: Request, context: any) => {
    const params = await context.params;
    const body = await request.json();
    const { fullName, email, role, isActive } = body;

    const updated = await db.adminUser.update({
        where: { id: params.id },
        data: {
            ...(fullName && { fullName }),
            ...(email && { email }),
            ...(role && { role }),
            ...(isActive !== undefined && { isActive }),
        },
        select: {
            id: true,
            fullName: true,
            email: true,
            role: true,
            isActive: true,
        },
    });

    return NextResponse.json(updated);
});

// DELETE /api/admin/settings/users/[id] - Deactivate an admin user
export const DELETE = withErrorHandler(async (request: Request, context: any) => {
    const params = await context.params;
    await db.adminUser.update({
        where: { id: params.id },
        data: { isActive: false },
    });

    return NextResponse.json({ message: 'User deactivated successfully' });
});
