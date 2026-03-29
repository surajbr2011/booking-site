import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';
import { withErrorHandler } from '@/lib/api-error';

// Calculates dynamic pricing without creating a booking
export const POST = withErrorHandler(async (request: Request) => {
    const body = await request.json();
    const { roomId, checkInDate: checkInDateStr, checkOutDate: checkOutDateStr } = body;

    if (!roomId || !checkInDateStr || !checkOutDateStr) {
        return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const room = await db.room.findUnique({
        where: { id: roomId },
        select: { basePrice: true }
    });

    if (!room) {
        return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const checkInDate = new Date(checkInDateStr);
    const checkOutDate = new Date(checkOutDateStr);

    if (checkInDate >= checkOutDate) {
        return NextResponse.json({ error: 'Check-out date must be after check-in date' }, { status: 400 });
    }

    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    // Example for dynamic calculations: e.g., adding taxes, weekend surges
    const baseTotal = parseFloat(room.basePrice.toString()) * diffDays;
    const taxes = baseTotal * 0.18; // 18% GST (India Example)
    const grandTotal = baseTotal + taxes;

    return NextResponse.json({
        nights: diffDays,
        basePricePerNight: parseFloat(room.basePrice.toString()),
        baseTotal,
        taxes,
        grandTotal,
    });
});
