import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';
import { withErrorHandler } from '@/lib/api-error';

export const GET = withErrorHandler(async (request: Request) => {
    // Authentication is handled globally by Next.js middleware, 
    // so we can assume only admins reach this endpoint.

    // Date ranges for current and previous periods
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // 1. Total Revenue (Current 30 Days)
    const revenueResult = (await db.booking.aggregate({
        _sum: { totalAmount: true },
        where: {
            bookingStatus: 'confirmed',
            createdAt: { gte: thirtyDaysAgo },
        },
    })) as any;

    // 2. Total Bookings (Current 30 Days)
    const bookingsCount = await db.booking.count({
        where: {
            createdAt: { gte: thirtyDaysAgo },
        },
    });

    // 3. New Inquiries (Current 30 Days)
    const inquiriesCount = await db.inquiry.count({
        where: {
            createdAt: { gte: thirtyDaysAgo },
            status: 'new',
        },
    });

    // 4. Occupancy Rate (Rough calculation for today)
    const activeRooms = await db.room.count({ where: { isActive: true } });

    const occupiedRoomsToday = await db.booking.count({
        where: {
            bookingStatus: 'confirmed',
            checkInDate: { lte: now },
            checkOutDate: { gt: now },
        },
    });

    const occupancyRate = activeRooms > 0 ? (occupiedRoomsToday / activeRooms) * 100 : 0;

    return NextResponse.json({
        metrics: {
            totalRevenue: Number(revenueResult._sum.totalAmount || 0),
            totalBookings: bookingsCount,
            newInquiries: inquiriesCount,
            occupancyRate: Number(occupancyRate.toFixed(1)),
            activeRooms,
            occupiedRoomsToday
        },
    });
});
