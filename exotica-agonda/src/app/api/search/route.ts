import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';
import { withErrorHandler } from '@/lib/api-error';
import { applyRateLimit } from '@/lib/rate-limit';

export const GET = withErrorHandler(async (request: Request) => {
    const rateLimitError = await applyRateLimit(request, 20); // Search limits
    if (rateLimitError) return rateLimitError;

    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    if (!q) {
        return NextResponse.json({ rooms: [], content: [] });
    }

    // Determine what matches the search query string
    // Search runs concurrently on Rooms and Content Pages
    const [rooms, contentPages] = await Promise.all([
        db.room.findMany({
            where: {
                isActive: true,
                OR: [
                    { roomName: { contains: q, mode: 'insensitive' } },
                    { description: { contains: q, mode: 'insensitive' } },
                ],
            },
            take: 10,
        }),
        db.contentPage.findMany({
            where: {
                isPublished: true,
                OR: [
                    { pageTitle: { contains: q, mode: 'insensitive' } },
                    { metaKeywords: { contains: q, mode: 'insensitive' } },
                ],
            },
            take: 10,
        }),
    ]);

    return NextResponse.json({
        query: q,
        results: {
            rooms,
            contentPages,
        },
    });
});
