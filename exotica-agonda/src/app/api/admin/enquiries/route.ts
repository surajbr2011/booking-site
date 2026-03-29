import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

// GET /api/admin/enquiries — fetch all inquiries (newest first)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const whereClause: any = {};
        if (status && status !== 'all') {
            whereClause.status = status;
        }

        const inquiries = await db.inquiry.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ data: inquiries });
    } catch (error) {
        console.error('[Admin Enquiries] GET error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error', message: 'Failed to fetch enquiries' },
            { status: 500 }
        );
    }
}
