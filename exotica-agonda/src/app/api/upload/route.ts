import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';
import { withErrorHandler } from '@/lib/api-error';
import db from '@/lib/mongodb'; // In case we want to immediately tie the upload to a DB record, but we'll keep it pure for now

export const POST = withErrorHandler(async (request: Request) => {
    const formData = await request.formData();
    const file = formData.get('image') as File | null;
    const folder = formData.get('folder') as string || 'exotica_gallery';

    if (!file) {
        return NextResponse.json(
            { error: 'Bad Request', message: 'No image file provided' },
            { status: 400 }
        );
    }

    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary (image optimization is handled in the utility via quality=auto)
    const result = await uploadImage(buffer, folder);

    return NextResponse.json({
        message: 'Image uploaded successfully',
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        width: result.width,
        height: result.height,
    }, { status: 201 });
});
