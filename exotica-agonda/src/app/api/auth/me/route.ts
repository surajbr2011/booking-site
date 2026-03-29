import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { withErrorHandler } from '@/lib/api-error';

export const GET = withErrorHandler(async (req: any) => {
    // We use getToken from next-auth which automatically reads the cookie
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({
        user: {
            id: token.id,
            email: token.email,
            name: token.name,
            role: token.role,
        }
    });
});
