import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

// GET /api/admin/inquiries
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');

        const whereClause: any = {};
        if (status && status !== 'all') whereClause.status = status;

        const inquiries = await db.inquiry.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ data: inquiries });
    } catch (error: any) {
        console.error('[Admin Inquiries] GET error:', error);
        console.error('Error stack:', error.stack);
        return NextResponse.json({ error: 'Failed to fetch inquiries', message: error.message }, { status: 500 });
    }
}

// DELETE /api/admin/inquiries — bulk delete by ids, or delete all
export async function DELETE(request: Request) {
    try {
        const body = await request.json().catch(() => ({}));
        const ids: string[] = body?.ids || [];

        if (ids.length > 0) {
            // Delete specific IDs
            await db.inquiry.deleteMany({ where: { id: { in: ids } } });
            return NextResponse.json({ message: `${ids.length} enquiries deleted successfully` });
        } else {
            // Delete ALL
            const result = await db.inquiry.deleteMany({});
            return NextResponse.json({ message: `All ${result.count} enquiries deleted` });
        }
    } catch (error: any) {
        console.error('[Admin Inquiries] DELETE error:', error);
        console.error('Error stack:', error.stack);
        return NextResponse.json({
            error: 'Failed to delete inquiries',
            message: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}
