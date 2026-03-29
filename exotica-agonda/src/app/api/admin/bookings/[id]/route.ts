import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';
import { withErrorHandler } from '@/lib/api-error';
import { sendEmail } from '@/lib/email';

const AdminActionEmailTemplate = (name: string, reference: string, newStatus: string) => `
  <h2>Booking Status Update</h2>
  <p>Dear ${name},</p>
  <p>Your booking <strong>${reference}</strong> status has been updated to: <strong>${newStatus.toUpperCase()}</strong>.</p>
  <br/>
  <p>If you have any questions, please reply to this email.</p>
  <p>The Exotica Agonda Team</p>
`;

// Retrieve a single booking for admin view
export const GET = withErrorHandler(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const booking = await db.booking.findUnique({
    where: { id },
    include: { room: true },
  });

  if (!booking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  return NextResponse.json(booking);
});

// Update booking details or status (e.g. canceling, modifying dates, overriding total)
export const PATCH = withErrorHandler(async (request: Request, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const body = await request.json();
  const { bookingStatus, paymentStatus, specialRequests, notifyGuest } = body;

  const existingBooking = await db.booking.findUnique({
    where: { id },
  });

  if (!existingBooking) {
    return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
  }

  // Update the booking record
  const updatedBooking = await db.booking.update({
    where: { id },
    data: {
      ...(bookingStatus && { bookingStatus }),
      ...(paymentStatus && { paymentStatus }),
      ...(specialRequests && { specialRequests }),
    },
  });

  // Admin Logging Hook (Future proofing for Thursday tasks)
  console.log(`[Admin Activity] Booking ${id} updated status to ${bookingStatus} / ${paymentStatus}`);

  // Optionally trigger email notification if status fundamentally changed and admin requested it
  if (notifyGuest && bookingStatus && bookingStatus !== existingBooking.bookingStatus) {
    try {
      await sendEmail({
        to: updatedBooking.guestEmail,
        subject: `Exotica Agonda - Booking Update: ${updatedBooking.bookingReference}`,
        html: AdminActionEmailTemplate(updatedBooking.guestName, updatedBooking.bookingReference, bookingStatus),
      });
    } catch (e) {
      console.error("Failed to send guest notification on admin update.", e);
    }
  }

  return NextResponse.json({
    message: 'Booking updated successfully',
    booking: updatedBooking
  });
});
