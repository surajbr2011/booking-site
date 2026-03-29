import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';
import { withErrorHandler } from '@/lib/api-error';

export const GET = withErrorHandler(async (request: Request) => {
    const { searchParams } = new URL(request.url);

    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Filter Parameters
    const status = searchParams.get('status'); // e.g., 'confirmed', 'pending', 'cancelled'
    const search = searchParams.get('search'); // guest name or email

    const whereClause: any = {};

    if (status) {
        whereClause.bookingStatus = status;
    }

    if (search) {
        whereClause.OR = [
            { guestName: { contains: search, mode: 'insensitive' } },
            { guestEmail: { contains: search, mode: 'insensitive' } },
            { bookingReference: { contains: search, mode: 'insensitive' } }
        ];
    }

    // Fetch Bookings with Pagination
    const [bookings, totalCount] = await Promise.all([
        db.booking.findMany({
            where: whereClause,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                room: {
                    select: { roomName: true, basePrice: true }
                }
            }
        }),
        db.booking.count({ where: whereClause })
    ]);

    return NextResponse.json({
        bookings,
        pagination: {
            total: totalCount,
            page,
            limit,
            totalPages: Math.ceil(totalCount / limit),
        }
    });
});
