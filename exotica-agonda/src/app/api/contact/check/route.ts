import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';
import { withErrorHandler } from '@/lib/api-error';

// Check the status of specific inquiries by evaluating their IDs.
export const POST = withErrorHandler(async (request: Request) => {
    const body = await request.json();
    const { inquiryIds } = body;

    if (!Array.isArray(inquiryIds) || inquiryIds.length === 0) {
        return NextResponse.json([], { status: 200 });
    }

    // Only return inquiries that have been replied to so we can pop them up 
    const replies = await db.inquiry.findMany({
        where: {
            id: { in: inquiryIds },
            status: 'replied',
            replyMessage: { not: null }
        },
        select: {
            id: true,
            status: true,
            replyMessage: true,
            respondedAt: true
        }
    });

    return NextResponse.json(replies);
});
