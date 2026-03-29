import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const POST = async (request: Request) => {
    try {
        // Check if Cloudinary is configured
        if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            return NextResponse.json(
                { error: 'Cloudinary is not configured. Please add CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, and NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME to your .env file.' },
                { status: 503 }
            );
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folder = (formData.get('folder') as string) || 'exotica-hotel/rooms';

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
        }

        // Convert to base64 for Cloudinary upload
        const bytes = await file.arrayBuffer();
        const base64 = Buffer.from(bytes).toString('base64');
        const dataURI = `data:${file.type};base64,${base64}`;

        const result = await cloudinary.uploader.upload(dataURI, {
            folder,
            transformation: [
                { width: 1200, height: 800, crop: 'fill', gravity: 'auto' },
                { quality: 'auto:good' },
                { format: 'webp' },
            ],
        });

        return NextResponse.json({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
        });
    } catch (error: any) {
        console.error('[Upload] Cloudinary error:', error);
        return NextResponse.json(
            { error: error?.message || 'Upload failed' },
            { status: 500 }
        );
    }
};
