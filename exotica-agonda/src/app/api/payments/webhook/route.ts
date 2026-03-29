import { NextResponse } from 'next/server';
import crypto from 'crypto';
import db from '@/lib/mongodb';
import { sendEmail, AdminNewInquiryTemplate } from '@/lib/email'; // Reusing email utility
import { withErrorHandler } from '@/lib/api-error';

// Helper template for successful booking
const GuestBookingSuccessTemplate = (name: string, reference: string, checkIn: string) => `
  <h2>Booking Confirmed!</h2>
  <p>Dear ${name},</p>
  <p>Your payment was successful and your booking <strong>${reference}</strong> is officially confirmed.</p>
  <p>We look forward to hosting you on ${checkIn}.</p>
  <br/>
  <p>The Exotica Agonda</p>
`;

export const POST = withErrorHandler(async (request: Request) => {
    const body = await request.json();
    const signature = request.headers.get('x-razorpay-signature');

    if (!signature) {
        return NextResponse.json({ error: 'Missing Razorpay signature' }, { status: 400 });
    }

    const payloadString = JSON.stringify(body);
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_webhook_secret';

    const expectedSignature = crypto
        .createHmac('sha256', secret)
        .update(payloadString)
        .digest('hex');

    if (expectedSignature !== signature) {
        // SECURITY: This logs payment failure/attempted tamper
        console.warn('Invalid payment webhook signature received.');
        return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Process the webhook event
    const event = body.event;

    if (event === 'payment.captured' || event === 'order.paid') {
        const paymentEntity = body.payload.payment.entity;
        // Notes usually contain metadata like our receipt or bookingReference
        const orderId = paymentEntity.order_id;
        const paymentId = paymentEntity.id;
        // Finding our reference might require querying order if not in payment entity directly,
        // but typically we can pass it in notes or rely on receipt matching.

        // For simplicity, let's assume we linked order_id back to receipt or have a robust lookup
        // In a real app we'd query by orderId, but here's a placeholder update logic:
        // This logs the successful transaction
        console.log(`Payment success handler triggered for payment: ${paymentId}`);

        // If we had the booking reference in notes:
        const bookingRef = paymentEntity.notes?.receipt;

        if (bookingRef) {
            const updatedBooking = await db.booking.update({
                where: { bookingReference: bookingRef },
                data: {
                    paymentStatus: 'paid',
                    bookingStatus: 'confirmed',
                    paymentId: paymentId,
                }
            });

            // Send automated booking confirmation email
            try {
                await sendEmail({
                    to: updatedBooking.guestEmail,
                    subject: `Booking Confirmed: ${bookingRef}`,
                    html: GuestBookingSuccessTemplate(
                        updatedBooking.guestName,
                        bookingRef,
                        updatedBooking.checkInDate.toISOString().split('T')[0]
                    )
                });
            } catch (e) {
                console.error("Failed to send confirmation email", e);
            }
        }

        return NextResponse.json({ status: 'ok' });
    }

    if (event === 'payment.failed') {
        // Payment failure handler
        const paymentEntity = body.payload.payment.entity;
        console.warn(`Payment failed: ${paymentEntity.id}`);

        // Log failure and update status if applicable
        const bookingRef = paymentEntity.notes?.receipt;
        if (bookingRef) {
            await db.booking.update({
                where: { bookingReference: bookingRef },
                data: {
                    paymentStatus: 'failed',
                    bookingStatus: 'cancelled',
                }
            });
        }
        return NextResponse.json({ status: 'ok' });
    }

    return NextResponse.json({ status: 'handled' });
});
