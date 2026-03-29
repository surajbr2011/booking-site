import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';
import { withErrorHandler } from '@/lib/api-error';
import { BookingSchema, generateBookingReference } from '@/lib/booking';
import { sendEmail, BookingConfirmationTemplate, AdminBookingNotificationTemplate } from '@/lib/email';
import { bookingRateLimit, getClientIP } from '@/lib/rate-limit';

export const POST = withErrorHandler(async (request: Request) => {
    // Rate limit: max 10 booking attempts per IP per hour
    const ip = getClientIP(request);
    const rl = bookingRateLimit(ip);
    if (!rl.success) {
        return NextResponse.json(
            { error: 'Too Many Requests', message: 'Too many booking attempts from this IP. Please try again later.' },
            { status: 429, headers: { 'Retry-After': String(Math.ceil((rl.resetTime - Date.now()) / 1000)) } }
        );
    }

    const body = await request.json();

    // Validate request body using Zod schema
    const validationResult = BookingSchema.safeParse(body);
    if (!validationResult.success) {
        return NextResponse.json(
            { error: 'Validation Error', details: validationResult.error.format() },
            { status: 400 }
        );
    }

    const {
        roomId,
        guestName,
        guestEmail,
        guestPhone,
        checkInDate: checkInDateStr,
        checkOutDate: checkOutDateStr,
        numberOfGuests,
        specialRequests,
    } = validationResult.data;

    // Verify the room actually exists
    const room = (await db.room.findUnique({
        where: { id: roomId, isActive: true },
    })) as any;

    if (!room) {
        return NextResponse.json({ error: 'Room not found or inactive' }, { status: 404 });
    }

    if (numberOfGuests > room.maxOccupancy) {
        return NextResponse.json({ error: `Room maximum occupancy is ${room.maxOccupancy}` }, { status: 400 });
    }

    const checkInDate = new Date(checkInDateStr);
    const checkOutDate = new Date(checkOutDateStr);

    // Calculate pricing (Basic calculation logic, can be expanded later)
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const guestPrice = numberOfGuests > 1 ? (numberOfGuests - 1) * 1000 : 0;
    const totalAmount = (parseFloat(room.basePrice.toString()) + guestPrice) * diffDays;

    // Multi-step check and insert (Simplified without sessions for now)
    try {
        // 1. Double Booking Check
        const conflictingBookings = await db.booking.findMany({
            where: {
                roomId,
                bookingStatus: 'confirmed',
                checkInDate: { lt: checkOutDate },
                checkOutDate: { gt: checkInDate },
            }
        });

        if (conflictingBookings.length > 0) {
            console.warn(`[Booking Conflict] Room ${roomId} is already booked for these dates.`);
            return NextResponse.json(
                { error: 'Conflict', message: 'The room is no longer available for the selected dates' },
                { status: 409 }
            );
        }

        // 2. Booking Reference Generation
        const reference = generateBookingReference();

        // 3. Create Booking Record
        const booking = await db.booking.create({
            data: {
                roomId,
                bookingReference: reference,
                guestName,
                guestEmail,
                guestPhone,
                checkInDate,
                checkOutDate,
                numberOfGuests,
                totalAmount,
                paymentStatus: 'pending',
                bookingStatus: 'pending',
                specialRequests,
                createdAt: new Date(),
            },
        });

        return NextResponse.json(
            { message: 'Booking created successfully', data: booking },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Booking Creation Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'Failed to create booking' },
            { status: 500 }
        );
    }
});

