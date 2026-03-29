import { NextResponse } from 'next/server';
import db from '@/lib/mongodb';
import { withErrorHandler } from '@/lib/api-error';

// PATCH /api/admin/gallery/[id] — update item (category, title, displayOrder, etc)
export const PATCH = withErrorHandler(async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    const { id } = await params;
    const body = await request.json();
    const { title, imageUrl, category, displayOrder, isActive } = body;

    const existing = await db.galleryImage.findUnique({ where: { id } });
    if (!existing) {
        return NextResponse.json({ error: 'Not Found', message: 'Image not found' }, { status: 404 });
    }

    const updated = await db.galleryImage.update({
        where: { id },
        data: {
            title: title !== undefined ? title : existing.title,
            imageUrl: imageUrl !== undefined ? imageUrl : existing.imageUrl,
            category: category !== undefined ? category : existing.category,
            displayOrder: displayOrder !== undefined ? displayOrder : existing.displayOrder,
            isActive: isActive !== undefined ? isActive : existing.isActive,
        },
    });

    return NextResponse.json(updated);
});

// DELETE /api/admin/gallery/[id] — remove image
export const DELETE = withErrorHandler(async (
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) => {
    const { id } = await params;

    const existing = await db.galleryImage.findUnique({ where: { id } });
    if (!existing) {
        return NextResponse.json({ error: 'Not Found', message: 'Image not found' }, { status: 404 });
    }

    await db.galleryImage.delete({ where: { id } });

    return NextResponse.json({ message: 'Gallery image deleted successfully' });
});
