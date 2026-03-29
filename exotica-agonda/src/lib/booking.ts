import { z } from 'zod';
import db from './mongodb';

// Validation Schema for incoming Booking requests
export const BookingSchema = z.object({
    roomId: z.string().min(1, "Room ID is required"), // Changed from uuid() to general string for MongoDB
    guestName: z.string().min(2, "Name must be at least 2 characters").max(255),
    guestEmail: z.string().email("Invalid email address"),
    guestPhone: z.string().min(10, "Phone number is too short").max(20),
    checkInDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid check-in date format",
    }),
    checkOutDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid check-out date format",
    }),
    numberOfGuests: z.number().int().min(1, "Must have at least 1 guest"),
    specialRequests: z.string().optional(),
}).refine(
    (data) => new Date(data.checkInDate) < new Date(data.checkOutDate),
    {
        message: "Check-out date must be after check-in date",
        path: ["checkOutDate"],
    }
);

/**
 * Generates a unique booking reference ID formatting. Example: EXO-20260304-4B2A
 */
export function generateBookingReference(): string {
    const dateStr = new Date().toISOString().split('T')[0].replace(/-/g, ''); // YYYYMMDD
    const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `EXO-${dateStr}-${randomChars}`;
}

/**
 * Checks if a room is available for the given dates using a transaction-safe query approach.
 * Returns true if available, false if there's a double booking conflict.
 */
export async function isRoomAvailable(roomId: string, checkInDate: Date, checkOutDate: Date): Promise<boolean> {
    const conflictingBookings = await db.booking.count({
        where: {
            roomId,
            bookingStatus: 'confirmed', // Assuming only confirmed bookings block dates; can include 'pending' if holding
            AND: [
                { checkInDate: { lt: checkOutDate } },   // existing overlaps start before new ends
                { checkOutDate: { gt: checkInDate } },   // and existing ends after new starts
            ],
        },
    });

    return conflictingBookings === 0;
}
