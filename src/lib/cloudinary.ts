// src/lib/cloudinary.ts
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface CloudinaryUploadResponse {
  publicId: string;
  secureUrl: string;
}

/**
 * Server action / utility to upload base64 images directly to Cloudinary
 * Automatically optimizes and groups media into folders
 */
export async function uploadImageToCloudinary(
  base64String: string,
  folder: 'products' | 'categories' | 'promotions' | 'events' | 'gallery'
): Promise<CloudinaryUploadResponse> {
  try {
    const uploadResult = await cloudinary.uploader.upload(base64String, {
      folder: `macro_hardware/${folder}`,
      allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
      transformation: [{ width: 800, height: 800, crop: 'limit', quality: 'auto:good' }],
    });

    return {
      publicId: uploadResult.public_id,
      secureUrl: uploadResult.secure_url,
    };
  } catch (error) {
    console.error('Cloudinary upload failure:', error);
    throw new Error('Media asset upload failed.');
  }
}

export { cloudinary };
