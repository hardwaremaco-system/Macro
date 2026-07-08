// src/app/api/cloudinary/sign/route.ts
import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

// Optional but recommended: Explicitly configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { folder } = body;

    // Ensure the secret is available
    if (!process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: 'Cloudinary API Secret is missing' },
        { status: 500 }
      );
    }

    // 1. Generate a Unix timestamp (Required by Cloudinary)
    const timestamp = Math.round(new Date().getTime() / 1000);

    // 2. Define the exact parameters we are signing
    const paramsToSign = {
      timestamp: timestamp,
      folder: folder || 'macro_hardware/products',
    };

    // 3. Generate the secure signature
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    // 4. Return EVERYTHING the frontend needs to complete the upload
    return NextResponse.json({ 
      signature,
      timestamp,
      folder: paramsToSign.folder,
      cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
    });

  } catch (error) {
    console.error('Error generating signature:', error);
    return NextResponse.json(
      { error: 'Failed to generate signature' },
      { status: 500 }
    );
  }
}
