import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // Pagination
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        // Filters
        const category = searchParams.get('category');
        const roomType = searchParams.get('roomType');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const minOccupancy = searchParams.get('occupancy');
        const checkInDateStr = searchParams.get('checkInDate');
        const checkOutDateStr = searchParams.get('checkOutDate');

        // Base query wrapper
        const whereClause: any = { isActive: true };

        if (category) whereClause.category = category;
        if (roomType) whereClause.roomType = roomType;
        if (minOccupancy) whereClause.maxOccupancy = { gte: parseInt(minOccupancy) };

        if (minPrice || maxPrice) {
            whereClause.basePrice = {};
            if (minPrice) whereClause.basePrice.gte = parseFloat(minPrice);
            if (maxPrice) whereClause.basePrice.lte = parseFloat(maxPrice);
        }

        // Availability Filter
        if (checkInDateStr && checkOutDateStr) {
            const checkInDate = new Date(checkInDateStr);
            const checkOutDate = new Date(checkOutDateStr);

            // Fetch rooms with conflicting bookings
            const conflictingBookings = await db.booking.findMany({
                where: {
                    bookingStatus: 'confirmed',
                    checkInDate: { lt: checkOutDate },
                    checkOutDate: { gt: checkInDate },
                }
            });

            const excludedRoomIds = conflictingBookings.map((b: any) => b.roomId);
            if (excludedRoomIds.length > 0) {
                whereClause.id = { notIn: excludedRoomIds };
            }
        }

        const [rooms, totalCount] = await Promise.all([
            db.room.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { basePrice: 'asc' },
            }),
            db.room.count({ where: whereClause }),
        ]);

        return NextResponse.json({
            data: rooms,
            meta: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit),
            },
        });
    } catch (error) {
        console.error('Error fetching rooms:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'Failed to fetch rooms' },
            { status: 500 }
        );
    }
}
