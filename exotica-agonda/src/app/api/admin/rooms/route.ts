import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';
import { withErrorHandler } from '@/lib/api-error';

// Fetch all rooms (including inactive) for admin viewing
export const GET = withErrorHandler(async () => {
    const rooms = await db.room.findMany({
        orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(rooms);
});

// Create a new room
export const POST = withErrorHandler(async (request: Request) => {
    const body = await request.json();
    const {
        roomNumber,
        roomName,
        category,
        roomType,
        description,
        basePrice,
        maxOccupancy,
        amenities,
        isActive,
        images
    } = body;

    const newRoom = await db.room.create({
        data: {
            roomNumber: roomNumber || `RM-${Date.now()}`,
            roomName,
            category: category || 'Standard',
            roomType,
            description,
            basePrice: parseFloat(basePrice),
            maxOccupancy: parseInt(maxOccupancy),
            amenities: amenities || [],
            isActive: isActive !== undefined ? isActive : true,
            images: images || [],
        },
    });

    console.log(`[Admin Activity] Created new room: ${newRoom.roomName}`);

    return NextResponse.json(newRoom, { status: 201 });
});
