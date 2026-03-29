import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';
import { withErrorHandler } from '@/lib/api-error';
import { razorpay } from '@/lib/razorpay';

export const POST = withErrorHandler(async (request: Request) => {
    const body = await request.json();
    const { bookingReference } = body;

    if (!bookingReference) {
        return NextResponse.json({ error: 'bookingReference is required' }, { status: 400 });
    }

    // Find the pending booking
    const booking = await db.booking.findUnique({
        where: { bookingReference },
    });

    if (!booking) {
        return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    // Amount is in generic smaller units (e.g. paise for INR). 
    // Assuming totalAmount is standard rupees/dollars.
    const amountInSmallestUnit = Math.round(parseFloat(booking.totalAmount.toString()) * 100);

    // Create Razorpay Order
    const options = {
        amount: amountInSmallestUnit,
        currency: 'INR', // Specific to Razorpay typically, but configurable
        receipt: bookingReference,
        notes: {
            guestEmail: booking.guestEmail,
            room: booking.roomId,
        }
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
        message: 'Payment order created successfully',
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
    }, { status: 201 });
});
