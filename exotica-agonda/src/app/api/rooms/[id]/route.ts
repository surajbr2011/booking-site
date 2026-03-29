import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const room = await db.room.findUnique({
            where: {
                id: id,
            },
        });

        if (!room) {
            return NextResponse.json(
                { error: 'Not Found', message: 'Room not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(room);
    } catch (error) {
        console.error(`Error fetching room:`, error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'Failed to fetch room details' },
            { status: 500 }
        );
    }
}
