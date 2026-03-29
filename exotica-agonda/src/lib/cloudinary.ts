import { v2 as cloudinary } from 'cloudinary';

// Cloudinary will automatically pick up the CLOUDINARY_URL environment variable if set.
// Otherwise, we can configure it explicitly.
cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

export const uploadImage = async (fileBuffer: Buffer, folder: string = 'exotica'): Promise<any> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder,
                resource_type: 'image',
                // Optional image optimization parameters
                quality: 'auto',
                fetch_format: 'auto',
            },
            (error, result) => {
                if (error) {
                    console.error("Cloudinary Upload Error:", error);
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        uploadStream.end(fileBuffer);
    });
};

export const deleteImage = async (publicId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
            if (error) {
                console.error("Cloudinary Delete Error:", error);
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
};

export default cloudinary;
