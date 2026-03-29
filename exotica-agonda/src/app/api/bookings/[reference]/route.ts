import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';
import { withErrorHandler } from '@/lib/api-error';
import { sendEmail, BookingConfirmationTemplate, AdminBookingNotificationTemplate } from '@/lib/email';

export const GET = withErrorHandler(async (request: Request, { params }: { params: Promise<{ reference: string }> }) => {
    const { reference } = await params;

    const booking = (await db.booking.findUnique({
        where: { bookingReference: reference },
    })) as any;

    if (!booking) {
        return NextResponse.json({ error: 'Not Found', message: 'Booking not found' }, { status: 404 });
    }

    // Manual include: room
    if (booking.roomId) {
        booking.room = await db.room.findUnique({ where: { id: booking.roomId } });
    }

    return NextResponse.json(booking);
});

// Update Booking Status (e.g., from 'pending' to 'cancelled')
export const PATCH = withErrorHandler(async (request: Request, { params }: { params: Promise<{ reference: string }> }) => {
    const { reference } = await params;
    const body = await request.json();
    const { bookingStatus, paymentStatus, paymentId } = body;

    const existingBooking = await db.booking.findUnique({
        where: { bookingReference: reference },
    });

    if (!existingBooking) {
        return NextResponse.json({ error: 'Not Found', message: 'Booking not found' }, { status: 404 });
    }

    const updatedBooking = (await db.booking.update({
        where: { bookingReference: reference },
        data: {
            ...(bookingStatus && { bookingStatus }),
            ...(paymentStatus && { paymentStatus }),
            ...(paymentId && { paymentId }),
        },
    })) as any;

    if (updatedBooking && updatedBooking.roomId) {
        updatedBooking.room = await db.room.findUnique({ where: { id: updatedBooking.roomId } });
    }

    // If marked as confirmed, trigger the automated emails
    if (bookingStatus === 'confirmed' && updatedBooking.paymentStatus === 'paid') {
        const checkInDate = new Date(updatedBooking.checkInDate);
        const checkOutDate = new Date(updatedBooking.checkOutDate);
        
        const checkInStr = checkInDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
        const checkOutStr = checkOutDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
        
        const diff = checkOutDate.getTime() - checkInDate.getTime();
        const nights = Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));

        // Run email sending in background to avoid blocking the response
        setImmediate(async () => {
            try {
                // 1. Send Guest Confirmation
                await sendEmail({
                    to: updatedBooking.guestEmail,
                    subject: `Booking Confirmed: ${updatedBooking.bookingReference} - The Exotica Agonda`,
                    html: BookingConfirmationTemplate(
                        updatedBooking.guestName,
                        updatedBooking.bookingReference,
                        updatedBooking.room.roomName,
                        checkInStr,
                        checkOutStr,
                        nights,
                        Number(updatedBooking.totalAmount),
                        updatedBooking.numberOfGuests
                    )
                });

                // 2. Send Admin Notification
                const adminEmail = process.env.ADMIN_EMAIL || 'admin@exoticaagonda.com';
                await sendEmail({
                    to: adminEmail,
                    subject: `🏨 [New Booking] ${updatedBooking.bookingReference} - ${updatedBooking.guestName}`,
                    html: AdminBookingNotificationTemplate(
                        updatedBooking.guestName,
                        updatedBooking.guestEmail,
                        updatedBooking.bookingReference,
                        updatedBooking.room.roomName,
                        checkInStr,
                        checkOutStr,
                        Number(updatedBooking.totalAmount)
                    )
                });
            } catch (error) {
                console.error('[Booking Confirmation] Failed to dispatch emails:', error);
            }
        });
    }

    return NextResponse.json({
        message: 'Booking updated successfully',
        data: updatedBooking
    });
});
