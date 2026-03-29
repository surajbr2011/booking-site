import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';
import { withErrorHandler } from '@/lib/api-error';
import { applyRateLimit } from '@/lib/rate-limit';

// Fetch all published content pages
export const GET = withErrorHandler(async (request: Request) => {
    // Apply a gentle rate limit of 30 requests per minute per IP
    const rateLimitError = await applyRateLimit(request, 30);
    if (rateLimitError) return rateLimitError;

    const pages = await db.contentPage.findMany({
        where: { isPublished: true },
        orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(pages);
});

// Create a new content page
export const POST = withErrorHandler(async (request: Request) => {
    const rateLimitError = await applyRateLimit(request, 10);
    if (rateLimitError) return rateLimitError;

    const body = await request.json();
    const { pageSlug, pageTitle, content, metaDescription, metaKeywords, isPublished } = body;

    if (!pageSlug || !pageTitle) {
        return NextResponse.json(
            { error: 'Bad Request', message: 'pageSlug and pageTitle are required' },
            { status: 400 }
        );
    }

    const newPage = await db.contentPage.create({
        data: {
            pageSlug,
            pageTitle,
            content,
            metaDescription,
            metaKeywords,
            isPublished: isPublished !== undefined ? isPublished : true,
        },
    });

    return NextResponse.json(newPage, { status: 201 });
});
