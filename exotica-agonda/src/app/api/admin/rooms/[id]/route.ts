import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';
import { withErrorHandler } from '@/lib/api-error';

// Retrieve specific room details
export const GET = withErrorHandler(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const room = await db.room.findUnique({
        where: { id },
    });

    if (!room) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    return NextResponse.json(room);
});

// Update specific room details
export const PATCH = withErrorHandler(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const body = await request.json();

    const updatedRoom = await db.room.update({
        where: { id },
        data: {
            ...(body.roomName && { roomName: body.roomName }),
            ...(body.category && { category: body.category }),
            ...(body.roomType && { roomType: body.roomType }),
            ...(body.description && { description: body.description }),
            ...(body.basePrice && { basePrice: parseFloat(body.basePrice) }),
            ...(body.maxOccupancy && { maxOccupancy: parseInt(body.maxOccupancy) }),
            ...(body.amenities && { amenities: body.amenities }),
            ...(body.images && { images: body.images }),
            ...(body.isActive !== undefined && { isActive: body.isActive }),
        },
    });

    console.log(`[Admin Activity] Updated room: ${updatedRoom.roomName}`);

    return NextResponse.json(updatedRoom);
});

// Delete a room
// Note: Only soft delete (isActive=false) is recommended in production if bookings exist.
export const DELETE = withErrorHandler(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    // First check if there are any bookings attached to prevent constraint violations
    const bookingCount = await db.booking.count({
        where: { roomId: id }
    });

    if (bookingCount > 0) {
        // Soft Delete alternative instead of failing immediately
        await db.room.update({
            where: { id },
            data: { isActive: false }
        });
        console.log(`[Admin Activity] Soft deleted (deactivated) room ${id} due to existing bookings.`);
        return NextResponse.json({
            message: 'Room deactivated successfully. Could not be permanently deleted because it has upcoming/past bookings associated with it.'
        });
    }

    await db.room.delete({
        where: { id },
    });

    console.log(`[Admin Activity] Permanently deleted room ${id}`);

    return NextResponse.json({ message: 'Room deleted successfully' });
});
