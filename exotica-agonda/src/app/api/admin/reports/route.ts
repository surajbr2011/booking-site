import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';
import { withErrorHandler } from '@/lib/api-error';
import { withSecurity } from '@/lib/api-security';

// Complex aggregation query API to feed advanced admin charts
export const GET = withSecurity(withErrorHandler(async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'revenue-by-month'; // default aggregation

    if (type === 'revenue-by-month') {
        // Generate an aggregated array of the past 12 months using raw grouping 
        // or Prisma's groupBy depending on specific DB provider support. Let's do a reliable
        // in-memory grouping over the past year's confirmed bookings for robust compatibility.

        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        const pastYearBookings = await db.booking.findMany({
            where: {
                bookingStatus: 'confirmed',
                createdAt: { gte: oneYearAgo },
            },
            select: {
                totalAmount: true,
                createdAt: true,
            }
        });

        const monthlyRevenue: Record<string, number> = {};

        pastYearBookings.forEach((b) => {
            // Create 'YYYY-MM' key
            const monthKey = b.createdAt.toISOString().slice(0, 7);
            if (!monthlyRevenue[monthKey]) monthlyRevenue[monthKey] = 0;
            monthlyRevenue[monthKey] += Number(b.totalAmount);
        });

        // Sort chronologically and format
        const sortedData = Object.entries(monthlyRevenue)
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
            .map(([month, revenue]) => ({ month, revenue }));

        return NextResponse.json({ data: sortedData });
    }

    return NextResponse.json({ error: 'Unsupported aggregation type' }, { status: 400 });
}));
