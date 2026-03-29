import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';
import { withErrorHandler } from '@/lib/api-error';

/**
 * Returns an array of blocked dates for a specific room or all rooms.
 * Useful for rendering the frontend availability calendar.
 */
export const GET = withErrorHandler(async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get('roomId');
    const month = searchParams.get('month'); // optional (1-12)
    const year = searchParams.get('year');   // optional (YYYY)

    const whereClause: any = {
        // Only fetch bookings that block dates
        bookingStatus: { in: ['confirmed', 'pending'] },
    };

    if (roomId) {
        whereClause.roomId = roomId;
    }

    // If a specific month/year is requested, optimize the query to only fetch relevant bookings
    if (month && year) {
        const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
        const endDate = new Date(parseInt(year), parseInt(month), 0); // Last day of month

        whereClause.AND = [
            { checkInDate: { lte: endDate } },
            { checkOutDate: { gte: startDate } },
        ];
    }

    const bookings = await db.booking.findMany({
        where: whereClause,
        select: {
            id: true,
            roomId: true,
            checkInDate: true,
            checkOutDate: true,
        },
    });

    // Transform into a simplified array of unavailable [start, end] date ranges
    const blockedRanges = bookings.map((b) => ({
        roomId: b.roomId,
        start: b.checkInDate.toISOString().split('T')[0],
        end: b.checkOutDate.toISOString().split('T')[0],
    }));

    return NextResponse.json({ blockedRanges });
});
