import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';
import { withErrorHandler } from '@/lib/api-error';

// Fetch Active Gallery Images
export const GET = withErrorHandler(async (request: Request) => {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const whereClause: any = { isActive: true };
    if (category) {
        whereClause.category = category;
    }

    const images = await db.galleryImage.findMany({
        where: whereClause,
        orderBy: { displayOrder: 'asc' }, // Defaults to ascending order
    });

    return NextResponse.json(images);
});

// Create a new Gallery Image Record
export const POST = withErrorHandler(async (request: Request) => {
    const body = await request.json();
    const { title, imageUrl, category, displayOrder, isActive } = body;

    if (!imageUrl) {
        return NextResponse.json(
            { error: 'Bad Request', message: 'imageUrl is required' },
            { status: 400 }
        );
    }

    const newImage = await db.galleryImage.create({
        data: {
            title,
            imageUrl,
            category,
            displayOrder: displayOrder || 0,
            isActive: isActive !== undefined ? isActive : true,
        },
    });

    return NextResponse.json(newImage, { status: 201 });
});
