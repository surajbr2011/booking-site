import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';
import { withErrorHandler } from '@/lib/api-error';

// Simplistic CSV export for Bookings. In a real app we might use a robust package like 'json2csv'
export const GET = withErrorHandler(async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'bookings'; // bookings, inquiries, rooms

    if (type === 'bookings') {
        const bookings = await db.booking.findMany({
            orderBy: { createdAt: 'desc' },
            include: { room: { select: { roomName: true } } }
        });

        const csvHeaders = ['ID', 'Reference', 'Guest Name', 'Email', 'Phone', 'Room', 'Check-In', 'Check-Out', 'Status', 'Total'];
        const csvRows = bookings.map(b => [
            b.id,
            b.bookingReference,
            `"${b.guestName}"`,
            `"${b.guestEmail}"`,
            b.guestPhone,
            `"${b.room.roomName}"`,
            b.checkInDate.toISOString().split('T')[0],
            b.checkOutDate.toISOString().split('T')[0],
            b.bookingStatus,
            b.totalAmount.toString()
        ].join(','));

        const csvContent = [csvHeaders.join(','), ...csvRows].join('\n');

        return new NextResponse(csvContent, {
            status: 200,
            headers: {
                'Content-Type': 'text/csv',
                'Content-Disposition': `attachment; filename="bookings-export-${new Date().toISOString().split('T')[0]}.csv"`
            }
        });
    }

    return NextResponse.json({ error: 'Unsupported export type' }, { status: 400 });
});
